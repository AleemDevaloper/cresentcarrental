import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listScoreRules, createScoreRule, updateScoreRule, deleteScoreRule, seedDefaultScoreRules,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog } from '../../../components/crm';
import {
  faBullseye, faPlus, faEdit, faTrash, faRocket, faFire, faSnowflake, faThermometerHalf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmLeadScore = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listScoreRules();
      setRules(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSeed = async () => {
    try {
      await seedDefaultScoreRules();
      addNotification?.({ type: 'success', message: 'Defaults seeded' });
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteScoreRule(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Rule' },
    { key: 'event', label: 'Event', render: (v) => <code>{v}</code> },
    { key: 'category', label: 'Category', render: (v) => (
      <span style={{ color: v === 'positive' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
        {v === 'positive' ? '+ Positive' : '- Negative'}
      </span>
    )},
    { key: 'points', label: 'Points', align: 'right', render: (v, row) => (
      <strong style={{ color: row.category === 'positive' ? '#10b981' : '#ef4444' }}>
        {v > 0 ? '+' : ''}{v}
      </strong>
    )},
    { key: 'is_active', label: 'Status', render: (v) => v ? 'Active' : 'Inactive' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={() => setModal(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faBullseye}
      title="Lead Scoring"
      description="Configure how leads are scored based on engagement and demographics."
      action={
        <>
          <button className="btn btn-outline-primary btn-sm me-2" onClick={handleSeed}>
            <FontAwesomeIcon icon={faRocket} className="me-2" />Seed Defaults
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />New Rule
          </button>
        </>
      }
    >
      <div className="alert alert-info mb-3">
        <strong>Score Categories:</strong> Cold (&lt;40) | Warm (40-59) | Hot (60-79) | Very Hot (80+)
      </div>

      <ErpDataTable
        columns={columns}
        data={rules}
        loading={loading}
        currentPage={1}
        totalPages={1}
        entriesPerPage={100}
        totalEntries={rules.length}
        isDark={isDark}
      />

      <RuleModal isOpen={!!modal} rule={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); fetch(); }} isDark={isDark} />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Rule"
        message={`Delete scoring rule "${confirmDel?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const RuleModal = ({ isOpen, rule, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', event: '', points: 10, category: 'positive', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rule) {
      setForm({
        name: rule.name || '',
        event: rule.event || '',
        points: rule.points ?? 10,
        category: rule.category || 'positive',
        is_active: rule.is_active !== false,
      });
    }
  }, [rule]);

  const save = async () => {
    if (!form.name || !form.event) {
      addNotification?.({ type: 'error', message: 'Name and event required' });
      return;
    }
    setSaving(true);
    try {
      if (rule?.id) await updateScoreRule(rule.id, form);
      else await createScoreRule(form);
      addNotification?.({ type: 'success', message: 'Saved' });
      onSaved?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title={rule?.id ? 'Edit Rule' : 'New Rule'} isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <label className="form-label">Rule Name *</label>
      <input className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Email Replied" />
      <label className="form-label">Event *</label>
      <input className="form-control mb-2" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} placeholder="e.g. lead.email_replied" />
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <select className="form-select mb-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="positive">Positive (+)</option>
            <option value="negative">Negative (-)</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Points</label>
          <input type="number" className="form-control mb-2" value={form.points} onChange={(e) => setForm({ ...form, points: +e.target.value })} />
        </div>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        <label htmlFor="active" className="form-check-label">Active</label>
      </div>
    </CrmModal>
  );
};

export default CrmLeadScore;