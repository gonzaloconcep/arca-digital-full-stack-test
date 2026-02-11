export type OnboardingStatus =
  | 'not_started'
  | 'personal_info'
  | 'plan_selection'
  | 'completed';

export interface Employee {
  id: string;
  companyId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  nif: string | null;
  birthDate: Date | null;
  pensionPlanId: string | null;
  onboardingStatus: OnboardingStatus;
  onboardingCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
