import {
  validateRequired,
  validateNIF,
  validateBirthDate,
  validateEmail,
  validatePersonalInfoForm,
  hasErrors,
} from './validation';

describe('validation utils', () => {
  describe('validateRequired', () => {
    it('returns error for empty string', () => {
      expect(validateRequired('', 'Campo')).toBe('Campo es obligatorio');
    });

    it('returns error for null', () => {
      expect(validateRequired(null, 'Campo')).toBe('Campo es obligatorio');
    });

    it('returns error for undefined', () => {
      expect(validateRequired(undefined, 'Campo')).toBe('Campo es obligatorio');
    });

    it('returns null for valid string', () => {
      expect(validateRequired('valor', 'Campo')).toBeNull();
    });
  });

  describe('validateNIF', () => {
    it('returns error for empty NIF', () => {
      expect(validateNIF('')).toBe('El NIF es obligatorio');
    });

    it('returns error for invalid format', () => {
      expect(validateNIF('1234567A')).toBe(
        'El NIF debe tener 8 números seguidos de una letra mayúscula'
      );
    });

    it('returns error for invalid letter', () => {
      expect(validateNIF('12345678A')).toBe('La letra del NIF no es válida');
    });

    it('returns null for valid NIF', () => {
      // 12345678Z es un NIF válido
      expect(validateNIF('12345678Z')).toBeNull();
    });
  });

  describe('validateBirthDate', () => {
    it('returns error for empty date', () => {
      expect(validateBirthDate('')).toBe('La fecha de nacimiento es obligatoria');
    });

    it('returns error for age under 18', () => {
      const today = new Date();
      const underAge = new Date(today.getFullYear() - 17, 0, 1);
      expect(validateBirthDate(underAge.toISOString().split('T')[0])).toBe(
        'Debes tener al menos 18 años'
      );
    });

    it('returns null for valid age', () => {
      const today = new Date();
      const validAge = new Date(today.getFullYear() - 30, 0, 1);
      expect(validateBirthDate(validAge.toISOString().split('T')[0])).toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('returns error for empty email', () => {
      expect(validateEmail('')).toBe('El email es obligatorio');
    });

    it('returns error for invalid format', () => {
      expect(validateEmail('notanemail')).toBe(
        'El formato del email no es válido'
      );
    });

    it('returns null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
    });
  });

  describe('validatePersonalInfoForm', () => {
    it('returns errors for empty form', () => {
      const errors = validatePersonalInfoForm({
        firstName: '',
        lastName: '',
        nif: '',
        birthDate: '',
      });

      expect(errors.firstName).not.toBeNull();
      expect(errors.lastName).not.toBeNull();
      expect(errors.nif).not.toBeNull();
      expect(errors.birthDate).not.toBeNull();
    });

    it('returns no errors for valid form', () => {
      const today = new Date();
      const validDate = new Date(today.getFullYear() - 30, 0, 1);

      const errors = validatePersonalInfoForm({
        firstName: 'Juan',
        lastName: 'García',
        nif: '12345678Z',
        birthDate: validDate.toISOString().split('T')[0],
      });

      expect(errors.firstName).toBeNull();
      expect(errors.lastName).toBeNull();
      expect(errors.nif).toBeNull();
      expect(errors.birthDate).toBeNull();
    });
  });

  describe('hasErrors', () => {
    it('returns true if there are errors', () => {
      expect(hasErrors({ field: 'error' })).toBe(true);
    });

    it('returns false if no errors', () => {
      expect(hasErrors({ field: null })).toBe(false);
    });
  });
});
