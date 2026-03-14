import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-rose-100">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-500 max-w-md mb-8 font-medium">
            The dashboard encountered an unexpected error. This has been logged, but you might need to refresh to continue.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-8 h-14 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Dashboard
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
