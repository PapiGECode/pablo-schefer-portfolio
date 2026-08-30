import * as m from 'motion/react-m'
import { ArrowRight, CheckCircle2, ImagePlus, KeyRound, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { isReservedUsername, reservedUsernameMessage } from '../lib/community'
import './AccountPage.css'

type Mode = 'login' | 'register' | 'verify' | 'forgot' | 'reset'
const ownerEmail = 'pablopme41@gmail.com'

function cleanUsername(value: string) {
  const normalized = value.normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32)
  if (isReservedUsername(normalized)) throw new Error(reservedUsernameMessage)
  return normalized
}

function cleanDisplayName(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32)
}

function displayNameFor(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  if (user.email?.toLowerCase() === ownerEmail) return 'PapiGEGamer(Owner)'
  const metadata = user.user_metadata as Record<string, unknown>
  const username = typeof metadata.username === 'string' ? cleanDisplayName(metadata.username) : ''
  const displayName = typeof metadata.display_name === 'string' ? cleanDisplayName(metadata.display_name) : ''
  if (username) return username
  if (displayName) return displayName
  return ''
}

function messageFor(error: unknown, locale: Locale) {
  const text = error instanceof Error ? error.message : ''
  if (text === 'auth_not_configured') return locale === 'es' ? 'El servicio de cuentas todavía no está conectado.' : 'The account service is not connected yet.'
  if (/invalid login credentials/i.test(text)) return locale === 'es' ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.'
  if (/invalid_email/i.test(text)) return locale === 'es' ? 'Introduce un correo válido.' : 'Enter a valid email address.'
  if (/weak_password/i.test(text)) return locale === 'es' ? 'La contraseña debe tener al menos 12 caracteres.' : 'Password must be at least 12 characters.'
  if (/invalid_avatar/i.test(text)) return locale === 'es' ? 'Selecciona una imagen válida.' : 'Choose a valid image.'
  if (/avatar_too_large/i.test(text)) return locale === 'es' ? 'La imagen debe pesar menos de 5 MB.' : 'The image must be smaller than 5 MB.'
  if (/reserved|reservado/i.test(text)) return locale === 'es' ? reservedUsernameMessage : 'That username is reserved. Choose another one.'
  if (/token.*expired|expired.*token|invalid.*token/i.test(text)) return locale === 'es' ? 'El código es incorrecto o ha caducado.' : 'The code is invalid or has expired.'
  if (/rate limit/i.test(text)) return locale === 'es' ? 'Demasiados intentos. Espera un momento.' : 'Too many attempts. Please wait a moment.'
  return text || (locale === 'es' ? 'No se ha podido completar la operación.' : 'The operation could not be completed.')
}

export function AccountPage({ locale }: { locale: Locale }) {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resetRequested = new URLSearchParams(location.search).get('reset') === '1'
  const activeMode: Mode = resetRequested || auth.passwordRecovery ? 'reset' : mode

  const labels = locale === 'es' ? {
    eyebrow: 'Cuenta · Acceso seguro', title: 'Tu espacio dentro de la web.', intro: 'Regístrate con correo y contraseña. Antes de crear la cuenta tendrás que introducir el código de ocho dígitos que recibirás por email.',
    login: 'Iniciar sesión', register: 'Crear cuenta', verify: 'Verificar correo', forgot: 'Recuperar contraseña', reset: 'Nueva contraseña', email: 'Correo electrónico', username: 'Nombre de usuario', password: 'Contraseña', passwordConfirmation: 'Repite la contraseña', code: 'Código de ocho dígitos',
    send: 'Enviar código', enter: 'Entrar', confirm: 'Verificar y crear cuenta', resend: 'Reenviar código', logout: 'Cerrar sesión', account: 'Sesión iniciada',
    verified: 'Correo verificado', security: 'Sesión protegida y persistente', switchRegister: '¿No tienes cuenta? Regístrate', switchLogin: '¿Ya tienes cuenta? Inicia sesión',
    sent: 'Código enviado. Revisa también la carpeta de spam.', missing: 'Autenticación pendiente de configuración', missingBody: 'La interfaz ya está preparada, pero faltan las variables públicas del proyecto Supabase en Vercel para enviar códigos y guardar cuentas reales.',
    usernamePlaceholder: 'Owner, PapiGEGamer, Pablo...', usernameRequired: 'El nombre de usuario debe tener al menos 3 caracteres.', saveUsername: 'Guardar nombre', profileReady: 'Perfil actualizado.', forgotLink: 'He olvidado mi contraseña', resetSend: 'Enviar enlace de recuperación', resetSent: 'Te he enviado un enlace seguro para cambiar la contraseña.', changePassword: 'Cambiar contraseña', updatePassword: 'Guardar nueva contraseña', passwordUpdated: 'Contraseña actualizada.', passwordMismatch: 'Las contraseñas no coinciden.', cancel: 'Cancelar',
  } : {
    eyebrow: 'Account · Secure access', title: 'Your space inside the website.', intro: 'Register with email and password. Before the account is created, enter the eight-digit code sent to your inbox.',
    login: 'Sign in', register: 'Create account', verify: 'Verify email', forgot: 'Recover password', reset: 'New password', email: 'Email address', username: 'Username', password: 'Password', passwordConfirmation: 'Repeat password', code: 'Eight-digit code',
    send: 'Send code', enter: 'Sign in', confirm: 'Verify and create account', resend: 'Resend code', logout: 'Sign out', account: 'Signed in',
    verified: 'Email verified', security: 'Protected persistent session', switchRegister: 'No account yet? Register', switchLogin: 'Already registered? Sign in',
    sent: 'Code sent. Check your spam folder too.', missing: 'Authentication configuration pending', missingBody: 'The interface is ready, but the public Supabase project variables still need to be added in Vercel before codes can be sent and real accounts stored.',
    usernamePlaceholder: 'Owner, PapiGEGamer, Pablo...', usernameRequired: 'Username must be at least 3 characters.', saveUsername: 'Save username', profileReady: 'Profile updated.', forgotLink: 'I forgot my password', resetSend: 'Send recovery link', resetSent: 'A secure password-reset link is on its way.', changePassword: 'Change password', updatePassword: 'Save new password', passwordUpdated: 'Password updated.', passwordMismatch: 'Passwords do not match.', cancel: 'Cancel',
  }
  const displayName = auth.user ? displayNameFor(auth.user) : ''
  const needsUsername = Boolean(auth.user && !displayName)

  useEffect(() => {
    if (!auth.user || auth.user.email?.toLowerCase() !== ownerEmail || displayName !== 'Owner') return
    const metadata = auth.user.user_metadata as Record<string, unknown>
    if (metadata.username === 'PapiGEGamer(Owner)' && metadata.display_name === 'PapiGEGamer(Owner)') return
    void auth.updateProfile('PapiGEGamer(Owner)').catch(() => undefined)
  }, [auth, auth.user, displayName])

  const run = async (operation: () => Promise<void>) => {
    setBusy(true); setError(null); setNotice(null)
    try { await operation() } catch (caught) { setError(messageFor(caught, locale)) } finally { setBusy(false) }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (activeMode === 'login') void run(async () => {
      await auth.signIn(email.trim(), password)
      setPassword('')
    })
    if (activeMode === 'register') void run(async () => {
      if (password.length < 12) throw new Error(locale === 'es' ? 'La contraseña debe tener al menos 12 caracteres.' : 'Password must be at least 12 characters.')
      if (cleanUsername(username).length < 3) throw new Error(labels.usernameRequired)
      await auth.sendRegistrationCode(email.trim())
      setMode('verify'); setNotice(labels.sent)
    })
    if (activeMode === 'verify') void run(async () => {
      await auth.completeRegistration(email.trim(), code, password, cleanUsername(username))
      if (avatarFile) await auth.updateAvatar(avatarFile)
      setPassword('')
      setCode('')
    })
    if (activeMode === 'forgot') void run(async () => {
      await auth.sendPasswordReset(email.trim())
      setNotice(labels.resetSent)
    })
    if (activeMode === 'reset') void run(async () => {
      if (password !== passwordConfirmation) throw new Error(labels.passwordMismatch)
      await auth.updatePassword(password)
      setPassword('')
      setPasswordConfirmation('')
      setNotice(labels.passwordUpdated)
      navigate('/cuenta', { replace: true })
      setMode('login')
    })
  }

  const switchMode = () => {
    setMode(activeMode === 'login' ? 'register' : 'login')
    setPassword('')
    setPasswordConfirmation('')
    setCode('')
    setNotice(null)
    setError(null)
  }

  const saveUsername = (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      if (cleanUsername(username).length < 3) throw new Error(labels.usernameRequired)
      await auth.updateProfile(cleanUsername(username))
      setNotice(labels.profileReady)
    })
  }

  const avatarUrl = auth.user?.user_metadata && typeof auth.user.user_metadata.avatar_url === 'string' ? auth.user.user_metadata.avatar_url : auth.user?.email?.toLowerCase() === ownerEmail ? '/media/profile/pablo-schefer-avatar.webp' : ''
  const chooseAvatar = (file: File | undefined) => {
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  return (
    <div className="account-page">
      <section className="account-hero">
        <m.div className="account-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">{labels.eyebrow}</p><h1>{labels.title}</h1><p>{labels.intro}</p>
        </m.div>
        <m.div className="account-panel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          {!auth.configured ? (
            <div className="account-panel__missing"><ShieldCheck size={36} /><h2>{labels.missing}</h2><p>{labels.missingBody}</p></div>
          ) : auth.loading ? (
            <div className="account-panel__missing"><span className="account-loader" /><p>{locale === 'es' ? 'Comprobando sesión…' : 'Checking session…'}</p></div>
          ) : auth.user && activeMode !== 'reset' ? (
            <div className="account-panel__profile">
              <div className="account-avatar-control">
                <label className="account-avatar account-avatar--editable" title={locale === 'es' ? 'Haz clic para cambiar tu foto' : 'Click to change your photo'}>
                  {avatarUrl ? <img src={avatarUrl} alt="" /> : <UserRound size={34} />}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void run(() => auth.updateAvatar(file)) }} />
                </label>
                <div><strong>{locale === 'es' ? 'Foto de perfil' : 'Profile photo'}</strong><small>{locale === 'es' ? 'Haz clic en la imagen para cambiarla' : 'Click the image to change it'}</small></div>
              </div><p className="eyebrow">{labels.account}</p><h2>{displayName || labels.username}</h2>
              <p className="account-panel__email">{auth.user.email}</p>
              {needsUsername && (
                <form className="account-username-form" onSubmit={saveUsername}>
                  <label><span><UserRound size={15} />{labels.username}</span><input autoComplete="nickname" minLength={3} maxLength={32} required value={username} onChange={(event) => setUsername(event.target.value)} placeholder={labels.usernamePlaceholder} /></label>
                  {notice && <p className="account-notice">{notice}</p>}{error && <p className="account-error">{error}</p>}
                  <button className="account-submit" type="submit" disabled={busy}>{busy ? '…' : labels.saveUsername}<ArrowRight size={17} /></button>
                </form>
              )}
              <div className="account-panel__facts"><span><CheckCircle2 size={16} />{labels.verified}</span><span><ShieldCheck size={16} />{labels.security}</span></div>
              <button className="account-panel__secondary" type="button" onClick={() => { setMode('reset'); setNotice(null); setError(null) }}><KeyRound size={17} />{labels.changePassword}</button>
              <button type="button" onClick={() => void run(auth.signOut)} disabled={busy}><LogOut size={17} />{labels.logout}</button>
            </div>
          ) : (
            <>
              <div className="account-tabs" role="tablist">
                <button type="button" className={activeMode === 'login' || activeMode === 'forgot' ? 'is-active' : ''} onClick={() => setMode('login')}>{labels.login}</button>
                <button type="button" className={activeMode === 'register' || activeMode === 'verify' ? 'is-active' : ''} onClick={() => setMode('register')}>{labels.register}</button>
              </div>
              <form onSubmit={submit}>
                <h2>{activeMode === 'login' ? labels.login : activeMode === 'register' ? labels.register : activeMode === 'verify' ? labels.verify : activeMode === 'forgot' ? labels.forgot : labels.reset}</h2>
                {(activeMode === 'register' || activeMode === 'verify') && <label><span><UserRound size={15} />{labels.username}</span><input autoComplete="nickname" minLength={3} maxLength={32} required value={username} onChange={(event) => setUsername(event.target.value)} placeholder={labels.usernamePlaceholder} readOnly={activeMode === 'verify'} /></label>}
                {(activeMode === 'register' || activeMode === 'verify') && <label className="account-avatar-picker"><span><ImagePlus size={15} />{locale === 'es' ? 'Foto de perfil (opcional)' : 'Profile photo (optional)'}</span><div className="account-avatar-picker__row">{avatarPreview ? <img src={avatarPreview} alt="Vista previa" /> : <span className="account-avatar-picker__placeholder"><ImagePlus size={20} /></span>}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => chooseAvatar(event.target.files?.[0])} /><small>{locale === 'es' ? 'PNG, JPG o WebP · máximo 5 MB' : 'PNG, JPG or WebP · 5 MB max'}</small></div></label>}
                {activeMode !== 'reset' && <label><span><Mail size={15} />{labels.email}</span><input type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} readOnly={activeMode === 'verify'} /></label>}
                {(activeMode === 'login' || activeMode === 'register' || activeMode === 'reset') && <label><span><KeyRound size={15} />{labels.password}</span><input type="password" autoComplete={activeMode === 'login' ? 'current-password' : 'new-password'} minLength={activeMode === 'login' ? 8 : 12} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
                {activeMode === 'reset' && <label><span><KeyRound size={15} />{labels.passwordConfirmation}</span><input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} /></label>}
                {activeMode === 'verify' && <label><span><ShieldCheck size={15} />{labels.code}</span><input className="account-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" minLength={8} maxLength={8} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 8))} /></label>}
                {notice && <p className="account-notice">{notice}</p>}{error && <p className="account-error">{error}</p>}
                <button className="account-submit" type="submit" disabled={busy}>{busy ? '…' : activeMode === 'login' ? labels.enter : activeMode === 'register' ? labels.send : activeMode === 'verify' ? labels.confirm : activeMode === 'forgot' ? labels.resetSend : labels.updatePassword}<ArrowRight size={17} /></button>
                {activeMode === 'verify' && <button className="account-resend" type="button" disabled={busy} onClick={() => void run(async () => { await auth.sendRegistrationCode(email.trim()); setNotice(labels.sent) })}>{labels.resend}</button>}
                {activeMode === 'login' && <button className="account-resend" type="button" onClick={() => { setMode('forgot'); setNotice(null); setError(null) }}>{labels.forgotLink}</button>}
                {activeMode === 'reset' ? (
                  <button className="account-switch" type="button" onClick={() => { setMode(auth.user ? 'login' : 'forgot'); setPassword(''); setPasswordConfirmation('') }}>{labels.cancel}</button>
                ) : (
                  <button className="account-switch" type="button" onClick={switchMode}>{activeMode === 'login' ? labels.switchRegister : labels.switchLogin}</button>
                )}
              </form>
            </>
          )}
        </m.div>
      </section>
    </div>
  )
}
