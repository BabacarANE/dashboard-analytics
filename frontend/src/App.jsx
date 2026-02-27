/**
 * App.jsx — Dashboard Analytics en Temps Réel
 */

import { useMetrics } from './hooks/useMetrics'
import { WS_STATUS }  from './hooks/useWebSocket'
import WebSocketStatus from './components/ui/WebSocketStatus'
import TimeFilter      from './components/ui/TimeFilter'
import MetricCard      from './components/ui/MetricCard'
import { LineRealtime, BarRealtime } from './components/charts/RealtimeChart'

const Icons = {
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>,
  eye:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  cart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  revenue: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
}

export default function App() {
  const { metrics, status, period, setPeriod } = useMetrics()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-mono tracking-tight">ANALYTICS DASHBOARD</h1>
              <p className="text-xs text-gray-500 font-mono">Temps réel · Django + React + WebSocket</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <TimeFilter period={period} onChange={setPeriod} />
            <WebSocketStatus status={status} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Bannière déconnecté */}
        {status === WS_STATUS.DISCONNECTED && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400 font-mono flex items-center gap-2">
            <span>⚠</span> WebSocket déconnecté — Reconnexion en cours...
          </div>
        )}

        {/* KPI Cards */}
        <section>
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Métriques clés</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Visiteurs actifs" value={metrics.visitors.value}  change={metrics.visitors.change}  icon={Icons.users}   color="blue"   />
            <MetricCard label="Pages vues"        value={metrics.pageviews.value} change={metrics.pageviews.change} icon={Icons.eye}     color="purple" />
            <MetricCard label="Ventes"            value={metrics.sales.value}    change={metrics.sales.change}    icon={Icons.cart}    color="green"  />
            <MetricCard label="Revenus"           value={metrics.revenue.value}  change={metrics.revenue.change}  icon={Icons.revenue} color="orange" unit="€" />
          </div>
        </section>

        {/* Graphiques trafic */}
        <section>
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Trafic en temps réel</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LineRealtime data={metrics.visitors.history}  color="#3b82f6" title="Visiteurs actifs" />
            <LineRealtime data={metrics.pageviews.history} color="#8b5cf6" title="Pages vues"       />
          </div>
        </section>

        {/* Ventes & Système */}
        <section>
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Ventes & Performance système</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarRealtime  data={metrics.sales.history} color="#10b981" unit="ventes" title="Ventes"   />
            <LineRealtime data={metrics.cpu.history}   color="#f59e0b" unit="%"      title="CPU (%)"  />
          </div>
        </section>

        {/* Système */}
        <section>
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Système</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="CPU"         value={metrics.cpu.value}      change={metrics.cpu.change}      unit="%" color="orange" />
            <MetricCard label="Mémoire"     value={metrics.memory.value}   change={metrics.memory.change}   unit="%" color="purple" />
            <MetricCard label="Requêtes/s"  value={metrics.requests.value} change={metrics.requests.change}         color="blue"   />
            <MetricCard label="Inscriptions"value={metrics.signups.value}  change={metrics.signups.change}          color="green"  />
          </div>
        </section>

      </main>

      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs font-mono text-gray-600">
          <span>Django 5 · Channels 4 · React 18 · Recharts</span>
          <span>ws://localhost:8000/ws/metrics/</span>
        </div>
      </footer>

    </div>
  )
}
