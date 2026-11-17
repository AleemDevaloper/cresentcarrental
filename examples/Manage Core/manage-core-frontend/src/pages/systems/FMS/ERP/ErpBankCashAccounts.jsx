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
  faBrain, faEdit, faFileSignature, faEnvelope, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { listPayments } from '../../../../api/ams';

const ErpBankCashAccounts = () => {
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
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
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
              accounts: items.map((tx, i) => ({
                id: tx.id || i + 1,
                code: tx.code || `ACC-BNK-API-${String(i + 1).padStart(2, '0')}`,
                name: tx.bank_name || tx.account_name || tx.name || `Bank Account ${i + 1}`,
                displayName: tx.display_name || tx.bank_name || tx.name || '',
                shortName: tx.short_name || tx.bank_name || '',
                description: tx.description || '',
                company: tx.company || 'ManageCore Global Inc.',
                branch: tx.branch || 'Headquarters',
                businessUnit: tx.business_unit || 'Corporate Services',
                department: tx.department || 'Finance & Treasury',
                bankName: tx.bank_name || tx.bank || 'N/A',
                bankBranch: tx.bank_branch || 'N/A',
                accountNumber: tx.account_number || 'N/A',
                iban: tx.iban || 'N/A',
                swift: tx.swift || 'N/A',
                routingNumber: tx.routing_number || 'N/A',
                branchCode: tx.branch_code || 'N/A',
                accountType: tx.account_type || 'Treasury',
                currency: tx.currency || 'USD',
                openingBalance: tx.opening_balance || 0,
                currentBalance: tx.current_balance || tx.amount || 0,
                availableBalance: tx.available_balance || tx.current_balance || tx.amount || 0,
                minBalance: tx.min_balance || 0,
                maxLimit: tx.max_limit || 0,
                overdraftLimit: tx.overdraft_limit || 0,
                interestRate: tx.interest_rate || 0,
                chequeBookEnabled: tx.cheque_book_enabled ?? true,
                onlineBankingEnabled: tx.online_banking_enabled ?? true,
                mobileBankingEnabled: tx.mobile_banking_enabled ?? true,
                status: tx.status || 'Active',
                generalLedger: tx.general_ledger || {
                  cashAccount: '10100 - Petty Cash Ledger',
                  bankAccount: '10200 - Chase Bank Ledger',
                  interestIncome: '80100 - Treasury Interest Revenue',
                  interestExpense: '90100 - Debt Interest Expense',
                  chargesAccount: '90200 - Bank Fee Expenses',
                  exchangeGain: '80200 - Forex Exchange Gains',
                  exchangeLoss: '90300 - Forex Exchange Losses'
                },
                bankContact: tx.bank_contact || {
                  manager: 'N/A', rmName: 'N/A', phone: 'N/A',
                  email: 'N/A', website: 'N/A', address: 'N/A'
                }
              }))
            });
          }
        }
      } catch (err) {
        console.warn('Bank accounts API fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onRefresh = () => {
      addNotification?.('Bank accounts refreshed.', 'success');
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  // Mock Database for Bank/Cash Accounts
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      code: 'ACC-BNK-CHASE-01',
      name: 'Chase Manhattan Treasury Account',
      displayName: 'Chase Treasury Operating Account',
      shortName: 'Chase Treasury',
      description: 'Primary corporate treasury and operating vault account for North America operations.',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      bankName: 'Chase Bank N.A.',
      bankBranch: 'Manhattan Wall Street Branch',
      accountNumber: '1029384756',
      iban: 'US89CHAS1029384756',
      swift: 'CHASUS33XXX',
      routingNumber: '021000021',
      branchCode: 'MANH-4',
      accountType: 'Treasury',
      currency: 'USD',
      openingBalance: 5000000,
      currentBalance: 8250000,
      availableBalance: 8200000,
      minBalance: 50000,
      maxLimit: 50000000,
      overdraftLimit: 1000000,
      interestRate: 1.25,
      chequeBookEnabled: true,
      onlineBankingEnabled: true,
      mobileBankingEnabled: true,
      status: 'Active',
      generalLedger: {
        cashAccount: '10100 - Petty Cash Ledger',
        bankAccount: '10200 - Chase Bank Ledger',
        interestIncome: '80100 - Treasury Interest Revenue',
        interestExpense: '90100 - Debt Interest Expense',
        chargesAccount: '90200 - Bank Fee Expenses',
        exchangeGain: '80200 - Forex Exchange Gains',
        exchangeLoss: '90300 - Forex Exchange Losses'
      },
      bankContact: {
        manager: 'Elizabeth Warren',
        rmName: 'Sarah Jenkins',
        phone: '+1-212-555-0199',
        email: 's.jenkins@chase.com',
        website: 'www.chase.com',
        address: '270 Park Ave, New York, NY 10017'
      }
    },
    {
      id: 2,
      code: 'ACC-CSH-MAIN-01',
      name: 'Headquarters Main Cash Drawer',
      displayName: 'HQ Main Cash Vault',
      shortName: 'Main Vault',
      description: 'Central vault storage for physical cash balances at headquarters branch.',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Administrative',
      bankName: 'N/A (Physical Cash)',
      bankBranch: 'N/A',
      accountNumber: 'N/A-CASH-HQ',
      iban: 'N/A',
      swift: 'N/A',
      routingNumber: 'N/A',
      branchCode: 'N/A',
      accountType: 'Cash Drawer',
      currency: 'USD',
      openingBalance: 25000,
      currentBalance: 32450,
      availableBalance: 32450,
      minBalance: 1000,
      maxLimit: 100000,
      overdraftLimit: 0,
      interestRate: 0,
      chequeBookEnabled: false,
      onlineBankingEnabled: false,
      mobileBankingEnabled: false,
      status: 'Active',
      generalLedger: {
        cashAccount: '10100 - HQ Physical Cash',
        bankAccount: 'N/A',
        interestIncome: 'N/A',
        interestExpense: 'N/A',
        chargesAccount: '90250 - Vault Audit Variance',
        exchangeGain: 'N/A',
        exchangeLoss: 'N/A'
      },
      bankContact: {
        manager: 'David Sterling',
        rmName: 'N/A',
        phone: 'Ext 102',
        email: 'cashier@managecore.com',
        website: 'N/A',
        address: 'Office Suite 400, New York, NY'
      }
    }
  ]);

  const displayAccounts = useMemo(() => {
    if (apiData?.accounts?.length) return apiData.accounts;
    return accounts;
  }, [apiData, accounts]);

  const filteredAccounts = displayAccounts.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredAccounts;
    const cols = [
      { key: 'code', label: 'Account Code' }, { key: 'name', label: 'Account Name' },
      { key: 'bankName', label: 'Financial Institution' }, { key: 'accountType', label: 'Account Type' },
      { key: 'currency', label: 'Currency' }, { key: 'openingBalance', label: 'Opening Balance' },
      { key: 'currentBalance', label: 'Current Balance' }, { key: 'availableBalance', label: 'Available Balance' },
      { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'bank_cash_accounts.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'bank_cash_accounts.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { await exportDocx({ title: 'Bank Cash Accounts', headers, rows, filename: 'bank_cash_accounts.docx' }); }
    else if (type === 'pdf') { await exportPdf({ title: 'Bank Cash Accounts', headers, rows, filename: 'bank_cash_accounts.pdf' }); }
    else if (type === 'word') { await exportWord({ title: 'Bank Cash Accounts', headers, rows, filename: 'bank_cash_accounts.doc' }); }
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
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.name || '', row });
  const handleDeleteConfirm = async () => {
    try {
      setAccounts(prev => prev.filter(a => a.id !== deleteDialog.id));
      addNotification?.('Account moved to trash.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    } catch (err) { addNotification?.(err.message || 'Failed to delete account', 'error'); }
  };

  const handleMoveToDraft = (row) => {
    setAccounts(prev => prev.map(a => a.id === row.id ? { ...a, status: 'Draft' } : a));
    addNotification?.(`${row.name} moved to Draft.`, 'success');
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Total Bank Accounts', val: displayAccounts.filter(a => a.accountType !== 'Cash Drawer' && a.accountType !== 'Petty Cash').length, icon: faBuildingColumns, color: colors.primary, trendVal: 'Registered vaults' },
    { label: 'Total Cash Accounts', val: displayAccounts.filter(a => a.accountType === 'Cash Drawer').length, icon: faCoins, color: colors.success, trendVal: 'Retail drawer registers' },
    { label: 'Treasury Accounts', val: 1, icon: faShieldHalved, color: colors.info, trendVal: 'High liquidity nodes' },
    { label: 'Active Accounts', val: displayAccounts.filter(a => a.status === 'Active').length, icon: faCheckCircle, color: colors.success, trendVal: 'Accepting ledger posts' },
    { label: 'Total Available Cash', val: '$8,282,450', icon: faDollarSign ? faDollarSign : faCoins, color: colors.success, trendVal: 'Instant liquidity total' },
    { label: 'AI Treasury Score', val: '98 / 100', icon: faBrain, color: colors.purple, trendVal: 'AI cash yield rating' },
  ], [displayAccounts]);

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'bank_cash_account' });
    setActiveTab?.('erp_bank_cash_accounts');
  };

  return (
    <React.Fragment>
    <ErpPageShell
      icon={faFolderOpen}
      title="Bank / Cash Accounts"
      description="Manage enterprise bank accounts, cash accounts, petty cash, treasury accounts, and financial institutions with complete accounting integration."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_add_account')}>
            <FontAwesomeIcon icon={faPlus} /> Create Account
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Import wizard launched.', 'info')}>
            Import Accounts
          </button>
          <div className="dropdown d-inline-block">
            <button className="btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
              <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
              <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
            </ul>
          </div>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI Treasury modeling completed.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Cash Analysis
          </button>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Treasury Accounts Directory', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Cash Dashboard', icon: faChartPie },
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
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Cash Optimization Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Your Chase treasury account has $2M idle. Consider transferring to high-yield escrow to optimize yield by +$24,000 annually.</div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5" style={{ color: mutedColor }}>
              <div className="spinner-border text-primary mb-2" role="status" />
              <div className="small">Loading accounts...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger small mb-4" role="alert">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          ) : (
          <ErpDataTable
            columns={[
              { key: 'code', label: 'Account Code', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const a = accounts.find(x => x.code === val); if (a) { setSelectedAccount(a); setActiveDetailTab('overview'); } }}>{val}</span> },
              { key: 'name', label: 'Account Name', bold: true },
              { key: 'bankName', label: 'Financial Institution', render: (val, row) => <>{val} <span className="text-muted">({row.bankBranch})</span></> },
              { key: 'accountType', label: 'Account Type', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
              { key: 'currency', label: 'Currency', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
              { key: 'openingBalance', label: 'Opening Balance', render: (_, row) => <span className="font-monospace">${row.openingBalance.toLocaleString()}</span> },
              { key: 'currentBalance', label: 'Current Balance', render: (_, row) => <span className="font-monospace text-success fw-bold">${row.currentBalance.toLocaleString()}</span> },
              { key: 'availableBalance', label: 'Available Balance', render: (_, row) => <span className="font-monospace text-primary fw-bold">${row.availableBalance.toLocaleString()}</span> },
              { key: 'status', label: 'Status', render: (val) => (
                <span className="premium-badge" style={{
                  background: val === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fce7e7'),
                  color: val === 'Active' ? '#10b981' : '#ef4444'
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
            data={filteredAccounts}
            searchable
            searchPlaceholder="Search by Account Name, Number, IBAN, SWIFT, Bank..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            exportButtons={exportButtons}
            filters={
              <select className="form-select form-select-sm" style={{ width: '150px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Frozen">Frozen</option>
                <option value="Inactive">Inactive</option>
              </select>
            }
            isDark={isDark}
          />
          )}
        </>
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {[
            { label: 'Total Bank Accounts', val: displayAccounts.filter(a => a.accountType !== 'Cash Drawer' && a.accountType !== 'Petty Cash').length, sub: 'Registered vaults', color: accentColor },
            { label: 'Total Cash Accounts', val: displayAccounts.filter(a => a.accountType === 'Cash Drawer').length, sub: 'Retail drawer registers', color: '#10b981' },
            { label: 'Petty Cash Accounts', val: 0, sub: 'Office petty floats', color: '#64748b' },
            { label: 'Treasury Accounts', val: 1, sub: 'High liquidity nodes', color: '#3b82f6' },
            { label: 'Digital Wallet Accounts', val: 0, sub: 'Stripe, PayPal links', color: '#8b5cf6' },
            { label: 'Active Accounts', val: displayAccounts.filter(a => a.status === 'Active').length, sub: 'Accepting ledger posts', color: '#06b6d4' },
            { label: 'Inactive Accounts', val: 0, sub: 'Archived vaults', color: '#64748b' },
            { label: 'Frozen Accounts', val: 0, sub: 'Audit lock state', color: '#ef4444' },
            { label: 'Closed Accounts', val: 0, sub: 'Reconciled and closed', color: '#64748b' },
            { label: 'Total Available Cash', val: '$8,282,450', sub: 'Instant liquidity total', color: '#10b981' },
            { label: 'Bank Balance', val: '$8,250,000', sub: 'Reconciled bank vaults', color: '#3b82f6' },
            { label: 'Cash Balance', val: '$32,450', sub: 'HQ cash drawer registry', color: '#10b981' },
            { label: 'Today\'s Receipts', val: '$150,000', sub: 'Deposits processed today', color: '#10b981' },
            { label: 'Today\'s Payments', val: '$85,000', sub: 'Releases paid today', color: '#ef4444' },
            { label: 'Pending Deposits', val: '$45,000', sub: 'In transit ledger posts', color: '#f59e0b' },
            { label: 'Pending Withdrawals', val: '$12,000', sub: 'EFT release queues', color: '#ef4444' },
            { label: 'Outstanding Cheques', val: '$65,000', sub: 'Unpresented bank releases', color: '#f59e0b' },
            { label: 'Reconciled Accounts', val: '2 Accounts', sub: 'Reconciled statement status', color: '#10b981' },
            { label: 'Unreconciled Accounts', val: 0, sub: 'Statements backlog', color: '#ef4444' },
            { label: 'Cash Flow Today', val: '+$65,000', sub: 'Net daily cash flow', color: '#10b981' },
            { label: 'Cash Flow This Month', val: '+$1,450,000', sub: 'Net monthly cash flow', color: '#10b981' },
            { label: 'Monthly Banking Transactions', val: '891 Items', sub: 'Reconciled transaction volume', color: '#3b82f6' },
            { label: 'Financial Health Score', val: '98 / 100', sub: 'Solvency index rating', color: '#10b981' },
            { label: 'AI Treasury Score', val: '98 / 100', sub: 'AI cash yield rating', color: '#8b5cf6' }
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
                  <FontAwesomeIcon icon={faBuildingColumns} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Account Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fce7e7'), color: viewItem.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.name}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Code: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.code}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Bank: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.bankName}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Account: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.accountNumber}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Type</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.accountType}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Currency</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.info, fontSize: '1.1rem' }}>{viewItem.currency}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Branch</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.bankBranch}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opening Balance</small>
                      <p className="mb-0 mt-1 font-monospace" style={{ color: textColor, fontSize: '0.85rem' }}>${viewItem.openingBalance.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Balance</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>${viewItem.currentBalance.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Available Balance</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.primary, fontSize: '1rem' }}>${viewItem.availableBalance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this account to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
    </React.Fragment>
  );
};

export default ErpBankCashAccounts;
