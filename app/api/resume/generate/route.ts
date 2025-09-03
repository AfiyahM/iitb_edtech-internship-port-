// app/api/resume/generate/route.ts
import { NextResponse } from "next/server"

function escapeHtml(input: any) {
  if (input === undefined || input === null) return ""
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function makePlainText(data: any) {
  const p = data.personal || {}
  const lines: string[] = []
  lines.push(`${p.firstName || ""} ${p.lastName || ""}`.trim())
  lines.push(`${p.email || ""} | ${p.phone || ""} | ${p.location || ""}`)
  if (p.linkedin) lines.push(`LinkedIn: ${p.linkedin}`)
  if (p.github) lines.push(`GitHub: ${p.github}`)
  lines.push("\nEDUCATION")
  const ed = data.education || {}
  lines.push(`${ed.degree || ""} in ${ed.major || ""}`.trim())
  if (ed.university) lines.push(ed.university)
  if (ed.gpa) lines.push(`GPA: ${ed.gpa}`)
  lines.push("\nEXPERIENCE")
  ;(data.experiences || []).forEach((exp: any) => {
    lines.push(`${exp.title || ""} — ${exp.company || ""}`)
    if (exp.duration) lines.push(exp.duration)
    if (exp.description) lines.push(exp.description)
    lines.push("") // blank line
  })
  lines.push("\nPROJECTS")
  ;(data.projects || []).forEach((proj: any) => {
    lines.push(`${proj.name || ""}`)
    if (proj.technologies) lines.push(`Technologies: ${proj.technologies}`)
    if (proj.link) lines.push(`Link: ${proj.link}`)
    if (proj.description) lines.push(proj.description)
    lines.push("")
  })
  lines.push("\nSKILLS")
  const skills = data.skills || {}
  if (skills.programming?.length) lines.push(`Programming: ${skills.programming.join(", ")}`)
  if (skills.frameworks?.length) lines.push(`Frameworks: ${skills.frameworks.join(", ")}`)
  if (skills.tools?.length) lines.push(`Tools: ${skills.tools.join(", ")}`)
  return lines.join("\n")
}

function makeHtml(data: any) {
  const p = data.personal || {}
  const ed = data.education || {}
  const exp = data.experiences || []
  const projects = data.projects || []
  const skills = data.skills || {}

  // Minimal, ATS-friendly HTML (no images, semantic headings, bullet lists)
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)} - Resume</title>
  <style>
    /* very simple, ATS-friendly */
    body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12pt; margin: 36px; }
    header { margin-bottom: 12px; }
    h1 { font-size: 18pt; margin: 0; }
    .contact { margin-top: 6px; font-size: 10.5pt; color: #333; }
    h2 { font-size: 11pt; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    ul { margin: 0; padding-left: 18px; }
    li { margin-bottom: 4px; }
    .muted { color: #333; font-size: 10pt }
    .section { margin-top: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}</h1>
    <div class="contact">${escapeHtml(p.email)}${p.phone ? " | " + escapeHtml(p.phone) : ""}${p.location ? " | " + escapeHtml(p.location) : ""}</div>
    <div class="contact">${p.linkedin ? "LinkedIn: " + escapeHtml(p.linkedin) : ""}${p.github ? (p.linkedin ? " | " : "") + "GitHub: " + escapeHtml(p.github) : ""}</div>
  </header>

  <section class="section">
    <h2>Education</h2>
    <div class="muted">
      ${escapeHtml(ed.degree)}${ed.major ? " in " + escapeHtml(ed.major) : ""}<br/>
      ${escapeHtml(ed.university)} ${ed.gpa ? "• GPA: " + escapeHtml(ed.gpa) : ""} ${ed.graduation ? "• " + escapeHtml(ed.graduation) : ""}
    </div>
  </section>

  <section class="section">
    <h2>Experience</h2>
    ${exp.map((e: any) => `
      <div style="margin-bottom:8px;">
        <div style="font-weight:bold;">${escapeHtml(e.title)} — ${escapeHtml(e.company)}</div>
        <div class="muted">${escapeHtml(e.duration)}</div>
        <div>${escapeHtml(e.description).replaceAll('\\n','<br/>')}</div>
      </div>
    `).join("")}
  </section>

  <section class="section">
    <h2>Projects</h2>
    ${projects.map((pr: any) => `
      <div style="margin-bottom:8px;">
        <div style="font-weight:bold;">${escapeHtml(pr.name)}${pr.link ? " — " + `<a href="${escapeHtml(pr.link)}">${escapeHtml(pr.link)}</a>` : ""}</div>
        <div class="muted">${pr.technologies ? "Technologies: " + escapeHtml(pr.technologies) : ""}</div>
        <div>${escapeHtml(pr.description).replaceAll('\\n','<br/>')}</div>
      </div>
    `).join("")}
  </section>

  <section class="section">
    <h2>Skills</h2>
    <div class="muted">
      ${skills.programming?.length ? "<div>Programming: " + escapeHtml(skills.programming.join(", ")) + "</div>" : ""}
      ${skills.frameworks?.length ? "<div>Frameworks: " + escapeHtml(skills.frameworks.join(", ")) + "</div>" : ""}
      ${skills.tools?.length ? "<div>Tools: " + escapeHtml(skills.tools.join(", ")) + "</div>" : ""}
    </div>
  </section>

</body>
</html>`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resumeHtml = makeHtml(body)
    const resumeText = makePlainText(body)

    return NextResponse.json({ success: true, resumeHtml, resumeText })
  } catch (err: any) {
    console.error("generate resume error", err)
    return NextResponse.json({ success: false, error: (err && err.message) || "Server error" }, { status: 500 })
  }
}
