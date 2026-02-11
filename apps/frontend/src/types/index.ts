// Employee types
export interface Employee {
  id: string;
  companyId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  nif: string | null;
  birthDate: string | null;
  pensionPlanId: string | null;
  onboardingStatus: OnboardingStatus;
  onboardingCompletedAt: string | null;
}

export type OnboardingStatus = 'not_started' | 'personal_info' | 'plan_selection' | 'completed';

// Pension Plan types
export interface PensionPlan {
  id: string;
  name: string;
  description: string;
  riskLevel: 'conservative' | 'balanced' | 'dynamic';
  expectedReturnMin: number;
  expectedReturnMax: number;
  managementFee: number;
}

// Onboarding types
export interface OnboardingProgress {
  employeeId: string;
  currentStatus: OnboardingStatus;
  completedSteps: string[];
  data: {
    personalInfo?: PersonalInfoData;
    selectedPlanId?: string;
  };
}

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  nif: string;
  birthDate: string;
}

// Event types
export interface Event {
  id: string;
  type: string;
  employeeId: string | null;
  sessionId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface CreateEventData {
  type: string;
  employeeId?: string;
  sessionId: string;
  payload?: Record<string, unknown>;
}

// Analytics types
export interface AnalyticsFunnel {
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
  steps: FunnelStep[];
}

export interface FunnelStep {
  step: string;
  count: number;
  conversionRate: number;
}

export interface EventsPerDay {
  date: string;
  count: number;
}

// Payroll Sync types
export interface PayrollSyncResult {
  created: number;
  updated: number;
  errors: PayrollSyncError[];
  totalProcessed: number;
}

export interface PayrollSyncError {
  email: string;
  reason: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | null;
}
