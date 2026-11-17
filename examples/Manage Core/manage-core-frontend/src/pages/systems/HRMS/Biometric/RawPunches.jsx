import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt, faCheckCircle, faExclamationTriangle, faCopy, faChartLine,
  faRedo, faFilter, faCalendarAlt, faSearch, faSync, faUpload
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { listBiometricDevices, listBiometricPunchLogs, syncBiometricDevice } from '../../../../api/hrms';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const RawPunches = () => {
  const { addNotification } = useApp();
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const fetchPunches = async () => {
    setLoading(true);
    try {
      const data = await listBiometricPunchLogs({});
      setPunches(Array.isArray(data) ? data : []);
    } catch (err) {
      addNotification(err.message || 'Failed to load punches', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPunches(); }, []);

  const stats = useMemo(() => {
    const total = punches.length;
    const matched = punches.filter(p => p.sync_status === 'synced').length;
    const unmatched = punches.filter(p => p.sync_status === 'failed').length;
    const pending = punches.filter(p => p.sync_status === 'pending').length;
    const matchRate = total ? ((matched / total) * 100).toFixed(1) : '0.0';
    return [
      { label: 'Total Punches', value: total, color: '#4f46e5', icon: faBolt },
      { label: 'Synced', value: matched, color: '#10b981', icon: faCheckCircle },
      { label: 'Unmatched', value: unmatched, color: '#f59e0b', icon: faExclamationTriangle },
      { label: 'Pending', value: pending, color: '#6366f1', icon: faCopy },
      { label: 'Match Rate', value: `${matchRate}%`, color: '#6366f1', icon: faChartLine },
    ];
  }, [punches]);

  const filteredPunches = useMemo(() => {
    let list = punches;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.employee_code || '').toLowerCase().includes(q) ||
        (p.device?.name || '').toLowerCase().includes(q) ||
        (p.user?.name || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter(p => p.sync_status === statusFilter);
    }
    return list;
  }, [punches, search, statusFilter]);

  const statusBadge = (status) => {
    const map = {
      synced: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
      failed: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
      pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    };
    const s = map[status] || { bg: 'rgba(148,163,184,0.15)', color: mutedColor };
    return <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12,
      fontWeight: 600, background: s.bg, color: s.color }}>{status}</span>;
  };

  const handleSync = async () => {
    try {
      const devices = await listBiometricDevices();
      for (const device of devices) {
        await syncBiometricDevice(device.id);
      }
      addNotification('All devices synced successfully', 'success');
      fetchPunches();
    } catch (err) {
      addNotification(err.message || 'Sync failed', 'danger');
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show"
      style={{ minHeight: '100vh', background: bg, padding: '28px 32px', color: textColor,
        fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <motion.div variants={itemVariants}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: primaryGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
              Raw Punch Processing Engine
            </h1>
            <p style={{ margin: '3px 0 0 0', fontSize: 13, color: mutedColor }}>
              Biometric punch synchronization, verification and processing platform
            </p>
          </div>
        </div>
        <button onClick={handleSync}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px',
            border: 'none', borderRadius: radius, background: primaryGradient, color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
          <FontAwesomeIcon icon={faSync} /> Sync All
        </button>
      </motion.div>

      <motion.div variants={itemVariants}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
            padding: '18px 20px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.label}
              </span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 14 }}>
                <FontAwesomeIcon icon={s.icon} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}
        style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10,
          background: inputBg, border: `1px solid ${borderColor}`, cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ color: mutedColor, fontSize: 12 }} />
          <span style={{ fontSize: 13, color: mutedColor }}>All Time</span>
          <FontAwesomeIcon icon={faFilter} style={{ color: mutedColor, fontSize: 10, marginLeft: 4 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10,
          background: inputBg, border: `1px solid ${borderColor}`, flex: 1, maxWidth: 200 }}>
          <FontAwesomeIcon icon={faSearch} style={{ color: mutedColor, fontSize: 12 }} />
          <input placeholder="Search employee/device..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: textColor, fontSize: 13, width: '100%' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 14px', borderRadius: 10, background: inputBg,
            border: `1px solid ${borderColor}`, color: textColor, fontSize: 13, outline: 'none' }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="synced">Synced</option>
          <option value="failed">Failed</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} style={{ background: cardBg, borderRadius: radius,
        border: `1px solid ${borderColor}`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {['Punch ID', 'Employee', 'Code', 'Device', 'Punch Time', 'Type', 'Status'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600,
                    color: mutedColor, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPunches.map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${borderColor}`, transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>#{p.id}</td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {p.user?.name || p.employee_code || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                    {p.employee_code || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                    {p.device?.name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {p.punch_time ? new Date(p.punch_time).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {p.punch_type || 'auto'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{statusBadge(p.sync_status)}</td>
                </tr>
              ))}
              {filteredPunches.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: mutedColor }}>
                    {loading ? 'Loading punches...' : 'No punches found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RawPunches;
