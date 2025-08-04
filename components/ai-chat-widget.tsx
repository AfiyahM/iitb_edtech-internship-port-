"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Briefcase,
  FileText,
  Target,
  Lightbulb,
  HelpCircle,
  Upload,
  File,
  Paperclip,
  Star,
  TrendingUp
} from "lucide-react"
import { jobAssistant, type ChatMessage, type JobAssistantResponse } from "@/lib/gemini"
import { useToast } from "@/hooks/use-toast"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

interface ConversationContext {
  resumeText?: string
  jobDescription?: string
  atsScore?: number
  matchScore?: number
  isApplyingForJob?: boolean
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [conversationContext, setConversationContext] = useState<ConversationContext>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I'm your AI career assistant. I can help you with resume optimization, ATS scoring, and job matching. Upload your resume/CV to get started!",
          timestamp: new Date()
        }
      ])
    }
  }, [isOpen, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Build conversation context for better AI responses
      const recentMessages = messages.slice(-4) // Keep last 4 messages for context
      const conversationHistory = recentMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')
      
      const contextualMessage = conversationHistory 
        ? `Previous conversation:\n${conversationHistory}\n\nCurrent user message: ${message}`
        : message

      const response = await jobAssistant.sendMessage(contextualMessage, conversationHistory)
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Check if user mentioned job application
      if (message.toLowerCase().includes('job') || message.toLowerCase().includes('applying')) {
        setConversationContext(prev => ({ ...prev, isApplyingForJob: true }))
        
        // Ask for job description if not provided
        if (!conversationContext.jobDescription) {
          setTimeout(() => {
            const followUpMessage: ChatMessage = {
              role: 'assistant',
              content: "Are you applying for a specific job? If so, please share the job description so I can help optimize your resume for that position.",
              timestamp: new Date()
            }
            setMessages(prev => [...prev, followUpMessage])
          }, 1000)
        }
      }

      // Check if user provided job description
      if (message.length > 100 && (message.toLowerCase().includes('job') || message.toLowerCase().includes('position') || message.toLowerCase().includes('role'))) {
        setConversationContext(prev => ({ ...prev, jobDescription: message }))
        
        // If we have both resume and job description, offer optimization
        if (conversationContext.resumeText) {
          setTimeout(() => {
            const optimizationMessage: ChatMessage = {
              role: 'assistant',
              content: "I can now compare your resume with this job description and provide optimization suggestions. Would you like me to analyze the match?",
              timestamp: new Date()
            }
            setMessages(prev => [...prev, optimizationMessage])
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC/DOCX file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simulate file reading (in a real app, you'd use a PDF/DOC parser)
      const fileContent = await readFileContent(file)
      
      const userMessage: ChatMessage = {
        role: 'user',
        content: `I've uploaded my resume/CV: ${file.name}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])

      // Store resume text in context
      setConversationContext(prev => ({ ...prev, resumeText: fileContent }))

      // Analyze resume for ATS compatibility
      const atsResponse = await fetch('/api/ai/resume-ats-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: fileContent
        }),
      })

      const atsData = await atsResponse.json()

      if (!atsResponse.ok) {
        throw new Error(atsData.error || 'Failed to analyze resume ATS')
      }

      // Store ATS score in context
      setConversationContext(prev => ({ ...prev, atsScore: atsData.atsScore }))

      // Create detailed ATS breakdown message
      const breakdownText = Object.entries(atsData.breakdown)
        .map(([category, data]: [string, any]) => {
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
          return `${categoryName}: ${data.score}/${data.maxScore} - ${data.feedback}`
        })
        .join('\n')

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I've analyzed your resume for Software Engineer role compatibility.

ATS Score: ${atsData.atsScore}/100

Detailed Breakdown:
${breakdownText}

Overall Feedback: ${atsData.feedback}

Key Strengths:
${atsData.strengths.map((s: string) => `${s}`).join('\n')}

Areas for Improvement:
${atsData.areasForImprovement.map((a: string) => `${a}`).join('\n')}

Top Suggestions:
${atsData.suggestions.slice(0, 3).map((s: string) => `${s}`).join('\n')}

Are you applying for a specific job? I can help optimize your resume for that role.`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      toast({
        title: "Resume analyzed!",
        description: `ATS Score: ${atsData.atsScore}/100 - ${atsData.feedback.split('.')[0]}`,
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        // For now, we'll use a simple text extraction
        // In a real app, you'd use proper PDF/DOC parsers
        resolve(content || 'Document content extracted')
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const handleQuickAction = async (action: string, context: string = "") => {
    const message = `${action}${context ? `: ${context}` : ""}`
    await handleSendMessage(message)
  }

  const quickActions: QuickAction[] = [
    {
      id: "resume-review",
      title: "Resume Review",
      description: "Get feedback on your resume",
      icon: FileText,
      action: () => handleQuickAction("Please help me review my resume and provide feedback on how to improve it")
    },
    {
      id: "interview-prep",
      title: "Interview Prep",
      description: "Practice interview questions",
      icon: Target,
      action: () => handleQuickAction("Help me prepare for interviews. What are some common questions I should expect?")
    },
    {
      id: "job-search",
      title: "Job Search",
      description: "Find internship opportunities",
      icon: Briefcase,
      action: () => handleQuickAction("I'm looking for internship opportunities. What strategies should I use to find and apply for positions?")
    },
    {
      id: "career-advice",
      title: "Career Advice",
      description: "Get career guidance",
      icon: Lightbulb,
      action: () => handleQuickAction("I need career advice. How can I develop my skills and advance in my field?")
    },
    {
      id: "skill-development",
      title: "Skill Development",
      description: "Learn new skills",
      icon: HelpCircle,
      action: () => handleQuickAction("What skills should I focus on developing for my career?")
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Career Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">AI-powered job guidance</p>
              </div>
              <Badge variant="secondary" className="ml-auto">Online</Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-zinc-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gray-600 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analyzing resume...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t">
              <p className="text-xs text-muted-foreground mb-3">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="h-auto p-2 text-xs justify-start"
                    disabled={isLoading || isUploading}
                  >
                    <action.icon className="h-3 w-3 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about resumes, interviews, job search..."
                  className="flex-1"
                  disabled={isLoading || isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="flex-shrink-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              <Button type="submit" size="icon" disabled={isLoading || isUploading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Upload resume/CV for ATS analysis or ask about job applications
            </p>
          </div>
        </div>
      )}
    </>
  )
}
