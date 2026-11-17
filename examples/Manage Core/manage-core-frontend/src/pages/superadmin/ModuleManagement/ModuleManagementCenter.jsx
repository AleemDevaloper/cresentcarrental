import React, { useEffect, useState } from 'react';
import { 
  FiLayout, FiGrid, FiList, FiCheck, FiX, FiShield, 
  FiSettings, FiActivity, FiGlobe, FiShoppingCart, FiClock,
  FiRotateCw, FiAlertTriangle, FiPlus, FiArrowRight, FiBox
} from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingShield, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Dashmainheading from '../../../components/common/Dashmainheading';
import ModuleDashboard from './ModuleDashboard';
import ModuleRegistry from './ModuleRegistry';
import TenantManagement from '../TenantManagement';
import { useApp } from '../../../hooks/useApp';
import { assignModuleToTenant, getModuleAssignments, getModules, removeModuleFromTenant, toggleTenantFeature, getModule, getGovernanceFeatures } from '../../../api/governance';
import { listTenants } from '../../../api/tenants';


const ModuleManagementCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
    const { theme } = useApp();
    const isDark = theme === 'dark';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiActivity /> },
    { id: 'registry', label: 'Module Registry', icon: <FiGrid /> },
    { id: 'assignments', label: 'Tenant Assignment', icon: <FiGlobe /> },
    { id: 'licensing', label: 'Licensing & Subscriptions', icon: <FiShield /> },
    { id: 'features', label: 'Feature Toggles', icon: <FiList /> },
    { id: 'marketplace', label: 'Enterprise Marketplace', icon: <FiShoppingCart /> },
    { id: 'settings', label: 'Global Config', icon: <FiSettings /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModuleDashboard />;
      case 'registry':
        return <ModuleRegistry />;
      case 'assignments':
        return <ModuleAssignment isDark={isDark} />;
      case 'licensing':
        return <ModuleLicensing isDark={isDark} />;
      case 'features':
        return <FeatureToggleSystem isDark={isDark} />;
      case 'marketplace':
        return <ModuleMarketplace isDark={isDark} />;
      case 'settings':
        return <div className={`p-8 rounded-2xl shadow-sm text-center ${isDark ? 'bg-dark-card border border-white/10 text-gray-100' : 'bg-white border border-gray-100'}`}>General Configuration Content</div>;
      case 'superadmin_tenant_management':
      return <><Dashmainheading main="superadmin" children="tenant_management" icon={faBuildingShield} description="tenant_management_desc" badge="admin" /><TenantManagement isDark={isDark} /></>;
      default:
        return <ModuleDashboard />;
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-8 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <style>{`.bg-dark-card { background-color: rgba(30, 41, 59, 0.85); }`}</style>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Enterprise Module Governance</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Centralized platform for module lifecycle, licensing, and cross-tenant deployment.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Manage-Core ERP v4.2</p>
            <p className={`text-xs flex items-center justify-end gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Infrastructure Healthy
            </p>
          </div>
          <button className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm border ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-gray-200 hover:bg-slate-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}>
            <FiShield /> Security Audit
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`flex overflow-x-auto p-1 rounded-2xl mb-8 no-scrollbar ${isDark ? 'bg-slate-800/80 border border-white/10' : 'bg-white border border-gray-100 shadow-sm'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `bg-blue-600 text-white shadow-md ${isDark ? 'shadow-blue-500/30' : 'shadow-blue-200'}`
                : isDark
                  ? 'text-gray-400 hover:bg-slate-700 hover:text-gray-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

const ModuleAssignment = ({ isDark }) => {
  const [tenants, setTenants] = useState([]);
  const [modules, setModules] = useState([]);
  const [tenantModules, setTenantModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tenantData, moduleData, assignmentData] = await Promise.all([
        listTenants(),
        getModules(),
        getModuleAssignments(),
      ]);

      const normalizedTenants = Array.isArray(tenantData) ? tenantData : tenantData?.data || [];
      const normalizedModules = Array.isArray(moduleData) ? moduleData : moduleData?.data || [];
      const normalizedAssignments = Array.isArray(assignmentData) ? assignmentData : assignmentData?.data || [];

      setTenants(normalizedTenants);
      setModules(normalizedModules);

      const grouped = {};
      normalizedAssignments.forEach((assignment) => {
        const tenantId = assignment.tenant_id ?? assignment.tenant?.id;
        const moduleId = assignment.module_id ?? assignment.module?.id;
        if (!tenantId || !moduleId) return;
        grouped[tenantId] = grouped[tenantId] || [];
        grouped[tenantId].push(Number(moduleId));
      });
      setTenantModules(grouped);
    } catch (err) {
      setError(err?.message || 'Unable to load tenant module assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAssignment = async (tenantId, moduleId) => {
    const assigned = (tenantModules[tenantId] || []).includes(Number(moduleId));
    setSaving(true);
    try {
      if (assigned) {
        await removeModuleFromTenant({ tenant_id: tenantId, module_id: moduleId });
      } else {
        await assignModuleToTenant({
          tenant_id: tenantId,
          module_id: moduleId,
          license_type: 'enterprise',
          status: 'active',
          expires_at: null,
          settings: {}
        });
      }
      await loadData();
    } catch (err) {
      setError(err?.message || 'Unable to update module assignment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl shadow-sm p-6 flex items-center justify-between ${isDark ? 'bg-dark-card border border-white/10 text-gray-100' : 'bg-white border border-gray-100'}`}>
        <div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Tenant Module Assignment</h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Manage module distribution across your enterprise tenants.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2" onClick={loadData} disabled={loading}>
          <FiPlus /> {loading ? 'Refreshing...' : 'Refresh Assignments'}
        </button>
      </div>

      {error && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-red-500/40 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant, i) => {
          const assignedModuleIds = tenantModules[tenant.id] || [];
          const assignedModules = modules.filter((module) => assignedModuleIds.includes(Number(module.id)));

          return (
            <div key={tenant.id || i} className={`rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow ${isDark ? 'bg-dark-card border border-white/10' : 'bg-white border border-gray-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{tenant.name}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{tenant.domain || tenant.subdomain || 'no-domain'}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>{tenant.status || 'Active'}</span>
              </div>
              <div className="space-y-3">
                <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Active Modules</p>
                <div className="flex flex-wrap gap-2">
                  {assignedModules.length ? assignedModules.map((module, j) => (
                    <span key={module.id || j} className={`px-3 py-1 rounded-lg text-sm font-medium ${isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {module.name || module.code}
                    </span>
                  )) : (
                    <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No modules assigned</span>
                  )}
                </div>
                <div className="pt-2 space-y-2">
                  {modules.map((module) => {
                    const enabled = assignedModuleIds.includes(Number(module.id));
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => handleToggleAssignment(tenant.id, module.id)}
                        disabled={saving}
                        className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                          enabled
                            ? isDark ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-green-200 bg-green-50 text-green-700'
                            : isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <span>{module.name || module.code}</span>
                        <span className="font-semibold">{enabled ? 'Enabled' : 'Enable'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={`mt-6 pt-4 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-gray-50'}`}>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">Manage Assignments</button>
                <FiArrowRight className={isDark ? 'text-gray-600' : 'text-gray-300'} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ModuleLicensing = ({ isDark }) => (
  <div className="space-y-6">
    <div className={`rounded-2xl shadow-sm p-6 ${isDark ? 'bg-dark-card border border-white/10 text-gray-100' : 'bg-white border border-gray-100'}`}>
      <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>License Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className={`text-sm font-medium ${isDark ? 'bg-slate-800/60 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4">Tenant</th>
              <th className="px-6 py-4">Module</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-gray-700 ${isDark ? 'divide-slate-700 text-gray-300' : 'divide-gray-100'}`}>
            {[
              { tenant: 'Acme Corp', module: 'HRMS', type: 'Enterprise', status: 'active', expiry: '2027-01-01' },
              { tenant: 'Globex Inc', module: 'FMS', type: 'Professional', status: 'warning', expiry: '2026-07-15' },
              { tenant: 'Soylent Corp', module: 'PMS', type: 'Trial', status: 'expired', expiry: '2026-05-10' },
            ].map((license, i) => (
              <tr key={i}>
                <td className="px-6 py-4 font-medium">{license.tenant}</td>
                <td className="px-6 py-4">{license.module}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>{license.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    license.status === 'active'
                      ? (isDark ? 'text-green-400' : 'text-green-600')
                      : license.status === 'warning'
                        ? (isDark ? 'text-amber-400' : 'text-amber-600')
                        : (isDark ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {license.status === 'active' && <FiCheck />}
                    {license.status === 'warning' && <FiAlertTriangle />}
                    {license.status === 'expired' && <FiX />}
                    {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono">{license.expiry}</td>
                <td className="px-6 py-4 text-right">
                  <button className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-bold text-sm hover:underline flex items-center justify-end gap-1`}>
                    <FiRotateCw /> Renew
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const FeatureToggleSystem = ({ isDark }) => (
  <div className={`rounded-2xl shadow-sm overflow-hidden p-6 ${isDark ? 'bg-dark-card border border-white/10 text-gray-100' : 'bg-white border border-gray-100'}`}>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Granular Feature Toggles</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Enable or disable individual features within modules for specific tenants.</p>
      </div>
      <div className={`flex items-center gap-2 p-2 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-gray-50'}`}>
        <span className={`text-sm font-medium px-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Filter:</span>
        <select className={`bg-transparent text-sm font-bold focus:outline-none ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          <option className="text-gray-900">All Modules</option>
          <option className="text-gray-900">HRMS</option>
          <option className="text-gray-900">PMS</option>
        </select>
      </div>
    </div>

    <div className="space-y-10">
      {[
        { 
          name: 'Human Resource Management (HRMS)', 
          code: 'HRMS',
          features: [
            { name: 'Attendance & Bio-metrics', enabled: true, desc: 'Track employee clock-ins via mobile/web.' },
            { name: 'Payroll Engine', enabled: true, desc: 'Automated salary generation and tax compliance.' },
            { name: 'Leave Management', enabled: true, desc: 'Approval workflows for time-off requests.' },
            { name: 'Recruitment & ATS', enabled: false, desc: 'Applicant tracking and interview scheduling.' },
            { name: 'LMS (Learning Management)', enabled: false, desc: 'Internal training and certifications.' },
          ]
        },
        { 
          name: 'Project Management (PMS)', 
          code: 'PMS',
          features: [
            { name: 'Task Boards', enabled: true, desc: 'Kanban and List views for task tracking.' },
            { name: 'Gantt Charts', enabled: true, desc: 'Timeline visualization and dependencies.' },
            { name: 'Milestone Tracking', enabled: true, desc: 'Major project delivery markers.' },
            { name: 'Resource Planning', enabled: false, desc: 'Workload balancing across teams.' },
          ]
        }
      ].map((module, i) => (
        <div key={i} className="animate-in fade-in duration-700 delay-150">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
              {module.code[0]}
            </div>
            <h4 className={`font-extrabold text-lg ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{module.name}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {module.features.map((feature, j) => (
              <div key={j} className={`p-5 border rounded-2xl transition-colors group ${isDark ? 'border-slate-700 hover:border-blue-500/50' : 'border-gray-100 hover:border-blue-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{feature.name}</span>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                    feature.enabled
                      ? 'bg-green-500 shadow-inner'
                      : (isDark ? 'bg-slate-600' : 'bg-gray-200')
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${feature.enabled ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ModuleMarketplace = ({ isDark }) => (
  <div className="space-y-8">
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 p-12 text-white shadow-xl shadow-blue-200">
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-4xl font-black mb-4 tracking-tight">Enterprise Marketplace</h2>
        <p className="text-blue-100 text-lg mb-8">Discover and deploy powerful new capabilities to your ERP ecosystem. Seamless integration, one-click installation.</p>
        <div className="flex items-center gap-4">
          <button className={`px-8 py-3 rounded-2xl font-black shadow-lg transition-all uppercase tracking-widest text-xs ${
            isDark
              ? 'bg-slate-100 text-slate-900 hover:bg-white'
              : 'bg-white text-blue-700 hover:bg-blue-50'
          }`}>Explore All</button>
          <button className="bg-blue-600/30 text-white border border-blue-400/30 px-8 py-3 rounded-2xl font-black hover:bg-blue-600/50 transition-all uppercase tracking-widest text-xs">New Releases</button>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none overflow-hidden">
        <FiBox className="text-[300px] -rotate-12 translate-x-1/4 -translate-y-1/4" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { name: 'BI & Analytics', category: 'Intelligence', price: '$499', desc: 'Advanced data visualization and AI forecasting.' },
        { name: 'Procurement', category: 'Finance', price: '$299', desc: 'Vendor management and purchase order tracking.' },
        { name: 'Inventory Pro', category: 'Logistics', price: '$349', desc: 'Multi-warehouse stock control and QR scanning.' },
        { name: 'Workflow Engine', category: 'Operations', price: '$199', desc: 'Custom business process automation and routing.' },
      ].map((item, i) => (
        <div key={i} className={`rounded-3xl shadow-sm p-6 flex flex-column justify-between hover:shadow-xl hover:-translate-y-1 transition-all ${isDark ? 'bg-dark-card border border-white/10' : 'bg-white border border-gray-100'}`}>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>{item.category}</span>
            <h4 className={`text-xl font-black mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{item.name}</h4>
            <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-black ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{item.price}<span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/mo</span></span>
            <button className={`p-3 text-white rounded-2xl hover:bg-blue-600 transition-colors shadow-lg ${isDark ? 'bg-slate-800' : 'bg-gray-900'}`}>
              <FiPlus className="text-xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ModuleManagementCenter;
