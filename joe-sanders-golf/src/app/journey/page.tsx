import Link from 'next/link'
import Image from 'next/image'
import { dataClient } from '@/lib/data-client'
import { Tournament } from '@/types'
import { Plus, Image as ImageIcon, CheckCircle, TrendingUp, Users, Building } from 'lucide-react'

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic'

// Sample tournament data for development
const sampleTournaments: Tournament[] = [
  {
    id: '1',
    title: 'Stones Golf Championship',
    date: '2025-08-15',
    location: 'Stones Golf Club',
    description: 'Major tournament at Stones Golf Club',
    status: 'completed',
    name: 'Stones Golf Championship',
    result: 'T-5th',
    recap_text: 'A breakthrough performance at the Stones Golf Championship! Despite challenging weather conditions, I managed to finish in a tie for 5th place. This tournament showcased the importance of mental resilience and course management.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=stones2025',
    created_at: '2025-08-15T00:00:00Z',
    updated_at: '2025-08-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Uncle Joe Classic',
    date: '2025-07-22',
    location: 'Uncle Joe Golf Course',
    description: 'Signature tournament at Uncle Joe Golf Course',
    status: 'completed',
    name: 'Uncle Joe Classic',
    result: '2nd Place',
    recap_text: 'Runner-up at the Uncle Joe Classic! This was my best finish of the season so far. I led after the first two rounds but a tough third round put me back in the pack.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=unclejoe2025',
    created_at: '2025-07-22T00:00:00Z',
    updated_at: '2025-07-22T00:00:00Z'
  },
  {
    id: '3',
    title: 'PGA Tour Qualifying Tournament',
    date: '2025-06-10',
    location: 'PGA Tour Qualifying Site',
    description: 'PGA Tour qualifying tournament',
    status: 'completed',
    name: 'PGA Tour Qualifying Tournament',
    result: 'T-12th',
    recap_text: 'Successfully advanced through PGA Tour Qualifying! This was a grueling 108-hole tournament that tested every aspect of my game.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=pgaqualifying2025',
    created_at: '2025-06-10T00:00:00Z',
    updated_at: '2025-06-10T00:00:00Z'
  },
  {
    id: '4',
    title: 'Korn Ferry Tour Championship',
    date: '2025-05-18',
    location: 'Korn Ferry Tour Venue',
    description: 'Korn Ferry Tour championship event',
    status: 'completed',
    name: 'Korn Ferry Tour Championship',
    result: 'T-8th',
    recap_text: 'Strong showing at the Korn Ferry Tour Championship! Despite being the youngest player in the field, I held my own and finished in a tie for 8th.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=kornferry2025',
    created_at: '2025-05-18T00:00:00Z',
    updated_at: '2025-05-18T00:00:00Z'
  },
  {
    id: '5',
    title: 'Spring Classic Invitational',
    date: '2025-04-05',
    location: 'Spring Classic Golf Club',
    description: 'Spring Classic Invitational tournament',
    status: 'completed',
    name: 'Spring Classic Invitational',
    result: '1st Place',
    recap_text: 'VICTORY! My first professional win at the Spring Classic Invitational! This was an emotional moment that validated all the hard work.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=springclassic2025',
    created_at: '2025-04-05T00:00:00Z',
    updated_at: '2025-04-05T00:00:00Z'
  },
  {
    id: '6',
    title: 'Mini-Tour Championship',
    date: '2025-03-14',
    location: 'Mini-Tour Venue',
    description: 'Mini-Tour championship event',
    status: 'completed',
    name: 'Mini-Tour Championship',
    result: 'T-3rd',
    recap_text: 'Consistent performance at the Mini-Tour Championship! I started the tournament with three straight rounds in the 60s.',
    photo_urls: [],
    video_url: 'https://youtube.com/watch?v=minitour2025',
    created_at: '2025-03-14T00:00:00Z',
    updated_at: '2025-03-14T00:00:00Z'
  }
]

async function getTournaments(): Promise<Tournament[]> {
  try {
    return await dataClient.getTournaments()
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return sampleTournaments // Fallback to sample data
  }
}

export default async function JourneyPage() {
  const tournaments = await getTournaments()

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="hero-container text-joe-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-tagline mb-4">The Journey</h1>
            <p className="text-xl text-joe-stone max-w-3xl mx-auto font-joe-body mb-8">
              From a Nashville backyard par-3 to the PGA Tour. Every tournament, every breakthrough, every lesson learned on the path to professional golf.
            </p>
            <div className="max-w-4xl mx-auto bg-joe-stone/20 border border-joe-gold/30 rounded-2xl p-8 text-left">
              <h2 className="text-2xl font-joe-heading font-bold text-joe-gold mb-4">The Origin Story</h2>
              <p className="text-joe-white font-joe-body leading-relaxed mb-4">
                Joe &quot;Uncle Joe&quot; Sanders is a competitor, creator, and cultural architect shaping a new era of golf. His story begins in Nashville, Tennessee, where a youth basketball teammate&apos;s backyard par-3 introduced him to the game. The early years were pure curiosity—drivers, putters, grips, and shafts cycled through in an obsessive search for feel. That tinkerer&apos;s mindset became his competitive edge.
              </p>
              <p className="text-joe-white font-joe-body leading-relaxed mb-4">
                In July 2024, everything aligned. After years of grinding without the results he knew were inside him, Joe experienced what he calls a God-given unlock—the moment when mechanics, rhythm, and mind finally clicked. Within days he pured thousands of shots and knew his life had changed. He sold his house, cleared debts, became his own sponsor, and invested in a complete competitive kit—treating golf like the profession it had already become in his mind.
              </p>
              <p className="text-joe-white font-joe-body leading-relaxed">
                Now a +3.5 handicap, Joe combines elite competitive goals with mentorship energy—competing, creating, and architecting a movement where golf meets culture, family, and design through his player-owned brand, STONES GOLF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tournaments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-joe-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-joe-gold" />
              </div>
              <h3 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-2">No Tournaments Yet</h3>
              <p className="text-joe-white mb-6 font-joe-body">Tournament data will appear here once added to the CMS.</p>
              <Link
                href="/admin"
                className="merch-button px-6 py-3 rounded-lg font-joe-accent font-bold text-lg"
              >
                <span>Add Tournament Data</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/journey/${tournament.id}`}
                  className="merch-card"
                >
                  <div className="aspect-video bg-joe-black relative">
                    {tournament.photo_urls && tournament.photo_urls.length > 0 ? (
                      <Image
                        src={tournament.photo_urls[0]}
                        alt={tournament.name || tournament.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-joe-gold" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-joe-stone mb-2 font-joe-accent">
                      {new Date(tournament.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">
                      {tournament.name}
                    </h3>
                    {tournament.result && (
                      <p className="text-joe-gold font-medium mb-2 font-joe-accent">
                        Result: {tournament.result}
                      </p>
                    )}
                    {tournament.recap_text && (
                      <p className="text-joe-white text-sm line-clamp-3 font-joe-body">
                        {tournament.recap_text}
                      </p>
                    )}
                    <div className="mt-4 text-joe-gold font-medium font-joe-accent">
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
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Journey Milestones</h2>
            <p className="text-lg text-joe-stone font-joe-body">Key achievements and progress markers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">First Professional Win</h3>
              <p className="text-joe-stone font-joe-body">Achieved professional status and secured first victory</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Consistent Performance</h3>
              <p className="text-joe-stone font-joe-body">Maintaining competitive scoring average under par</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Growing Fanbase</h3>
              <p className="text-joe-stone font-joe-body">Building a community of supporters and followers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Sponsorship Growth</h3>
              <p className="text-joe-stone font-joe-body">Attracting partners and building brand partnerships</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
