/**
 * components/ui/AlertSystem.jsx
 * Notifications automatiques si CPU/mémoire dépasse un seuil
 */

import { useState, useEffect } from 'react'

const THRESHOLDS = {
  cpu:     { warn: 70, label: 'CPU',     unit: '%' },
  memory:  { warn: 75, label: 'Mémoire', unit: '%' },
  visitors:{ warn: 250,label: 'Visiteurs',unit: '' },
}

let alertId = 0

export function useAlerts(metrics) {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    Object.entries(THRESHOLDS).forEach(([key, cfg]) => {
      const val = metrics[key]?.value ?? 0
      if (val >= cfg.warn) {
        const id = ++alertId
        setAlerts(prev => [
          ...prev.slice(-4),
          { id, key, value: val, label: cfg.label, unit: cfg.unit, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ])
        // Auto-dismiss après 5s
        setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000)
      }
    })
  }, [metrics.cpu?.value, metrics.memory?.value, metrics.visitors?.value])

  const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id))

  return { alerts, dismiss }
}

export default function AlertSystem({ alerts, onDismiss }) {
  if (alerts.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 max-w-xs">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="animate-alert flex items-start gap-3 rounded-xl px-4 py-3"
          style={{
            background: '#0d1117',
            border: '1px solid rgba(255,184,0,0.4)',
            boxShadow: '0 0 20px rgba(255,184,0,0.15)',
          }}
        >
          <span style={{ color: '#ffb800', fontSize: 14, marginTop: 1 }}>⚠</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono font-semibold" style={{ color: '#ffb800' }}>
              ALERTE — {alert.label}
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#4b5563' }}>
              {alert.value.toFixed(1)}{alert.unit} · {alert.time}
            </p>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="text-xs font-mono ml-1"
            style={{ color: '#4b5563' }}
          >✕</button>
        </div>
      ))}
    </div>
  )
}
