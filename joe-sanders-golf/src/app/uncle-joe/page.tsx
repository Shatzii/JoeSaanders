import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Quote } from 'lucide-react'

export default function UncleJoePage() {
  return (
    <div className="min-h-screen bg-joe-black text-joe-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-joe-gold hover:text-joe-rose-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-5xl md:text-7xl font-joe-heading font-bold mb-6 text-joe-gold">
            Uncle Joe Sanders
          </h1>

          <p className="text-xl md:text-2xl text-joe-white/80 font-joe-body mb-12">
            The Man Behind the Movement
          </p>
        </div>
      </section>

      {/* Bio Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-joe-black/50 backdrop-blur-sm border border-joe-gold/20 rounded-lg p-8 md:p-12">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-xl leading-relaxed mb-8 font-joe-body">
                Joe &quot;Uncle Joe&quot; Sanders isn&apos;t just chasing golf — he&apos;s rewriting it. A former football player and lifelong tinkerer with the game, Joe&apos;s journey to the PGA began in a Nashville backyard, swinging an eight-iron for the first time at a teammate&apos;s par-3 course. What started as instinct quickly became obsession, and in July 2024, God revealed his gift: the ability to strike the ball pure, round after round, unlocking a destiny he couldn&apos;t ignore.
              </p>

              <p className="text-xl leading-relaxed mb-8 font-joe-body">
                Unlike most pros, Joe didn&apos;t wait for Nike or Titleist to call. He became his own sponsor, selling his home, clearing his debts, and launching Stones Golf — the first player-owned golf brand, built not just for the sport but for culture. The mantra is simple: Reverse Time. Play Bold. Build Family.
              </p>

              <p className="text-xl leading-relaxed mb-8 font-joe-body">
                The name &quot;Uncle Joe&quot; carries weight. It&apos;s respect and mentorship. It&apos;s dominance on the course, making opponents and fans alike Say Uncle. It&apos;s family — rooted in legacy, community, and building something that lasts.
              </p>

              <p className="text-xl leading-relaxed mb-8 font-joe-body">
                Joe&apos;s debut journey came with adversity — an injury before his first PGA qualifier. But setbacks became lessons. Today, as a +3.5 handicap with a growing movement behind him, Joe is preparing to step into the light as a PGA competitor and cultural icon.
              </p>

              <p className="text-xl leading-relaxed mb-8 font-joe-body">
                For Joe, golf isn&apos;t about fitting in — it&apos;s about standing out. He represents grit, faith, and the courage to build your own lane. With Stones Golf, the Family Reunion Tour, Lady Stones, and Stones Golf Village on the horizon, Uncle Joe is more than a player. He&apos;s a declaration:
              </p>

              {/* Quote Section */}
              <div className="my-12 p-8 bg-gradient-to-r from-joe-gold/10 to-cool-rose/10 border-l-4 border-joe-gold rounded-r-lg">
                <Quote className="w-8 h-8 text-joe-gold mb-4" />
                <blockquote className="text-2xl md:text-3xl font-joe-heading font-bold text-joe-gold italic">
                  &quot;Golf doesn&apos;t need me to fit in. It needs me to stand out.&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-joe-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-joe-headline font-bold mb-6 text-joe-gold">
            Join the Movement
          </h2>

          <p className="text-lg text-joe-white/80 mb-8 font-joe-body">
            Follow Uncle Joe&apos;s journey and be part of the Stones Golf revolution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/journey"
              className="bg-joe-gold text-joe-black px-8 py-3 rounded-lg font-semibold hover:bg-joe-rose-gold transition-colors"
            >
              View Tournament Journey
            </Link>

            <Link
              href="/shop"
              className="border border-joe-gold text-joe-gold px-8 py-3 rounded-lg font-semibold hover:bg-joe-gold hover:text-joe-black transition-colors"
            >
              Shop Stones Golf
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}