import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faBook, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

const empty = { journalBook: 'General Journal', entryDate: '', totalAmount: '', debitAccount: '', creditAccount: '', narration: '' };
const STORAGE_KEY = 'journal_entry_draft';

const ErpCreateJournalEntry = () => {
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
    if (!form.totalAmount) errs.totalAmount = 'Amount is required.';
    if (!form.debitAccount) errs.debitAccount = 'Debit account is required.';
    if (!form.creditAccount) errs.creditAccount = 'Credit account is required.';
    setLiveErrors(errs);
    return Object.keys(errs).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Journal entry draft saved.', 'info');
  };
  const validate = () => {
    const errs = {};
    if (!form.totalAmount) errs.totalAmount = 'Amount is required.';
    if (!form.debitAccount) errs.debitAccount = 'Debit account is required.';
    if (!form.creditAccount) errs.creditAccount = 'Credit account is required.';
    setErrors(errs); return Object.keys(errs).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try { await new Promise(r => setTimeout(r, 600)); addNotification('Manual journal entry posted.', 'success'); localStorage.removeItem(STORAGE_KEY); setActiveTab('erp_journal_entries'); }
    catch { addNotification('Failed to post entry.', 'error'); }
    finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_journal_entries');
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
      <style>{`.cje-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .cje-pulse{animation:cjep 2s ease-in-out 1;} @keyframes cjep{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.cje-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>TRANSACTIONS / JOURNAL</span>
                {draftSaved && <span className="cje-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>Create Manual Journal Entry</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Post a balanced double-entry journal with debit and credit GL lines.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Entry'}
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

        <div className="row g-3 cje-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBook} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Journal Details</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label style={labelStyle}>Journal Book</label>
                  <select className="cje-input" style={inputStyle} value={form.journalBook} onChange={e => set('journalBook', e.target.value)}>
                    <option value="General Journal">General Journal</option>
                    <option value="Adjustment Journal">Adjustment Journal</option>
                    <option value="Tax Journal">Tax Journal</option>
                    <option value="Closing Journal">Closing Journal</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Posting Date *</label>
                  <input type="date" className="cje-input" style={inputWithError('entryDate')} value={form.entryDate} onChange={e => set('entryDate', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Total Debit/Credit ($) *</label>
                  <input type="number" className="cje-input" style={inputWithError('totalAmount')} value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>GL Debit Account *</label>
                  <input className="cje-input" style={inputWithError('debitAccount')} placeholder="60200 - Depreciation Expense" value={form.debitAccount} onChange={e => set('debitAccount', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>GL Credit Account *</label>
                  <input className="cje-input" style={inputWithError('creditAccount')} placeholder="18250 - Accumulated Depreciation - Buildings" value={form.creditAccount} onChange={e => set('creditAccount', e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label style={labelStyle}>Narration / Entry Description</label>
                  <textarea className="cje-input" style={{ ...inputStyle, minHeight: 70 }} value={form.narration} onChange={e => set('narration', e.target.value)} />
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
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Book</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.journalBook}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Amount</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.totalAmount ? '$' + form.totalAmount : '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Entries must be balanced. Postings update the General Ledger and trial balance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateJournalEntry;
