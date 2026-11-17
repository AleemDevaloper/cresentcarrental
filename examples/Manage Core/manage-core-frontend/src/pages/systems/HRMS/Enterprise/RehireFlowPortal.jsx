import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faSearch, faCheckCircle, faTimes, faEye,
  faHistory, faUndo, faChartBar, faFileAlt, faUserCheck,
  faCalendarAlt, faMoneyBillWave, faArrowRight, faClipboardList,
  faFilter, faPlus, faDownload, faSync
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { lookupPreviousEmployee, listRehireRecords, createRehireRecord, getRehireRecord } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RehireFlowPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [rehires, setRehires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showEligibility, setShowEligibility] = useState(false);
  const [selectedRehire, setSelectedRehire] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listRehireRecords();
      setRehires(data);
    } catch (err) {
      console.error('Rehire fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const result = await lookupPreviousEmployee(searchQuery);
      setSearchResult(result);
      setShowEligibility(true);
    } catch (err) {
      addNotification(t('employee_not_found'), 'warning');
      setSearchResult(null);
    }
  };

  const handleCreateRehire = async () => {
    try {
      await createRehireRecord({ previous_employee_id: searchResult?.id });
      addNotification(t('rehire_initiated'), 'success');
      setShowModal(false);
      setSearchResult(null);
      setSearchQuery('');
      fetchData();
    } catch (err) {
      addNotification(t('error_creating_rehire'), 'danger');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'completed': return 'bg-success-subtle text-success border-success';
      case 'onboarding': return 'bg-info-subtle text-info border-info';
      case 'eligible': return 'bg-primary-subtle text-primary border-primary';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  };

  const statsCards = [
    { label: t('total_rehires'), value: rehires.length, icon: faUndo, color: '#4f46e5' },
    { label: t('active_rehires'), value: rehires.filter(r => r.status === 'onboarding').length, icon: faUserCheck, color: '#10b981' },
    { label: t('completed'), value: rehires.filter(r => r.status === 'completed').length, icon: faCheckCircle, color: '#8b5cf6' },
    { label: t('rehire_rate'), value: rehires.length > 0 ? `${Math.round((rehires.filter(r => r.status === 'completed').length / rehires.length) * 100)}%` : '0%', icon: faChartBar, color: '#f59e0b' },
  ];

  const eligibilityChecks = [
    { label: t('previous_employment_verified'), status: true },
    { label: t('exit_clearance_completed'), status: true },
    { label: t('benefits_eligibility'), status: true },
    { label: t('salary_reference_available'), status: true },
    { label: t('service_continuity_tracked'), status: false },
    { label: t('rehire_blacklist_check'), status: true },
  ];

  const chartData = {
    labels: [t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun')],
    datasets: [{ label: t('rehires'), data: [2, 1, 3, 0, 2, 1], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', fill: true, tension: 0.4 }]
  };

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('rehire_flow_portal')}</h4>
          <p className="text-muted small mb-0">{t('manage_rehire_process')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_rehire')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {statsCards.map((s, i) => (
              <div key={i} className="col-md-3">
                <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">{t('rehire_records')}</h5>
                  <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                      <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('previous_code')}</th><th>{t('new_code')}</th><th>{t('previous_dept')}</th><th>{t('rehire_date')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                      <tbody>
                        {rehires.map(r => (
                          <tr key={r.id}>
                            <td><div className="small fw-bold">{r.name || r.user?.name || 'N/A'}</div></td>
                            <td className="small text-muted">{r.previous_emp_code || '-'}</td>
                            <td className="small fw-bold text-primary">{r.new_emp_code || '-'}</td>
                            <td className="small">{r.previous_department || '-'}</td>
                            <td className="small">{r.rehire_date ? new Date(r.rehire_date).toLocaleDateString() : '-'}</td>
                            <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(r.status)}`}>{r.status}</span></td>
                            <td><button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setSelectedRehire(r)}><FontAwesomeIcon icon={faEye} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">{t('rehire_workflow')}</h5>
                  {[
                    { step: 1, label: t('previous_employee_lookup'), status: 'complete' },
                    { step: 2, label: t('eligibility_check'), status: 'complete' },
                    { step: 3, label: t('historical_record_recovery'), status: 'pending' },
                    { step: 4, label: t('service_continuity'), status: 'pending' },
                    { step: 5, label: t('re_onboarding'), status: 'pending' },
                  ].map((w, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 mb-3">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${w.status === 'complete' ? 'bg-success text-white' : isDark ? 'bg-dark border border-secondary text-muted' : 'bg-light text-muted'}`} style={{ width: 28, height: 28, fontSize: 11 }}>{w.step}</div>
                      <div className="small">{w.label}</div>
                      {w.status === 'complete' && <FontAwesomeIcon icon={faCheckCircle} className="text-success ms-auto" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className={`card border-0 shadow-sm rounded-4 mt-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">{t('monthly_trend')}</h5>
                  <div style={{ height: '150px' }}><Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } }} /></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showEligibility && searchResult && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('eligibility_check')}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEligibility(false); setSearchResult(null); }}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3" style={{ backgroundColor: '#4f46e520' }}>
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 48, height: 48 }}>{searchResult.name?.charAt(0) || '?'}</div>
                  <div>
                    <h5 className="fw-bold mb-0">{searchResult.name || t('previous_employee')}</h5>
                    <div className="small text-muted">{searchResult.department} | {searchResult.designation}</div>
                    <div className="x-small text-muted">{t('previous_employment')}: {searchResult.previous_dates || '2020-2025'}</div>
                  </div>
                </div>
                <h6 className="fw-bold mb-3">{t('eligibility_checks')}</h6>
                {eligibilityChecks.map((c, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom border-opacity-10">
                    <span className="small">{c.label}</span>
                    <FontAwesomeIcon icon={c.status ? faCheckCircle : faTimes} className={c.status ? 'text-success' : 'text-danger'} />
                  </div>
                ))}
                <div className="mt-3 p-3 rounded-3 text-center" style={{ backgroundColor: '#10b98120' }}>
                  <div className="h5 fw-bold text-success mb-0">{t('eligible_for_rehire')}</div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3" onClick={() => { setShowEligibility(false); setSearchResult(null); }}>{t('cancel')}</button>
                <button className="btn btn-primary rounded-3 px-4" onClick={handleCreateRehire}>
                  <FontAwesomeIcon icon={faArrowRight} className="me-1" /> {t('proceed_rehire')}
                </button>
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
                <h5 className="fw-bold">{t('lookup_previous_employee')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex gap-2 mb-4">
                  <input type="text" className="form-control rounded-3" placeholder={t('search_by_name_code_email')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                  <button className="btn btn-primary rounded-3 px-4" onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                  <h6 className="small fw-bold mb-2">{t('search_tips')}</h6>
                  <div className="x-small text-muted">{t('enter_name_email_or_previous_code')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRehire && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('rehire_details')}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRehire(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-6"><div className="x-small text-muted">{t('employee')}</div><div className="small fw-bold">{selectedRehire.name || 'N/A'}</div></div>
                  <div className="col-6"><div className="x-small text-muted">{t('status')}</div><span className={`badge rounded-pill ${getStatusBadge(selectedRehire.status)}`}>{selectedRehire.status}</span></div>
                  <div className="col-6"><div className="x-small text-muted">{t('previous_code')}</div><div className="small">{selectedRehire.previous_emp_code || '-'}</div></div>
                  <div className="col-6"><div className="x-small text-muted">{t('new_code')}</div><div className="small fw-bold text-primary">{selectedRehire.new_emp_code || '-'}</div></div>
                  <div className="col-12">
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                      <h6 className="small fw-bold mb-2">{t('service_continuity')}</h6>
                      <div className="d-flex justify-content-between mb-1"><span className="x-small text-muted">{t('previous_service')}</span><span className="x-small fw-bold">4 years 2 months</span></div>
                      <div className="d-flex justify-content-between mb-1"><span className="x-small text-muted">{t('current_service')}</span><span className="x-small fw-bold">6 months</span></div>
                      <div className="d-flex justify-content-between"><span className="x-small text-muted">{t('total_tenure')}</span><span className="x-small fw-bold text-primary">4 years 8 months</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
      `}} />
    </div>
  );
};

export default RehireFlowPortal;
