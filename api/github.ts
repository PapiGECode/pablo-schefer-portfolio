import { apiSecurityHeaders, enforceRateLimit, jsonResponse } from '../server/security.js'

const githubApi = 'https://api.github.com'
const githubUser = 'PapiGECode'
const requestTimeoutMs = 6_000
const maxRepositories = 6

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function safeString(value: unknown, maxLength = 500) {
  if (typeof value !== 'string') return null
  const normalized = Array.from(value.normalize('NFKC'))
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code > 31 && code !== 127
    })
    .join('')
    .trim()
  return normalized ? normalized.slice(0, maxLength) : null
}

function safeInteger(value: unknown) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0
}

function safeGithubUrl(value: unknown) {
  const raw = safeString(value, 2_048)
  if (!raw) return null

  try {
    const url = new URL(raw)
    return url.protocol === 'https:' && url.hostname === 'github.com' ? url.toString() : null
  } catch {
    return null
  }
}

function safeDate(value: unknown) {
  const raw = safeString(value, 80)
  if (!raw) return null
  const timestamp = Date.parse(raw)
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null
}

function normalizeProfile(payload: unknown) {
  if (!isRecord(payload)) return null
  const login = safeString(payload.login, 80)
  const profileUrl = safeGithubUrl(payload.html_url)
  if (!login || !profileUrl) return null

  return {
    login,
    name: safeString(payload.name, 120),
    bio: safeString(payload.bio, 300),
    profileUrl,
    publicRepositories: safeInteger(payload.public_repos),
    followers: safeInteger(payload.followers),
    updatedAt: safeDate(payload.updated_at),
  }
}

function normalizeRepository(payload: unknown) {
  if (!isRecord(payload) || payload.private === true || payload.disabled === true || payload.archived === true || payload.fork === true) return null

  const name = safeString(payload.name, 120)
  const url = safeGithubUrl(payload.html_url)
  if (!name || !url) return null

  return {
    name,
    description: safeString(payload.description, 360),
    url,
    language: safeString(payload.language, 60),
    stars: safeInteger(payload.stargazers_count),
    forks: safeInteger(payload.forks_count),
    updatedAt: safeDate(payload.pushed_at) ?? safeDate(payload.updated_at),
  }
}

function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'PabloScheferPortfolio/1.0 (+https://www.pabloschefer.com)',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function githubRequest(path: string) {
  const response = await fetch(`${githubApi}${path}`, {
    headers: githubHeaders(),
    cache: 'no-store',
    signal: AbortSignal.timeout(requestTimeoutMs),
  })

  if (!response.ok) throw new Error('github_unavailable')
  return response.json() as Promise<unknown>
}

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, { scope: 'github', limit: 90, windowMs: 60_000 })
  if (limited) return limited

  try {
    const [profilePayload, repositoriesPayload] = await Promise.all([
      githubRequest(`/users/${githubUser}`),
      githubRequest(`/users/${githubUser}/repos?sort=updated&direction=desc&per_page=100&type=owner`),
    ])

    const profile = normalizeProfile(profilePayload)
    const allRepositories = Array.isArray(repositoriesPayload)
      ? repositoriesPayload
          .map(normalizeRepository)
          .filter((repository): repository is NonNullable<ReturnType<typeof normalizeRepository>> => Boolean(repository))
          .sort((left, right) => Date.parse(right.updatedAt ?? '') - Date.parse(left.updatedAt ?? ''))
      : []
    const repositories = allRepositories.slice(0, maxRepositories)

    if (!profile) throw new Error('invalid_github_profile')

    return Response.json(
      {
        profile,
        repositories,
        totals: {
          stars: allRepositories.reduce((total, repository) => total + repository.stars, 0),
        },
        fetchedAt: new Date().toISOString(),
        source: 'GitHub REST API',
      },
      {
        headers: {
          ...apiSecurityHeaders,
          'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=604800',
          'Vercel-CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400, stale-if-error=604800',
        },
      },
    )
  } catch {
    return jsonResponse(
      { error: 'github_temporarily_unavailable' },
      503,
      {
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-if-error=604800',
        'Vercel-CDN-Cache-Control': 'public, max-age=60, stale-if-error=604800',
      },
    )
  }
}
