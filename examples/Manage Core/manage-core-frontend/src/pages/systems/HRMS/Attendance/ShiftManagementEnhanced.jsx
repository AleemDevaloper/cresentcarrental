import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock, faPlus, faEdit, faTrash, faCalendarWeek, faUsers,
  faChartBar, faChartPie, faChartLine, faSave, faGear
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listShifts, assignShift, getShiftCalendar, getShiftCoverage } from '../../../../api/hrms';
import { EnableDisableButton } from '../../../../components/common';
import client from '../../../../api/client';

const ShiftManagementEnhanced = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editShift, setEditShift] = useState(null);
  const [formData, setFormData] = useState({
    name: '', start_time: '09:00', end_time: '18:00', grace_period_in: 15,
    grace_period_out: 15, break_duration: 60, is_overtime_eligible: false,
    days_of_week: [1, 2, 3, 4, 5]
  });

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const data = await listShifts();
      setShifts(data);
    } catch { addNotification(t('Failed to load shifts'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchShifts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editShift) {
        await client.patch(`/shifts/${editShift.id}`, formData);
        addNotification(t('Shift updated'), 'success');
      } else {
        await client.post('/shifts', formData);
        addNotification(t('Shift created'), 'success');
      }
      setShowForm(false); setEditShift(null);
      fetchShifts();
    } catch { addNotification(t('Error saving'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this shift?'))) return;
    try {
      await client.delete(`/shifts/${id}`);
      addNotification(t('Shift deleted'), 'success');
      fetchShifts();
    } catch { addNotification(t('Error deleting'), 'danger'); }
  };

  const toggleDay = (day) => {
    const cur = [...formData.days_of_week];
    const idx = cur.indexOf(day);
    idx > -1 ? cur.splice(idx, 1) : cur.push(day);
    setFormData({...formData, days_of_week: cur});
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayIds = [1, 2, 3, 4, 5, 6, 0];

  const shiftColors = { Morning: 'success', Evening: 'info', Night: 'dark', Custom: 'primary' };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faClock} className="me-2 text-primary" />{t('Shift Management')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Enterprise scheduling and shift configuration')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditShift(null); setFormData({ name: '', start_time: '09:00', end_time: '18:00', grace_period_in: 15, grace_period_out: 15, break_duration: 60, is_overtime_eligible: false, days_of_week: [1,2,3,4,5] }); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Add Shift')}
        </button>
      </div>

      <div className="row g-4 mb-4">
        {loading ? (
          <div className="col-12 text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : shifts.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FontAwesomeIcon icon={faClock} className="fs-1 text-muted mb-3 opacity-50" />
            <p className="text-muted">{t('No shifts configured')}</p>
          </div>
        ) : shifts.map(shift => (
          <div key={shift.id} className="col-md-6">
            <div className={`card border-0 shadow-sm rounded-4 overflow-hidden ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className={`card-header bg-${shiftColors[shift.name] || 'primary'}-subtle py-3 border-0`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className={`text-${shiftColors[shift.name] || 'primary'}`} />
                    <h6 className="fw-bold mb-0">{shift.name}</h6>
                  </div>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditShift(shift); setFormData(shift); setShowForm(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(shift.id)}><FontAwesomeIcon icon={faTrash} className="text-danger" /></button>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row g-3 mb-3">
                  <div className="col-4 text-center">
                    <p className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('Start')}</p>
                    <p className="fw-bold mb-0">{shift.start_time}</p>
                  </div>
                  <div className="col-4 text-center">
                    <p className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('End')}</p>
                    <p className="fw-bold mb-0">{shift.end_time}</p>
                  </div>
                  <div className="col-4 text-center">
                    <p className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('Break')}</p>
                    <p className="fw-bold mb-0">{shift.break_duration}m</p>
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-1 mb-3">
                  {dayIds.map((id, i) => (
                    <span key={id} className={`p-1 rounded-circle d-flex align-items-center justify-content-center small ${shift.days_of_week?.includes(id) ? 'bg-primary text-white' : 'bg-light text-muted opacity-50'}`} style={{ width: 28, height: 28 }}>{dayLabels[i]}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editShift ? t('Edit Shift') : t('Create Shift')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Shift Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Start Time')}</label>
                      <input type="time" className="form-control rounded-3" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('End Time')}</label>
                      <input type="time" className="form-control rounded-3" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Grace In (min)')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.grace_period_in} onChange={e => setFormData({...formData, grace_period_in: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Grace Out (min)')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.grace_period_out} onChange={e => setFormData({...formData, grace_period_out: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Break (min)')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.break_duration} onChange={e => setFormData({...formData, break_duration: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2 d-block">{t('Working Days')}</label>
                      <div className="d-flex gap-2">
                        {dayIds.map((id, i) => (
                          <button key={id} type="button" className={`btn rounded-3 flex-grow-1 ${formData.days_of_week.includes(id) ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => toggleDay(id)}>{dayLabels[i]}</button>
                        ))}
                      </div>
                    </div>
                    <div className="col-12">
                      <EnableDisableButton
                        checked={formData.is_overtime_eligible}
                        onClick={() => setFormData({...formData, is_overtime_eligible: !formData.is_overtime_eligible})}
                        label={t('Overtime Eligible')}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faSave} className="me-2" />{editShift ? t('Update') : t('Create Shift')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagementEnhanced;
