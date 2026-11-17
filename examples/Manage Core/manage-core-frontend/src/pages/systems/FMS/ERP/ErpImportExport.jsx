import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFileExcel, faFilePdf, faFileCode, faPrint,
  faEye, faHistory, faClock, faUserShield, faShieldHalved, faChartLine,
  faFileSignature, faSitemap, faScaleBalanced, faBolt, faBell, faDatabase,
  faTriangleExclamation, faUser, faLaptopCode, faGlobe, faCloudArrowUp,
  faTrashCan, faUndo, faArrowDown, faCheckCircle, faFileImport, faFileExport,
  faArrowsRotate, faBan, faSpinner, faExclamationTriangle, faCheckDouble,
  faXmark, faUpload, faDownload, faSync, faEyeSlash, faFilePen
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { importData, exportData, getCsvImportLogs, rollbackCsvImport, exportFmsData } from '../../../../api/ams';
import { parseCSV, toCSV, downloadFile, downloadBlob, readFileAsText, generateTemplateCSV, ENTITY_TEMPLATES } from '../../../../utils/csvUtils';

// ─────────────────────────────────────────────────────────────
// TEMPLATE DEFINITIONS
// ─────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'coa', name: 'Chart of Accounts', desc: 'GL accounts, classes, classifications and parent groupings', count: 124, key: 'Accounts', icon: faDatabase, module: 'chart-of-accounts', fmsEntity: 'chart-of-accounts' },
  { id: 'cust', name: 'Customers', desc: 'Customer profile details, balances, billing and tax registration', count: 48, key: 'Customers', icon: faUser, module: 'customers', fmsEntity: null },
  { id: 'vend', name: 'Vendors', desc: 'Supplier master files, payment settings and withholding groups', count: 32, key: 'Vendors', icon: faUserShield, module: 'vendors', fmsEntity: null },
  { id: 'prod', name: 'Products', desc: 'Inventory items, barcodes, sale costs and stock categories', count: 85, key: 'Products', icon: faDatabase, module: 'inventory', fmsEntity: null },
  { id: 'uom', name: 'Units of Measure (UOM)', desc: 'Custom conversion scales, lengths and packaging configurations', count: 12, key: 'UOMs', icon: faScaleBalanced, module: 'uoms', fmsEntity: null },
  { id: 'wh', name: 'Warehouses', desc: 'Warehouse profiles, locations, rows and bin definitions', count: 4, key: 'Warehouses', icon: faGlobe, module: 'warehouses', fmsEntity: null },
  { id: 'bank', name: 'Bank Statements', desc: 'Uploaded statement line items for reconciliation routines', count: 182, key: 'Bank Statement Rows', icon: faFileExcel, module: 'bank-statements', fmsEntity: null },
  { id: 'jv', name: 'Journal Entries', desc: 'Double-entry general ledger voucher adjustments', count: 50, key: 'Journal Items', icon: faFileCode, module: 'journal-entries', fmsEntity: null },
  { id: 'exp', name: 'Expense Claims', desc: 'Reimbursement request headers and line details in bulk', count: 18, key: 'Claims', icon: faFileSignature, module: 'expense-claims', fmsEntity: 'expense-claims' },
  { id: 'adv', name: 'Employee Advances', desc: 'Advance requests with repayment amortization plans', count: 9, key: 'Advances', icon: faClock, module: 'advances', fmsEntity: null },
];

// ─────────────────────────────────────────────────────────────
// IMPORT STATUS ENUMS
// ─────────────────────────────────────────────────────────────
const IMPORT_STATUS = {
  IDLE: 'idle',
  PARSING: 'parsing',
  PREVIEW: 'preview',
  IMPORTING: 'importing',
  DONE: 'done',
  ERROR: 'error',
};

const ErpImportExport = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  // Core state
  const [templates, setTemplates] = useState(TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Import workflow state
  const [importStatus, setImportStatus] = useState(IMPORT_STATUS.IDLE);
  const [importTemplate, setImportTemplate] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Export state
  const [exportingTemplate, setExportingTemplate] = useState(null);

  // Rollback state
  const [rollingBack, setRollingBack] = useState(null);

  const fileInputRef = useRef(null);

  // ─────────────────────────────────────────────────────────
  // NAVIGATION TABS
  // ─────────────────────────────────────────────────────────
  const navigationTabs = [
    { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: faChartLine },
    { id: 'erp_approval_requests', label: 'Approval Requests', icon: faFileSignature },
    { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: faSitemap },
    { id: 'erp_audit_trail', label: 'Audit Trail', icon: faHistory },
    { id: 'erp_drafts', label: 'Drafts', icon: faFilePen },
    { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: faTrashCan },
    { id: 'erp_import_export', label: 'Import / Export', icon: faScaleBalanced },
    { id: 'erp_automation_center', label: 'Automation Center', icon: faBolt }
  ];

  // ─────────────────────────────────────────────────────────
  // LOAD IMPORT HISTORY FROM API
  // ─────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await getCsvImportLogs({ per_page: 50 });
      const items = res?.data?.data || res?.data || [];
      setHistory(Array.isArray(items) ? items.map(h => ({
        id: h.id,
        timestamp: h.created_at || h.timestamp,
        fileName: h.file_name || h.fileName,
        template: h.import_type || h.template,
        rowsTotal: h.total_rows || h.rowsTotal || 0,
        rowsSuccess: h.imported_count || h.rowsSuccess || 0,
        rowsFailed: h.failed_count || h.rowsFailed || 0,
        status: h.status === 'completed' ? 'Completed' : h.status === 'completed_with_errors' ? 'Completed with Errors' : h.status === 'rolled_back' ? 'Rolled Back' : h.status || 'Unknown',
        user: h.importedBy?.name || h.user || 'System',
        _raw: h,
      })) : []);
    } catch {
      // Backend logs may not exist for ERP imports; keep local state
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      loadHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadHistory]);

  // ─────────────────────────────────────────────────────────
  // TEMPLATE DOWNLOAD (client-side CSV generation)
  // ─────────────────────────────────────────────────────────
  const handleDownloadTemplate = useCallback((tpl) => {
    addNotification(`Generating template for ${tpl.name}...`, 'info');
    try {
      const csv = generateTemplateCSV(tpl.id);
      if (csv) {
        const filename = `${tpl.name.replace(/[^a-zA-Z0-9]/g, '_')}_Template.csv`;
        downloadFile(csv, filename);
        addNotification(`${tpl.name} template downloaded successfully.`, 'success');
      } else {
        addNotification(`Template for ${tpl.name} is not available yet.`, 'warning');
      }
    } catch (err) {
      addNotification(`Failed to generate template: ${err.message}`, 'error');
    }
  }, [addNotification]);

  // ─────────────────────────────────────────────────────────
  // FILE UPLOAD & IMPORT WORKFLOW
  // ─────────────────────────────────────────────────────────
  const triggerFileInput = useCallback((tpl) => {
    setImportTemplate(tpl);
    setParsedData(null);
    setImportResult(null);
    setValidationErrors([]);
    setImportStatus(IMPORT_STATUS.IDLE);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Step 1: Parse the file
      setImportStatus(IMPORT_STATUS.PARSING);
      addNotification(`Reading ${file.name}...`, 'info');

      try {
        let data;
        const ext = file.name.split('.').pop().toLowerCase();

        if (ext === 'csv' || ext === 'txt') {
          const text = await readFileAsText(file);
          data = parseCSV(text);
        } else {
          // For xlsx, send to backend for parsing
          addNotification('Excel files are processed by the server. Sending to API...', 'info');
          const formData = new FormData();
          formData.append('file', file);
          formData.append('module', tpl.module);
          const res = await importData(file, tpl.module);
          const result = res?.data?.data || res?.data;
          setImportResult({
            totalRecords: result?.totalRecords || 0,
            successRecords: result?.successRecords || 0,
            failedRecords: result?.failedRecords || 0,
          });
          setImportStatus(IMPORT_STATUS.DONE);

          // Log the import
          const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            fileName: file.name,
            template: tpl.name,
            rowsTotal: result?.totalRecords || 0,
            rowsSuccess: result?.successRecords || 0,
            rowsFailed: result?.failedRecords || 0,
            status: (result?.failedRecords || 0) > 0 ? 'Completed with Errors' : 'Completed',
            user: 'Admin User',
          };
          setHistory(prev => [logEntry, ...prev]);
          updateTemplateCount(tpl.id, result?.successRecords || 0);
          addNotification(`Import completed. ${result?.successRecords || 0} rows inserted into ${tpl.name}.`, 'success');
          return;
        }

        if (!data || data.rows.length === 0) {
          addNotification('The file is empty or has no valid data rows.', 'warning');
          setImportStatus(IMPORT_STATUS.IDLE);
          return;
        }

        // Step 2: Validate
        const errors = [];
        const requiredHeaders = getRequiredHeaders(tpl.id);
        const missingHeaders = requiredHeaders.filter(h => !data.headers.includes(h));
        if (missingHeaders.length > 0) {
          errors.push({ row: 0, message: `Missing required columns: ${missingHeaders.join(', ')}` });
        }

        // Check for empty required fields in data rows
        const requiredFields = getRequiredFields(tpl.id);
        data.rows.forEach((row, idx) => {
          requiredFields.forEach(field => {
            if (!row[field] || row[field].trim() === '') {
              errors.push({ row: idx + 2, message: `Row ${idx + 2}: "${field}" is required but empty` });
            }
          });
        });

        setParsedData(data);
        setValidationErrors(errors);
        setImportStatus(IMPORT_STATUS.PREVIEW);
        addNotification(`Parsed ${data.rows.length} rows. ${errors.length > 0 ? errors.length + ' validation issues found.' : 'All rows valid.'}`, errors.length > 0 ? 'warning' : 'success');
      } catch (err) {
        addNotification(`Failed to parse file: ${err.message}`, 'error');
        setImportStatus(IMPORT_STATUS.ERROR);
      }
    };
    input.click();
  }, [addNotification]);

  const getRequiredHeaders = (templateId) => {
    const tpl = ENTITY_TEMPLATES[templateId];
    if (!tpl) return [];
    // First 2-3 headers are typically required
    const requiredMap = {
      coa: ['account_code', 'account_name', 'account_type'],
      cust: ['customer_name', 'email'],
      vend: ['vendor_name', 'email'],
      prod: ['product_name', 'sku'],
      uom: ['uom_name', 'abbreviation'],
      wh: ['warehouse_name', 'code'],
      bank: ['transaction_date', 'description'],
      jv: ['entry_date', 'reference', 'account_code'],
      exp: ['employee_name', 'expense_date', 'category', 'amount'],
      adv: ['employee_name', 'request_date', 'amount'],
    };
    return requiredMap[templateId] || tpl.headers.slice(0, 2);
  };

  const getRequiredFields = (templateId) => getRequiredHeaders(templateId);

  const handleConfirmImport = useCallback(async () => {
    if (!parsedData || !importTemplate) return;

    setImportStatus(IMPORT_STATUS.IMPORTING);
    setImportProgress(0);
    addNotification(`Starting import of ${parsedData.rows.length} rows into ${importTemplate.name}...`, 'info');

    try {
      // Build CSV from parsed data and send to backend
      const csvContent = toCSV(parsedData.rows, parsedData.headers);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], `${importTemplate.id}_import.csv`, { type: 'text/csv' });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const res = await importData(file, importTemplate.module);
      clearInterval(progressInterval);
      setImportProgress(100);

      const result = res?.data?.data || res?.data;
      const success = result?.successRecords || parsedData.rows.length;
      const failed = result?.failedRecords || 0;

      setImportResult({
        totalRecords: result?.totalRecords || parsedData.rows.length,
        successRecords: success,
        failedRecords: failed,
      });
      setImportStatus(IMPORT_STATUS.DONE);

      // Log entry
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        fileName: `${importTemplate.id}_import.csv`,
        template: importTemplate.name,
        rowsTotal: result?.totalRecords || parsedData.rows.length,
        rowsSuccess: success,
        rowsFailed: failed,
        status: failed > 0 ? 'Completed with Errors' : 'Completed',
        user: 'Admin User',
      };
      setHistory(prev => [logEntry, ...prev]);
      updateTemplateCount(importTemplate.id, success);

      addNotification(`Import completed. ${success} rows inserted into ${importTemplate.name}.${failed > 0 ? ` ${failed} rows failed.` : ''}`, failed > 0 ? 'warning' : 'success');
    } catch (err) {
      setImportStatus(IMPORT_STATUS.ERROR);
      addNotification(`Import failed: ${err.message}`, 'error');
    }
  }, [parsedData, importTemplate, addNotification]);

  const updateTemplateCount = (templateId, addedCount) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, count: t.count + addedCount } : t));
  };

  const handleCancelImport = useCallback(() => {
    setImportStatus(IMPORT_STATUS.IDLE);
    setParsedData(null);
    setImportResult(null);
    setValidationErrors([]);
    setImportTemplate(null);
    setImportProgress(0);
  }, []);

  // ─────────────────────────────────────────────────────────
  // EXPORT DATA
  // ─────────────────────────────────────────────────────────
  const handleExportData = useCallback(async (tpl) => {
    setExportingTemplate(tpl.id);
    addNotification(`Exporting ${tpl.name} data...`, 'info');

    try {
      let blob;
      let filename = `${tpl.name.replace(/[^a-zA-Z0-9]/g, '_')}_Export_${new Date().toISOString().split('T')[0]}.csv`;

      if (tpl.fmsEntity) {
        // Use FMS export API
        const res = await exportFmsData(tpl.fmsEntity, 'csv');
        blob = new Blob([res.data], { type: 'text/csv' });
      } else {
        // Use generic export API
        const res = await exportData(tpl.module, 'csv');
        blob = new Blob([res.data], { type: 'text/csv' });
      }

      downloadBlob(blob, filename);
      addNotification(`${tpl.name} exported and download started.`, 'success');
    } catch (err) {
      // If API fails, export what we have locally (empty template)
      addNotification(`API export unavailable. Generating template file instead.`, 'warning');
      try {
        const csv = generateTemplateCSV(tpl.id);
        if (csv) {
          downloadFile(csv, `${tpl.name.replace(/[^a-zA-Z0-9]/g, '_')}_Export.csv`);
          addNotification(`Export template downloaded.`, 'success');
        }
      } catch (e2) {
        addNotification(`Export failed: ${e2.message}`, 'error');
      }
    } finally {
      setExportingTemplate(null);
    }
  }, [addNotification]);

  // ─────────────────────────────────────────────────────────
  // ROLLBACK IMPORT
  // ─────────────────────────────────────────────────────────
  const handleRollbackImport = useCallback(async (logEntry) => {
    if (!window.confirm(`Are you sure you want to rollback "${logEntry.fileName}"? This will reverse the ${logEntry.rowsSuccess} imported rows!`)) return;

    setRollingBack(logEntry.id);
    addNotification(`Reversing imported lines for batch ${logEntry.fileName}...`, 'warning');

    try {
      if (logEntry._raw?.id) {
        await rollbackCsvImport(logEntry._raw.id);
      }

      // Update local state
      setHistory(prev => prev.map(h =>
        h.id === logEntry.id ? { ...h, status: 'Rolled Back' } : h
      ));

      // Subtract counts from template
      setTemplates(prev => prev.map(t =>
        t.name === logEntry.template ? { ...t, count: Math.max(0, t.count - logEntry.rowsSuccess) } : t
      ));

      addNotification(`Rollback completed. ${logEntry.rowsSuccess} rows reversed from ${logEntry.template}.`, 'success');
    } catch (err) {
      addNotification(`Rollback API failed, but local state updated: ${err.message}`, 'warning');
      setHistory(prev => prev.map(h =>
        h.id === logEntry.id ? { ...h, status: 'Rolled Back' } : h
      ));
    } finally {
      setRollingBack(null);
    }
  }, [addNotification]);

  // ─────────────────────────────────────────────────────────
  // SEARCH FILTER
  // ─────────────────────────────────────────────────────────
  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────
  // LOADING SKELETON
  // ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="p-4 p-lg-5 shadow text-start position-relative overflow-hidden mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #075985 100%)', color: '#fff' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '140px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '420px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '550px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-4 mb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-md-4">
              <div className="p-3 border-0 shadow-sm rounded" style={{ background: isDark ? '#1F2937' : '#fff', borderLeft: '5px solid #EF4444' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '70%', height: '12px', background: isDark ? '#374151' : '#f1f5f9' }} />
                <div className="skeleton-box rounded" style={{ width: '40%', height: '24px', background: isDark ? '#374151' : '#f1f5f9' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="container-fluid px-0 pb-5" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>

      {/* ──── HERO BANNER ──── */}
      <div className="container-fluid px-4 px-lg-5 pt-4 text-start">
        <style>{`
          .ie-hero { position: relative; overflow: hidden; border-radius: 18px; }
          .ie-hero::before { content: ''; position: absolute; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%); top: -60px; right: -50px; pointer-events: none; }
          .ie-hero::after { content: ''; position: absolute; width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, rgba(125,211,252,0.12) 0%, transparent 70%); bottom: -40px; left: 30%; pointer-events: none; }
          .ie-hero .hero-stat { background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 10px 16px; transition: background 0.2s; }
          .ie-hero .hero-stat:hover { background: rgba(255,255,255,0.18); }
        `}</style>
        <div className="ie-hero p-4 p-lg-5 shadow text-start" style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 35%, #0369A1 70%, #075985 100%)',
          color: '#FFFFFF'
        }}>
          <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge text-white px-3 py-2 fw-bold tracking-wider rounded-pill" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '1.5px' }}>
                  DATA INTEGRITY
                </span>
                <span className="badge text-white px-2 py-1 rounded-pill" style={{ background: 'rgba(16,185,129,0.3)', border: '1px solid rgba(16,185,129,0.4)', fontSize: '10px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> System Healthy
                </span>
              </div>
              <h1 className="fw-extrabold tracking-tight mb-2 display-6" style={{ lineHeight: 1.15 }}>
                CSV / Excel Import & Export Center
              </h1>
              <p className="text-white-50 fs-6 mb-4" style={{ maxWidth: '600px', lineHeight: 1.6 }}>
                Bulk upload master data using validated templates, reconcile bank statements, and export general ledger records with rollback support.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="hero-stat d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faDatabase} className="text-info" />
                  <div>
                    <div className="fw-bold" style={{ fontSize: '15px' }}>{templates.reduce((s, t) => s + t.count, 0).toLocaleString()}</div>
                    <div className="small" style={{ fontSize: '10px', opacity: 0.75 }}>Total Records</div>
                  </div>
                </div>
                <div className="hero-stat d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFileImport} className="text-warning" />
                  <div>
                    <div className="fw-bold" style={{ fontSize: '15px' }}>{templates.length}</div>
                    <div className="small" style={{ fontSize: '10px', opacity: 0.75 }}>Schema Templates</div>
                  </div>
                </div>
                <div className="hero-stat d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faHistory} className="text-success" />
                  <div>
                    <div className="fw-bold" style={{ fontSize: '15px' }}>{history.length}</div>
                    <div className="small" style={{ fontSize: '10px', opacity: 0.75 }}>Import Batches</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 text-lg-end d-none d-lg-block">
              <div style={{ fontSize: 96, opacity: 0.08, lineHeight: 1 }}>
                <FontAwesomeIcon icon={faFileExport} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── NAVIGATION TABS ──── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="pill-tab-nav shadow-sm bg-white p-2 rounded-pill d-inline-flex" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: isDark ? '1px solid #374151' : '1px solid #E2E8F0' }}>
          {navigationTabs.map(tab => (
            <button
              key={tab.id}
              className={`pill-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                borderRadius: '24px', padding: '8px 18px', fontWeight: '600', fontSize: '13px', border: 'none', transition: 'all 0.2s',
                color: activeTab === tab.id ? '#fff' : (isDark ? '#cbd5e1' : '#4b5563'),
                background: activeTab === tab.id ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──── IMPORT ACTIVE BANNER ──── */}
      {(importStatus !== IMPORT_STATUS.IDLE) && (
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in mb-4">
          <div className="card border-0 shadow-sm p-4 rounded-4" style={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderLeft: `5px solid ${importStatus === IMPORT_STATUS.DONE ? '#10B981' : importStatus === IMPORT_STATUS.ERROR ? '#EF4444' : '#3B82F6'}`
          }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0">
                {importStatus === IMPORT_STATUS.PARSING && <><FontAwesomeIcon icon={faSpinner} spin className="me-2 text-primary" /> Parsing File...</>}
                {importStatus === IMPORT_STATUS.PREVIEW && <><FontAwesomeIcon icon={faEye} className="me-2 text-warning" /> Import Preview — {importTemplate?.name}</>}
                {importStatus === IMPORT_STATUS.IMPORTING && <><FontAwesomeIcon icon={faSpinner} spin className="me-2 text-primary" /> Importing Data...</>}
                {importStatus === IMPORT_STATUS.DONE && <><FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" /> Import Complete</>}
                {importStatus === IMPORT_STATUS.ERROR && <><FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-danger" /> Import Error</>}
              </h6>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleCancelImport}>
                <FontAwesomeIcon icon={faXmark} className="me-1" /> Close
              </button>
            </div>

            {/* PARSING */}
            {importStatus === IMPORT_STATUS.PARSING && (
              <div className="text-center py-3">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary mb-2" />
                <p className="text-muted mb-0">Reading and validating file...</p>
              </div>
            )}

            {/* PREVIEW */}
            {importStatus === IMPORT_STATUS.PREVIEW && parsedData && (
              <div>
                <div className="row g-3 mb-3">
                  <div className="col-md-3">
                    <div className="p-3 rounded" style={{ background: isDark ? '#374151' : '#f0fdf4' }}>
                      <span className="small text-muted d-block">Total Rows</span>
                      <h5 className="fw-bold text-success mb-0">{parsedData.rows.length}</h5>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 rounded" style={{ background: isDark ? '#374151' : '#eff6ff' }}>
                      <span className="small text-muted d-block">Columns</span>
                      <h5 className="fw-bold text-primary mb-0">{parsedData.headers.length}</h5>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 rounded" style={{ background: isDark ? '#374151' : '#fef3c7' }}>
                      <span className="small text-muted d-block">Valid Rows</span>
                      <h5 className="fw-bold text-warning mb-0">{parsedData.rows.length - validationErrors.filter(e => e.row > 0).length}</h5>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 rounded" style={{ background: isDark ? '#374151' : '#fef2f2' }}>
                      <span className="small text-muted d-block">Issues</span>
                      <h5 className="fw-bold text-danger mb-0">{validationErrors.length}</h5>
                    </div>
                  </div>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="alert alert-warning mb-3" style={{ fontSize: '13px', maxHeight: '150px', overflowY: 'auto' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    <strong>Validation Issues:</strong>
                    <ul className="mb-0 mt-1">
                      {validationErrors.slice(0, 10).map((err, i) => (
                        <li key={i}>{err.message}</li>
                      ))}
                      {validationErrors.length > 10 && <li>...and {validationErrors.length - 10} more</li>}
                    </ul>
                  </div>
                )}

                {/* Data Preview Table */}
                <div className="table-responsive mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <table className="table table-sm table-bordered mb-0" style={{ fontSize: '12px' }}>
                    <thead className="table-light sticky-top">
                      <tr>
                        {parsedData.headers.map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.rows.slice(0, 5).map((row, idx) => (
                        <tr key={idx}>
                          {parsedData.headers.map(h => <td key={h}>{row[h]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.rows.length > 5 && (
                    <div className="text-center text-muted small py-1">...and {parsedData.rows.length - 5} more rows</div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={handleConfirmImport}
                    disabled={validationErrors.some(e => e.row === 0)}
                  >
                    <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" />
                    Confirm Import ({parsedData.rows.length} rows)
                  </button>
                  <button className="btn btn-outline-secondary" onClick={handleCancelImport}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* IMPORTING (progress) */}
            {importStatus === IMPORT_STATUS.IMPORTING && (
              <div>
                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${importProgress}%` }}
                    aria-valuenow={importProgress}
                  >
                  </div>
                </div>
                <p className="text-muted small text-center mb-0">Processing {importTemplate?.name} import... {importProgress}%</p>
              </div>
            )}

            {/* DONE */}
            {importStatus === IMPORT_STATUS.DONE && importResult && (
              <div className="text-center">
                <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-success mb-3" />
                <h5 className="fw-bold">Import Completed Successfully</h5>
                <div className="d-flex justify-content-center gap-4 mb-3">
                  <div>
                    <span className="small text-muted d-block">Total</span>
                    <span className="fw-bold">{importResult.totalRecords}</span>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Inserted</span>
                    <span className="fw-bold text-success">{importResult.successRecords}</span>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Failed</span>
                    <span className={`fw-bold ${importResult.failedRecords > 0 ? 'text-danger' : 'text-muted'}`}>{importResult.failedRecords}</span>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleCancelImport}>Done</button>
              </div>
            )}

            {/* ERROR */}
            {importStatus === IMPORT_STATUS.ERROR && (
              <div className="text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-danger mb-3" />
                <h5 className="fw-bold">Import Failed</h5>
                <p className="text-muted">An error occurred during import. Please check your file format and try again.</p>
                <button className="btn btn-primary" onClick={handleCancelImport}>Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──── TEMPLATE CARDS ──── */}
      <div className="container-fluid px-4 px-lg-5 text-start mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h5 className="fw-bold mb-0">
            <FontAwesomeIcon icon={faFileImport} className="me-2 text-primary" />
            Select Import Schema Template
          </h5>
          <div className="d-flex gap-2" style={{ width: '320px' }}>
            <div className="input-group">
              <span className="input-group-text" style={{ borderRadius: '8px 0 0 8px', background: isDark ? '#374151' : '#f1f5f9', border: 'none' }}>
                <FontAwesomeIcon icon={faSearch} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ borderRadius: '0 8px 8px 0', background: isDark ? '#374151' : '#f1f5f9', border: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="row g-4">
          {filteredTemplates.map(t => (
            <div key={t.id} className="col-xl-4 col-lg-6">
              <div className="card border-0 shadow-sm p-4 rounded-4 h-100 d-flex flex-column justify-content-between" style={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded" style={{
                        width: '36px', height: '36px',
                        background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.08)',
                        color: '#3B82F6'
                      }}>
                        <FontAwesomeIcon icon={t.icon} />
                      </div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '14px' }}>{t.name}</h6>
                    </div>
                    <span className="badge font-monospace" style={{
                      background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.08)',
                      color: '#3B82F6',
                      fontSize: '11px',
                    }}>{t.count} {t.key}</span>
                  </div>
                  <p className="text-muted small mb-2" style={{ minHeight: '36px', fontSize: '12px' }}>{t.desc}</p>

                  <button
                    className="btn btn-sm text-decoration-none p-0 fw-bold"
                    style={{ color: '#3B82F6', fontSize: '12px' }}
                    onClick={() => handleDownloadTemplate(t)}
                  >
                    <FontAwesomeIcon icon={faArrowDown} className="me-1" /> Download CSV Template
                  </button>
                </div>

                <div className="d-flex gap-2 mt-3 pt-3 border-top">
                  <button
                    className="btn btn-sm btn-outline-primary flex-grow-1"
                    onClick={() => triggerFileInput(t)}
                    disabled={importStatus === IMPORT_STATUS.IMPORTING || importStatus === IMPORT_STATUS.PARSING}
                  >
                    <FontAwesomeIcon icon={faCloudArrowUp} className="me-1" /> Import File
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                    title="Export Data to CSV"
                    onClick={() => handleExportData(t)}
                    disabled={exportingTemplate === t.id}
                  >
                    {exportingTemplate === t.id ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faFileExport} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──── IMPORT HISTORY TABLE ──── */}
      <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
        <div className="card border-0 shadow-sm p-4 rounded-4" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" /> Import History
            </h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={loadHistory} disabled={historyLoading}>
              <FontAwesomeIcon icon={faSync} className={historyLoading ? 'me-1 spin' : 'me-1'} /> Refresh
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>File Name</th>
                  <th>Template</th>
                  <th>Total Rows</th>
                  <th>Successful</th>
                  <th>Failed</th>
                  <th>Imported By</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      {historyLoading ? (
                        <><FontAwesomeIcon icon={faSpinner} spin className="me-2" /> Loading history...</>
                      ) : (
                        <>No import history yet. Upload a file to get started.</>
                      )}
                    </td>
                  </tr>
                ) : (
                  history.map(h => (
                    <tr key={h.id} style={h.status === 'Rolled Back' ? { opacity: 0.5 } : {}}>
                      <td><span className="small text-muted font-monospace">{h.timestamp}</span></td>
                      <td className="fw-semibold">{h.fileName}</td>
                      <td><span className="badge font-monospace border" style={{ background: isDark ? '#374151' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#334155' }}>{h.template}</span></td>
                      <td className="fw-bold">{h.rowsTotal}</td>
                      <td className="text-success fw-bold">{h.rowsSuccess}</td>
                      <td className={h.rowsFailed > 0 ? 'text-danger fw-bold' : 'text-muted'}>{h.rowsFailed}</td>
                      <td>{h.user}</td>
                      <td>
                        <span className={`badge rounded-pill ${
                          h.status === 'Completed' ? 'bg-success bg-opacity-10 text-success' :
                          h.status === 'Rolled Back' ? 'bg-secondary bg-opacity-10 text-secondary' :
                          'bg-warning bg-opacity-10 text-warning'
                        }`}>{h.status}</span>
                      </td>
                      <td className="text-end">
                        {h.status !== 'Rolled Back' && h.rowsSuccess > 0 && (
                          <button
                            className="btn btn-xs btn-outline-danger"
                            title="Rollback this import batch"
                            onClick={() => handleRollbackImport(h)}
                            disabled={rollingBack === h.id}
                          >
                            {rollingBack === h.id ? (
                              <><FontAwesomeIcon icon={faSpinner} spin className="me-1" /> Rolling back...</>
                            ) : (
                              <><FontAwesomeIcon icon={faUndo} className="me-1" /> Rollback</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ErpImportExport;
