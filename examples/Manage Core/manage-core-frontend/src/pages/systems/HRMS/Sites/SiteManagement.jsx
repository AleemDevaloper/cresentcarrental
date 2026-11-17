import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faLocationDot, 
  faEarthAmericas, 
  faQrcode, 
  faEdit, 
  faTrash,
  faSave,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { listSites } from "../../../../api/hrms";
import { apiRequest } from "../../../../api/client";

const SiteManagement = () => {
  const { addNotification } = useApp();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    radius: 100,
  });

  const fetchSites = async () => {
    setLoading(true);
    try {
      const data = await listSites();
      setSites(data);
    } catch (err) {
      addNotification("Failed to fetch sites", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSite) {
        await apiRequest(`/api/v1/sites/${editingSite.id}`, {
          method: "PATCH",
          body: formData,
        });
        addNotification("Site updated successfully", "success");
      } else {
        await apiRequest("/api/v1/sites", {
          method: "POST",
          body: formData,
        });
        addNotification("Site created successfully", "success");
      }
      setShowModal(false);
      setEditingSite(null);
      setFormData({ name: "", address: "", latitude: "", longitude: "", radius: 100 });
      fetchSites();
    } catch (err) {
      addNotification("Error saving site", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      try {
        await apiRequest(`/api/v1/sites/${id}`, { method: "DELETE" });
        addNotification("Site deleted", "success");
        fetchSites();
      } catch (err) {
        addNotification("Error deleting site", "danger");
      }
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Site & Location Management</h4>
          <p className="text-muted small mb-0">Manage enterprise locations and geofencing rules</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => { setShowModal(true); setEditingSite(null); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Site
        </button>
      </div>

      <div className="row g-4">
        {sites.map(site => (
          <div key={site.id} className="col-md-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary-subtle p-3 rounded-4">
                    <FontAwesomeIcon icon={faLocationDot} className="text-primary fs-4" />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light btn-sm rounded-circle" onClick={() => { setEditingSite(site); setFormData(site); setShowModal(true); }}>
                      <FontAwesomeIcon icon={faEdit} className="text-secondary" />
                    </button>
                    <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleDelete(site.id)}>
                      <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </button>
                  </div>
                </div>
                <h6 className="fw-bold mb-1">{site.name}</h6>
                <p className="small text-muted mb-3"><FontAwesomeIcon icon={faEarthAmericas} className="me-1" /> {site.address || "No address provided"}</p>
                
                <div className="bg-light rounded-3 p-3 mt-auto">
                  <div className="row g-2">
                    <div className="col-6">
                      <p className="x-small text-muted mb-0 uppercase fw-bold ls-1">Geofence</p>
                      <p className="small mb-0 fw-bold">{site.radius} Meters</p>
                    </div>
                    <div className="col-6">
                      <p className="x-small text-muted mb-0 uppercase fw-bold ls-1">QR Code</p>
                      <p className="small mb-0 fw-bold">{site.qr_code ? 'Assigned' : 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {sites.length === 0 && !loading && (
          <div className="col-12 text-center py-5">
            <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
              <FontAwesomeIcon icon={faLocationDot} className="fs-1 text-muted opacity-50" />
            </div>
            <p className="text-muted">No sites registered yet. Add your first location to enable geofencing.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-white py-3 border-0">
                <h5 className="modal-title fw-bold">{editingSite ? 'Edit Site' : 'Add New Site'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Site Name</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Headquarters" />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Address</label>
                      <textarea className="form-control rounded-3" rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Business Ave..."></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Latitude</label>
                      <input type="number" step="any" className="form-control rounded-3" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} placeholder="34.0522" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Longitude</label>
                      <input type="number" step="any" className="form-control rounded-3" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} placeholder="-118.2437" />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Geofence Radius (Meters)</label>
                      <input type="number" className="form-control rounded-3" value={formData.radius} onChange={e => setFormData({...formData, radius: e.target.value})} placeholder="100" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
