import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserPlus, 
  faListCheck, 
  faCircleCheck, 
  faClock,
  faBuilding,
  faFileContract,
  faPlus,
  faFilter,
  faEllipsisVertical,
  faMagnifyingGlass,
  faChevronRight,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { 
  listOnboardingProcesses, 
  listOnboardingChecklists,
  createOnboardingProcess,
  updateOnboardingProgress 
} from "../../../../api/hrms";

const OnboardingPortal = () => {
  const { addNotification, theme } = useApp();
  const [onboardings, setOnboardings] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [onbRes, chkRes] = await Promise.all([
        listOnboardingProcesses(),
        listOnboardingChecklists()
      ]);
      setOnboardings(onbRes);
      setChecklists(chkRes);
    } catch (err) {
      addNotification("Failed to fetch onboarding data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleItem = async (index) => {
    const currentCompleted = selectedOnboarding.completed_items || [];
    let newCompleted;
    
    if (currentCompleted.includes(index)) {
      newCompleted = currentCompleted.filter(i => i !== index);
    } else {
      newCompleted = [...currentCompleted, index];
    }

    const totalItems = selectedOnboarding.checklist?.items?.length || 0;
    const newStatus = newCompleted.length === totalItems ? 'completed' : 'in_progress';

    try {
      const updated = await updateOnboardingProgress(selectedOnboarding.id, {
        completed_items: newCompleted,
        status: newStatus
      });
      addNotification("Progress updated", "success");
      
      // Update local state
      const updatedList = onboardings.map(o => o.id === updated.id ? { ...o, ...updated } : o);
      setOnboardings(updatedList);
      setSelectedOnboarding({ ...selectedOnboarding, ...updated });
    } catch (err) {
      addNotification("Error updating progress", "danger");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-success text-white';
      case 'in_progress': return 'bg-primary text-white';
      default: return 'bg-warning text-dark';
    }
  };

  if (selectedOnboarding) {
      const items = selectedOnboarding.checklist?.items || [];
      const completedCount = selectedOnboarding.completed_items?.length || 0;
      const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

      return (
          <div className="p-3 p-lg-4 animate-fade-in">
              <button className="btn btn-link text-decoration-none p-0 mb-4 text-muted" onClick={() => setSelectedOnboarding(null)}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Overview
              </button>

              <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                      <div className="avatar-lg bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 60, height: 60 }}>
                          {selectedOnboarding.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1">{selectedOnboarding.user?.name}</h4>
                        <p className="text-muted mb-0">{selectedOnboarding.checklist?.name} • Joined {new Date(selectedOnboarding.started_at).toLocaleDateString()}</p>
                      </div>
                  </div>
                  <div className="text-end" style={{ width: '200px' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="x-small fw-bold">Overall Progress</span>
                          <span className="x-small fw-bold text-primary">{Math.round(progress)}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }}></div>
                      </div>
                  </div>
              </div>

              <div className="row g-4">
                  <div className="col-lg-8">
                      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                          <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                              <h6 className="fw-bold mb-0">Onboarding Checklist Tasks</h6>
                              <span className="badge bg-light text-muted border px-3 py-2 rounded-pill small">
                                  {completedCount} / {items.length} Tasks Completed
                              </span>
                          </div>
                          <div className="card-body p-4">
                              <div className="d-flex flex-column gap-3">
                                  {items.map((item, idx) => (
                                      <div key={idx} className={`p-3 border rounded-4 d-flex align-items-center gap-3 transition hover-lift ${selectedOnboarding.completed_items?.includes(idx) ? 'bg-success bg-opacity-10 border-success-subtle' : 'bg-light bg-opacity-50'}`}>
                                          <div className="form-check fs-4 mb-0">
                                              <input 
                                                className="form-check-input cursor-pointer shadow-none" 
                                                type="checkbox" 
                                                checked={selectedOnboarding.completed_items?.includes(idx)} 
                                                onChange={() => handleToggleItem(idx)}
                                              />
                                          </div>
                                          <div className="flex-grow-1">
                                              <div className="d-flex justify-content-between align-items-center mb-1">
                                                  <h6 className={`fw-bold mb-0 small ${selectedOnboarding.completed_items?.includes(idx) ? 'text-decoration-line-through text-muted' : ''}`}>
                                                      {item.title}
                                                  </h6>
                                                  <span className="badge bg-white text-muted border x-small">{item.responsible_dept}</span>
                                              </div>
                                              <p className="x-small text-muted mb-0">{item.description}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="col-lg-4">
                      <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                          <div className="card-body p-4 text-center">
                              <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                                  <FontAwesomeIcon icon={faFileContract} className="fs-2 text-primary" />
                              </div>
                              <h6 className="fw-bold">Policy Documents</h6>
                              <p className="small text-muted mb-4">Sharing the company policies and culture handbook.</p>
                              <button className="btn btn-primary w-100 rounded-3 small py-2">Share Onboarding Kit</button>
                          </div>
                      </div>

                      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                          <div className="card-body p-4">
                              <h6 className="fw-bold mb-3 small uppercase text-muted">Recent Activity</h6>
                              <div className="d-flex flex-column gap-3">
                                  <div className="d-flex gap-3">
                                      <div className="p-2 bg-light rounded-circle small"><FontAwesomeIcon icon={faCircleCheck} className="text-success" /></div>
                                      <div>
                                          <p className="small mb-0 fw-bold">Checklist Started</p>
                                          <p className="x-small text-muted">{new Date(selectedOnboarding.started_at).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="p-3 p-lg-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Employee Onboarding</h4>
          <p className="text-muted small mb-0">Manage the integration of new hires into the company</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4 shadow-sm">
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Start New Onboarding
        </button>
      </div>

      <div className="row g-4">
          {onboardings.map(onb => {
              const items = onb.checklist?.items || [];
              const completedCount = onb.completed_items?.length || 0;
              const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;
              
              return (
                  <div key={onb.id} className="col-md-6 col-xl-4">
                      <div className={`card border-0 shadow-sm rounded-4 hover-lift transition ${isDark ? 'bg-dark border-1 border-secondary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedOnboarding(onb)}>
                          <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div className="d-flex align-items-center gap-2">
                                      <div className="avatar bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>
                                          {onb.user?.name?.charAt(0)}
                                      </div>
                                      <div>
                                          <h6 className="fw-bold mb-0 text-dark-emphasis small">{onb.user?.name}</h6>
                                          <span className="x-small text-muted">{onb.checklist?.name}</span>
                                      </div>
                                  </div>
                                  <span className={`badge rounded-pill x-small ${getStatusBadge(onb.status)}`}>{onb.status.toUpperCase()}</span>
                              </div>

                              <div className="mt-4">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                      <span className="x-small text-muted">Progress</span>
                                      <span className="x-small fw-bold text-primary">{Math.round(progress)}%</span>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                      <div className="progress-bar rounded-pill" style={{ width: `${progress}%` }}></div>
                                  </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-4">
                                  <div className="x-small text-muted">
                                      <FontAwesomeIcon icon={faClock} className="me-1" />
                                      Started {new Date(onb.started_at).toLocaleDateString()}
                                  </div>
                                  <FontAwesomeIcon icon={faChevronRight} className="text-muted x-small" />
                              </div>
                          </div>
                      </div>
                  </div>
              );
          })}
          {onboardings.length === 0 && !loading && (
              <div className="col-12 text-center py-5">
                  <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                      <FontAwesomeIcon icon={faUserPlus} className="fs-1 text-muted opacity-50" />
                  </div>
                  <p className="text-muted">No active onboarding processes. Start one for your new hires!</p>
              </div>
          )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        .transition { transition: all 0.3s ease; }
        .cursor-pointer { cursor: pointer; }
        .ls-1 { letter-spacing: 0.5px; }
      `}} />
    </div>
  );
};

export default OnboardingPortal;
