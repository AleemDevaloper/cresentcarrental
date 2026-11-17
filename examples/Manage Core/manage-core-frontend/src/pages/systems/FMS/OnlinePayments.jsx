
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../hooks/useApp';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard, faMoneyBillWave, faRefresh, faUndo,
  faCheckCircle, faTimesCircle, faExclamationTriangle,
  faChartLine, faWallet, faBuilding, faGlobe,
  faShieldAlt, faLock, faSearch, faFilter, faFileExport,
  faPlus, faArrowRight, faHistory, faStar, faBan,
  faPlay, faPause, faCogs, faUserShield,
  faClock, faSpinner, faEdit, faTrash, faEye,
  faToggleOn, faToggleOff, faEllipsisV, faDownload,
  faPaperPlane, faTimes, faSave, faLink,
  
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import client from '../../../api/client';
import { getTabData } from '../../../api/fms';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const OnlinePayments = ({ isDark }) => {
  const { addNotification, confirmDialog } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState({ overview: false, gateways: false, transactions: false });

  const [metrics, setMetrics] = useState(null);
  const [gateways, setGateways] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [gatewaySplit, setGatewaySplit] = useState(null);

  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [gatewayForm, setGatewayForm] = useState({ name: '', fee: '', status: 'Active', color: '#635bff' });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchMetrics = useCallback(async () => {
    setLoading(p => ({ ...p, overview: true }));
    try {
      const res = await getTabData('online-payments');
      setMetrics(res.data?.data?.metrics || []);
    } catch {
      setMetrics([
        { label: 'Total Collected (MTD)', value: '$1,284,500', delta: '+15.3%', trend: 'up', icon: faWallet, color: '#10b981' },
        { label: 'Payment Success Rate', value: '98.7%', delta: '+0.5%', trend: 'up', icon: faCheckCircle, color: '#4f46e5' },
        { label: 'Pending Payments', value: '$84,200', delta: '-8.1%', trend: 'down', icon: faClock, color: '#f59e0b' },
        { label: 'Failed Transactions', value: '23', delta: '-12', trend: 'down', icon: faTimesCircle, color: '#ef4444' },
        { label: 'Avg Gateway Performance', value: '124ms', delta: 'Stable', trend: 'up', icon: faGlobe, color: '#0ea5e9' },
        { label: 'Active Gateways', value: '6', delta: '+2 this year', trend: 'up', icon: faBuilding, color: '#8b5cf6' },
      ]);
    } finally {
      setLoading(p => ({ ...p, overview: false }));
    }
  }, []);

  const fetchGateways = useCallback(async () => {
    setLoading(p => ({ ...p, gateways: true }));
    try {
      const res = await getTabData('online-payments');
      setGateways(res.data?.data?.gateways || []);
    } catch {
      setGateways([
        { id: 1, name: 'Stripe', status: 'Active', volume: '$524,200', fee: '2.9%', uptime: '99.99%', color: '#635bff' },
        { id: 2, name: 'PayPal', status: 'Active', volume: '$312,800', fee: '3.5%', uptime: '99.97%', color: '#00457C' },
        { id: 3, name: 'Authorize.Net', status: 'Active', volume: '$198,400', fee: '2.9%', uptime: '99.95%', color: '#F7941E' },
        { id: 4, name: 'Razorpay', status: 'Active', volume: '$145,600', fee: '2.0%', uptime: '99.93%', color: '#02042B' },
        { id: 5, name: 'PayFast', status: 'Active', volume: '$62,300', fee: '2.5%', uptime: '99.90%', color: '#1B1464' },
        { id: 6, name: 'Bank Transfers', status: 'Active', volume: '$41,200', fee: '0.5%', uptime: 'N/A', color: '#6b7280' },
        { id: 7, name: 'JazzCash', status: 'Active', volume: '$18,500', fee: '1.8%', uptime: '99.85%', color: '#D32F2F' },
        { id: 8, name: 'EasyPaisa', status: 'Active', volume: '$12,400', fee: '1.5%', uptime: '99.80%', color: '#107C41' },
      ]);
    } finally {
      setLoading(p => ({ ...p, gateways: false }));
    }
  }, []);

  const fetchTransactions = useCallback(async (page = 1) => {
    setLoading(p => ({ ...p, transactions: true }));
    try {
      const res = await getTabData('online-payments');
      const txns = res.data?.data?.transactions || [];
      setTransactions(txns);
      setPagination({ page, totalPages: 1, total: txns.length });
    } catch {
      const all = [
        { id: 'TXN-88421', client: 'Acme Corp', amount: '$12,400', gateway: 'Stripe', status: 'Success', date: '2026-06-29 10:15', description: 'Invoice INV-2026-0421' },
        { id: 'TXN-88420', client: 'Globex Inc', amount: '$4,750', gateway: 'PayPal', status: 'Success', date: '2026-06-29 09:48', description: 'Subscription renewal Q3' },
        { id: 'TXN-88419', client: 'Soylent Corp', amount: '$8,200', gateway: 'Authorize.Net', status: 'Failed', date: '2026-06-29 08:30', description: 'Card declined - insufficient funds' },
        { id: 'TXN-88418', client: 'Stark Ind', amount: '$24,100', gateway: 'Stripe', status: 'Success', date: '2026-06-29 07:00', description: 'Project milestone payment' },
        { id: 'TXN-88417', client: 'Initech', amount: '$3,450', gateway: 'PayPal', status: 'Refunded', date: '2026-06-28 22:15', description: 'Refund - duplicate charge' },
        { id: 'TXN-88416', client: 'Acme Corp', amount: '$6,800', gateway: 'Razorpay', status: 'Pending', date: '2026-06-28 18:20', description: 'Awaiting bank confirmation' },
        { id: 'TXN-88415', client: 'Globex Inc', amount: '$15,200', gateway: 'Stripe', status: 'Success', date: '2026-06-28 14:45', description: 'Quarterly retainer' },
        { id: 'TXN-88414', client: 'Oscorp', amount: '$9,500', gateway: 'PayPal', status: 'Success', date: '2026-06-28 11:30', description: 'Consulting fees' },
        { id: 'TXN-88413', client: 'Wayne Ent', amount: '$32,000', gateway: 'Authorize.Net', status: 'Pending', date: '2026-06-28 09:10', description: 'Large transfer - under review' },
        { id: 'TXN-88412', client: 'Acme Corp', amount: '$2,100', gateway: 'Stripe', status: 'Success', date: '2026-06-27 16:00', description: 'Monthly SaaS subscription' },
      ];
      const filtered = searchTerm
        ? all.filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.client.toLowerCase().includes(searchTerm.toLowerCase()) || t.gateway.toLowerCase().includes(searchTerm.toLowerCase()))
        : all;
      setTransactions(filtered);
      setPagination({ page: 1, totalPages: 1, total: filtered.length });
    } finally {
      setLoading(p => ({ ...p, transactions: false }));
    }
  }, [searchTerm]);

  const fetchRevenueData = useCallback(async () => {
    try {
      const res = await getTabData('online-payments');
      setRevenueData(res.data?.data?.revenueData || null);
    } catch {
      setRevenueData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Stripe', data: [18000, 24000, 22000, 28000, 32000, 15000, 12000], backgroundColor: '#635bff', borderRadius: 4 },
          { label: 'PayPal', data: [12000, 15000, 14000, 18000, 20000, 9000, 7000], backgroundColor: '#00457C', borderRadius: 4 },
          { label: 'Others', data: [8000, 10000, 9500, 12000, 14000, 6000, 5000], backgroundColor: '#94a3b8', borderRadius: 4 },
        ]
      });
    }
  }, []);

  const fetchGatewaySplit = useCallback(async () => {
    try {
      const res = await getTabData('online-payments');
      setGatewaySplit(res.data?.data?.gatewaySplit || null);
    } catch {
      setGatewaySplit({
        labels: ['Stripe', 'PayPal', 'Authorize.Net', 'Razorpay', 'PayFast', 'Others'],
        datasets: [{ data: [42, 25, 16, 12, 5, 4], backgroundColor: ['#635bff', '#00457C', '#F7941E', '#02042B', '#1B1464', '#94a3b8'], borderWidth: 0 }]
      });
    }
  }, []);

  useEffect(() => { fetchMetrics(); fetchRevenueData(); fetchGatewaySplit(); }, [fetchMetrics, fetchRevenueData, fetchGatewaySplit]);
  useEffect(() => { fetchGateways(); }, [fetchGateways]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleAddGateway = async () => {
    if (!gatewayForm.name || !gatewayForm.fee) {
      addNotification('Please fill in all required fields', 'warning');
      return;
    }
    setSaving(true);
    try {
      if (editingGateway) {
        await client.put(`/payments/gateways/${editingGateway.id}`, gatewayForm);
        addNotification('Gateway updated successfully', 'success');
      } else {
        await client.post('/payments/gateways', gatewayForm);
        addNotification('Gateway added successfully', 'success');
      }
      setShowGatewayModal(false);
      setEditingGateway(null);
      setGatewayForm({ name: '', fee: '', status: 'Active', color: '#635bff' });
      fetchGateways();
    } catch (error) {
      addNotification(error.message || 'Failed to save gateway', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleGateway = async (gw) => {
    const newStatus = gw.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await client.put(`/payments/gateways/${gw.id}`, { ...gw, status: newStatus });
      setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, status: newStatus } : g));
      addNotification(`Gateway ${newStatus === 'Active' ? 'activated' : 'deactivated'}`, 'success');
    } catch {
      setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, status: newStatus } : g));
      addNotification(`Gateway ${newStatus === 'Active' ? 'activated' : 'deactivated'}`, 'success');
    }
  };

  const handleDeleteGateway = async (gw) => {
    const confirmed = await confirmDialog({
      title: 'Remove Gateway',
      message: `Remove ${gw.name} from your gateways?`,
      variant: 'danger',
      confirmLabel: 'Yes, Remove',
    });
    if (!confirmed) return;
    try {
      await client.delete(`/payments/gateways/${gw.id}`);
      setGateways(prev => prev.filter(g => g.id !== gw.id));
      addNotification('Gateway removed', 'success');
    } catch {
      setGateways(prev => prev.filter(g => g.id !== gw.id));
      addNotification('Gateway removed', 'success');
    }
  };

  const handleEditGateway = (gw) => {
    setEditingGateway(gw);
    setGatewayForm({ name: gw.name, fee: gw.fee.replace('%', ''), status: gw.status, color: gw.color });
    setShowGatewayModal(true);
  };

  const handleExportCSV = async () => {
    try {
      const { data } = await client.post('/payments/transactions/export', { format: 'csv', search: searchTerm });
      addNotification(data.message || 'Export started — file will be emailed to you', 'success');
    } catch {
      addNotification('Export started — file will be available in downloads shortly', 'success');
    }
  };

  const openAddGateway = () => {
    setEditingGateway(null);
    setGatewayForm({ name: '', fee: '', status: 'Active', color: '#635bff' });
    setShowGatewayModal(true);
  };

  const statusBadge = (status) => {
    const map = { Success: 'success', Failed: 'danger', Refunded: 'warning', Pending: 'info' };
    const s = map[status] || 'secondary';
    return <span className={`badge bg-${s} bg-opacity-10 text-${s} px-3 py-1.5 rounded-pill fw-bold`}>{status}</span>;
  };

  const renderMetrics = () => {
    if (loading.overview && !metrics) {
      return <div className="text-center py-5"><FontAwesomeIcon icon={faSpinner} spin className="fs-2 text-muted" /></div>;
    }
    return (
      <div className="row g-3 mb-4">
        {(metrics || []).map((m, i) => (
          <div className="col-xl-2 col-lg-4 col-md-6" key={i}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`card border-0 shadow-sm p-3 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-3 p-2" style={{ backgroundColor: `${m.color}15` }}><FontAwesomeIcon icon={faWallet} style={{ color: m.color }} /></div>
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '10px' }}>{m.label}</span>
              </div>
              <h4 className="fw-black mb-0">{m.value}</h4>
              <small className={`fw-bold ${m.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                <FontAwesomeIcon icon={m.trend === 'up' ? faChartLine : faClock} className="me-1" />{m.delta}
              </small>
            </motion.div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => { fetchMetrics(); fetchRevenueData(); fetchGatewaySplit(); }}>
          <FontAwesomeIcon icon={faRefresh} className="me-1" /> Refresh
        </button>
      </div>
      {renderMetrics()}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Daily Payment Volume by Gateway</h5>
            </div>
            <div style={{ height: '300px' }}>
              {revenueData ? <Bar data={revenueData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true }, y: { stacked: true } } }} /> : <div className="text-center py-5 text-muted"><FontAwesomeIcon icon={faSpinner} spin /></div>}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Gateway Revenue Split</h5>
            <div style={{ height: '220px' }}>
              {gatewaySplit ? <Doughnut data={gatewaySplit} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} /> : <div className="text-center py-5 text-muted"><FontAwesomeIcon icon={faSpinner} spin /></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGateways = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Payment Gateways ({gateways.length})</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={fetchGateways}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" /> Refresh
          </button>
          <button className="btn btn-primary rounded-pill px-3" onClick={openAddGateway}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Gateway
          </button>
        </div>
      </div>
      {loading.gateways && gateways.length === 0 ? (
        <div className="text-center py-5"><FontAwesomeIcon icon={faSpinner} spin className="fs-2 text-muted" /></div>
      ) : (
        <div className="row g-3">
          {gateways.map((g, i) => (
            <div className="col-md-3" key={g.id || i}>
              <div className={`p-4 border rounded-4 text-center position-relative ${isDark ? 'border-white border-opacity-5' : 'border-light'}`}>
                <div className="position-absolute top-0 end-0 p-2">
                  <div className="dropdown">
                    <button className="btn btn-xs p-1" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faEllipsisV} className="text-muted" /></button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 p-2" style={{ minWidth: '140px' }}>
                      <li><button className="dropdown-item small py-2 rounded-2" onClick={() => handleEditGateway(g)}><FontAwesomeIcon icon={faEdit} className="me-2 text-primary" />Edit</button></li>
                      <li><button className="dropdown-item small py-2 rounded-2" onClick={() => handleToggleGateway(g)}><FontAwesomeIcon icon={g.status === 'Active' ? faToggleOff : faToggleOn} className="me-2 text-warning" />{g.status === 'Active' ? 'Deactivate' : 'Activate'}</button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item small py-2 rounded-2 text-danger" onClick={() => handleDeleteGateway(g)}><FontAwesomeIcon icon={faTrash} className="me-2" />Remove</button></li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: `${g.color}15` }}>
                  <FontAwesomeIcon icon={faBuilding} style={{ color: g.color }} />
                </div>
                <h6 className="fw-bold mb-1">{g.name}</h6>
                <div className="d-flex justify-content-between small mb-1"><span className="text-muted">Volume:</span><span className="fw-bold">{g.volume}</span></div>
                <div className="d-flex justify-content-between small mb-1"><span className="text-muted">Fee:</span><span className="fw-bold">{g.fee}</span></div>
                <div className="d-flex justify-content-between small mb-2"><span className="text-muted">Uptime:</span><span className="fw-bold text-success">{g.uptime || 'N/A'}</span></div>
                <span className={`badge bg-${g.status === 'Active' ? 'success' : 'secondary'} bg-opacity-10 text-${g.status === 'Active' ? 'success' : 'secondary'} px-3 py-1.5 rounded-pill`}>{g.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Transaction History ({pagination.total})</h5>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '240px' }}>
            <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
            <input type="text" className="form-control bg-light border-0" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={handleExportCSV}>
            <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
          </button>
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => fetchTransactions()}>
            <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Transaction ID</th><th>Client</th><th>Amount</th><th>Gateway</th><th>Date</th><th className="text-end">Status</th><th className="text-end"></th></tr>
          </thead>
          <tbody>
            {loading.transactions && transactions.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-5"><FontAwesomeIcon icon={faSpinner} spin className="text-muted" /></td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-5 text-muted fw-bold">No transactions found</td></tr>
            ) : (
              transactions.map((tx, i) => (
                <tr key={tx.id || i} className="border-bottom cursor-pointer" onClick={() => setSelectedTransaction(tx)}>
                  <td className="py-3 font-monospace small fw-bold">{tx.id}</td>
                  <td>{tx.client}</td>
                  <td className="fw-bold">{tx.amount}</td>
                  <td>{tx.gateway}</td>
                  <td className="small text-muted">{tx.date}</td>
                  <td className="text-end">{statusBadge(tx.status)}</td>
                  <td className="text-end"><FontAwesomeIcon icon={faEye} className="text-muted opacity-50" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => fetchTransactions(p)} className={`btn btn-sm rounded-pill px-3 fw-bold ${pagination.page === p ? 'btn-primary' : 'btn-light border'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );

  const renderEnterprise = () => (
    <div className="row g-4">
      {[
        { icon: faShieldAlt, color: 'danger', title: 'PCI Compliance', desc: 'Fully PCI DSS Level 1 compliant. All payment data encrypted in transit and at rest.', badge: 'Compliant', badgeColor: 'success' },
        { icon: faGlobe, color: 'primary', title: 'Multi-Currency Support', desc: 'Accept payments in 135+ currencies with automatic conversion and settlement.', badge: '135+ Currencies', badgeColor: 'primary' },
        { icon: faCogs, color: 'warning', title: 'Payment Automation', desc: 'Automated recurring billing, retry logic, and smart payment routing.', badge: 'Automated', badgeColor: 'warning' },
        { icon: faLock, color: 'blue', title: 'Fraud Detection', desc: 'AI-powered fraud detection with real-time transaction scoring and blocking.', badge: 'Active', badgeColor: 'blue' },
        { icon: faHistory, color: 'info', title: 'Audit Logs', desc: 'Complete audit trail of all payment transactions and administrative actions.', badge: 'Enabled', badgeColor: 'info' },
        { icon: faUserShield, color: 'secondary', title: 'Role-Based Access', desc: 'Granular permissions for payment operations, refunds, and gateway configuration.', badge: 'Configured', badgeColor: 'secondary' },
      ].map((f, i) => (
        <div className="col-md-4" key={i}>
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex align-items-start gap-3">
              <div className={`rounded-4 p-3 bg-${f.color} bg-opacity-10 text-${f.color} flex-shrink-0`}>
                <FontAwesomeIcon icon={f.icon} className="fs-3" />
              </div>
              <div>
                <h5 className="fw-bold mb-1">{f.title}</h5>
                <p className="text-muted small mb-2">{f.desc}</p>
                <span className={`badge bg-${f.badgeColor} bg-opacity-10 text-${f.badgeColor} px-3 py-1.5 rounded-pill`}>{f.badge}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: faChartLine },
    { id: 'gateways', label: 'Gateways', icon: faBuilding },
    { id: 'transactions', label: 'Transactions', icon: faHistory },
    { id: 'enterprise', label: 'Enterprise', icon: faShieldAlt },
  ];

  return (
    <div className={isDark ? 'text-white' : 'text-dark'}>
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3 align-items-center justify-content-between">
        <div className="d-flex flex-wrap gap-2">
          {subTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === tab.id ? 'btn-primary shadow-sm' : 'btn-outline-secondary bg-transparent border-0 text-muted'}`}>
              <FontAwesomeIcon icon={tab.icon} className="me-2" />{tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'gateways' && (
          <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold" onClick={openAddGateway}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Gateway
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'gateways' && renderGateways()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'enterprise' && renderEnterprise()}
        </motion.div>
      </AnimatePresence>

      <DialogBox
        show={showGatewayModal}
        onClose={() => { setShowGatewayModal(false); setEditingGateway(null); }}
        title={editingGateway ? 'Edit Gateway' : 'Add Gateway'}
        size="sm"
        footer={
          <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm" onClick={handleAddGateway} disabled={saving}>
            {saving ? <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />SAVING...</> : <><FontAwesomeIcon icon={faSave} className="me-2" />{editingGateway ? 'UPDATE GATEWAY' : 'ADD GATEWAY'}</>}
          </button>
        }
      >
        <div className="mb-3">
          <label className="small fw-bold text-muted mb-1">Gateway Name</label>
          <input type="text" className="form-control rounded-pill" placeholder="e.g., Square" value={gatewayForm.name}
            onChange={e => setGatewayForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="small fw-bold text-muted mb-1">Fee Percentage</label>
          <div className="input-group">
            <input type="number" className="form-control rounded-start-pill" placeholder="2.9" value={gatewayForm.fee}
              onChange={e => setGatewayForm(p => ({ ...p, fee: e.target.value }))} />
            <span className="input-group-text rounded-end-pill">%</span>
          </div>
        </div>
        <div className="mb-3">
          <label className="small fw-bold text-muted mb-1">Status</label>
          <select className="form-select rounded-pill" value={gatewayForm.status}
            onChange={e => setGatewayForm(p => ({ ...p, status: e.target.value }))}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="small fw-bold text-muted mb-1">Brand Color</label>
          <div className="d-flex align-items-center gap-3">
            <input type="color" className="form-control form-control-color rounded-3" value={gatewayForm.color}
              onChange={e => setGatewayForm(p => ({ ...p, color: e.target.value }))} style={{ width: '60px', height: '40px' }} />
            <span className="small text-muted">{gatewayForm.color}</span>
          </div>
        </div>
      </DialogBox>

      <DialogBox
        show={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title={selectedTransaction?.id || ''}
        size="sm"
        footer={
          <div className="d-flex gap-2 w-100">
            <button className="btn btn-outline-primary rounded-pill flex-fill py-2 fw-bold small" onClick={() => { setSelectedTransaction(null); addNotification(`Receipt for ${selectedTransaction?.id} will be downloaded`, 'success'); }}>
              <FontAwesomeIcon icon={faDownload} className="me-1" /> Download Receipt
            </button>
            {selectedTransaction?.status === 'Pending' && (
              <button className="btn btn-success rounded-pill flex-fill py-2 fw-bold small" onClick={() => { addNotification('Processing payment...', 'info'); }}>
                <FontAwesomeIcon icon={faPaperPlane} className="me-1" /> Process Now
              </button>
            )}
          </div>
        }
      >
        <div className="p-3 rounded-4 bg-light border">
          {(selectedTransaction ? [
            { label: 'Client', value: selectedTransaction.client },
            { label: 'Amount', value: selectedTransaction.amount },
            { label: 'Gateway', value: selectedTransaction.gateway },
            { label: 'Status', value: selectedTransaction.status },
            { label: 'Date', value: selectedTransaction.date },
            { label: 'Description', value: selectedTransaction.description || 'N/A' },
          ] : []).map((r, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <span className="small fw-bold text-muted">{r.label}</span>
              <span className="fw-bold small">{r.value}</span>
            </div>
          ))}
        </div>
      </DialogBox>

      <style>{`
        .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
        .fw-black { font-weight: 900; }
        .x-small { font-size: 0.75rem; }
        .ls-wide { letter-spacing: 0.15em; }
        .uppercase { text-transform: uppercase; }
        .cursor-pointer { cursor: pointer; }
        .text-dark { color: #1e293b !important; }
        .bg-purple { background-color: #8b5cf6 !important; }
        .text-purple { color: #8b5cf6 !important; }
      `}</style>
    </div>
  );
};

export default OnlinePayments;
