import './globals.css'
import type { Metadata } from 'next'
import { Space_Mono, Orbitron } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono'
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cyber'
})

export const metadata: Metadata = {
  title: 'XP Beats - Premium Beat Store',
  description: 'Premium cyberpunk beats and instrumentals for hip-hop, trap, and electronic music artists.',
  keywords: ['beats', 'instrumentals', 'hip-hop', 'trap', 'cyberpunk', 'music production'],
  authors: [{ name: 'XP Beats' }],
  openGraph: {
    title: 'XP Beats - Premium Beat Store',
    description: 'Premium cyberpunk beats and instrumentals for artists worldwide.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'XP Beats',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'XP Beats - Premium Beat Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XP Beats - Premium Beat Store',
    description: 'Premium cyberpunk beats and instrumentals for artists worldwide.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceMono.variable} ${orbitron.variable} font-mono antialiased`}>
        <Providers>
          {children}
          <Toaster 
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}