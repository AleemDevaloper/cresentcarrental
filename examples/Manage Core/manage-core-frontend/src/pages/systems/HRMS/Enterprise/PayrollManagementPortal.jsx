import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoiceDollar, faRotate, faDownload, faCheckCircle, faClock,
  faEye, faPlus, faLock, faCreditCard, faChevronRight, faArrowLeft,
  faUsers, faDollarSign, faPercent, faCalculator, faFilePdf,
  faChartBar, faArrowUp, faArrowDown, faFilter, faBank
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import {
  listPayrollBatches, createPayrollBatch, runPayrollBatch,
  finalizePayrollBatch, payPayrollBatch, listPayslips,
  listPayrollComponents, createPayrollComponent
} from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PayrollManagementPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [batches, setBatches] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [components, setComponents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);

  const [batchData, setBatchData] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [componentForm, setComponentForm] = useState({ name: '', type: 'earning', calculation_type: 'percentage', value: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, p, c] = await Promise.all([
        listPayrollBatches(),
        listPayslips(),
        listPayrollComponents()
      ]);
      setBatches(Array.isArray(b) ? b : []);
      setPayslips(Array.isArray(p) ? p : []);
      setComponents(Array.isArray(c) ? c : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await createPayrollBatch(batchData);
      addNotification(t('batch_created'), 'success');
      setShowBatchModal(false);
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_creating_batch'), 'error');
    }
  };

  const handleRunBatch = async (id) => {
    try {
      await runPayrollBatch(id);
      addNotification(t('batch_processed'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_processing'), 'error');
    }
  };

  const handleFinalizeBatch = async (id) => {
    try {
      await finalizePayrollBatch(id);
      addNotification(t('batch_finalized'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_finalizing'), 'error');
    }
  };

  const handlePayBatch = async (id) => {
    try {
      await payPayrollBatch(id);
      addNotification(t('payment_released'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_paying'), 'error');
    }
  };

  const handleCreateComponent = async (e) => {
    e.preventDefault();
    try {
      await createPayrollComponent(componentForm);
      addNotification(t('component_created'), 'success');
      setShowComponentModal(false);
      setComponentForm({ name: '', type: 'earning', calculation_type: 'percentage', value: '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_creating_component'), 'error');
    }
  };

  const getMonthName = (m) => new Date(2000, m - 1).toLocaleString('default', { month: 'long' });

  const getStatusBadge = (s) => {
    switch (s) {
      case 'paid': return 'bg-success text-white';
      case 'locked': return 'bg-secondary text-white';
      case 'verified': return 'bg-info text-white';
      case 'processing': return 'bg-primary text-white';
      default: return 'bg-light text-dark border';
    }
  };

  if (loading && batches.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('payroll_management')}</h4><p className="text-muted small mb-0">{t('manage_payroll_processing')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && batches.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  if (selectedBatch) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <button className="btn btn-link text-decoration-none p-0 mb-4 text-muted" onClick={() => setSelectedBatch(null)}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> {t('back_to_batches')}
        </button>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">{t('batch')}: {getMonthName(selectedBatch.month)} {selectedBatch.year}</h4>
            <span className={`badge rounded-pill ${getStatusBadge(selectedBatch.status)}`}>{selectedBatch.status?.toUpperCase()}</span>
          </div>
          <div className="d-flex gap-2">
            {selectedBatch.status === 'draft' && <button className="btn btn-primary rounded-3 px-4" onClick={() => handleRunBatch(selectedBatch.id)}><FontAwesomeIcon icon={faRotate} className="me-2" />{t('run_calculations')}</button>}
            {selectedBatch.status === 'verified' && <button className="btn btn-secondary rounded-3 px-4" onClick={() => handleFinalizeBatch(selectedBatch.id)}><FontAwesomeIcon icon={faLock} className="me-2" />{t('lock_batch')}</button>}
            {selectedBatch.status === 'locked' && <button className="btn btn-success rounded-3 px-4" onClick={() => handlePayBatch(selectedBatch.id)}><FontAwesomeIcon icon={faCreditCard} className="me-2" />{t('release_payment')}</button>}
          </div>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: t('total_gross'), value: selectedBatch.total_gross ? `$${selectedBatch.total_gross.toLocaleString()}` : '-', color: '#4f46e5' },
            { label: t('total_deductions'), value: selectedBatch.total_deduction ? `$${selectedBatch.total_deduction.toLocaleString()}` : '-', color: '#ef4444' },
            { label: t('net_payable'), value: selectedBatch.total_net ? `$${selectedBatch.total_net.toLocaleString()}` : '-', color: '#10b981' },
            { label: t('employees'), value: selectedBatch.employee_count || '-', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} className="col-md-3">
              <MetricCard label={s.label} value={s.value} icon={faDollarSign} color={s.color} isDark={isDark} />
            </div>
          ))}
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">{t('salary_components')}</h5>
                {components.length > 0 ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <h6 className="small fw-bold text-muted mb-2">{t('earnings')}</h6>
                      {components.filter(c => c.type === 'earning').map((c, i) => (
                        <div key={i} className="d-flex justify-content-between py-1">
                          <span className="small">{c.name}</span>
                          <span className="small fw-bold">{c.calculation_type === 'percentage' ? `${c.value}%` : `$${c.value}`}</span>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-6">
                      <h6 className="small fw-bold text-muted mb-2">{t('deductions')}</h6>
                      {components.filter(c => c.type === 'deduction').map((c, i) => (
                        <div key={i} className="d-flex justify-content-between py-1">
                          <span className="small">{c.name}</span>
                          <span className="small fw-bold text-danger">{c.calculation_type === 'percentage' ? `-${c.value}%` : `-$${c.value}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted small">{t('no_components')}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">{t('payslips')}</h5>
                {payslips.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                      <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('net')}</th><th></th></tr></thead>
                      <tbody>
                        {payslips.filter(ps => ps.batch_id === selectedBatch.id).slice(0, 5).map(ps => (
                          <tr key={ps.id}>
                            <td><div className="small fw-bold">{ps.user?.name}</div><div className="x-small text-muted">{ps.user?.emp_id}</div></td>
                            <td className="small fw-bold text-success">${ps.net_salary?.toLocaleString()}</td>
                            <td className="text-end"><div className="d-flex gap-1"><button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faDownload} /></button><button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted small">{t('no_payslips')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('payroll_management')}</h4>
          <p className="text-muted small mb-0">{t('manage_payroll_processing')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-3" onClick={() => setShowComponentModal(true)}>
            <FontAwesomeIcon icon={faCalculator} className="me-1" /> {t('salary_components')}
          </button>
          {currentUser?.role === 'Admin' && (
            <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowBatchModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_batch')}
            </button>
          )}
        </div>
      </div>

      <div className="row g-4 mb-4">
        {batches.map(batch => (
          <div key={batch.id} className="col-md-6 col-xl-4">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedBatch(batch)}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">{getMonthName(batch.month)} {batch.year}</h5>
                    <span className={`badge rounded-pill x-small ${getStatusBadge(batch.status)}`}>{batch.status?.toUpperCase()}</span>
                  </div>
                  <div className={`p-2 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-primary" />
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6"><div className="x-small text-muted">{t('net_payable')}</div><div className="small fw-bold text-success">${batch.total_net?.toLocaleString() || 0}</div></div>
                  <div className="col-6 text-end"><div className="x-small text-muted">{t('employees')}</div><div className="small fw-bold">{batch.employee_count || 0}</div></div>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div className="x-small text-muted"><FontAwesomeIcon icon={faUsers} className="me-1" />{batch.processed_by?.name || 'Admin'}</div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-muted x-small" />
                </div>
              </div>
            </div>
          </div>
        ))}
        {batches.length === 0 && (
          <div className="col-12 text-center py-5">
            <div className="d-inline-block p-4 rounded-circle mb-3" style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="fs-1 text-muted opacity-50" />
            </div>
            <p className="text-muted">{t('no_batches_found')}</p>
          </div>
        )}
      </div>

      {showBatchModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('new_batch')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowBatchModal(false)}></button>
              </div>
              <form onSubmit={handleCreateBatch}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('month')}</label>
                      <select className="form-select rounded-3" value={batchData.month} onChange={e => setBatchData({ ...batchData, month: parseInt(e.target.value) })}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>{getMonthName(m)}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('year')}</label>
                      <input type="number" className="form-control rounded-3" value={batchData.year} onChange={e => setBatchData({ ...batchData, year: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowBatchModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('create')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showComponentModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('salary_components')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowComponentModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-success mb-3">{t('earnings')}</h6>
                    {components.filter(c => c.type === 'earning').map((c, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
                        <div><div className="small fw-bold">{c.name}</div><div className="x-small text-muted">{c.calculation_type === 'percentage' ? `${c.value}%` : `$${c.value}`}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-danger mb-3">{t('deductions')}</h6>
                    {components.filter(c => c.type === 'deduction').map((c, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
                        <div><div className="small fw-bold">{c.name}</div><div className="x-small text-muted">{c.calculation_type === 'percentage' ? `${c.value}%` : `-$${c.value}`}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
                <h6 className="fw-bold mb-3">{t('add_component')}</h6>
                <form onSubmit={handleCreateComponent}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('name')}</label>
                      <input type="text" className="form-control rounded-3" value={componentForm.name} onChange={e => setComponentForm({ ...componentForm, name: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">{t('type')}</label>
                      <select className="form-select rounded-3" value={componentForm.type} onChange={e => setComponentForm({ ...componentForm, type: e.target.value })}>
                        <option value="earning">{t('earning')}</option>
                        <option value="deduction">{t('deduction')}</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">{t('calculation')}</label>
                      <select className="form-select rounded-3" value={componentForm.calculation_type} onChange={e => setComponentForm({ ...componentForm, calculation_type: e.target.value })}>
                        <option value="percentage">%</option>
                        <option value="fixed">$</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('value')}</label>
                      <input type="number" className="form-control rounded-3" value={componentForm.value} onChange={e => setComponentForm({ ...componentForm, value: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faPlus} className="me-1" />{t('add')}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
      `}} />
    </div>
  );
};

export default PayrollManagementPortal;
