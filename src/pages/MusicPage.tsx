import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Activity, ArrowDown, ArrowUpRight, Disc3, Heart, Music2, Radio, ShieldCheck, Wifi, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { SpotifyEmbed } from '../components/SpotifyEmbed'
import { formatLanyardTime, useLanyardPresence, useSpotifyProgress } from '../hooks/useLanyardPresence'
import './MusicPage.css'

export function MusicPage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const { phase, socketLive, track } = useLanyardPresence()
  const progress = useSpotifyProgress(track)
  const [favoriteOpen, setFavoriteOpen] = useState(false)

  const labels = locale === 'es' ? {
    eyebrow: 'Spotify · Presencia · En vivo',
    eyebrowReady: 'Spotify · Presencia · Preparada',
    title: 'Lo que suena\nahora mismo.',
    intro: 'Si estoy escuchando Spotify, aquí aparece la canción, el álbum y el progreso en directo.',
    jump: 'Abrir reproductor',
    now: 'Ahora escuchando',
    live: 'Sincronización WebSocket',
    polling: 'Sincronización cada 15 s',
    ready: 'Integración preparada',
    readySignal: 'READY SIGNAL',
    connecting: 'Conectando con la presencia pública…',
    waitingTitle: 'Esperando la confirmación de Lanyard.',
    waitingBody: 'La conexión está esperando la actividad pública de mi perfil de Discord.',
    activate: 'Ver comunidad de Lanyard',
    privacy: 'Solo se muestra la canción que aparece públicamente en mi perfil.',
    idleTitle: 'Nada público sonando ahora.',
    idleBody: 'La conexión está activa. Cuando Spotify aparezca en mi perfil de Discord, la canción se mostrará aquí automáticamente.',
    errorTitle: 'No se ha podido abrir la conexión.',
    errorBody: 'Volverá a conectarse automáticamente en unos segundos.',
    album: 'Álbum',
    openSpotify: 'Abrir en Spotify',
    playerTitle: 'Reproductor oficial de Spotify',
    playerNote: 'Pulsa play en el reproductor oficial. Spotify gestiona el audio; el volumen se ajusta desde el dispositivo o el navegador.',
    sourceEyebrow: 'Mi Spotify',
    sourceTitle: 'La canción cambia conmigo.',
    sourceBody: 'Cuando empiezo o paro una canción en Spotify, esta página refleja el cambio. El reproductor oficial permite escucharla directamente.',
    signals: ['WebSocket en vivo', 'Sin historial', 'Solo actividad pública'],
    favoriteEyebrow: 'Favorito personal',
    favoriteTitle: 'Bad Bunny',
    favoriteBody: 'El artista que más acompaña mi rotación: energía, detalle y una identidad imposible de confundir.',
    favoriteLink: 'Escuchar en Spotify',
  } : {
    eyebrow: 'Spotify · Presence · Live',
    eyebrowReady: 'Spotify · Presence · Ready',
    title: 'What is playing\nright now.',
    intro: 'If Spotify is active on my Discord profile, the track, album and progress appear here live.',
    jump: 'Open player',
    now: 'Now listening',
    live: 'WebSocket sync',
    polling: '15 s sync',
    ready: 'Presence connected',
    readySignal: 'READY SIGNAL',
    connecting: 'Connecting to public presence…',
    waitingTitle: 'Waiting for Lanyard confirmation.',
    waitingBody: 'Waiting for Spotify activity to become public on my Discord profile.',
    activate: 'View the Lanyard community',
    privacy: 'Only the song shown publicly on my profile is displayed.',
    idleTitle: 'Nothing public is playing now.',
    idleBody: 'The connection is active. When Spotify appears on my Discord profile, the track will show here automatically.',
    errorTitle: 'The live connection could not be opened.',
    errorBody: 'It will reconnect automatically in a few seconds.',
    album: 'Album',
    openSpotify: 'Open in Spotify',
    playerTitle: 'Official Spotify player',
    playerNote: 'Press play in the official player. Spotify manages playback; volume is adjusted through the device or browser.',
    sourceEyebrow: 'My Spotify',
    sourceTitle: 'The track changes with me.',
    sourceBody: 'When I start or stop a track on Spotify, this page reflects it. The official player lets visitors listen directly.',
    signals: ['Live WebSocket', 'No history', 'Public activity only'],
    favoriteEyebrow: 'Personal favourite',
    favoriteTitle: 'Bad Bunny',
    favoriteBody: 'The artist that most often accompanies my rotation: energy, detail and an unmistakable identity.',
    favoriteLink: 'Listen on Spotify',
  }

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  const isLive = phase === 'ready'
  const connectionLabel = isLive ? (socketLive ? labels.live : labels.polling) : phase === 'unmonitored' ? labels.ready : labels.connecting

  useEffect(() => {
    if (!favoriteOpen) return undefined
    const timer = window.setTimeout(() => setFavoriteOpen(false), 5_500)
    return () => window.clearTimeout(timer)
  }, [favoriteOpen])

  return (
    <div className="music-page">
      <section className="page-hero music-hero">
        <m.div className="page-hero__copy" initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{isLive ? labels.eyebrow : labels.eyebrowReady}</p>
          <h1>{labels.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{labels.intro}</p>
        </m.div>

        <m.div className="music-hero__visual" initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : 0.14, duration: reduceMotion ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          <div className="music-orbit music-orbit--outer" />
          <div className="music-orbit music-orbit--inner" />
          <div className="music-hero__disc"><Disc3 size={88} /></div>
          <span><Activity size={15} />{isLive ? 'LIVE SIGNAL' : labels.readySignal}</span>
        </m.div>

        <a className="page-hero__scroll" href="#reproductor"><ArrowDown size={15} aria-hidden="true" />{labels.jump}</a>
        <button className="music-favorite-trigger" type="button" onClick={() => setFavoriteOpen(true)} aria-label={`${labels.favoriteEyebrow}: ${labels.favoriteTitle}`}>
          <img src="/media/music/bad-bunny-new.jpg" alt="" width="723" height="900" />
          <span><Heart size={13} fill="currentColor" aria-hidden="true" />{labels.favoriteTitle}</span>
        </button>
      </section>

      <AnimatePresence>
        {favoriteOpen && (
          <m.aside className="music-favorite-popover" initial={{ opacity: 0, y: -14, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <img src="/media/music/bad-bunny-new.jpg" alt="Bad Bunny" width="723" height="900" />
            <div>
              <p className="eyebrow">{labels.favoriteEyebrow}</p>
              <h2>{labels.favoriteTitle}</h2>
              <p>{labels.favoriteBody}</p>
              <a href="https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X" target="_blank" rel="noreferrer">{labels.favoriteLink}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <button type="button" onClick={() => setFavoriteOpen(false)} aria-label={locale === 'es' ? 'Cerrar' : 'Close'}><X size={15} /></button>
          </m.aside>
        )}
      </AnimatePresence>

      <section className="section music-live-section" id="reproductor">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">Spotify · PapiGEGamer</p>
            <h2>{labels.now}</h2>
          </div>
          <p className="section-heading__intro">{labels.sourceBody}</p>
        </m.div>

        <m.div className={`now-playing now-playing--${phase} ${track ? 'now-playing--active' : ''}`} {...reveal}>
          <header className="now-playing__header">
            <span><span className="status-dot" aria-hidden="true" />{connectionLabel}</span>
            <span><Wifi size={14} aria-hidden="true" />LANYARD / DISCORD</span>
          </header>

          {phase === 'connecting' && (
            <div className="now-playing__state">
              <span className="music-loader" aria-hidden="true"><Music2 size={30} /></span>
              <h3>{labels.connecting}</h3>
            </div>
          )}

          {phase === 'unmonitored' && (
            <div className="now-playing__state now-playing__state--setup">
              <span className="music-loader" aria-hidden="true"><Radio size={30} /></span>
              <div>
                <h3>{labels.waitingTitle}</h3>
                <p>{labels.waitingBody}</p>
                <a href="https://discord.gg/lanyard" target="_blank" rel="noreferrer">{labels.activate}<ArrowUpRight size={16} aria-hidden="true" /></a>
                <small><ShieldCheck size={14} aria-hidden="true" />{labels.privacy}</small>
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div className="now-playing__state">
              <span className="music-loader" aria-hidden="true"><Radio size={30} /></span>
              <div><h3>{labels.errorTitle}</h3><p>{labels.errorBody}</p></div>
            </div>
          )}

          {phase === 'ready' && !track && (
            <div className="now-playing__state">
              <span className="music-loader" aria-hidden="true"><Disc3 size={34} /></span>
              <div><h3>{labels.idleTitle}</h3><p>{labels.idleBody}</p></div>
            </div>
          )}

          {phase === 'ready' && track && (
            <div className="now-playing__track">
              <div className="now-playing__art">
                <img src={track.album_art_url} alt={`${labels.album}: ${track.album}`} width="640" height="640" />
                <span aria-hidden="true"><Disc3 size={64} /></span>
              </div>
              <div className="now-playing__copy">
                <span className="eyebrow">{labels.now}</span>
                <h3>{track.song}</h3>
                <p>{track.artist}</p>
                <small>{labels.album} · {track.album}</small>
                <div className="now-playing__progress" aria-label={`${formatLanyardTime(progress.elapsed)} / ${formatLanyardTime(progress.duration)}`}>
                  <span><i style={{ width: `${progress.percent}%` }} /></span>
                  <small>{formatLanyardTime(progress.elapsed)}</small>
                  <small>{formatLanyardTime(progress.duration)}</small>
                </div>
                <a href={`https://open.spotify.com/track/${track.track_id}`} target="_blank" rel="noreferrer">{labels.openSpotify}<ArrowUpRight size={16} aria-hidden="true" /></a>
                <div className="now-playing__embed">
                  <SpotifyEmbed trackId={track.track_id} title={`${labels.playerTitle}: ${track.song}`} compact />
                  <small>{labels.playerNote}</small>
                </div>
              </div>
            </div>
          )}
        </m.div>
      </section>

      <section className="music-source">
        <m.div className="music-source__copy" {...reveal}>
          <p className="eyebrow">{labels.sourceEyebrow}</p>
          <h2>{labels.sourceTitle}</h2>
          <p>{labels.sourceBody}</p>
        </m.div>
        <m.div className="music-source__signals" {...reveal}>
          {labels.signals.map((signal, index) => (
            <article key={signal}><span>{String(index + 1).padStart(2, '0')}</span><strong>{signal}</strong><i /></article>
          ))}
        </m.div>
      </section>

      <ContactSection content={content} />
    </div>
  )
}
