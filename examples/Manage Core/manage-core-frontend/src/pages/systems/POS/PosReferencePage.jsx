import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faDownload,
  faFilter,
  faMagnifyingGlass,
  faPlus,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';

const titleize = (value) => String(value || '').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const sectionTabs = {
  catalog: ['Products', 'Categories', 'Units', 'Brands', 'Attributes', 'Custom Fields', 'Label Templates'],
  customers: ['Customers', 'Customer Groups', 'Price Lists', 'Discount Rules', 'Loyalty', 'Gift Cards', 'Coupons & Promotions'],
  inventory: ['Stock On Hand', 'Stock Movements', 'Stock Adjustments', 'Stock Count', 'Stock Transfers', 'In-Transit Stock', 'Stock Valuation', 'Low Stock Alerts'],
  purchasing: ['Vendors', 'Purchase Orders', 'Purchase Receipts / GRNs', 'Purchase Returns', 'Purchase Reports', 'Purchase Summary Report'],
  reports: ['Sales Report', 'Sales Summary', 'Product Sales', 'Category Sales', 'Margin Report', 'Branch Sales', 'Cashier Sales', 'Sale Return Report'],
  operations: ['Retail POS Settings', 'Branches / Stores', 'Warehouses', 'Counters / Registers', 'Hardware Profiles'],
  compliance: ['Offline Queue', 'Digital Invoicing', 'Tax Compliance Report', 'Accounting Reconciliation'],
};

const groupFor = (id) => {
  if (id.includes('customer') || id.includes('loyalty') || id.includes('gift') || id.includes('coupon')) return 'customers';
  if (id.includes('stock') || id.includes('inventory')) return 'inventory';
  if (id.includes('purchase') || id.includes('vendor')) return 'purchasing';
  if (id.includes('report') || id.includes('sales_') || id.includes('payment_summary') || id.includes('cashier')) return 'reports';
  if (id.includes('register') || id.includes('branch') || id.includes('counter') || id.includes('hardware') || id.includes('settings')) return 'operations';
  if (id.includes('offline') || id.includes('compliance') || id.includes('accounting')) return 'compliance';
  return 'catalog';
};

const PosReferencePage = ({ config, rows, onCreate }) => {
  const [search, setSearch] = useState('');
  const group = groupFor(config.id);
  const filteredRows = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const columns = config.columns || ['name', 'status'];
  const featureName = config.title;
  const hasRows = filteredRows.length > 0;

  return (
    <section className="pos-reference-page">
      <header className="pos-feature-hero">
        <div>
          <span className="pos-reference-badge">Retail POS</span>
          <h2>{featureName}</h2>
          <p>{config.description}</p>
        </div>
        <button className="pos-feature-hero-action" onClick={onCreate}><FontAwesomeIcon icon={faPlus} /> New {featureName.replace(/s$/, '')}</button>
      </header>

      <section className="pos-reference-module">
        <div className="pos-module-heading"><div><span className="pos-eyebrow">{group === 'operations' ? 'Setup & Hardware' : titleize(group)}</span><h3>{group === 'operations' ? 'Setup Studio' : `${titleize(group)} Studio`}</h3><p>Manage retail POS records and controls from the POS-owned workspace.</p></div><span className="pos-ready-pill">READY</span></div>
        <div className="pos-section-tabs">{sectionTabs[group].map((label) => <button key={label} className={label.toLowerCase().includes(featureName.toLowerCase().split(' ')[0]) ? 'is-active' : ''}>{label}</button>)}</div>
      </section>

      <div className="pos-phase-banner"><strong>POS-only scope:</strong> This surface is tenant-scoped and remains independent from AMS and INV. Server-backed actions are enabled only when the corresponding POS contract is available.</div>

      <div className="pos-feature-kpis"><div><small>Total</small><strong>{rows.length}</strong><span>POS records</span></div><div><small>Showing</small><strong>{filteredRows.length}</strong><span>Filtered records</span></div><div><small>Active</small><strong>{rows.filter((row) => row.status === 'Active' || !row.status).length}</strong><span>Ready records</span></div><div><small>Scope</small><strong>POS</strong><span>Independent</span></div></div>

      <section className="pos-feature-table-panel">
        <div className="pos-feature-controls"><div className="pos-feature-search"><FontAwesomeIcon icon={faMagnifyingGlass} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${featureName.toLowerCase()}`} /></div><button className="pos-outline-action"><FontAwesomeIcon icon={faFilter} /> Filters</button><button className="pos-outline-action" onClick={() => setSearch('')}><FontAwesomeIcon icon={faRotate} /> Reset</button></div>
        <div className="pos-export-bar"><div><strong>Export</strong><small>Current filtered table view</small></div><div><button className="pos-export-button"><FontAwesomeIcon icon={faDownload} /> Excel</button><button className="pos-export-button pos-export-pdf">PDF</button></div></div>
        <div className="pos-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{titleize(column)}</th>)}<th>Actions</th></tr></thead><tbody>{hasRows ? filteredRows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column}>{column === 'status' ? <span className="pos-status-pill">{row[column] || 'Active'}</span> : row[column] ?? '-'}</td>)}<td><button className="pos-row-action" onClick={() => onCreate(row)}><FontAwesomeIcon icon={faArrowRight} /></button></td></tr>) : <tr><td colSpan={columns.length + 1}><div className="pos-table-empty"><strong>No {featureName.toLowerCase()} found.</strong><span>Create a POS record or adjust the filters to continue.</span></div></td></tr>}</tbody></table></div>
        <footer className="pos-table-footer"><span>Showing {filteredRows.length} results</span><select defaultValue="30" aria-label="Rows per page"><option value="30">30</option><option value="50">50</option><option value="100">100</option></select><span>entries</span></footer>
      </section>
    </section>
  );
};

export default PosReferencePage;
