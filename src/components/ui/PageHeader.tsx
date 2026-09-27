/**
 * Capacity Connect - PageHeader Component
 */

import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  tag?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  tag,
  className = '',
}) => {
  return (
    <div className={`mb-6 pb-5 border-b border-slate-200/80 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2.5">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {tag}
          </div>
          {description && (
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
