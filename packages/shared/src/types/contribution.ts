export type ContributionType = 'employee' | 'employer';

export interface Contribution {
  id: string;
  employeeId: string;
  pensionPlanId: string;
  amount: number; // In cents
  type: ContributionType;
  period: string; // Format: YYYY-MM
  createdAt: Date;
}
