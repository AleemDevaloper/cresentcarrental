import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faList, faEye,
  faRefresh, faCheckCircle, faBuildingColumns,
  faShieldHalved, faFileInvoice,
  faChartPie, faWallet, faXmark, faInfoCircle,
  faPen, faTrash, faCalendarAlt, faTriangleExclamation,
  faMoneyBill, faGlobe, faClock, faChartLine, faTags,
  faBrain, faFileExport, faFileSignature, faFilePdf,
  faEnvelope, faFileCsv, faFileExcel, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportDocx, exportWord } from '../../../../utils/brandedExport';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import ShareQrButton from '../../../../components/common/ShareQrButton';

const ErpVendorPayments = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const accentColor = '#6366f1';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeSubTab, setActiveSubTab] = useState('register');
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [unpaidBills, setUnpaidBills] = useState([
    { id: 1, billNumber: 'BIL-2026-901', date: '2026-06-15', dueDate: '2026-07-15', outstanding: 45000, allocated: 0 },
    { id: 2, billNumber: 'BIL-2026-902', date: '2026-06-18', dueDate: '2026-07-18', outstanding: 12000, allocated: 0 },
    { id: 3, billNumber: 'BIL-2026-903', date: '2026-06-20', dueDate: '2026-07-20', outstanding: 88000, allocated: 0 },
    { id: 4, billNumber: 'BIL-2026-904', date: '2026-06-25', dueDate: '2026-07-25', outstanding: 15000, allocated: 0 }
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      paymentNumber: 'PAY-2026-0001',
      date: '2026-07-02',
      vendor: 'Global Logistical Solutions Ltd.',
      vendorCode: 'VND-2026-001',
      billNumber: 'BIL-2026-901',
      poNumber: 'PO-2026-90812',
      method: 'Bank Transfer',
      bankAccount: 'HBL Operations A/C',
      currency: 'USD',
      amount: 45000,
      discount: 500,
      taxDeducted: 900,
      status: 'Paid',
      approvedBy: 'Controller Finance',
      createdBy: 'Accountant Senior'
    },
    {
      id: 2,
      paymentNumber: 'PAY-2026-0002',
      date: '2026-07-03',
      vendor: 'Apex Metal Fabrication Inc.',
      vendorCode: 'VND-2026-002',
      billNumber: 'BIL-2026-902',
      poNumber: 'PO-2026-90998',
      method: 'ACH Transfer',
      bankAccount: 'CitiBank Clearing A/C',
      currency: 'USD',
      amount: 12000,
      discount: 200,
      taxDeducted: 240,
      status: 'Pending Approval',
      approvedBy: 'Awaiting Mgr Approval',
      createdBy: 'Accountant Junior'
    },
    {
      id: 3,
      paymentNumber: 'PAY-2026-0003',
      date: '2026-06-28',
      vendor: 'Zeta Consulting Group',
      vendorCode: 'VND-2026-003',
      billNumber: 'BIL-2026-880',
      poNumber: 'PO-2026-8101',
      method: 'Cheque',
      bankAccount: 'HBL Operations A/C',
      currency: 'GBP',
      amount: 8500,
      discount: 0,
      taxDeducted: 170,
      status: 'Approved',
      approvedBy: 'Finance Manager',
      createdBy: 'Accountant Senior'
    },
    {
      id: 4,
      paymentNumber: 'PAY-2026-0004',
      date: '2026-06-25',
      vendor: 'Shenzhen Microchip Source',
      vendorCode: 'VND-2026-004',
      billNumber: 'BIL-2026-871',
      poNumber: 'PO-2026-8092',
      method: 'Wire Transfer',
      bankAccount: 'Standard Chartered Forex A/C',
      currency: 'CNY',
      amount: 32000,
      discount: 800,
      taxDeducted: 0,
      status: 'Paid',
      approvedBy: 'Controller Finance',
      createdBy: 'Accountant Senior'
    }
  ]);

  const [newPayment, setNewPayment] = useState({
    vendor: 'Global Logistical Solutions Ltd.',
    vendorCode: 'VND-2026-001',
    paymentDate: '2026-07-03',
    bankAccount: 'HBL Operations A/C',
    method: 'Bank Transfer',
    chequeNumber: '',
    transactionNumber: '',
    narration: '',
    discount: '0',
    taxDeduction: '0'
  });

  useEffect(() => {
    const onRefresh = () => { setLoading(true); setError(null); setTimeout(() => setLoading(false), 300); };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleCreatePayment = (e) => {
    e.preventDefault();
    const allocatedSum = unpaidBills.reduce((acc, curr) => acc + parseFloat(curr.allocated || 0), 0);
    if (allocatedSum <= 0) {
      addNotification('Please allocate payables before recording payment.', 'danger');
      return;
    }

    const created = {
      id: Date.now(),
      paymentNumber: `PAY-2026-000${payments.length + 1}`,
      date: newPayment.paymentDate,
      vendor: newPayment.vendor,
      vendorCode: newPayment.vendorCode,
      billNumber: unpaidBills.filter(b => b.allocated > 0).map(b => b.billNumber).join(', '),
      poNumber: 'PO-2026-GEN',
      method: newPayment.method,
      bankAccount: newPayment.bankAccount,
      currency: 'USD',
      amount: allocatedSum,
      discount: parseFloat(newPayment.discount || '0'),
      taxDeducted: parseFloat(newPayment.taxDeduction || '0'),
      status: 'Pending Approval',
      approvedBy: 'Awaiting Mgr Approval',
      createdBy: 'Accountant Senior'
    };

    setPayments([created, ...payments]);
    setUnpaidBills(prev => prev.map(b => ({ ...b, allocated: 0 })));
    addNotification('Payment entry created and routed for dual-control authorization.', 'success');
    setActiveSubTab('register');
  };

  const handleApprovePayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved', approvedBy: 'Finance Controller' } : p));
    addNotification('Payment authorized successfully.', 'success');
  };

  const handleReleasePayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    addNotification('Bank transfer processed and payment advice released.', 'success');
  };

  const handleRejectPayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected', approvedBy: 'Rejected by Controller' } : p));
    addNotification('Payment rejected back to accountant draft.', 'warning');
  };

  const handleAutoAllocation = () => {
    setUnpaidBills(prev => prev.map(b => ({ ...b, allocated: b.outstanding })));
    addNotification('All unpaid bills auto-allocated for full payment.', 'info');
  };

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'vendor_payment' });
    setActiveTab?.('erp_vendor_payments');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.paymentNumber || row.code || '' });
  };

  const handleDeleteConfirm = () => {
    setPayments(prev => prev.filter(p => p.id !== deleteDialog.id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
    addNotification('Payment deleted successfully.', 'success');
  };

  const handleMoveToDraft = async (row) => {
    try {
      setPayments(prev => prev.map(p => p.id === row.id ? { ...p, status: 'Draft' } : p));
      addNotification?.('Payment moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredPayments;
    const headers = ['Payment No', 'Date', 'Vendor', 'Bill No', 'Method', 'Account', 'Amount', 'Discount', 'Status'];
    const rows = data.map(item => [
      item.paymentNumber, item.date, item.vendor, item.billNumber,
      item.method, item.bankAccount, String(item.amount), String(item.discount), item.status
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'vendor_payments.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'vendor_payments.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Vendor Payments', headers, rows, filename: 'vendor_payments.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Vendor Payments', headers, rows, filename: 'vendor_payments.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Vendor Payments', headers, rows, filename: 'vendor_payments.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const kpiData = useMemo(() => [
    { label: "Today's Payments", value: 45000, icon: faWallet, color: '#6366f1', trend: 'up', trendVal: '1 closed' },
    { label: 'Pending Payments', value: 20500, icon: faCheckCircle, color: '#f59e0b', trend: 'up', trendVal: '2 in queue' },
    { label: 'Approved Payments', value: 15000, icon: faShieldHalved, color: '#10b981', trend: 'up', trendVal: '1 checked' },
    { label: 'Paid This Month', value: 120500, icon: faBuildingColumns, color: '#3b82f6', trend: 'up', trendVal: '15 settled' },
    { label: 'Scheduled Payments', value: 85000, icon: faCalendarAlt, color: '#8b5cf6', trend: 'up', trendVal: '5 planned' },
    { label: 'Overdue Payments', value: 62000, icon: faTriangleExclamation, color: '#f43f5e', trend: 'down', trendVal: '3 overdue' },
    { label: 'Bank Payments', value: 78000, icon: faBuildingColumns, color: '#06b6d4', trend: 'up', trendVal: '10 cleared' },
    { label: 'Cash Payments', value: 5000, icon: faMoneyBill, color: '#10b981', trend: 'up', trendVal: '2 settled' },
    { label: 'Cheque Payments', value: 22500, icon: faFileInvoice, color: '#f59e0b', trend: 'up', trendVal: '3 released' },
    { label: 'Online Payments', value: 15000, icon: faGlobe, color: '#ec4899', trend: 'up', trendVal: '5 portal' },
    { label: 'Outstanding Payables', value: 345000, icon: faWallet, color: '#f43f5e', trend: 'up', trendVal: 'Liability' },
    { label: 'Average Payment Days', value: 22, icon: faClock, color: '#6366f1', trend: 'up', trendVal: 'Days' },
    { label: 'Cash Flow Impact', value: 100, icon: faChartLine, color: '#10b981', trend: 'up', trendVal: 'Stable' },
    { label: 'Vendor Discounts Captured', value: 4500, icon: faTags, color: '#10b981', trend: 'up', trendVal: 'Captured' },
  ], []);

  const kpiWidgets = useMemo(() => [
    { label: 'Total Payments', val: payments.length, icon: faWallet, color: colors.primary, trend: 'up', trendVal: 'Register entries' },
    { label: 'Paid Amount', val: '$' + payments.filter(p => p.status === 'Paid').reduce((a, c) => a + c.amount, 0).toLocaleString(), icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Settled' },
    { label: 'Pending Approval', val: payments.filter(p => p.status === 'Pending Approval').length, icon: faClock, color: colors.warning, trend: 'up', trendVal: 'Awaiting check' },
    { label: 'Total Disbursed', val: '$' + payments.reduce((a, c) => a + c.amount, 0).toLocaleString(), icon: faBuildingColumns, color: colors.primary, trend: 'up', trendVal: 'Fiscal total' },
  ], [payments]);

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'All' || p.method === methodFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const columns = [
    { key: 'paymentNumber', label: 'Payment No', render: (val, row) => <span className="font-monospace fw-bold" style={{ color: colors.primary, cursor: 'pointer' }} onClick={() => { setViewItem(row); }}>{val}</span> },
    { key: 'date', label: 'Post Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'vendor', label: 'Vendor Entity', render: (val, row) => <><span className="fw-bold d-block" style={{ color: textColor }}>{val}</span><span style={{ color: mutedColor, fontSize: '0.65rem' }}>{row.vendorCode}</span></> },
    { key: 'billNumber', label: 'Matched Bill No', render: (val) => <span style={{ color: mutedColor }}>{val}</span> },
    { key: 'method', label: 'Method', render: (val) => <span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>{val}</span> },
    { key: 'bankAccount', label: 'Disbursement Account', render: (val) => <span style={{ color: mutedColor, fontSize: '0.7rem' }}>{val}</span> },
    { key: 'amount', label: 'Net Amount', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#10b981' }}>${val.toLocaleString()}</span> },
    { key: 'discount', label: 'Discounts', align: 'end', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>${val.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (val) => (
      <span className="premium-badge" style={{
        background: val === 'Paid' ? (isDark ? '#064e3b' : '#dcfce7') : val === 'Pending Approval' ? (isDark ? '#713f12' : '#fef3c7') : val === 'Approved' ? (isDark ? '#1e3a5f' : '#e0f2fe') : val === 'Draft' ? (isDark ? '#1e293b' : '#f1f5f9') : (isDark ? '#7f1d1d' : '#fce7e7'),
        color: val === 'Paid' ? '#10b981' : val === 'Pending Approval' ? '#f59e0b' : val === 'Approved' ? '#3b82f6' : val === 'Draft' ? mutedColor : '#f43f5e'
      }}>{val}</span>
    )},
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEditClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <ShareQrButton entityType="vendor_payment" entityId={row.id} label={`${row.payment_no || row.number || ''} · ${row.vendor || ''}`} isDark={isDark} onNotify={addNotification} />
        <button className="btn btn-sm border-0 premium-btn" title="PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Email" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const filterControls = (
    <div className="d-flex gap-2">
      <select className="form-select form-select-sm" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
        <option value="All">All Methods</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="ACH Transfer">ACH Transfer</option>
        <option value="Cheque">Cheque</option>
        <option value="Wire Transfer">Wire Transfer</option>
      </select>
      <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="All">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="Pending Approval">Pending Approval</option>
        <option value="Approved">Approved</option>
        <option value="Paid">Paid / Settled</option>
        <option value="Rejected">Rejected</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );

  const exportButton = (
    <div className="btn-group">
      <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: 'transparent', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.7rem' }} title="More"><FontAwesomeIcon icon={faFileExport} /></button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm premium-btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ borderRadius: '8px', background: 'transparent', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.7rem' }}></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        </ul>
      </div>
    </div>
  );

  const headerContent = (
    <div className="d-flex justify-content-between align-items-start mb-4" style={{ gap: '1rem' }}>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div className="d-flex align-items-center gap-2 mb-1" style={{ whiteSpace: 'nowrap' }}>
          <div style={{ width: '4px', height: '28px', borderRadius: '3px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #ec4899)', flexShrink: 0 }} />
          <span className="live-dot" style={{ flexShrink: 0 }} />
          <h4 className="fw-bold mb-0 text-truncate" style={{ color: textColor, fontSize: '1.4rem' }}>
            <FontAwesomeIcon icon={faBuildingColumns} className="me-2" style={{ color: '#6366f1' }} />
            Accounts Payable Settlements & Payments
          </h4>
        </div>
        <p className="mb-0 ms-1" style={{ color: mutedColor, fontSize: '0.85rem' }}>
          <FontAwesomeIcon icon={faInfoCircle} className="me-1" style={{ color: '#6366f1', opacity: 0.7, fontSize: '0.75rem' }} />
          Create professional payments, handle cheque releases, manage double-check workflows, match unpaid bills, and generate bank advice sheets.
        </p>
      </div>
      <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
          <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_payment_run')}>
            <FontAwesomeIcon icon={faPlus} /> Create Payment Run
          </button>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Printing payment check register.', 'info')}>
          Print Cheques
        </button>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed from core ledger.', 'success')}>
          <FontAwesomeIcon icon={faRefresh} />
        </button>
      </div>
    </div>
  );

  return (
    <ErpPageShell headerContent={headerContent}>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'register', label: 'Payment Register Logs', icon: faList },
          { id: 'entry', label: 'Payment Entry Maker Form', icon: faPlus },
          { id: 'approvals', label: 'Maker-Checker Approval Console', icon: faCheckCircle },
          { id: 'analytics', label: 'Cash Flow Analytics & Trends', icon: faChartPie }
        ].map(st => (
          <button
            key={st.id}
            className="premium-btn btn btn-sm py-2 px-3 fw-bold"
            style={{
              color: activeSubTab === st.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
              background: activeSubTab === st.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.78rem',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onClick={() => setActiveSubTab(st.id)}
          >
            <FontAwesomeIcon icon={st.icon} className="me-2" />
            {st.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'register' && (
        <>
          <div className="row g-3 mb-4">
            {kpiWidgets.map((k, idx) => (
              <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-3" />
            ))}
          </div>

          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Payment Intelligence</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>2 payments pending approval. Cash flow impact stable. Consider releasing approved payments to optimize vendor relationships.</div>
                </div>
              </div>
            </div>
          </div>

          <ErpDataTable
            columns={columns}
            data={filteredPayments.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)}
            loading={loading}
            error={error}
            searchable
            searchTerm={searchTerm}
            onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            searchPlaceholder="Search by Payment No, Vendor, Bill..."
            filters={filterControls}
            exportButtons={exportButton}
            emptyMessage="No payment entries found."
            emptyIcon={faBuildingColumns}
            isDark={isDark}
            currentPage={currentPage}
            entriesPerPage={entriesPerPage}
            totalEntries={filteredPayments.length}
            onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
          />
        </>
      )}

      {activeSubTab === 'entry' && (
        <form onSubmit={handleCreatePayment} className="row g-4">
          <div className="col-md-7">
            <div className="glass-card p-4 text-start h-100" style={{ borderRadius: '16px' }}>
              <h5 className="fw-bold mb-3 pb-2" style={{ color: textColor, borderBottom: `1px solid ${borderColor}` }}>
                <FontAwesomeIcon icon={faPlus} className="me-2" style={{ color: '#6366f1' }} />
                Payment Maker Record
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Select Supplier Master</label>
                  <select className="form-select" value={newPayment.vendor} onChange={e => {
                      const codeMap = {
                        'Global Logistical Solutions Ltd.': 'VND-2026-001',
                        'Apex Metal Fabrication Inc.': 'VND-2026-002',
                        'Zeta Consulting Group': 'VND-2026-003',
                        'Shenzhen Microchip Source': 'VND-2026-004'
                      };
                      setNewPayment({ ...newPayment, vendor: e.target.value, vendorCode: codeMap[e.target.value] || 'VND-2026-GEN' });
                    }}>
                    <option value="Global Logistical Solutions Ltd.">Global Logistical Solutions Ltd.</option>
                    <option value="Apex Metal Fabrication Inc.">Apex Metal Fabrication Inc.</option>
                    <option value="Zeta Consulting Group">Zeta Consulting Group</option>
                    <option value="Shenzhen Microchip Source">Shenzhen Microchip Source</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Posting Date</label>
                  <input type="date" className="form-control" value={newPayment.paymentDate} onChange={e => setNewPayment({ ...newPayment, paymentDate: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Disbursement Bank A/C</label>
                  <select className="form-select" value={newPayment.bankAccount} onChange={e => setNewPayment({ ...newPayment, bankAccount: e.target.value })}>
                    <option value="HBL Operations A/C">HBL Operations A/C (PKR)</option>
                    <option value="CitiBank Clearing A/C">CitiBank Clearing A/C (USD)</option>
                    <option value="Standard Chartered Forex A/C">Standard Chartered Forex A/C (USD)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Disbursement Method</label>
                  <select className="form-select" value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value })}>
                    <option value="Bank Transfer">Bank Transfer (RTGS/NEFT)</option>
                    <option value="ACH Transfer">ACH Transfer</option>
                    <option value="Cheque">Physical Cheque Run</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Cash">Cash Settlement</option>
                    <option value="Online Banking">Online Banking Link</option>
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="Corporate Card">Corporate Expense Card</option>
                    <option value="Digital Wallet">Digital Corporate Wallet</option>
                    <option value="Custom Gateway">Custom API Gateway</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Transaction Ref / Cheque No</label>
                  <input type="text" className="form-control" placeholder="TXN-90219" value={newPayment.transactionNumber} onChange={e => setNewPayment({ ...newPayment, transactionNumber: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Early Disc. ($)</label>
                  <input type="number" className="form-control" value={newPayment.discount} onChange={e => setNewPayment({ ...newPayment, discount: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Withholding Tax ($)</label>
                  <input type="number" className="form-control" value={newPayment.taxDeduction} onChange={e => setNewPayment({ ...newPayment, taxDeduction: e.target.value })} />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-bold mb-1" style={{ color: textColor, fontSize: '0.75rem' }}>Payment Narration / Audit Memo</label>
                  <textarea className="form-control" rows="3" placeholder="Settle outstanding vendor invoices for project hardware delivery..." value={newPayment.narration} onChange={e => setNewPayment({ ...newPayment, narration: e.target.value })}></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="glass-card p-4 text-start h-100" style={{ borderRadius: '16px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
                <h5 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.95rem' }}>
                  <FontAwesomeIcon icon={faWallet} className="me-2" style={{ color: '#6366f1' }} />
                  Invoice Ledger Allocations
                </h5>
                <button type="button" className="premium-btn btn btn-sm" style={{ borderRadius: '8px', background: `${accentColor}15`, color: accentColor, border: 'none', fontSize: '0.7rem' }} onClick={handleAutoAllocation}>Auto Allocate</button>
              </div>

              <p style={{ color: mutedColor, fontSize: '0.75rem' }} className="mb-3">Select outstanding vendor bills to map and allocate payments against specific invoice balances.</p>

              <div className="d-flex flex-column gap-2 mb-4">
                {unpaidBills.map((b, idx) => (
                  <div key={b.id} className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '0.8rem' }}>{b.billNumber}</span>
                      <span style={{ color: mutedColor, fontSize: '0.65rem' }}>Due: {b.dueDate}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Outstanding</span>
                        <span className="font-monospace fw-bold" style={{ color: textColor }}>${b.outstanding.toLocaleString()}</span>
                      </div>
                      <div style={{ width: '120px' }}>
                        <input
                          type="number"
                          className="form-control text-end font-monospace"
                          placeholder="Allocate $"
                          value={b.allocated === 0 ? '' : b.allocated}
                          onChange={e => {
                            const val = parseFloat(e.target.value || '0');
                            const next = [...unpaidBills];
                            next[idx].allocated = Math.min(val, b.outstanding);
                            setUnpaidBills(next);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.85rem' }}>Total Payment Allocated:</span>
                  <span className="fw-bold font-monospace mb-0" style={{ color: '#10b981', fontSize: '1.3rem' }}>
                    ${unpaidBills.reduce((acc, curr) => acc + parseFloat(curr.allocated || 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="premium-btn btn text-white border-0 fw-bold" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                    Submit to Checker queue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {activeSubTab === 'approvals' && (
        <div className="row g-3">
          <div className="col-md-12 mb-3">
            <div className="glass-card p-3" style={{ borderRadius: '16px' }}>
              <h5 className="fw-bold mb-1" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faShieldHalved} className="me-2" style={{ color: '#6366f1' }} /> Maker-Checker Payment Run Approvals
              </h5>
              <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Dual-control authorization console for CFO, Financial Controllers, and Treasury Managers.</p>
            </div>
          </div>

          {payments.filter(p => p.status === 'Pending Approval' || p.status === 'Approved').map(p => (
            <div key={p.id} className="col-md-6">
              <div className="glass-card premium-card p-3 text-start h-100" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="premium-badge" style={{ background: isDark ? '#713f12' : '#fef3c7', color: '#f59e0b' }}>{p.paymentNumber}</span>
                  <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="font-monospace">{p.date}</span>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}>{p.vendor}</h6>
                <p style={{ color: mutedColor, fontSize: '0.7rem' }} className="mb-3">Matched Bills: {p.billNumber} • Bank: {p.bankAccount}</p>
                <div className="d-flex justify-content-between align-items-center mb-3 pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Net Payment Value</span>
                    <span className="font-monospace fw-bold" style={{ color: '#10b981', fontSize: '1.2rem' }}>${p.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Created By</span>
                    <span className="fw-bold small" style={{ color: textColor }}>{p.createdBy}</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                  {p.status === 'Pending Approval' ? (
                    <div className="d-flex gap-1 w-100">
                      <button className="premium-btn btn btn-sm text-white border-0 fw-bold flex-fill" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.75rem' }} onClick={() => handleApprovePayment(p.id)}>
                        Approve Payment
                      </button>
                      <button className="premium-btn btn btn-sm px-3" style={{ borderRadius: '10px', color: '#f43f5e', border: `1px solid ${borderColor}`, background: 'transparent', fontSize: '0.75rem' }} onClick={() => handleRejectPayment(p.id)}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button className="premium-btn btn btn-sm text-white border-0 fw-bold w-100" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.75rem' }} onClick={() => handleReleasePayment(p.id)}>
                      Release Funds (Sign Bank Advice)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {payments.filter(p => p.status === 'Pending Approval' || p.status === 'Approved').length === 0 && (
            <div className="col-md-12 text-center py-4" style={{ color: mutedColor, fontSize: '0.8rem' }}>No payments are awaiting authorization at this time.</div>
          )}
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="row g-3">
          {kpiData.map((k, idx) => (
            <ErpKpiCard key={idx} {...k} isDark={isDark} colClass="col-md-2 mb-2" />
          ))}

          <div className="col-md-6 mt-4">
            <div className="glass-card p-4 h-100" style={{ borderRadius: '16px' }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>AP Settlement Trend (Disbursed Value)</h6>
              <div className="d-flex flex-column gap-3">
                {[
                  { month: 'May 2026', amt: '$380K', pct: 60, col: accentColor },
                  { month: 'June 2026', amt: '$490K', pct: 85, col: accentColor },
                  { month: 'July 2026 (Forecast)', amt: '$210K', pct: 35, col: '#10b981' }
                ].map((t, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: textColor }}>{t.month}</span>
                      <span className="fw-bold" style={{ color: textColor }}>{t.amt}</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: isDark ? '#1e293b' : '#e2e8f0' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${t.pct}%`, backgroundColor: t.col }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-4">
            <div className="glass-card p-4 h-100 text-start" style={{ borderRadius: '16px' }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Settlement Method Distribution</h6>
              <div className="d-flex flex-column gap-3" style={{ fontSize: '0.8rem' }}>
                {[
                  { name: 'Wire Transfers (RTGS)', share: '65%', col: '#10b981' },
                  { name: 'ACH Clearing', share: '20%', col: '#3b82f6' },
                  { name: 'Paper Cheque Runs', share: '15%', col: '#f59e0b' }
                ].map((m, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: m.col, display: 'inline-block' }}></span>
                      <span style={{ color: textColor }}>{m.name}</span>
                    </div>
                    <span className="fw-bold font-monospace" style={{ color: textColor }}>{m.share}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(6px)'
        }} onClick={() => setViewItem(null)}>
          <div className="glass-card" style={{ borderRadius: '20px', padding: '1.5rem', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: textColor }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faFileInvoice} className="me-2" style={{ color: '#6366f1' }} />
                Payment Voucher: {viewItem.paymentNumber}
              </h5>
              <button className="premium-btn btn btn-sm border-0" style={{ borderRadius: '8px', background: 'transparent', color: mutedColor }} onClick={() => setViewItem(null)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="row g-3 small">
              <div className="col-md-6" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Payee: </span> {viewItem.vendor}<br/>
                <span style={{ color: mutedColor }}>Vendor Code: </span> {viewItem.vendorCode}<br/>
                <span style={{ color: mutedColor }}>Matched Bills: </span> {viewItem.billNumber}
              </div>
              <div className="col-md-6" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Post Date: </span> {viewItem.date}<br/>
                <span style={{ color: mutedColor }}>Method: </span> {viewItem.method}<br/>
                <span style={{ color: mutedColor }}>Account: </span> {viewItem.bankAccount}
              </div>

              <div className="col-12 mt-2">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faWallet} className="me-2" style={{ color: '#6366f1' }} />
                    Payment Summary
                  </h6>
                </div>
                <div className="d-flex flex-column gap-2 p-3">
                  <div className="d-flex justify-content-between">
                    <span style={{ color: mutedColor }}>Gross Amount</span>
                    <span className="font-monospace fw-bold" style={{ color: textColor }}>${viewItem.amount.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: mutedColor }}>Discount Captured</span>
                    <span className="font-monospace" style={{ color: '#10b981' }}>-${viewItem.discount.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: mutedColor }}>Withholding Tax</span>
                    <span className="font-monospace" style={{ color: '#f59e0b' }}>-${viewItem.taxDeducted.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                    <span className="fw-bold" style={{ color: textColor }}>Net Disbursed</span>
                    <span className="font-monospace fw-bold" style={{ color: '#10b981', fontSize: '1.2rem' }}>${(viewItem.amount - viewItem.discount - viewItem.taxDeducted).toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: mutedColor }}>Status</span>
                    <span className="premium-badge" style={{
                      background: viewItem.status === 'Paid' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Pending Approval' ? (isDark ? '#713f12' : '#fef3c7') : viewItem.status === 'Approved' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#7f1d1d' : '#fce7e7'),
                      color: viewItem.status === 'Paid' ? '#10b981' : viewItem.status === 'Pending Approval' ? '#f59e0b' : viewItem.status === 'Approved' ? '#3b82f6' : '#f43f5e'
                    }}>{viewItem.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
              <button type="button" className="premium-btn btn btn-sm border-0 px-3" style={{
                borderRadius: '10px', fontSize: '0.78rem',
                background: isDark ? '#334155' : '#f1f5f9',
                color: textColor,
              }} onClick={() => setViewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this vendor payment to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpVendorPayments;
