import React, { useState, useEffect } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire,
  faTriangleExclamation,
  faCheckCircle,
  faFlagCheckered,
  faChartLine,
  faArrowTrendDown,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { getBurndownCharts } from '../../../../api/tms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TmsBurndownCharts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await getBurndownCharts();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch burndown data', err);
      setError(err.response?.data?.message || err.message || 'Failed to load burndown data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" size="2x" />
        <p className="text-danger mb-3">{error}</p>
        <button className="btn btn-primary rounded-pill px-4" onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const labels = data.labels || ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];
  const ideal = data.ideal || [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
  const actual = data.actual || [100, 95, 88, 72, 68, 55, 52, 38, 30, 15, 5];
  const remainingSP = data.remaining_sp ?? 15;
  const totalSP = data.total_sp ?? 100;
  const velocity = data.velocity ?? 42;
  const healthPct = data.health_percent ?? 94;
  const sprintName = data.sprint_name || 'Sprint 25 • "Delta"';
  const status = data.status || 'On Track';
  const riskMessage = data.risk_message || 'Current burn rate is slightly slower than ideal. Ensure 2 pending critical bugs are resolved by Day 8 to avoid overflow.';

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ideal Burn',
        data: ideal,
        borderColor: '#94A3B8',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      },
      {
        label: 'Actual Burn',
        data: actual,
        borderColor: '#2828e2',
        backgroundColor: 'rgba(40, 40, 226, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end' },
      tooltip: { backgroundColor: '#1e293b' }
    },
    scales: {
      y: { title: { display: true, text: 'Story Points Remaining' }, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } },
    },
  };

  const statusColor = status.toLowerCase().includes('risk') ? 'danger' : status.toLowerCase().includes('behind') ? 'warning' : 'success';

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Sprint Velocity & Burn</h2>
          <p className="text-muted small mb-0">Agile execution tracking for high-performance delivery teams.</p>
        </div>
        <div className="d-flex gap-3">
            <div className="text-end">
                <div className="x-small text-muted fw-bold text-uppercase">Current Sprint</div>
                <div className="fw-bold text-primary">{sprintName}</div>
            </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-9">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Story Point Burndown</h5>
                <div className={`badge rounded-pill bg-${statusColor} bg-opacity-10 text-${statusColor} px-3 py-2`}>
                    <FontAwesomeIcon icon={faArrowTrendDown} className="me-2" /> {status}
                </div>
             </div>
             <div style={{ height: '400px' }}>
                <Line data={chartData} options={options} />
             </div>
          </div>
        </div>

        <div className="col-xl-3">
          <div className="d-grid gap-4 h-100">
            {[
              { label: 'Remaining SP', value: String(remainingSP), sub: `of ${totalSP} total`, icon: faFire, color: 'danger' },
              { label: 'Team Velocity', value: String(velocity), sub: 'Avg SP / Sprint', icon: faChartLine, color: 'primary' },
              { label: 'Sprint Health', value: `${healthPct}%`, sub: 'Completion Probability', icon: faCheckCircle, color: 'success' },
            ].map((stat, i) => (
              <div className="card border-0 shadow-sm rounded-4 p-4" key={i}>
                <div className={`bg-${stat.color} bg-opacity-10 p-2 rounded-3 d-inline-block mb-3`} style={{ width: 'fit-content' }}>
                    <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color}`} />
                </div>
                <h3 className="fw-bold mb-1">{stat.value}</h3>
                <p className="text-muted small mb-0 fw-bold">{stat.label}</p>
                <div className="x-small text-muted opacity-75">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
            <div className={`card border-0 shadow-sm rounded-4 p-4 bg-warning bg-opacity-10 border-warning border-opacity-20 border`}>
                <div className="d-flex align-items-center gap-3 text-warning-emphasis">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="fs-4" />
                    <div>
                        <h6 className="fw-bold mb-1">Sprint Risk Detected</h6>
                        <p className="small mb-0 opacity-90">{riskMessage}</p>
                    </div>
                    <button className="btn btn-warning btn-sm rounded-pill ms-auto px-4 fw-bold">View Blockers</button>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default TmsBurndownCharts;
