import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WaterBody {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  water_type: string;
  average_depth?: number;
  max_depth?: number;
  surface_area?: number;
}

export interface EnvironmentalCondition {
  id: string;
  water_body_id: string;
  recorded_at: string;
  air_temperature?: number;
  water_temperature?: number;
  barometric_pressure?: number;
  humidity?: number;
  wind_speed?: number;
  wind_direction?: number;
  cloud_cover?: number;
  precipitation?: number;
  weather_condition?: string;
  moon_phase?: number;
  moon_overhead_time?: string;
  moon_underfoot_time?: string;
  sunrise_time?: string;
  sunset_time?: string;
  solunar_rating?: number;
  water_clarity?: string;
  water_level?: string;
  current_flow?: string;
  surface_temperature_source?: string;
  data_source?: string;
}

export interface SolunarForecast {
  id: string;
  water_body_id: string;
  date: string;
  major_period_1_start?: string;
  major_period_1_end?: string;
  major_period_2_start?: string;
  major_period_2_end?: string;
  minor_period_1_start?: string;
  minor_period_1_end?: string;
  minor_period_2_start?: string;
  minor_period_2_end?: string;
  overall_rating?: number;
  sunrise?: string;
  sunset?: string;
  moon_phase?: number;
  moon_rise?: string;
  moon_set?: string;
}

export interface UserEnvironmentalReport {
  id: string;
  user_id: string;
  water_body_id: string;
  reported_at: string;
  water_temperature?: number;
  water_clarity?: string;
  water_level?: string;
  current_flow?: string;
  weather_notes?: string;
  fishing_conditions?: string;
  verified: boolean;
}

// Get all water bodies
export function useWaterBodies() {
  return useQuery({
    queryKey: ['water_bodies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('water_bodies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as WaterBody[];
    }
  });
}

// Get environmental conditions for a water body
export function useEnvironmentalConditions(waterBodyId: string | null) {
  return useQuery({
    queryKey: ['environmental_conditions', waterBodyId],
    queryFn: async () => {
      if (!waterBodyId) return null;
      
      const { data, error } = await supabase
        .from('environmental_conditions')
        .select('*')
        .eq('water_body_id', waterBodyId)
        .order('recorded_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0] as EnvironmentalCondition || null;
    },
    enabled: !!waterBodyId
  });
}

// Get fresh environmental data from API
export function useFreshEnvironmentalData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ waterBodyId, forceRefresh = false }: { waterBodyId: string; forceRefresh?: boolean }) => {
      const { data, error } = await supabase.functions.invoke('environmental-data', {
        body: { waterBodyId, forceRefresh }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch environmental conditions
      queryClient.invalidateQueries({ queryKey: ['environmental_conditions', variables.waterBodyId] });
      queryClient.invalidateQueries({ queryKey: ['solunar_forecast', variables.waterBodyId] });
    }
  });
}

// Get solunar forecast for a water body
export function useSolunarForecast(waterBodyId: string | null, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['solunar_forecast', waterBodyId, targetDate],
    queryFn: async () => {
      if (!waterBodyId) return null;
      
      const { data, error } = await supabase
        .from('solunar_forecasts')
        .select('*')
        .eq('water_body_id', waterBodyId)
        .eq('date', targetDate)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found errors
      return data as SolunarForecast || null;
    },
    enabled: !!waterBodyId
  });
}

// Get user environmental reports for a water body
export function useUserEnvironmentalReports(waterBodyId: string | null) {
  return useQuery({
    queryKey: ['user_environmental_reports', waterBodyId],
    queryFn: async () => {
      if (!waterBodyId) return [];
      
      // First get the reports
      const { data: reports, error } = await supabase
        .from('user_environmental_reports')
        .select('*')
        .eq('water_body_id', waterBodyId)
        .order('reported_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      if (!reports || reports.length === 0) return [];

      // Then get the profile data for these users
      const userIds = reports.map(r => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      return reports.map(report => ({
        ...report,
        profiles: profiles?.find(p => p.user_id === report.user_id) || null
      })) as (UserEnvironmentalReport & { profiles: { name: string; avatar_url?: string } | null })[];
    },
    enabled: !!waterBodyId
  });
}

// Submit user environmental report
export function useSubmitEnvironmentalReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: Omit<UserEnvironmentalReport, 'id' | 'reported_at' | 'verified'>) => {
      const { data, error } = await supabase
        .from('user_environmental_reports')
        .insert(report)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user_environmental_reports', data.water_body_id] });
    }
  });
}

// Get environmental alerts for a water body
export function useEnvironmentalAlerts(waterBodyId: string | null) {
  return useQuery({
    queryKey: ['environmental_alerts', waterBodyId],
    queryFn: async () => {
      if (!waterBodyId) return [];
      
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('environmental_alerts')
        .select('*')
        .eq('water_body_id', waterBodyId)
        .lte('active_from', now)
        .or(`active_until.is.null,active_until.gte.${now}`)
        .order('severity', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!waterBodyId
  });
}

// Get weather condition emoji and description
export function getWeatherDisplay(condition: string) {
  const weatherMap: Record<string, { emoji: string; description: string }> = {
    clear: { emoji: '☀️', description: 'Clear' },
    clouds: { emoji: '☁️', description: 'Cloudy' },
    rain: { emoji: '🌧️', description: 'Rainy' },
    drizzle: { emoji: '🌦️', description: 'Drizzle' },
    thunderstorm: { emoji: '⛈️', description: 'Thunderstorm' },
    snow: { emoji: '❄️', description: 'Snow' },
    mist: { emoji: '🌫️', description: 'Misty' },
    fog: { emoji: '🌫️', description: 'Foggy' }
  };
  
  return weatherMap[condition.toLowerCase()] || { emoji: '🌤️', description: 'Mixed' };
}

// Get moon phase emoji and description
export function getMoonPhaseDisplay(phase: number) {
  if (phase < 0.1 || phase > 0.9) return { emoji: '🌑', description: 'New Moon' };
  if (phase < 0.3) return { emoji: '🌒', description: 'Waxing Crescent' };
  if (phase < 0.4) return { emoji: '🌓', description: 'First Quarter' };
  if (phase < 0.6) return { emoji: '🌔', description: 'Waxing Gibbous' };
  if (phase < 0.7) return { emoji: '🌕', description: 'Full Moon' };
  if (phase < 0.8) return { emoji: '🌖', description: 'Waning Gibbous' };
  if (phase < 0.9) return { emoji: '🌗', description: 'Last Quarter' };
  return { emoji: '🌘', description: 'Waning Crescent' };
}

// Get solunar rating display
export function getSolunarRatingDisplay(rating: number) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const descriptions = {
    1: 'Poor',
    2: 'Fair', 
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };
  
  return {
    stars,
    description: descriptions[rating as keyof typeof descriptions] || 'Unknown',
    color: rating >= 4 ? 'text-green-600' : rating >= 3 ? 'text-yellow-600' : 'text-red-600'
  };
}