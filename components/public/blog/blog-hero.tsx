"use client"

import { useLanguage } from "@/components/language-provider"

export function BlogHero() {
  const { language } = useLanguage()

  return (
    <section className="px-4 sm:px-6 pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4 animate-fade-in-up">
          <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
            {language === "es" ? "Diario digital" : "Digital journal"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            {language === "es" ? "Blog y " : "Blog & "}
            <span className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text">{language === "es" ? "proceso" : "process"}</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {language === "es" ? "Proyectos, decisiones técnicas y aprendizajes de mi laboratorio digital: código, comunidades e integraciones en evolución." : "Projects, technical decisions and lessons from my digital laboratory: code, communities and integrations in progress."}
          </p>
        </div>
      </div>
    </section>
  )
}
