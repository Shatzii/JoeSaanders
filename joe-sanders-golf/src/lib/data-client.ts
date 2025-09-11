import { supabase } from './supabase'
import logger from './logger'

// Local data client for development fallback (browser-safe)
class LocalDataClient {
  private data: any = { tournaments: [], sponsors: [], merch: [] }

  constructor() {
    // In browser environment, use default data structure
    if (typeof window !== 'undefined') {
      this.data = { tournaments: [], sponsors: [], merch: [] }
    }
  }

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
    return { success: true }
  }

  // Contact methods
  async sendContactMessage(data: any) {
    logger.info('Contact message (local)', { data })
    return { success: true }
  }
}

export const localDataClient = new LocalDataClient()

// Supabase data client for production
class SupabaseDataClient {
  async getTournaments() {
    logger.info('Fetching tournaments from Supabase')
    const { data, error } = await supabase!.from('tournaments').select('*').order('date', { ascending: false })
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
