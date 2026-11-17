import React, { useState, useEffect, useRef } from 'react';
import { listAttendance, clockIn, clockOut, listSites } from '../../../api/hrms';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSignInAlt, 
  faSignOutAlt, 
  faHistory, 
  faLocationDot, 
  faCamera,
  faCheckCircle,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";

const HrmsAttendance = () => {
  const { addNotification } = useApp();
  const [attendance, setAttendance] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  
  // Selection
  const [selectedSite, setSelectedSite] = useState("");
  const [gpsData, setGpsData] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  
  const fileInputRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attData, sitesData] = await Promise.all([
        listAttendance(),
        listSites()
      ]);
      setAttendance(attData);
      setSites(sitesData);
      
      const today = new Date().toISOString().split('T')[0];
      const record = attData.find(r => r.date === today);
      setTodayRecord(record);
    } catch (err) {
      addNotification("Failed to fetch data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    captureGps();
  }, []);

  const captureGps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGpsData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, (error) => {
        console.error("GPS Error:", error);
        addNotification("Please enable GPS for accurate attendance", "warning");
      });
    }
  };

  const selfiePreviewUrl = selfie ? URL.createObjectURL(selfie) : null;

  useEffect(() => {
    return () => {
      if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
    };
  }, [selfiePreviewUrl]);

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
      setSelfie(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (selectedSite) formData.append('site_id', selectedSite);
      if (gpsData) {
        formData.append('latitude', gpsData.latitude);
        formData.append('longitude', gpsData.longitude);
      }
      if (selfie) formData.append('selfie', selfie);
      formData.append('device_info', navigator.userAgent);

      await clockIn(formData);
      addNotification("Clocked in successfully", "success");
      fetchData();
      setSelfie(null);
      setSelfiePreview(null);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Error clocking in', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (gpsData) {
        formData.append('latitude', gpsData.latitude);
        formData.append('longitude', gpsData.longitude);
      }
      if (selfie) formData.append('selfie', selfie);

      await clockOut(formData);
      addNotification("Clocked out successfully", "success");
      fetchData();
      setSelfie(null);
      setSelfiePreview(null);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Error clocking out', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-portal p-3 p-lg-4 animate-fade-in">
      <div className="row g-4 mb-4">
        {/* Actions Card */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-primary text-white py-3 border-0">
              <h5 className="mb-0 fw-bold">Punch Center</h5>
            </div>
            <div className="card-body p-4 d-flex flex-column gap-3">
              
              {/* Site Selection */}
              <div className="mb-2">
                <label className="small fw-bold text-muted mb-2">Select Site / Location</label>
                <select 
                  className="form-select rounded-3" 
                  value={selectedSite} 
                  onChange={(e) => setSelectedSite(e.target.value)}
                  disabled={todayRecord && todayRecord.clock_in}
                >
                  <option value="">Default Office</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Status Info */}
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                <div className={`p-2 rounded-circle ${gpsData ? 'bg-success' : 'bg-warning'} text-white d-flex align-items-center justify-content-center`} style={{ width: 35, height: 35 }}>
                   <FontAwesomeIcon icon={faLocationDot} size="sm" />
                </div>
                <div>
                  <p className="small mb-0 fw-bold">{gpsData ? 'GPS Active' : 'GPS Offline'}</p>
                  <p className="x-small text-muted mb-0">{gpsData ? `${gpsData.latitude.toFixed(4)}, ${gpsData.longitude.toFixed(4)}` : 'Enable location for geofencing'}</p>
                </div>
              </div>

              {/* Selfie Preview */}
              {selfiePreview && (
                <div className="position-relative mx-auto mb-2">
                  <img src={selfiePreview} className="rounded-4 shadow-sm" style={{ width: 120, height: 120, objectFit: 'cover' }} alt="Selfie" />
                  <button className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-n1" onClick={() => {setSelfie(null); setSelfiePreview(null);}}>×</button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2 mt-2">
                <input type="file" accept="image/*" capture="user" className="d-none" ref={fileInputRef} onChange={handleSelfieChange} />
                <button 
                  className="btn btn-outline-primary border-dashed rounded-3 py-2"
                  onClick={() => fileInputRef.current.click()}
                  disabled={(todayRecord && todayRecord.clock_in && todayRecord.clock_out)}
                >
                  <FontAwesomeIcon icon={faCamera} className="me-2" />
                  {selfie ? 'Retake Selfie' : 'Take Selfie Verification'}
                </button>

                <div className="row g-2">
                  <div className="col-6">
                    <button 
                      className="btn btn-success w-100 rounded-3 py-3 shadow-sm d-flex flex-column align-items-center gap-1"
                      onClick={handleClockIn}
                      disabled={loading || (todayRecord && todayRecord.clock_in)}
                    >
                      <FontAwesomeIcon icon={faSignInAlt} />
                      <span className="small fw-bold">CLOCK IN</span>
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-danger w-100 rounded-3 py-3 shadow-sm d-flex flex-column align-items-center gap-1"
                      onClick={handleClockOut}
                      disabled={loading || !todayRecord || (todayRecord && todayRecord.clock_out)}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span className="small fw-bold">CLOCK OUT</span>
                    </button>
                  </div>
                </div>
              </div>

              {todayRecord && (
                <div className="mt-3 p-3 border rounded-3 text-center">
                  <p className="small text-muted mb-1">Today's Activity</p>
                  <div className="d-flex justify-content-around">
                    <div className="text-center">
                      <p className="x-small text-muted mb-0">IN</p>
                      <p className="fw-bold mb-0 text-primary">{todayRecord.clock_in || '--:--'}</p>
                    </div>
                    <div className="vr"></div>
                    <div className="text-center">
                      <p className="x-small text-muted mb-0">OUT</p>
                      <p className="fw-bold mb-0 text-danger">{todayRecord.clock_out || '--:--'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History / Status List */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent History</h5>
              <span className="badge bg-primary rounded-pill">Last 7 Days</span>
            </div>
            <div className="card-body p-0">
               <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4 small border-0">Date</th>
                      <th className="small border-0">Location</th>
                      <th className="small border-0">Time</th>
                      <th className="small border-0">Status</th>
                      <th className="pe-4 small border-0 text-end">Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map(record => (
                      <tr key={record.id}>
                        <td className="ps-4">
                          <p className="mb-0 fw-bold small">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                        </td>
                        <td>
                          <p className="mb-0 x-small text-muted">{record.site?.name || 'Main Office'}</p>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                             <span className="x-small text-primary fw-bold">In: {record.clock_in}</span>
                             <span className="x-small text-danger fw-bold">Out: {record.clock_out || '--'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge rounded-pill x-small ${record.status === 'Present' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          {record.verification_status === 'verified' ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="text-success" title="Verified" />
                          ) : (
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning" title={record.verification_notes || 'Pending'} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrmsAttendance;
