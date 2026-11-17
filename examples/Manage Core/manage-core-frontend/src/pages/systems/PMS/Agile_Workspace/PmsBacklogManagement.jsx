import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listBacklog, createBacklogItem, updateBacklogItem, deleteBacklogItem } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard, faPlus, faEdit, faTrash, faSearch,
  faListCheck, faArrowUp, faFlag, faFilter, faStar, faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const PmsBacklogManagement = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', type: 'Feature', story_points: '3', status: 'To Do' });

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
      const data = await listBacklog({ project_id: projectId });
      setItems(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = items.length;
    const high = items.filter(i => i.priority === 'High' || i.priority === 'Critical').length;
    const medium = items.filter(i => i.priority === 'Medium').length;
    const low = items.filter(i => i.priority === 'Low').length;
    const totalPoints = items.reduce((s, i) => s + (Number(i.story_points) || 0), 0);
    return { total, high, medium, low, totalPoints };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter(i => {
      const match = !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.type || '').toLowerCase().includes(search.toLowerCase());
      const pri = priorityFilter === 'All' || i.priority === priorityFilter;
      return match && pri;
    }).sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] || 99) - (order[b.priority] || 99);
    });
  }, [items, search, priorityFilter]);

  const getPriorityColor = (p) => {
    const map = { Critical: '#ef4444', High: '#f59e0b', Medium: '#4f46e5', Low: '#10b981' };
    return map[p] || '#64748b';
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', description: '', priority: 'Medium', type: 'Feature', story_points: '3', status: 'To Do' });
    setShowModal(true);
  };

  const openEdit = (i) => {
    setEditId(i.id);
    setForm({ title: i.title, description: i.description || '', priority: i.priority || 'Medium', type: i.type || 'Feature', story_points: String(i.story_points || 3), status: i.status || 'To Do' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    const payload = { ...form, project_id: projectId, story_points: Number(form.story_points) || 0 };
    try {
      if (editId) {
        await updateBacklogItem(editId, payload);
      } else {
        await createBacklogItem(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this backlog item?')) return;
    try {
      await deleteBacklogItem(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Items', value: stats.total, color: '#4f46e5', icon: faClipboard },
          { label: 'High Priority', value: stats.high, color: '#ef4444', icon: faArrowUp },
          { label: 'Medium', value: stats.medium, color: '#f59e0b', icon: faFlag },
          { label: 'Story Points', value: stats.totalPoints, color: '#8b5cf6', icon: faStar },
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
              <h6 className="fw-bold mb-1">Backlog</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Prioritized list of features, improvements, and bug fixes.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Item
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search backlog..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <div className="fw-bold" style={{ color: '#8b5cf6', lineHeight: '38px' }}>{stats.totalPoints} pts</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Story Pts</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>Backlog is empty. Start adding items.</td></tr>
                ) : filtered.map(i => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: getPriorityColor(i.priority) }} />
                    </td>
                    <td>
                      <div className="fw-bold small">{i.title}</div>
                    </td>
                    <td><span className="badge rounded-pill bg-light text-dark">{i.type || 'Feature'}</span></td>
                    <td>
                      <span className="badge rounded-pill" style={{ background: `${getPriorityColor(i.priority)}22`, color: getPriorityColor(i.priority) }}>
                        {i.priority}
                      </span>
                    </td>
                    <td><span className="badge rounded-pill bg-secondary">{i.status || 'To Do'}</span></td>
                    <td className="fw-bold">{i.story_points || 0}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(i)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i.id)}><FontAwesomeIcon icon={faTrash} /></button>
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
                <h5 className="fw-bold">{editId ? 'Edit Item' : 'Add Backlog Item'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Title</label>
                    <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. User profile page" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">Priority</label>
                      <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">Type</label>
                      <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Feature</option>
                        <option>Bug</option>
                        <option>Task</option>
                        <option>Spike</option>
                        <option>Chore</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">Story Points</label>
                      <input type="number" min="0" className="form-control" value={form.story_points} onChange={e => setForm({ ...form, story_points: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>In Review</option>
                        <option>Done</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Item'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsBacklogManagement;
