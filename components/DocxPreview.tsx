// components/DocxPreview.tsx
"use client"
import { useEffect, useRef } from "react"
import { renderAsync } from "docx-preview"

export default function DocxPreview({ file }: { file: File }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer
      if (containerRef.current) {
        await renderAsync(buffer, containerRef.current)
      }
    }
    reader.readAsArrayBuffer(file)
  }, [file])

  return <div ref={containerRef} className="border rounded mt-2 p-4 bg-white" />
}
