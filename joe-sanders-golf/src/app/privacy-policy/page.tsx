import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Database, Cookie, Users, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Uncle Joes Golf',
  description: 'Privacy policy and data protection information for Uncle Joes Golf website and services.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-joe-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-joe-gold mr-4" />
            <h1 className="text-4xl font-joe-heading font-bold text-joe-gold">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-joe-stone font-joe-body">
            Your privacy matters to us. Learn how we protect and handle your data.
          </p>
          <p className="text-sm text-joe-stone/60 mt-2">
            Last updated: September 11, 2025
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#information-we-collect" className="text-joe-stone hover:text-joe-gold transition-colors">• Information We Collect</a>
            <a href="#how-we-use" className="text-joe-stone hover:text-joe-gold transition-colors">• How We Use Your Information</a>
            <a href="#information-sharing" className="text-joe-stone hover:text-joe-gold transition-colors">• Information Sharing</a>
            <a href="#data-security" className="text-joe-stone hover:text-joe-gold transition-colors">• Data Security</a>
            <a href="#your-rights" className="text-joe-stone hover:text-joe-gold transition-colors">• Your Rights (GDPR)</a>
            <a href="#cookies" className="text-joe-stone hover:text-joe-gold transition-colors">• Cookies & Tracking</a>
            <a href="#third-party" className="text-joe-stone hover:text-joe-gold transition-colors">• Third-Party Services</a>
            <a href="#contact" className="text-joe-stone hover:text-joe-gold transition-colors">• Contact Us</a>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              Introduction
            </h2>
            <p className="text-joe-stone leading-relaxed mb-4">
              Uncle Joes Golf (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and ensuring
              compliance with data protection laws, including the General Data Protection Regulation (GDPR)
              for users in the European Union.
            </p>
            <p className="text-joe-stone leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website and use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section id="information-we-collect" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2" />
              Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Personal Information</h3>
                <ul className="text-joe-stone space-y-1 ml-4">
                  <li>• Name and contact information (email, phone)</li>
                  <li>• Mailing address for merchandise delivery</li>
                  <li>• Payment information (processed securely by Stripe)</li>
                  <li>• Account credentials and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Automatically Collected Information</h3>
                <ul className="text-joe-stone space-y-1 ml-4">
                  <li>• IP address and location data</li>
                  <li>• Browser type and version</li>
                  <li>• Device information and screen resolution</li>
                  <li>• Pages visited and time spent on site</li>
                  <li>• Referral sources and click patterns</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Communication Data</h3>
                <ul className="text-joe-stone space-y-1 ml-4">
                  <li>• Messages sent through contact forms</li>
                  <li>• Newsletter subscription preferences</li>
                  <li>• Customer service interactions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              Contact Us
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="bg-joe-black/50 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-joe-stone">
                  <strong className="text-joe-gold">Email:</strong> privacy@unclejoesgolf.com
                </p>
                <p className="text-joe-stone">
                  <strong className="text-joe-gold">Address:</strong> [Your Business Address]
                </p>
                <p className="text-joe-stone">
                  <strong className="text-joe-gold">Data Protection Officer:</strong> [Contact Name]
                </p>
              </div>
            </div>

            <p className="text-joe-stone/60 text-sm mt-4">
              We will respond to your inquiry within 30 days of receipt.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/terms-of-service" className="text-joe-stone hover:text-joe-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-joe-stone hover:text-joe-gold transition-colors">
              Contact Us
            </Link>
            <Link href="/" className="text-joe-stone hover:text-joe-gold transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
