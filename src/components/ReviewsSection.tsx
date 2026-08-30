import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, LockKeyhole, Star, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { accountName, cleanCommunityText } from '../lib/community'
import { getSupabase } from '../lib/supabase'
import './ReviewsSection.css'

type Review = {
  id: string
  user_id: string
  username: string
  rating: 4 | 5
  body: string
  created_at: string
  avatar_url?: string | null
}

const ownerEmail = 'pablopme41@gmail.com'

export function ReviewsSection({ locale }: { locale: Locale }) {
  const auth = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [body, setBody] = useState('')
  const [rating, setRating] = useState<4 | 5>(5)
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [loginPrompt, setLoginPrompt] = useState(false)
  const username = useMemo(() => accountName(auth.user), [auth.user])
  const isOwner = auth.user?.email?.toLowerCase() === ownerEmail
  const labels = locale === 'es' ? {
    eyebrow: 'Reseñas de la comunidad',
    title: 'Opiniones de personas que ya tienen cuenta.',
    intro: 'Un espacio breve para compartir qué te ha gustado del portfolio. Cada cuenta puede mantener una reseña.',
    great: 'Me gusta',
    excellent: 'Me encanta',
    placeholder: '¿Qué parte del portfolio te ha gustado?',
    submit: 'Publicar reseña',
    login: 'Inicia sesión para dejar tu reseña.',
    loginTitle: '¿Te ha gustado la web?',
    loginHint: 'Crea una cuenta gratis para dejar tu opinión.',
    loginAction: 'Entrar o registrarme',
    saved: 'Tu reseña se ha publicado.',
    error: 'No se ha podido guardar la reseña.',
    empty: 'Las primeras reseñas aparecerán aquí.',
    remove: 'Eliminar reseña',
  } : {
    eyebrow: 'Community reviews',
    title: 'Feedback from people with an account.',
    intro: 'A short space to share what you liked about the portfolio. Each account can keep one review.',
    great: 'I like it',
    excellent: 'I love it',
    placeholder: 'What did you enjoy about the portfolio?',
    submit: 'Publish review',
    login: 'Sign in to leave your review.',
    loginTitle: 'Like what you see?',
    loginHint: 'Create a free account to leave your feedback.',
    loginAction: 'Sign in or register',
    saved: 'Your review is now live.',
    error: 'The review could not be saved.',
    empty: 'The first reviews will appear here.',
    remove: 'Delete review',
  }

  const loadReviews = useCallback(async () => {
    const client = await getSupabase()
    if (!client) return
    const result = await client.from('reviews').select('id,user_id,username,rating,body,created_at,avatar_url').order('updated_at', { ascending: false }).limit(12)
    const data = result.error ? (await client.from('reviews').select('id,user_id,username,rating,body,created_at').order('updated_at', { ascending: false }).limit(12)).data : result.data
    setReviews((data ?? []) as Review[])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadReviews() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadReviews])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!auth.user || sending) return
    const text = cleanCommunityText(body, 800)
    if (text.length < 8) return
    setSending(true)
    setNotice('')
    const client = await getSupabase()
    let error = client ? (await client.from('reviews').upsert({
      user_id: auth.user.id,
      username,
      rating,
      body: text,
      avatar_url: typeof auth.user.user_metadata?.avatar_url === 'string' ? auth.user.user_metadata.avatar_url : null,
    }, { onConflict: 'user_id' })).error : new Error('not_configured')
    if (error && client) {
      // Keep the review flow working while an older database is finishing its migration.
      error = (await client.from('reviews').upsert({ user_id: auth.user.id, username, rating, body: text }, { onConflict: 'user_id' })).error
    }
    setNotice(error ? labels.error : labels.saved)
    if (!error) {
      setBody('')
      await loadReviews()
    }
    setSending(false)
  }

  const removeReview = async (reviewId: string) => {
    if (!isOwner) return
    const client = await getSupabase()
    if (!client) return
    const { error: deleteError } = await client.from('reviews').delete().eq('id', reviewId)
    if (deleteError) {
      setNotice(labels.error)
      return
    }
    setReviews((current) => current.filter((review) => review.id !== reviewId))
    setNotice('')
  }

  useEffect(() => {
    if (!loginPrompt) return undefined
    const timer = window.setTimeout(() => setLoginPrompt(false), 5_000)
    return () => window.clearTimeout(timer)
  }, [loginPrompt])

  const requireLogin = () => {
    if (auth.user) return false
    setLoginPrompt(true)
    return true
  }

  return (
    <section className="section reviews-section">
      <div className="section-heading section-heading--split">
        <div><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.title}</h2></div>
        <p className="section-heading__intro">{labels.intro}</p>
      </div>
      <div className="reviews-layout">
        <div className="reviews-grid">
          {reviews.length === 0 && <p className="reviews-empty">{labels.empty}</p>}
          {reviews.map((review) => (
            <article key={review.id}>
              <header><span className="reviews-avatar">{review.avatar_url ? <img src={review.avatar_url} alt="" /> : review.username.slice(0, 1).toUpperCase()}</span><strong>{review.username}</strong><span className="reviews-stars">{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={12} fill="currentColor" aria-hidden="true" />)}</span></header>
              <p>{review.body}</p>
              {isOwner && <button className="review-delete" type="button" onClick={() => void removeReview(review.id)}><Trash2 size={13} aria-hidden="true" />{labels.remove}</button>}
            </article>
          ))}
        </div>
        <form className="review-form" onSubmit={submit}>
          {auth.user ? (
            <span className="review-form__label">{username}</span>
          ) : (
            <div className="review-login-banner" role="status">
              <span className="review-login-banner__icon"><LockKeyhole size={17} aria-hidden="true" /></span>
              <div><strong>{labels.loginTitle}</strong><small>{labels.loginHint}</small></div>
              <Link to="/cuenta">{labels.loginAction}<ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          )}
          <div className="review-form__rating">
            <button type="button" className={rating === 4 ? 'is-active' : ''} onClick={() => { if (!requireLogin()) setRating(4) }}>{labels.great}<span>★★★★</span></button>
            <button type="button" className={rating === 5 ? 'is-active' : ''} onClick={() => { if (!requireLogin()) setRating(5) }}>{labels.excellent}<span>★★★★★</span></button>
          </div>
          <label className="sr-only" htmlFor="review-body">{labels.placeholder}</label>
          <textarea id="review-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={800} rows={5} placeholder={labels.placeholder} disabled={!auth.user} />
          <button className="review-form__submit" type="submit" disabled={!auth.user || sending || body.trim().length < 8}>{labels.submit}</button>
          {notice && <p>{notice}</p>}
        </form>
      </div>
      <AnimatePresence>
        {loginPrompt && (
          <m.div className="review-login-toast" role="alert" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.24 }}>
            <LockKeyhole size={17} aria-hidden="true" />
            <span>{labels.login}</span>
            <Link to="/cuenta">{labels.loginAction}<ArrowUpRight size={13} aria-hidden="true" /></Link>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}
