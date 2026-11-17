import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listExpenses, createExpense, updateExpenseStatus, deleteExpense } from '../../../../api/hrms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faReceipt,
  faCoins,
  faClock,
  faCircleCheck,
  faTimes,
  faEye,
  faCheck,
  faTrash,
  faFilePdf,
  faFileImage
} from "@fortawesome/free-solid-svg-icons";
import { getApiBaseUrl } from '../../../../api/client';

const ExpensePortal = () => {
  const { currentUser, addNotification } = useApp();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Travel',
    description: '',
    expense_date: '',
    receipt: null
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category = filterCategory;
      const data = await listExpenses(params);
      setExpenses(data);
    } catch (err) {
      addNotification("Failed to fetch expenses", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterStatus, filterCategory]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, receipt: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.expense_date) {
      addNotification("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append('amount', formData.amount);
      dataToSend.append('category', formData.category);
      dataToSend.append('description', formData.description);
      dataToSend.append('expense_date', formData.expense_date);
      if (formData.receipt) {
        dataToSend.append('receipt', formData.receipt);
      }

      await createExpense(dataToSend);
      addNotification("Expense claim submitted successfully", "success");
      setShowModal(false);
      setFormData({
        amount: '',
        category: 'Travel',
        description: '',
        expense_date: '',
        receipt: null
      });
      fetchExpenses();
    } catch (err) {
      addNotification(err.message || "Error submitting claim", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateExpenseStatus(id, status);
      addNotification(`Expense claim ${status} successfully`, "success");
      fetchExpenses();
    } catch (err) {
      addNotification("Error updating status", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense claim?")) return;
    try {
      await deleteExpense(id);
      addNotification("Expense claim deleted successfully", "success");
      fetchExpenses();
    } catch (err) {
      addNotification("Error deleting claim", "danger");
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
    { label: 'Total Claims', value: expenses.length, icon: faReceipt, color: 'primary' },
    { label: 'Approved & Paid', value: expenses.filter(e => ['approved', 'paid'].includes(e.status?.toLowerCase())).length, icon: faCircleCheck, color: 'success' },
    { label: 'Pending Review', value: expenses.filter(e => e.status?.toLowerCase() === 'pending').length, icon: faClock, color: 'warning' },
    { label: 'Rejected', value: expenses.filter(e => e.status?.toLowerCase() === 'rejected').length, icon: faTimes, color: 'danger' }
  ];

  return (
    <div className="p-1 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Expense & Reimbursement Portal</h4>
          <p className="text-muted small mb-0">Claim business travel, fuel, medical, and other expense reimbursements</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4 shadow-sm" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> New Expense Claim
        </button>
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

      {/* Filters and List */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-4">
              <h5 className="fw-bold mb-0">Claim History</h5>
            </div>
            <div className="col-md-8 d-flex justify-content-md-end gap-3 flex-wrap">
              <select className="form-select border-0 shadow-sm rounded-3 bg-light w-auto" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Travel">Travel</option>
                <option value="Fuel">Fuel</option>
                <option value="Medical">Medical</option>
                <option value="Meals">Meals</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
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
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={isAdminOrHR ? 8 : 7} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Loading claims...
                    </td>
                  </tr>
                )}
                {!loading && expenses.length === 0 && (
                  <tr>
                    <td colSpan={isAdminOrHR ? 8 : 7} className="text-center py-4 text-muted">
                      No expense claims found.
                    </td>
                  </tr>
                )}
                {!loading && expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
                    {isAdminOrHR && (
                      <td>
                        <div className="fw-bold">{expense.user?.name}</div>
                        <div className="text-muted small">{expense.user?.email}</div>
                      </td>
                    )}
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1">
                        {expense.category}
                      </span>
                    </td>
                    <td>
                      <span className="text-wrap d-inline-block" style={{ maxWidth: '250px' }}>
                        {expense.description || <span className="text-muted small">No description</span>}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">${parseFloat(expense.amount).toFixed(2)}</td>
                    <td>
                      {expense.receipt_path ? (
                        <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setSelectedReceipt(expense.receipt_path)}>
                          <FontAwesomeIcon icon={expense.receipt_path.endsWith('.pdf') ? faFilePdf : faFileImage} className="me-1" />
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge border px-3 py-1.5 rounded-pill ${getStatusBadge(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {isAdminOrHR && expense.status?.toLowerCase() === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-success rounded-3" onClick={() => handleStatusChange(expense.id, 'approved')}>
                              <FontAwesomeIcon icon={faCheck} className="me-1" /> Approve
                            </button>
                            <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleStatusChange(expense.id, 'rejected')}>
                              <FontAwesomeIcon icon={faTimes} className="me-1" /> Reject
                            </button>
                          </>
                        )}
                        {expense.status?.toLowerCase() === 'pending' && (
                          <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(expense.id)}>
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

      {/* Claim Submission Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Submit Expense Claim</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body py-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">Amount ($) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control rounded-3"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Category <span className="text-danger">*</span></label>
                      <select
                        className="form-select rounded-3"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Travel">Travel</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Medical">Medical</option>
                        <option value="Meals">Meals</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Expense Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        required
                        value={formData.expense_date}
                        onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Description</label>
                      <textarea
                        className="form-control rounded-3"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide details about this expense..."
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Receipt Attachment</label>
                      <input
                        type="file"
                        className="form-control rounded-3"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                      />
                      <div className="form-text small text-muted">Supports JPEG, PNG, JPG, or PDF. Max size 2MB.</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 bg-transparent text-white">
              <div className="modal-header border-0 pb-0 justify-content-end">
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedReceipt(null)}></button>
              </div>
              <div className="modal-body text-center p-4">
                {selectedReceipt.endsWith('.pdf') ? (
                  <iframe
                    src={`${getApiBaseUrl()}/${selectedReceipt}`}
                    width="100%"
                    height="500px"
                    title="Receipt PDF"
                    className="rounded-3 bg-white"
                  ></iframe>
                ) : (
                  <img
                    src={`${getApiBaseUrl()}/${selectedReceipt}`}
                    alt="Receipt"
                    className="img-fluid rounded-3 max-vh-75 shadow-lg bg-white"
                    style={{ maxHeight: '70vh' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensePortal;
