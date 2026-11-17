import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faExclamationTriangle, faCheckCircle, faSyncAlt,
  faBuilding, faSave, faSpinner, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { getCompanyLimits, setCompanyLimit, updateCompanyLimit } from '../../api/settings';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const UserLimits = () => {
  const [companies, setCompanies] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [editValues, setEditValues] = useState({});

  const fetchLimits = useCallback(async () => {
    setFetching(true);
    setError('');
    try {
      const data = await getCompanyLimits();
      setCompanies(data || []);
      const vals = {};
      (data || []).forEach(c => { vals[c.organization] = c.userLimit; });
      setEditValues(vals);
    } catch (e) {
      setError('Failed to fetch company limits.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchLimits(); }, [fetchLimits]);

  const handleSave = async (org) => {
    const limit = parseInt(editValues[org], 10);
    if (isNaN(limit) || limit < 0) return;
    const company = companies.find(c => c.organization === org);
    setSavingId(org);
    setError('');
    try {
      if (company?.limitId) {
        await updateCompanyLimit(company.limitId, limit);
      } else {
        await setCompanyLimit(org, limit);
      }
      await fetchLimits();
    } catch (e) {
      setError(e.message || 'Failed to save limit.');
    } finally {
      setSavingId(null);
    }
  };

  const totalUsers = companies.reduce((s, c) => s + c.userCount, 0);
  const overLimit = companies.filter(c => c.userLimit > 0 && c.userCount > c.userLimit);

  if (fetching) {
    return (
      <div className="p-5 text-center fade-in-up">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-bold" style={{ letterSpacing: '1px' }}>LOADING COMPANY LIMITS...</p>
      </div>
    );
  }

  return (
    <motion.div className="px-3" variants={itemVariants} initial="hidden" animate="visible">
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(79,70,229,0.1)' }}>
                <FontAwesomeIcon icon={faBuilding} className="text-primary fs-4" />
              </div>
              <h3 className="fw-bold mb-0">{companies.length}</h3>
              <small className="text-muted">Companies</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <FontAwesomeIcon icon={faUsers} className="text-success fs-4" />
              </div>
              <h3 className="fw-bold mb-0">{totalUsers}</h3>
              <small className="text-muted">Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <FontAwesomeIcon icon={faCheckCircle} className="text-warning fs-4" />
              </div>
              <h3 className="fw-bold mb-0">{companies.filter(c => c.userLimit > 0).length}</h3>
              <small className="text-muted">With Limits Set</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger fs-4" />
              </div>
              <h3 className="fw-bold mb-0">{overLimit.length}</h3>
              <small className="text-muted">Over Limit</small>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" />
          <div className="fw-bold">{error}</div>
          <button className="btn-close ms-auto" onClick={() => setError('')}></button>
        </div>
      )}

      {overLimit.length > 0 && (
        <div className="alert alert-warning d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" />
          <div className="fw-bold">
            {overLimit.length} compan{overLimit.length > 1 ? 'ies have' : 'y has'} exceeded the user limit.
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-primary" />
              <h5 className="fw-bold mb-0">Company Limits</h5>
            </div>
            <button className="btn btn-light border rounded-3 px-3 py-2 fw-bold shadow-xs" onClick={fetchLimits}>
              <FontAwesomeIcon icon={faSyncAlt} className="me-2" /> Refresh
            </button>
          </div>
          <div className="text-muted small mt-1">Set 0 for unlimited users</div>
        </div>
        <div className="card-body px-0 pb-0">
          {companies.length === 0 ? (
            <div className="text-center py-5 text-muted">No companies found with users.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3">Current Users</th>
                    <th className="py-3">User Limit</th>
                    <th className="py-3">Utilization</th>
                    <th className="py-3 px-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => {
                    const pct = c.userLimit > 0 ? Math.min(Math.round((c.userCount / c.userLimit) * 100), 100) : 0;
                    const over = c.userLimit > 0 && c.userCount > c.userLimit;
                    return (
                      <tr key={c.organization}>
                        <td className="py-4 px-4">
                          <div className="fw-bold">{c.organization}</div>
                        </td>
                        <td className="py-4">
                          <span className="fw-bold">{c.userCount}</span>
                        </td>
                        <td className="py-4" style={{ width: 200 }}>
                          <div className="input-group input-group-sm">
                            <input
                              type="number"
                              min="0"
                              className="form-control border-0 bg-light rounded-3 fw-bold text-center"
                              value={editValues[c.organization] ?? 0}
                              onChange={e => setEditValues(prev => ({ ...prev, [c.organization]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleSave(c.organization)}
                            />
                            <span className="input-group-text bg-transparent border-0 small text-muted">users</span>
                          </div>
                        </td>
                        <td className="py-4">
                          {c.userLimit > 0 ? (
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress" style={{ width: 120, height: 8, borderRadius: 4 }}>
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: over ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981',
                                    borderRadius: 4,
                                  }}
                                />
                              </div>
                              <small className={`fw-bold ${over ? 'text-danger' : 'text-muted'}`}>{pct}%</small>
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-end">
                          <button
                            className="btn btn-sm btn-primary rounded-3 px-3 fw-bold shadow-xs"
                            onClick={() => handleSave(c.organization)}
                            disabled={savingId === c.organization}
                          >
                            {savingId === c.organization
                              ? <FontAwesomeIcon icon={faSpinner} spin />
                              : <FontAwesomeIcon icon={faSave} className="me-1" />
                            }
                            {' '}Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserLimits;
