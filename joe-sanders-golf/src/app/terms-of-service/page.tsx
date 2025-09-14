import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - Uncle Joes Golf',
  description: 'Terms of service for Uncle Joes Golf website and services.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-joe-black text-joe-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-joe-gold hover:text-joe-gold/80 transition-colors mb-8"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-joe-gold mb-4">Terms of Service</h1>
          <p className="text-joe-white/60">Last updated: September 12, 2025</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">1. Acceptance of Terms</h2>
            <p className="text-joe-white/80 mb-4">
              By accessing and using Uncle Joes Golf (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">2. Description of Service</h2>
            <p className="text-joe-white/80 mb-4">
              Uncle Joes Golf provides information about professional golfer Uncle Joe Sanders, including tournament coverage, merchandise sales, fan club membership, sponsorship information, and related golf content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-joe-white mb-3">3.1 Account Creation</h3>
            <p className="text-joe-white/80 mb-4">
              To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h3 className="text-xl font-semibold text-joe-white mb-3">3.2 Account Responsibilities</h3>
            <p className="text-joe-white/80 mb-4">
              You are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">4. Acceptable Use Policy</h2>
            <p className="text-joe-white/80 mb-4">You agree not to use the service to:</p>
            <ul className="list-disc list-inside text-joe-white/80 mb-4 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Harass, abuse, or harm others</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with the proper functioning of the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">5. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-joe-white mb-3">5.1 Our Content</h3>
            <p className="text-joe-white/80 mb-4">
              All content on Uncle Joes Golf, including text, graphics, logos, images, and software, is owned by us or our licensors and is protected by copyright and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-joe-white mb-3">5.2 User Content</h3>
            <p className="text-joe-white/80 mb-4">
              By posting content on our platform, you grant us a non-exclusive, royalty-free license to use, modify, and distribute your content in connection with our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">6. Purchases and Payments</h2>

            <h3 className="text-xl font-semibold text-joe-white mb-3">6.1 Merchandise</h3>
            <p className="text-joe-white/80 mb-4">
              All merchandise purchases are subject to availability. Prices are subject to change without notice. We reserve the right to cancel orders for any reason.
            </p>

            <h3 className="text-xl font-semibold text-joe-white mb-3">6.2 Payment Processing</h3>
            <p className="text-joe-white/80 mb-4">
              Payments are processed through secure third-party providers. We do not store your payment information on our servers.
            </p>

            <h3 className="text-xl font-semibold text-joe-white mb-3">6.3 Refunds</h3>
            <p className="text-joe-white/80 mb-4">
              Refund requests will be considered on a case-by-case basis. Please contact us for refund inquiries.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">7. Privacy Policy</h2>
            <p className="text-joe-white/80 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">8. Disclaimers</h2>

            <h3 className="text-xl font-semibold text-joe-white mb-3">8.1 Service Availability</h3>
            <p className="text-joe-white/80 mb-4">
              We strive to provide continuous service but do not guarantee that the service will be uninterrupted or error-free.
            </p>

            <h3 className="text-xl font-semibold text-joe-white mb-3">8.2 Content Accuracy</h3>
            <p className="text-joe-white/80 mb-4">
              While we make efforts to provide accurate information, we do not warrant the accuracy, completeness, or reliability of any content on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">9. Limitation of Liability</h2>
            <p className="text-joe-white/80 mb-4">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">10. Indemnification</h2>
            <p className="text-joe-white/80 mb-4">
              You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">11. Termination</h2>
            <p className="text-joe-white/80 mb-4">
              We reserve the right to terminate or suspend your account and access to the service at our discretion, with or without cause, and with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">12. Governing Law</h2>
            <p className="text-joe-white/80 mb-4">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Uncle Joes Golf operates, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">13. Changes to Terms</h2>
            <p className="text-joe-white/80 mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-joe-gold mb-4">14. Contact Information</h2>
            <p className="text-joe-white/80 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-joe-white/5 p-4 rounded-lg">
              <p className="text-joe-white/80">Email: legal@unclejoesgolf.com</p>
              <p className="text-joe-white/80">Address: Uncle Joes Golf, Professional Golf Services</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}