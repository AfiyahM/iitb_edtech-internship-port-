import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Define the resource type for better TypeScript support
interface Resource {
  id: string
  title: string
  description: string
  video_id: string
  youtube_url: string
  duration: number
  order_index: number
  points: number
}

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      'https://zooismbsebfafvyvcmbu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvb2lzbWJzZWJmYWZ2eXZjbWJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2MTMyOCwiZXhwIjoyMDY2NDM3MzI4fQ.n529MSZ-BfflAqnOCBROyCo0gMRMmJkFQ6nYDQfykTY'
    )
    
    const pathId = params.id
    
    // Get learning path with all its resources
    const { data: pathWithResources, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        resources (
          id,
          title,
          description,
          video_id,
          youtube_url,
          duration,
          order_index,
          points
        )
      `)
      .eq('id', pathId)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!pathWithResources) {
      return NextResponse.json({ error: 'Learning path not found' }, { status: 404 })
    }
    
    // ✅ Fixed: Explicit typing for sort callback parameters
    const sortedResources = (pathWithResources.resources as Resource[])?.sort(
      (a: Resource, b: Resource) => a.order_index - b.order_index
    ) || []
    
    return NextResponse.json({
      ...pathWithResources,
      resources: sortedResources,
      totalResources: sortedResources.length,
      totalVideos: sortedResources.length
    })
    
  } catch (error) {
    // Proper error handling
    if (error instanceof Error) {
      console.error('API Error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error('Unknown error:', error)
      return NextResponse.json({ error: 'Unknown server error' }, { status: 500 })
    }
  }
}
