import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg p-6 border border-[#d4af37]/20 text-center">
        <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-[#d4af37]" />
        </div>

        <h1 className="text-4xl font-bold text-[#d4af37] mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <button className="bg-[#d4af37] hover:bg-[#b8942c] text-[#0a0a0a] px-4 py-2 rounded font-semibold flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>

          <Link href="/simulator">
            <button className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2">
              Try Simulator
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}