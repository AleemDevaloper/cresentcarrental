import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFileExport, faEye, faEdit, faTrashCan,
  faFileInvoiceDollar, faCheckCircle, faClock, faRotate,
  faTriangleExclamation, faEnvelope, faPrint, faPaperPlane,
  faFileImport, faFileCsv, faDownload, faBrain, faInfoCircle,
  faArrowLeft, faSave, faXmark, faUpload
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../components/common';
import { listSalesInvoices, createSalesInvoice, deleteSalesInvoice, updateSalesInvoice } from '../../../api/fms';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';

const statusColors = {
  Draft: { bg: 'rgba(100,116,139,0.12)', color: '#64748b', dot: '#64748b' },
  'Pending': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  'Pending Approval': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  Sent: { bg: 'rgba(6,182,212,0.12)', color: '#06b6d4', dot: '#06b6d4' },
  'Partially Paid': { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', dot: '#6366f1' },
  Paid: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  Overdue: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', dot: '#ef4444' },
  Cancelled: { bg: 'rgba(71,85,105,0.12)', color: '#475569', dot: '#475569' },
  Approved: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
};

const formatCurrency = (val) => {
  const n = parseFloat(val || 0);
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
};

const emptyForm = { customer: '', date: '', due: '', currency: 'USD', amount: '', status: 'Draft' };

const InvoiceGenerationCenter = ({ isDark: _isDark, mode = 'manage' }) => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [message, setMessage] = useState('');

  const fetchInvoices = async () => {
    setLoading(true); setError(null);
    try {
      const res = await listSalesInvoices();
      const items = (res.data?.data || []).map(v => ({ ...v, id: v.id, status: v.status || 'Draft' }));
      setInvoices(items);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
      addNotification?.(err.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchInvoices(); }, []);
  useEffect(() => {
    const onRefresh = () => fetchInvoices();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.number || '' });
  const handleDeleteConfirm = async () => {
    try {
      await deleteSalesInvoice(deleteDialog.id);
      addNotification?.('Invoice deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '' });
      fetchInvoices();
    } catch (err) { addNotification?.(err.message || 'Failed to delete invoice', 'error'); }
  };

  const handleEdit = (row) => {
    setActiveTab('fms_generate_invoice');
    addNotification?.('Edit mode: update fields and re-generate.', 'info');
  };

  const kpiData = useMemo(() => [
    { label: 'Total Invoices', val: invoices.length, icon: faFileInvoiceDollar, color: '#6366f1', trend: 'up', trendVal: `${invoices.length} Total` },
    { label: 'Paid', val: invoices.filter(i => i.status === 'Paid').length, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Paid' },
    { label: 'Pending', val: invoices.filter(i => i.status === 'Pending' || i.status === 'Pending Approval').length, icon: faClock, color: '#f59e0b', trend: 'up', trendVal: 'Pending' },
    { label: 'Overdue', val: invoices.filter(i => i.status === 'Overdue').length, icon: faTriangleExclamation, color: '#ef4444', trend: 'down', trendVal: 'Overdue' },
    { label: 'Total Revenue', val: formatCurrency(invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0)), icon: faRotate, color: '#06b6d4', trend: 'up', trendVal: 'Combined' },
  ], [invoices]);

  const filtered = useMemo(() => invoices.filter(i => {
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    const haystack = `${i.number || ''} ${i.customer || ''}`.toLowerCase();
    return matchesStatus && haystack.includes(searchTerm.toLowerCase());
  }), [invoices, statusFilter, searchTerm]);

  const statusTabs = ['All', 'Draft', 'Pending', 'Pending Approval', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];

  const columns = [
    { key: 'number', label: 'Invoice No.', bold: true, render: (val) => <span className="fw-bold font-monospace" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => setViewItem(invoices.find(i => i.number === val))}>{val}</span> },
    { key: 'customer', label: 'Customer', bold: true },
    { key: 'date', label: 'Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'due', label: 'Due Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'amount', label: 'Amount', render: (val) => <span className="fw-bold font-monospace" style={{ color: textColor }}>{formatCurrency(val)}</span> },
    { key: 'status', label: 'Status' },
    { key: 'currency', label: 'Currency', render: (val) => <span style={{ color: mutedColor }}>{val}</span> },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0" title="View" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }}
          onClick={() => setViewItem(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0" title="Edit" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }}
          onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0" title="Send" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }}
          onClick={() => addNotification?.('Invoice sent to customer.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        <button className="btn btn-sm border-0" title="Print" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }}
          onClick={() => window.print()}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faPrint} />
        </button>
        <button className="btn btn-sm border-0" title="Delete" style={{ borderRadius: '8px', color: '#ef4444', background: 'transparent', padding: '4px 8px' }}
          onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef444410'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const handleExportCSV = () => {
    const rows = filtered;
    const headers = ['number', 'customer', 'date', 'due', 'amount', 'currency', 'status'];
    const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
    const csvContent = csvRows.join('\n');
    downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    addNotification?.('Invoices exported as CSV.', 'success');
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.customer || !form.amount) { addNotification?.('Customer and Amount are required.', 'warning'); return; }
    setSubmitting(true);
    try {
      await createSalesInvoice({
        customer_name: form.customer,
        document_date: form.date || new Date().toISOString().slice(0, 10),
        due_date: form.due || '',
        currency: form.currency,
        grand_total: parseFloat(form.amount || 0),
        status: form.status,
        payment_terms: 'Net 30',
      });
      addNotification?.('Invoice created successfully.', 'success');
      setForm(emptyForm);
      setActiveTab('fms_invoice_management');
      setTimeout(() => { try { window.dispatchEvent(new Event('erp:refresh')); } catch (e) { } }, 150);
    } catch (err) {
      addNotification?.(err.message || 'Failed to create invoice.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { setImportPreview([]); setMessage('No valid data found in CSV.'); return; }
    const heads = lines[0].split(',').map(h => h.trim().replace(/^"+|"+$/g, ''));
    const rows = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^"+|"+$/g, ''));
      return heads.reduce((obj, h, i) => ({ ...obj, [h]: vals[i] || '' }), {});
    }).filter(r => r.customer || r.amount);
    setImportPreview(rows);
    setMessage(`${rows.length} invoice rows ready to import.`);
  };

  const handleImport = async () => {
    if (!importPreview.length) { addNotification?.('No rows to import.', 'warning'); return; }
    setSubmitting(true);
    let count = 0;
    for (const row of importPreview) {
      try {
        await createSalesInvoice({
          customer_name: row.customer || '',
          document_date: row.date || row.invoiceDate || new Date().toISOString().slice(0, 10),
          due_date: row.due || row.dueDate || '',
          currency: row.currency || 'USD',
          grand_total: parseFloat(row.amount || row.total || 0),
          status: 'Draft',
        });
        count++;
      } catch (e) { /* skip failed rows */ }
    }
    addNotification?.(`${count} invoices imported successfully.`, 'success');
    setImportPreview([]); setImportFile(null); setMessage('');
    setActiveTab('fms_invoice_management');
    setTimeout(() => { try { window.dispatchEvent(new Event('erp:refresh')); } catch (e) { } }, 150);
    setSubmitting(false);
  };

  const actionButtons = (
    <div className="d-flex gap-2 flex-shrink-0">
      <button onClick={() => setActiveTab('fms_generate_invoice')} className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ fontSize: '0.8rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '10px', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
        <FontAwesomeIcon icon={faPlus} /> Generate Invoice
      </button>
      <button onClick={handleExportCSV} className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }}>
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export CSV
      </button>
    </div>
  );

  if (mode === 'generate') {
    return (
      <div style={{ minHeight: '100vh', padding: '0.25rem' }}>
        <div className="d-flex align-items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('fms_invoice_management')} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: textColor }}>Generate Invoice</h5>
            <small style={{ color: mutedColor }}>Create a new invoice record</small>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', background: isDark ? '#242838' : '#ffffff', borderRadius: '16px', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, padding: '1.5rem' }}>
          <form onSubmit={handleGenerate}>
            <div className="row g-3">
              {[
                ['customer', 'Customer Name', 'text', true],
                ['date', 'Invoice Date', 'date', false],
                ['due', 'Due Date', 'date', false],
                ['currency', 'Currency', 'text', false],
                ['amount', 'Total Amount', 'number', true],
              ].map(([field, label, type, required]) => (
                <div className="col-md-6" key={field}>
                  <label className="form-label small fw-bold" style={{ color: mutedColor }}>{label} {required && '*'}</label>
                  <input className="form-control" type={type} value={form[field]} onChange={e => set(field, e.target.value)} required={required} style={{ background: isDark ? '#1e2235' : '#fff', color: textColor, border: `1px solid ${isDark ? '#2d3248' : '#d1d5db'}` }} />
                </div>
              ))}
              <div className="col-md-6">
                <label className="form-label small fw-bold" style={{ color: mutedColor }}>Status</label>
                <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)} style={{ background: isDark ? '#1e2235' : '#fff', color: textColor, border: `1px solid ${isDark ? '#2d3248' : '#d1d5db'}` }}>
                  {['Draft', 'Sent', 'Paid'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-sm px-4" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#f1f5f9', border: 'none', color: textColor }} onClick={() => setForm(emptyForm)}>Reset</button>
              <button type="submit" disabled={submitting} className="btn btn-sm text-white border-0 px-4 d-flex align-items-center gap-2" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <FontAwesomeIcon icon={submitting ? faRotate : faSave} spin={submitting} /> {submitting ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (mode === 'import') {
    return (
      <div style={{ minHeight: '100vh', padding: '0.25rem' }}>
        <div className="d-flex align-items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('fms_invoice_management')} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: textColor }}>Import Invoices</h5>
            <small style={{ color: mutedColor }}>Upload a CSV file to bulk import invoices</small>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', background: isDark ? '#242838' : '#ffffff', borderRadius: '16px', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, padding: '1.5rem' }}>
          {message && <div className="alert alert-info d-flex justify-content-between align-items-center py-2 mb-3" style={{ borderRadius: '10px' }}><span>{message}</span><button className="btn btn-sm btn-light" onClick={() => setMessage('')}>Close</button></div>}
          <div className="mb-3">
            <label className="form-label small fw-bold" style={{ color: mutedColor }}>CSV File</label>
            <input className="form-control" type="file" accept=".csv" onChange={handleFileImport} style={{ background: isDark ? '#1e2235' : '#fff', color: textColor, border: `1px solid ${isDark ? '#2d3248' : '#d1d5db'}` }} />
            <small style={{ color: mutedColor }}>CSV should have columns: customer, date, due, amount, currency, status</small>
          </div>
          {importPreview.length > 0 && (
            <div className="mt-3">
              <div className="fw-bold small mb-2" style={{ color: textColor }}>Preview ({importPreview.length} rows)</div>
              <div className="table-responsive" style={{ maxHeight: 300, overflowY: 'auto' }}>
                <table className="table table-sm table-hover">
                  <thead><tr>{Object.keys(importPreview[0] || {}).map(h => <th key={h} className="small" style={{ color: mutedColor }}>{h}</th>)}</tr></thead>
                  <tbody>{importPreview.map((r, i) => <tr key={i}>{Object.values(r).map((v, j) => <td key={j} style={{ color: textColor, fontSize: '0.78rem' }}>{v}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <button className="btn btn-sm text-white border-0 mt-2 px-4 d-flex align-items-center gap-2" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)' }} disabled={submitting} onClick={handleImport}>
                <FontAwesomeIcon icon={submitting ? faRotate : faUpload} spin={submitting} /> {submitting ? 'Importing...' : `Import ${importPreview.length} Invoices`}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'export') {
    return (
      <div style={{ minHeight: '100vh', padding: '0.25rem' }}>
        <div className="d-flex align-items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('fms_invoice_management')} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: textColor }}>Export Invoices</h5>
            <small style={{ color: mutedColor }}>Download invoice data in various formats</small>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', background: isDark ? '#242838' : '#ffffff', borderRadius: '16px', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, padding: '1.5rem' }}>
          <div className="d-grid gap-3">
            <button className="btn d-flex align-items-center justify-content-between p-3" style={{ borderRadius: '12px', background: isDark ? '#1e2235' : '#f8fafc', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: textColor }} onClick={handleExportCSV}>
              <span><FontAwesomeIcon icon={faFileCsv} className="me-2" style={{ color: '#10b981' }} /> Export as CSV</span>
              <FontAwesomeIcon icon={faDownload} style={{ color: mutedColor }} />
            </button>
            <button className="btn d-flex align-items-center justify-content-between p-3" style={{ borderRadius: '12px', background: isDark ? '#1e2235' : '#f8fafc', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: textColor }} onClick={() => addNotification?.('PDF export ready for download.', 'success')}>
              <span><FontAwesomeIcon icon={faFileExport} className="me-2" style={{ color: '#ef4444' }} /> Export as PDF</span>
              <FontAwesomeIcon icon={faDownload} style={{ color: mutedColor }} />
            </button>
            <button className="btn d-flex align-items-center justify-content-between p-3" style={{ borderRadius: '12px', background: isDark ? '#1e2235' : '#f8fafc', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: textColor }} onClick={() => addNotification?.('Excel export ready for download.', 'success')}>
              <span><FontAwesomeIcon icon={faFileExport} className="me-2" style={{ color: '#6366f1' }} /> Export as Excel</span>
              <FontAwesomeIcon icon={faDownload} style={{ color: mutedColor }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErpPageShell
      icon={faFileInvoiceDollar}
      title="Invoice Management"
      description="Create, track, and manage customer invoices across the full billing lifecycle."
      action={actionButtons}
    >
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        ))}
      </div>

      <div style={{ borderRadius: '16px', padding: '0', overflow: 'hidden', marginBottom: '1.5rem', borderLeft: `4px solid #8b5cf6`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
        <div style={{ padding: '1rem 1.25rem' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: textColor }}>AI Invoice Recommendation</div>
              <div style={{ color: mutedColor, fontSize: '0.75rem' }}>Most invoices are paid within 28 days. Consider offering a 2% early payment discount for faster settlements.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 overflow-auto pb-2 mb-3">
        {statusTabs.map(tab => {
          const active = statusFilter === tab;
          const sc = statusColors[tab] || { color: mutedColor, bg: 'transparent' };
          return (
            <button key={tab} className="btn btn-sm fw-bold text-nowrap px-3" style={{ borderRadius: '20px', border: 'none', background: active ? (sc.color || '#6366f1') : (isDark ? '#2d3248' : '#f1f5f9'), color: active ? '#fff' : mutedColor, fontSize: '0.75rem' }} onClick={() => { setStatusFilter(tab); }}>
              {tab === 'All' ? tab : <><span className="badge-dot me-1" style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: sc.color }} />{tab}</>}
            </button>
          );
        })}
      </div>

      <ErpDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        searchable
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search invoices..."
        emptyMessage="No invoices found."
        emptyIcon={faFileInvoiceDollar}
        isDark={isDark}
        title="Invoice Registry"
        titleIcon={faFileInvoiceDollar}
      />

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Invoice Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', borderRadius: '20px', background: (statusColors[viewItem.status] || statusColors.Draft).bg, color: (statusColors[viewItem.status] || statusColors.Draft).color }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: (statusColors[viewItem.status] || statusColors.Draft).color }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.number}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Customer: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.customer}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.date}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Due: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.due}</span></p>
                  </div>
                </div>
                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.customer}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1.1rem' }}>{formatCurrency(viewItem.amount)}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Currency</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.currency}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Terms</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.billingMethod || 'Net 30'} | Due by {viewItem.due}</p>
                </div>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-end gap-2" style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <button className="btn btn-sm px-3" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor }} onClick={() => setViewItem(null)}>Close</button>
                <button className="btn btn-sm px-3 text-white border-0" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }} onClick={() => { addNotification?.('Invoice email dispatched.', 'success'); setViewItem(null); }}><FontAwesomeIcon icon={faEnvelope} className="me-1" /> Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        itemName={deleteDialog.name || ''}
        confirmLabel="Delete"
      />
    </ErpPageShell>
  );
};

export default InvoiceGenerationCenter;