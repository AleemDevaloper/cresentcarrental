import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faReceipt, faBuilding, faCoins,
  faCreditCard, faBank, faFileInvoice, faCalendarDays,
  faTag, faNoteSticky, faCheckCircle, faUserTie, faSearch, faInfoCircle,
  faPhone, faEnvelope, faSync, faXmark, faKeyboard,
  faTriangleExclamation, faHashtag, faShieldHalved, faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import client from '../../../../api/client';
import { listARCustomers } from '../../../../api/customers';

const BANKS = ['Silicon Valley Bank', 'Chase Bank', 'Bank of America', 'Cash Vault', 'Habib Bank Ltd.', 'Meezan Bank Ltd.'];
const METHODS = ['Bank Transfer', 'Cheque', 'Cash', 'Credit Card', 'Online Wallet'];

const emptyForm = {
  customer: '',
  customerId: null,
  date: new Date().toISOString().slice(0, 10),
  method: 'Bank Transfer',
  bank: 'Silicon Valley Bank',
  amount: '',
  referenceNo: '',
  allocatedTo: 'Unallocated',
  invoiceRef: '',
  receivedBy: '',
  notes: '',
  status: 'Pending Approval',
};

const ErpCreateReceipt = () => {
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

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [customerSearch, setCustomerSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const customerInputRef = useRef(null);

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem',
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: '8px', color: textColor, outline: 'none', transition: 'border-color 0.2s',
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
    let active = true;
    listARCustomers({ perPage: 1000 })
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : (data?.data || []));
        setCompanies(list.map((t) => ({ id: t.id, name: t.name || t.company_name || t.legalName || '', email: t.email || '', phone: t.phone || t.contact || '' })));
      })
      .catch(() => { if (active) setCompanies([]); })
      .finally(() => { if (active) setCompaniesLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const editData = sessionStorage.getItem('edit_receipt');
    if (editData) {
      try {
        const r = JSON.parse(editData);
        sessionStorage.removeItem('edit_receipt');
        setEditingId(r.id);
        localStorage.removeItem('rcpt_draft');
        setForm({
          customer: r.customer || r.customer_name || '',
          customerId: r.client_id || null,
          date: r.date || new Date().toISOString().slice(0, 10),
          method: r.method || 'Bank Transfer',
          bank: r.bank || 'Silicon Valley Bank',
          amount: r.amount?.toString() || '',
          referenceNo: r.reference_no || '',
          allocatedTo: r.allocated_to || 'Unallocated',
          invoiceRef: r.invoice_ref || '',
          receivedBy: r.received_by || '',
          notes: r.notes || '',
          status: r.status || 'Pending Approval',
        });
        setCustomerSearch(r.customer || r.customer_name || '');
      } catch (e) {}
      return;
    }
    const saved = localStorage.getItem('rcpt_draft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setForm(prev => ({ ...prev, ...d }));
        if (d.customer) setCustomerSearch(d.customer);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { localStorage.setItem('rcpt_draft', JSON.stringify(form)); }, 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
    (c.phone && c.phone.includes(customerSearch))
  );

  const selectCustomer = (cust) => {
    setForm((f) => ({ ...f, customer: cust.name, customerId: cust.id }));
    setCustomerSearch(cust.name);
    setShowDropdown(false);
  };

  const validateLive = useMemo(() => () => {
    const e = {};
    if (!form.customer) e.customer = 'Select a customer.';
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount greater than zero.';
    if (!form.referenceNo) e.referenceNo = 'Transaction reference is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  useEffect(() => {
    const t = setTimeout(() => validateLive(), 500);
    return () => clearTimeout(t);
  }, [validateLive]);

  const handleSaveDraft = () => {
    localStorage.setItem('rcpt_draft', JSON.stringify(form));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Receipt draft saved.', 'info');
  };

  const validate = () => {
    const e = {};
    if (!form.customer) e.customer = 'Select a customer.';
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount greater than zero.';
    if (!form.referenceNo) e.referenceNo = 'Transaction reference is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      addNotification('Please fix the highlighted fields.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer_id: form.customerId,
        customer_name: form.customer,
        date: form.date,
        method: form.method,
        bank: form.bank,
        amount: parseFloat(form.amount),
        reference_no: form.referenceNo,
        allocated_to: form.allocatedTo,
        invoice_ref: form.invoiceRef,
        received_by: form.receivedBy,
        notes: form.notes,
        status: form.status,
      };

      if (editingId) {
        await client.put(`/receipts/${editingId}`, payload);
        addNotification('Receipt updated successfully.', 'success');
      } else {
        const res = await client.post('/receipts', payload);
        addNotification(res?.data?.message || 'Customer receipt registered successfully.', 'success');
        localStorage.removeItem('rcpt_draft');
      }
      setActiveTab('erp_customer_receipts');
    } catch (err) {
      const msg = err?.message || (err?.data && err.data.message) || 'Failed to save receipt.';
      addNotification(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveTab('erp_customer_receipts');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const inputWithError = (k) => ({
    ...inputStyle,
    border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border,
  });

  const statusColors = {
    'Pending Approval': { bg: warningBg, color: warningColor },
    'Posted': { bg: successBg, color: successColor },
    'Cancelled': { bg: dangerBg, color: dangerColor },
  };
  const sc = statusColors[form.status] || statusColors['Pending Approval'];

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .rcpt-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .rcpt-dropdown { position: absolute; z-index: 100; background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 10px; box-shadow: ${isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.12)'}; max-height: 320px; overflow-y: auto; width: 100%; top: 100%; margin-top: 4px; }
        .rcpt-dropdown-item { padding: 0.6rem 0.75rem; cursor: pointer; border-bottom: 1px solid ${borderColor}; transition: background 0.15s; }
        .rcpt-dropdown-item:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; }
        .rcpt-dropdown-item:last-child { border-bottom: none; }
        @keyframes rcptPulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        .rcpt-pulse { animation: rcptPulse 2s ease-in-out 1; }
        @media (max-width: 768px) { .rcpt-responsive { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}`, transition: 'all 0.2s' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>ACCOUNTING / ERP</span>
                {editingId && <span style={{ background: '#fef9c3', color: '#ca8a04', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>EDITING</span>}
                {draftSaved && <span className="rcpt-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{editingId ? 'Edit Receipt Entry' : 'New Receipt Entry'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                {editingId ? 'Update the receipt details below. Changes will be saved to the existing receipt record.' : 'Record an incoming customer payment. Posting this receipt debits the bank/cash ledger and credits Accounts Receivable, with optional allocation to a specific invoice.'}
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft}
              className="btn btn-sm d-flex align-items-center gap-1 px-3"
              style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white"
              style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Receipt' : 'Save Receipt')}
            </button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3"
              style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Save</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Alt+C: Customer</span>
        </div>

        <div className="row g-3 rcpt-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBuilding} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Customer & Receipt Information</h6>
                {form.customer && (
                  <span className="badge ms-auto" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.6rem', fontWeight: 600 }}>{form.customer}</span>
                )}
              </div>

              <div className="position-relative mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faUserTie} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Customer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="position-relative">
                  <input ref={customerInputRef}
                    style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                    className="rcpt-input"
                    placeholder={companiesLoading ? 'Loading companies...' : 'Search by name, email, or phone...'}
                    value={customerSearch}
                    disabled={companiesLoading}
                    onChange={e => { setCustomerSearch(e.target.value); setShowDropdown(true); setForm(f => ({ ...f, customer: '', customerId: null })); }}
                    onFocus={() => { setShowDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                  />
                  <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.75rem' }} />
                  {showDropdown && !companiesLoading && (
                    <div className="rcpt-dropdown rcpt-animate">
                      <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.65rem', color: mutedColor, borderBottom: `1px solid ${borderColor}`, fontWeight: 600 }}>
                        {filteredCompanies.length} Companies
                      </div>
                      {filteredCompanies.slice(0, 50).map(c => (
                        <div key={c.id} className="rcpt-dropdown-item" onMouseDown={() => selectCustomer(c)}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{c.name}</div>
                              <div style={{ fontSize: '0.62rem', color: mutedColor, marginTop: 2 }}>
                                <FontAwesomeIcon icon={faPhone} style={{ marginRight: 3, fontSize: '0.55rem' }} />{c.phone || 'N/A'} | <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 3, fontSize: '0.55rem' }} />{c.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredCompanies.length === 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: mutedColor }}>No companies found.</div>
                      )}
                    </div>
                  )}
                </div>
                {(errors.customer || liveErrors.customer) && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 4 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{errors.customer || liveErrors.customer}</div>}
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Receipt Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="date" style={inputStyle} className="rcpt-input" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faHashtag} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Transaction Reference <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input style={inputWithError('referenceNo')} className="rcpt-input" placeholder="e.g. TXN-99821 / Cheque No" value={form.referenceNo} onChange={e => set('referenceNo', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faCoins} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Amount Received <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: inputBg, border: errors.amount || liveErrors.amount ? dangerColor : inputBorder, color: mutedColor, fontSize: '0.8rem' }}>Rs</span>
                    <input type="number" style={{ ...inputWithError('amount'), borderRadius: '0 8px 8px 0' }} className="rcpt-input" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Payment Method
                  </label>
                  <select style={inputStyle} className="rcpt-input" value={form.method} onChange={e => set('method', e.target.value)}>
                    {METHODS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faBank} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Clearing / Deposit Account
                  </label>
                  <select style={inputStyle} className="rcpt-input" value={form.bank} onChange={e => set('bank', e.target.value)}>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faTag} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Allocated To
                  </label>
                  <select style={inputStyle} className="rcpt-input" value={form.allocatedTo} onChange={e => set('allocatedTo', e.target.value)}>
                    <option>Unallocated</option>
                    <option>Specific Invoice</option>
                    <option>On Account</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Invoice Reference
                  </label>
                  <input style={inputStyle} className="rcpt-input" placeholder="e.g. INV-2026-042 (optional)" value={form.invoiceRef} onChange={e => set('invoiceRef', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faUserTie} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Received By
                  </label>
                  <input style={inputStyle} className="rcpt-input" placeholder="Cashier / Finance clerk" value={form.receivedBy} onChange={e => set('receivedBy', e.target.value)} />
                </div>
                <div className="col-12">
                  <label style={labelStyle}>
                    <FontAwesomeIcon icon={faNoteSticky} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                    Notes
                  </label>
                  <textarea style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} className="rcpt-input" rows={2} placeholder="Internal remarks" value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faReceipt} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Receipt Details</h6>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Status
                </label>
                <select style={inputStyle} className="rcpt-input" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option>Pending Approval</option>
                  <option>Posted</option>
                  <option>Cancelled</option>
                </select>
                <div className="d-inline-flex align-items-center gap-1 mt-2" style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600, background: sc.bg, color: sc.color }}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '0.55rem' }} /> {form.status}
                </div>
                {form.status === 'Posted' && <div style={{ fontSize: '0.6rem', color: '#f59e0b', marginTop: 2 }}>Read-only after posting</div>}
                {form.status === 'Pending Approval' && <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 2 }}>Requires finance approval</div>}
              </div>

              <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${borderColor}` }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Receipt Amount</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>Rs {(parseFloat(form.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Allocated</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>
                    {(form.allocatedTo === 'Unallocated') ? 'Rs 0.00' : (parseFloat(form.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <hr style={{ borderColor, margin: '0.5rem 0' }} />
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor }}>Unallocated</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: form.allocatedTo === 'Unallocated' && form.amount ? '#f59e0b' : '#6366f1' }}>
                    Rs {(form.allocatedTo === 'Unallocated' ? (parseFloat(form.amount) || 0) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Receipts are reconciled automatically against the customer ledger. Amounts pending approval remain in a suspense clearing account until verified by finance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateReceipt;
