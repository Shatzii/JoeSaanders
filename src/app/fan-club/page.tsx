import { Star, Trophy, Gift, Mail, Video, Calendar } from "lucide-react";
import Link from "next/link";

const membershipBenefits = [
  {
    icon: Video,
    title: "Exclusive Video Content",
    description: "Behind-the-scenes footage, practice sessions, and tournament prep videos"
  },
  {
    icon: Mail,
    title: "Monthly Newsletter",
    description: "Personal updates, tournament insights, and upcoming schedule information"
  },
  {
    icon: Gift,
    title: "15% Merchandise Discount",
    description: "Exclusive discount on all official Joe Sanders golf merchandise"
  },
  {
    icon: Calendar,
    title: "Meet & Greet Access",
    description: "Priority access to fan events and tournament meet & greet sessions"
  },
  {
    icon: Trophy,
    title: "Tournament Updates",
    description: "Real-time updates and live commentary during tournament rounds"
  },
  {
    icon: Star,
    title: "Limited Edition Items",
    description: "Access to fan club only merchandise and signed memorabilia"
  }
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "Atlanta, GA",
    quote: "Being part of Joe's fan club has made following professional golf so much more exciting. The exclusive content is amazing!",
    memberSince: "2022"
  },
  {
    name: "Mike Johnson",
    location: "Phoenix, AZ", 
    quote: "The meet & greet access is incredible. Got to meet Joe after his tournament win and he's such a genuine person.",
    memberSince: "2023"
  },
  {
    name: "Emma Rodriguez",
    location: "Miami, FL",
    quote: "The monthly newsletters give such great insight into Joe's journey. It's like getting personal updates from a friend.",
    memberSince: "2021"
  }
];

export default function FanClubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Join the Fan Club
            </h1>
            <p className="text-lg lg:text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Become part of an exclusive community of golf enthusiasts and get unprecedented 
              access to my professional golf journey. Connect with fellow fans and enjoy 
              premium benefits year-round.
            </p>
            <div className="flex items-center justify-center gap-6 text-green-100">
              <div className="text-center">
                <div className="text-3xl font-bold">5,200+</div>
                <div className="text-sm">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm">Years Running</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Community Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Exclusive Member Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fan club membership gives you insider access to my professional golf career, 
              with benefits designed to bring you closer to the action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Choose Your Membership
            </h2>
            <p className="text-lg text-gray-600">
              Select the membership plan that works best for you. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Monthly Membership
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  $9.99
                </div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">All member benefits included</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Cancel anytime</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Immediate access</span>
                </li>
              </ul>

              <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Start Monthly Plan
              </button>
            </div>

            {/* Annual Plan */}
            <div className="bg-green-50 rounded-lg p-8 border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Annual Membership
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  $99.99
                </div>
                <div className="text-gray-500">per year</div>
                <div className="text-sm text-green-600 font-semibold mt-1">
                  Save $20 annually
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">All member benefits included</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Exclusive annual merchandise</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Priority customer support</span>
                </li>
              </ul>

              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Start Annual Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Members Are Saying
            </h2>
            <p className="text-lg text-gray-600">
              Hear from fellow golf fans about their fan club experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                  <div className="text-sm text-green-600">Member since {testimonial.memberSince}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                How often do you post exclusive content?
              </h3>
              <p className="text-gray-600">
                I post new exclusive content at least 2-3 times per week, with additional 
                content during tournament weeks including practice round videos and live updates.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my membership anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your membership at any time. For monthly plans, you&apos;ll have 
                access until the end of your current billing period. Annual plans are eligible 
                for prorated refunds within the first 30 days.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer family or group discounts?
              </h3>
              <p className="text-gray-600">
                Family plans (up to 4 members) are available for $149.99 annually. Contact us 
                for group discounts for golf clubs or organizations with 10+ members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-green-100">
            Start your membership today and become part of an exclusive community 
            of golf enthusiasts following my professional journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Join Fan Club Now
            </button>
            <Link
              href="/shop"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              View Member Benefits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}