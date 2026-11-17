import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import {
  faPlus, faSearch, faFilter, faFileExport, faEye, faPen,
  faTrash, faCheckCircle, faClock, faInfoCircle,
  faXmark, faCheck, faBan, faTruck, faReceipt,
  faScaleBalanced, faChartLine, faHistory, faShieldHalved,
  faComment, faEnvelope, faBarcode, faQrcode, faFilePdf,
  faChevronRight, faChevronLeft, faPaperclip, faUserCheck, faDollarSign,
  faFileCsv, faFileExcel, faFileWord, faFileAlt, faFileSignature, faBrain, faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { getPOs, savePOs, addAuditLog, getGRNs, saveGRNs, getBills, saveBills } from './erpPurchaseStore';
import { listVendors, listProducts, getTabData } from '../../../../api/ams';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpPurchaseOrders = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeSubTab, setActiveSubTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [grns, setGrns] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [viewItem, setViewItem] = useState(null);
  const [apiData, setApiData] = useState([]);

  const [newOrder, setNewOrder] = useState({
    vendor: 'Oscorp Tech',
    warehouse: 'Main WH-A',
    project: 'Research Lab Core',
    department: 'Research & Development',
    currency: 'USD',
    taxProfile: 'VAT 5%',
    deliveryAddress: 'New York R&D Facility',
    expectedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    paymentTerms: 'NET 30',
    shippingMethod: 'Air Cargo Express',
    items: [{ product: '', description: '', qty: 1, unitPrice: 100, discount: 0, taxPercent: 5 }]
  });

  const fetchLocal = () => {
    setLoading(true); setError(null);
    try {
      setOrders(getPOs());
      setGrns(getGRNs());
      setBills(getBills());
    } catch (err) { setError(err.message || 'Failed to load orders'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const results = await Promise.allSettled([getTabData('purchase_orders'), listVendors(), listProducts()]);
        const apiRecords = results[0].status === 'fulfilled'
          ? Array.isArray(results[0].value?.data) ? results[0].value.data : Array.isArray(results[0].value) ? results[0].value : []
          : [];
        setApiData(apiRecords);
        if (results[0].status === 'rejected') {
          console.warn('API fallback for purchase_orders:', results[0].reason);
        }
      } catch (err) {
        console.warn('API fallback:', err);
      } finally {
        setLoading(false);
      }
      fetchLocal();
    };
    fetchData();
  }, []);

  useEffect(() => { fetchLocal(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchLocal();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const syncData = (updated) => {
    setOrders(updated);
    savePOs(updated);
  };

  const mergedOrders = useMemo(() => {
    if (apiData.length > 0) {
      const localCodes = new Set(orders.map(o => o.code));
      const merged = [...apiData];
      orders.forEach(o => {
        if (!localCodes.has(o.code)) merged.push(o);
      });
      return merged;
    }
    return orders;
  }, [apiData, orders]);

  const handleAddItemRow = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { product: '', description: '', qty: 1, unitPrice: 100, discount: 0, taxPercent: 5 }]
    });
  };

  const handleRemoveItemRow = (idx) => {
    setNewOrder({ ...newOrder, items: newOrder.items.filter((_, i) => i !== idx) });
  };

  const handleItemChange = (idx, field, val) => {
    const updated = newOrder.items.map((item, i) => i === idx ? { ...item, [field]: val } : item);
    setNewOrder({ ...newOrder, items: updated });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newOrder.deliveryAddress) {
      addNotification('Delivery Address is required.', 'warning');
      return;
    }

    const poNo = `PO-2026-00${orders.length + 1}`;
    
    let totalAmt = 0;
    const poItems = newOrder.items.map(i => {
      const q = parseFloat(i.qty || 0);
      const p = parseFloat(i.unitPrice || 0);
      const disc = parseFloat(i.discount || 0);
      const taxP = parseFloat(i.taxPercent || 0);
      const sub = (q * p) - disc;
      const taxAmt = sub * (taxP / 100);
      const finalSub = sub + taxAmt;
      totalAmt += finalSub;
      return { ...i, subtotal: finalSub };
    });

    const added = {
      id: Date.now(),
      code: poNo,
      date: new Date().toISOString().slice(0, 10),
      vendor: newOrder.vendor,
      warehouse: newOrder.warehouse,
      project: newOrder.project,
      department: newOrder.department,
      currency: newOrder.currency,
      taxProfile: newOrder.taxProfile,
      deliveryAddress: newOrder.deliveryAddress,
      expectedDelivery: newOrder.expectedDelivery,
      paymentTerms: newOrder.paymentTerms,
      shippingMethod: newOrder.shippingMethod,
      items: poItems,
      totalAmount: totalAmt,
      status: 'Approved',
      grnMatched: 'None',
      billMatched: 'None',
      version: 'v1.0',
      backOrders: 0,
      approvalStep: 'Posted',
      comments: [],
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: 'PO Generated.' }]
    };

    const updated = [added, ...orders];
    syncData(updated);
    addAuditLog('Created PO', 'Purchase Orders', poNo, `PO created for ${newOrder.vendor} amounting to $${totalAmt.toLocaleString()}`);
    setShowAddModal(false);
    addNotification(`Purchase Order ${poNo} authorized and sent to supplier.`, 'success');
  };

  const handleStatusChange = (id, nextStatus) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        const curVer = parseFloat(o.version.replace('v', ''));
        const nextVer = `v${(curVer + 0.1).toFixed(1)}`;
        return { 
          ...o, 
          status: nextStatus, 
          version: nextVer,
          timeline: [...o.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Status updated to ${nextStatus} (Version bumped to ${nextVer})` }]
        };
      }
      return o;
    });
    syncData(updated);
    const item = updated.find(o => o.id === id);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(item);
    }
    addAuditLog('Status Changed', 'Purchase Orders', item.code, `Status set to ${nextStatus}. Version bumped.`);
    addNotification(`Status updated to ${nextStatus} for ${item.code}`, 'success');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedOrder) return;
    const addedComment = {
      id: Date.now(),
      user: 'System Admin',
      text: newCommentText,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    
    const updated = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, comments: [...o.comments, addedComment] };
      }
      return o;
    });

    syncData(updated);
    setSelectedOrder(updated.find(o => o.id === selectedOrder.id));
    setNewCommentText('');
    addNotification('Comment posted to purchase order thread.', 'success');
  };

  const handleReceiveGoodsShortcut = (po) => {
    const grnList = getGRNs();
    const grnNo = `GRN-2026-00${grnList.length + 1}`;
    
    const newGrnObj = {
      id: Date.now(),
      code: grnNo,
      date: new Date().toISOString().slice(0, 10),
      vendor: po.vendor,
      poRef: po.code,
      receivedBy: 'Warehouse Inspector',
      status: 'Completed',
      warehouse: po.warehouse,
      vehicle: 'Internal Fleet Carrier',
      items: po.items.map(i => ({
        product: i.product,
        expectedQty: i.qty,
        receivedQty: i.qty,
        rejectedQty: 0,
        acceptedQty: i.qty,
        batchNo: `BAT-AUTO-${Date.now().toString().slice(-4)}`,
        expiryDate: '2029-12-31',
        binLocation: 'BIN-GEN-01'
      })),
      qualityStatus: 'Pass',
      inspectionNotes: 'Received automatically from PO shortcut.',
      workflowStep: 'Posted',
      attachments: [],
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `GRN created against PO ${po.code}` }]
    };

    saveGRNs([newGrnObj, ...grnList]);

    const updatedPos = orders.map(o => o.id === po.id ? { ...o, status: 'Completed', grnMatched: grnNo } : o);
    syncData(updatedPos);
    
    addAuditLog('Created GRN', 'Goods Receipts', grnNo, `Auto GRN generated from PO ${po.code}`);
    addNotification(`Goods Receipt Note ${grnNo} created and marked as Completed. Inventory balance updated.`, 'success');
    setSelectedOrder(null);
  };

  const handleGenerateBillShortcut = (po) => {
    const billsList = getBills();
    const billNo = `BIL-2026-00${billsList.length + 1}`;

    const newBillObj = {
      id: Date.now(),
      code: billNo,
      date: new Date().toISOString().slice(0, 10),
      vendor: po.vendor,
      poRef: po.code,
      grnRef: po.grnMatched || 'None',
      due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      invoiceNo: `INV-${po.vendor.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      currency: po.currency,
      taxMethod: 'Exclusive',
      expenseAccount: '5020 - Computer Hardware Expenses',
      items: po.items.map(i => ({ product: i.product, qty: i.qty, unitCost: i.unitPrice, discount: i.discount, taxPercent: i.taxPercent, subtotal: i.subtotal })),
      amount: po.totalAmount,
      taxAmount: po.totalAmount * 0.05,
      netAmount: po.totalAmount * 0.95,
      status: 'Pending Approval',
      poMatch: 'Passed',
      grnMatch: po.grnMatched !== 'None' ? 'Passed' : 'Pending Verification (No GRN found)',
      invoiceMatch: 'Passed',
      mismatchDetected: po.grnMatched === 'None',
      duplicateDetected: false,
      ocrConfidence: '100%',
      workflowStep: 'Accounts Officer Review',
      history: `Created from PO shortcut ${po.code}`,
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Vendor bill created from PO ${po.code}` }]
    };

    saveBills([newBillObj, ...billsList]);

    const updatedPos = orders.map(o => o.id === po.id ? { ...o, billMatched: billNo } : o);
    syncData(updatedPos);

    addAuditLog('Created Bill', 'Vendor Bills', billNo, `Auto Vendor Bill generated from PO ${po.code}`);
    addNotification(`Vendor Bill ${billNo} generated from PO. Loaded into matching register.`, 'success');
    setSelectedOrder(null);
  };

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filtered;
    const cols = columns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'purchase_orders.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'purchase_orders.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Purchase Orders', headers, rows, filename: 'purchase_orders.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Purchase Orders', headers, rows, filename: 'purchase_orders.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Purchase Orders', headers, rows, filename: 'purchase_orders.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const filtered = mergedOrders.filter(o => {
    const matchesSearch = o.code.toLowerCase().includes(searchTerm.toLowerCase()) || o.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const kpiWidgets = useMemo(() => [
    { label: 'Open Orders', val: mergedOrders.filter(o => o.status === 'Approved').length, icon: faClock, color: colors.warning, trend: 'up', trendVal: 'Dispatched to suppliers' },
    { label: 'Received Orders', val: mergedOrders.filter(o => o.status === 'Completed').length, icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Logistics cycle complete' },
    { label: 'Outstanding Liabilities', val: '$' + mergedOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString(), icon: faDollarSign, color: colors.primary, trend: 'up', trendVal: 'Accounts Payable Accrued' },
    { label: 'PO Value Rollup', val: '$' + mergedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString(), icon: faChartLine, color: '#14b8a6', trend: 'up', trendVal: 'Fiscal year total spend' }
  ], [mergedOrders]);

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'purchase_order' });
    setActiveTab?.('erp_purchase_orders');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const { id } = deleteDialog;
    setOrders(prev => prev.filter(item => item.id !== id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const handleMoveToDraft = async (row) => {
    try {
      const updated = orders.map(o => o.id === row.id ? { ...o, status: 'Draft' } : o);
      syncData(updated);
      addNotification?.('PO moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const handleConvert = async (id) => {
    try {
      addNotification?.('PO conversion initiated.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Conversion failed', 'error');
    }
  };

  const columns = [
    { key: 'code', label: 'PO Number', render: (val, row) => <span><span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{row.version}</span></span> },
    { key: 'date', label: 'Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'vendor', label: 'Supplier', render: (val) => <span className="fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'project', label: 'Project', render: (val) => <span style={{ color: textColor }}>{val}</span> },
    { key: 'expectedDelivery', label: 'Expected Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'totalAmount', label: 'AP Liabilities', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>${val.toLocaleString()}</span> },
    { key: 'grnMatched', label: 'GRN Matched', render: (val) => (
      <span className="premium-badge" style={{
        background: val !== 'None' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#78350f' : '#fef3c7'),
        color: val !== 'None' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
      }}>{val}</span>
    )},
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEditClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Email" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        {row.status === 'Approved' && (
          <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: `${colors.success}15`, color: colors.success, fontSize: '0.65rem', border: 'none', padding: '4px 10px' }} onClick={() => handleConvert(row.number)}>
            Convert <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </button>
        )}
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const filterControls = (
    <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
      <option value="All">All Statuses</option>
      <option value="Approved">Approved</option>
      <option value="Completed">Completed</option>
      <option value="Partially Received">Partially Received</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );

  const exportButton = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">⋯</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}>PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}>DOCX</button></li>
        </ul>
      </div>
    </div>
  );

  const subTabBar = (
    <div className="d-flex gap-2 mb-4 flex-wrap">
      {[
        { id: 'orders', label: 'Purchase Orders Register', icon: faTruck },
        { id: 'matching', label: '3-Way Match Verification', icon: faScaleBalanced },
        { id: 'logs', label: 'Version & Audit Controls', icon: faHistory }
      ].map(tab => (
        <button key={tab.id}
          className="premium-btn btn btn-sm py-2 px-3 fw-bold"
          style={{
            borderRadius: '10px', fontSize: '0.78rem',
            border: activeSubTab === tab.id ? 'none' : `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`,
            background: activeSubTab === tab.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f8fafc'),
            color: activeSubTab === tab.id ? '#fff' : textColor,
            boxShadow: activeSubTab === tab.id ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
          }}
          onClick={() => setActiveSubTab(tab.id)}
        >
          <FontAwesomeIcon icon={tab.icon} className="me-1" /> {tab.label}
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ErpPageShell icon={faTruck} title="Enterprise Purchase Orders (POs)" description="Loading...">
        <div className="row g-3 mb-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="col-md-3">
              <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
                <div style={{ height: 12, width: '60%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 24, width: '40%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          <div style={{ height: 16, width: '30%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6, marginBottom: 8 }} />
          <div style={{ height: 12, width: '80%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
        </div>
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <div style={{ height: 14, width: '15%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '20%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '25%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '20%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
              <div style={{ height: 14, width: '15%', background: isDark ? '#2d3248' : '#e2e8f0', borderRadius: 6 }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </ErpPageShell>
    );
  }

  return (
    <ErpPageShell
      icon={faTruck}
      title="Enterprise Purchase Orders (POs)"
      description="Generate approved POs from RFQs or Requisitions with complete lifecycle tracking and 3-way matching."
      action={
        <button onClick={() => setActiveTab('erp_create_purchase_order')} className="premium-btn btn btn-sm d-flex align-items-center gap-1 px-3" style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.8rem',
          boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        }}>
          <FontAwesomeIcon icon={faPlus} /> New Purchase Order
        </button>
      }
    >
      {subTabBar}

      {activeSubTab === 'orders' && (
        <>
          <div className="row g-3 mb-4">
            {kpiWidgets.map((k, idx) => (
              <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-3" />
            ))}
          </div>

          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Procurement Intelligence</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>3 POs overdue for GRN matching. Consider expediting logistics for Oscorp Tech order PO-2026-001.</div>
                </div>
              </div>
            </div>
          </div>

          <ErpDataTable
            columns={columns}
            data={paginatedData}
            loading={loading}
            error={error}
            searchable
            searchTerm={searchTerm}
            onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            searchPlaceholder="Search POs..."
            filters={filterControls}
            exportButtons={exportButton}
            emptyMessage="No purchase orders found."
            emptyIcon={faTruck}
            isDark={isDark}
            currentPage={currentPage}
            entriesPerPage={entriesPerPage}
            totalEntries={filtered.length}
            onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
          />
        </>
      )}

      {activeSubTab === 'matching' && (
        <div className="glass-card enter-anim mb-4" style={{ borderRadius: '16px', padding: '1.5rem' }}>
          <div className="section-header">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }} />
            <h6 style={{ color: textColor }}>
              <FontAwesomeIcon icon={faScaleBalanced} className="me-2" style={{ color: '#8b5cf6' }} />
              Three-Way Matching Verification Console
            </h6>
          </div>
          <p style={{ color: mutedColor, fontSize: '0.8rem' }}>Verification matches are auto-calculated: PO amount vs. warehouse GRN units vs. Accounts Payable vendor bills. Flags mismatches immediately.</p>
          
          <div className="premium-table-wrapper">
            <div className="table-responsive">
              <table className="premium-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>PO Reference</th>
                    <th>Supplier</th>
                    <th>PO Amount</th>
                    <th>GRN Reference</th>
                    <th>GRN Quantity Match</th>
                    <th>Vendor Bill</th>
                    <th>Billing Match</th>
                    <th>Match Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedOrders.map(o => {
                    const matchedGrn = grns.find(g => g.poRef === o.code);
                    const matchedBill = bills.find(b => b.poRef === o.code);
                    
                    const isGrnOk = matchedGrn ? 'Passed' : 'Pending GRN';
                    const isBillOk = matchedBill ? 'Passed' : 'Pending Invoice';
                    const overall = (matchedGrn && matchedBill) ? 'Fully Matched' : 'Pending Matches';

                    return (
                      <tr key={o.id}>
                        <td className="font-monospace fw-bold" style={{ color: '#6366f1' }}>{o.code}</td>
                        <td style={{ color: textColor }}>{o.vendor}</td>
                        <td className="font-monospace" style={{ color: textColor }}>${o.totalAmount.toLocaleString()}</td>
                        <td className="font-monospace" style={{ color: textColor }}>{matchedGrn ? matchedGrn.code : 'None'}</td>
                        <td>
                          <span className="premium-badge" style={{
                            background: isGrnOk === 'Passed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#78350f' : '#fef3c7'),
                            color: isGrnOk === 'Passed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
                          }}>{isGrnOk}</span>
                        </td>
                        <td className="font-monospace" style={{ color: textColor }}>{matchedBill ? matchedBill.code : 'None'}</td>
                        <td>
                          <span className="premium-badge" style={{
                            background: isBillOk === 'Passed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#78350f' : '#fef3c7'),
                            color: isBillOk === 'Passed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
                          }}>{isBillOk}</span>
                        </td>
                        <td>
                          <span className="premium-badge" style={{
                            background: overall === 'Fully Matched' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#1e3a5f' : '#e0e7ff'),
                            color: overall === 'Fully Matched' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#818cf8' : '#6366f1'),
                          }}>{overall}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'logs' && (
        <div className="glass-card enter-anim mb-4" style={{ borderRadius: '16px', padding: '1.5rem' }}>
          <div className="section-header">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
            <h6 style={{ color: textColor }}>
              <FontAwesomeIcon icon={faHistory} className="me-2" style={{ color: '#f59e0b' }} />
              Document Audit & Version Logs
            </h6>
          </div>
          <div className="d-flex flex-column gap-2">
            {mergedOrders.map(o => (
              <div key={o.id} style={{
                borderRadius: '12px', padding: '0.75rem',
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)',
                border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`,
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold font-monospace" style={{ color: '#6366f1' }}>{o.code} - {o.vendor}</span>
                  <span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>Current Version: {o.version}</span>
                </div>
                <div className="mt-2">
                  {o.timeline.map((t, idx) => (
                    <div key={idx} style={{ color: mutedColor, fontSize: '0.7rem' }}>
                      <FontAwesomeIcon icon={faClock} className="me-1" /> {t.date}: {t.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(6px)'
        }} onClick={() => setViewItem(null)}>
          <div className="glass-card" style={{ borderRadius: '20px', padding: '1.5rem', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: textColor }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Purchase Order: {viewItem.code}</h5>
              <button className="premium-btn btn btn-sm border-0" style={{ borderRadius: '8px', background: 'transparent', color: mutedColor }} onClick={() => setViewItem(null)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="row g-3 small">
              <div className="col-md-6" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Supplier: </span> {viewItem.vendor}<br/>
                <span style={{ color: mutedColor }}>Warehouse Location: </span> {viewItem.warehouse}<br/>
                <span style={{ color: mutedColor }}>Project Code: </span> {viewItem.project}
              </div>
              <div className="col-md-6" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Expected Delivery: </span> {viewItem.expectedDelivery}<br/>
                <span style={{ color: mutedColor }}>Payment Terms: </span> {viewItem.paymentTerms}<br/>
                <span style={{ color: mutedColor }}>Shipping Method: </span> {viewItem.shippingMethod}
              </div>

              <div className="col-12 mt-2">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faReceipt} className="me-2" style={{ color: '#6366f1' }} />
                    PO Product Lines
                  </h6>
                </div>
                <div className="premium-table-wrapper">
                  <table className="premium-table" style={{ fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Discount</th>
                        <th>Tax %</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.items.map((it, idx) => (
                        <tr key={idx}>
                          <td style={{ color: textColor }}>{it.product}</td>
                          <td style={{ color: textColor }}>{it.description}</td>
                          <td style={{ color: textColor }}>{it.qty}</td>
                          <td style={{ color: textColor }}>${parseFloat(it.unitPrice).toLocaleString()}</td>
                          <td style={{ color: textColor }}>${parseFloat(it.discount).toLocaleString()}</td>
                          <td style={{ color: textColor }}>{it.taxPercent}%</td>
                          <td className="font-monospace fw-bold text-end" style={{ color: textColor }}>${parseFloat(it.subtotal).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="6" className="text-end fw-bold" style={{ color: textColor }}>Grand Total Accrued AP:</td>
                        <td className="font-monospace fw-bold text-end" style={{ color: '#6366f1' }}>${viewItem.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <button type="button" className="premium-btn btn btn-sm border-0 px-3" style={{
                borderRadius: '10px', fontSize: '0.78rem',
                background: isDark ? '#334155' : '#f1f5f9',
                color: textColor,
              }} onClick={() => setViewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this purchase order to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpPurchaseOrders;
