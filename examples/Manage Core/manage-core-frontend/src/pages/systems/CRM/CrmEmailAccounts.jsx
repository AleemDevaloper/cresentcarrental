import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listEmailAccounts, createEmailAccount, deleteEmailAccount, syncEmailAccount,
  testEmailAccount, getEmailOAuthUrl,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmSearchBar, CrmConfirmDialog } from '../../../components/crm';
import {
  faEnvelope, faPlus, faRefresh, faTrash, faLink, faUnlink, faCheckCircle, faTimesCircle,
  faCog, faPlay, faPause,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const formatDate = (d) => d ? new Date(d).toLocaleString() : '—';

const CrmEmailAccounts = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [oauthModal, setOauthModal] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listEmailAccounts({ search, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to load accounts' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, perPage, search]);

  const handleSync = async (id) => {
    try {
      await syncEmailAccount(id);
      addNotification?.({ type: 'success', message: 'Sync queued' });
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Sync failed' });
    }
  };

  const handleTest = async (id) => {
    try {
      await testEmailAccount(id);
      addNotification?.({ type: 'success', message: 'Connection OK' });
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Test failed' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmailAccount(id);
      addNotification?.({ type: 'success', message: 'Account removed' });
      setConfirmDel(null);
      fetch();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Delete failed' });
    }
  };

  const columns = [
    { key: 'account_name', label: 'Account', render: (v, r) => (
      <div>
        <div style={{ fontWeight: 600 }}>{v}</div>
        <div className="small" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{r.email_address}</div>
      </div>
    )},
    { key: 'provider', label: 'Provider', render: (v) => (
      <span style={{ padding: '2px 8px', borderRadius: 100, background: isDark ? '#1e293b' : '#f1f5f9', fontSize: '0.7rem', fontWeight: 600 }}>
        {v}
      </span>
    )},
    { key: 'status', label: 'Status', render: (v) => (
      <span style={{ color: v === 'active' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
        <FontAwesomeIcon icon={v === 'active' ? faCheckCircle : faTimesCircle} className="me-1" />
        {v}
      </span>
    )},
    { key: 'sync_status', label: 'Sync', render: (v) => (
      <span style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b' }}>
        {v === 'idle' ? '●' : '○'} {v}
      </span>
    )},
    { key: 'last_sync_at', label: 'Last Sync', render: formatDate },
    { key: 'sent_count', label: 'Sent', align: 'right' },
    { key: 'received_count', label: 'Received', align: 'right' },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0" title="Sync" onClick={() => handleSync(row.id)} style={{ color: '#6366f1' }}>
          <FontAwesomeIcon icon={faRefresh} />
        </button>
        <button className="btn btn-sm border-0" title="Test" onClick={() => handleTest(row.id)} style={{ color: '#10b981' }}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
        <button className="btn btn-sm border-0" title="Delete" onClick={() => setConfirmDel(row)} style={{ color: '#ef4444' }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const totals = useMemo(() => {
    const accounts = data.data || [];
    return {
      total: accounts.length,
      active: accounts.filter(a => a.status === 'active').length,
      totalSent: accounts.reduce((s, a) => s + (a.sent_count || 0), 0),
      totalReceived: accounts.reduce((s, a) => s + (a.received_count || 0), 0),
    };
  }, [data]);

  return (
    <ErpPageShell
      icon={faEnvelope}
      title="Email Accounts"
      description="Connect Gmail, Microsoft 365, SMTP and IMAP mailboxes for full email integration."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Connect Account
        </button>
      }
    >
      <div className="row g-3 mb-3">
        <div className="col-md-3"><ErpKpiCard title="Total Accounts" value={totals.total} icon={faEnvelope} color="#6366f1" /></div>
        <div className="col-md-3"><ErpKpiCard title="Active" value={totals.active} icon={faCheckCircle} color="#10b981" /></div>
        <div className="col-md-3"><ErpKpiCard title="Sent" value={totals.totalSent} icon={faPlay} color="#0ea5e9" /></div>
        <div className="col-md-3"><ErpKpiCard title="Received" value={totals.totalReceived} icon={faPause} color="#f59e0b" /></div>
      </div>

      <ErpDataTable
        title="Connected Mailboxes"
        titleIcon={faEnvelope}
        columns={columns}
        data={data.data}
        loading={loading}
        searchable
        searchPlaceholder="Search by account name or email..."
        searchTerm={search}
        onSearchChange={setSearch}
        currentPage={data.meta.current_page}
        totalPages={data.meta.last_page}
        entriesPerPage={perPage}
        totalEntries={data.meta.total}
        onPageChange={setPage}
        onEntriesPerPageChange={(v) => { setPerPage(v); setPage(1); }}
        isDark={isDark}
        accentColor="#6366f1"
      />

      <ConnectAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); fetch(); }}
        isDark={isDark}
        onOauthRequested={setOauthModal}
      />

      <CrmModal isOpen={!!oauthModal} onClose={() => setOauthModal(null)} title={`Connect ${oauthModal?.provider?.toUpperCase() || ''}`} isDark={isDark}>
        {oauthModal && (
          <div>
            <p>Click below to authorize ManageCore to access your {oauthModal.provider} account.</p>
            <button className="btn btn-primary" onClick={async () => {
              try {
                const { data } = await getEmailOAuthUrl(oauthModal.provider);
                window.open(data.url, '_blank', 'width=600,height=700');
              } catch (e) {
                addNotification?.({ type: 'error', message: 'Failed to not generate OAuth URL' });
              }
            }}>
              <FontAwesomeIcon icon={faLink} className="me-2" />Authorize {oauthModal.provider}
            </button>
            <p className="small text-muted mt-3">After authorizing, copy the redirect URL or code and paste it in the connection form.</p>
          </div>
        )}
      </CrmModal>

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel.id)}
        title="Disconnect Account"
        message={`Disconnect "${confirmDel?.account_name}" (${confirmDel?.email_address})? Emails already synced will not be deleted.`}
        confirmText="Disconnect"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const ConnectAccountModal = ({ isOpen, onClose, onSuccess, isDark, onOauthRequested }) => {
  const { addNotification } = useApp();
  const [tab, setTab] = useState('oauth');
  const [provider, setProvider] = useState('gmail');
  const [form, setForm] = useState({
    account_name: '',
    email_address: '',
    display_name: '',
    smtp_host: '', smtp_port: 587, smtp_username: '', smtp_password: '', smtp_encryption: 'tls',
    imap_host: '', imap_port: 993, imap_username: '', imap_password: '', imap_encryption: 'ssl',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, provider };
      if (provider === 'smtp') payload.connection_type = 'smtp';
      else if (provider === 'imap') payload.connection_type = 'imap';
      await createEmailAccount(payload);
      addNotification?.({ type: 'success', message: 'Account connected' });
      onSuccess?.();
    } catch (err) {
      addNotification?.({ type: 'error', message: err?.response?.data?.message || 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title="Connect Email Account" size="lg" isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Connecting...' : 'Connect'}
          </button>
        </>
      }
    >
      <ul className="nav nav-tabs mb-3">
        {['oauth', 'smtp', 'imap'].map(t => (
          <li key={t} className="nav-item">
            <button className={`nav-link ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); if (t === 'smtp') setProvider('smtp'); if (t === 'imap') setProvider('imap'); if (t === 'oauth') setProvider('gmail'); }}>
              {t.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'oauth' && (
        <div>
          <label className="form-label">Provider</label>
          <div className="d-flex gap-2 mb-3">
            <button className={`btn btn-sm ${provider === 'gmail' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setProvider('gmail')}>Gmail</button>
            <button className={`btn btn-sm ${provider === 'microsoft' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setProvider('microsoft')}>Microsoft 365</button>
          </div>
          <div className="alert alert-info">
            <strong>Step 1:</strong> Click below to authorize ManageCore.<br/>
            <strong>Step 2:</strong> After authorizing, copy the code from the redirect URL and paste it into the form below.
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={() => onOauthRequested({ provider })}>
              <FontAwesomeIcon icon={faLink} className="me-2" />Authorize
            </button>
          </div>
          <hr />
          <label className="form-label">Account Name *</label>
          <input className="form-control mb-2" value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} />
          <label className="form-label">Email Address *</label>
          <input className="form-control" type="email" value={form.email_address} onChange={(e) => setForm({ ...form, email_address: e.target.value })} />
        </div>
      )}

      {tab === 'smtp' && (
        <div>
          <label className="form-label">Account Name *</label>
          <input className="form-control mb-2" value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} />
          <label className="form-label">Email Address *</label>
          <input className="form-control mb-2" type="email" value={form.email_address} onChange={(e) => setForm({ ...form, email_address: e.target.value })} />
          <div className="row">
            <div className="col-md-8"><label className="form-label">SMTP Host *</label><input className="form-control" value={form.smtp_host} onChange={(e) => setForm({ ...form, smtp_host: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Port</label><input className="form-control" type="number" value={form.smtp_port} onChange={(e) => setForm({ ...form, smtp_port: +e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Username</label><input className="form-control" value={form.smtp_username} onChange={(e) => setForm({ ...form, smtp_username: e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Password</label><input className="form-control" type="password" value={form.smtp_password} onChange={(e) => setForm({ ...form, smtp_password: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Encryption</label>
              <select className="form-select" value={form.smtp_encryption} onChange={(e) => setForm({ ...form, smtp_encryption: e.target.value })}>
                <option value="tls">TLS</option><option value="ssl">SSL</option><option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {tab === 'imap' && (
        <div>
          <label className="form-label">Account Name *</label>
          <input className="form-control mb-2" value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} />
          <label className="form-label">Email Address *</label>
          <input className="form-control mb-2" type="email" value={form.email_address} onChange={(e) => setForm({ ...form, email_address: e.target.value })} />
          <div className="row">
            <div className="col-md-8"><label className="form-label">IMAP Host *</label><input className="form-control" value={form.imap_host} onChange={(e) => setForm({ ...form, imap_host: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Port</label><input className="form-control" type="number" value={form.imap_port} onChange={(e) => setForm({ ...form, imap_port: +e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Username</label><input className="form-control" value={form.imap_username} onChange={(e) => setForm({ ...form, imap_username: e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Password</label><input className="form-control" type="password" value={form.imap_password} onChange={(e) => setForm({ ...form, imap_password: e.target.value })} /></div>
          </div>
        </div>
      )}
    </CrmModal>
  );
};

export default CrmEmailAccounts;