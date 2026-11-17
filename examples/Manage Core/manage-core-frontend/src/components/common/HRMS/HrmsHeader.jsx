import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  faBuilding, 
  faClock, 
  faUser, 
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { getHrmsModuleTabs } from './HrmsModuleTabs';

const HrmsHeader = ({ activeTab, children }) => {
  const { theme, setActiveTab, currentUser } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const allTabs = getHrmsModuleTabs(t);

  // Find active tab and active group in our full list of tabs
  let currentTab = null;
  let activeGroup = null;

  for (const group of allTabs) {
    if (group.id === activeTab) {
      currentTab = group;
      activeGroup = group;
      break;
    }
    if (group.subTabs) {
      const foundSub = group.subTabs.find(st => st.id === activeTab);
      if (foundSub) {
        currentTab = foundSub;
        activeGroup = group;
        break;
      }
    }
  }

  // Fallback if current activeTab is not explicitly found in our HrmsModuleTabs structure
  if (!currentTab) {
    currentTab = {
      id: activeTab,
      label: t(activeTab) || activeTab.replace('hrms_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      icon: <FontAwesomeIcon icon={faBuilding} />
    };
    activeGroup = currentTab;
  }

  // Generate dynamic, helpful workspace description based on the active category
  const getTabDescription = () => {
    if (activeGroup.id === 'hrms_overview' || activeGroup.id === 'hrms_health_dashboard') {
      return "Unified HR administration dashboard with workforce stats, attendance metrics, and compliance logs.";
    }
    if (activeGroup.id === 'hrms_attendance_group' || activeGroup.id === 'hrms_corrections_group') {
      return "Real-time biometric, GPS, QR-code check-ins, shift planning, and attendance correction portal.";
    }
    if (activeGroup.id === 'hrms_leaves_group' || activeGroup.id === 'hrms_workflow_group') {
      return "Leave request queues, approvals workflows, physical approved leave entries, and quota balances.";
    }
    if (activeGroup.id === 'hrms_payroll_group') {
      return "Payroll processing engine, overtime rules, loans management, asset clearance, and ATS recruitment.";
    }
    if (activeGroup.id === 'hrms_database_group' || activeGroup.id === 'hrms_records_group') {
      return "Personnel files, employee records, bank details, emergency contacts, and reporting hierarchy.";
    }
    return "Manage employee databases, shift attendance compliance, approval chains, and payroll readiness.";
  };

  const currentIcon = typeof currentTab.icon === 'object' && React.isValidElement(currentTab.icon)
    ? currentTab.icon
    : <FontAwesomeIcon icon={currentTab.icon || faBuilding} />;

  // Theme styling definitions for custom CSS
  const headerStyles = `
    :root {
      --hrms-header-bg: ${isDark ? 'linear-gradient(135deg, #0a0b10 0%, #12132a 50%, #1e1b4b 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 50%, #e2e8f0 100%)'};
      --hrms-header-border: ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)'};
      --hrms-header-text: ${isDark ? '#ffffff' : '#1e293b'};
      --hrms-header-text-muted: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 41, 59, 0.6)'};
      --hrms-chip-bg: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.6)'};
      --hrms-chip-border: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.08)'};
      --hrms-chip-text: ${isDark ? '#ffffff' : '#334155'};
      
      --hrms-cat-bg: ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)'};
      --hrms-cat-border: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.08)'};
      --hrms-cat-text: ${isDark ? 'rgba(255, 255, 255, 0.75)' : '#475569'};
      --hrms-cat-active-bg: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      --hrms-cat-active-text: #ffffff;
      
      --hrms-sub-bg: ${isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.4)'};
      --hrms-sub-active-bg: ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)'};
      --hrms-sub-active-border: #6366f1;
      --hrms-sub-active-text: #4f46e5;
      --hrms-sub-text: ${isDark ? 'rgba(255, 255, 255, 0.6)' : '#475569'};
      --hrms-sub-hover-bg: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    }
    
    .premium-hrms-header {
      background: var(--hrms-header-bg);
      border: 1px solid var(--hrms-header-border);
      color: var(--hrms-header-text);
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, ${isDark ? '0.5' : '0.05'});
      transition: all 0.3s ease;
      backdrop-filter: blur(24px);
    }
    
    .status-glass-chip {
      background: var(--hrms-chip-bg);
      border: 1px solid var(--hrms-chip-border);
      color: var(--hrms-chip-text);
      padding: 8px 14px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 120px;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .status-glass-chip:hover {
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.12);
    }
    .status-glass-chip .label {
      font-size: 9px;
      color: var(--hrms-header-text-muted);
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .status-glass-chip .val {
      font-size: 11px;
      font-weight: 700;
    }
    
    /* Category pills (Row 1) */
    .hrms-category-hub {
      display: flex;
      gap: 10px;
      padding-bottom: 14px;
      margin-bottom: 8px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .hrms-category-hub::-webkit-scrollbar {
      display: none;
    }
    .category-pill {
      background: var(--hrms-cat-bg);
      border: 1px solid var(--hrms-cat-border);
      color: var(--hrms-cat-text);
      border-radius: 50px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .category-pill:hover {
      background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.05)'};
      color: var(--hrms-header-text);
      transform: translateY(-1px);
      border-color: rgba(99, 102, 241, 0.2);
    }
    .category-pill.active {
      background: var(--hrms-cat-active-bg);
      border-color: transparent;
      color: var(--hrms-cat-active-text);
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35);
    }
    .category-icon {
      font-size: 13px;
      display: inline-flex;
      align-items: center;
    }
    
    /* Sub-tabs pills (Row 2) */
    .hrms-sub-hub {
      display: flex;
      gap: 8px;
      padding: 10px 14px;
      background: ${isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.5)'};
      border-radius: 16px;
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(99, 102, 241, 0.05)'};
      margin-bottom: 24px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .hrms-sub-hub::-webkit-scrollbar {
      display: none;
    }
    .sub-tab-pill {
      background: transparent;
      border: 1.5px solid transparent;
      color: var(--hrms-sub-text);
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 16px;
      white-space: nowrap;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .sub-tab-pill:hover {
      background: var(--hrms-sub-hover-bg);
      color: ${isDark ? '#ffffff' : '#1e293b'};
    }
    .sub-tab-pill.active {
      background: var(--hrms-sub-active-bg);
      border-color: var(--hrms-sub-active-border);
      color: var(--hrms-sub-active-text);
    }
    .sub-tab-icon {
      font-size: 11px;
      display: inline-flex;
      align-items: center;
    }

    /* Floating background blobs */
    .aurora-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: ${isDark ? '0.12' : '0.07'};
      z-index: 1;
      pointer-events: none;
    }
    .blob-1 {
      width: 250px;
      height: 250px;
      background: #818cf8;
      top: -100px;
      right: -50px;
      animation: floatBlob 10s infinite alternate ease-in-out;
    }
    .blob-2 {
      width: 300px;
      height: 300px;
      background: #c084fc;
      bottom: -150px;
      left: 30%;
      animation: floatBlob2 14s infinite alternate ease-in-out;
    }
    .blob-3 {
      width: 180px;
      height: 180px;
      background: #38bdf8;
      top: 20%;
      left: -50px;
      animation: floatBlob 8s infinite alternate-reverse ease-in-out;
    }
    
    @keyframes floatBlob {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(20px) scale(1.1); }
    }
    @keyframes floatBlob2 {
      0% { transform: translate(-50%, 0) scale(1); }
      100% { transform: translate(-45%, -15px) scale(1.05); }
    }
    
    .live-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 8px #10b981;
      animation: pulse-dot 1.5s infinite;
    }
    @keyframes pulse-dot {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
  `;

  return (
    <div className="hrms-wrapper-layout">
      {/* 1. Aurora Gradient Header Card */}
      <div className="premium-hrms-header p-4 rounded-4 mb-4" style={{ position: 'relative' }}>
        {/* Floating background light blobs */}
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center" style={{ position: 'relative', zIndex: 2 }}>
          {/* Left Metadata & Titles */}
          <div className="mb-3 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-white bg-opacity-10 text-dark-emphasis border border-dark border-opacity-10 px-3 py-1.5 rounded-pill small d-flex align-items-center gap-1.5" style={{ color: isDark ? 'rgba(255,255,255,0.85) !important' : '' }}>
                <FontAwesomeIcon icon={faHome} size="xs" className="text-primary" />
                <span className="text-muted">Workspace</span>
                <span className="text-muted opacity-50">&gt;</span>
                <span className="text-muted">HRMS</span>
                <span className="text-muted opacity-50">&gt;</span>
                <span className="fw-bold text-primary">{activeGroup.label}</span>
                {currentTab.id !== activeGroup.id && (
                  <>
                    <span className="text-muted opacity-50">&gt;</span>
                    <span className="fw-semibold text-secondary">{currentTab.label}</span>
                  </>
                )}
              </span>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center border border-primary border-opacity-10" style={{ width: 46, height: 46 }}>
                <span className="text-primary fs-5">{currentIcon}</span>
              </div>
              <div>
                <h3 className="fw-bold mb-0 tracking-tight" style={{ fontSize: '22px' }}>{currentTab.label}</h3>
                <p className="mb-0 small mt-1 text-muted" style={{ maxWidth: '650px', fontWeight: '500' }}>
                  {getTabDescription()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Live Status Chips */}
          <div className="d-flex flex-wrap gap-2">
            <div className="status-glass-chip">
              <div className="label">Branch</div>
              <div className="val"><FontAwesomeIcon icon={faBuilding} className="me-1 text-primary" /> Head Office</div>
            </div>
            <div className="status-glass-chip">
              <div className="label">Active Shift</div>
              <div className="val"><FontAwesomeIcon icon={faClock} className="me-1 text-warning" /> General (9 AM)</div>
            </div>
            <div className="status-glass-chip">
              <div className="label">Current User</div>
              <div className="val"><FontAwesomeIcon icon={faUser} className="me-1 text-info" /> {currentUser?.name || 'HR Manager'}</div>
            </div>
            <div className="status-glass-chip">
              <div className="label">Sync Status</div>
              <div className="val d-flex align-items-center gap-1.5">
                <span className="live-dot" />
                Real-time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Category Tabs Switcher (Row 1) */}
      <div className="hrms-category-hub">
        {allTabs.map(group => {
          const isActive = group.id === activeGroup.id;
          const icon = typeof group.icon === 'object' && React.isValidElement(group.icon) 
            ? group.icon 
            : <FontAwesomeIcon icon={group.icon || faBuilding} />;

          return (
            <button
              key={group.id}
              onClick={() => {
                if (group.subTabs && group.subTabs.length > 0) {
                  // Switch to the first sub-tab of this group
                  setActiveTab(group.subTabs[0].id);
                } else {
                  setActiveTab(group.id);
                }
              }}
              className={`category-pill ${isActive ? 'active' : ''}`}
            >
              <span className="category-icon">{icon}</span>
              <span className="category-label">{group.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-tabs Switcher (Row 2) */}
      {activeGroup.subTabs && activeGroup.subTabs.length > 0 && (
        <div className="hrms-sub-hub">
          {activeGroup.subTabs.map(subTab => {
            const isActive = subTab.id === activeTab;
            const icon = typeof subTab.icon === 'object' && React.isValidElement(subTab.icon) 
              ? subTab.icon 
              : <FontAwesomeIcon icon={subTab.icon || faBuilding} />;

            return (
              <button
                key={subTab.id}
                onClick={() => setActiveTab(subTab.id)}
                className={`sub-tab-pill ${isActive ? 'active' : ''}`}
              >
                <span className="sub-tab-icon">{icon}</span>
                <span className="sub-tab-label">{subTab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Sub-tab Content Children */}
      <div className="hrms-content-panel enter-anim">
        {children}
      </div>

      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
    </div>
  );
};

export default HrmsHeader;
