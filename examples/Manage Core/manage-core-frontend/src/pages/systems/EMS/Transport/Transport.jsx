import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faUsers, faRoute, faUser,
  faIdCard, faPhone, faChair, faMapMarkerAlt,
  faGasPump, faCog, faTimes, faTachometerAlt,
  faArrowLeft, faUserGraduate, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const VEHICLE_TYPES = ['Bus', 'Van', 'Car', 'Auto Rickshaw'];
const VEHICLE_STATUSES = ['Active', 'In Maintenance', 'Retired'];
const LICENSE_CLASSES = ['LTV', 'HTV', 'Motorcycle'];

const initialVehicleForm = { number: '', type: '', model: '', capacity: 1, status: 'Active' };
const initialDriverForm = { name: '', license: '', licenseClass: '', phone: '', assignedVehicle: '' };
const initialRouteForm = { name: '', stops: '', distance: '', vehicle: '' };

const Transport = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ vehicles: [], drivers: [], routes: [], students: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialVehicleForm);
  const [showAssign, setShowAssign] = useState(false);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData({
        vehicles: [
          { id: 1, number: 'BUS-001', type: 'Bus', model: 'Toyota Coaster', capacity: 30, status: 'Active' },
          { id: 2, number: 'BUS-002', type: 'Bus', model: 'Hino AK', capacity: 40, status: 'Active' },
          { id: 3, number: 'VAN-001', type: 'Van', model: 'Toyota Hiace', capacity: 12, status: 'In Maintenance' },
          { id: 4, number: 'BUS-003', type: 'Bus', model: 'Isuzu', capacity: 35, status: 'Active' },
          { id: 5, number: 'CAR-001', type: 'Car', model: 'Suzuki Swift', capacity: 4, status: 'Active' },
        ],
        drivers: [
          { id: 1, name: 'Ali Khan', license: 'DL-00123', licenseClass: 'HTV', phone: '+92 300 1112233', assignedVehicle: 'BUS-001' },
          { id: 2, name: 'Usman Ali', license: 'DL-00456', licenseClass: 'HTV', phone: '+92 300 4455667', assignedVehicle: 'BUS-002' },
          { id: 3, name: 'Sara Khan', license: 'DL-00789', licenseClass: 'LTV', phone: '+92 300 7788990', assignedVehicle: 'VAN-001' },
          { id: 4, name: 'Hassan Raza', license: 'DL-00111', licenseClass: 'HTV', phone: '+92 300 2223344', assignedVehicle: 'BUS-003' },
        ],
        routes: [
          { id: 1, name: 'Route A', stops: 'Campus - Stop1 - Stop2 - Stop3', distance: '12 km', vehicle: 'BUS-001' },
          { id: 2, name: 'Route B', stops: 'Campus - Stop4 - Stop5', distance: '8 km', vehicle: 'BUS-002' },
          { id: 3, name: 'Route C', stops: 'Campus - Stop6 - Stop7 - Stop8 - Stop9', distance: '15 km', vehicle: 'VAN-001' },
          { id: 4, name: 'Route D', stops: 'Campus - Stop10 - Stop11', distance: '6 km', vehicle: 'BUS-003' },
        ],
        students: [
          { id: 1, name: 'Ahmed Ali', class: 'CS-3A', route: 'Route A', stop: 'Stop1', vehicle: 'BUS-001' },
          { id: 2, name: 'Fatima Noor', class: 'BBA-2B', route: 'Route B', stop: 'Stop4', vehicle: 'BUS-002' },
          { id: 3, name: 'Hassan Shah', class: 'ENG-1A', route: 'Route C', stop: 'Stop8', vehicle: 'VAN-001' },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getFormByTab = () => {
    if (activeTab === 'vehicles') return initialVehicleForm;
    if (activeTab === 'drivers') return initialDriverForm;
    return initialRouteForm;
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(getFormByTab());
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    if (activeTab === 'vehicles') setFormData({ number: item.number || '', type: item.type || '', model: item.model || '', capacity: item.capacity || 1, status: item.status || 'Active' });
    else if (activeTab === 'drivers') setFormData({ name: item.name || '', license: item.license || '', licenseClass: item.licenseClass || '', phone: item.phone || '', assignedVehicle: item.assignedVehicle || '' });
    else setFormData({ name: item.name || '', stops: item.stops || '', distance: item.distance || '', vehicle: item.vehicle || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqField = activeTab === 'vehicles' ? 'number' : 'name';
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

  const renderTable = () => {
    const list = data[activeTab] || [];
    const columns = {
      vehicles: [
        { key: 'number', label: 'Vehicle No', icon: faTruck },
        { key: 'type', label: 'Type' },
        { key: 'model', label: 'Model' },
        { key: 'capacity', label: 'Capacity', render: v => <span>{v} seats</span> },
        { key: 'status', label: 'Status', render: v => <span className={`badge rounded-pill ${v === 'Active' ? 'bg-success-subtle text-success' : v === 'In Maintenance' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'}`}>{v}</span> },
      ],
      drivers: [
        { key: 'name', label: 'Name', icon: faUser },
        { key: 'license', label: 'License' },
        { key: 'licenseClass', label: 'Class' },
        { key: 'phone', label: 'Phone' },
        { key: 'assignedVehicle', label: 'Vehicle', render: v => v || '-' },
      ],
      routes: [
        { key: 'name', label: 'Name', icon: faRoute },
        { key: 'stops', label: 'Stops' },
        { key: 'distance', label: 'Distance' },
        { key: 'vehicle', label: 'Vehicle' },
      ],
    };

    const cols = columns[activeTab] || [];

    return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                {cols.map(c => <th key={c.key} className={c.key === 'number' || c.key === 'name' ? 'ps-4' : ''}>{c.label}</th>)}
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={cols.length + 1} className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={cols.length + 1} className="text-center py-5">
                  <FontAwesomeIcon icon={faTruck} className="fs-1 text-muted opacity-50 mb-3" />
                  <h6 className="fw-bold">No {activeTab} found</h6>
                  <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new {activeTab.slice(0, -1)} to get started</p>
                </td></tr>
              ) : list.map(item => (
                <tr key={item.id}>
                  {cols.map(c => (
                    <td key={c.key} className={c.key === 'number' || c.key === 'name' ? 'ps-4 fw-semibold small' : 'small'}>
                      {c.icon && <FontAwesomeIcon icon={c.icon} className="me-2 text-muted opacity-50" />}
                      {c.render ? c.render(item[c.key]) : item[c.key]}
                    </td>
                  ))}
                  <td className="pe-4 text-end">
                    {activeTab === 'students' ? (
                      <button className="btn btn-sm btn-light border rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getModalForm = () => {
    if (activeTab === 'vehicles') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Vehicle Number <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} placeholder="BUS-001" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Type</label>
          <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="">Select</option>{VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Model</label>
          <input type="text" className="form-control rounded-3" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="Toyota Coaster" /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Capacity</label>
          <input type="number" className="form-control rounded-3" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} min="1" /></div>
        <div className="col-md-3"><label className="small fw-bold text-muted mb-2">Status</label>
          <select className="form-select rounded-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            {VEHICLE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
    );
    if (activeTab === 'drivers') return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Driver name" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">License No</label>
          <input type="text" className="form-control rounded-3" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} placeholder="DL-00123" /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">License Class</label>
          <select className="form-select rounded-3" value={formData.licenseClass} onChange={e => setFormData({...formData, licenseClass: e.target.value})}>
            <option value="">Select</option>{LICENSE_CLASSES.map(l => <option key={l} value={l}>{l}</option>)}
          </select></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Phone</label>
          <input type="text" className="form-control rounded-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+92 300 0000000" /></div>
        <div className="col-md-4"><label className="small fw-bold text-muted mb-2">Assigned Vehicle</label>
          <select className="form-select rounded-3" value={formData.assignedVehicle} onChange={e => setFormData({...formData, assignedVehicle: e.target.value})}>
            <option value="">None</option>{data.vehicles.map(v => <option key={v.id} value={v.number}>{v.number}</option>)}
          </select></div>
      </div>
    );
    return (
      <div className="row g-3">
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Route Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Route A" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Distance</label>
          <input type="text" className="form-control rounded-3" value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} placeholder="12 km" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Stops</label>
          <input type="text" className="form-control rounded-3" value={formData.stops} onChange={e => setFormData({...formData, stops: e.target.value})} placeholder="Stop1, Stop2, Stop3" /></div>
        <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Assigned Vehicle</label>
          <select className="form-select rounded-3" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})}>
            <option value="">Select</option>{data.vehicles.map(v => <option key={v.id} value={v.number}>{v.number}</option>)}
          </select></div>
      </div>
    );
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Transport Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage vehicles, drivers, routes, and student assignments</p>
        </div>
        <div className="d-flex gap-2">
          {activeTab !== 'students' && (
            <button className="btn btn-primary rounded-3" onClick={openAddForm}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />Add {activeTab === 'vehicles' ? 'Vehicle' : activeTab === 'drivers' ? 'Driver' : 'Route'}
            </button>
          )}
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[
          { key: 'vehicles', label: 'Vehicles', icon: faTruck },
          { key: 'drivers', label: 'Drivers', icon: faUsers },
          { key: 'routes', label: 'Routes', icon: faRoute },
          { key: 'students', label: 'Students', icon: faUserGraduate },
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
          <div className="col-md-8 d-flex align-items-center gap-2">
            {activeTab === 'students' && (
              <button className="btn btn-success rounded-3 ms-auto" onClick={() => setShowAssign(true)}>
                <FontAwesomeIcon icon={faUserGraduate} className="me-2" />Assign Student
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      {renderTable()}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit' : 'Add'} {activeTab === 'vehicles' ? 'Vehicle' : activeTab === 'drivers' ? 'Driver' : 'Route'}</h5>
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

      {showAssign && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">Assign Student to Route</h5>
                <button className="btn-close" onClick={() => setShowAssign(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Student</label>
                    <select className="form-select rounded-3"><option value="">Select Student</option></select></div>
                  <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Route</label>
                    <select className="form-select rounded-3"><option value="">Select Route</option>
                      {data.routes.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select></div>
                  <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Bus Stop</label>
                    <input type="text" className="form-control rounded-3" placeholder="Nearest stop" /></div>
                  <div className="col-md-6"><label className="small fw-bold text-muted mb-2">Vehicle</label>
                    <select className="form-select rounded-3"><option value="">Select Vehicle</option>
                      {data.vehicles.map(v => <option key={v.id} value={v.number}>{v.number}</option>)}
                    </select></div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowAssign(false)}>Cancel</button>
                <button type="button" className="btn btn-primary rounded-3 px-4" onClick={() => { addNotification?.('Student assigned', 'success'); setShowAssign(false); }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default Transport;
