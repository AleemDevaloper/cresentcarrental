import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun, faMoon, faClock, faBuilding, faChartBar, faSliders,
  faCalculator, faBalanceScale, faSave, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getHalfDayRules, createHalfDayRule } from '../../../../api/hrms';

const HalfDayFullDayRules = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [halfDayThreshold, setHalfDayThreshold] = useState(4);
  const [fullDayThreshold, setFullDayThreshold] = useState(8);
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const fetchRules = async () => {
    try {
      const data = await getHalfDayRules();
      setRules(data);
      if (data.length > 0) {
        const first = data[0];
        setHalfDayThreshold(first.half_day_threshold || first.half_day_hours || 4);
        setFullDayThreshold(first.full_day_threshold || first.full_day_hours || 8);
        setSelectedShift(first.shift || '');
        setSelectedDept(first.department || '');
      }
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleSave = async () => {
    try {
      await createHalfDayRule({
        half_day_threshold: parseFloat(halfDayThreshold),
        full_day_threshold: parseFloat(fullDayThreshold),
        shift: selectedShift || null,
        department: selectedDept || null
      });
      addNotification(t('Rules saved'), 'success');
      fetchRules();
    } catch { addNotification(t('Error saving rules'), 'danger'); }
  };

  return (
    <div className={'animate-fade-in p-4' + (isDark ? ' bg-dark text-light' : '')}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faBalanceScale} className="me-2 text-primary" />{t('Half Day / Full Day Rules')}</h4>
          <p className={'small mb-0' + (isDark ? ' text-light opacity-75' : ' text-muted')}>{t('Configure working hour thresholds')}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-7">
          <div className={'card border-0 shadow-sm rounded-4 mb-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <div>
                  <label className="small fw-bold text-muted mb-2">{t('Shift')}</label>
                  <select className="form-select rounded-3" value={selectedShift} onChange={e => setSelectedShift(e.target.value)}>
                    <option value="">{t('All Shifts')}</option>
                    {[...new Set(rules.map(r => r.shift).filter(Boolean))].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="small fw-bold text-muted mb-2">{t('Department')}</label>
                  <select className="form-select rounded-3" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                    <option value="">{t('All Departments')}</option>
                    {[...new Set(rules.map(r => r.department).filter(Boolean))].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold small">{t('Half Day Threshold')}</span>
                  <span className="fw-bold text-warning">{halfDayThreshold} {t('hours')}</span>
                </div>
                <input type="range" className="form-range" min="1" max="8" step="0.5" value={halfDayThreshold} onChange={e => setHalfDayThreshold(e.target.value)} />
                <div className="d-flex justify-content-between x-small text-muted"><span>1 hr</span><span>8 hrs</span></div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold small">{t('Full Day Threshold')}</span>
                  <span className="fw-bold text-success">{fullDayThreshold} {t('hours')}</span>
                </div>
                <input type="range" className="form-range" min="4" max="12" step="0.5" value={fullDayThreshold} onChange={e => setFullDayThreshold(e.target.value)} />
                <div className="d-flex justify-content-between x-small text-muted"><span>4 hrs</span><span>12 hrs</span></div>
              </div>

              <div className={'p-3 rounded-3' + (isDark ? ' bg-dark' : ' bg-light') + ' mb-4'}>
                <h6 className="fw-bold small mb-2">{t('Rule Summary')}</h6>
                <div className="d-flex gap-3 flex-wrap">
                  <div className="bg-warning-subtle p-2 rounded-3 flex-grow-1 text-center">
                    <p className="x-small text-muted mb-0">{'< ' + halfDayThreshold + 'h'}</p>
                    <p className="fw-bold small text-warning mb-0">{t('Absent')}</p>
                  </div>
                  <div className="bg-info-subtle p-2 rounded-3 flex-grow-1 text-center">
                    <p className="x-small text-muted mb-0">{halfDayThreshold + '-' + fullDayThreshold + 'h'}</p>
                    <p className="fw-bold small text-info mb-0">{t('Half Day')}</p>
                  </div>
                  <div className="bg-success-subtle p-2 rounded-3 flex-grow-1 text-center">
                    <p className="x-small text-muted mb-0">{'>= ' + fullDayThreshold + 'h'}</p>
                    <p className="fw-bold small text-success mb-0">{t('Full Day')}</p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary rounded-3 px-4" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} className="me-2" />{t('Save Rules')}
              </button>
            </div>
          </div>

          <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faCalculator} className="me-2 text-success" />{t('Existing Rules')}</h6>
              {rules.length === 0 ? (
                <p className="text-muted small text-center mb-0">{t('No rules configured')}</p>
              ) : (
                <div className="table-responsive">
                  <table className={'table align-middle mb-0 small' + (isDark ? ' table-dark' : '')}>
                    <thead className={isDark ? 'bg-dark-subtle' : 'bg-light'}>
                      <tr>
                        <th className="ps-4">{t('Shift')}</th>
                        <th>{t('Department')}</th>
                        <th>{t('Half Day')}</th>
                        <th className="pe-4">{t('Full Day')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.map((r, i) => (
                        <tr key={r.id || i}>
                          <td className="ps-4">{r.shift || t('All')}</td>
                          <td>{r.department || t('All')}</td>
                          <td>{r.half_day_threshold || r.half_day_hours || '-'}h</td>
                          <td className="pe-4">{r.full_day_threshold || r.full_day_hours || '-'}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className={'card border-0 shadow-sm rounded-4 mb-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartBar} className="me-2 text-primary" />{t('Working Hour Analytics')}</h6>
              <div className="d-flex align-items-end gap-2" style={{ height: 150 }}>
                {[7.5, 8.2, 6.8, 7.9, 8.5, 5.5, 4.2].map((v, i) => (
                  <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                    <div className={'w-100 rounded-3' + (v >= fullDayThreshold ? ' bg-success' : v >= halfDayThreshold ? ' bg-warning' : ' bg-danger')}
                      style={{ height: (v / fullDayThreshold) * 100 + '%' }} />
                    <span className="x-small mt-1 text-muted">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faSliders} className="me-2 text-info" />{t('Policy Comparison')}</h6>
              {rules.length === 0 ? (
                <p className="text-muted small text-center mb-0">{t('No rules to compare')}</p>
              ) : rules.map((r, i) => (
                <div key={i} className={'p-3 rounded-3 mb-2' + (isDark ? ' bg-dark' : ' bg-light')}>
                  <div className="d-flex justify-content-between">
                    <span className="small">{r.shift || t('All')}</span>
                    <span className="small text-muted">{t('Half')}: {r.half_day_threshold || r.half_day_hours || '-'}h | {t('Full')}: {r.full_day_threshold || r.full_day_hours || '-'}h</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default HalfDayFullDayRules;
