import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuildingShield, faUsersGear, faCreditCard, faPalette,
    faPlus, faTimes, faEllipsisV, faCheckCircle, faGlobe,
    faLock, faEnvelope, faLink
} from '@fortawesome/free-solid-svg-icons';

const TenantManagement = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const bg = isDark ? '#0f172a' : '#f1f5f9';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#f1f5f9' : '#0f172a';
    const mutedColor = isDark ? '#94a3b8' : '#64748b';
    const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
    const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
    const shadowSm = isDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.04)';
    const radius = 14;

    const tenants = [
        { name: 'Acme Corp', domain: 'acme.enterprise.com', plan: 'Enterprise Gold', users: 1250, status: 'Active' },
        { name: 'Globex Inc', domain: 'globex.io', plan: 'Professional', users: 450, status: 'Active' },
        { name: 'Stark Industries', domain: 'stark.tech', plan: 'Enterprise Platinum', users: 5000, status: 'Suspended' },
        { name: 'Wayne Enterp.', domain: 'wayne.com', plan: 'Standard', users: 120, status: 'Active' },
    ];

    const statusColors = { Active: { bg: '#dcfce7', text: '#16a34a' }, Suspended: { bg: '#fce4ec', text: '#dc2626' } };

    const containerStyle = {
        padding: '28px 32px', background: bg, minHeight: '100%', color: textColor,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    };

    const statCardStyle = {
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: 20, boxShadow: shadowSm, height: '100%'
    };

    const tenantCardStyle = {
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: 24, boxShadow: shadowSm, height: '100%',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return (
        <div style={containerStyle}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {/* ───── Header ───── */}
                <div style={{
                    background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
                    padding: '20px 24px', marginBottom: 24, boxShadow: shadowSm,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: primaryGradient, color: '#fff', fontSize: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 14px rgba(79,70,229,0.25)'
                        }}>
                            <FontAwesomeIcon icon={faBuildingShield} />
                        </div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: textColor, lineHeight: 1.3 }}>
                                Tenant & Organization Manager
                            </div>
                            <div style={{ fontSize: 12, color: mutedColor, fontWeight: 500, marginTop: 1 }}>
                                Multi-tenant Governance, Subscriptions & Branding
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        style={{
                            padding: '10px 20px', borderRadius: 10, border: 'none',
                            background: primaryGradient, color: '#fff', fontWeight: 600, fontSize: 12,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)' }}>
                        <FontAwesomeIcon icon={faPlus} /> PROVISION NEW TENANT
                    </button>
                </div>

                {/* ───── Stats Row ───── */}
                <div className="row g-4" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Total Organizations', value: '48', icon: faGlobe, color: '#4f46e5' },
                        { label: 'Active Subscriptions', value: '42', icon: faCreditCard, color: '#10b981' },
                        { label: 'System-wide Users', value: '18.4K', icon: faUsersGear, color: '#6366f1' },
                    ].map((s, i) => (
                        <div key={i} className="col-md-4">
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={statCardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 11,
                                        background: `${s.color}12`, color: s.color, fontSize: 16,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <FontAwesomeIcon icon={s.icon} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 2 }}>{s.label}</div>
                                        <div style={{ fontSize: 24, fontWeight: 700, color: textColor, lineHeight: 1.1 }}>{s.value}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 12, height: 3, borderRadius: 2, background: borderColor, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${[65, 55, 80][i]}%`, borderRadius: 2, background: s.color, opacity: 0.6 }} />
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* ───── Tenant List ───── */}
                <div className="row g-4">
                    {tenants.map((tenant, i) => (
                        <div key={i} className="col-xl-6">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                style={tenantCardStyle}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                                    e.currentTarget.style.borderColor = '#c7d2fe';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = shadowSm;
                                    e.currentTarget.style.borderColor = borderColor;
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 11,
                                            background: inputBg, border: `1px solid ${borderColor}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#4f46e5', fontWeight: 700, fontSize: 17
                                        }}>
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 15, color: textColor }}>{tenant.name}</div>
                                            <div style={{ fontSize: 12, color: mutedColor, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                                                <FontAwesomeIcon icon={faLink} style={{ fontSize: 10, opacity: 0.6 }} />
                                                {tenant.domain}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                                            background: statusColors[tenant.status]?.bg || '#f1f5f9',
                                            color: statusColors[tenant.status]?.text || mutedColor,
                                            letterSpacing: '0.04em'
                                        }}>
                                            {tenant.status.toUpperCase()}
                                        </span>
                                        <button style={{
                                            width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                                            background: 'transparent', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: mutedColor, fontSize: 12, transition: 'all 0.15s'
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = textColor }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}>
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </button>
                                    </div>
                                </div>

                                <div className="row g-3" style={{ marginBottom: 18 }}>
                                    <div className="col-6">
                                        <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>PLAN</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{tenant.plan}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>USERS</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{tenant.users.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button style={{
                                        flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${borderColor}`,
                                        background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                        color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                        transition: 'all 0.15s', letterSpacing: '0.02em'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.borderColor = '#c7d2fe' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; e.currentTarget.style.borderColor = borderColor }}>
                                        <FontAwesomeIcon icon={faPalette} /> BRANDING
                                    </button>
                                    <button style={{
                                        flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${borderColor}`,
                                        background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                        color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                        transition: 'all 0.15s', letterSpacing: '0.02em'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = '#d97706'; e.currentTarget.style.borderColor = '#fde68a' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; e.currentTarget.style.borderColor = borderColor }}>
                                        <FontAwesomeIcon icon={faLock} /> SECURITY
                                    </button>
                                    <button style={{
                                        width: 36, height: 36, borderRadius: 8, border: `1px solid ${borderColor}`,
                                        background: 'transparent', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: mutedColor, fontSize: 12, transition: 'all 0.15s', flexShrink: 0
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = textColor }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}>
                                        <FontAwesomeIcon icon={faEllipsisV} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ───── Provision Modal ───── */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.5)', zIndex: 1050,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                        backdropFilter: 'blur(2px)'
                    }}
                        onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                background: cardBg, borderRadius: 18, width: '100%', maxWidth: 560,
                                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: `1px solid ${borderColor}`
                            }}>
                            <div style={{
                                padding: '20px 28px', borderBottom: `1px solid ${borderColor}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: primaryGradient, color: '#fff', fontSize: 14,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <FontAwesomeIcon icon={faBuildingShield} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>Provision New Organization</div>
                                        <div style={{ fontSize: 11, color: mutedColor, marginTop: 1 }}>Create a new tenant on the platform</div>
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)}
                                    style={{
                                        width: 32, height: 32, borderRadius: 8, border: 'none',
                                        background: inputBg, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: mutedColor, fontSize: 14, transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = borderColor; e.currentTarget.style.color = textColor }}
                                    onMouseLeave={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = mutedColor }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <div style={{ padding: '24px 28px' }}>
                                <div className="row g-4">
                                    <div className="col-12">
                                        <label style={labelStyle}>Organization Name</label>
                                        <input type="text" placeholder="e.g. Nexus Corp" style={inputStyle}
                                            onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)' }}
                                            onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none' }} />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Primary Domain</label>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 0,
                                            borderRadius: 10, border: `1px solid ${borderColor}`,
                                            background: inputBg, overflow: 'hidden',
                                            transition: 'border-color 0.2s'
                                        }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)' }}
                                            onBlur={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.boxShadow = 'none' }}
                                            tabIndex={-1}>
                                            <span style={{ padding: '9px 12px', color: mutedColor, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                                <FontAwesomeIcon icon={faGlobe} style={{ fontSize: 12 }} />
                                            </span>
                                            <input type="text" placeholder="nexus.io"
                                                style={{
                                                    flex: 1, padding: '9px 12px 9px 0', border: 'none',
                                                    background: 'transparent', fontSize: 13, color: textColor,
                                                    outline: 'none'
                                                }} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Subscription Tier</label>
                                        <select style={inputStyle}
                                            onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)' }}
                                            onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none' }}>
                                            <option>Standard</option>
                                            <option>Professional</option>
                                            <option>Enterprise Gold</option>
                                            <option>Enterprise Platinum</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label style={labelStyle}>Admin Email</label>
                                        <input type="email" placeholder="admin@domain.com" style={inputStyle}
                                            onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)' }}
                                            onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: '16px 28px', borderTop: `1px solid ${borderColor}`,
                                display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg
                            }}>
                                <button onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`,
                                        background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                        color: mutedColor, transition: 'all 0.15s', letterSpacing: '0.02em'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = borderColor; e.currentTarget.style.color = textColor }}
                                    onMouseLeave={e => { e.currentTarget.style.background = cardBg; e.currentTarget.style.color = mutedColor }}>
                                    CANCEL
                                </button>
                                <button onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '10px 22px', borderRadius: 10, border: 'none',
                                        background: primaryGradient, color: '#fff', fontWeight: 600,
                                        cursor: 'pointer', fontSize: 12, letterSpacing: '0.02em',
                                        boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(79,70,229,0.35)' }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)' }}>
                                    CREATE TENANT
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: ${borderColor}; border-radius: 3px; }
                input::placeholder, select { color: ${mutedColor}; }
            `}</style>
        </div>
    );
};

const labelStyle = {
    fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, display: 'block',
    letterSpacing: '0.02em'
};
const inputStyle = {
    width: '100%', padding: '9px 14px', borderRadius: 10, border: `1px solid #e2e8f0`,
    background: '#f8fafc', fontSize: 13, color: '#0f172a', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
};

export default TenantManagement;
