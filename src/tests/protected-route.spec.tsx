import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useRoles';

// Mock the hooks
vi.mock('@/contexts/AuthContext');
vi.mock('@/hooks/useRoles');

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard', search: '?tab=overview' }),
  };
});

// Mock LoadingSpinner
vi.mock('@/components/LoadingSpinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => <div data-testid="loading-spinner">{message}</div>
}));

const mockUseAuth = useAuth as Mock;
const mockUseUserRoles = useUserRoles as Mock;

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

const renderWithRouter = (children: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('unauthenticated user', () => {
    it('should redirect to auth with redirect query param', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });
      mockUseUserRoles.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { queryByTestId } = renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        '/auth?redirect=%2Fdashboard%3Ftab%3Doverview',
        { replace: true }
      );
      expect(queryByTestId('protected-content')).toBeNull();
    });
  });

  describe('loading state', () => {
    it('should render loading spinner when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });
      mockUseUserRoles.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { getByTestId, queryByTestId } = renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(getByTestId('loading-spinner')).toBeDefined();
      expect(getByTestId('loading-spinner').textContent).toBe('Loading...');
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(queryByTestId('protected-content')).toBeNull();
    });

    it('should render loading spinner when roles are loading', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-1', email: 'test@example.com' },
        loading: false,
      });
      mockUseUserRoles.mockReturnValue({
        data: [],
        isLoading: true,
      });

      const { getByTestId, queryByTestId } = renderWithRouter(
        <ProtectedRoute roles={['admin']}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(getByTestId('loading-spinner')).toBeDefined();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(queryByTestId('protected-content')).toBeNull();
    });
  });

  describe('authenticated user', () => {
    it('should render children when user is authenticated and no roles required', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-1', email: 'test@example.com' },
        loading: false,
      });
      mockUseUserRoles.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { getByTestId } = renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(getByTestId('protected-content')).toBeDefined();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render children when user has required role', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-1', email: 'test@example.com' },
        loading: false,
      });
      mockUseUserRoles.mockReturnValue({
        data: [
          { id: '1', user_id: 'user-1', role: 'admin', club_id: null, created_at: '2024-01-01' }
        ],
        isLoading: false,
      });

      const { getByTestId } = renderWithRouter(
        <ProtectedRoute roles={['admin', 'club_officer']}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(getByTestId('protected-content')).toBeDefined();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('role access denied', () => {
    it('should redirect to auth with forbidden reason when user lacks required role', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-1', email: 'test@example.com' },
        loading: false,
      });
      mockUseUserRoles.mockReturnValue({
        data: [
          { id: '1', user_id: 'user-1', role: 'member', club_id: null, created_at: '2024-01-01' }
        ],
        isLoading: false,
      });

      const { queryByTestId } = renderWithRouter(
        <ProtectedRoute roles={['admin', 'club_officer']}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        '/auth?reason=forbidden&redirect=%2Fdashboard%3Ftab%3Doverview',
        { replace: true }
      );
      expect(queryByTestId('protected-content')).toBeNull();
    });

    it('should redirect when user has no roles but roles are required', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-1', email: 'test@example.com' },
        loading: false,
      });
      mockUseUserRoles.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { queryByTestId } = renderWithRouter(
        <ProtectedRoute roles={['admin']}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        '/auth?reason=forbidden&redirect=%2Fdashboard%3Ftab%3Doverview',
        { replace: true }
      );
      expect(queryByTestId('protected-content')).toBeNull();
    });
  });
});