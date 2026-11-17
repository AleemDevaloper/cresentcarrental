import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listProgress, createProgress, updateProgress } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks, faPlus, faEdit, faTrash, faSearch,
  faCheckCircle, faClock, faChartLine, faFlag, faPlay, faPause
} from '@fortawesome/free-solid-svg-icons';

const PmsProgressTracking = () => {
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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ milestone: '', progress_percent: '0', notes: '', reported_date: '' });

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
      const data = await listProgress({ project_id: projectId });
      setItems(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = items.length;
    const avgProgress = total ? Math.round(items.reduce((s, i) => s + (Number(i.progress_percent) || 0), 0) / total) : 0;
    const highProgress = items.filter(i => (Number(i.progress_percent) || 0) >= 80).length;
    return { total, avgProgress, highProgress };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter(i => {
      return !search || (i.milestone || '').toLowerCase().includes(search.toLowerCase()) || (i.notes || '').toLowerCase().includes(search.toLowerCase());
    });
  }, [items, search]);

  const openAdd = () => {
    setEditId(null);
    setForm({ milestone: '', progress_percent: '0', notes: '', reported_date: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  };

  const openEdit = (i) => {
    setEditId(i.id);
    setForm({ milestone: i.milestone || '', progress_percent: String(i.progress_percent || 0), notes: i.notes || '', reported_date: i.reported_date?.slice(0, 10) || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.milestone) return;
    const payload = { ...form, project_id: projectId, progress_percent: Math.min(100, Math.max(0, Number(form.progress_percent) || 0)) };
    try {
      if (editId) {
        await updateProgress(editId, payload);
      } else {
        await createProgress(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async () => {};

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Items', value: stats.total, color: '#4f46e5', icon: faTasks },
          { label: 'High Progress', value: stats.highProgress, color: '#10b981', icon: faCheckCircle },
          { label: 'Avg Progress', value: `${stats.avgProgress}%`, color: '#8b5cf6', icon: faChartLine },
          { label: 'Reports', value: stats.total, color: '#06b6d4', icon: faClock },
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
              <h6 className="fw-bold mb-1">Progress Tracker</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Track project phases, milestones, and task completion.</p>
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
            <div className="col-md-8">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="fw-bold" style={{ color: '#10b981', lineHeight: '38px' }}>{stats.avgProgress}% avg progress</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Reported Date</th>
                  <th>Progress</th>
                  <th>Notes</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5" style={{ color: mutedColor }}>No progress items yet.</td></tr>
                ) : filtered.map(i => (
                  <tr key={i.id}>
                    <td>
                      <div className="fw-bold small">{i.milestone}</div>
                    </td>
                    <td className="small">{i.reported_date?.slice(0, 10) || '-'}</td>
                    <td style={{ minWidth: 140 }}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: 7, background: isDark ? '#2d3248' : '#e2e8f0' }}>
                          <div className="progress-bar" style={{ width: `${i.progress_percent || 0}%`, background: (i.progress_percent || 0) >= 100 ? '#10b981' : (i.progress_percent || 0) >= 50 ? '#f59e0b' : '#4f46e5' }} />
                        </div>
                        <span className="small fw-bold" style={{ minWidth: 32 }}>{i.progress_percent || 0}%</span>
                      </div>
                    </td>
                    <td className="small" style={{ maxWidth: 200 }}>
                      <div className="text-truncate">{i.notes || '-'}</div>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(i)}><FontAwesomeIcon icon={faEdit} /></button>
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
                <h5 className="fw-bold">{editId ? 'Edit Item' : 'Add Progress Item'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Milestone / Title</label>
                    <input className="form-control" required value={form.milestone} onChange={e => setForm({ ...form, milestone: e.target.value })} placeholder="e.g. Foundation phase" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Progress %</label>
                      <input type="number" min="0" max="100" className="form-control" value={form.progress_percent} onChange={e => setForm({ ...form, progress_percent: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Reported Date</label>
                      <input type="date" className="form-control" value={form.reported_date} onChange={e => setForm({ ...form, reported_date: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Notes</label>
                    <textarea className="form-control" rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
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

export default PmsProgressTracking;
