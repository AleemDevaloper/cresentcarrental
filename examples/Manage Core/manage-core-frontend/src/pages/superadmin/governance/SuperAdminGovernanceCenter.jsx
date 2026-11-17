import React, { useState } from 'react';
import { FiActivity, FiBox, FiList, FiShield, FiUsers, FiLock, FiEye, FiAlertTriangle, FiMonitor, FiCheckCircle, FiClock, FiUserCheck, FiHeart, FiCpu, FiTerminal, FiFlag } from 'react-icons/fi';
import GovernanceDashboard from './GovernanceDashboard';
import ModuleManagement from './ModuleManagement';
import FeatureManagement from './FeatureManagement';
import FeatureFlagSystem from './FeatureFlagSystem';
import LicensingManagement from './LicensingManagement';
import RoleManagement from './RoleManagement';
import PermissionManagement from './PermissionManagement';
import DataAccessGovernance from './DataAccessGovernance';
import SecurityGovernance from './SecurityGovernance';
import SessionManagement from './SessionManagement';
import ApprovalGovernance from './ApprovalGovernance';
import AuditCenter from './AuditCenter';
import ImpersonationCenter from './ImpersonationCenter';
import ModuleHealthMonitoring from './ModuleHealthMonitoring';
import AIGovernance from './AIGovernance';
import ExecutiveCommandCenter from './ExecutiveCommandCenter';

const SuperAdminGovernanceCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiActivity /> },
    { id: 'modules', label: 'Modules', icon: <FiBox /> },
    { id: 'features', label: 'Features', icon: <FiList /> },
    { id: 'feature-flags', label: 'Feature Flags', icon: <FiFlag /> },
    { id: 'licensing', label: 'Licensing', icon: <FiShield /> },
    { id: 'roles', label: 'Roles', icon: <FiUsers /> },
    { id: 'permissions', label: 'Permissions', icon: <FiLock /> },
    { id: 'data-access', label: 'Data Access', icon: <FiEye /> },
    { id: 'security', label: 'Security', icon: <FiAlertTriangle /> },
    { id: 'sessions', label: 'Sessions', icon: <FiMonitor /> },
    { id: 'approvals', label: 'Approvals', icon: <FiCheckCircle /> },
    { id: 'audit', label: 'Audit', icon: <FiClock /> },
    { id: 'impersonation', label: 'Impersonation', icon: <FiUserCheck /> },
    { id: 'health', label: 'Health', icon: <FiHeart /> },
    { id: 'ai', label: 'AI Governance', icon: <FiCpu /> },
    { id: 'command', label: 'Command Center', icon: <FiTerminal /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <GovernanceDashboard />;
      case 'modules': return <ModuleManagement />;
      case 'features': return <FeatureManagement />;
      case 'feature-flags': return <FeatureFlagSystem />;
      case 'licensing': return <LicensingManagement />;
      case 'roles': return <RoleManagement />;
      case 'permissions': return <PermissionManagement />;
      case 'data-access': return <DataAccessGovernance />;
      case 'security': return <SecurityGovernance />;
      case 'sessions': return <SessionManagement />;
      case 'approvals': return <ApprovalGovernance />;
      case 'audit': return <AuditCenter />;
      case 'impersonation': return <ImpersonationCenter />;
      case 'health': return <ModuleHealthMonitoring />;
      case 'ai': return <AIGovernance />;
      case 'command': return <ExecutiveCommandCenter />;
      default: return <GovernanceDashboard />;
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px 32px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Enterprise Super Admin Governance Center
            </h1>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 15 }}>
              Centralized command center for module lifecycle, licensing, permissions, security, and enterprise governance
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 600, color: '#0f172a', margin: 0, fontSize: 14 }}>Manage-Core ERP v4.2</p>
              <p style={{ color: '#059669', margin: 0, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                All Systems Operational
              </p>
            </div>
            <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 20px', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiShield /> Security Audit
            </button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4,
        background: 'white', borderRadius: 16, padding: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        marginBottom: 28
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#0f172a' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) { e.target.style.background = '#f1f5f9'; e.target.style.color = '#0f172a'; }}}
            onMouseLeave={e => { if (activeTab !== tab.id) { e.target.style.background = 'transparent'; e.target.style.color = '#64748b'; }}}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {renderContent()}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .gc-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.2s; }
        .gc-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .gc-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .gc-table th { text-align: left; padding: 12px 16px; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .gc-table td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; color: #334155; }
        .gc-table tr:hover td { background: #f8fafc; }
        .gc-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .gc-input { border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 14px; font-size: 14px; outline: none; transition: border-color 0.2s; width: 100%; }
        .gc-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .gc-btn { padding: 8px 16px; border-radius: 10px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .gc-btn-primary { background: #0f172a; color: white; }
        .gc-btn-primary:hover { background: #1e293b; }
        .gc-btn-success { background: #059669; color: white; }
        .gc-btn-success:hover { background: #047857; }
        .gc-btn-danger { background: #dc2626; color: white; }
        .gc-btn-danger:hover { background: #b91c1c; }
        .gc-btn-warning { background: #d97706; color: white; }
        .gc-btn-warning:hover { background: #b45309; }
        .gc-btn-outline { background: white; color: #334155; border: 1px solid #e2e8f0; }
        .gc-btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }
        .gc-btn-sm { padding: 4px 10px; font-size: 12px; border-radius: 8px; }
        .gc-toggle { width: 40px; height: 22px; border-radius: 11px; position: relative; cursor: pointer; border: none; transition: background 0.2s; }
        .gc-toggle.active { background: #059669; }
        .gc-toggle.inactive { background: #cbd5e1; }
        .gc-toggle::after { content: ''; position: absolute; top: 2px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .gc-toggle.active::after { left: 20px; }
        .gc-toggle.inactive::after { left: 2px; }
        .gc-progress { height: 8px; border-radius: 4px; background: #f1f5f9; overflow: hidden; }
        .gc-progress-bar { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default SuperAdminGovernanceCenter;
