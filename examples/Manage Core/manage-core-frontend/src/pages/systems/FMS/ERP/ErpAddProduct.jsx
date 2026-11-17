import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faSave, faCheckCircle, faXmark, faKeyboard,
  faBoxOpen, faHashtag, faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { createProduct, listProductCategories, listUoms } from '../../../../api/fms';

const empty = {
  product_code: '', name: '', sku: '', ean: '', category_id: '', material_type: '',
  purchase_cost: '', sales_price: '', initial_stock: '', min_stock: '', max_stock: '',
  reorder_point: '', warehouse: '', bin_location: '', costing_method: '', abc_class: '', status: 'active',
};

const ErpAddProduct = () => {
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
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
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
    listProductCategories().then(res => setCategories(res.data?.data || res.data || [])).catch(() => {});
    listUoms().then(res => setUoms(res.data?.data || res.data || [])).catch(() => {});
    const saved = localStorage.getItem('product_draft');
    if (saved) { try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('product_draft', JSON.stringify(form)), 1000);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateLive = () => {
    const e = {};
    if (!form.product_code) e.product_code = 'Product code is required.';
    if (!form.name) e.name = 'Name is required.';
    setLiveErrors(e);
    return Object.keys(e).length === 0;
  };
  useEffect(() => { const t = setTimeout(validateLive, 500); return () => clearTimeout(t); }, [form]);

  const handleSaveDraft = () => {
    localStorage.setItem('product_draft', JSON.stringify(form));
    setDraftSaved(true); setTimeout(() => setDraftSaved(false), 3000);
    addNotification('Product draft saved.', 'info');
  };
  const validate = () => {
    const e = {};
    if (!form.product_code) e.product_code = 'Product code is required.';
    if (!form.name) e.name = 'Name is required.';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) { addNotification('Please fix the highlighted fields.', 'warning'); return; }
    setSubmitting(true);
    try {
      const res = await createProduct({
        ...form,
        category_id: form.category_id || null,
        purchase_cost: form.purchase_cost || 0,
        sales_price: form.sales_price || 0,
        initial_stock: form.initial_stock || 0,
        min_stock: form.min_stock || 0,
        max_stock: form.max_stock || 0,
        reorder_point: form.reorder_point || 0,
      });
      const createdProduct = res?.data?.data;
      if (createdProduct) {
        localStorage.setItem('product_pending_created', JSON.stringify(createdProduct));
      }
      addNotification('Product created successfully.', 'success');
      localStorage.removeItem('product_draft');
      setActiveTab('erp_products');
      // Dispatch refresh event multiple times to ensure product list picks up the new item (race with mount/backend)
      try { window.dispatchEvent(new CustomEvent('erp:refresh', { detail: { source: 'erp_add_product' } })); } catch (e) { }
      setTimeout(() => { try { window.dispatchEvent(new CustomEvent('erp:refresh', { detail: { source: 'erp_add_product' } })); } catch (e) { } }, 800);
      // Also trigger a global minor refresh flag in case components listen for it
      try { window.dispatchEvent(new CustomEvent('app:minor-refresh')); } catch (e) { }
    } catch (err) {
      addNotification(err.data?.message || err.message || 'Failed to create product.', 'error');
    } finally { setSubmitting(false); }
  };
  const handleBack = () => setActiveTab('erp_products');
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
      <style>{`.pr-input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);} .pr-pulse{animation:prp 2s ease-in-out 1;} @keyframes prp{0%{opacity:1}50%{opacity:.6}100%{opacity:1}} @media(max-width:768px){.pr-responsive{grid-template-columns:1fr!important;}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}` }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>INVENTORY / PRODUCT</span>
                {draftSaved && <span className="pr-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>New Product</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                Add a stockable or service item with costing and replenishment rules.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraft} className="btn btn-sm d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white" style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSave : faCheckCircle} spin={submitting} /> {submitting ? 'Saving...' : 'Save Product'}
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

        <div className="row g-3 pr-responsive">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBoxOpen} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Product Information</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Product Code *</label>
                  <input className="pr-input" style={inputWithError('product_code')} placeholder="e.g. PRD-001" value={form.product_code} onChange={e => set('product_code', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Name *</label>
                  <input className="pr-input" style={inputWithError('name')} placeholder="e.g. Steel Bolt M8" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>SKU</label>
                  <input className="pr-input" style={inputStyle} placeholder="SKU" value={form.sku} onChange={e => set('sku', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>EAN</label>
                  <input className="pr-input" style={inputStyle} placeholder="EAN / Barcode" value={form.ean} onChange={e => set('ean', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Category</label>
                  <select className="pr-input" style={inputStyle} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Material Type</label>
                  <input className="pr-input" style={inputStyle} placeholder="e.g. Raw, Finished" value={form.material_type} onChange={e => set('material_type', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Purchase Cost</label>
                  <input type="number" className="pr-input" style={inputStyle} placeholder="0.00" value={form.purchase_cost} onChange={e => set('purchase_cost', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Sales Price</label>
                  <input type="number" className="pr-input" style={inputStyle} placeholder="0.00" value={form.sales_price} onChange={e => set('sales_price', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Initial Stock</label>
                  <input type="number" className="pr-input" style={inputStyle} placeholder="0" value={form.initial_stock} onChange={e => set('initial_stock', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Min Stock</label>
                  <input type="number" className="pr-input" style={inputStyle} placeholder="0" value={form.min_stock} onChange={e => set('min_stock', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label style={labelStyle}>Max Stock</label>
                  <input type="number" className="pr-input" style={inputStyle} placeholder="0" value={form.max_stock} onChange={e => set('max_stock', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Reorder Point</label>
                  <input type="number" className="pr-input" style={inputStyle} placeholder="0" value={form.reorder_point} onChange={e => set('reorder_point', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Warehouse</label>
                  <input className="pr-input" style={inputStyle} placeholder="Warehouse name" value={form.warehouse} onChange={e => set('warehouse', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Bin Location</label>
                  <input className="pr-input" style={inputStyle} placeholder="e.g. A-12-3" value={form.bin_location} onChange={e => set('bin_location', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Costing Method</label>
                  <input className="pr-input" style={inputStyle} placeholder="e.g. FIFO" value={form.costing_method} onChange={e => set('costing_method', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>ABC Class</label>
                  <select className="pr-input" style={inputStyle} value={form.abc_class} onChange={e => set('abc_class', e.target.value)}>
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Status</label>
                  <select className="pr-input" style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Code</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.product_code || '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.7rem', color: mutedColor }}>Name</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{form.name || '—'}</span>
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Compliance</h6>
              </div>
              <div style={{ fontSize: '0.72rem', color: mutedColor }}>
                Accurate costing and reorder points drive valuation and procurement suggestions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddProduct;
