import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SiteCopy } from '../content'

export function SiteFooter({ content }: { content: SiteCopy }) {
  const isSpanish = content.nav.home === 'Inicio'

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__identity">
          <Link className="brand" to="/" aria-label={content.common.homeLabel}>
            <span className="brand__mark" aria-hidden="true">
              <img src="/media/profile/pablo-schefer-avatar.webp" alt="" width="64" height="64" loading="lazy" />
            </span>
            <span className="brand__name"><strong>Pablo Schefer</strong><small>PapiGEGamer</small></span>
          </Link>
          <p>{content.footer}</p>
          <span className="site-footer__signal"><i className="status-dot" aria-hidden="true" />{isSpanish ? 'Señal activa desde España' : 'Signal live from Spain'}</span>
        </div>

        <nav className="site-footer__column" aria-label={isSpanish ? 'Explorar' : 'Explore'}>
          <strong>{isSpanish ? 'Explorar' : 'Explore'}</strong>
          <Link to="/">{content.nav.home}</Link>
          <Link to="/perfil">{content.nav.profile}</Link>
          <Link to="/comunidades">{content.nav.communities}</Link>
          <Link to="/#github">GitHub / Open Source</Link>
        </nav>

        <nav className="site-footer__column" aria-label={isSpanish ? 'Enlaces externos' : 'External links'}>
          <strong>{isSpanish ? 'Conectar' : 'Connect'}</strong>
          <a href="https://discord.com/users/1179009666110476328" target="_blank" rel="noreferrer">Discord <ArrowUpRight size={12} /></a>
          <a href="https://github.com/PapiGECode" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a>
          <a href="https://cima-plantilla-negocios.nadjjar.chatgpt.site" target="_blank" rel="noreferrer">Demo / CIMA <ArrowUpRight size={12} /></a>
        </nav>

        <nav className="site-footer__column" aria-label={isSpanish ? 'Información legal' : 'Legal information'}>
          <strong>Legal</strong>
          <Link to="/legal/cookies">{isSpanish ? 'Política de cookies' : 'Cookie policy'}</Link>
          <Link to="/legal/privacidad">{isSpanish ? 'Política de privacidad' : 'Privacy policy'}</Link>
          <Link to="/legal/aviso-legal">{isSpanish ? 'Aviso legal' : 'Legal notice'}</Link>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Pablo Schefer</span>
        <span>PS/O · COMMUNITY / PRODUCT / CODE</span>
        <Link to="/">{isSpanish ? 'Volver arriba' : 'Back to top'} ↑</Link>
      </div>
    </footer>
  )
}
