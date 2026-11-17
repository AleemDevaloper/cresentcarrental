import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faClipboardList, faTruck, faEye,
  faArrowUp, faArrowDown, faInfoCircle,
  faFileInvoiceDollar, faClock, faCheckCircle, faTrashCan, faEdit, faFileSignature, faFileWord, faFileAlt, faBrain,
  faQrcode, faFilePdf, faPalette, faDownload, faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../../components/common';
import ShareQrButton from '../../../../components/common/ShareQrButton';
import { listSalesOrders, deleteSalesOrder, updateSalesOrder, exportSalesOrders, getAccountingSettings } from '../../../../api/fms';
import { exportDocx } from '../../../../utils/brandedExport';
import { getPreferences, updatePreferences } from '../../../../api/preferences';
import { moveToFmsTrash } from '../../../../api/enterprise';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
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

const ErpSalesOrders = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const colors = { primary: '#6366f1', success: '#10b981', danger: '#f43f5e', warning: '#f59e0b', info: '#06b6d4' };

  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [viewItem, setViewItem] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [orderSettings, setOrderSettings] = useState({
    companyLogo: null,
    footerLogo: null,
    companyName: 'ManageCore Global Corporate Ltd',
    ntn: 'NTN-8829-1094',
    strn: 'STRN-9910-GST',
    email: 'finance@managecore.com',
    phone: '+1 (555) 234-5678',
    website: 'https://finance.managecore.com',
    address: 'HQ Dublin Facility, Suite 400, Ireland',
    orderFooter: 'Order subject to availability and confirmation. Please review delivery terms.',
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
        const orderTemplate = prefs.salesOrderTemplate || (prefs.preferences && prefs.preferences.salesOrderTemplate) || null;
        if (orderTemplate) setSelectedTemplate(orderTemplate);
        if (settingsRes.data?.data) {
          setOrderSettings(prev => ({ ...prev, ...settingsRes.data.data }));
        }
      } catch (err) {
        console.error('Failed to load order preferences/settings:', err);
      }
    })();
  }, []);

  const fetchData = async () => {
    try { setLoading(true); setError(null); const res = await listSalesOrders(); setOrders(res.data?.data || []); }
    catch (err) { setError(err.message || 'Failed to load sales orders'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'sales_order' });
    setActiveTab('erp_create_sales_order');
  };

  const handleViewClick = (row) => {
    const orderTpl = row.sales_order_template || row.template || null;
    if (orderTpl) setSelectedTemplate(orderTpl);
    setViewItem(row);
  };

  const handleTemplateChange = async (tplId) => {
    setSelectedTemplate(tplId);
    try {
      await updatePreferences({ salesOrderTemplate: tplId });
    } catch (err) {
      console.error('Failed to save template preference:', err);
    }
  };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.customer || '', row });
  const handleDeleteConfirm = async () => {
    try {
      const row = deleteDialog.row;
      if (row) {
        await moveToFmsTrash({ type: 'Sales Order', code: row.number, title: row.customer, value: typeof row.amount === 'number' ? '$' + row.amount.toLocaleString() : row.amount });
      }
      await updateSalesOrder(deleteDialog.id, { status: 'Trash' });
      addNotification?.('Sales order moved to trash', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchData();
    } catch (err) { addNotification?.(err.message || 'Failed to delete sales order', 'error'); }
  };

  const handleMoveToDraft = async (row) => {
    try {
      await updateSalesOrder(row.id, { status: 'Draft' });
      addNotification?.('Sales order moved to Draft', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const handleConvertToInvoice = (row) => {
    setEditDocument({
      ...row,
      documentType: 'sales_invoice',
      sourceType: 'sales_order',
      sourceNumber: row.number,
    });
    setActiveTab('erp_create_sales_invoice');
    addNotification?.(`Converting ${row.number} to sales invoice...`, 'info');
  };

  const filteredOrders = orders.filter(o => o.status !== 'Trash' && (String(o.customer ?? '').toLowerCase().includes(searchTerm.toLowerCase()) || String(o.number ?? '').includes(searchTerm)));

  const columns = [
    { key: 'number', label: 'Order No.', render: (val) => <span className="fw-bold font-monospace" style={{ color: colors.primary }}>{val}</span> },
    { key: 'customer', label: 'Customer', bold: true },
    { key: 'warehouse', label: 'Warehouse', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'deliveryDate', label: 'Est. Delivery', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'amount', label: 'Total Value', render: (val) => <span className="fw-bold font-monospace" style={{ color: textColor }}>{val}</span> },
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
        <button className="btn btn-sm premium-btn" title="PDF Export" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => exportOrderTemplate(row, 'pdf')}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <ShareQrButton entityType="sales_order" entityId={row.id} label={`${row.number} · ${row.customer}`} isDark={isDark} onNotify={addNotification} />
        {row.status === 'Approved' && (
          <>
            <button className="btn btn-sm premium-btn" title="Convert to Sales Invoice" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => handleConvertToInvoice(row)}>
              <FontAwesomeIcon icon={faFileInvoice} />
            </button>
            <button className="btn btn-sm premium-btn" title="Convert to Delivery Challan" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', padding: '5px 9px' }} onClick={() => addNotification?.('Converted to Delivery Challan.', 'success')}>
              <FontAwesomeIcon icon={faTruck} />
            </button>
          </>
        )}
        <button className="btn btn-sm premium-btn" title="Move to Trash" style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '5px 9px' }} onClick={() => handleDeleteClick(row.id, row)}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const actionButtons = (
    <button onClick={() => setActiveTab('erp_create_sales_order')} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}>
      <FontAwesomeIcon icon={faPlus} /> Create Sales Order
    </button>
  );

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
    return `${orderSettings.baseCurrency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getOrderTemplateId = (order) => order?.sales_order_template || order?.template || selectedTemplate || 'standard';

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
    return { ...(tpls[tplId] || tpls.standard), accent };
  };

  const buildOrderSheetHtml = (order) => {
    const tplId = getOrderTemplateId(order);
    const ts = getTemplateStyles(tplId);
    const subtotal = amountNumber(order.amount);
    const tax = orderSettings.taxMethod?.includes('No') ? 0 : subtotal * 0.17;
    const total = subtotal + tax;
    const minimal = tplId === 'minimal';
    return `
      <section class="order-sheet" style="font-family:${ts.font};border:${ts.border};border-radius:12px;overflow:hidden;background:#fff;color:#1e293b;">
        <div style="background:${minimal ? '#fff' : ts.headerBg};color:${minimal ? '#1e293b' : '#fff'};padding:24px 28px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:${minimal ? `3px solid ${ts.accent}` : 'none'};">
          <div style="display:flex;align-items:flex-start;gap:14px;">
            ${orderSettings.companyLogo ? `<img src="${orderSettings.companyLogo}" alt="Logo" style="max-height:52px;max-width:120px;object-fit:contain;background:${minimal ? 'transparent' : 'rgba(255,255,255,0.9)'};border-radius:6px;padding:4px;" />` : ''}
            <div>
              <h5 style="margin:0;font-weight:800;font-size:16px;">${escHtml(orderSettings.companyName)}</h5>
              <div style="opacity:.85;font-size:11px;max-width:320px;">${escHtml(orderSettings.address)}</div>
              <div style="opacity:.85;font-size:11px;">${escHtml(orderSettings.email)} | ${escHtml(orderSettings.phone)}</div>
              ${orderSettings.website ? `<div style="opacity:.85;font-size:11px;">${escHtml(orderSettings.website)}</div>` : ''}
            </div>
          </div>
          <div style="text-align:right;">
            <h3 style="margin:0;font-weight:800;font-size:21px;letter-spacing:.04em;">SALES ORDER</h3>
            <div style="opacity:.85;font-size:12px;">${escHtml(order.number)}</div>
            <div style="font-weight:700;font-size:16px;margin-top:8px;">${escHtml(formatMoney(total))}</div>
          </div>
        </div>
        <div style="padding:24px 28px;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px;">
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Customer</small><div style="font-size:14px;font-weight:700;margin-top:4px;">${escHtml(order.customer)}</div></div>
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Order Date</small><div style="font-size:14px;margin-top:4px;">${escHtml(order.date || '')}</div></div>
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Est. Delivery</small><div style="font-size:14px;margin-top:4px;">${escHtml(order.deliveryDate || '')}</div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-bottom:24px;">
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Warehouse</small><div style="font-size:14px;margin-top:4px;">${escHtml(order.warehouse || '')}</div></div>
            <div><small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Status</small><div style="font-size:14px;margin-top:4px;">${escHtml(order.status || '')}</div></div>
          </div>
          <div style="margin-bottom:22px;">
            <small style="color:${ts.labelColor};font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Tax Registration</small>
            <div style="font-size:12px;margin-top:4px;">NTN: <strong>${escHtml(orderSettings.ntn)}</strong></div>
            <div style="font-size:12px;">STRN / GST: <strong>${escHtml(orderSettings.strn)}</strong></div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:12px;color:#1e293b;">
            <thead><tr style="border-bottom:2px solid ${ts.accent};"><th style="text-align:left;padding:8px 6px;">Description</th><th style="text-align:right;padding:8px 6px;">Qty</th><th style="text-align:right;padding:8px 6px;">Unit Price</th><th style="text-align:right;padding:8px 6px;">Total</th></tr></thead>
            <tbody><tr><td style="padding:9px 6px;border-bottom:1px solid #e2e8f0;">Sales order goods and services</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">1</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">${escHtml(formatMoney(subtotal))}</td><td style="text-align:right;padding:9px 6px;border-bottom:1px solid #e2e8f0;">${escHtml(formatMoney(subtotal))}</td></tr></tbody>
          </table>
          <div style="display:flex;justify-content:flex-end;margin:18px 0 22px;">
            <div style="width:260px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>Subtotal</span><strong>${escHtml(formatMoney(subtotal))}</strong></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>Tax (${escHtml(orderSettings.taxMethod)})</span><strong>${escHtml(formatMoney(tax))}</strong></div>
              <div style="display:flex;justify-content:space-between;padding-top:8px;margin-top:8px;border-top:1px solid #e2e8f0;color:${ts.accent};font-size:14px;"><span>Total Value</span><strong>${escHtml(formatMoney(total))}</strong></div>
            </div>
          </div>
          <div style="margin-top:22px;padding-top:14px;text-align:center;border-top:1px solid #e2e8f0;color:#64748b;font-size:11px;font-style:italic;">
            ${orderSettings.footerLogo ? `<img src="${orderSettings.footerLogo}" alt="Footer" style="width:100%;height:auto;display:block;margin-bottom:8px;" />` : ''}
            <div>${escHtml(orderSettings.orderFooter)}</div>
          </div>
        </div>
      </section>
    `;
  };

  const exportOrderTemplate = (items, format = 'pdf') => {
    const ordersToExport = (Array.isArray(items) ? items : [items]).filter(Boolean);
    if (ordersToExport.length === 0) {
      addNotification?.('No sales orders available to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sales Orders</title><style>
      body{font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;margin:0;padding:28px;color:#1e293b;}
      .order-sheet{max-width:780px;margin:0 auto 28px;box-shadow:0 12px 30px rgba(15,23,42,.12);page-break-after:always;}
      .order-sheet:last-child{page-break-after:auto;}
      @media print{body{background:#fff;padding:0;}.order-sheet{box-shadow:none;margin:0 auto 18px;border-radius:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body>${ordersToExport.map(buildOrderSheetHtml).join('')}</body></html>`;

    if (format === 'word') {
      downloadBlob(new Blob(['\uFEFF' + html], { type: 'application/msword;charset=utf-8;' }), 'sales-orders.doc');
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
      const objectRows = filteredOrders.map(o => ({
        'Order No.': o.number, 'Customer': o.customer, 'Warehouse': o.warehouse,
        'Est. Delivery': o.deliveryDate, 'Total Value': o.amount, 'Status': o.status,
      }));
      const headers = ['Order No.', 'Customer', 'Warehouse', 'Est. Delivery', 'Total Value', 'Status'];
      const rows = objectRows.map(row => headers.map(header => row[header] ?? ''));
      const csvRows = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `sales-orders.csv`);
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "SalesOrders.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx({ title: 'Sales Orders', headers, rows, filename: 'sales-orders.docx' });
      } else if (format === 'pdf') {
        exportOrderTemplate(filteredOrders, 'pdf');
      } else if (format === 'word') {
        exportOrderTemplate(filteredOrders, 'word');
      }
      addNotification?.(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification?.(err.message || 'Export failed', 'error'); }
  };

  const exportButtons = (
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
  );

  return (
    <ErpPageShell
      icon={faClipboardList}
      title="Sales Orders Registry"
      description="Track order lifecycle stages, inventory warehouses, and convert approved orders to Challans."
      action={actionButtons}
    >
      <div className="row g-3 mb-4">
        <ErpKpiCard label="Total Orders" value={orders.length} icon={faClipboardList} color={colors.primary} trend="up" trendVal={`${orders.length} Orders`} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        <ErpKpiCard label="Approved" value={orders.filter(o => o.status === 'Approved').length} icon={faCheckCircle} color={colors.success} trend="up" trendVal="Ready" isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        <ErpKpiCard label="Processing" value={orders.filter(o => o.status === 'Processing').length} icon={faClock} color={colors.warning} trend="up" trendVal="Active" isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        <ErpKpiCard label="Draft" value={orders.filter(o => o.status === 'Draft').length} icon={faFileInvoiceDollar} color={mutedColor} trend="up" trendVal="Draft" isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        <ErpKpiCard label="Sales Value" value="$188,600" icon={faArrowUp} color={colors.success} trend="up" trendVal="Total" isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #8b5cf6', background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8b5cf620', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Order Intelligence</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Processing orders make up the largest backlog segment. Recommend accelerating approvals to reduce fulfillment lead time.</div>
            </div>
          </div>
        </div>
      </div>

      <ErpDataTable
        columns={columns}
        data={filteredOrders}
        loading={loading}
        error={error ? error : null}
        searchable
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search sales orders..."
        emptyMessage="No sales orders found."
        emptyIcon={faClipboardList}
        isDark={isDark}
        title="Sales Orders"
        titleIcon={faClipboardList}
        exportButtons={exportButtons}
      />

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 'clamp(10px, 2vw, 24px)' }} onClick={() => setViewItem(null)}>
          <style>{`
            @media (max-width: 640px) {
              .sales-order-preview-header {
                flex-direction: column;
                gap: 16px;
              }
              .sales-order-preview-header > div:last-child {
                text-align: left !important;
              }
              .sales-order-preview-grid > [class*="col-"] {
                width: 100%;
              }
              .sales-order-preview-totals {
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
                  const tax = orderSettings.taxMethod?.includes('No') ? 0 : subtotal * 0.17;
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
                      <div className="sales-order-preview-header" style={{
                        background: selectedTemplate === 'minimal' ? '#fff' : ts.headerBg,
                        color: selectedTemplate === 'minimal' ? '#1e293b' : '#fff',
                        padding: '24px 28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: selectedTemplate === 'minimal' ? `3px solid ${ts.accent}` : 'none',
                      }}>
                        <div className="d-flex align-items-start gap-3">
                          {orderSettings.companyLogo && (
                            <img src={orderSettings.companyLogo} alt="Logo" style={{ maxHeight: 52, maxWidth: 120, objectFit: 'contain', background: selectedTemplate === 'minimal' ? 'transparent' : 'rgba(255,255,255,0.9)', borderRadius: 6, padding: 4 }} />
                          )}
                          <div>
                            <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{orderSettings.companyName}</h5>
                            <div style={{ opacity: 0.85, fontSize: '0.7rem', maxWidth: 320 }}>{orderSettings.address}</div>
                            <div style={{ opacity: 0.85, fontSize: '0.7rem' }}>{orderSettings.email} | {orderSettings.phone}</div>
                            {orderSettings.website && <div style={{ opacity: 0.85, fontSize: '0.7rem' }}>{orderSettings.website}</div>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.04em' }}>SALES ORDER</h3>
                          <div style={{ opacity: 0.85, fontSize: '0.75rem' }}>{viewItem.number}</div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 8 }}>{formatMoney(total)}</div>
                        </div>
                      </div>
                      <div style={{ padding: '24px 28px' }}>
                        <div className="row g-4 mb-4 sales-order-preview-grid">
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{viewItem.customer}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Date</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.date || '—'}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Est. Delivery</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.deliveryDate}</div>
                          </div>
                        </div>
                        <div className="row g-4 mb-4 sales-order-preview-grid">
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse</small>
                            <div style={{ color: '#1e293b', fontSize: '0.85rem', marginTop: 4 }}>{viewItem.warehouse}</div>
                          </div>
                          <div className="col-4">
                            <small style={{ color: ts.labelColor, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tax Registration</small>
                            <div style={{ fontSize: '0.75rem', marginTop: 4 }}>NTN: <strong>{orderSettings.ntn}</strong></div>
                            <div style={{ fontSize: '0.75rem' }}>STRN / GST: <strong>{orderSettings.strn}</strong></div>
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
                              <td>Sales order goods and services</td>
                              <td className="text-end">1</td>
                              <td className="text-end">{formatMoney(subtotal)}</td>
                              <td className="text-end">{formatMoney(subtotal)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-end mt-3 mb-4">
                          <div className="sales-order-preview-totals" style={{ width: 260, fontSize: '0.78rem' }}>
                            <div className="d-flex justify-content-between mb-1"><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
                            <div className="d-flex justify-content-between mb-1"><span>Tax ({orderSettings.taxMethod})</span><strong>{formatMoney(tax)}</strong></div>
                            <div className="d-flex justify-content-between pt-2 mt-2" style={{ borderTop: '1px solid #e2e8f0', color: ts.accent, fontSize: '0.9rem' }}><span>Total Value</span><strong>{formatMoney(total)}</strong></div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small style={{ color: ts.labelColor, fontSize: '0.65rem' }}>Status</small>
                              <div style={{ marginTop: 4 }}>
                                <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{
                                  fontSize: '0.7rem', borderRadius: '20px',
                                  background: viewItem.status === 'Approved' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Processing' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#713f12' : '#fef3c7'),
                                  color: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Processing' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706')
                                }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: viewItem.status === 'Approved' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Processing' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706') }} />
                                  {viewItem.status}
                                </span>
                              </div>
                            </div>
                            <button className="btn btn-sm d-flex align-items-center gap-1" style={{
                              borderRadius: 8, background: ts.accent, color: '#fff', border: 'none',
                              fontSize: '0.75rem', padding: '6px 14px'
                            }} onClick={() => exportOrderTemplate(viewItem, 'pdf')}>
                              <FontAwesomeIcon icon={faDownload} /> Download PDF
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.7rem', fontStyle: 'italic' }}>
                          {orderSettings.footerLogo && (
                            <img src={orderSettings.footerLogo} alt="Footer" style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 8 }} />
                          )}
                          <div>{orderSettings.orderFooter}</div>
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
        message="Are you sure you want to move this sales order to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />


    </ErpPageShell>
  );
};

export default ErpSalesOrders;
