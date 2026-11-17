import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  uploadImport, listImports, getImport, createExport, listExports, getExport, downloadExport, deleteExport,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog, CrmFileUploader } from '../../../components/crm';
import {
  faUpload, faDownload, faTrash, faFile, faCheck, faTimes, faSpinner, faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmImportExport = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState('import');
  const [imports, setImports] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [exports, setExports] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loadingImp, setLoadingImp] = useState(false);
  const [loadingExp, setLoadingExp] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const loadImports = async () => {
    setLoadingImp(true);
    try {
      const res = await listImports({ page, per_page: perPage });
      setImports(res);
    } catch {}
    finally { setLoadingImp(false); }
  };

  const loadExports = async () => {
    setLoadingExp(true);
    try {
      const res = await listExports({ page, per_page: perPage });
      setExports(res);
    } catch {}
    finally { setLoadingExp(false); }
  };

  useEffect(() => { loadImports(); loadExports(); }, [page, perPage, tab]);

  const handleUpload = async (file, meta) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('entity_type', meta.entity_type);
      if (meta.column_mapping) fd.append('column_mapping', JSON.stringify(meta.column_mapping));
      await uploadImport(fd);
      addNotification?.({ type: 'success', message: 'Import queued' });
      setUploadOpen(false);
      loadImports();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Upload failed' });
    }
  };

  const handleExport = async (form) => {
    try {
      await createExport(form);
      addNotification?.({ type: 'success', message: 'Export queued' });
      setExportOpen(false);
      loadExports();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleDownload = async (job) => {
    try {
      const blob = await downloadExport(job.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm-${job.entity_type}-${job.id}.${job.format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Download failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExport(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Deleted' });
      setConfirmDel(null);
      loadExports();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const importColumns = [
    { key: 'file_name', label: 'File', render: (v) => (
      <span><FontAwesomeIcon icon={faFile} className="me-2" />{v}</span>
    )},
    { key: 'entity_type', label: 'Type', render: (v) => <span className="badge bg-secondary">{v}</span> },
    { key: 'status', label: 'Status', render: (v) => (
      <span style={{
        color: v === 'completed' ? '#10b981' : v === 'failed' ? '#ef4444' : v === 'processing' ? '#0ea5e9' : '#f59e0b',
        fontWeight: 600,
      }}>{v}</span>
    )},
    { key: 'total_rows', label: 'Total', align: 'right' },
    { key: 'success_count', label: '✓', align: 'right', render: (v) => <span style={{ color: '#10b981' }}>{v || 0}</span> },
    { key: 'duplicate_count', label: 'Dup', align: 'right', render: (v) => <span style={{ color: '#f59e0b' }}>{v || 0}</span> },
    { key: 'failed_count', label: '✗', align: 'right', render: (v) => <span style={{ color: '#ef4444' }}>{v || 0}</span> },
    { key: 'progress_percent', label: 'Progress', render: (_, r) => `${r.processed_rows}/${r.total_rows}` },
    { key: 'created_at', label: 'Started', render: (v) => new Date(v).toLocaleString() },
  ];

  const exportColumns = [
    { key: 'entity_type', label: 'Type', render: (v) => <span className="badge bg-secondary">{v}</span> },
    { key: 'format', label: 'Format', render: (v) => v.toUpperCase() },
    { key: 'scope', label: 'Scope' },
    { key: 'status', label: 'Status', render: (v) => (
      <span style={{
        color: v === 'completed' ? '#10b981' : v === 'failed' ? '#ef4444' : '#f59e0b',
        fontWeight: 600,
      }}>{v}</span>
    )},
    { key: 'total_rows', label: 'Rows', align: 'right' },
    { key: 'file_size', label: 'Size', align: 'right', render: (v) => v ? `${(v / 1024).toFixed(1)} KB` : '—' },
    { key: 'created_at', label: 'Created', render: (v) => new Date(v).toLocaleString() },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        {row.status === 'completed' && (
          <button className="btn btn-sm text-success" onClick={() => handleDownload(row)} title="Download"><FontAwesomeIcon icon={faDownload} /></button>
        )}
        <button className="btn btn-sm text-danger" onClick={() => setConfirmDel(row)}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faFileExport}
      title="Import / Export"
      description="Bulk import leads/contacts/companies or export CRM data to CSV, Excel or PDF."
      action={
        <>
          {tab === 'import' ? (
            <button className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
              <FontAwesomeIcon icon={faUpload} className="me-2" />Upload
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setExportOpen(true)}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />New Export
            </button>
          )}
        </>
      }
    >
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'import' ? 'active' : ''}`} onClick={() => setTab('import')}>Imports</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'export' ? 'active' : ''}`} onClick={() => setTab('export')}>Exports</button>
        </li>
      </ul>

      {tab === 'import' && (
        <ErpDataTable
          columns={importColumns}
          data={imports.data}
          loading={loadingImp}
          currentPage={imports.meta.current_page}
          totalPages={imports.meta.last_page}
          entriesPerPage={perPage}
          totalEntries={imports.meta.total}
          onPageChange={setPage}
          onEntriesPerPageChange={(v) => { setPerPage(v); setPage(1); }}
          isDark={isDark}
        />
      )}

      {tab === 'export' && (
        <ErpDataTable
          columns={exportColumns}
          data={exports.data}
          loading={loadingExp}
          currentPage={exports.meta.current_page}
          totalPages={exports.meta.last_page}
          entriesPerPage={perPage}
          totalEntries={exports.meta.total}
          onPageChange={setPage}
          onEntriesPerPageChange={(v) => { setPerPage(v); setPage(1); }}
          isDark={isDark}
        />
      )}

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={handleUpload} isDark={isDark} />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} onExport={handleExport} isDark={isDark} />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Export"
        message={`Delete export #${confirmDel?.id}?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const UploadModal = ({ isOpen, onClose, onUpload, isDark }) => {
  const [file, setFile] = useState(null);
  const [entityType, setEntityType] = useState('lead');

  const submit = () => {
    if (!file) return;
    onUpload(file, { entity_type: entityType });
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title="Import CSV/Excel" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!file}>Upload</button>
        </>
      }
    >
      <label className="form-label">Entity Type</label>
      <select className="form-select mb-3" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
        <option value="lead">Leads</option>
        <option value="contact">Contacts</option>
        <option value="customer">Companies</option>
      </select>
      <CrmFileUploader isDark={isDark} label="Drop CSV or Excel file" accept=".csv,.xlsx,.xls" onUpload={setFile} />
    </CrmModal>
  );
};

const ExportModal = ({ isOpen, onClose, onExport, isDark }) => {
  const [form, setForm] = useState({ entity_type: 'lead', format: 'csv', scope: 'all' });

  const submit = () => onExport(form);

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title="New Export" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create Export</button>
        </>
      }
    >
      <label className="form-label">Entity Type</label>
      <select className="form-select mb-2" value={form.entity_type} onChange={(e) => setForm({ ...form, entity_type: e.target.value })}>
        <option value="lead">Leads</option>
        <option value="contact">Contacts</option>
        <option value="customer">Companies</option>
        <option value="deal">Deals</option>
      </select>
      <label className="form-label">Format</label>
      <select className="form-select mb-2" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
        <option value="csv">CSV</option>
        <option value="xlsx">Excel (XLSX)</option>
        <option value="pdf">PDF</option>
      </select>
      <label className="form-label">Scope</label>
      <select className="form-select mb-2" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}>
        <option value="all">All records</option>
        <option value="filtered">Filtered records</option>
        <option value="selected">Selected records</option>
      </select>
      <p className="small">Large exports are processed in the background. You'll be notified when ready.</p>
    </CrmModal>
  );
};

export default CrmImportExport;