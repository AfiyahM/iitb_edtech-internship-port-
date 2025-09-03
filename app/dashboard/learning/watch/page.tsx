//C:\iitb\internship-dashboard\app\dashboard\learning\watch\page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VideoWatchPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const resourceId = searchParams.get('resource')
  const videoId = searchParams.get('video')
  
  const [watchTime, setWatchTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [resource, setResource] = useState<any>(null)

  useEffect(() => {
    if (resourceId) {
      fetchResource()
    }
  }, [resourceId])

  useEffect(() => {
    // Track watch time
    const interval = setInterval(() => {
      setWatchTime(prev => {
        const newTime = prev + 1
        
        // Auto-complete after 80% of estimated duration (12 minutes of 15)
        if (newTime >= 720 && !isCompleted) {
          setIsCompleted(true)
          markCompleted(newTime)
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isCompleted])

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`)
      const data = await response.json()
      setResource(data)
    } catch (error) {
      console.error('Failed to fetch resource:', error)
    }
  }

  const markCompleted = async (time: number) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          learningPathId: resource?.learningPathId,
          completed: true,
          watchTime: time
        })
      })
      
      toast({
        title: "🎉 Video Completed!",
        description: "Great job! You earned points!",
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const progressPercent = Math.min((watchTime / 900) * 100, 100) // 15 minutes = 900 seconds

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
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
                <div className="aspect-video w-full">
                  {videoId && (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={resource?.title || "Learning Video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-t-lg"
                    />
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
                </div>
              </CardContent>
            </Card>

            {!isCompleted && (
              <Button 
                onClick={() => {
                  setIsCompleted(true)
                  markCompleted(watchTime)
                }}
                className="w-full"
              >
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
