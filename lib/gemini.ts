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
  feedback: string
  suggestions: string[]
  optimizationTips: string[]
}

export interface JobMatchAnalysis {
  matchScore: number
  missingSkills: string[]
  recommendations: string[]
  optimizationSuggestions: string[]
}

export class JobAssistant {
  public model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  async sendMessage(message: string, context?: string): Promise<JobAssistantResponse> {
    try {
      // Add system context to the message
      const systemPrompt = `You are a professional job search and career development assistant. Your role is to help users with:
        
        1. Resume writing and optimization
        2. Interview preparation and practice
        3. Job search strategies
        4. Career advice and guidance
        5. Skills assessment and development
        6. Networking tips
        7. Salary negotiation
        8. Industry insights
        
        Always provide practical, actionable advice. Be encouraging but realistic. 
        If you don't know something, say so rather than making up information.
        
        CRITICAL: Keep responses extremely concise - maximum 50 words. Provide only the most essential information in a clear, direct manner. No unnecessary details or explanations.
        
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
      const prompt = `Analyze this resume for ATS compatibility and provide a score out of 100. Focus on:
      1. Keyword optimization
      2. Format compatibility
      3. Content structure
      4. Skills alignment
      
      Resume: ${resumeText}
      
      Provide JSON response:
      {
        "atsScore": 85,
        "feedback": "Brief feedback",
        "suggestions": ["suggestion1", "suggestion2"],
        "optimizationTips": ["tip1", "tip2"]
      }`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        // Fallback response
        return {
          atsScore: 75,
          feedback: "Resume needs keyword optimization and better formatting for ATS systems.",
          suggestions: ["Add more relevant keywords", "Improve formatting"],
          optimizationTips: ["Use standard fonts", "Include relevant skills"]
        }
      }
    } catch (error) {
      console.error('Error analyzing resume ATS:', error)
      return {
        atsScore: 70,
        feedback: "Unable to analyze resume at this time.",
        suggestions: ["Try again later"],
        optimizationTips: ["Check formatting"]
      }
    }
  }

  async optimizeResumeForJob(resumeText: string, jobDescription: string): Promise<JobMatchAnalysis> {
    try {
      const prompt = `Compare this resume with the job description and provide optimization suggestions. Focus on:
      1. Skills match
      2. Keyword alignment
      3. Experience relevance
      
      Resume: ${resumeText}
      Job Description: ${jobDescription}
      
      Provide JSON response:
      {
        "matchScore": 80,
        "missingSkills": ["skill1", "skill2"],
        "recommendations": ["rec1", "rec2"],
        "optimizationSuggestions": ["suggestion1", "suggestion2"]
      }`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        // Fallback response
        return {
          matchScore: 75,
          missingSkills: ["Add relevant skills"],
          recommendations: ["Align experience with job requirements"],
          optimizationSuggestions: ["Include job-specific keywords"]
        }
      }
    } catch (error) {
      console.error('Error optimizing resume for job:', error)
      return {
        matchScore: 70,
        missingSkills: ["Unable to analyze"],
        recommendations: ["Try again later"],
        optimizationSuggestions: ["Check job requirements"]
      }
    }
  }

  async analyzeResume(resumeText: string): Promise<JobAssistantResponse> {
    try {
      const prompt = `Analyze this resume and provide feedback in maximum 50 words. Focus on the most critical improvements needed.

      Resume:
      ${resumeText}
      
      Provide only the most essential feedback in a concise, direct manner.`

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
        message: 'I apologize, but I\'m having trouble analyzing your resume right now. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async analyzeDocument(fileContent: string, fileType: string): Promise<JobAssistantResponse> {
    try {
      const prompt = `Analyze this ${fileType} document and provide a brief assessment in maximum 50 words. Focus on the most important points.

      Document content:
      ${fileContent}
      
      Provide only the key insights and most critical recommendations.`

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
        message: 'I apologize, but I\'m having trouble analyzing your document right now. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async generateInterviewQuestions(jobTitle: string, company: string = ''): Promise<JobAssistantResponse> {
    try {
      const prompt = `Generate 3-4 key interview questions for a ${jobTitle} position${company ? ` at ${company}` : ''} in maximum 50 words. Focus on the most important questions only.`

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
        message: 'I apologize, but I\'m having trouble generating interview questions right now. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async provideCareerAdvice(topic: string, context: string = ''): Promise<JobAssistantResponse> {
    try {
      const prompt = `Provide brief career advice on: ${topic} in maximum 50 words. Focus on the most actionable tip.

      Context: ${context || 'General career development'}
      
      Give only the most essential, actionable advice.`

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
        message: 'I apologize, but I\'m having trouble providing career advice right now. Please try again.',
        confidence: 0.1,
      }
    }
  }

  async suggestSkills(jobTitle: string, experience: string = ''): Promise<JobAssistantResponse> {
    try {
      const prompt = `Suggest 3-4 most important skills for a ${jobTitle} position in maximum 50 words. Focus on the most critical skills only.

      Experience level: ${experience || 'Entry to mid-level'}`

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
        message: 'I apologize, but I\'m having trouble suggesting skills right now. Please try again.',
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
    const prompt = `Generate 3-4 ${type} interview questions for a ${role} position in maximum 50 words. Focus on the most important questions only.

    Difficulty level: ${difficulty}
    
    Format as JSON array with the following structure:
    [
      {
        "id": 1,
        "question": "Question text",
        "keyPoints": ["point1", "point2"],
        "followUp": ["follow-up1", "follow-up2"],
        "scoringCriteria": "Detailed scoring criteria"
      }
    ]`

    const result = await jobAssistant.model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON, fallback to structured response if parsing fails
    try {
      return JSON.parse(text)
    } catch {
      // Return structured mock data if JSON parsing fails
      return [
        {
          id: 1,
          question: "Explain the difference between let, const, and var in JavaScript.",
          keyPoints: ["Hoisting", "Block scope", "Reassignment"],
          followUp: ["How does this affect closures?", "What are the best practices?"],
          scoringCriteria: "Understanding of scope, hoisting, and modern JavaScript features"
        },
        {
          id: 2,
          question: "Describe how you would implement a simple authentication system.",
          keyPoints: ["Password hashing", "Session management", "Security considerations"],
          followUp: ["How would you handle password reset?", "What about 2FA?"],
          scoringCriteria: "Security awareness, system design thinking, practical implementation"
        }
      ]
    }
  } catch (error) {
    console.error('Error generating interview questions:', error)
    return []
  }
}

export async function evaluateResponse(
  question: string,
  response: string,
  type: string
) {
  try {
    const prompt = `Evaluate this interview response in maximum 50 words. Focus on the most critical feedback.

    Question: ${question}
    Response: ${response}
    Interview Type: ${type}
    
    Provide evaluation in JSON format:
    {
      "score": 8,
      "feedback": "Brief feedback",
      "strengths": ["strength1"],
      "improvements": ["improvement1"]
    }`

    const result = await jobAssistant.model.generateContent(prompt)
    const aiResponse = await result.response
    const text = aiResponse.text()

    try {
      return JSON.parse(text)
    } catch {
      // Return structured mock evaluation if JSON parsing fails
      return {
        score: 7,
        feedback: "Good response with room for improvement",
        strengths: ["Clear communication"],
        improvements: ["Add more specific examples"]
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
