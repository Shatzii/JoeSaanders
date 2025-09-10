import Link from "next/link";
import { Trophy, Target, Award, Users } from "lucide-react";
import type { Stat } from "@/types";

const stats: Stat[] = [
  { label: "PGA Tour Wins", value: "3", description: "Professional victories" },
  { label: "Career Earnings", value: "$2.4M", description: "Prize money earned" },
  { label: "Average Score", value: "69.8", description: "18-hole average" },
  { label: "Fan Club Members", value: "5,200+", description: "Active supporters" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Joe Sanders
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-green-100">
              Professional Golfer
            </p>
            <p className="text-lg lg:text-xl mb-8 max-w-3xl mx-auto text-green-50">
              Pursuing excellence on the course with dedication, precision, and passion. 
              Follow my journey as I compete on the professional golf circuit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/journey"
                className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Follow My Journey
              </Link>
              <Link
                href="/fan-club"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
              >
                Join Fan Club
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Career Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A snapshot of my professional golf career achievements and milestones.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                My Golf Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  My journey in professional golf began over a decade ago when I first picked up 
                  a club at age 8. What started as weekend rounds with my father evolved into 
                  a burning passion that would define my life&apos;s purpose.
                </p>
                <p>
                  Through countless hours of practice, unwavering dedication, and the support 
                  of incredible mentors, I&apos;ve had the privilege of competing at the highest 
                  levels of professional golf. Each tournament teaches me something new about 
                  the game, about myself, and about what it means to never give up.
                </p>
                <p>
                  Today, I&apos;m not just competing for wins and earnings – I&apos;m playing to inspire 
                  the next generation of golfers and to show that with persistence and heart, 
                  dreams can become reality.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/journey"
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  View Tournament History
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-green-100 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Precision</h3>
                    <p className="text-sm text-gray-600">Every shot counts, every detail matters</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                    <p className="text-sm text-gray-600">Striving for perfection in every round</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                    <p className="text-sm text-gray-600">Building connections through the game</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Victory</h3>
                    <p className="text-sm text-gray-600">Celebrating wins, learning from losses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the Journey
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-green-100">
            Become part of the Joe Sanders golf family. Get exclusive access to tournament updates, 
            behind-the-scenes content, and special merchandise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fan-club"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Join Fan Club
            </Link>
            <Link
              href="/shop"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Shop Merchandise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
