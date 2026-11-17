import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot, faPlus, faEdit, faTrash, faClock, faChartBar,
  faCalendarDay, faCheckCircle, faTimesCircle, faSave,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getBreakTimes, createBreakTime, listShifts } from '../../../../api/hrms';
import { EnableDisableButton } from '../../../../components/common';
import client from '../../../../api/client';

const BreakTimeManagement = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [breakTypes, setBreakTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBreak, setEditBreak] = useState(null);
  const [formData, setFormData] = useState({ name: '', paid: true, duration: 30, shifts: [] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [breakData, shiftData] = await Promise.all([
        getBreakTimes(),
        listShifts()
      ]);
      setBreakTypes(breakData);
      setShifts(shiftData);
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBreak) {
        await client.patch('/hrms/shifts/break-times/' + editBreak.id, formData);
        addNotification(t('Break updated'), 'success');
      } else {
        await createBreakTime(formData);
        addNotification(t('Break created'), 'success');
      }
      setShowForm(false); setEditBreak(null);
      fetchData();
    } catch { addNotification(t('Error saving'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this break type?'))) return;
    try {
      await client.delete('/hrms/shifts/break-times/' + id);
      addNotification(t('Break deleted'), 'success');
      fetchData();
    } catch { addNotification(t('Error deleting'), 'danger'); }
  };

  return (
    <div className={'animate-fade-in p-4' + (isDark ? ' bg-dark text-light' : '')}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faMugHot} className="me-2 text-primary" />{t('Break Time Management')}</h4>
          <p className={'small mb-0' + (isDark ? ' text-light opacity-75' : ' text-muted')}>{t('Configure break policies and schedules')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditBreak(null); setFormData({ name: '', paid: true, duration: 30, shifts: [] }); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Add Break Type')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-7">
          {breakTypes.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faMugHot} className="fs-1 text-muted mb-3 opacity-50" />
              <p className="text-muted">{t('No break types configured')}</p>
            </div>
          ) : (
          <div className="row g-3 mb-4">
            {breakTypes.map(b => (
              <div key={b.id} className="col-md-6">
                <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-warning-subtle">
                          <FontAwesomeIcon icon={faMugHot} className="text-warning fs-4" />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{b.name}</h6>
                          <span className={'badge ' + (b.paid ? 'bg-success' : 'bg-secondary') + ' rounded-pill x-small'}>{b.paid ? t('Paid') : t('Unpaid')}</span>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditBreak(b); setFormData(b); setShowForm(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(b.id)}><FontAwesomeIcon icon={faTrash} className="text-danger" /></button>
                      </div>
                    </div>
                    <div className={'p-3 rounded-3' + (isDark ? ' bg-dark' : ' bg-light')}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="x-small text-muted">{t('Duration')}</span>
                        <span className="fw-bold small">{b.duration} {t('min')}</span>
                      </div>
                      <div className="d-flex gap-1 flex-wrap">
                        {(b.shifts || []).map(s => <span key={s} className="badge bg-info-subtle text-info x-small">{typeof s === 'object' ? s.name : s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        <div className="col-lg-5">
          <div className={'card border-0 shadow-sm rounded-4 mb-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faClock} className="me-2 text-primary" />{t('Available Shifts')}</h6>
              {shifts.map(s => (
                <div key={s.id} className={'p-2 rounded-3 mb-2 d-flex justify-content-between' + (isDark ? ' bg-dark' : ' bg-light')}>
                  <span className="small">{s.name}</span>
                  <span className="x-small text-muted">{s.start_time} - {s.end_time}</span>
                </div>
              ))}
              {shifts.length === 0 && <p className="text-muted small text-center mb-0">{t('No shifts')}</p>}
            </div>
          </div>

          <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faUsers} className="me-2 text-info" />{t('Employee Break Compliance')}</h6>
              <div className={'p-3 rounded-3 text-center' + (isDark ? ' bg-dark' : ' bg-light')}>
                <p className="small text-muted mb-0">{t('Compliance data available after tracking')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editBreak ? t('Edit Break') : t('New Break Type')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Break Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Lunch, Tea Break" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Duration (minutes)')}</label>
                      <input type="number" className="form-control rounded-3" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <EnableDisableButton
                        checked={formData.paid}
                        onClick={() => setFormData({...formData, paid: !formData.paid})}
                        label={t('Paid Break')}
                      />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Assigned Shifts')}</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {shifts.map(s => (
                          <label key={s.id} className="form-check-label d-flex align-items-center gap-1">
                            <input type="checkbox" className="form-check-input"
                              checked={formData.shifts.includes(s.id) || formData.shifts.includes(s.name)}
                              onChange={() => {
                                const cur = [...formData.shifts];
                                const idx = cur.indexOf(s.id);
                                idx > -1 ? cur.splice(idx, 1) : cur.push(s.id);
                                setFormData({...formData, shifts: cur});
                              }} />
                            {s.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faSave} className="me-2" />{editBreak ? t('Update') : t('Create Break')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakTimeManagement;
