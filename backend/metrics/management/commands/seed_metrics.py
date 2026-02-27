"""
management/commands/seed_metrics.py
Commande pour peupler la base avec des données de test réalistes.
Usage : python manage.py seed_metrics
"""

import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from metrics.models import Metric


# Plages réalistes par type de métrique
METRIC_CONFIG = {
    'visitors':  (80,  300),
    'pageviews': (200, 900),
    'sales':     (5,   40),
    'revenue':   (150, 1200),
    'cpu':       (10,  85),
    'memory':    (30,  80),
    'requests':  (50,  400),
    'signups':   (1,   15),
}


class Command(BaseCommand):
    help = 'Peuple la base de données avec des métriques de test (dernières 24h)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--hours', type=int, default=24,
            help='Nombre d\'heures d\'historique à générer (défaut: 24)'
        )
        parser.add_argument(
            '--interval', type=int, default=5,
            help='Intervalle en minutes entre chaque point (défaut: 5)'
        )

    def handle(self, *args, **options):
        hours    = options['hours']
        interval = options['interval']
        now      = timezone.now()
        created  = 0

        self.stdout.write(f'Génération de {hours}h de données (intervalle: {interval}min)...')

        # Supprimer les anciennes données de seed
        Metric.objects.all().delete()

        # Générer les points dans le temps
        steps = int((hours * 60) / interval)
        for i in range(steps):
            timestamp = now - timedelta(minutes=i * interval)

            for metric_type, (low, high) in METRIC_CONFIG.items():
                # Légère variation progressive pour un rendu réaliste
                base  = random.uniform(low, high)
                noise = random.uniform(-0.05, 0.05) * base
                value = round(max(0, base + noise), 2)

                Metric.objects.create(
                    metric_type=metric_type,
                    value=value,
                    timestamp=timestamp,
                    metadata={'seeded': True},
                )
                created += 1

        self.stdout.write(self.style.SUCCESS(
            f'✅ {created} métriques créées ({steps} points x {len(METRIC_CONFIG)} types)'
        ))
