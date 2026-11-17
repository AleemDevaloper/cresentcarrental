import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CrmDetailLayout, CrmModal } from '../../../components/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks, faPhone, faCalendarAlt, faEnvelope, faStickyNote, faFlag,
  faUserTie, faBuilding, faHandshake, faClock, faCheck, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { getActivity, updateActivity, completeActivity, getEntityTimeline } from '../../../api/crm';
const TYPE_META = {
  task: { icon: faTasks, label: 'Task', color: '#10b981' },
  call: { icon: faPhone, label: 'Call', color: '#0ea5e9' },
  meeting: { icon: faCalendarAlt, label: 'Meeting', color: '#f59e0b' },
  email: { icon: faEnvelope, label: 'Email', color: '#6366f1' },
  note: { icon: faStickyNote, label: 'Note', color: '#a855f7' },
  follow_up: { icon: faFlag, label: 'Follow Up', color: '#ec4899' },
  system: { icon: faClock, label: 'System', color: '#64748b' },
};

const fmtDate = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const fmtDateOnly = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const InfoRow = ({ label, value, icon = null, isDark }) => {
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  return (
    <div className="d-flex align-items-start gap-2 py-2" style={{ borderBottom: `1px dashed ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
      {icon && <FontAwesomeIcon icon={icon} style={{ color: mutedColor, marginTop: 3, fontSize: '0.85rem' }} />}
      <div className="flex-grow-1">
        <div style={{ fontSize: '0.7rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500 }}>{value || '—'}</div>
      </div>
    </div>
  );
};

const CrmActivityDetail = ({ activityId, onBack }) => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activity, setActivity] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const a = await getActivity(activityId);
      const detail = a?.data ?? a;
      setActivity(detail);
      const audit = await getEntityTimeline('activity', activityId).catch(() => []);
      setAuditEvents(Array.isArray(audit) ? audit : (audit?.data || []));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activityId) loadAll(); }, [activityId]);

  const handleComplete = async () => {
    try {
      await completeActivity(activityId);
      addNotification?.({ type: 'success', message: 'Activity marked complete' });
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    }
  };

  if (loading) {
    return <ErpPageShell icon={faTasks} title="Activity" description="Loading…"><div className="text-center py-5"><div className="spinner-border text-primary" /></div></ErpPageShell>;
  }
  if (error || !activity) {
    return <ErpPageShell icon={faTasks} title="Activity" description="Error"><div className="alert alert-danger">{error || 'Not found'}</div></ErpPageShell>;
  }

  const meta = TYPE_META[activity.type] || TYPE_META.task;
  const isOpen = activity.status !== 'completed' && activity.status !== 'cancelled';

  const header = (
    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3">
        <div style={{
          width: 64, height: 64, borderRadius: '14px',
          background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700,
        }}>
          <FontAwesomeIcon icon={meta.icon} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h4 style={{ margin: 0, color: isDark ? '#e2e8f0' : '#1e293b' }}>{activity.subject || activity.title}</h4>
            <span className="badge" style={{
              background: activity.status === 'completed' ? '#dcfce7' : activity.status === 'cancelled' ? '#fee2e2' : '#dbeafe',
              color: activity.status === 'completed' ? '#16a34a' : activity.status === 'cancelled' ? '#dc2626' : '#2563eb',
            }}>
              {(activity.status || 'planned').toUpperCase()}
            </span>
            <span className="badge bg-light text-dark border">{meta.label}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>
            <FontAwesomeIcon icon={faClock} className="me-1" />
            {fmtDate(activity.due_date) || 'No due date'}
          </div>
        </div>
      </div>
      <div className="d-flex gap-2">
        {onBack && <button className="btn btn-light btn-sm" onClick={onBack}>← Back</button>}
        {isOpen && (
          <button className="btn btn-success btn-sm" onClick={handleComplete}>
            <FontAwesomeIcon icon={faCheck} className="me-1" /> Mark Complete
          </button>
        )}
      </div>
    </div>
  );

  const sidebar = (
    <div>
      <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 12 }}>Activity Information</h6>
      <InfoRow label="Type" value={meta.label} icon={meta.icon} isDark={isDark} />
      <InfoRow label="Priority" value={activity.priority} icon={faFlag} isDark={isDark} />
      <InfoRow label="Status" value={activity.status} icon={faCheck} isDark={isDark} />
      <InfoRow label="Due Date" value={fmtDate(activity.due_date)} icon={faCalendarAlt} isDark={isDark} />
      <InfoRow label="Completed At" value={fmtDate(activity.completed_at)} icon={faCheck} isDark={isDark} />
      <InfoRow label="Duration" value={activity.duration_minutes ? `${activity.duration_minutes} min` : null} icon={faClock} isDark={isDark} />
      <InfoRow label="Outcome" value={activity.outcome} icon={faCheck} isDark={isDark} />
      <InfoRow label="Assigned To" value={activity.assignedUser?.name} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Created By" value={activity.creator?.name} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Created" value={fmtDate(activity.created_at)} icon={faClock} isDark={isDark} />
      {activity.location && <InfoRow label="Location" value={activity.location} icon={faCalendarAlt} isDark={isDark} />}
    </div>
  );

  const overviewTab = (
    <div className="row g-3">
      <div className="col-md-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faUserTie} className="me-2" style={{ color: '#6366f1' }} />
          <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Lead</strong>
          <div style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem', marginTop: 4 }}>
            {activity.lead ? (activity.lead.name || activity.lead.company || `Lead #${activity.lead.id}`) : 'Not linked'}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faBuilding} className="me-2" style={{ color: '#0ea5e9' }} />
          <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Customer</strong>
          <div style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem', marginTop: 4 }}>
            {activity.customer ? (activity.customer.name || activity.customer.company || `Customer #${activity.customer.id}`) : 'Not linked'}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faUserTie} className="me-2" style={{ color: '#a855f7' }} />
          <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Contact</strong>
          <div style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem', marginTop: 4 }}>
            {activity.contact ? `${activity.contact.first_name || ''} ${activity.contact.last_name || ''}`.trim() || activity.contact.name : 'Not linked'}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faHandshake} className="me-2" style={{ color: '#10b981' }} />
          <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Deal</strong>
          <div style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem', marginTop: 4 }}>
            {activity.deal ? (activity.deal.name || `Deal #${activity.deal.id}`) : 'Not linked'}
          </div>
        </div>
      </div>
      {activity.description && (
        <div className="col-12">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Description</div>
          <div style={{
            fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap',
          }}>{activity.description}</div>
        </div>
      )}
    </div>
  );

  const auditTab = (
    <div>
      {auditEvents.length === 0 ? (
        <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>No audit events.</div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          <div style={{ position: 'absolute', left: 11, top: 8, bottom: 8, width: 2, background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }} />
          {auditEvents.map((ev, i) => (
            <div key={ev.id || i} style={{ position: 'relative', paddingBottom: '1rem' }}>
              <div style={{
                position: 'absolute', left: -22, top: 2, width: 24, height: 24, borderRadius: '50%',
                background: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff', color: isDark ? '#a5b4fc' : '#4f46e5',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                border: `2px solid ${isDark ? '#1e293b' : '#fff'}`,
              }}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div style={{ fontSize: '0.85rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>{ev.title || ev.action || ev.event}</div>
              <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 2 }}>
                {fmtDate(ev.created_at)}
                {ev.user?.name && <span style={{ marginLeft: 8 }}>• {ev.user.name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    { key: 'overview', label: 'Overview', icon: faCheck, content: overviewTab },
    { key: 'timeline', label: 'Timeline', icon: faClock, content: auditTab, count: auditEvents.length },
  ];

  return (
    <ErpPageShell icon={meta.icon} title={`${meta.label}: ${activity.subject || ''}`} description={activity.description || ''}>
      <CrmDetailLayout isDark={isDark} header={header} tabs={tabs} sidebar={sidebar} />
    </ErpPageShell>
  );
};

export default CrmActivityDetail;