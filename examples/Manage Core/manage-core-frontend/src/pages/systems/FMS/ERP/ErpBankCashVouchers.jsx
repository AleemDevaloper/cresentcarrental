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
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf, faFileWord, faFileAlt,
  faRotateLeft, faSync, faSquareCheck, faBrain, faEdit, faFileSignature, faEnvelope, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { listPayments } from '../../../../api/ams';

const ErpBankCashVouchers = () => {
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
  const [selectedVoucher, setSelectedVoucher] = useState(null);
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
          listPayments({ page: 1, limit: 200 }),
        ]);
        const [paymentsRes] = results;
        if (paymentsRes.status === 'fulfilled' && paymentsRes.value?.data) {
          const items = paymentsRes.value.data?.transactions || paymentsRes.value.data?.data || paymentsRes.value.data || [];
          if (Array.isArray(items) && items.length > 0) {
            setApiData({
              vouchers: items.map((tx, i) => ({
                id: tx.id || i + 1,
                voucherNum: tx.voucher_number || tx.reference || `VOU-2026-API-${String(i + 1).padStart(3, '0')}`,
                voucherSeries: tx.voucher_series || 'BRV-2026',
                voucherDate: tx.date || tx.created_at?.slice(0, 10) || '2026-07-06',
                postingDate: tx.posting_date || tx.date || tx.created_at?.slice(0, 10) || '2026-07-06',
                referenceNum: tx.reference_number || tx.reference || 'REF-N/A',
                externalRef: tx.external_ref || 'EXT-N/A',
                company: tx.company || 'ManageCore Global Inc.',
                branch: tx.branch || 'Headquarters',
                businessUnit: tx.business_unit || 'Corporate Services',
                department: tx.department || 'Finance & Treasury',
                voucherType: tx.voucher_type || 'Bank Receipt Voucher (BRV)',
                transactionType: tx.transaction_type || tx.type || 'Receipt',
                paymentMethod: tx.payment_method || 'Online Banking',
                bankAccount: tx.bank_account || 'N/A',
                cashAccount: tx.cash_account || 'N/A',
                currency: tx.currency || 'USD',
                exchangeRate: tx.exchange_rate || 1,
                amount: tx.amount || 0,
                taxAmount: tx.tax_amount || 0,
                discount: tx.discount || 0,
                charges: tx.charges || 0,
                netAmount: tx.net_amount || tx.amount || 0,
                narration: tx.narration || tx.description || '',
                internalNotes: tx.internal_notes || '',
                status: tx.status || 'Posted',
                cheque: tx.cheque || { number: 'N/A', date: 'N/A', bank: 'N/A', branch: 'N/A', status: 'N/A' },
                referenceInfo: tx.reference_info || { customer: 'N/A', vendor: 'N/A', employee: 'N/A', project: 'N/A' },
                accounts: tx.accounts || { debitAccount: '10200 - Chase Bank Account', creditAccount: '12100 - Accounts Receivable', taxAccount: 'N/A', chargesAccount: 'N/A' }
              }))
            });
          }
        }
      } catch (err) {
        console.warn('Bank vouchers API fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onRefresh = () => {
      addNotification?.('Vouchers refreshed.', 'success');
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  // Mock Database for Vouchers
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      voucherNum: 'VOU-2026-BRV-001',
      voucherSeries: 'BRV-2026',
      voucherDate: '2026-07-06',
      postingDate: '2026-07-06',
      referenceNum: 'REF-88192-BRV',
      externalRef: 'EXT-9921',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      voucherType: 'Bank Receipt Voucher (BRV)',
      transactionType: 'Receipt',
      paymentMethod: 'Online Banking',
      bankAccount: 'Chase Treasury Operating Account (US89CHAS1029384756)',
      cashAccount: 'N/A',
      currency: 'USD',
      exchangeRate: 1,
      amount: 150000,
      taxAmount: 0,
      discount: 0,
      charges: 25,
      netAmount: 149975,
      narration: 'Quarterly client payment clearance from Silicon Valley Sourcing.',
      internalNotes: 'Payment verified via automated Chase EBS API feed.',
      status: 'Posted',
      cheque: {
        number: 'N/A (Online transfer)',
        date: 'N/A',
        bank: 'Silicon Valley Sourcing Bank',
        branch: 'San Jose Branch',
        status: 'Cleared'
      },
      referenceInfo: {
        customer: 'Silicon Valley Sourcing Inc.',
        vendor: 'N/A',
        employee: 'N/A',
        project: 'Valkyrie AI Platform',
        salesInvoice: 'INV-2026-0045'
      },
      accounts: {
        debitAccount: '10200 - Chase Bank Account',
        creditAccount: '12100 - Accounts Receivable',
        taxAccount: 'N/A',
        chargesAccount: '90200 - Bank Service Charge'
      }
    },
    {
      id: 2,
      voucherNum: 'VOU-2026-CPV-001',
      voucherSeries: 'CPV-2026',
      voucherDate: '2026-07-06',
      postingDate: '2026-07-06',
      referenceNum: 'REF-2918-CPV',
      externalRef: 'EXT-1022',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Administrative',
      voucherType: 'Cash Payment Voucher (CPV)',
      transactionType: 'Payment',
      paymentMethod: 'Cash',
      bankAccount: 'N/A',
      cashAccount: 'HQ Main Cash Vault',
      currency: 'USD',
      exchangeRate: 1,
      amount: 450,
      taxAmount: 0,
      discount: 0,
      charges: 0,
      netAmount: 450,
      narration: 'Office emergency replenishment supplies from local market.',
      internalNotes: 'Petty cash receipt scanned and attached.',
      status: 'Approved',
      cheque: {
        number: 'N/A (Cash)',
        date: 'N/A',
        bank: 'N/A',
        branch: 'N/A',
        status: 'N/A'
      },
      referenceInfo: {
        customer: 'N/A',
        vendor: 'Local Staples Supplier',
        employee: 'David Miller',
        project: 'N/A',
        expenseClaim: 'EXP-CLAIM-2026-0082'
      },
      accounts: {
        debitAccount: '60100 - General Office Expense',
        creditAccount: '10100 - HQ Physical Cash',
        taxAccount: 'N/A',
        chargesAccount: 'N/A'
      }
    }
  ]);

  const [newVoucher, setNewVoucher] = useState({
    voucherSeries: 'BRV-2026', voucherDate: '2026-07-06', referenceNum: '', externalRef: '',
    voucherType: 'Bank Receipt Voucher (BRV)', paymentMethod: 'Online Banking', bankAccount: '',
    cashAccount: '', currency: 'USD', amount: '', narration: '', customer: '', vendor: '',
    debitAccount: '', creditAccount: ''
  });

  const handleCreateVoucher = (e) => {
    e.preventDefault();
    if (!newVoucher.amount || !newVoucher.voucherSeries) {
      addNotification('Voucher Series and Amount are required.', 'danger');
      return;
    }
    const amt = parseFloat(newVoucher.amount || '0');
    const added = {
      id: Date.now(),
      voucherNum: `VOU-2026-${newVoucher.voucherSeries}-${Date.now().toString().slice(-4)}`,
      voucherSeries: newVoucher.voucherSeries,
      voucherDate: newVoucher.voucherDate,
      postingDate: newVoucher.voucherDate,
      referenceNum: newVoucher.referenceNum || 'REF-N/A',
      externalRef: newVoucher.externalRef || 'EXT-N/A',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      voucherType: newVoucher.voucherType,
      transactionType: newVoucher.voucherType.includes('Receipt') ? 'Receipt' : 'Payment',
      paymentMethod: newVoucher.paymentMethod,
      bankAccount: newVoucher.bankAccount || 'N/A',
      cashAccount: newVoucher.cashAccount || 'N/A',
      currency: newVoucher.currency,
      exchangeRate: 1,
      amount: amt,
      taxAmount: 0,
      discount: 0,
      charges: 0,
      netAmount: amt,
      narration: newVoucher.narration || 'General voucher entry.',
      internalNotes: 'Created via AMS voucher console.',
      status: 'Draft',
      cheque: {
        number: 'N/A',
        date: 'N/A',
        bank: 'N/A',
        branch: 'N/A',
        status: 'N/A'
      },
      referenceInfo: {
        customer: newVoucher.customer || 'N/A',
        vendor: newVoucher.vendor || 'N/A',
        employee: 'N/A',
        project: 'N/A'
      },
      accounts: {
        debitAccount: newVoucher.debitAccount || '10100 - Cash Ledger',
        creditAccount: newVoucher.creditAccount || '40100 - General Sales',
        taxAccount: 'N/A',
        chargesAccount: 'N/A'
      }
    };
    setVouchers([added, ...vouchers]);
    setShowAddModal(false);
    addNotification('Voucher created in Draft state.', 'success');
  };

  const displayVouchers = useMemo(() => {
    if (apiData?.vouchers?.length) return apiData.vouchers;
    return vouchers;
  }, [apiData, vouchers]);

  const filteredVouchers = displayVouchers.filter(v => {
    const matchesSearch =
      v.voucherNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.voucherType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredVouchers;
    const cols = [
      { key: 'voucherNum', label: 'Voucher Number' }, { key: 'voucherDate', label: 'Voucher Date' },
      { key: 'voucherType', label: 'Voucher Type' }, { key: 'currency', label: 'Currency' },
      { key: 'amount', label: 'Base Amount' }, { key: 'charges', label: 'Charges' },
      { key: 'netAmount', label: 'Net Amount' }, { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'bank_cash_vouchers.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'bank_cash_vouchers.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Bank Cash Vouchers', headers, rows, filename: 'bank_cash_vouchers.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Bank Cash Vouchers', headers, rows, filename: 'bank_cash_vouchers.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Bank Cash Vouchers', headers, rows, filename: 'bank_cash_vouchers.doc' }); }
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

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.voucherNum || '', row });
  const handleDeleteConfirm = async () => {
    try {
      setVouchers(prev => prev.filter(v => v.id !== deleteDialog.id));
      addNotification?.('Voucher moved to trash.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    } catch (err) { addNotification?.(err.message || 'Failed to delete voucher', 'error'); }
  };

  const handleMoveToDraft = (row) => {
    setVouchers(prev => prev.map(v => v.id === row.id ? { ...v, status: 'Draft' } : v));
    addNotification?.(`${row.voucherNum} moved to Draft.`, 'success');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'bank_cash_voucher' });
    setActiveTab?.('erp_bank_cash_vouchers');
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Total Vouchers', val: displayVouchers.length, icon: faFileInvoice, color: colors.primary, trendVal: 'Registered journal vouchers' },
    { label: 'Draft Vouchers', val: displayVouchers.filter(v => v.status === 'Draft').length, icon: faFileAlt, color: colors.warning, trendVal: 'Work in progress' },
    { label: 'Approved Vouchers', val: displayVouchers.filter(v => v.status === 'Approved').length, icon: faCheckCircle, color: colors.info, trendVal: 'Awaiting posting run' },
    { label: 'Posted Vouchers', val: displayVouchers.filter(v => v.status === 'Posted').length, icon: faCheckCircle, color: colors.success, trendVal: 'GL balances updated' },
    { label: 'Net Cash Flow', val: '+$149,550', icon: faChartLine, color: colors.success, trendVal: 'Surplus cash flow pool' },
  ], [displayVouchers]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Bank / Cash Vouchers"
      description="Manage enterprise cash receipts, bank receipts, payments, contra entries, adjustments, and financial vouchers with complete accounting and audit integration."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_voucher')}>
            <FontAwesomeIcon icon={faPlus} /> Create Voucher
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Contra entry created.', 'success')}>
            Quick Transfer
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Vouchers bulk approved.', 'success')}>
            Bulk Approve
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI validation scan complete. No abnormalities found.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Validation
          </button>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Vouchers Journal Register', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Voucher Dashboard', icon: faChartPie },
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
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Voucher Compliance Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Transaction risk assessment: Low Risk. GL account configurations validated successfully.</div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5" style={{ color: mutedColor }}>
              <div className="spinner-border text-primary mb-2" role="status" />
              <div className="small">Loading vouchers...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger small mb-4" role="alert">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          ) : (
          <ErpDataTable
            columns={[
              { key: 'voucherNum', label: 'Voucher Number', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const v = vouchers.find(x => x.voucherNum === val); if (v) { setSelectedVoucher(v); setActiveDetailTab('overview'); } }}>{val}</span> },
              { key: 'voucherDate', label: 'Voucher Date', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
              { key: 'voucherType', label: 'Voucher Type', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
              { key: 'referenceParty', label: 'Reference Party', render: (_, row) => <>{row.referenceInfo.customer !== 'N/A' ? row.referenceInfo.customer : row.referenceInfo.vendor}</> },
              { key: 'currency', label: 'Currency', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
              { key: 'amount', label: 'Base Amount', render: (_, row) => <span className="font-monospace">${row.amount.toLocaleString()}</span> },
              { key: 'charges', label: 'Charges', render: (_, row) => <span className="font-monospace">${row.charges.toLocaleString()}</span> },
              { key: 'netAmount', label: 'Net Amount', render: (_, row) => <span className="font-monospace text-success fw-bold">${row.netAmount.toLocaleString()}</span> },
              { key: 'status', label: 'Status', render: (val) => (
                <span className="premium-badge" style={{
                  background: val === 'Posted' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#78350f' : '#fef3c7'),
                  color: val === 'Posted' ? '#10b981' : '#d97706'
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
            data={filteredVouchers}
            searchable
            searchPlaceholder="Search by Voucher Number, Reference Number, Customer/Vendor, Narration..."
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
            { label: 'Total Vouchers', val: displayVouchers.length, sub: 'Registered journal vouchers', color: accentColor },
            { label: 'Today\'s Vouchers', val: displayVouchers.length, sub: 'Vouchers created today', color: '#10b981' },
            { label: 'Draft Vouchers', val: displayVouchers.filter(v => v.status === 'Draft').length, sub: 'Work in progress', color: '#64748b' },
            { label: 'Pending Approval', val: 0, sub: 'Awaiting checker review', color: '#f59e0b' },
            { label: 'Approved Vouchers', val: displayVouchers.filter(v => v.status === 'Approved').length, sub: 'Awaiting posting run', color: '#3b82f6' },
            { label: 'Posted Vouchers', val: displayVouchers.filter(v => v.status === 'Posted').length, sub: 'GL balances updated', color: '#10b981' },
            { label: 'Cancelled Vouchers', val: 0, sub: 'Voided transactions', color: '#64748b' },
            { label: 'Reversed Vouchers', val: 0, sub: 'Offsetting reversal entries', color: '#ef4444' },
            { label: 'Cash Receipts', val: 0, sub: 'Cash inflow tickets', color: '#10b981' },
            { label: 'Cash Payments', val: 1, sub: 'Cash outflow tickets', color: '#ef4444' },
            { label: 'Bank Receipts', val: 1, sub: 'Bank clearing inflow', color: '#10b981' },
            { label: 'Bank Payments', val: 0, sub: 'Bank clearing outflow', color: '#ef4444' },
            { label: 'Contra Vouchers', val: 0, sub: 'Cash-to-bank allocations', color: '#3b82f6' },
            { label: 'Adjustment Vouchers', val: 0, sub: 'Journal corrections', color: '#8b5cf6' },
            { label: 'Journal Linked', val: 1, sub: 'GL entries posted', color: '#06b6d4' },
            { label: 'Recurring Vouchers', val: 0, sub: 'Auto-running templates', color: '#8b5cf6' },
            { label: 'Total Receipt Amount', val: '$150,000', sub: 'YTD Receipts inflow', color: '#10b981' },
            { label: 'Total Payment Amount', val: '$450', sub: 'YTD Payments outflow', color: '#ef4444' },
            { label: 'Net Cash Flow', val: '+$149,550', sub: 'Surplus cash flow pool', color: '#10b981' },
            { label: 'Average Voucher Value', val: '$75,225', sub: 'Standard transaction value', color: '#3b82f6' },
            { label: 'Pending Posting', val: '1 Voucher', sub: 'Awaiting GL batch run', color: '#f59e0b' },
            { label: 'Financial Health Score', val: '98 / 100', sub: 'Standard liquidity target', color: '#10b981' },
            { label: 'AI Transaction Score', val: '99 / 100', sub: 'Fraud anomaly detection', color: '#8b5cf6' }
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
                  <FontAwesomeIcon icon={faFileInvoice} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Voucher Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Posted' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Approved' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Approved' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Approved' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.voucherNum}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Type: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.voucherType}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.voucherDate}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Amount: <span className="fw-semibold font-monospace" style={{ color: colors.success }}>${viewItem.amount.toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Narration</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.narration}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Amount</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.netAmount.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.bankAccount}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.paymentMethod}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reference</small>
                      <p className="mb-0 mt-1 font-monospace" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.referenceNum}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Charges</small>
                      <p className="mb-0 mt-1 font-monospace" style={{ color: colors.danger, fontSize: '0.85rem' }}>${viewItem.charges.toLocaleString()}</p>
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

      {selectedVoucher && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedVoucher.voucherNum}</span>
              <h5 className="fw-bold mb-0">{selectedVoucher.voucherType}</h5>
              <span className="text-muted small">Date: {selectedVoucher.voucherDate} • {selectedVoucher.company}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedVoucher(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'accounting', label: 'Accounting Entries' },
              { id: 'journal', label: 'Journal Entries' },
              { id: 'tax', label: 'Tax Details' },
              { id: 'cheque', label: 'Cheque Details' },
              { id: 'costcenters', label: 'Cost Centers' },
              { id: 'profitcenters', label: 'Profit Centers' },
              { id: 'analytics', label: 'Analytic Accounts' },
              { id: 'projects', label: 'Projects' },
              { id: 'departments', label: 'Departments' },
              { id: 'customer', label: 'Customer Information' },
              { id: 'vendor', label: 'Vendor Details' },
              { id: 'employee', label: 'Employee Logs' },
              { id: 'payroll', label: 'Payroll Mappings' },
              { id: 'assets', label: 'Assets Mapping' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'manufacturing', label: 'Manufacturing' },
              { id: 'treasury', label: 'Treasury' },
              { id: 'documents', label: 'Documents' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'notes', label: 'Notes' },
              { id: 'timeline', label: 'Timeline' },
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
                <div className="col-md-12"><strong>Narration:</strong><p className="text-muted mt-1">{selectedVoucher.narration}</p></div>
                <div className="col-md-6"><strong>Payment Method:</strong><span className="d-block text-muted">{selectedVoucher.paymentMethod}</span></div>
                <div className="col-md-6"><strong>Reference Number:</strong><span className="d-block text-muted font-monospace">{selectedVoucher.referenceNum}</span></div>
                <div className="col-md-6"><strong>Contra Cash Account:</strong><span className="d-block text-muted font-monospace">{selectedVoucher.cashAccount}</span></div>
                <div className="col-md-6"><strong>Contra Bank Account:</strong><span className="d-block text-muted font-monospace">{selectedVoucher.bankAccount}</span></div>
              </div>
            )}

            {activeDetailTab === 'accounting' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>GL Debit Account:</strong><span className="d-block text-muted font-monospace">{selectedVoucher.accounts.debitAccount}</span></div>
                <div className="col-md-6"><strong>GL Credit Account:</strong><span className="d-block text-muted font-monospace">{selectedVoucher.accounts.creditAccount}</span></div>
                <div className="col-md-6"><strong>Gross Base Amount:</strong><span className="d-block font-monospace">${selectedVoucher.amount.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Net Reconciled Amount:</strong><span className="d-block text-success fw-bold font-monospace">${selectedVoucher.netAmount.toLocaleString()}</span></div>
              </div>
            )}

            {activeDetailTab === 'cheque' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Cheque Number:</strong><span className="d-block text-muted font-monospace">{selectedVoucher.cheque.number}</span></div>
                <div className="col-md-6"><strong>Cheque Bank:</strong><span className="d-block text-muted">{selectedVoucher.cheque.bank}</span></div>
                <div className="col-md-6"><strong>Cheque Status:</strong><span className="d-block text-primary fw-bold">{selectedVoucher.cheque.status}</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Voucher Compliance Checks</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>Risk Assessment Score: Low Risk</strong>
                  <span className="d-block text-muted small mt-1">Transaction matches historical billing parameters for Silicon Valley Sourcing. General Ledger account configurations validated successfully.</span>
                </div>
              </div>
            )}

            {['journal', 'tax', 'costcenters', 'profitcenters', 'analytics', 'projects', 'departments', 'customer', 'vendor', 'employee', 'payroll', 'assets', 'inventory', 'manufacturing', 'treasury', 'documents', 'attachments', 'notes', 'timeline', 'audit', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedVoucher(null)}>Close</button>
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
              <h5 className="fw-bold mb-0">Create Cash / Bank Journal Voucher</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateVoucher} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Voucher Series</label>
                <select className="form-select" value={newVoucher.voucherSeries} onChange={e => setNewVoucher({ ...newVoucher, voucherSeries: e.target.value })}>
                  <option value="BRV-2026">BRV (Bank Receipt)</option>
                  <option value="BPV-2026">BPV (Bank Payment)</option>
                  <option value="CRV-2026">CRV (Cash Receipt)</option>
                  <option value="CPV-2026">CPV (Cash Payment)</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Voucher Date</label>
                <input type="date" className="form-control" value={newVoucher.voucherDate} onChange={e => setNewVoucher({ ...newVoucher, voucherDate: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Transaction Amount ($)</label>
                <input type="number" className="form-control" value={newVoucher.amount} onChange={e => setNewVoucher({ ...newVoucher, amount: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Payment Method</label>
                <select className="form-select" value={newVoucher.paymentMethod} onChange={e => setNewVoucher({ ...newVoucher, paymentMethod: e.target.value })}>
                  <option value="Online Banking">Online Banking</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">GL Debit Account</label>
                <input type="text" className="form-control" placeholder="10200 - Chase Bank" value={newVoucher.debitAccount} onChange={e => setNewVoucher({ ...newVoucher, debitAccount: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">GL Credit Account</label>
                <input type="text" className="form-control" placeholder="12100 - Accounts Receivable" value={newVoucher.creditAccount} onChange={e => setNewVoucher({ ...newVoucher, creditAccount: e.target.value })} />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold mb-1">Narration / Particulars</label>
                <textarea className="form-control" rows="2" value={newVoucher.narration} onChange={e => setNewVoucher({ ...newVoucher, narration: e.target.value })}></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-sm text-white border-0 px-4 premium-gradient-btn" style={{ borderRadius: '10px', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save Voucher</button>
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
        message="Are you sure you want to move this voucher to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpBankCashVouchers;
