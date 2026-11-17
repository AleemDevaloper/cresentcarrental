import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listBudgets, createBudget, updateBudget, deleteBudget } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced, faPlus, faEdit, faTrash, faSearch,
  faChartPie, faArrowUp, faArrowDown, faCircleDollarToSlot
} from '@fortawesome/free-solid-svg-icons';

const PmsBudgetTracking = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ category: 'Development', description: '', amount: '', spent: '', status: 'Active' });

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
      const data = await listBudgets({ project_id: projectId });
      setBudgets(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const totalAllocated = budgets.reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const totalSpent = budgets.reduce((s, b) => s + (Number(b.spent) || 0), 0);
    const remaining = totalAllocated - totalSpent;
    const utilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
    const overBudget = budgets.filter(b => (Number(b.spent) || 0) > (Number(b.amount) || 0)).length;
    return { totalAllocated, totalSpent, remaining, utilization, overBudget, count: budgets.length };
  }, [budgets]);

  const filtered = useMemo(() => {
    return budgets.filter(b => {
      const match = !search || (b.description || '').toLowerCase().includes(search.toLowerCase()) || (b.category || '').toLowerCase().includes(search.toLowerCase());
      const cat = filter === 'All' || b.category === filter;
      return match && cat;
    });
  }, [budgets, search, filter]);

  const openAdd = () => {
    setEditId(null);
    setForm({ category: 'Development', description: '', amount: '', spent: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditId(b.id);
    setForm({ category: b.category || 'Development', description: b.description || '', amount: String(b.amount || ''), spent: String(b.spent || ''), status: b.status || 'Active' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const payload = { ...form, project_id: projectId, amount: Number(form.amount), spent: Number(form.spent) || 0 };
    try {
      if (editId) {
        await updateBudget(editId, payload);
      } else {
        await createBudget(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget line?')) return;
    try {
      await deleteBudget(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Allocated', value: `$${stats.totalAllocated.toLocaleString()}`, color: '#4f46e5', icon: faCircleDollarToSlot },
          { label: 'Total Spent', value: `$${stats.totalSpent.toLocaleString()}`, color: '#ef4444', icon: faArrowUp },
          { label: 'Remaining', value: `$${stats.remaining.toLocaleString()}`, color: stats.remaining >= 0 ? '#10b981' : '#ef4444', icon: faArrowDown },
          { label: 'Utilization', value: `${stats.utilization}%`, color: stats.utilization > 80 ? '#f59e0b' : '#10b981', icon: faChartPie },
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
              <h6 className="fw-bold mb-1">Budget Lines</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Allocate and track project budgets by category.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Budget
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search budgets..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Categories</option>
                <option value="Development">Development</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Contingency">Contingency</option>
              </select>
            </div>
            <div className="col-md-3">
              {stats.overBudget > 0 && (
                <div className="d-flex align-items-center gap-2 text-danger justify-content-end" style={{ lineHeight: '38px' }}>
                  <FontAwesomeIcon icon={faArrowUp} /> {stats.overBudget} over budget
                </div>
              )}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Budget Item</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-end">Allocated</th>
                  <th className="text-end">Spent</th>
                  <th className="text-end">Remaining</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>No budget entries yet.</td></tr>
                ) : filtered.map(b => {
                  const alloc = Number(b.amount) || 0;
                  const spent = Number(b.spent) || 0;
                  const remaining = alloc - spent;
                  const pct = alloc > 0 ? Math.round((spent / alloc) * 100) : 0;
                  return (
                    <tr key={b.id}>
                      <td>
                        <div className="fw-bold small">{b.description || b.category}</div>
                      </td>
                      <td><span className="badge rounded-pill" style={{ background: b.category === 'Development' ? '#4f46e5' : b.category === 'Infrastructure' ? '#10b981' : b.category === 'Operations' ? '#f59e0b' : b.category === 'Marketing' ? '#ec4899' : '#8b5cf6' }}>{b.category}</span></td>
                      <td><span className={`badge rounded-pill bg-${b.status === 'Active' ? 'success' : b.status === 'Exceeded' ? 'danger' : 'secondary'}`}>{b.status || 'Active'}</span></td>
                      <td className="text-end fw-medium">${alloc.toLocaleString()}</td>
                      <td className="text-end fw-medium" style={{ color: spent > alloc ? '#ef4444' : textColor }}>${spent.toLocaleString()}</td>
                      <td className="text-end fw-bold" style={{ color: remaining < 0 ? '#ef4444' : '#10b981' }}>${remaining.toLocaleString()}</td>
                      <td className="text-end">
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <div className="progress flex-grow-1" style={{ height: 6, maxWidth: 80, background: isDark ? '#2d3248' : '#e2e8f0' }}>
                            <div className="progress-bar" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : '#10b981' }} />
                          </div>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(b)}><FontAwesomeIcon icon={faEdit} /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                <h5 className="fw-bold">{editId ? 'Edit Budget' : 'New Budget Line'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Budget Description</label>
                    <input className="form-control" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Phase 1 Development" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Category</label>
                      <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        <option>Development</option>
                        <option>Infrastructure</option>
                        <option>Operations</option>
                        <option>Marketing</option>
                        <option>Contingency</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option>Active</option>
                        <option>Exceeded</option>
                        <option>Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Allocated ($)</label>
                      <input type="number" min="0" step="0.01" className="form-control" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Spent to Date ($)</label>
                      <input type="number" min="0" step="0.01" className="form-control" value={form.spent} onChange={e => setForm({ ...form, spent: e.target.value })} placeholder="0.00" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Create Budget'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsBudgetTracking;
