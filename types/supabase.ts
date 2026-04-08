export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'business' | 'referrer' | 'admin'
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'business' | 'referrer' | 'admin'
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'business' | 'referrer' | 'admin'
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string
          short_description: string | null
          logo_url: string | null
          cover_image_url: string | null
          website: string | null
          email: string
          phone: string
          address: string | null
          city: string
          province: string
          postal_code: string | null
          country: string
          industry: string
          services: string[]
          commission_rate: number
          is_verified: boolean
          is_active: boolean
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description: string
          short_description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          website?: string | null
          email: string
          phone: string
          address?: string | null
          city: string
          province: string
          postal_code?: string | null
          country?: string
          industry: string
          services?: string[]
          commission_rate?: number
          is_verified?: boolean
          is_active?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          website?: string | null
          email?: string
          phone?: string
          address?: string | null
          city?: string
          province?: string
          postal_code?: string | null
          country?: string
          industry?: string
          services?: string[]
          commission_rate?: number
          is_verified?: boolean
          is_active?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          business_id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          notes: string | null
          status: 'pending' | 'contacted' | 'converted' | 'declined' | 'cancelled'
          commission_amount: number | null
          commission_paid: boolean
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          business_id: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          notes?: string | null
          status?: 'pending' | 'contacted' | 'converted' | 'declined' | 'cancelled'
          commission_amount?: number | null
          commission_paid?: boolean
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          business_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          notes?: string | null
          status?: 'pending' | 'contacted' | 'converted' | 'declined' | 'cancelled'
          commission_amount?: number | null
          commission_paid?: boolean
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      industries: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          description?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
