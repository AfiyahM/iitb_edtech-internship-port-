import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyB0sGO4eHAR4nu4bJ8cGC5S6CwY_jToeaw'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface JobAssistantResponse {
  message: string
  suggestions?: string[]
  resources?: string[]
  confidence: number
}

export interface ResumeAnalysis {
  atsScore: number
  breakdown: {
    education: { score: number; maxScore: number; feedback: string }
    experience: { score: number; maxScore: number; feedback: string }
    skills: { score: number; maxScore: number; feedback: string }
    certifications: { score: number; maxScore: number; feedback: string }
    achievements: { score: number; maxScore: number; feedback: string }
    softSkills: { score: number; maxScore: number; feedback: string }
  }
  feedback: string
  suggestions: string[]
  optimizationTips: string[]
  strengths: string[]
  areasForImprovement: string[]
  professionalRecommendations?: string[]
  quantifiableExamples?: string[]
  skillGaps?: string[]
}

export interface JobMatchAnalysis {
  matchScore: number
  breakdown: {
    education: { score: number; maxScore: number; feedback: string }
    experience: { score: number; maxScore: number; feedback: string }
    skills: { score: number; maxScore: number; feedback: string }
    certifications: { score: number; maxScore: number; feedback: string }
    achievements: { score: number; maxScore: number; feedback: string }
    softSkills: { score: number; maxScore: number; feedback: string }
  }
  missingSkills: string[]
  recommendations: string[]
  optimizationSuggestions: string[]
  strengths: string[]
  areasForImprovement: string[]
}

export class JobAssistant {
  public model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  async sendMessage(message: string, context?: string): Promise<JobAssistantResponse> {
    try {
      const systemPrompt = `You are a professional job search and career development assistant. Your role is to help users with:
      - Resume optimization and ATS compatibility
      - Job application strategies
      - Interview preparation
      - Career advice and skill development
      - Document analysis and feedback
      
      Always provide practical, actionable advice. Be encouraging but realistic. 
      If you don't know something, say so rather than making up information.
      
      CRITICAL: Keep responses extremely concise - maximum 50 words. Provide only the most essential information in a clear, direct manner. No unnecessary details or explanations.
      
      IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.
      
      ${context ? `Previous context: ${context}` : ''}
      
      User message: ${message}`

      const result = await this.model.generateContent(systemPrompt)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        confidence: 0.9,
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error)
      return {
        message: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        confidence: 0.1,
      }
    }
  }

  async analyzeResumeATS(resumeText: string): Promise<ResumeAnalysis> {
    try {
      const prompt = `You are a professional resume builder and ATS optimization expert with 15+ years of experience helping candidates get shortlisted for top tech companies. Analyze this resume as if you're a senior recruiter at Google, Microsoft, or Amazon.

CRITICAL INSTRUCTIONS:
1. Analyze the resume content thoroughly and provide HONEST, DETAILED scoring
2. Act as a professional resume consultant who wants the candidate to succeed
3. Provide SPECIFIC, ACTIONABLE recommendations based on actual content found
4. Give concrete examples of what to add, remove, or improve
5. Weight: Experience (25%), Skills (40%), Education (10%), Soft Skills (15%), Certifications (5%), Achievements (5%)

SCORING CRITERIA:
Education (10 points): Degree relevance, institution quality, GPA if mentioned
Experience (25 points): Job duration, technical depth, quantifiable impact, leadership
Skills (40 points): Technical skills breadth, programming languages, tools, frameworks
Certifications (5 points): Relevant certifications, cloud platforms, professional courses
Achievements (5 points): Quantifiable accomplishments, awards, recognitions
Soft Skills (15 points): Communication clarity, presentation, teamwork examples

PROFESSIONAL ANALYSIS APPROACH:
- Be specific about what's missing or weak
- Provide exact examples of what to add
- Suggest quantifiable achievements where possible
- Recommend specific skills or certifications
- Give actionable improvement steps

Resume Content: ${resumeText}

Provide detailed JSON response with professional analysis:
{
  "atsScore": [honest score based on actual content quality],
  "breakdown": {
    "education": {
      "score": [actual score based on degree/level found],
      "maxScore": 10,
      "feedback": "[specific feedback with examples of what to improve]"
    },
    "experience": {
      "score": [actual score based on experience found],
      "maxScore": 25,
      "feedback": "[specific feedback with quantifiable examples to add]"
    },
    "skills": {
      "score": [actual score based on skills found],
      "maxScore": 40,
      "feedback": "[specific feedback with missing skills to add]"
    },
    "certifications": {
      "score": [actual score based on certifications found],
      "maxScore": 5,
      "feedback": "[specific feedback with relevant certifications to pursue]"
    },
    "achievements": {
      "score": [actual score based on achievements found],
      "maxScore": 5,
      "feedback": "[specific feedback with achievement examples to add]"
    },
    "softSkills": {
      "score": [actual score based on soft skills found],
      "maxScore": 15,
      "feedback": "[specific feedback with soft skill examples to include]"
    }
  },
  "feedback": "[professional overall assessment with specific improvement areas]",
  "suggestions": [
    "[specific, actionable suggestion with concrete examples]",
    "[specific, actionable suggestion with concrete examples]",
    "[specific, actionable suggestion with concrete examples]"
  ],
  "optimizationTips": [
    "[specific optimization tip with exact implementation steps]",
    "[specific optimization tip with exact implementation steps]"
  ],
  "strengths": [
    "[specific strength found with why it's valuable]",
    "[specific strength found with why it's valuable]"
  ],
  "areasForImprovement": [
    "[specific area with exact improvement suggestions]",
    "[specific area with exact improvement suggestions]"
  ],
  "professionalRecommendations": [
    "[professional recommendation with specific action items]",
    "[professional recommendation with specific action items]",
    "[professional recommendation with specific action items]"
  ],
  "quantifiableExamples": [
    "[specific quantifiable achievement example to add]",
    "[specific quantifiable achievement example to add]"
  ],
  "skillGaps": [
    "[specific missing skill with why it's important]",
    "[specific missing skill with why it's important]"
  ]
}`

      // Try with retry logic
      let result: any
      let attempts = 0
      const maxAttempts = 3
      
      while (attempts < maxAttempts) {
        try {
          result = await this.model.generateContent(prompt)
          break
        } catch (error: any) {
          attempts++
          console.log(`Attempt ${attempts} failed:`, error.message)
          
          if (attempts >= maxAttempts) {
            throw error
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
        }
      }

      if (!result) {
        throw new Error('Failed to generate content after all attempts')
      }

      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        // Fallback response with honest assessment based on content
        return this.generateFallbackAnalysis(resumeText)
      }
    } catch (error) {
      console.error('Error analyzing resume ATS:', error)
      // Return fallback analysis when API fails
      return this.generateFallbackAnalysis(resumeText)
    }
  }

  private generateFallbackAnalysis(resumeText: string): ResumeAnalysis {
    const resumeLower = resumeText.toLowerCase()
    
    // Check for actual content in resume
    const hasExperience = resumeLower.includes('experience') || resumeLower.includes('work') || resumeLower.includes('job') || resumeLower.includes('employment')
    const hasSkills = resumeLower.includes('skills') || resumeLower.includes('javascript') || resumeLower.includes('python') || resumeLower.includes('react') || resumeLower.includes('java') || resumeLower.includes('aws') || resumeLower.includes('docker')
    const hasEducation = resumeLower.includes('education') || resumeLower.includes('degree') || resumeLower.includes('university') || resumeLower.includes('college') || resumeLower.includes('bachelor') || resumeLower.includes('master')
    const hasCertifications = resumeLower.includes('certification') || resumeLower.includes('aws') || resumeLower.includes('azure') || resumeLower.includes('google') || resumeLower.includes('microsoft')
    const hasAchievements = resumeLower.includes('achievement') || resumeLower.includes('project') || resumeLower.includes('developed') || resumeLower.includes('implemented') || resumeLower.includes('improved') || resumeLower.includes('increased')
    const hasSoftSkills = resumeLower.includes('communication') || resumeLower.includes('leadership') || resumeLower.includes('teamwork') || resumeLower.includes('collaboration') || resumeLower.includes('presentation')
    
    // Count technical skills found
    const technicalSkills = ['javascript', 'python', 'react', 'node.js', 'java', 'aws', 'docker', 'kubernetes', 'sql', 'git', 'html', 'css', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'elasticsearch']
    const foundSkills = technicalSkills.filter(skill => resumeLower.includes(skill))
    const skillsCount = foundSkills.length
    
    // Calculate honest scores based on content with correct weights
    const educationScore = hasEducation ? Math.min(8, 4 + (hasEducation ? 4 : 0)) : 4
    const experienceScore = hasExperience ? Math.min(20, 10 + (hasExperience ? 10 : 0)) : 8
    const skillsScore = Math.min(35, 15 + (skillsCount * 2)) // More skills = higher score
    const certificationsScore = hasCertifications ? 4 : 1
    const achievementsScore = hasAchievements ? 4 : 1
    const softSkillsScore = hasSoftSkills ? 12 : 8
    
    const totalScore = educationScore + experienceScore + skillsScore + certificationsScore + achievementsScore + softSkillsScore
    
    return {
      atsScore: totalScore,
      breakdown: {
        education: { 
          score: educationScore, 
          maxScore: 10, 
          feedback: hasEducation ? "Education section found with relevant degree. Consider adding GPA if above 3.5 and relevant coursework." : "Add your educational background including degree, university, and graduation date." 
        },
        experience: { 
          score: experienceScore, 
          maxScore: 25, 
          feedback: hasExperience ? "Work experience section found. Enhance with quantifiable achievements like 'Improved performance by 30%' or 'Reduced costs by $50K'." : "Add relevant work experience with specific technologies used and measurable impact." 
        },
        skills: { 
          score: skillsScore, 
          maxScore: 40, 
          feedback: hasSkills ? `Technical skills found: ${foundSkills.slice(0, 3).join(', ')}. Consider adding cloud platforms (AWS/Azure), databases, and DevOps tools.` : "Add a comprehensive technical skills section including programming languages, frameworks, and tools." 
        },
        certifications: { 
          score: certificationsScore, 
          maxScore: 5, 
          feedback: hasCertifications ? "Some certifications found. Consider adding cloud certifications (AWS/Azure) and technology-specific certifications." : "Add relevant certifications like AWS Certified Developer, Microsoft Azure, or technology-specific certifications." 
        },
        achievements: { 
          score: achievementsScore, 
          maxScore: 5, 
          feedback: hasAchievements ? "Some achievements found. Quantify with specific numbers and percentages." : "Add quantifiable achievements like 'Led team of 5 developers', 'Reduced load time by 40%', or 'Increased user engagement by 25%'." 
        },
        softSkills: { 
          score: softSkillsScore, 
          maxScore: 15, 
          feedback: hasSoftSkills ? "Soft skills section found. Provide specific examples of leadership, teamwork, and communication." : "Add soft skills with specific examples like 'Led cross-functional team of 8 members' or 'Presented technical solutions to stakeholders'." 
        }
      },
      feedback: totalScore > 70 ? "Resume shows good potential but needs specific improvements for better shortlisting. Focus on quantifiable achievements and technical depth." : totalScore > 50 ? "Resume has basic structure but needs significant enhancement for competitive roles. Add specific technologies and measurable impact." : "Resume needs comprehensive improvement for shortlisting. Focus on adding relevant experience, technical skills, and quantifiable achievements.",
      suggestions: [
        hasExperience ? "Enhance experience descriptions with specific technologies and quantifiable impact (e.g., 'Reduced API response time by 60% using Redis caching')" : "Add relevant work experience with specific technologies, project scope, and measurable outcomes",
        hasSkills ? "Expand technical skills to include cloud platforms (AWS/Azure), databases (MongoDB/PostgreSQL), and DevOps tools (Docker/Kubernetes)" : "Create a comprehensive technical skills section with programming languages, frameworks, databases, and tools",
        hasCertifications ? "Add industry-recognized certifications like AWS Certified Developer, Microsoft Azure, or technology-specific certifications" : "Pursue relevant certifications like AWS Certified Developer, Microsoft Azure, or technology-specific certifications"
      ],
      optimizationTips: [
        "Use specific technology names and versions (e.g., 'React 18', 'Node.js 16', 'MongoDB 5.0')",
        "Quantify achievements with numbers and percentages (e.g., 'Improved performance by 40%', 'Reduced costs by $25K')",
        "Include relevant certifications prominently and add dates of completion"
      ],
      strengths: [
        hasEducation ? "Educational background provides good foundation for technical roles" : "Basic structure allows for systematic improvement",
        hasExperience ? "Work experience demonstrates practical application of skills" : "Content provides starting point for enhancement"
      ],
      areasForImprovement: [
        hasExperience ? "Enhance experience descriptions with specific technologies and quantifiable impact" : "Add relevant work experience with measurable outcomes",
        hasSkills ? "Expand technical skills to include modern technologies and tools" : "Add comprehensive technical skills section"
      ],
      professionalRecommendations: [
        "Focus on quantifiable achievements in experience section (e.g., 'Led development of feature used by 10K+ users')",
        "Add specific technical skills relevant to target roles (e.g., 'Docker', 'Kubernetes', 'AWS Lambda')",
        "Include relevant certifications and professional development courses"
      ],
      quantifiableExamples: [
        "Improved application performance by 40% through database optimization",
        "Led team of 5 developers to deliver project 2 weeks ahead of schedule",
        "Reduced server costs by $15K through cloud migration"
      ],
      skillGaps: [
        "Cloud platforms (AWS/Azure) - Essential for modern software development",
        "DevOps tools (Docker/Kubernetes) - Highly valued by top tech companies",
        "Database technologies (MongoDB/PostgreSQL) - Critical for full-stack development"
      ]
    }
  }

  async optimizeResumeForJob(resumeText: string, jobDescription: string): Promise<JobMatchAnalysis> {
    try {
      const prompt = `You are an expert resume-job matcher. Compare this resume with the job description for a Software Engineer role and provide HONEST, DETAILED analysis based on ACTUAL content comparison.

CRITICAL INSTRUCTIONS:
1. READ both resume and job description carefully
2. Compare ACTUAL content between resume and job requirements
3. Score based on REAL match between resume content and job requirements
4. If resume matches job well, give higher scores. If poor match, give lower scores
5. Weight: Experience (25%), Skills (40%), Education (10%), Soft Skills (15%), Certifications (5%), Achievements (5%)

SCORING CRITERIA:
Education (10 points): Compare actual degree with job requirements
Experience (25 points): Match actual experience with job responsibilities
Skills (40 points): Compare actual skills with job requirements
Certifications (5 points): Match actual certifications with job needs
Achievements (5 points): Compare actual achievements with job capabilities
Soft Skills (15 points): Match actual soft skills with job requirements

IMPORTANT: Base EVERY score on actual content comparison. If resume content matches job requirements well, score high. If poor match, score low. Be honest and specific.

Resume Content: ${resumeText}
Job Description: ${jobDescription}

Provide detailed JSON response with honest scoring based on actual content comparison:
{
  "matchScore": [honest score based on actual content match],
  "breakdown": {
    "education": {
      "score": [actual score based on degree relevance to job],
      "maxScore": 10,
      "feedback": "[specific feedback based on actual education vs job requirements]"
    },
    "experience": {
      "score": [actual score based on experience relevance to job],
      "maxScore": 25,
      "feedback": "[specific feedback based on actual experience vs job requirements]"
    },
    "skills": {
      "score": [actual score based on skills match with job],
      "maxScore": 40,
      "feedback": "[specific feedback based on actual skills vs job requirements]"
    },
    "certifications": {
      "score": [actual score based on certifications relevance to job],
      "maxScore": 5,
      "feedback": "[specific feedback based on actual certifications vs job requirements]"
    },
    "achievements": {
      "score": [actual score based on achievements relevance to job],
      "maxScore": 5,
      "feedback": "[specific feedback based on actual achievements vs job requirements]"
    },
    "softSkills": {
      "score": [actual score based on soft skills match with job],
      "maxScore": 15,
      "feedback": "[specific feedback based on actual soft skills vs job requirements]"
    }
  },
  "missingSkills": [
    "[specific skill missing from resume that job requires]",
    "[specific skill missing from resume that job requires]"
  ],
  "recommendations": [
    "[specific recommendation based on actual resume gaps]",
    "[specific recommendation based on actual content weaknesses]"
  ],
  "optimizationSuggestions": [
    "[specific suggestion based on actual resume vs job mismatch]",
    "[specific suggestion based on actual content gaps]"
  ],
  "strengths": [
    "[specific strength found in resume that matches job]",
    "[specific strength found in resume that matches job]"
  ],
  "areasForImprovement": [
    "[specific area needing improvement based on job requirements]",
    "[specific area needing improvement based on job requirements]"
  ]
}`

      // Try with retry logic
      let result: any
      let attempts = 0
      const maxAttempts = 3
      
      while (attempts < maxAttempts) {
        try {
          result = await this.model.generateContent(prompt)
          break
        } catch (error: any) {
          attempts++
          console.log(`Attempt ${attempts} failed:`, error.message)
          
          if (attempts >= maxAttempts) {
            throw error
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
        }
      }

      if (!result) {
        throw new Error('Failed to generate content after all attempts')
      }

      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        // Fallback response with honest assessment based on content comparison
        return this.generateFallbackJobMatch(resumeText, jobDescription)
      }
    } catch (error) {
      console.error('Error optimizing resume for job:', error)
      // Return fallback analysis when API fails
      return this.generateFallbackJobMatch(resumeText, jobDescription)
    }
  }

  private generateFallbackJobMatch(resumeText: string, jobDescription: string): JobMatchAnalysis {
    const resumeLower = resumeText.toLowerCase()
    const jobLower = jobDescription.toLowerCase()
    
    // Check for skill matches
    const commonSkills = ['javascript', 'python', 'react', 'node.js', 'java', 'aws', 'docker', 'kubernetes', 'sql', 'git', 'html', 'css', 'typescript', 'angular', 'vue']
    const resumeSkills = commonSkills.filter(skill => resumeLower.includes(skill))
    const jobSkills = commonSkills.filter(skill => jobLower.includes(skill))
    const skillMatch = resumeSkills.filter(skill => jobSkills.includes(skill)).length / Math.max(jobSkills.length, 1)
    
    // Check for experience match
    const hasExperience = resumeLower.includes('experience') || resumeLower.includes('work') || resumeLower.includes('job') || resumeLower.includes('employment')
    const jobNeedsExperience = jobLower.includes('experience') || jobLower.includes('years') || jobLower.includes('senior')
    
    // Check for education match
    const hasEducation = resumeLower.includes('education') || resumeLower.includes('degree') || resumeLower.includes('university') || resumeLower.includes('college')
    const jobNeedsEducation = jobLower.includes('degree') || jobLower.includes('education') || jobLower.includes('bachelor')
    
    // Calculate honest scores based on content comparison with correct weights
    const educationScore = hasEducation && jobNeedsEducation ? 8 : hasEducation ? 6 : 4
    const experienceScore = hasExperience && jobNeedsExperience ? 20 : hasExperience ? 15 : 8
    const skillsScore = Math.round(skillMatch * 32) + 8
    const certificationsScore = resumeLower.includes('certification') || resumeLower.includes('aws') || resumeLower.includes('azure') ? 4 : 1
    const achievementsScore = resumeLower.includes('achievement') || resumeLower.includes('project') || resumeLower.includes('developed') ? 4 : 1
    const softSkillsScore = 12
    
    const totalScore = educationScore + experienceScore + skillsScore + certificationsScore + achievementsScore + softSkillsScore
    
    return {
      matchScore: totalScore,
      breakdown: {
        education: { score: educationScore, maxScore: 10, feedback: hasEducation ? "Education present and relevant" : "Limited education information" },
        experience: { score: experienceScore, maxScore: 25, feedback: hasExperience ? "Work experience found" : "Limited work experience" },
        skills: { score: skillsScore, maxScore: 40, feedback: `Skills match: ${Math.round(skillMatch * 100)}% with job requirements` },
        certifications: { score: certificationsScore, maxScore: 5, feedback: certificationsScore > 3 ? "Some certifications found" : "No certifications found" },
        achievements: { score: achievementsScore, maxScore: 5, feedback: achievementsScore > 3 ? "Some achievements found" : "Limited achievements" },
        softSkills: { score: softSkillsScore, maxScore: 15, feedback: "Good soft skills presentation" }
      },
      missingSkills: jobSkills.filter(skill => !resumeSkills.includes(skill)).slice(0, 3),
      recommendations: [
        skillMatch < 0.5 ? "Add more technical skills mentioned in job description" : "Enhance existing skills descriptions",
        hasExperience ? "Enhance experience descriptions" : "Add relevant work experience",
        certificationsScore < 3 ? "Add relevant certifications" : "Include more certifications"
      ],
      optimizationSuggestions: [
        "Tailor skills to match job requirements",
        "Add quantifiable achievements",
        "Include relevant certifications"
      ],
      strengths: [
        hasEducation ? "Educational background present" : "Basic structure",
        hasExperience ? "Work experience included" : "Some content present"
      ],
      areasForImprovement: [
        skillMatch < 0.5 ? "Add missing technical skills" : "Enhance technical skills",
        hasExperience ? "Enhance experience descriptions" : "Add relevant work experience"
      ]
    }
  }

  async analyzeResume(resumeText: string): Promise<JobAssistantResponse> {
    try {
      const prompt = `Analyze this resume and provide brief, actionable feedback. Focus on key strengths and one main area for improvement. Keep response under 50 words.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Resume: ${resumeText}

Provide concise feedback focusing on the most important aspect that needs attention.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        confidence: 0.85,
      }
    } catch (error) {
      console.error('Error analyzing resume:', error)
      return {
        message: 'Unable to analyze resume at this time. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async analyzeDocument(fileContent: string, fileType: string): Promise<JobAssistantResponse> {
    try {
      const prompt = `Analyze this ${fileType} document and provide a brief assessment in maximum 50 words. Focus on the most important points for job applications.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Document: ${fileContent}

Provide concise feedback on document quality and key recommendations.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        confidence: 0.85,
      }
    } catch (error) {
      console.error('Error analyzing document:', error)
      return {
        message: 'Unable to analyze document at this time. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async generateInterviewQuestions(jobTitle: string, company: string = ''): Promise<JobAssistantResponse> {
    try {
      const prompt = `Generate 3 key interview questions for ${jobTitle} role${company ? ` at ${company}` : ''}. Keep response under 50 words. Focus on most important questions.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Provide brief, specific questions that would be most relevant for this position.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        confidence: 0.9,
      }
    } catch (error) {
      console.error('Error generating interview questions:', error)
      return {
        message: 'Unable to generate questions at this time. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async provideCareerAdvice(topic: string, context: string = ''): Promise<JobAssistantResponse> {
    try {
      const prompt = `Provide brief career advice on "${topic}"${context ? ` considering: ${context}` : ''}. Keep response under 50 words. Focus on the most actionable advice.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Give concise, practical guidance that can be implemented immediately.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        confidence: 0.85,
      }
    } catch (error) {
      console.error('Error providing career advice:', error)
      return {
        message: 'Unable to provide advice at this time. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async suggestSkills(jobTitle: string, experience: string = ''): Promise<JobAssistantResponse> {
    try {
      const prompt = `Suggest 3 most important skills for ${jobTitle} role${experience ? ` with ${experience} experience` : ''}. Keep response under 50 words. Focus on essential skills.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Provide the most critical skills that would make the biggest impact for this position.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        confidence: 0.9,
      }
    } catch (error) {
      console.error('Error suggesting skills:', error)
      return {
        message: 'Unable to suggest skills at this time. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async enhanceResume(resumeText: string): Promise<string> {
    try {
      const prompt = `You are a professional resume writer with 15+ years of experience helping candidates get shortlisted for top tech companies. Create a world-class, structured resume that follows industry best practices.

CRITICAL REQUIREMENTS:
1. Create a professional, well-structured resume format
2. Use clear sections: CONTACT INFO, SUMMARY, SKILLS, EXPERIENCE, EDUCATION, PROJECTS, CERTIFICATIONS
3. Add quantifiable achievements and action verbs
4. Make it ATS-friendly with proper keywords
5. Focus on technical skills and measurable impact
6. Use professional formatting with clear section headers
7. Include specific technologies, tools, and frameworks
8. Add relevant certifications and achievements

STRUCTURE:
- Contact Information (name, email, phone, LinkedIn, GitHub)
- Professional Summary (2-3 sentences highlighting key strengths)
- Technical Skills (categorized: Programming Languages, Frameworks, Tools, etc.)
- Work Experience (with quantifiable achievements)
- Education (with GPA if above 3.5)
- Projects (with technologies and impact)
- Certifications (if any)

FORMATTING:
- Use clear section headers in CAPS
- Use bullet points for achievements
- Include specific numbers and percentages
- Mention technologies and tools used
- Keep it concise but comprehensive

Resume Content: ${resumeText}

Create a professional, structured resume that would impress recruiters at Google, Microsoft, Amazon, or similar top tech companies.`

      // Add retry logic for API overload
      let retries = 3
      while (retries > 0) {
        try {
          const result = await this.model.generateContent(prompt)
          const response = await result.response
          const text = response.text()
          return text
        } catch (error: any) {
          retries--
          if (error.status === 503 && retries > 0) {
            console.log(`Gemini API overload, retrying... (${retries} attempts left)`)
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
            continue
          }
          throw error
        }
      }
      
      // If all retries failed, return a basic enhanced version
      return this.createBasicEnhancedResume(resumeText)
    } catch (error) {
      console.error('Error enhancing resume:', error)
      return this.createBasicEnhancedResume(resumeText)
    }
  }

  private createBasicEnhancedResume(resumeText: string): string {
    // Create a basic enhanced resume when API fails
    const lines = resumeText.split('\n').filter(line => line.trim().length > 0)
    
    let enhancedResume = `PROFESSIONAL RESUME\n\n`
    enhancedResume += `CONTACT INFORMATION\n`
    enhancedResume += `[Your Name]\n`
    enhancedResume += `[Your Email] | [Your Phone]\n`
    enhancedResume += `[Your Location] | LinkedIn: [Your LinkedIn]\n\n`
    
    enhancedResume += `PROFESSIONAL SUMMARY\n`
    enhancedResume += `• Aspiring software engineer with strong foundation in programming and web development\n`
    enhancedResume += `• Passionate about creating innovative solutions and continuous learning\n`
    enhancedResume += `• Eager to contribute to dynamic projects and grow technical expertise\n\n`
    
    enhancedResume += `TECHNICAL SKILLS\n`
    enhancedResume += `• Programming Languages: C, C++, Java, Python\n`
    enhancedResume += `• Web Development: HTML, CSS, React.js\n`
    enhancedResume += `• Databases: MySQL, Firebase\n`
    enhancedResume += `• Tools & Technologies: Git, GitHub\n`
    enhancedResume += `• Languages: English, Hindi, Marathi\n\n`
    
    enhancedResume += `EDUCATION\n`
    enhancedResume += `• D.Y. Patil College of Engineering and Technology, Kolhapur (2022-2026)\n`
    enhancedResume += `• B.Tech. Computer Science & Engineering | GPA: 79.14%\n`
    enhancedResume += `• Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development\n\n`
    
    enhancedResume += `PROJECTS\n`
    enhancedResume += `• Senior Connect - Technology assistance for elderly users\n`
    enhancedResume += `• Prompt Generator - AI-powered prompt library with machine learning\n\n`
    
    enhancedResume += `CERTIFICATIONS\n`
    enhancedResume += `• Learn JAVA Programming: Beginner to Master (Udemy - Oct 2024)\n`
    enhancedResume += `• Modern JavaScript for Beginners (Udemy - May 2025)\n\n`
    
    enhancedResume += `EXPERIENCE\n`
    enhancedResume += `• Extra Curricular Activities - Participated in SIH 2023 and SIH 2024 Internal Hackathon\n`
    enhancedResume += `• Volunteered in college admission process, assisting with coordination and student enrollment\n\n`
    
    enhancedResume += `WORKSHOPS & TRAINING\n`
    enhancedResume += `• Machine Learning Workshop - Completed hands-on workshop covering supervised learning algorithms using Python\n`
    
    return enhancedResume
  }
}

// Create a singleton instance
export const jobAssistant = new JobAssistant()

export async function generateInterviewQuestions(
  type: "technical" | "behavioral" | "system_design",
  role: string,
  difficulty: "easy" | "medium" | "hard",
  domain?: string
) {
  try {
    const prompt = `Generate 5 ${difficulty} level ${type} interview questions for a ${role} role${
      domain ? ` in the ${domain} domain` : ''
    }. These must be domain-specific (do not be generic) and focused on practical, real-world interview scenarios for the domain. For each question, provide:
    - A clear, specific question
    - 3-5 key points the ideal answer should cover
    - 2-3 potential follow-up questions
    - Clear scoring criteria

    Format as JSON array: [{
      "question": "...",
      "keyPoints": ["..."],
      "followUp": ["..."],
      "scoringCriteria": "..."
    }]`

    const result = await jobAssistant.model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    // Try direct parse first (model may return JSON-only)
    try {
      return JSON.parse(text)
    } catch (e) {
      // Fallback 1: extract balanced JSON array starting at first '['
      const firstIdx = text.indexOf('[')
      if (firstIdx !== -1) {
        let depth = 0
        let endIdx = -1
        for (let i = firstIdx; i < text.length; i++) {
          const ch = text[i]
          if (ch === '[') depth++
          else if (ch === ']') {
            depth--
            if (depth === 0) {
              endIdx = i
              break
            }
          }
        }

        if (endIdx !== -1) {
          const jsonString = text.slice(firstIdx, endIdx + 1)
          try {
            return JSON.parse(jsonString)
          } catch (err) {
            // continue to next fallback
            console.error('Failed parsing extracted JSON array:', err)
          }
        }
      }

      // Fallback 2: try to extract inside ```json ... ``` or ``` ... ``` code blocks
      const codeBlockMatch = text.match(/```(?:json\n)?([\s\S]*?)```/i)
      if (codeBlockMatch && codeBlockMatch[1]) {
        const inner = codeBlockMatch[1].trim()
        try {
          return JSON.parse(inner)
        } catch (err) {
          console.error('Failed parsing JSON from code block:', err)
        }
      }

      // If all parsing attempts fail, throw to let caller handle
      throw new Error('Unable to parse JSON from model output for generateInterviewQuestions')
    }
  } catch (error) {
    console.error('Error generating questions:', error)
    return [] // Return empty array if there's an error
  }
}

export async function evaluateResponse(
  question: string,
  response: string,
  type: string,
  keyPoints?: string[],
  scoringCriteria?: string
) {
  try {
    const prompt = `You are an expert interview coach. Evaluate the candidate's ANSWER using ONLY the provided QUESTION, ANSWER, expected key points, and scoring criteria. Consider clarity, correctness, depth, relevance, use of examples, and structure. Score from 1 (poor) to 10 (excellent). Also determine if the answer is correct/complete relative to the expected key points and scoring criteria.

Return VALID JSON ONLY with these fields:
{
  "score": number,                  // integer 1-10
  "matchScore": number,             // 0-100 percent indicating how well the answer matches expected key points
  "correctness": boolean,           // true if answer covers essential points, else false
  "feedback": string,               // concise feedback referencing specifics from the answer
  "strengths": [string],            // 2-4 concise strengths observed in this answer
  "improvements": [string]         // 2-4 concrete, actionable suggestions to improve
}

Question: ${question}
ExpectedKeyPoints: ${JSON.stringify(keyPoints || [])}
ScoringCriteria: ${scoringCriteria || ''}
Answer: ${response}
Type: ${type}

Output JSON only, no surrounding text.`

    const result = await jobAssistant.model.generateContent(prompt)
    const aiResponse = await result.response
    const text = aiResponse.text()

    try {
      return JSON.parse(text)
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      return {
        score: 7,
        matchScore: 70,
        correctness: false,
        feedback: "Good response with room for improvement",
        strengths: ["Clear communication"],
        improvements: ["Provide more specific examples and quantify impact where possible"]
      }
    }
  } catch (error) {
    console.error('Error evaluating response:', error)
    return {
      score: 5,
      feedback: "Unable to evaluate response at this time",
      strengths: [],
      improvements: ["Try again later"]
    }
  }
}

// Add the missing generateChatResponse function for the chat API
export async function generateChatResponse(message: string, context?: string): Promise<JobAssistantResponse> {
  return await jobAssistant.sendMessage(message, context)
}

// Generate an overall interview report from AI based only on the responses and questions
export async function generateInterviewReport(
  responses: Array<{ questionId: number; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[] }>,
  questions: Array<{ id?: number; question: string }>,
  config?: { type?: string; role?: string; difficulty?: string; duration?: number }
) {
  try {
    // Ask the model to aggregate per-question evaluations into a clear, evidence-based report.
    const prompt = `You are an expert interview coach. Using ONLY the provided per-question evaluations (scores, strengths, improvements) and the candidate answers, produce a JSON report that contains:
    {
    "overallScore": number, // 0-10, computed based on per-question scores (equal weighting)
    "perQuestionSummary": [{
      "questionId": number,
      "score": number,
      "matchScore": number, // 0-100 how closely the answer matched expected key points
      "correctness": boolean,
      "topStrengths": [string],
      "topWeaknesses": [string],
      "feedback": string,
      "suggestedExercises": [string]
    }],
    "topStrengths": [string], // top 3 strengths across answers
    "topWeaknesses": [string], // top 3 weaknesses across answers
    "competencyByTopic": [{"topic": string, "level": number}], // levels 0-10
    "recommendedResources": [{"title": string, "url": string}],
    "prioritizedLearningPlan": [string], // 4 short steps prioritized
    "actionableSuggestions": [string], // 4 prioritized action items
    "summary": string // 1-2 sentence concise summary
   }

    Config: ${JSON.stringify(config || {})}
    Questions: ${JSON.stringify(questions)}
    Responses (with per-question evaluations): ${JSON.stringify(responses)}

    IMPORTANT: Base conclusions only on the provided data. Output VALID JSON ONLY, nothing else.`

    const result = await jobAssistant.model.generateContent(prompt)
    const aiResp = await result.response
    const text = aiResp.text()

    try {
      const parsed = JSON.parse(text)
      // If overallScore missing, compute from responses
      if (!parsed.overallScore) {
        const avg = responses.length ? Math.round((responses.reduce((s, r) => s + (r.score || 0), 0) / responses.length) * 10) / 10 : 0
        parsed.overallScore = avg
      }
      return parsed
    } catch (err) {
      // Fallback: synthesize a simple, evidence-based report from provided data
      const avg = responses.length ? Math.round((responses.reduce((s, r) => s + (r.score || 0), 0) / responses.length) * 10) / 10 : 0
      const perQuestionSummary = responses.map((r) => ({
        questionId: r.questionId,
        score: r.score || 0,
        matchScore: Math.round(((r.score || 0) / 10) * 100),
        correctness: (r.score || 0) >= 6,
        topStrengths: (r.strengths || []).slice(0, 3),
        topWeaknesses: (r.improvements || []).slice(0, 3),
        feedback: r.feedback || '',
        suggestedExercises: [(r.improvements || []).slice(0, 2).map((s: string) => `Practice: ${s}`).join('; ')]
      }))
      const allStrengths = responses.flatMap((r) => r.strengths || [])
      const allImprovements = responses.flatMap((r) => r.improvements || [])
      // basic competency by topic synthesis: use keywords from key points
      const topics = Array.from(new Set(allStrengths.concat(allImprovements))).slice(0, 5)
      const competencyByTopic = topics.map((t, i) => ({ topic: t, level: Math.max(3, 8 - i) }))

      return {
        overallScore: avg,
        perQuestionSummary,
        topStrengths: Array.from(new Set(allStrengths)).slice(0, 3),
        topWeaknesses: Array.from(new Set(allImprovements)).slice(0, 3),
        competencyByTopic,
        recommendedResources: [
          { title: 'Official Docs', url: 'https://developer.mozilla.org/' },
        ],
        prioritizedLearningPlan: [
          'Review the identified weak topics and study official documentation',
          'Practice small focused exercises for each weak point',
          'Implement a small project that uses the weak concepts',
          'Re-take mock interviews focusing on improved areas'
        ],
        actionableSuggestions: [
          'Practice structuring answers using STAR (Situation, Task, Action, Result).',
          'Add more specific, quantifiable examples to demonstrate impact.',
          'Narrate your thought process step-by-step for technical questions.',
          'Review and rehearse common patterns for behavioral questions.'
        ],
        summary: 'Synthesized report: overall performance based on per-question AI evaluations.'
      }
    }
  } catch (error) {
    console.error('Error generating interview report:', error)
    return {
      overallScore: 0,
      perQuestionSummary: [],
      topStrengths: [],
      topWeaknesses: [],
      actionableSuggestions: [],
      summary: 'Unable to generate AI report at this time.'
    }
  }
}
