import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faTrash,
  faRefresh, faCheckCircle, faBan, faTimeline, faBuildingColumns,
  faUser, faTags, faCoins, faShieldHalved, faInfoCircle, faFolder,
  faStar, faChevronRight, faChevronDown, faXmark, faPrint, faScaleBalanced,
  faChartLine, faClock, faBriefcase, faGlobe, faHistory, faFileInvoice,
  faFolderOpen, faLink, faFileInvoiceDollar, faCogs, faChartPie, faCheck,
  faListCheck, faBuilding, faDiagramProject, faUsers, faWarehouse, faIndustry,
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf,
  faFileContract, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { erpCss, erpColors } from '../../../../components/ui/ux/ErpTheme';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpWithholdingTaxReport = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('challans'); // 'challans', 'dashboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - replace with real API when available
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mock Database for Withholding Challans
  const [challans, setChallans] = useState([
    {
      id: 1,
      challanNum: 'WHT-CHL-2026-001',
      taxPeriod: 'June 2026',
      paymentDate: '2026-07-02',
      cprNum: 'CPR2026070210098231',
      vendorName: 'Silicon Valley Sourcing Inc.',
      vendorStrn: '1700482910214',
      vendorNtn: '4829102-4',
      paymentAmount: 85000,
      whtRate: 4.5,
      whtAmount: 3825,
      status: 'CPR Verified',
      originatingCompany: 'ManageCore Global Inc.',
      originatingBranch: 'Headquarters',
      taxAuthority: 'Federal Board of Revenue (FBR)',
      description: 'Consulting Valkyrie AI Server Nodes System Integration License'
    },
    {
      id: 2,
      challanNum: 'WHT-CHL-2026-002',
      taxPeriod: 'June 2026',
      paymentDate: '2026-07-03',
      cprNum: 'CPR2026070320019284',
      vendorName: 'Delta Systems Pakistan',
      vendorStrn: 'N/A (Unregistered)',
      vendorNtn: '2019284-5',
      paymentAmount: 12000,
      whtRate: 9,
      whtAmount: 1080,
      status: 'Challan Generated',
      originatingCompany: 'ManageCore Global Inc.',
      originatingBranch: 'Headquarters',
      taxAuthority: 'Federal Board of Revenue (FBR)',
      description: 'HQ structural cabling repair and layout modification services'
    }
  ]);

  const filteredChallans = challans.filter(c => {
    const matchesSearch =
      c.challanNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cprNum.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <ErpPageShell
        icon={faFileInvoice}
        title="Withholding Tax Register"
        description="Monitor, calculate, reconcile and file vendor, contractor, and salary withholding taxes with complete Pakistan FBR compliance."
        action={
          <div className="d-flex gap-2 flex-wrap">
            <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} disabled>
              Generate Challans
            </button>
            <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} disabled>
              ATL Filer Check
            </button>
            <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} disabled>
              <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Withholding Analysis
            </button>
            <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} disabled>
              <FontAwesomeIcon icon={faRefresh} /> Refresh
            </button>
          </div>
        }
      >
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[1, 2].map((_, i) => (
            <div key={i} className="btn btn-sm py-2 px-3 fw-bold" style={{ width: '260px', height: '40px', borderRadius: '10px', background: isDark ? '#1e293b' : '#f1f5f9', opacity: 0.6, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <div className="row g-2">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div key={i} className="col-md-2 mb-2">
              <div className="premium-card glass-card h-100" style={{ borderRadius: '12px', padding: '1rem', opacity: 0.6, animation: 'pulse 1.5s infinite' }}>
                <div style={{ width: '80%', height: '8px', borderRadius: '4px', background: isDark ? '#334155' : '#e2e8f0', marginBottom: '8px' }} />
                <div style={{ width: '50%', height: '12px', borderRadius: '4px', background: isDark ? '#334155' : '#e2e8f0' }} />
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.3; } }`}</style>
      </ErpPageShell>
    );
  }

  return (
    <ErpPageShell
      icon={faFileInvoice}
      title="Withholding Tax Register"
      description="Monitor, calculate, reconcile and file vendor, contractor, and salary withholding taxes with complete Pakistan FBR compliance."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => addNotification('Challans generated for June 2026.', 'success')}>
            Generate Challans
          </button>
          <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('ATL filer active status check done.', 'success')}>
            ATL Filer Check
          </button>
          <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI reconciliation completed.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Withholding Analysis
          </button>
          <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'challans', label: 'Challan Registry & CPR Verification', icon: faFileInvoice },
          { id: 'dashboard', label: 'Executive Withholding Dashboard', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className={`premium-tab-btn btn btn-sm py-2 px-3 fw-bold`}
            style={{
              color: activeSubTab === tb.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
              background: activeSubTab === tb.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px'
            }}
            onClick={() => setActiveSubTab(tb.id)}
          >
            <FontAwesomeIcon icon={tb.icon} className="me-2" />
            {tb.label}
          </button>
        ))}
      </div>

      {/* DIRECTORY */}
      {activeSubTab === 'challans' && (
        <div>
          <ErpDataTable
            columns={[
              { key: 'challanNum', label: 'Challan Number', bold: true, render: (val, row) => <span className="font-monospace fw-bold" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => { setSelectedChallan(row); setActiveDetailTab('overview'); }}>{val}</span> },
              { key: 'taxPeriod', label: 'Tax Period', bold: true },
              { key: 'paymentDate', label: 'Payment Date', render: (val) => <span className="font-monospace">{val}</span> },
              { key: 'cprNum', label: 'CPR Number', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
              { key: 'vendorName', label: 'Vendor Name', bold: true },
              { key: 'paymentAmount', label: 'Payment Base', render: (val) => <span className="font-monospace">${val.toLocaleString()}</span> },
              { key: 'whtRate', label: 'WHT Rate', render: (val) => <span className="font-monospace">{val}%</span> },
              { key: 'whtAmount', label: 'Tax Withheld', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#10b981' }}>${val.toLocaleString()}</span> },
              { key: 'status', label: 'Status' },
              { key: 'actions', label: 'Actions', align: 'end', render: (val, row) => <button className="premium-btn btn btn-sm btn-light" style={{ borderRadius: '8px' }} onClick={() => { setSelectedChallan(row); setActiveDetailTab('overview'); }}><FontAwesomeIcon icon={faEye} /></button> },
            ]}
            data={filteredChallans}
            searchable
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by Challan Number, Vendor, CPR Number..."
            emptyMessage="No withholding challans found."
            emptyIcon={faFileInvoice}
            isDark={isDark}
          />
        </div>
      )}

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {[
            { label: 'Total Withholding Txs', val: challans.length, sub: 'Vendor/Contractor transactions', color: accentColor },
            { label: 'Total Tax Withheld', val: '$4,905', color: '#ef4444' },
            { label: 'Vendor Withholding', val: '$3,825', color: '#3b82f6' },
            { label: 'Contractor Withholding', val: '$1,080', color: '#ec4899' },
            { label: 'Employee Withholding', val: '$0', color: '#64748b' },
            { label: 'Salary Withholding', val: '$0', color: '#64748b' },
            { label: 'Filer Withholding', val: '$3,825', color: '#10b981' },
            { label: 'Non-Filer Withholding', val: '$1,080', color: '#ef4444' },
            { label: 'Provincial Withholding', val: '$0', color: '#ec4899' },
            { label: 'Active CPR Challans', val: 1, color: '#10b981' },
            { label: 'Pending CPR Challans', val: 1, color: '#f59e0b' },
            { label: 'Reconciled CPRs', val: 1, color: '#10b981' },
            { label: 'Unreconciled CPRs', val: 1, color: '#ef4444' },
            { label: 'Total Payments Base', val: '$97,000', color: '#3b82f6' },
            { label: 'Withholding Liabilities', val: '$1,080', color: '#ef4444' },
            { label: 'Withholding Payments YTD', val: '$3,825', color: '#10b981' },
            { label: 'Pending Postings', val: '1 Item', color: '#f59e0b' },
            { label: 'Overdue Tax Penalties', val: '$0', color: '#10b981' },
            { label: "Today's Compiled", val: '2 Challans', color: '#10b981' },
            { label: 'Monthly Compiled', val: '2 Challans', color: '#3b82f6' },
            { label: 'FBR Audit Risk Flags', val: '0 Flags', color: '#10b981' },
            { label: 'AI Return Safety Score', val: '99 / 100', color: '#8b5cf6' }
          ].map((k, idx) => (
            <ErpKpiCard key={idx} label={k.label} value={k.val} color={k.color} isDark={isDark} colClass="col-md-2" />
          ))}
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedChallan && (
        <div className="glass-card animate__animated animate__slideInRight" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedChallan.challanNum}</span>
              <h5 className="fw-bold mb-0">{selectedChallan.vendorName}</h5>
              <span className="text-muted small">NTN: {selectedChallan.vendorNtn} • STRN: {selectedChallan.vendorStrn}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedChallan(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          {/* Subtabs list (23 tabs) */}
          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'challans', label: 'Withholding Challans' },
              { id: 'cpr_verify', label: 'CPR Verification' },
              { id: 'vendor_wht', label: 'Vendor Withholding' },
              { id: 'contractor_wht', label: 'Contractor Withholding' },
              { id: 'employee_wht', label: 'Employee Withholding' },
              { id: 'salary_wht', label: 'Salary Withholding' },
              { id: 'sales_txs', label: 'Sales Transactions' },
              { id: 'purchase_txs', label: 'Purchase Transactions' },
              { id: 'gl_mappings', label: 'General Ledger Mappings' },
              { id: 'defaults', label: 'Default Settings' },
              { id: 'returns', label: 'Tax Returns' },
              { id: 'audits', label: 'Tax Audits' },
              { id: 'auths', label: 'Authorizations' },
              { id: 'documents', label: 'Documents' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'notes', label: 'Notes' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'audit_logs', label: 'Audit Logs' },
              { id: 'analysis', label: 'Analytics' },
              { id: 'ai', label: 'AI Insights' }
            ].map(dt => (
              <button
                key={dt.id}
                className={`premium-tab-btn btn btn-sm py-1 px-2 fw-bold ${activeDetailTab === dt.id ? 'active' : ''}`}
                style={{
                  color: activeDetailTab === dt.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                  background: activeDetailTab === dt.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  border: 'none'
                }}
                onClick={() => setActiveDetailTab(dt.id)}
              >
                {dt.label}
              </button>
            ))}
          </div>

          <div className="flex-grow-1 overflow-auto pe-2" style={{ fontSize: '0.8rem' }}>
            {activeDetailTab === 'overview' && (
              <div className="row g-3">
                <div className="col-md-12"><strong>Payment Description:</strong><p className="text-muted mt-1">{selectedChallan.description}</p></div>
                <div className="col-md-6"><strong>FBR CPR Code:</strong><span className="d-block text-muted font-monospace">{selectedChallan.cprNum}</span></div>
                <div className="col-md-6"><strong>Payment Base:</strong><span className="d-block font-monospace fw-bold text-primary">${selectedChallan.paymentAmount.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Withholding Rate:</strong><span className="d-block font-monospace">{selectedChallan.whtRate}%</span></div>
                <div className="col-md-6"><strong>Tax Withheld:</strong><span className="d-block text-success fw-bold font-monospace">${selectedChallan.whtAmount.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>CPR Status:</strong><span className="d-block text-success fw-bold">{selectedChallan.status}</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Withholding Tax Audits</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>ATL Registry Conformity: Safe</strong>
                  <span className="d-block text-muted small mt-1">Vendor NTN 4829102-4 matches FBR Active Taxpayer List (ATL). Active withholding rate calculated correctly at 4.5%. CPR bank clearance verification code validated successfully.</span>
                </div>
              </div>
            )}

            {['challans', 'cpr_verify', 'vendor_wht', 'contractor_wht', 'employee_wht', 'salary_wht', 'sales_txs', 'purchase_txs', 'gl_mappings', 'defaults', 'returns', 'audits', 'auths', 'documents', 'attachments', 'notes', 'timeline', 'audit_logs', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="premium-btn btn btn-sm btn-light" onClick={() => setSelectedChallan(null)}>Close</button>
          </div>
        </div>
      )}

    </ErpPageShell>
  );
};

export default ErpWithholdingTaxReport;
