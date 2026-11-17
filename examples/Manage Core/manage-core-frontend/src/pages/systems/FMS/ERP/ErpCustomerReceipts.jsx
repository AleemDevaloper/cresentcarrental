import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import ShareQrButton from '../../../../components/common/ShareQrButton';
import { moveToFmsTrash } from '../../../../api/enterprise';
import {
  faPlus, faSearch, faFilter, faFileExport, faEye,
  faTrash, faCheckCircle, faLock, faUnlock, faCoins,
  faSliders, faClock, faInfoCircle, faTriangleExclamation,
  faBuildingColumns, faUser, faFileInvoiceDollar, faXmark,
  faArrowUp, faArrowDown, faPen, faReceipt, faCalendarDays,
  faCreditCard, faBank, faTag, faNoteSticky, faUserTie,
  faHashtag, faSync, faFileCsv, faFileExcel, faFilePdf, faFileWord, faFileAlt,
  faBrain, faEdit, faFileSignature, faEnvelope, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';

import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

const ErpCustomerReceipts = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [receipts, setReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null });

  const [viewReceipt, setViewReceipt] = useState(null);

  const openAddReceipt = () => setActiveTab('erp_create_receipt');

  const handlePostReceipt = (id) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'Posted' } : r));
    addNotification('Receipt posted to ledger accounts.', 'success');
  };

  const handleDeleteReceipt = (id, row) => {
    setDeleteDialog({ show: true, id, row });
  };

  const handleDeleteConfirm = async () => {
    const { id, row } = deleteDialog;
    try {
      if (row) {
        await moveToFmsTrash({ type: 'Receipt', code: row.number, title: row.customer, value: typeof row.amount === 'number' ? '$' + row.amount.toLocaleString() : (row.amount || '$0.00') });
      }
      const mod = await import('../../../../api/client');
      await mod.default.delete(`/receipts/${id}`);
      setReceipts(prev => prev.filter(r => r.id !== id));
      addNotification('Receipt moved to Accounting Trash.', 'success');
    } catch (err) {
      addNotification(err?.message || 'Failed to delete receipt.', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, row: null });
    }
  };

  const handleViewReceipt = (row) => setViewReceipt(row);

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'customer_receipt' });
    setActiveTab?.('erp_create_receipt');
  };

  const closeViewModal = () => setViewReceipt(null);

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredReceipts;
    const cols = receiptColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'customer_receipts.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'customer_receipts.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Customer Receipts', headers, rows, filename: 'customer_receipts.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Customer Receipts', headers, rows, filename: 'customer_receipts.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Customer Receipts', headers, rows, filename: 'customer_receipts.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = (r.customer?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) || (r.number?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'All' || r.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalAmount = receipts.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const unallocatedAmount = receipts.filter(r => Number(r.allocated || 0) === 0).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const postedCount = receipts.filter(r => r.status === 'Posted').length;
  const pendingCount = receipts.filter(r => r.status !== 'Posted').length;

  const kpiData = useMemo(() => [
    { label: "Today's Receipts", val: totalAmount, icon: faCoins, color: colors.success, trend: 'up', trendVal: 'Active', sparkline: [120, 130, 125, 140, 135, 150, 145, 160, 155, 170, 165, 180] },
    { label: 'Unallocated Receipts', val: unallocatedAmount, icon: faInfoCircle, color: colors.warning, trend: 'down', trendVal: '$' + unallocatedAmount.toLocaleString(), sparkline: [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 20, 20] },
    { label: 'Total Posted', val: postedCount, icon: faCheckCircle, color: colors.primary, trend: 'up', trendVal: 'Posted', sparkline: [10, 12, 11, 14, 13, 16, 15, 18, 17, 20, 19, 22] },
    { label: 'Pending Verification', val: pendingCount, icon: faClock, color: colors.danger, trend: 'down', trendVal: 'Pending', sparkline: [8, 7, 9, 6, 8, 5, 7, 4, 6, 5, 4, 3] },
  ], [receipts, totalAmount, unallocatedAmount, postedCount, pendingCount]);

  const receiptColumns = [
    { key: 'number', label: 'Receipt No', bold: true },
    { key: 'date', label: 'Receipt Date' },
    { key: 'customer', label: 'Customer' },
    { key: 'invoiceRef', label: 'Invoice Reference' },
    { key: 'method', label: 'Method' },
    { key: 'bank', label: 'Clearing Bank' },
    { key: 'amount', label: 'Amount', render: (v) => <span className="font-monospace fw-bold" style={{ color: '#10b981' }}>${Number(v || 0).toLocaleString()}</span> },
    { key: 'allocated', label: 'Allocated', render: (v) => <span className="font-monospace" style={{ color: mutedColor }}>${Number(v || 0).toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', align: 'end' },
  ];

  const headerAction = (
    <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
      <button onClick={() => openAddReceipt()} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        fontSize: '0.8rem',
      }}>
        <FontAwesomeIcon icon={faPlus} /> New Receipt Entry
      </button>
    </div>
  );

  useEffect(() => {
    let active = true;
    setLoadingReceipts(true);
    import('../../../../api/client').then(mod => {
      const client = mod.default;
      client.get('/receipts').then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setReceipts(list.map(r => ({ ...r, customer: r.customer_name || `Customer #${r.client_id}`, invoiceRef: r.invoice_ref })));
      }).catch(() => { if (active) setReceipts([]); }).finally(() => { if (active) setLoadingReceipts(false); });
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onRefresh = () => {
      setLoadingReceipts(true);
      import('../../../../api/client').then(mod => {
        mod.default.get('/receipts').then((res) => {
          const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          setReceipts(list.map(r => ({ ...r, customer: r.customer_name || `Customer #${r.client_id}`, invoiceRef: r.invoice_ref })));
        }).catch(() => {}).finally(() => { setLoadingReceipts(false); });
      });
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

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

  const filterSelect = (
    <select className="form-select form-select-sm" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
      <option value="All">All Methods</option>
      <option value="Bank Transfer">Bank Transfer</option>
      <option value="Cheque">Cheque</option>
      <option value="Cash">Cash</option>
    </select>
  );

  return (
    <ErpPageShell
      icon={faFileInvoiceDollar}
      title="Customer Receipts & Collections"
      description="Manage incoming customer payments and automatically reconcile them with invoices, journals, and receivable ledgers."
      action={headerAction}
    >
      {/* AI Recommendation Card */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Receipt Matching Recommendation</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>2 receipts pending allocation to open invoices. Consider batch auto-allocate to improve receivables aging.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium KPI Row */}
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard
            key={idx}
            label={k.label}
            value={k.val}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
            trendVal={k.trendVal}
            sparkline={k.sparkline}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Filter + Table */}
      <ErpDataTable
        columns={receiptColumns}
        data={filteredReceipts.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)}
        isDark={isDark}
        searchable
        searchPlaceholder="Search by receipt or customer..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterSelect}
        exportButtons={exportButtons}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filteredReceipts.length}
        onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
        renderRow={(r, i, ctx) => (
          <tr key={r.id}>
            <td className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{r.number}</td>
            <td style={{ color: textColor }}>{formatDate(r.date)}</td>
            <td className="fw-bold" style={{ color: textColor }}>{r.customer}</td>
            <td style={{ color: textColor }}>{r.invoiceRef}</td>
            <td style={{ color: textColor }}>{r.method}</td>
            <td style={{ color: textColor }}>{r.bank}</td>
            <td className="font-monospace fw-bold" style={{ color: '#10b981' }}>${Number(r.amount || 0).toLocaleString()}</td>
            <td className="font-monospace" style={{ color: mutedColor }}>${Number(r.allocated || 0).toLocaleString()}</td>
            <td>
              <span className={`premium-badge`} style={{
                background: r.status === 'Posted' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#334155' : '#f1f5f9'),
                color: r.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#94a3b8' : '#64748b'),
                padding: '1px 8px',
              }}>
                {r.status}
              </span>
            </td>
            <td className="text-end">
              <div className="d-flex gap-1 justify-content-end align-items-center">
                <button className="btn btn-sm premium-btn" title="View" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '5px 9px' }} onClick={() => handleViewReceipt(r)}>
                  <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.85rem' }} />
                </button>
                <button className="btn btn-sm premium-btn" title="Edit" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => handleEditClick(r)}>
                  <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.85rem' }} />
                </button>
                <button className="btn btn-sm premium-btn" title="Move to Draft" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#713f12' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706', border: 'none', padding: '5px 9px' }} onClick={() => addNotification?.('Receipt moved to draft.', 'success')}>
                  <FontAwesomeIcon icon={faFileSignature} style={{ fontSize: '0.85rem' }} />
                </button>
                <ShareQrButton entityType="customer_receipt" entityId={r.id} label={`${r.receipt_no || r.id} · ${r.customer || r.client_name || ''}`} isDark={isDark} onNotify={addNotification} />
                <button className="btn btn-sm premium-btn" title="Generate PDF" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => addNotification?.('PDF generated.', 'success')}>
                  <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '0.85rem' }} />
                </button>
                <button className="btn btn-sm premium-btn" title="Email" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '0.85rem' }} />
                </button>
                {r.status !== 'Posted' && (
                  <button className="btn btn-sm premium-btn" style={{
                    borderRadius: '8px', fontSize: '0.7rem',
                    background: isDark ? '#1e3a5f' : '#e0f2fe',
                    color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '5px 9px',
                  }} onClick={() => handlePostReceipt(r.id)}>Post Ledger</button>
                )}
                <button className="btn btn-sm premium-btn" title="Move to Trash" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '5px 9px' }} onClick={() => handleDeleteReceipt(r.id, r)}>
                  <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '0.85rem' }} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Receipt"
        message="This receipt will be moved to the Accounting Trash. You can restore or permanently purge it later."
        itemName={deleteDialog.row?.number || ''}
        confirmLabel="Move to Trash"
      />

      {/* View Receipt Modal */}
      {viewReceipt && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          padding: '1rem',
        }} onClick={closeViewModal}>
          <div style={{
            background: isDark ? '#242838' : '#ffffff',
            borderRadius: '16px', width: '100%', maxWidth: 600,
            height: 'calc(100vh - 2rem)', maxHeight: 'calc(100vh - 2rem)', overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faReceipt} style={{ color: '#6366f1', fontSize: '1rem' }} />
                <h6 className="mb-0 fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Receipt Details</h6>
                <span className="badge" style={{
                  background: viewReceipt.status === 'Posted' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'),
                  color: viewReceipt.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
                  fontSize: '0.6rem', fontWeight: 600, marginLeft: 8,
                }}>{viewReceipt.status}</span>
              </div>
              <button onClick={closeViewModal} className="btn btn-sm border-0" style={{ color: mutedColor, borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9' }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Receipt Number</div>
                  <div className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '0.9rem' }}>{viewReceipt.number}</div>
                </div>
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Date</div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{formatDate(viewReceipt.date)}</div>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Customer</div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewReceipt.customer}</div>
                </div>
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Invoice Reference</div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewReceipt.invoiceRef || viewReceipt.invoice_ref || '—'}</div>
                </div>
              </div>
              <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Payment Details</div>
                <div className="row g-3">
                  <div className="col-4">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Method</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500 }}>{viewReceipt.method}</div>
                  </div>
                  <div className="col-4">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Bank / Source</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500 }}>{viewReceipt.bank || '—'}</div>
                  </div>
                  <div className="col-4">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Reference No</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500, wordBreak: 'break-all' }}>{viewReceipt.reference_no || '—'}</div>
                  </div>
                </div>
              </div>
              <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div className="row g-3">
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Amount</div>
                    <div className="fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1.1rem' }}>${Number(viewReceipt.amount || 0).toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Allocated</div>
                    <div className="fw-bold font-monospace" style={{ color: mutedColor, fontSize: '1.1rem' }}>${Number(viewReceipt.allocated || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {viewReceipt.notes && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Notes</div>
                  <div style={{ color: textColor, fontSize: '0.8rem', background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '8px', padding: '0.75rem' }}>{viewReceipt.notes}</div>
                </div>
              )}
              <div className="d-flex gap-2 justify-content-end pt-2" style={{ borderTop: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
                <button onClick={closeViewModal} className="btn btn-sm px-3" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}>Close</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </ErpPageShell>
  );
};

export default ErpCustomerReceipts;
