import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faUserTie, faSearch, faChevronDown, faChevronRight,
  faSitemap, faExchange, faUsers, faUserPlus, faCrown,
  faBuilding, faExclamationTriangle, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  getOrgChart, getReportingHierarchy, createReportingHierarchy,
  getDepartmentHierarchy, getSuccessors, listEmployees, listDepartments
} from '../../../../api/hrms';

const HIERARCHY_LEVELS = ['CEO', 'Director', 'VP', 'Department Head', 'Manager', 'Team Lead', 'Employee'];

const ReportingHierarchy = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [orgChart, setOrgChart] = useState(null);
  const [hierarchy, setHierarchy] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showSuccessors, setShowSuccessors] = useState(false);
  const [successors, setSuccessors] = useState([]);
  const [successorsFor, setSuccessorsFor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '', reporting_manager_id: '', secondary_manager_id: '',
    dotted_line_manager_id: '', hierarchy_level: 'Employee'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [org, hier, empData, deptData] = await Promise.all([
        getOrgChart(),
        getReportingHierarchy(),
        listEmployees(),
        listDepartments()
      ]);
      setOrgChart(org || null);
      setHierarchy(Array.isArray(hier) ? hier : hier?.data || []);
      setEmployees(Array.isArray(empData) ? empData : empData?.data || []);
      setDepartments(Array.isArray(deptData) ? deptData : deptData?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load hierarchy');
      addNotification?.(err.message || 'Failed to load hierarchy', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleNode = (id) => {
    const next = new Set(expandedNodes);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedNodes(next);
  };

  const handleDeptFilter = async (deptId) => {
    setSelectedDept(deptId);
    if (deptId) {
      try {
        const data = await getDepartmentHierarchy(deptId);
        setOrgChart(data || null);
      } catch {
        // fallback
      }
    } else {
      fetchData();
    }
  };

  const handleViewSuccessors = async (empId, empName) => {
    try {
      const data = await getSuccessors(empId);
      setSuccessors(Array.isArray(data) ? data : data?.data || []);
      setSuccessorsFor(empName);
      setShowSuccessors(true);
    } catch (err) {
      addNotification?.(err.message || 'Failed to load successors', 'danger');
    }
  };

  const openAssignForm = (emp = null) => {
    setFormData({
      employee_id: emp?.id?.toString() || '',
      reporting_manager_id: '', secondary_manager_id: '',
      dotted_line_manager_id: '', hierarchy_level: 'Employee'
    });
    setShowAssignForm(true);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createReportingHierarchy(formData);
      addNotification?.('Reporting relationship created', 'success');
      setShowAssignForm(false);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to create relationship', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = ['danger', 'warning', 'info', 'primary', 'success', 'secondary', 'dark'];
    const idx = HIERARCHY_LEVELS.indexOf(level);
    return colors[idx >= 0 ? idx : 6];
  };

  const filteredEmployees = employees.filter(e => {
    const matchSearch = (e.name || `${e.first_name || ''} ${e.last_name || ''}`).toLowerCase().includes(search.toLowerCase());
    const matchDept = !selectedDept || e.department_id?.toString() === selectedDept;
    return matchSearch && matchDept;
  });

  const groupedByLevel = HIERARCHY_LEVELS.reduce((acc, lvl) => {
    acc[lvl] = filteredEmployees.filter(e => e.level === lvl);
    return acc;
  }, {});

  const renderTreeNode = (node) => {
    if (!node) return null;
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    return (
      <li key={node.id} style={{ listStyle: 'none' }}>
        <div className="d-flex align-items-center gap-2 py-1">
          {hasChildren ? (
            <span className="cursor-pointer" onClick={() => toggleNode(node.id)}>
              <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} className="text-muted" size="sm" />
            </span>
          ) : <span style={{ width: 16 }} />}
          <FontAwesomeIcon icon={faUserTie} className={`text-${getLevelColor(node.level || 'Employee')}`} />
          <span className="small fw-bold">{node.name || `${node.first_name || ''} ${node.last_name || ''}`}</span>
          {node.designation && <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>({node.designation})</span>}
          <button className="btn btn-sm btn-outline-primary rounded-3 py-0 px-2 ms-2" title="View Successors"
            onClick={() => handleViewSuccessors(node.id, node.name)}>
            <FontAwesomeIcon icon={faCrown} size="xs" />
          </button>
        </div>
        {isExpanded && hasChildren && (
          <ul className="ps-4 mb-0" style={{ borderLeft: `2px solid ${isDark ? '#444' : '#dee2e6'}` }}>
            {node.children.map(child => renderTreeNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faSitemap} className="me-2 text-primary" />Reporting Hierarchy</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Organization structure and reporting lines</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => openAssignForm()}>
          <FontAwesomeIcon icon={faUserPlus} className="me-2" />Assign Manager
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-transparent"><FontAwesomeIcon icon={faSearch} /></span>
            <input type="text" className="form-control" placeholder="Search by employee name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={selectedDept} onChange={e => handleDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {/* Org Chart Tree */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-header bg-transparent border-0 py-3">
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faSitemap} className="me-2 text-primary" />Organization Tree</h6>
              </div>
              <div className="card-body p-4">
                {orgChart ? (
                  <ul className="ps-0 mb-0">
                    {renderTreeNode(orgChart)}
                  </ul>
                ) : filteredEmployees.length === 0 ? (
                  <div className="text-center py-4 text-muted">No employees found</div>
                ) : (
                  HIERARCHY_LEVELS.map((level) => {
                    const levelEmps = groupedByLevel[level];
                    if (levelEmps.length === 0 && level !== 'CEO') return null;
                    return (
                      <div key={level} className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={`badge bg-${getLevelColor(level)} rounded-pill`}>{level}</span>
                          <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{levelEmps.length} employee(s)</span>
                        </div>
                        {levelEmps.length === 0 ? (
                          <p className={`small ms-3 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>No employees at this level</p>
                        ) : (
                          <div className="d-flex flex-wrap gap-2 ms-3">
                            {levelEmps.map(emp => (
                              <div key={emp.id} className={`org-node card border-0 shadow-sm rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`} style={{ width: 200 }}>
                                <div className="card-body p-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <div className={`p-1 rounded-circle bg-${getLevelColor(level)}-subtle`}>
                                      <FontAwesomeIcon icon={faUserTie} className={`text-${getLevelColor(level)}`} size="sm" />
                                    </div>
                                    <div className="flex-grow-1 min-w-0">
                                      <p className="mb-0 fw-bold small text-truncate">{emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`}</p>
                                      <p className={`mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'} x-small`}>{emp.designation || emp.job_title}</p>
                                    </div>
                                    <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => toggleNode(emp.id)}>
                                      <FontAwesomeIcon icon={expandedNodes.has(emp.id) ? faChevronDown : faChevronRight} size="xs" />
                                    </button>
                                  </div>
                                  {emp.department_name && <span className="badge bg-secondary-subtle text-secondary x-small mt-1">{emp.department_name}</span>}
                                  {expandedNodes.has(emp.id) && (
                                    <div className={`mt-2 pt-2 border-top ${isDark ? 'border-secondary' : ''}`}>
                                      <p className={`x-small fw-bold ${isDark ? 'text-light opacity-75' : 'text-muted'} mb-1`}>Direct Reports:</p>
                                      {filteredEmployees.filter(e => e.reports_to === emp.id || e.reporting_manager_id === emp.id).length === 0 ? (
                                        <p className="x-small text-muted mb-0">No direct reports</p>
                                      ) : filteredEmployees.filter(e => e.reports_to === emp.id || e.reporting_manager_id === emp.id).map(r => (
                                        <div key={r.id} className="d-flex align-items-center gap-1 mb-1">
                                          <FontAwesomeIcon icon={faUser} className="text-muted" size="xs" />
                                          <span className="x-small">{r.name || `${r.first_name || ''} ${r.last_name || ''}`}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="mt-2 d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-primary rounded-3 py-0 px-2 x-small" onClick={() => openAssignForm(emp)}>
                                      <FontAwesomeIcon icon={faExchange} className="me-1" size="xs" />Assign
                                    </button>
                                    <button className="btn btn-sm btn-outline-warning rounded-3 py-0 px-2 x-small" onClick={() => handleViewSuccessors(emp.id, emp.name)}>
                                      <FontAwesomeIcon icon={faCrown} size="xs" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            {/* Hierarchy List */}
            <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-header bg-transparent border-0 py-3">
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faUsers} className="me-2 text-success" />Reporting Lines</h6>
              </div>
              <div className="card-body p-0">
                {hierarchy.length === 0 ? (
                  <div className="text-center py-4 text-muted small">No reporting relationships defined</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {hierarchy.slice(0, 20).map((rel, i) => (
                      <div key={rel.id || i} className={`list-group-item border-0 ${isDark ? 'bg-dark-subtle text-light' : ''} px-4 py-3`}>
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faUser} className="text-primary" />
                          <span className="small fw-bold">{rel.employee_name || rel.employee?.name || `Employee #${rel.employee_id}`}</span>
                          <FontAwesomeIcon icon={faExchange} className="text-muted" size="xs" />
                          <FontAwesomeIcon icon={faUserTie} className="text-success" />
                          <span className="small">{rel.manager_name || rel.manager?.name || `Manager #${rel.reporting_manager_id}`}</span>
                        </div>
                        {rel.hierarchy_level && (
                          <span className="badge bg-info-subtle text-info x-small mt-1">{rel.hierarchy_level}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Succession Planning Placeholder */}
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-header bg-transparent border-0 py-3">
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faCrown} className="me-2 text-warning" />Succession Planning</h6>
              </div>
              <div className="card-body p-4">
                <p className={`small ${isDark ? 'text-light opacity-75' : 'text-muted'} mb-0`}>
                  Click the <FontAwesomeIcon icon={faCrown} className="text-warning" /> icon on any employee card to view their successors.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Successors Modal */}
      {showSuccessors && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faCrown} className="me-2 text-warning" />Successors {successorsFor ? `for ${successorsFor}` : ''}</h5>
                <button className="btn-close" onClick={() => setShowSuccessors(false)} />
              </div>
              <div className="modal-body p-4">
                {successors.length === 0 ? (
                  <p className="text-muted mb-0">No successors found</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {successors.map((s, i) => (
                      <div key={i} className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} d-flex align-items-center gap-3`}>
                        <FontAwesomeIcon icon={faUser} className="text-warning" />
                        <div>
                          <p className="mb-0 fw-bold small">{s.name || `${s.first_name || ''} ${s.last_name || ''}`}</p>
                          {s.designation && <p className={`mb-0 x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{s.designation}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowSuccessors(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Assignment Modal */}
      {showAssignForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">Create Reporting Relationship</h5>
                <button className="btn-close" onClick={() => setShowAssignForm(false)} />
              </div>
              <form onSubmit={handleAssign}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">Employee</label>
                    <select className="form-select rounded-3" value={formData.employee_id}
                      onChange={e => setFormData({ ...formData, employee_id: e.target.value })} required>
                      <option value="">Select Employee</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name || `${e.first_name || ''} ${e.last_name || ''}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">Primary Manager</label>
                    <select className="form-select rounded-3" value={formData.reporting_manager_id}
                      onChange={e => setFormData({ ...formData, reporting_manager_id: e.target.value })}>
                      <option value="">Select Manager</option>
                      {employees.filter(e => e.id?.toString() !== formData.employee_id).map(e => (
                        <option key={e.id} value={e.id}>{e.name || `${e.first_name || ''} ${e.last_name || ''}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">Secondary Manager</label>
                    <select className="form-select rounded-3" value={formData.secondary_manager_id}
                      onChange={e => setFormData({ ...formData, secondary_manager_id: e.target.value })}>
                      <option value="">Select Manager</option>
                      {employees.filter(e => e.id?.toString() !== formData.employee_id).map(e => (
                        <option key={e.id} value={e.id}>{e.name || `${e.first_name || ''} ${e.last_name || ''}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">Dotted Line Manager</label>
                    <select className="form-select rounded-3" value={formData.dotted_line_manager_id}
                      onChange={e => setFormData({ ...formData, dotted_line_manager_id: e.target.value })}>
                      <option value="">Select Manager</option>
                      {employees.filter(e => e.id?.toString() !== formData.employee_id).map(e => (
                        <option key={e.id} value={e.id}>{e.name || `${e.first_name || ''} ${e.last_name || ''}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">Hierarchy Level</label>
                    <select className="form-select rounded-3" value={formData.hierarchy_level}
                      onChange={e => setFormData({ ...formData, hierarchy_level: e.target.value })}>
                      {HIERARCHY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowAssignForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : 'Assign'}
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

export default ReportingHierarchy;
