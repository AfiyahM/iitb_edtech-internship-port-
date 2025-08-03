import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, difficulty = 'medium' } = await request.json()

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const questions = await jobAssistant.generateInterviewQuestions(jobTitle, company)

    return NextResponse.json({
      success: true,
      questions: questions.message,
      confidence: questions.confidence,
    })
  } catch (error) {
    console.error('Interview questions error:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview questions' },
      { status: 500 }
    )
  }
} 