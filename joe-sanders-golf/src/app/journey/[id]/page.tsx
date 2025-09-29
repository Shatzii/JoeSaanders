import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { dataClient } from '@/lib/data-client'
import { Tournament } from '@/types'

// Sample tournament data for development
const sampleTournaments: Tournament[] = [
  {
    id: '1',
    date: '2025-08-15',
    name: 'Stones Golf Championship',
    result: 'T-5th',
    recap_text: 'A breakthrough performance at the Stones Golf Championship! Despite challenging weather conditions, I managed to finish in a tie for 5th place. This tournament showcased the importance of mental resilience and course management. The final round was particularly memorable with a crucial birdie on the 16th hole that kept me in contention.\n\nThe course played extremely difficult due to the wind, but I stayed patient and trusted my swing. My short game was exceptional throughout the week, and I made several key saves that kept me in the hunt. This result moves me up significantly in the Korn Ferry Tour standings and gives me momentum heading into the next few events.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=stones2025',
    created_at: '2025-08-15T00:00:00Z',
    updated_at: '2025-08-15T00:00:00Z'
  },
  {
    id: '2',
    date: '2025-07-22',
    name: 'Uncle Joe Classic',
    result: '2nd Place',
    recap_text: 'Runner-up at the Uncle Joe Classic! This was my best finish of the season so far. I led after the first two rounds but a tough third round put me back in the pack. A strong final round charge got me back into contention, finishing just one stroke behind the winner.\n\nThe first two days were magical - I played some of the best golf of my career, shooting 66-67 to take the lead. The third round was a struggle with the putter, but I regrouped and played phenomenal golf on Sunday. The playoff was heartbreaking, but I\'m proud of how I battled back.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=unclejoe2025',
    created_at: '2025-07-22T00:00:00Z',
    updated_at: '2025-07-22T00:00:00Z'
  },
  {
    id: '3',
    date: '2025-06-10',
    name: 'PGA Tour Qualifying Tournament',
    result: 'T-12th',
    recap_text: 'Successfully advanced through PGA Tour Qualifying! This was a grueling 108-hole tournament that tested every aspect of my game. Starting with 156 players, I battled through four rounds of intense competition.\n\nThe qualifying process was incredibly challenging, but I stayed focused and played consistent golf throughout. My ball-striking was solid, and I managed the course well despite the pressure. This experience will be invaluable as I continue my journey toward full PGA Tour status.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=pgaqualifying2025',
    created_at: '2025-06-10T00:00:00Z',
    updated_at: '2025-06-10T00:00:00Z'
  },
  {
    id: '4',
    date: '2025-05-18',
    name: 'Korn Ferry Tour Championship',
    result: 'T-8th',
    recap_text: 'Strong showing at the Korn Ferry Tour Championship! Despite being the youngest player in the field, I held my own and finished in a tie for 8th. The competition level here is incredible and gave me a taste of what PGA Tour golf will be like.\n\nPlaying against some of the best players in the world was an incredible learning experience. I competed hard all week and showed that I belong at this level. This result should help me secure more starts for the remainder of the season.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=kornferry2025',
    created_at: '2025-05-18T00:00:00Z',
    updated_at: '2025-05-18T00:00:00Z'
  },
  {
    id: '5',
    date: '2025-04-05',
    name: 'Spring Classic Invitational',
    result: '1st Place',
    recap_text: 'VICTORY! My first professional win at the Spring Classic Invitational! This was an emotional moment that validated all the hard work and sacrifices I\'ve made. The tournament came down to a sudden-death playoff where I made a crucial 12-foot putt to secure the win.\n\nThis victory opens up new opportunities and sponsorship possibilities. The win came after a tough battle with several other players, but I stayed composed and made the big putt when it mattered most. This is a moment I\'ll never forget.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=springclassic2025',
    created_at: '2025-04-05T00:00:00Z',
    updated_at: '2025-04-05T00:00:00Z'
  },
  {
    id: '6',
    date: '2025-03-14',
    name: 'Mini-Tour Championship',
    result: 'T-3rd',
    recap_text: 'Consistent performance at the Mini-Tour Championship! I started the tournament with three straight rounds in the 60s, which put me in great position. A final round 73 was still good enough for a tie for 3rd place.\n\nThis result helped me gain valuable Korn Ferry Tour points and increased my status on the developmental tour. The consistency I showed over four days was exactly what I needed to prove to myself and others that I can compete at this level.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=minitour2025',
    created_at: '2025-03-14T00:00:00Z',
    updated_at: '2025-03-14T00:00:00Z'
  }
]

async function getTournament(id: string): Promise<Tournament | null> {
  try {
    return await dataClient.getTournamentById(id)
  } catch (error) {
    console.error('Error fetching tournament:', error)
    // Fallback to sample data
    return sampleTournaments.find(t => t.id === id) || null
  }
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TournamentPage({ params }: PageProps) {
  const resolvedParams = await params
  const tournament = await getTournament(resolvedParams.id)

  if (!tournament) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-joe-black to-joe-black text-joe-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm text-joe-stone mb-4">
              {new Date(tournament.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 className="text-4xl md:text-5xl font-joe-heading font-bold mb-4 text-joe-gold">{tournament.name}</h1>
            {tournament.result && (
              <div className="text-2xl text-joe-gold font-joe-accent font-medium">
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
                <h2 className="text-2xl font-joe-heading font-bold text-joe-gold mb-6">Tournament Highlights</h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={tournament.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Recap Text */}
            {tournament.recap_text && (
              <div className="bg-joe-black rounded-lg shadow-md p-8 mb-12 border border-joe-gold/20">
                <h2 className="text-2xl font-joe-heading font-bold text-joe-gold mb-6">Tournament Recap</h2>
                <div className="prose prose-lg max-w-none">
                  {tournament.recap_text.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-joe-stone leading-relaxed font-joe-body">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {tournament.photo_urls && tournament.photo_urls.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-joe-heading font-bold text-joe-gold mb-6">Photo Gallery</h2>
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
            <div className="bg-joe-black rounded-lg shadow-md p-8 mb-12 border border-joe-gold/20">
              <h2 className="text-2xl font-joe-heading font-bold text-joe-gold mb-6">Tournament Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-joe-gold/30 rounded-lg p-4">
                  <h3 className="font-joe-accent font-semibold text-joe-gold mb-2">Date</h3>
                  <p className="text-joe-stone font-joe-body">
                    {new Date(tournament.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="border border-joe-gold/30 rounded-lg p-4">
                  <h3 className="font-joe-accent font-semibold text-joe-gold mb-2">Location</h3>
                  <p className="text-joe-stone font-joe-body">TBD</p>
                </div>
                <div className="border border-joe-gold/30 rounded-lg p-4">
                  <h3 className="font-joe-accent font-semibold text-joe-gold mb-2">Field Size</h3>
                  <p className="text-joe-stone font-joe-body">TBD</p>
                </div>
                <div className="border border-joe-gold/30 rounded-lg p-4">
                  <h3 className="font-joe-accent font-semibold text-joe-gold mb-2">Prize Fund</h3>
                  <p className="text-joe-stone font-joe-body">TBD</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Link
                href="/journey"
                className="flex items-center text-joe-gold hover:text-joe-gold/80 font-joe-accent font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Tournaments
              </Link>

              <div className="flex space-x-4">
                <button className="merch-button px-6 py-2 rounded-lg font-joe-accent font-bold">
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
