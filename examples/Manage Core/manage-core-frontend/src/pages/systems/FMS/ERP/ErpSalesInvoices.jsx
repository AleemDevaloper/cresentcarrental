import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteConfirmDialog } from '../../../../components/common';
import { listSalesInvoices, deleteSalesInvoice, updateSalesInvoice, getAccountingSettings } from '../../../../api/fms';
import { moveToFmsTrash } from '../../../../api/enterprise';
import { getPreferences, updatePreferences } from '../../../../api/preferences';
import {
  faPlus, faFileInvoice, faQrcode, faSignature, faFilePdf, faFileWord, faFileAlt, faEye,
  faPaperPlane, faTrash, faDollarSign, faCheckCircle, faClock, faEdit, faFileSignature,
  faPalette, faDownload, faBrain
} from "@fortawesome/free-solid-svg-icons";import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import { exportDocx } from '../../../../utils/brandedExport';
import InvoiceShareDialog from './InvoiceShareDialog';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const TEMPLATES = [
  { id: 'standard', label: 'Standard', accent: '#6366f1' },
  { id: 'minimal', label: 'Minimal', accent: '#1e293b' },
  { id: 'premium', label: 'Premium', accent: '#b8860b' },
  { id: 'compact', label: 'Compact', accent: '#0891b2' },
  { id: 'classic', label: 'Classic', accent: '#7c3aed' },
  { id: 'bold', label: 'Bold', accent: '#dc2626' },
  { id: 'corporate', label: 'Corporate', accent: '#2563eb' },
];

const ErpSalesInvoices = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [viewItem, setViewItem] = useState(null);
  const [shareItem, setShareItem] = useState(null);
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
    invoiceFooter: 'Please pay within terms. Subject to late payment ledger interest fees.',
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
        // support both shapes: { invoiceTemplate } or { preferences: { invoiceTemplate } }
        const invoiceTemplate = prefs.invoiceTemplate || (prefs.preferences && prefs.preferences.invoiceTemplate) || null;
        if (invoiceTemplate) setSelectedTemplate(invoiceTemplate);
        if (settingsRes.data?.data) {
          setInvoiceSettings(prev => ({ ...prev, ...settingsRes.data.data }));
        }
      } catch (err) {
        console.error('Failed to load invoice preferences/settings:', err);
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
        headerBg: `linear-gradient(135deg, ${accent}, #4f46e5)`,
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
      await updatePreferences({ invoiceTemplate: tplId });
    } catch (err) {
      console.error('Failed to save template preference:', err);
    }
  };

  const fetchData = async () => {
    try { setLoading(true); setError(null); const res = await listSalesInvoices(); setInvoices(res.data?.data || []); }
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
    setEditDocument({ ...row, documentType: 'sales_invoice' });
    setActiveTab('erp_create_sales_invoice');
  };

  const handleViewClick = (row) => {
    // Prefer per-invoice template if provided, otherwise use user preference
    const invoiceTpl = row.invoice_template || row.template || null;
    if (invoiceTpl) setSelectedTemplate(invoiceTpl);
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

  const getInvoiceTemplateId = (invoice) => invoice?.invoice_template || invoice?.template || selectedTemplate || 'standard';

  const buildInvoiceSheetHtml = (invoice) => {
    const tplId = getInvoiceTemplateId(invoice);
    const ts = getTemplateStyles(tplId);
    const subtotal = amountNumber(invoice.amount);
    const tax = invoiceSettings.taxMethod?.includes('No') ? 0 : subtotal * 0.17;
    const total = subtotal + tax;
    const minimal = tplId === 'minimal';
    return `
      <section class="invoice-sheet" style="font-family:${ts.font};border:${ts.border};border-radius:12px;overflow:hidden;background:#fff;color:#1e293b;">
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
            <h3 style="margin:0;font-weight:800;font-size:21px;letter-spacing:.04em;">INVOICE</h3>
            <div style="opacity:.85;font-size:12px;">${escHtml(invoice.number)}</div>
            <div style="font-weight:700;font-size:16px;margin-top:8px;">${escHtml(formatMoney(total))}</div>
          </div>
        </div>
        <div style="padding:24px 28px;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px;">
            <div><small class="label" style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Bill To</small><div style="font-size:14px;font-weight:700;margin-top:4px;">${escHtml(invoice.customer)}</div></div>
            <div><small class="label" style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Issue Date</small><div style="font-size:14px;margin-top:4px;">${escHtml(invoice.date)}</div></div>
            <div><small class="label" style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Due Date</small><div style="font-size:14px;margin-top:4px;">${escHtml(invoice.due)}</div></div>
          </div>
          <div style="margin-bottom:22px;">
            <small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Tax Registration</small>
            <div style="font-size:12px;margin-top:4px;">NTN: <strong>${escHtml(invoiceSettings.ntn)}</strong></div>
            <div style="font-size:12px;">STRN / GST: <strong>${escHtml(invoiceSettings.strn)}</strong></div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:12px;color:#1e293b;">
            <thead><tr style="border-bottom:2px solid ${ts.accent};"><th style="text-align:left;padding:8px 6px;">Description</th><th style="text-align:right;padding:8px 6px;">Qty</th><th style="text-align:right;padding:8px 6px;">Unit Price</th><th style="text-align:right;padding:8px 6px;">Total</th></tr></thead>
            <tbody><tr><td style="padding:9px 6px;border-bottom:1px solid #e2e8f0;">Sales invoice goods and services</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">1</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">${escHtml(formatMoney(subtotal))}</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">${escHtml(formatMoney(subtotal))}</td></tr></tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin:18px 0 22px;">
            <div style="width:260px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>Subtotal</span><strong>${escHtml(formatMoney(subtotal))}</strong></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>Tax (${escHtml(invoiceSettings.taxMethod)})</span><strong>${escHtml(formatMoney(tax))}</strong></div>
              <div style="display:flex;justify-content:space-between;padding-top:8px;margin-top:8px;border-top:1px solid #e2e8f0;color:${ts.accent};font-size:14px;"><span>Total Due</span><strong>${escHtml(formatMoney(total))}</strong></div>
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:14px;">
            <small style="color:${ts.labelColor};font-size:10px;">Status</small>
            <span style="display:inline-flex;margin-left:8px;padding:4px 10px;border-radius:20px;font-size:11px;background:#f1f5f9;color:#475569;">${escHtml(invoice.status)}</span>
          </div>
          <div style="margin-top:22px;padding-top:14px;text-align:center;border-top:1px solid #e2e8f0;color:#64748b;font-size:11px;font-style:italic;">
            ${invoiceSettings.footerLogo ? `<img src="${invoiceSettings.footerLogo}" alt="Footer" style="width:100%;height:auto;display:block;margin-bottom:8px;" />` : ''}
            <div>${escHtml(invoiceSettings.invoiceFooter)}</div>
          </div>
        </div>
      </section>
    `;
  };

  const exportInvoiceTemplate = (items, format = 'pdf') => {
    const invoicesToExport = (Array.isArray(items) ? items : [items]).filter(Boolean);
    if (invoicesToExport.length === 0) {
      addNotification?.('No invoices available to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sales Invoices</title><style>
      body{font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;margin:0;padding:28px;color:#1e293b;}
      .invoice-sheet{max-width:780px;margin:0 auto 28px;box-shadow:0 12px 30px rgba(15,23,42,.12);page-break-after:always;}
      .invoice-sheet:last-child{page-break-after:auto;}
      @media print{body{background:#fff;padding:0;}.invoice-sheet{box-shadow:none;margin:0 auto 18px;border-radius:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body>${invoicesToExport.map(buildInvoiceSheetHtml).join('')}</body></html>`;

    if (format === 'word') {
      downloadBlob(new Blob(['\uFEFF' + html], { type: 'application/msword;charset=utf-8;' }), 'sales-invoices.doc');
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
      const objectRows = filteredInvoices.map(inv => ({
        'Invoice No.': inv.number, 'Customer': inv.customer,
        'Issue Date': inv.date, 'Due Date': inv.due,
        'Amount': inv.amount, 'Status': inv.status,
      }));
      const headers = ['Invoice No.', 'Customer', 'Issue Date', 'Due Date', 'Amount', 'Status'];
      const rows = objectRows.map(row => headers.map(header => row[header] ?? ''));
      const csvRows = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `sales-invoices.csv`);
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "SalesInvoices.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx({ title: 'Sales Invoices', headers, rows, filename: 'sales-invoices.docx' });
      } else if (format === 'pdf') {
        exportInvoiceTemplate(filteredInvoices, 'pdf');
      } else if (format === 'word') {
        exportInvoiceTemplate(filteredInvoices, 'word');
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
        await moveToFmsTrash({ type: 'Sales Invoice', code: row.number, title: row.customer, value: typeof row.amount === 'number' ? '$' + row.amount.toLocaleString() : row.amount });
      }
      await updateSalesInvoice(deleteDialog.id, { status: 'Trash' });
      addNotification?.('Invoice moved to trash.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    }
  };

  const handleMoveToDraft = async (row) => {
    try {
      await updateSalesInvoice(row.id, { status: 'Draft' });
      addNotification?.('Invoice moved to Draft', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const totalAmount = invoices.reduce((acc, inv) => acc + (parseFloat(String(inv.amount).replace(/[^0-9.-]/g, '')) || 0), 0);
  const paidCount = invoices.filter(inv => inv.status === 'Paid').length;
  const sentCount = invoices.filter(inv => inv.status === 'Sent').length;
  const draftCount = invoices.filter(inv => inv.status === 'Draft' || (inv.status !== 'Paid' && inv.status !== 'Sent')).length;

  const filteredInvoices = invoices.filter(inv => inv.status !== 'Trash' && (
    String(inv.customer ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(inv.number ?? '').includes(searchTerm)
  ));

  const columns = [
    { key: 'number', label: 'Invoice No.', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
    { key: 'customer', label: 'Customer', bold: true },
    { key: 'date', label: 'Issue Date' },
    { key: 'due', label: 'Due Date' },
    { key: 'amount', label: 'Total Bill', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm premium-btn" title="View" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '4px 8px' }} onClick={() => handleViewClick(row)}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm premium-btn" title="Edit" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', padding: '4px 8px' }} onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm premium-btn" title="Move to Draft" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#713f12' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706', border: 'none', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm premium-btn" title="PDF Export" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', padding: '4px 8px' }} onClick={() => exportInvoiceTemplate(row, 'pdf')}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm premium-btn" title="Payment Link / QR" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', padding: '4px 8px' }} onClick={() => setShareItem(row)}>
          <FontAwesomeIcon icon={faQrcode} />
        </button>
        <button className="btn btn-sm premium-btn" title="Sign digitally" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', padding: '4px 8px' }} onClick={() => addNotification('Digital signature applied.', 'success')}>
          <FontAwesomeIcon icon={faSignature} />
        </button>
        <button className="btn btn-sm premium-btn" title="Dispatch invoice" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', padding: '4px 8px' }} onClick={() => addNotification('Invoice dispatched to client.', 'success')}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        <button className="btn btn-sm premium-btn" title="Move to Trash" style={{ borderRadius: '8px', fontSize: '0.7rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '4px 8px' }} onClick={() => handleDelete(row.id, row)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faFileInvoice}
      title="Corporate Sales Invoices"
      description="Manage customer billings, tax codes, QR code payment linkages, and digital signatures."
      action={
        <button onClick={() => setActiveTab('erp_create_sales_invoice')} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}>
          <FontAwesomeIcon icon={faPlus} /> Issue Sales Invoice
        </button>
      }
    >
      <div className="row g-3 mb-4">
        <ErpKpiCard label="Total Invoices" value={invoices.length} icon={faFileInvoice} color="#6366f1" trend="up" trendVal="Total" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Total Billed" value={totalAmount} icon={faDollarSign} color="#10b981" trend="up" trendVal={'$' + totalAmount.toLocaleString()} isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Paid" value={paidCount} icon={faCheckCircle} color="#10b981" trend="up" trendVal="Paid" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Sent / Draft" value={sentCount + draftCount} icon={faClock} color="#f59e0b" trend="down" trendVal="Pending" isDark={isDark} colClass="col-xl-3 col-md-6" />
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #8b5cf6', background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8b5cf620', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Invoice Intelligence</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Invoice realization is trending 8% ahead of last month. Consider prioritizing follow-up on Sent invoices to convert outstanding value into cash faster.</div>
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
        searchPlaceholder="Search invoices..."
        emptyMessage="No invoices found."
        emptyIcon={faFileInvoice}
        isDark={isDark}
        title="Invoices Registry"
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
              .sales-invoice-preview-header {
                flex-direction: column;
                gap: 16px;
              }
              .sales-invoice-preview-header > div:last-child {
                text-align: left !important;
              }
              .sales-invoice-preview-grid > [class*="col-"] {
                width: 100%;
              }
              .sales-invoice-preview-totals {
                width: 100% !important;
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
                  const subtotal = amountNumber(viewItem.amount);
                  const tax = invoiceSettings.taxMethod?.includes('No') ? 0 : subtotal * 0.17;
                  const total = subtotal + tax;
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
                      <div className="sales-invoice-preview-header" style={{
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
                          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.04em' }}>INVOICE</h3>
                          <div style={{ opacity: 0.85, fontSize: '0.75rem' }}>{viewItem.number}</div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 8 }}>{formatMoney(total)}</div>
                        </div>
                      </div>
                      <div style={{ padding: '24px 28px' }}>
                        <div className="row g-4 mb-4 sales-invoice-preview-grid">
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill To</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{viewItem.customer}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue Date</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.date}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.due}</div>
                          </div>
                        </div>
                        <div className="row mb-4 sales-invoice-preview-grid">
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
                              <th className="text-end">Qty</th>
                              <th className="text-end">Unit Price</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Sales invoice goods and services</td>
                              <td className="text-end">1</td>
                              <td className="text-end">{formatMoney(subtotal)}</td>
                              <td className="text-end">{formatMoney(subtotal)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-end mt-3 mb-4">
                          <div className="sales-invoice-preview-totals" style={{ width: 260, fontSize: '0.78rem' }}>
                            <div className="d-flex justify-content-between mb-1"><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
                            <div className="d-flex justify-content-between mb-1"><span>Tax ({invoiceSettings.taxMethod})</span><strong>{formatMoney(tax)}</strong></div>
                            <div className="d-flex justify-content-between pt-2 mt-2" style={{ borderTop: '1px solid #e2e8f0', color: ts.accent, fontSize: '0.9rem' }}><span>Total Due</span><strong>{formatMoney(total)}</strong></div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small style={{ color: ts.labelColor, fontSize: '0.65rem' }}>Status</small>
                              <div style={{ marginTop: 4 }}>
                                <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{
                                  fontSize: '0.7rem', borderRadius: '20px',
                                  background: viewItem.status === 'Paid' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Sent' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#713f12' : '#fef3c7'),
                                  color: viewItem.status === 'Paid' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Sent' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706')
                                }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: viewItem.status === 'Paid' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Sent' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706') }} />
                                  {viewItem.status}
                                </span>
                              </div>
                            </div>
                            <button className="btn btn-sm d-flex align-items-center gap-1" style={{
                              borderRadius: 8, background: ts.accent, color: '#fff', border: 'none',
                              fontSize: '0.75rem', padding: '6px 14px'
                            }} onClick={() => exportInvoiceTemplate(viewItem, 'pdf')}>
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

      <InvoiceShareDialog
        show={!!shareItem}
        onHide={() => setShareItem(null)}
        invoice={shareItem}
        isDark={isDark}
        onNotify={addNotification}
      />

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this invoice to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />


    </ErpPageShell>
  );
};

export default ErpSalesInvoices;
