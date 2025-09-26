"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen,
  Play,
  Clock,
  Video,
  Loader2,
  PlayCircle,
  Star
} from "lucide-react"

interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  skills: string[]
  color: string
  rating: number
  students: number
  totalResources: number
  instructor: string
}

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


export default function LearningPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [currentResources, setCurrentResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchLearningPaths()
  }, [])

  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true)
      console.log('📚 Fetching learning paths...')
      
      const response = await fetch('/api/learning-paths')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setLearningPaths(data)
        setSelectedPath(data[0] || null)
        console.log('✅ Learning paths loaded:', data.length)
      } else {
        setLearningPaths([])
      }
    } catch (error) {
      console.error('❌ Failed to fetch learning paths:', error)
      setLearningPaths([])
      toast({
        title: "Error",
        description: "Failed to load learning paths",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }


  const fetchPathResources = async (pathId: string) => {
    try {
      const response = await fetch(`/api/learning-paths/${pathId}/resources`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setCurrentResources(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    }
  }


  const startVideo = (resource: Resource, pathId: string) => {
    const videoId = resource.video_id
    const resourceId = resource.id
    router.push(`/dashboard/learning/watch?resource=${resourceId}&video=${videoId}&path=${pathId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600 bg-green-100"
      case "Intermediate": return "text-yellow-600 bg-yellow-100"
      case "Advanced": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }


  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Learning Paths</h1>
            <p className="text-muted-foreground">Master new skills with curated learning paths - No enrollment required!</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="paths" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paths">All Learning Paths</TabsTrigger>
            <TabsTrigger value="current">Course Content</TabsTrigger>
          </TabsList>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading learning paths...</span>
              </div>
            ) : (
              <>
                {learningPaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {learningPaths.map((path) => (
                      <Card
                        key={path.id}
                        className="hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => {
                          setSelectedPath(path)
                          fetchPathResources(path.id)
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${path.color} text-white group-hover:scale-105 transition-transform`}>
                              <Video className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{path.title}</CardTitle>
                                <Badge variant="outline">Free Access</Badge>
                              </div>
                              <CardDescription>{path.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <span>{path.totalResources} videos</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{path.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{path.rating}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                                {path.difficulty}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {path.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {path.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{path.skills.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPath(path)
                              fetchPathResources(path.id)
                            }}
                          >
                            Start Learning
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">No Learning Paths Found</h3>
                    <p className="text-gray-600 mb-4">
                      It looks like your learning paths haven't been loaded yet.
                    </p>
                    <Button onClick={() => fetchLearningPaths()}>
                      Refresh Page
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Course Content Tab */}
          <TabsContent value="current" className="space-y-6">
            {selectedPath ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-500" />
                      {selectedPath.title}
                      <Badge variant="default">Free Access</Badge>
                    </CardTitle>
                    <CardDescription>
                      {selectedPath.totalResources} videos available • {selectedPath.estimatedTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Start watching videos to learn {selectedPath.skills.join(", ")}. No enrollment required!
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Videos</h3>
                  {currentResources.map((resource, index) => (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-2 rounded-full bg-blue-500">
                              <PlayCircle className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{index + 1}. {resource.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {resource.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  ~{Math.ceil(resource.duration / 60)} min
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  {resource.points} points
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startVideo(resource, selectedPath.id)}
                              variant="default"
                              size="sm"
                            >
                              Watch Now
                              <Play className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Learning Path</h3>
                  <p className="text-muted-foreground">Choose a learning path to see available videos</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  )
}
