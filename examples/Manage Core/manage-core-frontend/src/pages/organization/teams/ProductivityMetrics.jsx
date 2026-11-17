import React from 'react';
import { parseTimeToMinutes, calcProgress } from './teamsData';

const MetricBar = ({ label, value, color, percent }) => (
  <div className="col-4">
    <div className="text-muted mb-1" style={{ fontSize: 13 }}>{label}</div>
    <div className="fw-bold mb-2 text-dark" style={{ fontSize: 18 }}>{value}</div>
    <div className="progress rounded-pill shadow-sm" style={{ height: 4, backgroundColor: 'rgba(0,0,0,0.05)' }}>
      <div
        className="progress-bar rounded-pill transition-width"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const ProductivityMetrics = ({ team }) => {
  const totalStr = String(team.totalWorked || '0').includes(':') ? team.totalWorked : `${team.totalWorked}:00`;
  const totalMins = parseTimeToMinutes(totalStr);
  const productiveMins = parseTimeToMinutes(team.productive || '0:00');
  const manualMins = parseTimeToMinutes(team.manual || '0:00');
  const unproductiveMins = parseTimeToMinutes(team.unproductive || '0:00');

  return (
    <div>
      <div className="rounded-3 text-center py-2 px-3 mb-4" style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12 }}>
        <span className="text-muted small fw-medium">Total Worked (h) : </span>
        <span className="fw-bold text-dark" style={{ fontSize: 18 }}>{team.totalWorked}</span>
      </div>
      <div className="row g-2">
        <MetricBar
          label="Productive (h)"
          value={team.productive}
          color="#4F46E5"
          percent={calcProgress(productiveMins, totalMins)}
        />
        <MetricBar
          label="Manual (h)"
          value={team.manual}
          color="#F59E0B"
          percent={calcProgress(manualMins, totalMins)}
        />
        <MetricBar
          label="Unproductive"
          value={team.unproductive}
          color="#EF4444"
          percent={calcProgress(unproductiveMins, totalMins)}
        />
      </div>
    </div>
  );
};

export default ProductivityMetrics;
