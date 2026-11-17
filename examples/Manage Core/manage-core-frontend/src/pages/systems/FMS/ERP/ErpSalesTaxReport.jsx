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
  faFileSignature, faLock, faCheckDouble, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';

const ErpSalesTaxReport = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  const [activeSubTab, setActiveSubTab] = useState('annexure_c');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - replace with real API when available
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const [annexureInvoices, setAnnexureInvoices] = useState([
    {
      id: 1,
      buyerName: 'TechFlow Systems Limited',
      buyerStrn: '2200302918417',
      invoiceNum: 'INV-2026-0045',
      invoiceDate: '2026-06-28',
      taxPeriod: 'June 2026',
      salesValue: 150000,
      taxRate: 18,
      salesTax: 27000,
      extraTax: 0,
      furtherTax: 0,
      netValue: 177000,
      status: 'Compiled & Mapped',
      buyerNtn: '3029184-7',
      buyerCnic: 'N/A',
      province: 'Punjab (PRA)',
      originatingBranch: 'Lahore Branch',
      originatingCompany: 'ManageCore Global Inc.',
      hscode: '8523.4920',
      description: 'Consulting Valkyrie AI Server Nodes System Integration License'
    },
    {
      id: 2,
      buyerName: 'Global Distributors Pakistan',
      buyerStrn: '1700982173612',
      invoiceNum: 'INV-2026-0046',
      invoiceDate: '2026-06-29',
      taxPeriod: 'June 2026',
      salesValue: 85000,
      taxRate: 18,
      salesTax: 15300,
      extraTax: 0,
      furtherTax: 0,
      netValue: 100300,
      status: 'Compiled & Mapped',
      buyerNtn: '9821736-1',
      buyerCnic: 'N/A',
      province: 'Sindh (SRB)',
      originatingBranch: 'Karachi Branch',
      originatingCompany: 'ManageCore Global Inc.',
      hscode: '8523.4920',
      description: 'Distributed application software suite volume licenses'
    }
  ]);

  const filteredInvoices = annexureInvoices.filter(i => {
    const matchesSearch =
      i.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.buyerStrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.invoiceNum.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <ErpPageShell
        icon={faFileInvoice}
        title="Sales Tax Returns Compilation"
        description="Compile FBR Pakistan standard Annexure C sales registers, Annexure H refund worksheets, invoice verification status, and tax liability reports."
        action={
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} disabled>
              Compile Report
            </button>
            <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} disabled>
              <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Return Check
            </button>
            <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} disabled>
              Export Excel
            </button>
            <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} disabled>
              <FontAwesomeIcon icon={faRefresh} /> Refresh
            </button>
          </div>
        }
      >
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="btn btn-sm py-2 px-3 fw-bold" style={{ width: '220px', height: '40px', borderRadius: '10px', background: isDark ? '#1e293b' : '#f1f5f9', opacity: 0.6, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <div className="glass-card p-4" style={{ borderRadius: '16px' }}>
          <div className="premium-table-wrapper">
            <div style={{ width: '100%', height: '40px', borderRadius: '8px', background: isDark ? '#334155' : '#e2e8f0', marginBottom: '12px', opacity: 0.6, animation: 'pulse 1.5s infinite' }} />
          </div>
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
      title="Sales Tax Returns Compilation"
      description="Compile FBR Pakistan standard Annexure C sales registers, Annexure H refund worksheets, invoice verification status, and tax liability reports."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => addNotification('Tax period June 2026 compiled successfully.', 'success')}>
            Compile Report
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('FBR IRIS system alignment scan complete. Ready to file.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Return Check
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Return data exported to Excel.', 'success')}>
            Export Excel
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'annexure_c', label: 'FBR Annexure C Sales Registry', icon: faFileInvoice },
          { id: 'annexure_h', label: 'FBR Annexure H Refund Statement', icon: faFileInvoiceDollar },
          { id: 'dashboard', label: 'Executive Returns Dashboard', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className="btn btn-sm py-2 px-3 fw-bold"
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

      {activeSubTab === 'annexure_c' && (
        <div>
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <input type="text" className="form-control form-control-sm" placeholder="Search by Buyer Name, STRN, Invoice..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="glass-card p-4 mb-4" style={{ borderRadius: '16px' }}>
            <div className="premium-table-wrapper">
              <div className="table-responsive">
                <table className="premium-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th>Buyer Name</th>
                      <th>Buyer STRN</th>
                      <th>Invoice Num</th>
                      <th>Invoice Date</th>
                      <th>Tax Period</th>
                      <th>Sales Value</th>
                      <th>Tax Rate</th>
                      <th>Sales Tax</th>
                      <th>Net Value</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map(i => (
                      <tr key={i.id}>
                        <td className="fw-bold" style={{ color: textColor }}>{i.buyerName}</td>
                        <td className="font-monospace fw-bold text-primary">{i.buyerStrn}</td>
                        <td className="font-monospace text-primary fw-bold" style={{ cursor: 'pointer' }} onClick={() => { setSelectedInvoice(i); setActiveDetailTab('overview'); }}>{i.invoiceNum}</td>
                        <td className="font-monospace">{i.invoiceDate}</td>
                        <td className="fw-bold">{i.taxPeriod}</td>
                        <td className="font-monospace">${i.salesValue.toLocaleString()}</td>
                        <td className="font-monospace">{i.taxRate}%</td>
                        <td className="font-monospace text-success fw-bold">${i.salesTax.toLocaleString()}</td>
                        <td className="font-monospace text-success fw-bold">${i.netValue.toLocaleString()}</td>
                        <td>
                          <span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>{i.status}</span>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-light" style={{ borderRadius: '8px' }} onClick={() => { setSelectedInvoice(i); setActiveDetailTab('overview'); }}><FontAwesomeIcon icon={faEye} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'annexure_h' && (
        <div className="glass-card p-4 text-center text-muted" style={{ borderRadius: '16px' }}>
          <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-primary" /> FBR Annexure H (Stock Statement & Input Reconciliation Statement) is generated automatically upon closing the June 2026 return cycle.
        </div>
      )}

      {activeSubTab === 'dashboard' && (
        <div>
          <div className="row g-2 mb-4">
            {[
              { label: 'Total Sales Invoices', val: annexureInvoices.length, sub: 'Invoices compiled', color: accentColor },
              { label: 'Total Output Tax', val: '$42,300', sub: 'Compiled sales tax liability', color: '#ef4444' },
              { label: 'Standard Rated Sales', val: '$235,000', sub: 'Standard 18% base value', color: '#3b82f6' },
              { label: 'Zero Rated Sales', val: '$0', sub: 'Export zero rating base', color: '#64748b' },
              { label: 'Exempt Sales', val: '$0', sub: 'Exempt items value base', color: '#64748b' },
              { label: 'Exports Sales', val: '$0', sub: 'Export invoices registered', color: '#3b82f6' },
              { label: 'Provincial Services', val: '$0', sub: 'SRB/PRA provincial tax base', color: '#ec4899' },
              { label: 'Input Tax Credit', val: '$18,500', sub: 'Input credit offset mapped', color: '#10b981' },
              { label: 'Net Sales Tax Payable', val: '$23,800', sub: 'Due FBR national treasury', color: '#ef4444' },
              { label: 'Net Refund Claimable', val: '$0', sub: 'Carryforward credit claimed', color: '#10b981' },
              { label: 'Reconciled Invoices', val: 2, sub: 'General ledger match confirmed', color: '#10b981' },
              { label: 'Unreconciled Invoices', val: 0, sub: 'Ledger discrepancy flags', color: '#ef4444' },
              { label: 'Annexure C Registered', val: '2 Invoices', sub: 'Uploaded FBR sandbox', color: '#10b981' },
              { label: 'Annexure C Pending', val: 0, sub: 'Pending FBR validation', color: '#f59e0b' },
              { label: 'Annexure H Registered', val: 'N/A', sub: 'Refund statements generated', color: '#64748b' },
              { label: 'Annexure H Pending', val: 0, sub: 'Carryforward statements pending', color: '#f59e0b' },
              { label: 'Under FBR Audit', val: '$0', sub: 'Disputed audit reserves', color: '#ef4444' },
              { label: 'Overdue Tax Liabilities', val: '$0', sub: 'Overdue penalties', color: '#ef4444' },
              { label: "Today's Compiled", val: '2 Invoices', sub: 'Valkyrie compiler runs', color: '#10b981' },
              { label: 'Monthly Compiled', val: '2 Invoices', sub: 'Compiled this month', color: '#3b82f6' },
              { label: 'FBR Audit Risk Flags', val: '0 Flags', sub: 'Risk score is safe', color: '#10b981' },
              { label: 'AI Return Safety Score', val: '99 / 100', sub: 'Valkyrie compliance score', color: '#8b5cf6' }
            ].map((k, idx) => (
              <div key={idx} className="col-md-2 mb-2">
                <div className="premium-card glass-card h-100" style={{ borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: mutedColor, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', lineHeight: '1.2' }}>{k.label}</div>
                  <div>
                    <div className="fw-bold mb-1" style={{ color: k.color, fontSize: '1.15rem' }}>{k.val}</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{k.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedInvoice.invoiceNum}</span>
              <h5 className="fw-bold mb-0">{selectedInvoice.buyerName}</h5>
              <span className="text-muted small">STRN: {selectedInvoice.buyerStrn} • Originating: {selectedInvoice.originatingBranch}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedInvoice(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'annexure_c', label: 'Annexure C' },
              { id: 'annexure_h', label: 'Annexure H' },
              { id: 'drilldown', label: 'Invoice Drill-downs' },
              { id: 'credit', label: 'Credit Notes' },
              { id: 'debit', label: 'Debit Notes' },
              { id: 'provincial', label: 'Provincial Returns' },
              { id: 'custom', label: 'Custom Clearing' },
              { id: 'reconcile', label: 'Reconciliations' },
              { id: 'gl_adj', label: 'GL Adjustments' },
              { id: 'audits', label: 'Tax Audits' },
              { id: 'history', label: 'History' },
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
                className="btn btn-sm py-1 px-2 fw-bold"
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
                <div className="col-md-12"><strong>Invoice Description:</strong><p className="text-muted mt-1">{selectedInvoice.description}</p></div>
                <div className="col-md-6"><strong>Buyer NTN:</strong><span className="d-block text-muted font-monospace">{selectedInvoice.buyerNtn}</span></div>
                <div className="col-md-6"><strong>Buyer STRN:</strong><span className="d-block text-muted font-monospace">{selectedInvoice.buyerStrn}</span></div>
                <div className="col-md-6"><strong>HS Code Classification:</strong><span className="d-block text-muted font-monospace">{selectedInvoice.hscode}</span></div>
                <div className="col-md-6"><strong>Sales Base Value:</strong><span className="d-block font-monospace fw-bold">${selectedInvoice.salesValue.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Sales Tax Rate:</strong><span className="d-block font-monospace">{selectedInvoice.taxRate}%</span></div>
                <div className="col-md-6"><strong>Sales Tax Charged:</strong><span className="d-block text-success fw-bold font-monospace">${selectedInvoice.salesTax.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Gross Net Invoice Value:</strong><span className="d-block text-primary fw-bold font-monospace">${selectedInvoice.netValue.toLocaleString()}</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Sales Tax Analysis</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>HS Code Conformity: High Confidence</strong>
                  <span className="d-block text-muted small mt-1">HS Code 8523.4920 corresponds cleanly to software licensing. Buyer STRN is verified active on FBR ATL. Net sales tax has been calculated correctly at 18%.</span>
                </div>
              </div>
            )}

            {['annexure_c', 'annexure_h', 'drilldown', 'credit', 'debit', 'provincial', 'custom', 'reconcile', 'gl_adj', 'audits', 'history', 'auths', 'documents', 'attachments', 'notes', 'timeline', 'audit_logs', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedInvoice(null)}>Close</button>
          </div>
        </div>
      )}
    </ErpPageShell>
  );
};

export default ErpSalesTaxReport;
