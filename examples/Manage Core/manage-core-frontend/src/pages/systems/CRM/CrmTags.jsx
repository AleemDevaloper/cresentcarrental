import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listTags, createTag, updateTag, deleteTag, getAllTags,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog, CrmSearchBar } from '../../../components/crm';
import {
  faTags, faPlus, faEdit, faTrash, faPalette,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CrmTags = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listTags({ search, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, perPage, search]);

  const handleDelete = async () => {
    try {
      await deleteTag(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Tag', render: (v, r) => (
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: r.color }} />
        <strong>{v}</strong>
      </div>
    )},
    { key: 'category', label: 'Category' },
    { key: 'taggables_count', label: 'Used', align: 'right' },
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
      icon={faTags}
      title="Tags"
      description="Centralized tag management for Leads, Contacts, Companies, Deals, Emails and Tasks."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Tag
        </button>
      }
    >
      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search tags..."
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

      <TagModal isOpen={!!modal} tag={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); fetch(); }} isDark={isDark} />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Tag"
        message={`Delete tag "${confirmDel?.name}"? This will detach it from all records.`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const TagModal = ({ isOpen, tag, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ name: '', color: '#6366f1', category: '', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tag) {
      setForm({
        name: tag.name || '',
        color: tag.color || '#6366f1',
        category: tag.category || '',
        is_active: tag.is_active !== false,
      });
    }
  }, [tag]);

  const save = async () => {
    if (!form.name) {
      addNotification?.({ type: 'error', message: 'Name required' });
      return;
    }
    setSaving(true);
    try {
      if (tag?.id) await updateTag(tag.id, form);
      else await createTag(form);
      addNotification?.({ type: 'success', message: 'Saved' });
      onSaved?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title={tag?.id ? 'Edit Tag' : 'New Tag'} isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <label className="form-label">Name *</label>
      <input className="form-control mb-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <label className="form-label">Color</label>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {COLORS.map(c => (
          <div key={c} onClick={() => setForm({ ...form, color: c })}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: c, cursor: 'pointer',
              border: form.color === c ? '3px solid #000' : '3px solid transparent',
            }} />
        ))}
        <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
      </div>
      <label className="form-label">Category</label>
      <input className="form-control mb-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. priority, status" />
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        <label htmlFor="active" className="form-check-label">Active</label>
      </div>
    </CrmModal>
  );
};

export default CrmTags;