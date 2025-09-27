import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { coreNavItems, overflowNavItems } from "@/config/navItems";

export const BottomNavigation = () => {
  const location = useLocation();
  const items = [...coreNavItems, ...overflowNavItems];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.id}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className="mb-1">
                {item.icon()}
              </div>
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};