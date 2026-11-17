import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faClock, faUser, faCalendarAlt, faTag,
  faComment, faHistory, faTasks, faListCheck, faStopwatch,
  faLink, faCheckCircle, faFile, faCog, faExclamationTriangle,
  faChartSimple, faDollarSign, faBell, faRobot,
  faArrowRight, faCopy, faArchive, faPrint, faDownload,
  faPlus,   faSearch, faEdit, faChevronLeft, faSpinner,
  faFlag, faCircle, faStar, faMessage,
  faPaperPlane, faImage, faLink as faLinkIcon, faCode, faTable,
  faBold, faItalic, faList, faQuoteRight,
  faThumbtack, faSmile, faPlay, faStop,
  faUsers, faUserPlus, faBuilding,
  faCalendarDay, faCalendarWeek, faArrowUp,
  faArrowDown, faFilter, faSort,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { updateTask } from '../../../api/pms';
import {
  listTaskTimeLogs, startTimeLog, stopTimeLog,
  listTaskActivityLogs, listTaskAttachments, uploadTaskAttachment, deleteTaskAttachment,
  addTaskTag, removeTaskTag,
} from '../../../api/tms';
import { sendAiChatMessage } from '../../../api/chat';
import { useApp } from '../../../hooks/useApp';
import TaskDocumentCenter from './TaskDocumentCenter';

const STATUSES = [
  { id: 'To Do', label: 'To Do', color: '#0ea5e9', bg: '#f0f9ff' },
  { id: 'In Progress', label: 'In Progress', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'Review', label: 'Review', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'Testing', label: 'Testing', color: '#ec4899', bg: '#fdf2f8' },
  { id: 'Approved', label: 'Approved', color: '#10b981', bg: '#f0fdf4' },
  { id: 'Completed', label: 'Completed', color: '#059669', bg: '#ecfdf5' },
  { id: 'Closed', label: 'Closed', color: '#64748b', bg: '#f8fafc' },
];

const PRIORITIES = [
  { id: 'Critical', label: 'Critical', color: '#ef4444', bg: '#fef2f2', icon: faArrowUp },
  { id: 'High', label: 'High', color: '#f59e0b', bg: '#fffbeb', icon: faArrowUp },
  { id: 'Medium', label: 'Medium', color: '#8b5cf6', bg: '#f5f3ff', icon: faArrowUp },
  { id: 'Low', label: 'Low', color: '#10b981', bg: '#f0fdf4', icon: faArrowDown },
];

const TASK_TYPES = [
  { id: 'Story', label: 'Story', color: '#10b981' },
  { id: 'Task', label: 'Task', color: '#0ea5e9' },
  { id: 'Bug', label: 'Bug', color: '#ef4444' },
  { id: 'Feature', label: 'Feature', color: '#8b5cf6' },
  { id: 'Epic', label: 'Epic', color: '#f59e0b' },
  { id: 'Improvement', label: 'Improvement', color: '#06b6d4' },
];

const TABS = [
  { id: 'description', label: 'Description', icon: faFile },
  { id: 'activity', label: 'Activity', icon: faHistory },
  { id: 'discussion', label: 'Discussion', icon: faComment },
  { id: 'subtasks', label: 'Subtasks', icon: faTasks },
  { id: 'checklist', label: 'Checklist', icon: faListCheck },
  { id: 'time', label: 'Time Logs', icon: faStopwatch },
  { id: 'dependencies', label: 'Dependencies', icon: faLink },
  { id: 'documents', label: 'Documents', icon: faFile },
  { id: 'approvals', label: 'Approvals', icon: faCheckCircle },
  { id: 'comments', label: 'Comments', icon: faMessage },
  { id: 'history', label: 'History', icon: faHistory },
  { id: 'custom', label: 'Custom Fields', icon: faCog },
  { id: 'risks', label: 'Risks', icon: faExclamationTriangle },
  { id: 'budget', label: 'Budget', icon: faDollarSign },
  { id: 'analytics', label: 'Analytics', icon: faChartSimple },
];

const PRIORITY_LABELS = { Critical: 'Critical', High: 'High', Medium: 'Medium', Low: 'Low' };

const TaskDetailModal = ({ task, show, onClose, onTaskUpdated }) => {
  const { addNotification, showErrorDialog } = useApp();
  const [activeTab, setActiveTab] = useState('description');
  const [localTask, setLocalTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [timeLogs, setTimeLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [, setEditingField] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);
  const timerInterval = useRef(null);

  const loadData = useCallback(async (t) => {
    if (!t?.id) return;
    setLocalTask(t);
    setDescription(t.description || '');

    const [tl, al, atts] = await Promise.allSettled([
      listTaskTimeLogs(t.id),
      listTaskActivityLogs(t.id),
      listTaskAttachments(t.id),
    ]);
    if (tl.status === 'fulfilled') setTimeLogs(tl.value || []);
    if (al.status === 'fulfilled') setActivityLogs(al.value || []);
    if (atts.status === 'fulfilled') setAttachments(atts.value || []);

  }, []);

  useEffect(() => {
    if (task) {
      setLocalTask(task);
      loadData(task);
      setActiveTab('description');
    }
  }, [task, loadData]);

  useEffect(() => {
    if (timerRunning) {
      timerInterval.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }
    return () => clearInterval(timerInterval.current);
  }, [timerRunning]);

  const handleUpdate = async (data) => {
    if (!localTask?.id) return;
    setSaving(true);
    try {
      const updated = await updateTask(localTask.id, data);
      setLocalTask(prev => ({ ...prev, ...updated }));
      if (onTaskUpdated) onTaskUpdated({ ...localTask, ...updated });
      addNotification('Task updated', 'success');
    } catch (err) {
      showErrorDialog('Task Update Failed', 'Could not update the task.', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStartTimer = async () => {
    try {
      const log = await startTimeLog(localTask.id, '');
      setActiveTimer(log);
      setTimerRunning(true);
      setTimerSeconds(0);
    } catch {
      addNotification('Failed to start timer', 'danger');
    }
  };

  const handleStopTimer = async () => {
    if (!activeTimer?.id) return;
    try {
      await stopTimeLog(activeTimer.id);
      setTimerRunning(false);
      setActiveTimer(null);
      setTimerSeconds(0);
      const tl = await listTaskTimeLogs(localTask.id);
      setTimeLogs(tl || []);
      addNotification('Time logged', 'success');
    } catch {
      addNotification('Failed to stop timer', 'danger');
    }
  };

  const formatTimer = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const formatDuration = (sec) => {
    if (!sec) return '0m';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadTaskAttachment(localTask.id, file);
      const atts = await listTaskAttachments(localTask.id);
      setAttachments(atts || []);
      addNotification('File uploaded', 'success');
    } catch (err) {
      showErrorDialog('Upload Failed', 'Could not upload file.', err.response?.data?.message || err.message);
    }
    e.target.value = '';
  };

  const handleDeleteAttachment = async (id) => {
    try {
      await deleteTaskAttachment(id);
      setAttachments(prev => prev.filter(a => a.id !== id));
      addNotification('Attachment deleted', 'success');
    } catch {
      addNotification('Delete failed', 'danger');
    }
  };

  if (!show || !localTask) return null;

  const statusConfig = STATUSES.find(s => s.id === localTask.status) || STATUSES[0];
  const priorityConfig = PRIORITIES.find(p => p.id === localTask.priority) || PRIORITIES[1];

  const progress = localTask.progress ?? 0;
  const isOverdue = localTask.due_date && new Date(localTask.due_date) < new Date() && localTask.status !== 'Completed' && localTask.status !== 'Closed';

  return (
    <div className="task-detail-overlay" onClick={onClose}>
      <div className="task-detail-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="td-header">
          <div className="td-header-left">
            <button className="td-back-btn" onClick={onClose}><FontAwesomeIcon icon={faChevronLeft} /></button>
            <div className="td-id-badge">TASK-{localTask.id}</div>
            <div className="td-type-badge" style={{ background: (TASK_TYPES.find(t => t.id === (localTask.type || 'Task'))?.color || '#0ea5e9') + '18', color: TASK_TYPES.find(t => t.id === (localTask.type || 'Task'))?.color || '#0ea5e9' }}>
              {localTask.type || 'Task'}
            </div>
          </div>
          <div className="td-header-right">
            <button className="td-action-btn" title="Edit" onClick={() => setEditingField('title')}><FontAwesomeIcon icon={faEdit} /></button>
            <button className="td-action-btn" title="Copy"><FontAwesomeIcon icon={faCopy} /></button>
            <button className="td-action-btn" title="Archive"><FontAwesomeIcon icon={faArchive} /></button>
            <button className="td-action-btn" title="Print"><FontAwesomeIcon icon={faPrint} /></button>
            <button className="td-action-btn" title="Export"><FontAwesomeIcon icon={faDownload} /></button>
            <button className="td-close-btn" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
          </div>
        </div>

        <div className="td-body">
          {/* Title */}
          <div className="td-title-section">
            <h1 className="td-title">{localTask.title}</h1>
          </div>

          {/* Meta Row */}
          <div className="td-meta-row">
            <div className="td-meta-group">
              <div className="td-meta-item">
                <span className="td-meta-label">Status</span>
                <div className="td-status-dropdown-wrap">
                  <button className="td-status-badge" style={{ background: statusConfig.bg, color: statusConfig.color }}
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                    <FontAwesomeIcon icon={faCircle} className="me-1" style={{ fontSize: 8 }} />{localTask.status || 'To Do'}
                  </button>
                  {showStatusDropdown && (
                    <div className="td-dropdown-menu">
                      {STATUSES.map(s => (
                        <button key={s.id} className="td-dropdown-item" style={{ color: s.color }}
                          onClick={() => { handleUpdate({ status: s.id }); setShowStatusDropdown(false); }}>
                          <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8, color: s.color }} className="me-2" />{s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="td-meta-item">
                <span className="td-meta-label">Priority</span>
                <div className="td-priority-dropdown-wrap">
                  <button className="td-priority-badge" style={{ background: priorityConfig.bg, color: priorityConfig.color }}
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}>
                    <FontAwesomeIcon icon={faFlag} className="me-1" style={{ fontSize: 10 }} />{localTask.priority || 'Medium'}
                  </button>
                  {showPriorityDropdown && (
                    <div className="td-dropdown-menu">
                      {PRIORITIES.map(p => (
                        <button key={p.id} className="td-dropdown-item" style={{ color: p.color }}
                          onClick={() => { handleUpdate({ priority: p.id }); setShowPriorityDropdown(false); }}>
                          <FontAwesomeIcon icon={faFlag} style={{ color: p.color }} className="me-2" />{p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="td-meta-item">
                <span className="td-meta-label">Type</span>
                <div className="td-type-dropdown-wrap">
                  <button className="td-type-badge-sm" style={{ background: (TASK_TYPES.find(t => t.id === (localTask.type || 'Task'))?.color || '#0ea5e9') + '15', color: TASK_TYPES.find(t => t.id === (localTask.type || 'Task'))?.color || '#0ea5e9' }}
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
                    {localTask.type || 'Task'}
                  </button>
                  {showTypeDropdown && (
                    <div className="td-dropdown-menu">
                      {TASK_TYPES.map(t => (
                        <button key={t.id} className="td-dropdown-item" style={{ color: t.color }}
                          onClick={() => { handleUpdate({ type: t.id }); setShowTypeDropdown(false); }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="td-meta-group">
              <div className="td-meta-item">
                <span className="td-meta-label">Progress</span>
                <div className="td-progress-wrap">
                  <div className="td-progress-bar">
                    <div className="td-progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? '#10b981' : '#6366f1' }}></div>
                  </div>
                  <span className="td-progress-text">{progress}%</span>
                </div>
              </div>
            </div>

            <div className="td-meta-group">
              <div className="td-meta-item">
                <span className="td-meta-label">Assignee</span>
                <div className="td-assignee-wrap">
                  <div className="td-avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {localTask.assignee?.name?.[0] || <FontAwesomeIcon icon={faUser} size="xs" />}
                  </div>
                  <span className="td-assignee-name">{localTask.assignee?.name || 'Unassigned'}</span>
                  <button className="td-inline-btn" onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}><FontAwesomeIcon icon={faEdit} size="xs" /></button>
                  {showAssigneeDropdown && (
                    <div className="td-dropdown-menu">
                      <div className="td-dropdown-item"><FontAwesomeIcon icon={faUserPlus} className="me-2" />Assign to User</div>
                      <div className="td-dropdown-item"><FontAwesomeIcon icon={faUsers} className="me-2" />Assign Team</div>
                      <div className="td-dropdown-item"><FontAwesomeIcon icon={faBuilding} className="me-2" />Assign Department</div>
                      <div className="td-dropdown-divider"></div>
                      <div className="td-dropdown-item" onClick={async () => { setShowAssigneeDropdown(false); setAiLoading('suggestion'); try { const r = await sendAiChatMessage(`Suggest the best assignee for this task: "${localTask?.title}". Consider workload and expertise. Respond with just a name.`); addNotification('AI Suggestion: ' + r.content, 'info'); } catch {} finally { setAiLoading(null); } }}><FontAwesomeIcon icon={faRobot} className="me-2" />{aiLoading === 'suggestion' ? <FontAwesomeIcon icon={faSpinner} spin /> : 'AI Suggestion'}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dates Row */}
          <div className="td-dates-row">
            <div className="td-date-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="td-date-icon" />
              <span className="td-date-label">Created</span>
              <span className="td-date-value">{localTask.created_at ? new Date(localTask.created_at).toLocaleDateString() : '-'}</span>
            </div>
            <div className="td-date-item">
              <FontAwesomeIcon icon={faCalendarDay} className="td-date-icon" />
              <span className="td-date-label">Start</span>
              <span className="td-date-value">-</span>
            </div>
            <div className="td-date-item">
              <FontAwesomeIcon icon={faCalendarWeek} className="td-date-icon" />
              <span className="td-date-label">Due</span>
              <span className="td-date-value" style={isOverdue ? { color: '#ef4444', fontWeight: 700 } : {}}>
                {localTask.due_date ? new Date(localTask.due_date).toLocaleDateString() : '-'}
                {isOverdue && <span className="td-overdue-badge">Overdue</span>}
              </span>
            </div>
            <div className="td-date-item">
              <FontAwesomeIcon icon={faClock} className="td-date-icon" />
              <span className="td-date-label">Updated</span>
              <span className="td-date-value">{localTask.updated_at ? new Date(localTask.updated_at).toLocaleDateString() : '-'}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="td-tags-row">
            <FontAwesomeIcon icon={faTag} className="text-muted me-2" style={{ fontSize: 12 }} />
            {localTask.tags?.map(tag => (
              <span key={tag.id} className="td-tag" style={{ background: (tag.color || '#6366f1') + '18', color: tag.color || '#6366f1', borderColor: (tag.color || '#6366f1') + '30' }}>
                {tag.name}
                <button className="td-tag-remove" onClick={async () => { await removeTaskTag(localTask.id, tag.id); loadData(localTask); }}>&times;</button>
              </span>
            ))}
            <button className="td-add-tag-btn" onClick={async () => {
              const name = prompt('Tag name:');
              if (name) {
                try {
                  const { createTag } = await import('../../../api/tms');
                  const newTag = await createTag({ name, color: '#6366f1' });
                  await addTaskTag(localTask.id, newTag.id);
                  loadData(localTask);
                } catch { /* ignore */ }
              }
            }}><FontAwesomeIcon icon={faPlus} size="xs" /> Add Tag</button>
          </div>

          {/* Tab Navigation */}
          <div className="td-tabs-nav">
            <div className="td-tabs-scroll">
              {TABS.map(tab => (
                <button key={tab.id}
                  className={`td-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}>
                  <FontAwesomeIcon icon={tab.icon} className="td-tab-icon" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="td-tab-content">
            {activeTab === 'description' && (
              <div className="td-desc-tab">
                <div className="td-editor-toolbar">
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faBold} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faItalic} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faList} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faCode} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faTable} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faLinkIcon} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faQuoteRight} /></button>
                  <button className="td-editor-btn"><FontAwesomeIcon icon={faImage} /></button>
                  <span className="td-editor-divider"></span>
                  <button className="td-editor-btn" title="AI Write" onClick={async () => { setAiLoading('write'); try { const r = await sendAiChatMessage(`Write a detailed description for this task: "${localTask?.title}". Include purpose, requirements, and acceptance criteria.`); setDescription(r.content); addNotification('Description generated by AI', 'success'); } catch {} finally { setAiLoading(null); } }}><FontAwesomeIcon icon={aiLoading === 'write' ? faSpinner : faRobot} spin={aiLoading === 'write'} /></button>
                </div>
                <textarea
                  className="td-desc-editor"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add task description, use @ to mention, # for links..."
                  rows={10}
                />
                <div className="td-editor-footer">
                  <span className="text-muted small">Markdown supported · @ mentions · # task links</span>
                  <button className="td-save-btn" onClick={() => handleUpdate({ description })} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Description'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="td-activity-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Activity Timeline</h6>
                  <div className="d-flex gap-2">
                    <button className="td-sm-btn"><FontAwesomeIcon icon={faFilter} /></button>
                    <button className="td-sm-btn"><FontAwesomeIcon icon={faSort} /></button>
                  </div>
                </div>
                <div className="td-activity-feed">
                  {activityLogs.length > 0 ? activityLogs.map((log, i) => (
                    <div key={log.id || i} className="td-activity-item">
                      <div className="td-activity-dot" style={{ background: log.action?.includes('status') ? '#f59e0b' : log.action?.includes('create') ? '#10b981' : '#6366f1' }}></div>
                      <div className="td-activity-line"></div>
                      <div className="td-activity-content">
                        <p className="mb-0 small">{log.description}</p>
                        <span className="td-activity-time">{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="td-empty-state"><FontAwesomeIcon icon={faHistory} className="mb-2" /><p className="mb-0">No activity recorded yet</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="td-discussion-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Discussion</h6>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="td-badge-light"><FontAwesomeIcon icon={faStar} className="me-1" />Internal</span>
                    <button className="td-sm-btn"><FontAwesomeIcon icon={faThumbtack} /></button>
                  </div>
                </div>
                <div className="td-discussion-list">
                  <div className="td-empty-state"><FontAwesomeIcon icon={faMessage} className="mb-2" /><p className="mb-0">No discussions yet</p><span className="text-muted small">Start a conversation about this task</span></div>
                </div>
                <div className="td-discussion-input">
                  <div className="td-avatar-xs" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>A</div>
                  <input type="text" className="td-chat-input" placeholder="Write a comment... Use @ to mention" />
                  <div className="td-chat-actions">
                    <button className="td-chat-btn"><FontAwesomeIcon icon={faImage} /></button>
                    <button className="td-chat-btn"><FontAwesomeIcon icon={faSmile} /></button>
                    <button className="td-chat-btn text-primary"><FontAwesomeIcon icon={faPaperPlane} /></button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subtasks' && (
              <div className="td-subtasks-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Subtasks</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="td-empty-state"><FontAwesomeIcon icon={faTasks} className="mb-2" /><p className="mb-0">No subtasks</p><button className="btn btn-primary btn-sm mt-2 rounded-pill"><FontAwesomeIcon icon={faPlus} className="me-1" />Add Subtask</button></div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="td-checklist-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Checklist</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="td-checklist-progress">
                  <div className="td-checklist-bar"><div className="td-checklist-fill" style={{ width: '0%' }}></div></div>
                  <span className="small text-muted">0/0</span>
                </div>
                <div className="td-empty-state"><FontAwesomeIcon icon={faListCheck} className="mb-2" /><p className="mb-0">Add checklist items</p></div>
              </div>
            )}

            {activeTab === 'time' && (
              <div className="td-time-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Time Tracking</h6>
                  <div className="d-flex align-items-center gap-2">
                    {timerRunning ? (
                      <button className="td-timer-btn bg-danger text-white" onClick={handleStopTimer}>
                        <FontAwesomeIcon icon={faStop} className="me-2" />{formatTimer(timerSeconds)}
                      </button>
                    ) : (
                      <button className="td-timer-btn bg-primary text-white" onClick={handleStartTimer}>
                        <FontAwesomeIcon icon={faPlay} className="me-2" />Start Timer
                      </button>
                    )}
                    <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                  </div>
                </div>
                <div className="td-time-stats">
                  <div className="td-time-stat"><span className="td-time-stat-label">Estimated</span><span className="td-time-stat-value">-</span></div>
                  <div className="td-time-stat"><span className="td-time-stat-label">Logged</span><span className="td-time-stat-value">{timeLogs.reduce((acc, l) => acc + (l.duration || 0), 0) > 0 ? formatDuration(timeLogs.reduce((acc, l) => acc + (l.duration || 0), 0)) : '0h'}</span></div>
                  <div className="td-time-stat"><span className="td-time-stat-label">Entries</span><span className="td-time-stat-value">{timeLogs.length}</span></div>
                </div>
                <div className="td-time-logs-list">
                  {timeLogs.length > 0 ? timeLogs.map((log, i) => (
                    <div key={log.id || i} className="td-time-log-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-bold small">{log.user?.name || 'Unknown'}</span>
                          <span className="text-muted ms-2" style={{ fontSize: 11 }}>{log.start_time ? new Date(log.start_time).toLocaleString() : ''}</span>
                        </div>
                        <span className="fw-bold small">{formatDuration(log.duration)}</span>
                      </div>
                      {log.note && <p className="text-muted small mb-0 mt-1">{log.note}</p>}
                    </div>
                  )) : (
                    <div className="td-empty-state"><p className="mb-0 small">No time logged yet</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'dependencies' && (
              <div className="td-deps-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Dependencies</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="td-deps-types">
                  <div className="td-dep-section">
                    <h6 className="td-dep-heading"><FontAwesomeIcon icon={faArrowRight} className="me-2 text-danger" />Blocks</h6>
                    <div className="td-empty-state-sm">No blocking tasks</div>
                  </div>
                  <div className="td-dep-section">
                    <h6 className="td-dep-heading"><FontAwesomeIcon icon={faArrowLeft} className="me-2 text-warning" />Blocked By</h6>
                    <div className="td-empty-state-sm">No blockers</div>
                  </div>
                  <div className="td-dep-section">
                    <h6 className="td-dep-heading"><FontAwesomeIcon icon={faLink} className="me-2 text-primary" />Related To</h6>
                    <div className="td-empty-state-sm">No related tasks</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <TaskDocumentCenter
                taskId={localTask?.id}
                attachments={attachments}
                onFileUpload={handleFileUpload}
                onFileDelete={handleDeleteAttachment}
              />
            )}

            {activeTab === 'approvals' && (
              <div className="td-approvals-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Approvals</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="td-approval-types">
                  <div className="td-approval-type"><FontAwesomeIcon icon={faUser} className="me-2 text-primary" />Manager Approval</div>
                  <div className="td-approval-type"><FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />Finance Approval</div>
                  <div className="td-approval-type"><FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" />QA Approval</div>
                </div>
                <div className="td-empty-state"><p className="mb-0 small text-muted">No approval requests pending</p></div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="td-comments-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Comments</h6>
                  <span className="td-badge-light">0</span>
                </div>
                <div className="td-empty-state"><FontAwesomeIcon icon={faComment} className="mb-2" /><p className="mb-0">No comments yet</p></div>
                <div className="td-comment-input">
                  <div className="td-avatar-xs" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>A</div>
                  <input type="text" className="td-chat-input" placeholder="Write a comment..." />
                  <button className="td-send-btn"><FontAwesomeIcon icon={faPaperPlane} /></button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="td-history-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Audit Trail</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="td-activity-feed">
                  {activityLogs.length > 0 ? activityLogs.map((log, i) => (
                    <div key={log.id || i} className="td-activity-item">
                      <div className="td-activity-dot" style={{ background: '#64748b' }}></div>
                      <div className="td-activity-line"></div>
                      <div className="td-activity-content">
                        <p className="mb-0 small">{log.description}</p>
                        <span className="td-activity-time">{log.user?.name ? `${log.user.name} · ` : ''}{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="td-empty-state"><FontAwesomeIcon icon={faHistory} className="mb-2" /><p className="mb-0">No history</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="td-custom-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Custom Fields</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="td-empty-state"><FontAwesomeIcon icon={faCog} className="mb-2" /><p className="mb-0">No custom fields configured</p></div>
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="td-risks-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Risk Management</h6>
                  <button className="td-sm-btn"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="td-risk-summary">
                  <div className="td-risk-metric"><span className="td-risk-label">Risk Score</span><span className="td-risk-value text-success">Low</span></div>
                  <div className="td-risk-metric"><span className="td-risk-label">Blockers</span><span className="td-risk-value">0</span></div>
                  <div className="td-risk-metric"><span className="td-risk-label">Timeline Risk</span><span className="td-risk-value text-warning">Medium</span></div>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="td-budget-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Budget Tracking</h6>
                </div>
                <div className="td-budget-metrics">
                  <div className="td-budget-item"><span className="td-budget-label">Estimated Cost</span><span className="td-budget-value">-</span></div>
                  <div className="td-budget-item"><span className="td-budget-label">Actual Cost</span><span className="td-budget-value">-</span></div>
                  <div className="td-budget-item"><span className="td-budget-label">Variance</span><span className="td-budget-value text-success">On Track</span></div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="td-analytics-tab">
                <div className="td-tab-header">
                  <h6 className="fw-bold mb-0">Task Analytics</h6>
                </div>
                <div className="td-analytics-grid">
                  <div className="td-analytic-card"><div className="td-analytic-value">{progress}%</div><div className="td-analytic-label">Completion</div></div>
                  <div className="td-analytic-card"><div className="td-analytic-value">-</div><div className="td-analytic-label">Lead Time</div></div>
                  <div className="td-analytic-card"><div className="td-analytic-value">{isOverdue ? 'Overdue' : 'On Track'}</div><div className="td-analytic-label">Schedule</div></div>
                  <div className="td-analytic-card"><div className="td-analytic-value">{activityLogs.length}</div><div className="td-analytic-label">Updates</div></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="td-bottom-bar">
          <div className="td-bottom-left">
            <span className="td-bottom-info"><FontAwesomeIcon icon={faUser} className="me-1" />Created by {localTask.assignee?.name || 'System'}</span>
            <span className="td-bottom-info"><FontAwesomeIcon icon={faClock} className="me-1" />{localTask.created_at ? new Date(localTask.created_at).toLocaleDateString() : '-'}</span>
          </div>
          <div className="td-bottom-right">
            <button className="td-bottom-action"><FontAwesomeIcon icon={faBell} className="me-1" />Notify</button>
            <button className="td-bottom-action" onClick={async () => { setAiLoading('copilot'); try { const r = await sendAiChatMessage(`Analyze this task and provide recommendations: "${localTask?.title}" (Status: ${localTask?.status}, Priority: ${localTask?.priority}, Progress: ${localTask?.progress || progress}%).`); addNotification('AI Copilot: ' + r.content, 'info'); } catch {} finally { setAiLoading(null); } }}><FontAwesomeIcon icon={aiLoading === 'copilot' ? faSpinner : faRobot} spin={aiLoading === 'copilot'} className="me-1" />{aiLoading === 'copilot' ? 'Analyzing...' : 'AI Copilot'}</button>
            <button className="td-bottom-action" onClick={handleUpdate.bind(null, { progress: Math.min(100, progress + 10) })}><FontAwesomeIcon icon={faArrowRight} className="me-1" />Progress +10%</button>
          </div>
        </div>
      </div>

      <style>{`
        .task-detail-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
          z-index: 1050; display: flex; justify-content: flex-end;
          animation: tdFadeIn 0.2s ease;
        }
        .task-detail-panel {
          width: 820px; max-width: 100vw; height: 100vh;
          background: #fff; display: flex; flex-direction: column;
          animation: tdSlideIn 0.25s ease; overflow: hidden;
          box-shadow: -8px 0 40px rgba(0,0,0,0.12);
        }
        .td-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
          background: #fafbfc;
        }
        .td-header-left { display: flex; align-items: center; gap: 10px; }
        .td-back-btn { width: 32px; height: 32px; border: none; background: transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; transition: all 0.15s; }
        .td-back-btn:hover { background: #f1f5f9; color: #1e293b; }
        .td-id-badge { font-size: 12px; font-weight: 700; color: #6366f1; background: #eef2ff; padding: 4px 10px; border-radius: 6px; }
        .td-type-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
        .td-header-right { display: flex; align-items: center; gap: 4px; }
        .td-action-btn { width: 32px; height: 32px; border: none; background: transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; transition: all 0.15s; }
        .td-action-btn:hover { background: #f1f5f9; color: #1e293b; }
        .td-close-btn { width: 36px; height: 36px; border: none; background: transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; margin-left: 8px; }
        .td-close-btn:hover { background: #fef2f2; color: #ef4444; }
        .td-body { flex: 1; overflow-y: auto; padding: 24px 28px; }
        .td-title-section { margin-bottom: 16px; }
        .td-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.3; letter-spacing: -0.01em; }
        .td-meta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 14px; }
        .td-meta-group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .td-meta-item { display: flex; align-items: center; gap: 6px; }
        .td-meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.03em; }
        .td-status-badge, .td-priority-badge { border: none; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; display: flex; align-items: center; cursor: pointer; transition: all 0.15s; }
        .td-status-badge:hover, .td-priority-badge:hover { filter: brightness(0.95); }
        .td-status-dropdown-wrap, .td-priority-dropdown-wrap, .td-type-dropdown-wrap { position: relative; }
        .td-dropdown-menu { position: absolute; top: 100%; left: 0; margin-top: 4px; background: #fff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); border: 1px solid #f1f5f9; min-width: 160px; z-index: 20; padding: 4px; }
        .td-dropdown-item { display: flex; align-items: center; width: 100%; border: none; background: transparent; padding: 8px 12px; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; }
        .td-dropdown-item:hover { background: #f8fafc; }
        .td-dropdown-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }
        .td-type-badge-sm { border: none; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; }
        .td-progress-wrap { display: flex; align-items: center; gap: 8px; }
        .td-progress-bar { width: 80px; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .td-progress-fill { height: 100%; border-radius: 10px; transition: width 0.3s ease; }
        .td-progress-text { font-size: 11px; font-weight: 700; color: #64748b; }
        .td-assignee-wrap { display: flex; align-items: center; gap: 6px; position: relative; }
        .td-avatar-sm { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; }
        .td-assignee-name { font-size: 12px; font-weight: 600; color: #1e293b; }
        .td-inline-btn { border: none; background: transparent; color: #94a3b8; padding: 2px; cursor: pointer; }
        .td-inline-btn:hover { color: #6366f1; }
        .td-dates-row { display: flex; flex-wrap: wrap; gap: 16px; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 12px; border: 1px solid #f1f5f9; }
        .td-date-item { display: flex; align-items: center; gap: 6px; }
        .td-date-icon { color: #94a3b8; font-size: 11px; }
        .td-date-label { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #94a3b8; }
        .td-date-value { font-size: 12px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 6px; }
        .td-overdue-badge { font-size: 9px; font-weight: 700; color: #fff; background: #ef4444; padding: 2px 6px; border-radius: 4px; }
        .td-tags-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .td-tag { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px; border: 1px solid; display: flex; align-items: center; gap: 4px; }
        .td-tag-remove { border: none; background: transparent; color: inherit; opacity: 0.5; cursor: pointer; padding: 0; font-size: 12px; line-height: 1; }
        .td-tag-remove:hover { opacity: 1; }
        .td-add-tag-btn { border: 1px dashed #cbd5e1; background: transparent; font-size: 10px; font-weight: 600; color: #94a3b8; padding: 3px 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .td-add-tag-btn:hover { border-color: #6366f1; color: #6366f1; }
        .td-tabs-nav { border-bottom: 1px solid #f1f5f9; margin-bottom: 16px; flex-shrink: 0; }
        .td-tabs-scroll { display: flex; overflow-x: auto; gap: 0; padding: 0; scrollbar-width: none; }
        .td-tabs-scroll::-webkit-scrollbar { display: none; }
        .td-tab { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border: none; background: transparent; font-size: 11px; font-weight: 600; color: #94a3b8; white-space: nowrap; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; }
        .td-tab:hover { color: #1e293b; background: #f8fafc; }
        .td-tab.active { color: #6366f1; border-bottom-color: #6366f1; background: transparent; }
        .td-tab-icon { font-size: 12px; }
        .td-tab-content { flex: 1; overflow-y: auto; min-height: 200px; }
        .td-desc-tab { display: flex; flex-direction: column; gap: 0; }
        .td-editor-toolbar { display: flex; align-items: center; gap: 2px; padding: 6px 8px; border: 1px solid #e2e8f0; border-bottom: none; border-radius: 8px 8px 0 0; background: #fafbfc; flex-wrap: wrap; }
        .td-editor-btn { width: 30px; height: 30px; border: none; background: transparent; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; }
        .td-editor-btn:hover { background: #f1f5f9; color: #1e293b; }
        .td-editor-divider { width: 1px; height: 20px; background: #e2e8f0; margin: 0 4px; }
        .td-desc-editor { width: 100%; min-height: 220px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; padding: 12px 14px; font-size: 13px; line-height: 1.6; color: #1e293b; resize: vertical; outline: none; font-family: inherit; }
        .td-desc-editor:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.08); }
        .td-editor-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .td-save-btn { padding: 6px 16px; border: none; background: #6366f1; color: #fff; font-size: 12px; font-weight: 700; border-radius: 8px; cursor: pointer; }
        .td-save-btn:hover { background: #4f46e5; }
        .td-tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .td-sm-btn { border: 1px solid #e2e8f0; background: #fff; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
        .td-sm-btn:hover { border-color: #6366f1; color: #6366f1; }
        .td-activity-feed { padding: 0; }
        .td-activity-item { display: flex; gap: 12px; padding: 8px 0; position: relative; }
        .td-activity-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .td-activity-line { position: absolute; left: 4px; top: 18px; bottom: -8px; width: 2px; background: #f1f5f9; }
        .td-activity-item:last-child .td-activity-line { display: none; }
        .td-activity-content { flex: 1; }
        .td-activity-time { font-size: 10px; color: #94a3b8; }
        .td-empty-state { text-align: center; padding: 40px 20px; color: #94a3b8; }
        .td-empty-state svg { font-size: 28px; opacity: 0.4; }
        .td-empty-state-sm { text-align: center; padding: 16px; color: #94a3b8; font-size: 11px; border: 1px dashed #e2e8f0; border-radius: 8px; }
        .td-empty-full { padding: 60px 20px; }
        .td-badge-light { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px; background: #f1f5f9; color: #64748b; }
        .td-discussion-input, .td-comment-input { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 10px; margin-top: 12px; }
        .td-avatar-xs { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .td-chat-input { flex: 1; border: none; outline: none; font-size: 12px; padding: 6px 0; }
        .td-chat-actions, .td-chat-btn { display: flex; align-items: center; gap: 2px; }
        .td-chat-btn, .td-send-btn { width: 30px; height: 30px; border: none; background: transparent; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .td-chat-btn:hover, .td-send-btn:hover { background: #f1f5f9; }
        .td-timer-btn { border: none; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; }
        .td-time-stats { display: flex; gap: 12px; margin-bottom: 12px; }
        .td-time-stat { flex: 1; text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .td-time-stat-label { display: block; font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 600; }
        .td-time-stat-value { font-size: 16px; font-weight: 800; color: #1e293b; }
        .td-time-log-item { padding: 8px 12px; border: 1px solid #f1f5f9; border-radius: 8px; margin-bottom: 6px; }
        .td-attachments-grid { display: flex; flex-direction: column; gap: 6px; }
        .td-attachment-card { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid #f1f5f9; border-radius: 8px; }
        .td-attachment-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .td-attachment-info { flex: 1; display: flex; flex-direction: column; }
        .td-attachment-name { font-size: 12px; font-weight: 600; color: #1e293b; }
        .td-attachment-size { font-size: 10px; color: #94a3b8; }
        .td-attachment-delete { border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 4px; }
        .td-attachment-delete:hover { color: #ef4444; }
        .td-dep-section { margin-bottom: 12px; }
        .td-dep-heading { font-size: 11px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .td-approval-types { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .td-approval-type { font-size: 12px; padding: 8px 12px; border: 1px solid #f1f5f9; border-radius: 8px; font-weight: 600; color: #1e293b; background: #fafbfc; }
        .td-risk-summary, .td-budget-metrics { display: flex; gap: 12px; }
        .td-risk-metric, .td-budget-item { flex: 1; text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .td-risk-label, .td-budget-label { display: block; font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 600; }
        .td-risk-value, .td-budget-value { font-size: 14px; font-weight: 800; color: #1e293b; }
        .td-analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .td-analytic-card { text-align: center; padding: 16px; background: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9; }
        .td-analytic-value { font-size: 18px; font-weight: 800; color: #1e293b; }
        .td-analytic-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
        .td-checklist-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .td-checklist-bar { flex: 1; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .td-checklist-fill { height: 100%; border-radius: 10px; background: #10b981; }
        .td-bottom-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; border-top: 1px solid #f1f5f9; background: #fafbfc; flex-shrink: 0;
        }
        .td-bottom-left { display: flex; gap: 16px; }
        .td-bottom-info { font-size: 11px; color: #94a3b8; font-weight: 500; }
        .td-bottom-right { display: flex; gap: 6px; }
        .td-bottom-action { border: 1px solid #e2e8f0; background: #fff; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.15s; }
        .td-bottom-action:hover { border-color: #6366f1; color: #6366f1; }
        @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tdSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default TaskDetailModal;
