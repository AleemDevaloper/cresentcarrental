import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useApp } from '../../hooks/useApp';
import Dashmainheading from '../../components/common/Dashmainheading';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaperPlane, 
  faHistory, 
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faPlus,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import client, { clearCache } from '../../api/client';

const UserRequests = () => {
  const { theme, currentUser, addNotification } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState('new'); // new, history
  const [requestType, setRequestType] = useState('general');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.get('/approvals');
      setRequestHistory(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching request history", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      addNotification('Please wait for authentication to complete.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await client.post('/approvals', {
        type: requestType,
        reason: description,
        approvable_id: currentUser.id,
        approvable_type: 'App\\Models\\User',
        priority: 'medium'
      });
      clearCache('/approvals');
      
      setIsSubmitting(false);
      setShowSuccess(true);
      addNotification('Request sent successfully!', 'success');
      setDescription('');
      setTimeout(() => setShowSuccess(false), 5000);
      fetchHistory();
    } catch (err) {
      console.error("Error submitting request", err);
      addNotification(err.message || 'Failed to send request. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
        case 'approved': return 'bg-success-subtle text-success';
        case 'rejected': return 'bg-danger-subtle text-danger';
        case 'pending': return 'bg-warning-subtle text-warning';
        default: return 'bg-secondary-subtle text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
        case 'approved': return faCheckCircle;
        case 'rejected': return faTimesCircle;
        default: return faClock;
    }
  };

  return (
    <div className={`user-requests-page ${isDark ? 'dark-mode' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="container-fluid py-4 px-lg-5">
        
        <div className="row mb-4">
            <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-body p-0">
                        <div className="d-flex border-bottom">
                            <button 
                                className={`flex-grow-1 py-3 border-0 bg-transparent transition fw-bold ${activeSubTab === 'new' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                onClick={() => setActiveSubTab('new')}
                            >
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                {t('new_request')}
                            </button>
                            <button 
                                className={`flex-grow-1 py-3 border-0 bg-transparent transition fw-bold ${activeSubTab === 'history' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                onClick={() => setActiveSubTab('history')}
                            >
                                <FontAwesomeIcon icon={faHistory} className="me-2" />
                                {t('my_requests')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {activeSubTab === 'new' ? (
            <div className="row fade-in">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5">
                        <h4 className="fw-bold mb-4">{t('send_request_to_admin')}</h4>
                        
                        {showSuccess && (
                            <div className="alert alert-success border-0 rounded-3 d-flex align-items-center mb-4">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                {t('request_sent_success')}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase text-muted">{t('request_type')}</label>
                                <select 
                                    className="form-select border-0 bg-light p-3 rounded-3"
                                    value={requestType}
                                    onChange={(e) => setRequestType(e.target.value)}
                                >
                                    <option value="general">{t('general_support')}</option>
                                    <option value="deletion">{t('account_deletion')}</option>
                                    <option value="access">{t('access_permission_request')}</option>
                                    <option value="hardware">{t('hardware_asset_request')}</option>
                                </select>
                            </div>

                            {requestType === 'deletion' && (
                                <div className="alert alert-warning border-0 rounded-3 mb-4">
                                    <div className="d-flex gap-3">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="fs-4 mt-1" />
                                        <div>
                                            <h6 className="fw-bold mb-1">{t('critical_action')}</h6>
                                            <p className="small mb-0 opacity-75">{t('deletion_warning')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase text-muted">{t('request_description')}</label>
                                <textarea 
                                    className="form-control border-0 bg-light p-3 rounded-3" 
                                    rows="5" 
                                    placeholder={t('provide_details_placeholder')}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm transition hover-lift"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                                )}
                                {t('send_request')}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-lg-4 mt-4 mt-lg-0">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white h-100">
                        <FontAwesomeIcon icon={faEnvelope} className="fs-1 opacity-25 mb-4" />
                        <h5 className="fw-bold mb-3">{t('communication_policy')}</h5>
                        <p className="small opacity-75 mb-4">{t('policy_description')}</p>
                        <ul className="list-unstyled small opacity-75 mb-0">
                            <li className="mb-2">• {t('be_specific')}</li>
                            <li className="mb-2">• {t('attach_docs')}</li>
                            <li>• {t('urgent_matters')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden fade-in">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 border-0 text-muted small text-uppercase fw-bold">{t('request_id')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold">{t('request_type')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold">{t('date_sent')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold">{t('status')}</th>
                                <th className="pe-4 py-3 border-0 text-muted small text-uppercase fw-bold">{t('admin_note')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        {t('loading')}
                                    </td>
                                </tr>
                            ) : requestHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">{t('no_requests_found')}</td>
                                </tr>
                            ) : requestHistory.map(req => (
                                <tr key={req.id}>
                                    <td className="ps-4 py-4 fw-bold text-primary">#REQ-00{req.id}</td>
                                    <td className="text-capitalize">{req.type?.replace('_', ' ')}</td>
                                    <td className="text-muted small">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-2 ${getStatusBadge(req.status)}`}>
                                            <FontAwesomeIcon icon={getStatusIcon(req.status)} className="me-1" />
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-muted small">{req.approver_comment || t('no_notes_yet')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default UserRequests;
