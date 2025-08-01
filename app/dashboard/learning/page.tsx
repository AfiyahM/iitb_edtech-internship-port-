"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Code,
  Palette,
  BarChart,
  Briefcase,
  Star,
  Lock,
  Users,
  TrendingUp,
  Zap,
  FileText,
  Video,
  PenTool,
  Loader2,
  Plus,
} from "lucide-react"

interface LearningPath {
  id: number
  title: string
  description: string
  icon: any
  progress: number
  modules: number
  completedModules: number
  estimatedTime: string
  skills: string[]
  color: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  enrolled: boolean
  rating: number
  students: number
}

interface Module {
  id: number
  title: string
  description: string
  duration: string
  completed: boolean
  type: "video" | "hands-on" | "reading" | "quiz" | "project"
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  locked: boolean
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  color: string
  earned: boolean
  progress?: number
  requirement?: string
}

export default function LearningPage() {
  const { toast } = useToast()
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [studyStreak, setStudyStreak] = useState(7)
  const [totalPoints, setTotalPoints] = useState(2450)
  const [weeklyGoal, setWeeklyGoal] = useState({ target: 5, completed: 3 })

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: 1,
      title: "Software Engineering",
      description: "Master full-stack development with modern technologies",
      icon: Code,
      progress: 67,
      modules: 12,
      completedModules: 8,
      estimatedTime: "8 weeks",
      skills: ["React", "Node.js", "Python", "SQL", "Git"],
      color: "bg-blue-500",
      difficulty: "Intermediate",
      enrolled: true,
      rating: 4.8,
      students: 1250,
    },
    {
      id: 2,
      title: "Product Design",
      description: "Learn UX/UI design principles and tools",
      icon: Palette,
      progress: 23,
      modules: 10,
      completedModules: 2,
      estimatedTime: "6 weeks",
      skills: ["Figma", "Sketch", "Prototyping", "User Research"],
      color: "bg-purple-500",
      difficulty: "Beginner",
      enrolled: true,
      rating: 4.6,
      students: 890,
    },
    {
      id: 3,
      title: "Data Science",
      description: "Analyze data and build machine learning models",
      icon: BarChart,
      progress: 0,
      modules: 14,
      completedModules: 0,
      estimatedTime: "10 weeks",
      skills: ["Python", "SQL", "Machine Learning", "Statistics"],
      color: "bg-green-500",
      difficulty: "Advanced",
      enrolled: false,
      rating: 4.9,
      students: 2100,
    },
    {
      id: 4,
      title: "Business Development",
      description: "Develop business strategy and market analysis skills",
      icon: Briefcase,
      progress: 0,
      modules: 8,
      completedModules: 0,
      estimatedTime: "5 weeks",
      skills: ["Strategy", "Analytics", "Communication", "Sales"],
      color: "bg-orange-500",
      difficulty: "Beginner",
      enrolled: false,
      rating: 4.4,
      students: 650,
    },
  ])

  const [currentModules, setCurrentModules] = useState<Module[]>([
    {
      id: 1,
      title: "Advanced React Patterns",
      description: "Learn hooks, context, and performance optimization",
      duration: "45 min",
      completed: false,
      type: "video",
      difficulty: "Medium",
      points: 150,
      locked: false,
    },
    {
      id: 2,
      title: "Building REST APIs",
      description: "Create scalable backend services with Node.js",
      duration: "60 min",
      completed: true,
      type: "hands-on",
      difficulty: "Medium",
      points: 200,
      locked: false,
    },
    {
      id: 3,
      title: "Database Design Principles",
      description: "Master SQL and database optimization",
      duration: "30 min",
      completed: true,
      type: "reading",
      difficulty: "Easy",
      points: 100,
      locked: false,
    },
    {
      id: 4,
      title: "Authentication & Security",
      description: "Implement secure user authentication systems",
      duration: "50 min",
      completed: false,
      type: "project",
      difficulty: "Hard",
      points: 250,
      locked: false,
    },
    {
      id: 5,
      title: "Advanced System Design",
      description: "Design scalable distributed systems",
      duration: "90 min",
      completed: false,
      type: "video",
      difficulty: "Hard",
      points: 300,
      locked: true,
    },
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Completed your first learning module",
      icon: Trophy,
      color: "text-yellow-600",
      earned: true,
    },
    {
      id: 2,
      title: "Code Warrior",
      description: "Completed 5 coding challenges",
      icon: Code,
      color: "text-blue-600",
      earned: true,
    },
    {
      id: 3,
      title: "Goal Achiever",
      description: "Reached 50% completion in a learning path",
      icon: Target,
      color: "text-green-600",
      earned: true,
    },
    {
      id: 4,
      title: "Knowledge Master",
      description: "Complete an entire learning path",
      icon: BookOpen,
      color: "text-gray-400",
      earned: false,
      progress: 67,
      requirement: "Complete Software Engineering path",
    },
    {
      id: 5,
      title: "Speed Learner",
      description: "Complete 3 modules in one day",
      icon: Zap,
      color: "text-gray-400",
      earned: false,
      progress: 33,
      requirement: "Complete 2 more modules today",
    },
    {
      id: 6,
      title: "Multi-Path Explorer",
      description: "Start learning paths in 3 different fields",
      icon: Target,
      color: "text-gray-400",
      earned: false,
      progress: 66,
      requirement: "Enroll in 1 more path",
    },
  ])

  useEffect(() => {
    if (learningPaths.length > 0) {
      setSelectedPath(learningPaths.find((path) => path.enrolled) || learningPaths[0])
    }
  }, [learningPaths])

  const enrollInPath = async (pathId: number) => {
    setIsEnrolling(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setLearningPaths((prev) => prev.map((path) => (path.id === pathId ? { ...path, enrolled: true } : path)))

      toast({
        title: "Enrolled successfully!",
        description: "You can now start your learning journey.",
      })
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  const startModule = async (moduleId: number) => {
    const module = currentModules.find((m) => m.id === moduleId)
    if (!module || module.locked) return

    try {
      toast({
        title: "Module started!",
        description: `Starting "${module.title}". Good luck!`,
      })

      // Simulate module completion after some time
      setTimeout(() => {
        setCurrentModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, completed: true } : m)))

        setTotalPoints((prev) => prev + module.points)

        toast({
          title: "Module completed!",
          description: `You earned ${module.points} points!`,
        })
      }, 3000)
    } catch (error) {
      toast({
        title: "Failed to start module",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video
      case "hands-on":
        return Code
      case "reading":
        return FileText
      case "quiz":
        return PenTool
      case "project":
        return Briefcase
      default:
        return BookOpen
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Learning Paths</h1>
            <p className="text-muted-foreground">Personalized learning journeys to achieve your career goals</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{studyStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              Weekly Learning Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Complete {weeklyGoal.target} modules this week</span>
              <span className="text-sm text-muted-foreground">
                {weeklyGoal.completed}/{weeklyGoal.target}
              </span>
            </div>
            <Progress value={(weeklyGoal.completed / weeklyGoal.target) * 100} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {weeklyGoal.target - weeklyGoal.completed} modules remaining to reach your goal
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="paths" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="current">Current Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="paths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <Card
                  key={path.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedPath?.id === path.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedPath(path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${path.color} text-white`}>
                        <path.icon className="h-6 w-6" />
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
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {path.completedModules}/{path.modules} modules
                      </span>
                    </div>
                    <Progress value={path.progress} />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{path.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{path.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{path.students}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
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
                        path.progress > 0 ? (
                          "Continue Learning"
                        ) : (
                          "Start Learning"
                        )
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current" className="space-y-6">
            {selectedPath && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedPath.icon className={`h-5 w-5 ${selectedPath.color.replace("bg-", "text-")}`} />
                    {selectedPath.title} Path
                  </CardTitle>
                  <CardDescription>
                    Module {selectedPath.completedModules + 1} of {selectedPath.modules} • {selectedPath.progress}%
                    Complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={selectedPath.progress} className="mb-4" />
                  <div className="text-sm text-muted-foreground mb-4">
                    You're making great progress! Complete {selectedPath.modules - selectedPath.completedModules} more
                    modules to finish this path.
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Module: Backend Development</h3>
              {currentModules.map((module) => {
                const ModuleIcon = getModuleIcon(module.type)
                return (
                  <Card key={module.id} className={module.locked ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              module.completed
                                ? "bg-green-100 text-green-600"
                                : module.locked
                                  ? "bg-gray-100 text-gray-400"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {module.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : module.locked ? (
                              <Lock className="h-5 w-5" />
                            ) : (
                              <ModuleIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{module.title}</h4>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {module.type}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
                                {module.difficulty}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.duration}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {module.points} points
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={module.completed ? "outline" : "default"}
                          disabled={module.completed || module.locked}
                          onClick={() => startModule(module.id)}
                        >
                          {module.completed ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completed
                            </>
                          ) : module.locked ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Locked
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={
                    achievement.earned
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                      : "opacity-75"
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                      }`}
                    >
                      <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

                    {achievement.earned ? (
                      <Badge className="bg-yellow-600 text-white">Earned</Badge>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="outline">Locked</Badge>
                        {achievement.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress value={achievement.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{achievement.requirement}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Weekly Leaderboard
                </CardTitle>
                <CardDescription>Top learners this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Sarah Chen", points: 1250, avatar: "SC", university: "MIT" },
                    {
                      rank: 2,
                      name: "Alex Smith",
                      points: 1180,
                      avatar: "AS",
                      university: "Stanford",
                      isCurrentUser: true,
                    },
                    { rank: 3, name: "Mike Johnson", points: 1050, avatar: "MJ", university: "Berkeley" },
                    { rank: 4, name: "Emma Wilson", points: 980, avatar: "EW", university: "CMU" },
                    { rank: 5, name: "David Lee", points: 920, avatar: "DL", university: "Harvard" },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        user.isCurrentUser ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : user.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : user.rank === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        #{user.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{user.name}</h4>
                          {user.isCurrentUser && <Badge variant="secondary">You</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.university}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{user.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Study Groups
                </CardTitle>
                <CardDescription>Join or create study groups with peers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "React Masters",
                      members: 12,
                      topic: "Advanced React Patterns",
                      nextSession: "Today 3:00 PM",
                    },
                    {
                      name: "System Design Study",
                      members: 8,
                      topic: "Scalable Architecture",
                      nextSession: "Tomorrow 2:00 PM",
                    },
                    {
                      name: "Algorithm Practice",
                      members: 15,
                      topic: "Dynamic Programming",
                      nextSession: "Wed 4:00 PM",
                    },
                  ].map((group, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{group.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{group.topic}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{group.members} members</span>
                        <span>Next: {group.nextSession}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        Join Group
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Study Group
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
