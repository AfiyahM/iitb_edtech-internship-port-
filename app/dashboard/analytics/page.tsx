"use client"

import { useState } from "react"
import DashboardLayout  from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Clock,
  Award,
  Users,
  Briefcase,
  MessageSquare,
  BookOpen,
  Star,
  Activity,
  Zap,
  Eye,
  Download,
} from "lucide-react"

interface AnalyticsData {
  overview: {
    totalApplications: number
    responseRate: number
    interviewInvites: number
    averageScore: number
    studyHours: number
    skillsLearned: number
  }
  trends: {
    applications: Array<{ month: string; count: number }>
    skills: Array<{ skill: string; progress: number; change: number }>
    interviews: Array<{ date: string; score: number; type: string }>
  }
  goals: {
    weekly: { target: number; completed: number; type: string }
    monthly: { target: number; completed: number; type: string }
    streak: number
  }
}

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalApplications: 24,
      responseRate: 67,
      interviewInvites: 8,
      averageScore: 8.2,
      studyHours: 45,
      skillsLearned: 12,
    },
    trends: {
      applications: [
        { month: "Jan", count: 5 },
        { month: "Feb", count: 8 },
        { month: "Mar", count: 11 },
      ],
      skills: [
        { skill: "React", progress: 85, change: 15 },
        { skill: "Node.js", progress: 72, change: 8 },
        { skill: "Python", progress: 68, change: -2 },
        { skill: "TypeScript", progress: 91, change: 23 },
      ],
      interviews: [
        { date: "2024-01-15", score: 8.5, type: "Technical" },
        { date: "2024-01-10", score: 7.8, type: "Behavioral" },
        { date: "2024-01-05", score: 8.9, type: "Technical" },
      ],
    },
    goals: {
      weekly: { target: 5, completed: 3, type: "applications" },
      monthly: { target: 20, completed: 14, type: "applications" },
      streak: 7,
    },
  })

  const refreshData = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Data refreshed",
        description: "Analytics data has been updated with the latest information.",
      })
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    toast({
      title: "Export started",
      description: "Your analytics report is being generated and will be downloaded shortly.",
    })
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp
    if (change < 0) return TrendingDown
    return Activity
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and performance insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={refreshData} disabled={isLoading}>
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalApplications}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.overview.responseRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.overview.interviewInvites}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold text-orange-600">{analyticsData.overview.averageScore}/10</p>
                </div>
                <Star className="h-8 w-8 text-orange-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold text-indigo-600">{analyticsData.overview.studyHours}h</p>
                </div>
                <Clock className="h-8 w-8 text-indigo-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills Learned</p>
                  <p className="text-2xl font-bold text-teal-600">{analyticsData.overview.skillsLearned}</p>
                </div>
                <BookOpen className="h-8 w-8 text-teal-600 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="skills">Skills Progress</TabsTrigger>
            <TabsTrigger value="goals">Goals & Streaks</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Application Trends
                  </CardTitle>
                  <CardDescription>Monthly application activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.applications.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(item.count / 15) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Interview Performance
                  </CardTitle>
                  <CardDescription>Recent interview scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.interviews.map((interview, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{interview.type} Interview</p>
                          <p className="text-sm text-muted-foreground">{interview.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{interview.score}/10</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(interview.score / 2)
                                    ? "fill-purple-400 text-purple-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Weekly Activity Heatmap
                </CardTitle>
                <CardDescription>Your activity pattern over the past weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 28 }, (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        Math.random() > 0.3 ? `bg-green-${Math.floor(Math.random() * 4 + 1)}00` : "bg-gray-100"
                      }`}
                      title={`Activity level: ${Math.floor(Math.random() * 10)}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Skills Progress Tracking
                </CardTitle>
                <CardDescription>Monitor your skill development over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.trends.skills.map((skill, index) => {
                    const ChangeIcon = getChangeIcon(skill.change)
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                            <div className={`flex items-center gap-1 ${getChangeColor(skill.change)}`}>
                              <ChangeIcon className="h-3 w-3" />
                              <span className="text-xs">{Math.abs(skill.change)}%</span>
                            </div>
                          </div>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Skill Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { skill: "GraphQL", demand: "High", match: 85 },
                    { skill: "Docker", demand: "Medium", match: 72 },
                    { skill: "AWS", demand: "High", match: 68 },
                  ].map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{rec.skill}</p>
                        <p className="text-sm text-muted-foreground">Market demand: {rec.demand}</p>
                      </div>
                      <Badge variant="outline">{rec.match}% match</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Skill Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { cert: "React Developer", progress: 80, nextMilestone: "Complete 2 more projects" },
                    { cert: "Node.js Expert", progress: 60, nextMilestone: "Pass advanced assessment" },
                    { cert: "Full Stack Developer", progress: 45, nextMilestone: "Complete backend modules" },
                  ].map((cert, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cert.cert}</span>
                        <span className="text-sm text-muted-foreground">{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{cert.nextMilestone}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Applications this week</span>
                      <span className="text-sm text-muted-foreground">
                        {analyticsData.goals.weekly.completed}/{analyticsData.goals.weekly.target}
                      </span>
                    </div>
                    <Progress
                      value={(analyticsData.goals.weekly.completed / analyticsData.goals.weekly.target) * 100}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{analyticsData.goals.weekly.completed}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {analyticsData.goals.weekly.target - analyticsData.goals.weekly.completed}
                      </div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.round((analyticsData.goals.weekly.completed / analyticsData.goals.weekly.target) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Monthly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Applications this month</span>
                      <span className="text-sm text-muted-foreground">
                        {analyticsData.goals.monthly.completed}/{analyticsData.goals.monthly.target}
                      </span>
                    </div>
                    <Progress
                      value={(analyticsData.goals.monthly.completed / analyticsData.goals.monthly.target) * 100}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{analyticsData.goals.monthly.completed}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {analyticsData.goals.monthly.target - analyticsData.goals.monthly.completed}
                      </div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round((analyticsData.goals.monthly.completed / analyticsData.goals.monthly.target) * 100)}
                        %
                      </div>
                      <div className="text-xs text-muted-foreground">Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Zap className="h-5 w-5" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{analyticsData.goals.streak}</div>
                  <div className="text-sm text-muted-foreground mb-4">Days of consistent activity</div>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          i < analyticsData.goals.streak ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    type: "success",
                    title: "Strong Interview Performance",
                    description:
                      "Your interview scores have improved by 15% this month. Keep practicing technical questions.",
                    action: "Continue Mock Interviews",
                  },
                  {
                    type: "warning",
                    title: "Application Response Rate",
                    description:
                      "Your response rate is below average. Consider improving your resume and cover letters.",
                    action: "Optimize Resume",
                  },
                  {
                    type: "info",
                    title: "Skill Gap Analysis",
                    description:
                      "Based on your target roles, consider learning GraphQL and Docker to increase your match rate.",
                    action: "Start Learning Path",
                  },
                  {
                    type: "success",
                    title: "Consistent Learning",
                    description:
                      "You've maintained a 7-day learning streak! This consistency will help you reach your goals faster.",
                    action: "Keep It Up",
                  },
                ].map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === "success"
                        ? "bg-green-50 border-green-500"
                        : insight.type === "warning"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <h4 className="font-medium mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <Button size="sm" variant="outline">
                      {insight.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Peer Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { metric: "Applications", you: 24, average: 18, percentile: 75 },
                    { metric: "Response Rate", you: 67, average: 45, percentile: 85 },
                    { metric: "Interview Score", you: 8.2, average: 7.1, percentile: 80 },
                  ].map((comp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{comp.metric}</span>
                        <Badge variant="outline">{comp.percentile}th percentile</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          You: <strong>{comp.you}</strong>
                        </span>
                        <span className="text-muted-foreground">Avg: {comp.average}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Success Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Interview Success Rate</span>
                      <span className="text-sm font-bold text-green-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offer Probability</span>
                      <span className="text-sm font-bold text-blue-600">72%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Goal Achievement</span>
                      <span className="text-sm font-bold text-purple-600">90%</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Predictions based on your current performance and historical data from similar profiles.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
