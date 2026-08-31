"use client"

import Link from "next/link"
import { ArrowUpRight, Bot, Code2, Compass, FileText, Globe2, Layers3, Users } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import type { MouseEvent, ReactNode } from "react"
import { useLanguage } from "@/components/language-provider"

const content = {
  es: {
    eyebrow: "PapiGECode · perfil abierto", title: "Código con contexto.", accent: "Comunidades con propósito.",
    lead: "Soy Pablo Schefer Orduña. Construyo herramientas, cuido comunidades y convierto ideas digitales en experiencias que se pueden usar.", portraitLabel: "Pablo Schefer Orduña", portraitMeta: "PapiGECode / Madrid", status: "perfil público", github: "Ver GitHub", projects: "Explorar proyectos",
    aboutEyebrow: "01 — Introducción", aboutTitle: "Una trayectoria que empieza por las personas.",
    about: ["Llevo en Discord desde 2015. Allí aprendí a coordinar personas, cuidar comunidades y convertir problemas cotidianos en soluciones claras.", "Actualmente modero FNLB, Nate Gentile, Edgar Pons y Thiago Community. También he participado en GW2 / Gatitos 2, VALORANT ESP y otros espacios de tecnología, gaming y creadores.", "En paralelo, desarrollo mediante vibecoding con React y TypeScript. La tecnología es la herramienta; entender a quien la va a utilizar es el punto de partida."],
    focusEyebrow: "02 — Cómo trabajo", focusTitle: "Curiosidad técnica. Entrega constante.",
    focus: [{ icon: Users, title: "Comunidad", text: "Moderación, coordinación y operaciones con contexto." }, { icon: Code2, title: "Producto", text: "Webs y herramientas pensadas para personas reales." }, { icon: Bot, title: "Vibecoding", text: "React, TypeScript e IA aplicada sin perder el control." }, { icon: Compass, title: "Exploración", text: "Experimentos que convierten preguntas en prototipos." }],
    networkEyebrow: "03 — Red de comunidades", networkTitle: "Siete experiencias públicas. Un mismo hilo.", networkText: "Comunidades, producto y código se encuentran en la forma en la que trabajo.", communities: ["FNLB", "Nate Gentile", "Edgar Pons", "Thiago Community", "KernelOS", "GW2 / Gatitos 2", "VALORANT ESP"], note: "Este perfil reúne una selección de mi recorrido digital y de los proyectos que sigo construyendo.",
  },
  en: {
    eyebrow: "PapiGECode · open profile", title: "Code with context.", accent: "Communities with purpose.",
    lead: "I’m Pablo Schefer Orduña. I build tools, care for communities and turn digital ideas into experiences people can use.", portraitLabel: "Pablo Schefer Orduña", portraitMeta: "PapiGECode / Madrid", status: "public profile", github: "View GitHub", projects: "Explore projects",
    aboutEyebrow: "01 — Introduction", aboutTitle: "A path that starts with people.",
    about: ["I have been on Discord since 2015. It taught me how to coordinate people, care for communities and turn everyday problems into clear solutions.", "I currently moderate FNLB, Nate Gentile, Edgar Pons and Thiago Community. I have also worked with GW2 / Gatitos 2, VALORANT ESP and other technology, gaming and creator spaces.", "Alongside that, I build through vibe coding with React and TypeScript. Technology is the tool; understanding the people who will use it comes first."],
    focusEyebrow: "02 — How I work", focusTitle: "Technical curiosity. Consistent delivery.",
    focus: [{ icon: Users, title: "Community", text: "Moderation, coordination and operations with context." }, { icon: Code2, title: "Product", text: "Websites and tools designed for real people." }, { icon: Bot, title: "Vibe coding", text: "React, TypeScript and applied AI with technical control." }, { icon: Compass, title: "Exploration", text: "Experiments that turn questions into prototypes." }],
    networkEyebrow: "03 — Community network", networkTitle: "Seven public experiences. One connecting thread.", networkText: "Community, product and code meet in the way I work.", communities: ["FNLB", "Nate Gentile", "Edgar Pons", "Thiago Community", "KernelOS", "GW2 / Gatitos 2", "VALORANT ESP"], note: "This profile is a selection of my digital path and the projects I keep building.",
  },
} as const

function TiltPortrait({ children }: { children: ReactNode }) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const smoothX = useSpring(rotateX, { stiffness: 150, damping: 22 })
  const smoothY = useSpring(rotateY, { stiffness: 150, damping: 22 })
  const shineX = useTransform(smoothY, [-6, 6], [35, 65])
  const shine = useTransform(shineX, value => `linear-gradient(110deg, transparent ${value - 18}%, rgba(120,245,255,.2) ${value}%, transparent ${value + 18}%)`)

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 8)
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 8)
  }

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto"
      style={{ rotateX: smoothX, rotateY: smoothY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      animate={{ y: [0, -7, 0], rotateZ: [0, 0.7, -0.7, 0] }}
      transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity }}
      onMouseMove={handleMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 z-10 rounded border border-white/10 opacity-30 mix-blend-screen" style={{ background: shine }} />
    </motion.div>
  )
}

export default function IntroductionPageContent() {
  const { language } = useLanguage()
  const copy = content[language]

  return (
    <main className="px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
      <section className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div className="space-y-8"><motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="font-mono text-[10px] uppercase tracking-[.32em] text-primary">{copy.eyebrow}</motion.p><motion.h1 initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: .08, duration: .75, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-.055em] text-balance sm:text-7xl">{copy.title} <span className="text-primary">{copy.accent}</span></motion.h1><motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .65 }} className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.lead}</motion.p><motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .65 }} className="flex flex-wrap gap-3 pt-2"><Link href="https://github.com/PapiGECode" target="_blank" className="group inline-flex items-center gap-3 rounded-full border border-primary/60 bg-primary/10 px-5 py-3 font-mono text-xs uppercase tracking-wider text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground">{copy.github}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link><Link href="/projects" className="group inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/40 px-5 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground">{copy.projects}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></motion.div></div>
        <TiltPortrait><div className="relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/60 p-3 shadow-2xl shadow-primary/5 backdrop-blur-sm"><div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-black"><img src="/pablo-rain-portrait.png" alt={copy.portraitLabel} className="h-full w-full object-cover grayscale contrast-110" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4"><div><p className="font-mono text-sm text-foreground">{copy.portraitLabel}</p><p className="font-mono text-[10px] uppercase tracking-widest text-primary">{copy.portraitMeta}</p></div><span className="rounded-full border border-primary/40 bg-background/70 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-primary">{copy.status}</span></div></div></div></TiltPortrait>
      </section>
      <section className="mx-auto mt-28 grid max-w-6xl gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.32em] text-primary">{copy.aboutEyebrow}</p><h2 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{copy.aboutTitle}</h2></div><div className="space-y-5 border-l border-primary/30 pl-6 text-sm leading-7 text-muted-foreground sm:pl-10 sm:text-base">{copy.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
      <section className="mx-auto mt-28 max-w-6xl"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.32em] text-primary">{copy.focusEyebrow}</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.focusTitle}</h2></div><Layers3 className="hidden size-8 text-primary/50 sm:block" /></div><div className="grid gap-px overflow-hidden rounded border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4">{copy.focus.map(({ icon: Icon, title, text }) => <article key={title} className="group bg-card/70 p-6 transition-colors hover:bg-card"><Icon className="mb-12 size-5 text-primary transition-transform duration-300 group-hover:-translate-y-1" /><h3 className="font-mono text-xs uppercase tracking-widest text-foreground">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></section>
      <section className="mx-auto mt-28 max-w-6xl rounded border border-border/70 bg-card/40 p-6 sm:p-10"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.32em] text-primary">{copy.networkEyebrow}</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.networkTitle}</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{copy.networkText}</p></div><div className="flex flex-wrap gap-2">{copy.communities.map((community) => <span key={community} className="rounded-full border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary">{community}</span>)}</div></div></section>
      <footer className="mx-auto mt-10 flex max-w-6xl items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><FileText className="size-3 text-primary" />{copy.note}<Globe2 className="ml-auto hidden size-4 text-primary/50 sm:block" /></footer>
    </main>
  )
}
