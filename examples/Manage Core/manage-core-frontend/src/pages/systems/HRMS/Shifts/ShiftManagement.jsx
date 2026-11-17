import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faClock, 
  faCalendarWeek, 
  faEdit, 
  faTrash,
  faSave,
  faToggleOn,
  faToggleOff
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { listShifts } from "../../../../api/hrms";
import { apiRequest } from "../../../../api/client";
import { EnableDisableButton } from "../../../../components/common";

const ShiftManagement = () => {
  const { addNotification } = useApp();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    start_time: "09:00",
    end_time: "18:00",
    grace_period_in: 15,
    grace_period_out: 15,
    break_duration: 60,
    is_overtime_eligible: false,
    days_of_week: [1, 2, 3, 4, 5],
  });

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const data = await listShifts();
      setShifts(data);
    } catch (err) {
      addNotification("Failed to fetch shifts", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShift) {
        await apiRequest(`/api/v1/shifts/${editingShift.id}`, {
          method: "PATCH",
          body: formData,
        });
        addNotification("Shift updated successfully", "success");
      } else {
        await apiRequest("/api/v1/shifts", {
          method: "POST",
          body: formData,
        });
        addNotification("Shift created successfully", "success");
      }
      setShowModal(false);
      setEditingShift(null);
      fetchShifts();
    } catch (err) {
      addNotification("Error saving shift", "danger");
    }
  };

  const toggleDay = (day) => {
    const current = [...formData.days_of_week];
    const index = current.indexOf(day);
    if (index > -1) current.splice(index, 1);
    else current.push(day);
    setFormData({ ...formData, days_of_week: current });
  };

  const days = [
    { id: 1, label: "M" }, { id: 2, label: "T" }, { id: 3, label: "W" },
    { id: 4, label: "T" }, { id: 5, label: "F" }, { id: 6, label: "S" }, { id: 0, label: "S" }
  ];

  return (
    <div className="p-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Shift Management</h4>
          <p className="text-muted small mb-0">Configure working hours and attendance rules</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => { setShowModal(true); setEditingShift(null); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Shift
        </button>
      </div>

      <div className="row g-4">
        {shifts.map(shift => (
          <div key={shift.id} className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success-subtle p-3 rounded-4">
                      <FontAwesomeIcon icon={faClock} className="text-success fs-4" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{shift.name}</h6>
                      <p className="x-small text-muted mb-0">{shift.start_time} - {shift.end_time}</p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light btn-sm rounded-circle" onClick={() => { setEditingShift(shift); setFormData(shift); setShowModal(true); }}>
                      <FontAwesomeIcon icon={faEdit} className="text-secondary" />
                    </button>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-4">
                    <div className="p-2 bg-light rounded-3 text-center">
                      <p className="x-small text-muted mb-0">Grace In</p>
                      <p className="small mb-0 fw-bold">{shift.grace_period_in}m</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 bg-light rounded-3 text-center">
                      <p className="x-small text-muted mb-0">Break</p>
                      <p className="small mb-0 fw-bold">{shift.break_duration}m</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 bg-light rounded-3 text-center">
                      <p className="x-small text-muted mb-0">OT</p>
                      <p className="small mb-0 fw-bold">{shift.is_overtime_eligible ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-1 justify-content-center">
                  {days.map(d => (
                    <div key={d.id} className={`p-1 rounded-circle d-flex align-items-center justify-content-center ${shift.days_of_week?.includes(d.id) ? 'bg-primary text-white' : 'bg-light text-muted opacity-50'}`} style={{ width: 28, height: 28, fontSize: '10px' }}>
                      {d.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-white py-3 border-0">
                <h5 className="modal-title fw-bold">{editingShift ? 'Edit Shift' : 'Create New Shift'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Shift Name</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Morning Shift" />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Start Time</label>
                      <input type="time" className="form-control rounded-3" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">End Time</label>
                      <input type="time" className="form-control rounded-3" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Grace In (Min)</label>
                      <input type="number" className="form-control rounded-3" value={formData.grace_period_in} onChange={e => setFormData({...formData, grace_period_in: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Grace Out (Min)</label>
                      <input type="number" className="form-control rounded-3" value={formData.grace_period_out} onChange={e => setFormData({...formData, grace_period_out: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Break (Min)</label>
                      <input type="number" className="form-control rounded-3" value={formData.break_duration} onChange={e => setFormData({...formData, break_duration: e.target.value})} />
                    </div>

                    <div className="col-12 mt-4">
                      <label className="small fw-bold text-muted mb-3 d-block">Working Days</label>
                      <div className="d-flex gap-2">
                        {days.map(d => (
                          <button 
                            key={d.id} 
                            type="button" 
                            className={`btn rounded-3 px-3 py-2 flex-grow-1 ${formData.days_of_week?.includes(d.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => toggleDay(d.id)}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                       <EnableDisableButton
                         checked={formData.is_overtime_eligible}
                         onClick={() => setFormData({...formData, is_overtime_eligible: !formData.is_overtime_eligible})}
                         label="Eligible for Overtime"
                       />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save Shift Rules
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

export default ShiftManagement;
