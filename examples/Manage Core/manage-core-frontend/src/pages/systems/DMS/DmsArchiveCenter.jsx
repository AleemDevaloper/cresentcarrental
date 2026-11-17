import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import {
  listArchivedDocuments,
  restoreArchivedDocument,
  permanentDeleteDocument,
  getRetentionPolicies,
  getArchiveStats
} from '../../../api/dms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { StatCard, HeaderCard } from '../../../components/common/UI/Cards';
import { DataTable } from '../../../components/common/UI/Tables';
import { EnableDisableButton } from '../../../components/common';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive, faHistory, faTrashRestore,
  faTrash, faSearch, faFilter, faFile, faFilePdf,
  faFileWord, faFileExcel, faFileImage,
  faClock, faCog, faPlay, faPause,
  faSpinner, faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const DmsArchiveCenter = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('archived');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [archivedDocs, setArchivedDocs] = useState([]);
  const [stats, setStats] = useState({ totalArchived: 0, retentionPolicies: 0, pendingDeletion: 0, spaceReclaimable: '0 B' });
  const [retentionPolicies, setRetentionPolicies] = useState([]);
  const [scheduledJobs, setScheduledJobs] = useState([
    { id: 1, name: 'Monthly Archive Cleanup', frequency: 'Monthly', nextRun: '2026-07-01', lastRun: '2026-06-01', status: 'active', documents: 0 },
    { id: 2, name: 'Retention Policy Enforcement', frequency: 'Weekly', nextRun: '2026-06-22', lastRun: '2026-06-15', status: 'active', documents: 45 },
    { id: 3, name: 'Purge Expired Documents', frequency: 'Daily', nextRun: '2026-06-18', lastRun: '2026-06-17', status: 'paused', documents: 128 },
  ]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const tabs = [
    { id: 'archived', label: 'Archived Documents', icon: faArchive },
    { id: 'retention', label: 'Retention Policies', icon: faCog },
    { id: 'restore', label: 'Restore Queue', icon: faTrashRestore },
    { id: 'permanent', label: 'Permanent Deletion', icon: faTrash },
    { id: 'scheduled', label: 'Scheduled Jobs', icon: faClock },
  ];

  const loadData = async (loadPage) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: loadPage || page, limit: 10 };
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [archivedResult, statsResult, policiesResult] = await Promise.all([
        listArchivedDocuments(params),
        getArchiveStats(),
        getRetentionPolicies()
      ]);

      if (Array.isArray(archivedResult)) {
        setArchivedDocs(archivedResult);
        setTotalPages(1);
      } else {
        setArchivedDocs(archivedResult?.docs || archivedResult?.data || []);
        setTotalPages(archivedResult?.pagination?.totalPages || archivedResult?.totalPages || 1);
      }

      setStats(statsResult || { totalArchived: 0, retentionPolicies: 0, pendingDeletion: 0, spaceReclaimable: '0 B' });
      setRetentionPolicies(policiesResult || []);
    } catch (err) {
      setError(err?.message || 'Failed to load archive data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(1); }, []);

  const handleSearch = (e) => {
    if (e && e.key && e.key !== 'Enter') return;
    setPage(1);
    loadData(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    loadData(newPage);
  };

  const handleRestore = async (id) => {
    if (!window.confirm('Are you sure you want to restore this document?')) return;
    try {
      await restoreArchivedDocument(id);
      addNotification('Document restored successfully!', 'success');
      loadData(page);
    } catch (err) {
      addNotification(err?.response?.data?.message || err?.message || 'Failed to restore document', 'danger');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await permanentDeleteDocument(id);
      addNotification('Document permanently deleted.', 'success');
      loadData(page);
    } catch (err) {
      addNotification(err?.response?.data?.message || err?.message || 'Failed to delete document', 'danger');
    }
  };

  const handleRunArchiveJob = () => {
    addNotification('Archive job has been queued successfully.', 'success');
  };

  const handleEditPolicy = (policy) => {
    setEditingPolicy({ ...policy });
    setShowPolicyModal(true);
  };

  const handleSavePolicy = () => {
    addNotification('Retention policy updated successfully.', 'success');
    setShowPolicyModal(false);
    setEditingPolicy(null);
  };

  const handleToggleJob = (job) => {
    setScheduledJobs(prev => prev.map(j =>
      j.id === job.id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j
    ));
    addNotification(`Job ${job.status === 'active' ? 'paused' : 'resumed'} successfully.`, 'success');
  };

  const getFileIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('pdf')) return faFilePdf;
    if (t.includes('doc')) return faFileWord;
    if (t.includes('xls') || t.includes('csv') || t.includes('xlsx')) return faFileExcel;
    if (t.includes('png') || t.includes('jpg') || t.includes('jpeg') || t.includes('gif') || t.includes('image')) return faFileImage;
    return faFile;
  };

  const getFileColor = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('pdf')) return '#ef4444';
    if (t.includes('doc')) return '#3b82f6';
    if (t.includes('xls') || t.includes('xlsx') || t.includes('csv')) return '#10b981';
    if (t.includes('png') || t.includes('jpg') || t.includes('jpeg') || t.includes('gif') || t.includes('image')) return '#ec4899';
    return '#64748b';
  };

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (typeof bytes === 'string') return bytes;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getExtension = (name) => {
    if (!name) return '';
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop() : '';
  };

  const archiveColumns = [
    {
      key: 'name',
      label: 'Document',
      render: (val, row) => {
        const ext = row.type || getExtension(row.name);
        return (
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={getFileIcon(ext)} style={{ color: getFileColor(ext) }} />
            <span className="small fw-medium" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{row.name}</span>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (val, row) => {
        const ext = row.type || getExtension(row.name);
        return <span className="badge bg-light text-dark rounded-pill px-2 py-1 fw-bold x-small">{ext.toUpperCase()}</span>;
      },
    },
    {
      key: 'size',
      label: 'Size',
      render: (val) => <span className="small text-muted">{formatBytes(val)}</span>,
    },
    {
      key: 'archivedBy',
      label: 'Archived By',
      render: (val, row) => <span className="small text-muted">{row.archivedBy || row.archived_by || '-'}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      render: (val, row) => <span className="small text-muted">{row.date || row.archivedAt || row.archived_at || '-'}</span>,
    },
    {
      key: 'retentionEnd',
      label: 'Retention End',
      render: (val, row) => <span className="small text-muted">{row.retentionEnd || row.retention_end || '-'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const isArchived = val === 'archived' || val === 'active';
        return (
          <span className={`badge rounded-pill fw-bold ${isArchived ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ fontSize: '0.6rem' }}>
            {isArchived ? 'Archived' : val || 'Archived'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (val, row) => (
        <div className="d-flex gap-1 justify-content-end">
          <button className="btn btn-sm btn-light rounded-pill px-2 border-0" title="Restore" onClick={() => handleRestore(row.id)}>
            <FontAwesomeIcon icon={faTrashRestore} className="text-success" />
          </button>
          <button className="btn btn-sm btn-light rounded-pill px-2 border-0" title="Delete Permanently" onClick={() => handlePermanentDelete(row.id)}>
            <FontAwesomeIcon icon={faTrash} className="text-danger" />
          </button>
        </div>
      ),
    },
  ];

  const renderLoading = () => (
    <div className="text-center py-5">
      <FontAwesomeIcon icon={faSpinner} spin className="fs-3 text-muted mb-2" />
      <p className="small text-muted mb-0">Loading data...</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-5">
      <FontAwesomeIcon icon={faExclamationTriangle} className="fs-2 text-danger mb-3 opacity-50" />
      <h6 className="fw-bold text-danger mb-2">Failed to Load Data</h6>
      <p className="small text-muted mb-3">{error}</p>
      <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold small" onClick={() => loadData(1)}>Retry</button>
    </div>
  );

  return (
    <div className="container-fluid py-4 fade-in">
      <HeaderCard
        title="Archive Center"
        description="Manage archived documents, retention policies, and scheduled cleanup jobs."
        icon={faArchive}
        gradient="linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)"
        isDark={isDark}
      >
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-white rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={handleRunArchiveJob}>
            <FontAwesomeIcon icon={faPlay} className="me-2" />Run Archive Job
          </button>
        </div>
      </HeaderCard>

      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <StatCard label="Archived Documents" value={stats.totalArchived?.toLocaleString() || 0} icon={faArchive} color="#8b5cf6" isDark={isDark} />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard label="Retention Policies" value={stats.retentionPolicies?.toLocaleString() || 0} icon={faCog} color="#3b82f6" isDark={isDark} />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard label="Pending Deletion" value={stats.pendingDeletion?.toLocaleString() || 0} icon={faClock} color="#f59e0b" isDark={isDark} />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard label="Space Reclaimable" value={typeof stats.spaceReclaimable === 'number' ? formatBytes(stats.spaceReclaimable) : stats.spaceReclaimable || '0 B'} icon={faHistory} color="#10b981" isDark={isDark} />
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button key={tab.id} className={`btn btn-sm rounded-pill px-3 fw-bold border-0 transition ${activeTab === tab.id ? 'btn-primary shadow-sm' : 'btn-light'}`} onClick={() => setActiveTab(tab.id)}>
                  <FontAwesomeIcon icon={tab.icon} className="me-2" />{tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'archived' && (
              <div className="d-flex gap-2">
                <div className="position-relative">
                  <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem' }} />
                  <input type="text" className="form-control border shadow-none rounded-pill ps-5 bg-light small" placeholder="Search documents..." style={{ width: '200px' }} value={searchQuery} onKeyDown={handleSearch} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <button className="btn btn-light rounded-pill px-3 py-2 border shadow-none fw-bold small d-flex align-items-center gap-2" onClick={handleSearch}>
                  <FontAwesomeIcon icon={faFilter} /> Search
                </button>
              </div>
            )}
          </div>

          {loading && renderLoading()}
          {!loading && error && renderError()}

          {!loading && !error && activeTab === 'archived' && (
            <DataTable
              columns={archiveColumns}
              data={archivedDocs}
              emptyMessage="No archived documents found."
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isDark={isDark}
            />
          )}

          {!loading && !error && activeTab === 'retention' && (
            <div className="d-flex flex-column gap-3">
              {retentionPolicies.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FontAwesomeIcon icon={faCog} className="fs-2 mb-3 opacity-30" />
                  <h6 className="fw-bold mb-2" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>Retention Policies</h6>
                  <p className="small mb-0">No retention policies configured.</p>
                </div>
              ) : (
                retentionPolicies.map(policy => (
                  <div key={policy.id} className={`p-4 rounded-4 border d-flex justify-content-between align-items-center ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className={`p-3 rounded-3 ${policy.active ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                        <FontAwesomeIcon icon={faCog} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{policy.name}</h6>
                        <div className="d-flex gap-3">
                          <span className="x-small text-muted">Retention: {policy.retention || policy.retention_period || '-'}</span>
                          <span className="x-small text-muted">Applies to: {policy.applies || policy.department || '-'}</span>
                          <span className="x-small text-muted">{(policy.documents || policy.document_count || 0).toLocaleString()} documents</span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge rounded-pill fw-bold ${policy.active ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '0.6rem' }}>
                        {policy.active ? 'Active' : 'Inactive'}
                      </span>
                      <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold border-0" onClick={() => handleEditPolicy(policy)}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && !error && activeTab === 'restore' && (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faTrashRestore} className="fs-2 mb-3 opacity-30" />
              <h6 className="fw-bold mb-2" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>Restore Queue</h6>
              <p className="small mb-0">No documents pending restoration.</p>
            </div>
          )}

          {!loading && !error && activeTab === 'permanent' && (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faTrash} className="fs-2 mb-3 opacity-30" />
              <h6 className="fw-bold mb-2" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>Permanent Deletion Queue</h6>
              <p className="small mb-2">{stats.pendingDeletion || 0} documents scheduled for permanent deletion.</p>
              <button className="btn btn-danger rounded-pill px-4 fw-bold" onClick={() => addNotification('Permanent deletion processed.', 'success')}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />Process Deletions
              </button>
            </div>
          )}

          {!loading && !error && activeTab === 'scheduled' && (
            <div className="d-flex flex-column gap-3">
              {scheduledJobs.map(job => (
                <div key={job.id} className={`p-4 rounded-4 border d-flex justify-content-between align-items-center ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f8fafc' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className={`p-3 rounded-3 ${job.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                      <FontAwesomeIcon icon={job.status === 'active' ? faPlay : faPause} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{job.name}</h6>
                      <div className="d-flex gap-3">
                        <span className="x-small text-muted">Frequency: {job.frequency}</span>
                        <span className="x-small text-muted">Next: {job.nextRun}</span>
                        <span className="x-small text-muted">Last: {job.lastRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-pill fw-bold ${job.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ fontSize: '0.6rem' }}>
                      {job.status}
                    </span>
                    <button className={`btn btn-sm rounded-pill px-3 fw-bold border-0 ${job.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleJob(job)}>
                      <FontAwesomeIcon icon={job.status === 'active' ? faPause : faPlay} className="me-1" />
                      {job.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DialogBox show={showPolicyModal} onHide={() => { setShowPolicyModal(false); setEditingPolicy(null); }} title="Edit Retention Policy" size="medium"
        footer={
          <div className="d-flex gap-2 w-100">
            <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={() => { setShowPolicyModal(false); setEditingPolicy(null); }}>Cancel</button>
            <button type="button" className="btn btn-primary rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={handleSavePolicy}>Save Changes</button>
          </div>
        }>
        {editingPolicy && (
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-bold text-muted">Policy Name</label>
                <input type="text" className="form-control shadow-none" value={editingPolicy.name} onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })} />
              </div>
              <div>
                <label className="form-label small fw-bold text-muted">Retention Period</label>
                <input type="text" className="form-control shadow-none" value={editingPolicy.retention || editingPolicy.retention_period || ''} onChange={(e) => setEditingPolicy({ ...editingPolicy, retention: e.target.value })} />
              </div>
              <div>
                <label className="form-label small fw-bold text-muted">Applies To</label>
                <input type="text" className="form-control shadow-none" value={editingPolicy.applies || editingPolicy.department || ''} onChange={(e) => setEditingPolicy({ ...editingPolicy, applies: e.target.value })} />
              </div>
              <EnableDisableButton
                checked={editingPolicy.active}
                onClick={() => setEditingPolicy({ ...editingPolicy, active: !editingPolicy.active })}
                label="Active"
                size="small"
              />
            </div>
        )}
      </DialogBox>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .transition { transition: all 0.2s ease; }
        .btn-white { background: white; color: #1e293b; border: none; }
        .btn-white:hover { background: #f1f5f9; }
        ${isDark ? `.bg-light { background-color: #1e293b !important; } .text-muted { color: #94a3b8 !important; } .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; } .table { color: #f1f5f9 !important; } .table-hover tbody tr:hover { background-color: rgba(99,102,241,0.08) !important; } .form-control { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }` : ''}
      `}</style>
    </div>
  );
};

export default DmsArchiveCenter;
