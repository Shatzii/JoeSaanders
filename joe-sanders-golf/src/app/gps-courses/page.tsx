'use client';
import Link from 'next/link';

export default function GPSPage() {
  // Temporarily disabled for production build
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">GPS Course Mapper</h1>
        <p className="text-xl mb-8">🚧 Temporarily disabled for production deployment</p>
        <p className="text-lg opacity-80">
          GPS course finding and navigation features will be available soon!
        </p>
        <div className="mt-8">
          <Link href="/" className="bg-joe-gold text-joe-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}