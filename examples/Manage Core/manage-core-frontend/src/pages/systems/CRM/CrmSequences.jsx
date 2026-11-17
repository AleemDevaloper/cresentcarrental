import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listSequences, createSequence, updateSequence, deleteSequence,
  getSequence, addSequenceStep, removeSequenceStep, enrollSequence,
  sequenceStats, pauseSequence, resumeSequence,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmSearchBar, CrmConfirmDialog } from '../../../components/crm';
import {
  faPlay, faPlus, faPause, faTrash, faEdit, faClock, faUser, faCheck,
  faTimes, faStepForward, faStream,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmSequences = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modal, setModal] = useState(null);
  const [builderOpen, setBuilderOpen] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listSequences({ search, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to load sequences' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, perPage, search]);

  const togglePause = async (s) => {
    try {
      if (s.status === 'active' || s.is_active) await pauseSequence(s.id);
      else await resumeSequence(s.id);
      addNotification?.({ type: 'success', message: 'Updated' });
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSequence(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Sequence deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Delete failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (v) => <strong>{v}</strong> },
    { key: 'description', label: 'Description', render: (v) => v ? v.substring(0, 80) + (v.length > 80 ? '...' : '') : '—' },
    { key: 'status', label: 'Status', render: (v, r) => (
      <span style={{
        color: r.is_active ? '#10b981' : '#94a3b8',
        fontWeight: 600,
      }}>
        {r.is_active ? '● Active' : '○ Paused'}
      </span>
    )},
    { key: 'active_enrollments', label: 'Active', align: 'right' },
    { key: 'completed_enrollments', label: 'Completed', align: 'right' },
    { key: 'stopped_enrollments', label: 'Stopped', align: 'right' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={() => togglePause(row)} title={row.is_active ? 'Pause' : 'Resume'}>
          <FontAwesomeIcon icon={row.is_active ? faPause : faPlay} style={{ color: row.is_active ? '#f59e0b' : '#10b981' }} />
        </button>
        <button className="btn btn-sm" onClick={() => setBuilderOpen(row.id)} title="Builder"><FontAwesomeIcon icon={faStepForward} /></button>
        <button className="btn btn-sm" onClick={() => setModal(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faStream}
      title="Sales Sequences"
      description="Multi-step automated email/call/task sequences."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Sequence
        </button>
      }
    >
      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search sequences..."
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

      <SequenceModal
        isOpen={!!modal}
        sequence={modal}
        onClose={() => setModal(null)}
        onSaved={() => { setModal(null); fetch(); }}
        isDark={isDark}
      />

      <SequenceBuilder
        sequenceId={builderOpen}
        onClose={() => setBuilderOpen(null)}
        isDark={isDark}
      />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Sequence"
        message={`Delete "${confirmDel?.name}"? All enrollments will be cancelled.`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const SequenceModal = ({ isOpen, sequence, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', description: '', is_active: true, steps: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sequence) {
      setForm({
        name: sequence.name || '',
        description: sequence.description || '',
        is_active: sequence.is_active !== false,
        steps: [],
      });
    }
  }, [sequence]);

  const addStep = () => {
    setForm({
      ...form,
      steps: [...(form.steps || []), { type: 'email', delay_days: 0, delay_hours: 0, name: '' }]
    });
  };

  const updateStep = (i, key, val) => {
    const next = [...(form.steps || [])];
    next[i] = { ...next[i], [key]: val };
    setForm({ ...form, steps: next });
  };

  const removeStep = (i) => {
    setForm({ ...form, steps: form.steps.filter((_, idx) => idx !== i) });
  };

  const save = async () => {
    if (!form.name) {
      addNotification?.({ type: 'error', message: 'Name required' });
      return;
    }
    setSaving(true);
    try {
      if (sequence?.id) {
        await updateSequence(sequence.id, { name: form.name, description: form.description, is_active: form.is_active });
      } else {
        if (!form.steps?.length) {
          addNotification?.({ type: 'error', message: 'Add at least one step' });
          setSaving(false);
          return;
        }
        await createSequence(form);
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
    <CrmModal isOpen={isOpen} onClose={onClose} title={sequence?.id ? 'Edit Sequence' : 'New Sequence'} size="xl" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <label className="form-label">Sequence Name *</label>
      <input className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <label className="form-label">Description</label>
      <textarea className="form-control mb-3" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      {!sequence?.id && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Steps</h6>
            <button className="btn btn-sm btn-outline-primary" onClick={addStep}>
              <FontAwesomeIcon icon={faPlus} className="me-1" />Add Step
            </button>
          </div>
          {(form.steps || []).map((s, i) => (
            <div key={i} className="d-flex gap-2 mb-2 p-2" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <span style={{ alignSelf: 'center', fontWeight: 600 }}>{i + 1}.</span>
              <select className="form-select form-select-sm" value={s.type} onChange={(e) => updateStep(i, 'type', e.target.value)}>
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="task">Task</option>
              </select>
              <input type="number" min="0" placeholder="Days" className="form-control form-control-sm" value={s.delay_days} onChange={(e) => updateStep(i, 'delay_days', +e.target.value)} style={{ width: 80 }} />
              <input type="number" min="0" placeholder="Hours" className="form-control form-control-sm" value={s.delay_hours} onChange={(e) => updateStep(i, 'delay_hours', +e.target.value)} style={{ width: 80 }} />
              <input placeholder="Name / notes" className="form-control form-control-sm" value={s.name} onChange={(e) => updateStep(i, 'name', e.target.value)} />
              <button className="btn btn-sm text-danger" onClick={() => removeStep(i)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          ))}
        </>
      )}
      <div className="form-check mt-3">
        <input className="form-check-input" type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        <label htmlFor="active" className="form-check-label">Active</label>
      </div>
    </CrmModal>
  );
};

const SequenceBuilder = ({ sequenceId, onClose, isDark }) => {
  const { addNotification } = useApp();
  const [sequence, setSequence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!sequenceId) return;
    Promise.all([getSequence(sequenceId), sequenceStats(sequenceId)])
      .then(([s, st]) => { setSequence(s); setStats(st); })
      .catch(() => addNotification?.({ type: 'error', message: 'Failed to load' }))
      .finally(() => setLoading(false));
  }, [sequenceId]);

  if (!sequenceId) return null;

  return (
    <CrmModal isOpen={!!sequenceId} onClose={onClose} title={`Sequence: ${sequence?.name || ''}`} size="xl" isDark={isDark}>
      {loading ? <p>Loading...</p> : sequence && (
        <div>
          {stats && (
            <div className="row g-2 mb-3">
              <div className="col-md-3"><ErpKpiCard title="Active" value={stats.active || 0} color="#10b981" /></div>
              <div className="col-md-3"><ErpKpiCard title="Completed" value={stats.completed || 0} color="#6366f1" /></div>
              <div className="col-md-3"><ErpKpiCard title="Stopped" value={stats.stopped || 0} color="#94a3b8" /></div>
              <div className="col-md-3"><ErpKpiCard title="Reply Stop" value={stats.reply_stop || 0} color="#ef4444" /></div>
            </div>
          )}
          <h6>Steps</h6>
          <ol>
            {sequence.steps?.map(s => (
              <li key={s.id}>
                <strong>{s.name || s.type}</strong> — Delay {s.delay_days}d {s.delay_hours}h
                {s.template && <span className="ms-2 badge bg-secondary">{s.template.name}</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </CrmModal>
  );
};

export default CrmSequences;