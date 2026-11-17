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
  faMicrochip,
  faTriangleExclamation,
  faArrowTrendUp,
  faBrain,
  faBolt,
  faMagicWandSparkles,
  faUserPlus,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { getForecastingAnalytics } from '../../../../api/tms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TmsForecastingAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await getForecastingAnalytics();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch forecasting data', err);
      setError(err.response?.data?.message || err.message || 'Failed to load forecasting data.');
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

  const historical = data.historical || [];
  const projected = data.projected || [];
  const labels = data.labels || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const insights = data.insights || [];
  const capacitySim = data.capacity_simulation || {};
  const aiConfidence = data.ai_confidence ?? 94;
  const deliveryImpact = data.delivery_impact || '-18 Days';
  const efficiencyGain = data.efficiency_gain || '+12.4%';
  const hiringScenario = data.hiring_scenario || 'Add 2 Senior Developers';
  const aiMessage = data.ai_message || 'Hiring 2 senior developers now will stabilize Sprint 30 delivery timelines by 92% confidence.';

  const forecastData = {
    labels,
    datasets: [
      {
        label: 'Historical Performance',
        data: historical,
        borderColor: '#2828e2',
        backgroundColor: '#2828e2',
        tension: 0.4,
      },
      {
        label: 'AI Projection',
        data: projected,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { grid: { color: '#f1f5f9' }, border: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Operational Forecasting</h2>
          <p className="text-muted small mb-0">Predictive modeling and capacity simulations for future delivery.</p>
        </div>
        <div className="d-flex gap-2">
            <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                <FontAwesomeIcon icon={faMagicWandSparkles} className="me-2" /> Run AI Simulation
            </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Projected Delivery Velocity</h5>
                <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
                    <FontAwesomeIcon icon={faBrain} className="me-2" /> AI Confidence: {aiConfidence}%
                </div>
             </div>
             <div style={{ height: '350px' }}>
                <Line data={forecastData} options={chartOptions} />
             </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100 position-relative overflow-hidden">
             <div className="position-relative" style={{ zIndex: 1 }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faMicrochip} className="text-primary" /> Capacity Simulator
                </h5>
                <div className="p-3 rounded-4 bg-white bg-opacity-10 mb-4 border border-white border-opacity-10">
                    <label className="x-small text-white text-opacity-50 fw-bold text-uppercase mb-2">Scenario: {hiringScenario}</label>
                    <div className="d-flex align-items-center gap-3">
                        <input type="range" className="form-range flex-grow-1" min="0" max="10" defaultValue={capacitySim.devs || 2} />
                        <span className="fw-bold text-primary">+{capacitySim.devs || 2} Devs</span>
                    </div>
                </div>
                
                <div className="d-grid gap-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="small opacity-75">Delivery Impact</span>
                        <span className="text-success fw-bold">{deliveryImpact}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="small opacity-75">Efficiency Gain</span>
                        <span className="text-primary fw-bold">{efficiencyGain}</span>
                    </div>
                </div>

                <div className="alert alert-primary bg-opacity-20 border-0 rounded-4 p-3 mb-0 text-white">
                    <div className="d-flex gap-3 align-items-start">
                        <FontAwesomeIcon icon={faBolt} className="text-primary mt-1" />
                        <p className="x-small mb-0">{aiMessage}</p>
                    </div>
                </div>
             </div>
             <div className="position-absolute top-0 end-0 m-n5 p-5 bg-primary bg-opacity-20 rounded-circle" style={{ width: 250, height: 250 }} />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {(insights.length ? insights : [
          { label: 'Hiring Needs', icon: faUserPlus, color: 'primary', text: 'Recommend 2 Frontend & 1 QA for Q3 scalability.' },
          { label: 'Delay Prediction', icon: faTriangleExclamation, color: 'danger', text: 'Potential 4-day delay in "Alpha" project due to resource gap.' },
          { label: 'Growth Forecast', icon: faArrowTrendUp, color: 'success', text: 'Team output expected to grow by 22% in next 6 months.' },
        ]).map((item, i) => (
          <div className="col-lg-4" key={i}>
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 border-bottom border-4" style={{ borderColor: `var(--bs-${item.color})` }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className={`bg-${item.color} bg-opacity-10 p-3 rounded-4`}>
                  <FontAwesomeIcon icon={item.icon} className={`text-${item.color} fs-4`} />
                </div>
                <h6 className="fw-bold mb-0">{item.label}</h6>
              </div>
              <p className="text-muted small mb-0">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .x-small { font-size: 11px; }
        .form-range::-webkit-slider-thumb { background: #2828e2; }
      `}</style>
    </div>
  );
};

export default TmsForecastingAnalytics;
