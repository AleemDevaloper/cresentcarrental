import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe, faProjectDiagram, faFileInvoiceDollar, faFileContract,
  faHeadset, faFolderOpen, faUsers, faBullhorn, faUserCog,
  faChartLine, faCheckCircle, faClock, faExclamationTriangle,
  faLock, faShieldAlt, faPalette, faHistory, faUserShield,
  faSearch, faPlus, faArrowRight, faDownload, faEye,
  faStar, faComment, faPaperclip, faFilter, faSync,
  faBuilding, faCreditCard, faCalendarAlt, faCopy
} from '@fortawesome/free-solid-svg-icons';
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

const ClientPortalCenter = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const [portalMetrics, setPortalMetrics] = useState([]);
  useEffect(() => { getTabData('client-portal').then(res => setPortalMetrics(res.data?.data || [])).catch(() => {}); }, []);

  const [activeProjects, setActiveProjects] = useState([]);
  useEffect(() => { getTabData('client-portal').then(res => setActiveProjects(res.data?.data || [])).catch(() => {}); }, []);

  const [recentInvoices, setRecentInvoices] = useState([]);
  useEffect(() => { getTabData('client-portal').then(res => setRecentInvoices(res.data?.data || [])).catch(() => {}); }, []);

  const [supportTickets, setSupportTickets] = useState([]);
  useEffect(() => { getTabData('client-portal').then(res => setSupportTickets(res.data?.data || [])).catch(() => {}); }, []);

  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => { getTabData('client-portal').then(res => setAnnouncements(res.data?.data || [])).catch(() => {}); }, []);

  const [documents, setDocuments] = useState([]);
  useEffect(() => { getTabData('client-portal').then(res => setDocuments(res.data?.data || [])).catch(() => {}); }, []);

  const [engagementMetrics, setEngagementMetrics] = useState({});
  useEffect(() => { getTabData('client-portal').then(res => setEngagementMetrics(res.data?.data || {})).catch(() => {}); }, []);

  const [projectStatusData, setProjectStatusData] = useState({});
  useEffect(() => { getTabData('client-portal').then(res => setProjectStatusData(res.data?.data || {})).catch(() => {}); }, []);

  const renderDashboard = () => (
    <div className="space-y-4">
      <div className="row g-3">
        {portalMetrics.map((metric, i) => (
          <div className="col-xl-2 col-lg-4 col-md-6" key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card border-0 shadow-sm p-3 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-3 p-2" style={{ backgroundColor: `${metric.color}15` }}>
                  <FontAwesomeIcon icon={metric.icon} style={{ color: metric.color }} />
                </div>
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '10px' }}>{metric.label}</span>
              </div>
              <h4 className="fw-black mb-0">{metric.value}</h4>
              <small className={`fw-bold ${metric.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                <FontAwesomeIcon icon={metric.trend === 'up' ? faChartLine : faClock} className="me-1" />
                {metric.delta}
              </small>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-2">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Client Engagement & Portal Usage</h5>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3"><FontAwesomeIcon icon={faSync} className="me-1" /> Weekly</button>
            </div>
            <div style={{ height: '280px' }}>
              <Line data={engagementMetrics} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-4">Project Status Distribution</h5>
            <div style={{ height: '200px' }}>
              <Doughnut data={projectStatusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Active Projects</h5>
              <button className="btn btn-sm btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} className="me-1" /> New</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="small text-muted">
                  <tr><th>Project</th><th>Client</th><th>Progress</th><th>Due</th><th className="text-end">Status</th></tr>
                </thead>
                <tbody>
                  {activeProjects.map((p, i) => (
                    <tr key={i} className="border-bottom">
                      <td className="fw-bold small">{p.name}</td>
                      <td className="small">{p.client}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '5px' }}>
                            <div className={`progress-bar bg-${p.status === 'Completed' ? 'success' : p.status === 'At Risk' ? 'danger' : 'primary'}`} style={{ width: `${p.progress}%` }}></div>
                          </div>
                          <small className="fw-bold">{p.progress}%</small>
                        </div>
                      </td>
                      <td className="small">{p.due}</td>
                      <td className="text-end">
                        <span className={`badge bg-${p.status === 'On Track' ? 'success' : p.status === 'At Risk' ? 'danger' : p.status === 'Completed' ? 'primary' : 'warning'} bg-opacity-10 text-${p.status === 'On Track' ? 'success' : p.status === 'At Risk' ? 'danger' : p.status === 'Completed' ? 'primary' : 'warning'} px-2 py-1 rounded-pill`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Invoices</h5>
              <button className="btn btn-sm btn-outline-primary rounded-pill px-3"><FontAwesomeIcon icon={faEye} className="me-1" /> View All</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="small text-muted">
                  <tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Date</th><th className="text-end">Status</th></tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv, i) => (
                    <tr key={i} className="border-bottom">
                      <td className="fw-bold small">{inv.id}</td>
                      <td className="small">{inv.client}</td>
                      <td className="fw-bold">{inv.amount}</td>
                      <td className="small">{inv.date}</td>
                      <td className="text-end">
                        <span className={`badge bg-${inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'danger'} bg-opacity-10 text-${inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'danger'} px-2 py-1 rounded-pill`}>{inv.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-3">Support Tickets</h5>
            {supportTickets.map((ticket, i) => (
              <div key={i} className={`p-3 border rounded-3 mb-2 ${isDark ? 'border-white border-opacity-5' : 'border-light'}`}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-bold small">{ticket.subject}</span>
                  <span className={`badge bg-${ticket.priority === 'Critical' ? 'danger' : ticket.priority === 'High' ? 'warning' : 'info'} bg-opacity-10 text-${ticket.priority === 'Critical' ? 'danger' : ticket.priority === 'High' ? 'warning' : 'info'} px-2`} style={{ fontSize: '9px' }}>{ticket.priority}</span>
                </div>
                <small className="text-muted d-block">{ticket.client} &bull; {ticket.date}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-3">Announcements</h5>
            {announcements.map((a, i) => (
              <div key={i} className={`p-3 border rounded-3 mb-2 ${isDark ? 'border-white border-opacity-5' : 'border-light'}`}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-bold small">{a.title}</span>
                  <span className={`badge bg-${a.badge} bg-opacity-10 text-${a.badge} px-2`} style={{ fontSize: '9px' }}>{a.category}</span>
                </div>
                <small className="text-muted">{a.date}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
            <h5 className="fw-bold mb-3">Recent Documents</h5>
            {documents.map((doc, i) => (
              <div key={i} className={`p-3 border rounded-3 mb-2 d-flex align-items-center gap-3 ${isDark ? 'border-white border-opacity-5' : 'border-light'}`}>
                <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary">
                  <FontAwesomeIcon icon={doc.icon} />
                </div>
                <div className="flex-grow-1">
                  <span className="fw-bold small d-block">{doc.name}</span>
                  <small className="text-muted">{doc.size} &bull; {doc.shared}</small>
                </div>
                <FontAwesomeIcon icon={faDownload} className="text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Project Tracking</h5>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '250px' }}>
            <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
            <input type="text" className="form-control bg-light border-0" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary rounded-pill px-3"><FontAwesomeIcon icon={faPlus} className="me-1" /> New Project</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="small text-muted uppercase tracking-wider">
            <tr><th className="py-3">Project</th><th>Client</th><th>Status</th><th>Progress</th><th>Due Date</th><th>Priority</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {activeProjects.map((p, i) => (
              <tr key={i} className="border-bottom">
                <td className="py-3 fw-bold">{p.name}</td>
                <td>{p.client}</td>
                <td><span className={`badge bg-${p.status === 'On Track' ? 'success' : p.status === 'At Risk' ? 'danger' : p.status === 'Completed' ? 'primary' : 'warning'} bg-opacity-10 text-${p.status === 'On Track' ? 'success' : p.status === 'At Risk' ? 'danger' : p.status === 'Completed' ? 'primary' : 'warning'} px-3 py-1.5 rounded-pill`}>{p.status}</span></td>
                <td><div className="d-flex align-items-center gap-2"><div className="progress flex-grow-1" style={{ height: '5px', width: '80px' }}><div className={`progress-bar bg-${p.status === 'Completed' ? 'success' : p.status === 'At Risk' ? 'danger' : 'primary'}`} style={{ width: `${p.progress}%` }}></div></div><small className="fw-bold">{p.progress}%</small></div></td>
                <td>{p.due}</td>
                <td><span className={`badge bg-${p.priority === 'Critical' ? 'danger' : p.priority === 'High' ? 'warning' : 'info'} bg-opacity-10 text-${p.priority === 'Critical' ? 'danger' : p.priority === 'High' ? 'warning' : 'info'} px-2`}>{p.priority}</span></td>
                <td className="text-end"><button className="btn btn-sm btn-outline-primary rounded-pill px-3"><FontAwesomeIcon icon={faEye} /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEnterpriseFeatures = () => (
    <div className="row g-4">
      <div className="col-md-6">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-4 p-3 bg-primary bg-opacity-10 text-primary"><FontAwesomeIcon icon={faLock} className="fs-4" /></div>
            <div><h5 className="fw-bold mb-0">Client Login Portal</h5><p className="text-muted small mb-0">Secure SSO-based authentication portal</p></div>
          </div>
          <div className="d-flex gap-2 mb-3">
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill">Active</span>
            <span className="badge bg-info bg-opacity-10 text-info px-3 py-1.5 rounded-pill">2FA Enabled</span>
          </div>
          <p className="text-muted small">Single sign-on with SAML 2.0, OAuth 2.0, and social login providers. Customizable login pages with client branding.</p>
          <button className="btn btn-outline-primary rounded-pill w-100 mt-2">Configure Portal</button>
        </div>
      </div>
      <div className="col-md-6">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-4 p-3 bg-success bg-opacity-10 text-success"><FontAwesomeIcon icon={faShieldAlt} className="fs-4" /></div>
            <div><h5 className="fw-bold mb-0">Secure File Sharing</h5><p className="text-muted small mb-0">End-to-end encrypted document exchange</p></div>
          </div>
          <div className="d-flex gap-2 mb-3">
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill">256-bit AES</span>
            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1.5 rounded-pill">Expiry Policy</span>
          </div>
          <p className="text-muted small">Secure document sharing with granular permissions, password protection, expiry dates, and download tracking.</p>
          <button className="btn btn-outline-success rounded-pill w-100 mt-2">Manage Files</button>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-3 p-2 bg-purple bg-opacity-10 text-purple"><FontAwesomeIcon icon={faPalette} /></div>
            <h6 className="fw-bold mb-0">Custom Branding</h6>
          </div>
          <p className="text-muted small">White-label the portal with client logos, colors, and custom domain.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-3 p-2 bg-info bg-opacity-10 text-info"><FontAwesomeIcon icon={faHistory} /></div>
            <h6 className="fw-bold mb-0">Audit Logs</h6>
          </div>
          <p className="text-muted small">Complete audit trail of all client actions within the portal.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-3 p-2 bg-warning bg-opacity-10 text-warning"><FontAwesomeIcon icon={faUserShield} /></div>
            <h6 className="fw-bold mb-0">Role-Based Access</h6>
          </div>
          <p className="text-muted small">Granular permissions for client users, admins, and viewers.</p>
        </div>
      </div>
    </div>
  );

  const subTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartLine },
    { id: 'projects', label: 'Projects', icon: faProjectDiagram },
    { id: 'documents', label: 'Documents', icon: faFolderOpen },
    { id: 'enterprise', label: 'Enterprise Features', icon: faShieldAlt },
  ];

  const renderSubContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'projects': return renderProjects();
      case 'documents':
        return <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}><h5 className="fw-bold mb-3">Document Access</h5><p className="text-muted">Secure document repository with version control, sharing, and collaboration features.</p></div>;
      case 'enterprise': return renderEnterpriseFeatures();
      default: return renderDashboard();
    }
  };

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
          {renderSubContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ClientPortalCenter;
