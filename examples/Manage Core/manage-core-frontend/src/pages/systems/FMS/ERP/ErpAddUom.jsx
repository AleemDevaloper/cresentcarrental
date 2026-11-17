import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faRuler, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { createUom } from '../../../../api/fms';

const empty = { name: '', symbol: '', category: 'quantity', is_base: false, conversion_multiplier: '1', base_unit: '' };

const CATEGORIES = ['weight', 'volume', 'length', 'quantity', 'time', 'area'];

const ErpAddUom = () => {
  const { theme, addNotification, setActiveTab } = useApp();
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
    const saved = localStorage.getItem('uom_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('uom_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('uom_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('UOM draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await createUom({
        ...form,
        is_base: !!form.is_base,
        conversion_multiplier: form.conversion_multiplier || 1,
      });
      addNotification('Unit of measure created successfully.', 'success');
      localStorage.removeItem('uom_draft');
      setActiveTab('erp_uoms');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to create unit of measure.', 'error');
    } finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_uoms');
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
      <style>{`.uo-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .uo-pulse{animation:uop 2s ease-in-out 1;} @keyframes uop{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.uo-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>INVENTORY / UOM</span>
                {draftSaved && <span className="uo-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>New Unit of Measure</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Define a unit (e.g. kg, pcs, liter) and its conversion to the base unit.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save UOM'}
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

        <div className="row g-3 uo-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faRuler} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Unit Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Name *</label>
                  <input className="uo-input" style={inputWithError('name')} placeholder="e.g. Kilogram" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Symbol</label>
                  <input className="uo-input" style={inputStyle} placeholder="e.g. kg" value={form.symbol} onChange={e => set('symbol', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Category</label>
                  <select className="uo-input" style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Base Unit</label>
                  <input className="uo-input" style={inputStyle} placeholder="e.g. kg (if derived)" value={form.base_unit} onChange={e => set('base_unit', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Conversion Multiplier</label>
                  <input type="number" step="0.0001" className="uo-input" style={inputStyle} placeholder="1" value={form.conversion_multiplier} onChange={e => set('conversion_multiplier', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Is Base Unit</label>
                  <div className="d-flex align-items-center gap-2" style={{ height: 36 }}>
                    <input type="checkbox" checked={form.is_base} onChange={e => set('is_base', e.target.checked)} /> <span style={{ fontSize: '0.8rem', color: textColor }}>Yes, this is the base unit</span>
                  </div>
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
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Name</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.name || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Symbol</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.symbol || '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                One base unit per category; derived units convert via the multiplier.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddUom;
