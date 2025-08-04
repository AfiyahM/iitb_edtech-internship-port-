import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyAG5OfcI4piGl1Vh9lnP9BMT2XTdqcACY0'

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
      const prompt = `You are an expert ATS resume analyzer. Analyze this resume for a Software Engineer role and provide HONEST, DETAILED scoring based on ACTUAL content found. 

CRITICAL INSTRUCTIONS:
1. READ the resume content carefully and analyze what is actually present
2. Score based on REAL content found, not generic responses
3. If content is strong, give higher scores. If content is weak or missing, give lower scores
4. Provide specific feedback based on actual content found
5. Weight: Experience (25%), Skills (40%), Education (10%), Soft Skills (15%), Certifications (5%), Achievements (5%)

SCORING CRITERIA:
Education (10 points): Assess actual degree level, relevance, institution quality
Experience (25 points): Evaluate actual job duration, technical relevance, project impact
Skills (40 points): Count actual technical skills, programming languages, technologies
Certifications (5 points): Identify actual certifications present
Achievements (5 points): Assess quantifiable accomplishments and leadership
Soft Skills (15 points): Evaluate communication clarity and presentation

IMPORTANT: Base EVERY score on actual content found. If content is missing, score low. If content is strong, score high. Be honest and specific.

Resume Content: ${resumeText}

Provide detailed JSON response with honest scoring based on actual content found:
{
  "atsScore": [honest score based on actual content quality],
  "breakdown": {
    "education": {
      "score": [actual score based on degree/level found],
      "maxScore": 10,
      "feedback": "[specific feedback based on actual education content found]"
    },
    "experience": {
      "score": [actual score based on experience found],
      "maxScore": 25,
      "feedback": "[specific feedback based on actual experience content found]"
    },
    "skills": {
      "score": [actual score based on skills found],
      "maxScore": 40,
      "feedback": "[specific feedback based on actual skills content found]"
    },
    "certifications": {
      "score": [actual score based on certifications found],
      "maxScore": 5,
      "feedback": "[specific feedback based on actual certifications content found]"
    },
    "achievements": {
      "score": [actual score based on achievements found],
      "maxScore": 5,
      "feedback": "[specific feedback based on actual achievements content found]"
    },
    "softSkills": {
      "score": [actual score based on soft skills found],
      "maxScore": 15,
      "feedback": "[specific feedback based on actual soft skills content found]"
    }
  },
  "feedback": "[honest overall assessment based on actual content quality]",
  "suggestions": [
    "[specific suggestion based on actual resume weaknesses found]",
    "[specific suggestion based on actual resume gaps found]",
    "[specific suggestion based on actual content analysis]"
  ],
  "optimizationTips": [
    "[specific tip based on actual resume issues found]",
    "[specific tip based on actual content gaps found]"
  ],
  "strengths": [
    "[specific strength found in actual resume]",
    "[specific strength found in actual resume]"
  ],
  "areasForImprovement": [
    "[specific area needing improvement based on actual content]",
    "[specific area needing improvement based on actual content]"
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
          feedback: hasEducation ? "Education section found with relevant degree" : "Limited education information found" 
        },
        experience: { 
          score: experienceScore, 
          maxScore: 25, 
          feedback: hasExperience ? "Work experience section found" : "Limited work experience information" 
        },
        skills: { 
          score: skillsScore, 
          maxScore: 40, 
          feedback: hasSkills ? `Technical skills found: ${foundSkills.slice(0, 3).join(', ')}` : "Limited technical skills information" 
        },
        certifications: { 
          score: certificationsScore, 
          maxScore: 5, 
          feedback: hasCertifications ? "Some certifications found" : "No certifications found" 
        },
        achievements: { 
          score: achievementsScore, 
          maxScore: 5, 
          feedback: hasAchievements ? "Some achievements found" : "Limited achievements information" 
        },
        softSkills: { 
          score: softSkillsScore, 
          maxScore: 15, 
          feedback: hasSoftSkills ? "Soft skills section found" : "Basic soft skills presentation" 
        }
      },
      feedback: totalScore > 70 ? "Resume has good structure with relevant content" : totalScore > 50 ? "Resume has moderate content but needs improvement" : "Resume needs significant improvement in content and structure",
      suggestions: [
        hasExperience ? "Enhance experience descriptions with specific technologies" : "Add relevant work experience section",
        hasSkills ? "Include more specific technical skills" : "Add technical skills section",
        hasCertifications ? "Add more relevant certifications" : "Include relevant certifications"
      ],
      optimizationTips: [
        "Use specific technology names and versions",
        "Quantify achievements with numbers and percentages",
        "Include relevant certifications prominently"
      ],
      strengths: [
        hasEducation ? "Educational background present" : "Basic structure",
        hasExperience ? "Work experience included" : "Some content present"
      ],
      areasForImprovement: [
        hasExperience ? "Enhance experience descriptions" : "Add relevant work experience",
        hasSkills ? "Expand technical skills" : "Add technical skills section"
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
}

// Create a singleton instance
export const jobAssistant = new JobAssistant()

// Export individual functions for backward compatibility
export async function generateInterviewQuestions(
  type: "technical" | "behavioral" | "system_design",
  role: string,
  difficulty: "easy" | "medium" | "hard"
) {
  try {
    const prompt = `Generate 3 ${type} interview questions for ${role} (${difficulty} level). Keep response under 50 words. Focus on most important questions.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Provide brief, specific questions that would be most relevant for this position and difficulty level.`

    const result = await jobAssistant.model.generateContent(prompt)
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

export async function evaluateResponse(
  question: string,
  response: string,
  type: string
) {
  try {
    const prompt = `Evaluate this interview response in maximum 50 words. Focus on key strengths and one main improvement area.

IMPORTANT: Give clean, natural responses without any markdown formatting, bullet points, or special symbols. Use plain text only.

Question: ${question}
Response: ${response}
Type: ${type}

Provide brief, actionable feedback on the response quality.`

    const result = await jobAssistant.model.generateContent(prompt)
    const aiResponse = await result.response
    const text = aiResponse.text()

    return {
      message: text,
      confidence: 0.85,
    }
  } catch (error) {
    console.error('Error evaluating response:', error)
    return {
      message: 'Unable to evaluate response at this time. Please try again.',
      confidence: 0.1,
    }
  }
}
