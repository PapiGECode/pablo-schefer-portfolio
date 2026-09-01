"use client"

import { useReducedMotion } from "motion/react"
import SplitText from "@/components/SplitText"

type AnimatedTextProps = {
  text: string
  className?: string
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4"
  mode?: "chars" | "words"
  emphasis?: "title" | "body" | "label"
}

export function AnimatedText({
  text,
  className,
  as = "span",
  mode = "words",
  emphasis = "body",
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <span className={className}>{text}</span>

  const title = emphasis === "title"
  const label = emphasis === "label"
  const wordDelay = text.trim().split(/\s+/).length > 18 ? 22 : label ? 56 : 68

  return (
    <SplitText
      key={`${as}-${mode}-${text}`}
      text={text}
      tag={as}
      textAlign="left"
      splitType={mode}
      delay={mode === "chars" ? (title ? 38 : 30) : wordDelay}
      duration={title ? 0.92 : 0.8}
      threshold={0}
      rootMargin="0px"
      from={{ opacity: 0, y: title ? 16 : 10, filter: "blur(5px)" }}
      to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className={className}
    />
  )
}
