import { OnboardingStatus } from '../types/employee';

export interface PersonalInfoDto {
  firstName: string;
  lastName: string;
  nif: string;
  birthDate: string; // ISO date string
}

export interface PlanSelectionDto {
  pensionPlanId: string;
}

export interface OnboardingStepDto {
  step: 'personal_info' | 'plan_selection' | 'confirmation';
  data: PersonalInfoDto | PlanSelectionDto | Record<string, never>;
}

export interface OnboardingProgressResponse {
  employeeId: string;
  currentStatus: OnboardingStatus;
  completedSteps: string[];
  data: {
    personalInfo?: PersonalInfoDto;
    selectedPlanId?: string;
  };
}
