import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faRefresh, faEye, faPrint, faPaperPlane, faArrowRotateLeft,
  faEnvelope, faMessage, faFilePdf, faQrcode, faFileInvoice, faInfoCircle,
  faFileExport, faFileCsv, faFileExcel, faFileWord, faFileAlt, faXmark,
  faBrain, faCheckCircle, faTrashCan, faEdit, faFileSignature, faArrowUp, faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const LoadingSkeleton = ({ isDark }) => {
  const shimmer = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="rounded-4 p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #2563EB 100%)' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '120px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '350px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '500px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="col-xl-2 col-lg-4 col-md-4 col-6">
              <div className="p-3 rounded-4" style={{ background: shimmer, minHeight: '90px' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '60%', height: '12px', background: isDark ? '#1e293b' : '#f1f5f9' }} />
                <div className="skeleton-box rounded" style={{ width: '40%', height: '28px', background: isDark ? '#1e293b' : '#f1f5f9' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ErpPosInvoicesReceipts = () => {
  const { theme, addNotification, setEditDocument, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const allInvoices = [
    { id: 1, number: 'INV-POS-9011', date: '2026-07-03', time: '10:15 AM', customer: 'Walk-in Customer', cashier: 'Alice Johnson', itemsCount: 3, discount: 0, tax: 8.5, total: 58.5, method: 'Cash', status: 'Completed' },
    { id: 2, number: 'INV-POS-9010', date: '2026-07-03', time: '09:44 AM', customer: 'John Carter', cashier: 'Alice Johnson', itemsCount: 1, discount: 5, tax: 15.3, total: 105.3, method: 'Card', status: 'Completed' },
    { id: 3, number: 'INV-POS-9009', date: '2026-07-02', time: '08:30 PM', customer: 'Sarah Connor', cashier: 'Robert Smith', itemsCount: 5, discount: 10, tax: 45.9, total: 315.9, method: 'Card', status: 'Completed' }
  ];

  const [invoices, setInvoices] = useState([]);

  const fetchData = async () => {
    try { setLoading(true); setError(null); await new Promise(r => setTimeout(r, 300)); setInvoices(allInvoices); }
    catch (err) { setError(err.message || 'Failed to load invoices'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'pos_invoice' });
    setActiveTab?.('erp_pos_invoices_receipts');
  };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.customer || '' });

  const handleDeleteConfirm = async () => {
    try {
      setInvoices(prev => prev.filter(i => i.id !== deleteDialog.id));
      addNotification?.('Invoice moved to trash', 'success');
      setDeleteDialog({ show: false, id: null, name: '' });
    } catch (err) { addNotification?.(err.message || 'Failed to delete invoice', 'error'); }
  };

  const handleMoveToDraft = async (row) => {
    setInvoices(prev => prev.map(i => i.id === row.id ? { ...i, status: 'Draft' } : i));
    addNotification?.('Invoice moved to Draft', 'success');
  };

  const filteredInvoices = invoices.filter(i =>
    i.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kpiWidgets = useMemo(() => [
    { label: 'Total Invoices', val: invoices.length, icon: faFileInvoice, color: colors.primary, trend: 'up', trendVal: `${invoices.length} Total` },
    { label: 'Gross Revenue', val: invoices.reduce((s, i) => s + i.total, 0), icon: faArrowUp, color: colors.success, trend: 'up', trendVal: 'Accumulated' },
    { label: 'Cash Transactions', val: invoices.filter(i => i.method === 'Cash').length, icon: faCheckCircle, color: colors.info, trend: 'up', trendVal: 'Cash' },
    { label: 'Card Transactions', val: invoices.filter(i => i.method === 'Card').length, icon: faCheckCircle, color: colors.warning, trend: 'up', trendVal: 'Card' },
    { label: 'Avg Transaction', val: invoices.length ? Math.round(invoices.reduce((s, i) => s + i.total, 0) / invoices.length) : 0, icon: faArrowDown, color: colors.purple, trend: 'up', trendVal: 'Average' },
  ], [invoices]);

  const columns = [
    { key: 'number', label: 'Invoice No', bold: true, render: (val, row) => <span className="font-monospace fw-bold" style={{ color: colors.primary, cursor: 'pointer' }} onClick={() => setSelectedInvoice(row)}>{val}</span> },
    { key: 'date', label: 'Date & Time', render: (val, row) => <span className="font-monospace small" style={{ color: mutedColor, fontSize: '0.72rem' }}>{val} {row.time}</span> },
    { key: 'customer', label: 'Customer', bold: true },
    { key: 'cashier', label: 'Cashier' },
    { key: 'itemsCount', label: 'Items', render: (val) => `${val} lines` },
    { key: 'total', label: 'Total Value', render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.success }}>${val.toFixed(2)}</span> },
    { key: 'method', label: 'Method', render: (val) => <span className="badge bg-secondary bg-opacity-10 text-secondary">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => (
      <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{ fontSize: '0.7rem', borderRadius: '20px', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? '#4ade80' : '#16a34a' }} />{val}
      </span>
    )},
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => setSelectedInvoice(row)}
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
        <button className="btn btn-sm border-0 premium-btn" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    const data = filteredInvoices;
    const cols = columns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (format === 'csv') { downloadBlob(csv, 'pos_invoices.csv', 'text/csv'); }
    else if (format === 'xlsx') { downloadBlob(csv, 'pos_invoices.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (format === 'docx') { await exportDocx({ headers, rows }, 'pos_invoices.docx'); }
    else if (format === 'pdf') { await exportPdf({ headers, rows, title: 'POS Invoices' }, 'pos_invoices.pdf'); }
    else if (format === 'word') { await exportWord({ headers, rows, title: 'POS Invoices' }, 'pos_invoices.doc'); }
    addNotification(`${format.toUpperCase()} exported successfully.`, 'success');
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
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const actionButtons = (
    <div className="d-flex gap-2">
      <button className="btn btn-sm btn-light border" onClick={() => addNotification('Reprint queue initialized.', 'success')}><FontAwesomeIcon icon={faPrint} className="me-1" /> Reprint Queue</button>
      <button className="btn btn-sm btn-light border" onClick={() => addNotification('Registry refreshed.', 'success')}><FontAwesomeIcon icon={faRefresh} /></button>
    </div>
  );

  if (loading) return <LoadingSkeleton isDark={isDark} />;

  return (
    <ErpPageShell
      icon={faFileInvoice}
      title="POS Invoices & Customer Receipts"
      description="Browse historical retail invoices, process refunds, reprint physical receipts, and dispatch digital copies via Email or WhatsApp."
      action={actionButtons}
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} trend={w.trend} trendVal={w.trendVal} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        ))}
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Sales Analytics Recommendation</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Card transactions account for 65% of POS revenue. Consider promoting mobile wallet payments to reduce merchant fees.</div>
            </div>
          </div>
        </div>
      </div>

      <ErpDataTable
        columns={columns}
        data={filteredInvoices}
        loading={loading}
        error={error}
        searchable
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by Invoice No, Customer..."
        emptyMessage="No invoices found."
        emptyIcon={faFileInvoice}
        isDark={isDark}
        title="Invoices Registry"
        titleIcon={faFileInvoice}
        exportButtons={exportButtons}
      />

      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedInvoice(null)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', width: '100%', margin: '1rem' }}>
            <div style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFileInvoice} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Invoice Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: selectedInvoice.status === 'Completed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#1e3a5f' : '#e0f2fe'), color: selectedInvoice.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: selectedInvoice.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7') }} />
                    {selectedInvoice.status}
                  </span>
                  <button onClick={() => setSelectedInvoice(null)} className="btn-close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{selectedInvoice.number}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Customer: <span className="fw-semibold" style={{ color: textColor }}>{selectedInvoice.customer}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold" style={{ color: textColor }}>{selectedInvoice.date} {selectedInvoice.time}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Cashier: <span className="fw-semibold" style={{ color: textColor }}>{selectedInvoice.cashier}</span></p>
                  </div>
                </div>

                <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{selectedInvoice.customer}</p>
                      <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Items: {selectedInvoice.itemsCount} lines</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Method</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{selectedInvoice.method}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</small>
                      <p className="mb-0 mt-1" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>{selectedInvoice.status}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8"><span style={{ color: mutedColor, fontSize: '0.75rem' }}>Subtotal</span></div>
                    <div className="col-4 text-end"><span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>${(selectedInvoice.total - selectedInvoice.tax).toFixed(2)}</span></div>
                    <div className="col-8"><span style={{ color: mutedColor, fontSize: '0.75rem' }}>VAT (17%)</span></div>
                    <div className="col-4 text-end"><span style={{ color: mutedColor, fontSize: '0.85rem' }}>${selectedInvoice.tax.toFixed(2)}</span></div>
                    <div className="col-8"><span style={{ color: mutedColor, fontSize: '0.75rem' }}>Discount</span></div>
                    <div className="col-4 text-end"><span style={{ color: '#f43f5e', fontSize: '0.85rem' }}>-${selectedInvoice.discount}</span></div>
                    <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                    <div className="col-8"><span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Total</span></div>
                    <div className="col-4 text-end"><span className="fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1rem' }}>${selectedInvoice.total.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 justify-content-end" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <button className="btn btn-sm border-0 px-3" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, fontSize: '0.75rem' }} onClick={() => { addNotification('Reprint advice issued.', 'success'); setSelectedInvoice(null); }}>
                    <FontAwesomeIcon icon={faPrint} className="me-1" /> Reprint
                  </button>
                  <button className="btn btn-sm border-0 px-3" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, fontSize: '0.75rem' }} onClick={() => { addNotification('WhatsApp receipt dispatch.', 'success'); setSelectedInvoice(null); }}>
                    <FontAwesomeIcon icon={faMessage} className="me-1" /> WhatsApp
                  </button>
                  <button className="btn btn-sm border-0 px-3" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, fontSize: '0.75rem' }} onClick={() => { addNotification('Email copy dispatched.', 'success'); setSelectedInvoice(null); }}>
                    <FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email
                  </button>
                  <button onClick={() => setSelectedInvoice(null)} className="btn btn-sm px-3" style={{ borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', fontSize: '0.75rem' }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this invoice to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpPosInvoicesReceipts;
