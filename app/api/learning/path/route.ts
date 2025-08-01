import { type NextRequest, NextResponse } from "next/server"
import { generateLearningPath } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { careerGoal, currentSkills, targetRole } = await request.json()

    if (!careerGoal || !currentSkills || !targetRole) {
      return NextResponse.json({ error: "Career goal, current skills, and target role are required" }, { status: 400 })
    }

    const learningPath = await generateLearningPath(careerGoal, currentSkills, targetRole)

    return NextResponse.json(learningPath)
  } catch (error) {
    console.error("Learning path generation error:", error)
    return NextResponse.json({ error: "Failed to generate learning path" }, { status: 500 })
  }
}
