import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listDocuments, uploadDocument, deleteDocument,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog, CrmFileUploader } from '../../../components/crm';
import {
  faFileAlt, faPlus, faTrash, faDownload, faFilePdf, faFileWord, faFileImage, faFile,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const fileIcon = (mime) => {
  if (!mime) return faFile;
  if (mime.startsWith('image/')) return faFileImage;
  if (mime.includes('pdf')) return faFilePdf;
  if (mime.includes('word')) return faFileWord;
  return faFileAlt;
};

const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0; let v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${units[i]}`;
};

const CrmDocuments = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listDocuments({ search, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, perPage, search]);

  const handleUpload = async (file, ctx = {}) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (ctx.name) fd.append('name', ctx.name);
      if (ctx.description) fd.append('description', ctx.description);
      if (ctx.visibility) fd.append('visibility', ctx.visibility);
      if (ctx.related_type) fd.append('related_type', ctx.related_type);
      if (ctx.related_id) fd.append('related_id', ctx.related_id);
      await uploadDocument(fd);
      addNotification?.({ type: 'success', message: 'Uploaded' });
      setUploadOpen(false);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Upload failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (v, r) => (
      <div className="d-flex align-items-center gap-2">
        <FontAwesomeIcon icon={fileIcon(r.mime_type)} style={{ color: '#6366f1', fontSize: '1.1rem' }} />
        <div>
          <strong>{v}</strong>
          <div className="small" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{r.original_name}</div>
        </div>
      </div>
    )},
    { key: 'size', label: 'Size', render: formatSize, align: 'right' },
    { key: 'visibility', label: 'Visibility' },
    { key: 'uploader', label: 'Uploaded By', render: (v, r) => r.uploader?.name || '—' },
    { key: 'created_at', label: 'Uploaded', render: (v) => new Date(v).toLocaleDateString() },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <a className="btn btn-sm" href={`/api/v1/crm/documents/${row.id}/download`} download><FontAwesomeIcon icon={faDownload} /></a>
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faFileAlt}
      title="Documents"
      description="Upload and manage files attached to any CRM record."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Upload
        </button>
      }
    >
      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search documents..."
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

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        isDark={isDark}
      />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Delete "${confirmDel?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const UploadModal = ({ isOpen, onClose, onUpload, isDark }) => {
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState({ name: '', description: '', visibility: 'private' });

  const submit = () => {
    if (!file) return;
    onUpload(file, meta);
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title="Upload Document" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!file}>Upload</button>
        </>
      }
    >
      <CrmFileUploader
        isDark={isDark}
        label="Drop files here"
        onUpload={(f) => setFile(f)}
      />
      <div className="mt-3">
        <label className="form-label">Display Name</label>
        <input className="form-control mb-2" value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} />
        <label className="form-label">Description</label>
        <textarea className="form-control mb-2" rows="2" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
        <label className="form-label">Visibility</label>
        <select className="form-select" value={meta.visibility} onChange={(e) => setMeta({ ...meta, visibility: e.target.value })}>
          <option value="private">Private</option>
          <option value="team">Team</option>
          <option value="public">Public</option>
        </select>
      </div>
    </CrmModal>
  );
};

export default CrmDocuments;