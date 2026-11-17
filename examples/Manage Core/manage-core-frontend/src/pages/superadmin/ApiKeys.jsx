import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faChartLine,
  faExclamationTriangle,
  faBan,
  faCopy,
  faRedo,
  faPowerOff,
  faPlus,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { listApiKeys, storeApiKey, toggleApiKey, deleteApiKey } from '../../api/integrations';
import { useApp } from '../../hooks/useApp';

const scopeDefs = [
  {
    id: 'read',
    label: 'Read Permissions',
    desc: 'View and query data across integrated systems. Safe for read-only integrations.',
  },
  {
    id: 'write',
    label: 'Write Permissions',
    desc: 'Create and update records. Required for data syncing and payload submissions.',
  },
  {
    id: 'admin',
    label: 'Admin Permissions',
    desc: 'Full administrative access including user management and configuration changes.',
  },
];

const statusStyles = {
  Active: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  Revoked: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  Expired: { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8' },
};

const badgeColors = ['#4f46e5', '#8b5cf6', '#ec4899'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

// Mask a hashed key into a displayable pseudo value (backend stores hashes only)
const maskKey = (hash = '') => {
  const tail = (hash || '').slice(-6);
  return `mc_••••••••••••••${tail}`;
};

const ApiKeys = ({ isDark }) => {
  const { addNotification } = useApp();
  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [scopes, setScopes] = useState({ read: true, write: false, admin: false });
  const [creating, setCreating] = useState(false);
  const [createdPlain, setCreatedPlain] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = () => {
    setLoading(true);
    listApiKeys()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        setKeys(list.map((k) => ({
          id: k.id,
          name: k.name,
          key: k.api_key,
          scopes: Array.isArray(k.scopes) ? k.scopes : (k.scopes ? Object.values(k.scopes) : []),
          status: k.is_active ? 'Active' : 'Revoked',
          lastUsed: k.last_used_at ? k.last_used_at.slice(0, 10) : 'Never',
          created: k.created_at ? k.created_at.slice(0, 10) : '',
        })));
        setLoadError(null);
      })
      .catch((err) => {
        setLoadError(err?.message || 'Failed to load API keys.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const toggleScope = (id) => {
    setScopes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      addNotification('Key name is required.', 'warning');
      return;
    }
    const selected = Object.keys(scopes).filter((s) => scopes[s]);
    if (selected.length === 0) {
      addNotification('Select at least one scope.', 'warning');
      return;
    }
    setCreating(true);
    try {
      const res = await storeApiKey({ name: newName.trim(), scopes: selected });
      setCreatedPlain(res.plain_key);
      setNewName('');
      setScopes({ read: true, write: false, admin: false });
      fetchKeys();
      addNotification('API key created successfully.', 'success');
    } catch (err) {
      addNotification(err?.message || 'Failed to create API key.', 'danger');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (key) => {
    try {
      await toggleApiKey(key.id);
      setKeys((prev) => prev.map((k) => (k.id === key.id ? { ...k, status: k.status === 'Active' ? 'Revoked' : 'Active' } : k)));
      addNotification(`Key ${key.status === 'Active' ? 'revoked' : 'reactivated'}.`, 'info');
    } catch (err) {
      addNotification(err?.message || 'Action failed.', 'danger');
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete API key "${key.name}"? This cannot be undone.`)) return;
    try {
      await deleteApiKey(key.id);
      setKeys((prev) => prev.filter((k) => k.id !== key.id));
      addNotification('API key deleted.', 'success');
    } catch (err) {
      addNotification(err?.message || 'Failed to delete key.', 'danger');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      addNotification('Could not copy to clipboard.', 'warning');
    }
  };

  const activeCount = keys.filter((k) => k.status === 'Active').length;
  const analyticsCards = [
    { label: 'Active Keys', value: String(activeCount), color: '#10b981', icon: faKey },
    { label: 'Total Keys', value: String(keys.length), color: '#4f46e5', icon: faChartLine },
    { label: 'Revoked', value: String(keys.length - activeCount), color: '#ef4444', icon: faExclamationTriangle },
    { label: 'Scopes', value: String(scopeDefs.length), color: '#f59e0b', icon: faBan },
  ];

  const card = {
    background: cardBg,
    borderRadius: `${radius}px`,
    border: `1px solid ${borderColor}`,
    backdropFilter: 'blur(12px)',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: '32px 36px',
        minHeight: '100vh',
        background: bg,
        color: textColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: 'all 0.3s ease',
      }}
    >
      <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: '#fff',
                boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
              }}
            >
              <FontAwesomeIcon icon={faKey} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>
                API Access Management
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: mutedColor, maxWidth: 520 }}>
                Securely manage API keys, scopes, permissions and access for external integrations
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setCreatedPlain(null); setShowCreate(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 24px',
              border: 'none',
              borderRadius: `${radius}px`,
              background: primaryGradient,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(79,70,229,0.3)',
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create API Key
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {analyticsCards.map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
            style={{ ...card, padding: '20px 22px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {item.label}
              </span>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: 15 }}>
                <FontAwesomeIcon icon={item.icon} />
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: textColor, letterSpacing: '-0.5px' }}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} style={{ ...card, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {['Key Name', 'API Key', 'Scopes', 'Status', 'Last Used', 'Created', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: mutedColor,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px 16px', textAlign: 'center', color: mutedColor }}>
                    <span className="spinner-border spinner-border-sm text-primary me-2" role="status" /> Loading API keys...
                  </td>
                </tr>
              )}
              {!loading && loadError && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px 16px', textAlign: 'center', color: '#ef4444' }}>
                    {loadError}
                  </td>
                </tr>
              )}
              {!loading && !loadError && keys.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '28px 16px', textAlign: 'center', color: mutedColor }}>
                    No API keys yet. Click “Create API Key” to generate one.
                  </td>
                </tr>
              )}
              {!loading && keys.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    borderBottom: idx < keys.length - 1 ? `1px solid ${borderColor}` : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(79,70,229,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: "'SF Mono', 'Fira Code', monospace", letterSpacing: '0.2px', color: mutedColor }}>
                    {maskKey(row.key)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {row.scopes.map((s, i) => (
                        <span
                          key={s}
                          style={{
                            padding: '2px 10px',
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                            background: `${badgeColors[i % badgeColors.length]}18`,
                            color: badgeColors[i % badgeColors.length],
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {row.scopes.length === 0 && <span style={{ color: mutedColor, fontSize: 11 }}>—</span>}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        background: statusStyles[row.status]?.bg || statusStyles.Active.bg,
                        color: statusStyles[row.status]?.color || statusStyles.Active.color,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                    {row.lastUsed}
                  </td>
                  <td style={{ padding: '14px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                    {row.created}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {row.status === 'Active' && (
                        <motion.button
                          key="revoke"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.9 }}
                          title="Revoke"
                          onClick={() => handleToggle(row)}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: `1px solid ${borderColor}`, background: 'transparent',
                            color: '#ef4444', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ef444412'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <FontAwesomeIcon icon={faPowerOff} />
                        </motion.button>
                      )}
                      {row.status !== 'Active' && (
                        <motion.button
                          key="reactivate"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.9 }}
                          title="Reactivate"
                          onClick={() => handleToggle(row)}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: `1px solid ${borderColor}`, background: 'transparent',
                            color: '#10b981', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#10b98112'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <FontAwesomeIcon icon={faRedo} />
                        </motion.button>
                      )}
                      <motion.button
                        key="delete"
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                        onClick={() => handleDelete(row)}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          border: `1px solid ${borderColor}`, background: 'transparent',
                          color: '#f43f5e', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f43f5e12'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create API Key Modal */}
      {showCreate && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)', zIndex: 1060,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => { if (!createdPlain) setShowCreate(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ ...card, width: '100%', maxWidth: 460, padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Create API Key</h5>
              {!createdPlain && (
                <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setShowCreate(false)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>

            {createdPlain ? (
              <div>
                <div className="alert alert-success small" style={{ borderRadius: 10 }}>
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Key generated. Copy it now — it will not be shown again.
                </div>
                <div
                  className="d-flex align-items-center gap-2 p-2 rounded"
                  style={{ background: inputBg, border: `1px solid ${borderColor}`, fontFamily: 'monospace', fontSize: 12 }}
                >
                  <span style={{ flex: 1, wordBreak: 'break-all' }}>{createdPlain}</span>
                  <button
                    className="btn btn-sm px-2"
                    style={{ background: primaryGradient, color: '#fff', border: 'none', borderRadius: 8 }}
                    onClick={() => handleCopy(createdPlain)}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                  </button>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-sm px-3 text-white" style={{ background: primaryGradient, border: 'none', borderRadius: 8 }} onClick={() => { setCreatedPlain(null); setShowCreate(false); }}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label fw-bold small" style={{ color: textColor }}>Key Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Production HRMS"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={creating}
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small" style={{ color: textColor }}>Scopes</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {scopeDefs.map((scope) => {
                      const active = scopes[scope.id];
                      return (
                        <div
                          key={scope.id}
                          onClick={() => toggleScope(scope.id)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                            border: `1px solid ${active ? 'rgba(79,70,229,0.3)' : borderColor}`,
                            background: active ? (isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.04)') : inputBg,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div>
                            <div className="fw-bold small" style={{ color: textColor }}>{scope.label}</div>
                            <div className="x-small" style={{ color: mutedColor }}>{scope.desc}</div>
                          </div>
                          <span
                            style={{
                              width: 38, height: 22, borderRadius: 11, border: 'none', flexShrink: 0,
                              background: active ? primaryGradient : borderColor, position: 'relative', transition: 'background 0.2s',
                            }}
                          >
                            <span style={{ position: 'absolute', top: 2, left: active ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-sm premium-btn px-3" style={{ background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', borderRadius: 8 }} onClick={() => setShowCreate(false)} disabled={creating}>Cancel</button>
                  <button type="submit" className="btn btn-sm text-white px-3" style={{ background: primaryGradient, border: 'none', borderRadius: 8 }} disabled={creating}>
                    {creating ? <><span className="spinner-border spinner-border-sm me-2" /> Creating…</> : 'Generate Key'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      <motion.div variants={itemVariants} style={{ ...card, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: primaryGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 13,
            }}
          >
            <FontAwesomeIcon icon={faKey} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Scope Management</h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: mutedColor }}>
              Define granular permission levels for your API keys
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {scopeDefs.map((scope) => {
            const active = scopes[scope.id];
            return (
              <motion.div
                key={scope.id}
                layout
                style={{
                  flex: '1 1 220px',
                  padding: '16px 18px',
                  borderRadius: 12,
                  border: `1px solid ${active ? 'rgba(79,70,229,0.3)' : borderColor}`,
                  background: active
                    ? isDark
                      ? 'rgba(79,70,229,0.1)'
                      : 'rgba(79,70,229,0.04)'
                    : inputBg,
                  transition: 'all 0.25s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                    {scope.label}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => toggleScope(scope.id)}
                    style={{
                      position: 'relative',
                      width: 42,
                      height: 24,
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      background: active ? primaryGradient : borderColor,
                      transition: 'background 0.25s ease',
                      padding: 0,
                    }}
                  >
                    <motion.div
                      animate={{ x: active ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    />
                  </motion.button>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: mutedColor, lineHeight: 1.5 }}>
                  {scope.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApiKeys;
