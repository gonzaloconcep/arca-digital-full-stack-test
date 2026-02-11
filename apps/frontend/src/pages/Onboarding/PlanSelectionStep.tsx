import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Badge,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { PensionPlan } from '../../types';
import { validatePlanSelection, hasErrors } from '../../utils/validation';

// ============================================
// PASO 2: Selección de Plan
// ============================================
//
// Muestra los planes disponibles con:
// - Nombre y descripción
// - Nivel de riesgo (conservador/equilibrado/dinámico)
// - Rentabilidad esperada (min-max %)
// - Comisión de gestión (%)
//
// El candidato debe seleccionar un plan para continuar

interface PlanSelectionStepProps {
  plans: PensionPlan[];
  selectedPlanId: string | null;
  onSubmit: (planId: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const riskLevelColors: Record<string, string> = {
  conservative: 'green',
  balanced: 'yellow',
  dynamic: 'red',
};

const riskLevelLabels: Record<string, string> = {
  conservative: 'Conservador',
  balanced: 'Equilibrado',
  dynamic: 'Dinámico',
};

function PlanSelectionStep({
  plans,
  selectedPlanId,
  onSubmit,
  onBack,
  isLoading,
}: PlanSelectionStepProps) {
  const [selected, setSelected] = useState<string>(selectedPlanId || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const errors = validatePlanSelection(selected || null);

    if (hasErrors(errors)) {
      setError(errors.pensionPlanId);
      return;
    }

    setError(null);
    await onSubmit(selected);
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Selecciona tu plan de pensiones</Heading>

      <Text color="gray.600">
        Elige el plan que mejor se adapte a tu perfil de inversión.
      </Text>

      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <RadioGroup value={selected} onChange={setSelected}>
        <VStack spacing={4} align="stretch">
          {plans.map((plan) => (
            <Box
              key={plan.id}
              p={4}
              borderWidth={2}
              borderRadius="lg"
              borderColor={selected === plan.id ? 'brand.500' : 'gray.200'}
              cursor="pointer"
              onClick={() => setSelected(plan.id)}
              _hover={{ borderColor: selected === plan.id ? 'brand.500' : 'gray.300' }}
              transition="border-color 0.2s"
            >
              <HStack justify="space-between" mb={2}>
                <HStack spacing={3}>
                  <Radio value={plan.id} colorScheme="brand" />
                  <Text fontWeight="bold" fontSize="lg">
                    {plan.name}
                  </Text>
                </HStack>
                <Badge colorScheme={riskLevelColors[plan.riskLevel]}>
                  {riskLevelLabels[plan.riskLevel]}
                </Badge>
              </HStack>

              <Text color="gray.600" mb={3} ml={7}>
                {plan.description}
              </Text>

              <HStack spacing={6} ml={7}>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Rentabilidad esperada
                  </Text>
                  <Text fontWeight="semibold" color="green.600">
                    {plan.expectedReturnMin}% - {plan.expectedReturnMax}%
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Comisión de gestión
                  </Text>
                  <Text fontWeight="semibold">
                    {plan.managementFee}%
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </RadioGroup>

      <HStack spacing={4}>
        <Button
          variant="outline"
          leftIcon={<ArrowBackIcon />}
          onClick={onBack}
          isDisabled={isLoading}
        >
          Volver
        </Button>
        <Button
          colorScheme="brand"
          flex={1}
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Guardando..."
        >
          Continuar
        </Button>
      </HStack>
    </VStack>
  );
}

export default PlanSelectionStep;
