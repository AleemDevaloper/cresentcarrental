import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CrmEntityTimeline, CrmDetailLayout } from '../../../components/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullhorn, faUsers, faEnvelope, faCalendarAlt, faDollarSign,
  faTag, faCircleCheck, faUserTie, faClock, faCircle, faHandshake,
  faTasks, faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { getCampaign, listActivities, listDeals, getEntityTimeline } from '../../../api/crm';
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
const fmtMoney = (v, currency = 'USD') => `${currency} ${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const fmtNum = (v) => Number(v || 0).toLocaleString();

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

const CrmCampaignDetail = ({ campaignId, onBack }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [campaign, setCampaign] = useState(null);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await getCampaign(campaignId);
      const detail = c?.data ?? c;
      setCampaign(detail);
      const [acts, dls, audit] = await Promise.all([
        listActivities({ assigned_to: campaign?.assigned_to, per_page: 100 }).catch(() => ({ data: [] })),
        listDeals({ source: campaign?.name, per_page: 100 }).catch(() => ({ data: [] })),
        getEntityTimeline('campaign', campaignId).catch(() => []),
      ]);
      setActivities(acts?.data || []);
      setDeals(dls?.data || []);
      setAuditEvents(Array.isArray(audit) ? audit : (audit?.data || []));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (campaignId) loadAll(); }, [campaignId]);

  if (loading) {
    return <ErpPageShell icon={faBullhorn} title="Campaign" description="Loading…"><div className="text-center py-5"><div className="spinner-border text-primary" /></div></ErpPageShell>;
  }
  if (error || !campaign) {
    return <ErpPageShell icon={faBullhorn} title="Campaign" description="Error"><div className="alert alert-danger">{error || 'Not found'}</div></ErpPageShell>;
  }

  const isActive = campaign.status === 'active' || campaign.status === 'running';
  const statusColor = isActive ? '#10b981' : campaign.status === 'completed' ? '#6366f1' : '#94a3b8';

  const header = (
    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3">
        <div style={{
          width: 64, height: 64, borderRadius: '14px',
          background: `linear-gradient(135deg, ${statusColor}, ${statusColor}aa)`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700,
        }}>
          <FontAwesomeIcon icon={faBullhorn} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h4 style={{ margin: 0, color: isDark ? '#e2e8f0' : '#1e293b' }}>{campaign.name}</h4>
            <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, fontWeight: 600 }}>
              {(campaign.status || 'draft').toUpperCase()}
            </span>
            <span className="badge bg-light text-dark border">{campaign.type || 'general'}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            {fmtDateOnly(campaign.start_date)} → {fmtDateOnly(campaign.end_date)}
          </div>
        </div>
      </div>
      <div>
        {onBack && <button className="btn btn-light btn-sm" onClick={onBack}>← Back</button>}
      </div>
    </div>
  );

  const sidebar = (
    <div>
      <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 12 }}>Campaign Information</h6>
      <InfoRow label="Code" value={campaign.code} icon={faTag} isDark={isDark} />
      <InfoRow label="Type" value={campaign.type} icon={faBullhorn} isDark={isDark} />
      <InfoRow label="Status" value={campaign.status} icon={faCircleCheck} isDark={isDark} />
      <InfoRow label="Budget" value={campaign.budget ? fmtMoney(campaign.budget, campaign.currency) : null} icon={faDollarSign} isDark={isDark} />
      <InfoRow label="Actual Cost" value={campaign.actual_cost ? fmtMoney(campaign.actual_cost, campaign.currency) : null} icon={faDollarSign} isDark={isDark} />
      <InfoRow label="Expected Revenue" value={campaign.expected_revenue ? fmtMoney(campaign.expected_revenue, campaign.currency) : null} icon={faArrowUp} isDark={isDark} />
      <InfoRow label="Start Date" value={fmtDateOnly(campaign.start_date)} icon={faCalendarAlt} isDark={isDark} />
      <InfoRow label="End Date" value={fmtDateOnly(campaign.end_date)} icon={faCalendarAlt} isDark={isDark} />
      <InfoRow label="Owner" value={campaign.owner?.name || campaign.assignedUser?.name} icon={faUserTie} isDark={isDark} />
      <InfoRow label="Created" value={fmtDate(campaign.created_at)} icon={faClock} isDark={isDark} />
      {Array.isArray(campaign.tags) && campaign.tags.length > 0 && (
        <div className="mt-2">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Tags</div>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {campaign.tags.map((t, i) => (<span key={i} className="badge bg-light text-dark border">{t}</span>))}
          </div>
        </div>
      )}
    </div>
  );

  const overviewTab = (
    <div className="row g-3">
      <div className="col-md-3 col-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faUsers} style={{ color: '#6366f1' }} className="me-1" />
          <span style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Recipients</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtNum(campaign.recipients_count ?? campaign.recipients)}</div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ color: '#10b981' }} className="me-1" />
          <span style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Sent</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtNum(campaign.sent_count ?? campaign.sent)}</div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#0ea5e9' }} className="me-1" />
          <span style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Opened</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtNum(campaign.opened_count ?? campaign.opened)}</div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div style={{ padding: 12, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
          <FontAwesomeIcon icon={faHandshake} style={{ color: '#f59e0b' }} className="me-1" />
          <span style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Converted</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtNum(campaign.converted_count ?? campaign.converted)}</div>
        </div>
      </div>
      {campaign.description && (
        <div className="col-12">
          <div style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Description</div>
          <div style={{
            fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#1e293b',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap',
          }}>{campaign.description}</div>
        </div>
      )}
    </div>
  );

  const dealsTab = (
    <div>
      {deals.length === 0 ? (
        <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>No deals linked to this campaign.</div>
      ) : deals.map((d, i) => (
        <div key={d.id || i} className="d-flex align-items-center justify-content-between" style={{
          padding: 10, marginBottom: 8,
          background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
          borderRadius: 8,
        }}>
          <div>
            <FontAwesomeIcon icon={faHandshake} className="me-2" style={{ color: '#10b981' }} />
            <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontSize: '0.85rem' }}>{d.name}</strong>
          </div>
          <div>
            <span className="badge bg-light text-dark me-2">{d.stage}</span>
            <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{fmtMoney(d.amount, d.currency)}</strong>
          </div>
        </div>
      ))}
    </div>
  );

  const activitiesTab = (
    <CrmEntityTimeline items={activities} isDark={isDark} emptyText="No activities yet." />
  );

  const auditTab = (
    <CrmEntityTimeline items={auditEvents} isDark={isDark} emptyText="No audit events yet." />
  );

  const tabs = [
    { key: 'overview', label: 'Overview', icon: faCircle, content: overviewTab },
    { key: 'deals', label: 'Deals', icon: faHandshake, content: dealsTab, count: deals.length },
    { key: 'activities', label: 'Activities', icon: faTasks, content: activitiesTab, count: activities.length },
    { key: 'timeline', label: 'Audit', icon: faClock, content: auditTab, count: auditEvents.length },
  ];

  return (
    <ErpPageShell icon={faBullhorn} title={`Campaign: ${campaign.name}`} description={campaign.description || ''}>
      <CrmDetailLayout isDark={isDark} header={header} tabs={tabs} sidebar={sidebar} />
    </ErpPageShell>
  );
};

export default CrmCampaignDetail;