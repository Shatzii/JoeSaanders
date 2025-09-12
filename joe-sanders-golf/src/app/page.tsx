import Image from 'next/image'
import Link from 'next/link'
import { dataClient } from '@/lib/data-client'
import { Sponsor } from '@/types'
import { Check, Zap, Heart, Users, Trophy, Target, Star } from 'lucide-react'

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

        {/* STONESGOLF Integration */}
        <div className="stones-logo-container absolute top-8 right-8 z-10">
          <div className="stones-dot"></div>
          <div className="stones-dot"></div>
          <div className="stones-dot"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-tagline mb-8">
            <h1 className="text-5xl md:text-7xl font-joe-heading font-bold text-joe-gold mb-4">
              Uncle Joe&apos;s AI Golf Pro Tutor
            </h1>
            <p className="text-xl md:text-2xl text-joe-stone font-joe-body mb-4">
              Powered by STONESGOLF - The World&apos;s First AI Golf Success Story
            </p>
            <p className="text-lg md:text-xl text-joe-white font-joe-body mb-8">
              &quot;From Neighborhood Golfer to Official Course - I Did It With STONESGOLF AI!&quot;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/simulator"
              className="merch-button px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              <span>Try Uncle Joe&apos;s AI</span>
            </Link>
            <Link
              href="/uncle-joe"
              className="btn-outline border-2 border-joe-gold text-joe-gold hover:bg-joe-gold hover:text-joe-black px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              Uncle Joe&apos;s Story
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-joe-stone font-joe-body text-lg mb-4">
              The AI that transformed Uncle Joe from neighborhood golfer to tournament competitor
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">20</div>
                <div className="text-sm text-joe-stone font-joe-accent">Stroke Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">85%</div>
                <div className="text-sm text-joe-stone font-joe-accent">User Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">50K+</div>
                <div className="text-sm text-joe-stone font-joe-accent">Active Users</div>
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

      {/* Uncle Joe's Transformation Story */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Uncle Joe&apos;s Transformation</h2>
            <p className="text-lg text-joe-white font-joe-body">The World&apos;s First AI Golf Success Story</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-joe-black rounded-lg shadow-lg p-8 border border-joe-gold/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏌️‍♂️</div>
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Before AI</h3>
                  <p className="text-joe-stone font-joe-body text-sm">
                    Neighborhood golfer, inconsistent swing, high scores, borrowed clubs
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🤖</div>
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">STONESGOLF AI</h3>
                  <p className="text-joe-stone font-joe-body text-sm">
                    24/7 AI coaching, voice guidance, swing analysis, equipment matching
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">After AI</h3>
                  <p className="text-joe-stone font-joe-body text-sm">
                    Official course player, consistent 80s, tournament competitor, 20-stroke improvement
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-joe-gold font-joe-body text-lg mb-4">
                  &quot;If I can do it with AI, anyone can!&quot;
                </p>
                <p className="text-joe-stone font-joe-body">
                  - Uncle Joe Sanders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">The AI That Changed Uncle Joe&apos;s Game</h2>
            <p className="text-lg text-joe-stone font-joe-body max-w-3xl mx-auto">
              Experience the same AI technology that transformed Uncle Joe from neighborhood golfer to tournament competitor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Swing Analysis</h3>
              <p className="text-joe-stone font-joe-body">
                Real-time feedback that fixed Uncle Joe&apos;s slice and improved his consistency.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Voice Coaching</h3>
              <p className="text-joe-stone font-joe-body">
                Uncle Joe&apos;s authentic voice providing personalized coaching and motivation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Progress Tracking</h3>
              <p className="text-joe-stone font-joe-body">
                Monitor improvement like Uncle Joe&apos;s 20-stroke reduction and tournament success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-16 bg-joe-gold text-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold mb-4">Real Results, Real Transformations</h2>
            <p className="text-lg font-joe-body">Following in Uncle Joe&apos;s footsteps</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">15-25</div>
              <div className="text-joe-black/80 font-joe-body">Avg Stroke Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">90%</div>
              <div className="text-joe-black/80 font-joe-body">Increased Enjoyment</div>
            </div>
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">40%</div>
              <div className="text-joe-black/80 font-joe-body">Tournament Participation</div>
            </div>
            <div>
              <div className="text-4xl font-joe-heading font-bold mb-2">25%</div>
              <div className="text-joe-black/80 font-joe-body">Equipment Purchase Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* STONESGOLF Partnership */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Powered by STONESGOLF</h2>
            <p className="text-lg text-joe-white font-joe-body">&quot;Stone Cold Precision Meets AI Golf Excellence&quot;</p>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-joe-black rounded-lg shadow-lg p-8 border border-joe-gold/20">
              <h3 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">Why STONESGOLF?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">Precision Engineering</h4>
                  <p className="text-joe-stone font-joe-body">Every club crafted for maximum performance, just like the AI that helped Uncle Joe.</p>
                </div>
                <div>
                  <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">Inclusive Excellence</h4>
                  <p className="text-joe-stone font-joe-body">Golf for everyone, from neighborhood to championship - Uncle Joe&apos;s story proves it.</p>
                </div>
                <div>
                  <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">AI Innovation</h4>
                  <p className="text-joe-stone font-joe-body">Technology that levels the playing field and creates real transformations.</p>
                </div>
                <div>
                  <h4 className="text-lg font-joe-heading font-semibold text-joe-gold mb-2">Authentic Stories</h4>
                  <p className="text-joe-stone font-joe-body">Real golfers, real results - Uncle Joe&apos;s journey is just the beginning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section className="py-16 bg-joe-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Proudly Sponsored By</h2>
              <p className="text-lg text-joe-stone font-joe-body">Thank you to our amazing partners</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-joe-stone p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-joe-gold/20">
                  {sponsor.logo_url ? (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-32 h-16 bg-joe-black rounded flex items-center justify-center">
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
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Start Your &quot;I Did It&quot; Journey</h2>
          <p className="text-xl mb-8 text-joe-white font-joe-body">
            Join Uncle Joe and thousands of golfers who&apos;ve transformed their game with STONESGOLF AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/simulator"
              className="merch-button px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              <span>Try Uncle Joe&apos;s AI</span>
            </Link>
            <Link
              href="/shop"
              className="btn-outline border-2 border-joe-gold text-joe-gold hover:bg-joe-gold hover:text-joe-black px-8 py-4 rounded-lg font-joe-accent font-bold text-lg"
            >
              Shop STONESGOLF
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
