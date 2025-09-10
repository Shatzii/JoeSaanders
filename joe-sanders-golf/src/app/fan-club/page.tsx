'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FanClubPage() {
  const [user, setUser] = useState<any>(null)
  const [isFanClubMember, setIsFanClubMember] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      // Check if user is a fan club member
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_fan_club_member')
        .eq('id', user.id)
        .single()

      setIsFanClubMember(profile?.is_fan_club_member || false)
    }

    setLoading(false)
  }

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to auth or show login modal
      router.push('/auth')
      return
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Joe Sanders Fan Club</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Join an exclusive community of golf enthusiasts supporting my PGA Tour journey.
              Get behind-the-scenes access, exclusive content, and be part of the story.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Status */}
      {user && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {isFanClubMember ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xl font-semibold text-green-800">Fan Club Member</span>
                  </div>
                  <p className="text-green-700">Welcome to the exclusive Fan Club! Enjoy all member benefits.</p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xl font-semibold text-yellow-800">Not a Member Yet</span>
                  </div>
                  <p className="text-yellow-700">Join the Fan Club to unlock exclusive content and benefits.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Fan Club Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fan Club Benefits</h2>
            <p className="text-lg text-gray-600">Exclusive perks for our most dedicated supporters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Behind-the-Scenes Content</h3>
              <p className="text-gray-600">
                Exclusive videos of practice sessions, course previews, and personal insights
                not available to the general public.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Communication</h3>
              <p className="text-gray-600">
                Private Discord community for direct interaction with me and other fans.
                Ask questions and share your golf experiences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exclusive Merchandise</h3>
              <p className="text-gray-600">
                Early access to limited-edition merchandise and special pricing
                on all official Joe Sanders products.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tournament Priority</h3>
              <p className="text-gray-600">
                Priority access to tournament tickets and VIP experiences at select events
                throughout the season.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Connection</h3>
              <p className="text-gray-600">
                Monthly Q&A sessions and personal shoutouts. Your support means
                the world and I want to show my appreciation.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Updates</h3>
              <p className="text-gray-600">
                Be the first to know about career milestones, sponsorship deals,
                and major announcements in my professional journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Fan Club</h2>
            <p className="text-lg text-gray-600">Support my journey and get exclusive access</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">$9.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-gray-600">Cancel anytime • No long-term commitment</p>
            </div>

            {user ? (
              isFanClubMember ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">You&apos;re already a Fan Club member!</p>
                  <p className="text-green-600 text-sm mt-1">Enjoy all the exclusive benefits.</p>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Subscribe Now
                </button>
              )
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Sign in to join the Fan Club</p>
                <button
                  onClick={() => router.push('/auth')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Journey</h2>
          <p className="text-xl mb-8 text-green-100">
            Your support helps make PGA Tour dreams a reality. Join the community today.
          </p>
          {!user && (
            <button
              onClick={() => router.push('/auth')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
