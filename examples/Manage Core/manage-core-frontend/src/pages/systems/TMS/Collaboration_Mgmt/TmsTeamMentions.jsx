import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faSearch,
  faCheckDouble,
  faReply,
  faPaperPlane,
  faSmile,
  faTasks,
  faFileAlt,
  faCheckCircle,
  faRobot,
  faEllipsisV,
  faChevronRight,
  faBolt,
  faMagic,
  faCalendarAlt,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { listMentions } from '../../../../api/tms';

const MentionCard = ({ mention, isDark, styles }) => {
  const getContextIcon = (type) => {
    switch(type) {
      case 'task': return faTasks;
      case 'file': return faFileAlt;
      case 'approval': return faCheckCircle;
      default: return faAt;
    }
  };

  const getContextColor = (type) => {
    switch(type) {
      case 'task': return '#4f46e5';
      case 'file': return '#0ea5e9';
      case 'approval': return '#10b981';
      default: return '#8b5cf6';
    }
  };

  const userName = mention.user?.name || 'Unknown User';
  const userAvatar = mention.user?.avatar || userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`card mb-3 rounded-4 transition-all hover-lift ${isDark ? 'bg-dark-card text-white' : 'bg-white text-dark'}`}
      style={{
        borderLeft: `4px solid ${getContextColor(mention.type)}`,
        borderTop: 'var(--panel-border)',
        borderRight: 'var(--panel-border)',
        borderBottom: 'var(--panel-border)',
        boxShadow: 'var(--panel-shadow)'
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex gap-3">
          <div className="position-relative">
            <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${isDark ? 'bg-secondary' : 'bg-primary-subtle'}`} style={{ width: '48px', height: '48px' }}>
              {userAvatar}
            </div>
            {mention.user?.online && (
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
            )}
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="fw-bold me-2">{userName}</span>
                <span className={`small ${styles.textMuted}`}>mentioned you in</span>
                <span className="fw-bold ms-2 cursor-pointer hover-text-primary transition">
                  <FontAwesomeIcon icon={getContextIcon(mention.type)} className="me-1" style={{ color: getContextColor(mention.type) }} />
                  {mention.context}
                </span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className={`x-small ${styles.textMuted}`}>
                  <FontAwesomeIcon icon={faClock} className="me-1" />
                  {mention.time}
                </span>
                <button className={`btn btn-sm p-0 border-0 ${styles.textMuted} hover-text-primary`}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </div>
            </div>

            <p className={`mb-3 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ fontSize: '0.95rem' }}>
              {mention.message}
            </p>

            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2">
                {(mention.reactions || []).map((r, i) => (
                  <span key={i} className={`badge rounded-pill px-2 py-1 x-small border ${isDark ? 'bg-white bg-opacity-10 border-white border-opacity-10' : 'bg-light border-secondary border-opacity-10'} cursor-pointer hover-bg-light transition`}>
                    {r.emoji} {r.count}
                  </span>
                ))}
                <button className={`btn btn-sm rounded-pill x-small border ${isDark ? 'bg-white bg-opacity-10 border-white border-opacity-10 text-white' : 'bg-light border-secondary border-opacity-10 text-muted'} hover-bg-light transition`}>
                  <FontAwesomeIcon icon={faSmile} />
                </button>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-sm rounded-pill px-3 fw-bold x-small btn-primary shadow-sm hover-lift">
                  <FontAwesomeIcon icon={faReply} className="me-1" /> Reply
                </button>
                <button className={`btn btn-sm rounded-pill px-3 fw-bold x-small border ${isDark ? 'bg-white bg-opacity-10 border-white border-opacity-10 text-white' : 'bg-light border-secondary border-opacity-10 text-dark'} hover-lift`}>
                  Mark Read
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TmsTeamMentions = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listMentions({ filter });
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to fetch mentions', err);
      setError(err.response?.data?.message || err.message || 'Failed to load mentions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

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
    glass: isDark ? 'glass-dark' : 'glass-light',
  };

  const mentions = data?.mentions || [];
  const filterCategories = data?.filter_categories || [
    { id: 'all', label: 'All Mentions', icon: faAt, color: '#6366f1', count: 12 },
    { id: 'task', label: 'Tasks', icon: faTasks, color: '#4f46e5', count: 5 },
    { id: 'file', label: 'Files', icon: faFileAlt, color: '#0ea5e9', count: 3 },
    { id: 'approval', label: 'Approvals', icon: faCheckCircle, color: '#10b981', count: 2 },
    { id: 'unread', label: 'Unread Only', icon: faBolt, color: '#f59e0b', count: 3 }
  ];
  const aiSummary = data?.ai_summary || 'You have 3 unread mentions from the last 24 hours. Sarah needs help with API responses, and Emma is waiting for your budget approval.';
  const unreadCount = data?.unread_count ?? 3;
  const onlineUsers = data?.online_users || [];
  const typingUser = data?.typing_user || null;
  const collaborators = data?.collaborators || ['SW', 'AR', 'EW', 'HK'];
  const additionalCount = data?.additional_online ?? 8;

  return (
    <div className={`container-fluid py-4 fade-in mentions-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className="row mb-4 align-items-end g-4">
        <div className="col-lg-6">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="rounded-4 bg-primary bg-opacity-10 p-2 text-primary">
              <FontAwesomeIcon icon={faAt} className="fs-4" />
            </div>
            <div>
              <h2 className="fw-bold mb-0">Team Mentions</h2>
              <p className={`${styles.textMuted} mb-0`}>Stay updated with conversations and requests</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
            <div className="input-group rounded-pill border overflow-hidden shadow-sm" style={{ maxWidth: '300px' }}>
              <span className={`input-group-text border-0 ${isDark ? 'bg-dark' : 'bg-white'} ${styles.textMuted}`}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control border-0 shadow-none ${isDark ? 'bg-dark text-white' : 'bg-white text-dark'}`} placeholder="Search mentions..." />
            </div>
            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
              <FontAwesomeIcon icon={faCheckDouble} className="me-2" /> Mark All Read
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-4 col-lg-5">
          <div className={`card border-0 rounded-5 mb-4 shadow-lg overflow-hidden ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className="p-4" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
              <div className="d-flex align-items-center gap-2 text-white mb-3">
                <FontAwesomeIcon icon={faRobot} className="fs-5" />
                <h5 className="fw-bold mb-0">AI Mention Summary</h5>
              </div>
              <p className="text-white text-opacity-75 small mb-0">
                {aiSummary.split(/(\d+\s*unread mentions)/).map((part, i) =>
                  part.match(/unread mentions/) ? <span key={i} className="fw-bold text-white">{unreadCount} unread mentions</span> : <span key={i}>{part}</span>
                )}
              </p>
            </div>
            <div className="p-4">
              <h6 className={`fw-bold mb-3 ${styles.textMain}`}>Filter Categories</h6>
              <div className="space-y-2">
                {filterCategories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`d-flex align-items-center justify-content-between p-3 rounded-4 cursor-pointer transition-all ${filter === item.id ? (isDark ? 'bg-white bg-opacity-10' : 'bg-primary bg-opacity-10') : 'hover-bg-light'}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: `${item.color}20`, color: item.color }}>
                        <FontAwesomeIcon icon={item.icon} className="small" />
                      </div>
                      <span className={`fw-bold small ${filter === item.id ? 'text-primary' : styles.textMain}`}>{item.label}</span>
                    </div>
                    <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary x-small px-2">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`card border-0 rounded-5 shadow-lg ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className="p-4">
              <h6 className={`fw-bold mb-3 ${styles.textMain}`}>Active Collaboration</h6>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="d-flex -space-x-2">
                  {collaborators.slice(0, 4).map((c, i) => (
                    <div key={i} className="rounded-circle border border-2 border-white bg-dark-subtle d-flex align-items-center justify-content-center x-small text-white shadow-sm" style={{ width: '32px', height: '32px' }}>
                      {c}
                    </div>
                  ))}
                  <div className="rounded-circle border border-2 border-white bg-primary d-flex align-items-center justify-content-center x-small text-white fw-bold shadow-sm" style={{ width: '32px', height: '32px' }}>+{additionalCount}</div>
                </div>
                <span className={`x-small fw-bold ms-2 ${styles.textMuted}`}>{onlineUsers.length || 12} people online</span>
              </div>

              {typingUser && (
                <div className={`p-3 rounded-4 backdrop-blur border shadow-sm mb-3 ${isDark ? 'bg-white bg-opacity-5 border-white border-opacity-10' : 'bg-light bg-opacity-50 border-white'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-warning p-2 shadow-sm pulse-dot-warning"></div>
                    <div>
                      <div className={`x-small fw-bold ${styles.textMain}`}>{typingUser.name || 'Ali'} is typing...</div>
                      <div className={`x-small ${styles.textMuted}`}>in {typingUser.context || 'Backend Refactor'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-7">
          <div className="d-flex align-items-center justify-content-between mb-4 px-2">
            <h5 className={`fw-bold mb-0 ${styles.textMain}`}>
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
              Recent Activity
            </h5>
            <div className="dropdown">
              <button className={`btn btn-sm border-0 ${styles.textMuted} fw-bold`}>
                Sort by: Newest <FontAwesomeIcon icon={faChevronRight} className="ms-1 x-small rotate-90" />
              </button>
            </div>
          </div>

          <div className="mentions-feed pe-lg-2" style={{ maxHeight: '800px', overflowY: 'auto' }}>
            {mentions.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FontAwesomeIcon icon={faAt} size="3x" className="opacity-25 mb-3" />
                <p>No mentions found for this filter.</p>
              </div>
            ) : (
              mentions.map((mention) => (
                <MentionCard key={mention.id} mention={mention} isDark={isDark} styles={styles} />
              ))
            )}

            {mentions.length > 0 && (
              <div className="text-center py-5">
                <div className={`x-small fw-bold ${styles.textMuted} text-uppercase letter-spacing-wider`}>Yesterday</div>
                <hr className={`mx-auto ${isDark ? 'border-white opacity-10' : 'border-dark opacity-10'}`} style={{ width: '100px' }} />
              </div>
            )}

            {(data?.yesterday_mentions || []).map((mention) => (
              <MentionCard key={mention.id} mention={mention} isDark={isDark} styles={styles} />
            ))}
          </div>
        </div>
      </div>

      <div className="position-fixed bottom-0 end-0 p-4 me-xl-5 mb-xl-4 z-3" style={{ maxWidth: '600px', width: '90%' }}>
        <div className={`card border-0 rounded-pill shadow-2xl p-2 ${isDark ? 'bg-dark border border-white border-opacity-10' : 'bg-white'}`}>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-primary bg-opacity-10 p-2 text-primary ms-2">
              <FontAwesomeIcon icon={faMagic} />
            </div>
            <input
              type="text"
              className={`form-control border-0 shadow-none bg-transparent ${isDark ? 'text-white' : 'text-dark'}`}
              placeholder="Ask AI to draft a reply or type here..."
            />
            <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: '45px', height: '45px' }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .mentions-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .bg-dark-card { background-color: #1e293b !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .backdrop-blur { backdrop-filter: blur(20px); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .hover-text-primary:hover { color: #4f46e5 !important; }
        .rotate-90 { transform: rotate(90deg); }
        .-space-x-2 > div { margin-left: -8px; }
        .-space-x-2 > div:first-child { margin-left: 0; }
        .mentions-feed::-webkit-scrollbar { width: 6px; }
        .mentions-feed::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .dark-mode .mentions-feed::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }

        .pulse-dot-warning {
          width: 8px; height: 8px; border-radius: 50%;
          background-color: #f59e0b;
          animation: pulse-warning 2s infinite;
        }
        @keyframes pulse-warning {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
      `}</style>
    </div>
  );
};

export default TmsTeamMentions;
