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
  SiGithubactions,
  SiEpicgames,
  SiGoogle,
  SiApple,
  SiMeta,
  SiNvidia,
  SiGitlab,
  SiFigma,
  SiTailwindcss,
  SiVercel,
  SiGithub,
  SiDocker,
  SiSvelte,
} from "react-icons/si"
import { FaAmazon, FaMicrosoft } from "react-icons/fa6"
import { BsOpenai } from "react-icons/bs"
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
  tech(SiTypescript, "TypeScript", "https://www.typescriptlang.org"),
  tech(SiNextdotjs, "Next.js", "https://nextjs.org"),
  tech(SiCplusplus, "C++", "https://isocpp.org"),
  tech(SiTailwindcss, "Tailwind CSS", "https://tailwindcss.com"),
  tech(SiNodedotjs, "Node.js", "https://nodejs.org"),
  tech(SiVercel, "Vercel", "https://vercel.com"),
  tech(SiGithubactions, "GitHub Actions", "https://github.com/features/actions"),
  tech(SiDocker, "Docker", "https://www.docker.com"),
  tech(FaMicrosoft, "Microsoft", "https://www.microsoft.com"),
  tech(SiApple, "Apple", "https://www.apple.com"),
  tech(SiEpicgames, "Epic Games", "https://www.epicgames.com"),
  tech(BsOpenai, "OpenAI", "https://openai.com"),
  tech(SiGoogle, "Google", "https://www.google.com"),
  tech(SiMeta, "Meta", "https://about.meta.com"),
  tech(SiGitlab, "GitLab", "https://gitlab.com"),
  tech(SiNvidia, "NVIDIA", "https://www.nvidia.com"),
  tech(SiFigma, "Figma", "https://www.figma.com"),
  tech(SiSvelte, "Svelte", "https://svelte.dev"),
  tech(SiGithub, "GitHub", "https://github.com/PapiGECode"),
  tech(FaAmazon, "Amazon", "https://www.amazon.com"),
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
