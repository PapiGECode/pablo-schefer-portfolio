"use client"

import { cn } from "@/lib/utils"
import { Github, ExternalLink } from "lucide-react"
import { useLanguage } from "./language-provider"
import { AnimatedText } from "@/components/animated-text"

const wipItems = [
  {
    id: 1,
    name: "pablo-schefer-portfolio",
    description: "Personal portfolio with GitHub, Discord and realtime integrations",
    progress: 85,
    lastUpdated: "Today",
    url: "https://github.com/PapiGECode/pablo-schefer-portfolio",
  },
  {
    id: 2,
    name: "duolingo-streak-keeper",
    description: "Playwright automation with scheduled GitHub Actions workflows",
    progress: 70,
    lastUpdated: "Today",
    url: "https://github.com/PapiGECode/duolingo-streak-keeper",
  },
  {
    id: 3,
    name: "KiCord-DOOM-Plugin",
    description: "TypeScript DOOM plugin for the KiCord client",
    progress: 90,
    lastUpdated: "Today",
    url: "https://github.com/PapiGECode/KiCord-DOOM-Plugin",
  },
  {
    id: 4,
    name: "project-vi-technical-archive",
    description: "Technical archive with integrity verification and systems experiments",
    progress: 75,
    lastUpdated: "Today",
    url: "https://github.com/PapiGECode/project-vi-technical-archive",
  },
]

export function Workbench() {
  const { language } = useLanguage()
  return (
    <section id="workbench" className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-14 space-y-3 animate-fade-in-up">
          <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
            <AnimatedText text={language === "es" ? "Trabajo en curso · Desarrollo" : "Work in Progress · Development"} emphasis="label" />
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"><AnimatedText text={language === "es" ? "Mesa de desarrollo" : "Development workbench"} mode="chars" emphasis="title" /></h2>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            <AnimatedText text="Repositorios activos, prototipos y herramientas que se construyen, prueban y mejoran." />
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/40 glass backdrop-blur-sm overflow-hidden hover-lift animate-scale-in stagger-2">
          {/* Terminal header */}
          <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/40 px-4 sm:px-5 py-3.5 sm:py-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive/60 transition-colors hover:bg-destructive cursor-pointer" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60 transition-colors hover:bg-yellow-500 cursor-pointer" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80 transition-colors hover:bg-emerald-400 cursor-pointer" />
            </div>
            <span className="ml-4 font-mono text-xs text-muted-foreground truncate"><AnimatedText text="~/pabloschefer/active" emphasis="label" /></span>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs"><AnimatedText text={language === "es" ? "en directo" : "live"} emphasis="label" /></span>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {wipItems.map((item, index) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 p-5 sm:p-6 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between hover:bg-secondary/30 animate-fade-in"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-sm shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                      $
                    </span>
                    <h4 className="font-mono text-sm font-medium tracking-tight transition-colors group-hover:text-gradient truncate">
                      <AnimatedText text={item.name} mode="chars" emphasis="title" />
                    </h4>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Github className="h-3.5 w-3.5 text-muted-foreground" />
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="pl-6 text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1"><AnimatedText text={item.description} /></p>
                </div>

                <div className="flex items-center justify-between gap-6 pl-6 sm:pl-0 sm:justify-end">
                  <div className="flex items-center gap-3 flex-1 sm:flex-none">
                    <div className="h-2 w-full sm:w-28 overflow-hidden rounded-full bg-secondary/80 relative">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 ease-out",
                          item.progress >= 80 ? "bg-primary" : item.progress >= 50 ? "bg-yellow-500" : "bg-orange-500",
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 animate-shimmer opacity-30" />
                    </div>
                    <span
                      className={cn(
                        "font-mono text-xs w-10 shrink-0 transition-colors",
                        item.progress >= 80 ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.progress}%
                    </span>
                  </div>

                  <span className="font-mono text-xs text-muted-foreground shrink-0"><AnimatedText text={language === "es" ? "Hoy" : item.lastUpdated} emphasis="label" /></span>
                </div>
              </a>
            ))}
          </div>

          <div className="border-t border-border/50 bg-secondary/30 px-4 sm:px-5 py-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="text-primary">❯</span>
              <span className="typing-cursor truncate"><AnimatedText text="git status --all" emphasis="label" /></span>
              <span className="ml-auto text-primary/50 hidden sm:block"><AnimatedText text={language === "es" ? "pulsa enter para ejecutar" : "press enter to run"} emphasis="label" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
