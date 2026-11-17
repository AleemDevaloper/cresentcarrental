import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRightFromBracket, 
  faFileInvoice, 
  faCheckCircle, 
  faClock,
  faBuildingColumns,
  faShieldHalved,
  faUserSlash,
  faCircleCheck,
  faTriangleExclamation,
  faPlus,
  faChevronRight,
  faArrowLeft,
  faMicrochip,
  faAddressCard,
  faSitemap,
  faCreditCard,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { 
  listResignations, 
  updateResignationStatus, 
  updateClearanceStage,
  getExitStats 
} from "../../../../api/hrms";

const ExitManagement = () => {
  const { addNotification, currentUser, theme } = useApp();
  const [resignations, setResignations] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedExit, setSelectedExit] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, statsRes] = await Promise.all([
        listResignations(),
        getExitStats()
      ]);
      setResignations(resRes);
      setStats(statsRes);
    } catch (err) {
      addNotification("Failed to fetch exit data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateResignationStatus(id, { status });
      addNotification(`Resignation ${status}`, "success");
      fetchData();
    } catch (err) {
      addNotification("Error updating status", "danger");
    }
  };

  const handleClearStage = async (stageId, status) => {
    try {
      await updateClearanceStage(stageId, { status, comments: "Cleared by " + currentUser.name });
      addNotification("Stage updated successfully", "success");
      const updated = await listResignations();
      setResignations(updated);
      setSelectedExit(updated.find(r => r.id === selectedExit.id));
    } catch (err) {
      addNotification("Error updating clearance", "danger");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-success text-white';
      case 'rejected': return 'bg-danger text-white';
      default: return 'bg-warning text-dark';
    }
  };

  const getDeptIcon = (dept) => {
      switch(dept) {
          case 'IT': return faMicrochip;
          case 'HR': return faAddressCard;
          case 'Admin': return faSitemap;
          case 'Finance': return faCreditCard;
          case 'Manager': return faUserTie;
          default: return faShieldHalved;
      }
  };

  if (selectedExit) {
      return (
          <div className="p-3 p-lg-4 animate-fade-in">
              <button className="btn btn-link text-decoration-none p-0 mb-4 text-muted" onClick={() => setSelectedExit(null)}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to List
              </button>

              <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                      <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 60, height: 60 }}>
                          {selectedExit.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1">{selectedExit.user?.name}</h4>
                        <p className="text-muted mb-0">{selectedExit.user?.emp_id} • {selectedExit.user?.role}</p>
                      </div>
                  </div>
                  <div className="text-end">
                      <span className={`badge rounded-pill mb-2 px-3 py-2 ${getStatusBadge(selectedExit.status)}`}>
                          {selectedExit.status.toUpperCase()}
                      </span>
                      <p className="small text-muted mb-0">Notice Period: {selectedExit.notice_period_days} Days</p>
                  </div>
              </div>

              <div className="row g-4">
                  <div className="col-lg-4">
                      <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                          <div className="card-body p-4">
                              <h6 className="fw-bold mb-3">Exit Details</h6>
                              <div className="mb-3">
                                  <label className="x-small text-muted fw-bold uppercase d-block mb-1">Reason</label>
                                  <p className="small mb-0">{selectedExit.reason}</p>
                              </div>
                              <div className="mb-3">
                                  <label className="x-small text-muted fw-bold uppercase d-block mb-1">Last Working Day</label>
                                  <p className="small mb-0 text-danger fw-bold">
                                      {selectedExit.last_working_day ? new Date(selectedExit.last_working_day).toLocaleDateString() : 'TBD'}
                                  </p>
                              </div>
                              {selectedExit.status === 'pending' && currentUser.role === 'Admin' && (
                                  <div className="d-grid gap-2 mt-4">
                                      <button className="btn btn-success rounded-3" onClick={() => handleUpdateStatus(selectedExit.id, 'approved')}>Approve Exit</button>
                                      <button className="btn btn-outline-danger rounded-3" onClick={() => handleUpdateStatus(selectedExit.id, 'rejected')}>Reject</button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  <div className="col-lg-8">
                      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                          <div className="card-header bg-transparent border-0 p-4 pb-0">
                              <h6 className="fw-bold mb-0">Departmental Clearance Workflow</h6>
                          </div>
                          <div className="card-body p-4">
                              <div className="row g-3">
                                  {selectedExit.clearance_stages?.map(stage => (
                                      <div key={stage.id} className="col-md-6">
                                          <div className={`p-3 border rounded-4 d-flex align-items-center justify-content-between ${stage.status === 'approved' ? 'bg-success bg-opacity-10 border-success-subtle' : 'bg-light bg-opacity-50'}`}>
                                              <div className="d-flex align-items-center gap-3">
                                                  <div className={`p-2 rounded-3 ${stage.status === 'approved' ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                                                      <FontAwesomeIcon icon={getDeptIcon(stage.department)} />
                                                  </div>
                                                  <div>
                                                      <p className="small fw-bold mb-0">{stage.department} Team</p>
                                                      <p className="x-small text-muted mb-0">Status: {stage.status.toUpperCase()}</p>
                                                  </div>
                                              </div>
                                              {stage.status === 'pending' && (
                                                  <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => handleClearStage(stage.id, 'approved')}>
                                                      Clear
                                                  </button>
                                              )}
                                              {stage.status === 'approved' && (
                                                  <FontAwesomeIcon icon={faCircleCheck} className="text-success" />
                                              )}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              
                              <div className="mt-4 p-3 rounded-4 bg-info bg-opacity-10 border border-info-subtle">
                                  <div className="d-flex gap-2 align-items-center text-info small">
                                      <FontAwesomeIcon icon={faShieldHalved} />
                                      <strong>Final Settlement:</strong> Payroll engine will calculate terminal dues once all clearances are approved.
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="p-3 p-lg-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Exit & Resignation Management</h4>
          <p className="text-muted small mb-0">Monitor employee separations and departmental clearances</p>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
          {[
              { label: 'Pending Resignations', value: stats?.pending_resignations || 0, icon: faFileInvoice, color: 'warning' },
              { label: 'Active Clearances', value: stats?.pending_clearances || 0, icon: faShieldHalved, color: 'primary' },
              { label: 'Exited This Month', value: stats?.exited_this_month || 0, icon: faUserSlash, color: 'danger' },
          ].map((stat, i) => (
              <div key={i} className="col-md-4">
                  <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                      <div className="card-body p-3 d-flex align-items-center gap-3">
                          <div className={`bg-${stat.color}-subtle p-3 rounded-3 text-${stat.color}`}>
                              <FontAwesomeIcon icon={stat.icon} className="fs-5" />
                          </div>
                          <div>
                              <p className="x-small text-muted mb-0 fw-bold uppercase ls-1">{stat.label}</p>
                              <h4 className="mb-0 fw-bold">{stat.value}</h4>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                      <tr className="small text-muted text-uppercase">
                          <th className="ps-4">Employee</th>
                          <th>Resign Date</th>
                          <th>LWD (Last Day)</th>
                          <th>Status</th>
                          <th className="pe-4 text-end">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {resignations.map(res => (
                          <tr key={res.id}>
                              <td className="ps-4">
                                  <div className="d-flex align-items-center gap-2">
                                      <div className="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '10px' }}>
                                          {res.user?.name?.charAt(0)}
                                      </div>
                                      <div>
                                          <p className="mb-0 small fw-bold text-dark-emphasis">{res.user?.name}</p>
                                          <p className="x-small text-muted mb-0">{res.user?.emp_id}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="small">{new Date(res.resignation_date).toLocaleDateString()}</td>
                              <td className="small text-danger fw-bold">{res.last_working_day ? new Date(res.last_working_day).toLocaleDateString() : 'TBD'}</td>
                              <td><span className={`badge rounded-pill x-small ${getStatusBadge(res.status)}`}>{res.status.toUpperCase()}</span></td>
                              <td className="pe-4 text-end">
                                  <button className="btn btn-light btn-sm rounded-pill border px-3" onClick={() => setSelectedExit(res)}>
                                      Clearance Workflow <FontAwesomeIcon icon={faChevronRight} className="ms-1 x-small" />
                                  </button>
                              </td>
                          </tr>
                      ))}
                      {resignations.length === 0 && !loading && (
                          <tr><td colSpan="5" className="text-center py-5 text-muted">No resignation requests found.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default ExitManagement;
