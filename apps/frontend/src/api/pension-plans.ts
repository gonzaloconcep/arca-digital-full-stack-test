// ============================================
// API PENSION PLANS
// ============================================
// Patrón: token siempre como primer parámetro (como Chirigota)
// Usa fetch nativo, NO axios ni react-query

import { PensionPlan } from '../types';

const API_URL = process.env.REACT_APP_BASE_API;

/**
 * Obtiene todos los planes de pensiones disponibles
 */
export const getPensionPlans = async (
  token: string
): Promise<PensionPlan[]> => {
  const response = await fetch(`${API_URL}/pension-plans`, {
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
 * Obtiene un plan de pensiones por ID
 */
export const getPensionPlan = async (
  token: string,
  id: string
): Promise<PensionPlan> => {
  const response = await fetch(`${API_URL}/pension-plans/${id}`, {
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
