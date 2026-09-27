/**
 * Capacity Connect - ProgressBar Component
 * Clean progress indicator with tabular percentage
 */

import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  color = 'blue',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-slate-700 truncate">{label}</span>}
          {showPercent && (
            <span className="font-mono tabular-nums text-slate-600 ml-auto font-medium">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
