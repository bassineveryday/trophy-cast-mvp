import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Clock, Fish } from "lucide-react";

export const BestWindowSlider = () => {
  const [timeValue, setTimeValue] = useState([480]); // 8 AM in minutes from midnight

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const getTimeWindow = (minutes: number) => {
    if (minutes < 540) { // Before 9 AM
      return {
        title: "Morning Window",
        description: "Topwater window — look for shad flickers on grass.",
        color: "text-amber-600",
        bgColor: "bg-amber-50"
      };
    } else if (minutes < 780) { // 9 AM - 1 PM
      return {
        title: "Prime Time",
        description: "Primary spinnerbait bite on grass edges, best with steady wind.",
        color: "text-fishing-green",
        bgColor: "bg-fishing-green/10"
      };
    } else { // After 1 PM
      return {
        title: "Afternoon Grind",
        description: "Slow down with jig on rocky points as sun gets high.",
        color: "text-water-blue",
        bgColor: "bg-water-blue/10"
      };
    }
  };

  const currentWindow = getTimeWindow(timeValue[0]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Time</span>
          <span className="text-sm text-muted-foreground">{minutesToTime(timeValue[0])}</span>
        </div>
        
        <div className="relative px-2">
          <Slider
            value={timeValue}
            onValueChange={setTimeValue}
            min={360} // 6 AM
            max={900} // 3 PM
            step={30}
            className="w-full"
          />
          
          {/* Time markers */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
            <span>6 AM</span>
            <span>9 AM</span>
            <span>12 PM</span>
            <span>3 PM</span>
          </div>
          
          {/* Fishing bobber thumb */}
          <div 
            className="absolute top-0 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
            style={{ 
              left: `${((timeValue[0] - 360) / (900 - 360)) * 100}%`,
              top: '8px'
            }}
          >
            <Fish className="w-2 h-2 text-white" />
          </div>
        </div>
      </div>

      {/* Time Window Description */}
      <div className={`p-3 rounded-lg ${currentWindow.bgColor}`}>
        <div className="flex items-center space-x-2 mb-1">
          <Clock className={`w-4 h-4 ${currentWindow.color}`} />
          <span className={`text-sm font-medium ${currentWindow.color}`}>
            {currentWindow.title}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentWindow.description}
        </p>
      </div>
    </div>
  );
};