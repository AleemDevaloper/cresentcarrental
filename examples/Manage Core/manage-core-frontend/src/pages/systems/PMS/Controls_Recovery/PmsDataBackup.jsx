import React, { useState, useMemo } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudArrowUp, faPlus, faEdit, faTrash, faSearch,
  faDatabase, faCheckCircle, faClock, faRotate, faShieldHalved, faFilter
} from '@fortawesome/free-solid-svg-icons';

const PmsDataBackup = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [backups, setBackups] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms_backups') || '[]'); }
    catch { return []; }
  });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm] = useState({ name: '', type: 'Full', status: 'Pending', size: '', notes: '' });

  const save = (data) => {
    setBackups(data);
    localStorage.setItem('pms_backups', JSON.stringify(data));
  };

  const createBackup = () => {
    const now = new Date().toISOString();
    const newBackup = {
      id: `bk-${Date.now()}`,
      name: `Backup ${now.slice(0, 10)} ${now.slice(11, 16)}`,
      type: 'Full',
      status: 'Completed',
      size: `${(Math.random() * 500 + 50).toFixed(1)} MB`,
      createdAt: now,
      notes: 'Auto-generated backup',
    };
    save([newBackup, ...backups]);
  };

  const stats = useMemo(() => {
    const total = backups.length;
    const completed = backups.filter(b => b.status === 'Completed').length;
    const pending = backups.filter(b => b.status === 'Pending' || b.status === 'In Progress').length;
    const latest = backups.length > 0 ? backups[0].createdAt?.slice(0, 10) : 'N/A';
    return { total, completed, pending, latest };
  }, [backups]);

  const filtered = useMemo(() => {
    return backups.filter(b => {
      const match = !search || b.name.toLowerCase().includes(search.toLowerCase());
      const stat = statusFilter === 'All' || b.status === statusFilter;
      return match && stat;
    });
  }, [backups, search, statusFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', type: 'Full', status: 'Pending', size: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditId(b.id);
    setForm({ name: b.name, type: b.type, status: b.status, size: b.size || '', notes: b.notes || '' });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    if (editId) {
      save(backups.map(b => b.id === editId ? { ...b, ...form } : b));
    } else {
      save([...backups, { ...form, id: `bk-${Date.now()}`, createdAt: new Date().toISOString() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this backup record?')) save(backups.filter(b => b.id !== id));
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Backups', value: stats.total, color: '#4f46e5', icon: faDatabase },
          { label: 'Completed', value: stats.completed, color: '#10b981', icon: faCheckCircle },
          { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: faClock },
          { label: 'Latest', value: stats.latest, color: '#06b6d4', icon: faCloudArrowUp },
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
              <h6 className="fw-bold mb-1">Backup & Recovery</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Manage project data backups, restore points, and recovery logs.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm rounded-pill px-3" onClick={createBackup}>
                <FontAwesomeIcon icon={faRotate} className="me-1" /> Run Backup
              </button>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Record
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search backups..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Statuses</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <div className="fw-bold" style={{ color: '#10b981', lineHeight: '38px' }}>{stats.completed}/{stats.total} successful</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Backup Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Size</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5" style={{ color: mutedColor }}>No backups recorded. Run your first backup.</td></tr>
                ) : filtered.map(b => (
                  <tr key={b.id}>
                    <td className="fw-bold small">{b.name}</td>
                    <td><span className="badge rounded-pill" style={{ background: b.type === 'Full' ? '#4f46e5' : b.type === 'Incremental' ? '#10b981' : '#f59e0b' }}>{b.type}</span></td>
                    <td>
                      <span className={`badge rounded-pill bg-${b.status === 'Completed' ? 'success' : b.status === 'Failed' ? 'danger' : b.status === 'In Progress' ? 'info' : 'warning'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="small">{b.size || '-'}</td>
                    <td className="small">{b.createdAt?.slice(0, 16).replace('T', ' ') || '-'}</td>
                    <td className="small" style={{ maxWidth: 150 }}>
                      <div className="text-truncate">{b.notes || '-'}</div>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(b)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}><FontAwesomeIcon icon={faTrash} /></button>
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
                <h5 className="fw-bold">{editId ? 'Edit Backup' : 'Add Backup Record'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Backup Name</label>
                    <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pre-deployment backup" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Type</label>
                      <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Full</option>
                        <option>Incremental</option>
                        <option>Differential</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Failed</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Size</label>
                      <input className="form-control" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g. 250 MB" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Notes</label>
                    <textarea className="form-control" rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Backup notes" />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Record'}</button>
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

export default PmsDataBackup;
