import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserInjured, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faCalendarCheck, faPills, faFileAlt,
  faUserMd, faTint, faPhone, faVenus, faMars,
  faCheckCircle, faTimes, faSyringe, faHeartbeat,
  faStethoscope, faFlask, faClock, faDollarSign,
  faArrowLeft, faUsers, faClipboardList
} from '@fortawesome/free-solid-svg-icons';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const APPOINTMENT_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];
const DEPARTMENTS = ['General', 'Cardiology', 'Orthopedic', 'Pediatrics', 'Dermatology', 'ENT', 'Ophthalmology', 'Neurology'];

const initialPatientForm = { name: '', bloodGroup: '', department: '', contact: '', email: '', age: '', gender: '', address: '' };
const initialAppointmentForm = { patient: '', doctor: '', date: '', time: '', department: '', status: 'Scheduled' };
const initialPharmacyForm = { medicine: '', stock: '', price: '', expiry: '', manufacturer: '', alert: '' };

const Medical = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ patients: [], appointments: [], pharmacy: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('patients');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialPatientForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        patients: [
          { id: 1, name: 'Ali Ahmed', bloodGroup: 'A+', department: 'Cardiology', contact: '+92 300 1112233', email: 'ali@example.com', age: 22, gender: 'Male', address: 'Lahore' },
          { id: 2, name: 'Sara Khan', bloodGroup: 'B+', department: 'General', contact: '+92 300 4455667', email: 'sara@example.com', age: 20, gender: 'Female', address: 'Islamabad' },
          { id: 3, name: 'Usman Ali', bloodGroup: 'O+', department: 'Orthopedic', contact: '+92 300 7788990', email: 'usman@example.com', age: 24, gender: 'Male', address: 'Karachi' },
          { id: 4, name: 'Fatima Noor', bloodGroup: 'AB+', department: 'Pediatrics', contact: '+92 300 1113344', email: 'fatima@example.com', age: 19, gender: 'Female', address: 'Lahore' },
        ],
        appointments: [
          { id: 1, patient: 'Ali Ahmed', doctor: 'Dr. Usman Malik', date: '2026-07-27', time: '10:00 AM', department: 'Cardiology', status: 'Scheduled' },
          { id: 2, patient: 'Sara Khan', doctor: 'Dr. Fatima Noor', date: '2026-07-27', time: '10:30 AM', department: 'General', status: 'In Progress' },
          { id: 3, patient: 'Usman Ali', doctor: 'Dr. Hassan Raza', date: '2026-07-27', time: '11:00 AM', department: 'Orthopedic', status: 'Completed' },
          { id: 4, patient: 'Fatima Noor', doctor: 'Dr. Ayesha Malik', date: '2026-07-28', time: '09:00 AM', department: 'Pediatrics', status: 'Scheduled' },
        ],
        pharmacy: [
          { id: 1, medicine: 'Paracetamol', stock: 500, price: 50, expiry: '2027-06', manufacturer: 'Pfizer', alert: 'Low' },
          { id: 2, medicine: 'Amoxicillin', stock: 200, price: 120, expiry: '2027-03', manufacturer: 'GSK', alert: 'Normal' },
          { id: 3, medicine: 'Insulin', stock: 30, price: 450, expiry: '2026-12', manufacturer: 'Novo Nordisk', alert: 'Critical' },
          { id: 4, medicine: 'Ibuprofen', stock: 350, price: 35, expiry: '2027-08', manufacturer: 'Bayer', alert: 'Normal' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'patients') return initialPatientForm;
    if (activeTab === 'appointments') return initialAppointmentForm;
    return initialPharmacyForm;
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(getInitialForm());
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'patients') setFormData({ name: item.name || '', bloodGroup: item.bloodGroup || '', department: item.department || '', contact: item.contact || '', email: item.email || '', age: item.age || '', gender: item.gender || '', address: item.address || '' });
    else if (activeTab === 'appointments') setFormData({ patient: item.patient || '', doctor: item.doctor || '', date: item.date || '', time: item.time || '', department: item.department || '', status: item.status || 'Scheduled' });
    else setFormData({ medicine: item.medicine || '', stock: item.stock || '', price: item.price || '', expiry: item.expiry || '', manufacturer: item.manufacturer || '', alert: item.alert || 'Normal' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'patients' ? 'name' : activeTab === 'appointments' ? 'patient' : 'medicine';
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
    if (activeTab === 'patients') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Patient name" /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Age</label>
          <input type="number" className="form-control rounded-3" value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Gender</label>
          <select className="form-select rounded-3" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
            <option value="">Select</option><option>Male</option><option>Female</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Blood Group</label>
          <select className="form-select rounded-3" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
            <option value="">Select</option>{BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Department</label>
          <select className="form-select rounded-3" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
            <option value="">Select</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Contact</label>
          <input type="text" className="form-control rounded-3" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Email</label>
          <input type="email" className="form-control rounded-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Address</label>
          <input type="text" className="form-control rounded-3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'appointments') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Patient <span className="text-danger">*</span></label>
          <select className="form-select rounded-3" value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})}>
            <option value="">Select Patient</option>{data.patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Doctor</label>
          <select className="form-select rounded-3" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
            <option value="">Select Doctor</option><option>Dr. Usman Malik</option><option>Dr. Fatima Noor</option><option>Dr. Hassan Raza</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Time</label>
          <input type="time" className="form-control rounded-3" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Department</label>
          <select className="form-select rounded-3" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
            <option value="">Select</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Medicine Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.medicine} onChange={e => setFormData({...formData, medicine: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Stock</label>
          <input type="number" className="form-control rounded-3" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Price (Rs.)</label>
          <input type="number" className="form-control rounded-3" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Expiry</label>
          <input type="text" className="form-control rounded-3" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} placeholder="2027-06" /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Manufacturer</label>
          <input type="text" className="form-control rounded-3" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Stock Alert</label>
          <select className="form-select rounded-3" value={formData.alert} onChange={e => setFormData({...formData, alert: e.target.value})}>
            <option>Normal</option><option>Low</option><option>Critical</option></select></div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const s = status.replace(' ', '_');
    const map = { Scheduled: 'bg-primary-subtle text-primary', In_Progress: 'bg-info-subtle text-info', Completed: 'bg-success-subtle text-success', Cancelled: 'bg-danger-subtle text-danger', No_Show: 'bg-warning-subtle text-warning' };
    return <span className={`badge rounded-pill ${map[s] || 'bg-secondary-subtle text-secondary'}`}>{status}</span>;
  };

  const getAlertBadge = (alert) => {
    const map = { Critical: 'bg-danger-subtle text-danger', Low: 'bg-warning-subtle text-warning', Normal: 'bg-success-subtle text-success' };
    return <span className={`badge rounded-pill ${map[alert] || ''}`}>{alert}</span>;
  };

  const renderTable = () => {
    const list = data[activeTab] || [];
    if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>;
    if (list.length === 0) return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faUserInjured} className="fs-1 text-muted opacity-50 mb-3" />
        <h6 className="fw-bold">No {activeTab} found</h6>
      </div>
    );
    return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                {activeTab === 'patients' && <><th className="ps-4">Name</th><th>Blood Group</th><th>Department</th><th>Contact</th><th>Gender</th></>}
                {activeTab === 'appointments' && <><th className="ps-4">Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Department</th><th>Status</th></>}
                {activeTab === 'pharmacy' && <><th className="ps-4">Medicine</th><th>Stock</th><th>Price</th><th>Expiry</th><th>Manufacturer</th><th>Alert</th></>}
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  {activeTab === 'patients' && (
                    <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faUserInjured} className="me-2 text-muted opacity-50" />{item.name}</td>
                      <td><span className="badge rounded-pill bg-danger-subtle text-danger">{item.bloodGroup}</span></td>
                      <td className="small">{item.department}</td><td className="small">{item.contact}</td><td className="small">{item.gender}</td></>
                  )}
                  {activeTab === 'appointments' && (
                    <><td className="ps-4 fw-semibold small">{item.patient}</td>
                      <td className="small"><FontAwesomeIcon icon={faUserMd} className="me-1 text-muted" />{item.doctor}</td>
                      <td className="small">{item.date}</td><td className="small">{item.time}</td>
                      <td className="small">{item.department}</td><td>{getStatusBadge(item.status)}</td></>
                  )}
                  {activeTab === 'pharmacy' && (
                    <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faPills} className="me-2 text-muted opacity-50" />{item.medicine}</td>
                      <td className="small fw-bold">{item.stock}</td><td className="small">Rs.{item.price}</td>
                      <td className="small">{item.expiry}</td><td className="small">{item.manufacturer}</td><td>{getAlertBadge(item.alert)}</td></>
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
    );
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Medical Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage patients, appointments, and pharmacy</p>
        </div>
        <div className="d-flex gap-2">
          {activeTab !== 'reports' && (
            <button className="btn btn-primary rounded-3" onClick={openAddForm}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'patients' ? 'Patient' : activeTab === 'appointments' ? 'Appointment' : 'Medicine'}
            </button>
          )}
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[
          { key: 'patients', label: 'Patients', icon: faUsers },
          { key: 'appointments', label: 'Appointments', icon: faCalendarCheck },
          { key: 'pharmacy', label: 'Pharmacy', icon: faPills },
          { key: 'reports', label: 'Reports', icon: faFileAlt },
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

      {activeTab === 'reports' ? (
        <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <h5 className="fw-bold mb-3" style={{ color: textColor }}>Medical Reports</h5>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-4 rounded-4 text-center" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.primary}20` }}>
                <div className="h3 fw-bold mb-0" style={{ color: colors.primary }}>{data.patients.length}</div>
                <div className="small fw-semibold text-muted">Total Patients</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 rounded-4 text-center" style={{ background: `${colors.info}08`, border: `1px solid ${colors.info}20` }}>
                <div className="h3 fw-bold mb-0" style={{ color: colors.info }}>{data.appointments.filter(a => a.status === 'Scheduled').length}</div>
                <div className="small fw-semibold text-muted">Upcoming Appointments</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 rounded-4 text-center" style={{ background: `${colors.success}08`, border: `1px solid ${colors.success}20` }}>
                <div className="h3 fw-bold mb-0" style={{ color: colors.success }}>{data.appointments.filter(a => a.status === 'Completed').length}</div>
                <div className="small fw-semibold text-muted">Completed Today</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 rounded-4 text-center" style={{ background: `${colors.danger}08`, border: `1px solid ${colors.danger}20` }}>
                <div className="h3 fw-bold mb-0" style={{ color: colors.danger }}>{data.pharmacy.filter(p => p.alert === 'Critical').length}</div>
                <div className="small fw-semibold text-muted">Critical Stock Alerts</div>
              </div>
            </div>
          </div>
        </div>
      ) : renderTable()}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'patients' ? 'Patient' : activeTab === 'appointments' ? 'Appointment' : 'Medicine'}</h5>
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

const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4', purple: '#8b5cf6' };

export default Medical;
