'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error)

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg p-6 border border-red-500/20 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-400 mb-6">
          We encountered an unexpected error. Our team has been notified and is working to fix this issue.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-[#2a2a2a] rounded p-3 mb-4 text-left">
            <p className="text-sm text-gray-300 font-mono">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#d4af37] hover:bg-[#b8942c] text-[#0a0a0a] px-4 py-2 rounded font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded font-semibold flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}