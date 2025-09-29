import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Database, Cookie, Users, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Uncle Joes Golf',
  description: 'Privacy policy and data protection information for Uncle Joes Golf website and services.',
}
}

export default function PrivacyPolicy() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-joe-black text-joe-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-joe-gold hover:text-joe-gold/80 transition-colors mb-8"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-joe-gold mb-4">Privacy Policy</h1>
          <p className="text-joe-white/60">Last updated: September 12, 2025</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">1. Introduction</h2>
            <p className="text-joe-white/80 mb-4">
              Welcome to Uncle Joes Golf (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-joe-white mb-3">2.1 Personal Information</h3>
            <p className="text-joe-white/80 mb-4">
              We may collect personal information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Billing and payment information</li>
              <li>Account credentials</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-joe-white mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-joe-white/80 mb-4">
              When you visit our website, we automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li>IP address and location information</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referral sources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">3. How We Use Your Information</h2>
            <p className="text-joe-white/80 mb-4">We use the information we collect for various purposes, including:</p>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and managing orders</li>
              <li>Communicating with you about our services</li>
              <li>Sending newsletters and marketing communications (with consent)</li>
              <li>Improving our website and services</li>
              <li>Ensuring security and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-joe-white/80 mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie preferences through our cookie consent banner.
            </p>

            <h3 className="text-xl font-semibold text-joe-white mb-3">Types of Cookies We Use:</h3>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-joe-white/80 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
            </p>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li>Service providers who assist in operating our website</li>
              <li>Payment processors for transaction processing</li>
              <li>Legal requirements and law enforcement</li>
              <li>Business transfers in case of merger or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">6. Data Security</h2>
            <p className="text-joe-white/80 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">7. Your Rights</h2>
            <p className="text-joe-white/80 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="text-joe-white/80 mb-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">8. Data Retention</h2>
            <p className="text-joe-white/80 mb-4">
              We retain your personal information only as long as necessary for the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">9. International Data Transfers</h2>
            <p className="text-joe-white/80 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-joe-white/80 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">11. Contact Us</h2>
            <p className="text-joe-white/80 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-joe-white/5 p-4 rounded-lg">
              <p className="text-joe-white/80">Email: privacy@unclejoesgolf.com</p>
              <p className="text-joe-white/80">Address: Uncle Joes Golf, Professional Golf Services</p>
            </div>
          </section>
=======
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

          {/* How We Use */}
          <section id="how-we-use" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              How We Use Your Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-3">Service Delivery</h3>
                <ul className="text-joe-stone space-y-2">
                  <li>• Process orders and payments</li>
                  <li>• Deliver merchandise and services</li>
                  <li>• Provide customer support</li>
                  <li>• Send transactional emails</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-3">Website Improvement</h3>
                <ul className="text-joe-stone space-y-2">
                  <li>• Analyze website usage patterns</li>
                  <li>• Improve user experience</li>
                  <li>• Optimize content and features</li>
                  <li>• Monitor performance metrics</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-3">Marketing & Communication</h3>
                <ul className="text-joe-stone space-y-2">
                  <li>• Send newsletters and updates</li>
                  <li>• Provide personalized content</li>
                  <li>• Share tournament information</li>
                  <li>• Promote special offers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-3">Legal Compliance</h3>
                <ul className="text-joe-stone space-y-2">
                  <li>• Comply with legal obligations</li>
                  <li>• Prevent fraud and abuse</li>
                  <li>• Protect our rights and property</li>
                  <li>• Maintain accurate records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section id="information-sharing" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Information Sharing & Disclosure
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
              except in the following circumstances:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-joe-gold pl-4">
                <h3 className="text-lg font-semibold text-joe-white mb-2">Service Providers</h3>
                <p className="text-joe-stone">
                  We may share information with trusted third-party service providers who assist us in operating our website,
                  conducting our business, or servicing you. These providers are contractually obligated to maintain confidentiality.
                </p>
              </div>

              <div className="border-l-4 border-joe-gold pl-4">
                <h3 className="text-lg font-semibold text-joe-white mb-2">Legal Requirements</h3>
                <p className="text-joe-stone">
                  We may disclose information if required by law, court order, or government regulation, or to protect
                  our rights, property, or safety, or that of our users or the public.
                </p>
              </div>

              <div className="border-l-4 border-joe-gold pl-4">
                <h3 className="text-lg font-semibold text-joe-white mb-2">Business Transfers</h3>
                <p className="text-joe-stone">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part
                  of the transaction, subject to the same privacy protections.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Data Security
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-joe-black/50 p-4 rounded-lg">
                <h3 className="font-semibold text-joe-gold mb-2">Technical Measures</h3>
                <ul className="text-joe-stone text-sm space-y-1">
                  <li>• SSL/TLS encryption for data transmission</li>
                  <li>• Secure payment processing (Stripe)</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Firewall and intrusion detection</li>
                </ul>
              </div>

              <div className="bg-joe-black/50 p-4 rounded-lg">
                <h3 className="font-semibold text-joe-gold mb-2">Organizational Measures</h3>
                <ul className="text-joe-stone text-sm space-y-1">
                  <li>• Employee training on data protection</li>
                  <li>• Access controls and authentication</li>
                  <li>• Regular backup and disaster recovery</li>
                  <li>• Incident response procedures</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights (GDPR) */}
          <section id="your-rights" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              Your Rights (GDPR)
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              If you are located in the European Union, you have the following rights under GDPR:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-joe-white">Access</h3>
                  <p className="text-joe-stone text-sm">Request a copy of your personal data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-joe-white">Rectification</h3>
                  <p className="text-joe-stone text-sm">Correct inaccurate or incomplete data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-joe-white">Erasure</h3>
                  <p className="text-joe-stone text-sm">Request deletion of your data</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-joe-white">Portability</h3>
                  <p className="text-joe-stone text-sm">Receive your data in a structured format</p>
                </div>
                <div>
                  <h3 className="font-semibold text-joe-white">Restriction</h3>
                  <p className="text-joe-stone text-sm">Limit processing of your data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-joe-white">Objection</h3>
                  <p className="text-joe-stone text-sm">Object to processing based on legitimate interests</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-joe-gold/10 border border-joe-gold/30 rounded-lg">
              <p className="text-joe-stone text-sm">
                To exercise any of these rights, please contact us using the information provided below.
                We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Cookie className="h-6 w-6 mr-2" />
              Cookies & Tracking Technologies
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Necessary Cookies</h3>
                <p className="text-joe-stone">
                  Required for basic website functionality. These cannot be disabled as they are essential
                  for the website to work properly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Analytics Cookies</h3>
                <p className="text-joe-stone">
                  Help us understand how visitors interact with our website by collecting information anonymously.
                  Used to improve our website and user experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Marketing Cookies</h3>
                <p className="text-joe-stone">
                  Used to track visitors across websites to display relevant advertisements and content.
                  Help us measure the effectiveness of our marketing campaigns.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Functional Cookies</h3>
                <p className="text-joe-stone">
                  Enable enhanced functionality and personalization, such as remembering your preferences
                  and settings.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/contact"
                className="text-joe-gold hover:text-joe-gold/80 underline"
              >
                Manage Your Cookie Preferences
              </Link>
            </div>
          </section>

          {/* Third-Party Services */}
          <section id="third-party" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              Third-Party Services
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              Our website integrates with the following third-party services:
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-joe-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-joe-white">Stripe</h3>
                  <p className="text-joe-stone text-sm">Payment processing and secure transactions</p>
                  <p className="text-joe-stone/60 text-xs mt-1">
                    Privacy Policy: <a href="https://stripe.com/privacy" className="text-joe-gold hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-joe-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-joe-white">Resend</h3>
                  <p className="text-joe-stone text-sm">Email delivery and newsletter services</p>
                  <p className="text-joe-stone/60 text-xs mt-1">
                    Privacy Policy: <a href="https://resend.com/privacy" className="text-joe-gold hover:underline" target="_blank" rel="noopener noreferrer">resend.com/privacy</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-joe-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-joe-white">Supabase</h3>
                  <p className="text-joe-stone text-sm">Database and backend services</p>
                  <p className="text-joe-stone/60 text-xs mt-1">
                    Privacy Policy: <a href="https://supabase.com/privacy" className="text-joe-gold hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-joe-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-joe-white">Google Analytics</h3>
                  <p className="text-joe-stone text-sm">Website analytics and performance monitoring</p>
                  <p className="text-joe-stone/60 text-xs mt-1">
                    Privacy Policy: <a href="https://policies.google.com/privacy" className="text-joe-gold hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              Data Retention
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill
              the purposes outlined in this Privacy Policy:
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-joe-stone/20">
                <span className="text-joe-stone">Account information</span>
                <span className="text-joe-gold font-semibold">While account is active + 3 years</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-joe-stone/20">
                <span className="text-joe-stone">Transaction records</span>
                <span className="text-joe-gold font-semibold">7 years (legal requirement)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-joe-stone/20">
                <span className="text-joe-stone">Marketing communications</span>
                <span className="text-joe-gold font-semibold">Until unsubscribed + 2 years</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-joe-stone">Analytics data</span>
                <span className="text-joe-gold font-semibold">26 months (Google Analytics)</span>
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

          {/* Updates */}
          <section className="bg-joe-gold/10 border border-joe-gold/30 rounded-lg p-6">
            <h2 className="text-xl font-joe-heading font-semibold text-joe-gold mb-4">
              Privacy Policy Updates
            </h2>
            <p className="text-joe-stone leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
              We will notify you of any material changes by posting the updated policy on this page and updating the
              &quot;Last updated&quot; date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
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
>>>>>>> origin/copilot/vscode1757631355561
        </div>
      </div>
    </div>
  )
}