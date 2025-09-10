import Link from "next/link";
import { Trophy, Mail, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl">Joe Sanders</span>
            </div>
            <p className="text-gray-300 text-sm">
              Professional golfer dedicated to excellence on and off the course.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/journey" className="text-gray-300 hover:text-green-400 transition-colors">
                  Tournament Journey
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-green-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/fan-club" className="text-gray-300 hover:text-green-400 transition-colors">
                  Fan Club
                </Link>
              </li>
            </ul>
          </div>

          {/* Sponsorship */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Partnership</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sponsorship" className="text-gray-300 hover:text-green-400 transition-colors">
                  Sponsorship Tiers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Media Kit
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact Agent
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="mailto:contact@joesanders.golf" className="text-gray-300 hover:text-green-400 transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              contact@joesanders.golf
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Joe Sanders Golf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}