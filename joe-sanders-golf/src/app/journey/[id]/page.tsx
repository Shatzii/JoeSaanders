import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Tournament } from '@/types'

async function getTournament(id: string): Promise<Tournament | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tournament:', error)
    return null
  }

  return data
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function TournamentPage({ params }: PageProps) {
  const tournament = await getTournament(params.id)

  if (!tournament) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm text-green-100 mb-4">
              {new Date(tournament.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tournament.name}</h1>
            {tournament.result && (
              <div className="text-2xl text-green-100 font-medium">
                Result: {tournament.result}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Video Section */}
            {tournament.video_url && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tournament Highlights</h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={tournament.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Recap Text */}
            {tournament.recap_text && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tournament Recap</h2>
                <div className="prose prose-lg max-w-none">
                  {tournament.recap_text.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {tournament.photo_urls && tournament.photo_urls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournament.photo_urls.map((photoUrl, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={photoUrl}
                        alt={`${tournament.name} - Photo ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tournament Stats */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tournament Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Date</h3>
                  <p className="text-gray-600">
                    {new Date(tournament.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">TBD</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Field Size</h3>
                  <p className="text-gray-600">TBD</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Prize Fund</h3>
                  <p className="text-gray-600">TBD</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Link
                href="/journey"
                className="flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Tournaments
              </Link>

              <div className="flex space-x-4">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Share This Tournament
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
