import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faSearch, faPaperPlane, faSms, faBell,
  faExclamationTriangle, faCalendar, faUser, faUsers,
  faLayerGroup, faFilter, faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listCommunications, createCommunication } from '../../../../api/ems';

const Communication = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');

  const [sendForm, setSendForm] = useState({
    recipient_type: 'student',
    recipient_id: '',
    subject: '',
    message: '',
    type: 'email',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterDateFrom) params.date_from = filterDateFrom;
      if (filterDateTo) params.date_to = filterDateTo;
      if (recipientFilter) params.recipient = recipientFilter;
      const data = await listCommunications(params);
      setData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load communications');
    } finally {
      setLoading(false);
    }
  }, [filterType, filterDateFrom, filterDateTo, recipientFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!sendForm.subject || !sendForm.message) {
      addNotification?.('Subject and message are required', 'warning');
      return;
    }
    try {
      await createCommunication(sendForm);
      addNotification?.('Message sent successfully', 'success');
      setSendForm({ recipient_type: 'student', recipient_id: '', subject: '', message: '', type: 'email' });
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to send message', 'danger');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return faEnvelope;
      case 'sms': return faSms;
      case 'push': return faBell;
      default: return faPaperPlane;
    }
  };

  const getTypeBadge = (type) => {
    const colors = { email: 'primary', sms: 'success', push: 'warning' };
    return `bg-${colors[type] || 'secondary'}-subtle text-${colors[type] || 'secondary'}`;
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Communication Center</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Send messages to students and parents</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faPaperPlane} className="me-2 text-primary" />Send Message</h5>
            <form onSubmit={handleSend}>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">Recipient Type</label>
                <div className="d-flex gap-2">
                  {['student', 'parent', 'class', 'department'].map(rt => (
                    <button key={rt} type="button"
                      className={`btn btn-sm rounded-3 fw-semibold ${sendForm.recipient_type === rt ? 'btn-primary' : isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                      onClick={() => setSendForm({...sendForm, recipient_type: rt})}>
                      <FontAwesomeIcon icon={rt === 'student' ? faUser : rt === 'parent' ? faUsers : rt === 'class' ? faUser : faLayerGroup} className="me-1" />
                      {rt.charAt(0).toUpperCase() + rt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">Recipient</label>
                <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                  value={sendForm.recipient_id}
                  onChange={e => setSendForm({...sendForm, recipient_id: e.target.value})}>
                  <option value="">Select {sendForm.recipient_type}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">Communication Type</label>
                <div className="d-flex gap-2">
                  {['email', 'sms', 'push'].map(ct => (
                    <button key={ct} type="button"
                      className={`btn btn-sm rounded-3 fw-semibold ${sendForm.type === ct ? 'btn-primary' : isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                      onClick={() => setSendForm({...sendForm, type: ct})}>
                      <FontAwesomeIcon icon={getTypeIcon(ct)} className="me-1" />
                      {ct.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">Subject</label>
                <input type="text" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                  value={sendForm.subject}
                  onChange={e => setSendForm({...sendForm, subject: e.target.value})}
                  placeholder="Message subject..." />
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">Message</label>
                <textarea className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} rows="4"
                  value={sendForm.message}
                  onChange={e => setSendForm({...sendForm, message: e.target.value})}
                  placeholder="Type your message here..." />
              </div>
              <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-semibold">
                <FontAwesomeIcon icon={faPaperPlane} className="me-2" />Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faEnvelope} className="me-2 text-info" />Communication History</h5>

            <div className="row g-2 mb-3">
              <div className="col">
                <select className={`form-select form-select-sm rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                  value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
              </div>
              <div className="col">
                <input type="date" className={`form-control form-control-sm rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                  value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
              </div>
              <div className="col">
                <input type="date" className={`form-control form-control-sm rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                  value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
              </div>
              <div className="col-auto">
                <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => { setFilterType(''); setFilterDateFrom(''); setFilterDateTo(''); setRecipientFilter(''); }}>
                  <FontAwesomeIcon icon={faRotate} />
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-3">
                <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
              </div>
            )}

            <div className="table-responsive" style={{ maxHeight: '400px' }}>
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th>Date</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">No communications yet</td></tr>
                  ) : data.map(item => (
                    <tr key={item.id}>
                      <td className="small">{item.created_at || '-'}</td>
                      <td className="small fw-semibold">{item.recipient_name || '-'}</td>
                      <td>
                        <span className={`badge rounded-pill ${getTypeBadge(item.type)}`}>
                          <FontAwesomeIcon icon={getTypeIcon(item.type)} className="me-1" />{item.type}
                        </span>
                      </td>
                      <td className="small">{item.subject}</td>
                      <td>
                        <span className={`badge rounded-pill bg-${item.status === 'sent' ? 'success' : item.status === 'failed' ? 'danger' : 'warning'}-subtle text-${item.status === 'sent' ? 'success' : item.status === 'failed' ? 'danger' : 'warning'}`}>
                          {item.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default Communication;
