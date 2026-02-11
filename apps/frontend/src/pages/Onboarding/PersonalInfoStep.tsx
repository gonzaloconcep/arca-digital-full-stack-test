import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading,
} from '@chakra-ui/react';

import { PersonalInfoData } from '../../types';
import {
  validatePersonalInfoForm,
  hasErrors,
  PersonalInfoErrors,
} from '../../utils/validation';

// ============================================
// PASO 1: Datos Personales
// ============================================
//
// Campos:
// - Nombre (firstName)
// - Apellidos (lastName)
// - NIF (con validación española)
// - Fecha de nacimiento (18-100 años)
//
// Validación: funciones custom en utils/validation.ts
// NO usar zod, yup, ni react-hook-form

interface PersonalInfoStepProps {
  initialData: PersonalInfoData;
  onSubmit: (data: PersonalInfoData) => Promise<void>;
  isLoading: boolean;
}

function PersonalInfoStep({
  initialData,
  onSubmit,
  isLoading,
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState<PersonalInfoData>(initialData);
  const [errors, setErrors] = useState<PersonalInfoErrors>({
    firstName: null,
    lastName: null,
    nif: null,
    birthDate: null,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = (field: keyof PersonalInfoData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validar campo individual al perder foco
    const validationErrors = validatePersonalInfoForm(formData);
    setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todo el formulario
    const validationErrors = validatePersonalInfoForm(formData);
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      nif: true,
      birthDate: true,
    });

    if (hasErrors(validationErrors)) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Datos personales</Heading>

        <FormControl isInvalid={touched.firstName && !!errors.firstName}>
          <FormLabel>Nombre</FormLabel>
          <Input
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Tu nombre"
          />
          <FormErrorMessage>{errors.firstName}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={touched.lastName && !!errors.lastName}>
          <FormLabel>Apellidos</FormLabel>
          <Input
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder="Tus apellidos"
          />
          <FormErrorMessage>{errors.lastName}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={touched.nif && !!errors.nif}>
          <FormLabel>NIF</FormLabel>
          <Input
            value={formData.nif}
            onChange={(e) => handleChange('nif', e.target.value.toUpperCase())}
            onBlur={() => handleBlur('nif')}
            placeholder="12345678A"
            maxLength={9}
          />
          <FormErrorMessage>{errors.nif}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={touched.birthDate && !!errors.birthDate}>
          <FormLabel>Fecha de nacimiento</FormLabel>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            onBlur={() => handleBlur('birthDate')}
          />
          <FormErrorMessage>{errors.birthDate}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          isLoading={isLoading}
          loadingText="Guardando..."
        >
          Continuar
        </Button>
      </VStack>
    </form>
  );
}

export default PersonalInfoStep;
