import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateRight,
  faDownload,
  faEdit,
  faFileCsv,
  faFilePdf,
  faFloppyDisk,
  faPlus,
  faTrash,
  faUpload,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { downloadTextFile, readFeatureRecords, recordsToSql, toCsv, writeFeatureRecords } from '../../../utils/localFeatureStore';
import { getIcon } from './iconMap';

const DEFAULT_FORM = {
  title: '',
  owner: '',
  status: 'Open',
  priority: 'Medium',
  amount: '',
  dueDate: '',
  progress: '0',
  notes: '',
  attachmentName: '',
};

const statusOptions = ['Open', 'In Review', 'Approved', 'In Progress', 'Completed', 'On Hold', 'Rejected'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

function titleCase(value = '') {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const EmptyState = ({ icon, title }) => (
  <div className="enterprise-empty-state text-center p-5 rounded-4 border border-dashed">
    <div className="enterprise-empty-icon mx-auto mb-3">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h6 className="fw-bold mb-1">No records yet</h6>
    <p className="text-muted small mb-0">Add the first working record for {title}. Records are saved in browser storage for this frontend ZIP.</p>
  </div>
);

const EnterpriseFeatureWorkspace = ({ system = 'core', feature }) => {
  const fileRef = useRef(null);
  const icon = getIcon(feature?.icon);
  const title = feature?.label || 'Feature Workspace';
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (feature?.id) setRecords(readFeatureRecords(system, feature.id));
  }, [system, feature?.id]);

  useEffect(() => {
    if (feature?.id) writeFeatureRecords(system, feature.id, records);
  }, [records, system, feature?.id]);

  const stats = useMemo(() => {
    const total = records.length;
    const completed = records.filter((item) => item.status === 'Completed' || item.status === 'Approved').length;
    const highPriority = records.filter((item) => ['High', 'Critical'].includes(item.priority)).length;
    const totalAmount = records.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const avgProgress = total ? Math.round(records.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) / total) : 0;
    return { total, completed, highPriority, totalAmount, avgProgress };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return records.filter((record) => {
      const matchesQuery = !needle || [record.title, record.owner, record.status, record.priority, record.notes, record.attachmentName]
        .some((value) => String(value || '').toLowerCase().includes(needle));
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [records, query, statusFilter]);

  const resetForm = () => {
    setEditingId(null);
    setForm(DEFAULT_FORM);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const payload = {
      ...form,
      title: form.title.trim(),
      progress: Math.max(0, Math.min(100, Number(form.progress) || 0)),
      amount: form.amount === '' ? '' : Number(form.amount),
      updatedAt: now,
    };

    if (!payload.title) return;

    if (editingId) {
      setRecords((current) => current.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
    } else {
      setRecords((current) => [{ id: `${feature.id}-${Date.now()}`, createdAt: now, ...payload }, ...current]);
    }
    resetForm();
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setForm({
      title: record.title || '',
      owner: record.owner || '',
      status: record.status || 'Open',
      priority: record.priority || 'Medium',
      amount: record.amount ?? '',
      dueDate: record.dueDate || '',
      progress: String(record.progress ?? 0),
      notes: record.notes || '',
      attachmentName: record.attachmentName || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeRecord = (id) => {
    setRecords((current) => current.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  const markCompleted = (id) => {
    setRecords((current) => current.map((item) => (
      item.id === id ? { ...item, status: 'Completed', progress: 100, updatedAt: new Date().toISOString() } : item
    )));
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, attachmentName: file.name }));
  };

  const exportCsv = () => downloadTextFile(`${system}-${feature.id}.csv`, toCsv(records), 'text/csv;charset=utf-8');
  const exportJson = () => downloadTextFile(`${system}-${feature.id}-backup.json`, JSON.stringify(records, null, 2), 'application/json;charset=utf-8');
  const exportSql = () => downloadTextFile(`${system}-${feature.id}.sql`, recordsToSql(`${system}_${feature.id}`, records), 'application/sql;charset=utf-8');
  const printPdf = () => window.print();

  const importJson = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (Array.isArray(parsed)) setRecords(parsed);
      } catch {
        alert('Invalid backup file. Please select a JSON backup exported from this screen.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="enterprise-feature-page px-3 px-lg-4 py-4">
      <div className="enterprise-hero rounded-5 p-4 p-lg-5 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="position-absolute top-0 end-0 p-5 opacity-10" style={{ transform: 'rotate(15deg) translate(20%, -20%)' }}>
           <FontAwesomeIcon icon={icon} style={{ fontSize: '18rem' }} />
        </div>
        <div className="row align-items-center g-4 position-relative" style={{ zIndex: 1 }}>
          <div className="col-xl-8">
            <span className="badge rounded-pill bg-primary bg-opacity-20 text-white fw-bold px-3 py-2 mb-3 text-uppercase letter-spacing-wider">
               <FontAwesomeIcon icon={faRocket} className="me-2" />
               {system.toUpperCase()} • {feature?.category || 'Feature'}
            </span>
            <div className="d-flex align-items-center gap-4 mb-2">
              <div className="enterprise-hero-icon bg-white bg-opacity-10 p-3 rounded-4 shadow-lg backdrop-blur" style={{ width: '80px', height: '80px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <FontAwesomeIcon icon={icon} className="fs-1 text-primary" />
              </div>
              <div>
                <h1 className="text-white fw-bold mb-1 display-5" style={{ letterSpacing: '-0.03em' }}>{title}</h1>
                <p className="text-white text-opacity-75 mb-0 fs-5">{feature?.description || 'Professional working register with records, approvals, exports, and recovery.'}</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="enterprise-hero-panel p-4 rounded-4 bg-white bg-opacity-10 backdrop-blur shadow-sm border border-white border-opacity-10">
              <div className="d-flex justify-content-between small text-white text-opacity-75 mb-2 fw-bold text-uppercase letter-spacing-wider"><span>Average progress</span><span>{stats.avgProgress}%</span></div>
              <div className="progress rounded-pill mb-4" style={{ height: 10, background: 'rgba(255,255,255,0.1)' }}>
                <div className="progress-bar bg-white shadow-sm" style={{ width: `${stats.avgProgress}%` }} />
              </div>
              <div className="row g-2 text-center text-white">
                <div className="col-4"><div className="mini-metric"><strong className="d-block h4 mb-0">{stats.total}</strong><span className="x-small opacity-75 text-uppercase fw-bold letter-spacing-wider">Records</span></div></div>
                <div className="col-4"><div className="mini-metric"><strong className="d-block h4 mb-0">{stats.completed}</strong><span className="x-small opacity-75 text-uppercase fw-bold letter-spacing-wider">Closed</span></div></div>
                <div className="col-4"><div className="mini-metric"><strong className="d-block h4 mb-0">{stats.highPriority}</strong><span className="x-small opacity-75 text-uppercase fw-bold letter-spacing-wider">High</span></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {[
          ['Total Records', stats.total, 'All active records'],
          ['Closed / Approved', stats.completed, 'Completed workflow'],
          ['Financial Value', stats.totalAmount ? stats.totalAmount.toLocaleString() : '0', 'Amount / budget total'],
          ['Avg Progress', `${stats.avgProgress}%`, 'Weighted by records'],
        ].map(([label, value, help]) => (
          <div className="col-xl-3 col-md-6" key={label}>
            <div className="enterprise-stat-card card border-0 rounded-4 h-100">
              <div className="card-body p-4">
                <span className="small text-muted fw-semibold">{label}</span>
                <h3 className="fw-bold mb-1 mt-2">{value}</h3>
                <p className="text-muted small mb-0">{help}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-4">
          <div className="card border-0 rounded-4 enterprise-panel sticky-lg-top" style={{ top: 92, zIndex: 1 }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="fw-bold mb-1">{editingId ? 'Update Record' : 'Add New Record'}</h5>
                  <p className="text-muted small mb-0">Fully working frontend entry form.</p>
                </div>
                <button type="button" className="btn btn-light rounded-circle" onClick={resetForm} title="Reset form"><FontAwesomeIcon icon={faArrowRotateRight} /></button>
              </div>
              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Title / Reference</label>
                  <input className="form-control rounded-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={`${title} record title`} required />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Owner</label>
                    <input className="form-control rounded-3" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Owner" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Due Date</label>
                    <input type="date" className="form-control rounded-3" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select className="form-select rounded-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {statusOptions.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Priority</label>
                    <select className="form-select rounded-3" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                      {priorityOptions.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Amount / Budget</label>
                    <input type="number" min="0" step="0.01" className="form-control rounded-3" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Progress %</label>
                    <input type="number" min="0" max="100" className="form-control rounded-3" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea className="form-control rounded-3" rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add approval notes, risk, remarks, or workflow comments." />
                </div>
                <div>
                  <label className="form-label fw-semibold">Attachment Reference</label>
                  <div className="input-group">
                    <input className="form-control rounded-start-3" value={form.attachmentName} onChange={(e) => setForm({ ...form, attachmentName: e.target.value })} placeholder="File name / document reference" />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => fileRef.current?.click()}><FontAwesomeIcon icon={faUpload} /></button>
                    <input ref={fileRef} type="file" className="d-none" onChange={handleAttachment} />
                  </div>
                </div>
                <button className="btn btn-primary rounded-3 py-3 fw-bold" type="submit">
                  <FontAwesomeIcon icon={editingId ? faFloppyDisk : faPlus} className="me-2" />
                  {editingId ? 'Save Record' : 'Add Record'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card border-0 rounded-4 enterprise-panel mb-4">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                  <h5 className="fw-bold mb-1">Working Register</h5>
                  <p className="text-muted small mb-0">Search, filter, export, print, backup, restore, edit, and delete records.</p>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-outline-primary btn-sm rounded-pill" onClick={exportCsv}><FontAwesomeIcon icon={faFileCsv} className="me-1" />CSV</button>
                  <button type="button" className="btn btn-outline-primary btn-sm rounded-pill" onClick={exportJson}><FontAwesomeIcon icon={faDownload} className="me-1" />JSON</button>
                  <button type="button" className="btn btn-outline-primary btn-sm rounded-pill" onClick={exportSql}><FontAwesomeIcon icon={faDatabaseIcon} className="me-1" />SQL</button>
                  <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={printPdf}><FontAwesomeIcon icon={faFilePdf} className="me-1" />PDF</button>
                  <label className="btn btn-outline-success btn-sm rounded-pill mb-0"><FontAwesomeIcon icon={faUpload} className="me-1" />Restore<input type="file" accept="application/json" className="d-none" onChange={importJson} /></label>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-lg-8">
                  <input className="form-control rounded-3" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()} records...`} />
                </div>
                <div className="col-lg-4">
                  <select className="form-select rounded-3" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option>All</option>
                    {statusOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              {filteredRecords.length === 0 ? (
                <EmptyState icon={icon} title={title} />
              ) : (
                <div className="table-responsive enterprise-table-wrap">
                  <table className="table align-middle mb-0 enterprise-table">
                    <thead>
                      <tr>
                        <th>Record</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Amount</th>
                        <th>Progress</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id}>
                          <td style={{ minWidth: 260 }}>
                            <div className="fw-bold">{record.title}</div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: 320 }}>{record.notes || 'No notes added'}</div>
                            {record.attachmentName && <span className="badge bg-light text-secondary border mt-2">{record.attachmentName}</span>}
                          </td>
                          <td>{record.owner || '-'}</td>
                          <td><span className={`badge rounded-pill ${['Approved', 'Completed'].includes(record.status) ? 'bg-success' : record.status === 'Rejected' ? 'bg-danger' : 'bg-primary'}`}>{record.status}</span></td>
                          <td><span className={`badge rounded-pill ${['High', 'Critical'].includes(record.priority) ? 'bg-warning text-dark' : 'bg-secondary'}`}>{record.priority}</span></td>
                          <td>{record.amount !== '' && record.amount !== undefined ? Number(record.amount).toLocaleString() : '-'}</td>
                          <td style={{ minWidth: 140 }}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1 rounded-pill" style={{ height: 7 }}>
                                <div className="progress-bar" style={{ width: `${record.progress || 0}%` }} />
                              </div>
                              <span className="small fw-bold">{record.progress || 0}%</span>
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button type="button" className="btn btn-outline-success" onClick={() => markCompleted(record.id)}>Done</button>
                              <button type="button" className="btn btn-outline-primary" onClick={() => startEdit(record)}><FontAwesomeIcon icon={faEdit} /></button>
                              <button type="button" className="btn btn-outline-danger" onClick={() => removeRecord(record.id)}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="alert alert-info border-0 rounded-4 enterprise-note mb-0">
            <strong>{titleCase(system)} frontend register:</strong> this screen is operational inside the uploaded React project and persists records in browser storage. Connect API endpoints later to make it server-backed for all users.
          </div>
        </div>
      </div>
      <style>{`
        .backdrop-blur { backdrop-filter: blur(12px); }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .x-small { font-size: 10px; }
      `}</style>
    </div>
  );
};

const faDatabaseIcon = getIcon('database');

export default EnterpriseFeatureWorkspace;
