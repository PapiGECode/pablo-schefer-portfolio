"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  ExternalLink,
  Gamepad2,
  Radio,
  ShieldCheck,
  Sparkles,
  Tv,
  Wifi,
} from "lucide-react"
import { SiApplemusic, SiSpotify } from "react-icons/si"
import { useLanguage } from "./language-provider"
import SplitText from "@/components/SplitText"
import {
  DISCORD_USER_ID,
  LANYARD_REST_URL,
  LANYARD_SOCKET_URL,
  animeTitleFromActivity,
  formatPresenceTime,
  isAnimeActivity,
  isGameActivity,
  isMusicActivity,
  resolveActivityImage,
  type LanyardActivity,
  type LanyardPhase,
  type LanyardPresence,
  type SpotifyPresence,
} from "@/lib/lanyard"

type LanyardEnvelope = {
  op: number
  t?: "INIT_STATE" | "PRESENCE_UPDATE"
  d?: LanyardPresence | { heartbeat_interval?: number }
}

type AnimeMetadata = {
  title: string
  titleRomaji: string
  synopsis: string | null
  coverImage: string | null
  score: number | null
  episodes: number | null
  year: number | null
  anilistUrl: string | null
  crunchyrollUrl: string | null
}

function useLanyardPresence() {
  const [phase, setPhase] = useState<LanyardPhase>("connecting")
  const [presence, setPresence] = useState<LanyardPresence | null>(null)
  const [socketLive, setSocketLive] = useState(false)

  useEffect(() => {
    let stopped = false
    let socket: WebSocket | null = null
    let heartbeat: number | null = null
    let reconnectTimer: number | null = null

    const clearHeartbeat = () => {
      if (heartbeat !== null) window.clearInterval(heartbeat)
      heartbeat = null
    }

    const applyPresence = (data: LanyardPresence) => {
      if (stopped) return
      setPresence(data)
      setPhase("ready")
    }

    const scheduleReconnect = () => {
      if (stopped || reconnectTimer !== null) return
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null
        connectSocket()
      }, 3_500)
    }

    const connectSocket = () => {
      if (stopped || socket) return
      socket = new WebSocket(LANYARD_SOCKET_URL)

      socket.addEventListener("message", (event) => {
        try {
          const raw = String(event.data)
          if (raw.length > 256_000) return
          const payload = JSON.parse(raw) as LanyardEnvelope

          if (payload.op === 1) {
            const interval =
              typeof payload.d === "object" && payload.d && "heartbeat_interval" in payload.d
                ? payload.d.heartbeat_interval ?? 30_000
                : 30_000
            socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }))
            clearHeartbeat()
            heartbeat = window.setInterval(() => {
              if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 3 }))
            }, interval)
          }

          if (
            payload.op === 0 &&
            (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE") &&
            payload.d &&
            "discord_status" in payload.d
          ) {
            applyPresence(payload.d)
            setSocketLive(true)
          }
        } catch {
          // REST polling remains active when a malformed third-party event arrives.
        }
      })

      socket.addEventListener("close", () => {
        clearHeartbeat()
        setSocketLive(false)
        socket = null
        scheduleReconnect()
      })

      socket.addEventListener("error", () => {
        setSocketLive(false)
        socket?.close()
      })
    }

    const refresh = async () => {
      try {
        const response = await fetch(LANYARD_REST_URL, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        })

        if (response.status === 404) {
          if (!stopped) {
            setPresence(null)
            setPhase("unmonitored")
          }
          return
        }
        if (!response.ok) throw new Error("lanyard_unavailable")

        const payload = (await response.json()) as { success: boolean; data?: LanyardPresence }
        if (payload.success && payload.data) applyPresence(payload.data)
      } catch {
        if (!stopped) setPhase((current) => (current === "ready" ? current : "error"))
      }
    }

    void refresh()
    connectSocket()
    const restFallback = window.setInterval(() => {
      if (!document.hidden) void refresh()
    }, 30_000)
    const refreshWhenVisible = () => {
      if (!document.hidden) void refresh()
    }
    document.addEventListener("visibilitychange", refreshWhenVisible)

    return () => {
      stopped = true
      window.clearInterval(restFallback)
      document.removeEventListener("visibilitychange", refreshWhenVisible)
      clearHeartbeat()
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [])

  return { phase, presence, socketLive }
}

function useProgress(timestamps?: { start?: number; end?: number } | null) {
  const [clock, setClock] = useState(() => Date.now())
  const start = timestamps?.start ?? 0
  const end = timestamps?.end ?? 0

  useEffect(() => {
    if (!start || !end) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setClock(Date.now())
    }, 1_000)
    return () => window.clearInterval(timer)
  }, [start, end])

  if (!start || !end) return { elapsed: 0, duration: 0, percent: 0 }
  const duration = Math.max(1, end - start)
  const elapsed = Math.min(duration, Math.max(0, clock - start))
  return { elapsed, duration, percent: (elapsed / duration) * 100 }
}

function ProgressBar({ timestamps }: { timestamps?: { start?: number; end?: number } | null }) {
  const progress = useProgress(timestamps)
  if (!progress.duration) return null

  return (
    <div className="live-progress" aria-label={`${formatPresenceTime(progress.elapsed)} / ${formatPresenceTime(progress.duration)}`}>
      <span><i style={{ width: `${progress.percent}%` }} /></span>
      <small>{formatPresenceTime(progress.elapsed)}</small>
      <small>{formatPresenceTime(progress.duration)}</small>
    </div>
  )
}

function EmptyState({ icon: Icon, title, body }: { icon: typeof Radio; title: string; body: string }) {
  return (
    <div className="live-empty">
      <span className="live-empty__icon"><Icon aria-hidden="true" /></span>
      <div>
        <strong><LiveAnimatedText text={title} splitType="words" /></strong>
        <p><LiveAnimatedText text={body} splitType="words" /></p>
      </div>
    </div>
  )
}

function appleTrackIdentity(activity: LanyardActivity | null) {
  if (!activity) return null
  return [
    activity.name,
    activity.timestamps?.start ?? "live",
    activity.details ?? "",
    activity.state ?? "",
    activity.assets?.large_image ?? "",
  ].join("|")
}

function BlurLyrics({ text }: { text: string }) {
  const reduceMotion = useReducedMotion()
  const characters = useMemo(() => Array.from(text), [text])

  return (
    <div className="live-lyrics" aria-label={text}>
      <motion.p className="live-lyrics__text" key={text}>
        {characters.map((character, index) => (
          <motion.span
            key={`${text}-${index}`}
            initial={reduceMotion ? false : { filter: "blur(10px)", opacity: 0, y: 50 }}
            animate={reduceMotion ? { filter: "blur(0px)", opacity: 1, y: 0 } : {
              filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
              opacity: [0, 0.5, 1],
              y: [50, -5, 0],
            }}
            transition={{ duration: 0.54, times: [0, 0.5, 1], delay: index * 0.032, ease: [0.16, 1, 0.3, 1] }}
          >
            {character === " " ? "\u00a0" : character}
          </motion.span>
        ))}
      </motion.p>
    </div>
  )
}

function LiveActivityTitle({ text }: { text: string }) {
  return (
    <h3>
      <SplitText
        key={text}
        text={text}
        tag="span"
        textAlign="left"
        splitType="chars"
        delay={36}
        duration={0.9}
        threshold={0}
        rootMargin="0px"
        from={{ opacity: 0, y: 14, filter: "blur(5px)" }}
        to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        className="live-activity-title"
      />
    </h3>
  )
}

function LiveAnimatedText({
  text,
  splitType = "words",
}: {
  text: string
  splitType?: "chars" | "words"
}) {
  return (
    <SplitText
      key={`${splitType}-${text}`}
      text={text}
      tag="span"
      textAlign="left"
      splitType={splitType}
      delay={splitType === "chars" ? 36 : 64}
      duration={0.82}
      threshold={0}
      rootMargin="0px"
      from={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className="live-animated-text"
    />
  )
}

function SpotifyCard({ track, labels }: { track: SpotifyPresence | null; labels: ReturnType<typeof copyFor> }) {
  return (
    <article className={`live-card live-card--spotify${track ? " is-active" : ""}`}>
      <header>
        <span><SiSpotify aria-hidden="true" /> <LiveAnimatedText text="Spotify" /></span>
        <span className="live-card__signal"><i /><LiveAnimatedText text={track ? labels.live : labels.waiting} /></span>
      </header>
      {track ? (
        <div className="live-media" key={track.track_id}>
          <div className="live-art"><img src={track.album_art_url} alt={`${labels.album}: ${track.album}`} /></div>
          <div className="live-copy">
            <span className="live-kicker"><LiveAnimatedText text={labels.nowListening} /></span>
            <LiveActivityTitle text={track.song} />
            <p><LiveAnimatedText text={track.artist} /></p>
            <small><LiveAnimatedText text={track.album} /></small>
            <ProgressBar timestamps={track.timestamps} />
            <a href={`https://open.spotify.com/track/${track.track_id}`} target="_blank" rel="noreferrer">
              <LiveAnimatedText text={labels.openSpotify} /><ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : (
        <EmptyState icon={SiSpotify as typeof Radio} title={labels.spotifyIdleTitle} body={labels.spotifyIdleBody} />
      )}
    </article>
  )
}

function AppleMusicCard({ activity, labels }: { activity: LanyardActivity | null; labels: ReturnType<typeof copyFor> }) {
  const incomingIdentity = appleTrackIdentity(activity)
  const [stableActivity, setStableActivity] = useState(activity)
  const stableIdentity = appleTrackIdentity(stableActivity)

  useEffect(() => {
    if (incomingIdentity !== stableIdentity) setStableActivity(activity)
  }, [activity, incomingIdentity, stableIdentity])

  const visibleActivity = incomingIdentity === stableIdentity ? stableActivity : activity
  const image = visibleActivity ? resolveActivityImage(visibleActivity) : undefined
  const lyrics = activity?.assets?.large_text ?? ""
  const search = visibleActivity
    ? `https://music.apple.com/search?term=${encodeURIComponent([visibleActivity.details, visibleActivity.state].filter(Boolean).join(" "))}`
    : "https://music.apple.com/"

  return (
    <article className={`live-card live-card--apple${activity ? " is-active" : ""}`}>
      <header>
        <span><SiApplemusic aria-hidden="true" /> <LiveAnimatedText text="Apple Music" /></span>
        <span className="live-card__signal"><i /><LiveAnimatedText text={activity ? labels.live : labels.waiting} /></span>
      </header>
      {visibleActivity ? (
        <div className="live-media" key={incomingIdentity}>
          <div className="live-art">
            {image ? <img src={image} alt="" /> : <SiApplemusic aria-hidden="true" />}
          </div>
          <div className="live-copy">
            <span className="live-kicker"><LiveAnimatedText text={labels.nowListening} /></span>
            <LiveActivityTitle text={visibleActivity.details || visibleActivity.assets?.large_text || "Apple Music"} />
            <p><LiveAnimatedText text={visibleActivity.state || visibleActivity.assets?.small_text || labels.publicActivity} /></p>
            {lyrics ? (
              <BlurLyrics text={lyrics} />
            ) : null}
            <ProgressBar timestamps={visibleActivity.timestamps} />
            <a href={search} target="_blank" rel="noreferrer">
              <LiveAnimatedText text={labels.openApple} /><ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : (
        <EmptyState icon={SiApplemusic as typeof Radio} title={labels.appleIdleTitle} body={labels.appleIdleBody} />
      )}
    </article>
  )
}

function GameCard({ activity, labels }: { activity: LanyardActivity | null; labels: ReturnType<typeof copyFor> }) {
  const image = activity ? resolveActivityImage(activity) : undefined
  return (
    <article className={`live-card live-card--game${activity ? " is-active" : ""}`}>
      <header>
        <span><Gamepad2 aria-hidden="true" /> <LiveAnimatedText text={labels.games} /></span>
        <span className="live-card__signal"><i /><LiveAnimatedText text={activity ? labels.live : labels.waiting} /></span>
      </header>
      {activity ? (
        <div className="live-media" key={`${activity.id}-${activity.timestamps?.start}`}>
          <div className="live-art live-art--game">
            {image ? <img src={image} alt="" /> : <Gamepad2 aria-hidden="true" />}
          </div>
          <div className="live-copy">
            <span className="live-kicker"><LiveAnimatedText text={labels.nowPlaying} /></span>
            <LiveActivityTitle text={activity.assets?.large_text || activity.name} />
            <p><LiveAnimatedText text={activity.details || labels.gameActivity} /></p>
            {activity.state ? <small><LiveAnimatedText text={activity.state} /></small> : null}
            {activity.timestamps?.start ? (
              <span className="live-elapsed"><Radio aria-hidden="true" /> <LiveAnimatedText text={labels.sessionLive} /></span>
            ) : null}
          </div>
        </div>
      ) : (
        <EmptyState icon={Gamepad2} title={labels.gameIdleTitle} body={labels.gameIdleBody} />
      )}
    </article>
  )
}

function AnimeCard({ activity, labels }: { activity: LanyardActivity | null; labels: ReturnType<typeof copyFor> }) {
  const title = activity ? animeTitleFromActivity(activity) : ""
  const fallbackImage = activity ? resolveActivityImage(activity) : undefined
  const [metadata, setMetadata] = useState<AnimeMetadata | null>(null)

  useEffect(() => {
    setMetadata(null)
    if (!title) return
    const controller = new AbortController()
    void fetch(`/api/anime?title=${encodeURIComponent(title)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { anime?: AnimeMetadata }) => setMetadata(payload.anime ?? null))
      .catch(() => undefined)
    return () => controller.abort()
  }, [title])

  const image = metadata?.coverImage || fallbackImage
  return (
    <article className={`live-card live-card--anime${activity ? " is-active" : ""}`}>
      <header>
        <span className="live-anime-brand">
          <Tv aria-hidden="true" />
          <span><LiveAnimatedText text="PapiGECode × Crunchyroll" /></span>
          <img src="https://cdn.simpleicons.org/crunchyroll/F47521" alt="Crunchyroll" />
        </span>
        <span className="live-card__signal"><i /><LiveAnimatedText text={activity ? labels.live : labels.waiting} /></span>
      </header>
      {activity ? (
        <div className="live-media" key={`${activity.id}-${activity.timestamps?.start}`}>
          <div className="live-art live-art--poster">
            {image ? <img src={image} alt="" /> : <Tv aria-hidden="true" />}
          </div>
          <div className="live-copy">
            <span className="live-kicker"><LiveAnimatedText text={labels.nowWatching} /></span>
            <LiveActivityTitle text={metadata?.title || title} />
            <p><LiveAnimatedText text={activity.state || activity.assets?.small_text || labels.animeActivity} /></p>
            {metadata ? (
              <small><LiveAnimatedText text={[metadata.year, metadata.episodes ? `${metadata.episodes} ep.` : null, metadata.score ? `${metadata.score}/100` : null].filter(Boolean).join(" · ")} /></small>
            ) : (
              <small className="live-loading"><Sparkles aria-hidden="true" /> {labels.findingDetails}</small>
            )}
            <ProgressBar timestamps={activity.timestamps} />
            <div className="live-links">
              {metadata?.crunchyrollUrl ? <a href={metadata.crunchyrollUrl} target="_blank" rel="noreferrer"><LiveAnimatedText text="Crunchyroll" /><ExternalLink aria-hidden="true" /></a> : null}
              {metadata?.anilistUrl ? <a href={metadata.anilistUrl} target="_blank" rel="noreferrer"><LiveAnimatedText text="AniList" /><ExternalLink aria-hidden="true" /></a> : null}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon={Tv} title={labels.animeIdleTitle} body={labels.animeIdleBody} />
      )}
    </article>
  )
}

function copyFor(language: "es" | "en") {
  return language === "es"
    ? {
        eyebrow: "Discord · Lanyard · Tiempo real",
        title: "Actividad en directo",
        intro: "Música, videojuegos y anime sincronizados desde mi presencia pública de Discord.",
        connected: "conexión en directo",
        fallback: "respaldo REST · 30 s",
        connecting: "conectando",
        unavailable: "reintentando conexión",
        unmonitored: "perfil sin monitorizar",
        publicOnly: "Solo se muestra actividad pública; no se usan tokens privados.",
        live: "en directo",
        waiting: "en espera",
        album: "Álbum",
        nowListening: "Escuchando ahora",
        nowPlaying: "Jugando ahora",
        nowWatching: "Viendo ahora",
        publicActivity: "Actividad musical pública",
        openSpotify: "Abrir en Spotify",
        openApple: "Abrir en Apple Music",
        games: "Videojuegos",
        gameActivity: "Actividad de juego detectada en Discord",
        animeActivity: "Actividad de anime detectada en Discord",
        sessionLive: "sesión activa",
        findingDetails: "Buscando ficha en AniList…",
        spotifyIdleTitle: "Spotify está en silencio",
        spotifyIdleBody: "La canción aparecerá aquí en cuanto sea pública en Discord.",
        appleIdleTitle: "Apple Music está en silencio",
        appleIdleBody: "La portada y el progreso aparecerán automáticamente.",
        gameIdleTitle: "Ahora mismo no estoy jugando",
        gameIdleBody: "Discord actualizará esta tarjeta al detectar un juego.",
        animeIdleTitle: "Ahora mismo no estoy viendo anime",
        animeIdleBody: "Crunchyroll o una actividad compatible aparecerá aquí en directo.",
      }
    : {
        eyebrow: "Discord · Lanyard · Realtime",
        title: "Live activity",
        intro: "Music, games and anime synced from my public Discord presence.",
        connected: "live connection",
        fallback: "REST fallback · 30 s",
        connecting: "connecting",
        unavailable: "retrying connection",
        unmonitored: "profile not monitored",
        publicOnly: "Only public activity is displayed; no private tokens are used.",
        live: "live",
        waiting: "waiting",
        album: "Album",
        nowListening: "Listening now",
        nowPlaying: "Playing now",
        nowWatching: "Watching now",
        publicActivity: "Public music activity",
        openSpotify: "Open in Spotify",
        openApple: "Open in Apple Music",
        games: "Gaming",
        gameActivity: "Game activity detected on Discord",
        animeActivity: "Anime activity detected on Discord",
        sessionLive: "active session",
        findingDetails: "Finding details on AniList…",
        spotifyIdleTitle: "Spotify is quiet",
        spotifyIdleBody: "The track will appear as soon as it is public on Discord.",
        appleIdleTitle: "Apple Music is quiet",
        appleIdleBody: "Artwork and progress will appear automatically.",
        gameIdleTitle: "I am not playing right now",
        gameIdleBody: "Discord will update this card when a game is detected.",
        animeIdleTitle: "I am not watching anime right now",
        animeIdleBody: "Crunchyroll or a compatible activity will appear here live.",
      }
}

export function LivePresence() {
  const { language } = useLanguage()
  const labels = copyFor(language)
  const { phase, presence, socketLive } = useLanyardPresence()
  const activities = presence?.activities ?? []

  const appleMusic = useMemo(
    () => activities.find((activity) => isMusicActivity(activity) && !/spotify/i.test(activity.name)) ?? null,
    [activities],
  )
  const anime = useMemo(() => activities.find(isAnimeActivity) ?? null, [activities])
  const game = useMemo(() => activities.find(isGameActivity) ?? null, [activities])

  const connectionLabel =
    phase === "ready"
      ? socketLive
        ? labels.connected
        : labels.fallback
      : phase === "connecting"
        ? labels.connecting
        : phase === "unmonitored"
          ? labels.unmonitored
          : labels.unavailable

  const status = presence?.discord_status ?? "offline"

  return (
    <section id="activity" className="live-presence-section border-t border-border/30 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="live-presence-heading animate-fade-in-up">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary sm:tracking-[0.35em]"><LiveAnimatedText text={labels.eyebrow} /></p>
            <h2><SplitText key={labels.title} text={labels.title} tag="span" textAlign="left" splitType="chars" delay={36} duration={0.9} threshold={0} rootMargin="0px" from={{ opacity: 0, y: 14, filter: "blur(5px)" }} to={{ opacity: 1, y: 0, filter: "blur(0px)" }} /></h2>
            <p><LiveAnimatedText text={labels.intro} /></p>
          </div>
          <div className="live-connection" data-status={status}>
            <span className="live-connection__signal"><i /><i /></span>
            <span><strong><LiveAnimatedText text={connectionLabel} /></strong><small><LiveAnimatedText text={presence?.discord_user?.display_name || presence?.discord_user?.global_name || "PapiGEGamer"} /></small></span>
            <Wifi aria-hidden="true" />
          </div>
        </div>

        <div className="live-grid">
          <SpotifyCard track={presence?.spotify ?? null} labels={labels} />
          <AppleMusicCard activity={appleMusic} labels={labels} />
          <GameCard activity={game} labels={labels} />
          <AnimeCard activity={anime} labels={labels} />
        </div>

        <p className="live-privacy"><ShieldCheck aria-hidden="true" /><LiveAnimatedText text={labels.publicOnly} /><span><LiveAnimatedText text="LANYARD / DISCORD / ANILIST" /></span></p>
      </div>
    </section>
  )
}
