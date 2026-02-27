"""
views.py — API REST Metrics
Endpoints pour récupérer les métriques historiques
"""

from django.utils import timezone
from datetime import timedelta

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Min, Max, Count

from .models import Metric
from .serializers import MetricSerializer, MetricStatsSerializer


# Mapping période → timedelta
PERIOD_MAP = {
    '1h':  timedelta(hours=1),
    '24h': timedelta(hours=24),
    '7d':  timedelta(days=7),
    '30d': timedelta(days=30),
}


class MetricViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet en lecture seule — les données sont créées par le générateur (Phase 4)

    GET /api/metrics/          → liste paginée
    GET /api/metrics/{id}/     → détail d'une métrique
    GET /api/metrics/latest/   → dernière valeur par type
    GET /api/metrics/stats/    → statistiques agrégées
    """

    serializer_class = MetricSerializer

    def get_queryset(self):
        qs = Metric.objects.all()

        # Filtre par type
        metric_type = self.request.query_params.get('type')
        if metric_type:
            qs = qs.filter(metric_type=metric_type)

        # Filtre par période
        period = self.request.query_params.get('period', '24h')
        delta  = PERIOD_MAP.get(period, PERIOD_MAP['24h'])
        since  = timezone.now() - delta
        qs     = qs.filter(timestamp__gte=since)

        return qs

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """
        Retourne la dernière valeur pour chaque type de métrique.
        GET /api/metrics/latest/
        """
        result = {}
        for metric_type, _ in Metric.METRIC_TYPES:
            metric = (
                Metric.objects
                .filter(metric_type=metric_type)
                .order_by('-timestamp')
                .first()
            )
            if metric:
                result[metric_type] = MetricSerializer(metric).data

        return Response(result)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Retourne les statistiques agrégées (avg, min, max) par type.
        GET /api/metrics/stats/?period=24h
        """
        period = request.query_params.get('period', '24h')
        delta  = PERIOD_MAP.get(period, PERIOD_MAP['24h'])
        since  = timezone.now() - delta

        stats = []
        for metric_type, _ in Metric.METRIC_TYPES:
            qs = Metric.objects.filter(
                metric_type=metric_type,
                timestamp__gte=since
            )
            agg = qs.aggregate(
                avg=Avg('value'),
                min=Min('value'),
                max=Max('value'),
                count=Count('id'),
            )
            if agg['count']:
                latest = qs.order_by('-timestamp').values_list('value', flat=True).first()
                stats.append({
                    'metric_type': metric_type,
                    'avg':         round(agg['avg'], 2),
                    'min':         round(agg['min'], 2),
                    'max':         round(agg['max'], 2),
                    'count':       agg['count'],
                    'latest':      latest,
                })

        return Response(stats)
