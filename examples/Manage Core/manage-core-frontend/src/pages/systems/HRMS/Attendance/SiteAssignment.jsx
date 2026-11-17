import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faUser, faPlus, faEdit, faTrash, faCalendar,
  faExchange, faArrowRight, faCheckCircle, faUsers,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getSiteAssignments, assignSite, listSites, listEmployees } from '../../../../api/hrms';
import client from '../../../../api/client';

const SiteAssignment = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '', site_id: '', assignment_type: 'Permanent', start_date: '', end_date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ass, emp, sit] = await Promise.all([
        getSiteAssignments(),
        listEmployees(),
        listSites()
      ]);
      setAssignments(ass);
      setEmployees(emp);
      setSites(sit);
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAssignment) {
        await client.patch(`/hrms/sites/assignments/${editAssignment.id}`, formData);
        addNotification(t('Assignment updated'), 'success');
      } else {
        await assignSite(formData);
        addNotification(t('Assignment created'), 'success');
      }
      setShowForm(false); setEditAssignment(null);
      fetchData();
    } catch { addNotification(t('Error saving'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this assignment?'))) return;
    try {
      await client.delete(`/hrms/sites/assignments/${id}`);
      addNotification(t('Assignment deleted'), 'success');
      fetchData();
    } catch { addNotification(t('Error deleting'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faBuilding} className="me-2 text-primary" />{t('Site Assignment')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Allocate employees to sites')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary rounded-3" onClick={() => { setEditAssignment(null); setFormData({ employee_id: '', site_id: '', assignment_type: 'Permanent', start_date: '', end_date: '' }); setShowForm(true); }}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />{t('New Assignment')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-header bg-transparent border-0 py-3 d-flex justify-content-between">
              <h6 className="fw-bold mb-0">{t('Active Assignments')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Employee')}</th>
                    <th>{t('Site')}</th>
                    <th>{t('Type')}</th>
                    <th>{t('Start')}</th>
                    <th>{t('End')}</th>
                    <th className="pe-4">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">{t('No assignments')}</td></tr>
                  ) : assignments.map(a => (
                    <tr key={a.id}>
                      <td className="ps-4 fw-bold">{a.employee_name || a.employee?.name || a.employee_id}</td>
                      <td>{a.site_name || a.site?.name || a.site_id}</td>
                      <td>
                        <span className={`badge ${a.assignment_type === 'Permanent' ? 'bg-primary' : 'bg-warning'} rounded-pill`}>
                          {t(a.assignment_type)}
                        </span>
                      </td>
                      <td className="small">{a.start_date}</td>
                      <td className="small">{a.end_date || t('Ongoing')}</td>
                      <td className="pe-4">
                        <button className="btn btn-sm btn-light rounded-3 me-1" onClick={() => { setEditAssignment(a); setFormData(a); setShowForm(true); }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(a.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faExchange} className="me-2 text-info" />{t('Assignment History')}</h6>
              <select className="form-select rounded-3 mb-3">
                <option value="">{t('Select Employee')}</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} text-center`}>
                <p className="text-muted small mb-0">{t('Select an employee to view history')}</p>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faTriangleExclamation} className="me-2 text-danger" />{t('Conflicts')}</h6>
              <div className={`p-3 rounded-3 bg-success-subtle`}>
                <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                <span className="small text-success">{t('No conflicts found')}</span>
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
                <h5 className="fw-bold">{editAssignment ? t('Edit Assignment') : t('New Site Assignment')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Employee')}</label>
                      <select className="form-select rounded-3" required value={formData.employee_id}
                        onChange={e => setFormData({...formData, employee_id: e.target.value})}>
                        <option value="">{t('Select Employee')}</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Site')}</label>
                      <select className="form-select rounded-3" required value={formData.site_id}
                        onChange={e => setFormData({...formData, site_id: e.target.value})}>
                        <option value="">{t('Select Site')}</option>
                        {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Type')}</label>
                      <select className="form-select rounded-3" value={formData.assignment_type}
                        onChange={e => setFormData({...formData, assignment_type: e.target.value})}>
                        <option value="Permanent">{t('Permanent')}</option>
                        <option value="Temporary">{t('Temporary')}</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Start Date')}</label>
                      <input type="date" className="form-control rounded-3" required value={formData.start_date}
                        onChange={e => setFormData({...formData, start_date: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('End Date')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.end_date}
                        onChange={e => setFormData({...formData, end_date: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />{editAssignment ? t('Update') : t('Assign')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAssignment;
