"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import {
  BookOpen,
  Briefcase,
  FileText,
  MessageSquare,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Bell,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Plus,
  ExternalLink,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  profileStrength: number
  applications: number
  skillProgress: number
  interviewScore: number
  weeklyGoal: number
  completedGoal: number
}

interface RecommendedInternship {
  id: number
  title: string
  company: string
  location: string
  matchScore: number
  description: string
  skills: string[]
  deadline: string
  salary: string
  isNew: boolean
}

interface Activity {
  id: number
  type: "completed" | "applied" | "interview" | "achievement"
  title: string
  description: string
  timestamp: string
  icon: any
  color: string
}

interface Notification {
  id: number
  title: string
  message: string
  type: "success" | "warning" | "info"
  timestamp: string
  read: boolean
}

export default function DashboardPage() {
  const { toast } = useToast()
  const { user, loading } = useUser()

  const [stats, setStats] = useState<DashboardStats>({
    profileStrength: 85,
    applications: 12,
    skillProgress: 67,
    interviewScore: 8.2,
    weeklyGoal: 5,
    completedGoal: 3,
  })

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Interview Invitation",
      message: "Google has invited you for a technical interview",
      type: "success",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Application Deadline",
      message: "Meta internship application closes in 2 days",
      type: "warning",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: 3,
      title: "Skill Assessment Complete",
      message: "Your React.js assessment score: 92%",
      type: "info",
      timestamp: "3 days ago",
      read: true,
    },
  ])

  const [recommendedInternships, setRecommendedInternships] = useState<RecommendedInternship[]>([
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      matchScore: 95,
      description: "Work on cutting-edge projects with the Chrome team...",
      skills: ["React", "TypeScript", "Node.js"],
      deadline: "2024-03-15",
      salary: "$8,000/month",
      isNew: true,
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      matchScore: 88,
      description: "Join the React team and contribute to open source...",
      skills: ["React", "JavaScript", "CSS"],
      deadline: "2024-03-20",
      salary: "$7,500/month",
      isNew: false,
    },
  ])

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: "completed",
      title: "Completed React.js Module 3",
      description: "Advanced Hooks and Context API",
      timestamp: "2 hours ago",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "applied",
      title: "Applied to Microsoft Internship",
      description: "Software Engineering Intern - Seattle",
      timestamp: "1 day ago",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "interview",
      title: "Mock interview completed",
      description: "Technical Interview - Score: 8.2/10",
      timestamp: "2 days ago",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      id: 4,
      type: "achievement",
      title: "Achievement Unlocked",
      description: "Code Warrior - Completed 5 coding challenges",
      timestamp: "3 days ago",
      icon: Award,
      color: "text-yellow-600",
    },
  ])

  const [isLoadingStats, setIsLoadingStats] = useState(false)

  const refreshStats = async () => {
    setIsLoadingStats(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats((prev) => ({
        ...prev,
        profileStrength: Math.min(100, prev.profileStrength + Math.floor(Math.random() * 5)),
        applications: prev.applications + Math.floor(Math.random() * 2),
      }))

      toast({
        title: "Stats updated!",
        description: "Your dashboard has been refreshed with the latest data.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to refresh stats. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingStats(false)
    }
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const applyToInternship = async (internship: RecommendedInternship) => {
    try {
      toast({
        title: "Application submitted!",
        description: `Your application to ${internship.company} has been submitted.`,
      })

      // Update applications count
      setStats((prev) => ({ ...prev, applications: prev.applications + 1 }))

      // Add to activities
      const newActivity: Activity = {
        id: Date.now(),
        type: "applied",
        title: `Applied to ${internship.company}`,
        description: internship.title,
        timestamp: "Just now",
        icon: Briefcase,
        color: "text-blue-600",
      }
      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
    } catch (error) {
      toast({
        title: "Application failed",
        description: "Unable to submit application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {getGreeting()}, {user?.first_name || "there"}! 👋
                </h1>
                <p className="opacity-90 mb-4">
                  You have {recommendedInternships.filter((i) => i.isNew).length} new internship matches and{" "}
                  {unreadNotifications} notifications waiting for you.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/dashboard/search">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Explore Internships
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    asChild
                  >
                    <Link href="/dashboard/interviews/mock">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Target className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Strength</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.profileStrength}%</div>
              <Progress value={stats.profileStrength} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                +5% from last week
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-2 text-blue-600" asChild>
                  <Link href="/dashboard/resume">Improve</Link>
                </Button>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.applications}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-xs text-muted-foreground">3 pending responses</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skill Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.skillProgress}%</div>
              <Progress value={stats.skillProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                React.js learning path
                <Button variant="ghost" size="sm" className="h-auto p-0 ml-2 text-purple-600" asChild>
                  <Link href="/dashboard/learning">Continue</Link>
                </Button>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.interviewScore}/10</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(stats.interviewScore / 2) ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">Last mock interview</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goals Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Weekly Goals
                </CardTitle>
                <CardDescription>Track your progress towards weekly objectives</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={refreshStats} disabled={isLoadingStats}>
                {isLoadingStats ? "Updating..." : "Refresh"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Apply to {stats.weeklyGoal} internships</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completedGoal}/{stats.weeklyGoal}
                </span>
              </div>
              <Progress value={(stats.completedGoal / stats.weeklyGoal) * 100} />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{stats.completedGoal}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{stats.weeklyGoal - stats.completedGoal}</div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round((stats.completedGoal / stats.weeklyGoal) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Recommended Internships */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>AI-curated internships based on your profile</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/search">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedInternships.map((internship) => (
                <div key={internship.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{internship.title}</h3>
                      {internship.isNew && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {internship.matchScore}% Match
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-sm text-muted-foreground">
                      {internship.company} • {internship.location}
                    </p>
                    <p className="text-sm">{internship.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Salary: {internship.salary}</span>
                      <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {internship.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => applyToInternship(internship)}>
                      Apply Now
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/search?id=${internship.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Continue your internship preparation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/resume">
                  <FileText className="h-4 w-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Update Resume</div>
                    <div className="text-xs opacity-70">AI Review Available</div>
                  </div>
                  <Badge className="bg-blue-600">New</Badge>
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/interviews/mock">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Practice Mock Interview</div>
                    <div className="text-xs opacity-70">New Questions Available</div>
                  </div>
                  <Badge variant="secondary">5 New</Badge>
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/learning">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Continue Learning Path</div>
                    <div className="text-xs opacity-70">React.js - Module 4</div>
                  </div>
                  <Badge variant="secondary">{stats.skillProgress}% Complete</Badge>
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/interviews">
                  <Users className="h-4 w-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Schedule Peer Interview</div>
                    <div className="text-xs opacity-70">3 peers available</div>
                  </div>
                  <Badge variant="secondary">3 Available</Badge>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Panel */}
        {unreadNotifications > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Bell className="h-5 w-5" />
                Recent Notifications
                <Badge variant="secondary">{unreadNotifications} New</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications
                .filter((n) => !n.read)
                .slice(0, 3)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "success"
                          ? "bg-green-500"
                          : notification.type === "warning"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                    </div>
                    {notification.type === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    )}
                    {notification.type === "success" && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
