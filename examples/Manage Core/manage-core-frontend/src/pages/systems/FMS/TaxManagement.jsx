import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt, faFileInvoiceDollar, faChartLine, faCheckCircle,
  faExclamationTriangle, faClock, faBuilding, faSearch,
  faFilter, faPlus, faArrowRight, faDownload, faEye,
  faGlobe, faHistory, faUserShield, faLock, faBalanceScale,
  faClipboardCheck, faFileExport, faCalendarAlt, faChartPie, faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getTabData } from '../../../api/fms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const TaxManagement = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const [metrics, setMetrics] = useState([]);
  const [upcomingFilings, setUpcomingFilings] = useState([]);
  const [taxTypeData, setTaxTypeData] = useState({ labels: [], datasets: [] });
  const [liabilityData, setLiabilityData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    getTabData('tax-management').then(res => {
      const d = res.data?.data || {};
      setMetrics(d.metrics || []);
      setUpcomingFilings(d.upcomingFilings || []);
      setTaxTypeData(d.taxTypeData || { labels: [], datasets: [] });
      setLiabilityData(d.liabilityData || { labels: [], datasets: [] });
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
            <h5 className="fw-bold mb-4">Tax Liability Trend</h5>
            <div style={{ height: '280px' }}><Line data={liabilityData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Tax Type Breakdown</h5>
            <div style={{ height: '220px' }}><Doughnut data={taxTypeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilings = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Upcoming Tax Filings</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-pill px-3"><FontAwesomeIcon icon={faFileExport} /> Export</button>
          <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} /> New Filing</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Filing ID</th><th>Type</th><th>Jurisdiction</th><th>Due Date</th><th>Amount</th><th className="text-end">Status</th></tr>
          </thead>
          <tbody>{upcomingFilings.map((f, i) => (
            <tr key={i} className="border-bottom">
              <td className="py-3 font-monospace small fw-bold">{f.id}</td>
              <td className="fw-bold">{f.type}</td>
              <td>{f.jurisdiction}</td>
              <td><span className={`badge bg-${new Date(f.due) - new Date() < 86400000 * 14 ? 'danger' : 'info'} bg-opacity-10 text-${new Date(f.due) - new Date() < 86400000 * 14 ? 'danger' : 'info'} px-2 py-1 rounded-pill`}>{f.due}</span></td>
              <td className="fw-bold">{f.amount}</td>
              <td className="text-end">
                <span className={`badge bg-${f.status === 'Completed' ? 'success' : f.status === 'In Progress' ? 'info' : f.status === 'Draft' ? 'secondary' : 'warning'} bg-opacity-10 text-${f.status === 'Completed' ? 'success' : f.status === 'In Progress' ? 'info' : f.status === 'Draft' ? 'secondary' : 'warning'} px-3 py-1.5 rounded-pill`}>{f.status}</span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderEnterprise = () => (
    <div className="row g-4">
      {[
        { title: 'Multi-Country Tax Compliance', desc: 'Manage tax compliance across multiple countries and jurisdictions', icon: faGlobe, color: 'primary' },
        { title: 'Automated Tax Filing', desc: 'Auto-file tax returns with regulatory authorities', icon: faFileExport, color: 'success' },
        { title: 'Regulatory Updates', desc: 'Automatic updates for tax law and regulatory changes', icon: faHistory, color: 'warning' },
        { title: 'Compliance Monitoring', desc: 'Real-time monitoring of tax compliance status', icon: faClipboardCheck, color: 'info' },
        { title: 'Audit Logs', desc: 'Complete audit trail of all tax management activities', icon: faShieldAlt, color: 'danger' },
        { title: 'Role-Based Access', desc: 'Granular permissions for tax management and filings', icon: faUserShield, color: 'secondary' },
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
    { id: 'filings', label: 'Filings', icon: faFileInvoiceDollar },
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
          {activeTab === 'filings' && renderFilings()}
          {activeTab === 'enterprise' && renderEnterprise()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaxManagement;
