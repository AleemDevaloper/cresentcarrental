import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowUpRight, CalendarCheck, Car, CheckCircle2, Clock3,
  DollarSign, MessageSquare, RefreshCw, Users, WalletCards,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const money = (value) => `PKR ${Number(value || 0).toLocaleString()}`;

function KpiCard({ label, value, note, icon: Icon, tone, trend }) {
  return (
    <article className={`admin-kpi-card admin-kpi-${tone}`}>
      <div className="admin-kpi-top">
        <span className="admin-kpi-icon"><Icon size={18} /></span>
        {trend && <span className="admin-kpi-trend"><ArrowUpRight size={13} /> {trend}</span>}
      </div>
      <strong>{value}</strong>
      <span className="admin-kpi-label">{label}</span>
      <small>{note}</small>
    </article>
  );
}

function RevenueChart({ data }) {
  const values = data.map((item) => Number(item.revenue || 0));
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${100 - (value / max) * 82}`).join(' ');
  return (
    <div className="admin-line-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Revenue trend chart">
        <defs><linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ed1111" stopOpacity=".28" /><stop offset="100%" stopColor="#ed1111" stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#revenue-fill)" />
        <polyline points={points} fill="none" stroke="#ed1111" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="admin-chart-labels">{data.map((item) => <span key={item.period || item.month}>{item.month}</span>)}</div>
    </div>
  );
}

function StatusChart({ data }) {
  const total = data.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const colors = ['#ed1111', '#f59e0b', '#16a34a', '#2563eb', '#7c3aed', '#64748b'];
  let offset = 0;
  const segments = data.map((item, index) => {
    const value = total ? (Number(item.total) / total) * 100 : 0;
    const segment = `${colors[index % colors.length]} ${offset}% ${offset + value}%`;
    offset += value;
    return { ...item, color: colors[index % colors.length], segment };
  });
  return (
    <div className="admin-status-chart-wrap">
      <div className="admin-donut" style={{ background: `conic-gradient(${segments.map((item) => item.segment).join(', ') || '#e5e7eb 0 100%'})` }}><div><strong>{total}</strong><small>bookings</small></div></div>
      <div className="admin-legend">{segments.map((item) => <div key={item.status}><span style={{ background: item.color }} /><b>{item.status}</b><em>{item.total}</em></div>)}{!segments.length && <small className="muted">No booking data yet.</small>}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => {
    setLoading(true);
    setError('');
    api.get('/admin/dashboard').then((response) => setDashboard(response.data.data || response.data)).catch((requestError) => setError(requestError.userMessage || 'Dashboard data could not be loaded.')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const stats = dashboard?.stats || {};
  const monthly = dashboard?.monthly_performance || [];
  const fleetTotal = Number(stats.total_vehicles || 0);
  const fleetAvailable = Number(stats.available_vehicles || 0);
  const utilization = Number(stats.fleet_utilization || 0);
  const fleetBars = useMemo(() => (dashboard?.fleet_statuses || []).map((item) => ({ ...item, percent: fleetTotal ? Math.max(4, (Number(item.total) / fleetTotal) * 100) : 4 })), [dashboard, fleetTotal]);

  return (
    <>
      <div className="admin-page-title admin-dashboard-heading"><div><span className="eyebrow">Operations overview</span><h1>Good morning, Crescent.</h1><p>Real-time booking, fleet and customer signals from your rental platform.</p></div><Button variant="ghost" onClick={load} disabled={loading}><RefreshCw size={15} className={loading ? 'admin-spin' : ''} /> Refresh data</Button></div>
      {error && <div className="admin-banner admin-banner-error" role="alert">{error}</div>}
      <div className="admin-kpi-grid">
        <KpiCard label="Total bookings" value={stats.total_bookings || 0} note={`${stats.pending_bookings || 0} waiting for action`} icon={CalendarCheck} tone="red" trend="Live" />
        <KpiCard label="Confirmed revenue" value={money(stats.total_revenue)} note={`${money(stats.completed_revenue)} completed`} icon={WalletCards} tone="green" />
        <KpiCard label="Active rentals" value={stats.active_rentals || 0} note={`${stats.confirmed_bookings || 0} confirmed`} icon={Activity} tone="blue" />
        <KpiCard label="Fleet utilization" value={`${utilization}%`} note={`${fleetAvailable} of ${fleetTotal} currently available`} icon={Car} tone="purple" />
        <KpiCard label="New leads" value={stats.new_leads || 0} note="Follow up from the CRM queue" icon={Users} tone="amber" />
        <KpiCard label="New contacts" value={stats.new_contacts || 0} note="Customer messages to review" icon={MessageSquare} tone="slate" />
      </div>
      <div className="admin-dashboard-grid admin-dashboard-grid-premium">
        <section className="admin-panel admin-chart-panel"><div className="panel-head"><div><h3>Revenue performance</h3><p>Booking revenue across the last 12 months</p></div><DollarSign size={19} /></div>{monthly.length ? <RevenueChart data={monthly} /> : <div className="admin-empty-chart">Revenue trends will appear once bookings are recorded.</div>}<div className="admin-chart-summary"><span><b>{money(stats.total_revenue)}</b><small>Pipeline value</small></span><span><b>{stats.total_bookings || 0}</b><small>Total bookings</small></span></div></section>
        <section className="admin-panel"><div className="panel-head"><div><h3>Booking pipeline</h3><p>Current lifecycle distribution</p></div><CalendarCheck size={19} /></div><StatusChart data={dashboard?.booking_statuses || []} /></section>
      </div>
      <div className="admin-dashboard-grid admin-dashboard-grid-lower">
        <section className="admin-panel"><div className="panel-head"><div><h3>Fleet availability</h3><p>Operational status across the fleet</p></div><Car size={19} /></div><div className="admin-fleet-bars">{fleetBars.map((item) => <div className="admin-fleet-row" key={item.status}><div><span>{item.status}</span><b>{item.total}</b></div><div className="admin-progress"><i style={{ width: `${item.percent}%` }} /></div></div>)}{!fleetBars.length && <p className="muted">No fleet records found.</p>}</div></section>
        <section className="admin-panel"><div className="panel-head"><div><h3>Recent bookings</h3><p>Latest customer activity</p></div><Clock3 size={19} /></div><div className="mini-table">{(dashboard?.recent_bookings || []).slice(0, 6).map((booking) => <div key={booking.id}><span className="admin-list-avatar">{booking.customer?.full_name?.slice(0, 1) || 'C'}</span><strong>{booking.reference}<small>{booking.customer?.full_name || 'Customer'} · {booking.vehicle?.name || 'Vehicle'}</small></strong><em className={`status status-${String(booking.status).toLowerCase().replaceAll(' ', '-')}`}>{booking.status}</em></div>)}{!dashboard?.recent_bookings?.length && <p className="muted">No recent booking data loaded.</p>}</div></section>
      </div>
      <div className="admin-dashboard-footnote"><CheckCircle2 size={15} /> Dashboard metrics are pulled from the Crescent API and refresh on demand.</div>
    </>
  );
}
