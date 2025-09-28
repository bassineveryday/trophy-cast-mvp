import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHealth } from "@/lib/api";
import { Activity } from "lucide-react";

export function DevHealthButton() {
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleHealthCheck = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHealth();
      setHealthData(data);
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleHealthCheck}
        disabled={isLoading}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        size="icon"
      >
        <Activity className="h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-16 right-4 z-50 w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Health Check</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            {error ? (
              <div className="text-destructive text-xs">{error}</div>
            ) : (
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}