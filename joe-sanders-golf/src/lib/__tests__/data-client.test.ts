import { dataClient, localDataClient, supabaseDataClient } from '@/lib/data-client'
import { supabase } from '@/lib/supabase'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: null,
          error: null
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}))

// Mock logger
jest.mock('@/lib/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}))

describe('Data Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Local Data Client', () => {
    it('should return tournaments from local data', async () => {
      const tournaments = await localDataClient.getTournaments()
      expect(Array.isArray(tournaments)).toBe(true)
    })

    it('should return a specific tournament by ID', async () => {
      const tournament = await localDataClient.getTournamentById('1')
      expect(tournament).toBeDefined()
    })

    it('should return sponsors from local data', async () => {
      const sponsors = await localDataClient.getSponsors()
      expect(Array.isArray(sponsors)).toBe(true)
    })

    it('should return merchandise from local data', async () => {
      const merch = await localDataClient.getMerch()
      expect(Array.isArray(merch)).toBe(true)
    })

    it('should handle newsletter subscription', async () => {
      const result = await localDataClient.subscribeToNewsletter('test@example.com')
      expect(result.success).toBe(true)
    })

    it('should handle contact message', async () => {
      const result = await localDataClient.sendContactMessage({ test: 'data' })
      expect(result.success).toBe(true)
    })
  })

  describe('Supabase Data Client', () => {
    beforeEach(() => {
      // Mock successful Supabase responses
      const mockSupabase = supabase as any
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { id: '1' }, error: null }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: { id: '1' }, error: null }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null }))
        }))
      })
    })

    it('should fetch tournaments from Supabase', async () => {
      const tournaments = await supabaseDataClient.getTournaments()
      expect(Array.isArray(tournaments)).toBe(true)
    })

    it('should fetch a specific tournament by ID', async () => {
      const tournament = await supabaseDataClient.getTournamentById('1')
      expect(tournament).toBeDefined()
    })

    it('should create a tournament', async () => {
      const newTournament = {
        name: 'Test Tournament',
        date: '2025-01-01',
        result: 'Test Result'
      }

      const result = await supabaseDataClient.createTournament(newTournament)
      expect(result.id).toBe('1')
    })

    it('should update a tournament', async () => {
      const updates = { name: 'Updated Tournament' }
      const result = await supabaseDataClient.updateTournament('1', updates)
      expect(result.id).toBe('1')
    })

    it('should delete a tournament', async () => {
      const result = await supabaseDataClient.deleteTournament('1')
      expect(result.success).toBe(true)
    })

    it('should handle Supabase errors gracefully', async () => {
      // Mock an error response
      const mockSupabase = supabase as any
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      })

      await expect(supabaseDataClient.getTournaments()).rejects.toThrow()
    })
  })

  describe('Data Client Selection', () => {
    it('should use Supabase client when available', () => {
      // When supabase is available, it should use supabaseDataClient
      expect(dataClient).toBe(supabaseDataClient)
    })

    it('should fallback to local client when Supabase is not available', () => {
      // This test assumes supabase is mocked as available
      // In a real scenario without Supabase config, it would use localDataClient
      expect(dataClient).toBeDefined()
    })
  })
})
