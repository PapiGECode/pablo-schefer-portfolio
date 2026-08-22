import { apiSecurityHeaders, enforceRateLimit, jsonResponse } from '../server/security.js'

const discordApi = 'https://discord.com/api/v10'
const edgarGuildId = '822550944608026645'
const fnlbGuildId = '1106879710744543303'
const valorantGuildId = '1084367607982993428'
const nateGuildId = '1044520223648256011'
// Discord's public widget for Gatitos 2 / GW2 is exposed under this guild id.
// The previously used id returns 403, while this endpoint is public and capped
// by Discord to a manageable member/channel snapshot.
const gw2GuildId = '1196972070253383742'
const snapshotRefreshSeconds = 15
const discordHeaders = {
  Accept: 'application/json',
  'User-Agent': 'PabloScheferPortfolio/1.0 (+https://www.pabloschefer.com)',
}

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function safeText(value: unknown, maxLength: number, fallback: string) {
  const text = stringValue(value, fallback).trim()
  return (text || fallback).slice(0, maxLength)
}

function discordAvatarUrl(value: unknown) {
  if (typeof value !== 'string') return null

  try {
    const url = new URL(value)
    const allowedHosts = new Set(['cdn.discordapp.com', 'media.discordapp.net'])
    return url.protocol === 'https:' && allowedHosts.has(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

function errorResponse() {
  return jsonResponse({ error: 'discord_unavailable' }, 503)
}

type GuildConfig = {
  id: string
  name: string
  fallback?: {
    membersApprox: number | null
    onlineApprox: number | null
  }
}

function fallbackResponse(guild: GuildConfig) {
  if (!guild.fallback) return errorResponse()

  return Response.json(
    {
      server: {
        id: guild.id,
        name: guild.name,
        membersApprox: guild.fallback.membersApprox,
        onlineApprox: guild.fallback.onlineApprox,
        inviteUrl: null,
      },
      voice: {
        available: false,
        visibleMemberCount: 0,
        channels: [],
      },
      source: {
        mode: 'static_fallback',
        upstreamCacheSeconds: 300,
        effectiveRefreshSeconds: 300,
      },
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        ...apiSecurityHeaders,
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
        'Vercel-CDN-Cache-Control': 'max-age=300, stale-while-revalidate=600',
      },
    },
  )
}

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, { scope: 'edgar-community', limit: 60, windowMs: 60_000 })
  if (limited) return limited

  const guildParam = new URL(request.url).searchParams.get('guild')
  const guildConfig: GuildConfig = guildParam === 'fnlb'
    ? { id: fnlbGuildId, name: 'FNLB' }
    : guildParam === 'valorant'
      ? { id: valorantGuildId, name: 'VALORANT ESP', fallback: { membersApprox: 98_000, onlineApprox: null } }
      : guildParam === 'nate'
        ? { id: nateGuildId, name: 'Nate Gentile', fallback: { membersApprox: 1_612, onlineApprox: 207 } }
        : guildParam === 'gw2'
          ? { id: gw2GuildId, name: 'GW2' }
          : { id: edgarGuildId, name: 'Edgar Pons' }

  try {
    const guildId = guildConfig.id
    const defaultName = guildConfig.name
    // Discord gives the stable widget URL a five-minute CDN lifetime. A shared,
    // time-bucketed key asks for one fresh public snapshot per interval without
    // turning every visitor into a separate upstream request.
    const snapshotWindow = Math.floor(Date.now() / (snapshotRefreshSeconds * 1_000))
    const widgetResponse = await fetch(`${discordApi}/guilds/${guildId}/widget.json?snapshot=${snapshotWindow}`, {
      headers: discordHeaders,
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    })
    if (!widgetResponse.ok) return fallbackResponse(guildConfig)

    const widget: unknown = await widgetResponse.json()
    if (!isRecord(widget) || stringValue(widget.id) !== guildId) return errorResponse()

    const inviteUrl = typeof widget.instant_invite === 'string' ? widget.instant_invite : null
    let invite: JsonRecord | null = null
    if (inviteUrl) {
      const inviteCode = new URL(inviteUrl).pathname.split('/').filter(Boolean).pop()
      if (inviteCode) {
        const inviteResponse = await fetch(`${discordApi}/invites/${encodeURIComponent(inviteCode)}?with_counts=true`, {
          headers: discordHeaders,
          signal: AbortSignal.timeout(5_000),
        })
        if (inviteResponse.ok) {
          const inviteJson: unknown = await inviteResponse.json()
          if (isRecord(inviteJson)) invite = inviteJson
        }
      }
    }

    const rawMembers = Array.isArray(widget.members) ? widget.members.filter(isRecord).slice(0, 100) : []
    const rawChannels = Array.isArray(widget.channels) ? widget.channels.filter(isRecord).slice(0, 100) : []
    const voiceChannels = rawChannels
      .map((channel) => {
        const id = stringValue(channel.id)
        const members = rawMembers
          .filter((member) => stringValue(member.channel_id) === id)
          .map((member) => {
            const rawStatus = stringValue(member.status, 'offline')
            const status = ['online', 'idle', 'dnd', 'offline'].includes(rawStatus) ? rawStatus : 'offline'
            return {
              id: safeText(member.id, 32, 'discord-member'),
              username: safeText(member.username, 64, 'Discord member'),
              avatarUrl: discordAvatarUrl(member.avatar_url),
              status,
            }
          })
        return {
          id,
          name: safeText(channel.name, 100, 'Voice channel'),
          position: numberValue(channel.position) ?? 0,
          members,
        }
      })
      .filter((channel) => channel.id)
      .sort((left, right) => {
        if (left.members.length !== right.members.length) return right.members.length - left.members.length
        return left.position - right.position
      })
      .map((channel) => ({ id: channel.id, name: channel.name, members: channel.members }))

    const inviteGuild = invite && isRecord(invite.guild) ? invite.guild : null
    const membersApprox = invite ? numberValue(invite.approximate_member_count) : null
    const onlineFromInvite = invite ? numberValue(invite.approximate_presence_count) : null
    const onlineFromWidget = numberValue(widget.presence_count)

    return Response.json(
      {
        server: {
          id: guildId,
          name: safeText(inviteGuild?.name ?? widget.name, 100, defaultName),
          membersApprox,
          onlineApprox: onlineFromInvite ?? onlineFromWidget,
          inviteUrl,
        },
        voice: {
          available: true,
          visibleMemberCount: voiceChannels.reduce((total, channel) => total + channel.members.length, 0),
          channels: voiceChannels,
        },
        source: {
          mode: 'discord_widget',
          upstreamCacheSeconds: 300,
          effectiveRefreshSeconds: snapshotRefreshSeconds,
        },
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          ...apiSecurityHeaders,
          'Cache-Control': 'public, max-age=0, s-maxage=10, must-revalidate, stale-if-error=300',
          'Vercel-CDN-Cache-Control': 'max-age=10, must-revalidate, stale-if-error=300',
        },
      },
    )
  } catch {
    return fallbackResponse(guildConfig)
  }
}
