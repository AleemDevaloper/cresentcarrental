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
  faLocationDot, faBarcode, faQrcode
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listAssetLocations, deleteAssetLocation } from '../../../../api/fms';

const ErpAssetLocations = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssetLocations();
      setLocations(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load locations');
      addNotification('Failed to load locations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const kpiData = useMemo(() => [
    { label: 'Total Locations', val: locations.length, icon: faLocationDot, color: accentColor, trend: 'up', trendVal: 'Registered Nodes' },
    { label: 'Active Locations', val: locations.filter(l => l.status === 'Active').length, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Active Sites' },
    { label: 'Location Types', val: [...new Set(locations.map(l => l.locationType))].length, icon: faBuilding, color: '#8b5cf6', trend: 'up', trendVal: 'Distinct Types' },
  ], [locations]);

  const filteredLocations = locations.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.locationType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'asset_location' });
    setActiveTab('erp_add_asset_location');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.name || row.code || '' });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    try {
      await deleteAssetLocation(id);
      setLocations(prev => prev.filter(l => l.id !== id));
      addNotification('Location deleted successfully.', 'success');
    } catch (err) {
      addNotification('Failed to delete location.', 'error');
    }
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Asset Locations Hierarchy"
      description="Manage physical locations, branches, buildings, floors, rooms, warehouses, and sites where company assets are stored or assigned."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_add_asset_location')}>
            <FontAwesomeIcon icon={faPlus} /> Add Location
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Locations imported.', 'info')}>
            Import Locations
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Location QR code labels generated.', 'success')}>
            <FontAwesomeIcon icon={faQrcode} className="me-1" /> Print QR
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Location barcode labels generated.', 'success')}>
            <FontAwesomeIcon icon={faBarcode} className="me-1" /> Print Barcode
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Hierarchy tree rendered.', 'info')}>
            Hierarchy View
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
          <p className="mt-2" style={{ color: mutedColor }}>Loading locations...</p>
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
          { id: 'directory', label: 'Physical Locations Register', icon: faFolderOpen },
          { id: 'dashboard', label: 'Location Analytics & Capacity', icon: faChartPie },
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
            { key: 'code', label: 'Location Code', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const l = locations.find(x => x.code === val); if (l) { setSelectedLocation(l); setActiveDetailTab('overview'); } }}>{val}</span> },
            { key: 'name', label: 'Location Name', bold: true },
            { key: 'branch', label: 'Branch & Company', render: (val, row) => <>{val} â€¢ {row.company}</> },
            { key: 'locationType', label: 'Location Type', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
            { key: 'manager', label: 'Manager' },
            { key: 'maxAssets', label: 'Max Capacity', render: (_, row) => <span className="font-monospace">{row.capacity.maxAssets} Assets</span> },
            { key: 'currentAssets', label: 'Assigned Assets', render: (_, row) => <span className="font-monospace">{row.capacity.currentAssets} Assets</span> },
            { key: 'utilPct', label: 'Utilization %', render: (_, row) => <span className="font-monospace fw-bold text-success">{row.capacity.utilPct}%</span> },
            { key: 'status', label: 'Status', render: (val) => <span className="premium-badge bg-success text-white">{val}</span> },
            { key: 'actions', label: '', render: (_, row) => (
              <div className="d-flex justify-content-end gap-1">
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }} onClick={() => { setSelectedLocation(row); setActiveDetailTab('overview'); }} title="View"><FontAwesomeIcon icon={faEye} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }} onClick={() => handleEditClick(row)} title="Edit"><FontAwesomeIcon icon={faPen} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }} onClick={() => handleDeleteClick(row)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )},
          ]}
          data={filteredLocations}
          searchable
          searchPlaceholder="Search by Location Code, Name, Manager, address..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {(() => {
            const totalLocations = locations.length;
            const activeLocations = locations.filter(l => l.status === 'Active').length;
            const uniqueTypes = [...new Set(locations.map(l => l.locationType))].length;
            const totalMaxAssets = locations.reduce((acc, l) => acc + (l.capacity?.maxAssets || 0), 0);
            const totalCurrentAssets = locations.reduce((acc, l) => acc + (l.capacity?.currentAssets || 0), 0);
            const avgUtil = totalMaxAssets > 0 ? ((totalCurrentAssets / totalMaxAssets) * 100).toFixed(1) : '0.0';
            return [
              { label: 'Total Locations', val: totalLocations, sub: 'Registered Physical Nodes', color: accentColor },
              { label: 'Active Locations', val: activeLocations, sub: 'Active Storage Points', color: '#10b981' },
              { label: 'Inactive Locations', val: totalLocations - activeLocations, sub: 'Historical records', color: '#64748b' },
              { label: 'Location Types', val: uniqueTypes, sub: 'Distinct types', color: '#8b5cf6' },
              { label: 'Assets Assigned', val: totalCurrentAssets, sub: 'Registered Assets', color: '#10b981' },
              { label: 'Total Capacity', val: totalMaxAssets, sub: 'Max asset slots', color: '#3b82f6' },
              { label: 'Avg Utilization', val: avgUtil + '%', sub: 'Total capacity utilization', color: '#f59e0b' },
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
        title="Delete Asset Location"
        message="Are you sure you want to delete this asset location? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />

      {selectedLocation && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedLocation.code}</span>
              <h5 className="fw-bold mb-0">{selectedLocation.name}</h5>
              <span className="text-muted small">{selectedLocation.branch} â€¢ {selectedLocation.company}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedLocation(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assets', label: 'Assigned Assets' },
              { id: 'employees', label: 'Employees' },
              { id: 'projects', label: 'Projects' },
              { id: 'maintenance', label: 'Maintenance' },
              { id: 'transfers', label: 'Transfers' },
              { id: 'documents', label: 'Documents' },
              { id: 'photos', label: 'Photos' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'notes', label: 'Notes' },
              { id: 'audit', label: 'Audit Logs' },
              { id: 'analytics', label: 'Analytics' }
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
                <div className="col-md-12"><strong>Objective Description:</strong><p className="text-muted mt-1">{selectedLocation.description}</p></div>
                <div className="col-md-6"><strong>Address Context:</strong><span className="d-block text-muted">{selectedLocation.address} ({selectedLocation.postalCode})</span></div>
                <div className="col-md-6"><strong>Location Manager:</strong><span className="d-block text-muted">{selectedLocation.manager}</span></div>
                <div className="col-md-6"><strong>Max Asset Capacity limit:</strong><span className="d-block text-muted font-monospace">{selectedLocation.capacity.maxAssets} Assets</span></div>
                <div className="col-md-6"><strong>Current Allocation:</strong><span className="d-block text-muted font-monospace">{selectedLocation.capacity.currentAssets} Assets ({selectedLocation.capacity.utilPct}% used)</span></div>
              </div>
            )}

            {['assets', 'employees', 'projects', 'maintenance', 'transfers', 'documents', 'photos', 'timeline', 'notes', 'audit', 'analytics'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No location assignments found.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedLocation(null)}>Close</button>
          </div>
        </div>
      )}
    </ErpPageShell>
  );
};

export default ErpAssetLocations;
