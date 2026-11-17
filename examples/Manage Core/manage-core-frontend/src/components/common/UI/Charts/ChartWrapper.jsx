import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartWrapper = ({ children, height = 300, loading = false, loadingHeight }) => {
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: loadingHeight || height }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <div style={{ height: `${height}px` }}>{children}</div>;
};

export const getChartColors = (isDark) => ({
  text: isDark ? '#f1f5f9' : '#1e293b',
  grid: isDark ? '#334155' : '#e2e8f0',
  background: isDark ? '#1e293b' : '#ffffff',
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6',
});

export const chartDefaults = (isDark) => {
  const colors = getChartColors(isDark);
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: colors.background,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.grid,
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: colors.grid, drawBorder: false },
        ticks: { color: colors.text },
      },
      y: {
        grid: { color: colors.grid, drawBorder: false },
        ticks: { color: colors.text },
      },
    },
  };
};

export default ChartWrapper;
