'use client'

import { useState } from 'react'
import { Download, Trash2, Shield, Mail } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function GDPRDataManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleDataExport = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      // Collect all user data
      const [profile, shots, sessions, aiContext] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('shots').select('*').eq('user_id', user.id),
        supabase.from('game_sessions').select('*').eq('user_id', user.id),
        supabase.from('ai_coach_context').select('*').eq('user_id', user.id)
      ])

      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at
        },
        profile: profile.data,
        shots: shots.data,
        sessions: sessions.data,
        aiContext: aiContext.data,
        exportDate: new Date().toISOString()
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gdpr-data-export-${user.id}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: 'success', text: 'Data export completed successfully' })
    } catch (error) {
      console.error('Data export failed:', error)
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataDeletion = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      // Delete user data (cascade will handle related records)
      const { error } = await supabase.auth.admin.deleteUser(user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Your account and all data have been deleted successfully' })

      // Redirect to home page after a delay
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } catch (error) {
      console.error('Data deletion failed:', error)
      setMessage({ type: 'error', text: 'Failed to delete data. Please contact support.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#d4af37]/20">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-[#d4af37]" />
        <h3 className="text-lg font-semibold text-[#d4af37]">GDPR Data Management</h3>
      </div>

      <p className="text-gray-400 mb-6">
        Under GDPR, you have the right to access, export, or delete your personal data.
        These actions will affect all data associated with your account.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success'
            ? 'bg-green-900/20 border border-green-500/20 text-green-400'
            : 'bg-red-900/20 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="text-white font-medium">Export Your Data</h4>
              <p className="text-gray-400 text-sm">Download all your personal data in JSON format</p>
            </div>
          </div>
          <button
            onClick={handleDataExport}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
          >
            {isLoading ? 'Exporting...' : 'Export'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-400" />
            <div>
              <h4 className="text-white font-medium">Delete Your Account</h4>
              <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
            </div>
          </div>
          <button
            onClick={handleDataDeletion}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-[#d4af37]" />
          <h4 className="text-[#d4af37] font-medium">Need Help?</h4>
        </div>
        <p className="text-gray-400 text-sm">
          If you have questions about your data or need assistance, please contact our Data Protection Officer at{' '}
          <a href="mailto:privacy@joesandersgolf.com" className="text-[#d4af37] hover:underline">
            privacy@joesandersgolf.com
          </a>
        </p>
      </div>
    </div>
  )
}