import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock, faSliders, faGavel, faBuilding, faArrowRight,
  faExclamationTriangle, faHistory, faSave, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getAttendanceGraceTimes, createAttendanceGraceTime } from '../../../../api/hrms';

const GraceTimeManagement = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [graceTimes, setGraceTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState('');
  const [graceIn, setGraceIn] = useState(15);
  const [graceOut, setGraceOut] = useState(15);
  const [violations] = useState([]);
  const [savedHistory, setSavedHistory] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getAttendanceGraceTimes();
      setGraceTimes(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedShift(first.shift_name || first.shift || '');
        setGraceIn(first.grace_in || first.grace_period_in || 15);
        setGraceOut(first.grace_out || first.grace_period_out || 15);
      }
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      await createAttendanceGraceTime({
        shift: selectedShift,
        grace_in: parseInt(graceIn),
        grace_out: parseInt(graceOut)
      });
      addNotification(t('Grace time saved'), 'success');
      setSavedHistory(prev => [{
        time: new Date().toLocaleString(),
        shift: selectedShift || t('Default'),
        detail: 'Grace In: ' + graceIn + 'm, Grace Out: ' + graceOut + 'm'
      }, ...prev]);
      fetchData();
    } catch { addNotification(t('Error saving grace time'), 'danger'); }
  };

  const latenessRules = [
    { range: '0-5 min', type: 'Tolerated', color: 'success' },
    { range: '5-15 min', type: 'Warning', color: 'warning' },
    { range: '15-30 min', type: 'Half Day', color: 'danger' },
    { range: '>30 min', type: 'Absent', color: 'dark' },
  ];

  const uniqueShifts = [...new Set(graceTimes.map(g => g.shift_name || g.shift || '').filter(Boolean))];

  return (
    <div className={'animate-fade-in p-4' + (isDark ? ' bg-dark text-light' : '')}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faGavel} className="me-2 text-primary" />{t('Grace Time Management')}</h4>
          <p className={'small mb-0' + (isDark ? ' text-light opacity-75' : ' text-muted')}>{t('Configure tolerance policies for attendance')}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-7">
          <div className={'card border-0 shadow-sm rounded-4 mb-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <label className="small fw-bold text-muted mb-2">{t('Configure Grace Time')}</label>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {uniqueShifts.length > 0 ? uniqueShifts.map(s => (
                  <button key={s} className={'btn rounded-3' + (selectedShift === s ? ' btn-primary' : isDark ? ' btn-outline-light' : ' btn-outline-secondary')}
                    onClick={() => {
                      setSelectedShift(s);
                      const gt = graceTimes.find(g => (g.shift_name || g.shift) === s);
                      if (gt) {
                        setGraceIn(gt.grace_in || gt.grace_period_in || 15);
                        setGraceOut(gt.grace_out || gt.grace_period_out || 15);
                      }
                    }}>{s}</button>
                )) : (
                  <span className="text-muted small">{t('No grace time configs')}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2">{t('Check-In Grace')}: <strong>{graceIn} min</strong></label>
                <input type="range" className="form-range" min="0" max="60" step="1" value={graceIn} onChange={e => setGraceIn(e.target.value)} />
                <div className="d-flex justify-content-between x-small text-muted"><span>0 min</span><span>60 min</span></div>
              </div>
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2">{t('Check-Out Grace')}: <strong>{graceOut} min</strong></label>
                <input type="range" className="form-range" min="0" max="60" step="1" value={graceOut} onChange={e => setGraceOut(e.target.value)} />
                <div className="d-flex justify-content-between x-small text-muted"><span>0 min</span><span>60 min</span></div>
              </div>

              <h6 className="fw-bold mb-3">{t('Late Arrival / Early Exit Rules')}</h6>
              <div className="d-flex flex-column gap-2 mb-4">
                {latenessRules.map((r, i) => (
                  <div key={i} className={'d-flex justify-content-between p-3 rounded-3 bg-' + r.color + '-subtle'}>
                    <span className={'small fw-bold text-' + r.color}>{r.range}</span>
                    <span className={'small text-' + r.color}>{t(r.type)}</span>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary rounded-3 px-4" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} className="me-2" />{t('Save Grace Configuration')}
              </button>
            </div>
          </div>

          <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-header bg-transparent border-0 py-3">
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />{t('Grace Time Change Log')}</h6>
            </div>
            <div className="table-responsive">
              <table className={'table align-middle mb-0 small' + (isDark ? ' table-dark' : '')}>
                <thead className={isDark ? 'bg-dark-subtle' : 'bg-light'}>
                  <tr>
                    <th className="ps-4">{t('Time')}</th>
                    <th>{t('Shift')}</th>
                    <th className="pe-4">{t('Details')}</th>
                  </tr>
                </thead>
                <tbody>
                  {savedHistory.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">{t('No changes logged')}</td></tr>
                  ) : savedHistory.map((v, i) => (
                    <tr key={i}>
                      <td className="ps-4">{v.time}</td>
                      <td>{v.shift}</td>
                      <td className="pe-4">{v.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className={'card border-0 shadow-sm rounded-4 mb-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />{t('Configured Grace Times')}</h6>
              {graceTimes.length === 0 ? (
                <p className="text-muted small text-center">{t('No configurations')}</p>
              ) : graceTimes.map((gt, i) => (
                <div key={i} className={'p-3 rounded-3 mb-2' + (isDark ? ' bg-dark' : ' bg-light')}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold small">{gt.shift_name || gt.shift || t('Default')}</span>
                    <span className="small">{t('In')}: {gt.grace_in || gt.grace_period_in || 0}m | {t('Out')}: {gt.grace_out || gt.grace_period_out || 0}m</span>
                    <button className="btn btn-sm btn-light rounded-3" onClick={() => {
                      setSelectedShift(gt.shift_name || gt.shift || '');
                      setGraceIn(gt.grace_in || gt.grace_period_in || 15);
                      setGraceOut(gt.grace_out || gt.grace_period_out || 15);
                    }}><FontAwesomeIcon icon={faArrowRight} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faSliders} className="me-2 text-primary" />{t('Attendance Impact Preview')}</h6>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between p-2 rounded-3 bg-light">
                  <span className="small">{t('Current Grace')}</span>
                  <span className="fw-bold small">{graceIn}m / {graceOut}m</span>
                </div>
                <div className="d-flex justify-content-between p-2 rounded-3 bg-light">
                  <span className="small">{t('Estimated Late Arrivals')}</span>
                  <span className="fw-bold small text-warning">12%</span>
                </div>
                <div className="d-flex justify-content-between p-2 rounded-3 bg-light">
                  <span className="small">{t('Estimated Early Exits')}</span>
                  <span className="fw-bold small text-info">8%</span>
                </div>
                <div className="d-flex justify-content-between p-2 rounded-3 bg-success-subtle">
                  <span className="small text-success">{t('On-Time Compliance')}</span>
                  <span className="fw-bold small text-success">80%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default GraceTimeManagement;
