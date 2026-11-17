import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck, faPlus, faSearch, faRefresh, faFileExport,
  faEye, faPen, faTrashCan, faFileCsv, faFileExcel, faFilePdf,
  faSpinner, faInfoCircle, faCircleCheck, faChevronDown, faXmark,
  faPhone, faEnvelope, faUsers, faCheckSquare, faComment, faStickyNote,
  faDesktop, faRedo, faCalendarAlt, faClock, faFlag, faUser, faUserTie,
  faBuilding, faHandshake, faSeedling, faCircle, faRocket, faMapMarkerAlt,
  faListCheck, faFilter, faAlignLeft, faLink, faMessage
} from '@fortawesome/free-solid-svg-icons';
import {
  listActivities, createActivity, updateActivity, completeActivity, deleteActivity,
  listCustomers, listLeads, listDeals
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import Modal from '../../../components/common/Modal';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';

const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call', icon: faPhone, color: '#06b6d4' },
  { value: 'email', label: 'Email', icon: faEnvelope, color: '#6366f1' },
  { value: 'meeting', label: 'Meeting', icon: faUsers, color: '#8b5cf6' },
  { value: 'task', label: 'Task', icon: faCheckSquare, color: '#10b981' },
  { value: 'sms', label: 'SMS', icon: faComment, color: '#f59e0b' },
  { value: 'note', label: 'Note', icon: faStickyNote, color: '#64748b' },
  { value: 'whatsapp', label: 'WhatsApp', icon: faMessage, color: '#25d366' },
  { value: 'demo', label: 'Demo', icon: faDesktop, color: '#ec4899' },
  { value: 'follow_up', label: 'Follow Up', icon: faRedo, color: '#f43f5e' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'overdue', label: 'Overdue' },
];

const STATUS_META = {
  pending: { bg: 'rgba(245,158,11,0.14)', color: '#f59e0b' },
  in_progress: { bg: 'rgba(99,102,241,0.14)', color: '#6366f1' },
  completed: { bg: 'rgba(16,185,129,0.14)', color: '#10b981' },
  cancelled: { bg: 'rgba(100,116,139,0.14)', color: '#64748b' },
};

const PRIORITY_META = {
  urgent: { bg: 'rgba(244,63,94,0.14)', color: '#f43f5e' },
  high: { bg: 'rgba(245,158,11,0.14)', color: '#f59e0b' },
  medium: { bg: 'rgba(99,102,241,0.14)', color: '#6366f1' },
  low: { bg: 'rgba(100,116,139,0.14)', color: '#64748b' },
};

const getActivityTypeMeta = (type) => {
  return ACTIVITY_TYPES.find((t) => t.value === type) || { value: type || 'task', label: type || 'Task', icon: faCheckSquare, color: '#6366f1' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const toDateInput = (val) => {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch { return ''; }
};

const toDateTimeInput = (val) => {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
  } catch { return ''; }
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
  type: 'task',
  subject: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  duration_minutes: '',
  outcome: '',
  customer_id: '',
  lead_id: '',
  deal_id: '',
  contact_id: '',
  assigned_to: '',
  location: '',
};

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

const isInThisWeek = (d) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
};

const CrmActivities = () => {
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

  const [activities, setActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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

  const customerMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);
  const leadMap = useMemo(() => new Map(leads.map((l) => [l.id, l])), [leads]);
  const dealMap = useMemo(() => new Map(deals.map((d) => [d.id, d])), [deals]);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentPage) params.page = currentPage;
      if (perPage) params.per_page = perPage;
      if (searchTerm) params.search = searchTerm;
      const res = await listActivities(params);
      const list = res?.data || [];
      const meta = res?.meta || {};
      setActivities(list);
      setTotal(meta.total ?? list.length);
      setLastPage(meta.last_page ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load activities';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, addNotification]);

  const fetchAux = useCallback(async () => {
    try {
      const [cRes, lRes, dRes] = await Promise.all([
        listCustomers({ per_page: 200 }).catch(() => ({ data: [] })),
        listLeads({ per_page: 200 }).catch(() => ({ data: [] })),
        listDeals({ per_page: 200 }).catch(() => ({ data: [] })),
      ]);
      setCustomers(Array.isArray(cRes?.data) ? cRes.data : []);
      setLeads(Array.isArray(lRes?.data) ? lRes.data : []);
      setDeals(Array.isArray(dRes?.data) ? dRes.data : []);
    } catch (_) { /* ignore */ }
  }, []);

  useEffect(() => { fetchAux(); }, [fetchAux]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchActivities();
    }, 200);
    return () => clearTimeout(t);
  }, [fetchActivities]);

  useEffect(() => {
    const onRefresh = () => fetchActivities();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [fetchActivities]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab]);

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    if (activeTab === 'all') return activities;
    return activities.filter((a) => {
      if (!a.due_date) return activeTab === 'all';
      const d = new Date(a.due_date);
      if (Number.isNaN(d.getTime())) return false;
      if (a.status === 'completed' || a.status === 'cancelled') return false;
      if (activeTab === 'today') return isSameDay(d, now);
      if (activeTab === 'week') return isInThisWeek(d);
      if (activeTab === 'overdue') return d < today;
      return true;
    });
  }, [activities, activeTab]);

  const kpiData = useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const todayCount = activities.filter((a) => {
      if (!a.due_date) return false;
      if (a.status === 'completed' || a.status === 'cancelled') return false;
      const d = new Date(a.due_date);
      return !Number.isNaN(d.getTime()) && isSameDay(d, now);
    }).length;
    const overdueCount = activities.filter((a) => {
      if (!a.due_date) return false;
      if (a.status === 'completed' || a.status === 'cancelled') return false;
      const d = new Date(a.due_date);
      return !Number.isNaN(d.getTime()) && d < today;
    }).length;
    const completedThisWeek = activities.filter((a) => {
      if (a.status !== 'completed') return false;
      const d = new Date(a.completed_at || a.updated_at || a.due_date);
      return !Number.isNaN(d.getTime()) && d >= weekAgo;
    }).length;
    const totalCount = total || activities.length;
    return [
      { label: "Today's Activities", val: todayCount, icon: faCalendarCheck, color: colors.primary, trend: 'up', trendVal: 'Scheduled' },
      { label: 'Overdue', val: overdueCount, icon: faClock, color: overdueCount > 0 ? colors.danger : colors.success, trend: overdueCount > 0 ? 'down' : 'up', trendVal: overdueCount > 0 ? 'Action needed' : 'On track' },
      { label: 'Completed This Week', val: completedThisWeek, icon: faCircleCheck, color: colors.success, trend: 'up', trendVal: 'Last 7 days' },
      { label: 'Total Activities', val: totalCount, icon: faListCheck, color: colors.info, trend: 'up', trendVal: `${totalCount} total` },
    ];
  }, [activities, total, colors]);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      type: row.type || 'task',
      subject: row.subject || row.title || '',
      description: row.description || '',
      status: row.status || 'pending',
      priority: row.priority || 'medium',
      due_date: toDateInput(row.due_date),
      duration_minutes: row.duration_minutes ?? '',
      outcome: row.outcome || '',
      customer_id: row.customer_id ?? '',
      lead_id: row.lead_id ?? '',
      deal_id: row.deal_id ?? '',
      contact_id: row.contact_id ?? '',
      assigned_to: row.assigned_to || '',
      location: row.location || '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleView = (row) => setViewItem(row);

  const handleDeleteClick = (row) => {
    const name = row.subject || row.title || `Activity #${row.id}`;
    setDeleteDialog({ show: true, id: row.id, name, row });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteActivity(deleteDialog.id);
      addNotification?.('Activity deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchActivities();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete activity';
      addNotification?.(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleComplete = async (row) => {
    try {
      const res = await completeActivity(row.id);
      const next = { ...row, ...(res || {}), status: 'completed' };
      setActivities((prev) => prev.map((a) => (a.id === row.id ? next : a)));
      if (viewItem?.id === row.id) setViewItem(next);
      addNotification?.('Activity marked as complete.', 'success');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to complete activity';
      addNotification?.(msg, 'error');
    }
  };

  const validateForm = () => {
    if (!formData.subject?.trim()) {
      return 'Subject is required.';
    }
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
        subject: formData.subject.trim(),
        customer_id: formData.customer_id === '' ? null : Number(formData.customer_id),
        lead_id: formData.lead_id === '' ? null : Number(formData.lead_id),
        deal_id: formData.deal_id === '' ? null : Number(formData.deal_id),
        contact_id: formData.contact_id === '' ? null : Number(formData.contact_id),
        duration_minutes: formData.duration_minutes === '' ? null : Number(formData.duration_minutes),
        due_date: formData.due_date || null,
        description: formData.description || null,
        outcome: formData.outcome || null,
        assigned_to: formData.assigned_to || null,
        location: formData.location || null,
      };
      if (editingId) {
        await updateActivity(editingId, payload);
        addNotification?.('Activity updated successfully.', 'success');
      } else {
        await createActivity(payload);
        addNotification?.('Activity created successfully.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchActivities();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save activity';
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
      const tMeta = getActivityTypeMeta(r.type);
      const cust = customerMap.get(r.customer_id);
      const lead = leadMap.get(r.lead_id);
      const deal = dealMap.get(r.deal_id);
      let related = '';
      if (cust) related = `Customer: ${cust.company || cust.name || ''}`;
      else if (lead) related = `Lead: ${lead.name || ''}`;
      else if (deal) related = `Deal: ${deal.name || deal.title || ''}`;
      return {
        Type: tMeta.label,
        Subject: r.subject || r.title || '',
        'Related To': related,
        'Assigned To': r.assignedUser?.name || r.assigned_to || '',
        'Due Date': r.due_date || '',
        Priority: r.priority || '',
        Status: r.status || '',
        Duration: r.duration_minutes ?? '',
        'Created At': r.created_at || '',
      };
    });
  };

  const exportCsv = () => {
    const rows = buildExportRows(activities);
    if (rows.length === 0) { addNotification?.('No activities to export.', 'warning'); return; }
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(','), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))];
    downloadBlob(new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' }), `crm-activities-${new Date().toISOString().slice(0, 10)}.csv`);
    addNotification?.('Activities exported as CSV.', 'success');
    setExportOpen(false);
  };

  const exportExcel = () => {
    const rows = buildExportRows(activities);
    if (rows.length === 0) { addNotification?.('No activities to export.', 'warning'); return; }
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(','), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))];
    const csvContent = csvRows.join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `crm-activities-${new Date().toISOString().slice(0, 10)}.xlsx`);
    a.click();
    addNotification?.('Activities exported as Excel.', 'success');
    setExportOpen(false);
  };

  const exportPdf = () => {
    const rows = activities;
    if (rows.length === 0) { addNotification?.('No activities to export.', 'warning'); return; }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CRM Activities</title>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; background: #fff; }
        th { background: #6366f1; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print { body { background: #fff; padding: 0; } }
      </style></head><body>
      <h1>CRM Activities — ${new Date().toLocaleDateString()}</h1>
      <table><thead><tr>
        <th>Type</th><th>Subject</th><th>Due Date</th><th>Assigned</th><th>Priority</th><th>Status</th>
      </tr></thead><tbody>
      ${rows.map((r) => {
        const tMeta = getActivityTypeMeta(r.type);
        return `<tr>
          <td>${tMeta.label}</td>
          <td>${r.subject || r.title || ''}</td>
          <td>${formatDate(r.due_date)}</td>
          <td>${r.assignedUser?.name || r.assigned_to || ''}</td>
          <td>${r.priority || ''}</td>
          <td>${r.status || ''}</td>
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
      key: 'type', label: 'Type', width: '140px', render: (val, row) => {
        const meta = getActivityTypeMeta(val);
        return (
          <span className="premium-badge" style={{ background: `${meta.color}22`, color: meta.color, textTransform: 'capitalize' }}>
            <FontAwesomeIcon icon={meta.icon} style={{ fontSize: '0.65rem' }} />
            {meta.label}
          </span>
        );
      }
    },
    {
      key: 'subject', label: 'Subject', bold: true, render: (val, row) => (
        <div className="d-flex flex-column" style={{ minWidth: 0 }}>
          <span style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">
            {val || row.title || '—'}
          </span>
          {row.description && (
            <span style={{ color: mutedColor, fontSize: '0.7rem', maxWidth: 240 }} className="text-truncate d-inline-block">
              {row.description}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'related', label: 'Related To', render: (val, row) => {
        if (row.customer_id) {
          const c = customerMap.get(row.customer_id);
          return (
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(99,102,241,0.15)', color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '0.65rem' }} />
              </div>
              <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                <span style={{ color: textColor, fontSize: '0.75rem', fontWeight: 600 }} className="text-truncate">{c ? (c.company || c.name || `Customer #${row.customer_id}`) : `Customer #${row.customer_id}`}</span>
                <span style={{ color: mutedColor, fontSize: '0.65rem' }}>Customer</span>
              </div>
            </div>
          );
        }
        if (row.lead_id) {
          const l = leadMap.get(row.lead_id);
          return (
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(245,158,11,0.15)', color: colors.warning, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faSeedling} style={{ fontSize: '0.65rem' }} />
              </div>
              <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                <span style={{ color: textColor, fontSize: '0.75rem', fontWeight: 600 }} className="text-truncate">{l ? (l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || `Lead #${row.lead_id}`) : `Lead #${row.lead_id}`}</span>
                <span style={{ color: mutedColor, fontSize: '0.65rem' }}>Lead</span>
              </div>
            </div>
          );
        }
        if (row.deal_id) {
          const d = dealMap.get(row.deal_id);
          return (
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faHandshake} style={{ fontSize: '0.65rem' }} />
              </div>
              <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                <span style={{ color: textColor, fontSize: '0.75rem', fontWeight: 600 }} className="text-truncate">{d ? (d.name || d.title || `Deal #${row.deal_id}`) : `Deal #${row.deal_id}`}</span>
                <span style={{ color: mutedColor, fontSize: '0.65rem' }}>Deal</span>
              </div>
            </div>
          );
        }
        return <span style={{ color: mutedColor, fontSize: '0.75rem' }}>—</span>;
      }
    },
    {
      key: 'assigned_to', label: 'Assigned To', render: (val, row) => {
        const name = row.assignedUser?.name || row.assigned_to;
        if (!name) return <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Unassigned</span>;
        const initials = String(name).trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
        return (
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>
              {initials || <FontAwesomeIcon icon={faUser} />}
            </div>
            <span style={{ color: textColor, fontSize: '0.75rem' }}>{name}</span>
          </div>
        );
      }
    },
    {
      key: 'due_date', label: 'Due Date', render: (val, row) => {
        if (!val) return <span style={{ color: mutedColor, fontSize: '0.75rem' }}>—</span>;
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isOverdue = (row.status !== 'completed' && row.status !== 'cancelled' && !Number.isNaN(d.getTime()) && d < today);
        return (
          <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: isOverdue ? colors.danger : mutedColor }}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.7rem' }} />
            <span className="fw-semibold" style={{ color: isOverdue ? colors.danger : textColor }}>{formatDate(val)}</span>
            {isOverdue && <span className="premium-badge" style={{ background: 'rgba(244,63,94,0.14)', color: colors.danger, fontSize: '0.6rem', padding: '1px 6px' }}>Overdue</span>}
          </div>
        );
      }
    },
    {
      key: 'priority', label: 'Priority', width: '110px', render: (val) => {
        const meta = PRIORITY_META[val] || PRIORITY_META.medium;
        return (
          <span className="premium-badge" style={{ background: meta.bg, color: meta.color, textTransform: 'capitalize' }}>
            {val || 'medium'}
          </span>
        );
      }
    },
    {
      key: 'status', label: 'Status', width: '130px', render: (val) => {
        const meta = STATUS_META[val] || STATUS_META.pending;
        return (
          <span className="premium-badge" style={{ background: meta.bg, color: meta.color, textTransform: 'capitalize' }}>
            <FontAwesomeIcon icon={val === 'completed' ? faCircleCheck : val === 'in_progress' ? faClock : val === 'cancelled' ? faXmark : faCircle} style={{ fontSize: '0.6rem' }} />
            {(val || 'pending').replace(/_/g, ' ')}
          </span>
        );
      }
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
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569', border: 'none', padding: '5px 9px' }}
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faPen} style={{ fontSize: '0.85rem' }} />
          </button>
          {(row.status === 'pending' || row.status === 'in_progress') && (
            <button
              className="btn btn-sm premium-btn"
              title="Mark Complete"
              style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', border: 'none', padding: '5px 9px' }}
              onClick={() => handleComplete(row)}
            >
              <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '0.85rem' }} />
            </button>
          )}
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

  const renderTabs = () => (
    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div className="erp-tab-container">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`erp-tab-btn ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="d-flex gap-2">
        <div className="input-group input-group-sm" style={{ minWidth: 240 }}>
          <span className="input-group-text bg-transparent" style={{ borderColor, color: mutedColor }}>
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search activities…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: inputBg, color: textColor, borderColor }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <ErpPageShell
      icon={faCalendarCheck}
      title="CRM Activities & Tasks"
      description="Log calls, emails, meetings, demos, and follow-ups. Keep your sales motion on track with timely reminders."
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
            onClick={fetchActivities}
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
            <FontAwesomeIcon icon={faPlus} /> New Activity
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

      {renderTabs()}

      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="small">{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchActivities}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      )}

      <ErpDataTable
        columns={columns}
        data={filteredActivities}
        loading={loading}
        error={null}
        emptyMessage={activeTab === 'all' ? 'No activities found. Create your first activity to get started.' : `No activities for "${STATUS_TABS.find((t) => t.value === activeTab)?.label}".`}
        emptyIcon={faCalendarCheck}
        isDark={isDark}
        title="Activities"
        titleIcon={faCalendarCheck}
        accentColor={colors.primary}
        currentPage={currentPage}
        totalPages={lastPage}
        totalEntries={filteredActivities.length}
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
            <span>{editingId ? 'Edit Activity' : 'New Activity'}</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: '0.7rem', color: mutedColor }}>
              {editingId ? 'Updating existing activity' : 'Log a new touchpoint with your customer'}
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
                {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Update Activity' : 'Create Activity'}</>}
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
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Activity Details</h6>
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Type</label>
              <select
                className="form-select form-select-sm"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Subject *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
                placeholder="e.g. Follow up on proposal"
                style={{ background: inputBg, color: textColor, borderColor }}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Description</label>
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Notes, talking points, context…"
                style={{ background: inputBg, color: textColor, borderColor, resize: 'vertical' }}
              />
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Priority</label>
              <select
                className="form-select form-select-sm"
                value={formData.priority}
                onChange={(e) => handleFormChange('priority', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Due Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.due_date}
                onChange={(e) => handleFormChange('due_date', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Duration (min)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.duration_minutes}
                onChange={(e) => handleFormChange('duration_minutes', e.target.value)}
                placeholder="e.g. 30"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Outcome / Result</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.outcome}
                onChange={(e) => handleFormChange('outcome', e.target.value)}
                placeholder="e.g. Customer requested a proposal"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.purple }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Related Entity</h6>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Customer</label>
              <select
                className="form-select form-select-sm"
                value={formData.customer_id}
                onChange={(e) => handleFormChange('customer_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">— None —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company || c.name || `Customer #${c.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Lead</label>
              <select
                className="form-select form-select-sm"
                value={formData.lead_id}
                onChange={(e) => handleFormChange('lead_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">— None —</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>{l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || `Lead #${l.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Deal</label>
              <select
                className="form-select form-select-sm"
                value={formData.deal_id}
                onChange={(e) => handleFormChange('deal_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">— None —</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>{d.name || d.title || `Deal #${d.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Contact ID</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.contact_id}
                onChange={(e) => handleFormChange('contact_id', e.target.value)}
                placeholder="Optional"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.info }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Assignment & Location</h6>
              </div>
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
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Location</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder="e.g. Zoom, Office, On-site"
                style={{ background: inputBg, color: textColor, borderColor }}
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
            <FontAwesomeIcon icon={faCalendarCheck} style={{ color: colors.primary }} />
            <span>Activity Details</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-end w-100 gap-2">
            {(viewItem?.status === 'pending' || viewItem?.status === 'in_progress') && (
              <button
                type="button"
                className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
                onClick={() => { handleComplete(viewItem); setViewItem(null); }}
                style={{ borderRadius: '8px', background: colors.success, boxShadow: '0 2px 6px rgba(16,185,129,0.4)', fontSize: '0.75rem' }}
              >
                <FontAwesomeIcon icon={faCircleCheck} /> Mark Complete
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
              onClick={() => { const v = viewItem; setViewItem(null); handleEdit(v); }}
              style={{ borderRadius: '8px', background: colors.primary, boxShadow: '0 2px 6px rgba(99,102,241,0.4)', fontSize: '0.75rem' }}
            >
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setViewItem(null)}
              style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}
            >
              Close
            </button>
          </div>
        }
      >
        {viewItem && (() => {
          const tMeta = getActivityTypeMeta(viewItem.type);
          const cust = viewItem.customer_id ? customerMap.get(viewItem.customer_id) : null;
          const lead = viewItem.lead_id ? leadMap.get(viewItem.lead_id) : null;
          const deal = viewItem.deal_id ? dealMap.get(viewItem.deal_id) : null;
          const statusMeta = STATUS_META[viewItem.status] || STATUS_META.pending;
          const priorityMeta = PRIORITY_META[viewItem.priority] || PRIORITY_META.medium;
          return (
            <>
              <div
                className="mb-3"
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, ${tMeta.color}22, ${tMeta.color}10)`
                    : `linear-gradient(135deg, ${tMeta.color}15, ${tMeta.color}08)`,
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: `1px solid ${tMeta.color}40`,
                }}
              >
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div style={{
                    width: 56, height: 56, borderRadius: '14px',
                    background: `${tMeta.color}25`, color: tMeta.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                  }}>
                    <FontAwesomeIcon icon={tMeta.icon} />
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor }}>{viewItem.subject || viewItem.title || 'Untitled activity'}</div>
                    <div style={{ fontSize: '0.85rem', color: mutedColor }}>{tMeta.label} · #{viewItem.id}</div>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      <span className="premium-badge" style={{ background: statusMeta.bg, color: statusMeta.color }}>
                        <FontAwesomeIcon icon={viewItem.status === 'completed' ? faCircleCheck : faCircle} style={{ fontSize: '0.6rem' }} />
                        {(viewItem.status || 'pending').replace(/_/g, ' ')}
                      </span>
                      <span className="premium-badge" style={{ background: priorityMeta.bg, color: priorityMeta.color, textTransform: 'capitalize' }}>
                        <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.6rem' }} />
                        {viewItem.priority || 'medium'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {viewItem.description && (
                <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faAlignLeft} className="me-1" />Description
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{viewItem.description}</div>
                </div>
              )}

              {viewItem.outcome && (
                <div style={{ background: isDark ? 'rgba(16,185,129,0.08)' : '#ecfdf5', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: `1px solid ${colors.success}30` }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: colors.success, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faCircleCheck} className="me-1" />Outcome
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.outcome}</div>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Due Date
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{formatDate(viewItem.due_date)}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <FontAwesomeIcon icon={faUserTie} className="me-1" />Assigned To
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.assignedUser?.name || viewItem.assigned_to || 'Unassigned'}</div>
                </div>
                {viewItem.duration_minutes != null && viewItem.duration_minutes !== '' && (
                  <div className="col-md-6">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <FontAwesomeIcon icon={faClock} className="me-1" />Duration
                    </div>
                    <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.duration_minutes} min</div>
                  </div>
                )}
                {viewItem.location && (
                  <div className="col-md-6">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />Location
                    </div>
                    <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.location}</div>
                  </div>
                )}
                <div className="col-12">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faLink} className="me-1" />Related To
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {cust && (
                      <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.14)', color: colors.primary, padding: '6px 12px' }}>
                        <FontAwesomeIcon icon={faBuilding} className="me-1" /> {cust.company || cust.name || `Customer #${cust.id}`}
                      </span>
                    )}
                    {lead && (
                      <span className="premium-badge" style={{ background: 'rgba(245,158,11,0.14)', color: colors.warning, padding: '6px 12px' }}>
                        <FontAwesomeIcon icon={faSeedling} className="me-1" /> {lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || `Lead #${lead.id}`}
                      </span>
                    )}
                    {deal && (
                      <span className="premium-badge" style={{ background: 'rgba(16,185,129,0.14)', color: colors.success, padding: '6px 12px' }}>
                        <FontAwesomeIcon icon={faHandshake} className="me-1" /> {deal.name || deal.title || `Deal #${deal.id}`}
                      </span>
                    )}
                    {!cust && !lead && !deal && <span style={{ color: mutedColor, fontSize: '0.85rem' }}>No related entity</span>}
                  </div>
                </div>
                {viewItem.completed_at && (
                  <div className="col-md-6">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <FontAwesomeIcon icon={faCircleCheck} className="me-1" />Completed At
                    </div>
                    <div style={{ color: colors.success, fontSize: '0.85rem' }}>{formatDateTime(viewItem.completed_at)}</div>
                  </div>
                )}
                {viewItem.created_at && (
                  <div className="col-md-6">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <FontAwesomeIcon icon={faRocket} className="me-1" />Created
                    </div>
                    <div style={{ color: textColor, fontSize: '0.85rem' }}>{formatDateTime(viewItem.created_at)}</div>
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
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete Activity"
        isLoading={deleting}
      />
    </ErpPageShell>
  );
};

export default CrmActivities;
