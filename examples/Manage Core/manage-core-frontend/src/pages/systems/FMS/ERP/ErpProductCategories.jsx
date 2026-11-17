import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faList, faEye, faTrashCan, faRefresh, faFolder,
  faFolderOpen, faTags, faChartPie, faFileExport, faEdit,
  faFileWord, faFileAlt, faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { listProductCategories } from '../../../../api/fms';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const seedCategories = [
  { id: 1, code: 'CAT-MET-00', name: 'Raw Metals', parent: null, parent_id: null, productsCount: 15, defaultWarehouse: 'Chicago Central WH', defaultCosting: 'Weighted Average', status: 'Active' },
  { id: 2, code: 'CAT-MET-ferrous', name: 'Ferrous Alloys', parent: 'Raw Metals', parent_id: 1, productsCount: 8, defaultWarehouse: 'Chicago Central WH', defaultCosting: 'Weighted Average', status: 'Active' },
  { id: 3, code: 'CAT-MET-nonferrous', name: 'Non-Ferrous Alloys', parent: 'Raw Metals', parent_id: 1, productsCount: 7, defaultWarehouse: 'Chicago Central WH', defaultCosting: 'Weighted Average', status: 'Active' },
  { id: 4, code: 'CAT-EL-00', name: 'Electronics & Chips', parent: null, parent_id: null, productsCount: 22, defaultWarehouse: 'Shenzhen Buffer WH', defaultCosting: 'FIFO', status: 'Active' },
  { id: 5, code: 'CAT-EL-mcu', name: 'Micro-Controllers', parent: 'Electronics & Chips', parent_id: 4, productsCount: 12, defaultWarehouse: 'Shenzhen Buffer WH', defaultCosting: 'FIFO', status: 'Draft' },
  { id: 6, code: 'CAT-CHEM-00', name: 'Chemicals & Adhesives', parent: null, parent_id: null, productsCount: 10, defaultWarehouse: 'Austin Distribution Center', defaultCosting: 'FIFO', status: 'Active' },
];

const ErpProductCategories = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [categories, setCategories] = useState(seedCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await listProductCategories({ per_page: 200, _t: Date.now() });
      const items = (res.data?.data || []).map(v => ({
        id: v.id,
        code: v.code || '',
        name: v.name || '',
        parent: v.parent?.name || null,
        parent_id: v.parent_id || null,
        productsCount: (v.children?.length) || 0,
        defaultWarehouse: v.default_warehouse || '',
        defaultCosting: v.default_valuation || 'FIFO',
        status: 'Active',
      }));
      if (items.length) setCategories(items);
    } catch (err) {
      addNotification?.(err.data?.message || err.message || 'Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => {
    const onRefresh = () => loadCategories();
    window.addEventListener('erp:refresh', onRefresh);
    window.addEventListener('app:minor-refresh', onRefresh);
    return () => {
      window.removeEventListener('erp:refresh', onRefresh);
      window.removeEventListener('app:minor-refresh', onRefresh);
    };
  }, []);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      const rowObjects = filteredCategories.map(c => ({
        'Category Name': c.name, 'Category Code': c.code,
        'Parent': c.parent || '(Root)', 'Assigned Products': c.productsCount,
        'Default Warehouse': c.defaultWarehouse, 'Default Costing': c.defaultCosting,
        'Status': c.status,
      }));
      const headers = Object.keys(rowObjects[0] || {});
      const rows = rowObjects.map(r => headers.map(h => String(r[h] || '')));
      const csvRows = [headers.join(','), ...rowObjects.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'product-categories.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "ProductCategories.xlsx"); a.click();
      } else if (format === 'pdf') {
        await exportPdf({ title: 'Product Categories Report', headers, rows, filename: 'product-categories.pdf' });
      } else if (format === 'docx') {
        await exportDocx({ title: 'Product Categories Report', headers, rows, filename: 'ProductCategories.docx' });
      } else if (format === 'word') {
        await exportWord({ title: 'Product Categories Report', headers, rows, filename: 'ProductCategories.doc' });
      }
      addNotification(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification(err.message || 'Export failed', 'error'); }
  };

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'product_category' });
    setActiveTab('erp_add_product_category');
  };

  const handleMoveToDraft = (row) => {
    const next = row.status === 'Draft' ? 'Active' : 'Draft';
    setCategories(prev => prev.map(c => c.id === row.id ? { ...c, status: next } : c));
    addNotification?.(`Category ${row.name} moved to ${next}.`, 'success');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: `${row.code} - ${row.name}` });
  const handleDeleteConfirm = () => {
    setCategories(prev => prev.filter(c => c.id !== deleteDialog.id && c.parent_id !== deleteDialog.id));
    addNotification?.('Category archived.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const filteredCategories = categories
    .filter(c => c.status !== 'Archived')
    .filter(c => {
      const needle = searchTerm.toLowerCase();
      return !needle ||
        c.name.toLowerCase().includes(needle) ||
        c.code.toLowerCase().includes(needle) ||
        (c.parent || '').toLowerCase().includes(needle) ||
        c.defaultWarehouse.toLowerCase().includes(needle);
    });

  const parentCategories = categories.filter(c => !c.parent);
  const childCategories = categories.filter(c => c.parent);
  const draftCount = categories.filter(c => c.status === 'Draft').length;

  const kpiData = [
    { label: 'Total Categories', val: categories.filter(c => c.status !== 'Archived').length, icon: faTags, color: '#6366f1', trend: 'up', trendVal: '+12%' },
    { label: 'Parent Categories', val: parentCategories.length, icon: faFolder, color: '#8b5cf6', trend: 'up', trendVal: '+5%' },
    { label: 'Child Categories', val: childCategories.length, icon: faFolderOpen, color: '#ec4899', trend: 'up', trendVal: '+18%' },
    { label: 'Draft Categories', val: draftCount, icon: faFileSignature, color: '#f59e0b', trend: 'up', trendVal: 'Pending' }
  ];

  const exportButtons = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">⋯</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileExport} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
        </ul>
      </div>
    </div>
  );

  const columns = [
    { key: 'name', label: 'Category Name', bold: true, render: (val, row) => (
      <div className="d-flex align-items-center gap-2">
        <FontAwesomeIcon icon={row.parent ? faFolder : faFolderOpen} style={{ color: row.parent ? mutedColor : '#f59e0b' }} />
        <span className="fw-bold" style={{ color: textColor }}>{val}</span>
        {row.parent && <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', fontSize: '0.6rem' }}>Child</span>}
      </div>
    )},
    { key: 'code', label: 'Category Code', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>{val}</span> },
    { key: 'parent', label: 'Parent', render: (val) => val ? <span style={{ color: textColor }}>{val}</span> : <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: mutedColor }}>Root</span> },
    { key: 'productsCount', label: 'Assigned Products', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
    { key: 'defaultWarehouse', label: 'Default Warehouse', render: (val) => <span style={{ fontSize: '0.75rem', color: mutedColor }}>{val}</span> },
    { key: 'defaultCosting', label: 'Default Costing', render: (val) => <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}><span className="badge-dot" style={{ background: '#6366f1' }} />{val}</span> },
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
      icon={faFolderOpen}
      title="Product Category Hierarchy"
      description="Organize products into a scalable parent-child category tree to manage default costing, accounts, and inventory rules."
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm premium-btn px-3 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', borderRadius: 10 }} onClick={() => setActiveTab('erp_add_product_category')}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Category
          </button>
          <button className="btn btn-sm premium-btn" style={{ border: `1px solid ${borderColor}`, color: mutedColor, borderRadius: 10, background: 'transparent' }} onClick={loadCategories} disabled={loading}>
            <FontAwesomeIcon icon={faRefresh} spin={loading} />
          </button>
        </div>
      }
    >
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-xl-3 col-md-6" />
        ))}
      </div>

      {viewMode === 'table' ? (
        <ErpDataTable
          columns={columns}
          data={filteredCategories}
          loading={loading}
          isDark={isDark}
          title="Category Registry"
          titleIcon={faFolderOpen}
          searchable
          searchPlaceholder="Search categories..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyMessage="No categories found."
          emptyIcon={faFolderOpen}
          exportButtons={exportButtons}
          extraActions={viewModeButtons}
        />
      ) : (
        <div className="row g-3 mb-4">
          {filteredCategories.map(c => (
            <div key={c.id} className="col-md-4">
              <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{c.code}</span>
                  <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{c.status}</span>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}><FontAwesomeIcon icon={c.parent ? faFolder : faFolderOpen} className="me-2" style={{ color: c.parent ? mutedColor : '#f59e0b' }} />{c.name}</h6>
                <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{c.parent ? `Parent: ${c.parent}` : 'Root Category'} &bull; {c.productsCount} products</span>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                  <span className="premium-badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}><span className="badge-dot" style={{ background: '#6366f1' }} />{c.defaultCosting}</span>
                  <div className="d-flex gap-1">
                    <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setViewItem(c)}><FontAwesomeIcon icon={faEye} className="me-1" />View</button>
                    <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => handleEdit(c)}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFolderOpen} style={{ color: '#f59e0b', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Category Preview</span>
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
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Parent: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.parent || '(Root)'}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Products: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.productsCount}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Warehouse</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.defaultWarehouse}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Costing</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '0.95rem' }}>{viewItem.defaultCosting}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valuation Rule</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>The valuation method cascades to child products unless overridden at the product level.</p>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
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
        title="Archive Category"
        message="Are you sure you want to archive this category and its child categories? You can restore them later."
        itemName={deleteDialog.name}
        confirmLabel="Archive"
      />
    </ErpPageShell>
  );
};

export default ErpProductCategories;
