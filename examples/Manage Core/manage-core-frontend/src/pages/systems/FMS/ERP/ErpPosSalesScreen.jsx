import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faUser, faShoppingCart, faBarcode, faPlusCircle, faMinusCircle,
  faTrash, faPrint, faCheckCircle, faTag, faCreditCard, faMoneyBillWave,
  faWallet, faBuildingColumns, faUserPlus, faRefresh, faCalculator, faClock,
  faBan, faList, faQrcode, faXmark, faCashRegister,
  faFileExport, faFileCsv, faFileExcel, faFileWord, faFileAlt,
  faBrain, faTrashCan, faEdit, faFileSignature, faArrowUp, faArrowDown,
  faEye, faFilePdf, faEnvelope, faMessage, faMoneyBill, faReceipt, faHashtag, faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { fetchPosProducts } from '../../../../utils/posProducts';
import { checkoutPosSale, listPosOrders, listPosSessions, listPosTerminals, holdPosCart } from '../../../../api/pos';

const SEED_SALES = [
  { id: 1, invoiceNo: 'INV-POS-482103', date: '2026-07-29', time: '09:15 AM', customer: 'Walk-in Customer', items: 3, itemNames: 'Aluminum Tube x2, Gasket Sealant x1', total: 62, method: 'Cash', status: 'Completed' },
  { id: 2, invoiceNo: 'INV-POS-482104', date: '2026-07-29', time: '10:42 AM', customer: 'John Carter (VIP)', items: 5, itemNames: 'MCU Chip x3, Barcode Scanner x2', total: 385, method: 'Card', status: 'Completed' },
  { id: 3, invoiceNo: 'INV-POS-482105', date: '2026-07-29', time: '11:30 AM', customer: 'Sarah Connor', items: 2, itemNames: 'Caster Wheels x1, Silicone Sealant x1', total: 70.66, method: 'Mobile Wallet', status: 'Completed' },
  { id: 4, invoiceNo: 'INV-POS-482106', date: '2026-07-28', time: '02:10 PM', customer: 'Walk-in Customer', items: 1, itemNames: 'Wireless Barcode Scanner x1', total: 111.15, method: 'Card', status: 'Completed' },
  { id: 5, invoiceNo: 'INV-POS-482107', date: '2026-07-28', time: '04:55 PM', customer: 'John Carter (VIP)', items: 8, itemNames: 'MCU Chip x5, Caster Wheels x3', total: 502.18, method: 'Bank Transfer', status: 'Completed' },
  { id: 6, invoiceNo: 'INV-POS-482108', date: '2026-07-27', time: '01:20 PM', customer: 'Walk-in Customer', items: 2, itemNames: 'Aluminum Tube x2', total: 58.50, method: 'Cash', status: 'Completed' },
];

const LoadingSkeleton = ({ isDark }) => {
  const bg = isDark ? '#1e293b' : '#f1f5f9';
  const shimmer = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="rounded-4 p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #2563EB 100%)' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '120px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '350px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '500px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="col-xl-2 col-lg-4 col-md-4 col-6">
              <div className="p-3 rounded-4" style={{ background: shimmer, minHeight: '90px' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '60%', height: '12px', background: bg }} />
                <div className="skeleton-box rounded" style={{ width: '40%', height: '28px', background: bg }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ErpPosSalesScreen = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#374151' : '#E5E7EB';

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer');
  const [amountPaid, setAmountPaid] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState(null);

  const [salesHistory, setSalesHistory] = useState(SEED_SALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [products, setProducts] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terminalId, setTerminalId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [catalog, terminalResponse, sessionResponse, orderResponse] = await Promise.all([
          fetchPosProducts(),
          listPosTerminals(),
          listPosSessions({ per_page: 100 }),
          listPosOrders({ per_page: 100 }),
        ]);
        setProducts(catalog);
        const terminalRows = terminalResponse?.data || [];
        const sessionRows = sessionResponse?.data || [];
        setTerminals(terminalRows);
        setSessions(sessionRows);
        const orderRows = orderResponse?.data || [];
        setSalesHistory(orderRows.map((order) => ({
            id: order.id,
            invoiceNo: order.transaction_id,
            date: new Date(order.created_at).toLocaleDateString(),
            time: new Date(order.created_at).toLocaleTimeString(),
            customer: order.customer_id ? `Customer #${order.customer_id}` : 'Walk-in Customer',
            items: Number(order.item_count || 0),
            itemNames: '',
            total: Number(order.total || 0),
            method: order.payment_method || 'Multiple',
            status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Draft',
          })));
        const activeSession = sessionRows.find((item) => ['open', 'suspended'].includes(item.status));
        setTerminalId(String(activeSession?.terminal_id || terminalRows[0]?.id || ''));
        setSessionId(String(activeSession?.status === 'open' ? activeSession.id : ''));
      } catch (err) {
        setError(err.message || 'Unable to load POS terminal data');
        addNotification?.(err.message || 'Unable to load POS terminal data', 'error');
      }
    })();
  }, [addNotification]);

  useEffect(() => {
    const onRefresh = () => {};
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  useEffect(() => {
    if (recentReceipt) {
      const newSale = {
        id: Date.now(),
        invoiceNo: recentReceipt.invoiceNo,
        date: recentReceipt.date,
        time: recentReceipt.time,
        customer: recentReceipt.customer,
        items: recentReceipt.items.length,
        itemNames: recentReceipt.items.map(i => `${i.product.name} x${i.qty}`).join(', '),
        total: recentReceipt.total,
        method: recentReceipt.paymentMethod,
        status: 'Completed',
      };
      setSalesHistory(prev => [newSale, ...prev]);
    }
  }, [recentReceipt]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      addNotification('Material is out of stock in this branch.', 'warning');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          addNotification('Cannot add more than available warehouse stock.', 'warning');
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1, discount: 0 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const nextQty = item.qty + delta;
        if (nextQty <= 0) return null;
        if (nextQty > item.product.stock) {
          addNotification('Cannot exceed store stock limits.', 'warning');
          return item;
        }
        return { ...item, qty: nextQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const calculateSubtotal = () => cart.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0);
  const calculateTax = () => calculateSubtotal() * 0.17;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleCheckout = async (method) => {
    const total = calculateTotal();
    if (cart.length === 0) {
      addNotification('Your shopping cart is empty.', 'danger');
      return;
    }
    const paidVal = parseFloat(amountPaid || total);
    if (paidVal < total) {
      addNotification('Insufficient cash tendered.', 'danger');
      return;
    }
    if (!terminalId || !sessionId) {
      addNotification('Open and select a POS terminal session before checkout.', 'warning');
      return;
    }

    try {
      setCheckoutLoading(true);
      const response = await checkoutPosSale({
        terminal_id: Number(terminalId),
        session_id: Number(sessionId),
        source: 'online',
        idempotency_key: `pos-checkout-${crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`}`,
        items: cart.map((item) => ({
          catalog_product_id: Number(item.product.id),
          name: item.product.name,
          sku: item.product.sku,
          barcode: item.product.barcode || null,
          quantity: item.qty,
          discount_amount: Number(item.discount || 0),
        })),
        payments: [{ method: method.toLowerCase().replace('mobile wallet', 'wallet').replace('bank transfer', 'bank'), amount: paidVal }],
      });
      const order = response?.data || response;
      const receipt = {
        invoiceNo: order.transaction_id,
        date: new Date(order.created_at || Date.now()).toLocaleDateString(),
        time: new Date(order.created_at || Date.now()).toLocaleTimeString(),
        customer: selectedCustomer,
        items: cart,
        subtotal: Number(order.subtotal ?? calculateSubtotal()),
        tax: Number(order.tax_total ?? calculateTax()),
        total: Number(order.total ?? total),
        paid: paidVal,
        change: Number(order.change_amount ?? paidVal - total),
        paymentMethod: method,
      };
      setRecentReceipt(receipt);
      setShowReceiptModal(true);
      setCart([]);
      setAmountPaid('');
      addNotification('Sale completed and receipt generated.', 'success');
    } catch (err) {
      addNotification(err.message || 'Checkout failed. The sale was not completed.', 'danger');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleHoldCart = async () => {
    if (!cart.length || !sessionId) {
      addNotification('Select an open session and add items before holding the cart.', 'warning');
      return;
    }
    try {
      await holdPosCart({
        session_id: Number(sessionId),
        items: cart.map((item) => ({ catalog_product_id: item.product.id, name: item.product.name, quantity: item.qty, unit_price: item.product.price })),
        notes: 'Held from POS sales terminal',
      });
      setCart([]);
      addNotification('Cart held successfully.', 'success');
    } catch (err) {
      addNotification(err.message || 'Unable to hold cart.', 'danger');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const kpiWidgets = useMemo(() => {
    const totalSales = salesHistory.reduce((acc, s) => acc + s.total, 0);
    const today = new Date().toLocaleDateString();
    const todaySales = salesHistory.filter(s => s.date === today);
    const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
    const totalItems = salesHistory.reduce((acc, s) => acc + s.items, 0);
    const avgTransaction = salesHistory.length > 0 ? totalSales / salesHistory.length : 0;
    const completionRate = salesHistory.length > 0 ? (salesHistory.filter(s => s.status === 'Completed').length / salesHistory.length * 100) : 0;

    return [
      { label: 'Total Sales', val: salesHistory.length, icon: faReceipt, color: colors.primary, trend: 'up', trendVal: `${salesHistory.length} Records` },
      { label: "Today's Revenue", val: todayRevenue, icon: faMoneyBill, color: colors.success, trend: 'up', trendVal: '$' + todayRevenue.toFixed(0) },
      { label: 'Items Sold', val: totalItems, icon: faShoppingCart, color: colors.info, trend: 'up', trendVal: `${totalItems} Units` },
      { label: 'Avg Transaction', val: avgTransaction, icon: faChartLine, color: colors.purple, trend: 'up', trendVal: '$' + avgTransaction.toFixed(0) },
      { label: 'Completion Rate', val: Math.round(completionRate), icon: faCheckCircle, color: colors.warning, trend: 'up', trendVal: `${completionRate.toFixed(0)}%` },
    ];
  }, [salesHistory]);

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    const cols = historyColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = filteredSales.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (format === 'csv') { downloadBlob(csv, 'pos_sales_history.csv', 'text/csv'); addNotification('CSV exported successfully.', 'success'); }
    else if (format === 'xlsx') { downloadBlob(csv, 'pos_sales_history.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); addNotification('XLSX exported successfully.', 'success'); }
    else if (format === 'docx') { await exportDocx({ headers, rows, title: 'POS Sales History' }); addNotification('DOCX exported successfully.', 'success'); }
    else if (format === 'pdf') { await exportPdf({ headers, rows, title: 'POS Sales History' }); addNotification('PDF exported successfully.', 'success'); }
    else if (format === 'word') { await exportWord({ headers, rows, title: 'POS Sales History' }); addNotification('Word exported successfully.', 'success'); }
  };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.invoiceNo || '' });

  const handleDeleteConfirm = () => {
    setSalesHistory(prev => prev.filter(s => s.id !== deleteDialog.id));
    addNotification('Sale moved to trash.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'pos_sale' });
    addNotification?.(`Editing ${row.invoiceNo}`, 'info');
  };

  const handleMoveToDraft = (row) => {
    setSalesHistory(prev => prev.map(s => s.id === row.id ? { ...s, status: 'Draft' } : s));
    addNotification?.(`Sale ${row.invoiceNo} moved to Draft.`, 'success');
  };

  const filteredSales = useMemo(() => {
    if (!historySearch) return salesHistory;
    const term = historySearch.toLowerCase();
    return salesHistory.filter(s =>
      s.invoiceNo.toLowerCase().includes(term) ||
      s.customer.toLowerCase().includes(term) ||
      s.method.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  }, [salesHistory, historySearch]);

  const totalPages = Math.ceil(filteredSales.length / entriesPerPage);
  const paginatedSales = filteredSales.slice((historyPage - 1) * entriesPerPage, historyPage * entriesPerPage);

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const statusBadge = (status) => {
    const map = {
      Completed: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Pending: { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
      Cancelled: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    };
    const m = map[status] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: mutedColor };
    return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, background: m.bg, color: m.color };
  };

  const historyColumns = [
    { key: 'invoiceNo', label: 'Invoice No', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary, cursor: 'pointer' }}>{val}</span> },
    { key: 'date', label: 'Date', render: (val, row) => <div><span style={{ color: textColor }}>{val}</span><br /><span style={{ color: mutedColor, fontSize: '0.65rem' }}>{row.time}</span></div> },
    { key: 'customer', label: 'Customer' },
    { key: 'items', label: 'Items', align: 'center', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
    { key: 'total', label: 'Total', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>${val.toFixed(2)}</span> },
    { key: 'method', label: 'Method', render: (val) => (
      <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{ fontSize: '0.65rem', borderRadius: '20px', background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>
        <FontAwesomeIcon icon={val === 'Cash' ? faMoneyBillWave : val === 'Card' ? faCreditCard : val === 'Mobile Wallet' ? faWallet : faBuildingColumns} style={{ fontSize: '0.55rem' }} /> {val}
      </span>
    )},
    { key: 'status', label: 'Status', render: (val) => (
      <span style={statusBadge(val)}>
        <span className="badge-dot" style={{ background: statusBadge(val).color, width: 6, height: 6, borderRadius: '50%' }} />
        {val}
      </span>
    )},
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end align-items-center">
        <button className="btn btn-sm border-0" title="View" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => setViewItem(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0" title="Edit" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0" title="Move to Draft" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm border-0" title="PDF" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => handleExport('pdf')}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0" title="Email" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-sm border-0" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faCashRegister}
      title="Point of Sale (POS) Sales Terminal"
      description="Fast retail sales checkout integrated with real-time stock balances and general ledger posting."
      action={
        <div className="d-flex gap-1.5 flex-wrap">
          <button className="btn btn-xs btn-outline-secondary" onClick={() => { setCart([]); setSelectedCustomer('Walk-in Customer'); }}><FontAwesomeIcon icon={faBan} className="me-1" /> Void Sale</button>
          <button className="btn btn-xs btn-outline-secondary" onClick={() => addNotification('Drawer opened.', 'info')}>Open Drawer</button>
          <button className="btn btn-xs btn-light border" onClick={() => addNotification('Store cache synced.', 'success')}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>
      }
    >

      <div className="row g-3">
        <div className="col-md-7">
          <div className="card p-3 border h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#ffffff', borderColor, borderRadius: '12px' }}>
            <div className="d-flex gap-2 mb-3 align-items-center">
              <div className="input-group input-group-sm flex-grow-1">
                <span className="input-group-text bg-transparent border-end-0 text-muted"><FontAwesomeIcon icon={faSearch} /></span>
                <input type="text" className="form-control border-start-0 border" style={{ borderColor }} placeholder="Scan barcode or type item SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <span className="btn btn-sm btn-light border"><FontAwesomeIcon icon={faBarcode} /></span>
            </div>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label extra-small text-muted fw-bold mb-1">Terminal</label>
                <select className="form-select form-select-sm" value={terminalId} onChange={(event) => {
                  setTerminalId(event.target.value);
                  const session = sessions.find((item) => String(item.terminal_id) === event.target.value && item.status === 'open');
                  setSessionId(String(session?.id || ''));
                }}>
                  <option value="">Select terminal</option>
                  {terminals.map((terminal) => <option key={terminal.id} value={terminal.id}>{terminal.code || terminal.name}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label extra-small text-muted fw-bold mb-1">Open Session</label>
                <select className="form-select form-select-sm" value={sessionId} onChange={(event) => setSessionId(event.target.value)}>
                  <option value="">Select open session</option>
                  {sessions.filter((item) => String(item.terminal_id) === String(terminalId) && item.status === 'open')
                    .map((session) => <option key={session.id} value={session.id}>{session.session_number}</option>)}
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 overflow-auto pb-2.5 mb-3 small">
              {['All', ...[...new Set(products.map(p => p.category).filter(Boolean))]].map(cat => (
                <button
                  key={cat}
                  className={`btn btn-xs px-3 rounded-pill border-0 ${activeCategory === cat ? 'btn-primary text-white' : 'btn-light border'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="row g-2 overflow-auto" style={{ maxHeight: '420px' }}>
              {filteredProducts.map(p => {
                const isLow = p.stock <= 10;
  if (loading) return <LoadingSkeleton isDark={isDark} />;

  return (
                  <div key={p.id} className="col-md-4">
                    <div className="p-2.5 border rounded-3 text-start h-100 d-flex flex-column justify-content-between" style={{ borderColor, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
                      <div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="extra-small font-monospace text-muted">{p.sku}</span>
                          {isLow && <span className="badge bg-danger bg-opacity-10 text-danger extra-small py-0 px-1">Low</span>}
                        </div>
                        <h6 className="fw-bold small mb-1 lh-base" style={{ height: '36px', overflow: 'hidden', color: isDark ? '#F3F4F6' : '#111827' }}>{p.name}</h6>
                        <span className="text-muted extra-small d-block mb-2">{p.category}</span>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor }}>
                          <span className="fw-bold text-primary font-monospace">${p.price}</span>
                          <button className="btn btn-xs btn-primary text-white py-0.5 px-2" onClick={() => addToCart(p)}>Add</button>
                        </div>
                        <span className="extra-small text-muted d-block text-end mt-1">{p.stock} in stock</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-3 border h-100 d-flex flex-column" style={{ backgroundColor: isDark ? '#1F2937' : '#ffffff', borderColor, borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor }}>
              <select className="form-select form-select-sm border flex-grow-1 me-2" style={{ borderColor }} value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                <option value="Walk-in Customer">Walk-in Customer</option>
                <option value="John Carter (VIP)">John Carter (VIP) - Credits: 450</option>
                <option value="Sarah Connor">Sarah Connor</option>
              </select>
              <button className="btn btn-xs btn-outline-secondary" onClick={() => addNotification('Add customer drawer.', 'info')}><FontAwesomeIcon icon={faUserPlus} /></button>
            </div>

            <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '250px' }}>
              {cart.map(item => (
                <div key={item.product.id} className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom" style={{ borderColor }}>
                  <div style={{ maxWidth: '60%' }}>
                    <span className="fw-bold small d-block text-truncate" style={{ color: isDark ? '#F3F4F6' : '#111827' }}>{item.product.name}</span>
                    <span className="extra-small text-muted font-monospace">${item.product.price} / unit</span>
                  </div>
                  <div className="d-flex align-items-center gap-1.5">
                    <button className="btn btn-xs p-0 text-muted" onClick={() => updateQty(item.product.id, -1)}><FontAwesomeIcon icon={faMinusCircle} /></button>
                    <span className="font-monospace fw-bold small" style={{ color: isDark ? '#F3F4F6' : '#111827' }}>{item.qty}</span>
                    <button className="btn btn-xs p-0 text-muted" onClick={() => updateQty(item.product.id, 1)}><FontAwesomeIcon icon={faPlusCircle} /></button>
                    <button className="btn btn-xs p-0 text-danger ms-2" onClick={() => removeFromCart(item.product.id)}><FontAwesomeIcon icon={faTrash} style={{ fontSize: 10 }} /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-4 text-muted small">No items added to check.</div>
              )}
            </div>

            <div className="mt-auto border-top pt-2" style={{ borderColor }}>
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-muted">Subtotal:</span>
                <span className="font-monospace">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">VAT (17%):</span>
                <span className="font-monospace">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top" style={{ borderColor }}>
                <span className="fw-bold" style={{ color: isDark ? '#F3F4F6' : '#111827' }}>Grand Total:</span>
                <span className="h4 font-monospace fw-bold text-success mb-0">${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="mb-3">
                <label className="form-label extra-small text-muted fw-bold mb-1">Amount Tendered / Cash Received ($)</label>
                <input type="number" className="form-control form-control-sm text-end font-monospace" placeholder={`$${calculateTotal().toFixed(2)}`} value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
              </div>

              <div className="row g-1">
                <div className="col-12 mb-1">
                  <button className="btn btn-sm btn-outline-warning w-100" onClick={handleHoldCart} disabled={checkoutLoading}>
                    <FontAwesomeIcon icon={faClock} className="me-1" /> Hold Cart
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-sm btn-success text-white w-100 fw-bold py-2" onClick={() => handleCheckout('Cash')} disabled={checkoutLoading}>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="me-1" /> Cash Checkout
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-sm btn-primary text-white w-100 fw-bold py-2" onClick={() => handleCheckout('Card')} disabled={checkoutLoading}>
                    <FontAwesomeIcon icon={faCreditCard} className="me-1" /> Card Swiped
                  </button>
                </div>
                <div className="col-6 mt-1">
                  <button className="btn btn-sm btn-outline-secondary w-100 py-1.5" onClick={() => handleCheckout('Mobile Wallet')} disabled={checkoutLoading}>
                    <FontAwesomeIcon icon={faWallet} className="me-1" /> Wallet App
                  </button>
                </div>
                <div className="col-6 mt-1">
                  <button className="btn btn-sm btn-outline-secondary w-100 py-1.5" onClick={() => handleCheckout('Bank Transfer')} disabled={checkoutLoading}>
                    <FontAwesomeIcon icon={faBuildingColumns} className="me-1" /> Bank App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="row g-3 mt-3">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} trend={w.trend} trendVal={w.trendVal} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        ))}
      </div>

      {/* ===== AI RECOMMENDATION BANNER ===== */}
      <div className="glass-card mt-3" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Sales Insight</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Based on recent POS patterns, VIP customers are generating 3x higher average order values. Consider activating loyalty tier rewards to boost repeat visits during off-peak hours (2PM-5PM).</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SALES HISTORY DATATABLE ===== */}
      <div className="mt-4">
        <ErpDataTable
          columns={historyColumns}
          data={paginatedSales}
          loading={loading}
          error={error}
          searchable
          searchTerm={historySearch}
          onSearchChange={(val) => { setHistorySearch(val); setHistoryPage(1); }}
          searchPlaceholder="Search by invoice, customer, method..."
          emptyMessage="No sales records found."
          emptyIcon={faReceipt}
          isDark={isDark}
          title="Sales Transaction History"
          titleIcon={faReceipt}
          exportButtons={exportButtons}
          currentPage={historyPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          totalEntries={filteredSales.length}
          onPageChange={setHistoryPage}
          onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setHistoryPage(1); }}
        />
      </div>

      {/* ===== RECEIPT MODAL ===== */}
      {showReceiptModal && recentReceipt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 15,
          backdropFilter: 'blur(2px)'
        }}>
          <div className="bg-white text-dark rounded-4 p-4 shadow-lg w-100 text-center" style={{ maxWidth: '380px' }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <span className="fw-bold small text-muted">POS Invoice Receipt</span>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowReceiptModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className="font-monospace text-start small border p-3 bg-light rounded" style={{ fontSize: '12px' }}>
              <div className="text-center mb-3">
                <h6 className="fw-bold mb-0">ERM ENTERPRISE RETAIL</h6>
                <span className="extra-small text-muted">Aisle 4, Central Plaza, Illinois</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Receipt:</span>
                <span className="fw-bold">{recentReceipt.invoiceNo}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Date:</span>
                <span>{recentReceipt.date} {recentReceipt.time}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Customer:</span>
                <span>{recentReceipt.customer}</span>
              </div>
              <div className="border-top border-bottom py-2 my-2">
                {recentReceipt.items.map(item => (
                  <div key={item.product.id} className="d-flex justify-content-between mb-1">
                    <span>{item.product.name} x{item.qty}</span>
                    <span>${(item.product.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal:</span>
                <span>${recentReceipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>VAT (17%):</span>
                <span>${recentReceipt.tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total Paid:</span>
                <span className="text-success">${recentReceipt.total.toFixed(2)}</span>
              </div>
              <div className="border-top pt-2 mt-2 text-center extra-small text-muted">
                Thank you for shopping with us!<br />
                Returnable within 7 days with valid receipt.<br />
                <FontAwesomeIcon icon={faQrcode} className="fs-3 mt-2 text-dark" />
              </div>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-sm btn-primary text-white" onClick={() => { addNotification('Sent to printer queue.', 'success'); setShowReceiptModal(false); }}>
                <FontAwesomeIcon icon={faPrint} className="me-1" /> Print Thermal Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW / PREVIEW MODAL ===== */}
      {viewItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', width: '100%', margin: '1rem' }}>
            <div style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Sale Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span style={statusBadge(viewItem.status)}>
                    <span className="badge-dot" style={{ background: statusBadge(viewItem.status).color, width: 6, height: 6, borderRadius: '50%' }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.invoiceNo}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Customer: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.customer}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Date: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.date}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Time: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.time}</span></p>
                  </div>
                </div>

                <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Count</small>
                      <p className="mb-0 mt-1 font-monospace fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>{viewItem.items}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount</small>
                      <p className="mb-0 mt-1 font-monospace fw-bold" style={{ color: colors.success, fontSize: '0.9rem' }}>${viewItem.total.toFixed(2)}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</small>
                      <p className="mb-0 mt-1 font-monospace" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.method}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Purchased</small>
                      <p className="mb-0 mt-1 small" style={{ color: mutedColor, fontSize: '0.75rem' }}>{viewItem.itemNames}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 justify-content-end" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <button className="btn btn-sm px-3" style={{ borderRadius: '8px', background: '#f43f5e', color: '#fff', border: 'none', fontSize: '0.75rem' }} onClick={() => { handleExport('pdf'); }}>
                    <FontAwesomeIcon icon={faFilePdf} className="me-1" /> Export PDF
                  </button>
                  <button className="btn btn-sm px-3" style={{ borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', fontSize: '0.75rem' }} onClick={() => setViewItem(null)}>Close</button>
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
        title="Move to Trash"
        message="Are you sure you want to move this sale record to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? deleteDialog.name : ''}
        confirmLabel="Move to Trash"
      />
    </ErpPageShell>
  );
};

export default ErpPosSalesScreen;