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
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          message: string
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          response?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      catch_environmental_correlation: {
        Row: {
          catch_id: string | null
          created_at: string | null
          environmental_condition_id: string | null
          id: string
          overall_score: number | null
          pressure_score: number | null
          solunar_score: number | null
          temperature_score: number | null
          weather_score: number | null
        }
        Insert: {
          catch_id?: string | null
          created_at?: string | null
          environmental_condition_id?: string | null
          id?: string
          overall_score?: number | null
          pressure_score?: number | null
          solunar_score?: number | null
          temperature_score?: number | null
          weather_score?: number | null
        }
        Update: {
          catch_id?: string | null
          created_at?: string | null
          environmental_condition_id?: string | null
          id?: string
          overall_score?: number | null
          pressure_score?: number | null
          solunar_score?: number | null
          temperature_score?: number | null
          weather_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catch_environmental_correlation_catch_id_fkey"
            columns: ["catch_id"]
            isOneToOne: false
            referencedRelation: "catches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catch_environmental_correlation_environmental_condition_id_fkey"
            columns: ["environmental_condition_id"]
            isOneToOne: false
            referencedRelation: "environmental_conditions"
            referencedColumns: ["id"]
          },
        ]
      }
      catch_gear_usage: {
        Row: {
          catch_id: string
          combo_id: string | null
          created_at: string | null
          id: string
          lure_brand: string | null
          lure_color: string | null
          lure_model: string | null
          reel_id: string | null
          rod_id: string | null
        }
        Insert: {
          catch_id: string
          combo_id?: string | null
          created_at?: string | null
          id?: string
          lure_brand?: string | null
          lure_color?: string | null
          lure_model?: string | null
          reel_id?: string | null
          rod_id?: string | null
        }
        Update: {
          catch_id?: string
          combo_id?: string | null
          created_at?: string | null
          id?: string
          lure_brand?: string | null
          lure_color?: string | null
          lure_model?: string | null
          reel_id?: string | null
          rod_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catch_gear_usage_catch_id_fkey"
            columns: ["catch_id"]
            isOneToOne: false
            referencedRelation: "catches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catch_gear_usage_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "user_combos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catch_gear_usage_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "user_reels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catch_gear_usage_rod_id_fkey"
            columns: ["rod_id"]
            isOneToOne: false
            referencedRelation: "user_rods"
            referencedColumns: ["id"]
          },
        ]
      }
      catches: {
        Row: {
          created_at: string
          id: string
          length: number | null
          notes: string | null
          photo_url: string | null
          species: string
          timestamp: string
          tournament_id: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          length?: number | null
          notes?: string | null
          photo_url?: string | null
          species: string
          timestamp?: string
          tournament_id?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          length?: number | null
          notes?: string | null
          photo_url?: string | null
          species?: string
          timestamp?: string
          tournament_id?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          club_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          club_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      environmental_alerts: {
        Row: {
          active_from: string
          active_until: string | null
          alert_type: string
          created_at: string | null
          id: string
          message: string
          severity: string | null
          title: string
          water_body_id: string | null
        }
        Insert: {
          active_from?: string
          active_until?: string | null
          alert_type: string
          created_at?: string | null
          id?: string
          message: string
          severity?: string | null
          title: string
          water_body_id?: string | null
        }
        Update: {
          active_from?: string
          active_until?: string | null
          alert_type?: string
          created_at?: string | null
          id?: string
          message?: string
          severity?: string | null
          title?: string
          water_body_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environmental_alerts_water_body_id_fkey"
            columns: ["water_body_id"]
            isOneToOne: false
            referencedRelation: "water_bodies"
            referencedColumns: ["id"]
          },
        ]
      }
      environmental_conditions: {
        Row: {
          air_temperature: number | null
          barometric_pressure: number | null
          cloud_cover: number | null
          created_at: string | null
          current_flow: string | null
          data_source: string | null
          humidity: number | null
          id: string
          moon_overhead_time: string | null
          moon_phase: number | null
          moon_underfoot_time: string | null
          precipitation: number | null
          recorded_at: string
          solunar_rating: number | null
          sunrise_time: string | null
          sunset_time: string | null
          surface_temperature_source: string | null
          user_id: string | null
          water_body_id: string | null
          water_clarity: string | null
          water_level: string | null
          water_temperature: number | null
          weather_condition: string | null
          wind_direction: number | null
          wind_speed: number | null
        }
        Insert: {
          air_temperature?: number | null
          barometric_pressure?: number | null
          cloud_cover?: number | null
          created_at?: string | null
          current_flow?: string | null
          data_source?: string | null
          humidity?: number | null
          id?: string
          moon_overhead_time?: string | null
          moon_phase?: number | null
          moon_underfoot_time?: string | null
          precipitation?: number | null
          recorded_at?: string
          solunar_rating?: number | null
          sunrise_time?: string | null
          sunset_time?: string | null
          surface_temperature_source?: string | null
          user_id?: string | null
          water_body_id?: string | null
          water_clarity?: string | null
          water_level?: string | null
          water_temperature?: number | null
          weather_condition?: string | null
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Update: {
          air_temperature?: number | null
          barometric_pressure?: number | null
          cloud_cover?: number | null
          created_at?: string | null
          current_flow?: string | null
          data_source?: string | null
          humidity?: number | null
          id?: string
          moon_overhead_time?: string | null
          moon_phase?: number | null
          moon_underfoot_time?: string | null
          precipitation?: number | null
          recorded_at?: string
          solunar_rating?: number | null
          sunrise_time?: string | null
          sunset_time?: string | null
          surface_temperature_source?: string | null
          user_id?: string | null
          water_body_id?: string | null
          water_clarity?: string | null
          water_level?: string | null
          water_temperature?: number | null
          weather_condition?: string | null
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "environmental_conditions_water_body_id_fkey"
            columns: ["water_body_id"]
            isOneToOne: false
            referencedRelation: "water_bodies"
            referencedColumns: ["id"]
          },
        ]
      }
      member_import_logs: {
        Row: {
          club_id: string
          completed_at: string | null
          created_at: string | null
          errors: Json | null
          failed_imports: number | null
          file_name: string
          file_size: number | null
          id: string
          import_data: Json | null
          imported_by: string
          status: string
          successful_imports: number | null
          total_rows: number | null
        }
        Insert: {
          club_id: string
          completed_at?: string | null
          created_at?: string | null
          errors?: Json | null
          failed_imports?: number | null
          file_name: string
          file_size?: number | null
          id?: string
          import_data?: Json | null
          imported_by: string
          status?: string
          successful_imports?: number | null
          total_rows?: number | null
        }
        Update: {
          club_id?: string
          completed_at?: string | null
          created_at?: string | null
          errors?: Json | null
          failed_imports?: number | null
          file_name?: string
          file_size?: number | null
          id?: string
          import_data?: Json | null
          imported_by?: string
          status?: string
          successful_imports?: number | null
          total_rows?: number | null
        }
        Relationships: []
      }
      member_import_staging: {
        Row: {
          boat_registration: string | null
          city: string | null
          club_role: string | null
          created_at: string | null
          email: string | null
          emergency_contact: string | null
          home_state: string | null
          id: string
          import_log_id: string
          is_duplicate: boolean | null
          is_valid: boolean | null
          name: string | null
          phone: string | null
          row_number: number
          signature_techniques: string[] | null
          validation_errors: Json | null
        }
        Insert: {
          boat_registration?: string | null
          city?: string | null
          club_role?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          home_state?: string | null
          id?: string
          import_log_id: string
          is_duplicate?: boolean | null
          is_valid?: boolean | null
          name?: string | null
          phone?: string | null
          row_number: number
          signature_techniques?: string[] | null
          validation_errors?: Json | null
        }
        Update: {
          boat_registration?: string | null
          city?: string | null
          club_role?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          home_state?: string | null
          id?: string
          import_log_id?: string
          is_duplicate?: boolean | null
          is_valid?: boolean | null
          name?: string | null
          phone?: string | null
          row_number?: number
          signature_techniques?: string[] | null
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "member_import_staging_import_log_id_fkey"
            columns: ["import_log_id"]
            isOneToOne: false
            referencedRelation: "member_import_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          progress: number | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aoy_titles: number | null
          avatar_url: string | null
          biggest_catch_location: string | null
          biggest_catch_species: string | null
          biggest_catch_weight: number | null
          city: string | null
          club: string | null
          club_id: string | null
          created_at: string
          favorite_water: string | null
          home_state: string | null
          id: string
          is_demo: boolean | null
          name: string
          signature_techniques: string[] | null
          tournaments_fished: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aoy_titles?: number | null
          avatar_url?: string | null
          biggest_catch_location?: string | null
          biggest_catch_species?: string | null
          biggest_catch_weight?: number | null
          city?: string | null
          club?: string | null
          club_id?: string | null
          created_at?: string
          favorite_water?: string | null
          home_state?: string | null
          id?: string
          is_demo?: boolean | null
          name: string
          signature_techniques?: string[] | null
          tournaments_fished?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aoy_titles?: number | null
          avatar_url?: string | null
          biggest_catch_location?: string | null
          biggest_catch_species?: string | null
          biggest_catch_weight?: number | null
          city?: string | null
          club?: string | null
          club_id?: string | null
          created_at?: string
          favorite_water?: string | null
          home_state?: string | null
          id?: string
          is_demo?: boolean | null
          name?: string
          signature_techniques?: string[] | null
          tournaments_fished?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      reel_line_setups: {
        Row: {
          created_at: string | null
          id: string
          is_current: boolean | null
          leader_length_feet: number | null
          leader_type: string | null
          leader_weight: string | null
          line_brand: string
          line_type: string
          line_weight: string
          notes: string | null
          reel_id: string
          spool_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          leader_length_feet?: number | null
          leader_type?: string | null
          leader_weight?: string | null
          line_brand: string
          line_type: string
          line_weight: string
          notes?: string | null
          reel_id: string
          spool_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          leader_length_feet?: number | null
          leader_type?: string | null
          leader_weight?: string | null
          line_brand?: string
          line_type?: string
          line_weight?: string
          notes?: string | null
          reel_id?: string
          spool_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reel_line_setups_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "user_reels"
            referencedColumns: ["id"]
          },
        ]
      }
      reel_specifications: {
        Row: {
          bearings: number | null
          brand: string
          created_at: string | null
          gear_ratio: string
          id: string
          line_capacity: string | null
          max_drag: number | null
          model: string
          msrp: number | null
          reel_type: string
          serial_number: string
          updated_at: string | null
          weight_oz: number | null
        }
        Insert: {
          bearings?: number | null
          brand: string
          created_at?: string | null
          gear_ratio: string
          id?: string
          line_capacity?: string | null
          max_drag?: number | null
          model: string
          msrp?: number | null
          reel_type: string
          serial_number: string
          updated_at?: string | null
          weight_oz?: number | null
        }
        Update: {
          bearings?: number | null
          brand?: string
          created_at?: string | null
          gear_ratio?: string
          id?: string
          line_capacity?: string | null
          max_drag?: number | null
          model?: string
          msrp?: number | null
          reel_type?: string
          serial_number?: string
          updated_at?: string | null
          weight_oz?: number | null
        }
        Relationships: []
      }
      rod_specifications: {
        Row: {
          action: string
          brand: string
          created_at: string | null
          id: string
          length_feet: number
          length_inches: number | null
          model: string
          msrp: number | null
          power: string
          rod_type: string
          serial_number: string
          updated_at: string | null
        }
        Insert: {
          action: string
          brand: string
          created_at?: string | null
          id?: string
          length_feet: number
          length_inches?: number | null
          model: string
          msrp?: number | null
          power: string
          rod_type: string
          serial_number: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          brand?: string
          created_at?: string | null
          id?: string
          length_feet?: number
          length_inches?: number | null
          model?: string
          msrp?: number | null
          power?: string
          rod_type?: string
          serial_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          club_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_role: string | null
          old_role: string | null
          reason: string | null
          role_type: string
          target_user_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          club_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_role?: string | null
          old_role?: string | null
          reason?: string | null
          role_type: string
          target_user_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          club_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_role?: string | null
          old_role?: string | null
          reason?: string | null
          role_type?: string
          target_user_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          club_role: Database["public"]["Enums"]["club_role"] | null
          created_at: string | null
          id: string
          permission_id: string
          platform_role: Database["public"]["Enums"]["platform_role"] | null
        }
        Insert: {
          club_role?: Database["public"]["Enums"]["club_role"] | null
          created_at?: string | null
          id?: string
          permission_id: string
          platform_role?: Database["public"]["Enums"]["platform_role"] | null
        }
        Update: {
          club_role?: Database["public"]["Enums"]["club_role"] | null
          created_at?: string | null
          id?: string
          permission_id?: string
          platform_role?: Database["public"]["Enums"]["platform_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      solunar_forecasts: {
        Row: {
          created_at: string | null
          date: string
          id: string
          major_period_1_end: string | null
          major_period_1_start: string | null
          major_period_2_end: string | null
          major_period_2_start: string | null
          minor_period_1_end: string | null
          minor_period_1_start: string | null
          minor_period_2_end: string | null
          minor_period_2_start: string | null
          moon_phase: number | null
          moon_rise: string | null
          moon_set: string | null
          overall_rating: number | null
          sunrise: string | null
          sunset: string | null
          water_body_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          major_period_1_end?: string | null
          major_period_1_start?: string | null
          major_period_2_end?: string | null
          major_period_2_start?: string | null
          minor_period_1_end?: string | null
          minor_period_1_start?: string | null
          minor_period_2_end?: string | null
          minor_period_2_start?: string | null
          moon_phase?: number | null
          moon_rise?: string | null
          moon_set?: string | null
          overall_rating?: number | null
          sunrise?: string | null
          sunset?: string | null
          water_body_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          major_period_1_end?: string | null
          major_period_1_start?: string | null
          major_period_2_end?: string | null
          major_period_2_start?: string | null
          minor_period_1_end?: string | null
          minor_period_1_start?: string | null
          minor_period_2_end?: string | null
          minor_period_2_start?: string | null
          moon_phase?: number | null
          moon_rise?: string | null
          moon_set?: string | null
          overall_rating?: number | null
          sunrise?: string | null
          sunset?: string | null
          water_body_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solunar_forecasts_water_body_id_fkey"
            columns: ["water_body_id"]
            isOneToOne: false
            referencedRelation: "water_bodies"
            referencedColumns: ["id"]
          },
        ]
      }
      temporary_role_elevations: {
        Row: {
          approved_by: string | null
          club_id: string | null
          created_at: string | null
          elevated_to: Database["public"]["Enums"]["club_role"]
          expires_at: string
          id: string
          is_active: boolean | null
          reason: string
          requested_by: string
          user_id: string
        }
        Insert: {
          approved_by?: string | null
          club_id?: string | null
          created_at?: string | null
          elevated_to: Database["public"]["Enums"]["club_role"]
          expires_at: string
          id?: string
          is_active?: boolean | null
          reason: string
          requested_by: string
          user_id: string
        }
        Update: {
          approved_by?: string | null
          club_id?: string | null
          created_at?: string | null
          elevated_to?: Database["public"]["Enums"]["club_role"]
          expires_at?: string
          id?: string
          is_active?: boolean | null
          reason?: string
          requested_by?: string
          user_id?: string
        }
        Relationships: []
      }
      tournament_registrations: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          club_id: string | null
          created_at: string
          created_by: string | null
          date: string
          entry_fee: number | null
          id: string
          location: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          entry_fee?: number | null
          id?: string
          location: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          club_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          entry_fee?: number | null
          id?: string
          location?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_boats: {
        Row: {
          beam_feet: number | null
          brand: string
          created_at: string | null
          fish_finder: string | null
          gps_unit: string | null
          id: string
          is_private: boolean | null
          length_feet: number | null
          livewell_count: number | null
          model: string
          motor_brand: string | null
          motor_horsepower: number | null
          motor_type: string | null
          nickname: string | null
          notes: string | null
          photo_url: string | null
          rod_storage_capacity: number | null
          special_features: string[] | null
          tournament_top10: number | null
          tournament_top3: number | null
          tournament_wins: number | null
          trolling_motor: string | null
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          beam_feet?: number | null
          brand: string
          created_at?: string | null
          fish_finder?: string | null
          gps_unit?: string | null
          id?: string
          is_private?: boolean | null
          length_feet?: number | null
          livewell_count?: number | null
          model: string
          motor_brand?: string | null
          motor_horsepower?: number | null
          motor_type?: string | null
          nickname?: string | null
          notes?: string | null
          photo_url?: string | null
          rod_storage_capacity?: number | null
          special_features?: string[] | null
          tournament_top10?: number | null
          tournament_top3?: number | null
          tournament_wins?: number | null
          trolling_motor?: string | null
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          beam_feet?: number | null
          brand?: string
          created_at?: string | null
          fish_finder?: string | null
          gps_unit?: string | null
          id?: string
          is_private?: boolean | null
          length_feet?: number | null
          livewell_count?: number | null
          model?: string
          motor_brand?: string | null
          motor_horsepower?: number | null
          motor_type?: string | null
          nickname?: string | null
          notes?: string | null
          photo_url?: string | null
          rod_storage_capacity?: number | null
          special_features?: string[] | null
          tournament_top10?: number | null
          tournament_top3?: number | null
          tournament_wins?: number | null
          trolling_motor?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      user_combos: {
        Row: {
          created_at: string | null
          id: string
          is_private: boolean | null
          nickname: string
          notes: string | null
          primary_techniques: string[] | null
          reel_id: string
          rod_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          nickname: string
          notes?: string | null
          primary_techniques?: string[] | null
          reel_id: string
          rod_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          nickname?: string
          notes?: string | null
          primary_techniques?: string[] | null
          reel_id?: string
          rod_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_combos_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "user_reels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_combos_rod_id_fkey"
            columns: ["rod_id"]
            isOneToOne: false
            referencedRelation: "user_rods"
            referencedColumns: ["id"]
          },
        ]
      }
      user_environmental_reports: {
        Row: {
          created_at: string | null
          current_flow: string | null
          fishing_conditions: string | null
          id: string
          reported_at: string
          user_id: string
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          water_body_id: string | null
          water_clarity: string | null
          water_level: string | null
          water_temperature: number | null
          weather_notes: string | null
        }
        Insert: {
          created_at?: string | null
          current_flow?: string | null
          fishing_conditions?: string | null
          id?: string
          reported_at?: string
          user_id: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          water_body_id?: string | null
          water_clarity?: string | null
          water_level?: string | null
          water_temperature?: number | null
          weather_notes?: string | null
        }
        Update: {
          created_at?: string | null
          current_flow?: string | null
          fishing_conditions?: string | null
          id?: string
          reported_at?: string
          user_id?: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          water_body_id?: string | null
          water_clarity?: string | null
          water_level?: string | null
          water_temperature?: number | null
          weather_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_environmental_reports_water_body_id_fkey"
            columns: ["water_body_id"]
            isOneToOne: false
            referencedRelation: "water_bodies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_platform_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          platform_role: Database["public"]["Enums"]["platform_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform_role: Database["public"]["Enums"]["platform_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform_role?: Database["public"]["Enums"]["platform_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_coach_enabled: boolean | null
          allow_location_sharing: boolean | null
          coaching_intensity: string | null
          contribute_conservation_data: boolean | null
          display_in_leaderboards: boolean | null
          public_profile: boolean | null
          share_catch_patterns: boolean | null
          show_catches_in_feed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_coach_enabled?: boolean | null
          allow_location_sharing?: boolean | null
          coaching_intensity?: string | null
          contribute_conservation_data?: boolean | null
          display_in_leaderboards?: boolean | null
          public_profile?: boolean | null
          share_catch_patterns?: boolean | null
          show_catches_in_feed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_coach_enabled?: boolean | null
          allow_location_sharing?: boolean | null
          coaching_intensity?: string | null
          contribute_conservation_data?: boolean | null
          display_in_leaderboards?: boolean | null
          public_profile?: boolean | null
          share_catch_patterns?: boolean | null
          show_catches_in_feed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_reels: {
        Row: {
          bearings: number | null
          brand: string
          created_at: string | null
          gear_ratio: string
          id: string
          is_private: boolean | null
          line_capacity: string | null
          max_drag: number | null
          model: string
          nickname: string | null
          notes: string | null
          purchase_date: string | null
          reel_type: string
          serial_number: string | null
          updated_at: string | null
          user_id: string
          weight_oz: number | null
        }
        Insert: {
          bearings?: number | null
          brand: string
          created_at?: string | null
          gear_ratio: string
          id?: string
          is_private?: boolean | null
          line_capacity?: string | null
          max_drag?: number | null
          model: string
          nickname?: string | null
          notes?: string | null
          purchase_date?: string | null
          reel_type: string
          serial_number?: string | null
          updated_at?: string | null
          user_id: string
          weight_oz?: number | null
        }
        Update: {
          bearings?: number | null
          brand?: string
          created_at?: string | null
          gear_ratio?: string
          id?: string
          is_private?: boolean | null
          line_capacity?: string | null
          max_drag?: number | null
          model?: string
          nickname?: string | null
          notes?: string | null
          purchase_date?: string | null
          reel_type?: string
          serial_number?: string | null
          updated_at?: string | null
          user_id?: string
          weight_oz?: number | null
        }
        Relationships: []
      }
      user_rods: {
        Row: {
          action: string
          brand: string
          created_at: string | null
          id: string
          is_private: boolean | null
          length_feet: number
          length_inches: number | null
          model: string
          nickname: string | null
          notes: string | null
          power: string
          primary_technique: string | null
          purchase_date: string | null
          rod_type: string
          serial_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action: string
          brand: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          length_feet: number
          length_inches?: number | null
          model: string
          nickname?: string | null
          notes?: string | null
          power: string
          primary_technique?: string | null
          purchase_date?: string | null
          rod_type: string
          serial_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action?: string
          brand?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          length_feet?: number
          length_inches?: number | null
          model?: string
          nickname?: string | null
          notes?: string | null
          power?: string
          primary_technique?: string | null
          purchase_date?: string | null
          rod_type?: string
          serial_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          club_id: string | null
          club_role: Database["public"]["Enums"]["club_role"] | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          club_id?: string | null
          club_role?: Database["public"]["Enums"]["club_role"] | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          club_id?: string | null
          club_role?: Database["public"]["Enums"]["club_role"] | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      water_bodies: {
        Row: {
          average_depth: number | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          max_depth: number | null
          name: string
          state: string
          surface_area: number | null
          updated_at: string | null
          water_type: string | null
        }
        Insert: {
          average_depth?: number | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          max_depth?: number | null
          name: string
          state: string
          surface_area?: number | null
          updated_at?: string | null
          water_type?: string | null
        }
        Update: {
          average_depth?: number | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          max_depth?: number | null
          name?: string
          state?: string
          surface_area?: number | null
          updated_at?: string | null
          water_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_duplicate_email: {
        Args: { email: string }
        Returns: boolean
      }
      get_club_member_count: {
        Args: { club_uuid: string }
        Returns: number
      }
      get_user_effective_roles: {
        Args: { _club_id?: string; _user_id: string }
        Returns: {
          club_id: string
          expires_at: string
          role_name: string
          role_type: string
        }[]
      }
      has_role: {
        Args: {
          _club_id?: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_authorized_for_member_import: {
        Args: { _import_log_id: string; _user_id: string }
        Returns: boolean
      }
      is_club_member: {
        Args: { club_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_club_officer: {
        Args: { _club_id?: string; _user_id: string }
        Returns: boolean
      }
      is_platform_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
      log_sensitive_import_access: {
        Args: {
          _import_log_id: string
          _operation: string
          _table_name: string
          _user_id?: string
        }
        Returns: undefined
      }
      user_has_permission: {
        Args: { _club_id?: string; _permission_name: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "club_officer" | "member"
      club_role:
        | "club_admin"
        | "president"
        | "vice_president"
        | "tournament_director"
        | "secretary"
        | "treasurer"
        | "conservation_director"
        | "member"
        | "guest"
      platform_role: "super_admin" | "platform_admin"
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
      app_role: ["admin", "club_officer", "member"],
      club_role: [
        "club_admin",
        "president",
        "vice_president",
        "tournament_director",
        "secretary",
        "treasurer",
        "conservation_director",
        "member",
        "guest",
      ],
      platform_role: ["super_admin", "platform_admin"],
    },
  },
} as const
