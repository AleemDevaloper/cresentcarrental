import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faPlus, faTrash, faSave, faFileInvoiceDollar, faFileAlt,
  faSearch, faBoxesStacked, faPercent, faCoins, faDollarSign,
  faInfoCircle, faCalculator, faUser, faBuilding, faTag,
  faTruck, faShop, faCalendarDays, faCheckCircle, faClipboardList,
  faTimesCircle, faEdit, faCopy, faPaperPlane, faFilePdf,
  faFileExport, faHistory, faEye, faClock, faSync, faDownload,
  faXmark, faChevronDown, faBalanceScale, faGlobe, faStamp,
  faPrint, faEnvelope, faMessage, faQrcode, faSignature,
  faCircleCheck, faTriangleExclamation, faMinusCircle, faHashtag,
  faSignature as faSign, faTruckFast, faUserTie, faPhone, faLocationDot,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  createQuotation, createSalesOrder, createDeliveryChallan,
  createCreditNote, createSalesReturn,
  updateQuotation, updateSalesOrder, updateDeliveryChallan,
  updateCreditNote, updateSalesReturn,
} from '../../../../api/fms';
import { erpColors } from '../../../../components/ui/ux/ErpTheme';
import { fetchSalesCustomers } from '../../../../utils/arCustomers';
import { fetchSalesProducts } from '../../../../utils/inventoryProducts';

const DOC_CONFIG = {
  quotation: {
    prefix: 'QTN',
    label: 'New Quotation',
    badge: 'SALES / QUOTATION',
    backTab: 'erp_quotations',
    createFn: createQuotation,
    updateFn: updateQuotation,
    description: 'Create a quotation for a customer. Accepted quotations can be converted to Sales Orders.',
    statuses: ['Draft', 'Sent', 'Accepted', 'Rejected'],
    defaultStatus: 'Draft',
    icon: faFileAlt,
  },
  sales_order: {
    prefix: 'SO',
    label: 'New Sales Order',
    badge: 'SALES / ORDER',
    backTab: 'erp_sales_orders',
    createFn: createSalesOrder,
    updateFn: updateSalesOrder,
    description: 'Create a sales order against a customer. Orders flow to delivery challans and invoicing.',
    statuses: ['Draft', 'Confirmed', 'Processing', 'Completed', 'Cancelled'],
    defaultStatus: 'Draft',
    icon: faClipboardList,
  },
  delivery_challan: {
    prefix: 'DC',
    label: 'Issue Delivery Challan',
    badge: 'LOGISTICS / CHALLAN',
    backTab: 'erp_delivery_challans',
    createFn: createDeliveryChallan,
    updateFn: updateDeliveryChallan,
    description: 'Create a delivery challan for dispatch. Track vehicle, driver, and shipment details.',
    statuses: ['Draft', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    defaultStatus: 'Draft',
    icon: faTruck,
  },
  credit_note: {
    prefix: 'CN',
    label: 'Issue Credit Note',
    badge: 'ACCOUNTING / CREDIT',
    backTab: 'erp_credit_notes',
    createFn: createCreditNote,
    updateFn: updateCreditNote,
    description: 'Issue a credit note to offset a customer invoice, adjust debits, or process returns.',
    statuses: ['Draft', 'Approved', 'Posted', 'Void'],
    defaultStatus: 'Draft',
    icon: faFileInvoiceDollar,
  },
  sales_return: {
    prefix: 'SR',
    label: 'Log Sales Return',
    badge: 'LOGISTICS / RETURN',
    backTab: 'erp_sales_returns',
    createFn: createSalesReturn,
    updateFn: updateSalesReturn,
    description: 'Record customer returned goods, trigger quality inspection, and generate credit notes.',
    statuses: ['Draft', 'Inspected', 'Approved', 'Processed', 'Rejected'],
    defaultStatus: 'Draft',
    icon: faRotateLeft,
  },
};

const NAV_TABS = [
  { id: 'erp_quotations', label: 'Quotations' },
  { id: 'erp_sales_orders', label: 'Sales Orders' },
  { id: 'erp_delivery_challans', label: 'Delivery Challans' },
  { id: 'erp_sales_invoices', label: 'Sales Invoices' },
  { id: 'erp_credit_notes', label: 'Credit Notes' },
  { id: 'erp_sales_returns', label: 'Sales Returns' },
];

const ErpCreateDocument = ({ documentType = 'quotation' }) => {
  const { theme, addNotification, setActiveTab, editDocument, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const cfg = DOC_CONFIG[documentType] || DOC_CONFIG.quotation;

  const bgColor = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#242838' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1e2235' : '#ffffff';
  const inputBorder = isDark ? '#2d3248' : '#d1d5db';

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pendingCustomerName, setPendingCustomerName] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setCustomers(await fetchSalesCustomers());
      setProducts(await fetchSalesProducts());
    })();
  }, []);

  const now = new Date();
  const docNum = `${cfg.prefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  const [documentNumber, setDocumentNumber] = useState(docNum);
  const [documentDate, setDocumentDate] = useState(now.toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState(cfg.defaultStatus);
  const [reference, setReference] = useState('');
  const [taxMethod, setTaxMethod] = useState('Exclusive');
  const [shippingCharges, setShippingCharges] = useState(0);
  const [customerNotes, setCustomerNotes] = useState('');

  const [vehicleNo, setVehicleNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [lines, setLines] = useState([
    { id: Date.now(), productCode: '', productName: '', description: '', uom: 'Units', qty: 1, rate: 0, discount: 0, tax: 16, amount: 0 }
  ]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const customerSearchText = String(customerSearch ?? '');
  const filteredCustomers = customers.filter(c =>
    String(c.name || '').toLowerCase().includes(customerSearchText.toLowerCase()) ||
    String(c.code || '').toLowerCase().includes(customerSearchText.toLowerCase()) ||
    String(c.phone || '').includes(customerSearchText) ||
    String(c.email || '').toLowerCase().includes(customerSearchText.toLowerCase()) ||
    (c.ntn && String(c.ntn).toLowerCase().includes(customerSearchText.toLowerCase())) ||
    (c.strn && String(c.strn).toLowerCase().includes(customerSearchText.toLowerCase()))
  );

  const productSearchText = String(productSearch ?? '');
  const filteredProducts = products.filter(p =>
    String(p.name || '').toLowerCase().includes(productSearchText.toLowerCase()) ||
    String(p.code || '').toLowerCase().includes(productSearchText.toLowerCase())
  );

  const selectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setShowCustomerDropdown(false);
    setCustomerSearch(cust.name);
    const d = new Date();
    let days = 30;
    if (cust.terms === 'Net 15') days = 15;
    else if (cust.terms === 'Net 45') days = 45;
    else if (cust.terms === 'Due on Receipt') days = 0;
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const selectProduct = (lineId, product) => {
    setLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      const qty = l.qty || 1;
      const discount = product.discount || 0;
      const tax = product.tax || 16;
      const rate = product.rate || 0;
      const netAmount = qty * rate;
      const discountAmt = netAmount * (discount / 100);
      const taxableAmount = netAmount - discountAmt;
      const taxAmt = taxableAmount * (tax / 100);
      const amount = taxableAmount + taxAmt;
      return {
        ...l,
        productCode: product.code,
        productName: product.name,
        uom: product.uom,
        qty,
        rate,
        discount,
        tax,
        amount: Math.round(amount * 100) / 100
      };
    }));
    setShowProductSearch(null);
    setProductSearch('');
  };

  const addLine = () => {
    setLines(prev => [...prev, { id: Date.now(), productCode: '', productName: '', description: '', uom: 'Units', qty: 1, rate: 0, discount: 0, tax: 16, amount: 0 }]);
  };

  const removeLine = (id) => {
    if (lines.length <= 1) return;
    setLines(prev => prev.filter(l => l.id !== id));
  };

  const updateLine = (id, field, value) => {
    setLines(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, [field]: value };
      const qty = parseFloat(field === 'qty' ? value : l.qty) || 0;
      const rate = parseFloat(field === 'rate' ? value : l.rate) || 0;
      const discount = parseFloat(field === 'discount' ? value : l.discount) || 0;
      const tax = parseFloat(field === 'tax' ? value : l.tax) || 0;
      const netAmount = qty * rate;
      const discountAmt = netAmount * (discount / 100);
      const taxableAmount = netAmount - discountAmt;
      const taxAmt = taxableAmount * (tax / 100);
      updated.amount = Math.round((taxableAmount + taxAmt) * 100) / 100;
      return updated;
    }));
  };

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0), 0);
    const discountTotal = lines.reduce((s, l) => {
      const qty = parseFloat(l.qty) || 0;
      const rate = parseFloat(l.rate) || 0;
      const disc = parseFloat(l.discount) || 0;
      return s + (qty * rate * disc / 100);
    }, 0);
    const taxableAmount = subtotal - discountTotal;
    const taxTotal = lines.reduce((s, l) => {
      const qty = parseFloat(l.qty) || 0;
      const rate = parseFloat(l.rate) || 0;
      const disc = parseFloat(l.discount) || 0;
      const tax = parseFloat(l.tax) || 0;
      const netAmt = qty * rate;
      const discAmt = netAmt * disc / 100;
      return s + ((netAmt - discAmt) * tax / 100);
    }, 0);
    const shipping = parseFloat(shippingCharges) || 0;
    const grandTotal = taxableAmount + taxTotal + shipping;
    return { subtotal, discountTotal, taxableAmount, taxTotal, shipping, grandTotal };
  }, [lines, shippingCharges]);

  useEffect(() => {
    if (editDocument && editDocument.documentType === documentType) {
      const doc = editDocument;
      const customerName = String(doc.customer_name ?? doc.customer ?? '');
      if (doc.customerObj) {
        setSelectedCustomer(doc.customerObj);
        setCustomerSearch(String(doc.customerObj.name ?? ''));
      } else if (customerName) {
        setCustomerSearch(customerName);
        setPendingCustomerName(customerName);
      }
      setDocumentNumber(doc.document_number || doc.number || docNum);
      setDocumentDate(doc.document_date || doc.date || now.toISOString().split('T')[0]);
      setDueDate(doc.due_date || doc.due || doc.validUntil || (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; })());
      setStatus(doc.status || cfg.defaultStatus);
      setReference(doc.reference || '');
      setTaxMethod(doc.tax_method || 'Exclusive');
      setShippingCharges(parseFloat(doc.shipping_charges) || 0);
      setCustomerNotes(doc.customer_notes || doc.customerNotes || '');
      setVehicleNo(doc.vehicle_no || '');
      setDriverName(doc.driver_name || '');
      setDriverContact(doc.driver_contact || '');
      setDeliveryAddress(doc.delivery_address || '');
      if (doc.lines && doc.lines.length > 0) {
        setLines(doc.lines.map(l => ({
          id: Date.now() + Math.random(),
          productCode: l.product_code || l.productCode || '',
          productName: l.product_name || l.productName || '',
          description: l.description || '',
          uom: l.uom || 'Units',
          qty: parseFloat(l.qty) || 1,
          rate: parseFloat(l.rate) || 0,
          discount: parseFloat(l.discount) || 0,
          tax: parseFloat(l.tax) || 16,
          amount: parseFloat(l.amount) || 0,
        })));
      }
      setIsEditing(true);
      setEditingId(doc.id);
      setEditDocument(null);
    }
  }, [editDocument]);

  // Resolves an editing document's customer once AR customers are loaded
  useEffect(() => {
    if (!pendingCustomerName) return;
    const cust = customers.find(c => c.name === pendingCustomerName);
    if (cust) {
      setSelectedCustomer(cust);
      setPendingCustomerName(null);
    }
  }, [customers, pendingCustomerName]);

  const handleSubmit = async () => {
    const errs = {};
    if (!selectedCustomer) errs.customer = 'Please select a customer.';
    if (!documentDate) errs.documentDate = 'Document date is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    const hasItems = lines.some(l => l.productName && parseFloat(l.rate) > 0);
    if (!hasItems) errs.lines = 'Add at least one line item.';
    if (selectedCustomer && selectedCustomer.status === 'Credit Hold') {
      errs.customer = 'Customer is on Credit Hold. Cannot create document.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name,
        document_number: documentNumber,
        document_date: documentDate,
        due_date: dueDate,
        status,
        reference,
        tax_method: taxMethod,
        shipping_charges: totals.shipping,
        customer_notes: customerNotes,
        currency: selectedCustomer.currency || 'USD',
        salesperson: selectedCustomer.salesperson || null,
        lines: lines.filter(l => l.productName).map(l => ({
          product_code: l.productCode,
          product_name: l.productName,
          description: l.description,
          uom: l.uom,
          qty: parseFloat(l.qty) || 0,
          rate: parseFloat(l.rate) || 0,
          discount: parseFloat(l.discount) || 0,
          tax: parseFloat(l.tax) || 0,
          amount: l.amount,
        })),
        subtotal: totals.subtotal,
        discount_total: totals.discountTotal,
        taxable_amount: totals.taxableAmount,
        tax_total: totals.taxTotal,
        shipping_charges: totals.shipping,
        grand_total: totals.grandTotal,
      };

      if (documentType === 'delivery_challan') {
        payload.vehicle_no = vehicleNo;
        payload.driver_name = driverName;
        payload.driver_contact = driverContact;
        payload.delivery_address = deliveryAddress || selectedCustomer?.shippingAddress;
      }

      if (isEditing) {
        payload.id = editingId;
        await cfg.updateFn(payload);
        addNotification(`${cfg.label.replace('New ', '').replace('Issue ', '').replace('Log ', '')} ${documentNumber} updated successfully.`, 'success');
      } else {
        await cfg.createFn(payload);
        addNotification(`${cfg.label} ${documentNumber} created successfully.`, 'success');
      }
      setActiveTab(cfg.backTab);
      // Notify other ERP pages to refresh their data
      try { window.dispatchEvent(new Event('erp:refresh')); } catch (e) { /* ignore */ }
    } catch (err) {
      addNotification(err?.response?.data?.message || err.message || `Failed to create ${cfg.label.toLowerCase()}.`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleBack = () => {
    setActiveTab(cfg.backTab);
  };

  const statusColors = {
    Draft: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
    Sent: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    Accepted: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    Rejected: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    Confirmed: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    Processing: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    Completed: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    Cancelled: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    Packed: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    Shipped: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    Delivered: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    Void: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
  };
  const sc = statusColors[status] || statusColors.Draft;

  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.8rem',
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: '8px', color: textColor, outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 600,
    color: mutedColor, marginBottom: '0.35rem', textTransform: 'uppercase',
    letterSpacing: '0.03em',
  };

  const cardStyle = {
    background: cardBg, border: `1px solid ${borderColor}`,
    borderRadius: '12px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    padding: '1.25rem', marginBottom: '1rem',
  };

  const activeNavTab = cfg.backTab;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .si-nav-tabs { display: flex; gap: 0; background: ${isDark ? '#1e2235' : '#ffffff'}; border-radius: 10px; padding: 4px; border: 1px solid ${borderColor}; overflow-x: auto; scrollbar-width: none; }
        .si-nav-tabs::-webkit-scrollbar { display: none; }
        .si-nav-tab { padding: 0.5rem 1rem; font-size: 0.78rem; font-weight: 500; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: all 0.2s; border: none; background: transparent; color: ${mutedColor}; }
        .si-nav-tab:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; color: ${textColor}; }
        .si-nav-tab.active { background: #6366f1; color: #ffffff; box-shadow: 0 2px 8px rgba(99,102,241,0.3); }
        .si-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .si-dropdown { position: absolute; z-index: 100; background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 10px; box-shadow: ${isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.12)'}; max-height: 320px; overflow-y: auto; width: 100%; top: 100%; margin-top: 4px; }
        .si-dropdown-item { padding: 0.6rem 0.75rem; cursor: pointer; border-bottom: 1px solid ${borderColor}; transition: background 0.15s; }
        .si-dropdown-item:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; }
        .si-dropdown-item:last-child { border-bottom: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .si-animate { animation: fadeIn 0.2s ease-out; }
        @media (max-width: 768px) { .si-responsive-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}`, transition: 'all 0.2s' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>{cfg.badge}</span>
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>
                <FontAwesomeIcon icon={cfg.icon} style={{ marginRight: 8, color: '#6366f1', fontSize: '1.1rem' }} />
                {isEditing ? `Edit ${cfg.label.replace('New ', '').replace('Issue ', '').replace('Log ', '')}` : cfg.label}
              </h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                {cfg.description}
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white"
              style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSync : faSave} spin={submitting} /> {submitting ? 'Saving...' : isEditing ? `Update ${cfg.label.replace('New ', '').replace('Issue ', '').replace('Log ', '')}` : `Save & Create ${cfg.label.replace('New ', '').replace('Issue ', '')}`}
            </button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3"
              style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
          </div>
        </div>

        <div className="si-nav-tabs mb-4">
          {NAV_TABS.map(tab => (
            <button key={tab.id} className={`si-nav-tab ${tab.id === activeNavTab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="row g-3">
          <div className="col-lg-8">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBuilding} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Customer Information</h6>
                {selectedCustomer && (
                  <span className="badge ms-auto" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.6rem', fontWeight: 600 }}>{selectedCustomer.code}</span>
                )}
              </div>

              <div className="position-relative mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Customer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="position-relative">
                  <input
                    style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                    className="si-input"
                    placeholder="Search by name, code, phone, NTN, STRN, email..."
                    value={customerSearch}
                    onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); setSelectedCustomer(null); }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                  />
                  <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.75rem' }} />
                  {showCustomerDropdown && customerSearch.length > 0 && (
                    <div className="si-dropdown si-animate">
                      <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.65rem', color: mutedColor, borderBottom: `1px solid ${borderColor}`, fontWeight: 600 }}>
                        {filteredCustomers.length} Items Found
                      </div>
                      {filteredCustomers.map(cust => (
                        <div key={cust.id} className="si-dropdown-item" onMouseDown={() => selectCustomer(cust)}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{cust.name}</div>
                              <div style={{ fontSize: '0.65rem', color: mutedColor, marginTop: 2 }}>
                                {cust.code} | {cust.type} | {cust.city} | {cust.phone}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: mutedColor }}>
                                {cust.email} | Credit: ${cust.creditLimit.toLocaleString()} | O/S: ${cust.outstanding.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-end" style={{ flexShrink: 0 }}>
                              <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', background: cust.status === 'Active' ? '#dcfce7' : '#fee2e2', color: cust.status === 'Active' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{cust.status}</span>
                              <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 4 }}>Group: {cust.group}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: mutedColor }}>No customers found.</div>
                      )}
                    </div>
                  )}
                </div>
                {errors.customer && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 4 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{errors.customer}</div>}
              </div>

              {selectedCustomer && (
                <div className="row g-2" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                  <div className="col-md-6">
                    <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '8px', padding: '0.75rem', border: `1px solid ${borderColor}` }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>Billing Address</div>
                      <div style={{ fontSize: '0.75rem', color: textColor, lineHeight: 1.5 }}>{selectedCustomer.billingAddress}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '8px', padding: '0.75rem', border: `1px solid ${borderColor}` }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>Shipping Address</div>
                      <div style={{ fontSize: '0.75rem', color: textColor, lineHeight: 1.5 }}>{selectedCustomer.shippingAddress}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {documentType === 'delivery_challan' && (
              <div style={cardStyle}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faTruckFast} style={{ color: '#f59e0b', fontSize: '0.85rem' }} />
                  <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Delivery Information</h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label style={labelStyle}><FontAwesomeIcon icon={faTruck} style={{ marginRight: 4, fontSize: '0.65rem' }} />Vehicle No.</label>
                    <input style={inputStyle} className="si-input" placeholder="e.g. ABC-1234" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}><FontAwesomeIcon icon={faUserTie} style={{ marginRight: 4, fontSize: '0.65rem' }} />Driver Name</label>
                    <input style={inputStyle} className="si-input" placeholder="Driver full name" value={driverName} onChange={e => setDriverName(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}><FontAwesomeIcon icon={faPhone} style={{ marginRight: 4, fontSize: '0.65rem' }} />Driver Contact</label>
                    <input style={inputStyle} className="si-input" placeholder="Phone number" value={driverContact} onChange={e => setDriverContact(e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label style={labelStyle}><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 4, fontSize: '0.65rem' }} />Delivery Address</label>
                    <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} className="si-input" placeholder="Enter delivery address (defaults to customer shipping address)" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBoxesStacked} style={{ color: '#10b981', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Line Items</h6>
                <button onClick={addLine} className="btn btn-sm d-flex align-items-center gap-1 ms-auto border-0 text-white"
                  style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.7rem', padding: '0.35rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faPlus} /> Add Line
                </button>
              </div>

              {errors.lines && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginBottom: 8 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{errors.lines}</div>}

              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'left', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>#</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'left', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em', minWidth: 180 }}>Item / Product</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>UOM</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Qty</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Rate</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Disc %</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Tax %</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'right', color: mutedColor, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Amount</th>
                      <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center', width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={line.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td style={{ padding: '0.5rem', color: mutedColor, fontSize: '0.7rem', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '0.35rem 0.5rem', position: 'relative' }}>
                          {showProductSearch === line.id ? (
                            <div className="position-relative">
                              <input style={{ ...inputStyle, fontSize: '0.7rem', padding: '0.35rem 0.5rem' }} className="si-input"
                                placeholder="Search products..."
                                value={productSearch} autoFocus
                                onChange={e => setProductSearch(e.target.value)}
                                onBlur={() => setTimeout(() => { setShowProductSearch(null); setProductSearch(''); }, 200)}
                              />
                              {productSearch.length > 0 && (
                                <div className="si-dropdown si-animate" style={{ maxHeight: 200 }}>
                                  {filteredProducts.map(p => (
                                    <div key={p.id} className="si-dropdown-item" style={{ padding: '0.4rem 0.6rem' }}
                                      onMouseDown={() => selectProduct(line.id, p)}>
                                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: textColor }}>{p.name}</div>
                                      <div style={{ fontSize: '0.62rem', color: mutedColor }}>{p.code} | Rate: ${p.rate} | Tax: {p.tax}%</div>
                                    </div>
                                  ))}
                                  {filteredProducts.length === 0 && (
                                    <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.65rem', color: mutedColor }}>No products found.</div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, minHeight: 32 }}
                              onClick={() => { setShowProductSearch(line.id); setProductSearch(''); }}>
                              {line.productName ? (
                                <>
                                  <FontAwesomeIcon icon={faBoxesStacked} style={{ color: '#10b981', fontSize: '0.65rem' }} />
                                  <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 500, color: textColor }}>{line.productName}</div>
                                    {line.productCode && <div style={{ fontSize: '0.6rem', color: mutedColor }}>{line.productCode}</div>}
                                  </div>
                                </>
                              ) : (
                                <span style={{ fontSize: '0.7rem', color: mutedColor }}><FontAwesomeIcon icon={faSearch} className="me-1" />Click to search product...</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.35rem 0.25rem' }}>
                          <input style={{ ...inputStyle, fontSize: '0.7rem', padding: '0.35rem 0.4rem', textAlign: 'center' }} className="si-input"
                            value={line.uom} onChange={e => updateLine(line.id, 'uom', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.25rem' }}>
                          <input type="number" min="0" step="1" style={{ ...inputStyle, fontSize: '0.7rem', padding: '0.35rem 0.4rem', textAlign: 'right' }} className="si-input"
                            value={line.qty} onChange={e => updateLine(line.id, 'qty', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.25rem' }}>
                          <input type="number" min="0" step="0.01" style={{ ...inputStyle, fontSize: '0.7rem', padding: '0.35rem 0.4rem', textAlign: 'right' }} className="si-input"
                            value={line.rate} onChange={e => updateLine(line.id, 'rate', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.25rem' }}>
                          <input type="number" min="0" max="100" step="0.1" style={{ ...inputStyle, fontSize: '0.7rem', padding: '0.35rem 0.4rem', textAlign: 'right' }} className="si-input"
                            value={line.discount} onChange={e => updateLine(line.id, 'discount', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.25rem' }}>
                          <input type="number" min="0" max="100" step="0.1" style={{ ...inputStyle, fontSize: '0.7rem', padding: '0.35rem 0.4rem', textAlign: 'right' }} className="si-input"
                            value={line.tax} onChange={e => updateLine(line.id, 'tax', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600, color: textColor, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          ${line.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.35rem', textAlign: 'center' }}>
                          <button onClick={() => removeLine(line.id)} disabled={lines.length <= 1} className="btn btn-sm border-0"
                            style={{ color: '#ef4444', padding: '4px 6px', borderRadius: '6px', opacity: lines.length <= 1 ? 0.3 : 1 }}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faMessage} style={{ color: '#8b5cf6', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Notes & References</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Reference / PO No.</label>
                  <input style={inputStyle} className="si-input" placeholder="Customer PO or reference" value={reference} onChange={e => setReference(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} className="si-input" value={status} onChange={e => setStatus(e.target.value)}>
                    {cfg.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label style={labelStyle}>Customer Notes</label>
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} className="si-input" placeholder="Internal notes or customer-facing remarks" value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={{ ...cardStyle, position: 'sticky', top: '1rem' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCalculator} style={{ color: '#f59e0b', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Document Summary</h6>
              </div>

              <div style={labelStyle}>
                <FontAwesomeIcon icon={faHashtag} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                Document No.
              </div>
              <div style={{ ...inputStyle, marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.8rem' }}>{documentNumber}</div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label style={labelStyle}>Date</label>
                  <input type="date" style={inputStyle} className="si-input" value={documentDate} onChange={e => setDocumentDate(e.target.value)} />
                  {errors.documentDate && <div style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: 2 }}>{errors.documentDate}</div>}
                </div>
                <div className="col-6">
                  <label style={labelStyle}>Due Date</label>
                  <input type="date" style={inputStyle} className="si-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  {errors.dueDate && <div style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: 2 }}>{errors.dueDate}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Status</label>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.35rem 0.75rem', borderRadius: '20px', background: sc.bg, color: sc.color, fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.color }}></span>
                  {status}
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Tax Method</label>
                <select style={inputStyle} className="si-input" value={taxMethod} onChange={e => setTaxMethod(e.target.value)}>
                  <option value="Exclusive">Exclusive</option>
                  <option value="Inclusive">Inclusive</option>
                </select>
              </div>

              <hr style={{ borderColor, margin: '1rem 0' }} />

              <div className="mb-3">
                <label style={labelStyle}>Shipping Charges ($)</label>
                <input type="number" min="0" step="0.01" style={inputStyle} className="si-input" value={shippingCharges} onChange={e => setShippingCharges(e.target.value)} />
              </div>

              <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '0.75rem' }}>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem', color: mutedColor }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: textColor }}>${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                  <span>Discount Total</span>
                  <span style={{ fontWeight: 600 }}>-${totals.discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem', color: mutedColor }}>
                  <span>Taxable Amount</span>
                  <span style={{ fontWeight: 600, color: textColor }}>${totals.taxableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                  <span>Tax Total</span>
                  <span style={{ fontWeight: 600 }}>${totals.taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.75rem', color: mutedColor }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600, color: textColor }}>${totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <hr style={{ borderColor, margin: '0.5rem 0' }} />
                <div className="d-flex justify-content-between" style={{ fontSize: '1rem', color: textColor }}>
                  <span style={{ fontWeight: 700 }}>Grand Total</span>
                  <span style={{ fontWeight: 800, color: '#6366f1' }}>${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: isDark ? '#1e2235' : '#eff6ff', border: `1px solid ${isDark ? '#1e3a5f' : '#bfdbfe'}`, fontSize: '0.7rem', color: mutedColor }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 4, color: '#3b82f6' }} />
                {documentType === 'quotation' ? 'Quotations are non-binding estimates. Accepted quotations can be converted to Sales Orders.' :
                 documentType === 'sales_order' ? 'Sales Orders confirm the deal and trigger fulfillment workflows including inventory allocation.' :
                 'Delivery Challans record physical dispatch. Mark as Delivered to complete the shipment cycle.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateDocument;
