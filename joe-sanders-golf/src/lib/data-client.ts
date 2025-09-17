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
      return data || []
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
      logger.warn('Supabase not configured, returning empty sponsors')
      return []
    }
    
    try {
      const { data, error } = await supabase.from('sponsors').select('*')
      if (error) {
        logger.error('Error fetching sponsors from Supabase', { error })
        return []
      }
      return data || []
    } catch (error) {
      logger.error('Error fetching sponsors from Supabase', { error })
      return []
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
}

export const supabaseDataClient = new SupabaseDataClient()

// Export the appropriate client based on environment and availability
export const dataClient = supabase ? supabaseDataClient : localDataClient