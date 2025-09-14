import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - Uncle Joes Golf',
  description: 'Privacy policy for Uncle Joes Golf website and services.',
}

export default function PrivacyPolicy() {
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
        </div>
      </div>
    </div>
  )
}