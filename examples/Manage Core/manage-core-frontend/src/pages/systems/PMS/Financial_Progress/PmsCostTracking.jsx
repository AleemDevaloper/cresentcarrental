import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listCosts, createCost, updateCost, deleteCost } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWallet, faPlus, faEdit, faTrash, faSearch,
  faCheckCircle, faDollarSign, faArrowUp, faArrowDown, faFilter
} from '@fortawesome/free-solid-svg-icons';

const PmsCostTracking = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: '', type: 'Labor', amount: '', incurred_date: '' });

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
      const data = await listCosts({ project_id: projectId });
      setRecords(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = records.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const count = records.length;
    const labor = records.filter(r => r.type === 'Labor').reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const material = records.filter(r => r.type === 'Material').reduce((s, r) => s + (Number(r.amount) || 0), 0);
    return { total, count, labor, material };
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const match = !search || (r.description || '').toLowerCase().includes(search.toLowerCase());
      const cat = categoryFilter === 'All' || r.type === categoryFilter;
      return match && cat;
    }).sort((a, b) => new Date(b.incurred_date || 0) - new Date(a.incurred_date || 0));
  }, [records, search, categoryFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm({ description: '', type: 'Labor', amount: '', incurred_date: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditId(r.id);
    setForm({ description: r.description || '', type: r.type || 'Labor', amount: String(r.amount || ''), incurred_date: r.incurred_date?.slice(0, 10) || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const payload = { ...form, project_id: projectId, amount: Number(form.amount) };
    try {
      if (editId) {
        await updateCost(editId, payload);
      } else {
        await createCost(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cost entry?')) return;
    try {
      await deleteCost(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Cost', value: `$${stats.total.toLocaleString()}`, color: '#ef4444', icon: faDollarSign },
          { label: 'Entries', value: stats.count, color: '#4f46e5', icon: faWallet },
          { label: 'Labor Cost', value: `$${stats.labor.toLocaleString()}`, color: '#f59e0b', icon: faArrowUp },
          { label: 'Material Cost', value: `$${stats.material.toLocaleString()}`, color: '#10b981', icon: faArrowDown },
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
              <h6 className="fw-bold mb-1">Cost Register</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Track project labor, material, and miscellaneous costs.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Cost
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search by description..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Categories</option>
                <option value="Labor">Labor</option>
                <option value="Material">Material</option>
                <option value="Equipment">Equipment</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="fw-bold fs-5 text-end" style={{ color: '#ef4444', lineHeight: '38px' }}>${stats.total.toLocaleString()}</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5" style={{ color: mutedColor }}>No cost entries found. Add your first cost item.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-bold small">{r.description}</div>
                    </td>
                    <td><span className="badge rounded-pill" style={{ background: r.type === 'Labor' ? '#f59e0b' : r.type === 'Material' ? '#10b981' : r.type === 'Equipment' ? '#8b5cf6' : '#06b6d4' }}>{r.type}</span></td>
                    <td className="small">{r.incurred_date?.slice(0, 10) || '-'}</td>
                    <td className="text-end fw-bold" style={{ color: '#ef4444' }}>${(Number(r.amount) || 0).toLocaleString()}</td>
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
                <h5 className="fw-bold">{editId ? 'Edit Cost' : 'Add Cost Entry'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <input className="form-control" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Concrete pour labor" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Category</label>
                      <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Labor</option>
                        <option>Material</option>
                        <option>Equipment</option>
                        <option>Travel</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Amount ($)</label>
                      <input type="number" min="0" step="0.01" className="form-control" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Date</label>
                    <input type="date" className="form-control" value={form.incurred_date} onChange={e => setForm({ ...form, incurred_date: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Cost'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsCostTracking;
