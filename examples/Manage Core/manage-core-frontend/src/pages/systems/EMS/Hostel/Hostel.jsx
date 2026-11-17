import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faDoorOpen, faBed, faKey,
  faUsers, faUserGraduate, faPhone, faMapMarkerAlt,
  faCheckCircle, faTimes, faWrench, faArrowLeft,
  faCalendarAlt, faFemale, faIdCard
} from '@fortawesome/free-solid-svg-icons';

const HOSTEL_TYPES = ['Boys', 'Girls', 'Co-Education'];
const ROOM_STATUSES = ['Available', 'Occupied', 'Under Maintenance', 'Reserved'];
const ALLOCATION_STATUSES = ['Active', 'Checked Out', 'Pending'];

const initialHostelForm = { name: '', type: '', capacity: '', warden: '' };
const initialRoomForm = { number: '', floor: '', capacity: '', type: '', status: 'Available' };
const initialAllocationForm = { student: '', room: '', bed: '', checkIn: '', status: 'Active' };
const initialVisitorForm = { name: '', student: '', room: '', phone: '', inTime: '', outTime: '' };

const Hostel = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ hostels: [], rooms: [], allocations: [], visitors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hostels');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialHostelForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        hostels: [
          { id: 1, name: 'Hostel A', type: 'Boys', capacity: 200, warden: 'Dr. Ali Khan' },
          { id: 2, name: 'Hostel B', type: 'Girls', capacity: 180, warden: 'Ms. Sara Ali' },
          { id: 3, name: 'Hostel C', type: 'Boys', capacity: 150, warden: 'Mr. Usman Raza' },
          { id: 4, name: 'Hostel D', type: 'Co-Education', capacity: 120, warden: 'Dr. Fatima Noor' },
        ],
        rooms: [
          { id: 1, number: 'A-101', floor: 1, capacity: 3, occupied: 2, type: 'Triple', status: 'Available', hostel: 'Hostel A' },
          { id: 2, number: 'A-102', floor: 1, capacity: 2, occupied: 2, type: 'Double', status: 'Occupied', hostel: 'Hostel A' },
          { id: 3, number: 'B-201', floor: 2, capacity: 1, occupied: 1, type: 'Single', status: 'Occupied', hostel: 'Hostel B' },
          { id: 4, number: 'C-301', floor: 3, capacity: 4, occupied: 0, type: 'Dormitory', status: 'Available', hostel: 'Hostel C' },
          { id: 5, number: 'D-101', floor: 1, capacity: 2, occupied: 0, type: 'Double', status: 'Under Maintenance', hostel: 'Hostel D' },
        ],
        allocations: [
          { id: 1, student: 'Ali Ahmed', room: 'A-102', bed: 'Bed 1', checkIn: '2026-01-15', status: 'Active', hostel: 'Hostel A' },
          { id: 2, student: 'Sara Khan', room: 'B-201', bed: 'Bed 1', checkIn: '2026-02-01', status: 'Active', hostel: 'Hostel B' },
          { id: 3, student: 'Usman Ali', room: 'A-101', bed: 'Bed 2', checkIn: '2026-03-10', status: 'Active', hostel: 'Hostel A' },
          { id: 4, student: 'Hassan Raza', room: 'A-102', bed: 'Bed 2', checkIn: '2026-01-20', status: 'Checked Out', hostel: 'Hostel A' },
        ],
        visitors: [
          { id: 1, name: 'Ahmed Khan', student: 'Ali Ahmed', room: 'A-102', phone: '+92 300 1112233', inTime: '10:00 AM', outTime: '12:00 PM' },
          { id: 2, name: 'Fatima Noor', student: 'Sara Khan', room: 'B-201', phone: '+92 300 4455667', inTime: '2:00 PM', outTime: '5:00 PM' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'hostels') return initialHostelForm;
    if (activeTab === 'rooms') return initialRoomForm;
    if (activeTab === 'allocations') return initialAllocationForm;
    return initialVisitorForm;
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(getInitialForm());
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'hostels') setFormData({ name: item.name || '', type: item.type || '', capacity: item.capacity || '', warden: item.warden || '' });
    else if (activeTab === 'rooms') setFormData({ number: item.number || '', floor: item.floor || '', capacity: item.capacity || '', type: item.type || '', status: item.status || 'Available' });
    else if (activeTab === 'allocations') setFormData({ student: item.student || '', room: item.room || '', bed: item.bed || '', checkIn: item.checkIn || '', status: item.status || 'Active' });
    else setFormData({ name: item.name || '', student: item.student || '', room: item.room || '', phone: item.phone || '', inTime: item.inTime || '', outTime: item.outTime || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'hostels' || activeTab === 'visitors' ? 'name' : activeTab === 'rooms' ? 'number' : 'student';
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
    if (activeTab === 'hostels') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Hostel Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Hostel A" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option>{HOSTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Capacity</label>
          <input type="number" className="form-control rounded-3" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} min="1" /></div>
        <div className="col-md-8"><label className="small fw-bold text-muted mb-2">Warden</label>
          <input type="text" className="form-control rounded-3" value={formData.warden} onChange={e => setFormData({...formData, warden: e.target.value})} placeholder="Dr. Ali Khan" /></div>
      </div>
    );
    if (activeTab === 'rooms') return (
      <div className="row g-3">
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Room Number <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} placeholder="A-101" /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Floor</label>
          <input type="number" className="form-control rounded-3" value={formData.floor} onChange={e => setFormData({...formData, floor: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Capacity</label>
          <input type="number" className="form-control rounded-3" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} min="1" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Room Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option>
          </select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            {ROOM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
    );
    if (activeTab === 'allocations') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Student <span className="text-danger">*</span></label>
          <select className="form-select rounded-3" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})}>
            <option value="">Select Student</option>
          </select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Room</label>
          <select className="form-select rounded-3" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}>
            <option value="">Select Room</option>{data.rooms.filter(r => r.status === 'Available').map(r => <option key={r.id} value={r.number}>{r.number}</option>)}
          </select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Bed Number</label>
          <input type="text" className="form-control rounded-3" value={formData.bed} onChange={e => setFormData({...formData, bed: e.target.value})} placeholder="Bed 1" /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Check-In Date</label>
          <input type="date" className="form-control rounded-3" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            {ALLOCATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Visitor Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Visitor name" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Phone</label>
          <input type="text" className="form-control rounded-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Student to Visit</label>
          <input type="text" className="form-control rounded-3" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Room</label>
          <input type="text" className="form-control rounded-3" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Out Time</label>
          <input type="text" className="form-control rounded-3" value={formData.outTime} onChange={e => setFormData({...formData, outTime: e.target.value})} placeholder="5:00 PM" /></div>
      </div>
    );
  };

  const renderTable = () => {
    const list = data[activeTab] || [];
    if (activeTab === 'hostels') return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Name</th><th>Type</th><th>Capacity</th><th>Warden</th><th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  <td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faBuilding} className="me-2 text-muted opacity-50" />{item.name}</td>
                  <td><span className="badge rounded-pill bg-info-subtle text-info">{item.type}</span></td>
                  <td className="small">{item.capacity}</td>
                  <td className="small">{item.warden}</td>
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
    if (activeTab === 'rooms') return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Room</th><th>Floor</th><th>Capacity</th><th>Occupied</th><th>Type</th><th>Status</th><th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  <td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faDoorOpen} className="me-2 text-muted opacity-50" />{item.number}</td>
                  <td className="small">Floor {item.floor}</td>
                  <td className="small">{item.capacity}</td>
                  <td className="small">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`fw-bold small ${item.occupied >= item.capacity ? 'text-danger' : 'text-success'}`}>{item.occupied}</span>
                      <div className="progress flex-grow-1" style={{ height: '4px', width: '40px' }}>
                        <div className="progress-bar" style={{ width: `${(item.occupied / (item.capacity || 1)) * 100}%`, background: item.occupied >= item.capacity ? '#ef4444' : '#10b981' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="small">{item.type}</td>
                  <td><span className={`badge rounded-pill ${item.status === 'Available' ? 'bg-success-subtle text-success' : item.status === 'Occupied' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'}`}>{item.status}</span></td>
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
    return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                {activeTab === 'allocations' ? (
                  <><th className="ps-4">Student</th><th>Room</th><th>Bed</th><th>Check-In</th><th>Status</th><th className="pe-4 text-end">Actions</th></>
                ) : (
                  <><th className="ps-4">Name</th><th>Student</th><th>Room</th><th>Phone</th><th>In Time</th><th>Out Time</th><th className="pe-4 text-end">Actions</th></>
                )}
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  {activeTab === 'allocations' ? (
                    <>
                      <td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faUserGraduate} className="me-2 text-muted opacity-50" />{item.student}</td>
                      <td className="small">{item.room}</td>
                      <td className="small">{item.bed}</td>
                      <td className="small">{item.checkIn}</td>
                      <td><span className={`badge rounded-pill ${item.status === 'Active' ? 'bg-success-subtle text-success' : item.status === 'Checked Out' ? 'bg-secondary-subtle text-secondary' : 'bg-warning-subtle text-warning'}`}>{item.status}</span></td>
                    </>
                  ) : (
                    <>
                      <td className="ps-4 fw-semibold small">{item.name}</td>
                      <td className="small">{item.student}</td>
                      <td className="small">{item.room}</td>
                      <td className="small">{item.phone}</td>
                      <td className="small">{item.inTime}</td>
                      <td className="small">{item.outTime || '-'}</td>
                    </>
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
          <h4 className="fw-bold mb-1">Hostel Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage hostels, rooms, allocations, and visitors</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary rounded-3" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'hostels' ? 'Hostel' : activeTab === 'rooms' ? 'Room' : activeTab === 'allocations' ? 'Allocation' : 'Visitor'}
          </button>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[
          { key: 'hostels', label: 'Hostels', icon: faBuilding },
          { key: 'rooms', label: 'Rooms', icon: faDoorOpen },
          { key: 'allocations', label: 'Allocations', icon: faKey },
          { key: 'visitors', label: 'Visitors', icon: faUsers },
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

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        renderTable()
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'hostels' ? 'Hostel' : activeTab === 'rooms' ? 'Room' : activeTab === 'allocations' ? 'Allocation' : 'Visitor'}</h5>
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

export default Hostel;
