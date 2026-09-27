/**
 * Capacity Connect - ComingSoonModal Component
 * Informs users about upcoming Stage 2 modules cleanly
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Sparkles, Calendar, Layers } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  stageName?: string;
  plannedCapabilities?: string[];
  roleScope?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  featureTitle,
  stageName = 'Stage 2 (Assessment & Content Engine)',
  plannedCapabilities = [
    'Interactive curriculum builder & rich multimedia lectures',
    'Automated MCQ assessment grading & real-time question pool',
    'Competency gap diagnostic matrix & recommended pathways',
    'Cryptographically verifiable digital credential generator',
  ],
  roleScope,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={featureTitle}
      subtitle="Coming in the next module"
      maxWidth="md"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Understood, Continue
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-950">Foundation Phase Active</h4>
            <p className="text-xs text-blue-800/90 mt-0.5 leading-relaxed">
              This capability is scheduled for delivery in {stageName}. The data schema and API contracts are already provisioned.
            </p>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Planned Module Capabilities
          </h5>
          <ul className="space-y-2">
            {plannedCapabilities.map((cap, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        {roleScope && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Role Access: <strong className="text-slate-700">{roleScope}</strong></span>
          </div>
        )}
      </div>
    </Modal>
  );
};
