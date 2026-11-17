import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSync, faChartLine, faArrowUp, faArrowDown,
  faCalendarAlt, faDollarSign, faCheckCircle, faTimesCircle,
  faExclamationTriangle, faBan, faPlay, faPause,
  faCreditCard, faFileInvoiceDollar, faChartPie,
  faSearch, faFilter, faPlus, faArrowRight,
  faBuilding, faUsers, faClock, faHistory,
  faShieldAlt, faLock, faCogs, faUserShield,
  faRocket, faStar, faBolt
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const SubscriptionBilling = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [subscriptionMetrics, setSubscriptionMetrics] = useState([]);
  useEffect(() => { getTabData('subscription-billing').then(res => setSubscriptionMetrics(res.data?.data || [])).catch(() => {}); }, []);

  const [plans, setPlans] = useState([]);
  useEffect(() => { getTabData('subscription-billing').then(res => setPlans(res.data?.data || [])).catch(() => {}); }, []);

  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  useEffect(() => { getTabData('subscription-billing').then(res => setActiveSubscriptions(res.data?.data || [])).catch(() => {}); }, []);

  const [mrrData, setMrrData] = useState(null);
  useEffect(() => { getTabData('subscription-billing').then(res => setMrrData(res.data?.data || null)).catch(() => {}); }, []);

  const [planRevenue, setPlanRevenue] = useState(null);
  useEffect(() => { getTabData('subscription-billing').then(res => setPlanRevenue(res.data?.data || null)).catch(() => {}); }, []);

  const renderMetrics = () => (
    <div className="row g-3 mb-4">
      {subscriptionMetrics.map((m, i) => (
        <div className="col-xl-2 col-lg-4 col-md-6" key={i}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`card border-0 shadow-sm p-3 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rounded-3 p-2" style={{ backgroundColor: `${m.color}15` }}><FontAwesomeIcon icon={m.icon} style={{ color: m.color }} /></div>
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '10px' }}>{m.label}</span>
            </div>
            <h4 className="fw-black mb-0">{m.value}</h4>
            <small className={`fw-bold ${m.trend === 'up' ? 'text-success' : 'text-danger'}`}><FontAwesomeIcon icon={m.trend === 'up' ? faArrowUp : faArrowDown} className="me-1" />{m.delta}</small>
          </motion.div>
        </div>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-4">
      {renderMetrics()}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">MRR Breakdown & Growth Trajectory</h5>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3"><FontAwesomeIcon icon={faFilter} className="me-1" /> Quarterly</button>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={mrrData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Plan Revenue Distribution</h5>
            <div style={{ height: '220px' }}>
              <Doughnut data={planRevenue} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="row g-4">
      {plans.map((plan, i) => (
        <div className="col-md-4" key={i}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="text-center mb-4">
              <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', backgroundColor: `${plan.color}15` }}>
                <FontAwesomeIcon icon={faCreditCard} style={{ color: plan.color }} className="fs-4" />
              </div>
              <h5 className="fw-bold mb-1">{plan.name}</h5>
              <h2 className="fw-black mb-0">
                {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                {typeof plan.price === 'number' && <span className="text-muted small fw-normal">/{plan.cycle === 'Monthly' ? 'mo' : plan.cycle === 'Yearly' ? 'yr' : 'once'}</span>}
              </h2>
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill mt-2">{plan.subscribers} subscribers</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="d-flex justify-content-between small"><span className="text-muted">Max Users:</span><span className="fw-bold">{plan.users}{typeof plan.users === 'number' ? '' : ''}</span></div>
              <div className="d-flex justify-content-between small"><span className="text-muted">Storage:</span><span className="fw-bold">{plan.storage}</span></div>
              <div className="d-flex justify-content-between small"><span className="text-muted">API Limit:</span><span className="fw-bold">{plan.apiLimit}</span></div>
              <div className="d-flex justify-content-between small"><span className="text-muted">Billing Cycle:</span><span className="fw-bold">{plan.cycle}</span></div>
            </div>
            <button className="btn btn-outline-primary rounded-pill w-100">Manage Plan</button>
          </motion.div>
        </div>
      ))}
    </div>
  );

  const renderSubscriptions = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Active Subscriptions</h5>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '220px' }}>
            <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
            <input type="text" className="form-control bg-light border-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} /> New Subscription</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Subscription</th><th>Client</th><th>Plan</th><th>Amount</th><th>Next Billing</th><th>Cycle</th><th className="text-end">Status</th></tr>
          </thead>
          <tbody>
            {activeSubscriptions.map((sub, i) => (
              <tr key={i} className="border-bottom">
                <td className="py-3 font-monospace small fw-bold">{sub.id}</td>
                <td className="fw-bold">{sub.client}</td>
                <td><span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill">{sub.plan}</span></td>
                <td className="fw-bold">{sub.amount}</td>
                <td className="small">{sub.nextBilling}</td>
                <td className="small">{sub.cycle}</td>
                <td className="text-end">
                  <span className={`badge bg-${sub.status === 'Active' ? 'success' : sub.status === 'Past Due' ? 'warning' : 'danger'} bg-opacity-10 text-${sub.status === 'Active' ? 'success' : sub.status === 'Past Due' ? 'warning' : 'danger'} px-3 py-1.5 rounded-pill`}>{sub.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEnterprise = () => (
    <div className="row g-4">
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="rounded-4 p-3 bg-primary bg-opacity-10 text-primary d-inline-flex mb-3"><FontAwesomeIcon icon={faCogs} className="fs-3" /></div>
          <h5 className="fw-bold">Automated Billing</h5>
          <p className="text-muted small">Fully automated billing cycles with smart invoicing and tax calculation.</p>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill">Active</span>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="rounded-4 p-3 bg-success bg-opacity-10 text-success d-inline-flex mb-3"><FontAwesomeIcon icon={faSync} className="fs-3" /></div>
          <h5 className="fw-bold">Automated Renewals</h5>
          <p className="text-muted small">Automatic subscription renewals with smart retry logic and dunning management.</p>
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill">Active</span>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="rounded-4 p-3 bg-warning bg-opacity-10 text-warning d-inline-flex mb-3"><FontAwesomeIcon icon={faExclamationTriangle} className="fs-3" /></div>
          <h5 className="fw-bold">Dunning Management</h5>
          <p className="text-muted small">Automated payment retry sequences with smart escalation and customer notifications.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="rounded-4 p-3 bg-info bg-opacity-10 text-info d-inline-flex mb-3"><FontAwesomeIcon icon={faGlobe} className="fs-3" /></div>
          <h5 className="fw-bold">Multi-Currency Billing</h5>
          <p className="text-muted small">Bill customers in their local currency with automatic conversion.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="rounded-4 p-3 bg-danger bg-opacity-10 text-danger d-inline-flex mb-3"><FontAwesomeIcon icon={faHistory} className="fs-3" /></div>
          <h5 className="fw-bold">Audit Logs</h5>
          <p className="text-muted small">Complete audit trail of all subscription changes, billing events, and admin actions.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="rounded-4 p-3 bg-secondary bg-opacity-10 text-secondary d-inline-flex mb-3"><FontAwesomeIcon icon={faUserShield} className="fs-3" /></div>
          <h5 className="fw-bold">Role-Based Access</h5>
          <p className="text-muted small">Granular permissions for subscription management, billing, and plan configuration.</p>
        </div>
      </div>
    </div>
  );

  const subTabs = [
    { id: 'overview', label: 'Dashboard', icon: faChartLine },
    { id: 'plans', label: 'Plans', icon: faCreditCard },
    { id: 'subscriptions', label: 'Subscriptions', icon: faSync },
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
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'plans' && renderPlans()}
          {activeTab === 'subscriptions' && renderSubscriptions()}
          {activeTab === 'enterprise' && renderEnterprise()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionBilling;
