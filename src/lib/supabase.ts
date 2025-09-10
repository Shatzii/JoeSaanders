import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types - in a real app, these would be generated from Supabase
export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string
          name: string
          date: string
          location: string
          result: string | null
          purse: number
          earnings: number | null
          description: string | null
          highlights: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          location: string
          result?: string | null
          purse: number
          earnings?: number | null
          description?: string | null
          highlights?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          location?: string
          result?: string | null
          purse?: number
          earnings?: number | null
          description?: string | null
          highlights?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          images: string[]
          category: 'apparel' | 'equipment' | 'accessories'
          in_stock: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          images: string[]
          category: 'apparel' | 'equipment' | 'accessories'
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          images?: string[]
          category?: 'apparel' | 'equipment' | 'accessories'
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          membership_tier: string | null
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          membership_tier?: string | null
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          membership_tier?: string | null
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}