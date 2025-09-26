import { NextResponse } from 'next/server'
import { getStaticLearningPaths } from '@/lib/static-learning-data'

export async function GET() {
  try {
    // Return static learning paths data without authentication
    const staticPaths = getStaticLearningPaths()
    
    const formattedPaths = staticPaths.map((path) => ({
      id: path.id,
      title: path.title,
      description: path.description,
      category: path.category,
      difficulty: path.difficulty,
      estimatedTime: path.estimatedTime,
      skills: path.skills,
      color: path.color,
      rating: path.rating,
      students: path.students,
      instructor: path.instructor,
      enrolled: false, // Always false since no enrollment tracking
      completed: false,
      totalResources: path.totalResources,
      completedResources: 0,
      progress: 0
    }))

    return NextResponse.json(formattedPaths, { status: 200 })

  } catch (error) {
    console.error('[learning-paths] error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
