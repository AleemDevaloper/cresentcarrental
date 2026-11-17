import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faPlus, faSearch, faFilter, faRefresh, faFileExport,
  faEye, faPen, faTrashCan, faArrowRightArrowLeft, faFileCsv, faFileExcel,
  faFilePdf, faSpinner, faInfoCircle, faPhone,
  faEnvelope, faGlobe, faLocationDot, faIndustry, faCircleUser, faCircleCheck,
  faFileInvoiceDollar, faUserTie, faHandshake, faListCheck, faBriefcase,
  faCalendar, faStickyNote, faSackDollar, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import {
  listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import Modal from '../../../components/common/Modal';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';

const TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'reseller', label: 'Reseller' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'lead', label: 'Lead' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'archived', label: 'Archived' },
];

const RATING_OPTIONS = [
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 2, label: '2 Stars' },
  { value: 1, label: '1 Star' },
];

const SIZE_OPTIONS = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '501-1000', label: '501–1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
];

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'event', label: 'Event / Trade Show' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
];

const statusStyle = (status, isDark) => {
  const s = String(status || '').toLowerCase();
  const map = {
    active: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    inactive: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    prospect: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    lead: { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    suspended: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    archived: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
  };
  const m = map[s] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
  return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em', background: m.bg, color: m.color };
};

const typeStyle = (type, isDark) => {
  const t = String(type || '').toLowerCase();
  const map = {
    individual: { bg: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff', color: isDark ? '#a5b4fc' : '#4f46e5' },
    business: { bg: isDark ? 'rgba(6,182,212,0.18)' : '#cffafe', color: isDark ? '#22d3ee' : '#0891b2' },
    enterprise: { bg: isDark ? 'rgba(139,92,246,0.18)' : '#ede9fe', color: isDark ? '#c4b5fd' : '#7c3aed' },
    government: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    nonprofit: { bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    reseller: { bg: isDark ? 'rgba(236,72,153,0.18)' : '#fce7f3', color: isDark ? '#f9a8d4' : '#db2777' },
  };
  const m = map[t] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
  return { ...m, padding: '2px 10px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize' };
};

const ratingStars = (rating) => {
  const n = Math.max(0, Math.min(5, Number(rating) || 0));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
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

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  industry: '',
  size: '',
  type: 'business',
  status: 'active',
  rating: 4,
  annual_revenue: '',
  employee_count: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  notes: '',
  source: 'website',
};

const CrmCustomers = () => {
  const { theme, addNotification } = useApp();
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

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

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
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [deleting, setDeleting] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentPage) params.page = currentPage;
      if (perPage) params.per_page = perPage;
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (ratingFilter) params.rating = ratingFilter;
      if (industryFilter) params.industry = industryFilter;
      const res = await listCustomers(params);
      const list = res?.data || [];
      const meta = res?.meta || {};
      setCustomers(list);
      setTotal(meta.total ?? list.length);
      setLastPage(meta.last_page ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load customers';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, statusFilter, typeFilter, ratingFilter, industryFilter, addNotification]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchCustomers();
    }, 200);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  useEffect(() => {
    const onRefresh = () => fetchCustomers();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [fetchCustomers]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, ratingFilter, industryFilter]);

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
      company: row.company || '',
      email: row.email || '',
      phone: row.phone || '',
      website: row.website || '',
      industry: row.industry || '',
      size: row.size || '',
      type: row.type || 'business',
      status: row.status || 'active',
      rating: row.rating ?? 4,
      annual_revenue: row.annual_revenue ?? '',
      employee_count: row.employee_count ?? '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      country: row.country || '',
      postal_code: row.postal_code || '',
      notes: row.notes || '',
      source: row.source || 'website',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleView = async (row) => {
    setViewItem({ ...row });
    setViewError(null);
    setViewLoading(true);
    try {
      const res = await getCustomer(row.id);
      const payload = res?.data ?? res;
      const detail = payload?.data || payload;
      setViewItem({ ...row, ...detail, stats: payload?.stats || detail?.stats, activities: payload?.activities || detail?.activities });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load customer details';
      setViewError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setViewLoading(false);
    }
  };

  const handleConvert = (row) => {
    addNotification?.(`${row.name || row.company || 'Customer'} is already a customer.`, 'info');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, name: row.name || row.company || row.email || `#${row.id}`, row });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteCustomer(deleteDialog.id);
      addNotification?.('Customer deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchCustomers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete customer';
      addNotification?.(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim() && !formData.company?.trim()) {
      return 'Either name or company is required.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (formData.annual_revenue && Number.isNaN(Number(formData.annual_revenue))) {
      return 'Annual revenue must be a number.';
    }
    if (formData.employee_count && Number.isNaN(Number(formData.employee_count))) {
      return 'Employee count must be a number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const payload = {
        ...formData,
        rating: formData.rating === '' ? null : Number(formData.rating),
        annual_revenue: formData.annual_revenue === '' ? null : Number(formData.annual_revenue),
        employee_count: formData.employee_count === '' ? null : Number(formData.employee_count),
      };
      if (editingId) {
        await updateCustomer(editingId, payload);
        addNotification?.('Customer updated successfully.', 'success');
      } else {
        await createCustomer(payload);
        addNotification?.('Customer created successfully.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchCustomers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save customer';
      setFormError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Export functions
  const buildExportRows = (rows) => {
    return rows.map((r) => ({
      Code: r.code || '',
      Name: r.name || '',
      Company: r.company || '',
      Email: r.email || '',
      Phone: r.phone || '',
      Website: r.website || '',
      Industry: r.industry || '',
      Type: r.type || '',
      Status: r.status || '',
      Rating: r.rating ?? '',
      'Annual Revenue': r.annual_revenue ?? '',
      'Employee Count': r.employee_count ?? '',
      City: r.city || '',
      State: r.state || '',
      Country: r.country || '',
      Source: r.source || '',
      'Created At': r.created_at || '',
    }));
  };

  const exportCsv = () => {
    const rows = buildExportRows(customers);
    if (rows.length === 0) {
      addNotification?.('No customers to export.', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ];
    const csvContent = csvRows.join('\n');
    downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `crm-customers-${new Date().toISOString().slice(0, 10)}.csv`);
    addNotification?.('Customers exported as CSV.', 'success');
    setExportOpen(false);
  };

  const exportExcel = () => {
    const rows = buildExportRows(customers);
    if (rows.length === 0) {
      addNotification?.('No customers to export.', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ];
    const csvContent = csvRows.join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `crm-customers-${new Date().toISOString().slice(0, 10)}.xlsx`);
    a.click();
    addNotification?.('Customers exported as Excel.', 'success');
    setExportOpen(false);
  };

  const exportPdf = () => {
    const rows = customers;
    if (rows.length === 0) {
      addNotification?.('No customers to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CRM Customers</title>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; background: #fff; }
        th { background: #6366f1; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print { body { background: #fff; padding: 0; } }
      </style></head><body>
      <h1>CRM Customers — ${new Date().toLocaleDateString()}</h1>
      <table><thead><tr>
        <th>Code</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th>
        <th>Type</th><th>Status</th><th>Rating</th><th>Annual Revenue</th>
      </tr></thead><tbody>
      ${rows.map((r) => `
        <tr>
          <td>${r.code || ''}</td>
          <td>${r.name || ''}</td>
          <td>${r.company || ''}</td>
          <td>${r.email || ''}</td>
          <td>${r.phone || ''}</td>
          <td>${r.type || ''}</td>
          <td>${r.status || ''}</td>
          <td>${r.rating ?? ''}</td>
          <td>${formatMoney(r.annual_revenue)}</td>
        </tr>
      `).join('')}
      </tbody></table>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    addNotification?.('PDF export ready.', 'success');
    setExportOpen(false);
  };

  const columns = [
    {
      key: 'code', label: 'Code', width: '110px', render: (val) => (
        <span className="font-monospace fw-bold" style={{ color: colors.primary, fontSize: '0.78rem' }}>{val || '—'}</span>
      )
    },
    {
      key: 'name', label: 'Name', bold: true, render: (val, row) => (
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
          }}>
            {(val || row.company || '?').toString().charAt(0).toUpperCase()}
          </div>
          <div className="d-flex flex-column" style={{ minWidth: 0 }}>
            <span style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">
              {val || row.company || '—'}
            </span>
            {row.email && (
              <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="text-truncate">
                {row.email}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'company', label: 'Company', render: (val) => val || <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'email', label: 'Email', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'phone', label: 'Phone', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'type', label: 'Type', render: (val) => val ? (
        <span style={typeStyle(val, isDark)}>{val}</span>
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
      key: 'rating', label: 'Rating', width: '110px', render: (val) => (
        <span style={{ color: colors.warning, fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          {ratingStars(val)}
        </span>
      )
    },
    {
      key: 'annual_revenue', label: 'Annual Revenue', align: 'end', render: (val) => (
        <span className="font-monospace fw-bold" style={{ color: textColor, fontSize: '0.78rem' }}>
          {val !== null && val !== undefined && val !== '' ? formatMoney(val) : '—'}
        </span>
      )
    },
    {
      key: 'actions', label: 'Actions', align: 'end', width: '210px', render: (val, row) => (
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
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '5px 9px' }}
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faPen} style={{ fontSize: '0.85rem' }} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Convert"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', border: 'none', padding: '5px 9px' }}
            onClick={() => handleConvert(row)}
          >
            <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: '0.85rem' }} />
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

  const industryOptions = useMemo(() => {
    const set = new Set();
    customers.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  }, [customers]);

  return (
    <ErpPageShell
      icon={faUsers}
      title="Customers"
      description="Manage your entire customer base — from prospects to enterprise accounts — with full lifecycle visibility."
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
                <div
                  onClick={() => setExportOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 1040 }}
                />
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    minWidth: 180,
                    borderRadius: '12px',
                    padding: '0.4rem',
                    zIndex: 1050,
                    background: isDark ? '#0f172a' : '#ffffff',
                    boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.5)' : '0 12px 32px rgba(0,0,0,0.15)',
                  }}
                >
                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }}
                    onClick={exportCsv}
                  >
                    <FontAwesomeIcon icon={faFileCsv} style={{ color: colors.success }} /> CSV
                  </button>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }}
                    onClick={exportExcel}
                  >
                    <FontAwesomeIcon icon={faFileExcel} style={{ color: colors.success }} /> Excel
                  </button>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }}
                    onClick={exportPdf}
                  >
                    <FontAwesomeIcon icon={faFilePdf} style={{ color: colors.danger }} /> PDF
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={fetchCustomers}
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
            <FontAwesomeIcon icon={faPlus} /> New Customer
          </button>
        </div>
      }
    >
      {/* ============ FILTER BAR ============ */}
      <div className="glass-card mb-3" style={{ borderRadius: '16px', padding: '1rem' }}>
        <div className="row g-2 align-items-center">
          <div className="col-lg-3 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent" style={{ borderColor, color: mutedColor }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, company, email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
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
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select form-select-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Types</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select form-select-sm"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Ratings</option>
              {RATING_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select form-select-sm"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Industries</option>
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-1 col-md-12 text-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTypeFilter('');
                setRatingFilter('');
                setIndustryFilter('');
              }}
              className="btn btn-sm border-0 premium-btn"
              style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: mutedColor, fontSize: '0.75rem' }}
              title="Clear filters"
            >
              <FontAwesomeIcon icon={faFilter} /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* ============ ERROR BANNER ============ */}
      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="small">{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchCustomers}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      )}

      {/* ============ DATA TABLE ============ */}
      <ErpDataTable
        columns={columns}
        data={customers}
        loading={loading}
        error={null}
        emptyMessage="No customers found. Try adjusting your filters or add your first customer."
        emptyIcon={faUsers}
        isDark={isDark}
        title="Customer Directory"
        titleIcon={faUsers}
        accentColor={colors.primary}
        currentPage={currentPage}
        totalPages={lastPage}
        totalEntries={total}
        entriesPerPage={perPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
      />

      {/* ============ CREATE/EDIT MODAL ============ */}
      <Modal
        show={showForm}
        onHide={() => { if (!saving) { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); } }}
        size="extraLarge"
        preventClose={saving}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={editingId ? faPen : faPlus} style={{ color: colors.primary }} />
            <span>{editingId ? 'Edit Customer' : 'New Customer'}</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: '0.7rem', color: mutedColor }}>
              {editingId ? 'Updating existing customer' : 'A unique code will be auto-generated'}
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
                {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Update Customer' : 'Create Customer'}</>}
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
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Basic Information</h6>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Customer name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Company</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                placeholder="Company name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="name@company.com"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Phone</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Website</label>
              <input
                type="url"
                className="form-control form-control-sm"
                value={formData.website}
                onChange={(e) => handleFormChange('website', e.target.value)}
                placeholder="https://company.com"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Industry</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.industry}
                onChange={(e) => handleFormChange('industry', e.target.value)}
                placeholder="e.g. Manufacturing"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Size</label>
              <select
                className="form-select form-select-sm"
                value={formData.size}
                onChange={(e) => handleFormChange('size', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Select size…</option>
                {SIZE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Type</label>
              <select
                className="form-select form-select-sm"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {TYPE_OPTIONS.map((t) => (
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
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Rating</label>
              <select
                className="form-select form-select-sm"
                value={formData.rating}
                onChange={(e) => handleFormChange('rating', e.target.value === '' ? '' : Number(e.target.value))}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">No rating</option>
                {RATING_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Annual Revenue</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.annual_revenue}
                onChange={(e) => handleFormChange('annual_revenue', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Employee Count</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.employee_count}
                onChange={(e) => handleFormChange('employee_count', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Source</label>
              <select
                className="form-select form-select-sm"
                value={formData.source}
                onChange={(e) => handleFormChange('source', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.purple }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Address</h6>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Street Address</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                placeholder="123 Main Street"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>City</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
                placeholder="City"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>State / Province</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.state}
                onChange={(e) => handleFormChange('state', e.target.value)}
                placeholder="State"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Country</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.country}
                onChange={(e) => handleFormChange('country', e.target.value)}
                placeholder="Country"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-1">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>ZIP</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.postal_code}
                onChange={(e) => handleFormChange('postal_code', e.target.value)}
                placeholder="ZIP"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.info }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Notes</h6>
              </div>
            </div>
            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Internal notes about this customer…"
                style={{ background: inputBg, color: textColor, borderColor, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* hidden submit to allow Enter to submit */}
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>
      </Modal>

      {/* ============ VIEW MODAL ============ */}
      <Modal
        show={!!viewItem}
        onHide={() => { if (!viewLoading) { setViewItem(null); setViewError(null); } }}
        size="large"
        preventClose={viewLoading}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faCircleUser} style={{ color: colors.primary }} />
            <span>Customer Details</span>
            {viewItem?.name && <span className="ms-2" style={{ color: mutedColor, fontSize: '0.85rem' }}>• {viewItem.name}</span>}
          </div>
        }
        footer={
          <div className="d-flex justify-content-end w-100">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => { setViewItem(null); setViewError(null); }}
              disabled={viewLoading}
              style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 ms-2"
              onClick={() => { const v = viewItem; setViewItem(null); handleEdit(v); }}
              disabled={viewLoading || !viewItem}
              style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
            >
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
          </div>
        }
      >
        {viewLoading && (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: colors.primary }} />
            <p className="small mt-2" style={{ color: mutedColor }}>Loading customer details…</p>
          </div>
        )}

        {viewError && !viewLoading && (
          <div className="alert alert-danger d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} /> {viewError}
          </div>
        )}

        {!viewLoading && viewItem && (
          <>
            {/* Profile header */}
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
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {(viewItem.name || viewItem.company || '?').toString().charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor }}>
                    {viewItem.name || viewItem.company || 'Unnamed Customer'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: mutedColor }}>
                    {viewItem.company && viewItem.name ? viewItem.company : viewItem.email || '—'}
                  </div>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {viewItem.code && (
                      <span className="font-monospace" style={{ fontSize: '0.7rem', color: colors.primary, fontWeight: 700 }}>
                        {viewItem.code}
                      </span>
                    )}
                    {viewItem.status && (
                      <span style={statusStyle(viewItem.status, isDark)}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle(viewItem.status, isDark).color, display: 'inline-block' }} />
                        {String(viewItem.status).replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    )}
                    {viewItem.type && (
                      <span style={typeStyle(viewItem.type, isDark)}>{viewItem.type}</span>
                    )}
                    {viewItem.rating !== undefined && viewItem.rating !== null && (
                      <span style={{ color: colors.warning, fontSize: '0.78rem' }}>{ratingStars(viewItem.rating)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            {viewItem.stats && (
              <div className="row g-2 mb-3">
                <div className="col-md-3 col-6">
                  <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                    <FontAwesomeIcon icon={faUserTie} style={{ color: colors.primary, fontSize: '0.9rem' }} />
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                      {viewItem.stats.leads_count ?? viewItem.stats.leads ?? 0}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Leads</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                    <FontAwesomeIcon icon={faHandshake} style={{ color: colors.purple, fontSize: '0.9rem' }} />
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                      {viewItem.stats.deals_count ?? viewItem.stats.deals ?? 0}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Deals</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                    <FontAwesomeIcon icon={faListCheck} style={{ color: colors.info, fontSize: '0.9rem' }} />
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                      {viewItem.stats.activities_count ?? viewItem.stats.activities ?? 0}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Activities</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                    <FontAwesomeIcon icon={faSackDollar} style={{ color: colors.success, fontSize: '0.9rem' }} />
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                      {formatMoney(viewItem.stats.total_revenue ?? viewItem.stats.revenue ?? 0)}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Revenue</div>
                  </div>
                </div>
              </div>
            )}

            {/* Details grid */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.primary }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Contact Information</h6>
                </div>
                <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                  {viewItem.email && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faEnvelope} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.email}</span>
                    </div>
                  )}
                  {viewItem.phone && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faPhone} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.phone}</span>
                    </div>
                  )}
                  {viewItem.website && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faGlobe} style={{ color: mutedColor, width: 16 }} />
                      <a href={viewItem.website} target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>
                        {viewItem.website}
                      </a>
                    </div>
                  )}
                  {!viewItem.email && !viewItem.phone && !viewItem.website && (
                    <div style={{ color: mutedColor, fontSize: '0.8rem' }}>No contact info available.</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.purple }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Business Profile</h6>
                </div>
                <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                  {viewItem.industry && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faIndustry} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.industry}</span>
                    </div>
                  )}
                  {viewItem.size && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faBriefcase} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.size} employees</span>
                    </div>
                  )}
                  {viewItem.annual_revenue !== null && viewItem.annual_revenue !== undefined && viewItem.annual_revenue !== '' && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ color: mutedColor, width: 16 }} />
                      <span>{formatMoney(viewItem.annual_revenue)} / year</span>
                    </div>
                  )}
                  {viewItem.source && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faStickyNote} style={{ color: mutedColor, width: 16 }} />
                      <span style={{ textTransform: 'capitalize' }}>{String(viewItem.source).replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {!viewItem.industry && !viewItem.size && (viewItem.annual_revenue === null || viewItem.annual_revenue === undefined || viewItem.annual_revenue === '') && !viewItem.source && (
                    <div style={{ color: mutedColor, fontSize: '0.8rem' }}>No business profile available.</div>
                  )}
                </div>
              </div>

              {(viewItem.address || viewItem.city || viewItem.state || viewItem.country) && (
                <div className="col-12">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.warning }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Address</h6>
                  </div>
                  <div className="d-flex align-items-start gap-2 mt-2" style={{ fontSize: '0.8rem', color: textColor }}>
                    <FontAwesomeIcon icon={faLocationDot} style={{ color: mutedColor, marginTop: 3, flexShrink: 0 }} />
                    <span>
                      {viewItem.address && <>{viewItem.address}<br /></>}
                      {(viewItem.city || viewItem.state || viewItem.postal_code) && (
                        <>{[viewItem.city, viewItem.state, viewItem.postal_code].filter(Boolean).join(', ')}<br /></>
                      )}
                      {viewItem.country}
                    </span>
                  </div>
                </div>
              )}

              {viewItem.notes && (
                <div className="col-12">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.info }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Notes</h6>
                  </div>
                  <div className="mt-2" style={{ fontSize: '0.8rem', color: textColor, whiteSpace: 'pre-wrap' }}>
                    {viewItem.notes}
                  </div>
                </div>
              )}

              {viewItem.created_at && (
                <div className="col-12">
                  <div className="d-flex gap-3" style={{ fontSize: '0.7rem', color: mutedColor, flexWrap: 'wrap' }}>
                    <span><FontAwesomeIcon icon={faCalendar} className="me-1" /> Created {formatDate(viewItem.created_at)}</span>
                    {viewItem.updated_at && viewItem.updated_at !== viewItem.created_at && (
                      <span><FontAwesomeIcon icon={faCalendar} className="me-1" /> Updated {formatDate(viewItem.updated_at)}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recent activities */}
            {Array.isArray(viewItem.activities) && viewItem.activities.length > 0 && (
              <div className="mt-3">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.success }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Recent Activities</h6>
                </div>
                <div className="mt-2" style={{ maxHeight: 240, overflowY: 'auto' }}>
                  {viewItem.activities.slice(0, 5).map((act, idx) => (
                    <div key={act?.id || idx} className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: '0.8rem' }}>
                      <FontAwesomeIcon icon={faCircleCheck} style={{ color: colors.success, marginTop: 4 }} />
                      <div className="flex-grow-1">
                        <div style={{ color: textColor, fontWeight: 500 }}>{act?.subject || act?.title || 'Activity'}</div>
                        <div style={{ color: mutedColor, fontSize: '0.7rem' }}>
                          {act?.type && <span className="me-2">{act.type}</span>}
                          {formatDate(act?.created_at || act?.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* ============ DELETE CONFIRM ============ */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => { if (!deleting) setDeleteDialog({ show: false, id: null, name: '', row: null }); }}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? All related activities and history will be affected."
        itemName={deleteDialog.name}
        confirmLabel="Delete Customer"
        isLoading={deleting}
      />
    </ErpPageShell>
  );
};

export default CrmCustomers;
