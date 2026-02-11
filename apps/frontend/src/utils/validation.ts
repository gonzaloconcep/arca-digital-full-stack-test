// ============================================
// FUNCIONES DE VALIDACIÓN CUSTOM
// ============================================
// Este archivo contiene funciones de validación sin usar librerías externas
// (NO zod, NO yup, NO react-hook-form)
//
// Patrón: cada función retorna null si es válido, o string con mensaje de error

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string | null | undefined, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} es obligatorio`;
  }
  return null;
};

/**
 * Valida formato de NIF español (8 números + 1 letra mayúscula)
 */
export const validateNIF = (nif: string): string | null => {
  if (!nif || nif.trim() === '') {
    return 'El NIF es obligatorio';
  }

  const nifRegex = /^[0-9]{8}[A-Z]$/;
  if (!nifRegex.test(nif.toUpperCase())) {
    return 'El NIF debe tener 8 números seguidos de una letra mayúscula';
  }

  // Validar letra del NIF
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const numbers = nif.substring(0, 8);
  const letter = nif.charAt(8).toUpperCase();
  const expectedLetter = letters[parseInt(numbers, 10) % 23];

  if (letter !== expectedLetter) {
    return 'La letra del NIF no es válida';
  }

  return null;
};

/**
 * Valida fecha de nacimiento (entre 18 y 100 años)
 */
export const validateBirthDate = (date: string): string | null => {
  if (!date) {
    return 'La fecha de nacimiento es obligatoria';
  }

  const birth = new Date(date);
  if (isNaN(birth.getTime())) {
    return 'La fecha de nacimiento no es válida';
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 18) {
    return 'Debes tener al menos 18 años';
  }

  if (age > 100) {
    return 'La fecha de nacimiento no es válida';
  }

  return null;
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'El email es obligatorio';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email no es válido';
  }

  return null;
};

/**
 * Valida longitud mínima
 */
export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (!value || value.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }
  return null;
};

/**
 * Valida longitud máxima
 */
export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`;
  }
  return null;
};

/**
 * Valida que sea un UUID válido
 */
export const validateUUID = (value: string, fieldName: string): string | null => {
  if (!value) {
    return `${fieldName} es obligatorio`;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    return `${fieldName} no es válido`;
  }

  return null;
};

// ============================================
// VALIDADORES DE FORMULARIOS COMPUESTOS
// ============================================

export interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  nif: string;
  birthDate: string;
}

export interface PersonalInfoErrors extends Record<string, string | null> {
  firstName: string | null;
  lastName: string | null;
  nif: string | null;
  birthDate: string | null;
}

/**
 * Valida el formulario de datos personales completo
 */
export const validatePersonalInfoForm = (data: PersonalInfoFormData): PersonalInfoErrors => {
  return {
    firstName: validateRequired(data.firstName, 'El nombre') ||
               validateMaxLength(data.firstName, 50, 'El nombre'),
    lastName: validateRequired(data.lastName, 'Los apellidos') ||
              validateMaxLength(data.lastName, 100, 'Los apellidos'),
    nif: validateNIF(data.nif),
    birthDate: validateBirthDate(data.birthDate),
  };
};

/**
 * Verifica si hay errores en un objeto de errores
 */
export const hasErrors = (errors: Record<string, string | null>): boolean => {
  return Object.values(errors).some(error => error !== null);
};

export interface PlanSelectionErrors extends Record<string, string | null> {
  pensionPlanId: string | null;
}

/**
 * Valida la selección de plan
 */
export const validatePlanSelection = (planId: string | null): PlanSelectionErrors => {
  return {
    pensionPlanId: planId ? validateUUID(planId, 'El plan') : 'Debes seleccionar un plan',
  };
};
