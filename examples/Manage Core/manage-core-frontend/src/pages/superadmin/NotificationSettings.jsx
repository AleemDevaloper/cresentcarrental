import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faEnvelope, faExclamationCircle, faChartLine,
    faEdit, faCopy, faEye, faToggleOn, faToggleOff, faPlus
} from '@fortawesome/free-solid-svg-icons';

const NotificationSettings = ({ isDark }) => {
    const [toggles, setToggles] = useState({
        employees: true, managers: true, hr: false, finance: false, admins: true
    });

    const bg = isDark ? '#0f172a' : '#f1f5f9';
    const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
    const textColor = isDark ? '#f1f5f9' : '#0f172a';
    const mutedColor = isDark ? '#94a3b8' : '#64748b';
    const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
    const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
    const shadowSm = isDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.04)';
    const radius = 14;

    const containerStyle = {
        padding: '28px 32px', background: bg, minHeight: '100%', color: textColor,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    };

    const cardStyle = {
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: 24, boxShadow: shadowSm, height: '100%'
    };

    const statCardStyle = {
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: 20, boxShadow: shadowSm, height: '100%'
    };

    const stats = [
        { label: 'Unread Notifications', value: '1,247', icon: faBell, color: '#4f46e5', progress: 62 },
        { label: 'Queued Emails', value: '3,842', icon: faEnvelope, color: '#f59e0b', progress: 78 },
        { label: 'Failed Notifications', value: '23', icon: faExclamationCircle, color: '#ef4444', progress: 23 },
        { label: 'Delivery Rate', value: '98.7%', icon: faChartLine, color: '#10b981', progress: 99 },
    ];

    const templates = [
        { name: 'Welcome Email', type: 'Email', channel: 'HRMS', status: 'Active', updated: '2026-06-10' },
        { name: 'Leave Approved', type: 'In-App', channel: 'HRMS', status: 'Active', updated: '2026-06-08' },
        { name: 'Payroll Processed', type: 'Email', channel: 'Payroll', status: 'Active', updated: '2026-06-05' },
        { name: 'Expense Rejected', type: 'SMS', channel: 'Finance', status: 'Inactive', updated: '2026-06-01' },
        { name: 'Attendance Alert', type: 'Push', channel: 'HRMS', status: 'Active', updated: '2026-05-28' },
        { name: 'Performance Review', type: 'Email', channel: 'HRMS', status: 'Active', updated: '2026-05-20' },
    ];

    const typeColors = {
        Email: { bg: '#ede9fe', text: '#7c3aed' },
        'In-App': { bg: '#dbeafe', text: '#2563eb' },
        SMS: { bg: '#fce7f3', text: '#db2777' },
        Push: { bg: '#d1fae5', text: '#059669' },
    };

    const statusColors = {
        Active: { bg: '#dcfce7', text: '#16a34a' },
        Inactive: { bg: '#f1f5f9', text: '#94a3b8' },
    };

    const audiences = [
        { key: 'employees', label: 'Employees' },
        { key: 'managers', label: 'Managers' },
        { key: 'hr', label: 'HR' },
        { key: 'finance', label: 'Finance' },
        { key: 'admins', label: 'Admins' },
    ];

    const footerStats = [
        { label: 'Notification Scheduling', value: '3 active rules' },
        { label: 'Escalation Rules', value: '5 configured' },
        { label: 'Multi-language Templates', value: '12 languages' },
    ];

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
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: textColor, lineHeight: 1.3 }}>
                                Enterprise Notification Center
                            </div>
                            <div style={{ fontSize: 12, color: mutedColor, fontWeight: 500, marginTop: 1 }}>
                                Manage email, in-app, SMS, push notifications and workflow alerts
                            </div>
                        </div>
                    </div>
                    <button
                        style={{
                            padding: '10px 20px', borderRadius: 10, border: 'none',
                            background: primaryGradient, color: '#fff', fontWeight: 600, fontSize: 12,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)' }}>
                        <FontAwesomeIcon icon={faPlus} /> ADD TEMPLATE
                    </button>
                </div>

                {/* ───── Analytics Row ───── */}
                <div className="row g-4" style={{ marginBottom: 24 }}>
                    {stats.map((s, i) => (
                        <div key={i} className="col-md-3">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                style={statCardStyle}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 11,
                                        background: `${s.color}18`, color: s.color, fontSize: 16,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <FontAwesomeIcon icon={s.icon} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 2 }}>{s.label}</div>
                                        <div style={{ fontSize: 24, fontWeight: 700, color: textColor, lineHeight: 1.1 }}>{s.value}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 12, height: 3, borderRadius: 2, background: borderColor, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${s.progress}%`, borderRadius: 2, background: s.color, opacity: 0.6 }} />
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* ───── Template Management Section ───── */}
                <div style={cardStyle}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: textColor }}>
                        Notification Templates
                    </div>

                    {/* Table Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                        gap: 12, padding: '10px 14px', fontSize: 11, fontWeight: 600,
                        color: mutedColor, letterSpacing: '0.04em', borderBottom: `1px solid ${borderColor}`,
                        background: inputBg, borderRadius: '8px 8px 0 0'
                    }}>
                        <span>Template Name</span>
                        <span>Type</span>
                        <span>Channel</span>
                        <span>Status</span>
                        <span>Last Updated</span>
                        <span style={{ textAlign: 'center' }}>Actions</span>
                    </div>

                    {/* Table Rows */}
                    {templates.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                                gap: 12, padding: '12px 14px', fontSize: 13,
                                borderBottom: i < templates.length - 1 ? `1px solid ${borderColor}` : 'none',
                                alignItems: 'center', color: textColor,
                                transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = inputBg }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                            <span style={{ fontWeight: 600 }}>{t.name}</span>
                            <span>
                                <span style={{
                                    padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                                    background: typeColors[t.type]?.bg || inputBg,
                                    color: typeColors[t.type]?.text || mutedColor
                                }}>
                                    {t.type}
                                </span>
                            </span>
                            <span style={{ color: mutedColor }}>{t.channel}</span>
                            <span>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                                    background: statusColors[t.status]?.bg || '#f1f5f9',
                                    color: statusColors[t.status]?.text || mutedColor,
                                    letterSpacing: '0.04em'
                                }}>
                                    {t.status.toUpperCase()}
                                </span>
                            </span>
                            <span style={{ color: mutedColor, fontSize: 12 }}>{t.updated}</span>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                                {[faEdit, faCopy, faEye].map((icon, j) => (
                                    <button key={j}
                                        style={{
                                            width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                                            background: 'transparent', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: mutedColor, fontSize: 11, transition: 'all 0.15s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = textColor }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}>
                                        <FontAwesomeIcon icon={icon} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ───── Audience Controls Section ───── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        ...cardStyle, marginTop: 24,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
                    }}
                >
                    <div style={{ fontSize: 15, fontWeight: 700, color: textColor }}>Audience Controls</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {audiences.map(a => (
                            <button
                                key={a.key}
                                onClick={() => setToggles(prev => ({ ...prev, [a.key]: !prev[a.key] }))}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 14px', borderRadius: 20, border: `1px solid ${borderColor}`,
                                    background: toggles[a.key] ? primaryGradient : 'transparent',
                                    color: toggles[a.key] ? '#fff' : mutedColor,
                                    cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                    transition: 'all 0.2s', letterSpacing: '0.02em',
                                    boxShadow: toggles[a.key] ? '0 2px 8px rgba(79,70,229,0.25)' : 'none'
                                }}
                            >
                                <FontAwesomeIcon icon={toggles[a.key] ? faToggleOn : faToggleOff} style={{ fontSize: 13 }} />
                                {a.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ───── Footer Quick Stats ───── */}
                <div className="row g-4" style={{ marginTop: 20 }}>
                    {footerStats.map((f, i) => (
                        <div key={i} className="col-md-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.08 }}
                                style={{
                                    background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
                                    padding: '16px 20px', boxShadow: shadowSm, textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: 11, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 6 }}>{f.label}</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: textColor }}>{f.value}</div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <style>{`
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: ${borderColor}; border-radius: 3px; }
            `}</style>
        </div>
    );
};

export default NotificationSettings;
