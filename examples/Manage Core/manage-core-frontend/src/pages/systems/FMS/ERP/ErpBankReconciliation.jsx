import React, { useState, useMemo, useEffect } from 'react';
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
  faShuffle, faArrowRightToBracket, faCalculator, faBrain, faFileWord, faFileAlt,
  faEdit, faFileSignature, faEnvelope, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { getPaymentMetrics } from '../../../../api/ams';

const ErpBankReconciliation = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          getPaymentMetrics(),
        ]);
        const [metricsRes] = results;
        if (metricsRes.status === 'fulfilled' && metricsRes.value?.data) {
          const m = metricsRes.value.data;
          setApiData({
            statements: [{
              id: 1,
              statementNum: m.statement_number || 'STMT-2026-API-01',
              statementDate: m.statement_date || new Date().toISOString().slice(0, 10),
              bankName: m.bank_name || 'Chase Bank N.A.',
              branchName: m.bank_branch || 'Manhattan Wall Street Branch',
              bankAccount: m.bank_account || 'Chase Treasury Operating Account',
              iban: m.iban || 'US89CHAS1029384756',
              currency: m.currency || 'USD',
              openingBalance: m.opening_balance || 0,
              closingBalance: m.closing_balance || 0,
              statementBalance: m.statement_balance || m.closing_balance || 0,
              bookBalance: m.book_balance || m.closing_balance || 0,
              difference: m.difference || 0,
              statementPeriod: m.statement_period || 'Current Period',
              importSource: m.import_source || 'API Bank Feed',
              importedBy: m.imported_by || 'System',
              importedDate: m.imported_date || new Date().toISOString().slice(0, 10),
              status: m.status || 'Imported'
            }],
            metrics: m
          });
        }
      } catch (err) {
        console.warn('Reconciliation API fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onRefresh = () => {
      addNotification?.('Reconciliation refreshed.', 'success');
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  // Mock Database for Statements
  const [statements, setStatements] = useState([
    {
      id: 1,
      statementNum: 'STMT-2026-CHASE-06',
      statementDate: '2026-06-30',
      bankName: 'Chase Bank N.A.',
      branchName: 'Manhattan Wall Street Branch',
      bankAccount: 'Chase Treasury Operating Account',
      iban: 'US89CHAS1029384756',
      currency: 'USD',
      openingBalance: 7200000,
      closingBalance: 8250000,
      statementBalance: 8250000,
      bookBalance: 8250000,
      difference: 0,
      statementPeriod: 'June 2026',
      importSource: 'Electronic Feed (MT940)',
      importedBy: 'System Scheduler',
      importedDate: '2026-07-01',
      status: 'Approved'
    },
    {
      id: 2,
      statementNum: 'STMT-2026-BARC-06',
      statementDate: '2026-06-30',
      bankName: 'Barclays Bank PLC',
      branchName: 'London Canary Wharf Branch',
      bankAccount: 'Barclays London Operational Account',
      iban: 'GB44BARC2091823746',
      currency: 'GBP',
      openingBalance: 310000,
      closingBalance: 390000,
      statementBalance: 390000,
      bookBalance: 390050,
      difference: -50,
      statementPeriod: 'June 2026',
      importSource: 'Excel Upload',
      importedBy: 'Elena Rostova',
      importedDate: '2026-07-02',
      status: 'Pending Approval'
    }
  ]);

  const [newStatement, setNewStatement] = useState({
    statementNum: '', bankName: '', bankAccount: '', currency: 'USD',
    openingBalance: '', closingBalance: '', statementPeriod: ''
  });

  const handleCreateReconciliation = (e) => {
    e.preventDefault();
    if (!newStatement.statementNum || !newStatement.bankName) {
      addNotification('Statement Number and Bank Name are required.', 'danger');
      return;
    }
    const ob = parseFloat(newStatement.openingBalance || '0');
    const cb = parseFloat(newStatement.closingBalance || '0');
    const added = {
      id: Date.now(),
      statementNum: newStatement.statementNum,
      statementDate: '2026-07-06',
      bankName: newStatement.bankName,
      branchName: 'Main Branch',
      bankAccount: newStatement.bankAccount || 'Local Account',
      iban: 'N/A',
      currency: newStatement.currency,
      openingBalance: ob,
      closingBalance: cb,
      statementBalance: cb,
      bookBalance: cb,
      difference: 0,
      statementPeriod: newStatement.statementPeriod || 'July 2026',
      importSource: 'API Bank Feed',
      importedBy: 'Elena Rostova',
      importedDate: '2026-07-06',
      status: 'Imported'
    };
    setStatements([added, ...statements]);
    setShowAddModal(false);
    addNotification('Bank statement imported successfully.', 'success');
  };

  const displayStatements = useMemo(() => {
    if (apiData?.statements?.length) return apiData.statements;
    return statements;
  }, [apiData, statements]);

  const filteredStatements = displayStatements.filter(s => {
    const matchesSearch =
      s.statementNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.bankAccount.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type) => {
    const data = filteredStatements;
    const cols = [
      { key: 'statementNum', label: 'Statement Number' }, { key: 'statementPeriod', label: 'Statement Period' },
      { key: 'bankName', label: 'Bank Name' }, { key: 'openingBalance', label: 'Opening Balance' },
      { key: 'closingBalance', label: 'Closing Balance' }, { key: 'statementBalance', label: 'Statement Balance' },
      { key: 'bookBalance', label: 'Book Balance' }, { key: 'difference', label: 'Difference' },
      { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'bank_reconciliation.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'bank_reconciliation.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { exportPdf({ title: 'Bank Reconciliation', headers, rows }); }
    else if (type === 'docx') { exportDocx({ title: 'Bank Reconciliation', headers, rows, filename: 'bank_reconciliation.docx' }); }
    else if (type === 'word') { exportWord({ title: 'Bank Reconciliation', headers, rows, filename: 'bank_reconciliation.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="btn btn-sm premium-btn dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.statementNum || '', row });
  const handleDeleteConfirm = async () => {
    try {
      setStatements(prev => prev.filter(s => s.id !== deleteDialog.id));
      addNotification?.('Statement moved to trash.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    } catch (err) { addNotification?.(err.message || 'Failed to delete statement', 'error'); }
  };

  const handleMoveToDraft = (row) => {
    setStatements(prev => prev.map(s => s.id === row.id ? { ...s, status: 'Draft' } : s));
    addNotification?.(`${row.statementNum} moved to Draft.`, 'success');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'bank_reconciliation' });
    setActiveTab?.('erp_bank_reconciliation');
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Total Reconciliations', val: displayStatements.length, icon: faScaleBalanced, color: colors.primary, trendVal: 'Imported statement sheets' },
    { label: 'Pending Reconciliations', val: displayStatements.filter(s => s.status === 'Pending Approval' || s.status === 'Imported').length, icon: faClock, color: colors.warning, trendVal: 'Statements awaiting match' },
    { label: 'Completed Reconciliations', val: displayStatements.filter(s => s.status === 'Approved').length, icon: faCheckCircle, color: colors.success, trendVal: 'Posted adjustments complete' },
    { label: 'Unreconciled Difference', val: '-$50', icon: faExclamationTriangle, color: colors.danger, trendVal: 'Outstanding items' },
    { label: 'AI Match Confidence', val: '96.2%', icon: faBrain, color: colors.purple, trendVal: 'AI recommendation probability' },
  ], [displayStatements]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Bank Reconciliation Workbench"
      description="Automatically reconcile bank statements with ERP transactions using intelligent matching, approval workflows, and complete audit trails."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_import_bank_statement')}>
            <FontAwesomeIcon icon={faArrowRightToBracket} /> Import Bank Statement
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Auto match run complete. 12 matches found.', 'success')}>
            <FontAwesomeIcon icon={faShuffle} className="me-1" /> Auto Match
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Manual reconciliation workbench opened.', 'info')}>
            <FontAwesomeIcon icon={faCalculator} className="me-1" /> Manual Match
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI reconciliation audit verification completed.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Matching Analysis
          </button>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Imported Bank Statements', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Reconcile Dashboard', icon: faChartPie },
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

      {activeSubTab === 'directory' && (
        <>
          {/* AI Recommendation Card */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Matching Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Suggested match: statement credit entry on 2026-06-28 ($150,000) corresponds to sales invoice INV-2026-0045 with 99.4% confidence.</div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5" style={{ color: mutedColor }}>
              <div className="spinner-border text-primary mb-2" role="status" />
              <div className="small">Loading statements...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger small mb-4" role="alert">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          ) : (
          <ErpDataTable
            columns={[
              { key: 'statementNum', label: 'Statement Number', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const s = statements.find(x => x.statementNum === val); if (s) { setSelectedStatement(s); setActiveDetailTab('overview'); } }}>{val}</span> },
              { key: 'statementPeriod', label: 'Statement Period', bold: true },
              { key: 'bankName', label: 'Bank Name' },
              { key: 'openingBalance', label: 'Opening Balance', render: (_, row) => <span className="font-monospace">${row.openingBalance.toLocaleString()}</span> },
              { key: 'closingBalance', label: 'Closing Balance', render: (_, row) => <span className="font-monospace">${row.closingBalance.toLocaleString()}</span> },
              { key: 'statementBalance', label: 'Statement Balance', render: (_, row) => <span className="font-monospace text-success fw-bold">${row.statementBalance.toLocaleString()}</span> },
              { key: 'bookBalance', label: 'Book Balance', render: (_, row) => <span className="font-monospace text-primary fw-bold">${row.bookBalance.toLocaleString()}</span> },
              { key: 'difference', label: 'Difference', render: (_, row) => <span className="font-monospace text-danger fw-bold">${row.difference.toLocaleString()}</span> },
              { key: 'status', label: 'Status', render: (val) => (
                <span className="premium-badge" style={{
                  background: val === 'Approved' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#78350f' : '#fef3c7'),
                  color: val === 'Approved' ? '#10b981' : '#d97706'
                }}>{val}</span>
              )},
              { key: 'actions', label: '', align: 'end', render: (_, row) => (
                <div className="d-flex gap-1 justify-content-end">
                  <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => setViewItem(row)}
                    onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-sm border-0 premium-btn" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                    <FontAwesomeIcon icon={faFileSignature} />
                  </button>
                  <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                    <FontAwesomeIcon icon={faFilePdf} />
                  </button>
                  <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
                    onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </button>
                  <button className="btn btn-sm border-0 premium-btn" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              )},
            ]}
            data={filteredStatements}
            searchable
            searchPlaceholder="Search by Statement Number, Bank Name, Account..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            exportButtons={exportButtons}
            isDark={isDark}
          />
          )}
        </>
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {[
            { label: 'Total Reconciliations', val: displayStatements.length, sub: 'Imported statement sheets', color: accentColor },
            { label: 'Today\'s Reconciliations', val: 0, sub: 'Reconciliations finalized today', color: '#10b981' },
            { label: 'Pending Reconciliations', val: 1, sub: 'Statements awaiting match', color: '#f59e0b' },
            { label: 'Completed Reconciliations', val: 1, sub: 'Posted adjustments complete', color: '#10b981' },
            { label: 'Approved Reconciliations', val: 1, sub: 'Audit review finalized', color: '#3b82f6' },
            { label: 'Rejected Reconciliations', val: 0, sub: 'Statements containing errors', color: '#ef4444' },
            { label: 'Auto Matched Transactions', val: '24 Items', sub: 'EBS API matched', color: '#10b981' },
            { label: 'Manual Matches', val: '2 Items', sub: 'Controller manually matched', color: '#3b82f6' },
            { label: 'Unmatched Transactions', val: '1 Item', sub: 'Unpresented item details', color: '#ef4444' },
            { label: 'Partially Matched', val: 0, sub: 'Split postings pending', color: '#f59e0b' },
            { label: 'Outstanding Cheques', val: '$65,000', sub: 'Uncleared bank releases', color: '#f59e0b' },
            { label: 'Outstanding Deposits', val: '$45,000', sub: 'In transit ledger posts', color: '#3b82f6' },
            { label: 'Bank Charges Pending', val: '$25', sub: 'Unposted bank charges', color: '#ef4444' },
            { label: 'Interest Pending', val: '$0', sub: 'Treasury interest yield', color: '#10b981' },
            { label: 'Reconciliation Accuracy %', val: '99.9%', sub: 'Target accuracy rating', color: '#10b981' },
            { label: 'Matching Success Rate %', val: '94.2%', sub: 'Auto-matching rate', color: '#3b82f6' },
            { label: 'Today\'s Bank Balance', val: '$8,250,000', sub: 'Statement balance total', color: '#10b981' },
            { label: 'Today\'s Book Balance', val: '$8,250,050', sub: 'ERP general ledger balance', color: '#3b82f6' },
            { label: 'Difference Amount', val: '-$50', sub: 'Unreconciled difference', color: '#ef4444' },
            { label: 'AI Match Confidence', val: '96.2%', sub: 'AI recommendation probability', color: '#8b5cf6' },
            { label: 'Financial Health Score', val: '98 / 100', sub: 'Audit safety score', color: '#10b981' }
          ].map((k, idx) => (
            <ErpKpiCard
              key={idx}
              label={k.label}
              value={k.val}
              icon={faChartLine}
              color={k.color}
              trendVal={k.sub}
              isDark={isDark}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faScaleBalanced} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Statement Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Approved' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.statementNum}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Bank: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.bankName}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Period: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.statementPeriod}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Account: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.bankAccount}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opening Balance</small>
                      <p className="mb-0 mt-1 font-monospace" style={{ color: textColor, fontSize: '0.85rem' }}>${viewItem.openingBalance.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Closing Balance</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>${viewItem.closingBalance.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Difference</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.danger, fontSize: '1rem' }}>${viewItem.difference.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Import Source</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.importSource}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Imported By</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.importedBy}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Statement Balance</small>
                  <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.primary, fontSize: '1rem' }}>${viewItem.statementBalance.toLocaleString()} (Book: ${viewItem.bookBalance.toLocaleString()})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStatement && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedStatement.statementNum}</span>
              <h5 className="fw-bold mb-0">{selectedStatement.bankName}</h5>
              <span className="text-muted small">Period: {selectedStatement.statementPeriod} • {selectedStatement.status}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedStatement(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'statement', label: 'Statement Information' },
              { id: 'imported_txs', label: 'Imported Transactions' },
              { id: 'erp_txs', label: 'ERP Transactions' },
              { id: 'matched', label: 'Matched Transactions' },
              { id: 'unmatched', label: 'Unmatched Transactions' },
              { id: 'outstanding', label: 'Outstanding Items' },
              { id: 'adjustments', label: 'Adjustment Entries' },
              { id: 'journal', label: 'Journal Entries' },
              { id: 'costcenters', label: 'Cost Centers' },
              { id: 'profitcenters', label: 'Profit Centers' },
              { id: 'analytics', label: 'Analytic Accounts' },
              { id: 'projects', label: 'Projects' },
              { id: 'departments', label: 'Departments' },
              { id: 'treasury', label: 'Treasury' },
              { id: 'approvals', label: 'Approvals' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'documents', label: 'Documents' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'notes', label: 'Notes' },
              { id: 'audit', label: 'Audit Logs' },
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
                <div className="col-md-6"><strong>Statement Source:</strong><span className="d-block text-muted">{selectedStatement.importSource} (by {selectedStatement.importedBy})</span></div>
                <div className="col-md-6"><strong>Import Date:</strong><span className="d-block text-muted">{selectedStatement.importedDate}</span></div>
                <div className="col-md-6"><strong>Opening Statement Balance:</strong><span className="d-block font-monospace">${selectedStatement.openingBalance.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Closing Statement Balance:</strong><span className="d-block text-success fw-bold font-monospace">${selectedStatement.closingBalance.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Book General Ledger Balance:</strong><span className="d-block text-primary fw-bold font-monospace">${selectedStatement.bookBalance.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Unreconciled Difference:</strong><span className="d-block text-danger fw-bold font-monospace">${selectedStatement.difference.toLocaleString()}</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Matching Recommendations</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>Intelligent Transaction Suggestion:</strong>
                  <span className="d-block text-muted small mt-1">Suggested match: statement credit entry on 2026-06-28 ($150,000) corresponds to sales invoice INV-2026-0045 ($150,000) with a 99.4% confidence match score based on amount & date.</span>
                </div>
              </div>
            )}

            {['statement', 'imported_txs', 'erp_txs', 'matched', 'unmatched', 'outstanding', 'adjustments', 'journal', 'costcenters', 'profitcenters', 'analytics', 'projects', 'departments', 'treasury', 'approvals', 'timeline', 'documents', 'attachments', 'notes', 'audit', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedStatement(null)}>Close</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-card p-4 w-100" style={{ borderRadius: '20px', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', color: textColor }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Import Electronic Bank Statement</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateReconciliation} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Statement Number</label>
                <input type="text" className="form-control" placeholder="STMT-2026-CHASE-07" value={newStatement.statementNum} onChange={e => setNewStatement({ ...newStatement, statementNum: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Bank Name</label>
                <input type="text" className="form-control" placeholder="Chase Bank N.A." value={newStatement.bankName} onChange={e => setNewStatement({ ...newStatement, bankName: e.target.value })} required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Bank Account / IBAN</label>
                <input type="text" className="form-control" placeholder="Chase Treasury Account" value={newStatement.bankAccount} onChange={e => setNewStatement({ ...newStatement, bankAccount: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold mb-1">Currency</label>
                <select className="form-select" value={newStatement.currency} onChange={e => setNewStatement({ ...newStatement, currency: e.target.value })}>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="PKR">PKR</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold mb-1">Statement Period</label>
                <input type="text" className="form-control" placeholder="July 2026" value={newStatement.statementPeriod} onChange={e => setNewStatement({ ...newStatement, statementPeriod: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Opening Balance ($)</label>
                <input type="number" className="form-control" value={newStatement.openingBalance} onChange={e => setNewStatement({ ...newStatement, openingBalance: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Closing Balance ($)</label>
                <input type="number" className="form-control" value={newStatement.closingBalance} onChange={e => setNewStatement({ ...newStatement, closingBalance: e.target.value })} required />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold mb-1">Select Bank Statement File (CSV, MT940, OFX, Excel)</label>
                <input type="file" className="form-control" disabled />
                <span className="text-muted small mt-1 d-block">Simulated direct upload. Electronic Bank Statement will populate workspace fields.</span>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-sm text-white border-0 px-4 premium-gradient-btn" style={{ borderRadius: '10px', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save & Process</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this statement to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpBankReconciliation;
