import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft, faPlus, faFileImport, faFileExport, faSync,
  faSearch, faEye, faEdit, faTrash, faFilter, faCheckCircle,
  faTimesCircle, faBuildingColumns, faUniversity, faCog, faSave,
  faTimes, faHistory, faCalendarAlt, faChartLine, faBell,
  faCloudUploadAlt, faDownload, faInfoCircle, faServer, faClock,
  faExchangeAlt, faPrint, faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { listExchangeRates, createExchangeRate, updateExchangeRate, deleteExchangeRate, syncExchangeRates, listCurrencies } from '../../../api/fx';
import { clearCache } from '../../../api/client';

const initialRates = [];

const featureCards = [
  { icon: faCloudUploadAlt, title: 'Automatic Daily Updates', desc: 'Schedule automatic rate updates from global providers daily.', color: '#3b82f6' },
  { icon: faHistory, title: 'Historical Rates', desc: 'Access and analyze historical exchange rate data.', color: '#10b981' },
  { icon: faCalendarAlt, title: 'Future Rates', desc: 'Set and manage forward/future exchange rates.', color: '#8b5cf6' },
  { icon: faDownload, title: 'Bulk Import', desc: 'Import multiple exchange rates from CSV or Excel.', color: '#f59e0b' },
  { icon: faServer, title: 'API Synchronization', desc: 'Synchronize rates with external banking APIs.', color: '#ef4444' },
  { icon: faChartLine, title: 'Rate Comparison', desc: 'Compare rates across multiple providers side-by-side.', color: '#06b6d4' },
  { icon: faBuildingColumns, title: 'Rate Approval Workflow', desc: 'Multi-level approval for rate changes.', color: '#f97316' },
  { icon: faExchangeAlt, title: 'Exchange Rate History', desc: 'Track all rate changes with audit trail.', color: '#ec4899' },
  { icon: faCog, title: 'Version Control', desc: 'Maintain version history of all exchange rates.', color: '#14b8a6' },
  { icon: faClock, title: 'Scheduled Updates', desc: 'Define schedules for periodic rate updates.', color: '#6366f1' },
  { icon: faBell, title: 'Exchange Alerts', desc: 'Receive alerts on rate fluctuations.', color: '#e11d48' },
];

const sourceBadgeStyle = (source) => {
  const styles = {
    'Central Bank': { bg: '#dbeafe', color: '#1d4ed8' },
    'Bank API': { bg: '#d1fae5', color: '#047857' },
    'Manual': { bg: '#fef3c7', color: '#b45309' },
  };
  return styles[source] || { bg: '#f1f5f9', color: '#64748b' };
};

const sourceIconMap = {
  'Central Bank': faBuildingColumns,
  'Bank API': faUniversity,
  'Manual': faCog,
};

const statusBadgeStyle = (status) => {
  if (status === 'Active') return { bg: '#d1fae5', color: '#047857' };
  return { bg: '#fee2e2', color: '#b91c1c' };
};

const FxExchangeRates = ({ isDark }) => {
  const { t } = useTranslation();
  const { addNotification } = useApp();

  const containerBg = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#232736' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1a1d29' : '#ffffff';
  const modalOverlay = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)';

  const [exchangeRates, setExchangeRates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [baseFilter, setBaseFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewingRate, setViewingRate] = useState(null);
  const [deletingRate, setDeletingRate] = useState(null);
  const [printPayload, setPrintPayload] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [confirmAction, setConfirmAction] = useState(null);
  const [featureModal, setFeatureModal] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesRes, currenciesRes] = await Promise.all([
          listExchangeRates().catch(() => ({ data: [] })),
          listCurrencies().catch(() => ({ data: [] })),
        ]);
        setExchangeRates(ratesRes?.data?.data || ratesRes?.data || []);
        setCurrencyOptions(currenciesRes?.data?.data || currenciesRes?.data || []);
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    baseCurrency: '',
    targetCurrency: '',
    spotRate: '',
    forwardRate: '',
    historicalRate: '',
    effectiveDate: '',
    validUntil: '',
    rateProvider: 'Central Bank',
    status: 'Active',
  });

  const openAddForm = () => {
    setEditingRate(null);
    setFormData({
      baseCurrency: '',
      targetCurrency: '',
      spotRate: '',
      forwardRate: '',
      historicalRate: '',
      effectiveDate: '',
      validUntil: '',
      rateProvider: 'Central Bank',
      status: 'Active',
    });
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (rate) => {
    setEditingRate(rate);
    setFormData({
      baseCurrency: rate.base,
      targetCurrency: rate.target,
      spotRate: String(rate.buy),
      forwardRate: String(rate.sell),
      historicalRate: String(rate.mid),
      effectiveDate: rate.effective,
      validUntil: rate.expiry,
      rateProvider: rate.source,
      status: rate.status,
    });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRate(null);
    setErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.baseCurrency) errs.baseCurrency = 'Base currency is required';
    if (!formData.targetCurrency) errs.targetCurrency = 'Target currency is required';
    if (formData.baseCurrency && formData.targetCurrency && formData.baseCurrency === formData.targetCurrency) {
      errs.targetCurrency = 'Target currency must differ from base currency';
    }
    if (!formData.spotRate || isNaN(Number(formData.spotRate)) || Number(formData.spotRate) <= 0) {
      errs.spotRate = 'Valid spot rate is required';
    }
    if (!formData.forwardRate || isNaN(Number(formData.forwardRate)) || Number(formData.forwardRate) <= 0) {
      errs.forwardRate = 'Valid forward rate is required';
    }
    if (!formData.historicalRate || isNaN(Number(formData.historicalRate)) || Number(formData.historicalRate) <= 0) {
      errs.historicalRate = 'Valid historical rate is required';
    }
    if (!formData.effectiveDate) errs.effectiveDate = 'Effective date is required';
    if (!formData.validUntil) errs.validUntil = 'Valid until date is required';
    if (formData.effectiveDate && formData.validUntil && new Date(formData.validUntil) <= new Date(formData.effectiveDate)) {
      errs.validUntil = 'Expiry must be after effective date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const buy = parseFloat(formData.spotRate);
    const sell = parseFloat(formData.forwardRate);
    const mid = (buy + sell) / 2;

    const payload = {
      base: formData.baseCurrency,
      target: formData.targetCurrency,
      buy,
      sell,
      mid: parseFloat(mid.toFixed(2)),
      effective: formData.effectiveDate,
      expiry: formData.validUntil,
      source: formData.rateProvider,
      status: formData.status,
    };

    try {
      if (editingRate) {
        const res = await updateExchangeRate(editingRate.id, payload);
        const updated = res?.data?.data || res?.data || { ...editingRate, ...payload };
        setExchangeRates((prev) => prev.map((r) => r.id === editingRate.id ? { ...r, ...updated } : r));
      } else {
        const res = await createExchangeRate(payload);
        const created = res?.data?.data || res?.data || { id: `RATE-${String(exchangeRates.length + 1).padStart(3, '0')}`, createdBy: 'Admin', ...payload };
        setExchangeRates((prev) => [created, ...prev]);
      }
      closeForm();
    } catch (err) {
      addNotification?.(err.message || 'Failed to save exchange rate.', 'error');
    }
  };

  const handleDelete = (id) => {
    const rate = exchangeRates.find(r => r.id === id);
    setDeletingRate(rate);
  };

  const handleCopyRate = async (rate) => {
    const payload = {
      base: rate.base,
      target: rate.target,
      buy: rate.buy,
      sell: rate.sell,
      mid: rate.mid,
      effective: rate.effective,
      expiry: rate.expiry,
      source: rate.source,
      status: 'Inactive',
    };
    try {
      const res = await createExchangeRate(payload);
      const created = res?.data?.data || res?.data || { ...rate, id: `RATE-${String(exchangeRates.length + 1).padStart(3, '0')}`, status: 'Inactive', createdBy: 'Admin' };
      setExchangeRates(prev => [created, ...prev]);
      addNotification?.(`Exchange rate "${rate.base}/${rate.target}" copied.`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to copy exchange rate.', 'error');
    }
  };

  const handlePrint = (payload) => {
    setPrintPayload(null);
    setTimeout(() => {
      setPrintPayload(payload);
      setTimeout(() => { window.print(); }, 250);
    }, 50);
  };

  const handleApproveRate = (rate) => {
    setConfirmAction({ rate, action: rate.status === 'Active' ? 'deactivate' : 'activate' });
  };

  const confirmStatusChange = async () => {
    if (!confirmAction) return;
    const { rate, action } = confirmAction;
    const newStatus = action === 'activate' ? 'Active' : 'Inactive';
    try {
      await updateExchangeRate(rate.id, { status: newStatus });
      setExchangeRates(prev => prev.map(r => r.id === rate.id ? { ...r, status: newStatus } : r));
      addNotification?.(`Exchange rate "${rate.id}" ${action === 'activate' ? 'activated' : 'deactivated'}.`, action === 'activate' ? 'success' : 'error');
    } catch (err) {
      addNotification?.(err.message || 'Failed to update status.', 'error');
    }
    setConfirmAction(null);
  };

  const handleSyncRates = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await syncExchangeRates();
      clearCache('/fx/exchange-rates');
      const res = await listExchangeRates();
      setExchangeRates(res?.data?.data || res?.data || []);
      setLastSyncedAt(new Date().toISOString());
      addNotification?.('Exchange rates synchronized with provider. Latest rates applied.', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to sync exchange rates.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleImport = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      addNotification?.('No importable records found in the file.', 'error');
      return;
    }
    const now = new Date();
    const newRates = rows
      .filter(row => row && (row['Base Currency'] || row.base || row.baseCurrency))
      .map((row, idx) => {
        const base = row['Base Currency'] || row.base || row.baseCurrency;
        const target = row['Target Currency'] || row.target || row.targetCurrency || 'PKR';
        const buy = Number(row['Buy Rate'] || row.buy || row.spotRate || 0);
        const sell = Number(row['Sell Rate'] || row.sell || row.forwardRate || 0);
        const mid = Number(row['Mid Rate'] || row.mid || 0) || (buy + sell) / 2;
        return {
          id: row['Rate ID'] || row.id || `RATE-${now.getTime()}-${idx}`,
          base,
          target,
          buy,
          sell,
          mid: Number(mid.toFixed(2)),
          effective: row['Effective Date'] || row.effective || now.toISOString().split('T')[0],
          expiry: row['Expiry Date'] || row.expiry || '',
          source: row['Source'] || row.source || 'Manual',
          status: row['Status'] || row.status || 'Active',
          createdBy: 'Import',
        };
      })
      .filter(r => r.buy > 0 || r.sell > 0);
    if (newRates.length === 0) {
      addNotification?.('No valid exchange rate rows found in the file.', 'error');
      return;
    }
    setExchangeRates(prev => [...prev, ...newRates]);
    addNotification?.(`Imported ${newRates.length} exchange rate(s).`, 'success');
  };

  const handleOpenFeature = (feature) => {
    let type = 'info';
    switch (feature.title) {
      case 'Historical Rates':
        type = 'history';
        break;
      case 'Bulk Import':
        type = 'import';
        break;
      case 'Rate Comparison':
        type = 'compare';
        break;
      case 'Rate Approval Workflow':
        type = 'approval';
        break;
      case 'Exchange Rate History':
        type = 'history';
        break;
      case 'Scheduled Updates':
        type = 'schedule';
        break;
      case 'Exchange Alerts':
        type = 'alerts';
        break;
      default:
        type = 'info';
    }
    setFeatureModal({ feature, type });
  };

  const confirmDelete = async () => {
    if (deletingRate) {
      try {
        await deleteExchangeRate(deletingRate.id);
        setExchangeRates(prev => prev.filter(r => r.id !== deletingRate.id));
        addNotification?.(`Exchange rate "${deletingRate.id}" deleted.`, 'success');
      } catch (err) {
        addNotification?.(err.message || 'Failed to delete exchange rate.', 'error');
      }
      setDeletingRate(null);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const filteredRates = useMemo(() => {
    return exchangeRates.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBase = baseFilter === 'all' || r.base === baseFilter;
      const matchesSource = sourceFilter === 'all' || r.source === sourceFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesBase && matchesSource && matchesStatus;
    });
  }, [exchangeRates, searchQuery, baseFilter, sourceFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRates.length / pageSize);
  const paginatedRates = filteredRates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const currencyOptionsFiltered = useMemo(() => {
    return currencyOptions.filter((c) => c?.code);
  }, [currencyOptions]);

  const baseCurrencyOptions = useMemo(
    () => currencyOptionsFiltered.filter((c) => c.code !== formData.targetCurrency),
    [currencyOptionsFiltered, formData.targetCurrency]
  );
  const targetCurrencyOptions = useMemo(
    () => currencyOptionsFiltered.filter((c) => c.code !== formData.baseCurrency),
    [currencyOptionsFiltered, formData.baseCurrency]
  );

  const uniqueBases = useMemo(
    () => [...new Set(exchangeRates.map((r) => r.base))].sort(),
    [exchangeRates]
  );

  const cardStyle = {
    background: cardBg,
    borderRadius: '16px',
    border: `1px solid ${borderColor}`,
    padding: '1.25rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div style={{ background: containerBg, minHeight: '100vh', padding: 'clamp(0.75rem, 3vw, 1.5rem)', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .glass-card {
          background: ${isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'};
          box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
        }
        .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; }
        .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(245,158,11,0.08); }
        .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
        .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
        .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
        .rate-feature-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .rate-feature-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15); }
        .rate-feature-card .rate-feature-icon { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .rate-feature-card:hover .rate-feature-icon { transform: scale(1.2) rotate(-6deg); }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .enter-anim { animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
        .enter-anim:nth-child(1) { animation-delay: 0.03s; }
        .enter-anim:nth-child(2) { animation-delay: 0.06s; }
        .enter-anim:nth-child(3) { animation-delay: 0.09s; }
        .enter-anim:nth-child(4) { animation-delay: 0.12s; }
        .enter-anim:nth-child(5) { animation-delay: 0.15s; }
        .enter-anim:nth-child(6) { animation-delay: 0.18s; }
        .enter-anim:nth-child(7) { animation-delay: 0.21s; }
        .enter-anim:nth-child(8) { animation-delay: 0.24s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .fx-modal-backdrop { animation: fadeIn 0.2s ease; }
        .fx-modal-content { animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .fx-badge-pulse { animation: pulse 2s ease infinite; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4" style={{ position: 'relative', zIndex: 110 }}>
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: textColor, fontSize: '1.4rem' }}>
            <span style={{ width: 4, height: 24, background: 'linear-gradient(180deg,#f59e0b,#d97706)', borderRadius: 2, display: 'inline-block' }} />
            <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ color: '#f59e0b' }} />
            Exchange Rates
          </h4>
          <p className="mb-0 ms-2" style={{ color: mutedColor, fontSize: '0.82rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} className="me-1" style={{ fontSize: '0.7rem', color: mutedColor }} />
            Manage and monitor foreign exchange rates across all supported currency pairs. Configure buy, sell, and mid rates with provider source tracking.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-lg-0">
          <button
            className="btn btn-sm text-white border-0 premium-btn"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: '10px', padding: '0.45rem 1rem' }}
            onClick={openAddForm}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Exchange Rate
          </button>
          <FxImportDropdown
            title="Exchange Rates"
            isDark={isDark}
            addNotification={addNotification}
            onImport={handleImport}
            buttonStyle={{ background: '#10b981', color: '#fff', borderRadius: '10px', padding: '0.45rem 1rem' }}
          />
          <FxExportDropdown
            data={filteredRates}
            getExportData={(data) => data.map(r => ({
              'Rate ID': r.id,
              'Base Currency': r.base,
              'Target Currency': r.target,
              'Buy Rate': r.buy,
              'Sell Rate': r.sell,
              'Mid Rate': r.mid,
              'Effective Date': r.effective,
              'Expiry Date': r.expiry,
              'Source': r.source,
              'Status': r.status,
              'Created By': r.createdBy,
            }))}
            title="Exchange Rates Report"
            filenamePrefix="fx-exchange-rates"
            isDark={isDark}
            addNotification={addNotification}
            buttonStyle={{ background: '#8b5cf6', color: '#fff', borderRadius: '10px', padding: '0.45rem 1rem' }}
          />
          <button
            className="btn btn-sm border-0 premium-btn"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)', color: '#fff', borderRadius: '10px', padding: '0.45rem 1rem' }}
            onClick={handleSyncRates}
            disabled={syncing}
          >
            <FontAwesomeIcon icon={faSync} className={`me-1 ${syncing ? 'fa-spin' : ''}`} />
            {syncing ? 'Synchronizing...' : 'Synchronize'}
            {lastSyncedAt && (
              <span className="badge rounded-pill ms-1" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.6rem' }}>
                {new Date(lastSyncedAt).toLocaleTimeString()}
              </span>
            )}
          </button>
          <button
            className="btn btn-sm border-0 premium-btn"
            style={{ background: 'linear-gradient(135deg,#64748b,#475569)', color: '#fff', borderRadius: '10px', padding: '0.45rem 1rem' }}
            onClick={() => handlePrint({ type: 'list', items: filteredRates, title: 'Exchange Rates Report' })}
          >
            <FontAwesomeIcon icon={faPrint} className="me-1" /> Print
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <div className="position-relative" style={{ flex: '1 1 280px', maxWidth: '360px' }}>
          <FontAwesomeIcon
            icon={faSearch}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.85rem', zIndex: 2 }}
          />
          <input
            type="text"
            className="form-control form-control-sm fx-search-input"
            placeholder="Search by ID, currency, source..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{
              paddingLeft: '2rem', borderRadius: '10px', border: `1px solid ${borderColor}`,
              background: inputBg, color: textColor, fontSize: '0.82rem',
            }}
          />
        </div>
        <button
          className="btn btn-sm border-0 d-flex align-items-center gap-1"
          style={{
            borderRadius: '10px', background: showFilters ? `${isDark ? '#3b82f630' : '#3b82f610'}` : 'transparent',
            color: showFilters ? '#3b82f6' : mutedColor, border: `1px solid ${showFilters ? '#3b82f6' : borderColor}`,
            fontSize: '0.8rem',
          }}
          onClick={() => setShowFilters((p) => !p)}
        >
          <FontAwesomeIcon icon={faFilter} /> Filters
          {(baseFilter !== 'all' || sourceFilter !== 'all' || statusFilter !== 'all') && (
            <span className="badge rounded-pill" style={{ background: '#3b82f6', color: '#fff', fontSize: '0.6rem' }}>
              {[baseFilter, sourceFilter, statusFilter].filter((f) => f !== 'all').length}
            </span>
          )}
        </button>
        <span style={{ color: mutedColor, fontSize: '0.8rem' }}>
          {filteredRates.length} rate{filteredRates.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Filter Panels */}
      {showFilters && (
        <div
          className="d-flex flex-wrap gap-3 p-3 mb-3"
          style={{
            background: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}`,
            animation: 'scaleIn 0.2s ease',
          }}
        >
          <div>
            <label style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Base Currency
            </label>
            <select
              className="form-select form-select-sm fx-select-clean"
              value={baseFilter}
              onChange={(e) => { setBaseFilter(e.target.value); setCurrentPage(1); }}
              style={{ borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: '0.8rem', minWidth: '130px' }}
            >
              <option value="all">All Currencies</option>
              {uniqueBases.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Source
            </label>
            <select
              className="form-select form-select-sm fx-select-clean"
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
              style={{ borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: '0.8rem', minWidth: '130px' }}
            >
              <option value="all">All Sources</option>
              <option value="Central Bank">Central Bank</option>
              <option value="Bank API">Bank API</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label style={{ color: mutedColor, fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Status
            </label>
            <select
              className="form-select form-select-sm fx-select-clean"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: '0.8rem', minWidth: '130px' }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="d-flex align-items-end">
            <button
              className="btn btn-sm border-0"
              style={{ borderRadius: '8px', background: '#ef444410', color: '#ef4444', fontSize: '0.75rem' }}
              onClick={() => { setBaseFilter('all'); setSourceFilter('all'); setStatusFilter('all'); setCurrentPage(1); }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Exchange Rates Table */}
      <div className="premium-card glass-card mc-table-wrapper" style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div className="table-responsive" style={{ maxHeight: '520px', overflowY: 'auto', scrollBehavior: 'smooth' }}>
          <table className="table align-middle mb-0 mc-table" style={{ fontSize: '0.78rem' }}>
            <thead>
              <tr>
                <th className="px-3 py-3">Rate ID</th>
                <th className="px-2 py-3">Base</th>
                <th className="px-2 py-3">Target</th>
                <th className="px-2 py-3 text-end">Buy Rate</th>
                <th className="px-2 py-3 text-end">Sell Rate</th>
                <th className="px-2 py-3 text-end">Mid Rate</th>
                <th className="px-2 py-3">Effective</th>
                <th className="px-2 py-3">Expiry</th>
                <th className="px-2 py-3">Source</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Created By</th>
                <th className="px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRates.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-5" style={{ color: mutedColor }}>
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    No exchange rates found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedRates.map((rate, idx) => (
                  <tr
                    key={rate.id}
                    className="enter-anim"
                  >
                    <td className="px-3 py-2">
                      <span className="fw-medium" style={{ color: '#f59e0b', fontSize: '0.75rem', fontFamily: "'SF Mono','Fira Code',monospace" }}>{rate.id}</span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="fw-bold" style={{ color: textColor }}>{rate.base}</span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="fw-bold" style={{ color: textColor }}>{rate.target}</span>
                    </td>
                    <td className="px-2 py-2 text-end">
                      <span style={{ color: '#10b981', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                        {rate.buy.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-end">
                      <span style={{ color: '#ef4444', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                        {rate.sell.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-end">
                      <span style={{ color: textColor, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                        {rate.mid.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-2 py-2" style={{ color: mutedColor, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" style={{ fontSize: '0.65rem' }} />
                      {rate.effective}
                    </td>
                    <td className="px-2 py-2" style={{ color: mutedColor, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" style={{ fontSize: '0.65rem' }} />
                      {rate.expiry}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className="badge rounded-pill d-inline-flex align-items-center gap-1"
                        style={{
                          background: sourceBadgeStyle(rate.source).bg,
                          color: sourceBadgeStyle(rate.source).color,
                          fontSize: '0.65rem', fontWeight: 500, padding: '0.25em 0.6em',
                        }}
                      >
                        <FontAwesomeIcon icon={sourceIconMap[rate.source]} style={{ fontSize: '0.6rem' }} />
                        {rate.source}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="premium-badge" style={{ background: statusBadgeStyle(rate.status).bg, color: statusBadgeStyle(rate.status).color }}>
                        <span className="badge-dot" style={{ background: rate.status === 'Active' ? '#10b981' : '#ef4444' }} />
                        {rate.status}
                      </span>
                    </td>
                    <td className="px-2 py-2" style={{ color: mutedColor, fontSize: '0.72rem' }}>{rate.createdBy}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="d-flex justify-content-center gap-1" style={{ minWidth: '220px' }}>
                        <button
                          className="premium-action-btn"
                          style={{ color: '#3b82f6', background: isDark ? '#1e293b' : '#dbeafe' }}
                          title="View"
                          onClick={() => setViewingRate(rate)}
                        >
                          <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button
                          className="premium-action-btn"
                          style={{ color: '#64748b', background: isDark ? '#1e293b' : '#e2e8f0' }}
                          title="Print"
                          onClick={() => handlePrint({ type: 'single', rate })}
                        >
                          <FontAwesomeIcon icon={faPrint} style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button
                          className="premium-action-btn"
                          style={{ color: '#8b5cf6', background: isDark ? '#1e293b' : '#ede9fe' }}
                          title="Copy"
                          onClick={() => handleCopyRate(rate)}
                        >
                          <FontAwesomeIcon icon={faCopy} style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button
                          className="premium-action-btn"
                          style={{ color: rate.status === 'Active' ? '#ef4444' : '#10b981', background: isDark ? '#1e293b' : (rate.status === 'Active' ? '#fee2e2' : '#d1fae5') }}
                          title={rate.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleApproveRate(rate)}
                        >
                          <FontAwesomeIcon icon={rate.status === 'Active' ? faTimesCircle : faCheckCircle} style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button
                          className="premium-action-btn"
                          style={{ color: '#f59e0b', background: isDark ? '#1e293b' : '#fef3c7' }}
                          title="Edit"
                          onClick={() => openEditForm(rate)}
                        >
                          <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button
                          className="premium-action-btn"
                          style={{ color: '#ef4444', background: isDark ? '#1e293b' : '#fce7e7' }}
                          title="Delete"
                          onClick={() => handleDelete(rate.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.7rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="d-flex justify-content-between align-items-center px-3 py-2"
            style={{ borderTop: `1px solid ${borderColor}`, background: cardBg }}
          >
            <span style={{ color: mutedColor, fontSize: '0.75rem' }}>
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRates.length)} of {filteredRates.length}
            </span>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm border-0 fx-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{ borderRadius: '8px', color: mutedColor, fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span style={{ color: mutedColor, padding: '0 0.25rem', alignSelf: 'center' }}>...</span>
                    )}
                    <button
                      className="btn btn-sm border-0 fx-pagination-btn"
                      onClick={() => setCurrentPage(p)}
                      style={{
                        borderRadius: '8px', fontSize: '0.75rem', padding: '0.25rem 0.6rem',
                        background: p === currentPage ? '#3b82f6' : 'transparent',
                        color: p === currentPage ? '#fff' : mutedColor,
                      }}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className="btn btn-sm border-0 fx-pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{ borderRadius: '8px', color: mutedColor, fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Rate Modal */}
      <DialogBox
        show={!!viewingRate}
        onClose={() => setViewingRate(null)}
        title={`Rate Details — ${viewingRate?.id || ''}`}
        size="md"
        showClose={true}
      >
        <div className="row g-3">
          {viewingRate && [
            { label: 'Base Currency', value: viewingRate.base },
            { label: 'Target Currency', value: viewingRate.target },
            { label: 'Buy Rate', value: viewingRate.buy.toFixed(2) },
            { label: 'Sell Rate', value: viewingRate.sell.toFixed(2) },
            { label: 'Mid Rate', value: viewingRate.mid.toFixed(2) },
            { label: 'Effective Date', value: viewingRate.effective },
            { label: 'Expiry Date', value: viewingRate.expiry },
            { label: 'Rate Provider', value: viewingRate.source },
            { label: 'Status', value: viewingRate.status },
            { label: 'Created By', value: viewingRate.createdBy },
          ].map((field) => (
            <div key={field.label} className="col-6">
              <div style={{ fontSize: '0.7rem', color: mutedColor, fontWeight: 600, marginBottom: '2px' }}>{field.label}</div>
              <div style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500 }}>{field.value}</div>
            </div>
          ))}
        </div>
      </DialogBox>

      {/* Create/Edit Modal */}
      <DialogBox
        show={showForm}
        onClose={closeForm}
        title={editingRate ? 'Edit Exchange Rate' : 'Add Exchange Rate'}
        size="lg"
        showClose={true}
      >
        <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Base Currency */}
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Base Currency <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-select form-select-sm fx-form-input"
                    value={formData.baseCurrency}
                    onChange={(e) => handleFormChange('baseCurrency', e.target.value)}
                    style={{
                      borderRadius: '10px', border: `1px solid ${errors.baseCurrency ? '#ef4444' : borderColor}`,
                      background: inputBg, color: textColor, fontSize: '0.82rem',
                    }}
                  >
                    <option value="">Select base currency</option>
                    {baseCurrencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                  {errors.baseCurrency && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.baseCurrency}</small>
                  )}
                </div>

                {/* Target Currency */}
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Target Currency <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-select form-select-sm fx-form-input"
                    value={formData.targetCurrency}
                    onChange={(e) => handleFormChange('targetCurrency', e.target.value)}
                    style={{
                      borderRadius: '10px', border: `1px solid ${errors.targetCurrency ? '#ef4444' : borderColor}`,
                      background: inputBg, color: textColor, fontSize: '0.82rem',
                    }}
                  >
                    <option value="">Select target currency</option>
                    {targetCurrencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                  {errors.targetCurrency && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.targetCurrency}</small>
                  )}
                </div>

                {/* Spot Rate */}
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Spot Rate (Buy) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      style={{
                        borderRadius: '10px 0 0 10px', border: `1px solid ${borderColor}`,
                        background: inputBg, color: mutedColor, fontSize: '0.78rem',
                      }}
                    >
                      {formData.targetCurrency || '??'}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control fx-form-input"
                      value={formData.spotRate}
                      onChange={(e) => handleFormChange('spotRate', e.target.value)}
                      placeholder="e.g. 287.50"
                      style={{
                        borderRadius: '0 10px 10px 0', border: `1px solid ${errors.spotRate ? '#ef4444' : borderColor}`,
                        background: inputBg, color: textColor, fontSize: '0.82rem',
                      }}
                    />
                  </div>
                  {errors.spotRate && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.spotRate}</small>
                  )}
                </div>

                {/* Forward Rate */}
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Forward Rate (Sell) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      style={{
                        borderRadius: '10px 0 0 10px', border: `1px solid ${borderColor}`,
                        background: inputBg, color: mutedColor, fontSize: '0.78rem',
                      }}
                    >
                      {formData.targetCurrency || '??'}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control fx-form-input"
                      value={formData.forwardRate}
                      onChange={(e) => handleFormChange('forwardRate', e.target.value)}
                      placeholder="e.g. 289.75"
                      style={{
                        borderRadius: '0 10px 10px 0', border: `1px solid ${errors.forwardRate ? '#ef4444' : borderColor}`,
                        background: inputBg, color: textColor, fontSize: '0.82rem',
                      }}
                    />
                  </div>
                  {errors.forwardRate && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.forwardRate}</small>
                  )}
                </div>

                {/* Historical Rate */}
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Historical Rate (Mid) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      style={{
                        borderRadius: '10px 0 0 10px', border: `1px solid ${borderColor}`,
                        background: inputBg, color: mutedColor, fontSize: '0.78rem',
                      }}
                    >
                      {formData.targetCurrency || '??'}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control fx-form-input"
                      value={formData.historicalRate}
                      onChange={(e) => handleFormChange('historicalRate', e.target.value)}
                      placeholder="e.g. 288.63"
                      style={{
                        borderRadius: '0 10px 10px 0', border: `1px solid ${errors.historicalRate ? '#ef4444' : borderColor}`,
                        background: inputBg, color: textColor, fontSize: '0.82rem',
                      }}
                    />
                  </div>
                  {errors.historicalRate && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.historicalRate}</small>
                  )}
                </div>

                {/* Effective Date */}
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Effective Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm fx-form-input"
                    value={formData.effectiveDate}
                    onChange={(e) => handleFormChange('effectiveDate', e.target.value)}
                    style={{
                      borderRadius: '10px', border: `1px solid ${errors.effectiveDate ? '#ef4444' : borderColor}`,
                      background: inputBg, color: textColor, fontSize: '0.82rem',
                    }}
                  />
                  {errors.effectiveDate && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.effectiveDate}</small>
                  )}
                </div>

                {/* Valid Until */}
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Valid Until (Expiry) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm fx-form-input"
                    value={formData.validUntil}
                    onChange={(e) => handleFormChange('validUntil', e.target.value)}
                    style={{
                      borderRadius: '10px', border: `1px solid ${errors.validUntil ? '#ef4444' : borderColor}`,
                      background: inputBg, color: textColor, fontSize: '0.82rem',
                    }}
                  />
                  {errors.validUntil && (
                    <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.validUntil}</small>
                  )}
                </div>

                {/* Rate Provider */}
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Rate Provider
                  </label>
                  <select
                    className="form-select form-select-sm fx-form-input"
                    value={formData.rateProvider}
                    onChange={(e) => handleFormChange('rateProvider', e.target.value)}
                    style={{
                      borderRadius: '10px', border: `1px solid ${borderColor}`,
                      background: inputBg, color: textColor, fontSize: '0.82rem',
                    }}
                  >
                    <option value="Central Bank">Central Bank</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: textColor, fontSize: '0.8rem' }}>
                    Status
                  </label>
                  <div
                    className="d-flex align-items-center gap-3 p-2"
                    style={{
                      borderRadius: '10px', border: `1px solid ${borderColor}`,
                      background: inputBg,
                    }}
                  >
                    <span style={{ color: mutedColor, fontSize: '0.78rem' }}>Inactive</span>
                    <div
                      onClick={() => handleFormChange('status', formData.status === 'Active' ? 'Inactive' : 'Active')}
                      style={{
                        width: '44px', height: '24px', borderRadius: '12px',
                        background: formData.status === 'Active' ? '#10b981' : '#cbd5e1',
                        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: '#fff', position: 'absolute', top: '2px',
                          left: formData.status === 'Active' ? '22px' : '2px',
                          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>
                    <span style={{ color: textColor, fontSize: '0.78rem' }}>Active</span>
                    <span
                      className="badge rounded-pill ms-auto"
                      style={{
                        background: formData.status === 'Active' ? '#d1fae5' : '#fee2e2',
                        color: formData.status === 'Active' ? '#047857' : '#b91c1c',
                        fontSize: '0.65rem',
                      }}
                    >
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                <button
                  type="button"
                  className="btn btn-sm border-0"
                  style={{ borderRadius: '10px', color: mutedColor, background: isDark ? '#2d3248' : '#f1f5f9', padding: '0.45rem 1.2rem', fontSize: '0.8rem' }}
                  onClick={closeForm}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm text-white border-0 fx-btn-hover"
                  style={{ background: '#3b82f6', borderRadius: '10px', padding: '0.45rem 1.5rem', fontSize: '0.8rem' }}
                >
                  <FontAwesomeIcon icon={faSave} className="me-1" />
                  {editingRate ? 'Update Rate' : 'Save Rate'}
                </button>
              </div>
            </form>
      </DialogBox>

      {/* Feature Cards Section */}
      <div className="mb-3">
        <div className="section-header">
          <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#8b5cf6,#a78bfa)' }} />
          <FontAwesomeIcon icon={faCog} style={{ color: '#8b5cf6', fontSize: '0.9rem' }} />
          <h6 style={{ color: textColor }}>Exchange Rate Features</h6>
        </div>
        <div className="row g-3">
          {featureCards.map((feature, idx) => (
            <div key={idx} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fx-fade-in">
              <div
                className="rate-feature-card premium-card glass-card"
                style={cardStyle}
                onClick={() => handleOpenFeature(feature)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenFeature(feature); } }}
                title={`Open: ${feature.title}`}
              >
                <div className="rate-feature-icon"
                  style={{
                    width: 44, height: 44, borderRadius: '14px',
                    background: `${feature.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <FontAwesomeIcon icon={feature.icon} style={{ color: feature.color, fontSize: '1.1rem' }} />
                </div>
                <h6 className="fw-bold mb-1" style={{ color: textColor, fontSize: '0.85rem' }}>{feature.title}</h6>
                <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem', lineHeight: 1.4 }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Rate Confirmation */}
      <DialogBox.Confirm
        show={!!deletingRate}
        onClose={() => setDeletingRate(null)}
        onConfirm={confirmDelete}
        title="Delete Exchange Rate"
        message={`Are you sure you want to delete the exchange rate for ${deletingRate?.base}/${deletingRate?.target}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Activate / Deactivate Confirmation */}
      <DialogBox.Confirm
        show={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmStatusChange}
        title={confirmAction?.action === 'activate' ? 'Activate Exchange Rate' : 'Deactivate Exchange Rate'}
        message={`Are you sure you want to ${confirmAction?.action === 'activate' ? 'activate' : 'deactivate'} exchange rate "${confirmAction?.rate?.id || ''}" (${confirmAction?.rate?.base || ''}/${confirmAction?.rate?.target || ''})?`}
        confirmLabel={confirmAction?.action === 'activate' ? 'Activate' : 'Deactivate'}
        variant={confirmAction?.action === 'activate' ? 'success' : 'warning'}
      />

      {/* Exchange Rate Feature Workspace */}
      <DialogBox
        show={!!featureModal}
        onClose={() => setFeatureModal(null)}
        title={featureModal?.feature?.title || 'Feature'}
        size="xl"
        showClose={true}
      >
        {featureModal && (
          <div>
            {featureModal.type === 'approval' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Rate approval workflow — approve or deactivate pending rate changes.
                </p>
                <div className="table-responsive">
                  <table className="table align-middle mb-0 mc-table">
                    <thead>
                      <tr>
                        <th>Rate ID</th>
                        <th>Pair</th>
                        <th className="text-end">Buy</th>
                        <th className="text-end">Sell</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchangeRates.length === 0 ? (
                        <tr><td colSpan="7" className="text-center py-4" style={{ color: mutedColor }}>No exchange rates available.</td></tr>
                      ) : (
                        exchangeRates.map(rate => (
                          <tr key={rate.id}>
                            <td className="fw-semibold" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{rate.id}</td>
                            <td style={{ color: textColor }}>{rate.base}/{rate.target}</td>
                            <td className="text-end" style={{ color: '#10b981' }}>{rate.buy.toFixed(2)}</td>
                            <td className="text-end" style={{ color: '#ef4444' }}>{rate.sell.toFixed(2)}</td>
                            <td style={{ color: mutedColor }}>{rate.source}</td>
                            <td>
                              <span className="premium-badge" style={{ background: statusBadgeStyle(rate.status).bg, color: statusBadgeStyle(rate.status).color }}>
                                <span className="badge-dot" style={{ background: rate.status === 'Active' ? '#10b981' : '#ef4444' }} />
                                {rate.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <button
                                  className="premium-action-btn"
                                  style={{ color: rate.status === 'Active' ? '#ef4444' : '#10b981', background: isDark ? '#1e293b' : (rate.status === 'Active' ? '#fee2e2' : '#d1fae5') }}
                                  title={rate.status === 'Active' ? 'Deactivate' : 'Activate'}
                                  onClick={() => handleApproveRate(rate)}
                                >
                                  <FontAwesomeIcon icon={rate.status === 'Active' ? faTimesCircle : faCheckCircle} style={{ fontSize: '0.7rem' }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {featureModal.type === 'history' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Historical rate records across all effective dates. Newer entries supersede older ones.
                </p>
                <div className="table-responsive">
                  <table className="table align-middle mb-0 mc-table">
                    <thead>
                      <tr>
                        <th>Rate ID</th>
                        <th>Pair</th>
                        <th className="text-end">Buy</th>
                        <th className="text-end">Sell</th>
                        <th className="text-end">Mid</th>
                        <th>Effective</th>
                        <th>Expiry</th>
                        <th>Source</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...exchangeRates].sort((a, b) => (b.effective || '').localeCompare(a.effective || '')).map(rate => (
                        <tr key={rate.id}>
                          <td className="fw-semibold" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{rate.id}</td>
                          <td style={{ color: textColor }}>{rate.base}/{rate.target}</td>
                          <td className="text-end" style={{ color: '#10b981' }}>{rate.buy.toFixed(2)}</td>
                          <td className="text-end" style={{ color: '#ef4444' }}>{rate.sell.toFixed(2)}</td>
                          <td className="text-end" style={{ color: textColor }}>{rate.mid.toFixed(2)}</td>
                          <td style={{ color: mutedColor }}>{rate.effective}</td>
                          <td style={{ color: mutedColor }}>{rate.expiry}</td>
                          <td style={{ color: mutedColor }}>{rate.source}</td>
                          <td>
                            <span className="premium-badge" style={{ background: statusBadgeStyle(rate.status).bg, color: statusBadgeStyle(rate.status).color }}>
                              <span className="badge-dot" style={{ background: rate.status === 'Active' ? '#10b981' : '#ef4444' }} />
                              {rate.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {featureModal.type === 'compare' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Side-by-side rate comparison across active currency pairs.
                </p>
                <div className="table-responsive">
                  <table className="table align-middle mb-0 mc-table">
                    <thead>
                      <tr>
                        <th>Pair</th>
                        <th className="text-end">Buy</th>
                        <th className="text-end">Sell</th>
                        <th className="text-end">Mid</th>
                        <th className="text-end">Spread</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchangeRates.filter(r => r.status === 'Active').map(rate => (
                        <tr key={rate.id}>
                          <td className="fw-bold" style={{ color: textColor }}>{rate.base}/{rate.target}</td>
                          <td className="text-end" style={{ color: '#10b981' }}>{rate.buy.toFixed(2)}</td>
                          <td className="text-end" style={{ color: '#ef4444' }}>{rate.sell.toFixed(2)}</td>
                          <td className="text-end" style={{ color: textColor }}>{rate.mid.toFixed(2)}</td>
                          <td className="text-end fw-semibold" style={{ color: '#8b5cf6' }}>{Number((rate.sell - rate.buy).toFixed(2))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {featureModal.type === 'schedule' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Configure automatic rate update schedules.
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="rounded-4 p-3 d-flex align-items-center gap-3" style={{ border: '1px solid #6366f1', background: 'rgba(99,102,241,0.08)' }}>
                      <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>Daily Provider Sync</div>
                        <small style={{ color: mutedColor }}>Rates refresh automatically every business day at 09:00.</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="rounded-4 p-3 d-flex align-items-center gap-3" style={{ border: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.08)' }}>
                      <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44, background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>Weekly Rate Review</div>
                        <small style={{ color: mutedColor }}>A treasury review runs every Monday with change alerts.</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {featureModal.type === 'alerts' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Rate fluctuation alerts monitor active pairs and notify on significant moves.
                </p>
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.2)' }}>
                  <FontAwesomeIcon icon={faBell} style={{ color: '#e11d48', fontSize: '1.3rem' }} />
                  <div>
                    <div className="fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>Alert Rule Active</div>
                    <small style={{ color: mutedColor }}>You will be notified when any active rate moves more than 1.0% intraday.</small>
                  </div>
                </div>
              </div>
            )}
            {featureModal.type === 'import' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Use the Import button in the toolbar to bulk-import rates from Excel/CSV. Imported rows are validated and appended to the current list.
                </p>
                <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <FontAwesomeIcon icon={faDownload} style={{ color: '#10b981', fontSize: '1.3rem' }} />
                  <div>
                    <div className="fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>Bulk Import Ready</div>
                    <small style={{ color: mutedColor }}>Columns: Rate ID, Base Currency, Target Currency, Buy Rate, Sell Rate, Effective Date, Source, Status.</small>
                  </div>
                </div>
              </div>
            )}
            {featureModal.type === 'info' && (
              <div>
                <p style={{ color: textColor, fontSize: '0.9rem', lineHeight: 1.6 }}>{featureModal.feature?.desc}</p>
              </div>
            )}
          </div>
        )}
      </DialogBox>

      {/* Print Area */}
      {printPayload && (
        <div id="fx-print-area">
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>
              {printPayload.type === 'single' ? 'Exchange Rate Details' : (printPayload.title || 'Exchange Rates Report')}
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              Generated: {new Date().toLocaleString()}
            </div>
          </div>
          {printPayload.type === 'single' ? (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {(() => {
                  const r = printPayload.rate;
                  const rows = [
                    ['Rate ID', r.id],
                    ['Base Currency', r.base],
                    ['Target Currency', r.target],
                    ['Buy Rate', r.buy.toFixed(2)],
                    ['Sell Rate', r.sell.toFixed(2)],
                    ['Mid Rate', r.mid.toFixed(2)],
                    ['Effective Date', r.effective],
                    ['Expiry Date', r.expiry],
                    ['Rate Provider', r.source],
                    ['Status', r.status],
                    ['Created By', r.createdBy],
                  ];
                  return rows.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', background: '#f8fafc', fontWeight: 600, width: '40%' }}>{k}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{v}</td>
                    </tr>
                  ));
                })()}
              </table>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Rate ID', 'Base', 'Target', 'Buy', 'Sell', 'Mid', 'Effective', 'Expiry', 'Source', 'Status'].map(h => (
                    <th key={h} style={{ border: '1px solid #cbd5e1', padding: '6px 8px', background: '#f1f5f9', textAlign: 'left', fontSize: '11px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(printPayload.items || []).map((r) => (
                  <tr key={r.id}>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 600 }}>{r.id}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{r.base}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{r.target}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'right' }}>{r.buy.toFixed(2)}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'right' }}>{r.sell.toFixed(2)}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'right' }}>{r.mid.toFixed(2)}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{r.effective}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{r.expiry}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{r.source}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style>{`
        #fx-print-area { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          #fx-print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 24px; color: #111; }
          #fx-print-area * { visibility: visible !important; }
        }
      `}</style>
    </div>
  );
};

export default FxExchangeRates;
