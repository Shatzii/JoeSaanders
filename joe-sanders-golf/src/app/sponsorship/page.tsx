'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, TrendingUp, Heart, BarChart3 } from 'lucide-react'

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
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="hero-container text-joe-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-tagline mb-4">Partner With Success</h1>
            <p className="text-xl text-joe-stone max-w-3xl mx-auto font-joe-body">
              Join a growing professional golfer on the path to the PGA Tour.
              Your brand deserves to be associated with dedication, perseverance, and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Sponsorship Packages</h2>
            <p className="text-lg text-joe-white font-joe-body">Choose the partnership level that fits your brand</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div key={tier.name} className={`merch-card ${index === 2 ? 'ring-2 ring-joe-gold' : ''}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-joe-heading font-bold text-joe-gold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-joe-heading font-bold text-joe-gold mb-4">{tier.price}</div>
                  {index === 2 && (
                    <span className="inline-block bg-joe-gold/20 text-joe-gold text-sm px-3 py-1 rounded-full font-joe-accent font-medium">
                      Most Popular
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-joe-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-joe-white text-sm font-joe-body">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, tier: tier.name.toLowerCase() }))}
                  className="merch-button w-full py-2 px-4 rounded-lg font-joe-accent font-bold text-lg"
                >
                  <span>Select {tier.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Why Partner With Joe?</h2>
            <p className="text-lg text-joe-stone font-joe-body">Your investment goes beyond golf - it&apos;s about values and growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Growing Platform</h3>
              <p className="text-joe-stone font-joe-body">
                Rapidly expanding social media presence and fanbase with authentic,
                engaging content that resonates with golf enthusiasts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Authentic Partnership</h3>
              <p className="text-joe-stone font-joe-body">
                Genuine connection with fans and followers. Your brand will be
                associated with hard work, dedication, and the pursuit of excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-joe-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-joe-gold" />
              </div>
              <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-2">Measurable Results</h3>
              <p className="text-joe-stone font-joe-body">
                Detailed analytics and reporting on brand exposure, engagement metrics,
                and return on investment for your sponsorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-joe-black rounded-lg shadow-md p-8 border border-joe-gold/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Start a Conversation</h2>
              <p className="text-lg text-joe-stone font-joe-body">
                Ready to explore partnership opportunities? Let&apos;s discuss how we can work together.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-joe-black border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-body"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-joe-black border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-joe-black border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-body"
                  />
                </div>
                <div>
                  <label htmlFor="tier" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                    Interested Tier
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    value={formData.tier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-joe-black border border-joe-gold/30 rounded-md text-joe-white focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-body"
                  >
                    <option value="bronze">Bronze - $500/month</option>
                    <option value="silver">Silver - $1,000/month</option>
                    <option value="gold">Gold - $2,500/month</option>
                    <option value="platinum">Platinum - $5,000/month</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your company and partnership goals..."
                  className="w-full px-3 py-2 bg-joe-black border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-body"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="merch-button px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>

              {submitMessage && (
                <div className={`text-center p-4 rounded-md ${submitMessage.includes('Thank you') ? 'bg-joe-gold/10 text-joe-gold border border-joe-gold/30' : 'bg-joe-crimson/10 text-joe-crimson border border-joe-crimson/30'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Download Sponsor Deck */}
      <section className="py-16 bg-joe-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-4">Download Sponsor Information</h2>
          <p className="text-xl mb-8 text-joe-stone font-joe-body">
            Get detailed information about sponsorship opportunities and partnership benefits.
          </p>
          <a
            href="/sponsor-deck.txt"
            download
            className="merch-button px-8 py-3 rounded-lg font-joe-accent font-bold text-lg"
          >
            <span>Download Sponsor Deck (PDF)</span>
          </a>
        </div>
      </section>
    </div>
  )
}
