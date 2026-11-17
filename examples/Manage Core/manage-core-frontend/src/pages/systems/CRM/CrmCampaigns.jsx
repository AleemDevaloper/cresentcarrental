import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullhorn, faPlus, faSearch, faFilter, faRefresh, faFileExport,
  faEye, faPen, faTrashCan, faFileCsv, faFileExcel, faFilePdf,
  faSpinner, faInfoCircle, faCircleCheck, faChevronDown, faRocket,
  faSackDollar, faCalendarAlt, faChartLine, faUserTie, faAlignLeft
} from '@fortawesome/free-solid-svg-icons';
import {
  listCampaigns, createCampaign, updateCampaign, deleteCampaign
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import Modal from '../../../components/common/Modal';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';

const CAMPAIGN_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'ppc', label: 'PPC / Paid Ads' },
  { value: 'content', label: 'Content Marketing' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'event', label: 'Event' },
  { value: 'direct_mail', label: 'Direct Mail' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusStyle = (status, isDark) => {
  const s = String(status || '').toLowerCase();
  const map = {
    active: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    planned: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    paused: { bg: isDark ? '#713f12' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    completed: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
    cancelled: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
  };
  const m = map[s] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
  return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em', background: m.bg, color: m.color };
};

const typeStyle = (type, isDark) => {
  const t = String(type || '').toLowerCase();
  const map = {
    email: { bg: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff', color: isDark ? '#a5b4fc' : '#4f46e5' },
    social_media: { bg: isDark ? 'rgba(236,72,153,0.18)' : '#fce7f3', color: isDark ? '#f9a8d4' : '#db2777' },
    ppc: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    content: { bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    webinar: { bg: isDark ? 'rgba(139,92,246,0.18)' : '#ede9fe', color: isDark ? '#c4b5fd' : '#7c3aed' },
    event: { bg: isDark ? 'rgba(6,182,212,0.18)' : '#cffafe', color: isDark ? '#22d3ee' : '#0891b2' },
    direct_mail: { bg: isDark ? 'rgba(244,63,94,0.18)' : '#ffe4e6', color: isDark ? '#fda4af' : '#e11d48' },
    referral: { bg: isDark ? 'rgba(20,184,166,0.18)' : '#ccfbf1', color: isDark ? '#5eead4' : '#0d9488' },
    other: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
  };
  const m = map[t] || map.other;
  return { ...m, padding: '2px 10px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize' };
};

const formatMoney = (v) => {
  const n = Number(v) || 0;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
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

const computeRoi = (actualRevenue, actualCost) => {
  const rev = Number(actualRevenue) || 0;
  const cost = Number(actualCost) || 0;
  if (cost <= 0) return null;
  return ((rev - cost) / cost) * 100;
};

const emptyForm = {
  name: '',
  type: 'email',
  status: 'planned',
  start_date: '',
  end_date: '',
  budget: '',
  actual_cost: '',
  expected_revenue: '',
  actual_revenue: '',
  target_audience: '',
  description: '',
  assigned_to: '',
};

const CrmCampaigns = () => {
  const { theme, addNotification } = useApp();
  const t = useTranslation();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff';

  const colors = useMemo(() => ({
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
  }), []);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [viewItem, setViewItem] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [deleting, setDeleting] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentPage) params.page = currentPage;
      if (perPage) params.per_page = perPage;
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await listCampaigns(params);
      const list = res?.data || [];
      const meta = res?.meta || {};
      setCampaigns(list);
      setTotal(meta.total ?? list.length);
      setLastPage(meta.last_page ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load campaigns';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, statusFilter, typeFilter, addNotification]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchCampaigns();
    }, 200);
    return () => clearTimeout(t);
  }, [fetchCampaigns]);

  useEffect(() => {
    const onRefresh = () => fetchCampaigns();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [fetchCampaigns]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, typeFilter]);

  const kpiData = useMemo(() => {
    const totalActive = (total || campaigns.filter((c) => String(c.status || '').toLowerCase() === 'active').length);
    const activeCount = campaigns.filter((c) => String(c.status || '').toLowerCase() === 'active').length;
    const totalBudget = campaigns.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);
    const totalRevenue = campaigns.reduce((acc, c) => acc + (Number(c.actual_revenue) || 0), 0);
    return [
      { label: 'Active Campaigns', val: activeCount, icon: faBullhorn, color: colors.primary, trend: 'up', trendVal: `${totalActive} in system` },
      { label: 'Total Budget', val: formatMoney(totalBudget), icon: faSackDollar, color: colors.warning, trend: 'up', trendVal: 'Allocated' },
      { label: 'Total Revenue', val: formatMoney(totalRevenue), icon: faChartLine, color: colors.success, trend: 'up', trendVal: 'Realized' },
    ];
  }, [campaigns, total, colors]);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      name: row.name || '',
      type: row.type || 'email',
      status: row.status || 'planned',
      start_date: row.start_date ? String(row.start_date).slice(0, 10) : '',
      end_date: row.end_date ? String(row.end_date).slice(0, 10) : '',
      budget: row.budget ?? '',
      actual_cost: row.actual_cost ?? '',
      expected_revenue: row.expected_revenue ?? '',
      actual_revenue: row.actual_revenue ?? '',
      target_audience: row.target_audience || '',
      description: row.description || '',
      assigned_to: row.assigned_to || '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleView = (row) => setViewItem(row);

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, name: row.name || `Campaign #${row.id}`, row });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteCampaign(deleteDialog.id);
      addNotification?.('Campaign deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchCampaigns();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete campaign';
      addNotification?.(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim()) return 'Campaign name is required.';
    if (formData.budget && Number.isNaN(Number(formData.budget))) return 'Budget must be a number.';
    if (formData.actual_cost && Number.isNaN(Number(formData.actual_cost))) return 'Actual cost must be a number.';
    if (formData.expected_revenue && Number.isNaN(Number(formData.expected_revenue))) return 'Expected revenue must be a number.';
    if (formData.actual_revenue && Number.isNaN(Number(formData.actual_revenue))) return 'Actual revenue must be a number.';
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setFormError(null);
    setSaving(true);
    try {
      const payload = {
        ...formData,
        budget: formData.budget === '' ? null : Number(formData.budget),
        actual_cost: formData.actual_cost === '' ? null : Number(formData.actual_cost),
        expected_revenue: formData.expected_revenue === '' ? null : Number(formData.expected_revenue),
        actual_revenue: formData.actual_revenue === '' ? null : Number(formData.actual_revenue),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        target_audience: formData.target_audience || null,
        description: formData.description || null,
        assigned_to: formData.assigned_to || null,
      };
      if (editingId) {
        await updateCampaign(editingId, payload);
        addNotification?.('Campaign updated successfully.', 'success');
      } else {
        await createCampaign(payload);
        addNotification?.('Campaign created successfully.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchCampaigns();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save campaign';
      setFormError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildExportRows = (rows) => {
    return rows.map((r) => ({
      Name: r.name || '',
      Type: r.type || '',
      Status: r.status || '',
      'Start Date': r.start_date || '',
      'End Date': r.end_date || '',
      Budget: r.budget ?? '',
      'Actual Cost': r.actual_cost ?? '',
      'Expected Revenue': r.expected_revenue ?? '',
      'Actual Revenue': r.actual_revenue ?? '',
      'ROI %': computeRoi(r.actual_revenue, r.actual_cost)?.toFixed(2) ?? '',
      'Assigned To': r.assignedUser?.name || r.assigned_to || '',
      'Created At': r.created_at || '',
    }));
  };

  const exportCsv = () => {
    const rows = buildExportRows(campaigns);
    if (rows.length === 0) { addNotification?.('No campaigns to export.', 'warning'); return; }
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(','), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))];
    downloadBlob(new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' }), `crm-campaigns-${new Date().toISOString().slice(0, 10)}.csv`);
    addNotification?.('Campaigns exported as CSV.', 'success');
    setExportOpen(false);
  };

  const exportExcel = () => {
    const rows = buildExportRows(campaigns);
    if (rows.length === 0) { addNotification?.('No campaigns to export.', 'warning'); return; }
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(','), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))];
    const csvContent = csvRows.join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `crm-campaigns-${new Date().toISOString().slice(0, 10)}.xlsx`);
    a.click();
    addNotification?.('Campaigns exported as Excel.', 'success');
    setExportOpen(false);
  };

  const exportPdf = () => {
    const rows = campaigns;
    if (rows.length === 0) { addNotification?.('No campaigns to export.', 'warning'); return; }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CRM Campaigns</title>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; background: #fff; }
        th { background: #6366f1; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print { body { background: #fff; padding: 0; } }
      </style></head><body>
      <h1>CRM Campaigns — ${new Date().toLocaleDateString()}</h1>
      <table><thead><tr>
        <th>Name</th><th>Type</th><th>Status</th><th>Start</th><th>End</th>
        <th>Budget</th><th>Actual Cost</th><th>Expected Rev.</th><th>Actual Rev.</th><th>ROI %</th>
      </tr></thead><tbody>
      ${rows.map((r) => {
        const roi = computeRoi(r.actual_revenue, r.actual_cost);
        return `<tr>
          <td>${r.name || ''}</td>
          <td>${r.type || ''}</td>
          <td>${r.status || ''}</td>
          <td>${formatDate(r.start_date)}</td>
          <td>${formatDate(r.end_date)}</td>
          <td>${formatMoney(r.budget)}</td>
          <td>${formatMoney(r.actual_cost)}</td>
          <td>${formatMoney(r.expected_revenue)}</td>
          <td>${formatMoney(r.actual_revenue)}</td>
          <td>${roi == null ? '—' : roi.toFixed(1) + '%'}</td>
        </tr>`;
      }).join('')}
      </tbody></table>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
    addNotification?.('PDF export ready.', 'success');
    setExportOpen(false);
  };

  const columns = [
    {
      key: 'name', label: 'Name', bold: true, render: (val, row) => {
        const colors_seed = [colors.primary, colors.purple, colors.info, colors.warning, colors.success, colors.danger];
        const seed = String(row.id || val || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors_seed.length;
        const c1 = colors_seed[seed];
        const c2 = colors_seed[(seed + 1) % colors_seed.length];
        return (
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', flexShrink: 0,
            }}>
              <FontAwesomeIcon icon={faBullhorn} />
            </div>
            <div className="d-flex flex-column" style={{ minWidth: 0 }}>
              <span style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">{val || '—'}</span>
              {row.target_audience && (
                <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="text-truncate">{row.target_audience}</span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'type', label: 'Type', render: (val) => val ? (
        <span style={typeStyle(val, isDark)}>{String(val).replace(/_/g, ' ')}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'status', label: 'Status', render: (val) => val ? (
        <span style={statusStyle(val, isDark)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle(val, isDark).color, display: 'inline-block' }} />
          {String(val).replace(/^\w/, (c) => c.toUpperCase())}
        </span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'start_date', label: 'Start Date', render: (val) => (
        <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem', color: mutedColor }}>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.65rem' }} />
          <span style={{ color: textColor }}>{formatDate(val)}</span>
        </div>
      )
    },
    {
      key: 'end_date', label: 'End Date', render: (val) => (
        <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem', color: mutedColor }}>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.65rem' }} />
          <span style={{ color: textColor }}>{formatDate(val)}</span>
        </div>
      )
    },
    {
      key: 'budget', label: 'Budget', align: 'end', render: (val) => (
        <span className="font-monospace fw-bold" style={{ color: textColor, fontSize: '0.78rem' }}>
          {val !== null && val !== undefined && val !== '' ? formatMoney(val) : '—'}
        </span>
      )
    },
    {
      key: 'expected_revenue', label: 'Expected Rev.', align: 'end', render: (val) => (
        <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.78rem' }}>
          {val !== null && val !== undefined && val !== '' ? formatMoney(val) : '—'}
        </span>
      )
    },
    {
      key: 'actual_revenue', label: 'Actual Rev.', align: 'end', render: (val) => (
        <span className="font-monospace fw-bold" style={{ color: colors.success, fontSize: '0.78rem' }}>
          {val !== null && val !== undefined && val !== '' ? formatMoney(val) : '—'}
        </span>
      )
    },
    {
      key: 'roi', label: 'ROI %', align: 'end', width: '110px', render: (val, row) => {
        const roi = computeRoi(row.actual_revenue, row.actual_cost);
        if (roi == null) return <span style={{ color: mutedColor, fontSize: '0.78rem' }}>—</span>;
        const isPos = roi >= 0;
        return (
          <span className="premium-badge" style={{
            background: isPos ? (isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7') : (isDark ? 'rgba(244,63,94,0.18)' : '#fee2e2'),
            color: isPos ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
            fontWeight: 700, fontSize: '0.7rem',
          }}>
            {isPos ? '▲' : '▼'} {Math.abs(roi).toFixed(1)}%
          </span>
        );
      }
    },
    {
      key: 'actions', label: 'Actions', align: 'end', width: '180px', render: (val, row) => (
        <div className="d-flex gap-1 justify-content-end">
          <button
            className="btn btn-sm premium-btn"
            title="View"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '5px 9px' }}
            onClick={() => handleView(row)}
          >
            <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.85rem' }} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Edit"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569', border: 'none', padding: '5px 9px' }}
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faPen} style={{ fontSize: '0.85rem' }} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Delete"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '5px 9px' }}
            onClick={() => handleDeleteClick(row)}
          >
            <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '0.85rem' }} />
          </button>
        </div>
      )
    },
  ];

  return (
    <ErpPageShell
      icon={faBullhorn}
      title="Marketing Campaigns"
      description="Plan, launch, and measure multi-channel marketing campaigns — track budget vs. revenue and ROI in real time."
      badge={`${total} total`}
      action={
        <div className="d-flex gap-2">
          <div className="dropdown position-relative">
            <button
              type="button"
              className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
              style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.8rem' }}
              onClick={() => setExportOpen((o) => !o)}
              aria-expanded={exportOpen}
            >
              <FontAwesomeIcon icon={faFileExport} /> Export <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.65rem' }} />
            </button>
            {exportOpen && (
              <>
                <div onClick={() => setExportOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1040 }} />
                <div className="glass-card" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', minWidth: 180, borderRadius: '12px', padding: '0.4rem', zIndex: 1050, background: isDark ? '#0f172a' : '#ffffff', boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.5)' : '0 12px 32px rgba(0,0,0,0.15)' }}>
                  <button className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }} onClick={exportCsv}>
                    <FontAwesomeIcon icon={faFileCsv} style={{ color: colors.success }} /> CSV
                  </button>
                  <button className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }} onClick={exportExcel}>
                    <FontAwesomeIcon icon={faFileExcel} style={{ color: colors.success }} /> Excel
                  </button>
                  <button className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }} onClick={exportPdf}>
                    <FontAwesomeIcon icon={faFilePdf} style={{ color: colors.danger }} /> PDF
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={fetchCampaigns}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
            style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.8rem' }}
            title="Refresh"
          >
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3"
            style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
          >
            <FontAwesomeIcon icon={faPlus} /> New Campaign
          </button>
        </div>
      }
    >
      <div className="row g-3 mb-3">
        {kpiData.map((k, idx) => (
          <ErpKpiCard
            key={idx}
            label={k.label}
            value={k.val}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
            trendVal={k.trendVal}
            isDark={isDark}
          />
        ))}
      </div>

      <div className="glass-card mb-3" style={{ borderRadius: '16px', padding: '1rem' }}>
        <div className="row g-2 align-items-center">
          <div className="col-lg-5 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent" style={{ borderColor, color: mutedColor }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, audience, description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select form-select-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Types</option>
              {CAMPAIGN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-1 col-md-12 text-end">
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setStatusFilter(''); setTypeFilter(''); }}
              className="btn btn-sm border-0 premium-btn"
              style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: mutedColor, fontSize: '0.75rem' }}
              title="Clear filters"
            >
              <FontAwesomeIcon icon={faFilter} /> Clear
            </button>
          </div>
        </div>
      </div>

      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="small">{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchCampaigns}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      )}

      <ErpDataTable
        columns={columns}
        data={campaigns}
        loading={loading}
        error={null}
        emptyMessage="No campaigns found. Try adjusting your filters or add your first campaign."
        emptyIcon={faBullhorn}
        isDark={isDark}
        title="Campaign Portfolio"
        titleIcon={faBullhorn}
        accentColor={colors.primary}
        currentPage={currentPage}
        totalPages={lastPage}
        totalEntries={total}
        entriesPerPage={perPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
      />

      <Modal
        show={showForm}
        onHide={() => { if (!saving) { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); } }}
        size="extraLarge"
        preventClose={saving}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={editingId ? faPen : faPlus} style={{ color: colors.primary }} />
            <span>{editingId ? 'Edit Campaign' : 'New Campaign'}</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: '0.7rem', color: mutedColor }}>
              {editingId ? 'Updating existing campaign' : 'Define a new marketing initiative'}
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); }}
                disabled={saving}
                style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
                onClick={handleSubmit}
                disabled={saving}
                style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
              >
                {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Update Campaign' : 'Create Campaign'}</>}
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ borderRadius: '10px', fontSize: '0.8rem' }}>
              <FontAwesomeIcon icon={faInfoCircle} /> {formError}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.primary }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Campaign Details</h6>
              </div>
            </div>
            <div className="col-md-8">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Name *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="e.g. Q1 Enterprise Email Nurture"
                style={{ background: inputBg, color: textColor, borderColor }}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Type</label>
              <select
                className="form-select form-select-sm"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {CAMPAIGN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Status</label>
              <select
                className="form-select form-select-sm"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Start Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.start_date}
                onChange={(e) => handleFormChange('start_date', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>End Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.end_date}
                onChange={(e) => handleFormChange('end_date', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Target Audience</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.target_audience}
                onChange={(e) => handleFormChange('target_audience', e.target.value)}
                placeholder="e.g. Mid-market SaaS decision makers in NA"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Assigned To</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.assigned_to}
                onChange={(e) => handleFormChange('assigned_to', e.target.value)}
                placeholder="User ID, email, or name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.warning }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Budget & Revenue</h6>
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Budget</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.budget}
                onChange={(e) => handleFormChange('budget', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Actual Cost</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.actual_cost}
                onChange={(e) => handleFormChange('actual_cost', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Expected Revenue</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.expected_revenue}
                onChange={(e) => handleFormChange('expected_revenue', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Actual Revenue</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.actual_revenue}
                onChange={(e) => handleFormChange('actual_revenue', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.purple }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Description</h6>
              </div>
            </div>
            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Goals, channels, creative brief…"
                style={{ background: inputBg, color: textColor, borderColor, resize: 'vertical' }}
              />
            </div>
          </div>

          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>
      </Modal>

      <Modal
        show={!!viewItem}
        onHide={() => setViewItem(null)}
        size="large"
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faBullhorn} style={{ color: colors.primary }} />
            <span>Campaign Details</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-end w-100">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setViewItem(null)}
              style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 ms-2"
              onClick={() => { const v = viewItem; setViewItem(null); handleEdit(v); }}
              style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
            >
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
          </div>
        }
      >
        {viewItem && (() => {
          const roi = computeRoi(viewItem.actual_revenue, viewItem.actual_cost);
          const budget = Number(viewItem.budget) || 0;
          const actualCost = Number(viewItem.actual_cost) || 0;
          const expectedRev = Number(viewItem.expected_revenue) || 0;
          const actualRev = Number(viewItem.actual_revenue) || 0;
          const maxVal = Math.max(budget, actualCost, expectedRev, actualRev, 1);
          const barPct = (v) => `${Math.min(100, (v / maxVal) * 100)}%`;
          return (
            <>
              <div
                className="mb-3"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.10))'
                    : 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : '#c7d2fe'}`,
                }}
              >
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div style={{
                    width: 64, height: 64, borderRadius: '14px',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', flexShrink: 0,
                  }}>
                    <FontAwesomeIcon icon={faBullhorn} />
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor }}>{viewItem.name || 'Untitled Campaign'}</div>
                    <div style={{ fontSize: '0.85rem', color: mutedColor }}>
                      {viewItem.target_audience || '—'}
                    </div>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {viewItem.type && <span style={typeStyle(viewItem.type, isDark)}>{String(viewItem.type).replace(/_/g, ' ')}</span>}
                      {viewItem.status && (
                        <span style={statusStyle(viewItem.status, isDark)}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle(viewItem.status, isDark).color, display: 'inline-block' }} />
                          {String(viewItem.status).replace(/^\w/, (c) => c.toUpperCase())}
                        </span>
                      )}
                      {roi != null && (
                        <span className="premium-badge" style={{
                          background: roi >= 0 ? (isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7') : (isDark ? 'rgba(244,63,94,0.18)' : '#fee2e2'),
                          color: roi >= 0 ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                          fontWeight: 700,
                        }}>
                          <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '0.6rem' }} />
                          ROI: {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.primary }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Schedule</h6>
                  </div>
                  <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ color: mutedColor, width: 16 }} />
                      <span>Start: {formatDate(viewItem.start_date)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ color: mutedColor, width: 16 }} />
                      <span>End: {formatDate(viewItem.end_date)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faUserTie} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.assignedUser?.name || viewItem.assigned_to || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.purple }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Performance Summary</h6>
                  </div>
                  <div className="row g-2 mt-2">
                    <div className="col-6">
                      <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor }}>{formatMoney(budget)}</div>
                        <div style={{ fontSize: '0.6rem', color: mutedColor, textTransform: 'uppercase' }}>Budget</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor }}>{formatMoney(actualCost)}</div>
                        <div style={{ fontSize: '0.6rem', color: mutedColor, textTransform: 'uppercase' }}>Actual Cost</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor }}>{formatMoney(expectedRev)}</div>
                        <div style={{ fontSize: '0.6rem', color: mutedColor, textTransform: 'uppercase' }}>Expected Rev.</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: colors.success }}>{formatMoney(actualRev)}</div>
                        <div style={{ fontSize: '0.6rem', color: mutedColor, textTransform: 'uppercase' }}>Actual Rev.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.success }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Budget vs. Revenue</h6>
                  </div>
                  <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Budget', val: budget, color: colors.warning },
                      { label: 'Actual Cost', val: actualCost, color: colors.danger },
                      { label: 'Expected Revenue', val: expectedRev, color: colors.info },
                      { label: 'Actual Revenue', val: actualRev, color: colors.success },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="d-flex justify-content-between" style={{ fontSize: '0.72rem', marginBottom: 4 }}>
                          <span style={{ color: mutedColor, fontWeight: 600 }}>{row.label}</span>
                          <span style={{ color: textColor, fontWeight: 700 }} className="font-monospace">{formatMoney(row.val)}</span>
                        </div>
                        <div style={{ width: '100%', height: 10, background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ width: barPct(row.val), height: '100%', background: row.color, borderRadius: 100, transition: 'width 0.4s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {viewItem.description && (
                  <div className="col-12">
                    <div className="section-header">
                      <div className="accent-bar" style={{ background: colors.info }} />
                      <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Description</h6>
                    </div>
                    <div className="mt-2" style={{ fontSize: '0.8rem', color: textColor, whiteSpace: 'pre-wrap' }}>
                      {viewItem.description}
                    </div>
                  </div>
                )}

                {viewItem.created_at && (
                  <div className="col-12">
                    <div style={{ fontSize: '0.7rem', color: mutedColor }}>
                      Created {formatDate(viewItem.created_at)}
                      {viewItem.updated_at && viewItem.updated_at !== viewItem.created_at && (
                        <> · Updated {formatDate(viewItem.updated_at)}</>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </Modal>

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => { if (!deleting) setDeleteDialog({ show: false, id: null, name: '', row: null }); }}
        onConfirm={confirmDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete Campaign"
        isLoading={deleting}
      />
    </ErpPageShell>
  );
};

export default CrmCampaigns;
