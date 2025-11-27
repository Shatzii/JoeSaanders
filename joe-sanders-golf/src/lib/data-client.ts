import { supabase } from './supabase'
import logger from './logger'

// Local data client for fallback when Supabase is not available
class LocalDataClient {
  async getTournaments() {
    logger.info('Using local data client - returning empty tournaments')
    return []
  }

  async getTournamentById(id: string) {
    logger.info('Using local data client - returning null for tournament', { id })
    return null
  }

  async getSponsors() {
    logger.info('Using local data client - returning empty sponsors')
    return []
  }

  async getMerch() {
    logger.info('Using local data client - returning empty merchandise')
    return []
  }

  async subscribeToNewsletter(email: string) {
    logger.info('Newsletter subscription (local mode)', { email })
    return { success: true }
  }

  async sendContactMessage(data: any) {
    logger.info('Contact message (local mode)', { data })
    return { success: true }
  }
}

export const localDataClient = new LocalDataClient()

// Supabase data client for production
class SupabaseDataClient {
  async getTournaments() {
    if (!supabase) {
      logger.warn('Supabase not configured, returning empty tournaments')
      return []
    }
    
    try {
      const { data, error } = await supabase.from('tournaments').select('*')
      if (error) {
        logger.error('Error fetching tournaments from Supabase', { error })
        return []
      }
      if (!data) {
        throw new Error('Supabase returned null data')
      }
      return data
    } catch (error) {
      logger.error('Error fetching tournaments from Supabase', { error })
      return []
    }
  }

  async getTournamentById(id: string) {
    if (!supabase) {
      return null
    }
    
    try {
      const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).single()
      if (error) {
        return null
      }
      return data
    } catch (error) {
      return null
    }
  }

  async getSponsors() {
    if (!supabase) {
      logger.warn('Supabase not configured, falling back to local sponsors data')
      return this.getLocalData().sponsors || []
    }
    
    try {
      const { data, error } = await supabase.from('sponsors').select('*')
      if (error) {
        logger.error('Error fetching sponsors from Supabase, falling back to local data', { error })
        return this.getLocalData().sponsors || []
      }
      
      // If Supabase returns empty, fall back to local data
      if (!data || data.length === 0) {
        logger.warn('No sponsors in Supabase, falling back to local data')
        return this.getLocalData().sponsors || []
      }
      
      return data || []
    } catch (error) {
      logger.error('Error fetching sponsors from Supabase, falling back to local data', { error })
      return this.getLocalData().sponsors || []
    }
  }

  async getMerch() {
    if (!supabase) {
      logger.warn('Supabase not configured, returning empty merchandise')
      return []
    }
    
    try {
      const { data, error } = await supabase.from('merch').select('*')
      if (error) {
        logger.error('Error fetching merchandise from Supabase', { error })
        return []
      }
      return data || []
    } catch (error) {
      logger.error('Error fetching merchandise from Supabase', { error })
      return []
    }
  }

  async subscribeToNewsletter(email: string) {
    if (!supabase) {
      return { success: false, error: 'Database not configured' }
    }
    
    try {
      const { error } = await supabase.from('newsletter_emails').insert({ email })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to subscribe' }
    }
  }

  async sendContactMessage(data: any) {
    logger.info('Contact message processing', { data })
    return { success: true }
  }

  async createTournament(values: Record<string, unknown>) {
    if (!supabase) throw new Error('Database not configured')
    const { data, error } = await supabase.from('tournaments').insert(values).select().single()
    if (error) throw new Error(error.message)
    return data as any
  }

  async updateTournament(id: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Database not configured')
    const { data, error } = await supabase.from('tournaments').update(updates).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as any
  }

  async deleteTournament(id: string) {
    if (!supabase) throw new Error('Database not configured')
    const { error } = await supabase.from('tournaments').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { success: true }
  }

  async createSponsor(values: Record<string, unknown>) {
    if (!supabase) throw new Error('Database not configured')
    const { data, error } = await supabase.from('sponsors').insert(values).select().single()
    if (error) throw new Error(error.message)
    return data as any
  }

  async updateSponsor(id: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Database not configured')
    const { data, error } = await supabase.from('sponsors').update(updates).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as any
  }

  async deleteSponsor(id: string) {
    if (!supabase) throw new Error('Database not configured')
    const { error } = await supabase.from('sponsors').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { success: true }
  }

  async createMerch(values: Record<string, unknown>) {
    if (!supabase) throw new Error('Database not configured')
    const { data, error } = await supabase.from('merch').insert(values).select().single()
    if (error) throw new Error(error.message)
    return data as any
  }

  async updateMerch(id: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Database not configured')
    const { data, error } = await supabase.from('merch').update(updates).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as any
  }

  async deleteMerch(id: string) {
    if (!supabase) throw new Error('Database not configured')
    const { error } = await supabase.from('merch').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { success: true }
  }
}

export const supabaseDataClient = new SupabaseDataClient()

// Export the appropriate client based on environment and availability
export const dataClient = supabase ? supabaseDataClient : localDataClient