export default function TrustCenter() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Trust Center</h1>
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Privacy controls and data management coming in Phase 5.
        </p>
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">What's Coming:</h2>
          <ul className="space-y-2">
            <li>• AI Coach privacy controls</li>
            <li>• Community sharing preferences</li>
            <li>• Conservation data contributions</li>
            <li>• Data dashboard and export</li>
            <li>• Notification preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
