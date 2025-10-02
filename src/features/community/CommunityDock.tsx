export default function CommunityDock() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Community Dock</h1>
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Community channels and discussion features coming in Phase 4.
        </p>
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">What's Coming:</h2>
          <ul className="space-y-2">
            <li>• Discord-style channels</li>
            <li>• Real-time messaging</li>
            <li>• Gear Talk, Beginners Corner, Regional channels</li>
            <li>• AI moderation for community safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
