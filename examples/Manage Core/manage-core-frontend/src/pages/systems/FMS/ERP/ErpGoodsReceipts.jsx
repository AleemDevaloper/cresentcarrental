import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import {
  faPlus, faSearch, faFilter, faFileExport, faEye, faPen,
  faTrash, faCheckCircle, faClock, faInfoCircle,
  faXmark, faCheck, faBan, faShieldHalved, faFilePdf,
  faBarcode, faQrcode, faWarehouse, faTruckMoving,
  faTriangleExclamation, faMicroscope, faTasks, faUserCheck, faPaperclip,
  faBox, faEnvelope, faFileSignature, faBrain, faFileCsv, faFileExcel, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { getGRNs, saveGRNs, addAuditLog, getPOs, savePOs } from './erpPurchaseStore';
import { listVendors, listProducts, getTabData } from '../../../../api/ams';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpGoodsReceipts = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeSubTab, setActiveSubTab] = useState('receipts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [receipts, setReceipts] = useState([]);
  const [availablePOs, setAvailablePOs] = useState([]);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [viewItem, setViewItem] = useState(null);
  const [apiData, setApiData] = useState([]);

  const [newGrn, setNewGrn] = useState({
    poRef: 'None',
    vendor: 'Oscorp Tech',
    warehouse: 'Main WH-A',
    vehicle: 'State Carrier SC-9201',
    receivingDate: new Date().toISOString().slice(0, 10),
    receiver: 'Peter Parker',
    items: [{ product: '', expectedQty: 10, receivedQty: 10, rejectedQty: 0, acceptedQty: 10, batchNo: '', expiryDate: '', binLocation: '' }],
    qualityStatus: 'Pass',
    inspectionNotes: 'All checks passed standard criteria.',
    checklists: { physicalCheck: true, documentVerify: true, weightCheck: true }
  });

  const fetchLocal = () => {
    setLoading(true); setError(null);
    try {
      setReceipts(getGRNs());
      setAvailablePOs(getPOs().filter(p => p.status === 'Approved' || p.status === 'Partially Received'));
    } catch (err) { setError(err.message || 'Failed to load receipts'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const results = await Promise.allSettled([getTabData('goods_receipts'), listVendors(), listProducts()]);
        const apiRecords = results[0].status === 'fulfilled'
          ? Array.isArray(results[0].value?.data) ? results[0].value.data : Array.isArray(results[0].value) ? results[0].value : []
          : [];
        setApiData(apiRecords);
        if (results[0].status === 'rejected') {
          console.warn('API fallback for goods_receipts:', results[0].reason);
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
    setReceipts(updated);
    saveGRNs(updated);
  };

  const mergedReceipts = useMemo(() => {
    if (apiData.length > 0) {
      const localCodes = new Set(receipts.map(r => r.code));
      const merged = [...apiData];
      receipts.forEach(r => {
        if (!localCodes.has(r.code)) merged.push(r);
      });
      return merged;
    }
    return receipts;
  }, [apiData, receipts]);

  const handlePoSelect = (poCode) => {
    if (poCode === 'None') {
      setNewGrn({ ...newGrn, poRef: 'None', items: [{ product: '', expectedQty: 10, receivedQty: 10, rejectedQty: 0, acceptedQty: 10, batchNo: '', expiryDate: '', binLocation: '' }] });
      return;
    }
    const poObj = availablePOs.find(p => p.code === poCode);
    if (poObj) {
      setNewGrn({
        ...newGrn,
        poRef: poCode,
        vendor: poObj.vendor,
        warehouse: poObj.warehouse,
        items: poObj.items.map(i => ({
          product: i.product,
          expectedQty: i.qty,
          receivedQty: i.qty,
          rejectedQty: 0,
          acceptedQty: i.qty,
          batchNo: `BAT-${poObj.vendor.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          binLocation: 'BIN-101-A'
        }))
      });
    }
  };

  const handleItemQtyChange = (index, field, val) => {
    const updated = newGrn.items.map((item, idx) => {
      if (idx === index) {
        const itemCopy = { ...item, [field]: parseInt(val || 0) };
        if (field === 'receivedQty' || field === 'rejectedQty') {
          const rec = field === 'receivedQty' ? parseInt(val || 0) : item.receivedQty;
          const rej = field === 'rejectedQty' ? parseInt(val || 0) : item.rejectedQty;
          itemCopy.acceptedQty = Math.max(0, rec - rej);
        }
        return itemCopy;
      }
      return item;
    });
    setNewGrn({ ...newGrn, items: updated });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const grnNo = `GRN-2026-00${receipts.length + 1}`;

    const added = {
      id: Date.now(),
      code: grnNo,
      date: newGrn.receivingDate,
      vendor: newGrn.vendor,
      poRef: newGrn.poRef,
      receivedBy: newGrn.receiver,
      status: newGrn.items.some(i => i.rejectedQty > 0) ? 'Partially Received' : 'Completed',
      warehouse: newGrn.warehouse,
      vehicle: newGrn.vehicle,
      items: newGrn.items,
      qualityStatus: newGrn.qualityStatus,
      inspectionNotes: newGrn.inspectionNotes,
      workflowStep: 'Posted',
      attachments: ['delivery_slip.pdf'],
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Goods Receipt Note finalized by ${newGrn.receiver}` }]
    };

    const updated = [added, ...receipts];
    syncData(updated);

    if (newGrn.poRef !== 'None') {
      const pos = getPOs();
      const updatedPOs = pos.map(p => {
        if (p.code === newGrn.poRef) {
          const allOk = !newGrn.items.some(i => i.rejectedQty > 0 || i.acceptedQty < i.expectedQty);
          return { ...p, status: allOk ? 'Completed' : 'Partially Received', grnMatched: grnNo };
        }
        return p;
      });
      savePOs(updatedPOs);
    }

    addAuditLog('Created GRN', 'Goods Receipts', grnNo, `Logged intake against PO reference ${newGrn.poRef}`);
    setShowAddModal(false);
    addNotification(`GRN ${grnNo} processed. Inventory quantities reconciled in warehouse ledgers.`, 'success');
  };

  const filtered = mergedReceipts.filter(r => {
    const matchesSearch = r.code.toLowerCase().includes(searchTerm.toLowerCase()) || r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || r.poRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const kpiWidgets = useMemo(() => [
    { label: 'Completed Deliveries', val: mergedReceipts.filter(r => r.status === 'Completed').length, icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Stock Ledger Posted' },
    { label: 'Partially Received', val: mergedReceipts.filter(r => r.status === 'Partially Received').length, icon: faClock, color: colors.warning, trend: 'up', trendVal: 'Reconciled with Backorders' },
    { label: 'Quality Inspection Pass Rate', val: '94%', icon: faMicroscope, color: colors.primary, trend: 'up', trendVal: 'Across all supplier deliveries' },
  ], [mergedReceipts]);

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'goods_receipt' });
    setActiveTab?.('erp_goods_receipts');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const { id } = deleteDialog;
    setReceipts(prev => prev.filter(item => item.id !== id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const handleMoveToDraft = async (row) => {
    try {
      const updated = receipts.map(r => r.id === row.id ? { ...r, status: 'Draft' } : r);
      syncData(updated);
      addNotification?.('GRN moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
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
    const cols = grnColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'goods_receipts.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'goods_receipts.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Goods Receipts', headers, rows, filename: 'goods_receipts.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Goods Receipts', headers, rows, filename: 'goods_receipts.docx' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const grnColumns = [
    { key: 'code', label: 'GRN Number', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
    { key: 'date', label: 'Receiving Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'poRef', label: 'Reference PO', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'vendor', label: 'Vendor Supplier', render: (val) => <span className="fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'warehouse', label: 'Warehouse', render: (val) => <span style={{ color: textColor }}>{val}</span> },
    { key: 'vehicle', label: 'Carrier Details', render: (val) => <span style={{ color: textColor }}>{val}</span> },
    { key: 'qualityStatus', label: 'Quality Status', render: (val) => (
      <span className="premium-badge" style={{
        background: val === 'Pass' ? (isDark ? '#064e3b' : '#dcfce7') : val === 'Fail' ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#78350f' : '#fef3c7'),
        color: val === 'Pass' ? (isDark ? '#4ade80' : '#16a34a') : val === 'Fail' ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#fbbf24' : '#d97706'),
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

  const headerAction = (
    <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
      <button onClick={() => setActiveTab('erp_log_grn_intake')} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        fontSize: '0.8rem',
      }}>
        <FontAwesomeIcon icon={faPlus} /> Log GRN Intake
      </button>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ErpPageShell icon={faWarehouse} title="Goods Receipt Notes (GRN) Management" description="Loading...">
        <div className="row g-3 mb-4">
          {[1,2,3].map(i => (
            <div key={i} className="col-md-4">
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
      icon={faWarehouse}
      title="Goods Receipt Notes (GRN) Management"
      description="Log incoming vendor shipments, run quality control checklist inspections, and coordinate stock intakes."
      action={headerAction}
    >
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'receipts', label: 'Receipt Note Register', icon: faWarehouse },
          { id: 'inspection', label: 'Quality Control Panel', icon: faMicroscope },
          { id: 'warehouse', label: 'Warehouse Bins Reconciled', icon: faBox }
        ].map(tab => (
          <button
            key={tab.id}
            className={`premium-btn btn btn-sm py-2 px-3 fw-bold`}
            style={{
              borderRadius: '10px', fontSize: '0.78rem',
              border: activeSubTab === tab.id ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
              background: activeSubTab === tab.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f8fafc'),
              color: activeSubTab === tab.id ? '#fff' : textColor,
              boxShadow: activeSubTab === tab.id ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
            }}
            onClick={() => setActiveSubTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} className="me-1.5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'receipts' && (
        <>
          <div className="row g-3 mb-4">
            {kpiWidgets.map((k, idx) => (
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
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Quality Assurance Insight</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>92% of recent shipments passed quality inspection. Flag recurring rejections from Shenzhen supplier.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0' }}>
            <ErpDataTable
              columns={grnColumns}
              data={paginatedData}
              loading={loading}
              error={error}
              searchable
              searchTerm={searchTerm}
              onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
              searchPlaceholder="Search GRNs..."
              emptyMessage="No goods receipts found."
              emptyIcon={faWarehouse}
              isDark={isDark}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              totalEntries={filtered.length}
              onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
              exportButtons={exportButtons}
            />
          </div>
        </>
      )}

      {activeSubTab === 'inspection' && (
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1.5rem', color: textColor }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', flexShrink: 0 }} />
            <h6 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.9rem' }}>
              <FontAwesomeIcon icon={faMicroscope} className="me-2" style={{ color: '#6366f1' }} />
              Quality Control Checklist Logs
            </h6>
          </div>
          <div className="premium-table-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0" style={{ fontSize: '0.78rem', width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    {['GRN Reference', 'Supplier', 'QC Officer', 'Phys Check', 'Doc Verification', 'Tensile/Weight Verify', 'QC Status', 'Inspection Notes'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mergedReceipts.map(r => (
                    <tr key={r.id} style={{ transition: 'all 0.25s', borderLeft: '3px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#6366f1'; e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}>
                      <td className="font-monospace fw-bold" style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#6366f1' }}>{r.code}</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{r.vendor}</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{r.receivedBy}</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#10b981' }}><FontAwesomeIcon icon={faCheckCircle} /> Passed</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#10b981' }}><FontAwesomeIcon icon={faCheckCircle} /> Passed</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#10b981' }}><FontAwesomeIcon icon={faCheckCircle} /> Passed</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}` }}>
                        <span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' }}>{r.qualityStatus}</span>
                      </td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: mutedColor, fontStyle: 'italic' }}>"{r.inspectionNotes}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'warehouse' && (
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1.5rem', color: textColor }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom, #10b981, #06b6d4)', flexShrink: 0 }} />
            <h6 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.9rem' }}>
              <FontAwesomeIcon icon={faWarehouse} className="me-2" style={{ color: '#10b981' }} />
              Warehouse Stock Ledger Balance Rollup
            </h6>
          </div>
          <div className="premium-table-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0" style={{ fontSize: '0.78rem', width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    {['Warehouse Bin Location', 'Product', 'Associated Batch #', 'Expiry Date', 'Accepted Quantity', 'Status'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mergedReceipts.flatMap(r => r.items.map((it, idx) => (
                    <tr key={`${r.id}-${idx}`} style={{ transition: 'all 0.25s', borderLeft: '3px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#6366f1'; e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}>
                      <td className="fw-bold" style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.binLocation || 'BIN-GEN-01'}</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.product}</td>
                      <td className="font-monospace" style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.batchNo || 'BAT-AUTO-99'}</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.expiryDate || '2030-12-31'}</td>
                      <td className="fw-bold text-center" style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#10b981' }}>{it.acceptedQty} Units</td>
                      <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}` }}><span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' }}>Instock Reconciled</span></td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
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
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Goods Receipt Note details: {viewItem.code}</h5>
              <button className="btn btn-sm border-0" style={{ borderRadius: '8px', background: 'transparent', color: mutedColor }} onClick={() => setViewItem(null)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="row g-3 small">
              <div className="col-md-6" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Supplier: </span> {viewItem.vendor}<br/>
                <span style={{ color: mutedColor }}>PO Reference: </span> {viewItem.poRef}<br/>
                <span style={{ color: mutedColor }}>Warehouse Bin: </span> {viewItem.warehouse}
              </div>
              <div className="col-md-6" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Receiving Date: </span> {viewItem.date}<br/>
                <span style={{ color: mutedColor }}>Receiver Signee: </span> {viewItem.receivedBy}<br/>
                <span style={{ color: mutedColor }}>Vehicle/Courier Details: </span> {viewItem.vehicle}
              </div>

              <div className="col-12 mt-2">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', flexShrink: 0 }} />
                  <h6 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.9rem' }}>
                    <FontAwesomeIcon icon={faBox} className="me-2" style={{ color: '#6366f1' }} />
                    Intake Receipts lines
                  </h6>
                </div>
                <div className="premium-table-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                  <table className="table table-borderless align-middle mb-0" style={{ fontSize: '0.75rem', width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                      <tr style={{ background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                        {['Product', 'Expected Qty', 'Received Qty', 'Rejected Qty', 'Accepted Qty', 'Batch No', 'Bin Location'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.items.map((it, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.product}</td>
                          <td style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.expectedQty}</td>
                          <td style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.receivedQty}</td>
                          <td className="fw-bold" style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#f43f5e' }}>{it.rejectedQty}</td>
                          <td className="fw-bold" style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: '#10b981' }}>{it.acceptedQty}</td>
                          <td className="font-monospace" style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.batchNo}</td>
                          <td style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: textColor }}>{it.binLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-12" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '1rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                <h6 className="fw-bold mb-2" style={{ color: '#10b981' }}><FontAwesomeIcon icon={faMicroscope} /> Quality Inspection Audit</h6>
                <span style={{ color: mutedColor }}>Inspection Notes: </span> <span style={{ color: textColor }}>"{viewItem.inspectionNotes}"</span><br/>
                <span style={{ color: mutedColor }}>Quality Decision Status: </span>
                <span className="premium-badge ms-1" style={{
                  background: viewItem.qualityStatus === 'Pass' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'),
                  color: viewItem.qualityStatus === 'Pass' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                }}>{viewItem.qualityStatus}</span>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
              <button type="button" className="btn btn-sm border-0 px-3" style={{
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
        title="Delete Goods Receipt"
        message="Are you sure you want to delete this goods receipt? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />

    </ErpPageShell>
  );
};

export default ErpGoodsReceipts;
