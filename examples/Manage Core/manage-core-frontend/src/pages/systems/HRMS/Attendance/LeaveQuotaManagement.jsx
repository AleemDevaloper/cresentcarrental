import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faUsers, faBuilding, faPlus, faCalendarAlt,
  faUpload, faSave, faChartPie, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
  getLeaveQuotas, createLeaveQuota, bulkAllocateLeaveQuotas,
  listEmployees, listDepartments
} from '../../../../api/hrms';

const LeaveQuotaManagement = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [quotas, setQuotas] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '', leave_type: '', year: new Date().getFullYear(), allocated: 20
  });
  const [bulkFormData, setBulkFormData] = useState({
    department_id: '', leave_type: '', year: new Date().getFullYear(), allocated: 20
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [quotasRes, employeesRes, departmentsRes] = await Promise.allSettled([
        getLeaveQuotas(),
        listEmployees(),
        listDepartments(),
      ]);

      if (quotasRes.status === 'fulfilled') {
        const qData = quotasRes.value;
        setQuotas(Array.isArray(qData) ? qData : []);
      }
      if (employeesRes.status === 'fulfilled') {
        const empData = employeesRes.value;
        setEmployees(Array.isArray(empData) ? empData : []);
      }
      if (departmentsRes.status === 'fulfilled') {
        const deptData = departmentsRes.value;
        setDepartments(Array.isArray(deptData) ? deptData : []);
      }
    } catch (err) {
      setError(err.message);
      addNotification(err.message || t('Failed to load quota data'), 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification, t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getLeaveTypeSummary = () => {
    const summary = {};
    (Array.isArray(quotas) ? quotas : []).forEach(q => {
      const type = q.leave_type || q.type || '';
      if (!type) return;
      if (!summary[type]) summary[type] = { allocated: 0, used: 0 };
      summary[type].allocated += parseFloat(q.allocated || q.total || 0);
      summary[type].used += parseFloat(q.used || 0);
    });
    return summary;
  };

  const getDepartmentSummary = () => {
    const summary = {};
    (Array.isArray(quotas) ? quotas : []).forEach(q => {
      const dept = q.department || q.department_name || '';
      if (!dept) return;
      if (!summary[dept]) summary[dept] = { allocated: 0, used: 0 };
      summary[dept].allocated += parseFloat(q.allocated || q.total || 0);
      summary[dept].used += parseFloat(q.used || 0);
    });
    if (Object.keys(summary).length === 0) {
      return departments.slice(0, 5).map(d => ({
        department: d.name || d.department_name || d,
        allocated: 0,
        used: 0,
      }));
    }
    return Object.entries(summary).map(([dept, vals]) => ({
      department: dept,
      allocated: vals.allocated,
      used: vals.used,
    }));
  };

  const getUniqueLeaveTypes = () => {
    const types = new Set();
    (Array.isArray(quotas) ? quotas : []).forEach(q => {
      if (q.leave_type || q.type) types.add(q.leave_type || q.type);
    });
    return Array.from(types);
  };

  const typeSummary = getLeaveTypeSummary();
  const deptSummary = getDepartmentSummary();
  const uniqueLeaveTypes = getUniqueSummaryTypes();

  function getUniqueSummaryTypes() {
    const types = new Set();
    Object.keys(typeSummary).forEach(t => types.add(t));
    return Array.from(types);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeaveQuota({
        user_id: parseInt(formData.user_id, 10),
        leave_type: formData.leave_type,
        year: parseInt(formData.year, 10),
        allocated: parseInt(formData.allocated, 10),
      });
      addNotification(t('Quota allocated'), 'success');
      setShowForm(false);
      setFormData({ user_id: '', leave_type: '', year: new Date().getFullYear(), allocated: 20 });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('Error saving quota'), 'danger');
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        department_id: parseInt(bulkFormData.department_id, 10),
        leave_type: bulkFormData.leave_type,
        year: parseInt(bulkFormData.year, 10),
        allocated: parseInt(bulkFormData.allocated, 10),
      };
      await bulkAllocateLeaveQuotas(payload);
      addNotification(t('Bulk allocation completed'), 'success');
      setShowBulkForm(false);
      setBulkFormData({ department_id: '', leave_type: '', year: new Date().getFullYear(), allocated: 20 });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('Error in bulk allocation'), 'danger');
    }
  };

  const totalQuotaAllocated = (Array.isArray(quotas) ? quotas : []).reduce((s, q) => s + parseFloat(q.allocated || q.total || 0), 0);
  const totalQuotaUsed = (Array.isArray(quotas) ? quotas : []).reduce((s, q) => s + parseFloat(q.used || 0), 0);
  const remainingDays = totalQuotaAllocated - totalQuotaUsed;

  if (loading && quotas.length === 0) {
    return (
      <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  if (error && quotas.length === 0) {
    return (
      <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
        <div className="text-center py-5">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('Retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faChartBar} className="me-2 text-primary" />{t('Leave Quota Management')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Manage leave entitlements and allocations')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-info rounded-3" onClick={() => setShowBulkForm(true)}>
            <FontAwesomeIcon icon={faLayerGroup} className="me-2" />{t('Bulk Allocate')}
          </button>
          <button className="btn btn-primary rounded-3" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Allocate Quota')}
          </button>
        </div>
      </div>

      {quotas.length === 0 ? (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
          <div className="card-body p-4 text-center py-5">
            <FontAwesomeIcon icon={faChartBar} className="text-muted fs-1 mb-3" />
            <p className="text-muted mb-3">{t('No quotas allocated yet')}</p>
            <button className="btn btn-primary rounded-3" onClick={() => setShowForm(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Allocate First Quota')}
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className={`card-header bg-transparent border-0 py-3`}>
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />{t('Annual Quota Table')} - {new Date().getFullYear()}</h6>
              </div>
              <div className="table-responsive">
                <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                  <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                    <tr>
                      <th className="ps-4">{t('Employee')}</th>
                      <th>{t('Leave Type')}</th>
                      <th className="text-center">{t('Allocated')}</th>
                      <th className="text-center">{t('Used')}</th>
                      <th className="pe-4 text-center">{t('Remaining')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotas.slice(0, 50).map((q, idx) => {
                      const allocated = parseFloat(q.allocated || q.total || 0);
                      const used = parseFloat(q.used || 0);
                      const remaining = allocated - used;
                      return (
                        <tr key={q.id || `quota-${idx}`}>
                          <td className="ps-4 fw-bold">{q.user?.name || q.employee_name || q.employee || `User #${q.user_id}`}</td>
                          <td><span className="badge bg-info-subtle text-info">{q.leave_type || q.type || '-'}</span></td>
                          <td className="text-center">{allocated}</td>
                          <td className="text-center">{used}</td>
                          <td className="pe-4 text-center fw-bold">{remaining}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />{t('Department Quota Summary')}</h6>
                {deptSummary.length === 0 ? (
                  <p className="text-muted small mb-0">{t('No department data available')}</p>
                ) : (
                  <div className="row g-3">
                    {deptSummary.map((d, i) => {
                      const pct = d.allocated > 0 ? (d.used / d.allocated) * 100 : 0;
                      return (
                        <div key={i} className="col-md-6">
                          <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="fw-bold small">{d.department}</span>
                              <span className="small">{d.used}/{d.allocated} ({Math.round(pct)}%)</span>
                            </div>
                            <div className="progress rounded-3" style={{ height: 4 }}>
                              <div className="progress-bar bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartPie} className="me-2 text-success" />{t('Used vs Remaining')}</h6>
                {uniqueLeaveTypes.length === 0 ? (
                  <p className="text-muted small mb-0">{t('No data')}</p>
                ) : uniqueLeaveTypes.slice(0, 8).map(type => {
                  const s = typeSummary[type] || { allocated: 0, used: 0 };
                  const pct = s.allocated > 0 ? (s.used / s.allocated) * 100 : 0;
                  return (
                    <div key={type} className="d-flex align-items-center gap-2 mb-2">
                      <span className="x-small flex-grow-1">{t(type)}</span>
                      <div className="progress flex-grow-1 rounded-3" style={{ height: 4 }}>
                        <div className="progress-bar bg-warning" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="x-small fw-bold">{s.used}/{s.allocated}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartBar} className="me-2 text-danger" />{t('Remaining Leave Liability')}</h6>
                <div className="text-center mb-3">
                  <p className="h2 fw-bold text-danger">{remainingDays}</p>
                  <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('Total remaining days across all employees')}</p>
                </div>
                <hr />
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">{t('Total Allocated')}</span>
                  <span className="fw-bold">{totalQuotaAllocated}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">{t('Total Used')}</span>
                  <span className="fw-bold text-success">{totalQuotaUsed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{t('Allocate Leave Quota')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Employee')}</label>
                      <select className="form-select rounded-3" required
                        value={formData.user_id}
                        onChange={e => setFormData({ ...formData, user_id: e.target.value })}>
                        <option value="">{t('Select Employee')}</option>
                        {(Array.isArray(employees) ? employees : []).map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name || emp.first_name + ' ' + (emp.last_name || '') || `Employee #${emp.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Leave Type')}</label>
                      <select className="form-select rounded-3" required
                        value={formData.leave_type}
                        onChange={e => setFormData({ ...formData, leave_type: e.target.value })}>
                        <option value="">{t('Select Type')}</option>
                        {uniqueLeaveTypes.map(type => (
                          <option key={type} value={type}>{t(type)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Year')}</label>
                      <input type="number" className="form-control rounded-3"
                        value={formData.year}
                        onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Allocated Days')}</label>
                      <input type="number" className="form-control rounded-3" required min="1"
                        value={formData.allocated}
                        onChange={e => setFormData({ ...formData, allocated: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" />{t('Allocate')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showBulkForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faLayerGroup} className="me-2" />{t('Bulk Allocate Quotas')}</h5>
                <button className="btn-close" onClick={() => setShowBulkForm(false)} />
              </div>
              <form onSubmit={handleBulkSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Department')}</label>
                      <select className="form-select rounded-3" required
                        value={bulkFormData.department_id}
                        onChange={e => setBulkFormData({ ...bulkFormData, department_id: e.target.value })}>
                        <option value="">{t('Select Department')}</option>
                        {(Array.isArray(departments) ? departments : []).map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name || dept.department_name || `Dept #${dept.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Leave Type')}</label>
                      <select className="form-select rounded-3" required
                        value={bulkFormData.leave_type}
                        onChange={e => setBulkFormData({ ...bulkFormData, leave_type: e.target.value })}>
                        <option value="">{t('Select Type')}</option>
                        {uniqueLeaveTypes.map(type => (
                          <option key={type} value={type}>{t(type)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Year')}</label>
                      <input type="number" className="form-control rounded-3"
                        value={bulkFormData.year}
                        onChange={e => setBulkFormData({ ...bulkFormData, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Allocated Days Per Employee')}</label>
                      <input type="number" className="form-control rounded-3" required min="1"
                        value={bulkFormData.allocated}
                        onChange={e => setBulkFormData({ ...bulkFormData, allocated: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} text-center`}>
                        <p className="small text-muted mb-0">
                          <FontAwesomeIcon icon={faUsers} className="me-1" />
                          {t('This will allocate')} {bulkFormData.allocated} {t('days of')} {bulkFormData.leave_type || t('selected type')} {t('to all employees in the selected department')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowBulkForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-info rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" />{t('Bulk Allocate')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default LeaveQuotaManagement;
