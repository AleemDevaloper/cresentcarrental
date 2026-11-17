import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faDoorOpen, faCalendarCheck, faWrench,
  faCheckCircle, faTimes, faChalkboardTeacher, faFlask,
  faDesktop, faClipboardList, faTools
} from '@fortawesome/free-solid-svg-icons';

const initialBuildingForm = { name: '', code: '', floors: '', type: '', facilities: '' };
const initialRoomForm = { number: '', building: '', floor: '', capacity: '', type: '', equipment: '', status: 'Available' };
const initialBookingForm = { room: '', purpose: '', bookedBy: '', date: '', time: '', status: 'Confirmed' };
const initialWorkOrderForm = { title: '', room: '', type: '', priority: '', assignedTo: '', status: 'Open', description: '' };

const CampusFacilities = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ buildings: [], rooms: [], bookings: [], maintenance: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('buildings');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialBuildingForm);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        buildings: [
          { id: 1, name: 'Academic Block', code: 'AB', floors: 5, type: 'Academic', facilities: 'Elevator, AC, WiFi' },
          { id: 2, name: 'Science Building', code: 'SB', floors: 4, type: 'Lab', facilities: 'Labs, Auditorium' },
          { id: 3, name: 'Library Block', code: 'LB', floors: 3, type: 'Library', facilities: 'Reading Rooms, Digital Lab' },
          { id: 4, name: 'Admin Building', code: 'AD', floors: 2, type: 'Administrative', facilities: 'Offices, Meeting Rooms' },
        ],
        rooms: [
          { id: 1, number: 'AB-101', building: 'Academic Block', floor: 1, capacity: 40, type: 'Classroom', equipment: 'Projector, Whiteboard', status: 'Available' },
          { id: 2, number: 'SB-201', building: 'Science Building', floor: 2, capacity: 25, type: 'Lab', equipment: 'Computers, Microscopes', status: 'In Use' },
          { id: 3, number: 'AB-301', building: 'Academic Block', floor: 3, capacity: 80, type: 'Lecture Hall', equipment: 'Smart Board, Sound System', status: 'Available' },
          { id: 4, number: 'LB-001', building: 'Library Block', floor: 1, capacity: 100, type: 'Hall', equipment: 'Projector, Stage', status: 'Under Maintenance' },
        ],
        bookings: [
          { id: 1, room: 'AB-101', purpose: 'AI Workshop', bookedBy: 'Dr. Ali', date: '2026-07-28', time: '10:00-12:00', status: 'Confirmed' },
          { id: 2, room: 'SB-201', purpose: 'Physics Lab', bookedBy: 'Prof. Sara', date: '2026-07-28', time: '14:00-16:00', status: 'Confirmed' },
          { id: 3, room: 'AB-301', purpose: 'Guest Lecture', bookedBy: 'Admin', date: '2026-07-29', time: '09:00-11:00', status: 'Pending' },
        ],
        maintenance: [
          { id: 1, title: 'AC Not Working', room: 'AB-101', type: 'HVAC', priority: 'High', assignedTo: 'Tech Team A', status: 'In Progress', description: 'AC unit not cooling' },
          { id: 2, title: 'Light Replacement', room: 'SB-201', type: 'Electrical', priority: 'Low', assignedTo: 'Tech Team B', status: 'Open', description: 'Tube light fuse' },
          { id: 3, title: 'Water Leakage', room: 'AB-301', type: 'Plumbing', priority: 'Urgent', assignedTo: 'Tech Team A', status: 'Open', description: 'Ceiling leak near window' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitialForm = () => {
    if (activeTab === 'buildings') return initialBuildingForm;
    if (activeTab === 'rooms') return initialRoomForm;
    if (activeTab === 'bookings') return initialBookingForm;
    return initialWorkOrderForm;
  };

  const openAddForm = () => { setEditItem(null); setFormData(getInitialForm()); setShowModal(true); };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'buildings') setFormData({ name: item.name || '', code: item.code || '', floors: item.floors || '', type: item.type || '', facilities: item.facilities || '' });
    else if (activeTab === 'rooms') setFormData({ number: item.number || '', building: item.building || '', floor: item.floor || '', capacity: item.capacity || '', type: item.type || '', equipment: item.equipment || '', status: item.status || 'Available' });
    else if (activeTab === 'bookings') setFormData({ room: item.room || '', purpose: item.purpose || '', bookedBy: item.bookedBy || '', date: item.date || '', time: item.time || '', status: item.status || 'Confirmed' });
    else setFormData({ title: item.title || '', room: item.room || '', type: item.type || '', priority: item.priority || '', assignedTo: item.assignedTo || '', status: item.status || 'Open', description: item.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'buildings' ? 'name' : activeTab === 'rooms' ? 'number' : activeTab === 'bookings' ? 'purpose' : 'title';
    if (!formData[reqField]) { addNotification?.('Please fill required fields', 'warning'); return; }
    try { await new Promise(r => setTimeout(r, 300)); addNotification?.(editItem ? 'Updated' : 'Added', 'success'); setShowModal(false); setEditItem(null); fetchData(); }
    catch (err) { addNotification?.(err.message || 'Error', 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try { await new Promise(r => setTimeout(r, 200)); addNotification?.('Deleted', 'success'); fetchData(); }
    catch (err) { addNotification?.(err.message || 'Delete failed', 'danger'); }
  };

  const getModalForm = () => {
    if (activeTab === 'buildings') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Building Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Code</label>
          <input type="text" className="form-control rounded-3" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Floors</label>
          <input type="number" className="form-control rounded-3" value={formData.floors} onChange={e => setFormData({...formData, floors: Number(e.target.value)})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Academic</option><option>Lab</option><option>Library</option><option>Administrative</option></select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Facilities</label>
          <input type="text" className="form-control rounded-3" value={formData.facilities} onChange={e => setFormData({...formData, facilities: e.target.value})} /></div>
      </div>
    );
    if (activeTab === 'rooms') return (
      <div className="row g-3">
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Room Number <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Building</label>
          <select className="form-select rounded-3" value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})}>
            <option value="">Select</option>{data.buildings.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}</select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Floor</label>
          <input type="number" className="form-control rounded-3" value={formData.floor} onChange={e => setFormData({...formData, floor: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Capacity</label>
          <input type="number" className="form-control rounded-3" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Classroom</option><option>Lab</option><option>Lecture Hall</option><option>Office</option><option>Hall</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>Available</option><option>In Use</option><option>Under Maintenance</option></select></div>
        <div className="col-md-12"><label className="small fw-bold text-muted mb-2">Equipment</label>
          <input type="text" className="form-control rounded-3" value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} placeholder="Projector, Whiteboard, etc." /></div>
      </div>
    );
    if (activeTab === 'bookings') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Room</label>
          <select className="form-select rounded-3" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}>
            <option value="">Select</option>{data.rooms.map(r => <option key={r.id} value={r.number}>{r.number}</option>)}</select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Purpose <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Booked By</label>
          <input type="text" className="form-control rounded-3" value={formData.bookedBy} onChange={e => setFormData({...formData, bookedBy: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Date</label>
          <input type="date" className="form-control rounded-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>Confirmed</option><option>Pending</option><option>Cancelled</option></select></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-8"><label className="small fw-bold text-muted mb-2">Title <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Priority</label>
          <select className="form-select rounded-3" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Room</label>
          <input type="text" className="form-control rounded-3" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option><option>Electrical</option><option>Plumbing</option><option>HVAC</option><option>Structural</option></select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Assigned To</label>
          <input type="text" className="form-control rounded-3" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} /></div>
        <div className="col-md-12"><label className="small fw-bold text-muted mb-2">Description</label>
          <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const map = { Available: 'bg-success-subtle text-success', In_Use: 'bg-primary-subtle text-primary', Under_Maintenance: 'bg-warning-subtle text-warning', Confirmed: 'bg-success-subtle text-success', Pending: 'bg-warning-subtle text-warning', Cancelled: 'bg-danger-subtle text-danger', Open: 'bg-info-subtle text-info', In_Progress: 'bg-primary-subtle text-primary' };
    return <span className={`badge rounded-pill ${map[status] || map[status.replace(' ', '_')] || 'bg-secondary-subtle text-secondary'}`}>{status}</span>;
  };

  const getPriorityBadge = (p) => {
    const map = { Urgent: 'bg-danger text-white', High: 'bg-warning text-dark', Medium: 'bg-info text-white', Low: 'bg-secondary text-white' };
    return <span className={`badge rounded-pill ${map[p] || ''}`}>{p}</span>;
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Campus Facilities</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage buildings, rooms, bookings, and maintenance</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'buildings' ? 'Building' : activeTab === 'rooms' ? 'Room' : activeTab === 'bookings' ? 'Booking' : 'Work Order'}
        </button>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[{ key: 'buildings', label: 'Buildings', icon: faBuilding }, { key: 'rooms', label: 'Rooms', icon: faDoorOpen }, { key: 'bookings', label: 'Bookings', icon: faCalendarCheck }, { key: 'maintenance', label: 'Maintenance', icon: faWrench }].map(tab => (
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
                  {activeTab === 'buildings' && <><th className="ps-4">Name</th><th>Code</th><th>Floors</th><th>Type</th><th>Facilities</th></>}
                  {activeTab === 'rooms' && <><th className="ps-4">Room</th><th>Building</th><th>Floor</th><th>Capacity</th><th>Type</th><th>Equipment</th><th>Status</th></>}
                  {activeTab === 'bookings' && <><th className="ps-4">Room</th><th>Purpose</th><th>Booked By</th><th>Date</th><th>Time</th><th>Status</th></>}
                  {activeTab === 'maintenance' && <><th className="ps-4">Title</th><th>Room</th><th>Type</th><th>Priority</th><th>Assigned To</th><th>Status</th></>}
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data[activeTab] || []).map(item => (
                  <tr key={item.id}>
                    {activeTab === 'buildings' && <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faBuilding} className="me-2 text-muted opacity-50" />{item.name}</td><td className="small"><code>{item.code}</code></td><td className="small">{item.floors}</td><td className="small">{item.type}</td><td className="small">{item.facilities}</td></>}
                    {activeTab === 'rooms' && <><td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faDoorOpen} className="me-2 text-muted opacity-50" />{item.number}</td><td className="small">{item.building}</td><td className="small">{item.floor}</td><td className="small">{item.capacity}</td><td className="small">{item.type}</td><td className="small text-muted">{item.equipment}</td><td>{getStatusBadge(item.status)}</td></>}
                    {activeTab === 'bookings' && <><td className="ps-4 fw-semibold small">{item.room}</td><td className="small">{item.purpose}</td><td className="small">{item.bookedBy}</td><td className="small">{item.date}</td><td className="small">{item.time}</td><td>{getStatusBadge(item.status)}</td></>}
                    {activeTab === 'maintenance' && <><td className="ps-4 fw-semibold small">{item.title}</td><td className="small">{item.room}</td><td className="small">{item.type}</td><td>{getPriorityBadge(item.priority)}</td><td className="small">{item.assignedTo}</td><td>{getStatusBadge(item.status)}</td></>}
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
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'buildings' ? 'Building' : activeTab === 'rooms' ? 'Room' : activeTab === 'bookings' ? 'Booking' : 'Work Order'}</h5>
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

export default CampusFacilities;
