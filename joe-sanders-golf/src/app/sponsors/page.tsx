import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'
import { supabaseServer } from '@/lib/supabase'

type Sponsor = {
  id: string
  name: string
  logo_url: string
  tier?: string
  website_url?: string
}

async function getLocalSponsors(): Promise<Sponsor[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'local-data.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const json = JSON.parse(raw)
    return (json.sponsors || []) as Sponsor[]
  } catch {
    return []
  }
}

type DbSponsor = {
  id?: string | number
  name: string
  logo_url?: string
  logo?: string
  tier?: string
  website_url?: string
  url?: string
}

async function getSupabaseSponsors(): Promise<Sponsor[]> {
  if (!supabaseServer) return []
  try {
    const { data, error } = await supabaseServer.from('sponsors').select('*')
    if (error || !data) return []
    // Normalize fields in case DB uses different keys
    return (data as DbSponsor[]).map((s) => ({
      id: String(s.id ?? s.name),
      name: s.name,
      logo_url: s.logo_url || s.logo || '',
      tier: s.tier,
      website_url: s.website_url || s.url,
    }))
  } catch {
    return []
  }
}

function mergeSponsors(primary: Sponsor[], fallback: Sponsor[]): Sponsor[] {
  const byKey = new Map<string, Sponsor>()
  const key = (s: Sponsor) => (s.name || s.id).toLowerCase().trim()
  primary.forEach(s => byKey.set(key(s), s))
  fallback.forEach(s => {
    const k = key(s)
    if (!byKey.has(k)) byKey.set(k, s)
  })
  return Array.from(byKey.values())
}

export default async function SponsorsPage() {
  // Fetch from Supabase if available, otherwise fall back to local JSON
  const [dbSponsors, localSponsors] = await Promise.all([
    getSupabaseSponsors(),
    getLocalSponsors(),
  ])

  const sponsors = mergeSponsors(dbSponsors, localSponsors)

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero */}
      <section className="bg-joe-stone py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">Our Sponsors</h1>
          <p className="text-xl text-joe-white/90 font-joe-body max-w-3xl mx-auto">
            Grateful for the partners who fuel the journey. Explore our official sponsors below.
          </p>
          <div className="mt-6">
            <Link href="/sponsorship" className="merch-button inline-block px-6 py-3 rounded-lg font-joe-accent font-bold text-lg">
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sponsors.length === 0 ? (
            <div className="text-center text-joe-stone font-joe-body">
              Sponsor list coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              {sponsors.map((s) => (
                <div key={s.id} className="bg-joe-stone/50 rounded-lg p-4 border border-joe-gold/20 flex items-center justify-center hover:border-joe-gold/40 transition-colors">
                  {s.website_url ? (
                    <a href={s.website_url} target="_blank" rel="noopener noreferrer" className="block text-center">
                      {s.logo_url ? (
                        <Image src={s.logo_url} alt={`${s.name} Logo`} width={220} height={120} className="object-contain max-h-20 w-auto mx-auto" />
                      ) : (
                        <div className="text-joe-white font-joe-accent">{s.name}</div>
                      )}
                      {s.tier && (
                        <div className="text-xs text-joe-gold/80 mt-2 font-joe-accent">{s.tier} Partner</div>
                      )}
                    </a>
                  ) : (
                    <div className="text-center">
                      {s.logo_url ? (
                        <Image src={s.logo_url} alt={`${s.name} Logo`} width={220} height={120} className="object-contain max-h-20 w-auto mx-auto" />
                      ) : (
                        <div className="text-joe-white font-joe-accent">{s.name}</div>
                      )}
                      {s.tier && (
                        <div className="text-xs text-joe-gold/80 mt-2 font-joe-accent">{s.tier} Partner</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
