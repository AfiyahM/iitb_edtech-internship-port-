import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // pdf-parse needs Node APIs

export async function POST(req: NextRequest) {
  try {
    console.log("=== DEBUG PARSE ENDPOINT CALLED ===");
    const contentType = req.headers.get("content-type");
    console.log("Content-Type:", contentType);

    // Handle raw binary data instead of multipart/form-data
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("Buffer size:", buffer.length);
    console.log("Buffer preview (first 100 bytes):", buffer.toString('hex').substring(0, 200));
    
    // Check if buffer is empty or corrupted
    if (buffer.length === 0) {
      console.log("Buffer is empty");
      return NextResponse.json({ error: "File appears to be empty or corrupted" }, { status: 400 });
    }

    let extractedText = "";
    let parseMethod = "";

    // Determine file type from content-type header
    const isPDF = contentType === "application/pdf";
    const isDOCX = contentType?.includes("wordprocessingml") || contentType?.includes("vnd.openxmlformats-officedocument.wordprocessingml");
    const isDOC = contentType?.includes("msword") || contentType === "application/msword";
    
    console.log("File type analysis:", { 
      contentType, 
      isPDF, 
      isDOCX, 
      isDOC 
    });

    if (isPDF) {
      console.log("Attempting PDF parsing...");
      parseMethod = "PDF";
      try {
        // Import pdf-parse dynamically so it stays server-only
        const pdfModule = await import("pdf-parse");
        const pdfParse = pdfModule.default ?? pdfModule;
        
        console.log("PDF parser loaded successfully");
        console.log("Calling pdfParse with buffer of size:", buffer.length);
        
        // Pass the buffer directly
        const data = await pdfParse(buffer);
        
        console.log("PDF parser returned data:", typeof data);
        console.log("PDF data keys:", Object.keys(data || {}));
        extractedText = data.text || data.toString() || "";
        console.log("PDF parsing successful, text length:", extractedText.length);
        console.log("PDF text preview:", extractedText.substring(0, 200));
      } catch (error) {
        console.error("PDF parsing failed:", error);
        console.error("PDF parsing error details:", {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // If PDF parsing fails, try to provide a more helpful error message
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        if (errorMessage.includes("ENOENT") || errorMessage.includes("no such file")) {
          return NextResponse.json({ 
            error: "PDF parsing failed - file path issue detected", 
            details: "The PDF parser is trying to access a local file path instead of processing the uploaded buffer. This may be a compatibility issue with the current environment.",
            parseMethod: "PDF",
            suggestion: "Try uploading a different PDF file or convert to DOCX format"
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          error: "PDF parsing failed", 
          details: errorMessage,
          parseMethod: "PDF"
        }, { status: 400 });
      }
    } else if (isDOCX || isDOC) {
      console.log("Attempting DOCX/DOC parsing...");
      parseMethod = "DOCX/DOC";
      try {
        const mammothModule = await import("mammoth");
        const mammoth = mammothModule.default ?? mammothModule;
        
        console.log("Mammoth parser loaded successfully");
        console.log("Calling mammoth.extractRawText with buffer of size:", buffer.length);
        const result = await mammoth.extractRawText({ buffer });
        console.log("Mammoth parser returned result:", typeof result);
        console.log("Mammoth result keys:", Object.keys(result || {}));
        extractedText = result.value || result.toString() || "";
        console.log("DOCX/DOC parsing successful, text length:", extractedText.length);
        console.log("DOCX/DOC text preview:", extractedText.substring(0, 200));
      } catch (error) {
        console.error("DOCX/DOC parsing failed:", error);
        console.error("DOCX/DOC parsing error details:", {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json({ 
          error: "DOCX/DOC parsing failed", 
          details: error instanceof Error ? error.message : "Unknown error",
          parseMethod: "DOCX/DOC"
        }, { status: 400 });
      }
    } else {
      console.log("Unsupported file type:", contentType);
      return NextResponse.json({ 
        error: "Unsupported file type", 
        contentType,
        parseMethod: "NONE"
      }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.log("No text extracted from file");
      return NextResponse.json({ 
        error: "No text extracted from file", 
        parseMethod,
        contentType
      }, { status: 400 });
    }

    console.log("=== DEBUG PARSE SUCCESSFUL ===");
    return NextResponse.json({
      success: true,
      extractedText: extractedText.substring(0, 1000), // Limit for debugging
      textLength: extractedText.length,
      parseMethod,
      contentType
    });

  } catch (error) {
    console.error("=== DEBUG PARSE ERROR ===", error);
    return NextResponse.json({ 
      error: "Debug parse failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
