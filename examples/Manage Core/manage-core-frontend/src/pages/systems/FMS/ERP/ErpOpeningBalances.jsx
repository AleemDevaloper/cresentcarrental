import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload, faCheckCircle, faTriangleExclamation,
  faDatabase, faUsers, faCoins,
  faArrowUp, faArrowDown, faInfoCircle, faBuildingColumns,
  faFileInvoice, faBalanceScale, faFileCsv, faPlus, faTrash, faPen, faEye, faXmark, faCopy, faFolder, faFileExcel
} from "@fortawesome/free-solid-svg-icons";
import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import { moveToFmsTrash } from '../../../../api/enterprise';
import { listOpeningBalances, deleteOpeningBalance, postOpeningBalances, createOpeningBalance, updateOpeningBalance } from '../../../../api/fms';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { erpColors } from '../../../../components/ui/ux/ErpTheme';

const ErpOpeningBalances = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const [viewTab, setViewTab] = useState('gl');

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [glBalances, setGlBalances] = useState([]);
  const [customerBalances, setCustomerBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Deletion state
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });

  // View state
  const [viewItem, setViewItem] = useState(null);

  // Creation & Editing form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formType, setFormType] = useState('GL');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDebit, setFormDebit] = useState('');
  const [formCredit, setFormCredit] = useState('');
  const [formTerms, setFormTerms] = useState('30 Days');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listOpeningBalances();
      const data = res.data?.data || [];
      setGlBalances(data.filter(b => b.type === 'GL'));
      setCustomerBalances(data.filter(b => b.type === 'Customer'));
    } catch (err) {
      setError(err.message || 'Failed to load opening balances');
      addNotification?.(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totals = useMemo(() => {
    const debits = glBalances.reduce((s, r) => s + r.debit, 0);
    const credits = glBalances.reduce((s, r) => s + r.credit, 0);
    return { debits, credits, balanced: debits === credits, variance: Math.abs(debits - credits) };
  }, [glBalances]);

  const kpiWidgets = useMemo(() => [
    { label: 'Total GL Accounts', val: glBalances.length, icon: faDatabase, color: erpColors.primary, trend: 'up', trendVal: `${glBalances.length} Accounts`, sparkline: [3, 3, 4, 4, 5, 5, 5] },
    { label: 'Total Debits', val: '$' + (totals.debits / 1000000).toFixed(1) + 'M', icon: faCoins, color: erpColors.success, trend: 'up', trendVal: 'Debit', sparkline: [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.05] },
    { label: 'Total Credits', val: '$' + (totals.credits / 1000000).toFixed(1) + 'M', icon: faBalanceScale, color: erpColors.danger, trend: 'up', trendVal: 'Credit', sparkline: [0.3, 0.5, 0.7, 1.0, 1.3, 1.5, 2.05] },
    { label: 'Customers Loaded', val: customerBalances.length, icon: faUsers, color: erpColors.info, trend: 'up', trendVal: `${customerBalances.length} Customers`, sparkline: [0, 0, 0, 1, 1, 2, 2] },
    { label: 'Balance Status', val: totals.balanced ? 'Balanced' : 'Variance', icon: totals.balanced ? faCheckCircle : faTriangleExclamation, color: totals.balanced ? erpColors.success : erpColors.danger, trend: totals.balanced ? 'up' : 'down', trendVal: totals.balanced ? 'Matched' : '$' + totals.variance.toLocaleString(), sparkline: totals.balanced ? [100, 100, 100, 100, 100, 100, 100] : [0, 0, 0, 0, 0, 0, 1] },
  ], [glBalances, customerBalances, totals]);

  const handleUpload = () => addNotification?.('Opening balances import template uploaded.', 'success');

  const handleDeleteClick = (row) => {
    setDeleteDialog({
      show: true,
      id: row.id,
      name: row.accountName || row.entity,
      row
    });
  };

  const handleCopy = (row) => {
    setGlBalances(prev => [...prev, { ...row, id: Date.now(), accountCode: `${row.accountCode || 'OB'}-COPY`, accountName: `${row.accountName || row.entity || 'Copy'} (Copy)`, debit: 0, credit: 0, status: 'Draft' }]);
    addNotification?.('Opening balance copied as draft.', 'success');
  };

  const handleArchive = (row) => {
    setGlBalances(prev => prev.map(item => item.id === row.id ? { ...item, status: 'Archived' } : item));
    addNotification?.('Opening balance archived successfully.', 'success');
  };

  const handleDeleteConfirm = async () => {
    const { id, row } = deleteDialog;
    try {
      if (row) {
        const displayName = row.accountName || row.entity || row.customerName || '';
        const val = row.type === 'GL'
          ? '$' + ((row.debit || row.credit || 0)).toLocaleString()
          : (row.outstanding || '$0');
        await moveToFmsTrash({ type: 'Opening Balance', code: row.accountCode || `#${id}`, title: displayName, value: val });
      }
      await deleteOpeningBalance(id);
      addNotification?.('Opening balance moved to Accounting Trash.', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete opening balance', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, name: '', row: null });
    }
  };

  const handleViewClick = (row) => setViewItem(row);
  const closeViewModal = () => setViewItem(null);

  const handleEditClick = (row) => {
    try {
      const draft = { type: row.type, name: row.accountName || row.entity || '', code: row.accountCode || '', debit: row.debit?.toString() || '', credit: row.credit?.toString() || '', terms: row.terms || '30 Days' };
      localStorage.setItem('bal_draft', JSON.stringify(draft));
      setActiveTab('erp_add_balance');
    } catch (e) {
      addNotification?.('Failed to prepare opening balance draft.', 'error');
    }
  };
      

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormName('');
    setFormCode('');
    setFormDebit('');
    setFormCredit('');
    setFormTerms('30 Days');
  };

  const handleSaveBalance = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      addNotification?.('Name is required', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        type: formType,
        accountName: formName,
        accountCode: formCode,
        debit: parseFloat(formDebit) || 0,
        credit: parseFloat(formCredit) || 0,
        terms: formTerms
      };

      if (editingItem) {
        await updateOpeningBalance(editingItem.id, payload);
        addNotification?.('Opening balance updated successfully.', 'success');
      } else {
        await createOpeningBalance(payload);
        addNotification?.('Opening balance created successfully.', 'success');
      }
      
      handleCloseModal();
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to save opening balance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadExportRows = (rows, format) => {
    const safeRows = rows.map((row) => ({ code: row.accountCode || '', name: row.accountName || row.entity || '', type: row.type || '', debit: row.debit || 0, credit: row.credit || 0, status: row.status || '' }));
    if (format === 'csv') {
      const csv = ['code,name,type,debit,credit,status', ...safeRows.map((row) => [row.code, row.name, row.type, row.debit, row.credit, row.status].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))] .join('\\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'opening_balances.csv'; link.click(); window.URL.revokeObjectURL(url); return;
    }
    const worksheet = XLSX.utils.json_to_sheet(safeRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Opening Balances');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'opening_balances.xlsx'; link.click(); window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => { downloadExportRows(glBalances, format); addNotification?.(`Opening balances exported as ${format.toUpperCase()}.`, 'success'); };

  const glColumns = [
    { key: 'accountCode', label: 'Code', bold: true },
    { key: 'accountName', label: 'Account Name', bold: true },
    { key: 'type', label: 'Classification', render: (val) => <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: textColor }}>{val}</span> },
    { key: 'debit', label: 'Debit ($)', align: 'end', render: (val) => <span className="font-monospace fw-medium" style={{ color: erpColors.success }}>{val > 0 ? '$' + val.toLocaleString() : '-'}</span> },
    { key: 'credit', label: 'Credit ($)', align: 'end', render: (val) => <span className="font-monospace fw-medium" style={{ color: erpColors.danger }}>{val > 0 ? '$' + val.toLocaleString() : '-'}</span> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'end',
      render: (val, row) => (
        <div className="d-flex justify-content-end gap-1">
          <button
            onClick={() => handleViewClick(row)}
            className="btn btn-sm premium-btn"
            style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }}
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="btn btn-sm premium-btn"
            style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }}
            title="Edit"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="btn btn-sm premium-btn"
            style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }}
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )
    }
  ];

  const customerColumns = [
    { key: 'accountCode', label: 'Customer Code', bold: true },
    { key: 'entity', label: 'Customer Account', bold: true },
    { key: 'outstanding', label: 'Outstanding Balance', render: (val) => <span className="fw-bold font-monospace" style={{ color: erpColors.success }}>{val}</span> },
    { key: 'terms', label: 'Payment Terms', render: (val) => <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: textColor }}>{val}</span> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'end',
      render: (val, row) => (
        <div className="d-flex justify-content-end gap-1">
          <button
            onClick={() => handleViewClick(row)}
            className="btn btn-sm premium-btn"
            style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }}
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="btn btn-sm premium-btn"
            style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }}
            title="Edit"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="btn btn-sm premium-btn"
            style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }}
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )
    }
  ];

  const actionButtons = (
    <div className="d-flex align-items-center gap-2">
      <button onClick={() => setActiveTab('erp_add_balance')} className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 px-3" style={{ borderRadius: '10px', fontSize: '0.75rem', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
        <FontAwesomeIcon icon={faPlus} /> Add Balance
      </button>
      <button onClick={() => handleExport('csv')} className="btn btn-sm premium-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
        <FontAwesomeIcon icon={faFileCsv} className="me-1" /> CSV
      </button>
      <button onClick={() => handleExport('xlsx')} className="btn btn-sm premium-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
        <FontAwesomeIcon icon={faFileExcel} className="me-1" /> Excel
      </button>
      <button onClick={handleUpload} className="btn btn-sm premium-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
        <FontAwesomeIcon icon={faFileCsv} className="me-1" /> Import
      </button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faCoins}
      title="Company Opening Balances"
      description="Configure customer, vendor, bank, cash, inventory, and asset ledger opening figures."
      badge="ledger"
      action={actionButtons}
    >
      {/* KPI Widgets */}
      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} trend={w.trend} trendVal={w.trendVal} sparkline={w.sparkline} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        ))}
      </div>

      {/* Validation Banner */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{
          padding: '1rem 1.25rem',
          borderLeft: `4px solid ${totals.balanced ? erpColors.success : erpColors.danger}`,
          background: totals.balanced
            ? (isDark ? 'linear-gradient(90deg, #064e3b20, transparent)' : 'linear-gradient(90deg, #dcfce7, transparent)')
            : (isDark ? 'linear-gradient(90deg, #7f1d1d20, transparent)' : 'linear-gradient(90deg, #fee2e2, transparent)'),
        }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: totals.balanced ? `${erpColors.success}20` : `${erpColors.danger}20`, color: totals.balanced ? erpColors.success : erpColors.danger }}>
              <FontAwesomeIcon icon={totals.balanced ? faCheckCircle : faTriangleExclamation} />
            </div>
            <div>
              <div className="fw-bold" style={{ color: textColor, fontSize: '0.85rem' }}>{totals.balanced ? 'Debit & Credit Balances Match' : 'Ledger Out of Balance Variance Detected'}</div>
              <div style={{ color: mutedColor, fontSize: '0.75rem' }}>
                Total Debits: <span className="fw-medium" style={{ color: erpColors.success }}>${totals.debits.toLocaleString()}</span>
                <span className="mx-2" style={{ opacity: 0.3 }}>|</span>
                Total Credits: <span className="fw-medium" style={{ color: erpColors.danger }}>${totals.credits.toLocaleString()}</span>
                {!totals.balanced && (
                  <><span className="mx-2" style={{ opacity: 0.3 }}>|</span>Variance: <span className="fw-medium" style={{ color: erpColors.warning }}>${totals.variance.toLocaleString()}</span></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
        {/* Premium Glassmorphic Tab Bar */}
        <div className="mb-4 text-start">
          <div className="erp-tab-container">
            {[
              { id: 'gl', label: 'General Ledger', icon: faDatabase },
              { id: 'customer', label: 'Customers', icon: faUsers },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewTab(tab.id)}
                className={`erp-tab-btn ${viewTab === tab.id ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {viewTab === 'gl' && (
          <>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
              <h6 style={{ color: textColor }}>
                <FontAwesomeIcon icon={faBuildingColumns} className="me-2" style={{ color: erpColors.primary }} />
                General Ledger Opening Balances
              </h6>
            </div>
            <ErpDataTable
              columns={glColumns}
              data={glBalances}
              loading={loading}
              error={error}
              emptyMessage="No GL opening balances found."
              emptyIcon={faInfoCircle}
              isDark={isDark}
            />
            {glBalances.length > 0 && (
              <div className="d-flex justify-content-end mt-3 pt-3" style={{ borderTop: `2px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
                <div className="d-flex" style={{ fontSize: '0.78rem', gap: '2rem' }}>
                  <span className="fw-bold" style={{ color: textColor }}>Totals</span>
                  <span className="fw-bold font-monospace" style={{ color: erpColors.success }}>${totals.debits.toLocaleString()}</span>
                  <span className="fw-bold font-monospace" style={{ color: erpColors.danger }}>${totals.credits.toLocaleString()}</span>
                </div>
              </div>
            )}
          </>
        )}

        {viewTab === 'customer' && (
          <>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #06b6d4, #3b82f6)' }} />
              <h6 style={{ color: textColor }}>
                <FontAwesomeIcon icon={faUsers} className="me-2" style={{ color: erpColors.info }} />
                Customer Opening Balances
              </h6>
            </div>
            <ErpDataTable
              columns={customerColumns}
              data={customerBalances}
              loading={loading}
              error={error}
              emptyMessage="No customer opening balances found."
              emptyIcon={faInfoCircle}
              isDark={isDark}
            />
          </>
        )}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          padding: '1rem',
        }} onClick={closeViewModal}>
          <div style={{
            background: isDark ? '#242838' : '#ffffff',
            borderRadius: '16px', width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: viewItem.type === 'GL' ? '#6366f1' : '#06b6d4', fontSize: '1rem' }} />
                <h6 className="mb-0 fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Opening Balance Details</h6>
                <span className="badge" style={{
                  background: viewItem.status === 'Posted' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#334155' : '#f1f5f9'),
                  color: viewItem.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#94a3b8' : '#64748b'),
                  fontSize: '0.6rem', fontWeight: 600, marginLeft: 8,
                }}>{viewItem.status}</span>
                <span className="premium-badge" style={{ background: viewItem.type === 'GL' ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : (isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)'), color: viewItem.type === 'GL' ? '#6366f1' : '#06b6d4', padding: '1px 8px', fontSize: '0.55rem' }}>{viewItem.type}</span>
              </div>
              <button onClick={closeViewModal} className="btn btn-sm border-0" style={{ color: mutedColor, borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9' }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Account Code</div>
                  <div className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '0.85rem' }}>{viewItem.accountCode}</div>
                </div>
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Date</div>
                  <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.date}</div>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{viewItem.type === 'GL' ? 'Account Name' : 'Customer Account'}</div>
                  <div style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.accountName || viewItem.entity}</div>
                </div>
                {viewItem.type === 'Customer' && (
                  <div className="col-6">
                    <div style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Payment Terms</div>
                    <div style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.terms || '—'}</div>
                  </div>
                )}
              </div>
              <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div className="row g-3">
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Debit ($)</div>
                    <div className="fw-bold font-monospace" style={{ color: '#10b981', fontSize: '1rem' }}>{viewItem.debit > 0 ? '$' + Number(viewItem.debit).toLocaleString() : '—'}</div>
                  </div>
                  <div className="col-6">
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Credit ($)</div>
                    <div className="fw-bold font-monospace" style={{ color: '#ef4444', fontSize: '1rem' }}>{viewItem.credit > 0 ? '$' + Number(viewItem.credit).toLocaleString() : '—'}</div>
                  </div>
                </div>
              </div>
              {viewItem.type === 'Customer' && (
                <div style={{ background: isDark ? '#1a1d29' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: 2 }}>Outstanding Balance</div>
                  <div className="fw-bold font-monospace" style={{ color: '#6366f1', fontSize: '1rem' }}>{viewItem.outstanding || '$0'}</div>
                </div>
              )}
              <div className="d-flex gap-2 justify-content-end pt-2" style={{ borderTop: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}` }}>
                <button onClick={closeViewModal} className="btn btn-sm px-3" style={{ borderRadius: '8px', background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Opening Balance"
        message="This opening balance will be moved to the Accounting Trash. You can restore or permanently purge it later."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpOpeningBalances;





