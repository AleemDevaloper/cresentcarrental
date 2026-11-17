import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faReceipt, faCoins, faClock, faCircleCheck, faTimes,
  faEye, faCheck, faTrash, faFilePdf, faFileImage, faChartBar,
  faFilter, faCar, faGasPump, faUtensils, faHospital, faBuilding,
  faPhone, faHandshake, faEllipsisH, faDollarSign, faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listExpenses, createExpense, updateExpenseStatus, deleteExpense } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';
import { getApiBaseUrl } from '../../../../api/client';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const ExpenseManagementPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    amount: '', category: 'Travel', description: '', expense_date: '', receipt: null
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category = filterCategory;
      const data = await listExpenses(params);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterStatus, filterCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.expense_date) {
      addNotification(t('fill_required_fields'), 'warning');
      return;
    }
    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append('amount', formData.amount);
      dataToSend.append('category', formData.category);
      dataToSend.append('description', formData.description);
      dataToSend.append('expense_date', formData.expense_date);
      dataToSend.append('employee_id', currentUser?.id);
      if (formData.receipt) dataToSend.append('receipt', formData.receipt);
      await createExpense(dataToSend);
      addNotification(t('expense_submitted'), 'success');
      setShowModal(false);
      setFormData({ amount: '', category: 'Travel', description: '', expense_date: '', receipt: null });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_submitting'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateExpenseStatus(id, status);
      addNotification(t('status_updated'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete_expense'))) return;
    try {
      await deleteExpense(id);
      addNotification(t('expense_deleted'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_deleting'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved': return 'bg-success-subtle text-success border-success';
      case 'paid': return 'bg-info-subtle text-info border-info';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  };

  const expenseCategories = [
    { name: 'Travel', icon: faCar, color: '#4f46e5' },
    { name: 'Fuel', icon: faGasPump, color: '#f59e0b' },
    { name: 'Food', icon: faUtensils, color: '#ec4899' },
    { name: 'Medical', icon: faHospital, color: '#ef4444' },
    { name: 'Accommodation', icon: faBuilding, color: '#8b5cf6' },
    { name: 'Communication', icon: faPhone, color: '#10b981' },
    { name: 'Client Meetings', icon: faHandshake, color: '#3b82f6' },
    { name: 'Misc', icon: faEllipsisH, color: '#64748b' },
  ];

  const isAdminOrHR = currentUser?.role === 'Admin' || currentUser?.role === 'HR';

  const statsCards = [
    { label: t('total_claims'), value: expenses.length, icon: faReceipt, color: '#4f46e5' },
    { label: t('approved_paid'), value: expenses.filter(e => ['approved', 'paid'].includes(e.status?.toLowerCase())).length, icon: faCircleCheck, color: '#10b981' },
    { label: t('pending_review'), value: expenses.filter(e => e.status?.toLowerCase() === 'pending').length, icon: faClock, color: '#f59e0b' },
    { label: t('total_amount'), value: `$${expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0).toFixed(0)}`, icon: faDollarSign, color: '#8b5cf6' },
  ];

  if (loading && expenses.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('expense_management')}</h4><p className="text-muted small mb-0">{t('manage_expense_claims')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && expenses.length === 0) {
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
          <h4 className="fw-bold mb-1">{t('expense_management')}</h4>
          <p className="text-muted small mb-0">{t('manage_expense_claims')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_expense')}
        </button>
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{t('expense_claims')}</h5>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm border-0 bg-light rounded-3" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="">{t('all_categories')}</option>
                {expenseCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <select className="form-select form-select-sm border-0 bg-light rounded-3" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">{t('all_statuses')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="approved">{t('approved')}</option>
                <option value="paid">{t('paid')}</option>
                <option value="rejected">{t('rejected')}</option>
              </select>
            </div>
          </div>
          {expenses.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead><tr className="small text-muted"><th>{t('date')}</th>{isAdminOrHR && <th>{t('employee')}</th>}<th>{t('category')}</th><th>{t('description')}</th><th>{t('amount')}</th><th>{t('receipt')}</th><th>{t('status')}</th><th className="text-end">{t('actions')}</th></tr></thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td className="small">{e.expense_date ? new Date(e.expense_date).toLocaleDateString() : '-'}</td>
                      {isAdminOrHR && <td><div className="small fw-bold">{e.user?.name}</div></td>}
                      <td><span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: `${expenseCategories.find(c => c.name === e.category)?.color || '#64748b'}20`, color: expenseCategories.find(c => c.name === e.category)?.color || '#64748b' }}>{e.category}</span></td>
                      <td className="small text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description || '-'}</td>
                      <td className="small fw-bold">${parseFloat(e.amount || 0).toFixed(2)}</td>
                      <td>{e.receipt_path ? <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setSelectedReceipt(e.receipt_path)}><FontAwesomeIcon icon={faFileImage} /></button> : <span className="text-muted x-small">-</span>}</td>
                      <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(e.status)}`}>{e.status}</span></td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          {isAdminOrHR && e.status === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success rounded-3" onClick={() => handleStatusChange(e.id, 'approved')}><FontAwesomeIcon icon={faCheck} /></button>
                              <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleStatusChange(e.id, 'rejected')}><FontAwesomeIcon icon={faTimes} /></button>
                            </>
                          )}
                          {e.status === 'pending' && <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(e.id)}><FontAwesomeIcon icon={faTrash} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted small">{t('no_expenses')}</div>
          )}
        </div>
      </div>

      {selectedReceipt && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 bg-transparent">
              <div className="modal-header border-0 justify-content-end">
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedReceipt(null)}></button>
              </div>
              <div className="modal-body text-center p-4">
                {selectedReceipt.endsWith('.pdf') ? (
                  <iframe src={`${getApiBaseUrl()}/${selectedReceipt}`} width="100%" height="500px" title="Receipt" className="rounded-3 bg-white"></iframe>
                ) : (
                  <img src={`${getApiBaseUrl()}/${selectedReceipt}`} alt="Receipt" className="img-fluid rounded-3" style={{ maxHeight: '70vh' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('submit_expense')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('amount')}</label>
                      <input type="number" step="0.01" className="form-control rounded-3" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('category')}</label>
                      <select className="form-select rounded-3" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {expenseCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('expense_date')}</label>
                      <input type="date" className="form-control rounded-3" required value={formData.expense_date} onChange={e => setFormData({ ...formData, expense_date: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('description')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('receipt_attachment')}</label>
                      <input type="file" className="form-control rounded-3" accept="image/*,application/pdf" onChange={e => setFormData({ ...formData, receipt: e.target.files[0] })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={loading}>{loading ? t('submitting') : t('submit_claim')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
      `}} />
    </div>
  );
};

export default ExpenseManagementPortal;
