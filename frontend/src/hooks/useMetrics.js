/**
 * hooks/useMetrics.js
 * Gère l'état de toutes les métriques (WebSocket + historique API)
 */

import { useState, useEffect, useCallback } from 'react'
import { useWebSocket, WS_STATUS } from './useWebSocket'
import api from '../services/api'

const MAX_HISTORY_POINTS = 30  // Nombre de points affichés sur les charts

const INITIAL_METRICS = {
  visitors: { value: 0, change: 0, history: [] },
  pageviews: { value: 0, change: 0, history: [] },
  sales:    { value: 0, change: 0, history: [] },
  revenue:  { value: 0, change: 0, history: [] },
  cpu:      { value: 0, change: 0, history: [] },
  memory:   { value: 0, change: 0, history: [] },
  requests: { value: 0, change: 0, history: [] },
  signups:  { value: 0, change: 0, history: [] },
}

export function useMetrics() {
  const [metrics, setMetrics]   = useState(INITIAL_METRICS)
  const [period, setPeriod]     = useState('24h')
  const [loading, setLoading]   = useState(true)
  const { status, lastMessage } = useWebSocket()

  // Charger l'historique depuis l'API REST
  const loadHistory = useCallback(async (selectedPeriod) => {
    try {
      setLoading(true)
      const { data } = await api.get('/metrics/latest/')

      setMetrics(prev => {
        const updated = { ...prev }
        Object.entries(data).forEach(([type, metric]) => {
          if (updated[type]) {
            updated[type] = {
              ...updated[type],
              value: metric.value,
              change: metric.metadata?.change ?? 0,
            }
          }
        })
        return updated
      })
    } catch (e) {
      console.error('[Metrics] Erreur chargement historique', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger au montage et quand la période change
  useEffect(() => {
    loadHistory(period)
  }, [period, loadHistory])

  // Mettre à jour en temps réel via WebSocket
  useEffect(() => {
    if (!lastMessage) return

    const { metric_type, value, change, timestamp } = lastMessage

    setMetrics(prev => {
      if (!prev[metric_type]) return prev

      const history = [
        ...prev[metric_type].history,
        { time: new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), value }
      ].slice(-MAX_HISTORY_POINTS)

      return {
        ...prev,
        [metric_type]: { value, change, history }
      }
    })
  }, [lastMessage])

  return { metrics, status, period, setPeriod, loading }
}
