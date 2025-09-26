import { NextResponse } from 'next/server'
import { getStaticLearningPath } from '@/lib/static-learning-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get static learning path data
    const learningPath = getStaticLearningPath(id)
    
    if (!learningPath) {
      return NextResponse.json({ error: 'Learning path not found' }, { status: 404 })
    }

    // Return videos as resources without progress tracking
    const resources = learningPath.videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      video_id: video.video_id,
      youtube_url: video.youtube_url,
      duration: video.duration,
      order_index: video.order_index,
      points: video.points,
      completed: false, // Always false since no progress tracking
      watchTime: 0
    }))

    return NextResponse.json(resources)
  } catch (error) {
    console.error('[resources] error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
