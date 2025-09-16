"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VideoWatchPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const resourceId = searchParams.get('resource')
  const videoId = searchParams.get('video')
  const pathId = searchParams.get('path')
  
  const [watchTime, setWatchTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [resource, setResource] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const watchIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedTime = useRef(0)

  useEffect(() => {
    if (resourceId && pathId) {
      fetchResource()
    }
  }, [resourceId, pathId])

  useEffect(() => {
    // Start watch timer when playing
    if (isPlaying && !isCompleted) {
      watchIntervalRef.current = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1
          
          // Save progress every 30 seconds
          if (newTime - lastSavedTime.current >= 30) {
            updateProgress(newTime, false)
            lastSavedTime.current = newTime
          }
          
          // Auto-complete after 80% of estimated duration (12 minutes of 15)
          if (newTime >= 720 && !isCompleted) {
            setIsCompleted(true)
            markCompleted(newTime)
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (watchIntervalRef.current) {
        clearInterval(watchIntervalRef.current)
      }
    }

    return () => {
      if (watchIntervalRef.current) {
        clearInterval(watchIntervalRef.current)
      }
    }
  }, [isPlaying, isCompleted])

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/learning-paths/${pathId}/resources`)
      const resources = await response.json()
      const currentResource = resources.find((r: any) => r.video_id === videoId)
      
      if (currentResource) {
        setResource(currentResource)
        setIsCompleted(currentResource.completed)
        setWatchTime(currentResource.watchTime || 0)
      }
    } catch (error) {
      console.error('Failed to fetch resource:', error)
    }
  }

  const updateProgress = async (time: number, completed: boolean) => {
    if (!resource || !pathId) return
    
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          learningPathId: pathId,
          completed,
          watchTime: time,
          lastPosition: time
        })
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const markCompleted = async (time: number) => {
    if (!resource || !pathId) return
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          learningPathId: pathId,
          completed: true,
          watchTime: time
        })
      })
      
      if (response.ok) {
        toast({
          title: "🎉 Video Completed!",
          description: `Great job! You earned 100 points!`,
        })
        setIsCompleted(true)
      }
    } catch (error) {
      console.error('Failed to mark completed:', error)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const progressPercent = Math.min((watchTime / 900) * 100, 100)

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/learning')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video w-full relative">
                  {videoId && (
                    <>
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                        title={resource?.title || "Learning Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-t-lg"
                        onLoad={() => setIsPlaying(true)}
                      />
                      
                      <div className="absolute bottom-4 left-4">
                        <Button
                          onClick={togglePlayPause}
                          variant="secondary"
                          size="sm"
                          className="bg-black/50 hover:bg-black/70 text-white"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{resource?.title}</h1>
                      <p className="text-muted-foreground">{resource?.description}</p>
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Watch Progress</h3>
                <Progress value={progressPercent} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.floor(watchTime / 60)}:{String(watchTime % 60).padStart(2, '0')} watched
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Learning Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Points to earn:</span>
                    <span className="font-medium">100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">~15 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isCompleted && (
              <Button 
                onClick={() => markCompleted(watchTime)}
                className="w-full"
                variant="default"
              >
                Mark as Complete
              </Button>
            )}
            
            {isCompleted && (
              <Button 
                onClick={() => router.push('/dashboard/learning')}
                className="w-full"
                variant="default"
              >
                Continue Learning
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
