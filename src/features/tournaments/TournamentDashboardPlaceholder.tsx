export default function TournamentDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tournament Dashboard</h1>
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Tournament management features coming in Phase 3.
        </p>
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">What's Coming:</h2>
          <ul className="space-y-2">
            <li>• View and register for tournaments</li>
            <li>• Create club tournaments</li>
            <li>• Live leaderboards</li>
            <li>• Tournament feed and updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
