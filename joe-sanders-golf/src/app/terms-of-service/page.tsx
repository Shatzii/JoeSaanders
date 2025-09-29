import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, CreditCard, Users, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - Uncle Joes Golf',
  description: 'Terms of service and usage agreement for Uncle Joes Golf website and services.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-joe-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-joe-gold mr-4" />
            <h1 className="text-4xl font-joe-heading font-bold text-joe-gold">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-joe-stone font-joe-body">
            Please read these terms carefully before using our services.
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
            <a href="#acceptance" className="text-joe-stone hover:text-joe-gold transition-colors">• Acceptance of Terms</a>
            <a href="#services" className="text-joe-stone hover:text-joe-gold transition-colors">• Services Description</a>
            <a href="#user-accounts" className="text-joe-stone hover:text-joe-gold transition-colors">• User Accounts</a>
            <a href="#payments" className="text-joe-stone hover:text-joe-gold transition-colors">• Payment Terms</a>
            <a href="#intellectual-property" className="text-joe-stone hover:text-joe-gold transition-colors">• Intellectual Property</a>
            <a href="#user-conduct" className="text-joe-stone hover:text-joe-gold transition-colors">• User Conduct</a>
            <a href="#disclaimers" className="text-joe-stone hover:text-joe-gold transition-colors">• Disclaimers</a>
            <a href="#limitation" className="text-joe-stone hover:text-joe-gold transition-colors">• Limitation of Liability</a>
            <a href="#termination" className="text-joe-stone hover:text-joe-gold transition-colors">• Termination</a>
            <a href="#governing-law" className="text-joe-stone hover:text-joe-gold transition-colors">• Governing Law</a>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Acceptance */}
          <section id="acceptance" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-joe-stone leading-relaxed mb-4">
              By accessing and using Uncle Joes Golf (&quot;the Website&quot;), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-joe-stone leading-relaxed">
              These Terms of Service apply to all visitors, users, and others who access or use the Website.
            </p>
          </section>

          {/* Services Description */}
          <section id="services" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              2. Services Description
            </h2>
            <p className="text-joe-stone leading-relaxed mb-4">
              Uncle Joes Golf provides the following services:
            </p>
            <ul className="text-joe-stone space-y-2 ml-6">
              <li>• Professional golf career information and updates</li>
              <li>• Tournament coverage and results</li>
              <li>• Official merchandise sales</li>
              <li>• Fan club membership and exclusive content</li>
              <li>• Newsletter and email communications</li>
              <li>• Contact and sponsorship inquiry forms</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section id="user-accounts" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              3. User Accounts
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Account Creation</h3>
                <p className="text-joe-stone">
                  To access certain features of our Website, you may be required to create an account.
                  You must provide accurate, complete, and current information during the registration process.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Account Security</h3>
                <p className="text-joe-stone">
                  You are responsible for safeguarding your account credentials and for all activities that occur
                  under your account. You must immediately notify us of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Account Termination</h3>
                <p className="text-joe-stone">
                  We reserve the right to terminate or suspend your account at our discretion, without prior notice,
                  for conduct that we believe violates these Terms or is harmful to other users.
                </p>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section id="payments" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              4. Payment Terms
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Merchandise Purchases</h3>
                <p className="text-joe-stone mb-2">
                  All merchandise purchases are processed securely through Stripe. By making a purchase, you agree to:
                </p>
                <ul className="text-joe-stone space-y-1 ml-6">
                  <li>• Provide accurate billing and shipping information</li>
                  <li>• Pay all charges associated with your purchase</li>
                  <li>• Accept our return and refund policies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Fan Club Subscriptions</h3>
                <p className="text-joe-stone mb-2">
                  Fan club memberships are billed on a recurring basis. Subscription terms include:
                </p>
                <ul className="text-joe-stone space-y-1 ml-6">
                  <li>• Automatic renewal unless cancelled</li>
                  <li>• 30-day cancellation notice period</li>
                  <li>• No refunds for partial subscription periods</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Payment Methods</h3>
                <p className="text-joe-stone">
                  We accept major credit cards and other payment methods as offered through our payment processor.
                  All payments are subject to the terms and conditions of our payment processor.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual-property" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              5. Intellectual Property
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Website Content</h3>
                <p className="text-joe-stone">
                  The Website and its original content, features, and functionality are and will remain the exclusive
                  property of Uncle Joes Golf and its licensors. The Website is protected by copyright, trademark,
                  and other laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">User Content</h3>
                <p className="text-joe-stone">
                  By posting content to the Website, you grant us a non-exclusive, royalty-free, perpetual,
                  and worldwide license to use, display, and distribute your content in connection with the Website.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Trademarks</h3>
                <p className="text-joe-stone">
                  &quot;Uncle Joes Golf,&quot; the Uncle Joes Golf logo, and other marks are trademarks of Uncle Joes Golf.
                  You may not use these marks without prior written permission.
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section id="user-conduct" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              6. User Conduct
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              You agree not to use the Website to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-joe-stone space-y-2">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe on intellectual property rights</li>
                <li>• Transmit harmful or malicious code</li>
                <li>• Attempt to gain unauthorized access</li>
                <li>• Interfere with the Website&apos;s operation</li>
              </ul>

              <ul className="text-joe-stone space-y-2">
                <li>• Post offensive or inappropriate content</li>
                <li>• Impersonate others or provide false information</li>
                <li>• Use the Website for commercial purposes without permission</li>
                <li>• Collect user information without consent</li>
                <li>• Engage in any form of harassment</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section id="disclaimers" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              7. Disclaimers
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Service Availability</h3>
                <p className="text-joe-stone">
                  The Website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee
                  that the Website will be uninterrupted, error-free, or free from viruses or other harmful components.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Content Accuracy</h3>
                <p className="text-joe-stone">
                  While we strive to provide accurate and up-to-date information, we make no representations or warranties
                  about the accuracy, completeness, or reliability of any content on the Website.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-joe-white mb-2">Third-Party Links</h3>
                <p className="text-joe-stone">
                  The Website may contain links to third-party websites. We are not responsible for the content,
                  privacy policies, or practices of these external sites.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              8. Limitation of Liability
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              In no event shall Uncle Joes Golf, its directors, employees, or agents be liable for any indirect,
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from:
            </p>

            <ul className="text-joe-stone space-y-2 ml-6">
              <li>• Your use of or inability to use the Website</li>
              <li>• Any unauthorized access to or use of our servers</li>
              <li>• Any interruption or cessation of transmission to or from the Website</li>
              <li>• Any bugs, viruses, or other harmful code transmitted through the Website</li>
              <li>• Any errors or omissions in any content or for any loss or damage incurred</li>
            </ul>

            <div className="mt-4 p-4 bg-joe-gold/10 border border-joe-gold/30 rounded-lg">
              <p className="text-joe-stone text-sm">
                Our total liability for any claim arising out of or relating to these Terms or the Website
                shall not exceed the amount paid by you, if any, for accessing the Website in the 12 months
                preceding the claim.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section id="termination" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              9. Termination
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Website immediately, without prior notice
              or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>

            <p className="text-joe-stone leading-relaxed">
              Upon termination, your right to use the Website will cease immediately. All provisions of these Terms
              which by their nature should survive termination shall survive, including ownership provisions,
              warranty disclaimers, and limitations of liability.
            </p>
          </section>

          {/* Governing Law */}
          <section id="governing-law" className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              10. Governing Law
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to
              its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not
              be considered a waiver of those rights.
            </p>

            <p className="text-joe-stone leading-relaxed">
              Any disputes arising from these Terms or your use of the Website shall be resolved through binding
              arbitration in [Your Jurisdiction], in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-joe-gold/10 border border-joe-gold/30 rounded-lg p-6">
            <h2 className="text-xl font-joe-heading font-semibold text-joe-gold mb-4">
              Changes to Terms
            </h2>
            <p className="text-joe-stone leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes
              by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued
              use of the Website after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-joe-black/30 border border-joe-stone/20 rounded-lg p-6">
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4">
              Contact Information
            </h2>

            <p className="text-joe-stone leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>

            <div className="bg-joe-black/50 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-joe-stone">
                  <strong className="text-joe-gold">Email:</strong> legal@unclejoesgolf.com
                </p>
                <p className="text-joe-stone">
                  <strong className="text-joe-gold">Address:</strong> [Your Business Address]
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy-policy" className="text-joe-stone hover:text-joe-gold transition-colors">
              Privacy Policy
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
