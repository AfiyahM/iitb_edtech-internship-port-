import { NextRequest, NextResponse } from 'next/server'
import { jobAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { fileContent, fileType, fileName } = await request.json()

    if (!fileContent) {
      return NextResponse.json(
        { error: 'File content is required' },
        { status: 400 }
      )
    }

    const analysis = await jobAssistant.analyzeDocument(fileContent, fileType)

    return NextResponse.json({
      success: true,
      analysis: analysis.message,
      confidence: analysis.confidence,
      fileName: fileName,
    })
  } catch (error) {
    console.error('Document analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    )
  }
} 