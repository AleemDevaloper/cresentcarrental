import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CrmEntityTimeline, CrmDetailLayout, CrmQuickActivity, CrmModal } from '../../../components/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faBuilding, faBriefcase,
  faMapMarkerAlt, faTag, faPlus, faStickyNote, faTasks, faHandshake,
  faCheck, faClock, faCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getContact, listActivities, listNotes, listDeals, createNote, getEntityTimeline,
} from '../../../api/crm';
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

const CrmContactDetail = ({ contactId, onBack }) => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [contact, setContact] = useState(null);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [deals, setDeals] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [noteSubject, setNoteSubject] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await getContact(contactId);
      const detail = c?.data ?? c;
      setContact(detail);
      const [acts, nts, dls, audit] = await Promise.all([
        listActivities({ contact_id: contactId, per_page: 100 }).catch(() => ({ data: [] })),
        listNotes({ contact_id: contactId, per_page: 100 }).catch(() => ({ data: [] })),
        listDeals({ contact_id: contactId, per_page: 100 }).catch(() => ({ data: [] })),
        getEntityTimeline('contact', contactId).catch(() => []),
      ]);
      setActivities(acts?.data || []);
      setNotes(nts?.data || []);
      setDeals(dls?.data || []);
      setAuditEvents(Array.isArray(audit) ? audit : (audit?.data || []));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load contact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (contactId) loadAll(); }, [contactId]);

  const saveNote = async () => {
    if (!noteSubject.trim() && !noteBody.trim()) {
      addNotification?.({ type: 'error', message: 'Add subject or body' });
      return;
    }
    setSavingNote(true);
    try {
      await createNote({ subject: noteSubject || 'Note', content: noteBody, contact_id: contactId });
      addNotification?.({ type: 'success', message: 'Note added' });
      setShowNote(false);
      setNoteSubject('');
      setNoteBody('');
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    } finally { setSavingNote(false); }
  };

  if (loading) {
    return <ErpPageShell icon={faUserTie} title="Contact" description="Loading…"><div className="text-center py-5"><div className="spinner-border text-primary" /></div></ErpPageShell>;
  }
  if (error || !contact) {
    return <ErpPageShell icon={faUserTie} title="Contact" description="Error"><div className="alert alert-danger">{error || 'Not found'}</div></ErpPageShell>;
  }

  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || contact.name || 'Contact';

  const header = (
    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3">
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700,
        }}>
          {fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 style={{ margin: 0, color: isDark ? '#e2e8f0' : '#1e293b' }}>{fullName}</h4>
          <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>
            <FontAwesomeIcon icon={faTag} className="me-1" />
            {contact.code} · <FontAwesomeIcon icon={faBriefcase} className="me-1" />{contact.title || '—'}
          </div>
        </div>
      </div>
      <div className="d-flex gap-2">
        {onBack && <button className="btn btn-light btn-sm" onClick={onBack}>← Back</button>}
        <button className="btn btn-primary btn-sm" onClick={() => setShowActivity(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Activity
        </button>
      </div>
    </div>
  );

  const sidebar = (
    <div>
      <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 12 }}>Contact Information</h6>
      <InfoRow label="Code" value={contact.code} icon={faTag} isDark={isDark} />
      <InfoRow label="Email" value={contact.email} icon={faEnvelope} isDark={isDark} />
      <InfoRow label="Phone" value={contact.phone} icon={faPhone} isDark={isDark} />
      <InfoRow label="Mobile" value={contact.mobile} icon={faPhone} isDark={isDark} />
      <InfoRow label="Title" value={contact.title} icon={faBriefcase} isDark={isDark} />
      <InfoRow label="Department" value={contact.department} icon={faBriefcase} isDark={isDark} />
      <InfoRow label="Company" value={contact.customer?.name || contact.customer?.company} icon={faBuilding} isDark={isDark} />
      <InfoRow label="Source" value={contact.source} icon={faTag} isDark={isDark} />
      <InfoRow label="Status" value={contact.status} icon={faCircle} isDark={isDark} />
      <InfoRow label="Created" value={fmtDate(contact.created_at)} icon={faClock} isDark={isDark} />
      {contact.linkedin && <InfoRow label="LinkedIn" value={contact.linkedin} icon={faUserTie} isDark={isDark} />}
      {Array.isArray(contact.tags) && contact.tags.length > 0 && (
        <div className="mt-2">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Tags</div>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {contact.tags.map((t, i) => (<span key={i} className="badge bg-light text-dark border">{t}</span>))}
          </div>
        </div>
      )}
    </div>
  );

  const overviewTab = (
    <div className="row g-3">
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Assigned To</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>{contact.assignedUser?.name || '—'}</div>
      </div>
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Created By</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>{contact.creator?.name || '—'}</div>
      </div>
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Twitter</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>{contact.twitter || '—'}</div>
      </div>
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Last Updated</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtDate(contact.updated_at)}</div>
      </div>
    </div>
  );

  const activitiesTab = (
    <CrmEntityTimeline items={activities} isDark={isDark} emptyText="No activities yet for this contact." />
  );

  const notesTab = (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-sm btn-primary" onClick={() => setShowNote(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Note
        </button>
      </div>
      {notes.length === 0 ? (
        <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>No notes yet.</div>
      ) : notes.map((n, i) => (
        <div key={n.id || i} style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
          borderRadius: 10, padding: 12, marginBottom: 8,
        }}>
          <div className="d-flex justify-content-between">
            <small style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{n.creator?.name ? `By ${n.creator.name}` : 'Note'}</small>
            <small style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{fmtDate(n.created_at)}</small>
          </div>
          <div style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem', marginTop: 6, whiteSpace: 'pre-wrap' }}>
            {n.content || n.body || n.description || ''}
          </div>
        </div>
      ))}
    </div>
  );

  const dealsTab = (
    <div>
      {deals.length === 0 ? (
        <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>No deals linked.</div>
      ) : deals.map((d, i) => (
        <div key={d.id || i} className="d-flex align-items-center justify-content-between" style={{
          padding: 10, marginBottom: 8,
          background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
          borderRadius: 8,
        }}>
          <div>
            <FontAwesomeIcon icon={faHandshake} className="me-2" style={{ color: '#10b981' }} />
            <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontSize: '0.85rem' }}>{d.name}</strong>
            <small className="ms-2" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{d.code}</small>
          </div>
          <div>
            <span className="badge bg-info me-2">{d.stage}</span>
            <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{(d.currency || 'USD')} {Number(d.amount || 0).toLocaleString()}</strong>
          </div>
        </div>
      ))}
    </div>
  );

  const auditTab = (
    <CrmEntityTimeline items={auditEvents} isDark={isDark} emptyText="No audit events yet." />
  );

  const tabs = [
    { key: 'overview', label: 'Overview', icon: faCircle, content: overviewTab },
    { key: 'activities', label: 'Activities', icon: faTasks, content: activitiesTab, count: activities.length },
    { key: 'notes', label: 'Notes', icon: faStickyNote, content: notesTab, count: notes.length },
    { key: 'deals', label: 'Deals', icon: faHandshake, content: dealsTab, count: deals.length },
    { key: 'timeline', label: 'Audit', icon: faClock, content: auditTab, count: auditEvents.length },
  ];

  return (
    <ErpPageShell icon={faUserTie} title={`Contact: ${fullName}`} description={contact.title || 'Contact profile'}>
      <CrmDetailLayout isDark={isDark} header={header} tabs={tabs} sidebar={sidebar} />
      <CrmQuickActivity isOpen={showActivity} onClose={() => setShowActivity(false)} onSaved={loadAll} isDark={isDark} contactId={contactId} />
      <CrmModal
        isOpen={showNote}
        onClose={() => setShowNote(false)}
        title="Add Note"
        isDark={isDark}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowNote(false)} disabled={savingNote}>Cancel</button>
            <button className="btn btn-primary" onClick={saveNote} disabled={savingNote}>
              <FontAwesomeIcon icon={faCheck} className="me-1" />{savingNote ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <label className="form-label">Subject</label>
        <input className="form-control mb-2" value={noteSubject} onChange={(e) => setNoteSubject(e.target.value)} />
        <label className="form-label">Note</label>
        <textarea className="form-control" rows="5" value={noteBody} onChange={(e) => setNoteBody(e.target.value)} />
      </CrmModal>
    </ErpPageShell>
  );
};

export default CrmContactDetail;