import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CrmEntityTimeline, CrmDetailLayout, CrmQuickActivity, CrmModal } from '../../../components/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake, faDollarSign, faCalendarAlt, faBuilding, faUserTie,
  faTag, faPlus, faStickyNote, faTasks, faEnvelope, faCheck, faClock,
  faCircle, faExchangeAlt, faTrophy, faTimesCircle, faArrowRight,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDeal, listActivities, listNotes, listPipelines, createNote,
  moveDealStage, markDealWon, markDealLost, getEntityTimeline,
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
const fmtMoney = (v, currency = 'USD') => `${currency} ${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

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

const CrmDealDetail = ({ dealId, onBack }) => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [deal, setDeal] = useState(null);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showStageMove, setShowStageMove] = useState(false);
  const [stageTarget, setStageTarget] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [savingStage, setSavingStage] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await getDeal(dealId);
      const detail = d?.data ?? d;
      setDeal(detail);
      const [acts, nts, pls, audit] = await Promise.all([
        listActivities({ deal_id: dealId, per_page: 100 }).catch(() => ({ data: [] })),
        listNotes({ deal_id: dealId, per_page: 100 }).catch(() => ({ data: [] })),
        listPipelines().catch(() => []),
        getEntityTimeline('deal', dealId).catch(() => []),
      ]);
      setActivities(acts?.data || []);
      setNotes(nts?.data || []);
      setPipelines(Array.isArray(pls) ? pls : []);
      setAuditEvents(Array.isArray(audit) ? audit : (audit?.data || []));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (dealId) loadAll(); }, [dealId]);

  const saveNote = async () => {
    if (!noteSubject.trim() && !noteBody.trim()) {
      addNotification?.({ type: 'error', message: 'Add subject or body' });
      return;
    }
    setSavingNote(true);
    try {
      await createNote({ subject: noteSubject || 'Note', content: noteBody, deal_id: dealId });
      addNotification?.({ type: 'success', message: 'Note added' });
      setShowNote(false);
      setNoteSubject('');
      setNoteBody('');
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    } finally { setSavingNote(false); }
  };

  const handleMoveStage = async () => {
    if (!stageTarget) {
      addNotification?.({ type: 'error', message: 'Select a stage' });
      return;
    }
    setSavingStage(true);
    try {
      const stageDef = (deal?.pipeline?.stages || []).find(s => s.name === stageTarget);
      const probability = stageDef?.probability ?? null;
      await moveDealStage(dealId, stageTarget, probability);
      addNotification?.({ type: 'success', message: `Moved to ${stageTarget}` });
      setShowStageMove(false);
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    } finally { setSavingStage(false); }
  };

  const handleMarkWon = async () => {
    if (!window.confirm('Mark this deal as won?')) return;
    try {
      await markDealWon(dealId);
      addNotification?.({ type: 'success', message: 'Deal marked as won 🎉' });
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    }
  };

  const handleMarkLost = async () => {
    const reason = window.prompt('Reason for losing this deal (optional):') || '';
    try {
      await markDealLost(dealId, reason);
      addNotification?.({ type: 'success', message: 'Deal marked as lost' });
      loadAll();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    }
  };

  if (loading) {
    return <ErpPageShell icon={faHandshake} title="Deal" description="Loading…"><div className="text-center py-5"><div className="spinner-border text-primary" /></div></ErpPageShell>;
  }
  if (error || !deal) {
    return <ErpPageShell icon={faHandshake} title="Deal" description="Error"><div className="alert alert-danger">{error || 'Not found'}</div></ErpPageShell>;
  }

  const stageColor = deal.status === 'won' ? '#10b981' : deal.status === 'lost' ? '#ef4444' : '#6366f1';
  const stages = deal.pipeline?.stages || [];

  const header = (
    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3">
        <div style={{
          width: 64, height: 64, borderRadius: '14px',
          background: `linear-gradient(135deg, ${stageColor}, ${stageColor}aa)`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700,
        }}>
          <FontAwesomeIcon icon={faHandshake} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h4 style={{ margin: 0, color: isDark ? '#e2e8f0' : '#1e293b' }}>{deal.name}</h4>
            <span className="badge" style={{ background: `${stageColor}22`, color: stageColor, fontWeight: 600 }}>
              {deal.status?.toUpperCase() || 'OPEN'}
            </span>
            <span className="badge bg-light text-dark border">{deal.stage || '—'}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>
            <FontAwesomeIcon icon={faTag} className="me-1" />
            {deal.code} · {fmtMoney(deal.amount, deal.currency)}
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {onBack && <button className="btn btn-light btn-sm" onClick={onBack}>← Back</button>}
        {deal.status !== 'won' && deal.status !== 'lost' && (
          <>
            <button className="btn btn-outline-primary btn-sm" onClick={() => setShowStageMove(true)}>
              <FontAwesomeIcon icon={faExchangeAlt} className="me-1" /> Move Stage
            </button>
            <button className="btn btn-success btn-sm" onClick={handleMarkWon}>
              <FontAwesomeIcon icon={faTrophy} className="me-1" /> Mark Won
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleMarkLost}>
              <FontAwesomeIcon icon={faTimesCircle} className="me-1" /> Mark Lost
            </button>
          </>
        )}
        <button className="btn btn-primary btn-sm" onClick={() => setShowActivity(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Activity
        </button>
      </div>
    </div>
  );

  const sidebar = (
    <div>
      <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 12 }}>Deal Information</h6>
      <InfoRow label="Code" value={deal.code} icon={faTag} isDark={isDark} />
      <InfoRow label="Amount" value={fmtMoney(deal.amount, deal.currency)} icon={faDollarSign} isDark={isDark} />
      <InfoRow label="Probability" value={deal.probability != null ? `${deal.probability}%` : null} icon={faCircleCheck} isDark={isDark} />
      <InfoRow label="Customer" value={deal.customer?.name || deal.customer?.company} icon={faBuilding} isDark={isDark} />
      <InfoRow label="Contact" value={deal.contact ? `${deal.contact.first_name || ''} ${deal.contact.last_name || ''}`.trim() || deal.contact.name : null} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Source Lead" value={deal.lead?.name} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Pipeline" value={deal.pipeline?.name} icon={faExchangeAlt} isDark={isDark} />
      <InfoRow label="Stage" value={deal.stage} icon={faExchangeAlt} isDark={isDark} />
      <InfoRow label="Expected Close" value={fmtDateOnly(deal.expected_close_date)} icon={faCalendarAlt} isDark={isDark} />
      <InfoRow label="Actual Close" value={fmtDateOnly(deal.actual_close_date)} icon={faCalendarAlt} isDark={isDark} />
      <InfoRow label="Owner" value={deal.assignedUser?.name} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Source" value={deal.source} icon={faTag} isDark={isDark} />
      <InfoRow label="Priority" value={deal.priority} icon={faCircle} isDark={isDark} />
      <InfoRow label="Created" value={fmtDate(deal.created_at)} icon={faClock} isDark={isDark} />
      {deal.lost_reason && <InfoRow label="Lost Reason" value={deal.lost_reason} icon={faTimesCircle} isDark={isDark} />}
      {Array.isArray(deal.tags) && deal.tags.length > 0 && (
        <div className="mt-2">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Tags</div>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {deal.tags.map((t, i) => (<span key={i} className="badge bg-light text-dark border">{t}</span>))}
          </div>
        </div>
      )}
    </div>
  );

  const overviewTab = (
    <div className="row g-3">
      <div className="col-12">
        <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Pipeline Stages</h6>
        <div className="d-flex gap-2 flex-wrap" style={{ overflowX: 'auto' }}>
          {stages.map((s) => (
            <div key={s.id} className="px-3 py-2" style={{
              background: deal.stage === s.name ? s.color || '#6366f1' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
              color: deal.stage === s.name ? '#fff' : (isDark ? '#cbd5e1' : '#475569'),
              borderRadius: 8, fontSize: '0.8rem', fontWeight: 500,
              border: `1px solid ${deal.stage === s.name ? s.color : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0')}`,
            }}>
              <FontAwesomeIcon icon={faArrowRight} className="me-1" />
              {s.name}
              {s.probability != null && <small className="ms-2 opacity-75">{s.probability}%</small>}
            </div>
          ))}
        </div>
      </div>
      {deal.description && (
        <div className="col-md-6">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Description</div>
          <div style={{
            fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap',
          }}>{deal.description}</div>
        </div>
      )}
      {deal.next_step && (
        <div className="col-md-6">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Next Step</div>
          <div style={{
            fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap',
          }}>{deal.next_step}</div>
        </div>
      )}
    </div>
  );

  const activitiesTab = (
    <CrmEntityTimeline items={activities} isDark={isDark} emptyText="No activities yet for this deal." />
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

  const auditTab = (
    <CrmEntityTimeline items={auditEvents} isDark={isDark} emptyText="No audit events yet." />
  );

  const tabs = [
    { key: 'overview', label: 'Overview', icon: faCircle, content: overviewTab },
    { key: 'activities', label: 'Activities', icon: faTasks, content: activitiesTab, count: activities.length },
    { key: 'notes', label: 'Notes', icon: faStickyNote, content: notesTab, count: notes.length },
    { key: 'timeline', label: 'Audit Timeline', icon: faClock, content: auditTab, count: auditEvents.length },
  ];

  return (
    <ErpPageShell icon={faHandshake} title={`Deal: ${deal.name}`} description={`${deal.customer?.name || ''} ${deal.customer?.company ? '· ' + deal.customer.company : ''}`.trim()}>
      <CrmDetailLayout isDark={isDark} header={header} tabs={tabs} sidebar={sidebar} />

      <CrmQuickActivity isOpen={showActivity} onClose={() => setShowActivity(false)} onSaved={loadAll} isDark={isDark} dealId={dealId} />

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

      <CrmModal
        isOpen={showStageMove}
        onClose={() => setShowStageMove(false)}
        title="Move to Stage"
        isDark={isDark}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowStageMove(false)} disabled={savingStage}>Cancel</button>
            <button className="btn btn-primary" onClick={handleMoveStage} disabled={savingStage || !stageTarget}>
              <FontAwesomeIcon icon={faCheck} className="me-1" />{savingStage ? 'Moving…' : 'Move'}
            </button>
          </>
        }
      >
        <p style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.85rem' }}>
          Move <strong>{deal.name}</strong> from <strong>{deal.stage}</strong> to:
        </p>
        <div className="d-flex flex-column gap-2">
          {stages.filter(s => s.name !== deal.stage).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStageTarget(s.name)}
              style={{
                background: stageTarget === s.name ? `${s.color}22` : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                border: `1px solid ${stageTarget === s.name ? s.color : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0')}`,
                color: stageTarget === s.name ? s.color : (isDark ? '#e2e8f0' : '#1e293b'),
                padding: '0.75rem',
                borderRadius: 8,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <strong>{s.name}</strong>
              {s.probability != null && <span className="ms-2 badge bg-light text-dark">{s.probability}%</span>}
              {s.is_won && <span className="ms-2 badge bg-success">Won</span>}
              {s.is_lost && <span className="ms-2 badge bg-danger">Lost</span>}
            </button>
          ))}
        </div>
      </CrmModal>
    </ErpPageShell>
  );
};

export default CrmDealDetail;