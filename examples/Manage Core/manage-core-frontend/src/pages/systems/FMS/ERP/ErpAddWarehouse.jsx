import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faWarehouse, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { createWarehouse } from '../../../../api/enterprise';

const empty = { code: '', name: '', type: '', city: '', manager: '', email: '', phone: '', max_capacity: '', current_capacity: '', status: 'Active' };

const ErpAddWarehouse = () => {
  const { theme, addNotification, setActiveTab, editDocument, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#242838' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1e2235' : '#ffffff';
  const inputBorder = isDark ? '#2d3248' : '#d1d5db';
  const dangerColor = isDark ? '#f87171' : '#dc2626';

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem',
    background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px',
    color: textColor, outline: 'none', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 600,
    color: mutedColor, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em',
  };
  const cardStyle = {
    background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px',
    boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
    padding: '1.25rem', marginBottom: '1rem',
  };

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'warehouse') {
      const doc = editDocument;
      setForm(f => ({
        ...f,
        code: doc.code || '',
        name: doc.name || '',
        type: doc.type || '',
        city: doc.city || doc.location || '',
        manager: doc.manager || doc.manager_id || '',
        email: doc.email || '',
        phone: doc.phone || '',
        max_capacity: doc.maxCapacity || doc.max_capacity || '',
        current_capacity: doc.currentCapacity || doc.current_capacity || '',
        status: doc.status || 'Active',
      }));
      setIsEditing(true);
      setEditDocument(null);
    }
  }, [editDocument]);

  useEffect(() => {
    if (isEditing) return;
    const saved = localStorage.getItem('warehouse_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch { /* ignore corrupt draft */ } }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) return;
    const t = setTimeout(() => localStorage.setItem('warehouse_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form, isEditing]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required.';
    if (!form.code) e.code = 'Warehouse code is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('warehouse_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Warehouse draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required.';
    if (!form.code) e.code = 'Warehouse code is required.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await createWarehouse({
        code: form.code,
        name: form.name,
        type: form.type,
        city: form.city,
        manager: form.manager,
        email: form.email,
        phone: form.phone,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : null,
        current_capacity: form.current_capacity ? Number(form.current_capacity) : null,
        status: form.status,
      });
      addNotification(isEditing ? 'Warehouse updated successfully.' : 'Warehouse created successfully.', 'success');
      localStorage.removeItem('warehouse_draft');
      setActiveTab('erp_warehouses');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to save warehouse.', 'error');
    } finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_warehouses');
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [form, isEditing]);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.wh-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .wh-pulse{animation:whp 2s ease-in-out 1;} @keyframes whp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.wh-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>INVENTORY / WAREHOUSE</span>
                {draftSaved && <span className="wh-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{isEditing ? 'Edit Warehouse' : 'New Warehouse'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Register a storage facility, its location head, and capacity details.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            {!isEditing && (
              <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                <FontAwesomeIcon icon={faSave} /> Save Draft
              </button>
            )}
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : isEditing ? 'Update Warehouse' : 'Save Warehouse'}
            </button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Save</span>
        </div>

        <div className="row g-3 wh-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faWarehouse} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Warehouse Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Warehouse Code *</label>
                  <input className="wh-input" style={inputWithError('code')} placeholder="e.g. WH-CHI-01" value={form.code} onChange={e => set('code', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Warehouse Name *</label>
                  <input className="wh-input" style={inputWithError('name')} placeholder="e.g. Central DC" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Type</label>
                  <select className="wh-input" style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="">Select type...</option>
                    <option>Main Warehouse</option>
                    <option>Distribution Center</option>
                    <option>Transit Warehouse</option>
                    <option>Cold Storage</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>City</label>
                  <input className="wh-input" style={inputStyle} placeholder="City, country" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Location Head</label>
                  <input className="wh-input" style={inputStyle} placeholder="Full name of manager" value={form.manager} onChange={e => set('manager', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Email</label>
                  <input className="wh-input" style={inputStyle} placeholder="manager@corp.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Phone</label>
                  <input className="wh-input" style={inputStyle} placeholder="+1 (312) 555-0101" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label style={labelStyle}>Max Capacity (PLT)</label>
                  <input className="wh-input" type="number" style={inputStyle} placeholder="10000" value={form.max_capacity} onChange={e => set('max_capacity', e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label style={labelStyle}>Current Capacity (PLT)</label>
                  <input className="wh-input" type="number" style={inputStyle} placeholder="7500" value={form.current_capacity} onChange={e => set('current_capacity', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Status</label>
                  <select className="wh-input" style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faHashtag} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Summary</h6>
              </div>
              <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${borderColor}` }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Code</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.code || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Name</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.name || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Type</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.type || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>City</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.city || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Location Head</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.manager || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Capacity</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.current_capacity || '0'} / {form.max_capacity || '0'} PLT</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Status</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.status || '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Warehouses aggregate stock movements and valuation rollups.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddWarehouse;
