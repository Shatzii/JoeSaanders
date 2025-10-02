'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertTriangle, Video, MessageCircle, DollarSign, Heart, TrendingUp } from 'lucide-react'

export default function FanClubPage() {
  const { data: session, status } = useSession()
  const [isFanClubMember, setIsFanClubMember] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // Check if user is a fan club member (you can implement this with your backend)
      // For now, we'll check localStorage or a simple flag
      const memberStatus = localStorage.getItem(`fanClub_${session.user.id}`)
      setIsFanClubMember(memberStatus === 'true')
    }

    setLoading(false)
  }, [session, status])

  const handleSubscribe = async () => {
    if (!session?.user) {
      // Redirect to auth
      signIn('auth0')
      return
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url // Redirect to Stripe Checkout
      } else {
        console.error('Failed to create subscription')
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-joe-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="hero-container text-joe-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-tagline mb-4">Uncle Joes Golf Fan Club</h1>
            <p className="text-xl text-joe-stone max-w-3xl mx-auto font-joe-body">
              Join an exclusive community of golf enthusiasts supporting my PGA Tour journey.
              Get behind-the-scenes access, exclusive content, and be part of the story.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Status */}
      {session?.user && (
        <section className="py-8 bg-joe-stone border-b border-joe-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {isFanClubMember ? (
                <div className="bg-joe-gold/10 border border-joe-gold/30 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-joe-gold mr-2" />
                    <span className="text-xl font-joe-heading font-semibold text-joe-gold">Fan Club Member</span>
                  </div>
                  <p className="text-joe-white font-joe-body">Welcome to the exclusive Fan Club! Enjoy all member benefits.</p>
                </div>
              ) : (
                <div className="bg-joe-crimson/10 border border-joe-crimson/30 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-joe-crimson mr-2" />
                    <span className="text-xl font-joe-heading font-semibold text-joe-crimson">Not a Member Yet</span>
                  </div>
                  <p className="text-joe-stone font-joe-body">Join the Fan Club to unlock exclusive content and benefits.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Fan Club Benefits */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Fan Club Benefits</h2>
            <p className="text-lg text-joe-stone font-joe-body">Exclusive perks for our most dedicated supporters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="merch-card">
              <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Behind-the-Scenes Content</h3>
              <p className="text-joe-stone font-joe-body">
                Exclusive videos of practice sessions, course previews, and personal insights
                not available to the general public.
              </p>
            </div>

            <div className="merch-card">
              <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Direct Communication</h3>
              <p className="text-joe-stone font-joe-body">
                Private Discord community for direct interaction with me and other fans.
                Ask questions and share your golf experiences.
              </p>
            </div>

            <div className="merch-card">
              <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Exclusive Merchandise</h3>
              <p className="text-joe-stone font-joe-body">
                Early access to limited-edition merchandise and special pricing
                on all official Uncle Joes Golf products.
              </p>
            </div>

            <div className="merch-card">
              <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Tournament Priority</h3>
              <p className="text-joe-stone font-joe-body">
                Priority access to tournament tickets and VIP experiences at select events
                throughout the season.
              </p>
            </div>

            <div className="merch-card">
              <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Personal Connection</h3>
              <p className="text-joe-stone font-joe-body">
                Monthly Q&A sessions and personal shoutouts. Your support means
                the world and I want to show my appreciation.
              </p>
            </div>

            <div className="merch-card">
              <div className="w-12 h-12 bg-joe-gold/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Career Updates</h3>
              <p className="text-joe-stone font-joe-body">
                Be the first to know about career milestones, sponsorship deals,
                and major announcements in my professional journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Join the Fan Club</h2>
            <p className="text-lg text-joe-white font-joe-body">Support my journey and get exclusive access</p>
          </div>

          <div className="bg-joe-black rounded-lg p-8 text-center border border-joe-gold/20">
            <div className="mb-6">
              <div className="text-4xl font-joe-heading font-bold text-joe-gold mb-2">$9.99<span className="text-lg font-normal text-joe-stone">/month</span></div>
              <p className="text-joe-stone font-joe-body">Cancel anytime • No long-term commitment</p>
            </div>

            {session?.user ? (
              isFanClubMember ? (
                <div className="bg-joe-gold/10 border border-joe-gold/30 rounded-lg p-4">
                  <p className="text-joe-gold font-joe-accent font-medium">You&apos;re already a Fan Club member!</p>
                  <p className="text-joe-stone text-sm mt-1 font-joe-body">Enjoy all the exclusive benefits.</p>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="merch-button px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
                >
                  <span>Subscribe Now</span>
                </button>
              )
            ) : (
              <div className="space-y-4">
                <p className="text-joe-stone font-joe-body">Sign in to join the Fan Club</p>
                <button
                  onClick={() => router.push('/auth')}
                  className="merch-button px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
                >
                  <span>Sign In / Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Be Part of the Journey</h2>
          <p className="text-xl mb-8 text-joe-stone font-joe-body">
            Your support helps make PGA Tour dreams a reality. Join the community today.
          </p>
          {!session?.user && (
            <button
              onClick={() => router.push('/auth')}
              className="merch-button px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
            >
              <span>Get Started</span>
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
