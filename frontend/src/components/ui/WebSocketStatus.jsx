/**
 * components/ui/WebSocketStatus.jsx
 */

import { WS_STATUS } from '../../hooks/useWebSocket'

const STATUS_CONFIG = {
  [WS_STATUS.CONNECTED]:   { label: 'Live',          color: 'bg-emerald-500', text: 'text-emerald-400', pulse: true  },
  [WS_STATUS.CONNECTING]:  { label: 'Connexion...',  color: 'bg-amber-500',   text: 'text-amber-400',   pulse: true  },
  [WS_STATUS.DISCONNECTED]:{ label: 'Déconnecté',   color: 'bg-red-500',     text: 'text-red-400',     pulse: false },
  [WS_STATUS.ERROR]:       { label: 'Erreur',        color: 'bg-red-600',     text: 'text-red-400',     pulse: false },
}

export default function WebSocketStatus({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[WS_STATUS.DISCONNECTED]

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-2 h-2">
        {cfg.pulse && (
          <span className={`absolute inline-flex w-full h-full rounded-full ${cfg.color} opacity-50 animate-ping`} />
        )}
        <span className={`relative inline-flex w-2 h-2 rounded-full ${cfg.color}`} />
      </div>
      <span className={`text-xs font-mono font-medium ${cfg.text}`}>
        {cfg.label}
      </span>
    </div>
  )
}
