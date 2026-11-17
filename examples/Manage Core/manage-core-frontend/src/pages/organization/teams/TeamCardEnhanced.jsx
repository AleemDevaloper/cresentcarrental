import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faEye,
  faPen,
  faUserPlus,
  faFileExport,
  faTrash,
  faBriefcase,
  faCheckCircle,
  faClock,
  faUsers,
  faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import TeamMemberAvatars from './TeamMemberAvatars';

const TeamCardEnhanced = ({ team, onAction, onOpenDrawer }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Busy': return 'bg-warning';
      case 'At Risk': return 'bg-danger';
      case 'On Hold': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity > 90) return 'bg-danger';
    if (capacity > 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="col-lg-4 col-md-6 col-12 mb-4">
      <div 
        className="card border-0 shadow-sm h-100 team-card transition hover-lift position-relative" 
        style={{ borderRadius: 16, border: '1px solid #F1F5F9', cursor: 'pointer' }}
        onClick={() => onOpenDrawer(team)}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>{team.name}</h5>
              <div className="d-flex align-items-center gap-2 mt-2">
                 <span className={`badge ${getStatusColor(team.status)} text-white x-small px-2 py-1 rounded-pill`}>{team.status}</span>
                 <span className="text-muted x-small fw-bold">{team.department}</span>
              </div>
            </div>
            
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                <li><button className="dropdown-item py-2" onClick={() => onAction('view', team)}><FontAwesomeIcon icon={faEye} className="me-2 text-primary opacity-75" /> View Team</button></li>
                <li><button className="dropdown-item py-2" onClick={() => onAction('edit', team)}><FontAwesomeIcon icon={faPen} className="me-2 text-info opacity-75" /> Edit Team</button></li>
                <li><button className="dropdown-item py-2" onClick={() => onAction('assign_members', team)}><FontAwesomeIcon icon={faUserPlus} className="me-2 text-success opacity-75" /> Assign Members</button></li>
                <li><button className="dropdown-item py-2" onClick={() => onAction('assign_projects', team)}><FontAwesomeIcon icon={faBriefcase} className="me-2 text-warning opacity-75" /> Assign Projects</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item py-2 text-danger" onClick={() => onAction('archive', team)}><FontAwesomeIcon icon={faTrash} className="me-2 opacity-75" /> Archive Team</button></li>
              </ul>
            </div>
          </div>

          <div className="mb-4 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted x-small fw-bold text-uppercase mb-1">Team Lead</div>
              <div className="fw-medium small text-dark">{team.manager}</div>
            </div>
            <div className="text-end">
               <div className="text-muted x-small fw-bold text-uppercase mb-1">{team.memberCount} Members</div>
               <TeamMemberAvatars members={team.members} totalCount={team.memberCount} />
            </div>
          </div>

          <div className="row g-2 mb-4 border-top border-bottom py-3">
            <div className="col-4 text-center">
              <div className="text-muted" style={{ fontSize: 10 }}>Projects</div>
              <div className="fw-bold text-dark">{team.activeProjects}</div>
            </div>
            <div className="col-4 text-center border-start border-end">
              <div className="text-muted" style={{ fontSize: 10 }}>Open Tasks</div>
              <div className="fw-bold text-dark">{team.openTasks}</div>
            </div>
            <div className="col-4 text-center">
              <div className="text-muted" style={{ fontSize: 10 }}>Attendance</div>
              <div className="fw-bold text-dark">{team.attendance}%</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted x-small fw-bold text-uppercase">Productivity</span>
              <span className="fw-bold text-dark x-small">{team.productivityPercent}%</span>
            </div>
            <div className="progress" style={{ height: 6, borderRadius: 3 }}>
              <div className="progress-bar bg-primary transition-width" style={{ width: `${team.productivityPercent}%` }}></div>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted x-small fw-bold text-uppercase">Capacity Used</span>
              <span className="fw-bold text-dark x-small">{team.capacity}%</span>
            </div>
            <div className="progress" style={{ height: 6, borderRadius: 3 }}>
              <div className={`progress-bar ${getCapacityColor(team.capacity)} transition-width`} style={{ width: `${team.capacity}%` }}></div>
            </div>
          </div>

          <div className="mt-3">
             <div className="text-muted x-small fw-bold text-uppercase mb-2">Top Skills</div>
             <div className="d-flex flex-wrap gap-1">
               {team.skills?.slice(0, 3).map(skill => (
                 <span key={skill} className="badge bg-light text-muted x-small fw-medium border">{skill}</span>
               ))}
               {team.skills?.length > 3 && <span className="badge bg-light text-muted x-small fw-medium border">+{team.skills.length - 3}</span>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCardEnhanced;
