import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle, faChartLine, faBan, faClock, faUsers,
  faCheckCircle, faTimesCircle, faSearch, faFilter, faSync
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { importBiometricPunches, listBiometricPunchLogs } from '../../../../api/hrms';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

const UnmatchedPunches = () => {
  const { addNotification } = useApp();
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
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

  const fetchUnmatched = async () => {
    setLoading(true);
    try {
      const data = await listBiometricPunchLogs({ sync_status: 'failed' });
      setPunches(Array.isArray(data) ? data : []);
    } catch (err) {
      addNotification(err.message || 'Failed to load unmatched punches', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUnmatched(); }, []);

  const stats = useMemo(() => {
    const total = punches.length;
    const noEmp = punches.filter(p => (p.sync_notes || '').includes('No employee')).length;
    const deviceIssues = punches.filter(p => (p.sync_notes || '').includes('device')).length;
    const pending = punches.filter(p => p.sync_status === 'pending').length;
    return [
      { label: 'Total Unmatched', value: total, color: '#f59e0b', icon: faExclamationTriangle },
      { label: 'No Employee Match', value: noEmp, color: '#ef4444', icon: faTimesCircle },
      { label: 'Device Issues', value: deviceIssues, color: '#4f46e5', icon: faBan },
      { label: 'Pending Review', value: pending, color: '#6366f1', icon: faClock },
      { label: 'Resolution Rate', value: total ? `${((1 - pending / total) * 100).toFixed(1)}%` : '0%', color: '#10b981', icon: faChartLine },
    ];
  }, [punches]);

  const filteredPunches = useMemo(() => {
    if (!search) return punches;
    const q = search.toLowerCase();
    return punches.filter(p =>
      (p.employee_code || '').toLowerCase().includes(q) ||
      (p.device?.name || '').toLowerCase().includes(q) ||
      (p.sync_notes || '').toLowerCase().includes(q)
    );
  }, [punches, search]);

  const reasonBadge = (notes) => {
    const reasons = [
      { match: 'No employee', label: 'Missing Employee', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
      { match: 'device', label: 'Device Issue', color: '#4f46e5', bg: 'rgba(79,70,229,0.15)' },
      { match: 'timeout', label: 'Timeout', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    ];
    const found = reasons.find(r => (notes || '').toLowerCase().includes(r.match));
    const s = found || { label: 'Unknown', color: mutedColor, bg: 'rgba(148,163,184,0.15)' };
    return <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12,
      fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const handleResolve = async (punchId) => {
    try {
      setPunches(prev => prev.filter(p => p.id !== punchId));
      addNotification('Punch resolved', 'success');
    } catch (err) {
      addNotification(err.message || 'Failed to resolve', 'danger');
    }
  };

  const handleResolveAll = async () => {
    setPunches([]);
    addNotification('All unmatched punches resolved', 'success');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible"
      style={{ minHeight: '100vh', background: bg, padding: '28px 32px',
        fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color: textColor }}>
      <motion.div variants={item} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: primaryGradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff',
              boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
                Unmatched Punch Resolution Center
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: mutedColor }}>
                Review and resolve biometric punches that cannot be matched to employees
              </p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleResolveAll}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: primaryGradient,
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.25)' }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }} />Resolve All
          </motion.button>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <motion.div key={s.label} variants={item} style={{ background: cardBg, borderRadius: radius,
            padding: '18px 20px', border: `1px solid ${borderColor}`, backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.label}
              </span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 14 }}>
                <FontAwesomeIcon icon={s.icon} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item}
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
          background: inputBg, border: `1px solid ${borderColor}`, flex: 1, maxWidth: 300 }}>
          <FontAwesomeIcon icon={faSearch} style={{ color: mutedColor, fontSize: 13 }} />
          <input placeholder="Search by employee code, device, or reason..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: textColor, fontSize: 13, width: '100%' }} />
        </div>
        <button onClick={fetchUnmatched}
          style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${borderColor}`,
            background: inputBg, color: textColor, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FontAwesomeIcon icon={faSync} /> Refresh
        </button>
      </motion.div>

      <motion.div variants={item} style={{ background: cardBg, borderRadius: radius,
        border: `1px solid ${borderColor}`, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {['ID', 'Device', 'Punch Time', 'Employee Code', 'Reason', 'Actions'].map(h => (
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
                  <td style={{ padding: '12px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                    {p.device?.name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {p.punch_time ? new Date(p.punch_time).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                    {p.employee_code || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{reasonBadge(p.sync_notes)}</td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleResolve(p.id)}
                      style={{ width: 30, height: 30, borderRadius: 8, border: 'none',
                        background: 'transparent', color: '#10b981', cursor: 'pointer', fontSize: 12 }}
                      title="Resolve">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                    <button onClick={() => handleResolve(p.id)}
                      style={{ width: 30, height: 30, borderRadius: 8, border: 'none',
                        background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 12, marginLeft: 4 }}
                      title="Ignore">
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPunches.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: mutedColor }}>
                    {loading ? 'Loading...' : 'No unmatched punches. All clear!'}
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

export default UnmatchedPunches;
