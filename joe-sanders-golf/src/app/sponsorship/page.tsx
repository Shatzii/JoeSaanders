'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SponsorshipPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    tier: 'bronze',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitMessage('Thank you for your interest! I\'ll get back to you soon.')
        setFormData({
          name: '',
          email: '',
          company: '',
          tier: 'bronze',
          message: ''
        })
      } else {
        setSubmitMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sponsorshipTiers = [
    {
      name: 'Bronze',
      price: '$500/month',
      features: [
        'Logo on website',
        'Social media mention',
        'Tournament updates',
        'Email newsletter feature'
      ]
    },
    {
      name: 'Silver',
      price: '$1,000/month',
      features: [
        'All Bronze benefits',
        'Logo on golf bag',
        'Priority social media content',
        'Monthly performance report',
        'Virtual meet & greet'
      ]
    },
    {
      name: 'Gold',
      price: '$2,500/month',
      features: [
        'All Silver benefits',
        'Featured sponsor status',
        'Custom content creation',
        'Tournament hospitality',
        'Exclusive merchandise',
        'Annual review meeting'
      ]
    },
    {
      name: 'Platinum',
      price: '$5,000/month',
      features: [
        'All Gold benefits',
        'Naming rights opportunity',
        'VIP tournament access',
        'Personal branding consultation',
        'Quarterly business reviews',
        'Exclusive partnership announcements'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner With Success</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Join a growing professional golfer on the path to the PGA Tour.
              Your brand deserves to be associated with dedication, perseverance, and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sponsorship Packages</h2>
            <p className="text-lg text-gray-600">Choose the partnership level that fits your brand</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div key={tier.name} className={`bg-white rounded-lg shadow-md p-6 ${index === 2 ? 'ring-2 ring-green-500' : ''}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-green-600 mb-4">{tier.price}</div>
                  {index === 2 && (
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, tier: tier.name.toLowerCase() }))}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With Joe?</h2>
            <p className="text-lg text-gray-600">Your investment goes beyond golf - it&apos;s about values and growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growing Platform</h3>
              <p className="text-gray-600">
                Rapidly expanding social media presence and fanbase with authentic,
                engaging content that resonates with golf enthusiasts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Partnership</h3>
              <p className="text-gray-600">
                Genuine connection with fans and followers. Your brand will be
                associated with hard work, dedication, and the pursuit of excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Measurable Results</h3>
              <p className="text-gray-600">
                Detailed analytics and reporting on brand exposure, engagement metrics,
                and return on investment for your sponsorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start a Conversation</h2>
              <p className="text-lg text-gray-600">
                Ready to explore partnership opportunities? Let&apos;s discuss how we can work together.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Tier
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    value={formData.tier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="bronze">Bronze - $500/month</option>
                    <option value="silver">Silver - $1,000/month</option>
                    <option value="gold">Gold - $2,500/month</option>
                    <option value="platinum">Platinum - $5,000/month</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your company and partnership goals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {submitMessage && (
                <div className={`text-center p-4 rounded-md ${submitMessage.includes('Thank you') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Download Sponsor Deck */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Download Sponsor Information</h2>
          <p className="text-xl mb-8 text-green-100">
            Get detailed information about sponsorship opportunities and partnership benefits.
          </p>
          <a
            href="/sponsor-deck.txt"
            download
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
          >
            Download Sponsor Deck (PDF)
          </a>
        </div>
      </section>
    </div>
  )
}
