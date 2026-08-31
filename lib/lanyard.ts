export const DISCORD_USER_ID = "1179009666110476328"

export const LANYARD_REST_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`
export const LANYARD_SOCKET_URL = "wss://api.lanyard.rest/socket"

export type DiscordStatus = "online" | "idle" | "dnd" | "offline"

export type SpotifyPresence = {
  album: string
  album_art_url: string
  artist: string
  song: string
  track_id: string
  timestamps: {
    start: number
    end: number
  }
}

export type LanyardActivity = {
  id?: string
  name: string
  type: number
  details?: string
  state?: string
  application_id?: string
  timestamps?: {
    start?: number
    end?: number
  }
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
}

export type LanyardPresence = {
  activities?: LanyardActivity[]
  discord_status: DiscordStatus
  listening_to_spotify: boolean
  spotify: SpotifyPresence | null
  discord_user?: {
    id: string
    username: string
    display_name?: string | null
    global_name?: string | null
  }
}

export type LanyardPhase = "connecting" | "ready" | "unmonitored" | "error"

const MUSIC_PATTERN = /apple\s*music|itunes|spotify/i
const ANIME_SIGNALS = [
  "anime",
  "crunchyroll",
  "anilist",
  "myanimelist",
  "mal-sync",
  "animeflv",
  "aniyomi",
  "taiga",
  "hidive",
  "viendo",
  "watching",
  "episode",
  "episodio",
  "capitulo",
  "capítulo",
]
const ANIME_IGNORE_SIGNALS = [
  "spotify",
  "apple music",
  "visual studio",
  "code",
  "github",
  "valorant",
  "roblox",
  "fortnite",
  "steam",
  "chrome",
]
const NON_GAME_SIGNALS = [
  "custom status",
  "discord",
  "spotify",
  "apple music",
  "visual studio code",
  "chrome",
  "github",
  "crunchyroll",
  "anilist",
  "myanimelist",
  "animeflv",
  "hidive",
]

export function activityText(activity: LanyardActivity) {
  return [
    activity.name,
    activity.details,
    activity.state,
    activity.assets?.large_text,
    activity.assets?.small_text,
  ]
    .filter(Boolean)
    .join(" · ")
}

export function isMusicActivity(activity: LanyardActivity) {
  return MUSIC_PATTERN.test(activity.name)
}

export function isAnimeActivity(activity: LanyardActivity) {
  const text = activityText(activity).toLowerCase()
  if (!text.trim() || isMusicActivity(activity)) return false
  if (ANIME_IGNORE_SIGNALS.some((signal) => text.includes(signal))) return false
  return ANIME_SIGNALS.some((signal) => text.includes(signal))
}

export function isGameActivity(activity: LanyardActivity) {
  if (activity.type !== 0 || isAnimeActivity(activity)) return false
  const text = activityText(activity).toLowerCase()
  return Boolean(text.trim()) && !NON_GAME_SIGNALS.some((signal) => text.includes(signal))
}

export function cleanAnimeTitle(value?: string) {
  if (!value) return ""
  return value
    .replace(/^(watching|viendo|reproduciendo)\s+/i, "")
    .replace(/\s*[-–—|·]\s*(crunchyroll|anilist|myanimelist|animeflv|hidive).*$/i, "")
    .replace(/\s+\((castilian|latin american|english|japanese)\s+dub\)$/i, "")
    .trim()
}

export function animeTitleFromActivity(activity: LanyardActivity) {
  return (
    cleanAnimeTitle(activity.details) ||
    cleanAnimeTitle(activity.assets?.large_text) ||
    cleanAnimeTitle(activity.state) ||
    activity.name
  )
}

export function resolveActivityImage(activity: LanyardActivity) {
  const image = activity.assets?.large_image
  if (!image) return undefined
  if (/^https:\/\//i.test(image)) return image
  if (image.startsWith("mp:")) return `https://media.discordapp.net/${image.slice(3)}`
  if (image.startsWith("spotify:")) return `https://i.scdn.co/image/${image.slice(8)}`
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`
  }
  return undefined
}

export function formatPresenceTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}
