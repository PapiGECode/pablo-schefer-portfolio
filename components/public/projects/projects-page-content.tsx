"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"
import { Github, Star, GitFork, ExternalLink, Sparkles, Search, Filter } from "lucide-react"
import { SmoothInput } from "@/components/smooth-input"
import { useLanguage } from "@/components/language-provider"
import { AnimatedText } from "@/components/animated-text"

type Project = {
  id: number | string
  title: string
  description: string
  tags: string[]
  status: string
  year: string
  stars: number
  forks: number
  url: string
  homepage?: string
  featured?: boolean
  highlight?: boolean
}

const projects: Project[] = [
  {
    id: 0,
    title: "pablo-schefer-portfolio",
    description:
      "Portfolio personal multipágina que integra proyectos, comunidades, GitHub y presencia digital en una experiencia web interactiva.",
    tags: ["TypeScript", "React", "Vite", "Web"],
    status: "in-progress",
    year: "2026",
    stars: 1,
    forks: 0,
    url: "https://github.com/PapiGECode/pablo-schefer-portfolio",
    homepage: "https://pabloschefer.com/",
    featured: true,
    highlight: true,
  },
  {
    id: 1,
    title: "duolingo-streak-keeper",
    description:
      "Automatización con Playwright para gestionar sesiones, consultar progreso y ejecutar prácticas programadas con GitHub Actions.",
    tags: ["TypeScript", "Playwright", "GitHub Actions", "Automation"],
    status: "in-progress",
    year: "2026",
    stars: 0,
    forks: 0,
    url: "https://github.com/PapiGECode/duolingo-streak-keeper",
    featured: true,
  },
  {
    id: 2,
    title: "KiCord-DOOM-Plugin",
    description:
      "Plugin de DOOM para KiCord, construido como extensión de código abierto para el cliente.",
    tags: ["TypeScript", "Plugin", "KiCord", "DOOM"],
    status: "shipped",
    year: "2024",
    stars: 1,
    forks: 0,
    url: "https://github.com/PapiGECode/KiCord-DOOM-Plugin",
    featured: false,
  },
  {
    id: 3,
    title: "project-vi-technical-archive",
    description:
      "Archivo técnico con catalogación SHA-256, verificación de integridad, metadatos y módulos experimentales.",
    tags: ["C++20", "Lua", "HLSL", "Tooling"],
    status: "in-progress",
    year: "2026",
    stars: 0,
    forks: 0,
    url: "https://github.com/PapiGECode/project-vi-technical-archive",
    featured: true,
  },
  {
    id: 4,
    title: "PapiGECode profile",
    description:
      "README profesional que documenta mi stack, intereses técnicos, proyectos y forma de construir.",
    tags: ["GitHub", "Markdown", "Open Source", "Profile"],
    status: "shipped",
    year: "2026",
    stars: 1,
    forks: 0,
    url: "https://github.com/PapiGECode/PapiGECode",
    featured: false,
  },
]

const filters = ["all", "shipped", "in-progress", "archived"]
const allTags = [...new Set(projects.flatMap((p) => p.tags))]

export function ProjectsPageContent() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [hoveredProject, setHoveredProject] = useState<number | string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [githubProjects, setGithubProjects] = useState<Project[]>([])
  const { language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
    fetch("/api/github/repos")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.repositories) return
        setGithubProjects(data.repositories.map((repository: {
          name: string
          description: string | null
          url: string
          stars: number
          forks: number
          language: string | null
          topics?: string[]
          homepage?: string | null
          archived?: boolean
          updatedAt: string
        }) => ({
          id: `github-${repository.name}`,
          title: repository.name,
          description: repository.description || (language === "es" ? "Repositorio de PapiGECode en GitHub." : "PapiGECode repository on GitHub."),
          tags: [...(repository.language ? [repository.language] : []), ...(repository.topics || [])],
          status: repository.archived ? "archived" : "shipped",
          year: new Date(repository.updatedAt).getFullYear().toString(),
          stars: repository.stars,
          forks: repository.forks,
          url: repository.url,
          homepage: repository.homepage || undefined,
        })))
      })
      .catch(() => undefined)
  }, [language])

  const allProjects = useMemo(() => {
    const curatedNames = new Set(projects.map((project) => project.title.toLowerCase()))
    return [...projects, ...githubProjects.filter((project) => !curatedNames.has(project.title.toLowerCase()))]
  }, [githubProjects])

  const allTags = useMemo(() => [...new Set(allProjects.flatMap((project) => project.tags))], [allProjects])

  const filteredProjects = allProjects.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.status === activeFilter
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => p.tags.includes(tag))
    return matchesFilter && matchesSearch && matchesTags
  })
  const filterLabels = language === "es"
    ? { all: "todos", shipped: "publicados", "in-progress": "en progreso", archived: "archivados" }
    : { all: "all", shipped: "shipped", "in-progress": "in progress", archived: "archived" }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className={cn("mb-12 sm:mb-16 space-y-4 opacity-0", isVisible && "animate-fade-in-up")}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary"><AnimatedText text={language === "es" ? "GitHub · trabajo seleccionado" : "GitHub · selected work"} emphasis="label" /></p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"><AnimatedText text={language === "es" ? "Proyectos de programación" : "Programming projects"} mode="chars" emphasis="title" /></h1>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            <AnimatedText text={language === "es" ? "Repositorios, interfaces y experimentos de Pablo Schefer Orduña. Código en evolución, documentado y construido para aprender, probar y publicar." : "Repositories, interfaces and experiments by Pablo Schefer Orduña. Evolving, documented code built to learn, test and ship."} />
          </p>
        </div>

        {/* Search and Filters */}
        <div className={cn("mb-10 space-y-6 opacity-0", isVisible && "animate-fade-in-up stagger-2")}>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <SmoothInput
              type="text"
              placeholder={language === "es" ? "Buscar proyectos..." : "Search projects..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/40 border-border/60 focus:border-primary/50"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-lg border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98]",
                  activeFilter === filter
                    ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <AnimatedText text={filterLabels[filter as keyof typeof filterLabels]} emphasis="label" />
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <Filter className="h-4 w-4 text-muted-foreground mr-2 self-center" />
            {allTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-md border px-2.5 py-1 font-mono text-xs transition-all duration-200",
                  selectedTags.includes(tag)
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                <AnimatedText text={tag} emphasis="label" />
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card/40 p-6 sm:p-7 glass transition-all duration-400 active:scale-[0.99] hover-lift opacity-0",
                isVisible && "animate-fade-in-up",
                hoveredProject === project.id && "border-primary/40 bg-card/70",
                "highlight" in project && project.highlight
                  ? "sm:col-span-2 lg:col-span-2 border-primary/30 bg-gradient-to-br from-primary/8 via-card/50 to-primary/8"
                  : "border-border/60",
                project.featured && !("highlight" in project && project.highlight) && "sm:col-span-2 lg:col-span-1",
              )}
              style={{ animationDelay: `${(index % 6) * 80 + 200}ms` }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {"highlight" in project && project.highlight && (
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 animate-pulse-glow">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-medium">
                    <AnimatedText text={language === "es" ? "Destacado" : "Featured"} emphasis="label" />
                  </span>
                </div>
              )}

              <div
                className={cn(
                  "absolute right-5 top-5 flex items-center gap-2.5",
                  "highlight" in project && project.highlight && "top-5",
                )}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-shadow duration-300",
                    project.status === "shipped" && "bg-primary shadow-sm shadow-primary/50",
                    project.status === "in-progress" && "bg-yellow-500 animate-pulse shadow-sm shadow-yellow-500/50",
                    project.status === "archived" && "bg-muted-foreground",
                  )}
                />
                <span className="font-mono text-xs text-muted-foreground"><AnimatedText text={filterLabels[project.status as keyof typeof filterLabels]} emphasis="label" /></span>
              </div>

              <div
                className={cn(
                  "mb-5 font-mono text-xs text-muted-foreground",
                  "highlight" in project && project.highlight && "mt-10",
                )}
              >
                {project.year}
              </div>

              <h3
                className={cn(
                  "mb-3 font-bold tracking-tight transition-all duration-300 group-hover:text-gradient",
                  "highlight" in project && project.highlight ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                )}
              >
                <AnimatedText text={project.title} mode="chars" emphasis="title" />
              </h3>

              <p
                className={cn(
                  "mb-5 text-sm leading-relaxed text-muted-foreground",
                  "highlight" in project && project.highlight ? "line-clamp-3" : "line-clamp-2",
                )}
              >
                <AnimatedText text={project.description} />
              </p>

              <div className="mb-5 flex items-center gap-5 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-yellow-500">
                  <Star className="h-3.5 w-3.5" />
                  {project.stars}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-foreground">
                  <GitFork className="h-3.5 w-3.5" />
                  {project.forks}
                </span>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border/80 bg-secondary/60 px-2.5 py-1 font-mono text-xs text-secondary-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    <AnimatedText text={tag} emphasis="label" />
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all duration-300 group/link"
                >
                  <Github className="h-4 w-4 transition-transform group-hover/link:scale-110" />
                  <span className="underline-animate"><AnimatedText text={language === "es" ? "código" : "source"} emphasis="label" /></span>
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-xs text-primary hover:text-foreground transition-all duration-300 group/link"
                  >
                    <ExternalLink className="h-4 w-4 transition-transform group-hover/link:scale-110 group-hover/link:rotate-12" />
                    <span className="underline-animate"><AnimatedText text={language === "es" ? "demo" : "live"} emphasis="label" /></span>
                  </a>
                )}
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary via-primary/80 to-transparent transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-muted-foreground"><AnimatedText text={language === "es" ? "No se encontraron proyectos con esos criterios." : "No projects found matching your criteria."} /></p>
          </div>
        )}
      </div>
    </section>
  )
}
