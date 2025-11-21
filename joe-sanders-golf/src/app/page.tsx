import Image from 'next/image'
import Link from 'next/link'
import { dataClient } from '@/lib/data-client'
import { Sponsor } from '@/types'
import { Check, Zap, Heart, Users, Target, Volume2, TrendingUp } from 'lucide-react'

async function getSponsors(): Promise<Sponsor[]> {
  try {
    return await dataClient.getSponsors()
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return []
  }
}

export default async function Home() {
  const sponsors = await getSponsors()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-container relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-joe-black via-joe-black/95 to-joe-black/90"></div>

        {/* Stones Golf Integration */}
        <div className="stones-logo-container absolute top-8 right-8 z-10">
          <div className="stones-dot"></div>
          <div className="stones-dot"></div>
          <div className="stones-dot"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-tagline mb-8">
            <h1 className="text-5xl md:text-7xl font-joe-heading font-bold text-joe-gold mb-4">
              Say Uncle
            </h1>
            <p className="text-xl md:text-2xl text-joe-stone font-joe-body mb-8">
              Player-founder rewriting golf's rules—PGA track, culture-first brand builder, and the soul behind STONES GOLF
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/journey"
              className="merch-button px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              <span>Follow The Journey</span>
            </Link>
            <Link
              href="/shop"
              className="btn-outline border-2 border-joe-gold text-joe-gold hover:bg-joe-gold hover:text-joe-black px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              Visit Pro Shop
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-joe-stone font-joe-body text-lg mb-4">
              Reverse Time. Play Bold. Build Family.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">+3.5</div>
                <div className="text-sm text-joe-stone font-joe-accent">Handicap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">64</div>
                <div className="text-sm text-joe-stone font-joe-accent">Career Low</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">2024</div>
                <div className="text-sm text-joe-stone font-joe-accent">Breakthrough</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-8 opacity-20">
          <div className="w-32 h-32 border border-joe-gold rounded-full"></div>
        </div>
        <div className="absolute top-16 left-16 opacity-20">
          <div className="w-24 h-24 border border-joe-gold rounded-full"></div>
        </div>
      </section>

      {/* Progress Bar Section */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">The Journey Progress</h2>
            <p className="text-lg text-joe-white font-joe-body">Tracking my path to the PGA Tour</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-joe-black rounded-lg shadow-lg p-8 border border-joe-gold/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-joe-accent font-medium text-joe-stone">Amateur</span>
                <span className="text-sm font-joe-accent font-medium text-joe-stone">Mini-Tours</span>
                <span className="text-sm font-joe-accent font-medium text-joe-stone">Korn Ferry Tour</span>
                <span className="text-sm font-joe-accent font-medium text-joe-stone">PGA Tour</span>
              </div>

              <div className="w-full bg-joe-stone rounded-full h-4 mb-4">
                <div className="bg-joe-gold h-4 rounded-full" style={{ width: '35%' }}></div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="text-joe-gold">
                  <div className="w-8 h-8 bg-joe-gold rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Check className="w-4 h-4 text-joe-black" />
                  </div>
                  <p className="text-sm font-joe-accent font-medium text-joe-gold">Completed</p>
                </div>
                <div className="text-joe-gold">
                  <div className="w-8 h-8 bg-joe-gold rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Check className="w-4 h-4 text-joe-black" />
                  </div>
                  <p className="text-sm font-joe-accent font-medium text-joe-gold">In Progress</p>
                </div>
                <div className="text-joe-stone">
                  <div className="w-8 h-8 bg-joe-stone rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-joe-accent font-medium text-joe-stone">Next Goal</p>
                </div>
                <div className="text-joe-stone">
                  <div className="w-8 h-8 bg-joe-stone rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-joe-accent font-medium text-joe-stone">Ultimate Goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="py-16 bg-joe-gold text-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">47</div>
              <div className="text-joe-black/80 font-joe-body">Tournaments Played</div>
            </div>
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">12</div>
              <div className="text-joe-black/80 font-joe-body">Top 10 Finishes</div>
            </div>
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">3</div>
              <div className="text-joe-black/80 font-joe-body">Professional Wins</div>
            </div>
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">72.3</div>
              <div className="text-joe-black/80 font-joe-body">Scoring Average</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Golf Tutor Section */}
      <section className="py-16 bg-gradient-to-br from-joe-black via-joe-stone to-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">
              Uncle Joe Golf Pro - AI Golf Tutor
            </h2>
            <p className="text-xl text-joe-white font-joe-body max-w-3xl mx-auto mb-8">
              Experience the future of golf coaching with AI-powered swing analysis, voice feedback, and personalized tips from Uncle Joe himself.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Features List */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mt-1">
                  <Target className="w-6 h-6 text-joe-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">AI Swing Analysis</h3>
                  <p className="text-joe-white font-joe-body">
                    Get instant feedback on your shots with GPT-4 powered analysis. Every swing is evaluated for club selection, distance, and technique.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mt-1">
                  <Volume2 className="w-6 h-6 text-joe-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Voice Coaching</h3>
                  <p className="text-joe-white font-joe-body">
                    Hear Uncle Joe&apos;s coaching tips in his authentic voice using ElevenLabs AI. Get personalized advice that feels like having a pro on the course.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mt-1">
                  <TrendingUp className="w-6 h-6 text-joe-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Performance Tracking</h3>
                  <p className="text-joe-white font-joe-body">
                    Track your progress over time with detailed analytics, shot history, and improvement recommendations tailored to your game.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-joe-gold/10 to-joe-gold/5 rounded-2xl p-8 border border-joe-gold/20">
              <div className="text-center">
                <div className="text-6xl mb-6">🏌️‍♂️</div>
                <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-4">
                  Try It FREE Right Now!
                </h3>
                <p className="text-joe-white font-joe-body mb-6">
                  No sign-up required. Take 5 demo shots and experience the AI coaching that&apos;s helping golfers improve their game.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/simulator"
                    className="inline-block w-full bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-8 py-4 rounded-lg font-joe-heading font-bold text-lg hover:from-amber-400 hover:to-joe-gold transition-all duration-300 transform hover:scale-105"
                  >
                    🚀 Launch AI Golf Tutor Demo
                  </Link>
                  <p className="text-sm text-joe-white/80">
                    ✅ Instant access &nbsp;•&nbsp; ✅ No credit card needed &nbsp;•&nbsp; ✅ 5 free shots
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Features Preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">Smart Shot Analysis</h4>
              <p className="text-sm text-joe-white/80">AI evaluates every shot for accuracy, distance, and technique</p>
            </div>
            <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20 text-center">
              <div className="text-3xl mb-3">🗣️</div>
              <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">Voice Feedback</h4>
              <p className="text-sm text-joe-white/80">Hear coaching tips in Uncle Joe&apos;s authentic voice</p>
            </div>
            <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">Instant Improvement</h4>
              <p className="text-sm text-joe-white/80">Get specific tips to improve your next shot immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Joe Section */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">The Uncle Joe Story</h2>
            <p className="text-lg text-joe-stone font-joe-body max-w-3xl mx-auto">
              A Nashville tinkerer turned PGA competitor. A player-owned brand builder. A cultural architect rewriting golf&apos;s rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">The Breakthrough</h3>
              <p className="text-joe-stone font-joe-body">
                July 2024 changed everything. After years of tinkering, God revealed the gift—thousands of pure strikes, a 64 at Glendoveer, and a destiny that couldn&apos;t be ignored.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Player-Owned Brand</h3>
              <p className="text-joe-stone font-joe-body">
                Sold his home, became his own sponsor, and launched STONES GOLF—the first player-owned golf brand built for culture, not just the course.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Say Uncle Movement</h3>
              <p className="text-joe-stone font-joe-body">
                &quot;Uncles raise families. I&apos;m raising a movement.&quot; A chant, a brand, a family ritual bringing new fans to golf without asking them to change who they are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section className="py-16 bg-joe-stone">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Proudly Sponsored By</h2>
              <p className="text-lg text-joe-white font-joe-body">Thank you to our amazing partners</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-joe-black p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-joe-gold/20">
                  {sponsor.logo_url ? (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-32 h-16 bg-joe-stone rounded flex items-center justify-center">
                      <span className="text-joe-gold font-joe-accent font-medium">{sponsor.name}</span>
                    </div>
                  )}
                  <p className="text-center mt-2 text-sm text-joe-gold font-joe-accent capitalize">{sponsor.tier} Partner</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Join The Journey</h2>
          <p className="text-xl mb-8 text-joe-stone font-joe-body">
            Be part of something special. Follow my progress and support my PGA Tour dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
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
