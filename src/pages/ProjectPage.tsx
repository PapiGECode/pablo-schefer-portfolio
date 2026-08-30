import { ArrowUpRight, Boxes, CheckCircle2, Code2, ExternalLink, MessageCircle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { communityAssets } from '../data/communityAssets'
import './ProjectPage.css'

type ProjectId = 'fnlb' | 'kernelos'

const projects = {
  fnlb: {
    accent: '#2e7bdc',
    image: communityAssets.fnlbCover,
    logo: communityAssets.fnlbLogo,
    links: [
      { href: 'https://fnlb.net/', es: { label: 'Sitio oficial de FNLB', detail: 'Bot lobbies, novedades y recursos' }, en: { label: 'FNLB official site', detail: 'Bot lobbies, updates and resources' } },
      { href: 'https://app.fnlb.net/', es: { label: 'Abrir la aplicación web', detail: 'Gestiona tus bots desde el navegador' }, en: { label: 'Open the web app', detail: 'Manage your bots from the browser' } },
      { href: 'https://discord.com/invite/ZN9SgnPTDK', es: { label: 'Comunidad de Discord', detail: 'Soporte y conversación en directo' }, en: { label: 'Discord community', detail: 'Live support and conversation' } },
    ],
    es: {
      eyebrow: 'Proyecto · Producto · Comunidad',
      title: 'FNLB',
      intro: 'Una plataforma de lobby bots para Fortnite: crea, configura y utiliza bots desde una aplicación web pensada para jugar, practicar y completar desafíos.',
      role: 'Colaboración y moderación',
      body: 'Mi trabajo en FNLB está entre la moderación y el producto: escucho incidencias, ayudo a mantener el orden y acerco cada mejora a las personas que utilizan la plataforma.',
      facts: ['Comunidad cercana a 60K', 'Aplicación web y móvil', 'Bots personalizados', 'Soporte y moderación'],
      cta: 'Visitar FNLB',
      back: 'Ver todas las comunidades',
    },
    en: {
      eyebrow: 'Project · Product · Community',
      title: 'FNLB',
      intro: 'A Fortnite lobby-bot platform for creating, configuring and using custom bots from a web app built for play, practice and challenges.',
      role: 'Collaboration and moderation',
      body: 'My FNLB work sits between moderation and product: listening to issues, keeping the community organised and helping every improvement reach the people using the platform.',
      facts: ['Community near 60K', 'Web and mobile app', 'Custom lobby bots', 'Support and moderation'],
      cta: 'Visit FNLB',
      back: 'View all communities',
    },
  },
  kernelos: {
    accent: '#c93636',
    image: '/media/projects/kernelos-cover.webp',
    logo: communityAssets.kernelosLogo,
    links: [
      { href: 'https://kernelos.org/#downloads', es: { label: 'Descargar KernelOS', detail: 'Ediciones oficiales para Windows' }, en: { label: 'Download KernelOS', detail: 'Official Windows editions' } },
      { href: 'https://kernelos.org/changelogs/', es: { label: 'Ver versiones y cambios', detail: 'Notas de versión, benchmarks y compatibilidad' }, en: { label: 'Versions and changelogs', detail: 'Release notes, benchmarks and compatibility' } },
      { href: 'https://kernelos.org/', es: { label: 'Sitio oficial', detail: 'Documentación, KRNLGame y comunidad' }, en: { label: 'Official website', detail: 'Docs, KRNLGame and community' } },
    ],
    es: {
      eyebrow: 'Proyecto · CustomOS · Comunidad',
      title: 'KernelOS',
      intro: 'Una CustomOS para gaming, baja latencia y estabilidad: un entorno de Windows afinado con investigación, herramientas y una comunidad técnica activa.',
      role: 'Colaborador del ecosistema',
      body: 'Colaboro entre la comunidad y la evolución del proyecto: doy contexto, ayudo con el soporte y acompaño una CustomOS que busca mejoras medibles sin perder estabilidad.',
      facts: ['CustomOS para gaming', 'Baja latencia y FPS estables', 'KRNLGame incluido', 'Comunidad nueva 50K+'],
      cta: 'Visitar KernelOS',
      back: 'Ver todas las comunidades',
    },
    en: {
      eyebrow: 'Project · Custom OS · Community',
      title: 'KernelOS',
      intro: 'A Custom OS focused on gaming, low latency and stability: a researched Windows environment with focused tools and an active technical community.',
      role: 'Ecosystem contributor',
      body: 'My contribution sits between community experience and product evolution. KernelOS connects optimisation, gaming culture and support—where documentation and context matter as much as the technical work.',
      facts: ['Gaming Custom OS', 'Low latency and stable FPS', 'KRNLGame included', 'New community 50K+'],
      cta: 'Visit KernelOS',
      back: 'View all communities',
    },
  },
} as const

export function ProjectPage({ projectId, locale }: { projectId: ProjectId; locale: Locale }) {
  const project = projects[projectId]
  const copy = project[locale]
  return (
    <div className="project-page" style={{ '--project-accent': project.accent } as CSSProperties}>
      <section className="project-hero">
        <div className="project-hero__media">
          <img src={project.image} alt="" width="1600" height="900" />
          <span />
        </div>
        <div className="project-hero__body">
          <div className="project-hero__identity">
            <img className="project-hero__logo" src={project.logo} alt={`${copy.title} logo`} width="256" height="256" />
            <div>
              <span className="project-hero__identity-label">{locale === 'es' ? 'Proyecto destacado' : 'Featured project'}</span>
              <strong>{copy.title}</strong>
            </div>
          </div>
          <div className="project-hero__grid">
            <div className="project-hero__copy">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1>{copy.title}</h1>
              <p>{copy.intro}</p>
              <a href={project.links[0].href} target="_blank" rel="noreferrer">{copy.cta}<ArrowUpRight size={16} /></a>
            </div>
            <div className="project-links" aria-label={locale === 'es' ? 'Enlaces del proyecto' : 'Project links'}>
              {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span><strong>{link[locale].label}</strong><small>{link[locale].detail}</small></span><ExternalLink size={15} /></a>)}
            </div>
          </div>
        </div>
      </section>
      <section className="section project-story">
        <div>
          <span><MessageCircle size={17} />{copy.role}</span>
          <h2>{copy.body}</h2>
        </div>
        <div className="project-facts">
          {copy.facts.map((fact, index) => <article key={fact}><span>{String(index + 1).padStart(2, '0')}</span>{index % 2 === 0 ? <Code2 size={20} /> : <Boxes size={20} />}<strong>{fact}</strong><CheckCircle2 size={15} /></article>)}
        </div>
      </section>
      <div className="project-back"><Link to="/comunidades">{copy.back}<ArrowUpRight size={15} /></Link></div>
    </div>
  )
}
