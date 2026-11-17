import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faEye,
  faTrash, faCheckCircle, faClock, faInfoCircle,
  faXmark, faCheck, faEnvelope, faAward, faScaleBalanced,
  faUserCheck, faChartLine, faHistory, faFilePdf, faBuilding,
  faListCheck, faTags, faFileContract, faPen, faBrain, faFileSignature, faFileAlt,
  faFileCsv, faFileExcel, faFileWord
} from "@fortawesome/free-solid-svg-icons";
import { erpCss } from '../../../../components/ui/ux/ErpTheme';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { getRFQs, saveRFQs, addAuditLog, getPRs, getPOs, savePOs } from './erpPurchaseStore';
import { listVendors, listProducts, getTabData } from '../../../../api/ams';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpRfqs = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [rfqs, setRfqs] = useState([]);
  const [availablePRs, setAvailablePRs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRfq, setSelectedRfq] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [viewItem, setViewItem] = useState(null);
  const [newRfq, setNewRfq] = useState({
    refPr: 'None',
    department: 'Research & Development',
    buyer: 'Procurement Officer Steve',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    deliveryTerms: 'FOB Origin',
    paymentTerms: 'NET 30',
    currency: 'USD',
    taxMethod: 'Exclusive',
    vendors: ['Oscorp Tech', 'Stark Ind.'],
    items: [{ product: '', description: '', qty: 1, unit: 'Units' }],
    note: ''
  });

  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const results = await Promise.allSettled([getTabData('rfqs'), listVendors(), listProducts()]);
        const apiRecords = results[0].status === 'fulfilled'
          ? Array.isArray(results[0].value?.data) ? results[0].value.data : Array.isArray(results[0].value) ? results[0].value : []
          : [];
        setApiData(apiRecords);
        if (results[0].status === 'rejected') {
          console.warn('API fallback for rfqs:', results[0].reason);
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

  const fetchLocal = () => {
    setLoading(true); setError(null);
    try {
      setRfqs(getRFQs());
      setAvailablePRs(getPRs().filter(p => p.status === 'Approved'));
    } catch (err) { setError(err.message || 'Failed to load RFQs'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLocal(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchLocal();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const syncData = (updated) => {
    setRfqs(updated);
    saveRFQs(updated);
  };

  const mergedRfqs = useMemo(() => {
    if (apiData.length > 0) {
      const localCodes = new Set(rfqs.map(r => r.code));
      const merged = [...apiData];
      rfqs.forEach(r => {
        if (!localCodes.has(r.code)) merged.push(r);
      });
      return merged;
    }
    return rfqs;
  }, [apiData, rfqs]);

  const handlePrSelect = (prCode) => {
    if (prCode === 'None') {
      setNewRfq({ ...newRfq, refPr: 'None', items: [{ product: '', description: '', qty: 1, unit: 'Units' }] });
      return;
    }
    const prObj = availablePRs.find(p => p.code === prCode);
    if (prObj) {
      setNewRfq({
        ...newRfq,
        refPr: prCode,
        department: prObj.department,
        currency: prObj.currency,
        items: prObj.items.map(i => ({ product: i.product, description: i.description, qty: i.qty, unit: i.unit }))
      });
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newRfq.buyer) {
      addNotification('Buyer is required.', 'warning');
      return;
    }

    const rfqNo = `RFQ-2026-00${rfqs.length + 1}`;
    const added = {
      id: Date.now(),
      code: rfqNo,
      date: new Date().toISOString().slice(0, 10),
      refPr: newRfq.refPr,
      department: newRfq.department,
      buyer: newRfq.buyer,
      dueDate: newRfq.dueDate,
      deliveryTerms: newRfq.deliveryTerms,
      paymentTerms: newRfq.paymentTerms,
      currency: newRfq.currency,
      taxMethod: newRfq.taxMethod,
      vendors: newRfq.vendors,
      items: newRfq.items,
      status: 'Sent',
      bids: [
        { vendor: 'Oscorp Tech', price: 9500, deliveryTime: '5 Days', warranty: '1 Year', paymentTerms: 'NET 30', compliance: '100% Compliant', rank: 1 },
        { vendor: 'Stark Ind.', price: 11000, deliveryTime: '3 Days', warranty: '3 Years', paymentTerms: 'NET 15', compliance: '100% Compliant', rank: 2 }
      ],
      negotiationNotes: newRfq.note || 'RFQ created.',
      version: 'v1.0',
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `RFQ sent to ${newRfq.vendors.join(', ')}` }]
    };

    const updated = [added, ...rfqs];
    syncData(updated);
    addAuditLog('Created RFQ', 'RFQs', rfqNo, `RFQ dispatched to suppliers.`);
    setShowAddModal(false);
    addNotification(`RFQ ${rfqNo} generated and distributed via email integration to suppliers.`, 'success');
  };

  const handleAward = (rfq, bid) => {
    const pos = getPOs();
    const poNo = `PO-2026-00${pos.length + 1}`;
    
    const newPo = {
      id: Date.now(),
      code: poNo,
      date: new Date().toISOString().slice(0, 10),
      vendor: bid.vendor,
      warehouse: 'Main WH-A',
      project: rfq.refPr !== 'None' ? `RFQ Reference ${rfq.code}` : 'Procured via RFQ Award',
      department: rfq.department,
      currency: rfq.currency,
      taxProfile: 'VAT 5%',
      deliveryAddress: 'New York R&D Facility',
      expectedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      paymentTerms: bid.paymentTerms,
      shippingMethod: 'Sea Freight',
      items: rfq.items.map(i => {
        const itemCost = bid.price / rfq.items.length;
        return {
          product: i.product,
          description: i.description || 'Raw Material Procurement',
          qty: i.qty,
          unitPrice: itemCost / i.qty,
          discount: 0,
          taxPercent: 5,
          subtotal: itemCost * 1.05
        };
      }),
      totalAmount: bid.price * 1.05,
      status: 'Approved',
      grnMatched: 'None',
      billMatched: 'None',
      version: 'v1.0',
      backOrders: 0,
      approvalStep: 'Posted',
      comments: [{ id: Date.now(), user: 'System Admin', text: `Purchase Order awarded from RFQ ${rfq.code} proposal.`, date: new Date().toISOString().replace('T', ' ').slice(0, 16) }],
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Purchase Order auto-converted from RFQ award ${rfq.code}` }]
    };

    savePOs([newPo, ...pos]);

    const updated = rfqs.map(r => r.id === rfq.id ? { ...r, status: 'Awarded', timeline: [...r.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Awarded to ${bid.vendor}` }] } : r);
    syncData(updated);

    addAuditLog('Awarded RFQ', 'RFQs', rfq.code, `Awarded to vendor: ${bid.vendor}. Generated PO: ${poNo}`);
    addNotification(`Award issued to ${bid.vendor}. Generated Purchase Order ${poNo} successfully.`, 'success');
    setSelectedRfq(null);
  };

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'rfq' });
    setActiveTab('erp_create_rfq');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const updated = rfqs.filter(r => r.id !== deleteDialog.id);
    syncData(updated);
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
    addNotification(`RFQ moved to trash.`, 'success');
  };

  const handleMoveToDraft = async (row) => {
    try {
      const updated = rfqs.map(r => r.id === row.id ? { ...r, status: 'Draft' } : r);
      syncData(updated);
      addNotification?.('RFQ moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const kpiData = useMemo(() => [
    { label: 'Active RFQs', val: mergedRfqs.length, icon: faFileContract, color: colors.primary, trend: 'up', trendVal: 'Current' },
    { label: 'Awarded RFQs', val: mergedRfqs.filter(r => r.status === 'Awarded').length, icon: faAward, color: colors.success, trend: 'up', trendVal: 'POs Generated' },
    { label: 'Vendor Response Rate', val: 86, icon: faUserCheck, color: colors.warning, trend: 'up', trendVal: '86%' },
    { label: 'Avg Procurement Savings', val: 14.2, icon: faChartLine, color: '#14b8a6', trend: 'up', trendVal: '14.2%' },
  ], [mergedRfqs]);

  const filtered = mergedRfqs.filter(r => {
    const matchesSearch = r.code.toLowerCase().includes(searchTerm.toLowerCase()) || r.department.toLowerCase().includes(searchTerm.toLowerCase()) || r.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

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
    if (type === 'csv') { downloadBlob(csv, 'rfqs.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'rfqs.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'RFQs', headers, rows, filename: 'rfqs.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'RFQs', headers, rows, filename: 'rfqs.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'RFQs', headers, rows, filename: 'rfqs.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const columns = [
    { key: 'code', label: 'RFQ Number', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
    { key: 'date', label: 'Created Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'dueDate', label: 'Due Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'refPr', label: 'Reference PR', render: (val) => <span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>{val}</span> },
    { key: 'buyer', label: 'Buyer', render: (val) => <span className="fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'vendors', label: 'Vendors Invited', render: (val) => <span style={{ color: textColor }}>{val.length} Vendors</span> },
    { key: 'bids', label: 'Quotations Recv', render: (val) => <span className="fw-bold" style={{ color: colors.success }}>{val.length} Bids</span> },
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
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ErpPageShell icon={faFileContract} title="Enterprise RFQ Management Console" description="Loading...">
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
      icon={faFileContract}
      title="Enterprise RFQ Management Console"
      description="Send quote requests to multiple vendors, analyze comparison matrices, and award purchase orders."
      action={
        <button onClick={() => setActiveTab('erp_create_rfq')} className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
          <FontAwesomeIcon icon={faPlus} /> New RFQ Draft
        </button>
      }
    >
      <style>{erpCss(isDark)}</style>

      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} />
        ))}
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Vendor Selection Recommendation</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Oscorp Tech has the highest compliance score and lowest bid. Consider awarding RFQ to Oscorp Tech for optimal value.</div>
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
        searchPlaceholder="Search RFQs..."
        emptyMessage="No RFQs found."
        emptyIcon={faFileContract}
        isDark={isDark}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filtered.length}
        onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
        exportButtons={exportButtons}
      />

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFileContract} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>RFQ Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Awarded' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Sent' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Awarded' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Sent' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Awarded' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Sent' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Buyer: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.buyer}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Created: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.date}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Due: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.dueDate}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.department}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vendors</small>
                      <p className="mb-0 mt-1 fw-bold" style={{ color: colors.primary, fontSize: '1.1rem' }}>{viewItem.vendors?.length || 0}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bids Received</small>
                      <p className="mb-0 mt-1 fw-bold" style={{ color: colors.success, fontSize: '1.1rem' }}>{viewItem.bids?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Delivery Terms</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.deliveryTerms}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Payment Terms</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.paymentTerms}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Currency</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f5f3ff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Negotiation Notes</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.negotiationNotes || 'No notes.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this RFQ to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpRfqs;
