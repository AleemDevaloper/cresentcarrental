import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApp } from '../../../hooks/useApp';
import {
  faArrowRight,
  faBoxesStacked,
  faCashRegister,
  faChartLine,
  faCheck,
  faCreditCard,
  faReceipt,
  faRotateLeft,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { fetchPosProducts } from '../../../utils/posProducts';
import { loadEntityList } from '../../../utils/moduleEntityStore';
import ErpPosSalesScreen from '../FMS/ERP/ErpPosSalesScreen';
import ErpPosInvoicesReceipts from '../FMS/ERP/ErpPosInvoicesReceipts';
import PosReferencePage from './PosReferencePage';
import '../../../styles/Pages/pos.scss';

const money = (value) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
const titleize = (value) => String(value || '').replace(/^pos_/, '').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const fallbackProducts = [
  { id: 'pos-1001', name: 'Everyday Coffee', sku: 'COF-001', category: 'Beverages', price: 4.5, stock: 42, tax: 8 },
  { id: 'pos-1002', name: 'Canvas Tote Bag', sku: 'ACC-014', category: 'Accessories', price: 18, stock: 18, tax: 8 },
  { id: 'pos-1003', name: 'House Blend Beans', sku: 'COF-022', category: 'Beverages', price: 15.75, stock: 27, tax: 8 },
  { id: 'pos-1004', name: 'Ceramic Mug', sku: 'ACC-008', category: 'Accessories', price: 12, stock: 7, tax: 8 },
  { id: 'pos-1005', name: 'Breakfast Sandwich', sku: 'FOO-003', category: 'Food', price: 8.25, stock: 12, tax: 0 },
];

const entitySeeds = {
  pos_categories: [{ id: 'cat-1', name: 'Beverages', products: 2, status: 'Active' }, { id: 'cat-2', name: 'Accessories', products: 2, status: 'Active' }, { id: 'cat-3', name: 'Food', products: 1, status: 'Active' }],
  pos_customers: [{ id: 'cus-1', name: 'Walk-in Customer', email: 'walkin@example.com', purchases: 24, status: 'Active' }, { id: 'cus-2', name: 'Maya Chen', email: 'maya@example.com', purchases: 9, status: 'Active' }],
  pos_vendors: [{ id: 'ven-1', name: 'Northstar Supply', contact: 'orders@northstar.test', status: 'Active' }],
  pos_registers: [{ id: 'reg-1', name: 'Front Counter', branch: 'Main Branch', status: 'Open' }],
  pos_branches: [{ id: 'br-1', name: 'Main Branch', address: 'Central Avenue', status: 'Active' }],
  pos_staff: [{ id: 'staff-1', name: 'Alex Morgan', role: 'Cashier', status: 'Active' }],
};

const entityConfig = {
  pos_products: { title: 'Products', description: 'Manage the sellable catalog used by this POS workspace.', columns: ['name', 'sku', 'category', 'price', 'stock'] },
  pos_categories: { title: 'Categories', description: 'Organize products for fast checkout and reporting.', columns: ['name', 'products', 'status'] },
  pos_customers: { title: 'Customers', description: 'Maintain customer profiles, purchase history, and loyalty context.', columns: ['name', 'email', 'purchases', 'status'] },
  pos_vendors: { title: 'Vendors', description: 'Track suppliers and purchasing contacts for this POS.', columns: ['name', 'contact', 'status'] },
  pos_registers: { title: 'Registers', description: 'Configure checkout registers and their branch assignments.', columns: ['name', 'branch', 'status'] },
  pos_branches: { title: 'Branches', description: 'Manage retail locations served by the POS workspace.', columns: ['name', 'address', 'status'] },
  pos_staff: { title: 'Staff', description: 'Control cashier profiles and operational access.', columns: ['name', 'role', 'status'] },
};

const featureConfigs = Object.fromEntries([
  ['pos_price_lists', 'Price Lists', 'Maintain POS price books and branch-specific selling prices.', ['name', 'scope', 'status']],
  ['pos_discount_rules', 'Discount Rules', 'Configure controlled percentage and fixed retail discounts.', ['name', 'type', 'status']],
  ['pos_coupons', 'Coupons', 'Manage coupon codes, limits, validity, and redemption state.', ['name', 'code', 'status']],
  ['pos_label_templates', 'Label Templates', 'Maintain barcode and shelf-label print templates.', ['name', 'format', 'status']],
  ['pos_stock_on_hand', 'Stock On Hand', 'Review the POS catalog stock projection by location.', ['name', 'location', 'quantity', 'status']],
  ['pos_stock_movements', 'Stock Movements', 'Review POS inventory movement events received through integration.', ['name', 'movement', 'status']],
  ['pos_stock_adjustments', 'Stock Adjustments', 'Record controlled POS stock correction requests.', ['name', 'reason', 'status']],
  ['pos_stock_transfers', 'Stock Transfers', 'Track store-to-store POS stock transfer requests.', ['name', 'destination', 'status']],
  ['pos_stock_counts', 'Stock Counts', 'Open and review POS stock count documents.', ['name', 'count_date', 'status']],
  ['pos_inventory_valuation', 'Inventory Valuation', 'View POS catalog valuation snapshots.', ['name', 'value', 'status']],
  ['pos_low_stock', 'Low Stock Alerts', 'Review products below their POS reorder threshold.', ['name', 'on_hand', 'status']],
  ['pos_purchase_orders', 'Purchase Orders', 'Track POS purchasing requests and supplier commitments.', ['name', 'vendor', 'status']],
  ['pos_purchase_receipts', 'Purchase Receipts', 'Record POS supplier receipt references.', ['name', 'vendor', 'status']],
  ['pos_purchase_returns', 'Purchase Returns', 'Track supplier return requests and outcomes.', ['name', 'vendor', 'status']],
  ['pos_customer_groups', 'Customer Groups', 'Segment POS customers for pricing and promotions.', ['name', 'members', 'status']],
  ['pos_loyalty', 'Loyalty Program', 'Manage POS loyalty tiers and point activity.', ['name', 'points', 'status']],
  ['pos_gift_cards', 'Gift Cards', 'Track POS-owned gift card activation and balances.', ['name', 'balance', 'status']],
  ['pos_custom_fields', 'Custom Fields', 'Define additional POS customer and sale fields.', ['name', 'field_type', 'status']],
  ['pos_register_sessions', 'Register Sessions', 'Open, review, reconcile, and close cashier sessions.', ['name', 'cashier', 'status']],
  ['pos_counters', 'Counters', 'Assign POS counters and register numbering.', ['name', 'register', 'status']],
  ['pos_hardware', 'Hardware', 'Manage scanners, printers, and payment devices.', ['name', 'device_type', 'status']],
  ['pos_payment_methods', 'Payment Methods', 'Configure enabled POS tender methods.', ['name', 'method', 'status']],
  ['pos_sales_summary', 'Sales Summary', 'Review sales totals and receipt counts by period.', ['name', 'period', 'status']],
  ['pos_product_sales', 'Product Sales', 'Review product-level POS sales performance.', ['name', 'units', 'status']],
  ['pos_payment_summary', 'Payment Summary', 'Review collections by tender method.', ['name', 'amount', 'status']],
  ['pos_customer_sales', 'Customer Sales', 'Review customer purchase totals and activity.', ['name', 'amount', 'status']],
  ['pos_cashier_sales', 'Cashier Sales', 'Review cashier transaction and collection totals.', ['name', 'amount', 'status']],
  ['pos_tax_compliance', 'Tax Compliance', 'Review POS tax calculations and reporting readiness.', ['name', 'tax_amount', 'status']],
  ['pos_accounting_reconciliation', 'Accounting Reconciliation', 'Review POS-to-accounting integration batches.', ['name', 'batch_total', 'status']],
  ['pos_settings', 'POS Settings', 'Configure receipt, tax, numbering, and checkout defaults.', ['name', 'value', 'status']],
  ['pos_integrations', 'Integrations', 'Control optional INV, CRM, and accounting event modes.', ['name', 'mode', 'status']],
  ['pos_compliance', 'Compliance Documents', 'Manage POS compliance and fiscal document references.', ['name', 'document_type', 'status']],
  ['pos_roles', 'Roles & Permissions', 'Manage POS-specific role access and approval capabilities.', ['name', 'permissions', 'status']],
  ['pos_offline', 'Offline Operations', 'Review device cache and queued POS transaction state.', ['name', 'queued', 'status']],
].map(([id, title, description, columns]) => [id, { title, description, columns }]));

const posFeatureConfig = { ...entityConfig, ...featureConfigs };

const PosWorkspace = () => {
  const { activeTab: contextActiveTab, setActiveTab: setContextActiveTab } = useApp();
  const [products, setProducts] = useState(fallbackProducts);
  const [notice, setNotice] = useState('');

  const setActiveTab = (nextTab) => setContextActiveTab(nextTab);
  const activeTab = contextActiveTab?.startsWith('pos_') ? contextActiveTab : 'pos_overview';

  useEffect(() => {
    fetchPosProducts().then((rows) => { if (rows.length) setProducts(rows); }).catch(() => {});
  }, []);

  const entityRows = useMemo(() => {
    if (activeTab === 'pos_products') return products;
    if (posFeatureConfig[activeTab]) return loadEntityList('pos', activeTab, entitySeeds[activeTab] || []);
    return [];
  }, [activeTab, products]);

  const renderBilling = () => <div className="pos-reference-surface"><div className="pos-reference-section"><span className="pos-reference-badge">Sales desk</span><h2>Sales Studio</h2><p>Billing, sales receipts and return handling from POS-owned screens.</p><div className="pos-reference-tabs"><button className="is-active">POS Billing</button><button onClick={() => setActiveTab('pos_sales')}>Sales &amp; Receipts</button><button onClick={() => setActiveTab('pos_sale_returns')}>Sale Returns</button></div></div><ErpPosSalesScreen /></div>;

  const renderEntity = (config) => <PosReferencePage config={{ ...config, id: activeTab }} rows={entityRows} onCreate={(row) => { if (row?.id) setNotice(`${config.title} record selected.`); else document.querySelector('.pos-feature-search input')?.focus(); }} />;

  const renderOverview = () => <div className="pos-overview"><div className="pos-reference-hero"><div><span className="pos-reference-badge">Retail POS</span><h2>Retail POS Dashboard</h2><p>Live retail command center for sales, cash, registers, inventory alerts, staff shortcuts and operational performance.</p></div><div className="pos-hero-actions"><button onClick={() => setActiveTab('pos_billing')}>Start Sale</button><button onClick={() => setActiveTab('pos_invoices')}>Receipts</button><button onClick={() => setActiveTab('pos_low_stock')}>Low Stock</button></div></div><div className="pos-reference-tabs pos-main-tabs"><button className="is-active">Dashboard</button><button onClick={() => setActiveTab('pos_billing')}>Billing</button><button onClick={() => setActiveTab('pos_settings')}>Settings</button><button onClick={() => setActiveTab('pos_staff')}>Staff</button><button onClick={() => setActiveTab('pos_roles')}>Roles</button><button onClick={() => setActiveTab('pos_branches')}>Stores</button><button onClick={() => setActiveTab('pos_stock_on_hand')}>Warehouses</button><button onClick={() => setActiveTab('pos_registers')}>Counters</button><button onClick={() => setActiveTab('pos_hardware')}>Hardware</button></div><div className="pos-command-room"><div><span className="pos-reference-badge">Live operations</span><h2>Executive Retail POS Control Room</h2><p>Track today&apos;s store performance, active drawers, payment collections, stock risks and the team shortcuts needed to run a modern retail operation.</p><button className="pos-primary-action" onClick={() => setActiveTab('pos_billing')}>Start Sale <FontAwesomeIcon icon={faArrowRight} /></button></div><div className="pos-pulse-card"><span>Today sales pulse</span><strong>{money(4280.5)}</strong><div><b>Week sales<br />{money(4280.5)}</b><b>Month sales<br />{money(4280.5)}</b></div></div></div><div className="pos-kpi-grid">{[['Today\'s sales', money(4280.5), '+12.8%', faChartLine], ['Payments collected', money(4280.5), 'Live', faReceipt], ['Open registers', '03', money(1960), faCashRegister], ['Inventory value', money(1960), '05 low-stock', faBoxesStacked]].map(([label, value, change, icon]) => <div className="pos-kpi" key={label}><span className="pos-kpi-icon"><FontAwesomeIcon icon={icon} /></span><small>{label}</small><strong>{value}</strong><em>{change}</em></div>)}</div><div className="pos-dashboard-grid"><section className="pos-panel"><div className="pos-panel-heading"><div><span className="pos-eyebrow">Sales trend</span><h2>Last 7 days performance</h2></div><button className="pos-outline-action" onClick={() => setActiveTab('pos_sales_summary')}>Sales Summary</button></div><div className="pos-chart-bars">{['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((day, index) => <div key={day}><span style={{ height: `${32 + index * 9}px` }} /> <b>{day}</b><small>{money(index * 610)}</small></div>)}</div></section><section className="pos-panel"><div className="pos-panel-heading"><div><span className="pos-eyebrow">Tender mix</span><h2>Payment methods</h2></div><FontAwesomeIcon icon={faCreditCard} className="pos-muted-icon" /></div><div className="pos-empty pos-empty-compact">Cash {money(1960)} · Card {money(2320)}<br /><small>Collections split by method for the last 7 days.</small></div></section></div></div>;

  const content = activeTab === 'pos_billing' ? renderBilling() : activeTab === 'pos_invoices' || activeTab === 'pos_sales' ? <div className="pos-reference-surface"><div className="pos-reference-section"><span className="pos-reference-badge">Sales &amp; receipts</span><h2>POS Sales &amp; Receipts</h2><p>Search completed POS transactions, inspect receipts and manage return-ready sales.</p></div><ErpPosInvoicesReceipts /></div> : activeTab === 'pos_overview' ? renderOverview() : posFeatureConfig[activeTab] ? renderEntity(posFeatureConfig[activeTab]) : <section className="pos-reference-surface"><div className="pos-reference-section"><span className="pos-reference-badge">Retail POS</span><h2>{titleize(activeTab)}</h2><p>This feature is not yet backed by a dedicated POS endpoint.</p></div><section className="pos-panel pos-placeholder"><button className="pos-secondary-action" onClick={() => setActiveTab('pos_billing')}>Return to billing <FontAwesomeIcon icon={faArrowRight} /></button></section></section>;
  return <div className="pos-workspace">{notice && <div className="pos-notice"><FontAwesomeIcon icon={faCheck} /> {notice}<button onClick={() => setNotice('')}><FontAwesomeIcon icon={faRotateLeft} /></button></div>}<header className="pos-page-header"><div><span className="pos-eyebrow">Independent commerce workspace</span><h1>{activeTab === 'pos_overview' ? 'POS control room' : titleize(activeTab)}</h1></div><div className="pos-header-meta"><span><FontAwesomeIcon icon={faUser} /> Alex Morgan</span><span><FontAwesomeIcon icon={faCashRegister} /> Register 01</span></div></header>{content}</div>;
};

export default PosWorkspace;