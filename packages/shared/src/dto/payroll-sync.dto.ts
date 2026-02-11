export interface PayrollEmployee {
  email: string;
  firstName: string;
  lastName: string;
  nif: string;
  birthDate: string; // ISO date
  salary: number; // Annual gross salary in cents
}

export interface PayrollSyncRequest {
  companyId: string;
}

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
