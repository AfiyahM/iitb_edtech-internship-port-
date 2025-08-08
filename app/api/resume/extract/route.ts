import { NextRequest, NextResponse } from "next/server"
import { inflate } from "zlib"
import { promisify } from "util"

// Dynamic imports to avoid initialization issues in edge/serverless
let mammoth: any

async function getMammothParser() {
  if (!mammoth) {
    mammoth = await import("mammoth")
  }
  return mammoth
}

// Better PDF text extraction that handles compressed content
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // First try to use pdf-parse if available
    try {
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(buffer)
      if (data.text && data.text.length > 50) {
        return data.text
      }
         } catch (pdfError: any) {
       console.log("pdf-parse failed, trying manual extraction:", pdfError?.message || 'Unknown error')
     }

    // Manual extraction for compressed PDFs
    const content = buffer.toString('binary')
    
    // Find compressed streams
    const streamMatches = content.match(/stream\r?\n([\s\S]*?)\r?\nendstream/g)
    
    if (streamMatches) {
      let extractedText = ""
      
      for (const streamMatch of streamMatches) {
        try {
          // Extract the stream content
          const streamContent = streamMatch.replace(/^stream\r?\n/, '').replace(/\r?\nendstream$/, '')
          
                     // Try to decompress if it's compressed
           let decompressed: Buffer
           try {
             decompressed = await promisify(inflate)(Buffer.from(streamContent, 'binary'))
           } catch {
             // If decompression fails, use as-is
             decompressed = Buffer.from(streamContent, 'binary')
           }
          
          const streamText = decompressed.toString('utf8')
          
          // Extract text operators
          const textMatches = streamText.match(/\(\(([^)]+)\)\)/g) || []
          const textContent = textMatches
            .map(match => match.replace(/\(\(|\)\)/g, ''))
            .join(' ')
          
          if (textContent.length > 10) {
            extractedText += textContent + " "
          }
          
          // Also look for TJ and Tj operators
          const tjMatches = streamText.match(/\[([^\]]+)\]\s*TJ/g) || []
          const tjContent = tjMatches
            .map(match => {
              const innerMatch = match.match(/\[([^\]]+)\]/)
              return innerMatch ? innerMatch[1].replace(/\(\(([^)]+)\)\)/g, '$1') : ''
            })
            .join(' ')
          
          if (tjContent.length > 10) {
            extractedText += tjContent + " "
          }
          
                 } catch (streamError: any) {
           console.log("Stream processing failed:", streamError?.message || 'Unknown error')
         }
      }
      
      if (extractedText.length > 50) {
        return extractedText.trim()
      }
    }
    
    // Fallback: try to extract any readable text
    const readableText = content
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    return readableText.length > 100 ? readableText : "PDF content extracted (text may be limited)"
  } catch (error) {
    console.error("PDF extraction error:", error)
    return "PDF content could not be extracted"
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("resume") as File

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let resumeText = ""

    if (file.type === "application/pdf") {
      try {
        resumeText = await extractTextFromPdf(buffer)
        if (!resumeText || resumeText.length < 50) {
          return NextResponse.json({ error: "Could not extract sufficient text from PDF" }, { status: 400 })
        }
      } catch (error) {
        console.error("PDF parsing error:", error)
        return NextResponse.json({ error: "Failed to parse PDF file" }, { status: 400 })
      }
    } else if (file.type.includes("wordprocessingml")) {
      try {
        const mammothParser = await getMammothParser()
        const { value } = await mammothParser.extractRawText({ buffer })
        resumeText = value || ""
      } catch (error) {
        console.error("DOCX parsing error:", error)
        return NextResponse.json({ error: "Failed to parse DOCX file" }, { status: 400 })
      }
    } else if (file.type.startsWith("text/")) {
      // Basic text files
      resumeText = buffer.toString("utf-8")
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // Normalize whitespace
    resumeText = resumeText.replace(/\r\n/g, "\n").trim()

    return NextResponse.json({ success: true, text: resumeText })
  } catch (error) {
    console.error("Resume extract error:", error)
    return NextResponse.json({ error: "Failed to extract resume text" }, { status: 500 })
  }
} 