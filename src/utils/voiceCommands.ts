export const parseVoiceCommand = (phrase: string): {
  type: string;
  value?: string;
  action?: string;
} | null => {
  const normalized = phrase.toLowerCase().trim();
  
  // Navigation commands
  if (normalized.includes("quick plan") || normalized.includes("show plan")) {
    return { type: "navigate", action: "plan" };
  }
  
  if (normalized.includes("at the ramp") || normalized.includes("refine at") || normalized.includes("at ramp")) {
    return { type: "navigate", action: "at-ramp" };
  }
  
  if (normalized.includes("summary") || normalized.includes("show summary")) {
    return { type: "navigate", action: "summary" };
  }
  
  // Temperature commands
  const tempMatch = normalized.match(/temp(?:erature)?\s+(?:to\s+)?(\d+)/);
  if (tempMatch) {
    const temp = parseInt(tempMatch[1]);
    if (temp < 62) {
      return { type: "temp", value: "<62°F" };
    } else if (temp > 65) {
      return { type: "temp", value: ">65°F" };
    } else {
      return { type: "temp", value: "62–65°F" };
    }
  }
  
  // Wind commands
  if (normalized.includes("wind") && (normalized.includes("west") || normalized.includes("w "))) {
    const windMatch = normalized.match(/(?:west|w)\s+(?:at\s+)?(\d+)/);
    if (windMatch) {
      const speed = parseInt(windMatch[1]);
      return { type: "wind", value: `W ${Math.max(5, speed - 2)}–${speed + 3}` };
    }
  }
  
  // Water clarity commands
  if (normalized.includes("muddy") || normalized.includes("mud")) {
    return { type: "clarity", value: "muddy" };
  }
  
  if (normalized.includes("clear")) {
    return { type: "clarity", value: "clear" };
  }
  
  // Starting area commands
  if (normalized.includes("rocky point") || normalized.includes("rocky") || normalized.includes("points")) {
    return { type: "start-area", value: "rocky point" };
  }
  
  // Target size commands
  if (normalized.includes("big fish") || normalized.includes("swing for big")) {
    return { type: "target", value: "big" };
  }
  
  if (normalized.includes("numbers") || normalized.includes("many fish")) {
    return { type: "target", value: "numbers" };
  }
  
  // Lure commands
  if (normalized.includes("spinnerbait") && normalized.includes("jig")) {
    return { type: "lures", value: "spinnerbait+jig" };
  }
  
  if (normalized.includes("spinnerbait")) {
    return { type: "lures", value: "spinnerbait" };
  }
  
  if (normalized.includes("jig")) {
    return { type: "lures", value: "jig" };
  }
  
  // Action commands
  if (normalized.includes("save") || normalized.includes("save to plan")) {
    return { type: "action", value: "save" };
  }
  
  return null;
};

// Sample phrases for demo
export const samplePhrases = [
  "Log catch five point two pounds on spinnerbait.",
  "Show leaderboard.",
  "Who's leading AOY?",
  "Caught a four pounder on chatterbait, private.",
  "Post to Close Friends.",
  "Create share card.",
  "Show big bass standings.",
  "Log catch three pounds on crankbait, post to club.",
  "Send message to Jake.",
  "Check club inbox."
];