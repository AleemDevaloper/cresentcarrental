// ==========================================
// ERM ERP - Centralized Warehouse Management Module
// manages storage spaces, warehouse maps, capacity, and bin zones
// matches SAP EWM & Oracle WMS standards
// ==========================================

import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faWarehouse, faChartPie, faRefresh, faMapLocationDot,
  faBoxesStacked, faUser, faPhone, faEnvelope,
  faFileWord, faFileAlt, faFileExport, faEye, faEdit, faTrashCan,
  faFileSignature, faList
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const seedWarehouses = [
  { id: 1, code: 'WH-CHI-01', name: 'Chicago Central Warehouse', type: 'Main Warehouse', city: 'Chicago', manager: 'John Doe', email: 'john.doe@corp.com', phone: '+1 (312) 555-0101', maxCapacity: 10000, currentCapacity: 7500, status: 'Active' },
  { id: 2, code: 'WH-SZ-09', name: 'Shenzhen Buffer Zone', type: 'Transit Warehouse', city: 'Shenzhen', manager: 'Zhang Wei', email: 'zhang.wei@corp.com', phone: '+86 755 555 0102', maxCapacity: 5000, currentCapacity: 1200, status: 'Active' },
  { id: 3, code: 'WH-AUS-02', name: 'Austin Distribution Center', type: 'Distribution Center', city: 'Austin', manager: 'Sarah Jenkins', email: 'sarah.jenkins@corp.com', phone: '+1 (512) 555-0103', maxCapacity: 8000, currentCapacity: 6400, status: 'Active' },
  { id: 4, code: 'WH-NYC-05', name: 'New York Hub', type: 'Main Warehouse', city: 'New York', manager: 'Michael Chen', email: 'michael.chen@corp.com', phone: '+1 (212) 555-0104', maxCapacity: 6000, currentCapacity: 900, status: 'Draft' },
  { id: 5, code: 'WH-DXB-01', name: 'Dubai Free Zone Depot', type: 'Transit Warehouse', city: 'Dubai', manager: 'Omar Farooq', email: 'omar.farooq@corp.com', phone: '+971 4 555 0105', maxCapacity: 4000, currentCapacity: 3900, status: 'Inactive' },
];

const ErpWarehouses = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [warehouses, setWarehouses] = useState(seedWarehouses);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    const onRefresh = () => addNotification?.('Warehouse registry refreshed.', 'info');
    window.addEventListener('erp:refresh', onRefresh);
    window.addEventListener('app:minor-refresh', onRefresh);
    return () => {
      window.removeEventListener('erp:refresh', onRefresh);
      window.removeEventListener('app:minor-refresh', onRefresh);
    };
  }, []);

  const filteredWarehouses = warehouses
    .filter(w => w.status !== 'Archived')
    .filter(w => {
      const needle = searchTerm.toLowerCase();
      return !needle ||
        w.code.toLowerCase().includes(needle) ||
        w.name.toLowerCase().includes(needle) ||
        w.type.toLowerCase().includes(needle) ||
        w.city.toLowerCase().includes(needle) ||
        w.manager.toLowerCase().includes(needle);
    });

  const totalMaxCapacity = filteredWarehouses.reduce((acc, curr) => acc + curr.maxCapacity, 0);
  const totalCurrentCapacity = filteredWarehouses.reduce((acc, curr) => acc + curr.currentCapacity, 0);
  const activeUtilizedPct = totalMaxCapacity > 0 ? (totalCurrentCapacity / totalMaxCapacity) * 100 : 0;
  const draftCount = warehouses.filter(w => w.status === 'Draft').length;

  const kpiData = [
    { label: 'Total Warehouses Stored', val: filteredWarehouses.length, icon: faWarehouse, color: '#6366f1', trend: '+2', trendVal: 'up', sparkline: [1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
    { label: 'Total Pallet Max Capacity', val: totalMaxCapacity, icon: faBoxesStacked, color: '#f59e0b', trend: '+2K', trendVal: 'up', suffix: ' PLT', sparkline: [8000, 8000, 13000, 13000, 18000, 18000, 18000, 23000, 23000, 23000, 23000, 23000] },
    { label: 'Active Utilized Capacity', val: Math.round(activeUtilizedPct * 10) / 10, icon: faChartPie, color: '#ec4899', trend: `${activeUtilizedPct > 50 ? '+' : '-'}${Math.abs(Math.round((activeUtilizedPct - 50) * 10) / 10)}%`, trendVal: activeUtilizedPct > 80 ? 'down' : 'up', suffix: '%', decimals: 1, sparkline: [35, 38, 42, 40, 45, 48, 52, 55, 58, 60, 62, Math.round(activeUtilizedPct)] },
    { label: 'Draft Warehouses', val: draftCount, icon: faFileSignature, color: '#f59e0b', trend: 'up', trendVal: 'Pending', sparkline: [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4] }
  ];

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      const rows = filteredWarehouses.map(w => ({
        'Warehouse Code': w.code, 'Warehouse Name': w.name, 'Type': w.type,
        'City': w.city, 'Location Head': w.manager,
        'Capacity Used': `${w.currentCapacity} / ${w.maxCapacity} PLT`,
        'Occupancy %': ((w.currentCapacity / w.maxCapacity) * 100).toFixed(1) + '%',
        'Status': w.status,
      }));
      const headers = Object.keys(rows[0] || {});
      const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'warehouses.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "Warehouses.xlsx"); a.click();
      } else if (format === 'pdf') {
        await exportPdf({ title: 'Warehouses', headers, rows, filename: 'warehouses.pdf' });
      } else if (format === 'docx') {
        await exportDocx({ title: 'Warehouses', headers, rows, filename: 'warehouses.docx' });
      } else if (format === 'word') {
        await exportWord({ title: 'Warehouses', headers, rows, filename: 'warehouses.doc' });
      }
      addNotification(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification(err.message || 'Export failed', 'error'); }
  };

  const exportButtons = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">⋯</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileExport} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
        </ul>
      </div>
    </div>
  );

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'warehouse' });
    setActiveTab('erp_add_warehouse');
  };

  const handleMoveToDraft = (row) => {
    const next = row.status === 'Draft' ? 'Active' : 'Draft';
    setWarehouses(prev => prev.map(w => w.id === row.id ? { ...w, status: next } : w));
    addNotification?.(`Warehouse ${row.code} moved to ${next}.`, 'success');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: `${row.code} - ${row.name}` });
  const handleDeleteConfirm = () => {
    setWarehouses(prev => prev.map(w => w.id === deleteDialog.id ? { ...w, status: 'Archived' } : w));
    addNotification?.('Warehouse archived.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const columns = [
    { key: 'code', label: 'Warehouse Code', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
    { key: 'name', label: 'Warehouse Name', bold: true },
    { key: 'city', label: 'City' },
    { key: 'type', label: 'Type', render: (val) => <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}><span className="badge-dot" style={{ background: '#6366f1' }} />{val}</span> },
    { key: 'manager', label: 'Location Head' },
    { key: 'capacity', label: 'Capacity Used', render: (val, row) => <span className="font-monospace">{row.currentCapacity.toLocaleString()} / {row.maxCapacity.toLocaleString()} PLT</span> },
    { key: 'occupancy', label: 'Occupancy %', render: (val, row) => {
      const pct = ((row.currentCapacity / row.maxCapacity) * 100).toFixed(1);
      const high = parseFloat(pct) > 80;
      return <div className="d-flex align-items-center gap-2"><div className="progress flex-grow-1" style={{ height: '6px', borderRadius: 100, background: isDark ? '#1a1d29' : '#f1f5f9', maxWidth: '100px' }}><div className="progress-bar" role="progressbar" style={{ width: `${pct}%`, borderRadius: 100, background: high ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}></div></div><span className="font-monospace fw-bold small" style={{ color: high ? '#ef4444' : (isDark ? '#e2e8f0' : '#1e293b') }}>{pct}%</span></div>;
    }},
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex justify-content-end gap-1">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => setViewItem(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Zones" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification('Bin location map open.', 'info')}
          onMouseEnter={e => { e.currentTarget.style.background = '#8b5cf610'; e.currentTarget.style.color = '#8b5cf6'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faMapLocationDot} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Toggle Draft" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: '#f43f5e', background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f43f5e'; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const viewModeButtons = (
    <div className="d-flex gap-1">
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'table' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'table' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faList} /></button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'card' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'card' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('card')}><FontAwesomeIcon icon={faChartPie} /></button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faWarehouse}
      title="Extended Warehouse Registry"
      description="Manage corporate storage locations, bins, picking aisles, cold chains, and real-time inventory capacity indexes."
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm premium-btn px-3 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', borderRadius: 10 }} onClick={() => setActiveTab('erp_add_warehouse')}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Warehouse
          </button>
          <button className="btn btn-sm premium-btn" style={{ border: `1px solid ${borderColor}`, color: mutedColor, borderRadius: 10, background: 'transparent' }} onClick={() => addNotification('Capacity report generated.', 'info')}>Capacity Report</button>
          <button className="btn btn-sm premium-btn" style={{ border: `1px solid ${borderColor}`, color: mutedColor, borderRadius: 10, background: 'transparent' }} onClick={() => addNotification('Inventory sync completed.', 'success')}>
            <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-xl-3 col-md-6" />
        ))}
      </div>

      {/* Warehouse Master Directory */}
      {viewMode === 'table' ? (
        <ErpDataTable
          columns={columns}
          data={filteredWarehouses}
          title="Stored Locations & Storage Utilization"
          titleIcon={faWarehouse}
          isDark={isDark}
          exportButtons={exportButtons}
          searchable
          searchPlaceholder="Search warehouses..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyMessage="No warehouses found."
          emptyIcon={faWarehouse}
          extraActions={viewModeButtons}
        />
      ) : (
        <div className="row g-3 mb-4">
          {filteredWarehouses.map(w => {
            const pct = ((w.currentCapacity / w.maxCapacity) * 100).toFixed(1);
            const high = parseFloat(pct) > 80;
            return (
              <div key={w.id} className="col-md-4">
                <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{w.code}</span>
                    <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}><span className="badge-dot" style={{ background: '#6366f1' }} />{w.status}</span>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: textColor }}>{w.name}</h6>
                  <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{w.type} &bull; {w.city} &bull; {w.manager}</span>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: 100, background: isDark ? '#1a1d29' : '#f1f5f9' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${pct}%`, borderRadius: 100, background: high ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}></div>
                    </div>
                    <span className="font-monospace fw-bold small" style={{ color: high ? '#ef4444' : textColor }}>{pct}%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                    <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.72rem' }}>{w.currentCapacity.toLocaleString()} / {w.maxCapacity.toLocaleString()} PLT</span>
                    <div className="d-flex gap-1">
                      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setViewItem(w)}><FontAwesomeIcon icon={faEye} className="me-1" />View</button>
                      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => handleEdit(w)}>Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faWarehouse} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Warehouse Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? '#4ade80' : '#16a34a' }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.name}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Code: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.code}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Type: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.type}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>City: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.city}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location Head</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}><FontAwesomeIcon icon={faUser} className="me-1" style={{ color: mutedColor }} />{viewItem.manager}</p>
                      <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}><FontAwesomeIcon icon={faEnvelope} className="me-1" />{viewItem.email || 'n/a'}</p>
                      <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}><FontAwesomeIcon icon={faPhone} className="me-1" />{viewItem.phone || 'n/a'}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity Used</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.95rem' }}>{viewItem.currentCapacity.toLocaleString()} / {viewItem.maxCapacity.toLocaleString()}</p>
                      <span style={{ color: mutedColor, fontSize: '0.7rem' }}>PLT</span>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Occupancy</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: ((viewItem.currentCapacity / viewItem.maxCapacity) * 100) > 80 ? '#f43f5e' : '#10b981', fontSize: '0.95rem' }}>
                        {((viewItem.currentCapacity / viewItem.maxCapacity) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: 'transparent', border: `1px solid ${borderColor}`, color: mutedColor, fontSize: '0.75rem' }} onClick={() => { setViewItem(null); handleMoveToDraft(viewItem); }}>
                    <FontAwesomeIcon icon={faFileSignature} className="me-1" /> Move to {viewItem.status === 'Draft' ? 'Active' : 'Draft'}
                  </button>
                  <button className="btn btn-sm text-white border-0 px-3" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem' }} onClick={() => { handleEdit(viewItem); setViewItem(null); }}>
                    <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Archive Warehouse"
        message="Are you sure you want to archive this warehouse? You can restore it later."
        itemName={deleteDialog.name}
        confirmLabel="Archive"
      />
    </ErpPageShell>
  );
};

export default ErpWarehouses;
