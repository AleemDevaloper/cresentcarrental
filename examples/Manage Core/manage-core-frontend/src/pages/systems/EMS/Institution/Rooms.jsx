import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUsers, faLayerGroup,
  faDesktop, faChalkboard, faWind,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listRooms, createRoom, updateRoom, deleteRoom,
  listBuildings
} from '../../../../api/ems';

const ROOM_TYPES = ['Classroom', 'Lab', 'Office', 'Lecture Hall', 'Seminar Room', 'Library', 'Auditorium', 'Conference Room', 'Studio', 'Other'];

const RESOURCE_OPTIONS = ['Projector', 'SmartBoard', 'AC', 'WiFi', 'Computer Lab', 'Audio System', 'Video Conferencing'];

const Rooms = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '', name: '', building_id: '', floor: '', capacity: '',
    room_type: 'Classroom', resources: '', status: 'active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (buildingFilter) params.building_id = buildingFilter;
      if (typeFilter) params.room_type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const [roomRes, bldgRes] = await Promise.all([
        listRooms(params),
        listBuildings()
      ]);
      setData(Array.isArray(roomRes) ? roomRes : []);
      setBuildings(Array.isArray(bldgRes) ? bldgRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
      addNotification?.(err.message || 'Failed to load rooms', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, buildingFilter, typeFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getBuildingName = (id) => {
    const b = buildings.find(bldg => bldg.id === id);
    return b ? b.name : 'Unknown';
  };

  const formatResources = (resources) => {
    if (!resources) return '-';
    const items = typeof resources === 'string' ? resources.split(',').map(s => s.trim()) : (Array.isArray(resources) ? resources : []);
    return items.join(', ');
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      room_number: '', name: '', building_id: buildings[0]?.id || '', floor: '',
      capacity: '', room_type: 'Classroom', resources: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      room_number: item.room_number || '', name: item.name || '',
      building_id: item.building_id || buildings[0]?.id || '',
      floor: item.floor ?? '', capacity: item.capacity ?? '',
      room_type: item.room_type || 'Classroom',
      resources: Array.isArray(item.resources) ? item.resources.join(', ') : (item.resources || ''),
      status: item.status || 'active',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.room_number) {
      addNotification?.('Room Number is required', 'warning');
      return;
    }
    try {
      if (editItem) {
        await updateRoom(editItem.id, formData);
        addNotification?.('Room updated successfully', 'success');
      } else {
        await createRoom(formData);
        addNotification?.('Room created successfully', 'success');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving room', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      addNotification?.('Room deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const toggleResource = (res) => {
    const current = formData.resources ? formData.resources.split(',').map(s => s.trim()).filter(Boolean) : [];
    const idx = current.indexOf(res);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(res);
    }
    setFormData({...formData, resources: current.join(', ')});
  };

  const selectedResources = formData.resources ? formData.resources.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Rooms</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage rooms and facilities</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Room
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search rooms..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={buildingFilter} onChange={e => setBuildingFilter(e.target.value)}>
              <option value="">All Buildings</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary rounded-3 w-100"
              onClick={() => { setSearch(''); setBuildingFilter(''); setTypeFilter(''); setStatusFilter(''); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Room</th>
                <th>Name</th>
                <th>Building</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Type</th>
                <th>Resources</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <FontAwesomeIcon icon={faDoorOpen} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No rooms found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new room to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faDoorOpen} className="text-success opacity-50" />
                      <code className="fw-semibold">{item.room_number}</code>
                    </div>
                  </td>
                  <td className="small">{item.name || '-'}</td>
                  <td className="small">{getBuildingName(item.building_id)}</td>
                  <td className="small">
                    {item.floor != null ? <span><FontAwesomeIcon icon={faLayerGroup} className="me-1 text-muted" />Floor {item.floor}</span> : '-'}
                  </td>
                  <td className="small">
                    {item.capacity ? <span><FontAwesomeIcon icon={faUsers} className="me-1 text-muted" />{item.capacity}</span> : '-'}
                  </td>
                  <td>
                    <span className="badge bg-info-subtle text-info rounded-pill">{item.room_type}</span>
                  </td>
                  <td className="small">
                    <div className="d-flex flex-wrap gap-1">
                      {item.resources ? (
                        (typeof item.resources === 'string' ? item.resources.split(',').map(s => s.trim()) : (Array.isArray(item.resources) ? item.resources : [])).map((r, i) => (
                          <span key={i} className="badge bg-light text-dark rounded-pill x-small">{r}</span>
                        ))
                      ) : '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : 'secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Room' : 'Add Room'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Room Number <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.room_number}
                        onChange={e => setFormData({...formData, room_number: e.target.value})} placeholder="e.g. SCI-A-101" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Room Name</label>
                      <input type="text" className="form-control rounded-3" value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Physics Lab 1" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Building</label>
                      <select className="form-select rounded-3" value={formData.building_id}
                        onChange={e => setFormData({...formData, building_id: e.target.value})}>
                        <option value="">Select Building</option>
                        {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Floor</label>
                      <input type="number" className="form-control rounded-3" value={formData.floor}
                        onChange={e => setFormData({...formData, floor: e.target.value})} placeholder="e.g. 1" min="0" max="100" />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Capacity</label>
                      <input type="number" className="form-control rounded-3" value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 30" min="0" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Room Type</label>
                      <select className="form-select rounded-3" value={formData.room_type}
                        onChange={e => setFormData({...formData, room_type: e.target.value})}>
                        {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Resources</label>
                      <div className="d-flex flex-wrap gap-2">
                        {RESOURCE_OPTIONS.map(res => (
                          <span key={res}
                            className={`badge rounded-pill px-3 py-2 cursor-pointer ${selectedResources.includes(res) ? 'bg-primary text-white' : 'bg-light text-dark border'}`}
                            onClick={() => toggleResource(res)}
                            style={{ cursor: 'pointer', userSelect: 'none' }}>
                            {res === 'Projector' && <FontAwesomeIcon icon={faDesktop} className="me-1" />}
                            {res === 'SmartBoard' && <FontAwesomeIcon icon={faChalkboard} className="me-1" />}
                            {res === 'AC' && <FontAwesomeIcon icon={faWind} className="me-1" />}
                            {selectedResources.includes(res) ? ' ✓' : ' +'}
                          </span>
                        ))}
                      </div>
                      {formData.resources && (
                        <div className="mt-2">
                          <small className="text-muted">Selected: {formData.resources}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faDoorOpen} className="me-2" />{editItem ? 'Update Room' : 'Save Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .x-small { font-size: 11px; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Rooms;
