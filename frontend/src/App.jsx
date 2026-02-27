/**
 * App.jsx — Dashboard Analytics · Phase 7 Polish
 * Aesthetic: Terminal industriel — noir profond, accents cyan néon
 */

import { useMetrics }    from './hooks/useMetrics'
import { WS_STATUS }     from './hooks/useWebSocket'
import WebSocketStatus   from './components/ui/WebSocketStatus'
import TimeFilter        from './components/ui/TimeFilter'
import MetricCard        from './components/ui/MetricCard'
import AlertSystem, { useAlerts } from './components/ui/AlertSystem'
import { LineRealtime, BarRealtime } from './components/charts/RealtimeChart'

const Icons = {
  users:   '◈',
  eye:     '◉',
  cart:    '⬡',
  revenue: '◆',
  cpu:     '▣',
  memory:  '▤',
  req:     '▸',
  signup:  '◎',
}

export default function App() {
  const { metrics, status, period, setPeriod } = useMetrics()
  const { alerts, dismiss } = useAlerts(metrics)

  return (
      <div className="min-h-screen grid-bg" style={{ background: '#080b0f', color: '#c9d1d9' }}>

        {/* Alerts */}
        <AlertSystem alerts={alerts} onDismiss={dismiss} />

        {/* ── Header ── */}
        <header style={{ borderBottom: '1px solid #1a2332', background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)' }}
                className="sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Logo + titre */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center scanline"
                     style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)' }}>
                  <span style={{ color: '#00e5ff', fontSize: 16 }}>◈</span>
                </div>
              </div>
              <div>
                <h1 className="font-display font-bold tracking-tight text-sm" style={{ color: '#e6edf3' }}>
                  ANALYTICS <span style={{ color: '#00e5ff' }}>DASHBOARD</span>
                </h1>
                <p className="text-xs font-mono" style={{ color: '#2d3748' }}>
                  Django · Channels · React · WebSocket
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <TimeFilter period={period} onChange={setPeriod} />
              <WebSocketStatus status={status} />
            </div>
          </div>

          {/* Thin cyan progress bar when connected */}
          {status === WS_STATUS.CONNECTED && (
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #00e5ff40, transparent)' }} />
          )}
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

          {/* Offline banner */}
          {status === WS_STATUS.DISCONNECTED && (
              <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-mono animate-fade-up"
                   style={{ background: 'rgba(255,68,102,0.05)', border: '1px solid rgba(255,68,102,0.3)', color: '#ff4466' }}>
                ⚠ &nbsp;WebSocket déconnecté — Reconnexion automatique en cours...
              </div>
          )}

          {/* ── KPI Cards ── */}
          <section>
            <SectionLabel>Métriques clés</SectionLabel>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard className="card-1" label="Visiteurs actifs" value={metrics.visitors.value}  change={metrics.visitors.change}  icon={Icons.users}   color="cyan"  />
              <MetricCard className="card-2" label="Pages vues"        value={metrics.pageviews.value} change={metrics.pageviews.change} icon={Icons.eye}     color="cyan"  />
              <MetricCard className="card-3" label="Ventes"            value={metrics.sales.value}    change={metrics.sales.change}    icon={Icons.cart}    color="green" />
              <MetricCard className="card-4" label="Revenus"           value={metrics.revenue.value}  change={metrics.revenue.change}  icon={Icons.revenue} color="amber" unit="€" />
            </div>
          </section>

          {/* ── Trafic ── */}
          <section>
            <SectionLabel>Trafic en temps réel</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LineRealtime data={metrics.visitors.history}  color="#00e5ff" title="Visiteurs actifs" />
              <LineRealtime data={metrics.pageviews.history} color="#00ff9d" title="Pages vues"       />
            </div>
          </section>

          {/* ── Ventes & CPU ── */}
          <section>
            <SectionLabel>Commerce & Performance</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BarRealtime  data={metrics.sales.history}  color="#00ff9d" unit="ventes" title="Ventes"   />
              <LineRealtime data={metrics.revenue.history} color="#ffb800" unit="€"     title="Revenus"  />
            </div>
          </section>

          {/* ── Système ── */}
          <section>
            <SectionLabel>Système</SectionLabel>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="CPU"          value={metrics.cpu.value}      change={metrics.cpu.change}      unit="%" color={metrics.cpu.value > 70 ? 'red' : 'amber'} icon={Icons.cpu}    />
              <MetricCard label="Mémoire"      value={metrics.memory.value}   change={metrics.memory.change}   unit="%" color={metrics.memory.value > 75 ? 'red' : 'cyan'} icon={Icons.memory} />
              <MetricCard label="Requêtes/s"   value={metrics.requests.value} change={metrics.requests.change}         color="cyan"  icon={Icons.req}    />
              <MetricCard label="Inscriptions" value={metrics.signups.value}  change={metrics.signups.change}          color="green" icon={Icons.signup} />
            </div>
          </section>

          {/* ── CPU + Mémoire charts ── */}
          <section>
            <SectionLabel>Monitoring système</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LineRealtime data={metrics.cpu.history}    color="#ffb800" unit="%" title="CPU (%)"      />
              <LineRealtime data={metrics.memory.history} color="#00e5ff" unit="%" title="Mémoire (%)"  />
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid #1a2332', marginTop: 64 }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono" style={{ color: '#2d3748' }}>
            <span>Django 5 · Channels 4 · React 18 · Recharts · Redis 7</span>
            <span style={{ color: '#1a2332' }}>ws://localhost:8000/ws/metrics/</span>
          </div>
        </footer>

      </div>
  )
}

function SectionLabel({ children }) {
  return (
      <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#2d3748' }}>
        {children}
      </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #1a2332, transparent)' }} />
      </div>
  )
}