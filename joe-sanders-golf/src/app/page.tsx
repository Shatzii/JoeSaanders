import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Sponsor } from '@/types'

async function getSponsors(): Promise<Sponsor[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('tier', { ascending: false })

  if (error) {
    console.error('Error fetching sponsors:', error)
    return []
  }

  return data || []
}

export default async function Home() {
  const sponsors = await getSponsors()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Joe Sanders
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Professional Golfer • PGA Tour Journey
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Follow my journey from amateur to professional golfer. Experience the highs,
              the lows, and the dedication it takes to chase the PGA Tour dream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/journey"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Follow The Journey
              </Link>
              <Link
                href="/fan-club"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Join Fan Club
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Journey Progress</h2>
            <p className="text-lg text-gray-600">Tracking my path to the PGA Tour</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-gray-600">Amateur</span>
                <span className="text-sm font-medium text-gray-600">Mini-Tours</span>
                <span className="text-sm font-medium text-gray-600">Korn Ferry Tour</span>
                <span className="text-sm font-medium text-gray-600">PGA Tour</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div className="bg-green-600 h-4 rounded-full" style={{ width: '35%' }}></div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="text-green-600">
                  <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Completed</p>
                </div>
                <div className="text-green-600">
                  <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">In Progress</p>
                </div>
                <div className="text-gray-400">
                  <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Next Goal</p>
                </div>
                <div className="text-gray-400">
                  <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Ultimate Goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">47</div>
              <div className="text-green-100">Tournaments Played</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-green-100">Top 10 Finishes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-green-100">Professional Wins</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">72.3</div>
              <div className="text-green-100">Scoring Average</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Joe Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Joe?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover what makes my journey unique and why I&apos;m building something special
              in the world of professional golf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relentless Work Ethic</h3>
              <p className="text-gray-600">
                Every practice session, every swing, every putt - I give 100% effort
                to improve and achieve my goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passionate Storyteller</h3>
              <p className="text-gray-600">
                I believe in sharing the real journey - the struggles, the victories,
                and the lessons learned along the way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Builder</h3>
              <p className="text-gray-600">
                Building a supportive community of golf enthusiasts who believe
                in the power of perseverance and passion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Proudly Sponsored By</h2>
              <p className="text-lg text-gray-600">Thank you to our amazing partners</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  {sponsor.logo_url ? (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 font-medium">{sponsor.name}</span>
                    </div>
                  )}
                  <p className="text-center mt-2 text-sm text-gray-600 capitalize">{sponsor.tier} Partner</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join The Journey</h2>
          <p className="text-xl mb-8 text-green-100">
            Be part of something special. Follow my progress and support my PGA Tour dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/journey"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore The Journey
            </Link>
            <Link
              href="/fan-club"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Become a Fan Club Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
