import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks, faPhone, faCalendarAlt, faEnvelope, faStickyNote, faFlag, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { CrmModal } from '../crm';
import { useApp } from '../../context/AppContext';
import { createActivity } from '../../api/crm';

const TYPE_META = {
  task: { icon: faTasks, label: 'Task', color: '#10b981' },
  call: { icon: faPhone, label: 'Call', color: '#0ea5e9' },
  meeting: { icon: faCalendarAlt, label: 'Meeting', color: '#f59e0b' },
  email: { icon: faEnvelope, label: 'Email', color: '#6366f1' },
  note: { icon: faStickyNote, label: 'Note', color: '#a855f7' },
  follow_up: { icon: faFlag, label: 'Follow Up', color: '#ec4899' },
};

const CrmQuickActivity = ({
  isOpen,
  onClose,
  onSaved,
  isDark = false,
  leadId = null,
  contactId = null,
  customerId = null,
  dealId = null,
  defaultType = 'task',
}) => {
  const { addNotification } = useApp();
  const [type, setType] = useState(defaultType);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setType(defaultType);
    setSubject('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose?.();
  };

  const save = async () => {
    if (!subject.trim()) {
      addNotification?.({ type: 'error', message: 'Subject is required' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type,
        subject,
        description: description || null,
        status: type === 'note' ? 'completed' : 'planned',
        priority,
        due_date: dueDate || null,
        lead_id: leadId || undefined,
        contact_id: contactId || undefined,
        customer_id: customerId || undefined,
        deal_id: dealId || undefined,
      };
      await createActivity(payload);
      addNotification?.({ type: 'success', message: `${TYPE_META[type].label} created` });
      onSaved?.();
      handleClose();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Quick Add Activity"
      size="md"
      isDark={isDark}
      footer={
        <>
          <button className="btn btn-light" onClick={handleClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving || !subject.trim()}>
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </>
      }
    >
      <div className="d-flex flex-wrap gap-2 mb-3">
        {Object.entries(TYPE_META).map(([key, meta]) => (
          <button
            key={key}
            type="button"
            onClick={() => setType(key)}
            style={{
              background: type === key ? `${meta.color}20` : 'transparent',
              border: `1px solid ${type === key ? meta.color : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0')}`,
              color: type === key ? meta.color : (isDark ? '#cbd5e1' : '#475569'),
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={meta.icon} className="me-1" />
            {meta.label}
          </button>
        ))}
      </div>

      <label className="form-label">Subject *</label>
      <input
        className="form-control mb-2"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="What needs to happen?"
        autoFocus
      />

      <label className="form-label">Description</label>
      <textarea
        className="form-control mb-2"
        rows="3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional details"
      />

      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">Due Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </CrmModal>
  );
};

export default CrmQuickActivity;