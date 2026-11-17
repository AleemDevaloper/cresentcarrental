import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faUserPlus, faIdCard, faHashtag,
  faBuilding, faEnvelope, faPhone, faLocationDot, faGlobe,
  faCreditCard, faStamp, faFileLines, faTags, faUserTie,
  faCircleInfo, faShieldHalved, faXmark, faSync, faCheckCircle,
  faKeyboard, faTriangleExclamation, faPen, faRefresh, faExternalLinkAlt, faEdit
} from "@fortawesome/free-solid-svg-icons";
import { erpColors } from '../../../../components/ui/ux/ErpTheme';
import { createARCustomer } from '../../../../api/customers';

const SECTIONS = [
  { id: 'general', label: 'General Information', icon: faBuilding },
  { id: 'tax', label: 'Tax & Registration', icon: faStamp },
  { id: 'contact', label: 'Contact & Address', icon: faLocationDot },
  { id: 'credit', label: 'Credit & Terms', icon: faCreditCard },
];

const emptyForm = {
  code: '',
  name: '',
  legalName: '',
  type: 'Corporate',
  group: 'Enterprise',
  ntn: '',
  strn: '',
  salesTaxRegNo: '',
  cnic: '',
  email: '',
  phone: '',
  website: '',
  contactPerson: '',
  contactDesignation: '',
  billingAddress: '',
  shippingAddress: '',
  country: 'Pakistan',
  city: '',
  zip: '',
  creditLimit: '500000',
  currency: 'PKR',
  paymentTerms: 'Net 30',
  priceList: 'Standard Price',
  discount: '0',
  taxProfile: 'Standard VAT',
  warehouse: 'Main Warehouse',
  status: 'Active',
  notes: '',
};

const riskColor = (isDark) => isDark ? '#f87171' : '#dc2626';

const ErpCreateCustomer = () => {
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

  const [activeSection, setActiveSection] = useState('general');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    const saved = localStorage.getItem('cust_draft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setForm(prev => ({ ...prev, ...d }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem('cust_draft', JSON.stringify(form));
    }, 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateLive = useMemo(() => () => {
    const e = {};
    if (!form.name) e.name = 'Company name is required.';
    if (!form.code) e.code = 'Customer code is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.ntn) e.ntn = 'NTN is required for tax-compliant invoicing.';
    else if (!/^\d{7}$/.test(form.ntn)) e.ntn = 'NTN must be exactly 7 digits.';
    if (form.cnic && !/^\d{5}-\d{7}-\d{1}$/.test(form.cnic)) e.cnic = 'CNIC must be in format 00000-0000000-0.';
    if (form.creditLimit && parseFloat(form.creditLimit) < 0) e.creditLimit = 'Credit limit cannot be negative.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  useEffect(() => {
    const t = setTimeout(() => validateLive(), 500);
    return () => clearTimeout(t);
  }, [validateLive]);

  const handleSaveDraft = () => {
    localStorage.setItem('cust_draft', JSON.stringify(form));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Customer draft saved.', 'info');
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Company name is required.';
    if (!form.code) e.code = 'Customer code is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.ntn) e.ntn = 'NTN is required for tax-compliant invoicing.';
    else if (!/^\d{7}$/.test(form.ntn)) e.ntn = 'NTN must be exactly 7 digits.';
    if (form.cnic && !/^\d{5}-\d{7}-\d{1}$/.test(form.cnic)) e.cnic = 'CNIC must be in format 00000-0000000-0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      addNotification('Please fix the highlighted fields.', 'warning');
      const firstErr = ['general', 'tax'].find(s => ['name', 'code', 'email', 'ntn', 'cnic'].some(k => errors[k] && (s === 'general' ? ['name', 'code', 'email'].includes(k) : ['ntn', 'cnic'].includes(k))));
      if (firstErr) setActiveSection(firstErr);
      return;
    }
      setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        company_name: form.legalName || form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        address: form.billingAddress || form.shippingAddress || '',
        type: form.type,
        status: form.status,
        website: form.website,
        total_revenue: form.creditLimit ? parseFloat(form.creditLimit) : 0,
      };

      const res = await createARCustomer(payload);
      addNotification(res?.message || `Customer "${form.name}" created successfully.`, 'success');
      localStorage.removeItem('cust_draft');
      setActiveTab('erp_customers');
    } catch (err) {
      const msg = err?.message || (err?.body && err.body.message) || 'Failed to create customer.';
      addNotification(msg, 'error');
      if (err?.body && typeof err.body === 'object' && err.body.errors) {
        setErrors(err.body.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveTab('erp_customers');

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

  const Label = ({ children, required, k }) => (
    <label style={labelStyle}>
      {children}{required && <span style={{ color: '#ef4444' }}> *</span>}
      {errors[k] && <span style={{ color: '#ef4444', marginLeft: 8, fontWeight: 500, textTransform: 'none' }}>{errors[k]}</span>}
      {!errors[k] && liveErrors[k] && <span style={{ color: '#f59e0b', marginLeft: 8, fontWeight: 500, textTransform: 'none' }}>{liveErrors[k]}</span>}
    </label>
  );

  const inputWithError = (k) => ({
    ...inputStyle,
    border: errors[k] || liveErrors[k] ? `1px solid ${riskColor(isDark)}` : inputStyle.border,
  });

  const statusColors = {
    'Active': { bg: successBg, color: successColor },
    'Credit Hold': { bg: warningBg, color: warningColor },
    'Inactive': { bg: dangerBg, color: dangerColor },
  };
  const sc = statusColors[form.status] || statusColors['Active'];

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .cust-nav-tabs { display: flex; gap: 0; background: ${isDark ? '#1e2235' : '#ffffff'}; border-radius: 10px; padding: 4px; border: 1px solid ${borderColor}; overflow-x: auto; scrollbar-width: none; }
        .cust-nav-tabs::-webkit-scrollbar { display: none; }
        .cust-nav-tab { padding: 0.5rem 1rem; font-size: 0.78rem; font-weight: 500; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: all 0.2s; border: none; background: transparent; color: ${mutedColor}; display: flex; align-items: center; gap: 6px; }
        .cust-nav-tab:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; color: ${textColor}; }
        .cust-nav-tab.active { background: #6366f1; color: #ffffff; box-shadow: 0 2px 8px rgba(99,102,241,0.3); }
        .cust-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .cust-side-btn { width: 100%; text-align: left; display: flex; align-items: center; gap: 8px; padding: 0.5rem 0.75rem; border-radius: 10px; border: none; background: transparent; color: ${mutedColor}; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.15s; margin-bottom: 4px; }
        .cust-side-btn:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; color: ${textColor}; }
        .cust-side-btn.active { background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; font-weight: 700; }
        .cust-pulse { animation: custPulse 2s ease-in-out 1; }
        @keyframes custPulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        @media (max-width: 768px) { .cust-responsive { grid-template-columns: 1fr !important; } }
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
                {draftSaved && <span className="cust-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>New Customer</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Enroll a new corporate or individual customer. Saving this record creates a master profile used for invoicing, receipts, and ledger postings with full tax identifiers.
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
              <FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Customer'}
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
        </div>

        <div className="cust-nav-tabs mb-4">
          {SECTIONS.map(s => (
            <button key={s.id} className={`cust-nav-tab ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
              <FontAwesomeIcon icon={s.icon} style={{ fontSize: '0.7rem' }} /> {s.label}
            </button>
          ))}
        </div>

        <div className="row g-3 cust-responsive">
          <div className="col-lg-3">
            <div style={cardStyle} className="p-2">
              {SECTIONS.map(s => (
                <button key={s.id} className={`cust-side-btn ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
                  <FontAwesomeIcon icon={s.icon} style={{ fontSize: '0.8rem' }} /> {s.label}
                </button>
              ))}
              <div className="mt-2 p-2 rounded" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)', fontSize: '0.72rem', color: mutedColor }}>
                <FontAwesomeIcon icon={faCircleInfo} className="me-1" style={{ color: '#6366f1' }} />
                NTN is mandatory for FBR-compliant invoicing in Pakistan.
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {activeSection === 'general' && (
              <div style={cardStyle}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faBuilding} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                  <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>General Information</h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Label required k="code">Customer Code</Label>
                    <input className="cust-input" style={inputWithError('code')} placeholder="e.g. CUST-010" value={form.code} onChange={e => set('code', e.target.value)} />
                  </div>
                  <div className="col-md-8">
                    <Label required k="name">Company / Customer Name</Label>
                    <input className="cust-input" style={inputWithError('name')} placeholder="e.g. Acme Industries Ltd." value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <Label>Legal Registered Name</Label>
                    <input className="cust-input" style={inputStyle} placeholder="As per SEC / NTN registration" value={form.legalName} onChange={e => set('legalName', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <Label>Customer Type</Label>
                    <select className="cust-input" style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
                      <option>Corporate</option><option>Individual</option><option>Government</option><option>Partnership</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <Label>Customer Group</Label>
                    <select className="cust-input" style={inputStyle} value={form.group} onChange={e => set('group', e.target.value)}>
                      <option>Enterprise</option><option>Mid-Market</option><option>Retail</option><option>Key Account</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <Label>Notes</Label>
                    <textarea className="cust-input" rows={2} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} placeholder="Internal remarks / classification" value={form.notes} onChange={e => set('notes', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'tax' && (
              <div style={cardStyle}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faStamp} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                  <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Tax & Registration</h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Label required k="ntn">NTN Number</Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ background: inputBg, border: errors.ntn || liveErrors.ntn ? riskColor(isDark) : inputBorder, color: mutedColor, fontSize: '0.8rem' }}><FontAwesomeIcon icon={faHashtag} /></span>
                      <input className="cust-input" style={{ ...inputWithError('ntn'), borderRadius: '0 8px 8px 0' }} placeholder="1234567" value={form.ntn} onChange={e => set('ntn', e.target.value.replace(/[^\d]/g, ''))} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <Label>STRN (Sales Tax Reg No)</Label>
                    <input className="cust-input" style={inputStyle} placeholder="e.g. 0000000000000" value={form.strn} onChange={e => set('strn', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Sales Tax Registration</Label>
                    <input className="cust-input" style={inputStyle} placeholder="e.g. SRB-12345" value={form.salesTaxRegNo} onChange={e => set('salesTaxRegNo', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label k="cnic">CNIC (Individual)</Label>
                    <input className="cust-input" style={inputWithError('cnic')} placeholder="00000-0000000-0" value={form.cnic} onChange={e => set('cnic', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Tax Profile</Label>
                    <select className="cust-input" style={inputStyle} value={form.taxProfile} onChange={e => set('taxProfile', e.target.value)}>
                      <option>Standard VAT</option><option>Exempt</option><option>Withholding</option><option>Zero-Rated</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <Label>Tax Country</Label>
                    <input className="cust-input" style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div style={cardStyle}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faLocationDot} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                  <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Contact & Address</h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Label required k="email">Email</Label>
                    <input type="email" className="cust-input" style={inputWithError('email')} value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Phone</Label>
                    <input className="cust-input" style={inputStyle} placeholder="+92 300 0000000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Website</Label>
                    <input className="cust-input" style={inputStyle} placeholder="https://" value={form.website} onChange={e => set('website', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Contact Person</Label>
                    <input className="cust-input" style={inputStyle} value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Designation</Label>
                    <input className="cust-input" style={inputStyle} value={form.contactDesignation} onChange={e => set('contactDesignation', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>City</Label>
                    <input className="cust-input" style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <Label>Billing Address</Label>
                    <textarea className="cust-input" rows={2} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} value={form.billingAddress} onChange={e => set('billingAddress', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <Label>Shipping Address</Label>
                    <textarea className="cust-input" rows={2} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} placeholder="Leave blank to copy billing" value={form.shippingAddress} onChange={e => set('shippingAddress', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>ZIP / Post Code</Label>
                    <input className="cust-input" style={inputStyle} value={form.zip} onChange={e => set('zip', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'credit' && (
              <div style={cardStyle}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faCreditCard} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                  <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Credit & Terms</h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <Label k="creditLimit">Credit Limit</Label>
                    <input type="number" className="cust-input" style={inputWithError('creditLimit')} value={form.creditLimit} onChange={e => set('creditLimit', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Currency</Label>
                    <select className="cust-input" style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
                      <option>PKR</option><option>USD</option><option>EUR</option><option>GBP</option><option>AED</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <Label>Payment Terms</Label>
                    <select className="cust-input" style={inputStyle} value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}>
                      <option>Due on Receipt</option><option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option><option>End of Month</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <Label>Price List</Label>
                    <select className="cust-input" style={inputStyle} value={form.priceList} onChange={e => set('priceList', e.target.value)}>
                      <option>Standard Price</option><option>Corporate Price List</option><option>Retail Price</option><option>Wholesale</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <Label>Default Discount %</Label>
                    <input type="number" className="cust-input" style={inputStyle} value={form.discount} onChange={e => set('discount', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <Label>Warehouse</Label>
                    <select className="cust-input" style={inputStyle} value={form.warehouse} onChange={e => set('warehouse', e.target.value)}>
                      <option>Main Warehouse</option><option>East Warehouse</option><option>West Warehouse</option><option>North Warehouse</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <Label>Status</Label>
                    <select className="cust-input" style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                      <option>Active</option><option>Credit Hold</option><option>Inactive</option>
                    </select>
                    <div className="d-inline-flex align-items-center gap-1 mt-2" style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600, background: sc.bg, color: sc.color }}>
                      <FontAwesomeIcon icon={faCircleInfo} style={{ fontSize: '0.55rem' }} /> {form.status}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-2 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
              <span className="small d-flex align-items-center gap-1" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1' }} /> Encrypted & saved to central customer master
              </span>
              <div className="d-flex gap-2">
                <button onClick={handleBack} className="btn btn-sm border-0 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem' }}>
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm text-white border-0 px-4 d-flex align-items-center gap-2" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}>
                  <FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateCustomer;
