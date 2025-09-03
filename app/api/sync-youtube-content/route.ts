import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

export async function POST() {
  try {
    console.log('🚀 Starting YouTube content sync...')
    
    // Run the enhanced Python scraper
    const { stdout, stderr } = await execAsync('python lib/enhanced_youtube_scraper.py', {
      cwd: process.cwd(),
      timeout: 300000 // 5 minutes
    })
    
    if (stderr && !stderr.includes('INFO')) {
      console.error('Scraper stderr:', stderr)
    }
    
    console.log('Scraper completed:', stdout)
    
    // Read the generated JSON file
    const jsonPath = path.join(process.cwd(), 'webscrapper', 'youtube_resources.json')
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    const courses = JSON.parse(jsonData)
    
    // Save to database
  // Import your Supabase credentials from environment variables or a config file
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    let totalVideos = 0
    for (const course of courses) {
      // Create or update learning path
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .upsert({
          title: course.courseTitle,
          description: `Master ${course.courseTitle.toLowerCase()} with curated video tutorials`,
          category: course.courseTitle,
          difficulty: 'Beginner',
          estimated_time: `${Math.ceil(course.videos.length / 7)} weeks`,
          skills: extractSkills(course.courseTitle),
          color: getCategoryColor(course.courseTitle),
          icon: 'Video',
          is_active: true
        })
        .select()
        .single()
      
      if (pathError) {
        console.error('Error creating path:', pathError)
        continue
      }
      
      // Add videos as resources
      for (let i = 0; i < course.videos.length; i++) {
        const video = course.videos[i]
        const { error: resourceError } = await supabase
          .from('resources')
          .upsert({
            learning_path_id: pathData.id,
            title: video.title,
            description: video.description || '',
            video_id: video.videoId,
            youtube_url: video.url,
            duration: 900, // Default 15 minutes
            order_index: i + 1,
            points: 100
          })
        
        if (!resourceError) {
          totalVideos++
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Content synced successfully',
      coursesProcessed: courses.length,
      videosProcessed: totalVideos,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ 
      error: 'Sync failed', 
      details: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)
    }, { status: 500 })
  }
}

function extractSkills(courseTitle: string): string[] {
  const title = courseTitle.toLowerCase()
  const skillMap = {
    'frontend': ['JavaScript', 'React', 'CSS', 'HTML'],
    'backend': ['Node.js', 'Python', 'API', 'Database'],
    'data science': ['Python', 'Machine Learning', 'Statistics'],
    'general programming': ['Programming', 'Problem Solving']
  }
  
  for (const [key, skills] of Object.entries(skillMap)) {
    if (title.includes(key)) {
      return skills
    }
  }
  return ['Programming']
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Frontend Development': 'bg-blue-500',
    'Backend Development': 'bg-green-500', 
    'Data Science': 'bg-purple-500',
    'General Programming': 'bg-gray-500'
  }
  return colors[category] ?? 'bg-gray-500'
}
