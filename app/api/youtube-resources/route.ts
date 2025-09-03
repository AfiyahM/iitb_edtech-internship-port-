import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), "webscrapper", "youtube_resources.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const resources = JSON.parse(data);
    return NextResponse.json(resources);
  } catch (e) {
    return NextResponse.json({ error: "Could not load YouTube resources" }, { status: 500 });
  }
}
