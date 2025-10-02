'use client'

import dynamic from 'next/dynamic'
// Using local fonts to avoid external dependency issues
// import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'

// Lazy load heavy components
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  loading: () => null,
  ssr: false
})
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), {
  loading: () => null,
  ssr: false
})
const ServiceWorkerRegister = dynamic(() => import('@/components/ServiceWorkerRegister'), {
  loading: () => null,
  ssr: false
})
const AnalyticsProvider = dynamic(() => import('@/components/AnalyticsProvider'), {
  loading: () => null
})
const MobileAppBridge = dynamic(() => import('@/components/MobileAppBridge').then(mod => ({ default: mod.MobileAppBridge })), {
  loading: () => null,
  ssr: false
})

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// const cormorant = Cormorant_Garamond({
//   subsets: ['latin'],
//   weight: ['400', '600', '700'],
//   variable: '--font-cormorant'
// })

// export const metadata: Metadata = {
//   title: 'Uncle Joes Golf - Professional Golf Career',
//   description: 'Experience the raw athleticism and spiritual symbolism of Uncle Joe Sanders. PGA Tour journey, tournament highlights, exclusive fan content, and Stones Golf integration.',
//   keywords: 'Uncle Joe, Joe Sanders, PGA Tour, professional golf, Stones Golf, tournament highlights, fan club, Uncle Joes Golf',
//   authors: [{ name: 'Uncle Joe Sanders' }],
//   openGraph: {
//     title: 'Uncle Joes Golf - Professional Golf Career',
//     description: 'Follow Uncle Joe\'s journey from amateur to PGA Tour professional. Exclusive content, tournament highlights, and fan experiences.',
//     type: 'website',
//   },
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#d4af37" />
        {/* Social previews */}
        <meta property="og:image" content="/images/UnkJoeLogo.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/images/UnkJoeLogo.png" />
        {/* Favicons */}
  {/* Prefer webp where supported with PNG fallback via multiple link tags */}
  <link rel="icon" href="/images/UnkJoeLogo.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="/images/UnkJoeLogo.png" sizes="16x16" type="image/png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/UnkJoeLogo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col bg-joe-black text-joe-white font-joe-body flower-of-life-bg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#d4af37] text-[#0a0a0a] px-4 py-2 rounded font-semibold z-50"
        >
          Skip to main content
        </a>

        <AnalyticsProvider enable={true} />
        <MobileAppBridge enabled={true} />

        <Header />
        <SessionProvider>
          <main id="main-content" className="flex-grow" role="main" tabIndex={-1}>
            {children}
          </main>
        </SessionProvider>
        <Footer />

        <CookieConsent />
        <PerformanceMonitor />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
