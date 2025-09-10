'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Thank you for your message! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Hero Section */}
      <section className="hero-container text-joe-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-tagline mb-4">Get In Touch</h1>
            <p className="text-xl text-joe-stone max-w-3xl mx-auto font-joe-body">
              Have questions about my journey, sponsorship opportunities, or just want to connect?
              I&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-joe-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-8">Let&apos;s Connect</h2>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-joe-gold/20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-joe-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-joe-heading font-semibold text-joe-gold">Email</h3>
                    <p className="text-joe-white font-joe-body">contact@unclejoesanders.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-joe-gold/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-joe-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-joe-heading font-semibold text-joe-gold">Phone</h3>
                    <p className="text-joe-white font-joe-body">Available for sponsorship inquiries</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-joe-gold/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-joe-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-joe-heading font-semibold text-joe-gold">Location</h3>
                    <p className="text-joe-white font-joe-body">Based in the Carolinas</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-4">Follow My Journey</h3>
                <p className="text-joe-white font-joe-body mb-6">
                  Stay updated with my latest tournament results, training updates, and behind-the-scenes content.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-joe-gold/20 rounded-full flex items-center justify-center hover:bg-joe-gold/30 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5 text-joe-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-joe-gold/20 rounded-full flex items-center justify-center hover:bg-joe-gold/30 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5 text-joe-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-joe-gold/20 rounded-full flex items-center justify-center hover:bg-joe-gold/30 transition-colors">
                    <span className="sr-only">YouTube</span>
                    <svg className="w-5 h-5 text-joe-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-joe-heading font-semibold text-joe-gold mb-8">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-joe-black/50 border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-joe-black/50 border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-joe-black/50 border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-accent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-joe-accent font-medium text-joe-gold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-joe-black/50 border border-joe-gold/30 rounded-md text-joe-white placeholder-joe-stone/60 focus:outline-none focus:ring-2 focus:ring-joe-gold focus:border-transparent font-joe-accent resize-none"
                    placeholder="Tell me about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="merch-button w-full px-6 py-4 rounded-lg font-joe-accent font-bold text-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-md ${message.includes('Thank you') ? 'bg-green-900/20 border border-green-500/30 text-green-300' : 'bg-red-900/20 border border-red-500/30 text-red-300'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
