import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

function CustomTooltip({ active, payload, label, unit, color }) {
  if (!active || !payload?.length) return null
  return (
      <div style={{
        background: '#0d1117',
        border: `1px solid ${color}40`,
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: `0 0 16px ${color}20`,
      }}>
        <p style={{ color: '#4b5563', fontSize: 10, fontFamily: 'monospace', marginBottom: 4 }}>{label}</p>
        <p style={{ color, fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>
          {payload[0]?.value?.toLocaleString('fr-FR')}
          {unit && <span style={{ color: '#4b5563', marginLeft: 4 }}>{unit}</span>}
        </p>
      </div>
  )
}

function EmptyState() {
  return (
      <div style={{ height: 180 }} className="flex items-center justify-center">
        <p style={{ color: '#2d3748', fontFamily: 'monospace', fontSize: 12 }}>
          ▋ En attente de données...
        </p>
      </div>
  )
}

export function LineRealtime({ data, color = '#00e5ff', unit = '', title }) {
  const gradId = `grad-${color.replace('#', '')}`
  return (
      <div style={{ background: '#0d1117', border: '1px solid #1a2332', borderRadius: 12, padding: 20 }}>
        {title && (
            <p style={{ color: '#4b5563', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              {title}
            </p>
        )}
        {data.length === 0 ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#2d3748', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#2d3748', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip unit={unit} color={color} />} />
                <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
                      fill={`url(#${gradId})`} dot={false}
                      activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
                      isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
  )
}

export function BarRealtime({ data, color = '#00ff9d', unit = '', title }) {
  return (
      <div style={{ background: '#0d1117', border: '1px solid #1a2332', borderRadius: 12, padding: 20 }}>
        {title && (
            <p style={{ color: '#4b5563', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              {title}
            </p>
        )}
        {data.length === 0 ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#2d3748', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#2d3748', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip unit={unit} color={color} />} />
                <Bar dataKey="value" fill={color} fillOpacity={0.8} radius={[2, 2, 0, 0]} maxBarSize={16} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
        )}
      </div>
  )
}