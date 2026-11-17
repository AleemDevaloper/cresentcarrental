import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt, faDownload, faEnvelope, faCheckCircle,
  faClock, faSearch, faFilter, faPlus, faArrowRight,
  faUser, faDollarSign, faPercent, faBuilding,
  faShieldAlt, faHistory, faUserShield, faLock,
  faGlobe, faPrint, faEye, faStar, faPenFancy,
  faChartLine, faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getTabData } from '../../../api/fms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const PayslipGeneration = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const [metrics, setMetrics] = useState([]);
  const [recentPayslips, setRecentPayslips] = useState([]);
  const [distributionData, setDistributionData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    getTabData('payslip-generation').then(res => {
      const d = res.data?.data || {};
      setMetrics(d.metrics || []);
      setRecentPayslips(d.recentPayslips || []);
      setDistributionData(d.distributionData || { labels: [], datasets: [] });
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
            <h5 className="fw-bold mb-4">Payslip Generation Trend</h5>
            <div style={{ height: '280px' }}><Line data={distributionData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-3">Payslip Sections</h5>
            {['Employee Information', 'Salary Breakdown', 'Allowances', 'Deductions', 'Taxes', 'Attendance Summary', 'Overtime Summary', 'Loan Deductions', 'Net Salary'].map((s, i) => (
              <div key={i} className="d-flex align-items-center gap-2 py-1.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-success" style={{ fontSize: '10px' }} />
                <span className="small">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayslips = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Recent Payslips</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-pill px-3"><FontAwesomeIcon icon={faFilter} /> Filter</button>
          <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} /> Generate</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Payslip ID</th><th>Employee</th><th>Department</th><th>Period</th><th>Gross</th><th>Net</th><th>Date</th><th className="text-end">Status</th></tr>
          </thead>
          <tbody>{recentPayslips.map((p, i) => (
            <tr key={i} className="border-bottom">
              <td className="py-3 font-monospace small fw-bold">{p.id}</td>
              <td>{p.employee}</td>
              <td>{p.dept}</td>
              <td>{p.period}</td>
              <td className="fw-bold">{p.gross}</td>
              <td className="fw-bold text-success">{p.net}</td>
              <td className="small">{p.date}</td>
              <td className="text-end">
                <span className={`badge bg-${p.status === 'Delivered' ? 'success' : p.status === 'Emailed' ? 'info' : 'warning'} bg-opacity-10 text-${p.status === 'Delivered' ? 'success' : p.status === 'Emailed' ? 'info' : 'warning'} px-3 py-1.5 rounded-pill`}>{p.status}</span>
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
        { title: 'Company Branding', desc: 'Custom branded payslip templates with company logo', icon: faPenFancy, color: 'primary' },
        { title: 'Digital Signature', desc: 'Digitally signed payslips for authenticity', icon: faShieldAlt, color: 'success' },
        { title: 'Password-Protected PDF', desc: 'Secure PDFs with employee-specific passwords', icon: faLock, color: 'warning' },
        { title: 'Bulk Email Distribution', desc: 'Automated bulk email delivery of payslips', icon: faEnvelope, color: 'info' },
        { title: 'Audit Logs', desc: 'Complete trail of payslip generation and access', icon: faHistory, color: 'danger' },
        { title: 'Role-Based Access', desc: 'Granular permissions for payslip operations', icon: faUserShield, color: 'secondary' },
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
    { id: 'payslips', label: 'Payslips', icon: faFileAlt },
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
          {activeTab === 'payslips' && renderPayslips()}
          {activeTab === 'enterprise' && renderEnterprise()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PayslipGeneration;
