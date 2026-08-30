import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, ChevronDown, Clock3, Eye, Headphones, Radio, RefreshCw, Users } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'

type VoiceMember = {
  id: string
  username: string
  avatarUrl: string | null
  status: 'online' | 'idle' | 'dnd' | 'offline'
}

type VoiceChannel = {
  id: string
  name: string
  members: VoiceMember[]
}

type EdgarCommunityData = {
  server: {
    id: string
    name: string
    membersApprox: number | null
    onlineApprox: number | null
    inviteUrl: string | null
  }
  voice: {
    available: boolean
    visibleMemberCount: number
    channels: VoiceChannel[]
  }
  source?: {
    mode: 'discord_widget' | 'gateway' | 'static_fallback'
    upstreamCacheSeconds: number
    effectiveRefreshSeconds?: number
  }
  updatedAt: string
}

const pollSeconds = 15

function createSnapshotSignature(data: EdgarCommunityData) {
  return JSON.stringify({
    members: data.server.membersApprox,
    online: data.server.onlineApprox,
    channels: data.voice.channels.map((channel) => ({
      id: channel.id,
      members: channel.members.map((member) => `${member.id}:${member.username}:${member.avatarUrl}:${member.status}`),
    })),
  })
}

export type LiveGuildId = 'edgar' | 'fnlb' | 'valorant' | 'nate' | 'gw2'

export function DiscordLivePanel({ content, locale, guildId = 'edgar', displayName }: { content: SiteCopy; locale: Locale; guildId?: LiveGuildId; displayName?: string }) {
  const [data, setData] = useState<EdgarCommunityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [activeOnly, setActiveOnly] = useState(false)
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set())
  const [lastChangeAt, setLastChangeAt] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const signatureRef = useRef<string | null>(null)
  const hasDataRef = useRef(false)
  const expansionInitialisedRef = useRef(false)
  const labels = content.edgar

  const ui = locale === 'es' ? {
    monitor: 'Monitor activo',
    refresh: 'Actualizar ahora',
    activeOnly: 'Solo canales activos',
    allChannels: 'Todos los canales',
    nextCheck: 'Próxima comprobación',
    checked: 'Comprobado',
    lastChange: 'Último cambio detectado',
    justNow: 'ahora',
    source: 'Actividad pública de Discord',
    sourceDelay: 'Miembros, canales y participantes visibles se actualizan automáticamente mientras navegas.',
    fallbackSource: 'Resumen público de la comunidad',
    fallbackDelay: 'Discord no publica ahora mismo los canales de voz de este servidor. El panel seguirá comprobando el widget automáticamente.',
    expand: 'Mostrar participantes',
    collapse: 'Ocultar participantes',
  } : {
    monitor: 'Monitor active',
    refresh: 'Refresh now',
    activeOnly: 'Active channels only',
    allChannels: 'All channels',
    nextCheck: 'Next check',
    checked: 'Checked',
    lastChange: 'Last change detected',
    justNow: 'now',
    source: 'Public Discord activity',
    sourceDelay: 'Visible members, channels and participants update automatically while you browse.',
    fallbackSource: 'Public community summary',
    fallbackDelay: 'Discord is not publishing this server’s voice channels right now. The panel will keep checking the widget automatically.',
    expand: 'Show participants',
    collapse: 'Hide participants',
  }

  useEffect(() => {
    let active = true
    let controller: AbortController | null = null

    const load = async () => {
      controller?.abort()
      controller = new AbortController()
      if (hasDataRef.current) setRefreshing(true)

      try {
        const query = guildId === 'edgar' ? '' : `?guild=${guildId}`
        const response = await fetch(`/api/edgar-community${query}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('discord_unavailable')
        const nextData = await response.json() as EdgarCommunityData
        if (!active) return

        const signature = createSnapshotSignature(nextData)
        if (signatureRef.current === null || signatureRef.current !== signature) {
          signatureRef.current = signature
          setLastChangeAt(nextData.updatedAt)
        }

        if (!expansionInitialisedRef.current) {
          const activeChannels = nextData.voice.channels
            .filter((channel) => channel.members.length > 0)
            .map((channel) => channel.id)
          setExpandedChannels(new Set(activeChannels))
          expansionInitialisedRef.current = true
        }

        hasDataRef.current = true
        setData(nextData)
        setError(false)
        setLoading(false)
        setRefreshing(false)
      } catch (fetchError) {
        if (active && !(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          setError(true)
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    void load()
    const poll = window.setInterval(() => {
      if (!document.hidden) void load()
    }, pollSeconds * 1_000)
    const onVisibilityChange = () => {
      if (!document.hidden) void load()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      active = false
      controller?.abort()
      window.clearInterval(poll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [guildId, requestVersion])

  const number = (value: number | null) => value === null ? '—' : new Intl.NumberFormat(locale).format(value)
  const checked = data
    ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(data.updatedAt))
    : '—'
  const lastChange = lastChangeAt
    ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(lastChangeAt))
    : ui.justNow

  const visibleChannels = useMemo(
    () => activeOnly ? data?.voice.channels.filter((channel) => channel.members.length > 0) ?? [] : data?.voice.channels ?? [],
    [activeOnly, data?.voice.channels],
  )
  const isFallback = data?.source?.mode === 'static_fallback'

  const toggleChannel = (channelId: string) => {
    setExpandedChannels((current) => {
      const next = new Set(current)
      if (next.has(channelId)) next.delete(channelId)
      else next.add(channelId)
      return next
    })
  }

  return (
    <section className="discord-live">
      <div className="discord-live__header">
        <div>
          <span className="discord-live__signal"><span className="status-dot" aria-hidden="true" />{ui.monitor}</span>
          <h2>{displayName ?? data?.server.name ?? ({ edgar: 'Edgar Pons', fnlb: 'FNLB', valorant: 'VALORANT ESP', nate: 'Nate Gentile', gw2: 'GW2' }[guildId])}</h2>
        </div>
        <span className="discord-live__privacy">{labels.publicData}</span>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {error ? labels.error : data ? `${ui.checked} ${checked}` : labels.loading}
      </p>

      {loading && !data && (
        <div className="discord-live__loading">
          <span className="discord-loader" aria-hidden="true" />
          <p>{labels.loading}</p>
        </div>
      )}

      {error && !data && (
        <div className="discord-live__error">
          <Radio size={24} aria-hidden="true" />
          <p>{labels.error}</p>
          <button type="button" onClick={() => {
            setError(false)
            setLoading(true)
            setRequestVersion((version) => version + 1)
          }}>
            <RefreshCw size={15} aria-hidden="true" />{labels.retry}
          </button>
        </div>
      )}

      {data && (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <div className="discord-live__controls">
            <button type="button" onClick={() => setRequestVersion((version) => version + 1)} disabled={refreshing}>
              <RefreshCw className={refreshing ? 'is-spinning' : ''} size={15} aria-hidden="true" />{ui.refresh}
            </button>
            <button type="button" className={activeOnly ? 'is-active' : ''} onClick={() => setActiveOnly((activeState) => !activeState)} aria-pressed={activeOnly}>
              <Eye size={15} aria-hidden="true" />{activeOnly ? ui.allChannels : ui.activeOnly}
            </button>
            <span><Clock3 size={14} aria-hidden="true" />{ui.nextCheck} · {pollSeconds}s</span>
          </div>

          <div className="discord-live__poll-progress" key={data.updatedAt} aria-hidden="true"><i /></div>

          <div className="discord-live__stats">
            <article>
              <Users size={18} aria-hidden="true" />
              <strong>{number(data.server.membersApprox)}</strong>
              <span>{labels.membersLabel}</span>
            </article>
            <article>
              <span className="status-dot" aria-hidden="true" />
              <strong>{number(data.server.onlineApprox)}</strong>
              <span>{labels.onlineLabel}</span>
            </article>
            <article>
              <Headphones size={18} aria-hidden="true" />
              <strong>{data.voice.available ? number(data.voice.visibleMemberCount) : '—'}</strong>
              <span>{labels.voiceLabel} · {labels.visibleVoiceLabel}</span>
            </article>
          </div>

          <div className="discord-live__voice">
            <div className="discord-live__voice-heading">
              <div>
                <span className="eyebrow">{locale === 'es' ? 'Canales de voz' : 'Voice channels'}</span>
                <h3>{data.voice.available ? labels.voiceAvailable : labels.voiceUnavailable}</h3>
              </div>
              <span>{ui.checked} · {checked}<small>{ui.lastChange} · {lastChange}</small></span>
            </div>

            {data.voice.available && visibleChannels.length > 0 ? (
              <div className="voice-channel-grid">
                {visibleChannels.map((channel, channelIndex) => {
                  const expanded = expandedChannels.has(channel.id)
                  return (
                    <m.article
                      className={channel.members.length ? 'voice-channel voice-channel--active' : 'voice-channel'}
                      key={channel.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: channelIndex * 0.035, duration: 0.3 }}
                    >
                      <button className="voice-channel__toggle" type="button" onClick={() => toggleChannel(channel.id)} aria-expanded={expanded} aria-label={`${expanded ? ui.collapse : ui.expand}: ${channel.name}`}>
                        <span><Headphones size={15} aria-hidden="true" />{channel.name}</span>
                        <strong>{channel.members.length.toString().padStart(2, '0')}</strong>
                        <ChevronDown size={15} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && channel.members.length > 0 && (
                          <m.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            {channel.members.map((member, memberIndex) => (
                              <li key={`${channel.id}-${member.id}-${memberIndex}`}>
                                <span className={`voice-member__status voice-member__status--${member.status}`} aria-hidden="true" />
                                <span className="voice-member__avatar" aria-hidden="true">
                                  <span>{member.username.trim().charAt(0).toUpperCase() || '?'}</span>
                                  {member.avatarUrl && (
                                    <img
                                      src={member.avatarUrl}
                                      alt=""
                                      width="58"
                                      height="58"
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                      onError={(event) => event.currentTarget.remove()}
                                    />
                                  )}
                                </span>
                                <span>{member.username}</span>
                              </li>
                            ))}
                          </m.ul>
                        )}
                      </AnimatePresence>
                      {channel.members.length === 0 && <p>{labels.emptyVoice}</p>}
                    </m.article>
                  )
                })}
              </div>
            ) : data.voice.available ? (
              <p className="discord-live__empty">{labels.emptyVoice}</p>
            ) : null}
          </div>

          <div className="discord-live__source">
            <span><Radio size={15} aria-hidden="true" />{isFallback ? ui.fallbackSource : ui.source}</span>
            <p>{isFallback ? ui.fallbackDelay : ui.sourceDelay}</p>
          </div>

          <div className="discord-live__footer">
            <p>{labels.sourceNote}</p>
            {data.server.inviteUrl && (
              <a href={data.server.inviteUrl} target="_blank" rel="noreferrer">
                {labels.join}<ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
          {error && <p className="discord-live__stale">{labels.error}</p>}
        </m.div>
      )}
    </section>
  )
}
