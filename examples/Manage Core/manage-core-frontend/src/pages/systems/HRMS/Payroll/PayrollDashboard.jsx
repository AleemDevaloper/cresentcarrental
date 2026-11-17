import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileInvoiceDollar, 
  faRotate, 
  faDownload, 
  faCheckCircle, 
  faClock,
  faEye,
  faFilter,
  faUsers,
  faCirclePlus,
  faLock,
  faCreditCard,
  faChevronRight,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { 
  listPayrollBatches, 
  createPayrollBatch, 
  runPayrollBatch, 
  finalizePayrollBatch, 
  payPayrollBatch,
  listPayslips 
} from "../../../../api/hrms";

const PayrollDashboard = () => {
  const { addNotification, currentUser, theme } = useApp();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const isDark = theme === "dark";
  
  const [batchData, setBatchData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listPayrollBatches();
      setBatches(res);
    } catch (err) {
      addNotification("Failed to fetch payroll batches", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPayrollBatch(batchData);
      addNotification("Payroll batch created", "success");
      setShowBatchModal(false);
      fetchData();
    } catch (err) {
      addNotification("Error creating batch", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleRunBatch = async (id) => {
    setLoading(true);
    try {
      await runPayrollBatch(id);
      addNotification("Payroll batch processed successfully", "success");
      fetchData();
      if (selectedBatch?.id === id) {
          const updated = await listPayrollBatches();
          setSelectedBatch(updated.find(b => b.id === id));
      }
    } catch (err) {
      addNotification("Error processing batch", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeBatch = async (id) => {
    setLoading(true);
    try {
      await finalizePayrollBatch(id);
      addNotification("Batch locked and finalized", "success");
      fetchData();
    } catch (err) {
      addNotification("Error finalizing batch", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePayBatch = async (id) => {
    setLoading(true);
    try {
      await payPayrollBatch(id);
      addNotification("Payroll marked as PAID", "success");
      fetchData();
    } catch (err) {
      addNotification("Error processing payment", "danger");
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (m) => {
    return new Date(2000, m - 1).toLocaleString('default', { month: 'long' });
  };

  const getStatusBadge = (status) => {
      switch (status) {
          case 'paid': return 'bg-success text-white';
          case 'locked': return 'bg-secondary text-white';
          case 'verified': return 'bg-info text-white';
          case 'processing': return 'bg-primary text-white';
          default: return 'bg-light text-dark border';
      }
  };

  if (selectedBatch) {
      return (
          <div className="p-3 p-lg-4 animate-fade-in">
              <button className="btn btn-link text-decoration-none p-0 mb-4 text-muted" onClick={() => setSelectedBatch(null)}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Batches
              </button>

              <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1">Batch: {getMonthName(selectedBatch.month)} {selectedBatch.year}</h4>
                    <span className={`badge rounded-pill ${getStatusBadge(selectedBatch.status)}`}>{selectedBatch.status.toUpperCase()}</span>
                  </div>
                  <div className="d-flex gap-2">
                      {selectedBatch.status === 'draft' && (
                          <button className="btn btn-primary rounded-3 px-4 shadow-sm" onClick={() => handleRunBatch(selectedBatch.id)} disabled={loading}>
                              <FontAwesomeIcon icon={faRotate} className={`me-2 ${loading ? 'fa-spin' : ''}`} /> Run Calculations
                          </button>
                      )}
                      {selectedBatch.status === 'verified' && (
                          <button className="btn btn-secondary rounded-3 px-4 shadow-sm" onClick={() => handleFinalizeBatch(selectedBatch.id)} disabled={loading}>
                              <FontAwesomeIcon icon={faLock} className="me-2" /> Lock Batch
                          </button>
                      )}
                      {selectedBatch.status === 'locked' && (
                          <button className="btn btn-success rounded-3 px-4 shadow-sm" onClick={() => handlePayBatch(selectedBatch.id)} disabled={loading}>
                              <FontAwesomeIcon icon={faCreditCard} className="me-2" /> Release Payment
                          </button>
                      )}
                  </div>
              </div>

              <div className="row g-4 mb-4">
                  {[
                      { label: 'Total Gross', value: selectedBatch.total_gross, color: 'primary' },
                      { label: 'Total Deductions', value: selectedBatch.total_deduction, color: 'danger' },
                      { label: 'Net Payable', value: selectedBatch.total_net, color: 'success' },
                      { label: 'Employees', value: selectedBatch.employee_count, color: 'info' },
                  ].map((stat, i) => (
                      <div key={i} className="col-md-3">
                          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                              <div className="card-body p-3">
                                  <p className="x-small text-muted mb-1 fw-bold uppercase">{stat.label}</p>
                                  <h4 className={`mb-0 fw-bold text-${stat.color}`}>
                                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                  </h4>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white py-3 px-4 border-0">
                      <h6 className="mb-0 fw-bold text-dark-emphasis">Generated Payslips</h6>
                  </div>
                  <div className="card-body p-0">
                      <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                              <thead className="bg-light">
                                  <tr className="small text-muted text-uppercase">
                                      <th className="ps-4">Employee</th>
                                      <th>Gross</th>
                                      <th>Deductions</th>
                                      <th>Net Salary</th>
                                      <th className="pe-4 text-end">Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {selectedBatch.payslips?.map(ps => (
                                      <tr key={ps.id}>
                                          <td className="ps-4">
                                              <div className="d-flex align-items-center gap-2">
                                                  <div className="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '10px' }}>
                                                      {ps.user?.name?.charAt(0)}
                                                  </div>
                                                  <div>
                                                      <p className="mb-0 small fw-bold text-dark-emphasis">{ps.user?.name}</p>
                                                      <p className="x-small text-muted mb-0">{ps.user?.emp_id}</p>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="small fw-semibold">{ps.gross_earning.toLocaleString()}</td>
                                          <td className="small text-danger">{ps.total_deduction.toLocaleString()}</td>
                                          <td className="small fw-bold text-success">{ps.net_salary.toLocaleString()}</td>
                                          <td className="pe-4 text-end">
                                              <button 
                                                className="btn btn-light btn-sm rounded-circle border me-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.alert("Generating PDF for " + ps.user?.name);
                                                }}
                                              >
                                                  <FontAwesomeIcon icon={faDownload} className="text-secondary" />
                                              </button>
                                              <button className="btn btn-light btn-sm rounded-circle border">
                                                  <FontAwesomeIcon icon={faEye} className="text-primary" />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
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
          <h4 className="fw-bold mb-1">Payroll Batches</h4>
          <p className="text-muted small mb-0">Manage bulk payroll processing and payment releases</p>
        </div>
        {currentUser?.role === 'Admin' && (
          <button className="btn btn-primary rounded-3 px-4 shadow-sm" onClick={() => setShowBatchModal(true)}>
            <FontAwesomeIcon icon={faCirclePlus} className="me-2" /> Create New Batch
          </button>
        )}
      </div>

      <div className="row g-4">
          {batches.map(batch => (
              <div key={batch.id} className="col-md-6 col-xl-4">
                  <div className={`card border-0 shadow-sm rounded-4 hover-lift transition ${isDark ? 'bg-dark border-1 border-secondary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedBatch(batch)}>
                      <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                  <h5 className="fw-bold mb-1 text-dark-emphasis">{getMonthName(batch.month)} {batch.year}</h5>
                                  <span className={`badge rounded-pill x-small ${getStatusBadge(batch.status)}`}>{batch.status.toUpperCase()}</span>
                              </div>
                              <div className="bg-light p-2 rounded-3">
                                  <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-primary" />
                              </div>
                          </div>
                          
                          <div className="row g-2 mb-3">
                              <div className="col-6">
                                  <p className="x-small text-muted mb-0">Total Net</p>
                                  <p className="small fw-bold mb-0 text-success">{batch.total_net.toLocaleString()}</p>
                              </div>
                              <div className="col-6 text-end">
                                  <p className="x-small text-muted mb-0">Employees</p>
                                  <p className="small fw-bold mb-0 text-dark-emphasis">{batch.employee_count}</p>
                              </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                              <div className="x-small text-muted">
                                  <FontAwesomeIcon icon={faUsers} className="me-1" />
                                  Processed by {batch.processed_by?.name || 'Admin'}
                              </div>
                              <FontAwesomeIcon icon={faChevronRight} className="text-muted x-small" />
                          </div>
                      </div>
                  </div>
              </div>
          ))}
          {batches.length === 0 && !loading && (
              <div className="col-12 text-center py-5">
                  <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                      <FontAwesomeIcon icon={faFileInvoiceDollar} className="fs-1 text-muted opacity-50" />
                  </div>
                  <p className="text-muted">No payroll batches found. Create your first batch to start.</p>
              </div>
          )}
      </div>

      {/* Create Batch Modal */}
      {showBatchModal && (
        <div className="modal show d-block animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 overflow-hidden ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">New Payroll Batch</h5>
                <button type="button" className="btn-close" onClick={() => setShowBatchModal(false)}></button>
              </div>
              <form onSubmit={handleCreateBatch}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Month</label>
                      <select className="form-select rounded-3" value={batchData.month} onChange={e => setBatchData({...batchData, month: e.target.value})}>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                          <option key={m} value={m}>{getMonthName(m)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Year</label>
                      <input type="number" className="form-control rounded-3" value={batchData.year} onChange={e => setBatchData({...batchData, year: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowBatchModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 shadow-sm" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Batch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        .transition { transition: all 0.3s ease; }
        .whitespace-nowrap { white-space: nowrap; }
      `}} />
    </div>
  );
};

export default PayrollDashboard;
