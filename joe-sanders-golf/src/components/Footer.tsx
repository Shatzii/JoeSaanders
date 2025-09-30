'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('Thank you for subscribing!')
        setEmail('')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-joe-black text-joe-white border-t border-joe-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/UnkJoeLogo (2).png"
                alt="Uncle Joe Golf Logo"
                width={48}
                height={48}
                className="brightness-0 invert opacity-90"
              />
              <div>
                <h3 className="text-2xl font-joe-heading font-semibold text-joe-gold">Uncle Joes Golf</h3>
                <p className="text-sm text-joe-stone font-joe-accent">Stones Golf Professional</p>
              </div>
            </div>
            <p className="text-joe-white/80 mb-4 leading-relaxed font-joe-body">
              Experience the raw athleticism and spiritual symbolism of Uncle Joe Sanders.
              From amateur dreams to PGA Tour reality - follow the journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-joe-stone hover:text-joe-gold transition-all duration-300 hover:scale-110">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-joe-stone hover:text-joe-gold transition-all duration-300 hover:scale-110">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-joe-stone hover:text-joe-gold transition-all duration-300 hover:scale-110">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-joe-heading font-semibold mb-4 text-joe-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/journey" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">The Journey</Link></li>
              <li><Link href="/sponsorship" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">Sponsorship</Link></li>
              <li><Link href="/shop" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">Pro Shop</Link></li>
              <li><Link href="/contact" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">Contact</Link></li>
              <li><Link href="/fan-club" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">Fan Club</Link></li>
              <li><Link href="/privacy-policy" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-joe-stone hover:text-joe-gold transition-all duration-300 font-joe-accent">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-joe-heading font-semibold mb-4 text-joe-gold">Stay Updated</h4>
            <p className="text-joe-white/80 mb-4 font-joe-body">Get exclusive updates on my golf career and behind-the-scenes content.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-joe-black/50 border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-accent"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="merch-button w-full px-4 py-2 rounded-md font-joe-accent font-bold text-lg"
              >
                <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-sm font-joe-accent ${message.includes('Thank you') ? 'text-joe-gold' : 'text-red-300'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-joe-gold/20 mt-8 pt-8 text-center text-joe-stone font-joe-body">
          <p>&copy; 2025 Uncle Joes Golf - Stones Golf Professional. All rights reserved.</p>
          <p className="text-xs mt-2 text-joe-stone/60">Powered by raw athleticism and unbreakable spirit.</p>
        </div>
      </div>
    </footer>
  )
}
