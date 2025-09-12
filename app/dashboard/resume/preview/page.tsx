"use client"

import { useEffect } from "react"

export default function ResumePreviewPage() {
  useEffect(() => {
    const resumeHtml = sessionStorage.getItem("resumePreview")
    if (resumeHtml) {
      document.body.innerHTML = resumeHtml
    }
  }, [])

  return null
}