import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrophy, 
  faBullseye, 
  faChartLine, 
  faStar,
  faPlus,
  faCircleCheck,
  faClock,
  faTriangleExclamation,
  faEllipsisVertical,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { 
  getPerformanceStats, 
  listPerformanceGoals, 
  listPerformanceReviews,
  updatePerformanceGoalProgress 
} from "../../../../api/hrms";

const PerformancePortal = () => {
  const { addNotification, currentUser, theme } = useApp();
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, goalsData, reviewsData] = await Promise.all([
        getPerformanceStats(),
        listPerformanceGoals(),
        listPerformanceReviews()
      ]);
      setStats(statsData);
      setGoals(goalsData);
      setReviews(reviewsData);
    } catch (err) {
      addNotification("Failed to fetch performance data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProgress = async (goalId, newProgress) => {
    try {
      await updatePerformanceGoalProgress(goalId, { progress: newProgress });
      addNotification("Goal progress updated", "success");
      fetchData();
    } catch (err) {
      addNotification("Error updating progress", "danger");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-subtle text-success border-success-subtle';
      case 'in_progress': return 'bg-primary-subtle text-primary border-primary-subtle';
      case 'not_started': return 'bg-secondary-subtle text-secondary border-secondary-subtle';
      case 'on_hold': return 'bg-warning-subtle text-warning border-warning-subtle';
      default: return 'bg-light text-muted border-light';
    }
  };

  return (
    <div className="p-3 p-lg-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Performance Portal</h4>
          <p className="text-muted small mb-0">Track your goals, OKRs, and professional growth</p>
        </div>
        <div className="d-flex gap-2">
            <button className="btn btn-primary rounded-3 px-4 shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> New Goal
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Goals', value: stats?.total_goals || 0, icon: faBullseye, color: 'primary' },
          { label: 'Completed', value: stats?.completed_goals || 0, icon: faCircleCheck, color: 'success' },
          { label: 'Avg Progress', value: `${stats?.avg_progress || 0}%`, icon: faChartLine, color: 'info' },
          { label: 'Latest Rating', value: stats?.latest_rating || 'N/A', icon: faStar, color: 'warning' },
        ].map((stat, i) => (
          <div key={i} className="col-md-3">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`bg-${stat.color}-subtle p-3 rounded-3 text-${stat.color}`}>
                  <FontAwesomeIcon icon={stat.icon} className="fs-5" />
                </div>
                <div>
                  <p className="x-small text-muted mb-0 fw-bold uppercase ls-1">{stat.label}</p>
                  <h4 className="mb-0 fw-bold">{stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Active Goals Section */}
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
            <div className="card-header bg-transparent py-3 px-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Active Goals & OKRs</h6>
            </div>
            <div className="card-body p-4 pt-0">
              <div className="d-flex flex-column gap-3">
                {goals.map(goal => (
                  <div key={goal.id} className="p-3 border rounded-4 hover-lift transition">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className={`badge rounded-pill x-small mb-1 ${getStatusBadge(goal.status)}`}>
                            {goal.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <h6 className="fw-bold mb-1">{goal.title}</h6>
                        <p className="x-small text-muted mb-0">{goal.description}</p>
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-light btn-sm rounded-circle border-0" data-bs-toggle="dropdown">
                          <FontAwesomeIcon icon={faEllipsisVertical} className="text-muted" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="x-small fw-bold">Progress</span>
                        <span className="x-small fw-bold text-primary">{Math.round(goal.progress)}%</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar rounded-pill" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <div className="d-flex gap-3">
                            <div className="x-small text-muted">
                                <FontAwesomeIcon icon={faClock} className="me-1" />
                                {new Date(goal.end_date).toLocaleDateString()}
                            </div>
                            <div className={`x-small fw-bold text-${goal.priority === 'urgent' ? 'danger' : 'muted'}`}>
                                <FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />
                                {goal.priority.toUpperCase()}
                            </div>
                        </div>
                        <div className="avatar-group d-flex">
                            <div className="avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center x-small" style={{ width: 24, height: 24 }} title={goal.user?.name}>
                                {goal.user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
                {goals.length === 0 && !loading && (
                    <div className="text-center py-5">
                        <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                            <FontAwesomeIcon icon={faBullseye} className="fs-1 text-muted opacity-50" />
                        </div>
                        <p className="text-muted">No active goals found. Set your first goal today!</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="col-xl-5">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
                <div className="card-header bg-transparent py-3 px-4 border-0">
                    <h6 className="mb-0 fw-bold">Performance Reviews</h6>
                </div>
                <div className="card-body p-4 pt-0">
                    <div className="d-flex flex-column gap-3">
                        {reviews.map(review => (
                            <div key={review.id} className="p-3 border rounded-4 bg-light bg-opacity-10">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h6 className="fw-bold mb-0">{review.review_cycle}</h6>
                                        <span className="x-small text-muted">{new Date(review.review_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-end">
                                        <div className="h5 fw-bold text-warning mb-0">{review.rating} / 5.0</div>
                                        <span className={`badge rounded-pill x-small ${review.status === 'finalized' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                            {review.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mb-2">
                                    <p className="x-small fw-bold text-muted mb-1">STRENGTHS</p>
                                    <p className="x-small mb-0 text-truncate-2">{review.strengths || 'No comments provided.'}</p>
                                </div>

                                <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
                                    <div className="avatar-xs rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center x-small" style={{ width: 20, height: 20 }}>
                                        {review.reviewer?.name?.charAt(0)}
                                    </div>
                                    <span className="x-small text-muted">Reviewed by <strong>{review.reviewer?.name}</strong></span>
                                </div>
                            </div>
                        ))}
                        {reviews.length === 0 && !loading && (
                            <div className="text-center py-5">
                                <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                    <FontAwesomeIcon icon={faTrophy} className="fs-1 text-muted opacity-50" />
                                </div>
                                <p className="text-muted">No performance reviews available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .transition { transition: all 0.2s ease-in-out; }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ls-1 { letter-spacing: 0.5px; }
      `}} />
    </div>
  );
};

export default PerformancePortal;
