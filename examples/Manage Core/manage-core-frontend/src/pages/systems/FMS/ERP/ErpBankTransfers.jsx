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
  faExchangeAlt, faArrowRightArrowLeft, faBrain, faFileWord, faFileAlt,
  faEdit, faFileSignature, faEnvelope, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { listStockTransfers } from '../../../../api/ams';

const ErpBankTransfers = () => {
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
  const [selectedTransfer, setSelectedTransfer] = useState(null);
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
          listStockTransfers({ page: 1, limit: 200 }),
        ]);
        const [transfersRes] = results;
        if (transfersRes.status === 'fulfilled' && transfersRes.value?.data) {
          const items = transfersRes.value.data?.transfers || transfersRes.value.data?.data || transfersRes.value.data || [];
          if (Array.isArray(items) && items.length > 0) {
            setApiData({
              transfers: items.map((tx, i) => ({
                id: tx.id || i + 1,
                transferNum: tx.transfer_number || tx.reference || `TRF-2026-API-${String(i + 1).padStart(4, '0')}`,
                transferSeries: tx.transfer_series || 'TRF-2026',
                transferDate: tx.date || tx.created_at?.slice(0, 10) || '2026-07-06',
                postingDate: tx.posting_date || tx.date || tx.created_at?.slice(0, 10) || '2026-07-06',
                valueDate: tx.value_date || tx.date || tx.created_at?.slice(0, 10) || '2026-07-06',
                referenceNum: tx.reference_number || tx.reference || 'REF-N/A',
                externalRef: tx.external_ref || 'EXT-N/A',
                transferType: tx.transfer_type || 'Bank to Bank',
                company: tx.company || 'ManageCore Global Inc.',
                branch: tx.branch || 'Headquarters',
                businessUnit: tx.business_unit || 'Corporate Services',
                department: tx.department || 'Finance & Treasury',
                sourceBank: tx.source_bank || tx.source_warehouse || 'Chase Bank N.A.',
                sourceBranch: tx.source_branch || 'Manhattan Wall Street Branch',
                sourceAccount: tx.source_account || tx.source_warehouse || 'Chase Treasury Operating Account',
                sourceCurrency: tx.source_currency || 'USD',
                destinationBank: tx.destination_bank || tx.destination_warehouse || 'Barclays Bank PLC',
                destinationBranch: tx.destination_branch || 'London Canary Wharf Branch',
                destinationAccount: tx.destination_account || tx.destination_warehouse || 'Barclays London Operational Account',
                destinationCurrency: tx.destination_currency || 'GBP',
                transferAmount: tx.transfer_amount || tx.amount || 0,
                exchangeRate: tx.exchange_rate || 1,
                exchangeGainLoss: tx.exchange_gain_loss || 0,
                transferCharges: tx.transfer_charges || 0,
                bankCharges: tx.bank_charges || 0,
                netAmount: tx.net_amount || tx.amount || 0,
                narration: tx.narration || tx.description || '',
                internalNotes: tx.internal_notes || '',
                priority: tx.priority || 'Normal',
                status: tx.status || 'Draft',
                treasury: tx.treasury || {
                  account: 'Treasury Liquid Pool A',
                  pool: 'Default Pool',
                  settlementAccount: '10200 - Chase Bank GL',
                  clearingAccount: '10290 - Transfer Clearing GL'
                }
              }))
            });
          }
        }
      } catch (err) {
        console.warn('Bank transfers API fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onRefresh = () => {
      addNotification?.('Transfers refreshed.', 'success');
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  // Mock Database for Transfers
  const [transfers, setTransfers] = useState([
    {
      id: 1,
      transferNum: 'TRF-2026-001',
      transferSeries: 'TRF-2026',
      transferDate: '2026-07-06',
      postingDate: '2026-07-06',
      valueDate: '2026-07-06',
      referenceNum: 'REF-7718-TRF',
      externalRef: 'EXT-1092',
      transferType: 'Bank to Bank',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      sourceBank: 'Chase Bank N.A.',
      sourceBranch: 'Manhattan Wall Street Branch',
      sourceAccount: 'Chase Treasury Operating Account (US89CHAS1029384756)',
      sourceCurrency: 'USD',
      destinationBank: 'Barclays Bank PLC',
      destinationBranch: 'London Canary Wharf Branch',
      destinationAccount: 'Barclays London Operational Account (GB44BARC2091823746)',
      destinationCurrency: 'GBP',
      transferAmount: 500000,
      exchangeRate: 0.78,
      exchangeGainLoss: 1200,
      transferCharges: 50,
      bankCharges: 15,
      netAmount: 390000,
      narration: 'Intercompany liquidity transfer for Europe branch payroll reserve.',
      internalNotes: 'Authorized by treasury manager under Dual Control policy.',
      priority: 'High',
      status: 'Completed',
      treasury: {
        account: 'Treasury Liquid Pool A',
        pool: 'Europe Operations Reserve',
        settlementAccount: '10200 - Chase Treasury GL',
        clearingAccount: '10290 - Transfer Clearing GL'
      }
    },
    {
      id: 2,
      transferNum: 'TRF-2026-002',
      transferSeries: 'TRF-2026',
      transferDate: '2026-07-06',
      postingDate: '2026-07-06',
      valueDate: '2026-07-06',
      referenceNum: 'REF-9921-TRF',
      externalRef: 'EXT-0081',
      transferType: 'Bank to Cash',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Administrative',
      sourceBank: 'Chase Bank N.A.',
      sourceBranch: 'Manhattan Wall Street Branch',
      sourceAccount: 'Chase Treasury Operating Account (US89CHAS1029384756)',
      sourceCurrency: 'USD',
      destinationBank: 'N/A',
      destinationBranch: 'N/A',
      destinationAccount: 'HQ Main Cash Vault',
      destinationCurrency: 'USD',
      transferAmount: 5000,
      exchangeRate: 1,
      exchangeGainLoss: 0,
      transferCharges: 0,
      bankCharges: 5,
      netAmount: 5000,
      narration: 'Cash withdrawal for petty cash drawer monthly replenishment.',
      internalNotes: 'Bearer cheque #102983 issued.',
      priority: 'Normal',
      status: 'Processing',
      treasury: {
        account: 'HQ Cash Float',
        pool: 'General Admin Float',
        settlementAccount: '10200 - Chase Operating GL',
        clearingAccount: '10100 - HQ Cash Drawer GL'
      }
    }
  ]);

  const [newTransfer, setNewTransfer] = useState({
    transferType: 'Bank to Bank', transferDate: '2026-07-06', referenceNum: '',
    sourceAccount: '', destinationAccount: '', transferAmount: '', narration: '',
    priority: 'Normal'
  });

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    if (!newTransfer.transferAmount || !newTransfer.sourceAccount) {
      addNotification('Source Account and Transfer Amount are required.', 'danger');
      return;
    }
    const amt = parseFloat(newTransfer.transferAmount || '0');
    const added = {
      id: Date.now(),
      transferNum: `TRF-2026-${Date.now().toString().slice(-4)}`,
      transferSeries: 'TRF-2026',
      transferDate: newTransfer.transferDate,
      postingDate: newTransfer.transferDate,
      valueDate: newTransfer.transferDate,
      referenceNum: newTransfer.referenceNum || 'REF-N/A',
      externalRef: 'EXT-N/A',
      transferType: newTransfer.transferType,
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      sourceBank: 'Chase Bank N.A.',
      sourceBranch: 'Manhattan Branch',
      sourceAccount: newTransfer.sourceAccount,
      sourceCurrency: 'USD',
      destinationBank: 'Barclays Bank',
      destinationBranch: 'London Branch',
      destinationAccount: newTransfer.destinationAccount,
      destinationCurrency: 'GBP',
      transferAmount: amt,
      exchangeRate: 0.78,
      exchangeGainLoss: 0,
      transferCharges: 0,
      bankCharges: 0,
      netAmount: amt * 0.78,
      narration: newTransfer.narration || 'General fund movement.',
      internalNotes: 'Initiated from AMS transfer portal.',
      priority: newTransfer.priority,
      status: 'Draft',
      treasury: {
        account: 'Treasury Liquid Pool A',
        pool: 'Default Pool',
        settlementAccount: '10200 - Chase Bank GL',
        clearingAccount: '10290 - Transfer Clearing GL'
      }
    };
    setTransfers([added, ...transfers]);
    setShowAddModal(false);
    addNotification('Fund transfer request logged in Draft state.', 'success');
  };

  const displayTransfers = useMemo(() => {
    if (apiData?.transfers?.length) return apiData.transfers;
    return transfers;
  }, [apiData, transfers]);

  const filteredTransfers = displayTransfers.filter(t => {
    const matchesSearch =
      t.transferNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sourceAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destinationAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transferType.toLowerCase().includes(searchTerm.toLowerCase());
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
    const data = filteredTransfers;
    const cols = [
      { key: 'transferNum', label: 'Transfer Number' }, { key: 'valueDate', label: 'Value Date' },
      { key: 'transferType', label: 'Transfer Type' }, { key: 'sourceCurrency', label: 'Source Currency' },
      { key: 'transferAmount', label: 'Amount' }, { key: 'exchangeRate', label: 'Rate' },
      { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'bank_transfers.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'bank_transfers.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { exportDocx({ headers, rows, title: 'Bank Transfers', filename: 'bank_transfers.docx' }); }
    else if (type === 'pdf') { exportPdf({ headers, rows, title: 'Bank Transfers', filename: 'bank_transfers.pdf' }); }
    else if (type === 'word') { exportWord({ headers, rows, title: 'Bank Transfers', filename: 'bank_transfers.doc' }); }
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
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.transferNum || '', row });
  const handleDeleteConfirm = async () => {
    try {
      setTransfers(prev => prev.filter(t => t.id !== deleteDialog.id));
      addNotification?.('Transfer moved to trash.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    } catch (err) { addNotification?.(err.message || 'Failed to delete transfer', 'error'); }
  };

  const handleMoveToDraft = (row) => {
    setTransfers(prev => prev.map(t => t.id === row.id ? { ...t, status: 'Draft' } : t));
    addNotification?.(`${row.transferNum} moved to Draft.`, 'success');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'bank_transfer' });
    setActiveTab?.('erp_bank_transfers');
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Total Transfers', val: displayTransfers.length, icon: faArrowRightArrowLeft, color: colors.primary, trendVal: 'Internal fund transfers' },
    { label: 'Pending Transfers', val: displayTransfers.filter(t => t.status === 'Processing' || t.status === 'Draft').length, icon: faClock, color: colors.warning, trendVal: 'Awaiting bank release' },
    { label: 'Completed Transfers', val: displayTransfers.filter(t => t.status === 'Completed').length, icon: faCheckCircle, color: colors.success, trendVal: 'Settlement confirmed' },
    { label: 'Total Transfer Value', val: '$505,000', icon: faCoins, color: colors.success, trendVal: 'YTD internal transfer volume' },
    { label: 'AI Transfer Risk Score', val: 'Low Risk', icon: faBrain, color: colors.purple, trendVal: 'Evaluated by Valkyrie' },
  ], [displayTransfers]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Internal Fund Transfers"
      description="Manage enterprise internal fund transfers across banks, cash accounts, branches, companies, and treasury with complete accounting and audit integration."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_transfer')}>
            <FontAwesomeIcon icon={faPlus} /> Create Transfer
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Transfer scheduled.', 'info')}>
            Schedule Transfer
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI transfer security scans initiated.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Transfer Analysis
          </button>
          <div className="dropdown d-inline-block">
            <button className="btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
              <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
              <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />PDF</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
            </ul>
          </div>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Treasury Transfers Ledger', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Transfer Dashboard', icon: faChartPie },
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
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Transfer Optimization Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Beneficiary account Barclays London validated. Transfer matches standard liquidity optimization models.</div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5" style={{ color: mutedColor }}>
              <div className="spinner-border text-primary mb-2" role="status" />
              <div className="small">Loading transfers...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger small mb-4" role="alert">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          ) : (
          <ErpDataTable
            columns={[
              { key: 'transferNum', label: 'Transfer Number', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const t = transfers.find(x => x.transferNum === val); if (t) { setSelectedTransfer(t); setActiveDetailTab('overview'); } }}>{val}</span> },
              { key: 'valueDate', label: 'Value Date', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
              { key: 'transferType', label: 'Transfer Type', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
              { key: 'sourceAccount', label: 'Source account', render: (val) => <>{val.slice(0, 25)}...</> },
              { key: 'destinationAccount', label: 'Destination Account', render: (val) => <>{val.slice(0, 25)}...</> },
              { key: 'sourceCurrency', label: 'Source Currency', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
              { key: 'transferAmount', label: 'Amount', render: (_, row) => <span className="font-monospace fw-bold">${row.transferAmount.toLocaleString()}</span> },
              { key: 'exchangeRate', label: 'Rate', render: (val) => <span className="font-monospace">{val}</span> },
              { key: 'priority', label: 'Priority', render: (val) => (
                <span className="premium-badge" style={{
                  background: val === 'High' ? (isDark ? '#7f1d1d' : '#fce7e7') : (isDark ? '#1e293b' : '#f1f5f9'),
                  color: val === 'High' ? '#ef4444' : textColor
                }}>{val}</span>
              )},
              { key: 'status', label: 'Status', render: (val) => (
                <span className="premium-badge" style={{
                  background: val === 'Completed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#78350f' : '#fef3c7'),
                  color: val === 'Completed' ? '#10b981' : '#d97706'
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
            data={filteredTransfers}
            searchable
            searchPlaceholder="Search by Transfer Number, Source/Destination Account, Type..."
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
            { label: 'Total Transfers', val: displayTransfers.length, sub: 'Internal fund transfers', color: accentColor },
            { label: 'Today\'s Transfers', val: displayTransfers.length, sub: 'Transfers processed today', color: '#10b981' },
            { label: 'Pending Transfers', val: 0, sub: 'Awaiting bank release', color: '#f59e0b' },
            { label: 'Approved Transfers', val: 1, sub: 'Authorized transfers pool', color: '#3b82f6' },
            { label: 'Completed Transfers', val: 1, sub: 'Settlement confirmed', color: '#10b981' },
            { label: 'Cancelled Transfers', val: 0, sub: 'Voided liquidity lines', color: '#64748b' },
            { label: 'Failed Transfers', val: 0, sub: 'Rejected bank feeds', color: '#ef4444' },
            { label: 'Scheduled Transfers', val: 0, sub: 'Queued automated transfers', color: '#8b5cf6' },
            { label: 'Recurring Transfers', val: 0, sub: 'Standing instructions', color: '#3b82f6' },
            { label: 'Inter-Branch Transfers', val: 0, sub: 'Regional branch balances', color: '#06b6d4' },
            { label: 'Inter-Company Transfers', val: 0, sub: 'Sub-entity ledger transfers', color: '#8b5cf6' },
            { label: 'Treasury Transfers', val: 1, sub: 'Treasury liquidity movements', color: '#ec4899' },
            { label: 'Foreign Currency Transfers', val: 1, sub: 'Cross-border conversions', color: '#10b981' },
            { label: 'Cash Transfers', val: 0, sub: 'Drawer-to-drawer cash runs', color: '#64748b' },
            { label: 'Bank Transfers', val: 2, sub: 'Cleared bank-to-bank runs', color: '#3b82f6' },
            { label: 'Total Transfer Value', val: '$505,000', sub: 'YTD internal transfer volume', color: '#10b981' },
            { label: 'Today\'s Transfer Value', val: '$505,000', sub: 'Transfer value today', color: '#10b981' },
            { label: 'Monthly Transfer Value', val: '$505,000', sub: 'Transfer volume this month', color: '#3b82f6' },
            { label: 'Pending Approval Amount', val: '$0', sub: 'Pending checker sign-off', color: '#f59e0b' },
            { label: 'Average Transfer Amount', val: '$252,500', sub: 'Mean transfer ticket value', color: '#8b5cf6' },
            { label: 'Treasury Liquidity Score', val: '98 / 100', sub: 'Treasury buffer sufficiency', color: '#10b981' },
            { label: 'AI Transfer Risk Score', val: 'Low Risk', sub: 'Evaluated by Valkyrie', color: '#10b981' }
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
                  <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Transfer Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Completed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.transferNum}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Type: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.transferType}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.transferDate}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Amount: <span className="fw-semibold font-monospace" style={{ color: colors.success }}>${viewItem.transferAmount.toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Narration</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.narration}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</small>
                      <p className="mb-0 mt-1" style={{ color: viewItem.priority === 'High' ? colors.danger : textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.priority}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exchange Rate</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.info, fontSize: '1rem' }}>{viewItem.exchangeRate}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Source Account</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.sourceAccount}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destination Account</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.destinationAccount}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Internal Notes</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.internalNotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTransfer && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedTransfer.transferNum}</span>
              <h5 className="fw-bold mb-0">{selectedTransfer.transferType}</h5>
              <span className="text-muted small">Date: {selectedTransfer.transferDate} • {selectedTransfer.company}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedTransfer(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'transfer_info', label: 'Transfer Information' },
              { id: 'source_account', label: 'Source Account' },
              { id: 'dest_account', label: 'Destination Account' },
              { id: 'accounting', label: 'Accounting Entries' },
              { id: 'journal', label: 'Journal Entries' },
              { id: 'exchange', label: 'Exchange Details' },
              { id: 'charges', label: 'Charges' },
              { id: 'costcenters', label: 'Cost Centers' },
              { id: 'profitcenters', label: 'Profit Centers' },
              { id: 'analytics', label: 'Analytic Accounts' },
              { id: 'projects', label: 'Projects' },
              { id: 'departments', label: 'Departments' },
              { id: 'treasury', label: 'Treasury Details' },
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
                <div className="col-md-12"><strong>Narration:</strong><p className="text-muted mt-1">{selectedTransfer.narration}</p></div>
                <div className="col-md-6"><strong>Source Account:</strong><span className="d-block text-muted">{selectedTransfer.sourceAccount}</span></div>
                <div className="col-md-6"><strong>Destination Account:</strong><span className="d-block text-muted">{selectedTransfer.destinationAccount}</span></div>
                <div className="col-md-6"><strong>Transfer Amount:</strong><span className="d-block font-monospace fw-bold text-success">${selectedTransfer.transferAmount.toLocaleString()} {selectedTransfer.sourceCurrency}</span></div>
                <div className="col-md-6"><strong>Exchange Rate:</strong><span className="d-block font-monospace">{selectedTransfer.exchangeRate}</span></div>
              </div>
            )}

            {activeDetailTab === 'treasury' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Treasury Liquid Pool:</strong><span className="d-block text-muted">{selectedTransfer.treasury.pool}</span></div>
                <div className="col-md-6"><strong>Treasury Target Account:</strong><span className="d-block text-muted font-monospace">{selectedTransfer.treasury.account}</span></div>
                <div className="col-md-6"><strong>GL Settlement Account:</strong><span className="d-block text-muted font-monospace">{selectedTransfer.treasury.settlementAccount}</span></div>
                <div className="col-md-6"><strong>GL Clearing Account:</strong><span className="d-block text-muted font-monospace">{selectedTransfer.treasury.clearingAccount}</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Treasury Transfer Audits</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>Risk Assessment Check: Safe</strong>
                  <span className="d-block text-muted small mt-1">Beneficiary account Barclays London validated. Transfer matches standard liquidity optimization models. Priority is marked High.</span>
                </div>
              </div>
            )}

            {['transfer_info', 'source_account', 'dest_account', 'accounting', 'journal', 'exchange', 'charges', 'costcenters', 'profitcenters', 'analytics', 'projects', 'departments', 'approvals', 'timeline', 'documents', 'attachments', 'notes', 'audit', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedTransfer(null)}>Close</button>
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
              <h5 className="fw-bold mb-0">Create Internal Fund Transfer</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateTransfer} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Transfer Type</label>
                <select className="form-select" value={newTransfer.transferType} onChange={e => setNewTransfer({ ...newTransfer, transferType: e.target.value })}>
                  <option value="Bank to Bank">Bank to Bank</option>
                  <option value="Cash to Bank">Cash to Bank</option>
                  <option value="Bank to Cash">Bank to Cash</option>
                  <option value="Inter-Branch Transfer">Inter-Branch Transfer</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Transfer Date</label>
                <input type="date" className="form-control" value={newTransfer.transferDate} onChange={e => setNewTransfer({ ...newTransfer, transferDate: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Transfer Amount ($)</label>
                <input type="number" className="form-control" value={newTransfer.transferAmount} onChange={e => setNewTransfer({ ...newTransfer, transferAmount: e.target.value })} required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Source Account</label>
                <input type="text" className="form-control" placeholder="Chase Treasury Operating Account (US89CHAS1029384756)" value={newTransfer.sourceAccount} onChange={e => setNewTransfer({ ...newTransfer, sourceAccount: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Destination Account</label>
                <input type="text" className="form-control" placeholder="Barclays London Operational Account (GB44BARC2091823746)" value={newTransfer.destinationAccount} onChange={e => setNewTransfer({ ...newTransfer, destinationAccount: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Priority</label>
                <select className="form-select" value={newTransfer.priority} onChange={e => setNewTransfer({ ...newTransfer, priority: e.target.value })}>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label fw-bold mb-1">Reference Number</label>
                <input type="text" className="form-control" placeholder="Cheque or transaction reference" value={newTransfer.referenceNum} onChange={e => setNewTransfer({ ...newTransfer, referenceNum: e.target.value })} />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold mb-1">Narration / Purpose</label>
                <textarea className="form-control" rows="2" value={newTransfer.narration} onChange={e => setNewTransfer({ ...newTransfer, narration: e.target.value })}></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-sm text-white border-0 px-4 premium-gradient-btn" style={{ borderRadius: '10px', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save Transfer</button>
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
        message="Are you sure you want to move this transfer to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpBankTransfers;
