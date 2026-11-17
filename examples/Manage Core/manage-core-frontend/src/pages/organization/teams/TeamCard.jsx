import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faEye,
  faPen,
  faUserPlus,
  faFileExport,
  faTrash,
  faArrowUp,
  faArrowDown,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import TeamMemberAvatars from './TeamMemberAvatars';
import ProductivityMetrics from './ProductivityMetrics';

const trendIcon = (trend) => {
  if (trend === 'up') return faArrowUp;
  if (trend === 'down') return faArrowDown;
  return faMinus;
};

const trendClass = (trend) => {
  if (trend === 'up') return 'text-success';
  if (trend === 'down') return 'text-danger';
  return 'text-muted';
};

const TeamCard = ({ team, viewMode, onAction }) => (
  <div className={viewMode === 'grid' ? 'col-lg-4 col-md-6 col-12' : 'col-12'}>
    <div className="card border-0 shadow-sm h-100 team-card transition hover-lift" style={{ borderRadius: 16, border: '1px solid #F1F5F9' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: 22, letterSpacing: '-0.5px' }}>{team.name}</h5>
            <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
              <span className="badge bg-primary-subtle text-primary x-small fw-bold px-2 py-1 rounded-pill">{team.department}</span>
              <span className={`badge bg-light text-muted x-small fw-bold rounded-pill px-2 py-1 ${trendClass(team.trend)}`}>
                <FontAwesomeIcon icon={trendIcon(team.trend)} className="me-1" />
                {team.productivityPercent}% productive
              </span>
            </div>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: 34, height: 34, backgroundColor: '#F8FAFC' }}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-muted" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
              <li>
                <button type="button" className="dropdown-item py-2 small" onClick={() => onAction('view', team)}>
                  <FontAwesomeIcon icon={faEye} className="me-2 text-primary opacity-75" /> View Details
                </button>
              </li>
              <li>
                <button type="button" className="dropdown-item py-2 small" onClick={() => onAction('edit', team)}>
                  <FontAwesomeIcon icon={faPen} className="me-2 text-info opacity-75" /> Edit Team
                </button>
              </li>
              <li>
                <button type="button" className="dropdown-item py-2 small" onClick={() => onAction('assign', team)}>
                  <FontAwesomeIcon icon={faUserPlus} className="me-2 text-success opacity-75" /> Assign Members
                </button>
              </li>
              <li>
                <button type="button" className="dropdown-item py-2 small" onClick={() => onAction('export', team)}>
                  <FontAwesomeIcon icon={faFileExport} className="me-2 text-secondary opacity-75" /> Export Data
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button type="button" className="dropdown-item py-2 small text-danger" onClick={() => onAction('delete', team)}>
                  <FontAwesomeIcon icon={faTrash} className="me-2 opacity-75" /> Delete Team
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-muted small fw-bold text-uppercase mb-2" style={{ letterSpacing: '0.5px', fontSize: 11 }}>Members :</div>
          <TeamMemberAvatars members={team.members} totalCount={team.memberCount} />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4 px-1">
          <div className="d-flex flex-column">
            <span className="text-muted x-small fw-bold text-uppercase">Efficiency Score</span>
            <strong className="text-dark fs-5">{team.efficiency}%</strong>
          </div>
          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold" style={{ fontSize: 11 }}>{team.status}</span>
        </div>

        <ProductivityMetrics team={team} />
      </div>
    </div>
  </div>
);

export default TeamCard;
