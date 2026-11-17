import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import {
  faPlus, faSearch, faFilter, faFileExport, faEye, faPen,
  faTrash, faCheckCircle, faClock, faInfoCircle,
  faXmark, faCheck, faTimesCircle, faFolderOpen,
  faCalendarAlt, faExclamationTriangle, faArrowRight,
  faHistory, faDollarSign, faUniversity, faList, faBuilding,
  faFileCsv, faFileExcel, faFilePdf, faFileWord, faFileAlt,
  faEnvelope, faFileSignature, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { getPRs, savePRs, addAuditLog, getRFQs, saveRFQs, getPOs, savePOs } from './erpPurchaseStore';
import { listVendors, listProducts, getTabData } from '../../../../api/ams';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpPurchaseRequisitions = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [requisitions, setRequisitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [selectedPR, setSelectedPR] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [newRequisition, setNewRequisition] = useState({
    department: 'Research & Development',
    costCenter: 'CC-RND-101',
    project: 'Project Alpha Tech',
    requiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    priority: 'High',
    vendorSuggestion: 'Oscorp Tech',
    itemCategory: 'Raw Materials',
    warehouse: 'Main WH-A',
    currency: 'USD',
    taxProfile: 'VAT 5%',
    deliveryLocation: 'New York R&D Facility',
    requestedBy: 'Bruce Banner',
    budgetLimit: 20000,
    items: [
      { product: '', description: '', qty: 1, unit: 'Units', estCost: 100 }
    ],
    attachments: [],
    note: ''
  });

  const fetchLocal = () => {
    setLoading(true); setError(null);
    try { setRequisitions(getPRs()); }
    catch (err) { setError(err.message || 'Failed to load requisitions'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const results = await Promise.allSettled([getTabData('purchase_requisitions'), listVendors(), listProducts()]);
        const apiRecords = results[0].status === 'fulfilled'
          ? Array.isArray(results[0].value?.data) ? results[0].value.data : Array.isArray(results[0].value) ? results[0].value : []
          : [];
        setApiData(apiRecords);
        if (results[0].status === 'rejected') {
          console.warn('API fallback for purchase_requisitions:', results[0].reason);
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

  useEffect(() => {
    const onRefresh = () => fetchLocal();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ErpPageShell icon={faList} title="Enterprise Purchase Requisitions" description="Loading...">
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

  const mergedRequisitions = useMemo(() => {
    if (apiData.length > 0) {
      const localCodes = new Set(requisitions.map(r => r.code));
      const merged = [...apiData];
      requisitions.forEach(r => {
        if (!localCodes.has(r.code)) merged.push(r);
      });
      return merged;
    }
    return requisitions;
  }, [apiData, requisitions]);

  const syncData = (updated) => {
    setRequisitions(updated);
    savePRs(updated);
  };

  const handleAddItemRow = () => {
    setNewRequisition({
      ...newRequisition,
      items: [...newRequisition.items, { product: '', description: '', qty: 1, unit: 'Units', estCost: 100 }]
    });
  };

  const handleRemoveItemRow = (index) => {
    const newItems = newRequisition.items.filter((_, idx) => idx !== index);
    setNewRequisition({ ...newRequisition, items: newItems });
  };

  const handleItemChange = (index, field, val) => {
    const updated = newRequisition.items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setNewRequisition({ ...newRequisition, items: updated });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newRequisition.requestedBy) {
      addNotification('Requested By is required.', 'warning');
      return;
    }

    const duplicate = requisitions.find(r => r.requestedBy.toLowerCase() === newRequisition.requestedBy.toLowerCase() && r.project === newRequisition.project && r.status === 'Pending');
    if (duplicate) {
      addNotification(`Warning: Potential duplicate request detected under ${newRequisition.project} by ${newRequisition.requestedBy}.`, 'warning');
    }

    const totalEst = newRequisition.items.reduce((sum, item) => sum + (parseFloat(item.qty || 0) * parseFloat(item.estCost || 0)), 0);
    if (totalEst > newRequisition.budgetLimit) {
      addNotification(`Budget Validation Failed! Estimated Cost ($${totalEst.toLocaleString()}) exceeds Cost Center Budget Limit ($${newRequisition.budgetLimit.toLocaleString()}). Approval Workflow will flag this.`, 'danger');
    }

    const prNo = `PRQ-2026-00${requisitions.length + 1}`;
    const added = {
      id: Date.now(),
      code: prNo,
      date: new Date().toISOString().slice(0, 10),
      department: newRequisition.department,
      costCenter: newRequisition.costCenter,
      project: newRequisition.project,
      requiredDate: newRequisition.requiredDate,
      priority: newRequisition.priority,
      vendorSuggestion: newRequisition.vendorSuggestion,
      itemCategory: newRequisition.itemCategory,
      warehouse: newRequisition.warehouse,
      currency: newRequisition.currency,
      taxProfile: newRequisition.taxProfile,
      deliveryLocation: newRequisition.deliveryLocation,
      requestedBy: newRequisition.requestedBy,
      items: newRequisition.items,
      budgetAmount: totalEst,
      budgetLimit: newRequisition.budgetLimit,
      status: 'Pending',
      approvalHistory: [
        { step: 'Employee Request', user: newRequisition.requestedBy, date: new Date().toISOString().replace('T', ' ').slice(0, 16), notes: newRequisition.note || 'PR Created.' }
      ],
      attachments: ['uploaded_document.pdf'],
      timeline: [
        { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `PR created by ${newRequisition.requestedBy}` }
      ]
    };

    const updated = [added, ...requisitions];
    syncData(updated);
    addAuditLog('Created PR', 'Requisitions', prNo, `Requisition total of $${totalEst.toLocaleString()} created.`);
    setShowAddModal(false);
    setNewRequisition({
      department: 'Research & Development',
      costCenter: 'CC-RND-101',
      project: 'Project Alpha Tech',
      requiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      priority: 'High',
      vendorSuggestion: 'Oscorp Tech',
      itemCategory: 'Raw Materials',
      warehouse: 'Main WH-A',
      currency: 'USD',
      taxProfile: 'VAT 5%',
      deliveryLocation: 'New York R&D Facility',
      requestedBy: 'Bruce Banner',
      budgetLimit: 20000,
      items: [{ product: '', description: '', qty: 1, unit: 'Units', estCost: 100 }],
      attachments: [],
      note: ''
    });
    addNotification(`Purchase Requisition ${prNo} submitted into organizational Approval Matrix.`, 'success');
  };

  const handleApprove = (id) => {
    const updated = requisitions.map(r => {
      if (r.id === id) {
        let nextStatus = r.status;
        const currentTierCount = r.approvalHistory.length;
        const tiers = ['Employee Request', 'Manager Approval', 'Department Head Approval', 'Finance Approval', 'Procurement Approval', 'Final Approval'];
        
        let newHistory = [...r.approvalHistory];
        if (currentTierCount < tiers.length) {
          newHistory.push({
            step: tiers[currentTierCount],
            user: 'System Admin',
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            notes: 'Approved. Advanced automatically.'
          });
        }

        if (newHistory.length === tiers.length) {
          nextStatus = 'Approved';
        }

        return {
          ...r,
          status: nextStatus,
          approvalHistory: newHistory,
          timeline: [...r.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Approved step: ${tiers[currentTierCount || 0]}` }]
        };
      }
      return r;
    });

    const approvedItem = updated.find(r => r.id === id);
    syncData(updated);
    addAuditLog('Approved PR tier', 'Requisitions', approvedItem.code, `Tier approved. Current status: ${approvedItem.status}`);
    addNotification(`Requisition ${approvedItem.code} advanced through approval workflow level.`, 'success');
    if (selectedPR && selectedPR.id === id) {
      setSelectedPR(approvedItem);
    }
  };

  const handleReject = (id) => {
    const updated = requisitions.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Rejected',
          timeline: [...r.timeline, { date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: 'Requisition Rejected' }]
        };
      }
      return r;
    });
    syncData(updated);
    addAuditLog('Rejected PR', 'Requisitions', id, 'Requisition flagged as Rejected.');
    addNotification('Requisition rejected and returned to draft status.', 'error');
  };

  const handleConvertToRFQ = (pr) => {
    const rfqs = getRFQs();
    const rfqNo = `RFQ-2026-00${rfqs.length + 1}`;
    const newRfq = {
      id: Date.now(),
      code: rfqNo,
      date: new Date().toISOString().slice(0, 10),
      refPr: pr.code,
      department: pr.department,
      buyer: 'Procurement Officer Steve',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      deliveryTerms: 'FOB Origin',
      paymentTerms: 'NET 30',
      currency: pr.currency,
      taxMethod: 'Exclusive',
      vendors: [pr.vendorSuggestion || 'Oscorp Tech'],
      items: pr.items.map(i => ({ product: i.product, description: i.description, qty: i.qty, unit: i.unit })),
      status: 'Sent',
      bids: [],
      negotiationNotes: 'RFQ auto-converted from PR.',
      version: 'v1.0',
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `RFQ auto-created from Requisition ${pr.code}` }]
    };

    saveRFQs([newRfq, ...rfqs]);

    const updatedPrs = requisitions.map(r => r.id === pr.id ? { ...r, status: 'Converted to RFQ' } : r);
    syncData(updatedPrs);

    addAuditLog('Convert to RFQ', 'Requisitions', pr.code, `Requisition converted to RFQ ${rfqNo}`);
    addNotification(`Successfully converted PR ${pr.code} to Request for Quotation ${rfqNo}`, 'success');
    setSelectedPR(null);
  };

  const handleConvertToPO = (pr) => {
    const pos = getPOs();
    const poNo = `PO-2026-00${pos.length + 1}`;
    const newPo = {
      id: Date.now(),
      code: poNo,
      date: new Date().toISOString().slice(0, 10),
      vendor: pr.vendorSuggestion || 'Oscorp Tech',
      warehouse: pr.warehouse || 'Main WH-A',
      project: pr.project,
      department: pr.department,
      currency: pr.currency,
      taxProfile: pr.taxProfile,
      deliveryAddress: pr.deliveryLocation,
      expectedDelivery: pr.requiredDate,
      paymentTerms: 'NET 30',
      shippingMethod: 'Sea Freight',
      items: pr.items.map(i => {
        const sub = (parseFloat(i.qty) * parseFloat(i.estCost));
        return {
          product: i.product,
          description: i.description,
          qty: i.qty,
          unitPrice: i.estCost,
          discount: 0,
          taxPercent: 5,
          subtotal: sub * 1.05
        };
      }),
      totalAmount: pr.budgetAmount * 1.05,
      status: 'Approved',
      grnMatched: 'None',
      billMatched: 'None',
      version: 'v1.0',
      backOrders: 0,
      approvalStep: 'Posted',
      comments: [],
      timeline: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), text: `Purchase Order auto-converted from Requisition ${pr.code}` }]
    };

    savePOs([newPo, ...pos]);

    const updatedPrs = requisitions.map(r => r.id === pr.id ? { ...r, status: 'Converted to Purchase Order' } : r);
    syncData(updatedPrs);

    addAuditLog('Convert to PO', 'Requisitions', pr.code, `Requisition converted to PO ${poNo}`);
    addNotification(`Successfully converted PR ${pr.code} to Purchase Order ${poNo}`, 'success');
    setSelectedPR(null);
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
    const cols = columns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'purchase_requisitions.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'purchase_requisitions.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Purchase Requisitions', headers, rows, filename: 'purchase_requisitions' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Purchase Requisitions', headers, rows, filename: 'purchase_requisitions' }); }
    else if (type === 'word') { await exportWord({ title: 'Purchase Requisitions', headers, rows, filename: 'purchase_requisitions' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const filtered = mergedRequisitions.filter(r => {
    const matchesSearch = r.code.toLowerCase().includes(searchTerm.toLowerCase()) || r.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) || r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const kpiWidgets = useMemo(() => [
    { label: 'Pending Requests', val: mergedRequisitions.filter(r => r.status === 'Pending').length, icon: faClock, color: colors.warning, trend: 'up', trendVal: 'Awaiting Approval Tiers' },
    { label: 'Approved Budget Rollup', val: '$' + mergedRequisitions.filter(r => r.status === 'Approved').reduce((acc, curr) => acc + curr.budgetAmount, 0).toLocaleString(), icon: faDollarSign, color: colors.success, trend: 'up', trendVal: 'Ready for Conversion' },
    { label: 'Rejected Requests', val: mergedRequisitions.filter(r => r.status === 'Rejected').length, icon: faXmark, color: colors.danger, trend: 'up', trendVal: 'Returned to Draft/Edit' },
    { label: 'Converted Requests', val: mergedRequisitions.filter(r => r.status.startsWith('Converted')).length, icon: faCheckCircle, color: colors.primary, trend: 'up', trendVal: 'POs or RFQs Transmitted' }
  ], [mergedRequisitions]);

  const handleViewClick = (row) => {
    setViewItem(row);
  };

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'purchase_requisition' });
    setActiveTab?.('erp_purchase_requisitions');
  };

  const handleDeleteClick = (id, row) => {
    setDeleteDialog({ show: true, id, row, name: row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const { id } = deleteDialog;
    setRequisitions(prev => prev.filter(item => item.id !== id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const handleMoveToDraft = async (row) => {
    try {
      const updated = requisitions.map(r => r.id === row.id ? { ...r, status: 'Draft' } : r);
      syncData(updated);
      addNotification?.('Requisition moved to Draft', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to draft', 'error');
    }
  };

  const columns = [
    { key: 'code', label: 'PR Number', bold: true, render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
    { key: 'requiredDate', label: 'Required Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{val}</span> },
    { key: 'department', label: 'Requesting Department', render: (val) => <span className="fw-bold" style={{ color: textColor }}>{val}</span> },
    { key: 'requestedBy', label: 'Requested By', render: (val) => <span style={{ color: textColor }}>{val}</span> },
    { key: 'costCenter', label: 'Cost Center', render: (val) => <span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>{val}</span> },
    { key: 'budgetAmount', label: 'Total Value', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>${val.toLocaleString()}</span> },
    { key: 'priority', label: 'Priority', render: (val) => (
      <span className="premium-badge" style={{
        background: val === 'High' ? (isDark ? '#7f1d1d' : '#fee2e2') : val === 'Medium' ? (isDark ? '#78350f' : '#fef3c7') : (isDark ? '#1e3a5f' : '#e0e7ff'),
        color: val === 'High' ? (isDark ? '#f87171' : '#dc2626') : val === 'Medium' ? (isDark ? '#fbbf24' : '#d97706') : (isDark ? '#818cf8' : colors.primary),
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
        {row.status === 'Pending' && (
          <>
            <button className="premium-btn btn btn-sm border-0" style={{
              borderRadius: '8px', fontSize: '0.7rem',
              background: isDark ? '#064e3b' : '#dcfce7',
              color: isDark ? '#4ade80' : '#16a34a',
            }} onClick={() => handleApprove(row.id)} title="Approve Tier"><FontAwesomeIcon icon={faCheck} /></button>
            <button className="premium-btn btn btn-sm border-0" style={{
              borderRadius: '8px', fontSize: '0.7rem',
              background: isDark ? '#7f1d1d' : '#fee2e2',
              color: isDark ? '#f87171' : '#dc2626',
            }} onClick={() => handleReject(row.id)} title="Reject"><FontAwesomeIcon icon={faXmark} /></button>
          </>
        )}
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const filterControls = (
    <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
      <option value="All">All Statuses</option>
      <option value="Draft">Draft</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
      <option value="Converted to RFQ">Converted to RFQ</option>
      <option value="Converted to Purchase Order">Converted to Purchase Order</option>
    </select>
  );

  const exportButton = (
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

  return (
    <ErpPageShell
      icon={faList}
      title="Enterprise Purchase Requisitions"
      description="Create, review, approve, and convert internal purchase requirements into RFQs or Purchase Orders."
      action={
        <button onClick={() => setActiveTab('erp_create_requisition')} className="premium-btn btn btn-sm d-flex align-items-center gap-1 px-3" style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.8rem',
          boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        }}>
          <FontAwesomeIcon icon={faPlus} /> New Requisition
        </button>
      }
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((k, idx) => (
          <ErpKpiCard key={idx} label={k.label} value={k.val} icon={k.icon} color={k.color} trend={k.trend} trendVal={k.trendVal} isDark={isDark} colClass="col-md-3" />
        ))}
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Budget Optimization Recommendation</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>3 pending requisitions exceed 80% of their cost center budget. Consider prioritizing high-urgency requests.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="glass-card premium-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
              <h6 style={{ color: textColor }}><FontAwesomeIcon icon={faUniversity} className="me-2" style={{ color: '#f59e0b' }} />Cost Center Budget Utilization</h6>
            </div>
            <div className="mb-2">
              <div className="d-flex justify-content-between small" style={{ color: mutedColor }}>
                <span>R&D Lab (CC-RND-101)</span>
                <span>80% ($12,000 / $15,000)</span>
              </div>
              <div className="progress mt-1" style={{ height: '8px', background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '100px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: '80%', background: 'linear-gradient(90deg, #f59e0b, #f97316)', borderRadius: '100px' }}></div>
              </div>
            </div>
            <div className="mb-1">
              <div className="d-flex justify-content-between small" style={{ color: mutedColor }}>
                <span>HQ Administration (CC-HQ-202)</span>
                <span>90% ($45,000 / $50,000)</span>
              </div>
              <div className="progress mt-1" style={{ height: '8px', background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '100px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: '90%', background: 'linear-gradient(90deg, #f43f5e, #dc2626)', borderRadius: '100px' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card premium-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #06b6d4, #3b82f6)' }} />
              <h6 style={{ color: textColor }}><FontAwesomeIcon icon={faClock} className="me-2" style={{ color: '#06b6d4' }} />Request Aging & Approval Bottlenecks</h6>
            </div>
            <div className="d-flex gap-2 text-center">
              <div className="flex-fill p-2" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRadius: '10px' }}>
                <div style={{ color: mutedColor, fontSize: '0.75rem' }}>&lt; 24h</div>
                <div className="fw-bold" style={{ color: '#10b981' }}>{mergedRequisitions.filter(r => r.status === 'Pending').length} PRs</div>
              </div>
              <div className="flex-fill p-2" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRadius: '10px' }}>
                <div style={{ color: mutedColor, fontSize: '0.75rem' }}>1-3 Days</div>
                <div className="fw-bold" style={{ color: '#f59e0b' }}>0 PRs</div>
              </div>
              <div className="flex-fill p-2" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRadius: '10px' }}>
                <div style={{ color: mutedColor, fontSize: '0.75rem' }}>3+ Days</div>
                <div className="fw-bold" style={{ color: '#f43f5e' }}>0 PRs</div>
              </div>
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
        searchPlaceholder="Search code, requester, dept..."
        filters={filterControls}
        exportButtons={exportButton}
        emptyMessage="No requisitions found."
        emptyIcon={faList}
        isDark={isDark}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filtered.length}
        onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
      />

      {viewItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(6px)'
        }} onClick={() => setViewItem(null)}>
          <div className="glass-card" style={{ borderRadius: '20px', padding: '1.5rem', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', color: textColor }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Requisition Details: {viewItem.code}</h5>
              <button className="premium-btn btn btn-sm border-0" style={{ borderRadius: '8px', background: 'transparent', color: mutedColor }} onClick={() => setViewItem(null)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="row g-3 small">
              <div className="col-md-4" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Department</span><br/>
                <span className="fw-bold">{viewItem.department}</span>
              </div>
              <div className="col-md-4" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Cost Center</span><br/>
                <span className="fw-bold">{viewItem.costCenter}</span>
              </div>
              <div className="col-md-4" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Project / Initiative</span><br/>
                <span className="fw-bold">{viewItem.project}</span>
              </div>
              <div className="col-md-4" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Required Delivery</span><br/>
                <span className="fw-bold">{viewItem.requiredDate}</span>
              </div>
              <div className="col-md-4" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Vendor Suggestion</span><br/>
                <span className="fw-bold">{viewItem.vendorSuggestion}</span>
              </div>
              <div className="col-md-4" style={{ color: textColor }}>
                <span style={{ color: mutedColor }}>Requisitioner</span><br/>
                <span className="fw-bold">{viewItem.requestedBy}</span>
              </div>

              <div className="col-12 mt-3">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faList} className="me-2" style={{ color: '#6366f1' }} />
                    Requisition Items
                  </h6>
                </div>
                <div className="premium-table-wrapper">
                  <table className="premium-table" style={{ fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Estimated Unit Price</th>
                        <th className="text-end">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ color: textColor }}>{item.product}</td>
                          <td style={{ color: textColor }}>{item.description}</td>
                          <td style={{ color: textColor }}>{item.qty}</td>
                          <td style={{ color: textColor }}>{item.unit}</td>
                          <td style={{ color: textColor }}>${parseFloat(item.estCost).toLocaleString()}</td>
                          <td className="fw-bold text-end" style={{ color: textColor }}>${(parseFloat(item.qty) * parseFloat(item.estCost)).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="5" className="text-end fw-bold" style={{ color: textColor }}>Sum Rollup:</td>
                        <td className="fw-bold text-end" style={{ color: '#6366f1' }}>${viewItem.budgetAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-6 mt-3">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faHistory} className="me-2" style={{ color: '#f59e0b' }} />
                    Approval Matrix Cycle
                  </h6>
                </div>
                <div style={{
                  border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.5rem',
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                  maxHeight: '180px', overflowY: 'auto',
                }}>
                  {viewItem.approvalHistory.map((step, idx) => (
                    <div key={idx} className="mb-2 pb-2" style={{ borderBottom: idx < viewItem.approvalHistory.length - 1 ? `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` : 'none' }}>
                      <div className="d-flex justify-content-between fw-bold" style={{ color: '#6366f1' }}>
                        <span>{step.step}</span>
                        <span style={{ color: mutedColor, fontSize: '0.7rem' }}>{step.date}</span>
                      </div>
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Signee: {step.user}</span>
                      <div style={{ color: textColor, fontSize: '0.75rem', fontStyle: 'italic' }}>Notes: &quot;{step.notes}&quot;</div>
                    </div>
                  ))}
                  {viewItem.status === 'Pending' && (
                    <div style={{
                      background: isDark ? '#78350f' : '#fef3c7', borderRadius: '8px', padding: '0.4rem',
                      color: isDark ? '#fbbf24' : '#92400e', fontSize: '0.75rem', marginTop: '0.5rem',
                    }}>
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" /> Awaiting next sign-off in hierarchy tree.
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 mt-3">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #06b6d4, #3b82f6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faFolderOpen} className="me-2" style={{ color: '#06b6d4' }} />
                    Technical Documentation
                  </h6>
                </div>
                <div style={{
                  border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.5rem',
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                }}>
                  {viewItem.attachments.map((file, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0',
                      borderBottom: idx < viewItem.attachments.length - 1 ? `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` : 'none',
                    }}>
                      <span style={{ color: textColor, fontSize: '0.8rem' }}>{file}</span>
                      <a href="#" className="fw-bold" style={{ color: '#6366f1', fontSize: '0.8rem' }} onClick={e => e.preventDefault()}>Download</a>
                    </div>
                  ))}
                  {viewItem.attachments.length === 0 && <span style={{ color: mutedColor, fontSize: '0.75rem' }}>No attachments uploaded</span>}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              {viewItem.status === 'Approved' && (
                <>
                  <button className="premium-btn btn btn-sm border-0 fw-bold" style={{
                    borderRadius: '10px', fontSize: '0.78rem',
                    background: isDark ? '#1e3a5f' : '#e0e7ff',
                    color: '#6366f1',
                  }} onClick={() => handleConvertToRFQ(viewItem)}>
                    <FontAwesomeIcon icon={faArrowRight} className="me-1" /> Convert to RFQ
                  </button>
                  <button className="premium-btn btn btn-sm border-0 fw-bold text-white" style={{
                    borderRadius: '10px', fontSize: '0.78rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                  }} onClick={() => handleConvertToPO(viewItem)}>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Convert to Purchase Order
                  </button>
                </>
              )}
              <button type="button" className="premium-btn btn btn-sm border-0 px-3" style={{
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
        title="Move to Trash"
        message="Are you sure you want to move this purchase requisition to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpPurchaseRequisitions;
