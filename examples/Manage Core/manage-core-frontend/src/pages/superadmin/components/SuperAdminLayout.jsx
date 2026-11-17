import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faServer, faPowerOff, faUserShield, faChevronRight,
  faNetworkWired, faBuilding, faSliders, faScaleBalanced,
  faCogs, faShieldHalved, faFileInvoiceDollar, faHistory,
  faDatabase, faCloudArrowUp, faHeadset, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const SuperAdminLayout = ({ children, activeTab, setActiveTab, logout, isDark }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Control Tower', icon: faNetworkWired },
    { id: 'provisioner', label: 'Tenant Provisioning', icon: faBuilding },
    { id: 'licensing', label: 'Plans & Licensing',  icon: faSliders },
    { id: 'quotas', label: 'Resource Quotas', icon: faScaleBalanced },
    { id: 'modules', label: 'Module Control', icon: faCogs },
    { id: 'ai-knowledge-center', label: 'AI Knowledge Center', icon: faBrain },
    { id: 'ai-provider-settings', label: 'AI Provider Settings', icon: faCog },
    { id: 'security', label: 'Security & Access', icon: faShieldHalved },
    { id: 'billing', label: 'Billing & Intelligence', icon: faFileInvoiceDollar },
    { id: 'audit', label: 'Audit & Compliance', icon: faHistory },
    { id: 'configs', label: 'System Configurations', icon: faDatabase },
    { id: 'deployment', label: 'Deployment & Flags', icon: faCloudArrowUp },
    // { id: 'support', label: 'Support Operations', icon: faHeadset }
  ];

  return (
    <div className={`container-fluid min-vh-100 px-0 d-flex flex-column ${isDark ? 'dark-mode bg-dark text-white' : 'bg-light text-dark'}`} style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
      
      {/* Top Header */}
      <header className={`navbar navbar-expand-lg border-bottom px-4 py-3 sticky-top ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white shadow-sm'}`} style={{ zIndex: 100, backdropFilter: 'blur(16px)', background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.95)' }}>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-4 p-2 d-flex align-items-center justify-content-center shadow-lg transition-all hover-scale" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', width: '44px', height: '44px' }}>
              <FontAwesomeIcon icon={faServer} className="text-white fs-5" />
            </div>
            <div>
              <span className="fw-black fs-5 tracking-tight d-flex align-items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                ManageCore <span className="badge bg-danger rounded-pill px-2.5 py-1 uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px', fontWeight: '900' }}>Global Console</span>
              </span>
              <p className="text-muted mb-0 x-small" style={{ fontSize: '10px', fontWeight: '600' }}>Platform Control Tower v5.2.0 &bull; Secure Cluster Node</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success small">
              <div className="pulse-green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              <span className="fw-bold" style={{ fontSize: '11px', letterSpacing: '0.3px' }}>Cluster Sync Online</span>
            </div>
            
            <div className="vr mx-2 opacity-10"></div>

            <button className="btn btn-sm btn-outline-danger rounded-pill px-3.5 py-2 fw-black d-flex align-items-center gap-2 transition-all hover-lift" onClick={logout} style={{ fontSize: '11px' }}>
              <FontAwesomeIcon icon={faPowerOff} className="small" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>
      </header>

      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`border-end flex-shrink-0 py-4 overflow-y-auto custom-sidebar-scroll ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`} style={{ width: '300px', maxHeight: 'calc(100vh - 72px)' }}>
          <div className="px-3 mb-4">
            <div className="d-flex align-items-center gap-3 px-3 py-3 rounded-4 border shadow-sm" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary shadow-inner" style={{ width: '42px', height: '42px' }}>
                <FontAwesomeIcon icon={faUserShield} className="fs-5" />
              </div>
              <div>
                <span className="text-uppercase fw-black text-primary d-block" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>Root Super Admin</span>
                <span className="text-muted x-small d-block fw-bold" style={{ fontSize: '10px' }}>Admin Node #14</span>
              </div>
            </div>
          </div>

          <div className="nav flex-column nav-pills px-3 gap-2">
            {menuItems.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`nav-link text-start w-100 py-3 px-3 transition-all d-flex gap-3 align-items-center rounded-4 border-0 ${activeTab === item.id ? 'active shadow-lg' : 'text-muted hover-bg-light'}`}
                style={{
                  background: activeTab === item.id ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' : 'transparent',
                  color: activeTab === item.id ? '#ffffff' : undefined,
                }}
                onClick={() => setActiveTab(item.id)}
              >
                <div className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${activeTab === item.id ? 'bg-white bg-opacity-20' : 'bg-light text-muted'}`} style={{ width: '38px', height: '38px' }}>
                  <FontAwesomeIcon icon={item.icon} className="fs-5" />
                </div>
                <div className="flex-grow-1">
                  <span className="fw-bold d-block" style={{ fontSize: '14px' }}>{item.label}</span>
                  <span className={`x-small d-block opacity-75`} style={{ fontSize: '10px' }}>{item.desc}</span>
                </div>
                {activeTab === item.id && <FontAwesomeIcon icon={faChevronRight} className="small opacity-50" />}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-grow-1 p-4 p-lg-5 overflow-auto ${isDark ? 'bg-dark' : 'bg-light bg-opacity-50'}`} style={{ maxHeight: 'calc(100vh - 72px)' }}>
          <div className="container-fluid px-0 max-width-xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .max-width-xl { max-width: 1400px; }
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .hover-bg-light:hover { background-color: rgba(0,0,0,0.03) !important; }
        .dark-mode .hover-bg-light:hover { background-color: rgba(255,255,255,0.03) !important; }
        .pulse-green { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); animation: pulse-green 2s infinite; }
        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .fw-black { font-weight: 900; }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
      `}} />
    </div>
  );
};

export default SuperAdminLayout;
