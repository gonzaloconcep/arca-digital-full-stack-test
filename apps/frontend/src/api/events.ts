// ============================================
// API EVENTS
// ============================================
// Patrón: token siempre como primer parámetro (como Chirigota)
// Usa fetch nativo, NO axios ni react-query

import { Event, CreateEventData, AnalyticsFunnel, EventsPerDay } from '../types';

const API_URL = process.env.REACT_APP_BASE_API;

/**
 * Registra un evento de tracking
 */
export const trackEvent = async (
  token: string,
  event: CreateEventData
): Promise<Event> => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Obtiene eventos con filtros opcionales
 */
export const getEvents = async (
  token: string,
  filters?: {
    employeeId?: string;
    sessionId?: string;
    type?: string;
  }
): Promise<Event[]> => {
  const params = new URLSearchParams();
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  if (filters?.sessionId) params.set('sessionId', filters.sessionId);
  if (filters?.type) params.set('type', filters.type);

  const response = await fetch(`${API_URL}/events?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Obtiene datos del funnel de conversión
 */
export const getFunnel = async (
  token: string,
  startDate?: string,
  endDate?: string
): Promise<AnalyticsFunnel> => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const response = await fetch(`${API_URL}/events/analytics/funnel?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Obtiene eventos por día (últimos 30 días por defecto)
 */
export const getEventsPerDay = async (
  token: string,
  startDate?: string,
  endDate?: string
): Promise<EventsPerDay[]> => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const response = await fetch(`${API_URL}/events/analytics/events-per-day?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};
