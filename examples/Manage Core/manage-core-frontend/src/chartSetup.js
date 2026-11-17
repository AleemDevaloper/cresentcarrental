// Centralized Chart.js registration.
// Importing this once (in main.jsx) guarantees all scales/controllers are
// registered on the canonical chart.js instance before any chart renders,
// preventing "X is not a registered scale" errors across lazy-loaded chunks.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  DoughnutController,
  PieController,
  BubbleController,
  ScatterController,
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
  Filler,
  Decimation,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  DoughnutController,
  PieController,
  BubbleController,
  ScatterController,
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
  Filler,
  Decimation
);

export default ChartJS;
