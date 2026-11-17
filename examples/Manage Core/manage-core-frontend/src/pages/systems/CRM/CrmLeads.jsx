import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faSearch, faEye, faEdit, faTrash, faUserCheck,
  faFire, faSnowflake, faThermometerHalf, faArrowRight, faFileExport,
  faFileCsv, faFileExcel, faFilePdf, faRefresh, faFilter, faSpinner,
  faInfoCircle, faPhone, faEnvelope, faBriefcase, faIndustry,
  faLocationDot, faCalendar, faStickyNote, faSackDollar, faChevronDown,
  faCircleCheck, faCircleUser, faUserTie, faBrain, faListCheck,
  faHandshake, faBolt, faChartLine, faPercent, faBuilding, faUpload,
  faFileImport, faXmark, faCheck, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import {
  listLeads, getLead, createLead, updateLead, deleteLead, convertLead,
  importLeads, listCustomers, listCampaigns
} from '../../../api/crm';
import { clearCache } from '../../../api/client';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import Modal from '../../../components/common/Modal';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'lost', label: 'Lost' },
  { value: 'converted', label: 'Converted' },
];

const RATING_OPTIONS = [
  { value: 'hot', label: 'Hot' },
  { value: 'warm', label: 'Warm' },
  { value: 'cold', label: 'Cold' },
];

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'event', label: 'Event / Trade Show' },
  { value: 'partner', label: 'Partner' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'JPY', 'CNY', 'AUD', 'CAD'];

const statusStyle = (status, isDark) => {
  const s = String(status || '').toLowerCase();
  const map = {
    new: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' },
    contacted: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
    qualified: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    unqualified: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
    lost: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    converted: { bg: isDark ? 'rgba(139,92,246,0.18)' : '#ede9fe', color: isDark ? '#c4b5fd' : '#7c3aed' },
  };
  const m = map[s] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 12px', borderRadius: 100,
    fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em',
    background: m.bg, color: m.color, textTransform: 'capitalize',
  };
};

const ratingStyle = (rating, isDark) => {
  const r = String(rating || '').toLowerCase();
  const map = {
    hot: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', icon: faFire },
    warm: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706', icon: faThermometerHalf },
    cold: { bg: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb', icon: faSnowflake },
  };
  const m = map[r] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b', icon: faThermometerHalf };
  return { ...m, padding: '2px 10px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize', icon: m.icon };
};

const formatMoney = (v, currency = 'USD') => {
  const n = Number(v) || 0;
  const symbols = { USD: '$', EUR: '€', GBP: '£', PKR: '₨', INR: '₹', AED: 'د.إ', SAR: '﷼', JPY: '¥', CNY: '¥', AUD: 'A$', CAD: 'C$' };
  const sym = symbols[currency] || `${currency} `;
  return `${sym}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  title: '',
  source: 'website',
  status: 'new',
  rating: 'warm',
  score: 50,
  industry: '',
  estimated_value: '',
  currency: 'USD',
  expected_close_date: '',
  address: '',
  notes: '',
  assigned_to: '',
  customer_id: '',
  campaign_id: '',
};

const CrmLeads = () => {
  useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff';

  const colors = useMemo(() => ({
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
  }), []);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

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

  const [convertDialog, setConvertDialog] = useState({ show: false, id: null, name: '' });
  const [converting, setConverting] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  // Import state
  const [showImport, setShowImport] = useState(false);
  const [importStep, setImportStep] = useState(1); // 1=upload, 2=map, 3=preview, 4=result
  const [importFile, setImportFile] = useState(null);
  const [importHeaders, setImportHeaders] = useState([]);
  const [importRows, setImportRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentPage) params.page = currentPage;
      if (perPage) params.per_page = perPage;
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (ratingFilter) params.rating = ratingFilter;
      if (sourceFilter) params.source = sourceFilter;
      const res = await listLeads(params);
      const list = res?.data || [];
      const meta = res?.meta || {};
      setLeads(list);
      setTotal(meta.total ?? list.length);
      setLastPage(meta.last_page ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load leads';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, statusFilter, ratingFilter, sourceFilter, addNotification]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchLeads();
    }, 200);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  useEffect(() => {
    const onRefresh = () => fetchLeads();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, [fetchLeads]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, ratingFilter, sourceFilter]);

  useEffect(() => {
    (async () => {
      try {
        const [custRes, campRes] = await Promise.all([
          listCustomers({ per_page: 200 }),
          listCampaigns({ per_page: 200 }),
        ]);
        setCustomers(custRes?.data || []);
        setCampaigns(campRes?.data || []);
      } catch (err) {
        // silent - dropdowns will be empty
      }
    })();
  }, []);

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
      company: row.company || '',
      email: row.email || '',
      phone: row.phone || '',
      title: row.title || '',
      source: row.source || 'website',
      status: row.status || 'new',
      rating: row.rating || 'warm',
      score: row.score ?? 50,
      industry: row.industry || '',
      estimated_value: row.estimated_value ?? '',
      currency: row.currency || 'USD',
      expected_close_date: row.expected_close_date ? String(row.expected_close_date).split('T')[0] : '',
      address: row.address || '',
      notes: row.notes || '',
      assigned_to: row.assigned_to || row.assigned_to_id || '',
      customer_id: row.customer_id || '',
      campaign_id: row.campaign_id || '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleView = async (row) => {
    setViewItem({ ...row });
    setViewError(null);
    setViewLoading(true);
    try {
      const res = await getLead(row.id);
      const payload = res?.data ?? res;
      const detail = payload?.data || payload;
      setViewItem({
        ...row,
        ...detail,
        activities: payload?.activities || detail?.activities,
        notes_timeline: payload?.notes || detail?.notes_timeline,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load lead details';
      setViewError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setViewLoading(false);
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, name: row.name || row.company || row.email || `#${row.id}`, row });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteLead(deleteDialog.id);
      addNotification?.('Lead deleted successfully.', 'success');
      setDeleteDialog({ show: false, id: null, name: '', row: null });
      fetchLeads();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete lead';
      addNotification?.(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleConvertClick = (row) => {
    setConvertDialog({ show: true, id: row.id, name: row.name || row.company || row.email || `#${row.id}` });
  };

  const confirmConvert = async () => {
    if (!convertDialog.id) return;
    setConverting(true);
    try {
      const res = await convertLead(convertDialog.id);
      addNotification?.(`Lead "${convertDialog.name}" converted to customer successfully.`, 'success');
      setConvertDialog({ show: false, id: null, name: '' });
      fetchLeads();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to convert lead';
      addNotification?.(msg, 'error');
    } finally {
      setConverting(false);
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim() && !formData.company?.trim()) {
      return 'Either lead name or company is required.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (formData.score !== '' && formData.score !== null && (Number(formData.score) < 0 || Number(formData.score) > 100)) {
      return 'Score must be between 0 and 100.';
    }
    if (formData.estimated_value && formData.estimated_value !== '' && Number.isNaN(Number(formData.estimated_value))) {
      return 'Estimated value must be a number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const payload = {
        ...formData,
        score: formData.score === '' ? 0 : Number(formData.score),
        estimated_value: formData.estimated_value === '' ? null : Number(formData.estimated_value),
        customer_id: formData.customer_id === '' ? null : Number(formData.customer_id),
        campaign_id: formData.campaign_id === '' ? null : Number(formData.campaign_id),
        assigned_to: formData.assigned_to === '' || formData.assigned_to == null ? null : Number(formData.assigned_to),
      };
      if (editingId) {
        await updateLead(editingId, payload);
        addNotification?.('Lead updated successfully.', 'success');
      } else {
        await createLead(payload);
        addNotification?.('Lead created successfully.', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchLeads();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save lead';
      setFormError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ===== IMPORT HANDLERS =====
  const LEAD_STANDARD_FIELDS = [
    'name', 'company', 'email', 'phone', 'title', 'source', 'status',
    'rating', 'score', 'industry', 'estimated_value', 'currency',
    'expected_close_date', 'address', 'city', 'state', 'country',
    'postal_code', 'notes', 'tags',
  ];

  const autoMapColumns = (headers) => {
    const mapping = {};
    const exactMap = {
      'name': 'name', 'lead_name': 'name', 'lead name': 'name', 'full_name': 'name', 'full name': 'name',
      'company': 'company', 'organization': 'company', 'company_name': 'company', 'company name': 'company',
      'email': 'email', 'email_address': 'email', 'email address': 'email', 'e-mail': 'email',
      'phone': 'phone', 'phone_number': 'phone', 'phone number': 'phone', 'mobile': 'phone', 'telephone': 'phone',
      'title': 'title', 'job_title': 'title', 'job title': 'title', 'position': 'title', 'designation': 'title',
      'industry': 'industry', 'sector': 'industry',
      'address': 'address', 'street': 'address', 'street_address': 'address',
      'city': 'city', 'town': 'city',
      'state': 'state', 'province': 'state', 'region': 'state',
      'country': 'country',
      'postal_code': 'postal_code', 'zip': 'postal_code', 'zipcode': 'postal_code', 'zip_code': 'postal_code',
      'notes': 'notes', 'remarks': 'notes', 'comments': 'notes', 'description': 'notes',
      'rating': 'rating', 'lead_rating': 'rating',
      'score': 'score', 'lead_score': 'score', 'priority_score': 'score',
      'estimated_value': 'estimated_value', 'deal_value': 'estimated_value', 'value': 'estimated_value', 'budget': 'estimated_value',
      'currency': 'currency',
      'expected_close_date': 'expected_close_date', 'close_date': 'expected_close_date', 'expected_date': 'expected_date',
    };
    headers.forEach((h) => {
      const lower = h.toLowerCase().replace(/[\s\-_]+/g, '_').trim();
      if (exactMap[lower]) {
        mapping[h] = exactMap[lower];
      } else {
        mapping[h] = '__custom__';
      }
    });
    return mapping;
  };

  const handleImportFile = (file) => {
    if (!file) return;
    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (data.length === 0) {
          addNotification?.('The file is empty or has no readable data.', 'error');
          return;
        }
        const headers = Object.keys(data[0]);
        setImportHeaders(headers);
        setImportRows(data);
        setColumnMapping(autoMapColumns(headers));
        setImportStep(2);
      } catch (err) {
        addNotification?.('Failed to parse file. Please check the format.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImportFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target?.files?.[0];
    if (file) handleImportFile(file);
  };

  const handleMappingChange = (header, value) => {
    setColumnMapping((prev) => ({ ...prev, [header]: value }));
  };

  const getPreviewData = () => {
    return importRows.slice(0, 5).map((row) => {
      const mapped = {};
      importHeaders.forEach((h) => {
        const target = columnMapping[h];
        if (target && target !== '__skip__') {
          mapped[target === '__custom__' ? h : target] = row[h];
        }
      });
      return mapped;
    });
  };

  const handleImportSubmit = async () => {
    setImporting(true);
    try {
      const mappedLeads = importRows.map((row) => {
        const lead = {};
        importHeaders.forEach((h) => {
          const target = columnMapping[h];
          if (target && target !== '__skip__') {
            const key = target === '__custom__' ? h : target;
            lead[key] = row[h];
          }
        });
        return lead;
      });
      const res = await importLeads(mappedLeads);
      setImportResult(res);
      setImportStep(4);
      addNotification?.(res?.message || 'Import completed.', 'success');
      clearCache('/crm/leads');
      fetchLeads();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Import failed';
      setImportResult({ message: msg, imported: 0, errors: [] });
      setImportStep(4);
      addNotification?.(msg, 'error');
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setShowImport(false);
    setImportStep(1);
    setImportFile(null);
    setImportHeaders([]);
    setImportRows([]);
    setColumnMapping({});
    setImportResult(null);
    setDragOver(false);
  };

  // ===== KPIs =====
  const totalLeads = total;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = leads.filter((l) => {
    if (!l.created_at) return false;
    return new Date(l.created_at) >= oneWeekAgo;
  }).length;
  const qualifiedCount = leads.filter((l) => String(l.status).toLowerCase() === 'qualified').length;
  const convertedCount = leads.filter((l) => String(l.status).toLowerCase() === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  // ===== Export =====
  const buildExportRows = (rows) => {
    return rows.map((r) => ({
      Code: r.code || '',
      Name: r.name || '',
      Company: r.company || '',
      Email: r.email || '',
      Phone: r.phone || '',
      Title: r.title || '',
      Source: r.source || '',
      Status: r.status || '',
      Rating: r.rating || '',
      Score: r.score ?? '',
      Industry: r.industry || '',
      'Estimated Value': r.estimated_value ?? '',
      Currency: r.currency || '',
      'Expected Close': r.expected_close_date || '',
      'Assigned To': r.assigned_to || '',
      'Created At': r.created_at || '',
    }));
  };

  const exportCsv = () => {
    const rows = buildExportRows(leads);
    if (rows.length === 0) {
      addNotification?.('No leads to export.', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ];
    const csvContent = csvRows.join('\n');
    downloadBlob(new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }), `crm-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    addNotification?.('Leads exported as CSV.', 'success');
    setExportOpen(false);
  };

  const exportExcel = () => {
    const rows = buildExportRows(leads);
    if (rows.length === 0) {
      addNotification?.('No leads to export.', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ];
    const csvContent = csvRows.join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent('\uFEFF' + csvContent);
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `crm-leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
    a.click();
    addNotification?.('Leads exported as Excel.', 'success');
    setExportOpen(false);
  };

  const exportPdf = () => {
    const rows = leads;
    if (rows.length === 0) {
      addNotification?.('No leads to export.', 'warning');
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CRM Leads</title>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; background: #fff; }
        th { background: #6366f1; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print { body { background: #fff; padding: 0; } }
      </style></head><body>
      <h1>CRM Leads — ${new Date().toLocaleDateString()}</h1>
      <table><thead><tr>
        <th>Code</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th>
        <th>Source</th><th>Status</th><th>Rating</th><th>Score</th><th>Estimated Value</th>
      </tr></thead><tbody>
      ${rows.map((r) => `
        <tr>
          <td>${r.code || ''}</td>
          <td>${r.name || ''}</td>
          <td>${r.company || ''}</td>
          <td>${r.email || ''}</td>
          <td>${r.phone || ''}</td>
          <td>${r.source || ''}</td>
          <td>${r.status || ''}</td>
          <td>${r.rating || ''}</td>
          <td>${r.score ?? ''}</td>
          <td>${formatMoney(r.estimated_value, r.currency)}</td>
        </tr>
      `).join('')}
      </tbody></table>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    addNotification?.('PDF export ready.', 'success');
    setExportOpen(false);
  };

  const columns = [
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
            {(val || row.company || '?').toString().charAt(0).toUpperCase()}
          </div>
          <div className="d-flex flex-column" style={{ minWidth: 0 }}>
            <span style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">
              {val || row.company || '—'}
            </span>
            {row.title && (
              <span style={{ color: mutedColor, fontSize: '0.7rem' }} className="text-truncate">
                {row.title}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'company', label: 'Company', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: textColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'email', label: 'Email', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'phone', label: 'Phone', render: (val) => val ? (
        <span style={{ fontSize: '0.78rem', color: mutedColor }}>{val}</span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'source', label: 'Source', render: (val) => val ? (
        <span style={{ fontSize: '0.72rem', color: textColor, textTransform: 'capitalize' }}>
          {String(val).replace(/_/g, ' ')}
        </span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'status', label: 'Status', render: (val) => val ? (
        <span style={statusStyle(val, isDark)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle(val, isDark).color, display: 'inline-block' }} />
          {String(val)}
        </span>
      ) : <span style={{ color: mutedColor }}>—</span>
    },
    {
      key: 'rating', label: 'Rating', width: '100px', render: (val) => {
        if (!val) return <span style={{ color: mutedColor }}>—</span>;
        const s = ratingStyle(val, isDark);
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...s }}>
            <FontAwesomeIcon icon={s.icon} style={{ fontSize: '0.65rem' }} />
            {val}
          </span>
        );
      }
    },
    {
      key: 'score', label: 'Score', width: '120px', render: (val) => {
        const n = Math.max(0, Math.min(100, Number(val) || 0));
        const color = n >= 70 ? colors.success : n >= 40 ? colors.warning : colors.danger;
        return (
          <div className="d-flex align-items-center gap-2" style={{ minWidth: 90 }}>
            <div style={{
              flex: 1, height: 6, borderRadius: 100,
              background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
              overflow: 'hidden',
            }}>
              <div style={{ width: `${n}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 0.4s' }} />
            </div>
            <span className="font-monospace fw-bold" style={{ fontSize: '0.7rem', color: textColor, minWidth: 28, textAlign: 'right' }}>{n}</span>
          </div>
        );
      }
    },
    {
      key: 'estimated_value', label: 'Est. Value', align: 'end', render: (val, row) => {
        if (val === null || val === undefined || val === '') return <span style={{ color: mutedColor }}>—</span>;
        return (
          <span className="font-monospace fw-bold" style={{ color: textColor, fontSize: '0.78rem' }}>
            {formatMoney(val, row.currency || 'USD')}
          </span>
        );
      }
    },
    {
      key: 'assigned_to', label: 'Assigned To', render: (val, row) => {
        const name = val || row?.assignee?.name || row?.assigned_user?.name || '';
        if (!name) return <span style={{ color: mutedColor }}>—</span>;
        return (
          <div className="d-flex align-items-center gap-1">
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.info}, ${colors.primary})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
            }}>
              {name.toString().charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.75rem', color: textColor }} className="text-truncate">{name}</span>
          </div>
        );
      }
    },
    {
      key: 'custom_fields', label: 'Extra Data', render: (val) => {
        if (!val || typeof val !== 'object' || Object.keys(val).length === 0) return <span style={{ color: mutedColor }}>—</span>;
        const entries = Object.entries(val).filter(([, v]) => v != null && v !== '');
        if (entries.length === 0) return <span style={{ color: mutedColor }}>—</span>;
        return (
          <div className="d-flex flex-wrap gap-1" style={{ maxWidth: 250 }}>
            {entries.slice(0, 3).map(([k, v]) => (
              <span key={k} style={{
                fontSize: '0.6rem', padding: '2px 7px', borderRadius: 100,
                background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                color: isDark ? '#a5b4fc' : '#4f46e5', whiteSpace: 'nowrap',
              }} title={`${k}: ${v}`}>
                {k.replace(/_/g, ' ')}: {String(v).substring(0, 20)}{String(v).length > 20 ? '…' : ''}
              </span>
            ))}
            {entries.length > 3 && (
              <span style={{
                fontSize: '0.6rem', padding: '2px 7px', borderRadius: 100,
                background: isDark ? 'rgba(148,163,184,0.15)' : '#f1f5f9',
                color: mutedColor,
              }}>+{entries.length - 3} more</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'actions', label: 'Actions', align: 'end', width: '210px', render: (val, row) => (
        <div className="d-flex gap-1 justify-content-end">
          <button
            className="btn btn-sm premium-btn"
            title="View"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '5px 9px' }}
            onClick={() => handleView(row)}
          >
            <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.85rem' }} />
          </button>
          <button
            className="btn btn-sm premium-btn"
            title="Edit"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', padding: '5px 9px' }}
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.85rem' }} />
          </button>
          {String(row.status).toLowerCase() === 'qualified' && String(row.status).toLowerCase() !== 'converted' && (
            <button
              className="btn btn-sm premium-btn"
              title="Convert to Customer"
              style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a', border: 'none', padding: '5px 9px' }}
              onClick={() => handleConvertClick(row)}
            >
              <FontAwesomeIcon icon={faUserCheck} style={{ fontSize: '0.85rem' }} />
            </button>
          )}
          <button
            className="btn btn-sm premium-btn"
            title="Delete"
            style={{ borderRadius: '8px', fontSize: '0.85rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '5px 9px' }}
            onClick={() => handleDeleteClick(row)}
          >
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.85rem' }} />
          </button>
        </div>
      )
    },
  ];

  return (
    <ErpPageShell
      icon={faUserPlus}
      title="Sales Lead Pipeline"
      description="Track, qualify, and convert sales leads through the pipeline."
      badge={`${total} total`}
      action={
        <div className="d-flex gap-2">
          <div className="dropdown position-relative">
            <button
              type="button"
              className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
              style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.8rem' }}
              onClick={() => setExportOpen((o) => !o)}
              aria-expanded={exportOpen}
            >
              <FontAwesomeIcon icon={faFileExport} /> Export <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.65rem' }} />
            </button>
            {exportOpen && (
              <>
                <div
                  onClick={() => setExportOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 1040 }}
                />
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    minWidth: 180,
                    borderRadius: '12px',
                    padding: '0.4rem',
                    zIndex: 1050,
                    background: isDark ? '#0f172a' : '#ffffff',
                    boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.5)' : '0 12px 32px rgba(0,0,0,0.15)',
                  }}
                >
                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }}
                    onClick={exportCsv}
                  >
                    <FontAwesomeIcon icon={faFileCsv} style={{ color: colors.success }} /> CSV
                  </button>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }}
                    onClick={exportExcel}
                  >
                    <FontAwesomeIcon icon={faFileExcel} style={{ color: colors.success }} /> Excel
                  </button>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', color: textColor }}
                    onClick={exportPdf}
                  >
                    <FontAwesomeIcon icon={faFilePdf} style={{ color: colors.danger }} /> PDF
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={fetchLeads}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
            style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.8rem' }}
            title="Refresh"
          >
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3"
            style={{ borderRadius: '10px', background: isDark ? '#1e3a5f' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb', fontSize: '0.8rem' }}
            title="Import Leads from Excel"
          >
            <FontAwesomeIcon icon={faFileImport} /> Import Excel
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3"
            style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
          >
            <FontAwesomeIcon icon={faUserPlus} /> New Lead
          </button>
        </div>
      }
    >
      {/* ============ KPI CARDS ============ */}
      <div className="row g-3 mb-4">
        <ErpKpiCard label="Total Leads" value={totalLeads} icon={faUserPlus} color={colors.primary} trend="up" trendVal="All Time" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="New This Week" value={newThisWeek} icon={faBolt} color={colors.info} trend="up" trendVal="Last 7 days" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Qualified" value={qualifiedCount} icon={faCircleCheck} color={colors.success} trend="up" trendVal="Pipeline" isDark={isDark} colClass="col-xl-3 col-md-6" />
        <ErpKpiCard label="Conversion Rate" value={conversionRate} icon={faPercent} color={colors.purple} trend={conversionRate >= 20 ? 'up' : 'down'} trendVal={`${conversionRate}%`} isDark={isDark} colClass="col-xl-3 col-md-6" />
      </div>

      {/* ============ AI INSIGHTS BANNER ============ */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: textColor }}>AI Lead Intelligence</div>
              <div style={{ color: mutedColor, fontSize: '0.75rem' }}>
                {leads.length > 0
                  ? `${leads.filter((l) => String(l.rating).toLowerCase() === 'hot').length} hot leads need immediate follow-up. Focus on qualified leads with score above 70 to maximize conversion.`
                  : 'No leads yet — once you add some, AI will surface follow-up priorities and conversion opportunities.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FILTER BAR ============ */}
      <div className="glass-card mb-3" style={{ borderRadius: '16px', padding: '1rem' }}>
        <div className="row g-2 align-items-center">
          <div className="col-lg-4 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent" style={{ borderColor, color: mutedColor }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, company, email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
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
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Ratings</option>
              {RATING_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select form-select-sm"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{ background: inputBg, color: textColor, borderColor }}
            >
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-12 text-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setRatingFilter('');
                setSourceFilter('');
              }}
              className="btn btn-sm border-0 premium-btn"
              style={{ borderRadius: '8px', background: isDark ? '#334155' : '#f1f5f9', color: mutedColor, fontSize: '0.75rem' }}
              title="Clear filters"
            >
              <FontAwesomeIcon icon={faFilter} /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* ============ ERROR BANNER ============ */}
      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="small">{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchLeads}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      )}

      {/* ============ DATA TABLE ============ */}
      <ErpDataTable
        columns={columns}
        data={leads}
        loading={loading}
        error={null}
        emptyMessage="No leads found. Try adjusting your filters or capture your first lead."
        emptyIcon={faUserPlus}
        isDark={isDark}
        title="Lead Pipeline"
        titleIcon={faUserPlus}
        accentColor={colors.primary}
        currentPage={currentPage}
        totalPages={lastPage}
        totalEntries={total}
        entriesPerPage={perPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
      />

      {/* ============ CREATE/EDIT MODAL ============ */}
      <Modal
        show={showForm}
        onHide={() => { if (!saving) { setShowForm(false); setEditingId(null); setFormData(emptyForm); setFormError(null); } }}
        size="extraLarge"
        preventClose={saving}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={editingId ? faEdit : faUserPlus} style={{ color: colors.primary }} />
            <span>{editingId ? 'Edit Lead' : 'New Lead'}</span>
          </div>
        }
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span style={{ fontSize: '0.7rem', color: mutedColor }}>
              {editingId ? 'Updating existing lead' : 'A unique code will be auto-generated'}
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
                {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Update Lead' : 'Create Lead'}</>}
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
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Lead Information</h6>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Name *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Lead name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Company</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                placeholder="Company name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Title / Role</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g. VP of Sales"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Industry</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.industry}
                onChange={(e) => handleFormChange('industry', e.target.value)}
                placeholder="e.g. SaaS, Manufacturing"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="name@company.com"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Phone</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.purple }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Pipeline &amp; Qualification</h6>
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Status</label>
              <select
                className="form-select form-select-sm"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Rating</label>
              <select
                className="form-select form-select-sm"
                value={formData.rating}
                onChange={(e) => handleFormChange('rating', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {RATING_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Source</label>
              <select
                className="form-select form-select-sm"
                value={formData.source}
                onChange={(e) => handleFormChange('source', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Score (0–100)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.score}
                onChange={(e) => handleFormChange('score', e.target.value === '' ? '' : Number(e.target.value))}
                min="0"
                max="100"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Estimated Value</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={formData.estimated_value}
                onChange={(e) => handleFormChange('estimated_value', e.target.value)}
                placeholder="0"
                min="0"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
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
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Expected Close Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.expected_close_date}
                onChange={(e) => handleFormChange('expected_close_date', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Assigned To</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.assigned_to}
                onChange={(e) => handleFormChange('assigned_to', e.target.value)}
                placeholder="User ID or name"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Link to Customer (optional)</label>
              <select
                className="form-select form-select-sm"
                value={formData.customer_id}
                onChange={(e) => handleFormChange('customer_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">— No customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name || c.company || `Customer #${c.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Source Campaign (optional)</label>
              <select
                className="form-select form-select-sm"
                value={formData.campaign_id}
                onChange={(e) => handleFormChange('campaign_id', e.target.value)}
                style={{ background: inputBg, color: textColor, borderColor }}
              >
                <option value="">— No campaign —</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.name || c.title || `Campaign #${c.id}`}</option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.warning }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Address</h6>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ color: mutedColor }}>Street Address</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                placeholder="123 Main Street, City, Country"
                style={{ background: inputBg, color: textColor, borderColor }}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="section-header">
                <div className="accent-bar" style={{ background: colors.info }} />
                <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Notes</h6>
              </div>
            </div>
            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Internal notes about this lead…"
                style={{ background: inputBg, color: textColor, borderColor, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* hidden submit to allow Enter to submit */}
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>
      </Modal>

      {/* ============ VIEW MODAL ============ */}
      <Modal
        show={!!viewItem}
        onHide={() => { if (!viewLoading) { setViewItem(null); setViewError(null); } }}
        size="large"
        preventClose={viewLoading}
        title={
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faCircleUser} style={{ color: colors.primary }} />
            <span>Lead Details</span>
            {viewItem?.name && <span className="ms-2" style={{ color: mutedColor, fontSize: '0.85rem' }}>• {viewItem.name}</span>}
          </div>
        }
        footer={
          <div className="d-flex justify-content-end w-100">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => { setViewItem(null); setViewError(null); }}
              disabled={viewLoading}
              style={{ borderRadius: '10px', background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.8rem' }}
            >
              Close
            </button>
            {viewItem && String(viewItem.status).toLowerCase() === 'qualified' && String(viewItem.status).toLowerCase() !== 'converted' && (
              <button
                type="button"
                className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 ms-2"
                onClick={() => { const v = viewItem; setViewItem(null); handleConvertClick(v); }}
                disabled={viewLoading}
                style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px rgba(16,185,129,0.35)', fontSize: '0.8rem' }}
              >
                <FontAwesomeIcon icon={faUserCheck} /> Convert to Customer
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 ms-2"
              onClick={() => { const v = viewItem; setViewItem(null); handleEdit(v); }}
              disabled={viewLoading || !viewItem}
              style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          </div>
        }
      >
        {viewLoading && (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: colors.primary }} />
            <p className="small mt-2" style={{ color: mutedColor }}>Loading lead details…</p>
          </div>
        )}

        {viewError && !viewLoading && (
          <div className="alert alert-danger d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} /> {viewError}
          </div>
        )}

        {!viewLoading && viewItem && (
          <>
            {/* Profile header */}
            <div
              className="mb-3"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.10))'
                  : 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
                borderRadius: '14px',
                padding: '1.25rem',
                border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : '#c7d2fe'}`,
              }}
            >
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {(viewItem.name || viewItem.company || '?').toString().charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor }}>
                    {viewItem.name || viewItem.company || 'Unnamed Lead'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: mutedColor }}>
                    {[viewItem.title, viewItem.company].filter(Boolean).join(' • ') || viewItem.email || '—'}
                  </div>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {viewItem.code && (
                      <span className="font-monospace" style={{ fontSize: '0.7rem', color: colors.primary, fontWeight: 700 }}>
                        {viewItem.code}
                      </span>
                    )}
                    {viewItem.status && (
                      <span style={statusStyle(viewItem.status, isDark)}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle(viewItem.status, isDark).color, display: 'inline-block' }} />
                        {String(viewItem.status)}
                      </span>
                    )}
                    {viewItem.rating && (() => {
                      const s = ratingStyle(viewItem.rating, isDark);
                      return (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...s }}>
                          <FontAwesomeIcon icon={s.icon} style={{ fontSize: '0.6rem' }} />
                          {viewItem.rating}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                {viewItem.score !== null && viewItem.score !== undefined && (
                  <div className="text-center" style={{ minWidth: 90 }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: 60, height: 60, borderRadius: '50%',
                        background: `conic-gradient(${viewItem.score >= 70 ? colors.success : viewItem.score >= 40 ? colors.warning : colors.danger} ${(Number(viewItem.score) || 0) * 3.6}deg, ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'} 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: '50%',
                          background: isDark ? '#1a1d29' : '#ffffff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.95rem', fontWeight: 700, color: textColor,
                        }}>{viewItem.score}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: 4, textTransform: 'uppercase' }}>Score</div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="row g-2 mb-3">
              <div className="col-md-3 col-6">
                <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                  <FontAwesomeIcon icon={faSackDollar} style={{ color: colors.success, fontSize: '0.9rem' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                    {formatMoney(viewItem.estimated_value, viewItem.currency || 'USD')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Est. Value</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                  <FontAwesomeIcon icon={faChartLine} style={{ color: colors.primary, fontSize: '0.9rem' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                    {viewItem.expected_close_date ? formatDate(viewItem.expected_close_date) : '—'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Expected Close</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                  <FontAwesomeIcon icon={faUserTie} style={{ color: colors.purple, fontSize: '0.9rem' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: textColor, marginTop: 4, fontSizeAdjust: '0.85rem' }}>
                    {viewItem.assigned_to || viewItem?.assignee?.name || viewItem?.assigned_user?.name || '—'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Assigned To</div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="glass-card text-center" style={{ borderRadius: '10px', padding: '0.75rem' }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ color: colors.info, fontSize: '0.9rem' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, marginTop: 4 }}>
                    {viewItem.created_at ? formatDate(viewItem.created_at) : '—'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: mutedColor, textTransform: 'uppercase' }}>Created</div>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.primary }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Contact Information</h6>
                </div>
                <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                  {viewItem.email && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faEnvelope} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.email}</span>
                    </div>
                  )}
                  {viewItem.phone && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faPhone} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.phone}</span>
                    </div>
                  )}
                  {viewItem.title && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faBriefcase} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.title}</span>
                    </div>
                  )}
                  {!viewItem.email && !viewItem.phone && !viewItem.title && (
                    <div style={{ color: mutedColor, fontSize: '0.8rem' }}>No contact info available.</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.purple }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Lead Profile</h6>
                </div>
                <div className="d-flex flex-column gap-2 mt-2" style={{ fontSize: '0.8rem' }}>
                  {viewItem.company && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faBuilding} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.company}</span>
                    </div>
                  )}
                  {viewItem.industry && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faIndustry} style={{ color: mutedColor, width: 16 }} />
                      <span>{viewItem.industry}</span>
                    </div>
                  )}
                  {viewItem.source && (
                    <div className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faBolt} style={{ color: mutedColor, width: 16 }} />
                      <span style={{ textTransform: 'capitalize' }}>{String(viewItem.source).replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {!viewItem.company && !viewItem.industry && !viewItem.source && (
                    <div style={{ color: mutedColor, fontSize: '0.8rem' }}>No profile info available.</div>
                  )}
                </div>
              </div>

              {viewItem.address && (
                <div className="col-12">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.warning }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Address</h6>
                  </div>
                  <div className="d-flex align-items-start gap-2 mt-2" style={{ fontSize: '0.8rem', color: textColor }}>
                    <FontAwesomeIcon icon={faLocationDot} style={{ color: mutedColor, marginTop: 3, flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'pre-wrap' }}>{viewItem.address}</span>
                  </div>
                </div>
              )}

              {viewItem.notes && (
                <div className="col-12">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: colors.info }} />
                    <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Notes</h6>
                  </div>
                  <div className="mt-2" style={{ fontSize: '0.8rem', color: textColor, whiteSpace: 'pre-wrap' }}>
                    {viewItem.notes}
                  </div>
                </div>
              )}

              {viewItem.updated_at && viewItem.updated_at !== viewItem.created_at && (
                <div className="col-12">
                  <div className="d-flex gap-3" style={{ fontSize: '0.7rem', color: mutedColor, flexWrap: 'wrap' }}>
                    <span><FontAwesomeIcon icon={faCalendar} className="me-1" /> Updated {formatDate(viewItem.updated_at)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent activities timeline */}
            {Array.isArray(viewItem.activities) && viewItem.activities.length > 0 && (
              <div className="mt-3">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.success }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Recent Activities</h6>
                </div>
                <div className="mt-2" style={{ maxHeight: 240, overflowY: 'auto' }}>
                  {viewItem.activities.slice(0, 8).map((act, idx) => (
                    <div key={act?.id || idx} className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: '0.8rem' }}>
                      <FontAwesomeIcon icon={faCircleCheck} style={{ color: colors.success, marginTop: 4 }} />
                      <div className="flex-grow-1">
                        <div style={{ color: textColor, fontWeight: 500 }}>{act?.subject || act?.title || 'Activity'}</div>
                        <div style={{ color: mutedColor, fontSize: '0.7rem' }}>
                          {act?.type && <span className="me-2">{act.type}</span>}
                          {formatDate(act?.created_at || act?.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes timeline */}
            {Array.isArray(viewItem.notes_timeline) && viewItem.notes_timeline.length > 0 && (
              <div className="mt-3">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: colors.warning }} />
                  <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem' }}>Notes Timeline</h6>
                </div>
                <div className="mt-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {viewItem.notes_timeline.slice(0, 8).map((n, idx) => (
                    <div key={n?.id || idx} className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: '0.8rem' }}>
                      <FontAwesomeIcon icon={faStickyNote} style={{ color: colors.warning, marginTop: 4 }} />
                      <div className="flex-grow-1">
                        <div style={{ color: textColor }}>{n?.body || n?.content || n?.note || '—'}</div>
                        <div style={{ color: mutedColor, fontSize: '0.7rem' }}>
                          {n?.author?.name && <span className="me-2">by {n.author.name}</span>}
                          {formatDate(n?.created_at || n?.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* ============ DELETE CONFIRM ============ */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => { if (!deleting) setDeleteDialog({ show: false, id: null, name: '', row: null }); }}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone and will remove the lead from your pipeline."
        itemName={deleteDialog.name}
        confirmLabel="Delete Lead"
        isLoading={deleting}
      />

      {/* ============ CONVERT CONFIRM ============ */}
      <DeleteConfirmDialog
        show={convertDialog.show}
        onHide={() => { if (!converting) setConvertDialog({ show: false, id: null, name: '' }); }}
        onConfirm={confirmConvert}
        title="Convert to Customer"
        message="This lead will be converted into a customer. The lead record will be moved to converted status and a new customer will be created."
        itemName={convertDialog.name}
        confirmLabel="Convert to Customer"
        isLoading={converting}
      />

      {/* ============ IMPORT EXCEL MODAL ============ */}
      <Modal show={showImport} onClose={resetImport} title="" size="lg" footer={null}>
        <div style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 42, height: 42, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.primary}18`, color: colors.primary }}>
                <FontAwesomeIcon icon={faFileImport} style={{ fontSize: '1.1rem' }} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ color: textColor, fontSize: '1rem' }}>Import Leads from Excel</h5>
                <small style={{ color: mutedColor, fontSize: '0.72rem' }}>
                  {importStep === 1 && 'Upload your Excel file (.xlsx, .csv)'}
                  {importStep === 2 && 'Map columns to lead fields'}
                  {importStep === 3 && `Preview — ${importRows.length} leads ready`}
                  {importStep === 4 && 'Import complete'}
                </small>
              </div>
            </div>
            <button onClick={resetImport} className="btn btn-sm border-0" style={{ color: mutedColor, fontSize: '1.1rem' }}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="d-flex align-items-center gap-2 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="d-flex align-items-center gap-2">
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700,
                  background: importStep >= s ? colors.primary : isDark ? '#1e293b' : '#f1f5f9',
                  color: importStep >= s ? '#fff' : mutedColor,
                  transition: 'all 0.2s',
                }}>
                  {importStep > s ? <FontAwesomeIcon icon={faCheck} /> : s}
                </div>
                {s < 4 && <div style={{ width: 30, height: 2, background: importStep > s ? colors.primary : isDark ? '#334155' : '#e2e8f0', borderRadius: 2 }} />}
              </div>
            ))}
          </div>

          {/* ===== STEP 1: Upload ===== */}
          {importStep === 1 && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? colors.primary : isDark ? '#334155' : '#cbd5e1'}`,
                borderRadius: 16, padding: '3rem 2rem', textAlign: 'center',
                background: dragOver ? `${colors.primary}08` : isDark ? 'rgba(15,23,42,0.3)' : '#f8fafc',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
              onClick={() => document.getElementById('import-file-input')?.click()}
            >
              <input id="import-file-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileInput} style={{ display: 'none' }} />
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${colors.primary}15`, color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FontAwesomeIcon icon={faUpload} style={{ fontSize: '1.5rem' }} />
              </div>
              <div className="fw-bold mb-1" style={{ color: textColor, fontSize: '0.95rem' }}>
                {dragOver ? 'Drop your file here' : 'Click or drag file to upload'}
              </div>
              <small style={{ color: mutedColor, fontSize: '0.75rem' }}>
                Supports .xlsx, .xls, .csv — Any columns are accepted
              </small>
            </div>
          )}

          {/* ===== STEP 2: Column Mapping ===== */}
          {importStep === 2 && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <small style={{ color: mutedColor, fontSize: '0.75rem' }}>
                  {importRows.length} rows detected — {importHeaders.length} columns found
                </small>
                <button className="btn btn-sm border-0" style={{ color: colors.primary, fontSize: '0.75rem' }} onClick={() => setImportStep(1)}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Change File
                </button>
              </div>

              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <table className="w-100" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <th style={{ padding: '8px 10px', color: mutedColor, fontWeight: 600, textAlign: 'left' }}>Excel Column</th>
                      <th style={{ padding: '8px 10px', color: mutedColor, fontWeight: 600, textAlign: 'left' }}>Sample Data</th>
                      <th style={{ padding: '8px 10px', color: mutedColor, fontWeight: 600, textAlign: 'left' }}>Map To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importHeaders.map((h) => (
                      <tr key={h} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td style={{ padding: '8px 10px', color: textColor, fontWeight: 500 }}>{h}</td>
                        <td style={{ padding: '8px 10px', color: mutedColor, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {String(importRows[0]?.[h] ?? '').substring(0, 60) || '—'}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <select
                            value={columnMapping[h] || '__skip__'}
                            onChange={(e) => handleMappingChange(h, e.target.value)}
                            className="form-select form-select-sm"
                            style={{
                              fontSize: '0.75rem', padding: '4px 8px',
                              background: inputBg, color: textColor,
                              borderColor: isDark ? '#334155' : '#e2e8f0',
                            }}
                          >
                            <option value="__skip__">— Skip —</option>
                            <optgroup label="Standard Lead Fields">
                              {LEAD_STANDARD_FIELDS.map((f) => (
                                <option key={f} value={f}>{f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                              ))}
                            </optgroup>
                            <option value="__custom__">Custom Field ({h})</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Preview ===== */}
          {importStep === 3 && (
            <div>
              <div className="mb-3">
                <small style={{ color: mutedColor, fontSize: '0.75rem' }}>
                  Showing first 5 rows of {importRows.length} total. All unmapped columns stored as custom fields.
                </small>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="w-100" style={{ fontSize: '0.72rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <th style={{ padding: '6px 8px', color: mutedColor, fontWeight: 600 }}>#</th>
                      {Object.keys(getPreviewData()[0] || {}).map((k) => (
                        <th key={k} style={{ padding: '6px 8px', color: mutedColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getPreviewData().map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td style={{ padding: '6px 8px', color: mutedColor }}>{i + 1}</td>
                        {Object.values(row).map((v, j) => (
                          <td key={j} style={{ padding: '6px 8px', color: textColor, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {String(v ?? '').substring(0, 50) || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== STEP 4: Result ===== */}
          {importStep === 4 && importResult && (
            <div className="text-center" style={{ padding: '1.5rem 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: (importResult.imported || 0) > 0 ? '#dcfce7' : '#fee2e2',
                color: (importResult.imported || 0) > 0 ? '#16a34a' : '#dc2626',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
              }}>
                <FontAwesomeIcon icon={(importResult.imported || 0) > 0 ? faCheck : faXmark} style={{ fontSize: '1.5rem' }} />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: textColor }}>{importResult.message}</h6>
              <small style={{ color: mutedColor, fontSize: '0.75rem' }}>
                {importResult.imported || 0} leads imported
                {importResult.errors?.length > 0 ? ` — ${importResult.errors.length} rows skipped` : ''}
              </small>
              {importResult.errors?.length > 0 && (
                <div className="mt-3 text-start" style={{ maxHeight: 150, overflowY: 'auto' }}>
                  {importResult.errors.map((err, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '0.72rem', color: '#dc2626' }}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span>Row {err.row}: {err.error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="d-flex align-items-center justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <button onClick={resetImport} className="btn btn-sm border-0 px-3" style={{ background: isDark ? '#334155' : '#f1f5f9', color: textColor, borderRadius: 8, fontSize: '0.8rem' }}>
              {importStep === 4 ? 'Close' : 'Cancel'}
            </button>
            {importStep === 2 && (
              <button onClick={() => setImportStep(3)} className="btn btn-sm text-white border-0 px-3" style={{ background: colors.primary, borderRadius: 8, fontSize: '0.8rem' }}>
                Preview ({importRows.length} rows)
              </button>
            )}
            {importStep === 3 && (
              <button onClick={handleImportSubmit} disabled={importing} className="btn btn-sm text-white border-0 px-3" style={{ background: '#10b981', borderRadius: 8, fontSize: '0.8rem' }}>
                {importing ? <><FontAwesomeIcon icon={faSpinner} className="me-1" /> Importing...</> : <><FontAwesomeIcon icon={faFileImport} className="me-1" /> Import {importRows.length} Leads</>}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </ErpPageShell>
  );
};

export default CrmLeads;
