import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faSync, faCheckCircle, faXmark, faKeyboard, faInfoCircle, faShieldHalved, faClipboardList, faTruck, faFileInvoice, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const ErpCreatePurchaseOrder = () => {
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

  const [form, setForm] = useState({
    vendor: 'Oscorp Tech',
    warehouse: 'Main WH-A',
    project: 'Project Alpha Tech',
    expectedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    paymentTerms: 'NET 30',
    shippingMethod: 'Air Freight',
    deliveryAddress: 'New York R&D Facility, 5th Avenue',
    items: [{ product: '', description: '', qty: 1, unitPrice: 0, discount: 0 }]
  });
  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: mutedColor, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' };
  const cardStyle = { background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', padding: '1.25rem', marginBottom: '1rem' };

  useEffect(() => {
    const saved = localStorage.getItem('po_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(prev => ({ ...prev, ...parsed }));
        if (parsed.items && Array.isArray(parsed.items) && parsed.items.length) {
          // ok
        } else if (parsed.items === undefined) {
          // keep default items
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('po_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'purchase_order') {
      const doc = editDocument;
      setForm({
        vendor: doc.vendor || 'Oscorp Tech',
        warehouse: doc.warehouse || 'Main WH-A',
        project: doc.project || '',
        expectedDelivery: doc.expectedDelivery || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        paymentTerms: doc.paymentTerms || 'NET 30',
        shippingMethod: doc.shippingMethod || 'Air Freight',
        deliveryAddress: doc.deliveryAddress || '',
        items: doc.items && doc.items.length > 0 ? doc.items.map(i => ({
          product: i.product || '',
          description: i.description || '',
          qty: parseFloat(i.qty) || 1,
          unitPrice: parseFloat(i.unitPrice) || 0,
          discount: parseFloat(i.discount) || 0,
        })) : [{ product: '', description: '', qty: 1, unitPrice: 0, discount: 0 }]
      });
      setIsEditing(true);
      setEditingId(doc.id);
      setEditDocument(null);
    }
  }, [editDocument]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const updateItem = (idx, k, v) => {
    setForm(f => {
      const items = f.items.map((it, i) => i === idx ? { ...it, [k]: v } : it);
      return { ...f, items };
    });
  };

  const addItemRow = () => {
    setForm(f => ({ ...f, items: [...f.items, { product: '', description: '', qty: 1, unitPrice: 0, discount: 0 }] }));
  };

  const removeItemRow = (idx) => {
    setForm(f => {
      if (f.items.length <= 1) return f;
      return { ...f, items: f.items.filter((_, i) => i !== idx) };
    });
  };

  const validateLive = () => {
    const e = {};
    if (!form.vendor) e.vendor = 'Vendor is required.';
    if (!form.warehouse) e.warehouse = 'Warehouse is required.';
    if (!form.expectedDelivery) e.expectedDelivery = 'Expected delivery date is required.';
    if (!form.deliveryAddress) e.deliveryAddress = 'Delivery address is required.';
    form.items.forEach((it, i) => {
      if (!it.product) e[`item_${i}_product`] = 'Product is required.';
      if (!(parseFloat(it.qty) > 0)) e[`item_${i}_qty`] = 'Qty must be greater than 0.';
      if (!(parseFloat(it.unitPrice) >= 0)) e[`item_${i}_unitPrice`] = 'Unit price must be 0 or greater.';
    });
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    const t = setTimeout(validateLive, 500);
    return () => clearTimeout(t);
  }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('po_draft', JSON.stringify(form));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Purchase order draft saved.', 'info');
  };

  const validate = () => {
    const e = {};
    if (!form.vendor) e.vendor = 'Vendor is required.';
    if (!form.warehouse) e.warehouse = 'Warehouse is required.';
    if (!form.expectedDelivery) e.expectedDelivery = 'Expected delivery date is required.';
    if (!form.deliveryAddress) e.deliveryAddress = 'Delivery address is required.';
    form.items.forEach((it, i) => {
      if (!it.product) e[`item_${i}_product`] = 'Product is required.';
      if (!(parseFloat(it.qty) > 0)) e[`item_${i}_qty`] = 'Qty must be greater than 0.';
      if (!(parseFloat(it.unitPrice) >= 0)) e[`item_${i}_unitPrice`] = 'Unit price must be 0 or greater.';
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
      if (isEditing) {
        addNotification('Purchase order updated successfully.', 'success');
      } else {
        addNotification('Purchase order created successfully.', 'success');
      }
      localStorage.removeItem('po_draft');
      setIsEditing(false);
      setEditingId(null);
      setActiveTab('erp_purchase_orders');
    } catch (err) {
      addNotification('Failed to save purchase order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveTab('erp_purchase_orders');

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const inputWithError = (k) => ({ ...inputStyle, border: errors[k] || liveErrors[k] ? `1px solid ${dangerColor}` : inputStyle.border });
  const selectStyle = inputStyle;

  const subtotal = form.items.reduce((acc, it) => acc + (parseFloat(it.qty) || 0) * (parseFloat(it.unitPrice) || 0), 0);
  const totalDiscount = form.items.reduce((acc, it) => acc + (parseFloat(it.discount) || 0), 0);
  const net = subtotal - totalDiscount;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`.po-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .po-pulse{animation:pop 2s ease-in-out 1;} @keyframes pop{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.po-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}><FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} /></button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>PURCHASING / ERP</span>
                {draftSaved && <span className="po-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{isEditing ? 'Edit Purchase Order' : 'New Purchase Order'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>{isEditing ? 'Update the purchase order details and itemized pricing.' : 'Generate a binding purchase order to a supplier with itemized pricing, discounts, and delivery terms.'}</p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={faSave} /> Save Draft</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={submitting ? faSync : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : isEditing ? 'Update Purchase Order' : 'Save & Dispatch Purchase Order'}</button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}><FontAwesomeIcon icon={faXmark} /> Cancel</button>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Save</span>
        </div>
        <div className="row g-3 po-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faFileInvoice} style={{ color: '#6366f1', fontSize: '1rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Order Details</h2>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Supplier Vendor *</label>
                  <select className="po-input" style={inputWithError('vendor')} value={form.vendor} onChange={(e) => set('vendor', e.target.value)}>
                    <option value="Oscorp Tech">Oscorp Tech</option>
                    <option value="Stark Ind.">Stark Ind.</option>
                    <option value="Hammer Industries">Hammer Industries</option>
                    <option value="Rand Enterprises">Rand Enterprises</option>
                  </select>
                  {(errors.vendor || liveErrors.vendor) && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.vendor || liveErrors.vendor}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Warehouse *</label>
                  <input className="po-input" style={inputWithError('warehouse')} value={form.warehouse} onChange={(e) => set('warehouse', e.target.value)} placeholder="Warehouse" />
                  {(errors.warehouse || liveErrors.warehouse) && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.warehouse || liveErrors.warehouse}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Project Initiative</label>
                  <input className="po-input" style={inputStyle} value={form.project} onChange={(e) => set('project', e.target.value)} placeholder="Project" />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Expected Delivery Date *</label>
                  <input className="po-input" type="date" style={inputWithError('expectedDelivery')} value={form.expectedDelivery} onChange={(e) => set('expectedDelivery', e.target.value)} />
                  {(errors.expectedDelivery || liveErrors.expectedDelivery) && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.expectedDelivery || liveErrors.expectedDelivery}</div>}
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Payment Terms</label>
                  <select className="po-input" style={selectStyle} value={form.paymentTerms} onChange={(e) => set('paymentTerms', e.target.value)}>
                    <option value="NET 15">NET 15</option>
                    <option value="NET 30">NET 30</option>
                    <option value="NET 45">NET 45</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Shipping Method</label>
                  <input className="po-input" style={inputStyle} value={form.shippingMethod} onChange={(e) => set('shippingMethod', e.target.value)} placeholder="Shipping method" />
                </div>
                <div className="col-12">
                  <label style={labelStyle}>Delivery Destination Address *</label>
                  <input className="po-input" style={inputWithError('deliveryAddress')} value={form.deliveryAddress} onChange={(e) => set('deliveryAddress', e.target.value)} placeholder="Delivery address" />
                  {(errors.deliveryAddress || liveErrors.deliveryAddress) && <div style={{ color: dangerColor, fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.deliveryAddress || liveErrors.deliveryAddress}</div>}
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faClipboardList} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>PO Product Line Items</h2>
                </div>
                <button onClick={addItemRow} className="btn btn-sm d-flex align-items-center gap-1 border-0 text-white" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}><FontAwesomeIcon icon={faPlus} /> Add Line</button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="table mb-0" style={{ color: textColor, fontSize: '0.78rem', minWidth: 600 }}>
                  <thead>
                    <tr style={{ color: mutedColor, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.03em' }}>
                      <th style={{ fontWeight: 600 }}>Product *</th>
                      <th style={{ fontWeight: 600 }}>Description</th>
                      <th style={{ fontWeight: 600, width: 80 }}>Qty *</th>
                      <th style={{ fontWeight: 600, width: 110 }}>Unit Price *</th>
                      <th style={{ fontWeight: 600, width: 90 }}>Discount</th>
                      <th style={{ fontWeight: 600, width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          <input className="po-input" style={inputWithError(`item_${idx}_product`)} value={it.product} onChange={(e) => updateItem(idx, 'product', e.target.value)} placeholder="Product" />
                          {(errors[`item_${idx}_product`] || liveErrors[`item_${idx}_product`]) && <div style={{ color: dangerColor, fontSize: '0.65rem', marginTop: '0.2rem' }}>{errors[`item_${idx}_product`] || liveErrors[`item_${idx}_product`]}</div>}
                        </td>
                        <td><input className="po-input" style={inputStyle} value={it.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="Description" /></td>
                        <td>
                          <input className="po-input" type="number" style={inputWithError(`item_${idx}_qty`)} value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
                          {(errors[`item_${idx}_qty`] || liveErrors[`item_${idx}_qty`]) && <div style={{ color: dangerColor, fontSize: '0.65rem', marginTop: '0.2rem' }}>{errors[`item_${idx}_qty`] || liveErrors[`item_${idx}_qty`]}</div>}
                        </td>
                        <td>
                          <input className="po-input" type="number" style={inputWithError(`item_${idx}_unitPrice`)} value={it.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)} />
                          {(errors[`item_${idx}_unitPrice`] || liveErrors[`item_${idx}_unitPrice`]) && <div style={{ color: dangerColor, fontSize: '0.65rem', marginTop: '0.2rem' }}>{errors[`item_${idx}_unitPrice`] || liveErrors[`item_${idx}_unitPrice`]}</div>}
                        </td>
                        <td><input className="po-input" type="number" style={inputStyle} value={it.discount} onChange={(e) => updateItem(idx, 'discount', e.target.value)} /></td>
                        <td>
                          <button onClick={() => removeItemRow(idx)} disabled={form.items.length <= 1} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 30, height: 30, borderRadius: '8px', background: isDark ? '#2d3248' : '#fee2e2', color: dangerColor, opacity: form.items.length <= 1 ? 0.4 : 1, cursor: form.items.length <= 1 ? 'not-allowed' : 'pointer' }}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faClipboardList} style={{ color: '#6366f1', fontSize: '1rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>PO Summary</h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: mutedColor }}>Line Items</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: textColor }}>{form.items.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: mutedColor }}>Subtotal</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: textColor }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: mutedColor }}>Total Discount</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: dangerColor }}>${totalDiscount.toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: borderColor, margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor }}>Net Total</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: successColor }}>${net.toFixed(2)}</span>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faTruck} style={{ color: '#6366f1', fontSize: '1rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Logistics</h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: mutedColor }}>Shipping Method</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: textColor }}>{form.shippingMethod || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: mutedColor }}>Payment Terms</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: textColor }}>{form.paymentTerms || '—'}</span>
              </div>
              <div className="d-flex align-items-start gap-2" style={{ background: warningBg, color: warningColor, padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', lineHeight: 1.4 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginTop: '2px' }} />
                <span>PO transmits to supplier portal upon dispatch and updates the committed spend register.</span>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '1rem' }} />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, margin: 0 }}>Compliance</h2>
              </div>
              <p style={{ fontSize: '0.72rem', color: mutedColor, margin: 0, lineHeight: 1.4 }}>All purchase orders are validated against budget limits and require finance approval when net total exceeds the delegated threshold.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreatePurchaseOrder;
