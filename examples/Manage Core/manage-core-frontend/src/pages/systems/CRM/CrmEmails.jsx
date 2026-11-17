import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listEmails, getEmail, sendEmail, replyEmail, deleteEmail, updateEmail,
  bulkEmailAction, folderStats, sendEmail as sendEmailApi, listEmailAccounts,
  createFromRecord,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import { CrmModal, CrmSearchBar, CrmConfirmDialog } from '../../../components/crm';
import {
  faEnvelope, faSearch, faReply, faReplyAll, faShare, faTrash, faArchive,
  faCheckCircle, faCircle, faStar, faEdit, faPaperclip, faInbox, faPaperPlane,
  faFile, faTimes, faPlus, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const formatRel = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  const diff = (Date.now() - dt.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return dt.toLocaleDateString();
};

const CrmEmails = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [folder, setFolder] = useState('inbox');
  const [stats, setStats] = useState([]);
  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selected, setSelected] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const loadStats = async () => {
    try {
      const res = await folderStats();
      setStats(res);
    } catch {}
  };

  const loadEmails = async () => {
    setLoading(true);
    try {
      const res = await listEmails({ folder, search, page, per_page: perPage, unread_only: unreadOnly });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to load emails' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { setPage(1); }, [folder, search, unreadOnly]);
  useEffect(() => { loadEmails(); }, [folder, page, perPage, search, unreadOnly]);
  useEffect(() => { const t = setInterval(() => { loadStats(); loadEmails(); }, 30000); return () => clearInterval(t); }, [folder, page, search]);

  const openEmail = async (email) => {
    try {
      const e = await getEmail(email.id);
      setActiveEmail(e);
    } catch (err) {
      addNotification?.({ type: 'error', message: 'Failed to open email' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmail(confirmDel.id);
      addNotification?.({ type: 'success', message: 'Email deleted' });
      setConfirmDel(null);
      setActiveEmail(null);
      loadEmails();
      loadStats();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Delete failed' });
    }
  };

  const handleBulk = async (action, folder) => {
    try {
      await bulkEmailAction(selected, action, folder);
      setSelected([]);
      addNotification?.({ type: 'success', message: 'Action complete' });
      loadEmails();
      loadStats();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Bulk action failed' });
    }
  };

  const handleToggleStar = async (email) => {
    try {
      await updateEmail(email.id, { is_starred: !email.is_starred });
      if (activeEmail?.id === email.id) setActiveEmail({ ...activeEmail, is_starred: !email.is_starred });
      loadEmails();
    } catch {}
  };

  const handleToggleRead = async (email) => {
    try {
      await updateEmail(email.id, { is_read: !email.is_read });
      loadEmails();
    } catch {}
  };

  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';

  return (
    <ErpPageShell
      icon={faEnvelope}
      title="Email Inbox"
      description={`${stats.find(s => s.folder === folder)?.total || 0} emails in ${folder}`}
      action={
        <button className="btn btn-primary btn-sm" onClick={() => { setReplyTo(null); setComposerOpen(true); }}>
          <FontAwesomeIcon icon={faEdit} className="me-2" />Compose
        </button>
      }
    >
      <div className="row g-0" style={{ minHeight: '70vh' }}>
        {/* Folder sidebar */}
        <div className="col-md-3 col-lg-2" style={{ borderRight: `1px solid ${borderColor}`, padding: '1rem 0.5rem' }}>
          {stats.map(s => (
            <button key={s.folder}
              className="btn btn-sm w-100 text-start d-flex justify-content-between align-items-center mb-1"
              onClick={() => setFolder(s.folder)}
              style={{
                background: folder === s.folder ? (isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)') : 'transparent',
                color: folder === s.folder ? '#6366f1' : textColor,
                fontWeight: folder === s.folder ? 600 : 400,
                border: 'none',
                padding: '0.5rem 0.75rem',
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>
                <FontAwesomeIcon icon={folderIcon(s.folder)} className="me-2" />{s.folder}
              </span>
              <span>
                {s.unread > 0 && <span className="badge bg-primary me-1">{s.unread}</span>}
                <small style={{ color: mutedColor }}>{s.total}</small>
              </span>
            </button>
          ))}
        </div>

        {/* Email list */}
        <div className="col-md-4 col-lg-3" style={{ borderRight: `1px solid ${borderColor}` }}>
          <div className="p-2 d-flex gap-2">
            <CrmSearchBar value={search} onChange={setSearch} placeholder="Search emails..." isDark={isDark} width="100%" />
          </div>
          {selected.length > 0 && (
            <div className="px-2 py-1" style={{ background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)' }}>
              <small>{selected.length} selected</small>
              <button className="btn btn-sm ms-2" onClick={() => handleBulk('archive')}>Archive</button>
              <button className="btn btn-sm" onClick={() => handleBulk('read', null)}>Mark Read</button>
              <button className="btn btn-sm" onClick={() => handleBulk('delete', null)}>Delete</button>
            </div>
          )}
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {loading && <div className="p-3 text-center" style={{ color: mutedColor }}>Loading...</div>}
            {!loading && data.data.length === 0 && (
              <div className="p-4 text-center" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faEnvelope} size="2x" style={{ opacity: 0.3 }} />
                <div className="small mt-2">No emails in {folder}</div>
              </div>
            )}
            {data.data.map(e => (
              <div key={e.id}
                onClick={() => openEmail(e)}
                style={{
                  padding: '0.75rem',
                  borderBottom: `1px solid ${borderColor}`,
                  background: activeEmail?.id === e.id ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : (e.is_read ? 'transparent' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.03)')),
                  cursor: 'pointer',
                  fontWeight: e.is_read ? 400 : 600,
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ color: textColor, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" className="form-check-input me-2" checked={selected.includes(e.id)} onChange={(ev) => {
                      ev.stopPropagation();
                      setSelected(ev.target.checked ? [...selected, e.id] : selected.filter(x => x !== e.id));
                    }} onClick={(ev) => ev.stopPropagation()} />
                    {e.from_name || e.from_email}
                  </span>
                  <small style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{formatRel(e.received_at)}</small>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem' }}>
                  <span style={{ color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.subject}
                  </span>
                  {e.is_starred && <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b', marginLeft: 4 }} />}
                </div>
                <div className="small" style={{ color: mutedColor, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.body_text?.substring(0, 80) || e.snippet || ''}
                </div>
                {(e.attachments?.length > 0 || e.has_attachments) && (
                  <FontAwesomeIcon icon={faPaperclip} style={{ color: mutedColor, fontSize: '0.7rem', marginTop: 4 }} />
                )}
              </div>
            ))}
          </div>
          {!loading && data.meta.last_page > 1 && (
            <div className="d-flex justify-content-between align-items-center p-2" style={{ borderTop: `1px solid ${borderColor}` }}>
              <small style={{ color: mutedColor }}>Page {data.meta.current_page} of {data.meta.last_page}</small>
              <div className="d-flex gap-1">
                <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
                <button className="btn btn-sm" disabled={page >= data.meta.last_page} onClick={() => setPage(page + 1)}>›</button>
              </div>
            </div>
          )}
        </div>

        {/* Reading pane */}
        <div className="col-md-5 col-lg-7">
          {activeEmail ? (
            <EmailReader
              email={activeEmail}
              onClose={() => setActiveEmail(null)}
              onReply={() => { setReplyTo(activeEmail); setComposerOpen(true); }}
              onDelete={() => setConfirmDel(activeEmail)}
              onStar={() => handleToggleStar(activeEmail)}
              onToggleRead={() => handleToggleRead(activeEmail)}
              isDark={isDark}
              onCreateFromRecord={(type) => createFromRecord({
                entity_type: activeEmail.entity_type,
                entity_id: activeEmail.entity_id,
                create_type: type,
              }).then(() => addNotification?.({ type: 'success', message: `Created ${type}` }))}
            />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh', color: mutedColor }}>
              <FontAwesomeIcon icon={faEnvelope} size="3x" style={{ opacity: 0.3 }} />
              <p className="mt-3">Select an email to read</p>
            </div>
          )}
        </div>
      </div>

      <Composer
        isOpen={composerOpen}
        onClose={() => { setComposerOpen(false); setReplyTo(null); }}
        replyTo={replyTo}
        onSent={() => { setComposerOpen(false); setReplyTo(null); loadEmails(); loadStats(); }}
        isDark={isDark}
      />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        title="Delete Email"
        message={`Permanently delete "${confirmDel?.subject}"?`}
        variant="danger"
        confirmText="Delete"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const folderIcon = (f) => {
  if (f === 'inbox') return faInbox;
  if (f === 'sent') return faPaperPlane;
  if (f === 'drafts') return faFile;
  return faEnvelope;
};

const EmailReader = ({ email, onClose, onReply, onDelete, onStar, onToggleRead, isDark, onCreateFromRecord }) => {
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';

  return (
    <div style={{ height: '70vh', overflowY: 'auto' }}>
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <h5 className="mb-0" style={{ color: textColor }}>{email.subject || '(No subject)'}</h5>
        <div className="d-flex gap-1">
          <button className="btn btn-sm" onClick={onStar} style={{ color: email.is_starred ? '#f59e0b' : mutedColor }}>
            <FontAwesomeIcon icon={faStar} />
          </button>
          <button className="btn btn-sm" onClick={onToggleRead} style={{ color: mutedColor }} title={email.is_read ? 'Mark unread' : 'Mark read'}>
            <FontAwesomeIcon icon={email.is_read ? faCircle : faCheckCircle} />
          </button>
          <button className="btn btn-sm" onClick={onReply} style={{ color: '#6366f1' }}><FontAwesomeIcon icon={faReply} /> Reply</button>
          <button className="btn btn-sm" onClick={onDelete} style={{ color: '#ef4444' }}><FontAwesomeIcon icon={faTrash} /></button>
          <button className="btn btn-sm" onClick={onClose} style={{ color: mutedColor }}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      </div>
      <div className="p-3">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <strong style={{ color: textColor }}>{email.from_name || email.from_email}</strong>
            <div className="small" style={{ color: mutedColor }}>{email.from_email}</div>
          </div>
          <small style={{ color: mutedColor }}>{new Date(email.received_at || email.sent_at).toLocaleString()}</small>
        </div>
        <div className="small mb-3" style={{ color: mutedColor }}>
          <strong>To:</strong> {email.to_emails}
          {email.cc_emails && <div><strong>CC:</strong> {email.cc_emails}</div>}
          {email.bcc_emails && <div><strong>BCC:</strong> {email.bcc_emails}</div>}
        </div>
        <div style={{ color: textColor, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: email.body_html || email.body_text || '' }} />
        {email.attachments?.length > 0 && (
          <div className="mt-4">
            <h6 style={{ color: textColor }}>Attachments</h6>
            <div className="d-flex flex-wrap gap-2">
              {email.attachments.map(a => (
                <div key={a.id} className="p-2" style={{ border: `1px solid ${borderColor}`, borderRadius: '8px', minWidth: '160px' }}>
                  <FontAwesomeIcon icon={faPaperclip} className="me-2" />
                  <small>{a.name}</small>
                  <div className="small" style={{ color: mutedColor }}>{(a.size / 1024).toFixed(1)} KB</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {email.entity_type && email.entity_id && (
          <div className="mt-4 p-3" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)', borderRadius: '10px' }}>
            <h6 style={{ color: textColor }}>Linked Record</h6>
            <div className="small" style={{ color: mutedColor }}>
              Linked to {email.entity_type.split('\\').pop()} #{email.entity_id}
            </div>
            <div className="d-flex gap-2 mt-2">
              {email.entity_type?.includes('Lead') && (
                <button className="btn btn-sm btn-outline-primary" onClick={() => onCreateFromRecord('contact')}>Create Contact</button>
              )}
              <button className="btn btn-sm btn-outline-primary" onClick={() => onCreateFromRecord('task')}>Create Task</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => onCreateFromRecord('followup')}>Create Follow-up</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Composer = ({ isOpen, onClose, replyTo, onSent, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({ to: '', cc: '', bcc: '', subject: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');

  useEffect(() => {
    if (isOpen) {
      listEmailAccounts().then(r => {
        setAccounts(r.data || []);
        const def = (r.data || []).find(a => a.is_default) || (r.data || [])[0];
        if (def) setAccountId(def.id);
      });
      if (replyTo) {
        setForm({
          to: replyTo.from_email,
          cc: replyTo.cc_emails || '',
          bcc: '',
          subject: replyTo.subject?.startsWith('Re:') ? replyTo.subject : 'Re: ' + (replyTo.subject || ''),
          body: `\n\n--- Original message ---\n${replyTo.body_text || ''}`,
        });
      } else {
        setForm({ to: '', cc: '', bcc: '', subject: '', body: '' });
      }
    }
  }, [isOpen, replyTo]);

  const send = async () => {
    if (!form.to || !form.subject) {
      addNotification?.({ type: 'error', message: 'To and Subject are required' });
      return;
    }
    setSaving(true);
    try {
      await sendEmailApi({ ...form, account_id: accountId });
      addNotification?.({ type: 'success', message: 'Email sent' });
      onSent?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Send failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title={replyTo ? 'Reply' : 'Compose Email'} size="xl" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={send} disabled={saving}>
            <FontAwesomeIcon icon={faPaperPlane} className="me-2" />Send
          </button>
        </>
      }
    >
      <div className="mb-2">
        <select className="form-select form-select-sm" value={accountId} onChange={(e) => setAccountId(+e.target.value)}>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.email_address} ({a.provider})</option>
          ))}
        </select>
      </div>
      <input className="form-control mb-2" placeholder="To" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
      <div className="d-flex gap-2 mb-2">
        <input className="form-control" placeholder="CC" value={form.cc} onChange={(e) => setForm({ ...form, cc: e.target.value })} />
        <input className="form-control" placeholder="BCC" value={form.bcc} onChange={(e) => setForm({ ...form, bcc: e.target.value })} />
      </div>
      <input className="form-control mb-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <textarea
        className="form-control"
        rows="14"
        placeholder="Write your email..."
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
        style={{ resize: 'vertical' }}
      />
      <div className="mt-2 small" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
        Use variables like {`{{first_name}}`}, {`{{company}}`}, {`{{deal_name}}`} for personalization.
      </div>
    </CrmModal>
  );
};

export default CrmEmails;