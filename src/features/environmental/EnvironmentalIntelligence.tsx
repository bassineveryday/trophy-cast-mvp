import React from 'react';
import { EnvironmentalDashboard } from '@/components/environmental/EnvironmentalDashboard';

export default function EnvironmentalIntelligence() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Environmental Intelligence</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time weather conditions, solunar forecasts, and water quality data to optimize your fishing success.
          </p>
        </div>
        
        <EnvironmentalDashboard />
      </div>
    </div>
  );
}