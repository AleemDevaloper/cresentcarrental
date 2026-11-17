import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxesStacked,
  faCheckCircle,
  faPlus,
  faRefresh,
  faScaleBalanced,
  faSearch,
  faTableCells,
  faEye,
  faEdit,
  faTrashCan,
  faFileSignature,
  faList,
  faChartPie,
  faFileExport,
  faFileWord,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { listUoms } from '../../../../api/fms';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const normalizeUom = (item) => ({
  id: item.id,
  code: item.code || item.symbol || item.name,
  name: item.name || item.code || 'Unit',
  category: item.category || item.type || 'General',
  base_unit: item.base_unit || item.baseUnit || item.code || '-',
  conversion_factor: item.conversion_factor || item.conversionFactor || 1,
  status: item.status || (item.is_active === false ? 'Inactive' : 'Active'),
});

const ErpUoms = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [uoms, setUoms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const loadUoms = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await listUoms();
      const payload = response?.data?.data || response?.data || [];
      const rows = Array.isArray(payload) ? payload.map(normalizeUom) : [];
      setUoms(rows);
    } catch {
      setUoms([]);
      setApiError('Unable to load UOM data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUoms();
  }, []);

  useEffect(() => {
    const onRefresh = () => loadUoms();
    window.addEventListener('erp:refresh', onRefresh);
    window.addEventListener('app:minor-refresh', onRefresh);
    return () => {
      window.removeEventListener('erp:refresh', onRefresh);
      window.removeEventListener('app:minor-refresh', onRefresh);
    };
  }, []);

  const filteredUoms = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const base = uoms.filter(u => u.status !== 'Archived');
    if (!needle) return base;
    return base.filter((uom) =>
      [uom.code, uom.name, uom.category, uom.base_unit, uom.status]
        .some((value) => String(value || '').toLowerCase().includes(needle))
    );
  }, [search, uoms]);

  const categories = new Set(uoms.map((uom) => uom.category)).size;
  const activeCount = uoms.filter((uom) => uom.status === 'Active').length;
  const draftCount = uoms.filter((uom) => uom.status === 'Draft').length;

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'uom' });
    setActiveTab('erp_add_uom');
  };

  const handleMoveToDraft = (row) => {
    const next = row.status === 'Draft' ? 'Active' : 'Draft';
    setUoms(prev => prev.map(u => u.id === row.id ? { ...u, status: next } : u));
    addNotification?.(`UOM ${row.code} moved to ${next}.`, 'success');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: `${row.code} - ${row.name}` });
  const handleDeleteConfirm = () => {
    setUoms(prev => prev.map(u => u.id === deleteDialog.id ? { ...u, status: 'Archived' } : u));
    addNotification?.('UOM archived.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      const rowObjects = filteredUoms.map(u => ({
        'Code': u.code, 'Unit Name': u.name, 'Category': u.category,
        'Base Unit': u.base_unit, 'Conversion Factor': u.conversion_factor, 'Status': u.status,
      }));
      const headers = Object.keys(rowObjects[0] || {});
      const rows = rowObjects.map(r => headers.map(h => String(r[h] || '')));
      const csvRows = [headers.join(','), ...rowObjects.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'uoms.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "Uoms.xlsx"); a.click();
      } else if (format === 'pdf') {
        await exportPdf(rows, headers, 'Units of Measure Report', 'uoms');
      } else if (format === 'docx') {
        await exportDocx(rows, headers, 'Units of Measure Report', 'uoms');
      } else if (format === 'word') {
        await exportWord(rows, headers, 'Units of Measure Report', 'uoms');
      }
      addNotification?.(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification?.(err.message || 'Export failed', 'error'); }
  };

  const exportButtons = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">⋯</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileExport} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
        </ul>
      </div>
    </div>
  );

  const columns = [
    { key: 'code', label: 'Code', width: '14%', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
    { key: 'name', label: 'Unit Name', bold: true },
    { key: 'category', label: 'Category', render: (val) => <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{val}</span> },
    { key: 'base_unit', label: 'Base Unit' },
    { key: 'conversion_factor', label: 'Conversion', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex justify-content-end gap-1">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }}
          onClick={() => setViewItem(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEdit} />
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
      icon={faScaleBalanced}
      title="Units of Measure"
      description="Set measurement codes, packaging conversions, and inventory quantity standards."
      badge="inventory"
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-primary text-white rounded-3 px-3 fw-bold" onClick={() => setActiveTab('erp_add_uom')}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add UOM
          </button>
          <button className="btn btn-sm btn-light rounded-3 px-3" onClick={loadUoms} disabled={loading}>
            <FontAwesomeIcon icon={faRefresh} className="me-2" spin={loading} />
            Refresh
          </button>
        </div>
      }
    >
      <div className="row g-3 mb-4">
        <ErpKpiCard label="Total UOMs" value={uoms.filter(u => u.status !== 'Archived').length} icon={faScaleBalanced} color="#6366f1" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Categories" value={categories} icon={faBoxesStacked} color="#14b8a6" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Active Units" value={activeCount} icon={faCheckCircle} color="#10b981" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Draft Units" value={draftCount} icon={faFileSignature} color="#f59e0b" isDark={isDark} colClass="col-xl-3 col-md-6" />
      </div>

      {apiError && (
        <div className="d-flex align-items-center gap-3 p-3 mb-4 rounded-3" style={{ background: isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>
          <FontAwesomeIcon icon={faRefresh} style={{ color: '#ef4444', fontSize: '0.9rem' }} />
          <div className="flex-grow-1">
            <span style={{ color: isDark ? '#fca5a5' : '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>{apiError}</span>
          </div>
          <button className="btn btn-sm" style={{ borderRadius: '8px', background: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2', color: '#dc2626', border: 'none', fontSize: '0.75rem', fontWeight: 600 }} onClick={loadUoms} disabled={loading}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" spin={loading} /> Retry
          </button>
        </div>
      )}

      {viewMode === 'table' ? (
        <ErpDataTable
          title="UOM Registry"
          titleIcon={faTableCells}
          columns={columns}
          data={filteredUoms}
          loading={loading}
          emptyIcon={faScaleBalanced}
          emptyMessage={apiError || "No units of measure found."}
          searchable
          searchPlaceholder="Search UOMs..."
          searchTerm={search}
          onSearchChange={setSearch}
          isDark={isDark}
          accentColor="#6366f1"
          exportButtons={exportButtons}
          extraActions={
            <div className="d-none d-md-inline-flex align-items-center gap-2 small text-muted">
              <FontAwesomeIcon icon={faSearch} />
              {filteredUoms.length} shown
              {viewModeButtons}
            </div>
          }
        />
      ) : (
        <div className="row g-3 mb-4">
          {filteredUoms.length === 0 && !loading ? (
            <div className="col-12 text-center py-5">
              <FontAwesomeIcon icon={faScaleBalanced} style={{ fontSize: '2.5rem', color: mutedColor, opacity: 0.4 }} className="mb-3" />
              <h6 style={{ color: textColor, fontWeight: 600 }}>No Units of Measure</h6>
              <p style={{ color: mutedColor, fontSize: '0.8rem', maxWidth: 400, margin: '0 auto' }}>
                {apiError || 'No UOM records found. Click "Add UOM" to create your first unit of measure.'}
              </p>
              {!apiError && (
                <button className="btn btn-sm btn-primary text-white rounded-3 px-3 mt-3 fw-bold" onClick={() => setActiveTab('erp_add_uom')}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add UOM
                </button>
              )}
            </div>
          ) : filteredUoms.map(u => (
            <div key={u.id} className="col-md-4">
              <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{u.code}</span>
                  <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{u.status}</span>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}>{u.name}</h6>
                <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{u.category} &bull; Base: {u.base_unit} &bull; {u.conversion_factor}x</span>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                  <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontWeight: 600, fontSize: '0.72rem', padding: '5px 14px' }} onClick={() => setViewItem(u)}>
                    <FontAwesomeIcon icon={faEye} className="me-1" /> View
                  </button>
                  <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontWeight: 600, fontSize: '0.72rem', padding: '5px 14px' }} onClick={() => handleEdit(u)}>
                    Edit Master
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faScaleBalanced} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Unit of Measure Preview</span>
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
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Category: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.category}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Base Unit: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.base_unit}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conversion Factor</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '1.1rem' }}>{viewItem.conversion_factor}x</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.status}</p>
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
        title="Archive UOM"
        message="Are you sure you want to archive this unit of measure? You can restore it later."
        itemName={deleteDialog.name}
        confirmLabel="Archive"
      />
    </ErpPageShell>
  );
};

export default ErpUoms;
