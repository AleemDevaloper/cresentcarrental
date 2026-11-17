import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, Loader2, RefreshCw, Search, X } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const statuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];
const payments = ['Payment Pending', 'Partially Paid', 'Paid', 'Refunded'];
const money = (value) => `PKR ${Number(value || 0).toLocaleString()}`;

function formatDate(value) {
  return value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}

export default function AdminBookingsPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.get('/admin/bookings', { params: { search: query || undefined, status: statusFilter || undefined, payment_status: paymentFilter || undefined } })
      .then((response) => setRows(response.data.data || []))
      .catch((requestError) => setError(requestError.userMessage || 'Bookings could not be loaded.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter, paymentFilter]);

  const openBooking = async (booking) => {
    setSelected(booking);
    setDraft({ ...booking, note: '' });
    setTimeline([]);
    try {
      const response = await api.get(`/admin/bookings/${booking.id}/timeline`);
      setTimeline(response.data.data || []);
    } catch (requestError) {
      setError(requestError.userMessage || 'Booking timeline could not be loaded.');
    }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!draft || saving) return;
    setSaving(true);
    setError('');
    try {
      const response = await api.patch(`/admin/bookings/${draft.id}`, draft);
      const updated = response.data.data || response.data;
      setSelected(updated);
      setDraft({ ...updated, note: '' });
      const history = await api.get(`/admin/bookings/${draft.id}/timeline`);
      setTimeline(history.data.data || []);
      load();
    } catch (requestError) {
      setError(requestError.userMessage || 'Booking could not be updated.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-page-title">
        <div><span className="eyebrow">Rental operations</span><h1>Bookings</h1><p>Search, review, update and complete every booking lifecycle step.</p></div>
        <Button variant="ghost" onClick={load} disabled={loading}><RefreshCw size={15} /> Refresh</Button>
      </div>
      {error && <div className="admin-banner admin-banner-error" role="alert">{error}</div>}
      <div className="admin-table-panel">
        <div className="table-tools admin-filter-tools">
          <div className="admin-search"><Search size={16} /><input placeholder="Reference, customer, phone or vehicle…" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} /></div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
          <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}><option value="">All payments</option>{payments.map((payment) => <option key={payment}>{payment}</option>)}</select>
          <Button variant="dark" onClick={load}>Search</Button>
        </div>
        {loading ? <div className="admin-loading"><Loader2 className="admin-spin" size={28} /><p>Loading bookings…</p></div> : (
          <div className="table-responsive"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Pickup</th><th>Return</th><th>Amount</th><th>Status</th><th>Payment</th><th /></tr></thead><tbody>
            {rows.map((booking) => <tr key={booking.id}><td><strong>{booking.reference}</strong><small>{formatDate(booking.created_at)}</small></td><td>{booking.customer?.full_name || '—'}<small>{booking.customer?.phone || ''}</small></td><td>{booking.vehicle?.name || '—'}</td><td>{formatDate(booking.pickup_at)}</td><td>{formatDate(booking.return_at)}</td><td>{money(booking.total_price)}</td><td><span className={`status status-${String(booking.status).toLowerCase().replaceAll(' ', '-')}`}>{booking.status}</span></td><td><span className="status status-payment">{booking.payment_status}</span></td><td><button className="table-link" type="button" onClick={() => openBooking(booking)}><Eye size={14} /> View</button></td></tr>)}
            {!rows.length && <tr><td colSpan="9"><div className="admin-empty-state">No bookings match your filters.</div></td></tr>}
          </tbody></table></div>
        )}
      </div>
      {draft && <div className="drawer-backdrop" onClick={() => setDraft(null)}><form className="admin-drawer admin-booking-drawer" onSubmit={save} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head"><div><span className="eyebrow">Booking workspace</span><h2>{draft.reference}</h2><p>{draft.customer?.full_name} · {draft.vehicle?.name}</p></div><button type="button" aria-label="Close booking" onClick={() => setDraft(null)}><X size={18} /></button></div>
        <div className="admin-detail-grid"><div><span>Pickup</span><strong>{formatDate(draft.pickup_at)}</strong></div><div><span>Return</span><strong>{formatDate(draft.return_at)}</strong></div><div><span>Total</span><strong>{money(draft.total_price)}</strong></div><div><span>Deposit</span><strong>{money(draft.deposit)}</strong></div></div>
        <label className="admin-field"><span>Booking status</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="admin-field"><span>Payment status</span><select value={draft.payment_status || ''} onChange={(event) => setDraft({ ...draft, payment_status: event.target.value })}>{payments.map((payment) => <option key={payment}>{payment}</option>)}</select></label>
        <label className="admin-field"><span>Operation note</span><textarea rows="3" value={draft.note || ''} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="Add a note for this status change" /></label>
        <label className="admin-field"><span>Internal notes</span><textarea rows="4" value={draft.admin_notes || ''} onChange={(event) => setDraft({ ...draft, admin_notes: event.target.value })} /></label>
        <div className="admin-timeline"><h3>Booking timeline</h3>{timeline.map((item) => <div key={item.id}><span className="timeline-dot" /><div><strong>{item.to_status}</strong><small>{formatDate(item.created_at)} · {item.admin?.name || 'System'}{item.note ? ` · ${item.note}` : ''}</small></div></div>)}{!timeline.length && <p className="muted">No timeline entries.</p>}</div>
        <Button type="submit" variant="red" fullWidth loading={saving}><CheckCircle2 size={16} /> Save booking changes</Button>
      </form></div>}
    </>
  );
}
