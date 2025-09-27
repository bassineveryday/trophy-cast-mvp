import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error for admin monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In a real app, you might send this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Mock error logging - in real app would send to service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    localStorage.setItem(`error_${Date.now()}`, JSON.stringify(errorReport));
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We've encountered an unexpected error. Our team has been notified.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Details (in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-xs bg-muted p-3 rounded border">
                  <summary className="cursor-pointer font-medium mb-2">
                    Technical Details
                  </summary>
                  <div className="space-y-2">
                    <p><strong>Error:</strong> {this.state.error.message}</p>
                    {this.state.error.stack && (
                      <pre className="whitespace-pre-wrap text-xs bg-background p-2 rounded border overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const errorText = `Error: ${this.state.error?.message}\nURL: ${window.location.href}\nTime: ${new Date().toISOString()}`;
                    navigator.clipboard.writeText(errorText);
                    alert('Error details copied to clipboard');
                  }}
                  className="text-xs"
                >
                  <Bug className="w-3 h-3 mr-1" />
                  Copy Error Details
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                If this problem persists, please contact support with the error details above.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  return (error: Error) => {
    throw error;
  };
}