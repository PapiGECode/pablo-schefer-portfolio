"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

export type LogoItem = {
  node: React.ReactNode
  href?: string
  title?: string
  ariaLabel?: string
}

export interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  direction?: "left" | "right"
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  fadeOut?: boolean
  className?: string
}

export function LogoLoop({
  logos,
  speed = 80,
  direction = "left",
  logoHeight = 32,
  gap = 42,
  pauseOnHover = true,
  fadeOut = true,
  className,
}: LogoLoopProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const sequenceRef = useRef<HTMLUListElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const [sequenceWidth, setSequenceWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const updateWidth = () => setSequenceWidth(sequenceRef.current?.getBoundingClientRect().width ?? 0)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    if (viewportRef.current) observer.observe(viewportRef.current)
    if (sequenceRef.current) observer.observe(sequenceRef.current)
    return () => observer.disconnect()
  }, [logos, gap, logoHeight])

  useEffect(() => {
    const track = trackRef.current
    if (!track || sequenceWidth <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      velocityRef.current = 0
      return
    }

    const directionMultiplier = direction === "left" ? 1 : -1
    const smoothTau = 0.24
    const animate = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      const delta = Math.min(64, time - lastTimeRef.current) / 1000
      lastTimeRef.current = time
      const targetSpeed = pauseOnHover && isHovered ? 0 : speed * directionMultiplier
      const easing = 1 - Math.exp(-delta / smoothTau)
      velocityRef.current += (targetSpeed - velocityRef.current) * easing
      offsetRef.current = (offsetRef.current + velocityRef.current * delta + sequenceWidth) % sequenceWidth
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      lastTimeRef.current = null
    }
  }, [sequenceWidth, speed, direction, pauseOnHover, isHovered])

  const copies = useMemo(() => Array.from({ length: 4 }), [])

  return (
    <div
      ref={viewportRef}
      className={`relative w-full overflow-x-hidden overflow-y-visible py-1 ${className ?? ""}`}
      style={{ maskImage: fadeOut ? "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" : undefined }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Technologies and tools"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {copies.map((_, copyIndex) => (
          <ul
            key={copyIndex}
            ref={copyIndex === 0 ? sequenceRef : undefined}
            className="flex shrink-0 items-center"
            style={{ gap: `${gap}px`, marginRight: `${gap}px` }}
            aria-hidden={copyIndex > 0}
          >
            {logos.map((logo, index) => {
              const content = (
                <span
                  className="inline-flex items-center whitespace-nowrap font-mono font-semibold tracking-tight text-muted-foreground transition-all duration-300 hover:text-primary"
                  style={{ fontSize: `${Math.max(13, logoHeight * 0.55)}px` }}
                >
                  {logo.node}
                </span>
              )
              return (
                <li key={`${copyIndex}-${index}`} className="flex shrink-0 items-center" style={{ height: logoHeight }}>
                  {logo.href ? (
                    <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.ariaLabel ?? logo.title} title={logo.title}>
                      {content}
                    </a>
                  ) : content}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}
