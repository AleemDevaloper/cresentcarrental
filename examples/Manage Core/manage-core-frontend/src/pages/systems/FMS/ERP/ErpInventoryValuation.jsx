import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh, faCalculator, faBuildingColumns, faChartLine,
  faScaleBalanced, faShieldHalved, faArrowRotateLeft, faCoins,
  faFileWord, faFileAlt, faEye, faEdit, faTrashCan, faList, faChartPie
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog, EnableDisableButton } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const seedValuation = [
  { id: 1, product: 'High-Grade Aluminum Bars (Grade A)', category: 'Metals & Alloys', warehouse: 'Chicago Central WH', qty: 4500, avgCost: 120, fifoValue: 540000, standardCost: 118, currentValuation: 540000, status: 'Active' },
  { id: 2, product: 'Micro-Controller Processing Core', category: 'Electronics & Chips', warehouse: 'Shenzhen Buffer WH', qty: 800, avgCost: 45, fifoValue: 360000, standardCost: 48, currentValuation: 360000, status: 'Active' },
  { id: 3, product: 'Hydraulic Pressure Valve Seal', category: 'Hydraulics & Fluids', warehouse: 'Chicago Central WH', qty: 50, avgCost: 15, fifoValue: 750, standardCost: 15, currentValuation: 750, status: 'Active' },
  { id: 4, product: 'Industrial Grade Epoxy Sealant', category: 'Chemicals & Adhesives', warehouse: 'Austin Distribution Center', qty: 0, avgCost: 28, fifoValue: 0, standardCost: 25, currentValuation: 0, status: 'Draft' },
];

const ErpInventoryValuation = () => {
  const { theme, addNotification, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [activeSubTab, setActiveSubTab] = useState('costing');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [valuationData, setValuationData] = useState(seedValuation);
  const [postRealTimeCOGS, setPostRealTimeCOGS] = useState(true);
  const [costVarianceAlert, setCostVarianceAlert] = useState(true);

  useEffect(() => {
    const onRefresh = () => addNotification?.('Valuation ledger refreshed.', 'info');
    window.addEventListener('erp:refresh', onRefresh);
    window.addEventListener('app:minor-refresh', onRefresh);
    return () => {
      window.removeEventListener('erp:refresh', onRefresh);
      window.removeEventListener('app:minor-refresh', onRefresh);
    };
  }, []);

  const filteredValuation = valuationData
    .filter(v => v.status !== 'Archived')
    .filter(v =>
      v.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      const rowObjects = filteredValuation.map(v => ({
        'Product Name': v.product, 'Warehouse': v.warehouse,
        'Inventory Qty': v.qty, 'Weighted Avg Cost': '$' + v.avgCost,
        'FIFO Cost Value': '$' + v.fifoValue.toLocaleString(),
        'Standard Cost': '$' + v.standardCost,
        'Total Book Value': '$' + v.currentValuation.toLocaleString(),
      }));
      const headers = Object.keys(rowObjects[0] || {});
      const rowsArray = rowObjects.map(r => headers.map(h => String(r[h] || '')));
      const csvRows = [headers.join(','), ...rowObjects.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'inventory-valuation.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "InventoryValuation.xlsx"); a.click();
      } else if (format === 'pdf') {
        await exportPdf({ title: 'Inventory Valuation', headers, rows: rowsArray, filename: 'inventory-valuation.pdf' });
      } else if (format === 'word') {
        await exportWord({ title: 'Inventory Valuation', headers, rows: rowsArray, filename: 'inventory-valuation.doc' });
      } else if (format === 'docx') {
        await exportDocx({ title: 'Inventory Valuation', headers, rows: rowsArray, filename: 'inventory-valuation.docx' });
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
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}>PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
        </ul>
      </div>
    </div>
  );

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'inventory_valuation' });
    addNotification?.('Valuation record opened for revaluation.', 'info');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: row.product });
  const handleDeleteConfirm = () => {
    setValuationData(prev => prev.filter(v => v.id !== deleteDialog.id));
    addNotification?.('Valuation record archived.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const kpiData = [
    { label: 'Current Inventory Value', val: '$900,750', icon: faCoins, color: '#10b981', trend: 'up', trendVal: 'WAC calc' },
    { label: 'Valuation Growth (MTD)', val: '+12.4%', icon: faChartLine, color: '#6366f1', trend: 'up', trendVal: 'growth' },
    { label: 'Shrinkage & Scrap Value', val: '$280', icon: faArrowRotateLeft, color: '#f43f5e', trend: 'down', trendVal: 'adjusted' },
    { label: 'Variance Alerts Count', val: '0', icon: faShieldHalved, color: '#3b82f6', trend: 'up', trendVal: 'captured' },
  ];

  const columns = [
    { key: 'product', label: 'Product Name', bold: true },
    { key: 'warehouse', label: 'Warehouse Location', render: (val) => <span style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>{val}</span> },
    { key: 'qty', label: 'Inventory Quantity', render: (val) => <span className="font-monospace fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{val.toLocaleString()} units</span> },
    { key: 'avgCost', label: 'Weighted Avg Cost', render: (val) => <span className="font-monospace" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>${val.toLocaleString()}</span> },
    { key: 'fifoValue', label: 'FIFO Cost Value', render: (val) => <span className="font-monospace" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>${val.toLocaleString()}</span> },
    { key: 'standardCost', label: 'Standard Cost', render: (val) => <span className="font-monospace" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>${val.toLocaleString()}</span> },
    { key: 'currentValuation', label: 'Total Book Value', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#10b981' }}>${val.toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex justify-content-end gap-1">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => setViewItem(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Revalue" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
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
    <div className="d-flex gap-1 align-items-center">
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'table' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'table' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faList} /></button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'card' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'card' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('card')}><FontAwesomeIcon icon={faChartPie} /></button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faCalculator}
      title="Financial Costing & Inventory Valuation"
      description="Execute inventory asset valuation calculations (FIFO, LIFO, WAC), generate compliance ledgers, and post adjustments."
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm premium-btn" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 600 }} onClick={() => addNotification('Auto-revaluation ledger posted to GL.', 'success')}><FontAwesomeIcon icon={faCalculator} className="me-1" /> Run Revaluation</button>
          <button className="btn btn-sm premium-btn" style={{ background: 'transparent', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: isDark ? '#94a3b8' : '#64748b' }} onClick={() => addNotification('Inventory asset balance synced with GL.', 'success')}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>
      }
    >
      <div className="row g-2 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-3" />
        ))}
      </div>

      <div className="glass-card p-1 mb-4 d-inline-flex" style={{ borderRadius: 12, gap: 2 }}>
        {[
          { id: 'costing', label: 'Material Valuation Ledger', icon: faScaleBalanced },
          { id: 'integration', label: 'Accounting Integration Map', icon: faBuildingColumns },
          { id: 'analytics', label: 'Valuation & Cost Trends', icon: faChartLine }
        ].map(st => (
          <button
            key={st.id}
            className="btn btn-sm px-3 py-2 rounded-3 fw-bold"
            style={{
              border: 'none',
              background: activeSubTab === st.id ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
              color: activeSubTab === st.id ? '#6366f1' : (isDark ? '#94a3b8' : '#64748b'),
              borderBottom: activeSubTab === st.id ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.25s ease'
            }}
            onClick={() => setActiveSubTab(st.id)}
          >
            <FontAwesomeIcon icon={st.icon} className="me-2" />
            {st.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'costing' && (
        viewMode === 'table' ? (
          <ErpDataTable
            columns={columns}
            data={filteredValuation}
            searchable
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by Material Name, Category..."
            filters={filtersJSX}
            emptyMessage="No valuation records found."
            emptyIcon={faCalculator}
            isDark={isDark}
            title="Material Valuation Ledger"
            titleIcon={faScaleBalanced}
            exportButtons={exportButtons}
          />
        ) : (
          <div className="row g-3 mb-4">
            {filteredValuation.map(v => (
              <div key={v.id} className="col-md-4">
                <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{v.category}</span>
                    <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{v.status}</span>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: textColor }}>{v.product}</h6>
                  <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{v.warehouse} &bull; {v.qty.toLocaleString()} units</span>
                  <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                    <div>
                      <span className="font-monospace fw-bold" style={{ color: '#10b981' }}>${v.currentValuation.toLocaleString()}</span>
                      <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block">Book Value</span>
                    </div>
                    <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setViewItem(v)}>
                      <FontAwesomeIcon icon={faEye} className="me-1" />View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeSubTab === 'integration' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="glass-card p-4 text-start h-100" style={{ borderRadius: 16 }}>
              <div className="section-header">
                <span className="accent-bar" style={{ background: '#6366f1' }} />
                <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Inventory Accounts Mapping</h6>
              </div>
              <div className="d-flex flex-column gap-3 small">
                <div>
                  <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Default Inventory Asset Account:</strong>
                  <span className="font-monospace d-block" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>13100 - Inventory Raw Materials</span>
                </div>
                <div>
                  <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Cost of Goods Sold (COGS) Account:</strong>
                  <span className="font-monospace d-block" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>51000 - Cost of Goods Sold</span>
                </div>
                <div>
                  <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Inventory Adjustment Account (Gains/Losses):</strong>
                  <span className="font-monospace d-block" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>52100 - Stock Revaluation adjustments</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-card p-4 text-start h-100" style={{ borderRadius: 16 }}>
              <div className="section-header">
                <span className="accent-bar" style={{ background: '#10b981' }} />
                <h6 style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Posting Rules & Tolerances</h6>
              </div>
              <p className="small" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Manage automatic journal entry generation during receipt processing or write-off scrap events.</p>
              <div className="mb-3">
                <EnableDisableButton checked={postRealTimeCOGS} onClick={() => setPostRealTimeCOGS(!postRealTimeCOGS)} label="Post Real-Time cost of goods sold journal entries" />
              </div>
              <div className="mb-3">
                <EnableDisableButton checked={costVarianceAlert} onClick={() => setCostVarianceAlert(!costVarianceAlert)} label="Alert on cost variance above 5%" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="row g-3">
          {kpiData.map((c, i) => (
            <ErpKpiCard key={i} label={c.label} value={c.val} icon={c.icon} color={c.color} trend={c.trend} trendVal={c.trendVal} isDark={isDark} colClass="col-md-3" />
          ))}
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faCalculator} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Valuation Preview</span>
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
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.05rem' }}>{viewItem.product}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Category: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.category}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Warehouse: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.warehouse}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Qty: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.qty.toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3 text-center">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WAC Cost</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.95rem' }}>${viewItem.avgCost.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FIFO Value</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.95rem' }}>${viewItem.fifoValue.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Standard Cost</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.95rem' }}>${viewItem.standardCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f0fdf4', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Book Value</small>
                  <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1.3rem' }}>${viewItem.currentValuation.toLocaleString()}</p>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: 'transparent', border: `1px solid ${borderColor}`, color: mutedColor, fontSize: '0.75rem' }} onClick={() => addNotification('Manual revaluation active.', 'info')}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} className="me-1" /> Revalue
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
        title="Archive Valuation Record"
        message="Are you sure you want to archive this valuation record? You can restore it later."
        itemName={deleteDialog.name}
        confirmLabel="Archive"
      />
    </ErpPageShell>
  );
};

export default ErpInventoryValuation;