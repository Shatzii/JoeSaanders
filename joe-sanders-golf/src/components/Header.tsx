'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">
              Joe Sanders Golf
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/journey" className="text-gray-700 hover:text-green-600 transition-colors">
              The Journey
            </Link>
            <Link href="/sponsorship" className="text-gray-700 hover:text-green-600 transition-colors">
              Sponsorship
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-green-600 transition-colors">
              Pro Shop
            </Link>
            <Link href="/fan-club" className="text-gray-700 hover:text-green-600 transition-colors">
              Fan Club
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/journey"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                The Journey
              </Link>
              <Link
                href="/sponsorship"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sponsorship
              </Link>
              <Link
                href="/shop"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pro Shop
              </Link>
              <Link
                href="/fan-club"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fan Club
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
