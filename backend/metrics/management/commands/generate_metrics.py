"""
management/commands/generate_metrics.py
Génère des métriques réalistes en continu et les broadcast via WebSocket.
Usage : python manage.py generate_metrics
"""

import asyncio
import random
import json
from datetime import datetime, timezone

from django.core.management.base import BaseCommand
from channels.layers import get_channel_layer

from metrics.models import Metric
from metrics.consumers import MetricConsumer


# Configuration des métriques : valeur de base, variation max, unité
METRIC_CONFIG = {
    'visitors':  {'base': 150,  'variation': 20,  'min': 0,    'max': 500},
    'pageviews': {'base': 400,  'variation': 50,  'min': 0,    'max': 1500},
    'sales':     {'base': 15,   'variation': 5,   'min': 0,    'max': 100},
    'revenue':   {'base': 600,  'variation': 100, 'min': 0,    'max': 5000},
    'cpu':       {'base': 45,   'variation': 10,  'min': 0,    'max': 100},
    'memory':    {'base': 60,   'variation': 5,   'min': 0,    'max': 100},
    'requests':  {'base': 200,  'variation': 40,  'min': 0,    'max': 1000},
    'signups':   {'base': 5,    'variation': 3,   'min': 0,    'max': 50},
}

# Garde en mémoire la dernière valeur pour calculer la variation
_last_values = {k: v['base'] for k, v in METRIC_CONFIG.items()}


def generate_value(metric_type: str) -> tuple[float, float]:
    """
    Génère une nouvelle valeur réaliste en partant de la valeur précédente.
    Retourne (nouvelle_valeur, variation_par_rapport_à_la_précédente).
    """
    config    = METRIC_CONFIG[metric_type]
    last      = _last_values[metric_type]
    delta     = random.uniform(-config['variation'], config['variation'])
    new_value = round(max(config['min'], min(config['max'], last + delta)), 2)
    change    = round(new_value - last, 2)

    _last_values[metric_type] = new_value
    return new_value, change


async def broadcast_metrics(interval: int):
    """
    Boucle principale : génère et broadcast toutes les X secondes.
    """
    channel_layer = get_channel_layer()

    print(f'[Générateur] Démarrage — intervalle : {interval}s')
    print(f'[Générateur] WebSocket group : {MetricConsumer.GROUP_NAME}')
    print('─' * 50)

    while True:
        now = datetime.now(timezone.utc)

        for metric_type in METRIC_CONFIG:
            value, change = generate_value(metric_type)

            # 1. Sauvegarder en base de données
            await Metric.objects.acreate(
                metric_type=metric_type,
                value=value,
                timestamp=now,
                metadata={'change': change, 'generated': True},
            )

            # 2. Broadcaster via WebSocket à tous les clients connectés
            message = {
                'type':        'metric_update',
                'metric_type': metric_type,
                'value':       value,
                'change':      change,
                'timestamp':   now.isoformat(),
            }

            await channel_layer.group_send(
                MetricConsumer.GROUP_NAME,
                {
                    'type': 'metric_update',   # appelle consumer.metric_update()
                    'data': message,
                }
            )

        print(f'[{now.strftime("%H:%M:%S")}] Métriques envoyées — '
              f'visitors={_last_values["visitors"]} | '
              f'cpu={_last_values["cpu"]}% | '
              f'revenue={_last_values["revenue"]}€')

        await asyncio.sleep(interval)


class Command(BaseCommand):
    help = 'Génère des métriques en temps réel et les broadcast via WebSocket'

    def add_arguments(self, parser):
        parser.add_argument(
            '--interval', type=int, default=3,
            help='Intervalle en secondes entre chaque génération (défaut: 3)'
        )

    def handle(self, *args, **options):
        interval = options['interval']
        self.stdout.write(self.style.SUCCESS(
            f'Démarrage du générateur (intervalle={interval}s) — CTRL+C pour arrêter'
        ))
        asyncio.run(broadcast_metrics(interval))
