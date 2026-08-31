"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { themes, type ThemeColor } from "@/lib/themes"
import { useLanguage } from "./language-provider"

// Versioned key prevents an old saved theme (such as Emerald) from flashing
// before the Cyan default is applied on the first load after the redesign.
const STORAGE_KEY = "color-theme-v2"

export function ThemeChanger() {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>("cyan")
  const [isOpen, setIsOpen] = useState(false)
  const [selectingTheme, setSelectingTheme] = useState<ThemeColor | null>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, systemTheme } = useTheme()
  const { language } = useLanguage()
  const themeInitialized = useRef(false)
  const currentThemeRef = useRef<ThemeColor>("cyan")

  // Initialize theme from localStorage only once on mount
  useEffect(() => {
    if (themeInitialized.current) return

    setMounted(true)
    // Only read from localStorage after mount to avoid hydration mismatch
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeColor
      if (savedTheme && themes[savedTheme]) {
        currentThemeRef.current = savedTheme
        setCurrentTheme(savedTheme)
      } else {
        currentThemeRef.current = "cyan"
        setCurrentTheme("cyan")
      }
    }
    themeInitialized.current = true

    // Listen for storage changes (e.g., from other tabs) but don't override local changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && themes[e.newValue as ThemeColor]) {
        currentThemeRef.current = e.newValue as ThemeColor
        setCurrentTheme(e.newValue as ThemeColor)
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Apply theme whenever resolvedTheme changes - always use ref to avoid state reset issues
  useEffect(() => {
    if (!mounted) return
    // Wait for resolvedTheme to be available
    if (resolvedTheme === undefined) return

    // Verify ref is still valid, and sync with localStorage as fallback
    // This ensures theme persists even if component remounts or ref gets reset
    let themeToApply = currentThemeRef.current

    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(STORAGE_KEY) as ThemeColor
      // If localStorage has a different theme than ref, sync them
      // This handles edge cases where ref might get reset
      if (storedTheme && themes[storedTheme]) {
        if (storedTheme !== currentThemeRef.current) {
          // Sync ref and state with localStorage value
          currentThemeRef.current = storedTheme
          setCurrentTheme(storedTheme)
        }
        themeToApply = storedTheme
      }
    }

    // Apply theme using the verified value
    applyTheme(themeToApply, resolvedTheme)
  }, [mounted, resolvedTheme]) // Only depend on resolvedTheme, not currentTheme

  const applyTheme = (themeName: ThemeColor, mode?: string | null) => {
    const themeConfig = themes[themeName]
    // Use resolvedTheme or fallback to systemTheme, default to "light"
    const effectiveMode = mode ?? systemTheme ?? "light"
    const isDark = effectiveMode === "dark"
    const colors = isDark ? themeConfig.dark : themeConfig.light

    // Apply immediately so the page never renders with a stale accent color.
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value)
    })
  }

  const handleThemeChange = (themeName: ThemeColor) => {
    setSelectingTheme(themeName)
    // Update ref first to ensure persistence
    currentThemeRef.current = themeName
    // Update state for re-render
    setCurrentTheme(themeName)
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, themeName)
    }
    // Apply theme immediately with current mode
    const effectiveMode = resolvedTheme ?? systemTheme ?? "light"
    applyTheme(themeName, effectiveMode)
    window.setTimeout(() => {
      setIsOpen(false)
      setSelectingTheme(null)
    }, 180)
  }

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const themeColors: Record<ThemeColor, string> = {
    golden: "bg-gradient-to-br from-amber-400 to-yellow-600",
    cyan: "bg-gradient-to-br from-cyan-400 to-blue-500",
    purple: "bg-gradient-to-br from-purple-400 to-violet-600",
    emerald: "bg-gradient-to-br from-emerald-400 to-green-600",
    rose: "bg-gradient-to-br from-rose-400 to-pink-600",
  }

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex h-9 w-9 items-center justify-center rounded-lg",
          "text-muted-foreground transition-all duration-300",
          "hover:text-primary hover:bg-primary/10",
          isOpen && "bg-primary/10 text-primary",
        )}
        aria-label="Change color theme"
      >
        <Palette className="h-4 w-4" />
        <span
          className={cn(
            "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
            "rounded-md bg-card border border-border px-2.5 py-1",
            "font-mono text-[10px] text-muted-foreground",
            "opacity-0 transition-all duration-200 pointer-events-none shadow-lg",
            "group-hover:opacity-100 group-hover:-bottom-9",
          )}
        >
          {language === "es" ? "Colores" : "Colors"}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "absolute right-0 top-12 z-50",
              "w-48 rounded-lg border border-border",
              "bg-card/85 backdrop-blur-2xl shadow-2xl shadow-primary/10 ring-1 ring-primary/10",
              "origin-top-right p-3 animate-menu-pop-in",
            )}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="mb-2 flex items-center justify-between px-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span>{language === "es" ? "Seleccionar tema" : "Select theme"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="space-y-1.5">
              {Object.entries(themes).map(([key, theme], index) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as ThemeColor)}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    "animate-menu-item-in transition-all duration-300 ease-out",
                    "hover:-translate-y-0.5 hover:bg-secondary/80 hover:shadow-md hover:shadow-primary/5",
                    currentTheme === key ? "bg-primary/10 border border-primary/50 shadow-sm shadow-primary/10" : "border border-transparent",
                    selectingTheme === key && "scale-[1.03] bg-primary/20 shadow-lg shadow-primary/20",
                  )}
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 border-border shadow-sm",
                      themeColors[key as ThemeColor],
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-sm flex-1 text-left",
                      currentTheme === key ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {theme.name}
                  </span>
                  {currentTheme === key && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
