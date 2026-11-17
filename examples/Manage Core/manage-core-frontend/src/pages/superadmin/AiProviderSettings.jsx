import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloud, faPlus, faEdit, faTrash, faPlay, faCheckCircle,
  faCircle, faTimes, faKey, faServer, faCog,
} from '@fortawesome/free-solid-svg-icons';
import { listAiProviders, createAiProvider, updateAiProvider, deleteAiProvider, testAiProvider, detectProviderModels } from '../../api/ai';

const PROVIDER_TYPES = ['openrouter', 'openai', 'anthropic', 'google', 'custom'];

export default function AiProviderSettings({ isDark }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(getEmptyForm());
  const [alert, setAlert] = useState(null);
  const [detectedModels, setDetectedModels] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [modelSelection, setModelSelection] = useState({});

  function getEmptyForm() {
    return { name: '', provider_type: 'openrouter', api_key: '', base_url: '', default_model: '', available_models: '', is_active: true, is_default: false };
  }

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      setProviders(await listAiProviders());
    } catch {
      showAlert('Failed to load providers', 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  function openAdd() {
    setForm(getEmptyForm());
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      name: p.name || '',
      provider_type: p.provider_type || 'openrouter',
      api_key: '',
      base_url: p.base_url || '',
      default_model: p.default_model || '',
      available_models: (p.available_models || []).join(', '),
      is_active: p.is_active ?? true,
      is_default: p.is_default ?? false,
    });
    setEditing(p);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        api_key: form.api_key || undefined,
        available_models: form.available_models ? form.available_models.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editing && !payload.api_key) delete payload.api_key;

      if (editing) {
        await updateAiProvider(editing.id, payload);
        showAlert('Provider updated');
      } else {
        await createAiProvider(payload);
        showAlert('Provider created');
      }
      setShowForm(false);
      setEditing(null);
      fetch();
    } catch (e) {
      showAlert(e.response?.data?.message || 'Operation failed', 'danger');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this provider?')) return;
    try {
      await deleteAiProvider(id);
      showAlert('Provider deleted');
      fetch();
    } catch {
      showAlert('Failed to delete', 'danger');
    }
  }

  async function handleTest(id) {
    try {
      const res = await testAiProvider(id);
      showAlert(res.message || 'Test successful');
    } catch (e) {
      showAlert(e.response?.data?.message || 'Test failed', 'danger');
    }
  }

  async function handleSetDefault(provider) {
    if (provider.is_default) return;
    try {
      await updateAiProvider(provider.id, { is_default: true });
      showAlert('Default provider updated');
      fetch();
    } catch {
      showAlert('Failed to set default', 'danger');
    }
  }

  const cardBg = isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white';
  const inputBg = isDark ? 'bg-dark bg-opacity-30' : 'bg-light';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show rounded-4 border-0 shadow-sm`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)} />
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">AI Provider Settings</h5>
        <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={openAdd}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none' }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Provider
        </button>
      </div>

      {/* Provider Cards */}
      <div className="row g-4">
        {providers.map(p => (
          <div key={p.id} className="col-xl-4 col-lg-6">
            <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${cardBg}`}
              style={{ border: p.is_default ? '1px solid #6366f1' : 'none' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 42, height: 42, background: 'rgba(79,70,229,0.12)', color: '#6366f1' }}>
                    <FontAwesomeIcon icon={faCloud} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{p.name}</h6>
                    {p.is_default && <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-0.5 mt-1" style={{ fontSize: '10px' }}>Default</span>}
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-link text-muted p-1" onClick={() => openEdit(p)} title="Edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-sm btn-link text-danger p-1" onClick={() => handleDelete(p.id)} title="Delete">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>{p.provider_type}</span>
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>{p.default_model || 'No default'}</span>
                {p.has_api_key && <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}><FontAwesomeIcon icon={faKey} className="me-1" />Key set</span>}
              </div>

              {p.base_url && <code className="d-block small text-muted mb-2" style={{ fontSize: '11px' }}>{p.base_url}</code>}

              <div className="d-flex gap-2 mt-auto pt-3 border-top">
                <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => handleTest(p.id)}>
                  <FontAwesomeIcon icon={faPlay} className="me-1" /> Test
                </button>
                {!p.is_default && (
                  <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => handleSetDefault(p)}>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Set Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && providers.length === 0 && (
        <div className={`card border-0 shadow-sm rounded-4 p-5 text-center ${cardBg}`}>
          <FontAwesomeIcon icon={faCloud} size="3x" className="text-muted opacity-25 mb-3" />
          <h6 className="fw-bold">No AI providers configured yet</h6>
          <p className="text-muted small">Add an OpenRouter or OpenAI provider to get started</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h5 className="fw-bold mb-0">{editing ? 'Edit Provider' : 'Add Provider'}</h5>
                <button className="btn-close" onClick={() => { setShowForm(false); setEditing(null); }} />
              </div>
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Provider Name</label>
                    <input type="text" className={`form-control ${inputBg} border-0 rounded-3`} required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Type</label>
                    <select className={`form-select ${inputBg} border-0 rounded-3`}
                      value={form.provider_type} onChange={e => setForm(f => ({ ...f, provider_type: e.target.value }))}>
                      {PROVIDER_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">API Key</label>
                    <div className="d-flex gap-2">
                      <input type="password" className={`form-control ${inputBg} border-0 rounded-3`}
                        value={form.api_key}
                        placeholder={editing ? 'Leave blank to keep existing' : ''}
                        onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))} />
                      <button type="button" className={`btn btn-outline-secondary rounded-pill px-3 ${detecting ? 'disabled' : ''}`} onClick={async () => {
                        // Detect models using backend helper
                        if (!form.api_key) { showAlert('Please enter API key first', 'danger'); return; }
                        setDetecting(true);
                        try {
                          const models = await detectProviderModels({ provider_type: form.provider_type, api_key: form.api_key, base_url: form.base_url });
                          setDetectedModels(Array.isArray(models) ? models : []);
                          // initialize selection state
                          const sel = {};
                          (models || []).forEach(m => { sel[m.id || m.name] = !!(form.available_models || '').split(',').map(s => s.trim()).includes(m.id || m.name); });
                          setModelSelection(sel);
                          if ((models || []).length > 0) showAlert('Detected models — pick defaults from the list');
                        } catch (e) {
                          showAlert(e.response?.data?.message || 'Model detection failed', 'danger');
                        } finally {
                          setDetecting(false);
                        }
                      }} title="Detect available models">
                        {detecting ? 'Detecting...' : 'Detect Models'}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Base URL</label>
                    <input type="text" className={`form-control ${inputBg} border-0 rounded-3`}
                      placeholder="https://openrouter.ai/api/v1"
                      value={form.base_url} onChange={e => setForm(f => ({ ...f, base_url: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Default Model</label>
                    <input type="text" className={`form-control ${inputBg} border-0 rounded-3`}
                      placeholder="openrouter/free"
                      value={form.default_model} onChange={e => setForm(f => ({ ...f, default_model: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Available Models</label>
                    <input type="text" className={`form-control ${inputBg} border-0 rounded-3`}
                      placeholder="openai/gpt-4o, anthropic/claude-3.5-sonnet"
                      value={form.available_models} onChange={e => setForm(f => ({ ...f, available_models: e.target.value }))} />
                    <small className="text-muted">Comma-separated model IDs</small>
                  </div>

                  {/* Detected models table */}
                  {detectedModels && detectedModels.length > 0 && (
                    <div className="col-12">
                      <h6 className="small fw-bold">Detected Models</h6>
                      <div className="table-responsive" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th style={{width:40}}></th>
                              <th>Model ID</th>
                              <th>Description</th>
                              <th style={{width:120}}>Type</th>
                              <th style={{width:80}}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detectedModels.map((m, i) => (
                              <tr key={m.id || m.name || i}>
                                <td>
                                  <input type="checkbox" checked={!!modelSelection[m.id || m.name]} onChange={e => {
                                    const key = m.id || m.name;
                                    setModelSelection(s => ({ ...s, [key]: e.target.checked }));
                                  }} />
                                </td>
                                <td style={{fontFamily:'monospace', fontSize:12}}>{m.id || m.name}</td>
                                <td className="text-muted small">{m.description || m.summary || '-'}</td>
                                <td><span className="badge bg-light text-dark border rounded-pill" style={{fontSize:11}}>{m.type || m.provider || '-'}</span></td>
                                <td>{m.is_free ? <span className="text-success small">Free</span> : <span className="text-muted small">Paid</span>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="d-flex gap-2 justify-content-end mt-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => {
                          // populate available_models from selection and set default if empty
                          const selected = Object.keys(modelSelection).filter(k => modelSelection[k]);
                          setForm(f => ({ ...f, available_models: selected.join(', ') }));
                          if (!form.default_model && selected.length > 0) setForm(f => ({ ...f, default_model: selected[0] }));
                          showAlert('Model list populated from detection');
                        }}>Use selected</button>
                        <button type="button" className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => { setDetectedModels([]); setModelSelection({}); }}>Clear</button>
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <div className="d-flex gap-4">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="isActiveSwitch"
                          checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                        <label className="form-check-label small fw-bold" htmlFor="isActiveSwitch">Active</label>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="isDefaultSwitch"
                          checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} />
                        <label className="form-check-label small fw-bold" htmlFor="isDefaultSwitch">Default</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 text-white border-0 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} disabled={saving}>
                    {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
