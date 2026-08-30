import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

export type HardwareTelemetry = {
  capturedAt: string
  cpu: { percent: number | null; temperature: number | null }
  gpu: { percent: number | null; temperature: number | null; name: string | null }
  memory: { percent: number | null; used: number; total: number }
  storage: { percent: number | null; used: number; total: number }
  network: { receivedPerSecond: number; sentPerSecond: number; receivedTotal: number; sentTotal: number }
}

type TelemetryState = {
  metrics: HardwareTelemetry | null
  capturedAt: string | null
  status: 'connecting' | 'ready' | 'offline'
}

const telemetryUrl = import.meta.env.VITE_TELEMETRY_URL ?? 'http://127.0.0.1:4317/metrics'

export function useHardwareTelemetry(): TelemetryState {
  const [state, setState] = useState<TelemetryState>({ metrics: null, capturedAt: null, status: 'connecting' })

  useEffect(() => {
    let active = true
    let timer = 0
    let controller: AbortController | null = null
    let reading = false

    const schedule = (delay: number) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(read, delay)
    }

    const read = async () => {
      if (!active || reading) return
      if (document.hidden) {
        schedule(30_000)
        return
      }
      reading = true
      controller?.abort()
      controller = new AbortController()
      try {
        const client = await getSupabase()
        let metrics: HardwareTelemetry | null = null
        let capturedAt = ''

        if (client) {
          const { data, error } = await client
            .from('hardware_metrics')
            .select('payload,captured_at')
            .eq('id', 1)
            .maybeSingle()
          if (error) throw error
          if (data?.payload) {
            metrics = data.payload as HardwareTelemetry
            capturedAt = String(data.captured_at)
          }
        }

        if (!metrics && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          const response = await fetch(telemetryUrl, { signal: controller.signal, cache: 'no-store' })
          if (!response.ok) throw new Error(`telemetry_${response.status}`)
          metrics = await response.json() as HardwareTelemetry
          capturedAt = metrics.capturedAt
        }

        if (!metrics || !capturedAt || Date.now() - new Date(capturedAt).getTime() > 30_000) {
          throw new Error('telemetry_stale')
        }
        if (active) setState({ metrics, capturedAt, status: 'ready' })
      } catch {
        if (active) setState((current) => ({ metrics: current.metrics, capturedAt: current.capturedAt, status: 'offline' }))
      } finally {
        reading = false
        if (active) schedule(document.hidden ? 30_000 : 5_000)
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        controller?.abort()
        schedule(30_000)
        return
      }
      window.clearTimeout(timer)
      void read()
    }

    void read()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      active = false
      controller?.abort()
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return state
}
