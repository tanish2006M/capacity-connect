/**
 * Capacity Connect - ModulePlaceholderPage
 * Displayed for subsequent development modules (Stage 2/3) with roadmap context
 */

import React from 'react';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  category: string;
  stageName: string;
  description: string;
  upcomingDeliverables: string[];
  onNavigate: (path: string) => void;
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderProps> = ({
  title,
  category,
  stageName,
  description,
  upcomingDeliverables,
  onNavigate,
}) => {
  const { user } = useAuth();
  const returnPath = user ? `/${user.role}` : '/';

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate(returnPath) },
          { label: category },
          { label: title, active: true },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(returnPath)}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Dashboard
          </Button>
        }
      />

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
                {stageName}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Coming in the next module</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {title} Architecture Provisioned
            </h2>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {description} The data structures, security scopes, and role permissions for this module have been initialized in this Stage 1 foundation.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Upcoming Specifications in Next Prompt
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingDeliverables.map((item, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Capacity Connect Architecture Foundation</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate(returnPath)}
              >
                Return to Active Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
