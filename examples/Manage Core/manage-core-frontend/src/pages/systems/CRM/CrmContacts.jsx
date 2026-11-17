import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressBook, faPlus, faSearch, faFilter, faRefresh, faFileExport,
  faEye, faPen, faTrashCan, faFileCsv, faFileExcel, faFilePdf,
  faSpinner, faInfoCircle, faPhone, faEnvelope, faMobile, faBriefcase,
  faBuilding, faCircleCheck, faStar, faCakeCandles, faUserTie,
  faIdBadge, faXmark, faCircleUser, faChevronDown, faLink, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import {
  listContacts, createContact, updateContact, deleteContact, listCustomers
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import Modal from '../../../components/common/Modal';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const DEPARTMENTS = [
  'Executive', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations',
  'IT', 'Engineering', 'Support', 'Legal', 'Procurement', 'Other'
];

const statusStyle = (status, isDark) => {
  const s = String(status || '').toLowerCase();
  const map = {
    active: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    inactive: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    archived: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
  };
  const m = map[s] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
  return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em', background: m.bg, color: m.color };
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
  customer_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  mobile: '',
  title: '',
  department: '',
  is_primary: false,
  status: 'active',
  linkedin: '',
  twitter: '',
  birthday: '',
  notes: '',
};

const CrmContacts = () => {
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

  const [contacts, setContacts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

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

  const customerMap = useMemo(() => {
    const m = new Map();
    customers.forEach((c) => m.set(c.id, c));
    return m;
  }, [customers]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentPage) params.page = currentPage;
      if (perPage) params.per_page = perPage;
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (customerFilter) params.customer_id = customerFilter;
      const res = await listContacts(params);
      const list = res?.data || [];
      const meta = res?.meta || {};
      setContacts(list);
      setTotal(meta.total ?? list.length);
      setLastPage(meta.last_page ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load contacts';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, statusFilter, customerFilter, addNotification]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await listCustomers({ per_page: 200 });
      setCustomers(Array.isArray(res?.data) ? res.data : []);
    } catch (_) {
      setCustomers([]);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchContacts();
    }, 200);
    return () => clearTimeout(t);
  }, [fetchContacts]);

  useEffect(() => {
    const onRefresh = () => fetchContacts();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [fetchContacts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, customerFilter]);

  const kpiData = useMemo(() => {
    const totalVal = total || contacts.length;
    const active = contacts.filter((c) => String(c.status || '').toLowerCase() === 'active').length;
    const primary = contacts.filter((c) => c.is_primary === true || c.is_primary === 1 || c.is_primary === '1').length;
    return [
      { label: 'Total Contacts', val: totalVal, icon: faAddressBook, color: colors.primary, trend: 'up', trendVal: `${totalVal} records` },
      { label: 'Active Contacts', val: active, icon: faCircleCheck, color: colors.success, trend: 'up', trendVal: 'Engaged' },
      { label: 'Primary Contacts', val: primary, icon: faStar, color: colors.warning, trend: 'up', trendVal: 'Key persons' },
    ];
  }, [contacts, total, colors]);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      customer_id: row.customer_id ?? '',
      first_name: row.first_name || '',
      last_name: row.last_name || '',
      email: row.email || '',
      phone: row.phone || '',
      mobile: row.mobile || '',
      title: row.title || '',
      department: row.department || '',
      is_primary: Boolean(row.is_primary),
      status: row.status || 'active',
      linkedin: row.linkedin || '',
      twitter: row.twitter || '',
      birthday: row.birthday ? String(row.birthday).slice(0, 10) : '',
      notes: row.notes || '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleView = (row) => {
    setViewItem(row);
  };

  const handleDeleteClick = (row) => {
    const name = [row.first_name, row.last_name].filter(Boolean).join(' ') || row.email || `#${row.id}`;
    setDeleteDialog({ show: true, id: row.id, name, row });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteContact(deleteDialog.id);
      addNotification?.('Contact deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchContacts();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete contact';
      addNotification?.(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const validateForm = () => {
    if (!formData.first_name?.trim() && !formData.last_name?.trim()) {
      return 'Please provide a first or last name.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
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
        customer_id: formData.customer_id === '' ? null : Number(formData.customer_id),
        is_primary: Boolean(formData.is_primary),
        birthday: formData.birthday || null,
      };
      if (editingId) {
        await updateContact(editingId, payload);
        addNotification?.('Contact updated successfully.', 'success');
      } else {
        await createContact(payload);
        addNotification?.('Contact created successfully.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchContacts();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save contact';
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
    return rows.map((r) => {
      const cust = customerMap.get(r.customer_id);
      return {
        Name: [r.first_name, r.last_name].filter(Boolean).join(' '),
        Customer: cust ? (cust.company || cust.name || '') : '',
        Email: r.email || '',
        Phone: r.phone || '',
        Mobile: r.mobile || '',
        Title: r.title || '',
        Department: r.department || '',
        Primary: r.is_primary ? 'Yes' : 'No',
        Status: r.status || '',
        LinkedIn: r.linkedin || '',
        Twitter: r.twitter || '',
        Birthday: r.birthday || '',
        'Created At': r.created_at || '',
      };
    });
  };

  const exportCsv = () => {
    const rows = buildExportRows(contacts);
    if (rows.length === 0) {
      addNotification?.('No contacts to export.', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ];
    const csvContent = csvRows.join('\n');
    downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `crm-contacts-${new Date().toISOString().slice(0, 10)}.csv`);
    addNotification?.('Contacts exported as CSV.', 'success');
    setExportOpen(false);
  };

  const exportExcel = () => {
    const rows = buildExportRows(contacts);
    if (rows.length === 0) {
      addNotification?.('No contacts to export.', 'warning');
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
    a.setAttribute("download", `crm-contacts-${new Date().toISOString().slice(0, 10)}.xlsx`);
    a.click();
    addNotification?.('Contacts exported as Excel.', 'success');
    setExportOpen(false);
  };

  const exportPdf = () => {
    const rows = contacts;
    if (rows.length === 0) {
      addNotification?.('No contacts to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CRM Contacts</title>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; background: #fff; }
        th { background: #6366f1; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print { body { background: #fff; padding: 0; } }
      </style></head><body>
      <h1>CRM Contacts — ${new Date().toLocaleDateString()}</h1>
      <table><thead><tr>
        <th>Name</th><th>Customer</th><th>Email</th><th>Phone</th><th>Mobile</th>
        <th>Title</th><th>Department</th><th>Primary</th><th>Status</th>
      </tr></thead><tbody>
      ${rows.map((r) => {
        const cust = customerMap.get(r.customer_id);
        return `
        <tr>
          <td>${[r.first_name, r.last_name].filter(Boolean).join(' ')}</td>
          <td>${cust ? (cust.company || cust.name || '') : ''}</td>
          <td>${r.email || ''}</td>
          <td>${r.phone || ''}</td>
          <td>${r.mobile || ''}</td>
          <td>${r.title || ''}</td>
          <td>${r.department || ''}</td>
          <td>${r.is_primary ? 'Yes' : 'No'}</td>
          <td>${r.status || ''}</td>
        </tr>`;
      }).join('')}
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
      key: 'name', label: 'Name', bold: true, render: (val, row) => {
        const fullName = [row.first_name, row.last_name].filter(Boolean).join(' ') || '—';
        const initials = ((row.first_name || '').charAt(0) + (row.last_name || '').charAt(0)).toUpperCase() || '?';
        return (
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div className="d-flex flex-column" style={{ minWidth: 0 }}>
              <span style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">
                {fullName}
              </span>
              {row.title && (
                <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="text-truncate">
                  {row.title}
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'customer', label: 'Customer', render: (val, row) => {
        const cust = customerMap.get(row.customer_id);
        if (!cust) return <span style={{ color: mutedColor, fontSize: '0.78rem' }}>—</span>;
        return (
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: 'rgba(99,102,241,0.15)', color: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '0.65rem' }} />
            </div>
            <span style={{ color: textColor, fontSize: '0.78rem' }} className="text-truncate">
              {cust.company || cust.name || `Customer #${row.customer_id}`}
            </span>
          </div>
        );
      }
    },
    {
      key: 'email', label: 'Email', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }} className="text-truncate d-inline-block" style={{ maxWidth: 180 }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'phone', label: 'Phone', render: (val) => val ? (
        <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem', color: mutedColor }}>
          <FontAwesomeIcon icon={faPhone} style={{ fontSize: '0.65rem' }} />
          <span>{val}</span>
        </div>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'mobile', label: 'Mobile', render: (val) => val ? (
        <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem', color: mutedColor }}>
          <FontAwesomeIcon icon={faMobile} style={{ fontSize: '0.65rem' }} />
          <span>{val}</span>
        </div>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'title', label: 'Title', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'department', label: 'Department', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'is_primary', label: 'Primary', width: '90px', render: (val) => val ? (
        <span className="premium-badge" style={{ background: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' }}>
          <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.6rem' }} /> Primary
        </span>
      ) : <span style={{ color: mutedColor, fontSize: '0.75rem' }}>—</span>
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
      icon={faAddressBook}
      title="Customer Contacts Directory"
      description="Manage every person behind your customer accounts — primary decision makers, billing contacts, and field representatives."
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
            onClick={fetchContacts}
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
            <FontAwesomeIcon icon={faPlus} /> New Contact
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
                placeholder="Search by name, email, title, phone…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select form-select-sm"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.company || c.name || `Customer #${c.id}`}</option>
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
              onClick={() => { setSearchTerm(''); setStatusFilter(''); setCustomerFilter(''); }}
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
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchContacts}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      )}

      <ErpDataTable
        columns={columns}
        data={contacts}
        loading={loading}
        error={null}
        emptyMessage="No contacts found. Try adjusting your filters or add your first contact."
        emptyIcon={faAddressBook}
        isDark={isDark}
        title="Contact Directory"
        titleIcon={faAddressBook}
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
            <span>{editingId ? 'Edit Contact' : 'New Contact'}</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: '0.7rem', color: mutedColor }}>
              {editingId ? 'Updating existing contact' : 'Add a new contact to a customer account'}
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
                {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Update Contact' : 'Create Contact'}</>}
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
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Personal Information</h6>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Customer *</label>
              <select
                className="form-select form-select-sm"
                value={formData.customer_id}
                onChange={(e) => handleFormChange('customer_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Select customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company || c.name || `Customer #${c.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>First Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.first_name}
                onChange={(e) => handleFormChange('first_name', e.target.value)}
                placeholder="First name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Last Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.last_name}
                onChange={(e) => handleFormChange('last_name', e.target.value)}
                placeholder="Last name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Title / Role</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g. Procurement Manager"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Department</label>
              <select
                className="form-select form-select-sm"
                value={formData.department}
                onChange={(e) => handleFormChange('department', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
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
            <div className="col-md-6 d-flex align-items-end">
              <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', color: textColor, fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_primary)}
                  onChange={(e) => handleFormChange('is_primary', e.target.checked)}
                  style={{ accentColor: colors.primary }}
                />
                <FontAwesomeIcon icon={faStar} style={{ color: colors.warning }} />
                Mark as primary contact for this customer
              </label>
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.info }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Contact Channels</h6>
              </div>
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
            <div className="col-md-3">
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
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Mobile</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.mobile}
                onChange={(e) => handleFormChange('mobile', e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>LinkedIn</label>
              <input
                type="url"
                className="form-control form-control-sm"
                value={formData.linkedin}
                onChange={(e) => handleFormChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Twitter / X</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.twitter}
                onChange={(e) => handleFormChange('twitter', e.target.value)}
                placeholder="@handle"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Birthday</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.birthday}
                onChange={(e) => handleFormChange('birthday', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.purple }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Notes</h6>
              </div>
            </div>
            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Internal notes about this contact…"
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
            <FontAwesomeIcon icon={faCircleUser} style={{ color: colors.primary }} />
            <span>Contact Details</span>
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
          const fullName = [viewItem.first_name, viewItem.last_name].filter(Boolean).join(' ') || 'Unnamed Contact';
          const cust = customerMap.get(viewItem.customer_id);
          const initials = ((viewItem.first_name || '').charAt(0) + (viewItem.last_name || '').charAt(0)).toUpperCase() || '?';
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
                    width: 64, height: 64, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor }}>{fullName}</div>
                    <div style={{ fontSize: '0.85rem', color: mutedColor }}>
                      {viewItem.title || '—'}{viewItem.department ? ` · ${viewItem.department}` : ''}
                    </div>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {viewItem.is_primary && (
                        <span className="premium-badge" style={{ background: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' }}>
                          <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.6rem' }} /> Primary
                        </span>
                      )}
                      {viewItem.status && (
                        <span style={statusStyle(viewItem.status, isDark)}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle(viewItem.status, isDark).color, display: 'inline-block' }} />
                          {String(viewItem.status).replace(/^\w/, (c) => c.toUpperCase())}
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
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Contact Information</h6>
                  </div>
                  <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                    {viewItem.email && (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ color: mutedColor, width: 16 }} />
                        <a href={`mailto:${viewItem.email}`} style={{ color: colors.primary }}>{viewItem.email}</a>
                      </div>
                    )}
                    {viewItem.phone && (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faPhone} style={{ color: mutedColor, width: 16 }} />
                        <span>{viewItem.phone}</span>
                      </div>
                    )}
                    {viewItem.mobile && (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faMobile} style={{ color: mutedColor, width: 16 }} />
                        <span>{viewItem.mobile}</span>
                      </div>
                    )}
                    {!viewItem.email && !viewItem.phone && !viewItem.mobile && (
                      <div style={{ color: mutedColor, fontSize: '0.8rem' }}>No contact info available.</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.purple }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Customer</h6>
                  </div>
                  <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                    {cust ? (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faBuilding} style={{ color: mutedColor, width: 16 }} />
                        <span>{cust.company || cust.name || `Customer #${viewItem.customer_id}`}</span>
                      </div>
                    ) : (
                      <div style={{ color: mutedColor }}>No customer linked.</div>
                    )}
                    {viewItem.linkedin && (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faLink} style={{ color: '#0a66c2', width: 16 }} />
                        <a href={viewItem.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: colors.primary, wordBreak: 'break-all' }}>
                          {viewItem.linkedin}
                        </a>
                      </div>
                    )}
                    {viewItem.twitter && (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faGlobe} style={{ color: '#1da1f2', width: 16 }} />
                        <span>{viewItem.twitter}</span>
                      </div>
                    )}
                    {viewItem.birthday && (
                      <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faCakeCandles} style={{ color: mutedColor, width: 16 }} />
                        <span>{formatDate(viewItem.birthday)}</span>
                      </div>
                    )}
                  </div>
                </div>

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
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete Contact"
        isLoading={deleting}
      />
    </ErpPageShell>
  );
};

export default CrmContacts;
