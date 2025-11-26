'use client'

import { useState } from 'react'
import ArticleGenerator from './components/ArticleGenerator'
import ArticlePreview from './components/ArticlePreview'

export default function Home() {
  const [generatedArticle, setGeneratedArticle] = useState<string>('')
  const [articleMetadata, setArticleMetadata] = useState<any>(null)

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Blog Article Generator
          </h1>
          <p className="text-xl text-gray-600">
            Create SEO-optimized articles with AI, affiliate links, and product reviews
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <ArticleGenerator
              onArticleGenerated={(article, metadata) => {
                setGeneratedArticle(article)
                setArticleMetadata(metadata)
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <ArticlePreview
              content={generatedArticle}
              metadata={articleMetadata}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
