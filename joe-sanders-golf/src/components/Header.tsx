'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/UnkJoeLogo.png"
                alt="Uncle Joe Golf Logo"
                width={48}
                height={48}
                className="logo"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-joe-heading font-semibold gradient-text group-hover:scale-105 transition-transform duration-300">
                  Uncle Joe
                </span>
                <span className="text-sm text-joe-gold font-joe-accent font-medium -mt-1 opacity-90">
                  Stones Golf
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/journey" className="nav-link">
              The Journey
            </Link>
             <Link href="/sponsors" className="nav-link">
               Sponsors
             </Link>
            <Link href="/sponsorship" className="nav-link">
              Sponsorship
            </Link>
            <Link href="/shop" className="nav-link">
              Pro Shop
            </Link>
            <Link href="/ai-golf-tutor" className="nav-link">
              AI Golf Tutor
            </Link>
            <Link href="/simulator" className="nav-link">
              Golf Simulator
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            <Link href="/fan-club" className="nav-link">
              Fan Club
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-joe-white hover:text-joe-gold focus:outline-none p-2 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-joe-gold/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-joe-black/95 backdrop-blur-md">
              <Link
                href="/journey"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                The Journey
              </Link>
              <Link
                href="/sponsorship"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                  Sponsorship
                </Link>
                <Link
                  href="/sponsors"
                  className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sponsors
              </Link>
              <Link
                href="/shop"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pro Shop
              </Link>
              <Link
                href="/ai-golf-tutor"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Golf Tutor
              </Link>
              <Link
                href="/simulator"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Golf Simulator
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/fan-club"
                className="block px-3 py-3 text-joe-white hover:text-joe-gold hover:bg-joe-gold/10 transition-all duration-300 rounded-lg font-joe-accent font-medium"
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
