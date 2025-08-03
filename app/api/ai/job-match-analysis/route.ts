import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      )
    }

    const analysis = await jobAssistant.optimizeResumeForJob(resumeText, jobDescription)

    return NextResponse.json({
      success: true,
      matchScore: analysis.matchScore,
      missingSkills: analysis.missingSkills,
      recommendations: analysis.recommendations,
      optimizationSuggestions: analysis.optimizationSuggestions,
    })
  } catch (error) {
    console.error('Job match analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze job match' },
      { status: 500 }
    )
  }
} 