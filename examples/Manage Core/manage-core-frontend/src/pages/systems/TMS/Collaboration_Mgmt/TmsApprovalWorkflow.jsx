import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faHistory,
  faClock,
  faUserShield,
  faProjectDiagram,
  faSearch,
  faCheck,
  faTimes,
  faChevronRight,
  faPlay,
  faEye,
  faFileSignature,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { listApprovals, processApproval } from '../../../../api/tms';

const RequestCard = ({ request, isDark, styles, onApprove, onReject }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'in_review':
      case 'under review': return '#f59e0b';
      case 'escalated': return '#8b5cf6';
      default: return '#6366f1';
    }
  };

  return (
    <div className={`card border-0 mb-3 rounded-4 shadow-sm transition-all hover-lift ${isDark ? 'bg-dark-card text-white' : 'bg-white text-dark'}`}
         style={{ border: styles.border }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
             <div className={`rounded-4 d-flex align-items-center justify-content-center shadow-sm`}
                  style={{ width: '48px', height: '48px', backgroundColor: `${getStatusColor(request.status)}1a`, color: getStatusColor(request.status) }}>
               <FontAwesomeIcon icon={faFileSignature} className="fs-5" />
             </div>
             <div>
                <div className={`small fw-bold ${styles.textMain}`}>{request.title}</div>
                <div className={`x-small ${styles.textMuted}`}>Submitted by {request.user || request.submitted_by} • {request.time || request.submitted_at}</div>
             </div>
          </div>
          <span className={`badge rounded-pill px-3 py-2 x-small fw-bold`} style={{ backgroundColor: `${getStatusColor(request.status)}1a`, color: getStatusColor(request.status) }}>
            {request.status}
          </span>
        </div>

        <p className={`small mb-4 ${isDark ? 'text-white-50' : 'text-secondary'}`}>{request.description}</p>

        <div className={`p-3 rounded-4 mb-4 ${isDark ? 'bg-white bg-opacity-5' : 'bg-light bg-opacity-50'}`}>
           <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="x-small fw-bold opacity-75">Current Stage: {request.current_stage || request.currentStage}</span>
              <span className="x-small fw-bold text-primary">Stage {request.stage || 3}/{request.total_stages || 5}</span>
           </div>
           <div className="progress rounded-pill" style={{ height: '6px' }}>
              <div className="progress-bar bg-primary" style={{ width: `${((request.stage || 3) / (request.total_stages || 5)) * 100}%` }}></div>
           </div>
        </div>

        <div className="d-flex gap-2">
           <button onClick={() => onApprove(request)} className="btn btn-success btn-sm rounded-pill px-3 fw-bold x-small flex-grow-1 shadow-sm">
              <FontAwesomeIcon icon={faCheck} className="me-1" /> Approve
           </button>
           <button onClick={() => onReject(request)} className="btn btn-danger btn-sm rounded-pill px-3 fw-bold x-small flex-grow-1 shadow-sm">
              <FontAwesomeIcon icon={faTimes} className="me-1" /> Reject
           </button>
           <button className={`btn btn-sm rounded-pill px-3 fw-bold x-small border ${isDark ? 'bg-white bg-opacity-5 border-white border-opacity-10 text-white' : 'bg-white border-secondary border-opacity-10 text-dark'}`}>
              <FontAwesomeIcon icon={faEye} className="me-1" /> View Details
           </button>
        </div>
      </div>
    </div>
  );
};

const TmsApprovalWorkflow = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('pending');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listApprovals({ status: filter });
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to fetch approvals', err);
      setError(err.response?.data?.message || err.message || 'Failed to load approvals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleAction = async (request, action) => {
    try {
      await processApproval(request.id, { action });
      addNotification(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`, 'success');
      fetchData();
    } catch (err) {
      console.error('Failed to process approval', err);
      addNotification(err.response?.data?.message || 'Failed to process approval.', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" size="2x" />
        <p className="text-danger mb-3">{error}</p>
        <button className="btn btn-primary rounded-pill px-4" onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const styles = {
    cardBg: isDark ? 'bg-dark-card' : 'bg-white',
    textMain: isDark ? 'text-white' : 'text-dark',
    textMuted: isDark ? 'text-white-50' : 'text-muted',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
    subtleBg: isDark ? 'bg-dark-subtle-custom' : 'bg-light-subtle-custom',
  };

  const pipelineStages = data?.pipeline_stages || [
    { name: 'Submission', status: 'completed' },
    { name: 'Dept Lead', status: 'completed' },
    { name: 'Finance', status: 'active' },
    { name: 'Director', status: 'pending' },
    { name: 'Execution', status: 'pending' }
  ];
  const requests = data?.requests || [
    {
      id: 1,
      title: 'Infrastructure Scale-up Q3',
      user: 'Ali Raza',
      time: '2 hours ago',
      status: 'Under Review',
      currentStage: 'Finance Approval',
      stage: 3,
      total_stages: 5,
      description: 'Request for 3 additional AWS production instances and RDS storage upgrade for the new enterprise client rollout.'
    },
    {
      id: 2,
      title: 'Annual Marketing Campaign',
      user: 'Sarah Wilson',
      time: '5 hours ago',
      status: 'Escalated',
      currentStage: 'Director Review',
      stage: 4,
      total_stages: 5,
      description: 'Approval for the digital marketing budget across LinkedIn, Google Ads, and industry-specific portals.'
    }
  ];
  const metrics = data?.metrics || {};
  const auditTrail = data?.audit_trail || [
    { user: 'Director', action: 'Approved', item: 'Q3 Laptop Procurement', time: '10m ago', color: '#10b981' },
    { user: 'Finance', action: 'Requested Info', item: 'AWS Scale-up', time: '1h ago', color: '#f59e0b' },
    { user: 'Manager', action: 'Rejected', item: 'External Training', time: '3h ago', color: '#ef4444' }
  ];

  return (
    <div className={`container-fluid py-4 fade-in approval-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className="row mb-4 align-items-center g-4">
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-4 bg-primary bg-opacity-10 p-2 text-primary">
              <FontAwesomeIcon icon={faCheckDouble} className="fs-4" />
            </div>
            <div>
              <h2 className="fw-bold mb-0">Approval Workflow</h2>
              <p className={`${styles.textMuted} mb-0`}>Automated enterprise decision pipeline and audit logs</p>
            </div>
          </div>
        </div>
        <div className="col-lg-5 text-lg-end">
          <div className="d-flex gap-2 justify-content-lg-end">
             <button className="btn btn-white rounded-pill px-4 fw-bold shadow-sm border">
                <FontAwesomeIcon icon={faProjectDiagram} className="me-2 text-primary" /> Workflow Builder
             </button>
             <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                <FontAwesomeIcon icon={faHistory} className="me-2" /> Global Audit Log
             </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className={`card border-0 rounded-5 shadow-lg mb-4 overflow-hidden ${styles.cardBg}`} style={{ border: styles.border }}>
             <div className="p-4 border-bottom bg-light bg-opacity-25">
                <h6 className="fw-bold mb-0 small text-uppercase letter-spacing-wider">Live Pipeline Visualization</h6>
             </div>
             <div className="p-5 overflow-auto">
                <div className="d-flex align-items-center justify-content-between min-w-800">
                   {pipelineStages.map((stage, i) => (
                      <React.Fragment key={i}>
                         <div className="d-flex flex-column align-items-center gap-3 position-relative" style={{ width: '120px' }}>
                            <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-lg transition-all hover-scale ${stage.status === 'completed' ? 'bg-success text-white' : (stage.status === 'active' ? 'bg-primary text-white scale-110 shadow-primary' : (isDark ? 'bg-dark border border-secondary border-opacity-25 text-white-50' : 'bg-white border text-muted'))}`}
                                 style={{ width: '48px', height: '48px', zIndex: 2 }}>
                               <FontAwesomeIcon icon={stage.status === 'completed' ? faCheck : (stage.status === 'active' ? faPlay : faClock)} />
                            </div>
                            <div className="text-center">
                               <div className={`x-small fw-bold ${styles.textMain}`}>{stage.name}</div>
                               <div className={`x-small text-uppercase fw-bold letter-spacing-wider mt-1 ${stage.status === 'completed' ? 'text-success' : (stage.status === 'active' ? 'text-primary' : styles.textMuted)}`} style={{ fontSize: '0.65rem' }}>{stage.status}</div>
                            </div>
                            {stage.status === 'active' && <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle pulse-ring" style={{ width: '60px', height: '60px' }}></div>}
                         </div>
                         {i < pipelineStages.length - 1 && (
                            <div className="flex-grow-1 px-2 mb-5">
                               <div className={`border-top-2 border-dashed ${stage.status === 'completed' ? 'border-success' : (isDark ? 'border-white border-opacity-10' : 'border-dark border-opacity-10')}`} style={{ marginTop: '24px' }}></div>
                            </div>
                         )}
                      </React.Fragment>
                   ))}
                </div>
             </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-4 px-2">
            <h5 className={`fw-bold mb-0 ${styles.textMain}`}>Pending Approvals</h5>
            <div className="d-flex gap-2">
               {[
                 { id: 'pending', label: 'Pending' },
                 { id: 'completed', label: 'Completed' },
                 { id: 'escalated', label: 'Escalated' }
               ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} className={`btn btn-sm rounded-pill px-3 border-0 transition-all ${filter === f.id ? 'btn-primary shadow-sm' : styles.textMuted}`}>
                     {f.label}
                  </button>
               ))}
            </div>
          </div>

          <div className="approval-feed pe-lg-2">
            {requests.length === 0 ? (
              <div className={`p-5 rounded-5 border-dashed text-center ${isDark ? 'opacity-50' : 'text-muted'}`}>
                 <FontAwesomeIcon icon={faCheckDouble} className="fs-1 mb-3 opacity-25" />
                 <h6 className="fw-bold mb-1">No {filter} requests</h6>
                 <p className="small mb-0">No items found in this category.</p>
              </div>
            ) : (
              requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  isDark={isDark}
                  styles={styles}
                  onApprove={(r) => handleAction(r, 'approve')}
                  onReject={(r) => handleAction(r, 'reject')}
                />
              ))
            )}

            {requests.length > 0 && (
              <div className={`p-5 rounded-5 border-dashed text-center ${isDark ? 'opacity-25' : 'text-muted'}`}>
                 <FontAwesomeIcon icon={faCheckDouble} className="fs-1 mb-3 opacity-25" />
                 <h6 className="fw-bold mb-1">No more pending items</h6>
                 <p className="small mb-0">You're all caught up with your department approvals.</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-xl-4">
           <div className={`card border-0 rounded-5 shadow-lg mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="card-body p-4 text-center">
                 <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center p-4 mb-3 text-primary" style={{ width: '100px', height: '100px' }}>
                    <div className="h2 fw-bold mb-0">{metrics.avg_approval_time || '4.2h'}</div>
                 </div>
                 <h6 className={`fw-bold mb-1 ${styles.textMain}`}>Avg. Approval Time</h6>
                 <p className={`x-small ${styles.textMuted} mb-0`}>{metrics.time_change || '15% faster than last month'}</p>

                 <div className="mt-4 pt-4 border-top">
                    <div className="row g-2">
                       <div className="col-6">
                          <div className={`p-3 rounded-4 bg-success bg-opacity-10 text-success`}>
                             <div className="h4 fw-bold mb-0">{metrics.approved ?? 28}</div>
                             <div className="x-small fw-bold">Approved</div>
                          </div>
                       </div>
                       <div className="col-6">
                          <div className={`p-3 rounded-danger bg-danger bg-opacity-10 text-danger`}>
                             <div className="h4 fw-bold mb-0">{metrics.rejected ?? 3}</div>
                             <div className="x-small fw-bold">Rejected</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className={`card border-0 rounded-5 shadow-lg ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="p-4 border-bottom">
                 <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-secondary" />
                    Live Audit Trail
                 </h6>
              </div>
              <div className="card-body p-4">
                 <div className="space-y-4">
                    {auditTrail.map((log, i) => (
                       <div key={i} className="d-flex gap-3 position-relative activity-item pb-4">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0`}
                               style={{ width: '32px', height: '32px', backgroundColor: `${log.color}20`, color: log.color, zIndex: 1 }}>
                             <FontAwesomeIcon icon={faCheck} className="x-small" />
                          </div>
                          <div>
                             <div className={`small fw-bold ${styles.textMain}`}>{log.user} {log.action}</div>
                             <div className={`x-small ${styles.textMuted}`}>{log.item}</div>
                             <div className={`x-small opacity-50 mt-1`}>{log.time}</div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="btn btn-link w-100 text-decoration-none small fw-bold text-primary mt-3">View Full Trail</button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .approval-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .bg-dark-card { background-color: #1e293b !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .hover-scale:hover { transform: scale(1.1); }
        .shadow-primary { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
        .min-w-800 { min-width: 800px; }
        .border-top-2 { border-top-width: 2px !important; }
        .border-dashed { border-style: dashed !important; }
        .pulse-ring { border: 2px solid #4f46e5; animation: pulse-primary 2s infinite; }
        @keyframes pulse-primary { 0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } }
        .space-y-4 > *:not(:last-child) { margin-bottom: 1.5rem; }
        .activity-item::after { content: ''; position: absolute; left: 15px; top: 32px; bottom: 0; width: 1px; background: rgba(0,0,0,0.05); }
        .dark-mode .activity-item::after { background: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
};

export default TmsApprovalWorkflow;
