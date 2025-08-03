import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { topic, context } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const advice = await jobAssistant.provideCareerAdvice(topic, context)

    return NextResponse.json({
      success: true,
      advice: advice.message,
      confidence: advice.confidence,
    })
  } catch (error) {
    console.error('Career advice error:', error)
    return NextResponse.json(
      { error: 'Failed to provide career advice' },
      { status: 500 }
    )
  }
} 