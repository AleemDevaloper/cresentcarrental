import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingColumns, faPlus, faCheckCircle, faLock, faCreditCard,
  faEdit, faTrash, faHistory, faShield, faCircleCheck, faCircleXmark,
  faStar, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listBankDetails, createBankDetail, updateBankDetail,
  deleteBankDetail, setPrimaryBankDetail, verifyBankDetail, getBankDetailHistory
} from '../../../../api/hrms';
import { EnableDisableButton } from '../../../../components/common';

const BankDetailsManagement = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '', account_title: '', account_number: '', iban: '',
    branch_code: '', branch_name: '', swift_code: '',
    salary_transfer_method: 'direct_deposit', is_primary: false
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listBankDetails();
      setAccounts(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load bank accounts');
      addNotification?.(err.message || 'Failed to load bank accounts', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const handleHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getBankDetailHistory();
      setHistoryData(Array.isArray(data) ? data : data?.data || []);
      setShowHistory(true);
    } catch (err) {
      addNotification?.(err.message || 'Failed to load history', 'danger');
    } finally {
      setHistoryLoading(false);
    }
  };

  const openAddForm = () => {
    setEditAccount(null);
    setFormData({
      bank_name: '', account_title: '', account_number: '', iban: '',
      branch_code: '', branch_name: '', swift_code: '',
      salary_transfer_method: 'direct_deposit', is_primary: false
    });
    setShowForm(true);
  };

  const openEditForm = (acc) => {
    setEditAccount(acc);
    setFormData({
      bank_name: acc.bank_name || '',
      account_title: acc.account_title || '',
      account_number: acc.account_number || '',
      iban: acc.iban || '',
      branch_code: acc.branch_code || '',
      branch_name: acc.branch_name || '',
      swift_code: acc.swift_code || '',
      salary_transfer_method: acc.salary_transfer_method || 'direct_deposit',
      is_primary: acc.is_primary || false
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAccount) {
        await updateBankDetail(editAccount.id, formData);
        addNotification?.('Account updated', 'success');
      } else {
        await createBankDetail(formData);
        addNotification?.('Account added', 'success');
      }
      setShowForm(false);
      setEditAccount(null);
      fetchAccounts();
    } catch (err) {
      addNotification?.(err.message || 'Error saving account', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bank account?')) return;
    try {
      await deleteBankDetail(id);
      addNotification?.('Account deleted', 'success');
      fetchAccounts();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await setPrimaryBankDetail(id);
      addNotification?.('Primary account updated', 'success');
      fetchAccounts();
    } catch (err) {
      addNotification?.(err.message || 'Failed to set primary', 'danger');
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyBankDetail(id);
      addNotification?.('Account verified', 'success');
      fetchAccounts();
    } catch (err) {
      addNotification?.(err.message || 'Verification failed', 'danger');
    }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Bank Details Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Employee salary and banking information</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary rounded-3" onClick={handleHistory}>
            <FontAwesomeIcon icon={faHistory} className="me-2" />History
          </button>
          <button className="btn btn-primary rounded-3" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Add Bank Account
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      {/* Account Cards */}
      <div className="row g-4 mb-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FontAwesomeIcon icon={faBuildingColumns} className="fs-1 text-muted mb-3 opacity-50" />
            <p className="text-muted">No bank accounts added yet</p>
          </div>
        ) : accounts.map(acc => (
          <div key={acc.id} className="col-md-6 col-lg-4">
            <div className={`card border-0 shadow-sm rounded-4 overflow-hidden h-100 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className={`p-4 ${acc.is_primary ? 'bg-primary text-white' : isDark ? 'bg-secondary' : 'bg-dark text-white'}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <FontAwesomeIcon icon={faBuildingColumns} className="fs-2 mb-2 opacity-75" />
                    <h6 className="fw-bold mb-0">{acc.bank_name}</h6>
                  </div>
                  <div className="d-flex gap-2">
                    {acc.is_primary && <span className="badge bg-light text-dark"><FontAwesomeIcon icon={faStar} className="me-1" />Primary</span>}
                    <FontAwesomeIcon icon={faLock} className="opacity-75" />
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-3">
                  <span className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>VERIFICATION</span>
                  <span className={`badge ${acc.verification_status === 'verified' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                    <FontAwesomeIcon icon={acc.verification_status === 'verified' ? faCircleCheck : faCircleXmark} className="me-1" />
                    {acc.verification_status === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="mb-1 fw-bold">{acc.account_title}</p>
                  <p className={`mb-1 small ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>
                    <FontAwesomeIcon icon={faCreditCard} className="me-1" />•••• {acc.account_number?.slice(-4)}
                  </p>
                  {acc.iban && <p className={`mb-0 small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>IBAN: {acc.iban}</p>}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-sm btn-light rounded-3" title="Edit" onClick={() => openEditForm(acc)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-sm btn-danger rounded-3" title="Delete" onClick={() => handleDelete(acc.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  {!acc.is_primary && (
                    <button className="btn btn-sm btn-warning rounded-3" title="Set as Primary" onClick={() => handleSetPrimary(acc.id)}>
                      <FontAwesomeIcon icon={faStar} className="me-1" />Primary
                    </button>
                  )}
                  {acc.verification_status !== 'verified' && (
                    <button className="btn btn-sm btn-success rounded-3" title="Verify" onClick={() => handleVerify(acc.id)}>
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" />Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faHistory} className="me-2 text-primary" />Account History</h5>
                <button className="btn-close" onClick={() => setShowHistory(false)} />
              </div>
              <div className="modal-body p-0">
                {historyLoading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                ) : historyData.length === 0 ? (
                  <div className="text-center py-5 text-muted">No history records</div>
                ) : (
                  <div className="table-responsive">
                    <table className={`table align-middle mb-0 ${isDark ? 'table-dark' : ''}`}>
                      <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                        <tr>
                          <th className="ps-4 small">Date</th>
                          <th className="small">Action</th>
                          <th className="small">Bank</th>
                          <th className="small">Account</th>
                          <th className="pe-4 small text-end">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((h, i) => (
                          <tr key={i}>
                            <td className="ps-4 small">{h.created_at ? new Date(h.created_at).toLocaleString() : '-'}</td>
                            <td className="small">{h.action || h.event || '-'}</td>
                            <td className="small">{h.bank_name || '-'}</td>
                            <td className="small">{h.account_number ? `••••${h.account_number.slice(-4)}` : '-'}</td>
                            <td className="pe-4 text-end">
                              <span className={`badge ${h.status === 'verified' ? 'bg-success' : h.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                                {h.status || '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 p-4">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowHistory(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editAccount ? 'Edit Bank Account' : 'Add Bank Account'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Bank Name</label>
                      <input type="text" className="form-control rounded-3" required value={formData.bank_name}
                        onChange={e => setFormData({ ...formData, bank_name: e.target.value })} placeholder="e.g. National Bank" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Account Title</label>
                      <input type="text" className="form-control rounded-3" required value={formData.account_title}
                        onChange={e => setFormData({ ...formData, account_title: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Account Number</label>
                      <input type="text" className="form-control rounded-3" required value={formData.account_number}
                        onChange={e => setFormData({ ...formData, account_number: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">IBAN</label>
                      <input type="text" className="form-control rounded-3" value={formData.iban}
                        onChange={e => setFormData({ ...formData, iban: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Branch Code</label>
                      <input type="text" className="form-control rounded-3" value={formData.branch_code}
                        onChange={e => setFormData({ ...formData, branch_code: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Branch Name</label>
                      <input type="text" className="form-control rounded-3" value={formData.branch_name}
                        onChange={e => setFormData({ ...formData, branch_name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Swift Code</label>
                      <input type="text" className="form-control rounded-3" value={formData.swift_code}
                        onChange={e => setFormData({ ...formData, swift_code: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Salary Transfer Method</label>
                      <select className="form-select rounded-3" value={formData.salary_transfer_method}
                        onChange={e => setFormData({ ...formData, salary_transfer_method: e.target.value })}>
                        <option value="direct_deposit">Direct Deposit</option>
                        <option value="wire_transfer">Wire Transfer</option>
                        <option value="cheque">Cheque</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <EnableDisableButton
                        checked={formData.is_primary}
                        onClick={() => setFormData({ ...formData, is_primary: !formData.is_primary })}
                        label="Set as Primary Account"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faShield} className="me-2" />{editAccount ? 'Update Account' : 'Save Account'}
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

export default BankDetailsManagement;
