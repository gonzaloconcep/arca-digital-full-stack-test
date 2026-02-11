// ============================================
// API EMPLOYEES
// ============================================
// Patrón: token siempre como primer parámetro (como Chirigota)
// Usa fetch nativo, NO axios ni react-query

import { Employee, OnboardingProgress, PersonalInfoData } from '../types';

const API_URL = process.env.REACT_APP_BASE_API;

/**
 * Obtiene un empleado por ID
 */
export const getEmployee = async (
  token: string,
  id: string
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
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
 * Obtiene lista de empleados (opcionalmente filtrado por empresa)
 */
export const getEmployees = async (
  token: string,
  companyId?: string
): Promise<Employee[]> => {
  const url = companyId
    ? `${API_URL}/employees?companyId=${companyId}`
    : `${API_URL}/employees`;

  const response = await fetch(url, {
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
 * Obtiene el progreso de onboarding de un empleado
 */
export const getOnboardingProgress = async (
  token: string,
  employeeId: string
): Promise<OnboardingProgress> => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/onboarding`, {
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
 * Actualiza un paso del onboarding
 */
export const updateOnboardingStep = async (
  token: string,
  employeeId: string,
  step: 'personal_info' | 'plan_selection' | 'confirmation',
  data: PersonalInfoData | { pensionPlanId: string } | Record<string, never>
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees/${employeeId}/onboarding`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ step, data }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};
