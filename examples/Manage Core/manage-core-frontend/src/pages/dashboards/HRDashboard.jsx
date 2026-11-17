import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import TopNavBar from '../../components/layout/TopNavBar';
import Common from '../../components/common/Common';
import ModuleContentRenderer from '../../components/layout/ModuleContentRenderer';
import FrontTabFlyover from '../../components/ui/FrontTabFlyover';

const HRDashboard = () => {
  const { currentUser, activeModule, themeStyle, navbarBehavior, contentLayout, isSidebarOpen, setIsSidebarOpen, frontFlyoverStack, popFrontFlyover } = useApp();
  const { t } = useTranslation();

  const navbarClass = navbarBehavior === 'hidden' ? 'd-none' : '';
  const containerClass = contentLayout === 'compact' ? 'container' : 'container-fluid';
  const themeClass = themeStyle === 'glassmorphism' ? 'glass-theme' : '';

  const getHeading = () => {
    const role = currentUser?.role || 'HR';
    if (activeModule === 'pms') return `${t('project_mgmt')} ${t('workspace')}`;
    if (activeModule === 'hrms') return `${t('human_resource')} ${t('workspace')}`;
    if (activeModule === 'fms') return `${t('finance_mgmt')} ${t('workspace')}`;
    if (activeModule === 'tms') return `${t('task_management')} ${t('workspace')}`;
    return `${role} ${t('dashboard')}`;
  };

  return (
    <div className={`container-fluid vh-100 px-0 overflow-hidden ${themeClass}`}>
      <div className="d-flex h-100">
        <Common isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-grow-1 d-flex flex-column min-w-0" style={{ backgroundColor: 'var(--background)' }}>
          <div className={navbarClass}>
            <TopNavBar
                heading={getHeading()}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          </div>
          <div className={`dashboard-content-shell fade-in p-3 p-lg-4 flex-grow-1 overflow-y-auto ${containerClass}`}>
            <ModuleContentRenderer />
          </div>
        </div>
      {frontFlyoverStack?.map((f, idx) => (
        <FrontTabFlyover
          key={`front-flyover-${idx}`}
          isOpen={true}
          onClose={popFrontFlyover}
          title={f.title}
          index={idx}
          anchorRect={f.anchorRect}
          width={f.width}
          hoverOpen={!!f.hover}
        >
          {f.content}
        </FrontTabFlyover>
      ))}
      </div>
    </div>
  );
};

export default HRDashboard;
