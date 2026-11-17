import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartWrapper, { chartDefaults, getChartColors } from './ChartWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const AppLineChart = ({
  labels,
  datasets,
  options: extraOptions = {},
  height = 250,
  loading = false,
  title,
  isDark = false,
  className = '',
}) => {
  const colors = getChartColors(isDark);

  const formattedDatasets = datasets.map((ds) => ({
    ...ds,
    borderColor: ds.borderColor || colors.primary,
    backgroundColor: ds.backgroundColor || `${colors.primary}15`,
    borderWidth: ds.borderWidth || 3,
    fill: ds.fill ?? false,
    tension: ds.tension ?? 0.4,
    pointBackgroundColor: ds.pointBackgroundColor || ds.borderColor || colors.primary,
    pointBorderColor: colors.background,
    pointBorderWidth: 2,
    pointRadius: ds.pointRadius ?? 4,
    pointHoverRadius: ds.pointHoverRadius ?? 7,
  }));

  const data = {
    labels: labels || [],
    datasets: formattedDatasets,
  };

  const options = {
    ...chartDefaults(isDark),
    ...extraOptions,
    plugins: {
      ...chartDefaults(isDark).plugins,
      ...extraOptions.plugins,
    },
    scales: {
      ...chartDefaults(isDark).scales,
      ...extraOptions.scales,
    },
  };

  return (
    <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark' : ''} ${className}`}>
      <div className="card-body p-4">
        {title && (
          <div className="d-flex align-items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faChartLine} className="text-primary" />
            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
              {title}
            </h6>
          </div>
        )}
        <ChartWrapper height={height} loading={loading}>
          <Line data={data} options={options} />
        </ChartWrapper>
      </div>
    </div>
  );
};

export default AppLineChart;
