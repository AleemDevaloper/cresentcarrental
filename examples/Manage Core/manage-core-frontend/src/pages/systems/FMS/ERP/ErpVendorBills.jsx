import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFileExport, faEye,
  faCheckCircle, faInfoCircle,
  faXmark, faScaleBalanced, faCreditCard, faTriangleExclamation,
  faHistory, faWallet,
  faChartPie, faBolt, faPen, faTrash,
  faFileCsv, faFileExcel, faFilePdf,
  faFileWord, faFileAlt, faEnvelope, faFileSignature, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { getBills, saveBills, addAuditLog, getPOs, getGRNs } from './erpPurchaseStore';
import { listVendors, listProducts, getTabData } from '../../../../api/ams';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';

const ErpVendorBills = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeSubTab, setActiveSubTab] = useState('bills');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [bills, setBills] = useState([]);
  const [availablePOs, setAvailablePOs] = useState([]);
  const [availableGRNs, setAvailableGRNs] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [apiData, setApiData] = useState([]);

  const [newBill, setNewBill] = useState({
    vendor: 'Oscorp Tech',
    poRef: 'None',
    grnRef: 'None',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: 'USD',
    taxMethod: 'Exclusive',
    expenseAccount: '2110 - Accounts Payable',
    items: [{ product: '', qty: 1, unitCost: 100, discount: 0, taxPercent: 5 }],
    isDuplicateWarning: false
  });

  const fetchLocal = () => {
    setLoading(true); setError(null);
    try {
      setBills(getBills());
      setAvailablePOs(getPOs().filter(p => p.status === 'Completed' || p.status === 'Approved' || p.status === 'Partially Received'));
      setAvailableGRNs(getGRNs());
    } catch (err) { setError(err.message || 'Failed to load bills'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const results = await Promise.allSettled([getTabData('vendor_bills'), listVendors(), listProducts()]);
        const apiRecords = results[0].status === 'fulfilled'
          ? Array.isArray(results[0].value?.data) ? results[0].value.data : Array.isArray(results[0].value) ? results[0].value : []
          : [];
        setApiData(apiRecords);
        if (results[0].status === 'rejected') {
          console.warn('API fallback for vendor_bills:', results[0].reason);
        }
      } catch (err) {
        console.warn('API fallback:', err);
      } finally {
        setLoading(false);
      }
      fetchLocal();
    };
    fetchData();
  }, []);

  useEffect(() => { fetchLocal(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchLocal();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const syncData = (updated) => {
    setBills(updated);
    saveBills(updated);
  };

  const mergedBills = useMemo(() => {
    if (apiData.length > 0) {
      const localCodes = new Set(bills.map(b => b.code));
      const merged = [...apiData];
      bills.forEach(b => {
        if (!localCodes.has(b.code)) merged.push(b);
      });
      return merged;
    }
    return bills;
  }, [apiData, bills]);

  const handlePoSelect = (poCode) => {
    if (poCode === 'None') {
      setNewBill({ ...newBill, poRef: 'None', grnRef: 'None', items: [{ product: '', qty: 1, unitCost: 100, discount: 0, taxPercent: 5 }] });
      return;
    }
    const poObj = availablePOs.find(p => p.code === poCode);
    const grnObj = availableGRNs.find(g => g.poRef === poCode);
    if (poObj) {
      setNewBill({
        ...newBill,
        poRef: poCode,
        grnRef: grnObj ? grnObj.code : 'None',
        vendor: poObj.vendor,
        currency: poObj.currency,
        items: poObj.items.map(i => ({
          product: i.product,
          qty: i.qty,
          unitCost: i.unitPrice,
          discount: i.discount || 0,
          taxPercent: i.taxPercent || 5
        }))
      });
    }
  };

  const checkDuplicateInvoice = (invNo) => {
    const isDup = bills.some(b => b.invoiceNo.toLowerCase() === invNo.toLowerCase() && b.vendor.toLowerCase() === newBill.vendor.toLowerCase());
    setNewBill(prev => ({ ...prev, invoiceNo: invNo, isDuplicateWarning: isDup }));
  };

  const handleOcrMock = () => {
    addNotification('Initiating OCR intake engine...', 'info');
    setTimeout(() => {
      setNewBill({
        ...newBill,
        vendor: 'Oscorp Tech',
        invoiceNo: `INV-OSC-${Math.floor(100 + Math.random() * 900)}`,
        invoiceDate: new Date().toISOString().slice(0, 10),
        due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        items: [
          { product: 'Titanium Alloys', qty: 10, unitCost: 1000, discount: 500, taxPercent: 5 }
        ],
        isDuplicateWarning: false
      });
      addNotification('OCR successfully extracted invoice details.', 'success');
    }, 800);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newBill.invoiceNo) {
      addNotification('Invoice Number is required.', 'warning');
      return;
    }

    if (newBill.isDuplicateWarning) {
      addNotification('Warning: Duplicate invoice detected. Blocked by AP compliance.', 'danger');
      return;
    }

    const billNo = `BIL-2026-00${bills.length + 1}`;
    
    let totalAmt = 0;
    let taxAmt = 0;
    const billItems = newBill.items.map(i => {
      const sub = (i.qty * i.unitCost) - i.discount;
      const tax = sub * (i.taxPercent / 100);
      totalAmt += (sub + tax);
      taxAmt += tax;
      return { ...i, subtotal: sub + tax };
    });

    const added = {
      id: Date.now(),
      code: billNo,
      date: newBill.invoiceDate,
      due: newBill.due,
      vendor: newBill.vendor,
      poRef: newBill.poRef,
      grnRef: newBill.grnRef,
      invoiceNo: newBill.invoiceNo,
      currency: newBill.currency,
      taxMethod: newBill.taxMethod,
      expenseAccount: newBill.expenseAccount,
      items: billItems,
      amount: totalAmt,
      taxAmount: taxAmt,
      netAmount: totalAmt - taxAmt,
      status: 'Pending Approval',
      poMatch: newBill.poRef !== 'None' ? 'Passed' : 'N/A',
      grnMatch: newBill.grnRef !== 'None' ? 'Passed' : 'N/A',
      invoiceMatch: 'Passed',
      mismatchDetected: false,
      duplicateDetected: false,
      ocrConfidence: '99%',
      workflowStep: 'Accounts Officer Review',
      history: `Accrued by Accounts Officer on ${new Date().toISOString().slice(0, 10)}`,
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: 'Vendor bill registered.' }]
    };

    const updated = [added, ...bills];
    syncData(updated);
    addAuditLog('Created Vendor Bill', 'Vendor Bills', billNo, `Logged liability of $${totalAmt.toLocaleString()} from supplier ${newBill.vendor}`);
    setShowAddModal(false);
    addNotification(`Vendor Bill ${billNo} generated and matches recorded PO/GRN values.`, 'success');
  };

  const handleApprove = (id) => {
    const updated = bills.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'Approved',
          workflowStep: 'Posted',
          timeline: [...b.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: 'Bill Approved & Posted to Ledger' }]
        };
      }
      return b;
    });
    syncData(updated);
    addNotification('Vendor bill approved and posted to General Ledger payables.', 'success');
    if (selectedBill && selectedBill.id === id) {
      setSelectedBill(updated.find(b => b.id === id));
    }
  };

  const handlePay = (id) => {
    const updated = bills.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'Paid',
          timeline: [...b.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: 'Payment cleared via bank ACH' }]
        };
      }
      return b;
    });
    syncData(updated);
    addNotification('Electronic bank transfer executed. Bill marked as Paid.', 'success');
    if (selectedBill && selectedBill.id === id) {
      setSelectedBill(updated.find(b => b.id === id));
    }
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'vendor_bill' });
    setActiveTab?.('erp_vendor_bills');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.invoiceNumber || row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const updated = bills.filter(b => b.id !== deleteDialog.id);
    syncData(updated);
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
    addNotification('Vendor bill deleted successfully.', 'success');
  };

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleMoveToDraft = async (row) => {
    try {
      const updated = bills.map(b => b.id === row.id ? { ...b, status: 'Draft' } : b);
      syncData(updated);
      addNotification?.('Bill moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const kpiData = useMemo(() => [
    { label: 'Outstanding Liabilities', val: mergedBills.filter(b => b.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0), icon: faWallet, color: colors.warning, trend: 'up', trendVal: 'Accrued AP' },
    { label: 'Settled Payments', val: mergedBills.filter(b => b.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0), icon: faCreditCard, color: colors.success, trend: 'up', trendVal: 'Disbursed' },
    { label: 'Awaiting Approvals', val: mergedBills.filter(b => b.status === 'Pending Approval').length, icon: faCheckCircle, color: colors.primary, trend: 'up', trendVal: 'In Queue' },
  ], [mergedBills]);

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filtered;
    const cols = [
      { key: 'code', label: 'Bill Number' }, { key: 'invoiceNo', label: 'Invoice No' },
      { key: 'vendor', label: 'Supplier' }, { key: 'poRef', label: 'PO Ref' },
      { key: 'due', label: 'Due Date' }, { key: 'amount', label: 'Liability Amount' },
      { key: 'poMatch', label: 'Verification' }, { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'vendor_bills.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'vendor_bills.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { exportDocx(headers, rows, 'Vendor Bills', 'vendor_bills.docx'); }
    else if (type === 'pdf') { exportPdf(headers, rows, 'Vendor Bills', 'vendor_bills.pdf'); }
    else if (type === 'word') { exportWord(headers, rows, 'Vendor Bills', 'vendor_bills.word'); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const filtered = mergedBills.filter(b => {
    const matchesSearch = b.code.toLowerCase().includes(searchTerm.toLowerCase()) || b.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || b.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const columns = [
    { key: 'code', label: 'Bill Number', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
    { key: 'invoiceNo', label: 'Invoice No', render: (val) => <span style={{ color: textColor }}>{val}</span> },
    { key: 'vendor', label: 'Supplier', bold: true, render: (val) => <span className="fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'poRef', label: 'PO Ref', render: (val) => <span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>{val}</span> },
    { key: 'due', label: 'Due Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'amount', label: 'Liability Amount', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>${val.toLocaleString()}</span> },
    { key: 'poMatch', label: 'Verification', render: (val, row) => (
      <span className="premium-badge" style={{
        background: row.poMatch === 'Passed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'),
        color: row.poMatch === 'Passed' ? colors.success : colors.warning
      }}>3-Way: {row.poMatch}</span>
    )},
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
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
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const exportButtons = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">⋯</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}>PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}>DOCX</button></li>
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
            <FontAwesomeIcon icon={faWallet} className="me-2" style={{ color: '#6366f1' }} />
            Vendor Bill & Liabilities Desk
          </h4>
        </div>
        <p className="mb-0 ms-1" style={{ color: mutedColor, fontSize: '0.85rem' }}>
          <FontAwesomeIcon icon={faInfoCircle} className="me-1" style={{ color: '#6366f1', opacity: 0.7, fontSize: '0.75rem' }} />
          Record incoming vendor invoices, match purchase documents (3-way check), post liabilities, and clear vendor bills.
        </p>
      </div>
      <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={handleOcrMock}>
          <FontAwesomeIcon icon={faBolt} className="me-1" /> OCR Capture
        </button>
        <button onClick={() => setActiveTab('erp_log_vendor_bill')} className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
          <FontAwesomeIcon icon={faPlus} /> Log Vendor Bill
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ErpPageShell headerContent={<div style={{ height: 60, background: isDark ? '#1e293b' : '#f8fafc', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />}>
        <div className="row g-3 mb-4">
          {[1,2,3].map(i => (
            <div key={i} className="col-md-4">
              <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
                <div style={{ height: 12, width: '60%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 24, width: '40%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          <div style={{ height: 16, width: '30%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6, marginBottom: 8 }} />
          <div style={{ height: 12, width: '80%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
        </div>
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <div style={{ height: 14, width: '15%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '20%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '25%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '20%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '15%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </ErpPageShell>
    );
  }

  return (
    <ErpPageShell headerContent={headerContent}>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {[
          { id: 'bills', label: 'Vendor Bills Ledger', icon: faWallet },
          { id: 'threeway', label: '3-Way Match Verification', icon: faScaleBalanced },
          { id: 'aging', label: 'Vendor aging payables', icon: faChartPie }
        ].map(tab => (
          <button
            key={tab.id}
            className="premium-btn btn btn-sm py-2 px-3 fw-bold"
            style={{
              color: activeSubTab === tab.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
              background: activeSubTab === tab.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.78rem',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onClick={() => setActiveSubTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} className="me-1" /> {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'bills' && (
        <>
          <div className="row g-3 mb-4">
            {kpiData.map((k, idx) => (
              <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-4" />
            ))}
          </div>

          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Payment Optimization Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Schedule payments on the 25th to capture early payment discounts. 3 bills qualify for 2% discount terms.</div>
                </div>
              </div>
            </div>
          </div>

          <ErpDataTable
            columns={columns}
            data={paginatedData}
            loading={loading}
            error={error}
            searchable
            searchTerm={searchTerm}
            onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            searchPlaceholder="Search bills..."
            emptyMessage="No bills found."
            emptyIcon={faWallet}
            isDark={isDark}
            currentPage={currentPage}
            entriesPerPage={entriesPerPage}
            totalEntries={filtered.length}
            onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
            exportButtons={exportButtons}
          />
        </>
      )}

      {activeSubTab === 'threeway' && (
        <div className="glass-card p-4 mb-4" style={{ borderRadius: '16px' }}>
          <h5 className="fw-bold mb-3" style={{ color: textColor }}>
            <FontAwesomeIcon icon={faScaleBalanced} className="me-2" style={{ color: '#6366f1' }} />
            Accounts Payable 3-Way Match Verification Center
          </h5>
          <div className="premium-table-wrapper">
            <div className="table-responsive">
              <table className="premium-table text-center" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Vendor Bill</th>
                    <th>Supplier</th>
                    <th>PO Reference</th>
                    <th>GRN Reference</th>
                    <th>Invoiced Price</th>
                    <th>PO Match</th>
                    <th>GRN Match</th>
                    <th>Duplicate Detection Check</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedBills.map(b => (
                    <tr key={b.id}>
                      <td className="fw-bold font-monospace" style={{ color: '#6366f1' }}>{b.code}</td>
                      <td style={{ color: textColor }}>{b.vendor}</td>
                      <td style={{ color: textColor }}>{b.poRef}</td>
                      <td style={{ color: textColor }}>{b.grnRef}</td>
                      <td className="font-monospace fw-bold" style={{ color: textColor }}>${b.amount.toLocaleString()}</td>
                      <td><span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>PO Match Passed</span></td>
                      <td><span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>GRN Match Passed</span></td>
                      <td><span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>Passed (Unique)</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'aging' && (
        <div className="glass-card p-4 mb-4" style={{ borderRadius: '16px' }}>
          <h5 className="fw-bold mb-3" style={{ color: textColor }}>
            <FontAwesomeIcon icon={faChartPie} className="me-2" style={{ color: '#6366f1' }} />
            Accounts Payable Aging Report
          </h5>
          <div className="row g-3 text-center">
            {[
              { label: 'Current Due', val: '$' + mergedBills.filter(b => b.status !== 'Paid').reduce((sum, b) => sum + b.amount, 0).toLocaleString(), color: '#10b981' },
              { label: '1-30 Days', val: '$0', color: '#f59e0b' },
              { label: '31-60 Days', val: '$0', color: '#f43f5e' }
            ].map((item, i) => (
              <div key={i} className="col">
                <div className="glass-card p-3" style={{ borderRadius: '12px', border: 'none' }}>
                  <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{item.label}</div>
                  <div className="fw-bold" style={{ color: item.color, fontSize: '1.3rem' }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faWallet} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Vendor Bill Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Approved' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Paid' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Paid' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Paid' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Vendor: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.vendor}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Invoice: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.invoiceNo}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Due: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.due}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vendor Details</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.vendor}</p>
                      <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>PO Ref: {viewItem.poRef}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.amount.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.due}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Subtotal</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>${viewItem.amount.toLocaleString()}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Tax (0%)</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: mutedColor, fontSize: '0.85rem' }}>$0.00</span>
                    </div>
                    <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                    <div className="col-8">
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Total</span>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>${viewItem.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Terms & Notes</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Payment due by {viewItem.due}. Subject to standard terms and conditions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this vendor bill to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpVendorBills;
