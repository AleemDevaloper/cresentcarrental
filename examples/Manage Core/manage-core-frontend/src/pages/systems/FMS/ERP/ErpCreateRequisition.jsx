import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faSync, faCheckCircle, faXmark, faKeyboard,
  faInfoCircle, faShieldHalved, faList, faClipboardList, faBuilding,
  faMapMarkerAlt, faDollarSign, faPlus, faTrash
} from "@fortawesome/free-solid-svg-icons";

const emptyReq = {
  department: 'Research & Development',
  costCenter: 'CC-RND-101',
  project: 'Project Alpha Tech',
  requiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  priority: 'High',
  vendorSuggestion: 'Oscorp Tech',
  itemCategory: 'Raw Materials',
  warehouse: 'Main WH-A',
  currency: 'USD',
  taxProfile: 'VAT 5%',
  deliveryLocation: 'New York R&D Facility',
  budgetLimit: 20000,
  requestedBy: 'Bruce Banner',
  note: '',
  items: [{ product: '', description: '', qty: 1, unit: 'Units', estCost: 100 }],
};

const ErpCreateRequisition = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#242838' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1e2235' : '#ffffff';
  const inputBorder = isDark ? '#2d3248' : '#d1d5db';
  const successBg = isDark ? '#064e3b' : '#dcfce7';
  const successColor = isDark ? '#4ade80' : '#16a34a';
  const warningBg = isDark ? '#1e293b' : '#fef3c7';
  const warningColor = isDark ? '#fbbf24' : '#d97706';
  const dangerBg = isDark ? '#7f1d1d' : '#fee2e2';
  const dangerColor = isDark ? '#f87171' : '#dc2626';

  const [form, setForm] = useState(emptyReq);
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
    boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    padding: '1.25rem', marginBottom: '1rem',
  };

  useEffect(() => {
    const saved = localStorage.getItem('req_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('req_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const updateItem = (idx, key, val) => {
    setForm(f => {
      const items = f.items.map((it, i) => i === idx ? { ...it, [key]: val } : it);
      return { ...f, items };
    });
  };
  const addItemRow = () => {
    setForm(f => ({ ...f, items: [...f.items, { product: '', description: '', qty: 1, unit: 'Units', estCost: 100 }] }));
  };
  const removeItemRow = (idx) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const validateLive = () => {
    const e = {};
    if (!form.requiredDate) e.requiredDate = 'Required date is required.';
    if (!form.deliveryLocation) e.deliveryLocation = 'Delivery location is required.';
    if (!form.requestedBy) e.requestedBy = 'Requested by is required.';
    const invalidItems = form.items.some(it => !it.product || !(parseFloat(it.qty) > 0) || !(parseFloat(it.estCost) >= 0));
    if (invalidItems) e.items = 'Each item requires a product, quantity > 0, and estimated cost.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('req_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Purchase requisition draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.requiredDate) e.requiredDate = 'Required date is required.';
    if (!form.deliveryLocation) e.deliveryLocation = 'Delivery location is required.';
    if (!form.requestedBy) e.requestedBy = 'Requested by is required.';
    const invalidItems = form.items.some(it => !it.product || !(parseFloat(it.qty) > 0) || !(parseFloat(it.estCost) >= 0));
    if (invalidItems) e.items = 'Each item requires a product, quantity > 0, and estimated cost.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      addNotification('Purchase requisition created successfully.', 'success');
      localStorage.removeItem('req_draft');
      setActiveTab('erp_purchase_requisitions');
    }
    catch (err) { addNotification('Failed to save purchase requisition.', 'error'); }
    finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_purchase_requisitions');
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });

  const totalCost = form.items.reduce((sum, it) => sum + (parseFloat(it.estCost) || 0) * (parseFloat(it.qty) || 0), 0);

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.req-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .req-pulse{animation:reqp 2s ease-in-out 1;} @keyframes reqp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.req-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / ERP</span>
                {draftSaved && <span className="req-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>New Purchase Requisition</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Request internal departmental purchase of goods/services with full line-item justification and budget control.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Submit Requisition'}
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

        <div className="row g-3 req-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBuilding} style={{ color: mutedColor }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Requisition Details</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Department</label>
                  <select className="req-input" style={inputStyle} value={form.department} onChange={(e) => set('department', e.target.value)}>
                    {['Research & Development', 'HQ Administration', 'Facility Operations', 'Procurement & Logistics'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Cost Center</label>
                  <select className="req-input" style={inputStyle} value={form.costCenter} onChange={(e) => set('costCenter', e.target.value)}>
                    {['CC-RND-101', 'CC-HQ-202', 'CC-OPS-303'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Project / Initiative</label>
                  <input className="req-input" style={inputStyle} value={form.project} onChange={(e) => set('project', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Required Date</label>
                  <input type="date" className="req-input" style={{ ...inputWithError('requiredDate') }} value={form.requiredDate} onChange={(e) => set('requiredDate', e.target.value)} />
                  {errors.requiredDate && <div style={{ fontSize: '0.7rem', color: dangerColor, marginTop: '0.25rem' }}>{errors.requiredDate}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Priority</label>
                  <select className="req-input" style={inputStyle} value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                    {['Low', 'Medium', 'High'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Suggested Vendor</label>
                  <input className="req-input" style={inputStyle} value={form.vendorSuggestion} onChange={(e) => set('vendorSuggestion', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Item Category</label>
                  <input className="req-input" style={inputStyle} value={form.itemCategory} onChange={(e) => set('itemCategory', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Warehouse</label>
                  <input className="req-input" style={inputStyle} value={form.warehouse} onChange={(e) => set('warehouse', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Currency</label>
                  <select className="req-input" style={inputStyle} value={form.currency} onChange={(e) => set('currency', e.target.value)}>
                    {['USD', 'EUR', 'GBP'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Tax Profile</label>
                  <input className="req-input" style={inputStyle} value={form.taxProfile} onChange={(e) => set('taxProfile', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Delivery Location Address</label>
                  <input className="req-input" style={{ ...inputWithError('deliveryLocation') }} value={form.deliveryLocation} onChange={(e) => set('deliveryLocation', e.target.value)} />
                  {errors.deliveryLocation && <div style={{ fontSize: '0.7rem', color: dangerColor, marginTop: '0.25rem' }}>{errors.deliveryLocation}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Cost Center Budget Limit ($)</label>
                  <input type="number" className="req-input" style={inputStyle} value={form.budgetLimit} onChange={(e) => set('budgetLimit', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faList} style={{ color: mutedColor }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Item Details</span>
                </div>
                <button onClick={addItemRow} className="btn btn-sm d-flex align-items-center gap-1 border-0 text-white" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faPlus} /> Add Item Row
                </button>
              </div>
              {errors.items && <div style={{ fontSize: '0.72rem', color: dangerColor, marginBottom: '0.75rem' }}>{errors.items}</div>}
              {form.items.map((it, idx) => (
                <div key={idx} className="row g-2 align-items-end mb-2" style={{ border: errors.items ? `1px solid ${dangerColor}` : `1px solid ${borderColor}`, borderRadius: '10px', padding: '0.75rem', background: inputBg }}>
                  <div className="col-md-3">
                    <label style={labelStyle}>Product</label>
                    <input className="req-input" style={inputStyle} value={it.product} onChange={(e) => updateItem(idx, 'product', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>Description</label>
                    <input className="req-input" style={inputStyle} value={it.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label style={labelStyle}>Qty</label>
                    <input type="number" className="req-input" style={inputStyle} value={it.qty} onChange={(e) => updateItem(idx, 'qty', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-md-2">
                    <label style={labelStyle}>Unit</label>
                    <input className="req-input" style={inputStyle} value={it.unit} onChange={(e) => updateItem(idx, 'unit', e.target.value)} />
                  </div>
                  <div className="col-md-1">
                    <label style={labelStyle}>Est Cost</label>
                    <input type="number" className="req-input" style={inputStyle} value={it.estCost} onChange={(e) => updateItem(idx, 'estCost', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-md-1 d-flex justify-content-end">
                    <button onClick={() => removeItemRow(idx)} disabled={form.items.length === 1} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: '8px', background: isDark ? '#2d3248' : '#fee2e2', color: dangerColor, opacity: form.items.length === 1 ? 0.4 : 1 }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: mutedColor }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Request & Notes</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Requested By</label>
                  <input className="req-input" style={{ ...inputWithError('requestedBy') }} value={form.requestedBy} onChange={(e) => set('requestedBy', e.target.value)} />
                  {errors.requestedBy && <div style={{ fontSize: '0.7rem', color: dangerColor, marginTop: '0.25rem' }}>{errors.requestedBy}</div>}
                </div>
                <div className="col-12">
                  <label style={labelStyle}>Internal Requisition Notes</label>
                  <textarea className="req-input" rows={3} style={inputStyle} value={form.note} onChange={(e) => set('note', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faClipboardList} style={{ color: mutedColor }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Requisition Summary</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: mutedColor }}>Total Estimated Cost</span>
                <span style={{ fontWeight: 700, color: textColor }}>{form.currency} {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: mutedColor }}>Item Count</span>
                <span style={{ fontWeight: 700, color: textColor }}>{form.items.length}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: mutedColor }}>Currency</span>
                <span style={{ fontWeight: 700, color: textColor }}>{form.currency}</span>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: mutedColor }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Budget Compliance</span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: mutedColor }}>Budget Limit</span>
                <span style={{ fontWeight: 700, color: textColor }}>{form.currency} {(parseFloat(form.budgetLimit) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: mutedColor, margin: 0, lineHeight: 1.5 }}>
                Requisition total must remain within the cost center budget limit before approval routing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateRequisition;
