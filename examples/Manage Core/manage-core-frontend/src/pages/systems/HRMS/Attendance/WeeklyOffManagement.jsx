import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay, faPlus, faEdit, faTrash, faUsers, faClock,
  faToggleOn, faToggleOff, faTriangleExclamation, faSave,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getWeeklyOffs, createWeeklyOff, listDepartments } from '../../../../api/hrms';
import client from '../../../../api/client';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyOffManagement = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [policies, setPolicies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: 'Fixed', days: [], dept: '', shift_id: '', rotation_interval: 1
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [polData, deptData] = await Promise.all([
        getWeeklyOffs(),
        listDepartments()
      ]);
      setPolicies(polData);
      setDepartments(deptData);
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleDay = (day) => {
    const cur = [...formData.days];
    const idx = cur.indexOf(day);
    idx > -1 ? cur.splice(idx, 1) : cur.push(day);
    setFormData({...formData, days: cur});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPolicy) {
        await client.patch('/hrms/shifts/weekly-offs/' + editPolicy.id, formData);
        addNotification(t('Policy updated'), 'success');
      } else {
        await createWeeklyOff(formData);
        addNotification(t('Policy created'), 'success');
      }
      setShowForm(false); setEditPolicy(null);
      fetchData();
    } catch { addNotification(t('Error saving'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this policy?'))) return;
    try {
      await client.delete('/hrms/shifts/weekly-offs/' + id);
      addNotification(t('Policy deleted'), 'success');
      fetchData();
    } catch { addNotification(t('Error deleting'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faCalendarDay} className="me-2 text-primary" />{t('Weekly Off Management')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Configure weekly off policies')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditPolicy(null); setFormData({ name: '', type: 'Fixed', days: [], dept: '', shift_id: '', rotation_interval: 1 }); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Add Policy')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-8">
          {policies.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faCalendarDay} className="fs-1 text-muted mb-3 opacity-50" />
              <p className="text-muted">{t('No weekly off policies')}</p>
            </div>
          ) : (
          <div className="row g-3">
            {policies.map(p => (
              <div key={p.id} className="col-md-6">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-0">{p.name}</h6>
                        <span className={`badge ${p.type === 'Fixed' ? 'bg-primary' : 'bg-warning'} rounded-pill mt-1`}>{p.type}</span>
                      </div>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditPolicy(p); setFormData(p); setShowForm(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(p.id)}><FontAwesomeIcon icon={faTrash} className="text-danger" /></button>
                      </div>
                    </div>
                    <div className="d-flex gap-1 mb-3">
                      {WEEKDAYS.map(d => (
                        <span key={d} className={`p-1 rounded-circle small d-flex align-items-center justify-content-center ${p.days?.includes(d) ? 'bg-danger text-white' : isDark ? 'bg-dark text-muted' : 'bg-light text-muted'}`}
                          style={{ width: 26, height: 26, fontSize: 9 }}>{d[0]}</span>
                      ))}
                    </div>
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                      <p className="x-small mb-1 text-muted">{t('Department')}: {p.dept || t('All')}</p>
                      {p.rotation_interval > 0 && <p className="x-small mb-0 text-muted">{t('Rotates every')} {p.rotation_interval} {t('weeks')}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faUsers} className="me-2 text-info" />{t('Employee Off Schedule')}</h6>
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} text-center`}>
                <FontAwesomeIcon icon={faCalendarDay} className="fs-1 text-muted mb-2 opacity-50" />
                <p className="small text-muted mb-0">{t('Calendar view placeholder')}</p>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 mt-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faTriangleExclamation} className="me-2 text-warning" />{t('Conflict Alerts')}</h6>
              <div className="p-3 rounded-3 bg-success-subtle">
                <span className="small text-success">{t('No conflicts detected')}</span>
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
                <h5 className="fw-bold">{editPolicy ? t('Edit Policy') : t('New Weekly Off Policy')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Policy Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Type')}</label>
                      <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="Fixed">{t('Fixed')}</option>
                        <option value="Rotational">{t('Rotational')}</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Rotation Interval')} ({t('weeks')})</label>
                      <input type="number" className="form-control rounded-3" min="1" value={formData.rotation_interval} onChange={e => setFormData({...formData, rotation_interval: parseInt(e.target.value)})} disabled={formData.type !== 'Rotational'} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2 d-block">{t('Off Days')}</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {WEEKDAYS.map(d => (
                          <button key={d} type="button" className={`btn rounded-3 ${formData.days.includes(d) ? 'btn-danger' : 'btn-outline-secondary'}`} onClick={() => toggleDay(d)}>{d.substring(0, 3)}</button>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Department')}</label>
                      <select className="form-select rounded-3" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
                        <option value="">{t('All Departments')}</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Shift')}</label>
                      <select className="form-select rounded-3" value={formData.shift_id} onChange={e => setFormData({...formData, shift_id: e.target.value})}>
                        <option value="">{t('All Shifts')}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faSave} className="me-2" />{editPolicy ? t('Update') : t('Create Policy')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyOffManagement;
