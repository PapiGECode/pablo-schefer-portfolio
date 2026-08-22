/**
 * Local telemetry agent. Run on the PC whose metrics should appear in the portfolio:
 *   pnpm telemetry:start
 *
 * It deliberately binds to loopback only and keeps a rolling SQLite history locally.
 */
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { promisify } from 'node:util'
import si from 'systeminformation'

const host = process.env.TELEMETRY_HOST ?? '127.0.0.1'
const port = Number(process.env.TELEMETRY_PORT ?? 4317)
const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
try { process.loadEnvFile(path.join(projectRoot, '.env.local')) } catch { /* Vercel public settings are optional locally. */ }
const dataDir = path.join(projectRoot, '.telemetry')
mkdirSync(dataDir, { recursive: true })
const database = new DatabaseSync(path.join(dataDir, 'metrics.sqlite'))
database.exec(`
  CREATE TABLE IF NOT EXISTS samples (
    captured_at TEXT NOT NULL,
    cpu_percent REAL,
    cpu_temperature REAL,
    gpu_percent REAL,
    gpu_temperature REAL,
    memory_percent REAL,
    memory_used INTEGER,
    memory_total INTEGER,
    storage_percent REAL,
    storage_used INTEGER,
    storage_total INTEGER,
    received_per_second REAL,
    sent_per_second REAL,
    received_total INTEGER,
    sent_total INTEGER
  );
  CREATE INDEX IF NOT EXISTS samples_captured_at_idx ON samples(captured_at);
`)
const insert = database.prepare(`INSERT INTO samples VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

let latest = null
let sampling = false
let publishWarningShown = false
let lastPersistedAt = 0
let lastPublishedAt = 0
let lastHardwareReadAt = 0
let lastCleanupAt = 0
let cachedHardware = {
  temperature: { main: null },
  gpu: null,
  storage: { total: 0, used: 0 },
}

const asNumber = (value) => Number.isFinite(value) ? Number(value) : null
const sum = (values, key) => values.reduce((total, value) => total + (Number(value[key]) || 0), 0)
const execFileAsync = promisify(execFile)

async function readNvidiaGpu() {
  if (process.platform !== 'win32') return null
  try {
    const { stdout } = await execFileAsync('nvidia-smi.exe', [
      '--query-gpu=utilization.gpu,temperature.gpu',
      '--format=csv,noheader,nounits',
    ], { timeout: 3_000, windowsHide: true })
    const [line] = stdout.trim().split(/\r?\n/)
    const [percent, temperature] = (line ?? '').split(',').map((value) => Number(value.trim()))
    if (!Number.isFinite(percent) && !Number.isFinite(temperature)) return null
    return {
      percent: Number.isFinite(percent) ? percent : null,
      temperature: Number.isFinite(temperature) ? temperature : null,
    }
  } catch {
    return null
  }
}

async function publish(metrics) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim()
  const publicKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  const sharedSecret = process.env.PORTFOLIO_TELEMETRY_SECRET?.trim()
  if (!supabaseUrl || !publicKey || !sharedSecret) {
    if (!publishWarningShown) {
      publishWarningShown = true
      console.warn('Cloud telemetry is waiting for its local environment settings.')
    }
    return
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/publish_hardware_metrics`, {
    method: 'POST',
    headers: {
      apikey: publicKey,
      Authorization: `Bearer ${publicKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shared_secret: sharedSecret, metrics }),
    signal: AbortSignal.timeout(4_000),
  })
  if (!response.ok) throw new Error(`publish_${response.status}`)
}

async function sample() {
  if (sampling) return latest
  sampling = true
  try {
    const now = Date.now()
    const [load, memory, networks] = await Promise.all([
      si.currentLoad(), si.mem(), si.networkStats(),
    ])
    // Temperature, GPU enumeration and filesystem scans are comparatively
    // expensive on Windows. Keep them cached for a full minute; CPU, RAM and
    // network readings below still refresh on every five-second sample.
    if (now - lastHardwareReadAt >= 60_000 || lastHardwareReadAt === 0) {
      const [temperature, graphics, filesystems, nvidiaGpu] = await Promise.all([
        si.cpuTemperature(), si.graphics(), si.fsSize(), readNvidiaGpu(),
      ])
      const drives = filesystems.filter((entry) => entry.size > 0 && !entry.fs.startsWith('tmpfs'))
      const gpu = graphics.controllers.find((controller) => /nvidia/i.test(controller.model ?? ''))
        ?? graphics.controllers.find((controller) => controller.utilizationGpu != null)
        ?? graphics.controllers[0]
      cachedHardware = {
        temperature: { main: asNumber(temperature.main) },
        gpu: gpu ? {
          percent: asNumber(gpu.utilizationGpu) ?? nvidiaGpu?.percent ?? null,
          temperature: asNumber(gpu.temperatureGpu) ?? nvidiaGpu?.temperature ?? null,
        } : nvidiaGpu,
        storage: { total: sum(drives, 'size'), used: sum(drives, 'used') },
      }
      lastHardwareReadAt = now
    }
    const receivedPerSecond = sum(networks, 'rx_sec')
    const sentPerSecond = sum(networks, 'tx_sec')
    const receivedTotal = sum(networks, 'rx_bytes')
    const sentTotal = sum(networks, 'tx_bytes')
    latest = {
      capturedAt: new Date().toISOString(),
      cpu: { percent: asNumber(load.currentLoad), temperature: cachedHardware.temperature.main },
      gpu: {
        percent: cachedHardware.gpu?.percent ?? null,
        temperature: cachedHardware.gpu?.temperature ?? null,
        name: null,
      },
      memory: { percent: memory.total ? (memory.used / memory.total) * 100 : null, used: memory.used, total: memory.total },
      storage: { percent: cachedHardware.storage.total ? (cachedHardware.storage.used / cachedHardware.storage.total) * 100 : null, used: cachedHardware.storage.used, total: cachedHardware.storage.total },
      network: { receivedPerSecond, sentPerSecond, receivedTotal, sentTotal },
    }
    if (now - lastPersistedAt >= 5_000 || lastPersistedAt === 0) {
      insert.run(
        latest.capturedAt, latest.cpu.percent, latest.cpu.temperature, latest.gpu.percent, latest.gpu.temperature,
        latest.memory.percent, latest.memory.used, latest.memory.total, latest.storage.percent, latest.storage.used, latest.storage.total,
        receivedPerSecond, sentPerSecond, receivedTotal, sentTotal,
      )
      lastPersistedAt = now
    }
    // Prune at most once per hour instead of issuing a DELETE on every sample.
    if (now - lastCleanupAt >= 3_600_000 || lastCleanupAt === 0) {
      database.prepare("DELETE FROM samples WHERE captured_at < datetime('now', '-31 days')").run()
      lastCleanupAt = now
    }
    if (now - lastPublishedAt >= 5_000 || lastPublishedAt === 0) {
      try {
        await publish(latest)
        lastPublishedAt = now
      } catch (publishError) {
        console.error('Telemetry publish failed:', publishError instanceof Error ? publishError.message : publishError)
      }
    }
    return latest
  } catch (error) {
    console.error('Telemetry sample failed:', error instanceof Error ? error.message : error)
    return latest
  } finally {
    sampling = false
  }
}

await sample()
// The web consumes one fresh value every five seconds. Sampling more often
// only multiplies systeminformation's Windows overhead without improving the UI.
setInterval(() => { void sample() }, 5_000).unref()

http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'https://www.pabloschefer.com')
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Access-Control-Allow-Private-Network', 'true')
  response.setHeader('Cache-Control', 'no-store')
  if (request.method === 'OPTIONS') return response.writeHead(204).end()
  if (request.method !== 'GET' || request.url !== '/metrics') return response.writeHead(404).end()
  const metrics = await sample()
  response.writeHead(metrics ? 200 : 503, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(metrics ?? { error: 'unavailable' }))
}).listen(port, host, () => console.log(`Portfolio telemetry agent listening at http://${host}:${port}/metrics on ${os.hostname()}`))
