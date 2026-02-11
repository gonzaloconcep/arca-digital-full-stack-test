import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Divider,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckCircleIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';

import { PersonalInfoData, PensionPlan } from '../../types';

// ============================================
// PASO 3: Confirmación
// ============================================
//
// Muestra resumen de:
// - Datos personales
// - Plan seleccionado
//
// Permite confirmar o volver para editar

interface ConfirmationStepProps {
  personalInfo: PersonalInfoData;
  selectedPlan: PensionPlan | undefined;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  isCompleted: boolean;
}

const riskLevelLabels: Record<string, string> = {
  conservative: 'Conservador',
  balanced: 'Equilibrado',
  dynamic: 'Dinámico',
};

function ConfirmationStep({
  personalInfo,
  selectedPlan,
  onConfirm,
  onBack,
  isLoading,
  isCompleted,
}: ConfirmationStepProps) {
  if (isCompleted) {
    return (
      <VStack spacing={6} align="stretch">
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          py={10}
          borderRadius="lg"
        >
          <CheckCircleIcon boxSize="50px" color="green.500" mb={4} />
          <AlertTitle mb={2} fontSize="xl">
            ¡Onboarding completado!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Tu plan de pensiones ha sido configurado correctamente.
            Pronto recibirás un email con los detalles de tu plan.
          </AlertDescription>
        </Alert>

        <Box bg="gray.50" p={4} borderRadius="md">
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Plan seleccionado: <strong>{selectedPlan?.name}</strong>
          </Text>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Confirma tus datos</Heading>

      <Text color="gray.600">
        Revisa que todos los datos sean correctos antes de confirmar.
      </Text>

      {/* Datos personales */}
      <Box bg="gray.50" p={4} borderRadius="md">
        <Text fontWeight="semibold" mb={3}>
          Datos personales
        </Text>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text color="gray.600">Nombre completo</Text>
            <Text fontWeight="medium">
              {personalInfo.firstName} {personalInfo.lastName}
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="gray.600">NIF</Text>
            <Text fontWeight="medium">{personalInfo.nif}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="gray.600">Fecha de nacimiento</Text>
            <Text fontWeight="medium">
              {dayjs(personalInfo.birthDate).format('DD/MM/YYYY')}
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Divider />

      {/* Plan seleccionado */}
      {selectedPlan && (
        <Box bg="gray.50" p={4} borderRadius="md">
          <HStack justify="space-between" mb={3}>
            <Text fontWeight="semibold">Plan seleccionado</Text>
            <Badge colorScheme="brand">{riskLevelLabels[selectedPlan.riskLevel]}</Badge>
          </HStack>
          <VStack align="stretch" spacing={2}>
            <Text fontSize="lg" fontWeight="bold" color="brand.600">
              {selectedPlan.name}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {selectedPlan.description}
            </Text>
            <HStack spacing={6} mt={2}>
              <Box>
                <Text fontSize="xs" color="gray.500">
                  Rentabilidad esperada
                </Text>
                <Text fontWeight="semibold" color="green.600">
                  {selectedPlan.expectedReturnMin}% - {selectedPlan.expectedReturnMax}%
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500">
                  Comisión
                </Text>
                <Text fontWeight="semibold">
                  {selectedPlan.managementFee}%
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
      )}

      <Alert status="info" variant="subtle">
        <AlertIcon />
        <Box>
          <Text fontSize="sm">
            Al confirmar, aceptas la configuración de tu plan de pensiones de empresa.
          </Text>
        </Box>
      </Alert>

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
          onClick={onConfirm}
          isLoading={isLoading}
          loadingText="Confirmando..."
        >
          Confirmar
        </Button>
      </HStack>
    </VStack>
  );
}

export default ConfirmationStep;
