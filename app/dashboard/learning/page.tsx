"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/providers/auth-provider'
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Video,
  Loader2,
  ArrowRight,
  PlayCircle,
  Star
} from "lucide-react"
import { supabase } from "@/lib/supabase"

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
  enrolled: boolean
  totalResources: number
  completedResources: number
  progress: number
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
  completed: boolean
  watchTime: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  earned: boolean
  progress: number
}

interface UserStats {
  totalPoints: number
  studyStreak: number
  totalWatchTime: number
  pathsCompleted: number
  videosCompleted: number
}

export default function LearningPage() {
  const { user, loading: authLoading } = useAuth() 
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  // ✅ Proper state management
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authUser, setAuthUser] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [currentResources, setCurrentResources] = useState<Resource[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    studyStreak: 0,
    totalWatchTime: 0,
    pathsCompleted: 0,
    videosCompleted: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [weeklyGoal] = useState({ target: 5, completed: 2 })

  // ✅ Handle hydration properly
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ✅ Authentication state management
   useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔐 Checking authentication status...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          setIsAuthenticated(false)
          setAuthUser(null)
        } else if (session?.user) {
          console.log('✅ User authenticated:', session.user.email)
          setIsAuthenticated(true)
          setAuthUser(session.user)
        } else {
          console.log('❌ No authenticated session')
          setIsAuthenticated(false)
          setAuthUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setAuthUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuthStatus()

    // ✅ Listen for auth changes with cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event)
        
        if (session?.user) {
          setIsAuthenticated(true)
          setAuthUser(session.user)
          console.log('✅ User signed in:', session.user.email)
        } else {
          setIsAuthenticated(false)
          setAuthUser(null)
          console.log('❌ User signed out')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])
   
  // ✅ Fetch data after auth is ready
  useEffect(() => {
    if (!isAuthLoading && isMounted) {
      fetchLearningPaths()
      if (isAuthenticated) {
        fetchUserStats()
        fetchAchievements()
      }
    }
  }, [isAuthLoading, isAuthenticated, isMounted])

  // ✅ Safe data fetching
  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true)
      console.log('📚 Fetching learning paths...')
      
      const response = await fetch('/api/learning-paths', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setLearningPaths(data)
        const enrolledPath = data.find((path: LearningPath) => path.enrolled)
        setSelectedPath(enrolledPath || data[0] || null)
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

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user-stats', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUserStats({
          totalPoints: data.totalPoints || 0,
          studyStreak: data.studyStreak || 0,
          totalWatchTime: data.totalWatchTime || 0,
          pathsCompleted: data.pathsCompleted || 0,
          videosCompleted: data.videosCompleted || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setAchievements(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    }
  }

  const fetchPathResources = async (pathId: string) => {
    try {
      const response = await fetch(`/api/learning-paths/${pathId}/resources`, {
        credentials: 'include'
      })
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

  // ✅ Enrollment with proper auth checks
  const enrollInPath = async (pathId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses.",
        variant: "destructive"
      })
      return
    }

    setIsEnrolling(true)
    try {
      console.log('🔄 Starting enrollment for:', pathId)
      
      const response = await fetch(`/api/learning-paths/${pathId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Enrollment failed')
      }
      
      console.log('✅ Enrollment successful')
      toast({
        title: "🎉 Enrolled Successfully!",
        description: "You can now start learning!",
      })
      
      // Refresh data
      await fetchLearningPaths()
      
    } catch (error) {
      console.error('❌ Enrollment error:', error)
      toast({
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setIsEnrolling(false)
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

  // ✅ Loading state during auth check or hydration
  if (!isMounted || isAuthLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Learning Paths</h1>
            <p className="text-muted-foreground">Master new skills with curated learning paths</p>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userStats.studyStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.pathsCompleted}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          )}
        </div>

        {/* Weekly Goal - only show if authenticated */}
        {isAuthenticated && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Target className="h-5 w-5" />
                Weekly Learning Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Complete {weeklyGoal.target} videos this week</span>
                <span className="text-sm text-muted-foreground">
                  {weeklyGoal.completed}/{weeklyGoal.target}
                </span>
              </div>
              <Progress value={(weeklyGoal.completed / weeklyGoal.target) * 100} className="mb-2" />
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="paths" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paths">All Learning Paths</TabsTrigger>
            <TabsTrigger value="current">My Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                        onClick={() => setSelectedPath(path)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${path.color} text-white group-hover:scale-105 transition-transform`}>
                              <Video className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{path.title}</CardTitle>
                                <Badge variant={path.enrolled ? "default" : "outline"}>
                                  {path.enrolled ? "Enrolled" : "Available"}
                                </Badge>
                              </div>
                              <CardDescription>{path.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {path.enrolled && (
                            <div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>{path.completedResources}/{path.totalResources} videos</span>
                              </div>
                              <Progress value={path.progress} />
                            </div>
                          )}
                          
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
                            variant={path.enrolled ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!path.enrolled) {
                                enrollInPath(path.id)
                              }
                            }}
                            disabled={isEnrolling}
                          >
                            {isEnrolling ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enrolling...
                              </>
                            ) : path.enrolled ? (
                              <>
                                Continue Learning
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            ) : (
                              "Enroll Now"
                            )}
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

          {/* My Progress Tab */}
          <TabsContent value="current" className="space-y-6">
            {selectedPath ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-500" />
                      {selectedPath.title}
                      {selectedPath.enrolled && (
                        <Badge variant="default">Enrolled</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {selectedPath.completedResources}/{selectedPath.totalResources} videos completed • {selectedPath.progress}% Complete
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={selectedPath.progress} className="mb-4" />
                    <div className="text-sm text-muted-foreground">
                      {selectedPath.enrolled 
                        ? `Complete ${selectedPath.totalResources - selectedPath.completedResources} more videos to finish this path.`
                        : "Enroll in this path to start learning."
                      }
                    </div>
                  </CardContent>
                </Card>

                {selectedPath.enrolled && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Learning Resources</h3>
                    {currentResources.map((resource, index) => (
                      <Card key={resource.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`p-2 rounded-full ${
                                resource.completed ? "bg-green-500" : "bg-blue-500"
                              }`}>
                                {resource.completed ? (
                                  <CheckCircle className="h-5 w-5 text-white" />
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{index + 1}. {resource.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {resource.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    ~15 min
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {resource.points || 100} points
                                  </span>
                                  {resource.completed && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                      ✓ Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => startVideo(resource, selectedPath.id)}
                                variant={resource.completed ? "outline" : "default"}
                                size="sm"
                              >
                                {resource.completed ? "Rewatch" : "Watch Now"}
                                <Play className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Learning Path</h3>
                  <p className="text-muted-foreground">Choose a learning path to see your progress and resources</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={achievement.earned 
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" 
                      : "opacity-75"
                    }
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                      }`}>
                        <Trophy className={`h-8 w-8 ${achievement.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      {achievement.earned ? (
                        <Badge className="bg-yellow-600 text-white">Earned!</Badge>
                      ) : (
                        <div className="space-y-2">
                          <Progress value={achievement.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {achievement.progress}% Complete
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground">Complete videos and courses to earn achievements!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
