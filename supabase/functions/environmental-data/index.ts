import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  condition: string;
  precipitation: number;
}

interface SolunarData {
  moonPhase: number;
  sunrise: string;
  sunset: string;
  moonOverhead: string;
  moonUnderfoot: string;
  rating: number;
  majorPeriods: Array<{ start: string; end: string }>;
  minorPeriods: Array<{ start: string; end: string }>;
}

// Solunar calculation functions
function calculateMoonPhase(date: Date): number {
  // Simplified moon phase calculation
  // Returns 0-1 where 0 = new moon, 0.5 = full moon
  const baseDate = new Date('2000-01-06T18:14:00Z'); // Known new moon
  const daysSinceBase = (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53058867; // Average lunar month length
  const cycles = daysSinceBase / synodicMonth;
  const phase = cycles - Math.floor(cycles);
  return phase;
}

function calculateSunMoonTimes(lat: number, lon: number, date: Date) {
  // Simplified astronomical calculations
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Solar declination angle
  const solarDeclination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
  
  // Hour angle for sunrise/sunset
  const latRad = lat * Math.PI / 180;
  const declRad = solarDeclination * Math.PI / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declRad)) * 180 / Math.PI;
  
  // Calculate sunrise and sunset times
  const solarNoon = 12 - (lon / 15);
  const sunrise = solarNoon - (hourAngle / 15);
  const sunset = solarNoon + (hourAngle / 15);
  
  // Moon times (simplified - real calculation would be much more complex)
  const moonPhase = calculateMoonPhase(date);
  const moonOffsetHours = moonPhase * 24; // Simplified moon timing
  
  const moonOverhead = (12 + moonOffsetHours) % 24;
  const moonUnderfoot = (moonOverhead + 12) % 24;
  
  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
    moonOverhead: formatTime(moonOverhead),
    moonUnderfoot: formatTime(moonUnderfoot)
  };
}

function formatTime(hours: number): string {
  const h = Math.floor(hours) % 24;
  const m = Math.floor((hours - Math.floor(hours)) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function calculateSolunarRating(moonPhase: number, sunMoonTimes: any): number {
  // Rate fishing conditions based on moon phase and timing
  // Full moon and new moon get higher ratings
  const phaseScore = 1 - Math.abs(moonPhase - 0.5) * 2; // Higher for full/new moon
  
  // Additional factors could include weather, barometric pressure changes, etc.
  const baseRating = Math.floor(phaseScore * 3) + 2; // 2-5 scale
  
  return Math.min(5, Math.max(1, baseRating));
}

function calculateSolunarPeriods(sunMoonTimes: any): { majorPeriods: Array<{ start: string; end: string }>; minorPeriods: Array<{ start: string; end: string }> } {
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h + m / 60;
  };
  
  const formatTimeFromHours = (hours: number) => {
    const h = Math.floor(hours) % 24;
    const m = Math.floor((hours - Math.floor(hours)) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  
  const moonOverheadTime = parseTime(sunMoonTimes.moonOverhead);
  const moonUnderfootTime = parseTime(sunMoonTimes.moonUnderfoot);
  const sunriseTime = parseTime(sunMoonTimes.sunrise);
  const sunsetTime = parseTime(sunMoonTimes.sunset);
  
  // Major periods: 2 hours centered on moon overhead/underfoot
  const majorPeriods = [
    {
      start: formatTimeFromHours(moonOverheadTime - 1),
      end: formatTimeFromHours(moonOverheadTime + 1)
    },
    {
      start: formatTimeFromHours(moonUnderfootTime - 1),
      end: formatTimeFromHours(moonUnderfootTime + 1)
    }
  ];
  
  // Minor periods: 1 hour centered on sunrise/sunset
  const minorPeriods = [
    {
      start: formatTimeFromHours(sunriseTime - 0.5),
      end: formatTimeFromHours(sunriseTime + 0.5)
    },
    {
      start: formatTimeFromHours(sunsetTime - 0.5),
      end: formatTimeFromHours(sunsetTime + 0.5)
    }
  ];
  
  return { majorPeriods, minorPeriods };
}

async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
  if (!apiKey) {
    console.error('OpenWeatherMap API key not found');
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );
    
    if (!response.ok) {
      console.error('Weather API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      pressure: Math.round(data.main.pressure * 0.02953), // Convert hPa to inHg
      windSpeed: Math.round(data.wind.speed),
      windDirection: data.wind.deg || 0,
      cloudCover: data.clouds.all,
      condition: data.weather[0].main.toLowerCase(),
      precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function calculateWaterTemperature(airTemp: number, season: string): number {
  // Estimate water temperature based on air temperature and season
  // This is a simplified calculation - real sensors would be more accurate
  const seasonMultipliers = {
    spring: 0.7,
    summer: 0.85,
    fall: 0.75,
    winter: 0.6
  };
  
  const multiplier = seasonMultipliers[season as keyof typeof seasonMultipliers] || 0.75;
  const baseWaterTemp = airTemp * multiplier;
  
  // Add some seasonal offset
  const seasonOffsets = {
    spring: -5,
    summer: 2,
    fall: 0,
    winter: -8
  };
  
  const offset = seasonOffsets[season as keyof typeof seasonOffsets] || 0;
  return Math.round(baseWaterTemp + offset);
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { waterBodyId, forceRefresh = false } = await req.json();
    
    if (!waterBodyId) {
      return new Response(
        JSON.stringify({ error: 'Water body ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get water body details
    const { data: waterBody, error: waterBodyError } = await supabase
      .from('water_bodies')
      .select('*')
      .eq('id', waterBodyId)
      .single();

    if (waterBodyError || !waterBody) {
      console.error('Water body error:', waterBodyError);
      return new Response(
        JSON.stringify({ error: 'Water body not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for recent environmental data (within last hour)
    if (!forceRefresh) {
      const { data: recentData } = await supabase
        .from('environmental_conditions')
        .select('*')
        .eq('water_body_id', waterBodyId)
        .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(1);

      if (recentData && recentData.length > 0) {
        console.log('Returning cached environmental data');
        return new Response(
          JSON.stringify({ 
            environmentalData: recentData[0],
            source: 'cached'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`Fetching fresh environmental data for ${waterBody.name}`);

    // Fetch weather data
    const weatherData = await fetchWeatherData(
      parseFloat(waterBody.latitude),
      parseFloat(waterBody.longitude)
    );

    if (!weatherData) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch weather data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate solunar data
    const currentDate = new Date();
    const moonPhase = calculateMoonPhase(currentDate);
    const sunMoonTimes = calculateSunMoonTimes(
      parseFloat(waterBody.latitude),
      parseFloat(waterBody.longitude),
      currentDate
    );
    const solunarRating = calculateSolunarRating(moonPhase, sunMoonTimes);
    const solunarPeriods = calculateSolunarPeriods(sunMoonTimes);

    // Estimate water temperature
    const currentSeason = getCurrentSeason();
    const estimatedWaterTemp = calculateWaterTemperature(weatherData.temperature, currentSeason);

    // Store environmental data
    const environmentalData = {
      water_body_id: waterBodyId,
      air_temperature: weatherData.temperature,
      water_temperature: estimatedWaterTemp,
      barometric_pressure: weatherData.pressure,
      humidity: weatherData.humidity,
      wind_speed: weatherData.windSpeed,
      wind_direction: weatherData.windDirection,
      cloud_cover: weatherData.cloudCover,
      precipitation: weatherData.precipitation,
      weather_condition: weatherData.condition,
      moon_phase: moonPhase,
      moon_overhead_time: `${currentDate.toISOString().split('T')[0]}T${sunMoonTimes.moonOverhead}:00Z`,
      moon_underfoot_time: `${currentDate.toISOString().split('T')[0]}T${sunMoonTimes.moonUnderfoot}:00Z`,
      sunrise_time: `${currentDate.toISOString().split('T')[0]}T${sunMoonTimes.sunrise}:00Z`,
      sunset_time: `${currentDate.toISOString().split('T')[0]}T${sunMoonTimes.sunset}:00Z`,
      solunar_rating: solunarRating,
      surface_temperature_source: 'estimated',
      data_source: 'api'
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('environmental_conditions')
      .insert(environmentalData)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting environmental data:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store environmental data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store solunar forecast for today
    const todayDate = currentDate.toISOString().split('T')[0];
    const solunarForecast = {
      water_body_id: waterBodyId,
      date: todayDate,
      major_period_1_start: solunarPeriods.majorPeriods[0].start,
      major_period_1_end: solunarPeriods.majorPeriods[0].end,
      major_period_2_start: solunarPeriods.majorPeriods[1].start,
      major_period_2_end: solunarPeriods.majorPeriods[1].end,
      minor_period_1_start: solunarPeriods.minorPeriods[0].start,
      minor_period_1_end: solunarPeriods.minorPeriods[0].end,
      minor_period_2_start: solunarPeriods.minorPeriods[1].start,
      minor_period_2_end: solunarPeriods.minorPeriods[1].end,
      overall_rating: solunarRating,
      sunrise: sunMoonTimes.sunrise,
      sunset: sunMoonTimes.sunset,
      moon_phase: moonPhase
    };

    // Upsert solunar forecast (insert or update if exists)
    await supabase
      .from('solunar_forecasts')
      .upsert(solunarForecast, { onConflict: 'water_body_id,date' });

    console.log(`Environmental data updated for ${waterBody.name}`);

    return new Response(
      JSON.stringify({
        environmentalData: insertedData,
        solunarForecast,
        source: 'fresh'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in environmental-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});