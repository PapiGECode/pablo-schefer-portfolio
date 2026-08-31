"use client"

import { LogoLoop, type LogoItem } from "./logo-loop"
import { useLanguage } from "./language-provider"
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiCplusplus,
  SiPlaywright,
  SiGithubactions,
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
  tech(SiJavascript, "JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"),
  tech(SiReact, "React", "https://react.dev"),
  tech(SiNextdotjs, "Next.js", "https://nextjs.org"),
  tech(SiNodedotjs, "Node.js", "https://nodejs.org"),
  tech(SiCplusplus, "C++", "https://isocpp.org"),
  tech(SiPlaywright, "Playwright", "https://playwright.dev"),
  tech(SiGithubactions, "GitHub Actions", "https://github.com/features/actions"),
  tech(SiTypescript, "TypeScript", "https://www.typescriptlang.org"),
  tech(SiTailwindcss, "Tailwind CSS", "https://tailwindcss.com"),
  tech(SiVercel, "Vercel", "https://vercel.com"),
  tech(SiGithub, "GitHub", "https://github.com/PapiGECode"),
  tech(SiDocker, "Docker", "https://www.docker.com"),
  tech(SiSvelte, "Svelte", "https://svelte.dev"),
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
