import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faUserEdit, faCheckCircle, faTimesCircle, faEnvelope,
  faPhone, faCalendarAlt, faStickyNote, faTasks, faExchangeAlt,
  faPaperclip, faFlag, faArrowRight, faCircle, faClock, faTrash,
  faCommentDots, faEye, faHandshake, faBullseye, faRocket, faCircleDot,
} from '@fortawesome/free-solid-svg-icons';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const pickIcon = (item) => {
  const t = String(item?.type || item?.action || item?.event || '').toLowerCase();
  if (t.includes('convert')) return faRocket;
  if (t.includes('assign')) return faUserPlus;
  if (t.includes('stage')) return faExchangeAlt;
  if (t.includes('won')) return faTrophy;
  if (t.includes('lost')) return faTimesCircle;
  if (t.includes('email') || t.includes('mail')) return faEnvelope;
  if (t.includes('call')) return faPhone;
  if (t.includes('meeting') || t.includes('meet')) return faCalendarAlt;
  if (t.includes('note')) return faStickyNote;
  if (t.includes('task')) return faTasks;
  if (t.includes('follow')) return faFlag;
  if (t.includes('attach')) return faPaperclip;
  if (t.includes('view')) return faEye;
  if (t.includes('reply')) return faCommentDots;
  if (t.includes('create')) return faUserPlus;
  if (t.includes('update') || t.includes('edit')) return faUserEdit;
  if (t.includes('delete')) return faTrash;
  if (t.includes('handshake') || t.includes('deal')) return faHandshake;
  if (t.includes('complete')) return faCheckCircle;
  if (t.includes('open')) return faBullseye;
  return faCircleDot;
};

const pickColor = (item, isDark) => {
  const t = String(item?.type || item?.action || item?.event || '').toLowerCase();
  if (t.includes('won') || t.includes('complete') || t.includes('convert')) {
    return { bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', fg: isDark ? '#4ade80' : '#16a34a' };
  }
  if (t.includes('lost') || t.includes('delete')) {
    return { bg: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', fg: isDark ? '#f87171' : '#dc2626' };
  }
  if (t.includes('email') || t.includes('mail')) {
    return { bg: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff', fg: isDark ? '#a5b4fc' : '#4f46e5' };
  }
  if (t.includes('call')) {
    return { bg: isDark ? 'rgba(14,165,233,0.18)' : '#dbeafe', fg: isDark ? '#38bdf8' : '#0284c7' };
  }
  if (t.includes('meeting') || t.includes('meet')) {
    return { bg: isDark ? 'rgba(20,184,166,0.18)' : '#ccfbf1', fg: isDark ? '#2dd4bf' : '#0d9488' };
  }
  if (t.includes('note')) {
    return { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', fg: isDark ? '#fbbf24' : '#d97706' };
  }
  if (t.includes('stage') || t.includes('assign')) {
    return { bg: isDark ? 'rgba(168,85,247,0.18)' : '#f3e8ff', fg: isDark ? '#c084fc' : '#9333ea' };
  }
  return { bg: isDark ? 'rgba(148,163,184,0.18)' : '#f1f5f9', fg: isDark ? '#cbd5e1' : '#475569' };
};

const CrmEntityTimeline = ({ items = [], isDark = false, emptyText = 'No activity yet' }) => {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const lineColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  if (!items.length) {
    return (
      <div style={{ color: mutedColor, fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
        {emptyText}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      <div style={{
        position: 'absolute', left: 11, top: 8, bottom: 8, width: 2, background: lineColor,
      }} />
      {items.map((item, idx) => {
        const { bg, fg } = pickColor(item, isDark);
        const icon = pickIcon(item);
        const title = item?.title || item?.subject || item?.description || item?.event || item?.type || 'Activity';
        const desc = item?.description || item?.notes || item?.details || '';
        const when = item?.created_at || item?.date || item?.occurred_at;
        const actor = item?.user?.name || item?.user_name || item?.actor || item?.created_by_name || '';
        return (
          <div key={item?.id || idx} style={{ position: 'relative', paddingBottom: '1rem' }}>
            <div style={{
              position: 'absolute', left: -22, top: 2, width: 24, height: 24,
              borderRadius: '50%', background: bg, color: fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', border: `2px solid ${isDark ? '#1e293b' : '#fff'}`,
            }}>
              <FontAwesomeIcon icon={icon} />
            </div>
            <div style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500 }}>{title}</div>
            {desc && (
              <div style={{ fontSize: '0.75rem', color: mutedColor, marginTop: 2 }}>{desc}</div>
            )}
            <div style={{ fontSize: '0.7rem', color: mutedColor, marginTop: 2 }}>
              <FontAwesomeIcon icon={faClock} className="me-1" />
              {formatDate(when)}
              {actor && <span style={{ marginLeft: 8 }}>• {actor}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CrmEntityTimeline;