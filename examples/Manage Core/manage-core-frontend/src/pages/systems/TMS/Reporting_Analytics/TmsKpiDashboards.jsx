import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faChartPie,
  faScaleBalanced,
  faSitemap,
  faGem,
  faArrowUp,
  faArrowDown,
  faLightbulb,
  faCrosshairs,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { getKpiDashboards } from '../../../../api/tms';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const TmsKpiDashboards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await getKpiDashboards();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch KPI data', err);
      setError(err.response?.data?.message || err.message || 'Failed to load KPI data.');
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

  const kpis = data.kpis || {};
  const departments = data.departments || [];
  const insights = data.insights || [];

  const departmentData = {
    labels: departments.length ? departments.map(d => d.name) : ['Engineering', 'Marketing', 'Sales', 'Design', 'Support'],
    datasets: [
      {
        label: 'Efficiency %',
        data: departments.length ? departments.map(d => d.efficiency ?? 0) : [92, 78, 85, 94, 88],
        backgroundColor: '#2828e2',
        borderRadius: 8,
      },
      {
        label: 'Utilization %',
        data: departments.length ? departments.map(d => d.utilization ?? 0) : [88, 82, 90, 85, 92],
        backgroundColor: '#94A3B8',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: { grid: { color: '#f1f5f9' }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  const strategicMetrics = [
    { label: kpis.completion_rate?.label || 'Completion Rate', value: `${kpis.completion_rate?.value ?? 0}${kpis.completion_rate?.unit || '%'}`, trend: kpis.completion_rate?.trend || '+0%', up: true, icon: faGem, color: 'primary' },
    { label: kpis.overdue_rate?.label || 'Overdue Rate', value: `${kpis.overdue_rate?.value ?? 0}${kpis.overdue_rate?.unit || '%'}`, trend: kpis.overdue_rate?.trend || '+0%', up: false, icon: faScaleBalanced, color: 'danger' },
    { label: kpis.avg_completion_time?.label || 'Avg Completion Time', value: `${kpis.avg_completion_time?.value ?? 0} ${kpis.avg_completion_time?.unit || 'days'}`, trend: kpis.avg_completion_time?.trend || null, up: true, icon: faSitemap, color: 'info' },
    { label: kpis.total_tasks?.label || 'Total Tasks', value: kpis.total_tasks?.value ?? 0, trend: kpis.total_tasks?.trend || '+0%', up: true, icon: faCrosshairs, color: 'warning' },
  ];

  const defaultInsights = [
    `Total tasks: ${kpis.total_tasks?.value ?? 0}, Completed: ${kpis.completed_tasks?.value ?? 0}.`,
    `Overdue tasks: ${kpis.overdue_tasks?.value ?? 0} (${kpis.overdue_rate?.value ?? 0}% overdue rate).`,
    `In Progress: ${kpis.in_progress_tasks?.value ?? 0} tasks currently active.`,
    `Avg completion time: ${kpis.avg_completion_time?.value ?? 0} ${kpis.avg_completion_time?.unit || 'days'}.`
  ];
  const insightList = insights.length ? insights : defaultInsights;

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Executive KPI Command</h2>
          <p className="text-muted small mb-0">Strategic overview of organizational health and operational efficiency.</p>
        </div>
        <div className="d-flex gap-2">
            <div className="badge rounded-pill bg-success bg-opacity-10 text-success p-2 px-3 border border-success border-opacity-20">
                <span className="dot bg-success me-2" /> Live System Health: {data.system_health || 'Optimal'}
            </div>
        </div>
      </div>

      {/* Strategic Metrics */}
      <div className="row g-4 mb-4">
        {strategicMetrics.map((item, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 position-relative">
                <div className={`text-${item.color} mb-3`}>
                    <FontAwesomeIcon icon={item.icon} className="fs-4" />
                </div>
                <h3 className="fw-bold mb-1">{item.value}</h3>
                <p className="text-muted small fw-bold text-uppercase letter-spacing-1 mb-0">{item.label}</p>
                {item.trend && (
                  <div className={`mt-3 small text-${item.up ? 'success' : 'danger'} fw-bold`}>
                      <FontAwesomeIcon icon={item.up ? faArrowUp : faArrowDown} className="me-1" />
                      {item.trend} <span className="text-muted fw-normal ms-1">vs last month</span>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Departmental Performance */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Departmental Intelligence</h5>
                <button className="btn btn-light btn-sm rounded-pill px-3">Filter Dept</button>
             </div>
             <div style={{ height: '350px' }}>
                <Bar data={departmentData} options={chartOptions} />
             </div>
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white position-relative overflow-hidden">
             <div className="position-relative" style={{ zIndex: 1 }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faLightbulb} /> Strategic Insights
                </h5>
                <div className="d-grid gap-3">
                    {insightList.slice(0, 4).map((text, i) => (
                        <div key={i} className="p-3 rounded-4 border  bg-white bg-opacity-10 d-flex gap-3">
                            <div className="text-white opacity-50 mt-1"><FontAwesomeIcon icon={faTrophy} className="small" /></div>
                            <p className="small mb-0 opacity-90">{text}</p>
                        </div>
                    ))}
                </div>
                <button className="btn btn-white w-100 rounded-pill mt-4 py-3 fw-bold text-primary shadow-lg">Generate Executive Summary</button>
             </div>
             <div className="position-absolute bottom-0 end-0 m-n5 p-5 bg-white bg-opacity-10 rounded-circle" style={{ width: 250, height: 250 }} />
          </div>
        </div>
      </div>

      <style>{`
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .btn-white { background: white; color: #2828e2; }
      `}</style>
    </div>
  );
};

export default TmsKpiDashboards;
