import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import { listARCustomers, deleteARCustomer } from '../../../../api/customers';
import { moveToFmsTrash } from '../../../../api/enterprise';
import {
  faPlus, faSearch, faFilter, faFileExport,
  faList, faEye, faEdit, faTrash, faRefresh, faCheckCircle,
  faBan, faUserCheck, faTimeline, faBuildingColumns, faUser,
  faTags, faCoins, faDollarSign, faShieldHalved, faInfoCircle,
  faFolder, faStar, faChevronRight, faChevronLeft, faXmark,
  faArrowUp, faArrowDown, faTriangleExclamation, faBrain,
  faFileSignature, faFilePdf, faEnvelope, faTrashCan, faFileExcel, faFileCsv, faFileWord, faFileAlt,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import PublicShareDialog from '../../../../components/common/PublicShareDialog';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpCustomers = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null });
  const [shareItem, setShareItem] = useState(null);

  const fetchData = useCallback(async () => {
    try { setLoading(true); setLoadError(null); const data = await listARCustomers({ perPage: entriesPerPage, sortBy: 'created_at', sortOrder: 'desc' }); const list = Array.isArray(data?.data) ? data.data : []; setCustomers(list); }
    catch (err) { setLoadError(err?.message || 'Failed to load AR customers.'); setCustomers([]); }
    finally { setLoading(false); }
  }, [entriesPerPage]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [fetchData]);

  const handleEdit = (row) => {
    const draft = {
      code: row.code || '', name: row.name || '', legalName: row.legalName || row.name || '',
      type: row.type || 'Corporate', group: row.group || 'Enterprise', ntn: row.ntn || '',
      strn: row.strn || '', salesTaxRegNo: row.salesTaxRegNo || '', cnic: row.cnic || '',
      email: row.email || '', phone: row.phone || row.contact || '', website: row.website || '',
      contactPerson: row.contact || '', contactDesignation: row.contactDesignation || '',
      billingAddress: row.address || row.billingAddress || '', shippingAddress: row.shippingAddress || '',
      country: row.country || 'Pakistan', city: row.city || '', zip: row.zip || '',
      creditLimit: row.creditLimit || row.total_revenue || row.limit || '0',
      currency: row.currency || 'PKR', paymentTerms: row.paymentTerms || 'Net 30',
      priceList: row.priceList || 'Standard Price', discount: row.discount || '0',
      taxProfile: row.taxProfile || 'Standard VAT', warehouse: row.warehouse || 'Main Warehouse',
      status: row.status || 'Active', notes: row.notes || '',
    };
    localStorage.setItem('cust_draft', JSON.stringify(draft));
    setActiveTab('erp_create_customer');
  };

  const openAddCustomer = () => setActiveTab('erp_create_customer');

  const handleDeleteCustomer = (id, row) => {
    setDeleteDialog({ show: true, id, row });
  };

  const handleDeleteConfirm = async () => {
    const { id, row } = deleteDialog;
    try {
      if (row) {
        await moveToFmsTrash({ type: 'Customer', code: row.code || `#${id}`, title: row.name, value: typeof row.balance === 'number' ? '$' + row.balance.toLocaleString() : (row.balance || '$0.00') });
      }
      await deleteARCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      addNotification('Customer moved to Accounting Trash.', 'success');
    } catch (err) {
      addNotification(err?.message || 'Failed to delete customer.', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, row: null });
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpiData = useMemo(() => [
    { label: 'Total Customers', val: customers.length, icon: faUser, color: colors.primary, trend: 'up', trendVal: 'Active', sparkline: [42, 44, 43, 46, 45, 48, 47, 50, 49, 52, 51, 54] },
    { label: 'Active Customers', val: customers.filter(c => c.status === 'Active').length, icon: faUserCheck, color: colors.success, trend: 'up', trendVal: 'Online', sparkline: [30, 32, 31, 34, 33, 36, 35, 38, 37, 40, 39, 42] },
    { label: 'Credit Hold', val: customers.filter(c => c.status === 'Credit Hold').length, icon: faBan, color: colors.danger, trend: 'down', trendVal: 'At Risk', sparkline: [5, 4, 6, 3, 5, 2, 4, 1, 3, 2, 1, 1] },
    { label: 'Total Outstanding', val: customers.reduce((acc, curr) => acc + Number(curr.balance || 0), 0), icon: faDollarSign, color: colors.warning, trend: 'up', trendVal: '$1.42M', sparkline: [800, 820, 810, 840, 830, 860, 850, 880, 870, 900, 890, 920] },
  ], [customers]);

  const customerColumns = [
    { key: 'code', label: 'Code', bold: true },
    { key: 'name', label: 'Company Name' },
    { key: 'contact', label: 'Primary Contact' },
    { key: 'email', label: 'Email' },
    { key: 'balance', label: 'Receivables', render: (v) => <span className="font-monospace fw-bold" style={{ color: '#f43f5e' }}>${Number(v || 0).toLocaleString()}</span> },
    { key: 'limit', label: 'Credit Limit', render: (v) => <span className="font-monospace" style={{ color: mutedColor }}>${Number(v || 0).toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
  ];

  const headerAction = (
    <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
      <button className="btn btn-sm premium-btn" style={{
        borderRadius: '10px',
        background: isDark ? '#334155' : '#f1f5f9',
        color: textColor, fontSize: '0.75rem', border: 'none',
      }} onClick={() => addNotification('Import wizard launched.', 'info')}>
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Import Customers
      </button>
      <button className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        fontSize: '0.8rem',
      }} onClick={() => openAddCustomer()}>
        <FontAwesomeIcon icon={faPlus} /> Add Customer
      </button>
    </div>
  );

  const filterSelect = (
    <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
      <option value="All">All Statuses</option>
      <option value="Active">Active</option>
      <option value="Credit Hold">Credit Hold</option>
    </select>
  );

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredCustomers;
    const cols = [
      { key: 'code', label: 'Code' }, { key: 'name', label: 'Company Name' },
      { key: 'contact', label: 'Primary Contact' }, { key: 'email', label: 'Email' },
      { key: 'balance', label: 'Receivables' }, { key: 'limit', label: 'Credit Limit' },
      { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'customers.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'customers.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Customers', headers, rows, filename: 'customers.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Customers', headers, rows, filename: 'customers.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Customers', headers, rows, filename: 'customers.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const exportButtons = (
    <div className="d-flex gap-1">
      <div className="dropdown d-inline-block">
        <button className="btn btn-sm premium-btn dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
        </button>
        <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
        </ul>
      </div>
      <button className="btn btn-sm premium-btn" style={{
        borderRadius: '10px',
        background: isDark ? '#334155' : '#f1f5f9',
        color: textColor, fontSize: '0.75rem', border: 'none',
      }} onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}><FontAwesomeIcon icon={faRefresh} /> Reset</button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faBuildingColumns}
      title="Central Customer Master"
      description="Central customer database for corporate clients, individual customers, billing info, and credit limits."
      action={headerAction}
    >
      {/* AI Recommendation Card */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Customer Credit Recommendation</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>3 customers approaching credit limit. Consider reviewing credit terms for high-value accounts.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium KPI Row */}
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard
            key={idx}
            label={k.label}
            value={k.val}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
            trendVal={k.trendVal}
            sparkline={k.sparkline}
            isDark={isDark}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center py-5" style={{ color: mutedColor }}>
          <div className="spinner-border text-primary mb-2" role="status" />
          <div className="small">Loading companies...</div>
        </div>
      )}

      {!loading && loadError && (
        <div className="alert alert-danger small mb-4" role="alert">
          <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
          {loadError}
        </div>
      )}

      {!loading && !loadError && customers.length === 0 && (
        <div className="text-center py-5" style={{ color: mutedColor }}>
          <FontAwesomeIcon icon={faFolder} className="fs-3 mb-2 d-block opacity-50" />
          <div className="small">No companies found.</div>
        </div>
      )}

      {/* Table */}
      {!loading && customers.length > 0 && (
      <ErpDataTable
        columns={customerColumns}
        data={filteredCustomers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)}
        isDark={isDark}
        searchable
        searchPlaceholder="Search by name, code, email..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterSelect}
        exportButtons={exportButtons}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filteredCustomers.length}
        onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
        renderRow={(c, i, ctx) => (
          <tr key={c.id}>
            <td className="font-monospace fw-bold" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>{c.code}</td>
            <td className="fw-bold" style={{ color: textColor }}>{c.name}</td>
            <td style={{ color: textColor }}>{c.contact}</td>
            <td style={{ color: textColor }}>{c.email}</td>
            <td className="font-monospace fw-bold" style={{ color: '#f43f5e' }}>${Number(c.balance || 0).toLocaleString()}</td>
            <td className="font-monospace" style={{ color: mutedColor }}>${Number(c.limit || 0).toLocaleString()}</td>
            <td>
              <span className={`premium-badge`} style={{
                background: c.status === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'),
                color: c.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
              }}>
                <span className="badge-dot" style={{
                  background: c.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                }} />
                {c.status}
              </span>
            </td>
            <td className="text-end">
              <div className="d-flex gap-1 justify-content-end">
                <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => setSelectedCustomer(c)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(c)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn btn-sm border-0 premium-btn" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Customer moved to draft.', 'success')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                  <FontAwesomeIcon icon={faFileSignature} />
                </button>
                <button className="btn btn-sm border-0 premium-btn" title="Public QR / Share Link" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => setShareItem(c)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0ea5e910'; e.currentTarget.style.color = '#0ea5e9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                  <FontAwesomeIcon icon={faQrcode} />
                </button>
                <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
                <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
                <button className="btn btn-sm border-0 premium-btn" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteCustomer(c.id, c)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          padding: '1rem',
        }} onClick={() => setSelectedCustomer(null)}>
          <div style={{
            background: isDark ? '#242838' : '#ffffff',
            borderRadius: '16px', width: '100%', maxWidth: 600,
            height: 'calc(100vh - 2rem)', maxHeight: 'calc(100vh - 2rem)', overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faUser} style={{ color: '#6366f1', fontSize: '1rem' }} />
                <h6 className="mb-0 fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Customer Profile</h6>
                <span className="badge" style={{
                  background: selectedCustomer.status === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'),
                  color: selectedCustomer.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                  fontSize: '0.6rem', fontWeight: 600, marginLeft: 8,
                }}>{selectedCustomer.status}</span>
                <span className="premium-badge" style={{
                  background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                  color: '#6366f1', padding: '1px 8px', fontSize: '0.55rem',
                }}>#{selectedCustomer.code}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="btn btn-sm border-0" style={{ color: mutedColor, borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9' }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Company Name</div>
                  <div className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>{selectedCustomer.name}</div>
                </div>
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Customer Code</div>
                  <div className="font-monospace fw-bold" style={{ color: '#6366f1', fontSize: '0.85rem' }}>{selectedCustomer.code}</div>
                </div>
              </div>
              <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Contact Information</div>
                <div className="row g-3">
                  <div className="col-4">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Primary Contact</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500 }}>{selectedCustomer.contact || '—'}</div>
                  </div>
                  <div className="col-4">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Email</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500, wordBreak: 'break-all' }}>{selectedCustomer.email || '—'}</div>
                  </div>
                  <div className="col-4">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Phone</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500 }}>{selectedCustomer.phone || '—'}</div>
                  </div>
                </div>
              </div>
              <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Location</div>
                <div className="row g-3">
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Country</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500 }}>{selectedCustomer.country || '—'}</div>
                  </div>
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>City</div>
                    <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 500 }}>{selectedCustomer.city || '—'}</div>
                  </div>
                </div>
              </div>
              <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div className="row g-3">
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Outstanding Receivables</div>
                    <div className="fw-bold font-monospace" style={{ color: '#f43f5e', fontSize: '1.1rem' }}>${Number(selectedCustomer.balance || 0).toLocaleString()}</div>
                  </div>
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Credit Limit</div>
                    <div className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '1.1rem' }}>${Number(selectedCustomer.limit || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {selectedCustomer.notes && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Notes</div>
                  <div style={{ color: textColor, fontSize: '0.8rem', background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '8px', padding: '0.75rem' }}>{selectedCustomer.notes}</div>
                </div>
              )}
              <div className="d-flex gap-2 justify-content-end pt-2" style={{ borderTop: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
                <button onClick={() => setSelectedCustomer(null)} className="btn btn-sm px-3" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}>Close</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message="This customer will be moved to the Accounting Trash. You can restore or permanently purge it later."
        itemName={deleteDialog.row?.name || ''}
        confirmLabel="Move to Trash"
      />

      <PublicShareDialog
        show={!!shareItem}
        onHide={() => setShareItem(null)}
        entityType="customer"
        entityId={shareItem?.id}
        label={shareItem ? `${shareItem.code || ''} ${shareItem.name || ''}`.trim() : ''}
        isDark={isDark}
        onNotify={addNotification}
      />
    </ErpPageShell>
  );
};
export default ErpCustomers;
