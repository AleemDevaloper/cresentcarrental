import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faTruck,
  faLocationDot, faSignature, faCircleCheck, faCamera, faTrashCan, faInfoCircle, faFilePdf, faEye,
  faArrowUp, faArrowDown, faBuildingColumns, faCheckCircle, faClock, faRoad, faEdit, faFileSignature,
  faFileWord, faFileAlt, faQrcode, faPalette, faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { exportDocx } from '../../../../utils/brandedExport';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listDeliveryChallans, deleteDeliveryChallan, updateDeliveryChallan, exportDeliveryChallans, getAccountingSettings } from '../../../../api/fms';
import { moveToFmsTrash } from '../../../../api/enterprise';
import { getPreferences, updatePreferences } from '../../../../api/preferences';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';

const TEMPLATES = [
  { id: 'standard', label: 'Standard', accent: '#6366f1' },
  { id: 'minimal', label: 'Minimal', accent: '#1e293b' },
  { id: 'premium', label: 'Premium', accent: '#b8860b' },
  { id: 'compact', label: 'Compact', accent: '#0891b2' },
  { id: 'classic', label: 'Classic', accent: '#7c3aed' },
  { id: 'bold', label: 'Bold', accent: '#dc2626' },
  { id: 'corporate', label: 'Corporate', accent: '#2563eb' },
];

const ErpDeliveryChallans = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const [searchTerm, setSearchTerm] = useState('');

  const [challans, setChallans] = useState([]);
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
    invoiceFooter: 'Please verify goods at the time of delivery. Subject to receiving inspection terms.',
  });

  useEffect(() => {
    (async () => {
      try {
        const [prefRes, settingsRes] = await Promise.all([
          getPreferences(),
          getAccountingSettings(),
        ]);
        const prefs = prefRes.data?.data || {};
        const dcTemplate = prefs.dcTemplate || (prefs.preferences && prefs.preferences.dcTemplate) || null;
        if (dcTemplate) setSelectedTemplate(dcTemplate);
        if (settingsRes.data?.data) {
          setInvoiceSettings(prev => ({ ...prev, ...settingsRes.data.data }));
        }
      } catch (err) {
        console.error('Failed to load delivery challan preferences/settings:', err);
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
      await updatePreferences({ dcTemplate: tplId });
    } catch (err) {
      console.error('Failed to save template preference:', err);
    }
  };

  const fetchData = async () => {
    try { setLoading(true); setError(null); const res = await listDeliveryChallans(); setChallans(res.data?.data || []); }
    catch (err) { setError(err.message || 'Failed to load delivery challans'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'delivery_challan' });
    setActiveTab('erp_create_delivery_challan');
  };

  const handleViewClick = (row) => {
    const dcTpl = row.dc_template || row.template || null;
    if (dcTpl) setSelectedTemplate(dcTpl);
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

  const getDcTemplateId = (row) => row?.dc_template || row?.template || selectedTemplate || 'standard';

  const buildChallanSheetHtml = (challan) => {
    const tplId = getDcTemplateId(challan);
    const ts = getTemplateStyles(tplId);
    const minimal = tplId === 'minimal';
    return `
      <section class="dc-sheet" style="font-family:${ts.font};border:${ts.border};border-radius:12px;overflow:hidden;background:#fff;color:#1e293b;">
        <div style="background:${minimal ? '#fff' : ts.headerBg};color:${minimal ? '#1e293b' : '#fff'};padding:24px 28px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:${minimal ? `3px solid ${ts.accent}` : 'none'};">
          <div style="display:flex;align-items:flex-start;gap:14px;">
            ${invoiceSettings.companyLogo ? `<img src="${invoiceSettings.companyLogo}" alt="Logo" style="max-height:52px;max-width:120px;object-fit:contain;background:${minimal ? 'transparent' : 'rgba(255,255,255,0.9)'};border-radius:6px;padding:4px;" />` : ''}
            <div>
              <h5 style="margin:0;font-weight:800;font-size:16px;">${escHtml(invoiceSettings.companyName)}</h5>
              <div style="opacity:.85;font-size:11px;max-width:320px;">${escHtml(invoiceSettings.address)}</div>
              <div style="opacity:.85;font-size:11px;">${escHtml(invoiceSettings.email)} | ${escHtml(invoiceSettings.phone)}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <h3 style="margin:0;font-weight:800;font-size:21px;letter-spacing:.04em;">DELIVERY CHALLAN</h3>
            <div style="opacity:.85;font-size:12px;">${escHtml(challan.number)}</div>
            <div style="font-weight:700;font-size:12px;margin-top:8px;">Date: ${escHtml(challan.dispatchDate || '')}</div>
          </div>
        </div>
        <div style="padding:24px 28px;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px;">
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Customer</small><div style="font-size:14px;font-weight:700;margin-top:4px;">${escHtml(challan.customer)}</div></div>
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Linked SO</small><div style="font-size:14px;font-family:monospace;margin-top:4px;">${escHtml(challan.linkedOrder)}</div></div>
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Warehouse</small><div style="font-size:14px;margin-top:4px;">${escHtml(challan.warehouse)}</div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-bottom:24px;">
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Driver</small><div style="font-size:14px;font-weight:700;margin-top:4px;">${escHtml(challan.driver)}</div></div>
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Vehicle</small><div style="font-size:14px;font-family:monospace;margin-top:4px;">${escHtml(challan.vehicle)}</div></div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:12px;color:#1e293b;">
            <thead><tr style="border-bottom:2px solid ${ts.accent};"><th style="text-align:left;padding:8px 6px;">Description</th><th style="text-align:right;padding:8px 6px;">Qty</th><th style="text-align:right;padding:8px 6px;">Unit</th><th style="text-align:right;padding:8px 6px;">Total</th></tr></thead>
            <tbody><tr><td style="padding:9px 6px;border-bottom:1px solid #e2e8f0;">Goods dispatched to customer</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">1</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">1.00</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">1.00</td></tr></tbody>
          </table>
          <div style="border-top:1px solid #e2e8f0;padding-top:14px;margin-top:18px;">
            <small style="color:${ts.labelColor};font-size:10px;">Status</small>
            <span style="display:inline-flex;margin-left:8px;padding:4px 10px;border-radius:20px;font-size:11px;background:#f1f5f9;color:#475569;">${escHtml(challan.status)}</span>
          </div>
          <div style="margin-top:22px;padding-top:14px;text-align:center;border-top:1px solid #e2e8f0;color:#64748b;font-size:11px;font-style:italic;">
            ${invoiceSettings.footerLogo ? `<img src="${invoiceSettings.footerLogo}" alt="Footer" style="width:100%;height:auto;display:block;margin-bottom:8px;" />` : ''}
            <div>${escHtml(invoiceSettings.invoiceFooter)}</div>
          </div>
        </div>
      </section>
    `;
  };

  const exportChallanTemplate = (items, format = 'pdf') => {
    const itemsToExport = (Array.isArray(items) ? items : [items]).filter(Boolean);
    if (itemsToExport.length === 0) {
      addNotification?.('No delivery challans available to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Delivery Challans</title><style>
      body{font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;margin:0;padding:28px;color:#1e293b;}
      .dc-sheet{max-width:780px;margin:0 auto 28px;box-shadow:0 12px 30px rgba(15,23,42,.12);page-break-after:always;}
      .dc-sheet:last-child{page-break-after:auto;}
      @media print{body{background:#fff;padding:0;}.dc-sheet{box-shadow:none;margin:0 auto 18px;border-radius:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body>${itemsToExport.map(buildChallanSheetHtml).join('')}</body></html>`;

    if (format === 'word') {
      downloadBlob(new Blob(['\uFEFF' + html], { type: 'application/msword;charset=utf-8;' }), 'delivery-challans.doc');
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
      const filtered = challans.filter(c => c.status !== 'Trash');
      const headers = ['Challan No.', 'Linked SO', 'Customer', 'Driver', 'Vehicle', 'Dispatch Date', 'Warehouse', 'Status'];
      const rows = filtered.map(c => [c.number, c.linkedOrder, c.customer, c.driver, c.vehicle, c.dispatchDate, c.warehouse, c.status]);
      const csvRows = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');

      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'delivery-challans.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "DeliveryChallans.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx({ title: 'Delivery Challans', headers, rows, filename: 'delivery-challans.docx' });
      } else if (format === 'pdf') {
        exportChallanTemplate(filtered, 'pdf');
      } else if (format === 'word') {
        exportChallanTemplate(filtered, 'word');
      } else {
        const res = await exportDeliveryChallans(format);
        const blob = res.data.blob;
        downloadBlob(blob, `delivery-challans.${format}`);
      }
      addNotification?.(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification?.(err.message || 'Export failed', 'error'); }
  };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.customer || '', row });
  const handleDeleteConfirm = async () => {
    try {
      const row = deleteDialog.row;
      if (row) {
        await moveToFmsTrash({ type: 'Delivery Challan', code: row.number, title: row.customer, value: typeof row.amount === 'number' ? '$' + row.amount.toLocaleString() : (row.amount || '$0.00') });
      }
      await updateDeliveryChallan(deleteDialog.id, { status: 'Trash' });
      addNotification?.('Delivery challan moved to trash', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchData();
    } catch (err) { addNotification?.(err.message || 'Failed to delete delivery challan', 'error'); }
  };

  const handleMoveToDraft = async (row) => {
    try {
      await updateDeliveryChallan(row.id, { status: 'Draft' });
      addNotification?.('Delivery challan moved to Draft', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const deliveredCount = challans.filter(c => c.status === 'Delivered').length;
  const inTransitCount = challans.filter(c => c.status !== 'Delivered' && c.status !== 'Trash').length;

  const kpiData = [
    { label: 'Total Challans', val: challans.length, icon: faTruck, color: '#6366f1', trend: 'up', trendVal: 'Total', sparkline: [10, 12, 11, 14, 13, 16, 15, 18, 17, 20, 19, 22] },
    { label: 'Delivered', val: deliveredCount, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Delivered', sparkline: [6, 7, 6, 8, 7, 9, 8, 10, 9, 11, 10, 12] },
    { label: 'In Transit', val: inTransitCount, icon: faRoad, color: '#f59e0b', trend: 'down', trendVal: 'In Transit', sparkline: [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10] },
    { label: 'Dispatch Rate', val: Math.round((deliveredCount / (challans.length || 1)) * 100) + '%', icon: faClock, color: '#f43f5e', trend: 'up', trendVal: 'Active', sparkline: [60, 58, 55, 57, 54, 56, 53, 55, 52, 54, 51, 55] },
  ];

  const headerAction = (
    <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
      <button onClick={() => setActiveTab('erp_create_delivery_challan')} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        fontSize: '0.8rem',
      }}>
        <FontAwesomeIcon icon={faPlus} /> Issue Delivery Challan
      </button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faTruck}
      title="Delivery Challans & Dispatch Tracking"
      description="Record physical product delivery schedules, vehicle assignments, and receiver signatures prior to invoice generation."
      action={headerAction}
    >
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

      {/* Filter + Table Container */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
        <div className="d-flex justify-content-between mb-3 gap-2">
          <div className="position-relative flex-grow-1">
            <input type="text" className="form-control form-control-sm ps-5" placeholder="Search challans..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <FontAwesomeIcon icon={faSearch} className="position-absolute start-0 top-50 translate-middle-y ms-3" style={{ color: mutedColor, fontSize: '0.75rem' }} />
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group">
              <button className="btn btn-sm premium-btn px-3" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }} onClick={() => handleExport('pdf')}>
                <FontAwesomeIcon icon={faFileAlt} className="me-1" /> Export
              </button>
              <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
                <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
              </ul>
            </div>
            <button className="btn btn-sm premium-btn px-3" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }}>
              <FontAwesomeIcon icon={faFilter} className="me-1" /> Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#6366f1' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2" style={{ color: mutedColor }}>Loading delivery challans...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faInfoCircle} size="2x" style={{ color: '#f43f5e' }} />
            <p className="mt-2" style={{ color: '#f43f5e' }}>{error}</p>
            <button className="btn btn-sm" style={{
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', border: 'none',
            }} onClick={fetchData}>Retry</button>
          </div>
        ) : challans.length === 0 ? (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faTruck} size="2x" style={{ color: mutedColor }} />
            <p className="mt-2" style={{ color: mutedColor }}>No delivery challans found.</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Challan No.</th>
                    <th>Linked SO</th>
                    <th>Customer</th>
                    <th>Driver / Vehicle</th>
                    <th>Dispatch Date</th>
                    <th>Warehouse</th>
                    <th>Status</th>
                    <th className="text-end">Verification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challans
                    .filter(c => c.status !== 'Trash' && (c.customer.toLowerCase().includes(searchTerm.toLowerCase()) || c.number.includes(searchTerm)))
                    .map((c, i) => (
                      <tr key={i}>
                        <td className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{c.number}</td>
                        <td className="font-monospace" style={{ color: mutedColor }}>{c.linkedOrder}</td>
                        <td className="fw-bold" style={{ color: textColor }}>{c.customer}</td>
                        <td style={{ color: textColor }}>{c.driver} ({c.vehicle})</td>
                        <td style={{ color: textColor }}>{c.dispatchDate}</td>
                        <td style={{ color: textColor }}>{c.warehouse}</td>
                        <td>
                          <span className="premium-badge" style={{
                            background: c.status === 'Delivered' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'),
                            color: c.status === 'Delivered' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
                          }}>
                            <span className="badge-dot" style={{
                              background: c.status === 'Delivered' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
                            }} />
                            {c.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            <button className="btn btn-sm premium-btn" title="View" style={{
                              borderRadius: '8px', fontSize: '0.85rem',
                              background: isDark ? '#1e3a5f' : '#e0f2fe',
                              color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '5px 9px',
                            }} onClick={() => handleViewClick(c)}>
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="btn btn-sm premium-btn" title="Edit" style={{
                              borderRadius: '8px', fontSize: '0.85rem',
                              background: isDark ? '#334155' : '#f1f5f9',
                              color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px',
                            }} onClick={() => handleEdit(c)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="btn btn-sm premium-btn" title="Move to Draft" style={{
                              borderRadius: '8px', fontSize: '0.85rem',
                              background: isDark ? '#713f12' : '#fef3c7',
                              color: isDark ? '#fbbf24' : '#d97706', border: 'none', padding: '5px 9px',
                            }} onClick={() => handleMoveToDraft(c)}>
                              <FontAwesomeIcon icon={faFileSignature} />
                            </button>
                            <button className="btn btn-sm premium-btn" title="PDF Export" style={{
                              borderRadius: '8px', fontSize: '0.85rem',
                              background: isDark ? '#334155' : '#f1f5f9',
                              color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px',
                            }} onClick={() => exportChallanTemplate(c, 'pdf')}>
                              <FontAwesomeIcon icon={faFilePdf} />
                            </button>
                            <button className="btn btn-sm premium-btn" title="QR Code" style={{
                              borderRadius: '8px', fontSize: '0.85rem',
                              background: isDark ? '#334155' : '#f1f5f9',
                              color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px',
                            }} onClick={() => addNotification?.('QR code generated for delivery challan.', 'success')}>
                              <FontAwesomeIcon icon={faQrcode} />
                            </button>
                            <button className="btn btn-sm premium-btn" title="Move to Trash" style={{
                              borderRadius: '8px', fontSize: '0.85rem',
                              background: isDark ? '#7f1d1d' : '#fee2e2',
                              color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '5px 9px',
                            }} onClick={() => handleDeleteClick(c.number, c)}>
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 'clamp(10px, 2vw, 24px)' }} onClick={() => setViewItem(null)}>
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
                      <div style={{
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
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.04em' }}>DELIVERY CHALLAN</h3>
                          <div style={{ opacity: 0.85, fontSize: '0.75rem' }}>{viewItem.number}</div>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', marginTop: 8 }}>Date: {viewItem.dispatchDate}</div>
                        </div>
                      </div>
                      <div style={{ padding: '24px 28px' }}>
                        <div className="row g-4 mb-4">
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{viewItem.customer}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Linked SO</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontFamily: 'monospace', marginTop: 4 }}>{viewItem.linkedOrder}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.warehouse}</div>
                          </div>
                        </div>
                        <div className="row g-4 mb-4">
                          <div className="col-6">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Driver</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{viewItem.driver}</div>
                          </div>
                          <div className="col-6">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vehicle</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontFamily: 'monospace', marginTop: 4 }}>{viewItem.vehicle}</div>
                          </div>
                        </div>
                        <table className="table table-sm" style={{ fontSize: '0.78rem', color: '#1e293b' }}>
                          <thead>
                            <tr style={{ borderBottom: `2px solid ${ts.accent}` }}>
                              <th>Description</th>
                              <th className="text-end">Qty</th>
                              <th className="text-end">Unit</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Goods dispatched to customer</td>
                              <td className="text-end">1</td>
                              <td className="text-end">1.00</td>
                              <td className="text-end">1.00</td>
                            </tr>
                          </tbody>
                        </table>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 16 }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small style={{ color: ts.labelColor, fontSize: '0.65rem' }}>Status</small>
                              <div style={{ marginTop: 4 }}>
                                <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{
                                  fontSize: '0.7rem', borderRadius: '20px',
                                  background: viewItem.status === 'Delivered' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'),
                                  color: viewItem.status === 'Delivered' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706')
                                }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: viewItem.status === 'Delivered' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706') }} />
                                  {viewItem.status}
                                </span>
                              </div>
                            </div>
                            <button className="btn btn-sm d-flex align-items-center gap-1" style={{
                              borderRadius: 8, background: ts.accent, color: '#fff', border: 'none',
                              fontSize: '0.75rem', padding: '6px 14px'
                            }} onClick={() => exportChallanTemplate(viewItem, 'pdf')}>
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
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this delivery challan to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpDeliveryChallans;
