import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listCustomFields, createCustomField, updateCustomField, deleteCustomField,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog } from '../../../components/crm';
import {
  faListAlt, faPlus, faEdit, faTrash, faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ENTITY_TYPES = ['lead', 'contact', 'customer', 'deal', 'task'];
const FIELD_TYPES = ['text', 'textarea', 'number', 'currency', 'date', 'datetime', 'dropdown', 'multi_select', 'radio', 'checkbox', 'url', 'email', 'phone'];

const CrmCustomFields = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [entityType, setEntityType] = useState('lead');
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listCustomFields({ entity_type: entityType });
      setFields(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [entityType]);

  const handleDelete = async () => {
    try {
      await deleteCustomField(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const columns = [
    { key: 'label', label: 'Label', render: (v) => <strong>{v}</strong> },
    { key: 'name', label: 'Name', render: (v) => <code>{v}</code> },
    { key: 'type', label: 'Type', render: (v) => <span className="badge bg-secondary">{v}</span> },
    { key: 'is_required', label: 'Required', render: (v) => v ? '✓' : '—' },
    { key: 'sort_order', label: 'Order', align: 'right' },
    { key: 'is_active', label: 'Status', render: (v) => v ? 'Active' : 'Inactive' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={() => setModal({ ...row, options_str: JSON.stringify(row.options || []) })}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faListAlt}
      title="Custom Fields"
      description="Add custom fields to Lead, Contact, Customer, Deal and Task records without code changes."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ entity_type: entityType, type: 'text', is_active: true })}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Field
        </button>
      }
    >
      <div className="mb-3">
        <select className="form-select" style={{ width: 200 }} value={entityType} onChange={(e) => setEntityType(e.target.value)}>
          {ENTITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <ErpDataTable
        columns={columns}
        data={fields}
        loading={loading}
        currentPage={1}
        totalPages={1}
        entriesPerPage={100}
        totalEntries={fields.length}
        isDark={isDark}
      />

      <FieldModal isOpen={!!modal} field={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); fetch(); }} isDark={isDark} />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Field"
        message={`Delete field "${confirmDel?.label}"? All values will be lost.`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const FieldModal = ({ isOpen, field, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', label: '', type: 'text', options: [], is_required: false, sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (field) {
      setForm({
        entity_type: field.entity_type || 'lead',
        name: field.name || '',
        label: field.label || '',
        type: field.type || 'text',
        options: field.options || [],
        is_required: field.is_required || false,
        sort_order: field.sort_order || 0,
        is_active: field.is_active !== false,
      });
    }
  }, [field]);

  const save = async () => {
    if (!form.name || !form.label) {
      addNotification?.({ type: 'error', message: 'Name and label required' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.options_str;
      if (['dropdown', 'multi_select', 'radio'].includes(form.type)) {
        payload.options = Array.isArray(form.options) ? form.options : [];
      } else {
        delete payload.options;
      }
      if (field?.id) await updateCustomField(field.id, payload);
      else await createCustomField(payload);
      addNotification?.({ type: 'success', message: 'Saved' });
      onSaved?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title={field?.id ? 'Edit Field' : 'New Field'} size="lg" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Entity Type</label>
          <select className="form-select mb-2" value={form.entity_type} onChange={(e) => setForm({ ...form, entity_type: e.target.value })}>
            {ENTITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Field Type</label>
          <select className="form-select mb-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Name (machine) *</label>
          <input className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value.replace(/\s+/g, '_').toLowerCase() })} placeholder="industry_segment" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Label *</label>
          <input className="form-control mb-2" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Industry Segment" />
        </div>
      </div>
      {['dropdown', 'multi_select', 'radio'].includes(form.type) && (
        <>
          <label className="form-label">Options (one per line)</label>
          <textarea
            className="form-control mb-2"
            rows="4"
            value={Array.isArray(form.options) ? form.options.join('\n') : ''}
            onChange={(e) => setForm({ ...form, options: e.target.value.split('\n').filter(Boolean) })}
          />
        </>
      )}
      <div className="row">
        <div className="col-md-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="req" checked={form.is_required} onChange={(e) => setForm({ ...form, is_required: e.target.checked })} />
            <label htmlFor="req" className="form-check-label">Required</label>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-control mb-2" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
        </div>
        <div className="col-md-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <label htmlFor="active" className="form-check-label">Active</label>
          </div>
        </div>
      </div>
    </CrmModal>
  );
};

export default CrmCustomFields;