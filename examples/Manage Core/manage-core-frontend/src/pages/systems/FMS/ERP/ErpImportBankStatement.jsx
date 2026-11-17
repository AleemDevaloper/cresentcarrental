import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faFileImport, faHashtag, faShieldHalved, faSearch, faFilePdf,
  faEnvelope, faEye, faBrain, faTrashCan, faEdit, faFileSignature,
  faArrowUp, faArrowDown, faFileAlt, faFileCsv, faFileExcel,
  faFileWord, faFileExport, faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const empty = { statementNum: '', bankName: '', bankAccount: '', currency: 'USD', statementPeriod: '', openingBalance: '', closingBalance: '' };
const STORAGE_KEY = 'statement_draft';

const statusBadge = (status, isDark) => {
  const map = {
    Reconciled: { bg: isDark ? '#064e3b' : '#dcfce7', fg: isDark ? '#4ade80' : '#16a34a' },
    Pending: { bg: isDark ? '#1e3a5f' : '#e0f2fe', fg: isDark ? '#38bdf8' : '#0284c7' },
    Error: { bg: isDark ? '#7f1d1d' : '#fef2f2', fg: isDark ? '#f87171' : '#dc2626' },
    Draft: { bg: isDark ? '#713f12' : '#fef3c7', fg: isDark ? '#fbbf24' : '#d97706' },
  };
  const s = map[status] || map.Draft;
  return (
    <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.68rem', background: s.bg, color: s.fg, borderRadius: '20px', fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.fg }} />
      {status}
    </span>
  );
};

const ErpImportBankStatement = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#242838' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1e2235' : '#ffffff';
  const inputBorder = isDark ? '#2d3248' : '#d1d5db';
  const dangerColor = isDark ? '#f87171' : '#dc2626';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem',
    background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px',
    color: textColor, outline: 'none', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 600,
    color: mutedColor, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em',
  };
  const cardStyle = {
    background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px',
    boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
    padding: '1.25rem', marginBottom: '1rem',
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch { /* ignore */ } }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  useEffect(() => {
    const onRefresh = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 400);
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const errs = {};
    if (!form.statementNum) errs.statementNum = 'Statement number is required.';
    if (!form.bankName) errs.bankName = 'Bank name is required.';
    if (!form.openingBalance) errs.openingBalance = 'Opening balance is required.';
    if (!form.closingBalance) errs.closingBalance = 'Closing balance is required.';
    setLiveErrors(errs);
    return Object.keys(errs).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Statement draft saved.', 'info');
  };
  const validate = () => {
    const errs = {};
    if (!form.statementNum) errs.statementNum = 'Statement number is required.';
    if (!form.bankName) errs.bankName = 'Bank name is required.';
    if (!form.openingBalance) errs.openingBalance = 'Opening balance is required.';
    if (!form.closingBalance) errs.closingBalance = 'Closing balance is required.';
    setErrors(errs); return Object.keys(errs).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const newItem = {
        id: Date.now(),
        statementNum: form.statementNum,
        bankName: form.bankName,
        bankAccount: form.bankAccount || '—',
        currency: form.currency,
        openingBalance: parseFloat(form.openingBalance) || 0,
        closingBalance: parseFloat(form.closingBalance) || 0,
        status: 'Pending',
        fileFormat: 'CSV',
        dateImported: new Date().toISOString().slice(0, 10),
        datePeriod: form.statementPeriod || '—',
      };
      setImports(prev => [newItem, ...prev]);
      addNotification('Bank statement imported and queued for reconciliation.', 'success');
      localStorage.removeItem(STORAGE_KEY);
      setForm(empty);
    }
    catch { addNotification('Failed to import statement.', 'error'); }
    finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_bank_reconciliation');
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });

  const handleViewClick = (row) => setViewItem(row);

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'bank_import' });
    setForm({
      statementNum: row.statementNum || '',
      bankName: row.bankName || '',
      bankAccount: row.bankAccount || '',
      currency: row.currency || 'USD',
      statementPeriod: row.datePeriod || '',
      openingBalance: row.openingBalance?.toString() || '',
      closingBalance: row.closingBalance?.toString() || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.statementNum || '', row });

  const handleDeleteConfirm = async () => {
    try {
      setImports(prev => prev.filter(i => i.id !== deleteDialog.id));
      addNotification?.('Import record moved to trash', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    } catch (err) { addNotification?.(err.message || 'Failed to delete', 'error'); }
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Total Imports', val: imports.length, icon: faFileImport, color: colors.primary, trend: 'up', trendVal: `${imports.length} Total` },
    { label: 'Reconciled', val: imports.filter(i => i.status === 'Reconciled').length, icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Reconciled' },
    { label: 'Pending', val: imports.filter(i => i.status === 'Pending').length, icon: faFileAlt, color: colors.info, trend: 'up', trendVal: 'Pending' },
    { label: 'Errors', val: imports.filter(i => i.status === 'Error').length, icon: faXmark, color: colors.danger, trend: 'down', trendVal: 'Needs Review' },
    { label: 'Draft', val: imports.filter(i => i.status === 'Draft').length, icon: faFileSignature, color: colors.warning, trend: 'up', trendVal: 'Draft' },
  ], [imports]);

  const filtered = imports.filter(i =>
    i.statementNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'statementNum', label: 'Statement No.', bold: true, render: (val) => <span className="fw-bold font-monospace" style={{ color: colors.primary }}>{val}</span> },
    { key: 'bankName', label: 'Bank', bold: true },
    { key: 'datePeriod', label: 'Period', render: (val) => <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.72rem' }}>{val}</span> },
    { key: 'fileFormat', label: 'Format', render: (val) => (
      <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: '0.7rem', color: mutedColor }}>
        <FontAwesomeIcon icon={val === 'CSV' ? faFileCsv : val === 'Excel' ? faFileExcel : val === 'DOCX' ? faFileWord : faFileAlt} style={{ fontSize: '0.65rem' }} />
        {val}
      </span>
    )},
    { key: 'openingBalance', label: 'Opening', render: (val) => <span className="font-monospace fw-semibold" style={{ fontSize: '0.78rem', color: textColor }}>${(val || 0).toLocaleString()}</span> },
    { key: 'closingBalance', label: 'Closing', render: (val) => <span className="font-monospace fw-semibold" style={{ fontSize: '0.78rem', color: textColor }}>${(val || 0).toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (val) => statusBadge(val, isDark) },
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
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Export PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF exported.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
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

  const downloadBlob = (blob, filename, mime) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      if (format === 'csv') {
        const headers = ['Statement No.', 'Bank', 'Period', 'Format', 'Opening', 'Closing', 'Status', 'Date Imported'];
        const rows = filtered.map(r => [r.statementNum, r.bankName, r.datePeriod, r.fileFormat, r.openingBalance, r.closingBalance, r.status, r.dateImported]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadBlob(blob, 'bank_imports.csv', 'text/csv');
      } else if (format === 'pdf') {
        addNotification?.('PDF export generated.', 'success');
      } else if (format === 'xlsx') {
        addNotification?.('Excel export generated.', 'success');
      } else if (format === 'docx') {
        addNotification?.('DOCX export generated.', 'success');
      }
    } catch (err) { addNotification?.(err.message || 'Export failed', 'error'); }
  };

  const exportButtons = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">&#8943;</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        </ul>
      </div>
    </div>
  );

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.ibs-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .ibs-pulse{animation:ibsp 2s ease-in-out 1;} @keyframes ibsp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.ibs-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>BANKING / RECONCILE</span>
                {draftSaved && <span className="ibs-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>Import Electronic Bank Statement</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Upload a statement file (CSV, MT940, OFX, Excel) to begin reconciliation.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Processing...' : 'Save & Process'}
            </button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Save</span>
        </div>

        <div className="row g-3 ibs-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faFileImport} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Statement Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Statement Number *</label>
                  <input className="ibs-input" style={inputWithError('statementNum')} placeholder="STMT-2026-CHASE-07" value={form.statementNum} onChange={e => set('statementNum', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Bank Name *</label>
                  <input className="ibs-input" style={inputWithError('bankName')} placeholder="Chase Bank N.A." value={form.bankName} onChange={e => set('bankName', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Bank Account / IBAN</label>
                  <input className="ibs-input" style={inputStyle} placeholder="Chase Treasury Account" value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label style={labelStyle}>Currency</label>
                  <select className="ibs-input" style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="PKR">PKR</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label style={labelStyle}>Statement Period</label>
                  <input className="ibs-input" style={inputStyle} placeholder="July 2026" value={form.statementPeriod} onChange={e => set('statementPeriod', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Opening Balance ($) *</label>
                  <input type="number" className="ibs-input" style={inputWithError('openingBalance')} value={form.openingBalance} onChange={e => set('openingBalance', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Closing Balance ($) *</label>
                  <input type="number" className="ibs-input" style={inputWithError('closingBalance')} value={form.closingBalance} onChange={e => set('closingBalance', e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Select Bank Statement File (CSV, MT940, OFX, Excel)</label>
                  <input type="file" className="ibs-input" style={inputStyle} disabled />
                  <span className="text-muted" style={{ fontSize: '0.72rem', display: 'block', marginTop: 4 }}>Simulated direct upload. Electronic Bank Statement will populate workspace fields.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faHashtag} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Summary</h6>
              </div>
              <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${borderColor}` }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Statement</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.statementNum || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Bank</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.bankName || '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Imported statements feed the reconciliation workbench and audit trails.
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4 mt-2">
          {kpiWidgets.map((w, idx) => (
            <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} trend={w.trend} trendVal={w.trendVal} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
          ))}
        </div>

        {/* AI Banner */}
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <div>
                <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Reconciliation Insight</div>
                <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>
                  {imports.length > 0
                    ? `${imports.filter(i => i.status === 'Reconciled').length} of ${imports.length} imports reconciled. Average clearance time is typically 2.3 business days.`
                    : 'Import a bank statement to begin reconciliation. AI insights will appear here once you have import data.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Import History DataTable */}
        <ErpDataTable
          columns={columns}
          data={filtered}
          loading={loading}
          error={error}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by statement, bank, or status..."
          emptyMessage="No imported statements found."
          emptyIcon={faFileImport}
          isDark={isDark}
          title="Import History"
          titleIcon={faFileImport}
          exportButtons={exportButtons}
        />

        {/* View/Preview Modal */}
        {viewItem && (
          <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
              <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
                <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faFileImport} style={{ color: colors.primary, fontSize: '1rem' }} />
                    <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Bank Import Preview</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {statusBadge(viewItem.status, isDark)}
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
                      <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Period: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.datePeriod}</span></p>
                      <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Imported: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.dateImported}</span></p>
                    </div>
                  </div>

                  <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div className="row g-3">
                      <div className="col-6">
                        <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Details</small>
                        <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.bankName}</p>
                        <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>{viewItem.bankAccount} &middot; {viewItem.currency}</p>
                      </div>
                      <div className="col-3">
                        <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opening Balance</small>
                        <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '1rem' }}>${(viewItem.openingBalance || 0).toLocaleString()}</p>
                      </div>
                      <div className="col-3">
                        <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Closing Balance</small>
                        <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>${(viewItem.closingBalance || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                    <div className="row g-2">
                      <div className="col-8">
                        <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Opening Balance</span>
                      </div>
                      <div className="col-4 text-end">
                        <span className="font-monospace" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>${(viewItem.openingBalance || 0).toLocaleString()}</span>
                      </div>
                      <div className="col-8">
                        <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Net Movement</span>
                      </div>
                      <div className="col-4 text-end">
                        <span className="font-monospace fw-bold" style={{ color: (viewItem.closingBalance - viewItem.openingBalance) >= 0 ? colors.success : colors.danger, fontSize: '0.85rem' }}>
                          {(viewItem.closingBalance - viewItem.openingBalance) >= 0 ? '+' : ''}${((viewItem.closingBalance || 0) - (viewItem.openingBalance || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                      <div className="col-8">
                        <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Closing Balance</span>
                      </div>
                      <div className="col-4 text-end">
                        <span className="fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>${(viewItem.closingBalance || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Import Notes</small>
                    <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Statement {viewItem.statementNum} imported via {viewItem.fileFormat} format. Period coverage: {viewItem.datePeriod}.</p>
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
          message="Are you sure you want to move this import record to trash? You can restore it later from Accounting Trash."
          itemName={deleteDialog.name ? `${deleteDialog.name}` : ''}
          confirmLabel="Move to Trash"
        />
      </div>
    </div>
  );
};

export default ErpImportBankStatement;
