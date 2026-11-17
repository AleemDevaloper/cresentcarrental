import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_COLORS = {
  'To Do': '#0ea5e9',
  'In Progress': '#f59e0b',
  'Testing': '#8b5cf6',
  'Done': '#10b981',
};

const WorkStatusChart = ({ statusDistribution = {} }) => {
  const entries = Object.entries(statusDistribution)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || '#94a3b8',
    }));

  const totalTasks = entries.reduce((sum, entry) => sum + entry.value, 0);

  const data = {
    labels: entries.map(d => d.name),
    datasets: [{
      data: entries.map(d => d.value),
      backgroundColor: entries.map(d => d.color),
      borderWidth: 0,
      hoverOffset: 10,
      cutout: '75%'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: '#f1f5f9',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percent = totalTasks > 0 ? Math.round((value / totalTasks) * 100) : 0;
            return ` ${label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h5 className="fw-bold mb-0">Work Status</h5>
        </div>
        <p className="text-muted x-small mb-4">Overall Task Distribution</p>

        {totalTasks === 0 ? (
          <div className="text-center py-5 text-muted small">No tasks available</div>
        ) : (
          <>
            <div className="position-relative" style={{ height: '240px' }}>
              <Doughnut data={data} options={options} />
              <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
                <div className="h3 fw-bold mb-0 text-dark">{totalTasks}</div>
                <div className="x-small text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>Total Tasks</div>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <div className="row g-2">
                {entries.map((entry, index) => {
                  const percent = totalTasks > 0 ? Math.round((entry.value / totalTasks) * 100) : 0;
                  return (
                    <div key={index} className="col-6">
                      <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light shadow-sm-hover transition">
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faCircle} style={{ color: entry.color, fontSize: '8px' }} />
                          <span className="x-small fw-bold text-muted">{entry.name}</span>
                        </div>
                        <div className="text-end">
                            <div className="small fw-bold text-dark">{entry.value}</div>
                            <div className="x-small text-muted" style={{ fontSize: '8px' }}>{percent}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        .shadow-sm-hover:hover { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .bg-light-subtle { background-color: #f8fafc; }
      `}</style>
    </div>
  );
};

export default WorkStatusChart;