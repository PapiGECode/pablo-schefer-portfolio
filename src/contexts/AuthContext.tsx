/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { useLocation } from 'react-router-dom'
import { authConfigured, getSupabase, hasStoredAuthSession } from '../lib/supabase'
import { isReservedUsername, normalizePublicName, reservedUsernameMessage } from '../lib/community'

type AuthContextValue = {
  configured: boolean
  loading: boolean
  passwordRecovery: boolean
  session: Session | null
  user: User | null
  sendRegistrationCode: (email: string) => Promise<void>
  completeRegistration: (email: string, code: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (username: string) => Promise<void>
  updateAvatar: (file: File) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const ownerEmail = 'pablopme41@gmail.com'

async function requireClient() {
  const client = await getSupabase()
  if (!client) throw new Error('auth_not_configured')
  return client
}

function cleanEmail(value: string) {
  const email = value.normalize('NFKC').trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) throw new Error('invalid_email')
  return email
}

function cleanUsername(value: string) {
  const username = value
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}._() -]/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 32)
  if (username.length < 3) throw new Error('missing_username')
  if (isReservedUsername(username)) throw new Error(reservedUsernameMessage)
  return username
}

function cleanUsernameForUser(value: string, email: string) {
  const normalized = normalizePublicName(value)
  if (email.toLowerCase() === ownerEmail) return normalized
  return cleanUsername(normalized)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [hadStoredSession] = useState(hasStoredAuthSession)
  const [session, setSession] = useState<Session | null>(null)
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  const [loading, setLoading] = useState(() => authConfigured && (location.pathname === '/cuenta' || hadStoredSession))
  const authRequested = location.pathname === '/cuenta' || hadStoredSession || Boolean(session)

  useEffect(() => {
    if (!authConfigured || !authRequested) return undefined

    let disposed = false
    let unsubscribe: (() => void) | undefined

    const initialize = () => {
      void getSupabase().then(async (client) => {
        if (!client || disposed) return
        const { data } = await client.auth.getSession()
        if (disposed) return
        setSession(data.session)
        setLoading(false)
        const { data: listener } = client.auth.onAuthStateChange((event, nextSession) => {
          setSession(nextSession)
          if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
          if (event === 'SIGNED_OUT') setPasswordRecovery(false)
          setLoading(false)
        })
        const metadata = data.session?.user.user_metadata as Record<string, unknown> | undefined
        const legacyUsername = typeof metadata?.username === 'string' ? metadata.username : ''
        if (data.session?.user && legacyUsername.toLowerCase() === 'svgonloadalert1') {
          void client.auth.updateUser({ data: { username: 'MR Gato', display_name: 'MR Gato' } })
        }
        if (data.session?.user?.email?.toLowerCase() === ownerEmail) {
          const currentAvatar = typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : ''
          if (currentAvatar !== '/media/profile/pablo-schefer-avatar.webp') {
            void client.auth.updateUser({ data: { avatar_url: '/media/profile/pablo-schefer-avatar.webp' } })
          }
        }
        unsubscribe = () => listener.subscription.unsubscribe()
      }).catch(() => {
        if (!disposed) setLoading(false)
      })
    }

    const timer = window.setTimeout(initialize, 0)

    return () => {
      disposed = true
      window.clearTimeout(timer)
      unsubscribe?.()
    }
  }, [authRequested])

  const value = useMemo<AuthContextValue>(() => ({
    configured: authConfigured,
    loading,
    passwordRecovery,
    session,
    user: session?.user ?? null,
    sendRegistrationCode: async (email) => {
      const client = await requireClient()
      const { error } = await client.auth.signInWithOtp({
        email: cleanEmail(email),
        options: { shouldCreateUser: true },
      })
      if (error) throw error
    },
    completeRegistration: async (email, code, password, username) => {
      const client = await requireClient()
      if (!/^\d{8}$/.test(code)) throw new Error('invalid_token')
      if (password.length < 12 || password.length > 128) throw new Error('weak_password')
      const { error: verifyError } = await client.auth.verifyOtp({ email: cleanEmail(email), token: code, type: 'email' })
      if (verifyError) throw verifyError
      const normalizedUsername = cleanUsernameForUser(username, email)
      const { error: passwordError } = await client.auth.updateUser({
        password,
        data: {
          display_name: normalizedUsername,
          username: normalizedUsername,
        },
      })
      if (passwordError) throw passwordError
    },
    signIn: async (email, password) => {
      const client = await requireClient()
      if (password.length < 8 || password.length > 128) throw new Error('Invalid login credentials')
      const { error } = await client.auth.signInWithPassword({ email: cleanEmail(email), password })
      if (error) throw error
    },
    sendPasswordReset: async (email) => {
      const client = await requireClient()
      const redirectTo = `${window.location.origin}/cuenta?reset=1`
      const { error } = await client.auth.resetPasswordForEmail(cleanEmail(email), { redirectTo })
      if (error) throw error
    },
    updatePassword: async (password) => {
      if (password.length < 12 || password.length > 128) throw new Error('weak_password')
      const client = await requireClient()
      const { error } = await client.auth.updateUser({ password })
      if (error) throw error
      setPasswordRecovery(false)
    },
    updateProfile: async (username) => {
      const normalizedUsername = cleanUsernameForUser(username, session?.user.email ?? '')
      const client = await requireClient()
      const { error } = await client.auth.updateUser({
        data: {
          display_name: normalizedUsername,
          username: normalizedUsername,
        },
      })
      if (error) throw error
    },
    updateAvatar: async (file) => {
      if (!file.type.startsWith('image/')) throw new Error('invalid_avatar')
      if (file.size > 5 * 1024 * 1024) throw new Error('avatar_too_large')
      const client = await requireClient()
      const currentUser = session?.user
      if (!currentUser) throw new Error('authentication_required')
      const avatarDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('invalid_avatar'))
        reader.onload = () => {
          const image = new Image()
          image.onerror = () => reject(new Error('invalid_avatar'))
          image.onload = () => {
            const maxSize = 320
            const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight))
            const canvas = document.createElement('canvas')
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
            const context = canvas.getContext('2d')
            if (!context) return reject(new Error('invalid_avatar'))
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/webp', 0.82))
          }
          image.src = String(reader.result)
        }
        reader.readAsDataURL(file)
      })
      const { error } = await client.auth.updateUser({ data: { avatar_url: avatarDataUrl } })
      if (error) throw error
      setSession((current) => current ? { ...current, user: { ...current.user, user_metadata: { ...current.user.user_metadata, avatar_url: avatarDataUrl } } } : current)
    },
    signOut: async () => {
      const client = await requireClient()
      const { error } = await client.auth.signOut()
      if (error) throw error
    },
  }), [loading, passwordRecovery, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
