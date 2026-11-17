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
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf,
  faBarcode, faQrcode, faWrench, faFileContract, faPercent, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listAssets, getAssetStats, deleteAsset } from '../../../../api/enterprise';

const ErpFixedAssets = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const accentColor = '#6366f1';

  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssets();
      setAssets(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load assets');
      addNotification('Failed to load assets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const kpiData = useMemo(() => [
    { label: 'Total Assets', val: assets.length, icon: faBuildingColumns, color: accentColor, trend: 'up', trendVal: 'Registered Assets' },
    { label: 'Active Assets', val: assets.filter(a => a.status === 'Active').length, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'In Use' },
    { label: 'Total Book Value', val: '$' + assets.reduce((s, a) => s + a.financialInfo.bookValue, 0).toLocaleString(), icon: faCoins, color: '#3b82f6', trend: 'up', trendVal: 'Net Book Value' },
    { label: 'Total Acquisition Cost', val: '$' + assets.reduce((s, a) => s + a.purchaseInfo.acquisitionCost, 0).toLocaleString(), icon: faHandHoldingDollar, color: '#8b5cf6', trend: 'up', trendVal: 'Capitalized Cost' },
    { label: 'Compliant Assets', val: assets.filter(a => a.complianceInfo.status === 'Compliant').length, icon: faCheckSquare, color: '#10b981', trend: 'up', trendVal: 'Audit Passed' },
    { label: 'Insured Assets', val: assets.filter(a => a.insuranceInfo.status === 'Active').length, icon: faShieldHalved, color: '#06b6d4', trend: 'up', trendVal: 'Policies Active' },
  ], [assets]);

  const filteredAssets = assets.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'fixed_asset' });
    setActiveTab('erp_add_asset');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.name || row.code || '' });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    try {
      await deleteAsset(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      addNotification('Asset deleted successfully.', 'success');
    } catch (err) {
      addNotification('Failed to delete asset.', 'error');
    }
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const dashboardKpis = useMemo(() => {
    const totalAssets = assets.length;
    const activeAssets = assets.filter(a => a.status === 'Active').length;
    const totalAcqCost = assets.reduce((acc, curr) => acc + (curr.purchaseInfo?.acquisitionCost || 0), 0);
    const totalBookValue = assets.reduce((acc, curr) => acc + (curr.financialInfo?.bookValue || 0), 0);
    const totalAccumDep = assets.reduce((acc, curr) => acc + (curr.financialInfo?.accumDepreciation || 0), 0);
    const insuredAssets = assets.filter(a => a.insuranceInfo?.status === 'Active').length;
    const warrantyAssets = assets.filter(a => a.warrantyInfo?.status === 'Active').length;
    const compliantAssets = assets.filter(a => a.complianceInfo?.status === 'Compliant').length;
    const avgCost = totalAssets > 0 ? totalAcqCost / totalAssets : 0;
    return [
      { label: 'Total Assets', val: totalAssets, sub: 'Registered Master Records', color: accentColor },
      { label: 'Active Assets', val: activeAssets, sub: 'In Active Capital Use', color: '#10b981' },
      { label: 'Inactive Assets', val: totalAssets - activeAssets, sub: 'Mothballed/Idle', color: '#64748b' },
      { label: 'Under Warranty', val: warrantyAssets, sub: 'Vendor Warranties Mapped', color: '#3b82f6' },
      { label: 'Insured Assets', val: insuredAssets, sub: 'Policies Active', color: '#10b981' },
      { label: 'Compliant Assets', val: compliantAssets, sub: 'Audit Passed', color: '#10b981' },
      { label: 'Asset Value', val: '$' + totalAcqCost.toLocaleString(), sub: 'Total Acquisition Cost', color: '#10b981' },
      { label: 'Current Book Value', val: '$' + totalBookValue.toLocaleString(), sub: 'Net Book Value (NBV)', color: '#3b82f6' },
      { label: 'Accumulated Depreciation', val: '$' + totalAccumDep.toLocaleString(), sub: 'Historical Allowances', color: '#ef4444' },
      { label: 'Average Asset Cost', val: '$' + avgCost.toLocaleString(), sub: 'Capital Sourcing average', color: '#06b6d4' },
    ];
  }, [assets]);

  const assetColumns = [
    { key: 'code', label: 'Asset Code', bold: true },
    { key: 'name', label: 'Asset Name' },
    { key: 'category', label: 'Category & Type' },
    { key: 'tagNumber', label: 'Serial / Tag' },
    { key: 'capitalized', label: 'Capitalized Cost' },
    { key: 'bookValue', label: 'Book Value' },
    { key: 'costCenter', label: 'Cost Center' },
    { key: 'status', label: 'Status' },
  ];

  const headerActions = (
    <div className="d-flex gap-2 flex-wrap">
        <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_add_asset')}>
          <FontAwesomeIcon icon={faPlus} /> Add Asset
        </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Import assets wizard launched.', 'info')}>
        Import Assets
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Excel Sheet exported.', 'success')}>
        Export Excel
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('QR labels generated for printing.', 'success')}>
        <FontAwesomeIcon icon={faQrcode} className="me-1" /> Generate QR Labels
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Barcode labels generated.', 'success')}>
        <FontAwesomeIcon icon={faBarcode} className="me-1" /> Generate Barcode Labels
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Asset physical audit checklist prepared.', 'info')}>
        Asset Audit
      </button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faBuildingColumns}
      title="Fixed Asset Register"
      description="Manage the complete lifecycle of company assets including acquisition, capitalization, depreciation, maintenance, transfers, insurance, audits, and disposals."
      action={headerActions}
    >
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          <p className="mt-2" style={{ color: mutedColor }}>Loading assets...</p>
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
      {/* Sub-tab selector */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Central Asset Master Register', icon: faFolderOpen },
          { id: 'dashboard', label: 'Asset Lifecycle Dashboard', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className={`premium-tab-btn btn btn-sm py-2 px-3 fw-bold`}
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
        <div>
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <div className="row g-2">
              <div className="col-md-8">
                <input type="text" className="form-control form-control-sm" placeholder="Search by Asset Name, Code, Serial Number, Category..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="col-md-4">
                <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 mb-4" style={{ borderRadius: '16px' }}>
            <ErpDataTable
              columns={assetColumns}
              data={filteredAssets}
              isDark={isDark}
              searchable={false}
              renderRow={(a, i, ctx) => (
                <tr key={a.id}>
                  <td className="font-monospace fw-bold" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => { setSelectedAsset(a); setActiveDetailTab('overview'); }}>{a.code}</td>
                  <td className="fw-bold" style={{ color: textColor }}>{a.name}</td>
                  <td style={{ color: textColor }}>{a.category} â€¢ {a.assetType}</td>
                  <td><span className="premium-badge" style={{ background: isDark ? '#334155' : '#f1f5f9', color: textColor }}>{a.tagNumber}</span></td>
                  <td className="font-monospace fw-bold" style={{ color: '#10b981' }}>${a.purchaseInfo.totalCapitalized.toLocaleString()}</td>
                  <td className="font-monospace fw-bold" style={{ color: textColor }}>${a.financialInfo.bookValue.toLocaleString()}</td>
                  <td className="font-monospace" style={{ color: mutedColor }}>{a.financialInfo.costCenter}</td>
                  <td>
                    <span className="premium-badge" style={{
                      background: a.status === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fce7e7'),
                      color: a.status === 'Active' ? '#10b981' : '#ef4444'
                    }}>{a.status}</span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }} onClick={() => { setSelectedAsset(a); setActiveDetailTab('overview'); }} title="View"><FontAwesomeIcon icon={faEye} /></button>
                      <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }} onClick={() => handleEditClick(a)} title="Edit"><FontAwesomeIcon icon={faPen} /></button>
                      <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }} onClick={() => handleDeleteClick(a)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div>
          <div className="row g-2 mb-4">
            {dashboardKpis.map((k, idx) => (
              <div key={idx} className="col-md-2 mb-2">
                <div className="glass-card h-100" style={{
                  borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = isDark ? '0 24px 48px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ color: mutedColor, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', lineHeight: '1.2' }}>{k.label}</div>
                  <div>
                    <div className="fw-bold mb-1" style={{ color: k.color, fontSize: '1.15rem' }}>{k.val}</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{k.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="glass-card p-4 h-100" style={{ borderRadius: '16px', color: textColor }}>
                <h6 className="fw-bold" style={{ color: textColor }}>Capital Asset Category Mappings</h6>
                <div className="d-flex flex-column gap-3 mt-3" style={{ fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: textColor }}>IT Equipment (Servers, Networking) - 60%</span>
                    <div className="progress mt-1" style={{ height: '8px', background: isDark ? '#374151' : '#e5e7eb' }}><div className="progress-bar bg-primary" style={{ width: '60%' }}></div></div>
                  </div>
                  <div>
                    <span style={{ color: textColor }}>Vehicles (Tesla Semis, Logistics) - 40%</span>
                    <div className="progress mt-1" style={{ height: '8px', background: isDark ? '#374151' : '#e5e7eb' }}><div className="progress-bar bg-success" style={{ width: '40%' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass-card p-4 h-100" style={{ borderRadius: '16px', color: textColor }}>
                <h6 className="fw-bold" style={{ color: textColor }}>Physical Location Mappings</h6>
                <div className="d-flex flex-column gap-2 mt-3" style={{ fontSize: '0.8rem' }}>
                  <div className="d-flex justify-content-between" style={{ color: textColor }}><span>New York Corporate Headquarters</span><strong>60%</strong></div>
                  <div className="d-flex justify-content-between" style={{ color: textColor }}><span>Detroit Assembly Plant Floor</span><strong>40%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedAsset && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', color: textColor,
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
            <div>
              <span className="premium-badge" style={{ background: '#6366f1', color: '#fff', marginBottom: '0.25rem' }}>{selectedAsset.code} ({selectedAsset.number})</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedAsset.name}</h5>
              <span style={{ color: mutedColor, fontSize: '0.85rem' }}>{selectedAsset.category} â€¢ {selectedAsset.assetType}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedAsset(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'financial', label: 'Financial' },
              { id: 'depreciation', label: 'Depreciation Schedule' },
              { id: 'maintenance', label: 'Maintenance' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'warranty', label: 'Warranty' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'transfers', label: 'Transfers' },
              { id: 'repairs', label: 'Repairs' },
              { id: 'documents', label: 'Documents' },
              { id: 'photos', label: 'Photos' },
              { id: 'timeline', label: 'Timeline' },
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
                <div className="col-md-6"><strong style={{ color: textColor }}>Display Name:</strong><span className="d-block" style={{ color: mutedColor }}>{selectedAsset.displayName}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Manufacturer:</strong><span className="d-block" style={{ color: mutedColor }}>{selectedAsset.manufacturer} ({selectedAsset.countryOrigin})</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Serial/Model:</strong><span className="d-block" style={{ color: mutedColor }}>{selectedAsset.serialNumber} / {selectedAsset.modelNumber}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Barcode/QR:</strong><span className="d-block font-monospace" style={{ color: mutedColor }}>{selectedAsset.barcode} / {selectedAsset.qrCode}</span></div>
                <div className="col-md-12 pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}><strong style={{ color: textColor }}>Description:</strong><p style={{ color: mutedColor }} className="mt-1">{selectedAsset.description}</p></div>
              </div>
            )}

            {activeDetailTab === 'financial' && (
              <div className="row g-3">
                <div className="col-md-6"><strong style={{ color: textColor }}>Acquisition Cost:</strong><span className="d-block fw-bold font-monospace" style={{ color: '#10b981' }}>${selectedAsset.purchaseInfo.acquisitionCost.toLocaleString()}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Total Capitalized Cost:</strong><span className="d-block fw-bold font-monospace" style={{ color: '#10b981' }}>${selectedAsset.purchaseInfo.totalCapitalized.toLocaleString()}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Current Net Book Value:</strong><span className="d-block fw-bold font-monospace" style={{ color: textColor }}>${selectedAsset.financialInfo.bookValue.toLocaleString()}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Accumulated Depreciation:</strong><span className="d-block fw-bold font-monospace" style={{ color: '#ef4444' }}>${selectedAsset.financialInfo.accumDepreciation.toLocaleString()}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Cost Center Mapping:</strong><span className="d-block font-monospace" style={{ color: mutedColor }}>{selectedAsset.financialInfo.costCenter}</span></div>
                <div className="col-md-6"><strong style={{ color: textColor }}>Useful Life:</strong><span className="d-block" style={{ color: mutedColor }}>{selectedAsset.purchaseInfo.usefulLife} Years (Residual: ${selectedAsset.purchaseInfo.residualValue.toLocaleString()})</span></div>
              </div>
            )}

            {activeDetailTab === 'depreciation' && (
              <div>
                <h6 className="fw-bold" style={{ color: textColor }}>Fiscal Year Depreciation Postings</h6>
                <div className="p-3 rounded" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                  <strong style={{ color: textColor }}>Depreciation Method:</strong> <span style={{ color: mutedColor }}>{selectedAsset.financialInfo.depMethod} ({selectedAsset.financialInfo.depFrequency})</span>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.75rem', marginTop: '0.5rem' }}>Asset Account: {selectedAsset.financialInfo.assetAccount}</span>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.75rem' }}>Accum Depreciation Account: {selectedAsset.financialInfo.accumDepAccount}</span>
                </div>
              </div>
            )}

            {activeDetailTab === 'maintenance' && (
              <div>
                <h6 className="fw-bold" style={{ color: textColor }}>Maintenance Contract & Details</h6>
                <div className="row g-2">
                  <div className="col-md-6"><strong style={{ color: textColor }}>AMC Number:</strong><span className="d-block" style={{ color: mutedColor }}>{selectedAsset.maintenanceInfo.amcNumber}</span></div>
                  <div className="col-md-6"><strong style={{ color: textColor }}>Last Maintenance:</strong><span className="d-block" style={{ color: mutedColor }}>{selectedAsset.maintenanceInfo.lastDate}</span></div>
                  <div className="col-md-12"><p style={{ color: mutedColor }} className="mt-2">{selectedAsset.maintenanceInfo.notes}</p></div>
                </div>
              </div>
            )}

            {activeDetailTab === 'insurance' && (
              <div>
                <h6 className="fw-bold" style={{ color: textColor }}>Insurance Policy Coverage</h6>
                <div className="p-3 rounded" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                  <strong style={{ color: textColor }}>{selectedAsset.insuranceInfo.company}</strong>
                  <span className="d-block" style={{ color: mutedColor }}>Policy Number: {selectedAsset.insuranceInfo.policyNumber}</span>
                  <span className="d-block" style={{ color: mutedColor }}>Coverage: ${selectedAsset.insuranceInfo.coverageAmount.toLocaleString()} (Premium: ${selectedAsset.insuranceInfo.premium.toLocaleString()} USD)</span>
                </div>
              </div>
            )}

            {activeDetailTab === 'warranty' && (
              <div>
                <h6 className="fw-bold" style={{ color: textColor }}>Vendor Warranty Certificate</h6>
                <div className="p-3 rounded" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                  <strong style={{ color: textColor }}>Provider: {selectedAsset.warrantyInfo.provider}</strong>
                  <span className="d-block" style={{ color: mutedColor }}>Warranty Number: {selectedAsset.warrantyInfo.warrantyNumber}</span>
                  <span className="d-block" style={{ color: mutedColor }}>Coverage End: {selectedAsset.warrantyInfo.end} ({selectedAsset.warrantyInfo.type})</span>
                </div>
              </div>
            )}

            {['assignments', 'transfers', 'repairs', 'documents', 'photos', 'timeline', 'audit', 'analytics', 'ai'].includes(activeDetailTab) && (
              <div className="p-3 text-center" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                No details found for {activeDetailTab}.
              </div>
            )}

          </div>

          <div className="d-flex justify-content-end pt-3 mt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
            <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }} onClick={() => setSelectedAsset(null)}>Close</button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />
    </ErpPageShell>
  );
};

export default ErpFixedAssets;
