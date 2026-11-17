import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faLightbulb,
  faFilter,
  faDownload,
  faCalendarAlt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { getTaskCompletionReports } from '../../../../api/tms';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const iconMap = {
  faChartLine,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
};

const TmsTaskCompletionReports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    getTaskCompletionReports()
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching task completion reports:', err);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    if (!reportData?.stats) return [];
    return reportData.stats.map(stat => ({
      ...stat,
      icon: iconMap[stat.icon] || faChartLine
    }));
  }, [reportData]);

  const lineData = useMemo(() => {
    return {
      labels: reportData?.lineData?.labels || [],
      datasets: [
        {
          label: 'Completion Rate %',
          data: reportData?.lineData?.data || [],
          borderColor: '#2828e2',
          backgroundColor: 'rgba(40, 40, 226, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [reportData]);

  const priorityData = useMemo(() => {
    return {
      labels: reportData?.priorityData?.labels || [],
      datasets: [
        {
          data: reportData?.priorityData?.data || [],
          backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
          borderWidth: 0,
        },
      ],
    };
  }, [reportData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: { grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 p-5">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-primary fs-1 mb-3" />
          <p className="text-muted">Loading intelligence reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container p-4">
      {/* Header Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Task Completion Analysis</h2>
          <p className="text-muted small mb-0">Real-time operational intelligence on task delivery.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-white shadow-sm rounded-pill px-3 border">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" /> Last 30 Days
          </button>
          <button className="btn btn-white shadow-sm rounded-pill px-3 border">
            <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" /> Filters
          </button>
          <button className="btn btn-primary shadow-sm rounded-pill px-3">
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="card border-0 shadow-sm rounded-4 p-4 hover-lift h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-4`}>
                  <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color} fs-4`} />
                </div>
                <div className={`badge rounded-pill bg-${stat.up ? 'success' : 'danger'} bg-opacity-10 text-${stat.up ? 'success' : 'danger'} p-2 px-3`}>
                  <FontAwesomeIcon icon={stat.up ? faArrowUp : faArrowDown} className="me-1" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="display-6 fw-bold mb-1">{stat.value}</h3>
              <p className="text-muted small fw-semibold mb-0 text-uppercase letter-spacing-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Main Trend Chart */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Completion Velocity</h5>
              <div className="dropdown">
                <button className="btn btn-light btn-sm rounded-pill border-0 px-3" type="button">Monthly</button>
              </div>
            </div>
            <div style={{ height: '350px' }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4 text-primary text-center">Priority Distribution</h5>
            <div style={{ height: '250px' }} className="mb-4">
              <Doughnut 
                data={priorityData} 
                options={{
                  ...chartOptions,
                  cutout: '75%',
                  plugins: { legend: { display: true, position: 'bottom' } }
                }} 
              />
            </div>
            <div className="mt-auto">
              <div className="alert alert-primary bg-opacity-10 border-0 rounded-4 p-3 mb-0">
                <div className="d-flex gap-3">
                  <div className="bg-primary bg-opacity-20 p-2 rounded-3 h-100">
                    <FontAwesomeIcon icon={faLightbulb} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-bold text-primary mb-1">AI Insights</h6>
                    <p className="small mb-0 opacity-75">{reportData?.aiInsight}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-lift {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        .letter-spacing-1 {
          letter-spacing: 1px;
        }
        .btn-white {
          background: #fff;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default TmsTaskCompletionReports;
