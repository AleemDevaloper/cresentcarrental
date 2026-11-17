import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faTruck, faBuilding, faIdCard, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { createVendor, updateVendor } from '../../../../api/fms';

const empty = {
  vendor_code: '', name: '', legal_name: '', vendor_type: '', tax_no: '',
  email: '', phone: '', mobile: '', whatsapp: '', website: '', country: '',
  city: '', credit_terms: '', credit_days: '', credit_limit: '', currency: '',
  gl_expense_account: '', opening_balance: '', status: 'active',
};

const ErpAddVendor = () => {
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

  useEffect(() => {
    const saved = localStorage.getItem('vendor_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('vendor_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.vendor_code) e.vendor_code = 'Vendor code is required.';
    if (!form.name) e.name = 'Vendor name is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'vendor') {
      const doc = editDocument;
      setForm(f => ({
        ...f,
        vendor_code: doc.vendor_code || doc.code || '',
        name: doc.name || '',
        legal_name: doc.legal_name || '',
        vendor_type: doc.vendor_type || '',
        tax_no: doc.tax_no || doc.taxId || '',
        email: doc.email || '',
        phone: doc.phone || '',
        mobile: doc.mobile || '',
        whatsapp: doc.whatsapp || '',
        website: doc.website || '',
        country: doc.country || '',
        city: doc.city || '',
        credit_terms: doc.credit_terms || doc.paymentTerms || '',
        credit_days: doc.credit_days || '',
        credit_limit: doc.credit_limit || '',
        currency: doc.currency || '',
        gl_expense_account: doc.gl_expense_account || '',
        opening_balance: doc.opening_balance || '',
        status: doc.status || 'active',
      }));
      setIsEditing(true);
      setEditingId(doc.id);
      setEditDocument(null);
    }
  }, [editDocument]);

  const handleSaveDraft = () => {
    localStorage.setItem('vendor_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Vendor draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.vendor_code) e.vendor_code = 'Vendor code is required.';
    if (!form.name) e.name = 'Vendor name is required.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateVendor(editingId, form);
        addNotification('Vendor updated successfully.', 'success');
      } else {
        await createVendor(form);
        addNotification('Vendor created successfully.', 'success');
      }
      localStorage.removeItem('vendor_draft');
      setActiveTab('erp_vendors');
      setTimeout(() => { try { window.dispatchEvent(new Event('erp:refresh')); } catch (e) { } }, 150);
    } catch (err) {
      addNotification(err.data?.message || err.message || 'Failed to create vendor.', 'error');
    } finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_vendors');
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
      <style>{`.v-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .v-pulse{animation:vp 2s ease-in-out 1;} @keyframes vp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.v-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / AP</span>
                {draftSaved && <span className="v-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{isEditing ? 'Edit Vendor' : 'New Vendor'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Register a supplier, contractor, or manufacturer as a central vendor master.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : isEditing ? 'Update Vendor' : 'Save Vendor'}
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

        <div className="row g-3 v-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faTruck} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Vendor Information</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Vendor Code *</label>
                  <input className="v-input" style={inputWithError('vendor_code')} placeholder="e.g. VEN-001" value={form.vendor_code} onChange={e => set('vendor_code', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Vendor Name *</label>
                  <input className="v-input" style={inputWithError('name')} placeholder="e.g. Acme Supplies" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Legal Name</label>
                  <input className="v-input" style={inputStyle} placeholder="Registered legal name" value={form.legal_name} onChange={e => set('legal_name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Vendor Type</label>
                  <select className="v-input" style={inputStyle} value={form.vendor_type} onChange={e => set('vendor_type', e.target.value)}>
                    <option value="">Select type</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Tax Number</label>
                  <input className="v-input" style={inputStyle} placeholder="TIN / VAT" value={form.tax_no} onChange={e => set('tax_no', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Email</label>
                  <input className="v-input" style={inputStyle} placeholder="vendor@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Phone</label>
                  <input className="v-input" style={inputStyle} placeholder="+1 555 0100" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Mobile</label>
                  <input className="v-input" style={inputStyle} placeholder="+1 555 0101" value={form.mobile} onChange={e => set('mobile', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>WhatsApp</label>
                  <input className="v-input" style={inputStyle} placeholder="+1 555 0102" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Website</label>
                  <input className="v-input" style={inputStyle} placeholder="https://" value={form.website} onChange={e => set('website', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Country</label>
                  <input className="v-input" style={inputStyle} placeholder="Country" value={form.country} onChange={e => set('country', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>City</label>
                  <input className="v-input" style={inputStyle} placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBuilding} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Credit & Billing</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Credit Terms</label>
                  <input className="v-input" style={inputStyle} placeholder="e.g. Net 30" value={form.credit_terms} onChange={e => set('credit_terms', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Credit Days</label>
                  <input type="number" className="v-input" style={inputStyle} placeholder="30" value={form.credit_days} onChange={e => set('credit_days', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Credit Limit</label>
                  <input type="number" className="v-input" style={inputStyle} placeholder="0.00" value={form.credit_limit} onChange={e => set('credit_limit', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Currency</label>
                  <input className="v-input" style={inputStyle} placeholder="USD" value={form.currency} onChange={e => set('currency', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>GL Expense Account</label>
                  <input className="v-input" style={inputStyle} placeholder="e.g. 6000-10" value={form.gl_expense_account} onChange={e => set('gl_expense_account', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Opening Balance</label>
                  <input type="number" className="v-input" style={inputStyle} placeholder="0.00" value={form.opening_balance} onChange={e => set('opening_balance', e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Status</label>
                  <select className="v-input" style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faIdCard} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Summary</h6>
              </div>
              <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${borderColor}` }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Code</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.vendor_code || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Name</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.name || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Status</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.status}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Vendor master data is shared across purchasing, AP, and inventory modules. Validate tax and banking details before activation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddVendor;
