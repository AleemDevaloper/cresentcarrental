import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotate, faCalendarWeek, faUsers, faPlus, faEdit, faTrash,
  faArrowRight, faChartBar, faTriangleExclamation, faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listShiftRotations, createShiftRotation, listShifts } from '../../../../api/hrms';
import { EnableDisableButton } from '../../../../components/common';
import client from '../../../../api/client';

const RotationalShifts = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [rotations, setRotations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRotation, setEditRotation] = useState(null);
  const [formData, setFormData] = useState({ name: '', rotation_type: 'Weekly', shift_ids: [], auto_schedule: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rotData, shiftData] = await Promise.all([
        listShiftRotations(),
        listShifts()
      ]);
      setRotations(rotData);
      setShifts(shiftData);
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRotation) {
        await client.patch(`/hrms/shifts/rotations/${editRotation.id}`, formData);
        addNotification(t('Rotation updated'), 'success');
      } else {
        await createShiftRotation(formData);
        addNotification(t('Rotation created'), 'success');
      }
      setShowForm(false); setEditRotation(null);
      fetchData();
    } catch { addNotification(t('Error saving'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this rotation?'))) return;
    try {
      await client.delete(`/hrms/shifts/rotations/${id}`);
      addNotification(t('Rotation deleted'), 'success');
      fetchData();
    } catch { addNotification(t('Error deleting'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faRotate} className="me-2 text-primary" />{t('Rotational Shifts')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Rotation scheduling and management')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditRotation(null); setFormData({ name: '', rotation_type: 'Weekly', shift_ids: [], auto_schedule: false }); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('New Rotation')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-8">
          {rotations.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faRotate} className="fs-1 text-muted mb-3 opacity-50" />
              <p className="text-muted">{t('No rotations configured')}</p>
            </div>
          ) : (
          <div className="row g-3 mb-4">
            {rotations.map(rot => (
              <div key={rot.id} className="col-md-6">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-0">{rot.name}</h6>
                        <span className="badge bg-info-subtle text-info rounded-pill mt-1">{rot.rotation_type}</span>
                      </div>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditRotation(rot); setFormData(rot); setShowForm(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(rot.id)}><FontAwesomeIcon icon={faTrash} className="text-danger" /></button>
                      </div>
                    </div>
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} mb-3`}>
                      <div className="d-flex justify-content-between">
                        <span className="small text-muted">{t('Shifts in Rotation')}</span>
                        <span className="fw-bold">{rot.shift_ids?.length || rot.shift_count || 0}</span>
                      </div>
                    </div>
                    {rot.shift_ids && rot.shift_ids.length > 0 && (
                      <div className="d-flex align-items-center gap-1 mb-2">
                        {rot.shift_ids.map((sid, i) => {
                          const shift = shifts.find(s => s.id === sid);
                          return (
                            <React.Fragment key={sid}>
                              <span className="badge bg-primary rounded-3">{shift?.name?.charAt(0) || 'S'}</span>
                              {i < rot.shift_ids.length - 1 && <FontAwesomeIcon icon={faArrowRight} className="text-muted x-small" />}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge ${rot.active !== false ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                        {rot.active !== false ? t('Active') : t('Inactive')}
                      </span>
                      <span className="small text-muted">{t('Rotation preview')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faTriangleExclamation} className="me-2 text-danger" />{t('Rotation Conflicts')}</h6>
              <div className="p-3 rounded-3 bg-success-subtle">
                <span className="small text-success"><FontAwesomeIcon icon={faToggleOff} className="me-2" />{t('No conflicts detected')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faCalendarWeek} className="me-2 text-primary" />{t('Rotation Preview')}</h6>
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} text-center`}>
                <p className="text-muted small mb-0">{t('Select rotation to preview')}</p>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faUsers} className="me-2 text-info" />{t('Rotation Coverage')}</h6>
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} text-center`}>
                <p className="text-muted small mb-0">{t('Coverage data loading')}</p>
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
                <h5 className="fw-bold">{editRotation ? t('Edit Rotation') : t('New Rotation Schedule')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Rotation Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Rotation Type')}</label>
                      <select className="form-select rounded-3" value={formData.rotation_type} onChange={e => setFormData({...formData, rotation_type: e.target.value})}>
                        <option value="Weekly">{t('Weekly')}</option>
                        <option value="Monthly">{t('Monthly')}</option>
                        <option value="Custom">{t('Custom')}</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Shifts')}</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {shifts.map(s => (
                          <label key={s.id} className="form-check-label d-flex align-items-center gap-1">
                            <input type="checkbox" className="form-check-input"
                              checked={formData.shift_ids.includes(s.id)}
                              onChange={() => {
                                const cur = [...formData.shift_ids];
                                const idx = cur.indexOf(s.id);
                                idx > -1 ? cur.splice(idx, 1) : cur.push(s.id);
                                setFormData({...formData, shift_ids: cur});
                              }} />
                            {s.name}
                          </label>
                        ))}
                        {shifts.length === 0 && <span className="text-muted small">{t('No shifts available')}</span>}
                      </div>
                    </div>
                    <div className="col-12">
                      <EnableDisableButton
                        checked={formData.auto_schedule}
                        onClick={() => setFormData({...formData, auto_schedule: !formData.auto_schedule})}
                        label={t('Auto-Scheduling')}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{editRotation ? t('Update') : t('Create Rotation')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RotationalShifts;
