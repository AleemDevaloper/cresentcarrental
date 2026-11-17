import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listRisks, createRisk, updateRisk, deleteRisk } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved, faPlus, faEdit, faTrash, faSearch,
  faTriangleExclamation, faCheckCircle, faClock, faFlag, faFilter, faBug
} from '@fortawesome/free-solid-svg-icons';

const PmsRiskTracking = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [risks, setRisks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Technical', probability: 'Medium', impact: 'Medium', status: 'Open', mitigation_plan: '' });

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
      const data = await listRisks({ project_id: projectId });
      setRisks(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = risks.length;
    const critical = risks.filter(r => r.probability === 'High' && r.impact === 'High').length;
    const high = risks.filter(r => r.probability === 'High' || r.impact === 'High').length;
    const open = risks.filter(r => r.status === 'Open' || r.status === 'Mitigating').length;
    const mitigated = risks.filter(r => r.status === 'Closed').length;
    return { total, critical, high, open, mitigated };
  }, [risks]);

  const filtered = useMemo(() => {
    return risks.filter(r => {
      const match = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.category || '').toLowerCase().includes(search.toLowerCase());
      const sev = severityFilter === 'All' || r.probability === severityFilter || r.impact === severityFilter;
      return match && sev;
    }).sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return (order[a.probability] || 99) - (order[b.probability] || 99);
    });
  }, [risks, search, severityFilter]);

  const getSeverityColor = (r) => {
    if (r.probability === 'High' && r.impact === 'High') return '#ef4444';
    if (r.probability === 'High' || r.impact === 'High') return '#f59e0b';
    if (r.probability === 'Low' && r.impact === 'Low') return '#10b981';
    return '#4f46e5';
  };

  const getSeverityLabel = (r) => {
    if (r.probability === 'High' && r.impact === 'High') return 'Critical';
    if (r.probability === 'High' || r.impact === 'High') return 'High';
    if (r.probability === 'Low' && r.impact === 'Low') return 'Low';
    return 'Medium';
  };

  const getStatusBadge = (s) => {
    const map = { Open: 'danger', Mitigating: 'warning', Monitoring: 'info', Closed: 'success' };
    return <span className={`badge bg-${map[s] || 'secondary'} rounded-pill`}>{s}</span>;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', description: '', category: 'Technical', probability: 'Medium', impact: 'Medium', status: 'Open', mitigation_plan: '' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditId(r.id);
    setForm({ title: r.title, description: r.description || '', category: r.category || 'Technical', probability: r.probability || 'Medium', impact: r.impact || 'Medium', status: r.status || 'Open', mitigation_plan: r.mitigation_plan || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    const payload = { ...form, project_id: projectId };
    try {
      if (editId) {
        await updateRisk(editId, payload);
      } else {
        await createRisk(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this risk?')) return;
    try {
      await deleteRisk(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Risks', value: stats.total, color: '#4f46e5', icon: faShieldHalved },
          { label: 'Critical', value: stats.critical, color: '#ef4444', icon: faTriangleExclamation },
          { label: 'High', value: stats.high, color: '#f59e0b', icon: faFlag },
          { label: 'Open', value: stats.open, color: '#06b6d4', icon: faClock },
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
              <h6 className="fw-bold mb-1">Risk Register</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Identify, assess, and track project risks and mitigations.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Risk
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Severities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              {stats.open > 0 && <div className="fw-bold" style={{ color: '#ef4444', lineHeight: '38px' }}>{stats.open} open risks</div>}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Impact</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5" style={{ color: mutedColor }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5" style={{ color: mutedColor }}>No risks recorded. Add your first risk.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-bold small">{r.title}</div>
                      {r.mitigation_plan && <div className="extra-small" style={{ color: mutedColor }}>Mitigation: {r.mitigation_plan}</div>}
                    </td>
                    <td><span className="badge rounded-pill bg-light text-dark">{r.category}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: getSeverityColor(r) }} />
                        <span className="fw-bold small" style={{ color: getSeverityColor(r) }}>{getSeverityLabel(r)}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(r.status)}</td>
                    <td className="small" style={{ maxWidth: 200 }}>
                      <div className="text-truncate">{r.description || '-'}</div>
                    </td>
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
                <h5 className="fw-bold">{editId ? 'Edit Risk' : 'Add Risk'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Risk Title</label>
                    <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Server downtime risk" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Probability</label>
                      <select className="form-select" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })}>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Impact</label>
                      <select className="form-select" value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value })}>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Category</label>
                      <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        <option>Technical</option>
                        <option>Financial</option>
                        <option>Schedule</option>
                        <option>Resource</option>
                        <option>Legal</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option>Open</option>
                        <option>Mitigating</option>
                        <option>Monitoring</option>
                        <option>Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is the potential impact?" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Mitigation Plan</label>
                    <textarea className="form-control" rows="2" value={form.mitigation_plan} onChange={e => setForm({ ...form, mitigation_plan: e.target.value })} placeholder="How to mitigate?" />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Risk'}</button>
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

export default PmsRiskTracking;
