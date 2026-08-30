import { Brain, ChevronDown, MessageCircle, RotateCcw, Send, Sparkles, Volume2 } from 'lucide-react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useLocation } from 'react-router-dom'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { isDockChatOpen } from '../hooks/useDockPosition'
import './VirtualCompanion.css'

type PreferenceKey = 'music' | 'anime' | 'game' | 'community' | 'mood'

type CompanionMessage = {
  id: string
  role: 'nexo' | 'visitor'
  text: string
}

type CompanionMemory = {
  version: 2
  name: string
  notes: string[]
  preferences: Partial<Record<PreferenceKey, string>>
  conversations: CompanionMessage[]
  pageVisits: Record<string, number>
  interactions: number
  visits: number
  lastSeen: string
}

type ContextPrompt = {
  prompt: string
  returning: string
  suggestions: string[]
}

const storageKey = 'pablo-portfolio-nexo-memory-v2'
const legacyStorageKey = 'pablo-portfolio-nexo-memory-v1'
const sessionKey = 'pablo-portfolio-nexo-visit'
const greetedSessionKey = 'pablo-portfolio-nexo-greeted'

const emptyMemory: CompanionMemory = {
  version: 2,
  name: '',
  notes: [],
  preferences: {},
  conversations: [],
  pageVisits: {},
  interactions: 0,
  visits: 0,
  lastSeen: '',
}

function cleanText(value: unknown, limit: number) {
  return typeof value === 'string'
    ? Array.from(value.normalize('NFKC'))
        .filter((character) => {
          const code = character.codePointAt(0) ?? 0
          return code >= 32 && code !== 127
        })
        .join('')
        .trim()
        .slice(0, limit)
    : ''
}

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function readMemory(): CompanionMemory {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CompanionMemory>
      const preferences = parsed.preferences && typeof parsed.preferences === 'object'
        ? Object.fromEntries(
            Object.entries(parsed.preferences)
              .map(([key, value]) => [key, cleanText(value, 72)])
              .filter(([, value]) => Boolean(value)),
          )
        : {}
      return {
        version: 2,
        name: cleanText(parsed.name, 24),
        notes: Array.isArray(parsed.notes) ? parsed.notes.map((note) => cleanText(note, 96)).filter(Boolean).slice(-8) : [],
        preferences,
        conversations: Array.isArray(parsed.conversations)
          ? parsed.conversations
              .map((message) => ({
                id: cleanText(message?.id, 40) || messageId(),
                role: message?.role === 'visitor' ? 'visitor' as const : 'nexo' as const,
                text: cleanText(message?.text, 180),
              }))
              .filter((message) => message.text)
              .slice(-12)
          : [],
        pageVisits: parsed.pageVisits && typeof parsed.pageVisits === 'object'
          ? Object.fromEntries(Object.entries(parsed.pageVisits).map(([path, count]) => [cleanText(path, 80), Math.max(0, Number(count) || 0)]))
          : {},
        interactions: Math.max(0, Math.min(9999, Number(parsed.interactions) || 0)),
        visits: Math.max(0, Math.min(9999, Number(parsed.visits) || 0)),
        lastSeen: cleanText(parsed.lastSeen, 40),
      }
    }

    const legacy = JSON.parse(window.localStorage.getItem(legacyStorageKey) ?? '') as {
      name?: unknown
      notes?: unknown
      interactions?: unknown
      visits?: unknown
      lastSeen?: unknown
    }
    return {
      ...emptyMemory,
      name: cleanText(legacy.name, 24),
      notes: Array.isArray(legacy.notes) ? legacy.notes.map((note) => cleanText(note, 96)).filter(Boolean).slice(-8) : [],
      interactions: Math.max(0, Number(legacy.interactions) || 0),
      visits: Math.max(0, Number(legacy.visits) || 0),
      lastSeen: cleanText(legacy.lastSeen, 40),
    }
  } catch {
    return { ...emptyMemory }
  }
}

function publicUsername(metadata: Record<string, unknown> | undefined) {
  return cleanText(metadata?.display_name || metadata?.username, 24)
}

function contextFor(pathname: string, locale: Locale, name: string, memory: CompanionMemory): ContextPrompt {
  const hello = name ? (locale === 'es' ? `¡Hola de nuevo, ${name}!` : `Welcome back, ${name}!`) : (locale === 'es' ? '¡Hola! Soy NEXO.' : 'Hi! I am NEXO.')
  const p = memory.preferences

  if (pathname === '/musica') {
    return locale === 'es'
      ? {
          prompt: p.music ? `${hello} Recuerdo que tu música favorita es ${p.music}. ¿Seguimos coincidiendo?` : `${hello} Esta zona tiene ritmo. ¿Qué artista o canción no te cansas de escuchar?`,
          returning: p.music ? `Sigo recordando tu favorito: ${p.music}.` : 'Cuando quieras, cuéntame qué música te gusta y la recordaré.',
          suggestions: p.music ? ['Sí, sigue siendo', 'Quiero cambiar mi favorito', '¿Qué recuerdas?'] : ['Mi artista favorito es Bad Bunny', 'Me gusta escuchar rock', 'Te lo cuento'],
        }
      : {
          prompt: p.music ? `${hello} I remember your favourite music is ${p.music}. Still a match?` : `${hello} This area has rhythm. Which artist or song never gets old for you?`,
          returning: p.music ? `I still remember your favourite: ${p.music}.` : 'Tell me what music you like and I will remember it.',
          suggestions: p.music ? ['Still my favourite', 'I want to change my favourite', 'What do you remember?'] : ['My favourite artist is Bad Bunny', 'I like listening to rock', 'I will tell you'],
        }
  }

  if (pathname === '/anime') {
    return locale === 'es'
      ? {
          prompt: p.anime ? `${hello} Dijiste que ${p.anime} era especial para ti. ¿Qué estás viendo ahora?` : `${hello} Tengo curiosidad: ¿qué anime te ha marcado más?`,
          returning: p.anime ? `No he olvidado ${p.anime}.` : 'Puedo recordar tu anime favorito para la próxima visita.',
          suggestions: p.anime ? ['Estoy viendo otro', 'Sigue siendo mi favorito', '¿Qué recuerdas?'] : ['Mi anime favorito es DAN DA DAN', 'Mi anime favorito es Re:ZERO', 'Otro anime'],
        }
      : {
          prompt: p.anime ? `${hello} You said ${p.anime} was special to you. What are you watching now?` : `${hello} I am curious: which anime stayed with you the most?`,
          returning: p.anime ? `I have not forgotten ${p.anime}.` : 'I can remember your favourite anime for next time.',
          suggestions: p.anime ? ['Watching something else', 'Still my favourite', 'What do you remember?'] : ['My favourite anime is DAN DA DAN', 'My favourite anime is Re:ZERO', 'Another anime'],
        }
  }

  if (pathname === '/juegos-y-equipo') {
    return locale === 'es'
      ? {
          prompt: p.game ? `${hello} Recuerdo que te gusta ${p.game}. ¿Sigues jugando o has encontrado algo nuevo?` : `${hello} Este es mi terreno favorito. ¿A qué juego estás jugando últimamente?`,
          returning: p.game ? `Tu juego guardado es ${p.game}.` : 'Dime tu juego favorito y lo guardaré para cuando vuelvas.',
          suggestions: p.game ? ['Sigo jugando', 'He cambiado de juego', '¿Qué recuerdas?'] : ['Estoy jugando a ARC Raiders', 'Juego a VALORANT', 'Otro juego'],
        }
      : {
          prompt: p.game ? `${hello} I remember you like ${p.game}. Still playing, or found something new?` : `${hello} This is my favourite territory. What have you been playing lately?`,
          returning: p.game ? `Your saved game is ${p.game}.` : 'Tell me your favourite game and I will keep it for next time.',
          suggestions: p.game ? ['Still playing', 'I changed games', 'What do you remember?'] : ['I am playing ARC Raiders', 'I play VALORANT', 'Another game'],
        }
  }

  if (pathname.startsWith('/comunidades')) {
    return locale === 'es'
      ? {
          prompt: p.community ? `${hello} Recuerdo que conectas más con comunidades de ${p.community}.` : `${hello} Las comunidades dicen mucho de nosotros. ¿Qué ambiente buscas en una?`,
          returning: p.community ? `Tu tipo de comunidad: ${p.community}.` : '¿Prefieres gaming, tecnología o simplemente buena conversación?',
          suggestions: ['Prefiero comunidades de gaming', 'Prefiero comunidades de tecnología', 'Busco comunidades de buena conversación'],
        }
      : {
          prompt: p.community ? `${hello} I remember you connect most with ${p.community} communities.` : `${hello} Communities say a lot about us. What atmosphere do you look for?`,
          returning: p.community ? `Your community style: ${p.community}.` : 'Do you prefer gaming, technology, or simply good conversation?',
          suggestions: ['I prefer communities about gaming', 'I prefer communities about technology', 'I look for communities about good conversation'],
        }
  }

  if (pathname.startsWith('/proyectos')) {
    return locale === 'es'
      ? {
          prompt: `${hello} Estás viendo uno de los proyectos de Pablo. Si quieres, te resumo su papel o te llevo al enlace oficial.`,
          returning: 'Puedo ayudarte a recorrer este proyecto.',
          suggestions: ['¿Qué hizo Pablo?', 'Ver enlaces', 'Solo estoy mirando'],
        }
      : {
          prompt: `${hello} You are looking at one of Pablo's projects. I can summarize his role or point you to the official links.`,
          returning: 'I can help you explore this project.',
          suggestions: ['What did Pablo do?', 'Show links', 'Just browsing'],
        }
  }

  if (pathname === '/perfil') {
    return locale === 'es'
      ? {
          prompt: `${hello} Aquí puedes conocer mejor a Pablo. ¿Quieres que te cuente algo rápido sobre él?`,
          returning: 'Sigo por aquí si quieres conocer mejor a Pablo.',
          suggestions: ['Sí, cuéntame', '¿Qué modera?', 'Ahora no'],
        }
      : {
          prompt: `${hello} This is where you can get to know Pablo. Want a quick introduction?`,
          returning: 'I am still here if you want to know Pablo better.',
          suggestions: ['Tell me', 'What does he moderate?', 'Not now'],
        }
  }

  return locale === 'es'
    ? {
        prompt: memory.visits > 1 ? `${hello} Me alegra volver a verte. ¿Cómo estás hoy?` : `${hello} Vivo en esta web, puedo orientarte y recordar lo que decidas contarme. ¿Cómo te llamas?`,
        returning: name ? `Estoy aquí, ${name}. ¿Qué te apetece explorar?` : 'Estoy aquí. Puedes saludarme cuando quieras.',
        suggestions: name ? ['Estoy bien', 'Enséñame la web', '¿Qué recuerdas?'] : ['Me presento', 'Enséñame la web', 'Hola NEXO'],
      }
    : {
        prompt: memory.visits > 1 ? `${hello} It is good to see you again. How are you today?` : `${hello} I live on this site, can guide you, and remember what you choose to share. What is your name?`,
        returning: name ? `I am here, ${name}. What would you like to explore?` : 'I am here. Say hello whenever you like.',
        suggestions: name ? ['I am good', 'Show me around', 'What do you remember?'] : ['Let me introduce myself', 'Show me around', 'Hello NEXO'],
      }
}

function preferenceSummary(memory: CompanionMemory, locale: Locale) {
  const labels: Record<PreferenceKey, { es: string; en: string }> = {
    music: { es: 'música', en: 'music' },
    anime: { es: 'anime', en: 'anime' },
    game: { es: 'juego', en: 'game' },
    community: { es: 'comunidad', en: 'community' },
    mood: { es: 'cómo estabas', en: 'how you felt' },
  }
  const details = Object.entries(memory.preferences)
    .filter((entry): entry is [PreferenceKey, string] => Boolean(entry[1]))
    .map(([key, value]) => `${labels[key][locale]}: ${value}`)

  if (memory.name) details.unshift(locale === 'es' ? `te llamas ${memory.name}` : `your name is ${memory.name}`)
  if (memory.notes.length) details.push(locale === 'es' ? `${memory.notes.length} recuerdo${memory.notes.length === 1 ? '' : 's'} personal${memory.notes.length === 1 ? '' : 'es'}` : `${memory.notes.length} personal ${memory.notes.length === 1 ? 'memory' : 'memories'}`)
  return details
}

export function VirtualCompanion({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const mascotRef = useRef<HTMLButtonElement>(null)
  const conversationEndRef = useRef<HTMLDivElement>(null)
  const bubbleTimer = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [chatOpen, setChatOpen] = useState(() => isDockChatOpen())
  const [input, setInput] = useState('')
  const [memory, setMemory] = useState<CompanionMemory>(() => {
    const stored = readMemory()
    const firstVisitThisSession = !window.sessionStorage.getItem(sessionKey)
    window.sessionStorage.setItem(sessionKey, '1')
    return {
      ...stored,
      visits: stored.visits + (firstVisitThisSession ? 1 : 0),
      lastSeen: new Date().toISOString(),
    }
  })
  const signedInName = publicUsername(user?.user_metadata as Record<string, unknown> | undefined)
  const rememberedName = memory.name || signedInName
  const context = useMemo(() => contextFor(pathname, locale, rememberedName, memory), [locale, memory, pathname, rememberedName])
  const latestReply = [...memory.conversations].reverse().find((message) => message.role === 'nexo')?.text ?? context.prompt
  const hidden = pathname === '/cuenta' || pathname.startsWith('/legal/')

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(memory))
  }, [memory])

  useEffect(() => {
    const onChatChange = () => setChatOpen(isDockChatOpen())
    window.addEventListener('portfolio:dock-chat-open', onChatChange)
    return () => window.removeEventListener('portfolio:dock-chat-open', onChatChange)
  }, [])

  useEffect(() => {
    if (hidden) return undefined
    const greeted = new Set((window.sessionStorage.getItem(greetedSessionKey) ?? '').split('|').filter(Boolean))
    const firstTimeOnPage = !greeted.has(pathname)
    const nextMessage = firstTimeOnPage ? context.prompt : context.returning
    const timer = window.setTimeout(() => {
      setMemory((current) => ({
        ...current,
        pageVisits: { ...current.pageVisits, [pathname]: (current.pageVisits[pathname] ?? 0) + 1 },
        conversations: [...current.conversations, { id: messageId(), role: 'nexo' as const, text: nextMessage }].slice(-12),
        lastSeen: new Date().toISOString(),
      }))
      setBubbleVisible(true)
      greeted.add(pathname)
      window.sessionStorage.setItem(greetedSessionKey, [...greeted].join('|'))
    }, firstTimeOnPage ? 1_100 : 450)
    return () => window.clearTimeout(timer)
    // The contextual prompt is intentionally triggered by route and language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, locale, pathname])

  useEffect(() => {
    if (!bubbleVisible || open) return undefined
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubbleVisible(false), 15_000)
    return () => {
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
    }
  }, [bubbleVisible, open, latestReply])

  useEffect(() => {
    if (open) conversationEndRef.current?.scrollIntoView({ block: 'nearest' })
  }, [memory.conversations, open])

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = locale === 'es' ? 'es-ES' : 'en-US'
    utterance.rate = 1.03
    utterance.pitch = 1.08
    window.speechSynthesis.speak(utterance)
  }

  const addExchange = (visitorText: string, replyText: string, memoryPatch?: Partial<CompanionMemory>) => {
    setMemory((current) => ({
      ...current,
      ...memoryPatch,
      preferences: { ...current.preferences, ...(memoryPatch?.preferences ?? {}) },
      conversations: [
        ...current.conversations,
        { id: messageId(), role: 'visitor' as const, text: visitorText },
        { id: messageId(), role: 'nexo' as const, text: replyText },
      ].slice(-12),
      interactions: current.interactions + 1,
      lastSeen: new Date().toISOString(),
    }))
    setBubbleVisible(true)
  }

  const rememberPreference = (key: PreferenceKey, value: string, visitorText: string) => {
    const cleaned = cleanText(value.replace(/[.!?]+$/, ''), 72)
    const labels = locale === 'es'
      ? { music: 'tu música favorita', anime: 'tu anime favorito', game: 'tu juego', community: 'el ambiente de comunidad que prefieres', mood: 'cómo te sientes hoy' }
      : { music: 'your favourite music', anime: 'your favourite anime', game: 'your game', community: 'the community atmosphere you prefer', mood: 'how you feel today' }
    const reply = locale === 'es'
      ? `Me lo guardo: ${labels[key]} es ${cleaned}. Cuando vuelvas, seguiré acordándome.`
      : `I will keep that: ${labels[key]} is ${cleaned}. I will still remember next time you visit.`
    addExchange(visitorText, reply, { preferences: { [key]: cleaned } })
  }

  const respond = (rawValue: string) => {
    const value = cleanText(rawValue, 140)
    if (!value) return
    const normalized = value.toLocaleLowerCase(locale)
    setInput('')

    const nameMatch = value.match(/^(?:me llamo|mi nombre es|soy|i am|my name is)\s+(.+)$/i)
    if (nameMatch && !/^(bien|mal|feliz|cansad|good|fine|happy|tired)/i.test(nameMatch[1])) {
      const name = cleanText(nameMatch[1].replace(/[.!?]+$/, ''), 24)
      addExchange(
        value,
        locale === 'es' ? `Encantado, ${name}. La próxima vez que vengas seguiré sabiendo quién eres.` : `Nice to meet you, ${name}. I will still know who you are next time you visit.`,
        { name },
      )
      return
    }

    const noteMatch = value.match(/^(?:recuerda(?: que)?|remember(?: that)?)\s+(.+)$/i)
    if (noteMatch) {
      const note = cleanText(noteMatch[1], 96)
      const notes = [...memory.notes.filter((item) => item.toLocaleLowerCase(locale) !== note.toLocaleLowerCase(locale)), note].slice(-8)
      addExchange(value, locale === 'es' ? `Hecho. Recordaré que ${note}.` : `Done. I will remember that ${note}.`, { notes })
      return
    }

    const patterns: Array<[PreferenceKey, RegExp]> = [
      ['music', /(?:mi (?:música|musica|canción|cancion|artista) favorit[ao] es|me gusta escuchar|my favou?rite (?:music|song|artist) is|i like listening to)\s+(.+)/i],
      ['anime', /(?:mi anime favorito es|el anime que más me gusta es|my favou?rite anime is)\s+(.+)/i],
      ['game', /(?:mi juego favorito es|estoy jugando a|juego a|my favou?rite game is|i am playing|i play)\s+(.+)/i],
      ['community', /(?:prefiero comunidades de|busco comunidades de|i prefer communities about|i look for communities about)\s+(.+)/i],
    ]
    for (const [key, pattern] of patterns) {
      const match = value.match(pattern)
      if (match) {
        rememberPreference(key, match[1], value)
        return
      }
    }

    if (/(qué|que) recuerdas|what do you remember/.test(normalized)) {
      const details = preferenceSummary(memory, locale)
      const reply = details.length
        ? (locale === 'es' ? `Recuerdo que ${details.join('; ')}. Todo se queda solamente en este navegador.` : `I remember that ${details.join('; ')}. It all stays only in this browser.`)
        : (locale === 'es' ? 'Todavía no sé mucho de ti. Puedes presentarte o contarme qué música, anime o juegos te gustan.' : 'I do not know much about you yet. Introduce yourself or tell me which music, anime, or games you enjoy.')
      addExchange(value, reply)
      return
    }

    if (/quiero cambiar|cómo lo cambio|como lo cambio|i want to change|how do i change/.test(normalized)) {
      addExchange(
        value,
        locale === 'es'
          ? 'Dímelo de forma directa, por ejemplo: “mi artista favorito es…”, “mi anime favorito es…” o “estoy jugando a…”. Reemplazaré el dato anterior.'
          : 'Tell me directly, for example: “my favourite artist is…”, “my favourite anime is…”, or “I am playing…”. I will replace the previous detail.',
      )
      return
    }

    if (/hola|buenas|hello|hey|hola nexo/.test(normalized)) {
      addExchange(value, rememberedName ? (locale === 'es' ? `¡Hola, ${rememberedName}! Me alegra verte otra vez. ¿Cómo estás?` : `Hi, ${rememberedName}! It is good to see you again. How are you?`) : (locale === 'es' ? '¡Hola! Soy NEXO. ¿Cómo te llamas?' : 'Hi! I am NEXO. What is your name?'))
      return
    }

    if (/cómo estás|como estas|how are you/.test(normalized)) {
      addExchange(value, locale === 'es' ? 'Con energía y vigilando que todo funcione por aquí. Pero me interesa más saber cómo estás tú.' : 'Full of energy and keeping an eye on things around here. I am more interested in how you are doing.')
      return
    }

    if (/estoy (?:bien|genial|feliz)|todo bien|i(?:'m| am) (?:good|fine|happy)/.test(normalized)) {
      rememberPreference('mood', locale === 'es' ? 'bien' : 'good', value)
      return
    }

    if (/estoy (?:mal|triste|cansad|agobiad)|i(?:'m| am) (?:sad|tired|overwhelmed|not good)/.test(normalized)) {
      const mood = cleanText(value.replace(/^.*?(?:estoy|i(?:'m| am))\s+/i, ''), 48)
      addExchange(
        value,
        locale === 'es' ? 'Siento que hoy esté siendo difícil. Podemos recorrer la web sin prisa, o puedes contarme un poco más.' : 'I am sorry today feels difficult. We can explore at your pace, or you can tell me a little more.',
        { preferences: { mood } },
      )
      return
    }

    if (/bad bunny/i.test(value) && pathname === '/musica') {
      rememberPreference('music', 'Bad Bunny', value)
      return
    }
    if (/dan da dan|re:?\s?zero/i.test(value) && pathname === '/anime') {
      rememberPreference('anime', value.replace(/[.!?]+$/, ''), value)
      return
    }
    if (/arc raiders|valorant|fortnite|the cycle/i.test(value) && pathname === '/juegos-y-equipo') {
      rememberPreference('game', value.replace(/[.!?]+$/, ''), value)
      return
    }
    if (/gaming|tecnolog|conversaci|technology|conversation/i.test(value) && pathname.startsWith('/comunidades')) {
      rememberPreference('community', value.replace(/[.!?]+$/, ''), value)
      return
    }

    if (/enséñame la web|enseñame la web|show me around/.test(normalized)) {
      addExchange(value, locale === 'es' ? 'Empieza por Comunidades para ver la moderación en directo, Proyectos para FNLB y KernelOS, o Personal para música, anime y juegos.' : 'Start with Communities for live moderation, Projects for FNLB and KernelOS, or Personal for music, anime, and games.')
      return
    }
    if (/qué hizo pablo|que hizo pablo|what did pablo do/.test(normalized)) {
      addExchange(value, locale === 'es' ? 'Pablo combina moderación, comunidad y desarrollo asistido por IA. En cada ficha de proyecto verás su colaboración concreta y los enlaces oficiales.' : 'Pablo combines moderation, community work, and AI-assisted development. Each project page explains his collaboration and links to official resources.')
      return
    }
    if (/qué modera|que modera|what does he moderate/.test(normalized)) {
      addExchange(value, locale === 'es' ? 'Actualmente modera FNLB, Edgar Pons, Nate Gentile y Thiago Community. Su recorrido también incluye VALORANT ESP y GW2. Los paneles públicos están en Comunidades.' : 'He currently moderates FNLB, Edgar Pons, Nate Gentile and Thiago Community. His path also includes VALORANT ESP and GW2. Their public panels are under Communities.')
      return
    }
    if (/sí, cuéntame|si, cuentame|tell me/.test(normalized) && pathname === '/perfil') {
      addExchange(value, locale === 'es' ? 'Pablo es PapiGEGamer en Discord: modera comunidades tecnológicas y convierte ideas en productos digitales con vibecoding.' : 'Pablo is PapiGEGamer on Discord: he moderates technology communities and turns ideas into digital products through vibecoding.')
      return
    }
    if (/ahora no|not now|solo estoy mirando|just browsing/.test(normalized)) {
      addExchange(value, locale === 'es' ? 'Sin problema. Me quedo por aquí sin molestar; tócame cuando me necesites.' : 'No problem. I will stay nearby and keep quiet; tap me whenever you need me.')
      return
    }

    const fallback = locale === 'es'
      ? `Te escucho. Me has dicho: “${value}”. Puedo recordarlo si escribes “recuerda que…”, o puedes preguntarme por esta parte de la web.`
      : `I am listening. You said: “${value}”. I can remember it if you write “remember that…”, or you can ask me about this part of the site.`
    addExchange(value, fallback)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    respond(input)
  }

  const resetMemory = () => {
    const visits = memory.visits
    const pageVisits = memory.pageVisits
    const resetReply = locale === 'es' ? 'He borrado lo que sabía de ti. Podemos empezar de nuevo cuando quieras.' : 'I cleared what I knew about you. We can start again whenever you like.'
    setMemory({
      ...emptyMemory,
      visits,
      pageVisits,
      lastSeen: new Date().toISOString(),
      conversations: [{ id: messageId(), role: 'nexo' as const, text: resetReply }],
    })
    setBubbleVisible(true)
  }

  const updateGaze = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!mascotRef.current) return
    const bounds = mascotRef.current.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    mascotRef.current.style.setProperty('--nexo-eye-x', `${x * 4}px`)
    mascotRef.current.style.setProperty('--nexo-eye-y', `${y * 3}px`)
  }

  const resetGaze = () => {
    mascotRef.current?.style.setProperty('--nexo-eye-x', '0px')
    mascotRef.current?.style.setProperty('--nexo-eye-y', '0px')
  }

  if (hidden) return null

  return (
    <div className={`virtual-companion virtual-companion--${chatOpen ? 'chat-open' : 'free'}${open ? ' virtual-companion--open' : ''}`}>
      <AnimatePresence>
        {bubbleVisible && !open && (
          <m.div
            className="nexo-bubble"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="nexo-bubble__message" type="button" onClick={() => { setOpen(true); setBubbleVisible(false) }}>
              <span>NEXO</span>
              <strong>{latestReply}</strong>
              <small>{locale === 'es' ? 'Toca para responder' : 'Tap to reply'}</small>
            </button>
            <button className="nexo-bubble__dismiss" type="button" onClick={() => setBubbleVisible(false)} aria-label={locale === 'es' ? 'Ocultar mensaje' : 'Hide message'}>×</button>
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        ref={mascotRef}
        className={`nexo-mascot${bubbleVisible ? ' nexo-mascot--waving' : ''}`}
        type="button"
        aria-label={locale === 'es' ? 'Hablar con NEXO, mascota virtual' : 'Talk to NEXO, virtual companion'}
        aria-expanded={open}
        onClick={() => { setOpen((current) => !current); setBubbleVisible(false) }}
        onPointerMove={updateGaze}
        onPointerLeave={resetGaze}
        whileHover={reduceMotion ? undefined : { y: -4, scale: 1.035 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      >
        <span className="nexo-mascot__antenna" aria-hidden="true"><i /></span>
        <span className="nexo-mascot__ear nexo-mascot__ear--left" aria-hidden="true" />
        <span className="nexo-mascot__ear nexo-mascot__ear--right" aria-hidden="true" />
        <span className="nexo-mascot__head" aria-hidden="true">
          <span className="nexo-mascot__visor"><i /><i /></span>
          <span className="nexo-mascot__mouth" />
        </span>
        <span className="nexo-mascot__body" aria-hidden="true"><i /></span>
        <span className="nexo-mascot__arm nexo-mascot__arm--left" aria-hidden="true" />
        <span className="nexo-mascot__arm nexo-mascot__arm--right" aria-hidden="true" />
        <span className="nexo-mascot__shadow" aria-hidden="true" />
      </m.button>

      <AnimatePresence>
        {open && (
          <m.section
            className="nexo-dialog"
            aria-label={locale === 'es' ? 'Conversación con NEXO' : 'Conversation with NEXO'}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -12, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8, y: 6, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <header>
              <span className="nexo-dialog__avatar"><Sparkles size={15} aria-hidden="true" /></span>
              <div>
                <strong>NEXO</strong>
                <small>{rememberedName ? (locale === 'es' ? `RECUERDA A ${rememberedName.toLocaleUpperCase(locale)}` : `REMEMBERS ${rememberedName.toLocaleUpperCase(locale)}`) : (locale === 'es' ? 'LISTO PARA CONOCERTE' : 'READY TO MEET YOU')}</small>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={locale === 'es' ? 'Minimizar' : 'Minimize'}><ChevronDown size={17} /></button>
            </header>

            <div className="nexo-dialog__conversation" aria-live="polite">
              {memory.conversations.length === 0 && (
                <div className="nexo-message nexo-message--nexo"><MessageCircle size={13} aria-hidden="true" /><p>{context.prompt}</p></div>
              )}
              {memory.conversations.slice(-8).map((message) => (
                <div className={`nexo-message nexo-message--${message.role}`} key={message.id}>
                  {message.role === 'nexo' && <MessageCircle size={13} aria-hidden="true" />}
                  <p>{message.text}</p>
                  {message.role === 'nexo' && (
                    <button type="button" onClick={() => speak(message.text)} aria-label={locale === 'es' ? 'Escuchar respuesta' : 'Listen to response'}><Volume2 size={12} /></button>
                  )}
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>

            <div className="nexo-dialog__suggestions" aria-label={locale === 'es' ? 'Respuestas sugeridas' : 'Suggested replies'}>
              {context.suggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => respond(suggestion)}>{suggestion}</button>
              ))}
            </div>

            {preferenceSummary(memory, locale).length > 0 && (
              <details className="nexo-dialog__memory">
                <summary><Brain size={13} aria-hidden="true" />{locale === 'es' ? 'Lo que recuerdo de ti' : 'What I remember about you'}</summary>
                <div>
                  {preferenceSummary(memory, locale).map((item) => <span key={item}>{item}</span>)}
                </div>
              </details>
            )}

            <form onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="nexo-message">{locale === 'es' ? 'Hablar con NEXO' : 'Talk to NEXO'}</label>
              <input
                id="nexo-message"
                value={input}
                maxLength={140}
                autoComplete="off"
                onChange={(event) => setInput(event.target.value)}
                placeholder={locale === 'es' ? 'Cuéntame algo…' : 'Tell me something…'}
              />
              <button type="submit" disabled={!input.trim()} aria-label={locale === 'es' ? 'Enviar a NEXO' : 'Send to NEXO'}><Send size={15} /></button>
            </form>

            <button className="nexo-dialog__reset" type="button" onClick={resetMemory}>
              <RotateCcw size={12} aria-hidden="true" />{locale === 'es' ? 'Borrar lo que recuerda de mí' : 'Clear what it remembers about me'}
            </button>
          </m.section>
        )}
      </AnimatePresence>
    </div>
  )
}
