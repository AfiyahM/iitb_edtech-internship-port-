"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { AIChatWidget } from "./ai-chat-widget"

interface AIChatContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleChat: () => void
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined)

export function useAIChat() {
  const context = useContext(AIChatContext)
  if (!context) {
    throw new Error("useAIChat must be used within AIChatProvider")
  }
  return context
}

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <AIChatContext.Provider value={{ isOpen, setIsOpen, toggleChat }}>
      {children}
      <AIChatWidget />
    </AIChatContext.Provider>
  )
}
