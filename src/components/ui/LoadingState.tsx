/**
 * Capacity Connect - LoadingState & ErrorState Components
 */

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading portal data...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Loader2 className="w-8 h-8 text-blue-700 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Content',
  description = 'An unexpected error occurred while communicating with the capacity database.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`border border-rose-200 bg-rose-50/50 rounded-xl p-8 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-1 mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
