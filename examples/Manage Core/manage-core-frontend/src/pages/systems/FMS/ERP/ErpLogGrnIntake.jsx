import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faSync, faCheckCircle, faXmark, faKeyboard, faInfoCircle, faShieldHalved, faClipboardList, faTruck, faBoxesStacked, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

const ErpLogGrnIntake = () => {
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

  const [form, setForm] = useState({
    poRef: 'None',
    vendor: '',
    warehouse: 'Main WH-A',
    vehicle: '',
    receiver: '',
    qualityStatus: 'Pass',
    inspectionNotes: '',
    checklists: { physicalCheck: false, documentVerify: false, weightCheck: false },
    items: [{ product: '', expectedQty: 0, receivedQty: 0, rejectedQty: 0, batchNo: '', binLocation: '' }]
  });
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: mutedColor, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' };
  const cardStyle = { background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', padding: '1.25rem', marginBottom: '1rem' };

  useEffect(() => { const saved = localStorage.getItem('grn_draft'); if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} } }, []);
  useEffect(() => { const t = setTimeout(() => localStorage.setItem('grn_draft', JSON.stringify(form)), 1000); return () => clearTimeout(t); }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };
  const setChecklist = (k, v) => setForm(f => ({ ...f, checklists: { ...f.checklists, [k]: v } }));
  const updateItem = (idx, k, v) => setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [k]: v } : it) }));
  const addItemRow = () => setForm(f => ({ ...f, items: [...f.items, { product: '', expectedQty: 0, receivedQty: 0, rejectedQty: 0, batchNo: '', binLocation: '' }] }));
  const removeItemRow = (idx) => setForm(f => ({ ...f, items: f.items.length > 1 ? f.items.filter((_, i) => i !== idx) : f.items }));

  const validateLive = () => {
    const e = {};
    if (!form.warehouse) e.warehouse = 'Receiving warehouse is required.';
    if (!form.vehicle) e.vehicle = 'Vehicle / delivery details are required.';
    if (!form.receiver) e.receiver = 'Receiving signee inspector is required.';
    form.items.forEach((it, i) => {
      if (!it.product) e[`item_${i}_product`] = 'Product is required.';
      if (it.receivedQty === '' || Number(it.receivedQty) < 0) e[`item_${i}_receivedQty`] = 'Received qty must be >= 0.';
    });
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => { localStorage.setItem('grn_draft', JSON.stringify(form)); setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000); addNotification('GRN draft saved.', 'info'); };

  const validate = () => {
    const e = {};
    if (!form.warehouse) e.warehouse = 'Receiving warehouse is required.';
    if (!form.vehicle) e.vehicle = 'Vehicle / delivery details are required.';
    if (!form.receiver) e.receiver = 'Receiving signee inspector is required.';
    form.items.forEach((it, i) => {
      if (!it.product) e[`item_${i}_product`] = 'Product is required.';
      if (it.receivedQty === '' || Number(it.receivedQty) < 0) e[`item_${i}_receivedQty`] = 'Received qty must be >= 0.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      addNotification('GRN intake logged successfully.', 'success');
      localStorage.removeItem('grn_draft');
      setActiveTab('erp_goods_receipts');
    } catch (err) {
      addNotification('Failed to log GRN.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveTab('erp_goods_receipts');

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });

  const totalReceived = form.items.reduce((s, it) => s + (Number(it.receivedQty) || 0), 0);
  const totalRejected = form.items.reduce((s, it) => s + (Number(it.rejectedQty) || 0), 0);

  return (<div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
    <style>{`.grn-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .grn-pulse{animation:grnp 2s ease-in-out 1;} @keyframes grnp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.grn-responsive{grid-template-columns:1fr!important;}}`}</style>
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
        <div className="d-flex align-items-center gap-3">
          <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}><FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} /></button>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / ERP</span>
              {draftSaved && <span className="grn-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>Log GRN Intake</h1>
            <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>Record inbound goods receipt against a purchase order, capture quality inspection, and update stock bins.</p>
          </div>
        </div>
        <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
          <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={faSave} /> Save Draft</button>
          <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save & Lock GRN Intake'}</button>
          <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={faXmark} /> Cancel</button>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
        <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
        <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Save</span>
      </div>
      <div className="row g-3 grn-responsive">
        <div className="col-lg-8">
          <div style={cardStyle}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faTruck} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Receipt Details</h2>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={labelStyle}>Select Purchase Order Reference</label>
                <select value={form.poRef} onChange={e => set('poRef', e.target.value)} className="grn-input" style={inputStyle}>
                  <option value="None">None (Manual Receipt Log)</option>
                  <option value="PO-2026-001">PO-2026-001 - Oscorp Tech</option>
                  <option value="PO-2026-002">PO-2026-002 - Stark Ind.</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Supplier (Auto Populated)</label>
                <input type="text" value={form.vendor} onChange={e => set('vendor', e.target.value)} className="grn-input" style={inputStyle} placeholder="Supplier name" />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Receiving Warehouse Location <span style={{ color: dangerColor }}>*</span></label>
                <input type="text" value={form.warehouse} onChange={e => set('warehouse', e.target.value)} className="grn-input" style={inputWithError('warehouse')} placeholder="e.g. Main WH-A" />
                {(errors.warehouse || liveErrors.warehouse) && <div style={{ fontSize: '0.65rem', color: dangerColor, marginTop: '0.25rem' }}>{errors.warehouse || liveErrors.warehouse}</div>}
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Vehicle / Delivery Truck Details <span style={{ color: dangerColor }}>*</span></label>
                <input type="text" value={form.vehicle} onChange={e => set('vehicle', e.target.value)} className="grn-input" style={inputWithError('vehicle')} placeholder="e.g. Reg No / Driver" />
                {(errors.vehicle || liveErrors.vehicle) && <div style={{ fontSize: '0.65rem', color: dangerColor, marginTop: '0.25rem' }}>{errors.vehicle || liveErrors.vehicle}</div>}
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Receiving Signee Inspector <span style={{ color: dangerColor }}>*</span></label>
                <input type="text" value={form.receiver} onChange={e => set('receiver', e.target.value)} className="grn-input" style={inputWithError('receiver')} placeholder="Inspector name" />
                {(errors.receiver || liveErrors.receiver) && <div style={{ fontSize: '0.65rem', color: dangerColor, marginTop: '0.25rem' }}>{errors.receiver || liveErrors.receiver}</div>}
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faBoxesStacked} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Receipt Item Lines</h2>
              </div>
              <button onClick={addItemRow} className="btn btn-sm border-0 text-white" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.7rem', padding: '0.35rem 0.75rem' }}>+ Add Item</button>
            </div>
            {form.items.map((it, idx) => (
              <div key={idx} style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '0.9rem', marginBottom: '0.75rem', background: isDark ? '#1e2235' : '#f8fafc' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: mutedColor }}>Item #{idx + 1}</span>
                  <button onClick={() => removeItemRow(idx)} disabled={form.items.length === 1} className="btn btn-sm border-0" style={{ fontSize: '0.65rem', color: form.items.length === 1 ? mutedColor : dangerColor, opacity: form.items.length === 1 ? 0.4 : 1, padding: '0.15rem 0.4rem' }}><FontAwesomeIcon icon={faXmark} /> Remove</button>
                </div>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label style={labelStyle}>Product <span style={{ color: dangerColor }}>*</span></label>
                    <input type="text" value={it.product} onChange={e => updateItem(idx, 'product', e.target.value)} className="grn-input" style={inputWithError(`item_${idx}_product`)} placeholder="Product name / SKU" />
                    {(errors[`item_${idx}_product`] || liveErrors[`item_${idx}_product`]) && <div style={{ fontSize: '0.65rem', color: dangerColor, marginTop: '0.25rem' }}>{errors[`item_${idx}_product`] || liveErrors[`item_${idx}_product`]}</div>}
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>Expected Qty</label>
                    <input type="number" value={it.expectedQty} readOnly className="grn-input" style={{ ...inputStyle, background: isDark ? '#141826' : '#e2e8f0', cursor: 'not-allowed' }} />
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>Received Qty <span style={{ color: dangerColor }}>*</span></label>
                    <input type="number" value={it.receivedQty} onChange={e => updateItem(idx, 'receivedQty', e.target.value)} className="grn-input" style={inputWithError(`item_${idx}_receivedQty`)} />
                    {(errors[`item_${idx}_receivedQty`] || liveErrors[`item_${idx}_receivedQty`]) && <div style={{ fontSize: '0.65rem', color: dangerColor, marginTop: '0.25rem' }}>{errors[`item_${idx}_receivedQty`] || liveErrors[`item_${idx}_receivedQty`]}</div>}
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>Rejected Qty</label>
                    <input type="number" value={it.rejectedQty} onChange={e => updateItem(idx, 'rejectedQty', e.target.value)} className="grn-input" style={inputStyle} />
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}>Batch No</label>
                    <input type="text" value={it.batchNo} onChange={e => updateItem(idx, 'batchNo', e.target.value)} className="grn-input" style={inputStyle} placeholder="Batch / Lot" />
                  </div>
                  <div className="col-md-5">
                    <label style={labelStyle}>Bin Location</label>
                    <input type="text" value={it.binLocation} onChange={e => updateItem(idx, 'binLocation', e.target.value)} className="grn-input" style={inputStyle} placeholder="e.g. A-01-03" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Quality Inspection</h2>
            </div>
            <div style={{ border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '0.9rem', marginBottom: '1rem', background: isDark ? '#1e2235' : '#f8fafc' }}>
              <label style={{ ...labelStyle, marginBottom: '0.6rem' }}>Quality Inspection Checklist</label>
              <div className="d-flex flex-column gap-2">
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: textColor, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.checklists.physicalCheck} onChange={e => setChecklist('physicalCheck', e.target.checked)} /> Physical Check Completed
                </label>
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: textColor, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.checklists.documentVerify} onChange={e => setChecklist('documentVerify', e.target.checked)} /> Document Verification Done
                </label>
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: textColor, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.checklists.weightCheck} onChange={e => setChecklist('weightCheck', e.target.checked)} /> Weight Check Verified
                </label>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={labelStyle}>Overall Inspection Decision Status</label>
                <select value={form.qualityStatus} onChange={e => set('qualityStatus', e.target.value)} className="grn-input" style={inputStyle}>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="Conditional Acceptance">Conditional Acceptance</option>
                </select>
              </div>
              <div className="col-12">
                <label style={labelStyle}>Inspection Notes / Details</label>
                <textarea value={form.inspectionNotes} onChange={e => set('inspectionNotes', e.target.value)} className="grn-input" style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} placeholder="Record any defects, discrepancies, or remarks..." />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div style={cardStyle}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faClipboardList} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Receipt Overview</h2>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: '0.75rem', color: mutedColor }}>Item Count</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: textColor }}>{form.items.length}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: '0.75rem', color: mutedColor }}>Total Received</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: successColor }}>{totalReceived}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span style={{ fontSize: '0.75rem', color: mutedColor }}>Total Rejected</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: dangerColor }}>{totalRejected}</span>
            </div>
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faCheckDouble} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Quality Gate</h2>
            </div>
            <div style={{ background: form.qualityStatus === 'Pass' ? successBg : form.qualityStatus === 'Fail' ? dangerBg : warningBg, color: form.qualityStatus === 'Pass' ? successColor : form.qualityStatus === 'Fail' ? dangerColor : warningColor, borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
              {form.qualityStatus}
            </div>
            <p style={{ fontSize: '0.7rem', color: mutedColor, margin: 0, lineHeight: 1.5 }}>
              <FontAwesomeIcon icon={faInfoCircle} className="me-1" />Failed or conditional receipts route to supplier return / debit note workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>);
};

export default ErpLogGrnIntake;
