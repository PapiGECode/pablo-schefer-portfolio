import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import './LegalPage.css'

type LegalType = 'cookies' | 'privacidad' | 'aviso-legal'

type LegalSection = {
  title: string
  body: string[]
  items?: string[]
}

type OfficialSource = {
  label: string
  href: string
}

type LegalCopy = {
  eyebrow: string
  title: string
  intro: string
  highlights: string[]
  sections: LegalSection[]
  sources: OfficialSource[]
}

const contactEmail = 'pablopme41@gmail.com'

const pageCopy: Record<LegalType, LegalCopy> = {
  cookies: {
    eyebrow: 'Transparencia web',
    title: 'Política de cookies',
    intro: 'Información clara sobre lo que este portafolio guarda en tu navegador y para qué lo necesita.',
    highlights: ['Sin publicidad', 'Sin analítica propia', 'Almacenamiento funcional'],
    sections: [
      {
        title: 'Qué utiliza esta web',
        body: [
          'Este portafolio no instala cookies publicitarias ni utiliza herramientas propias para crear perfiles de navegación.',
          'Sí emplea almacenamiento local del navegador para recordar el idioma, mantener la sesión iniciada, conservar la posición de algunos paneles y gestionar funciones solicitadas, como el historial local de anime o la memoria personal de NEXO.',
        ],
      },
      {
        title: 'Datos técnicos necesarios',
        body: [
          'Supabase conserva en el navegador la información técnica necesaria para autenticar y renovar una sesión. Sin ella no funcionan el acceso a la cuenta, el chat ni las reseñas.',
          'Estas funciones se consideran necesarias para prestar el servicio que eliges utilizar y no se destinan a publicidad.',
        ],
      },
      {
        title: 'Contenido de terceros',
        body: [
          'El reproductor integrado de Spotify y los enlaces a Discord, YouTube u otros servicios pertenecen a terceros. Al cargar o abrir esos contenidos, sus proveedores pueden aplicar sus propias tecnologías de almacenamiento conforme a sus políticas.',
          'La web no controla el almacenamiento que un servicio externo realiza fuera de este dominio.',
        ],
      },
      {
        title: 'Memoria de NEXO',
        body: [
          'El nombre, las preferencias, las notas y el historial reciente de conversación que decidas compartir con la mascota virtual se guardan únicamente en el almacenamiento local de tu navegador. No se envían a una base de datos ni se vinculan a otras personas usuarias.',
          'Puedes borrar esa memoria desde el propio panel de NEXO en cualquier momento.',
        ],
      },
      {
        title: 'Cómo borrar o bloquear los datos',
        body: [
          'Puedes eliminar los datos del sitio desde la configuración de privacidad de tu navegador. También puedes bloquear el almacenamiento, aunque al hacerlo pueden dejar de funcionar el inicio de sesión y las preferencias guardadas.',
          'Borrar el almacenamiento local no elimina por sí solo una cuenta ni los mensajes o reseñas asociados a ella. Para eso puedes ejercer el derecho de supresión indicado en la Política de privacidad.',
        ],
      },
    ],
    sources: [
      { label: 'Guía sobre el uso de las cookies · AEPD', href: 'https://www.aepd.es/guias/guia-cookies.pdf' },
      { label: 'Artículo 22 de la LSSI · BOE', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a22' },
    ],
  },
  privacidad: {
    eyebrow: 'Protección de datos',
    title: 'Política de privacidad',
    intro: 'Qué datos se tratan, por qué se utilizan y cómo puedes mantener el control sobre ellos.',
    highlights: ['Datos mínimos', 'Sin venta de datos', 'Derechos garantizados'],
    sections: [
      {
        title: 'Quién gestiona tus datos',
        body: [
          `Pablo Schefer gestiona los datos tratados en este portafolio. Para consultas de privacidad o para ejercer tus derechos puedes escribir a ${contactEmail}.`,
        ],
      },
      {
        title: 'Datos y finalidades',
        body: ['Solo se tratan los datos necesarios para la función que decides utilizar.'],
        items: [
          'Cuenta: correo electrónico, nombre de usuario, avatar y datos técnicos de autenticación.',
          'Comunidad: mensajes del chat y reseñas que decidas publicar.',
          'Contacto: nombre, correo y contenido del mensaje que envíes.',
          'Seguridad: datos técnicos mínimos para prevenir abuso, limitar solicitudes y resolver incidencias.',
          'Paneles en directo: nombres, avatares, canales y actividad que Discord o Lanyard hacen públicos. La web los consulta para mostrarlos y no crea un historial permanente de esas personas.',
        ],
      },
      {
        title: 'Base jurídica',
        body: [
          'La cuenta y sus funciones se tratan para prestar el servicio solicitado. Los mensajes de contacto se tratan para responder a tu petición. Las publicaciones del chat y las reseñas se muestran porque decides enviarlas a un espacio público para usuarios registrados.',
          'Las medidas contra fraude, abuso y accesos no autorizados se apoyan en el interés legítimo de proteger el sitio y a sus usuarios. Puedes retirar un consentimiento cuando esa sea la base aplicable, sin afectar al tratamiento anterior.',
        ],
      },
      {
        title: 'Conservación',
        body: [
          'Los datos de la cuenta se conservan mientras esta permanezca activa. Los mensajes y reseñas se mantienen hasta que se eliminen, se solicite su supresión o deban retirarse por moderación. Los mensajes enviados por el formulario se conservan durante el tiempo necesario para responder y atender posibles seguimientos.',
          'Los registros técnicos de seguridad se conservan durante el periodo limitado necesario para detectar incidencias. Después se eliminan o se agregan de forma que dejen de identificar a una persona.',
        ],
      },
      {
        title: 'Proveedores y transferencias',
        body: [
          'Supabase presta autenticación, base de datos y almacenamiento; Resend gestiona correos; y Vercel aloja y entrega la web. Solo reciben los datos necesarios para su función como proveedores tecnológicos.',
          'Estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. Cuando sea aplicable, el tratamiento se ampara en los mecanismos y garantías previstos por la normativa europea. Los servicios externos que abras directamente aplican sus propias políticas.',
        ],
      },
      {
        title: 'Tus derechos',
        body: [
          `Puedes solicitar gratuitamente acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a ${contactEmail}. La solicitud se responderá, con carácter general, en el plazo de un mes y podrá requerirse información razonable para verificar tu identidad.`,
          'Si consideras que tus datos no se han tratado correctamente, puedes reclamar ante la Agencia Española de Protección de Datos. Si eres menor de 14 años, no debes crear una cuenta sin la intervención de quien ejerza tu patria potestad o tutela.',
        ],
      },
    ],
    sources: [
      { label: 'Derecho de información · AEPD', href: 'https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion' },
      { label: 'Derechos de protección de datos · AEPD', href: 'https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos' },
      { label: 'LOPDGDD · BOE', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673' },
    ],
  },
  'aviso-legal': {
    eyebrow: 'Identidad y uso',
    title: 'Aviso legal',
    intro: 'La información esencial sobre este portafolio y unas reglas de uso sencillas.',
    highlights: ['Portafolio personal', 'Sin venta online', 'Contenido informativo'],
    sections: [
      {
        title: 'Titular del sitio',
        body: [
          `Este portafolio pertenece a Pablo Schefer. Puedes contactar por correo electrónico en ${contactEmail}.`,
          'El sitio presenta su perfil, proyectos, colaboraciones, comunidades y actividad pública. No funciona como tienda ni permite contratar o pagar servicios en línea.',
        ],
      },
      {
        title: 'Uso del sitio',
        body: [
          'Puedes navegar, consultar el contenido y utilizar las funciones disponibles con fines lícitos. No está permitido interferir en el funcionamiento del sitio, acceder a cuentas ajenas, vulnerar medidas de seguridad ni publicar contenido ilícito o que perjudique a otras personas.',
          'Los espacios de comunidad pueden moderarse y el contenido que incumpla estas reglas puede eliminarse.',
        ],
      },
      {
        title: 'Contenido y marcas',
        body: [
          'Los textos, el diseño y los recursos creados específicamente para este portafolio están protegidos por la normativa aplicable. Los nombres, logotipos, portadas y marcas de Discord, Spotify, YouTube, FNLB, KernelOS y otras comunidades o proyectos pertenecen a sus titulares y se muestran con fines identificativos o informativos.',
          'Nada en esta web implica patrocinio, certificación o relación oficial con esas marcas salvo que se indique expresamente.',
        ],
      },
      {
        title: 'Información y disponibilidad',
        body: [
          'Se procura que el contenido sea correcto y que las funciones permanezcan disponibles, pero los datos en directo y las integraciones dependen de servicios externos y pueden sufrir retrasos, cambios o interrupciones.',
          'Los enlaces externos se facilitan como referencia. Cada servicio es responsable de su contenido, seguridad y condiciones.',
        ],
      },
      {
        title: 'Cambios',
        body: [
          'Este aviso puede actualizarse cuando cambien las funciones de la web o la normativa aplicable. Si en el futuro se habilitan pagos o contratación directa, antes se publicará la información legal y contractual correspondiente.',
        ],
      },
    ],
    sources: [
      { label: 'Ley de Servicios de la Sociedad de la Información · BOE', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758' },
      { label: 'Información en compras online · Ministerio de Consumo', href: 'https://portal-cec.consumo.gob.es/es/informacion-general/compras-online/derechos-del-consumidor' },
    ],
  },
}

export function LegalPage({ type }: { type: LegalType }) {
  const content = pageCopy[type]

  return (
    <article className="legal-page section">
      <div className="legal-page__topline">
        <Link to="/" className="legal-page__back">← Volver al inicio</Link>
        <span>Revisado · 18 de julio de 2026</span>
      </div>

      <header className="legal-page__header">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <div className="legal-page__highlights" aria-label="Resumen">
          {content.highlights.map((highlight) => (
            <span key={highlight}><Check size={13} aria-hidden="true" />{highlight}</span>
          ))}
        </div>
      </header>

      <div className="legal-page__body">
        {content.sections.map((section, index) => (
          <section key={section.title} className="legal-page__section">
            <span className="legal-page__index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && (
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <aside className="legal-page__sources" aria-labelledby="official-sources">
        <div>
          <ShieldCheck size={22} aria-hidden="true" />
          <div>
            <p className="eyebrow">Referencias verificables</p>
            <h2 id="official-sources">Fuentes oficiales</h2>
          </div>
        </div>
        <nav aria-label="Fuentes legales oficiales">
          {content.sources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
              {source.label}<ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </aside>
    </article>
  )
}
