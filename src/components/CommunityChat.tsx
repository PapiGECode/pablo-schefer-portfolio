import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, LockKeyhole, MessageCircle, Send, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { accountName, cleanCommunityText, normalizePublicName } from '../lib/community'
import { getSupabase } from '../lib/supabase'
import type { CommunityChatNotification } from '../hooks/useCommunityNotifications'
import './CommunityChat.css'

type ChatMessage = {
  id: number
  user_id: string
  username: string
  body: string
  created_at: string
  avatar_url?: string | null
}

type CommunityChatProps = {
  locale: Locale
  mode?: 'widget' | 'inline'
  onOpen?: () => void
  incomingMessage?: CommunityChatNotification | null
}

const ownerEmail = 'pablopme41@gmail.com'

export function CommunityChat({ locale, mode = 'widget', onOpen, incomingMessage }: CommunityChatProps) {
  const auth = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const username = useMemo(() => accountName(auth.user), [auth.user])
  const isOwner = auth.user?.email?.toLowerCase() === ownerEmail
  const labels = locale === 'es' ? {
    title: 'Chat de la comunidad',
    live: 'Entre cuentas',
    open: 'Abrir chat',
    close: 'Cerrar chat',
    page: 'Abrir página completa',
    locked: 'Inicia sesión para leer y participar.',
    signIn: 'Entrar o crear cuenta',
    placeholder: 'Escribe un mensaje público…',
    send: 'Enviar mensaje',
    empty: 'Todavía no hay mensajes. Estrena la conversación.',
    error: 'No se ha podido conectar con el chat.',
    remove: 'Eliminar mensaje',
  } : {
    title: 'Community chat',
    live: 'Account members',
    open: 'Open chat',
    close: 'Close chat',
    page: 'Open full page',
    locked: 'Sign in to read and join the conversation.',
    signIn: 'Sign in or create account',
    placeholder: 'Write a public message…',
    send: 'Send message',
    empty: 'No messages yet. Start the conversation.',
    error: 'The chat could not connect.',
    remove: 'Delete message',
  }

  const loadMessages = useCallback(async () => {
    if (!auth.user) return
    setLoading(true)
    const client = await getSupabase()
    if (!client) {
      setError(labels.error)
      setLoading(false)
      return
    }
    const firstQuery = await client
      .from('chat_messages')
      .select('id,user_id,username,body,created_at,avatar_url')
      .order('created_at', { ascending: false })
      .limit(mode === 'widget' ? 28 : 100)
    let data = firstQuery.data as ChatMessage[] | null
    let queryError = firstQuery.error
    if (queryError) {
      const fallback = await client.from('chat_messages').select('id,user_id,username,body,created_at').order('created_at', { ascending: false }).limit(mode === 'widget' ? 28 : 100)
      data = fallback.data
      queryError = fallback.error
    }
    if (queryError) setError(labels.error)
    else {
      setError('')
      setMessages(((data ?? []) as ChatMessage[]).map((message) => ({ ...message, username: normalizePublicName(message.username) })).reverse())
    }
    setLoading(false)
  }, [auth.user, labels.error, mode])

  useEffect(() => {
    if (!auth.user) return undefined
    let channel: { unsubscribe: () => Promise<unknown> } | undefined
    let disposed = false
    void getSupabase().then((client) => {
      if (!client || disposed) return
      void loadMessages()
      channel = client
        .channel(`portfolio-chat-${mode}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
          const incoming = payload.new as ChatMessage
          incoming.username = normalizePublicName(incoming.username)
          setMessages((current) => {
            if (current.some((message) => message.id === incoming.id)) return current
            return [...current, incoming].slice(mode === 'widget' ? -28 : -100)
          })
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' }, (payload) => {
          const removed = payload.old as Pick<ChatMessage, 'id'>
          setMessages((current) => current.filter((message) => message.id !== removed.id))
        })
        .subscribe()
    })
    return () => {
      disposed = true
      if (channel) void channel.unsubscribe()
    }
  }, [auth.user, loadMessages, mode])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, mode])

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    if (!auth.user || sending) return
    const message = cleanCommunityText(body, 600)
    if (!message) return
    setSending(true)
    setError('')
    const client = await getSupabase()
    const { error: insertError } = client
      ? await client.rpc('send_chat_message', {
        message_body: message,
        display_name: username,
      })
      : { error: new Error('not_configured') }
    if (insertError) {
      console.error('Community chat send failed:', insertError)
      setError(locale === 'es' ? 'No se ha podido enviar el mensaje. Inténtalo de nuevo en unos segundos.' : 'The message could not be sent. Please try again in a few seconds.')
    }
    else setBody('')
    setSending(false)
  }

  const deleteMessage = async (messageId: number) => {
    if (!isOwner) return
    const client = await getSupabase()
    if (!client) return
    const { error: deleteError } = await client.from('chat_messages').delete().eq('id', messageId)
    if (deleteError) {
      setError(labels.error)
      return
    }
    setMessages((current) => current.filter((message) => message.id !== messageId))
  }

  const handleMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  if (mode === 'widget') {
    return (
      <button className={`chat-launcher${incomingMessage ? ' chat-launcher--incoming' : ''}`} type="button" onClick={onOpen} aria-label={labels.open}>
        <span><MessageCircle size={17} aria-hidden="true" /><i /></span>
        <span className="chat-launcher__copy">
          <AnimatePresence mode="wait" initial={false}>
            <m.span key={incomingMessage?.id ?? 'default'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <strong>{incomingMessage ? `${incomingMessage.username}: ${incomingMessage.body}` : labels.title}</strong>
              <small>{incomingMessage ? (locale === 'es' ? 'Nuevo mensaje · Abrir chat' : 'New message · Open chat') : labels.live}</small>
            </m.span>
          </AnimatePresence>
        </span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    )
  }

  return (
    <AnimatePresence initial={false}>
      <m.section
        className={`community-chat community-chat--${mode}`}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="community-chat__header">
          <span><MessageCircle size={17} aria-hidden="true" /><i /></span>
          <div><strong>{labels.title}</strong><small>{labels.live}</small></div>
          <button type="button" onClick={onOpen} aria-label={labels.close}><X size={15} aria-hidden="true" /></button>
        </header>

        {!auth.user ? (
          <div className="community-chat__locked">
            <span><LockKeyhole size={24} aria-hidden="true" /></span>
            <p>{labels.locked}</p>
            <Link to="/cuenta">{labels.signIn}<ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        ) : (
          <>
            <div className="community-chat__messages" ref={scrollRef} aria-live="polite">
              {loading && messages.length === 0 ? <span className="community-chat__loading" /> : null}
              {!loading && messages.length === 0 && !error ? <p className="community-chat__empty">{labels.empty}</p> : null}
              {messages.map((message) => {
                const own = message.user_id === auth.user?.id
                return (
                  <article className={own ? 'is-own' : ''} key={message.id}>
                    <span className="community-chat__avatar">{message.avatar_url ? <img src={message.avatar_url} alt="" /> : message.username.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <header><strong>{message.username}</strong><time dateTime={message.created_at}>{new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(message.created_at))}</time></header>
                      <p>{message.body}</p>
                      {isOwner && (
                        <button className="community-chat__delete" type="button" onClick={() => void deleteMessage(message.id)} aria-label={`${labels.remove}: ${message.username}`}>
                          <Trash2 size={12} aria-hidden="true" />{labels.remove}
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
            <form className="community-chat__form" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor={`chat-message-${mode}`}>{labels.placeholder}</label>
              <textarea id={`chat-message-${mode}`} value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={handleMessageKeyDown} maxLength={600} rows={2} placeholder={labels.placeholder} />
              <button type="submit" disabled={sending || !body.trim()} aria-label={labels.send}><Send size={16} aria-hidden="true" /></button>
            </form>
          </>
        )}
        {error && <p className="community-chat__error">{error}</p>}
      </m.section>
    </AnimatePresence>
  )
}
