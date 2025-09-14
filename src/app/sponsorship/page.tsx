import { Check, Star, Trophy, Users, Target } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { SponsorshipTier } from "@/types";

const sponsorshipTiers: SponsorshipTier[] = [
  {
    id: "bronze",
    name: "Bronze Partner",
    price: 5000,
    description: "Perfect for local businesses looking to support professional golf",
    benefits: [
      "Logo on golf bag during tournaments",
      "Social media mentions (2x per month)",
      "Thank you post after each tournament",
      "Quarterly progress reports",
      "1 signed golf ball"
    ]
  },
  {
    id: "silver",
    name: "Silver Partner", 
    price: 15000,
    description: "Enhanced visibility and engagement for growing businesses",
    benefits: [
      "Everything in Bronze",
      "Logo on golf shirts during practice rounds",
      "Monthly video message from Joe",
      "Social media mentions (4x per month)",
      "Invitation to 1 tournament meet & greet",
      "Autographed photo and golf glove",
      "Logo on website partner page"
    ]
  },
  {
    id: "gold",
    name: "Gold Partner",
    price: 35000,
    description: "Premium partnership with maximum exposure and exclusive benefits",
    featured: true,
    benefits: [
      "Everything in Silver",
      "Logo on tournament golf shirts",
      "Weekly social media mentions",
      "Bi-weekly video calls with Joe",
      "VIP access to 3 tournaments",
      "Branded merchandise package",
      "Featured partner spotlight",
      "Custom content creation",
      "Direct contact with management team"
    ]
  },
  {
    id: "platinum",
    name: "Platinum Partner",
    price: 75000,
    description: "Ultimate partnership for major brands seeking comprehensive golf marketing",
    benefits: [
      "Everything in Gold",
      "Primary logo placement on all tournament attire",
      "Co-branded social media campaigns",
      "Monthly in-person meetings (when possible)",
      "VIP hospitality at all tournaments",
      "Custom video content (monthly)",
      "Press release co-announcements",
      "Exclusive fan club content",
      "Joint charity event participation",
      "Annual golf lesson with Joe"
    ]
  }
];

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Partnership Opportunities
            </h1>
            <p className="text-lg lg:text-xl text-green-100 max-w-3xl mx-auto">
              Join me on my professional golf journey and grow your brand alongside my career. 
              Choose from flexible partnership tiers designed to deliver real value for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Partner With Joe Sanders?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Professional golf offers unique marketing opportunities with engaged, affluent audiences. 
              Partner with a rising talent committed to excellence and community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Targeted Reach
              </h3>
              <p className="text-gray-600">
                Connect with affluent golf enthusiasts and sports fans through 
                tournament broadcasts and social media presence.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Rising Talent
              </h3>
              <p className="text-gray-600">
                Partner with a professional golfer on the rise, with multiple 
                tour wins and growing fan engagement.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Authentic Engagement
              </h3>
              <p className="text-gray-600">
                Build genuine connections with fans through authentic storytelling 
                and meaningful content collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Partnership Tiers
            </h2>
            <p className="text-lg text-gray-600">
              Choose the partnership level that best fits your marketing goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  tier.featured 
                    ? "border-2 border-green-500 transform scale-105" 
                    : "border border-gray-200"
                }`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-semibold">Most Popular</span>
                    </div>
                  </div>
                )}

                <div className={`p-6 ${tier.featured ? "pt-16" : ""}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tier.name}
                    </h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {formatCurrency(tier.price)}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">per year</div>
                    <p className="text-gray-600 text-sm">
                      {tier.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      tier.featured
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Contact for Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Partnership */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Custom Partnership Solutions
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Looking for something different? Let&apos;s discuss a custom partnership 
            that aligns with your specific marketing objectives and budget requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:partnerships@joesanders.golf"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Contact Partnership Team
            </Link>
            <Link
              href="/journey"
              className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              View Tournament Results
            </Link>
          </div>
        </div>
      </section>

      {/* Media Kit CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Download Media Kit
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-green-100">
            Get detailed statistics, demographics, and partnership case studies 
            to help make your decision.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Download Media Kit (PDF)
          </button>
        </div>
      </section>
    </div>
  );
}