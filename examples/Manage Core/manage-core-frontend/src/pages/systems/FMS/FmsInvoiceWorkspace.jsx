import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faDownload,
  faEye,
  faFileCsv,
  faFileExport,
  faFileImport,
  faFileInvoiceDollar,
  faFilter,
  faPaperPlane,
  faPlus,
  faPrint,
  faRotate,
  faSearch,
  faTrashCan,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const STORAGE_KEY = 'manage_core_fms_invoices';



const emptyForm = {
  customer: '',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  reference: '',
  salesOrder: '',
  project: '',
  currency: 'USD',
  total: '',
  paid: '0',
  status: 'Draft',
  approval: 'Draft',
  createdBy: '',
};

const columns = ['number', 'customer', 'invoiceDate', 'dueDate', 'reference', 'salesOrder', 'project', 'currency', 'total', 'paid', 'status', 'approval', 'createdBy', 'createdDate'];
const lifecycleTabs = ['All', 'Draft', 'Pending Approval', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const statusClass = (status) => ({
  Draft: 'bg-secondary',
  'Pending Approval': 'bg-warning text-dark',
  Sent: 'bg-info text-dark',
  'Partially Paid': 'bg-primary',
  Paid: 'bg-success',
  Overdue: 'bg-danger',
  Cancelled: 'bg-dark',
  Approved: 'bg-success',
}[status] || 'bg-light text-dark');

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const toCsv = (rows) => [
  columns.join(','),
  ...rows.map((invoice) => columns.map((column) => csvEscape(invoice[column])).join(',')),
].join('\n');

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseCsv = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = headers.reduce((invoice, header, cellIndex) => ({ ...invoice, [header]: values[cellIndex] || '' }), {});
    return normalizeInvoice(row, index);
  }).filter((invoice) => invoice.customer && invoice.total > 0);
};

const normalizeInvoice = (invoice, offset = 0) => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    number: invoice.number || nextInvoiceNumber(5 + offset),
    customer: invoice.customer || '',
    invoiceDate: invoice.invoiceDate || today,
    dueDate: invoice.dueDate || invoice.invoiceDate || today,
    reference: invoice.reference || '',
    salesOrder: invoice.salesOrder || '',
    project: invoice.project || '',
    currency: invoice.currency || 'USD',
    total: Number(invoice.total || 0),
    paid: Number(invoice.paid || 0),
    status: invoice.status || 'Draft',
    approval: invoice.approval || 'Draft',
    createdBy: invoice.createdBy || 'Finance Team',
    createdDate: invoice.createdDate || today,
  };
};

const nextInvoiceNumber = (count) => `INV-2026-${String(422 + count).padStart(4, '0')}`;

const FmsInvoiceWorkspace = ({ isDark, mode = 'manage' }) => {
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    getTabData('fms-invoice-workspace').then(res => {
      const data = res.data?.data || [];
      if (data.length) setInvoices(data);
    }).catch(() => {});
  }, []);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [previewRows, setPreviewRows] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => {
    const matchesTab = activeTab === 'All' || invoice.status === activeTab || invoice.approval === activeTab;
    const haystack = `${invoice.number} ${invoice.customer} ${invoice.project} ${invoice.reference} ${invoice.salesOrder}`.toLowerCase();
    return matchesTab && haystack.includes(searchTerm.toLowerCase());
  }), [activeTab, invoices, searchTerm]);

  const totals = useMemo(() => ({
    count: invoices.length,
    revenue: invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0),
    outstanding: invoices.reduce((sum, invoice) => sum + Math.max(Number(invoice.total || 0) - Number(invoice.paid || 0), 0), 0),
    overdue: invoices.filter((invoice) => invoice.status === 'Overdue').length,
  }), [invoices]);

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const createInvoice = (event) => {
    event.preventDefault();
    const invoice = normalizeInvoice({
      ...form,
      number: nextInvoiceNumber(invoices.length),
      createdDate: new Date().toISOString().slice(0, 10),
      createdBy: form.createdBy || 'Finance Team',
    });

    setInvoices((current) => [invoice, ...current]);
    setForm(emptyForm);
    setMessage(`${invoice.number} created successfully.`);
  };

  const importInvoices = () => {
    if (!previewRows.length) {
      setMessage('Select a CSV file with invoice rows first.');
      return;
    }

    const existingNumbers = new Set(invoices.map((invoice) => invoice.number));
    const imported = previewRows.map((invoice, index) => ({
      ...invoice,
      number: existingNumbers.has(invoice.number) ? nextInvoiceNumber(invoices.length + index) : invoice.number,
    }));

    setInvoices((current) => [...imported, ...current]);
    setPreviewRows([]);
    setMessage(`${imported.length} invoice${imported.length === 1 ? '' : 's'} imported successfully.`);
  };

  const exportInvoices = (rows = filteredInvoices) => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fms-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`${rows.length} invoice${rows.length === 1 ? '' : 's'} exported.`);
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text);
    setPreviewRows(parsed);
    setMessage(parsed.length ? `${parsed.length} valid invoice rows ready to import.` : 'No valid invoice rows found.');
  };

  const deleteInvoice = (number) => {
    setInvoices((current) => current.filter((invoice) => invoice.number !== number));
    setMessage(`${number} deleted.`);
  };

  return (
    <div className={`invoice-center ${isDark ? 'text-white' : 'text-dark'}`}>
      {message && (
        <div className="alert alert-info border-0 shadow-sm d-flex justify-content-between align-items-center">
          <span>{message}</span>
          <button className="btn btn-sm btn-light" onClick={() => setMessage('')}>Close</button>
        </div>
      )}

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Invoices', value: totals.count, icon: faFileInvoiceDollar, color: '#2563eb' },
          { label: 'Total Revenue', value: formatCurrency(totals.revenue), icon: faCheckCircle, color: '#059669' },
          { label: 'Outstanding', value: formatCurrency(totals.outstanding), icon: faTriangleExclamation, color: '#d97706' },
          { label: 'Overdue', value: totals.overdue, icon: faRotate, color: '#ef4444' },
        ].map((metric) => (
          <div className="col-xl-3 col-sm-6" key={metric.label}>
            <div className={`card border-0 shadow-sm h-100 invoice-card ${isDark ? 'bg-dark text-white' : 'bg-white'}`}>
              <div className="card-body p-3 d-flex align-items-center justify-content-between gap-3">
                <div>
                  <div className="x-small text-muted text-uppercase fw-bold">{metric.label}</div>
                  <div className="fw-bold fs-4">{metric.value}</div>
                </div>
                <div className="invoice-icon" style={{ background: `${metric.color}18`, color: metric.color }}>
                  <FontAwesomeIcon icon={metric.icon} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(mode === 'generate' || mode === 'manage') && (
        <form className={`card border-0 shadow-sm invoice-card mb-4 ${isDark ? 'bg-dark text-white' : 'bg-white'}`} onSubmit={createInvoice}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">Generate Invoice</h5>
                <div className="small text-muted">Create an invoice record and add it to invoice management immediately.</div>
              </div>
              <span className="badge bg-primary rounded-pill">Next {nextInvoiceNumber(invoices.length)}</span>
            </div>

            <div className="row g-3">
              {[
                ['customer', 'Customer', 'text'],
                ['invoiceDate', 'Invoice Date', 'date'],
                ['dueDate', 'Due Date', 'date'],
                ['reference', 'Reference', 'text'],
                ['salesOrder', 'Sales Order', 'text'],
                ['project', 'Project', 'text'],
                ['currency', 'Currency', 'text'],
                ['total', 'Total Amount', 'number'],
                ['paid', 'Paid Amount', 'number'],
                ['createdBy', 'Created By', 'text'],
              ].map(([field, label, type]) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={field}>
                  <label className="form-label x-small fw-bold text-muted text-uppercase">{label}</label>
                  <input className="form-control form-control-sm bg-light border-0" type={type} value={form[field]} onChange={(event) => updateForm(field, event.target.value)} required={['customer', 'invoiceDate', 'dueDate', 'total'].includes(field)} />
                </div>
              ))}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <label className="form-label x-small fw-bold text-muted text-uppercase">Payment Status</label>
                <select className="form-select form-select-sm bg-light border-0" value={form.status} onChange={(event) => updateForm('status', event.target.value)}>
                  {lifecycleTabs.filter((tab) => tab !== 'All' && tab !== 'Pending Approval').map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6">
                <label className="form-label x-small fw-bold text-muted text-uppercase">Approval</label>
                <select className="form-select form-select-sm bg-light border-0" value={form.approval} onChange={(event) => updateForm('approval', event.target.value)}>
                  {['Draft', 'Pending Approval', 'Approved'].map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-light btn-sm rounded-pill px-3 fw-bold" onClick={() => setForm(emptyForm)}>Reset</button>
              <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Generate Invoice
              </button>
            </div>
          </div>
        </form>
      )}

      {(mode === 'import' || mode === 'manage') && (
        <div className={`card border-0 shadow-sm invoice-card mb-4 ${isDark ? 'bg-dark text-white' : 'bg-white'}`}>
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">Import Invoice</h5>
                <div className="small text-muted">Upload CSV with columns: {columns.join(', ')}.</div>
              </div>
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold" onClick={() => exportInvoices(invoices)}>
                <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                Download Sample
              </button>
            </div>
            <input className="form-control bg-light border-0" type="file" accept=".csv,text/csv" onChange={handleFile} />
            {previewRows.length > 0 && (
              <div className="mt-3">
                <div className="small fw-bold mb-2">{previewRows.length} rows ready</div>
                <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={importInvoices}>
                  <FontAwesomeIcon icon={faFileImport} className="me-2" />
                  Import Invoices
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`card border-0 shadow-sm invoice-card ${isDark ? 'bg-dark text-white' : 'bg-white'}`}>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div>
              <h5 className="fw-bold mb-1">{mode === 'export' ? 'Export Invoice' : 'Invoice Management'}</h5>
              <div className="small text-muted">Search, filter, export, print, send, and delete invoice records.</div>
            </div>
            <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold" onClick={() => exportInvoices()}>
              <FontAwesomeIcon icon={faFileExport} className="me-2" />
              Export Filtered CSV
            </button>
          </div>

          <div className="d-flex gap-2 overflow-auto pb-2 mb-3">
            {lifecycleTabs.map((tab) => (
              <button key={tab} className={`btn btn-sm rounded-pill px-3 fw-bold text-nowrap ${activeTab === tab ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="row g-2 mb-3">
            <div className="col-lg-5">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-0"><FontAwesomeIcon icon={faSearch} /></span>
                <input className="form-control border-0 bg-light" placeholder="Search invoice, customer, project" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              </div>
            </div>
            <div className="col-lg-auto">
              <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold" onClick={() => { setSearchTerm(''); setActiveTab('All'); }}>
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Clear Filters
              </button>
            </div>
          </div>

          <div className="table-responsive invoice-table-wrap">
            <table className={`table table-hover align-middle mb-0 ${isDark ? 'table-dark' : ''}`}>
              <thead className="small text-uppercase">
                <tr>
                  <th>Invoice Number</th>
                  <th>Customer</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Reference</th>
                  <th>Sales Order</th>
                  <th>Project</th>
                  <th>Currency</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Approval</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.number}>
                    <td className="fw-bold text-primary">{invoice.number}</td>
                    <td>{invoice.customer}</td>
                    <td>{invoice.invoiceDate}</td>
                    <td>{invoice.dueDate}</td>
                    <td>{invoice.reference}</td>
                    <td>{invoice.salesOrder}</td>
                    <td>{invoice.project}</td>
                    <td>{invoice.currency}</td>
                    <td className="fw-bold">{formatCurrency(invoice.total)}</td>
                    <td>{formatCurrency(invoice.paid)}</td>
                    <td>{formatCurrency(Number(invoice.total) - Number(invoice.paid))}</td>
                    <td><span className={`badge rounded-pill ${statusClass(invoice.status)}`}>{invoice.status}</span></td>
                    <td><span className={`badge rounded-pill ${statusClass(invoice.approval)}`}>{invoice.approval}</span></td>
                    <td>{invoice.createdBy}</td>
                    <td>{invoice.createdDate}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-light" title="View" onClick={() => setMessage(`${invoice.number}: ${invoice.customer}, balance ${formatCurrency(Number(invoice.total) - Number(invoice.paid))}`)}><FontAwesomeIcon icon={faEye} /></button>
                        <button className="btn btn-light" title="Send" onClick={() => setMessage(`${invoice.number} marked for customer delivery.`)}><FontAwesomeIcon icon={faPaperPlane} /></button>
                        <button className="btn btn-light" title="Print" onClick={() => window.print()}><FontAwesomeIcon icon={faPrint} /></button>
                        <button className="btn btn-light text-danger" title="Delete" onClick={() => deleteInvoice(invoice.number)}><FontAwesomeIcon icon={faTrashCan} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
            <span className="small text-muted">Showing {filteredInvoices.length} of {invoices.length} invoices</span>
            <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold" onClick={() => exportInvoices(invoices)}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              Export All
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-center .x-small { font-size: 11px; }
        .invoice-card { border-radius: 8px; }
        .invoice-icon {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .invoice-table-wrap { max-height: 540px; }
        .invoice-table-wrap th,
        .invoice-table-wrap td {
          white-space: nowrap;
          font-size: 0.82rem;
          padding: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default FmsInvoiceWorkspace;
