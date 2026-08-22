import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, GitBranch, GitFork, Star } from 'lucide-react'
import type { Locale } from '../content'
import './GitHubShowcase.css'

type GitHubRepository = {
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  forks: number
  updatedAt: string | null
}

type GitHubData = {
  profile: {
    login: string
    name: string | null
    bio: string | null
    profileUrl: string
    publicRepositories: number
    followers: number
    updatedAt: string | null
  }
  repositories: GitHubRepository[]
  totals: { stars: number }
  fetchedAt: string
  source: 'GitHub REST API'
}

type GitHubState =
  | { status: 'loading'; data: null }
  | { status: 'ready'; data: GitHubData }
  | { status: 'unavailable'; data: null }

const githubProfileUrl = 'https://github.com/PapiGEGamer-web'

const labels = {
  es: {
    eyebrow: 'GitHub · Open Source',
    title: 'Código que también vive fuera del portfolio.',
    intro: 'Una lectura directa de mi perfil público: repositorios, tecnologías y actividad reciente, sin cifras escritas a mano.',
    repositories: 'Repositorios públicos',
    stars: 'Estrellas recibidas',
    followers: 'Seguidores',
    updated: 'Actualizado',
    open: 'Abrir repositorio',
    profile: 'Ver perfil completo',
    noDescription: 'Repositorio público de PapiGEGamer-web.',
    unavailable: 'La actividad no está disponible ahora mismo. Puedes consultar el perfil directamente en GitHub.',
    powered: 'Powered by the GitHub REST API',
    loading: 'Cargando actividad pública de GitHub',
  },
  en: {
    eyebrow: 'GitHub · Open Source',
    title: 'Code that also lives beyond this portfolio.',
    intro: 'A direct view of my public profile: repositories, technologies and recent activity, with no hand-written metrics.',
    repositories: 'Public repositories',
    stars: 'Stars received',
    followers: 'Followers',
    updated: 'Updated',
    open: 'Open repository',
    profile: 'View full profile',
    noDescription: 'Public repository by PapiGEGamer-web.',
    unavailable: 'Activity is unavailable right now. You can still visit the profile directly on GitHub.',
    powered: 'Powered by the GitHub REST API',
    loading: 'Loading public GitHub activity',
  },
} as const

function isGitHubData(value: unknown): value is GitHubData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<GitHubData>
  return Boolean(
    candidate.profile
    && typeof candidate.profile.login === 'string'
    && typeof candidate.profile.profileUrl === 'string'
    && Array.isArray(candidate.repositories)
    && candidate.totals
    && typeof candidate.totals.stars === 'number',
  )
}

function formatDate(value: string | null, locale: Locale) {
  if (!value) return '—'
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function GitHubShowcase({ locale }: { locale: Locale }) {
  const copy = labels[locale]
  const reduceMotion = useReducedMotion()
  const [state, setState] = useState<GitHubState>({ status: 'loading', data: null })

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const response = await fetch('/api/github', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('github_unavailable')
        const payload: unknown = await response.json()
        if (!isGitHubData(payload)) throw new Error('invalid_github_payload')
        setState({ status: 'ready', data: payload })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState({ status: 'unavailable', data: null })
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <section className="section github-showcase" id="github" aria-labelledby="github-title">
      <m.div className="section-heading section-heading--split" {...reveal}>
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="github-title">{copy.title}</h2>
        </div>
        <p className="section-heading__intro">{copy.intro}</p>
      </m.div>

      <m.div className="github-showcase__surface" {...reveal}>
        {state.status === 'loading' ? (
          <div className="github-showcase__loading" role="status" aria-label={copy.loading}>
            <div className="github-showcase__skeleton github-showcase__skeleton--profile" />
            <div className="github-showcase__skeleton" />
            <div className="github-showcase__skeleton" />
            <div className="github-showcase__skeleton" />
          </div>
        ) : state.status === 'ready' ? (
          <>
            <div className="github-profile">
              <div className="github-profile__identity">
                <span className="github-profile__mark" aria-hidden="true"><GitBranch size={30} strokeWidth={1.45} /></span>
                <div>
                  <span>{state.data.profile.name ?? state.data.profile.login}</span>
                  <strong>@{state.data.profile.login}</strong>
                </div>
              </div>
              <p>{state.data.profile.bio ?? copy.intro}</p>
              <dl className="github-profile__stats">
                <div><dt>{copy.repositories}</dt><dd>{state.data.profile.publicRepositories}</dd></div>
                <div><dt>{copy.stars}</dt><dd>{state.data.totals.stars}</dd></div>
                <div><dt>{copy.followers}</dt><dd>{state.data.profile.followers}</dd></div>
              </dl>
              <a href={state.data.profile.profileUrl} target="_blank" rel="noreferrer">
                {copy.profile}<ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="github-repositories">
              {state.data.repositories.map((repository, index) => (
                <m.a
                  className="github-repository"
                  href={repository.url}
                  target="_blank"
                  rel="noreferrer"
                  key={repository.url}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: reduceMotion ? 0 : 0.52 }}
                >
                  <div className="github-repository__top">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </div>
                  <h3>{repository.name}</h3>
                  <p>{repository.description ?? copy.noDescription}</p>
                  <div className="github-repository__meta">
                    {repository.language ? <span className="github-repository__language"><i aria-hidden="true" />{repository.language}</span> : null}
                    <span><Star size={13} aria-hidden="true" />{repository.stars}</span>
                    {repository.forks > 0 ? <span><GitFork size={13} aria-hidden="true" />{repository.forks}</span> : null}
                  </div>
                  <div className="github-repository__footer">
                    <span>{copy.updated} {formatDate(repository.updatedAt, locale)}</span>
                    <strong>{copy.open}</strong>
                  </div>
                </m.a>
              ))}
            </div>
          </>
        ) : (
          <div className="github-showcase__fallback" role="status">
            <GitBranch size={32} strokeWidth={1.35} aria-hidden="true" />
            <p>{copy.unavailable}</p>
            <a href={githubProfileUrl} target="_blank" rel="noreferrer">{copy.profile}<ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        )}

        <a className="github-showcase__powered" href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
          <GitBranch size={13} aria-hidden="true" />{copy.powered}<ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </m.div>
    </section>
  )
}
