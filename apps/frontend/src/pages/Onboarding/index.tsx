import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Spinner,
  Center,
} from '@chakra-ui/react';

import { OnboardingProgress, PensionPlan, PersonalInfoData } from '../../types';
import { getOnboardingProgress, updateOnboardingStep } from '../../api/employees';
import { getPensionPlans } from '../../api/pension-plans';
import { trackEvent } from '../../api/events';
import { getSessionId } from '../../utils/session';

import PersonalInfoStep from './PersonalInfoStep';
import PlanSelectionStep from './PlanSelectionStep';
import ConfirmationStep from './ConfirmationStep';

// ============================================
// TAREA 1: Wizard de Onboarding
// ============================================
//
// Este wizard tiene 3 pasos:
// 1. Datos personales (nombre, apellidos, NIF, fecha nacimiento)
// 2. Selección de plan (mostrar planes con rentabilidad/comisiones)
// 3. Confirmación (resumen de información)
//
// Requisitos:
// - Validación custom en utils/validation.ts (NO zod/yup)
// - Chakra UI para componentes
// - fetch nativo para API calls (NO axios/react-query)
// - Persistir progreso en backend (PATCH /employees/:id/onboarding)
// - Trackear eventos de analytics (POST /events)
// - El refresh no debe perder datos
//
// El candidato debe:
// - Completar la lógica de navegación entre pasos
// - Implementar persistencia del progreso
// - Añadir tracking de eventos
// - Añadir tests unitarios (mínimo 3)

const steps = [
  { title: 'Datos personales', description: 'Información básica' },
  { title: 'Plan de pensiones', description: 'Elige tu plan' },
  { title: 'Confirmación', description: 'Revisa y confirma' },
];

// Mock token - en producción vendría de autenticación
const MOCK_TOKEN = 'mock-token';

function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employeeId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado del wizard
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [plans, setPlans] = useState<PensionPlan[]>([]);

  // Datos del formulario
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    nif: '',
    birthDate: '',
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Session ID para tracking
  const sessionId = getSessionId();

  // Cargar datos iniciales
  useEffect(() => {
    if (!employeeId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar progreso y planes en paralelo
        const [progressData, plansData] = await Promise.all([
          getOnboardingProgress(MOCK_TOKEN, employeeId),
          getPensionPlans(MOCK_TOKEN),
        ]);

        setProgress(progressData);
        setPlans(plansData);

        // Restaurar datos guardados
        if (progressData.data.personalInfo) {
          setPersonalInfo(progressData.data.personalInfo);
        }
        if (progressData.data.selectedPlanId) {
          setSelectedPlanId(progressData.data.selectedPlanId);
        }

        // Determinar paso actual basado en status
        const stepMap: Record<string, number> = {
          not_started: 0,
          personal_info: 1,
          plan_selection: 2,
          completed: 2, // Si ya completó, mostrar confirmación
        };
        setActiveStep(stepMap[progressData.currentStatus] ?? 0);

        // Trackear inicio de onboarding si es primera vez
        if (progressData.currentStatus === 'not_started') {
          await trackEvent(MOCK_TOKEN, {
            type: 'onboarding_started',
            employeeId,
            sessionId,
            payload: { timestamp: new Date().toISOString() },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employeeId, sessionId]);

  // Guardar paso personal_info
  const handlePersonalInfoSubmit = useCallback(async (data: PersonalInfoData) => {
    if (!employeeId) return;

    try {
      setSaving(true);
      setError(null);

      // Guardar en backend
      await updateOnboardingStep(MOCK_TOKEN, employeeId, 'personal_info', data);

      // Trackear evento
      await trackEvent(MOCK_TOKEN, {
        type: 'onboarding_step_personal_info',
        employeeId,
        sessionId,
        payload: { step: 'personal_info' },
      });

      // Actualizar estado local
      setPersonalInfo(data);
      setActiveStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando datos');
    } finally {
      setSaving(false);
    }
  }, [employeeId, sessionId]);

  // Guardar selección de plan
  const handlePlanSelectionSubmit = useCallback(async (planId: string) => {
    if (!employeeId) return;

    try {
      setSaving(true);
      setError(null);

      // Guardar en backend
      await updateOnboardingStep(MOCK_TOKEN, employeeId, 'plan_selection', {
        pensionPlanId: planId,
      });

      // Trackear evento
      await trackEvent(MOCK_TOKEN, {
        type: 'onboarding_step_plan_selection',
        employeeId,
        sessionId,
        payload: { step: 'plan_selection', planId },
      });

      // Actualizar estado local
      setSelectedPlanId(planId);
      setActiveStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando datos');
    } finally {
      setSaving(false);
    }
  }, [employeeId, sessionId]);

  // Confirmar onboarding
  const handleConfirmation = useCallback(async () => {
    if (!employeeId) return;

    try {
      setSaving(true);
      setError(null);

      // Guardar confirmación en backend
      await updateOnboardingStep(MOCK_TOKEN, employeeId, 'confirmation', {});

      // Trackear evento de completado
      await trackEvent(MOCK_TOKEN, {
        type: 'onboarding_completed',
        employeeId,
        sessionId,
        payload: {
          completedAt: new Date().toISOString(),
          selectedPlanId,
        },
      });

      // Recargar progreso para mostrar estado actualizado
      const updatedProgress = await getOnboardingProgress(MOCK_TOKEN, employeeId);
      setProgress(updatedProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error confirmando onboarding');
    } finally {
      setSaving(false);
    }
  }, [employeeId, selectedPlanId, sessionId]);

  // Volver al paso anterior
  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Sin employeeId
  if (!employeeId) {
    return (
      <Box minH="100vh" bg="gray.50" py={10}>
        <Container maxW="container.md">
          <Alert status="error">
            <AlertIcon />
            No se ha especificado el ID del empleado. Añade ?employeeId=xxx a la URL.
          </Alert>
        </Container>
      </Box>
    );
  }

  // Cargando
  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={10}>
        <Center h="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" />
            <Text color="gray.600">Cargando...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Encontrar plan seleccionado
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>
              Bienvenido a Arca
            </Heading>
            <Text color="gray.600">
              Configura tu plan de pensiones de empresa en 3 sencillos pasos
            </Text>
          </Box>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Stepper index={activeStep} colorScheme="brand">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <Box bg="white" p={8} borderRadius="lg" shadow="sm">
            {/* Paso 1: Datos personales */}
            {activeStep === 0 && (
              <PersonalInfoStep
                initialData={personalInfo}
                onSubmit={handlePersonalInfoSubmit}
                isLoading={saving}
              />
            )}

            {/* Paso 2: Selección de plan */}
            {activeStep === 1 && (
              <PlanSelectionStep
                plans={plans}
                selectedPlanId={selectedPlanId}
                onSubmit={handlePlanSelectionSubmit}
                onBack={handleBack}
                isLoading={saving}
              />
            )}

            {/* Paso 3: Confirmación */}
            {activeStep === 2 && (
              <ConfirmationStep
                personalInfo={personalInfo}
                selectedPlan={selectedPlan}
                onConfirm={handleConfirmation}
                onBack={handleBack}
                isLoading={saving}
                isCompleted={progress?.currentStatus === 'completed'}
              />
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default OnboardingPage;
