import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faUserTie, faClipboardList, faTruckRampBox,
  faStickyNote, faFileSignature, faFileAlt, faCoins, faReceipt,
  faLinkSlash, faClock, faTriangleExclamation, faPrint,
  faBuilding, faEnvelope, faPhone, faGlobe, faMapMarkerAlt, faUserCheck, faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { getPublicEntity } from '../../api/publicShare';

const STATUS_COLORS = {
  Paid: { bg: '#dcfce7', color: '#16a34a' },
  Sent: { bg: '#e0f2fe', color: '#0284c7' },
  Confirmed: { bg: '#dcfce7', color: '#16a34a' },
  Processing: { bg: '#fef3c7', color: '#d97706' },
  Draft: { bg: '#f1f5f9', color: '#475569' },
  Active: { bg: '#dcfce7', color: '#16a34a' },
  'Credit Hold': { bg: '#fee2e2', color: '#dc2626' },
  Accepted: { bg: '#dcfce7', color: '#16a34a' },
  Approved: { bg: '#dcfce7', color: '#16a34a' },
  Pending: { bg: '#fef3c7', color: '#d97706' },
};

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  padding: 'clamp(16px, 4vw, 40px) 16px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
};

const mutedText = { color: '#64748b', fontSize: '0.78rem' };

const formatMoney = (val, currency = 'USD') => {
  const n = parseFloat(String(val || '').replace(/[^0-9.-]/g, '')) || 0;
  return `${currency || 'USD'} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{ background: colors.bg, color: colors.color, padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {status || '—'}
    </span>
  );
};

const Header = ({ icon, title, subtitle, right, label }) => (
  <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
    <div>
      <h5 style={{ margin: 0, fontWeight: 800 }}><FontAwesomeIcon icon={icon} className="me-2" />ManageCore</h5>
      <div style={{ opacity: 0.85, fontSize: '0.72rem', marginTop: 4 }}>{subtitle}</div>
      {label && <div style={{ opacity: 0.95, fontSize: '0.85rem', marginTop: 6, fontWeight: 700 }}>{label}</div>}
    </div>
    {right}
  </div>
);

const KeyValue = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700 }}>{label}</div>
    <div style={{ color: '#1e293b', fontSize: '0.92rem', fontWeight: 600, marginTop: 2 }}>{value || '—'}</div>
  </div>
);

const Row = ({ k, v }) => (
  <tr>
    <td style={{ padding: '8px 0', color: '#475569', fontSize: '0.78rem', fontWeight: 600, width: '40%' }}>{k}</td>
    <td style={{ padding: '8px 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>{v || '—'}</td>
  </tr>
);

const DataTable = ({ columns, rows, empty }) => (
  <div className="table-responsive">
    <table className="table table-sm" style={{ marginBottom: 0 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {columns.map((c) => (
            <th key={c.key} style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', padding: '8px 12px', border: 'none' }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.78rem' }}>{empty || 'No records.'}</td></tr>
        )}
        {rows.map((row, i) => (
          <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
            {columns.map((c) => (
              <td key={c.key} style={{ padding: '10px 12px', fontSize: '0.82rem', color: '#1e293b' }}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Money = ({ value, currency }) => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatMoney(value, currency)}</span>;

const PublicSharedView = () => {
  const { entityType, token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPublicEntity(entityType, token);
        setData(res.data || res);
      } catch (err) {
        setError(err.message || 'Failed to load document.');
      } finally {
        setLoading(false);
      }
    })();
  }, [entityType, token]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#6366f1' }} role="status" />
          <p style={mutedText}>Loading…</p>
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
            <h5 className="fw-bold mb-2">Document unavailable</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const handlePrint = () => window.print();

  const renderBody = () => {
    switch (entityType) {
      case 'customer': {
        const c = data.customer || {};
        const totals = data.totals || {};
        return (
          <>
            <div className="card-body" style={{ padding: '24px 28px' }}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                  <h4 className="fw-bold mb-1">{c.name || c.company_name || 'Customer'}</h4>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{c.code} {c.email ? <span>&middot; {c.email}</span> : null}</div>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="row g-3">
                <div className="col-sm-6"><KeyValue label="Contact" value={c.contact || c.name} /></div>
                <div className="col-sm-6"><KeyValue label="Phone" value={c.phone} /></div>
                <div className="col-sm-6"><KeyValue label="Email" value={c.email} /></div>
                <div className="col-sm-6"><KeyValue label="Country" value={c.country} /></div>
                <div className="col-sm-6"><KeyValue label="Industry" value={c.industry} /></div>
                <div className="col-sm-6"><KeyValue label="Type" value={c.type} /></div>
                <div className="col-12"><KeyValue label="Address" value={c.address} /></div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <h6 className="fw-bold mt-2 mb-3">Account Summary</h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4" style={{ background: '#eef2ff' }}>
                    <div style={{ fontSize: '0.7rem', color: '#4338ca', fontWeight: 700, textTransform: 'uppercase' }}>Quotations</div>
                    <div className="h4 fw-black mb-0" style={{ color: '#3730a3' }}>{totals.quotations_count ?? 0}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4" style={{ background: '#ecfeff' }}>
                    <div style={{ fontSize: '0.7rem', color: '#0e7490', fontWeight: 700, textTransform: 'uppercase' }}>Sales Orders</div>
                    <div className="h4 fw-black mb-0" style={{ color: '#155e75' }}>{totals.orders_count ?? 0}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4" style={{ background: '#f0fdf4' }}>
                    <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Invoices</div>
                    <div className="h4 fw-black mb-0" style={{ color: '#166534' }}>{totals.invoices_count ?? 0}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-4" style={{ background: '#fff7ed' }}>
                    <div style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: 700, textTransform: 'uppercase' }}>Outstanding</div>
                    <div className="h4 fw-black mb-0" style={{ color: '#9a3412' }}>{formatMoney(totals.outstanding || 0, c.currency || 'USD')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <h6 className="fw-bold mt-2 mb-2">Recent Invoices</h6>
              <DataTable
                columns={[
                  { key: 'number', label: 'Number' },
                  { key: 'date', label: 'Date' },
                  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                  { key: 'amount', label: 'Amount', render: (r) => <Money value={r.amount} currency={r.currency} /> },
                ]}
                rows={data.invoices || []}
                empty="No invoices on file."
              />
            </div>
            <div className="px-4 pb-4">
              <h6 className="fw-bold mt-2 mb-2">Sales Orders</h6>
              <DataTable
                columns={[
                  { key: 'number', label: 'Number' },
                  { key: 'date', label: 'Date' },
                  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                  { key: 'amount', label: 'Amount', render: (r) => <Money value={r.amount} currency={r.currency} /> },
                ]}
                rows={data.orders || []}
                empty="No sales orders on file."
              />
            </div>
          </>
        );
      }

      case 'sales_invoice': {
        const inv = data.invoice || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3 mb-3">
              <div className="col-sm-6"><KeyValue label="Invoice Number" value={inv.number} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={inv.status} />} /></div>
              <div className="col-sm-6"><KeyValue label="Customer" value={inv.customer} /></div>
              <div className="col-sm-6"><KeyValue label="Date" value={inv.date} /></div>
              <div className="col-sm-6"><KeyValue label="Due Date" value={inv.dueDate} /></div>
              <div className="col-sm-6"><KeyValue label="Sales Person" value={inv.salesPerson} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#eef2ff', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#4338ca', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total</div>
                <div className="h3 fw-black mb-0" style={{ color: '#3730a3' }}>{formatMoney(inv.amount, inv.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'sales_order': {
        const r = data.sales_order || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3">
              <div className="col-sm-6"><KeyValue label="Order Number" value={r.number} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={r.status} />} /></div>
              <div className="col-sm-6"><KeyValue label="Customer" value={r.customer} /></div>
              <div className="col-sm-6"><KeyValue label="Order Date" value={r.date} /></div>
              <div className="col-sm-6"><KeyValue label="Delivery Date" value={r.deliveryDate} /></div>
              <div className="col-sm-6"><KeyValue label="Sales Person" value={r.salesPerson} /></div>
              <div className="col-sm-6"><KeyValue label="Items" value={r.items} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#ecfeff', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#0e7490', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total</div>
                <div className="h3 fw-black mb-0" style={{ color: '#155e75' }}>{formatMoney(r.amount, r.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'quotation': {
        const r = data.quotation || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3">
              <div className="col-sm-6"><KeyValue label="Quotation" value={r.number} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={r.status} />} /></div>
              <div className="col-sm-6"><KeyValue label="Customer" value={r.customer} /></div>
              <div className="col-sm-6"><KeyValue label="Date" value={r.date} /></div>
              <div className="col-sm-6"><KeyValue label="Valid Until" value={r.validUntil} /></div>
              <div className="col-sm-6"><KeyValue label="Items" value={r.items} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#fef3c7', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#92400e', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Quoted Total</div>
                <div className="h3 fw-black mb-0" style={{ color: '#78350f' }}>{formatMoney(r.amount, r.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'delivery_challan': {
        const r = data.delivery_challan || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3">
              <div className="col-sm-6"><KeyValue label="Challan" value={r.number} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={r.status} />} /></div>
              <div className="col-sm-6"><KeyValue label="Customer" value={r.customer} /></div>
              <div className="col-sm-6"><KeyValue label="Date" value={r.date} /></div>
              <div className="col-sm-6"><KeyValue label="Items" value={r.items} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#dbeafe', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#1d4ed8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Value</div>
                <div className="h3 fw-black mb-0" style={{ color: '#1e40af' }}>{formatMoney(r.amount, r.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'credit_note': {
        const r = data.credit_note || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3">
              <div className="col-sm-6"><KeyValue label="Credit Note" value={r.number} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={r.status} />} /></div>
              <div className="col-sm-6"><KeyValue label="Linked Invoice" value={r.linkedInvoice} /></div>
              <div className="col-sm-6"><KeyValue label="Customer" value={r.customer} /></div>
              <div className="col-sm-6"><KeyValue label="Date" value={r.date} /></div>
              <div className="col-sm-6"><KeyValue label="Reason" value={r.reason} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#fee2e2', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#b91c1c', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Credit Amount</div>
                <div className="h3 fw-black mb-0" style={{ color: '#7f1d1d' }}>{formatMoney(r.amount, r.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'customer_receipt': {
        const r = data.receipt || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3">
              <div className="col-sm-6"><KeyValue label="Receipt" value={r.number} /></div>
              <div className="col-sm-6"><KeyValue label="Customer" value={r.customer || r.client_name} /></div>
              <div className="col-sm-6"><KeyValue label="Invoice Ref" value={r.invoice_ref || r.invoiceRef} /></div>
              <div className="col-sm-6"><KeyValue label="Date" value={r.date} /></div>
              <div className="col-sm-6"><KeyValue label="Method" value={r.method} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={r.status} />} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#dcfce7', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#166534', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Amount Received</div>
                <div className="h3 fw-black mb-0" style={{ color: '#14532d' }}>{formatMoney(r.amount, r.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'vendor_payment': {
        const r = data.payment || {};
        return (
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div className="row g-3">
              <div className="col-sm-6"><KeyValue label="Payment" value={r.number} /></div>
              <div className="col-sm-6"><KeyValue label="Vendor" value={r.vendor} /></div>
              <div className="col-sm-6"><KeyValue label="Date" value={r.date} /></div>
              <div className="col-sm-6"><KeyValue label="Method" value={r.method} /></div>
              <div className="col-sm-6"><KeyValue label="Status" value={<StatusBadge status={r.status} />} /></div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <div className="p-3 rounded-4" style={{ background: '#ede9fe', minWidth: 220 }}>
                <div style={{ fontSize: '0.7rem', color: '#5b21b6', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Paid</div>
                <div className="h3 fw-black mb-0" style={{ color: '#4c1d95' }}>{formatMoney(r.amount, r.currency)}</div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return <div className="card-body">Unsupported entity type.</div>;
    }
  };

  const meta = {
    customer: { icon: faUserTie, subtitle: 'Customer Profile & Ledger', label: data?.customer?.name || data?.customer?.company_name },
    sales_invoice: { icon: faFileInvoice, subtitle: 'Sales Invoice', label: data?.invoice?.number },
    sales_order: { icon: faClipboardList, subtitle: 'Sales Order', label: data?.sales_order?.number },
    quotation: { icon: faFileAlt, subtitle: 'Quotation', label: data?.quotation?.number },
    delivery_challan: { icon: faTruckRampBox, subtitle: 'Delivery Challan', label: data?.delivery_challan?.number },
    credit_note: { icon: faStickyNote, subtitle: 'Credit Note', label: data?.credit_note?.number },
    customer_receipt: { icon: faCoins, subtitle: 'Customer Receipt', label: data?.receipt?.number },
    vendor_payment: { icon: faReceipt, subtitle: 'Vendor Payment', label: data?.payment?.number },
  }[entityType] || { icon: faFileAlt, subtitle: 'Document', label: '' };

  return (
    <div style={pageStyle}>
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff !important; } }`}</style>
      <div className="no-print d-flex justify-content-end mb-3" style={{ maxWidth: 760, margin: '0 auto 18px', width: '100%' }}>
        <button onClick={handlePrint} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3"
          style={{ borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.78rem' }}>
          <FontAwesomeIcon icon={faPrint} /> Print / Save PDF
        </button>
      </div>
      <section className="card shadow-lg border-0" style={{ maxWidth: 760, width: '100%', margin: '0 auto', borderRadius: 14, overflow: 'hidden' }}>
        <Header icon={meta.icon} title={meta.subtitle} subtitle="ManageCore &middot; Public Document" label={meta.label} />
        {renderBody()}
        <div className="text-center small text-muted py-3" style={{ background: '#f8fafc' }}>
          Powered by ManageCore &middot; shared securely via token &middot; views: {data?.views ?? 0}
        </div>
      </section>
    </div>
  );
};

export default PublicSharedView;
