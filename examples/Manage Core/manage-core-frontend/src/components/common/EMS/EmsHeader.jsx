import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  faGraduationCap, 
  faBuilding, 
  faUser, 
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { getEmsModuleTabs } from './EmsModuleTabs';

const EmsHeader = ({ activeTab, children }) => {
  const { theme, setActiveTab, currentUser } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const allTabs = getEmsModuleTabs(t);

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

  if (!currentTab) {
    currentTab = {
      id: activeTab,
      label: t(activeTab) || activeTab.replace('ems_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      icon: <FontAwesomeIcon icon={faGraduationCap} />
    };
    activeGroup = currentTab;
  }

  const getTabDescription = () => {
    if (activeGroup.id === 'ems_overview') {
      return "Central education command center with KPIs, analytics, and AI insights for the Education Management System.";
    }
    if (activeGroup.id === 'ems_institution_group') {
      return "Manage multi-institution educational organizations, campuses, departments, programs, and academic structure.";
    }
    if (activeGroup.id === 'ems_student_group') {
      return "Complete student lifecycle management from enrollment through graduation, with profiles, parents, and communication.";
    }
    if (activeGroup.id === 'ems_admissions_group') {
      return "Manage the complete admission lifecycle from applications to enrollment and document verification.";
    }
    if (activeGroup.id === 'ems_staff_group') {
      return "Manage teachers, faculty, and employees with profiles, assignments, workload, and performance tracking.";
    }
    if (activeGroup.id === 'ems_academic_group') {
      return "Manage academic structure, curriculum, classes, subjects, courses, and learning outcomes.";
    }
    if (activeGroup.id === 'ems_attendance_group') {
      return "Real-time attendance tracking for students and staff with analytics and reporting.";
    }
    if (activeGroup.id === 'ems_timetable_group') {
      return "Class scheduling, resource booking, and conflict management for timetables and events.";
    }
    if (activeGroup.id === 'ems_assignment_group') {
      return "Create, distribute, and grade assignments with rubrics, submissions, and AI assistance.";
    }
    if (activeGroup.id === 'ems_exam_group') {
      return "Manage examinations, question banks, results processing, grades, and certificates.";
    }
    if (activeGroup.id === 'ems_lms_group') {
      return "Digital learning management platform with courses, lessons, quizzes, and learning paths.";
    }
    if (activeGroup.id === 'ems_library_group') {
      return "Manage library resources, book catalog, issue/return, reservations, and digital resources.";
    }
    if (activeGroup.id === 'ems_transport_group') {
      return "Fleet management, route planning, GPS tracking, and student transport management.";
    }
    if (activeGroup.id === 'ems_hostel_group') {
      return "Residential management with room allocation, occupancy tracking, check-in/check-out, and visitor logs.";
    }
    if (activeGroup.id === 'ems_medical_group') {
      return "Campus health center with patient records, appointments, pharmacy, and health records management.";
    }
    if (activeGroup.id === 'ems_alumni_group') {
      return "Alumni engagement, mentorship, career services, networking, and donation management.";
    }
    if (activeGroup.id === 'ems_research_group') {
      return "Research projects, publications, patents, grants, and collaboration management.";
    }
    if (activeGroup.id === 'ems_campus_group') {
      return "Smart campus management with facility booking, maintenance, and asset management.";
    }
    if (activeGroup.id === 'ems_security_group') {
      return "Campus security, incident management, access control, and emergency response.";
    }
    if (activeGroup.id === 'ems_fees_group') {
      return "Fee collection, scholarships, financial analytics, and fee structure management.";
    }
    return "Manage institutions, students, academics, and education operations.";
  };

  const currentIcon = typeof currentTab.icon === 'object' && React.isValidElement(currentTab.icon)
    ? currentTab.icon
    : <FontAwesomeIcon icon={currentTab.icon || faGraduationCap} />;

  const headerStyles = `
    :root {
      --ems-header-bg: ${isDark ? 'linear-gradient(135deg, #0a0f1a 0%, #122b3a 50%, #1b3b4b 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'};
      --ems-header-border: ${isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)'};
      --ems-header-text: ${isDark ? '#ffffff' : '#1e293b'};
      --ems-header-text-muted: ${isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 41, 59, 0.6)'};
      --ems-chip-bg: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.6)'};
      --ems-chip-border: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(34, 197, 94, 0.08)'};
      --ems-chip-text: ${isDark ? '#ffffff' : '#334155'};
      
      --ems-cat-bg: ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)'};
      --ems-cat-border: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(34, 197, 94, 0.08)'};
      --ems-cat-text: ${isDark ? 'rgba(255, 255, 255, 0.75)' : '#475569'};
      --ems-cat-active-bg: linear-gradient(135deg, #059669 0%, #10b981 100%);
      --ems-cat-active-text: #ffffff;
      
      --ems-sub-bg: ${isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.4)'};
      --ems-sub-active-bg: ${isDark ? 'rgba(5, 150, 105, 0.15)' : 'rgba(5, 150, 105, 0.08)'};
      --ems-sub-active-border: #059669;
      --ems-sub-active-text: #059669;
      --ems-sub-text: ${isDark ? 'rgba(255, 255, 255, 0.6)' : '#475569'};
      --ems-sub-hover-bg: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    }
    
    .premium-ems-header {
      background: var(--ems-header-bg);
      border: 1px solid var(--ems-header-border);
      color: var(--ems-header-text);
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, ${isDark ? '0.5' : '0.05'});
      transition: all 0.3s ease;
      backdrop-filter: blur(24px);
    }
    
    .status-glass-chip {
      background: var(--ems-chip-bg);
      border: 1px solid var(--ems-chip-border);
      color: var(--ems-chip-text);
      padding: 8px 14px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      min-width: 120px;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .status-glass-chip:hover {
      transform: translateY(-2px);
      border-color: rgba(5, 150, 105, 0.3);
      box-shadow: 0 8px 16px rgba(5, 150, 105, 0.12);
    }
    .status-glass-chip .label {
      font-size: 9px;
      color: var(--ems-header-text-muted);
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .status-glass-chip .val {
      font-size: 11px;
      font-weight: 700;
    }
    
    .ems-category-hub {
      display: flex;
      gap: 10px;
      padding-bottom: 14px;
      margin-bottom: 8px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .ems-category-hub::-webkit-scrollbar {
      display: none;
    }
    .category-pill {
      background: var(--ems-cat-bg);
      border: 1px solid var(--ems-cat-border);
      color: var(--ems-cat-text);
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
      background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(5, 150, 105, 0.05)'};
      color: var(--ems-header-text);
      transform: translateY(-1px);
      border-color: rgba(5, 150, 105, 0.2);
    }
    .category-pill.active {
      background: var(--ems-cat-active-bg);
      border-color: transparent;
      color: var(--ems-cat-active-text);
      box-shadow: 0 4px 15px rgba(5, 150, 105, 0.35);
    }
    .category-icon {
      font-size: 13px;
      display: inline-flex;
      align-items: center;
    }
    
    .ems-sub-hub {
      display: flex;
      gap: 8px;
      padding: 10px 14px;
      background: ${isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.5)'};
      border-radius: 16px;
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(5, 150, 105, 0.05)'};
      margin-bottom: 24px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .ems-sub-hub::-webkit-scrollbar {
      display: none;
    }
    .sub-tab-pill {
      background: transparent;
      border: 1.5px solid transparent;
      color: var(--ems-sub-text);
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
      background: var(--ems-sub-hover-bg);
      color: ${isDark ? '#ffffff' : '#1e293b'};
    }
    .sub-tab-pill.active {
      background: var(--ems-sub-active-bg);
      border-color: var(--ems-sub-active-border);
      color: var(--ems-sub-active-text);
    }
    .sub-tab-icon {
      font-size: 11px;
      display: inline-flex;
      align-items: center;
    }

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
      background: #22c55e;
      top: -100px;
      right: -50px;
      animation: floatBlob 10s infinite alternate ease-in-out;
    }
    .blob-2 {
      width: 300px;
      height: 300px;
      background: #10b981;
      bottom: -150px;
      left: 30%;
      animation: floatBlob2 14s infinite alternate ease-in-out;
    }
    .blob-3 {
      width: 180px;
      height: 180px;
      background: #34d399;
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
    <div className="ems-wrapper-layout">
      <div className="premium-ems-header p-4 rounded-4 mb-4" style={{ position: 'relative' }}>
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center" style={{ position: 'relative', zIndex: 2 }}>
          <div className="mb-3 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-white bg-opacity-10 text-dark-emphasis border border-dark border-opacity-10 px-3 py-1.5 rounded-pill small d-flex align-items-center gap-1.5" style={{ color: isDark ? 'rgba(255,255,255,0.85) !important' : '' }}>
                <FontAwesomeIcon icon={faHome} size="xs" className="text-primary" />
                <span className="text-muted">Workspace</span>
                <span className="text-muted opacity-50">&gt;</span>
                <span className="text-muted">EMS</span>
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

          <div className="d-flex flex-wrap gap-2">
            <div className="status-glass-chip">
              <div className="label">Institution</div>
              <div className="val"><FontAwesomeIcon icon={faBuilding} className="me-1 text-primary" /> Main Campus</div>
            </div>
            <div className="status-glass-chip">
              <div className="label">Academic Year</div>
              <div className="val"><FontAwesomeIcon icon={faGraduationCap} className="me-1 text-warning" /> 2026-27</div>
            </div>
            <div className="status-glass-chip">
              <div className="label">Current User</div>
              <div className="val"><FontAwesomeIcon icon={faUser} className="me-1 text-info" /> {currentUser?.name || 'Education Admin'}</div>
            </div>
            <div className="status-glass-chip">
              <div className="label">System Status</div>
              <div className="val d-flex align-items-center gap-1.5">
                <span className="live-dot" />
                Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ems-category-hub">
        {allTabs.map(group => {
          const isActive = group.id === activeGroup.id;
          const icon = typeof group.icon === 'object' && React.isValidElement(group.icon) 
            ? group.icon 
            : <FontAwesomeIcon icon={group.icon || faGraduationCap} />;

          return (
            <button
              key={group.id}
              onClick={() => {
                if (group.subTabs && group.subTabs.length > 0) {
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

      {activeGroup.subTabs && activeGroup.subTabs.length > 0 && (
        <div className="ems-sub-hub">
          {activeGroup.subTabs.map(subTab => {
            const isActive = subTab.id === activeTab;
            const icon = typeof subTab.icon === 'object' && React.isValidElement(subTab.icon) 
              ? subTab.icon 
              : <FontAwesomeIcon icon={subTab.icon || faGraduationCap} />;

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

      <div className="ems-content-panel enter-anim">
        {children}
      </div>

      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
    </div>
  );
};

export default EmsHeader;
