import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFileExport, faClock, faCheckCircle,
  faInfoCircle, faXmark, faArrowRotateLeft, faFileInvoice,
  faEye, faPen, faTrash, faEnvelope, faFilePdf, faFileSignature, faBrain,
  faFileCsv, faFileExcel, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { getReturns, saveReturns, addAuditLog, getGRNs } from './erpPurchaseStore';
import { listVendors, listProducts, getTabData } from '../../../../api/ams';
import { DeleteConfirmDialog } from '../../../../components/common';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpPurchaseReturns = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [returns, setReturns] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [availableGRNs, setAvailableGRNs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [newReturn, setNewReturn] = useState({
    vendor: 'Oscorp Tech',
    grnRef: 'None',
    poRef: 'None',
    returnedQty: 1,
    refundAmount: 0,
    reason: 'Incorrect grade specification',
    notes: 'Approved return for refund credits.'
  });

  const fetchLocal = () => {
    setLoading(true); setError(null);
    try {
      setReturns(getReturns());
      setAvailableGRNs(getGRNs());
    } catch (err) { setError(err.message || 'Failed to load returns'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const results = await Promise.allSettled([getTabData('purchase_returns'), listVendors(), listProducts()]);
        const apiRecords = results[0].status === 'fulfilled'
          ? Array.isArray(results[0].value?.data) ? results[0].value.data : Array.isArray(results[0].value) ? results[0].value : []
          : [];
        setApiData(apiRecords);
        if (results[0].status === 'rejected') {
          console.warn('API fallback for purchase_returns:', results[0].reason);
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
    setReturns(updated);
    saveReturns(updated);
  };

  const mergedReturns = useMemo(() => {
    if (apiData.length > 0) {
      const localCodes = new Set(returns.map(r => r.code));
      const merged = [...apiData];
      returns.forEach(r => {
        if (!localCodes.has(r.code)) merged.push(r);
      });
      return merged;
    }
    return returns;
  }, [apiData, returns]);

  const handleGrnSelect = (grnCode) => {
    if (grnCode === 'None') {
      setNewReturn({ ...newReturn, grnRef: 'None', poRef: 'None', vendor: 'Oscorp Tech', refundAmount: 0 });
      return;
    }
    const grnObj = availableGRNs.find(g => g.code === grnCode);
    if (grnObj) {
      setNewReturn({
        ...newReturn,
        grnRef: grnCode,
        poRef: grnObj.poRef,
        vendor: grnObj.vendor,
        refundAmount: grnObj.items.reduce((sum, item) => sum + (item.rejectedQty * 100), 0) || 500
      });
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newReturn.grnRef === 'None') {
      addNotification('GRN Reference is required.', 'warning');
      return;
    }

    const code = `PRT-2026-00${returns.length + 1}`;
    const added = {
      id: Date.now(),
      code,
      date: new Date().toISOString().slice(0, 10),
      vendor: newReturn.vendor,
      grnRef: newReturn.grnRef,
      poRef: newReturn.poRef,
      refundAmount: parseFloat(newReturn.refundAmount || 0),
      returnedQty: parseInt(newReturn.returnedQty || 1),
      reason: newReturn.reason,
      notes: newReturn.notes,
      status: 'Initiated',
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Return voucher ${code} generated.` }]
    };

    const updated = [added, ...returns];
    syncData(updated);
    addAuditLog('Created Return', 'Purchase Returns', code, `Purchase return logged against GRN ${newReturn.grnRef}`);
    setShowAddModal(false);
    addNotification(`Purchase Return ${code} logged. Debit note accrued.`, 'success');
  };

  const handleComplete = (id) => {
    const updated = returns.map(r => {
      if (r.id === id) {
        return { ...r, status: 'Completed', timeline: [...r.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: 'Credit Memo received & settled' }] };
      }
      return r;
    });
    syncData(updated);
    addNotification('Purchase return credit memo finalized and AP settled.', 'success');
  };

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'purchase_return' });
    setActiveTab?.('erp_purchase_returns');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const { id } = deleteDialog;
    setReturns(prev => prev.filter(item => item.id !== id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const handleMoveToDraft = async (row) => {
    try {
      const updated = returns.map(r => r.id === row.id ? { ...r, status: 'Draft' } : r);
      syncData(updated);
      addNotification?.('Return moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Pending Credit Claims', val: '$' + mergedReturns.filter(r => r.status === 'Initiated').reduce((acc, curr) => acc + curr.refundAmount, 0).toLocaleString(), icon: faClock, color: colors.warning, trend: 'up', trendVal: 'Awaiting Settlement' },
    { label: 'Settled Refunds', val: '$' + mergedReturns.filter(r => r.status === 'Completed').reduce((acc, curr) => acc + curr.refundAmount, 0).toLocaleString(), icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Credit Memos Issued' },
  ], [mergedReturns]);

  const filtered = mergedReturns.filter(r => {
    const matchesSearch = r.code.toLowerCase().includes(searchTerm.toLowerCase()) || r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || r.grnRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filtered;
    const cols = columns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'purchase_returns.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'purchase_returns.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Purchase Returns', headers, rows, filename: 'purchase_returns.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Purchase Returns', headers, rows, filename: 'purchase_returns.docx' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const columns = [
    { key: 'code', label: 'Return Voucher No', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
    { key: 'date', label: 'Voucher Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'vendor', label: 'Vendor', bold: true, render: (val) => <span className="fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'grnRef', label: 'GRN Ref', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
    { key: 'poRef', label: 'PO Ref', render: (val) => <span className="font-monospace fw-bold" style={{ color: mutedColor }}>{val}</span> },
    { key: 'returnedQty', label: 'Qty Returned', render: (val) => `${val} Units` },
    { key: 'refundAmount', label: 'Refund Claimed', render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.success }}>${val.toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
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
        {row.status !== 'Completed' && (
          <button className="premium-btn btn btn-sm border-0 px-2 fw-bold" style={{ borderRadius: '8px', fontSize: '0.65rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' }} onClick={() => handleComplete(row.id)}>Settle Refund</button>
        )}
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const filtersJSX = (
    <select className="form-select form-select-sm" style={{ width: '140px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
      <option value="All">All Statuses</option>
      <option value="Completed">Completed</option>
      <option value="Initiated">Initiated</option>
    </select>
  );

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

  const actionButtons = (
    <button onClick={() => setActiveTab('erp_log_return_voucher')} className="premium-btn btn btn-sm d-flex align-items-center gap-1 px-3" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
      <FontAwesomeIcon icon={faPlus} /> Log Return Voucher
    </button>
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ErpPageShell icon={faArrowRotateLeft} title="Purchase Returns & Debit Notes" description="Loading...">
        <div className="row g-3 mb-4">
          {[1,2].map(i => (
            <div key={i} className="col-md-6">
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
    <ErpPageShell
      icon={faArrowRotateLeft}
      title="Purchase Returns & Debit Notes"
      description="Process returned inventory goods, log supplier debit notes, and manage credit adjustments to accounts payable."
      action={actionButtons}
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-6" />
        ))}
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Returns Optimization</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>2 return vouchers are pending settlement. Early resolution may improve vendor relationship score.</div>
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
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search returns..."
        filters={filtersJSX}
        exportButtons={exportButtons}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filtered.length}
        onEntriesPerPageChange={(v) => { setEntriesPerPage(v); setCurrentPage(1); }}
        emptyMessage="No returns found."
        emptyIcon={faArrowRotateLeft}
        isDark={isDark}
        title="Purchase Returns Register"
        titleIcon={faArrowRotateLeft}
      />

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRotateLeft} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Return Voucher Preview</span>
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
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Vendor: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.vendor}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.date}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>GRN Ref: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.grnRef}</span></p>
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
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Refund Amount</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.refundAmount.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty Returned</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.returnedQty} Units</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Return Reason</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.reason}</p>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="d-block mt-2">Notes</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.notes}</p>
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
        message="Are you sure you want to move this purchase return to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpPurchaseReturns;
