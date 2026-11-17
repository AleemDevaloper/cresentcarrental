import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake, faTrophy, faTimesCircle, faEye, faEdit, faTrash,
  faCheckCircle, faColumns, faList, faUserPlus, faCalendarAlt,
  faDollarSign, faPercentage, faArrowRight, faPlus, faSearch, faFilter,
  faRefresh, faSpinner, faInfoCircle, faCircleCheck, faBriefcase, faUserTie,
  faCircleUser, faBuilding, faStickyNote, faSackDollar, faFlag, faClock,
  faChevronDown, faArrowUpRightFromSquare, faFileInvoiceDollar, faPhone,
  faEnvelope, faComment, faBullseye, faRocket, faCircleDot, faFloppyDisk,
  faXmark, faChartLine, faCoins, faArrowRightArrowLeft, faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  listDeals, getDeal, createDeal, updateDeal, deleteDeal,
  moveDealStage, markDealWon, markDealLost,
  listCustomers, listLeads, listContacts, listPipelines,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import Modal from '../../../components/common/Modal';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'on_hold', label: 'On Hold' },
];

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'CAD', 'AUD', 'JPY'];

const DEFAULT_STAGES = [
  { key: 'lead', name: 'Lead', color: '#6366f1', is_won: false, is_lost: false },
  { key: 'qualified', name: 'Qualified', color: '#8b5cf6', is_won: false, is_lost: false },
  { key: 'proposal', name: 'Proposal', color: '#06b6d4', is_won: false, is_lost: false },
  { key: 'negotiation', name: 'Negotiation', color: '#f59e0b', is_won: false, is_lost: false },
  { key: 'won', name: 'Won', color: '#10b981', is_won: true, is_lost: false },
  { key: 'lost', name: 'Lost', color: '#f43f5e', is_won: false, is_lost: true },
];

const STAGE_COLORS = {
  lead: '#6366f1',
  qualified: '#8b5cf6',
  proposal: '#06b6d4',
  negotiation: '#f59e0b',
  won: '#10b981',
  lost: '#f43f5e',
};

const formatMoney = (v, currency = 'USD') => {
  const n = Number(v) || 0;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const initials = (name) => {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || '')).toUpperCase();
};

const stageKey = (s) => String(s || '').toLowerCase().replace(/\s+/g, '_');

const stageColor = (s) => {
  const k = stageKey(s);
  return STAGE_COLORS[k] || '#64748b';
};

const stageName = (s) => {
  const k = stageKey(s);
  const found = DEFAULT_STAGES.find((d) => d.key === k);
  return found ? found.name : (s || 'Unknown');
};

const stageBadge = (s, isDark) => {
  const color = stageColor(s);
  const name = stageName(s);
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 100,
    fontSize: '0.65rem', fontWeight: 600,
    background: isDark ? `${color}26` : `${color}1f`,
    color: isDark ? color : color,
    border: `1px solid ${color}40`,
  };
};

const priorityStyle = (p, isDark) => {
  const map = {
    low: { bg: isDark ? 'rgba(100,116,139,0.18)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
    medium: { bg: isDark ? 'rgba(6,182,212,0.18)' : '#cffafe', color: isDark ? '#22d3ee' : '#0891b2' },
    high: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    urgent: { bg: isDark ? 'rgba(244,63,94,0.18)' : '#fee2e2', color: isDark ? '#fb7185' : '#dc2626' },
  };
  const m = map[String(p || '').toLowerCase()] || map.low;
  return { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 100, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', background: m.bg, color: m.color };
};

const statusStyle = (s, isDark) => {
  const map = {
    open: { bg: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff', color: isDark ? '#a5b4fc' : '#4f46e5' },
    won: { bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    lost: { bg: isDark ? 'rgba(244,63,94,0.18)' : '#fee2e2', color: isDark ? '#fb7185' : '#dc2626' },
    on_hold: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
  };
  const m = map[String(s || '').toLowerCase()] || map.open;
  return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 700, background: m.bg, color: m.color };
};

const emptyForm = {
  name: '',
  customer_id: '',
  lead_id: '',
  contact_id: '',
  pipeline_id: '',
  stage: 'lead',
  amount: '',
  currency: 'USD',
  probability: 20,
  expected_close_date: '',
  assigned_to: '',
  priority: 'medium',
  description: '',
  next_step: '',
};

const CrmDeals = () => {
  const { theme, addNotification } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const subtleBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  const colors = useMemo(() => ({
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
  }), []);

  const [viewMode, setViewMode] = useState('pipeline');

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [viewItem, setViewItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', row: null });
  const [deleting, setDeleting] = useState(false);

  const [wonDialog, setWonDialog] = useState({ show: false, row: null });
  const [marking, setMarking] = useState(false);

  const [lostDialog, setLostDialog] = useState({ show: false, row: null, reason: '' });

  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [pipelines, setPipelines] = useState([]);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentPage) params.page = currentPage;
      if (perPage) params.per_page = perPage;
      if (searchTerm) params.search = searchTerm;
      if (stageFilter) params.stage = stageFilter;
      if (statusFilter) params.status = statusFilter;
      if (customerFilter) params.customer_id = customerFilter;
      if (pipelineFilter) params.pipeline_id = pipelineFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await listDeals(params);
      const list = res?.data || [];
      const meta = res?.meta || {};
      setDeals(list);
      setTotal(meta.total ?? list.length);
      setLastPage(meta.last_page ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load deals';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, stageFilter, statusFilter, customerFilter, pipelineFilter, priorityFilter, addNotification]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (viewMode === 'list') fetchDeals();
    }, 200);
    return () => clearTimeout(t);
  }, [fetchDeals, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stageFilter, statusFilter, customerFilter, pipelineFilter, priorityFilter]);

  const fetchKanban = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { per_page: 500 };
      if (searchTerm) params.search = searchTerm;
      if (customerFilter) params.customer_id = customerFilter;
      if (pipelineFilter) params.pipeline_id = pipelineFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await listDeals(params);
      setDeals(res?.data || []);
      setTotal(res?.meta?.total ?? (res?.data || []).length);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load deals';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, customerFilter, pipelineFilter, priorityFilter]);

  const loadSupportData = useCallback(async () => {
    try {
      const [c, l, ct, p] = await Promise.all([
        listCustomers({ per_page: 500 }).catch(() => ({ data: [] })),
        listLeads({ per_page: 500 }).catch(() => ({ data: [] })),
        listContacts({ per_page: 500 }).catch(() => ({ data: [] })),
        listPipelines().catch(() => []),
      ]);
      setCustomers(c?.data || []);
      setLeads(l?.data || []);
      setContacts(ct?.data || []);
      setPipelines(Array.isArray(p) ? p : (p?.data || []));
    } catch (err) {
      console.error('Failed to load support data', err);
    }
  }, []);

  useEffect(() => {
    loadSupportData();
  }, [loadSupportData]);

  useEffect(() => {
    if (viewMode === 'pipeline') {
      const t = setTimeout(() => {
        fetchKanban();
      }, 200);
      return () => clearTimeout(t);
    }
  }, [viewMode, fetchKanban]);

  useEffect(() => {
    const onRefresh = () => {
      if (viewMode === 'list') fetchDeals();
      else fetchKanban();
    };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [viewMode, fetchDeals, fetchKanban]);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      name: row.name || '',
      customer_id: row.customer_id || row.customer?.id || '',
      lead_id: row.lead_id || row.lead?.id || '',
      contact_id: row.contact_id || row.contact?.id || '',
      pipeline_id: row.pipeline_id || row.pipeline?.id || '',
      stage: stageKey(row.stage) || 'lead',
      amount: row.amount ?? '',
      currency: row.currency || 'USD',
      probability: row.probability ?? 20,
      expected_close_date: row.expected_close_date ? String(row.expected_close_date).slice(0, 10) : '',
      assigned_to: row.assigned_to || row.assignedUser?.id || '',
      priority: row.priority || 'medium',
      description: row.description || '',
      next_step: row.next_step || '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleView = async (row) => {
    setViewItem({ ...row });
    setViewError(null);
    setViewLoading(true);
    try {
      const res = await getDeal(row.id);
      const detail = res?.data || res || {};
      setViewItem({ ...row, ...detail, activities: detail?.activities || row.activities || [] });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load deal details';
      setViewError(msg);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, name: row.name || row.code || `#${row.id}`, row });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteDeal(deleteDialog.id);
      addNotification?.('Deal deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      if (viewMode === 'list') fetchDeals();
      else fetchKanban();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete deal';
      addNotification?.(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim()) return 'Deal name is required.';
    if (formData.amount && Number.isNaN(Number(formData.amount))) return 'Amount must be a number.';
    if (formData.probability === '' || formData.probability === null) return null;
    const p = Number(formData.probability);
    if (Number.isNaN(p) || p < 0 || p > 100) return 'Probability must be between 0 and 100.';
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setFormError(null);
    setSaving(true);
    try {
      const payload = {
        ...formData,
        amount: formData.amount === '' ? 0 : Number(formData.amount),
        probability: formData.probability === '' ? null : Number(formData.probability),
        customer_id: formData.customer_id || null,
        lead_id: formData.lead_id || null,
        contact_id: formData.contact_id || null,
        pipeline_id: formData.pipeline_id || null,
        assigned_to: formData.assigned_to || null,
      };
      if (editingId) {
        await updateDeal(editingId, payload);
        addNotification?.('Deal updated successfully.', 'success');
      } else {
        await createDeal(payload);
        addNotification?.('Deal created successfully.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      if (viewMode === 'list') fetchDeals();
      else fetchKanban();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save deal';
      setFormError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openWonDialog = (row) => setWonDialog({ show: true, row });
  const openLostDialog = (row) => setLostDialog({ show: true, row, reason: '' });

  const confirmWon = async () => {
    const row = wonDialog.row;
    if (!row) return;
    setMarking(true);
    try {
      await markDealWon(row.id);
      addNotification?.(`${row.name || 'Deal'} marked as Won.`, 'success');
      setWonDialog({ show: false, row: null });
      if (viewMode === 'list') fetchDeals();
      else fetchKanban();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to mark as won';
      addNotification?.(msg, 'error');
    } finally {
      setMarking(false);
    }
  };

  const confirmLost = async () => {
    const row = lostDialog.row;
    if (!row) return;
    setMarking(true);
    try {
      await markDealLost(row.id, lostDialog.reason);
      addNotification?.(`${row.name || 'Deal'} marked as Lost.`, 'success');
      setLostDialog({ show: false, row: null, reason: '' });
      if (viewMode === 'list') fetchDeals();
      else fetchKanban();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to mark as lost';
      addNotification?.(msg, 'error');
    } finally {
      setMarking(false);
    }
  };

  const handleKanbanStageMove = async (row, newStage) => {
    try {
      const prob = (() => {
        const found = DEFAULT_STAGES.find((d) => d.key === newStage);
        if (found) {
          if (found.key === 'won') return 100;
          if (found.key === 'lost') return 0;
          if (found.key === 'lead') return 20;
          if (found.key === 'qualified') return 40;
          if (found.key === 'proposal') return 60;
          if (found.key === 'negotiation') return 80;
        }
        return row.probability ?? 50;
      })();
      await moveDealStage(row.id, newStage, prob);
      addNotification?.(`Moved "${row.name}" to ${stageName(newStage)}.`, 'success');
      fetchKanban();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to move deal';
      addNotification?.(msg, 'error');
    }
  };

  const kpis = useMemo(() => {
    const list = deals || [];
    const openDeals = list.filter((d) => String(d.status || '').toLowerCase() === 'open' || !d.status);
    const totalValue = openDeals.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const wonThisMonth = list
      .filter((d) => String(d.status || '').toLowerCase() === 'won')
      .filter((d) => {
        const dt = d.actual_close_date || d.updated_at || d.expected_close_date;
        if (!dt) return false;
        const dd = new Date(dt);
        return !Number.isNaN(dd.getTime()) && dd >= monthStart;
      })
      .reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const allWon = list.filter((d) => String(d.status || '').toLowerCase() === 'won');
    const avgDeal = allWon.length > 0 ? allWon.reduce((s, d) => s + (Number(d.amount) || 0), 0) / allWon.length : 0;
    return [
      { label: 'Total Pipeline Value', val: totalValue, icon: faSackDollar, color: colors.primary, trend: 'up', trendVal: `${openDeals.length} open`, isCurrency: true },
      { label: 'Open Deals', val: openDeals.length, icon: faHandshake, color: colors.info, trend: 'up', trendVal: 'Active', isCurrency: false },
      { label: 'Won This Month', val: wonThisMonth, icon: faTrophy, color: colors.success, trend: 'up', trendVal: 'This period', isCurrency: true },
      { label: 'Avg Deal Size', val: avgDeal, icon: faChartLine, color: colors.warning, trend: 'up', trendVal: `${allWon.length} won`, isCurrency: true },
    ];
  }, [deals, colors]);

  const stageOptions = useMemo(() => {
    if (pipelines.length > 0) {
      const all = [];
      pipelines.forEach((p) => {
        (p.stages || []).forEach((s) => {
          all.push({
            key: stageKey(s.name) || String(s.id),
            name: s.name,
            color: s.color || stageColor(s.name),
            is_won: !!s.is_won,
            is_lost: !!s.is_lost,
            probability: s.probability ?? null,
            pipelineId: p.id,
          });
        });
      });
      if (all.length > 0) return all;
    }
    return DEFAULT_STAGES;
  }, [pipelines]);

  const kanbanColumns = useMemo(() => {
    const cols = stageOptions.slice(0, 6);
    return cols;
  }, [stageOptions]);

  const groupedByStage = useMemo(() => {
    const map = {};
    kanbanColumns.forEach((c) => { map[c.key] = []; });
    deals.forEach((d) => {
      const k = stageKey(d.stage);
      if (map[k]) map[k].push(d);
      else {
        const fallback = kanbanColumns[0]?.key || 'lead';
        if (!map[fallback]) map[fallback] = [];
        map[fallback].push(d);
      }
    });
    return map;
  }, [deals, kanbanColumns]);

  const columns = useMemo(() => [
    {
      key: 'code', label: 'Code', width: '110px', render: (val) => (
        <span className="font-monospace fw-bold" style={{ color: colors.primary, fontSize: '0.78rem' }}>{val || '—'}</span>
      )
    },
    {
      key: 'name', label: 'Name', bold: true, render: (val, row) => (
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
          }}>
            {(val || 'D').toString().charAt(0).toUpperCase()}
          </div>
          <div className="d-flex flex-column" style={{ minWidth: 0 }}>
            <span style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">
              {val || '—'}
            </span>
            {row.next_step && (
              <span style={{ color: mutedColor, fontSize: '0.68rem' }} className="text-truncate">
                {row.next_step}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'customer', label: 'Customer', render: (val, row) => {
        const name = val?.name || row.customer?.name || row.customer_name || (typeof val === 'string' ? val : '—');
        return <span style={{ fontSize: '0.78rem', color: textColor }}>{name}</span>;
      }
    },
    {
      key: 'stage', label: 'Stage', render: (val) => (
        <span style={stageBadge(val, isDark)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: stageColor(val), display: 'inline-block' }} />
          {stageName(val)}
        </span>
      )
    },
    {
      key: 'amount', label: 'Amount', align: 'end', render: (val, row) => (
        <span className="font-monospace fw-bold" style={{ color: textColor, fontSize: '0.8rem' }}>
          {val != null ? formatMoney(val, row.currency || 'USD') : '—'}
        </span>
      )
    },
    {
      key: 'probability', label: 'Probability', width: '160px', render: (val) => {
        const n = Math.max(0, Math.min(100, Number(val) || 0));
        const c = n >= 75 ? colors.success : n >= 40 ? colors.warning : colors.danger;
        return (
          <div className="d-flex align-items-center gap-2">
            <div style={{ flex: 1, height: 6, background: subtleBg, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ width: `${n}%`, height: '100%', background: c, borderRadius: 100 }} />
            </div>
            <span className="font-monospace fw-bold" style={{ color: c, fontSize: '0.7rem', minWidth: 32, textAlign: 'right' }}>{n}%</span>
          </div>
        );
      }
    },
    {
      key: 'expected_close_date', label: 'Expected Close', render: (val) => (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 4, opacity: 0.7 }} />
          {formatDate(val)}
        </span>
      )
    },
    {
      key: 'priority', label: 'Priority', render: (val) => val ? (
        <span style={priorityStyle(val, isDark)}>
          <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.6rem' }} />
          {val}
        </span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'status', label: 'Status', render: (val) => val ? (
        <span style={statusStyle(val, isDark)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
          {String(val).replace(/_/g, ' ')}
        </span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'assigned_to', label: 'Assigned To', render: (val, row) => {
        const name = row.assignedUser?.name || row.assigned_to_name || (typeof val === 'string' ? val : null);
        if (!name) return <span style={{ color: mutedColor }}>—</span>;
        return (
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.info}, ${colors.primary})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
            }}>{initials(name)}</div>
            <span style={{ fontSize: '0.75rem', color: textColor }} className="text-truncate">{name}</span>
          </div>
        );
      }
    },
    {
      key: 'actions', label: 'Actions', align: 'end', width: '280px', render: (val, row) => (
        <div className="d-flex gap-1 justify-content-end">
          <button
            className="btn btn-sm premium-btn"
            title="View"
            style={{ borderRadius: '8px', fontSize: '0.78rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '4px 9px' }}
            onClick={() => handleView(row)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Edit"
            style={{ borderRadius: '8px', fontSize: '0.78rem', background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569', border: 'none', padding: '4px 9px' }}
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Mark Won"
            style={{ borderRadius: '8px', fontSize: '0.78rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', border: 'none', padding: '4px 9px' }}
            onClick={() => openWonDialog(row)}
          >
            <FontAwesomeIcon icon={faTrophy} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Mark Lost"
            style={{ borderRadius: '8px', fontSize: '0.78rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '4px 9px' }}
            onClick={() => openLostDialog(row)}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Delete"
            style={{ borderRadius: '8px', fontSize: '0.78rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '4px 9px' }}
            onClick={() => handleDeleteClick(row)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )
    },
  ], [colors, isDark, textColor, mutedColor, subtleBg]);

  const dealFormStages = useMemo(() => {
    if (formData.pipeline_id && pipelines.length > 0) {
      const p = pipelines.find((pp) => String(pp.id) === String(formData.pipeline_id));
      if (p && p.stages?.length) {
        return p.stages.map((s) => ({ key: stageKey(s.name), name: s.name, color: s.color || stageColor(s.name) }));
      }
    }
    return stageOptions;
  }, [formData.pipeline_id, pipelines, stageOptions]);

  const renderKanbanCard = (deal) => {
    const customerName = deal.customer?.name || deal.customer_name || '—';
    const assignedName = deal.assignedUser?.name || deal.assigned_to_name || null;
    const probability = Math.max(0, Math.min(100, Number(deal.probability) || 0));
    const c = stageColor(deal.stage);
    return (
      <div
        key={deal.id}
        className="kanban-card"
        onClick={() => handleView(deal)}
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          padding: '0.85rem',
          cursor: 'pointer',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
        }}
      >
        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor, lineHeight: 1.3, flex: 1, minWidth: 0 }}>
            {deal.name || 'Untitled Deal'}
          </div>
          {deal.priority && (
            <span style={priorityStyle(deal.priority, isDark)}>
              <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.55rem' }} />
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faBuilding} style={{ color: mutedColor, fontSize: '0.65rem' }} />
          <span className="text-truncate" style={{ fontSize: '0.7rem', color: mutedColor }}>{customerName}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-1">
            <FontAwesomeIcon icon={faDollarSign} style={{ color: colors.success, fontSize: '0.7rem' }} />
            <span className="font-monospace fw-bold" style={{ color: colors.success, fontSize: '0.85rem' }}>
              {formatMoney(deal.amount, deal.currency || 'USD')}
            </span>
          </div>
          {deal.expected_close_date && (
            <span style={{ fontSize: '0.65rem', color: mutedColor }}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 3 }} />
              {formatDate(deal.expected_close_date)}
            </span>
          )}
        </div>
        <div className="mb-2">
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: '0.6rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Probability</span>
            <span className="font-monospace fw-bold" style={{ fontSize: '0.65rem', color: c }}>{probability}%</span>
          </div>
          <div style={{ height: 5, background: subtleBg, borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ width: `${probability}%`, height: '100%', background: c, borderRadius: 100 }} />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
          <div className="d-flex align-items-center gap-1">
            {assignedName ? (
              <>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.info}, ${colors.primary})`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 700,
                }} title={assignedName}>
                  {initials(assignedName)}
                </div>
                <span className="text-truncate" style={{ fontSize: '0.65rem', color: mutedColor, maxWidth: 90 }}>{assignedName}</span>
              </>
            ) : (
              <span style={{ fontSize: '0.6rem', color: mutedColor, fontStyle: 'italic' }}>Unassigned</span>
            )}
          </div>
          <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
            {String(deal.status || '').toLowerCase() !== 'won' && (
              <button
                className="btn btn-sm p-0"
                title="Mark Won"
                onClick={() => openWonDialog(deal)}
                style={{ width: 22, height: 22, borderRadius: 6, background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', border: 'none', fontSize: '0.65rem' }}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </button>
            )}
            {String(deal.status || '').toLowerCase() !== 'lost' && (
              <button
                className="btn btn-sm p-0"
                title="Mark Lost"
                onClick={() => openLostDialog(deal)}
                style={{ width: 22, height: 22, borderRadius: 6, background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', fontSize: '0.65rem' }}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderKanban = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: colors.primary }} />
          <p className="small mt-2" style={{ color: mutedColor }}>Loading pipeline…</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="alert alert-danger d-flex align-items-center gap-2" style={{ borderRadius: '12px', fontSize: '0.85rem' }}>
          <FontAwesomeIcon icon={faInfoCircle} /> {error}
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchKanban}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      );
    }
    return (
      <div className="kanban-board" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div className="d-flex gap-3" style={{ minWidth: kanbanColumns.length * 260 }}>
          {kanbanColumns.map((stage) => {
            const colDeals = groupedByStage[stage.key] || [];
            const colValue = colDeals.reduce((s, d) => s + (Number(d.amount) || 0), 0);
            const stageColorVal = stage.color || stageColor(stage.key);
            return (
              <div
                key={stage.key}
                className="kanban-column"
                style={{
                  flex: '0 0 250px',
                  background: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.6)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '14px',
                  padding: '0.75rem',
                  maxHeight: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  className="kanban-column-header"
                  style={{
                    background: `linear-gradient(135deg, ${stageColorVal}25, ${stageColorVal}10)`,
                    border: `1px solid ${stageColorVal}40`,
                    borderRadius: '10px',
                    padding: '0.6rem 0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: stageColorVal, display: 'inline-block' }} />
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.8rem' }}>{stage.name}</span>
                    </div>
                    <span style={{
                      background: stageColorVal, color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                      padding: '1px 8px', borderRadius: 100, minWidth: 22, textAlign: 'center',
                    }}>{colDeals.length}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Value</span>
                    <span className="font-monospace fw-bold" style={{ color: stageColorVal, fontSize: '0.75rem' }}>
                      {formatMoney(colValue)}
                    </span>
                  </div>
                </div>
                <div className="kanban-cards" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: 2 }}>
                  {colDeals.length === 0 ? (
                    <div
                      className="text-center"
                      style={{
                        color: mutedColor, fontSize: '0.7rem', fontStyle: 'italic',
                        padding: '1.5rem 0.5rem', border: `1px dashed ${borderColor}`, borderRadius: '10px',
                      }}
                    >
                      No deals here
                    </div>
                  ) : (
                    colDeals.map(renderKanbanCard)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const customerOptions = useMemo(() => customers.map((c) => ({ value: c.id, label: c.name || c.company || `#${c.id}` })), [customers]);
  const leadOptions = useMemo(() => leads.map((l) => ({ value: l.id, label: l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || `#${l.id}` })), [leads]);
  const contactOptions = useMemo(() => contacts.map((c) => ({ value: c.id, label: c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || `#${c.id}` })), [contacts]);

  return (
    <ErpPageShell
      icon={faHandshake}
      title="Sales Deals Pipeline"
      description="Track and manage deals through your sales pipeline stages."
      badge={`${total} deals`}
      action={
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div
            className="d-flex"
            style={{
              background: isDark ? 'rgba(15,23,42,0.6)' : '#f1f5f9',
              borderRadius: '10px',
              padding: 3,
              border: `1px solid ${borderColor}`,
            }}
          >
            <button
              onClick={() => setViewMode('pipeline')}
              className="btn btn-sm border-0 d-flex align-items-center gap-1 premium-btn"
              style={{
                borderRadius: '8px',
                background: viewMode === 'pipeline' ? `linear-gradient(135deg, ${colors.primary}, #4f46e5)` : 'transparent',
                color: viewMode === 'pipeline' ? '#fff' : textColor,
                fontSize: '0.78rem',
                padding: '4px 12px',
                boxShadow: viewMode === 'pipeline' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
              }}
            >
              <FontAwesomeIcon icon={faColumns} /> Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="btn btn-sm border-0 d-flex align-items-center gap-1 premium-btn"
              style={{
                borderRadius: '8px',
                background: viewMode === 'list' ? `linear-gradient(135deg, ${colors.primary}, #4f46e5)` : 'transparent',
                color: viewMode === 'list' ? '#fff' : textColor,
                fontSize: '0.78rem',
                padding: '4px 12px',
                boxShadow: viewMode === 'list' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
              }}
            >
              <FontAwesomeIcon icon={faList} /> List
            </button>
          </div>
          <button
            onClick={() => (viewMode === 'list' ? fetchDeals() : fetchKanban())}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
            style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.78rem' }}
            title="Refresh"
          >
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3"
            style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.78rem' }}
          >
            <FontAwesomeIcon icon={faPlus} /> New Deal
          </button>
        </div>
      }
    >
      <div className="row g-3 mb-4">
        {kpis.map((k, i) => (
          <ErpKpiCard
            key={i}
            label={k.label}
            value={k.isCurrency ? formatMoney(k.val) : k.val}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
            trendVal={k.trendVal}
            isDark={isDark}
            colClass="col-xl-3 col-md-6"
          />
        ))}
      </div>

      {viewMode === 'list' && (
        <div className="glass-card mb-3" style={{ borderRadius: '16px', padding: '1rem' }}>
          <div className="row g-2 align-items-center">
            <div className="col-lg-3 col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent" style={{ borderColor, color: mutedColor }}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, code, customer…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: inputBg, color: textColor, borderColor }}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select form-select-sm"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">All Stages</option>
                {stageOptions.map((s) => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select form-select-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">All Priorities</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select form-select-sm"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">All Customers</option>
                {customerOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-1 col-md-6">
              <select
                className="form-select form-select-sm"
                value={pipelineFilter}
                onChange={(e) => setPipelineFilter(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">All Pipelines</option>
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-12 col-md-12 text-end">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStageFilter('');
                  setStatusFilter('');
                  setCustomerFilter('');
                  setPipelineFilter('');
                  setPriorityFilter('');
                }}
                className="btn btn-sm border-0 premium-btn"
                style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: mutedColor, fontSize: '0.75rem' }}
                title="Clear filters"
              >
                <FontAwesomeIcon icon={faFilterCircleXmark} /> Clear filters
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' && error && !loading && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="small">{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchDeals}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      )}

      {viewMode === 'list' ? (
        <ErpDataTable
          columns={columns}
          data={deals}
          loading={loading}
          error={null}
          emptyMessage="No deals found. Try adjusting your filters or create your first deal."
          emptyIcon={faHandshake}
          isDark={isDark}
          title="Deals Registry"
          titleIcon={faHandshake}
          accentColor={colors.primary}
          currentPage={currentPage}
          totalPages={lastPage}
          totalEntries={total}
          entriesPerPage={perPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
        />
      ) : (
        <div className="glass-card" style={{ borderRadius: '16px', padding: '1rem' }}>
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faSackDollar} style={{ color: colors.primary }} />
              <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Pipeline Board</span>
              <span style={{ fontSize: '0.7rem', color: mutedColor }}>
                • {deals.length} deal{deals.length === 1 ? '' : 's'} across {kanbanColumns.length} stage{kanbanColumns.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <span style={{ fontSize: '0.7rem', color: mutedColor }}>
                <FontAwesomeIcon icon={faArrowRightArrowLeft} className="me-1" />
                Drag/drop or use actions to move
              </span>
            </div>
          </div>
          {renderKanban()}
        </div>
      )}

      <Modal
        show={showForm}
        onHide={() => { if (!saving) { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); } }}
        size="extraLarge"
        preventClose={saving}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={editingId ? faEdit : faHandshake} style={{ color: colors.primary }} />
            <span>{editingId ? 'Edit Deal' : 'New Deal'}</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: '0.7rem', color: mutedColor }}>
              {editingId ? 'Updating existing deal' : 'A unique code will be auto-generated'}
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); }}
                disabled={saving}
                style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
                onClick={handleSubmit}
                disabled={saving}
                style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
              >
                {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Update Deal' : 'Create Deal'}</>}
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ borderRadius: '10px', fontSize: '0.8rem' }}>
              <FontAwesomeIcon icon={faInfoCircle} /> {formError}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.primary }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Deal Information</h6>
              </div>
            </div>
            <div className="col-md-8">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Deal Name <span style={{ color: colors.danger }}>*</span></label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="e.g. Acme Corp Enterprise License"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Pipeline</label>
              <select
                className="form-select form-select-sm"
                value={formData.pipeline_id}
                onChange={(e) => handleFormChange('pipeline_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Default pipeline</option>
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Customer</label>
              <select
                className="form-select form-select-sm"
                value={formData.customer_id}
                onChange={(e) => handleFormChange('customer_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Select customer…</option>
                {customerOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Lead</label>
              <select
                className="form-select form-select-sm"
                value={formData.lead_id}
                onChange={(e) => handleFormChange('lead_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Select lead…</option>
                {leadOptions.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Contact</label>
              <select
                className="form-select form-select-sm"
                value={formData.contact_id}
                onChange={(e) => handleFormChange('contact_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">Select contact…</option>
                {contactOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Stage</label>
              <select
                className="form-select form-select-sm"
                value={formData.stage}
                onChange={(e) => handleFormChange('stage', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {dealFormStages.map((s) => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.success }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Financials & Schedule</h6>
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Amount</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Currency</label>
              <select
                className="form-select form-select-sm"
                value={formData.currency}
                onChange={(e) => handleFormChange('currency', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Probability (%)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.probability}
                onChange={(e) => handleFormChange('probability', e.target.value === '' ? '' : Number(e.target.value))}
                min="0"
                max="100"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Expected Close</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.expected_close_date}
                onChange={(e) => handleFormChange('expected_close_date', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Priority</label>
              <select
                className="form-select form-select-sm"
                value={formData.priority}
                onChange={(e) => handleFormChange('priority', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Assigned To (User ID)</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.assigned_to}
                onChange={(e) => handleFormChange('assigned_to', e.target.value)}
                placeholder="User ID or email"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.purple }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Additional Details</h6>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Next Step</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.next_step}
                onChange={(e) => handleFormChange('next_step', e.target.value)}
                placeholder="e.g. Send revised proposal by Friday"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Description</label>
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Deal description, scope, and key context…"
                style={{ background: inputBg, color: textColor, borderColor, resize: 'vertical' }}
              />
            </div>
          </div>

          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>
      </Modal>

      <Modal
        show={!!viewItem}
        onHide={() => { if (!viewLoading) { setViewItem(null); setViewError(null); } }}
        size="large"
        preventClose={viewLoading}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faHandshake} style={{ color: colors.primary }} />
            <span>Deal Details</span>
            {viewItem?.name && <span className="ms-2" style={{ color: mutedColor, fontSize: '0.85rem' }}>• {viewItem.name}</span>}
          </div>
        }
        footer={
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="d-flex gap-2">
              {viewItem && String(viewItem.status || '').toLowerCase() !== 'won' && (
                <button
                  type="button"
                  className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
                  onClick={() => { const v = viewItem; setViewItem(null); openWonDialog(v); }}
                  disabled={viewLoading}
                  style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)', fontSize: '0.78rem' }}
                >
                  <FontAwesomeIcon icon={faTrophy} /> Mark Won
                </button>
              )}
              {viewItem && String(viewItem.status || '').toLowerCase() !== 'lost' && (
                <button
                  type="button"
                  className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
                  onClick={() => { const v = viewItem; setViewItem(null); openLostDialog(v); }}
                  disabled={viewLoading}
                  style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 2px 8px rgba(244,63,94,0.3)', fontSize: '0.78rem' }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} /> Mark Lost
                </button>
              )}
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => { setViewItem(null); setViewError(null); }}
                disabled={viewLoading}
                style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.78rem' }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
                onClick={() => { const v = viewItem; setViewItem(null); handleEdit(v); }}
                disabled={viewLoading || !viewItem}
                style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.78rem' }}
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
            </div>
          </div>
        }
      >
        {viewLoading && (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: colors.primary }} />
            <p className="small mt-2" style={{ color: mutedColor }}>Loading deal details…</p>
          </div>
        )}

        {viewError && !viewLoading && (
          <div className="alert alert-danger d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} /> {viewError}
          </div>
        )}

        {!viewLoading && viewItem && (
          <>
            <div
              className="mb-3"
              style={{
                background: isDark
                  ? `linear-gradient(135deg, ${stageColor(viewItem.stage)}30, ${stageColor(viewItem.stage)}10)`
                  : `linear-gradient(135deg, ${stageColor(viewItem.stage)}1f, ${stageColor(viewItem.stage)}0c)`,
                borderRadius: '14px',
                padding: '1.25rem',
                border: `1px solid ${stageColor(viewItem.stage)}40`,
              }}
            >
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${stageColor(viewItem.stage)}, ${stageColor(viewItem.stage)}cc)`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 700, flexShrink: 0,
                }}>
                  <FontAwesomeIcon icon={faHandshake} />
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor }}>
                    {viewItem.name || 'Unnamed Deal'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: mutedColor }}>
                    {viewItem.customer?.name || viewItem.customer_name || '—'} • {viewItem.code || `DEAL-${viewItem.id}`}
                  </div>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    <span style={stageBadge(viewItem.stage, isDark)}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: stageColor(viewItem.stage), display: 'inline-block' }} />
                      {stageName(viewItem.stage)}
                    </span>
                    {viewItem.priority && (
                      <span style={priorityStyle(viewItem.priority, isDark)}>
                        <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.55rem' }} /> {viewItem.priority}
                      </span>
                    )}
                    {viewItem.status && (
                      <span style={statusStyle(viewItem.status, isDark)}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                        {String(viewItem.status).replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-end">
                  <div style={{ fontSize: '0.6rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</div>
                  <div className="font-monospace fw-bold" style={{ color: colors.success, fontSize: '1.3rem' }}>
                    {formatMoney(viewItem.amount, viewItem.currency || 'USD')}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-3 col-6">
                <div className="glass-card" style={{ borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faPercentage} style={{ color: stageColor(viewItem.stage), fontSize: '0.95rem' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>{Number(viewItem.probability || 0)}%</div>
                  <div style={{ fontSize: '0.62rem', color: mutedColor, textTransform: 'uppercase' }}>Probability</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card" style={{ borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ color: colors.info, fontSize: '0.95rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor, marginTop: 4 }}>{formatDate(viewItem.expected_close_date)}</div>
                  <div style={{ fontSize: '0.62rem', color: mutedColor, textTransform: 'uppercase' }}>Expected Close</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card" style={{ borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faUserTie} style={{ color: colors.purple, fontSize: '0.95rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {viewItem.assignedUser?.name || viewItem.assigned_to_name || '—'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: mutedColor, textTransform: 'uppercase' }}>Assigned</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card" style={{ borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faBullseye} style={{ color: colors.warning, fontSize: '0.95rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: textColor, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {viewItem.next_step || '—'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: mutedColor, textTransform: 'uppercase' }}>Next Step</div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.info }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.82rem' }}>Description</h6>
                </div>
                <div style={{ fontSize: '0.8rem', color: textColor, whiteSpace: 'pre-wrap', background: subtleBg, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                  {viewItem.description || 'No description provided.'}
                </div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.purple }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.82rem' }}>Activity Timeline</h6>
                </div>
                {!viewItem.activities || viewItem.activities.length === 0 ? (
                  <div className="text-center py-3" style={{ color: mutedColor, fontSize: '0.8rem', background: subtleBg, borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                    <FontAwesomeIcon icon={faComment} style={{ opacity: 0.3, fontSize: '1.2rem', marginBottom: 4 }} />
                    <div>No activity recorded yet.</div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 2, background: borderColor }} />
                    {viewItem.activities.map((act, i) => {
                      const aColor = (act.type === 'call' || act.activity_type === 'call') ? colors.info
                        : (act.type === 'email' || act.activity_type === 'email') ? colors.primary
                        : (act.type === 'meeting' || act.activity_type === 'meeting') ? colors.purple
                        : (act.type === 'note' || act.activity_type === 'note') ? colors.warning
                        : colors.success;
                      const aIcon = (act.type === 'call' || act.activity_type === 'call') ? faPhone
                        : (act.type === 'email' || act.activity_type === 'email') ? faEnvelope
                        : (act.type === 'meeting' || act.activity_type === 'meeting') ? faBriefcase
                        : (act.type === 'note' || act.activity_type === 'note') ? faComment
                        : faCircleDot;
                      return (
                        <div key={act.id || i} style={{ position: 'relative', marginBottom: 12 }}>
                          <div style={{
                            position: 'absolute', left: -22, top: 4, width: 18, height: 18,
                            borderRadius: '50%', background: aColor, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#fff',
                            fontSize: '0.55rem', boxShadow: `0 0 0 3px ${aColor}30`,
                          }}>
                            <FontAwesomeIcon icon={aIcon} />
                          </div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: textColor }}>
                            {act.title || act.subject || act.type || 'Activity'}
                          </div>
                          {act.description && (
                            <div style={{ fontSize: '0.7rem', color: mutedColor, marginTop: 2 }}>
                              {act.description}
                            </div>
                          )}
                          <div style={{ fontSize: '0.65rem', color: mutedColor, marginTop: 2 }}>
                            {formatDate(act.created_at || act.date)} {act.user?.name ? `• ${act.user.name}` : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {viewItem.lost_reason && (
              <div className="alert alert-danger" style={{ borderRadius: '10px', fontSize: '0.8rem' }}>
                <strong>Lost Reason:</strong> {viewItem.lost_reason}
              </div>
            )}
          </>
        )}
      </Modal>

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => { if (!deleting) setDeleteDialog({ show: false, id: null, name: '', row: null }); }}
        onConfirm={confirmDelete}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
        isLoading={deleting}
      />

      <Modal
        show={wonDialog.show}
        onHide={() => { if (!marking) setWonDialog({ show: false, row: null }); }}
        size="default"
        preventClose={marking}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} style={{ color: colors.success }} />
            <span>Mark Deal as Won</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setWonDialog({ show: false, row: null })}
              disabled={marking}
              style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
              onClick={confirmWon}
              disabled={marking}
              style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px rgba(16,185,129,0.35)', fontSize: '0.8rem' }}
            >
              {marking ? <><FontAwesomeIcon icon={faSpinner} spin /> Marking…</> : <><FontAwesomeIcon icon={faTrophy} /> Confirm Won</>}
            </button>
          </div>
        }
      >
        <div className="text-center py-3">
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1rem',
            background: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FontAwesomeIcon icon={faTrophy} style={{ color: colors.success, fontSize: '2rem' }} />
          </div>
          <h5 style={{ color: textColor, marginBottom: 8 }}>Congratulations!</h5>
          <p style={{ color: mutedColor, fontSize: '0.85rem', margin: 0 }}>
            You are about to mark<br />
            <strong style={{ color: textColor }}>"{wonDialog.row?.name || 'this deal'}"</strong><br />
            as <span style={{ color: colors.success, fontWeight: 700 }}>Won</span> for{' '}
            <strong style={{ color: colors.success }}>
              {formatMoney(wonDialog.row?.amount, wonDialog.row?.currency || 'USD')}
            </strong>.
          </p>
        </div>
      </Modal>

      <Modal
        show={lostDialog.show}
        onHide={() => { if (!marking) setLostDialog({ show: false, row: null, reason: '' }); }}
        size="default"
        preventClose={marking}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faTimesCircle} style={{ color: colors.danger }} />
            <span>Mark Deal as Lost</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setLostDialog({ show: false, row: null, reason: '' })}
              disabled={marking}
              style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm text-white border-0 d-flex align-items-center gap-1"
              onClick={confirmLost}
              disabled={marking}
              style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 4px 14px rgba(244,63,94,0.35)', fontSize: '0.8rem' }}
            >
              {marking ? <><FontAwesomeIcon icon={faSpinner} spin /> Marking…</> : <><FontAwesomeIcon icon={faTimesCircle} /> Confirm Lost</>}
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <p style={{ color: mutedColor, fontSize: '0.85rem', margin: 0 }}>
            You are marking <strong style={{ color: textColor }}>"{lostDialog.row?.name || 'this deal'}"</strong> as lost.
            Please provide a reason to help with future analysis.
          </p>
        </div>
        <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Lost Reason</label>
        <textarea
          className="form-control form-control-sm"
          rows="4"
          value={lostDialog.reason}
          onChange={(e) => setLostDialog((p) => ({ ...p, reason: e.target.value }))}
          placeholder="e.g. Budget constraints, chose competitor, timing not right, no decision-maker buy-in…"
          style={{ background: inputBg, color: textColor, borderColor, resize: 'vertical' }}
        />
      </Modal>
    </ErpPageShell>
  );
};

export default CrmDeals;
