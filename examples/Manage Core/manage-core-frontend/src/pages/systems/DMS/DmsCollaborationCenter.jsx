import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import {
  listCollaborationDiscussions, createDiscussion, addDiscussionReply,
  listCollaborationTasks, updateCollaborationTask,
  listDocuments
} from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments, faUsers, faBell, faClock,
  faPaperclip, faUserPlus, faSearch, faAt,
  faTasks, faPaperPlane, faEye, faReply,
  faThumbtack, faMessage, faPlus,
  faSpinner, faExclamationTriangle, faRedo, faFile
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const DmsCollaborationCenter = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);

  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const [updatingTask, setUpdatingTask] = useState(null);

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: faComments },
    { id: 'mentions', label: 'Mentions', icon: faAt },
    { id: 'tasks', label: 'Tasks', icon: faTasks },
    { id: 'reviews', label: 'Document Reviews', icon: faEye },
    { id: 'activity', label: 'Activity Feed', icon: faBell },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      fetchDiscussions();
      fetchTasks();
    } else {
      setDiscussions([]);
      setTasks([]);
    }
  }, [selectedDocId]);

  const fetchDocuments = async () => {
    try {
      const data = await listDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  const fetchDiscussions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCollaborationDiscussions(selectedDocId);
      setDiscussions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch discussions', err);
      setError('Failed to load discussions.');
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await listCollaborationTasks(selectedDocId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      setTasks([]);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      addNotification('Please fill in title and content.', 'warning');
      return;
    }
    setCreating(true);
    try {
      await createDiscussion(selectedDocId, { title: newTitle, content: newContent });
      addNotification('Discussion created.', 'success');
      setShowNewModal(false);
      setNewTitle('');
      setNewContent('');
      fetchDiscussions();
    } catch (err) {
      addNotification('Failed to create discussion.', 'danger');
    } finally {
      setCreating(false);
    }
  };

  const handleAddReply = async (discussionId) => {
    if (!replyText.trim()) {
      addNotification('Please enter a reply.', 'warning');
      return;
    }
    setSendingReply(true);
    try {
      await addDiscussionReply(discussionId, { content: replyText });
      addNotification('Reply added.', 'success');
      setReplyText('');
      fetchDiscussions();
    } catch (err) {
      addNotification('Failed to add reply.', 'danger');
    } finally {
      setSendingReply(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    setUpdatingTask(taskId);
    try {
      await updateCollaborationTask(taskId, { status: newStatus });
      addNotification('Task updated.', 'success');
      fetchTasks();
    } catch (err) {
      addNotification('Failed to update task.', 'danger');
    } finally {
      setUpdatingTask(null);
    }
  };

  const extractMentions = () => {
    const result = [], re = /@(\w+(?:\s+\w+)?)/g;
    discussions.forEach(d => {
      [{ src: d, prefix: 'd' }, ...(d.replies || []).map(r => ({ src: r, prefix: 'r' }))].forEach(({ src, prefix }) => {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(src.content || '')) !== null)
          result.push({ id: `${prefix}${src.id}-${m.index}`, from: src.user?.name || 'Unknown', document: d.document_name || '', comment: m[0], date: src.created_at, read: false });
      });
    });
    return result;
  };

  const timeAgo = (d) => { if (!d) return ''; const m = Math.floor((new Date() - new Date(d)) / 60000); if (m < 1) return 'just now'; if (m < 60) return `${m} min ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; const days = Math.floor(h / 24); return days < 30 ? `${days}d ago` : new Date(d).toLocaleDateString(); };

  const mentions = extractMentions();

  const filteredDiscussions = discussions.filter(d =>
    !searchQuery || d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMentions = mentions.filter(m =>
    !searchQuery || m.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    !searchQuery || t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDiscussions = discussions.filter(d => d.status !== 'resolved').length;
  const unreadMentions = mentions.filter(m => !m.read).length;
  const openTasks = tasks.filter(t => t.status !== 'completed').length;
  const pendingReviews = 0;

  const getPriorityBadge = (priority) => {
    const cfg = { urgent: { bg: '#fee2e2', color: '#dc2626', label: 'Urgent' }, high: { bg: '#fef3c7', color: '#d97706', label: 'High' }, medium: { bg: '#dbeafe', color: '#2563eb', label: 'Medium' }, low: { bg: '#d1fae5', color: '#059669', label: 'Low' } };
    const c = cfg[priority] || cfg.medium;
    return <span className="badge rounded-pill fw-bold" style={{ backgroundColor: c.bg, color: c.color, fontSize: '0.6rem' }}>{c.label}</span>;
  };

  const getStatusBadge = (status) => {
    const cfg = { active: { bg: '#d1fae5', color: '#059669', label: 'Active' }, resolved: { bg: '#e5e7eb', color: '#4b5563', label: 'Resolved' }, 'in-progress': { bg: '#dbeafe', color: '#2563eb', label: 'In Progress' }, pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' }, completed: { bg: '#d1fae5', color: '#059669', label: 'Completed' } };
    const c = cfg[status] || cfg.active;
    return <span className="badge rounded-pill fw-bold" style={{ backgroundColor: c.bg, color: c.color, fontSize: '0.6rem' }}>{c.label}</span>;
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className={`card border-0 rounded-5 overflow-hidden mb-4 shadow-lg ${isDark ? 'bg-dark' : 'bg-white'}`}>
        <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)' }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-4">
                <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm border border-white border-opacity-10">
                  <FontAwesomeIcon icon={faUsers} className="fs-3" />
                </div>
                <div>
                  <h2 className="fw-bold mb-1">Collaboration Center</h2>
                  <p className="mb-0 opacity-75">Discuss, review, and collaborate on documents with your team in real-time.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-flex gap-2 justify-content-lg-end">
                <select className="form-select rounded-pill px-4 py-2 border-0 shadow-sm text-dark fw-bold" style={{ minWidth: '200px' }} value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)}>
                  <option value="">Select a document...</option>
                  {documents.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name || `Document #${doc.id}`}</option>
                  ))}
                </select>
                <button className="btn btn-white rounded-pill px-4 py-2 fw-bold shadow-sm" disabled={!selectedDocId} onClick={() => { setShowNewModal(true); }}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />New Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {[
          { icon: faComments, bg: '#3b82f615', color: '#3b82f6', count: activeDiscussions, label: 'Active Discussions' },
          { icon: faAt, bg: '#f59e0b15', color: '#f59e0b', count: unreadMentions, label: 'Unread Mentions' },
          { icon: faTasks, bg: '#10b98115', color: '#10b981', count: openTasks, label: 'Open Tasks' },
          { icon: faEye, bg: '#8b5cf615', color: '#8b5cf6', count: pendingReviews, label: 'Pending Reviews' },
        ].map((s, i) => (
          <div key={i} className="col-xl-3 col-md-6">
            <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark' : ''}`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded-3" style={{ backgroundColor: s.bg, color: s.color }}><FontAwesomeIcon icon={s.icon} /></div>
                  <div><h3 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{s.count}</h3></div>
                </div>
                <span className="small text-muted">{s.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button key={tab.id} className={`btn btn-sm rounded-pill px-3 fw-bold border-0 transition ${activeTab === tab.id ? 'btn-primary shadow-sm' : 'btn-light'}`} onClick={() => setActiveTab(tab.id)}>
                  <FontAwesomeIcon icon={tab.icon} className="me-2" />{tab.label}
                </button>
              ))}
            </div>
            <div className="position-relative">
              <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem' }} />
              <input type="text" className="form-control border shadow-none rounded-pill ps-5 bg-light small" placeholder="Search..." style={{ width: '200px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {!selectedDocId && activeTab !== 'reviews' && activeTab !== 'activity' && (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faFile} className="fs-2 mb-3 opacity-30" />
              <p className="small mb-0">Select a document above to view its {activeTab}.</p>
            </div>
          )}
          {selectedDocId && loading && (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faSpinner} spin className="fs-2 mb-3" />
              <p className="small mb-0">Loading {activeTab}...</p>
            </div>
          )}
          {selectedDocId && error && !loading && (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faExclamationTriangle} className="fs-2 mb-3 text-danger" />
              <p className="small mb-2 text-danger">{error}</p>
              <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold" onClick={fetchDiscussions}>
                <FontAwesomeIcon icon={faRedo} className="me-1" />Retry
              </button>
            </div>
          )}

          {selectedDocId && !loading && !error && activeTab === 'discussions' && (
            <div className="d-flex flex-column gap-3">
              {filteredDiscussions.length === 0 && <div className="text-center py-4 text-muted"><p className="small mb-0">No discussions yet. Start a new one!</p></div>}
              {filteredDiscussions.map(d => (
                <div key={d.id}>
                  <div className={`p-4 rounded-4 border d-flex align-items-start gap-3 transition hover-lift-sm ${isDark ? 'border-secondary' : ''}`}
                    style={{ backgroundColor: isDark ? '#1a2332' : '#f8fafc', cursor: 'pointer' }}
                    onClick={() => setExpandedDiscussion(expandedDiscussion === d.id ? null : d.id)}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: '40px', height: '40px', backgroundColor: d.pinned ? '#fef3c7' : '#eef2ff', color: d.pinned ? '#d97706' : '#6366f1', fontSize: '0.85rem' }}>
                      <FontAwesomeIcon icon={d.pinned ? faThumbtack : faMessage} />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                        <h6 className="fw-bold mb-0 text-truncate" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{d.title}</h6>
                        {getStatusBadge(d.status || 'active')}
                      </div>
                      <p className="small text-muted mb-2"><FontAwesomeIcon icon={faPaperclip} className="me-1" />{d.document_name || 'Unknown document'}</p>
                      <div className="d-flex align-items-center gap-3 small text-muted">
                        <span><FontAwesomeIcon icon={faUserPlus} className="me-1" />{d.user?.name || 'Unknown'}</span>
                        <span><FontAwesomeIcon icon={faClock} className="me-1" />{timeAgo(d.created_at)}</span>
                        <span><FontAwesomeIcon icon={faReply} className="me-1" />{d.replies_count || (d.replies ? d.replies.length : 0)} replies</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-shrink-0">
                      <button className="btn btn-sm btn-light rounded-pill border-0 px-3 fw-bold" onClick={(e) => { e.stopPropagation(); setExpandedDiscussion(expandedDiscussion === d.id ? null : d.id); }}>
                        <FontAwesomeIcon icon={faEye} className="me-1" />{expandedDiscussion === d.id ? 'Collapse' : 'View'}
                      </button>
                    </div>
                  </div>
                  {expandedDiscussion === d.id && (
                    <div className={`p-4 rounded-4 border mt-2 ${isDark ? 'border-secondary bg-dark' : 'bg-white'}`}>
                      <p className="small mb-3" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{d.content}</p>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="x-small text-muted"><FontAwesomeIcon icon={faClock} className="me-1" />Created {timeAgo(d.created_at)}</span>
                      </div>
                      <h6 className="fw-bold small mb-3" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>Replies ({d.replies ? d.replies.length : 0})</h6>
                      {(d.replies || []).length === 0 && <p className="small text-muted mb-3">No replies yet.</p>}
                      {(d.replies || []).map(r => (
                        <div key={r.id} className={`p-3 rounded-3 mb-2 border ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f1f5f9' }}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="fw-bold small" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{r.user?.name || 'Unknown'}</span>
                            <span className="x-small text-muted">{timeAgo(r.created_at)}</span>
                          </div>
                          <p className="small mb-0" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{r.content}</p>
                        </div>
                      ))}
                      <div className="d-flex gap-2 mt-3">
                        <input type="text" className="form-control form-control-sm border shadow-none rounded-pill bg-light" placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                        <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold border-0" disabled={sendingReply} onClick={() => handleAddReply(d.id)}>
                          {sendingReply ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedDocId && !loading && !error && activeTab === 'mentions' && (
            <div className="d-flex flex-column gap-3">
              {filteredMentions.length === 0 && <div className="text-center py-4 text-muted"><p className="small mb-0">No mentions found.</p></div>}
              {filteredMentions.map(m => (
                <div key={m.id} className={`p-4 rounded-4 border d-flex align-items-start gap-3 ${!m.read ? 'border-primary border-opacity-25' : ''} ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: !m.read ? (isDark ? '#1e1b4b' : '#eef2ff') : (isDark ? '#1a2332' : '#f8fafc') }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold bg-primary bg-opacity-10 text-primary" style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
                    <FontAwesomeIcon icon={faAt} />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                        <span>{m.from}</span>
                        {!m.read && <span className="badge bg-primary rounded-pill ms-2" style={{ fontSize: '0.5rem' }}>NEW</span>}
                      </h6>
                      <span className="x-small text-muted">{timeAgo(m.date)}</span>
                    </div>
                    <p className="small mb-2" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{m.comment}</p>
                    {m.document && <span className="x-small text-muted"><FontAwesomeIcon icon={faPaperclip} className="me-1" />{m.document}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedDocId && !loading && !error && activeTab === 'tasks' && (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 border-0 x-small fw-bold text-uppercase text-muted">Task</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Document</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Assignee</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Due Date</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Priority</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Status</th>
                    <th className="px-4 py-3 border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 && <tr><td colSpan="7" className="text-center py-4 text-muted small">No tasks found.</td></tr>}
                  {filteredTasks.map(t => (
                    <tr key={t.id}>
                      <td className="px-4 py-3"><span className="fw-bold small" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{t.title}</span></td>
                      <td className="py-3"><span className="small text-muted">{t.document_name || 'Unknown'}</span></td>
                      <td className="py-3"><span className="small">{t.assignee || 'Unassigned'}</span></td>
                      <td className="py-3"><span className="small text-muted">{t.due_date ? t.due_date.split('T')[0] : '-'}</span></td>
                      <td className="py-3">{getPriorityBadge(t.priority)}</td>
                      <td className="py-3">
                        <select className={`form-select form-select-sm border shadow-none rounded-pill ${isDark ? 'bg-dark text-light border-secondary' : 'bg-light'}`} value={t.status || 'pending'} disabled={updatingTask === t.id}
                          onChange={e => handleTaskStatusChange(t.id, e.target.value)}
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', width: 'auto' }}>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold border-0" onClick={() => addNotification('Task details feature coming soon.', 'info')}>
                          <FontAwesomeIcon icon={faEye} className="me-1" />View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'reviews' || activeTab === 'activity') && (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={activeTab === 'reviews' ? faEye : faBell} className="fs-2 mb-3 opacity-30" />
              <p className="small mb-0">{activeTab === 'reviews' ? 'No pending document reviews.' : 'No recent activity.'}</p>
            </div>)}
        </div>
      </div>

      <DialogBox show={showNewModal} onHide={() => { setShowNewModal(false); setNewTitle(''); setNewContent(''); }} title="New Discussion" size="large"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <button className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => { setShowNewModal(false); setNewTitle(''); setNewContent(''); }}>Cancel</button>
            <button className="btn btn-primary rounded-pill px-4 fw-bold" disabled={creating} onClick={handleCreateDiscussion}>
              {creating ? <><FontAwesomeIcon icon={faSpinner} spin className="me-1" />Creating...</> : <><FontAwesomeIcon icon={faPaperPlane} className="me-1" />Create Discussion</>}
            </button>
          </div>
        }>
        <div className="p-2">
          <div className="mb-3">
            <label className="form-label fw-bold small">Title</label>
            <input type="text" className="form-control border shadow-none rounded-pill" placeholder="Discussion title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Content</label>
            <textarea className="form-control border shadow-none rounded-3" rows="4" placeholder="Write your discussion content..." value={newContent} onChange={e => setNewContent(e.target.value)} />
          </div>
        </div>
      </DialogBox>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .transition { transition: all 0.2s ease; }
        .hover-lift-sm:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .btn-white { background: white; color: #1e293b; border: none; }
        .btn-white:hover { background: #f1f5f9; }
        .btn-white:disabled { opacity: 0.5; }
        ${isDark ? `.bg-light { background-color: #1e293b !important; } .text-muted { color: #94a3b8 !important; } .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; } .table { color: #f1f5f9 !important; } .table-hover tbody tr:hover { background-color: rgba(99,102,241,0.08) !important; } .form-control { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; } .form-select { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }` : ''}
      `}</style>
    </div>
  );
};

export default DmsCollaborationCenter;
