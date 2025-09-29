import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-deep-navy text-sand p-6">
      <h1 className="text-4xl font-heading font-bold text-trophy-gold mb-4">Trophy Cast</h1>
      <p className="text-lg mb-8">Where Every Cast Counts</p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link to="/host/new-tournament">
          <Button className="w-full">🎣 Host Tournament</Button>
        </Link>
        <Link to="/catch/log">
          <Button className="w-full" variant="secondary">🐟 Log Catch</Button>
        </Link>
        <Link to="/leaderboard">
          <Button className="w-full" variant="outline">🏆 Leaderboard</Button>
        </Link>
        <Link to="/profile/me">
          <Button className="w-full" variant="ghost">👤 My Profile</Button>
        </Link>
      </div>
    </div>
  );
}
