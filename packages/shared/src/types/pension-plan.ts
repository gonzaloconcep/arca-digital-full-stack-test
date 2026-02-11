export type RiskLevel = 'conservative' | 'balanced' | 'dynamic';

export interface PensionPlan {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  expectedReturnMin: number; // Percentage (e.g., 2.5 = 2.5%)
  expectedReturnMax: number;
  managementFee: number; // Percentage
  createdAt: Date;
  updatedAt: Date;
}
