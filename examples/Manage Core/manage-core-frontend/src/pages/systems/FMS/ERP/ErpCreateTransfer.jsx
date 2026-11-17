import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faArrowRightArrowLeft, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

const empty = { transferType: 'Bank to Bank', transferDate: '', transferAmount: '', sourceAccount: '', destinationAccount: '', priority: 'Normal', referenceNum: '', narration: '' };
const STORAGE_KEY = 'transfer_draft';

const ErpCreateTransfer = () => {
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
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch { /* ignore */ } }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const errs = {};
    if (!form.transferAmount) errs.transferAmount = 'Amount is required.';
    if (!form.sourceAccount) errs.sourceAccount = 'Source account is required.';
    if (!form.destinationAccount) errs.destinationAccount = 'Destination account is required.';
    setLiveErrors(errs);
    return Object.keys(errs).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Transfer draft saved.', 'info');
  };
  const validate = () => {
    const errs = {};
    if (!form.transferAmount) errs.transferAmount = 'Amount is required.';
    if (!form.sourceAccount) errs.sourceAccount = 'Source account is required.';
    if (!form.destinationAccount) errs.destinationAccount = 'Destination account is required.';
    setErrors(errs); return Object.keys(errs).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try { await new Promise(r => setTimeout(r, 600)); addNotification('Internal fund transfer created.', 'success'); localStorage.removeItem(STORAGE_KEY); setActiveTab('erp_bank_transfers'); }
    catch { addNotification('Failed to create transfer.', 'error'); }
    finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_bank_transfers');
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
      <style>{`.ct-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .ct-pulse{animation:ctp 2s ease-in-out 1;} @keyframes ctp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.ct-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>BANKING / TRANSFER</span>
                {draftSaved && <span className="ct-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>Create Internal Fund Transfer</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Move funds between banks, cash, and branches with audit tracking.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Transfer'}
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

        <div className="row g-3 ct-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Transfer Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label style={labelStyle}>Transfer Type</label>
                  <select className="ct-input" style={inputStyle} value={form.transferType} onChange={e => set('transferType', e.target.value)}>
                    <option value="Bank to Bank">Bank to Bank</option>
                    <option value="Cash to Bank">Cash to Bank</option>
                    <option value="Bank to Cash">Bank to Cash</option>
                    <option value="Inter-Branch Transfer">Inter-Branch Transfer</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Transfer Date *</label>
                  <input type="date" className="ct-input" style={inputWithError('transferDate')} value={form.transferDate} onChange={e => set('transferDate', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Transfer Amount ($) *</label>
                  <input type="number" className="ct-input" style={inputWithError('transferAmount')} value={form.transferAmount} onChange={e => set('transferAmount', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Source Account *</label>
                  <input className="ct-input" style={inputWithError('sourceAccount')} placeholder="Chase Treasury Operating Account (US89CHAS1029384756)" value={form.sourceAccount} onChange={e => set('sourceAccount', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Destination Account *</label>
                  <input className="ct-input" style={inputWithError('destinationAccount')} placeholder="Barclays London Operational Account (GB44BARC2091823746)" value={form.destinationAccount} onChange={e => set('destinationAccount', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Priority</label>
                  <select className="ct-input" style={inputStyle} value={form.priority} onChange={e => set('priority', e.target.value)}>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label style={labelStyle}>Reference Number</label>
                  <input className="ct-input" style={inputStyle} placeholder="Cheque or transaction reference" value={form.referenceNum} onChange={e => set('referenceNum', e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Narration / Purpose</label>
                  <textarea className="ct-input" style={{ ...inputStyle, minHeight: 70 }} value={form.narration} onChange={e => set('narration', e.target.value)} />
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
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Type</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.transferType}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Amount</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.transferAmount ? '$' + form.transferAmount : '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Transfers are logged for treasury and reconciliation audit trails.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateTransfer;
