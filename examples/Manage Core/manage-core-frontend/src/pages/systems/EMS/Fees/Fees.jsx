import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faFileInvoice, faGraduationCap, faChartBar,
  faCheckCircle, faTimes, faCalendarAlt, faUsers, faSchool,
  faDollarSign, faHandHoldingUsd, faPercent
} from '@fortawesome/free-solid-svg-icons';

const FEE_TYPES = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Hostel Fee', 'Transport Fee', 'Examination Fee'];
const CLASSES = ['CS-1A', 'CS-2A', 'CS-3A', 'BBA-1A', 'BBA-2A', 'ENG-1A'];
const COLLECTION_STATUSES = ['Paid', 'Pending', 'Overdue', 'Partially Paid'];
const SCHOLARSHIP_STATUSES = ['Active', 'Suspended', 'Completed'];

const initialStructureForm = { class: '', feeType: '', amount: '', dueDate: '', semester: '' };
const initialCollectionForm = { student: '', class: '', feeType: '', amount: '', date: '', status: 'Paid' };
const initialScholarshipForm = { name: '', student: '', amount: '', status: 'Active', startDate: '', endDate: '' };

const Fees = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ structure: [], collections: [], scholarships: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('structure');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialStructureForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        structure: [
          { id: 1, class: 'CS-3A', feeType: 'Tuition Fee', amount: 45000, dueDate: '2026-08-15', semester: 'Fall 2026' },
          { id: 2, class: 'CS-3A', feeType: 'Lab Fee', amount: 12000, dueDate: '2026-08-15', semester: 'Fall 2026' },
          { id: 3, class: 'BBA-2A', feeType: 'Tuition Fee', amount: 40000, dueDate: '2026-08-15', semester: 'Fall 2026' },
          { id: 4, class: 'ENG-1A', feeType: 'Tuition Fee', amount: 35000, dueDate: '2026-08-15', semester: 'Fall 2026' },
        ],
        collections: [
          { id: 1, student: 'Ali Ahmed', class: 'CS-3A', feeType: 'Tuition Fee', amount: 45000, date: '2026-07-27', status: 'Paid' },
          { id: 2, student: 'Sara Khan', class: 'CS-3A', feeType: 'Tuition Fee', amount: 45000, date: '2026-07-26', status: 'Paid' },
          { id: 3, student: 'Usman Ali', class: 'BBA-2A', feeType: 'Lab Fee', amount: 12000, date: '2026-07-25', status: 'Pending' },
          { id: 4, student: 'Fatima Noor', class: 'ENG-1A', feeType: 'Tuition Fee', amount: 35000, date: '', status: 'Overdue' },
        ],
        scholarships: [
          { id: 1, name: 'Merit Scholarship', student: 'Ali Ahmed', amount: 25000, status: 'Active', startDate: '2026-01', endDate: '2026-12' },
          { id: 2, name: 'Need Based Aid', student: 'Sara Khan', amount: 15000, status: 'Active', startDate: '2026-01', endDate: '2026-12' },
          { id: 3, name: 'Sports Scholarship', student: 'Usman Ali', amount: 10000, status: 'Completed', startDate: '2025-01', endDate: '2025-12' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'structure') return initialStructureForm;
    if (activeTab === 'collections') return initialCollectionForm;
    return initialScholarshipForm;
  };

  const openAddForm = () => { setEditItem(null); setFormData(getInitialForm()); setShowModal(true); };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'structure') setFormData({ class: item.class || '', feeType: item.feeType || '', amount: item.amount || '', dueDate: item.dueDate || '', semester: item.semester || '' });
    else if (activeTab === 'collections') setFormData({ student: item.student || '', class: item.class || '', feeType: item.feeType || '', amount: item.amount || '', date: item.date || '', status: item.status || 'Paid' });
    else setFormData({ name: item.name || '', student: item.student || '', amount: item.amount || '', status: item.status || 'Active', startDate: item.startDate || '', endDate: item.endDate || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'structure' ? 'feeType' : activeTab === 'collections' ? 'student' : 'name';
    if (!formData[reqField]) { addNotification?.('Please fill required fields', 'warning'); return; }
    try { await new Promise(r => setTimeout(r, 300)); addNotification?.(editItem ? 'Updated' : 'Added', 'success'); setShowModal(false); setEditItem(null); fetchData(); }
    catch (err) { addNotification?.(err.message || 'Error', 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try { await new Promise(r => setTimeout(r, 200)); addNotification?.('Deleted', 'success'); fetchData(); }
    catch (err) { addNotification?.(err.message || 'Delete failed', 'danger'); }
  };

  const getStatusBadge = (status) => {
    const map = { Paid: 'bg-success-subtle text-success', Pending: 'bg-warning-subtle text-warning', Overdue: 'bg-danger-subtle text-danger', Partially_Paid: 'bg-info-subtle text-info', Active: 'bg-success-subtle text-success', Suspended: 'bg-warning-subtle text-warning', Completed: 'bg-secondary-subtle text-secondary' };
    return <span className={`badge rounded-pill ${map[status] || map[status.replace(/ /g, '_')] || 'bg-secondary-subtle text-secondary'}`}>{status}</span>;
  };

  const getModalForm = () => {
    if (activeTab === 'structure') return (
      <div className="row g-3">
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Class</label>
          <select className="form-select rounded-3" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}><option value="">Select</option>{CLASSES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Fee Type <span className="text-danger">*</span></label>
          <select className="form-select rounded-3" value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}><option value="">Select</option>{FEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Amount (Rs.)</label>
          <input type="number" className="form-control rounded-3" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Due Date</label>
          <input type="date" className="form-control rounded-3" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Semester</label>
          <input type="text" className="form-control rounded-3" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'collections') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Student <span className="text-danger">*</span></label>
          <select className="form-select rounded-3" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})}><option value="">Select</option></select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Class</label>
          <select className="form-select rounded-3" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}><option value="">Select</option>{CLASSES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Fee Type</label>
          <select className="form-select rounded-3" value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}><option value="">Select</option>{FEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Amount</label>
          <input type="number" className="form-control rounded-3" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Scholarship Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Student</label>
          <select className="form-select rounded-3" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})}><option value="">Select</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Amount</label>
          <input type="number" className="form-control rounded-3" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Start Date</label>
          <input type="text" className="form-control rounded-3" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">End Date</label>
          <input type="text" className="form-control rounded-3" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
      </div>
    );
  };

  const totalCollected = data.collections.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0);
  const totalPending = data.collections.filter(c => c.status === 'Pending' || c.status === 'Overdue').reduce((s, c) => s + c.amount, 0);

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1">Fee Management</h4><p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage fee structure, collections, scholarships, and reports</p></div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}><FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'structure' ? 'Fee' : activeTab === 'collections' ? 'Collection' : 'Scholarship'}</button>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[{ key: 'structure', label: 'Fee Structure', icon: faFileInvoice }, { key: 'collections', label: 'Collections', icon: faMoneyBillWave }, { key: 'scholarships', label: 'Scholarships', icon: faGraduationCap }, { key: 'reports', label: 'Reports', icon: faChartBar }].map(tab => (
          <li className="nav-item" key={tab.key}><button className={`nav-link rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? 'active' : ''}`} onClick={() => { setActiveTab(tab.key); setSearch(''); }}><FontAwesomeIcon icon={tab.icon} /> {tab.label}</button></li>
        ))}
      </ul>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative"><span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}><FontAwesomeIcon icon={faSearch} /></span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>
      </div>

      {error && (<div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4"><FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span><button className="btn-close ms-auto" onClick={() => setError(null)} /></div>)}

      {activeTab === 'reports' ? (
        <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <h5 className="fw-bold mb-3" style={{ color: textColor }}>Fee Summary</h5>
          <div className="row g-4 mb-4">
            <div className="col-md-3"><div className="p-4 rounded-4 text-center" style={{ background: `${colors.success}08`, border: `1px solid ${colors.success}20` }}><div className="h3 fw-bold mb-0" style={{ color: colors.success }}>Rs.{totalCollected.toLocaleString()}</div><div className="small fw-semibold text-muted">Total Collected</div></div></div>
            <div className="col-md-3"><div className="p-4 rounded-4 text-center" style={{ background: `${colors.warning}08`, border: `1px solid ${colors.warning}20` }}><div className="h3 fw-bold mb-0" style={{ color: colors.warning }}>Rs.{totalPending.toLocaleString()}</div><div className="small fw-semibold text-muted">Total Pending</div></div></div>
            <div className="col-md-3"><div className="p-4 rounded-4 text-center" style={{ background: `${colors.info}08`, border: `1px solid ${colors.info}20` }}><div className="h3 fw-bold mb-0" style={{ color: colors.info }}>{data.scholarships.filter(s => s.status === 'Active').length}</div><div className="small fw-semibold text-muted">Active Scholarships</div></div></div>
            <div className="col-md-3"><div className="p-4 rounded-4 text-center" style={{ background: `${colors.danger}08`, border: `1px solid ${colors.danger}20` }}><div className="h3 fw-bold mb-0" style={{ color: colors.danger }}>{data.collections.filter(c => c.status === 'Overdue').length}</div><div className="small fw-semibold text-muted">Overdue Accounts</div></div></div>
          </div>
        </div>
      ) : (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {activeTab === 'structure' && <><th className="ps-4">Class</th><th>Fee Type</th><th>Amount</th><th>Due Date</th><th>Semester</th></>}
                  {activeTab === 'collections' && <><th className="ps-4">Student</th><th>Class</th><th>Fee Type</th><th>Amount</th><th>Date</th><th>Status</th></>}
                  {activeTab === 'scholarships' && <><th className="ps-4">Name</th><th>Student</th><th>Amount</th><th>Status</th><th>Period</th></>}
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="10" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr> : (data[activeTab] || []).length === 0 ? <tr><td colSpan="10" className="text-center py-5"><FontAwesomeIcon icon={faMoneyBillWave} className="fs-1 text-muted opacity-50 mb-3" /><h6 className="fw-bold">No {activeTab} found</h6></td></tr> : (data[activeTab] || []).map(item => (
                  <tr key={item.id}>
                    {activeTab === 'structure' && <><td className="ps-4 fw-semibold small">{item.class}</td><td className="small">{item.feeType}</td><td className="small fw-bold">Rs.{item.amount?.toLocaleString()}</td><td className="small">{item.dueDate}</td><td className="small">{item.semester}</td></>}
                    {activeTab === 'collections' && <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faUsers} className="me-2 text-muted opacity-50" />{item.student}</td><td className="small">{item.class}</td><td className="small">{item.feeType}</td><td className="small fw-bold">Rs.{item.amount?.toLocaleString()}</td><td className="small">{item.date || '-'}</td><td>{getStatusBadge(item.status)}</td></>}
                    {activeTab === 'scholarships' && <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faGraduationCap} className="me-2 text-muted opacity-50" />{item.name}</td><td className="small">{item.student}</td><td className="small fw-bold">Rs.{item.amount?.toLocaleString()}</td><td>{getStatusBadge(item.status)}</td><td className="small">{item.startDate} - {item.endDate}</td></>}
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3"><h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'structure' ? 'Fee Structure' : activeTab === 'collections' ? 'Collection' : 'Scholarship'}</h5><button className="btn-close" onClick={() => setShowModal(false)} /></div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">{getModalForm()}</div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faCheckCircle} className="me-2" />{editItem ? 'Update' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4' };

export default Fees;
