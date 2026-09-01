export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
  author: { name: string; avatar: string; role: string }
  featured: boolean
  color: string
}

const author = {
  name: "Pablo Schefer Orduña",
  avatar: "/pablo-avatar.gif",
  role: "Full-Stack Developer & OSS Maintainer",
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "building-papigecode-portfolio",
    title: "Construyendo el portfolio de PapiGECode",
    excerpt: "Cómo convertí una web personal en un laboratorio vivo con Next.js, integraciones públicas, animaciones y un sistema visual propio.",
    content: `
## Un laboratorio, no solo una página

PapiGECode reúne proyectos, experimentos, comunidades e integraciones en un mismo espacio. La interfaz tenía que sentirse técnica, pero también personal y fácil de explorar.

## Decisiones principales

- Next.js y TypeScript para una base mantenible.
- Componentes reutilizables para navegación, actividad y proyectos.
- GitHub como fuente pública de repositorios.
- Un lenguaje visual oscuro con acentos turquesa y movimiento contenido.

## El objetivo

La web no intenta parecer una plantilla corporativa. Documenta lo que construyo y deja que cada sección tenga una función: proyectos, actividad, notas y contacto.
    `,
    date: "Sep 1, 2026",
    readTime: "6 min read",
    category: "frontend",
    tags: ["nextjs", "react", "typescript", "portfolio"],
    author,
    featured: true,
    color: "from-primary/20 to-emerald-500/20",
  },
  {
    id: 2,
    slug: "duolingo-streak-keeper-automation",
    title: "Duolingo Streak Keeper: automatización con Playwright",
    excerpt: "Un proyecto para automatizar comprobaciones de sesión y progreso con Playwright, estado cifrado y flujos reproducibles.",
    content: `
## Automatizar lo repetitivo

Duolingo Streak Keeper nació para quitar fricción a una rutina concreta: comprobar sesiones, consultar el progreso y ejecutar acciones programadas sin depender de pasos manuales.

## Qué aprendí

Playwright funciona mejor cuando cada acción tiene una comprobación clara. Los selectores resistentes, los reintentos controlados y los registros hacen que el flujo sea más fácil de mantener.

El estado sensible se protege antes de entrar en cualquier automatización, y GitHub Actions permite repetir el proceso de forma consistente.
    `,
    date: "Aug 18, 2026",
    readTime: "7 min read",
    category: "automation",
    tags: ["playwright", "nodejs", "automation", "github-actions"],
    author,
    featured: false,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 3,
    slug: "kicord-discord-plugins",
    title: "KiCord: extender un cliente de Discord",
    excerpt: "El recorrido detrás de un cliente de Discord con instalación guiada, mejoras de experiencia y un ecosistema de plugins.",
    content: `
## Más control sobre la experiencia

KiCord parte de una idea sencilla: un cliente puede ser más útil cuando sus extensiones se instalan y mantienen con claridad.

## El papel de los plugins

Cada plugin resuelve una necesidad concreta. La documentación, la compatibilidad y una instalación predecible son tan importantes como el código que añade la funcionalidad.

Trabajar en este ecosistema también obliga a pensar en rendimiento, actualizaciones y en cómo comunicar los cambios a una comunidad activa.
    `,
    date: "Jul 30, 2026",
    readTime: "6 min read",
    category: "community",
    tags: ["discord", "kicord", "plugins", "opensource"],
    author,
    featured: false,
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    id: 4,
    slug: "project-vi-technical-archive",
    title: "Project VI: integridad, archivos y sistemas",
    excerpt: "Un archivo técnico para catalogar recursos, verificar integridad y experimentar con C++, Lua, HLSL y herramientas de sistemas.",
    content: `
## Cuando un archivo también es una herramienta

Project VI combina catalogación, hashes SHA-256 y verificación de integridad para que los recursos puedan comprobarse y recuperarse con confianza.

## Diseñar para volver a usarlo

La parte importante no es guardar datos una vez, sino poder entender qué se guardó, comprobar que no cambió y ampliar el archivo sin romper lo anterior.

Este proyecto conecta programación de sistemas, experimentación gráfica y tooling en un mismo espacio técnico.
    `,
    date: "Jun 12, 2026",
    readTime: "8 min read",
    category: "systems",
    tags: ["c++", "lua", "hlsl", "integrity"],
    author,
    featured: false,
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    id: 5,
    slug: "lanyard-discord-activity-dashboard",
    title: "De Discord a una actividad en directo",
    excerpt: "Cómo mostrar música, videojuegos y anime mediante presencia pública de Discord y Lanyard sin exponer tokens privados.",
    content: `
## Una presencia pública útil

La sección de actividad de PapiGECode transforma la presencia pública de Discord en una vista propia para música, juegos y anime.

## El reto de los cambios frecuentes

Las presencias pueden actualizarse varias veces por minuto. Para evitar parpadeos, la interfaz conserva la estructura del widget y cambia solo los datos que realmente han variado.

La integración muestra únicamente información pública y mantiene el diseño alineado con el resto de la web.
    `,
    date: "May 24, 2026",
    readTime: "7 min read",
    category: "integrations",
    tags: ["discord", "lanyard", "realtime", "api"],
    author,
    featured: false,
    color: "from-pink-500/20 to-red-500/20",
  },
  {
    id: 6,
    slug: "communities-and-open-source",
    title: "Código con contexto: comunidades y open source",
    excerpt: "Lo que moderar comunidades desde 2015 me enseñó sobre documentación, coordinación y software que otras personas puedan usar.",
    content: `
## El software también es coordinación

Mi trabajo con comunidades como FNLB, Nate Gentile, Edgar Pons y Thiago Community influye directamente en cómo diseño proyectos.

Escuchar, documentar y resolver conflictos son habilidades técnicas cuando un producto tiene usuarios reales. El código funciona mejor cuando entiende el espacio que va a ocupar.

Por eso PapiGECode mezcla repositorios, experimentos y comunidad: son partes de la misma trayectoria.
    `,
    date: "Apr 9, 2026",
    readTime: "5 min read",
    category: "community",
    tags: ["community", "opensource", "discord", "documentation"],
    author,
    featured: false,
    color: "from-teal-500/20 to-cyan-500/20",
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []

  return blogPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, limit)
}
