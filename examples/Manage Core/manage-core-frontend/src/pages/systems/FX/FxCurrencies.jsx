import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe, faPlus, faFileImport, faFileExport, faPrint, faSearch,
  faEye, faEdit, faBan, faArchive, faTrash, faFilter, faCheckCircle,
  faTimesCircle, faFlag, faCog, faSave, faTimes, faDollarSign,
  faExchangeAlt, faUniversity, faMapMarkerAlt, faInfoCircle, faStar, faCheck,
  faFilePdf, faFileExcel, faFileWord, faFileAlt, faChevronDown, faCopy
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { downloadTextFile, exportToExcel } from '../../../utils/localFeatureStore';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { listCurrencies, createCurrency, updateCurrency, deleteCurrency } from '../../../api/fx';
import { clearCache } from '../../../api/client';

const SEED_CURRENCIES = [];

const FxCurrencies = ({ isDark }) => {
  const { t } = useTranslation();
  const { addNotification } = useApp();

  const containerBg = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#232736' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const [showForm, setShowForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [deletingCurrency, setDeletingCurrency] = useState(null);
  const [viewingCurrency, setViewingCurrency] = useState(null);
  const [printPayload, setPrintPayload] = useState(null);
  const [currencyForm, setCurrencyForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [baseOnly, setBaseOnly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);
  const [currenciesData, setCurrenciesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listCurrencies();
        setCurrenciesData(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const countries = useMemo(() => [...new Set(currenciesData.map(c => c.country))], [currenciesData]);

  const filteredCurrencies = useMemo(() => {
    return currenciesData.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (countryFilter !== 'all' && c.country !== countryFilter) return false;
      if (baseOnly && !c.isBase) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.code.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [currenciesData, statusFilter, countryFilter, baseOnly, searchQuery]);

  const handleConfirmDeleteCurrency = async () => {
    if (!deletingCurrency) return;
    try {
      await deleteCurrency(deletingCurrency.id);
      setCurrenciesData(prev => prev.filter(c => c.id !== deletingCurrency.id));
      addNotification?.(`Currency "${deletingCurrency.code}" deleted.`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete currency.', 'error');
    }
    setDeletingCurrency(null);
  };

  const handleOpenForm = (currency = null) => {
    setEditingCurrency(currency);
    setFormErrors({});
    setCurrencyForm(currency ? {
      currencyName: currency.name,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
      isoCode: currency.isoCode,
      country: currency.country,
      countryFlag: currency.flag,
      decimalPrecision: currency.decimalPlaces,
      isBase: !!currency.isBase,
      exchangeRate: currency.exchangeRate,
      status: currency.status || 'Active',
      exchangeProvider: currency.provider || '',
      rateSource: currency.rateSource || '',
      description: currency.description || '',
      autoUpdateRates: !!currency.autoUpdate,
      manualOverride: !!currency.manualOverride,
      defaultAccountingCurrency: currency.defaultAccountingCurrency ? 'yes' : 'no',
      currencyFormatting: currency.currencyFormat || '1,234.56',
      negativeFormat: currency.negativeFormat || '-1,234.56',
      thousandsSeparator: currency.thousandsSep || ',',
      decimalSeparator: currency.decimalSep || '.',
      exchangeRatePrecision: currency.ratePrecision || 6,
      countryLocalization: currency.localization || '',
      regionalStandards: currency.regionalStandards || '',
      approvalWorkflow: currency.approvalWorkflow || 'Standard',
    } : {
      currencyName: '', currencyCode: '', currencySymbol: '', isoCode: '', country: '', countryFlag: '',
      decimalPrecision: 2, isBase: false, exchangeRate: '', status: 'Active', exchangeProvider: '',
      rateSource: '', description: '', autoUpdateRates: true, manualOverride: false,
      defaultAccountingCurrency: 'no', currencyFormatting: '1,234.56', negativeFormat: '-1,234.56',
      thousandsSeparator: ',', decimalSeparator: '.', exchangeRatePrecision: 6, countryLocalization: '',
      regionalStandards: '', approvalWorkflow: 'Standard',
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCurrency(null);
    setCurrencyForm(null);
    setFormErrors({});
  };

  const handleFormChange = (name, value) => {
    setCurrencyForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSaveCurrency = async () => {
    if (!currencyForm || !validateForm(currencyForm)) return;
    const payload = {
      code: (currencyForm.currencyCode || '').toUpperCase(),
      name: currencyForm.currencyName,
      symbol: currencyForm.currencySymbol,
      isoCode: currencyForm.isoCode,
      country: currencyForm.country,
      flag: currencyForm.countryFlag || '🌐',
      decimalPlaces: Number(currencyForm.decimalPrecision) || 2,
      isBase: !!currencyForm.isBase,
      exchangeRate: Number(currencyForm.exchangeRate) || 0,
      status: currencyForm.status || 'Active',
      provider: currencyForm.exchangeProvider || '',
      rateSource: currencyForm.rateSource || '',
      description: currencyForm.description || '',
      autoUpdate: !!currencyForm.autoUpdateRates,
      manualOverride: !!currencyForm.manualOverride,
      defaultAccountingCurrency: currencyForm.defaultAccountingCurrency === 'yes',
      currencyFormat: currencyForm.currencyFormatting || '1,234.56',
      negativeFormat: currencyForm.negativeFormat || '-1,234.56',
      thousandsSep: currencyForm.thousandsSeparator || ',',
      decimalSep: currencyForm.decimalSeparator || '.',
      ratePrecision: Number(currencyForm.exchangeRatePrecision) || 6,
      localization: currencyForm.countryLocalization || '',
      regionalStandards: currencyForm.regionalStandards || '',
      approvalWorkflow: currencyForm.approvalWorkflow || 'Standard',
    };
    try {
      if (editingCurrency) {
        const res = await updateCurrency(editingCurrency.id, payload);
        const updated = res?.data?.data || res?.data || { ...editingCurrency, ...payload };
        setCurrenciesData(prev => prev.map(c => c.id === editingCurrency.id ? { ...c, ...updated } : c));
        addNotification?.(`Currency "${payload.code}" updated.`, 'success');
      } else {
        const res = await createCurrency(payload);
        const created = res?.data?.data || res?.data || { id: Date.now(), createdAt: new Date().toISOString().split('T')[0], ...payload };
        setCurrenciesData(prev => [...prev, created]);
        addNotification?.(`Currency "${payload.code}" created.`, 'success');
      }
      handleCloseForm();
    } catch (err) {
      addNotification?.(err.message || 'Failed to save currency.', 'error');
    }
  };

  const handleCopyCurrency = async (currency) => {
    const copyPayload = {
      ...currency,
      code: `${currency.code}-COPY`,
      status: 'Active',
      isBase: false,
    };
    delete copyPayload.id;
    delete copyPayload.createdAt;
    try {
      const res = await createCurrency(copyPayload);
      const created = res?.data?.data || res?.data || { id: Date.now(), createdAt: new Date().toISOString().split('T')[0], ...copyPayload };
      setCurrenciesData(prev => [...prev, created]);
      addNotification?.(`Currency "${currency.code}" copied as "${copyPayload.code}".`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to copy currency.', 'error');
    }
  };

  const handleSetCurrencyStatus = async (currency, status) => {
    try {
      await updateCurrency(currency.id, { status });
      setCurrenciesData(prev => prev.map(c => c.id === currency.id ? { ...c, status } : c));
      addNotification?.(`Currency "${currency.code}" marked as ${status}.`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to update currency status.', 'error');
    }
  };

  const handlePrint = (payload) => {
    setPrintPayload(null);
    setTimeout(() => {
      setPrintPayload(payload);
      setTimeout(() => { window.print(); }, 250);
    }, 50);
  };

  const handleImport = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      addNotification?.('No importable records found in the file.', 'error');
      return;
    }
    const now = new Date();
    const newCurrencies = rows
      .filter(row => row && (row['Currency Code'] || row.Code || row.code || row['Code']))
      .map((row, idx) => ({
        id: now.getTime() + idx,
        code: (row['Currency Code'] || row.Code || row.code || '').toUpperCase(),
        name: row['Currency Name'] || row.Name || row.name || row['Name'] || '',
        symbol: row['Symbol'] || row.symbol || '¤',
        isoCode: row['ISO Code'] || row.isoCode || row['ISO'] || '',
        country: row['Country'] || row.country || '',
        flag: '🌐',
        decimalPlaces: Number(row['Decimal'] || row.decimalPlaces || 2),
        isBase: String(row['Is Base'] || row.isBase || '').toLowerCase() === 'yes' || row.isBase === true,
        exchangeRate: Number(row['Exchange Rate'] || row.exchangeRate || 0),
        status: (row['Status'] || row.status || 'Active').replace(/^\w/, c => c.toUpperCase()),
        provider: row['Provider'] || row.provider || '',
        rateSource: row['Rate Source'] || row.rateSource || '',
        description: row['Description'] || row.description || '',
        autoUpdate: true,
        manualOverride: false,
        defaultAccountingCurrency: false,
        currencyFormat: '1,234.56',
        negativeFormat: '-1,234.56',
        thousandsSep: ',',
        decimalSep: '.',
        ratePrecision: 6,
        localization: '',
        regionalStandards: '',
        approvalWorkflow: 'Standard',
        createdAt: now.toISOString().split('T')[0],
      }))
      .filter(c => c.code && c.exchangeRate > 0);
    if (newCurrencies.length === 0) {
      addNotification?.('No valid currency rows found in the file.', 'error');
      return;
    }
    setCurrenciesData(prev => [...prev, ...newCurrencies]);
    addNotification?.(`Imported ${newCurrencies.length} currency(ies).`, 'success');
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.currencyName?.trim()) errors.currencyName = 'Currency name is required';
    if (!formData.currencyCode?.trim()) errors.currencyCode = 'Currency code is required';
    if (!formData.currencySymbol?.trim()) errors.currencySymbol = 'Currency symbol is required';
    if (!formData.isoCode?.trim()) errors.isoCode = 'ISO code is required';
    if (!formData.country?.trim()) errors.country = 'Country is required';
    if (!formData.exchangeRate || isNaN(Number(formData.exchangeRate))) errors.exchangeRate = 'Valid exchange rate is required';
    if (!formData.decimalPrecision || isNaN(Number(formData.decimalPrecision))) errors.decimalPrecision = 'Decimal precision is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getStatusBadge = (status) => {
    const map = {
      Active: { bg: isDark ? '#064e3b' : '#d1fae5', text: isDark ? '#6ee7b7' : '#065f46' },
      Inactive: { bg: isDark ? '#422006' : '#fed7aa', text: isDark ? '#fbbf24' : '#9a3412' },
      Archived: { bg: isDark ? '#1e1b4b' : '#e0e7ff', text: isDark ? '#818cf8' : '#3730a3' },
    };
    const m = map[status] || { bg: isDark ? '#1e293b' : '#f1f5f9', text: isDark ? '#94a3b8' : '#475569' };
    return { background: m.bg, color: m.text };
  };

  const getStatusDot = (status) => {
    const map = {
      Active: '#10b981',
      Inactive: '#f59e0b',
      Archived: '#8b5cf6',
    };
    return map[status] || '#94a3b8';
  };

  const styles = {
    page: {
      background: containerBg,
      minHeight: '100vh',
      animation: 'fadeSlideUp 0.6s ease-out',
    },
    headerCard: {
      background: cardBg,
      borderRadius: '16px',
      border: `1px solid ${borderColor}`,
      padding: '1.25rem 1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      position: 'relative',
      zIndex: 110,
    },
    filterCard: {
      background: cardBg,
      borderRadius: '16px',
      border: `1px solid ${borderColor}`,
      padding: '1rem 1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    },
    tableCard: {
      background: cardBg,
      borderRadius: '16px',
      border: `1px solid ${borderColor}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      position: 'relative',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '1rem',
      animation: 'fadeSlideUp 0.5s ease-out',
    },
    modalContent: {
      background: cardBg,
      borderRadius: '16px',
      border: `1px solid ${borderColor}`,
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      width: '100%',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    modalHeader: {
      padding: '1.25rem 1.5rem',
      borderBottom: `1px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalBody: {
      padding: '1.5rem',
      overflowY: 'auto',
      flex: 1,
    },
    modalFooter: {
      padding: '1rem 1.5rem',
      borderTop: `1px solid ${borderColor}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
    },
    sectionTitle: {
      fontSize: '0.85rem',
      fontWeight: 700,
      color: textColor,
    },
    formLabel: {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: mutedColor,
      marginBottom: '0.35rem',
    },
    input: {
      width: '100%',
      padding: '0.45rem 0.75rem',
      fontSize: '0.8rem',
      borderRadius: '8px',
      border: `1px solid ${borderColor}`,
      background: isDark ? '#1a1d29' : '#fff',
      color: textColor,
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    select: {
      width: '100%',
      padding: '0.45rem 0.75rem',
      fontSize: '0.8rem',
      borderRadius: '8px',
      border: `1px solid ${borderColor}`,
      background: isDark ? '#1a1d29' : '#fff',
      color: textColor,
      outline: 'none',
      cursor: 'pointer',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    textarea: {
      width: '100%',
      padding: '0.45rem 0.75rem',
      fontSize: '0.8rem',
      borderRadius: '8px',
      border: `1px solid ${borderColor}`,
      background: isDark ? '#1a1d29' : '#fff',
      color: textColor,
      outline: 'none',
      resize: 'vertical',
      minHeight: '70px',
    },
    btnPrimary: {
      padding: '0.45rem 1rem',
      fontSize: '0.78rem',
      fontWeight: 600,
      borderRadius: '50px',
      border: 'none',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: '#fff',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      transition: 'all 0.2s',
    },
    btnOutline: {
      padding: '0.4rem 0.9rem',
      fontSize: '0.75rem',
      fontWeight: 500,
      borderRadius: '50px',
      border: `1px solid ${borderColor}`,
      background: 'transparent',
      color: mutedColor,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      transition: 'all 0.2s',
    },
    btnAction: (color = mutedColor) => ({
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      color: color,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.7rem',
      transition: 'all 0.25s ease',
      padding: 0,
    }),
    badge: (bg, color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.2rem 0.6rem',
      borderRadius: '50px',
      fontSize: '0.65rem',
      fontWeight: 600,
      background: bg,
      color: color,
    }),
    errorText: {
      fontSize: '0.65rem',
      color: '#ef4444',
      marginTop: '0.2rem',
    },
    th: {
      fontSize: '0.65rem',
      fontWeight: 700,
      color: mutedColor,
      padding: '10px 12px',
      whiteSpace: 'nowrap',
      borderBottom: `1px solid ${borderColor}`,
    },
    td: {
      fontSize: '0.78rem',
      color: textColor,
      padding: '10px 12px',
      whiteSpace: 'nowrap',
    },
  };

  const renderFormField = (label, name, type, options = {}) => {
    const value = currencyForm?.[name];
    const error = formErrors[name];
    const borderColorStyle = error ? '#ef4444' : borderColor;
    const inputStyle = { ...styles.input, ...(error ? { borderColor: '#ef4444' } : {}) };
    const selectStyle = { ...styles.select, ...(error ? { borderColor: '#ef4444' } : {}) };

    return (
      <div style={{ marginBottom: '0.85rem' }}>
        {label && <label style={styles.formLabel}>{label}</label>}
        {type === 'select' ? (
          <select
            className="premium-input"
            style={selectStyle}
            value={value ?? ''}
            onChange={e => handleFormChange(name, e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
            onBlur={e => { e.target.style.borderColor = borderColorStyle; }}>
            {options.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            className="cur-textarea"
            style={{ ...styles.textarea, ...(error ? { borderColor: '#ef4444' } : {}) }}
            value={value ?? ''}
            placeholder={options.placeholder || ''}
            onChange={e => handleFormChange(name, e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
            onBlur={e => { e.target.style.borderColor = borderColorStyle; }}
          />
        ) : type === 'checkbox' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
            <input
              type="checkbox"
              checked={!!value}
              onChange={e => handleFormChange(name, e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#8b5cf6' }}
            />
            <span style={{ fontSize: '0.75rem', color: mutedColor }}>{options.checkboxLabel || ''}</span>
          </div>
        ) : (
          <input
            type={type || 'text'}
            className="premium-input"
            style={inputStyle}
            value={value ?? ''}
            placeholder={options.placeholder || ''}
            onChange={e => handleFormChange(name, e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
            onBlur={e => { e.target.style.borderColor = borderColorStyle; }}
          />
        )}
        {error && <div style={styles.errorText}>{error}</div>}
      </div>
    );
  };

  return (
    <div className="container-fluid py-4 px-4" style={styles.page}>
      <style>{`
        .glass-card {
          background: ${isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'};
          box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
        }
        .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; }
        .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(139,92,246,0.08); }
        .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
        .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
        .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
        .premium-input:focus { box-shadow: 0 0 0 3px ${isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.15)'}; outline: none; border-color: #8b5cf6 !important; }
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
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
      `}</style>

      {/* Header Section */}
      <div className="premium-card glass-card mb-4" style={styles.headerCard}>
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '4px', height: '36px', borderRadius: '2px', background: 'linear-gradient(to bottom, #8b5cf6, #3b82f6, #06b6d4)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faGlobe} className="me-2" style={{ color: '#3b82f6' }} />
                {t('Currencies')}
              </h4>
              <p className="mb-0" style={{ fontSize: '0.78rem', color: mutedColor }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '0.65rem', marginRight: '0.35rem', color: '#8b5cf6', opacity: 0.7 }} />
                {t('Manage multi-currency setup, exchange rates, and localization settings.')}
              </p>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
            <button className="premium-btn" style={styles.btnPrimary} onClick={() => handleOpenForm(null)}>
              <FontAwesomeIcon icon={faPlus} />{t('Add Currency')}
            </button>
            <FxImportDropdown
              title="Currencies"
              isDark={isDark}
              addNotification={addNotification}
              onImport={handleImport}
              buttonClassName="premium-btn"
              buttonStyle={styles.btnOutline}
            />
            <FxExportDropdown
              data={filteredCurrencies}
              getExportData={(data) => data.map(c => ({
                'ID': c.id,
                'Code': c.code,
                'Name': c.name,
                'Country': c.country,
                'Symbol': c.symbol,
                'Exchange Rate': c.exchangeRate,
                'Is Base': c.isBase ? 'Yes' : 'No',
                'Status': c.status,
                'Provider': c.provider,
                'Rate Source': c.rateSource,
              }))}
              title="Currencies Report"
              filenamePrefix="fx-currencies"
              isDark={isDark}
              addNotification={addNotification}
              buttonClassName="premium-btn"
              buttonStyle={styles.btnOutline}
            />
            <button className="premium-btn" style={styles.btnOutline} onClick={() => handlePrint({ type: 'list', items: filteredCurrencies, title: 'Currencies Report' })}>
              <FontAwesomeIcon icon={faPrint} />{t('Print')}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="premium-card glass-card mb-4" style={styles.filterCard}>
        <div className="row g-2 align-items-center">
          <div className="col-6 col-md-3">
            <div className="input-group input-group-sm" style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${borderColor}`, transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}>
              <span className="input-group-text bg-transparent border-0" style={{ color: mutedColor, padding: '0.35rem 0.6rem' }}>
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '0.7rem' }} />
              </span>
              <input
                type="text"
                className="form-control form-control-sm border-0 bg-transparent"
                placeholder={t('Search currencies...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ color: textColor, fontSize: '0.78rem', padding: '0.35rem 0.5rem', boxShadow: 'none', outline: 'none' }}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="premium-input"
              style={styles.select}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">{t('All Status')}</option>
              <option value="Active">{t('Active')}</option>
              <option value="Inactive">{t('Inactive')}</option>
              <option value="Archived">{t('Archived')}</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="premium-input"
              style={styles.select}
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}>
              <option value="all">{t('All Countries')}</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: mutedColor, fontSize: '0.78rem' }}>
              <input
                type="checkbox"
                checked={baseOnly}
                onChange={e => setBaseOnly(e.target.checked)}
                style={{ accentColor: '#8b5cf6', width: 16, height: 16, cursor: 'pointer' }}
              />
              <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.65rem', color: '#f59e0b' }} />
              {t('Base Currency Only')}
            </label>
          </div>
          <div className="col-12 col-md-3 text-end">
            <span style={{ fontSize: '0.72rem', color: mutedColor }}>
              <FontAwesomeIcon icon={faFilter} className="me-1" />
              {filteredCurrencies.length} {t('currencies found')}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="premium-card glass-card" style={styles.tableCard}>
        <div className="table-responsive mc-table-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="mc-table table align-middle mb-0" style={{ minWidth: '920px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.25rem', whiteSpace: 'nowrap' }}>{t('Currency Code')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Currency Name')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Country')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Flag')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Symbol')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('ISO Code')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Decimal')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Exchange Rate')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Base')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Status')}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('Created')}</th>
                <th style={{ paddingRight: '1.25rem', whiteSpace: 'nowrap' }}>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((currency) => (
                <tr key={currency.id} className="enter-anim">
                  <td style={{ paddingLeft: '1.25rem', fontWeight: 700, color: '#3b82f6', fontSize: '0.78rem', padding: '10px 12px', whiteSpace: 'nowrap', minWidth: '112px' }}>
                    {currency.code}
                  </td>
                  <td style={styles.td}>{currency.name}</td>
                  <td style={styles.td}>
                    <span style={{ fontSize: '0.72rem', color: mutedColor }}>{currency.country}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: '1.1rem' }}>{currency.flag}</span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 600 }}>{currency.symbol}</td>
                  <td style={styles.td}>
                    <span style={{ fontSize: '0.72rem', color: mutedColor }}>{currency.isoCode}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>{currency.decimalPlaces}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 500 }}>
                    {currency.exchangeRate.toFixed(4)}
                  </td>
                  <td style={styles.td}>
                    {currency.isBase ? (
                      <span style={styles.badge(isDark ? '#1e3a5f' : '#dbeafe', isDark ? '#60a5fa' : '#1d4ed8')}>
                        <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.55rem', marginRight: '0.25rem' }} />
                        {t('Base')}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: mutedColor }}>&mdash;</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span className="premium-badge" style={getStatusBadge(currency.status)}>
                      <span className="badge-dot" style={{ background: getStatusDot(currency.status) }} />
                      {currency.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontSize: '0.72rem', color: mutedColor }}>{currency.createdAt}</td>
                  <td style={{ paddingRight: '1.25rem', padding: '10px 12px', whiteSpace: 'nowrap', minWidth: '250px' }}>
                    <div className="d-flex gap-1" style={{ minWidth: '240px' }}>
                      <button className="premium-action-btn" style={{ color: '#3b82f6', background: isDark ? '#1e293b' : '#dbeafe' }} title={t('View')}
                        onClick={() => setViewingCurrency(currency)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="premium-action-btn" style={{ color: '#64748b', background: isDark ? '#1e293b' : '#e2e8f0' }} title={t('Print')}
                        onClick={() => handlePrint({ type: 'single', currency })}>
                        <FontAwesomeIcon icon={faPrint} />
                      </button>
                      <button className="premium-action-btn" style={{ color: '#8b5cf6', background: isDark ? '#1e293b' : '#ede9fe' }} title={t('Copy')}
                        onClick={() => handleCopyCurrency(currency)}>
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                      <button className="premium-action-btn" style={{ color: '#f59e0b', background: isDark ? '#1e293b' : '#fef3c7' }} title={t('Edit')}
                        onClick={() => handleOpenForm(currency)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="premium-action-btn" style={{ color: '#f97316', background: isDark ? '#1e293b' : '#ffedd5' }} title={t('Deactivate')}
                        onClick={() => handleSetCurrencyStatus(currency, 'Inactive')}>
                        <FontAwesomeIcon icon={faBan} />
                      </button>
                      <button className="premium-action-btn" style={{ color: '#06b6d4', background: isDark ? '#1e293b' : '#cffafe' }} title={t('Archive')}
                        onClick={() => handleSetCurrencyStatus(currency, 'Archived')}>
                        <FontAwesomeIcon icon={faArchive} />
                      </button>
                      {currency.status !== 'Active' && (
                        <button className="premium-action-btn" style={{ color: '#10b981', background: isDark ? '#1e293b' : '#d1fae5' }} title={t('Activate')}
                          onClick={() => handleSetCurrencyStatus(currency, 'Active')}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      )}
                      <button className="premium-action-btn" style={{ color: '#ef4444', background: isDark ? '#1e293b' : '#fce7e7' }} title={t('Delete')}
                        onClick={() => setDeletingCurrency(currency)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCurrencies.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '3rem 1rem', color: mutedColor, fontSize: '0.8rem' }}>
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    {t('No currencies found matching your filters.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <DialogBox
        show={showForm}
        onClose={handleCloseForm}
        title={editingCurrency ? t('Edit Currency') : t('Add New Currency')}
        size="xl"
        showClose={true}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button className="premium-btn" style={styles.btnOutline} onClick={handleCloseForm}>
              <FontAwesomeIcon icon={faTimes} />{t('Cancel')}
            </button>
            <button className="premium-btn" style={{ ...styles.btnPrimary, background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={handleSaveCurrency}>
              <FontAwesomeIcon icon={faSave} />{editingCurrency ? t('Update Currency') : t('Save Currency')}
            </button>
          </div>
        }
      >
        {/* Section 1: General Information */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
          borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem',
          border: `1px solid ${borderColor}`,
        }}>
          <div className="section-header">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #3b82f6, #2563eb)' }} />
            <h6 style={styles.sectionTitle}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#3b82f6', fontSize: '0.8rem', marginRight: '0.5rem' }} />
              {t('General Information')}
            </h6>
          </div>
          <div className="row">
            <div className="col-md-4">
              {renderFormField(t('Currency Name'), 'currencyName', 'text', {
                value: editingCurrency?.name || '',
                placeholder: 'e.g. US Dollar',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Currency Code'), 'currencyCode', 'text', {
                value: editingCurrency?.code || '',
                placeholder: 'e.g. USD',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Currency Symbol'), 'currencySymbol', 'text', {
                value: editingCurrency?.symbol || '',
                placeholder: 'e.g. $',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('ISO Code'), 'isoCode', 'text', {
                value: editingCurrency?.isoCode || '',
                placeholder: 'e.g. 840',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Country'), 'country', 'select', {
                value: editingCurrency?.country || '',
                options: [
                  { value: '', label: t('Select Country') },
                  ...countries.map(c => ({ value: c, label: c })),
                ],
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Country Flag'), 'countryFlag', 'text', {
                value: editingCurrency?.flag || '',
                placeholder: 'e.g. 🇺🇸',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Decimal Precision'), 'decimalPrecision', 'number', {
                value: editingCurrency?.decimalPlaces || 2,
                placeholder: 'e.g. 2',
              })}
            </div>
            <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.85rem' }}>
              {renderFormField(t('Base Currency'), 'isBase', 'checkbox', {
                checked: editingCurrency?.isBase || false,
                checkboxLabel: t('Set as base currency for the organization'),
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Exchange Rate'), 'exchangeRate', 'number', {
                value: editingCurrency?.exchangeRate || '',
                placeholder: 'e.g. 278.50',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Status'), 'status', 'select', {
                value: editingCurrency?.status || 'Active',
                options: [
                  { value: 'Active', label: t('Active') },
                  { value: 'Inactive', label: t('Inactive') },
                  { value: 'Archived', label: t('Archived') },
                ],
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Default Exchange Provider'), 'exchangeProvider', 'text', {
                value: editingCurrency?.provider || '',
                placeholder: 'e.g. Reuters, ECB',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Exchange Rate Source'), 'rateSource', 'select', {
                value: editingCurrency?.rateSource || '',
                options: [
                  { value: '', label: t('Select Source') },
                  { value: 'Interbank', label: 'Interbank' },
                  { value: 'Central Bank', label: 'Central Bank' },
                  { value: 'Market', label: 'Market' },
                  { value: 'Manual', label: 'Manual' },
                ],
              })}
            </div>
            <div className="col-12">
              {renderFormField(t('Description'), 'description', 'textarea', {
                value: editingCurrency?.description || '',
                placeholder: t('Enter currency description, notes, or remarks...'),
              })}
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${borderColor}, transparent)`, margin: '1.25rem 0' }} />

        {/* Section 2: Advanced Currency Settings */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
          borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem',
          border: `1px solid ${borderColor}`,
        }}>
          <div className="section-header">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #7c3aed)' }} />
            <h6 style={styles.sectionTitle}>
              <FontAwesomeIcon icon={faCog} style={{ color: '#8b5cf6', fontSize: '0.8rem', marginRight: '0.5rem' }} />
              {t('Advanced Currency Settings')}
            </h6>
          </div>
          <div className="row">
            <div className="col-md-4">
              {renderFormField('', 'autoUpdateRates', 'checkbox', {
                checked: editingCurrency?.autoUpdate || true,
                checkboxLabel: t('Auto Update Rates'),
              })}
            </div>
            <div className="col-md-4">
              {renderFormField('', 'manualOverride', 'checkbox', {
                checked: editingCurrency?.manualOverride || false,
                checkboxLabel: t('Manual Override'),
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Default Accounting Currency'), 'defaultAccountingCurrency', 'select', {
                value: editingCurrency?.defaultAccountingCurrency ? 'yes' : 'no',
                options: [
                  { value: 'no', label: t('No') },
                  { value: 'yes', label: t('Yes') },
                ],
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Currency Formatting'), 'currencyFormatting', 'select', {
                value: editingCurrency?.currencyFormat || '1,234.56',
                options: [
                  { value: '1,234.56', label: '1,234.56' },
                  { value: '1.234,56', label: '1.234,56' },
                  { value: '1 234,56', label: '1 234,56' },
                  { value: '1\'234.56', label: "1'234.56" },
                  { value: '1,23,456.78', label: '1,23,456.78' },
                ],
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Negative Format'), 'negativeFormat', 'select', {
                value: editingCurrency?.negativeFormat || '-1,234.56',
                options: [
                  { value: '-1,234.56', label: '-1,234.56' },
                  { value: '(1,234.56)', label: '(1,234.56)' },
                  { value: '1,234.56-', label: '1,234.56-' },
                ],
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Thousands Separator'), 'thousandsSeparator', 'text', {
                value: editingCurrency?.thousandsSep || ',',
                placeholder: 'e.g. , or .',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Decimal Separator'), 'decimalSeparator', 'text', {
                value: editingCurrency?.decimalSep || '.',
                placeholder: 'e.g. . or ,',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Exchange Rate Precision'), 'exchangeRatePrecision', 'number', {
                value: editingCurrency?.ratePrecision || 6,
                placeholder: 'e.g. 6',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Country Localization'), 'countryLocalization', 'text', {
                value: editingCurrency?.localization || '',
                placeholder: 'e.g. en-US',
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Regional Standards'), 'regionalStandards', 'select', {
                value: editingCurrency?.regionalStandards || '',
                options: [
                  { value: '', label: t('Select Standard') },
                  { value: 'IFRS', label: 'IFRS' },
                  { value: 'GAAP', label: 'GAAP' },
                  { value: 'UK GAAP', label: 'UK GAAP' },
                  { value: 'JGAAP', label: 'JGAAP' },
                  { value: 'Ind AS', label: 'Ind AS' },
                  { value: 'SOCPA', label: 'SOCPA' },
                  { value: 'AASB', label: 'AASB' },
                  { value: 'SFRS', label: 'SFRS' },
                ],
              })}
            </div>
            <div className="col-md-4">
              {renderFormField(t('Approval Workflow'), 'approvalWorkflow', 'select', {
                value: editingCurrency?.approvalWorkflow || 'Standard',
                options: [
                  { value: 'Standard', label: t('Standard') },
                  { value: 'Strict', label: t('Strict') },
                  { value: 'Restricted', label: t('Restricted') },
                ],
              })}
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${borderColor}, transparent)`, margin: '1.25rem 0' }} />

        {/* Section 3: Exchange Provider Info */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
          borderRadius: '12px', padding: '1.25rem',
          border: `1px solid ${borderColor}`,
        }}>
          <div className="section-header">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #059669)' }} />
            <h6 style={styles.sectionTitle}>
              <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#10b981', fontSize: '0.8rem', marginRight: '0.5rem' }} />
              {t('Exchange Rate Configuration')}
            </h6>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FontAwesomeIcon icon={faUniversity} style={{ color: '#10b981', fontSize: '0.7rem' }} />
                <span style={{ fontSize: '0.75rem', color: mutedColor }}>{t('Provider API Status')}:</span>
                <span className="premium-badge" style={{ background: isDark ? '#064e3b' : '#d1fae5', color: isDark ? '#6ee7b7' : '#065f46' }}>
                  <span className="badge-dot" style={{ background: '#10b981' }} />
                  {t('Connected')}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#f59e0b', fontSize: '0.7rem' }} />
                <span style={{ fontSize: '0.75rem', color: mutedColor }}>{t('Last Rate Update')}:</span>
                <span style={{ fontSize: '0.75rem', color: textColor, fontWeight: 600 }}>{currenciesData.length > 0 ? currenciesData[0].createdAt : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogBox>

      {/* Delete Currency Confirmation */}
      <DialogBox.Confirm
        show={!!deletingCurrency}
        onClose={() => setDeletingCurrency(null)}
        onConfirm={handleConfirmDeleteCurrency}
        title="Delete Currency"
        message={`Move currency "${deletingCurrency?.code} — ${deletingCurrency?.name}" to trash? You can restore it later from the FX Trash tab.`}
        confirmLabel="Move to Trash"
        variant="danger"
      />

      {/* View Currency Modal */}
      <DialogBox
        show={!!viewingCurrency}
        onClose={() => setViewingCurrency(null)}
        title={`Currency Details — ${viewingCurrency?.code || ''} ${viewingCurrency?.flag || ''}`}
        size="lg"
        showClose={true}
      >
        {viewingCurrency && (
          <div>
            <div className="row g-3">
              {[
                ['Currency Code', viewingCurrency.code],
                ['Currency Name', viewingCurrency.name],
                ['Country', viewingCurrency.country],
                ['Symbol', viewingCurrency.symbol],
                ['ISO Code', viewingCurrency.isoCode],
                ['Decimal Places', viewingCurrency.decimalPlaces],
                ['Exchange Rate', viewingCurrency.exchangeRate.toFixed(4)],
                ['Base Currency', viewingCurrency.isBase ? 'Yes' : 'No'],
                ['Status', viewingCurrency.status],
                ['Provider', viewingCurrency.provider || '—'],
                ['Rate Source', viewingCurrency.rateSource || '—'],
                ['Auto Update', viewingCurrency.autoUpdate ? 'Enabled' : 'Disabled'],
                ['Manual Override', viewingCurrency.manualOverride ? 'Enabled' : 'Disabled'],
                ['Default Accounting', viewingCurrency.defaultAccountingCurrency ? 'Yes' : 'No'],
                ['Currency Format', viewingCurrency.currencyFormat || '—'],
                ['Localization', viewingCurrency.localization || '—'],
                ['Regional Standards', viewingCurrency.regionalStandards || '—'],
                ['Approval Workflow', viewingCurrency.approvalWorkflow || '—'],
                ['Created', viewingCurrency.createdAt],
              ].map(([label, value]) => (
                <div className="col-md-4" key={label}>
                  <label style={styles.formLabel}>{label}</label>
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      background: isDark ? '#1a1d29' : '#f8fafc',
                      border: `1px solid ${borderColor}`,
                      fontSize: '0.8rem',
                      color: textColor,
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
              <div className="col-12">
                <label style={styles.formLabel}>Description</label>
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: isDark ? '#1a1d29' : '#f8fafc',
                    border: `1px solid ${borderColor}`,
                    fontSize: '0.8rem',
                    color: textColor,
                  }}
                >
                  {viewingCurrency.description || '—'}
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
              <button className="premium-btn" style={styles.btnOutline} onClick={() => handlePrint({ type: 'single', currency: viewingCurrency })}>
                <FontAwesomeIcon icon={faPrint} />{t('Print')}
              </button>
              <button className="premium-btn" style={styles.btnOutline} onClick={() => handleCopyCurrency(viewingCurrency)}>
                <FontAwesomeIcon icon={faCopy} />{t('Copy')}
              </button>
              <button className="premium-btn" style={styles.btnOutline} onClick={() => { handleOpenForm(viewingCurrency); setViewingCurrency(null); }}>
                <FontAwesomeIcon icon={faEdit} />{t('Edit')}
              </button>
              <button className="premium-btn" style={{ ...styles.btnPrimary, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }} onClick={() => setViewingCurrency(null)}>
                <FontAwesomeIcon icon={faTimes} />{t('Close')}
              </button>
            </div>
          </div>
        )}
      </DialogBox>

      {/* Print Area */}
      {printPayload && (
        <div id="fx-print-area">
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>
              {printPayload.type === 'single' ? 'Currency Details' : (printPayload.title || 'Currencies Report')}
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              Generated: {new Date().toLocaleString()}
            </div>
          </div>
          {printPayload.type === 'single' ? (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {(() => {
                  const c = printPayload.currency;
                  const rows = [
                    ['Currency Code', c.code],
                    ['Currency Name', c.name],
                    ['Country', c.country],
                    ['Symbol', c.symbol],
                    ['ISO Code', c.isoCode],
                    ['Decimal Places', c.decimalPlaces],
                    ['Exchange Rate', c.exchangeRate.toFixed(4)],
                    ['Base Currency', c.isBase ? 'Yes' : 'No'],
                    ['Status', c.status],
                    ['Provider', c.provider || '—'],
                    ['Rate Source', c.rateSource || '—'],
                    ['Auto Update', c.autoUpdate ? 'Enabled' : 'Disabled'],
                    ['Manual Override', c.manualOverride ? 'Enabled' : 'Disabled'],
                    ['Default Accounting', c.defaultAccountingCurrency ? 'Yes' : 'No'],
                    ['Currency Format', c.currencyFormat || '—'],
                    ['Negative Format', c.negativeFormat || '—'],
                    ['Localization', c.localization || '—'],
                    ['Regional Standards', c.regionalStandards || '—'],
                    ['Approval Workflow', c.approvalWorkflow || '—'],
                    ['Created', c.createdAt],
                  ];
                  return rows.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', background: '#f8fafc', fontWeight: 600, width: '40%' }}>{k}</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{v}</td>
                    </tr>
                  ));
                })()}
                <tr>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', background: '#f8fafc', fontWeight: 600, width: '40%' }}>Description</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{printPayload.currency.description || '—'}</td>
                </tr>
              </table>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Code', 'Name', 'Country', 'Symbol', 'ISO Code', 'Exchange Rate', 'Base', 'Status', 'Created'].map(h => (
                    <th key={h} style={{ border: '1px solid #cbd5e1', padding: '6px 8px', background: '#f1f5f9', textAlign: 'left', fontSize: '11px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(printPayload.items || []).map((c) => (
                  <tr key={c.id}>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 600 }}>{c.code}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.name}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.country}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.symbol}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.isoCode}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'right' }}>{c.exchangeRate.toFixed(4)}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.isBase ? 'Yes' : 'No'}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.status}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{c.createdAt}</td>
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

export default FxCurrencies;
