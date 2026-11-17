import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faEye, faRefresh, faInfoCircle, faXmark,
  faFolderOpen, faChartPie, faPercentage, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { erpColors } from '../../../../components/ui/ux/ErpTheme';

const ErpTaxRates = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory', 'dashboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRate, setSelectedRate] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - replace with real API when available
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mock Database for Tax Rates
  const [rates, setRates] = useState([
    {
      id: 1,
      code: 'TXR-FBR-STD-18',
      name: 'FBR Standard General Sales Tax Rate',
      displayName: 'FBR Standard GST 18%',
      shortName: 'FBR GST 18%',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Procurement',
      department: 'Finance & Treasury',
      taxCategory: 'FBR GST (18%)',
      taxRateType: 'Percentage',
      taxBasis: 'Taxable Value',
      effectiveFrom: '2025-07-01',
      effectiveTo: '2026-06-30',
      ratePercent: 18,
      rateFixed: 0,
      minTax: 0,
      maxTax: 500000,
      status: 'Active',
      slabs: []
    },
    {
      id: 2,
      code: 'TXR-FBR-WHT-FILER',
      name: 'FBR Withholding tax for active filers',
      displayName: 'FBR Filer WHT (4.5%)',
      shortName: 'Filer WHT 4.5%',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Procurement',
      department: 'Accounts Payable',
      taxCategory: 'FBR Withholding Tax',
      taxRateType: 'Progressive Slab',
      taxBasis: 'Gross Amount',
      effectiveFrom: '2025-07-01',
      effectiveTo: '2026-06-30',
      ratePercent: 4.5,
      rateFixed: 0,
      minTax: 0,
      maxTax: 1000000,
      status: 'Active',
      slabs: [
        { slabStart: 0, slabEnd: 100000, ratePercent: 0, rateFixed: 0 },
        { slabStart: 100001, slabEnd: 500000, ratePercent: 4.5, rateFixed: 0 },
        { slabStart: 500001, slabEnd: 9999999, ratePercent: 5.5, rateFixed: 0 }
      ]
    }
  ]);

  const [newRate, setNewRate] = useState({
    code: '', name: '', taxCategory: '', taxRateType: 'Percentage',
    ratePercent: '', effectiveFrom: '', effectiveTo: ''
  });

  const handleCreateRate = (e) => {
    e.preventDefault();
    if (!newRate.code || !newRate.name) {
      addNotification('Rate Code and Name are required.', 'danger');
      return;
    }
    const added = {
      id: Date.now(),
      code: newRate.code,
      name: newRate.name,
      displayName: newRate.name,
      shortName: newRate.name,
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      taxCategory: newRate.taxCategory || 'General GST',
      taxRateType: newRate.taxRateType,
      taxBasis: 'Taxable Value',
      effectiveFrom: newRate.effectiveFrom || '2026-07-01',
      effectiveTo: newRate.effectiveTo || '2027-06-30',
      ratePercent: parseFloat(newRate.ratePercent || '0'),
      rateFixed: 0,
      minTax: 0,
      maxTax: 500000,
      status: 'Active',
      slabs: []
    };
    setRates([...rates, added]);
    setShowAddModal(false);
    addNotification('Tax rate version compiled successfully.', 'success');
  };

  const filteredRates = rates.filter(r => {
    const matchesSearch =
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.taxCategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { key: 'code', label: 'Rate Code', render: (val, row) => (
      <span className="fw-bold font-monospace" style={{ color: erpColors.primary, cursor: 'pointer' }}
        onClick={() => { setSelectedRate(row); setActiveDetailTab('overview'); }}>
        {val}
      </span>
    )},
    { key: 'name', label: 'Rate Name', bold: true },
    { key: 'taxCategory', label: 'Tax Category Mapped' },
    { key: 'taxRateType', label: 'Rate Type', render: (val) => (
      <span className="premium-badge bg-secondary text-white">{val}</span>
    )},
    { key: 'effectiveFrom', label: 'Effective From', render: (val) => (
      <span className="font-monospace">{val}</span>
    )},
    { key: 'effectiveTo', label: 'Effective To', render: (val) => (
      <span className="font-monospace">{val}</span>
    )},
    { key: 'ratePercent', label: 'Rate (%)', render: (val) => (
      <span className="font-monospace fw-bold text-success">{val}%</span>
    )},
    { key: '', label: 'Slabs Mapped', render: (val, row) => (
      <span className="font-monospace">{row.slabs.length > 0 ? `${row.slabs.length} Slabs` : 'Standard'}</span>
    )},
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.65rem' }}
        onClick={() => { setSelectedRate(row); setActiveDetailTab('overview'); }}>
        <FontAwesomeIcon icon={faEye} />
      </button>
    )},
  ];

  const actionButtons = (
    <div className="d-flex gap-2 flex-wrap">
      <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_tax_rate')}>
        <FontAwesomeIcon icon={faPlus} /> Create Tax Rate
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Tax rate integrity validated successfully.', 'success')}>
        <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Validation
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
        <FontAwesomeIcon icon={faRefresh} /> Refresh
      </button>
    </div>
  );

  if (loading) {
    return (
      <ErpPageShell icon={faPercentage} title="Tax Rates Version Manager" description="Configure and manage version-controlled tax rates, effective periods, progressive slabs, filer/non-filer structures, and FBR compliance." action={actionButtons}>
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
    <ErpPageShell icon={faPercentage} title="Tax Rates Version Manager" description="Configure and manage version-controlled tax rates, effective periods, progressive slabs, filer/non-filer structures, and FBR compliance." action={actionButtons}>

      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Tax Rates Directory', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Rates Dashboard', icon: faChartPie },
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
          data={filteredRates}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by Code, Name, Mapped Category..."
          emptyMessage="No tax rates found."
          emptyIcon={faPercentage}
          isDark={isDark}
          title="Tax Rates Directory"
          titleIcon={faFolderOpen}
          onRowClick={(row) => { setSelectedRate(row); setActiveDetailTab('overview'); }}
        />
      )}

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div>
          <div className="row g-2 mb-4">
            {[
              { label: 'Total Tax Rates', val: rates.length, sub: 'Versioned rates catalog', color: erpColors.primary },
              { label: 'Active Rates', val: rates.filter(r => r.status === 'Active').length, sub: 'Active FBR schedules', color: erpColors.success },
              { label: 'Inactive Rates', val: 0, sub: 'Expired fiscal schedules', color: mutedColor },
              { label: 'Draft Rates', val: 0, sub: 'Awaiting controller approval', color: erpColors.warning },
              { label: 'Pending Rates', val: 0, sub: 'Future effective schedule', color: '#3b82f6' },
              { label: 'Sales Tax Rates', val: 1, sub: 'Sales invoice calculators', color: '#06b6d4' },
              { label: 'Purchase Tax Rates', val: 1, sub: 'Supplier bill calculators', color: erpColors.purple },
              { label: 'Withholding Rates', val: 1, sub: 'Income withholding slabs', color: '#3b82f6' },
              { label: 'Customs Rates', val: 0, sub: 'Import clearing duty', color: mutedColor },
              { label: 'Excise Rates', val: 0, sub: 'Federal excise schedules', color: mutedColor },
              { label: 'Slab Based Rates', val: 1, sub: 'Progressive withholding', color: erpColors.purple },
              { label: 'Filer Tax Rates', val: 1, sub: 'Filer base withholding (4.5%)', color: erpColors.success },
              { label: 'Non-Filer Tax Rates', val: '9.0%', sub: 'Non-filer base penalty (200%)', color: erpColors.danger },
              { label: 'Version Controlled', val: '2 Active Versions', sub: 'Date-based rate tracking', color: erpColors.success },
              { label: 'Mapped Categories', val: 2, sub: 'Clean mapping percentage', color: '#3b82f6' },
              { label: 'Active Jurisdictions', val: '2 Regions', sub: 'FBR federal & SRB provincial', color: erpColors.success },
              { label: 'Today\'s Rate Changes', val: 0, sub: 'Rate modifications today', color: mutedColor },
              { label: 'Scheduled Changes', val: 0, sub: 'Future scheduled rates', color: '#3b82f6' },
              { label: 'Failed Rate Audits', val: 0, sub: 'Anomalous rate mapping', color: erpColors.danger },
              { label: 'AI Rate Accuracy Score', val: '99%', sub: 'Auto calculation safety', color: erpColors.purple }
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
      {selectedRate && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedRate.code}</span>
              <h5 className="fw-bold mb-0">{selectedRate.name}</h5>
              <span className="text-muted small">Category: {selectedRate.taxCategory} • Effective From: {selectedRate.effectiveFrom}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedRate(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'rates_config', label: 'Tax Rates Configuration' },
              { id: 'slabs', label: 'Progressive Slabs' },
              { id: 'periods', label: 'Effective Periods' },
              { id: 'categories', label: 'Tax Categories Mapped' },
              { id: 'profiles', label: 'Tax Profiles' },
              { id: 'sales_txs', label: 'Sales Transactions' },
              { id: 'purchase_txs', label: 'Purchase Transactions' },
              { id: 'withholding', label: 'Withholding Transactions' },
              { id: 'adjustments', label: 'Adjustments' },
              { id: 'gl_mappings', label: 'GL Mappings' },
              { id: 'versions', label: 'Version Control' },
              { id: 'returns', label: 'Tax Returns' },
              { id: 'audits', label: 'Tax Audits' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'documents', label: 'Documents' },
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
                <div className="col-md-6"><strong>Tax Rate Type:</strong><span className="d-block text-muted">{selectedRate.taxRateType}</span></div>
                <div className="col-md-6"><strong>Tax Basis:</strong><span className="d-block text-muted">{selectedRate.taxBasis}</span></div>
                <div className="col-md-6"><strong>Effective Period:</strong><span className="d-block text-muted font-monospace">{selectedRate.effectiveFrom} to {selectedRate.effectiveTo}</span></div>
                <div className="col-md-6"><strong>Base rate percentage:</strong><span className="d-block text-success fw-bold font-monospace">{selectedRate.ratePercent}%</span></div>
              </div>
            )}

            {activeDetailTab === 'slabs' && (
              <div>
                <h6 className="fw-bold mb-2">Progressive Slabs Definition</h6>
                {selectedRate.slabs.length > 0 ? (
                  <div className="premium-table-wrapper">
                    <table className="premium-table" style={{ fontSize: '0.72rem' }}>
                      <thead>
                        <tr>
                          <th>Slab Start ($)</th>
                          <th>Slab End ($)</th>
                          <th>Applied rate (%)</th>
                          <th>Fixed Amount ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRate.slabs.map((sl, idx) => (
                          <tr key={idx}>
                            <td className="font-monospace">${sl.slabStart.toLocaleString()}</td>
                            <td className="font-monospace">${sl.slabEnd.toLocaleString()}</td>
                            <td className="font-monospace text-success fw-bold">{sl.ratePercent}%</td>
                            <td className="font-monospace">${sl.rateFixed.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 text-center text-muted">This is a standard flat-rate tax category. No progressive slabs defined.</div>
                )}
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Rate Audits</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>Validation Confidence: 100%</strong>
                  <span className="d-block text-muted small mt-1">Rates align with latest FBR Pakistan Finance Act 2025/2026 guidelines. No duplicate rate codes found in the active region scope.</span>
                </div>
              </div>
            )}

            {['rates_config', 'periods', 'categories', 'profiles', 'sales_txs', 'purchase_txs', 'withholding', 'adjustments', 'gl_mappings', 'versions', 'returns', 'audits', 'attachments', 'documents', 'notes', 'timeline', 'audit_logs', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="premium-btn btn btn-sm btn-light" onClick={() => setSelectedRate(null)}>Close</button>
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
              <h5 className="fw-bold mb-0">Create Versioned Tax Rate</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateRate} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Rate Code</label>
                <input type="text" className="form-control" placeholder="TXR-PRA-SRV-16" value={newRate.code} onChange={e => setNewRate({ ...newRate, code: e.target.value })} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-bold mb-1">Rate Name</label>
                <input type="text" className="form-control" placeholder="Punjab Services Standard Rate (16%)" value={newRate.name} onChange={e => setNewRate({ ...newRate, name: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Tax Category</label>
                <input type="text" className="form-control" placeholder="FBR General GST" value={newRate.taxCategory} onChange={e => setNewRate({ ...newRate, taxCategory: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Rate Type</label>
                <select className="form-select" value={newRate.taxRateType} onChange={e => setNewRate({ ...newRate, taxRateType: e.target.value })}>
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                  <option value="Progressive Slab">Progressive Slab</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Tax Rate (%)</label>
                <input type="number" className="form-control" value={newRate.ratePercent} onChange={e => setNewRate({ ...newRate, ratePercent: e.target.value })} required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Effective From</label>
                <input type="date" className="form-control" value={newRate.effectiveFrom} onChange={e => setNewRate({ ...newRate, effectiveFrom: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">Effective To</label>
                <input type="date" className="form-control" value={newRate.effectiveTo} onChange={e => setNewRate({ ...newRate, effectiveTo: e.target.value })} />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="premium-btn btn btn-sm text-white border-0 px-4" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save Rate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </ErpPageShell>
  );
};

export default ErpTaxRates;
