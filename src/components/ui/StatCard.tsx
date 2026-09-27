/**
 * Capacity Connect - StatCard Component
 * High-density metric display with tabular numbers
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon,
  iconBgColor = 'bg-blue-50 text-blue-700',
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-5 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 truncate">
            {label}
          </p>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {value}
          </div>
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor}`}>
            {icon}
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trend.direction === 'up'
                  ? 'text-emerald-700'
                  : trend.direction === 'down'
                  ? 'text-rose-700'
                  : 'text-slate-600'
              }`}
            >
              {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span className="font-mono tabular-nums">{trend.value}</span>
            </span>
          )}
          {subtext && <span className="text-slate-500 truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
