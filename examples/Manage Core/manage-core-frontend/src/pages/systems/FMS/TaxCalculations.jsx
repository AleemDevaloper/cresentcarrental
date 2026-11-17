import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator, faPercent, faChartLine, faCheckCircle,
  faExclamationTriangle, faDollarSign, faBuilding,
  faGlobe, faSearch, faFilter, faPlus, faArrowRight,
  faShieldAlt, faHistory, faUserShield, faLock,
  faFileInvoiceDollar, faChartPie, faBalanceScale,
  faClipboardList, faSlidersH, faClock
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getTabData } from '../../../api/fms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const TaxCalculations = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [metrics, setMetrics] = useState([]);
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [taxTypeData, setTaxTypeData] = useState({ labels: [], datasets: [] });
  const [slabData, setSlabData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    getTabData('tax-calculations').then(res => {
      const d = res.data?.data || {};
      setMetrics(d.metrics || []);
      setTaxSlabs(d.taxSlabs || []);
      setTaxTypeData(d.taxTypeData || { labels: [], datasets: [] });
      setSlabData(d.slabData || { labels: [], datasets: [] });
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
            <h5 className="fw-bold mb-4">Employee Distribution by Tax Slab</h5>
            <div style={{ height: '280px' }}><Bar data={slabData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Tax Type Distribution</h5>
            <div style={{ height: '220px' }}><Doughnut data={taxTypeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSlabs = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Tax Slabs & Brackets</h5>
        <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} /> Add Slab</button>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Slab Range</th><th>Rate</th><th>Bracket</th><th>Min</th><th>Max</th><th className="text-end">Employees</th></tr>
          </thead>
          <tbody>{taxSlabs.map((s, i) => (
            <tr key={i} className="border-bottom">
              <td className="py-3 fw-bold">{s.slab}</td>
              <td><span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-pill">{s.rate}</span></td>
              <td>{s.bracket}</td>
              <td>{s.min}</td>
              <td>{s.max}</td>
              <td className="text-end fw-bold">{s.employees}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderEnterprise = () => (
    <div className="row g-4">
      {[
        { title: 'Automatic Tax Updates', desc: 'Auto-update tax tables and rates based on regulatory changes', icon: faGlobe, color: 'primary' },
        { title: 'Multi-Country Tax Rules', desc: 'Handle tax calculations across multiple countries and regions', icon: faGlobe, color: 'success' },
        { title: 'Tax Simulation', desc: 'Simulate tax scenarios before processing payroll', icon: faCalculator, color: 'warning' },
        { title: 'Tax Compliance Validation', desc: 'Validate tax calculations against regulatory requirements', icon: faClipboardList, color: 'info' },
        { title: 'Audit Logs', desc: 'Complete audit trail of all tax calculations', icon: faHistory, color: 'danger' },
        { title: 'Role-Based Access', desc: 'Granular permissions for tax configuration and processing', icon: faUserShield, color: 'secondary' },
      ].map((f, i) => (
        <div className="col-md-4" key={i}>
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className={`rounded-3 p-2 d-inline-flex mb-3 bg-${f.color} bg-opacity-10 text-${f.color}`}><FontAwesomeIcon icon={f.icon} className="fs-4" /></div>
            <h5 className="fw-bold">{f.title}</h5>
            <p className="text-muted small mb-0">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const subTabs = [
    { id: 'overview', label: 'Dashboard', icon: faChartLine },
    { id: 'slabs', label: 'Tax Slabs', icon: faSlidersH },
    { id: 'enterprise', label: 'Enterprise', icon: faShieldAlt },
  ];

  return (
    <div className={isDark ? 'text-white' : 'text-dark'}>
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
        {subTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === tab.id ? 'btn-primary shadow-sm' : 'btn-outline-secondary bg-transparent border-0 text-muted'}`}>
            <FontAwesomeIcon icon={tab.icon} className="me-2" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'slabs' && renderSlabs()}
          {activeTab === 'enterprise' && renderEnterprise()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaxCalculations;
