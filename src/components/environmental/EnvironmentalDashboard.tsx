import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, Thermometer, Droplets, Wind, Eye, Gauge, 
  Moon, Sun, Clock, TrendingUp, AlertTriangle, Users
} from 'lucide-react';
import { 
  useWaterBodies, 
  useEnvironmentalConditions, 
  useFreshEnvironmentalData,
  useSolunarForecast,
  useUserEnvironmentalReports,
  useEnvironmentalAlerts,
  getWeatherDisplay,
  getMoonPhaseDisplay,
  getSolunarRatingDisplay
} from '@/hooks/useEnvironmentalData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface EnvironmentalDashboardProps {
  waterBodyId?: string;
  onWaterBodyChange?: (waterBodyId: string) => void;
  compact?: boolean;
}

export function EnvironmentalDashboard({ 
  waterBodyId: propWaterBodyId, 
  onWaterBodyChange,
  compact = false 
}: EnvironmentalDashboardProps) {
  const [selectedWaterBodyId, setSelectedWaterBodyId] = useState<string | null>(propWaterBodyId || null);
  const currentWaterBodyId = propWaterBodyId || selectedWaterBodyId;

  const { data: waterBodies, isLoading: waterBodiesLoading } = useWaterBodies();
  const { data: conditions, isLoading: conditionsLoading } = useEnvironmentalConditions(currentWaterBodyId);
  const { data: solunarForecast } = useSolunarForecast(currentWaterBodyId);
  const { data: userReports } = useUserEnvironmentalReports(currentWaterBodyId);
  const { data: alerts } = useEnvironmentalAlerts(currentWaterBodyId);
  const freshDataMutation = useFreshEnvironmentalData();

  const selectedWaterBody = waterBodies?.find(wb => wb.id === currentWaterBodyId);

  const handleWaterBodyChange = (waterBodyId: string) => {
    setSelectedWaterBodyId(waterBodyId);
    onWaterBodyChange?.(waterBodyId);
  };

  const handleRefresh = () => {
    if (currentWaterBodyId) {
      freshDataMutation.mutate({ waterBodyId: currentWaterBodyId, forceRefresh: true });
    }
  };

  if (waterBodiesLoading) {
    return <LoadingSpinner message="Loading water bodies..." />;
  }

  if (!waterBodies || waterBodies.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No water bodies found. Please add water bodies to start tracking environmental conditions.
        </AlertDescription>
      </Alert>
    );
  }

  // Compact view for embedding in other components
  if (compact && conditions) {
    const weather = conditions.weather_condition ? getWeatherDisplay(conditions.weather_condition) : null;
    const moonPhase = conditions.moon_phase ? getMoonPhaseDisplay(conditions.moon_phase) : null;
    const solunar = conditions.solunar_rating ? getSolunarRatingDisplay(conditions.solunar_rating) : null;

    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{selectedWaterBody?.name}</CardTitle>
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span>{conditions.air_temperature}°F / {conditions.water_temperature}°F</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span>{conditions.barometric_pressure?.toFixed(1)}" Hg</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <span>{conditions.wind_speed} mph</span>
            </div>
            <div className="flex items-center gap-2">
              {weather && <span className="text-lg">{weather.emoji}</span>}
              <span>{weather?.description}</span>
            </div>
          </div>
          
          {solunar && (
            <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <span className="text-sm font-medium">Fishing Conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${solunar.color}`}>{solunar.stars}</span>
                <span className="text-xs text-muted-foreground">{solunar.description}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Water Body Selection */}
      {!propWaterBodyId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Water Body</CardTitle>
            <CardDescription>Choose a lake or reservoir to view environmental conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={currentWaterBodyId || ''} onValueChange={handleWaterBodyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a water body..." />
              </SelectTrigger>
              <SelectContent>
                {waterBodies.map((wb) => (
                  <SelectItem key={wb.id} value={wb.id}>
                    {wb.name}, {wb.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {currentWaterBodyId && (
        <>
          {/* Environmental Alerts */}
          {alerts && alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={
                  alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{alert.title}</strong>: {alert.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Main Environmental Data */}
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="solunar">Solunar</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            {/* Current Conditions Tab */}
            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedWaterBody?.name}</CardTitle>
                      <CardDescription>
                        Current environmental conditions
                        {conditions && (
                          <span className="ml-2 text-xs">
                            Updated {new Date(conditions.recorded_at).toLocaleString()}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      disabled={freshDataMutation.isPending}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${freshDataMutation.isPending ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {conditionsLoading ? (
                    <LoadingSpinner message="Loading conditions..." />
                  ) : conditions ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Temperature */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-5 h-5 text-red-500" />
                          <span className="font-medium">Temperature</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Air</span>
                            <span className="font-medium">{conditions.air_temperature}°F</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Water</span>
                            <span className="font-medium">{conditions.water_temperature}°F</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {conditions.surface_temperature_source}
                          </Badge>
                        </div>
                      </div>

                      {/* Pressure & Humidity */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">Pressure</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Barometric</span>
                            <span className="font-medium">{conditions.barometric_pressure?.toFixed(2)}" Hg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Humidity</span>
                            <span className="font-medium">{conditions.humidity}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Wind */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Wind className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">Wind</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Speed</span>
                            <span className="font-medium">{conditions.wind_speed} mph</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Direction</span>
                            <span className="font-medium">{conditions.wind_direction}°</span>
                          </div>
                        </div>
                      </div>

                      {/* Weather */}
                      {conditions.weather_condition && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-green-500" />
                            <span className="font-medium">Weather</span>
                          </div>
                          <div className="space-y-1">
                            {(() => {
                              const weather = getWeatherDisplay(conditions.weather_condition);
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{weather.emoji}</span>
                                  <span className="font-medium">{weather.description}</span>
                                </div>
                              );
                            })()}
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Cloud Cover</span>
                              <span className="font-medium">{conditions.cloud_cover}%</span>
                            </div>
                            {conditions.precipitation > 0 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Precipitation</span>
                                <span className="font-medium">{conditions.precipitation}"</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Water Conditions */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Water</span>
                        </div>
                        <div className="space-y-1">
                          {conditions.water_clarity && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Clarity</span>
                              <span className="font-medium capitalize">{conditions.water_clarity}</span>
                            </div>
                          )}
                          {conditions.water_level && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Level</span>
                              <span className="font-medium capitalize">{conditions.water_level}</span>
                            </div>
                          )}
                          {conditions.current_flow && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Flow</span>
                              <span className="font-medium capitalize">{conditions.current_flow}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Moon Phase */}
                      {conditions.moon_phase !== null && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Moon className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">Moon Phase</span>
                          </div>
                          {(() => {
                            const moonPhase = getMoonPhaseDisplay(conditions.moon_phase);
                            return (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{moonPhase.emoji}</span>
                                <span className="font-medium">{moonPhase.description}</span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No environmental data available. Click refresh to fetch current conditions.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Solunar Tab */}
            <TabsContent value="solunar">
              <SolunarTab 
                solunarForecast={solunarForecast} 
                conditions={conditions}
                waterBodyName={selectedWaterBody?.name}
              />
            </TabsContent>

            {/* User Reports Tab */}
            <TabsContent value="reports">
              <UserReportsTab 
                userReports={userReports || []} 
                waterBodyId={currentWaterBodyId}
                waterBodyName={selectedWaterBody?.name}
              />
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast">
              <Card>
                <CardHeader>
                  <CardTitle>Extended Forecast</CardTitle>
                  <CardDescription>5-day environmental and solunar forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Extended forecast feature coming soon. Will include 5-day weather, solunar ratings, and fishing predictions.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

// Solunar Tab Component
function SolunarTab({ solunarForecast, conditions, waterBodyName }: any) {
  if (!solunarForecast && !conditions?.solunar_rating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solunar Forecast</CardTitle>
          <CardDescription>Optimal fishing times based on sun and moon positions</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              No solunar data available. Environmental data needs to be fetched first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const rating = conditions?.solunar_rating || solunarForecast?.overall_rating;
  const solunarDisplay = rating ? getSolunarRatingDisplay(rating) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solunar Forecast</CardTitle>
        <CardDescription>
          Optimal fishing times for {waterBodyName} - {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        {solunarDisplay && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl mb-2">{solunarDisplay.stars}</div>
            <div className={`text-lg font-medium ${solunarDisplay.color}`}>
              {solunarDisplay.description} Fishing Conditions
            </div>
          </div>
        )}

        {/* Sun Times */}
        {(solunarForecast?.sunrise || conditions?.sunrise_time) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Sun Times</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunrise</span>
                <span className="font-medium">
                  {solunarForecast?.sunrise || 
                   (conditions?.sunrise_time ? new Date(conditions.sunrise_time).toLocaleTimeString('en-US', { 
                     hour: '2-digit', 
                     minute: '2-digit',
                     hour12: true 
                   }) : 'N/A')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunset</span>
                <span className="font-medium">
                  {solunarForecast?.sunset || 
                   (conditions?.sunset_time ? new Date(conditions.sunset_time).toLocaleTimeString('en-US', { 
                     hour: '2-digit', 
                     minute: '2-digit',
                     hour12: true 
                   }) : 'N/A')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Solunar Periods */}
        {solunarForecast && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">Peak Activity Periods</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Major Periods */}
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">Major Periods</h4>
                <div className="space-y-2">
                  {solunarForecast.major_period_1_start && (
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Period 1</span>
                      <span className="font-medium">
                        {solunarForecast.major_period_1_start} - {solunarForecast.major_period_1_end}
                      </span>
                    </div>
                  )}
                  {solunarForecast.major_period_2_start && (
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Period 2</span>
                      <span className="font-medium">
                        {solunarForecast.major_period_2_start} - {solunarForecast.major_period_2_end}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Minor Periods */}
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-600">Minor Periods</h4>
                <div className="space-y-2">
                  {solunarForecast.minor_period_1_start && (
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span>Period 1</span>
                      <span className="font-medium">
                        {solunarForecast.minor_period_1_start} - {solunarForecast.minor_period_1_end}
                      </span>
                    </div>
                  )}
                  {solunarForecast.minor_period_2_start && (
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span>Period 2</span>
                      <span className="font-medium">
                        {solunarForecast.minor_period_2_start} - {solunarForecast.minor_period_2_end}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Major periods</strong> (2 hours) indicate peak fish activity. <strong>Minor periods</strong> (1 hour) show moderate activity. Times are based on moon and sun positions.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// User Reports Tab Component
function UserReportsTab({ userReports, waterBodyId, waterBodyName }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reports</CardTitle>
        <CardDescription>
          Crowd-sourced water conditions for {waterBodyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userReports.length > 0 ? (
          <div className="space-y-4">
            {userReports.map((report: any) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{report.profiles?.name || 'Anonymous'}</span>
                    {report.verified && (
                      <Badge variant="default" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(report.reported_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {report.water_temperature && (
                    <div>
                      <span className="text-muted-foreground">Water Temp:</span>
                      <span className="ml-1 font-medium">{report.water_temperature}°F</span>
                    </div>
                  )}
                  {report.water_clarity && (
                    <div>
                      <span className="text-muted-foreground">Clarity:</span>
                      <span className="ml-1 font-medium capitalize">{report.water_clarity}</span>
                    </div>
                  )}
                  {report.water_level && (
                    <div>
                      <span className="text-muted-foreground">Level:</span>
                      <span className="ml-1 font-medium capitalize">{report.water_level}</span>
                    </div>
                  )}
                  {report.fishing_conditions && (
                    <div>
                      <span className="text-muted-foreground">Fishing:</span>
                      <span className="ml-1 font-medium capitalize">{report.fishing_conditions}</span>
                    </div>
                  )}
                </div>
                
                {report.weather_notes && (
                  <p className="text-sm text-muted-foreground italic">
                    "{report.weather_notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              No user reports yet. Be the first to share water conditions for this location!
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Users className="w-4 h-4 mr-2" />
            Submit Water Condition Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}