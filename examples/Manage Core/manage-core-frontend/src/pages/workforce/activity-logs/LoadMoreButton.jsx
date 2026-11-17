import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const LoadMoreButton = ({ onClick, loading, hasMore, remaining = 0 }) => {
  if (!hasMore) {
    return (
      <div className="text-center py-4">
        <span className="text-muted small d-inline-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
          You&apos;ve reached the end of the activity feed
        </span>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <button
        type="button"
        className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Loading...
          </>
        ) : (
          <>Load More{remaining > 0 && <span className="ms-2 opacity-75">({remaining} remaining)</span>}</>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
