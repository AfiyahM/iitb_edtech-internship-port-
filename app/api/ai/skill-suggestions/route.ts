import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, experience } = await request.json()

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const suggestions = await jobAssistant.suggestSkills(jobTitle, experience)

    return NextResponse.json({
      success: true,
      suggestions: suggestions.message,
      confidence: suggestions.confidence,
    })
  } catch (error) {
    console.error('Skill suggestions error:', error)
    return NextResponse.json(
      { error: 'Failed to suggest skills' },
      { status: 500 }
    )
  }
} 