import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faRefresh, faArrowRight,
  faCheckCircle, faTruck, faFileWord, faFileAlt,
  faEye, faEdit, faTrashCan, faList, faChartPie, faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const seedTransfers = [
  { id: 1, number: 'ST-1001', date: '2026-07-01', fromWh: 'WH-North', toWh: 'WH-South', product: 'SKU-A100', qty: 120, carrier: 'LBC Express', tracker: 'TRK-88231', status: 'Requested' },
  { id: 2, number: 'ST-1002', date: '2026-07-03', fromWh: 'WH-East', toWh: 'WH-West', product: 'SKU-B205', qty: 64, carrier: 'J&T', tracker: 'TRK-77410', status: 'Approved' },
  { id: 3, number: 'ST-1003', date: '2026-07-05', fromWh: 'WH-South', toWh: 'WH-North', product: 'SKU-C330', qty: 200, carrier: 'FedEx', tracker: 'TRK-66129', status: 'In Transit' },
  { id: 4, number: 'ST-1004', date: '2026-06-28', fromWh: 'WH-West', toWh: 'WH-East', product: 'SKU-D410', qty: 88, carrier: 'LBC Express', tracker: 'TRK-55098', status: 'Completed' },
  { id: 5, number: 'ST-1005', date: '2026-07-06', fromWh: 'WH-North', toWh: 'WH-Austin', product: 'SKU-E520', qty: 45, carrier: 'DHL', tracker: 'TRK-44120', status: 'Draft' },
];

const ErpStockTransfers = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [transfers, setTransfers] = useState(seedTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    const onRefresh = () => addNotification?.('Transfer register refreshed.', 'info');
    window.addEventListener('erp:refresh', onRefresh);
    window.addEventListener('app:minor-refresh', onRefresh);
    return () => {
      window.removeEventListener('erp:refresh', onRefresh);
      window.removeEventListener('app:minor-refresh', onRefresh);
    };
  }, []);

  const handleApprove = (id) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
    addNotification('Transfer order approved.', 'success');
  };

  const handleDispatch = (id) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'In Transit' } : t));
    addNotification('Items dispatched and in-transit tracking initiated.', 'success');
  };

  const handleReceive = (id) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    addNotification('Stock received and quantity balances consolidated.', 'success');
  };

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'stock_transfer' });
    setActiveTab('erp_request_stock_transfer');
  };

  const handleMoveToDraft = (row) => {
    const next = row.status === 'Draft' ? 'Requested' : 'Draft';
    setTransfers(prev => prev.map(t => t.id === row.id ? { ...t, status: next } : t));
    addNotification?.(`Transfer ${row.number} moved to ${next}.`, 'success');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: `${row.number} - ${row.product}` });
  const handleDeleteConfirm = () => {
    setTransfers(prev => prev.filter(t => t.id !== deleteDialog.id));
    addNotification?.('Transfer order removed.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const filteredTransfers = transfers
    .filter(t => t.status !== 'Archived')
    .filter(t =>
      t.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    try {
      const rows = filteredTransfers.map(t => ({
        'Transfer Order No': t.number, 'Request Date': t.date,
        'Source WH': t.fromWh, 'Destination WH': t.toWh, 'Product SKU': t.product,
        'Transfer Qty': t.qty, 'Carrier': t.carrier, 'Tracker': t.tracker,
        'Status': t.status,
      }));
      const headers = Object.keys(rows[0] || {});
      const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'stock-transfers.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "StockTransfers.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx(rows, headers, 'Stock Transfers Report', 'StockTransfers');
      } else if (format === 'pdf') {
        await exportPdf(rows, headers, 'Stock Transfers', 'StockTransfers');
      } else if (format === 'word') {
        await exportWord(rows, headers, 'Stock Transfers Report', 'StockTransfers');
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
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
        </ul>
      </div>
    </div>
  );

  const columns = [
    { key: 'number', label: 'Transfer Order No', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{val}</span> },
    { key: 'date', label: 'Request Date', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>{val}</span> },
    { key: 'fromWh', label: 'Source WH', render: (val) => <span className="fw-bold" style={{ color: '#f43f5e' }}>{val}</span> },
    { key: 'toWh', label: 'Destination WH', render: (val) => <span className="fw-bold" style={{ color: '#10b981' }}>{val}</span> },
    { key: 'product', label: 'Product SKU', style: { color: textColor } },
    { key: 'qty', label: 'Transfer Qty', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>{val.toLocaleString()} units</span> },
    { key: 'carrier', label: 'Carrier Details', render: (val, row) => (
      <div>
        <span className="small d-block" style={{ color: mutedColor }}>{row.carrier}</span>
        <span className="font-monospace extra-small" style={{ color: mutedColor }}>{row.tracker}</span>
      </div>
    )},
    { key: 'status', label: 'Transit Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex justify-content-end gap-1 align-items-center">
        {row.status === 'Requested' && (
          <button className="btn btn-xs premium-btn" style={{ background: '#10b981', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.65rem', padding: '4px 10px' }} onClick={() => handleApprove(row.id)}>Approve</button>
        )}
        {row.status === 'Approved' && (
          <button className="btn btn-xs premium-btn" style={{ background: '#6366f1', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.65rem', padding: '4px 10px' }} onClick={() => handleDispatch(row.id)}>Dispatch</button>
        )}
        {row.status === 'In Transit' && (
          <button className="btn btn-xs premium-btn" style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', fontWeight: 600, fontSize: '0.65rem', padding: '4px 10px' }} onClick={() => handleReceive(row.id)}>Receive Stock</button>
        )}
        {row.status === 'Completed' && (
          <span className="small fw-bold" style={{ color: '#10b981' }}><FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Logged</span>
        )}
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

  const filtersJSX = (
    <div className="d-flex gap-1 align-items-center">
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'table' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'table' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faList} /></button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'card' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'card' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('card')}><FontAwesomeIcon icon={faChartPie} /></button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faTruck}
      title="Inter-Warehouse Stock Transfers"
      description="Coordinate material movements between corporate storage zones, track freight transit times, and authorize receipts."
      action={
        <div className="d-flex gap-2">
          <button className="btn btn-sm premium-btn" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 600 }} onClick={() => setActiveTab('erp_request_stock_transfer')}><FontAwesomeIcon icon={faPlus} className="me-1" /> Request Stock Transfer</button>
          <button className="btn btn-sm premium-btn" style={{ background: 'transparent', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, color: mutedColor }} onClick={() => addNotification('Refreshed transit routes.', 'success')}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>
      }
    >
      <div className="row g-2 mb-4">
        {[
          { label: 'Total Transfer Requests', val: filteredTransfers.length, icon: faTruck, color: '#6366f1' },
          { label: 'Active In-Transit', val: filteredTransfers.filter(t => t.status === 'In Transit').length, icon: faArrowRight, color: '#f59e0b' },
          { label: 'Completed This Month', val: filteredTransfers.filter(t => t.status === 'Completed').length, icon: faCheckCircle, color: '#10b981' },
          { label: 'Pending & Draft', val: filteredTransfers.filter(t => t.status === 'Requested' || t.status === 'Draft').length, icon: faFileSignature, color: '#f43f5e' },
        ].map((k, idx) => (
          <div key={idx} className="col-md-3 enter-anim">
            <div className="p-3 rounded-4 text-start h-100 premium-card glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="text-uppercase fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '0.06em', color: mutedColor }}>{k.label}</div>
                <span className="kpi-icon d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: 10, background: `${k.color}15`, color: k.color, fontSize: '0.85rem' }}>
                  <FontAwesomeIcon icon={k.icon} />
                </span>
              </div>
              <div className="fw-bold" style={{ color: textColor, fontSize: '1.3rem', lineHeight: 1.2 }}>{k.val}</div>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'table' ? (
        <ErpDataTable
          columns={columns}
          data={filteredTransfers}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search transfers..."
          filters={filtersJSX}
          emptyMessage="No transfers found."
          emptyIcon={faTruck}
          isDark={isDark}
          title="Transfer Register"
          titleIcon={faTruck}
          exportButtons={exportButtons}
        />
      ) : (
        <div className="row g-3 mb-4">
          {filteredTransfers.map(t => (
            <div key={t.id} className="col-md-4">
              <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{t.number}</span>
                  <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: mutedColor }}>{t.status}</span>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}>{t.product}</h6>
                <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{t.fromWh} <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.6rem' }} /> {t.toWh} &bull; {t.date}</span>
                <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                  <div>
                    <span className="font-monospace fw-bold" style={{ color: textColor }}>{t.qty.toLocaleString()} units</span>
                    <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block">{t.carrier} &bull; {t.tracker}</span>
                  </div>
                  <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setViewItem(t)}>
                    <FontAwesomeIcon icon={faEye} className="me-1" />View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} style={{ color: '#6366f1', fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Stock Transfer Preview</span>
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
                    <h4 className="fw-bold mb-1 font-monospace" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.number}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Product: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.product}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Request Date: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.date}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Qty: <span className="fw-semibold font-monospace" style={{ color: textColor }}>{viewItem.qty} units</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Source</small>
                      <p className="mb-0 mt-1 fw-bold" style={{ color: '#f43f5e', fontSize: '0.85rem' }}>{viewItem.fromWh}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destination</small>
                      <p className="mb-0 mt-1 fw-bold" style={{ color: '#10b981', fontSize: '0.85rem' }}>{viewItem.toWh}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.status}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Carrier & Tracking</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Shipped via <span className="fw-semibold">{viewItem.carrier}</span> &mdash; Tracking: <span className="fw-semibold font-monospace">{viewItem.tracker}</span></p>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  {viewItem.status === 'Requested' && (
                    <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: '#10b981', border: 'none', color: '#fff', fontSize: '0.75rem' }} onClick={() => { handleApprove(viewItem.id); setViewItem({ ...viewItem, status: 'Approved' }); }}>
                      Approve
                    </button>
                  )}
                  <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: 'transparent', border: `1px solid ${borderColor}`, color: mutedColor, fontSize: '0.75rem' }} onClick={() => { setViewItem(null); handleMoveToDraft(viewItem); }}>
                    <FontAwesomeIcon icon={faFileSignature} className="me-1" /> Move to {viewItem.status === 'Draft' ? 'Requested' : 'Draft'}
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
        title="Remove Transfer Order"
        message="Are you sure you want to remove this transfer order? This cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Remove"
      />
    </ErpPageShell>
  );
};

export default ErpStockTransfers;