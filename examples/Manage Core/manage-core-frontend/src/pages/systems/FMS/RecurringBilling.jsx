import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSync, faChartLine, faFileInvoiceDollar, faClock,
  faCheckCircle, faTimesCircle, faExclamationTriangle,
  faCalendarAlt, faDollarSign, faBell, faEnvelope,
  faSearch, faFilter, faPlus, faArrowRight, faCogs,
  faBuilding, faUsers, faHistory, faShieldAlt,
  faUserShield, faChartPie, faBan, faPlay, faPause
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const RecurringBilling = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [metrics, setMetrics] = useState([]);
  useEffect(() => { getTabData('recurring-billing').then(res => setMetrics(res.data?.data || [])).catch(() => {}); }, []);

  const [schedules, setSchedules] = useState([]);
  useEffect(() => { getTabData('recurring-billing').then(res => setSchedules(res.data?.data || [])).catch(() => {}); }, []);

  const [revenueData, setRevenueData] = useState({});
  useEffect(() => { getTabData('recurring-billing').then(res => setRevenueData(res.data?.data || {})).catch(() => {}); }, []);

  const [frequencyData, setFrequencyData] = useState({});
  useEffect(() => { getTabData('recurring-billing').then(res => setFrequencyData(res.data?.data || {})).catch(() => {}); }, []);

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
            <h5 className="fw-bold mb-4">Recurring Revenue Trajectory</h5>
            <div style={{ height: '280px' }}><Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Billing Frequency Split</h5>
            <div style={{ height: '220px' }}><Doughnut data={frequencyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedules = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Billing Schedules</h5>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '220px' }}>
            <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
            <input type="text" className="form-control bg-light border-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} /> New Schedule</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Schedule</th><th>Client</th><th>Amount</th><th>Frequency</th><th>Next Billing</th><th>Method</th><th className="text-end">Status</th></tr>
          </thead>
          <tbody>{schedules.map((s, i) => (
            <tr key={i} className="border-bottom">
              <td className="py-3 font-monospace small fw-bold">{s.id}</td>
              <td className="fw-bold">{s.client}</td>
              <td className="fw-bold">{s.amount}</td>
              <td><span className="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded-pill">{s.frequency}</span></td>
              <td className="small">{s.next}</td>
              <td className="small">{s.method}</td>
              <td className="text-end">
                <span className={`badge bg-${s.status === 'Active' ? 'success' : s.status === 'Past Due' ? 'warning' : 'secondary'} bg-opacity-10 text-${s.status === 'Active' ? 'success' : s.status === 'Past Due' ? 'warning' : 'secondary'} px-3 py-1.5 rounded-pill`}>{s.status}</span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderFrequencies = () => (
    <div className="row g-4">
      {[
        { freq: 'Daily', desc: 'Daily recurring invoices for daily service subscriptions', icon: faClock, color: '#4f46e5' },
        { freq: 'Weekly', desc: 'Weekly billing cycles for ongoing service retainers', icon: faCalendarAlt, color: '#10b981' },
        { freq: 'Monthly', desc: 'Standard monthly subscription billing', icon: faFileInvoiceDollar, color: '#0ea5e9' },
        { freq: 'Quarterly', desc: 'Quarterly billing for enterprise agreements', icon: faSync, color: '#f59e0b' },
        { freq: 'Semi-Annual', desc: 'Bi-annual billing cycles', icon: faHistory, color: '#8b5cf6' },
        { freq: 'Annual', desc: 'Yearly subscription billing with discount', icon: faDollarSign, color: '#f97316' },
        { freq: 'Custom Cycles', desc: 'Fully customizable billing schedules', icon: faCogs, color: '#ef4444' },
      ].map((f, i) => (
        <div className="col-md-4" key={i}>
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-3 p-2" style={{ backgroundColor: `${f.color}15` }}><FontAwesomeIcon icon={f.icon} style={{ color: f.color }} /></div>
              <h6 className="fw-bold mb-0">{f.freq}</h6>
            </div>
            <p className="text-muted small mb-0">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEnterprise = () => (
    <div className="row g-4">
      {[
        { title: 'Automated Invoice Generation', desc: 'Generate and send recurring invoices automatically', icon: faFileInvoiceDollar, color: 'primary' },
        { title: 'Automated Payment Collection', desc: 'Auto-collect payments via saved payment methods', icon: faDollarSign, color: 'success' },
        { title: 'Payment Retry Logic', desc: 'Smart retry scheduling for failed payments', icon: faSync, color: 'warning' },
        { title: 'Revenue Forecasting', desc: 'AI-powered revenue projections and trend analysis', icon: faChartLine, color: 'info' },
        { title: 'Audit Logs', desc: 'Complete audit trail of all billing operations', icon: faHistory, color: 'danger' },
        { title: 'Role-Based Access', desc: 'Granular permissions for billing management', icon: faUserShield, color: 'secondary' },
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
    { id: 'schedules', label: 'Schedules', icon: faSync },
    { id: 'frequencies', label: 'Frequencies', icon: faCalendarAlt },
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
          {activeTab === 'schedules' && renderSchedules()}
          {activeTab === 'frequencies' && renderFrequencies()}
          {activeTab === 'enterprise' && renderEnterprise()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecurringBilling;
