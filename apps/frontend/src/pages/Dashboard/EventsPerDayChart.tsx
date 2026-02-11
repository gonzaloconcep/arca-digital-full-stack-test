import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

import { EventsPerDay } from '../../types';

// ============================================
// EVENTS PER DAY CHART
// ============================================
// Usa Chart.js para mostrar eventos por día
// como un line chart con área

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EventsPerDayChartProps {
  data: EventsPerDay[];
}

function EventsPerDayChart({ data }: EventsPerDayChartProps) {
  // Ordenar por fecha y formatear labels
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const labels = sortedData.map((d) => dayjs(d.date).format('DD/MM'));
  const counts = sortedData.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Eventos',
        data: counts,
        fill: true,
        backgroundColor: 'rgba(49, 151, 149, 0.2)',
        borderColor: 'rgb(49, 151, 149)',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (context: { label: string }[]) {
            return `Fecha: ${context[0].label}`;
          },
          label: function (context: { raw: unknown }) {
            return `${context.raw} eventos`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ height: '250px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default EventsPerDayChart;
