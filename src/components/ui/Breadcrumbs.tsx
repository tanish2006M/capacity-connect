/**
 * Capacity Connect - Breadcrumbs Component
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-slate-500 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            {isLast || item.active ? (
              <span className="font-semibold text-slate-900 truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-blue-700 transition-colors truncate max-w-[160px] focus:outline-none focus:underline"
              >
                {item.label}
              </button>
            ) : (
              <span className="truncate max-w-[160px]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
