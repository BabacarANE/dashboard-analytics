/**
 * components/charts/RealtimeChart.jsx
 * Graphique temps réel avec Recharts
 */

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts'

// Tooltip custom
function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 font-mono mb-1">{label}</p>
      <p className="text-sm font-bold font-mono text-white">
        {payload[0]?.value?.toLocaleString('fr-FR')}
        {unit && <span className="text-gray-400 ml-1">{unit}</span>}
      </p>
    </div>
  )
}

export function LineRealtime({ data, color = '#3b82f6', unit = '', title }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      {title && (
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">{title}</p>
      )}
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm font-mono">
          En attente de données...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${color.replace('#','')})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function BarRealtime({ data, color = '#10b981', unit = '', title }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      {title && (
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">{title}</p>
      )}
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm font-mono">
          En attente de données...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Bar
              dataKey="value"
              fill={color}
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
