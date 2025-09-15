import type { Metadata } from 'next'
// Using local fonts to avoid external dependency issues
// import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { MobileAppBridge } from '@/components/MobileAppBridge'

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// const cormorant = Cormorant_Garamond({
//   subsets: ['latin'],
//   weight: ['400', '600', '700'],
//   variable: '--font-cormorant'
// })

export const metadata: Metadata = {
  title: 'Uncle Joes Golf - Professional Golf Career',
  description: 'Experience the raw athleticism and spiritual symbolism of Uncle Joe Sanders. PGA Tour journey, tournament highlights, exclusive fan content, and Stones Golf integration.',
  keywords: 'Uncle Joe, Joe Sanders, PGA Tour, professional golf, Stones Golf, tournament highlights, fan club, Uncle Joes Golf',
  authors: [{ name: 'Uncle Joe Sanders' }],
  openGraph: {
    title: 'Uncle Joes Golf - Professional Golf Career',
    description: 'Follow Uncle Joe\'s journey from amateur to PGA Tour professional. Exclusive content, tournament highlights, and fan experiences.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-joe-black text-joe-white font-joe-body flower-of-life-bg">
        <AnalyticsProvider enable={true} />
        <MobileAppBridge enabled={true} />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <PerformanceMonitor />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
