import { Doctor } from './doctor';

export type PatientGender = 'Male' | 'Female' | 'Other';

export type PatientCondition =
  | 'Stable'
  | 'Critical'
  | 'Under Observation'
  | 'Recovered'
  | 'Chronic'
  | 'Routine Checkup'
  | string;

export interface ConditionHistoryItem {
  _id?: string;
  condition: PatientCondition;
  notes?: string;
  recordedAt: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  condition: PatientCondition;
  contactPhone: string;
  doctor: string | Doctor;
  notes?: string;
  conditionHistory?: ConditionHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientInput {
  name: string;
  age: number;
  gender: PatientGender;
  condition: PatientCondition;
  contactPhone: string;
  doctor: string;
  notes?: string;
}

export interface PatientQueryParams {
  search?: string;
  doctor?: string;
  gender?: string;
  condition?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
