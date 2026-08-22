import type { User } from '@supabase/supabase-js'

const legacyNameAliases: Record<string, string> = {
  svgonloadalert1: 'MR Gato',
  owner: 'Lince-482',
  admin: 'Nexo-731',
  administrator: 'Nexo-731',
}

export const reservedUsernameMessage = 'Ese nombre está reservado. Elige otro nombre de usuario.'

export function normalizePublicName(value: string) {
  const normalized = value.normalize('NFKC').replace(/[^\p{L}\p{N}._() -]/gu, '').trim().replace(/\s+/g, ' ').slice(0, 32)
  return legacyNameAliases[normalized.toLowerCase()] ?? normalized
}

export function isReservedUsername(value: string) {
  return ['owner', 'admin', 'administrator', 'moderator', 'moderador', 'system', 'support', 'staff'].includes(value.trim().toLowerCase())
}

export function accountName(user: User | null) {
  if (!user) return ''
  if (user.email?.toLowerCase() === 'pablopme41@gmail.com') return 'PapiGEGamer(Owner)'
  const metadata = user.user_metadata as Record<string, unknown>
  const value = typeof metadata.display_name === 'string'
    ? metadata.display_name
    : typeof metadata.username === 'string'
      ? metadata.username
      : ''
  const normalized = normalizePublicName(value)
  if (normalized.length >= 3) return normalized
  return user.email?.split('@')[0]?.slice(0, 32) || 'Miembro'
}

export function cleanCommunityText(value: string, maxLength: number) {
  return value
    .normalize('NFKC')
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')
    .trim()
    .slice(0, maxLength)
}
