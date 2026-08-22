import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowDown, Headphones, MessageCircle, Radio, ShieldCheck } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { DiscordLivePanel, type LiveGuildId } from '../components/DiscordLivePanel'
import { communityAssets } from '../data/communityAssets'

type LiveCommunityPageProps = {
  content: SiteCopy
  locale: Locale
  community: Exclude<LiveGuildId, 'edgar' | 'fnlb'>
}

const pageData = {
  valorant: {
    title: 'VALORANT ESP',
    eyebrow: 'Comunidad destacada — VALORANT ESP',
    intro: 'Una ventana pública a los canales de voz y la actividad visible de la comunidad española de VALORANT.',
    logo: communityAssets.valorantEsLogo,
    liveTitle: 'Actividad pública ahora.',
    liveIntro: 'Miembros, actividad y canales de voz visibles en un panel que se actualiza mientras navegas.',
  },
  nate: {
    title: 'Nate Gentile',
    eyebrow: 'Comunidad destacada — Nate Gentile',
    intro: 'Una ventana pública a los canales de voz y la actividad visible de la comunidad de Nate Gentile.',
    logo: communityAssets.nateLogo,
    liveTitle: 'La comunidad está en directo.',
    liveIntro: 'Consulta los canales con actividad y los participantes visibles de la comunidad mientras navegas.',
  },
  gw2: {
    title: 'GW2',
    eyebrow: 'Comunidad destacada — GW2',
    intro: 'Una ventana pública a la actividad visible de una de las comunidades gaming más grandes de Discord.',
    logo: communityAssets.gw2Logo,
    liveTitle: 'La comunidad está en directo.',
    liveIntro: 'Discord publica una instantánea limitada de canales y participantes; el panel se actualiza automáticamente.',
  },
} as const

export function LiveCommunityPage({ content, locale, community }: LiveCommunityPageProps) {
  const reduceMotion = useReducedMotion()
  const data = pageData[community]
  const historicalRole = community === 'gw2'
  const copy = locale === 'es'
    ? data
    : {
        ...data,
        eyebrow: community === 'valorant' ? 'Featured community — VALORANT ESP' : community === 'nate' ? 'Featured community — Nate Gentile' : 'Featured community — GW2',
        intro: community === 'valorant' ? 'A public window into the voice channels and visible activity of the Spanish VALORANT community.' : community === 'nate' ? 'A public window into Nate Gentile community activity and voice channels.' : 'A public window into the visible activity of a large gaming community.',
        liveTitle: community === 'valorant' ? 'Public activity now.' : 'The community is live.',
        liveIntro: 'Visible members, activity and voice channels in a panel that refreshes while you browse.',
      }

  return <>
    <section className={`page-hero page-hero--edgar page-hero--live-${community}`}>
      <m.div className="page-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        <div className="edgar-role"><span><ShieldCheck size={17} aria-hidden="true" />{locale === 'es' ? 'Mi rol' : 'My role'}</span><strong>{historicalRole ? (locale === 'es' ? 'Moderador anterior' : 'Previous moderator') : (locale === 'es' ? 'Moderador actual' : 'Current moderator')}</strong></div>
      </m.div>
      <m.div className="discord-orbit" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} aria-hidden="true">
        <div className="discord-orbit__core"><img src={data.logo} alt="" width="256" height="256" /></div>
        <span className="discord-orbit__node discord-orbit__node--one"><MessageCircle size={18} /></span>
        <span className="discord-orbit__node discord-orbit__node--two"><Headphones size={18} /></span>
        <span className="discord-orbit__node discord-orbit__node--three"><Radio size={18} /></span>
      </m.div>
      <a className="page-hero__scroll" href="#live"><ArrowDown size={15} aria-hidden="true" />{locale === 'es' ? 'Panel en directo' : 'Live widget'}</a>
    </section>

    <section className={`section edgar-live-section community-live-section--${community}`} id="live">
      <m.div className="section-heading section-heading--split" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }}>
        <div><p className="eyebrow">Discord · Monitor automático</p><h2>{copy.liveTitle}</h2></div>
        <p className="section-heading__intro">{copy.liveIntro}</p>
      </m.div>
      <DiscordLivePanel content={content} locale={locale} guildId={community} displayName={data.title} />
    </section>
    <ContactSection content={content} />
  </>
}
