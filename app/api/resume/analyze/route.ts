import { type NextRequest, NextResponse } from "next/server"
import { analyzeResume } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, targetRole } = await request.json()

    if (!resumeContent || !targetRole) {
      return NextResponse.json({ error: "Resume content and target role are required" }, { status: 400 })
    }

    const analysis = await analyzeResume(resumeContent, targetRole)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Resume analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
