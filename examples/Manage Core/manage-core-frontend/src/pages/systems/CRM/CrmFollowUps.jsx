import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listFollowUps, followUpStats, createFollowUp, updateFollowUp,
  completeFollowUp, snoozeFollowUp, cancelFollowUp, deleteFollowUp,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmSearchBar, CrmConfirmDialog, CrmFollowUpCard } from '../../../components/crm';
import {
  faClock, faPlus, faCheckCircle, faExclamationTriangle, faBell, faTrash,
  faPlay, faTimes, faEdit, faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmFollowUps = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [view, setView] = useState('list'); // list | calendar
  const [stats, setStats] = useState({});
  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const loadStats = async () => {
    try { setStats(await followUpStats()); } catch {}
  };

  const load = async () => {
    setLoading(true);
    try {
      const params = { search, page, per_page: perPage };
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.type = filterType;
      const res = await listFollowUps(params);
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to load follow-ups' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { setPage(1); }, [search, filterStatus, filterType]);
  useEffect(() => { load(); }, [page, perPage, search, filterStatus, filterType]);

  const handleComplete = async (f) => {
    try {
      await completeFollowUp(f.id);
      addNotification?.({ type: 'success', message: 'Completed' });
      load(); loadStats();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleSnooze = async (f, due_at) => {
    try {
      await snoozeFollowUp(f.id, due_at);
      addNotification?.({ type: 'success', message: 'Snoozed' });
      load();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleCancel = async (f) => {
    try {
      await cancelFollowUp(f.id, 'manual');
      addNotification?.({ type: 'success', message: 'Cancelled' });
      load(); loadStats();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFollowUp(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      load(); loadStats();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Delete failed' });
    }
  };

  const columns = [
    { key: 'subject', label: 'Subject', render: (v, r) => (
      <div>
        <strong>{v}</strong>
        {r.description && <div className="small" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{r.description.substring(0, 80)}</div>}
      </div>
    )},
    { key: 'type', label: 'Type', render: (v) => <span className="badge bg-secondary">{v}</span> },
    { key: 'status', label: 'Status', render: (v, r) => {
      const overdue = r.due_at && new Date(r.due_at) < new Date() && !['completed', 'cancelled'].includes(v);
      return (
        <span style={{
          color: overdue ? '#ef4444' : v === 'completed' ? '#10b981' : v === 'cancelled' ? '#94a3b8' : '#6366f1',
          fontWeight: 600,
        }}>
          {overdue ? '⚠ Overdue' : v}
        </span>
      );
    }},
    { key: 'priority', label: 'Priority', render: (v) => (
      <span style={{
        color: v === 'urgent' ? '#ef4444' : v === 'high' ? '#f59e0b' : v === 'medium' ? '#0ea5e9' : '#94a3b8',
      }}>{v}</span>
    )},
    { key: 'due_at', label: 'Due', render: (v) => v ? new Date(v).toLocaleString() : '—' },
    { key: 'assignee', label: 'Assignee', render: (v, r) => r.assigned_user?.name || '—' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        {row.status !== 'completed' && row.status !== 'cancelled' && (
          <button className="btn btn-sm text-success" onClick={() => handleComplete(row)} title="Complete"><FontAwesomeIcon icon={faCheckCircle} /></button>
        )}
        <button className="btn btn-sm" onClick={() => setModal(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faClock}
      title="Follow-Ups"
      description="Manage all scheduled follow-ups across leads, contacts, companies and deals."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Schedule Follow-up
        </button>
      }
    >
      <div className="row g-3 mb-3">
        <div className="col-md-2"><ErpKpiCard title="Due Today" value={stats.due_today || 0} icon={faCalendar} color="#0ea5e9" /></div>
        <div className="col-md-2"><ErpKpiCard title="Overdue" value={stats.overdue || 0} icon={faExclamationTriangle} color="#ef4444" /></div>
        <div className="col-md-2"><ErpKpiCard title="Upcoming" value={stats.upcoming || 0} icon={faBell} color="#f59e0b" /></div>
        <div className="col-md-2"><ErpKpiCard title="Completed" value={stats.completed || 0} icon={faCheckCircle} color="#10b981" /></div>
        <div className="col-md-2"><ErpKpiCard title="Snoozed" value={stats.snoozed || 0} icon={faClock} color="#8b5cf6" /></div>
        <div className="col-md-2"><ErpKpiCard title="Failed" value={stats.failed || 0} icon={faTimes} color="#94a3b8" /></div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {['pending', 'due', 'completed', 'snoozed', 'cancelled', 'failed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {['email', 'call', 'task', 'meeting', 'reminder'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search follow-ups..."
        searchTerm={search}
        onSearchChange={setSearch}
        currentPage={data.meta.current_page}
        totalPages={data.meta.last_page}
        entriesPerPage={perPage}
        totalEntries={data.meta.total}
        onPageChange={setPage}
        onEntriesPerPageChange={(v) => { setPerPage(v); setPage(1); }}
        isDark={isDark}
      />

      <FollowUpModal
        isOpen={!!modal}
        followUp={modal}
        onClose={() => setModal(null)}
        onSaved={() => { setModal(null); load(); loadStats(); }}
        isDark={isDark}
      />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Follow-up"
        message={`Delete "${confirmDel?.subject}"?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const FollowUpModal = ({ isOpen, followUp, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (followUp) {
      setForm({
        subject: followUp.subject || '',
        description: followUp.description || '',
        type: followUp.type || 'email',
        priority: followUp.priority || 'medium',
        status: followUp.status || 'pending',
        due_at: followUp.due_at ? new Date(followUp.due_at).toISOString().slice(0, 16) : '',
        lead_id: followUp.lead_id || null,
        contact_id: followUp.contact_id || null,
        customer_id: followUp.customer_id || null,
        deal_id: followUp.deal_id || null,
        assigned_to: followUp.assigned_to || null,
      });
    }
  }, [followUp]);

  const save = async () => {
    if (!form.subject || !form.due_at) {
      addNotification?.({ type: 'error', message: 'Subject and due date required' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, due_at: new Date(form.due_at).toISOString() };
      if (followUp?.id) {
        await updateFollowUp(followUp.id, payload);
      } else {
        await createFollowUp(payload);
      }
      addNotification?.({ type: 'success', message: 'Saved' });
      onSaved?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title={followUp?.id ? 'Edit Follow-up' : 'Schedule Follow-up'} size="md" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <label className="form-label">Subject *</label>
      <input className="form-control mb-2" value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <label className="form-label">Description</label>
      <textarea className="form-control mb-2" rows="3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Type</label>
          <select className="form-select mb-2" value={form.type || 'email'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {['email', 'call', 'task', 'meeting', 'reminder'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Priority</label>
          <select className="form-select mb-2" value={form.priority || 'medium'} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <label className="form-label">Due Date & Time *</label>
      <input type="datetime-local" className="form-control mb-3" value={form.due_at || ''} onChange={(e) => setForm({ ...form, due_at: e.target.value })} />
    </CrmModal>
  );
};

export default CrmFollowUps;