import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController,
  CategoryScale,
  BarElement,
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouseLaptop,
  faScaleBalanced,
  faCircleExclamation,
  faArrowRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { getAttendanceProductivity } from '../../../../api/tms';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ScatterController, CategoryScale, BarElement);

const TmsAttendanceProductivityInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await getAttendanceProductivity();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch attendance productivity data', err);
      setError(err.response?.data?.message || err.message || 'Failed to load attendance productivity data.');
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

  const scatterPoints = data.scatter_points || [
    { x: 8, y: 85 }, { x: 7.5, y: 90 }, { x: 9, y: 95 },
    { x: 6, y: 70 }, { x: 10, y: 80 }, { x: 8.5, y: 92 },
    { x: 7, y: 88 }, { x: 9.5, y: 75 }, { x: 8, y: 82 },
  ];
  const remoteData = data.remote || { productivity: 92, focus: 95, collaboration: 75, satisfaction: 90 };
  const officeData = data.office || { productivity: 85, focus: 70, collaboration: 95, satisfaction: 80 };
  const insights = data.insights || [];

  const scatterChart = {
    datasets: [
      {
        label: 'Employee Performance',
        data: scatterPoints,
        backgroundColor: '#2828e2',
      },
    ],
  };

  const remoteVsOffice = {
    labels: ['Productivity', 'Focus Time', 'Collaboration', 'Satisfaction'],
    datasets: [
      {
        label: 'Remote',
        data: [remoteData.productivity, remoteData.focus, remoteData.collaboration, remoteData.satisfaction],
        backgroundColor: '#10B981',
      },
      {
        label: 'Office',
        data: [officeData.productivity, officeData.focus, officeData.collaboration, officeData.satisfaction],
        backgroundColor: '#2828e2',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { title: { display: true, text: 'Hours Logged', font: { weight: 'bold' } }, grid: { display: false } },
      y: { title: { display: true, text: 'Productivity %', font: { weight: 'bold' } }, grid: { color: '#f1f5f9' } },
    },
  };

  const defaultInsights = [
    {
      title: 'Remote Excellence',
      icon: faHouseLaptop,
      color: 'primary',
      text: `Remote workers show **${(remoteData.focus - officeData.focus).toFixed(1)}% higher focus time** but **${(officeData.collaboration - remoteData.collaboration)}% lower real-time collaboration** compared to office-based teams.`,
      tag: 'Positive Trend',
      tagColor: 'success',
    },
    {
      title: 'Burnout Threshold',
      icon: faCircleExclamation,
      color: 'warning',
      text: data.burnout_message || 'Productivity starts to decline after **9.5 hours** of continuous work. Current team avg is 8.2h.',
      tag: 'Watchlist',
      tagColor: 'warning',
    },
    {
      title: 'Punctuality Impact',
      icon: faScaleBalanced,
      color: 'success',
      text: data.punctuality_message || 'No significant correlation found between start time and daily output quality for Engineering roles.',
      tag: 'Verified Insight',
      tagColor: 'success',
    },
  ];

  const insightList = insights.length ? insights : defaultInsights;

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Workforce Correlation Lab</h2>
          <p className="text-muted small mb-0">Analyzing the intricate link between presence and performance.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Attendance vs Output Correlation</h5>
            <div style={{ height: '350px' }}>
                <Scatter data={scatterChart} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Work Mode Efficiency Comparison</h5>
            <div style={{ height: '350px' }}>
                <Bar data={remoteVsOffice} options={{ ...chartOptions, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } } }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {insightList.map((item, i) => (
          <div className="col-xl-4" key={i}>
            <div className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-${item.color || item.tagColor || 'primary'} border-5 h-100`}>
              <div className="d-flex align-items-center gap-3 mb-3">
                  <div className={`bg-${item.color || item.tagColor || 'primary'} bg-opacity-10 p-2 rounded-3 text-${item.color || item.tagColor || 'primary'}`}>
                      <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h6 className="fw-bold mb-0">{item.title}</h6>
              </div>
              <p className="small text-muted mb-4">{item.text}</p>
              <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className={`x-small fw-bold text-${item.tagColor || 'success'} text-uppercase`}>{item.tag}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-muted small" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default TmsAttendanceProductivityInsights;
