import { type NextRequest, NextResponse } from "next/server"
import { jobAssistant } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, targetRole } = await request.json()

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 })
    }

    // Use the comprehensive ATS analysis method for detailed feedback
    const analysis = await jobAssistant.analyzeResumeATS(resumeContent)

    // If target role is provided, also get job-specific optimization
    let jobOptimization = null
    if (targetRole) {
      try {
        // Create a basic job description based on the target role
        const jobDescription = `Software Engineer role focusing on ${targetRole} with requirements for technical skills, problem-solving abilities, and relevant experience.`
        jobOptimization = await jobAssistant.optimizeResumeForJob(resumeContent, jobDescription)
      } catch (error) {
        console.error("Job optimization error:", error)
        // Continue without job optimization if it fails
      }
    }

    return NextResponse.json({
      success: true,
      analysis: {
        atsScore: analysis.atsScore,
        breakdown: analysis.breakdown,
        feedback: analysis.feedback,
        suggestions: analysis.suggestions,
        optimizationTips: analysis.optimizationTips,
        strengths: analysis.strengths,
        areasForImprovement: analysis.areasForImprovement,
        jobOptimization: jobOptimization
      }
    })
  } catch (error) {
    console.error("Resume analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
