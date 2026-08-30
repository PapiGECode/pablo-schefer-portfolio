import type { CommunityKey } from './data/communities'
import { communityAssets } from './data/communityAssets'

export type Locale = 'es' | 'en'

type SeoCopy = { title: string; description: string }
type ProofItem = {
  type: string
  metric: string
  title: string
  text: string
  link: string
  linkLabel: string
  image?: string
  imageAlt?: string
  internal?: boolean
}

export type SiteCopy = {
  nav: {
    home: string
    profile: string
    communities: string
    allCommunities: string
    edgarLive: string
    fnlbLive: string
    valorantLive: string
    nateLive: string
    gw2Live: string
    projects: string
    personal: string
    gamesGear: string
    music: string
    anime: string
    fnlb: string
    kernelos: string
    contact: string
  }
  common: {
    homeLabel: string
    navigationLabel: string
    mobileNavigationLabel: string
    socialLabel: string
    backToTopLabel: string
    skipLabel: string
    menu: string
    close: string
    language: string
    current: string
    previous: string
    members: string
    online: string
    open: string
    live: string
    dataNote: string
  }
  seo: {
    home: SeoCopy
    profile: SeoCopy
    communities: SeoCopy
    edgar: SeoCopy
    gamesGear: SeoCopy
    music: SeoCopy
    anime: SeoCopy
    notFound: SeoCopy
  }
  home: {
    availability: string
    eyebrow: string
    heroTitle: string[]
    heroIntro: string
    primaryCta: string
    secondaryCta: string
    orbitLabel: string
    scroll: string
    expertiseEyebrow: string
    expertiseTitle: string
    expertiseIntro: string
    capabilities: { index: string; title: string; text: string; tags: string[] }[]
    communityEyebrow: string
    communityTitle: string
    communityIntro: string
    communityCta: string
    proofEyebrow: string
    proofTitle: string
    proofIntro: string
    proof: ProofItem[]
    bridgeLead: string
    bridgeText: string
    methodEyebrow: string
    methodTitle: string
    methodIntro: string
    method: { index: string; title: string; text: string }[]
  }
  profile: {
    eyebrow: string
    title: string
    lede: string
    body: string[]
    portraitLabel: string
    profileLoopLabel: string
    presence: string
    discordIdentity: { label: string; name: string; handle: string; meta: string; action: string }
    location: string
    stats: { value: string; label: string }[]
    rolesEyebrow: string
    rolesTitle: string
    rolesIntro: string
  }
  communities: {
    eyebrow: string
    title: string
    intro: string
    roleLabel: string
    viewCommunity: string
    viewLivePage: string
    cards: Record<CommunityKey, { role: string; text: string }>
    note: string
    philosophyEyebrow: string
    philosophyTitle: string
    philosophyBody: string
    principles: { index: string; title: string; text: string }[]
  }
  edgar: {
    eyebrow: string
    title: string
    intro: string
    roleLabel: string
    role: string
    liveEyebrow: string
    liveTitle: string
    liveIntro: string
    membersLabel: string
    onlineLabel: string
    voiceLabel: string
    visibleVoiceLabel: string
    voiceAvailable: string
    voiceUnavailable: string
    emptyVoice: string
    loading: string
    error: string
    retry: string
    updated: string
    join: string
    publicData: string
    aboutEyebrow: string
    aboutTitle: string
    aboutBody: string
    sourceNote: string
  }
  contact: {
    eyebrow: string
    title: string
    body: string
    cta: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submit: string
    sending: string
    success: string
    error: string
  }
  footer: string
  notFound: { eyebrow: string; title: string; body: string; cta: string }
}

export const copy: Record<Locale, SiteCopy> = {
  es: {
    nav: {
      home: 'Inicio',
      profile: 'Perfil',
      communities: 'Comunidades',
      allCommunities: 'Todas las comunidades',
      edgarLive: 'Edgar Pons · Live',
      fnlbLive: 'FNLB · Live',
      valorantLive: 'VALORANT ESP · Live',
      nateLive: 'Nate Gentile · Live',
      gw2Live: 'GW2 · Live',
      projects: 'Proyectos',
      personal: 'Personal',
      gamesGear: 'Juegos y equipo',
      music: 'Música',
      anime: 'Anime',
      fnlb: 'FNLB',
      kernelos: 'KernelOS',
      contact: 'Contacto',
    },
    common: {
      homeLabel: 'Pablo Schefer Orduña — inicio',
      navigationLabel: 'Navegación principal',
      mobileNavigationLabel: 'Navegación móvil',
      socialLabel: 'Redes y perfiles',
      backToTopLabel: 'Volver arriba',
      skipLabel: 'Saltar al contenido',
      menu: 'Abrir menú',
      close: 'Cerrar menú',
      language: 'Idioma',
      current: 'Actual',
      previous: 'Experiencia anterior',
      members: 'miembros aprox.',
      online: 'en línea aprox.',
      open: 'Abrir',
      live: 'En directo',
      dataNote: 'Datos públicos de Discord · 16.07.2026',
    },
    seo: {
      home: {
        title: 'Pablo Schefer — Comunidades, código y cultura digital',
        description: 'Portfolio de Pablo Schefer: moderación en Discord, vibecoding, proyectos digitales y presencia pública en tiempo real.',
      },
      profile: {
        title: 'Perfil — Pablo Schefer Orduña',
        description: 'Perfil de Pablo Schefer Orduña, PapiGEGamer en Discord: moderación de comunidades, vibecoding y colaboración digital.',
      },
      communities: {
        title: 'Comunidades — Pablo Schefer Orduña',
        description: 'Experiencia de Pablo Schefer moderando comunidades de tecnología, gaming y creadores, incluidas FNLB, Nate Gentile, Edgar Pons y Thiago Community.',
      },
      edgar: {
        title: 'Comunidad Edgar Pons — Estado de Discord',
        description: 'Panel público casi en tiempo real de la comunidad de Discord de Edgar Pons y experiencia de moderación de Pablo Schefer.',
      },
      gamesGear: {
        title: 'Juegos y equipo — Pablo Schefer',
        description: 'Juegos actuales, componentes del ordenador y uso de CPU, GPU, memoria y discos en tiempo real.',
      },
      music: {
        title: 'Música y Spotify — Pablo Schefer',
        description: 'Monitor musical de Pablo Schefer, preparado para mostrar su reproducción pública de Spotify mediante la presencia de Discord.',
      },
      anime: {
        title: 'Anime en directo — Pablo Schefer',
        description: 'Historial local y monitor en tiempo real de actividades públicas de anime detectadas mediante Lanyard y Discord.',
      },
      notFound: { title: 'Página no encontrada — Pablo Schefer', description: 'La página solicitada no existe.' },
    },
    home: {
      availability: 'Construyendo entre comunidad, código y producto',
      eyebrow: 'Discord · Vibecoding · Colaboración',
      heroTitle: ['Comunidades', 'con pulso.', 'Código', 'con intención.'],
      heroIntro: 'Soy Pablo Schefer — PapiGEGamer en Discord. Modero comunidades tecnológicas y convierto ideas en productos digitales mediante desarrollo asistido por IA.',
      primaryCta: 'Explorar comunidades',
      secondaryCta: 'Conocer mi perfil',
      orbitLabel: 'Comunidad / Producto / Código',
      scroll: 'Desplazar para explorar',
      expertiseEyebrow: '01 — Ámbitos',
      expertiseTitle: 'Discord, producto y código.',
      expertiseIntro: 'Me muevo entre comunidades online y desarrollo web: modero, organizo y construyo herramientas que resuelven necesidades reales.',
      capabilities: [
        {
          index: '01',
          title: 'Discord y moderación',
          text: 'Ayudo a mantener comunidades claras, seguras y activas mediante moderación, coordinación, documentación y operación diaria.',
          tags: ['Discord', 'Moderación', 'Operaciones', 'Comunidad'],
        },
        {
          index: '02',
          title: 'Vibecoding y producto',
          text: 'Creo webs y herramientas con React y TypeScript, apoyándome en IA cuando aporta velocidad sin renunciar al control técnico.',
          tags: ['React', 'TypeScript', 'IA aplicada', 'Prototipado'],
        },
        {
          index: '03',
          title: 'Colaboración abierta',
          text: 'En FNLB y KernelOS colaboro con producto, soporte y comunidad para que las ideas terminen llegando a usuarios reales.',
          tags: ['FNLB', 'KernelOS', 'GitHub', 'Iteración'],
        },
      ],
      communityEyebrow: '02 — Comunidades',
      communityTitle: 'Moderación con contexto, escala y cercanía.',
      communityIntro: 'Actualmente modero FNLB, Nate Gentile, Edgar Pons y Thiago Community. Mi recorrido incluye también GW2 / Gatitos 2, VALORANT ESP y más comunidades.',
      communityCta: 'Ver experiencia completa',
      proofEyebrow: '03 — Proyectos y ecosistemas',
      proofTitle: 'Donde participo. Lo que ayudo a construir.',
      proofIntro: 'Dos proyectos en los que participo y una parte de las comunidades que forman mi recorrido.',
      proof: [
        {
          type: 'Producto · Comunidad',
          metric: '60K',
          title: 'FNLB',
          text: 'Colaboro en el ecosistema FNLB, una plataforma de lobby bots para Fortnite donde producto, soporte y comunidad avanzan juntos.',
          link: '/proyectos/fnlb',
          linkLabel: 'Conocer FNLB',
          image: communityAssets.fnlbCoverStatic,
          imageAlt: 'Identidad visual azul de FNLB',
          internal: true,
        },
        {
          type: 'Proyecto · Comunidad',
          metric: '50K+',
          title: 'KernelOS',
          text: 'Colaboro en el ecosistema KernelOS: CustomOS para gaming, baja latencia y comunidad Discord. Su servidor histórico superó 1.500.000 miembros; tras el cierre, el nuevo reúne más de 50.000.',
          link: '/proyectos/kernelos',
          linkLabel: 'Ver KernelOS',
          image: '/media/projects/kernelos-cover.webp',
          imageAlt: 'Fondo oscuro de KernelOS con una máscara oni',
          internal: true,
        },
        {
          type: 'Discord · Operaciones',
          metric: '07+',
          title: 'Red de comunidades',
          text: 'Siete experiencias públicas destacadas y otros roles actuales e históricos en gaming, tecnología y creadores.',
          link: '/comunidades',
          linkLabel: 'Explorar comunidades',
          image: communityAssets.edgarPonsCover,
          imageAlt: 'Identidad visual de la comunidad de Edgar Pons',
          internal: true,
        },
      ],
      bridgeLead: 'Lo que conecta todo:',
      bridgeText: 'personas, tecnología y ganas de hacer que las cosas funcionen.',
      methodEyebrow: '04 — En el día a día',
      methodTitle: 'Lo que aporto a un equipo.',
      methodIntro: 'Más allá del cargo, mi trabajo se nota en la comunicación, el orden y la capacidad de resolver.',
      method: [
        { index: '01', title: 'Estar presente', text: 'Conocer el ritmo de la comunidad y detectar problemas antes de que escalen.' },
        { index: '02', title: 'Mantener el orden', text: 'Aplicar criterios claros y ayudar al equipo a responder de forma coherente.' },
        { index: '03', title: 'Construir', text: 'Convertir una necesidad concreta en una herramienta o una experiencia web útil.' },
        { index: '04', title: 'Dar continuidad', text: 'Seguir los temas abiertos, comunicar avances y cerrar bien cada tarea.' },
      ],
    },
    profile: {
      eyebrow: 'Perfil — PapiGEGamer',
      title: 'Comunidad primero. Curiosidad técnica. Entrega constante.',
      lede: 'Llevo en Discord desde 2015. Ahí aprendí a coordinar personas, cuidar comunidades y convertir problemas cotidianos en soluciones.',
      body: [
        'Soy Pablo Schefer Orduña. Mi trayectoria digital nace en Discord, donde actualmente modero las comunidades de FNLB, Nate Gentile, Edgar Pons y Thiago Community.',
        'También he moderado GW2 —conocido como Gatitos 2—, VALORANT ESP y más comunidades. Estas siete fichas son experiencias públicas destacadas, no el límite de mi recorrido.',
        'También programo mediante vibecoding con React y TypeScript. Es la parte técnica de un perfil que siempre empieza por entender a las personas que van a usar lo que construyo.',
      ],
      portraitLabel: 'Pablo / PapiGEGamer',
      profileLoopLabel: 'Comunidad / producto / código',
      presence: 'En línea',
      discordIdentity: {
        label: 'Perfil de Discord',
        name: 'PapiGEGamer 🐾',
        handle: '@papigegamerantiguo',
        meta: 'Moderación · Tecnología · Vibecoding',
        action: 'Abrir perfil',
      },
      location: 'España · En Discord desde 2015',
      stats: [
        { value: '04+', label: 'comunidades moderadas actualmente' },
        { value: '02+', label: 'experiencias anteriores destacadas' },
        { value: '2015', label: 'inicio en Discord' },
      ],
      rolesEyebrow: 'Experiencia',
      rolesTitle: 'Comunidades que forman parte de mi recorrido.',
      rolesIntro: 'Siete roles públicos destacados, dentro de una trayectoria que incluye otros servidores actuales e históricos.',
    },
    communities: {
      eyebrow: 'Comunidades — Discord',
      title: 'Detrás de cada cifra hay personas, contexto y confianza.',
      intro: 'Estas siete fichas reúnen experiencias públicas destacadas; además modero y he moderado otros servidores de tecnología, gaming y creadores. El objetivo siempre es que la conversación fluya sin perder identidad.',
      roleLabel: 'Rol',
      viewCommunity: 'Abrir comunidad',
      viewLivePage: 'Ver página en directo',
      cards: {
        fnlb: { role: 'Moderador actual', text: 'Moderación y colaboración dentro de un ecosistema que une lobby bots de Fortnite, soporte, producto y una comunidad cercana a 60.000 miembros.' },
        nate: { role: 'Moderador actual', text: 'Moderación en la comunidad de Nate Gentile, un espacio centrado en tecnología, hardware y divulgación.' },
        edgar: { role: 'Moderador actual', text: 'Moderación en la comunidad de Edgar Pons. Cuenta con una página propia y un panel basado en el widget público de Discord.' },
        tiago: { role: 'Moderador actual', text: 'Moderación en Thiago Community, el servidor de Discord vinculado al creador ThiagoIUTU.' },
        kernelos: { role: 'Colaborador · Comunidad', text: 'KernelOS combina CustomOS y comunidad Discord. El servidor histórico superó 1.500.000 miembros; tras su cierre, el nuevo reúne más de 50.000 usuarios.' },
        gw2: { role: 'Moderador anterior', text: 'Experiencia de moderación en GW2, conocido como Gatitos 2: una comunidad social y gaming que supera los 103.000 miembros.' },
        valorant: { role: 'Moderador anterior', text: 'Experiencia histórica en una de las grandes comunidades hispanohablantes dedicadas a VALORANT.' },
      },
      note: 'Selección de siete experiencias públicas; no representa todos los servidores. Los cargos reflejan la información facilitada por Pablo y las cifras son aproximadas.',
      philosophyEyebrow: 'Cómo modero',
      philosophyTitle: 'Presencia visible. Criterio sereno. Sistemas claros.',
      philosophyBody: 'La buena moderación no consiste solo en reaccionar: combina escucha, consistencia, documentación y coordinación para prevenir problemas y sostener una cultura sana.',
      principles: [
        { index: '01', title: 'Escuchar', text: 'Entender primero el contexto y separar una incidencia puntual de un patrón real.' },
        { index: '02', title: 'Decidir', text: 'Aplicar criterios coherentes, proporcionados y comprensibles para la comunidad.' },
        { index: '03', title: 'Documentar', text: 'Dejar procesos claros para que el equipo pueda responder con continuidad.' },
      ],
    },
    edgar: {
      eyebrow: 'Comunidad destacada — Edgar Pons',
      title: 'Una ventana viva a la comunidad.',
      intro: 'Una página dedicada a mi trabajo como moderador y a la actividad pública que Discord permite consultar de forma segura.',
      roleLabel: 'Mi rol',
      role: 'Moderador actual',
      liveEyebrow: 'Discord · Monitor automático',
      liveTitle: 'Actividad pública ahora.',
      liveIntro: 'Miembros, actividad y canales de voz visibles en un panel que se actualiza mientras navegas.',
      membersLabel: 'Miembros, aprox.',
      onlineLabel: 'En línea, aprox.',
      voiceLabel: 'En voz',
      visibleVoiceLabel: 'visibles públicamente',
      voiceAvailable: 'Actividad pública de voz disponible',
      voiceUnavailable: 'La actividad pública de voz no está disponible.',
      emptyVoice: 'No hay participantes visibles en los canales públicos ahora mismo.',
      loading: 'Conectando con el widget público de Discord…',
      error: 'No he podido actualizar el panel en este momento.',
      retry: 'Reintentar',
      updated: 'Actualizado',
      join: 'Entrar al Discord',
      publicData: 'Datos públicos · Sin bot ni token privado',
      aboutEyebrow: 'La integración',
      aboutTitle: 'Edgar Pons Live.',
      aboutBody: 'Una vista directa de la parte pública del servidor y de mi trabajo dentro de la comunidad.',
      sourceNote: 'Discord limita el widget a canales visibles para @everyone y a un máximo de 100 miembros públicos. Por eso “en voz” representa personas visibles, no un censo completo del servidor.',
    },
    contact: {
      eyebrow: 'Contacto',
      title: 'Escríbeme directo.',
      body: 'Deja tu correo y el mensaje. Me llega automáticamente al email y puedo responderte desde ahí.',
      cta: 'Abrir Discord',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre o nick',
      emailLabel: 'Tu correo',
      emailPlaceholder: 'tu@email.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Cuéntame qué quieres proponer, preguntar o construir.',
      submit: 'Enviar mensaje',
      sending: 'Enviando',
      success: 'Mensaje enviado. Me llegará directo al correo.',
      error: 'No se ha podido enviar ahora mismo. Prueba otra vez en unos segundos.',
    },
    footer: 'Pablo Schefer · Discord, comunidades y desarrollo web.',
    notFound: { eyebrow: '404 — Fuera de ruta', title: 'Esta página no existe.', body: 'La navegación sigue viva; solo has llegado a una ruta que todavía no forma parte del mapa.', cta: 'Volver al inicio' },
  },
  en: {
    nav: {
      home: 'Home',
      profile: 'Profile',
      communities: 'Communities',
      allCommunities: 'All communities',
      edgarLive: 'Edgar Pons · Live',
      fnlbLive: 'FNLB · Live',
      valorantLive: 'VALORANT ESP · Live',
      nateLive: 'Nate Gentile · Live',
      gw2Live: 'GW2 · Live',
      projects: 'Projects',
      personal: 'Personal',
      gamesGear: 'Games & gear',
      music: 'Music',
      anime: 'Anime',
      fnlb: 'FNLB',
      kernelos: 'KernelOS',
      contact: 'Contact',
    },
    common: {
      homeLabel: 'Pablo Schefer Orduña — home',
      navigationLabel: 'Main navigation',
      mobileNavigationLabel: 'Mobile navigation',
      socialLabel: 'Social links and profiles',
      backToTopLabel: 'Back to top',
      skipLabel: 'Skip to content',
      menu: 'Open menu',
      close: 'Close menu',
      language: 'Language',
      current: 'Current',
      previous: 'Previous experience',
      members: 'members, approx.',
      online: 'online, approx.',
      open: 'Open',
      live: 'Live',
      dataNote: 'Public Discord data · 16 Jul 2026',
    },
    seo: {
      home: { title: 'Pablo Schefer — Communities, code & digital culture', description: 'Pablo Schefer’s portfolio: Discord moderation, vibe coding, digital projects and public real-time presence.' },
      profile: { title: 'Profile — Pablo Schefer Orduña', description: 'Pablo Schefer Orduña, PapiGEGamer on Discord: community moderation, vibe coding and digital collaboration.' },
      communities: { title: 'Communities — Pablo Schefer Orduña', description: 'Pablo Schefer’s moderation experience across technology, gaming and creator communities, including FNLB, Nate Gentile, Edgar Pons and Thiago Community.' },
      edgar: { title: 'Edgar Pons Community — Discord Status', description: 'A near-real-time public panel for the Edgar Pons Discord community and Pablo Schefer’s moderation work.' },
      gamesGear: { title: 'Games & gear — Pablo Schefer', description: 'Current games, computer components and live CPU, GPU, memory, storage and network usage.' },
      music: { title: 'Music & Spotify — Pablo Schefer', description: 'Pablo Schefer’s music monitor, ready to show public Spotify playback through his Discord presence.' },
      anime: { title: 'Live Anime — Pablo Schefer', description: 'Local history and real-time monitor for public anime activities detected through Lanyard and Discord.' },
      notFound: { title: 'Page not found — Pablo Schefer', description: 'The requested page does not exist.' },
    },
    home: {
      availability: 'Building across community, code and product',
      eyebrow: 'Discord · Vibe coding · Collaboration',
      heroTitle: ['Communities', 'with energy.', 'Code', 'with intent.'],
      heroIntro: 'I am Pablo Schefer — PapiGEGamer on Discord. I moderate tech communities and turn ideas into digital products through AI-assisted development.',
      primaryCta: 'Explore communities',
      secondaryCta: 'View my profile',
      orbitLabel: 'Community / Product / Code',
      scroll: 'Scroll to explore',
      expertiseEyebrow: '01 — Areas',
      expertiseTitle: 'Discord, product and code.',
      expertiseIntro: 'I work across online communities and web development: moderating, organising and building tools for real needs.',
      capabilities: [
        { index: '01', title: 'Discord & moderation', text: 'I help communities stay clear, safe and active through moderation, coordination, documentation and daily operations.', tags: ['Discord', 'Moderation', 'Operations', 'Community'] },
        { index: '02', title: 'Vibe coding & product', text: 'I build websites and tools with React and TypeScript, using AI for speed without giving up technical control.', tags: ['React', 'TypeScript', 'Applied AI', 'Prototyping'] },
        { index: '03', title: 'Open collaboration', text: 'At FNLB and KernelOS I work across product, support and community so ideas reach real users.', tags: ['FNLB', 'KernelOS', 'GitHub', 'Iteration'] },
      ],
      communityEyebrow: '02 — Communities',
      communityTitle: 'Moderation with context, scale and empathy.',
      communityIntro: 'I currently moderate FNLB, Nate Gentile, Edgar Pons and Thiago Community. My path also includes GW2 / Gatitos 2, VALORANT ESP and more communities.',
      communityCta: 'View full experience',
      proofEyebrow: '03 — Projects & ecosystems',
      proofTitle: 'Where I contribute. What I help build.',
      proofIntro: 'Two projects I contribute to and part of the community work that shaped my path.',
      proof: [
        { type: 'Product · Community', metric: '60K', title: 'FNLB', text: 'I collaborate within the FNLB ecosystem, a Fortnite lobby-bot platform where product, support and community evolve together.', link: '/proyectos/fnlb', linkLabel: 'Discover FNLB', image: communityAssets.fnlbCoverStatic, imageAlt: 'Blue FNLB visual identity', internal: true },
        { type: 'Project · Community', metric: '50K+', title: 'KernelOS', text: 'I collaborate within the KernelOS ecosystem: a Custom OS for gaming, low latency and a Discord community. Its historic server passed 1,500,000 members; after it closed, the new one has more than 50,000.', link: '/proyectos/kernelos', linkLabel: 'View KernelOS', image: '/media/projects/kernelos-cover.webp', imageAlt: 'Dark KernelOS background with an oni mask', internal: true },
        { type: 'Discord · Operations', metric: '07+', title: 'Community network', text: 'Seven featured public experiences plus other current and previous roles across gaming, technology and creators.', link: '/comunidades', linkLabel: 'Explore communities', image: communityAssets.edgarPonsCover, imageAlt: 'Edgar Pons community visual identity', internal: true },
      ],
      bridgeLead: 'What connects it all:',
      bridgeText: 'people, technology and the drive to make things work.',
      methodEyebrow: '04 — Day to day',
      methodTitle: 'What I bring to a team.',
      methodIntro: 'Beyond the title, my work shows in communication, organisation and the ability to solve.',
      method: [
        { index: '01', title: 'Be present', text: 'Know the community rhythm and spot problems before they grow.' },
        { index: '02', title: 'Keep order', text: 'Apply clear criteria and help the team respond consistently.' },
        { index: '03', title: 'Build', text: 'Turn a concrete need into a useful tool or web experience.' },
        { index: '04', title: 'Follow through', text: 'Track open issues, communicate progress and close tasks properly.' },
      ],
    },
    profile: {
      eyebrow: 'Profile — PapiGEGamer',
      title: 'Community first. Technical curiosity. Consistent delivery.',
      lede: 'I have been on Discord since 2015. It is where I learned to coordinate people, care for communities and turn everyday problems into solutions.',
      body: [
        'I am Pablo Schefer Orduña. My digital path began on Discord, where I currently moderate FNLB, Nate Gentile, Edgar Pons and Thiago Community.',
        'I have also moderated GW2—known as Gatitos 2—VALORANT ESP and more communities. These seven cards are public highlights, not the limit of my experience.',
        'I also build through vibe coding with React and TypeScript. It is the technical side of a profile that always starts by understanding the people who will use what I make.',
      ],
      portraitLabel: 'Pablo / PapiGEGamer',
      profileLoopLabel: 'Community in the loop',
      presence: 'Online',
      discordIdentity: { label: 'Discord profile', name: 'PapiGEGamer 🐾', handle: '@papigegamerantiguo', meta: 'Moderation · Technology · Vibe coding', action: 'Open profile' },
      location: 'Spain · On Discord since 2015',
      stats: [
        { value: '04+', label: 'communities moderated today' },
        { value: '02+', label: 'highlighted previous roles' },
        { value: '2015', label: 'start on Discord' },
      ],
      rolesEyebrow: 'Experience',
      rolesTitle: 'Communities that shaped my path.',
      rolesIntro: 'Seven featured public roles within a path that includes other current and previous servers.',
    },
    communities: {
      eyebrow: 'Communities — Discord',
      title: 'Behind every number are people, context and trust.',
      intro: 'These seven cards are public highlights; I also moderate and have moderated other technology, gaming and creator servers. The goal remains to help conversations flow without losing identity.',
      roleLabel: 'Role',
      viewCommunity: 'Open community',
      viewLivePage: 'View live page',
      cards: {
        fnlb: { role: 'Current moderator', text: 'Moderation and collaboration in an ecosystem connecting Fortnite lobby bots, support, product and a community of nearly 60,000 members.' },
        nate: { role: 'Current moderator', text: 'Moderation in Nate Gentile’s community, a space focused on technology, hardware and education.' },
        edgar: { role: 'Current moderator', text: 'Moderation in the Edgar Pons community, with its own page and a panel powered by Discord’s public widget.' },
        tiago: { role: 'Current moderator', text: 'Moderation in Thiago Community, the Discord server linked to creator ThiagoIUTU.' },
        kernelos: { role: 'Contributor · Community', text: 'KernelOS combines a Custom OS and a Discord community. Its historic server passed 1,500,000 members; after it closed, the new server has more than 50,000 users.' },
        gw2: { role: 'Previous moderator', text: 'Previous moderation work in GW2, known as Gatitos 2: a social and gaming community with more than 103,000 members.' },
        valorant: { role: 'Previous moderator', text: 'Previous experience in one of the large Spanish-speaking communities dedicated to VALORANT.' },
      },
      note: 'A selection of seven public experiences, not every server. Roles reflect information provided by Pablo and counts are approximate.',
      philosophyEyebrow: 'How I moderate',
      philosophyTitle: 'Visible presence. Calm judgement. Clear systems.',
      philosophyBody: 'Good moderation is not only reactive. It combines listening, consistency, documentation and coordination to prevent problems and support a healthy culture.',
      principles: [
        { index: '01', title: 'Listen', text: 'Understand context first and separate isolated incidents from meaningful patterns.' },
        { index: '02', title: 'Decide', text: 'Apply coherent, proportionate criteria the community can understand.' },
        { index: '03', title: 'Document', text: 'Leave clear processes so the team can respond with continuity.' },
      ],
    },
    edgar: {
      eyebrow: 'Featured community — Edgar Pons',
      title: 'A living window into the community.',
      intro: 'A dedicated page for my work as a moderator and the public activity Discord allows us to query safely.',
      roleLabel: 'My role',
      role: 'Current moderator',
      liveEyebrow: 'Discord · Automatic monitor',
      liveTitle: 'Public activity now.',
      liveIntro: 'Visible members, activity and voice channels in a panel that refreshes while you browse.',
      membersLabel: 'Members, approx.',
      onlineLabel: 'Online, approx.',
      voiceLabel: 'In voice',
      visibleVoiceLabel: 'publicly visible',
      voiceAvailable: 'Public voice activity available',
      voiceUnavailable: 'Public voice activity is not available.',
      emptyVoice: 'No participants are publicly visible in voice channels right now.',
      loading: 'Connecting to Discord’s public widget…',
      error: 'The panel could not be refreshed right now.',
      retry: 'Try again',
      updated: 'Updated',
      join: 'Join Discord',
      publicData: 'Public data · No bot or private token',
      aboutEyebrow: 'The integration',
      aboutTitle: 'Edgar Pons Live.',
      aboutBody: 'A direct view of the public side of the server and my work inside the community.',
      sourceNote: 'Discord limits the widget to channels visible to @everyone and up to 100 public members. “In voice” therefore represents visible people, not a complete server census.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Send me a direct note.',
      body: 'Leave your email and message. It lands straight in my inbox so I can reply from there.',
      cta: 'Open Discord',
      nameLabel: 'Name',
      namePlaceholder: 'Your name or handle',
      emailLabel: 'Your email',
      emailPlaceholder: 'you@email.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me what you want to ask, propose or build.',
      submit: 'Send message',
      sending: 'Sending',
      success: 'Message sent. It will land straight in my inbox.',
      error: 'The message could not be sent right now. Try again in a few seconds.',
    },
    footer: 'Pablo Schefer · Discord, communities and web development.',
    notFound: { eyebrow: '404 — Off route', title: 'This page does not exist.', body: 'The navigation is still alive—you have simply reached a route that is not part of the map yet.', cta: 'Back home' },
  },
}
