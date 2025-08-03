import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json()

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    const analysis = await jobAssistant.analyzeResumeATS(resumeText)

    return NextResponse.json({
      success: true,
      atsScore: analysis.atsScore,
      feedback: analysis.feedback,
      suggestions: analysis.suggestions,
      optimizationTips: analysis.optimizationTips,
    })
  } catch (error) {
    console.error('Resume ATS analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume ATS compatibility' },
      { status: 500 }
    )
  }
} 