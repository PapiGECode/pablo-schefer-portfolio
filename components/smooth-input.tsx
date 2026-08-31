"use client"

import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from "react"
import type { InputHTMLAttributes, Ref } from "react"
import { cn } from "@/lib/utils"

type SmoothInputProps = InputHTMLAttributes<HTMLInputElement>

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

export const SmoothInput = forwardRef<HTMLInputElement, SmoothInputProps>(function SmoothInput(
  { className, onChange, onInput, onSelect, onClick, onKeyUp, onFocus, onBlur, onScroll, value, defaultValue, ...props },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mirrorRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number | null>(null)
  const blinkRef = useRef<number | null>(null)

  const positionCaret = useCallback(() => {
    const input = inputRef.current
    const mirror = mirrorRef.current
    const caret = caretRef.current
    if (!input || !mirror || !caret) return

    const styles = getComputedStyle(input)
    mirror.style.font = styles.font
    mirror.style.fontFamily = styles.fontFamily
    mirror.style.fontSize = styles.fontSize
    mirror.style.fontWeight = styles.fontWeight
    mirror.style.lineHeight = styles.lineHeight
    mirror.style.boxSizing = styles.boxSizing
    mirror.style.width = `${input.offsetWidth}px`
    mirror.style.letterSpacing = styles.letterSpacing
    mirror.style.padding = styles.padding
    mirror.style.border = styles.border
    mirror.style.whiteSpace = "pre"
    const marker = document.createElement("span")
    marker.textContent = "\u200b"
    mirror.replaceChildren(
      document.createTextNode(input.value.slice(0, input.selectionStart ?? input.value.length)),
      marker,
    )

    const shell = input.parentElement
    if (!shell) return
    const shellRect = shell.getBoundingClientRect()
    const markerRect = marker.getBoundingClientRect()
    const fontSize = Number.parseFloat(styles.fontSize) || 16
    const lineHeight = styles.lineHeight === "normal" ? fontSize * 1.4 : Number.parseFloat(styles.lineHeight) || fontSize * 1.4

    const caretHeight = Math.min(lineHeight, 20)
    const y = (input.offsetHeight - caretHeight) / 2
    caret.style.height = `${caretHeight}px`
    caret.style.transform = `translate3d(${markerRect.left - shellRect.left - input.scrollLeft}px, ${y}px, 0)`
  }, [])

  const schedulePosition = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      positionCaret()
    })
  }, [positionCaret])

  const markTyping = useCallback(() => {
    const caret = caretRef.current
    if (!caret) return
    caret.classList.add("is-typing")
    if (blinkRef.current !== null) window.clearTimeout(blinkRef.current)
    blinkRef.current = window.setTimeout(() => {
      caret.classList.remove("is-typing")
      blinkRef.current = null
    }, 650)
  }, [])

  useLayoutEffect(() => {
    schedulePosition()
  }, [value, schedulePosition])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const resizeObserver = new ResizeObserver(schedulePosition)
    resizeObserver.observe(input)
    window.addEventListener("resize", schedulePosition)
    document.addEventListener("selectionchange", schedulePosition)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", schedulePosition)
      document.removeEventListener("selectionchange", schedulePosition)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (blinkRef.current !== null) window.clearTimeout(blinkRef.current)
    }
  }, [schedulePosition])

  return (
    <span className="smooth-input-shell">
      <span ref={mirrorRef} className="smooth-input-mirror" aria-hidden="true" />
      <input
        {...props}
        ref={(node) => {
          inputRef.current = node
          setRef(forwardedRef, node)
        }}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "smooth-input-control",
          className,
        )}
        onChange={(event) => {
          onChange?.(event)
          schedulePosition()
        }}
        onInput={(event) => {
          onInput?.(event)
          markTyping()
          schedulePosition()
        }}
        onSelect={(event) => {
          onSelect?.(event)
          schedulePosition()
        }}
        onClick={(event) => {
          onClick?.(event)
          schedulePosition()
        }}
        onKeyUp={(event) => {
          onKeyUp?.(event)
          schedulePosition()
        }}
        onScroll={(event) => {
          onScroll?.(event)
          schedulePosition()
        }}
        onFocus={(event) => {
          onFocus?.(event)
          caretRef.current?.classList.add("is-visible")
          schedulePosition()
        }}
        onBlur={(event) => {
          onBlur?.(event)
          caretRef.current?.classList.remove("is-visible", "is-typing")
        }}
      />
      <span ref={caretRef} className="smooth-input-caret" aria-hidden="true" />
    </span>
  )
})
