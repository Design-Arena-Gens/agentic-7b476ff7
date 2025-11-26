export function optimizeForSEO(
  content: string,
  keywords: string,
  targetCountry: string
): { content: string; score: number } {
  let optimizedContent = content
  let score = 70

  if (!content.includes('<h1>')) {
    const titleMatch = content.match(/<h2>(.*?)<\/h2>/)
    if (titleMatch) {
      optimizedContent = optimizedContent.replace(
        titleMatch[0],
        `<h1>${titleMatch[1]}</h1>`
      )
      score += 5
    }
  } else {
    score += 5
  }

  const keywordList = keywords ? keywords.split(',').map(k => k.trim()) : []
  const contentLower = content.toLowerCase()

  let keywordCount = 0
  keywordList.forEach(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'g')
    const matches = contentLower.match(regex)
    if (matches) {
      keywordCount += matches.length
    }
  })

  if (keywordCount >= 5 && keywordCount <= 20) {
    score += 10
  } else if (keywordCount > 0) {
    score += 5
  }

  const h2Count = (content.match(/<h2>/g) || []).length
  const h3Count = (content.match(/<h3>/g) || []).length

  if (h2Count >= 3 && h3Count >= 2) {
    score += 5
  }

  if (content.includes('<ul>') || content.includes('<ol>')) {
    score += 3
  }

  const wordCount = content.split(/\s+/).length
  if (wordCount >= 1500 && wordCount <= 3500) {
    score += 5
  } else if (wordCount >= 800) {
    score += 2
  }

  if (!content.includes('alt=')) {
    const imgTags = content.match(/<img[^>]*>/g) || []
    imgTags.forEach(img => {
      if (!img.includes('alt=')) {
        const srcMatch = img.match(/src="([^"]*)"/)
        if (srcMatch) {
          const altText = 'Relevant image'
          optimizedContent = optimizedContent.replace(
            img,
            img.replace('>', ` alt="${altText}">`)
          )
        }
      }
    })
    score += 2
  } else {
    score += 2
  }

  const metaTags = `
    <meta name="description" content="${content.substring(0, 160).replace(/<[^>]*>/g, '').trim()}..." />
    <meta name="keywords" content="${keywords}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="${getLocale(targetCountry)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  `

  if (content.includes('<head>')) {
    optimizedContent = optimizedContent.replace('</head>', `${metaTags}</head>`)
  } else {
    optimizedContent = `${metaTags}\n${optimizedContent}`
  }

  if (!content.includes('schema.org')) {
    const schemaMarkup = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${content.match(/<h1>(.*?)<\/h1>/)?.[1] || 'Article'}",
        "description": "${content.substring(0, 200).replace(/<[^>]*>/g, '').trim()}",
        "author": {
          "@type": "Person",
          "name": "Blog Author"
        },
        "datePublished": "${new Date().toISOString()}",
        "dateModified": "${new Date().toISOString()}"
      }
      </script>
    `
    optimizedContent += schemaMarkup
    score += 5
  }

  return {
    content: optimizedContent,
    score: Math.min(score, 100)
  }
}

function getLocale(countryCode: string): string {
  const localeMap: Record<string, string> = {
    'BR': 'pt_BR',
    'US': 'en_US',
    'GB': 'en_GB',
    'ES': 'es_ES',
    'PT': 'pt_PT',
  }
  return localeMap[countryCode] || 'en_US'
}
