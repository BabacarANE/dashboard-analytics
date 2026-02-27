"""
models.py — Metric
Stocke toutes les métriques analytics en base de données
"""

import uuid
from django.db import models


class Metric(models.Model):

    METRIC_TYPES = [
        ('visitors',   'Visiteurs actifs'),
        ('pageviews',  'Pages vues'),
        ('sales',      'Ventes'),
        ('revenue',    'Revenus'),
        ('cpu',        'CPU (%)'),
        ('memory',     'Mémoire (%)'),
        ('requests',   'Requêtes/s'),
        ('signups',    'Inscriptions'),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES, db_index=True)
    value       = models.FloatField()
    timestamp   = models.DateTimeField(db_index=True)
    metadata    = models.JSONField(default=dict, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['metric_type', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.metric_type} = {self.value} @ {self.timestamp}"
