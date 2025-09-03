import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // Check when scraper last ran
    const jsonPath = path.join(process.cwd(), 'webscrapper', 'youtube_resources.json')
    const stats = await fs.stat(jsonPath)
    const hoursOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60)
    
    // Read content to get video count
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    const courses = JSON.parse(jsonData)
    const totalVideos = courses.reduce((sum: number, course: { videos: any[] }) => sum + course.videos.length, 0)
    
    return NextResponse.json({
      status: hoursOld < 25 ? 'healthy' : 'stale',
      lastRun: stats.mtime,
      hoursOld: Math.round(hoursOld),
      coursesCount: courses.length,
      videosCount: totalVideos,
      health: {
        scraper: hoursOld < 25 ? '✅' : '⚠️',
        data: totalVideos > 0 ? '✅' : '❌'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    }, { status: 500 })
  }
}
