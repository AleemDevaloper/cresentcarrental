import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faLocationDot, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { createAssetLocation, updateAssetLocation } from '../../../../api/fms';

const empty = {
  code: '', name: '', location_type: '', max_capacity: '', address: '', description: '',
};

const ErpAddAssetLocation = () => {
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
  const [editingId, setEditingId] = useState(null);

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



  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.code) e.code = 'Code is required.';
    if (!form.name) e.name = 'Name is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'asset_location') {
      const doc = editDocument;
      setForm(f => ({
        ...f,
        code: doc.code || '',
        name: doc.name || '',
        location_type: doc.location_type || '',
        max_capacity: doc.max_capacity || '',
        address: doc.address || '',
        description: doc.description || '',
      }));
      setIsEditing(true);
      setEditingId(doc.id);
      setEditDocument(null);
    }
  }, [editDocument]);

  const handleSaveDraft = () => {
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Asset location draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.code) e.code = 'Code is required.';
    if (!form.name) e.name = 'Name is required.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateAssetLocation(editingId, form);
        addNotification('Asset location updated successfully.', 'success');
      } else {
        await createAssetLocation(form);
        addNotification('Asset location created successfully.', 'success');
      }
      setActiveTab('erp_asset_locations');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to create asset location.', 'error');
    } finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_asset_locations');
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.al-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .al-pulse{animation:alp 2s ease-in-out 1;} @keyframes alp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.al-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>FIXED ASSETS / LOCATION</span>
                {draftSaved && <span className="al-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{isEditing ? 'Edit Asset Location' : 'New Asset Location'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Register a site, floor, or room where fixed assets are physically stored.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : isEditing ? 'Update Location' : 'Save Location'}
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

        <div className="row g-3 al-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faLocationDot} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Location Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Code *</label>
                  <input className="al-input" style={inputWithError('code')} placeholder="e.g. LOC-001" value={form.code} onChange={e => set('code', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Name *</label>
                  <input className="al-input" style={inputWithError('name')} placeholder="e.g. HQ Server Room" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Location Type</label>
                  <select className="al-input" style={inputStyle} value={form.location_type} onChange={e => set('location_type', e.target.value)}>
                    <option value="">Select</option>
                    <option value="Site">Site</option>
                    <option value="Building">Building</option>
                    <option value="Floor">Floor</option>
                    <option value="Room">Room</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Max Capacity</label>
                  <input type="number" className="al-input" style={inputStyle} placeholder="0" value={form.max_capacity} onChange={e => set('max_capacity', e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Address</label>
                  <textarea className="al-input" rows={2} style={inputStyle} placeholder="Street, city, country" value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Description</label>
                  <textarea className="al-input" rows={3} style={inputStyle} placeholder="Notes" value={form.description} onChange={e => set('description', e.target.value)} />
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
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Name</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.name || '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Accurate locations enable physical audits and depreciation rollups by site.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddAssetLocation;
