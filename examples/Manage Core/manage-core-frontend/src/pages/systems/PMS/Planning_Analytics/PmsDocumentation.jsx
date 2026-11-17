import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listDocs, createDoc, updateDoc, deleteDoc } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt, faPlus, faEdit, faTrash, faSearch,
  faFilePdf, faFileWord, faFileExcel, faFileImage,
  faDownload, faFolder, faFilter
} from '@fortawesome/free-solid-svg-icons';

const PmsDocumentation = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [docs, setDocs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Note', content: '' });

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
      const data = await listDocs({ project_id: projectId });
      setDocs(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = docs.length;
    const notes = docs.filter(d => d.type === 'Note').length;
    const specs = docs.filter(d => d.type === 'Spec').length;
    const guides = docs.filter(d => d.type === 'Guide').length;
    return { total, notes, specs, guides };
  }, [docs]);

  const filtered = useMemo(() => {
    return docs.filter(d => {
      const match = !search || d.title.toLowerCase().includes(search.toLowerCase());
      const type = typeFilter === 'All' || d.type === typeFilter;
      return match && type;
    });
  }, [docs, search, typeFilter]);

  const getIcon = (type) => {
    const map = { Note: faFileAlt, Guide: faFileWord, Spec: faFileExcel, Requirement: faFileImage, 'Meeting Minutes': faFileAlt };
    return map[type] || faFileAlt;
  };

  const getColor = (type) => {
    const map = { Note: '#4f46e5', Guide: '#10b981', Spec: '#f59e0b', Requirement: '#06b6d4', 'Meeting Minutes': '#8b5cf6' };
    return map[type] || '#64748b';
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', type: 'Note', content: '' });
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditId(d.id);
    setForm({ title: d.title, type: d.type || 'Note', content: d.content || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    const payload = { ...form, project_id: projectId };
    try {
      if (editId) {
        await updateDoc(editId, payload);
      } else {
        await createDoc(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDoc(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Documents', value: stats.total, color: '#4f46e5', icon: faFolder },
          { label: 'Notes', value: stats.notes, color: '#4f46e5', icon: faFileAlt },
          { label: 'Specs', value: stats.specs, color: '#10b981', icon: faFileWord },
          { label: 'Guides', value: stats.guides, color: '#f59e0b', icon: faFileExcel },
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
              <h6 className="fw-bold mb-1">Document Repository</h6>
              <p className="small mb-0" style={{ color: mutedColor }}>Manage project documentation, specifications, and reports.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd} disabled={!projectId}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Document
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group" style={{ borderColor }}>
                <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                <option value="All">All Types</option>
                <option>Note</option>
                <option>Guide</option>
                <option>Spec</option>
                <option>Requirement</option>
                <option>Meeting Minutes</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <div className="fw-bold" style={{ color: '#4f46e5', lineHeight: '38px' }}>{stats.total} files</div>
            </div>
          </div>

          <div className="row g-3">
            {loading ? (
              <div className="text-center py-5" style={{ color: mutedColor }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5" style={{ color: mutedColor }}>No documents yet. Add your first document.</div>
            ) : filtered.map(d => (
              <div key={d.id} className="col-md-6 col-lg-4">
                <div className="card border rounded-3 h-100" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor }}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: `${getColor(d.type)}18`, color: getColor(d.type), fontSize: 18 }}>
                        <FontAwesomeIcon icon={getIcon(d.type)} />
                      </div>
                      <div style={{ minWidth: 0 }} className="flex-grow-1">
                        <div className="fw-bold small text-truncate">{d.title}</div>
                        <div className="extra-small" style={{ color: mutedColor }}>{d.type}</div>
                        {d.content && <div className="extra-small mt-1" style={{ color: mutedColor }}>{d.content.substring(0, 100)}{d.content.length > 100 ? '...' : ''}</div>}
                      </div>
                    </div>
                    <div className="d-flex gap-1 justify-content-end mt-2 pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(d)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: cardBg, borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">{editId ? 'Edit Document' : 'Add Document'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Title</label>
                    <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Architecture Overview" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Type</label>
                    <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option>Note</option>
                      <option>Guide</option>
                      <option>Spec</option>
                      <option>Requirement</option>
                      <option>Meeting Minutes</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Content</label>
                    <textarea className="form-control" rows="4" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Document content..." />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editId ? 'Update' : 'Add Document'}</button>
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

export default PmsDocumentation;
