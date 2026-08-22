import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowDown, Headphones, MessageCircle, Radio, ShieldCheck } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { DiscordLivePanel } from '../components/DiscordLivePanel'
import { communityAssets } from '../data/communityAssets'

export function FnlbLivePage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const page = content.edgar
  const copy = locale === 'es'
    ? { eyebrow: 'Comunidad destacada — FNLB', title: 'FNLB', intro: 'Una ventana pública a los canales de voz y la actividad visible de la comunidad FNLB.', roleLabel: 'Mi rol', role: 'Moderador actual', liveEyebrow: 'Discord · Monitor automático', liveTitle: 'Actividad pública ahora.', liveIntro: 'Miembros, actividad y canales de voz visibles en un panel que se actualiza mientras navegas.' }
    : { eyebrow: 'Featured community — FNLB', title: 'FNLB', intro: 'A public window into FNLB voice channels and visible community activity.', roleLabel: 'My role', role: 'Current moderator', liveEyebrow: 'Discord · Automatic monitor', liveTitle: 'Public activity now.', liveIntro: 'Visible members, activity and voice channels in a panel that refreshes while you browse.' }
  const cleanTitle = copy.title.replace(/[.]+$/g, '')
  return <>
    <section className="page-hero page-hero--edgar">
      <m.div className="page-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
        <p className="eyebrow">{copy.eyebrow}</p><h1>{cleanTitle}</h1><p>{copy.intro}</p>
        <div className="edgar-role"><span><ShieldCheck size={17} aria-hidden="true" />{copy.roleLabel}</span><strong>{copy.role}</strong></div>
      </m.div>
      <m.div className="discord-orbit" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} aria-hidden="true">
        <div className="discord-orbit__core"><img src={communityAssets.fnlbLogo} alt="" width="256" height="256" /></div>
        <span className="discord-orbit__node discord-orbit__node--one"><MessageCircle size={18} /></span><span className="discord-orbit__node discord-orbit__node--two"><Headphones size={18} /></span><span className="discord-orbit__node discord-orbit__node--three"><Radio size={18} /></span>
      </m.div>
      <a className="page-hero__scroll" href="#live"><ArrowDown size={15} aria-hidden="true" />{locale === 'es' ? 'Panel en directo' : 'Live widget'}</a>
    </section>
    <section className="section edgar-live-section" id="live">
      <m.div className="section-heading section-heading--split" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }}>
        <div><p className="eyebrow">{copy.liveEyebrow}</p><h2>{copy.liveTitle}</h2></div><p className="section-heading__intro">{copy.liveIntro}</p>
      </m.div>
      <DiscordLivePanel content={{ ...content, edgar: { ...page, title: cleanTitle, liveEyebrow: copy.liveEyebrow, liveTitle: copy.liveTitle, liveIntro: copy.liveIntro } }} locale={locale} guildId="fnlb" />
    </section>
    <ContactSection content={content} />
  </>
}
