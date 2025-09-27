import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import App from '@/App';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock the UniversalHeader and BottomNavigation components
vi.mock('@/components/UniversalHeader', () => ({
  UniversalHeader: () => <div data-testid="universal-header">Header</div>
}));

vi.mock('@/components/BottomNavigation', () => ({
  BottomNavigation: () => <div data-testid="bottom-navigation">Bottom Nav</div>
}));

// Mock AuthPage to avoid complex auth setup
vi.mock('@/features/auth/AuthPage', () => ({
  default: () => <div data-testid="auth-page">Auth Page</div>
}));

// Mock HomeDashboard to avoid complex dashboard setup
vi.mock('@/features/home/HomeDashboard', () => ({
  default: () => <div data-testid="home-dashboard">Home Dashboard</div>
}));

// Mock ProtectedRoute to avoid auth checks
vi.mock('@/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock MainLayout to avoid complex layout setup
vi.mock('@/layouts/MainLayout', () => ({
  MainLayout: () => <div data-testid="main-layout">Main Layout</div>
}));

// Create a test wrapper with all necessary providers
const TestWrapper = ({ initialEntries = ['/'] }: { initialEntries?: string[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DemoModeProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <App />
            </MemoryRouter>
          </DemoModeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

describe('Router Chrome Conditional Rendering', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should show UniversalHeader and BottomNavigation on home route', () => {
    const { getByTestId } = render(<TestWrapper initialEntries={['/']} />);
    
    // Check that header and nav are present
    expect(getByTestId('universal-header')).toBeInTheDocument();
    expect(getByTestId('bottom-navigation')).toBeInTheDocument();
  });

  it('should hide UniversalHeader and BottomNavigation on auth route', () => {
    const { getByTestId, queryByTestId } = render(<TestWrapper initialEntries={['/auth']} />);
    
    // Check that auth page is rendered
    expect(getByTestId('auth-page')).toBeInTheDocument();
    
    // Check that header and nav are NOT present
    expect(queryByTestId('universal-header')).not.toBeInTheDocument();
    expect(queryByTestId('bottom-navigation')).not.toBeInTheDocument();
  });

  it('should hide UniversalHeader and BottomNavigation on nested auth routes', () => {
    const { queryByTestId } = render(<TestWrapper initialEntries={['/auth/forgot-password']} />);
    
    // Even though this route doesn't exist, it should still hide chrome due to /auth prefix
    expect(queryByTestId('universal-header')).not.toBeInTheDocument();
    expect(queryByTestId('bottom-navigation')).not.toBeInTheDocument();
  });

  it('should show UniversalHeader and BottomNavigation on protected routes', () => {
    const { getByTestId } = render(<TestWrapper initialEntries={['/profile']} />);
    
    // Check that header and nav are present on protected routes
    expect(getByTestId('universal-header')).toBeInTheDocument();
    expect(getByTestId('bottom-navigation')).toBeInTheDocument();
  });
});