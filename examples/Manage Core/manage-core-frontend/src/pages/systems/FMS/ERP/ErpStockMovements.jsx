import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory, faRefresh, faBoxesStacked, faArrowRight, faCoins,
  faFileWord, faFileAlt, faEye, faEdit, faTrashCan, faList, faChartPie,
  faWarehouse
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { AnimatedCounter, DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const seedMovements = [
  { id: 1, number: 'MV-2026-90021', date: '2026-07-02', type: 'Purchase Receipt', warehouse: 'Chicago Central WH', product: 'High-Grade Aluminum Bars (Grade A)', qty: 2500, cost: 120, total: 300000, user: 'Warehouse Clerk A' },
  { id: 2, number: 'MV-2026-90022', date: '2026-07-03', type: 'Sales Delivery', warehouse: 'Chicago Central WH', product: 'High-Grade Aluminum Bars (Grade A)', qty: -400, cost: 120, total: -48000, user: 'Shipping Operative' },
  { id: 3, number: 'MV-2026-90023', date: '2026-07-03', type: 'Internal Transfer', warehouse: 'Shenzhen Buffer WH', product: 'Micro-Controller Processing Core', qty: 300, cost: 45, total: 13500, user: 'Logistic Agent' },
  { id: 4, number: 'MV-2026-90024', date: '2026-06-29', type: 'Stock Adjustment', warehouse: 'Austin Distribution Center', product: 'Industrial Grade Epoxy Sealant', qty: -10, cost: 28, total: -280, user: 'Inventory Controller' },
  { id: 5, number: 'MV-2026-90025', date: '2026-07-05', type: 'Purchase Receipt', warehouse: 'Austin Distribution Center', product: 'Hydraulic Pressure Valve Seal', qty: 200, cost: 15, total: 3000, user: 'Warehouse Clerk B' },
];

const ErpStockMovements = () => {
  const { theme, addNotification, setEditDocument, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [movements, setMovements] = useState(seedMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    const onRefresh = () => addNotification?.('Movement ledger refreshed.', 'info');
    window.addEventListener('erp:refresh', onRefresh);
    window.addEventListener('app:minor-refresh', onRefresh);

    const onCreated = (e) => {
      const d = e.detail || {};
      setMovements(prev => {
        const nextId = (prev.reduce((max, m) => Math.max(max, m.id), 0) || 0) + 1;
        const number = `MV-${(new Date()).getFullYear()}-${90000 + nextId}`;
        const date = new Date().toISOString().slice(0,10);
        const total = Number(d.total) || (Number(d.qty) || 0) * (Number(d.cost) || 0);
        const newItem = { id: nextId, number, date, type: d.type || 'Purchase Receipt', warehouse: d.warehouse || '', product: d.product || '', qty: Number(d.qty) || 0, cost: Number(d.cost) || 0, total, user: d.user || 'Current User' };
        return [newItem, ...prev];
      });
      addNotification?.('New movement added to ledger.', 'success');
    };

    const onUpdated = (e) => {
      const d = e.detail || {};
      setMovements(prev => prev.map(m => m.id === d.id ? { ...m, ...d, total: Number(d.total) || (Number(d.qty)||0)*(Number(d.cost)||0) } : m));
      addNotification?.('Movement updated.', 'success');
    };

    window.addEventListener('erp:movement:created', onCreated);
    window.addEventListener('erp:movement:updated', onUpdated);

    return () => {
      window.removeEventListener('erp:refresh', onRefresh);
      window.removeEventListener('app:minor-refresh', onRefresh);
      window.removeEventListener('erp:movement:created', onCreated);
      window.removeEventListener('erp:movement:updated', onUpdated);
    };
  }, []);

  const filteredMovements = movements
    .filter(m => m.status !== 'Archived')
    .filter(m => {
      const matchesSearch = (m.product || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.warehouse || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || m.type === typeFilter;
      return matchesSearch && matchesType;
    });

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      const rows = filteredMovements.map(m => ({
        'Movement ID': m.number, 'Date': m.date, 'Type': m.type,
        'Warehouse': m.warehouse, 'Product': m.product,
        'Quantity': m.qty > 0 ? '+' + m.qty : String(m.qty),
        'Cost': '$' + m.cost, 'Total Value': '$' + m.total.toLocaleString(),
        'Processed By': m.user,
      }));
      const headers = Object.keys(rows[0] || {});
      const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'stock-movements.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "StockMovements.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx(rows, headers, 'Stock Movements Report', 'StockMovements');
      } else if (format === 'word') {
        await exportWord(rows, headers, 'Stock Movements Report', 'StockMovements');
      } else if (format === 'pdf') {
        await exportPdf(rows, headers, 'Stock Movements Report', 'StockMovements');
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
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
        </ul>
      </div>
    </div>
  );

  const handleViewClick = (row) => setViewItem(row);
  const handleEdit = (row) => {
    // open full add/edit page for stock movement
    setEditDocument({ ...row, documentType: 'stock_movement' });
    setActiveTab('erp_add_stock_movement');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: `${row.number} - ${row.product}` });
  const handleDeleteConfirm = () => {
    setMovements(prev => prev.filter(m => m.id !== deleteDialog.id));
    addNotification?.('Movement record removed from ledger.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const openAddPage = () => {
    setEditDocument(null);
    setActiveTab('erp_add_stock_movement');
  };


  const columns = [
    { key: 'number', label: 'Movement ID', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
    { key: 'date', label: 'Date', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>{val}</span> },
    { key: 'type', label: 'Movement Type', render: (val) => <span className="premium-badge" style={{ background: `${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`, color: mutedColor }}><span className="badge-dot" style={{ background: mutedColor }} />{val}</span> },
    { key: 'warehouse', label: 'Warehouse', render: (val) => <span style={{ fontSize: '0.75rem', color: mutedColor }}>{val}</span> },
    { key: 'product', label: 'Product', bold: true },
    { key: 'qty', label: 'Quantity', render: (val) => {
      const isPositive = val > 0;
      return <span className="font-monospace fw-bold" style={{ color: isPositive ? '#10b981' : '#f43f5e' }}>{isPositive ? '+' : ''}{val.toLocaleString()}</span>;
    }},
    { key: 'cost', label: 'Cost', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>${val.toLocaleString()}</span> },
    { key: 'total', label: 'Total Value', render: (val) => {
      const isPositive = val > 0;
      return <span className="font-monospace fw-bold" style={{ color: isPositive ? '#10b981' : '#f43f5e' }}>${val.toLocaleString()}</span>;
    }},
    { key: 'user', label: 'Processed By', render: (val) => <span style={{ fontSize: '0.75rem', color: mutedColor }}>{val}</span> },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex justify-content-end gap-1">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: '#f43f5e', background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f43f5e'; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const filtersJSX = (
    <div className="d-flex gap-2 align-items-center">
      <select className="form-select form-select-sm" style={{ borderColor: isDark ? '#2d3248' : '#e2e8f0' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
        <option value="All">All Movements</option>
        <option value="Purchase Receipt">Purchase Receipt</option>
        <option value="Sales Delivery">Sales Delivery</option>
        <option value="Internal Transfer">Internal Transfer</option>
        <option value="Stock Adjustment">Stock Adjustment</option>
      </select>
      <div className="d-flex gap-1">
        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'table' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'table' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faList} /></button>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'card' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'card' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('card')}><FontAwesomeIcon icon={faChartPie} /></button>
      </div>
      <button className="btn btn-sm premium-btn" style={{ background: 'transparent', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: mutedColor }} onClick={() => { setSearchTerm(''); setTypeFilter('All'); }}>Clear</button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faHistory}
      title="Centralized Stock Movement Ledger"
      description="Complete audit trail of all inventory transactions, dispatches, warehouse bin changes, and stock write-offs."
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm premium-btn" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 600 }} onClick={openAddPage}><FontAwesomeIcon icon={faWarehouse} className="me-1" /> Add Movement</button>
          <button className="btn btn-sm premium-btn" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 600 }} onClick={() => addNotification('Inventory audit document generated.', 'info')}>Audit Export</button>
          <button className="btn btn-sm premium-btn" style={{ background: 'transparent', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: mutedColor }} onClick={() => addNotification('Movement register re-indexed.', 'success')}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>
      }
    >
      <div className="row g-2 mb-4">
        {[
          { label: "Today's Movements", val: filteredMovements.length, icon: faHistory, color: '#6366f1', trendVal: 'entries' },
          { label: 'Inbound Transactions', val: filteredMovements.filter(m => m.qty > 0).length, icon: faArrowRight, color: '#10b981', trendVal: 'logs' },
          { label: 'Outbound Dispatches', val: filteredMovements.filter(m => m.qty < 0).length, icon: faBoxesStacked, color: '#f43f5e', trendVal: 'logs' },
          { label: 'Total Audited Value Moved', val: '$' + filteredMovements.reduce((acc, curr) => acc + Math.abs(curr.total), 0).toLocaleString(), icon: faCoins, color: '#f59e0b', trendVal: 'value' },
        ].map((k, idx) => (
          <div key={idx} className="col-md-3 enter-anim">
            <div className="p-3 rounded-4 text-start h-100 premium-card glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="text-uppercase fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '0.06em', color: mutedColor }}>{k.label}</div>
                <span className="kpi-icon d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: 10, background: `${k.color}15`, color: k.color, fontSize: '0.85rem' }}>
                  <FontAwesomeIcon icon={k.icon} />
                </span>
              </div>
              <div className="fw-bold" style={{ color: textColor, fontSize: '1.3rem', lineHeight: 1.2 }}><AnimatedCounter value={k.val} duration={600} /></div>
              <div style={{ fontSize: '0.6rem', color: mutedColor }}>{k.trendVal}</div>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'table' ? (
        <ErpDataTable
          columns={columns}
          data={filteredMovements}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by Material name, Movement No..."
          filters={filtersJSX}
          emptyMessage="No movements found."
          emptyIcon={faHistory}
          isDark={isDark}
          title="Inventory Transaction Ledger"
          titleIcon={faHistory}
          exportButtons={exportButtons}
        />
      ) : (
        <div className="row g-3 mb-4">
          {filteredMovements.map(m => {
            const positive = m.qty > 0;
            return (
              <div key={m.id} className="col-md-4">
                <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{m.number}</span>
                    <span className="premium-badge" style={{ background: `${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`, color: positive ? '#10b981' : '#f43f5e' }}>
                      <span className="badge-dot" style={{ background: positive ? '#10b981' : '#f43f5e' }} />{m.type}
                    </span>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: textColor }}>{m.product}</h6>
                  <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{m.warehouse} &bull; {m.date}</span>
                  <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                    <div>
                      <span className="font-monospace fw-bold" style={{ color: positive ? '#10b981' : '#f43f5e' }}>{positive ? '+' : ''}{m.qty.toLocaleString()}</span>
                      <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block">${m.total.toLocaleString()}</span>
                    </div>
                    <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setViewItem(m)}>
                      <FontAwesomeIcon icon={faEye} className="me-1" />View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faHistory} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Stock Movement Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: `${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`, color: viewItem.qty > 0 ? '#10b981' : '#f43f5e', borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.qty > 0 ? '#10b981' : '#f43f5e' }} />
                    {viewItem.type}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1 font-monospace" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.number}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Product: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.product}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.date}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Warehouse: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.warehouse}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: viewItem.qty > 0 ? '#10b981' : '#f43f5e', fontSize: '1.1rem' }}>{viewItem.qty > 0 ? '+' : ''}{viewItem.qty.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit Cost</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.95rem' }}>${viewItem.cost.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Value</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: viewItem.total > 0 ? '#10b981' : '#f43f5e', fontSize: '0.95rem' }}>${viewItem.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Processing</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Processed by <span className="fw-semibold">{viewItem.user}</span>. A corresponding GL entry was posted to the stock ledger.</p>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: 'transparent', border: `1px solid ${borderColor}`, color: mutedColor, fontSize: '0.75rem' }} onClick={() => { setViewItem(null); handleEdit(viewItem); }}>
                    <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit
                  </button>
                  <button className="btn btn-sm text-white border-0 px-3" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem' }} onClick={() => addNotification('Ledger entry exposed to reporting engine.', 'success')}>
                    <FontAwesomeIcon icon={faWarehouse} className="me-1" /> View Ledger Posting
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
        title="Remove Movement Record"
        message="Are you sure you want to remove this movement record from the ledger? This cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Remove"
      />

      {/* Add / Edit Movement Modal */}
    </ErpPageShell>
  );
};
 
export default ErpStockMovements;