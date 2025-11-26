import axios from 'axios'
import { parse } from 'node-html-parser'

export interface ProductInfo {
  title: string
  description: string
  price: string
  features: string[]
  specs: Record<string, string>
  images: string[]
  rating?: string
}

export async function scrapeProductInfo(url: string): Promise<ProductInfo> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })

    const root = parse(response.data)

    const productInfo: ProductInfo = {
      title: '',
      description: '',
      price: '',
      features: [],
      specs: {},
      images: []
    }

    if (url.includes('amazon')) {
      productInfo.title = root.querySelector('#productTitle')?.text.trim() || ''
      productInfo.price = root.querySelector('.a-price .a-offscreen')?.text.trim() || ''
      productInfo.description = root.querySelector('#feature-bullets')?.text.trim() || ''

      const features = root.querySelectorAll('#feature-bullets li')
      productInfo.features = features.map(f => f.text.trim()).filter(f => f.length > 0)

      const specTable = root.querySelectorAll('.prodDetTable tr')
      specTable.forEach(row => {
        const key = row.querySelector('th')?.text.trim()
        const value = row.querySelector('td')?.text.trim()
        if (key && value) {
          productInfo.specs[key] = value
        }
      })

      productInfo.rating = root.querySelector('.a-icon-star')?.text.trim() || ''
    }
    else if (url.includes('mercadolivre') || url.includes('mercadolibre')) {
      productInfo.title = root.querySelector('.ui-pdp-title')?.text.trim() || ''
      productInfo.price = root.querySelector('.price-tag-fraction')?.text.trim() || ''
      productInfo.description = root.querySelector('.ui-pdp-description')?.text.trim() || ''

      const features = root.querySelectorAll('.ui-pdp-features li')
      productInfo.features = features.map(f => f.text.trim()).filter(f => f.length > 0)
    }
    else if (url.includes('shopee')) {
      productInfo.title = root.querySelector('[data-testid="product-title"]')?.text.trim() || ''
      productInfo.price = root.querySelector('.product-price')?.text.trim() || ''
      productInfo.description = root.querySelector('.product-description')?.text.trim() || ''
    }
    else {
      productInfo.title = root.querySelector('h1')?.text.trim() ||
                         root.querySelector('[itemprop="name"]')?.text.trim() || ''

      productInfo.price = root.querySelector('[itemprop="price"]')?.text.trim() ||
                         root.querySelector('.price')?.text.trim() || ''

      productInfo.description = root.querySelector('[itemprop="description"]')?.text.trim() ||
                               root.querySelector('.description')?.text.trim() || ''
    }

    const images = root.querySelectorAll('img')
    productInfo.images = images
      .map(img => img.getAttribute('src') || '')
      .filter(src => src.includes('http'))
      .slice(0, 5)

    return productInfo
  } catch (error) {
    console.error('Product scraping error:', error)
    throw new Error('Failed to scrape product information')
  }
}
