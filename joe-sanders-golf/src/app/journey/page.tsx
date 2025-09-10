import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Tournament } from '@/types'

async function getTournaments(): Promise<Tournament[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching tournaments:', error)
    return []
  }

  return data || []
}

export default async function JourneyPage() {
  const tournaments = await getTournaments()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">The Journey</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Every tournament, every shot, every lesson learned. Follow my path
              from amateur to professional golfer.
            </p>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tournaments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Tournaments Yet</h3>
              <p className="text-gray-600 mb-6">Tournament data will appear here once added to the CMS.</p>
              <Link
                href="/admin"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Add Tournament Data
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/journey/${tournament.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    {tournament.photo_urls && tournament.photo_urls.length > 0 ? (
                      <Image
                        src={tournament.photo_urls[0]}
                        alt={tournament.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(tournament.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {tournament.name}
                    </h3>
                    {tournament.result && (
                      <p className="text-green-600 font-medium mb-2">
                        Result: {tournament.result}
                      </p>
                    )}
                    {tournament.recap_text && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {tournament.recap_text}
                      </p>
                    )}
                    <div className="mt-4 text-green-600 font-medium">
                      Read Full Recap →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Journey Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Journey Milestones</h2>
            <p className="text-lg text-gray-600">Key achievements and progress markers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">First Professional Win</h3>
              <p className="text-gray-600">Achieved professional status and secured first victory</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consistent Performance</h3>
              <p className="text-gray-600">Maintaining competitive scoring average under par</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growing Fanbase</h3>
              <p className="text-gray-600">Building a community of supporters and followers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sponsorship Growth</h3>
              <p className="text-gray-600">Attracting partners and building brand partnerships</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
