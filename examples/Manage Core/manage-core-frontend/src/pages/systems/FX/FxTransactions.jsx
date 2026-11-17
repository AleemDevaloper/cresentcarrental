import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave, faPlus, faFileImport, faFileExport, faPrint, faSearch,
  faEye, faEdit, faTrash, faFilter, faCheckCircle, faTimesCircle, faClock,
  faBuilding, faUniversity, faDollarSign, faPercent, faReceipt, faFileInvoiceDollar,
  faCloudUploadAlt, faCog, faSave, faTimes, faCalendarAlt, faExchangeAlt,
  faBook, faBookOpen, faLink, faShieldHalved, faHistory, faClipboardCheck,
  faPaperclip, faUserShield, faCalculator, faChevronRight, faCopy,
  faCheckDouble, faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { listFxTransactions, createFxTransaction, updateFxTransaction, deleteFxTransaction } from '../../../api/fx';
import { clearCache } from '../../../api/client';

const transactionTypes = [
  'Currency Purchase', 'Currency Sale', 'Foreign Payment', 'Foreign Receipt',
  'Bank Transfer', 'Currency Conversion', 'Advance Payment', 'International Invoice',
  'Vendor Payment', 'Customer Payment',
];

const typeBadgeStyles = {
  'Currency Purchase': { bg: '#dbeafe', color: '#1d4ed8', icon: faDollarSign },
  'Currency Sale': { bg: '#dcfce7', color: '#16a34a', icon: faDollarSign },
  'Foreign Payment': { bg: '#ffedd5', color: '#c2410c', icon: faFileExport },
  'Foreign Receipt': { bg: '#f3e8ff', color: '#7e22ce', icon: faFileImport },
  'Bank Transfer': { bg: '#cffafe', color: '#0e7490', icon: faUniversity },
  'Currency Conversion': { bg: '#fce7f3', color: '#be185d', icon: faExchangeAlt },
  'Advance Payment': { bg: '#fef9c3', color: '#ca8a04', icon: faMoneyBillWave },
  'International Invoice': { bg: '#e0e7ff', color: '#4338ca', icon: faFileInvoiceDollar },
  'Vendor Payment': { bg: '#ccfbf1', color: '#0f766e', icon: faBuilding },
  'Customer Payment': { bg: '#fee2e2', color: '#b91c1c', icon: faBuilding },
};

const statusBadgeStyles = {
  Completed: { bg: '#dcfce7', color: '#16a34a', icon: faCheckCircle },
  Pending: { bg: '#fef9c3', color: '#ca8a04', icon: faClock },
  Failed: { bg: '#fee2e2', color: '#dc2626', icon: faTimesCircle },
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8', icon: faClock },
  Approved: { bg: '#dcfce7', color: '#16a34a', icon: faCheckCircle },
  Rejected: { bg: '#fee2e2', color: '#dc2626', icon: faTimesCircle },
};

const advancedFeatures = [
  { icon: faBook, label: 'Multi-Currency Journals', desc: 'Maintain detailed journals for multi-currency entries.', color: '#3b82f6' },
  { icon: faBookOpen, label: 'Automatic Ledger Posting', desc: 'Auto-post FX transactions to general ledger accounts.', color: '#10b981' },
  { icon: faLink, label: 'Bank Reconciliation', desc: 'Reconcile foreign currency bank statements.', color: '#8b5cf6' },
  { icon: faDollarSign, label: 'Payment Gateway Integration', desc: 'Connect with international payment gateways.', color: '#f59e0b' },
  { icon: faHistory, label: 'Audit Logs', desc: 'Track all FX transaction changes with audit trail.', color: '#ef4444' },
  { icon: faClipboardCheck, label: 'Transaction Approval', desc: 'Multi-step approval workflow for FX transactions.', color: '#06b6d4' },
  { icon: faPaperclip, label: 'Document Attachments', desc: 'Upload and manage supporting documents.', color: '#f97316' },
  { icon: faUserShield, label: 'Multi-Level Authorization', desc: 'Configure authorization levels for large transactions.', color: '#ec4899' },
  { icon: faCalculator, label: 'Exchange Gain/Loss Calculation', desc: 'Auto-calculate realized and unrealized gains.', color: '#14b8a6' },
];

const initialFilters = {
  dateFrom: '',
  dateTo: '',
  company: '',
  branch: '',
  transactionType: '',
  status: '',
};

const emptyTransaction = {
  transactionNumber: '',
  transactionDate: new Date().toISOString().split('T')[0],
  referenceNumber: '',
  company: '',
  branch: '',
  bankAccount: '',
  currency: '',
  transactionType: '',
  exchangeRate: '',
  originalAmount: '',
  convertedAmount: '',
  bankCharges: '',
  tax: '',
  description: '',
  supportingDocuments: null,
  approvalStatus: 'Pending',
  createdBy: '',
};

const FxTransactions = ({ isDark }) => {
  const { t } = useTranslation();
  const { addNotification } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState(emptyTransaction);
  const [deletingTx, setDeletingTx] = useState(null);
  const [viewingTx, setViewingTx] = useState(null);
  const [schedulingTx, setSchedulingTx] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ scheduledFor: '', note: '' });
  const [printPayload, setPrintPayload] = useState(null);
  const [errors, setErrors] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [featureModal, setFeatureModal] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [attachingTx, setAttachingTx] = useState(null);
  const [attachingFile, setAttachingFile] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listFxTransactions();
        setTransactions(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const logAudit = (tx, action, detail) => {
    setAuditLog(prev => [
      { id: Date.now(), transactionNumber: tx?.transactionNumber || '—', action, detail, by: tx?.createdBy || 'Admin', at: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const containerBg = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#232736' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1e2235' : '#ffffff';
  const hoverBg = isDark ? '#2a2f45' : '#f1f5f9';

  const generateTransactionNumber = () => {
    const lastId = transactions.length > 0 ? Math.max(...transactions.map(tx => tx.id)) : 0;
    const nextId = lastId + 1;
    const year = new Date().getFullYear();
    return `FX-${year}-${String(nextId).padStart(3, '0')}`;
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = !search ||
        tx.transactionNumber.toLowerCase().includes(search.toLowerCase()) ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.currency.toLowerCase().includes(search.toLowerCase()) ||
        tx.company.toLowerCase().includes(search.toLowerCase());

      const matchesDateFrom = !filters.dateFrom || new Date(tx.transactionDate) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(tx.transactionDate) <= new Date(filters.dateTo);
      const matchesCompany = !filters.company || tx.company === filters.company;
      const matchesBranch = !filters.branch || tx.branch === filters.branch;
      const matchesType = !filters.transactionType || tx.transactionType === filters.transactionType;
      const matchesStatus = !filters.status || tx.approvalStatus === filters.status;

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesCompany && matchesBranch && matchesType && matchesStatus;
    });
  }, [transactions, filters, search]);

  const companies = useMemo(() => [...new Set(transactions.map(tx => tx.company).filter(Boolean))], [transactions]);
  const branches = useMemo(() => [...new Set(transactions.map(tx => tx.branch).filter(Boolean))], [transactions]);

  const handleOpenCreate = () => {
    const newNumber = generateTransactionNumber();
    setEditingTransaction(null);
    setFormData({
      ...emptyTransaction,
      transactionNumber: newNumber,
      createdBy: 'Admin',
    });
    setErrors({});
    setShowForm(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      transactionNumber: tx.transactionNumber,
      transactionDate: tx.transactionDate,
      referenceNumber: tx.referenceNumber || '',
      company: tx.company,
      branch: tx.branch,
      bankAccount: tx.bankAccount,
      currency: tx.currency,
      transactionType: tx.transactionType,
      exchangeRate: tx.exchangeRate,
      originalAmount: tx.originalAmount,
      convertedAmount: tx.convertedAmount,
      bankCharges: tx.bankCharges,
      tax: tx.tax,
      description: tx.description,
      supportingDocuments: null,
      approvalStatus: tx.approvalStatus,
      createdBy: tx.createdBy,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setFormData(emptyTransaction);
    setErrors({});
  };

  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };

    if (field === 'exchangeRate' || field === 'originalAmount') {
      const rate = parseFloat(field === 'exchangeRate' ? value : updated.exchangeRate);
      const amount = parseFloat(field === 'originalAmount' ? value : updated.originalAmount);
      if (!isNaN(rate) && !isNaN(amount)) {
        updated.convertedAmount = (rate * amount).toFixed(2);
      } else {
        updated.convertedAmount = '';
      }
    }

    setFormData(updated);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.transactionDate) newErrors.transactionDate = 'Transaction date is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.bankAccount) newErrors.bankAccount = 'Bank account is required';
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (!formData.transactionType) newErrors.transactionType = 'Transaction type is required';
    if (!formData.exchangeRate || parseFloat(formData.exchangeRate) <= 0) newErrors.exchangeRate = 'Valid exchange rate is required';
    if (!formData.originalAmount || parseFloat(formData.originalAmount) <= 0) newErrors.originalAmount = 'Valid amount is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      transactionDate: formData.transactionDate,
      referenceNumber: formData.referenceNumber,
      company: formData.company,
      branch: formData.branch,
      bankAccount: formData.bankAccount,
      currency: formData.currency,
      transactionType: formData.transactionType,
      exchangeRate: formData.exchangeRate,
      originalAmount: formData.originalAmount,
      convertedAmount: formData.convertedAmount,
      bankCharges: formData.bankCharges,
      tax: formData.tax,
      description: formData.description,
      approvalStatus: formData.approvalStatus || 'Pending',
    };

    try {
      if (editingTransaction) {
        const res = await updateFxTransaction(editingTransaction.id, payload);
        const updated = res?.data?.data || res?.data || { ...editingTransaction, ...payload };
        setTransactions(prev => prev.map(tx => tx.id === editingTransaction.id ? { ...tx, ...updated } : tx));
        logAudit(editingTransaction, 'Edited', 'Transaction details updated');
      } else {
        const res = await createFxTransaction(payload);
        const created = res?.data?.data || res?.data || { id: Date.now(), transactionNumber: formData.transactionNumber, createdBy: formData.createdBy, ...payload };
        setTransactions(prev => [...prev, created]);
        logAudit(created, 'Created', 'New FX transaction added');
      }
      handleCloseForm();
    } catch (err) {
      addNotification?.(err.message || 'Failed to save transaction.', 'error');
    }
  };

  const handleDelete = (id) => {
    const tx = transactions.find(t => t.id === id);
    setDeletingTx(tx);
  };

  const confirmDelete = async () => {
    if (deletingTx) {
      try {
        await deleteFxTransaction(deletingTx.id);
        setTransactions(prev => prev.filter(t => t.id !== deletingTx.id));
        logAudit(deletingTx, 'Deleted', 'Transaction deleted');
        addNotification?.(`Transaction "${deletingTx.transactionNumber}" deleted.`, 'success');
      } catch (err) {
        addNotification?.(err.message || 'Failed to delete transaction.', 'error');
      }
      setDeletingTx(null);
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, supportingDocuments: e.target.files[0] }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearch('');
  };

  const handleApprove = (tx) => {
    setConfirmAction({ tx, action: 'approve' });
  };

  const handleReject = (tx) => {
    setConfirmAction({ tx, action: 'reject' });
  };

  const confirmStatusChange = async () => {
    if (!confirmAction) return;
    const { tx, action } = confirmAction;
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    try {
      await updateFxTransaction(tx.id, { approvalStatus: newStatus });
      setTransactions(prev => prev.map(t =>
        t.id === tx.id ? { ...t, approvalStatus: newStatus, reviewedAt: new Date().toISOString() } : t
      ));
      logAudit(tx, action === 'approve' ? 'Approved' : 'Rejected', `Status changed to ${newStatus}`);
      addNotification?.(`Transaction "${tx.transactionNumber}" ${action === 'approve' ? 'approved' : 'rejected'}.`, action === 'approve' ? 'success' : 'error');
    } catch (err) {
      addNotification?.(err.message || 'Failed to update status.', 'error');
    }
    setConfirmAction(null);
  };

  const handleCopy = async (tx) => {
    const payload = {
      transactionDate: new Date().toISOString().split('T')[0],
      referenceNumber: tx.referenceNumber,
      company: tx.company,
      branch: tx.branch,
      bankAccount: tx.bankAccount,
      currency: tx.currency,
      transactionType: tx.transactionType,
      exchangeRate: tx.exchangeRate,
      originalAmount: tx.originalAmount,
      convertedAmount: tx.convertedAmount,
      bankCharges: tx.bankCharges,
      tax: tx.tax,
      description: tx.description,
      approvalStatus: 'Pending',
    };
    try {
      const res = await createFxTransaction(payload);
      const created = res?.data?.data || res?.data || { id: Date.now(), transactionNumber: generateTransactionNumber(), createdBy: 'Admin', ...payload };
      setTransactions(prev => [...prev, created]);
      logAudit(tx, 'Copied', `Duplicated as "${created.transactionNumber}"`);
      addNotification?.(`Transaction "${tx.transactionNumber}" copied as "${created.transactionNumber}".`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to copy transaction.', 'error');
    }
  };

  const openSchedule = (tx) => {
    setSchedulingTx(tx);
    setScheduleForm({
      scheduledFor: tx.scheduledFor || tx.transactionDate || '',
      note: tx.scheduleNote || '',
    });
  };

  const saveSchedule = () => {
    if (!schedulingTx) return;
    if (!scheduleForm.scheduledFor) {
      addNotification?.('Please select a schedule date.', 'error');
      return;
    }
    setTransactions(prev => prev.map(t =>
      t.id === schedulingTx.id
        ? { ...t, scheduledFor: scheduleForm.scheduledFor, scheduleNote: scheduleForm.note }
        : t
    ));
    logAudit(schedulingTx, 'Scheduled', `Scheduled for ${scheduleForm.scheduledFor}`);
    addNotification?.(`Transaction "${schedulingTx.transactionNumber}" scheduled for ${scheduleForm.scheduledFor}.`, 'success');
    setSchedulingTx(null);
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
    const newTransactions = rows
      .filter(row => row && (row['Transaction No'] || row.transactionNumber || row['Transaction Number']))
      .map((row, idx) => ({
        id: now.getTime() + idx,
        transactionNumber: row['Transaction No'] || row.transactionNumber || row['Transaction Number'] || generateTransactionNumber(),
        transactionDate: row['Date'] || row.transactionDate || new Date().toISOString().split('T')[0],
        referenceNumber: row['Reference'] || row.referenceNumber || '',
        company: row['Company'] || row.company || '',
        branch: row['Branch'] || row.branch || '',
        bankAccount: row['Bank Account'] || row.bankAccount || '',
        currency: row['Currency'] || row.currency || '',
        transactionType: row['Type'] || row.transactionType || transactionTypes[0],
        exchangeRate: String(row['Exchange Rate'] || row.exchangeRate || 0),
        originalAmount: String(row['Original Amount'] || row.originalAmount || 0),
        convertedAmount: String(row['Converted Amount'] || row.convertedAmount || 0),
        bankCharges: String(row['Bank Charges'] || row.bankCharges || 0),
        tax: String(row['Tax'] || row.tax || 0),
        description: row['Description'] || row.description || '',
        approvalStatus: row['Status'] || row.approvalStatus || 'Pending',
        createdBy: 'Import',
      }));
    if (newTransactions.length === 0) {
      addNotification?.('No valid FX transaction rows found in the file.', 'error');
      return;
    }
    setTransactions(prev => [...prev, ...newTransactions]);
    addNotification?.(`Imported ${newTransactions.length} FX transaction(s).`, 'success');
  };

  const handleOpenFeature = (feature) => {
    let type = 'info';
    switch (feature.label) {
      case 'Transaction Approval':
        type = 'approval';
        break;
      case 'Audit Logs':
        type = 'audit';
        break;
      case 'Multi-Currency Journals':
        type = 'journals';
        break;
      case 'Automatic Ledger Posting':
        type = 'ledger';
        break;
      case 'Exchange Gain/Loss Calculation':
        type = 'gainloss';
        break;
      case 'Document Attachments':
        type = 'attachment';
        break;
      default:
        type = 'info';
    }
    setFeatureModal({ feature, type });
  };

  const inputStyle = {
    background: inputBg,
    color: textColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '10px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    width: '100%',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    color: textColor,
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '0.35rem',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'auto',
  };

  const formGroupStyle = {
    marginBottom: '1rem',
  };

  return (
    <div style={{
      background: containerBg,
      minHeight: '100vh',
      padding: 'clamp(0.75rem, 3vw, 1.5rem)',
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        .glass-card {
          background: ${isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'};
          box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
        }
        .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; }
        .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(6,182,212,0.08); }
        .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
        .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .premium-feature-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-feature-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15); }
        .premium-feature-card .feature-icon { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-feature-card:hover .feature-icon { transform: scale(1.2) rotate(-6deg); }
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
        .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
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
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
      `}</style>

      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 enter-anim" style={{ position: 'relative', zIndex: 110 }}>
        <div>
          <div className="d-flex align-items-center gap-3 mb-1">
            <div style={{
              width: '4px',
              height: '28px',
              borderRadius: '4px',
              background: 'linear-gradient(180deg, #06b6d4, #0d9488)',
              flexShrink: 0,
            }} />
            <div>
              <h4 className="fw-bold mb-0" style={{ color: textColor, fontSize: '1.4rem' }}>
                <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" style={{ color: '#06b6d4' }} />
                {t('FX Transactions')}
              </h4>
              <p className="mb-0 mt-1 d-flex align-items-center gap-1" style={{ color: mutedColor, fontSize: '0.82rem' }}>
                <FontAwesomeIcon icon={faExchangeAlt} style={{ fontSize: '0.7rem' }} />
                {t('Manage foreign exchange transactions across all companies and branches.')}
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-lg-0">
          <button
            className="btn btn-sm border-0 text-white premium-btn d-flex align-items-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0d9488)',
              borderRadius: '10px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.82rem',
            }}
            onClick={handleOpenCreate}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>{t('New FX Transaction')}</span>
          </button>
          <FxImportDropdown
            title="FX Transactions"
            isDark={isDark}
            addNotification={addNotification}
            onImport={handleImport}
            buttonStyle={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '10px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              color: '#fff',
            }}
          />
          <FxExportDropdown
            data={filteredTransactions}
            getExportData={(data) => data.map(tx => ({
              'Transaction No': tx.transactionNumber,
              'Date': tx.transactionDate,
              'Company': tx.company,
              'Branch': tx.branch,
              'Bank Account': tx.bankAccount,
              'Currency': tx.currency,
              'Type': tx.transactionType,
              'Exchange Rate': tx.exchangeRate,
              'Original Amount': tx.originalAmount,
              'Converted Amount': tx.convertedAmount,
              'Bank Charges': tx.bankCharges,
              'Tax': tx.tax,
              'Status': tx.approvalStatus,
              'Created By': tx.createdBy,
            }))}
            title="FX Transactions Report"
            filenamePrefix="fx-transactions"
            isDark={isDark}
            addNotification={addNotification}
            buttonStyle={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '10px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              color: '#fff',
            }}
          />
          <button
            className="btn btn-sm border-0 text-white premium-btn d-flex align-items-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '10px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
            }}
            onClick={() => handlePrint({ type: 'list', items: filteredTransactions, title: 'FX Transactions Report' })}
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>{t('Print')}</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className="rounded-4 p-3 mb-4 premium-card glass-card enter-anim"
        style={{ background: cardBg, border: `1px solid ${borderColor}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 tx-input" style={{
            flex: 1,
            minWidth: '220px',
            background: inputBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '10px',
            padding: '0.3rem 0.75rem',
            transition: 'all 0.2s',
          }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: mutedColor, fontSize: '0.8rem' }} />
            <input
              type="text"
              placeholder={t('Search transactions...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                padding: '0.35rem 0',
                color: textColor,
                width: '100%',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <button
            className="btn btn-sm d-flex align-items-center gap-1 premium-btn"
            style={{
              background: showFilters
                ? 'linear-gradient(135deg, #06b6d4, #0d9488)'
                : isDark ? '#2d3248' : '#e5e7eb',
              color: showFilters ? '#fff' : textColor,
              borderRadius: '10px',
              padding: '0.4rem 1rem',
              border: 'none',
              fontSize: '0.82rem',
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>{t('Filters')}</span>
          </button>
          {(search || filters.dateFrom || filters.dateTo || filters.company || filters.branch || filters.transactionType || filters.status) && (
            <button
              className="btn btn-sm border-0 premium-btn d-flex align-items-center gap-1"
              style={{
                color: '#ef4444',
                background: isDark ? '#2d3248' : '#f1f5f9',
                borderRadius: '10px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
              }}
              onClick={clearFilters}
            >
              <FontAwesomeIcon icon={faTimes} className="me-1" />
              {t('Clear')}
            </button>
          )}
          <span style={{ color: mutedColor, fontSize: '0.82rem', marginLeft: 'auto', fontWeight: 500 }}>
            {filteredTransactions.length} {t('transactions')}
          </span>
        </div>

        {showFilters && (
          <div className="row g-2 mt-3 tx-slide-down">
            <div className="col-lg-2 col-md-4 col-6">
              <label style={labelStyle}>{t('Date From')}</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="tx-input"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <label style={labelStyle}>{t('Date To')}</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="tx-input"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <label style={labelStyle}>{t('Company')}</label>
              <select
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                className="tx-input"
                style={{
                  ...selectStyle,
                  background: inputBg,
                  color: textColor,
                }}
              >
                <option value="">{t('All Companies')}</option>
                {companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <label style={labelStyle}>{t('Branch')}</label>
              <select
                value={filters.branch}
                onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                className="tx-input"
                style={{
                  ...selectStyle,
                  background: inputBg,
                  color: textColor,
                }}
              >
                <option value="">{t('All Branches')}</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <label style={labelStyle}>{t('Type')}</label>
              <select
                value={filters.transactionType}
                onChange={(e) => setFilters(prev => ({ ...prev, transactionType: e.target.value }))}
                className="tx-input"
                style={{
                  ...selectStyle,
                  background: inputBg,
                  color: textColor,
                }}
              >
                <option value="">{t('All Types')}</option>
                {transactionTypes.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <label style={labelStyle}>{t('Status')}</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="tx-input"
                style={{
                  ...selectStyle,
                  background: inputBg,
                  color: textColor,
                }}
              >
                <option value="">{t('All Status')}</option>
                {Object.keys(statusBadgeStyles).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div
        className="mc-table-wrapper rounded-4 overflow-hidden premium-card glass-card enter-anim"
        style={{ background: cardBg, border: `1px solid ${borderColor}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        <div className="table-responsive tx-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table className="table align-middle mb-0 mc-table">
            <thead>
              <tr>
                <th>{t('Transaction No.')}</th>
                <th>{t('Date')}</th>
                <th>{t('Company')}</th>
                <th>{t('Branch')}</th>
                <th>{t('Bank Account')}</th>
                <th>{t('Currency')}</th>
                <th>{t('Type')}</th>
                <th className="text-end">{t('Amount')}</th>
                <th className="text-end">{t('Rate')}</th>
                <th className="text-end">{t('Converted')}</th>
                <th className="text-end">{t('Charges')}</th>
                <th>{t('Status')}</th>
                <th>{t('Created By')}</th>
                <th className="text-center">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="14" className="text-center py-5" style={{ color: mutedColor }}>
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    {t('No transactions found')}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const typeStyle = typeBadgeStyles[tx.transactionType] || { bg: '#f1f5f9', color: '#475569', icon: faReceipt };
                  const statusStyle = statusBadgeStyles[tx.approvalStatus] || statusBadgeStyles.Pending;
                  return (
                    <tr
                      key={tx.id}
                      className="enter-anim"
                    >
                      <td>
                        <span className="fw-semibold" style={{ color: '#06b6d4', fontSize: '0.82rem' }}>{tx.transactionNumber}</span>
                      </td>
                      <td style={{ color: textColor, whiteSpace: 'nowrap' }}>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" style={{ color: mutedColor, fontSize: '0.7rem' }} />
                        {tx.transactionDate}
                        {tx.scheduledFor && (
                          <span
                            className="badge rounded-pill ms-1"
                            style={{
                              background: isDark ? '#164e63' : '#cffafe',
                              color: isDark ? '#67e8f9' : '#0e7490',
                              fontSize: '0.6rem', fontWeight: 600,
                            }}
                            title={`Scheduled for ${tx.scheduledFor}${tx.scheduleNote ? ` — ${tx.scheduleNote}` : ''}`}
                          >
                            <FontAwesomeIcon icon={faClock} className="me-1" style={{ fontSize: '0.5rem' }} />
                            {tx.scheduledFor}
                          </span>
                        )}
                      </td>
                      <td style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faBuilding} className="me-1" style={{ color: mutedColor, fontSize: '0.7rem' }} />
                        {tx.company}
                      </td>
                      <td style={{ color: mutedColor }}>{tx.branch}</td>
                      <td style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faUniversity} className="me-1" style={{ color: mutedColor, fontSize: '0.7rem' }} />
                        {tx.bankAccount}
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: '#06b6d4' }}>{tx.currency}</span>
                      </td>
                      <td>
                        <span
                          className="badge rounded-pill px-2 py-1.5 fw-medium d-inline-flex align-items-center gap-1"
                          style={{
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            fontSize: '0.68rem',
                            padding: '0.3rem 0.65rem',
                          }}
                        >
                          <FontAwesomeIcon icon={typeStyle.icon} style={{ fontSize: '0.6rem' }} />
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="text-end fw-medium" style={{ color: textColor, whiteSpace: 'nowrap' }}>
                        <FontAwesomeIcon icon={faDollarSign} className="me-1" style={{ color: mutedColor, fontSize: '0.65rem' }} />
                        {parseFloat(tx.originalAmount).toLocaleString()} {tx.currency}
                      </td>
                      <td className="text-end" style={{ color: textColor, whiteSpace: 'nowrap' }}>
                        {tx.exchangeRate}
                      </td>
                      <td className="text-end fw-semibold" style={{ color: '#06b6d4', whiteSpace: 'nowrap' }}>
                        PKR {parseFloat(tx.convertedAmount).toLocaleString()}
                      </td>
                      <td className="text-end" style={{ color: '#ef4444', whiteSpace: 'nowrap' }}>
                        PKR {parseFloat(tx.bankCharges).toLocaleString()}
                      </td>
                      <td>
                        <span className="premium-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                          <span className="badge-dot" style={{ background: statusStyle.color }} />
                          {tx.approvalStatus}
                        </span>
                      </td>
                      <td style={{ color: mutedColor }}>{tx.createdBy}</td>
                      <td className="text-center">
                        <div className="d-flex gap-1 justify-content-center" style={{ minWidth: '260px' }}>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#3b82f6', background: isDark ? '#1e293b' : '#dbeafe' }}
                            title="View"
                            onClick={() => setViewingTx(tx)}
                          >
                            <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#64748b', background: isDark ? '#1e293b' : '#e2e8f0' }}
                            title="Print"
                            onClick={() => handlePrint({ type: 'single', tx })}
                          >
                            <FontAwesomeIcon icon={faPrint} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#10b981', background: isDark ? '#1e293b' : '#d1fae5' }}
                            title="Approve"
                            onClick={() => handleApprove(tx)}
                          >
                            <FontAwesomeIcon icon={faCheckDouble} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#ef4444', background: isDark ? '#1e293b' : '#fee2e2' }}
                            title="Reject"
                            onClick={() => handleReject(tx)}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#06b6d4', background: isDark ? '#1e293b' : '#cffafe' }}
                            title="Schedule"
                            onClick={() => openSchedule(tx)}
                          >
                            <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#8b5cf6', background: isDark ? '#1e293b' : '#ede9fe' }}
                            title="Copy"
                            onClick={() => handleCopy(tx)}
                          >
                            <FontAwesomeIcon icon={faCopy} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#f59e0b', background: isDark ? '#1e293b' : '#fef3c7' }}
                            title="Edit"
                            onClick={() => handleOpenEdit(tx)}
                          >
                            <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button
                            className="premium-action-btn"
                            style={{ color: '#ef4444', background: isDark ? '#1e293b' : '#fce7e7' }}
                            title="Delete"
                            onClick={() => handleDelete(tx.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.75rem' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mt-4 enter-anim">
        <div className="section-header">
          <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #06b6d4, #0d9488)' }} />
          <h6 style={{ color: textColor }}>
            <FontAwesomeIcon icon={faCog} className="me-2" style={{ color: '#8b5cf6', fontSize: '0.9rem' }} />
            {t('Advanced Features')}
          </h6>
        </div>
        <div className="row g-3">
          {advancedFeatures.map((feature, idx) => (
            <div key={idx} className="col-xl-4 col-lg-4 col-md-6">
              <div
                className="premium-feature-card glass-card rounded-4 p-3 d-flex align-items-start gap-3"
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  height: '100%',
                  boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onClick={() => handleOpenFeature(feature)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenFeature(feature); } }}
                title={`Open: ${feature.label}`}
              >
                <div
                  className="feature-icon d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    background: `${feature.color}15`,
                    color: feature.color,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <div>
                  <h6 className="fw-semibold mb-1" style={{ color: textColor, fontSize: '0.85rem' }}>
                    {t(feature.label)}
                  </h6>
                  <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem', lineHeight: 1.4 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <DialogBox
        show={showForm}
        onClose={handleCloseForm}
        title={editingTransaction ? t('Edit FX Transaction') : t('New FX Transaction')}
        size="xl"
        showClose={true}
      >
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Transaction Number */}
                  <div className="col-md-4" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Transaction Number')}</label>
                    <input
                      type="text"
                      value={formData.transactionNumber}
                      readOnly
                      className="tx-input"
                      style={{ ...inputStyle, background: isDark ? '#1a1d29' : '#f1f5f9', cursor: 'not-allowed' }}
                    />
                  </div>

                  {/* Transaction Date */}
                  <div className="col-md-4" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Transaction Date')} <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      value={formData.transactionDate}
                      onChange={(e) => handleFormChange('transactionDate', e.target.value)}
                      className={`tx-input ${errors.transactionDate ? 'error' : ''}`}
                      style={{
                        ...inputStyle,
                        borderColor: errors.transactionDate ? '#ef4444' : borderColor,
                      }}
                    />
                    {errors.transactionDate && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.transactionDate}</small>
                    )}
                  </div>

                  {/* Reference Number */}
                  <div className="col-md-4" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Reference Number')}</label>
                    <input
                      type="text"
                      placeholder="e.g. INV-001"
                      value={formData.referenceNumber}
                      onChange={(e) => handleFormChange('referenceNumber', e.target.value)}
                      className="tx-input"
                      style={inputStyle}
                    />
                  </div>

                  {/* Company */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Company')} <span className="text-danger">*</span></label>
                    <select
                      value={formData.company}
                      onChange={(e) => handleFormChange('company', e.target.value)}
                      className={`tx-input ${errors.company ? 'error' : ''}`}
                      style={{
                        ...selectStyle,
                        borderColor: errors.company ? '#ef4444' : borderColor,
                      }}
                    >
                      <option value="">{t('Select Company')}</option>
                      {companies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.company && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.company}</small>
                    )}
                  </div>

                  {/* Branch */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Branch')} <span className="text-danger">*</span></label>
                    <select
                      value={formData.branch}
                      onChange={(e) => handleFormChange('branch', e.target.value)}
                      className={`tx-input ${errors.branch ? 'error' : ''}`}
                      style={{
                        ...selectStyle,
                        borderColor: errors.branch ? '#ef4444' : borderColor,
                      }}
                    >
                      <option value="">{t('Select Branch')}</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.branch && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.branch}</small>
                    )}
                  </div>

                  {/* Bank Account */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Bank Account')} <span className="text-danger">*</span></label>
                    <select
                      value={formData.bankAccount}
                      onChange={(e) => handleFormChange('bankAccount', e.target.value)}
                      className={`tx-input ${errors.bankAccount ? 'error' : ''}`}
                      style={{
                        ...selectStyle,
                        borderColor: errors.bankAccount ? '#ef4444' : borderColor,
                      }}
                    >
                      <option value="">{t('Select Bank Account')}</option>
                      <option value="HBL FCY-001">HBL FCY-001</option>
                      <option value="HBL FCY-002">HBL FCY-002</option>
                      <option value="Meezan FCY-001">Meezan FCY-001</option>
                      <option value="ADCB FCY-001">ADCB FCY-001</option>
                      <option value="AlRajhi FCY-001">AlRajhi FCY-001</option>
                      <option value="UBL FCY-001">UBL FCY-001</option>
                    </select>
                    {errors.bankAccount && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.bankAccount}</small>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Currency')} <span className="text-danger">*</span></label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleFormChange('currency', e.target.value)}
                      className={`tx-input ${errors.currency ? 'error' : ''}`}
                      style={{
                        ...selectStyle,
                        borderColor: errors.currency ? '#ef4444' : borderColor,
                      }}
                    >
                      <option value="">{t('Select Currency')}</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="PKR">PKR - Pakistani Rupee</option>
                    </select>
                    {errors.currency && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.currency}</small>
                    )}
                  </div>

                  {/* Transaction Type */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Transaction Type')} <span className="text-danger">*</span></label>
                    <select
                      value={formData.transactionType}
                      onChange={(e) => handleFormChange('transactionType', e.target.value)}
                      className={`tx-input ${errors.transactionType ? 'error' : ''}`}
                      style={{
                        ...selectStyle,
                        borderColor: errors.transactionType ? '#ef4444' : borderColor,
                      }}
                    >
                      <option value="">{t('Select Type')}</option>
                      {transactionTypes.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                    </select>
                    {errors.transactionType && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.transactionType}</small>
                    )}
                  </div>

                  {/* Exchange Rate */}
                  <div className="col-md-3" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Exchange Rate')} <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-0"
                        style={{
                          background: isDark ? '#2d3248' : '#f1f5f9',
                          color: mutedColor,
                          borderRadius: '10px 0 0 10px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.exchangeRate}
                        onChange={(e) => handleFormChange('exchangeRate', e.target.value)}
                        className={`tx-input ${errors.exchangeRate ? 'error' : ''}`}
                        style={{
                          ...inputStyle,
                          borderRadius: '0 10px 10px 0',
                          borderColor: errors.exchangeRate ? '#ef4444' : borderColor,
                        }}
                      />
                    </div>
                    {errors.exchangeRate && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.exchangeRate}</small>
                    )}
                  </div>

                  {/* Original Amount */}
                  <div className="col-md-3" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Original Amount')} <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-0"
                        style={{
                          background: isDark ? '#2d3248' : '#f1f5f9',
                          color: mutedColor,
                          borderRadius: '10px 0 0 10px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <FontAwesomeIcon icon={faDollarSign} />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.originalAmount}
                        onChange={(e) => handleFormChange('originalAmount', e.target.value)}
                        className={`tx-input ${errors.originalAmount ? 'error' : ''}`}
                        style={{
                          ...inputStyle,
                          borderRadius: '0 10px 10px 0',
                          borderColor: errors.originalAmount ? '#ef4444' : borderColor,
                        }}
                      />
                    </div>
                    {errors.originalAmount && (
                      <small style={{ color: '#ef4444', fontSize: '0.7rem' }}>{errors.originalAmount}</small>
                    )}
                  </div>

                  {/* Converted Amount */}
                  <div className="col-md-3" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Converted Amount (PKR)')}</label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-0"
                        style={{
                          background: isDark ? '#2d3248' : '#f1f5f9',
                          color: mutedColor,
                          borderRadius: '10px 0 0 10px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                      </span>
                      <input
                        type="text"
                        value={formData.convertedAmount ? `PKR ${parseFloat(formData.convertedAmount).toLocaleString()}` : ''}
                        readOnly
                        className="tx-input"
                        style={{
                          ...inputStyle,
                          borderRadius: '0 10px 10px 0',
                          background: isDark ? '#1a1d29' : '#f1f5f9',
                          cursor: 'not-allowed',
                          fontWeight: 600,
                          color: formData.convertedAmount ? '#06b6d4' : mutedColor,
                        }}
                      />
                    </div>
                    {formData.convertedAmount && (
                      <small style={{ color: '#06b6d4', fontSize: '0.7rem' }}>
                        <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                        {t('Auto-calculated')}
                      </small>
                    )}
                  </div>

                  {/* Bank Charges */}
                  <div className="col-md-3" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Bank Charges')}</label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-0"
                        style={{
                          background: isDark ? '#2d3248' : '#f1f5f9',
                          color: mutedColor,
                          borderRadius: '10px 0 0 10px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <FontAwesomeIcon icon={faReceipt} />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.bankCharges}
                        onChange={(e) => handleFormChange('bankCharges', e.target.value)}
                        className="tx-input"
                        style={{
                          ...inputStyle,
                          borderRadius: '0 10px 10px 0',
                        }}
                      />
                    </div>
                  </div>

                  {/* Tax */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Tax')}</label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-0"
                        style={{
                          background: isDark ? '#2d3248' : '#f1f5f9',
                          color: mutedColor,
                          borderRadius: '10px 0 0 10px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <FontAwesomeIcon icon={faPercent} />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.tax}
                        onChange={(e) => handleFormChange('tax', e.target.value)}
                        className="tx-input"
                        style={{
                          ...inputStyle,
                          borderRadius: '0 10px 10px 0',
                        }}
                      />
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div className="col-md-6" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Approval Status')}</label>
                    <select
                      value={formData.approvalStatus}
                      onChange={(e) => handleFormChange('approvalStatus', e.target.value)}
                      className="tx-input"
                      style={selectStyle}
                    >
                      {Object.keys(statusBadgeStyles).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-12" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Description')}</label>
                    <textarea
                      rows="3"
                      placeholder="Enter transaction description..."
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="tx-input"
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        minHeight: '80px',
                      }}
                    />
                  </div>

                  {/* Supporting Documents */}
                  <div className="col-12" style={formGroupStyle}>
                    <label style={labelStyle}>{t('Supporting Documents')}</label>
                    <div
                      className="d-flex align-items-center gap-3 p-3 rounded-3 premium-card glass-card"
                      style={{
                        border: `2px dashed ${borderColor}`,
                        background: isDark ? '#1a1d29' : '#f8fafc',
                        cursor: 'pointer',
                      }}
                      onClick={() => document.getElementById('fileUpload').click()}
                    >
                      <FontAwesomeIcon icon={faCloudUploadAlt} style={{ color: '#06b6d4', fontSize: '1.5rem' }} />
                      <div>
                        <div style={{ color: textColor, fontSize: '0.85rem', fontWeight: 500 }}>
                          {formData.supportingDocuments ? formData.supportingDocuments.name : t('Click to upload or drag & drop')}
                        </div>
                        <small style={{ color: mutedColor, fontSize: '0.7rem' }}>PDF, JPG, PNG (max 10MB)</small>
                      </div>
                    </div>
                    <input
                      id="fileUpload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  className="d-flex justify-content-end gap-2 mt-4 pt-3"
                  style={{ borderTop: `1px solid ${borderColor}` }}
                >
                  <button
                    type="button"
                    className="btn border-0 premium-btn d-flex align-items-center gap-2"
                    style={{
                      background: isDark ? '#2d3248' : '#f1f5f9',
                      color: textColor,
                      borderRadius: '10px',
                      padding: '0.5rem 1.5rem',
                      fontSize: '0.85rem',
                    }}
                    onClick={handleCloseForm}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #0d9488)',
                      borderRadius: '10px',
                      padding: '0.5rem 1.5rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {editingTransaction ? t('Update') : t('Save')}
                  </button>
                </div>
              </form>
      </DialogBox>

      {/* View Transaction Modal */}
      <DialogBox
        show={!!viewingTx}
        onClose={() => setViewingTx(null)}
        title={`Transaction Details — ${viewingTx?.transactionNumber || ''}`}
        size="xl"
        showClose={true}
      >
        {viewingTx && (
          <div>
            <div className="row g-3">
              {[
                ['Transaction Number', viewingTx.transactionNumber],
                ['Transaction Date', viewingTx.transactionDate],
                ['Reference Number', viewingTx.referenceNumber || '—'],
                ['Company', viewingTx.company],
                ['Branch', viewingTx.branch],
                ['Bank Account', viewingTx.bankAccount],
                ['Currency', viewingTx.currency],
                ['Transaction Type', viewingTx.transactionType],
                ['Exchange Rate', viewingTx.exchangeRate],
                ['Original Amount', `${parseFloat(viewingTx.originalAmount).toLocaleString()} ${viewingTx.currency}`],
                ['Converted Amount', `PKR ${parseFloat(viewingTx.convertedAmount).toLocaleString()}`],
                ['Bank Charges', `PKR ${parseFloat(viewingTx.bankCharges).toLocaleString()}`],
                ['Tax', `PKR ${parseFloat(viewingTx.tax).toLocaleString()}`],
                ['Approval Status', viewingTx.approvalStatus],
                ['Scheduled For', viewingTx.scheduledFor || '—'],
                ['Created By', viewingTx.createdBy],
              ].map(([label, value]) => (
                <div className="col-md-4" key={label} style={formGroupStyle}>
                  <label style={labelStyle}>{label}</label>
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      background: isDark ? '#1a1d29' : '#f8fafc',
                      border: `1px solid ${borderColor}`,
                      fontSize: '0.85rem',
                      color: textColor,
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
              <div className="col-12" style={formGroupStyle}>
                <label style={labelStyle}>{t('Description')}</label>
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: isDark ? '#1a1d29' : '#f8fafc',
                    border: `1px solid ${borderColor}`,
                    fontSize: '0.85rem',
                    color: textColor,
                  }}
                >
                  {viewingTx.description || '—'}
                </div>
              </div>
            </div>

            <div
              className="d-flex flex-wrap justify-content-end gap-2 mt-4 pt-3"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              <button
                type="button"
                className="btn border-0 premium-btn d-flex align-items-center gap-2"
                style={{
                  background: isDark ? '#2d3248' : '#f1f5f9',
                  color: textColor,
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => handlePrint({ type: 'single', tx: viewingTx })}
              >
                <FontAwesomeIcon icon={faPrint} />
                {t('Print')}
              </button>
              <button
                type="button"
                className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => { handleApprove(viewingTx); }}
              >
                <FontAwesomeIcon icon={faCheckDouble} />
                {t('Approve')}
              </button>
              <button
                type="button"
                className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => { handleReject(viewingTx); }}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
                {t('Reject')}
              </button>
              <button
                type="button"
                className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #0d9488)',
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => { openSchedule(viewingTx); setViewingTx(null); }}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
                {t('Schedule')}
              </button>
              <button
                type="button"
                className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => handleCopy(viewingTx)}
              >
                <FontAwesomeIcon icon={faCopy} />
                {t('Copy')}
              </button>
              <button
                type="button"
                className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => { handleOpenEdit(viewingTx); setViewingTx(null); }}
              >
                <FontAwesomeIcon icon={faEdit} />
                {t('Edit')}
              </button>
              <button
                type="button"
                className="btn border-0 premium-btn d-flex align-items-center gap-2"
                style={{
                  background: isDark ? '#2d3248' : '#f1f5f9',
                  color: textColor,
                  borderRadius: '10px',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                }}
                onClick={() => setViewingTx(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
                {t('Close')}
              </button>
            </div>
          </div>
        )}
      </DialogBox>

      {/* Schedule Transaction Modal */}
      <DialogBox
        show={!!schedulingTx}
        onClose={() => setSchedulingTx(null)}
        title={`Schedule Transaction — ${schedulingTx?.transactionNumber || ''}`}
        size="md"
        showClose={true}
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{t('Scheduled Date')} <span className="text-danger">*</span></label>
          <input
            type="date"
            value={scheduleForm.scheduledFor}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
            className="tx-input"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{t('Schedule Note')}</label>
          <textarea
            rows="3"
            placeholder="Optional note for this schedule..."
            value={scheduleForm.note}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, note: e.target.value }))}
            className="tx-input"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div
          className="d-flex justify-content-end gap-2 pt-3"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <button
            type="button"
            className="btn border-0 premium-btn d-flex align-items-center gap-2"
            style={{
              background: isDark ? '#2d3248' : '#f1f5f9',
              color: textColor,
              borderRadius: '10px',
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
            }}
            onClick={() => setSchedulingTx(null)}
          >
            <FontAwesomeIcon icon={faTimes} />
            {t('Cancel')}
          </button>
          <button
            type="button"
            className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0d9488)',
              borderRadius: '10px',
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
            }}
            onClick={saveSchedule}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            {t('Save Schedule')}
          </button>
        </div>
      </DialogBox>

      {/* Delete Transaction Confirmation */}
      <DialogBox.Confirm
        show={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        onConfirm={confirmDelete}
        title="Delete FX Transaction"
        message={`Are you sure you want to delete transaction "${deletingTx?.transactionNumber || deletingTx?.id}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Approve / Reject Confirmation */}
      <DialogBox.Confirm
        show={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmStatusChange}
        title={confirmAction?.action === 'approve' ? 'Approve FX Transaction' : 'Reject FX Transaction'}
        message={`Are you sure you want to ${confirmAction?.action === 'approve' ? 'approve' : 'reject'} transaction "${confirmAction?.tx?.transactionNumber || ''}"?`}
        confirmLabel={confirmAction?.action === 'approve' ? 'Approve' : 'Reject'}
        variant={confirmAction?.action === 'approve' ? 'success' : 'danger'}
      />

      {/* Advanced Feature Workspace */}
      <DialogBox
        show={!!featureModal}
        onClose={() => setFeatureModal(null)}
        title={featureModal?.feature?.label || 'Advanced Feature'}
        size="xl"
        showClose={true}
      >
        {featureModal && (
          <div>
            {featureModal.type === 'approval' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Review and approve pending FX transactions below. Approving updates the transaction status immediately.
                </p>
                <div className="table-responsive">
                  <table className="table align-middle mb-0 mc-table">
                    <thead>
                      <tr>
                        <th>Transaction No.</th>
                        <th>Date</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Converted</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.filter(tx => tx.approvalStatus === 'Pending' || tx.approvalStatus === 'In Progress').length === 0 ? (
                        <tr><td colSpan="8" className="text-center py-4" style={{ color: mutedColor }}>No transactions awaiting approval.</td></tr>
                      ) : (
                        transactions
                          .filter(tx => tx.approvalStatus === 'Pending' || tx.approvalStatus === 'In Progress')
                          .map(tx => (
                            <tr key={tx.id}>
                              <td className="fw-semibold" style={{ color: '#06b6d4', fontSize: '0.82rem' }}>{tx.transactionNumber}</td>
                              <td style={{ color: textColor }}>{tx.transactionDate}</td>
                              <td style={{ color: textColor }}>{tx.company}</td>
                              <td style={{ color: textColor }}>{tx.transactionType}</td>
                              <td className="text-end" style={{ color: textColor }}>{Number(tx.originalAmount).toLocaleString()} {tx.currency}</td>
                              <td className="text-end fw-semibold" style={{ color: '#06b6d4' }}>PKR {Number(tx.convertedAmount).toLocaleString()}</td>
                              <td>
                                <span className="premium-badge" style={{ background: '#fef9c3', color: '#ca8a04' }}>
                                  <span className="badge-dot" style={{ background: '#ca8a04' }} />
                                  {tx.approvalStatus}
                                </span>
                              </td>
                              <td className="text-center">
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="premium-action-btn"
                                    style={{ color: '#10b981', background: isDark ? '#1e293b' : '#d1fae5' }}
                                    title="Approve"
                                    onClick={() => handleApprove(tx)}
                                  >
                                    <FontAwesomeIcon icon={faCheckDouble} style={{ fontSize: '0.75rem' }} />
                                  </button>
                                  <button
                                    className="premium-action-btn"
                                    style={{ color: '#ef4444', background: isDark ? '#1e293b' : '#fee2e2' }}
                                    title="Reject"
                                    onClick={() => handleReject(tx)}
                                  >
                                    <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: '0.75rem' }} />
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
            {featureModal.type === 'audit' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Audit trail of all actions performed on FX transactions in this session.
                </p>
                <div className="table-responsive">
                  <table className="table align-middle mb-0 mc-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Transaction</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-4" style={{ color: mutedColor }}>No audit records yet. Actions you take on transactions will appear here.</td></tr>
                      ) : (
                        auditLog.map(entry => (
                          <tr key={entry.id}>
                            <td style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{entry.at}</td>
                            <td className="fw-semibold" style={{ color: '#06b6d4', fontSize: '0.82rem' }}>{entry.transactionNumber}</td>
                            <td><span className="premium-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{entry.action}</span></td>
                            <td style={{ color: textColor }}>{entry.detail}</td>
                            <td style={{ color: mutedColor }}>{entry.by}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {featureModal.type === 'journals' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Multi-currency journal summary derived from current FX transactions.
                </p>
                {(() => {
                  const grouped = {};
                  transactions.forEach(tx => {
                    const key = tx.currency;
                    if (!grouped[key]) grouped[key] = { currency: key, count: 0, originalTotal: 0, convertedTotal: 0 };
                    grouped[key].count += 1;
                    grouped[key].originalTotal += Number(tx.originalAmount) || 0;
                    grouped[key].convertedTotal += Number(tx.convertedAmount) || 0;
                  });
                  const rows = Object.values(grouped);
                  return rows.length === 0 ? (
                    <div className="text-center py-4" style={{ color: mutedColor }}>No transactions to summarize.</div>
                  ) : (
                    <table className="table align-middle mb-0 mc-table">
                      <thead>
                        <tr>
                          <th>Currency</th>
                          <th className="text-end">Transactions</th>
                          <th className="text-end">Original Total</th>
                          <th className="text-end">Converted (PKR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(row => (
                          <tr key={row.currency}>
                            <td className="fw-bold" style={{ color: '#06b6d4' }}>{row.currency}</td>
                            <td className="text-end" style={{ color: textColor }}>{row.count}</td>
                            <td className="text-end" style={{ color: textColor }}>{row.originalTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                            <td className="text-end fw-semibold" style={{ color: '#06b6d4' }}>PKR {row.convertedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            )}
            {featureModal.type === 'ledger' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Automatic ledger posting preview for approved transactions.
                </p>
                {(() => {
                  const approved = transactions.filter(tx => tx.approvalStatus === 'Approved');
                  if (approved.length === 0) {
                    return <div className="text-center py-4" style={{ color: mutedColor }}>No approved transactions to post. Approve a transaction first.</div>;
                  }
                  const entries = [];
                  approved.forEach(tx => {
                    entries.push({ tx: tx.transactionNumber, date: tx.transactionDate, account: `${tx.currency} FCY Bank Account`, debit: `PKR ${Number(tx.convertedAmount).toLocaleString()}`, credit: '—' });
                    entries.push({ tx: tx.transactionNumber, date: tx.transactionDate, account: 'Accounts Payable / Receivable', debit: '—', credit: `PKR ${Number(tx.convertedAmount).toLocaleString()}` });
                  });
                  return (
                    <table className="table align-middle mb-0 mc-table">
                      <thead>
                        <tr>
                          <th>Transaction</th>
                          <th>Date</th>
                          <th>Account</th>
                          <th className="text-end">Debit</th>
                          <th className="text-end">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((e, i) => (
                          <tr key={i}>
                            <td className="fw-semibold" style={{ color: '#06b6d4', fontSize: '0.8rem' }}>{e.tx}</td>
                            <td style={{ color: textColor }}>{e.date}</td>
                            <td style={{ color: textColor }}>{e.account}</td>
                            <td className="text-end" style={{ color: '#10b981' }}>{e.debit}</td>
                            <td className="text-end" style={{ color: '#ef4444' }}>{e.credit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            )}
            {featureModal.type === 'gainloss' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Realized / unrealized exchange gain or loss estimate for completed transactions.
                </p>
                {(() => {
                  const completed = transactions.filter(tx => tx.approvalStatus === 'Completed' || tx.approvalStatus === 'Approved');
                  if (completed.length === 0) {
                    return <div className="text-center py-4" style={{ color: mutedColor }}>No completed transactions to calculate gains for.</div>;
                  }
                  const totalGain = completed.reduce((sum, tx) => {
                    const converted = Number(tx.convertedAmount) || 0;
                    const original = Number(tx.originalAmount) || 0;
                    const rate = Number(tx.exchangeRate) || 0;
                    const baseValue = rate > 0 ? (converted / rate) * original : 0;
                    return sum + (converted - baseValue);
                  }, 0);
                  return (
                    <div>
                      <div
                        className="rounded-4 p-4 mb-3 d-flex align-items-center gap-3"
                        style={{ background: totalGain >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${totalGain >= 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: 52, height: 52, borderRadius: '1rem', background: totalGain >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: totalGain >= 0 ? '#10b981' : '#ef4444', fontSize: '1.3rem' }}
                        >
                          <FontAwesomeIcon icon={faCalculator} />
                        </div>
                        <div>
                          <div style={{ color: mutedColor, fontSize: '0.78rem' }}>Net Estimated Gain / (Loss)</div>
                          <div className="fw-bold" style={{ color: totalGain >= 0 ? '#10b981' : '#ef4444', fontSize: '1.4rem' }}>
                            {totalGain >= 0 ? '+' : '−'}PKR {Math.abs(totalGain).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      <div style={{ color: mutedColor, fontSize: '0.78rem' }}>
                        Based on {completed.length} completed transaction(s). This is an estimate using recorded rates; actual gain/loss depends on settlement date rates.
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {featureModal.type === 'attachment' && (
              <div>
                <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Select a transaction and upload a supporting document (PDF, JPG, PNG).
                </p>
                <div className="mb-3">
                  <label style={{ ...labelStyle, fontSize: '0.8rem' }}>Transaction</label>
                  <select
                    className="tx-input"
                    style={selectStyle}
                    value={attachingTx?.id || ''}
                    onChange={(e) => setAttachingTx(transactions.find(tx => String(tx.id) === e.target.value) || null)}
                  >
                    <option value="">Select transaction...</option>
                    {transactions.map(tx => <option key={tx.id} value={tx.id}>{tx.transactionNumber} — {tx.description || tx.transactionType}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label style={{ ...labelStyle, fontSize: '0.8rem' }}>Document</label>
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded-3"
                    style={{ border: `2px dashed ${borderColor}`, background: isDark ? '#1a1d29' : '#f8fafc', cursor: 'pointer' }}
                    onClick={() => document.getElementById('featureFileUpload').click()}
                  >
                    <FontAwesomeIcon icon={faCloudUploadAlt} style={{ color: '#06b6d4', fontSize: '1.3rem' }} />
                    <div>
                      <div style={{ color: textColor, fontSize: '0.82rem', fontWeight: 500 }}>
                        {attachingFile ? attachingFile.name : 'Click to upload or drag & drop'}
                      </div>
                      <small style={{ color: mutedColor, fontSize: '0.7rem' }}>PDF, JPG, PNG (max 10MB)</small>
                    </div>
                  </div>
                  <input
                    id="featureFileUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={(e) => setAttachingFile(e.target.files[0])}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <button
                    type="button"
                    className="btn border-0 premium-btn d-flex align-items-center gap-2"
                    style={{ background: isDark ? '#2d3248' : '#f1f5f9', color: textColor, borderRadius: '10px', padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
                    onClick={() => setFeatureModal(null)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn border-0 text-white premium-btn d-flex align-items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #0d9488)', borderRadius: '10px', padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
                    onClick={() => {
                      if (!attachingTx) { addNotification?.('Please select a transaction.', 'error'); return; }
                      if (!attachingFile) { addNotification?.('Please choose a document to upload.', 'error'); return; }
                      setTransactions(prev => prev.map(t => t.id === attachingTx.id ? { ...t, attachmentName: attachingFile.name } : t));
                      logAudit(attachingTx, 'Attachment Added', `Uploaded ${attachingFile.name}`);
                      addNotification?.(`Document "${attachingFile.name}" attached to ${attachingTx.transactionNumber}.`, 'success');
                      setAttachingFile(null);
                      setAttachingTx(null);
                      setFeatureModal(null);
                    }}
                  >
                    <FontAwesomeIcon icon={faPaperclip} />
                    Attach Document
                  </button>
                </div>
              </div>
            )}
            {featureModal.type === 'info' && (
              <div>
                <p style={{ color: textColor, fontSize: '0.9rem', lineHeight: 1.6 }}>{featureModal.feature?.desc}</p>
                {featureModal.feature?.label === 'Bank Reconciliation' && (
                  <div className="mt-3">
                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10b981', fontSize: '1.2rem' }} />
                      <div>
                        <div className="fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>Reconciliation Ready</div>
                        <small style={{ color: mutedColor }}>Your {transactions.length} FX transactions can be matched against foreign currency bank statements.</small>
                      </div>
                    </div>
                  </div>
                )}
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
              {printPayload.type === 'single' ? 'FX Transaction Voucher' : (printPayload.title || 'FX Transactions Report')}
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              Generated: {new Date().toLocaleString()}
            </div>
          </div>
          {printPayload.type === 'single' ? (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {(() => {
                  const t = printPayload.tx;
                  const rows = [
                    ['Transaction Number', t.transactionNumber],
                    ['Transaction Date', t.transactionDate],
                    ['Reference Number', t.referenceNumber || '—'],
                    ['Company', t.company],
                    ['Branch', t.branch],
                    ['Bank Account', t.bankAccount],
                    ['Currency', t.currency],
                    ['Transaction Type', t.transactionType],
                    ['Exchange Rate', t.exchangeRate],
                    ['Original Amount', `${Number(t.originalAmount).toLocaleString()} ${t.currency}`],
                    ['Converted Amount', `PKR ${Number(t.convertedAmount).toLocaleString()}`],
                    ['Bank Charges', `PKR ${Number(t.bankCharges).toLocaleString()}`],
                    ['Tax', `PKR ${Number(t.tax).toLocaleString()}`],
                    ['Approval Status', t.approvalStatus],
                    ['Scheduled For', t.scheduledFor || '—'],
                    ['Created By', t.createdBy],
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
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{printPayload.tx.description || '—'}</td>
                </tr>
              </table>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Transaction No.', 'Date', 'Company', 'Branch', 'Currency', 'Type', 'Original', 'Converted', 'Status'].map(h => (
                    <th key={h} style={{ border: '1px solid #cbd5e1', padding: '6px 8px', background: '#f1f5f9', textAlign: 'left', fontSize: '11px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(printPayload.items || []).map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.transactionNumber}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.transactionDate}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.company}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.branch}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.currency}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.transactionType}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'right' }}>{Number(tx.originalAmount).toLocaleString()}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'right' }}>{Number(tx.convertedAmount).toLocaleString()}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{tx.approvalStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .scale-up { animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes modalScaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        #fx-print-area { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          #fx-print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 24px; color: #111; }
          #fx-print-area * { visibility: visible !important; }
        }
      `}} />
    </div>
  );
};

export default FxTransactions;
