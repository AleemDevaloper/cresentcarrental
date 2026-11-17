import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartWrapper, { chartDefaults, getChartColors } from './ChartWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

const AppBarChart = ({
  labels,
  datasets,
  options: extraOptions = {},
  height = 250,
  loading = false,
  title,
  horizontal = false,
  isDark = false,
  className = '',
}) => {
  const colors = getChartColors(isDark);

  const formattedDatasets = datasets.map((ds) => ({
    ...ds,
    backgroundColor: ds.backgroundColor || colors.primary,
    borderColor: ds.borderColor || colors.primary,
    borderWidth: ds.borderWidth || 0,
    borderRadius: ds.borderRadius ?? 8,
    borderSkipped: ds.borderSkipped ?? false,
  }));

  const data = {
    labels: labels || [],
    datasets: formattedDatasets,
  };

  const baseOptions = chartDefaults(isDark);
  const scales = {
    ...baseOptions.scales,
    ...(horizontal
      ? {
          ...baseOptions.scales,
          x: {
            ...baseOptions.scales.x,
            grid: { ...baseOptions.scales.x.grid, display: false },
          },
          y: {
            ...baseOptions.scales.y,
            grid: { ...baseOptions.scales.y.grid, display: false },
          },
        }
      : {}),
    ...extraOptions.scales,
  };

  const options = {
    ...baseOptions,
    indexAxis: horizontal ? 'y' : undefined,
    ...extraOptions,
    plugins: {
      ...baseOptions.plugins,
      ...extraOptions.plugins,
    },
    scales,
  };

  return (
    <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark' : ''} ${className}`}>
      <div className="card-body p-4">
        {title && (
          <div className="d-flex align-items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faChartBar} className="text-primary" />
            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
              {title}
            </h6>
          </div>
        )}
        <ChartWrapper height={height} loading={loading}>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </div>
    </div>
  );
};

export default AppBarChart;
