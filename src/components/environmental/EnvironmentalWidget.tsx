import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, Gauge, Wind, Moon, RefreshCw, TrendingUp, AlertTriangle 
} from 'lucide-react';
import { 
  useEnvironmentalConditions, 
  useFreshEnvironmentalData,
  useSolunarForecast,
  getWeatherDisplay,
  getMoonPhaseDisplay,
  getSolunarRatingDisplay
} from '@/hooks/useEnvironmentalData';

interface EnvironmentalWidgetProps {
  waterBodyId: string;
  waterBodyName: string;
}

export function EnvironmentalWidget({ waterBodyId, waterBodyName }: EnvironmentalWidgetProps) {
  const { data: conditions, isLoading } = useEnvironmentalConditions(waterBodyId);
  const { data: solunarForecast } = useSolunarForecast(waterBodyId);
  const freshDataMutation = useFreshEnvironmentalData();

  const handleRefresh = () => {
    freshDataMutation.mutate({ waterBodyId, forceRefresh: true });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!conditions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environmental Conditions</CardTitle>
          <CardDescription>{waterBodyName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No environmental data available</p>
            <Button onClick={handleRefresh} disabled={freshDataMutation.isPending}>
              <RefreshCw className={`w-4 h-4 mr-2 ${freshDataMutation.isPending ? 'animate-spin' : ''}`} />
              Fetch Conditions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const weather = conditions.weather_condition ? getWeatherDisplay(conditions.weather_condition) : null;
  const moonPhase = conditions.moon_phase ? getMoonPhaseDisplay(conditions.moon_phase) : null;
  const solunar = conditions.solunar_rating ? getSolunarRatingDisplay(conditions.solunar_rating) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Environmental Conditions</CardTitle>
            <CardDescription>
              {waterBodyName} • Updated {new Date(conditions.recorded_at).toLocaleTimeString()}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={freshDataMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 ${freshDataMutation.isPending ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Thermometer className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-sm font-medium">{conditions.air_temperature}°F</div>
            <div className="text-xs text-muted-foreground">Air</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Thermometer className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-sm font-medium">{conditions.water_temperature}°F</div>
            <div className="text-xs text-muted-foreground">Water</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Gauge className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-sm font-medium">{conditions.barometric_pressure?.toFixed(1)}"</div>
            <div className="text-xs text-muted-foreground">Pressure</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Wind className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-sm font-medium">{conditions.wind_speed} mph</div>
            <div className="text-xs text-muted-foreground">Wind</div>
          </div>
        </div>

        {/* Weather & Moon Phase */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {weather && (
              <div className="flex items-center gap-2">
                <span className="text-xl">{weather.emoji}</span>
                <span className="text-sm font-medium">{weather.description}</span>
              </div>
            )}
            {moonPhase && (
              <div className="flex items-center gap-2">
                <span className="text-lg">{moonPhase.emoji}</span>
                <span className="text-xs text-muted-foreground">{moonPhase.description}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {conditions.humidity}% humidity
          </div>
        </div>

        {/* Solunar Rating */}
        {solunar && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span className="text-sm font-medium">Fishing Conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${solunar.color}`}>{solunar.stars}</span>
              <Badge variant="outline" className="text-xs">
                {solunar.description}
              </Badge>
            </div>
          </div>
        )}

        {/* Today's Solunar Periods */}
        {solunarForecast && (solunarForecast.major_period_1_start || solunarForecast.minor_period_1_start) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Today's Peak Times</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {solunarForecast.major_period_1_start && (
                <div className="p-2 bg-green-50 rounded text-center">
                  <div className="font-medium text-green-700">Major</div>
                  <div>{solunarForecast.major_period_1_start} - {solunarForecast.major_period_1_end}</div>
                </div>
              )}
              {solunarForecast.major_period_2_start && (
                <div className="p-2 bg-green-50 rounded text-center">
                  <div className="font-medium text-green-700">Major</div>
                  <div>{solunarForecast.major_period_2_start} - {solunarForecast.major_period_2_end}</div>
                </div>
              )}
              {solunarForecast.minor_period_1_start && (
                <div className="p-2 bg-yellow-50 rounded text-center">
                  <div className="font-medium text-yellow-700">Minor</div>
                  <div>{solunarForecast.minor_period_1_start} - {solunarForecast.minor_period_1_end}</div>
                </div>
              )}
              {solunarForecast.minor_period_2_start && (
                <div className="p-2 bg-yellow-50 rounded text-center">
                  <div className="font-medium text-yellow-700">Minor</div>
                  <div>{solunarForecast.minor_period_2_start} - {solunarForecast.minor_period_2_end}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data Source */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Source: {conditions.data_source}</span>
          <Badge variant="secondary" className="text-xs">
            {conditions.surface_temperature_source} water temp
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}