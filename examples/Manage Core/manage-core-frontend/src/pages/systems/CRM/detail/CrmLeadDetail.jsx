import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CrmEntityTimeline, CrmDetailLayout, CrmQuickActivity, CrmModal, CrmStatusBadge,
} from '../../../components/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faBuilding, faMapMarkerAlt,
  faIndustry, faDollarSign, faCalendarAlt, faTag,
  faRocket, faPlus, faStickyNote, faTasks, faHandshake,
  faCircleCheck, faCheck,
  faArrowUp, faCircle, faClock,
} from '@fortawesome/free-solid-svg-icons';
import {
  getLead, listActivities, listNotes, listDeals, updateLead, deleteLead,
  listCustomers, listContacts, createNote, createFollowUp, getEntityTimeline,
} from '../../../api/crm';

const STATUS_META = {
  new: { label: 'New', color: '#6366f1' },
  contacted: { label: 'Contacted', color: '#0ea5e9' },
  qualified: { label: 'Qualified', color: '#10b981' },
  unqualified: { label: 'Unqualified', color: '#94a3b8' },
  converted: { label: 'Converted', color: '#16a34a' },
  lost: { label: 'Lost', color: '#ef4444' },
};

const RATING_META = {
  hot: { label: 'Hot', color: '#ef4444' },
  warm: { label: 'Warm', color: '#f59e0b' },
  cold: { label: 'Cold', color: '#0ea5e9' },
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
const fmtMoney = (v, currency = 'USD') => {
  const n = Number(v) || 0;
  return `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
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

const CrmLeadDetail = ({ leadId, onBack }) => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [deals, setDeals] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickActivity, setShowQuickActivity] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteSubject, setNoteSubject] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const l = await getLead(leadId);
      const detail = l?.data ?? l;
      setLead(detail);

      const [acts, nts, dls, audit] = await Promise.all([
        listActivities({ lead_id: leadId, per_page: 100 }).catch(() => ({ data: [] })),
        listNotes({ lead_id: leadId, per_page: 100 }).catch(() => ({ data: [] })),
        listDeals({ lead_id: leadId, per_page: 100 }).catch(() => ({ data: [] })),
        getEntityTimeline('lead', leadId).catch(() => []),
      ]);
      setActivities(acts?.data || []);
      setNotes(nts?.data || []);
      setDeals(dls?.data || []);
      setAuditEvents(Array.isArray(audit) ? audit : (audit?.data || []));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) loadAll();
  }, [leadId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateLead(leadId, { status: newStatus });
      addNotification?.({ type: 'success', message: `Status updated to ${STATUS_META[newStatus]?.label || newStatus}` });
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    }
  };

  const handleSaveNote = async () => {
    if (!noteSubject.trim() && !noteBody.trim()) {
      addNotification?.({ type: 'error', message: 'Add a subject or note body' });
      return;
    }
    setSavingNote(true);
    try {
      await createNote({
        subject: noteSubject || 'Note',
        content: noteBody,
        lead_id: leadId,
      });
      addNotification?.({ type: 'success', message: 'Note added' });
      setShowNoteDialog(false);
      setNoteSubject('');
      setNoteBody('');
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <ErpPageShell icon={faUserTie} title="Lead" description="Loading…">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </ErpPageShell>
    );
  }

  if (error || !lead) {
    return (
      <ErpPageShell icon={faUserTie} title="Lead" description="Error">
        <div className="alert alert-danger">{error || 'Lead not found'}</div>
        {onBack && <button className="btn btn-light" onClick={onBack}>Back</button>}
      </ErpPageShell>
    );
  }

  const statusMeta = STATUS_META[lead.status] || STATUS_META.new;
  const ratingMeta = RATING_META[lead.rating] || null;

  const header = (
    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3">
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `linear-gradient(135deg, ${statusMeta.color}, ${statusMeta.color}aa)`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700,
        }}>
          {(lead.name || lead.company || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 style={{ margin: 0, color: isDark ? '#e2e8f0' : '#1e293b' }}>{lead.name || 'Unnamed Lead'}</h4>
            <span className="badge" style={{ background: `${statusMeta.color}22`, color: statusMeta.color, fontWeight: 600 }}>
              {statusMeta.label}
            </span>
            {ratingMeta && (
              <span className="badge" style={{ background: `${ratingMeta.color}22`, color: ratingMeta.color }}>
                {ratingMeta.label}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 4 }}>
            <FontAwesomeIcon icon={faTag} className="me-1" />
            {lead.code} · Score <strong>{lead.score ?? 0}</strong>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {onBack && <button className="btn btn-light btn-sm" onClick={onBack}>← Back to Leads</button>}
        <div className="dropdown">
          <button className="btn btn-outline-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
            Change Status
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {Object.entries(STATUS_META).map(([k, m]) => (
              <li key={k}>
                <button className="dropdown-item" onClick={() => handleStatusChange(k)}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                    background: m.color, marginRight: 8,
                  }} />
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowQuickActivity(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Activity
        </button>
      </div>
    </div>
  );

  const sidebar = (
    <div>
      <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 12 }}>Lead Information</h6>
      <InfoRow label="Code" value={lead.code} icon={faTag} isDark={isDark} />
      <InfoRow label="Email" value={lead.email} icon={faEnvelope} isDark={isDark} />
      <InfoRow label="Phone" value={lead.phone} icon={faPhone} isDark={isDark} />
      <InfoRow label="Company" value={lead.company} icon={faBuilding} isDark={isDark} />
      <InfoRow label="Title" value={lead.title} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Industry" value={lead.industry} icon={faIndustry} isDark={isDark} />
      <InfoRow label="Source" value={lead.source} icon={faArrowUp} isDark={isDark} />
      <InfoRow label="Est. Value" value={lead.estimated_value ? fmtMoney(lead.estimated_value, lead.currency) : null} icon={faDollarSign} isDark={isDark} />
      <InfoRow label="Expected Close" value={fmtDateOnly(lead.expected_close_date)} icon={faCalendarAlt} isDark={isDark} />
      <InfoRow label="Assigned To" value={lead.assignedUser?.name} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Created" value={fmtDate(lead.created_at)} icon={faClock} isDark={isDark} />
      {lead.converted_at && (
        <InfoRow label="Converted At" value={fmtDate(lead.converted_at)} icon={faRocket} isDark={isDark} />
      )}
      {lead.address && (
        <InfoRow label="Address" value={`${lead.address}${lead.city ? ', ' + lead.city : ''}${lead.country ? ', ' + lead.country : ''}`} icon={faMapMarkerAlt} isDark={isDark} />
      )}
      {Array.isArray(lead.tags) && lead.tags.length > 0 && (
        <div className="mt-2">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Tags</div>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {lead.tags.map((t, i) => (
              <span key={i} className="badge bg-light text-dark border">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const overviewTab = (
    <div className="row g-3">
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Customer</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>
          {lead.customer ? (lead.customer.name || lead.customer.company || `Customer #${lead.customer.id}`) : '—'}
        </div>
      </div>
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Campaign</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>
          {lead.campaign?.name || '—'}
        </div>
      </div>
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Created By</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>
          {lead.creator?.name || '—'}
        </div>
      </div>
      <div className="col-md-6">
        <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Last Updated</div>
        <div style={{ fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>
          {fmtDate(lead.updated_at)}
        </div>
      </div>
      {lead.notes && (
        <div className="col-12">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Notes</div>
          <div style={{
            fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap',
          }}>{lead.notes}</div>
        </div>
      )}
    </div>
  );

  const activitiesTab = (
    <CrmEntityTimeline items={activities} isDark={isDark} emptyText="No activities yet. Add a task, call, or note to start tracking engagement." />
  );

  const notesTab = (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-sm btn-primary" onClick={() => setShowNoteDialog(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Note
        </button>
      </div>
      {notes.length === 0 ? (
        <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>
          No notes yet.
        </div>
      ) : (
        notes.map((n, i) => (
          <div key={n.id || i} style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            borderRadius: 10,
            padding: 12,
            marginBottom: 8,
          }}>
            <div className="d-flex justify-content-between">
              <small style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {n.creator?.name ? `By ${n.creator.name}` : 'Note'}
              </small>
              <small style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{fmtDate(n.created_at)}</small>
            </div>
            <div style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem', marginTop: 6, whiteSpace: 'pre-wrap' }}>
              {n.content || n.body || n.description || ''}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const dealsTab = (
    <div>
      {deals.length === 0 ? (
        <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>
          No deals linked to this lead.
        </div>
      ) : (
        deals.map((d, i) => (
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
              <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtMoney(d.amount, d.currency)}</strong>
            </div>
          </div>
        ))
      )}
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
    { key: 'timeline', label: 'Audit Timeline', icon: faClock, content: auditTab, count: auditEvents.length },
  ];

  return (
    <ErpPageShell icon={faUserTie} title={`Lead: ${lead.name || lead.code}`} description={lead.company || 'Lead profile'}>
      <CrmDetailLayout
        isDark={isDark}
        header={header}
        tabs={tabs}
        sidebar={sidebar}
      />

      <CrmQuickActivity
        isOpen={showQuickActivity}
        onClose={() => setShowQuickActivity(false)}
        onSaved={loadAll}
        isDark={isDark}
        leadId={leadId}
      />

      <CrmModal
        isOpen={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        title="Add Note"
        isDark={isDark}
        size="md"
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowNoteDialog(false)} disabled={savingNote}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveNote} disabled={savingNote}>
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

export default CrmLeadDetail;