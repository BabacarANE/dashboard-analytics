import { useEffect, useRef, useState } from 'react'

const COLOR_MAP = {
  cyan:   { accent: '#00e5ff', glow: 'rgba(0,229,255,0.15)',  border: 'rgba(0,229,255,0.2)'  },
  green:  { accent: '#00ff9d', glow: 'rgba(0,255,157,0.15)',  border: 'rgba(0,255,157,0.2)'  },
  amber:  { accent: '#ffb800', glow: 'rgba(255,184,0,0.15)',  border: 'rgba(255,184,0,0.2)'  },
  red:    { accent: '#ff4466', glow: 'rgba(255,68,102,0.15)', border: 'rgba(255,68,102,0.2)' },
}

export default function MetricCard({ label, value, change, unit = '', icon, color = 'cyan', className = '' }) {
  const [flash, setFlash] = useState(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (value !== prevValue.current && value !== 0) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 500)
      prevValue.current = value
      return () => clearTimeout(t)
    }
  }, [value])

  const c = COLOR_MAP[color] ?? COLOR_MAP.cyan
  const isUp   = change > 0
  const isDown = change < 0

  return (
      <div
          className={`relative rounded-xl p-5 transition-all duration-300 ${className}`}
          style={{
            background:  '#0d1117',
            border:      `1px solid ${flash ? c.accent : c.border}`,
            boxShadow:   flash ? `0 0 24px ${c.glow}, inset 0 0 24px ${c.glow}` : `0 0 0px transparent`,
          }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#4b5563' }}>
          {label}
        </span>
          {icon && (
              <span className="text-sm" style={{ color: c.accent }}>{icon}</span>
          )}
        </div>

        {/* Value */}
        <div
            className="text-3xl font-display font-bold tabular-nums transition-all duration-200"
            style={{ color: flash ? c.accent : '#e6edf3' }}
        >
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          {unit && <span className="text-base ml-1" style={{ color: '#4b5563' }}>{unit}</span>}
        </div>

        {/* Change */}
        <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs font-mono" style={{ color: isUp ? '#00ff9d' : isDown ? '#ff4466' : '#4b5563' }}>
          {isUp ? '▲' : isDown ? '▼' : '─'}
          {' '}
          {change > 0 ? '+' : ''}{typeof change === 'number' ? change.toFixed(1) : change}
          {unit && ` ${unit}`}
        </span>
          <span className="text-xs font-mono" style={{ color: '#2d3748' }}>/ dernier</span>
        </div>

        {/* Bottom accent line */}
        <div
            className="absolute bottom-0 left-4 right-4 h-px rounded-full transition-all duration-300"
            style={{ background: flash ? c.accent : `linear-gradient(90deg, transparent, ${c.border}, transparent)` }}
        />
      </div>
  )
}