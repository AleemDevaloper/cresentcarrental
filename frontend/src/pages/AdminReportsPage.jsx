import { useEffect, useState } from 'react';
import { AlertTriangle, BarChart3, CalendarCheck, CheckCircle2, DollarSign, Loader2, RefreshCw, Users } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.get('/admin/reports')
      .then((r) => setStats(r.data?.data ?? r.data ?? {}))
      .catch((e) => setError(e.response?.data?.message || 'Could not load reports.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1>Reports</h1>
          <p>High-level business metrics across bookings, revenue and fleet performance.</p>
        </div>
        <Button variant="ghost" onClick={load} disabled={loading}>
          <RefreshCw size={16} style={{ transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform .5s' }} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="admin-banner admin-banner-error" role="alert">
          <AlertTriangle size={17} /> {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading" style={{ padding: 48, textAlign: 'center', color: '#888' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: 10 }} />
          <p style={{ margin: 0 }}>Loading reports…</p>
        </div>
      ) : (
        <div className="admin-report-grid">
          <div className="admin-report-card">
            <span className="admin-report-icon"><CalendarCheck /></span>
            <div><small>Total bookings</small><strong>{stats.bookings_total ?? 0}</strong></div>
          </div>
          <div className="admin-report-card">
            <span className="admin-report-icon"><DollarSign /></span>
            <div><small>Completed revenue</small><strong>PKR {(Number(stats.completed_revenue ?? 0)).toLocaleString()}</strong></div>
          </div>
          <div className="admin-report-card">
            <span className="admin-report-icon"><BarChart3 /></span>
            <div><small>Performance</small><strong>Live data</strong></div>
          </div>
          <div className="admin-report-card">
            <span className="admin-report-icon"><CheckCircle2 /></span>
            <div><small>Reconciliation</small><strong>Real-time sync</strong></div>
          </div>
        </div>
      )}
    </>
  );
}
