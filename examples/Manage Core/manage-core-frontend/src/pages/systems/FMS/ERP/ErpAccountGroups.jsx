import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faFolder, faSearch, faTrash, faEdit,
  faCopy, faCheckCircle, faFileExport,
  faXmark, faArrowUp, faArrowDown, faInfoCircle,
  faSitemap, faExchangeAlt, faCoins, faFileInvoice, faFileExcel, faFileCsv,
} from "@fortawesome/free-solid-svg-icons";

import { DeleteConfirmDialog } from '../../../../components/common';
import { listAccountGroups, deleteAccountGroup } from '../../../../api/fms';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpAccountGroups = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [searchTerm, setSearchTerm] = useState('');
  const [accountGroups, setAccountGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const [showModal, setShowModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', parent: 'Assets', mapping: 'Balance Sheet' });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAccountGroups();
      setAccountGroups(res.data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load account groups');
      addNotification?.(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const kpiWidgets = useMemo(() => [
    { label: 'Total Groups', val: accountGroups.length, icon: faFolder, color: '#6366f1', trend: 'up', trendVal: `${accountGroups.length} Groups`, sparkline: [3, 4, 4, 5, 5, 6, 6] },
    { label: 'Balance Sheet', val: accountGroups.filter(g => g.mapping === 'Balance Sheet').length, icon: faCoins, color: '#10b981', trend: 'up', trendVal: 'B/S', sparkline: [2, 2, 3, 3, 3, 4, 4] },
    { label: 'Income Statement', val: accountGroups.filter(g => g.mapping === 'Income Statement').length, icon: faFileInvoice, color: '#f59e0b', trend: 'up', trendVal: 'P&L', sparkline: [1, 2, 2, 2, 2, 2, 2] },
    { label: 'Total Txns', val: accountGroups.reduce((s, g) => s + g.txns, 0), icon: faExchangeAlt, color: '#06b6d4', trend: 'up', trendVal: `${accountGroups.reduce((s, g) => s + g.txns, 0)} Posts`, sparkline: [800, 850, 900, 950, 1000, 1100, 1369] },
    { label: 'Largest Group', val: accountGroups.reduce((max, g) => Math.max(max, parseInt(String(g.balance || '').replace(/[$,]/g, ''))), 0) >= 10000000 ? '$11.9M' : '$8.2M', icon: faCoins, color: '#8b5cf6', trend: 'up', trendVal: 'Operating Revenue', sparkline: [8, 8.5, 9, 9.5, 10, 10.5, 11.9] },
  ], [accountGroups]);

  const handleSaveGroup = (e) => {
    if (e) e.preventDefault();
    if (!newGroup.name) { addNotification?.('Please enter a group name.', 'warning'); return; }
    if (editingGroupId) {
      setAccountGroups(prev => prev.map(g => g.id === editingGroupId ? { ...g, name: newGroup.name, parent: newGroup.parent, mapping: newGroup.mapping } : g));
      addNotification?.('Account Group updated successfully.', 'success');
    } else {
      setAccountGroups([...accountGroups, { ...newGroup, id: Date.now(), balance: '$0', txns: 0 }]);
      addNotification?.('New Account Group created successfully.', 'success');
    }
    setShowModal(false);
    setEditingGroupId(null);
    setNewGroup({ name: '', parent: 'Assets', mapping: 'Balance Sheet' });
  };

  const handleEditClick = (group) => {
    try {
      const draft = { name: group.name, parent: group.parent, mapping: group.mapping };
      localStorage.setItem('grp_draft', JSON.stringify(draft));
      setActiveTab('erp_create_account_group');
    } catch (e) {
      addNotification?.('Failed to prepare account group draft.', 'error');
    }
  };
      

  const handleDelete = (id, name) => {
    setDeleteDialog({ show: true, id, name });
  };
  const handleCopy = (group) => {
    setAccountGroups(prev => [...prev, { ...group, id: Date.now(), name: `${group.name} (Copy)`, txns: 0, balance: '$0' }]);
    addNotification?.('Account group copied successfully.', 'success');
  };
  const handleArchive = (id) => {
    setAccountGroups(prev => prev.map(g => g.id === id ? { ...g, status: 'Archived' } : g));
    addNotification?.('Account group archived successfully.', 'success');
  };
  const confirmDelete = async () => {
    try {
      await deleteAccountGroup(deleteDialog.id);
      setAccountGroups(prev => prev.filter(g => g.id !== deleteDialog.id));
      addNotification?.('Account Group deleted successfully.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, name: '' });
    }
  };

  const filteredGroups = accountGroups.filter(g => `${g.name || ''} ${g.parent || ''} ${g.mapping || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const downloadExportRows = (rows, format) => {
    const safeRows = rows.map((row) => ({ name: row.name || '', parent: row.parent || '', mapping: row.mapping || '', txns: row.txns || 0, balance: row.balance || '$0' }));
    if (format === 'csv') {
      const header = 'name,parent,mapping,txns,balance';
      const lines = safeRows.map(row => (
        [row.name, row.parent, row.mapping, row.txns, row.balance]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ));
      const csv = [header, ...lines].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'account_groups.csv';
      link.click();
      window.URL.revokeObjectURL(url);
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(safeRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Account Groups');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'account_groups.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => { downloadExportRows(filteredGroups, format); addNotification?.(`Account groups exported as ${format.toUpperCase()}.`, 'success'); };

  return (
    <ErpPageShell
      icon={faSitemap}
      title="Hierarchical Account Groups"
      description="Create parent-child structures to roll up balances for standard financial reporting."
      action={
        <button onClick={() => setActiveTab('erp_create_account_group')} className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ fontSize: '0.8rem' }}>
          <FontAwesomeIcon icon={faPlus} /> Create Account Group
        </button>
      }
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard
            key={idx}
            label={w.label}
            value={w.val}
            icon={w.icon}
            color={w.color}
            trend={w.trend}
            trendVal={w.trendVal}
            sparkline={w.sparkline}
            isDark={isDark}
          />
        ))}
      </div>

      <ErpDataTable
        columns={[
          { key: 'name', label: 'Group Name', bold: true, render: (val) => <><FontAwesomeIcon icon={faFolder} className="me-2" style={{ color: '#f59e0b' }} />{val}</> },
          { key: 'parent', label: 'Parent Classification' },
          { key: 'mapping', label: 'Statement Mapping', render: (val) => (
            <span className="premium-badge" style={{ background: val === 'Balance Sheet' ? '#6366f115' : '#f59e0b15', color: val === 'Balance Sheet' ? '#6366f1' : '#f59e0b' }}>
              <span className="badge-dot" style={{ background: val === 'Balance Sheet' ? '#6366f1' : '#f59e0b' }} />
              {val}
            </span>
          )},
          { key: 'txns', label: 'Transaction Volume', render: (val) => `${(val ?? 0).toLocaleString()} Posts` },
          { key: 'balance', label: 'Current Balance', bold: true },
          { key: 'actions', label: '', render: (_, row) => (
            <div className="d-flex gap-1 justify-content-end">
              <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEditClick(row)}
                onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleCopy(row)}
                onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleArchive(row.id)}
                onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                <FontAwesomeIcon icon={faFolder} />
              </button>
              <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleDelete(row.id, row.name)}
                onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )},
        ]}
        data={filteredGroups.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)}
        loading={loading}
        error={error}
        emptyMessage="No account groups found."
        searchable
        searchPlaceholder="Search groups by name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <select className="form-select form-select-sm" style={{ width: 'auto' }}>
            <option>All Mappings</option>
            <option>Balance Sheet</option>
            <option>Income Statement</option>
          </select>
        }
        exportButtons={
          <>
            <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.7rem', border: 'none' }} onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-1" />Excel</button>
            <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.7rem', border: 'none' }} onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-1" />CSV</button>
          </>
        }
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalEntries={filteredGroups.length}
        onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
        isDark={isDark}
        title="Account Groups Registry"
        titleIcon={faFolder}
      />

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Account Group"
        message="Are you sure you want to delete this account group? This action cannot be undone."
        itemName={deleteDialog.name}
      />
    </ErpPageShell>
  );
};

export default ErpAccountGroups;





