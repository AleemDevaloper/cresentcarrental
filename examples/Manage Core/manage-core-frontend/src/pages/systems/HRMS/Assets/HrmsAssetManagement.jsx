import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLaptop, 
  faMobileScreenButton, 
  faSimCard, 
  faCar, 
  faPlus, 
  faUserTag, 
  faHistory,
  faCircleCheck,
  faWrench,
  faTrash,
  faEdit,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { apiRequest } from "../../../../api/client";

const HrmsAssetManagement = () => {
  const { addNotification } = useApp();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetRes, empRes] = await Promise.all([
        apiRequest("/api/v1/assets"),
        apiRequest("/api/v1/users")
      ]);
      setAssets(assetRes.data.data);
      setEmployees(empRes.data.data);
    } catch (err) {
      addNotification("Failed to fetch asset data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (userId) => {
    try {
      await apiRequest(`/api/v1/assets/${selectedAsset.id}`, {
        method: "PATCH",
        body: { assigned_user_id: userId },
      });
      addNotification("Asset assigned successfully", "success");
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      addNotification("Error assigning asset", "danger");
    }
  };

  const getAssetIcon = (category) => {
    const name = category?.toLowerCase() || "";
    if (name.includes("laptop")) return faLaptop;
    if (name.includes("mobile") || name.includes("phone")) return faMobileScreenButton;
    if (name.includes("sim")) return faSimCard;
    if (name.includes("vehicle") || name.includes("car")) return faCar;
    return faLaptop;
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.asset_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 p-lg-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Company Asset Inventory</h4>
          <p className="text-muted small mb-0">Track issuance and maintenance of company equipment</p>
        </div>
        <div className="d-flex gap-2">
           <div className="input-group input-group-sm rounded-3 overflow-hidden border shadow-sm" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></span>
              <input type="text" className="form-control border-0" placeholder="Search assets..." value={searchTerm} onChange={e => setSearch(e.target.value)} />
           </div>
           <button className="btn btn-primary rounded-3 px-3 shadow-sm">
             <FontAwesomeIcon icon={faPlus} className="me-2" /> Register Asset
           </button>
        </div>
      </div>

      <div className="row g-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`p-3 rounded-4 ${asset.assigned_user_id ? 'bg-primary-subtle text-primary' : 'bg-light text-muted'}`}>
                    <FontAwesomeIcon icon={getAssetIcon(asset.category?.name)} className="fs-4" />
                  </div>
                  <span className={`badge rounded-pill x-small ${asset.status === 'active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                    {asset.status.toUpperCase()}
                  </span>
                </div>
                
                <h6 className="fw-bold mb-1">{asset.name}</h6>
                <p className="x-small text-muted mb-3 fw-bold uppercase ls-1">{asset.asset_code}</p>

                <div className="bg-light rounded-3 p-3 mb-3">
                   <p className="x-small text-muted mb-1 fw-bold">ASSIGNED TO</p>
                   {asset.assigned_user_id ? (
                     <div className="d-flex align-items-center gap-2">
                        <div className="avatar bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold" style={{ width: 24, height: 24, fontSize: '10px' }}>
                          {asset.assigned_user?.name?.charAt(0)}
                        </div>
                        <span className="small fw-bold">{asset.assigned_user?.name}</span>
                     </div>
                   ) : (
                     <p className="small text-muted mb-0 italic">Unassigned</p>
                   )}
                </div>

                <div className="d-flex gap-2">
                   {!asset.assigned_user_id ? (
                     <button className="btn btn-primary btn-sm rounded-3 flex-grow-1" onClick={() => { setSelectedAsset(asset); setShowAssignModal(true); }}>
                       <FontAwesomeIcon icon={faUserTag} className="me-2" /> Assign
                     </button>
                   ) : (
                     <button className="btn btn-outline-danger btn-sm rounded-3 flex-grow-1">
                       <FontAwesomeIcon icon={faHistory} className="me-2" /> Reclaim
                     </button>
                   )}
                   <button className="btn btn-light btn-sm rounded-3 border">
                     <FontAwesomeIcon icon={faEdit} className="text-secondary" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredAssets.length === 0 && !loading && (
          <div className="col-12 text-center py-5">
            <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
              <FontAwesomeIcon icon={faLaptop} className="fs-1 text-muted opacity-50" />
            </div>
            <p className="text-muted">No assets found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal show d-block animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">Assign Asset: {selectedAsset?.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <label className="small fw-bold text-muted mb-2">Select Employee</label>
                <div className="list-group list-group-flush border rounded-3 overflow-auto" style={{ maxHeight: '300px' }}>
                  {employees.map(emp => (
                    <button 
                      key={emp.id} 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                      onClick={() => handleAssign(emp.id)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32 }}>
                          {emp.name?.charAt(0)}
                        </div>
                        <div>
                           <p className="mb-0 small fw-bold">{emp.name}</p>
                           <p className="x-small text-muted mb-0">{emp.emp_id} • {emp.role}</p>
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faPlus} className="text-primary opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowAssignModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrmsAssetManagement;
