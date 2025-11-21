'use client'

import { Calendar, MapPin, Trophy, Heart, Sparkles, Target } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="hero-container text-joe-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-joe-heading font-bold text-joe-gold mb-6">
              Joe "Uncle Joe" Sanders
            </h1>
            <p className="text-2xl text-joe-stone font-joe-body max-w-4xl mx-auto leading-relaxed">
              Player-founder rewriting golf's rules—PGA track, culture-first brand builder, and the soul behind STONES GOLF
            </p>
          </div>
        </div>
      </section>

      {/* Full Bio Section */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-joe-black/50 border border-joe-gold/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-joe-heading font-bold text-joe-gold mb-6">The Story</h2>
            
            <div className="space-y-6 text-joe-white font-joe-body leading-relaxed text-lg">
              <p>
                Joe "Uncle Joe" Sanders is a competitor, creator, and cultural architect shaping a new era of golf. His story begins in Nashville, Tennessee, where a youth basketball teammate's backyard par-3 introduced him to the game. The early years were pure curiosity—drivers, putters, grips, and shafts cycled through in an obsessive search for feel. That tinkerer's mindset became his competitive edge.
              </p>

              <p>
                In July 2024, everything aligned. After years of grinding without the results he knew were inside him, Joe experienced what he calls a God-given unlock—the moment when mechanics, rhythm, and mind finally clicked. Within days he pured thousands of shots and knew his life had changed. He sold his house, cleared debts, became his own sponsor, and invested in a complete competitive kit—from clubs and wardrobe to an electric caddie—treating golf like the profession it had already become in his mind.
              </p>

              <p>
                The momentum pushed him toward his first PGA Tour qualifier at the RSM Classic in Sea Palms, Georgia, with family by his side. Two weeks before, a fall injured his left elbow and shoulder. He played through pain, learned hard lessons, and left with clarity: the stage was right, the timing needed patience. He healed, reset, and returned to training on January 1, 2025, stacking disciplined practice and purposeful rounds.
              </p>

              <p>
                Joe's competitive north star is simple: world-class golf, expressed with mentor energy. He shot 64 at Glendoveer's West course during his breakthrough stretch and sits at +3.5, continuing to build the game for sustained tour-level performance. Off the card, Joe leads STONES GOLF, the player-owned brand fusing performance with culture. Its symbols—the hourglass, ellipsis, and Flower of Life—stand for reversing time, second chances, and infinite renewal. "Say Uncle" is both trash talk and family salute: when Joe turns up the dominance, opponents and fans alike know the chant.
              </p>

              <p>
                As he advances through qualifiers and invites, Joe's platform powers more than a score. It powers the Triangle era—activations that blend tournaments, community events, and design-led merch drops—bringing new fans into golf without asking them to change who they are. The mission is bigger than a trophy: build a movement that makes golf feel like home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-12 text-center">Key Moments</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <span className="text-joe-gold font-joe-heading font-bold text-xl">Childhood</span>
              </div>
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-joe-gold rounded-full mt-2"></div>
              </div>
              <div className="flex-1 bg-joe-stone/20 border border-joe-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-joe-gold" />
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold">Nashville Beginnings</h3>
                </div>
                <p className="text-joe-white font-joe-body">
                  First swings on a friend's backyard par-3; obsession with gear and feel begins.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <span className="text-joe-gold font-joe-heading font-bold text-xl">July 25, 2024</span>
              </div>
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-joe-gold rounded-full mt-2"></div>
              </div>
              <div className="flex-1 bg-joe-stone/20 border border-joe-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-joe-gold" />
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold">The Unlock</h3>
                </div>
                <p className="text-joe-white font-joe-body">
                  Game "unlock" moment—thousands of pure strikes, 64 at Glendoveer (West), commits fully to pro path.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <span className="text-joe-gold font-joe-heading font-bold text-xl">Summer 2024</span>
              </div>
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-joe-gold rounded-full mt-2"></div>
              </div>
              <div className="flex-1 bg-joe-stone/20 border border-joe-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-joe-gold" />
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold">Self-Sponsorship</h3>
                </div>
                <p className="text-joe-white font-joe-body">
                  Sells home, becomes own sponsor, invests in complete competitive setup and launches STONES GOLF.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <span className="text-joe-gold font-joe-heading font-bold text-xl">Fall 2024</span>
              </div>
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-joe-gold rounded-full mt-2"></div>
              </div>
              <div className="flex-1 bg-joe-stone/20 border border-joe-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-joe-gold" />
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold">First PGA Qualifier</h3>
                </div>
                <p className="text-joe-white font-joe-body">
                  RSM Classic pre-qualifier at Sea Palms, GA. Plays through left elbow/shoulder injury; lessons over results.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <span className="text-joe-gold font-joe-heading font-bold text-xl">Jan 1, 2025</span>
              </div>
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-joe-gold rounded-full mt-2"></div>
              </div>
              <div className="flex-1 bg-joe-stone/20 border border-joe-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-joe-gold" />
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold">The Reset</h3>
                </div>
                <p className="text-joe-white font-joe-body">
                  Full return to training; structured practice and rounds. Building toward tour-level performance.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <span className="text-joe-gold font-joe-heading font-bold text-xl">Present</span>
              </div>
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-joe-gold rounded-full mt-2"></div>
              </div>
              <div className="flex-1 bg-joe-stone/20 border border-joe-gold/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-joe-gold" />
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold">The Movement</h3>
                </div>
                <p className="text-joe-white font-joe-body">
                  +3.5 index, STONES GOLF growth, Triangle activations, and building a golf culture movement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Facts */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-12 text-center">Fast Facts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-joe-black/50 border border-joe-gold/30 rounded-lg p-6">
              <h3 className="text-joe-gold font-joe-heading font-semibold mb-2">Hometown</h3>
              <p className="text-joe-white font-joe-body">Nashville, Tennessee</p>
            </div>
            
            <div className="bg-joe-black/50 border border-joe-gold/30 rounded-lg p-6">
              <h3 className="text-joe-gold font-joe-heading font-semibold mb-2">Competitive Status</h3>
              <p className="text-joe-white font-joe-body">PGA qualifiers • +3.5 handicap</p>
            </div>
            
            <div className="bg-joe-black/50 border border-joe-gold/30 rounded-lg p-6">
              <h3 className="text-joe-gold font-joe-heading font-semibold mb-2">Breakthrough</h3>
              <p className="text-joe-white font-joe-body">July 2024 "unlock" → 64 at Glendoveer (West)</p>
            </div>
            
            <div className="bg-joe-black/50 border border-joe-gold/30 rounded-lg p-6">
              <h3 className="text-joe-gold font-joe-heading font-semibold mb-2">Brand</h3>
              <p className="text-joe-white font-joe-body">STONES GOLF (player-owned)</p>
            </div>
            
            <div className="bg-joe-black/50 border border-joe-gold/30 rounded-lg p-6">
              <h3 className="text-joe-gold font-joe-heading font-semibold mb-2">Signature Mantra</h3>
              <p className="text-joe-white font-joe-body text-xl">Say Uncle.</p>
            </div>
            
            <div className="bg-joe-black/50 border border-joe-gold/30 rounded-lg p-6">
              <h3 className="text-joe-gold font-joe-heading font-semibold mb-2">Mission</h3>
              <p className="text-joe-white font-joe-body">Reverse Time. Play Bold. Build Family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Hooks */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-8">The Philosophy</h2>
          
          <div className="space-y-6">
            <div className="bg-joe-stone/20 border border-joe-gold/30 rounded-xl p-8">
              <p className="text-2xl md:text-3xl text-joe-gold font-joe-heading font-bold italic">
                "Golf doesn't need me to fit in. It needs me to stand out."
              </p>
            </div>
            
            <div className="bg-joe-stone/20 border border-joe-gold/30 rounded-xl p-8">
              <p className="text-2xl md:text-3xl text-joe-gold font-joe-heading font-bold italic">
                "Uncles raise families. I'm raising a movement."
              </p>
            </div>
            
            <div className="bg-joe-stone/20 border border-joe-gold/30 rounded-xl p-8">
              <p className="text-2xl md:text-3xl text-joe-gold font-joe-heading font-bold">
                Reverse Time. Play Bold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-joe-heading font-bold text-joe-gold mb-6">Join The Movement</h2>
          <p className="text-xl text-joe-white font-joe-body mb-8">
            Follow the journey from Nashville to the PGA Tour. Be part of the Say Uncle movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/journey"
              className="merch-button px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              <span>Follow The Journey</span>
            </Link>
            <Link
              href="/fan-club"
              className="btn-outline border-2 border-joe-gold text-joe-gold hover:bg-joe-gold hover:text-joe-black px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              Join Fan Club
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
