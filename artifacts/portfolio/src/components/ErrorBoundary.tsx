import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Catches render-time exceptions anywhere in the tree and shows a dark-themed
// fallback instead of a white screen. Network/data failures (e.g. Sanity being
// unreachable) are already handled by fallbacks in projectsData.ts — this only
// catches actual render errors.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
          <Card className="w-full max-w-md mx-4 bg-black/30 backdrop-blur-md border border-white/10">
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2 items-center">
                <AlertCircle className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                An unexpected error occurred. Please refresh the page — if the
                problem persists, try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
