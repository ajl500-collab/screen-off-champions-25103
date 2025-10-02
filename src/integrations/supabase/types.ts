export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_categories: {
        Row: {
          app_name: string
          category: Database["public"]["Enums"]["app_category"]
          created_at: string | null
          efficiency_multiplier: number
          id: string
        }
        Insert: {
          app_name: string
          category: Database["public"]["Enums"]["app_category"]
          created_at?: string | null
          efficiency_multiplier: number
          id?: string
        }
        Update: {
          app_name?: string
          category?: Database["public"]["Enums"]["app_category"]
          created_at?: string | null
          efficiency_multiplier?: number
          id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          chat_type: string
          content: string
          created_at: string | null
          id: string
          media_url: string | null
          message_type: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          chat_type: string
          content: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_type: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          chat_type?: string
          content?: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_settings: {
        Row: {
          created_at: string | null
          id: string
          preferred_mode: Database["public"]["Enums"]["competition_mode"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_mode?: Database["public"]["Enums"]["competition_mode"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_mode?: Database["public"]["Enums"]["competition_mode"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_emoji: string | null
          created_at: string | null
          display_name: string | null
          efficiency_score: number | null
          id: string
          team_name: string | null
          total_screen_time_minutes: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_emoji?: string | null
          created_at?: string | null
          display_name?: string | null
          efficiency_score?: number | null
          id: string
          team_name?: string | null
          total_screen_time_minutes?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_emoji?: string | null
          created_at?: string | null
          display_name?: string | null
          efficiency_score?: number | null
          id?: string
          team_name?: string | null
          total_screen_time_minutes?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          average_efficiency: number | null
          created_at: string | null
          id: string
          team_name: string
          team_size: number
          updated_at: string | null
          week_end: string
          week_start: string
        }
        Insert: {
          average_efficiency?: number | null
          created_at?: string | null
          id?: string
          team_name: string
          team_size: number
          updated_at?: string | null
          week_end: string
          week_start: string
        }
        Update: {
          average_efficiency?: number | null
          created_at?: string | null
          id?: string
          team_name?: string
          team_size?: number
          updated_at?: string | null
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          ai_plan: string | null
          completed_at: string | null
          created_at: string | null
          goal_text: string
          id: string
          is_completed: boolean | null
          is_favorite: boolean | null
          target_efficiency: number | null
          target_screen_time_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_plan?: string | null
          completed_at?: string | null
          created_at?: string | null
          goal_text: string
          id?: string
          is_completed?: boolean | null
          is_favorite?: boolean | null
          target_efficiency?: number | null
          target_screen_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_plan?: string | null
          completed_at?: string | null
          created_at?: string | null
          goal_text?: string
          id?: string
          is_completed?: boolean | null
          is_favorite?: boolean | null
          target_efficiency?: number | null
          target_screen_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_screen_time: {
        Row: {
          app_name: string
          created_at: string | null
          date: string
          id: string
          time_spent_minutes: number
          user_id: string
        }
        Insert: {
          app_name: string
          created_at?: string | null
          date?: string
          id?: string
          time_spent_minutes: number
          user_id: string
        }
        Update: {
          app_name?: string
          created_at?: string | null
          date?: string
          id?: string
          time_spent_minutes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_screen_time_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_themes: {
        Row: {
          created_at: string | null
          id: string
          theme_name: string
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          theme_name: string
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          theme_name?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_efficiency_score: {
        Args: { p_date: string; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      app_category: "productive" | "unproductive" | "utility"
      competition_mode: "solo" | "duo" | "trio" | "random"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_category: ["productive", "unproductive", "utility"],
      competition_mode: ["solo", "duo", "trio", "random"],
    },
  },
} as const
