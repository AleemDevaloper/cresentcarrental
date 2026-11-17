import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listDocuments, updateDocument } from '../../../api/dms';
import { StatCard, HeaderCard } from '../../../components/common/UI/Cards';
import { DataTable } from '../../../components/common/UI/Tables';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faLock,
  faGlobe,
  faBan,
  faStamp,
  faNetworkWired,
  faHistory,
  faKey,
  faShieldHalved,
  faSearch,
  faUnlock,
  faTrash,
  faUser,
  faUsers,
  faBuilding,
  faLayerGroup,
  faToggleOn,
  faToggleOff,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { EnableDisableButton } from '../../../components/common';

const PERMISSIONS = ['View', 'Edit', 'Comment', 'Approve', 'Sign', 'Share', 'Delete'];

const DmsSecurityCenter = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [permissionTab, setPermissionTab] = useState('users');
  const [lockFilter, setLockFilter] = useState('');
  const [watermarkDocs, setWatermarkDocs] = useState([]);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [showIpModal, setShowIpModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [twoFaAllDocs, setTwoFaAllDocs] = useState(true);
  const [twoFaRestricted, setTwoFaRestricted] = useState(true);
  const [twoFaBypassTrusted, setTwoFaBypassTrusted] = useState(false);

  const [stats, setStats] = useState({
    totalDocuments: 0,
    securedDocuments: 0,
    restrictedDocuments: 0,
    publicDocuments: 0
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await listDocuments();
      const docs = Array.isArray(data) ? data : [];
      setDocuments(docs);
      setStats({
        totalDocuments: docs.length,
        securedDocuments: docs.filter(d => d.is_secured).length,
        restrictedDocuments: docs.filter(d => d.is_restricted).length,
        publicDocuments: docs.filter(d => d.is_public).length,
      });
      setWatermarkDocs(docs.filter(d => d.watermark_enabled));
    } catch (err) {
      console.error('Failed to fetch documents', err);
      addNotification('Failed to load documents.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatermark = async (docId, enabled) => {
    try {
      await updateDocument(docId, { watermark_enabled: enabled });
      addNotification(`Watermark ${enabled ? 'enabled' : 'disabled'}.`, 'success');
      fetchDocuments();
    } catch (err) {
      addNotification('Failed to update watermark.', 'danger');
    }
  };

  const handleUnlock = async (docId) => {
    try {
      await updateDocument(docId, { is_locked: false });
      addNotification('Document unlocked.', 'success');
      fetchDocuments();
    } catch (err) {
      addNotification('Failed to unlock document.', 'danger');
    }
  };

  const overviewCards = [
    { title: 'Total Documents', value: stats.totalDocuments, icon: faShieldAlt, color: '#8b5cf6' },
    { title: 'Secured Documents', value: stats.securedDocuments, icon: faLock, color: '#10b981' },
    { title: 'Restricted Documents', value: stats.restrictedDocuments, icon: faBan, color: '#f59e0b' },
    { title: 'Public Documents', value: stats.publicDocuments, icon: faGlobe, color: '#0ea5e9' },
  ];

  const lockedDocs = documents.filter(d => d.is_locked);

  const permissionTabs = [
    { key: 'users', icon: faUser, label: 'Users' },
    { key: 'roles', icon: faUsers, label: 'Roles' },
    { key: 'departments', icon: faBuilding, label: 'Departments' },
    { key: 'teams', icon: faLayerGroup, label: 'Teams' },
  ];

  const permissionData = [
    { id: 'manager', entity: 'Manager', view: true, edit: true, comment: true, approve: true, sign: false, share: false, delete: false },
    { id: 'editor', entity: 'Editor', view: true, edit: true, comment: true, approve: false, sign: false, share: false, delete: false },
    { id: 'viewer', entity: 'Viewer', view: true, edit: false, comment: false, approve: false, sign: false, share: false, delete: false },
    { id: 'contributor', entity: 'Contributor', view: true, edit: false, comment: true, approve: false, sign: false, share: false, delete: false },
  ];

  const permissionColumns = [
    { key: 'entity', label: 'Entity', render: (val) => <span className="fw-bold small">{val}</span> },
    ...PERMISSIONS.map(p => ({
      key: p.toLowerCase(),
      label: p,
      render: (val) => (
        <div className="form-check d-flex justify-content-center">
          <input className="form-check-input" type="checkbox" defaultChecked={val} />
        </div>
      ),
    })),
  ];

  const securityLogs = [
    { event: 'Failed login attempt', user: 'john.doe@email.com', ip: '192.168.1.100', time: '2 mins ago', severity: 'high' },
    { event: 'Unauthorized download attempt', user: 'jane.smith@email.com', ip: '10.0.0.45', time: '15 mins ago', severity: 'medium' },
    { event: 'Suspicious file access', user: 'admin@email.com', ip: '203.0.113.50', time: '1 hour ago', severity: 'low' },
  ];

  return (
    <div className="container-fluid py-4 fade-in">
      <HeaderCard
        title="Security Center"
        description="Manage document access control, permissions, and security settings."
        icon={faShieldHalved}
        isDark={isDark}
      />

      <div className="row g-4 mb-4">
        {overviewCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-md-6">
            <StatCard label={card.title} value={card.value} icon={card.icon} color={card.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Permission Management</h5>
              <div className="d-flex gap-2 mb-4">
                {permissionTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`btn btn-sm rounded-pill px-3 border-0 fw-bold transition ${permissionTab === tab.key ? 'btn-primary shadow-sm text-white' : 'btn-light text-muted'}`}
                    onClick={() => setPermissionTab(tab.key)}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="me-1" />{tab.label}
                  </button>
                ))}
              </div>
              <div className="mb-3">
                <div className="position-relative">
                  <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem' }} />
                  <input type="text" className="form-control border shadow-none rounded-pill ps-5 bg-light small" placeholder={`Search ${permissionTab}...`} style={{ width: '260px' }} />
                </div>
              </div>
              <DataTable
                columns={permissionColumns}
                data={permissionData}
                hover
                isDark={isDark}
              />
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><FontAwesomeIcon icon={faLock} className="me-2" />Locked Documents</h5>
              {lockedDocs.length === 0 ? (
                <div className="text-center py-4 text-muted small">No locked documents.</div>
              ) : (
                <div className="d-flex flex-column gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {lockedDocs.map(doc => (
                    <div key={doc.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                      <div>
                        <span className="fw-bold small d-block">{doc.name}</span>
                        <span className="x-small text-muted">Locked by {doc.lock_owner || 'Unknown'} | {doc.locked_date ? new Date(doc.locked_date).toLocaleDateString() : '—'}</span>
                      </div>
                      <button className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold" onClick={() => handleUnlock(doc.id)}>
                        <FontAwesomeIcon icon={faUnlock} className="me-1" />Unlock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><FontAwesomeIcon icon={faStamp} className="me-2" />Watermark Settings</h5>
              {watermarkDocs.length === 0 ? (
                <div className="text-center py-4 text-muted small">No watermarks configured.</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {watermarkDocs.slice(0, 5).map(doc => (
                    <div key={doc.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                      <span className="small text-truncate" style={{ maxWidth: '200px' }}>{doc.name}</span>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-bold x-small">Active</span>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn btn-light rounded-pill px-4 py-2 fw-bold w-100 mt-3" onClick={() => setShowWatermarkModal(true)}>
                <FontAwesomeIcon icon={faCog} className="me-2" />Manage Watermarks
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><FontAwesomeIcon icon={faNetworkWired} className="me-2" />IP Restrictions</h5>
              <div className="text-center py-4 text-muted small">
                <p className="mb-2">Configure IP whitelist for document access.</p>
                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">3 whitelisted IPs</span>
              </div>
              <button className="btn btn-light rounded-pill px-4 py-2 fw-bold w-100 mt-2" onClick={() => setShowIpModal(true)}>
                <FontAwesomeIcon icon={faCog} className="me-2" />Configure
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><FontAwesomeIcon icon={faShieldHalved} className="me-2" />Two-Factor Auth</h5>
              <div className="text-center py-4">
                <FontAwesomeIcon icon={faToggleOn} className="fs-1 text-success mb-2" />
                <p className="small text-muted mb-0">2FA is enabled for document access</p>
              </div>
              <button className="btn btn-light rounded-pill px-4 py-2 fw-bold w-100 mt-2" onClick={() => setShowTwoFactorModal(true)}>
                <FontAwesomeIcon icon={faCog} className="me-2" />Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><FontAwesomeIcon icon={faHistory} className="me-2" />Security Logs</h5>
              <div className="d-flex flex-column gap-2">
                {securityLogs.map((log, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                    <div>
                      <span className="fw-bold small d-block">{log.event}</span>
                      <span className="x-small text-muted">{log.user} | {log.ip}</span>
                    </div>
                    <div className="text-end">
                      <span className={`badge rounded-pill px-2 py-1 fw-bold x-small ${log.severity === 'high' ? 'bg-danger bg-opacity-10 text-danger' : log.severity === 'medium' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-info bg-opacity-10 text-info'}`}>
                        {log.severity}
                      </span>
                      <div className="x-small text-muted mt-1">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><FontAwesomeIcon icon={faKey} className="me-2" />Encryption Status</h5>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 text-center">
                    <FontAwesomeIcon icon={faLock} className="text-success fs-4 mb-2" />
                    <h6 className="fw-bold mb-0">At Rest</h6>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-bold x-small mt-2">Enabled</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 text-center">
                    <FontAwesomeIcon icon={faLock} className="text-success fs-4 mb-2" />
                    <h6 className="fw-bold mb-0">In Transit</h6>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-bold x-small mt-2">TLS 1.3</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-light border text-center">
                    <FontAwesomeIcon icon={faLock} className="text-muted fs-4 mb-2" />
                    <h6 className="fw-bold mb-0">End-to-End</h6>
                    <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill fw-bold x-small mt-2">Optional</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 text-center">
                    <FontAwesomeIcon icon={faLock} className="text-success fs-4 mb-2" />
                    <h6 className="fw-bold mb-0">Database</h6>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-bold x-small mt-2">AES-256</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWatermarkModal && (
        <DialogBox show={showWatermarkModal} onHide={() => setShowWatermarkModal(false)} title="Watermark Settings" size="large">
          <div className="d-flex flex-column gap-2">
            {documents.slice(0, 10).map(doc => (
              <div key={doc.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                <span className="small fw-medium">{doc.name}</span>
                <button
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${doc.watermark_enabled ? 'btn-success' : 'btn-light border'}`}
                  onClick={() => toggleWatermark(doc.id, !doc.watermark_enabled)}
                >
                  <FontAwesomeIcon icon={doc.watermark_enabled ? faToggleOn : faToggleOff} className="me-1" />
                  {doc.watermark_enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </DialogBox>
      )}

      {showIpModal && (
        <DialogBox show={showIpModal} onHide={() => setShowIpModal(false)} title="IP Restrictions" size="small">
          <div className="mb-3">
            <label className="form-label fw-bold small">IP Address</label>
            <div className="d-flex gap-2">
              <input type="text" className="form-control border shadow-none rounded-3" placeholder="e.g. 192.168.1.0/24" />
              <button className="btn btn-primary rounded-pill px-3 fw-bold"><FontAwesomeIcon icon={faPlus} /></button>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            {['192.168.1.0/24', '10.0.0.0/16', '203.0.113.0/24'].map((ip, idx) => (
              <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                <span className="small fw-medium">{ip}</span>
                <button className="btn btn-sm btn-light text-danger rounded-circle"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            ))}
          </div>
        </DialogBox>
      )}

      {showTwoFactorModal && (
        <DialogBox show={showTwoFactorModal} onHide={() => setShowTwoFactorModal(false)} title="Two-Factor Authentication" size="small">
          <p className="small text-muted mb-3">Require 2FA for accessing secured documents.</p>
          <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border mb-2">
            <span className="fw-bold small">Require 2FA for all documents</span>
            <EnableDisableButton checked={twoFaAllDocs} onClick={() => setTwoFaAllDocs(!twoFaAllDocs)} label="Require 2FA for all documents" size="small" />
          </div>
          <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border mb-2">
            <span className="fw-bold small">Require 2FA for restricted documents</span>
            <EnableDisableButton checked={twoFaRestricted} onClick={() => setTwoFaRestricted(!twoFaRestricted)} label="Require 2FA for restricted documents" size="small" />
          </div>
          <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
            <span className="fw-bold small">Allow 2FA bypass for trusted IPs</span>
            <EnableDisableButton checked={twoFaBypassTrusted} onClick={() => setTwoFaBypassTrusted(!twoFaBypassTrusted)} label="Allow 2FA bypass for trusted IPs" size="small" />
          </div>
        </DialogBox>
      )}

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 0.65rem; }
        .transition { transition: all 0.2s ease; }
        .form-check-input[type="checkbox"] { cursor: pointer; }
        ${isDark ? `
          .card { background-color: #1e293b !important; border-color: #334155 !important; }
          .bg-light { background-color: #1e293b !important; }
          .border-light { border-color: #334155 !important; }
          .text-muted { color: #94a3b8 !important; }
          .text-dark { color: #f1f5f9 !important; }
          .bg-white { background-color: #1e293b !important; }
          .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .form-control, .form-select { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .table { color: #f1f5f9 !important; }
          .table-hover tbody tr:hover { background-color: rgba(99,102,241,0.08) !important; }
        ` : ''}
      `}</style>
    </div>
  );
};

export default DmsSecurityCenter;
