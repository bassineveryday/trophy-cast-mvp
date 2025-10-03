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
      aoy_standings: {
        Row: {
          aoy_rank: number | null
          boater_status: string | null
          member_id: string
          member_name: string | null
          season_year: number
          total_aoy_points: number | null
        }
        Insert: {
          aoy_rank?: number | null
          boater_status?: string | null
          member_id: string
          member_name?: string | null
          season_year: number
          total_aoy_points?: number | null
        }
        Update: {
          aoy_rank?: number | null
          boater_status?: string | null
          member_id?: string
          member_name?: string | null
          season_year?: number
          total_aoy_points?: number | null
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
          ar_model_version: string | null
          captured_at: string | null
          created_at: string
          id: string
          idempotency_key: string | null
          is_demo: boolean
          length: number | null
          length_inches: number | null
          length_mm: number | null
          location: unknown | null
          notes: string | null
          photo_key: string | null
          photo_url: string | null
          species: string
          timestamp: string
          tournament_id: string | null
          updated_at: string
          user_id: string
          video_key: string | null
          weight: number | null
          weight_lbs: number | null
          weight_oz: number | null
        }
        Insert: {
          ar_model_version?: string | null
          captured_at?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string | null
          is_demo?: boolean
          length?: number | null
          length_inches?: number | null
          length_mm?: number | null
          location?: unknown | null
          notes?: string | null
          photo_key?: string | null
          photo_url?: string | null
          species: string
          timestamp?: string
          tournament_id?: string | null
          updated_at?: string
          user_id: string
          video_key?: string | null
          weight?: number | null
          weight_lbs?: number | null
          weight_oz?: number | null
        }
        Update: {
          ar_model_version?: string | null
          captured_at?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string | null
          is_demo?: boolean
          length?: number | null
          length_inches?: number | null
          length_mm?: number | null
          location?: unknown | null
          notes?: string | null
          photo_key?: string | null
          photo_url?: string | null
          species?: string
          timestamp?: string
          tournament_id?: string | null
          updated_at?: string
          user_id?: string
          video_key?: string | null
          weight?: number | null
          weight_lbs?: number | null
          weight_oz?: number | null
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
          is_demo: boolean
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          club_id?: string | null
          id?: string
          is_demo?: boolean
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          club_id?: string | null
          id?: string
          is_demo?: boolean
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
          is_demo: boolean
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_demo?: boolean
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_demo?: boolean
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
          linked_member_id: string | null
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
          linked_member_id?: string | null
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
          linked_member_id?: string | null
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
      settings_audit: {
        Row: {
          changed_at: string | null
          id: string
          new_value: string | null
          old_value: string | null
          setting_key: string
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          setting_key: string
          user_id: string
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          setting_key?: string
          user_id?: string
        }
        Relationships: []
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
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
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
      tournament_entries: {
        Row: {
          checked_in: boolean | null
          created_at: string | null
          event_id: string
          id: string
          is_demo: boolean
          member_id: string
          season: number | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          checked_in?: boolean | null
          created_at?: string | null
          event_id: string
          id?: string
          is_demo?: boolean
          member_id: string
          season?: number | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          checked_in?: boolean | null
          created_at?: string | null
          event_id?: string
          id?: string
          is_demo?: boolean
          member_id?: string
          season?: number | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tournament_events: {
        Row: {
          created_at: string | null
          event_date: string | null
          event_id: string
          id: string | null
          is_demo: boolean
          lake: string | null
          participants: number | null
          season: number | null
          tournament_code: string | null
          tournament_id: string | null
          tournament_name: string | null
        }
        Insert: {
          created_at?: string | null
          event_date?: string | null
          event_id: string
          id?: string | null
          is_demo?: boolean
          lake?: string | null
          participants?: number | null
          season?: number | null
          tournament_code?: string | null
          tournament_id?: string | null
          tournament_name?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string | null
          event_id?: string
          id?: string | null
          is_demo?: boolean
          lake?: string | null
          participants?: number | null
          season?: number | null
          tournament_code?: string | null
          tournament_id?: string | null
          tournament_name?: string | null
        }
        Relationships: []
      }
      tournament_members: {
        Row: {
          address: string | null
          bass_number: string | null
          boater_status: string | null
          city: string | null
          email_primary: string | null
          is_demo: boolean
          is_rookie: boolean | null
          member_id: string
          member_name: string | null
          member_name_clean: string | null
          mobile_phone: string | null
          state: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          bass_number?: string | null
          boater_status?: string | null
          city?: string | null
          email_primary?: string | null
          is_demo?: boolean
          is_rookie?: boolean | null
          member_id: string
          member_name?: string | null
          member_name_clean?: string | null
          mobile_phone?: string | null
          state?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          bass_number?: string | null
          boater_status?: string | null
          city?: string | null
          email_primary?: string | null
          is_demo?: boolean
          is_rookie?: boolean | null
          member_id?: string
          member_name?: string | null
          member_name_clean?: string | null
          mobile_phone?: string | null
          state?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      tournament_registrations: {
        Row: {
          checked_in: boolean | null
          checked_in_at: string | null
          created_at: string | null
          id: string
          status: string | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          checked_in?: boolean | null
          checked_in_at?: string | null
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
      tournament_results: {
        Row: {
          aoy_points: number | null
          big_bass_lbs: number | null
          big_bass_payout: number | null
          big_fish: number | null
          boat_weight_payout: number | null
          cash_payout: number | null
          catch_count: number | null
          event_date: string | null
          event_id: string | null
          fish_count: number | null
          is_demo: boolean
          lake: string | null
          member_id: string | null
          member_name: string | null
          place: number | null
          result_id: number
          result_text: string | null
          season: number | null
          source: string | null
          total_weight: number | null
          tournament_code: string | null
          tournament_name: string | null
          visibility: string | null
          weight_lbs: number | null
        }
        Insert: {
          aoy_points?: number | null
          big_bass_lbs?: number | null
          big_bass_payout?: number | null
          big_fish?: number | null
          boat_weight_payout?: number | null
          cash_payout?: number | null
          catch_count?: number | null
          event_date?: string | null
          event_id?: string | null
          fish_count?: number | null
          is_demo?: boolean
          lake?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          result_id?: number
          result_text?: string | null
          season?: number | null
          source?: string | null
          total_weight?: number | null
          tournament_code?: string | null
          tournament_name?: string | null
          visibility?: string | null
          weight_lbs?: number | null
        }
        Update: {
          aoy_points?: number | null
          big_bass_lbs?: number | null
          big_bass_payout?: number | null
          big_fish?: number | null
          boat_weight_payout?: number | null
          cash_payout?: number | null
          catch_count?: number | null
          event_date?: string | null
          event_id?: string | null
          fish_count?: number | null
          is_demo?: boolean
          lake?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          result_id?: number
          result_text?: string | null
          season?: number | null
          source?: string | null
          total_weight?: number | null
          tournament_code?: string | null
          tournament_name?: string | null
          visibility?: string | null
          weight_lbs?: number | null
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          club_id: string | null
          created_at: string
          created_by: string | null
          date: string
          entry_fee: number | null
          event_id: string | null
          id: string
          is_demo: boolean
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
          event_id?: string | null
          id?: string
          is_demo?: boolean
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
          event_id?: string | null
          id?: string
          is_demo?: boolean
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
          unwind_mode_enabled: boolean | null
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
          unwind_mode_enabled?: boolean | null
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
          unwind_mode_enabled?: boolean | null
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
          is_demo: boolean
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
          is_demo?: boolean
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
          is_demo?: boolean
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
      user_settings: {
        Row: {
          ai_coach_enabled: boolean | null
          allow_conservation_contribution: boolean | null
          allow_location_capture: boolean | null
          share_to_club_default: boolean | null
          share_to_public_default: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_coach_enabled?: boolean | null
          allow_conservation_contribution?: boolean | null
          allow_location_capture?: boolean | null
          share_to_club_default?: boolean | null
          share_to_public_default?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_coach_enabled?: boolean | null
          allow_conservation_contribution?: boolean | null
          allow_location_capture?: boolean | null
          share_to_club_default?: boolean | null
          share_to_public_default?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      v_aoy_best4: {
        Row: {
          member_id: string | null
          member_name: string | null
          season: number | null
          total_points: number | null
        }
        Relationships: []
      }
      v_aoy_standings: {
        Row: {
          aoy_rank: number | null
          boater_status: string | null
          member_id: string | null
          member_name: string | null
          season_year: number | null
          total_aoy_points: number | null
        }
        Insert: {
          aoy_rank?: number | null
          boater_status?: string | null
          member_id?: string | null
          member_name?: string | null
          season_year?: number | null
          total_aoy_points?: number | null
        }
        Update: {
          aoy_rank?: number | null
          boater_status?: string | null
          member_id?: string | null
          member_name?: string | null
          season_year?: number | null
          total_aoy_points?: number | null
        }
        Relationships: []
      }
      v_aoy_standings_demo: {
        Row: {
          aoy_rank: number | null
          boater_status: string | null
          club_id: string | null
          member_id: string | null
          member_name: string | null
          season_year: number | null
          total_aoy_points: number | null
        }
        Relationships: []
      }
      v_event_points: {
        Row: {
          aoy_points: number | null
          event_id: string | null
          member_id: string | null
          member_name: string | null
          place: number | null
          season: number | null
        }
        Insert: {
          aoy_points?: number | null
          event_id?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          season?: number | null
        }
        Update: {
          aoy_points?: number | null
          event_id?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          season?: number | null
        }
        Relationships: []
      }
      v_event_points_demo: {
        Row: {
          aoy_points: number | null
          event_id: string | null
          member_id: string | null
          member_name: string | null
          place: number | null
          season: number | null
        }
        Insert: {
          aoy_points?: number | null
          event_id?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          season?: number | null
        }
        Update: {
          aoy_points?: number | null
          event_id?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          season?: number | null
        }
        Relationships: []
      }
      v_event_rank: {
        Row: {
          big_bass_lbs: number | null
          event_id: string | null
          member_id: string | null
          member_name: string | null
          place: number | null
          season: number | null
          total_weight: number | null
        }
        Insert: {
          big_bass_lbs?: number | null
          event_id?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          season?: number | null
          total_weight?: number | null
        }
        Update: {
          big_bass_lbs?: number | null
          event_id?: string | null
          member_id?: string | null
          member_name?: string | null
          place?: number | null
          season?: number | null
          total_weight?: number | null
        }
        Relationships: []
      }
      v_me: {
        Row: {
          club_id: string | null
          is_demo: boolean | null
          user_id: string | null
        }
        Insert: {
          club_id?: string | null
          is_demo?: boolean | null
          user_id?: string | null
        }
        Update: {
          club_id?: string | null
          is_demo?: boolean | null
          user_id?: string | null
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
      v_rookie_of_year: {
        Row: {
          events_fished: number | null
          member_id: string | null
          member_name: string | null
          season: number | null
          total_points: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      check_duplicate_email: {
        Args: { email: string }
        Returns: boolean
      }
      check_in_angler: {
        Args: {
          p_is_checked_in: boolean
          p_tournament_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      cleanup_old_staging_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_event_for_today: {
        Args: { p_tournament_id: string }
        Returns: string
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_club_member_count: {
        Args: { club_uuid: string }
        Returns: number
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
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
      get_user_is_demo: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
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
      is_super_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
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
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      register_for_tournament: {
        Args: { p_tournament_id: string }
        Returns: undefined
      }
      seed_entries_for_event: {
        Args: { p_event_id: string }
        Returns: undefined
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      tc_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          clubs: number
          events_count: number
          my_lane: boolean
          now_utc: string
          regs_count: number
          results_count: number
          tournaments_count: number
        }[]
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      user_has_permission: {
        Args: { _club_id?: string; _permission_name: string; _user_id: string }
        Returns: boolean
      }
      whoami: {
        Args: Record<PropertyKey, never>
        Returns: {
          club_id: string
          is_demo: boolean
          user_id: string
        }[]
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
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
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
