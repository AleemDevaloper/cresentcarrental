import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCoins, faHashtag, faSync,
  faCheckCircle, faXmark, faKeyboard, faInfoCircle, faShieldHalved,
  faBuildingColumns, faUsers, faCalculator
} from "@fortawesome/free-solid-svg-icons";

const emptyBal = { type: 'GL', name: '', code: '', debit: '', credit: '', terms: '30 Days' };

const ErpAddBalance = () => {
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

  const [form, setForm] = useState(emptyBal);
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
    const saved = localStorage.getItem('bal_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('bal_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.name) e.name = form.type === 'GL' ? 'Account name is required.' : 'Customer name is required.';
    if (form.type === 'GL') {
      if (!form.debit && !form.credit) e.debit = 'Enter a debit or credit amount.';
    } else {
      if (!form.debit) e.debit = 'Outstanding balance is required.';
    }
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('bal_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Opening balance draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.name) e.name = form.type === 'GL' ? 'Account name is required.' : 'Customer name is required.';
    if (form.type === 'GL') {
      if (!form.debit && !form.credit) e.debit = 'Enter a debit or credit amount.';
    } else {
      if (!form.debit) e.debit = 'Outstanding balance is required.';
    }
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try { await new Promise(r => setTimeout(r, 600)); addNotification('Opening balance created successfully.', 'success'); localStorage.removeItem('bal_draft'); setActiveTab('erp_opening_balances'); }
    catch (err) { addNotification('Failed to save opening balance.', 'error'); }
    finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_opening_balances');
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
      <style>{`.bal-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .bal-pulse{animation:balp 2s ease-in-out 1;} @keyframes balp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.bal-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>ACCOUNTING / ERP</span>
                {draftSaved && <span className="bal-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>New Opening Balance</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Configure customer, vendor, bank, cash, inventory, and asset ledger opening figures.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Balance'}
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

        <div className="row g-3 bal-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCalculator} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Balance Entry</h6>
              </div>
              <div className="mb-3">
                <label style={labelStyle}>Balance Type</label>
                <select className="bal-input" style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="GL">General Ledger Account</option>
                  <option value="Customer">Customer Account</option>
                </select>
              </div>
              {form.type === 'GL' ? (
                <div className="row g-3">
                  <div className="col-md-12">
                    <label style={labelStyle}>Account Name</label>
                    <input className="bal-input" style={inputWithError('name')} placeholder="e.g. Petty Cash Vault" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className="col-md-12">
                    <label style={labelStyle}>Account Code</label>
                    <input className="bal-input" style={inputStyle} placeholder="e.g. 1001-03" value={form.code} onChange={e => set('code', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Debit ($)</label>
                    <input type="number" className="bal-input" style={inputWithError('debit')} placeholder="0" value={form.debit} onChange={e => set('debit', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Credit ($)</label>
                    <input type="number" className="bal-input" style={inputStyle} placeholder="0" value={form.credit} onChange={e => set('credit', e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-md-12">
                    <label style={labelStyle}>Customer Name</label>
                    <input className="bal-input" style={inputWithError('name')} placeholder="e.g. Wayne Enterprises" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Outstanding Balance ($)</label>
                    <input type="number" className="bal-input" style={inputWithError('debit')} placeholder="0" value={form.debit} onChange={e => set('debit', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Payment Terms</label>
                    <select className="bal-input" style={inputStyle} value={form.terms} onChange={e => set('terms', e.target.value)}>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                      <option value="Immediate">Immediate</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                {form.type === 'GL' ? <FontAwesomeIcon icon={faBuildingColumns} style={{ color: '#6366f1', fontSize: '0.85rem' }} /> : <FontAwesomeIcon icon={faUsers} style={{ color: '#6366f1', fontSize: '0.85rem' }} />}
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Entry Preview</h6>
              </div>
              <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${borderColor}` }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Type</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.type === 'GL' ? 'General Ledger' : 'Customer'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Debit</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: successColor }}>${(parseFloat(form.debit) || 0).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Credit</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: dangerColor }}>${(parseFloat(form.credit) || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Total debits must equal total credits. The system validates the trial balance variance before the fiscal year opens.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddBalance;
