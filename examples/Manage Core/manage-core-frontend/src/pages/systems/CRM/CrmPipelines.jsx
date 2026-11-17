import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { listPipelines, createPipeline, updatePipeline, deletePipeline, getPipeline } from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog } from '../../../components/crm';
import {
  faStream, faPlus, faEdit, faTrash, faEye, faCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmPipelines = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modal, setModal] = useState(null);
  const [builder, setBuilder] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listPipelines();
      setData({ data: res, meta: { current_page: 1, last_page: 1, per_page: res.length, total: res.length } });
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async () => {
    try {
      await deletePipeline(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Pipeline deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (v) => <strong>{v}</strong> },
    { key: 'description', label: 'Description' },
    { key: 'is_default', label: 'Default', render: (v) => v ? <span className="badge bg-primary">Default</span> : '—' },
    { key: 'is_active', label: 'Status', render: (v) => v ? 'Active' : 'Inactive' },
    { key: 'stages_count', label: 'Stages', render: (v, r) => r.stages?.length || 0, align: 'right' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={async () => {
          try { const full = await getPipeline(row.id); setBuilder(full); } catch {}
        }}><FontAwesomeIcon icon={faEye} /></button>
        <button className="btn btn-sm" onClick={() => setModal(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faStream}
      title="Pipelines"
      description="Manage sales pipelines and their stages."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Pipeline
        </button>
      }
    >
      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        currentPage={1}
        totalPages={1}
        entriesPerPage={100}
        totalEntries={data.data.length}
        isDark={isDark}
      />

      <PipelineModal isOpen={!!modal} pipeline={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); fetch(); }} isDark={isDark} />

      <CrmModal isOpen={!!builder} onClose={() => setBuilder(null)} title={`Pipeline: ${builder?.name || ''}`} size="lg" isDark={isDark}>
        {builder && (
          <div>
            <h6>Stages</h6>
            <div className="d-flex gap-2 overflow-auto">
              {builder.stages?.map(s => (
                <div key={s.id} className="p-3" style={{ background: s.color || '#6366f1', color: '#fff', borderRadius: '8px', minWidth: 180 }}>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div className="small">{s.probability}% probability</div>
                  {s.is_won && <span className="badge bg-success mt-1">Won</span>}
                  {s.is_lost && <span className="badge bg-danger mt-1">Lost</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CrmModal>

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Pipeline"
        message={`Delete "${confirmDel?.name}"? Deals must be reassigned.`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const PipelineModal = ({ isOpen, pipeline, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', description: '', is_default: false, is_active: true, stages: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pipeline) {
      setForm({
        name: pipeline.name || '',
        description: pipeline.description || '',
        is_default: pipeline.is_default || false,
        is_active: pipeline.is_active !== false,
        stages: pipeline.stages || [],
      });
    } else {
      setForm({
        name: '', description: '', is_default: false, is_active: true,
        stages: [
          { name: 'New Opportunity', probability: 10, color: '#0ea5e9' },
          { name: 'Qualification', probability: 25, color: '#f59e0b' },
          { name: 'Proposal', probability: 50, color: '#8b5cf6' },
          { name: 'Negotiation', probability: 75, color: '#ec4899' },
          { name: 'Closed Won', probability: 100, color: '#10b981', is_won: true },
          { name: 'Closed Lost', probability: 0, color: '#ef4444', is_lost: true },
        ],
      });
    }
  }, [pipeline]);

  const save = async () => {
    if (!form.name) {
      addNotification?.({ type: 'error', message: 'Name required' });
      return;
    }
    setSaving(true);
    try {
      await createPipeline(form);
      addNotification?.({ type: 'success', message: 'Pipeline created' });
      onSaved?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title="New Pipeline" size="lg" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <label className="form-label">Name *</label>
      <input className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <label className="form-label">Description</label>
      <textarea className="form-control mb-3" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="d-flex gap-3 mb-3">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="def" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
          <label htmlFor="def" className="form-check-label">Default</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="act" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <label htmlFor="act" className="form-check-label">Active</label>
        </div>
      </div>
      <h6>Stages</h6>
      {form.stages.map((s, i) => (
        <div key={i} className="d-flex gap-2 mb-2">
          <input type="color" value={s.color || '#6366f1'} onChange={(e) => {
            const next = [...form.stages]; next[i] = { ...next[i], color: e.target.value }; setForm({ ...form, stages: next });
          }} style={{ width: 50 }} />
          <input className="form-control form-control-sm" value={s.name} onChange={(e) => {
            const next = [...form.stages]; next[i] = { ...next[i], name: e.target.value }; setForm({ ...form, stages: next });
          }} placeholder="Stage name" />
          <input type="number" min="0" max="100" className="form-control form-control-sm" value={s.probability} onChange={(e) => {
            const next = [...form.stages]; next[i] = { ...next[i], probability: +e.target.value }; setForm({ ...form, stages: next });
          }} placeholder="%" style={{ width: 80 }} />
        </div>
      ))}
    </CrmModal>
  );
};

export default CrmPipelines;