// app/api/resume/generate/route.ts
import { NextResponse } from "next/server"

function escapeHtml(input: any) {
  if (input === undefined || input === null) return ""
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
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
  if (ed.university) lines.push(ed.university)
  lines.push(`${ed.degree || ""} in ${ed.major || ""}`.trim())
  if (ed.gpa) lines.push(`GPA: ${ed.gpa}`)
  if (ed.graduation) lines.push(`Graduation: ${ed.graduation}`)
  if (ed.coursework) lines.push(`Relevant Coursework: ${ed.coursework}`)
  
  lines.push("\nEXPERIENCE")
  ;(data.experiences || []).forEach((exp: any) => {
    if (exp.title && exp.company) {
      lines.push(`${exp.title || ""} — ${exp.company || ""}`)
      if (exp.duration) lines.push(exp.duration)
      if (exp.description) lines.push(exp.description)
      lines.push("") // blank line
    }
  })
  
  lines.push("\nPROJECTS")
  ;(data.projects || []).forEach((proj: any) => {
    if (proj.name) {
      lines.push(`${proj.name || ""}`)
      if (proj.technologies) lines.push(`Technologies: ${proj.technologies}`)
      if (proj.link) lines.push(`Link: ${proj.link}`)
      if (proj.description) lines.push(proj.description)
      lines.push("")
    }
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

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.15;
      margin: 0.5in;
      color: #000;
      background: #fff;
    }
    h1 {
      font-size: 16pt;
      margin: 0 0 8pt 0;
      text-align: center;
      font-weight: bold;
    }
    h2 {
      font-size: 12pt;
      margin: 12pt 0 4pt 0;
      font-weight: bold;
      border-bottom: 1px solid #000;
      padding-bottom: 2pt;
    }
    .contact {
      text-align: center;
      margin-bottom: 16pt;
      font-size: 10pt;
    }
    .section {
      margin-bottom: 12pt;
    }
    .job-header {
      font-weight: bold;
      margin-bottom: 2pt;
    }
    .job-duration {
      font-style: italic;
      margin-bottom: 4pt;
    }
    .job-description {
      margin-left: 16pt;
      margin-bottom: 8pt;
    }
    ul {
      margin: 4pt 0;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 2pt;
    }
    .skills-list {
      margin-left: 16pt;
    }
    @media print {
      body { margin: 0.5in; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}</h1>
  
  <div class="contact">
    ${escapeHtml(p.email)}
    ${p.phone ? ' | ' + escapeHtml(p.phone) : ''}
    ${p.location ? ' | ' + escapeHtml(p.location) : ''}
    <br>
    ${p.linkedin ? 'LinkedIn: ' + escapeHtml(p.linkedin) : ''}
    ${p.github ? ' | GitHub: ' + escapeHtml(p.github) : ''}
  </div>

  ${ed.university || ed.degree || ed.major ? `
  <div class="section">
    <h2>EDUCATION</h2>
    ${ed.university ? `<div class="job-header">${escapeHtml(ed.university)}</div>` : ''}
    ${ed.degree || ed.major ? `<div>${escapeHtml(ed.degree)} ${ed.major ? 'in ' + escapeHtml(ed.major) : ''}</div>` : ''}
    ${ed.gpa ? `<div>GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
    ${ed.graduation ? `<div>Graduation: ${escapeHtml(ed.graduation)}</div>` : ''}
    ${ed.coursework ? `<div>Relevant Coursework: ${escapeHtml(ed.coursework)}</div>` : ''}
  </div>
  ` : ''}

  ${exp.filter((job: any) => job.title && job.company).length > 0 ? `
  <div class="section">
    <h2>EXPERIENCE</h2>
    ${exp.filter((job: any) => job.title && job.company).map((job: any) => `
      <div class="job-header">${escapeHtml(job.title)} — ${escapeHtml(job.company)}</div>
      ${job.duration ? `<div class="job-duration">${escapeHtml(job.duration)}</div>` : ''}
      ${job.description ? `<div class="job-description">${escapeHtml(job.description)}</div>` : ''}
    `).join('')}
  </div>
  ` : ''}

  ${projects.filter((proj: any) => proj.name).length > 0 ? `
  <div class="section">
    <h2>PROJECTS</h2>
    ${projects.filter((proj: any) => proj.name).map((proj: any) => `
      <div class="job-header">${escapeHtml(proj.name)}</div>
      ${proj.technologies ? `<div>Technologies: ${escapeHtml(proj.technologies)}</div>` : ''}
      ${proj.link ? `<div>Link: ${escapeHtml(proj.link)}</div>` : ''}
      ${proj.description ? `<div class="job-description">${escapeHtml(proj.description)}</div>` : ''}
    `).join('')}
  </div>
  ` : ''}

  ${skills.programming?.length || skills.frameworks?.length || skills.tools?.length ? `
  <div class="section">
    <h2>SKILLS</h2>
    <div class="skills-list">
      ${skills.programming?.length ? `<div><strong>Programming:</strong> ${skills.programming.join(', ')}</div>` : ''}
      ${skills.frameworks?.length ? `<div><strong>Frameworks:</strong> ${skills.frameworks.join(', ')}</div>` : ''}
      ${skills.tools?.length ? `<div><strong>Tools:</strong> ${skills.tools.join(', ')}</div>` : ''}
    </div>
  </div>
  ` : ''}
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const htmlContent = makeHtml(data)
    const plainTextContent = makePlainText(data)
    
    return NextResponse.json({
      success: true,
      html: htmlContent,
      text: plainTextContent
    })
  } catch (error) {
    console.error('Resume generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}
