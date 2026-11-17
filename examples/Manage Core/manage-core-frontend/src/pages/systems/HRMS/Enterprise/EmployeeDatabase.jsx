import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faSearch, faFilter, faPlus, faDownload, faUpload,
  faEye, faEdit, faArchive, faUndo, faChevronRight, faUserCheck,
  faUserSlash, faBuilding, faBriefcase, faEnvelope, faPhone,
  faMapMarkerAlt, faSort, faFileCsv, faCheckCircle, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listEmployees, archiveEmployee, reactivateEmployee, bulkImportEmployees, exportEmployees, listDepartments } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

const EmployeeDatabase = () => {
  const { t } = useTranslation();
  const { theme, addNotification, setActiveTab, setEditUser } = useApp();
  const isDark = theme === 'dark';
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterDept) params.department = filterDept;
      if (filterStatus) params.status = filterStatus;
      if (search) params.search = search;
      const [emps, depts] = await Promise.all([listEmployees(params), listDepartments()]);
      setEmployees(Array.isArray(emps) ? emps : []);
      setDepartments(Array.isArray(depts) ? depts : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterDept, filterStatus, search]);

  const handleArchive = async (id) => {
    if (!window.confirm(t('confirm_archive'))) return;
    try {
      await archiveEmployee(id);
      addNotification(t('employee_archived'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_archiving'), 'error');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await reactivateEmployee(id);
      addNotification(t('employee_reactivated'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_reactivating'), 'error');
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.csv.files[0];
      const formData = new FormData();
      formData.append('file', file);
      await bulkImportEmployees(formData);
      addNotification(t('import_complete'), 'success');
      setShowImportModal(false);
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_importing'), 'error');
    }
  };

  const handleExport = async () => {
    try {
      await exportEmployees();
      addNotification(t('export_started'), 'success');
    } catch (err) {
      addNotification(err.message || t('error_exporting'), 'error');
    }
  };

  const statsCards = [
    { label: t('total_employees'), value: employees.length, icon: faUsers, color: '#4f46e5' },
    { label: t('active'), value: employees.filter(e => e.status !== 'archived').length, icon: faUserCheck, color: '#10b981' },
    { label: t('archived'), value: employees.filter(e => e.status === 'archived').length, icon: faArchive, color: '#64748b' },
    { label: t('departments'), value: departments.length || new Set(employees.map(e => e.department)).size, icon: faBuilding, color: '#8b5cf6' },
  ];

  if (loading && employees.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('employee_database')}</h4><p className="text-muted small mb-0">{t('centralized_employee_directory')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && employees.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('employee_database')}</h4>
          <p className="text-muted small mb-0">{t('centralized_employee_directory')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-3" onClick={() => setShowImportModal(true)}>
            <FontAwesomeIcon icon={faUpload} className="me-1" /> {t('import_csv')}
          </button>
          <button className="btn btn-outline-secondary rounded-3" onClick={handleExport}>
            <FontAwesomeIcon icon={faDownload} className="me-1" /> {t('export')}
          </button>
          <button className="btn btn-primary rounded-3 px-4" onClick={() => { setEditUser(null); setActiveTab('add-user'); }}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('add_employee')}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {statsCards.map((s, i) => (
          <div key={i} className="col-md-3">
            <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              <div className="input-group" style={{ maxWidth: 300 }}>
                <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
                <input type="text" className="form-control border-0 bg-light rounded-3" placeholder={t('search_employees')} value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select border-0 bg-light rounded-3 w-auto" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                <option value="">{t('all_departments')}</option>
                {departments.map(d => <option key={d.id || d} value={d.name || d}>{d.name || d}</option>)}
              </select>
              <select className="form-select border-0 bg-light rounded-3 w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">{t('all_statuses')}</option>
                <option value="active">{t('active')}</option>
                <option value="archived">{t('archived')}</option>
              </select>
            </div>
            <div className="d-flex gap-1">
              <button className={`btn btn-sm rounded-3 ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faUsers} /></button>
              <button className={`btn btn-sm rounded-3 ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('cards')}><FontAwesomeIcon icon={faBuilding} /></button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead><tr className="small text-muted"><th>{t('name')}</th><th>{t('employee_code')}</th><th>{t('department')}</th><th>{t('designation')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(emp)}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 36, height: 36, fontSize: 10 }}>{emp.name?.charAt(0) || '?'}</div>
                          <div><div className="small fw-bold">{emp.name}</div><div className="x-small text-muted">{emp.email}</div></div>
                        </div>
                      </td>
                      <td><span className="small text-muted">{emp.emp_id || '-'}</span></td>
                      <td><span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: '#4f46e520', color: '#4f46e5' }}>{emp.department || '-'}</span></td>
                      <td><span className="small">{emp.designation || '-'}</span></td>
                      <td><span className={`badge rounded-pill ${emp.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{emp.status || 'active'}</span></td>
                      <td>
                        <div className="d-flex gap-1" onClick={e => e.stopPropagation()}>
                          <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                          <button className="btn btn-sm btn-outline-primary rounded-3" onClick={() => { setEditUser(emp); setActiveTab('add-user'); }}><FontAwesomeIcon icon={faEdit} /></button>
                          {emp.status !== 'archived' ? (
                            <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleArchive(emp.id)}><FontAwesomeIcon icon={faArchive} /></button>
                          ) : (
                            <button className="btn btn-sm btn-outline-success rounded-3" onClick={() => handleReactivate(emp.id)}><FontAwesomeIcon icon={faUndo} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length === 0 && (
                <div className="text-center py-4 text-muted small">{t('no_employees_found')}</div>
              )}
            </div>
          ) : (
            <div className="row g-3">
              {employees.length > 0 ? employees.map(emp => (
                <div key={emp.id} className="col-md-4 col-lg-3">
                  <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(emp)}>
                    <div className="card-body p-3 text-center">
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-2" style={{ width: 48, height: 48 }}>{emp.name?.charAt(0) || '?'}</div>
                      <h6 className="fw-bold mb-0 small">{emp.name}</h6>
                      <div className="x-small text-muted">{emp.designation || emp.department}</div>
                      <div className="mt-2"><span className={`badge rounded-pill ${emp.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{emp.status || 'active'}</span></div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-4 text-muted small">{t('no_employees_found')}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('employee_details')}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEmployee(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-2" style={{ width: 64, height: 64, fontSize: 24 }}>{selectedEmployee.name?.charAt(0) || '?'}</div>
                  <h5 className="fw-bold mb-0">{selectedEmployee.name}</h5>
                  <div className="small text-muted">{selectedEmployee.email}</div>
                </div>
                <div className="row g-3">
                  <div className="col-6"><div className="x-small text-muted">{t('employee_code')}</div><div className="small fw-bold">{selectedEmployee.emp_id || '-'}</div></div>
                  <div className="col-6"><div className="x-small text-muted">{t('department')}</div><div className="small fw-bold">{selectedEmployee.department || '-'}</div></div>
                  <div className="col-6"><div className="x-small text-muted">{t('designation')}</div><div className="small fw-bold">{selectedEmployee.designation || '-'}</div></div>
                  <div className="col-6"><div className="x-small text-muted">{t('phone')}</div><div className="small fw-bold">{selectedEmployee.phone || '-'}</div></div>
                  <div className="col-12"><div className="x-small text-muted">{t('status')}</div><span className={`badge rounded-pill ${selectedEmployee.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{selectedEmployee.status || 'active'}</span></div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3" onClick={() => setSelectedEmployee(null)}>{t('close')}</button>
                <button className="btn btn-primary rounded-3 px-4" onClick={() => { setEditUser(selectedEmployee); setActiveTab('add-user'); }}><FontAwesomeIcon icon={faEdit} className="me-1" />{t('edit')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('import_employees_csv')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowImportModal(false)}></button>
              </div>
              <form onSubmit={handleImport}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">{t('csv_file')}</label>
                    <input type="file" name="csv" className="form-control rounded-3" accept=".csv" required />
                    <div className="form-text small text-muted">{t('csv_format_hint')}</div>
                  </div>
                  <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                    <h6 className="small fw-bold mb-2">{t('required_columns')}</h6>
                    <div className="x-small text-muted">name, email, department, designation, phone, emp_id, joining_date</div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowImportModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faUpload} className="me-1" />{t('import')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-secondary-subtle { background-color: #f1f5f9 !important; }
      `}} />
    </div>
  );
};

export default EmployeeDatabase;
