import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faSync, faCheckCircle, faXmark, faKeyboard,
  faInfoCircle, faShieldHalved, faFileContract, faPlus, faTrash,
  faUsers, faTags, faTruck
} from "@fortawesome/free-solid-svg-icons";

const emptyRfq = {
  refPr: 'None',
  department: 'Research & Development',
  buyer: 'Procurement Officer Steve',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  currency: 'USD',
  deliveryTerms: 'FOB Origin',
  paymentTerms: 'NET 30',
  note: '',
  vendors: { oscorp: true, stark: true, hammer: false },
  items: [{ product: '', description: '', qty: 1, unit: 'Units' }]
};

const ErpCreateRfq = () => {
  const { theme, addNotification, setActiveTab, editDocument, setEditDocument } = useApp();
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

  const [form, setForm] = useState(emptyRfq);
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
    boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    padding: '1.25rem', marginBottom: '1rem',
  };

  useEffect(() => {
    const saved = localStorage.getItem('rfq_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('rfq_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'rfq') {
      const doc = editDocument;
      setForm({
        refPr: doc.refPr || 'None',
        department: doc.department || 'Research & Development',
        buyer: doc.buyer || 'Procurement Officer Steve',
        dueDate: doc.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        currency: doc.currency || 'USD',
        deliveryTerms: doc.deliveryTerms || 'FOB Origin',
        paymentTerms: doc.paymentTerms || 'NET 30',
        note: doc.note || '',
        vendors: doc.vendors || { oscorp: true, stark: true, hammer: false },
        items: doc.items && doc.items.length > 0 ? doc.items.map(i => ({
          product: i.product || '',
          description: i.description || '',
          qty: parseFloat(i.qty) || 1,
          unit: i.unit || 'Units',
        })) : [{ product: '', description: '', qty: 1, unit: 'Units' }]
      });
      setIsEditing(true);
      setEditingId(doc.id);
      setEditDocument(null);
    }
  }, [editDocument]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.department) e.department = 'Department is required.';
    if (!form.buyer) e.buyer = 'Buyer officer is required.';
    if (!form.dueDate) e.dueDate = 'Bidding due date is required.';
    const itemErr = {};
    form.items.forEach((it, i) => {
      if (!it.product) itemErr[i] = { ...(itemErr[i] || {}), product: 'Product is required.' };
      if (!(Number(it.qty) > 0)) itemErr[i] = { ...(itemErr[i] || {}), qty: 'Qty must be greater than 0.' };
    });
    if (Object.keys(itemErr).length) e.items = itemErr;
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('rfq_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('RFQ draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.department) e.department = 'Department is required.';
    if (!form.buyer) e.buyer = 'Buyer officer is required.';
    if (!form.dueDate) e.dueDate = 'Bidding due date is required.';
    const itemErr = {};
    form.items.forEach((it, i) => {
      if (!it.product) itemErr[i] = { ...(itemErr[i] || {}), product: 'Product is required.' };
      if (!(Number(it.qty) > 0)) itemErr[i] = { ...(itemErr[i] || {}), qty: 'Qty must be greater than 0.' };
    });
    if (Object.keys(itemErr).length) e.items = itemErr;
    setErrors(e); return Object.keys(e).length === 0;
  };

  const updateItem = (idx, k, v) => {
    setForm(f => {
      const items = f.items.map((it, i) => i === idx ? { ...it, [k]: v } : it);
      return { ...f, items };
    });
    if (errors.items && errors.items[idx]) {
      setErrors(e => {
        const items = { ...e.items };
        if (items[idx]) { delete items[idx][k]; if (!Object.keys(items[idx]).length) delete items[idx]; }
        return { ...e, items };
      });
    }
  };
  const addItemRow = () => setForm(f => ({ ...f, items: [...f.items, { product: '', description: '', qty: 1, unit: 'Units' }] }));
  const removeItemRow = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      if (isEditing) {
        addNotification('RFQ updated successfully.', 'success');
      } else {
        addNotification('RFQ created successfully.', 'success');
      }
      localStorage.removeItem('rfq_draft');
      setIsEditing(false);
      setEditingId(null);
      setActiveTab('erp_rfqs');
    }
    catch (err) { addNotification('Failed to save RFQ.', 'error'); }
    finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_rfqs');
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });
  const itemInputWithError = (idx, k) => {
    const hasErr = errors.items && errors.items[idx] && errors.items[idx][k] || liveErrors.items && liveErrors.items[idx] && liveErrors.items[idx][k];
    return { ...inputStyle, border: hasErr ? `1px solid ${dangerColor}` : inputStyle.border };
  };

  const selectedVendorCount = Object.values(form.vendors).filter(Boolean).length;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.rfq-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .rfq-pulse{animation:rfqp 2s ease-in-out 1;} @keyframes rfqp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.rfq-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / ERP</span>
                {draftSaved && <span className="rfq-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{isEditing ? 'Edit Request for Quotation' : 'New Request for Quotation'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>Invite preferred suppliers to bid on required goods/services and compare quotations before award.</p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : isEditing ? 'Update RFQ' : 'Save & Transmit RFQ'}
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
        <div className="row g-3 rfq-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faFileContract} style={{ color: '#6366f1', fontSize: '0.95rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>RFQ Details</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Approved PR Reference</label>
                  <select className="rfq-input" style={inputStyle} value={form.refPr} onChange={(e) => set('refPr', e.target.value)}>
                    <option value="None">None (Manual RFQ Creation)</option>
                    <option value="PR-2026-001">PR-2026-001 - Research &amp; Development</option>
                    <option value="PR-2026-002">PR-2026-002 - HQ Administration</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select className="rfq-input" style={inputStyle} value={form.currency} onChange={(e) => set('currency', e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Department</label>
                  <input className="rfq-input" style={inputWithError('department')} value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Department" />
                  {errors.department && <div style={{ color: dangerColor, fontSize: '0.68rem', marginTop: '0.3rem' }}>{errors.department}</div>}
                  {!errors.department && liveErrors.department && <div style={{ color: dangerColor, fontSize: '0.68rem', marginTop: '0.3rem' }}>{liveErrors.department}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Buyer Officer</label>
                  <input className="rfq-input" style={inputWithError('buyer')} value={form.buyer} onChange={(e) => set('buyer', e.target.value)} placeholder="Buyer officer" />
                  {errors.buyer && <div style={{ color: dangerColor, fontSize: '0.68rem', marginTop: '0.3rem' }}>{errors.buyer}</div>}
                  {!errors.buyer && liveErrors.buyer && <div style={{ color: dangerColor, fontSize: '0.68rem', marginTop: '0.3rem' }}>{liveErrors.buyer}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Bidding Due Date</label>
                  <input type="date" className="rfq-input" style={inputWithError('dueDate')} value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
                  {errors.dueDate && <div style={{ color: dangerColor, fontSize: '0.68rem', marginTop: '0.3rem' }}>{errors.dueDate}</div>}
                  {!errors.dueDate && liveErrors.dueDate && <div style={{ color: dangerColor, fontSize: '0.68rem', marginTop: '0.3rem' }}>{liveErrors.dueDate}</div>}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: `1px solid ${borderColor}`, margin: '1.25rem 0 1rem' }} />

              <div className="d-flex align-items-center justify-content-between mb-2">
                <label style={{ ...labelStyle, marginBottom: 0 }}>Required Products List</label>
                <button onClick={addItemRow} className="btn btn-sm d-flex align-items-center gap-1 border-0" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#eef2ff', color: '#6366f1', fontSize: '0.72rem', padding: '0.35rem 0.6rem' }}>
                  <FontAwesomeIcon icon={faPlus} /> Add Item
                </button>
              </div>

              {form.items.map((it, idx) => (
                <div key={idx} style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '0.85rem', marginBottom: '0.75rem', background: isDark ? '#1e2235' : '#f8fafc' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: mutedColor }}>Item #{idx + 1}</span>
                    <button onClick={() => removeItemRow(idx)} disabled={form.items.length === 1} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '6px', background: form.items.length === 1 ? (isDark ? '#2d3248' : '#e2e8f0') : dangerBg, color: form.items.length === 1 ? mutedColor : dangerColor, cursor: form.items.length === 1 ? 'not-allowed' : 'pointer' }}>
                      <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.7rem' }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 0.7fr 0.8fr', gap: '0.6rem' }}>
                    <div>
                      <label style={labelStyle}>Product</label>
                      <input className="rfq-input" style={itemInputWithError(idx, 'product')} value={it.product} onChange={(e) => updateItem(idx, 'product', e.target.value)} placeholder="Product name" />
                      {((errors.items && errors.items[idx] && errors.items[idx].product) || (liveErrors.items && liveErrors.items[idx] && liveErrors.items[idx].product)) &&
                        <div style={{ color: dangerColor, fontSize: '0.66rem', marginTop: '0.25rem' }}>{(errors.items && errors.items[idx] && errors.items[idx].product) || (liveErrors.items && liveErrors.items[idx] && liveErrors.items[idx].product)}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <input className="rfq-input" style={inputStyle} value={it.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="Description" />
                    </div>
                    <div>
                      <label style={labelStyle}>Qty</label>
                      <input type="number" min="1" className="rfq-input" style={itemInputWithError(idx, 'qty')} value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
                      {((errors.items && errors.items[idx] && errors.items[idx].qty) || (liveErrors.items && liveErrors.items[idx] && liveErrors.items[idx].qty)) &&
                        <div style={{ color: dangerColor, fontSize: '0.66rem', marginTop: '0.25rem' }}>{(errors.items && errors.items[idx] && errors.items[idx].qty) || (liveErrors.items && liveErrors.items[idx] && liveErrors.items[idx].qty)}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Unit</label>
                      <input className="rfq-input" style={inputStyle} value={it.unit} onChange={(e) => updateItem(idx, 'unit', e.target.value)} placeholder="Units" />
                    </div>
                  </div>
                </div>
              ))}

              <hr style={{ border: 'none', borderTop: `1px solid ${borderColor}`, margin: '1.25rem 0 1rem' }} />

              <label style={labelStyle}>Select Vendor Suppliers to Invite</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', color: textColor, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.vendors.oscorp} onChange={(e) => set('vendors', { ...form.vendors, oscorp: e.target.checked })} /> Oscorp Tech <span style={{ color: successColor, fontSize: '0.65rem', fontWeight: 600 }}>[Preferred]</span>
                </label>
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', color: textColor, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.vendors.stark} onChange={(e) => set('vendors', { ...form.vendors, stark: e.target.checked })} /> Stark Ind. <span style={{ color: successColor, fontSize: '0.65rem', fontWeight: 600 }}>[Preferred]</span>
                </label>
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', color: textColor, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.vendors.hammer} onChange={(e) => set('vendors', { ...form.vendors, hammer: e.target.checked })} /> Hammer Industries
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Delivery Terms</label>
                  <select className="rfq-input" style={inputStyle} value={form.deliveryTerms} onChange={(e) => set('deliveryTerms', e.target.value)}>
                    <option value="FOB Origin">FOB Origin</option>
                    <option value="DDP Destination">DDP Destination</option>
                    <option value="CIF Port">CIF Port</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Payment Terms</label>
                  <select className="rfq-input" style={inputStyle} value={form.paymentTerms} onChange={(e) => set('paymentTerms', e.target.value)}>
                    <option value="NET 15">NET 15</option>
                    <option value="NET 30">NET 30</option>
                    <option value="NET 45">NET 45</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>Negotiation Notes / Clarification Requests</label>
                <textarea className="rfq-input" rows={3} style={inputStyle} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Add any negotiation notes or clarification requests..." />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faFileContract} style={{ color: '#6366f1', fontSize: '0.95rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>RFQ Overview</h2>
              </div>
              <div style={{ fontSize: '0.78rem', color: mutedColor }}>
                <div className="d-flex justify-content-between py-1"><span>Items</span><span style={{ color: textColor, fontWeight: 600 }}>{form.items.length}</span></div>
                <div className="d-flex justify-content-between py-1"><span>Currency</span><span style={{ color: textColor, fontWeight: 600 }}>{form.currency}</span></div>
                <div className="d-flex justify-content-between py-1"><span>Due Date</span><span style={{ color: textColor, fontWeight: 600 }}>{form.dueDate}</span></div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faUsers} style={{ color: '#6366f1', fontSize: '0.95rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Vendor Outreach</h2>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: textColor }}>{selectedVendorCount}<span style={{ fontSize: '0.8rem', color: mutedColor, fontWeight: 500 }}> / 3 selected</span></div>
              <p style={{ fontSize: '0.74rem', color: mutedColor, margin: '0.5rem 0 0 0' }}>Selected suppliers receive the RFQ via portal and email invitation.</p>
            </div>

            <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ color: warningColor, fontSize: '1.1rem' }} />
              <p style={{ fontSize: '0.72rem', color: mutedColor, margin: 0 }}>RFQ data is encrypted and shared only with the invited vendors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ErpCreateRfq;
