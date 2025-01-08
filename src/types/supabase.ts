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
          name: string
          mobile: string
          plan_type: string
          amount_paid: number
          due_amount: number
          expiry_date: string
          join_date: string
          user_id: string
          gender: string // New column added
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          mobile: string
          plan_type: string
          amount_paid: number
          due_amount: number
          expiry_date: string
          join_date?: string
          user_id: string
          gender?: string // New column added (optional for insertion)
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          mobile?: string
          plan_type?: string
          amount_paid?: number
          due_amount?: number
          expiry_date?: string
          join_date?: string
          user_id?: string
          gender?: string // New column added (optional for updates)
          created_at?: string
        }
      }
    }
  }
}
