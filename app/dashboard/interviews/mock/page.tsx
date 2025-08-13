"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { generateInterviewQuestions, evaluateResponse } from "@/lib/gemini"
import {
  Play,
  Mic,
  MicOff,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Loader2,
  Volume2,
  VolumeX,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  question: string
  keyPoints: string[]
  followUp: string[]
  scoringCriteria: string
}

interface Response {
  questionId: number
  answer: string
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

export default function MockInterviewPage() {
  const { toast } = useToast()
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Response[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const interviewConfig = {
    type: "technical" as const,
    role: "Software Engineering Intern",
    difficulty: "medium" as const,
    duration: 45, // minutes
  }

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startInterview = async () => {
    setIsLoading(true)
    try {
      const generatedQuestions = await generateInterviewQuestions(
        interviewConfig.type,
        interviewConfig.role,
        interviewConfig.difficulty,
      )

      const formattedQuestions: Question[] = generatedQuestions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        keyPoints: q.keyPoints || [],
        followUp: q.followUp || [],
        scoringCriteria: q.scoringCriteria || "",
      }))

      setQuestions(formattedQuestions)
      setIsStarted(true)
      setIsTimerRunning(true)

      if (audioEnabled) {
        speakText("Welcome to your mock interview. Let's begin with the first question.")
      }

      toast({
        title: "Interview started!",
        description: `Starting ${interviewConfig.type} interview with ${formattedQuestions.length} questions.`,
      })
    } catch (error) {
      toast({
        title: "Failed to start interview",
        description: "Unable to generate questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = (text: string) => {
    if (!audioEnabled || !window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        // Here you could implement speech-to-text conversion
        console.log("Audio recorded:", audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer before proceeding.",
        variant: "destructive",
      })
      return
    }

    setIsEvaluating(true)
    try {
      const currentQuestion = questions[currentQuestionIndex]
      const evaluation = await evaluateResponse(currentQuestion.question, currentAnswer, interviewConfig.type)

      const response: Response = {
        questionId: currentQuestion.id,
        answer: currentAnswer,
        score: evaluation.score || 0,
        feedback: evaluation.feedback || "",
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
      }

      setResponses((prev) => [...prev, response])
      setCurrentAnswer("")

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        if (audioEnabled) {
          speakText("Next question:")
        }
      } else {
        completeInterview()
      }
    } catch (error) {
      toast({
        title: "Evaluation failed",
        description: "Unable to evaluate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  const completeInterview = () => {
    setIsCompleted(true)
    setIsTimerRunning(false)
    if (audioEnabled) {
      speakText("Interview completed. Great job!")
    }
    toast({
      title: "Interview completed!",
      description: "Your responses have been evaluated. Check your results below.",
    })
  }

  const restartInterview = () => {
    setIsStarted(false)
    setIsCompleted(false)
    setCurrentQuestionIndex(0)
    setQuestions([])
    setResponses([])
    setCurrentAnswer("")
    setTimeElapsed(0)
    setIsTimerRunning(false)
  }

  const calculateOverallScore = () => {
    if (responses.length === 0) return 0
    const totalScore = responses.reduce((sum, response) => sum + response.score, 0)
    return Math.round((totalScore / responses.length) * 10) / 10
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default"
    if (score >= 6) return "secondary"
    return "destructive"
  }

  if (!isStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Mock Interview</h1>
            <p className="text-muted-foreground">
              Practice your interview skills with AI-powered questions and feedback
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Play className="h-6 w-6 text-blue-600" />
                {interviewConfig.type.charAt(0).toUpperCase() + interviewConfig.type.slice(1)} Interview
              </CardTitle>
              <CardDescription>
                {interviewConfig.role} • {interviewConfig.difficulty} difficulty • {interviewConfig.duration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{interviewConfig.duration}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">What to expect:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AI-generated questions based on real interview patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time feedback on your responses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Detailed performance analysis after completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Personalized improvement suggestions
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span className="text-sm">Audio narration</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>

              <Button className="w-full" size="lg" onClick={startInterview} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (isCompleted) {
    const overallScore = calculateOverallScore()

    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
            <p className="text-muted-foreground">Here's your performance summary</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}/10</div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{formatTime(timeElapsed)}</div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{responses.length}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{responses.filter((r) => r.score >= 7).length}</div>
                    <div className="text-sm text-muted-foreground">Strong Answers</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {responses.map((response, index) => (
                  <div key={response.questionId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Badge variant={getScoreBadgeVariant(response.score)}>{response.score}/10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{questions[index]?.question}</p>
                    <div className="space-y-2">
                      {response.strengths.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-600">Strengths:</h5>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {response.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {response.improvements.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-orange-600">Areas for Improvement:</h5>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {response.improvements.map((improvement, i) => (
                              <li key={i}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <Link href="/dashboard/learning">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Continue Learning Path
                    </Link>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={restartInterview}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Another Interview
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <Link href="/dashboard/interviews">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Interviews
                    </Link>
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Performance Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Practice explaining your thought process clearly</li>
                    <li>• Use specific examples from your experience</li>
                    <li>• Ask clarifying questions when needed</li>
                    <li>• Stay calm and think before answering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <p className="text-muted-foreground">{interviewConfig.type} Interview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion?.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={8}
              className="resize-none"
            />

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={isRecording ? stopRecording : startRecording}>
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Input
                    </>
                  )}
                </Button>
                {isRecording && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm">Recording...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {currentQuestionIndex > 0 && (
                  <Button variant="outline" onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button onClick={submitAnswer} disabled={isEvaluating || !currentAnswer.trim()}>
                  {isEvaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Evaluating...
                    </>
                  ) : currentQuestionIndex === questions.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Interview
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Next Question
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tips for this question:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              {currentQuestion?.keyPoints.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
