export function insertAffiliateLinks(
  content: string,
  affiliateLinks: Record<string, string>
): string {
  let modifiedContent = content

  const platformKeywords: Record<string, string[]> = {
    amazon: ['Amazon', 'amazon', 'comprar na Amazon', 'buy on Amazon', 'available on Amazon'],
    mercadolivre: ['Mercado Livre', 'mercado livre', 'comprar no Mercado Livre', 'ML'],
    shopee: ['Shopee', 'shopee', 'comprar na Shopee'],
    magalu: ['Magazine Luiza', 'Magalu', 'magalu', 'comprar no Magalu'],
    clickbank: ['ClickBank', 'clickbank', 'curso', 'treinamento', 'training'],
    hotmart: ['Hotmart', 'hotmart', 'produto digital', 'digital product'],
    eduzz: ['Eduzz', 'eduzz', 'infoproduto'],
    kiwify: ['Kiwify', 'kiwify'],
    braip: ['Braip', 'braip']
  }

  Object.entries(affiliateLinks).forEach(([platform, link]) => {
    if (!link || link.trim() === '') return

    const keywords = platformKeywords[platform] || []

    keywords.forEach(keyword => {
      const buttonText = platform === 'amazon' ? '🛒 Ver na Amazon' :
                        platform === 'mercadolivre' ? '🛒 Ver no Mercado Livre' :
                        platform === 'shopee' ? '🛒 Ver na Shopee' :
                        platform === 'magalu' ? '🛒 Ver no Magalu' :
                        platform === 'clickbank' ? '🔗 Acessar no ClickBank' :
                        platform === 'hotmart' ? '🔗 Acessar na Hotmart' :
                        platform === 'eduzz' ? '🔗 Acessar na Eduzz' :
                        platform === 'kiwify' ? '🔗 Acessar no Kiwify' :
                        platform === 'braip' ? '🔗 Acessar no Braip' :
                        `Ver ${keyword}`

      const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>|[^<>]*<\/)`, 'gi')

      modifiedContent = modifiedContent.replace(regex, (match) => {
        return `<a href="${link}" target="_blank" rel="nofollow noopener sponsored" class="affiliate-link font-semibold text-blue-600 hover:text-blue-800 underline">${match}</a>`
      })
    })

    const ctaVariations = [
      'Clique aqui para comprar',
      'Compre agora',
      'Ver produto',
      'Confira o preço',
      'Veja mais detalhes',
      'Click here to buy',
      'Buy now',
      'Check price',
      'View product'
    ]

    ctaVariations.forEach(cta => {
      const regex = new RegExp(cta, 'gi')
      if (modifiedContent.match(regex) && link) {
        modifiedContent = modifiedContent.replace(regex, (match) => {
          return `<a href="${link}" target="_blank" rel="nofollow noopener sponsored" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors no-underline">${match} →</a>`
        })
      }
    })
  })

  const availableLinks = Object.entries(affiliateLinks)
    .filter(([_, link]) => link && link.trim() !== '')

  if (availableLinks.length > 0 && !modifiedContent.includes('class="cta-section"')) {
    let ctaSection = '<div class="cta-section my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">'
    ctaSection += '<h3 class="text-2xl font-bold text-gray-900 mb-4">🎯 Onde Comprar</h3>'
    ctaSection += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'

    availableLinks.forEach(([platform, link]) => {
      const platformName = platform === 'mercadolivre' ? 'Mercado Livre' :
                          platform === 'magalu' ? 'Magazine Luiza' :
                          platform.charAt(0).toUpperCase() + platform.slice(1)

      const icon = ['amazon', 'mercadolivre', 'shopee', 'magalu'].includes(platform) ? '🛒' : '🔗'

      ctaSection += `
        <a href="${link}" target="_blank" rel="nofollow noopener sponsored"
           class="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500 text-center no-underline">
          <span class="text-2xl mb-2 block">${icon}</span>
          <span class="font-semibold text-gray-900 text-lg">${platformName}</span>
        </a>
      `
    })

    ctaSection += '</div></div>'

    const conclusionMatch = modifiedContent.match(/<h2[^>]*>.*?(conclusão|conclusion).*?<\/h2>/i)
    if (conclusionMatch) {
      modifiedContent = modifiedContent.replace(conclusionMatch[0], ctaSection + '\n' + conclusionMatch[0])
    } else {
      modifiedContent += '\n' + ctaSection
    }
  }

  const disclaimer = `
    <div class="affiliate-disclaimer mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-700">
      <p><strong>⚠️ Aviso de Transparência:</strong> Este artigo contém links afiliados. Ao comprar através destes links,
      podemos receber uma comissão sem custo adicional para você. Isso nos ajuda a manter este conteúdo gratuito e de qualidade.
      Recomendamos apenas produtos que consideramos valiosos.</p>
    </div>
  `

  if (!modifiedContent.includes('affiliate-disclaimer')) {
    modifiedContent += disclaimer
  }

  return modifiedContent
}
