'use client';

import React, { useEffect, useState } from 'react';
import { Patient, ConditionHistoryItem } from '@/types/patient';
import { ConditionBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  X,
  History,
  Check,
  Clock,
  Plus,
  ArrowUpDown,
  HeartPulse,
  Activity,
  AlertTriangle,
  Calendar,
  User,
} from 'lucide-react';

export interface ConditionTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onUpdateCondition?: () => void;
}

export function ConditionTimelineDrawer({
  isOpen,
  onClose,
  patient,
  onUpdateCondition,
}: ConditionTimelineDrawerProps) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Handle ESC key press and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prepare condition history entries
  const rawHistory: ConditionHistoryItem[] =
    patient.conditionHistory && patient.conditionHistory.length > 0
      ? patient.conditionHistory
      : [
        {
          condition: patient.condition,
          notes: patient.notes || 'Initial admission assessment recorded.',
          recordedAt: patient.createdAt,
        },
      ];

  const sortedHistory = [...rawHistory].sort((a, b) => {
    const timeA = new Date(a.recordedAt).getTime();
    const timeB = new Date(b.recordedAt).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const formatTimelineDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible delay-300'
        }`}
      aria-labelledby="drawer-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-[#001E2B]/50 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer sliding container from right side */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-md sm:max-w-lg pointer-events-auto bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#E8EDEB] bg-white flex items-start justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white border border-[rgba(0,0,0,0.10)] text-[#00A86B] shadow-2xs">
                  <History className="h-4 w-4" />
                </div>
                <h2 id="drawer-title" className="text-lg font-bold text-[#1C2D38]">
                  Clinical Condition Timeline
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#5C768D] flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[#1C2D38]">{patient.name}</span>
                <span>•</span>
                <span>{patient.age} yrs</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-gray-400">ID: {patient._id}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38] transition-colors border border-transparent hover:border-[#E8EDEB] focus:outline-none cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Subheader Toolbar */}
          <div className="px-6 py-3 bg-[#F9FBFA] border-b border-[#E8EDEB] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Current Status:
              </span>
              <ConditionBadge condition={patient.condition} />
            </div>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#5C768D] hover:text-[#1C2D38] bg-white border border-[#E8EDEB] shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
              title="Toggle sorting order"
            >
              <ArrowUpDown className="h-3 w-3 text-[#00A86B]" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {/* Drawer Scrollable Body: Timeline matching given design */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            <div className="relative pl-1">
              {sortedHistory.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === sortedHistory.length - 1;
                const timestampText = formatTimelineDate(item.recordedAt);

                // In the reference image:
                // First node: Solid blue/emerald circle with white checkmark
                // Subsequent nodes: Outlined circle with clock icon
                const isPrimaryNode = isFirst;

                // Color accent based on condition or primary brand
                const conditionLower = item.condition.toLowerCase();
                let accentColor = '#02634c';

                if (conditionLower.includes('critical')) {
                  accentColor = '#DC2626';
                } else if (conditionLower.includes('observation')) {
                  accentColor = '#D97706';
                } else if (conditionLower.includes('stable') || conditionLower.includes('recover')) {
                  accentColor = '#02634c';
                } else if (conditionLower.includes('chronic')) {
                  accentColor = '#7C3AED';
                }

                return (
                  <div key={item._id || index} className="relative flex items-start gap-4 pb-8 last:pb-2">
                    {/* Vertical connecting line between icons */}
                    {!isLast && (
                      <span
                        className="absolute top-6 left-[13px] -bottom-0 w-[2px]"
                        style={{
                          backgroundColor: isPrimaryNode ? accentColor : '#E2E8F0',
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {/* Timeline Node Icon (strictly styled like the reference image) */}
                    <div className="shrink-0 z-10 pt-0.5">
                      {isPrimaryNode ? (
                        <div
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center shadow-xs ring-4 ring-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center ring-4 ring-white shadow-2xs"
                          style={{
                            borderColor: index === 1 ? accentColor : '#CBD5E1',
                            color: index === 1 ? accentColor : '#94A3B8',
                          }}
                        >
                          <Clock className="h-3.5 w-3.5 stroke-[2]" />
                        </div>
                      )}
                    </div>

                    {/* Timeline Content Block */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      {/* Top row: Date and Time in subtle gray text */}
                      <p className="text-xs font-medium text-[#7C8E9B] leading-none mb-1.5">
                        {timestampText}
                      </p>

                      {/* Main Title: Condition Name with status tag */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[#1C2D38]">
                          {item.condition}
                        </h3>

                        {isFirst && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00A86B]/15 text-[#00684A] border border-[#00A86B]/30">
                            {sortOrder === 'desc' ? 'Latest Status' : 'Initial Status'}
                          </span>
                        )}
                      </div>

                      {/* Description / Clinical Observation Note */}
                      <p className="text-xs text-[#5C768D] leading-relaxed mt-1.5 whitespace-pre-wrap">
                        {item.notes || 'Routine condition assessment documented by attending doctor.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="px-6 py-4 bg-[#F9FBFA] border-t border-[#E8EDEB] flex items-center justify-between gap-3 shrink-0">
            <Button
              variant="secondary"
              onClick={onClose}
              className="h-9 px-4 text-xs font-semibold"
            >
              Close
            </Button>

            {onUpdateCondition && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onUpdateCondition();
                }}
                className="h-9 px-4 text-xs font-semibold flex items-center gap-1.5 "
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Update Condition / Note</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConditionTimelineDrawer;
