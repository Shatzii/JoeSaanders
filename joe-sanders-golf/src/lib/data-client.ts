import { supabase } from './supabase'
import logger from './logger'

<<<<<<< HEAD
// Conditionally import Node.js modules for server-side usage
let fs: any = null
let path: any = null
let dataPath: string = ''

try {
  // Only import on server side
  if (typeof window === 'undefined') {
    fs = require('fs')
    path = require('path')
    dataPath = path.join(process.cwd(), 'data', 'local-data.json')
  }
} catch (error) {
  // Client side - fs and path not available
}

// Local data client for development fallback
=======
// Local data client for development fallback (browser-safe)
>>>>>>> origin/copilot/vscode1757631355561
class LocalDataClient {
  private data: any = { tournaments: [], sponsors: [], merch: [] }

  constructor() {
<<<<<<< HEAD
    this.loadData()
  }

  private loadData() {
    try {
      if (fs && dataPath && fs.existsSync(dataPath)) {
        const fileContents = fs.readFileSync(dataPath, 'utf8')
        this.data = JSON.parse(fileContents)
      } else {
        this.data = { tournaments: [], sponsors: [], merch: [] }
      }
    } catch (error) {
      logger.error('Error loading local data:', { error: error instanceof Error ? error.message : 'Unknown error' })
=======
    // In browser environment, use default data structure
    if (typeof window !== 'undefined') {
>>>>>>> origin/copilot/vscode1757631355561
      this.data = { tournaments: [], sponsors: [], merch: [] }
    }
  }

<<<<<<< HEAD
  private saveData() {
    try {
      if (fs && dataPath) {
        fs.writeFileSync(dataPath, JSON.stringify(this.data, null, 2))
      }
    } catch (error) {
      logger.error('Error saving local data:', { error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

=======
>>>>>>> origin/copilot/vscode1757631355561
  // Tournament methods
  async getTournaments() {
    logger.info('Fetching tournaments from local data')
    return this.data?.tournaments || []
  }

  async getTournamentById(id: string) {
    logger.info('Fetching tournament by ID from local data', { id })
    return this.data?.tournaments?.find((t: any) => t.id === id) || null
  }

  // Sponsor methods
  async getSponsors() {
    logger.info('Fetching sponsors from local data')
    return this.data?.sponsors || []
  }

  // Merch methods
  async getMerch() {
    logger.info('Fetching merchandise from local data')
    return this.data?.merch || []
  }

  // Newsletter methods
  async subscribeToNewsletter(email: string) {
    logger.info('Newsletter subscription (local)', { email })
    // Add to local newsletter list
    if (!this.data.newsletter_emails) {
      this.data.newsletter_emails = []
    }
    const existing = this.data.newsletter_emails.find((e: any) => e.email === email)
    if (!existing) {
      this.data.newsletter_emails.push({
        id: Date.now().toString(),
        email,
        subscribed_at: new Date().toISOString()
      })
      this.saveData()
    }
    return { success: true }
  }

  // Contact methods
  async sendContactMessage(data: any) {
    logger.info('Contact message (local)', { data })
    return { success: true }
  }

  // Admin CRUD methods
  async createTournament(tournament: any) {
    logger.info('Creating tournament (local)', { name: tournament.name })
    const newTournament = {
      ...tournament,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.data.tournaments.push(newTournament)
    this.saveData()
    return newTournament
  }

  async updateTournament(id: string, updates: any) {
    logger.info('Updating tournament (local)', { id })
    const index = this.data.tournaments.findIndex((t: any) => t.id === id)
    if (index !== -1) {
      this.data.tournaments[index] = {
        ...this.data.tournaments[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      this.saveData()
      return this.data.tournaments[index]
    }
    throw new Error('Tournament not found')
  }

  async deleteTournament(id: string) {
    logger.info('Deleting tournament (local)', { id })
    const index = this.data.tournaments.findIndex((t: any) => t.id === id)
    if (index !== -1) {
      this.data.tournaments.splice(index, 1)
      this.saveData()
      return { success: true }
    }
    throw new Error('Tournament not found')
  }

  async createSponsor(sponsor: any) {
    logger.info('Creating sponsor (local)', { name: sponsor.name })
    const newSponsor = {
      ...sponsor,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.data.sponsors.push(newSponsor)
    this.saveData()
    return newSponsor
  }

  async updateSponsor(id: string, updates: any) {
    logger.info('Updating sponsor (local)', { id })
    const index = this.data.sponsors.findIndex((s: any) => s.id === id)
    if (index !== -1) {
      this.data.sponsors[index] = {
        ...this.data.sponsors[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      this.saveData()
      return this.data.sponsors[index]
    }
    throw new Error('Sponsor not found')
  }

  async deleteSponsor(id: string) {
    logger.info('Deleting sponsor (local)', { id })
    const index = this.data.sponsors.findIndex((s: any) => s.id === id)
    if (index !== -1) {
      this.data.sponsors.splice(index, 1)
      this.saveData()
      return { success: true }
    }
    throw new Error('Sponsor not found')
  }

  async createMerch(item: any) {
    logger.info('Creating merchandise (local)', { name: item.name })
    const newItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.data.merch.push(newItem)
    this.saveData()
    return newItem
  }

  async updateMerch(id: string, updates: any) {
    logger.info('Updating merchandise (local)', { id })
    const index = this.data.merch.findIndex((m: any) => m.id === id)
    if (index !== -1) {
      this.data.merch[index] = {
        ...this.data.merch[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      this.saveData()
      return this.data.merch[index]
    }
    throw new Error('Merchandise not found')
  }

  async deleteMerch(id: string) {
    logger.info('Deleting merchandise (local)', { id })
    const index = this.data.merch.findIndex((m: any) => m.id === id)
    if (index !== -1) {
      this.data.merch.splice(index, 1)
      this.saveData()
      return { success: true }
    }
    throw new Error('Merchandise not found')
  }
}

export const localDataClient = new LocalDataClient()

// Supabase data client for production
class SupabaseDataClient {
  async getTournaments() {
    logger.info('Fetching tournaments from Supabase')
    const { data, error } = await supabase!.from('tournaments').select('id, name, date, location, status, description').order('date', { ascending: false }).limit(50)
    if (error) {
      logger.error('Error fetching tournaments from Supabase', { error: error.message })
      throw error
    }
    return data || []
  }

  async getTournamentById(id: string) {
    logger.info('Fetching tournament by ID from Supabase', { id })
    const { data, error } = await supabase!.from('tournaments').select('*').eq('id', id).single()
    if (error) {
      logger.error('Error fetching tournament from Supabase', { error: error.message, id })
      return null
    }
    return data
  }

  async getSponsors() {
    logger.info('Fetching sponsors from Supabase')
    const { data, error } = await supabase!.from('sponsors').select('*').order('tier', { ascending: false })
    if (error) {
      logger.error('Error fetching sponsors from Supabase', { error: error.message })
      throw error
    }
    return data || []
  }

  async getMerch() {
    logger.info('Fetching merchandise from Supabase')
    const { data, error } = await supabase!.from('merch').select('*').eq('active', true).order('created_at', { ascending: false })
    if (error) {
      logger.error('Error fetching merchandise from Supabase', { error: error.message })
      throw error
    }
    return data || []
  }

  async subscribeToNewsletter(email: string) {
    logger.info('Newsletter subscription to Supabase', { email })
    const { error } = await supabase!.from('newsletter_emails').insert({ email })
    if (error) {
      logger.error('Error subscribing to newsletter', { error: error.message, email })
      throw error
    }
    return { success: true }
  }

  async sendContactMessage(data: any) {
    logger.info('Contact message processing', { data })
    // This would typically send an email or store in database
    return { success: true }
  }

  // Admin CRUD methods
  async createTournament(tournament: any) {
    logger.info('Creating tournament in Supabase', { name: tournament.name })
    const { data, error } = await supabase!.from('tournaments').insert(tournament).select().single()
    if (error) {
      logger.error('Error creating tournament', { error: error.message })
      throw error
    }
    return data
  }

  async updateTournament(id: string, updates: any) {
    logger.info('Updating tournament in Supabase', { id })
    const { data, error } = await supabase!.from('tournaments').update(updates).eq('id', id).select().single()
    if (error) {
      logger.error('Error updating tournament', { error: error.message, id })
      throw error
    }
    return data
  }

  async deleteTournament(id: string) {
    logger.info('Deleting tournament from Supabase', { id })
    const { error } = await supabase!.from('tournaments').delete().eq('id', id)
    if (error) {
      logger.error('Error deleting tournament', { error: error.message, id })
      throw error
    }
    return { success: true }
  }

  async createSponsor(sponsor: any) {
    logger.info('Creating sponsor in Supabase', { name: sponsor.name })
    const { data, error } = await supabase!.from('sponsors').insert(sponsor).select().single()
    if (error) {
      logger.error('Error creating sponsor', { error: error.message })
      throw error
    }
    return data
  }

  async updateSponsor(id: string, updates: any) {
    logger.info('Updating sponsor in Supabase', { id })
    const { data, error } = await supabase!.from('sponsors').update(updates).eq('id', id).select().single()
    if (error) {
      logger.error('Error updating sponsor', { error: error.message, id })
      throw error
    }
    return data
  }

  async deleteSponsor(id: string) {
    logger.info('Deleting sponsor from Supabase', { id })
    const { error } = await supabase!.from('sponsors').delete().eq('id', id)
    if (error) {
      logger.error('Error deleting sponsor', { error: error.message, id })
      throw error
    }
    return { success: true }
  }

  async createMerch(item: any) {
    logger.info('Creating merchandise in Supabase', { name: item.name })
    const { data, error } = await supabase!.from('merch').insert(item).select().single()
    if (error) {
      logger.error('Error creating merchandise', { error: error.message })
      throw error
    }
    return data
  }

  async updateMerch(id: string, updates: any) {
    logger.info('Updating merchandise in Supabase', { id })
    const { data, error } = await supabase!.from('merch').update(updates).eq('id', id).select().single()
    if (error) {
      logger.error('Error updating merchandise', { error: error.message, id })
      throw error
    }
    return data
  }

  async deleteMerch(id: string) {
    logger.info('Deleting merchandise from Supabase', { id })
    const { error } = await supabase!.from('merch').delete().eq('id', id)
    if (error) {
      logger.error('Error deleting merchandise', { error: error.message, id })
      throw error
    }
    return { success: true }
  }
}

export const supabaseDataClient = new SupabaseDataClient()

// Export the appropriate client based on environment and availability
export const dataClient = supabase ? supabaseDataClient : localDataClient
