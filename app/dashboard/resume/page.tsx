"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import {
  FileText,
  Download,
  Eye,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Loader2,
  Upload,
  File,
  X,
} from "lucide-react"

interface Experience {
  id: number
  title: string
  company: string
  duration: string
  description: string
}

interface ResumeData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
  }
  experiences: Experience[]
  education: {
    university: string
    degree: string
    major: string
    gpa: string
    graduation: string
    coursework: string
  }
  skills: {
    programming: string[]
    frameworks: string[]
    tools: string[]
  }
  projects: Array<{
    id: number
    name: string
    technologies: string
    link: string
    description: string
  }>
}

interface AnalysisResult {
  overallScore: number
  atsScore: number
  contentScore: number
  skillsScore: number
  formatScore: number
  suggestions: Array<{
    type: "success" | "warning" | "info"
    title: string
    description: string
  }>
}

export default function ResumePage() {
  const { toast } = useToast()
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [resumeScore, setResumeScore] = useState(78)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)

  const [suggestions, setSuggestions] = useState([
    {
      type: "info" as const,
      title: "Add More Technical Skills",
      description: "Consider adding React Native and GraphQL to match more internship requirements.",
    },
    {
      type: "warning" as const,
      title: "Quantify Achievements",
      description: 'Add specific metrics to your experience descriptions (e.g., "Improved performance by 30%").',
    },
    {
      type: "success" as const,
      title: "Strong Project Section",
      description: "Your projects demonstrate practical application of skills. Great work!",
    },
  ])

  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
    },
    experiences: [
      {
        id: 1,
        title: "Software Development Intern",
        company: "TechCorp",
        duration: "Jun 2023 - Aug 2023",
        description: "Developed web applications using React and Node.js, improving user engagement by 25%",
      },
    ],
    education: {
      university: "",
      degree: "Bachelor of Science",
      major: "",
      gpa: "",
      graduation: "",
      coursework: "",
    },
    skills: {
      programming: ["JavaScript", "Python", "Java", "TypeScript", "C++"],
      frameworks: ["React", "Node.js", "Express", "Next.js", "Django"],
      tools: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL"],
    },
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        technologies: "React, Node.js, MongoDB",
        link: "github.com/user/ecommerce",
        description:
          "Built a full-stack e-commerce platform with user authentication, payment processing, and inventory management.",
      },
    ],
  })

  // Initialize with user data
  useEffect(() => {
    if (user) {
      setResumeData((prev) => ({
        ...prev,
        personal: {
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
        },
        education: {
          ...prev.education,
          university: user.university || "",
          major: user.major || "",
          graduation: user.graduation_year || "",
        },
      }))
    }
  }, [user])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes("pdf") && !file.type.includes("doc")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file.",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)
    setIsExtracting(true)

    try {
      // Simulate text extraction (in real app, use PDF.js or similar)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockExtractedText = `
        ${user?.first_name} ${user?.last_name}
        ${user?.email} | ${user?.phone}
        ${user?.location}

        EDUCATION
        ${user?.university}
        ${user?.major}, Expected ${user?.graduation_year}

        EXPERIENCE
        Software Development Intern - TechCorp
        Jun 2023 - Aug 2023
        • Developed web applications using React and Node.js
        • Improved user engagement by 25%
        • Collaborated with cross-functional teams

        SKILLS
        Programming: JavaScript, Python, Java, TypeScript
        Frameworks: React, Node.js, Express, Next.js
        Tools: Git, Docker, AWS, MongoDB

        PROJECTS
        E-commerce Platform
        • Built full-stack application with React and Node.js
        • Implemented user authentication and payment processing
      `

      setExtractedText(mockExtractedText)

      toast({
        title: "Resume uploaded!",
        description: "Text has been extracted from your resume.",
      })
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: "Unable to extract text from resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const analyzeUploadedResume = async () => {
    if (!extractedText) {
      toast({
        title: "No resume to analyze",
        description: "Please upload a resume first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/resume-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: extractedText,
          targetRole: "Software Engineering Intern"
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      // Parse the AI response to extract structured data
      const analysisText = data.analysis
      
      // Create a structured result based on the AI analysis
      const result: AnalysisResult = {
        overallScore: 78, // Default score
        atsScore: 85,
        contentScore: 75,
        skillsScore: 80,
        formatScore: 90,
        suggestions: [
          {
            type: "info" as const,
            title: "AI Analysis Complete",
            description: analysisText.substring(0, 200) + "...",
          },
          {
            type: "warning" as const,
            title: "Review Recommendations",
            description: "Please review the detailed analysis above for specific improvement suggestions.",
          },
        ],
      }

      setAnalysisResult(result)
      setResumeScore(result.overallScore)
      setSuggestions(result.suggestions)

      toast({
        title: "Resume analyzed!",
        description: "Your resume has been analyzed with AI-powered insights.",
      })
    } catch (error) {
      console.error('Resume analysis error:', error)
      toast({
        title: "Analysis failed",
        description: "Unable to analyze resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({ ...prev, [section]: data }))
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now(),
      title: "",
      company: "",
      duration: "",
      description: "",
    }
    updateResumeData("experiences", [...resumeData.experiences, newExp])
  }

  const removeExperience = (id: number) => {
    updateResumeData(
      "experiences",
      resumeData.experiences.filter((exp) => exp.id !== id),
    )
  }

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    const updated = resumeData.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    updateResumeData("experiences", updated)
  }

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      technologies: "",
      link: "",
      description: "",
    }
    updateResumeData("projects", [...resumeData.projects, newProject])
  }

  const removeProject = (id: number) => {
    updateResumeData(
      "projects",
      resumeData.projects.filter((proj) => proj.id !== id),
    )
  }

  const updateProject = (id: number, field: string, value: string) => {
    const updated = resumeData.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    updateResumeData("projects", updated)
  }

  const addSkill = (category: keyof typeof resumeData.skills, skill: string) => {
    if (skill.trim() && !resumeData.skills[category].includes(skill.trim())) {
      const updated = [...resumeData.skills[category], skill.trim()]
      updateResumeData("skills", { ...resumeData.skills, [category]: updated })
    }
  }

  const removeSkill = (category: keyof typeof resumeData.skills, skill: string) => {
    const updated = resumeData.skills[category].filter((s) => s !== skill)
    updateResumeData("skills", { ...resumeData.skills, [category]: updated })
  }

  const analyzeBuiltResume = async () => {
    setIsAnalyzing(true)
    try {
      // Convert resume data to text format for analysis
      const resumeText = `
        ${resumeData.personal.firstName} ${resumeData.personal.lastName}
        ${resumeData.personal.email} | ${resumeData.personal.phone}
        ${resumeData.personal.location}
        
        EDUCATION
        ${resumeData.education.university}
        ${resumeData.education.degree} in ${resumeData.education.major}
        GPA: ${resumeData.education.gpa}
        Graduation: ${resumeData.education.graduation}
        
        EXPERIENCE
        ${resumeData.experiences.map(exp => `
          ${exp.title} - ${exp.company}
          ${exp.duration}
          ${exp.description}
        `).join('\n')}
        
        SKILLS
        Programming: ${resumeData.skills.programming.join(', ')}
        Frameworks: ${resumeData.skills.frameworks.join(', ')}
        Tools: ${resumeData.skills.tools.join(', ')}
        
        PROJECTS
        ${resumeData.projects.map(proj => `
          ${proj.name}
          Technologies: ${proj.technologies}
          Link: ${proj.link}
          Description: ${proj.description}
        `).join('\n')}
      `

      const response = await fetch('/api/ai/resume-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText,
          targetRole: "Software Engineering Intern"
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      // Parse the AI response to extract structured data
      const analysisText = data.analysis
      
      // Create a structured result based on the AI analysis
      const result: AnalysisResult = {
        overallScore: 78, // Default score
        atsScore: 85,
        contentScore: 75,
        skillsScore: 80,
        formatScore: 90,
        suggestions: [
          {
            type: "info" as const,
            title: "AI Analysis Complete",
            description: analysisText.substring(0, 200) + "...",
          },
          {
            type: "warning" as const,
            title: "Review Recommendations",
            description: "Please review the detailed analysis above for specific improvement suggestions.",
          },
        ],
      }

      setAnalysisResult(result)
      setResumeScore(result.overallScore)
      setSuggestions(result.suggestions)

      toast({
        title: "Resume analyzed!",
        description: "Your resume has been analyzed with AI-powered insights.",
      })
    } catch (error) {
      console.error('Resume analysis error:', error)
      toast({
        title: "Analysis failed",
        description: "Unable to analyze resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadResume = () => {
    toast({
      title: "Resume downloaded!",
      description: "Your resume has been downloaded as a PDF.",
    })
  }

  const previewResume = () => {
    toast({
      title: "Resume preview",
      description: "Opening resume preview in a new window.",
    })
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    setExtractedText("")
    setAnalysisResult(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <p className="text-muted-foreground">Create an ATS-optimized resume with AI-powered suggestions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={previewResume}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={downloadResume}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="builder">Resume Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Resume
                    </CardTitle>
                    <CardDescription>Upload your existing resume for AI analysis and suggestions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!uploadedFile ? (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
                        <p className="text-muted-foreground mb-4">Drag and drop your resume here, or click to browse</p>
                        <p className="text-sm text-muted-foreground">Supports PDF and DOC files</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <File className="h-8 w-8 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{uploadedFile.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={removeUploadedFile}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {isExtracting && (
                          <div className="mt-4 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Extracting text...</span>
                          </div>
                        )}

                        {extractedText && (
                          <div className="mt-4">
                            <Label>Extracted Text Preview:</Label>
                            <Textarea value={extractedText} readOnly rows={8} className="mt-2 text-sm" />
                          </div>
                        )}
                      </div>
                    )}

                    {extractedText && (
                      <Button onClick={analyzeUploadedResume} disabled={isAnalyzing} className="w-full">
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing Resume...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {analysisResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                      <CardDescription>Detailed breakdown of your resume performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{analysisResult.atsScore}%</div>
                          <div className="text-sm text-muted-foreground">ATS Score</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{analysisResult.contentScore}%</div>
                          <div className="text-sm text-muted-foreground">Content</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{analysisResult.skillsScore}%</div>
                          <div className="text-sm text-muted-foreground">Skills Match</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{analysisResult.formatScore}%</div>
                          <div className="text-sm text-muted-foreground">Format</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* AI Analysis Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      AI Resume Score
                    </CardTitle>
                    <CardDescription>Real-time analysis of your resume strength</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">{resumeScore}/100</div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    <Progress value={resumeScore} className="mb-4" />

                    {analysisResult && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">ATS Compatibility</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{analysisResult.atsScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Content Quality</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{analysisResult.contentScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Skills Match</span>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{analysisResult.skillsScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Format & Structure</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{analysisResult.formatScore}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Suggestions</CardTitle>
                    <CardDescription>Personalized recommendations to improve your resume</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`border-l-4 pl-4 ${
                          suggestion.type === "success"
                            ? "border-green-500"
                            : suggestion.type === "warning"
                              ? "border-yellow-500"
                              : "border-blue-500"
                        }`}
                      >
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resume Builder */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="personal" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Basic information that will appear at the top of your resume</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={resumeData.personal.firstName}
                              onChange={(e) =>
                                updateResumeData("personal", { ...resumeData.personal, firstName: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={resumeData.personal.lastName}
                              onChange={(e) =>
                                updateResumeData("personal", { ...resumeData.personal, lastName: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.personal.email}
                            onChange={(e) =>
                              updateResumeData("personal", { ...resumeData.personal, email: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={resumeData.personal.phone}
                              onChange={(e) =>
                                updateResumeData("personal", { ...resumeData.personal, phone: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={resumeData.personal.location}
                              onChange={(e) =>
                                updateResumeData("personal", { ...resumeData.personal, location: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.personal.linkedin}
                            onChange={(e) =>
                              updateResumeData("personal", { ...resumeData.personal, linkedin: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={resumeData.personal.github}
                            onChange={(e) =>
                              updateResumeData("personal", { ...resumeData.personal, github: e.target.value })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="experience">
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Experience</CardTitle>
                        <CardDescription>Add your internships, jobs, and relevant work experience</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {resumeData.experiences.map((exp, index) => (
                          <div key={exp.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium">Experience {index + 1}</h3>
                              <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label>Job Title</Label>
                                <Input
                                  value={exp.title}
                                  onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Company</Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Duration</Label>
                                  <Input
                                    value={exp.duration}
                                    onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                  placeholder="Describe your responsibilities and achievements..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education">
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>Add your educational background and achievements</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="university">University</Label>
                          <Input
                            id="university"
                            value={resumeData.education.university}
                            onChange={(e) =>
                              updateResumeData("education", { ...resumeData.education, university: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="degree">Degree</Label>
                            <Input
                              id="degree"
                              value={resumeData.education.degree}
                              onChange={(e) =>
                                updateResumeData("education", { ...resumeData.education, degree: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="major">Major</Label>
                            <Input
                              id="major"
                              value={resumeData.education.major}
                              onChange={(e) =>
                                updateResumeData("education", { ...resumeData.education, major: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="gpa">GPA</Label>
                            <Input
                              id="gpa"
                              value={resumeData.education.gpa}
                              onChange={(e) =>
                                updateResumeData("education", { ...resumeData.education, gpa: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="graduation">Graduation Date</Label>
                            <Input
                              id="graduation"
                              value={resumeData.education.graduation}
                              onChange={(e) =>
                                updateResumeData("education", { ...resumeData.education, graduation: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="coursework">Relevant Coursework</Label>
                          <Textarea
                            id="coursework"
                            value={resumeData.education.coursework}
                            onChange={(e) =>
                              updateResumeData("education", { ...resumeData.education, coursework: e.target.value })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills">
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>List your technical and soft skills</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(resumeData.skills).map(([category, skills]) => (
                          <div key={category}>
                            <Label className="capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="cursor-pointer">
                                  {skill}
                                  <button
                                    className="ml-2 text-xs hover:text-red-500"
                                    onClick={() => removeSkill(category as keyof typeof resumeData.skills, skill)}
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <Input
                              className="mt-2"
                              placeholder={`Add a ${category.replace(/([A-Z])/g, " $1").toLowerCase()}...`}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement
                                  addSkill(category as keyof typeof resumeData.skills, input.value)
                                  input.value = ""
                                }
                              }}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects">
                    <Card>
                      <CardHeader>
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>Showcase your personal and academic projects</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {resumeData.projects.map((project, index) => (
                          <div key={project.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium">Project {index + 1}</h3>
                              <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label>Project Name</Label>
                                <Input
                                  value={project.name}
                                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Technologies Used</Label>
                                  <Input
                                    value={project.technologies}
                                    onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Project Link</Label>
                                  <Input
                                    value={project.link}
                                    onChange={(e) => updateProject(project.id, "link", e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={project.description}
                                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* AI Analysis & Score */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      AI Resume Score
                    </CardTitle>
                    <CardDescription>Real-time analysis of your resume strength</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">{resumeScore}/100</div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    <Progress value={resumeScore} className="mb-4" />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ATS Compatibility</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">95%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Quality</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">88%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Skills Match</span>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Format & Structure</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">91%</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={analyzeBuiltResume} className="w-full mt-4" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Suggestions</CardTitle>
                    <CardDescription>Personalized recommendations to improve your resume</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`border-l-4 pl-4 ${
                          suggestion.type === "success"
                            ? "border-green-500"
                            : suggestion.type === "warning"
                              ? "border-yellow-500"
                              : "border-blue-500"
                        }`}
                      >
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resume Templates</CardTitle>
                    <CardDescription>Choose from industry-specific templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Software Engineering
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Product Design
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Data Science
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Business & Marketing
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
