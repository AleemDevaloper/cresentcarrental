import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks, faPlus, faSearch, faEye, faEdit, faTrashCan, faTimes, faSave,
  faCheckCircle, faCircleDot, faClock, faCircleXmark, faCircleExclamation,
  faFlag, faUser, faUserTie, faBuilding, faSeedling, faHandshake, faBell,
  faCalendarAlt, faAlignLeft, faLink, faRefresh, faFileExport, faFileCsv,
  faFileExcel, faSpinner, faInfoCircle, faChevronLeft, faChevronRight,
  faListCheck, faFilter, faBolt, faCircle, faRocket, faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  listTasks, createTask, updateTask, completeTask, deleteTask,
  listCustomers, listLeads, listDeals,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../components/common';
import { erpColors } from '../../../components/ui/ux/ErpTheme';

const STATUS_OPTIONS = ['todo', 'in_progress', 'done', 'cancelled'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];
const STATUS_TABS = ['all', 'todo', 'in_progress', 'done', 'cancelled'];
const PRIORITY_TABS = ['all', 'urgent', 'high', 'medium', 'low'];

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
  assigned_to: '',
  customer_id: '',
  lead_id: '',
  deal_id: '',
  reminder_at: '',
};

const PRIORITY_META = {
  urgent: { bg: 'rgba(244,63,94,0.14)', color: '#f43f5e', icon: faBolt },
  high: { bg: 'rgba(245,158,11,0.14)', color: '#f59e0b', icon: faArrowUpRightFromSquare },
  medium: { bg: 'rgba(99,102,241,0.14)', color: '#6366f1', icon: faFlag },
  low: { bg: 'rgba(100,116,139,0.14)', color: '#64748b', icon: faCircle },
};

const STATUS_META = {
  todo: { bg: 'rgba(100,116,139,0.14)', color: '#64748b', icon: faCircle },
  in_progress: { bg: 'rgba(99,102,241,0.14)', color: '#6366f1', icon: faClock },
  done: { bg: 'rgba(16,185,129,0.14)', color: '#10b981', icon: faCheckCircle },
  cancelled: { bg: 'rgba(244,63,94,0.14)', color: '#f43f5e', icon: faCircleXmark },
};

const formatDate = (val) => {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return val; }
};

const formatDateTime = (val) => {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return val; }
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

const CrmTasks = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const subtleBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [formModal, setFormModal] = useState({ show: false, mode: 'create', data: emptyForm });
  const [viewing, setViewing] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, task: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await listTasks({ perPage: 200 });
      setTasks(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load tasks';
      setLoadError(msg);
      addNotification?.(msg, 'error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const loadAux = useCallback(async () => {
    try {
      const [cRes, lRes, dRes] = await Promise.all([
        listCustomers({ perPage: 200 }).catch(() => ({ data: [] })),
        listLeads({ perPage: 200 }).catch(() => ({ data: [] })),
        listDeals({ perPage: 200 }).catch(() => ({ data: [] })),
      ]);
      setCustomers(Array.isArray(cRes?.data) ? cRes.data : []);
      setLeads(Array.isArray(lRes?.data) ? lRes.data : []);
      setDeals(Array.isArray(dRes?.data) ? dRes.data : []);
    } catch (_) { /* ignore */ }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { loadAux(); }, [loadAux]);

  const customerMap = useMemo(() => new Map(customers.map(c => [c.id, c])), [customers]);
  const leadMap = useMemo(() => new Map(leads.map(l => [l.id, l])), [leads]);
  const dealMap = useMemo(() => new Map(deals.map(d => [d.id, d])), [deals]);

  const kpiData = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const overdue = tasks.filter(t => {
      if (!t.due_date || t.status === 'done' || t.status === 'cancelled') return false;
      try { return new Date(t.due_date) < new Date(new Date().toDateString()); } catch { return false; }
    }).length;
    const urgent = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done' && t.status !== 'cancelled').length;
    return [
      { label: 'Total Tasks', val: total, icon: faListCheck, color: erpColors.primary, trend: 'up', trendVal: `${todo} pending` },
      { label: 'In Progress', val: inProgress, icon: faClock, color: erpColors.info, trend: 'up', trendVal: 'Active' },
      { label: 'Completed', val: done, icon: faCheckCircle, color: erpColors.success, trend: 'up', trendVal: 'Closed' },
      { label: 'Overdue', val: overdue, icon: faCircleExclamation, color: overdue > 0 ? erpColors.danger : erpColors.warning, trend: overdue > 0 ? 'down' : 'up', trendVal: overdue > 0 ? 'Action needed' : 'On track' },
    ];
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = (searchTerm || '').toLowerCase().trim();
    return tasks.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (q) {
        const hay = `${t.title || ''} ${t.description || ''} ${t.assigned_to || ''} ${t.assignedUser?.name || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, priorityFilter, entriesPerPage]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filtered.slice(start, start + entriesPerPage);
  }, [filtered, currentPage, entriesPerPage]);

  const openCreate = () => setFormModal({ show: true, mode: 'create', data: { ...emptyForm } });
  const openEdit = (task) => setFormModal({
    show: true,
    mode: 'edit',
    data: {
      ...emptyForm,
      ...task,
      due_date: toDateInput(task.due_date),
      reminder_at: toDateTimeInput(task.reminder_at),
    },
  });
  const closeForm = () => { setFormModal({ show: false, mode: 'create', data: emptyForm }); };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const f = formModal.data;
    if (!f.title || !String(f.title).trim()) {
      addNotification?.('Task title is required.', 'error');
      return;
    }
    const payload = { ...f };
    payload.title = String(f.title).trim();
    if (!payload.description) payload.description = null;
    if (!payload.due_date) payload.due_date = null;
    if (!payload.reminder_at) payload.reminder_at = null;
    if (!payload.assigned_to) payload.assigned_to = null;
    if (!payload.customer_id) payload.customer_id = null;
    if (!payload.lead_id) payload.lead_id = null;
    if (!payload.deal_id) payload.deal_id = null;
    setSaving(true);
    try {
      if (formModal.mode === 'create') {
        const created = await createTask(payload);
        setTasks(prev => [created, ...prev]);
        addNotification?.('Task created.', 'success');
      } else {
        const updated = await updateTask(f.id, payload);
        setTasks(prev => prev.map(t => t.id === f.id ? { ...t, ...updated } : t));
        if (viewing?.id === f.id) setViewing(prev => ({ ...prev, ...updated }));
        addNotification?.('Task updated.', 'success');
      }
      closeForm();
    } catch (err) {
      addNotification?.(err?.response?.data?.message || err?.message || 'Failed to save task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (task) => {
    try {
      const res = await completeTask(task.id);
      const next = { ...task, ...(res || {}), status: 'done' };
      setTasks(prev => prev.map(t => t.id === task.id ? next : t));
      if (viewing?.id === task.id) setViewing(next);
      addNotification?.('Task marked as complete.', 'success');
    } catch (err) {
      addNotification?.(err?.response?.data?.message || err?.message || 'Failed to complete task', 'error');
    }
  };

  const handleDelete = async () => {
    const t = deleteDialog.task;
    if (!t) return;
    setDeleting(true);
    try {
      await deleteTask(t.id);
      setTasks(prev => prev.filter(x => x.id !== t.id));
      if (viewing?.id === t.id) setViewing(null);
      addNotification?.('Task deleted.', 'success');
      setDeleteDialog({ show: false, task: null });
    } catch (err) {
      addNotification?.(err?.response?.data?.message || err?.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const PriorityBadge = ({ value }) => {
    const meta = PRIORITY_META[value] || PRIORITY_META.medium;
    return (
      <span className="premium-badge" style={{ background: meta.bg, color: meta.color, textTransform: 'capitalize' }}>
        <FontAwesomeIcon icon={meta.icon} style={{ fontSize: '0.6rem' }} />
        {value || 'medium'}
      </span>
    );
  };

  const StatusBadge = ({ value }) => {
    const meta = STATUS_META[value] || STATUS_META.todo;
    return (
      <span className="premium-badge" style={{ background: meta.bg, color: meta.color, textTransform: 'capitalize' }}>
        <FontAwesomeIcon icon={meta.icon} style={{ fontSize: '0.6rem' }} />
        {(value || 'todo').replace(/_/g, ' ')}
      </span>
    );
  };

  const RelatedCell = ({ task }) => {
    const cust = task.customer_id ? customerMap.get(task.customer_id) : null;
    const lead = task.lead_id ? leadMap.get(task.lead_id) : null;
    const deal = task.deal_id ? dealMap.get(task.deal_id) : null;
    if (cust) {
      return (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(99,102,241,0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '0.7rem' }} />
          </div>
          <div>
            <div className="fw-semibold" style={{ color: textColor, fontSize: '0.75rem' }}>{cust.company || cust.name || `Customer #${task.customer_id}`}</div>
            <div style={{ color: mutedColor, fontSize: '0.65rem' }}>Customer</div>
          </div>
        </div>
      );
    }
    if (lead) {
      return (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faSeedling} style={{ fontSize: '0.7rem' }} />
          </div>
          <div>
            <div className="fw-semibold" style={{ color: textColor, fontSize: '0.75rem' }}>{lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || `Lead #${task.lead_id}`}</div>
            <div style={{ color: mutedColor, fontSize: '0.65rem' }}>Lead</div>
          </div>
        </div>
      );
    }
    if (deal) {
      return (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faHandshake} style={{ fontSize: '0.7rem' }} />
          </div>
          <div>
            <div className="fw-semibold" style={{ color: textColor, fontSize: '0.75rem' }}>{deal.name || deal.title || `Deal #${task.deal_id}`}</div>
            <div style={{ color: mutedColor, fontSize: '0.65rem' }}>Deal</div>
          </div>
        </div>
      );
    }
    return <span style={{ color: mutedColor, fontSize: '0.75rem' }}>—</span>;
  };

  const DueDateCell = ({ task }) => {
    if (!task.due_date) return <span style={{ color: mutedColor, fontSize: '0.75rem' }}>—</span>;
    const isOverdue = (() => {
      if (task.status === 'done' || task.status === 'cancelled') return false;
      try { return new Date(task.due_date) < new Date(new Date().toDateString()); } catch { return false; }
    })();
    return (
      <div className="d-flex align-items-center gap-1" style={{ color: isOverdue ? '#f43f5e' : mutedColor, fontSize: '0.75rem' }}>
        <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.7rem' }} />
        <span className="fw-semibold" style={{ color: isOverdue ? '#f43f5e' : textColor }}>{formatDate(task.due_date)}</span>
        {isOverdue && <span className="premium-badge" style={{ background: 'rgba(244,63,94,0.14)', color: '#f43f5e', fontSize: '0.6rem', padding: '1px 6px' }}>Overdue</span>}
      </div>
    );
  };

  const AssignedCell = ({ task }) => {
    const name = task.assignedUser?.name || task.assigned_to;
    if (!name) return <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Unassigned</span>;
    const initials = String(name).trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
          {initials || <FontAwesomeIcon icon={faUser} />}
        </div>
        <span style={{ color: textColor, fontSize: '0.75rem' }}>{name}</span>
      </div>
    );
  };

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem',
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: '8px', color: textColor, outline: 'none', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.68rem', fontWeight: 600,
    color: mutedColor, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'related', label: 'Related To' },
    { key: 'assigned', label: 'Assigned To' },
    { key: 'due', label: 'Due Date' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', align: 'right' },
  ];

  const actionBtn = (color, icon, onClick, title, solid = false) => (
    <button
      className="btn btn-sm border-0"
      title={title}
      style={{
        borderRadius: '8px', color: solid ? '#fff' : mutedColor,
        background: solid ? color : 'transparent',
        padding: '4px 8px', transition: 'all 0.2s', fontSize: '0.72rem',
        boxShadow: solid ? `0 2px 6px ${color}40` : 'none',
      }}
      onClick={onClick}
      onMouseEnter={e => { if (!solid) { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.color = color; } }}
      onMouseLeave={e => { if (!solid) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; } }}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );

  const handleExport = (type) => {
    const cols = [
      { key: 'title', label: 'Title' }, { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' }, { key: 'due_date', label: 'Due Date' },
      { key: 'assigned_to', label: 'Assigned To' }, { key: 'description', label: 'Description' },
    ];
    const headers = cols.map(c => c.label);
    const rows = filtered.map(item => cols.map(c => {
      const v = item[c.key];
      if (v === null || v === undefined) return '';
      if (c.key === 'due_date') return formatDate(v) || '';
      return String(v);
    }));
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks.${type === 'xlsx' ? 'csv' : type}`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification?.(`Exported ${filtered.length} tasks.`, 'success');
  };

  const resetFilters = () => {
    setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); setGroupBy('none');
  };

  const filterSelects = (
    <div className="d-flex gap-2 flex-wrap">
      <select className="form-select form-select-sm" style={{ minWidth: 130 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        {STATUS_TABS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
      </select>
      <select className="form-select form-select-sm" style={{ minWidth: 130 }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
        {PRIORITY_TABS.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
      </select>
      <select className="form-select form-select-sm" style={{ minWidth: 130 }} value={groupBy} onChange={e => setGroupBy(e.target.value)}>
        <option value="none">No Grouping</option>
        <option value="status">Group by Status</option>
        <option value="priority">Group by Priority</option>
      </select>
      <button className="btn btn-sm premium-btn"
        style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}
        onClick={resetFilters}>
        <FontAwesomeIcon icon={faRefresh} /> Reset
      </button>
    </div>
  );

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="btn btn-sm premium-btn dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
      </ul>
    </div>
  );

  const headerAction = (
    <button className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3 premium-btn"
      style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        fontSize: '0.8rem',
      }}
      onClick={openCreate}>
      <FontAwesomeIcon icon={faPlus} /> New Task
    </button>
  );

  const groupKeys = groupBy === 'none' ? [null] : (groupBy === 'status' ? STATUS_OPTIONS : PRIORITY_OPTIONS);

  const renderRowFor = (t) => {
    const canComplete = t.status === 'todo' || t.status === 'in_progress';
    return (
      <tr key={t.id}>
        <td style={{ color: textColor, fontSize: '0.78rem' }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 28, height: 28, borderRadius: 8, background: t.status === 'done' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: t.status === 'done' ? '#10b981' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesomeIcon icon={t.status === 'done' ? faCheckCircle : faTasks} style={{ fontSize: '0.7rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ color: textColor, fontSize: '0.78rem', textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.7 : 1 }}>{t.title}</div>
              {t.description && <div style={{ color: mutedColor, fontSize: '0.7rem', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>}
            </div>
          </div>
        </td>
        <td><RelatedCell task={t} /></td>
        <td><AssignedCell task={t} /></td>
        <td><DueDateCell task={t} /></td>
        <td><PriorityBadge value={t.priority} /></td>
        <td><StatusBadge value={t.status} /></td>
        <td className="text-end">
          <div className="d-flex gap-1 justify-content-end">
            {actionBtn('#06b6d4', faEye, () => setViewing(t), 'View')}
            {actionBtn('#6366f1', faEdit, () => openEdit(t), 'Edit')}
            {canComplete && actionBtn('#10b981', faCheckCircle, () => handleComplete(t), 'Mark Complete', true)}
            {actionBtn('#f43f5e', faTrashCan, () => setDeleteDialog({ show: true, task: t }), 'Delete')}
          </div>
        </td>
      </tr>
    );
  };

  const renderGroupedTable = () => {
    if (groupBy === 'none') {
      return (
        <ErpDataTable
          columns={columns}
          data={paged}
          isDark={isDark}
          searchable
          searchPlaceholder="Search by title, description, assignee..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterSelects}
          exportButtons={exportButtons}
          currentPage={currentPage}
          entriesPerPage={entriesPerPage}
          totalEntries={filtered.length}
          onEntriesPerPageChange={(v) => { setEntriesPerPage(v); setCurrentPage(1); }}
          renderRow={renderRowFor}
        />
      );
    }
    return (
      <div className="d-flex flex-column gap-3">
        {groupKeys.map(key => {
          const groupItems = filtered.filter(t => t[groupBy] === key);
          if (!groupItems.length) return null;
          const meta = groupBy === 'status' ? STATUS_META[key] : PRIORITY_META[key];
          return (
            <div key={key} className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: 32, height: 32, borderRadius: 10, background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={meta.icon} style={{ fontSize: '0.85rem' }} />
                </div>
                <h6 className="mb-0 fw-bold" style={{ color: textColor, textTransform: 'capitalize' }}>{(key || '').replace(/_/g, ' ')}</h6>
                <span className="premium-badge" style={{ background: meta.bg, color: meta.color }}>{groupItems.length}</span>
              </div>
              <div className="premium-table-wrapper">
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        {columns.map(col => (
                          <th key={col.key} style={{ color: mutedColor, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 12px', borderBottom: `2px solid ${borderColor}`, textAlign: col.align === 'right' ? 'right' : 'left' }}>{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {groupItems.map(t => renderRowFor(t))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
        {!groupKeys.some(k => filtered.some(t => t[groupBy] === k)) && (
          <div className="text-center py-5 glass-card" style={{ borderRadius: '16px' }}>
            <FontAwesomeIcon icon={faInfoCircle} className="fs-3 mb-2 d-block opacity-50" style={{ color: mutedColor }} />
            <div className="small" style={{ color: mutedColor }}>No tasks match the current filters.</div>
          </div>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    if (groupBy !== 'none') return null;
    const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
    return (
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <span className="small" style={{ color: mutedColor }}>
          Showing {Math.min((currentPage - 1) * entriesPerPage + 1, filtered.length)} to {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} tasks
        </span>
        <div className="d-flex gap-1">
          <button className="btn btn-sm premium-btn" disabled={currentPage === 1}
            style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="px-3 py-1 small fw-bold" style={{ color: textColor }}>
            {currentPage} / {totalPages}
          </span>
          <button className="btn btn-sm premium-btn" disabled={currentPage >= totalPages}
            style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <ErpPageShell
      icon={faTasks}
      title="CRM Tasks"
      description="Plan, assign and track CRM follow-ups across customers, leads, and deals."
      badge={`${tasks.length} total`}
      action={headerAction}
    >
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
            isDark={isDark}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center py-5" style={{ color: mutedColor }}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: erpColors.primary, marginBottom: '0.75rem' }} />
          <div className="small">Loading tasks...</div>
        </div>
      )}

      {!loading && loadError && (
        <div className="alert alert-danger small mb-4" role="alert">
          <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />{loadError}
        </div>
      )}

      {!loading && !loadError && tasks.length === 0 && (
        <div className="text-center py-5 glass-card" style={{ borderRadius: '16px' }}>
          <FontAwesomeIcon icon={faListCheck} className="fs-3 mb-2 d-block opacity-50" style={{ color: mutedColor }} />
          <div className="small" style={{ color: mutedColor }}>No tasks yet. Create your first task to get started.</div>
          <button className="btn btn-sm mt-3 text-white border-0"
            style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem' }}
            onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> New Task
          </button>
        </div>
      )}

      {!loading && !loadError && tasks.length > 0 && (
        <>
          {renderGroupedTable()}
          {renderPagination()}
        </>
      )}

      {/* Create / Edit Modal */}
      {formModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem',
        }} onClick={() => !saving && closeForm()}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: '100%', maxWidth: 760,
            maxHeight: 'calc(100vh - 2rem)', overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: `1px solid ${borderColor}`,
          }} onClick={e => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faTasks} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>{formModal.mode === 'create' ? 'Create New Task' : 'Edit Task'}</h6>
                  <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{formModal.mode === 'create' ? 'Plan your next follow-up' : 'Update task details'}</div>
                </div>
              </div>
              <button onClick={() => !saving && closeForm()} className="btn btn-sm border-0" style={{ color: mutedColor, borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9' }} disabled={saving}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ padding: '1.25rem' }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label style={labelStyle}><FontAwesomeIcon icon={faListCheck} className="me-1" />Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      style={inputStyle}
                      value={formModal.data.title || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                      placeholder="Follow up with Acme Corp"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label style={labelStyle}><FontAwesomeIcon icon={faAlignLeft} className="me-1" />Description</label>
                    <textarea
                      className="form-control"
                      style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                      value={formModal.data.description || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                      placeholder="Add context, talking points, or links..."
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}><FontAwesomeIcon icon={faCircleDot} className="me-1" />Status</label>
                    <select
                      className="form-select"
                      style={inputStyle}
                      value={formModal.data.status || 'todo'}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, status: e.target.value } }))}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}><FontAwesomeIcon icon={faFlag} className="me-1" />Priority</label>
                    <select
                      className="form-select"
                      style={inputStyle}
                      value={formModal.data.priority || 'medium'}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, priority: e.target.value } }))}>
                      {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      style={inputStyle}
                      value={formModal.data.due_date || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, due_date: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}><FontAwesomeIcon icon={faBell} className="me-1" />Reminder</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      style={inputStyle}
                      value={formModal.data.reminder_at || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, reminder_at: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-12">
                    <label style={labelStyle}><FontAwesomeIcon icon={faUserTie} className="me-1" />Assigned To</label>
                    <input
                      type="text"
                      className="form-control"
                      style={inputStyle}
                      value={formModal.data.assigned_to || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, assigned_to: e.target.value } }))}
                      placeholder="User ID, email, or name"
                    />
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}><FontAwesomeIcon icon={faBuilding} className="me-1" />Customer</label>
                    <select
                      className="form-select"
                      style={inputStyle}
                      value={formModal.data.customer_id || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, customer_id: e.target.value } }))}>
                      <option value="">— None —</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.company || c.name || `Customer #${c.id}`}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}><FontAwesomeIcon icon={faSeedling} className="me-1" />Lead</label>
                    <select
                      className="form-select"
                      style={inputStyle}
                      value={formModal.data.lead_id || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, lead_id: e.target.value } }))}>
                      <option value="">— None —</option>
                      {leads.map(l => <option key={l.id} value={l.id}>{l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || `Lead #${l.id}`}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}><FontAwesomeIcon icon={faHandshake} className="me-1" />Deal</label>
                    <select
                      className="form-select"
                      style={inputStyle}
                      value={formModal.data.deal_id || ''}
                      onChange={e => setFormModal(prev => ({ ...prev, data: { ...prev.data, deal_id: e.target.value } }))}>
                      <option value="">— None —</option>
                      {deals.map(d => <option key={d.id} value={d.id}>{d.name || d.title || `Deal #${d.id}`}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-end p-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" onClick={closeForm} className="btn btn-sm px-3" disabled={saving}
                  style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}>Cancel</button>
                <button type="submit" className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" disabled={saving}
                  style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                  {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                  {formModal.mode === 'create' ? 'Create Task' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem',
        }} onClick={() => setViewing(null)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: '100%', maxWidth: 720,
            maxHeight: 'calc(100vh - 2rem)', overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: `1px solid ${borderColor}`,
          }} onClick={e => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faTasks} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>{viewing.title}</h6>
                  <div style={{ color: mutedColor, fontSize: '0.7rem' }}>Task #{viewing.id}</div>
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="btn btn-sm border-0" style={{ color: mutedColor, borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div className="d-flex gap-2 mb-3 flex-wrap">
                <StatusBadge value={viewing.status} />
                <PriorityBadge value={viewing.priority} />
                {viewing.due_date && (() => {
                  const isOverdue = viewing.status !== 'done' && viewing.status !== 'cancelled' && new Date(viewing.due_date) < new Date(new Date().toDateString());
                  return (
                    <span className="premium-badge" style={{ background: isOverdue ? 'rgba(244,63,94,0.14)' : 'rgba(99,102,241,0.14)', color: isOverdue ? '#f43f5e' : '#6366f1' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.6rem' }} />
                      Due {formatDate(viewing.due_date)}{isOverdue ? ' · Overdue' : ''}
                    </span>
                  );
                })()}
                {viewing.reminder_at && (
                  <span className="premium-badge" style={{ background: 'rgba(245,158,11,0.14)', color: '#f59e0b' }}>
                    <FontAwesomeIcon icon={faBell} style={{ fontSize: '0.6rem' }} />
                    Reminder {formatDateTime(viewing.reminder_at)}
                  </span>
                )}
              </div>

              {viewing.description && (
                <div style={{ background: subtleBg, borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faAlignLeft} className="me-1" />Description
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{viewing.description}</div>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <FontAwesomeIcon icon={faUserTie} className="me-1" />Assigned To
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewing.assignedUser?.name || viewing.assigned_to || 'Unassigned'}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Due Date
                  </div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{formatDate(viewing.due_date) || '—'}</div>
                </div>
                <div className="col-md-12">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <FontAwesomeIcon icon={faLink} className="me-1" />Related To
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {viewing.customer_id && (() => {
                      const c = customerMap.get(viewing.customer_id);
                      return c ? (
                        <a href="#" onClick={e => e.preventDefault()} className="d-inline-flex align-items-center gap-2" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1', padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', textDecoration: 'none' }}>
                          <FontAwesomeIcon icon={faBuilding} /> {c.company || c.name || `Customer #${c.id}`}
                        </a>
                      ) : <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.14)', color: '#6366f1' }}>Customer #{viewing.customer_id}</span>;
                    })()}
                    {viewing.lead_id && (() => {
                      const l = leadMap.get(viewing.lead_id);
                      return l ? (
                        <a href="#" onClick={e => e.preventDefault()} className="d-inline-flex align-items-center gap-2" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', textDecoration: 'none' }}>
                          <FontAwesomeIcon icon={faSeedling} /> {l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || `Lead #${l.id}`}
                        </a>
                      ) : <span className="premium-badge" style={{ background: 'rgba(245,158,11,0.14)', color: '#f59e0b' }}>Lead #{viewing.lead_id}</span>;
                    })()}
                    {viewing.deal_id && (() => {
                      const d = dealMap.get(viewing.deal_id);
                      return d ? (
                        <a href="#" onClick={e => e.preventDefault()} className="d-inline-flex align-items-center gap-2" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', textDecoration: 'none' }}>
                          <FontAwesomeIcon icon={faHandshake} /> {d.name || d.title || `Deal #${d.id}`}
                        </a>
                      ) : <span className="premium-badge" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>Deal #{viewing.deal_id}</span>;
                    })()}
                    {!viewing.customer_id && !viewing.lead_id && !viewing.deal_id && <span style={{ color: mutedColor, fontSize: '0.85rem' }}>No related entity</span>}
                  </div>
                </div>
                {viewing.completed_at && (
                  <div className="col-md-6">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" />Completed At
                    </div>
                    <div style={{ color: '#10b981', fontSize: '0.85rem' }}>{formatDateTime(viewing.completed_at)}</div>
                  </div>
                )}
                {viewing.created_at && (
                  <div className="col-md-6">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <FontAwesomeIcon icon={faRocket} className="me-1" />Created
                    </div>
                    <div style={{ color: textColor, fontSize: '0.85rem' }}>{formatDateTime(viewing.created_at)}</div>
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 justify-content-end pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                {(viewing.status === 'todo' || viewing.status === 'in_progress') && (
                  <button onClick={() => { handleComplete(viewing); }} className="btn btn-sm text-white border-0"
                    style={{ borderRadius: '8px', background: '#10b981', fontSize: '0.75rem', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Mark Complete
                  </button>
                )}
                <button onClick={() => { openEdit(viewing); }} className="btn btn-sm text-white border-0"
                  style={{ borderRadius: '8px', background: '#6366f1', fontSize: '0.75rem', boxShadow: '0 2px 6px rgba(99,102,241,0.4)' }}>
                  <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit
                </button>
                <button onClick={() => setViewing(null)} className="btn btn-sm px-3"
                  style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => !deleting && setDeleteDialog({ show: false, task: null })}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        itemName={deleteDialog.task?.title}
      />
    </ErpPageShell>
  );
};

export default CrmTasks;
