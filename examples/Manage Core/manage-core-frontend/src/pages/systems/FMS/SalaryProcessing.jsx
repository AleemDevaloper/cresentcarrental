import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign, faUsers, faCalculator, faCheckCircle,
  faClock, faChartLine, faBuilding, faWallet,
  faSearch, faFilter, faPlus, faArrowRight,
  faPercent, faChartPie, faFileInvoiceDollar,
  faShieldAlt, faHistory, faUserShield, faBan,
  faGlobe, faLock
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getTabData } from '../../../api/fms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const SalaryProcessing = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [metrics, setMetrics] = useState([]);
  const [salaryBands, setSalaryBands] = useState([]);
  const [bandData, setBandData] = useState({ labels: [], datasets: [] });
  const [componentData, setComponentData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    getTabData('salary-processing').then(res => {
      const d = res.data?.data || {};
      setMetrics(d.metrics || []);
      setSalaryBands(d.salaryBands || []);
      setBandData(d.bandData || { labels: [], datasets: [] });
      setComponentData(d.componentData || { labels: [], datasets: [] });
    }).catch(() => {});
  }, []);

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="row g-3">{metrics.map((m, i) => (
        <div className="col-xl-2 col-lg-4 col-md-6" key={i}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`card border-0 shadow-sm p-3 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rounded-3 p-2" style={{ backgroundColor: `${m.color}15` }}><FontAwesomeIcon icon={m.icon} style={{ color: m.color }} /></div>
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '10px' }}>{m.label}</span>
            </div>
            <h4 className="fw-black mb-0">{m.value}</h4>
            <small className={`fw-bold ${m.trend === 'up' ? 'text-success' : 'text-danger'}`}><FontAwesomeIcon icon={m.trend === 'up' ? faChartLine : faClock} className="me-1" />{m.delta}</small>
          </motion.div>
        </div>
      ))}</div>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Employee Distribution by Salary Band</h5>
            <div style={{ height: '280px' }}><Bar data={bandData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Salary Component Split</h5>
            <div style={{ height: '220px' }}><Doughnut data={componentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBands = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Salary Bands & Grades</h5>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '220px' }}>
            <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
            <input type="text" className="form-control bg-light border-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} /> New Band</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Grade</th><th>Min</th><th>Max</th><th>Median</th><th>Employees</th><th className="text-end">Distribution</th></tr>
          </thead>
          <tbody>{salaryBands.map((b, i) => (
            <tr key={i} className="border-bottom">
              <td className="py-3 fw-bold">{b.grade}</td>
              <td className="fw-bold">{b.min}</td>
              <td className="fw-bold">{b.max}</td>
              <td className="fw-bold">{b.median}</td>
              <td>{b.employees}</td>
              <td className="text-end">
                <div className="progress d-inline-flex" style={{ width: '100px', height: '6px' }}>
                  <div className="progress-bar" style={{ width: `${(b.employees / 312) * 100}%`, backgroundColor: b.color }}></div>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={isDark ? 'text-white' : 'text-dark'}>
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
        {[
          { id: 'overview', label: 'Overview', icon: faChartLine },
          { id: 'bands', label: 'Salary Bands', icon: faCalculator },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === tab.id ? 'btn-primary shadow-sm' : 'btn-outline-secondary bg-transparent border-0 text-muted'}`}>
            <FontAwesomeIcon icon={tab.icon} className="me-2" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'bands' && renderBands()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SalaryProcessing;
