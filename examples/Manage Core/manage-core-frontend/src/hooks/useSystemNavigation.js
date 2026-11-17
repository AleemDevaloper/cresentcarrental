import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './useApp';
import { getHomeRouteForRole } from '../utils/roles';

const SYSTEM_TO_CONTEXT = {
  fms: 'fms',
  ams: 'ams',
  hrms: 'hrms',
  pms: 'pms',
  tms: 'tms',
  dms: 'dms',
  crm: 'crm',
  ems: 'ems',
  mfg: 'mfg',
  fx: 'fx',
  ai: 'ai',
  drawing: 'drawing',
};

export const useSystemNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setActiveTab, setActiveModule, setSystemContext } = useApp();

  const openSystem = useCallback((moduleId, tabId) => {
    const system = SYSTEM_TO_CONTEXT[moduleId] || moduleId;
    if (typeof setSystemContext === 'function') setSystemContext(system);
    if (typeof setActiveModule === 'function') setActiveModule(system || 'dashboard');
    if (typeof setActiveTab === 'function') setActiveTab(tabId || 'overview');
    const homeRoute = currentUser ? getHomeRouteForRole(currentUser.role) : '/admin-dashboard';
    if (location.pathname !== homeRoute) {
      navigate(homeRoute);
    }
  }, [currentUser, navigate, location.pathname, setActiveTab, setActiveModule, setSystemContext]);

  return { openSystem };
};
