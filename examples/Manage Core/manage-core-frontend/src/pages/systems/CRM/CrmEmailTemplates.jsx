import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listEmailTemplates, createEmailTemplate, updateEmailTemplate,
  deleteEmailTemplate, duplicateEmailTemplate, previewEmailTemplate,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmSearchBar, CrmConfirmDialog } from '../../../components/crm';
import {
  faEnvelope, faEdit, faTrash, faCopy, faEye, faPlus, faCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmEmailTemplates = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modal, setModal] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listEmailTemplates({ search, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to load templates' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, perPage, search]);

  const handleDelete = async () => {
    try {
      await deleteEmailTemplate(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Template deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Delete failed' });
    }
  };

  const handleDuplicate = async (t) => {
    try {
      await duplicateEmailTemplate(t.id);
      addNotification?.({ type: 'success', message: 'Template duplicated' });
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Duplicate failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Template Name', render: (v) => <strong>{v}</strong> },
    { key: 'category', label: 'Category', render: (v) => v ? <span className="badge bg-secondary">{v}</span> : '—' },
    { key: 'subject', label: 'Subject' },
    { key: 'is_shared', label: 'Shared', render: (v) => v ? '✓' : '—' },
    { key: 'is_active', label: 'Active', render: (v) => v ? <span className="badge bg-success">Active</span> : <span className="badge bg-warning">Inactive</span> },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={() => setPreview({ id: row.id, name: row.name, subject: row.subject, body: row.body })}><FontAwesomeIcon icon={faEye} /></button>
        <button className="btn btn-sm" onClick={() => handleDuplicate(row)}><FontAwesomeIcon icon={faCopy} /></button>
        <button className="btn btn-sm" onClick={() => setModal(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faEnvelope}
      title="Email Templates"
      description="Reusable email templates with variable substitution."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Template
        </button>
      }
    >
      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search templates..."
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

      <TemplateModal
        isOpen={!!modal}
        template={modal}
        onClose={() => setModal(null)}
        onSaved={() => { setModal(null); fetch(); }}
        isDark={isDark}
      />

      <CrmModal isOpen={!!preview} onClose={() => setPreview(null)} title={`Preview: ${preview?.name}`} size="lg" isDark={isDark}>
        {preview && (
          <div>
            <h6>Subject</h6>
            <div className="p-2 bg-light rounded mb-3">{preview.subject}</div>
            <h6>Body</h6>
            <div className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: preview.body }} />
          </div>
        )}
      </CrmModal>

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={`Delete template "${confirmDel?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const TemplateModal = ({ isOpen, template, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', subject: '', body: '', category: '', is_shared: false, is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setForm({
        name: template.name || '',
        subject: template.subject || '',
        body: template.body || '',
        category: template.category || '',
        is_shared: template.is_shared || false,
        is_active: template.is_active !== false,
      });
    }
  }, [template]);

  const save = async () => {
    if (!form.name || !form.subject) {
      addNotification?.({ type: 'error', message: 'Name and subject required' });
      return;
    }
    setSaving(true);
    try {
      if (template?.id) {
        await updateEmailTemplate(template.id, form);
      } else {
        await createEmailTemplate(form);
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
    <CrmModal isOpen={isOpen} onClose={onClose} title={template?.id ? 'Edit Template' :'New Template'} size="xl" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <div className="row">
        <div className="col-md-8">
          <label className="form-label">Template Name *</label>
          <input className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input className="form-control mb-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. sales, support" />
        </div>
      </div>
      <label className="form-label">Subject</label>
      <input className="form-control mb-2" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <label className="form-label">Body</label>
      <textarea className="form-control" rows="14" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Use {{first_name}}, {{last_name}}, {{company}}, {{deal_name}}, {{deal_amount}}, {{owner_name}}, {{follow_up_date}}" />
      <div className="form-check mt-2">
        <input className="form-check-input" type="checkbox" id="shared" checked={form.is_shared} onChange={(e) => setForm({ ...form, is_shared: e.target.checked })} />
        <label htmlFor="shared" className="form-check-label">Shared with team</label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        <label htmlFor="active" className="form-check-label">Active</label>
      </div>
    </CrmModal>
  );
};

export default CrmEmailTemplates;