'use client'

import Link from 'next/link'
import { Play, Target, ShoppingBag } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero-container min-h-screen flex items-center justify-center relative">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/videos/joe-swing-hero.mp4" type="video/mp4" />
          {/* Fallback image */}
          <div className="w-full h-full bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]"></div>
        </video>
      </div>

      {/* Uncle Joe Crest Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center">
          <span className="text-[#0a0a0a] font-['Cormorant_Garamond'] font-bold text-2xl">UJ</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Say Uncle Tagline */}
        <h1 className="hero-tagline mb-8">
          Say Uncle.
        </h1>
        
        <p className="text-xl md:text-2xl text-[#e7e3da] mb-12 font-['Inter'] leading-relaxed">
          Experience the raw athleticism and spiritual symbolism of Uncle Joe Sanders.
          Where professional golf meets the sacred geometry of the Flower of Life.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/journey"
            className="btn-primary flex items-center gap-3 text-lg px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            <Play className="h-5 w-5" />
            Watch the Story
          </Link>
          
          <Link
            href="/simulator"
            className="simulator-button flex items-center gap-3 text-lg px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            <Target className="h-5 w-5" />
            Play the Simulator
          </Link>
          
          <Link
            href="/shop"
            className="btn-outline flex items-center gap-3 text-lg px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            <ShoppingBag className="h-5 w-5" />
            Shop Stones Golf
          </Link>
        </div>
      </div>

      {/* Animated Stones Golf Pattern */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex space-x-2">
          <div className="dot-1 w-3 h-3 bg-[#d4af37] rounded-full opacity-0"></div>
          <div className="dot-2 w-3 h-3 bg-[#d4af37] rounded-full opacity-0"></div>
          <div className="dot-3 w-3 h-3 bg-[#d4af37] rounded-full opacity-0"></div>
          <div className="dot-4 w-3 h-3 bg-[#d4af37] rounded-full opacity-0"></div>
          <div className="dot-5 w-3 h-3 bg-[#d4af37] rounded-full opacity-0"></div>
        </div>
      </div>
    </section>
  )
}