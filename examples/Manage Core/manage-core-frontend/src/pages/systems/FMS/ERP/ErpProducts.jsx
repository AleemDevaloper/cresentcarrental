import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faEdit, faTrash,
  faRefresh, faCheckCircle, faBan, faBarcode, faBoxesStacked, faCoins,
  faDollarSign, faWarehouse, faStar, faChevronRight, faChevronLeft, faXmark,
  faPrint, faScaleBalanced, faChartLine, faChartPie, faClock, faBriefcase, faHistory,
  faArrowRotateLeft, faFolderOpen, faTruck, faTag, faCheck, faFileAlt, faFileWord, faTimeline,
  faInfoCircle, faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { listProducts } from '../../../../api/fms';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpProducts = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [activeViewTab, setActiveViewTab] = useState('directory');
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const normalizeProduct = (v) => ({
    id: v.id,
    code: v.product_code || '',
    sku: v.sku || '',
    name: v.name || '',
    displayName: v.name || '',
    type: v.material_type || '',
    category: v.category?.name || '',
    brand: '',
    barcode: v.ean || '',
    origin: '',
    status: v.status === 'active' ? 'Active' : v.status === 'inactive' ? 'Inactive' : v.status || 'Active',
    purchasePrice: parseFloat(v.purchase_cost || 0),
    sellingPrice: parseFloat(v.sales_price || 0),
    currentStock: parseInt(v.current_stock || v.initial_stock || 0),
    reservedStock: 0,
    minStock: parseInt(v.min_stock || 0),
    maxStock: parseInt(v.max_stock || 0),
    reorderPoint: parseInt(v.reorder_point || 0),
    warehouse: v.warehouse || '',
    binLocation: v.bin_location || '',
    costingMethod: v.costing_method || '',
    abcClass: v.abc_class || '',
    turnoverRate: 0,
    profitMargin: 0,
    leadTime: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await listProducts({ per_page: 100, _t: Date.now() });
      const apiItems = res.data?.data || [];
      const items = apiItems.map(normalizeProduct);
      const pendingRaw = localStorage.getItem('product_pending_created');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          const isReturned = apiItems.some(v => v.id === pending.id || v.product_code === pending.product_code);
          if (isReturned) {
            localStorage.removeItem('product_pending_created');
          } else {
            items.unshift(normalizeProduct(pending));
          }
        } catch (e) {
          localStorage.removeItem('product_pending_created');
        }
      }
      setProducts(items);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      addNotification(err.data?.message || err.message || 'Failed to fetch products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => {
    const onRefresh = () => fetchProducts();
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
      const rows = filteredProducts.map(p => ({
        'Product Code': p.code, 'Product Name': p.name, 'SKU': p.sku,
        'Category': p.category, 'Selling Price': '$' + p.sellingPrice,
        'Stock': p.currentStock, 'Warehouse': p.warehouse, 'ABC': p.abcClass,
        'Status': p.status,
      }));
      const headers = Object.keys(rows[0] || {});
      const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))];
      const csvContent = csvRows.join('\n');
      if (format === 'csv') {
        downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), 'products.csv');
      } else if (format === 'xlsx') {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
        const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "Products.xlsx"); a.click();
      } else if (format === 'docx') {
        await exportDocx(rows, headers, 'Products Report', 'products');
      } else if (format === 'pdf') {
        await exportPdf(rows, headers, 'Products Report', 'products');
      } else if (format === 'word') {
        await exportWord(rows, headers, 'Products Report', 'products');
      }
      addNotification(`Exported as ${format.toUpperCase()} successfully.`, 'success');
    } catch (err) { addNotification(err.message || 'Export failed', 'error'); }
  };

  const handleDeleteProduct = (id) => {
    const row = products.find(p => p.id === id);
    setDeleteDialog({ show: true, id, name: row ? `${row.code} - ${row.name}` : '' });
  };
  const handleDeleteConfirm = () => {
    setProducts(prev => prev.map(p => p.id === deleteDialog.id ? { ...p, status: 'Archived' } : p));
    addNotification('Product archived.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'product' });
    setActiveTab('erp_add_product');
  };

  const handleMoveToDraft = (row) => {
    const next = row.status === 'Draft' ? 'Active' : 'Draft';
    setProducts(prev => prev.map(p => p.id === row.id ? { ...p, status: next } : p));
    addNotification?.(`Product ${row.code} moved to ${next}.`, 'success');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'All' ||
      (stockFilter === 'Low Stock' && p.currentStock <= p.reorderPoint) ||
      (stockFilter === 'Out of Stock' && p.currentStock === 0) ||
      (stockFilter === 'Normal' && p.currentStock > p.reorderPoint);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const kpiData = [
    { label: 'Total Products in Catalog', val: products.length, icon: faBoxesStacked, color: '#6366f1', trend: 'up', trendVal: 'All Masters', sparkline: [42,44,43,46,45,48,47,50,49,52,51,54] },
    { label: 'Low Stock Products', val: products.filter(p => p.currentStock <= p.reorderPoint).length, icon: faStar, color: '#f43f5e', trend: 'down', trendVal: 'Reorder Needed', sparkline: [5,4,6,3,5,2,4,1,3,2,1,1] },
    { label: 'Total Inventory Book Value', val: '$' + products.reduce((acc, curr) => acc + (curr.currentStock * curr.purchasePrice), 0).toLocaleString(), icon: faCoins, color: '#10b981', trend: 'up', trendVal: 'Asset Value', sparkline: [800,820,810,840,830,860,850,880,870,900,890,920] },
    { label: 'Draft & Pending', val: products.filter(p => p.status === 'Draft' || p.status === 'Pending Approval').length, icon: faFileSignature, color: '#f59e0b', trend: 'up', trendVal: 'Awaiting Review', sparkline: [1,1,2,1,2,3,2,3,2,3,4,3] },
  ];

  const statusColors = {
    Active: { bg: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)', color: '#10b981', dot: '#10b981' },
    Discontinued: { bg: isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.1)', color: '#f43f5e', dot: '#f43f5e' },
    Archived: { bg: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)', color: '#f59e0b', dot: '#f59e0b' },
    Draft: { bg: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', color: '#6366f1', dot: '#6366f1' },
    'Pending Approval': { bg: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)', color: '#f59e0b', dot: '#f59e0b' },
  };

  const columns = [
    { key: 'code', label: 'Product Code', bold: true, render: (val, row) => <span className="font-monospace fw-bold" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => setSelectedProduct(row)}>{val}</span> },
    { key: 'name', label: 'Product Name', render: (val, row) => (
      <div>
        <span className="fw-bold d-block" style={{ color: textColor }}>{val}</span>
        <span style={{ color: mutedColor, fontSize: '0.7rem' }}>{row.type} &bull; Origin: {row.origin}</span>
      </div>
    )},
    { key: 'sku', label: 'SKU', render: (val) => <span className="font-monospace" style={{ color: mutedColor }}>{val}</span> },
    { key: 'category', label: 'Category', render: (val) => <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{val}</span> },
    { key: 'sellingPrice', label: 'Selling Price', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: '#6366f1' }}>${val.toLocaleString()}</span> },
    { key: 'currentStock', label: 'Current stock', render: (val, row) => {
      const isLowStock = val <= row.reorderPoint;
      return (
        <span className="font-monospace">
          <span style={{ color: isLowStock ? '#f43f5e' : textColor, fontWeight: isLowStock ? 700 : 400 }}>{val.toLocaleString()}</span>
          {isLowStock && <span className="premium-badge ms-1" style={{ background: isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.1)', color: '#f43f5e' }}><span className="badge-dot" style={{ background: '#f43f5e' }} />Low</span>}
        </span>
      );
    }},
    { key: 'warehouse', label: 'Warehouse', render: (val) => <span style={{ color: mutedColor, fontSize: '0.75rem' }}>{val}</span> },
    { key: 'abcClass', label: 'ABC', render: (val) => <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{val}</span> },
    { key: 'status', label: 'Lifecycle' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex justify-content-end gap-1">
        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, padding: '3px 8px' }} onClick={() => setSelectedProduct(row)} title="View Detail"><FontAwesomeIcon icon={faEye} style={{ fontSize: 10 }} /></button>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, padding: '3px 8px' }} onClick={() => handleEdit(row)} title="Edit"><FontAwesomeIcon icon={faEdit} style={{ fontSize: 10 }} /></button>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)', border: 'none', color: '#f59e0b', padding: '3px 8px' }} onClick={() => handleMoveToDraft(row)} title="Toggle Draft"><FontAwesomeIcon icon={faFileSignature} style={{ fontSize: 10 }} /></button>
        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.1)', border: 'none', color: '#f43f5e', padding: '3px 8px' }} onClick={() => handleDeleteProduct(row.id)} title="Archive"><FontAwesomeIcon icon={faTrash} style={{ fontSize: 10 }} /></button>
      </div>
    )},
  ];

  const filterControls = (
    <>
      <select className="form-select form-select-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
        <option value="All">All Categories</option>
        <option value="Metals & Alloys">Metals & Alloys</option>
        <option value="Electronics & Chips">Electronics & Chips</option>
        <option value="Hydraulics & Fluids">Hydraulics & Fluids</option>
        <option value="Chemicals & Adhesives">Chemicals & Adhesives</option>
      </select>
      <select className="form-select form-select-sm" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
        <option value="All">All Stocks</option>
        <option value="Low Stock">Low Stock Alerts</option>
        <option value="Out of Stock">Out of Stock</option>
        <option value="Normal">Normal</option>
      </select>
    </>
  );

  const actionHeader = (
    <div className="d-flex gap-2 flex-shrink-0">
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }} onClick={() => fetchProducts()}>
        <FontAwesomeIcon icon={faRefresh} spin={loading} className="me-1" /> Refresh
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }} onClick={() => setActiveTab('erp_add_product')}>
        <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Product
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }} onClick={() => addNotification('Bulk import active.', 'info')}>
        Bulk Import
      </button>
      <div className="dropdown">
        <button className="premium-btn btn btn-sm dropdown-toggle" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }} type="button" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
        </button>
        <ul className="dropdown-menu" style={{ background: isDark ? '#232736' : '#ffffff', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRadius: 10 }}>
          <li><button className="dropdown-item py-1" style={{ color: textColor, fontSize: '0.78rem' }} onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFileExport} className="me-2" />Export PDF</button></li>
          <li><button className="dropdown-item py-1" style={{ color: textColor, fontSize: '0.78rem' }} onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Export DOCX</button></li>
          <li><button className="dropdown-item py-1" style={{ color: textColor, fontSize: '0.78rem' }} onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Export Word</button></li>
          <li><button className="dropdown-item py-1" style={{ color: textColor, fontSize: '0.78rem' }} onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExport} className="me-2" />Export Excel</button></li>
          <li><button className="dropdown-item py-1" style={{ color: textColor, fontSize: '0.78rem' }} onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileExport} className="me-2" />Export CSV</button></li>
        </ul>
      </div>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }} onClick={() => addNotification('Barcode generator launched.', 'info')}>
        <FontAwesomeIcon icon={faBarcode} className="me-1" /> Print Labels
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', padding: '6px 14px', color: textColor, fontWeight: 600, fontSize: '0.78rem' }} onClick={() => addNotification('Stock positions synced.', 'success')}>
        Sync Inventory
      </button>
    </div>
  );

  const navTabs = (
    <div className="d-flex glass-card px-2 py-1 mb-4" style={{ gap: '0.15rem', borderRadius: '14px' }}>
      {[
        { id: 'directory', label: 'Material Registry', icon: faBoxesStacked },
        { id: 'dashboard', label: 'Valuation & Stock KPIs', icon: faChartPie },
        { id: 'analytics', label: 'Inventory Intelligence (AI)', icon: faChartLine },
        { id: 'reports', label: 'Dispatches & Ledger Reports', icon: faFileAlt }
      ].map(tb => (
        <button key={tb.id}
          className={`btn btn-sm fw-bold border-0 ${activeViewTab === tb.id ? '' : 'text-muted'}`}
          style={{
            borderRadius: 10, padding: '8px 16px', fontSize: '0.78rem',
            background: activeViewTab === tb.id ? (isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)') : 'transparent',
            color: activeViewTab === tb.id ? '#6366f1' : mutedColor,
            borderBottom: activeViewTab === tb.id ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveViewTab(tb.id)}
        >
          <FontAwesomeIcon icon={tb.icon} className="me-2" /> {tb.label}
        </button>
      ))}
    </div>
  );

  return (
    <ErpPageShell
      icon={faBoxesStacked}
      title="Centralized Product Master Database"
      description="Manage products, inventory items, raw materials, finished goods, consumables, spare parts, and bundles from one centralized enterprise product catalog."
      action={actionHeader}
    >
      {navTabs}

      {/* Global KPI Row */}
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} sparkline={k.sparkline} isDark={isDark} colClass="col-md-3" />
        ))}
      </div>

      {/* DIRECTORY */}
      {activeViewTab === 'directory' && (
        <div>
          {/* Advanced Filters */}
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text" style={{ background: isDark ? '#1a1d29' : '#ffffff', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRight: 'none', color: mutedColor, borderRadius: '10px 0 0 10px' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input type="text" className="form-control" style={{ borderLeft: 'none', borderRadius: '0 10px 10px 0' }} placeholder="Search by SKU, Product Name, Barcode, Code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select form-select-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Metals & Alloys">Metals & Alloys</option>
                  <option value="Electronics & Chips">Electronics & Chips</option>
                  <option value="Hydraulics & Fluids">Hydraulics & Fluids</option>
                  <option value="Chemicals & Adhesives">Chemicals & Adhesives</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select form-select-sm" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
                  <option value="All">All Stocks</option>
                  <option value="Low Stock">Low Stock Alerts</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div className="col-md-2 d-flex justify-content-end gap-1">
                <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'table' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'table' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faList} /></button>
                <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'card' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'card' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('card')}><FontAwesomeIcon icon={faChartPie} /></button>
                <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'kanban' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'kanban' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('kanban')}><FontAwesomeIcon icon={faTimeline} /></button>
              </div>
            </div>
          </div>

          {viewMode === 'table' && (
            <ErpDataTable
              columns={columns}
              data={paginatedProducts}
              loading={loading}
              emptyMessage="No products found."
              emptyIcon={faBoxesStacked}
              isDark={isDark}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              totalEntries={filteredProducts.length}
              onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
            />
          )}

          {viewMode === 'card' && (
            <div className="row g-3 mb-4">
              {filteredProducts.map(p => {
                const sc = statusColors[p.status] || statusColors.Active;
                return (
                  <div key={p.id} className="col-md-4">
                    <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{p.code}</span>
                        <span className="premium-badge" style={{ background: sc.bg, color: sc.color }}>
                          <span className="badge-dot" style={{ background: sc.dot }} />{p.status}
                        </span>
                      </div>
                      <h6 className="fw-bold mb-1" style={{ color: textColor }}>{p.name}</h6>
                      <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{p.category} &bull; SKU: {p.sku}</span>
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                        <div>
                          <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Available Stock</span>
                          <span className="font-monospace fw-bold" style={{ color: textColor }}>{p.currentStock.toLocaleString()}</span>
                        </div>
                        <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontWeight: 600, fontSize: '0.72rem', padding: '5px 14px' }} onClick={() => setSelectedProduct(p)}>
                          Edit Master
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'kanban' && (
            <div className="row g-3 mb-4 flex-nowrap overflow-auto py-2">
              {['Draft', 'Active', 'Discontinued', 'Archived'].map(stage => {
                const stageProds = filteredProducts.filter(p => p.status === stage || (stage === 'Draft' && p.status === 'Pending Approval'));
                return (
                  <div key={stage} className="col-md-3 flex-shrink-0" style={{ minWidth: '280px' }}>
                    <div className="glass-card p-3 h-100" style={{ borderRadius: '16px' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <span className="fw-bold small" style={{ color: textColor }}>{stage}</span>
                        <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{stageProds.length}</span>
                      </div>
                      <div className="d-flex flex-column gap-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {stageProds.map(p => (
                          <div key={p.id} className="glass-card p-3" style={{ borderRadius: '12px', cursor: 'pointer' }} onClick={() => setSelectedProduct(p)}>
                            <div className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem', marginBottom: 4 }}>{p.code}</div>
                            <div className="fw-bold small mb-2" style={{ color: textColor }}>{p.name}</div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold" style={{ color: '#6366f1', fontSize: '0.75rem' }}>${p.sellingPrice}</span>
                              <span style={{ color: mutedColor, fontSize: '0.7rem' }}>{p.currentStock} units</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DASHBOARD */}
      {activeViewTab === 'dashboard' && (
        <div>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="glass-card premium-card p-3 h-100 enter-anim" style={{ borderRadius: '16px' }}>
                <div className="section-header">
                  <div className="accent-bar" style={{ background: '#10b981' }} />
                  <h6 style={{ color: textColor }}>Active Products</h6>
                </div>
                <div className="h2 fw-bold mb-1" style={{ color: '#10b981' }}>
                  <AnimatedCounter value={products.filter(p => p.status === 'Active').length} />
                </div>
                <small style={{ color: mutedColor }}>Currently in circulation</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card premium-card p-3 h-100 enter-anim" style={{ borderRadius: '16px' }}>
                <div className="section-header">
                  <div className="accent-bar" style={{ background: '#f43f5e' }} />
                  <h6 style={{ color: textColor }}>Discontinued</h6>
                </div>
                <div className="h2 fw-bold mb-1" style={{ color: '#f43f5e' }}>
                  <AnimatedCounter value={products.filter(p => p.status === 'Discontinued').length} />
                </div>
                <small style={{ color: mutedColor }}>End of life products</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card premium-card p-3 h-100 enter-anim" style={{ borderRadius: '16px' }}>
                <div className="section-header">
                  <div className="accent-bar" style={{ background: '#f59e0b' }} />
                  <h6 style={{ color: textColor }}>Archived</h6>
                </div>
                <div className="h2 fw-bold mb-1" style={{ color: '#f59e0b' }}>
                  <AnimatedCounter value={products.filter(p => p.status === 'Archived').length} />
                </div>
                <small style={{ color: mutedColor }}>Historical records</small>
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="glass-card premium-card p-3 h-100 enter-anim" style={{ borderRadius: '16px' }}>
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                  <h6 style={{ color: textColor }}>Category Distribution</h6>
                </div>
                {[...new Set(products.map(p => p.category))].map(cat => (
                  <div key={cat} className="d-flex justify-content-between align-items-center py-1">
                    <span style={{ color: textColor, fontSize: '0.8rem' }}>{cat}</span>
                    <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                      {products.filter(p => p.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass-card premium-card p-3 h-100 enter-anim" style={{ borderRadius: '16px' }}>
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #f59e0b, #f97316)' }} />
                  <h6 style={{ color: textColor }}>ABC Classification</h6>
                </div>
                {['A', 'B', 'C'].map(cls => (
                  <div key={cls} className="d-flex justify-content-between align-items-center py-1">
                    <span style={{ color: textColor, fontSize: '0.8rem' }}>Class {cls}</span>
                    <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                      {products.filter(p => p.abcClass === cls).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS */}
      {activeViewTab === 'analytics' && (
        <div className="row g-3 text-start">
          <div className="col-md-12">
            <div className="glass-card p-3" style={{ borderRadius: '16px' }}>
              <h5 className="fw-bold mb-1" style={{ color: textColor }}><FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" /> Inventory Turnover & ABC Analysis</h5>
              <p className="small mb-0" style={{ color: mutedColor }}>Identify fast/slow-moving inventory, warehouse capacity utilization, and AI replenishment schedules.</p>
            </div>
          </div>
          {products.map(p => (
            <div key={p.id} className="col-md-6">
              <div className="glass-card p-3 h-100" style={{ borderRadius: '16px' }}>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}>{p.name}</h6>
                <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-3">{p.code} &bull; ABC Class: {p.abcClass}</span>
                <div className="row g-2 text-center">
                  <div className="col-4" style={{ borderRight: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
                    <span className="fw-bold font-monospace" style={{ color: '#10b981' }}>{p.turnoverRate}x</span>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Turnover Ratio</span>
                  </div>
                  <div className="col-4" style={{ borderRight: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
                    <span className="fw-bold font-monospace" style={{ color: '#6366f1' }}>{p.profitMargin}%</span>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Profit Margin</span>
                  </div>
                  <div className="col-4">
                    <span className="fw-bold font-monospace" style={{ color: '#f59e0b' }}>{p.leadTime}</span>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Lead Delivery Time</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REPORTS */}
      {activeViewTab === 'reports' && (
        <div className="row g-3 text-start">
          {[
            { title: 'Inventory Balance Register', desc: 'Listing of all material codes, quantities on hand, and current costing valuations.' },
            { title: 'Stock Ledger (Audit Trail)', desc: 'Historical timeline of ins, outs, adjustments, and transfers per product SKU.' },
            { title: 'ABC Inventory Classification', desc: 'Sorts items into A (high value, low volume), B (medium), and C (low value, high volume) classes.' }
          ].map((rp, i) => (
            <div key={i} className="col-md-4">
              <div className="glass-card p-4 h-100 d-flex flex-column" style={{ borderRadius: '16px' }}>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}>{rp.title}</h6>
                <p className="small mb-4" style={{ color: mutedColor }}>{rp.desc}</p>
                <button className="premium-btn btn btn-sm mt-auto align-self-start" style={{ borderRadius: 8, background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', border: 'none', color: '#6366f1', fontWeight: 600, padding: '6px 16px' }} onClick={() => addNotification(`${rp.title} compiled successfully.`, 'success')}>
                  Compile Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Profile Slide-over details panel */}
      {selectedProduct && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '55%', height: '100vh',
          zIndex: 1040, padding: '28px', display: 'flex', flexDirection: 'column',
          borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderRadius: 0,
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <div style={{ width: 3, height: 24, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #8b5cf6, #ec4899)', flexShrink: 0 }} />
                <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{selectedProduct.code}</span>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: textColor }}>{selectedProduct.name}</h5>
              <p className="small mb-0" style={{ color: mutedColor }}>{selectedProduct.displayName}</p>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedProduct(null)}>
              <FontAwesomeIcon icon={faXmark} className="fs-5" />
            </button>
          </div>

          <div className="d-flex mb-3 overflow-auto pb-1 gap-1" style={{ borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', padding: '3px' }}>
            {[
              { id: 'overview', label: 'Master Overview' },
              { id: 'pricing', label: 'Pricing Master' },
              { id: 'inventory', label: 'Inventory & Stock Locations' },
              { id: 'accounting', label: 'Accounting Integration' }
            ].map(pt => (
              <button key={pt.id}
                className={`btn btn-sm fw-bold border-0 ${activeDetailTab === pt.id ? '' : 'text-muted'}`}
                style={{
                  borderRadius: 8, padding: '5px 14px', fontSize: '0.72rem',
                  background: activeDetailTab === pt.id ? (isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)') : 'transparent',
                  color: activeDetailTab === pt.id ? '#6366f1' : mutedColor,
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setActiveDetailTab(pt.id)}
              >
                {pt.label}
              </button>
            ))}
          </div>

          <div className="flex-grow-1 overflow-auto pe-2">
            {activeDetailTab === 'overview' && (
              <div className="glass-card p-4" style={{ borderRadius: '16px' }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>SKU Number</div>
                    <span className="font-monospace" style={{ color: textColor, fontWeight: 600 }}>{selectedProduct.sku}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>EAN/UPC Barcode</div>
                    <span className="font-monospace" style={{ color: textColor, fontWeight: 600 }}>{selectedProduct.barcode}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Product Type</div>
                    <span style={{ color: textColor }}>{selectedProduct.type}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Brand</div>
                    <span style={{ color: textColor }}>{selectedProduct.brand}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Country of Origin</div>
                    <span style={{ color: textColor }}>{selectedProduct.origin}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>ABC Classification</div>
                    <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>Class {selectedProduct.abcClass}</span>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'pricing' && (
              <div className="glass-card p-4" style={{ borderRadius: '16px' }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Base Purchase Cost</div>
                    <span className="font-monospace fw-bold" style={{ color: '#f43f5e', fontSize: '1.2rem' }}>${selectedProduct.purchasePrice.toLocaleString()}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Standard Selling Price</div>
                    <span className="font-monospace fw-bold" style={{ color: '#10b981', fontSize: '1.2rem' }}>${selectedProduct.sellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Profit Margin (%)</div>
                    <span className="font-monospace" style={{ color: textColor, fontWeight: 600 }}>{selectedProduct.profitMargin}%</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Costing Method</div>
                    <span style={{ color: textColor }}>{selectedProduct.costingMethod}</span>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'inventory' && (
              <div className="glass-card p-4" style={{ borderRadius: '16px' }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Assigned Warehouse</div>
                    <span style={{ color: textColor }}><FontAwesomeIcon icon={faWarehouse} className="me-1" style={{ color: mutedColor }} /> {selectedProduct.warehouse}</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Exact Bin Location</div>
                    <span style={{ color: textColor }}>{selectedProduct.binLocation || 'Unassigned'}</span>
                  </div>
                  <div className="col-12">
                    <div className="row g-3">
                      <div className="col-4">
                        <div className="glass-card p-3 text-center" style={{ borderRadius: '12px' }}>
                          <div style={{ color: mutedColor, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Current Stock</div>
                          <span className="font-monospace fw-bold" style={{ color: textColor, fontSize: '1.1rem' }}>{selectedProduct.currentStock.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="glass-card p-3 text-center" style={{ borderRadius: '12px' }}>
                          <div style={{ color: mutedColor, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Reserved Stock</div>
                          <span className="font-monospace fw-bold" style={{ color: mutedColor, fontSize: '1.1rem' }}>{selectedProduct.reservedStock.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="glass-card p-3 text-center" style={{ borderRadius: '12px' }}>
                          <div style={{ color: mutedColor, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Reorder Point</div>
                          <span className="font-monospace fw-bold" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{selectedProduct.reorderPoint.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'accounting' && (
              <div className="glass-card p-4" style={{ borderRadius: '16px' }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Inventory Asset Account</div>
                    <span className="font-monospace" style={{ color: textColor, fontWeight: 600 }}>13100 - Inventory Raw Materials</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Revenue / Sales Account</div>
                    <span className="font-monospace" style={{ color: textColor, fontWeight: 600 }}>41000 - Product Sales Revenue</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>COGS Account</div>
                    <span className="font-monospace" style={{ color: textColor, fontWeight: 600 }}>51000 - Cost of Goods Sold</span>
                  </div>
                  <div className="col-md-6">
                    <div style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Tax Ledger Group</div>
                    <span style={{ color: textColor }}>Standard GST 17%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
            <button className="premium-btn btn btn-sm px-4" style={{ borderRadius: 10, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontWeight: 600 }} onClick={() => setSelectedProduct(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Archive Product"
        message="Are you sure you want to archive this product? You can restore it later from the lifecycle column."
        itemName={deleteDialog.name}
        confirmLabel="Archive"
      />

    </ErpPageShell>
  );
};

export default ErpProducts;
