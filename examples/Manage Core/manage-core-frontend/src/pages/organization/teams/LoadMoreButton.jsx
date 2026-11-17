import React from 'react';

const LoadMoreButton = ({ onClick, loading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="text-center py-4">
      <button
        type="button"
        className="btn btn-dark fw-bold px-4 transition hover-lift"
        style={{ height: 44, borderRadius: 8, minWidth: 160 }}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
