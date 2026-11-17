import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import TeamCard from './TeamCard';

const TeamGrid = ({ teams, viewMode, onAction, loading }) => {
  if (loading) {
    return (
      <div className="row g-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-lg-4 col-md-6 col-12">
            <div className="card border-0 shadow-sm placeholder-glow" style={{ borderRadius: 16, height: 320 }}>
              <div className="card-body">
                <span className="placeholder col-6 mb-3" />
                <span className="placeholder col-8 mb-4" />
                <span className="placeholder col-12 mb-2" />
                <span className="placeholder col-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <FontAwesomeIcon icon={faUsers} className="fs-1 mb-3 opacity-25 d-block mx-auto" />
        <h6 className="fw-bold text-dark">No teams found</h6>
        <p className="small mb-0">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={`row ${viewMode === 'grid' ? 'g-4' : 'g-3'}`}>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} viewMode={viewMode} onAction={onAction} />
      ))}
    </div>
  );
};

export default TeamGrid;
