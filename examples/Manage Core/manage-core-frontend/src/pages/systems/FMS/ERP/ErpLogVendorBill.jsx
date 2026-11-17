import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faSync, faCheckCircle, faXmark, faKeyboard, faInfoCircle, faShieldHalved, faWallet, faFileInvoice, faTriangleExclamation, faBuildingColumns } from "@fortawesome/free-solid-svg-icons";

const ErpLogVendorBill = () => {
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
    grnRef: '',
    vendor: '',
    invoiceNo: '',
    due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    expenseAccount: '2110 - Accounts Payable',
    isDuplicateWarning: false,
    items: [{ product: '', qty: 1, unitCost: 0, discount: 0 }]
  });
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: mutedColor, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' };
  const cardStyle = { background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', padding: '1.25rem', marginBottom: '1rem' };

  useEffect(() => {
    const saved = localStorage.getItem('vb_draft');
    if (saved) {
      try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {}
    }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('vb_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const checkDuplicateInvoice = (val) => {
    const dup = val.trim().toLowerCase() === 'inv-2026-dup';
    setForm(f => ({ ...f, isDuplicateWarning: dup }));
  };

  const validateLive = () => {
    const e = {};
    if (!form.vendor) e.vendor = 'Vendor name is required.';
    if (!form.invoiceNo) e.invoiceNo = 'Supplier invoice number is required.';
    if (!form.due) e.due = 'Payment due date is required.';
    form.items.forEach((it, i) => {
      if (!it.product) e[`item_product_${i}`] = 'Product is required.';
      if (!(it.qty > 0)) e[`item_qty_${i}`] = 'Qty must be greater than 0.';
      if (!(it.unitCost >= 0)) e[`item_cost_${i}`] = 'Unit cost must be >= 0.';
    });
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => {
    const t = setTimeout(validateLive, 500);
    return () => clearTimeout(t);
  }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('vb_draft', JSON.stringify(form));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Vendor bill draft saved.', 'info');
  };

  const updateItem = (idx, key, val) => {
    setForm(f => {
      const items = f.items.map((it, i) => i === idx ? { ...it, [key]: val } : it);
      return { ...f, items };
    });
  };
  const addItemRow = () => setForm(f => ({ ...f, items: [...f.items, { product: '', qty: 1, unitCost: 0, discount: 0 }] }));
  const removeItemRow = (idx) => setForm(f => ({ ...f, items: f.items.length > 1 ? f.items.filter((_, i) => i !== idx) : f.items }));

  const validate = () => {
    const e = {};
    if (!form.vendor) e.vendor = 'Vendor name is required.';
    if (!form.invoiceNo) e.invoiceNo = 'Supplier invoice number is required.';
    if (!form.due) e.due = 'Payment due date is required.';
    form.items.forEach((it, i) => {
      if (!it.product) e[`item_product_${i}`] = 'Product is required.';
      if (!(it.qty > 0)) e[`item_qty_${i}`] = 'Qty must be greater than 0.';
      if (!(it.unitCost >= 0)) e[`item_cost_${i}`] = 'Unit cost must be >= 0.';
    });
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
      await new Promise(r => setTimeout(r, 600));
      addNotification('Vendor bill recorded successfully.', 'success');
      localStorage.removeItem('vb_draft');
      setActiveTab('erp_vendor_bills');
    } catch (err) {
      addNotification('Failed to save vendor bill.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveTab('erp_vendor_bills');

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });

  const subtotal = form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitCost) || 0), 0);
  const totalDiscount = form.items.reduce((s, it) => s + (Number(it.discount) || 0), 0);
  const net = subtotal - totalDiscount;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.vb-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .vb-pulse{animation:vbp 2s ease-in-out 1;} @keyframes vbp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.vb-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}><FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} /></button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / ERP</span>
                {draftSaved && <span className="vb-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>Log Vendor Bill</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>Record an approved supplier invoice against a PO/GRN, detect duplicates, and post to accounts payable.</p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={faSave} /> Save Draft</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Vendor Bill'}</button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={faXmark} /> Cancel</button>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Save</span>
        </div>
        <div className="row g-3 vb-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faWallet} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Vendor Bill Details</h2>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Approved PO Reference</label>
                  <select className="vb-input" style={inputStyle} value={form.poRef} onChange={(e) => set('poRef', e.target.value)}>
                    <option value="None">None (Manual Bill Creation)</option>
                    <option value="PO-2026-001 - Oscorp Tech">PO-2026-001 - Oscorp Tech</option>
                    <option value="PO-2026-002 - Stark Ind.">PO-2026-002 - Stark Ind.</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>GRN Intake Reference (Auto matched)</label>
                  <input className="vb-input" style={{ ...inputStyle, background: isDark ? '#161a2b' : '#f1f5f9', color: mutedColor }} value={form.grnRef} readOnly placeholder="Auto-matched from PO/GRN" />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Vendor Name</label>
                  <input className="vb-input" style={inputWithError('vendor')} value={form.vendor} onChange={(e) => set('vendor', e.target.value)} placeholder="e.g. Oscorp Tech" />
                  {errors.vendor && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.vendor}</div>}
                  {liveErrors.vendor && !errors.vendor && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem' }}>{liveErrors.vendor}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Supplier Invoice Number</label>
                  <input className={`vb-input ${form.isDuplicateWarning ? 'border-danger' : ''}`} style={inputWithError('invoiceNo')} value={form.invoiceNo} onChange={(e) => { set('invoiceNo', e.target.value); checkDuplicateInvoice(e.target.value); }} placeholder="e.g. INV-2026-001" />
                  {form.isDuplicateWarning && (
                    <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FontAwesomeIcon icon={faTriangleExclamation} /> Duplicate invoice detected for this vendor!
                    </div>
                  )}
                  {errors.invoiceNo && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.invoiceNo}</div>}
                  {liveErrors.invoiceNo && !errors.invoiceNo && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem' }}>{liveErrors.invoiceNo}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Payment Due Date</label>
                  <input type="date" className="vb-input" style={inputWithError('due')} value={form.due} onChange={(e) => set('due', e.target.value)} />
                  {errors.due && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.due}</div>}
                  {liveErrors.due && !errors.due && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.25rem' }}>{liveErrors.due}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>General Ledger Account Code</label>
                  <select className="vb-input" style={inputStyle} value={form.expenseAccount} onChange={(e) => set('expenseAccount', e.target.value)}>
                    <option value="2110 - Accounts Payable">2110 - Accounts Payable</option>
                    <option value="5020 - Computer Hardware Expenses">5020 - Computer Hardware Expenses</option>
                    <option value="5030 - Office Stationery Expenses">5030 - Office Stationery Expenses</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Invoice Item Lines</label>
                  <button onClick={addItemRow} className="btn btn-sm border-0" style={{ borderRadius: '8px', background: '#6366f1', color: '#fff', fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}>+ Add Line</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table mb-0" style={{ color: textColor, fontSize: '0.78rem', minWidth: 600 }}>
                    <thead>
                      <tr style={{ color: mutedColor, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        <th style={{ borderColor }}>Product</th>
                        <th style={{ borderColor, width: 90 }}>Qty</th>
                        <th style={{ borderColor, width: 120 }}>Unit Cost</th>
                        <th style={{ borderColor, width: 110 }}>Discount</th>
                        <th style={{ borderColor, width: 50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((it, i) => (
                        <tr key={i}>
                          <td style={{ borderColor }}>
                            <input className="vb-input" style={inputWithError(`item_product_${i}`)} value={it.product} onChange={(e) => updateItem(i, 'product', e.target.value)} placeholder="Product / service" />
                            {(errors[`item_product_${i}`] || liveErrors[`item_product_${i}`]) && <div style={{ color: dangerColor, fontSize: '0.65rem', marginTop: '0.2rem' }}>{errors[`item_product_${i}`] || liveErrors[`item_product_${i}`]}</div>}
                          </td>
                          <td style={{ borderColor }}>
                            <input type="number" className="vb-input" style={inputWithError(`item_qty_${i}`)} value={it.qty} onChange={(e) => updateItem(i, 'qty', Number(e.target.value))} />
                            {(errors[`item_qty_${i}`] || liveErrors[`item_qty_${i}`]) && <div style={{ color: dangerColor, fontSize: '0.65rem', marginTop: '0.2rem' }}>{errors[`item_qty_${i}`] || liveErrors[`item_qty_${i}`]}</div>}
                          </td>
                          <td style={{ borderColor }}>
                            <input type="number" className="vb-input" style={inputWithError(`item_cost_${i}`)} value={it.unitCost} onChange={(e) => updateItem(i, 'unitCost', Number(e.target.value))} />
                            {(errors[`item_cost_${i}`] || liveErrors[`item_cost_${i}`]) && <div style={{ color: dangerColor, fontSize: '0.65rem', marginTop: '0.2rem' }}>{errors[`item_cost_${i}`] || liveErrors[`item_cost_${i}`]}</div>}
                          </td>
                          <td style={{ borderColor }}>
                            <input type="number" className="vb-input" style={inputStyle} value={it.discount} onChange={(e) => updateItem(i, 'discount', Number(e.target.value))} />
                          </td>
                          <td style={{ borderColor }}>
                            <button onClick={() => removeItemRow(i)} disabled={form.items.length === 1} className="btn btn-sm border-0" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#fee2e2', color: '#dc2626', fontSize: '0.7rem' }}><FontAwesomeIcon icon={faXmark} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faFileInvoice} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Bill Summary</h2>
              </div>
              <div style={{ fontSize: '0.78rem', color: mutedColor }}>
                <div className="d-flex justify-content-between mb-2"><span>Line Items</span><span style={{ color: textColor, fontWeight: 600 }}>{form.items.length}</span></div>
                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span style={{ color: textColor, fontWeight: 600 }}>{subtotal.toFixed(2)}</span></div>
                <div className="d-flex justify-content-between mb-2"><span>Total Discount</span><span style={{ color: textColor, fontWeight: 600 }}>-{totalDiscount.toFixed(2)}</span></div>
                <div className="d-flex justify-content-between mb-2" style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.5rem' }}><span style={{ fontWeight: 700, color: textColor }}>Net Payable</span><span style={{ fontWeight: 700, color: successColor }}>{net.toFixed(2)}</span></div>
                <div className="d-flex justify-content-between mb-1"><span>Due Date</span><span style={{ color: textColor, fontWeight: 600 }}>{form.due}</span></div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBuildingColumns} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>AP Posting</h2>
              </div>
              <div style={{ fontSize: '0.78rem', color: mutedColor }}>
                <div className="d-flex justify-content-between mb-2"><span>GL Account</span><span style={{ color: textColor, fontWeight: 600 }}>{form.expenseAccount}</span></div>
                <div className="d-flex align-items-start gap-2 mt-2" style={{ fontSize: '0.72rem' }}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ color: mutedColor, marginTop: '2px' }} />
                  <span>Bill posts to Accounts Payable and awaits three-way match (PO, GRN, Invoice) before payment run.</span>
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, background: isDark ? '#1e2235' : '#f8fafc' }}>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.72rem', color: mutedColor }}>
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: warningColor }} />
                <span>Duplicate detection active on invoice number.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ErpLogVendorBill;
