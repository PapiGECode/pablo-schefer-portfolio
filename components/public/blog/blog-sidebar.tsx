"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Mail, Rss, Search, Tag, TrendingUp } from "lucide-react"
import { SmoothInput } from "@/components/smooth-input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

const categories = [
  { name: { es: "Todos", en: "All posts" }, count: 6, slug: "all" },
  { name: { es: "Frontend", en: "Frontend" }, count: 1, slug: "frontend" },
  { name: { es: "Integraciones", en: "Integrations" }, count: 1, slug: "integrations" },
  { name: { es: "Automatización", en: "Automation" }, count: 1, slug: "automation" },
  { name: { es: "Sistemas", en: "Systems" }, count: 1, slug: "systems" },
  { name: { es: "Comunidad", en: "Community" }, count: 2, slug: "community" },
]

const popularTags = ["nextjs", "react", "typescript", "discord", "lanyard", "playwright", "kicord", "opensource", "c++", "community"]

export function BlogSidebar() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [email, setEmail] = useState("")
  const { language } = useLanguage()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription
    setEmail("")
  }

  return (
    <aside ref={sidebarRef} className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      {/* Search */}
      <div className={cn("opacity-0", isVisible && "animate-fade-in-up")}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SmoothInput
            type="search"
            placeholder={language === "es" ? "Buscar artículos..." : "Search articles..."}
            className="pl-10 bg-card/40 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className={cn("opacity-0", isVisible && "animate-fade-in-up stagger-1")}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{language === "es" ? "Categorías" : "Categories"}</h3>
        </div>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-300",
                activeCategory === category.slug
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent",
              )}
            >
              <span>{category.name[language]}</span>
              <span className="rounded-md bg-secondary/60 px-2 py-0.5 font-mono text-xs">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className={cn("opacity-0", isVisible && "animate-fade-in-up stagger-2")}>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{language === "es" ? "Etiquetas populares" : "Popular tags"}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="rounded-lg border border-border/50 bg-card/40 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div
        className={cn(
          "rounded-xl border border-border/50 bg-card/40 glass p-6 opacity-0",
          isVisible && "animate-fade-in-up stagger-3",
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{language === "es" ? "Novedades" : "Updates"}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {language === "es" ? "Recibe novedades sobre proyectos, experimentos y notas. Sin spam." : "Get updates about projects, experiments and notes. No spam."}
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <SmoothInput
            type="email"
            placeholder={language === "es" ? "tu@email.com" : "your@email.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
          <Button type="submit" className="w-full font-mono text-xs uppercase tracking-wider">
            {language === "es" ? "Suscribirme" : "Subscribe"}
          </Button>
        </form>
      </div>

      {/* RSS Feed */}
      <div className={cn("opacity-0", isVisible && "animate-fade-in-up stagger-4")}>
        <a
          href="/rss.xml"
          className="flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/40 px-4 py-3 font-mono text-xs text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        >
          <Rss className="h-4 w-4" />
          <span>{language === "es" ? "Suscribirse por RSS" : "Subscribe via RSS"}</span>
        </a>
      </div>
    </aside>
  )
}
