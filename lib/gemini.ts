import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Resume analysis function using Gemini
export async function analyzeResume(resumeContent: string, targetRole: string) {
  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    system: `You are an expert resume reviewer and career counselor. Analyze resumes for ATS compatibility, content quality, and alignment with target roles.`,
    prompt: `Analyze this resume for a ${targetRole} position:

${resumeContent}

Provide:
1. Overall score (0-100)
2. ATS compatibility score
3. Content quality score
4. Skills match score
5. Specific improvement suggestions
6. Missing skills or sections

Format as JSON with scores and detailed feedback.`,
  })

  return JSON.parse(text)
}

// Generate interview questions using Gemini
export async function generateInterviewQuestions(
  type: "technical" | "behavioral" | "system_design",
  role: string,
  difficulty: "easy" | "medium" | "hard",
) {
  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    system: `You are an expert interviewer creating realistic interview questions for ${role} positions.`,
    prompt: `Generate 5 ${type} interview questions for a ${role} internship position.
Difficulty level: ${difficulty}

For each question, provide:
1. The question
2. Key points to look for in answers
3. Follow-up questions
4. Scoring criteria (1-10 scale)

Format as JSON array.`,
  })

  return JSON.parse(text)
}

// Evaluate interview response using Gemini
export async function evaluateResponse(question: string, response: string, type: string) {
  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    system: `You are an expert interviewer evaluating candidate responses. Provide constructive feedback and scoring.`,
    prompt: `Question: ${question}
Response: ${response}
Interview Type: ${type}

Evaluate this response and provide:
1. Score (1-10)
2. Strengths
3. Areas for improvement
4. Specific suggestions
5. Overall feedback

Format as JSON.`,
  })

  return JSON.parse(text)
}

// Generate learning path recommendations using Gemini
export async function generateLearningPath(careerGoal: string, currentSkills: string[], targetRole: string) {
  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    system: `You are a career development expert creating personalized learning paths for students.`,
    prompt: `Create a learning path for someone with:
Career Goal: ${careerGoal}
Current Skills: ${currentSkills.join(", ")}
Target Role: ${targetRole}

Provide:
1. Skill gaps to address
2. Recommended learning modules (with estimated time)
3. Project suggestions
4. Milestone checkpoints
5. Resources and tools to use

Format as structured JSON with modules, timelines, and priorities.`,
  })

  return JSON.parse(text)
}

// Skill gap analysis using Gemini
export async function analyzeSkillGap(userSkills: string[], jobRequirements: string[]) {
  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    system: `You are a career advisor analyzing skill gaps between candidate profiles and job requirements.`,
    prompt: `User Skills: ${userSkills.join(", ")}
Job Requirements: ${jobRequirements.join(", ")}

Analyze and provide:
1. Matching skills (percentage)
2. Missing critical skills
3. Skills to prioritize learning
4. Estimated time to bridge gaps
5. Learning resource recommendations

Format as JSON with detailed analysis.`,
  })

  return JSON.parse(text)
}

// Chat assistant using Gemini
export async function generateChatResponse(message: string, context?: string) {
  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    system: `You are an AI career assistant for InternDeck, a platform that helps students find and prepare for internships. You provide helpful, encouraging, and actionable advice about:

- Resume writing and optimization
- Interview preparation and practice
- Internship search strategies
- Skill development recommendations
- Career guidance and planning
- Application tips and best practices

Keep responses concise, friendly, and focused on actionable advice. If asked about specific features, guide users to the relevant sections of the platform.

${context ? `Context: ${context}` : ""}`,
    prompt: message,
  })

  return text
}
