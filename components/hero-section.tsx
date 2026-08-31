"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "./language-provider"

export function HeroSection() {
  const { language } = useLanguage()
  const roles = useMemo(
    () => language === "es"
      ? ["creando apps", "subiendo proyectos", "diseñando UI", "automatizando", "probando IA"]
      : ["building apps", "shipping code", "designing UI", "automating", "testing AI"],
    [language],
  )
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const targetText = roles[currentRole]
    const isComplete = displayText === targetText
    const isEmpty = displayText.length === 0
    const delay = isDeleting ? 42 : isComplete ? 1750 : isEmpty ? 360 : 76

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true)
      } else if (isDeleting && isEmpty) {
        setIsDeleting(false)
        setCurrentRole((prev) => (prev + 1) % roles.length)
      } else if (isDeleting) {
        setDisplayText(targetText.slice(0, displayText.length - 1))
      } else {
        setDisplayText(targetText.slice(0, displayText.length + 1))
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole, roles])

  const terminalStatus = language === "es" ? "> repos: activos" : "> repositories: active"

  return (
    <section className="relative px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center lg:min-h-[70vh]">
          {/* Left column - Text */}
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-3 animate-fade-in-up">
              <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
                <span className="font-bold">ˡᵃˢᵗPapiGEGamer🐾ྀི</span> — {language === "es" ? "Software, proyectos y experimentos" : "Software, projects & experiments"}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
                {language === "es" ? "Construyendo con código" : "Building with code"}
                <br />
                <span
                  className="inline-block min-h-[1.2em] bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text typing-cursor"
                >
                  {displayText}
                </span>
              </h1>
            </div>

            <p className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
              {language === "es" ? (
                <>Soy Pablo Schefer Orduña — <span className="text-foreground font-medium">PapiGEGamer</span>.
                Desarrollo proyectos web, herramientas y experimentos con JavaScript, TypeScript, React y Next.js.
                PapiGECode es mi laboratorio profesional: código, repositorios y productos digitales en construcción.</>
              ) : (
                <>I&apos;m Pablo Schefer Orduña — <span className="text-foreground font-medium">PapiGEGamer</span>.
                I build web projects, tools and experiments with JavaScript, TypeScript, React and Next.js.
                PapiGECode is my professional lab for code, repositories and digital products in progress.</>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-3">
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg border border-primary bg-primary/10 px-7 py-4 sm:py-3.5 font-mono text-sm text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
              >
                <span className="relative z-10">{language === "es" ? "explorar repositorios" : "explore repositories"}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                {/* Animated background */}
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 group-hover:translate-x-0" />
              </a>
              <Link
                href="/introduction"
                className="group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg border border-primary/25 bg-card/30 px-7 py-4 font-mono text-sm font-medium tracking-wide text-muted-foreground shadow-sm shadow-primary/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/10 hover:text-foreground hover:shadow-lg hover:shadow-primary/10 active:translate-y-0 active:scale-[0.98] sm:py-3.5"
              >
                <span className="absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">{language === "es" ? "sobre Pablo" : "about Pablo"}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 text-xs text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  ↗
                </span>
              </Link>
            </div>
          </div>

          {/* Right column - ASCII Art / Visual */}
          <div className="relative animate-scale-in stagger-4">
            <div className="relative rounded-xl border border-border bg-card/60 glass p-5 sm:p-8 hover-lift">
              {/* Terminal header dots */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60 transition-colors hover:bg-destructive" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60 transition-colors hover:bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80 transition-colors hover:bg-emerald-400" />
              </div>
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-background/50 rounded-md px-3 py-1 font-mono text-xs text-muted-foreground">
                terminal://PapiGECode
              </div>

              <pre className="mt-6 overflow-hidden px-2 py-3 font-mono text-[10px] leading-relaxed text-primary/80 sm:px-4 sm:py-4 sm:text-xs md:text-sm">
                <span className="sm:hidden">{`+-----------------------------+
|  ██████╗███████╗            |
| ██╔════╝██╔════╝            |
| ██║     █████╗              |
| ██║     ██╔══╝              |
| ╚██████╗██║                 |
|  ╚═════╝╚═╝                 |
|          Ein                |
|                             |
| ${terminalStatus.padEnd(27, " ")} |
| > stack: JS + TS + React    |
| > last commit: today        |
+-----------------------------+`}</span>
                <span className="hidden sm:block">{`┌─────────────────────────────────────┐
│                                     │
│  ██████╗ ██████╗ ██████╗ ███████╗   │
│ ██╔════╝██╔═══██╗██╔══██╗██╔════╝   │
│ ██║     ██║   ██║██║  ██║█████╗     │
│ ██║     ██║   ██║██║  ██║██╔══╝     │
│ ╚██████╗╚██████╔╝██████╔╝███████╗   │
│  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝   │
│           Ein                       │
│                                     │
│   ${terminalStatus.padEnd(34, " ")}│
│   > stack: JS + TS + React          │
│   > last commit: today              │
│                                     │
└─────────────────────────────────────┘`}</span>
              </pre>
            </div>

            <div className="absolute -right-2 sm:-right-6 -top-2 sm:-top-6 rounded-lg border border-primary/40 bg-primary/15 glass px-3 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs text-primary animate-float">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                v0.1.0
              </span>
            </div>
            <div
              className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 rounded-lg border border-border bg-card glass px-3 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs text-muted-foreground animate-float"
              style={{ animationDelay: "1s" }}
            >
              {language === "es" ? "Dic. 2025" : "Dec. 2025"}
            </div>

            <div className="hero-orb absolute -z-10 top-1/2 left-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex animate-fade-in stagger-6"
        role="img"
        aria-label={language === "es" ? "Desplázate hacia abajo" : "Scroll down"}
      >
        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue-glow" />
          <span className="scroll-cue-line" />
          <span className="scroll-cue-arrow" />
          <span className="scroll-cue-ring" />
        </div>
      </div>
    </section>
  )
}
