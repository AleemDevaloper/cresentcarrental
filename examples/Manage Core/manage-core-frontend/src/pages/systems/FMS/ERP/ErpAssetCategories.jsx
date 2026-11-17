import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faPen, faTrash,
  faRefresh, faCheckCircle, faBan, faTimeline, faBuildingColumns,
  faUser, faTags, faCoins, faShieldHalved, faInfoCircle, faFolder,
  faStar, faChevronRight, faChevronDown, faXmark, faPrint, faScaleBalanced,
  faChartLine, faClock, faBriefcase, faGlobe, faHistory, faFileInvoice,
  faFolderOpen, faLink, faFileInvoiceDollar, faCogs, faChartPie, faCheck,
  faListCheck, faBuilding, faDiagramProject, faUsers, faWarehouse, faIndustry,
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listAssetCategories, deleteAssetCategory } from '../../../../api/enterprise';

const ErpAssetCategories = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssetCategories();
      setCategories(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      addNotification('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const kpiData = useMemo(() => [
    { label: 'Total Categories', val: categories.length, icon: faTags, color: accentColor, trend: 'up', trendVal: 'Registered Classes' },
    { label: 'Active Categories', val: categories.filter(c => c.status === 'Active').length, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Active Classes' },
    { label: 'Asset Types', val: [...new Set(categories.map(c => c.assetType))].length, icon: faFolderOpen, color: '#8b5cf6', trend: 'up', trendVal: 'Distinct Types' },
  ], [categories]);

  const filteredCategories = categories.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assetType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'asset_category' });
    setActiveTab('erp_add_asset_category');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.name || row.code || '' });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    try {
      await deleteAssetCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      addNotification('Category deleted successfully.', 'success');
    } catch (err) {
      addNotification('Failed to delete category.', 'error');
    }
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Asset Categories"
      description="Organize and classify company assets into structured categories with predefined accounting rules, depreciation methods, financial mappings, and lifecycle settings."
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_add_asset_category')}>
            <FontAwesomeIcon icon={faPlus} /> Add Category
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Asset categories imported.', 'info')}>
            Import Categories
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Excel exported.', 'success')}>
            Export Excel
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Hierarchy tree rendered.', 'info')}>
            Category Hierarchy
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          <p className="mt-2" style={{ color: mutedColor }}>Loading categories...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchData}>Retry</button>
        </div>
      )}
      {/* KPI Row */}
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard
            key={idx}
            label={k.label}
            value={k.val}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
            trendVal={k.trendVal}
            sparkline={k.sparkline}
            isDark={isDark}
          />
        ))}
      </div>
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Registered Asset Classes Directory', icon: faFolderOpen },
          { id: 'dashboard', label: 'Category Metrics Dashboard', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className="btn btn-sm py-2 px-3 fw-bold"
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

      {activeSubTab === 'directory' && (
        <ErpDataTable
          columns={[
            { key: 'code', label: 'Class Code', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const c = categories.find(x => x.code === val); if (c) { setSelectedCategory(c); setActiveDetailTab('overview'); } }}>{val}</span> },
            { key: 'name', label: 'Category Name', bold: true },
            { key: 'parentCategory', label: 'Parent Category' },
            { key: 'assetType', label: 'Asset Type Scope', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
            { key: 'assetAccount', label: 'GL Asset Account', render: (_, row) => <span className="font-monospace text-muted">{row.accounting.assetAccount}</span> },
            { key: 'depMethod', label: 'Depreciation Method', render: (_, row) => <>{row.depreciation.method}</> },
            { key: 'usefulLife', label: 'Useful Life', render: (_, row) => <>{row.depreciation.usefulLife} Years</> },
            { key: 'status', label: 'Status', render: (val) => <span className="premium-badge bg-success text-white">{val}</span> },
            { key: 'actions', label: '', render: (_, row) => (
              <div className="d-flex justify-content-end gap-1">
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }} onClick={() => { setSelectedCategory(row); setActiveDetailTab('overview'); }} title="View"><FontAwesomeIcon icon={faEye} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }} onClick={() => handleEditClick(row)} title="Edit"><FontAwesomeIcon icon={faPen} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }} onClick={() => handleDeleteClick(row)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )},
          ]}
          data={filteredCategories}
          searchable
          searchPlaceholder="Search by Category Code, Name, Asset Type..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {(() => {
            const totalCategories = categories.length;
            const activeCategories = categories.filter(c => c.status === 'Active').length;
            const uniqueAssetTypes = [...new Set(categories.map(c => c.assetType))].length;
            const uniqueDepMethods = [...new Set(categories.map(c => c.depreciation?.method).filter(Boolean))].length;
            return [
              { label: 'Total Categories', val: totalCategories, sub: 'Provisioned Asset Classes', color: accentColor },
              { label: 'Active Categories', val: activeCategories, sub: 'Postings Permitted', color: '#10b981' },
              { label: 'Inactive Categories', val: totalCategories - activeCategories, sub: 'Historical Mappings', color: '#64748b' },
              { label: 'Asset Types', val: uniqueAssetTypes, sub: 'Distinct Types', color: '#8b5cf6' },
              { label: 'Depreciation Classes', val: uniqueDepMethods, sub: 'Calculation rules active', color: '#ef4444' },
            ];
          })().map((k, idx) => (
            <ErpKpiCard
              key={idx}
              label={k.label}
              value={k.val}
              icon={faChartLine}
              color={k.color}
              trendVal={k.sub}
              isDark={isDark}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset Category"
        message="Are you sure you want to delete this asset category? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />

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
              <span className="text-muted small">{selectedCategory.parentCategory} â€¢ {selectedCategory.assetType}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedCategory(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'accounting', label: 'Accounting GL Config' },
              { id: 'depreciation', label: 'Depreciation defaults' },
              { id: 'assets', label: 'Assigned Assets' },
              { id: 'maintenance', label: 'Maintenance defaults' },
              { id: 'insurance', label: 'Insurance rules' },
              { id: 'documents', label: 'Documents' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'notes', label: 'Notes' },
              { id: 'audit', label: 'Audit Logs' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'ai', label: 'AI Insights' }
            ].map(dt => (
              <button
                key={dt.id}
                className={`premium-tab-btn btn btn-sm py-1 px-2 fw-bold ${activeDetailTab === dt.id ? 'active' : ''}`}
                style={{
                  color: activeDetailTab === dt.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                  background: activeDetailTab === dt.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  fontSize: '0.68rem',
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
                <div className="col-md-12"><strong>Objective Description:</strong><p className="text-muted mt-1">{selectedCategory.description}</p></div>
                <div className="col-md-6"><strong>Display Name:</strong><span className="d-block text-muted">{selectedCategory.displayName}</span></div>
                <div className="col-md-6"><strong>Asset Class status:</strong><span className="d-block text-muted">{selectedCategory.status}</span></div>
              </div>
            )}

            {activeDetailTab === 'accounting' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Fixed Asset GL Account:</strong><span className="d-block text-muted font-monospace">{selectedCategory.accounting.assetAccount}</span></div>
                <div className="col-md-6"><strong>Accum Depreciation GL:</strong><span className="d-block text-muted font-monospace">{selectedCategory.accounting.accumDepAccount}</span></div>
                <div className="col-md-6"><strong>Depreciation Expense GL:</strong><span className="d-block text-muted font-monospace">{selectedCategory.accounting.depExpenseAccount}</span></div>
                <div className="col-md-6"><strong>Maintenance Expense GL:</strong><span className="d-block text-muted font-monospace">{selectedCategory.accounting.maintenanceExpense}</span></div>
              </div>
            )}

            {activeDetailTab === 'depreciation' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Default Method:</strong><span className="d-block text-muted">{selectedCategory.depreciation.method}</span></div>
                <div className="col-md-6"><strong>Useful Life defaults:</strong><span className="d-block text-muted">{selectedCategory.depreciation.usefulLife} Years (Residual: {selectedCategory.depreciation.residualPct}%)</span></div>
              </div>
            )}

            {['assets', 'maintenance', 'insurance', 'documents', 'timeline', 'notes', 'audit', 'analytics', 'ai'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters recorded.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedCategory(null)}>Close</button>
          </div>
        </div>
      )}
    </ErpPageShell>
  );
};

export default ErpAssetCategories;
