import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRobot, 
  faBell, 
  faUsers, 
  faBolt, 
  faCalendarAlt, 
  faHeartbeat, 
  faThumbtack,
  faCircle,
  faPaperclip,
  faCommentDots,
  faCheckCircle,
  faPlus,
  faUserPlus,
  faUpload,
  faVideo,
  faArrowRight,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

const PanelSection = ({ title, children, icon, action }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
        {icon && <FontAwesomeIcon icon={icon} className="text-primary opacity-75" style={{ fontSize: '0.9rem' }} />}
        {title}
      </h6>
      {action && (
        <button className="btn btn-link text-muted p-0 text-decoration-none x-small fw-bold">
          {action}
        </button>
      )}
    </div>
    {children}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`card border-0 shadow-sm rounded-4 mb-3 transition-all hover-lift ${className}`} 
       style={{ 
         background: 'white', 
         border: '1px solid rgba(0,0,0,0.03)',
         borderRadius: '18px'
       }}>
    <div className="card-body p-3">
      {children}
    </div>
  </div>
);

const TmsRightSidePanel = () => {
  return (
    <div className="tms-right-panel ps-xl-2">
      
      {/* 1. AI INSIGHTS PANEL */}
      <PanelSection title="AI Insights" icon={faRobot}>
        <Card className="bg-primary-subtle border-primary border-opacity-10">
          <div className="d-flex gap-3 align-items-start">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '32px', height: '32px' }}>
              <FontAwesomeIcon icon={faRobot} size="sm" />
            </div>
            <div>
              <div className="small fw-bold text-primary mb-1">Critical Insight</div>
              <p className="x-small text-dark mb-2 opacity-75">3 tasks may miss deadlines based on current velocity. Consider reassigning resources.</p>
              <div className="d-flex gap-2">
                <span className="badge rounded-pill bg-danger-subtle text-danger x-small">High Risk</span>
                <span className="badge rounded-pill bg-primary-subtle text-primary x-small">Optimization</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="x-small fw-bold text-muted">Team Productivity</span>
            <span className="x-small fw-bold text-success">+12%</span>
          </div>
          <div className="progress rounded-pill" style={{ height: '6px' }}>
            <div className="progress-bar bg-success" style={{ width: '72%' }}></div>
          </div>
        </Card>
      </PanelSection>

      {/* 2. RECENT ACTIVITY FEED */}
      <PanelSection title="Recent Activity" icon={faBolt} action="View All">
        <div className="activity-feed">
          {[
            { user: 'Ahmed', action: 'completed', target: 'Dashboard UI', time: '2m ago', avatar: 'A', color: '#8b5cf6' },
            { user: 'Sarah', action: 'uploaded', target: '3 files', time: '15m ago', avatar: 'S', color: '#10b981', icon: faPaperclip },
            { user: 'Ali', action: 'commented on', target: 'Sprint #4', time: '1h ago', avatar: 'A', color: '#f59e0b', icon: faCommentDots }
          ].map((act, i) => (
            <div key={i} className="d-flex gap-3 mb-3 position-relative activity-item">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white fw-bold shadow-sm" 
                style={{ width: '36px', height: '36px', backgroundColor: act.color, fontSize: '0.75rem' }}
              >
                {act.avatar}
              </div>
              <div className="flex-grow-1 border-bottom pb-2">
                <div className="x-small">
                  <span className="fw-bold text-dark">{act.user}</span>
                  <span className="text-muted ms-1">{act.action}</span>
                  <span className="fw-medium text-primary ms-1">{act.target}</span>
                </div>
                <div className="x-small text-muted mt-1 d-flex align-items-center gap-1">
                   {act.icon && <FontAwesomeIcon icon={act.icon} className="opacity-50" />}
                   {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PanelSection>

      {/* 3. SMART NOTIFICATIONS */}
      <PanelSection title="Smart Notifications" icon={faBell}>
        <Card className="border-start border-4 border-danger">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="x-small fw-bold text-danger mb-1">Deadline Alert</div>
              <p className="x-small mb-0 text-dark opacity-75">API Integration is due in 2 hours.</p>
            </div>
            <div className="pulse-dot bg-danger"></div>
          </div>
        </Card>
        <Card>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
              <FontAwesomeIcon icon={faCheckCircle} size="xs" />
            </div>
            <div className="x-small fw-medium">5 approvals pending your review</div>
            <FontAwesomeIcon icon={faChevronRight} className="ms-auto x-small text-muted" />
          </div>
        </Card>
      </PanelSection>

      {/* 4. ONLINE TEAM MEMBERS */}
      <PanelSection title="Team Online" icon={faUsers}>
        <div className="row g-2 mb-3">
          {[
            { name: 'John Doe', role: 'Dev', status: 'online', color: 'success' },
            { name: 'Jane Smith', role: 'Design', status: 'away', color: 'warning' },
            { name: 'Mike Ross', role: 'PM', status: 'online', color: 'success' },
            { name: 'Rachel Z', role: 'QA', status: 'offline', color: 'secondary' }
          ].map((member, i) => (
            <div key={i} className="col-12">
              <div className="d-flex align-items-center gap-2 p-2 rounded-3 hover-bg-light transition-all cursor-pointer">
                <div className="position-relative">
                  <div className="rounded-circle bg-dark-subtle d-flex align-items-center justify-content-center fw-bold text-white x-small" style={{ width: '32px', height: '32px' }}>
                    {member.name.charAt(0)}
                  </div>
                  <div 
                    className={`position-absolute bottom-0 end-0 border border-white rounded-circle bg-${member.color}`} 
                    style={{ width: '10px', height: '10px' }}
                  ></div>
                </div>
                <div className="flex-grow-1">
                  <div className="x-small fw-bold text-dark mb-0">{member.name}</div>
                  <div className="x-small text-muted" style={{ fontSize: '0.65rem' }}>{member.role}</div>
                </div>
                <button className="btn btn-sm btn-light rounded-circle" style={{ width: '28px', height: '28px', padding: 0 }}>
                  <FontAwesomeIcon icon={faCommentDots} size="xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </PanelSection>

      {/* 5. QUICK ACTIONS */}
      <PanelSection title="Quick Actions" icon={faBolt}>
        <div className="row g-2">
          {[
            { label: 'New Task', icon: faPlus, color: 'primary' },
            { label: 'Invite', icon: faUserPlus, color: 'success' },
            { label: 'Upload', icon: faUpload, color: 'info' },
            { label: 'Meeting', icon: faVideo, color: 'warning' }
          ].map((action, i) => (
            <div key={i} className="col-6">
              <button className={`btn btn-light w-100 p-3 rounded-4 border-0 shadow-sm d-flex flex-column align-items-center gap-2 transition-all hover-lift-lg group`}>
                <div className={`rounded-circle bg-${action.color}-subtle text-${action.color} d-flex align-items-center justify-content-center transition-all group-hover-bounce`} style={{ width: '40px', height: '40px' }}>
                  <FontAwesomeIcon icon={action.icon} />
                </div>
                <span className="x-small fw-bold text-dark opacity-75">{action.label}</span>
              </button>
            </div>
          ))}
        </div>
      </PanelSection>

      {/* 6. UPCOMING MEETINGS */}
      <PanelSection title="Upcoming Events" icon={faCalendarAlt} action="Calendar">
        <Card className="mb-2">
          <div className="d-flex gap-3">
            <div className="text-center p-2 rounded-3 bg-light-subtle" style={{ minWidth: '45px' }}>
              <div className="x-small fw-bold text-primary">MAY</div>
              <div className="h5 fw-bold mb-0">24</div>
            </div>
            <div>
              <div className="x-small fw-bold text-dark">Sprint Planning</div>
              <div className="x-small text-muted mb-2">10:00 AM - 11:30 AM</div>
              <div className="d-flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-circle border border-white bg-dark-subtle d-flex align-items-center justify-content-center x-small text-white" style={{ width: '24px', height: '24px', marginLeft: i > 1 ? '-8px' : 0 }}>
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="btn btn-primary w-100 btn-sm rounded-pill mt-3 fw-bold x-small">Join Now</button>
        </Card>
      </PanelSection>

      {/* 7. WORKSPACE HEALTH */}
      <PanelSection title="Workspace Health" icon={faHeartbeat}>
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-3">
             <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-success-subtle p-2">
                   <FontAwesomeIcon icon={faHeartbeat} className="text-success x-small" />
                </div>
                <div>
                   <div className="x-small fw-bold text-dark">Productivity Score</div>
                   <div className="x-small text-muted">Based on last 7 days</div>
                </div>
             </div>
             <div className="h4 fw-bold text-success mb-0">92</div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Task Completion', value: 85, color: 'primary' },
              { label: 'Team Activity', value: 70, color: 'info' }
            ].map((metric, i) => (
              <div key={i} className="mb-2">
                <div className="d-flex justify-content-between x-small mb-1">
                  <span>{metric.label}</span>
                  <span className="fw-bold">{metric.value}%</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '4px' }}>
                  <div className={`progress-bar bg-${metric.color}`} style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </PanelSection>

      {/* 8. PINNED ITEMS */}
      <PanelSection title="Favorites" icon={faThumbtack}>
        <div className="list-group list-group-flush border-0">
          {[
            { name: 'Design Sprint', type: 'Project' },
            { name: 'CEO Dashboard', type: 'Analytics' },
            { name: 'Finance Workspace', type: 'Management' }
          ].map((item, i) => (
            <div key={i} className="list-group-item px-0 py-2 border-0 bg-transparent d-flex align-items-center justify-content-between transition-all hover-translate-x cursor-pointer">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-2 bg-light p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <FontAwesomeIcon icon={faThumbtack} className="text-muted x-small" />
                </div>
                <div>
                  <div className="x-small fw-bold text-dark">{item.name}</div>
                  <div className="x-small text-muted" style={{ fontSize: '0.65rem' }}>{item.type}</div>
                </div>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="x-small text-muted opacity-0 transition-all group-hover-opacity-100" />
            </div>
          ))}
        </div>
      </PanelSection>

      <style>{`
        .tms-right-panel {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .x-small { font-size: 0.75rem; }
        .bg-primary-subtle { background-color: rgba(139, 92, 246, 0.1) !important; }
        .bg-success-subtle { background-color: rgba(16, 185, 129, 0.1) !important; }
        .bg-info-subtle { background-color: rgba(14, 165, 233, 0.1) !important; }
        .bg-warning-subtle { background-color: rgba(245, 158, 11, 0.1) !important; }
        .bg-danger-subtle { background-color: rgba(239, 68, 68, 0.1) !important; }
        
        .text-primary { color: #8b5cf6 !important; }
        .text-success { color: #10b981 !important; }
        .text-info { color: #0ea5e9 !important; }
        .text-warning { color: #f59e0b !important; }
        .text-danger { color: #ef4444 !important; }

        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important; }
        .hover-lift-lg:hover { transform: translateY(-8px); box-shadow: 0 15px 35px -10px rgba(0,0,0,0.15) !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .hover-translate-x:hover { transform: translateX(5px); }
        .hover-translate-x:hover .opacity-0 { opacity: 1 !important; }

        .group:hover .group-hover-bounce { transform: translateY(-5px); }
        
        .-space-x-2 > div { margin-left: -8px; }
        .-space-x-2 > div:first-child { margin-left: 0; }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .activity-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 17px;
          top: 36px;
          bottom: -12px;
          width: 2px;
          background: #f1f5f9;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

export default TmsRightSidePanel;
