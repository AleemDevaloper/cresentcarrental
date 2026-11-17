import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faSearch, faFileExcel, faFileCsv, faFileImport, faFileExport,
  faEdit, faTrash, faCheckCircle, faXmark, faInfoCircle, faCalculator,
  faGlobe, faBuilding, faMoneyBillWave, faBalanceScale, faCopy, faFolder,
  faFilter, faLayerGroup, faList, faThLarge, faSort, faSortUp, faSortDown,
  faCog, faEllipsisV, faExclamationTriangle, faSpinner, faRefresh, faDownload,
  faCashRegister, faUniversity, faCreditCard, faFileInvoice, faChartPie,
  faSearchPlus, faTimes, faCheck, faUserTag, faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listChartOfAccounts, deleteAccount } from '../../../../api/fms';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import { coaTokens, accountTypeColor, statusColor } from './coaTheme';
import CoaImportWizard from './CoaImportWizard';
import CoaExportDialog from './CoaExportDialog';
import AccountFormDrawer from './AccountFormDrawer';

const VIEW_MODES = [
  { key: 'list', label: 'List', icon: faList },
  { key: 'grouped', label: 'Grouped', icon: faLayerGroup },
];

const ErpChartOfAccounts = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const t = coaTokens(isDark);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('code');
  const [sortDir, setSortDir] = useState('asc');

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [formAccount, setFormAccount] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await listChartOfAccounts({ per_page: 500 });
      const data = res?.data?.data ?? res?.data ?? [];
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load chart of accounts';
      setError(msg);
      addNotification?.({ type: 'error', message: msg });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredAccounts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return accounts.filter(a => {
      if (term) {
        const hay = `${a.code || ''} ${a.name || ''} ${a.type?.name || a.type?.code || a.account_type || ''} ${a.group?.name || a.account_group || ''} ${a.description || ''}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (typeFilter) {
        const t1 = a.type?.code || a.type?.name || a.account_type || '';
        if (String(t1).toLowerCase() !== typeFilter.toLowerCase()) return false;
      }
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [accounts, searchTerm, typeFilter, statusFilter]);

  const sortedAccounts = useMemo(() => {
    const arr = [...filteredAccounts];
    arr.sort((a, b) => {
      let av = a?.[sortBy], bv = b?.[sortBy];
      if (sortBy === 'type') {
        av = a?.type?.name || a?.type?.code || a?.account_type || '';
        bv = b?.type?.name || b?.type?.code || b?.account_type || '';
      } else if (sortBy === 'group') {
        av = a?.group?.name || a?.account_group || '';
        bv = b?.group?.name || b?.account_group || '';
      } else if (sortBy === 'balance') {
        av = Number(a?.current_balance ?? a?.opening_balance ?? 0);
        bv = Number(b?.current_balance ?? b?.opening_balance ?? 0);
      }
      if (av == null) av = '';
      if (bv == null) bv = '';
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const s = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? s : -s;
    });
    return arr;
  }, [filteredAccounts, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedAccounts.length / entriesPerPage));
  const pageStart = (currentPage - 1) * entriesPerPage;
  const pagedAccounts = sortedAccounts.slice(pageStart, pageStart + entriesPerPage);

  const kpiData = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter(a => a.status === 'active').length;
    const types = new Set();
    accounts.forEach(a => {
      const c = a.type?.code || a.type?.name || a.account_type;
      if (c) types.add(c);
    });
    const totalBalance = accounts.reduce((s, a) => s + Number(a.current_balance ?? a.opening_balance ?? 0), 0);
    const cash = accounts.filter(a => a.is_cash_account || a.is_bank_account).length;
    return [
      { label: 'Total Accounts', value: total, icon: faCalculator, color: t.primary, sub: `${types.size} types` },
      { label: 'Active', value: active, icon: faCheckCircle, color: t.success, sub: total ? `${Math.round((active / total) * 100)}% active` : '—' },
      { label: 'Cash & Bank', value: cash, icon: faCashRegister, color: t.warning, sub: 'Liquidity accounts' },
      { label: 'Net Balance', value: formatMoneyShort(totalBalance), icon: faMoneyBillWave, color: t.info, sub: 'Across all currencies' },
    ];
  }, [accounts, t]);

  const groupedAccounts = useMemo(() => {
    const groups = {};
    sortedAccounts.forEach(a => {
      const key = a.type?.name || a.type?.code || a.account_type || 'Uncategorized';
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });
    return groups;
  }, [sortedAccounts]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAccount(deleteTarget.id);
      addNotification?.({ type: 'success', message: `Account "${deleteTarget.name}" deleted` });
      setDeleteTarget(null);
      fetchData(true);
    } catch (err) {
      addNotification?.({ type: 'error', message: err?.response?.data?.message || err?.message || 'Delete failed' });
    }
  };

  const handleEdit = (acc) => {
    setFormAccount(acc);
    setFormOpen(true);
  };

  const handleNew = () => {
    setFormAccount(null);
    setFormOpen(true);
  };

  const handleCopy = (acc) => {
    setFormAccount({
      ...acc,
      id: null,
      code: `${acc.code}-COPY`,
      name: `${acc.name} (Copy)`,
      status: 'draft',
    });
    setFormOpen(true);
  };

  const clearFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
  };

  const filterCount = (typeFilter ? 1 : 0) + (statusFilter ? 1 : 0);

  const headerAction = (
    <div className="d-flex flex-wrap gap-2">
      <ActionButton
        t={t}
        icon={faFileImport}
        label="Import"
        onClick={() => setImportOpen(true)}
        variant="subtle"
      />
      <ActionButton
        t={t}
        icon={faFileExport}
        label="Export"
        onClick={() => setExportOpen(true)}
        variant="subtle"
      />
      <ActionButton
        t={t}
        icon={faPlus}
        label="Add Account"
        onClick={handleNew}
        variant="primary"
      />
    </div>
  );

  return (
    <ErpPageShell
      icon={faCalculator}
      title="Chart of Accounts"
      description="Master index of all financial general ledger accounts. Import, export, and manage the full account hierarchy."
      action={headerAction}
    >
      {/* KPI Cards */}
      <div className="row g-3 mb-3">
        {kpiData.map((k, i) => (
          <ErpKpiCard
            key={i}
            label={k.label}
            value={k.value}
            icon={k.icon}
            color={k.color}
            sub={k.sub}
            isDark={isDark}
            colClass="col-12 col-sm-6 col-lg-3"
          />
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
          boxShadow: t.shadow,
        }}
      >
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5 col-lg-4">
            <SearchInput
              t={t}
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by code, name, type, or description…"
            />
          </div>
          <div className="col-6 col-md-3 col-lg-3">
            <ViewSwitcher t={t} value={viewMode} onChange={setViewMode} />
          </div>
          <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-end align-items-center gap-2">
            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                background: showFilters || filterCount > 0 ? t.primarySoft : t.surfaceAlt,
                color: showFilters || filterCount > 0 ? t.primary : t.textMuted,
                border: `1px solid ${showFilters || filterCount > 0 ? t.primaryBorder : t.border}`,
                borderRadius: 8,
                padding: '0.45rem 0.8rem',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                position: 'relative',
              }}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
              {filterCount > 0 && (
                <span style={{
                  background: t.primary, color: '#fff',
                  borderRadius: 999, fontSize: '0.65rem',
                  padding: '1px 6px', marginLeft: 2,
                }}>{filterCount}</span>
              )}
            </button>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              aria-label="Refresh"
              style={{
                background: t.surfaceAlt, color: t.text,
                border: `1px solid ${t.border}`,
                borderRadius: 8, padding: '0.45rem 0.7rem',
                fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              <FontAwesomeIcon icon={faRefresh} spin={refreshing} />
            </button>
            <EntriesSelector
              t={t}
              value={entriesPerPage}
              onChange={(v) => { setEntriesPerPage(v); setCurrentPage(1); }}
            />
          </div>
        </div>

        {showFilters && (
          <div className="row g-2 mt-2" style={{ paddingTop: '0.85rem', borderTop: `1px solid ${t.border}` }}>
            <div className="col-12 col-md-4">
              <FilterSelect
                t={t}
                label="Account type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: '', label: 'All types' },
                  { value: 'asset', label: 'Asset' },
                  { value: 'liability', label: 'Liability' },
                  { value: 'equity', label: 'Equity' },
                  { value: 'revenue', label: 'Revenue' },
                  { value: 'expense', label: 'Expense' },
                ]}
              />
            </div>
            <div className="col-12 col-md-4">
              <FilterSelect
                t={t}
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: '', label: 'Any status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'archived', label: 'Archived' },
                  { value: 'draft', label: 'Draft' },
                ]}
              />
            </div>
            <div className="col-12 col-md-4 d-flex align-items-end">
              <button
                onClick={clearFilters}
                disabled={filterCount === 0}
                style={{
                  background: 'transparent', color: t.textMuted,
                  border: `1px solid ${t.border}`,
                  borderRadius: 8, padding: '0.5rem 0.9rem',
                  fontSize: '0.82rem', fontWeight: 500,
                  cursor: filterCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: filterCount === 0 ? 0.5 : 1,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <FontAwesomeIcon icon={faTimes} /> Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {error && (
        <div
          style={{
            background: t.dangerSoft, color: t.danger,
            border: `1px solid ${t.dangerBorder}`,
            borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <div style={{ flex: 1, fontSize: '0.85rem' }}>{error}</div>
          <button
            onClick={() => fetchData()}
            style={{
              background: 'transparent', border: 'none', color: t.danger,
              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {viewMode === 'list' && (
        <AccountsTable
          t={t}
          isDark={isDark}
          loading={loading}
          accounts={pagedAccounts}
          total={sortedAccounts.length}
          pageStart={pageStart}
          currentPage={currentPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          onPage={setCurrentPage}
          onSort={toggleSort}
          sortBy={sortBy}
          sortDir={sortDir}
          onEdit={handleEdit}
          onCopy={handleCopy}
          onDelete={setDeleteTarget}
          onAdd={handleNew}
        />
      )}

      {viewMode === 'grouped' && (
        <GroupedView
          t={t}
          isDark={isDark}
          groups={groupedAccounts}
          loading={loading}
          onEdit={handleEdit}
          onCopy={handleCopy}
          onDelete={setDeleteTarget}
          onAdd={handleNew}
        />
      )}

      <DeleteConfirmDialog
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete account"
        message={`Are you sure you want to delete "${deleteTarget?.name || ''}"? This action cannot be undone.`}
        itemName={deleteTarget?.name}
        confirmLabel="Delete"
      />

      <CoaImportWizard
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={() => fetchData(true)}
        isDark={isDark}
      />

      <CoaExportDialog
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        isDark={isDark}
        searchTerm={searchTerm}
      />

      <AccountFormDrawer
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => fetchData(true)}
        account={formAccount}
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const formatMoneyShort = (v) => {
  const n = Number(v) || 0;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatBalance = (v, currency = 'USD') => {
  const n = Number(v || 0);
  return `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const ActionButton = ({ t, icon, label, onClick, variant = 'subtle' }) => {
  const isPrimary = variant === 'primary';
  return (
    <button
      onClick={onClick}
      style={{
        background: isPrimary ? t.primary : t.surfaceAlt,
        color: isPrimary ? '#fff' : t.text,
        border: `1px solid ${isPrimary ? t.primary : t.border}`,
        borderRadius: 10,
        padding: '0.55rem 0.95rem',
        fontSize: '0.85rem', fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        boxShadow: isPrimary ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        if (isPrimary) e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (isPrimary) e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)';
      }}
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </button>
  );
};

const SearchInput = ({ t, value, onChange, placeholder }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center',
      background: t.surfaceAlt,
      border: `1px solid ${t.border}`,
      borderRadius: 10,
      padding: '0.5rem 0.85rem',
      gap: 8,
    }}
  >
    <FontAwesomeIcon icon={faSearch} style={{ color: t.textMuted, fontSize: '0.85rem' }} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        color: t.text, fontSize: '0.85rem',
      }}
    />
    {value && (
      <button
        onClick={() => onChange('')}
        aria-label="Clear search"
        style={{
          background: 'transparent', border: 'none', color: t.textMuted,
          cursor: 'pointer', padding: 0, fontSize: '0.75rem',
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    )}
  </div>
);

const ViewSwitcher = ({ t, value, onChange }) => (
  <div
    style={{
      display: 'inline-flex',
      background: t.surfaceAlt,
      border: `1px solid ${t.border}`,
      borderRadius: 10,
      padding: 3,
    }}
  >
    {VIEW_MODES.map(m => {
      const active = value === m.key;
      return (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          aria-label={m.label}
          style={{
            background: active ? t.surface : 'transparent',
            color: active ? t.primary : t.textMuted,
            border: 'none',
            borderRadius: 7,
            padding: '0.4rem 0.85rem',
            fontSize: '0.82rem', fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          <FontAwesomeIcon icon={m.icon} /> {m.label}
        </button>
      );
    })}
  </div>
);

const FilterSelect = ({ t, label, value, onChange, options }) => (
  <div>
    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        background: t.surfaceAlt,
        color: t.text,
        border: `1px solid ${t.border}`,
        borderRadius: 8,
        padding: '0.5rem 0.7rem',
        fontSize: '0.85rem',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const EntriesSelector = ({ t, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    aria-label="Entries per page"
    style={{
      background: t.surfaceAlt,
      color: t.text,
      border: `1px solid ${t.border}`,
      borderRadius: 8,
      padding: '0.45rem 0.6rem',
      fontSize: '0.8rem',
      cursor: 'pointer',
    }}
  >
    {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
  </select>
);

const SortHeader = ({ t, label, col, sortBy, sortDir, onSort, align = 'left' }) => {
  const isActive = sortBy === col;
  return (
    <button
      onClick={() => onSort(col)}
      style={{
        background: 'transparent', border: 'none',
        color: isActive ? t.primary : t.textMuted,
        fontSize: '0.72rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: 0, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {label}
      <FontAwesomeIcon
        icon={isActive ? (sortDir === 'asc' ? faSortUp : faSortDown) : faSort}
        style={{ fontSize: '0.65rem', opacity: isActive ? 1 : 0.4 }}
      />
    </button>
  );
};

const StatusPill = ({ status, t, isDark }) => {
  const c = statusColor(status, isDark);
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: c.bg, color: c.fg,
        borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
        padding: '2px 9px',
        textTransform: 'capitalize',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg }} />
      {status || 'active'}
    </span>
  );
};

const TypePill = ({ type, accountType, t, isDark }) => {
  const code = type?.code || type?.name || accountType || '—';
  const c = accountTypeColor(code, isDark);
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: c.bg, color: c.fg,
        borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
        padding: '2px 8px',
        textTransform: 'capitalize',
      }}
    >
      {String(code).toLowerCase()}
    </span>
  );
};

const AccountsTable = ({
  t, isDark, loading, accounts, total, pageStart, currentPage, totalPages,
  entriesPerPage, onPage, onSort, sortBy, sortDir, onEdit, onCopy, onDelete, onAdd,
}) => {
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: t.shadow,
      }}
    >
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.surfaceAlt, borderBottom: `1px solid ${t.border}` }}>
              <Th>
                <SortHeader t={t} col="code" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Code" />
              </Th>
              <Th>
                <SortHeader t={t} col="name" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Account" />
              </Th>
              <Th hideOnMobile>
                <SortHeader t={t} col="type" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Type" />
              </Th>
              <Th hideOnTablet>
                <SortHeader t={t} col="group" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Group" />
              </Th>
              <Th hideOnDesktop>
                <SortHeader t={t} col="normal_balance" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Normal" />
              </Th>
              <Th hideOnMobile align="right">
                <SortHeader t={t} col="balance" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Balance" align="right" />
              </Th>
              <Th hideOnMobile>
                <SortHeader t={t} col="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Status" />
              </Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} t={t} />
              ))
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <EmptyState t={t} onAdd={onAdd} />
                </td>
              </tr>
            ) : (
              accounts.map((a) => (
                <AccountRow
                  key={a.id}
                  account={a}
                  t={t}
                  isDark={isDark}
                  onEdit={onEdit}
                  onCopy={onCopy}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div
          className="d-flex flex-wrap align-items-center justify-content-between gap-2"
          style={{ padding: '0.85rem 1rem', borderTop: `1px solid ${t.border}`, background: t.surfaceAlt }}
        >
          <div style={{ fontSize: '0.78rem', color: t.textMuted }}>
            Showing <strong style={{ color: t.text }}>{pageStart + 1}</strong>–<strong style={{ color: t.text }}>{Math.min(pageStart + entriesPerPage, total)}</strong> of <strong style={{ color: t.text }}>{total}</strong>
          </div>
          <Pagination t={t} currentPage={currentPage} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
};

const Th = ({ children, hideOnMobile, hideOnTablet, hideOnDesktop, align = 'left' }) => (
  <th
    className={[
      hideOnMobile ? 'd-none d-sm-table-cell' : '',
      hideOnTablet ? 'd-none d-md-table-cell' : '',
      hideOnDesktop ? 'd-none d-lg-table-cell' : '',
    ].filter(Boolean).join(' ')}
    style={{
      padding: '0.7rem 0.9rem',
      textAlign: align,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </th>
);

const AccountRow = ({ account, t, isDark, onEdit, onCopy, onDelete }) => {
  const type = account.type || account.account_type;
  const group = account.group || account.account_group;
  const balance = account.current_balance ?? account.opening_balance ?? 0;
  const currency = account.currency || 'USD';
  return (
    <tr
      style={{
        borderBottom: `1px solid ${t.border}`,
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceHover}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <td style={{ padding: '0.7rem 0.9rem' }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          color: t.text,
          background: t.surfaceAlt,
          padding: '2px 8px',
          borderRadius: 4,
          border: `1px solid ${t.border}`,
        }}>
          {account.code}
        </span>
      </td>
      <td style={{ padding: '0.7rem 0.9rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: t.text, fontWeight: 600, fontSize: '0.88rem' }}>{account.name}</span>
          {account.description && (
            <span style={{ color: t.textMuted, fontSize: '0.72rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {account.description}
            </span>
          )}
        </div>
      </td>
      <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
        <TypePill type={type} accountType={account.account_type} t={t} isDark={isDark} />
      </td>
      <td className="d-none d-md-table-cell" style={{ padding: '0.7rem 0.9rem', color: t.textMuted, fontSize: '0.82rem' }}>
        {group?.name || group?.code || account.account_group || '—'}
      </td>
      <td className="d-none d-lg-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
        <span style={{
          textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700,
          color: t.textMuted, letterSpacing: '0.04em',
        }}>
          {account.normal_balance || '—'}
        </span>
      </td>
      <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem', textAlign: 'right' }}>
        <span style={{
          fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600,
          color: Number(balance) < 0 ? t.danger : t.text,
        }}>
          {formatBalance(balance, currency)}
        </span>
      </td>
      <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
        <StatusPill status={account.status} t={t} isDark={isDark} />
      </td>
      <td style={{ padding: '0.7rem 0.9rem', textAlign: 'right' }}>
        <div className="d-flex gap-1 justify-content-end">
          <IconAction t={t} icon={faEdit} onClick={() => onEdit(account)} title="Edit" />
          <IconAction t={t} icon={faCopy} onClick={() => onCopy(account)} title="Duplicate" />
          <IconAction t={t} icon={faTrash} onClick={() => onDelete(account)} title="Delete" variant="danger" />
        </div>
      </td>
    </tr>
  );
};

const IconAction = ({ t, icon, onClick, title, variant = 'default' }) => {
  const color = variant === 'danger' ? t.danger : t.textMuted;
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        background: 'transparent',
        border: `1px solid transparent`,
        color, padding: 6, borderRadius: 6,
        cursor: 'pointer', fontSize: '0.78rem',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = t.surfaceAlt;
        e.currentTarget.style.borderColor = t.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

const SkeletonRow = ({ t }) => (
  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} style={{ padding: '0.85rem 0.9rem' }}>
        <div style={{
          height: 14, borderRadius: 4,
          background: `linear-gradient(90deg, ${t.surfaceAlt} 0%, ${t.surfaceHover} 50%, ${t.surfaceAlt} 100%)`,
          backgroundSize: '200% 100%',
          animation: 'coashimmer 1.4s ease-in-out infinite',
          width: `${60 + (i * 7) % 35}%`,
        }} />
      </td>
    ))}
  </tr>
);

const EmptyState = ({ t, onAdd }) => (
  <div style={{ padding: '1rem' }}>
    <div
      style={{
        width: 64, height: 64, borderRadius: 18,
        background: t.surfaceAlt, color: t.textMuted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', margin: '0 auto 0.85rem',
      }}
    >
      <FontAwesomeIcon icon={faCalculator} />
    </div>
    <h6 style={{ color: t.text, margin: 0, fontSize: '1rem' }}>No accounts yet</h6>
    <p style={{ color: t.textMuted, fontSize: '0.85rem', margin: '0.4rem auto 1rem', maxWidth: 380 }}>
      Get started by adding your first account, or import a chart of accounts from a CSV or Excel file.
    </p>
    <button
      onClick={onAdd}
      style={{
        background: t.primary, color: '#fff', border: 'none',
        padding: '0.5rem 1.1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
      }}
    >
      <FontAwesomeIcon icon={faPlus} /> Add your first account
    </button>
  </div>
);

const Pagination = ({ t, currentPage, totalPages, onPage }) => {
  const pages = useMemo(() => {
    const result = [];
    const max = totalPages;
    const cur = currentPage;
    if (max <= 7) {
      for (let i = 1; i <= max; i++) result.push(i);
    } else {
      result.push(1);
      if (cur > 3) result.push('…');
      for (let i = Math.max(2, cur - 1); i <= Math.min(max - 1, cur + 1); i++) result.push(i);
      if (cur < max - 2) result.push('…');
      result.push(max);
    }
    return result;
  }, [currentPage, totalPages]);

  return (
    <div className="d-flex align-items-center gap-1">
      <PageBtn t={t} disabled={currentPage <= 1} onClick={() => onPage(currentPage - 1)} aria-label="Previous">
        ‹
      </PageBtn>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} style={{ color: t.textMuted, padding: '0 0.4rem' }}>…</span>
        ) : (
          <PageBtn
            key={p}
            t={t}
            active={p === currentPage}
            onClick={() => onPage(p)}
            aria-label={`Page ${p}`}
          >
            {p}
          </PageBtn>
        )
      )}
      <PageBtn t={t} disabled={currentPage >= totalPages} onClick={() => onPage(currentPage + 1)} aria-label="Next">
        ›
      </PageBtn>
    </div>
  );
};

const PageBtn = ({ t, children, active, disabled, onClick, ...rest }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    {...rest}
    style={{
      background: active ? t.primary : t.surfaceAlt,
      color: active ? '#fff' : (disabled ? t.textSubtle : t.text),
      border: `1px solid ${active ? t.primary : t.border}`,
      borderRadius: 6,
      minWidth: 32, height: 32,
      fontSize: '0.8rem', fontWeight: active ? 700 : 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      padding: '0 0.5rem',
      transition: 'all 0.15s',
    }}
  >
    {children}
  </button>
);

const GroupedView = ({ t, isDark, groups, loading, onEdit, onCopy, onDelete, onAdd }) => {
  if (loading) {
    return (
      <div
        style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 14, padding: '2rem', textAlign: 'center',
          color: t.textMuted,
        }}
      >
        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '1.5rem', marginBottom: 8 }} />
        <div>Loading accounts…</div>
      </div>
    );
  }
  if (Object.keys(groups).length === 0) {
    return (
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 14, padding: '2.5rem 1.5rem', textAlign: 'center',
      }}>
        <EmptyState t={t} onAdd={onAdd} />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column gap-3">
      {Object.entries(groups).map(([typeName, list]) => {
        const total = list.reduce((s, a) => s + Number(a.current_balance ?? a.opening_balance ?? 0), 0);
        const c = accountTypeColor(typeName, isDark);
        return (
          <div
            key={typeName}
            style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 14, overflow: 'hidden', boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                padding: '0.85rem 1.1rem',
                background: t.surfaceAlt,
                borderBottom: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 8,
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: c.bg, color: c.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {String(typeName).charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: t.text, textTransform: 'capitalize' }}>
                    {typeName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: t.textMuted }}>
                    {list.length} account{list.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: Number(total) < 0 ? t.danger : t.text }}>
                {formatBalance(total)}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {list.map((a) => (
                    <AccountRow
                      key={a.id}
                      account={a}
                      t={t}
                      isDark={isDark}
                      onEdit={onEdit}
                      onCopy={onCopy}
                      onDelete={onDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ErpChartOfAccounts;
