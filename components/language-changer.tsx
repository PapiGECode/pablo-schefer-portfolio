"use client"

import { useState } from "react"
import { Globe2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage, type Language } from "./language-provider"

const languages: Array<{ code: Language; label: string; flag: string }> = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
]

export function LanguageChanger() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const current = languages.find((item) => item.code === language) ?? languages[0]

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "group relative flex h-9 w-9 items-center justify-center rounded-lg",
          "text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary",
          isOpen && "bg-primary/10 text-primary",
        )}
        aria-label={`Change language, current language ${current.label}`}
        aria-expanded={isOpen}
      >
        <Globe2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10px] text-muted-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:-bottom-9 group-hover:opacity-100">
          {current.flag}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 top-12 z-50 w-48 origin-top-right rounded-lg border border-border bg-card/85 p-3 shadow-2xl shadow-primary/10 ring-1 ring-primary/10 backdrop-blur-2xl animate-menu-pop-in"
            onMouseLeave={() => setIsOpen(false)}
            role="menu"
            aria-label="Language selection"
          >
            <div className="mb-2 flex items-center justify-between px-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span>{language === "es" ? "Idioma" : "Language"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="space-y-1.5">
              {languages.map((item, index) => (
                <button
                  key={item.code}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLanguage(item.code)
                    setIsOpen(false)
                  }}
                  style={{ animationDelay: `${index * 55}ms` }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left font-mono text-sm transition-all duration-300 animate-menu-item-in hover:-translate-y-0.5 hover:bg-secondary/80",
                    language === item.code ? "border-primary/50 bg-primary/10 text-foreground shadow-sm shadow-primary/10" : "border-transparent text-muted-foreground",
                  )}
                >
                  <span className="flex h-7 w-8 items-center justify-center rounded border border-current/20 text-lg leading-none" aria-hidden="true">{item.flag}</span>
                  <span className="flex-1">{item.label}</span>
                  {language === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
