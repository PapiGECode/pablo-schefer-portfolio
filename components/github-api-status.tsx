"use client"

import { useEffect, useState } from "react"
import { Github, Radio } from "lucide-react"
import { useLanguage } from "./language-provider"

export function GithubApiStatus() {
  const { language } = useLanguage()
  const [repositoryCount, setRepositoryCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    fetch("/api/github/repos")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.repositories) setRepositoryCount(data.repositories.length)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
      <Github className="h-3.5 w-3.5 text-primary" />
      <span>{language === "es" ? "API de GitHub conectada" : "GitHub API connected"}</span>
      <Radio className="h-3 w-3 text-primary animate-pulse" />
      {repositoryCount !== null && <span className="text-primary">{repositoryCount}</span>}
    </div>
  )
}
