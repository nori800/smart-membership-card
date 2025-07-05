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
      members: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          member_number: string
          password_hash: string
          status: 'bronze' | 'silver' | 'gold' | 'diamond'
          expiration_date: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          member_number: string
          password_hash: string
          status?: 'bronze' | 'silver' | 'gold' | 'diamond'
          expiration_date: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          member_number?: string
          password_hash?: string
          status?: 'bronze' | 'silver' | 'gold' | 'diamond'
          expiration_date?: string
          is_active?: boolean
        }
        Relationships: []
      }
      member_benefits: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          status: 'bronze' | 'silver' | 'gold' | 'diamond'
          title: string
          description: string
          discount_rate: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          status: 'bronze' | 'silver' | 'gold' | 'diamond'
          title: string
          description: string
          discount_rate?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          status?: 'bronze' | 'silver' | 'gold' | 'diamond'
          title?: string
          description?: string
          discount_rate?: number | null
          is_active?: boolean
        }
        Relationships: []
      }
      admins: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          password_hash: string
          name: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          password_hash: string
          name: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          password_hash?: string
          name?: string
          is_active?: boolean
        }
        Relationships: []
      }
      login_logs: {
        Row: {
          id: string
          created_at: string
          member_id: string
          ip_address: string | null
          user_agent: string | null
          login_type: 'web' | 'mobile'
        }
        Insert: {
          id?: string
          created_at?: string
          member_id: string
          ip_address?: string | null
          user_agent?: string | null
          login_type?: 'web' | 'mobile'
        }
        Update: {
          id?: string
          created_at?: string
          member_id?: string
          ip_address?: string | null
          user_agent?: string | null
          login_type?: 'web' | 'mobile'
        }
        Relationships: [
          {
            foreignKeyName: "login_logs_member_id_fkey"
            columns: ["member_id"]
            referencedRelation: "members"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_member_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_member_benefits: {
        Args: {
          member_status_param: 'bronze' | 'silver' | 'gold' | 'diamond'
        }
        Returns: {
          title: string
          description: string
          discount_rate: number | null
        }[]
      }
    }
    Enums: {
      member_status: 'bronze' | 'silver' | 'gold' | 'diamond'
      login_type: 'web' | 'mobile'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 