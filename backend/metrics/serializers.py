"""
serializers.py — MetricSerializer
Convertit les objets Metric en JSON pour l'API REST
"""

from rest_framework import serializers
from .models import Metric


class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Metric
        fields = ['id', 'metric_type', 'value', 'timestamp', 'metadata', 'created_at']


class MetricStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques agrégées par type"""
    metric_type = serializers.CharField()
    avg         = serializers.FloatField()
    min         = serializers.FloatField()
    max         = serializers.FloatField()
    count       = serializers.IntegerField()
    latest      = serializers.FloatField()
