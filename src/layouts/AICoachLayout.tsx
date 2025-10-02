import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Compass } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export function AICoachLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/ai-coach', label: 'Overview', icon: Home },
    { path: '/ai-coach/pre-trip', label: 'Pre-Trip', icon: MapPin },
    { path: '/ai-coach/at-lake', label: 'At Lake', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader title="AI Coach" />

      <div className="flex">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex flex-col w-64 border-r min-h-screen p-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
