import React, { useState } from 'react';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { EnableDisableButton } from '../../../components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faSave, faGlobe, faLanguage, faClock,
  faDollarSign, faGraduationCap, faPercent, faBell,
  faEnvelope, faSms, faMobileAlt, faShieldAlt,
  faKey, faUserLock, faExclamationTriangle,
  faCheckCircle, faBuilding, faImage, faPalette,
  faSlidersH, faToggleOn
} from '@fortawesome/free-solid-svg-icons';

const EmsSettings = () => {
  const { theme, addNotification } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [settings, setSettings] = useState({
    general: { institutionName: 'ManageCore University', logo: '', language: 'en', timezone: 'Asia/Karachi', currency: 'PKR' },
    academic: { gradingSystem: 'GPA (4.0)', passingCriteria: '40%', attendanceRule: '75% minimum', semesterSystem: 'Semester' },
    notifications: { email: true, sms: true, push: false, feeReminders: true, attendanceAlerts: true, examNotifications: true },
    security: { passwordPolicy: 'Strong', sessionTimeout: '30', twoFactor: false, maxLoginAttempts: '5' },
  });

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const handleSave = () => {
    addNotification?.('Settings saved successfully', 'success');
  };

  const SectionHeader = ({ icon, title, description }) => (
    <div className="d-flex align-items-center gap-3 mb-4">
      <div className="p-2 rounded-3" style={{ background: `${colors.primary}15` }}>
        <FontAwesomeIcon icon={icon} style={{ color: colors.primary, fontSize: '16px' }} />
      </div>
      <div>
        <h6 className="fw-bold mb-0" style={{ color: textColor }}>{title}</h6>
        <span className="x-small" style={{ color: mutedColor }}>{description}</span>
      </div>
    </div>
  );

  const FormField = ({ label, icon, children }) => (
    <div className="mb-3">
      <label className="small fw-bold text-muted mb-2">{icon && <FontAwesomeIcon icon={icon} className="me-1" />}{label}</label>
      {children}
    </div>
  );

  const Toggle = ({ label, value, onChange }) => (
    <div className="d-flex align-items-center justify-content-between py-2">
      <span className="small fw-semibold" style={{ color: textColor }}>{label}</span>
      <EnableDisableButton checked={value} onClick={() => onChange(!value)} label={label} />
    </div>
  );

  const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4' };

  return (
    <div className={`p-4 ${isDark ? 'text-white' : ''}`} style={{ background: isDark ? 'linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)' : 'linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)', minHeight: '100vh' }}>
      <div className={`rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? 'bg-dark border border-secondary' : 'bg-white'}`} style={{ background: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.92)', border: `1px solid ${borderColor}`, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.12)', color: colors.primary }}>
              <FontAwesomeIcon icon={faCog} size="xl" />
            </div>
            <div>
              <h4 className="fw-bold mb-1">EMS Settings</h4>
              <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Configure institutional preferences and policies</p>
            </div>
          </div>
          <button className="btn btn-primary rounded-3 px-4 d-flex align-items-center gap-2" onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} /> Save Settings
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <SectionHeader icon={faBuilding} title="General Settings" description="Basic institution information" />
            <FormField label="Institution Name" icon={faBuilding}>
              <input type="text" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.general.institutionName} onChange={e => setSettings({...settings, general: {...settings.general, institutionName: e.target.value}})} />
            </FormField>
            <div className="row g-3">
              <div className="col-md-6">
                <FormField label="Language" icon={faLanguage}>
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.general.language} onChange={e => setSettings({...settings, general: {...settings.general, language: e.target.value}})}>
                    <option value="en">English</option><option value="ur">Urdu</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Timezone" icon={faClock}>
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.general.timezone} onChange={e => setSettings({...settings, general: {...settings.general, timezone: e.target.value}})}>
                    <option value="Asia/Karachi">Asia/Karachi</option><option value="Asia/Dubai">Asia/Dubai</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Currency" icon={faDollarSign}>
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.general.currency} onChange={e => setSettings({...settings, general: {...settings.general, currency: e.target.value}})}>
                    <option value="PKR">PKR (Rs.)</option><option value="USD">USD ($)</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Logo" icon={faImage}>
                  <input type="file" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} />
                </FormField>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <SectionHeader icon={faShieldAlt} title="Security Settings" description="Authentication and access policies" />
            <div className="row g-3">
              <div className="col-md-6">
                <FormField label="Password Policy" icon={faKey}>
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.security.passwordPolicy} onChange={e => setSettings({...settings, security: {...settings.security, passwordPolicy: e.target.value}})}>
                    <option value="Weak">Weak</option><option value="Medium">Medium</option><option value="Strong">Strong</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Session Timeout (minutes)" icon={faClock}>
                  <input type="number" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.security.sessionTimeout} onChange={e => setSettings({...settings, security: {...settings.security, sessionTimeout: e.target.value}})} />
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Max Login Attempts" icon={faUserLock}>
                  <input type="number" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.security.maxLoginAttempts} onChange={e => setSettings({...settings, security: {...settings.security, maxLoginAttempts: e.target.value}})} />
                </FormField>
              </div>
              <div className="col-md-6">
                <Toggle label="Two-Factor Authentication" value={settings.security.twoFactor} onChange={v => setSettings({...settings, security: {...settings.security, twoFactor: v}})} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <SectionHeader icon={faGraduationCap} title="Academic Settings" description="Grading and academic policies" />
            <div className="row g-3">
              <div className="col-md-6">
                <FormField label="Grading System">
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.academic.gradingSystem} onChange={e => setSettings({...settings, academic: {...settings.academic, gradingSystem: e.target.value}})}>
                    <option value="GPA (4.0)">GPA (4.0)</option><option value="GPA (5.0)">GPA (5.0)</option><option value="Percentage">Percentage</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Passing Criteria" icon={faPercent}>
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.academic.passingCriteria} onChange={e => setSettings({...settings, academic: {...settings.academic, passingCriteria: e.target.value}})}>
                    <option value="40%">40%</option><option value="50%">50%</option><option value="60%">60%</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Attendance Rule">
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.academic.attendanceRule} onChange={e => setSettings({...settings, academic: {...settings.academic, attendanceRule: e.target.value}})}>
                    <option value="75% minimum">75% minimum</option><option value="80% minimum">80% minimum</option><option value="85% minimum">85% minimum</option>
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Semester System">
                  <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={settings.academic.semesterSystem} onChange={e => setSettings({...settings, academic: {...settings.academic, semesterSystem: e.target.value}})}>
                    <option value="Semester">Semester</option><option value="Annual">Annual</option><option value="Quarter">Quarter</option>
                  </select>
                </FormField>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <SectionHeader icon={faBell} title="Notification Settings" description="Configure communication channels" />
            <div className="mb-3">
              <Toggle label="Email Notifications" icon={faEnvelope} value={settings.notifications.email} onChange={v => setSettings({...settings, notifications: {...settings.notifications, email: v}})} />
              <Toggle label="SMS Notifications" icon={faSms} value={settings.notifications.sms} onChange={v => setSettings({...settings, notifications: {...settings.notifications, sms: v}})} />
              <Toggle label="Push Notifications" icon={faMobileAlt} value={settings.notifications.push} onChange={v => setSettings({...settings, notifications: {...settings.notifications, push: v}})} />
              <hr style={{ borderColor }} />
              <Toggle label="Fee Reminders" value={settings.notifications.feeReminders} onChange={v => setSettings({...settings, notifications: {...settings.notifications, feeReminders: v}})} />
              <Toggle label="Attendance Alerts" value={settings.notifications.attendanceAlerts} onChange={v => setSettings({...settings, notifications: {...settings.notifications, attendanceAlerts: v}})} />
              <Toggle label="Exam Notifications" value={settings.notifications.examNotifications} onChange={v => setSettings({...settings, notifications: {...settings.notifications, examNotifications: v}})} />
            </div>
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default EmsSettings;
