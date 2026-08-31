import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import "./globals.css"

// Configure fonts with proper options
const geist = Geist({
  subsets: ["latin"],
  variable: '--font-geist',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pabloschefer.vercel.app'),
  title: {
    default: "PapiGECode — Pablo Schefer Orduña's Digital Laboratory",
    template: "%s | PapiGECode",
  },
  description:
    "El laboratorio digital de Pablo Schefer Orduña: comunidades, moderación, vibecoding y proyectos digitales.",
  keywords: ["Software Engineering", "Web Development", "Next.js", "React", "TypeScript", "AI", "Machine Learning", "Systems Programming", "Code Experiments"],
  authors: [{ name: "Pablo Schefer Orduña", url: "https://github.com/PapiGECode" }],
  creator: "Pablo Schefer Orduña",
  publisher: "Pablo Schefer Orduña",
  generator: "v0.app",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "PapiGECode — Pablo Schefer Orduña's Digital Laboratory",
    description: "El laboratorio digital de Pablo Schefer Orduña: comunidades, moderación, vibecoding y proyectos digitales.",
    siteName: "PapiGECode",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PapiGECode — Pablo Schefer Orduña's Digital Laboratory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PapiGECode — Pablo Schefer Orduña's Digital Laboratory",
    description: "A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts.",
    creator: "@PapiGECode",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="theme-mode">
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
