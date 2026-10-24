'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPatientById } from '@/lib/api/patients';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { ConditionBadge } from '@/components/ui/Badge';
import { PatientModal } from '@/features/patients/PatientModal';
import { CardSkeleton } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import {
  ChevronLeft,
  Edit2,
  Phone,
  Calendar,
  Stethoscope,
  Activity,
  User,
  Building,
  Mail,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  HeartPulse,
  FileText,
  History,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { Doctor } from '@/types/doctor';
import { ConditionHistoryItem } from '@/types/patient';
import { ConditionTimelineDrawer } from '@/features/patients/ConditionTimelineDrawer';

interface PatientDetailViewProps {
  id: string;
}

export function PatientDetailView({ id }: PatientDetailViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTimelineDrawerOpen, setIsTimelineDrawerOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id),
  });

  const patient = data?.data;
  const doctor = (typeof patient?.doctor === 'object' ? patient.doctor : null) as Doctor | null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="space-y-4">
        <Link
          href="/patients"
          className="inline-flex items-center text-xs text-[#5C768D] hover:text-[#1C2D38]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Patients Directory
        </Link>
        <ErrorState
          title="Patient Not Found"
          message={(error as any)?.message || 'Unable to locate patient record.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const admittedDate = new Date(patient.createdAt);
  const formattedDate = admittedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = admittedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const conditionHistory: ConditionHistoryItem[] =
    patient.conditionHistory && patient.conditionHistory.length > 0
      ? [...patient.conditionHistory].sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      )
      : [
        {
          condition: patient.condition,
          notes: patient.notes || 'Initial admission assessment recorded.',
          recordedAt: patient.createdAt,
        },
      ];

  const getConditionTimelineIcon = (condition: string) => {
    const norm = condition.toLowerCase();
    if (norm.includes('critical')) {
      return <AlertCircle className="h-4 w-4 text-[#CF3B3B] animate-pulse" />;
    }
    if (norm.includes('observation')) {
      return <Clock className="h-4 w-4 text-[#E68B00]" />;
    }
    if (norm.includes('recover')) {
      return <CheckCircle2 className="h-4 w-4 text-[#14B8A6]" />;
    }
    if (norm.includes('chronic')) {
      return <Activity className="h-4 w-4 text-[#8B5CF6]" />;
    }
    if (norm.includes('checkup') || norm.includes('routine')) {
      return <Calendar className="h-4 w-4 text-[#3B82F6]" />;
    }
    return <HeartPulse className="h-4 w-4 text-[#00A86B]" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Back navigation & actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center text-sm font-medium text-[#5C768D] hover:text-[#1C2D38] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Patients Directory
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsTimelineDrawerOpen(true)}
            className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5"
          >
            <History className="h-3.5 w-3.5 text-[#00A86B]" />
            <span>Condition Timeline</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            className="h-9 text-xs"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
            Edit Patient
          </Button>
        </div>
      </div>

      {/* Patient Primary Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Heading as="h1" className="text-2xl font-bold text-[#1C2D38]">
                  {patient.name}
                </Heading>
                <ConditionBadge condition={patient.condition} />
              </div>
              <Subheading className="mt-1 flex items-center gap-2 text-sm text-[#5C768D]">
                <span>{patient.age} years old</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span className="font-mono text-xs">ID: {patient._id}</span>
              </Subheading>
            </div>

            {/* Admission Status Pill Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F9FBFA] border border-[#E8EDEB]">
              <div className="p-2 rounded-lg bg-white border border-[rgba(0,0,0,0.10)] text-[#00A86B] shadow-2xs">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#5C768D]">
                  Current Status
                </p>
                <p className="text-sm font-bold text-[#00A86B]">
                  Active Inpatient
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8EDEB] text-sm text-[#5C768D]">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#5C768D]" />
              <div>
                <span className="text-[11px] block text-gray-400">Emergency Phone</span>
                <a
                  href={`tel:${patient.contactPhone}`}
                  className="font-medium text-[#1C2D38] hover:text-[#00A86B] transition-colors"
                >
                  {patient.contactPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#5C768D]" />
              <div>
                <span className="text-[11px] block text-gray-400">Admission Date</span>
                <span className="font-medium text-[#1C2D38]">{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#5C768D]" />
              <div>
                <span className="text-[11px] block text-gray-400">Admission Time</span>
                <span className="font-medium text-[#1C2D38]">{formattedTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Assigned Doctor Card & Clinical Monitoring Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Assigned Attending Doctor */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-[#00A86B]" />
                  ASSIGNED ATTENDING PHYSICIAN
                </span>
                {doctor && (
                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#00A86B] hover:underline"
                  >
                    <span>View Doctor Profile</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {doctor ? (
                <div className="mt-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0C2B24] text-[#00D084] font-bold text-base flex items-center justify-center shrink-0 shadow-sm border border-[#1E5246]">
                    {doctor.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-[#1C2D38]">{doctor.name}</h2>
                    <p className="text-xs font-semibold text-[#00A86B] mt-0.5">
                      {doctor.specialization} Specialist
                    </p>
                    <p className="text-xs text-[#5C768D] flex items-center gap-1.5 mt-1">
                      <Building className="h-3.5 w-3.5 shrink-0" />
                      <span>{doctor.hospital}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-800">
                  No doctor currently assigned to this patient. Please edit record to allocate a physician.
                </div>
              )}
            </CardHeader>

            {doctor && (
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E8EDEB] text-xs">
                  <div className="flex items-center gap-2 text-[#5C768D]">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5C768D]">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono">{doctor.phone}</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column (5 cols): Clinical Care Protocol & Notes */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-[#00A86B]" />
                  CLINICAL PROTOCOL & NOTES
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-semibold text-[#00A86B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>{patient.notes ? 'Edit Notes' : '+ Add Note'}</span>
                </button>
              </div>
              <h2 className="text-base font-bold text-[#1C2D38] mt-2">
                Condition Assessment: {patient.condition}
              </h2>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Dynamic Attending Physician Notes */}
              <div className="p-3.5 rounded-lg bg-[#F8FAF9] border border-gray-100 text-xs text-[#1C2D38] space-y-2">
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                  <FileText className="h-3.5 w-3.5 text-[#00A86B]" />
                  <span>Attending Physician Notes</span>
                </div>
                {patient.notes ? (
                  <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {patient.notes}
                  </p>
                ) : (
                  <p className="italic text-gray-400">
                    No clinical notes recorded yet. Click &quot;+ Add Note&quot; above to attach medical observations, treatment history, or care guidelines.
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#E8FAF2]/50 border border-[#00D084]/20 text-xs text-[#0C2B24] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#00684A]">
                  <ShieldCheck className="h-4 w-4 text-[#00A86B]" />
                  <span>Care Protocol Standard</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#2C4B44]">
                  Continuous vital signs and medication adherence monitored under Care Guide BD specifications.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Last updated: {new Date(patient.updatedAt).toLocaleDateString()}</span>
                <span className="text-[#00A86B] font-semibold">Verified System Record</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Clinical Condition & Progression Timeline Preview & Drawer Trigger */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white border border-[rgba(0,0,0,0.10)] text-[#00A86B] shadow-2xs">
                  <History className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-[#1C2D38]">
                  Clinical Condition & Progression Timeline
                </h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#00875A] border border-[#DCFCE7]">
                  {conditionHistory.length} {conditionHistory.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#5C768D]">
                Detailed historical trajectory of patient stability, observation notes, and clinical status changes over time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 px-3 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-[#00A86B]" />
                New Assessment
              </Button>

              <Button
                variant="primary"
                onClick={() => setIsTimelineDrawerOpen(true)}
                className="h-8 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105"
              >
                <History className="h-3.5 w-3.5" />
                <span>Open Timeline Drawer</span>
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            onClick={() => setIsTimelineDrawerOpen(true)}
            className="p-4 rounded-xl bg-[#F9FBFA] hover:bg-[#F4FBF7] border border-[#E8EDEB] hover:border-[#00D084]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Latest Status:
                </span>
                <ConditionBadge condition={patient.condition} />
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-[#5C768D]">
                  Last recorded on {new Date(conditionHistory[0]?.recordedAt || patient.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-[#5C768D] line-clamp-1">
                {conditionHistory[0]?.notes
                  ? `"${conditionHistory[0].notes}"`
                  : 'Routine assessment logged without notes.'}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-[#00A86B] group-hover:text-[#00875A] transition-colors self-start sm:self-auto shrink-0">
              <span>View Full Drawer</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Timeline Drawer (Right-side slide-over) */}
      <ConditionTimelineDrawer
        isOpen={isTimelineDrawerOpen}
        onClose={() => setIsTimelineDrawerOpen(false)}
        patient={patient}
        onUpdateCondition={() => setIsEditModalOpen(true)}
      />

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <PatientModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            refetch();
          }}
          patientToEdit={patient}
        />
      )}
    </div>
  );
}

export default PatientDetailView;
