import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listSprints, createSprint, updateSprint, deleteSprint } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock, faPlus, faEdit, faTrash, faSearch,
  faRocket, faCheckCircle, faPlay, faPause, faFlag, faFilter
} from '@fortawesome/free-solid-svg-icons';

const sprintStatuses = ['Planning', 'Active', 'Completed'];

const PmsSprintManagement = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [sprints, setSprints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', goal: '', status: 'Planning', start_date: '', end_date: '' });

  useEffect(() => {
    listProjects().then(data => {
      setProjects(data);
      if (data.length > 0) setProjectId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (projectId) loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await listSprints({ project_id: projectId });
      setSprints(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = sprints.length;
    const active = sprints.filter(s => s.status === 'Active').length;
    const completed = sprints.filter(s => s.status === 'Completed').length;
    const totalBacklogs = sprints.reduce((s, sp) => s + (sp.backlogs?.length || 0), 0);
    const doneBacklogs = sprints.reduce((s, sp) => s + (sp.backlogs?.filter(b => b.status === 'Done').length || 0), 0);
    const velocity = totalBacklogs > 0 ? Math.round((doneBacklogs / totalBacklogs) * 100) : 0;
    return { total, active, completed, velocity };
  }, [sprints]);

  const filtered = useMemo(() => {
    return sprints.filter(s => {
      const match = !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.goal || '').toLowerCase().includes(search.toLowerCase());
      const stat = statusFilter === 'All' || s.status === statusFilter;
      return match && stat;
    });
  }, [sprints, search, statusFilter]);

  const getStatusColor = (s) => {
    const map = { Planning: '#f59e0b', Active: '#10b981', Completed: '#8b5cf6' };
    return map[s] || '#64748b';
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', goal: '', status: 'Planning', start_date: '', end_date: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, goal: s.goal || '', status: s.status || 'Planning', start_date: s.start_date?.slice(0, 10) || '', end_date: s.end_date?.slice(0, 10) || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    const payload = { ...form, project_id: projectId };
    try {
      if (editId) {
        await updateSprint(editId, payload);
      } else {
        await createSprint(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sprint?')) return;
    try {
      await deleteSprint(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Sprints', value: stats.total, color: '#4f46e5', icon: faClock },
          { label: 'Active', value: stats.active, color: '#10b981', icon: faPlay },
          { label: 'Completed', value: stats.completed, color: '#8b5cf6', icon: faFlag },
          { label: 'Velocity', value: `${stats.velocity}%`, color: stats.velocity > 70 ? '#10b981' : '#f59e0b', icon: faRocket },
        ].map((s, i) => (
          <div key={i} className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', background: cardBg }}>
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: `${s.color}18`, color: s.color, fontSize: 20 }}>
                  <FontAwesomeIcon icon={s.icon} />
                </div>
                <div>
                  <div className="fw-bold fs-4" style={{ color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div className="small" style={{ color: mutedColor, lineHeight: 1.2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: cardBg }}>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h6 className="fw-bold mb-1">Sprint List</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Plan and manage development sprints.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> New Sprint
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search sprints..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Statuses</option>
                {sprintStatuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-3 text-end">
              <div className="fw-bold" style={{ color: '#10b981', lineHeight: '38px' }}>Velocity: {stats.velocity}%</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Sprint</th>
                  <th>Goal</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5" style={{ color: mutedColor }}>No sprints yet. Create your first sprint.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="fw-bold small">{s.name}</div>
                    </td>
                    <td className="small" style={{ maxWidth: 200 }}>
                      <div className="text-truncate">{s.goal || '-'}</div>
                    </td>
                    <td>
                      <span className="badge rounded-pill" style={{ background: getStatusColor(s.status) }}>{s.status}</span>
                    </td>
                    <td className="small">{s.start_date?.slice(0, 10) || '?'} - {s.end_date?.slice(0, 10) || '?'}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(s)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: cardBg, borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">{editId ? 'Edit Sprint' : 'New Sprint'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Sprint Name</label>
                    <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sprint 5" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Goal</label>
                    <input className="form-control" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} placeholder="Sprint goal" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        {sprintStatuses.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Start Date</label>
                      <input type="date" className="form-control" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">End Date</label>
                      <input type="date" className="form-control" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Create Sprint'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsSprintManagement;
