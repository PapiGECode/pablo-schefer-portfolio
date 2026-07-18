import { Link } from 'react-router-dom'
import './LegalPage.css'

type LegalType = 'cookies' | 'privacidad' | 'aviso-legal' | 'condiciones-venta'

const pageCopy: Record<LegalType, { eyebrow: string; title: string; intro: string; sections: Array<{ title: string; body: string }> }> = {
  cookies: {
    eyebrow: 'Información legal',
    title: 'Política de cookies.',
    intro: 'Esta política explica qué son las cookies, cuáles puede utilizar este sitio y cómo puedes gestionar tu consentimiento.',
    sections: [
      { title: '¿Qué son las cookies?', body: 'Las cookies son pequeños archivos que se guardan en tu navegador para recordar preferencias, mantener sesiones y facilitar el funcionamiento de una web. Por sí solas no permiten identificarte directamente.' },
      { title: 'Tipos de cookies', body: 'Podemos distinguir entre cookies técnicas, necesarias para prestar el servicio; cookies de preferencias, que recuerdan opciones como el idioma; y cookies de medición o terceros, que solo deberían activarse con tu autorización cuando no estén exentas.' },
      { title: 'Cookies utilizadas en esta web', body: 'El portafolio utiliza almacenamiento local y cookies técnicas vinculadas a la sesión, idioma, preferencias de interfaz y funcionalidades solicitadas por la persona usuaria. No se utilizan cookies publicitarias propias.' },
      { title: 'Retirada del consentimiento', body: 'Puedes retirar o modificar tu consentimiento en cualquier momento borrando los datos del sitio desde la configuración de tu navegador. La retirada no afecta a los tratamientos realizados antes de ella.' },
      { title: 'Cómo deshabilitarlas', body: 'Puedes bloquear o eliminar cookies desde la configuración de Chrome, Edge, Firefox, Safari o el navegador que utilices. El bloqueo de cookies técnicas puede impedir que funcionen correctamente el inicio de sesión o determinadas preferencias.' },
      { title: 'Cookies de terceros', body: 'Algunos servicios enlazados desde el portafolio —por ejemplo, Discord, Spotify, YouTube, Supabase o Vercel— pueden aplicar sus propias cookies cuando interactúas con ellos. Consulta sus políticas antes de utilizarlos.' },
    ],
  },
  privacidad: {
    eyebrow: 'Información legal',
    title: 'Política de privacidad.',
    intro: 'Aquí se explica qué datos se tratan cuando utilizas las funciones de este portafolio y qué derechos tienes sobre ellos.',
    sections: [
      { title: 'Responsable', body: 'Responsable: Pablo Schefer. Contacto: pablo@mep41@gmail.com. Si necesitas completar una dirección postal, NIF u otros datos identificativos para una actividad profesional, deben añadirse antes de publicar esta política como documento definitivo.' },
      { title: 'Datos que pueden tratarse', body: 'Según la función que utilices, pueden tratarse correo electrónico, nombre de usuario, avatar, mensajes del chat, reseñas, preferencias de idioma y datos técnicos imprescindibles para seguridad y funcionamiento. No introduzcas datos sensibles en formularios públicos.' },
      { title: 'Finalidades y bases', body: 'Los datos se utilizan para crear y mantener cuentas, verificar el correo, prestar las funciones solicitadas, responder mensajes, moderar la comunidad, prevenir abusos y mantener la seguridad. La base jurídica puede ser la ejecución del servicio, el consentimiento o el interés legítimo de seguridad, según el caso.' },
      { title: 'Conservación y destinatarios', body: 'Los datos se conservan solo durante el tiempo necesario para cada finalidad o mientras exista una obligación legal. Para prestar el servicio pueden intervenir proveedores tecnológicos como Supabase, Resend, Vercel, Discord o servicios de presencia; cada uno aplica sus propias condiciones y políticas.' },
      { title: 'Tus derechos', body: 'Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, o retirar un consentimiento, escribiendo al contacto indicado. También puedes reclamar ante la Agencia Española de Protección de Datos si consideras que el tratamiento no cumple la normativa.' },
      { title: 'Seguridad', body: 'Se aplican controles técnicos y organizativos razonables, pero ningún servicio conectado a Internet está libre de riesgo. Usa una contraseña única, no compartas códigos de verificación y avisa de cualquier acceso no autorizado.' },
    ],
  },
  'aviso-legal': {
    eyebrow: 'Información legal',
    title: 'Aviso legal.',
    intro: 'Estas condiciones identifican el sitio, explican su finalidad y establecen las reglas básicas de uso.',
    sections: [
      { title: 'Titularidad', body: 'El titular de este portafolio es Pablo Schefer. Contacto: pablo@mep41@gmail.com. Los datos fiscales y la dirección profesional deberán completarse cuando el sitio se utilice como actividad económica o comercial.' },
      { title: 'Objeto del sitio', body: 'El sitio muestra el perfil, proyectos, colaboraciones, comunidades y actividades públicas de Pablo Schefer. Algunas funciones dependen de servicios externos y pueden cambiar o dejar de estar disponibles.' },
      { title: 'Uso permitido', body: 'La navegación debe realizarse de forma lícita, respetuosa y compatible con la seguridad del servicio. Queda prohibido intentar acceder a cuentas ajenas, introducir código malicioso, automatizar abusivamente las solicitudes o utilizar el contenido para suplantar identidades.' },
      { title: 'Propiedad intelectual', body: 'El diseño, código, textos y recursos propios del portafolio pertenecen a sus respectivos titulares. No se autoriza su reproducción, distribución o explotación comercial sin permiso, salvo los usos permitidos por la ley.' },
      { title: 'Enlaces externos', body: 'Los enlaces a Discord, Spotify, YouTube, proyectos o comunidades llevan a servicios de terceros. Pablo Schefer no controla sus contenidos, disponibilidad ni políticas, por lo que debes revisarlas antes de usarlos.' },
      { title: 'Responsabilidad', body: 'La información se ofrece con finalidad informativa y de portfolio. Se procura mantenerla actualizada, pero no se garantiza que esté libre de errores, interrupciones o cambios en servicios externos.' },
    ],
  },
  'condiciones-venta': {
    eyebrow: 'Información legal',
    title: 'Condiciones de venta.',
    intro: 'Actualmente este portafolio no ofrece una tienda ni contratación directa. Esta página queda preparada para cuando se publiquen servicios o productos.',
    sections: [
      { title: 'Ámbito de aplicación', body: 'Estas condiciones se aplicarían a servicios o productos contratados a través de la web. En este momento no existe un proceso de compra online activo ni se formalizan ventas desde el portafolio.' },
      { title: 'Información previa', body: 'Antes de cualquier contratación se facilitarían la identidad del profesional, descripción del servicio, precio total, impuestos, plazos, medios de pago, condiciones de cancelación y canales de atención.' },
      { title: 'Contratación y pago', body: 'Ningún formulario de contacto o conversación implica por sí solo una compra. La contratación solo existiría tras una propuesta aceptada expresamente y con las condiciones económicas confirmadas por escrito.' },
      { title: 'Desistimiento y cancelación', body: 'Cuando se ofrezcan servicios a consumidores, se informará de los derechos de desistimiento y de las excepciones aplicables a trabajos personalizados o ya iniciados con autorización expresa, conforme a la normativa vigente.' },
      { title: 'Actualización', body: 'Esta página se actualizará antes de activar cualquier sistema de venta. Si ves una oferta o formulario que contradice esta información, contacta antes de realizar ningún pago.' },
    ],
  },
}

export function LegalPage({ type }: { type: LegalType }) {
  const content = pageCopy[type]

  return (
    <article className="legal-page section">
      <div className="legal-page__topline">
        <Link to="/" className="legal-page__back">← Volver al inicio</Link>
        <span>Última actualización · julio de 2026</span>
      </div>
      <header className="legal-page__header">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </header>
      <div className="legal-page__body">
        {content.sections.map((section, index) => (
          <section key={section.title} className="legal-page__section">
            <span className="legal-page__index">0{index + 1}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </section>
        ))}
      </div>
      <p className="legal-page__note">Este texto es una plantilla informativa y debe revisarse con los datos reales del titular y la actividad antes de utilizarse como asesoramiento jurídico.</p>
    </article>
  )
}

