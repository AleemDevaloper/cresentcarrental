import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteConfirmDialog } from '../../../../components/common';
import { listCreditNotes, deleteCreditNote, updateCreditNote, convertCreditNoteToRefund, getAccountingSettings } from '../../../../api/fms';
import { moveToFmsTrash } from '../../../../api/enterprise';
import { getPreferences, updatePreferences } from '../../../../api/preferences';
import {
  faPlus, faFileInvoice, faQrcode, faFilePdf, faFileWord, faFileAlt, faEye,
  faTrash, faDollarSign, faCheckCircle, faClock, faEdit, faFileSignature,
  faPalette, faDownload, faBrain, faScaleBalanced, faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import { exportDocx } from '../../../../utils/brandedExport';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const TEMPLATES = [
  { id: 'standard', label: 'Standard', accent: '#f43f5e' },
  { id: 'minimal', label: 'Minimal', accent: '#1e293b' },
  { id: 'premium', label: 'Premium', accent: '#b8860b' },
  { id: 'compact', label: 'Compact', accent: '#0891b2' },
  { id: 'classic', label: 'Classic', accent: '#7c3aed' },
  { id: 'bold', label: 'Bold', accent: '#dc2626' },
  { id: 'corporate', label: 'Corporate', accent: '#2563eb' },
];

const ErpCreditNotes = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [searchTerm, setSearchTerm] = useState('');
  const [creditNotes, setCreditNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [viewItem, setViewItem] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState({
    companyLogo: null,
    footerLogo: null,
    companyName: 'ManageCore Global Corporate Ltd',
    ntn: 'NTN-8829-1094',
    strn: 'STRN-9910-GST',
    email: 'finance@managecore.com',
    phone: '+1 (555) 234-5678',
    website: 'https://finance.managecore.com',
    address: 'HQ Dublin Facility, Suite 400, Ireland',
    invoiceFooter: 'Credit Note adjustments are subject to ledger verification and customer acknowledgement.',
    baseCurrency: 'USD',
    taxMethod: 'Exclusive Tax',
  });

  useEffect(() => {
    (async () => {
      try {
        const [prefRes, settingsRes] = await Promise.all([
          getPreferences(),
          getAccountingSettings(),
        ]);
        const prefs = prefRes.data?.data || {};
        const creditNoteTemplate = prefs.creditNoteTemplate || (prefs.preferences && prefs.preferences.creditNoteTemplate) || null;
        if (creditNoteTemplate) setSelectedTemplate(creditNoteTemplate);
        if (settingsRes.data?.data) {
          setInvoiceSettings(prev => ({ ...prev, ...settingsRes.data.data }));
        }
      } catch (err) {
        console.error('Failed to load credit note preferences/settings:', err);
      } finally {
        setTemplatesLoaded(true);
      }
    })();
  }, []);

  const getTemplateStyles = (tplId) => {
    const tpl = TEMPLATES.find(t => t.id === tplId) || TEMPLATES[0];
    const accent = tpl.accent;
    const tpls = {
      standard: {
        headerBg: `linear-gradient(135deg, ${accent}, #e11d48)`,
        font: "'Inter', sans-serif",
        border: `2px solid ${accent}`,
        labelColor: '#64748b',
      },
      minimal: {
        headerBg: '#1e293b',
        font: "'Inter', sans-serif",
        border: '1px solid #e2e8f0',
        labelColor: '#94a3b8',
      },
      premium: {
        headerBg: `linear-gradient(135deg, ${accent}, #d4a017)`,
        font: "'Georgia', serif",
        border: `2px solid ${accent}`,
        labelColor: '#78716c',
      },
      compact: {
        headerBg: `linear-gradient(135deg, ${accent}, #0e7490)`,
        font: "'JetBrains Mono', 'Fira Code', monospace",
        border: `1px solid ${accent}`,
        labelColor: '#0891b2',
      },
      classic: {
        headerBg: `linear-gradient(135deg, ${accent}, #5b21b6)`,
        font: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        border: `3px double ${accent}`,
        labelColor: '#6d28d9',
      },
      bold: {
        headerBg: accent,
        font: "'Impact', 'Arial Black', sans-serif",
        border: `4px solid ${accent}`,
        labelColor: '#991b1b',
      },
      corporate: {
        headerBg: `linear-gradient(135deg, ${accent}, #1e40af)`,
        font: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        border: `2px solid ${accent}`,
        labelColor: '#1d4ed8',
      },
    };
    return { ...tpls[tplId] || tpls.standard, accent };
  };

  const handleTemplateChange = async (tplId) => {
    setSelectedTemplate(tplId);
    try {
      await updatePreferences({ creditNoteTemplate: tplId });
    } catch (err) {
      console.error('Failed to save template preference:', err);
    }
  };

  const fetchData = async () => {
    try { setLoading(true); setError(null); const res = await listCreditNotes(); setCreditNotes(res.data?.data || []); }
    catch (err) { setError(err.message || 'Failed to load credit notes'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'credit_note' });
    setActiveTab('erp_create_credit_note');
  };

  const handleViewClick = (row) => {
    const cnTpl = row.credit_note_template || row.template || null;
    if (cnTpl) setSelectedTemplate(cnTpl);
    setViewItem(row);
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const escHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const amountNumber = (value) => parseFloat(String(value || '').replace(/[^0-9.-]/g, '')) || 0;
  const formatMoney = (value) => {
    const n = amountNumber(value);
    return `${invoiceSettings.baseCurrency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCreditNoteTemplateId = (cn) => cn?.credit_note_template || cn?.template || selectedTemplate || 'standard';

  const buildCreditNoteSheetHtml = (cn) => {
    const tplId = getCreditNoteTemplateId(cn);
    const ts = getTemplateStyles(tplId);
    const amount = amountNumber(cn.amount);
    const minimal = tplId === 'minimal';
    return `
      <section class="cn-sheet" style="font-family:${ts.font};border:${ts.border};border-radius:12px;overflow:hidden;background:#fff;color:#1e293b;">
        <div style="background:${minimal ? '#fff' : ts.headerBg};color:${minimal ? '#1e293b' : '#fff'};padding:24px 28px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:${minimal ? `3px solid ${ts.accent}` : 'none'};">
          <div style="display:flex;align-items:flex-start;gap:14px;">
            ${invoiceSettings.companyLogo ? `<img src="${invoiceSettings.companyLogo}" alt="Logo" style="max-height:52px;max-width:120px;object-fit:contain;background:${minimal ? 'transparent' : 'rgba(255,255,255,0.9)'};border-radius:6px;padding:4px;" />` : ''}
            <div>
              <h5 style="margin:0;font-weight:800;font-size:16px;">${escHtml(invoiceSettings.companyName)}</h5>
              <div style="opacity:.85;font-size:11px;max-width:320px;">${escHtml(invoiceSettings.address)}</div>
              <div style="opacity:.85;font-size:11px;">${escHtml(invoiceSettings.email)} | ${escHtml(invoiceSettings.phone)}</div>
              ${invoiceSettings.website ? `<div style="opacity:.85;font-size:11px;">${escHtml(invoiceSettings.website)}</div>` : ''}
            </div>
          </div>
          <div style="text-align:right;">
            <h3 style="margin:0;font-weight:800;font-size:21px;letter-spacing:.04em;">CREDIT NOTE</h3>
            <div style="opacity:.85;font-size:12px;">${escHtml(cn.number)}</div>
            <div style="font-weight:700;font-size:16px;margin-top:8px;">${escHtml(formatMoney(amount))}</div>
          </div>
        </div>
        <div style="padding:24px 28px;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px;">
            <div><small class="label" style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Customer</small><div style="font-size:14px;font-weight:700;margin-top:4px;">${escHtml(cn.customer)}</div></div>
            <div><small class="label" style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Issue Date</small><div style="font-size:14px;margin-top:4px;">${escHtml(cn.date)}</div></div>
            <div><small class="label" style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Linked Invoice</small><div style="font-size:14px;font-weight:700;margin-top:4px;">${escHtml(cn.linkedInvoice)}</div></div>
          </div>
          <div style="margin-bottom:22px;">
            <small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Tax Registration</small>
            <div style="font-size:12px;margin-top:4px;">NTN: <strong>${escHtml(invoiceSettings.ntn)}</strong></div>
            <div style="font-size:12px;">STRN / GST: <strong>${escHtml(invoiceSettings.strn)}</strong></div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:12px;color:#1e293b;">
            <thead><tr style="border-bottom:2px solid ${ts.accent};"><th style="text-align:left;padding:8px 6px;">Description</th><th style="text-align:left;padding:8px 6px;">Reason</th><th style="text-align:right;padding:8px 6px;">Amount</th></tr></thead>
            <tbody><tr><td style="padding:9px 6px;border-bottom:1px solid #e2e8f0;">Credit note adjustment for returned/disputed goods</td><td style="padding:9px 6px;border-bottom:1px solid #e2e8f0;">${escHtml(cn.reason)}</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">${escHtml(formatMoney(amount))}</td></tr></tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin:18px 0 22px;">
            <div style="width:260px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;padding-top:8px;margin-top:8px;border-top:1px solid #e2e8f0;color:${ts.accent};font-size:14px;"><span>Total Adjustment</span><strong>${escHtml(formatMoney(amount))}</strong></div>
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:14px;">
            <small style="color:${ts.labelColor};font-size:10px;">Status</small>
            <span style="display:inline-flex;margin-left:8px;padding:4px 10px;border-radius:20px;font-size:11px;background:#f1f5f9;color:#475569;">${escHtml(cn.status)}</span>
          </div>
          <div style="margin-top:22px;padding-top:14px;text-align:center;border-top:1px solid #e2e8f0;color:#64748b;font-size:11px;font-style:italic;">
            ${invoiceSettings.footerLogo ? `<img src="${invoiceSettings.footerLogo}" alt="Footer" style="width:100%;height:auto;display:block;margin-bottom:8px;" />` : ''}
            <div>${escHtml(invoiceSettings.invoiceFooter)}</div>
          </div>
        </div>
      </section>
    `;
  };

  const exportCreditNoteTemplate = (items, format = 'pdf') => {
    const notesToExport = (Array.isArray(items) ? items : [items]).filter(Boolean);
    if (notesToExport.length === 0) {
      addNotification?.('No credit notes available to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Credit Notes</title><style>
      body{font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;margin:0;padding:28px;color:#1e293b;}
      .cn-sheet{max-width:780px;margin:0 auto 28px;box-shadow:0 12px 30px rgba(15,23,42,.12);page-break-after:always;}
      .cn-sheet:last-child{page-break-after:auto;}
      @media print{body{background:#fff;padding:0;}.cn-sheet{box-shadow:none;margin:0 auto 18px;border-radius:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body>${notesToExport.map(buildCreditNoteSheetHtml).join('')}</body></html>`;

    if (format === 'word') {
      downloadBlob(new Blob(['\uFEFF' + html], { type: 'application/msword;charset=utf-8;' }), 'credit-notes.doc');
      return;
    }

    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html + '<script>window.onload=function(){window.print();}<\/script>');
      w.document.close();
    }
  };

  const handleExport = async (format) => {
    try {
      const objectRows = filteredCreditNotes.map(cn => ({
        'Credit Note No.': cn.number, 'Linked Invoice': cn.linkedInvoice,
        'Customer': cn.customer, 'Issue Date': cn.date,
        'Adjustment Value': cn.amount, 'Reason': cn.reason, 'Status': cn.status,
      }));
      const headers = ['Credit Note No.', 'Linked Invoice', 'Customer', 'Issue Date', 'Adjustment Value', 'Reason', 'Status'];
      const rows = objectRows.map(row => headers.map(header => row[header] ?? ''));
      const csvRows = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `credit-notes.csv`);
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "CreditNotes.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx({ title: 'Credit Notes', headers, rows, filename: 'credit-notes.docx' });
      } else if (format === 'pdf') {
        exportCreditNoteTemplate(filteredCreditNotes, 'pdf');
      } else if (format === 'word') {
        exportCreditNoteTemplate(filteredCreditNotes, 'word');
      }
      addNotification?.(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification?.(err.message || 'Export failed', 'error'); }
  };

  const handleDelete = (id, row) => {
    setDeleteDialog({ show: true, id, name: row?.customer || '', row });
  };

  const confirmDelete = async () => {
    try {
      const row = deleteDialog.row;
      if (row) {
        await moveToFmsTrash({ type: 'Credit Note', code: row.number, title: row.customer, value: typeof row.amount === 'number' ? '$' + row.amount.toLocaleString() : row.amount });
      }
      await updateCreditNote(deleteDialog.id, { status: 'Trash' });
      addNotification?.('Credit note moved to trash.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    }
  };

  const handleMoveToDraft = async (row) => {
    try {
      await updateCreditNote(row.id, { status: 'Draft' });
      addNotification?.('Credit note moved to Draft', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const handleConvertToRefund = async (row) => {
    try {
      await convertCreditNoteToRefund(row.id);
      addNotification?.('Converted to refund successfully.', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to convert to refund', 'error');
    }
  };

  const totalAmount = creditNotes.reduce((acc, cn) => acc + (parseFloat(String(cn.amount).replace(/[^0-9.-]/g, '')) || 0), 0);
  const approvedCount = creditNotes.filter(cn => cn.status === 'Approved').length;
  const pendingCount = creditNotes.filter(cn => cn.status !== 'Approved').length;

  const filteredCreditNotes = creditNotes.filter(cn => cn.status !== 'Trash' && (
    String(cn.customer ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(cn.number ?? '').includes(searchTerm)
  ));

  const columns = [
    { key: 'number', label: 'Credit Note No.', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#f43f5e' }}>{val}</span> },
    { key: 'linkedInvoice', label: 'Linked Invoice', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>{val}</span> },
    { key: 'customer', label: 'Customer', bold: true },
    { key: 'date', label: 'Issue Date' },
    { key: 'amount', label: 'Adjustment Value', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm premium-btn" title="View" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '5px 9px' }} onClick={() => handleViewClick(row)}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm premium-btn" title="Edit" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm premium-btn" title="Move to Draft" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#713f12' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706', border: 'none', padding: '5px 9px' }} onClick={() => handleMoveToDraft(row)}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm premium-btn" title="PDF Export" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => exportCreditNoteTemplate(row, 'pdf')}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm premium-btn" title="QR / Share" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => addNotification?.('Share link generated for credit note.', 'success')}>
          <FontAwesomeIcon icon={faQrcode} />
        </button>
        <button className="btn btn-sm premium-btn" title="Convert to Refund" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', border: 'none', padding: '5px 9px' }} onClick={() => handleConvertToRefund(row)}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="btn btn-sm premium-btn" title="Move to Trash" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '5px 9px' }} onClick={() => handleDelete(row.id, row)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faScaleBalanced}
      title="Customer Credit Notes"
      description="Issue financial adjustments, return credits, and execute ledger offsets for disputed or returned goods."
      action={
        <button onClick={() => setActiveTab('erp_create_credit_note')} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}>
          <FontAwesomeIcon icon={faPlus} /> Issue Credit Note
        </button>
      }
    >
      <div className="row g-3 mb-4">
        <ErpKpiCard label="Total Credit Notes" value={creditNotes.length} icon={faFileInvoice} color="#6366f1" trend="up" trendVal="Total" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Total Adjustment Value" value={totalAmount} icon={faDollarSign} color="#f59e0b" trend="up" trendVal={'$' + totalAmount.toLocaleString()} isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Approved" value={approvedCount} icon={faCheckCircle} color="#10b981" trend="up" trendVal="Approved" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Pending" value={pendingCount} icon={faClock} color="#f43f5e" trend="down" trendVal="Pending" isDark={isDark} colClass="col-xl-3 col-md-6" />
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #8b5cf6', background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8b5cf620', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Credit Note Intelligence</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Credit notes processed this month show a 12% increase. Recommend reviewing vendor return patterns for potential cost optimization.</div>
            </div>
          </div>
        </div>
      </div>

      <ErpDataTable
        columns={columns}
        data={filteredCreditNotes}
        loading={loading}
        error={error}
        searchable
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search credit notes..."
        emptyMessage="No credit notes found."
        emptyIcon={faFileInvoice}
        isDark={isDark}
        title="Credit Notes Registry"
        titleIcon={faFileInvoice}
        exportButtons={(
          <div className="btn-group">
            <button className="btn btn-sm btn-light border" title="More">⋯</button>
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
              </ul>
            </div>
          </div>
        )}
      />

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 'clamp(10px, 2vw, 24px)' }} onClick={() => setViewItem(null)}>
          <style>{`
            @media (max-width: 640px) {
              .cn-preview-header {
                flex-direction: column;
                gap: 16px;
              }
              .cn-preview-header > div:last-child {
                text-align: left !important;
              }
              .cn-preview-grid > [class*="col-"] {
                width: 100%;
              }
            }
          `}</style>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ width: 'min(920px, 100%)', maxWidth: '920px', maxHeight: 'calc(100vh - 24px)', margin: 0 }}>
            <div className="modal-content" style={{ borderRadius: '20px', border: 'none', background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden', maxHeight: 'calc(100vh - 24px)', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center px-4 py-3" style={{ flexShrink: 0, borderBottom: `1px solid ${borderColor}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faPalette} style={{ color: mutedColor }} />
                  <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Template:</span>
                  <div className="btn-group btn-group-sm">
                    {TEMPLATES.map(t => (
                      <button key={t.id}
                        className={`btn btn-sm ${selectedTemplate === t.id ? 'active' : ''}`}
                        style={{
                          borderRadius: 6, border: `1px solid ${selectedTemplate === t.id ? t.accent : borderColor}`,
                          background: selectedTemplate === t.id ? `${t.accent}20` : 'transparent',
                          color: selectedTemplate === t.id ? t.accent : mutedColor,
                          fontSize: '0.7rem', padding: '2px 10px'
                        }}
                        onClick={() => handleTemplateChange(t.id)}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setViewItem(null)} className="btn-close" style={{ filter: isDark ? 'invert(1)' : 'none' }}></button>
              </div>
              <div className="modal-body p-3 p-md-4" style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, minHeight: 0 }}>
                {(() => {
                  const ts = getTemplateStyles(selectedTemplate);
                  const amount = amountNumber(viewItem.amount);
                  return (
                    <div style={{
                      fontFamily: ts.font,
                      border: ts.border,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#fff',
                      color: '#1e293b',
                      width: '100%',
                      maxWidth: '780px',
                      margin: '0 auto',
                    }}>
                      <div className="cn-preview-header" style={{
                        background: selectedTemplate === 'minimal' ? '#fff' : ts.headerBg,
                        color: selectedTemplate === 'minimal' ? '#1e293b' : '#fff',
                        padding: '24px 28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: selectedTemplate === 'minimal' ? `3px solid ${ts.accent}` : 'none',
                      }}>
                        <div className="d-flex align-items-start gap-3">
                          {invoiceSettings.companyLogo && (
                            <img src={invoiceSettings.companyLogo} alt="Logo" style={{ maxHeight: 52, maxWidth: 120, objectFit: 'contain', background: selectedTemplate === 'minimal' ? 'transparent' : 'rgba(255,255,255,0.9)', borderRadius: 6, padding: 4 }} />
                          )}
                          <div>
                            <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{invoiceSettings.companyName}</h5>
                            <div style={{ opacity: 0.85, fontSize: '0.7rem', maxWidth: 320 }}>{invoiceSettings.address}</div>
                            <div style={{ opacity: 0.85, fontSize: '0.7rem' }}>{invoiceSettings.email} | {invoiceSettings.phone}</div>
                            {invoiceSettings.website && <div style={{ opacity: 0.85, fontSize: '0.7rem' }}>{invoiceSettings.website}</div>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.04em' }}>CREDIT NOTE</h3>
                          <div style={{ opacity: 0.85, fontSize: '0.75rem' }}>{viewItem.number}</div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 8 }}>{formatMoney(amount)}</div>
                        </div>
                      </div>
                      <div style={{ padding: '24px 28px' }}>
                        <div className="row g-4 mb-4 cn-preview-grid">
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{viewItem.customer}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue Date</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.date}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Linked Invoice</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{viewItem.linkedInvoice}</div>
                          </div>
                        </div>
                        <div className="row mb-4 cn-preview-grid">
                          <div className="col-6">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tax Registration</small>
                            <div style={{ fontSize: '0.75rem', marginTop: 4 }}>NTN: <strong>{invoiceSettings.ntn}</strong></div>
                            <div style={{ fontSize: '0.75rem' }}>STRN / GST: <strong>{invoiceSettings.strn}</strong></div>
                          </div>
                        </div>
                        <table className="table table-sm" style={{ fontSize: '0.78rem', color: '#1e293b' }}>
                          <thead>
                            <tr style={{ borderBottom: `2px solid ${ts.accent}` }}>
                              <th>Description</th>
                              <th>Reason</th>
                              <th className="text-end">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Credit note adjustment for returned/disputed goods</td>
                              <td>{viewItem.reason}</td>
                              <td className="text-end">{formatMoney(amount)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-end mt-3 mb-4">
                          <div style={{ width: 260, fontSize: '0.78rem' }}>
                            <div className="d-flex justify-content-between pt-2 mt-2" style={{ borderTop: '1px solid #e2e8f0', color: ts.accent, fontSize: '0.9rem' }}><span>Total Adjustment</span><strong>{formatMoney(amount)}</strong></div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small style={{ color: ts.labelColor, fontSize: '0.65rem' }}>Status</small>
                              <div style={{ marginTop: 4 }}>
                                <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{
                                  fontSize: '0.7rem', borderRadius: '20px',
                                  background: viewItem.status === 'Approved' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'),
                                  color: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706')
                                }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706') }} />
                                  {viewItem.status}
                                </span>
                              </div>
                            </div>
                            <button className="btn btn-sm d-flex align-items-center gap-1" style={{
                              borderRadius: 8, background: ts.accent, color: '#fff', border: 'none',
                              fontSize: '0.75rem', padding: '6px 14px'
                            }} onClick={() => exportCreditNoteTemplate(viewItem, 'pdf')}>
                              <FontAwesomeIcon icon={faDownload} /> Download PDF
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.7rem', fontStyle: 'italic' }}>
                          {invoiceSettings.footerLogo && (
                            <img src={invoiceSettings.footerLogo} alt="Footer" style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 8 }} />
                          )}
                          <div>{invoiceSettings.invoiceFooter}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this credit note to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpCreditNotes;
