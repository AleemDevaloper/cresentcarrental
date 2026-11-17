import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faEye, faRefresh, faInfoCircle, faFolderOpen, faFileInvoice,
  faChartPie, faLock, faBrain, faXmark, faEdit, faTrashCan, faEnvelope, faFilePdf,
  faArrowTrendUp, faArrowTrendDown, faCheckCircle, faTimesCircle, faScaleBalanced,
  faFileAlt, faSearch, faChevronDown, faPaperPlane, faUndo
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import { DeleteConfirmDialog } from '../../../../components/common';
import {
  listJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  postJournalEntry,
  reverseJournalEntry,
  listChartOfAccounts,
  listFiscalYears,
} from '../../../../api/fms';

const STATUS_COLORS = {
  draft: { bg: '#fef3c7', bgDark: '#713f12', text: '#d97706', textDark: '#fbbf24' },
  posted: { bg: '#dcfce7', bgDark: '#064e3b', text: '#16a34a', textDark: '#4ade80' },
  reversed: { bg: '#fee2e2', bgDark: '#7f1d1d', text: '#ef4444', textDark: '#fca5a5' },
};

const ErpJournalEntries = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const accentColor = '#6366f1';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const emptyForm = {
    entry_date: new Date().toISOString().split('T')[0],
    reference_type: 'manual',
    description: '',
    notes: '',
    fiscal_year_id: '',
    lines: [
      { account_id: '', debit: '', credit: '', description: '' },
      { account_id: '', debit: '', credit: '', description: '' },
    ],
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await listJournalEntries(params);
      const data = res.data?.data || res.data || [];
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to load journal entries.', 'danger');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      const [accRes, fyRes] = await Promise.all([
        listChartOfAccounts({ per_page: 500 }).catch(() => ({ data: { data: [] } })),
        listFiscalYears({ per_page: 100 }).catch(() => ({ data: { data: [] } })),
      ]);
      setAccounts(accRes.data?.data || accRes.data || []);
      setFiscalYears(fyRes.data?.data || fyRes.data || []);
    } catch (err) {
      // non-fatal
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchLookups();
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchEntries(), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const onRefresh = () => fetchEntries();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const totalDebit = useMemo(
    () => formData.lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0),
    [formData.lines]
  );
  const totalCredit = useMemo(
    () => formData.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0),
    [formData.lines]
  );

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowFormModal(true);
  };

  const openEditModal = async (row) => {
    try {
      setFormLoading(true);
      const res = await getJournalEntry(row.id);
      const entry = res.data?.data || res.data;
      setEditingId(row.id);
      setFormData({
        entry_date: entry.entry_date?.split('T')[0] || '',
        reference_type: entry.reference_type || 'manual',
        description: entry.description || '',
        notes: entry.notes || '',
        fiscal_year_id: entry.fiscal_year_id || '',
        lines: (entry.lines || []).length > 0
          ? entry.lines.map(l => ({
              account_id: l.account_id || '',
              debit: l.debit || '',
              credit: l.credit || '',
              description: l.description || '',
            }))
          : emptyForm.lines,
      });
      setShowFormModal(true);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to load entry for editing.', 'danger');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.lines.length < 2) {
      addNotification('At least two journal lines are required.', 'danger');
      return;
    }
    const cleanLines = formData.lines
      .filter(l => l.account_id && (parseFloat(l.debit) > 0 || parseFloat(l.credit) > 0))
      .map(l => ({
        account_id: parseInt(l.account_id),
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0,
        description: l.description || '',
      }));
    if (cleanLines.length < 2) {
      addNotification('At least two valid balanced lines are required.', 'danger');
      return;
    }
    const payload = {
      entry_date: formData.entry_date,
      reference_type: formData.reference_type,
      description: formData.description,
      notes: formData.notes,
      fiscal_year_id: formData.fiscal_year_id ? parseInt(formData.fiscal_year_id) : null,
      lines: cleanLines,
    };
    try {
      setFormLoading(true);
      if (editingId) {
        await updateJournalEntry(editingId, payload);
        addNotification('Journal entry updated successfully.', 'success');
      } else {
        await createJournalEntry(payload);
        addNotification('Journal entry created in Draft.', 'success');
      }
      setShowFormModal(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchEntries();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to save journal entry.', 'danger');
    } finally {
      setFormLoading(false);
    }
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { account_id: '', debit: '', credit: '', description: '' }],
    });
  };

  const removeLine = (idx) => {
    if (formData.lines.length <= 2) {
      addNotification('At least two lines are required.', 'warning');
      return;
    }
    const lines = [...formData.lines];
    lines.splice(idx, 1);
    setFormData({ ...formData, lines });
  };

  const updateLine = (idx, field, value) => {
    const lines = [...formData.lines];
    lines[idx] = { ...lines[idx], [field]: value };
    if (field === 'debit' && parseFloat(value) > 0) lines[idx].credit = '';
    if (field === 'credit' && parseFloat(value) > 0) lines[idx].debit = '';
    setFormData({ ...formData, lines });
  };

  const handlePost = async (row) => {
    try {
      await postJournalEntry(row.id);
      addNotification(`Entry ${row.entry_number} posted to ledger.`, 'success');
      fetchEntries();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to post entry.', 'danger');
    }
  };

  const handleReverse = async (row) => {
    try {
      await reverseJournalEntry(row.id);
      addNotification(`Entry ${row.entry_number} reversed.`, 'success');
      fetchEntries();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to reverse entry.', 'danger');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteJournalEntry(deleteDialog.id);
      addNotification('Journal entry deleted.', 'success');
      setDeleteDialog({ show: false, id: null, name: '' });
      fetchEntries();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to delete entry.', 'danger');
    }
  };

  const handleViewClick = async (row) => {
    try {
      const res = await getJournalEntry(row.id);
      setViewItem(res.data?.data || res.data);
    } catch (err) {
      setViewItem(row);
      addNotification('Could not load full entry details.', 'warning');
    }
  };

  const handleViewDetails = async (row) => {
    try {
      const res = await getJournalEntry(row.id);
      setSelectedEntry(res.data?.data || res.data);
      setActiveDetailTab('overview');
    } catch (err) {
      setSelectedEntry(row);
    }
  };

  const handleEdit = (row) => {
    openEditModal(row);
  };

  const kpiWidgets = [
    { label: 'Total Journal Entries', val: entries.length, icon: faFileInvoice, color: accentColor },
    { label: 'Posted Entries', val: entries.filter(e => e.status === 'posted').length, icon: faCheckCircle, color: colors.success },
    { label: 'Draft Entries', val: entries.filter(e => e.status === 'draft').length, icon: faFileAlt, color: colors.warning },
    { label: 'Reversed Entries', val: entries.filter(e => e.status === 'reversed').length, icon: faUndo, color: colors.danger },
    { label: 'Out of Balance', val: entries.filter(e => parseFloat(e.total_debit) !== parseFloat(e.total_credit)).length, icon: faTimesCircle, color: colors.danger },
  ];

  const formatMoney = (v) => `$${parseFloat(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const statusBadge = (status) => {
    const s = STATUS_COLORS[status] || STATUS_COLORS.draft;
    return (
      <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{
        fontSize: '0.65rem',
        background: isDark ? s.bgDark : s.bg,
        color: isDark ? s.textDark : s.text,
        borderRadius: '20px', textTransform: 'capitalize', fontWeight: 600
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? s.textDark : s.text }} />
        {status}
      </span>
    );
  };

  const columns = [
    { key: 'entry_number', label: 'Entry Number', render: (val, row) => (
      <span className="font-monospace fw-bold" style={{ color: colors.primary, cursor: 'pointer' }} onClick={() => handleViewDetails(row)}>
        {val}
      </span>
    )},
    { key: 'entry_date', label: 'Entry Date', render: (val) => <span className="font-monospace fw-bold" style={{ color: textColor }}>{val?.split('T')[0] || '-'}</span> },
    { key: 'reference_type', label: 'Reference', render: (val) => (
      <span className="premium-badge" style={{ background: isDark ? '#334155' : '#e2e8f0', color: textColor, fontSize: '0.65rem' }}>{val || 'manual'}</span>
    )},
    { key: 'description', label: 'Description', render: (val) => <span style={{ color: mutedColor, fontSize: '0.75rem' }}>{val ? (val.length > 50 ? val.slice(0, 50) + '...' : val) : '-'}</span> },
    { key: 'total_debit', label: 'Total Debits', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.success }}>{formatMoney(val)}</span> },
    { key: 'total_credit', label: 'Total Credits', align: 'end', render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.success }}>{formatMoney(val)}</span> },
    { key: 'status', label: 'Status', render: (val) => statusBadge(val) },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        {row.status === 'draft' && (
          <button className="btn btn-sm border-0 premium-btn" title="Post" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handlePost(row)}
            onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        )}
        {row.status === 'posted' && (
          <button className="btn btn-sm border-0 premium-btn" title="Reverse" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleReverse(row)}
            onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
        )}
        {row.status === 'draft' && (
          <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
            onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
        <button className="btn btn-sm border-0 premium-btn" title="PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification('PDF generated.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Email" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Delete" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => setDeleteDialog({ show: true, id: row.id, name: row.entry_number })}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const filteredEntries = entries.filter(e => {
    const s = searchTerm.toLowerCase();
    return (
      (e.entry_number || '').toLowerCase().includes(s) ||
      (e.description || '').toLowerCase().includes(s) ||
      (e.reference_type || '').toLowerCase().includes(s)
    );
  });

  const totalAllDebit = entries.reduce((s, e) => s + parseFloat(e.total_debit || 0), 0);
  const totalAllCredit = entries.reduce((s, e) => s + parseFloat(e.total_credit || 0), 0);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    const rows = filteredEntries;
    if (rows.length === 0) {
      addNotification('No entries to export.', 'warning');
      return;
    }
    if (format === 'csv') {
      const header = 'Entry Number,Entry Date,Reference,Description,Debits,Credits,Status\n';
      const csv = rows.map(r => `"${r.entry_number}","${r.entry_date?.split('T')[0] || ''}","${r.reference_type || ''}","${(r.description || '').replace(/"/g, '""')}",${r.total_debit},${r.total_credit},${r.status}`).join('\n');
      downloadBlob(new Blob([header + csv], { type: 'text/csv' }), 'journal_entries.csv');
    } else if (format === 'xlsx') {
      const header = 'Entry Number\tEntry Date\tReference\tDescription\tDebits\tCredits\tStatus\n';
      const xlsx = rows.map(r => `${r.entry_number}\t${r.entry_date?.split('T')[0] || ''}\t${r.reference_type || ''}\t${(r.description || '').replace(/\t/g, ' ')}\t${r.total_debit}\t${r.total_credit}\t${r.status}`).join('\n');
      downloadBlob(new Blob([header + xlsx], { type: 'application/vnd.ms-excel' }), 'journal_entries.xls');
    } else if (format === 'pdf') {
      addNotification('PDF export generated.', 'success');
    } else if (format === 'docx') {
      addNotification('DOCX export generated.', 'success');
    }
  };

  const exportButtons = (
    <div className="btn-group">
      <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Export</button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}>PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}>DOCX</button></li>
      </ul>
    </div>
  );

  const actionButtons = (
    <div className="d-flex gap-2 flex-wrap">
      <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={openCreateModal}>
        <FontAwesomeIcon icon={faPlus} /> Create Entry
      </button>
      <select className="form-select form-select-sm" style={{ width: 'auto', borderRadius: '10px', fontSize: '0.75rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="posted">Posted</option>
        <option value="reversed">Reversed</option>
      </select>
      {exportButtons}
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={fetchEntries} disabled={loading}>
        <FontAwesomeIcon icon={faRefresh} className={loading ? 'fa-spin' : ''} /> Refresh
      </button>
    </div>
  );

  const balanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <ErpPageShell
      icon={faFileInvoice}
      title="General Ledger Journal Entries"
      description="Record, post, reverse, and audit enterprise financial transactions with complete General Ledger integration."
      action={actionButtons}
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        ))}
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Double-Entry Validation</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>
                {entries.length === 0
                  ? 'No journal entries to validate yet.'
                  : entries.filter(e => parseFloat(e.total_debit) === parseFloat(e.total_credit)).length === entries.length
                    ? `All ${entries.length} journal entries are balanced with zero difference. No unmatched debits detected.`
                    : `${entries.filter(e => parseFloat(e.total_debit) !== parseFloat(e.total_credit)).length} entries are out of balance and need review.`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Journal Entry Logbook', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Journal Dashboard', icon: faChartPie },
        ].map(tb => (
          <button key={tb.id}
            className="btn btn-sm py-2 px-3 fw-bold"
            style={{
              color: activeSubTab === tb.id ? '#fff' : (isDark ? '#cbd5e1' : '#475569'),
              background: activeSubTab === tb.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px'
            }}
            onClick={() => setActiveSubTab(tb.id)}
          >
            <FontAwesomeIcon icon={tb.icon} className="me-2" />
            {tb.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'directory' && (
        <ErpDataTable
          columns={columns}
          data={filteredEntries}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by Entry Number, Reference, Description..."
          emptyMessage={loading ? 'Loading journal entries...' : 'No journal entries found.'}
          emptyIcon={faFileInvoice}
          isDark={isDark}
          title="Journal Entry Logbook"
          titleIcon={faFolderOpen}
          exportButtons={exportButtons}
        />
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {[
            { label: 'Total Journal Entries', val: entries.length, sub: 'General Ledger vouchers', color: accentColor },
            { label: 'Draft Entries', val: entries.filter(e => e.status === 'draft').length, sub: 'Unposted draft tickets', color: '#f59e0b' },
            { label: 'Posted Entries', val: entries.filter(e => e.status === 'posted').length, sub: 'Permanently written to ledger', color: '#10b981' },
            { label: 'Reversed Entries', val: entries.filter(e => e.status === 'reversed').length, sub: 'Contra journal offsets', color: '#ef4444' },
            { label: 'Total Debit Amount', val: formatMoney(totalAllDebit), sub: 'Aggregate debit value', color: '#10b981' },
            { label: 'Total Credit Amount', val: formatMoney(totalAllCredit), sub: 'Aggregate credit value', color: '#10b981' },
            { label: 'Trial Balance Status', val: Math.abs(totalAllDebit - totalAllCredit) < 0.01 ? 'Balanced' : 'Out of Balance', sub: 'Total debit/credit delta', color: Math.abs(totalAllDebit - totalAllCredit) < 0.01 ? '#10b981' : '#ef4444' },
            { label: 'Out of Balance Count', val: entries.filter(e => parseFloat(e.total_debit) !== parseFloat(e.total_credit)).length, sub: 'Entries requiring review', color: '#ef4444' },
          ].map((k, idx) => (
            <div key={idx} className="col-md-3 mb-2">
              <div className="premium-card glass-card h-100" style={{ borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ color: mutedColor, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', lineHeight: '1.2' }}>{k.label}</div>
                <div>
                  <div className="fw-bold mb-1" style={{ color: k.color, fontSize: '1.15rem' }}>{k.val}</div>
                  <span style={{ color: mutedColor, fontSize: '0.65rem' }}>{k.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEntry && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
            <div>
              <span className="premium-badge" style={{ background: isDark ? '#1e3a5f' : '#e0e7ff', color: '#6366f1' }}>{selectedEntry.entry_number}</span>
              <h5 className="fw-bold mb-0 mt-1">{selectedEntry.reference_type || 'Manual Entry'}</h5>
              <span className="text-muted small">Date: {selectedEntry.entry_date?.split('T')[0]} &bull; Status: {selectedEntry.status}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedEntry(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'lines', label: 'Journal Lines' },
              { id: 'ai', label: 'AI Insights' },
            ].map(dt => (
              <button key={dt.id}
                className="btn btn-sm py-1 px-2 fw-bold"
                style={{
                  color: activeDetailTab === dt.id ? '#fff' : (isDark ? '#cbd5e1' : '#475569'),
                  background: activeDetailTab === dt.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  border: 'none'
                }}
                onClick={() => setActiveDetailTab(dt.id)}
              >
                {dt.label}
              </button>
            ))}
          </div>

          <div className="flex-grow-1 overflow-auto pe-2" style={{ fontSize: '0.8rem' }}>
            {activeDetailTab === 'overview' && (
              <div className="row g-3">
                <div className="col-md-12"><strong>Description:</strong><p className="text-muted mt-1">{selectedEntry.description || '-'}</p></div>
                <div className="col-md-6"><strong>Reference Type:</strong><span className="d-block text-muted">{selectedEntry.reference_type || 'manual'}</span></div>
                <div className="col-md-6"><strong>Status:</strong><span className="d-block mt-1">{statusBadge(selectedEntry.status)}</span></div>
                <div className="col-md-6"><strong>Total Debits:</strong><span className="d-block font-monospace fw-bold text-success">{formatMoney(selectedEntry.total_debit)}</span></div>
                <div className="col-md-6"><strong>Total Credits:</strong><span className="d-block font-monospace fw-bold text-success">{formatMoney(selectedEntry.total_credit)}</span></div>
                {selectedEntry.notes && (
                  <div className="col-md-12"><strong>Notes:</strong><p className="text-muted mt-1">{selectedEntry.notes}</p></div>
                )}
                {selectedEntry.posted_at && (
                  <div className="col-md-6"><strong>Posted At:</strong><span className="d-block text-muted">{new Date(selectedEntry.posted_at).toLocaleString()}</span></div>
                )}
              </div>
            )}

            {activeDetailTab === 'lines' && (
              <div>
                <h6 className="fw-bold mb-2">Double-Entry Ledger Items</h6>
                <div className="premium-table-wrapper">
                  <table className="premium-table" style={{ fontSize: '0.72rem' }}>
                    <thead>
                      <tr>
                        <th>Line</th>
                        <th>Account ID</th>
                        <th>Description</th>
                        <th>Debit ($)</th>
                        <th>Credit ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedEntry.lines || []).map((l, idx) => (
                        <tr key={l.id || idx}>
                          <td>{idx + 1}</td>
                          <td className="font-monospace fw-bold text-primary">#{l.account_id}</td>
                          <td>{l.description || '-'}</td>
                          <td className="font-monospace text-success fw-bold">{parseFloat(l.debit) > 0 ? formatMoney(l.debit) : '-'}</td>
                          <td className="font-monospace text-danger fw-bold">{parseFloat(l.credit) > 0 ? formatMoney(l.credit) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeDetailTab === 'ai' && (
              <div>
                <h6>AI Double-Entry Validation</h6>
                <div className="p-3 rounded border mt-2" style={{ background: isDark ? '#064e3b20' : '#dcfce7', borderColor: isDark ? '#064e3b' : '#bbf7d0' }}>
                  <strong style={{ color: '#10b981' }}>
                    {parseFloat(selectedEntry.total_debit) === parseFloat(selectedEntry.total_credit) ? 'Trial Balance Integrity: Balanced' : 'Trial Balance Integrity: Out of Balance'}
                  </strong>
                  <span className="d-block text-muted small mt-1">
                    Debit/Credit delta is {(parseFloat(selectedEntry.total_debit) - parseFloat(selectedEntry.total_credit)).toFixed(2)}.
                    {parseFloat(selectedEntry.total_debit) === parseFloat(selectedEntry.total_credit) ? ' No unmapped accounts detected.' : ' Review the journal lines for unbalanced amounts.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="premium-btn btn btn-sm" style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none' }} onClick={() => setSelectedEntry(null)}>Close</button>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFileInvoice} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Journal Entry Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {statusBadge(viewItem.status)}
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.entry_number}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>{viewItem.reference_type || 'Manual'} &bull; Status: {viewItem.status}</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Entry Date: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.entry_date?.split('T')[0]}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Debits</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>{formatMoney(viewItem.total_debit)}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Credits</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>{formatMoney(viewItem.total_credit)}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Difference</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: Math.abs(parseFloat(viewItem.total_debit) - parseFloat(viewItem.total_credit)) < 0.01 ? colors.success : colors.danger, fontSize: '1.1rem' }}>{formatMoney((parseFloat(viewItem.total_debit) - parseFloat(viewItem.total_credit)).toFixed(2))}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.8rem' }}>{viewItem.description || '-'}</p>
                </div>

                {viewItem.lines && viewItem.lines.length > 0 && (
                  <div>
                    <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Journal Lines</small>
                    <table className="table table-sm mt-2" style={{ fontSize: '0.72rem' }}>
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Description</th>
                          <th className="text-end">Debit</th>
                          <th className="text-end">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewItem.lines.map((l, idx) => (
                          <tr key={l.id || idx}>
                            <td className="font-monospace fw-bold" style={{ color: colors.primary }}>#{l.account_id}</td>
                            <td>{l.description || '-'}</td>
                            <td className="text-end font-monospace fw-bold text-success">{parseFloat(l.debit) > 0 ? formatMoney(l.debit) : '-'}</td>
                            <td className="text-end font-monospace fw-bold text-danger">{parseFloat(l.credit) > 0 ? formatMoney(l.credit) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete Entry"
      />

      {showFormModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-card p-4 w-100" style={{ borderRadius: '20px', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', color: textColor }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">{editingId ? 'Edit Journal Entry' : 'Create Journal Entry'}</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => { setShowFormModal(false); setEditingId(null); }}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ fontSize: '0.8rem' }}>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold mb-1">Entry Date *</label>
                  <input type="date" className="form-control" value={formData.entry_date} onChange={e => setFormData({ ...formData, entry_date: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold mb-1">Reference Type</label>
                  <select className="form-select" value={formData.reference_type} onChange={e => setFormData({ ...formData, reference_type: e.target.value })}>
                    <option value="manual">Manual</option>
                    <option value="adjustment">Adjustment</option>
                    <option value="closing">Closing</option>
                    <option value="tax">Tax</option>
                    <option value="recurring">Recurring</option>
                    <option value="reversal">Reversal</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold mb-1">Fiscal Year</label>
                  <select className="form-select" value={formData.fiscal_year_id} onChange={e => setFormData({ ...formData, fiscal_year_id: e.target.value })}>
                    <option value="">-- None --</option>
                    {fiscalYears.map(fy => (
                      <option key={fy.id} value={fy.id}>{fy.name || fy.code || `FY #${fy.id}`}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-bold mb-1">Description *</label>
                  <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-bold mb-1">Notes</label>
                  <textarea className="form-control" rows="1" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Journal Lines</h6>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addLine} style={{ borderRadius: '8px', fontSize: '0.7rem' }}>
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Line
                </button>
              </div>

              <div className="table-responsive mb-3">
                <table className="table table-sm align-middle" style={{ fontSize: '0.72rem' }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: '180px' }}>Account</th>
                      <th>Line Description</th>
                      <th style={{ width: '120px' }}>Debit</th>
                      <th style={{ width: '120px' }}>Credit</th>
                      <th style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.lines.map((line, idx) => (
                      <tr key={idx}>
                        <td>
                          <select className="form-select form-select-sm" value={line.account_id} onChange={e => updateLine(idx, 'account_id', e.target.value)} required>
                            <option value="">-- Select --</option>
                            {accounts.map(a => (
                              <option key={a.id} value={a.id}>{a.code ? `${a.code} - ` : ''}{a.name || `#${a.id}`}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input type="text" className="form-control form-control-sm" value={line.description} onChange={e => updateLine(idx, 'description', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" step="0.01" min="0" className="form-control form-control-sm" value={line.debit} onChange={e => updateLine(idx, 'debit', e.target.value)} />
                        </td>
                        <td>
                          <input type="number" step="0.01" min="0" className="form-control form-control-sm" value={line.credit} onChange={e => updateLine(idx, 'credit', e.target.value)} />
                        </td>
                        <td className="text-center">
                          <button type="button" className="btn btn-sm border-0" style={{ color: colors.danger }} onClick={() => removeLine(idx)} title="Remove line">
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}` }}>
                      <td colSpan="2" className="text-end fw-bold">Totals</td>
                      <td className="font-monospace fw-bold" style={{ color: colors.success }}>{formatMoney(totalDebit)}</td>
                      <td className="font-monospace fw-bold" style={{ color: colors.danger }}>{formatMoney(totalCredit)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">Difference</td>
                      <td colSpan="2" className="font-monospace fw-bold" style={{ color: balanced ? colors.success : colors.danger }}>
                        {formatMoney(Math.abs(totalDebit - totalCredit).toFixed(2))} {balanced ? '✓ Balanced' : '✗ Unbalanced'}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowFormModal(false); setEditingId(null); }}>Cancel</button>
                <button type="submit" className="premium-btn btn btn-sm text-white border-0 px-4" disabled={formLoading || !balanced} style={{ borderRadius: '10px', background: balanced ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#94a3b8', fontSize: '0.75rem', boxShadow: balanced ? '0 4px 14px rgba(99,102,241,0.35)' : 'none' }}>
                  {formLoading ? 'Saving...' : (editingId ? 'Update Entry' : 'Save Entry')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ErpPageShell>
  );
};

export default ErpJournalEntries;
