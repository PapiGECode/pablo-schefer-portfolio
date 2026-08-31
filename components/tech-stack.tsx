"use client"

import { LogoLoop, type LogoItem } from "./logo-loop"
import { useLanguage } from "./language-provider"
import {
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVercel,
  SiGithub,
  SiDocker,
  SiSvelte,
} from "react-icons/si"
import type { IconType } from "react-icons"

const tech = (Icon: IconType, label: string, href: string): LogoItem => ({
  node: <Icon className="h-8 w-8" aria-hidden="true" />,
  href,
  title: label,
  ariaLabel: label,
})

const techLogos: LogoItem[] = [
  tech(SiTailwindcss, "Tailwind CSS", "https://tailwindcss.com"),
  tech(SiVercel, "Vercel", "https://vercel.com"),
  tech(SiGithub, "GitHub", "https://github.com/PapiGECode"),
  tech(SiDocker, "Docker", "https://www.docker.com"),
  tech(SiSvelte, "Svelte", "https://svelte.dev"),
  tech(SiReact, "React", "https://react.dev"),
  tech(SiNextdotjs, "Next.js", "https://nextjs.org"),
  tech(SiTypescript, "TypeScript", "https://www.typescriptlang.org"),
]

export function TechStack() {
  const { language } = useLanguage()

  return (
    <section className="border-y border-border/30 px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="tech-stack-title">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
        <p id="tech-stack-title" className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          {language === "es" ? "Stack · programación" : "Stack · programming"}
        </p>
        <LogoLoop logos={techLogos} speed={65} logoHeight={36} gap={38} />
      </div>
    </section>
  )
}
