export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean
          tags: string[] | null
          title: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      code_snippets: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean | null
          language: string
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          language?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          language?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string | null
          message: string
          metadata: Json | null
          name: string
          phone: string | null
          priority: string | null
          resolved_at: string | null
          source_page: string | null
          status: string | null
          subject: string | null
          updated_at: string
          utm_data: Json | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string | null
          message: string
          metadata?: Json | null
          name: string
          phone?: string | null
          priority?: string | null
          resolved_at?: string | null
          source_page?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          utm_data?: Json | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string | null
          message?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          priority?: string | null
          resolved_at?: string | null
          source_page?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          utm_data?: Json | null
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string
          company_size: string | null
          created_at: string
          demo_type: string | null
          demo_url: string | null
          email: string
          first_name: string
          follow_up_date: string | null
          id: string
          industry: string | null
          job_title: string | null
          last_name: string
          meeting_notes: string | null
          outcome: string | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          sales_rep: string | null
          scheduled_date: string | null
          status: string | null
          timezone: string | null
          updated_at: string
          use_case: string | null
        }
        Insert: {
          company: string
          company_size?: string | null
          created_at?: string
          demo_type?: string | null
          demo_url?: string | null
          email: string
          first_name: string
          follow_up_date?: string | null
          id?: string
          industry?: string | null
          job_title?: string | null
          last_name: string
          meeting_notes?: string | null
          outcome?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          sales_rep?: string | null
          scheduled_date?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string
          use_case?: string | null
        }
        Update: {
          company?: string
          company_size?: string | null
          created_at?: string
          demo_type?: string | null
          demo_url?: string | null
          email?: string
          first_name?: string
          follow_up_date?: string | null
          id?: string
          industry?: string | null
          job_title?: string | null
          last_name?: string
          meeting_notes?: string | null
          outcome?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          sales_rep?: string | null
          scheduled_date?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string
          use_case?: string | null
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed_at: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          longest_streak: number
          name: string
          streak_count: number
          target_frequency: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          longest_streak?: number
          name: string
          streak_count?: number
          target_frequency?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          longest_streak?: number
          name?: string
          streak_count?: number
          target_frequency?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          campaign: string | null
          company: string | null
          company_size: string | null
          conversion_date: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          industry: string | null
          ip_address: unknown | null
          job_title: string | null
          last_contacted_at: string | null
          last_name: string | null
          lead_score: number | null
          notes: string | null
          page_url: string | null
          phone: string | null
          referrer: string | null
          source: string
          status: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          campaign?: string | null
          company?: string | null
          company_size?: string | null
          conversion_date?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          industry?: string | null
          ip_address?: unknown | null
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          lead_score?: number | null
          notes?: string | null
          page_url?: string | null
          phone?: string | null
          referrer?: string | null
          source: string
          status?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          campaign?: string | null
          company?: string | null
          company_size?: string | null
          conversion_date?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          industry?: string | null
          ip_address?: unknown | null
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          lead_score?: number | null
          notes?: string | null
          page_url?: string | null
          phone?: string | null
          referrer?: string | null
          source?: string
          status?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          confirmed_at: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          interests: Json | null
          last_name: string | null
          preferences: Json | null
          status: string | null
          subscription_source: string | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          interests?: Json | null
          last_name?: string | null
          preferences?: Json | null
          status?: string | null
          subscription_source?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          interests?: Json | null
          last_name?: string | null
          preferences?: Json | null
          status?: string | null
          subscription_source?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pinned_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          pinned_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          pinned_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          pinned_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recent_activity: {
        Row: {
          action_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      starred_items: {
        Row: {
          id: string
          item_id: string
          item_title: string
          item_type: string
          starred_at: string
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          item_title: string
          item_type: string
          starred_at?: string
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          item_title?: string
          item_type?: string
          starred_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_prompts: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          banner_height: number | null
          banner_image: string | null
          clock_position: string | null
          created_at: string
          custom_header_title: string | null
          custom_sidebar_title: string | null
          dashboard_background: string | null
          dashboard_layout: Json | null
          dashboard_title: string | null
          edit_mode: boolean | null
          gradient_mode: string | null
          grid_size: string | null
          hide_dividers: boolean | null
          id: string
          minimal_navigation_mode: boolean | null
          quick_note: string | null
          show_banner: boolean | null
          show_date: boolean | null
          show_header_title: boolean | null
          show_seconds: boolean | null
          show_sidebar_crown: boolean | null
          show_year: boolean | null
          sidebar_collapsed: boolean | null
          sidebar_solid: boolean | null
          sidebar_title: string | null
          top_navigation_widgets: Json | null
          updated_at: string
          use_24_hour_format: boolean | null
          user_id: string
          user_navigation_order: Json | null
          workspace_id: string | null
        }
        Insert: {
          banner_height?: number | null
          banner_image?: string | null
          clock_position?: string | null
          created_at?: string
          custom_header_title?: string | null
          custom_sidebar_title?: string | null
          dashboard_background?: string | null
          dashboard_layout?: Json | null
          dashboard_title?: string | null
          edit_mode?: boolean | null
          gradient_mode?: string | null
          grid_size?: string | null
          hide_dividers?: boolean | null
          id?: string
          minimal_navigation_mode?: boolean | null
          quick_note?: string | null
          show_banner?: boolean | null
          show_date?: boolean | null
          show_header_title?: boolean | null
          show_seconds?: boolean | null
          show_sidebar_crown?: boolean | null
          show_year?: boolean | null
          sidebar_collapsed?: boolean | null
          sidebar_solid?: boolean | null
          sidebar_title?: string | null
          top_navigation_widgets?: Json | null
          updated_at?: string
          use_24_hour_format?: boolean | null
          user_id: string
          user_navigation_order?: Json | null
          workspace_id?: string | null
        }
        Update: {
          banner_height?: number | null
          banner_image?: string | null
          clock_position?: string | null
          created_at?: string
          custom_header_title?: string | null
          custom_sidebar_title?: string | null
          dashboard_background?: string | null
          dashboard_layout?: Json | null
          dashboard_title?: string | null
          edit_mode?: boolean | null
          gradient_mode?: string | null
          grid_size?: string | null
          hide_dividers?: boolean | null
          id?: string
          minimal_navigation_mode?: boolean | null
          quick_note?: string | null
          show_banner?: boolean | null
          show_date?: boolean | null
          show_header_title?: boolean | null
          show_seconds?: boolean | null
          show_sidebar_crown?: boolean | null
          show_year?: boolean | null
          sidebar_collapsed?: boolean | null
          sidebar_solid?: boolean | null
          sidebar_title?: string | null
          top_navigation_widgets?: Json | null
          updated_at?: string
          use_24_hour_format?: boolean | null
          user_id?: string
          user_navigation_order?: Json | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      website_analytics: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          event_data: Json | null
          event_name: string
          id: string
          ip_address: unknown | null
          os: string | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_data?: Json | null
          event_name: string
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_data?: Json | null
          event_name?: string
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      website_content: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          content_type: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          language: string | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          seo_keywords: Json | null
          slug: string
          status: string | null
          tags: Json | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          content_type: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          language?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          seo_keywords?: Json | null
          slug: string
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          content_type?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          language?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          seo_keywords?: Json | null
          slug?: string
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      workspace_profiles: {
        Row: {
          banner_height: number | null
          banner_image: string | null
          category: string | null
          clock_position: string | null
          created_at: string
          custom_header_title: string | null
          custom_sidebar_title: string | null
          dashboard_background: string | null
          dashboard_layout: Json | null
          edit_mode: boolean | null
          gradient_mode: string | null
          grid_size: string | null
          hide_dividers: boolean | null
          id: string
          is_default: boolean | null
          minimal_navigation_mode: boolean | null
          name: string
          quick_note: string | null
          show_banner: boolean | null
          show_date: boolean | null
          show_header_title: boolean | null
          show_seconds: boolean | null
          show_sidebar_crown: boolean | null
          show_year: boolean | null
          sidebar_collapsed: boolean | null
          sidebar_solid: boolean | null
          top_navigation_widgets: Json | null
          updated_at: string
          use_24_hour_format: boolean | null
          user_id: string
          user_navigation_order: Json | null
          workspace_id: string
        }
        Insert: {
          banner_height?: number | null
          banner_image?: string | null
          category?: string | null
          clock_position?: string | null
          created_at?: string
          custom_header_title?: string | null
          custom_sidebar_title?: string | null
          dashboard_background?: string | null
          dashboard_layout?: Json | null
          edit_mode?: boolean | null
          gradient_mode?: string | null
          grid_size?: string | null
          hide_dividers?: boolean | null
          id?: string
          is_default?: boolean | null
          minimal_navigation_mode?: boolean | null
          name?: string
          quick_note?: string | null
          show_banner?: boolean | null
          show_date?: boolean | null
          show_header_title?: boolean | null
          show_seconds?: boolean | null
          show_sidebar_crown?: boolean | null
          show_year?: boolean | null
          sidebar_collapsed?: boolean | null
          sidebar_solid?: boolean | null
          top_navigation_widgets?: Json | null
          updated_at?: string
          use_24_hour_format?: boolean | null
          user_id: string
          user_navigation_order?: Json | null
          workspace_id: string
        }
        Update: {
          banner_height?: number | null
          banner_image?: string | null
          category?: string | null
          clock_position?: string | null
          created_at?: string
          custom_header_title?: string | null
          custom_sidebar_title?: string | null
          dashboard_background?: string | null
          dashboard_layout?: Json | null
          edit_mode?: boolean | null
          gradient_mode?: string | null
          grid_size?: string | null
          hide_dividers?: boolean | null
          id?: string
          is_default?: boolean | null
          minimal_navigation_mode?: boolean | null
          name?: string
          quick_note?: string | null
          show_banner?: boolean | null
          show_date?: boolean | null
          show_header_title?: boolean | null
          show_seconds?: boolean | null
          show_sidebar_crown?: boolean | null
          show_year?: boolean | null
          sidebar_collapsed?: boolean | null
          sidebar_solid?: boolean | null
          top_navigation_widgets?: Json | null
          updated_at?: string
          use_24_hour_format?: boolean | null
          user_id?: string
          user_navigation_order?: Json | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      workspace_category: "work" | "personal" | "fun" | "default"
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
      workspace_category: ["work", "personal", "fun", "default"],
    },
  },
} as const
