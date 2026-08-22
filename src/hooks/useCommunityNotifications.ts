import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export type CommunityChatNotification = {
  id: number
  user_id: string
  username: string
  body: string
  created_at: string
}

function playChatPing() {
  try {
    const context = new AudioContext()
    const now = context.currentTime
    const master = context.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.06, now + 0.012)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
    master.connect(context.destination)

    // A short two-note, high-register chime with a soft tail, close in feel to
    // the familiar phone notification without shipping a copyrighted audio file.
    const notes = [1046.5, 1318.5]
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const start = now + index * 0.075
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.78 : 0.58, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34)
      oscillator.connect(gain).connect(master)
      oscillator.start(start)
      oscillator.stop(start + 0.36)
    })
    window.setTimeout(() => void context.close(), 650)
  } catch {
    // Browsers can reject audio until the visitor has interacted with the page.
  }
}

export function useCommunityNotifications() {
  const auth = useAuth()
  const [notification, setNotification] = useState<CommunityChatNotification | null>(null)

  useEffect(() => {
    let disposed = false
    let channel: { unsubscribe: () => Promise<unknown> } | undefined

    void getSupabase().then(async (client) => {
      if (!client || disposed) return
      if (disposed || !auth.user) return
      channel = client
        .channel('portfolio-chat-notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
          const incoming = payload.new as CommunityChatNotification
          if (incoming.user_id === auth.user?.id) return
          setNotification(incoming)
          window.dispatchEvent(new CustomEvent<CommunityChatNotification>('community-chat:new-message', { detail: incoming }))
          playChatPing()
        })
        .subscribe()
    })

    return () => {
      disposed = true
      if (channel) void channel.unsubscribe()
    }
  }, [auth.user])

  return { notification }
}
