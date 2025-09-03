import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      'https://zooismbsebfafvyvcmbu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvb2lzbWJzZWJmYWZ2eXZjbWJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2MTMyOCwiZXhwIjoyMDY2NDM3MzI4fQ.n529MSZ-BfflAqnOCBROyCo0gMRMmJkFQ6nYDQfykTY'
    )
    
    // Get learning paths with resource counts in one query
    const { data: pathsWithResources, error } = await supabase
      .from('learning_paths')
      .select(`
        id,
        title,
        description,
        category,
        difficulty,
        estimated_time,
        skills,
        color,
        icon,
        instructor,
        rating,
        is_active,
        resources(count)
      `)
      .eq('is_active', true)
    
    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    const formattedPaths = pathsWithResources?.map(path => ({
      id: path.id,
      title: path.title,
      description: path.description || `Master ${path.title} with video tutorials`,
      category: path.category || path.title,
      difficulty: path.difficulty || 'Beginner',
      estimatedTime: path.estimated_time || '4-6 weeks',
      skills: path.skills || [],
      color: path.color || 'bg-blue-500',
      icon: path.icon || 'Video',
      rating: path.rating || 4.5,
      students: Math.floor(Math.random() * 1000) + 500,
      instructor: path.instructor || 'Expert Instructors',
      enrolled: false,
      totalResources: path.resources?.[0]?.count || 0,
      completedResources: 0,
      progress: 0,
      isYouTubeCourse: true
    })) || []
    
    console.log(`✅ Returning ${formattedPaths.length} learning paths`)
    return NextResponse.json(formattedPaths)
    
  } catch (error) {
    console.error('💥 API Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
