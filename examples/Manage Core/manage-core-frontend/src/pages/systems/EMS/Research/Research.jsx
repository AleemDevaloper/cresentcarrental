import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlask, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faBookOpen, faLightbulb, faDollarSign,
  faUsers, faCheckCircle, faTimes, faUserTie, faBuilding,
  faCalendarAlt, faGlobe, faFileAlt, faClipboardList
} from '@fortawesome/free-solid-svg-icons';

const FUNDING_SOURCES = ['Government', 'Private', 'International', 'Internal'];
const PROJECT_STATUSES = ['Active', 'Completed', 'On Hold', 'Cancelled'];
const PATENT_STATUSES = ['Filed', 'Published', 'Granted', 'Expired'];
const GRANT_STATUSES = ['Applied', 'Approved', 'Rejected', 'Completed'];

const initialProjectForm = { name: '', pi: '', department: '', funding: '', amount: '', startDate: '', endDate: '', status: 'Active' };
const initialPublicationForm = { title: '', authors: '', journal: '', year: '', doi: '', type: '' };
const initialPatentForm = { title: '', inventors: '', status: 'Filed', date: '', description: '' };
const initialGrantForm = { name: '', agency: '', amount: '', status: 'Applied', deadline: '' };

const Research = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ projects: [], publications: [], patents: [], grants: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialProjectForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        projects: [
          { id: 1, name: 'AI in Education', pi: 'Dr. Ali Khan', department: 'CS', funding: 'Government', amount: '5M', startDate: '2025-01', endDate: '2027-12', status: 'Active' },
          { id: 2, name: 'Quantum Computing', pi: 'Dr. Sara Ali', department: 'Engineering', funding: 'International', amount: '10M', startDate: '2024-06', endDate: '2028-06', status: 'Active' },
          { id: 3, name: 'Climate Modeling', pi: 'Dr. Usman Raza', department: 'Sciences', funding: 'Government', amount: '3M', startDate: '2025-03', endDate: '2027-03', status: 'Active' },
          { id: 4, name: 'Blockchain Security', pi: 'Dr. Fatima Noor', department: 'CS', funding: 'Private', amount: '2M', startDate: '2024-01', endDate: '2026-01', status: 'Completed' },
        ],
        publications: [
          { id: 1, title: 'AI in Education: A Comprehensive Review', authors: 'Ali Khan, Sara Ali', journal: 'Nature Education', year: 2026, doi: '10.1234/edu.2026', type: 'Journal' },
          { id: 2, title: 'Quantum Computing Advances', authors: 'Sara Ali, Usman Raza', journal: 'Science', year: 2026, doi: '10.1234/sci.2026', type: 'Journal' },
          { id: 3, title: 'Blockchain for Secure Transactions', authors: 'Fatima Noor', journal: 'IEEE Transactions', year: 2025, doi: '10.1234/ieee.2025', type: 'Conference' },
        ],
        patents: [
          { id: 1, title: 'AI-based Grading System', inventors: 'Ali Khan, Sara Ali', status: 'Granted', date: '2026-03-15', description: 'Automated grading using ML' },
          { id: 2, title: 'Blockchain Voting Protocol', inventors: 'Fatima Noor', status: 'Filed', date: '2026-06-20', description: 'Secure voting system' },
        ],
        grants: [
          { id: 1, name: 'National AI Research Grant', agency: 'HEC', amount: '15M', status: 'Approved', deadline: '2026-12-31' },
          { id: 2, name: 'Climate Research Fund', agency: 'UNDP', amount: '8M', status: 'Applied', deadline: '2026-09-30' },
          { id: 3, name: 'Tech Innovation Grant', agency: 'PSF', amount: '5M', status: 'Completed', deadline: '2026-06-30' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'projects') return initialProjectForm;
    if (activeTab === 'publications') return initialPublicationForm;
    if (activeTab === 'patents') return initialPatentForm;
    return initialGrantForm;
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(getInitialForm());
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'projects') setFormData({ name: item.name || '', pi: item.pi || '', department: item.department || '', funding: item.funding || '', amount: item.amount || '', startDate: item.startDate || '', endDate: item.endDate || '', status: item.status || 'Active' });
    else if (activeTab === 'publications') setFormData({ title: item.title || '', authors: item.authors || '', journal: item.journal || '', year: item.year || '', doi: item.doi || '', type: item.type || '' });
    else if (activeTab === 'patents') setFormData({ title: item.title || '', inventors: item.inventors || '', status: item.status || 'Filed', date: item.date || '', description: item.description || '' });
    else setFormData({ name: item.name || '', agency: item.agency || '', amount: item.amount || '', status: item.status || 'Applied', deadline: item.deadline || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'projects' ? 'name' : activeTab === 'publications' ? 'title' : activeTab === 'patents' ? 'title' : 'name';
    if (!formData[reqField]) { addNotification?.('Please fill required fields', 'warning'); return; }
    try {
      await new Promise(r => setTimeout(r, 300));
      addNotification?.(editItem ? 'Updated successfully' : 'Added successfully', 'success');
      setShowModal(false); setEditItem(null); fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try { await new Promise(r => setTimeout(r, 200)); addNotification?.('Deleted', 'success'); fetchData(); }
    catch (err) { addNotification?.(err.message || 'Delete failed', 'danger'); }
  };

  const getStatusBadge = (status, map) => {
    const m = map || { Active: 'bg-success-subtle text-success', Completed: 'bg-secondary-subtle text-secondary', On_Hold: 'bg-warning-subtle text-warning', Cancelled: 'bg-danger-subtle text-danger', Applied: 'bg-primary-subtle text-primary', Approved: 'bg-success-subtle text-success', Rejected: 'bg-danger-subtle text-danger', Filed: 'bg-info-subtle text-info', Granted: 'bg-success-subtle text-success', Published: 'bg-primary-subtle text-primary', Expired: 'bg-secondary-subtle text-secondary' };
    return <span className={`badge rounded-pill ${m[status] || 'bg-secondary-subtle text-secondary'}`}>{status}</span>;
  };

  const getModalForm = () => {
    if (activeTab === 'projects') return (
      <div className="row g-3">
        <div className="col-md-8"><label className="small fw-bold text-muted mb-2">Project Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">PI</label>
          <input type="text" className="form-control rounded-3" value={formData.pi} onChange={e => setFormData({...formData, pi: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Department</label>
          <input type="text" className="form-control rounded-3" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Funding Source</label>
          <select className="form-select rounded-3" value={formData.funding} onChange={e => setFormData({...formData, funding: e.target.value})}>
            <option value="">Select</option>{FUNDING_SOURCES.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Amount</label>
          <input type="text" className="form-control rounded-3" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="5M" /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Start Date</label>
          <input type="text" className="form-control rounded-3" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">End Date</label>
          <input type="text" className="form-control rounded-3" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'publications') return (
      <div className="row g-3">
        <div className="col-md-8"><label className="small fw-bold text-muted mb-2">Title <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Year</label>
          <input type="number" className="form-control rounded-3" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Authors</label>
          <input type="text" className="form-control rounded-3" value={formData.authors} onChange={e => setFormData({...formData, authors: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Journal / Conference</label>
          <input type="text" className="form-control rounded-3" value={formData.journal} onChange={e => setFormData({...formData, journal: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">DOI</label>
          <input type="text" className="form-control rounded-3" value={formData.doi} onChange={e => setFormData({...formData, doi: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Journal</option><option>Conference</option><option>Book Chapter</option></select></div>
      </div>
    );
    if (activeTab === 'patents') return (
      <div className="row g-3">
        <div className="col-md-8"><label className="small fw-bold text-muted mb-2">Patent Title <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            {PATENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Inventors</label>
          <input type="text" className="form-control rounded-3" value={formData.inventors} onChange={e => setFormData({...formData, inventors: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
        <div className="col-md-12"><label className="small fw-bold text-muted mb-2">Description</label>
          <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Grant Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Agency</label>
          <input type="text" className="form-control rounded-3" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Amount</label>
          <input type="text" className="form-control rounded-3" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            {GRANT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Deadline</label>
          <input type="date" className="form-control rounded-3" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} /></div>
      </div>
    );
  };

  const columns = {
    projects: [
      { key: 'name', label: 'Name', icon: faFlask }, { key: 'pi', label: 'PI' }, { key: 'department', label: 'Dept' },
      { key: 'funding', label: 'Funding' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status', badge: true },
    ],
    publications: [
      { key: 'title', label: 'Title', icon: faBookOpen }, { key: 'authors', label: 'Authors' },
      { key: 'journal', label: 'Journal' }, { key: 'year', label: 'Year' },
    ],
    patents: [
      { key: 'title', label: 'Title', icon: faLightbulb }, { key: 'inventors', label: 'Inventors' },
      { key: 'status', label: 'Status', badge: true }, { key: 'date', label: 'Date' },
    ],
    grants: [
      { key: 'name', label: 'Name', icon: faDollarSign }, { key: 'agency', label: 'Agency' },
      { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status', badge: true }, { key: 'deadline', label: 'Deadline' },
    ],
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Research Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage projects, publications, patents, and grants</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'projects' ? 'Project' : activeTab === 'publications' ? 'Publication' : activeTab === 'patents' ? 'Patent' : 'Grant'}
        </button>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[{ key: 'projects', label: 'Projects', icon: faFlask }, { key: 'publications', label: 'Publications', icon: faBookOpen }, { key: 'patents', label: 'Patents', icon: faLightbulb }, { key: 'grants', label: 'Grants', icon: faDollarSign }].map(tab => (
          <li className="nav-item" key={tab.key}>
            <button className={`nav-link rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? 'active' : ''}`} onClick={() => { setActiveTab(tab.key); setSearch(''); }}>
              <FontAwesomeIcon icon={tab.icon} /> {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}><FontAwesomeIcon icon={faSearch} /></span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                {(columns[activeTab] || []).map(c => <th key={c.key} className="ps-4">{c.label}</th>)}
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : (data[activeTab] || []).length === 0 ? (
                <tr><td colSpan="10" className="text-center py-5">
                  <FontAwesomeIcon icon={faFlask} className="fs-1 text-muted opacity-50 mb-3" />
                  <h6 className="fw-bold">No {activeTab} found</h6>
                </td></tr>
              ) : (data[activeTab] || []).map(item => (
                <tr key={item.id}>
                  {(columns[activeTab] || []).map(c => (
                    <td key={c.key} className="ps-4 small fw-semibold">
                      {c.icon && <FontAwesomeIcon icon={c.icon} className="me-2 text-muted opacity-50" />}
                      {c.badge ? getStatusBadge(item[c.key]) : item[c.key]}
                    </td>
                  ))}
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

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'projects' ? 'Project' : activeTab === 'publications' ? 'Publication' : activeTab === 'patents' ? 'Patent' : 'Grant'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">{getModalForm()}</div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />{editItem ? 'Update' : 'Save'}
                  </button>
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

export default Research;
