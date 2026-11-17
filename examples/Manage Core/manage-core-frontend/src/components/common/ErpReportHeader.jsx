import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen, faChartLine, faSliders, faShieldHalved, faBook, faFileAlt,
  faScaleBalanced, faFileInvoice, faCoins, faUsers, faClock,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

const erpReportTabs = [
  { id: 'center', label: 'Report Center', icon: faFolderOpen },
  { id: 'exec', label: 'Executive Summary', icon: faChartLine },
  { id: 'ctrl', label: 'Control Center', icon: faSliders },
  { id: 'qa', label: 'Quality Assurance', icon: faShieldHalved },
  { id: 'daybook', label: 'Day Book', icon: faBook },
  { id: 'gl', label: 'General Ledger', icon: faFileAlt },
  { id: 'tb', label: 'Trial Balance', icon: faScaleBalanced },
  { id: 'pl', label: 'Profit & Loss', icon: faFileInvoice },
  { id: 'bs', label: 'Balance Sheet', icon: faFileInvoice },
  { id: 'cashflow', label: 'Cash Flow', icon: faCoins },
  { id: 'customer_ledger', label: 'Customer Ledger Summary', icon: faUsers },
  { id: 'vendor_ledger', label: 'Vendor Ledger Summary', icon: faUsers },
  { id: 'ar_aging', label: 'Receivables Aging', icon: faClock },
  { id: 'ap_aging', label: 'Payables Aging', icon: faClock }
];

const ErpReportHeader = ({
  title,
  badge,
  description,
  isDark,
  actions = [],
  activeTabId,
  onTabClick
}) => {
  return (
    <div className="container-fluid px-4 px-lg-5 pt-4">
      {/* Dynamic Styling and Animations */}
      <style>{`
        .premium-report-hero {
          position: relative;
          overflow: hidden;
          background: ${
            isDark
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'
          };
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.12)'};
          border-radius: 24px;
          box-shadow: ${
            isDark
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 10px 30px -10px rgba(99, 102, 241, 0.15)'
          };
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .premium-report-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }

        /* Glowing background blobs for dark mode / Soft gradient shapes for light mode */
        .glowing-orb-1 {
          position: absolute;
          right: -10%;
          top: -20%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: ${
            isDark
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
          };
          z-index: 1;
          pointer-events: none;
        }

        .glowing-orb-2 {
          position: absolute;
          left: -5%;
          bottom: -30%;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: ${
            isDark
              ? 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)'
          };
          z-index: 1;
          pointer-events: none;
        }

        /* Live status dot animation */
        .live-dot-pulse {
          position: relative;
          display: inline-flex;
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #10b981;
        }

        .live-dot-pulse::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #10b981;
          animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }

        /* Premium Badge */
        .custom-badge-p {
          background: ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)'};
          color: ${isDark ? '#cbd5e1' : '#4f46e5'};
          border: 1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'};
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 11px;
        }

        /* Interactive tabs container */
        .report-tabs-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          background: ${isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)'};
          backdrop-filter: blur(16px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.08)'};
          border-radius: 18px;
          overflow-x: auto;
          white-space: nowrap;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          box-shadow: ${
            isDark
              ? 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
              : '0 4px 15px rgba(99, 102, 241, 0.04)'
          };
          scrollbar-width: none; /* Firefox */
        }
        
        .report-tabs-nav::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        /* Elegant glassmorphic tab pills */
        .report-tab-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          color: ${isDark ? '#94a3b8' : '#64748b'};
          background: transparent;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .report-tab-pill:hover {
          color: ${isDark ? '#f8fafc' : '#312e81'};
          background: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(99, 102, 241, 0.05)'};
          transform: translateY(-1px);
        }

        .report-tab-pill.active {
          color: #ffffff !important;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }

        .report-tab-pill:active {
          transform: scale(0.97);
        }

        /* Pulse indicator text */
        .status-badge-container {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: ${isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.06)'};
          border: 1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'};
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
          color: #10b981;
        }

        /* Micro-animations on buttons */
        .btn-premium-action {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          font-weight: 600;
        }
        
        .btn-premium-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Main Glassmorphic Hero Panel */}
      <div className="premium-report-hero p-4 p-lg-5 mb-4">
        {/* Glow Spheres */}
        <div className="glowing-orb-1"></div>
        <div className="glowing-orb-2"></div>

        <div className="row align-items-center position-relative z-3">
          <div className="col-lg-8">
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              {badge && (
                <span className="badge custom-badge-p px-3 py-2 rounded-pill">
                  {badge}
                </span>
              )}
              
              {/* Liveness Indicator */}
              <div className="status-badge-container">
                <span className="live-dot-pulse"></span>
                <span>Ledger Core: Live</span>
              </div>
            </div>

            <h1 
              className="fw-extrabold tracking-tight mb-2 display-6"
              style={{ 
                color: isDark ? '#ffffff' : '#0f172a',
                fontFamily: "'Outfit', 'Inter', sans-serif"
              }}
            >
              {title}
            </h1>
            
            <p 
              className="fs-6 mb-4" 
              style={{ 
                color: isDark ? '#94a3b8' : '#475569',
                maxWidth: '700px',
                lineHeight: '1.6'
              }}
            >
              {description}
            </p>

            {/* Custom Header Actions */}
            {actions.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {actions.map((act, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm btn-premium-action px-3 py-2 d-flex align-items-center gap-2 ${
                      act.variant === 'primary' 
                        ? 'btn-primary text-white border-0' 
                        : isDark ? 'btn-outline-light' : 'btn-outline-primary'
                    }`}
                    style={
                      act.variant === 'primary' 
                        ? { background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }
                        : {}
                    }
                    onClick={act.onClick}
                  >
                    {act.icon && <FontAwesomeIcon icon={act.icon} />}
                    {act.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Subtle decoration graphic for premium SaaS look */}
          <div className="col-lg-4 d-none d-lg-flex justify-content-end align-items-center pe-4">
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '120px',
                height: '120px',
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(99, 102, 241, 0.04)',
                border: `2px dashed ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.15)'}`
              }}
            >
              <FontAwesomeIcon 
                icon={faDatabase} 
                className="fs-1" 
                style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.25)' }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector Navigation bar */}
      {activeTabId && onTabClick && (
        <div className="mb-4">
          <div className="report-tabs-nav">
            {erpReportTabs.map(tab => {
              // Determine if active
              const isActive = tab.id === activeTabId;
              
              return (
                <button
                  key={tab.id}
                  className={`report-tab-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onTabClick(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpReportHeader;
