import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { resumeText, targetRole } = await request.json()

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    const analysis = await jobAssistant.analyzeResume(resumeText)

    return NextResponse.json({
      success: true,
      analysis: analysis.message,
      confidence: analysis.confidence,
    })
  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    )
  }
} 