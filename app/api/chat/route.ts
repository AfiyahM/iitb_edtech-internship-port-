import { type NextRequest, NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const response = await generateChatResponse(message, context)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
