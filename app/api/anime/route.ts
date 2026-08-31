import { NextRequest, NextResponse } from "next/server"

const ANILIST_ENDPOINT = "https://graphql.anilist.co"
const MAX_TITLE_LENGTH = 120

const query = `
  query AnimeByTitle($search: String!) {
    Page(page: 1, perPage: 1) {
      media(search: $search, type: ANIME, isAdult: false, sort: [SEARCH_MATCH]) {
        id
        title { romaji english native userPreferred }
        description(asHtml: false)
        coverImage { extraLarge large medium }
        averageScore
        episodes
        seasonYear
        startDate { year }
        siteUrl
        externalLinks { site url isDisabled }
      }
    }
  }
`

type RecordValue = Record<string, unknown>

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function text(value: unknown, max = 2_000) {
  if (typeof value !== "string") return null
  const normalized = value.trim()
  return normalized ? normalized.slice(0, max) : null
}

function integer(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  const normalized = Math.round(value)
  return normalized >= min && normalized <= max ? normalized : null
}

function httpsUrl(value: unknown) {
  const raw = text(value)
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

function cleanSynopsis(value: unknown) {
  const raw = text(value, 12_000)
  if (!raw) return null
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim()
    .slice(0, 3_000)
}

export async function GET(request: NextRequest) {
  const rawTitle = request.nextUrl.searchParams.get("title")
  const title = rawTitle?.normalize("NFKC").replace(/\s+/g, " ").trim()
  if (!title || title.length > MAX_TITLE_LENGTH || /[\u0000-\u001f\u007f]/.test(title)) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 })
  }

  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "PapiGECode/1.0 (+https://pabloschefer.com)",
      },
      body: JSON.stringify({ query, variables: { search: title } }),
      signal: AbortSignal.timeout(6_000),
      next: { revalidate: 86_400 },
    })
    if (!response.ok) {
      return NextResponse.json({ error: "anilist_unavailable" }, { status: response.status === 429 ? 429 : 503 })
    }

    const payload: unknown = await response.json()
    const root = isRecord(payload) && isRecord(payload.data) ? payload.data : null
    const page = root && isRecord(root.Page) ? root.Page : null
    const media = page && Array.isArray(page.media) ? page.media.find(isRecord) : null
    if (!media) return NextResponse.json({ error: "anime_not_found" }, { status: 404 })

    const titles = isRecord(media.title) ? media.title : {}
    const cover = isRecord(media.coverImage) ? media.coverImage : {}
    const links = Array.isArray(media.externalLinks) ? media.externalLinks.filter(isRecord) : []
    const crunchyroll = links.find((link) => {
      if (link.isDisabled === true) return false
      return text(link.site, 100)?.toLowerCase().includes("crunchyroll") ?? false
    })
    const displayTitle =
      text(titles.english, 300) ??
      text(titles.userPreferred, 300) ??
      text(titles.romaji, 300) ??
      text(titles.native, 300) ??
      title
    const startDate = isRecord(media.startDate) ? media.startDate : null

    return NextResponse.json(
      {
        anime: {
          title: displayTitle,
          titleRomaji: text(titles.romaji, 300) ?? "",
          synopsis: cleanSynopsis(media.description),
          coverImage: httpsUrl(cover.extraLarge) ?? httpsUrl(cover.large) ?? httpsUrl(cover.medium),
          score: integer(media.averageScore, 0, 100),
          episodes: integer(media.episodes, 0, 100_000),
          year: integer(media.seasonYear, 1800, 3000) ?? integer(startDate?.year, 1800, 3000),
          anilistUrl: httpsUrl(media.siteUrl),
          crunchyrollUrl:
            httpsUrl(crunchyroll?.url) ??
            `https://www.crunchyroll.com/search?q=${encodeURIComponent(displayTitle)}`,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    )
  } catch {
    return NextResponse.json({ error: "anilist_unavailable" }, { status: 503 })
  }
}
