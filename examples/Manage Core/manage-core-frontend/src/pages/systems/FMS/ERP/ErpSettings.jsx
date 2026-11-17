import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatedCounter, MiniSparkline, EnableDisableButton } from '../../../../components/common';
import { getAccountingSettings, saveAccountingSettings, getAuditLogs } from '../../../../api/fms';
import {
  faSave, faRotateLeft, faEye, faDownload, faUpload,
  faSliders, faBuilding, faCheckCircle,
  faUserShield, faClock, faGlobe, faFileSignature,
  faBuildingColumns, faCoins, faTriangleExclamation,
  faHistory, faDatabase, faExchangeAlt, faListAlt,
  faBell, faCalendarDays, faScaleBalanced, faArrowUp,
  faArrowDown, faMinus, faInfoCircle,
  faCheck, faTimes, faSearch,
  faUndo, faCog, faFileInvoice, faPercent, faLink, faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';

const ErpSettings = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const colors = {
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
  };

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showFooterExportDropdown, setShowFooterExportDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const footerInputRef = useRef(null);
  const [auditLogsList, setAuditLogsList] = useState([
    { id: 'a1', by: 'CFO Office', param: 'baseCurrency', old: 'EUR', newVal: 'USD', time: '2026-07-02 16:40' },
    { id: 'a2', by: 'Compliance Admin', param: 'taxLock', old: 'Disabled', newVal: 'Enabled', time: '2026-07-01 10:15' },
  ]);

  const TEMPLATE_TYPES = [
    { id: 'invoice', label: 'Invoice Template', icon: faFileInvoice, desc: 'Company invoice layout / letterhead' },
    { id: 'quotation', label: 'Quotation Template', icon: faFileInvoice, desc: 'Sales quotation document' },
    { id: 'purchase', label: 'Purchase Order Template', icon: faFileInvoice, desc: 'PO / purchase order layout' },
    { id: 'credit', label: 'Credit Note Template', icon: faFileInvoice, desc: 'Credit note document' },
    { id: 'receipt', label: 'Receipt Template', icon: faFileInvoice, desc: 'Payment receipt layout' },
    { id: 'report', label: 'Financial Report Template', icon: faFileUpload, desc: 'Custom report header/footer' },
  ];
  const [enabledTemplates, setEnabledTemplates] = useState({});

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings(prev => ({ ...prev, companyLogo: reader.result }));
      addNotification(`Company logo uploaded: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFooterUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings(prev => ({ ...prev, footerLogo: reader.result }));
      addNotification(`Footer image uploaded: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeLogo = () => {
    setSettings(prev => ({ ...prev, companyLogo: null }));
    addNotification('Company logo removed.', 'info');
  };

  const removeFooter = () => {
    setSettings(prev => ({ ...prev, footerLogo: null }));
    addNotification('Footer image removed.', 'info');
  };

  const [settings, setSettings] = useState({
    baseCurrency: 'USD',
    decimalSeparator: '.',
    thousandSeparator: ',',
    currencyPosition: 'Before',
    currencyPrecision: '2',
    exchangeRateIntegration: 'Oanda Live API',
    fiscalYearStart: 'January',
    taxMethod: 'Exclusive Tax',
    decimalPlaces: '2',
    retainedEarningsAccount: '3001-01 - Retained Earnings Control',
    plClosingAccount: '9999-99 - Year-End Closing Account',
    accountingStatus: 'Active',

    companyLogo: null,
    footerLogo: null,
    companyName: 'ManageCore Global Corporate Ltd',
    ntn: 'NTN-8829-1094',
    strn: 'STRN-9910-GST',
    email: 'finance@managecore.com',
    phone: '+1 (555) 234-5678',
    website: 'https://finance.managecore.com',
    address: 'HQ Dublin Facility, Suite 400, Ireland',
    invoiceFooter: 'Please pay within terms. Subject to late payment ledger interest fees.',
    salesInvoicePrefix: 'INV-2026-',
    purchaseInvoicePrefix: 'PUR-',
    quotationPrefix: 'QTN-',
    creditNotePrefix: 'CRN-',
    debitNotePrefix: 'DBN-',
    deliveryNotePrefix: 'DEL-',
    jvPrefix: 'JV-',
    pvPrefix: 'PAY-',
    rvPrefix: 'REC-',
    numberFormat: 'Financial Year Based',

    requireJournalApproval: true,
    lockPosted: true,
    allowNegativeCash: false,
    autoPost: true,
    multiCurrency: true,
    costCenters: true,
    budgetControl: true,
    auditMode: true,

    futurePostingRule: 'Block future postings > 30 days',
    backdatedRule: 'Require manager approval for > 7 days',
    fiscalYearLock: false,
    periodLock: false,
    taxLock: true,
    exchangeRateLock: false,
    approvalThreshold: '50000',
    suspiciousTxnAlert: true,
    duplicateDetection: true,

    defaultPaymentTerms: '30 Days',
    dueDateCalculation: 'Invoice Date',
    roundingMethod: 'Nearest',

    salesAccount: '4001-01 - Software Sales Revenue',
    purchaseAccount: '5001-01 - Vendor Cost of Goods',
    cashAccount: '1001-01 - Cash Vault Dublin',
    bankAccount: '1002-01 - Silicon Valley Bank',
    taxAccount: '2001-01 - VAT Output Account',
    discountAccount: '4005-01 - Sales Discounts',
    exchangeGain: '8001-01 - Realized FX Gain',
    exchangeLoss: '8002-01 - Realized FX Loss',

    notifyFiscalYear: true,
    notifyLocked: true,
    notifyLargeTxn: true,
    notifyApproval: true,
    emailNotifications: true,
    systemNotifications: true,

    internalNotes: 'All changes to Chart of Accounts structure require dual checker verification.'
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAccountingSettings();
      const data = res.data?.data;
      const tplEnabled = res.data?.enabledTemplates || {};
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
      setEnabledTemplates(tplEnabled);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
      addNotification?.(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const kpiWidgets = useMemo(() => [
    { label: 'Current Fiscal Year', val: settings.fiscalYearStart === 'January' ? 'CY 2026' : 'FY 2026-27', icon: faCalendarDays, color: colors.primary, trendVal: 'Active' },
    { label: 'Base Currency', val: settings.baseCurrency, icon: faGlobe, color: colors.success, trendVal: 'USD' },
    { label: 'Posting Status', val: 'Online', icon: faCheckCircle, color: colors.success, trendVal: 'Live' },
    { label: 'Accounting Health', val: '100% Optimal', icon: faCoins, color: colors.info, trendVal: 'Excellent' },
    { label: 'Locked Period', val: 'FY25 Locked', icon: faUserShield, color: colors.danger, trendVal: 'Locked' },
    { label: 'Pending Approvals', val: '4 Journals', icon: faClock, color: colors.warning, trendVal: '-2' },
    { label: 'Exchange Rate', val: 'Auto-Update', icon: faExchangeAlt, color: colors.purple, trendVal: 'Synced' },
    { label: 'Tax Status', val: 'VAT/GST Active', icon: faPercent, color: colors.primary, trendVal: 'Compliant' },
    { label: 'Audit Status', val: 'Audit Ready', icon: faHistory, color: colors.info, trendVal: 'Prepared' },
    { label: 'Budget Status', val: 'Compliant', icon: faScaleBalanced, color: colors.success, trendVal: 'On Track' },
  ], [settings.fiscalYearStart, settings.baseCurrency, colors]);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...settings, enabledTemplates };
      await saveAccountingSettings(payload);
      if (addNotification) {
        addNotification('Accounting Settings configuration saved successfully.', 'success');
      }
    } catch (err) {
      addNotification?.(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = (format) => {
    setShowExportDropdown(false);
    setShowFooterExportDropdown(false);
    
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", "ManageCore_AccountingSettings.json");
      dlAnchor.click();
      if (addNotification) addNotification('Exported settings as JSON successfully.', 'success');
    } else if (format === 'sql') {
      const sqlContent = `-- ManageCore Accounting Configuration Dump\n-- Generated: ${new Date().toISOString()}\n\nCREATE TABLE IF NOT EXISTS ams_settings (\n  param_key VARCHAR(100) PRIMARY KEY,\n  param_value TEXT\n);\n\nINSERT INTO ams_settings (param_key, param_value) VALUES\n${Object.entries(settings).map(([k, v]) => `('${k}', '${String(v).replace(/'/g, "''")}')`).join(',\n')}\nON CONFLICT(param_key) DO UPDATE SET param_value = EXCLUDED.param_value;`;
      const dataStr = "data:text/sql;charset=utf-8," + encodeURIComponent(sqlContent.trim());
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", "ManageCore_AccountingSettings.sql");
      dlAnchor.click();
      if (addNotification) addNotification('Exported settings as SQL Dump successfully.', 'success');
    } else if (format === 'excel') {
      const csvRows = [['Accounting Setting Parameter', 'Value'], ...Object.entries(settings).map(([k, v]) => [k, String(v)])];
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", encodeURI(csvContent));
      dlAnchor.setAttribute("download", "ManageCore_AccountingSettings.csv");
      dlAnchor.click();
      if (addNotification) addNotification('Exported settings as Excel CSV successfully.', 'success');
    } else if (format === 'word') {
      const docContent = `ManageCore Accounting Configuration Center Report\n==================================================\nGenerated on: ${new Date().toLocaleDateString()}\n\n${Object.entries(settings).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(docContent);
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", "ManageCore_AccountingSettings.doc");
      dlAnchor.click();
      if (addNotification) addNotification('Exported settings as Word Doc successfully.', 'success');
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>ManageCore Accounting Configuration Center Report</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #1e293b; }
              h2 { color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
              th { background-color: #f1f5f9; }
            </style>
          </head>
          <body>
            <h2>ManageCore Accounting Configuration Report</h2>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(settings).map(([k, v]) => `
                  <tr>
                    <td><strong>${k}</strong></td>
                    <td>${v}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
      if (addNotification) addNotification('Settings PDF report sent to printer.', 'success');
    }
  };

  const handleImportConfig = (e) => {
    const fileReader = new FileReader();
    if (!e.target.files || e.target.files.length === 0) return;
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === 'object') {
          setSettings(prev => ({ ...prev, ...parsed }));
          if (addNotification) {
            addNotification('Accounting Settings imported successfully.', 'success');
          }
        } else {
          if (addNotification) {
            addNotification('Invalid settings file format.', 'error');
          }
        }
      } catch (err) {
        if (addNotification) {
          addNotification('Failed to parse settings file.', 'error');
        }
      }
    };
  };

  const handleRollback = (log) => {
    const param = log.param;
    const oldVal = log.old;
    let finalVal = oldVal;
    if (oldVal === 'Enabled' || oldVal === 'true' || oldVal === true) finalVal = true;
    else if (oldVal === 'Disabled' || oldVal === 'false' || oldVal === false) finalVal = false;
    
    setSettings(prev => ({ ...prev, [param]: finalVal }));
    if (addNotification) {
      addNotification(`Parameter "${param}" rolled back to "${oldVal}" successfully.`, 'success');
    }
  };

  const sections = [
    { id: 'general', label: 'General Accounting', icon: faSliders },
    { id: 'company', label: 'Invoice Company Info', icon: faBuilding },
    { id: 'rules', label: 'Accounting Rules', icon: faCheckCircle },
    { id: 'controls', label: 'Financial Controls', icon: faUserShield },
    { id: 'preferences', label: 'Accounting Preferences', icon: faListAlt },
    { id: 'notifications', label: 'Notification Settings', icon: faBell },
    { id: 'security', label: 'Security & Access', icon: faUserShield },
    { id: 'audit', label: 'Audit Logs', icon: faHistory },
    { id: 'templates', label: 'Template Settings', icon: faFileUpload },
  ];

  return (
    <ErpPageShell
      icon={faBuildingColumns}
      title="Accounting Configuration Center"
      description="Configure base currency settings, company registrations, invoice prefix codes, accounting rules, financial controls, and compliance parameters."
      action={
        <div className="d-flex gap-2 mt-0" style={{ flexShrink: 0 }}>
          <button onClick={handleSave} disabled={isSaving} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={isSaving ? faRotateLeft : faSave} className={isSaving ? 'fa-spin' : ''} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          <button className="btn btn-sm premium-btn" onClick={() => setShowPreviewModal(true)} style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
            <FontAwesomeIcon icon={faEye} className="me-1" /> Preview
          </button>
          <div className="position-relative">
            <button type="button" className="btn btn-sm premium-btn" onClick={() => setShowExportDropdown(!showExportDropdown)} style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
              <FontAwesomeIcon icon={faDownload} className="me-1" /> Export <span style={{ fontSize: '0.65rem' }}>▼</span>
            </button>
            {showExportDropdown && (
              <div className="position-absolute end-0 mt-1 card shadow border-0 p-1" style={{ zIndex: 100, minWidth: '120px', backgroundColor: isDark ? '#1e293b' : '#ffffff', border: `1px solid ${borderColor}` }}>
                {['excel', 'word', 'pdf', 'json', 'sql'].map(fmt => (
                  <button key={fmt} type="button" className="btn btn-xs text-start px-2 py-1.5 rounded-3 border-0" style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: textColor, background: 'transparent' }} onClick={() => handleExport(fmt)}>
                    {fmt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} trend="up" trendVal={w.trendVal} isDark={isDark} colClass="col-xl-2 col-lg-3 col-md-4 col-6" />
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="glass-card" style={{ borderRadius: '16px', padding: '0.75rem' }}>
            <div className="d-flex flex-column gap-1">
              <div style={{ padding: '0.5rem 0.75rem', color: mutedColor, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <FontAwesomeIcon icon={faListAlt} className="me-1" /> Configuration Sections
              </div>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`nav-btn d-flex align-items-center gap-3 px-3 py-2 ${activeSection === section.id ? 'active' : ''}`}
                  style={{
                    borderRadius: '10px', fontSize: '0.78rem', border: 'none', position: 'relative', overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    color: activeSection === section.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                    background: activeSection === section.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                    boxShadow: activeSection === section.id ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: activeSection === section.id ? 'rgba(255,255,255,0.15)' : `${colors.primary}10`,
                    color: activeSection === section.id ? '#fff' : colors.primary,
                    fontSize: '0.75rem',
                  }}>
                    <FontAwesomeIcon icon={section.icon} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: activeSection === section.id ? 600 : 400 }}>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem' }}>
            {activeSection === 'general' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faSliders} className="me-2" style={{ color: colors.primary }} />
                    General Accounting Configuration
                  </h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Base Currency</label>
                    <select className="form-select" value={settings.baseCurrency} onChange={e => handleInputChange('baseCurrency', e.target.value)}>
                      {['USD', 'EUR', 'GBP', 'AED', 'SAR', 'CAD', 'AUD', 'JPY', 'PKR'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Fiscal Year Start Month</label>
                    <select className="form-select" value={settings.fiscalYearStart} onChange={e => handleInputChange('fiscalYearStart', e.target.value)}>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Default Tax Method</label>
                    <select className="form-select" value={settings.taxMethod} onChange={e => handleInputChange('taxMethod', e.target.value)}>
                      {['Exclusive Tax', 'Inclusive Tax', 'No Tax', 'Mixed Tax'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Decimal Precision</label>
                    <input type="number" className="form-control" value={settings.decimalPlaces} onChange={e => handleInputChange('decimalPlaces', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Retained Earnings Account</label>
                    <select className="form-select" value={settings.retainedEarningsAccount} onChange={e => handleInputChange('retainedEarningsAccount', e.target.value)}>
                      <option>{settings.retainedEarningsAccount}</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Profit & Loss Closing Account</label>
                    <select className="form-select" value={settings.plClosingAccount} onChange={e => handleInputChange('plClosingAccount', e.target.value)}>
                      <option>{settings.plClosingAccount}</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Accounting Status</label>
                    <select className="form-select" value={settings.accountingStatus} onChange={e => handleInputChange('accountingStatus', e.target.value)}>
                      {['Active', 'Inactive', 'Maintenance Mode', 'Archived'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'company' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #06b6d4)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faBuilding} className="me-2" style={{ color: colors.success }} />
                    Invoice Company Information
                  </h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Company Legal Name</label>
                    <input type="text" className="form-control" value={settings.companyName} onChange={e => handleInputChange('companyName', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Company NTN</label>
                    <input type="text" className="form-control" value={settings.ntn} onChange={e => handleInputChange('ntn', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>STRN / GST Reg</label>
                    <input type="text" className="form-control" value={settings.strn} onChange={e => handleInputChange('strn', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Company Email</label>
                    <input type="email" className="form-control" value={settings.email} onChange={e => handleInputChange('email', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Company Phone</label>
                    <input type="text" className="form-control" value={settings.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Company Address</label>
                    <textarea rows="2" className="form-control" value={settings.address} onChange={e => handleInputChange('address', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Company Logo</label>
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" style={{ display: 'none' }} />
                    {settings.companyLogo ? (
                      <div className="d-flex align-items-center gap-3 p-3 rounded-3 border" style={{ borderColor: borderColor, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                        <img src={settings.companyLogo} alt="Company Logo" style={{ maxHeight: 56, maxWidth: 120, objectFit: 'contain', borderRadius: 6 }} />
                        <div className="flex-grow-1">
                          <div className="small fw-medium" style={{ color: textColor }}>Logo uploaded</div>
                          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={removeLogo} style={{ fontSize: '0.75rem' }}>Remove</button>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => logoInputRef.current?.click()} style={{ borderRadius: 8, fontSize: '0.75rem' }}>Change</button>
                      </div>
                    ) : (
                      <div
                        onClick={() => logoInputRef.current?.click()}
                        className="d-flex align-items-center justify-content-center gap-2 p-3 rounded-3 border cursor-pointer"
                        style={{ borderColor: borderColor, borderStyle: 'dashed', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}
                      >
                        <FontAwesomeIcon icon={faUpload} style={{ color: colors.primary }} />
                        <span className="small" style={{ color: mutedColor }}>Upload company logo</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Footer Image / Stamp</label>
                    <input type="file" ref={footerInputRef} onChange={handleFooterUpload} accept="image/*" style={{ display: 'none' }} />
                    {settings.footerLogo ? (
                      <div className="d-flex align-items-center gap-3 p-3 rounded-3 border" style={{ borderColor: borderColor, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                        <img src={settings.footerLogo} alt="Footer Image" style={{ maxHeight: 56, maxWidth: 120, objectFit: 'contain', borderRadius: 6 }} />
                        <div className="flex-grow-1">
                          <div className="small fw-medium" style={{ color: textColor }}>Footer image uploaded</div>
                          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={removeFooter} style={{ fontSize: '0.75rem' }}>Remove</button>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => footerInputRef.current?.click()} style={{ borderRadius: 8, fontSize: '0.75rem' }}>Change</button>
                      </div>
                    ) : (
                      <div
                        onClick={() => footerInputRef.current?.click()}
                        className="d-flex align-items-center justify-content-center gap-2 p-3 rounded-3 border cursor-pointer"
                        style={{ borderColor: borderColor, borderStyle: 'dashed', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}
                      >
                        <FontAwesomeIcon icon={faUpload} style={{ color: colors.primary }} />
                        <span className="small" style={{ color: mutedColor }}>Upload footer image / company stamp</span>
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Rich Text Invoice Footer (Terms & Bank details)</label>
                    <textarea rows="2" className="form-control" value={settings.invoiceFooter} onChange={e => handleInputChange('invoiceFooter', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <hr style={{ borderColor: borderColor, opacity: 0.5 }} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Sales Invoice Prefix</label>
                    <input type="text" className="form-control" value={settings.salesInvoicePrefix} onChange={e => handleInputChange('salesInvoicePrefix', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Purchase Invoice Prefix</label>
                    <input type="text" className="form-control" value={settings.purchaseInvoicePrefix} onChange={e => handleInputChange('purchaseInvoicePrefix', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Voucher Format</label>
                    <select className="form-select" value={settings.numberFormat} onChange={e => handleInputChange('numberFormat', e.target.value)}>
                      {['Auto Increment', 'Financial Year Based', 'Branch Based', 'Sequential'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'rules' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" style={{ color: colors.warning }} />
                    Accounting Rules
                  </h6>
                </div>
                <div className="d-flex flex-column gap-2">
                  {[
                    { id: 'requireJournalApproval', label: 'Require Journal Approval', desc: 'All manual journal entries require CFO validation before posting.' },
                    { id: 'lockPosted', label: 'Lock Posted Transactions', desc: 'Prevent modification or deletion of posted entries; require reversal journals.' },
                    { id: 'allowNegativeCash', label: 'Allow Negative Cash', desc: 'Warn and block transactions if ledger cash drops below zero.' },
                    { id: 'autoPost', label: 'Auto Post Transactions', desc: 'Automatically post approved sales invoices, payments, and entries to ledger.' },
                    { id: 'multiCurrency', label: 'Enable Multi Currency', desc: 'Unlock multi-currency adjustments, automated gains & losses calculation.' },
                    { id: 'costCenters', label: 'Enable Cost Centers', desc: 'Activate department, branch, and project cost tracking matrices.' },
                    { id: 'budgetControl', label: 'Enable Budget Control', desc: 'Warn or block postings that exceed cost center budget caps.' },
                    { id: 'auditMode', label: 'Enable Audit Mode', desc: 'Log modifications, approvals, IP allocations, and timestamps.' },
                  ].map(rule => (
                    <div key={rule.id} className="d-flex justify-content-between align-items-center px-3 py-2" style={{
                      borderRadius: '12px',
                      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)',
                      border: `1px solid ${borderColor}`,
                      transition: 'all 0.25s',
                    }}>
                      <div>
                        <label className="fw-semibold" style={{ color: textColor, fontSize: '0.82rem' }}>{rule.label}</label>
                        <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{rule.desc}</div>
                      </div>
                      <EnableDisableButton
                        checked={settings[rule.id]}
                        onClick={() => handleInputChange(rule.id, !settings[rule.id])}
                        label={rule.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'controls' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f43f5e, #ef4444)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faUserShield} className="me-2" style={{ color: colors.danger }} />
                    Financial Controls & Lock Rules
                  </h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Future Posting Rules</label>
                    <select className="form-select" value={settings.futurePostingRule} onChange={e => handleInputChange('futurePostingRule', e.target.value)}>
                      <option>Block future postings &gt; 30 days</option>
                      <option>Allow with warning</option>
                      <option>Disable locks</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Backdated Posting Rules</label>
                    <select className="form-select" value={settings.backdatedRule} onChange={e => handleInputChange('backdatedRule', e.target.value)}>
                      <option>Require manager approval for &gt; 7 days</option>
                      <option>Block all backdated entries</option>
                      <option>Allow free postings</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Large Transaction Threshold ($)</label>
                    <input type="number" className="form-control" value={settings.approvalThreshold} onChange={e => handleInputChange('approvalThreshold', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Safety Lock Options</label>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '10px', background: settings.fiscalYearLock ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#1e293b' : '#f8fafc'), color: settings.fiscalYearLock ? (isDark ? '#f87171' : '#dc2626') : textColor, border: `1px solid ${settings.fiscalYearLock ? (isDark ? '#7f1d1d' : '#fecaca') : borderColor}`, fontSize: '0.75rem' }} onClick={() => handleInputChange('fiscalYearLock', !settings.fiscalYearLock)}>
                        <FontAwesomeIcon icon={settings.fiscalYearLock ? faCheck : faTimes} className="me-1" />{settings.fiscalYearLock ? 'FY Locked' : 'Lock Fiscal Year'}
                      </button>
                      <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '10px', background: settings.taxLock ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#1e293b' : '#f8fafc'), color: settings.taxLock ? (isDark ? '#f87171' : '#dc2626') : textColor, border: `1px solid ${settings.taxLock ? (isDark ? '#7f1d1d' : '#fecaca') : borderColor}`, fontSize: '0.75rem' }} onClick={() => handleInputChange('taxLock', !settings.taxLock)}>
                        <FontAwesomeIcon icon={settings.taxLock ? faCheck : faTimes} className="me-1" />{settings.taxLock ? 'Tax Lock Active' : 'Lock Tax Fields'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faListAlt} className="me-2" style={{ color: colors.purple }} />
                    Accounting Preferences & Default Ledgers
                  </h6>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Default Payment Terms</label>
                    <select className="form-select" value={settings.defaultPaymentTerms} onChange={e => handleInputChange('defaultPaymentTerms', e.target.value)}>
                      {['Cash', '7 Days', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Rounding Method</label>
                    <select className="form-select" value={settings.roundingMethod} onChange={e => handleInputChange('roundingMethod', e.target.value)}>
                      {['Nearest', 'Up', 'Down', "Banker's Rounding"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <hr style={{ borderColor: borderColor, opacity: 0.5 }} />
                  </div>
                  <div className="col-12">
                    <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                      <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', height: '14px' }} />
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.82rem' }}>
                        <FontAwesomeIcon icon={faLink} className="me-2" style={{ color: colors.primary }} />
                        Standard Ledger Mappings
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Sales Account</label>
                    <select className="form-select" value={settings.salesAccount} onChange={e => handleInputChange('salesAccount', e.target.value)}>
                      <option>{settings.salesAccount}</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Purchase Account</label>
                    <select className="form-select" value={settings.purchaseAccount} onChange={e => handleInputChange('purchaseAccount', e.target.value)}>
                      <option>{settings.purchaseAccount}</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Default Bank Account</label>
                    <select className="form-select" value={settings.bankAccount} onChange={e => handleInputChange('bankAccount', e.target.value)}>
                      <option>{settings.bankAccount}</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium" style={{ color: textColor }}>Default Cash Account</label>
                    <select className="form-select" value={settings.cashAccount} onChange={e => handleInputChange('cashAccount', e.target.value)}>
                      <option>{settings.cashAccount}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #06b6d4, #3b82f6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faBell} className="me-2" style={{ color: colors.info }} />
                    Notification Matrix Settings
                  </h6>
                </div>
                <div className="d-flex flex-column gap-2">
                  {[
                    { id: 'notifyFiscalYear', label: 'Notify on Fiscal Year Closing', desc: 'Trigger alerts to auditors upon period or fiscal year lock events.' },
                    { id: 'notifyLocked', label: 'Notify on Locked Period modification attempts', desc: 'Trigger compliance warnings if locked balances are altered.' },
                    { id: 'notifyLargeTxn', label: 'Notify on Large Transaction alerts', desc: 'Send push approvals if ledger value exceeds threshold limits.' },
                    { id: 'notifyApproval', label: 'Notify on Pending Approvals queue', desc: 'Email managers daily digest reports for journals pending validation.' },
                  ].map(notif => (
                    <div key={notif.id} className="d-flex justify-content-between align-items-center px-3 py-2" style={{ borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)', border: `1px solid ${borderColor}`, transition: 'all 0.25s' }}>
                      <div>
                        <label className="fw-semibold" style={{ color: textColor, fontSize: '0.82rem' }}>{notif.label}</label>
                        <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{notif.desc}</div>
                      </div>
                      <EnableDisableButton
                        checked={settings[notif.id]}
                        onClick={() => handleInputChange(notif.id, !settings[notif.id])}
                        label={notif.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #6366f1)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faUserShield} className="me-2" style={{ color: colors.purple }} />
                    Role-Based Permissions & Maker-Checker Settings
                  </h6>
                </div>
                <p style={{ color: mutedColor, fontSize: '0.8rem' }}>Manage compliance controls and restrict posting authorizations.</p>
                <div className="premium-table-wrapper">
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                      <thead>
                        <tr>
                          {['Role', 'Create Journal', 'Post Ledger', 'Unlock Period', 'Audits Override'].map((h, i) => <th key={i}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { role: 'CFO / Controller', create: true, post: true, unlock: true, audit: true },
                          { role: 'Finance Manager', create: true, post: true, unlock: false, audit: false },
                          { role: 'Accountant', create: 'Maker', post: false, unlock: false, audit: false },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td className="fw-bold" style={{ color: textColor }}>{row.role}</td>
                            <td><span className="premium-badge" style={{ background: row.create ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#1e293b' : '#f1f5f9'), color: row.create ? (isDark ? '#4ade80' : '#16a34a') : mutedColor }}><FontAwesomeIcon icon={row.create ? faCheck : faTimes} className="me-1" />{row.create === 'Maker' ? 'Yes (Maker)' : row.create ? 'Yes' : 'No'}</span></td>
                            <td><span className="premium-badge" style={{ background: row.post ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'), color: row.post ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }}><FontAwesomeIcon icon={row.post ? faCheck : faTimes} className="me-1" />{row.post ? 'Yes' : 'No (Checker Required)'}</span></td>
                            <td><span className="premium-badge" style={{ background: row.unlock ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'), color: row.unlock ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }}><FontAwesomeIcon icon={row.unlock ? faCheck : faTimes} className="me-1" />{row.unlock ? 'Yes' : 'No'}</span></td>
                            <td><span className="premium-badge" style={{ background: row.audit ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fee2e2'), color: row.audit ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626') }}><FontAwesomeIcon icon={row.audit ? faCheck : faTimes} className="me-1" />{row.audit ? 'Yes' : 'No'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'audit' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faHistory} className="me-2" style={{ color: colors.warning }} />
                    Settings Modification Audit Trail
                  </h6>
                </div>
                <div className="premium-table-wrapper">
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                      <thead>
                        <tr>
                          {['Changed By', 'Parameter', 'Old Value', 'New Value', 'Timestamp', 'Actions'].map((h, i) => <th key={i}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { by: 'CFO Office', param: 'baseCurrency', old: 'EUR', newVal: 'USD', time: '2026-07-02 16:40' },
                          { by: 'Compliance Admin', param: 'taxLock', old: 'Disabled', newVal: 'Enabled', time: '2026-07-01 10:15' },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td className="fw-medium" style={{ color: textColor }}>{row.by}</td>
                            <td><span className="premium-badge" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor }}>{row.param}</span></td>
                            <td style={{ color: mutedColor }}>{row.old}</td>
                            <td className="fw-medium" style={{ color: colors.primary }}>{row.newVal}</td>
                            <td style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{row.time}</td>
                            <td>
                              <button onClick={() => handleRollback(row)} className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', fontSize: '0.7rem', background: `${colors.warning}15`, color: colors.warning }}>
                                <FontAwesomeIcon icon={faUndo} className="me-1" />Rollback
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'templates' && (
              <div className="enter-anim">
                <div className="section-header">
                  <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
                  <h6 style={{ color: textColor }}>
                    <FontAwesomeIcon icon={faFileUpload} className="me-2" style={{ color: colors.primary }} />
                    Template Settings
                  </h6>
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Enable or disable document templates for each transaction type. Disabled templates will not appear as options when generating documents.
                </p>

                <div className="d-flex flex-column gap-2">
                  {TEMPLATE_TYPES.map((t) => {
                    const isEnabled = enabledTemplates[t.id] !== false;
                    return (
                      <div key={t.id} className="d-flex justify-content-between align-items-center px-3 py-2" style={{
                        borderRadius: '12px',
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)',
                        border: `1px solid ${borderColor}`,
                        transition: 'all 0.25s',
                      }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 34, height: 34, background: isEnabled ? `${colors.primary}15` : 'transparent', color: isEnabled ? colors.primary : mutedColor }}>
                            <FontAwesomeIcon icon={t.icon} />
                          </div>
                          <div>
                            <label className="fw-semibold" style={{ color: textColor, fontSize: '0.82rem' }}>{t.label}</label>
                            <div style={{ color: mutedColor, fontSize: '0.7rem' }}>{t.desc}</div>
                          </div>
                        </div>
                        <EnableDisableButton
                          checked={isEnabled}
                          onClick={() => setEnabledTemplates(prev => ({ ...prev, [t.id]: !isEnabled }))}
                          label={t.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
              <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', height: '14px' }} />
                <span className="fw-bold" style={{ color: textColor, fontSize: '0.82rem' }}>
                  <FontAwesomeIcon icon={faFileSignature} className="me-2" style={{ color: colors.primary }} />
                  Compliance Instructions & Year-End Notes
                </span>
              </div>
              <textarea rows="2" className="form-control" value={settings.internalNotes} onChange={e => handleInputChange('internalNotes', e.target.value)} />
            </div>

            <hr className="my-4" style={{ borderColor: borderColor, opacity: 0.5 }} />
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex gap-2">
                <button onClick={handleSave} disabled={isSaving} className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}>
                  <FontAwesomeIcon icon={isSaving ? faRotateLeft : faSave} className={isSaving ? 'fa-spin' : ''} />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
                <button type="button" className="btn btn-sm premium-btn" onClick={() => setShowPreviewModal(true)} style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
                  <FontAwesomeIcon icon={faEye} className="me-1" /> Preview Invoice
                </button>
                <button type="button" className="btn btn-sm premium-btn" style={{ borderRadius: '10px', background: 'transparent', color: mutedColor, fontSize: '0.75rem', border: `1px solid ${borderColor}` }} onClick={() => { fetchSettings(); if (addNotification) addNotification('Settings reloaded from database.', 'info'); }}>
                  <FontAwesomeIcon icon={faRotateLeft} className="me-1" /> Reset
                </button>
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div className="position-relative">
                  <button type="button" className="btn btn-sm premium-btn" onClick={() => setShowFooterExportDropdown(!showFooterExportDropdown)} style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
                    <FontAwesomeIcon icon={faDownload} className="me-1" /> Export Config <span style={{ fontSize: '0.65rem' }}>▼</span>
                  </button>
                  {showFooterExportDropdown && (
                    <div className="position-absolute end-0 bottom-100 mb-1 card shadow border-0 p-1" style={{ zIndex: 100, minWidth: '120px', backgroundColor: isDark ? '#1e293b' : '#ffffff', border: `1px solid ${borderColor}` }}>
                      {['excel', 'word', 'pdf', 'json', 'sql'].map(fmt => (
                        <button key={fmt} type="button" className="btn btn-xs text-start px-2 py-1.5 rounded-3 border-0" style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: textColor, background: 'transparent' }} onClick={() => handleExport(fmt)}>
                          {fmt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="btn btn-sm premium-btn" onClick={() => fileInputRef.current.click()} style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.75rem', border: 'none' }}>
                  <FontAwesomeIcon icon={faUpload} className="me-1" /> Import Config
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImportConfig} accept=".json" style={{ display: 'none' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Preview Simulator Modal */}
      {showPreviewModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', backgroundColor: isDark ? '#1e293b' : '#ffffff' }}>
              <div className="modal-header border-bottom border-secondary border-opacity-10 py-3">
                <h5 className="modal-title fw-bold" style={{ color: textColor }}>Sales Invoice Preview Simulator</h5>
                <button type="button" className="btn-close" onClick={() => setShowPreviewModal(false)} style={{ filter: isDark ? 'invert(1)' : 'none' }}></button>
              </div>
              <div className="modal-body p-4 text-dark text-start">
                {/* Mock invoice preview sheet */}
                <div className="p-4 border rounded-3 bg-white shadow-sm font-monospace" style={{ fontSize: '0.82rem', color: '#1e293b' }}>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-start gap-3">
                      {settings.companyLogo && (
                        <img src={settings.companyLogo} alt="Logo" style={{ maxHeight: 48, maxWidth: 100, objectFit: 'contain', marginTop: 2 }} />
                      )}
                      <div>
                        <h5 className="fw-black text-primary mb-1" style={{ color: colors.primary }}>{settings.companyName}</h5>
                        <p className="text-muted mb-0 x-small" style={{ fontSize: '11px' }}>{settings.address}</p>
                        <p className="text-muted mb-0 x-small" style={{ fontSize: '11px' }}>Email: {settings.email} | Phone: {settings.phone}</p>
                        {settings.website && <p className="text-muted mb-0 x-small" style={{ fontSize: '11px' }}>Website: {settings.website}</p>}
                      </div>
                    </div>
                    <div className="text-end">
                      <h4 className="fw-bold text-uppercase text-secondary mb-1">INVOICE</h4>
                      <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>Invoice No: <span className="fw-bold text-dark">{settings.salesInvoicePrefix}0042</span></p>
                      <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <hr style={{ borderColor: '#e2e8f0' }} />
                  
                  <div className="row mb-4">
                    <div className="col-6">
                      <span className="text-muted x-small uppercase d-block mb-1" style={{ fontSize: '10px', fontWeight: 'bold' }}>BILLED TO:</span>
                      <p className="fw-bold mb-0">Acme Corporate Labs Inc</p>
                      <p className="text-muted x-small mb-0" style={{ fontSize: '11px' }}>742 Evergreen Terrace, Sector 4, Industrial Area</p>
                    </div>
                    <div className="col-6 text-end">
                      <span className="text-muted x-small uppercase d-block mb-1" style={{ fontSize: '10px', fontWeight: 'bold' }}>TAX REGISTRATION:</span>
                      <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>Company NTN: <span className="text-dark fw-bold">{settings.ntn}</span></p>
                      <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>STRN / GST: <span className="text-dark fw-bold">{settings.strn}</span></p>
                    </div>
                  </div>

                  <table className="table table-sm table-striped" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total ({settings.baseCurrency})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ManageCore Enterprise SaaS Subscriptions (FMS Module)</td>
                        <td className="text-end">10</td>
                        <td className="text-end">150.00</td>
                        <td className="text-end">1,500.00</td>
                      </tr>
                      <tr>
                        <td>Custom ERP Integration Services & API Access</td>
                        <td className="text-end">1</td>
                        <td className="text-end">500.00</td>
                        <td className="text-end">500.00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="d-flex justify-content-end mt-4">
                    <div className="text-end" style={{ width: '250px', fontSize: '12px' }}>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Subtotal:</span>
                        <span>{settings.baseCurrency} 2,000.00</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Tax ({settings.taxMethod}):</span>
                        <span>{settings.taxMethod.includes('No') ? '0.00' : `${settings.baseCurrency} 340.00`}</span>
                      </div>
                      <hr className="my-1" />
                      <div className="d-flex justify-content-between fw-bold text-dark" style={{ fontSize: '13px' }}>
                        <span>Total Invoice:</span>
                        <span>{settings.baseCurrency} {settings.taxMethod.includes('No') ? '2,000.00' : '2,340.00'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top x-small text-muted text-center" style={{ fontSize: '10px', fontStyle: 'italic' }}>
                    {settings.footerLogo && (
                      <img src={settings.footerLogo} alt="Footer" style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 8 }} />
                    )}
                    <div>{settings.invoiceFooter}</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top border-secondary border-opacity-10 py-2">
                <button type="button" className="btn btn-secondary btn-sm rounded-3" onClick={() => setShowPreviewModal(false)}>Close Simulator</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ErpPageShell>
  );
};

export default ErpSettings;
