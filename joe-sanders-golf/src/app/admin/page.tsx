'use client'

import { useState, useEffect } from 'react'
import { dataClient } from '@/lib/data-client'
import { Tournament, Sponsor, Merch } from '@/types'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import FanEngagement from '@/components/FanEngagement'
import { Plus, Edit, Trash2, Save, X, BarChart3, Heart } from 'lucide-react'

interface EditingItem {
  type: 'tournament' | 'sponsor' | 'merch'
  id: string
  data: any
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'sponsors' | 'merch' | 'analytics' | 'engagement'>('tournaments')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [merch, setMerch] = useState<Merch[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<EditingItem | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tournamentsData, sponsorsData, merchData] = await Promise.all([
        dataClient.getTournaments(),
        dataClient.getSponsors(),
        dataClient.getMerch()
      ])
      setTournaments(tournamentsData)
      setSponsors(sponsorsData)
      setMerch(merchData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (type: 'tournament' | 'sponsor' | 'merch', item: any) => {
    setEditing({
      type,
      id: item.id,
      data: { ...item }
    })
  }

  const handleSave = async () => {
    if (!editing) return

    // Ensure we're using Supabase client for admin operations
    if (!('updateTournament' in dataClient)) {
      alert('Admin operations require Supabase connection. Please check your configuration.')
      return
    }

    try {
      let result
      switch (editing.type) {
        case 'tournament':
          result = await (dataClient as any).updateTournament(editing.id, editing.data)
          break
        case 'sponsor':
          result = await (dataClient as any).updateSponsor(editing.id, editing.data)
          break
        case 'merch':
          result = await (dataClient as any).updateMerch(editing.id, editing.data)
          break
      }

      // Update local state
      if (editing.type === 'tournament') {
        setTournaments(tournaments.map(t => t.id === editing.id ? result : t))
      } else if (editing.type === 'sponsor') {
        setSponsors(sponsors.map(s => s.id === editing.id ? result : s))
      } else if (editing.type === 'merch') {
        setMerch(merch.map(m => m.id === editing.id ? result : m))
      }

      setEditing(null)
      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleDelete = async (type: 'tournament' | 'sponsor' | 'merch', id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return

    // Ensure we're using Supabase client for admin operations
    if (!('deleteTournament' in dataClient)) {
      alert('Admin operations require Supabase connection. Please check your configuration.')
      return
    }

    try {
      switch (type) {
        case 'tournament':
          await (dataClient as any).deleteTournament(id)
          setTournaments(tournaments.filter(t => t.id !== id))
          break
        case 'sponsor':
          await (dataClient as any).deleteSponsor(id)
          setSponsors(sponsors.filter(s => s.id !== id))
          break
        case 'merch':
          await (dataClient as any).deleteMerch(id)
          setMerch(merch.filter(m => m.id !== id))
          break
      }

      alert('Item deleted successfully!')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  const handleCreate = async () => {
    if (!showCreateForm || !newItem.name) {
      alert('Please fill in at least the name field.')
      return
    }

    // Ensure we're using Supabase client for admin operations
    if (!('createTournament' in dataClient)) {
      alert('Admin operations require Supabase connection. Please check your configuration.')
      return
    }

    try {
      let result
      const itemToCreate = {
        ...newItem,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      switch (activeTab) {
        case 'tournaments':
          result = await (dataClient as any).createTournament(itemToCreate)
          setTournaments([result, ...tournaments])
          break
        case 'sponsors':
          result = await (dataClient as any).createSponsor(itemToCreate)
          setSponsors([result, ...sponsors])
          break
        case 'merch':
          result = await (dataClient as any).createMerch(itemToCreate)
          setMerch([result, ...merch])
          break
      }

      setShowCreateForm(false)
      setNewItem({})
      alert('Item created successfully!')
    } catch (error) {
      console.error('Error creating:', error)
      alert('Failed to create item. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-joe-black flex items-center justify-center">
        <div className="text-joe-gold text-xl font-joe-body">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-joe-black">
      {/* Header */}
      <section className="bg-joe-stone py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-joe-heading font-bold text-joe-gold mb-4">Admin Panel</h1>
            <p className="text-xl text-joe-white font-joe-body">Manage tournaments, sponsors, and merchandise</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-joe-stone p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`flex-1 py-2 px-4 rounded-md font-joe-accent font-medium transition-colors ${
                activeTab === 'tournaments'
                  ? 'bg-joe-gold text-joe-black'
                  : 'text-joe-white hover:bg-joe-black/50'
              }`}
            >
              Tournaments ({tournaments.length})
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`flex-1 py-2 px-4 rounded-md font-joe-accent font-medium transition-colors ${
                activeTab === 'sponsors'
                  ? 'bg-joe-gold text-joe-black'
                  : 'text-joe-white hover:bg-joe-black/50'
              }`}
            >
              Sponsors ({sponsors.length})
            </button>
            <button
              onClick={() => setActiveTab('merch')}
              className={`flex-1 py-2 px-4 rounded-md font-joe-accent font-medium transition-colors ${
                activeTab === 'merch'
                  ? 'bg-joe-gold text-joe-black'
                  : 'text-joe-white hover:bg-joe-black/50'
              }`}
            >
              Merch ({merch.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-4 rounded-md font-joe-accent font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-joe-gold text-joe-black'
                  : 'text-joe-white hover:bg-joe-black/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`flex-1 py-2 px-4 rounded-md font-joe-accent font-medium transition-colors ${
                activeTab === 'engagement'
                  ? 'bg-joe-gold text-joe-black'
                  : 'text-joe-white hover:bg-joe-black/50'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Fan Engagement
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'tournaments' && (
            <div className="bg-joe-stone rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold">Tournaments</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="merch-button px-4 py-2 rounded-lg font-joe-accent font-bold text-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tournament</span>
                </button>
              </div>

              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="bg-joe-black p-4 rounded-lg border border-joe-gold/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {editing?.type === 'tournament' && editing.id === tournament.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editing.data.name}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, name: e.target.value}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                            />
                            <textarea
                              value={editing.data.recap_text}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, recap_text: e.target.value}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                              rows={3}
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-lg font-joe-heading font-semibold text-joe-gold mb-1">
                              {tournament.title}
                            </h3>
                            <p className="text-joe-stone text-sm font-joe-body mb-2">
                              {new Date(tournament.date).toLocaleDateString()} • {tournament.location}
                            </p>
                            <p className="text-joe-white text-sm font-joe-body line-clamp-2">
                              {tournament.description}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {editing?.type === 'tournament' && editing.id === tournament.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit('tournament', tournament)}
                              className="p-2 text-joe-gold hover:bg-joe-gold/20 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('tournament', tournament.id)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sponsors' && (
            <div className="bg-joe-stone rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold">Sponsors</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="merch-button px-4 py-2 rounded-lg font-joe-accent font-bold text-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Sponsor</span>
                </button>
              </div>

              <div className="space-y-4">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="bg-joe-black p-4 rounded-lg border border-joe-gold/20">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        {editing?.type === 'sponsor' && editing.id === sponsor.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editing.data.name}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, name: e.target.value}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                            />
                            <select
                              value={editing.data.tier}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, tier: e.target.value}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                            >
                              <option value="Title">Title</option>
                              <option value="Presenting">Presenting</option>
                              <option value="Official">Official</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-lg font-joe-heading font-semibold text-joe-gold mb-1">
                              {sponsor.name}
                            </h3>
                            <p className="text-joe-stone text-sm font-joe-body">
                              {sponsor.tier} Partner
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {editing?.type === 'sponsor' && editing.id === sponsor.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit('sponsor', sponsor)}
                              className="p-2 text-joe-gold hover:bg-joe-gold/20 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('sponsor', sponsor.id)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'merch' && (
            <div className="bg-joe-stone rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold">Merchandise</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="merch-button px-4 py-2 rounded-lg font-joe-accent font-bold text-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="space-y-4">
                {merch.map((item) => (
                  <div key={item.id} className="bg-joe-black p-4 rounded-lg border border-joe-gold/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {editing?.type === 'merch' && editing.id === item.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editing.data.name}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, name: e.target.value}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={editing.data.price}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, price: parseFloat(e.target.value)}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                            />
                            <textarea
                              value={editing.data.description}
                              onChange={(e) => setEditing({...editing, data: {...editing.data, description: e.target.value}})}
                              className="w-full p-2 bg-joe-stone text-joe-white rounded"
                              rows={3}
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-lg font-joe-heading font-semibold text-joe-gold mb-1">
                              {item.name}
                            </h3>
                            <p className="text-joe-stone text-sm font-joe-body mb-2">
                              ${item.price_id ? '25.00' : 'TBD'}
                            </p>
                            <p className="text-joe-white text-sm font-joe-body line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {editing?.type === 'merch' && editing.id === item.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit('merch', item)}
                              className="p-2 text-joe-gold hover:bg-joe-gold/20 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('merch', item.id)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-joe-stone rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Advanced Analytics Dashboard
                </h2>
                <p className="text-joe-white font-joe-body">
                  Monitor website performance, user engagement, and track custom events with Google Analytics integration.
                </p>
              </div>

              <AdvancedAnalytics />
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="bg-joe-stone rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-4 flex items-center">
                  <Heart className="h-6 w-6 mr-3" />
                  Fan Engagement Hub
                </h2>
                <p className="text-joe-white font-joe-body">
                  Interactive features for fan engagement including tournament predictions, leaderboards, and community activities.
                </p>
              </div>

              <FanEngagement />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
