import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

import { AnalyticsFunnel, EventsPerDay } from '../../types';
import { getFunnel, getEventsPerDay } from '../../api/events';
import dayjs from 'dayjs';

import FunnelChart from './FunnelChart';
import EventsPerDayChart from './EventsPerDayChart';

// ============================================
// TAREA 3: Dashboard de Analytics
// ============================================
//
// Este dashboard muestra:
// 1. Funnel de conversión del onboarding
// 2. Eventos por día (últimos 30 días)
// 3. Métricas resumen
//
// Usa Chart.js + react-chartjs-2 para gráficos (NO recharts)
//
// El candidato debe:
// - Completar los componentes de gráficos
// - Implementar las queries SQL en el backend
// - Conectar frontend con backend

// Mock token - en producción vendría de autenticación
const MOCK_TOKEN = 'mock-token';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funnel, setFunnel] = useState<AnalyticsFunnel | null>(null);
  const [eventsPerDay, setEventsPerDay] = useState<EventsPerDay[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calcular fechas de últimos 30 días
        const endDate = dayjs().format('YYYY-MM-DD');
        const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');

        // Cargar datos en paralelo
        const [funnelData, eventsData] = await Promise.all([
          getFunnel(MOCK_TOKEN, startDate, endDate),
          getEventsPerDay(MOCK_TOKEN, startDate, endDate),
        ]);

        setFunnel(funnelData);
        setEventsPerDay(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calcular eventos de hoy
  const eventsToday = eventsPerDay.find(
    (e) => e.date === dayjs().format('YYYY-MM-DD')
  )?.count || 0;

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={10}>
        <Center h="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" />
            <Text color="gray.600">Cargando dashboard...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>
              Dashboard de Analytics
            </Heading>
            <Text color="gray.600">
              Métricas de conversión del onboarding
            </Text>
          </Box>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Métricas resumen */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Onboardings iniciados</StatLabel>
                  <StatNumber>{funnel?.totalStarted || 0}</StatNumber>
                  <StatHelpText>Últimos 30 días</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Completados</StatLabel>
                  <StatNumber color="green.500">
                    {funnel?.totalCompleted || 0}
                  </StatNumber>
                  <StatHelpText>Últimos 30 días</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Tasa de conversión</StatLabel>
                  <StatNumber color="brand.500">
                    {funnel?.overallConversionRate.toFixed(1) || 0}%
                  </StatNumber>
                  <StatHelpText>General</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Eventos hoy</StatLabel>
                  <StatNumber>{eventsToday}</StatNumber>
                  <StatHelpText>{dayjs().format('DD/MM/YYYY')}</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Gráficos */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card>
              <CardHeader>
                <Heading size="md">Funnel de Conversión</Heading>
              </CardHeader>
              <CardBody>
                {funnel ? (
                  <FunnelChart funnel={funnel} />
                ) : (
                  <Text color="gray.500">No hay datos disponibles</Text>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">Eventos por Día</Heading>
              </CardHeader>
              <CardBody>
                {eventsPerDay.length > 0 ? (
                  <EventsPerDayChart data={eventsPerDay} />
                ) : (
                  <Text color="gray.500">No hay datos disponibles</Text>
                )}
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

export default DashboardPage;
