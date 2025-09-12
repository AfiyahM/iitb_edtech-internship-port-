import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const resumeData = await req.json();

    const resumeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          h1, h2, h3 { margin: 0; }
          h1 { font-size: 2.5em; text-align: center; }
          h2 { font-size: 1.5em; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 20px; }
          .section { margin-bottom: 20px; }
          .contact-info { text-align: center; margin-bottom: 20px; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${resumeData.personal.firstName} ${resumeData.personal.lastName}</h1>
          <div class="contact-info">
            <p>${resumeData.personal.email} | ${resumeData.personal.phone}</p>
            <p>
              <a href="${resumeData.personal.linkedin}" target="_blank">${resumeData.personal.linkedin}</a> | 
              <a href="${resumeData.personal.github}" target="_blank">${resumeData.personal.github}</a>
            </p>
          </div>

          <div class="section">
            <h2>Summary</h2>
            <p>${resumeData.experiences[0].description}</p>
          </div>

          <div class="section">
            <h2>Skills</h2>
            <ul>
              <li><strong>Programming:</strong> ${resumeData.skills.programming.join(', ')}</li>
              <li><strong>Frameworks:</strong> ${resumeData.skills.frameworks.join(', ')}</li>
              <li><strong>Tools:</strong> ${resumeData.skills.tools.join(', ')}</li>
            </ul>
          </div>

          <div class="section">
            <h2>Experience</h2>
            ${resumeData.experiences.map((exp: any) => `
              <div>
                <h3>${exp.title} at ${exp.company}</h3>
                <p><em>${exp.duration}</em></p>
                <p>${exp.description}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Education</h2>
            <div>
              <h3>${resumeData.education.university}</h3>
              <p><strong>${resumeData.education.degree} in ${resumeData.education.major}</strong> - ${resumeData.education.graduation}</p>
              <p>GPA: ${resumeData.education.gpa}</p>
            </div>
          </div>

          <div class="section">
            <h2>Projects</h2>
            ${resumeData.projects.map((proj: any) => `
              <div>
                <h3>${proj.name}</h3>
                <p><strong>Technologies:</strong> ${proj.technologies}</p>
                <p><a href="${proj.link}" target="_blank">${proj.link}</a></p>
                <p>${proj.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `;

    return NextResponse.json({ success: true, resumeHtml });
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate resume' }, { status: 500 });
  }
}