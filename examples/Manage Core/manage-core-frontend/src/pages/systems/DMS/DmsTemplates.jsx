import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listTemplates, createTemplate, updateTemplate, deleteTemplate } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faEye,
  faGripVertical,
  faTimes,
  faCheck,
  faTag,
  faFolder,
  faClock,
  faArrowUp,
  faArrowDown,
  faLayerGroup
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { EnableDisableButton } from '../../../components/common';

const CATEGORIES = ['Contract', 'Invoice', 'Report', 'Proposal', 'Form', 'Policy', 'Other'];
const FIELD_TYPES = ['text', 'signature', 'date', 'checkbox', 'dropdown'];

const DmsTemplates = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', tags: '', fields: [] });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await listTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch templates', err);
      addNotification('Failed to load templates.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', category: '', tags: '', fields: [] });
    setShowModal(true);
  };

  const openEditModal = (tmpl) => {
    setEditingTemplate(tmpl);
    setFormData({
      name: tmpl.name || '',
      description: tmpl.description || '',
      category: tmpl.category || '',
      tags: tmpl.tags?.join(', ') || '',
      fields: tmpl.fields || [],
    });
    setShowModal(true);
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'text', required: false }]
    }));
  };

  const removeField = (idx) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== idx)
    }));
  };

  const updateField = (idx, key, value) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === idx ? { ...f, [key]: value } : f)
    }));
  };

  const moveField = (idx, direction) => {
    const newFields = [...formData.fields];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newFields.length) return;
    [newFields[idx], newFields[targetIdx]] = [newFields[targetIdx], newFields[idx]];
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, payload);
        addNotification('Template updated successfully.', 'success');
      } else {
        await createTemplate(payload);
        addNotification('Template created successfully.', 'success');
      }
      setShowModal(false);
      fetchTemplates();
    } catch (err) {
      addNotification('Failed to save template.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id);
      addNotification('Template deleted.', 'success');
      setDeleteConfirm(null);
      fetchTemplates();
    } catch (err) {
      addNotification('Failed to delete template.', 'danger');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      text: '#0ea5e9',
      signature: '#8b5cf6',
      date: '#f59e0b',
      checkbox: '#10b981',
      dropdown: '#ef4444',
    };
    return colors[type] || '#64748b';
  };

  const CATEGORY_PALETTES = {
    Contract: { bg: '#fef3c7', color: '#d97706' },
    Invoice: { bg: '#dbeafe', color: '#2563eb' },
    Report: { bg: '#f3e8ff', color: '#7c3aed' },
    Proposal: { bg: '#d1fae5', color: '#059669' },
    Form: { bg: '#fce7f3', color: '#db2777' },
    Policy: { bg: '#e0f2fe', color: '#0284c7' },
    Other: { bg: '#f1f5f9', color: '#64748b' },
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-4">
              <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
                <FontAwesomeIcon icon={faLayerGroup} className="fs-3" />
              </div>
              <div>
                <h3 className="fw-bold mb-1">Document Templates</h3>
                <p className="mb-0 opacity-75">Create, manage, and reuse document templates across the organization.</p>
              </div>
            </div>
            <button className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg transition hover-lift" onClick={openCreateModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />Create Template
            </button>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex gap-2 flex-wrap">
              <button
                className={`btn btn-sm rounded-pill px-3 border-0 fw-bold transition ${categoryFilter === 'all' ? 'btn-primary shadow-sm text-white' : 'btn-light text-muted'}`}
                onClick={() => setCategoryFilter('all')}
              >All</button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm rounded-pill px-3 border-0 fw-bold transition ${categoryFilter === cat ? 'btn-primary shadow-sm text-white' : 'btn-light text-muted'}`}
                  onClick={() => setCategoryFilter(cat)}
                >{cat}</button>
              ))}
            </div>
            <div className="position-relative">
              <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem' }} />
              <input
                type="text"
                className="form-control border shadow-none rounded-pill ps-5 bg-light small"
                placeholder="Search templates by name or tags..."
                style={{ width: '280px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <FontAwesomeIcon icon={faFileAlt} className="fs-2 mb-3 opacity-30" />
          <p className="small mb-0">No templates found. Create your first template to get started.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredTemplates.map(tmpl => {
            const palette = CATEGORY_PALETTES[tmpl.category] || CATEGORY_PALETTES.Other;
            return (
              <div key={tmpl.id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card border shadow-sm rounded-4 h-100 transition hover-lift-sm">
                  <div className="card-body p-4 d-flex flex-column">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-4 mb-3"
                      style={{
                        height: '120px',
                        backgroundColor: `${palette.bg}`,
                        borderRadius: '16px',
                      }}
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="fs-1" style={{ color: palette.color, opacity: 0.6 }} />
                    </div>
                    <h6 className="fw-bold mb-1 text-truncate">{tmpl.name}</h6>
                    <span className="badge rounded-pill px-2 py-1 fw-bold mb-2 align-self-start" style={{ backgroundColor: palette.bg, color: palette.color, fontSize: '0.6rem' }}>
                      {tmpl.category || 'Uncategorized'}
                    </span>
                    <p className="x-small text-muted mb-2 flex-grow-1 line-clamp-2">{tmpl.description || 'No description'}</p>
                    <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                      <span className="x-small text-muted"><FontAwesomeIcon icon={faClock} className="me-1" />{tmpl.created_at ? new Date(tmpl.created_at).toLocaleDateString() : '—'}</span>
                      <span className="x-small text-muted"><FontAwesomeIcon icon={faFolder} className="me-1" />{tmpl.usage_count || 0} uses</span>
                    </div>
                    {tmpl.tags?.length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {tmpl.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="badge bg-light text-muted border rounded-pill px-2 py-1 fw-normal" style={{ fontSize: '0.55rem' }}>
                            <FontAwesomeIcon icon={faTag} className="me-1" style={{ fontSize: '0.5rem' }} />{tag}
                          </span>
                        ))}
                        {tmpl.tags.length > 3 && <span className="x-small text-muted">+{tmpl.tags.length - 3}</span>}
                      </div>
                    )}
                    <div className="d-flex gap-2 mt-auto pt-3 border-top border-light">
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold flex-grow-1" onClick={() => setShowPreview(tmpl)}>
                        <FontAwesomeIcon icon={faEye} className="me-1" />Preview
                      </button>
                      <button className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold" onClick={() => openEditModal(tmpl)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => setDeleteConfirm(tmpl.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DialogBox show={showModal} onHide={() => setShowModal(false)} title={editingTemplate ? 'Edit Template' : 'Create Template'} size="large">
        <form onSubmit={handleSave}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold small">Template Name</label>
              <input
                type="text"
                className="form-control border shadow-none rounded-3"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="e.g. Standard NDA"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">Category</label>
              <select
                className="form-select border shadow-none rounded-3"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Description</label>
            <textarea
              className="form-control border shadow-none rounded-3"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the template..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Tags (comma separated)</label>
            <input
              type="text"
              className="form-control border shadow-none rounded-3"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. legal, standard, confidential"
            />
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold small mb-0">Template Fields</label>
              <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={addField}>
                <FontAwesomeIcon icon={faPlus} className="me-1" />Add Field
              </button>
            </div>
            {formData.fields.length === 0 ? (
              <div className="text-center py-3 bg-light rounded-3 text-muted small">No fields added yet. Click "Add Field" to build your template.</div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {formData.fields.map((field, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2 p-3 rounded-3 bg-light border">
                    <div className="d-flex flex-column gap-1">
                      <button type="button" className="btn btn-sm btn-light p-0 border-0 text-muted" onClick={() => moveField(idx, -1)} disabled={idx === 0}>
                        <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '0.6rem' }} />
                      </button>
                      <button type="button" className="btn btn-sm btn-light p-0 border-0 text-muted" onClick={() => moveField(idx, 1)} disabled={idx === formData.fields.length - 1}>
                        <FontAwesomeIcon icon={faArrowDown} style={{ fontSize: '0.6rem' }} />
                      </button>
                    </div>
                    <FontAwesomeIcon icon={faGripVertical} className="text-muted" style={{ fontSize: '0.7rem' }} />
                    <input
                      type="text"
                      className="form-control form-control-sm border shadow-none rounded-3"
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) => updateField(idx, 'name', e.target.value)}
                      style={{ width: '200px' }}
                    />
                    <select
                      className="form-select form-select-sm border shadow-none rounded-3"
                      value={field.type}
                      onChange={(e) => updateField(idx, 'type', e.target.value)}
                      style={{ width: '130px' }}
                    >
                      {FIELD_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                    <EnableDisableButton
                       checked={field.required}
                       onClick={() => updateField(idx, 'required', !field.required)}
                       label="Required"
                       size="small"
                     />
                    <button type="button" className="btn btn-sm btn-light text-danger border-0 p-1" onClick={() => removeField(idx)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold flex-grow-1 shadow-sm" disabled={saving}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : editingTemplate ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </form>
      </DialogBox>

      <DialogBox show={!!showPreview} onHide={() => setShowPreview(null)} title={showPreview?.name || 'Template Preview'} size="large">
        {showPreview && (
          <>
            <div className="mb-3">
              <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: (CATEGORY_PALETTES[showPreview.category] || CATEGORY_PALETTES.Other).bg, color: (CATEGORY_PALETTES[showPreview.category] || CATEGORY_PALETTES.Other).color }}>
                {showPreview.category || 'Uncategorized'}
              </span>
              <p className="text-muted small mt-2">{showPreview.description || 'No description'}</p>
            </div>
            {(showPreview.fields || []).length > 0 ? (
              <div className="d-flex flex-column gap-2">
                <h6 className="fw-bold small">Fields</h6>
                {(showPreview.fields || []).map((field, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                    <span className="badge rounded-pill px-2 py-1 fw-bold" style={{ backgroundColor: `${getTypeColor(field.type)}15`, color: getTypeColor(field.type), fontSize: '0.6rem' }}>
                      {field.type}
                    </span>
                    <span className="fw-bold small flex-grow-1">{field.name}</span>
                    {field.required && <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1 fw-bold x-small">Required</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">This template has no fields.</div>
            )}
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold" onClick={() => { addNotification('Template applied to new document.', 'success'); setShowPreview(null); }}>
                <FontAwesomeIcon icon={faCheck} className="me-2" />Use Template
              </button>
            </div>
          </>
        )}
      </DialogBox>

      <DialogBox show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)} title="Delete Template" size="small">
        <div className="text-center py-2">
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10" style={{ width: '72px', height: '72px' }}>
            <FontAwesomeIcon icon={faTrash} className="text-danger fs-3" />
          </div>
          <p className="text-muted small mb-0">Are you sure you want to delete this template? This action cannot be undone.</p>
        </div>
        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-light rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger rounded-pill px-4 py-2 fw-bold flex-grow-1 shadow-sm" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
        </div>
      </DialogBox>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 0.65rem; }
        .transition { transition: all 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        .hover-lift-sm:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .form-check-input[type="checkbox"] { cursor: pointer; }
        .form-check-input[type="radio"] { cursor: pointer; }
        ${isDark ? `
          .card, .bg-white { background-color: #1e293b !important; border-color: #334155 !important; }
          .bg-light { background-color: #1e293b !important; }
          .border-light { border-color: #334155 !important; }
          .text-muted { color: #94a3b8 !important; }
          .text-dark { color: #f1f5f9 !important; }
          .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .form-control, .form-select { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .btn-outline-primary { border-color: #6366f1 !important; color: #a5b4fc !important; }
          .btn-outline-primary:hover { background-color: rgba(99,102,241,0.15) !important; color: #c7d2fe !important; }
          .btn-outline-info { border-color: #0ea5e9 !important; color: #38bdf8 !important; }
          .btn-outline-info:hover { background-color: rgba(14,165,233,0.15) !important; }
          .btn-outline-danger { border-color: #ef4444 !important; color: #fca5a5 !important; }
          .btn-outline-danger:hover { background-color: rgba(239,68,68,0.15) !important; }
        ` : ''}
      `}</style>
    </div>
  );
};

export default DmsTemplates;
