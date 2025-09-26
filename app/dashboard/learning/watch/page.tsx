"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function VideoWatchPageContent() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const resourceId = searchParams.get('resource')
  const videoId = searchParams.get('video')
  const pathId = searchParams.get('path')
  
  const [resource, setResource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (resourceId && pathId) {
      fetchResource()
    }
  }, [resourceId, pathId])

  const fetchResource = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/learning-paths/${pathId}/resources`)
      const resources = await response.json()
      const currentResource = resources.find((r: any) => r.video_id === videoId)
      
      if (currentResource) {
        setResource(currentResource)
      } else {
        toast({
          title: "Video not found",
          description: "The requested video could not be found.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to fetch resource:', error)
      toast({
        title: "Error",
        description: "Failed to load video information.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
                  {videoId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`}
                      title={resource?.title || "Learning Video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 rounded-t-lg">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Video not available</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold mb-2">{resource?.title || "Learning Video"}</h1>
                    <p className="text-muted-foreground">{resource?.description || "Watch and learn from this educational video."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Video Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">~{Math.ceil((resource?.duration || 900) / 60)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span className="font-medium">{resource?.points || 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Learning Tips</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Take notes while watching</p>
                  <p>• Pause to practice concepts</p>
                  <p>• Rewatch sections as needed</p>
                  <p>• Apply what you learn</p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={() => router.push('/dashboard/learning')}
              className="w-full"
              variant="default"
            >
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function VideoWatchPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <VideoWatchPageContent />
    </Suspense>
  )
}
