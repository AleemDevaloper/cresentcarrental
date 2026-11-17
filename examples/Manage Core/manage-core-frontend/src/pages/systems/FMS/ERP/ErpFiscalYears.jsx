import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from 'xlsx';
import {
  faCalendarDays, faLock, faUnlock, faCheckCircle,
  faPlus, faClock, faInfoCircle, faHistory, faSearch,
  faFileExport, faEye, faTrash, faEdit, faArchive,
  faBoxes, faShieldHalved, faXmark, faCopy, faArrowUp,
  faArrowDown, faMinus, faChartLine, faFilter, faFileExcel, faFileCsv,
} from "@fortawesome/free-solid-svg-icons";

import { AnimatedCounter, MiniSparkline, DeleteConfirmDialog } from '../../../../components/common';
import {
  listFiscalYears, deleteFiscalYear, createFiscalYear, updateFiscalYear, closeFiscalYear,
  listFiscalPeriods, lockFiscalPeriod, unlockFiscalPeriod,
} from '../../../../api/fms';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpFiscalYears = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const colors = {
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
  };

  const [fiscalYears, setFiscalYears] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const fyRes = await listFiscalYears();
      const periodsRes = await listFiscalPeriods(1);
      setFiscalYears(fyRes.data?.data || []);
      setPeriods(periodsRes.data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load fiscal years');
      addNotification?.(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const [checklist, setChecklist] = useState({
    journalsPosted: true, trialBalanceMatched: true, pendingApprovalsClear: false,
    inventoryValued: true, payrollFinalized: true, taxReported: false,
    depreciationPosted: true, bankReconciled: false, plReviewed: true, retainedEarningsCalculated: false,
  });

  const [showWizard, setShowWizard] = useState(false);
  const [editingFyId, setEditingFyId] = useState(null);
  const [showPeriodPanel, setShowPeriodPanel] = useState(false);
  const [newFy, setNewFy] = useState({
    name: '', code: '', start: '2026-07-01', end: '2027-06-30', type: 'Monthly', autoPeriods: 'Yes', periodsCount: '12', calendarType: 'Custom', status: 'Draft',
  });

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const kpiWidgets = useMemo(() => [
    { label: 'Total Fiscal Years', val: fiscalYears.length, icon: faCalendarDays, color: colors.primary, trend: 'up', trendVal: `${fiscalYears.length} Total`, sparkline: [1, 2, 1, 2, 3, 3, 3] },
    { label: 'Open Years', val: fiscalYears.filter(y => y.status === 'Open').length, icon: faUnlock, color: colors.success, trend: 'up', trendVal: 'Active', sparkline: [0, 0, 0, 0, 0, 1, 1] },
    { label: 'Closed Years', val: fiscalYears.filter(y => y.status === 'Closed').length, icon: faLock, color: mutedColor, trend: 'down', trendVal: 'Archived', sparkline: [0, 0, 1, 1, 1, 1, 1] },
    { label: 'Locked Periods', val: periods.filter(p => p.status === 'Closed' || p.status === 'Locked').length, icon: faShieldHalved, color: colors.danger, trend: 'down', trendVal: `${periods.filter(p => p.status === 'Closed' || p.status === 'Locked').length} Locked`, sparkline: [6, 6, 6, 6, 6, 6, 6] },
    { label: 'Current FY', val: fiscalYears.find(y => y.current)?.code || '—', icon: faCheckCircle, color: colors.info, trend: 'up', trendVal: 'Active', sparkline: [100, 100, 100, 100, 100, 100, 100] },
    { label: 'Pending Year Close', val: '1 Year', icon: faClock, color: colors.warning, trend: 'down', trendVal: 'Due', sparkline: [3, 2, 2, 1, 1, 1, 1] },
    { label: 'Upcoming Year', val: 'FY2027', icon: faCalendarDays, color: colors.purple, trend: 'up', trendVal: 'Draft', sparkline: [0, 0, 0, 0, 0, 0, 1] },
    { label: 'Total Periods', val: periods.length, icon: faBoxes, color: colors.success, trend: 'up', trendVal: `${periods.length} Total`, sparkline: [12, 12, 12, 12, 12, 12, 12] },
    { label: 'Open Periods', val: periods.filter(p => p.status === 'Open').length, icon: faUnlock, color: '#10b981', trend: 'up', trendVal: 'Writable', sparkline: [0, 0, 0, 0, 0, 6, 6] },
    { label: 'Archived Years', val: '0', icon: faArchive, color: '#9ca3af', trend: 'down', trendVal: 'None', sparkline: [0, 0, 0, 0, 0, 0, 0] },
  ], [fiscalYears, periods]);

  const handleSaveFy = async () => {
    if (!newFy.name || !newFy.code) {
      addNotification?.('Please enter Fiscal Year name and code.', 'warning');
      return;
    }

    const payload = {
      name: newFy.name,
      code: newFy.code,
      start: newFy.start,
      end: newFy.end,
      duration: `${newFy.periodsCount} Months`,
      periods: parseInt(newFy.periodsCount || '12', 10),
      status: newFy.status,
      current: false,
    };

    try {
      if (editingFyId) {
        const target = fiscalYears.find(y => y.id === editingFyId);
        if (target?.id) {
          await updateFiscalYear(target.id, payload);
        }
        setFiscalYears(prev => prev.map(y => y.id === editingFyId ? { ...y, ...payload, updated: new Date().toISOString().slice(0, 10) } : y));
        addNotification?.('Fiscal Year updated successfully.', 'success');
      } else {
        const res = await createFiscalYear(payload);
        const added = res.data?.data || {
          ...payload,
          id: Date.now(),
          current: false,
          creator: 'Finance Admin',
          created: new Date().toISOString().slice(0, 10),
          updated: new Date().toISOString().slice(0, 10),
        };
        setFiscalYears(prev => [...prev, added]);
        addNotification?.('New Fiscal Year registered successfully.', 'success');
      }
    } catch (err) {
      addNotification?.(err.message || 'Failed to save fiscal year', 'error');
      return;
    }

    setShowWizard(false);
    setEditingFyId(null);
    setNewFy({ name: '', code: '', start: '2026-07-01', end: '2027-06-30', type: 'Monthly', autoPeriods: 'Yes', periodsCount: '12', calendarType: 'Custom', status: 'Draft' });
  };

  const handleEditClick = (fy) => {
    setNewFy({ name: fy.name, code: fy.code, start: fy.start, end: fy.end, type: fy.duration.includes('Quarter') ? 'Quarterly' : 'Monthly', autoPeriods: 'Yes', periodsCount: fy.periods.toString(), calendarType: 'Custom', status: fy.status });
    setEditingFyId(fy.id);
    setShowWizard(true);
  };

  const handleDuplicateFy = async (fy) => {
    const payload = {
      name: `${fy.name} (Copy)`,
      code: `${fy.code}-COPY`,
      start: fy.start,
      end: fy.end,
      duration: fy.duration || `${fy.periods} Months`,
      periods: fy.periods || 12,
      status: 'Draft',
      current: false,
    };

    try {
      const res = await createFiscalYear(payload);
      const created = res.data?.data || { ...payload, id: Date.now(), creator: 'Finance Admin', created: new Date().toISOString().slice(0, 10), updated: new Date().toISOString().slice(0, 10) };
      setFiscalYears(prev => [...prev, created]);
      addNotification?.('Fiscal Year duplicated successfully.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to duplicate fiscal year', 'error');
    }
  };

  const handleMoveToDraft = async (id) => {
    try {
      const target = fiscalYears.find(y => y.id === id);
      if (target?.id) {
        await updateFiscalYear(target.id, { status: 'Draft' });
      }
      setFiscalYears(prev => prev.map(y => y.id === id ? { ...y, status: 'Draft' } : y));
      addNotification?.('Fiscal Year moved to Draft.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move fiscal year to draft', 'error');
    }
  };

  const handleArchiveFy = async (id) => {
    try {
      const target = fiscalYears.find(y => y.id === id);
      if (target?.id) {
        await updateFiscalYear(target.id, { status: 'Archived' });
      }
      setFiscalYears(prev => prev.map(y => y.id === id ? { ...y, status: 'Archived' } : y));
      addNotification?.('Fiscal Year archived successfully.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to archive fiscal year', 'error');
    }
  };

  const handleDeleteFy = (id, name) => {
    setDeleteDialog({ show: true, id, name });
  };

  const downloadExportRows = (rows, format) => {
    const safeRows = rows.map((row) => ({
      name: row.name || '',
      code: row.code || '',
      range: `${row.start || ''} - ${row.end || ''}`,
      periods: row.periods || 0,
      status: row.status || '',
      creator: row.creator || '',
    }));

    if (format === 'csv') {
      const csv = [
        ['name', 'code', 'range', 'periods', 'status', 'creator'].join(','),
        ...safeRows.map((row) => [row.name, row.code, row.range, row.periods, row.status, row.creator].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'fiscal_years.csv'; link.click(); window.URL.revokeObjectURL(url);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(safeRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fiscal Years');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'fiscal_years.xlsx'; link.click(); window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    downloadExportRows(filteredFiscalYears, format);
    addNotification?.(`Fiscal years exported as ${format.toUpperCase()}.`, 'success');
  };

  const confirmDeleteFy = async () => {
    try {
      await deleteFiscalYear(deleteDialog.id);
      setFiscalYears(prev => prev.filter(y => y.id !== deleteDialog.id));
      addNotification?.('Fiscal Year deleted successfully.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, name: '' });
    }
  };

  const handlePeriodAction = (periodId, action) => {
    setPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        let nextStatus = p.status;
        let posting = p.postingAllowed;
        if (action === 'Lock') { nextStatus = 'Locked'; posting = 'No'; }
        else if (action === 'Unlock') { nextStatus = 'Open'; posting = 'Yes'; }
        else if (action === 'Close') { nextStatus = 'Closed'; posting = 'No'; }
        return { ...p, status: nextStatus, postingAllowed: posting };
      }
      return p;
    }));
    addNotification?.(`Period ${action} action executed successfully.`, 'success');
  };

  const handleChecklistToggle = (key) => setChecklist(prev => ({ ...prev, [key]: !prev[key] }));

  const completedItems = Object.values(checklist).filter(Boolean).length;
  const totalItems = Object.keys(checklist).length;

  const fyColumns = [
    { key: 'name', label: 'Year Name', bold: true },
    { key: 'code', label: 'Code' },
    { key: 'start', label: 'Date Range' },
    { key: 'periods', label: 'Periods' },
    { key: 'status', label: 'Status' },
    { key: 'creator', label: 'Created By' },
  ];

  const filteredFiscalYears = fiscalYears.filter((year) => {
    const haystack = `${year.name || ''} ${year.code || ''} ${year.creator || ''}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const headerAction = (
    <div className="d-flex flex-wrap gap-2 mt-2 mt-lg-0">
      <button onClick={() => { setShowPeriodPanel(!showPeriodPanel); }} className="btn btn-sm premium-btn" style={{ borderRadius: '10px', background: showPeriodPanel ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9'), color: showPeriodPanel ? '#fff' : textColor, fontSize: '0.75rem', border: 'none' }}>
        <FontAwesomeIcon icon={faBoxes} className="me-1" /> Periods
      </button>
      <button onClick={() => setActiveTab('erp_create_fiscal_year')} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        fontSize: '0.8rem',
      }}>
        <FontAwesomeIcon icon={faPlus} /> Add Fiscal Year
      </button>
    </div>
  );

  const exportButtons = (
    <div className="d-flex gap-2">
      <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.7rem', border: 'none' }} onClick={() => handleExport('csv')}>
        <FontAwesomeIcon icon={faFileCsv} className="me-1" />CSV
      </button>
      <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.7rem', border: 'none' }} onClick={() => handleExport('xlsx')}>
        <FontAwesomeIcon icon={faFileExcel} className="me-1" />Excel
      </button>
    </div>
  );

  return (
    <ErpPageShell
      icon={faCalendarDays}
      title="Fiscal Years & Accounting Periods"
      description="Create fiscal years and automatically generate accounting periods for monthly, quarterly, and yearly financial reporting."
      action={headerAction}
    >
      {/* Premium KPI Widgets */}
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

      {/* Filter Panel */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}>
        <div className="row g-2 align-items-center">
          <div className="col-md-3">
            <div className="input-group" style={{ fontSize: '0.8rem' }}>
              <span className="input-group-text border-0 bg-transparent" style={{ color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
              <input type="text" className="form-control border-0" placeholder="Search by name, code, creator..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', paddingLeft: 0 }} />
            </div>
          </div>
          <div className="col-md-2">
            <select className="form-select"><option>All Statuses</option><option>Open</option><option>Closed</option><option>Draft</option></select>
          </div>
          <div className="col-md-2">
            <select className="form-select"><option>All Companies</option><option>Stark Industries</option><option>Wayne Enterprises</option></select>
          </div>
          <div className="col-md-5 text-end">
            {exportButtons}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="row g-4">
        {/* Fiscal Years Table */}
        <div className={`${showPeriodPanel ? 'col-lg-7' : 'col-lg-12'}`}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="accent-bar" style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', flexShrink: 0 }} />
              <h6 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.9rem' }}>
                <FontAwesomeIcon icon={faCalendarDays} className="me-2" style={{ color: colors.primary }} />
                Fiscal Calendar Matrix
              </h6>
            </div>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" style={{ color: '#6366f1', width: '2rem', height: '2rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Loading fiscal years...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger m-3" role="alert" style={{ borderRadius: '12px', fontSize: '0.8rem' }}>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />{error}
              </div>
            ) : fiscalYears.length === 0 ? (
              <div className="text-center py-5" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '0.5rem' }} />
                <p className="mb-0" style={{ fontSize: '0.85rem' }}>No fiscal years found. Create your first fiscal year to get started.</p>
              </div>
            ) : (
              <ErpDataTable
                columns={fyColumns}
                data={filteredFiscalYears.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)}
                isDark={isDark}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                totalEntries={filteredFiscalYears.length}
                onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
                exportButtons={exportButtons}
                renderRow={(fy, i, ctx) => (
                  <tr key={fy.id}>
                    <td className="fw-bold" style={{ color: textColor }}>
                      {fy.name} {fy.current && <span className="premium-badge" style={{ background: `${colors.primary}15`, color: colors.primary }}><span className="badge-dot" style={{ background: colors.primary }} />Current</span>}
                    </td>
                    <td><span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, fontFamily: 'monospace' }}>{fy.code}</span></td>
                    <td style={{ color: mutedColor, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{fy.start} &rarr; {fy.end}</td>
                    <td style={{ color: textColor }}>{fy.periods} <span style={{ color: mutedColor }}>Periods</span></td>
                    <td>
                      <span className="premium-badge" style={{
                        background: fy.status === 'Open' ? (isDark ? '#064e3b' : '#dcfce7') : fy.status === 'Closed' ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#1e293b' : '#f1f5f9'),
                        color: fy.status === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : fy.status === 'Closed' ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#94a3b8' : '#64748b'),
                      }}>
                        <span className="badge-dot" style={{
                          background: fy.status === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : fy.status === 'Closed' ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#94a3b8' : '#64748b'),
                        }} />
                        {fy.status}
                      </span>
                    </td>
                    <td style={{ color: mutedColor, fontSize: '0.72rem' }}>{fy.creator}</td>
                    <td className="text-end">
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEditClick(fy)} title="Edit"
                          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleDuplicateFy(fy)} title="Copy"
                          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(fy.id)} title="Move to Draft"
                          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                          <FontAwesomeIcon icon={faArchive} />
                        </button>
                        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleArchiveFy(fy.id)} title="Archive"
                          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                          <FontAwesomeIcon icon={faArchive} />
                        </button>
                        <button className="btn btn-sm border-0" style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteFy(fy.id, fy.name)} title="Delete"
                          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Periods & Checklist */}
        {showPeriodPanel && (
          <div className="col-lg-5">
            {/* Closing Checklist */}
            <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1.25rem', color: textColor }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="accent-bar" style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom, #f59e0b, #f97316)', flexShrink: 0 }} />
                <h6 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.9rem' }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" style={{ color: colors.warning }} />
                  Fiscal Closing Checklist
                </h6>
              </div>
              <p style={{ color: mutedColor, fontSize: '0.75rem' }}>Ensure complete auditing before executing target period or fiscal year shutdowns.</p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{completedItems} of {totalItems} completed</span>
                <span className="fw-bold" style={{ color: textColor, fontSize: '0.85rem' }}>{Math.round((completedItems / totalItems) * 100)}%</span>
              </div>
              <div className="premium-progress mb-3" style={{ height: '6px', borderRadius: '3px', background: isDark ? '#374151' : '#e5e7eb', overflow: 'hidden' }}>
                <div className="premium-progress-bar" style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', width: `${(completedItems / totalItems) * 100}%` }} />
              </div>
              <div className="d-flex flex-column gap-1">
                {[
                  { key: 'journalsPosted', label: 'All Journal Entries Posted' },
                  { key: 'trialBalanceMatched', label: 'Trial Balance Fully Balanced' },
                  { key: 'pendingApprovalsClear', label: 'Zero Pending Approvals in Queue' },
                  { key: 'inventoryValued', label: 'Inventory Cost Valuation Complete' },
                  { key: 'payrollFinalized', label: 'Payroll Ledger Accruals Finalized' },
                  { key: 'taxReported', label: 'Tax Auditing Reports Completed' },
                  { key: 'depreciationPosted', label: 'Fixed Assets Depreciation Posted' },
                  { key: 'bankReconciled', label: 'Bank Statement Reconciliation Complete' },
                  { key: 'plReviewed', label: 'Profit & Loss Statement Reviewed' },
                  { key: 'retainedEarningsCalculated', label: 'Retained Earnings Balance Carry-forward Calculated' },
                ].map(item => (
                  <div key={item.key} className="d-flex justify-content-between align-items-center" style={{ transition: 'all 0.25s', borderRadius: '10px', padding: '0.5rem 0.75rem', cursor: 'pointer' }} onClick={() => handleChecklistToggle(item.key)}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: 18, height: 18, borderRadius: '5px', border: `2px solid ${checklist[item.key] ? '#6366f1' : (isDark ? '#4a5568' : '#e2e8f0')}`,
                        background: checklist[item.key] ? '#6366f1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s',
                      }}>
                        {checklist[item.key] && <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#fff', fontSize: '0.55rem' }} />}
                      </div>
                      <span style={{ color: textColor, fontSize: '0.75rem' }}>{item.label}</span>
                    </div>
                    <span className="premium-badge" style={{
                      padding: '1px 8px', fontSize: '0.6rem',
                      background: checklist[item.key] ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#1e293b' : '#f1f5f9'),
                      color: checklist[item.key] ? (isDark ? '#4ade80' : '#16a34a') : mutedColor,
                    }}>
                      <span className="badge-dot" style={{ background: checklist[item.key] ? (isDark ? '#4ade80' : '#16a34a') : mutedColor }} />
                      {checklist[item.key] ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn btn-sm w-100 mt-3 premium-btn" style={{
                borderRadius: '10px', border: 'none',
                background: Object.values(checklist).every(Boolean) ? 'linear-gradient(135deg, #f43f5e, #ef4444)' : (isDark ? '#1e293b' : '#f1f5f9'),
                color: Object.values(checklist).every(Boolean) ? '#fff' : mutedColor,
                fontSize: '0.75rem',
              }} disabled={!Object.values(checklist).every(Boolean)}>
                <FontAwesomeIcon icon={faLock} className="me-1" /> Execute Close Action
              </button>
            </div>

            {/* Periods Controls */}
            <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem', color: textColor }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="accent-bar" style={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(to bottom, #06b6d4, #3b82f6)', flexShrink: 0 }} />
                <h6 className="fw-bold mb-0" style={{ color: textColor, fontSize: '0.9rem' }}>
                  <FontAwesomeIcon icon={faBoxes} className="me-2" style={{ color: colors.info }} />
                  Periods Controls (Current Year)
                </h6>
              </div>
              <div className="premium-table-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                <div className="table-responsive" style={{ maxHeight: '340px' }}>
                  <table className="table table-borderless align-middle mb-0" style={{ fontSize: '0.75rem', width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                      <tr style={{ background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                        <th style={{ padding: '14px 16px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>Period</th>
                        <th style={{ padding: '14px 16px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>Posting</th>
                        <th style={{ padding: '14px 16px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>Status</th>
                        <th className="text-end" style={{ padding: '14px 16px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map(p => (
                        <tr key={p.id} style={{ transition: 'all 0.25s', borderLeft: '3px solid transparent', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#6366f1'; e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}>
                          <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, fontWeight: 500, color: textColor, whiteSpace: 'nowrap' }}>{p.name}</td>
                          <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}` }}>
                            <span className="premium-badge" style={{
                              background: p.postingAllowed === 'Yes' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'),
                              color: p.postingAllowed === 'Yes' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                            }}>
                              <span className="badge-dot" style={{ background: p.postingAllowed === 'Yes' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }} />
                              {p.postingAllowed === 'Yes' ? 'Allowed' : 'Locked'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}`, color: p.status === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : mutedColor, fontSize: '0.72rem' }}>{p.status}</td>
                          <td className="text-end" style={{ padding: '8px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}` }}>
                            {p.status === 'Open' ? (
                              <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: `${colors.danger}15`, color: colors.danger, fontSize: '0.65rem', border: 'none', padding: '2px 10px' }} onClick={() => handlePeriodAction(p.id, 'Lock')}>
                                <FontAwesomeIcon icon={faLock} className="me-1" />Lock
                              </button>
                            ) : (
                              <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: `${colors.success}15`, color: colors.success, fontSize: '0.65rem', border: 'none', padding: '2px 10px' }} onClick={() => handlePeriodAction(p.id, 'Unlock')}>
                                <FontAwesomeIcon icon={faUnlock} className="me-1" />Unlock
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={confirmDeleteFy}
        title="Delete Fiscal Year"
        message="Are you sure you want to delete this fiscal year? This action cannot be undone."
        itemName={deleteDialog.name}
      />
    </ErpPageShell>
  );
};

export default ErpFiscalYears;
