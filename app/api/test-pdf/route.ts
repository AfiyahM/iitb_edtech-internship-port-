import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== TEST PDF ENDPOINT CALLED ===");
    
    // Test if pdf-parse can be imported
    let pdfParse;
    try {
      pdfParse = (await import("pdf-parse")).default;
      console.log("PDF-parse imported successfully");
    } catch (importError) {
      console.error("Failed to import pdf-parse:", importError);
      return NextResponse.json({ 
        error: "PDF-parse import failed", 
        details: importError instanceof Error ? importError.message : "Unknown error"
      }, { status: 500 });
    }

    // Test if mammoth can be imported
    let mammoth;
    try {
      mammoth = await import("mammoth");
      console.log("Mammoth imported successfully");
    } catch (importError) {
      console.error("Failed to import mammoth:", importError);
      return NextResponse.json({ 
        error: "Mammoth import failed", 
        details: importError instanceof Error ? importError.message : "Unknown error"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Both PDF and DOCX parsing libraries are available",
      libraries: {
        pdfParse: "Available",
        mammoth: "Available"
      }
    });

  } catch (error) {
    console.error("=== TEST PDF ERROR ===", error);
    return NextResponse.json({ 
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
