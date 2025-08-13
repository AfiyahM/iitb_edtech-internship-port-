import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "API is working",
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: "POST request received",
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to parse request body",
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
