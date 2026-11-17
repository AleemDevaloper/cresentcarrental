import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faEye, faRefresh, faInfoCircle, faXmark,
  faFolderOpen, faChartPie, faUserCheck, faCertificate, faBrain, faUser
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { erpColors } from '../../../../components/ui/ux/ErpTheme';

const ErpTaxProfiles = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory', 'dashboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - replace with real API when available
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mock Database for Tax Profiles
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      code: 'TXP-VEN-SILICON-01',
      name: 'Silicon Valley Sourcing Inc. Tax Profile',
      displayName: 'Silicon Valley Sourcing (Filer)',
      shortName: 'SV Sourcing',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Procurement',
      department: 'Accounts Payable',
      profileType: 'Vendor',
      ntn: '4829102-4',
      strn: '1700482910214',
      cnic: 'N/A',
      ftn: 'N/A',
      taxAuthority: 'Federal Board of Revenue (FBR)',
      taxStatus: 'Filer',
      defaultTaxCategory: 'FBR GST (18%)',
      defaultWhtCategory: 'Filer WHT 4.5%',
      taxOffice: 'LTO Karachi',
      registrationDate: '2019-04-12',
      exemptionCertNum: 'EX-99120-2026',
      exemptionFrom: '2025-07-01',
      exemptionTo: '2026-06-30',
      exemptionRate: 0,
      status: 'Active'
    },
    {
      id: 2,
      code: 'TXP-CUS-TECHFLOW-01',
      name: 'TechFlow Systems Limited Tax Profile',
      displayName: 'TechFlow Systems (Filer)',
      shortName: 'TechFlow Systems',
      company: 'ManageCore Global Inc.',
      branch: 'Lahore Branch',
      businessUnit: 'Consulting Division',
      department: 'Corporate Consulting',
      profileType: 'Customer',
      ntn: '3029184-7',
      strn: '2200302918417',
      cnic: 'N/A',
      ftn: 'N/A',
      taxAuthority: 'Federal Board of Revenue (FBR)',
      taxStatus: 'Filer',
      defaultTaxCategory: 'FBR GST (18%)',
      defaultWhtCategory: 'N/A',
      taxOffice: 'RTO Lahore',
      registrationDate: '2021-08-19',
      exemptionCertNum: 'N/A',
      exemptionFrom: 'N/A',
      exemptionTo: 'N/A',
      exemptionRate: 0,
      status: 'Active'
    }
  ]);

  const [newProfile, setNewProfile] = useState({
    code: '', name: '', profileType: 'Vendor', ntn: '', strn: '',
    taxAuthority: 'Federal Board of Revenue (FBR)', taxStatus: 'Filer'
  });

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!newProfile.code || !newProfile.name || !newProfile.ntn) {
      addNotification('Profile Code, Name, and NTN are required.', 'danger');
      return;
    }
    const added = {
      id: Date.now(),
      code: newProfile.code,
      name: newProfile.name,
      displayName: newProfile.name,
      shortName: newProfile.name,
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      profileType: newProfile.profileType,
      ntn: newProfile.ntn,
      strn: newProfile.strn || 'N/A',
      cnic: 'N/A',
      ftn: 'N/A',
      taxAuthority: newProfile.taxAuthority,
      taxStatus: newProfile.taxStatus,
      defaultTaxCategory: 'FBR GST (18%)',
      defaultWhtCategory: 'N/A',
      taxOffice: 'RTO Islamabad',
      registrationDate: '2026-07-06',
      exemptionCertNum: 'N/A',
      exemptionFrom: 'N/A',
      exemptionTo: 'N/A',
      exemptionRate: 0,
      status: 'Active'
    };
    setProfiles([...profiles, added]);
    setShowAddModal(false);
    addNotification('Tax Profile configured successfully.', 'success');
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ntn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.strn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { key: 'code', label: 'Profile Code', render: (val, row) => (
      <span className="fw-bold font-monospace" style={{ color: erpColors.primary, cursor: 'pointer' }}
        onClick={() => { setSelectedProfile(row); setActiveDetailTab('overview'); }}>
        {val}
      </span>
    )},
    { key: 'name', label: 'Tax Profile Name', bold: true },
    { key: 'profileType', label: 'Profile Type', render: (val) => (
      <span className="premium-badge bg-secondary text-white">{val}</span>
    )},
    { key: 'ntn', label: 'NTN Number', render: (val) => (
      <span className="font-monospace fw-bold">{val}</span>
    )},
    { key: 'strn', label: 'STRN Number', render: (val) => (
      <span className="font-monospace">{val}</span>
    )},
    { key: 'taxAuthority', label: 'Tax Authority' },
    { key: 'taxStatus', label: 'Tax Status' },
    { key: '', label: 'Exemption Certificate', render: (val, row) => (
      row.exemptionCertNum !== 'N/A' ? (
        <span className="premium-badge bg-info text-white"><FontAwesomeIcon icon={faCertificate} className="me-1" /> Active</span>
      ) : 'None'
    )},
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.65rem' }}
        onClick={() => { setSelectedProfile(row); setActiveDetailTab('overview'); }}>
        <FontAwesomeIcon icon={faEye} />
      </button>
    )},
  ];

  const actionButtons = (
    <div className="d-flex gap-2 flex-wrap">
      <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_tax_profile')}>
        <FontAwesomeIcon icon={faPlus} /> Create Profile
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('All profiles successfully validated against FBR ATL.', 'success')}>
        <FontAwesomeIcon icon={faUserCheck} className="me-1" /> Verify Filer Status
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Tax profiles audit report generated.', 'success')}>
        <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Profiling Analysis
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
        <FontAwesomeIcon icon={faRefresh} /> Refresh
      </button>
    </div>
  );

  if (loading) {
    return (
      <ErpPageShell icon={faUser} title="Tax Profiles Database" description="Configure enterprise tax identities, Active Taxpayer List (ATL) status tracking, NTN/STRN registries, exemptions, and compliance logs." action={actionButtons}>
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[1, 2].map((_, i) => (
            <div key={i} className="btn btn-sm py-2 px-3 fw-bold" style={{ width: '180px', height: '40px', borderRadius: '10px', background: isDark ? '#1e293b' : '#f1f5f9', opacity: 0.6, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <div className="row g-2">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div key={i} className="col-md-2 mb-2">
              <div className="premium-card glass-card h-100" style={{ borderRadius: '12px', padding: '1rem', opacity: 0.6, animation: 'pulse 1.5s infinite' }}>
                <div style={{ width: '80%', height: '8px', borderRadius: '4px', background: isDark ? '#334155' : '#e2e8f0', marginBottom: '8px' }} />
                <div style={{ width: '50%', height: '12px', borderRadius: '4px', background: isDark ? '#334155' : '#e2e8f0' }} />
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.3; } }`}</style>
      </ErpPageShell>
    );
  }

  return (
    <ErpPageShell icon={faUser} title="Tax Profiles Database" description="Configure enterprise tax identities, Active Taxpayer List (ATL) status tracking, NTN/STRN registries, exemptions, and compliance logs." action={actionButtons}>

      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Tax Profile Directories', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Tax Dashboard', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className="premium-tab-btn btn btn-sm py-2 px-3 fw-bold"
            style={{
              color: activeSubTab === tb.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
              background: activeSubTab === tb.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px'
            }}
            onClick={() => setActiveSubTab(tb.id)}
          >
            <FontAwesomeIcon icon={tb.icon} className="me-2" />
            {tb.label}
          </button>
        ))}
      </div>

      {/* DIRECTORY */}
      {activeSubTab === 'directory' && (
        <ErpDataTable
          columns={columns}
          data={filteredProfiles}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by Code, Name, NTN, STRN, Authority..."
          emptyMessage="No tax profiles found."
          emptyIcon={faUser}
          isDark={isDark}
          title="Tax Profile Directories"
          titleIcon={faFolderOpen}
          onRowClick={(row) => { setSelectedProfile(row); setActiveDetailTab('overview'); }}
        />
      )}

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div>
          <div className="row g-2 mb-4">
            {[
              { label: 'Total Tax Profiles', val: profiles.length, sub: 'Registered tax identities', color: erpColors.primary },
              { label: 'Company Profiles', val: 0, sub: 'Company group registries', color: '#3b82f6' },
              { label: 'Customer Profiles', val: 1, sub: 'Sales invoice profiles', color: erpColors.success },
              { label: 'Vendor Profiles', val: 1, sub: 'Supplier payable profiles', color: '#ec4899' },
              { label: 'Employee Profiles', val: 0, sub: 'Payroll withholding profiles', color: mutedColor },
              { label: 'Active Profiles', val: profiles.filter(p => p.status === 'Active').length, sub: 'Applied at invoice post', color: '#06b6d4' },
              { label: 'Inactive Profiles', val: 0, sub: 'Archived profiles', color: mutedColor },
              { label: 'FBR Registered', val: 2, sub: 'Federal Board of Revenue NTNs', color: erpColors.success },
              { label: 'Regional Registered', val: 0, sub: 'Provincial authority registrations', color: '#3b82f6' },
              { label: 'Filer Profiles', val: 2, sub: 'Active tax payers list (ATL)', color: erpColors.success },
              { label: 'Non-Filer Profiles', val: 0, sub: 'Withholding penalties applied', color: erpColors.danger },
              { label: 'Tax Exempted Profiles', val: 1, sub: 'Valid exemption certificate', color: erpColors.purple },
              { label: 'Verified Profiles', val: 2, sub: 'ATL API verified', color: erpColors.success },
              { label: 'Pending Verification', val: 0, sub: 'Awaiting portal check', color: erpColors.warning },
              { label: 'Expired Exemptions', val: 0, sub: 'Renewals required', color: erpColors.danger },
              { label: 'Today\'s Verified', val: 2, sub: 'FBR verification run today', color: erpColors.success },
              { label: 'Monthly Verified', val: 2, sub: 'Verified this month', color: '#3b82f6' },
              { label: 'Tax Profile Risk Flags', val: '0 Flags', sub: 'No blacklisted profiles', color: erpColors.success },
              { label: 'AI Tax Profile Score', val: '99 / 100', sub: 'Audit safety classification', color: erpColors.purple }
            ].map((k, idx) => (
              <div key={idx} className="col-md-2 mb-2">
                <div className="premium-card glass-card h-100" style={{ borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: mutedColor, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', lineHeight: '1.2' }}>{k.label}</div>
                  <div>
                    <div className="fw-bold mb-1" style={{ color: k.color, fontSize: '1.15rem' }}>{k.val}</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{k.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedProfile && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedProfile.code}</span>
              <h5 className="fw-bold mb-0">{selectedProfile.name}</h5>
              <span className="text-muted small">NTN: {selectedProfile.ntn} • STRN: {selectedProfile.strn}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedProfile(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'profile_info', label: 'Tax Profile Details' },
              { id: 'exemption', label: 'Exemption Certificates' },
              { id: 'wht_profile', label: 'Withholding Profiles' },
              { id: 'category_defaults', label: 'Category Defaults' },
              { id: 'registries', label: 'Regional Registries' },
              { id: 'atl_verification', label: 'FBR ATL Verification' },
              { id: 'sales_txs', label: 'Sales Transactions' },
              { id: 'purchase_txs', label: 'Purchase Transactions' },
              { id: 'withholding_txs', label: 'Withholding Transactions' },
              { id: 'journal', label: 'Journal Entries' },
              { id: 'adjustments', label: 'Adjustments' },
              { id: 'gl_mappings', label: 'GL Mappings' },
              { id: 'defaults', label: 'Default Settings' },
              { id: 'returns', label: 'Tax Returns' },
              { id: 'audits', label: 'Tax Audits' },
              { id: 'auths', label: 'Authorizations' },
              { id: 'documents', label: 'Documents' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'notes', label: 'Notes' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'audit_logs', label: 'Audit Logs' },
              { id: 'analysis', label: 'Analytics' },
              { id: 'ai', label: 'AI Insights' }
            ].map(dt => (
              <button
                key={dt.id}
                className={`premium-tab-btn btn btn-sm py-1 px-2 fw-bold ${activeDetailTab === dt.id ? 'active' : ''}`}
                style={{
                  color: activeDetailTab === dt.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                  background: activeDetailTab === dt.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  border: 'none'
                }}
                onClick={() => setActiveDetailTab(dt.id)}
              >
                {dt.label}
              </button>
            ))}
          </div>

          <div className="flex-grow-1 overflow-auto pe-2" style={{ fontSize: '0.8rem' }}>
            {activeDetailTab === 'overview' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Profile Type:</strong><span className="d-block text-muted">{selectedProfile.profileType}</span></div>
                <div className="col-md-6"><strong>Tax Authority:</strong><span className="d-block text-muted">{selectedProfile.taxAuthority}</span></div>
                <div className="col-md-6"><strong>National Tax Number (NTN):</strong><span className="d-block text-muted font-monospace">{selectedProfile.ntn}</span></div>
                <div className="col-md-6"><strong>Sales Tax Reg Number (STRN):</strong><span className="d-block text-muted font-monospace">{selectedProfile.strn}</span></div>
                <div className="col-md-6"><strong>FBR Active Status:</strong><span className="d-block text-success fw-bold">{selectedProfile.taxStatus}</span></div>
                <div className="col-md-6"><strong>Default Sales Mapped:</strong><span className="d-block text-muted">{selectedProfile.defaultTaxCategory}</span></div>
                <div className="col-md-6"><strong>Default Withholding Mapped:</strong><span className="d-block text-muted">{selectedProfile.defaultWhtCategory}</span></div>
              </div>
            )}

            {activeDetailTab === 'exemption' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Exemption Certificate Number:</strong><span className="d-block text-muted font-monospace">{selectedProfile.exemptionCertNum}</span></div>
                <div className="col-md-6"><strong>Effective Period:</strong><span className="d-block text-muted font-monospace">{selectedProfile.exemptionFrom} to {selectedProfile.exemptionTo}</span></div>
                <div className="col-md-6"><strong>Withholding Exemption Rate:</strong><span className="d-block text-success fw-bold">{selectedProfile.exemptionRate}% (Full Exemption)</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Tax Profiling & Verification</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>Verification Status: OK</strong>
                  <span className="d-block text-muted small mt-1">NTN number 4829102-4 matches Silicon Valley Sourcing record. Exemption certificate is valid and current until 2026-06-30. Active Filer status confirmed on FBR ATL.</span>
                </div>
              </div>
            )}

            {['profile_info', 'wht_profile', 'category_defaults', 'registries', 'atl_verification', 'sales_txs', 'purchase_txs', 'withholding_txs', 'journal', 'adjustments', 'gl_mappings', 'defaults', 'returns', 'audits', 'auths', 'documents', 'attachments', 'notes', 'timeline', 'audit_logs', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="premium-btn btn btn-sm btn-light" onClick={() => setSelectedProfile(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-card p-4 w-100" style={{ borderRadius: '20px', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', color: textColor }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Create Regional Tax Profile</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateProfile} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Profile Code</label>
                <input type="text" className="form-control" placeholder="TXP-VEN-LOCAL-02" value={newProfile.code} onChange={e => setNewProfile({ ...newProfile, code: e.target.value })} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-bold mb-1">Profile Name</label>
                <input type="text" className="form-control" placeholder="Local Supplier Limited Tax Profile" value={newProfile.name} onChange={e => setNewProfile({ ...newProfile, name: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Profile Type</label>
                <select className="form-select" value={newProfile.profileType} onChange={e => setNewProfile({ ...newProfile, profileType: e.target.value })}>
                  <option value="Vendor">Vendor</option>
                  <option value="Customer">Customer</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">NTN Number</label>
                <input type="text" className="form-control" placeholder="1029384-5" value={newProfile.ntn} onChange={e => setNewProfile({ ...newProfile, ntn: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">STRN Number</label>
                <input type="text" className="form-control" placeholder="1700102938415" value={newProfile.strn} onChange={e => setNewProfile({ ...newProfile, strn: e.target.value })} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Tax Authority</label>
                <select className="form-select" value={newProfile.taxAuthority} onChange={e => setNewProfile({ ...newProfile, taxAuthority: e.target.value })}>
                  <option value="Federal Board of Revenue (FBR)">Federal Board of Revenue (FBR)</option>
                  <option value="Sindh Revenue Board (SRB)">Sindh Revenue Board (SRB)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">FBR Status</label>
                <select className="form-select" value={newProfile.taxStatus} onChange={e => setNewProfile({ ...newProfile, taxStatus: e.target.value })}>
                  <option value="Filer">Active Filer</option>
                  <option value="Non-Filer">Non-Filer</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="premium-btn btn btn-sm text-white border-0 px-4" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </ErpPageShell>
  );
};

export default ErpTaxProfiles;
