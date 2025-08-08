import { NextRequest, NextResponse } from "next/server";
import { jobAssistant } from "@/lib/gemini"; // Your Gemini wrapper

// Dynamic imports to avoid initialization issues
let pdf: any;
let mammoth: any;

async function getPdfParser() {
  if (!pdf) {
    pdf = (await import("pdf-parse")).default;
  }
  return pdf;
}

async function getMammothParser() {
  if (!mammoth) {
    mammoth = await import("mammoth");
  }
  return mammoth;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    let resumeText = "";
    let targetRole = "";

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get("resume") as File;
      targetRole = formData.get("targetRole") as string;

      if (!file) {
        return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
      }

      // Parse file text
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf") {
        try {
          const pdfParser = await getPdfParser();
          const data = await pdfParser(buffer);
          resumeText = data.text;
        } catch (error) {
          console.error("PDF parsing error:", error);
          return NextResponse.json({ error: "Failed to parse PDF file" }, { status: 400 });
        }
      } else if (file.type.includes("wordprocessingml")) {
        try {
          const mammothParser = await getMammothParser();
          const { value } = await mammothParser.extractRawText({ buffer });
          resumeText = value;
        } catch (error) {
          console.error("DOCX parsing error:", error);
          return NextResponse.json({ error: "Failed to parse DOCX file" }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
      }
    } else {
      // Handle JSON request (for existing frontend compatibility)
      const { resumeContent, targetRole: role } = await req.json();
      resumeText = resumeContent;
      targetRole = role;

      if (!resumeText) {
        return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
      }
    }

    // Send parsed text to Gemini for ATS analysis
    const analysis = await jobAssistant.analyzeResumeATS(resumeText);

    // Job-specific optimization if role is given
    let jobOptimization = null;
    if (targetRole) {
      const jobDescription = `Role: ${targetRole}. Focus on relevant skills, problem-solving, and measurable achievements.`;
      jobOptimization = await jobAssistant.optimizeResumeForJob(resumeText, jobDescription);
    }

    // Optional: Ask Gemini to enhance/rewrite the resume text
    const enhancedResume = await jobAssistant.enhanceResume(resumeText);

    return NextResponse.json({
      success: true,
      analysis: {
        atsScore: analysis.atsScore,
        breakdown: analysis.breakdown,
        feedback: analysis.feedback,
        suggestions: analysis.suggestions,
        optimizationTips: analysis.optimizationTips,
        strengths: analysis.strengths,
        areasForImprovement: analysis.areasForImprovement,
        jobOptimization,
        enhancedResume
      }
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
