import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { AnalyticsFunnel } from '../../types';

// ============================================
// FUNNEL CHART
// ============================================
// Usa Chart.js para mostrar el funnel de conversión
// como un bar chart horizontal

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FunnelChartProps {
  funnel: AnalyticsFunnel;
}

const stepLabels: Record<string, string> = {
  onboarding_started: 'Iniciado',
  onboarding_step_personal_info: 'Datos personales',
  onboarding_step_plan_selection: 'Selección plan',
  onboarding_completed: 'Completado',
};

function FunnelChart({ funnel }: FunnelChartProps) {
  const labels = funnel.steps.map((s) => stepLabels[s.step] || s.step);
  const counts = funnel.steps.map((s) => s.count);
  const conversionRates = funnel.steps.map((s) => s.conversionRate);

  const data = {
    labels,
    datasets: [
      {
        label: 'Usuarios',
        data: counts,
        backgroundColor: [
          'rgba(49, 151, 149, 0.8)',   // brand.500
          'rgba(56, 178, 172, 0.8)',   // brand.400
          'rgba(79, 209, 197, 0.8)',   // brand.300
          'rgba(129, 230, 217, 0.8)',  // brand.200
        ],
        borderColor: [
          'rgb(49, 151, 149)',
          'rgb(56, 178, 172)',
          'rgb(79, 209, 197)',
          'rgb(129, 230, 217)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: { dataIndex: number; raw: unknown }) {
            const index = context.dataIndex;
            const count = context.raw;
            const rate = conversionRates[index];
            return `${count} usuarios (${rate.toFixed(1)}% conversión)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height: '250px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default FunnelChart;
