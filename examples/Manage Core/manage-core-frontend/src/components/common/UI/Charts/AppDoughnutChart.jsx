import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartWrapper, { chartDefaults, getChartColors } from './ChartWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';

const AppDoughnutChart = ({
  labels,
  datasets,
  options: extraOptions = {},
  size = 280,
  loading = false,
  title,
  cutout = '65%',
  isDark = false,
  className = '',
}) => {
  const colors = getChartColors(isDark);

  const formattedDatasets = datasets.map((ds) => ({
    ...ds,
    backgroundColor: ds.backgroundColor || [
      colors.primary,
      colors.success,
      colors.warning,
      colors.danger,
      colors.info,
      colors.purple,
      colors.pink,
      colors.teal,
    ],
    borderWidth: ds.borderWidth ?? 2,
    borderColor: ds.borderColor || colors.background,
    hoverOffset: ds.hoverOffset ?? 10,
  }));

  const data = {
    labels: labels || [],
    datasets: formattedDatasets,
  };

  const baseOptions = chartDefaults(isDark);
  const options = {
    ...baseOptions,
    cutout,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        position: 'bottom',
        labels: {
          ...baseOptions.plugins.legend.labels,
          padding: 16,
        },
      },
    },
    ...extraOptions,
  };

  return (
    <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark' : ''} ${className}`}>
      <div className="card-body p-4 d-flex flex-column">
        {title && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faChartPie} className="text-primary" />
            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
              {title}
            </h6>
          </div>
        )}
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <ChartWrapper height={size} loading={loading} loadingHeight={size}>
            <div style={{ width: `${size}px`, maxWidth: '100%' }}>
              <Doughnut data={data} options={options} />
            </div>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};

export default AppDoughnutChart;
