// ✅ CONNECTED: Database types for your Supabase backend
// These types should match your actual Supabase database schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: "god" | "admin" | "manager" | "user" | "guest"
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: "god" | "admin" | "manager" | "user" | "guest"
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "god" | "admin" | "manager" | "user" | "guest"
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "pending" | "in_progress" | "completed" | "cancelled"
          priority: "low" | "medium" | "high" | "urgent"
          due_date: string | null
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: "pending" | "in_progress" | "completed" | "cancelled"
          priority?: "low" | "medium" | "high" | "urgent"
          due_date?: string | null
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          status?: "pending" | "in_progress" | "completed" | "cancelled"
          priority?: "low" | "medium" | "high" | "urgent"
          due_date?: string | null
          assigned_to?: string | null
          updated_at?: string
        }
      }
    }
  }
}
