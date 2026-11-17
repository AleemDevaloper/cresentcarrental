import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faWarehouse, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

const empty = { product: '', warehouse: '', type: 'Purchase Receipt', qty: 0, cost: 0 };

const ErpAddStockMovement = () => {
  const { theme, addNotification, setActiveTab, editDocument, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [form, setForm] = useState(empty);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'stock_movement') {
      const d = editDocument;
      setForm({ product: d.product || '', warehouse: d.warehouse || '', type: d.type || 'Purchase Receipt', qty: d.qty || 0, cost: d.cost || 0 });
      setIsEditing(true);
      setEditDocument(null);
    }
  }, [editDocument]);

  const handleBack = () => setActiveTab('erp_stock_movements');

  const handleSave = () => {
    if (!form.product || !form.warehouse) { addNotification('Product and Warehouse are required.', 'warning'); return; }
    setSubmitting(true);
    const total = Number(form.qty) * Number(form.cost);
    setTimeout(() => {
      if (isEditing) {
        // emit updated
        window.dispatchEvent(new CustomEvent('erp:movement:updated', { detail: { ...form, total, id: editDocument?.id } }));
        addNotification('Stock movement updated.', 'success');
      } else {
        window.dispatchEvent(new CustomEvent('erp:movement:created', { detail: { ...form, total } }));
        addNotification('Stock movement created.', 'success');
      }
      setSubmitting(false);
      setActiveTab('erp_stock_movements');
    }, 300);
  };

  return (
    <div style={{ padding: '1.25rem', minHeight: '100vh', background: isDark ? '#0b0f1a' : '#fbfdff' }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <button onClick={handleBack} className="btn btn-sm border-0" style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? '#11121a' : '#fff', border: `1px solid ${borderColor}`, color: textColor }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 700, letterSpacing: '0.06em' }}>INVENTORY / MOVEMENT</div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: textColor }}>{isEditing ? 'Edit Stock Movement' : 'Add Stock Movement'}</h2>
            <p style={{ margin: 0, color: mutedColor, fontSize: '0.85rem' }}>Create or adjust material movements across warehouses.</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-light" onClick={() => addNotification('Draft saved.', 'info')}>Save Draft</button>
          <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={submitting}><FontAwesomeIcon icon={faSave} /> {submitting ? 'Saving...' : (isEditing ? 'Update Movement' : 'Add Movement')}</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100 }}>
        <div style={{ background: isDark ? '#11121a' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 12, padding: '1rem' }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.75rem', color: mutedColor }}>Product</label>
              <input className="form-control form-control-sm" value={form.product} onChange={e => setForm(s => ({ ...s, product: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.75rem', color: mutedColor }}>Warehouse</label>
              <input className="form-control form-control-sm" value={form.warehouse} onChange={e => setForm(s => ({ ...s, warehouse: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <label style={{ display: 'block', fontSize: '0.75rem', color: mutedColor }}>Type</label>
              <select className="form-select form-select-sm" value={form.type} onChange={e => setForm(s => ({ ...s, type: e.target.value }))}>
                <option>Purchase Receipt</option>
                <option>Sales Delivery</option>
                <option>Internal Transfer</option>
                <option>Stock Adjustment</option>
              </select>
            </div>
            <div className="col-md-4">
              <label style={{ display: 'block', fontSize: '0.75rem', color: mutedColor }}>Quantity</label>
              <input type="number" className="form-control form-control-sm" value={form.qty} onChange={e => setForm(s => ({ ...s, qty: Number(e.target.value) }))} />
            </div>
            <div className="col-md-4">
              <label style={{ display: 'block', fontSize: '0.75rem', color: mutedColor }}>Unit Cost</label>
              <input type="number" className="form-control form-control-sm" value={form.cost} onChange={e => setForm(s => ({ ...s, cost: Number(e.target.value) }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpAddStockMovement;
