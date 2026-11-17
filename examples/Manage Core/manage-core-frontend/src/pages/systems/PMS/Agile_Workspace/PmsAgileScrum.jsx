import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listBacklog, createBacklogItem, updateBacklogItem, deleteBacklogItem } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faPlus, faEdit, faTrash, faSearch,
  faLayerGroup, faCheckCircle, faClock, faArrowRight, faFilter
} from '@fortawesome/free-solid-svg-icons';

const COLUMNS = ['To Do', 'In Progress', 'In Review', 'Done'];
const columnColors = ['#4f46e5', '#f59e0b', '#06b6d4', '#10b981'];

const PmsAgileScrum = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium', type: 'Task', story_points: '1' });

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
      setTasks(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    const totalPoints = tasks.reduce((s, t) => s + (Number(t.story_points) || 0), 0);
    const donePoints = tasks.filter(t => t.status === 'Done').reduce((s, t) => s + (Number(t.story_points) || 0), 0);
    return { total, done, inProgress, todo, totalPoints, donePoints };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    return tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, search]);

  const columnTasks = useMemo(() => {
    const map = {};
    COLUMNS.forEach(c => { map[c] = []; });
    filteredTasks.forEach(t => {
      const col = t.status || 'To Do';
      if (map[col]) map[col].push(t);
      else map['To Do'].push(t);
    });
    return map;
  }, [filteredTasks]);

  const moveTask = async (id, direction) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const idx = COLUMNS.indexOf(task.status || 'To Do');
    const nextIdx = Math.max(0, Math.min(COLUMNS.length - 1, idx + direction));
    const newStatus = COLUMNS[nextIdx];
    try {
      await updateBacklogItem(id, { status: newStatus });
      await loadData();
    } catch (err) { console.error(err); }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', type: 'Task', story_points: '1' });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({ title: t.title, description: t.description || '', status: t.status || 'To Do', priority: t.priority || 'Medium', type: t.type || 'Task', story_points: String(t.story_points || 1) });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    const payload = { ...form, project_id: projectId, story_points: Number(form.story_points) || 1 };
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
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteBacklogItem(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Tasks', value: stats.total, color: '#4f46e5', icon: faLayerGroup },
          { label: 'To Do', value: stats.todo, color: '#f59e0b', icon: faClock },
          { label: 'In Progress', value: stats.inProgress, color: '#06b6d4', icon: faBox },
          { label: 'Done', value: stats.done, color: '#10b981', icon: faCheckCircle },
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

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h6 className="fw-bold mb-1">Scrum Board</h6>
          <p className="small mb-0" style={{ color: mutedColor }}>Drag tasks across the board to track sprint progress.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
            value={projectId} onChange={e => setProjectId(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="input-group" style={{ borderColor, maxWidth: 260 }}>
            <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
            <input className="form-control" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor, fontSize: 13 }} />
          </div>
          <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Task
          </button>
        </div>
      </div>

      <div className="row g-3" style={{ minHeight: 400 }}>
        {COLUMNS.map((col, ci) => (
          <div key={col} className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: isDark ? '#1a1d29' : '#fff' }}>
              <div className="card-header bg-transparent border-0 pt-3 px-3 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: columnColors[ci] }} />
                    <span className="fw-bold small">{col}</span>
                  </div>
                  <span className="badge rounded-pill" style={{ background: `${columnColors[ci]}22`, color: columnColors[ci] }}>{(columnTasks[col] || []).length}</span>
                </div>
              </div>
              <div className="card-body p-3 d-flex flex-column gap-2">
                {loading ? (
                  <div className="text-center py-4" style={{ color: mutedColor }}><small>Loading...</small></div>
                ) : (columnTasks[col] || []).length === 0 ? (
                  <div className="text-center py-4" style={{ color: mutedColor }}>
                    <small>No tasks</small>
                  </div>
                ) : (columnTasks[col] || []).map(t => (
                  <div key={t.id} className="rounded-3 p-3" style={{ background: isDark ? '#262a3a' : '#f8f9fa', border: `1px solid ${borderColor}` }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold small" style={{ lineHeight: 1.3 }}>{t.title}</span>
                      {t.priority === 'High' || t.priority === 'Critical' ? (
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: 9 }}>{t.priority}</span>
                      ) : t.priority === 'Low' ? (
                        <span className="badge bg-secondary rounded-pill" style={{ fontSize: 9 }}>{t.priority}</span>
                      ) : null}
                    </div>
                    {t.description && <div className="extra-small mb-2" style={{ color: mutedColor }}>{t.description}</div>}
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <span className="badge bg-light text-dark rounded-pill" style={{ fontSize: 9 }}>{t.story_points || 0} pts</span>
                      <span className="badge bg-light text-dark rounded-pill" style={{ fontSize: 9 }}>{t.type || 'Task'}</span>
                    </div>
                    <div className="d-flex gap-1 justify-content-end">
                      {ci > 0 && <button className="btn btn-sm p-1" style={{ color: mutedColor }} onClick={() => moveTask(t.id, -1)} title="Move left"><FontAwesomeIcon icon={faArrowRight} style={{ transform: 'rotate(180deg)' }} /></button>}
                      <button className="btn btn-sm p-1 text-primary" onClick={() => openEdit(t)}><FontAwesomeIcon icon={faEdit} /></button>
                      {ci < COLUMNS.length - 1 && <button className="btn btn-sm p-1" style={{ color: mutedColor }} onClick={() => moveTask(t.id, 1)} title="Move right"><FontAwesomeIcon icon={faArrowRight} /></button>}
                      <button className="btn btn-sm p-1 text-danger" onClick={() => handleDelete(t.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: cardBg, borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">{editId ? 'Edit Task' : 'New Task'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Title</label>
                    <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Column</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        {COLUMNS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Priority</label>
                      <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Story Points</label>
                      <input type="number" min="0" className="form-control" value={form.story_points} onChange={e => setForm({ ...form, story_points: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Type</label>
                    <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option>Feature</option>
                      <option>Bug</option>
                      <option>Task</option>
                      <option>Spike</option>
                      <option>Chore</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Task'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.extra-small { font-size: 10px; }`}</style>
    </div>
  );
};

export default PmsAgileScrum;
