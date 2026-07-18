import { Link } from 'react-router-dom'
import type { SiteCopy } from '../content'

export function SiteFooter({ content }: { content: SiteCopy }) {
  return (
    <footer className="site-footer">
      <Link className="brand" to="/" aria-label={content.common.homeLabel}>
        <span className="brand__mark" aria-hidden="true">
          <img src="/media/profile/pablo-schefer-avatar.webp" alt="" width="64" height="64" loading="lazy" />
        </span>
        <span className="brand__name">Pablo Schefer</span>
      </Link>
      <p>© {new Date().getFullYear()} · {content.footer}</p>
      <nav className="site-footer__actions" aria-label="Enlaces secundarios">
        <details className="site-footer__legal">
          <summary>Legal</summary>
          <nav aria-label="Información legal">
            <Link to="/legal/cookies">Política de cookies</Link>
            <Link to="/legal/privacidad">Política de privacidad</Link>
            <Link to="/legal/aviso-legal">Aviso legal</Link>
            <Link to="/legal/condiciones-venta">Condiciones de venta</Link>
          </nav>
        </details>
        <a
          className="site-footer__demo"
          href="https://cima-plantilla-negocios.nadjjar.chatgpt.site"
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir demostración CIMA en una pestaña nueva"
        >
          Demo / CIMA <span aria-hidden="true">↗</span>
        </a>
        <Link to="/" aria-label={content.common.backToTopLabel}>↑ Top</Link>
      </nav>
    </footer>
  )
}
