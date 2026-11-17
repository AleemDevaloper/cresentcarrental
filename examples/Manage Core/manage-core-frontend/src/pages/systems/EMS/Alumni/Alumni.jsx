import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faBriefcase, faCalendarAlt, faDonate,
  faBuilding, faMapMarkerAlt, faGraduationCap, faDollarSign,
  faCheckCircle, faTimes, faGlobe, faUsers, faStar,
  faPhone, faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const DEPARTMENTS = ['Computer Science', 'Business Administration', 'Engineering', 'Medicine', 'Arts', 'Law'];

const initialAlumniForm = { name: '', graduationYear: '', department: '', company: '', location: '', email: '', phone: '', linkedin: '' };
const initialJobForm = { title: '', company: '', location: '', type: '', salary: '', deadline: '', description: '' };
const initialEventForm = { name: '', date: '', location: '', type: '', description: '' };
const initialDonationForm = { alumni: '', amount: '', date: '', purpose: '', paymentMethod: '' };

const Alumni = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ directory: [], jobs: [], events: [], donations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('directory');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialAlumniForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        directory: [
          { id: 1, name: 'Ali Ahmed', graduationYear: 2019, department: 'Computer Science', company: 'Google', location: 'Silicon Valley, USA' },
          { id: 2, name: 'Sara Khan', graduationYear: 2020, department: 'Business Administration', company: 'Microsoft', location: 'Redmond, USA' },
          { id: 3, name: 'Usman Ali', graduationYear: 2018, department: 'Engineering', company: 'Tesla', location: 'Austin, USA' },
          { id: 4, name: 'Fatima Noor', graduationYear: 2021, department: 'Medicine', company: 'Mayo Hospital', location: 'Lahore, Pakistan' },
          { id: 5, name: 'Hassan Raza', graduationYear: 2022, department: 'Computer Science', company: 'Amazon', location: 'Seattle, USA' },
        ],
        jobs: [
          { id: 1, title: 'Software Engineer', company: 'Google', location: 'Lahore', type: 'Full-Time', salary: 'Rs. 200K', deadline: '2026-08-30' },
          { id: 2, title: 'Data Analyst', company: 'Systems Ltd', location: 'Karachi', type: 'Full-Time', salary: 'Rs. 150K', deadline: '2026-09-15' },
          { id: 3, title: 'Intern - AI', company: 'TechHub', location: 'Islamabad', type: 'Internship', salary: 'Rs. 40K', deadline: '2026-08-20' },
        ],
        events: [
          { id: 1, name: 'Annual Alumni Meetup', date: '2026-12-15', location: 'Main Campus', type: 'Social', description: 'Yearly gathering' },
          { id: 2, name: 'Career Fair 2026', date: '2026-09-20', location: 'Convention Center', type: 'Career', description: 'Job fair for alumni' },
        ],
        donations: [
          { id: 1, alumni: 'Ali Ahmed', amount: 50000, date: '2026-07-01', purpose: 'Scholarship Fund', paymentMethod: 'Bank Transfer' },
          { id: 2, alumni: 'Sara Khan', amount: 25000, date: '2026-06-15', purpose: 'Library Fund', paymentMethod: 'Credit Card' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'directory') return initialAlumniForm;
    if (activeTab === 'jobs') return initialJobForm;
    if (activeTab === 'events') return initialEventForm;
    return initialDonationForm;
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(getInitialForm());
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'directory') setFormData({ name: item.name || '', graduationYear: item.graduationYear || '', department: item.department || '', company: item.company || '', location: item.location || '', email: item.email || '', phone: item.phone || '', linkedin: item.linkedin || '' });
    else if (activeTab === 'jobs') setFormData({ title: item.title || '', company: item.company || '', location: item.location || '', type: item.type || '', salary: item.salary || '', deadline: item.deadline || '', description: item.description || '' });
    else if (activeTab === 'events') setFormData({ name: item.name || '', date: item.date || '', location: item.location || '', type: item.type || '', description: item.description || '' });
    else setFormData({ alumni: item.alumni || '', amount: item.amount || '', date: item.date || '', purpose: item.purpose || '', paymentMethod: item.paymentMethod || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'directory' ? 'name' : activeTab === 'jobs' ? 'title' : activeTab === 'events' ? 'name' : 'alumni';
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

  const getModalForm = () => {
    if (activeTab === 'directory') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Graduation Year</label>
          <input type="number" className="form-control rounded-3" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Department</label>
          <select className="form-select rounded-3" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
            <option value="">Select</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Company</label>
          <input type="text" className="form-control rounded-3" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Location</label>
          <input type="text" className="form-control rounded-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Email</label>
          <input type="email" className="form-control rounded-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Phone</label>
          <input type="text" className="form-control rounded-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'jobs') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Job Title <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Company</label>
          <input type="text" className="form-control rounded-3" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Location</label>
          <input type="text" className="form-control rounded-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Full-Time</option><option>Part-Time</option><option>Internship</option><option>Contract</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Salary</label>
          <input type="text" className="form-control rounded-3" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Deadline</label>
          <input type="date" className="form-control rounded-3" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} /></div>
        <div className="col-md-12"><label className="small fw-bold text-muted mb-2">Description</label>
          <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'events') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Event Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Social</option><option>Career</option><option>Workshop</option><option>Fundraiser</option></select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Location</label>
          <input type="text" className="form-control rounded-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
        <div className="col-md-12"><label className="small fw-bold text-muted mb-2">Description</label>
          <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Alumni <span className="text-danger">*</span></label>
          <select className="form-select rounded-3" value={formData.alumni} onChange={e => setFormData({...formData, alumni: e.target.value})}>
            <option value="">Select</option>{data.directory.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}</select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Amount (Rs.)</label>
          <input type="number" className="form-control rounded-3" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Purpose</label>
          <input type="text" className="form-control rounded-3" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Payment Method</label>
          <select className="form-select rounded-3" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
            <option value="">Select</option><option>Bank Transfer</option><option>Credit Card</option><option>Cash</option><option>Cheque</option></select></div>
      </div>
    );
  };

  const renderDirectory = () => {
    const list = data.directory;
    if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>;
    return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Name</th><th>Grad Year</th><th>Department</th><th>Company</th><th>Location</th><th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  <td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faUserGraduate} className="me-2 text-muted opacity-50" />{item.name}</td>
                  <td className="small">{item.graduationYear}</td>
                  <td className="small">{item.department}</td>
                  <td className="small">{item.company}</td>
                  <td className="small"><FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 text-muted" />{item.location}</td>
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
    );
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Alumni Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage alumni directory, jobs, events, and donations</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary rounded-3" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'directory' ? 'Alumni' : activeTab === 'jobs' ? 'Job' : activeTab === 'events' ? 'Event' : 'Donation'}
          </button>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[
          { key: 'directory', label: 'Directory', icon: faUserGraduate },
          { key: 'jobs', label: 'Jobs', icon: faBriefcase },
          { key: 'events', label: 'Events', icon: faCalendarAlt },
          { key: 'donations', label: 'Donations', icon: faDonate },
        ].map(tab => (
          <li className="nav-item" key={tab.key}>
            <button className={`nav-link rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setSearch(''); }}>
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

      {activeTab === 'directory' ? renderDirectory() : (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {activeTab === 'jobs' && <><th className="ps-4">Title</th><th>Company</th><th>Location</th><th>Type</th><th>Salary</th><th>Deadline</th></>}
                  {activeTab === 'events' && <><th className="ps-4">Name</th><th>Date</th><th>Location</th><th>Type</th><th>Description</th></>}
                  {activeTab === 'donations' && <><th className="ps-4">Alumni</th><th>Amount</th><th>Date</th><th>Purpose</th><th>Method</th></>}
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data[activeTab] || []).map(item => (
                  <tr key={item.id}>
                    {activeTab === 'jobs' && (
                      <><td className="ps-4 fw-semibold small">{item.title}</td>
                        <td className="small">{item.company}</td><td className="small">{item.location}</td>
                        <td><span className="badge rounded-pill bg-info-subtle text-info">{item.type}</span></td>
                        <td className="small fw-bold">{item.salary}</td><td className="small">{item.deadline}</td></>
                    )}
                    {activeTab === 'events' && (
                      <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />{item.name}</td>
                        <td className="small">{item.date}</td><td className="small">{item.location}</td>
                        <td><span className="badge rounded-pill bg-primary-subtle text-primary">{item.type}</span></td>
                        <td className="small text-muted">{item.description}</td></>
                    )}
                    {activeTab === 'donations' && (
                      <><td className="ps-4 fw-semibold small">{item.alumni}</td>
                        <td className="small fw-bold text-success">Rs.{item.amount?.toLocaleString()}</td>
                        <td className="small">{item.date}</td><td className="small">{item.purpose}</td>
                        <td className="small">{item.paymentMethod}</td></>
                    )}
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
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'directory' ? 'Alumni' : activeTab === 'jobs' ? 'Job' : activeTab === 'events' ? 'Event' : 'Donation'}</h5>
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

export default Alumni;
