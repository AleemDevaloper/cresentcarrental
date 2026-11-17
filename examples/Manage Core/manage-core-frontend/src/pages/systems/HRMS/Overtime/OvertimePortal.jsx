import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listOvertimes, createOvertime, runOvertimeAutoDetect, updateOvertimeStatus, deleteOvertime } from '../../../../api/hrms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faClock,
  faCoins,
  faCheck,
  faTimes,
  faTrash,
  faCircleCheck,
  faMagicWandSparkles,
  faUser
} from "@fortawesome/free-solid-svg-icons";

const OvertimePortal = () => {
  const { currentUser, addNotification } = useApp();
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAutoDetectModal, setShowAutoDetectModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    hours: '',
    rate: '1.50',
    description: ''
  });

  const [autoDetectData, setAutoDetectData] = useState({
    start_date: '',
    end_date: ''
  });

  const fetchOvertimes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.type = filterType;
      const data = await listOvertimes(params);
      setOvertimes(data);
    } catch (err) {
      addNotification("Failed to fetch overtime records", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimes();
  }, [filterStatus, filterType]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.hours || !formData.description) {
      addNotification("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await createOvertime(formData);
      addNotification("Overtime request submitted successfully", "success");
      setShowApplyModal(false);
      setFormData({
        date: '',
        hours: '',
        rate: '1.50',
        description: ''
      });
      fetchOvertimes();
    } catch (err) {
      addNotification(err.message || "Error submitting request", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetectSubmit = async (e) => {
    e.preventDefault();
    if (!autoDetectData.start_date || !autoDetectData.end_date) {
      addNotification("Please select a valid date range", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await runOvertimeAutoDetect(autoDetectData);
      addNotification(res.message || "Auto detection finished successfully", "success");
      setShowAutoDetectModal(false);
      fetchOvertimes();
    } catch (err) {
      addNotification(err.message || "Error running auto-detection", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOvertimeStatus(id, status);
      addNotification(`Overtime record ${status} successfully`, "success");
      fetchOvertimes();
    } catch (err) {
      addNotification("Error updating status", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this overtime request?")) return;
    try {
      await deleteOvertime(id);
      addNotification("Overtime request deleted successfully", "success");
      fetchOvertimes();
    } catch (err) {
      addNotification("Error deleting request", "danger");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-success-subtle text-success border-success-subtle';
      case 'paid': return 'bg-info-subtle text-info border-info-subtle';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger-subtle';
      default: return 'bg-warning-subtle text-warning border-warning-subtle';
    }
  };

  const isAdminOrHR = currentUser?.role === 'Admin' || currentUser?.role === 'HR';

  const stats = [
    { label: 'Total Hours', value: overtimes.reduce((sum, o) => sum + parseFloat(o.hours), 0).toFixed(1) + ' hrs', icon: faClock, color: 'primary' },
    { label: 'Total Amount', value: '$' + overtimes.reduce((sum, o) => sum + parseFloat(o.amount), 0).toFixed(2), icon: faCoins, color: 'success' },
    { label: 'Pending Requests', value: overtimes.filter(o => o.status?.toLowerCase() === 'pending').length, icon: faClock, color: 'warning' },
    { label: 'Auto-detected', value: overtimes.filter(o => o.type === 'automated').length, icon: faMagicWandSparkles, color: 'info' }
  ];

  return (
    <div className="p-1 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1">Overtime Management</h4>
          <p className="text-muted small mb-0">Record manual extra hours or auto-detect based on shift and attendance timings</p>
        </div>
        <div className="d-flex gap-2">
          {isAdminOrHR && (
            <button className="btn btn-outline-primary rounded-3 px-3 shadow-sm" onClick={() => setShowAutoDetectModal(true)}>
              <FontAwesomeIcon icon={faMagicWandSparkles} className="me-2" /> Auto-Detect Shift OT
            </button>
          )}
          <button className="btn btn-primary rounded-3 px-4 shadow-sm" onClick={() => setShowApplyModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Request Overtime
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`bg-${stat.color}-subtle p-3 rounded-3 text-${stat.color}`}>
                  <FontAwesomeIcon icon={stat.icon} className="fs-5" />
                </div>
                <div>
                  <p className="small text-muted mb-0 fw-bold uppercase">{stat.label}</p>
                  <h4 className="mb-0 fw-bold">{stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overtime List */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-4">
              <h5 className="fw-bold mb-0">Overtime Logs</h5>
            </div>
            <div className="col-md-8 d-flex justify-content-md-end gap-3 flex-wrap">
              <select className="form-select border-0 shadow-sm rounded-3 bg-light w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option value="manual">Manual Request</option>
                <option value="automated">Automated Detection</option>
              </select>
              <select className="form-select border-0 shadow-sm rounded-3 bg-light w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light border-0">
                <tr>
                  <th>Date</th>
                  {isAdminOrHR && <th>Employee</th>}
                  <th>Type</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Total Amount</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={isAdminOrHR ? 9 : 8} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Loading logs...
                    </td>
                  </tr>
                )}
                {!loading && overtimes.length === 0 && (
                  <tr>
                    <td colSpan={isAdminOrHR ? 9 : 8} className="text-center py-4 text-muted">
                      No overtime records found.
                    </td>
                  </tr>
                )}
                {!loading && overtimes.map((ot) => (
                  <tr key={ot.id}>
                    <td>{new Date(ot.date).toLocaleDateString()}</td>
                    {isAdminOrHR && (
                      <td>
                        <div className="fw-bold">{ot.user?.name}</div>
                        <div className="text-muted small">{ot.user?.email}</div>
                      </td>
                    )}
                    <td>
                      <span className={`badge rounded-pill px-3 py-1 ${ot.type === 'automated' ? 'bg-info-subtle text-info' : 'bg-secondary-subtle text-secondary'}`}>
                        {ot.type === 'automated' ? 'Automated' : 'Manual'}
                      </span>
                    </td>
                    <td>{ot.hours} hrs</td>
                    <td>{ot.rate}x</td>
                    <td className="fw-bold text-dark">${parseFloat(ot.amount).toFixed(2)}</td>
                    <td>
                      <span className="text-wrap d-inline-block" style={{ maxWidth: '200px' }}>
                        {ot.description}
                      </span>
                    </td>
                    <td>
                      <span className={`badge border px-3 py-1.5 rounded-pill ${getStatusBadge(ot.status)}`}>
                        {ot.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {isAdminOrHR && ot.status?.toLowerCase() === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-success rounded-3" onClick={() => handleStatusChange(ot.id, 'approved')}>
                              <FontAwesomeIcon icon={faCheck} className="me-1" /> Approve
                            </button>
                            <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleStatusChange(ot.id, 'rejected')}>
                              <FontAwesomeIcon icon={faTimes} className="me-1" /> Reject
                            </button>
                          </>
                        )}
                        {ot.status?.toLowerCase() === 'pending' && (
                          <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(ot.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Request Modal */}
      {showApplyModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Request Overtime</h5>
                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body py-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Hours <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control rounded-3"
                        required
                        value={formData.hours}
                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                        placeholder="e.g. 2.5"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Multiplier Rate <span className="text-danger">*</span></label>
                      <select
                        className="form-select rounded-3"
                        value={formData.rate}
                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      >
                        <option value="1.00">1.0x (Regular)</option>
                        <option value="1.50">1.5x (Standard Overtime)</option>
                        <option value="2.00">2.0x (Double Time / Holiday)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Reason/Description <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control rounded-3"
                        rows="3"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Reason for overtime work..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowApplyModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Detect Overtime Modal */}
      {showAutoDetectModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Auto-Detect Overtime</h5>
                <button type="button" className="btn-close" onClick={() => setShowAutoDetectModal(false)}></button>
              </div>
              <form onSubmit={handleAutoDetectSubmit}>
                <div className="modal-body py-3">
                  <p className="text-muted small">
                    This utility will analyze all attendance check-ins and check-outs within the selected range against shift requirements and log pending overtime requests for any eligible extra hours.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Start Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        required
                        value={autoDetectData.start_date}
                        onChange={(e) => setAutoDetectData({ ...autoDetectData, start_date: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">End Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        required
                        value={autoDetectData.end_date}
                        onChange={(e) => setAutoDetectData({ ...autoDetectData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowAutoDetectModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={loading}>
                    {loading ? 'Detecting...' : 'Run Detection'}
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

export default OvertimePortal;
