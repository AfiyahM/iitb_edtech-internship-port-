import { NextRequest, NextResponse } from "next/server";
import { inflate } from "zlib";
import { promisify } from "util";
import { jobAssistant } from "@/lib/gemini";

let mammoth: any;

async function getMammothParser() {
  if (!mammoth) {
    mammoth = await import("mammoth");
  }
  return mammoth;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      if (data.text && data.text.length > 50) {
        return data.text;
      }
    } catch (pdfError: any) {
      console.log("pdf-parse failed, trying manual extraction:", pdfError?.message || 'Unknown error');
    }

    const content = buffer.toString('binary');
    const streamMatches = content.match(/stream\r?\n([\s\S]*?)\r?\nendstream/g);

    if (streamMatches) {
      let extractedText = "";
      for (const streamMatch of streamMatches) {
        try {
          const streamContent = streamMatch.replace(/^stream\r?\n/, '').replace(/\r?\nendstream$/, '');
          let decompressed: Buffer;
          try {
            decompressed = await promisify(inflate)(Buffer.from(streamContent, 'binary'));
          } catch {
            decompressed = Buffer.from(streamContent, 'binary');
          }
          const streamText = decompressed.toString('utf8');
          const textMatches = streamText.match(/\(\(([^)]+)\)\)/g) || [];
          const textContent = textMatches.map(match => match.replace(/\(\(|\)\)/g, '')).join(' ');
          if (textContent.length > 10) {
            extractedText += textContent + " ";
          }
          const tjMatches = streamText.match(/\[([^\]]+)\]\s*TJ/g) || [];
          const tjContent = tjMatches
            .map(match => {
              const innerMatch = match.match(/\[([^\]]+)\]/);
              return innerMatch ? innerMatch[1].replace(/\(\(([^)]+)\)\)/g, '$1') : '';
            })
            .join(' ');
          if (tjContent.length > 10) {
            extractedText += tjContent + " ";
          }
        } catch (streamError: any) {
          console.log("Stream processing failed:", streamError?.message || 'Unknown error');
        }
      }
      if (extractedText.length > 50) {
        return extractedText.trim();
      }
    }

    const readableText = content
      .replace(/[^\x20-\x7E\n\r\t]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return readableText.length > 100 ? readableText : "PDF content extracted (text may be limited)";
  } catch (error) {
    console.error("PDF extraction error:", error);
    return "PDF content could not be extracted";
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    let resumeText = "";
    let targetRole = "";

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("resume") as File;
      targetRole = (formData.get("targetRole") as string) || "";

      if (!file) {
        return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf") {
        try {
          resumeText = await extractTextFromPdf(buffer);
          if (!resumeText || resumeText.length < 50) {
            return NextResponse.json({ error: "Could not extract sufficient text from PDF" }, { status: 400 });
          }
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
      const { resumeContent, targetRole: role } = await req.json();
      resumeText = resumeContent;
      targetRole = role || "";

      if (!resumeText) {
        return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
      }
    }

    const analysis = await jobAssistant.analyzeResumeATS(resumeText);

    let jobOptimization = null;
    if (targetRole) {
      const jobDescription = `Role: ${targetRole}. Focus on relevant skills, problem-solving, and measurable achievements.`;
      jobOptimization = await jobAssistant.optimizeResumeForJob(resumeText, jobDescription);
    }

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
        professionalRecommendations: analysis.professionalRecommendations,
        quantifiableExamples: analysis.quantifiableExamples,
        skillGaps: analysis.skillGaps,
        jobOptimization,
        enhancedResume
      }
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
