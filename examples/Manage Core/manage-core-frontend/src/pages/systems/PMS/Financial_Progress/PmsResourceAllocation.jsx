import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listResources, createResource, updateResource, deleteResource } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faPlus, faEdit, faTrash, faSearch,
  faUserCheck, faUserClock, faUserPlus, faUserGear, faFilter
} from '@fortawesome/free-solid-svg-icons';

const PmsResourceAllocation = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ resource_name: '', role: 'Developer', resource_type: 'Human', allocation_percent: '100', start_date: '', end_date: '', status: 'Active' });

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
      const data = await listResources({ project_id: projectId });
      setResources(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = resources.length;
    const fullTime = resources.filter(r => Number(r.allocation_percent) >= 100).length;
    const partTime = resources.filter(r => Number(r.allocation_percent) < 100 && Number(r.allocation_percent) > 0).length;
    const totalFte = resources.reduce((s, r) => s + (Number(r.allocation_percent) || 0) / 100, 0);
    return { total, fullTime, partTime, totalFte: totalFte.toFixed(1) };
  }, [resources]);

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const match = !search || (r.resource_name || '').toLowerCase().includes(search.toLowerCase());
      const role = roleFilter === 'All' || r.role === roleFilter;
      return match && role;
    });
  }, [resources, search, roleFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm({ resource_name: '', role: 'Developer', resource_type: 'Human', allocation_percent: '100', start_date: '', end_date: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditId(r.id);
    setForm({
      resource_name: r.resource_name || '', role: r.role || 'Developer', resource_type: r.resource_type || 'Human',
      allocation_percent: String(r.allocation_percent || 100), start_date: r.start_date?.slice(0, 10) || '',
      end_date: r.end_date?.slice(0, 10) || '', status: r.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resource_name || !form.role) return;
    const payload = { ...form, project_id: projectId, allocation_percent: Math.min(100, Math.max(1, Number(form.allocation_percent) || 100)) };
    try {
      if (editId) {
        await updateResource(editId, payload);
      } else {
        await createResource(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this resource allocation?')) return;
    try {
      await deleteResource(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Resources', value: stats.total, color: '#4f46e5', icon: faUsers },
          { label: 'Full Time', value: stats.fullTime, color: '#10b981', icon: faUserCheck },
          { label: 'Part Time', value: stats.partTime, color: '#f59e0b', icon: faUserClock },
          { label: 'Total FTE', value: stats.totalFte, color: '#8b5cf6', icon: faUserGear },
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
              <h6 className="fw-bold mb-1">Resource Allocation</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Assign team members and track allocation percentages.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Resource
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search by name or project..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Roles</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="QA">QA</option>
                <option value="DevOps">DevOps</option>
                <option value="Business Analyst">Business Analyst</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <div className="fw-bold" style={{ color: '#4f46e5', lineHeight: '38px' }}>{stats.total} resources</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Role</th>
                  <th>Allocation</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>No resources allocated yet.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-bold small">{r.resource_name}</div>
                    </td>
                    <td><span className="badge rounded-pill bg-light text-dark">{r.resource_type || 'Human'}</span></td>
                    <td><span className="badge rounded-pill" style={{ background: r.role === 'Developer' ? '#4f46e5' : r.role === 'Designer' ? '#ec4899' : r.role === 'Project Manager' ? '#10b981' : r.role === 'QA' ? '#f59e0b' : r.role === 'DevOps' ? '#06b6d4' : '#8b5cf6' }}>{r.role}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: 7, maxWidth: 80, background: isDark ? '#2d3248' : '#e2e8f0' }}>
                          <div className="progress-bar" style={{ width: `${r.allocation_percent || 0}%`, background: (r.allocation_percent || 0) >= 100 ? '#ef4444' : (r.allocation_percent || 0) >= 75 ? '#f59e0b' : '#10b981' }} />
                        </div>
                        <span className="small fw-bold">{r.allocation_percent || 0}%</span>
                      </div>
                    </td>
                    <td className="small">{r.start_date?.slice(0, 10) || '-'}</td>
                    <td><span className={`badge rounded-pill bg-${r.status === 'Active' ? 'success' : r.status === 'Released' ? 'secondary' : 'warning'}`}>{r.status || 'Active'}</span></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(r)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}><FontAwesomeIcon icon={faTrash} /></button>
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
                <h5 className="fw-bold">{editId ? 'Edit Resource' : 'Add Resource'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Resource Name</label>
                    <input className="form-control" required value={form.resource_name} onChange={e => setForm({ ...form, resource_name: e.target.value })} placeholder="Team member name" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Type</label>
                      <select className="form-select" value={form.resource_type} onChange={e => setForm({ ...form, resource_type: e.target.value })}>
                        <option>Human</option>
                        <option>Equipment</option>
                        <option>Software</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Role</label>
                      <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        <option>Developer</option>
                        <option>Designer</option>
                        <option>Project Manager</option>
                        <option>QA</option>
                        <option>DevOps</option>
                        <option>Business Analyst</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Allocation %</label>
                      <input type="number" min="1" max="100" className="form-control" value={form.allocation_percent} onChange={e => setForm({ ...form, allocation_percent: e.target.value })} />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Start Date</label>
                      <input type="date" className="form-control" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">End Date</label>
                      <input type="date" className="form-control" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option>Active</option>
                      <option>Released</option>
                      <option>On Hold</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Resource'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsResourceAllocation;
