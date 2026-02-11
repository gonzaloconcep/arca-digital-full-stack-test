import { EventType } from '../types/event';

export interface CreateEventDto {
  type: EventType;
  employeeId?: string;
  sessionId: string;
  payload?: Record<string, unknown>;
}

export interface EventQueryDto {
  employeeId?: string;
  sessionId?: string;
  type?: EventType;
  startDate?: string;
  endDate?: string;
}
