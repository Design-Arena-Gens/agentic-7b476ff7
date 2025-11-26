'use client'

import { useState } from 'react'

interface ArticlePreviewProps {
  content: string
  metadata: any
}

export default function ArticlePreview({ content, metadata }: ArticlePreviewProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadHTML = () => {
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `article-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Article Preview</h2>

        {content && (
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              {copySuccess ? '✓ Copied!' : '📋 Copy HTML'}
            </button>
            <button
              onClick={downloadHTML}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              ⬇ Download
            </button>
          </div>
        )}
      </div>

      {metadata && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">SEO Metadata</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Word Count:</span> {metadata.wordCount}</p>
            <p><span className="font-medium">Reading Time:</span> {metadata.readingTime} min</p>
            <p><span className="font-medium">SEO Score:</span> {metadata.seoScore}/100</p>
            {metadata.keywords && (
              <p><span className="font-medium">Keywords:</span> {metadata.keywords}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {content ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">Your generated article will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
