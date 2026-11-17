import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faEye, faRefresh, faTags, faInfoCircle, faXmark,
  faFolderOpen, faChartPie, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { erpColors } from '../../../../components/ui/ux/ErpTheme';

const ErpTaxCategories = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory', 'dashboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - replace with real API when available
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mock Database for Tax Categories
  const [categories, setCategories] = useState([
    {
      id: 1,
      code: 'TAX-CAT-SRB-01',
      name: 'Sindh Revenue Board Services Sales Tax',
      displayName: 'SRB Services Sales Tax (15%)',
      shortName: 'SRB Services 15%',
      company: 'ManageCore Global Inc.',
      branch: 'Karachi Branch',
      businessUnit: 'Consulting Division',
      department: 'Corporate Consulting',
      taxCategoryGroup: 'Sales Tax',
      taxAuthority: 'Sindh Revenue Board (SRB)',
      defaultRate: 15,
      glCode: '22400',
      glName: 'SRB Sales Tax Payable',
      defaultSalesAccount: '22410 - SRB Output Tax',
      defaultPurchaseAccount: '12410 - SRB Input Tax Claimable',
      defaultWithholdingAccount: '22420 - SRB Tax Withheld At Source',
      status: 'Active'
    },
    {
      id: 2,
      code: 'TAX-CAT-FBR-GST',
      name: 'Federal Board of Revenue General Sales Tax',
      displayName: 'FBR GST (18%)',
      shortName: 'FBR GST 18%',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Logistics Division',
      department: 'Procurement',
      taxCategoryGroup: 'Sales Tax',
      taxAuthority: 'Federal Board of Revenue (FBR)',
      defaultRate: 18,
      glCode: '22500',
      glName: 'FBR GST Payable Ledger',
      defaultSalesAccount: '22510 - FBR GST Output Ledger',
      defaultPurchaseAccount: '12510 - FBR GST Input Claimable',
      defaultWithholdingAccount: '22520 - FBR Withholding Payable',
      status: 'Active'
    }
  ]);

  const [newCategory, setNewCategory] = useState({
    code: '', name: '', displayName: '', shortName: '', taxAuthority: 'Federal Board of Revenue (FBR)',
    taxCategoryGroup: 'Sales Tax', defaultRate: '', glCode: '', glName: ''
  });

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategory.code || !newCategory.name) {
      addNotification('Category Code and Name are required.', 'danger');
      return;
    }
    const added = {
      id: Date.now(),
      code: newCategory.code,
      name: newCategory.name,
      displayName: newCategory.displayName || newCategory.name,
      shortName: newCategory.shortName || newCategory.name,
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance & Treasury',
      taxCategoryGroup: newCategory.taxCategoryGroup,
      taxAuthority: newCategory.taxAuthority,
      defaultRate: parseFloat(newCategory.defaultRate || '0'),
      glCode: newCategory.glCode || '22500',
      glName: newCategory.glName || 'Tax Payable Ledger',
      defaultSalesAccount: '22510 - Sales Output Tax Ledger',
      defaultPurchaseAccount: '12510 - Purchase Input Tax Ledger',
      defaultWithholdingAccount: '22520 - Withholding Tax Payable Ledger',
      status: 'Active'
    };
    setCategories([...categories, added]);
    setShowAddModal(false);
    addNotification('Tax category configured successfully.', 'success');
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.taxAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { key: 'code', label: 'Category Code', render: (val, row) => (
      <span className="fw-bold font-monospace" style={{ color: erpColors.primary, cursor: 'pointer' }}
        onClick={() => { setSelectedCategory(row); setActiveDetailTab('overview'); }}>
        {val}
      </span>
    )},
    { key: 'name', label: 'Category Name', bold: true },
    { key: 'taxAuthority', label: 'Tax Authority' },
    { key: 'taxCategoryGroup', label: 'Tax Group', render: (val) => (
      <span className="premium-badge bg-secondary text-white">{val}</span>
    )},
    { key: 'defaultRate', label: 'Default Rate', render: (val) => (
      <span className="font-monospace fw-bold">{val}%</span>
    )},
    { key: '', label: 'GL Payable Account', render: (val, row) => (
      <span className="font-monospace">{row.glCode} - {row.glName}</span>
    )},
    { key: 'defaultSalesAccount', label: 'Sales Mapped', render: (val) => (
      <span className="text-muted small">{val}</span>
    )},
    { key: 'defaultPurchaseAccount', label: 'Purchase Mapped', render: (val) => (
      <span className="text-muted small">{val}</span>
    )},
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.65rem' }}
        onClick={() => { setSelectedCategory(row); setActiveDetailTab('overview'); }}>
        <FontAwesomeIcon icon={faEye} />
      </button>
    )},
  ];

  const actionButtons = (
    <div className="d-flex gap-2 flex-wrap">
      <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_tax_category')}>
        <FontAwesomeIcon icon={faPlus} /> Create Category
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI compliance audit completed.', 'success')}>
        <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Tax Analysis
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
        <FontAwesomeIcon icon={faRefresh} /> Refresh
      </button>
    </div>
  );

  if (loading) {
    return (
      <ErpPageShell icon={faTags} title="Tax Categories Setup" description="Configure FBR Pakistan, SRB, PRA, KPRA, and BRA regional sales tax compliance categories and GL mapping rules." action={actionButtons}>
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
    <ErpPageShell icon={faTags} title="Tax Categories Setup" description="Configure FBR Pakistan, SRB, PRA, KPRA, and BRA regional sales tax compliance categories and GL mapping rules." action={actionButtons}>

      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Tax Category Registries', icon: faFolderOpen },
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
          data={filteredCategories}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by Code, Name, Tax Authority..."
          emptyMessage="No tax categories found."
          emptyIcon={faTags}
          isDark={isDark}
          title="Tax Category Registries"
          titleIcon={faFolderOpen}
          onRowClick={(row) => { setSelectedCategory(row); setActiveDetailTab('overview'); }}
        />
      )}

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div>
          <div className="row g-2 mb-4">
            {[
              { label: 'Total Tax Categories', val: categories.length, sub: 'Tax templates defined', color: erpColors.primary },
              { label: 'Active Categories', val: categories.filter(c => c.status === 'Active').length, sub: 'Applied at sales invoices', color: erpColors.success },
              { label: 'Inactive Categories', val: 0, sub: 'Archived tax definitions', color: mutedColor },
              { label: 'Sales Tax Categories', val: 2, sub: 'GST/SST rate cards', color: '#3b82f6' },
              { label: 'Purchase Tax Categories', val: 2, sub: 'Input tax offset cards', color: '#06b6d4' },
              { label: 'Withholding Categories', val: 0, sub: 'Filer withholding schedules', color: erpColors.warning },
              { label: 'Customs Duty Categories', val: 0, sub: 'Import duties templates', color: erpColors.purple },
              { label: 'Federal Excise Categories', val: 0, sub: 'FED schedule codes', color: mutedColor },
              { label: 'Provincial Tax Categories', val: 1, sub: 'SRB/PRA/KPRA service codes', color: '#ec4899' },
              { label: 'Reconciled Categories', val: 2, sub: 'GL accounts mapped cleanly', color: erpColors.success },
              { label: 'Unreconciled Categories', val: 0, sub: 'GL codes mismatch error', color: erpColors.danger },
              { label: 'Active Tax Authorities', val: '2 Authorities', sub: 'FBR & SRB active portals', color: erpColors.success },
              { label: 'Version Mapped Categories', val: 2, sub: 'Dated rate history loaded', color: '#3b82f6' },
              { label: 'Mapped GL Accounts', val: '6 Ledger Accounts', sub: 'Input/Output GL configurations', color: '#06b6d4' },
              { label: 'Mapped Sales Accounts', val: 2, sub: 'Revenue tax codes linked', color: '#3b82f6' },
              { label: 'Mapped Purchase Accounts', val: 2, sub: 'Asset/Expense tax codes linked', color: '#06b6d4' },
              { label: 'Today\'s Tax Postings', val: '$22,500', sub: 'Calculated tax posted today', color: erpColors.success },
              { label: 'Monthly Tax Postings', val: '$22,500', sub: 'Tax posted this month', color: '#3b82f6' },
              { label: 'AI Tax Compliance Score', val: '99 / 100', sub: 'FBR audit compliance score', color: erpColors.purple }
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
      {selectedCategory && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedCategory.code}</span>
              <h5 className="fw-bold mb-0">{selectedCategory.name}</h5>
              <span className="text-muted small">Authority: {selectedCategory.taxAuthority} • Default Rate: {selectedCategory.defaultRate}%</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedCategory(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'rates', label: 'Tax Rates' },
              { id: 'profiles', label: 'Tax Profiles' },
              { id: 'sales_txs', label: 'Sales Transactions' },
              { id: 'purchase_txs', label: 'Purchase Transactions' },
              { id: 'withholding', label: 'Withholding Transactions' },
              { id: 'journal', label: 'Journal Entries' },
              { id: 'adjustments', label: 'Tax Adjustments' },
              { id: 'gl_mappings', label: 'General Ledger Mappings' },
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
                <div className="col-md-6"><strong>Tax Group:</strong><span className="d-block text-muted">{selectedCategory.taxCategoryGroup}</span></div>
                <div className="col-md-6"><strong>Tax Authority:</strong><span className="d-block text-muted">{selectedCategory.taxAuthority}</span></div>
                <div className="col-md-6"><strong>Default Rate:</strong><span className="d-block text-muted">{selectedCategory.defaultRate}%</span></div>
                <div className="col-md-6"><strong>GL Payable Account:</strong><span className="d-block text-muted font-monospace">{selectedCategory.glCode} - {selectedCategory.glName}</span></div>
                <div className="col-md-6"><strong>Default Sales Mapped:</strong><span className="d-block text-muted font-monospace">{selectedCategory.defaultSalesAccount}</span></div>
                <div className="col-md-6"><strong>Default Purchase Mapped:</strong><span className="d-block text-muted font-monospace">{selectedCategory.defaultPurchaseAccount}</span></div>
                <div className="col-md-6"><strong>Default Withholding Mapped:</strong><span className="d-block text-muted font-monospace">{selectedCategory.defaultWithholdingAccount}</span></div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Compliance Insights</h6>
                <div className="p-3 rounded border bg-light-success mt-2">
                  <strong>Tax Rate Validation: OK</strong>
                  <span className="d-block text-muted small mt-1">Default rate configuration matches FBR sales tax schedule for services and SRB local rules. No overlapping effective dates detected.</span>
                </div>
              </div>
            )}

            {['rates', 'profiles', 'sales_txs', 'purchase_txs', 'withholding', 'journal', 'adjustments', 'gl_mappings', 'defaults', 'returns', 'audits', 'auths', 'documents', 'attachments', 'notes', 'timeline', 'audit_logs', 'analysis'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="premium-btn btn btn-sm btn-light" onClick={() => setSelectedCategory(null)}>Close</button>
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
              <h5 className="fw-bold mb-0">Create Regional Tax Category</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateCategory} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Category Code</label>
                <input type="text" className="form-control" placeholder="TAX-CAT-PRA-01" value={newCategory.code} onChange={e => setNewCategory({ ...newCategory, code: e.target.value })} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-bold mb-1">Category Name</label>
                <input type="text" className="form-control" placeholder="Punjab Revenue Authority Services Tax" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Tax Group</label>
                <select className="form-select" value={newCategory.taxCategoryGroup} onChange={e => setNewCategory({ ...newCategory, taxCategoryGroup: e.target.value })}>
                  <option value="Sales Tax">Sales Tax</option>
                  <option value="Withholding Tax">Withholding Tax</option>
                  <option value="Customs Duty">Customs Duty</option>
                  <option value="Federal Excise">Federal Excise</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Tax Authority</label>
                <select className="form-select" value={newCategory.taxAuthority} onChange={e => setNewCategory({ ...newCategory, taxAuthority: e.target.value })}>
                  <option value="Federal Board of Revenue (FBR)">FBR - Federal</option>
                  <option value="Sindh Revenue Board (SRB)">SRB - Sindh</option>
                  <option value="Punjab Revenue Authority (PRA)">PRA - Punjab</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Default Rate (%)</label>
                <input type="number" className="form-control" value={newCategory.defaultRate} onChange={e => setNewCategory({ ...newCategory, defaultRate: e.target.value })} required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">GL Account Code</label>
                <input type="text" className="form-control" placeholder="22400" value={newCategory.glCode} onChange={e => setNewCategory({ ...newCategory, glCode: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold mb-1">GL Account Name</label>
                <input type="text" className="form-control" placeholder="PRA Services Sales Tax Payable" value={newCategory.glName} onChange={e => setNewCategory({ ...newCategory, glName: e.target.value })} />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="premium-btn btn btn-sm text-white border-0 px-4" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </ErpPageShell>
  );
};

export default ErpTaxCategories;
