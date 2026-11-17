import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faUserShield, faClipboardList, faFileAlt,
  faCheckCircle, faTimes, faBell, faFire, faUsers,
  faIdCard, faClock, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

const INCIDENT_TYPES = ['Theft', 'Trespassing', 'Fight', 'Fire', 'Medical', 'Vandalism', 'Other'];
const INCIDENT_STATUSES = ['Reported', 'Under Investigation', 'Resolved', 'False Alarm'];
const DUTY_SHIFTS = ['Morning (6AM-2PM)', 'Evening (2PM-10PM)', 'Night (10PM-6AM)'];

const initialIncidentForm = { type: '', location: '', date: '', description: '', reportedBy: '', status: 'Reported' };
const initialGuardForm = { name: '', badge: '', shift: '', location: '', phone: '', status: 'On Duty' };
const initialVisitorForm = { name: '', idNumber: '', purpose: '', host: '', inTime: '', outTime: '', vehicle: '' };

const Security = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ incidents: [], personnel: [], visitors: [], compliance: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('incidents');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialIncidentForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        incidents: [
          { id: 1, type: 'Theft', location: 'Library Block', date: '2026-07-27', description: 'Laptop stolen from reading area', reportedBy: 'Librarian', status: 'Under Investigation' },
          { id: 2, type: 'Trespassing', location: 'Main Gate', date: '2026-07-26', description: 'Unauthorized entry attempt', reportedBy: 'Guard', status: 'Resolved' },
          { id: 3, type: 'Medical', location: 'Hostel A', date: '2026-07-26', description: 'Student fell unconscious', reportedBy: 'Warden', status: 'Resolved' },
          { id: 4, type: 'Fire Alarm', location: 'Science Building', date: '2026-07-25', description: 'Fire alarm triggered', reportedBy: 'System', status: 'False Alarm' },
        ],
        personnel: [
          { id: 1, name: 'Ali Khan', badge: 'SEC-001', shift: 'Morning (6AM-2PM)', location: 'Main Gate', phone: '+92 300 1112233', status: 'On Duty' },
          { id: 2, name: 'Usman Ali', badge: 'SEC-002', shift: 'Evening (2PM-10PM)', location: 'Library', phone: '+92 300 4455667', status: 'On Duty' },
          { id: 3, name: 'Sara Khan', badge: 'SEC-003', shift: 'Night (10PM-6AM)', location: 'Hostel A', phone: '+92 300 7788990', status: 'Off Duty' },
          { id: 4, name: 'Hassan Raza', badge: 'SEC-004', shift: 'Morning (6AM-2PM)', location: 'Science Building', phone: '+92 300 9988776', status: 'On Duty' },
        ],
        visitors: [
          { id: 1, name: 'Ahmed Raza', idNumber: 'CNIC-12345', purpose: 'Meet Student', host: 'Ali Ahmed', inTime: '10:00 AM', outTime: '12:00 PM', vehicle: 'LXR-123' },
          { id: 2, name: 'Fatima Khan', idNumber: 'CNIC-67890', purpose: 'Faculty Meeting', host: 'Dr. Usman', inTime: '2:00 PM', outTime: '4:30 PM', vehicle: 'None' },
        ],
        compliance: [
          { id: 1, item: 'CCTV Cameras Operational', status: 'Compliant', lastCheck: '2026-07-25' },
          { id: 2, item: 'Fire Extinguishers Inspected', status: 'Compliant', lastCheck: '2026-07-20' },
          { id: 3, item: 'Emergency Exits Clear', status: 'Non-Compliant', lastCheck: '2026-07-22', note: 'Blocked in Building B' },
          { id: 4, item: 'Access Control Systems', status: 'Compliant', lastCheck: '2026-07-24' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'incidents') return initialIncidentForm;
    if (activeTab === 'personnel') return initialGuardForm;
    if (activeTab === 'visitors') return initialVisitorForm;
    return {};
  };

  const openAddForm = () => { setEditItem(null); setFormData(getInitialForm()); setShowModal(true); };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'incidents') setFormData({ type: item.type || '', location: item.location || '', date: item.date || '', description: item.description || '', reportedBy: item.reportedBy || '', status: item.status || 'Reported' });
    else if (activeTab === 'personnel') setFormData({ name: item.name || '', badge: item.badge || '', shift: item.shift || '', location: item.location || '', phone: item.phone || '', status: item.status || 'On Duty' });
    else setFormData({ name: item.name || '', idNumber: item.idNumber || '', purpose: item.purpose || '', host: item.host || '', inTime: item.inTime || '', outTime: item.outTime || '', vehicle: item.vehicle || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'incidents' ? 'type' : activeTab === 'personnel' ? 'name' : 'name';
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
    const map = { On_Duty: 'bg-success-subtle text-success', Off_Duty: 'bg-secondary-subtle text-secondary', Reported: 'bg-warning-subtle text-warning', Under_Investigation: 'bg-primary-subtle text-primary', Resolved: 'bg-success-subtle text-success', False_Alarm: 'bg-info-subtle text-info', Compliant: 'bg-success-subtle text-success', Non_Compliant: 'bg-danger-subtle text-danger', Pending: 'bg-warning-subtle text-warning' };
    return <span className={`badge rounded-pill ${map[status.replace(/ /g, '_')] || map[status] || 'bg-secondary-subtle text-secondary'}`}>{status}</span>;
  };

  const getModalForm = () => {
    if (activeTab === 'incidents') return (
      <div className="row g-3">
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Type <span className="text-danger">*</span></label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="">Select</option>{INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Location</label>
          <input type="text" className="form-control rounded-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Reported By</label>
          <input type="text" className="form-control rounded-3" value={formData.reportedBy} onChange={e => setFormData({...formData, reportedBy: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>{INCIDENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div className="col-md-12"><label className="small fw-bold text-muted mb-2">Description</label>
          <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'personnel') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Badge No</label>
          <input type="text" className="form-control rounded-3" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Shift</label>
          <select className="form-select rounded-3" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}><option value="">Select</option>{DUTY_SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Location</label>
          <input type="text" className="form-control rounded-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Phone</label>
          <input type="text" className="form-control rounded-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Visitor Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">ID Number</label>
          <input type="text" className="form-control rounded-3" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Purpose</label>
          <input type="text" className="form-control rounded-3" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Host</label>
          <input type="text" className="form-control rounded-3" value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Vehicle</label>
          <input type="text" className="form-control rounded-3" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} /></div>
      </div>
    );
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1">Security Management</h4><p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage incidents, personnel, visitors, and compliance</p></div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}><FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'incidents' ? 'Incident' : activeTab === 'personnel' ? 'Guard' : activeTab === 'visitors' ? 'Visitor' : 'Checklist'}</button>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[{ key: 'incidents', label: 'Incidents', icon: faExclamationTriangle }, { key: 'personnel', label: 'Personnel', icon: faUserShield }, { key: 'visitors', label: 'Visitors', icon: faIdCard }, { key: 'compliance', label: 'Compliance', icon: faClipboardList }].map(tab => (
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
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {error && (<div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4"><FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span><button className="btn-close ms-auto" onClick={() => setError(null)} /></div>)}

      {loading ? <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div> : (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {activeTab === 'incidents' && <><th className="ps-4">Type</th><th>Location</th><th>Date</th><th>Reported By</th><th>Status</th></>}
                  {activeTab === 'personnel' && <><th className="ps-4">Name</th><th>Badge</th><th>Shift</th><th>Location</th><th>Status</th></>}
                  {activeTab === 'visitors' && <><th className="ps-4">Name</th><th>ID Number</th><th>Purpose</th><th>Host</th><th>In Time</th><th>Out Time</th></>}
                  {activeTab === 'compliance' && <><th className="ps-4">Item</th><th>Status</th><th>Last Check</th><th>Notes</th></>}
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data[activeTab] || []).map(item => (
                  <tr key={item.id}>
                    {activeTab === 'incidents' && <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-muted opacity-50" />{item.type}</td><td className="small">{item.location}</td><td className="small">{item.date}</td><td className="small">{item.reportedBy}</td><td>{getStatusBadge(item.status)}</td></>}
                    {activeTab === 'personnel' && <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faUserShield} className="me-2 text-muted opacity-50" />{item.name}</td><td className="small"><code>{item.badge}</code></td><td className="small">{item.shift}</td><td className="small">{item.location}</td><td>{getStatusBadge(item.status)}</td></>}
                    {activeTab === 'visitors' && <><td className="ps-4 fw-semibold small">{item.name}</td><td className="small">{item.idNumber}</td><td className="small">{item.purpose}</td><td className="small">{item.host}</td><td className="small">{item.inTime}</td><td className="small">{item.outTime || '-'}</td></>}
                    {activeTab === 'compliance' && <><td className="ps-4 fw-semibold small">{item.item}</td><td>{getStatusBadge(item.status)}</td><td className="small">{item.lastCheck}</td><td className="small text-muted">{item.note || '-'}</td></>}
                    <td className="pe-4 text-end">
                      {activeTab !== 'compliance' && <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}><FontAwesomeIcon icon={faEdit} /></button>}
                      {activeTab !== 'compliance' && <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /></button>}
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
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Report'} {activeTab === 'incidents' ? 'Incident' : activeTab === 'personnel' ? 'Guard' : 'Visitor'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
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

export default Security;
