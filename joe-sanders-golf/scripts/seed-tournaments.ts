import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleTournaments = [
  {
    date: '2025-08-15',
    name: 'Stones Golf Championship',
    result: 'T-5th',
    recap_text: 'A breakthrough performance at the Stones Golf Championship! Despite challenging weather conditions, I managed to finish in a tie for 5th place. This tournament showcased the importance of mental resilience and course management. The final round was particularly memorable with a crucial birdie on the 16th hole that kept me in contention.',
    photo_urls: ['/images/tournament-stones-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=stones2025'
  },
  {
    date: '2025-07-22',
    name: 'Uncle Joe Classic',
    result: '2nd Place',
    recap_text: 'Runner-up at the Uncle Joe Classic! This was my best finish of the season so far. I led after the first two rounds but a tough third round put me back in the pack. A strong final round charge got me back into contention, finishing just one stroke behind the winner. This result shows the progress I\'ve made in my putting and short game.',
    photo_urls: ['/images/tournament-uncle-joe-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=unclejoe2025'
  },
  {
    date: '2025-06-10',
    name: 'PGA Tour Qualifying Tournament',
    result: 'T-12th',
    recap_text: 'Successfully advanced through PGA Tour Qualifying! This was a grueling 108-hole tournament that tested every aspect of my game. Starting with 156 players, I battled through four rounds of intense competition. The experience gained here will be invaluable as I continue my journey toward full PGA Tour status.',
    photo_urls: ['/images/tournament-pga-qualifying-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=pgaqualifying2025'
  },
  {
    date: '2025-05-18',
    name: 'Korn Ferry Tour Championship',
    result: 'T-8th',
    recap_text: 'Strong showing at the Korn Ferry Tour Championship! This was my first appearance at this prestigious event. Despite being the youngest player in the field, I held my own and finished in a tie for 8th. The competition level here is incredible and gave me a taste of what PGA Tour golf will be like.',
    photo_urls: ['/images/tournament-korn-ferry-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=kornferry2025'
  },
  {
    date: '2025-04-05',
    name: 'Spring Classic Invitational',
    result: '1st Place',
    recap_text: 'VICTORY! My first professional win at the Spring Classic Invitational! This was an emotional moment that validated all the hard work and sacrifices I\'ve made. The tournament came down to a sudden-death playoff where I made a crucial 12-foot putt to secure the win. This victory opens up new opportunities and sponsorship possibilities.',
    photo_urls: ['/images/tournament-spring-classic-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=springclassic2025'
  },
  {
    date: '2025-03-14',
    name: 'Mini-Tour Championship',
    result: 'T-3rd',
    recap_text: 'Consistent performance at the Mini-Tour Championship! I started the tournament with three straight rounds in the 60s, which put me in great position. A final round 73 was still good enough for a tie for 3rd place. This result helped me gain valuable Korn Ferry Tour points and increased my status on the developmental tour.',
    photo_urls: ['/images/tournament-mini-tour-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=minitour2025'
  },
  {
    date: '2025-02-28',
    name: 'Winter Series Finale',
    result: 'T-15th',
    recap_text: 'Solid finish to wrap up the winter season! Despite challenging weather conditions throughout the tournament, I managed to post consistent scores and finish in a tie for 15th. This performance helped me maintain my position in the mini-tour rankings and set me up well for the spring schedule.',
    photo_urls: ['/images/tournament-winter-series-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=winterseries2025'
  },
  {
    date: '2025-01-20',
    name: 'Season Opener Classic',
    result: 'T-22nd',
    recap_text: 'Strong start to the 2025 season! The Season Opener Classic was my first tournament of the year and I got off to a great start with a first-round 67. While I struggled a bit in the middle rounds, I rebounded nicely to finish in a tie for 22nd. This result shows that my offseason work is paying off.',
    photo_urls: ['/images/tournament-season-opener-2025.jpg'],
    video_url: 'https://youtube.com/watch?v=seasonopener2025'
  }
]

async function seedTournaments() {
  try {
    console.log('🌱 Seeding tournament data...')

    for (const tournament of sampleTournaments) {
      const { data, error } = await supabase
        .from('tournaments')
        .insert(tournament)
        .select()

      if (error) {
        console.error('Error inserting tournament:', error)
      } else {
        console.log(`✅ Added: ${tournament.name}`)
      }
    }

    console.log('🎉 Tournament seeding complete!')
  } catch (error) {
    console.error('Error seeding tournaments:', error)
  }
}

seedTournaments()
