import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faExclamationTriangle, faCheckCircle, faSyncAlt,
  faDatabase, faBuilding, faSpinner, faSave,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../hooks/useApp';
import { getCompanyLimits } from '../../api/settings';

const DataLimits = () => {
  const { currentUser } = useApp();
  const [companies, setCompanies] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const fetchLimits = useCallback(async () => {
    setFetching(true);
    setError('');
    try {
      const data = await getCompanyLimits();
      setCompanies(data || []);
    } catch (e) {
      setError('Failed to fetch limits.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchLimits(); }, [fetchLimits]);

  const userOrg = currentUser?.organization;
  const myCompany = companies.find(c => c.organization === userOrg);
  const totalUsers = companies.reduce((s, c) => s + c.userCount, 0);

  if (fetching) {
    return (
      <div className="p-5 text-center fade-in-up">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-bold" style={{ letterSpacing: '1px' }}>LOADING LIMITS...</p>
      </div>
    );
  }

  return (
    <div className="p-4 fade-in-up">
      <div className="row mb-4 align-items-end">
        <div className="col">
          <h2 className="fw-900 mb-1">
            <span className="me-2" style={{ color: '#4f46e5' }}>
              <FontAwesomeIcon icon={faDatabase} />
            </span>
            Data Limits
          </h2>
          <p className="text-muted mb-0">View your company's user limits and resource usage.</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-white shadow-sm border rounded-3 px-4 py-2 fw-bold" onClick={fetchLimits}>
            <FontAwesomeIcon icon={faSyncAlt} className="me-2" /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" />
          <div className="fw-bold">{error}</div>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <FontAwesomeIcon icon={faBuilding} size="lg" />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">{userOrg || 'Your Company'}</h6>
                  <small className="text-muted">Current user usage</small>
                </div>
              </div>
              {myCompany ? (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">{myCompany.userCount} users</span>
                    {myCompany.userLimit > 0 && (
                      <span className="text-muted">of {myCompany.userLimit} limit</span>
                    )}
                  </div>
                  {myCompany.userLimit > 0 ? (
                    <div className="progress" style={{ height: 12, borderRadius: 6 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(Math.round((myCompany.userCount / myCompany.userLimit) * 100), 100)}%`,
                          backgroundColor: myCompany.userCount > myCompany.userLimit ? '#ef4444' : '#3b82f6',
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-muted small mb-0 mt-2">No limit set — unlimited users allowed.</p>
                  )}
                  {myCompany.userLimit > 0 && myCompany.userCount > myCompany.userLimit && (
                    <div className="alert alert-danger py-2 px-3 mt-3 mb-0 rounded-3 small fw-bold">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                      User limit exceeded by {myCompany.userCount - myCompany.userLimit} user(s)
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted small mb-0">No usage data available for your company.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="card-body text-center p-4">
              <div className="fs-1 text-primary mb-2"><FontAwesomeIcon icon={faBuilding} /></div>
              <h3 className="fw-bold mb-0">{companies.length}</h3>
              <small className="text-muted">Companies</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="card-body text-center p-4">
              <div className="fs-1 text-info mb-2"><FontAwesomeIcon icon={faUsers} /></div>
              <h3 className="fw-bold mb-0">{totalUsers}</h3>
              <small className="text-muted">Total Active Users</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-primary" />
            <h5 className="fw-900 mb-0">Company Usage Overview</h5>
          </div>
        </div>
        <div className="card-body px-0 pb-0">
          {companies.length === 0 ? (
            <div className="text-center py-5 text-muted">No data available.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted extra-small text-uppercase fw-900" style={{ fontSize: '10px' }}>
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3">Active Users</th>
                    <th className="py-3">User Limit</th>
                    <th className="py-3 px-4">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => {
                    const pct = c.userLimit > 0 ? Math.min(Math.round((c.userCount / c.userLimit) * 100), 100) : 0;
                    const over = c.userLimit > 0 && c.userCount > c.userLimit;
                    return (
                      <tr key={c.organization} className="border-bottom-0">
                        <td className="py-4 px-4">
                          <div className="fw-900">{c.organization}</div>
                        </td>
                        <td className="py-4">
                          <span className="fw-900">{c.userCount}</span>
                        </td>
                        <td className="py-4">
                          {c.userLimit > 0 ? (
                            <span className="fw-900">{c.userLimit}</span>
                          ) : (
                            <span className="text-muted">Unlimited</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {c.userLimit > 0 ? (
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress" style={{ width: 150, height: 8, borderRadius: 4 }}>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fw-900{font-weight:900;}
        .fade-in-up { animation: fadeInUp 0.5s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .extra-small{font-size:0.75rem;}
      `}</style>
    </div>
  );
};

export default DataLimits;
