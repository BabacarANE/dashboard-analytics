/**
 * components/ui/MetricCard.jsx
 */

import { useEffect, useState } from 'react'

function TrendIcon({ change }) {
  if (change > 0) return (
    <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
  )
  if (change < 0) return (
    <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  )
  return <span className="w-3 h-3 text-gray-500">—</span>
}

export default function MetricCard({ label, value, change, unit = '', icon, color = 'blue' }) {
  const [flash, setFlash] = useState(false)

  // Animation flash quand la valeur change
  useEffect(() => {
    if (value === 0) return
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 600)
    return () => clearTimeout(t)
  }, [value])

  const isPositive = change > 0
  const isNegative = change < 0

  const colorMap = {
    blue:   { border: 'border-blue-500/30',   glow: 'shadow-blue-500/10',   icon: 'bg-blue-500/10 text-blue-400'   },
    green:  { border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10',icon: 'bg-emerald-500/10 text-emerald-400'},
    purple: { border: 'border-violet-500/30',  glow: 'shadow-violet-500/10', icon: 'bg-violet-500/10 text-violet-400'},
    orange: { border: 'border-orange-500/30',  glow: 'shadow-orange-500/10', icon: 'bg-orange-500/10 text-orange-400'},
  }
  const c = colorMap[color] ?? colorMap.blue

  return (
    <div className={`
      relative bg-gray-900 border rounded-xl p-5
      shadow-lg ${c.glow} ${c.border}
      transition-all duration-300
      ${flash ? 'brightness-110' : ''}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{label}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${c.icon}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Valeur principale */}
      <div className={`text-3xl font-bold font-mono text-white tabular-nums transition-all duration-300 ${flash ? 'text-blue-200' : ''}`}>
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
      </div>

      {/* Variation */}
      <div className={`flex items-center gap-1 mt-2 text-xs font-mono ${
        isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-gray-500'
      }`}>
        <TrendIcon change={change} />
        <span>
          {change > 0 ? '+' : ''}{typeof change === 'number' ? change.toFixed(1) : change}
          {unit && ` ${unit}`}
        </span>
        <span className="text-gray-600 ml-1">vs dernier</span>
      </div>
    </div>
  )
}
