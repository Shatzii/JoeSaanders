import Image from 'next/image'
import Link from 'next/link'
import { dataClient } from '@/lib/data-client'
import { Sponsor } from '@/types'
import { Check, Zap, Heart, Users } from 'lucide-react'

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
              Professional Golfer • PGA Tour Dreamer • Storyteller
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
              Building a legacy one swing at a time
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">47</div>
                <div className="text-sm text-joe-stone font-joe-accent">Tournaments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">12</div>
                <div className="text-sm text-joe-stone font-joe-accent">Top 10s</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-joe-heading font-bold text-joe-gold">3</div>
                <div className="text-sm text-joe-stone font-joe-accent">Wins</div>
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

      {/* Why Joe Section */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Why Joe?</h2>
            <p className="text-lg text-joe-stone font-joe-body max-w-3xl mx-auto">
              Discover what makes my journey unique and why I&apos;m building something special
              in the world of professional golf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Relentless Work Ethic</h3>
              <p className="text-joe-stone font-joe-body">
                Every practice session, every swing, every putt - I give 100% effort
                to improve and achieve my goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Passionate Storyteller</h3>
              <p className="text-joe-stone font-joe-body">
                I believe in sharing the real journey - the struggles, the victories,
                and the lessons learned along the way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Community Builder</h3>
              <p className="text-joe-stone font-joe-body">
                Building a supportive community of golf enthusiasts who believe
                in the power of perseverance and passion.
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
