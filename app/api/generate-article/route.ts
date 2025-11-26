import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { scrapeProductInfo } from '@/utils/productScraper'
import { spellCheck } from '@/utils/spellChecker'
import { generateImage } from '@/utils/nanoBanana'
import { optimizeForSEO } from '@/utils/seoOptimizer'
import { insertAffiliateLinks } from '@/utils/affiliateLinker'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      topic,
      keywords,
      productUrl,
      articleType,
      targetCountry,
      includeImages,
      affiliateLinks,
      customReviews
    } = body

    let productInfo = null
    if (productUrl) {
      try {
        productInfo = await scrapeProductInfo(productUrl)
      } catch (error) {
        console.error('Failed to scrape product:', error)
      }
    }

    const systemPrompt = `You are an expert blog article writer specializing in SEO-optimized content for ${targetCountry}.
    Create engaging, informative, and conversion-focused articles that rank well in search engines.
    Focus on Google Discover optimization with compelling headlines and structured content.
    Write in a natural, conversational tone while maintaining professionalism.
    Use proper HTML formatting with semantic tags (h1, h2, h3, p, ul, ol, strong, em).
    Include strategic keyword placement without keyword stuffing.`

    let userPrompt = `Write a comprehensive ${articleType} article about: ${topic}\n\n`

    if (keywords) {
      userPrompt += `SEO Keywords to naturally incorporate: ${keywords}\n\n`
    }

    if (productInfo) {
      userPrompt += `Product Information:\n`
      userPrompt += `- Name: ${productInfo.title}\n`
      userPrompt += `- Description: ${productInfo.description}\n`
      userPrompt += `- Price: ${productInfo.price}\n`
      userPrompt += `- Features: ${productInfo.features?.join(', ')}\n`
      userPrompt += `- Technical Specs: ${JSON.stringify(productInfo.specs)}\n\n`
    }

    if (customReviews && customReviews.length > 0) {
      userPrompt += `Include these authentic user reviews in the article:\n`
      customReviews.forEach((review: string, index: number) => {
        userPrompt += `${index + 1}. "${review}"\n`
      })
      userPrompt += '\n'
    }

    userPrompt += `Article Structure Requirements:
    - Compelling H1 title optimized for clicks and SEO
    - Engaging introduction with hook
    - Well-structured sections with H2 and H3 headings
    - Detailed product analysis (pros, cons, features)
    - User review section highlighting experiences
    - Comparison with alternatives if relevant
    - FAQ section
    - Strong conclusion with call-to-action
    - Use bullet points and numbered lists for readability
    - Include placeholders for images: [IMAGE: description]
    - Maintain 2000-3000 word count for optimal SEO
    - Write in HTML format with proper semantic tags`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    let articleContent = completion.choices[0]?.message?.content || ''

    articleContent = await spellCheck(articleContent)

    if (includeImages) {
      const imageMatches = articleContent.match(/\[IMAGE: ([^\]]+)\]/g)
      if (imageMatches) {
        for (const match of imageMatches) {
          const description = match.replace('[IMAGE: ', '').replace(']', '')
          try {
            const imageUrl = await generateImage(description)
            articleContent = articleContent.replace(
              match,
              `<img src="${imageUrl}" alt="${description}" class="w-full rounded-lg shadow-md my-4" />`
            )
          } catch (error) {
            console.error('Image generation failed:', error)
            articleContent = articleContent.replace(match, '')
          }
        }
      }
    } else {
      articleContent = articleContent.replace(/\[IMAGE: ([^\]]+)\]/g, '')
    }

    articleContent = insertAffiliateLinks(articleContent, affiliateLinks)

    const seoOptimized = optimizeForSEO(articleContent, keywords, targetCountry)

    const wordCount = articleContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return NextResponse.json({
      article: seoOptimized.content,
      metadata: {
        wordCount,
        readingTime,
        seoScore: seoOptimized.score,
        keywords: keywords,
        targetCountry,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Article generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate article' },
      { status: 500 }
    )
  }
}
