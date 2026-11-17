import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import TopNavBar from '../../components/layout/TopNavBar';
import Common from '../../components/common/Common';
import ModuleContentRenderer from '../../components/layout/ModuleContentRenderer';
import {
  faBuilding, faUsers, faFileInvoiceDollar, faDatabase,
  faSync, faCogs, faBolt, faShieldHalved, faScaleBalanced,
  faHistory, faCloudArrowUp, faHeadset, faGlobe, faSearch,
  faTrash, faPlus, faChartLine, faArrowRight, faTriangleExclamation,
  faCheckCircle, faLock, faUnlock, faCircleCheck, faFileExport,
  faServer, faNetworkWired, faMicrochip, faMemory, faHardDrive,
  faToggleOn, faToggleOff, faFlask, faBug, faInfoCircle, faTimes,
  faPalette, faSliders, faSitemap, faGear,
  faUserShield, faCreditCard, faBrain, faBullhorn, faEnvelopeOpenText
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Tooltip, Legend
} from 'chart.js';
import { motion, AnimatePresence } from "framer-motion";

// Modular Components
import StatCard from './components/StatCard';
import LogStream from './components/LogStream';
import TenantTable from './components/TenantTable';
import ProvisioningWizard from './components/ProvisioningWizard';
import Dashmainheading from '../../components/common/Dashmainheading';
import Theme from '../theme/Theme';
import Sidebartheme from '../theme/Sidebartheme';
import ThemeAssignmentCenter from '../theme/ThemeAssignmentCenter';
import NavbarSettings from '../settings/NavbarSettings';
import AdminSettings from '../settings/AdminSettings';
import DataBackup from './DataBackup';
import DataLimit from './DataLimit';
import UserLimits from './UserLimits';
import SupportPage from '../support/SupportPage';
import CompanyManagement from './CompanyManagement';
import CompanyTrash from './CompanyTrash';
import AIKnowledgeCenter from './AIKnowledgeCenter';
import AiProviderSettings from './AiProviderSettings';
import AiQuotaManagement from './AiQuotaManagement';
import ErrorPagesGallery from './ErrorPagesGallery';
import AnnouncementCenter from './AnnouncementCenter';
import NotificationSettings from './NotificationSettings';
import BankExports from './BankExports';
import BiometricDevices from './BiometricDevices';
import BiometricMapping from './BiometricMapping';
import RawPunches from './RawPunches';
import UnmatchedPunches from './UnmatchedPunches';
import ApiKeys from './ApiKeys';
import Webhooks from './Webhooks';
import WebhookLogs from './WebhookLogs';
import SecurityAudit from './SecurityAudit';
import DemoRequests from './DemoRequests';
import ContactMessages from './ContactMessages';
import { deleteTenant, listTenantUsers, listTenants, provisionTenant, syncTenantSystems, syncTenantUserSystems, updateTenant } from '../../api/tenants';

// Governance Components (used in switch/case)
import ModuleManagement from './governance/ModuleManagement';
import PermissionManagement from './governance/PermissionManagement';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend
);

const SuperAdminDashboard = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    themeStyle,
    navbarBehavior,
    contentLayout,
    isSidebarOpen,
    setIsSidebarOpen
  } = useApp();

  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const navbarClass = navbarBehavior === 'hidden' ? 'd-none' : '';
  const containerClass = contentLayout === 'compact' ? 'container' : 'container-fluid';
  const themeClass = themeStyle === 'glassmorphism' ? 'glass-theme' : '';

  // --- Dynamic State for Tenant Provisioning ---
const [tenants, setTenants] = useState([]);

  // Onboarding Wizard Form State
  const [newCompany, setNewCompany] = useState({ name: '', subdomain: '', customDomain: '', plan: 'Pro', sandbox: false, template: 'default', adminEmail: '', adminName: '', adminPassword: '' });
  const [provisionStep, setProvisionStep] = useState(1);
  const [selectedModules, setSelectedModules] = useState({ HRMS: true, FMS: true, PMS: true, DMS: true, TMS: true });
  const [quotaSettings, setQuotaSettings] = useState({ maxUsers: 100, maxStorage: 500, maxApi: 250000 });
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);

  // System Assignment State
  const [editingTenant, setEditingTenant] = useState(null);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [tenantUsersLoading, setTenantUsersLoading] = useState(false);

  // Company Management State (lifted from CompanyManagement)
  // Used by ProvisioningWizard as selectable company profiles
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // --- Dynamic State for Subscription Engine ---
  const [plans, setPlans] = useState([
    { id: 'Basic', name: 'Basic Tier', price: 99, cycle: 'Monthly', users: 10, storage: 5, apiLimit: 10000, gracePeriod: 7 },
    { id: 'Pro', name: 'Pro Tier', price: 299, cycle: 'Monthly', users: 50, storage: 50, apiLimit: 50000, gracePeriod: 10 },
    { id: 'Enterprise', name: 'Enterprise Suite', price: 999, cycle: 'Yearly', users: 500, storage: 1000, apiLimit: 1000000, gracePeriod: 14 }
  ]);
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  // --- Dynamic State for Security ---
  const [ipWhitelist, setIpWhitelist] = useState([
    { id: 1, ip: '192.168.1.1', desc: 'HQ Office VPN', createdBy: 'Root Admin' },
    { id: 2, ip: '10.0.8.2', desc: 'Secure Tech Proxy', createdBy: 'Technical Admin' }
  ]);
  const [newIp, setNewIp] = useState({ ip: '', desc: '' });
  const [sessions, setSessions] = useState([
    { id: 1, user: 'Root Admin', device: 'macOS Ventura / Chrome', ip: '192.168.1.1', location: 'San Francisco, US', active: 'Active Now' },
    { id: 2, user: 'Tech Support', device: 'Windows 11 / Firefox', ip: '184.22.43.12', location: 'London, UK', active: '2h ago' },
    { id: 3, user: 'Billing Operator', device: 'iPadOS 17 / Safari', ip: '82.100.12.3', location: 'Paris, FR', active: '1d ago' }
  ]);

  // --- Dynamic State for Quotas ---
  const [globalQuotas, setGlobalQuotas] = useState({
    cpu: 65,
    ram: 42,
    disk: 78,
    api: 12
  });

  // --- Dynamic State for Modules ---
  const [systemModules, setSystemModules] = useState([
    { id: 'HRMS', name: 'Human Resources', status: true, version: 'v2.4.1', maintenance: false },
    { id: 'PMS', name: 'Project Management', status: true, version: 'v3.1.0', maintenance: false },
    { id: 'FMS', name: 'Finance Management', status: true, version: 'v1.9.5', maintenance: false },
    { id: 'DMS', name: 'Document Vault', status: true, version: 'v2.0.0', maintenance: true },
    { id: 'TMS', name: 'Task Board', status: false, version: 'v4.0.2', maintenance: false }
  ]);
  const [stagedModules, setStagedModules] = useState(() => [
    { id: 'HRMS', name: 'Human Resources', status: true, version: 'v2.4.1', maintenance: false },
    { id: 'PMS', name: 'Project Management', status: true, version: 'v3.1.0', maintenance: false },
    { id: 'FMS', name: 'Finance Management', status: true, version: 'v1.9.5', maintenance: false },
    { id: 'DMS', name: 'Document Vault', status: true, version: 'v2.0.0', maintenance: true },
    { id: 'TMS', name: 'Task Board', status: false, version: 'v4.0.2', maintenance: false }
  ]);

  // --- Dynamic State for Support & Operations ---
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 101, tenant: 'Acme Corp', subject: 'SSL Certificate Binding Error', severity: 'High', status: 'Open', date: '2h ago' },
    { id: 102, tenant: 'Global Tech', subject: 'API limit warning threshold hit', severity: 'Medium', status: 'Resolved', date: '1d ago' },
    { id: 103, tenant: 'Apex Ltd', subject: 'Unable to export payroll reports', severity: 'Critical', status: 'Open', date: '4h ago' }
  ]);

  // --- Dynamic State for Deployment ---
  const [featureFlags, setFeatureFlags] = useState([
    { id: 1, key: 'enable_ai_assist', desc: 'Enable AI Copilot globally for all tenants', status: true },
    { id: 2, key: 'new_billing_portal', desc: 'Activate upgraded Stripe billing checkout flow', status: false },
    { id: 3, key: 'canary_charts', desc: 'Deploy V5 analytics engine in canary mode', status: true }
  ]);

  // Simulation log events
  const [logEvents, setLogEvents] = useState([
    { time: '15:45:10', type: 'info', msg: 'Tenant "Stark Industries" auto-provisioned PMS & FMS' },
    { time: '15:45:22', type: 'security', msg: 'Admin session closed for support user due to inactivity' },
    { time: '15:45:34', type: 'billing', msg: 'Automated Stripe webhooks compiled for Acme Corp - Subscription updated' }
  ]);

  // Tick simulation logs
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const logs = [
        { time, type: 'info', msg: 'API hit from "acme.managecore.local": GET /api/v1/projects' },
        { time, type: 'billing', msg: 'Failed payment retry scheduler initiated for Apex Ltd' },
        { time, type: 'security', msg: 'Successful MFA validation for Root Super Admin (192.168.1.1)' },
        { time, type: 'info', msg: 'DMS File uploaded from Stark Industries (1.2 MB)' },
        { time, type: 'error', msg: 'SMTP connection timeout warning on cluster node 2' }
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setLogEvents(prev => [randomLog, ...prev.slice(0, 15)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTenants = async () => {
    try {
      const data = await listTenants();
      const tenantList = Array.isArray(data) ? data : [];
      setTenants(tenantList);
      // Map tenants to companies format for ProvisioningWizard
      setCompanies(tenantList.map(t => ({
        id: t.id,
        companyName: t.name,
        subdomain: t.subdomain,
        email: t.settings?.company?.email || '',
        phone: t.settings?.company?.phone || '',
        address: t.settings?.company?.address || '',
        fiscalStartMonth: t.settings?.company?.fiscalStartMonth || 'January',
        status: t.status,
        createdAt: t.date,
        admin: t.settings?.company?.admin || null,
        users: []
      })));
    } catch (err) {
      console.error('Failed to load tenants:', err);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  // Sync staged modules when entering the modules tab
  useEffect(() => {
    if (activeTab === 'modules') {
      setStagedModules(systemModules.map(m => ({ ...m })));
    }
  }, [activeTab]);

  // Handlers for tenant creation wizard
  const triggerProvisioning = async (e) => {
    if (e) e.preventDefault();
    const company = companies.find(c => c.id === selectedCompanyId);
    if (!company) return;
    setIsProvisioning(true);
    setProvisionProgress(0);

    const progressTimer = setInterval(() => {
      setProvisionProgress(prev => Math.min(prev + 15, 90));
    }, 300);

    try {
      const finalModules = Object.keys(selectedModules).filter(m => selectedModules[m]);
      const added = await provisionTenant({
        company_name: company.companyName,
        subdomain: company.subdomain || company.companyName.toLowerCase().replace(/\s+/g, ''),
        custom_domain: company.customDomain || '',
        plan: selectedPlan || 'Enterprise',
        sandbox: false,
        modules: finalModules,
        quotas: quotaSettings,
        company,
        admin: {
          name: company.admin?.name,
          email: company.admin?.email,
          password: company.admin?.password || company.adminPassword || '',
        },
        run_migrations: true,
      });
      setProvisionProgress(100);
      setTenants(prevTenants => {
        const exists = prevTenants.some(t => t.id === added.id);
        return exists ? prevTenants.map(t => t.id === added.id ? added : t) : [added, ...prevTenants];
      });
      setProvisionStep(1);
      setSelectedModules({ HRMS: true, FMS: true, PMS: true, DMS: true, TMS: true });
      setSelectedCompanyId(null);
      setLogEvents(prevLogs => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `Successfully provisioned tenant cluster for "${added.name}"` }, ...prevLogs]);
      await loadTenants();
    } catch (err) {
      setLogEvents(prevLogs => [{ time: new Date().toLocaleTimeString(), type: 'error', msg: err.message || 'Tenant provisioning failed' }, ...prevLogs]);
      alert(err.message || 'Tenant provisioning failed');
    } finally {
      clearInterval(progressTimer);
      setIsProvisioning(false);
    }
  };

  const handleToggleSandbox = async (id) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const settings = { ...(tenant.settings || {}), sandbox: !tenant.sandbox };
    await updateTenant(id, { settings });
    await loadTenants();
  };

  const handleToggleStatus = async (id) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const status = tenant.status === 'Active' ? 'suspended' : 'active';
    await updateTenant(id, { status });
    await loadTenants();
  };

  const handleDeleteTenant = async (id) => {
    if (!window.confirm('Delete this tenant record? The tenant database will not be dropped.')) return;
    await deleteTenant(id);
    setTenants(prev => prev.filter(t => t.id !== id));
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `Tenant ID ${id} deleted from cluster registry` }, ...prev]);
  };

  const handleEditTenant = (tenant) => {
    setNewCompany({
      name: tenant.name,
      subdomain: tenant.subdomain,
      customDomain: tenant.customDomain || '',
      plan: tenant.plan,
      sandbox: tenant.sandbox,
      template: 'default',
      adminEmail: '',
      adminName: '',
      adminPassword: ''
    });
    setProvisionStep(1);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleEditSystems = async (tenant) => {
    setEditingTenant(tenant);
    setTenantUsers([]);
    setTenantUsersLoading(true);
    try {
      const users = await listTenantUsers(tenant.id);
      setTenantUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'error', msg: err.message || `Failed to load users for ${tenant.name}` }, ...prev]);
    } finally {
      setTenantUsersLoading(false);
    }
  };

  const handleUpdateTenantModules = async (modules) => {
    const updated = await syncTenantSystems(editingTenant.id, modules);
    setTenants(prev => prev.map(t => t.id === editingTenant.id ? updated : t));
    setEditingTenant(null);
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `Systems updated for "${updated.name}": ${updated.modules.join(', ') || 'none'}` }, ...prev]);
  };

  const handleUpdateTenantUserModules = async (user, modules) => {
    await syncTenantUserSystems(editingTenant.id, user.id, modules);
    setTenantUsers(prev => prev.map(item => item.id === user.id ? { ...item, systems: modules } : item));
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `User systems updated for "${user.name}": ${modules.join(', ') || 'none'}` }, ...prev]);
  };

  const handleBranding = (tenant) => {
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `Branding panel opened for ${tenant.name}` }, ...prev]);
  };

  const handleSecurity = (tenant) => {
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `Security panel opened for ${tenant.name}` }, ...prev]);
  };

  const handleAddIp = (e) => {
    e.preventDefault();
    if (!newIp.ip) return;
    setIpWhitelist(prev => [...prev, { id: prev.length + 1, ip: newIp.ip, desc: newIp.desc || 'Assigned Proxy IP', createdBy: 'Root Admin' }]);
    setNewIp({ ip: '', desc: '' });
  };

  const handleRemoveIp = (id) => {
    setIpWhitelist(prev => prev.filter(item => item.id !== id));
  };

  const handleForceLogout = (id) => {
    setSessions(prev => prev.filter(item => item.id !== id));
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'security', msg: `Session ID ${id} forcibly terminated` }, ...prev]);
  };

  const handleRunDiagnostics = () => {
    setDiagnosticsRunning(true);
    setTimeout(() => {
      setDiagnosticsRunning(false);
    }, 1500);
  };

  const handleStageToggleModule = (id) => {
    setStagedModules(prev => prev.map(m => m.id === id ? { ...m, status: !m.status } : m));
  };

  const handleSaveModules = () => {
    setSystemModules(stagedModules.map(m => ({ ...m })));
    setLogEvents(prev => [{ time: new Date().toLocaleTimeString(), type: 'info', msg: `Module configurations saved (${stagedModules.filter(m => m.status).length} active, ${stagedModules.filter(m => !m.status).length} disabled)` }, ...prev]);
  };

  const handleResetModules = () => {
    setStagedModules(systemModules.map(m => ({ ...m })));
  };

  // --- Graph Configurations ---
  const revenueChartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Recurring Revenue ($)',
      data: [21400, 28900, 36500, 48200, 59800, 71500],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.04)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  }), []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'overview':
      case 'superadmin-dashboard':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="mb-4">
              <Dashmainheading main="superadmin" icon={faGlobe} description="Overview of operational health metrics across all tenant environments." badge="live" actions={
                <button className="btn btn-primary rounded-pill px-4 hover-lift shadow-sm" onClick={handleRunDiagnostics} aria-label="Force Refresh">
                  <FontAwesomeIcon icon={faSync} className={`me-2 ${diagnosticsRunning ? 'fa-spin' : ''}`} />
                  {diagnosticsRunning ? 'Running Diagnostics...' : 'Force Refresh'}
                </button>
              }>
                control_tower
              </Dashmainheading>
            </div>

            <div className="row g-4 mb-4">
              {[
                { title: 'Registered Tenants', value: tenants.length, label: '+1 this week', color: 'primary', icon: faBuilding, graph: [5, 6, 8, 9, 9, 12] },
                { title: 'Active Global Users', value: '1,424', label: '98.5% compliance', color: 'success', icon: faUsers, graph: [20, 25, 30, 28, 32, 45] },
                { title: 'MRR / Revenue', value: '$71,500', label: 'ARR: $858,000', color: 'info', icon: faFileInvoiceDollar, graph: [10, 15, 12, 18, 22, 28] },
                { title: 'Storage Allocation', value: '1.46 TB', label: 'Of 10 TB Capacity', color: 'warning', icon: faDatabase, graph: [3, 5, 8, 10, 12, 15] }
              ].map((stat, i) => (
                <div className="col-xl-3 col-sm-6" key={i}>
                  <StatCard {...stat} isDark={isDark} />
                </div>
              ))}
            </div>

            <div className="row g-4 mb-4">
              <div className="col-xl-8 col-lg-7">
                <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}
                  style={{ background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff', backdropFilter: 'blur(10px)' }}
                >
                  <h5 className="fw-bold mb-4" style={{ letterSpacing: '-0.01em' }}>MRR Growth & Trajectory</h5>
                  <div style={{ height: '300px' }}>
                    <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5">
                <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}
                  style={{ background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff', backdropFilter: 'blur(10px)' }}
                >
                  <h5 className="fw-bold mb-4">System Latency Clusters</h5>
                  <div className="space-y-3">
                    {[
                      { node: 'Cluster Node US-East', latency: '24ms', load: 14, color: 'success' },
                      { node: 'Cluster Node EU-West', latency: '38ms', load: 28, color: 'success' },
                      { node: 'Database Master Instance', latency: '12ms', load: 45, color: 'success' },
                      { node: 'SMS/SMTP Gateway Proxy', latency: '102ms', load: 78, color: 'warning' }
                    ].map((node, i) => (
                      <div key={i} className={`p-3 border rounded-4 transition-all hover-scale ${isDark ? 'bg-dark bg-opacity-30 border-white border-opacity-5' : 'bg-light bg-opacity-50 border-light'}`}>
                        <div className="d-flex justify-content-between mb-1.5">
                          <span className="fw-bold small">{node.node}</span>
                          <span className={`badge bg-${node.color} bg-opacity-10 text-${node.color} border border-${node.color} border-opacity-25`} style={{ fontSize: '10px', padding: '4px 8px' }}>{node.latency}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="flex-grow-1">
                            <div className="progress" style={{ height: '6px', borderRadius: '10px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                              <motion.div
                                className={`progress-bar bg-${node.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${node.load}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              ></motion.div>
                            </div>
                          </div>
                          <small className="text-muted fw-bold" style={{ fontSize: '10px' }}>{node.load}%</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <LogStream logs={logEvents} isDark={isDark} />
          </motion.div>
        );

      case 'provisioner':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <Dashmainheading main="superadmin" icon={faBuilding} description="Initialize and isolate database workspaces for onboarded companies." badge="provision">tenant_provisioning</Dashmainheading>

            {/* ───── Stats Row ───── */}
            <div className="row g-4">
              {[
                { label: 'Total Organizations', value: tenants.length, icon: faGlobe, color: '#4f46e5', pct: 65 },
                { label: 'Active Subscriptions', value: tenants.filter(t => t.status === 'Active').length, icon: faCreditCard, color: '#10b981', pct: 55 },
                { label: 'System-wide Users', value: tenants.reduce((sum, t) => sum + (t.users || 0), 0).toLocaleString(), icon: faUsers, color: '#6366f1', pct: 80 },
              ].map((s, i) => (
                <div key={i} className="col-md-4">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="card border-0 shadow-sm rounded-4 p-4 h-100"
                    style={{
                      background: isDark ? 'rgba(30,41,59,0.7)' : '#fff',
                      backdropFilter: 'blur(10px)',
                      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)'
                    }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}18`, color: s.color, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FontAwesomeIcon icon={s.icon} />
                      </div>
                      <div>
                        <div className="text-muted text-uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 2 }}>{s.label}</div>
                        <div className="fw-bold" style={{ fontSize: 24, lineHeight: 1.1, color: isDark ? '#f1f5f9' : '#0f172a' }}>{s.value}</div>
                      </div>
                    </div>
                    <div className="mt-3" style={{ height: 3, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, borderRadius: 2, background: s.color, opacity: 0.6 }} />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* ───── Provision Button ───── */}
            <div className="text-end">
              <button onClick={() => document.getElementById('provisioning-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="btn rounded-pill px-4 py-2 fw-bold text-white border-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: 12, letterSpacing: '0.02em' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)' }}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />PROVISION NEW TENANT
              </button>
            </div>

            <TenantTable
              tenants={tenants}
              onToggleStatus={handleToggleStatus}
              onToggleSandbox={handleToggleSandbox}
              onEditSystems={handleEditSystems}
              onDelete={handleDeleteTenant}
              onEdit={handleEditTenant}
              onBranding={handleBranding}
              onSecurity={handleSecurity}
              isDark={isDark}
            />

            <div id="provisioning-wizard">
              <ProvisioningWizard
                step={provisionStep}
                setStep={setProvisionStep}
                selectedModules={selectedModules}
                setSelectedModules={setSelectedModules}
                quotaSettings={quotaSettings}
                setQuotaSettings={setQuotaSettings}
                isProvisioning={isProvisioning}
                provisionProgress={provisionProgress}
                onExecute={triggerProvisioning}
                isDark={isDark}
                companies={companies}
                selectedCompanyId={selectedCompanyId}
                setSelectedCompanyId={setSelectedCompanyId}
                plans={plans}
              />
            </div>

            {/* System Assignment Modal / Overlay */}
            {editingTenant && (
              <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`card border-0 shadow-lg rounded-4 overflow-hidden w-100 ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`} style={{ maxWidth: '600px' }}>
                  <div className="card-header bg-primary bg-opacity-10 p-4 d-flex justify-content-between align-items-center border-0">
                    <div>
                      <h5 className="fw-black mb-0 text-primary">Assign Systems: {editingTenant.name}</h5>
                      <p className="text-muted small mb-0">Toggle modular infrastructure availability for this tenant.</p>
                    </div>
                    <button className="btn btn-link text-muted" onClick={() => setEditingTenant(null)}><FontAwesomeIcon icon={faTimes} /></button>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      {['HRMS', 'FMS', 'PMS', 'DMS', 'TMS', 'CRM', 'MFG', 'FX', 'AI'].map(sys => {
                        const isActive = editingTenant.modules.includes(sys);
                        return (
                          <div className="col-md-6" key={sys}>
                            <div
                              className={`p-3 border rounded-3 d-flex justify-content-between align-items-center cursor-pointer transition-all ${isActive ? 'border-primary bg-primary bg-opacity-25' : 'bg-light bg-opacity-25'}`}
                              onClick={() => {
                                const newModules = isActive
                                  ? editingTenant.modules.filter(m => m !== sys)
                                  : [...editingTenant.modules, sys];
                                setEditingTenant({ ...editingTenant, modules: newModules });
                              }}
                            >
                              <span className="fw-bold">{sys}</span>
                              <FontAwesomeIcon icon={isActive ? faToggleOn : faToggleOff} className={`fs-4 ${isActive ? 'text-primary' : 'text-muted'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 d-flex gap-2">
                      <button className="btn btn-primary rounded-pill flex-grow-1 py-2.5 fw-bold" onClick={() => handleUpdateTenantModules(editingTenant.modules)}>Save Cluster Configurations</button>
                      <button className="btn btn-light rounded-pill px-4 py-2.5 fw-bold" onClick={() => setEditingTenant(null)}>Cancel</button>
                    </div>

                    <div className="mt-5 pt-4 border-top">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h6 className="fw-black mb-1">Assign Systems to Users</h6>
                          <p className="text-muted small mb-0">User access is saved as tenant permissions and controls which systems appear in their sidebar.</p>
                        </div>
                        {tenantUsersLoading && <span className="spinner-border spinner-border-sm text-primary" />}
                      </div>

                      <div className="d-flex flex-column gap-3" style={{ maxHeight: 340, overflowY: 'auto' }}>
                        {tenantUsers.map(user => (
                          <div key={user.id} className="p-3 rounded-3 border bg-light bg-opacity-50">
                            <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                              <div>
                                <div className="fw-bold">{user.name}</div>
                                <div className="text-muted small">{user.email} • {user.role || 'User'}</div>
                              </div>
                              <span className="badge bg-primary bg-opacity-10 text-primary align-self-start">{(user.systems || []).length} systems</span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {['HRMS', 'FMS', 'PMS', 'DMS', 'TMS', 'CRM', 'MFG', 'FX', 'AI'].map(sys => {
                                const active = (user.systems || []).includes(sys);
                                return (
                                  <button
                                    key={`${user.id}-${sys}`}
                                    type="button"
                                    className={`btn btn-sm rounded-pill ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => {
                                      const next = active ? user.systems.filter(item => item !== sys) : [...(user.systems || []), sys];
                                      handleUpdateTenantUserModules(user, next);
                                    }}
                                  >
                                    {sys}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        {!tenantUsersLoading && tenantUsers.length === 0 && (
                          <div className="text-center text-muted small py-4 border rounded-3">
                            No users found in this tenant database. Provision with an admin account, or create users from the tenant admin panel.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        );

      case 'companies':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <CompanyManagement isDark={isDark} />
          </motion.div>
        );

      case 'companies-trash':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <CompanyTrash isDark={isDark} />
          </motion.div>
        );

      case 'admin_notification_settings':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <NotificationSettings isDark={isDark} />
          </motion.div>
        );

      case 'admin_bank_exports':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <BankExports isDark={isDark} />
          </motion.div>
        );

      case 'admin_biometric_devices':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <BiometricDevices isDark={isDark} />
          </motion.div>
        );

      case 'admin_biometric_mapping':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <BiometricMapping isDark={isDark} />
          </motion.div>
        );

      case 'admin_raw_punches':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <RawPunches isDark={isDark} />
          </motion.div>
        );

      case 'admin_unmatched_punches':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <UnmatchedPunches isDark={isDark} />
          </motion.div>
        );

      case 'admin_api_keys':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <ApiKeys isDark={isDark} />
          </motion.div>
        );

      case 'admin_webhooks':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Webhooks isDark={isDark} />
          </motion.div>
        );

      case 'admin_webhook_logs':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <WebhookLogs isDark={isDark} />
          </motion.div>
        );

      case 'admin_security_audit':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <SecurityAudit isDark={isDark} />
          </motion.div>
        );

      case 'licensing':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faFileInvoiceDollar} description="Orchestrate base tiers, recurring pricing cycles, and resource limitation blocks." badge="billing">plans_licensing</Dashmainheading>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Core Subscription Packages</h5>
                  <div className="row g-3">
                    {plans.map(plan => (
                      <div className="col-md-4" key={plan.id}>
                        <div className={`p-4 rounded-4 border-2 transition-all hover-scale h-100 ${selectedPlan === plan.id ? 'border-primary bg-primary bg-opacity-25 border ' : 'bg-transparent border-light'}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedPlan(plan.id)}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className={`fw-black ${selectedPlan === plan.id ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '15px' }}>{plan.name}</span>
                            <span className="badge bg-light text-dark border px-2.5 py-1 rounded" style={{ fontSize: '10px' }}>{plan.cycle}</span>
                          </div>
                          <h3 className="fw-black mb-3" style={{ letterSpacing: '-0.02em' }}>${plan.price}<span className="text-muted small" style={{ fontSize: '12px' }}> / mo</span></h3>
                          <div className="space-y-2.5 x-small font-bold" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            <div className="d-flex justify-content-between"><span>Max Users:</span> <span className="text-primary">{plan.users}</span></div>
                            <div className="d-flex justify-content-between"><span>Max Storage:</span> <span className="text-primary">{plan.storage} GB</span></div>
                            <div className="d-flex justify-content-between"><span>Daily API Quota:</span> <span className="text-primary">{plan.apiLimit.toLocaleString()}</span></div>
                            <div className="d-flex justify-content-between"><span>Grace Period:</span> <span className="text-primary">{plan.gracePeriod} Days</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-5 opacity-10" />
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <FontAwesomeIcon icon={faCogs} size="sm" />
                    </div>
                    <h5 className="fw-bold mb-0">Configure Limits for Tier: <span className="text-primary">{selectedPlan}</span></h5>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase tracking-wider">Max Users Count</label>
                      <input type="number" className="form-control form-control-lg bg-light border-0 rounded-3" value={plans.find(p => p.id === selectedPlan)?.users || 0} onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPlans(prev => prev.map(p => p.id === selectedPlan ? { ...p, users: val } : p));
                      }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase tracking-wider">Max Storage Allocation (GB)</label>
                      <input type="number" className="form-control form-control-lg bg-light border-0 rounded-3" value={plans.find(p => p.id === selectedPlan)?.storage || 0} onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPlans(prev => prev.map(p => p.id === selectedPlan ? { ...p, storage: val } : p));
                      }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase tracking-wider">Daily API Request Volume</label>
                      <input type="number" className="form-control form-control-lg bg-light border-0 rounded-3" value={plans.find(p => p.id === selectedPlan)?.apiLimit || 0} onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPlans(prev => prev.map(p => p.id === selectedPlan ? { ...p, apiLimit: val } : p));
                      }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase tracking-wider">Grace Period (Days)</label>
                      <input type="number" className="form-control form-control-lg bg-light border-0 rounded-3" value={plans.find(p => p.id === selectedPlan)?.gracePeriod || 0} onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPlans(prev => prev.map(p => p.id === selectedPlan ? { ...p, gracePeriod: val } : p));
                      }} />
                    </div>
                  </div>
                  <div className="mt-5 text-end">
                    <button className="btn btn-primary rounded-pill px-5 py-2.5 fw-bold hover-lift shadow-sm">Save Tier Changes</button>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Enterprise Add-On Bundles</h5>
                  <div className="space-y-3">
                    {[
                      { title: 'Extra Storage Pack', desc: 'Adds +100 GB global DMS storage', price: '$49 / mo', icon: faDatabase, color: 'info' },
                      { title: 'Extra User Roster Pack', desc: 'Adds +25 active user accounts', price: '$29 / mo', icon: faUsers, color: 'success' },
                      { title: 'Premium AI Copilot', desc: 'Activates Advanced LLM assist widgets', price: '$120 / mo', icon: faBolt, color: 'warning' }
                    ].map((pack, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`p-3 border rounded-4 d-flex gap-3 align-items-center cursor-pointer transition-all ${isDark ? 'hover-bg-white hover-bg-opacity-5 border-white border-opacity-5' : 'hover-bg-light border-light'}`}
                      >
                        <div className={`rounded-circle p-2 bg-${pack.color} bg-opacity-10 text-${pack.color}`} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FontAwesomeIcon icon={pack.icon} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-0.5">
                            <span className="fw-bold small">{pack.title}</span>
                            <span className="text-success fw-bold small" style={{ fontSize: '11px' }}>{pack.price}</span>
                          </div>
                          <span className="text-muted x-small d-block" style={{ fontSize: '11px' }}>{pack.desc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faShieldHalved} description="Manage active operator sessions, IP whitelist filters, and multi-factor credentials." badge="security">security_access</Dashmainheading>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Active Operator Sessions</h5>
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '11px' }}>{sessions.length} Active</span>
                  </div>
                  <div className="space-y-3">
                    {sessions.map(sess => (
                      <div key={sess.id} className={`p-4 border rounded-4 d-flex justify-content-between align-items-center transition-all ${isDark ? 'bg-dark bg-opacity-30 border-white border-opacity-5' : 'bg-light bg-opacity-50 border-light'}`}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <FontAwesomeIcon icon={faShieldHalved} />
                          </div>
                          <div>
                            <span className="fw-black d-block text-dark-emphasis">{sess.user}</span>
                            <span className="text-muted x-small d-block font-monospace mt-1">{sess.device} &bull; {sess.ip}</span>
                            <small className="text-success fw-bold x-small">{sess.location}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted small fw-bold" style={{ fontSize: '11px' }}>{sess.active}</span>
                          {sess.id !== 1 && (
                            <button className="btn btn-sm btn-outline-danger rounded-circle hover-lift d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }} onClick={() => handleForceLogout(sess.id)} title="Kill Session">
                              <FontAwesomeIcon icon={faSync} size="sm" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">IP Whitelist / Firewall Rules</h5>

                  <form onSubmit={handleAddIp} className="row g-3 mb-5">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase tracking-wider">IP Address</label>
                      <input type="text" className="form-control form-control-lg border-0 bg-light rounded-3 font-monospace" placeholder="e.g. 192.168.1.12" value={newIp.ip} onChange={(e) => setNewIp({ ...newIp, ip: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase tracking-wider">Description</label>
                      <input type="text" className="form-control form-control-lg border-0 bg-light rounded-3" placeholder="HQ Office VPN" value={newIp.desc} onChange={(e) => setNewIp({ ...newIp, desc: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-black hover-lift shadow-sm">Authorize IP Access</button>
                    </div>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr className="border-bottom text-muted small text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                          <th className="py-3">IP Address</th>
                          <th>Description</th>
                          <th>Admin</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ipWhitelist.map(item => (
                          <tr key={item.id} className="border-bottom">
                            <td className="py-3"><code className="text-danger fw-bold font-monospace px-2 py-1 bg-danger bg-opacity-10 rounded" style={{ fontSize: '12px' }}>{item.ip}</code></td>
                            <td className="small text-muted">{item.desc}</td>
                            <td className="small fw-bold">{item.createdBy}</td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-outline-danger border-0 rounded-circle hover-scale" onClick={() => handleRemoveIp(item.id)}>
                                <FontAwesomeIcon icon={faSync} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'data-backup':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faDatabase} description="Run scheduled/full backups and monitor system backup health across all tenants." badge="infra">data_backup</Dashmainheading>
            <DataBackup />
          </motion.div>
        );

      case 'data-limits':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faUserShield} description="Manage per-user storage quotas and company-level user limits across all tenants." badge="admin">data_limits</Dashmainheading>
            <DataLimit />
            <div className="mt-4">
              <UserLimits />
            </div>
          </motion.div>
        );

      case 'user-limits':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <UserLimits />
          </motion.div>
        );

      case 'quotas':
        return (

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faDatabase} description="Real-time infrastructure utilization across global cluster nodes." badge="infra">resource_quotas</Dashmainheading>

            <div className="row g-4">
              {[
                { title: 'Global CPU Load', value: `${globalQuotas.cpu}%`, icon: faMicrochip, color: 'primary' },
                { title: 'Global RAM Usage', value: `${globalQuotas.ram}%`, icon: faMemory, color: 'success' },
                { title: 'Database Disk I/O', value: `${globalQuotas.disk}%`, icon: faHardDrive, color: 'warning' },
                { title: 'API Rate Limiting', value: `${globalQuotas.api}%`, icon: faBolt, color: 'info' }
              ].map((q, idx) => (
                <div className="col-md-3" key={idx}>
                  <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted small fw-bold text-uppercase">{q.title}</span>
                      <FontAwesomeIcon icon={q.icon} className={`text-${q.color}`} />
                    </div>
                    <h3 className="fw-black mb-2">{q.value}</h3>
                    <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                      <motion.div
                        className={`progress-bar bg-${q.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: q.value }}
                        transition={{ duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`card border-0 shadow-sm p-4 rounded-4 mt-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
              <h5 className="fw-bold mb-4">Tenant-Specific Resource Consumption</h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="small text-muted uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Organization</th>
                      <th>Storage Used</th>
                      <th>Monthly Bandwidth</th>
                      <th>Compute Credits</th>
                      <th className="text-end">Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map(t => (
                      <tr key={t.id} className="border-bottom">
                        <td className="py-3 px-4 fw-bold">{t.name}</td>
                        <td>{Math.floor(Math.random() * 500)} GB</td>
                        <td>{Math.floor(Math.random() * 10)} TB</td>
                        <td>{Math.floor(Math.random() * 10000)} Units</td>
                        <td className="text-end">
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill">Nominal</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'modules':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faCogs} description="Enterprise module lifecycle management, feature governance, and cross-tenant deployment control." badge="modules">module_control</Dashmainheading>
            <ModuleManagement />
          </motion.div>
        );

      case 'announcements':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faBullhorn} description="Create, target, schedule, publish, and track enterprise announcements across companies." badge="communications">Announcements</Dashmainheading>
            <AnnouncementCenter />
          </motion.div>
        );

      case 'ai-knowledge-center':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faBrain} description="Train and manage ManageCore AI knowledge, sources, module intelligence, policies, and indexing pipelines." badge="ai">AI Knowledge Center</Dashmainheading>
            <AIKnowledgeCenter isDark={isDark} />
          </motion.div>
        );

      case 'ai-provider-settings':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faBrain} description="Manage AI provider API keys, models, and connection settings." badge="ai">AI Provider Settings</Dashmainheading>
            <AiProviderSettings isDark={isDark} />
          </motion.div>
        );

      case 'ai-quotas':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faScaleBalanced} description="Configure per-company AI usage limits (requests, tokens & cost) enforced across all users." badge="ai">AI Quota Management</Dashmainheading>
            <AiQuotaManagement isDark={isDark} />
          </motion.div>
        );

      case 'error-pages':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faTriangleExclamation} description="Catalogue of every error screen served across the platform with live previews." badge="ui">Error Pages</Dashmainheading>
            <ErrorPagesGallery isDark={isDark} />
          </motion.div>
        );

      case 'demo-requests':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faFlask} description="View and manage demo requests submitted from the marketing website." badge="marketing">Demo Requests</Dashmainheading>
            <DemoRequests />
          </motion.div>
        );

      case 'contact-messages':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faEnvelopeOpenText} description="View and manage contact form messages submitted from the marketing website." badge="marketing">Contact Messages</Dashmainheading>
            <ContactMessages />
          </motion.div>
        );

      case 'permissions':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faCogs} description="Granular permission matrix with role-based access control, data governance, and audit tracking." badge="security">permissions</Dashmainheading>
            <PermissionManagement />
          </motion.div>
        );

      case 'billing':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faChartLine} description="Global revenue orchestration and multi-tenant ledger tracking." badge="analytics">billing_intelligence</Dashmainheading>

            <div className="row g-4 mb-4">
              <div className="col-md-8">
                <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Revenue Attribution by Plan</h5>
                  <div style={{ height: '300px' }}>
                    <Bar data={{
                      labels: ['Basic', 'Pro', 'Enterprise', 'Custom'],
                      datasets: [{
                        label: 'Revenue ($)',
                        data: [12000, 45000, 89000, 15000],
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4'],
                        borderRadius: 8
                      }]
                    }} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Global Churn Rate</h5>
                  <div className="text-center py-4">
                    <h1 className="fw-black text-danger mb-1">2.4%</h1>
                    <p className="text-muted">Down from 3.1% last month</p>
                    <div className="mt-4">
                      <Doughnut data={{
                        labels: ['Retained', 'Churned'],
                        datasets: [{
                          data: [97.6, 2.4],
                          backgroundColor: ['#10b981', '#ef4444'],
                          borderWidth: 0,
                          cutout: '70%'
                        }]
                      }} options={{ maintainAspectRatio: false }} height={150} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'audit':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faHistory} description="Centralized immutable logs for all platform-wide administrative actions." badge="compliance">audit_compliance</Dashmainheading>

            <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Administrative Event Feed</h5>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                  <FontAwesomeIcon icon={faFileExport} className="me-2" /> Export Compliance PDF
                </button>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="small text-muted uppercase tracking-wider">
                    <tr>
                      <th className="py-3">Timestamp</th>
                      <th>Actor</th>
                      <th>Event Type</th>
                      <th>System Node</th>
                      <th className="text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: '2026-06-11 14:22:10', actor: 'Root Super Admin', event: 'Provision Tenant: Stark Ind.', node: 'US-EAST-01', status: 'Success' },
                      { time: '2026-06-11 13:45:02', actor: 'Billing Service', event: 'Recurring Webhook: Payment', node: 'GLOBAL-LB', status: 'Success' },
                      { time: '2026-06-11 12:10:55', actor: 'Tech Admin', event: 'Enable Feature Flag: AI_ASSIST', node: 'DEPLOY-02', status: 'Pending' },
                      { time: '2026-06-11 11:30:12', actor: 'Security Bot', event: 'IP Whitelist: Authorize HQ', node: 'FIREWALL', status: 'Success' }
                    ].map((log, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td className="py-3 font-monospace small">{log.time}</td>
                        <td className="fw-bold">{log.actor}</td>
                        <td>{log.event}</td>
                        <td className="small text-muted">{log.node}</td>
                        <td className="text-end">
                          <span className={`badge bg-${log.status === 'Success' ? 'success' : 'warning'} bg-opacity-10 text-${log.status === 'Success' ? 'success' : 'warning'} px-3 py-1.5 rounded-pill`}>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'configs':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faServer} description="Global environment variables and third-party integration keys." badge="config">system_configs</Dashmainheading>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Infrastructure Master Keys</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label small fw-bold text-muted uppercase">Stripe API Secret (Global)</label>
                      <div className="input-group">
                        <input type="password" readonly className="form-control bg-light border-0" value="sk_live_51287938729387..." />
                        <button className="btn btn-outline-secondary border-0 bg-light"><FontAwesomeIcon icon={faLock} /></button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-muted uppercase">AWS S3 Infrastructure Secret</label>
                      <div className="input-group">
                        <input type="password" readonly className="form-control bg-light border-0" value="AKIAJS9823792837..." />
                        <button className="btn btn-outline-secondary border-0 bg-light"><FontAwesomeIcon icon={faLock} /></button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-muted uppercase">SendGrid Master Key</label>
                      <div className="input-group">
                        <input type="password" readonly className="form-control bg-light border-0" value="SG.98237198273198..." />
                        <button className="btn btn-outline-secondary border-0 bg-light"><FontAwesomeIcon icon={faLock} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Platform Branding Defaults</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase">Primary Brand Color</label>
                      <input type="color" className="form-control form-control-color w-100 border-0 bg-transparent h-40" value="#4f46e5" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted uppercase">Global Support Email</label>
                      <input type="email" className="form-control bg-light border-0" value="support@managecore.com" />
                    </div>
                    <div className="col-12 mt-4">
                      <button className="btn btn-primary w-100 rounded-pill py-3 fw-black shadow-sm">Update Global Settings</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'deployment':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <Dashmainheading main="superadmin" icon={faFlask} description="Manage global feature flags and orchestrate progressive rollouts." badge="deploy">deployment_flags</Dashmainheading>

            <div className="row g-4">
              <div className="col-md-8">
                <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Global Feature Gates</h5>
                  <div className="space-y-3">
                    {featureFlags.map(flag => (
                      <div key={flag.id} className={`p-4 border rounded-4 d-flex justify-content-between align-items-center transition-all ${isDark ? 'bg-dark bg-opacity-30 border-white border-opacity-5' : 'bg-light bg-opacity-50 border-light'}`}>
                        <div className="d-flex align-items-center gap-3">
                          <div className={`rounded-circle p-2 bg-${flag.status ? 'success' : 'secondary'} bg-opacity-10 text-${flag.status ? 'success' : 'secondary'}`}>
                            <FontAwesomeIcon icon={faFlask} />
                          </div>
                          <div>
                            <span className="fw-bold d-block text-dark-emphasis font-monospace">{flag.key}</span>
                            <small className="text-muted">{flag.desc}</small>
                          </div>
                        </div>
                        <button className="btn btn-link p-0" onClick={() => {
                          setFeatureFlags(prev => prev.map(f => f.id === flag.id ? { ...f, status: !f.status } : f));
                        }}>
                          <FontAwesomeIcon icon={flag.status ? faToggleOn : faToggleOff} className={`fs-3 ${flag.status ? 'text-success' : 'text-muted'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className={`card border-0 shadow-sm p-4 rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                  <h5 className="fw-bold mb-4">Rollout Status</h5>
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon={faServer} className="fs-1 text-primary opacity-25 mb-3" />
                    <h6 className="fw-bold">Version v5.2.0-STABLE</h6>
                    <p className="text-muted small">Global consistency reached at 100% of nodes.</p>
                    <button className="btn btn-outline-danger btn-sm rounded-pill mt-4 px-4">Emergency Rollback</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'support':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faHeadset} description="support_tickets_desc" badge="support">support_operations</Dashmainheading>
            <SupportPage />
          </motion.div>
        );

      case 'theme':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faPalette} description="Manage global theme settings and color schemes across the platform." badge="ux">theme_settings</Dashmainheading>
            <Theme />
          </motion.div>
        );

      case 'sidebartheme':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faSliders} description="Customize sidebar appearance, layout, and navigation behavior." badge="ux">sidebar_theme</Dashmainheading>
            <Sidebartheme />
          </motion.div>
        );

      case 'theme-assignment':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faSitemap} description="Assign theme configurations to specific tenants and user groups." badge="admin">theme_assignment</Dashmainheading>
            <ThemeAssignmentCenter />
          </motion.div>
        );

      case 'topnavbar-settings':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faSliders} description="Configure top navigation bar settings, branding, and visibility." badge="ux">navbar_config</Dashmainheading>
            <NavbarSettings />
          </motion.div>
        );

      case 'admin-settings':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Dashmainheading main="superadmin" icon={faGear} description="Global system configuration, storage limits, and user preferences." badge="admin">system_settings</Dashmainheading>
            <AdminSettings />
          </motion.div>
        );

      default:
        return <ModuleContentRenderer />;
    }
  };

  return (
    <div className={`container-fluid vh-100 px-0 overflow-hidden ${themeClass}`}>
      <div className="d-flex h-100">
        <Common isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-grow-1 d-flex flex-column min-w-0" style={{ backgroundColor: 'var(--background)' }}>
          <div className={navbarClass}>
            <TopNavBar
              heading={`${t('super_admin')} ${t('console')}`}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          </div>
          <div className={`dashboard-content-shell fade-in p-3 p-lg-4 flex-grow-1 overflow-y-auto ${containerClass}`}>
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .fw-black { font-weight: 900; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .space-y-4 > * + * { margin-top: 1.5rem; }
        .space-y-5 > * + * { margin-top: 2rem; }
        .space-y-3 > * + * { margin-top: 1rem; }
        .space-y-2.5 > * + * { margin-top: 0.625rem; }
        .max-width-xl { max-width: 1400px; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
        .bg-dark-card { background-color: rgba(30, 41, 59, 0.7); }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.01); }
        .h-40 { height: 40px; }
      `}} />
    </div>
  );
};

export default SuperAdminDashboard;
