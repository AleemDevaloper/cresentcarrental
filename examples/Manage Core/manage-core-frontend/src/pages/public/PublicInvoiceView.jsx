import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faLinkSlash, faClock, faTriangleExclamation,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
import { getPublicSalesInvoice } from '../../api/fms';

const STATUS_COLORS = {
  Paid: { bg: '#dcfce7', color: '#16a34a' },
  Sent: { bg: '#e0f2fe', color: '#0284c7' },
};

const PublicInvoiceView = () => {
  const { token } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPublicSalesInvoice(token);
        setInvoice(res.data?.invoice || null);
      } catch (err) {
        setError(err.message || 'Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const amountNumber = (value) => parseFloat(String(value || '').replace(/[^0-9.-]/g, '')) || 0;
  const formatMoney = (value) => {
    const n = amountNumber(value);
    return `${invoice?.currency || 'USD'} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={pageStyle}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#6366f1' }} role="status" />
          <p style={{ ...mutedText }}>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isExpired = error.toLowerCase().includes('expired');
    const Icon = isExpired ? faClock : error.toLowerCase().includes('revoked') ? faLinkSlash : faTriangleExclamation;
    return (
      <div style={pageStyle}>
        <div className="card shadow-sm border-0 mx-auto text-center" style={{ maxWidth: 420, borderRadius: 18 }}>
          <div className="card-body p-5">
            <FontAwesomeIcon icon={Icon} size="2x" style={{ color: '#ef4444', marginBottom: 16 }} />
            <h5 className="fw-bold mb-2">Invoice unavailable</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const subtotal = amountNumber(invoice.amount);
  const statusColors = STATUS_COLORS[invoice.status] || { bg: '#fef3c7', color: '#d97706' };

  return (
    <div style={{ ...pageStyle }}>
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } }`}</style>

      <div className="no-print d-flex justify-content-end mb-3" style={{ maxWidth: 760, margin: '0 auto 18px', width: '100%' }}>
        <button onClick={handlePrint} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3"
          style={{ borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.78rem' }}>
          <FontAwesomeIcon icon={faPrint} /> Print / Save PDF
        </button>
      </div>

      <section className="card shadow-lg border-0" style={{ maxWidth: 760, width: '100%', margin: '0 auto', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h5 style={{ margin: 0, fontWeight: 800 }}><FontAwesomeIcon icon={faFileInvoice} className="me-2" />ManageCore</h5>
            <div style={{ opacity: 0.85, fontSize: '0.72rem', marginTop: 4 }}>Corporate Invoicing &mdash; Accounting System (AMS)</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, fontWeight: 800, letterSpacing: '0.04em', fontSize: '1.3rem' }}>INVOICE</h3>
            <div style={{ opacity: 0.85, fontSize: '0.78rem' }}>{invoice.number}</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{formatMoney(subtotal)}</div>
          </div>
        </div>

        <div className="card-body" style={{ padding: '24px 28px' }}>
          <div className="row g-3 mb-4">
            <div className="col-md-4 col-12">
              <small style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill To</small>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{invoice.customer}</div>
            </div>
            <div className="col-md-4 col-6">
              <small style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue Date</small>
              <div style={{ fontSize: '0.9rem' }}>{invoice.date}</div>
            </div>
            <div className="col-md-4 col-6">
              <small style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</small>
              <div style={{ fontSize: '0.9rem' }}>{invoice.due}</div>
            </div>
          </div>

          <table className="table table-sm" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #6366f1' }}>
                <th>Description</th>
                <th className="text-end">Items</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Goods and services billed on this invoice ({invoice.billingMethod})</td>
                <td className="text-end">{invoice.items ?? 1}</td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex justify-content-end mb-3">
            <div style={{ width: 260, fontSize: '0.82rem' }}>
              <div className="d-flex justify-content-between" style={{ padding: '8px 0', borderTop: '1px solid #e2e8f0', color: '#6366f1', fontSize: '0.95rem' }}>
                <span>Total Due</span><strong>{formatMoney(subtotal)}</strong>
              </div>
            </div>
          </div>

          <div className="text-center pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
            <span className="d-inline-flex align-items-center gap-1 px-3 py-1"
              style={{ fontSize: '0.75rem', borderRadius: 20, background: statusColors.bg, color: statusColors.color }}>
              Status: <strong>{invoice.status}</strong>
            </span>
            <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.7rem' }}>
              This invoice was shared securely via ManageCore AMS.
            </p>
          </div>
        </div>
      </section>

      <p className="no-print text-center mt-4" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
        Powered by ManageCore &mdash; Manage Core Corporate Suite
      </p>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  background: '#f1f5f9',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  color: '#1e293b',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '32px 16px',
};

const mutedText = { color: '#64748b', marginTop: 12, fontSize: '0.85rem' };

export default PublicInvoiceView;
