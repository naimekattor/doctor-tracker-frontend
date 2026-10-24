import React from 'react';
import { PatientDetailView } from '@/features/patients/PatientDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patient Profile | Doctor Tracker',
  description: 'View patient medical record, condition assessment and attending physician',
};

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  return <PatientDetailView id={id} />;
}
