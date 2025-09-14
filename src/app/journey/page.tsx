import { Calendar, MapPin, DollarSign, Trophy } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Tournament } from "@/types";

// Sample tournament data - in a real app, this would come from Supabase
const tournaments: Tournament[] = [
  {
    id: "1",
    name: "Masters Tournament",
    date: new Date("2024-04-14"),
    location: "Augusta National Golf Club, GA",
    result: "T15",
    purse: 18000000,
    earnings: 180000,
    description: "A strong performance at Augusta with consistent play throughout all four rounds.",
    highlights: ["Eagle on hole 15", "Three birdies in final round", "Top 20 finish"]
  },
  {
    id: "2", 
    name: "PGA Championship",
    date: new Date("2024-05-19"),
    location: "Valhalla Golf Club, KY",
    result: "T8",
    purse: 17500000,
    earnings: 425000,
    description: "Excellent putting performance led to a top-10 finish at Valhalla.",
    highlights: ["First round 67", "25 putts in round 3", "Career-best PGA finish"]
  },
  {
    id: "3",
    name: "US Open",
    date: new Date("2024-06-16"),
    location: "Pinehurst No. 2, NC",
    result: "T22",
    purse: 21500000,
    earnings: 125000,
    description: "Challenging conditions at Pinehurst tested every aspect of the game.",
    highlights: ["Solid weekend rounds", "Great recovery shots", "Gained valuable experience"]
  },
  {
    id: "4",
    name: "The Open Championship",
    date: new Date("2024-07-21"),
    location: "Royal Troon Golf Club, Scotland",
    result: "MC",
    purse: 16500000,
    description: "Tough links conditions and challenging weather made for a difficult week.",
    highlights: ["First major championship in Scotland", "Learned from challenging conditions"]
  },
  {
    id: "5",
    name: "FedEx St. Jude Championship",
    date: new Date("2024-08-18"),
    location: "TPC Southwind, TN",
    result: "T5",
    purse: 20000000,
    earnings: 680000,
    description: "Best finish of the season with stellar play in the playoffs opener.",
    highlights: ["Career-low 63 in round 2", "Final round 66", "Moved up 15 spots in FedEx Cup"]
  }
];

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Tournament Journey
            </h1>
            <p className="text-lg lg:text-xl text-green-100 max-w-3xl mx-auto">
              Follow my professional golf journey through major championships and PGA Tour events. 
              Each tournament brings new challenges and opportunities for growth.
            </p>
          </div>
        </div>
      </section>

      {/* Season Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              2024 Season Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {tournaments.length}
                </div>
                <div className="text-sm text-gray-600">Tournaments Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {tournaments.filter(t => t.result && !t.result.includes('MC')).length}
                </div>
                <div className="text-sm text-gray-600">Cuts Made</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {tournaments.filter(t => t.result && (t.result.includes('T5') || t.result.includes('T8'))).length}
                </div>
                <div className="text-sm text-gray-600">Top 10 Finishes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(tournaments.reduce((sum, t) => sum + (t.earnings || 0), 0))}
                </div>
                <div className="text-sm text-gray-600">Season Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament List */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recent Tournaments
          </h2>
          <div className="space-y-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {tournament.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(tournament.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{tournament.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Purse: {formatCurrency(tournament.purse)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:text-right">
                      <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                        <Trophy className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{tournament.result}</span>
                      </div>
                      {tournament.earnings && (
                        <div className="mt-2 text-lg font-bold text-gray-900">
                          {formatCurrency(tournament.earnings)}
                        </div>
                      )}
                    </div>
                  </div>

                  {tournament.description && (
                    <p className="text-gray-600 mb-4">{tournament.description}</p>
                  )}

                  {tournament.highlights && tournament.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Highlights:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {tournament.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-green-100">
            Get real-time updates on tournament results, behind-the-scenes content, 
            and exclusive insights from the course.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fan-club"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Join Fan Club
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}