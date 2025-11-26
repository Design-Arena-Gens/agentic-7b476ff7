'use client'

import { useState } from 'react'

interface ArticleGeneratorProps {
  onArticleGenerated: (article: string, metadata: any) => void
}

export default function ArticleGenerator({ onArticleGenerated }: ArticleGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    productUrl: '',
    articleType: 'review',
    targetCountry: 'BR',
    includeImages: true,
    affiliateLinks: {
      amazon: '',
      mercadolivre: '',
      shopee: '',
      magalu: '',
      clickbank: '',
      hotmart: '',
      eduzz: '',
      kiwify: '',
      braip: ''
    }
  })

  const [customReviews, setCustomReviews] = useState<string[]>([''])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customReviews: customReviews.filter(r => r.trim() !== '')
        }),
      })

      const data = await response.json()

      if (data.error) {
        alert('Error: ' + data.error)
      } else {
        onArticleGenerated(data.article, data.metadata)
      }
    } catch (error) {
      alert('Error generating article: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const addReviewField = () => {
    setCustomReviews([...customReviews, ''])
  }

  const updateReview = (index: number, value: string) => {
    const newReviews = [...customReviews]
    newReviews[index] = value
    setCustomReviews(newReviews)
  }

  const removeReview = (index: number) => {
    setCustomReviews(customReviews.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Configuration</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Article Topic *
        </label>
        <input
          type="text"
          required
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Best Wireless Headphones 2024"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SEO Keywords (comma-separated)
        </label>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="wireless headphones, bluetooth, noise cancelling"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Article Type
        </label>
        <select
          value={formData.articleType}
          onChange={(e) => setFormData({ ...formData, articleType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="review">Product Review</option>
          <option value="comparison">Product Comparison</option>
          <option value="guide">Buying Guide</option>
          <option value="list">Top 10 List</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Country (GEO)
        </label>
        <select
          value={formData.targetCountry}
          onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="BR">Brazil</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="ES">Spain</option>
          <option value="PT">Portugal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product URL (for scraping product details)
        </label>
        <input
          type="url"
          value={formData.productUrl}
          onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://www.amazon.com/product/..."
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Affiliate Links</h3>

        <div className="space-y-3">
          <input
            type="url"
            value={formData.affiliateLinks.amazon}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, amazon: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Amazon Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.mercadolivre}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, mercadolivre: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Mercado Livre Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.shopee}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, shopee: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Shopee Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.magalu}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, magalu: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Magalu Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.clickbank}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, clickbank: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Clickbank Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.hotmart}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, hotmart: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Hotmart Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.eduzz}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, eduzz: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Eduzz Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.kiwify}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, kiwify: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Kiwify Affiliate Link"
          />

          <input
            type="url"
            value={formData.affiliateLinks.braip}
            onChange={(e) => setFormData({
              ...formData,
              affiliateLinks: { ...formData.affiliateLinks, braip: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Braip Affiliate Link"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Reviews</h3>

        {customReviews.map((review, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <textarea
              value={review}
              onChange={(e) => updateReview(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a custom review..."
              rows={3}
            />
            <button
              type="button"
              onClick={() => removeReview(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addReviewField}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          + Add Review
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="includeImages"
          checked={formData.includeImages}
          onChange={(e) => setFormData({ ...formData, includeImages: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="includeImages" className="ml-2 text-sm text-gray-700">
          Generate images with Nano Banana
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            Generating Article...
          </div>
        ) : (
          'Generate Article'
        )}
      </button>
    </form>
  )
}
