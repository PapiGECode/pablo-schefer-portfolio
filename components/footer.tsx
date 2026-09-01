"use client"

import { useState } from "react"
import { Github, Instagram, MailOpen, ExternalLink, Heart, Check, Copy } from "lucide-react"
import { XLogo } from "./x-logo"
import { DiscordLogo } from "./discord-logo"
import { useLanguage } from "./language-provider"

const socialLinks = [
  { label: "GitHub", href: "https://github.com/PapiGECode", handle: "@PapiGECode", icon: Github },
  { label: "x.com", href: "https://x.com/PapiGEGamer", handle: "@PapiGEGamer", icon: XLogo },
  { label: "Instagram", href: "https://www.instagram.com/papigegamer/", handle: "@papigegamer", icon: Instagram },
  { label: "Discord", href: "#discord", handle: "papigegamerantiguo", icon: DiscordLogo },
  { label: "Email", href: "mailto:pablopme41@gmail.com", handle: "pablopme41@gmail.com", icon: MailOpen },
]

export function Footer() {
  const [discordCopied, setDiscordCopied] = useState(false)
  const { language } = useLanguage()

  const copyDiscordId = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText("papigegamerantiguo")
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = "papigegamerantiguo"
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        const copied = document.execCommand("copy")
        textarea.remove()
        if (!copied) throw new Error("Clipboard copy failed")
      }
      setDiscordCopied(true)
      window.setTimeout(() => setDiscordCopied(false), 2400)
    } catch {
      setDiscordCopied(false)
    }
  }

  return (
    <footer id="connect" className="border-t border-border/30 px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">{language === "es" ? "Conecta" : "Connect"}</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
                {language === "es" ? "Construyamos algo " : "Let's build something "}
                <span className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text ">{language === "es" ? "juntos" : "together"}</span>
              </h2>
            </div>
              <p className="max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
              Abierto a colaboraciones, comunidades interesantes y proyectos que conecten personas, código y producto.
            </p>

            <div className="pt-2">
              <a
                href="mailto:pablopme41@gmail.com"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-primary bg-primary/10 px-8 py-4 sm:py-4 font-mono text-sm text-primary transition-all duration-500 hover:text-primary-foreground active:scale-[0.98] w-full sm:w-auto"
              >
                <span className="relative z-10">{language === "es" ? "enviar una señal" : "send a signal"}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 group-hover:translate-x-0" />
              </a>
            </div>
          </div>

          {/* Right column - Links */}
          <div className="space-y-6 lg:text-right animate-fade-in-up stagger-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-muted-foreground">
              {language === "es" ? "Encuéntrame en" : "Find me elsewhere"}
            </p>
            <div className="space-y-2">
              {socialLinks.map((link, index) => {
                const content = (
                  <div className="flex items-center gap-3 lg:flex-row-reverse">
                    {discordCopied && link.label === "Discord" ? (
                      <Check className="h-5 w-5 text-emerald-400 transition-all duration-300" />
                    ) : (
                      <link.icon className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                    )}
                    <span className="font-mono text-sm font-medium transition-colors group-hover:text-gradient">
                      {discordCopied && link.label === "Discord" ? (language === "es" ? "ID copiado" : "ID copied") : link.label}
                    </span>
                    {link.label !== "Email" && link.label !== "Discord" && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground/50 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                    )}
                  </div>
                )
                const handle = (
                  <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground truncate">
                    {discordCopied && link.label === "Discord" ? (language === "es" ? "Puedes agregarme en Discord" : "You can add me on Discord") : link.handle}
                    {link.label === "Discord" && !discordCopied && <Copy className="h-3 w-3 opacity-50" />}
                  </span>
                )
                const className = "group flex w-full items-center justify-between gap-4 rounded-xl border border-transparent p-4 text-left transition-all duration-300 lg:flex-row-reverse active:bg-secondary/30 hover:border-border/50 hover:bg-card/50 glass animate-fade-in"
                return link.label === "Discord" ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={copyDiscordId}
                    className={className}
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                    aria-label="Copiar ID de Discord"
                  >
                    {content}
                    {handle}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.label !== "Email" ? "_blank" : undefined}
                    rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                    className={className}
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    {content}
                    {handle}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/30 pt-8 sm:pt-10 sm:flex-row animate-fade-in stagger-4">
          <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>{language === "es" ? "Creado por Pablo con" : "Built by Pablo with"}</span>
            <Heart className="h-3.5 w-3.5 text-destructive animate-pulse" />
            <span>{language === "es" ? "y código" : "& code"}</span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.slice(0, 3).map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted-foreground/50 transition-all duration-300 hover:text-primary hover:scale-110"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <p className="font-mono text-xs text-muted-foreground text-center sm:text-right">
            © {new Date().getFullYear()} PapiGECode — <span className="font-bold">ˡᵃˢᵗPapiGEGamer🐾ྀི</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
