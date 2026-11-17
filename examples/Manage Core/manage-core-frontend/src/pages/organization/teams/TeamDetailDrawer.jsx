import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle, faClock, faUsers, faBriefcase, faMessage, faFileLines } from '@fortawesome/free-solid-svg-icons';

const TeamDetailDrawer = ({ isOpen, onClose, team }) => {
  if (!team) return null;

  return (
    <>
      <div 
        className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} 
        style={{ 
          visibility: isOpen ? 'visible' : 'hidden', 
          width: '500px',
          borderLeft: '1px solid #f1f5f9',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
        }}
        tabIndex="-1"
      >
        <div className="offcanvas-header border-bottom py-3 px-4 bg-light">
          <div className="d-flex align-items-center gap-3">
             <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                style={{ width: 48, height: 48, backgroundColor: '#6366f1', fontSize: '16px' }}
              >
                {team.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h5 className="offcanvas-title fw-bold text-dark mb-0">{team.name}</h5>
                <span className="badge bg-primary-subtle text-primary x-small rounded-pill">{team.department}</span>
              </div>
          </div>
          <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Close"></button>
        </div>
        
        <div className="offcanvas-body p-0">
          <div className="p-4 border-bottom bg-white">
            <div className="row g-3">
              <div className="col-6">
                <div className="text-muted x-small fw-bold text-uppercase mb-1">Team Lead</div>
                <div className="fw-medium text-dark">{team.manager}</div>
              </div>
              <div className="col-6">
                <div className="text-muted x-small fw-bold text-uppercase mb-1">Status</div>
                <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill">{team.status}</span>
              </div>
              <div className="col-6">
                <div className="text-muted x-small fw-bold text-uppercase mb-1">Created Date</div>
                <div className="fw-medium text-dark">{new Date(team.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="col-6">
                <div className="text-muted x-small fw-bold text-uppercase mb-1">Total Members</div>
                <div className="fw-medium text-dark">{team.memberCount} Members</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-bottom">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-primary small" />
              Members & Availability
            </h6>
            <div className="d-flex flex-column gap-3">
              {team.members?.map(member => (
                <div key={member.id} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                      style={{ width: 32, height: 32, backgroundColor: member.color, fontSize: 10 }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="fw-medium small text-dark">{member.name}</div>
                      <div className="text-muted" style={{ fontSize: 10 }}>Software Engineer</div>
                    </div>
                  </div>
                  <span className="badge bg-success border-0 rounded-circle p-1" style={{ width: 8, height: 8 }} title="Available"></span>
                </div>
              ))}
            </div>
            <button className="btn btn-light btn-sm w-100 mt-3 fw-bold text-primary">View All Members</button>
          </div>

          <div className="p-4 border-bottom bg-light-subtle">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faBriefcase} className="text-info small" />
              Assigned Projects
            </h6>
            <div className="list-group list-group-flush rounded-3 border">
              {[1, 2, 3].map(i => (
                <div key={i} className="list-group-item bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold small text-dark">Enterprise Portal Redesign</div>
                    <span className="badge bg-info-subtle text-info x-small">75%</span>
                  </div>
                  <div className="progress" style={{ height: 4 }}>
                    <div className="progress-bar bg-info" style={{ width: '75%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
             <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faFileLines} className="text-secondary small" />
              Shared Documents
            </h6>
            <div className="d-flex flex-column gap-2">
              <div className="p-2 rounded border bg-white d-flex align-items-center gap-3">
                <div className="rounded bg-danger-subtle text-danger p-2"><FontAwesomeIcon icon={faFileLines} /></div>
                <div className="flex-grow-1">
                  <div className="fw-medium small">Team_Policy_v2.pdf</div>
                  <div className="text-muted" style={{ fontSize: 10 }}>2.4 MB • Updated yesterday</div>
                </div>
              </div>
              <div className="p-2 rounded border bg-white d-flex align-items-center gap-3">
                <div className="rounded bg-primary-subtle text-primary p-2"><FontAwesomeIcon icon={faBriefcase} /></div>
                <div className="flex-grow-1">
                  <div className="fw-medium small">Q2_Roadmap.xlsx</div>
                  <div className="text-muted" style={{ fontSize: 10 }}>1.8 MB • Updated 3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="offcanvas-footer border-top p-3 bg-white">
          <div className="d-flex gap-2">
            <button className="btn btn-primary flex-grow-1 fw-bold"><FontAwesomeIcon icon={faMessage} className="me-2" /> Open Team Chat</button>
            <button className="btn btn-outline-secondary px-3"><FontAwesomeIcon icon={faClock} /></button>
          </div>
        </div>
      </div>
      {isOpen && <div className="offcanvas-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>}
    </>
  );
};

export default TeamDetailDrawer;
