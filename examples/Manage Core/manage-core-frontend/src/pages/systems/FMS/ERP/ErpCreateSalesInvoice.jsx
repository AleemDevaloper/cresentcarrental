import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faPlus, faTrash, faSave, faFileInvoiceDollar,
  faSearch, faBoxesStacked, faPercent, faCoins, faDollarSign,
  faInfoCircle, faCalculator, faUser, faBuilding, faTag,
  faTruck, faShop, faCalendarDays, faCheckCircle,
  faTimesCircle, faEdit, faCopy, faPaperPlane, faFilePdf,
  faFileExport, faHistory, faEye, faClock, faSync, faDownload,
  faXmark, faChevronDown, faBalanceScale, faGlobe, faStamp,
  faPrint, faEnvelope, faMessage, faQrcode, faSignature,
  faCircleCheck, faTriangleExclamation, faMinusCircle, faHashtag,
  faUsers, faPhone, faEnvelope as faEnvelopeIcon, faLocationDot,
  faArrowRightArrowLeft, faLayerGroup, faUserTie, faStore,
  faPen, faRefresh, faExternalLinkAlt, faShieldHalved,
  faBolt, faKeyboard, faClipboardList, faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { createSalesInvoice, updateSalesInvoice } from '../../../../api/fms';
import { erpColors } from '../../../../components/ui/ux/ErpTheme';
import { fetchSalesCustomers } from '../../../../utils/arCustomers';
import { fetchSalesProducts } from '../../../../utils/inventoryProducts';

const SALES_REPS = [
  { id: 1, name: 'Tony Stark', commission: 5, department: 'Enterprise Sales', region: 'North America', branch: 'Main Branch' },
  { id: 2, name: 'Bruce Wayne', commission: 3, department: 'Corporate Sales', region: 'East Coast', branch: 'Gotham Branch' },
  { id: 3, name: 'Harry Osborn', commission: 2, department: 'Mid-Market', region: 'West Coast', branch: 'NY Branch' },
  { id: 4, name: 'Steve Trevor', commission: 1, department: 'Retail', region: 'International', branch: 'Main Branch' },
];

const WAREHOUSES = [
  { id: 1, name: 'Main Warehouse', code: 'WH-001', location: 'Building A, Floor 1' },
  { id: 2, name: 'East Warehouse', code: 'WH-002', location: 'Building B, Floor 2' },
  { id: 3, name: 'West Warehouse', code: 'WH-003', location: 'Building C, Floor 1' },
  { id: 4, name: 'North Warehouse', code: 'WH-004', location: 'Building D, Ground Floor' },
];

const PAYMENT_TERMS_LIST = [
  'Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'End of Month', 'Cash', 'Advance', 'Installments',
];

const NAV_TABS = [
  { id: 'erp_quotations', label: 'Quotations' },
  { id: 'erp_sales_orders', label: 'Sales Orders' },
  { id: 'erp_delivery_challans', label: 'Delivery Challans' },
  { id: 'erp_sales_invoices', label: 'Sales Invoices' },
  { id: 'erp_credit_notes', label: 'Credit Notes' },
  { id: 'erp_sales_returns', label: 'Sales Returns' },
];

const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `SI-${year}${month}-${seq}`;
};

const getDueDateByTerms = (invoiceDate, terms) => {
  const d = new Date(invoiceDate);
  if (terms === 'Due on Receipt' || terms === 'Cash') return d.toISOString().split('T')[0];
  if (terms === 'Net 15') d.setDate(d.getDate() + 15);
  else if (terms === 'Net 30') d.setDate(d.getDate() + 30);
  else if (terms === 'Net 45') d.setDate(d.getDate() + 45);
  else if (terms === 'Net 60') d.setDate(d.getDate() + 60);
  else if (terms === 'End of Month') { d.setMonth(d.getMonth() + 1); d.setDate(0); }
  else if (terms === 'Advance') return invoiceDate;
  else if (terms === 'Installments') d.setDate(d.getDate() + 90);
  else d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

const getDaysDiff = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

const ErpCreateSalesInvoice = () => {
  const { theme, addNotification, setActiveTab, editDocument, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const bgColor = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#242838' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1e2235' : '#ffffff';
  const inputBorder = isDark ? '#2d3248' : '#d1d5db';
  const successBg = isDark ? '#064e3b' : '#dcfce7';
  const successColor = isDark ? '#4ade80' : '#16a34a';
  const warningBg = isDark ? '#1e293b' : '#fef3c7';
  const warningColor = isDark ? '#fbbf24' : '#d97706';
  const dangerBg = isDark ? '#7f1d1d' : '#fee2e2';
  const dangerColor = isDark ? '#f87171' : '#dc2626';

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDropdownTab, setCustomerDropdownTab] = useState('list');
  const [customers, setCustomers] = useState([]);
  const [pendingCustomerId, setPendingCustomerId] = useState(null);
  const [pendingCustomerName, setPendingCustomerName] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setCustomers(await fetchSalesCustomers());
      setProducts(await fetchSalesProducts());
    })();
  }, []);

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState('Draft');
  const [reference, setReference] = useState('');
  const [taxMethod, setTaxMethod] = useState('Exclusive');
  const [shippingCharges, setShippingCharges] = useState(0);
  const [customerNotes, setCustomerNotes] = useState('');

  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [salesRep, setSalesRep] = useState(null);
  const [warehouse, setWarehouse] = useState('Main Warehouse');
  const [branch, setBranch] = useState('Main Branch');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  const [lines, setLines] = useState([
    { id: Date.now(), productCode: '', productName: '', description: '', uom: 'Units', qty: 1, rate: 0, discount: 0, tax: 16, amount: 0 }
  ]);

  const [errors, setErrors] = useState({});
  const [liveErrors, setLiveErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(null);
  const [productSearch, setProductSearch] = useState('');

  const [draftSaved, setDraftSaved] = useState(false);
  const [draftTimer, setDraftTimer] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const customerInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        setInvoiceNumber(generateInvoiceNumber());
        addNotification('New invoice number generated.', 'info');
      }
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        customerInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addAuditLog = (field, oldVal, newVal, reason = '') => {
    setAuditLog(prev => [...prev, {
      field,
      oldValue: oldVal,
      newValue: newVal,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      ip: '127.0.0.1',
      device: navigator.userAgent,
      reason,
    }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveDraft();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedCustomer, lines, invoiceNumber, invoiceDate, dueDate, status, reference, taxMethod, shippingCharges, customerNotes, paymentTerms, sameAsBilling]);

  const handleSaveDraft = () => {
    const draft = {
      invoiceNumber, invoiceDate, dueDate, status, reference, taxMethod,
      shippingCharges, customerNotes, paymentTerms, salesRep, warehouse,
      sameAsBilling, billingAddress, shippingAddress, currency, exchangeRate,
      customerId: selectedCustomer?.id,
      lines,
    };
    localStorage.setItem('si_draft', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('si_draft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setInvoiceNumber(d.invoiceNumber || invoiceNumber);
        setInvoiceDate(d.invoiceDate || invoiceDate);
        setDueDate(d.dueDate || dueDate);
        if (d.status) setStatus(d.status);
        if (d.reference !== undefined) setReference(d.reference);
        if (d.taxMethod) setTaxMethod(d.taxMethod);
        if (d.shippingCharges !== undefined) setShippingCharges(d.shippingCharges);
        if (d.customerNotes !== undefined) setCustomerNotes(d.customerNotes);
        if (d.paymentTerms) setPaymentTerms(d.paymentTerms);
        if (d.warehouse) setWarehouse(d.warehouse);
        if (d.sameAsBilling !== undefined) setSameAsBilling(d.sameAsBilling);
        if (d.billingAddress) setBillingAddress(d.billingAddress);
        if (d.shippingAddress) setShippingAddress(d.shippingAddress);
        if (d.currency) setCurrency(d.currency);
        if (d.exchangeRate) setExchangeRate(d.exchangeRate);
        if (d.customerId) {
          setPendingCustomerId(d.customerId);
        }
        if (d.lines && d.lines.length > 0) setLines(d.lines);
      } catch (e) {}
    }
  }, []);

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

  const selectCustomer = useCallback((cust) => {
    setSelectedCustomer(cust);
    setShowCustomerDropdown(false);
    setCustomerSearch(cust.name);
    setPaymentTerms(cust.terms || 'Net 30');
    setSalesRep(cust.salesperson || null);
    setWarehouse(cust.warehouse || 'Main Warehouse');
    setBillingAddress(cust.billingAddress);
    setShippingAddress(cust.shippingAddress);
    setCurrency(cust.currency || 'USD');
    const d = new Date(invoiceDate);
    let days = 30;
    if (cust.terms === 'Net 15') days = 15;
    else if (cust.terms === 'Net 45') days = 45;
    else if (cust.terms === 'Net 60') days = 60;
    else if (cust.terms === 'Due on Receipt' || cust.terms === 'Cash') days = 0;
    else if (cust.terms === 'End of Month') { d.setMonth(d.getMonth() + 1); d.setDate(0); return setDueDate(d.toISOString().split('T')[0]); }
    else if (cust.terms === 'Advance') days = 0;
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split('T')[0]);
    addAuditLog('customer', '', `${cust.code} - ${cust.name}`);
  }, [invoiceDate]);

  useEffect(() => {
    const nd = getDueDateByTerms(invoiceDate, paymentTerms);
    if (nd !== dueDate) setDueDate(nd);
  }, [paymentTerms, invoiceDate]);

  const riskColor = (level) => {
    if (level === 'Low') return { bg: successBg, color: successColor };
    if (level === 'Medium') return { bg: warningBg, color: warningColor };
    return { bg: dangerBg, color: dangerColor };
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
      if (taxMethod === 'Inclusive') {
        const tax = parseFloat(l.tax) || 0;
        const taxRate = tax / 100;
        const priceExclTax = rate / (1 + taxRate);
        return s + (qty * priceExclTax * disc / 100);
      }
      return s + (qty * rate * disc / 100);
    }, 0);
    const taxableAmount = subtotal - discountTotal;
    const taxTotal = lines.reduce((s, l) => {
      const qty = parseFloat(l.qty) || 0;
      const rate = parseFloat(l.rate) || 0;
      const disc = parseFloat(l.discount) || 0;
      const tax = parseFloat(l.tax) || 0;
      if (taxMethod === 'No Tax') return 0;
      let netAmt = qty * rate;
      if (taxMethod === 'Inclusive') {
        const taxRate = tax / 100;
        netAmt = qty * (rate / (1 + taxRate));
      }
      const discAmt = netAmt * disc / 100;
      return s + ((netAmt - discAmt) * tax / 100);
    }, 0);
    const shipping = parseFloat(shippingCharges) || 0;
    const grandTotal = taxableAmount + taxTotal + shipping;
    return { subtotal, discountTotal, taxableAmount, taxTotal, shipping, grandTotal };
  }, [lines, shippingCharges, taxMethod]);

  const validateLive = useCallback(() => {
    const errs = {};
    if (!selectedCustomer) errs.customer = 'Customer is required.';
    if (selectedCustomer && selectedCustomer.status === 'Credit Hold') {
      errs.customer = 'Customer is on Credit Hold. Cannot create invoice.';
    }
    if (selectedCustomer && selectedCustomer.status === 'Inactive') {
      errs.customer = 'Inactive Customer. Cannot create invoice.';
    }
    if (!invoiceDate) errs.invoiceDate = 'Invoice date is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    if (dueDate && invoiceDate && new Date(dueDate) < new Date(invoiceDate)) {
      errs.dueDate = 'Due date cannot be earlier than invoice date.';
    }
    const hasItems = lines.some(l => l.productName && parseFloat(l.rate) > 0);
    if (!hasItems) errs.lines = 'Add at least one invoice line item.';
    if (selectedCustomer && selectedCustomer.creditLimit > 0 && totals.grandTotal > selectedCustomer.creditLimit) {
      errs.creditLimit = `Credit limit exceeded. Limit: $${selectedCustomer.creditLimit.toLocaleString()}`;
    }
    if (reference && selectedCustomer) {
      const existingRefs = ['PO-2026-0042', 'PO-2026-0043'];
      if (existingRefs.includes(reference)) {
        errs.reference = 'Duplicate Reference Found';
      }
    }
    setLiveErrors(errs);
    return Object.keys(errs).length === 0;
  }, [selectedCustomer, invoiceDate, dueDate, lines, totals, reference]);

  useEffect(() => {
    const t = setTimeout(() => validateLive(), 500);
    return () => clearTimeout(t);
  }, [selectedCustomer, invoiceDate, dueDate, lines, totals, reference, taxMethod]);

  useEffect(() => {
    if (editDocument && editDocument.documentType === 'sales_invoice') {
      const doc = editDocument;
      const customerName = String(doc.customer_name ?? doc.customer ?? '');
      if (doc.customerObj) {
        setSelectedCustomer(doc.customerObj);
        setCustomerSearch(String(doc.customerObj.name ?? ''));
        setPaymentTerms(doc.customerObj.terms || 'Net 30');
        setBillingAddress(doc.customerObj.billingAddress);
        setShippingAddress(doc.customerObj.shippingAddress);
        setCurrency(doc.customerObj.currency || 'USD');
      } else if (customerName) {
        setCustomerSearch(customerName);
        setPendingCustomerName(customerName);
      }
      setInvoiceNumber(doc.invoice_number || doc.number || generateInvoiceNumber());
      setInvoiceDate(doc.invoice_date || doc.date || new Date().toISOString().split('T')[0]);
      setDueDate(doc.due_date || doc.due || (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; })());
      setStatus(doc.status || 'Draft');
      setReference(doc.reference || '');
      setTaxMethod(doc.tax_method || 'Exclusive');
      setShippingCharges(parseFloat(doc.shipping_charges) || 0);
      setCustomerNotes(doc.customer_notes || doc.customerNotes || '');
      if (doc.payment_terms) setPaymentTerms(doc.payment_terms);
      if (doc.sales_rep) setSalesRep(doc.sales_rep);
      if (doc.warehouse) setWarehouse(doc.warehouse);
      if (doc.branch) setBranch(doc.branch);
      if (doc.billing_address) setBillingAddress(doc.billing_address);
      if (doc.shipping_address) setShippingAddress(doc.shipping_address);
      if (doc.currency) setCurrency(doc.currency);
      if (doc.exchange_rate) setExchangeRate(doc.exchange_rate);
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

  // Resolves a restored draft's customer once AR customers are loaded
  useEffect(() => {
    if (pendingCustomerId == null) return;
    const cust = customers.find(c => c.id === pendingCustomerId);
    if (!cust) return;
    setSelectedCustomer(cust);
    setCustomerSearch(cust.name);
    setPaymentTerms(cust.terms || 'Net 30');
    setSalesRep(cust.salesperson || null);
    setWarehouse(cust.warehouse || 'Main Warehouse');
    setBillingAddress(cust.billingAddress);
    setShippingAddress(cust.shippingAddress);
    setPendingCustomerId(null);
  }, [customers, pendingCustomerId]);

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
    if (selectedCustomer && selectedCustomer.status === 'Credit Hold') {
      errs.customer = 'Customer is on Credit Hold. Cannot create invoice.';
    }
    if (selectedCustomer && selectedCustomer.status === 'Inactive') {
      errs.customer = 'Inactive Customer. Cannot create invoice.';
    }
    if (!invoiceDate) errs.invoiceDate = 'Invoice date is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    if (dueDate && invoiceDate && new Date(dueDate) < new Date(invoiceDate)) {
      errs.dueDate = 'Due date cannot be earlier than invoice date.';
    }
    const hasItems = lines.some(l => l.productName && parseFloat(l.rate) > 0);
    if (!hasItems) errs.lines = 'Add at least one invoice line item.';
    if (selectedCustomer && selectedCustomer.creditLimit > 0 && totals.grandTotal > selectedCustomer.creditLimit) {
      errs.creditLimit = `Invoice amount ($${totals.grandTotal.toLocaleString()}) exceeds customer credit limit ($${selectedCustomer.creditLimit.toLocaleString()}).`;
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        customer_id: selectedCustomer.id,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        due_date: dueDate,
        status,
        reference,
        tax_method: taxMethod,
        shipping_charges: totals.shipping,
        customer_notes: customerNotes,
        payment_terms: paymentTerms,
        sales_rep: salesRep,
        warehouse,
        branch,
        currency,
        exchange_rate: exchangeRate,
        billing_address: billingAddress,
        shipping_address: shippingAddress,
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
      if (isEditing) {
        payload.id = editingId;
        await updateSalesInvoice(payload);
        addNotification(`Sales Invoice ${invoiceNumber} updated successfully.`, 'success');
      } else {
        await createSalesInvoice(payload);
        addNotification(`Sales Invoice ${invoiceNumber} created successfully.`, 'success');
      }
      localStorage.removeItem('si_draft');
      setActiveTab('erp_sales_invoices');
    } catch (err) {
      addNotification(err?.response?.data?.message || err.message || 'Failed to create invoice.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraftFn = () => {
    handleSaveDraft();
    addNotification('Draft saved.', 'info');
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleBack = () => {
    setActiveTab('erp_sales_invoices');
  };

  const handlePaymentTermsChange = (val) => {
    addAuditLog('paymentTerms', paymentTerms, val);
    setPaymentTerms(val);
  };

  const statusColors = {
    Draft: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
    'Pending Approval': { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    Approved: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    Posted: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    Cancelled: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    Paid: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    'Partially Paid': { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    Overdue: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
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

  const dueDays = useMemo(() => {
    if (invoiceDate && dueDate) return getDaysDiff(invoiceDate, dueDate);
    return 0;
  }, [invoiceDate, dueDate]);

  const availableCredit = useMemo(() => {
    if (!selectedCustomer) return 0;
    if (!selectedCustomer.creditLimit) return Infinity;
    return Math.max(0, selectedCustomer.creditLimit - selectedCustomer.outstanding);
  }, [selectedCustomer]);

  const creditExceeded = useMemo(() => {
    if (!selectedCustomer) return false;
    return totals.grandTotal > availableCredit;
  }, [totals, selectedCustomer, availableCredit]);

  return (
    <div style={{ background: bgColor, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .si-nav-tabs { display: flex; gap: 0; background: ${isDark ? '#1e2235' : '#ffffff'}; border-radius: 10px; padding: 4px; border: 1px solid ${borderColor}; overflow-x: auto; scrollbar-width: none; }
        .si-nav-tabs::-webkit-scrollbar { display: none; }
        .si-nav-tab { padding: 0.5rem 1rem; font-size: 0.78rem; font-weight: 500; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: all 0.2s; border: none; background: transparent; color: ${mutedColor}; }
        .si-nav-tab:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; color: ${textColor}; }
        .si-nav-tab.active { background: #6366f1; color: #ffffff; box-shadow: 0 2px 8px rgba(99,102,241,0.3); }
        .si-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .si-dropdown { position: absolute; z-index: 100; background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 10px; box-shadow: ${isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.12)'}; max-height: 360px; overflow-y: auto; width: 100%; top: 100%; margin-top: 4px; }
        .si-dropdown-item { padding: 0.6rem 0.75rem; cursor: pointer; border-bottom: 1px solid ${borderColor}; transition: background 0.15s; }
        .si-dropdown-item:hover { background: ${isDark ? '#2d3248' : '#f1f5f9'}; }
        .si-dropdown-item:last-child { border-bottom: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .si-animate { animation: fadeIn 0.2s ease-out; }
        @media (max-width: 768px) { .si-responsive-grid { grid-template-columns: 1fr !important; } }
        .si-scroll::-webkit-scrollbar { width: 4px; }
        .si-scroll::-webkit-scrollbar-thumb { background: ${borderColor}; border-radius: 4px; }
        .si-pulse { animation: pulse 2s ease-in-out 1; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }} ref={formRef}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: '0.75rem' }}>
          <div className="d-flex align-items-center gap-3">
            <button onClick={handleBack} className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: textColor, border: `1px solid ${borderColor}`, transition: 'all 0.2s' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.85rem' }} />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>ACCOUNTING / ERP</span>
                {draftSaved && <span className="si-pulse" style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 600 }}>Draft Saved</span>}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.2 }}>{isEditing ? 'Edit Sales Invoice' : 'New Sales Invoice'}</h1>
              <p style={{ fontSize: '0.78rem', color: mutedColor, margin: '0.25rem 0 0 0', maxWidth: 600 }}>
                {isEditing ? 'Edit this sales invoice. Update line items, customer details, and financial information as needed.' : 'Create a customer invoice. Posting this invoice will debit Accounts Receivable and credit Revenue / Sales Accounts while applying taxes and inventory movements where applicable.'}
              </p>
            </div>
          </div>
          <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
            <button onClick={handleSaveDraftFn}
              className="btn btn-sm d-flex align-items-center gap-1 px-3"
              style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faSave} /> Save Draft
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn btn-sm d-flex align-items-center gap-1 px-3 border-0 text-white"
              style={{ borderRadius: '10px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={submitting ? faSync : faSave} spin={submitting} /> {submitting ? (isEditing ? 'Updating...' : 'Posting...') : isEditing ? 'Update Invoice' : 'Save & Post Invoice'}
            </button>
            <button onClick={handleBack} className="btn btn-sm d-flex align-items-center gap-1 px-3"
              style={{ borderRadius: '10px', background: isDark ? '#2d3248' : '#ffffff', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '0.65rem', color: mutedColor }}>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+S: Draft</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Ctrl+Enter: Post</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Alt+N: New#</span>
          <span><FontAwesomeIcon icon={faKeyboard} className="me-1" />Alt+C: Customer</span>
        </div>

        <div className="si-nav-tabs mb-4">
          {NAV_TABS.map(tab => (
            <button key={tab.id} className={`si-nav-tab ${tab.id === 'erp_sales_invoices' ? 'active' : ''}`}
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
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Customer & Invoice Information</h6>
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
                  <input ref={customerInputRef}
                    style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                    className="si-input"
                    placeholder="Search by name, code, phone, NTN, STRN, email..."
                    value={customerSearch}
                    onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); setSelectedCustomer(null); }}
                    onFocus={() => { setShowCustomerDropdown(true); setCustomerDropdownTab('list'); }}
                    onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 250)}
                  />
                  <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.75rem' }} />
                  {showCustomerDropdown && (
                    <div className="si-dropdown si-animate si-scroll" style={{ maxHeight: 420, width: '100%' }}>
                      {customerDropdownTab === 'list' && (
                        <>
                          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.65rem', color: mutedColor, borderBottom: `1px solid ${borderColor}`, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{filteredCustomers.length} Customers</span>
                            <span style={{ fontSize: '0.6rem', color: mutedColor, fontWeight: 400 }}>Scroll for more</span>
                          </div>
                          {filteredCustomers.slice(0, 50).map(cust => (
                            <div key={cust.id} className="si-dropdown-item" onMouseDown={() => selectCustomer(cust)}
                              style={{ opacity: cust.status === 'Credit Hold' || cust.status === 'Inactive' ? 0.6 : 1 }}>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', fontFamily: "'JetBrains Mono', monospace" }}>{cust.code}</span>
                                    {cust.status !== 'Active' && (
                                      <span style={{ fontSize: '0.55rem', padding: '1px 6px', borderRadius: '4px', background: dangerBg, color: dangerColor, fontWeight: 600 }}>{cust.status}</span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>{cust.name}</div>
                                  <div style={{ fontSize: '0.62rem', color: mutedColor, marginTop: 2 }}>
                                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: 3, fontSize: '0.55rem' }} />{cust.phone} | <FontAwesomeIcon icon={faEnvelopeIcon} style={{ marginRight: 3, fontSize: '0.55rem' }} />{cust.email}
                                  </div>
                                  <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 1 }}>
                                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: 3, fontSize: '0.5rem' }} />{cust.group} | NTN: {cust.ntn || 'N/A'} | {cust.currency}
                                  </div>
                                  <div className="d-flex gap-3 mt-1" style={{ fontSize: '0.6rem' }}>
                                    <span style={{ color: '#10b981' }}>Limit: {cust.creditLimit > 0 ? `$${cust.creditLimit.toLocaleString()}` : 'Unlimited'}</span>
                                    <span style={{ color: '#f59e0b' }}>O/S: ${cust.outstanding.toLocaleString()}</span>
                                    <span style={{ color: '#6366f1' }}>Avail: ${(cust.creditLimit - cust.outstanding).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="text-end" style={{ flexShrink: 0 }}>
                                  <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', background: cust.status === 'Active' ? successBg : (cust.status === 'Credit Hold' ? warningBg : dangerBg), color: cust.status === 'Active' ? successColor : (cust.status === 'Credit Hold' ? warningColor : dangerColor), fontWeight: 600 }}>{cust.status}</span>
                                  <div style={{ fontSize: '0.55rem', color: mutedColor, marginTop: 4 }}>Rating: {'★'.repeat(cust.rating)}{'☆'.repeat(5 - cust.rating)}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {filteredCustomers.length === 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: mutedColor }}>No customers found.</div>
                          )}
                          <div style={{ borderTop: `1px solid ${borderColor}`, padding: '0.4rem 0.5rem', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {[
                              { icon: faPlus, label: 'Add', color: '#10b981' },
                              { icon: faEye, label: 'View', color: '#6366f1' },
                              { icon: faEdit, label: 'Edit', color: '#f59e0b' },
                              { icon: faRefresh, label: 'Refresh', color: '#8b5cf6' },
                              { icon: faExternalLinkAlt, label: 'Ledger', color: '#06b6d4' },
                              { icon: faShieldHalved, label: 'Validate', color: '#f43f5e' },
                            ].map(action => (
                              <button key={action.label} onMouseDown={(e) => { e.preventDefault(); addNotification?.(`${action.label} Customer clicked (Mock)`, 'info'); }}
                                style={{ padding: '3px 8px', fontSize: '0.6rem', borderRadius: '6px', background: 'transparent', color: action.color, border: `1px solid ${action.color}20`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <FontAwesomeIcon icon={action.icon} style={{ fontSize: '0.5rem' }} /> {action.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {(errors.customer || liveErrors.customer) && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 4 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{errors.customer || liveErrors.customer}</div>}
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label style={labelStyle}>Billing Address</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} className="si-input"
                    value={selectedCustomer ? billingAddress : ''}
                    onChange={e => setBillingAddress(e.target.value)}
                    placeholder="Billing address..." readOnly={!selectedCustomer} />
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Shipping Address</label>
                    <label className="d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', color: mutedColor, cursor: 'pointer' }}>
                      <input type="checkbox" checked={sameAsBilling} onChange={e => setSameAsBilling(e.target.checked)}
                        style={{ accentColor: '#6366f1' }} />
                      Same as Billing
                    </label>
                  </div>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} className="si-input"
                    value={sameAsBilling ? billingAddress : shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    placeholder="Shipping address..." readOnly={sameAsBilling || !selectedCustomer} />
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faBoxesStacked} style={{ color: '#10b981', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Invoice Line Items</h6>
                <button onClick={addLine} className="btn btn-sm d-flex align-items-center gap-1 ms-auto border-0 text-white"
                  style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.7rem', padding: '0.35rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faPlus} /> Add Line
                </button>
              </div>

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
                        <td style={{ padding: '0.35rem 0.5rem' }}>
                          <div className="position-relative">
                            <input
                              style={{ ...inputStyle, fontSize: '0.72rem', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                              className="si-input"
                              placeholder="Search product..."
                              value={line.productName}
                              onFocus={() => setShowProductSearch(line.id)}
                              onChange={e => { setShowProductSearch(line.id); setProductSearch(e.target.value); updateLine(line.id, 'productName', e.target.value); }}
                              readOnly={false}
                            />
                            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.65rem' }} />
                            {showProductSearch === line.id && (
                              <div className="si-dropdown si-animate" style={{ maxHeight: 240 }}>
                                <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.6rem', color: mutedColor, borderBottom: `1px solid ${borderColor}`, fontWeight: 600 }}>
                                  {filteredProducts.length} Products
                                </div>
                                {filteredProducts.map(p => (
                                  <div key={p.id} className="si-dropdown-item" style={{ padding: '0.4rem 0.75rem' }} onMouseDown={() => selectProduct(line.id, p)}>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: textColor }}>{p.name}</div>
                                        <div style={{ fontSize: '0.6rem', color: mutedColor }}>{p.code} | {p.uom}</div>
                                      </div>
                                      <div className="text-end" style={{ fontSize: '0.7rem', fontWeight: 600, color: textColor }}>
                                        ${p.rate.toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.35rem 0.5rem' }}>
                          <input style={{ ...inputStyle, fontSize: '0.72rem', padding: '0.35rem 0.5rem', textAlign: 'center' }} className="si-input" value={line.uom} onChange={e => updateLine(line.id, 'uom', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.5rem' }}>
                          <input type="number" style={{ ...inputStyle, fontSize: '0.72rem', padding: '0.35rem 0.5rem', textAlign: 'right' }} className="si-input" value={line.qty} min="0" step="1" onChange={e => updateLine(line.id, 'qty', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.5rem' }}>
                          <input type="number" style={{ ...inputStyle, fontSize: '0.72rem', padding: '0.35rem 0.5rem', textAlign: 'right' }} className="si-input" value={line.rate} min="0" step="0.01" onChange={e => updateLine(line.id, 'rate', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.5rem' }}>
                          <input type="number" style={{ ...inputStyle, fontSize: '0.72rem', padding: '0.35rem 0.5rem', textAlign: 'right' }} className="si-input" value={line.discount} min="0" max="100" step="0.1" onChange={e => updateLine(line.id, 'discount', e.target.value)} />
                        </td>
                        <td style={{ padding: '0.35rem 0.5rem' }}>
                          <select style={{ ...inputStyle, fontSize: '0.72rem', padding: '0.35rem 0.5rem', textAlign: 'right' }} className="si-input" value={line.tax} onChange={e => updateLine(line.id, 'tax', e.target.value)}>
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="8">8%</option>
                            <option value="10">10%</option>
                            <option value="13">13%</option>
                            <option value="16">16%</option>
                            <option value="18">18%</option>
                            <option value="25">25%</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.35rem 0.5rem', textAlign: 'right', fontWeight: 700, fontSize: '0.75rem', color: textColor, whiteSpace: 'nowrap' }}>
                          ${(line.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.35rem 0.25rem', textAlign: 'center' }}>
                          <button onClick={() => removeLine(line.id)} className="btn btn-sm border-0"
                            style={{ color: '#ef4444', padding: '2px 6px', borderRadius: '6px', opacity: lines.length > 1 ? 1 : 0.3 }}
                            disabled={lines.length <= 1}>
                            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.7rem' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(errors.lines || liveErrors.lines) && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 8 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{errors.lines || liveErrors.lines}</div>}

              <div className="row g-2 mt-3">
                <div className="col-md-6">
                  <label style={labelStyle}>Customer Notes / Remarks</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.75rem' }} className="si-input"
                    placeholder="Internal notes, delivery instructions, or special terms..."
                    value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <div style={{ background: isDark ? '#1e2235' : '#f8fafc', borderRadius: '10px', padding: '1rem', border: `1px solid ${borderColor}` }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.7rem', color: mutedColor }}>Subtotal</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.7rem', color: mutedColor }}>Discount Total</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>-${totals.discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.7rem', color: mutedColor }}>Tax Total</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>${totals.taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.7rem', color: mutedColor }}>Shipping Charges</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor }}>${totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <hr style={{ borderColor, margin: '0.5rem 0' }} />
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor }}>Grand Total</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#6366f1' }}>${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  {(errors.creditLimit || liveErrors.creditLimit) && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 8 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{errors.creditLimit || liveErrors.creditLimit}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faHashtag} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Invoice Details</h6>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faTag} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Invoice Number
                </label>
                <div className="d-flex align-items-center gap-1">
                  <input style={{ ...inputStyle, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", flex: 1 }} className="si-input"
                    value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                  <button onClick={() => setInvoiceNumber(generateInvoiceNumber())} className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
                    style={{ width: 34, height: 34, borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: mutedColor, flexShrink: 0 }}
                    title="Generate new number">
                    <FontAwesomeIcon icon={faSync} style={{ fontSize: '0.7rem' }} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Invoice Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="date" style={inputStyle} className="si-input" value={invoiceDate} onChange={e => { setInvoiceDate(e.target.value); addAuditLog('invoiceDate', invoiceDate, e.target.value); }} />
                {(errors.invoiceDate || liveErrors.invoiceDate) && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 4 }}>{errors.invoiceDate || liveErrors.invoiceDate}</div>}
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Due Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="date" style={inputStyle} className="si-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                {dueDays >= 0 && <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 2 }}>Due in {dueDays} days</div>}
                {(errors.dueDate || liveErrors.dueDate) && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: 4 }}>{errors.dueDate || liveErrors.dueDate}</div>}
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Status
                </label>
                <select style={inputStyle} className="si-input" value={status} onChange={e => { addAuditLog('status', status, e.target.value); setStatus(e.target.value); }}>
                  <option value="Draft">Draft</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Posted">Posted</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Void">Void</option>
                </select>
                <div className="d-inline-flex align-items-center gap-1 mt-2" style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600, background: sc.bg, color: sc.color }}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '0.55rem' }} /> {status}
                </div>
                {status === 'Void' && <div style={{ fontSize: '0.6rem', color: '#ef4444', marginTop: 2 }}>Creates reversing journal entry</div>}
                {status === 'Posted' && <div style={{ fontSize: '0.6rem', color: '#f59e0b', marginTop: 2 }}>Read-only after posting</div>}
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Payment Terms
                </label>
                <select style={inputStyle} className="si-input" value={paymentTerms} onChange={e => handlePaymentTermsChange(e.target.value)}>
                  {PAYMENT_TERMS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faUserTie} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Sales Representative
                </label>
                <select style={inputStyle} className="si-input" value={salesRep || ''} onChange={e => setSalesRep(e.target.value)}>
                  <option value="">Select sales rep...</option>
                  {SALES_REPS.map(r => <option key={r.id} value={r.name}>{r.name} ({r.department})</option>)}
                </select>
                {salesRep && (
                  <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 2 }}>
                    {SALES_REPS.find(r => r.name === salesRep)?.department} | Comm: {SALES_REPS.find(r => r.name === salesRep)?.commission}% | {SALES_REPS.find(r => r.name === salesRep)?.region}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faStore} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Branch
                </label>
                <select style={inputStyle} className="si-input" value={branch} onChange={e => setBranch(e.target.value)}>
                  <option value="Main Branch">Main Branch</option>
                  <option value="Gotham Branch">Gotham Branch</option>
                  <option value="NY Branch">NY Branch</option>
                  <option value="International Branch">International Branch</option>
                </select>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faWarehouse} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Warehouse
                </label>
                <select style={inputStyle} className="si-input" value={warehouse} onChange={e => setWarehouse(e.target.value)}>
                  {WAREHOUSES.map(w => <option key={w.id} value={w.name}>{w.name} ({w.code})</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Reference (PO / Contract #)
                </label>
                <input style={inputStyle} className="si-input" placeholder="e.g. PO-2026-0042" value={reference} onChange={e => setReference(e.target.value)} />
                {liveErrors.reference && <div style={{ fontSize: '0.65rem', color: '#f59e0b', marginTop: 2 }}><FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />{liveErrors.reference}</div>}
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faPercent} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Tax Method
                </label>
                <select style={inputStyle} className="si-input" value={taxMethod} onChange={e => { addAuditLog('taxMethod', taxMethod, e.target.value); setTaxMethod(e.target.value); }}>
                  <option value="Exclusive">Exclusive</option>
                  <option value="Inclusive">Inclusive</option>
                  <option value="No Tax">No Tax</option>
                  <option value="Manual">Manual</option>
                </select>
                <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 2 }}>
                  {taxMethod === 'Exclusive' ? 'Tax added after subtotal' :
                   taxMethod === 'Inclusive' ? 'Tax included in entered price' :
                   taxMethod === 'No Tax' ? 'No tax calculation applied' :
                   'Manual tax entry'}
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faTruck} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Shipping / Other Charges
                </label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: inputBg, border: `1px solid ${inputBorder}`, borderRight: 'none', borderRadius: '8px 0 0 8px', color: mutedColor, fontSize: '0.75rem' }}>$</span>
                  <input type="number" style={{ ...inputStyle, borderRadius: '0 8px 8px 0' }} className="si-input" value={shippingCharges} min="0" step="0.01" onChange={e => setShippingCharges(parseFloat(e.target.value) || 0)} />
                </div>
                <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 2 }}>Freight, delivery, insurance, packaging, or miscellaneous charges</div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>
                  <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: 4, fontSize: '0.65rem' }} />
                  Currency
                </label>
                <div className="d-flex align-items-center gap-2" style={{ padding: '0.5rem 0.75rem', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', fontSize: '0.8rem', color: textColor }}>
                  <FontAwesomeIcon icon={faGlobe} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 600 }}>{currency} - {currency === 'USD' ? 'US Dollar' : currency === 'EUR' ? 'Euro' : currency === 'GBP' ? 'British Pound' : 'Pakistani Rupee'}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: mutedColor }}>{currency === 'USD' ? 'Base Currency' : `Rate: ${exchangeRate}`}</span>
                </div>
              </div>
            </div>

            {selectedCustomer && (
              <div style={cardStyle}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#f59e0b', fontSize: '0.85rem' }} />
                  <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Customer Financial Summary</h6>
                  <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: '100px', fontSize: '0.55rem', fontWeight: 700, ...riskColor(selectedCustomer.riskLevel) }}>
                    {selectedCustomer.riskLevel} Risk
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem' }}>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Customer</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.name}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Code</span><span style={{ fontWeight: 600, color: textColor, fontFamily: "'JetBrains Mono', monospace" }}>{selectedCustomer.code}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Type</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.type}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Group</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.group}</span></div>
                  <hr style={{ borderColor, margin: '0.35rem 0' }} />
                  <div className="d-flex justify-content-between py-1">
                    <span style={{ color: mutedColor }}>Credit Limit</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{selectedCustomer.creditLimit > 0 ? `$${selectedCustomer.creditLimit.toLocaleString()}` : 'Unlimited'}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span style={{ color: mutedColor }}>Outstanding Balance</span>
                    <span style={{ fontWeight: 600, color: '#f59e0b' }}>${selectedCustomer.outstanding.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span style={{ color: mutedColor }}>Available Credit</span>
                    <span style={{ fontWeight: 700, color: availableCredit > 0 ? '#10b981' : '#ef4444' }}>{Number.isFinite(availableCredit) ? `$${availableCredit.toLocaleString()}` : 'Unlimited'}</span>
                  </div>
                  {creditExceeded && (
                    <div style={{ padding: '4px 8px', borderRadius: '6px', background: dangerBg, color: dangerColor, fontSize: '0.65rem', fontWeight: 600, marginTop: 4 }}>
                      <FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />Credit Limit Exceeded
                    </div>
                  )}
                  <hr style={{ borderColor, margin: '0.35rem 0' }} />
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Last Payment</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.lastPaymentDate}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Last Invoice</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.lastInvoiceDate}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Total Sales</span><span style={{ fontWeight: 600, color: textColor }}>${selectedCustomer.totalSales.toLocaleString()}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Avg Payment Days</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.avgPaymentDays} days</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Customer Since</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.customerSince}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Salesperson</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.salesperson}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Terms</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.terms}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Tax Number</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.ntn || 'N/A'}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>STRN</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.strn || 'N/A'}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Price List</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.priceList}</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Default Disc.</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.discount}%</span></div>
                  <div className="d-flex justify-content-between py-1"><span style={{ color: mutedColor }}>Currency</span><span style={{ fontWeight: 600, color: textColor }}>{selectedCustomer.currency}</span></div>
                </div>
              </div>
            )}

            <div style={cardStyle}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faStamp} style={{ color: '#8b5cf6', fontSize: '0.85rem' }} />
                <h6 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: textColor }}>Actions</h6>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button onClick={handleSaveDraftFn} className="btn btn-sm d-flex align-items-center gap-1 border-0 text-white"
                  style={{ borderRadius: '8px', background: '#6366f1', fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faSave} /> Save Draft
                </button>
                <button onClick={() => addNotification?.('Print preview opened.', 'info')} className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faPrint} /> Print
                </button>
                <button onClick={() => addNotification?.('PDF generated.', 'success')} className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faFilePdf} /> PDF
                </button>
                <button onClick={() => addNotification?.('Email dialog opened.', 'info')} className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </button>
                <button onClick={() => addNotification?.('Invoice duplicated.', 'info')} className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: mutedColor, border: `1px solid ${borderColor}`, fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faCopy} /> Duplicate
                </button>
                <button onClick={() => setShowAuditLog(!showAuditLog)} className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ borderRadius: '8px', background: showAuditLog ? '#6366f1' : (isDark ? '#2d3248' : '#f1f5f9'), color: showAuditLog ? '#fff' : mutedColor, border: `1px solid ${showAuditLog ? '#6366f1' : borderColor}`, fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faHistory} /> Audit Log
                </button>
              </div>
              {showAuditLog && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: isDark ? '#1e2235' : '#f8fafc', border: `1px solid ${borderColor}`, maxHeight: 200, overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: mutedColor, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Audit Trail</div>
                  {auditLog.length === 0 && <div style={{ fontSize: '0.65rem', color: mutedColor }}>No changes tracked yet.</div>}
                  {auditLog.map((log, i) => (
                    <div key={i} style={{ fontSize: '0.62rem', padding: '3px 0', borderBottom: i < auditLog.length - 1 ? `1px solid ${borderColor}` : 'none', color: mutedColor }}>
                      <span style={{ color: textColor, fontWeight: 600 }}>{log.field}</span>: {log.oldValue ? `"${log.oldValue}" → ` : ''}"{log.newValue}"
                      <span style={{ marginLeft: 6, fontSize: '0.55rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpCreateSalesInvoice;
