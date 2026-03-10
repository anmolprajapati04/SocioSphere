import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardCard from './DashboardCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const chartComponents = {
  line: Line,
  doughnut: Doughnut,
  bar: Bar,
};

export default function ChartCard({ title, type = 'line', data, options }) {
  const ChartComp = chartComponents[type] || Line;
  return (
    <DashboardCard title={title}>
      <div style={{ height: 220 }}>
        <ChartComp data={data} options={options} />
      </div>
    </DashboardCard>
  );
}

