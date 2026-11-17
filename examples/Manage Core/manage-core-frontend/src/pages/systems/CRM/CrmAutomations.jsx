import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listAutomations, createAutomation, updateAutomation, deleteAutomation,
  toggleAutomation, listAutomationRuns, getAutomation,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog } from '../../../components/crm';
import {
  faBolt, faPlus, faPlay, faPause, faTrash, faEdit, faTimes, faCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EVENT_TYPES = [
  { value: 'lead.created', label: 'Lead Created' },
  { value: 'lead.status_changed', label: 'Lead Status Changed' },
  { value: 'lead.assigned', label: 'Lead Assigned' },
  { value: 'lead.converted', label: 'Lead Converted' },
  { value: 'deal.created', label: 'Deal Created' },
  { value: 'deal.stage_changed', label: 'Deal Stage Changed' },
  { value: 'deal.won', label: 'Deal Won' },
  { value: 'deal.lost', label: 'Deal Lost' },
  { value: 'email.received', label: 'Email Received' },
  { value: 'email.opened', label: 'Email Opened' },
  { value: 'email.clicked', label: 'Email Clicked' },
  { value: 'email.sent', label: 'Email Sent' },
  { value: 'followup.completed', label: 'Follow-up Completed' },
  { value: 'contact.created', label: 'Contact Created' },
];

const ACTION_TYPES = [
  { value: 'create_task', label: 'Create Task' },
  { value: 'send_email', label: 'Send Email' },
  { value: 'create_followup', label: 'Create Follow-up' },
  { value: 'assign_user', label: 'Assign User' },
  { value: 'change_status', label: 'Change Status' },
  { value: 'add_tag', label: 'Add Tag' },
  { value: 'remove_tag', label: 'Remove Tag' },
  { value: 'create_notification', label: 'Create Notification' },
  { value: 'start_sequence', label: 'Start Sequence' },
  { value: 'stop_sequence', label: 'Stop Sequence' },
  { value: 'webhook', label: 'Call Webhook' },
  { value: 'update_field', label: 'Update Field' },
];

const CrmAutomations = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modal, setModal] = useState(null);
  const [runs, setRuns] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listAutomations({ search, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, perPage, search]);

  const toggle = async (a) => {
    try {
      await toggleAutomation(a.id);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const viewRuns = async (a) => {
    try {
      const res = await listAutomationRuns(a.id, { page: 1, per_page: 50 });
      setRuns({ automation: a, runs: res.data });
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to load runs' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAutomation(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (v) => <strong>{v}</strong> },
    { key: 'description', label: 'Description', render: (v) => v ? v.substring(0, 80) : '—' },
    { key: 'is_active', label: 'Status', render: (v, r) => (
      <span style={{ color: v ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
        {v ? '● Active' : '○ Paused'}
        {r.test_mode && <span className="badge bg-warning ms-2">Test</span>}
      </span>
    )},
    { key: 'execution_count', label: 'Runs', align: 'right' },
    { key: 'success_count', label: 'Success', align: 'right' },
    { key: 'failure_count', label: 'Failed', align: 'right' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={() => toggle(row)} title="Toggle"><FontAwesomeIcon icon={row.is_active ? faPause : faPlay} style={{ color: row.is_active ? '#f59e0b' : '#10b981' }} /></button>
        <button className="btn btn-sm" onClick={() => viewRuns(row)} title="View Runs"><FontAwesomeIcon icon={faCode} /></button>
        <button className="btn btn-sm" onClick={() => setModal(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faBolt}
      title="Automations"
      description="Visual workflow automation with triggers, conditions and actions."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Automation
        </button>
      }
    >
      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search automations..."
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

      <AutomationModal
        isOpen={!!modal}
        automation={modal}
        onClose={() => setModal(null)}
        onSaved={() => { setModal(null); fetch(); }}
        isDark={isDark}
      />

      <CrmModal isOpen={!!runs} onClose={() => setRuns(null)} title={`Runs: ${runs?.automation?.name || ''}`} size="lg" isDark={isDark}>
        {runs && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {runs.runs.length === 0 && <p>No runs.</p>}
            {runs.runs.map(r => (
              <div key={r.id} className="p-2 mb-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between">
                  <span style={{ color: r.status === 'completed' ? '#10b981' : r.status === 'failed' ? '#ef4444' : '#0ea5e9', fontWeight: 600 }}>
                    {r.status}
                  </span>
                  <small>{new Date(r.created_at).toLocaleString()}</small>
                </div>
                <small>{r.entity_type} #{r.entity_id} • Actions: {r.actions_executed}</small>
                {r.error && <div className="small text-danger">{r.error}</div>}
              </div>
            ))}
          </div>
        )}
      </CrmModal>

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Automation"
        message={`Delete automation "${confirmDel?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const AutomationModal = ({ isOpen, automation, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', description: '', is_active: true, test_mode: false, triggers: [], conditions: [], actions: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (automation?.id) {
      setForm({
        name: automation.name || '',
        description: automation.description || '',
        is_active: automation.is_active !== false,
        test_mode: automation.test_mode || false,
        triggers: automation.triggers || [],
        conditions: automation.conditions || [],
        actions: automation.actions || [],
      });
    } else if (automation) {
      setForm({ name: '', description: '', is_active: true, test_mode: false, triggers: [{ event: '' }], conditions: [], actions: [{ type: 'create_task' }] });
    }
  }, [automation]);

  const save = async () => {
    if (!form.name || !form.triggers.length || !form.actions.length) {
      addNotification?.({ type: 'error', message: 'Name, trigger and action required' });
      return;
    }
    setSaving(true);
    try {
      if (automation?.id) {
        await updateAutomation(automation.id, form);
      } else {
        await createAutomation(form);
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
    <CrmModal isOpen={isOpen} onClose={onClose} title={automation?.id ? 'Edit Automation' : 'New Automation'} size="xl" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <div className="row">
        <div className="col-md-8">
          <label className="form-label">Name *</label>
          <input className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Max Executions / Record</label>
          <input type="number" className="form-control mb-2" defaultValue={1} min="1" />
        </div>
      </div>
      <label className="form-label">Description</label>
      <textarea className="form-control mb-3" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <h6 className="mt-3">Triggers</h6>
      {form.triggers.map((t, i) => (
        <div key={i} className="d-flex gap-2 mb-2">
          <select className="form-select form-select-sm" value={t.event} onChange={(e) => {
            const next = [...form.triggers]; next[i] = { ...next[i], event: e.target.value }; setForm({ ...form, triggers: next });
          }}>
            <option value="">Select event...</option>
            {EVENT_TYPES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
          <button className="btn btn-sm text-danger" onClick={() => setForm({ ...form, triggers: form.triggers.filter((_, idx) => idx !== i) })}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline-primary mb-3" onClick={() => setForm({ ...form, triggers: [...form.triggers, { event: '' }] })}>
        <FontAwesomeIcon icon={faPlus} className="me-1" />Add Trigger
      </button>

      <h6>Actions</h6>
      {form.actions.map((a, i) => (
        <div key={i} className="d-flex gap-2 mb-2">
          <select className="form-select form-select-sm" value={a.type} onChange={(e) => {
            const next = [...form.actions]; next[i] = { ...next[i], type: e.target.value }; setForm({ ...form, actions: next });
          }}>
            {ACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button className="btn btn-sm text-danger" onClick={() => setForm({ ...form, actions: form.actions.filter((_, idx) => idx !== i) })}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline-primary mb-3" onClick={() => setForm({ ...form, actions: [...form.actions, { type: 'create_task' }] })}>
        <FontAwesomeIcon icon={faPlus} className="me-1" />Add Action
      </button>

      <div className="d-flex gap-3">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <label htmlFor="active" className="form-check-label">Active</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="test" checked={form.test_mode} onChange={(e) => setForm({ ...form, test_mode: e.target.checked })} />
          <label htmlFor="test" className="form-check-label">Test Mode (only run when triggered manually)</label>
        </div>
      </div>
    </CrmModal>
  );
};

export default CrmAutomations;