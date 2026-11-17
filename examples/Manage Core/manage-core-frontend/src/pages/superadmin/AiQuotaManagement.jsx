import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot, faSave, faSyncAlt, faCircleCheck, faTriangleExclamation,
  faBolt, faCoins, faCommentDots, faUserGroup, faBan, faPlus, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { getAiQuotas, setAiQuota, updateAiQuota } from '../../api/ai';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};
const fmtCost = (n) => '$' + Number(n).toFixed(2);

const ProgressBar = ({ pct, isDark, danger }) => (
  <div style={{
    height: 6, borderRadius: 6, overflow: 'hidden',
    background: isDark ? 'rgba(255,255,255,0.08)' : '#e9edf5',
  }}>
    <div style={{
      height: '100%', width: `${pct}%`, borderRadius: 6,
      background: danger ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981',
      transition: 'width .4s ease',
    }} />
  </div>
);

export default function AiQuotaManagement({ isDark }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [alert, setAlert] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ organization: '', requestLimit: 0, tokenLimit: 0, costLimit: 0, period: 'monthly', enabled: true });

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type, show: true });
  };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAiQuotas();
      setRows(data);
      const d = {};
      data.forEach(r => {
        d[r.organization] = {
          requestLimit: r.requestLimit,
          tokenLimit: r.tokenLimit,
          costLimit: r.costLimit,
          period: r.period,
          enabled: r.enabled,
          quotaId: r.quotaId,
        };
      });
      setDrafts(d);
    } catch {
      showAlert('Failed to load AI quotas', 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateDraft = (org, patch) => {
    setDrafts(prev => ({ ...prev, [org]: { ...prev[org], ...patch } }));
  };

  const save = async (org) => {
    const draft = drafts[org];
    if (!draft) return;
    setSavingId(org);
    try {
      const payload = {
        organization: org,
        requestLimit: Number(draft.requestLimit) || 0,
        tokenLimit: Number(draft.tokenLimit) || 0,
        costLimit: Number(draft.costLimit) || 0,
        period: draft.period,
        enabled: !!draft.enabled,
      };
      let saved;
      if (draft.quotaId) {
        saved = await updateAiQuota(draft.quotaId, payload);
      } else {
        saved = await setAiQuota(payload);
      }
      setDrafts(prev => ({ ...prev, [org]: { ...prev[org], quotaId: saved.id } }));
      showAlert(`AI quota for "${org}" saved.`, 'success');
    } catch {
      showAlert('Failed to save quota', 'danger');
    } finally {
      setSavingId(null);
    }
  };

  const openAdd = () => {
    setAddForm({ organization: '', requestLimit: 0, tokenLimit: 0, costLimit: 0, period: 'monthly', enabled: true });
    setShowAdd(true);
  };

  const submitAdd = async () => {
    const org = (addForm.organization || '').trim();
    if (!org) {
      showAlert('Please enter a company / organization name.', 'warning');
      return;
    }
    setAdding(true);
    try {
      const saved = await setAiQuota({
        organization: org,
        requestLimit: Number(addForm.requestLimit) || 0,
        tokenLimit: Number(addForm.tokenLimit) || 0,
        costLimit: Number(addForm.costLimit) || 0,
        period: addForm.period,
        enabled: !!addForm.enabled,
      });
      setShowAdd(false);
      showAlert(`AI quota for "${org}" created.`, 'success');
      await fetch();
    } catch {
      showAlert('Failed to create quota', 'danger');
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            <FontAwesomeIcon icon={faRobot} className="me-2" style={{ color: '#6366f1' }} />
            AI Quota Management
          </h4>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Set per-company limits for AI usage (requests, tokens & cost) with a daily, weekly or monthly reset window.
          </div>
        </div>
        <button className="btn btn-sm rounded-pill px-3 fw-bold border-0"
          style={{ background: '#6366f1', color: '#fff' }}
          onClick={fetch} disabled={loading}>
          <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'fa-spin me-1' : 'me-1'} /> Refresh
        </button>
        <button className="btn btn-sm rounded-pill px-3 fw-bold border-0"
          style={{ background: '#10b981', color: '#fff' }}
          onClick={openAdd}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Limit
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : '#fff' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
              <thead style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
                <tr className="text-uppercase" style={{ fontSize: 10, letterSpacing: '0.05em', color: '#94a3b8' }}>
                  <th className="ps-3">Company</th>
                  <th>Users</th>
                  <th style={{ width: 200 }}>Requests / period</th>
                  <th style={{ width: 200 }}>Tokens / period</th>
                  <th style={{ width: 200 }}>Cost / period</th>
                  <th style={{ width: 130 }}>Reset</th>
                  <th style={{ width: 70 }}>On</th>
                  <th style={{ width: 90 }} className="text-end pe-3">Save</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8} className="text-center py-5 text-muted">Loading…</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-5 text-muted">No companies found.</td></tr>
                )}
                {!loading && rows.map((r) => {
                  const d = drafts[r.organization] || {};
                  const danger = d.requestPct >= 100 || d.tokenPct >= 100 || d.costPct >= 100;
                  return (
                    <tr key={r.organization}>
                      <td className="ps-3 fw-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                        <FontAwesomeIcon icon={faUserGroup} className="me-2 text-primary" />
                        {r.organization}
                      </td>
                      <td className="text-muted">{r.userCount}</td>

                      {/* Requests */}
                      <td>
                        <input type="number" min={0} className="form-control form-control-sm mb-1"
                          style={inputStyle(isDark)}
                          value={d.requestLimit ?? 0}
                          onChange={e => updateDraft(r.organization, { requestLimit: e.target.value })} />
                        <div className="d-flex justify-content-between small text-muted" style={{ fontSize: 11 }}>
                          <span><FontAwesomeIcon icon={faCommentDots} className="me-1" />{fmt(r.usage.requests)}</span>
                          <span>{Math.round(r.requestPct)}%</span>
                        </div>
                        <ProgressBar pct={r.requestPct} isDark={isDark} danger={d.requestPct >= 100} />
                      </td>

                      {/* Tokens */}
                      <td>
                        <input type="number" min={0} className="form-control form-control-sm mb-1"
                          style={inputStyle(isDark)}
                          value={d.tokenLimit ?? 0}
                          onChange={e => updateDraft(r.organization, { tokenLimit: e.target.value })} />
                        <div className="d-flex justify-content-between small text-muted" style={{ fontSize: 11 }}>
                          <span><FontAwesomeIcon icon={faBolt} className="me-1" />{fmt(r.usage.tokens)}</span>
                          <span>{Math.round(r.tokenPct)}%</span>
                        </div>
                        <ProgressBar pct={r.tokenPct} isDark={isDark} danger={d.tokenPct >= 100} />
                      </td>

                      {/* Cost */}
                      <td>
                        <div className="input-group input-group-sm mb-1">
                          <span className="input-group-text" style={inputStyle(isDark)}>$</span>
                          <input type="number" min={0} step="0.01" className="form-control form-control-sm"
                            style={inputStyle(isDark)}
                            value={d.costLimit ?? 0}
                            onChange={e => updateDraft(r.organization, { costLimit: e.target.value })} />
                        </div>
                        <div className="d-flex justify-content-between small text-muted" style={{ fontSize: 11 }}>
                          <span><FontAwesomeIcon icon={faCoins} className="me-1" />{fmtCost(r.usage.cost)}</span>
                          <span>{Math.round(r.costPct)}%</span>
                        </div>
                        <ProgressBar pct={r.costPct} isDark={isDark} danger={d.costPct >= 100} />
                      </td>

                      {/* Period */}
                      <td>
                        <select className="form-select form-select-sm" style={inputStyle(isDark)}
                          value={d.period || 'monthly'}
                          onChange={e => updateDraft(r.organization, { period: e.target.value })}>
                          {PERIOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>

                      {/* Enabled */}
                      <td>
                        <div className="form-check form-switch m-0">
                          <input className="form-check-input" type="checkbox"
                            checked={!!d.enabled}
                            onChange={e => updateDraft(r.organization, { enabled: e.target.checked })} />
                        </div>
                      </td>

                      {/* Save */}
                      <td className="text-end pe-3">
                        <button className="btn btn-sm rounded-pill px-3 fw-bold border-0"
                          style={{ background: '#10b981', color: '#fff' }}
                          onClick={() => save(r.organization)}
                          disabled={savingId === r.organization}>
                          {savingId === r.organization
                            ? <span className="spinner-border spinner-border-sm" />
                            : <><FontAwesomeIcon icon={faSave} className="me-1" />Save</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 small text-muted">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning" />
        When a company's usage reaches any enabled limit, all its users receive a 429 error until the next reset period.
      </div>

      <DialogBox.Alert
        show={!!alert}
        onHide={() => setAlert(null)}
        title={alert?.type === 'danger' ? 'Error' : 'Success'}
        message={alert?.message || ''}
        variant={alert?.type === 'danger' ? 'danger' : 'success'}
      />

      {/* Add Limit Modal */}
      <DialogBox
        show={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add AI Quota Limit"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button className="btn btn-light rounded-pill px-4" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-success rounded-pill px-4 fw-bold" onClick={submitAdd} disabled={adding}>
              {adding ? 'Creating…' : 'Create Limit'}
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Company / Organization</label>
          <input type="text" className="form-control" placeholder="e.g. acme-corp"
            value={addForm.organization}
            onChange={e => setAddForm(prev => ({ ...prev, organization: e.target.value }))} />
          <div className="x-small text-muted mt-1">Enter the exact organization key used by the company's users.</div>
        </div>
        <div className="row g-3">
          <div className="col-4">
            <label className="form-label small fw-bold">Request Limit</label>
            <input type="number" min={0} className="form-control" value={addForm.requestLimit}
              onChange={e => setAddForm(prev => ({ ...prev, requestLimit: e.target.value }))} />
          </div>
          <div className="col-4">
            <label className="form-label small fw-bold">Token Limit</label>
            <input type="number" min={0} className="form-control" value={addForm.tokenLimit}
              onChange={e => setAddForm(prev => ({ ...prev, tokenLimit: e.target.value }))} />
          </div>
          <div className="col-4">
            <label className="form-label small fw-bold">Cost Limit ($)</label>
            <input type="number" min={0} step="0.01" className="form-control" value={addForm.costLimit}
              onChange={e => setAddForm(prev => ({ ...prev, costLimit: e.target.value }))} />
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-8">
            <label className="form-label small fw-bold">Reset Period</label>
            <select className="form-select" value={addForm.period}
              onChange={e => setAddForm(prev => ({ ...prev, period: e.target.value }))}>
              {PERIOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="col-4 d-flex align-items-end">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="addEnabled"
                checked={!!addForm.enabled}
                onChange={e => setAddForm(prev => ({ ...prev, enabled: e.target.checked }))} />
              <label className="form-check-label small fw-bold" htmlFor="addEnabled">Enabled</label>
            </div>
          </div>
        </div>
      </DialogBox>
    </motion.div>
  );
}

const inputStyle = (isDark) => ({
  background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
  color: isDark ? '#e2e8f0' : '#1e293b',
  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #d8dee9',
  fontSize: 12,
});
