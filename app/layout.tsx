import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blog Article Generator - SEO Optimized Content Creator',
  description: 'Generate SEO-optimized blog articles with AI, spell checking, and affiliate integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
