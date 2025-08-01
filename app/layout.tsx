import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AIChatProvider } from "@/components/ai-chat-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InternDeck - AI-Powered Internship Platform",
  description:
    "Discover and prepare for internships with AI-powered recommendations, skill assessments, and mock interviews.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AIChatProvider>
            {children}
            <Toaster />
          </AIChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
