import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faPen, faEdit, faTrash,
  faRefresh, faCheckCircle, faBan, faUserCheck, faTimeline, faBuildingColumns,
  faUser, faTags, faCoins, faDollarSign, faShieldHalved, faInfoCircle, faFolder,
  faStar, faChevronRight, faChevronLeft, faXmark, faPrint, faScaleBalanced,
  faChartLine, faClock, faThumbsUp, faBriefcase, faGlobe, faLock, faPaperPlane,
  faHistory, faArrowRotateLeft, faFileInvoice, faFolderOpen, faEllipsisVertical,
  faLink, faFileInvoiceDollar, faCogs, faChartPie, faCheck, faListCheck,
  faBrain, faEnvelope, faFilePdf, faFileSignature, faFileCsv, faFileExcel, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { erpCss, erpColors } from '../../../../components/ui/ux/ErpTheme';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listVendors } from '../../../../api/fms';

const ErpVendors = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#232736' : '#ffffff';
  const accentColor = '#6366f1';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeViewTab, setActiveViewTab] = useState('directory');
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('overview');

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    country: '',
    city: '',
    industry: '',
    currency: '',
    paymentTerms: '',
    riskLevel: '',
    performanceRating: '',
    contractStatus: '',
    taxNumber: '',
    bankAccount: '',
    poNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await listVendors({ per_page: 100 });
        const apiVendors = (res.data?.data || []).map(v => ({
          id: v.id,
          code: v.vendor_code,
          name: v.name,
          legalName: v.legal_name || '',
          type: v.vendor_type || 'Supplier',
          contact: v.name,
          designation: '',
          department: '',
          email: v.email || '',
          phone: v.phone || '',
          mobile: v.mobile || '',
          whatsapp: v.whatsapp || '',
          emergencyContact: '',
          linkedin: '',
          country: v.country || '',
          city: v.city || '',
          status: v.status === 'active' ? 'Active' : v.status === 'inactive' ? 'Inactive' : v.status || 'Active',
          category: '',
          currency: v.currency || 'USD',
          terms: v.credit_terms || 'Net 30',
          creditDays: v.credit_days || 0,
          balance: 0,
          openingBalance: v.opening_balance || 0,
          currentBalance: 0,
          outstandingBills: 0,
          creditNotes: '$0',
          limit: v.credit_limit || 0,
          withholdingTax: '',
          defaultExpenseAccount: v.gl_expense_account || '',
          website: v.website || '',
          timezone: '',
          language: 'English',
          businessCategory: '',
          rating: 0,
          risk: 'Low',
          onTimeDelivery: 0,
          qualityRating: 0,
          deliveryTime: '',
          rejectionRate: 0,
          purchaseVolume: 0,
          aiScore: 0,
          taxNumber: v.tax_no || '',
          bankDetails: { iban: '', swift: '' }
        }));
        setVendors(apiVendors);
      } catch (err) {
        setError(err.message || 'Failed to load vendors');
        console.error('Failed to fetch vendors:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  useEffect(() => {
    const onRefresh = () => setRefreshKey(k => k + 1);
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleDeleteVendor = (id) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'Archived' } : v));
    addNotification('Vendor status set to Archived.', 'success');
  };

  const handleStatusChange = (id, newStatus) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    addNotification(`Vendor status updated to ${newStatus}.`, 'success');
  };

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'vendor' });
    setActiveTab('erp_add_vendor');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.name || row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const { id } = deleteDialog;
    setVendors(prev => prev.filter(item => item.id !== id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const safe = (v, k) => (v && v[k] != null ? String(v[k]) : '');
  const filteredVendors = vendors.filter(v => {
    if (!v) return false;
    const s = searchTerm.toLowerCase();
    const matchesSearch = !s ||
      safe(v, 'name').toLowerCase().includes(s) ||
      safe(v, 'code').toLowerCase().includes(s) ||
      safe(v, 'contact').toLowerCase().includes(s) ||
      safe(v, 'email').toLowerCase().includes(s) ||
      safe(v, 'city').toLowerCase().includes(s) ||
      safe(v, 'country').toLowerCase().includes(s) ||
      safe(v, 'taxNumber').toLowerCase().includes(s) ||
      (v.bankDetails && v.bankDetails.iban && v.bankDetails.iban.toLowerCase().includes(s)) ||
      (v.businessCategory && v.businessCategory.toLowerCase().includes(s));
    
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesType = typeFilter === 'All' || v.type === typeFilter;

    const matchesCountry = !advFilters.country || safe(v, 'country').toLowerCase().includes(advFilters.country.toLowerCase());
    const matchesCity = !advFilters.city || safe(v, 'city').toLowerCase().includes(advFilters.city.toLowerCase());
    const matchesIndustry = !advFilters.industry || (v.category && v.category.toLowerCase().includes(advFilters.industry.toLowerCase()));
    const matchesRisk = !advFilters.riskLevel || v.risk === advFilters.riskLevel;
    const matchesCurrency = !advFilters.currency || v.currency === advFilters.currency;
    const matchesTerms = !advFilters.paymentTerms || safe(v, 'terms').toLowerCase().includes(advFilters.paymentTerms.toLowerCase());
    const matchesRating = !advFilters.performanceRating || (v.rating || 0) >= parseFloat(advFilters.performanceRating);

    return matchesSearch && matchesStatus && matchesType && matchesCountry && matchesCity && matchesIndustry && matchesRisk && matchesCurrency && matchesTerms && matchesRating;
  });

  const paginatedVendors = filteredVendors.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const kpiWidgets = useMemo(() => [
    { label: 'Total Vendors', val: vendors.length, icon: faBuildingColumns, color: colors.primary, trend: 'up', trendVal: 'Registered' },
    { label: 'Active Vendors', val: vendors.filter(v => v.status === 'Active' || v.status === 'Preferred').length, icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Active' },
    { label: 'Inactive Vendors', val: vendors.filter(v => v.status === 'Inactive').length, icon: faBan, color: mutedColor, trend: 'up', trendVal: 'Inactive' },
    { label: 'Blocked Vendors', val: vendors.filter(v => v.status === 'Blocked').length, icon: faLock, color: colors.danger, trend: 'up', trendVal: 'Blocked' },
    { label: 'Preferred Vendors', val: vendors.filter(v => v.status === 'Preferred').length, icon: faStar, color: colors.warning, trend: 'up', trendVal: 'Preferred' },
  ], [vendors]);

  const handleViewClick = (row) => {
    setSelectedVendor(row);
  };

  const handleMoveToDraft = (row) => {
    setVendors(prev => prev.map(v => v.id === row.id ? { ...v, status: 'Draft' } : v));
    addNotification?.(`${row.name || row.code} moved to Draft.`, 'success');
  };

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const cols = exportColumns;
    const headers = cols.map(c => c.label);
    const rows = filteredVendors.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'vendors.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'vendors.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Vendors', headers, rows, filename: 'vendors.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Vendors', headers, rows, filename: 'vendors.docx' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const exportColumns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'status', label: 'Status' },
  ];

  const exportButtons = (
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

  const headerAction = (
    <div className="d-flex gap-2">
      <button className="premium-btn btn btn-sm d-flex align-items-center gap-1" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }} onClick={() => setRefreshKey(k => k + 1)}>
        <FontAwesomeIcon icon={faRefresh} spin={loading} /> Refresh
      </button>
      <button className="premium-btn btn btn-sm d-flex align-items-center gap-1" style={{ borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none' }} onClick={() => setActiveTab('erp_add_vendor')}>
        <FontAwesomeIcon icon={faPlus} /> Add Vendor
      </button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faBuildingColumns}
      title="Vendor Master Directory"
      description="Central master record for suppliers, contractors, and manufacturers. Matches SAP S/4HANA & NetSuite Enterprise design."
      action={headerAction}
    >
      <div className="d-flex glass-card px-2 py-1 mb-4" style={{ gap: '0.15rem', borderRadius: '14px' }}>
        {[
          { id: 'directory', label: 'Vendor Directory', icon: faBuildingColumns },
          { id: 'dashboard', label: 'Vendor KPIs', icon: faChartPie },
          { id: 'analytics', label: 'Vendor Intelligence (AI)', icon: faChartLine },
          { id: 'reports', label: 'Ledger Compliance Reports', icon: faFileInvoice }
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

      {activeViewTab === 'directory' && (
        <div>
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <div className="row g-2 align-items-center">
              <div className="col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text" style={{ background: isDark ? '#1a1d29' : '#ffffff', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRight: 'none', color: mutedColor, borderRadius: '10px 0 0 10px' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input type="text" className="form-control" style={{ borderLeft: 'none', borderRadius: '0 10px 10px 0' }} placeholder="Search by vendor name, code, contact, email, city or tax number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Preferred">Preferred</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Pending Verification">Pending Verification</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Government">Government</option>
                </select>
              </div>
              <div className="col-md-2 d-flex justify-content-end gap-1">
                <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'table' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'table' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('table')}><FontAwesomeIcon icon={faList} /></button>
                <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'card' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'card' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('card')}><FontAwesomeIcon icon={faBuildingColumns} /></button>
                <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: viewMode === 'kanban' ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), border: 'none', color: viewMode === 'kanban' ? '#fff' : textColor, padding: '5px 10px' }} onClick={() => setViewMode('kanban')}><FontAwesomeIcon icon={faTimeline} /></button>
              </div>
            </div>
          </div>

          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Vendor Intelligence</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>{vendors.filter(v => v.status === 'Active').length} active vendors. 3 vendors have pending compliance verification.</div>
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'table' && (
            <ErpDataTable
              columns={[
                { key: 'code', label: 'Code', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
                { key: 'name', label: 'Vendor Name', render: (v, row) => <span style={{ cursor: 'pointer', color: textColor }} onClick={() => setSelectedVendor(row)}>{v}</span> },
                { key: 'type', label: 'Type', render: (val) => <span style={{ color: textColor }}>{val}</span> },
                { key: 'email', label: 'Email', render: (val) => <span style={{ color: mutedColor }}>{val}</span> },
                { key: 'phone', label: 'Phone', render: (val) => <span style={{ color: textColor }}>{val}</span> },
                { key: 'country', label: 'Country', render: (val) => <span style={{ color: textColor }}>{val}</span> },
                { key: 'city', label: 'City', render: (val) => <span style={{ color: textColor }}>{val}</span> },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: '', align: 'end', render: (v, row) => (
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
                    <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              ]}
              data={paginatedVendors}
              loading={loading}
              error={error}
              emptyMessage="No vendors found."
              emptyIcon={faBuildingColumns}
              isDark={isDark}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              totalEntries={filteredVendors.length}
              onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
              exportButtons={exportButtons}
            />
          )}

          {viewMode === 'card' && (
            <div className="row g-3 mb-4">
              {paginatedVendors.map(v => (
                <div key={v.id} className="col-md-4">
                  <div className="glass-card premium-card p-3 h-100 text-start" style={{ borderRadius: '16px' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="font-monospace" style={{ color: mutedColor, fontSize: '0.7rem' }}>{v.code}</span>
                      <span className="premium-badge" style={{ background: isDark ? '#1e3a5f' : '#e0f2fe', color: '#3b82f6' }}>
                        {v.type}
                      </span>
                    </div>
                    <h6 className="fw-bold mb-1" style={{ color: textColor }}>{v.name}</h6>
                    <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="d-block mb-2">{v.contact} &bull; {v.country}</span>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block mb-3">{v.email}</span>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                      <div>
                        <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Balance</span>
                        <span className="font-monospace fw-bold" style={{ color: '#f43f5e' }}>${v.balance.toLocaleString()}</span>
                      </div>
                      <button className="premium-btn btn btn-sm" style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: textColor, fontWeight: 600, fontSize: '0.72rem', padding: '5px 14px' }} onClick={() => setSelectedVendor(v)}>
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'kanban' && (
            <div className="row g-3 mb-4 flex-nowrap overflow-auto py-2">
              {['Active', 'Preferred', 'Pending Verification', 'Blocked', 'Inactive'].map(stage => {
                const stageVendors = filteredVendors.filter(v => v.status === stage);
                return (
                  <div key={stage} className="col-md-3 flex-shrink-0" style={{ minWidth: '280px' }}>
                    <div className="glass-card p-3 h-100" style={{ borderRadius: '16px' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                        <span className="fw-bold small" style={{ color: textColor }}>{stage}</span>
                        <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>{stageVendors.length}</span>
                      </div>
                      <div className="d-flex flex-column gap-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {stageVendors.map(v => (
                          <div key={v.id} className="glass-card p-3" style={{ borderRadius: '12px', cursor: 'pointer' }} onClick={() => setSelectedVendor(v)}>
                            <div className="font-monospace" style={{ color: mutedColor, fontSize: '0.65rem', marginBottom: '4px' }}>{v.code}</div>
                            <div className="fw-bold small mb-2" style={{ color: textColor }}>{v.name}</div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold" style={{ color: '#f43f5e', fontSize: '0.7rem' }}>${v.balance.toLocaleString()}</span>
                              <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{v.type}</span>
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

      {activeViewTab === 'dashboard' && (
        <div className="row g-3 mb-4">
          {kpiWidgets.map((k, idx) => (
            <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-2" />
          ))}

          <div className="col-md-6 mt-4">
            <div className="glass-card p-4 h-100" style={{ borderRadius: '16px' }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Supplier Category Breakdown</h6>
              <div className="d-flex flex-column gap-3">
                {[
                  { name: 'Manufacturers', count: vendors.filter(v => v.type === 'Manufacturer').length, percent: 40, color: '#6366f1' },
                  { name: 'Wholesale Suppliers', count: vendors.filter(v => v.type === 'Wholesaler').length, percent: 30, color: '#3b82f6' },
                  { name: 'Professional Services / Consultants', count: vendors.filter(v => v.type === 'Consultant').length, percent: 15, color: '#10b981' },
                  { name: 'Government Entities', count: vendors.filter(v => v.type === 'Government').length, percent: 10, color: '#a855f7' }
                ].map((c, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: textColor }}>{c.name} ({c.count})</span>
                      <span className="fw-bold" style={{ color: textColor }}>{c.percent}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: isDark ? '#1e293b' : '#e2e8f0' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${c.percent}%`, backgroundColor: c.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-4">
            <div className="glass-card p-4 h-100" style={{ borderRadius: '16px' }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Top Suppliers by Volume</h6>
              <ErpDataTable
                columns={[
                  { key: 'name', label: 'Vendor', bold: true },
                  { key: 'risk', label: 'Risk Level' },
                  { key: 'purchaseVolume', label: 'Volume', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>${val.toLocaleString()}</span> },
                ]}
                data={vendors}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      )}

      {activeViewTab === 'analytics' && (
        <div className="row g-3">
          <div className="col-md-12 mb-3">
            <div className="glass-card p-3" style={{ borderRadius: '16px' }}>
              <h5 className="fw-bold mb-1" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faChartLine} className="me-2" style={{ color: '#6366f1' }} /> Vendor Performance Dashboard (AI Powered)
              </h5>
              <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Real-time Service Level Agreement (SLA) monitoring, quality reviews, compliance tracking, and risk indexes.</p>
            </div>
          </div>

          {vendors.map(v => (
            <div key={v.id} className="col-md-6 enter-anim">
              <div className="glass-card premium-card p-3 text-start h-100" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between mb-3 pb-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: textColor }}>{v.name}</h6>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{v.code} &bull; {v.type}</span>
                  </div>
                  <div className="text-end">
                    <span style={{ color: mutedColor, fontSize: '0.6rem' }} className="d-block">AI Supplier Score</span>
                    <span className="fw-bold font-monospace" style={{ color: '#6366f1' }}>{v.aiScore} / 100</span>
                  </div>
                </div>

                <div className="row g-2 text-center">
                  <div className="col-3" style={{ borderRight: `1px solid ${borderColor}` }}>
                    <div className="fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1.1rem' }}>{v.onTimeDelivery}%</div>
                    <span style={{ color: mutedColor, fontSize: '0.6rem' }} className="d-block">On-Time Del.</span>
                  </div>
                  <div className="col-3" style={{ borderRight: `1px solid ${borderColor}` }}>
                    <div className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '1.1rem' }}>{v.qualityRating}</div>
                    <span style={{ color: mutedColor, fontSize: '0.6rem' }} className="d-block">Quality Stars</span>
                  </div>
                  <div className="col-3" style={{ borderRight: `1px solid ${borderColor}` }}>
                    <div className="fw-bold font-monospace" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{v.deliveryTime}</div>
                    <span style={{ color: mutedColor, fontSize: '0.6rem' }} className="d-block">Avg Lead Time</span>
                  </div>
                  <div className="col-3">
                    <div className="fw-bold font-monospace" style={{ color: '#f43f5e', fontSize: '1.1rem' }}>{v.rejectionRate}%</div>
                    <span style={{ color: mutedColor, fontSize: '0.6rem' }} className="d-block">Rejections</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeViewTab === 'reports' && (
        <div className="row g-3">
          {[
            { title: 'Vendor Ledger Report', desc: 'Detailed debits, credits, and transaction balances per supplier.', icon: faFileInvoice },
            { title: 'Outstandings Aging Analysis', desc: 'Aging brackets (0-30, 31-60, 61-90, 90+ days) for Accounts Payable.', icon: faChartPie },
            { title: 'Purchases Audit Report', desc: 'Complete log of orders, delivery checklists, and invoice matches.', icon: faListCheck },
            { title: 'Supplier Tax Withholding Report', desc: 'Summarizes tax collections, GST, NTN registry compliance, and deductions.', icon: faShieldHalved }
          ].map((rp, i) => (
            <div key={i} className="col-md-6 enter-anim">
              <div className="glass-card premium-card p-4 text-start h-100 d-flex flex-column" style={{ borderRadius: '16px' }}>
                <h6 className="fw-bold mb-1" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={rp.icon} className="me-2" style={{ color: '#6366f1' }} />
                  {rp.title}
                </h6>
                <p style={{ color: mutedColor, fontSize: '0.8rem' }} className="mb-4">{rp.desc}</p>
                <button className="premium-btn btn btn-sm mt-auto align-self-start" style={{ borderRadius: '8px', background: `${accentColor}15`, color: accentColor, border: 'none', fontSize: '0.7rem' }} onClick={() => addNotification(`${rp.title} generated successfully.`, 'success')}>
                  Compile Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVendor && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '70%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge" style={{ background: `${accentColor}15`, color: accentColor, marginBottom: '4px' }}>{selectedVendor.code}</span>
              <h5 className="fw-bold mb-1" style={{ color: textColor }}>{selectedVendor.name}</h5>
              <p style={{ color: mutedColor, fontSize: '0.8rem' }} className="mb-0">{selectedVendor.legalName}</p>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedVendor(null)}>
              <FontAwesomeIcon icon={faXmark} className="fs-5" />
            </button>
          </div>

          <div className="d-flex justify-content-between mb-4 p-2 rounded small text-center" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
            {['Registration', 'Verification', 'Approval', 'Active', 'Preferred'].map((st, i) => {
              const activeIdx = ['Pending Verification', 'Active', 'Preferred'].indexOf(selectedVendor.status) + 1;
              const isPassed = i <= (activeIdx === 0 ? 1 : activeIdx);
              return (
                <div key={i} className="flex-fill">
                  <span className={`fw-bold d-block ${isPassed ? '' : ''}`} style={{ color: isPassed ? '#6366f1' : mutedColor, fontSize: '0.75rem' }}>{st}</span>
                  <span style={{ color: mutedColor, fontSize: '0.6rem' }}>{isPassed ? '✓ Done' : 'Pending'}</span>
                </div>
              );
            })}
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '120px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'financials', label: 'Financial Summary' },
              { id: 'pos', label: 'Purchase Orders' },
              { id: 'bills', label: 'Vendor Bills' },
              { id: 'payments', label: 'Payments' },
              { id: 'returns', label: 'Purchase Returns' },
              { id: 'products', label: 'Products' },
              { id: 'contracts', label: 'Contracts' },
              { id: 'documents', label: 'Documents' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'notes', label: 'Notes' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'communication', label: 'Communication' },
              { id: 'audit', label: 'Audit Logs' },
              { id: 'performance', label: 'Performance' },
              { id: 'analytics', label: 'Analytics' }
            ].map(pt => (
              <button
                key={pt.id}
                className={`premium-tab-btn btn btn-sm py-1 px-2 fw-bold ${activeProfileTab === pt.id ? 'active' : ''}`}
                style={{
                  color: activeProfileTab === pt.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                  background: activeProfileTab === pt.id ? undefined : (isDark ? '#1e293b' : '#f1f5f9'),
                  fontSize: '0.68rem',
                  borderRadius: '6px'
                }}
                onClick={() => setActiveProfileTab(pt.id)}
              >
                {pt.label}
              </button>
            ))}
          </div>

          <div className="flex-grow-1 overflow-auto pe-2" style={{ fontSize: '0.8rem' }}>
            {activeProfileTab === 'overview' && (
              <div className="row g-3">
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Vendor Code:</strong> <span className="d-block font-monospace" style={{ color: textColor }}>{selectedVendor.code}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Legal Entity Name:</strong> <span className="d-block" style={{ color: textColor }}>{selectedVendor.legalName}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Vendor Category:</strong> <span className="d-block" style={{ color: textColor }}>{selectedVendor.category} / {selectedVendor.businessCategory}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Preferred Currency & Language:</strong> <span className="d-block font-monospace" style={{ color: textColor }}>{selectedVendor.currency} &bull; {selectedVendor.language}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Primary Representative:</strong> <span className="d-block" style={{ color: textColor }}>{selectedVendor.contact} ({selectedVendor.designation})</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Department / Business Unit:</strong> <span className="d-block" style={{ color: textColor }}>{selectedVendor.department}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Primary Email Address:</strong> <span className="d-block font-monospace" style={{ color: textColor }}>{selectedVendor.email}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Corporate Website:</strong> <span className="d-block font-monospace text-primary" style={{ cursor: 'pointer' }}>{selectedVendor.website}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Contact Phones (Mobile/WA):</strong> <span className="d-block font-monospace" style={{ color: textColor }}>{selectedVendor.phone} / {selectedVendor.whatsapp}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Timezone:</strong> <span className="d-block font-monospace" style={{ color: textColor }}>{selectedVendor.timezone}</span>
                </div>
                <div className="col-md-12 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <h6 className="fw-bold mb-2" style={{ color: textColor }}>Supplier Headquarters Address</h6>
                  <p className="mb-0" style={{ color: mutedColor }}>{selectedVendor.city}, {selectedVendor.country}</p>
                </div>
              </div>
            )}

            {activeProfileTab === 'financials' && (
              <div className="row g-3">
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Default Expense Account:</strong> <span className="d-block" style={{ color: textColor }}>{selectedVendor.defaultExpenseAccount}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Payment Terms / Credit Days:</strong> <span className="d-block" style={{ color: textColor }}>{selectedVendor.terms} ({selectedVendor.creditDays} Days)</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Vendor Credit Limit:</strong> <span className="font-monospace d-block" style={{ color: textColor }}>${selectedVendor.limit.toLocaleString()}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Tax Withholding Settings:</strong> <span className="font-monospace d-block" style={{ color: textColor }}>{selectedVendor.withholdingTax} WHT</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Opening Balance:</strong> <span className="font-monospace d-block" style={{ color: textColor }}>${selectedVendor.openingBalance.toLocaleString()}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Current Ledger Balance:</strong> <span className="font-monospace fw-bold d-block" style={{ color: '#f43f5e' }}>${selectedVendor.balance.toLocaleString()}</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Outstanding Bills Count:</strong> <span className="font-monospace d-block" style={{ color: textColor }}>{selectedVendor.outstandingBills} open bills</span>
                </div>
                <div className="col-md-6" style={{ color: textColor }}>
                  <strong style={{ color: textColor }}>Credit Notes Available:</strong> <span className="font-monospace d-block text-success" style={{ color: textColor }}>{selectedVendor.creditNotes}</span>
                </div>
                <div className="col-md-12 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <h6 className="fw-bold mb-2" style={{ color: textColor }}>EFT / Settlement Bank Account Routing</h6>
                  <strong style={{ color: textColor }}>IBAN Number:</strong> <span className="font-monospace d-block" style={{ color: textColor }}>{selectedVendor.bankDetails.iban}</span>
                  <strong style={{ color: textColor }}>SWIFT BIC Code:</strong> <span className="font-monospace d-block" style={{ color: textColor }}>{selectedVendor.bankDetails.swift}</span>
                </div>
              </div>
            )}

            {activeProfileTab === 'pos' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Linked Purchase Orders</h6>
                <div className="p-3 rounded mb-2 text-start" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold font-monospace" style={{ color: '#6366f1' }}>PO-2026-90812</span>
                    <span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>Fully Dispatched</span>
                  </div>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.65rem' }}>Aluminum Bars Supply (20 Tons)</span>
                  <span className="fw-bold font-monospace" style={{ color: textColor }}>$45,000</span>
                </div>
                <div className="p-3 rounded text-start" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold font-monospace" style={{ color: '#6366f1' }}>PO-2026-90998</span>
                    <span className="premium-badge" style={{ background: isDark ? '#713f12' : '#fef3c7', color: '#f59e0b' }}>Awaiting Delivery</span>
                  </div>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.65rem' }}>Copper Cables & Assemblies</span>
                  <span className="fw-bold font-monospace" style={{ color: textColor }}>$18,000</span>
                </div>
              </div>
            )}

            {activeProfileTab === 'bills' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Accounts Payable Bills</h6>
                <div className="premium-table-wrapper">
                  <table className="premium-table" style={{ fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>Due Date</th>
                        <th className="text-end">Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-monospace fw-bold" style={{ color: '#6366f1' }}>BIL-2026-041</td>
                        <td>2026-06-15</td>
                        <td>2026-07-15</td>
                        <td className="text-end font-monospace fw-bold">$25,000</td>
                        <td><span className="premium-badge" style={{ background: isDark ? '#713f12' : '#fef3c7', color: '#f59e0b' }}>Unpaid</span></td>
                      </tr>
                      <tr>
                        <td className="font-monospace fw-bold" style={{ color: '#6366f1' }}>BIL-2026-039</td>
                        <td>2026-05-10</td>
                        <td>2026-06-10</td>
                        <td className="text-end font-monospace fw-bold">$12,000</td>
                        <td><span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeProfileTab === 'payments' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Disbursed Settlement Transactions</h6>
                <div className="premium-table-wrapper">
                  <table className="premium-table" style={{ fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th>Payment Run No</th>
                        <th>Date</th>
                        <th>Method</th>
                        <th className="text-end">Net Disbursed</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-monospace fw-bold" style={{ color: '#6366f1' }}>PMT-2026-010</td>
                        <td>2026-06-12</td>
                        <td>Wire Transfer</td>
                        <td className="text-end font-monospace fw-bold">$45,000</td>
                        <td><span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>Released</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeProfileTab === 'returns' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Purchase Returns (Debit Notes)</h6>
                <div className="p-3 rounded text-start" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold font-monospace" style={{ color: '#ef4444' }}>RTN-2026-002</span>
                    <span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: '#10b981' }}>Credit Issued</span>
                  </div>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.65rem' }}>Reason: Defective batch material return</span>
                  <span className="fw-bold font-monospace text-danger">-$2,500</span>
                </div>
              </div>
            )}

            {activeProfileTab === 'products' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Approved Catalog Products</h6>
                <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0" style={{ color: textColor }}>
                    <span>Raw Aluminum Alloy Bars</span>
                    <span className="font-monospace text-muted">$2,250 / Ton</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0" style={{ color: textColor }}>
                    <span>Copper Connectors & Assemblies</span>
                    <span className="font-monospace text-muted">$4.50 / Unit</span>
                  </li>
                </ul>
              </div>
            )}

            {activeProfileTab === 'contracts' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Master Supply Agreements & SLA Contracts</h6>
                <div className="p-3 rounded text-start" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="fw-bold text-truncate" style={{ color: textColor }}>Global Supply Framework SLA 2026</div>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.65rem' }}>Validity: Jan 01, 2026 - Dec 31, 2026</span>
                  <span className="premium-badge mt-2" style={{ background: isDark ? '#1e3a5f' : '#e0f2fe', color: '#3b82f6' }}>Active & Compliant</span>
                </div>
              </div>
            )}

            {activeProfileTab === 'documents' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Supplier Documentation Dossier</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="p-2 rounded d-flex justify-content-between align-items-center" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                    <span style={{ color: textColor }}><FontAwesomeIcon icon={faFileInvoice} className="me-2 text-primary" /> Tax Compliance NTN Certificate.pdf</span>
                    <button className="btn btn-sm btn-link p-0 text-primary">Download</button>
                  </div>
                  <div className="p-2 rounded d-flex justify-content-between align-items-center" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                    <span style={{ color: textColor }}><FontAwesomeIcon icon={faFileInvoice} className="me-2 text-primary" /> SECP Registration Certificate.pdf</span>
                    <button className="btn btn-sm btn-link p-0 text-primary">Download</button>
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'timeline' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Operational Sourcing Timeline</h6>
                <div className="d-flex flex-column gap-3">
                  <div style={{ borderLeft: '2px solid #3b82f6', position: 'relative', paddingLeft: '16px', marginLeft: '8px' }}>
                    <span style={{ position: 'absolute', top: '4px', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                    <div className="fw-bold" style={{ color: textColor }}>Purchase Order Released</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }}>June 28, 2026 &bull; PO-2026-90998</span>
                  </div>
                  <div style={{ borderLeft: '2px solid #10b981', position: 'relative', paddingLeft: '16px', marginLeft: '8px' }}>
                    <span style={{ position: 'absolute', top: '4px', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                    <div className="fw-bold" style={{ color: textColor }}>Quality Certification Received</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }}>June 15, 2026 &bull; Verified by QA team</span>
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'notes' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Procurement Collaboration Notes</h6>
                <textarea className="form-control mb-2" rows="3" placeholder="Add internal note..." style={{ fontSize: '0.75rem' }}></textarea>
                <button className="premium-btn btn btn-sm btn-primary" style={{ borderRadius: '8px', fontSize: '0.7rem' }}>Save Note</button>
              </div>
            )}

            {activeProfileTab === 'attachments' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Upload Supporting Vouchers</h6>
                <div className="p-4 border border-dashed rounded text-center" style={{ background: isDark ? 'rgba(255,255,255,0.01)' : '#f8fafc', borderColor: borderColor }}>
                  <FontAwesomeIcon icon={faLink} className="fs-3 mb-2 text-muted" />
                  <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Drag and drop files here, or click to browse</span>
                </div>
              </div>
            )}

            {activeProfileTab === 'communication' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>Contact Communication Log</h6>
                <div className="p-3 rounded text-start mb-2" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="fw-bold" style={{ color: textColor }}>Email Sent: Price negotiation follow-up</div>
                  <span className="d-block" style={{ color: mutedColor, fontSize: '0.65rem' }}>Sent by Marcus Vance on June 10, 2026</span>
                </div>
                <button className="premium-btn btn btn-sm btn-primary w-100" style={{ borderRadius: '8px', fontSize: '0.7rem' }}><FontAwesomeIcon icon={faPaperPlane} className="me-2" /> Compose Email</button>
              </div>
            )}

            {activeProfileTab === 'audit' && (
              <div>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>Security Audit Trails & Ledger Logs</h6>
                <div className="d-flex flex-column gap-3">
                  {[
                    { act: 'Vendor status updated to Preferred', time: 'July 03, 2026, 11:34 AM', usr: 'Finance Director (IP: 192.168.1.55)' },
                    { act: 'Bank IBAN details modified & validated', time: 'July 01, 2026, 09:12 AM', usr: 'Accountant (IP: 192.168.1.102)' },
                    { act: 'Vendor created and master file approved', time: 'June 18, 2026, 04:45 PM', usr: 'System Automator' }
                  ].map((ad, i) => (
                    <div key={i} style={{ borderLeft: '2px solid #6366f1', position: 'relative', paddingLeft: '16px', marginLeft: '8px' }}>
                      <span style={{
                        position: 'absolute', top: '4px', left: '-6px', width: '10px', height: '10px',
                        borderRadius: '50%', backgroundColor: '#6366f1'
                      }}></span>
                      <div className="fw-bold" style={{ color: textColor }}>{ad.act}</div>
                      <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">{ad.time} &bull; {ad.usr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeProfileTab === 'performance' && (
              <div className="row g-3 text-center">
                <div className="col-md-6">
                  <div className="glass-card p-3" style={{ borderRadius: '12px', border: 'none' }}>
                    <div className="fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1.2rem' }}>{selectedVendor.onTimeDelivery}%</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">On-Time Delivery SLA</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="glass-card p-3" style={{ borderRadius: '12px', border: 'none' }}>
                    <div className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '1.2rem' }}>{selectedVendor.qualityRating} / 5.0</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Product Quality Index</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="glass-card p-3" style={{ borderRadius: '12px', border: 'none' }}>
                    <div className="fw-bold font-monospace" style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{selectedVendor.deliveryTime}</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Average Delivery Lead Time</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="glass-card p-3" style={{ borderRadius: '12px', border: 'none' }}>
                    <div className="fw-bold font-monospace" style={{ color: '#f43f5e', fontSize: '1.2rem' }}>{selectedVendor.rejectionRate}%</div>
                    <span style={{ color: mutedColor, fontSize: '0.65rem' }} className="d-block">Defected Goods Rate</span>
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'analytics' && (
              <div>
                <h6 className="fw-bold mb-2" style={{ color: textColor }}>AI-Powered Spend Intelligence</h6>
                <div className="p-3 rounded mb-2 text-start" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="fw-bold text-primary mb-1"><FontAwesomeIcon icon={faStar} /> Sourcing Recommendation</div>
                  <p className="mb-0" style={{ color: mutedColor, fontSize: '0.72rem' }}>Spend analysis suggests consolidating purchases with this supplier to unlock an additional 2.5% tier discount.</p>
                </div>
                <div className="p-3 rounded text-start" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                  <div className="fw-bold text-success mb-1"><FontAwesomeIcon icon={faScaleBalanced} /> Dynamic Discounting</div>
                  <p className="mb-0" style={{ color: mutedColor, fontSize: '0.72rem' }}>Supplier offers a 2/10 Net 30 early payment discount. Recommended payment run date: Day 9 post-invoice posting.</p>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-1">
              <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', color: '#f43f5e', border: `1px solid ${borderColor}`, background: 'transparent', fontSize: '0.7rem' }} onClick={() => handleStatusChange(selectedVendor.id, 'Blocked')}>
                Block Supplier
              </button>
              <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', color: '#10b981', border: `1px solid ${borderColor}`, background: 'transparent', fontSize: '0.7rem' }} onClick={() => handleStatusChange(selectedVendor.id, 'Preferred')}>
                Promote to Preferred
              </button>
            </div>
            <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem', padding: '6px 16px' }} onClick={() => setSelectedVendor(null)}>
              Close Profile
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this vendor to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpVendors;
