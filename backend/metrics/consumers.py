"""
consumers.py — MetricConsumer
Gère les connexions WebSocket et diffuse les métriques en temps réel
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class MetricConsumer(AsyncWebsocketConsumer):

    GROUP_NAME = 'metrics_realtime'

    async def connect(self):
        """Client connecté → rejoindre le groupe de broadcast"""
        await self.channel_layer.group_add(
            self.GROUP_NAME,
            self.channel_name
        )
        await self.accept()
        print(f'[WS] Client connecté : {self.channel_name}')

    async def disconnect(self, close_code):
        """Client déconnecté → quitter le groupe"""
        await self.channel_layer.group_discard(
            self.GROUP_NAME,
            self.channel_name
        )
        print(f'[WS] Client déconnecté : {self.channel_name}')

    async def receive(self, text_data):
        """Message reçu du client (optionnel pour l'instant)"""
        pass

    async def metric_update(self, event):
        """
        Handler appelé quand le générateur envoie un message au groupe.
        Transmet la donnée au client WebSocket.
        """
        await self.send(text_data=json.dumps(event['data']))
