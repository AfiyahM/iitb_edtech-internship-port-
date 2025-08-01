"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  MapPin,
  Building,
  Clock,
  DollarSign,
  Filter,
  Heart,
  ExternalLink,
  Briefcase,
  Loader2,
} from "lucide-react"

const internships = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    duration: "12 weeks",
    salary: "$8,000/month",
    matchScore: 95,
    description:
      "Work on cutting-edge projects with the Chrome team, developing new features and optimizing performance.",
    skills: ["React", "TypeScript", "Node.js", "Python"],
    posted: "2 days ago",
    applicants: 234,
    logo: "/placeholder.svg?height=40&width=40",
    companySize: "Large (500+)",
    remote: false,
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Full-time",
    duration: "16 weeks",
    salary: "$7,500/month",
    matchScore: 88,
    description: "Join the React team and contribute to open source projects while building user interfaces.",
    skills: ["React", "JavaScript", "CSS", "GraphQL"],
    posted: "1 week ago",
    applicants: 189,
    logo: "/placeholder.svg?height=40&width=40",
    companySize: "Large (500+)",
    remote: false,
  },
  {
    id: 3,
    title: "Data Science Intern",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "Full-time",
    duration: "10 weeks",
    salary: "$7,000/month",
    matchScore: 72,
    description: "Analyze user behavior data and build machine learning models to improve content recommendations.",
    skills: ["Python", "SQL", "Machine Learning", "TensorFlow"],
    posted: "3 days ago",
    applicants: 156,
    logo: "/placeholder.svg?height=40&width=40",
    companySize: "Large (500+)",
    remote: false,
  },
  {
    id: 4,
    title: "Product Design Intern",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "Full-time",
    duration: "12 weeks",
    salary: "$6,500/month",
    matchScore: 65,
    description: "Design user experiences for millions of travelers worldwide, working closely with product teams.",
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
    posted: "5 days ago",
    applicants: 98,
    logo: "/placeholder.svg?height=40&width=40",
    companySize: "Large (500+)",
    remote: false,
  },
  {
    id: 5,
    title: "Remote Backend Intern",
    company: "Stripe",
    location: "Remote",
    type: "Full-time",
    duration: "14 weeks",
    salary: "$8,500/month",
    matchScore: 82,
    description: "Build scalable payment infrastructure and APIs used by millions of businesses worldwide.",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    posted: "1 day ago",
    applicants: 67,
    logo: "/placeholder.svg?height=40&width=40",
    companySize: "Medium (51-500)",
    remote: true,
  },
]

export default function SearchPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [savedInternships, setSavedInternships] = useState<number[]>([])
  const [appliedInternships, setAppliedInternships] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("match")
  const [isApplying, setIsApplying] = useState<number | null>(null)

  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedCompanySize, setSelectedCompanySize] = useState<string[]>([])
  const [selectedDuration, setSelectedDuration] = useState<string[]>([])
  const [remoteOnly, setRemoteOnly] = useState(false)

  const allSkills = [
    "React",
    "Python",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "SQL",
    "Machine Learning",
    "Figma",
    "AWS",
  ]

  const filteredInternships = useMemo(() => {
    const filtered = internships.filter((internship) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesQuery =
          internship.title.toLowerCase().includes(query) ||
          internship.company.toLowerCase().includes(query) ||
          internship.skills.some((skill) => skill.toLowerCase().includes(query))
        if (!matchesQuery) return false
      }

      // Location filter
      if (selectedLocation !== "all") {
        if (selectedLocation === "remote" && !internship.remote) return false
        if (selectedLocation !== "remote" && !internship.location.toLowerCase().includes(selectedLocation)) return false
      }

      // Type filter
      if (selectedType !== "all" && internship.type.toLowerCase() !== selectedType) return false

      // Skills filter
      if (selectedSkills.length > 0) {
        const hasMatchingSkill = selectedSkills.some((skill) =>
          internship.skills.some((internshipSkill) => internshipSkill.toLowerCase().includes(skill.toLowerCase())),
        )
        if (!hasMatchingSkill) return false
      }

      // Company size filter
      if (selectedCompanySize.length > 0 && !selectedCompanySize.includes(internship.companySize)) return false

      // Duration filter
      if (selectedDuration.length > 0) {
        const weeks = Number.parseInt(internship.duration.split(" ")[0])
        const matchesDuration = selectedDuration.some((duration) => {
          if (duration === "8-10 weeks") return weeks >= 8 && weeks <= 10
          if (duration === "10-12 weeks") return weeks >= 10 && weeks <= 12
          if (duration === "12+ weeks") return weeks >= 12
          return false
        })
        if (!matchesDuration) return false
      }

      // Remote filter
      if (remoteOnly && !internship.remote) return false

      return true
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.matchScore - a.matchScore
        case "recent":
          return new Date(b.posted).getTime() - new Date(a.posted).getTime()
        case "salary":
          const aSalary = Number.parseInt(a.salary.replace(/[^0-9]/g, ""))
          const bSalary = Number.parseInt(b.salary.replace(/[^0-9]/g, ""))
          return bSalary - aSalary
        case "company":
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

    return filtered
  }, [
    searchQuery,
    selectedLocation,
    selectedType,
    selectedSkills,
    selectedCompanySize,
    selectedDuration,
    remoteOnly,
    sortBy,
  ])

  const toggleSave = (id: number) => {
    setSavedInternships((prev) => {
      const newSaved = prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
      toast({
        title: newSaved.includes(id) ? "Internship saved!" : "Internship removed from saved",
        description: newSaved.includes(id)
          ? "You can find it in your saved internships."
          : "Removed from your saved list.",
      })
      return newSaved
    })
  }

  const handleApply = async (internship: (typeof internships)[0]) => {
    if (appliedInternships.includes(internship.id)) {
      toast({
        title: "Already applied",
        description: "You have already applied to this internship.",
        variant: "destructive",
      })
      return
    }

    setIsApplying(internship.id)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setAppliedInternships((prev) => [...prev, internship.id])
      toast({
        title: "Application submitted!",
        description: `Your application to ${internship.company} has been submitted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(null)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleCompanySizeToggle = (size: string) => {
    setSelectedCompanySize((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handleDurationToggle = (duration: string) => {
    setSelectedDuration((prev) => (prev.includes(duration) ? prev.filter((d) => d !== duration) : [...prev, duration]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocation("all")
    setSelectedType("all")
    setSelectedSkills([])
    setSelectedCompanySize([])
    setSelectedDuration([])
    setRemoteOnly(false)
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-blue-100 text-blue-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Your Perfect Internship</h1>
          <p className="text-muted-foreground">Discover opportunities tailored to your skills and career goals</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search internships, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="san francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="mountain view">Mountain View, CA</SelectItem>
                    <SelectItem value="menlo park">Menlo Park, CA</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {(selectedSkills.length > 0 ||
                    selectedCompanySize.length > 0 ||
                    selectedDuration.length > 0 ||
                    remoteOnly) && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedSkills.length +
                        selectedCompanySize.length +
                        selectedDuration.length +
                        (remoteOnly ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Skills</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {allSkills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={skill} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Company Size</Label>
                    <div className="space-y-2">
                      {["Startup (1-50)", "Medium (51-500)", "Large (500+)"].map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={size}
                            checked={selectedCompanySize.includes(size)}
                            onCheckedChange={() => handleCompanySizeToggle(size)}
                          />
                          <Label htmlFor={size} className="text-sm">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Duration</Label>
                    <div className="space-y-2">
                      {["8-10 weeks", "10-12 weeks", "12+ weeks"].map((duration) => (
                        <div key={duration} className="flex items-center space-x-2">
                          <Checkbox
                            id={duration}
                            checked={selectedDuration.includes(duration)}
                            onCheckedChange={() => handleDurationToggle(duration)}
                          />
                          <Label htmlFor={duration} className="text-sm">
                            {duration}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Other</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
                        <Label htmlFor="remote" className="text-sm">
                          Remote Only
                        </Label>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4 w-full bg-transparent">
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredInternships.length} of {internships.length} internships
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary">Highest Salary</SelectItem>
              <SelectItem value="company">Company A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Internship Cards */}
        <div className="space-y-4">
          {filteredInternships.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No internships match your current filters.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredInternships.map((internship) => (
              <Card key={internship.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{internship.title}</h3>
                            <p className="text-muted-foreground">{internship.company}</p>
                          </div>
                          <Badge className={getMatchColor(internship.matchScore)}>{internship.matchScore}% Match</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {internship.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {internship.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {internship.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {internship.salary}
                          </div>
                          {internship.remote && (
                            <Badge variant="secondary" className="text-xs">
                              Remote
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm mb-3">{internship.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {internship.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Posted {internship.posted} • {internship.applicants} applicants
                          </div>

                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toggleSave(internship.id)}>
                              <Heart
                                className={`h-4 w-4 ${
                                  savedInternships.includes(internship.id) ? "fill-red-500 text-red-500" : ""
                                }`}
                              />
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApply(internship)}
                              disabled={appliedInternships.includes(internship.id) || isApplying === internship.id}
                            >
                              {isApplying === internship.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Applying...
                                </>
                              ) : appliedInternships.includes(internship.id) ? (
                                "Applied"
                              ) : (
                                "Apply Now"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
