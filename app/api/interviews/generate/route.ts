import { type NextRequest, NextResponse } from "next/server"
import { generateInterviewQuestions } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { type, role, difficulty } = await request.json()

    if (!type || !role || !difficulty) {
      return NextResponse.json({ error: "Type, role, and difficulty are required" }, { status: 400 })
    }

    const questions = await generateInterviewQuestions(type, role, difficulty)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Interview generation error:", error)
    return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 })
  }
}
