import axios from 'axios'

export async function generateImage(description: string): Promise<string> {
  const apiKey = process.env.NANO_BANANA_API_KEY

  if (!apiKey || apiKey === 'your_nano_banana_api_key_here') {
    return `https://via.placeholder.com/800x600/4F46E5/ffffff?text=${encodeURIComponent(description)}`
  }

  try {
    const response = await axios.post(
      'https://api.nanobanana.ai/v1/generate',
      {
        prompt: description,
        width: 800,
        height: 600,
        quality: 'high'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    return response.data.image_url || response.data.url
  } catch (error) {
    console.error('Nano Banana API error:', error)
    return `https://via.placeholder.com/800x600/4F46E5/ffffff?text=${encodeURIComponent(description)}`
  }
}
