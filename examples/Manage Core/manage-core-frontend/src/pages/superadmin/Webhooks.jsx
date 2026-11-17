import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { listWebhooks, storeWebhook, toggleWebhook, deleteWebhook } from '../../api/integrations';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const supportedEvents = [
  'Employee Created', 'Employee Updated', 'Attendance Imported', 'Payroll Finalized',
  'Leave Approved', 'Expense Approved', 'Recruitment Events', 'Employee Lifecycle',
];

const analyticsCards = [
  { label: 'Active Webhooks', value: '12', color: '#10b981', icon: 'faLink' },
  { label: 'Successful Deliveries', value: '98.7%', color: '#4f46e5', icon: 'faCheckCircle' },
  { label: 'Failed Deliveries', value: '2.3%', color: '#ef4444', icon: 'faExclamationTriangle' },
  { label: 'Avg Response Time', value: '124ms', color: '#f59e0b', icon: 'faClock' },
];

const icons = {
  faLink: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  faCheckCircle: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  faExclamationTriangle: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  faClock: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  faEdit: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  faFlask: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v5l4 9H5l4-9V3z" />
      <line x1="9" y1="3" x2="15" y2="3" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  ),
  faPowerOff: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  ),
  faPlus: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  faBell: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  faEye: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

function Webhooks({ isDark }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [webhooksData, setWebhooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [] });

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const data = await listWebhooks();
      setWebhooksData(Array.isArray(data) ? data : data?.data ? data.data : []);
    } catch (err) {
      console.error('Failed to load webhooks:', err);
      setWebhooksData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhook.url) return;
    try {
      await storeWebhook({ url: newWebhook.url, events: newWebhook.events });
      await loadWebhooks();
      setShowAddModal(false);
      setNewWebhook({ url: '', events: [] });
    } catch (err) {
      alert(err.message || 'Failed to create webhook');
    }
  };

  const handleToggleWebhook = async (id) => {
    try {
      await toggleWebhook(id);
      await loadWebhooks();
    } catch (err) {
      console.error('Failed to toggle webhook:', err);
    }
  };

  const handleDeleteWebhook = async (id) => {
    if (!window.confirm('Delete this webhook?')) return;
    try {
      await deleteWebhook(id);
      await loadWebhooks();
    } catch (err) {
      console.error('Failed to delete webhook:', err);
    }
  };

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const badgeStyle = (status) => {
    if (status === 'Active') return { background: 'rgba(16,185,129,0.12)', color: '#10b981' };
    if (status === 'Disabled') return { background: 'rgba(100,116,139,0.12)', color: mutedColor };
    return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' };
  };

  const eventBadgeColor = (idx) => {
    const colors = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];
    return colors[idx % colors.length];
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ background: bg, minHeight: '100vh', padding: '28px 32px', fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: textColor }}
    >
      <motion.div variants={childVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: radius, background: primaryGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22,
            boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          }}>
            {icons.faLink}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Enterprise Webhook Management</div>
            <div style={{ fontSize: 13, color: mutedColor, marginTop: 2 }}>Send HRMS events to external systems via webhook integrations</div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: radius,
            border: 'none', background: primaryGradient, color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
          }}
        >
          {icons.faPlus} Add Webhook
        </motion.button>
      </motion.div>

      <motion.div variants={childVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
        {analyticsCards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
            style={{
              background: cardBg, backdropFilter: 'blur(12px)', borderRadius: radius, border: `1px solid ${borderColor}`,
              padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: mutedColor, marginBottom: 6 }}>{card.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: textColor }}>{card.value}</div>
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: `${card.color}16`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color,
            }}>
              {icons[card.icon]}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={childVariants}
        style={{ background: cardBg, backdropFilter: 'blur(12px)', borderRadius: radius, border: `1px solid ${borderColor}`, overflow: 'hidden', marginBottom: 28 }}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.6fr 1fr 1fr 1fr 1fr',
          padding: '14px 22px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: mutedColor, borderBottom: `1px solid ${borderColor}`,
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        }}>
          <span>Endpoint URL</span>
          <span>Events Subscribed</span>
          <span>Status</span>
          <span>Last Triggered</span>
          <span>Success Rate</span>
          <span>Actions</span>
        </div>
        {webhooksData.map((row, idx) => (
          <motion.div
            key={row.url}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onMouseEnter={() => setHoveredRow(idx)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 1.6fr 1fr 1fr 1fr 1fr',
              padding: '16px 22px', fontSize: 13, alignItems: 'center',
              borderBottom: idx < webhooksData.length - 1 ? `1px solid ${borderColor}` : 'none',
              background: hoveredRow === idx ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)') : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.status === 'Active' ? '#10b981' : row.status === 'Disabled' ? mutedColor : '#ef4444', flexShrink: 0 }} />
              <span style={{ color: textColor, fontWeight: 500, fontSize: 12, wordBreak: 'break-all' }}>{row.url}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {row.events.map((ev, ei) => (
                <span key={ev} style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                  background: `${eventBadgeColor(ei)}18`, color: eventBadgeColor(ei),
                }}>
                  {ev}
                </span>
              ))}
            </div>
            <div>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                ...badgeStyle(row.status),
              }}>
                {row.status}
              </span>
            </div>
            <div style={{ color: mutedColor, fontSize: 12 }}>{row.last}</div>
            <div style={{ fontWeight: 600, color: row.rate >= '90' ? '#10b981' : row.rate >= '70' ? '#f59e0b' : '#ef4444' }}>{row.rate}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[icons.faEdit, icons.faFlask, icons.faPowerOff].map((icon, ai) => (
                <motion.button
                  key={ai}
                  whileHover={{ scale: 1.15, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                    background: 'transparent', color: mutedColor, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                  title={ai === 0 ? 'Edit' : ai === 1 ? 'Test' : 'Disable'}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={childVariants}
        style={{ background: cardBg, backdropFilter: 'blur(12px)', borderRadius: radius, border: `1px solid ${borderColor}`, padding: '22px 26px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: `${isDark ? 'rgba(79,70,229,0.15)' : 'rgba(79,70,229,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5',
          }}>
            {icons.faBell}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Supported Events</div>
            <div style={{ fontSize: 12, color: mutedColor, marginTop: 1 }}>Available event types for webhook subscriptions</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {supportedEvents.map((ev, i) => (
            <motion.span
              key={ev}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              style={{
                padding: '8px 18px', borderRadius: 24, fontSize: 12, fontWeight: 500,
                background: `${eventBadgeColor(i)}14`, color: eventBadgeColor(i),
                border: `1px solid ${eventBadgeColor(i)}30`, cursor: 'default',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {icons.faEye}
              {ev}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Webhooks;
