"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Bot, Users, Play, Calendar, Star, TrendingUp, Video, Loader2 } from "lucide-react"

const mockInterviews = [
  {
    id: 1,
    type: "Technical",
    company: "Google Style",
    duration: "45 min",
    difficulty: "Medium",
    topics: ["Data Structures", "Algorithms", "System Design"],
    lastScore: 8.2,
    attempts: 3,
  },
  {
    id: 2,
    type: "Behavioral",
    company: "Meta Style",
    duration: "30 min",
    difficulty: "Easy",
    topics: ["Leadership", "Teamwork", "Problem Solving"],
    lastScore: 7.8,
    attempts: 2,
  },
  {
    id: 3,
    type: "System Design",
    company: "Netflix Style",
    duration: "60 min",
    difficulty: "Hard",
    topics: ["Scalability", "Architecture", "Trade-offs"],
    lastScore: null,
    attempts: 0,
  },
]

const peerSessions = [
  {
    id: 1,
    partner: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "MIT",
    major: "Computer Science",
    rating: 4.9,
    scheduledTime: "2024-01-15T14:00:00",
    type: "Technical Interview",
  },
  {
    id: 2,
    partner: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    university: "Stanford",
    major: "Software Engineering",
    rating: 4.7,
    scheduledTime: "2024-01-16T10:00:00",
    type: "Behavioral Interview",
  },
]

const recentSessions = [
  {
    id: 1,
    type: "AI Mock Interview",
    company: "Google Style Technical",
    date: "2024-01-10",
    score: 8.2,
    feedback: "Strong problem-solving approach. Consider optimizing time complexity.",
    duration: "42 min",
  },
  {
    id: 2,
    type: "Peer Interview",
    partner: "Emma Wilson",
    date: "2024-01-08",
    score: 7.5,
    feedback: "Good communication skills. Work on providing more specific examples.",
    duration: "35 min",
  },
]

export default function InterviewsPage() {
  const { toast } = useToast()
  const [selectedInterview, setSelectedInterview] = useState(mockInterviews[0])
  const [isStartingInterview, setIsStartingInterview] = useState(false)
  const [isSchedulingPeer, setIsSchedulingPeer] = useState(false)

  const startInterview = async (interview: (typeof mockInterviews)[0]) => {
    setIsStartingInterview(true)

    try {
      // Generate interview questions
      const response = await fetch("/api/interviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: interview.type.toLowerCase(),
          role: "Software Engineering Intern",
          difficulty: interview.difficulty.toLowerCase(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Interview started!",
          description: `Starting ${interview.type} interview with ${data.questions?.length || 5} questions.`,
        })

        // Update attempts count
        const updatedInterview = { ...interview, attempts: interview.attempts + 1 }
        setSelectedInterview(updatedInterview)
      } else {
        throw new Error("Failed to generate questions")
      }
    } catch (error) {
      toast({
        title: "Failed to start interview",
        description: "Unable to generate interview questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStartingInterview(false)
    }
  }

  const startPracticeMode = (interview: (typeof mockInterviews)[0]) => {
    toast({
      title: "Practice mode started",
      description: `Starting practice session for ${interview.type} interview.`,
    })
  }

  const schedulePeerSession = async () => {
    setIsSchedulingPeer(true)

    try {
      // Simulate API call to find available peers
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Peer session scheduled!",
        description: "You'll receive a notification when a peer is available.",
      })
    } catch (error) {
      toast({
        title: "Scheduling failed",
        description: "Unable to schedule peer session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSchedulingPeer(false)
    }
  }

  const joinPeerSession = (session: (typeof peerSessions)[0]) => {
    toast({
      title: "Joining session",
      description: `Connecting you with ${session.partner} for ${session.type}.`,
    })
  }

  const reschedulePeerSession = (session: (typeof peerSessions)[0]) => {
    toast({
      title: "Rescheduling session",
      description: `Rescheduling your session with ${session.partner}.`,
    })
  }

  const setAvailability = () => {
    toast({
      title: "Availability updated",
      description: "Your availability has been updated for peer interviews.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mock Interviews</h1>
          <p className="text-muted-foreground">
            Practice with AI-powered interviews and peer sessions to build confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2/10</div>
              <p className="text-xs text-muted-foreground">+0.4 from last session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
              <p className="text-xs text-muted-foreground">Over last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ai-mock" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ai-mock">AI Mock Interviews</TabsTrigger>
            <TabsTrigger value="peer-sessions">Peer Sessions</TabsTrigger>
            <TabsTrigger value="history">Interview History</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-mock" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Mock Interviews</h3>
                {mockInterviews.map((interview) => (
                  <Card
                    key={interview.id}
                    className={`cursor-pointer transition-colors ${
                      selectedInterview.id === interview.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{interview.type} Interview</h4>
                        <Badge
                          variant={
                            interview.difficulty === "Easy"
                              ? "secondary"
                              : interview.difficulty === "Medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {interview.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {interview.company} • {interview.duration}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {interview.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {interview.lastScore ? (
                            <span>
                              Last Score: <strong>{interview.lastScore}/10</strong>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not attempted</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{interview.attempts} attempts</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-500" />
                    {selectedInterview.type} Interview Preview
                  </CardTitle>
                  <CardDescription>
                    {selectedInterview.company} • {selectedInterview.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What to Expect:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• AI-generated questions based on real interview patterns</li>
                      <li>• Real-time feedback on your responses</li>
                      <li>• Detailed performance analysis after completion</li>
                      <li>• Personalized improvement suggestions</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterview.topics.map((topic) => (
                        <Badge key={topic} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedInterview.lastScore && (
                    <div>
                      <h4 className="font-medium mb-2">Previous Performance:</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedInterview.lastScore * 10} className="flex-1" />
                        <span className="text-sm font-medium">{selectedInterview.lastScore}/10</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => startInterview(selectedInterview)}
                      disabled={isStartingInterview}
                    >
                      {isStartingInterview ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Interview
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => startPracticeMode(selectedInterview)}>
                      <Video className="h-4 w-4 mr-2" />
                      Practice Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="peer-sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Scheduled Sessions</h3>
                  <Button onClick={schedulePeerSession} disabled={isSchedulingPeer}>
                    {isSchedulingPeer ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule New
                      </>
                    )}
                  </Button>
                </div>

                {peerSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={session.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {session.partner
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{session.partner}</h4>
                          <p className="text-sm text-muted-foreground">
                            {session.university} • {session.major}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{session.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {session.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {new Date(session.scheduledTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(session.scheduledTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1" onClick={() => joinPeerSession(session)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => reschedulePeerSession(session)}>
                          Reschedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Find Interview Partners
                  </CardTitle>
                  <CardDescription>Connect with peers for collaborative interview practice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Benefits of Peer Interviews:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Practice with real people in similar situations</li>
                      <li>• Get diverse perspectives and feedback</li>
                      <li>• Build networking connections</li>
                      <li>• Learn from others' experiences</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={schedulePeerSession} disabled={isSchedulingPeer}>
                      {isSchedulingPeer ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Finding Partners...
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Find Available Partners
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={setAvailability}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Interview Sessions</h3>

              {recentSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{session.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.type === "AI Mock Interview" ? session.company : `with ${session.partner}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{session.score}/10</div>
                        <div className="text-xs text-muted-foreground">{session.duration}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Progress value={session.score * 10} />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="text-sm font-medium mb-1">Feedback:</h5>
                      <p className="text-sm text-muted-foreground">{session.feedback}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
