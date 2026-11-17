import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faTrash, faEdit, faBuildingColumns,
  faCoins, faWallet, faFileContract,
  faCheckCircle, faLock, faFolder,
  faTags, faCopy, faFileExcel, faFileCsv,
} from "@fortawesome/free-solid-svg-icons";

import { DeleteConfirmDialog } from '../../../../components/common';
import { erpCss, erpColors } from '../../../../components/ui/ux/ErpTheme';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { listAccountTypes, deleteAccountType } from '../../../../api/fms';

const ErpAccountTypes = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listAccountTypes();
        setAccountTypes(res.data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load account types');
        addNotification?.(err.message || 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification]);

  const kpiWidgets = useMemo(() => [
    { label: 'Total Account Types', val: accountTypes.length, icon: faFolder, color: erpColors.primary, trendVal: `${accountTypes.length} Types` },
    { label: 'Debit Classification', val: accountTypes.filter(t => t.parent?.includes('Debit') || t.parent === 'Assets').length, icon: faCoins, color: erpColors.success, trendVal: 'Debit' },
    { label: 'Credit Classification', val: accountTypes.filter(t => t.parent?.includes('Credit')).length, icon: faWallet, color: erpColors.danger, trendVal: 'Credit' },
    { label: 'Active Types', val: accountTypes.filter(t => t.status === 'Active').length, icon: faCheckCircle, color: erpColors.success, trendVal: 'Active' },
    { label: 'System Locked', val: accountTypes.filter(t => t.system).length, icon: faLock, color: erpColors.purple, trendVal: 'Protected' },
    { label: 'P&L Statement', val: accountTypes.filter(t => t.statement?.includes('Income')).length, icon: faFileContract, color: erpColors.info, trendVal: 'P&L' },
    { label: 'Balance Sheet', val: accountTypes.filter(t => t.statement?.includes('Balance')).length, icon: faBuildingColumns, color: erpColors.warning, trendVal: 'B/S' },
    { label: 'Custom Defined', val: accountTypes.filter(t => !t.system).length, icon: faPlus, color: erpColors.purple, trendVal: 'Custom' },
    { label: 'Revenue Types', val: accountTypes.filter(t => t.code === 'REV').length, icon: faCoins, color: erpColors.info, trendVal: 'Revenue' },
    { label: 'Asset Types', val: accountTypes.filter(t => t.code === 'AST' || t.code === 'CSH').length, icon: faCoins, color: erpColors.success, trendVal: 'Assets' },
  ], [accountTypes]);

  const handleEditClick = (type) => {
    try {
      const draft = { code: type.code, name: type.name, parent: type.parent, statement: type.statement, color: type.color || '#6366f1', status: type.status || 'Draft' };
      localStorage.setItem('atype_draft', JSON.stringify(draft));
      setActiveTab('erp_define_account_type');
    } catch (e) {
      addNotification?.('Failed to prepare edit draft.', 'error');
    }
  };
  const handleArchive = (code) => {
    setAccountTypes(prev => prev.map(t => t.code === code ? { ...t, status: 'Archived' } : t));
    addNotification?.('Account type archived successfully.', 'success');
  };
  const confirmDelete = async () => {
    try {
      await deleteAccountType(deleteDialog.id);
      setAccountTypes(prev => prev.filter(t => t.id !== deleteDialog.id));
      addNotification?.('Account type deleted successfully.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, name: '' });
    }
  };

  const toggleStatus = (code) => {
    setAccountTypes(prev => prev.map(t => {
      if (t.code === code) {
        if (t.system) { addNotification?.('Cannot toggle status on system-locked account types.', 'warning'); return t; }
        return { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return t;
    }));
  };

  const filteredTypes = accountTypes.filter((type) => `${type.code || ''} ${type.name || ''} ${type.parent || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const downloadExportRows = (rows, format) => {
    const safeRows = rows.map((row) => ({ code: row.code || '', name: row.name || '', parent: row.parent || '', statement: row.statement || '', status: row.status || '', origin: row.system ? 'System' : 'Custom' }));
    if (format === 'csv') {
      const csv = ['code,name,parent,statement,status,origin', ...safeRows.map((row) => [row.code, row.name, row.parent, row.statement, row.status, row.origin].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'account_types.csv'; link.click(); window.URL.revokeObjectURL(url); return;
    }
    const worksheet = XLSX.utils.json_to_sheet(safeRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Account Types');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'account_types.xlsx'; link.click(); window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => { downloadExportRows(filteredTypes, format); addNotification?.(`Account types exported as ${format.toUpperCase()}.`, 'success'); };

  const columns = [
    { key: 'code', label: 'Code', render: (v) => <span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, fontFamily: 'monospace' }}>{v}</span> },
    { key: 'name', label: 'Type Name', bold: true },
    { key: 'parent', label: 'Parent Classification' },
    { key: 'statement', label: 'Statement' },
    { key: 'color', label: '', render: (v) => <span className="d-inline-block rounded-circle" style={{ width: 12, height: 12, backgroundColor: v, border: `2px solid ${v}40` }} /> },
    { key: 'system', label: 'Origin', render: (v) => (
      <span className="premium-badge" style={{ background: v ? (isDark ? '#1e293b' : '#f1f5f9') : `${erpColors.primary}15`, color: v ? mutedColor : erpColors.primary }}>
        <span className="badge-dot" style={{ background: v ? mutedColor : erpColors.primary }} />{v ? 'System Lock' : 'Custom'}
      </span>
    )},
    { key: 'status', label: 'Status', render: (v, row) => (
      <span className="premium-badge" style={{ cursor: row.system ? 'not-allowed' : 'pointer', background: v === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'), color: v === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }} onClick={() => toggleStatus(row.code)}>
        <span className="badge-dot" style={{ background: v === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }} />{v}
      </span>
    )},
    { key: 'actions', label: '', align: 'end', render: (v, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} disabled={row.system} onClick={() => handleEditClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} disabled={row.system} onClick={() => handleCopy(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} disabled={row.system} onClick={() => handleArchive(row.code)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faFolder} />
        </button>
        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, background: 'transparent', padding: '4px 8px' }} disabled={row.system} onClick={() => handleDelete(row.id, row.name)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faTags}
      title="Account Categories & Types"
      description="System mappings for balance sheets, Profit & Loss reporting, and default general ledger behavior."
      action={
        <button onClick={() => setActiveTab('erp_define_account_type')} className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ fontSize: '0.8rem' }}>
          <FontAwesomeIcon icon={faPlus} /> Define Account Type
        </button>
      }
    >
      <style>{erpCss(isDark)}</style>

      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} {...w} isDark={isDark} />
        ))}
      </div>

      <ErpDataTable
        columns={columns}
        data={filteredTypes}
        loading={loading}
        error={error}
        emptyMessage="No account types found."
        emptyIcon={faFolder}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filteredTypes.length}
        onEntriesPerPageChange={(v) => { setEntriesPerPage(v); setCurrentPage(1); }}
        isDark={isDark}
        title="Account Type Registry"
        titleIcon={faFolder}
        searchable
        searchPlaceholder="Search by type code, name, parent..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <select className="form-select form-select-sm" style={{ width: 'auto' }}>
            <option>All Classifications</option>
            <option>Balance Sheet</option>
            <option>Income Statement</option>
          </select>
        }
        exportButtons={
          <>
            <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.7rem', border: 'none' }} onClick={() => handleExport('xlsx')}>
              <FontAwesomeIcon icon={faFileExcel} className="me-1" />Excel
            </button>
            <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.7rem', border: 'none' }} onClick={() => handleExport('csv')}>
              <FontAwesomeIcon icon={faFileCsv} className="me-1" />CSV
            </button>
          </>
        }
      />

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Account Type"
        message="Are you sure you want to delete this account type? This action cannot be undone."
        itemName={deleteDialog.name}
      />
    </ErpPageShell>
  );
};

export default ErpAccountTypes;




