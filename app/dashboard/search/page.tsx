"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { formatRelativeDate } from "@/lib/date"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Search,
  MapPin,
  Building,
  Clock,
  Filter,
  Heart,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react"

interface Internship {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
  requirements: string[]
  skills: string[]
  duration: string
  stipend: string
  deadline: string
  created_at: string
  apply_link: string
  company_logo?: string
  remote: boolean
}

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'No deadline'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }
    return dateObj.toLocaleDateString(undefined, options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export default function SearchPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const [appliedInternships, setAppliedInternships] = useState<number[]>([])
  const [savedInternships, setSavedInternships] = useState<number[]>([])
  const [isApplying, setIsApplying] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedDuration, setSelectedDuration] = useState<string[]>([])
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [internshipTypes, setInternshipTypes] = useState<string[]>([])
  const [allSkills, setAllSkills] = useState<string[]>([])
  const { toast } = useToast()

  // Fetch internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          setInternships(data)
          setFilteredInternships(data)
          
          // Extract unique types and skills
          const types = new Set<string>()
          const skills = new Set<string>()
          
          data.forEach(internship => {
            types.add(internship.type)
            internship.skills.forEach((skill: string) => skills.add(skill))
          })
          
          setInternshipTypes(Array.from(types))
          setAllSkills(Array.from(skills))
        }
      } catch (error) {
        console.error('Error fetching internships:', error)
        toast({
          title: "Error",
          description: "Failed to load internships. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInternships()
  }, [toast])

  // Apply filters
  useEffect(() => {
    let result = [...internships]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        internship =>
          internship.title.toLowerCase().includes(query) ||
          internship.company.toLowerCase().includes(query) ||
          internship.description.toLowerCase().includes(query) ||
          internship.skills.some(skill => skill.toLowerCase().includes(query))
      )
    }

    if (selectedSkills.length > 0) {
      result = result.filter(internship =>
        selectedSkills.every(skill => internship.skills.includes(skill))
      )
    }

    if (selectedDuration.length > 0) {
      result = result.filter(internship =>
        selectedDuration.includes(internship.duration)
      )
    }

    if (remoteOnly) {
      result = result.filter(internship => internship.remote)
    }

    setFilteredInternships(result)
  }, [searchQuery, internships, selectedSkills, selectedDuration, remoteOnly])

  const handleApply = async (internship: Internship) => {
    try {
      setIsApplying(internship.id)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAppliedInternships(prev => [...prev, internship.id])
      toast({
        title: "Application submitted!",
        description: `Successfully applied for ${internship.title} at ${internship.company}`,
      })
    } catch (error) {
      console.error('Error applying:', error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(null)
    }
  }

  const toggleSave = (internshipId: number) => {
    setSavedInternships(prev =>
      prev.includes(internshipId)
        ? prev.filter(id => id !== internshipId)
        : [...prev, internshipId]
    )
  }

  const handleViewDetails = (internship: Internship) => {
    setSelectedInternship(internship)
    setIsModalOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSkills([])
    setSelectedDuration([])
    setRemoteOnly(false)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">Find Internships</h1>
            <p className="text-muted-foreground">
              Browse and apply for the best internship opportunities
            </p>
          </div>
          
          <div className="w-full md:w-1/2 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search internships..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {internshipTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3">Skills</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                  {allSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={(checked) => {
                          setSelectedSkills(prev =>
                            checked
                              ? [...prev, skill]
                              : prev.filter((s) => s !== skill)
                          )
                        }}
                      />
                      <Label htmlFor={`skill-${skill}`} className="text-sm">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Duration</h3>
                <div className="space-y-2">
                  {["1-3 months", "3-6 months", "6+ months"].map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <Checkbox
                        id={`duration-${duration}`}
                        checked={selectedDuration.includes(duration)}
                        onCheckedChange={(checked) => {
                          setSelectedDuration(prev =>
                            checked
                              ? [...prev, duration]
                              : prev.filter((d) => d !== duration)
                          )
                        }}
                      />
                      <Label htmlFor={`duration-${duration}`} className="text-sm">
                        {duration}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-medium mb-3">Location</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote-only"
                      checked={remoteOnly}
                      onCheckedChange={(checked) => setRemoteOnly(checked === true)}
                    />
                    <Label htmlFor="remote-only" className="text-sm">
                      Remote only
                    </Label>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No internships found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <Card key={internship.id} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{internship.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{internship.company}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleSave(internship.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          savedInternships.includes(internship.id)
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {internship.remote ? 'Remote' : internship.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {internship.duration}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {internship.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills.length > 3 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          +{internship.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline mr-1 h-4 w-4" />
                      {formatDate(internship.deadline)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(internship)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInternship ? (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl">
                      {selectedInternship.title}
                    </DialogTitle>
                    <p className="text-muted-foreground">
                      {selectedInternship.company}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleSave(selectedInternship.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        savedInternships.includes(selectedInternship.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium mb-2">About the Internship</h3>
                  <p className="text-muted-foreground">
                    {selectedInternship.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Duration
                    </h4>
                    <p className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedInternship.duration}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Location
                    </h4>
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedInternship.remote ? 'Remote' : selectedInternship.location}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Stipend
                    </h4>
                    <p className="flex items-center">
                      <span className="mr-2">💰</span>
                      {selectedInternship.stipend || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Application Deadline
                    </h4>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(selectedInternship.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {selectedInternship.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      window.open(selectedInternship.apply_link, '_blank')
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Apply on Company Site
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleApply(selectedInternship)}
                    disabled={appliedInternships.includes(selectedInternship.id) || isApplying === selectedInternship.id}
                  >
                    {isApplying === selectedInternship.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : appliedInternships.includes(selectedInternship.id) ? (
                      <span className="flex items-center">
                        <span className="mr-2">✓</span>
                        Applied
                      </span>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="p-4 text-center">
              <p>No internship selected</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}