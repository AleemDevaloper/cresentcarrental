import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faMoneyBillTransfer, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { createVendorPayment, listVendors } from '../../../../api/fms';

const empty = { payment_id: '', vendor_id: '', amount: '', payment_date: '', method: '', reference: '', status: 'pending', notes: '' };

const ErpCreatePaymentRun = () => {
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
  const [vendors, setVendors] = useState([]);
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
    listVendors({ per_page: 200 }).then(res => setVendors(res.data?.data || [])).catch(() => {});
    const saved = localStorage.getItem('paymentrun_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('paymentrun_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.payment_id) e.payment_id = 'Payment ID is required.';
    if (!form.vendor_id) e.vendor_id = 'Vendor is required.';
    if (!form.amount) e.amount = 'Amount is required.';
    if (!form.payment_date) e.payment_date = 'Payment date is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('paymentrun_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Payment run draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.payment_id) e.payment_id = 'Payment ID is required.';
    if (!form.vendor_id) e.vendor_id = 'Vendor is required.';
    if (!form.amount) e.amount = 'Amount is required.';
    if (!form.payment_date) e.payment_date = 'Payment date is required.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      await createVendorPayment({
        payment_id: form.payment_id,
        vendor_id: form.vendor_id,
        amount: form.amount,
        payment_date: form.payment_date,
        method: form.method,
        reference: form.reference,
        status: form.status,
        notes: form.notes,
      });
      addNotification('Vendor payment recorded.', 'success');
      localStorage.removeItem('paymentrun_draft');
      setActiveTab('erp_vendor_payments');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to record vendor payment.', 'error');
    } finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_vendor_payments');
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
      <style>{`.prr-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .prr-pulse{animation:prrp 2s ease-in-out 1;} @keyframes prrp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.prr-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / AP PAYMENT</span>
                {draftSaved && <span className="prr-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>New Vendor Payment Run</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Record a payment to a vendor against outstanding payables.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Record Payment'}
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

        <div className="row g-3 prr-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faMoneyBillTransfer} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Payment Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Payment ID *</label>
                  <input className="prr-input" style={inputWithError('payment_id')} placeholder="e.g. VP-0001" value={form.payment_id} onChange={e => set('payment_id', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Vendor *</label>
                  <select className="prr-input" style={inputWithError('vendor_id')} value={form.vendor_id} onChange={e => set('vendor_id', e.target.value)}>
                    <option value="">Select vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.vendor_code} — {v.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Amount *</label>
                  <input type="number" step="0.01" className="prr-input" style={inputWithError('amount')} placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Payment Date *</label>
                  <input type="date" className="prr-input" style={inputWithError('payment_date')} value={form.payment_date} onChange={e => set('payment_date', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Method</label>
                  <select className="prr-input" style={inputStyle} value={form.method} onChange={e => set('method', e.target.value)}>
                    <option value="">Select</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Reference</label>
                  <input className="prr-input" style={inputStyle} placeholder="Cheque / TXN ref" value={form.reference} onChange={e => set('reference', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Status</label>
                  <select className="prr-input" style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="processed">Processed</option>
                    <option value="reversed">Reversed</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Notes</label>
                  <textarea className="prr-input" rows={3} style={inputStyle} placeholder="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} />
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
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Amount</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>${(parseFloat(form.amount) || 0).toLocaleString()}</span>
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
                Payments reduce vendor payable balances and post to the cash/bank ledger.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreatePaymentRun;
