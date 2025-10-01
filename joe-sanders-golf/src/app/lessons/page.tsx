import BookingWidget from '@/components/BookingWidget'

export const metadata = {
  title: 'Lessons - Book a Private Session with Uncle Joe',
  description: 'Schedule a private golf lesson with Uncle Joe. Sharpen fundamentals, fix your slice, and build confidence.',
}

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-joe-black via-joe-stone to-joe-black text-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-joe-heading font-bold text-joe-gold">Book a Private Lesson</h1>
          <p className="text-joe-white/80 mt-3 max-w-2xl mx-auto">
            Work 1-on-1 with Uncle Joe. We’ll lock in your grip, stance, alignment, and tempo, and send you home with a focused plan.
          </p>
        </header>

        <BookingWidget />

        <section className="bg-joe-black/50 border border-joe-gold/20 rounded-xl p-6">
          <h2 className="text-2xl font-joe-heading text-joe-gold mb-2">What to Expect</h2>
          <ul className="list-disc ml-5 space-y-1 text-joe-white/80">
            <li>Warm-up and baseline assessment</li>
            <li>Targeted drills to address your biggest miss</li>
            <li>Video review and personalized take-home plan</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
