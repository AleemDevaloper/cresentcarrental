import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateRight,
  
  faFloppyDisk,
  faPlus,
  
  faUpload,
 
  faRocket,

} from '@fortawesome/free-solid-svg-icons';
import { listProductivityRecords, createProductivityRecord, updateProductivityRecord, deleteProductivityRecord } from '../../../api/tms';
import { useApp } from '../../../context/AppContext';

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

const EmptyState = ({ icon, title }) => (
  <div className="enterprise-empty-state text-center p-5 rounded-4 border border-dashed">
    <div className="enterprise-empty-icon mx-auto mb-3">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h6 className="fw-bold mb-1">No records yet</h6>
    <p className="text-muted small mb-0">Add the first working record for {title}.</p>
  </div>
);

const TmsAddRecord = () => {
  const { addNotification } = useApp();
  const fileRef = useRef(null);
  
  const title = 'Add New Record';
  
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await listProductivityRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records", err);
      addNotification("Failed to load records.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const completed = records.filter((item) => item.status === 'Completed' || item.status === 'Approved').length;
    const highPriority = records.filter((item) => ['High', 'Critical'].includes(item.priority)).length;
    const totalAmount = records.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const avgProgress = total ? Math.round(records.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) / total) : 0;
    return { total, completed, highPriority, totalAmount, avgProgress };
  }, [records]);

  const resetForm = () => {
    setEditingId(null);
    setForm(DEFAULT_FORM);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      title: record.title,
      owner: record.owner || '',
      status: record.status,
      priority: record.priority,
      amount: record.amount || '',
      dueDate: record.due_date || '',
      progress: record.progress || '0',
      notes: record.notes || '',
      attachmentName: record.attachment_name || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteProductivityRecord(id);
        setRecords(prev => prev.filter(r => r.id !== id));
        addNotification("Record deleted successfully.", "success");
      } catch (err) {
        addNotification("Failed to delete record.", "danger");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        progress: Math.max(0, Math.min(100, Number(form.progress) || 0)),
        amount: form.amount === '' ? null : Number(form.amount),
        due_date: form.dueDate === '' ? null : form.dueDate,
        attachment_name: form.attachmentName,
      };
      delete payload.dueDate; // renamed to due_date in payload
      delete payload.attachmentName; // renamed to attachment_name in payload

      if (editingId) {
        const updated = await updateProductivityRecord(editingId, payload);
        setRecords(prev => prev.map(r => r.id === editingId ? updated : r));
        addNotification("Record updated successfully.", "success");
      } else {
        const created = await createProductivityRecord(payload);
        setRecords(prev => [created, ...prev]);
        addNotification("Record created successfully.", "success");
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save record", err);
      addNotification("Failed to save record.", "danger");
    } finally {
      setSaving(false);
    }
  };

 
 

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, attachmentName: file.name }));
  };



  return (
    <div className="enterprise-feature-page px-3 px-lg-4 py-4">
      <div className="enterprise-hero rounded-5 p-4 p-lg-5 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="row align-items-center g-4 position-relative" style={{ zIndex: 1 }}>
          <div className="col-xl-8">
            <span className="badge rounded-pill bg-white text-primary fw-bold px-3 py-2 mb-3 text-uppercase">TMS • Add New Record</span>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="enterprise-hero-icon bg-white bg-opacity-10 p-3 rounded-4 shadow-lg">
                <FontAwesomeIcon icon={faRocket} className="text-primary fs-3" />
              </div>
              <div>
                <h2 className="text-white fw-bold mb-1">{title}</h2>
                <p className="text-white-50 mb-0">Manage productivity records, status updates, and reporting summaries.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="enterprise-hero-panel p-3 rounded-4 bg-white bg-opacity-10 backdrop-blur shadow-sm">
              <div className="d-flex justify-content-between small text-white-50 mb-2"><span>Average progress</span><span>{stats.avgProgress}%</span></div>
              <div className="progress rounded-pill mb-3" style={{ height: 8, background: 'rgba(255,255,255,0.1)' }}>
                <div className="progress-bar bg-white" style={{ width: `${stats.avgProgress}%` }} />
              </div>
              <div className="row g-2 text-center text-white">
                <div className="col-4"><div className="mini-metric"><strong className="d-block h5 mb-0">{stats.total}</strong><span className="x-small opacity-75">Records</span></div></div>
                <div className="col-4"><div className="mini-metric"><strong className="d-block h5 mb-0">{stats.completed}</strong><span className="x-small opacity-75">Closed</span></div></div>
                <div className="col-4"><div className="mini-metric"><strong className="d-block h5 mb-0">{stats.highPriority}</strong><span className="x-small opacity-75">High</span></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <div className="row g-4">
        <div className="col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 enterprise-panel sticky-lg-top" style={{ top: 92, zIndex: 1 }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="fw-bold mb-1">{editingId ? 'Update Record' : 'Add New Record'}</h5>
                  <p className="text-muted small mb-0">Fully working productivity entry form.</p>
                </div>
                <button type="button" className="btn btn-light rounded-circle" onClick={resetForm} title="Reset form"><FontAwesomeIcon icon={faArrowRotateRight} /></button>
              </div>
              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Title / Reference</label>
                  <input className="form-control rounded-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Record title" required />
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
                  <textarea className="form-control rounded-3" rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add notes, risks, or remarks." />
                </div>
                <div>
                  <label className="form-label fw-semibold">Attachment Reference</label>
                  <div className="input-group">
                    <input className="form-control rounded-start-3" value={form.attachmentName} onChange={(e) => setForm({ ...form, attachmentName: e.target.value })} placeholder="File name" />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => fileRef.current?.click()}><FontAwesomeIcon icon={faUpload} /></button>
                    <input ref={fileRef} type="file" className="d-none" onChange={handleAttachment} />
                  </div>
                </div>
                <button className="btn btn-primary rounded-3 py-3 fw-bold" type="submit" disabled={saving}>
                  <FontAwesomeIcon icon={editingId ? faFloppyDisk : faPlus} className="me-2" />
                  {saving ? 'Saving...' : (editingId ? 'Save Record' : 'Add Record')}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : records.length === 0 ? (
            <EmptyState icon={faRocket} title={title} />
          ) : (
            <div className="d-grid gap-3">
              {records.map((item) => (
                <div key={item.id} className="card border-0 shadow-sm rounded-4 enterprise-stat-card bg-white p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge rounded-pill ${item.priority === 'Critical' ? 'bg-danger' : item.priority === 'High' ? 'bg-warning' : 'bg-info'}`}>
                        {item.priority}
                      </span>
                      <span className="badge rounded-pill bg-light text-dark">{item.status}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light rounded-circle" onClick={() => handleEdit(item)}><FontAwesomeIcon icon={faPlus} style={{ transform: 'rotate(45deg)', fontSize: '10px' }} /></button>
                      <button className="btn btn-sm btn-light text-danger rounded-circle" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faPlus} style={{ transform: 'rotate(45deg)', fontSize: '10px' }} /></button>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  {item.owner && <p className="text-muted small mb-2">Owner: {item.owner}</p>}
                  <div className="progress rounded-pill mb-2" style={{ height: 6 }}>
                    <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
                  </div>
                  <div className="d-flex justify-content-between x-small text-muted">
                    <span>{item.progress}% Progress</span>
                    <span>{item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No date'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .backdrop-blur { backdrop-filter: blur(12px); }
        .x-small { font-size: 10px; }
        .mini-metric span { font-size: 11px; }
        .enterprise-stat-card { transition: transform 0.2s; }
        .enterprise-stat-card:hover { transform: translateY(-3px); }
      `}</style>
    </div>
  );
};

export default TmsAddRecord;
