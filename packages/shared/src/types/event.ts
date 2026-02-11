export type EventType =
  | 'onboarding_started'
  | 'onboarding_step_personal_info'
  | 'onboarding_step_plan_selection'
  | 'onboarding_completed'
  | 'plan_viewed'
  | 'plan_selected';

export interface Event {
  id: string;
  type: EventType;
  employeeId: string | null;
  sessionId: string;
  payload: Record<string, unknown>;
  timestamp: Date;
}

export interface FunnelStep {
  step: string;
  count: number;
  conversionRate: number; // Percentage from previous step
}

export interface AnalyticsFunnel {
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
  steps: FunnelStep[];
}

export interface EventsPerDay {
  date: string; // YYYY-MM-DD
  count: number;
}
