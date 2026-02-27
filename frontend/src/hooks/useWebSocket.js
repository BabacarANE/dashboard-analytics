/**
 * hooks/useWebSocket.js
 * Hook personnalisé — gestion WebSocket avec reconnexion automatique
 */

import { useState, useEffect, useRef, useCallback } from 'react'

const WS_URL = 'ws://localhost:8000/ws/metrics/'

export const WS_STATUS = {
  CONNECTING:  'connecting',
  CONNECTED:   'connected',
  DISCONNECTED:'disconnected',
  ERROR:       'error',
}

export function useWebSocket() {
  const [status, setStatus]   = useState(WS_STATUS.CONNECTING)
  const [lastMessage, setLastMessage] = useState(null)
  const wsRef       = useRef(null)
  const retryRef    = useRef(null)
  const retryCount  = useRef(0)
  const MAX_RETRIES = 10

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus(WS_STATUS.CONNECTED)
        retryCount.current = 0
        console.log('[WS] Connecté')
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
        } catch (e) {
          console.error('[WS] Erreur parsing message', e)
        }
      }

      ws.onclose = () => {
        setStatus(WS_STATUS.DISCONNECTED)
        // Reconnexion automatique avec backoff exponentiel
        if (retryCount.current < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** retryCount.current, 30000)
          retryCount.current++
          console.log(`[WS] Reconnexion dans ${delay}ms (tentative ${retryCount.current})`)
          retryRef.current = setTimeout(connect, delay)
        }
      }

      ws.onerror = () => {
        setStatus(WS_STATUS.ERROR)
      }

    } catch (e) {
      setStatus(WS_STATUS.ERROR)
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(retryRef.current)
      wsRef.current?.close()
    }
  }, [connect])

  return { status, lastMessage }
}
