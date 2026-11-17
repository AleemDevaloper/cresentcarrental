import React, { useState } from 'react';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faChartBar, faChartPie, faChartArea,
  faCrosshairs, faDownload, faFilePdf, faFileExcel,
  faFileCsv, faImage, faExpand, faCompress,
  faCalendarAlt, faFilter, faSync, faExclamationTriangle,
  faUserGraduate, faMoneyBillWave, faBook, faTruck,
  faGraduationCap, faPercent
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const CHART_TYPES = [
  { key: 'line', label: 'Line', icon: faChartLine },
  { key: 'bar', label: 'Bar', icon: faChartBar },
  { key: 'pie', label: 'Pie', icon: faChartPie },
  { key: 'doughnut', label: 'Doughnut', icon: faChartArea },
  { key: 'radar', label: 'Radar', icon: faCrosshairs },
];

const ANALYTICS_CARDS = [
  { id: 'attendance', label: 'Attendance Rate', value: '89.9%', icon: faUserGraduate, color: '#6366f1', trend: '+2.1%', data: [82, 85, 87, 86, 89, 90, 89.9] },
  { id: 'academic', label: 'Academic Performance', value: '3.4 GPA', icon: faGraduationCap, color: '#10b981', trend: '+0.2', data: [3.1, 3.2, 3.3, 3.2, 3.4, 3.3, 3.4] },
  { id: 'fee', label: 'Fee Collection', value: '85%', icon: faMoneyBillWave, color: '#f59e0b', trend: '+5%', data: [72, 75, 78, 80, 82, 84, 85] },
  { id: 'library', label: 'Library Usage', value: '3,200', icon: faBook, color: '#06b6d4', trend: '+12%', data: [2200, 2400, 2600, 2800, 3000, 3100, 3200] },
  { id: 'transport', label: 'Transport Usage', value: '1,200', icon: faTruck, color: '#8b5cf6', trend: '+8%', data: [850, 920, 980, 1050, 1100, 1150, 1200] },
];

const EmsAnalytics = () => {
  const { theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('attendance');
  const [dateRange, setDateRange] = useState('This Year');
  const [fullscreen, setFullscreen] = useState(false);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const card = ANALYTICS_CARDS.find(c => c.id === selectedMetric) || ANALYTICS_CARDS[0];

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [{
      label: card.label,
      data: card.data,
      borderColor: card.color,
      backgroundColor: chartType === 'line' ? `${card.color}20` : chartType === 'bar' ? card.color : [card.color, '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#ef4444'],
      fill: chartType === 'line',
      tension: 0.4,
      pointBackgroundColor: card.color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: mutedColor, font: { size: 10 } } }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: chartType === 'pie' || chartType === 'doughnut' ? undefined : { y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } } },
  };

  const renderChart = () => {
    const commonProps = { data: chartData, options: chartOptions };
    switch (chartType) {
      case 'line': return <Line {...commonProps} />;
      case 'bar': return <Bar {...commonProps} />;
      case 'pie': return <Pie {...commonProps} />;
      case 'doughnut': return <Doughnut {...commonProps} />;
      case 'radar': return <Radar {...commonProps} />;
      default: return <Line {...commonProps} />;
    }
  };

  return (
    <div className={`p-4 ${isDark ? 'text-white' : ''}`} style={{ background: isDark ? 'linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)' : 'linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)', minHeight: '100vh' }}>
      <div className={`rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? 'bg-dark border border-secondary' : 'bg-white'}`} style={{ background: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.9)', border: `1px solid ${borderColor}`, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div>
            <h4 className="fw-bold mb-1">EMS Analytics</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Institutional performance metrics and insights</p>
          </div>
          <div className="d-flex gap-2">
            <div className="dropdown">
              <button className={`btn rounded-3 dropdown-toggle d-flex align-items-center gap-2 ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`} data-bs-toggle="dropdown">
                <FontAwesomeIcon icon={faDownload} /> Export
              </button>
              <ul className="dropdown-menu rounded-3 shadow-sm border-0">
                <li><button className="dropdown-item small"><FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />PDF</button></li>
                <li><button className="dropdown-item small"><FontAwesomeIcon icon={faFileExcel} className="me-2 text-success" />Excel</button></li>
                <li><button className="dropdown-item small"><FontAwesomeIcon icon={faFileCsv} className="me-2 text-primary" />CSV</button></li>
                <li><button className="dropdown-item small"><FontAwesomeIcon icon={faImage} className="me-2 text-info" />Image</button></li>
              </ul>
            </div>
            <button className={`btn rounded-3 ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`} onClick={() => setFullscreen(!fullscreen)}>
              <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <label className="small fw-bold text-muted mb-2">Date Range</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={dateRange} onChange={e => setDateRange(e.target.value)}>
              <option>This Week</option><option>This Month</option><option>This Quarter</option><option>This Year</option><option>Custom</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted mb-2">Chart Type</label>
            <div className="d-flex gap-1">
              {CHART_TYPES.map(ct => (
                <button key={ct.key} className={`btn btn-sm rounded-3 ${chartType === ct.key ? 'btn-primary' : isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`} onClick={() => setChartType(ct.key)} title={ct.label}>
                  <FontAwesomeIcon icon={ct.icon} />
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-outline-primary rounded-3 w-100"><FontAwesomeIcon icon={faSync} className="me-2" />Refresh Data</button>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {ANALYTICS_CARDS.map(c => (
          <div key={c.id} className="col-md" style={{ minWidth: '180px' }}>
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'} ${selectedMetric === c.id ? 'ring-2 ring-primary' : ''}`} style={{ cursor: 'pointer', outline: selectedMetric === c.id ? `2px solid ${c.color}` : 'none', boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)' }} onClick={() => setSelectedMetric(c.id)}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${c.color}15` }}>
                    <FontAwesomeIcon icon={c.icon} style={{ color: c.color, fontSize: '14px' }} />
                  </div>
                  <span className="badge rounded-pill bg-success-subtle text-success ms-auto x-small">{c.trend}</span>
                </div>
                <h5 className="fw-bold mb-0" style={{ color: textColor, fontSize: '18px' }}>{c.value}</h5>
                <span className="x-small fw-semibold" style={{ color: mutedColor }}>{c.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 18px 44px rgba(15, 23, 42, 0.10)' }}>
        <div className={`card-body p-4 ${fullscreen ? 'vh-100 d-flex flex-column justify-content-center' : ''}`}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>{card.label} - {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</h6>
            <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{dateRange}</span>
          </div>
          <div style={{ height: fullscreen ? '70vh' : '350px' }}>
            {renderChart()}
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default EmsAnalytics;
