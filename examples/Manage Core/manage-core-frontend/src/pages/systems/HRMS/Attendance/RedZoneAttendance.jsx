import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire, faTriangleExclamation, faUsers, faChartBar, faChartLine,
  faBell, faGauge, faClock, faUserXmark, faFingerprint,
  faClock as faClockIcon, faExclamationCircle, faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getRedZoneData } from '../../../../api/hrms';

const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const RISK_COLORS = { Low: 'success', Medium: 'warning', High: 'danger', Critical: 'dark' };

const RedZoneAttendance = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [redZoneData, setRedZoneData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getRedZoneData();
      setRedZoneData(data);
    } catch {
      addNotification(t('Failed to load red zone data'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const riskScore = redZoneData?.enterprise_risk_score ?? 42;
  const employees = redZoneData?.employees || [];
  const alerts = redZoneData?.alerts || [];
  const departmentBreakdown = redZoneData?.department_breakdown || [];
  const riskTrend = redZoneData?.risk_trend || [];

  const getColor = (level) => RISK_COLORS[level] || 'secondary';

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faFire} className="me-2 text-danger" />{t('Red Zone Attendance')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Risk monitoring and compliance tracking')}</p>
        </div>
        <span className="badge bg-danger rounded-pill px-3 py-2">
          <FontAwesomeIcon icon={faBell} className="me-1" />{alerts.length} {t('Alerts')}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
      ) : (
        <div className="row g-4">
          {/* Risk Score Gauge */}
          <div className="col-lg-4">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-4 text-center">
                <h6 className="fw-bold mb-4">{t('Enterprise Risk Score')}</h6>
                <div className="position-relative d-inline-block mb-3">
                  <div className={`rounded-circle d-flex align-items-center justify-content-center ${riskScore > 70 ? 'bg-danger' : riskScore > 40 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: 150, height: 150 }}>
                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: 120, height: 120 }}>
                      <div>
                        <p className="h2 fw-bold mb-0">{riskScore}</p>
                        <p className="x-small mb-0">/100</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="progress rounded-3 mb-3" style={{ height: 6 }}>
                  <div className={`progress-bar ${riskScore > 70 ? 'bg-danger' : riskScore > 40 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${riskScore}%` }} />
                </div>
                <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {riskScore > 70 ? t('Critical - Immediate attention required') : riskScore > 40 ? t('Moderate risk - Monitor closely') : t('Low risk - Within acceptable range')}
                </p>
              </div>
            </div>

            {/* Alerts Panel */}
            {alerts.length > 0 && (
              <div className={`card border-0 shadow-sm rounded-4 mt-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                <div className={`card-header bg-transparent border-0 py-3`}>
                  <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faBell} className="me-2 text-warning" />{t('Alert Notifications')}</h6>
                </div>
                <div className="card-body p-3">
                  {alerts.map((a, i) => (
                    <div key={i} className={`p-3 rounded-3 mb-2 d-flex align-items-start gap-2 ${a.severity === 'critical' ? 'bg-danger-subtle' : a.severity === 'high' ? 'bg-warning-subtle' : 'bg-info-subtle'}`}>
                      <FontAwesomeIcon icon={faTriangleExclamation} className={`${a.severity === 'critical' ? 'text-danger' : a.severity === 'high' ? 'text-warning' : 'text-info'} mt-1`} />
                      <div>
                        <p className="small fw-bold mb-0">{a.message}</p>
                        <span className={`badge ${a.severity === 'critical' ? 'bg-danger' : a.severity === 'high' ? 'bg-warning' : 'bg-info'} rounded-pill x-small`}>{t(a.severity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Employee Risk Cards */}
          <div className="col-lg-8">
            <div className="row g-3 mb-4">
              {employees.length === 0 ? (
                <div className="col-12 text-center py-5 text-muted">{t('No employees flagged')}</div>
              ) : employees.map(emp => (
                <div key={emp.id} className="col-md-6">
                  <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <p className="fw-bold mb-0">{emp.name}</p>
                          <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{emp.department || emp.dept}</p>
                        </div>
                        <span className={`badge bg-${getColor(emp.risk_level || emp.risk)} rounded-pill`}>{t(emp.risk_level || emp.risk)}</span>
                      </div>
                      {/* Risk Score Bar */}
                      <div className="progress rounded-3 mb-2" style={{ height: 4 }}>
                        <div className={`progress-bar bg-${getColor(emp.risk_level || emp.risk)}`} style={{ width: `${emp.score}%` }} />
                      </div>
                      {/* Condition Indicators */}
                      <div className="d-flex flex-wrap gap-1">
                        {(emp.conditions || []).map(cond => (
                          <span key={cond} className={`badge bg-${getColor(emp.risk_level || emp.risk)}-subtle text-${getColor(emp.risk_level || emp.risk)} rounded-pill x-small`}>
                            <FontAwesomeIcon icon={faExclamationCircle} className="me-1" />{t(cond)}
                          </span>
                        ))}
                        {(!emp.conditions || emp.conditions.length === 0) && (
                          <span className="badge bg-success-subtle text-success rounded-pill x-small">{t('No flags')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartBar} className="me-2 text-primary" />{t('Department Risk Breakdown')}</h6>
                    {departmentBreakdown.length === 0 ? (
                      <p className="text-muted small text-center">{t('No department data')}</p>
                    ) : departmentBreakdown.slice(0, 5).map((dept, i) => (
                      <div key={dept.name || i} className="d-flex align-items-center gap-2 mb-2">
                        <span className="small flex-grow-1">{dept.name}</span>
                        <div className="progress flex-grow-1 rounded-3" style={{ height: 6 }}>
                          <div className={`progress-bar ${dept.risk_score > 70 ? 'bg-danger' : dept.risk_score > 40 ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${dept.risk_score}%` }} />
                        </div>
                        <span className="x-small fw-bold">{dept.risk_score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />{t('Risk Trend')}</h6>
                    <div className="d-flex align-items-end gap-2" style={{ height: 120 }}>
                      {riskTrend.length === 0 ? (
                        <p className="text-muted small w-100 text-center">{t('No trend data')}</p>
                      ) : riskTrend.map((v, i) => (
                        <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                          <div className={`w-100 rounded-3 ${v > 40 ? 'bg-danger' : v > 30 ? 'bg-warning' : 'bg-success'}`}
                            style={{ height: `${v * 2}%` }} />
                          <span className="x-small mt-1 text-muted">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i] || i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Ranking Table */}
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className={`card-header bg-transparent border-0 py-3`}>
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faArrowUp} className="me-2 text-danger" />{t('Employee Risk Ranking')}</h6>
              </div>
              <div className="table-responsive">
                <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                  <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                    <tr>
                      <th className="ps-4">#</th>
                      <th>{t('Employee')}</th>
                      <th>{t('Department')}</th>
                      <th>{t('Risk Score')}</th>
                      <th className="pe-4">{t('Level')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...employees].sort((a, b) => (b.score || 0) - (a.score || 0)).map((emp, i) => (
                      <tr key={emp.id}>
                        <td className="ps-4 fw-bold">{i + 1}</td>
                        <td className="fw-bold">{emp.name}</td>
                        <td>{emp.department || emp.dept}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1 rounded-3" style={{ height: 4 }}>
                              <div className={`progress-bar bg-${getColor(emp.risk_level || emp.risk)}`} style={{ width: `${emp.score}%` }} />
                            </div>
                            <span className="x-small fw-bold">{emp.score}</span>
                          </div>
                        </td>
                        <td className="pe-4">
                          <span className={`badge bg-${getColor(emp.risk_level || emp.risk)} rounded-pill`}>{t(emp.risk_level || emp.risk)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedZoneAttendance;
