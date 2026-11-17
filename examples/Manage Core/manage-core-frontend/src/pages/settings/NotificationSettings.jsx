import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { EnableDisableButton } from '../../components/common';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faMobileScreenButton,
  faHashtag,
  faClock,
  faSliders,
  faCheckCircle,
  faTriangleExclamation,
  faSave,
  faRobot,
  faNetworkWired,
  faBuildingColumns,
  faTasks,
  faUsers,
  faExclamationCircle,
  faChartLine,
  faEdit,
  faCopy,
  faEye,
  faToggleOn,
  faToggleOff,
  faPlus,
  faTrash,
  faTimes,
  faLaptop,
  faCommentAlt,
  faPlay,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import sound040 from '../../assets/sound/universfield-new-notification-040-493469.mp3';
import sound051 from '../../assets/sound/universfield-new-notification-051-494246.mp3';

const NotificationSettings = () => {
  const { theme, themeStyle, addNotification } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const isGlass = themeStyle === 'glassmorphism';

  // --- Theme Style Mappings ---
  const bg = isDark ? 'transparent' : '#f8fafc';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const saveGradient = 'linear-gradient(135deg, #0184ff, #0056b3)';
  const shadowSm = isDark ? '0 4px 20px rgba(0, 0, 0, 0.35)' : '0 4px 18px rgba(0,0,0,0.04)';
  const radius = 16;

  // --- State Variables ---

  // 1. Audience Toggles (Old Feature)
  const [toggles, setToggles] = useState(() => {
    try {
      const saved = localStorage.getItem('manage_core_audience_toggles');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return { employees: true, managers: true, hr: false, finance: false, admins: true };
  });

  // 2. Email Channel settings
  const [emailPrefs, setEmailPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('manage_core_email_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return { pmsUpdates: true, fmsApprovals: true, hrmsRequests: false, systemWarnings: true, digestFrequency: 'Daily Summary' };
  });

  // 3. Push Notifications settings
  const [pushPrefs, setPushPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('manage_core_push_prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          enablePush: parsed.enablePush ?? true,
          showToasts: parsed.showToasts ?? true,
          playSounds: parsed.playSounds ?? false,
          showPreview: parsed.showPreview ?? true,
          selectedSound: parsed.selectedSound ?? 'sound040'
        };
      }
    } catch (e) { console.error(e); }
    return { enablePush: true, showToasts: true, playSounds: false, showPreview: true, selectedSound: 'sound040' };
  });

  // 4. Integrations settings
  const [integrationPrefs, setIntegrationPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('manage_core_integration_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return { slackEnabled: true, slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', teamsEnabled: false, teamsWebhook: '', aiSummaries: true };
  });

  // 5. DND Schedules settings
  const [dndPrefs, setDndPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('manage_core_dnd_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return { dndEnabled: true, dndStart: '22:00', dndEnd: '07:00', allowHighPriority: true };
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // 6. Stateful Template Database (Originally Static)
  const [templateList, setTemplateList] = useState(() => {
    try {
      const saved = localStorage.getItem('manage_core_templates');
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [
      { id: 1, name: 'Welcome Email', type: 'Email', channel: 'HRMS', status: 'Active', updated: '2026-06-10', subject: 'Welcome to ManageCore, {{employee_name}}!', body: 'Hi {{employee_name}},\n\nWelcome to our organization! Your profile is provisioned on the HRMS portal. Please sign in to verify details.' },
      { id: 2, name: 'Leave Approved', type: 'In-App', channel: 'HRMS', status: 'Active', updated: '2026-06-08', subject: 'Leave Request Approved', body: 'Good news! Your leave application for {{days}} days starting on {{start_date}} has been approved by your supervisor.' },
      { id: 3, name: 'Payroll Processed', type: 'Email', channel: 'Payroll', status: 'Active', updated: '2026-06-05', subject: 'Payslip for {{month}} Released', body: 'Dear {{employee_name}},\n\nYour payslip for the month of {{month}} is now available for download under FMS employee center.' },
      { id: 4, name: 'Expense Rejected', type: 'SMS', channel: 'Finance', status: 'Inactive', updated: '2026-06-01', subject: 'Expense Rejected', body: 'FMS Alert: Expense claim voucher {{voucher_id}} for {{amount}} has been returned/rejected. Review portal.' },
      { id: 5, name: 'Attendance Alert', type: 'Push', channel: 'HRMS', status: 'Active', updated: '2026-05-28', subject: 'Biometric Clock Missing', body: 'Standard shift warning: We missed your morning clock-in. Please submit attendance corrections if duty is out-office.' },
      { id: 6, name: 'Performance Review', type: 'Email', channel: 'HRMS', status: 'Active', updated: '2026-05-20', subject: 'Performance Appraisal Released', body: 'Dear {{employee_name}},\n\nYour annual performance review has been signed by the management. Click link to view evaluation feedback.' },
    ];
  });

  // Modals controllers
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeTemplate, setActiveTemplate] = useState(null); // template currently editing
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Form inputs for modal
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Email');
  const [formChannel, setFormChannel] = useState('HRMS');
  const [formStatus, setFormStatus] = useState('Active');
  const [formSubject, setFormSubject] = useState('');
  const [formBody, setFormBody] = useState('');

  const stats = [
    { label: 'Unread Notifications', value: '1,247', icon: faBell, color: '#4f46e5', progress: 62 },
    { label: 'Queued Emails', value: '3,842', icon: faEnvelope, color: '#f59e0b', progress: 78 },
    { label: 'Failed Notifications', value: '23', icon: faExclamationCircle, color: '#ef4444', progress: 23 },
    { label: 'Delivery Rate', value: '98.7%', icon: faChartLine, color: '#10b981', progress: 99 },
  ];

  const typeColors = {
    Email: { bg: isDark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe', text: '#7c3aed' },
    'In-App': { bg: isDark ? 'rgba(37, 99, 235, 0.2)' : '#dbeafe', text: '#2563eb' },
    SMS: { bg: isDark ? 'rgba(219, 39, 119, 0.2)' : '#fce7f3', text: '#db2777' },
    Push: { bg: isDark ? 'rgba(5, 150, 105, 0.2)' : '#d1fae5', text: '#059669' },
  };

  const statusColors = {
    Active: { bg: isDark ? 'rgba(22, 163, 74, 0.2)' : '#dcfce7', text: '#16a34a' },
    Inactive: { bg: isDark ? 'rgba(148, 163, 184, 0.2)' : '#f1f5f9', text: '#94a3b8' },
  };

  const audiences = [
    { key: 'employees', label: 'Employees' },
    { key: 'managers', label: 'Managers' },
    { key: 'hr', label: 'HR' },
    { key: 'finance', label: 'Finance' },
    { key: 'admins', label: 'Admins' },
  ];

  const footerStats = [
    { label: 'Notification Scheduling', value: `${templateList.filter(t => t.status === 'Active').length} active rules` },
    { label: 'Escalation Rules', value: '5 configured' },
    { label: 'Multi-language Templates', value: '12 languages' },
  ];

  const playPreviewSound = (soundKey) => {
    const audioFile = soundKey === 'sound051' ? sound051 : sound040;
    const audio = new Audio(audioFile);
    audio.volume = 0.6;
    audio.play().catch(e => console.warn('Audio playback deferred by browser interaction rules:', e));
  };

  const handleSave = () => {
    setSaving(true);
    setSuccess(false);
    try {
      localStorage.setItem('manage_core_audience_toggles', JSON.stringify(toggles));
      localStorage.setItem('manage_core_email_prefs', JSON.stringify(emailPrefs));
      localStorage.setItem('manage_core_push_prefs', JSON.stringify(pushPrefs));
      localStorage.setItem('manage_core_integration_prefs', JSON.stringify(integrationPrefs));
      localStorage.setItem('manage_core_dnd_prefs', JSON.stringify(dndPrefs));
      localStorage.setItem('manage_core_templates', JSON.stringify(templateList));
      localStorage.setItem('manage_core_play_sounds', pushPrefs.playSounds ? 'true' : 'false');
      localStorage.setItem('manage_core_selected_sound', pushPrefs.selectedSound || 'sound040');
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      if (addNotification) {
        addNotification('Notification configurations synchronized successfully!', 'success');
      }
      setTimeout(() => setSuccess(false), 4000);
    }, 1200);
  };

  // --- Modal actions ---
  const openAddModal = () => {
    setModalMode('add');
    setFormName('');
    setFormType('Email');
    setFormChannel('HRMS');
    setFormStatus('Active');
    setFormSubject('');
    setFormBody('');
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setModalMode('edit');
    setActiveTemplate(t);
    setFormName(t.name);
    setFormType(t.type);
    setFormChannel(t.channel);
    setFormStatus(t.status);
    setFormSubject(t.subject || '');
    setFormBody(t.body || '');
    setShowModal(true);
  };

  const saveTemplateForm = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formBody.trim()) {
      alert('Template Name and Body content are required.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (modalMode === 'add') {
      const newT = {
        id: Date.now(),
        name: formName,
        type: formType,
        channel: formChannel,
        status: formStatus,
        updated: todayStr,
        subject: formSubject,
        body: formBody
      };
      setTemplateList([newT, ...templateList]);
      if (addNotification) addNotification(`Template "${formName}" created successfully!`, 'success');
    } else {
      setTemplateList(templateList.map(item => {
        if (item.id === activeTemplate.id) {
          return {
            ...item,
            name: formName,
            type: formType,
            channel: formChannel,
            status: formStatus,
            updated: todayStr,
            subject: formSubject,
            body: formBody
          };
        }
        return item;
      }));
      if (addNotification) addNotification(`Template "${formName}" updated successfully!`, 'success');
    }
    setShowModal(false);
  };

  const duplicateTemplate = (t) => {
    const newT = {
      ...t,
      id: Date.now(),
      name: `${t.name} (Copy)`,
      updated: new Date().toISOString().split('T')[0]
    };
    setTemplateList([newT, ...templateList]);
    if (addNotification) addNotification(`Duplicated template into "${newT.name}"!`, 'success');
  };

  const deleteTemplate = (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this notification template?')) return;
    const target = templateList.find(t => t.id === id);
    setTemplateList(templateList.filter(t => t.id !== id));
    if (addNotification && target) addNotification(`Template "${target.name}" purged.`, 'warning');
  };

  const openPreview = (t) => {
    setPreviewTemplate(t);
    setShowPreviewModal(true);
  };

  return (
    <div className={`w-100 ${isGlass ? 'glass-dashboard-content' : ''}`} style={{ padding: '24px 30px', background: bg, minHeight: '100%', color: textColor }}>
      
      {/* ───── 1. FIXED HEADER CARD WITH BOTH BUTTONS WORKING ───── */}
      <div style={{
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: '20px 24px', marginBottom: 24, boxShadow: shadowSm,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: primaryGradient, color: '#fff', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(79,70,229,0.25)', flexShrink: 0
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

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Add Template Button - Fully functional onClick */}
          <button
            onClick={openAddModal}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: primaryGradient, color: '#fff', fontWeight: 600, fontSize: 12,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)' }}
          >
            <FontAwesomeIcon icon={faPlus} /> ADD TEMPLATE
          </button>

          {/* Adjusted Save Settings Button in Header */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: saveGradient, color: '#fff', fontWeight: 600, fontSize: 12,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(1,132,255,0.3)',
              transition: 'all 0.2s', opacity: saving ? 0.7 : 1
            }}
            onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(1,132,255,0.35)'; } }}
            onMouseLeave={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(1,132,255,0.3)'; } }}
          >
            {saving ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }} />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            {saving ? 'SAVING...' : 'SAVE SETTINGS'}
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success border-0 shadow-sm rounded-4 d-flex align-items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>Notification configurations updated successfully and propagated to server queues.</span>
        </div>
      )}

      {/* ───── 2. ANALYTICS ROW (Old Feature) ───── */}
      <div className="row g-4" style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="col-xl-3 col-sm-6">
            <div style={{
              background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
              padding: 20, boxShadow: shadowSm, height: '100%'
            }}>
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
            </div>
          </div>
        ))}
      </div>

      {/* ───── 3. TEMPLATES TABLE WITH COMPLETE ACTION HANDLERS (Old Feature) ───── */}
      <div style={{
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: 24, boxShadow: shadowSm, marginBottom: 24
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: textColor }}>
          Notification Templates
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1.2fr 1.5fr',
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

        {templateList.map((t, i) => (
          <div
            key={t.id || i}
            style={{
              display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1.2fr 1.5fr',
              gap: 12, padding: '12px 14px', fontSize: 13,
              borderBottom: i < templateList.length - 1 ? `1px solid ${borderColor}` : 'none',
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
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
              onClick={() => {
                const newStatus = t.status === 'Active' ? 'Inactive' : 'Active';
                setTemplateList(templateList.map(item => item.id === t.id ? { ...item, status: newStatus } : item));
              }}>
                {t.status.toUpperCase()}
              </span>
            </span>
            <span style={{ color: mutedColor, fontSize: 12 }}>{t.updated}</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {/* Edit Template */}
              <button 
                onClick={() => openEditModal(t)}
                title="Edit Template"
                style={{
                  width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifycontent: 'center',
                  color: mutedColor, fontSize: 11, transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = '#3b82f6' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}
              >
                <FontAwesomeIcon icon={faEdit} className="mx-auto" />
              </button>

              {/* Copy Template */}
              <button 
                onClick={() => duplicateTemplate(t)}
                title="Duplicate Template"
                style={{
                  width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifycontent: 'center',
                  color: mutedColor, fontSize: 11, transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = '#10b981' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}
              >
                <FontAwesomeIcon icon={faCopy} className="mx-auto" />
              </button>

              {/* View Preview */}
              <button 
                onClick={() => openPreview(t)}
                title="View Template Mockup"
                style={{
                  width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifycontent: 'center',
                  color: mutedColor, fontSize: 11, transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = '#8b5cf6' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}
              >
                <FontAwesomeIcon icon={faEye} className="mx-auto" />
              </button>

              {/* Purge Template */}
              <button 
                onClick={() => deleteTemplate(t.id)}
                title="Delete Template"
                style={{
                  width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderColor}`,
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifycontent: 'center',
                  color: mutedColor, fontSize: 11, transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor }}
              >
                <FontAwesomeIcon icon={faTrash} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ───── 4. AUDIENCE CONTROLS (Old Feature) ───── */}
      <div style={{
        background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
        padding: 24, boxShadow: shadowSm, marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
      }}>
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
      </div>

      {/* ───── 5. NEW FEATURES ROW (Email Prefs & Push Prefs) ───── */}
      <div className="row g-4" style={{ marginBottom: 24 }}>
        
        {/* Email & Digest Preferences Card */}
        <div className="col-lg-6">
          <div style={{
            background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
            padding: 24, boxShadow: shadowSm, height: '100%'
          }}>
            <div className="d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4">
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h5 className="fw-bold text-dark mb-0" style={{ color: textColor }}>Email Preferences</h5>
            </div>

            <div className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Project (PMS) Milestones</span>
                  <small className="text-muted">Receive alerts on sprint deadlines, task completions, and status changes.</small>
                </div>
                <EnableDisableButton
                  checked={emailPrefs.pmsUpdates}
                  onClick={() => setEmailPrefs({ ...emailPrefs, pmsUpdates: !emailPrefs.pmsUpdates })}
                  label="Project Milestones"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Financial (FMS) Vouchers & Budgets</span>
                  <small className="text-muted">High priority emails for pending invoice approvals and budget alerts.</small>
                </div>
                <EnableDisableButton
                  checked={emailPrefs.fmsApprovals}
                  onClick={() => setEmailPrefs({ ...emailPrefs, fmsApprovals: !emailPrefs.fmsApprovals })}
                  label="Financial Vouchers"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Attendance & HRMS Workflows</span>
                  <small className="text-muted">Alerts on biometric correction request approvals and leaves.</small>
                </div>
                <EnableDisableButton
                  checked={emailPrefs.hrmsRequests}
                  onClick={() => setEmailPrefs({ ...emailPrefs, hrmsRequests: !emailPrefs.hrmsRequests })}
                  label="HRMS Workflows"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>System Security & Logs warnings</span>
                  <small className="text-muted">Receive emergency notices on database usage caps and backup statuses.</small>
                </div>
                <EnableDisableButton
                  checked={emailPrefs.systemWarnings}
                  onClick={() => setEmailPrefs({ ...emailPrefs, systemWarnings: !emailPrefs.systemWarnings })}
                  label="System Warnings"
                />
              </div>

              <div className="pt-3 border-top mt-3">
                <label className="form-label small fw-bold text-muted uppercase">Email Digest Frequency</label>
                <select className="form-select bg-light border-0 rounded-3 text-dark-emphasis" style={{ background: inputBg, color: textColor }} value={emailPrefs.digestFrequency} onChange={e => setEmailPrefs({ ...emailPrefs, digestFrequency: e.target.value })}>
                  <option>Immediate / Real-time</option>
                  <option>Daily Summary</option>
                  <option>Weekly Digest</option>
                  <option>None (Disable digests)</option>
                </select>
                <small className="text-muted d-block mt-1">Aggregates non-urgent notifications to reduce inbox noise.</small>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time In-App Push Preferences Card */}
        <div className="col-lg-6">
          <div style={{
            background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
            padding: 24, boxShadow: shadowSm, height: '100%'
          }}>
            <div className="d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4">
              <div className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                <FontAwesomeIcon icon={faBell} />
              </div>
              <h5 className="fw-bold text-dark mb-0" style={{ color: textColor }}>Push & In-App Alerts</h5>
            </div>

            <div className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Enable Desktop Push Notifications</span>
                  <small className="text-muted">Displays real-time notifications in browser toast notifications.</small>
                </div>
                <EnableDisableButton
                  checked={pushPrefs.enablePush}
                  onClick={() => setPushPrefs({ ...pushPrefs, enablePush: !pushPrefs.enablePush })}
                  label="Desktop Push"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Show Toast Popups In-App</span>
                  <small className="text-muted">Displays sliding banners at the top-right corner of the web page.</small>
                </div>
                <EnableDisableButton
                  checked={pushPrefs.showToasts}
                  onClick={() => setPushPrefs({ ...pushPrefs, showToasts: !pushPrefs.showToasts })}
                  label="Toast Popups"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Play Audio Alert Sound</span>
                  <small className="text-muted">Triggers a subtle ping sound when a notification arrives.</small>
                </div>
                <EnableDisableButton
                  checked={pushPrefs.playSounds}
                  onClick={() => setPushPrefs({ ...pushPrefs, playSounds: !pushPrefs.playSounds })}
                  label="Audio Alert Sound"
                />
              </div>

              {/* Sound Option Selector */}
              <div className="mt-3 p-3 rounded-3" style={{ background: inputBg, border: `1px solid ${borderColor}` }}>
                <span className="fw-bold text-dark-emphasis d-block small mb-2" style={{ color: textColor, fontSize: '11px', letterSpacing: '0.04em' }}>
                  <FontAwesomeIcon icon={faVolumeUp} className="me-1 text-primary" /> SELECT NOTIFICATION SOUND
                </span>
                
                <div className="d-flex flex-column gap-2">
                  {/* Sound Option 1 */}
                  <div 
                    className="d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      background: pushPrefs.selectedSound === 'sound040' ? (isDark ? 'rgba(79, 70, 229, 0.15)' : '#e0e7ff') : 'transparent',
                      borderColor: pushPrefs.selectedSound === 'sound040' ? '#4f46e5' : borderColor,
                      opacity: pushPrefs.playSounds ? 1 : 0.6
                    }}
                    onClick={() => {
                      if (!pushPrefs.playSounds) return;
                      setPushPrefs(prev => {
                        const newPrefs = { ...prev, selectedSound: 'sound040' };
                        playPreviewSound('sound040');
                        return newPrefs;
                      });
                    }}
                  >
                    <div className="d-flex align-items-center gap-2.5">
                      <div className="form-check mb-0">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="notification_sound_selection"
                          disabled={!pushPrefs.playSounds}
                          checked={pushPrefs.selectedSound === 'sound040'}
                          onChange={() => {
                            setPushPrefs(prev => {
                              const newPrefs = { ...prev, selectedSound: 'sound040' };
                              playPreviewSound('sound040');
                              return newPrefs;
                            });
                          }}
                          style={{ cursor: pushPrefs.playSounds ? 'pointer' : 'not-allowed' }}
                        />
                      </div>
                      <div>
                        <span className="fw-bold small d-block" style={{ color: textColor }}>Sound 1: Chime Accent</span>
                        <small className="text-muted" style={{ fontSize: '11px' }}>universfield-new-notification-040.mp3</small>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); playPreviewSound('sound040'); }}
                      className="btn btn-sm d-flex align-items-center justify-content-center rounded-pill px-2.5 py-1"
                      style={{ 
                        border: 'none', 
                        background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                        color: textColor,
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} className="me-1.5" style={{ fontSize: '9px' }} /> Test
                    </button>
                  </div>

                  {/* Sound Option 2 */}
                  <div 
                    className="d-flex align-items-center justify-content-between p-2.5 rounded-3 border"
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      background: pushPrefs.selectedSound === 'sound051' ? (isDark ? 'rgba(79, 70, 229, 0.15)' : '#e0e7ff') : 'transparent',
                      borderColor: pushPrefs.selectedSound === 'sound051' ? '#4f46e5' : borderColor,
                      opacity: pushPrefs.playSounds ? 1 : 0.6
                    }}
                    onClick={() => {
                      if (!pushPrefs.playSounds) return;
                      setPushPrefs(prev => {
                        const newPrefs = { ...prev, selectedSound: 'sound051' };
                        playPreviewSound('sound051');
                        return newPrefs;
                      });
                    }}
                  >
                    <div className="d-flex align-items-center gap-2.5">
                      <div className="form-check mb-0">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="notification_sound_selection"
                          disabled={!pushPrefs.playSounds}
                          checked={pushPrefs.selectedSound === 'sound051'}
                          onChange={() => {
                            setPushPrefs(prev => {
                              const newPrefs = { ...prev, selectedSound: 'sound051' };
                              playPreviewSound('sound051');
                              return newPrefs;
                            });
                          }}
                          style={{ cursor: pushPrefs.playSounds ? 'pointer' : 'not-allowed' }}
                        />
                      </div>
                      <div>
                        <span className="fw-bold small d-block" style={{ color: textColor }}>Sound 2: Minimal Bubble</span>
                        <small className="text-muted" style={{ fontSize: '11px' }}>universfield-new-notification-051.mp3</small>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); playPreviewSound('sound051'); }}
                      className="btn btn-sm d-flex align-items-center justify-content-center rounded-pill px-2.5 py-1"
                      style={{ 
                        border: 'none', 
                        background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                        color: textColor,
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} className="me-1.5" style={{ fontSize: '9px' }} /> Test
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Preview Notification Content</span>
                  <small className="text-muted">Includes details like sender name and text snippet in popups.</small>
                </div>
                <EnableDisableButton
                  checked={pushPrefs.showPreview}
                  onClick={() => setPushPrefs({ ...pushPrefs, showPreview: !pushPrefs.showPreview })}
                  label="Preview Content"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ───── 6. NEW FEATURES ROW (Slack/Teams Integrations & DND) ───── */}
      <div className="row g-4" style={{ marginBottom: 24 }}>
        
        {/* Collaboration Webhooks Card */}
        <div className="col-lg-6">
          <div style={{
            background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
            padding: 24, boxShadow: shadowSm, height: '100%'
          }}>
            <div className="d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4">
              <div className="rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                <FontAwesomeIcon icon={faNetworkWired} />
              </div>
              <h5 className="fw-bold text-dark mb-0" style={{ color: textColor }}>Collaboration Webhooks</h5>
            </div>

            <div className="space-y-4">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark-emphasis small" style={{ color: textColor }}><FontAwesomeIcon icon={faHashtag} className="me-2 text-warning" />Slack Channel Integration</span>
                  <EnableDisableButton
                    checked={integrationPrefs.slackEnabled}
                    onClick={() => setIntegrationPrefs({ ...integrationPrefs, slackEnabled: !integrationPrefs.slackEnabled })}
                    label="Slack Integration"
                  />
                </div>
                <input 
                  type="text" 
                  disabled={!integrationPrefs.slackEnabled}
                  className="form-control bg-light border-0 text-dark-emphasis small" 
                  style={{ background: inputBg, color: textColor }}
                  placeholder="Slack Incoming Webhook URL" 
                  value={integrationPrefs.slackWebhook}
                  onChange={e => setIntegrationPrefs({ ...integrationPrefs, slackWebhook: e.target.value })}
                />
              </div>

              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark-emphasis small" style={{ color: textColor }}><FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />Microsoft Teams Webhook</span>
                  <EnableDisableButton
                    checked={integrationPrefs.teamsEnabled}
                    onClick={() => setIntegrationPrefs({ ...integrationPrefs, teamsEnabled: !integrationPrefs.teamsEnabled })}
                    label="Teams Webhook"
                  />
                </div>
                <input 
                  type="text" 
                  disabled={!integrationPrefs.teamsEnabled}
                  className="form-control bg-light border-0 text-dark-emphasis small" 
                  style={{ background: inputBg, color: textColor }}
                  placeholder="Microsoft Teams Connector Webhook URL" 
                  value={integrationPrefs.teamsWebhook}
                  onChange={e => setIntegrationPrefs({ ...integrationPrefs, teamsWebhook: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}><FontAwesomeIcon icon={faRobot} className="me-2 text-primary" />AI-Generated Summaries</span>
                  <small className="text-muted">Use local LLMs to generate high-level meeting summary digests to Slack/Teams.</small>
                </div>
                <EnableDisableButton
                  checked={integrationPrefs.aiSummaries}
                  onClick={() => setIntegrationPrefs({ ...integrationPrefs, aiSummaries: !integrationPrefs.aiSummaries })}
                  label="AI Summaries"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Do Not Disturb (DND) Quiet Period Card */}
        <div className="col-lg-6">
          <div style={{
            background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
            padding: 24, boxShadow: shadowSm, height: '100%'
          }}>
            <div className="d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4">
              <div className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <h5 className="fw-bold text-dark mb-0" style={{ color: textColor }}>Do Not Disturb (DND)</h5>
            </div>

            <div className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}>Enable Off-Hours Quiet Schedule</span>
                  <small className="text-muted">Silences push alerts during non-office evening periods.</small>
                </div>
                <EnableDisableButton
                  checked={dndPrefs.dndEnabled}
                  onClick={() => setDndPrefs({ ...dndPrefs, dndEnabled: !dndPrefs.dndEnabled })}
                  label="Quiet Schedule"
                />
              </div>

              <div className="row g-3 pt-2">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted uppercase">Quiet Period Starts</label>
                  <input 
                    type="time" 
                    disabled={!dndPrefs.dndEnabled}
                    className="form-control bg-light border-0 text-dark-emphasis" 
                    style={{ background: inputBg, color: textColor }}
                    value={dndPrefs.dndStart} 
                    onChange={e => setDndPrefs({ ...dndPrefs, dndStart: e.target.value })} 
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted uppercase">Quiet Period Ends</label>
                  <input 
                    type="time" 
                    disabled={!dndPrefs.dndEnabled}
                    className="form-control bg-light border-0 text-dark-emphasis" 
                    style={{ background: inputBg, color: textColor }}
                    value={dndPrefs.dndEnd} 
                    onChange={e => setDndPrefs({ ...dndPrefs, dndEnd: e.target.value })} 
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                <div>
                  <span className="fw-bold text-dark-emphasis d-block small" style={{ color: textColor }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-2 text-danger animate-pulse" />Bypass DND for High-Severity Alerts</span>
                  <small className="text-muted">Critical server-down incidents or FMS fraud warnings bypass DND schedules.</small>
                </div>
                <EnableDisableButton
                  checked={dndPrefs.allowHighPriority}
                  onClick={() => setDndPrefs({ ...dndPrefs, allowHighPriority: !dndPrefs.allowHighPriority })}
                  disabled={!dndPrefs.dndEnabled}
                  label="High-Severity Bypass"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ───── 7. FOOTER QUICK STATS (Old Feature) ───── */}
      <div className="row g-4" style={{ marginTop: 20 }}>
        {footerStats.map((f, i) => (
          <div key={i} className="col-md-4">
            <div style={{
              background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
              padding: '16px 20px', boxShadow: shadowSm, textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: textColor }}>{f.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ───── ADD/EDIT TEMPLATE MODAL ───── */}
      <AnimatePresence>
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050, backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`modal-content border-0 shadow-lg rounded-4 ${isDark ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}
                style={{ background: cardBg, borderColor: borderColor }}
              >
                <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0" style={{ color: textColor }}>
                    {modalMode === 'add' ? 'Create Notification Template' : 'Edit Notification Template'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn border-0 text-muted" 
                    style={{ background: 'transparent' }}
                    onClick={() => setShowModal(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
                <form onSubmit={saveTemplateForm}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted uppercase">Template Name</label>
                        <input 
                          type="text" 
                          required
                          className="form-control border-0 px-3 py-2.5 rounded-3 text-dark-emphasis"
                          style={{ background: inputBg, color: textColor }}
                          placeholder="e.g. Leave Approval Request"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                        />
                      </div>

                      {/* Type */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted uppercase">Delivery Type</label>
                        <select 
                          className="form-select border-0 px-3 py-2.5 rounded-3 text-dark-emphasis"
                          style={{ background: inputBg, color: textColor }}
                          value={formType}
                          onChange={e => setFormType(e.target.value)}
                        >
                          <option>Email</option>
                          <option>In-App</option>
                          <option>SMS</option>
                          <option>Push</option>
                        </select>
                      </div>

                      {/* Channel */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted uppercase">Workflow Channel</label>
                        <select 
                          className="form-select border-0 px-3 py-2.5 rounded-3 text-dark-emphasis"
                          style={{ background: inputBg, color: textColor }}
                          value={formChannel}
                          onChange={e => setFormChannel(e.target.value)}
                        >
                          <option>HRMS</option>
                          <option>PMS</option>
                          <option>Payroll</option>
                          <option>Finance</option>
                          <option>System</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted uppercase">Initial Status</label>
                        <select 
                          className="form-select border-0 px-3 py-2.5 rounded-3 text-dark-emphasis"
                          style={{ background: inputBg, color: textColor }}
                          value={formStatus}
                          onChange={e => setFormStatus(e.target.value)}
                        >
                          <option>Active</option>
                          <option>Inactive</option>
                        </select>
                      </div>

                      {/* Subject */}
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted uppercase">Header Subject Line (Email/Push only)</label>
                        <input 
                          type="text" 
                          className="form-control border-0 px-3 py-2.5 rounded-3 text-dark-emphasis"
                          style={{ background: inputBg, color: textColor }}
                          placeholder="e.g. Leave Application Update"
                          value={formSubject}
                          onChange={e => setFormSubject(e.target.value)}
                        />
                      </div>

                      {/* Body Content */}
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label small fw-bold text-muted uppercase mb-1">Body Text Content</label>
                          <span className="x-small text-primary fw-bold" style={{ cursor: 'pointer' }} onClick={() => setFormBody(prev => prev + ' {{employee_name}}')}>Insert variable tag</span>
                        </div>
                        <textarea 
                          rows={4}
                          required
                          className="form-control border-0 px-3 py-2.5 rounded-3 text-dark-emphasis"
                          style={{ background: inputBg, color: textColor, fontFamily: 'monospace' }}
                          placeholder="Write notification message content here... Use tags like {{employee_name}}, {{amount}}, {{date}} for dynamic binding."
                          value={formBody}
                          onChange={e => setFormBody(e.target.value)}
                        />
                      </div>

                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2">
                    <button 
                      type="button" 
                      className="btn rounded-pill px-4 text-muted bg-opacity-10 bg-secondary"
                      onClick={() => setShowModal(false)}
                      style={{ fontSize: '13px', fontWeight: 'bold' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn rounded-pill px-4 text-white border-0"
                      style={{ background: primaryGradient, fontSize: '13px', fontWeight: 'bold' }}
                    >
                      {modalMode === 'add' ? 'Create Template' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ───── VIEW TEMPLATE PREVIEW MODAL ───── */}
      <AnimatePresence>
        {showPreviewModal && previewTemplate && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`modal-content border-0 shadow-lg rounded-4 ${isDark ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}
                style={{ background: cardBg, borderColor: borderColor }}
              >
                <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0" style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faEye} className="me-2 text-primary" />Mockup Preview
                  </h5>
                  <button 
                    type="button" 
                    className="btn border-0 text-muted" 
                    style={{ background: 'transparent' }}
                    onClick={() => setShowPreviewModal(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
                <div className="modal-body p-4">
                  <span className="badge rounded-pill px-2.5 py-1 mb-3 text-uppercase" style={{ backgroundColor: `${typeColors[previewTemplate.type]?.bg}`, color: typeColors[previewTemplate.type]?.text, fontSize: '11px', fontWeight: '700' }}>
                    {previewTemplate.type} Notification
                  </span>

                  {/* Render smartphone or email layout based on type */}
                  {previewTemplate.type === 'Email' ? (
                    <div className="rounded-3 border p-3 bg-light text-dark-emphasis" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="border-bottom pb-2 mb-2 small text-muted">
                        <strong className="text-dark">Subject:</strong> {previewTemplate.subject || previewTemplate.name}
                      </div>
                      <div className="small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', color: '#334155' }}>
                        {previewTemplate.body.replace(/\{\{employee_name\}\}/g, 'Alex Carter').replace(/\{\{month\}\}/g, 'July 2026').replace(/\{\{days\}\}/g, '3')}
                      </div>
                    </div>
                  ) : previewTemplate.type === 'SMS' ? (
                    <div className="mx-auto rounded-4 border p-3 text-white" style={{ background: '#1e293b', width: '280px', fontFamily: 'monospace', position: 'relative' }}>
                      <div className="text-center border-bottom pb-1 mb-2 text-muted x-small">💬 MESSAGE PREVIEW</div>
                      <div className="rounded-3 bg-primary p-2 text-white small" style={{ fontSize: '12px', lineHeight: 1.3 }}>
                        {previewTemplate.body.replace(/\{\{voucher_id\}\}/g, 'VCH-9872').replace(/\{\{amount\}\}/g, '$450.00')}
                      </div>
                    </div>
                  ) : (
                    // Push / In-App
                    <div className="rounded-3 border p-3 text-dark d-flex gap-3 align-items-start" style={{ background: '#ffffff', borderLeft: '4px solid #4f46e5', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 34, height: 34 }}>
                        <FontAwesomeIcon icon={faBell} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h6 className="fw-bold mb-1" style={{ fontSize: '13px', color: '#1e293b' }}>{previewTemplate.subject || 'System Notification'}</h6>
                        <p className="mb-0 text-muted" style={{ fontSize: '11px', lineHeight: 1.3 }}>
                          {previewTemplate.body.replace(/\{\{days\}\}/g, '2').replace(/\{\{start_date\}\}/g, '2026-07-20')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-muted x-small text-center">
                    * Placeholder tags like <code className="text-primary">{"{{employee_name}}"}</code> have been replaced with simulated client data.
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button 
                    type="button" 
                    className="btn btn-secondary rounded-pill px-4 mx-auto"
                    onClick={() => setShowPreviewModal(false)}
                    style={{ fontSize: '13px', fontWeight: 'bold' }}
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Styles details */}
      <style dangerouslySetInnerHTML={{ __html: `
        .space-y-4 > * + * {
          margin-top: 1.25rem !important;
        }
        .space-y-2 > * + * {
          margin-top: 0.5rem !important;
        }
        .form-switch .form-check-input {
          width: 2.5em;
          height: 1.25em;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${borderColor}; border-radius: 3px; }
        .x-small { font-size: 11px; }
      `}} />

    </div>
  );
};

export default NotificationSettings;
