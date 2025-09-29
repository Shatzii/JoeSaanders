import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingBag, Users, Music, Heart } from 'lucide-react'

export default function CoolStonesPage() {
  return (
    <div className="min-h-screen bg-cool-black text-cool-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cool-gold hover:text-cool-rose transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-5xl md:text-7xl font-joe-heading font-bold mb-6 text-cool-gold">
            CoolStones
          </h1>

          <p className="text-xl md:text-2xl text-cool-white/80 font-joe-body mb-12">
            Reverse Time. Play Bold.
          </p>

          <p className="text-lg text-cool-stone font-joe-body mb-8">
            The world&apos;s first player-owned golf brand. Built for culture. Built for everyone.
          </p>
        </div>
      </section>

      {/* The Movement Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-joe-heading font-bold text-cool-gold mb-6">
              More Than Golf. A Lifestyle.
            </h2>
            <p className="text-xl text-cool-white/80 font-joe-body max-w-3xl mx-auto">
              CoolStones is born from Uncle Joe Sanders — a PGA hopeful who didn&apos;t wait for Nike. He built his own Nike. Stones is golf, culture, and family colliding. It&apos;s not just a brand. It&apos;s a declaration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-6 text-center">
              <Heart className="w-12 h-12 text-cool-rose mx-auto mb-4" />
              <h3 className="text-2xl font-joe-heading font-bold text-cool-gold mb-4">Family</h3>
              <p className="text-cool-stone font-joe-body">Rooted in legacy, community, and building something that lasts.</p>
            </div>

            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-6 text-center">
              <Music className="w-12 h-12 text-cool-gold mx-auto mb-4" />
              <h3 className="text-2xl font-joe-heading font-bold text-cool-gold mb-4">Culture</h3>
              <p className="text-cool-stone font-joe-body">Where streetwear meets the course, music meets the game.</p>
            </div>

            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-cool-rose mx-auto mb-4" />
              <h3 className="text-2xl font-joe-heading font-bold text-cool-gold mb-4">Boldness</h3>
              <p className="text-cool-stone font-joe-body">Courage to build your own lane, stand out, and Say Uncle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-16 px-4 bg-cool-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-joe-heading font-bold text-cool-gold mb-6">
              Shop CoolStones
            </h2>
            <p className="text-xl text-cool-white/80 font-joe-body mb-8">
              Premium gear for the culture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-cool-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-xl font-joe-heading font-bold text-cool-gold mb-2">Hats</h3>
              <p className="text-cool-stone font-joe-body text-sm">Hourglass icon</p>
            </div>

            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-cool-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="text-xl font-joe-heading font-bold text-cool-gold mb-2">Polos</h3>
              <p className="text-cool-stone font-joe-body text-sm">Luxury script</p>
            </div>

            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-cool-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🧤</span>
              </div>
              <h3 className="text-xl font-joe-heading font-bold text-cool-gold mb-2">Gloves</h3>
              <p className="text-cool-stone font-joe-body text-sm">Say Uncle.</p>
            </div>

            <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-rose/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-cool-rose rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💖</span>
              </div>
              <h3 className="text-xl font-joe-heading font-bold text-cool-rose mb-2">Lady Stones</h3>
              <p className="text-cool-stone font-joe-body text-sm">Rose-gold empowerment</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="bg-cool-gold text-cool-black px-8 py-4 rounded-lg font-semibold hover:bg-cool-gold/80 transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Family Reunion Tour */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-joe-heading font-bold text-cool-gold mb-6">
              Family Reunion Tour
            </h2>
            <p className="text-xl text-cool-white/80 font-joe-body max-w-3xl mx-auto">
              Where Culture Meets the Course. Golf + music + food + family. Stones brings people together city by city.
            </p>
          </div>

          <div className="bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-8">
            <div className="text-center">
              <p className="text-lg text-cool-stone font-joe-body mb-6">
                Tour schedule and photos coming soon...
              </p>
              <Link
                href="/contact"
                className="border border-cool-gold text-cool-gold px-6 py-3 rounded-lg font-semibold hover:bg-cool-gold hover:text-cool-black transition-colors"
              >
                Get Tour Updates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Movement */}
      <section className="py-16 px-4 bg-cool-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-joe-heading font-bold mb-6 text-cool-gold">
            Join the Movement
          </h2>

          <p className="text-lg text-cool-white/80 mb-8 font-joe-body">
            Fan Rituals: Post &quot;Say Uncle&quot; after your wins. Throw up the &quot;U&quot; hand sign. Use &quot;…&quot; ellipsis as a fan signature.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/uncle-joe"
              className="bg-cool-gold text-cool-black px-8 py-3 rounded-lg font-semibold hover:bg-cool-rose transition-colors"
            >
              Meet Uncle Joe
            </Link>

            <Link
              href="/fan-club"
              className="border border-cool-gold text-cool-gold px-8 py-3 rounded-lg font-semibold hover:bg-cool-gold hover:text-cool-black transition-colors"
            >
              Join Fan Club
            </Link>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-joe-heading font-bold mb-6 text-cool-gold">
            Future Vision
          </h2>

          <div className="space-y-6 text-left bg-cool-black/50 backdrop-blur-sm border border-cool-gold/20 rounded-lg p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cool-gold rounded-full flex items-center justify-center text-cool-black font-bold">2026</div>
              <p className="text-lg text-cool-white font-joe-body">Stones is the Nike of golf. Global collabs.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cool-rose rounded-full flex items-center justify-center text-cool-white font-bold">2027</div>
              <p className="text-lg text-cool-white font-joe-body">Lady Stones expansion.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cool-gold rounded-full flex items-center justify-center text-cool-black font-bold">2028</div>
              <p className="text-lg text-cool-white font-joe-body">Stones Golf Village opens — a living community blending culture, sport, and family.</p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/sponsorship"
              className="border border-cool-gold text-cool-gold px-8 py-3 rounded-lg font-semibold hover:bg-cool-gold hover:text-cool-black transition-colors"
            >
              Invest in Stones
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}