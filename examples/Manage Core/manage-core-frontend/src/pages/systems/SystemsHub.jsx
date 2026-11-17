import React from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileAlt, 
  faUsers, 
  faChevronRight, 
  faBuildingColumns,
  faTasks,
  faUserShield,
  faFolderOpen,
  faHandshake,
  faTools,
  faBoxes,
  faIndustry,
  faDollarSign,
  faBrain,
  faPalette,
  faGraduationCap,
  faStore
} from "@fortawesome/free-solid-svg-icons";

const SystemFlyoverContent = ({ system, onSelect }) => {
  if (!system) return null;
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="p-3 rounded-4 bg-opacity-10 shadow-sm"
          style={{ backgroundColor: `${system.customColor}1a`, color: system.customColor }}
        >
          <FontAwesomeIcon icon={system.icon} size="xl" />
        </div>
        <div>
          <h5 className="fw-bold mb-1">{system.fullName}</h5>
          <span className="badge bg-opacity-10 border px-2 py-1 rounded-pill" style={{ fontSize: '11px', color: system.customColor, borderColor: system.customColor }}>
            {system.name}
          </span>
        </div>
      </div>
      <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>{system.desc}</p>
      {system.status === 'in_building' && (
        <div className="alert alert-warning small mb-4">
          This system is currently in development. Some features may not be available yet.
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary w-100 py-2 rounded-3 fw-bold"
        onClick={onSelect}
        disabled={system.status === 'in_building'}
      >
        Open Workspace
      </button>
    </div>
  );
};

const SystemsHub = () => {
  const { setSystemContext, setActiveModule, setActiveTab, currentUser, themeStyle } = useApp();
  const { t } = useTranslation();
  const userRole = currentUser?.role;
  const userPerms = (currentUser?.permissions?.length ? currentUser.permissions : currentUser?.all_permissions) || [];

  const themeClass = themeStyle === 'glassmorphism' ? 'glass-dashboard-content p-4' : '';

  const handleSystemSelect = (system) => {
    setSystemContext(system);
    setActiveModule(system);
    setActiveTab(system === 'ams' ? 'erp_dashboard' : system === 'inv' ? 'inv_overview' : system === 'pos' ? 'pos_overview' : `${system}_overview`);
  };

  const systems = [
    { 
      id: 'pms', 
      name: t('pms_name'), 
      fullName: t('pms_full_name'), 
      icon: faFileAlt, 
      colorClass: 'text-primary', 
      bgClass: 'bg-primary', 
      customColor: '#0184ff',
      permission: 'system_pms',
      desc: t('pms_short_desc')
    },
    { 
      id: 'hrms', 
      name: t('hrms_name'), 
      fullName: t('hrms_full_name'), 
      icon: faUsers, 
      colorClass: 'text-success', 
      bgClass: 'bg-success',
      customColor: '#03f5336d',
      permission: 'system_hrms',
      desc: t('hrms_short_desc')
    },
    { 
      id: 'fms', 
      name: t('fms_name'), 
      fullName: t('fms_full_name'), 
      icon: faBuildingColumns, 
      colorClass: 'text-info', 
      bgClass: 'bg-info',
      customColor: '#0e9eec',
      permission: 'system_fms',
      desc: t('fms_short_desc')
    },
    { 
      id: 'ams', 
      name: 'AMS', 
      fullName: 'Accounting Management System', 
      icon: faBuildingColumns, 
      colorClass: 'text-primary', 
      bgClass: 'bg-primary',
      customColor: '#4f46e5',
      permission: 'system_ams',
      desc: 'Enterprise Accounting, General Ledger, CFO Dashboard, and Sales Modules.'
    },
    { 
      id: 'tms', 
      name: t('tms_name'), 
      fullName: t('tms_full_name'), 
      icon: faTasks, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#8b5cf6',
      permission: 'system_tms',
      desc: t('tms_short_desc')
    },
    { 
      id: 'dms', 
      name: t('dms_name'), 
      fullName: t('dms_full_name'), 
      icon: faFolderOpen, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#ec4899',
      permission: 'system_dms',
      desc: t('dms_short_desc')
    },
    { 
      id: 'crm', 
      name: t('crm_name'), 
      fullName: t('crm_full_name'), 
      icon: faHandshake, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#06b6d4',
      permission: 'system_crm',
      desc: t('crm_short_desc')
    },
    { 
      id: 'asst', 
      name: t('asst_name') || 'ASST', 
      fullName: t('asst_full_name') || 'Assets Management System', 
      icon: faTools, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#14b8a6',
      permission: 'system_asst',
      desc: t('asst_short_desc') || 'Track and manage enterprise physical and digital assets.',
      status: 'in_building'
    },
    { 
      id: 'inv', 
      name: t('inv_name') || 'INV', 
      fullName: t('inv_full_name') || 'Inventory Management System', 
      icon: faBoxes, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#f97316',
      permission: 'system_inv',
      desc: t('inv_short_desc') || 'Real-time supply chain and stock level tracking.'
    },
    {
      id: 'pos',
      name: 'POS',
      fullName: 'Point of Sale System',
      icon: faStore,
      colorClass: '',
      bgClass: '',
      customColor: '#e11d48',
      permission: 'system_pos',
      desc: 'Independent checkout, payments, receipts, registers, and cashier operations.',
    },
    { 
      id: 'mfg', 
      name: t('mfg_name') || 'MFG', 
      fullName: t('mfg_full_name') || 'Manufacturing / MRP System', 
      icon: faIndustry, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#059669',
      permission: 'system_mfg',
      desc: t('mfg_short_desc') || 'Production planning, BOM management, shop floor execution, and manufacturing analytics.',
    },
    { 
      id: 'fx', 
      name: t('fx_name') || 'FX', 
      fullName: t('fx_full_name') || 'Multi-Currency Management System', 
      icon: faDollarSign, 
      colorClass: '', 
      bgClass: '', 
      customColor: '#8b5cf6',
      permission: 'system_fx',
      desc: t('fx_short_desc') || 'Global currency management, exchange rates, FX transactions, revaluations, and treasury operations.',
    },
    { 
      id: 'ai', 
      name: t('ai_name') || 'AI Workspace', 
      fullName: t('ai_full_name') || 'Enterprise AI Workspace', 
      icon: faBrain, 
      colorClass: 'text-indigo', 
      bgClass: 'bg-indigo', 
      customColor: '#6366f1',
      permission: 'system_ai',
      desc: t('ai_short_desc') || 'Centralized enterprise reasoning over projects, documents, tasks, financial reports, HR policies, and organizational knowledge.',
    },
    { 
      id: 'drawing', 
      name: 'Drawing Studio', 
      fullName: 'Drawing Studio (Visual Workspace)', 
      icon: faPalette, 
      colorClass: 'text-warning', 
      bgClass: 'bg-warning', 
      customColor: '#f59e0b',
      permission: 'system_drawing',
      desc: 'Create freehand drawings, flowcharts, mind maps, technical diagrams, wireframes, cloud architecture and visual prototypes on an infinite canvas.',
    },
    { 
      id: 'ems', 
      name: 'EMS', 
      fullName: 'Education Management System', 
      icon: faGraduationCap, 
      colorClass: 'text-info', 
      bgClass: 'bg-info', 
      customColor: '#0ea5e9',
      permission: 'system_ems',
      desc: 'Enterprise Education Management System - Institutions, Students, Academics, LMS, Library, Transport, Hostel, Exams, and more.',
    },
  ];


  const allowedSystems = (userRole === 'Admin' || userRole === 'SuperAdmin')
    ? systems 
    : systems.filter(sys => userPerms.includes(sys.permission));

      const containerStyle = {
        minHeight: '100%', padding: '0 32px 32px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };
  return (
        <div style={containerStyle} className={`systems-hub-page ${themeClass}`}>
      <div className="row justify-content-center">
        <div className="col-xl-12">
          <div className="mb-5 text-center fade-in">
                <h1 className="systems-hub-title mb-2">{t('enterprise_systems')}</h1>
                <p className="systems-hub-description mb-0">{t('select_workspace_desc')}</p>
          </div>

          <div className="row g-4">
            {allowedSystems.map((sys) => (
              <div key={sys.id} className="col-xl-3 col-md-6">
                <div 
                  className={`card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all ${sys.status === 'in_building' ? 'bg-light' : 'hover-card cursor-pointer bg-white'}`}
                  onClick={sys.status === 'in_building' ? undefined : () => handleSystemSelect(sys.id)}
                  style={sys.status === 'in_building' ? { cursor: 'not-allowed', opacity: 0.6, filter: 'grayscale(0.5)' } : {}}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div 
                        className={`p-3 rounded-4 bg-opacity-10 shadow-sm ${sys.colorClass}`}
                        style={sys.customColor ? { backgroundColor: `${sys.customColor}1a`, color: sys.status === 'in_building' ? '#adb5bd' : sys.customColor } : {}}
                      >
                        <FontAwesomeIcon icon={sys.icon} size="xl" />
                      </div>
                      {sys.status === 'in_building' ? (
                        <div className="badge bg-warning-subtle text-warning border border-warning px-2 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                          In Building
                        </div>
                      ) : (
                        <div 
                          className={`badge bg-opacity-10 border px-2 py-1 rounded-pill ${sys.colorClass}`} 
                          style={{ 
                            fontSize: '11px', 
                            ...(sys.customColor ? { color: sys.customColor, borderColor: sys.customColor, backgroundColor: `${sys.customColor}1a` } : {}) 
                          }}
                        >
                          {t('active_system')}
                        </div>
                      )}
                    </div>
                    <h5 className="fw-bold mb-1">{sys.name}</h5>
                    <p className={`small fw-medium mb-3 ${sys.colorClass}`} style={sys.customColor ? { color: sys.status === 'in_building' ? '#adb5bd' : sys.customColor } : {}}>{sys.fullName}</p>
                    <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {sys.desc}
                    </p>
                    <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                      <span className="small text-muted">{sys.status === 'in_building' ? 'Coming Soon' : t('go_to_workspace')}</span>
                      <div 
                        className={`btn-circle text-white ${sys.bgClass}`}
                        style={sys.status === 'in_building' ? { backgroundColor: '#ced4da' } : (sys.customColor ? { backgroundColor: sys.customColor } : {})}
                      >
                          <FontAwesomeIcon icon={faChevronRight} size="xs" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {allowedSystems.length === 0 && (
              <div className="col-12 text-center py-5">
                <div className="mb-3 text-muted">
                  <FontAwesomeIcon icon={faUserShield} size="3x" opacity="0.2" />
                </div>
                <h5>{t('no_systems_assigned')}</h5>
                <p className="text-muted">{t('contact_admin_access')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-card {
          border: 1px solid transparent !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
          border-color: rgba(79, 70, 229, 0.1) !important;
        }
        .btn-circle {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .hover-card:hover .btn-circle {
            transform: translateX(5px);
        }
        .cursor-pointer { cursor: pointer; }
      `}} />
    </div>
  );
};

export default SystemsHub;
