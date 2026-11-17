import React, { useState, useEffect, useMemo } from 'react';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faFileInvoice, faCoins, faReceipt, faPlus,
  faCheckCircle, faTriangleExclamation, faRobot, faDownload,
  faSearch, faFilter, faEye, faPaperclip, faScaleBalanced,
  faPrint, faFileExcel, faFileCode, faUndo, faCheck, faFilePdf,
  faFileWord, faFileAlt, faFileExport,
  faBan, faHistory, faShieldHalved, faBrain, faEdit, faFileSignature, faEnvelope, faTrashCan
} from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------
// DATASETS & DICTIONARIES
// ----------------------------------------------------------------------
const CHART_OF_ACCOUNTS = [
  { code: '510100', name: 'Salary Expense', type: 'Expense' },
  { code: '510200', name: 'Employer Provident Fund Expense', type: 'Expense' },
  { code: '510300', name: 'Employer EOBI Expense', type: 'Expense' },
  { code: '510400', name: 'Medical Expense', type: 'Expense' },
  { code: '510500', name: 'Bonus Expense', type: 'Expense' },
  { code: '510600', name: 'Allowance Expense', type: 'Expense' },
  { code: '510700', name: 'Overtime Expense', type: 'Expense' },
  { code: '510800', name: 'Travel Expense', type: 'Expense' },
  { code: '510900', name: 'Office Supplies Expense', type: 'Expense' },
  { code: '210100', name: 'Salary Payable', type: 'Liability' },
  { code: '210200', name: 'Income Tax Payable', type: 'Liability' },
  { code: '210300', name: 'Provident Fund Payable', type: 'Liability' },
  { code: '210400', name: 'EOBI Payable', type: 'Liability' },
  { code: '112040', name: 'Employee Advances Receivable', type: 'Asset' },
  { code: '112030', name: 'Employee Loans Receivable', type: 'Asset' },
  { code: '110100', name: 'Cash', type: 'Asset' },
  { code: '110200', name: 'Bank', type: 'Asset' },
];

const INITIAL_PENDING_PAYROLL_RUNS = [
  { batch: 'BATCH-2026-JUL-REGULAR', month: 'July 2026', employees: 180, gross: 6200000, net: 5150000, deductions: 1050000, allowances: 480000, bonuses: 250000, overtime: 150000, employerPF: 320000, employerEOBI: 110000, loans: 120000, advances: 80000, taxes: 520000, status: 'Finalized', period: 'FY 2026-P07', company: 'Manage Core Enterprise Ltd', branch: 'HQ Karachi Office' },
  { batch: 'BATCH-2026-JUL-MIDMONTH', month: 'July 2026', employees: 120, gross: 4100000, net: 3400000, deductions: 700000, allowances: 290000, bonuses: 0, overtime: 90000, employerPF: 210000, employerEOBI: 70000, loans: 80000, advances: 50000, taxes: 350000, status: 'Finalized', period: 'FY 2026-P07', company: 'Manage Core Enterprise Ltd', branch: 'NY Corporate Hub' }
];

const INITIAL_PENDING_ADVANCES = [
  { reqNo: 'ADV-REQ-2026-88', employee: 'Kashif Raza', empId: 'MC-1140', dept: 'Customer Success', amount: 30000, status: 'Approved', type: 'Salary Advance', date: '2026-07-02', recoveryMonth: 'August 2026', recoveryPeriod: 2, designation: 'Customer Success Specialist', currency: 'PKR', method: 'Payroll Deduction' },
  { reqNo: 'ADV-REQ-2026-89', employee: 'Aisha Malik', empId: 'MC-1202', dept: 'Marketing & PR', amount: 50000, status: 'Approved', type: 'Emergency Loan', date: '2026-07-03', recoveryMonth: 'August 2026', recoveryPeriod: 5, designation: 'Creative Lead', currency: 'PKR', method: 'Payroll Deduction' }
];

const INITIAL_PENDING_REIMBURSEMENTS = [
  { claimNo: 'EXP-99043', employee: 'Faisal Khan', empId: 'MC-1035', expenseType: 'Travel & Lodging', amount: 12500, tax: 800, project: 'Dubai Expo 2026', approvalDate: '2026-07-05', status: 'Approved', dept: 'Sales & BD', designation: 'Business Development Manager', currency: 'PKR', vendor: 'Pearl Continental' },
  { claimNo: 'EXP-99044', employee: 'Mariam Ali', empId: 'MC-1090', expenseType: 'Office Supplies', amount: 8400, tax: 450, project: 'N/A', approvalDate: '2026-07-06', status: 'Approved', dept: 'HR & Operations', designation: 'Operations Specialist', currency: 'PKR', vendor: 'Office Depot' }
];

const INITIAL_PAYROLL_POSTINGS = [
  {
    postingNo: 'PP-2026-001',
    batch: 'BATCH-2026-JUN-REGULAR',
    month: 'June 2026',
    postingDate: '2026-06-30',
    journalDate: '2026-06-30',
    company: 'Manage Core Enterprise Ltd',
    branch: 'HQ Karachi Office',
    employees: 145,
    grossSalary: 5100000,
    netPay: 4250000,
    debit: 5420000,
    credit: 5420000,
    difference: 0,
    journalNumber: 'JV-2026-702',
    reference: 'REF-PR-JUN-REG',
    postedBy: 'CFO Office (Ahsan R.)',
    status: 'Posted',
    approvalStatus: 'Approved',
    createdDate: '2026-06-30 09:15 AM',
    approvedBy: 'Chief Accountant (Fatima Z.)',
    overtime: 120000,
    bonus: 200000,
    deductions: 850000,
    employerPF: 280000,
    employerEOBI: 90000,
    taxes: 420000,
    notes: 'Central June payroll vouchers for Karachi branch.'
  },
  {
    postingNo: 'PP-2026-002',
    batch: 'BATCH-2026-JUN-BONUS',
    month: 'June 2026',
    postingDate: '2026-07-01',
    journalDate: '2026-07-01',
    company: 'Manage Core Enterprise Ltd',
    branch: 'NY Corporate Hub',
    employees: 48,
    grossSalary: 1350000,
    netPay: 1120000,
    debit: 1350000,
    credit: 1350000,
    difference: 0,
    journalNumber: 'JV-2026-705',
    reference: 'REF-PR-JUN-BON',
    postedBy: 'Chief Accountant (Fatima Z.)',
    status: 'Posted',
    approvalStatus: 'Approved',
    createdDate: '2026-07-01 11:30 AM',
    approvedBy: 'Financial Controller (Hamza T.)',
    overtime: 0,
    bonus: 400000,
    deductions: 230000,
    employerPF: 70000,
    employerEOBI: 20000,
    taxes: 110000,
    notes: 'Q2 Performance bonus disbursement postings.'
  }
];

const INITIAL_ADVANCES = [
  {
    postingNo: 'ADVP-2026-001',
    employee: 'Muhammad Ali',
    employeeCode: 'MC-1024',
    department: 'Software Engineering',
    advanceRequest: 'ADV-REQ-2026-80',
    advanceType: 'Emergency Loan',
    requestDate: '2026-06-25',
    postingDate: '2026-06-26',
    bankCash: 'Meezan Bank - Operations',
    amount: 45000,
    status: 'Posted',
    approvalStatus: 'Approved',
    journalNumber: 'JV-2026-810',
    recoveryStart: 'July 2026',
    recoveryPeriod: 3,
    remainingBalance: 30000,
    recoveredAmount: 15000,
    postedBy: 'Finance Officer (Zain A.)',
    reference: 'REF-ADV-M-ALI',
    notes: 'First installment of 15k recovered in June/July payroll.'
  }
];

const INITIAL_REIMBURSEMENTS = [
  {
    id: 'REIM-2026-302',
    claimNo: 'EXP-99042',
    employee: 'Zeeshan Ahmed',
    employeeCode: 'MC-1102',
    department: 'Sales & BD',
    expenseCategory: 'Travel & Lodging',
    expenseType: 'Client Visit Payout',
    claimDate: '2026-06-28',
    postingDate: '2026-07-03',
    paymentMethod: 'Bank Transfer',
    bankCash: 'Meezan Bank - Operations',
    amount: 18450,
    currency: 'PKR',
    costCenter: 'CC-SALES-102',
    project: 'E-Commerce Upgrade',
    journalNumber: 'JV-2026-905',
    reference: 'REF-REIM-ZEESHAN',
    approvalStatus: 'Approved',
    paymentStatus: 'Paid',
    postingStatus: 'Posted',
    postedBy: 'Finance Officer (Zain A.)',
    notes: 'Reimbursement for regional logistics meetings.'
  }
];

const ErpPayrollHrIntegration = ({ initialTab = 'hub' }) => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);
  };

  // Nav tab state
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const onRefresh = () => addNotification?.('Payroll data refreshed.', 'success');
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '', type: '', action: 'reverse', row: null });

  // Master lists inside React state for interactivity
  const [payrollPostings, setPayrollPostings] = useState(INITIAL_PAYROLL_POSTINGS);
  const [advances, setAdvances] = useState(INITIAL_ADVANCES);
  const [reimbursements, setReimbursements] = useState(INITIAL_REIMBURSEMENTS);

  const [pendingPayrollRuns, setPendingPayrollRuns] = useState(INITIAL_PENDING_PAYROLL_RUNS);
  const [pendingAdvances, setPendingAdvances] = useState(INITIAL_PENDING_ADVANCES);
  const [pendingReimbursements, setPendingReimbursements] = useState(INITIAL_PENDING_REIMBURSEMENTS);

  // Search, Filter panel, selection states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterParams, setFilterParams] = useState({
    company: 'All',
    branch: 'All',
    period: 'All',
    department: 'All',
    status: 'All',
    currency: 'PKR',
    costCenter: 'All',
    project: 'All'
  });

  // Selected row state for details drawer
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(''); // 'payroll', 'advance', 'reimbursement'
  const [detailsActiveTab, setDetailsActiveTab] = useState('Overview');

  // Wizards triggers
  const [showPayrollWizard, setShowPayrollWizard] = useState(false);
  const [showAdvanceWizard, setShowAdvanceWizard] = useState(false);
  const [showReimbursementWizard, setShowReimbursementWizard] = useState(false);

  // Wizard Steps
  const [payrollStep, setPayrollStep] = useState(1);
  const [advanceStep, setAdvanceStep] = useState(1);
  const [reimbursementStep, setReimbursementStep] = useState(1);

  // Wizard Form States
  const [payrollForm, setPayrollForm] = useState({
    company: 'Manage Core Enterprise Ltd',
    branch: 'HQ Karachi Office',
    batch: 'BATCH-2026-JUL-REGULAR',
    period: 'FY 2026-P07',
    month: 'July 2026',
    currency: 'PKR',
    postingDate: '2026-07-07',
    journalDate: '2026-07-07',
    reference: 'REF-PP-JUL-REG',
    notes: 'Posting July 2026 regular payroll run data into General Ledger.',
    employees: 180,
    grossSalary: 6200000,
    netSalary: 5150000,
    deductions: 1050000,
    allowances: 480000,
    bonuses: 250000,
    overtime: 150000,
    employerPF: 320000,
    employerEOBI: 110000,
    loans: 120000,
    advances: 80000,
    taxes: 520000,
    benefits: 180000,
    leaveEncashment: 45000,
    finalSettlement: 0
  });

  const [advanceForm, setAdvanceForm] = useState({
    reqNo: 'ADV-REQ-2026-88',
    employee: 'Kashif Raza',
    empCode: 'MC-1140',
    department: 'Customer Success',
    designation: 'Customer Success Specialist',
    advanceType: 'Salary Advance',
    loanType: 'Short Term Advance',
    amount: 30000,
    currency: 'PKR',
    postingDate: '2026-07-07',
    reference: 'REF-ADV-DISB-KASHIF',
    notes: 'Disbursement of approved salary advance to Kashif Raza.',
    installments: 2,
    recoveryMonth: 'August 2026',
    bankCash: 'Meezan Bank - Operations',
    receivableAccount: '112040 - Employee Advances Receivable',
    costCenter: 'CC-CS-101',
    project: 'N/A',
    branch: 'HQ Karachi Office'
  });

  const [reimbursementForm, setReimbursementForm] = useState({
    claimNo: 'EXP-99043',
    employee: 'Faisal Khan',
    empCode: 'MC-1035',
    department: 'Sales & BD',
    designation: 'Business Development Manager',
    expenseCategory: 'Travel & Lodging',
    expenseType: 'Client Visit Payout',
    amount: 12500,
    tax: 800,
    project: 'Dubai Expo 2026',
    approvalDate: '2026-07-05',
    postingDate: '2026-07-07',
    paymentDate: '2026-07-07',
    currency: 'PKR',
    vendor: 'Pearl Continental',
    bankCash: 'Meezan Bank - Operations',
    reference: 'REF-EXP-FAISAL-EXPO',
    notes: 'Reimbursement of travel and hotel expenses for Dubai Expo 2026.',
    expenseAccount: '510800 - Travel Expense',
    taxAccount: '210200 - Income Tax Payable',
    costCenter: 'CC-SALES-102',
    branch: 'HQ Karachi Office',
    cashAccount: 'Petty Cash - Finance'
  });

  // Custom Chart of Accounts Mapping states for Step 2
  const [payrollJournalRows, setPayrollJournalRows] = useState([]);
  const [advanceJournalRows, setAdvanceJournalRows] = useState([]);
  const [reimbursementJournalRows, setReimbursementJournalRows] = useState([]);

  // Setup initial journal preview when batches are selected
  useEffect(() => {
    // Generate standard payroll journal rows based on form
    const p = payrollForm;
    const pfTotal = p.employerPF + 320000; // Emp + Employer provident fund portion
    const eobiTotal = p.employerEOBI + 110000;
    const rows = [
      { code: '510100', name: 'Salary Expense', debit: p.grossSalary, credit: 0, costCenter: 'CC-HQ-OPS' },
      { code: '510200', name: 'Employer Provident Fund Expense', debit: p.employerPF, credit: 0, costCenter: 'CC-HR-PF' },
      { code: '510300', name: 'Employer EOBI Expense', debit: p.employerEOBI, credit: 0, costCenter: 'CC-HR-EOBI' },
      { code: '510700', name: 'Overtime Expense', debit: p.overtime, credit: 0, costCenter: 'CC-HQ-OPS' },
      { code: '510500', name: 'Bonus Expense', debit: p.bonuses, credit: 0, costCenter: 'CC-SALES-MKTG' },
      { code: '210100', name: 'Salary Payable', debit: 0, credit: p.netSalary, costCenter: 'N/A' },
      { code: '210200', name: 'Income Tax Payable', debit: 0, credit: p.taxes, costCenter: 'N/A' },
      { code: '210300', name: 'Provident Fund Payable', debit: 0, credit: pfTotal, costCenter: 'N/A' },
      { code: '210400', name: 'EOBI Payable', debit: 0, credit: eobiTotal, costCenter: 'N/A' },
      { code: '112040', name: 'Employee Advances Recovery', debit: 0, credit: p.advances, costCenter: 'N/A' },
      { code: '112030', name: 'Employee Loans Recovery', debit: 0, credit: p.loans, costCenter: 'N/A' }
    ];
    setPayrollJournalRows(rows);
  }, [payrollForm]);

  useEffect(() => {
    const a = advanceForm;
    const rows = [
      { code: '112040', name: 'Employee Advances Receivable', debit: a.amount, credit: 0, costCenter: a.costCenter },
      { code: '110200', name: 'Meezan Bank - Operations', debit: 0, credit: a.amount, costCenter: 'N/A' }
    ];
    setAdvanceJournalRows(rows);
  }, [advanceForm]);

  useEffect(() => {
    const r = reimbursementForm;
    const rows = [
      { code: '510800', name: 'Travel & Lodging Expense', debit: r.amount - r.tax, credit: 0, costCenter: r.costCenter },
      { code: '111300', name: 'Input Tax Receivable', debit: r.tax, credit: 0, costCenter: 'N/A' },
      { code: '110200', name: 'Meezan Bank - Operations', debit: 0, credit: r.amount, costCenter: 'N/A' }
    ];
    setReimbursementJournalRows(rows);
  }, [reimbursementForm]);

  // Balance Check Computations
  const getJournalTotals = (rows) => {
    const dr = rows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);
    const cr = rows.reduce((sum, r) => sum + (Number(r.credit) || 0), 0);
    return { debit: dr, credit: cr, diff: Math.abs(dr - cr) };
  };

  const payrollTotals = getJournalTotals(payrollJournalRows);
  // eslint-disable-next-line no-unused-vars
  const advanceTotals = getJournalTotals(advanceJournalRows);
  // eslint-disable-next-line no-unused-vars
  const reimbursementTotals = getJournalTotals(reimbursementJournalRows);

  // Dynamic Accumulator Stats for KPI Dashboard Row 2
  const postedNetPayrollSum = payrollPostings.reduce((sum, p) => p.status === 'Posted' ? sum + p.netPay : sum, 0);
  const postedAdvancesSum = advances.reduce((sum, a) => a.status === 'Posted' ? sum + a.amount : sum, 0);
  const postedReimbursementsSum = reimbursements.reduce((sum, r) => r.postingStatus === 'Posted' ? sum + r.amount : sum, 0);

  // Active Batch Change Handlers in Wizard Step 1
  const handlePendingPayrollChange = (batchCode) => {
    const found = pendingPayrollRuns.find(b => b.batch === batchCode);
    if (found) {
      setPayrollForm(prev => ({
        ...prev,
        batch: found.batch,
        month: found.month,
        employees: found.employees,
        grossSalary: found.gross,
        netSalary: found.net,
        deductions: found.deductions,
        allowances: found.allowances,
        bonuses: found.bonuses,
        overtime: found.overtime,
        employerPF: found.employerPF,
        employerEOBI: found.employerEOBI,
        loans: found.loans,
        advances: found.advances,
        taxes: found.taxes,
        period: found.period,
        company: found.company,
        branch: found.branch
      }));
    }
  };

  const handlePendingAdvanceChange = (reqNo) => {
    const found = pendingAdvances.find(a => a.reqNo === reqNo);
    if (found) {
      setAdvanceForm(prev => ({
        ...prev,
        reqNo: found.reqNo,
        employee: found.employee,
        empCode: found.empId,
        department: found.dept,
        designation: found.designation,
        amount: found.amount,
        advanceType: found.type,
        installments: found.recoveryPeriod,
        recoveryMonth: found.recoveryMonth,
        currency: found.currency
      }));
    }
  };

  const handlePendingReimbursementChange = (claimNo) => {
    const found = pendingReimbursements.find(r => r.claimNo === claimNo);
    if (found) {
      setReimbursementForm(prev => ({
        ...prev,
        claimNo: found.claimNo,
        employee: found.employee,
        empCode: found.empId,
        department: found.dept,
        designation: found.designation,
        expenseCategory: found.expenseType,
        amount: found.amount,
        tax: found.tax,
        project: found.project,
        approvalDate: found.approvalDate,
        currency: found.currency,
        vendor: found.vendor
      }));
    }
  };

  // POSTING ACTIONS
  const executePostPayroll = () => {
    if (payrollTotals.diff !== 0) {
      addNotification('Journal entry must be balanced (Debits = Credits).', 'error');
      return;
    }
    const newPosting = {
      postingNo: `PP-2026-00${payrollPostings.length + 1}`,
      batch: payrollForm.batch,
      month: payrollForm.month,
      postingDate: payrollForm.postingDate,
      journalDate: payrollForm.journalDate,
      company: payrollForm.company,
      branch: payrollForm.branch,
      employees: payrollForm.employees,
      grossSalary: payrollForm.grossSalary,
      netPay: payrollForm.netSalary,
      debit: payrollTotals.debit,
      credit: payrollTotals.credit,
      difference: 0,
      journalNumber: `JV-2026-7${10 + payrollPostings.length}`,
      reference: payrollForm.reference,
      postedBy: 'Financial Controller (System)',
      status: 'Posted',
      approvalStatus: 'Approved',
      createdDate: new Date().toISOString().split('T')[0] + ' 10:30 AM',
      approvedBy: 'Chief Accountant (AI Validated)',
      overtime: payrollForm.overtime,
      bonus: payrollForm.bonuses,
      deductions: payrollForm.deductions,
      employerPF: payrollForm.employerPF,
      employerEOBI: payrollForm.employerEOBI,
      taxes: payrollForm.taxes,
      notes: payrollForm.notes
    };

    setPayrollPostings(prev => [newPosting, ...prev]);
    setPendingPayrollRuns(prev => prev.filter(r => r.batch !== payrollForm.batch));
    setShowPayrollWizard(false);
    setPayrollStep(1);
    addNotification(`Payroll run ${payrollForm.batch} posted successfully as ${newPosting.journalNumber}.`, 'success');
  };

  const executePostAdvance = () => {
    const newDisb = {
      postingNo: `ADVP-2026-00${advances.length + 1}`,
      employee: advanceForm.employee,
      employeeCode: advanceForm.empCode,
      department: advanceForm.department,
      advanceRequest: advanceForm.reqNo,
      advanceType: advanceForm.advanceType,
      requestDate: '2026-07-02',
      postingDate: advanceForm.postingDate,
      bankCash: advanceForm.bankCash,
      amount: advanceForm.amount,
      status: 'Posted',
      approvalStatus: 'Approved',
      journalNumber: `JV-2026-8${10 + advances.length}`,
      recoveryStart: advanceForm.recoveryMonth,
      recoveryPeriod: advanceForm.installments,
      remainingBalance: advanceForm.amount,
      recoveredAmount: 0,
      postedBy: 'Finance Manager (Approved)',
      reference: advanceForm.reference,
      notes: advanceForm.notes
    };

    setAdvances(prev => [newDisb, ...prev]);
    setPendingAdvances(prev => prev.filter(a => a.reqNo !== advanceForm.reqNo));
    setShowAdvanceWizard(false);
    setAdvanceStep(1);
    addNotification(`Advance disbursement for ${advanceForm.employee} posted successfully.`, 'success');
  };

  const executePostReimbursement = () => {
    const newReim = {
      id: `REIM-2026-${300 + reimbursements.length + 3}`,
      claimNo: reimbursementForm.claimNo,
      employee: reimbursementForm.employee,
      employeeCode: reimbursementForm.empCode,
      department: reimbursementForm.department,
      expenseCategory: reimbursementForm.expenseCategory,
      expenseType: 'Approved Claim Payment',
      claimDate: reimbursementForm.approvalDate,
      postingDate: reimbursementForm.postingDate,
      paymentMethod: 'Bank Transfer',
      bankCash: reimbursementForm.bankCash,
      amount: reimbursementForm.amount,
      currency: reimbursementForm.currency,
      costCenter: reimbursementForm.costCenter,
      project: reimbursementForm.project,
      journalNumber: `JV-2026-9${10 + reimbursements.length}`,
      reference: reimbursementForm.reference,
      approvalStatus: 'Approved',
      paymentStatus: 'Paid',
      postingStatus: 'Posted',
      postedBy: 'CFO Assistant',
      notes: reimbursementForm.notes
    };

    setReimbursements(prev => [newReim, ...prev]);
    setPendingReimbursements(prev => prev.filter(r => r.claimNo !== reimbursementForm.claimNo));
    setShowReimbursementWizard(false);
    setReimbursementStep(1);
    addNotification(`Expense Reimbursement voucher ${newReim.id} generated & paid.`, 'success');
  };

  // REVERSAL / DELETE / WORKFLOW ACTIONS
  const handleReversePosting = (type, postingNo) => {
    setDeleteDialog({ show: true, id: postingNo, name: postingNo, type, action: 'reverse', row: null });
  };

  const handleDeleteConfirm = () => {
    const { id, type, action } = deleteDialog;
    if (action === 'delete') {
      if (type === 'payroll') {
        setPayrollPostings(prev => prev.filter(p => p.postingNo !== id));
      } else if (type === 'advance') {
        setAdvances(prev => prev.filter(a => a.postingNo !== id));
      } else if (type === 'reimbursement') {
        setReimbursements(prev => prev.filter(r => r.id !== id));
      }
      setSelectedItem(null);
      addNotification(`Draft record deleted successfully.`, 'info');
    } else {
      if (type === 'payroll') {
        setPayrollPostings(prev => prev.map(p => p.postingNo === id ? { ...p, status: 'Reversed' } : p));
        addNotification(`Journal entries reversed for ${id}. Reversal journal generated.`, 'warning');
      } else if (type === 'advance') {
        setAdvances(prev => prev.map(a => a.postingNo === id ? { ...a, status: 'Reversed' } : a));
        addNotification(`Advance posting reversed for ${id}.`, 'warning');
      } else if (type === 'reimbursement') {
        setReimbursements(prev => prev.map(r => r.id === id ? { ...r, postingStatus: 'Reversed' } : r));
        addNotification(`Reimbursement voucher reversed for ${id}.`, 'warning');
      }
      if (selectedItem && (selectedItem.postingNo === id || selectedItem.id === id)) {
        setSelectedItem(prev => ({ ...prev, status: 'Reversed', postingStatus: 'Reversed' }));
      }
    }
    setDeleteDialog({ show: false, id: null, name: '', type: '', action: 'reverse', row: null });
  };

  const handleApproveRow = (type, id) => {
    if (type === 'payroll') {
      setPayrollPostings(prev => prev.map(p => p.postingNo === id ? { ...p, approvalStatus: 'Approved' } : p));
    } else if (type === 'advance') {
      setAdvances(prev => prev.map(a => a.postingNo === id ? { ...a, approvalStatus: 'Approved' } : a));
    } else if (type === 'reimbursement') {
      setReimbursements(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'Approved' } : r));
    }
    if (selectedItem && (selectedItem.postingNo === id || selectedItem.id === id)) {
      setSelectedItem(prev => ({ ...prev, approvalStatus: 'Approved' }));
    }
    addNotification(`Posting run has been approved in Maker-Checker flow.`, 'success');
  };

  // eslint-disable-next-line no-unused-vars
  const handleRejectRow = (type, id) => {
    if (type === 'payroll') {
      setPayrollPostings(prev => prev.map(p => p.postingNo === id ? { ...p, approvalStatus: 'Rejected', status: 'Cancelled' } : p));
    } else if (type === 'advance') {
      setAdvances(prev => prev.map(a => a.postingNo === id ? { ...a, approvalStatus: 'Rejected', status: 'Cancelled' } : a));
    } else if (type === 'reimbursement') {
      setReimbursements(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: 'Rejected', postingStatus: 'Cancelled' } : r));
    }
    if (selectedItem && (selectedItem.postingNo === id || selectedItem.id === id)) {
      setSelectedItem(prev => ({ ...prev, approvalStatus: 'Rejected', status: 'Cancelled', postingStatus: 'Cancelled' }));
    }
    addNotification(`Posting run rejected. Status changed to Cancelled.`, 'error');
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteDraft = (type, id) => {
    setDeleteDialog({ show: true, id, name: id, type, action: 'delete', row: null });
  };

  // EXPORT UTILITY
  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPayroll = async (type) => {
    const data = getFilteredPayroll();
    const cols = [
      { key: 'postingNo', label: 'Posting #' }, { key: 'batch', label: 'Payroll Batch' },
      { key: 'grossSalary', label: 'Gross Salary' }, { key: 'netPay', label: 'Net Pay' },
      { key: 'debit', label: 'Debit' }, { key: 'credit', label: 'Credit' },
      { key: 'journalNumber', label: 'Journal Voucher' }, { key: 'postingDate', label: 'Posting Date' },
      { key: 'approvalStatus', label: 'Approval Status' }, { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'payroll_journals.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'payroll_journals.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf(headers, rows, 'payroll_journals.pdf', 'Export Payroll Journals'); }
    else if (type === 'docx') { await exportDocx(headers, rows, 'payroll_journals.docx', 'Export Payroll Journals'); }
    else if (type === 'word') { await exportWord(headers, rows, 'payroll_journals.doc', 'Export Payroll Journals'); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const handleExportAdvances = async (type) => {
    const data = getFilteredAdvances();
    const cols = [
      { key: 'postingNo', label: 'Posting #' }, { key: 'employee', label: 'Employee' },
      { key: 'department', label: 'Department' }, { key: 'advanceType', label: 'Advance Type' },
      { key: 'bankCash', label: 'Disbursed From' }, { key: 'amount', label: 'Amount' },
      { key: 'recoveredAmount', label: 'Recovered' }, { key: 'remainingBalance', label: 'Remaining Bal' },
      { key: 'journalNumber', label: 'Voucher #' }, { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'employee_advances.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'employee_advances.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf(headers, rows, 'employee_advances.pdf', 'Export Employee Advances'); }
    else if (type === 'docx') { await exportDocx(headers, rows, 'employee_advances.docx', 'Export Employee Advances'); }
    else if (type === 'word') { await exportWord(headers, rows, 'employee_advances.doc', 'Export Employee Advances'); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const handleExportReimbursements = async (type) => {
    const data = getFilteredReimbursements();
    const cols = [
      { key: 'id', label: 'Posting #' }, { key: 'claimNo', label: 'Claim #' },
      { key: 'employee', label: 'Employee' }, { key: 'department', label: 'Department' },
      { key: 'expenseCategory', label: 'Category' }, { key: 'project', label: 'Project' },
      { key: 'bankCash', label: 'Bank / Cash' }, { key: 'amount', label: 'Total Reimbursed' },
      { key: 'journalNumber', label: 'Journal Voucher' }, { key: 'postingStatus', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'expense_reimbursements.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'expense_reimbursements.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf(headers, rows, 'expense_reimbursements.pdf', 'Export Expense Reimbursements'); }
    else if (type === 'docx') { await exportDocx(headers, rows, 'expense_reimbursements.docx', 'Export Expense Reimbursements'); }
    else if (type === 'word') { await exportWord(headers, rows, 'expense_reimbursements.doc', 'Export Expense Reimbursements'); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  // FILTERED REGISTERS DATA
  const getFilteredPayroll = () => {
    return payrollPostings.filter(p => {
      const matchSearch = searchQuery === '' || 
        p.postingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.journalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCompany = filterParams.company === 'All' || p.company.includes(filterParams.company);
      const matchBranch = filterParams.branch === 'All' || p.branch.includes(filterParams.branch);
      const matchPeriod = filterParams.period === 'All' || p.month.includes(filterParams.period) || p.postingDate.includes(filterParams.period);
      const matchStatus = filterParams.status === 'All' || p.status.toLowerCase() === filterParams.status.toLowerCase();
      return matchSearch && matchCompany && matchBranch && matchPeriod && matchStatus;
    });
  };

  const getFilteredAdvances = () => {
    return advances.filter(a => {
      const matchSearch = searchQuery === '' ||
        a.postingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.journalNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = filterParams.department === 'All' || a.department === filterParams.department;
      const matchStatus = filterParams.status === 'All' || a.status.toLowerCase() === filterParams.status.toLowerCase();
      return matchSearch && matchDept && matchStatus;
    });
  };

  const getFilteredReimbursements = () => {
    return reimbursements.filter(r => {
      const matchSearch = searchQuery === '' ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.claimNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.journalNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = filterParams.department === 'All' || r.department === filterParams.department;
      const matchStatus = filterParams.status === 'All' || r.postingStatus.toLowerCase() === filterParams.status.toLowerCase();
      const matchProject = filterParams.project === 'All' || r.project.includes(filterParams.project);
      return matchSearch && matchDept && matchStatus && matchProject;
    });
  };

  // DYNAMIC COMPONENT STYLES INJECTOR (For SAP-like Premium Aesthetics)
  const renderStyles = () => {
    return (
      <style>{`
        /* Custom styled variables and transitions for clean dashboard UI */
        .erp-gradient-banner {
          background: linear-gradient(135deg, #0B192C 0%, #1E3E62 50%, #2563EB 100%);
          color: #ffffff;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(11, 25, 44, 0.15);
        }
        
        .erp-gradient-banner::after {
          content: '';
          position: absolute;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
          border-radius: 50%;
          top: -100px;
          right: -80px;
          pointer-events: none;
        }

        .erp-card-premium {
          background: ${isDark ? '#1F2937' : '#FFFFFF'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 8px -1px rgba(0, 0, 0, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .erp-card-premium:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -5px rgba(0, 0, 0, 0.03);
        }

        .pill-nav-container {
          background: ${isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.65)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.08)'};
          border-radius: 30px;
          padding: 6px;
          display: inline-flex;
          flex-wrap: wrap;
          gap: 4px;
          box-shadow: ${isDark ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 10px rgba(0,0,0,0.02)'};
        }

        .pill-tab {
          border-radius: 24px;
          padding: 8px 20px;
          font-weight: 600;
          font-size: 13px;
          border: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: ${isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(71, 85, 105, 0.85)'};
          background: transparent;
        }

        .pill-tab:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.04)'};
          color: ${isDark ? '#FFFFFF' : '#6366f1'};
        }

        .pill-tab.active {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
        }

        .custom-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-draft { background-color: rgba(156, 163, 175, 0.15); color: #4B5563; }
        .badge-pending { background-color: rgba(245, 158, 11, 0.15); color: #D97706; }
        .badge-posted { background-color: rgba(16, 185, 129, 0.15); color: #059669; }
        .badge-reversed { background-color: rgba(239, 68, 68, 0.15); color: #DC2626; }

        .sticky-table-header th {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: ${isDark ? '#2D3748' : '#F7FAFC'} !important;
          border-bottom: 2px solid ${isDark ? '#4A5568' : '#E2E8F0'};
        }

        /* Detail Drawer Panel Styling */
        .details-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 650px;
          height: 100vh;
          background: ${isDark ? '#1F2937' : '#FFFFFF'};
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
          z-index: 1060;
          transition: transform 0.3s ease-in-out;
          transform: translateX(100%);
          border-left: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
        }

        .details-drawer.open {
          transform: translateX(0);
        }

        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.4);
          z-index: 1055;
          backdrop-filter: blur(2px);
          display: none;
        }

        .drawer-overlay.open {
          display: block;
        }

        /* Amortization schedule line items */
        .recovery-line {
          border-left: 2px solid #E2E8F0;
          padding-left: 16px;
          position: relative;
          margin-bottom: 12px;
        }

        .recovery-line::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3182CE;
          border: 2px solid #FFF;
        }

        .recovery-line.paid::before {
          background: #48BB78;
        }
      `}</style>
    );
  };

  if (loading) return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="p-4 p-lg-5 shadow text-start mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #0B192C 0%, #1E3E62 50%, #2563EB 100%)' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '100px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '400px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '550px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-4">
          {[1,2,3].map(i => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="p-4 rounded-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', minHeight: '140px', borderLeft: `6px solid ${['#2563EB','#D97706','#06B6D4'][i-1]}` }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '70%', height: '12px', background: isDark ? '#1e293b' : '#f1f5f9' }} />
                <div className="skeleton-box rounded" style={{ width: '30%', height: '32px', background: isDark ? '#1e293b' : '#f1f5f9' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-100 px-0 pb-5" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {renderStyles()}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO GRADIENT BANNER                                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="erp-gradient-banner p-4 p-lg-5 shadow text-start">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-white bg-opacity-25 text-white px-3 py-2 mb-3 fw-bold tracking-wider rounded-pill" style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                PHASE 6A
              </span>
              <h1 className="fw-extrabold tracking-tight mb-2 display-6" style={{ fontSize: '2.5rem' }}>
                Payroll / HR Accounting Integration
              </h1>
              <p className="text-light text-opacity-80 fs-6 mb-4" style={{ maxWidth: '680px' }}>
                Post finalized payroll, employee advances, approved reimbursements, and HR financial transactions into the double-entry accounting engine.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-primary text-white fw-bold d-flex align-items-center gap-2 border-0 px-4 py-2"
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', borderRadius: '10px', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
                  onClick={() => { setPayrollStep(1); setShowPayrollWizard(true); }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Post Payroll
                </button>
                <button 
                  className="btn btn-outline-light fw-bold d-flex align-items-center gap-2 px-4 py-2"
                  style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}
                  onClick={() => { setAdvanceStep(1); setShowAdvanceWizard(true); }}
                >
                  <FontAwesomeIcon icon={faCoins} /> Post Advance
                </button>
                <button 
                  className="btn btn-outline-light fw-bold d-flex align-items-center gap-2 px-4 py-2"
                  style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}
                  onClick={() => { setReimbursementStep(1); setShowReimbursementWizard(true); }}
                >
                  <FontAwesomeIcon icon={faReceipt} /> Post Reimbursement
                </button>
              </div>
            </div>
            
            {/* Right side decoration matching user request */}
            <div className="col-lg-4 d-none d-lg-block text-end position-relative">
              <div style={{
                position: 'absolute',
                top: '-70px',
                right: '20px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)',
                border: '1px dashed rgba(255,255,255,0.2)'
              }}></div>
              <div className="p-3 bg-white bg-opacity-10 rounded-4 text-start d-inline-block shadow-sm" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', width: '220px' }}>
                <span className="small text-white-50 d-block mb-1">AI Recommendation</span>
                <div className="d-flex align-items-center gap-2 text-white">
                  <FontAwesomeIcon icon={faRobot} className="text-info animate-pulse" />
                  <span className="small fw-semibold">2 batches ready to post</span>
                </div>
                <hr className="my-2 border-white-50" />
                <span className="x-small text-white-50 d-block">Zero mapping errors found. Ready for automated reconciliation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-3"></div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. TABS CONTAINER                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}

      {/* TAB A: PAYROLL ACCOUNTING HUB DASHBOARD */}
      {activeTab === 'hub' && (
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
          
          {/* Row 1 KPI cards */}
          <div className="row g-4 mb-4">
            <div className="col-lg-4 col-md-6">
              <div className="erp-card-premium p-4 d-flex flex-column h-100" style={{ borderLeft: '6px solid #2563EB' }}>
                <span className="small text-muted fw-bold text-uppercase mb-1">Finalized Payroll Pending Posting</span>
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <h2 className="display-5 fw-extrabold mb-0 text-primary">{pendingPayrollRuns.length}</h2>
                  <span className="small text-muted">batches</span>
                </div>
                <p className="small text-muted flex-grow-1">Shows finalized payroll runs calculated in HRMS awaiting double-entry accounting mapping and voucher posting.</p>
                <button 
                  className="btn btn-link p-0 text-decoration-none text-primary fw-bold small mt-3 text-start"
                  onClick={() => { setPayrollForm(prev => ({ ...prev, batch: pendingPayrollRuns[0]?.batch || '' })); setPayrollStep(1); setShowPayrollWizard(true); }}
                  disabled={pendingPayrollRuns.length === 0}
                >
                  Open Posting Form →
                </button>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="erp-card-premium p-4 d-flex flex-column h-100" style={{ borderLeft: '6px solid #D97706' }}>
                <span className="small text-muted fw-bold text-uppercase mb-1">Approved Advances Pending Disbursement</span>
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <h2 className="display-5 fw-extrabold mb-0 text-warning">{pendingAdvances.length}</h2>
                  <span className="small text-muted">employee requests</span>
                </div>
                <p className="small text-muted flex-grow-1">Approved salary advances and loan applications from HRMS awaiting ledger disbursement entry.</p>
                <button 
                  className="btn btn-link p-0 text-decoration-none text-warning fw-bold small mt-3 text-start"
                  onClick={() => { setAdvanceForm(prev => ({ ...prev, reqNo: pendingAdvances[0]?.reqNo || '' })); setAdvanceStep(1); setShowAdvanceWizard(true); }}
                  disabled={pendingAdvances.length === 0}
                >
                  Post Disbursement →
                </button>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="erp-card-premium p-4 d-flex flex-column h-100" style={{ borderLeft: '6px solid #06B6D4' }}>
                <span className="small text-muted fw-bold text-uppercase mb-1">Approved Expense Claims Pending Payment</span>
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <h2 className="display-5 fw-extrabold mb-0 text-info">{pendingReimbursements.length}</h2>
                  <span className="small text-muted">claims</span>
                </div>
                <p className="small text-muted flex-grow-1">Approved travel, hotel, and office expense reimbursements waiting for posting into budget expense accounts.</p>
                <button 
                  className="btn btn-link p-0 text-decoration-none text-info fw-bold small mt-3 text-start"
                  onClick={() => { setReimbursementForm(prev => ({ ...prev, claimNo: pendingReimbursements[0]?.claimNo || '' })); setReimbursementStep(1); setShowReimbursementWizard(true); }}
                  disabled={pendingReimbursements.length === 0}
                >
                  Post Reimbursement →
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Posted Aggregates */}
          <div className="row g-4 mb-4">
            <div className="col-lg-4 col-md-6">
              <div className="erp-card-premium p-4">
                <span className="small text-muted fw-semibold d-block mb-1">Posted Net Payroll</span>
                <h3 className="fw-extrabold text-success mb-2">{formatCurrency(postedNetPayrollSum)}</h3>
                <div className="d-flex align-items-center justify-content-between small text-muted">
                  <span>Net payroll successfully posted to General Ledger</span>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="erp-card-premium p-4">
                <span className="small text-muted fw-semibold d-block mb-1">Posted Employee Advances</span>
                <h3 className="fw-extrabold text-primary mb-2">{formatCurrency(postedAdvancesSum)}</h3>
                <div className="d-flex align-items-center justify-content-between small text-muted">
                  <span>Total advances posted into accounting</span>
                  <FontAwesomeIcon icon={faScaleBalanced} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="erp-card-premium p-4">
                <span className="small text-muted fw-semibold d-block mb-1">Posted Reimbursements</span>
                <h3 className="fw-extrabold text-info mb-2">{formatCurrency(postedReimbursementsSum)}</h3>
                <div className="d-flex align-items-center justify-content-between small text-muted">
                  <span>Total reimbursements posted into accounting</span>
                  <FontAwesomeIcon icon={faReceipt} className="text-info" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Recent Activity (Exactly Three Cards) */}
          <div className="row g-4 mb-4">
            
            {/* Card 1: Recent Payroll Postings */}
            <div className="col-lg-4">
              <div className="erp-card-premium p-4 d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-slate-800"><FontAwesomeIcon icon={faFileInvoice} className="text-primary me-2" />Recent Payroll Postings</h6>
                  <button className="btn btn-link p-0 text-decoration-none small fw-bold" onClick={() => setActiveTab('journals')}>View All</button>
                </div>
                
                {payrollPostings.length === 0 ? (
                  <div className="py-5 text-center text-muted small">No payroll posting yet.</div>
                ) : (
                  <div className="flex-grow-1">
                    {payrollPostings.slice(0, 3).map(p => (
                      <div key={p.postingNo} className="p-3 rounded-3 mb-2 border border-light-subtle d-flex justify-content-between align-items-center hover-bg-light" style={{ fontSize: '12px' }}>
                        <div>
                          <strong className="d-block text-dark">{p.batch}</strong>
                          <span className="text-muted small">{p.postingDate} • {p.employees} Employees</span>
                        </div>
                        <div className="text-end">
                          <strong className="d-block text-success">{formatCurrency(p.netPay)}</strong>
                          <span className="badge bg-light text-dark font-monospace border">{p.journalNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Recent Advances */}
            <div className="col-lg-4">
              <div className="erp-card-premium p-4 d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-slate-800"><FontAwesomeIcon icon={faCoins} className="text-warning me-2" />Recent Advances</h6>
                  <button className="btn btn-link p-0 text-decoration-none small fw-bold" onClick={() => setActiveTab('advances')}>View All</button>
                </div>

                {advances.length === 0 ? (
                  <div className="py-5 text-center text-muted small">No advance posting yet.</div>
                ) : (
                  <div className="flex-grow-1">
                    {advances.slice(0, 3).map(a => (
                      <div key={a.postingNo} className="p-3 rounded-3 mb-2 border border-light-subtle d-flex justify-content-between align-items-center hover-bg-light" style={{ fontSize: '12px' }}>
                        <div>
                          <strong className="d-block text-dark">{a.employee} ({a.employeeCode})</strong>
                          <span className="text-muted small">{a.postingDate} • {a.advanceType}</span>
                        </div>
                        <div className="text-end">
                          <strong className="d-block text-primary">{formatCurrency(a.amount)}</strong>
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">{a.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Recent Reimbursements */}
            <div className="col-lg-4">
              <div className="erp-card-premium p-4 d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-slate-800"><FontAwesomeIcon icon={faReceipt} className="text-info me-2" />Recent Reimbursements</h6>
                  <button className="btn btn-link p-0 text-decoration-none small fw-bold" onClick={() => setActiveTab('reimbursements')}>View All</button>
                </div>

                {reimbursements.length === 0 ? (
                  <div className="py-5 text-center text-muted small">No reimbursement posting yet.</div>
                ) : (
                  <div className="flex-grow-1">
                    {reimbursements.slice(0, 3).map(r => (
                      <div key={r.id} className="p-3 rounded-3 mb-2 border border-light-subtle d-flex justify-content-between align-items-center hover-bg-light" style={{ fontSize: '12px' }}>
                        <div>
                          <strong className="d-block text-dark">{r.employee}</strong>
                          <span className="text-muted small">{r.postingDate} • {r.expenseCategory}</span>
                        </div>
                        <div className="text-end">
                          <strong className="d-block text-info">{formatCurrency(r.amount)}</strong>
                          <span className="badge bg-light text-dark border font-monospace">{r.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* AI Intelligence Insights Center */}
          <div className="erp-card-premium p-4 mb-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faRobot} className="text-primary animate-pulse" />
              AI Variance & Audit Recommendations Hub
            </h6>
            <div className="row g-3">
              <div className="col-md-6 border-end">
                <div className="d-flex align-items-start gap-3">
                  <span className="p-2 rounded bg-primary bg-opacity-10 text-primary">
                    <FontAwesomeIcon icon={faChartLine} />
                  </span>
                  <div>
                    <strong className="d-block text-slate-800" style={{ fontSize: '13px' }}>Payroll Variance Analysis</strong>
                    <p className="text-muted small mb-0">July 2026 Regular payroll batch matches standard monthly distributions (+1.8% variance). Recommended mapping check passed.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <span className="p-2 rounded bg-danger bg-opacity-10 text-danger">
                    <FontAwesomeIcon icon={faShieldHalved} />
                  </span>
                  <div>
                    <strong className="d-block text-slate-800" style={{ fontSize: '13px' }}>Duplicate Posting & Fraud Prevention</strong>
                    <p className="text-muted small mb-0">System checked all pending claims against posted ledger lines. 0 duplicate invoice matches detected in Expense Reimbursements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* REGISTERS SEARCH & FILTER SECTION (Common for registers tabs) */}
      {activeTab !== 'hub' && (
        <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
          <div className="erp-card-premium p-4">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="form-label small text-muted fw-bold">Search Posting / Reference</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><FontAwesomeIcon icon={faSearch} /></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
                    placeholder="Search Posting #, Journal #, Batch, Employee Name, Dept..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-2 col-md-3">
                <label className="form-label small text-muted fw-bold">From Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-lg-2 col-md-3">
                <label className="form-label small text-muted fw-bold">To Date</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-lg-2 col-md-3">
                <label className="form-label small text-muted fw-bold">Posting Status</label>
                <select className="form-select" value={filterParams.status} onChange={e => setFilterParams({...filterParams, status: e.target.value})}>
                  <option value="All">All Statuses</option>
                  <option value="Posted">Posted</option>
                  <option value="Draft">Draft</option>
                  <option value="Reversed">Reversed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-3 d-flex gap-2">
                <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => setFilterPanelOpen(!filterPanelOpen)}>
                  <FontAwesomeIcon icon={faFilter} /> Filters
                </button>
                <button className="btn btn-light" onClick={() => { setSearchQuery(''); setFilterParams({ company: 'All', branch: 'All', period: 'All', department: 'All', status: 'All', currency: 'PKR', costCenter: 'All', project: 'All' }); }}>
                  Reset
                </button>
              </div>
            </div>

            {/* Expanded Advanced Filters */}
            {filterPanelOpen && (
              <div className="row g-3 mt-3 pt-3 border-top animate-fade-in">
                <div className="col-lg-3 col-md-6">
                  <label className="form-label small text-muted">Company</label>
                  <select className="form-select form-select-sm" value={filterParams.company} onChange={e => setFilterParams({...filterParams, company: e.target.value})}>
                    <option value="All">All Companies</option>
                    <option>Manage Core Enterprise Ltd</option>
                    <option>Manage Core Technologies</option>
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className="form-label small text-muted">Branch</label>
                  <select className="form-select form-select-sm" value={filterParams.branch} onChange={e => setFilterParams({...filterParams, branch: e.target.value})}>
                    <option value="All">All Branches</option>
                    <option>HQ Karachi Office</option>
                    <option>NY Corporate Hub</option>
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className="form-label small text-muted">Department</label>
                  <select className="form-select form-select-sm" value={filterParams.department} onChange={e => setFilterParams({...filterParams, department: e.target.value})}>
                    <option value="All">All Departments</option>
                    <option>Customer Success</option>
                    <option>Marketing & PR</option>
                    <option>Software Engineering</option>
                    <option>Sales & BD</option>
                    <option>HR & Operations</option>
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className="form-label small text-muted">Project Allocation</label>
                  <select className="form-select form-select-sm" value={filterParams.project} onChange={e => setFilterParams({...filterParams, project: e.target.value})}>
                    <option value="All">All Projects</option>
                    <option>Dubai Expo 2026</option>
                    <option>E-Commerce Upgrade</option>
                    <option>N/A</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB B: PAYROLL JOURNAL POSTINGS REGISTER */}
      {activeTab === 'journals' && (
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">

          {/* AI Recommendation Card */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Payroll Posting Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>All payroll journal entries are balanced. Consider batch-approving all finalized payroll runs for posting.</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Export Actions panel */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Payroll Journal Postings</h5>
              <span className="small text-muted">Finalized HR payroll runs posted into accounting journals.</span>
            </div>
            <div className="d-flex gap-2">
              <div className="dropdown d-inline-block">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
                  <li><button className="dropdown-item" onClick={() => handleExportPayroll('csv')}><FontAwesomeIcon icon={faFileCode} className="me-2" />CSV</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportPayroll('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportPayroll('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportPayroll('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportPayroll('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Postings Table */}
          <div className="erp-card-premium p-0 overflow-hidden mb-4 shadow-sm">
            <div className="table-responsive" style={{ maxHeight: '550px' }}>
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead className="sticky-table-header text-muted">
                  <tr>
                    <th>Posting #</th>
                    <th>Payroll Batch</th>
                    <th>Gross Salary</th>
                    <th>Net Pay</th>
                    <th>Debit/Credit</th>
                    <th>Journal Voucher</th>
                    <th>Posting Date</th>
                    <th>Approval Status</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredPayroll().length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-center py-5 text-muted">
                        No payroll accounting postings found.
                      </td>
                    </tr>
                  ) : (
                    getFilteredPayroll().map(p => (
                      <tr key={p.postingNo}>
                        <td className="fw-bold text-primary">{p.postingNo}</td>
                        <td>
                          <div>
                            <strong className="d-block">{p.batch}</strong>
                            <span className="x-small text-muted">{p.company} • {p.employees} Emps</span>
                          </div>
                        </td>
                        <td>{formatCurrency(p.grossSalary)}</td>
                        <td className="fw-bold text-success">{formatCurrency(p.netPay)}</td>
                        <td>
                          <span className="small font-monospace text-muted">{formatCurrency(p.debit)} / {formatCurrency(p.credit)}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark font-monospace border px-2 py-1">{p.journalNumber}</span>
                        </td>
                        <td>{p.postingDate}</td>
                        <td>
                          <span className={`badge rounded-pill ${p.approvalStatus === 'Approved' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                            {p.approvalStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`custom-badge badge-posted ${p.status === 'Reversed' ? 'badge-reversed' : ''}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <button className="btn btn-sm btn-light" title="View details" onClick={() => { setSelectedItem(p); setSelectedItemType('payroll'); setDetailsActiveTab('Overview'); }}>
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            {p.approvalStatus !== 'Approved' && (
                              <button className="btn btn-sm btn-outline-success border-0" title="Approve" onClick={() => handleApproveRow('payroll', p.postingNo)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                            {p.status !== 'Reversed' && (
                              <button className="btn btn-sm btn-outline-danger border-0" title="Reverse Journal Entry" onClick={() => handleReversePosting('payroll', p.postingNo)}>
                                <FontAwesomeIcon icon={faUndo} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB C: EMPLOYEE ADVANCES REGISTER */}
      {activeTab === 'advances' && (
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">

          {/* AI Recommendation Card */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Advance Disbursement Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>2 approved advances pending disbursement. Suggested batch posting to optimize cash flow tracking.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Employee Loan / Advance Postings</h5>
              <span className="small text-muted">Disburse approved employee advances through bank/cash accounts and automatically create receivable journal entries.</span>
            </div>
            <div className="d-flex gap-2">
              <div className="dropdown d-inline-block">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
                  <li><button className="dropdown-item" onClick={() => handleExportAdvances('csv')}><FontAwesomeIcon icon={faFileCode} className="me-2" />CSV</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportAdvances('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportAdvances('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportAdvances('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportAdvances('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="erp-card-premium p-0 overflow-hidden mb-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead className="sticky-table-header text-muted">
                  <tr>
                    <th>Posting #</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Advance Type</th>
                    <th>Disbursed From</th>
                    <th>Amount</th>
                    <th>Recovered</th>
                    <th>Remaining Bal</th>
                    <th>Voucher #</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAdvances().length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-5 text-muted">
                        No employee advance postings found.
                      </td>
                    </tr>
                  ) : (
                    getFilteredAdvances().map(a => (
                      <tr key={a.postingNo}>
                        <td className="fw-bold text-primary">{a.postingNo}</td>
                        <td>
                          <div>
                            <strong className="d-block">{a.employee}</strong>
                            <span className="x-small text-muted">{a.employeeCode}</span>
                          </div>
                        </td>
                        <td>{a.department}</td>
                        <td>{a.advanceType}</td>
                        <td>{a.bankCash}</td>
                        <td className="fw-semibold text-dark">{formatCurrency(a.amount)}</td>
                        <td className="text-success">{formatCurrency(a.recoveredAmount || 0)}</td>
                        <td className="fw-bold text-danger">{formatCurrency(a.remainingBalance)}</td>
                        <td>
                          <span className="badge bg-light text-dark font-monospace border px-2 py-1">{a.journalNumber}</span>
                        </td>
                        <td>
                          <span className={`custom-badge badge-posted ${a.status === 'Reversed' ? 'badge-reversed' : ''}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <button className="btn btn-sm btn-light" title="View details" onClick={() => { setSelectedItem(a); setSelectedItemType('advance'); setDetailsActiveTab('Overview'); }}>
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            {a.status !== 'Reversed' && (
                              <button className="btn btn-sm btn-outline-danger border-0" title="Reverse Entry" onClick={() => handleReversePosting('advance', a.postingNo)}>
                                <FontAwesomeIcon icon={faUndo} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB D: EXPENSE REIMBURSEMENTS REGISTER */}
      {activeTab === 'reimbursements' && (
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Expense Reimbursement Postings</h5>
              <span className="small text-muted">Pay approved HR expense claims directly through accounting bank/cash while automatically generating accounting journal entries.</span>
            </div>
            <div className="d-flex gap-2">
              <div className="dropdown d-inline-block">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
                  <li><button className="dropdown-item" onClick={() => handleExportReimbursements('csv')}><FontAwesomeIcon icon={faFileCode} className="me-2" />CSV</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportReimbursements('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportReimbursements('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportReimbursements('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExportReimbursements('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="erp-card-premium p-0 overflow-hidden mb-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead className="sticky-table-header text-muted">
                  <tr>
                    <th>Posting #</th>
                    <th>Claim #</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Project</th>
                    <th>Bank / Cash</th>
                    <th>Total Reimbursed</th>
                    <th>Journal Voucher</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredReimbursements().length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-5 text-muted">
                        No expense reimbursement postings found.
                      </td>
                    </tr>
                  ) : (
                    getFilteredReimbursements().map(r => (
                      <tr key={r.id}>
                        <td className="fw-bold text-primary">{r.id}</td>
                        <td className="text-info">{r.claimNo}</td>
                        <td>
                          <div>
                            <strong className="d-block">{r.employee}</strong>
                            <span className="x-small text-muted">{r.employeeCode}</span>
                          </div>
                        </td>
                        <td>{r.department}</td>
                        <td>{r.expenseCategory}</td>
                        <td>{r.project}</td>
                        <td>{r.bankCash}</td>
                        <td className="fw-bold text-success">{formatCurrency(r.amount)}</td>
                        <td>
                          <span className="badge bg-light text-dark font-monospace border px-2 py-1">{r.journalNumber}</span>
                        </td>
                        <td>
                          <span className={`custom-badge badge-posted ${r.postingStatus === 'Reversed' ? 'badge-reversed' : ''}`}>
                            {r.postingStatus}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <button className="btn btn-sm btn-light" title="View details" onClick={() => { setSelectedItem(r); setSelectedItemType('reimbursement'); setDetailsActiveTab('Overview'); }}>
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            {r.postingStatus !== 'Reversed' && (
                              <button className="btn btn-sm btn-outline-danger border-0" title="Reverse Posting" onClick={() => handleReversePosting('reimbursement', r.id)}>
                                <FontAwesomeIcon icon={faUndo} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. DETAILS SIDE DRAWER PANEL (For Row Selections)                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className={`drawer-overlay ${selectedItem ? 'open' : ''}`} onClick={() => setSelectedItem(null)}></div>
      <div className={`details-drawer text-start d-flex flex-column ${selectedItem ? 'open' : ''}`}>
        {selectedItem && (
          <>
            {/* Drawer Header */}
            <div className="p-4 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-primary text-white mb-1 font-monospace">{selectedItemType.toUpperCase()} POSTING</span>
                <h4 className="fw-bold mb-0 text-slate-800">
                  {selectedItem.postingNo || selectedItem.id}
                </h4>
                <span className="small text-muted">{selectedItem.reference || 'No Reference Mapped'}</span>
              </div>
              <button className="btn btn-close" onClick={() => setSelectedItem(null)}></button>
            </div>

            {/* Drawer Tab Navigation */}
            <div className="px-3 border-bottom bg-white d-flex overflow-x-auto gap-2" style={{ whiteSpace: 'nowrap' }}>
              {selectedItemType === 'payroll' && [
                'Overview', 'Journal Lines', 'Payroll Summary', 'Employees', 'GL Entries', 'Ledger Impact', 'Cost Center Allocation', 'Department Allocation', 'Budget Impact', 'Attachments', 'Timeline', 'AI Insights'
              ].map(t => (
                <button 
                  key={t} 
                  className={`btn btn-sm py-2 px-3 fw-bold border-0 border-bottom rounded-0 ${detailsActiveTab === t ? 'border-primary text-primary border-3' : 'text-muted'}`}
                  onClick={() => setDetailsActiveTab(t)}
                >
                  {t}
                </button>
              ))}

              {selectedItemType === 'advance' && [
                'Overview', 'Employee', 'Accounting', 'Journal Entries', 'Recovery Schedule', 'Payroll Recovery', 'Ledger Impact', 'Cost Center', 'Attachments', 'Timeline', 'AI Insights'
              ].map(t => (
                <button 
                  key={t} 
                  className={`btn btn-sm py-2 px-3 fw-bold border-0 border-bottom rounded-0 ${detailsActiveTab === t ? 'border-primary text-primary border-3' : 'text-muted'}`}
                  onClick={() => setDetailsActiveTab(t)}
                >
                  {t}
                </button>
              ))}

              {selectedItemType === 'reimbursement' && [
                'Overview', 'Expense Claim', 'Employee', 'Accounting Entries', 'Journal', 'Ledger Impact', 'Payment Details', 'Cost Center Allocation', 'Project Allocation', 'Budget Impact', 'Attachments', 'Timeline', 'AI Insights'
              ].map(t => (
                <button 
                  key={t} 
                  className={`btn btn-sm py-2 px-3 fw-bold border-0 border-bottom rounded-0 ${detailsActiveTab === t ? 'border-primary text-primary border-3' : 'text-muted'}`}
                  onClick={() => setDetailsActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Drawer Contents */}
            <div className="p-4 flex-grow-1 overflow-y-auto" style={{ backgroundColor: isDark ? '#111827' : '#FCFDFE' }}>
              
              {/* DETAILS TABS FOR PAYROLL POSTING */}
              {selectedItemType === 'payroll' && (
                <>
                  {detailsActiveTab === 'Overview' && (
                    <div className="animate-fade-in">
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <span className="small text-muted d-block">Batch Code</span>
                          <strong>{selectedItem.batch}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Period Month</span>
                          <strong>{selectedItem.month}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Posting Date</span>
                          <strong>{selectedItem.postingDate}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Posted By</span>
                          <strong>{selectedItem.postedBy}</strong>
                        </div>
                      </div>

                      <div className="card p-3 mb-3">
                        <span className="small text-muted d-block mb-2">Workflow Status Info</span>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small">General Ledger State:</span>
                          <span className="badge bg-success">{selectedItem.status}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small">Maker Checker Authorization:</span>
                          <span className="badge bg-primary">{selectedItem.approvalStatus}</span>
                        </div>
                        {selectedItem.approvedBy && (
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small">Authorized Representative:</span>
                            <span className="small fw-semibold">{selectedItem.approvedBy}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Action Operations */}
                      <div className="d-flex gap-2 mt-4">
                        <button className="btn btn-outline-secondary btn-sm flex-grow-1" onClick={() => addNotification('Journal Voucher downloaded.', 'success')}><FontAwesomeIcon icon={faDownload} /> Voucher</button>
                        <button className="btn btn-outline-secondary btn-sm flex-grow-1" onClick={() => addNotification('Voucher printed.', 'success')}><FontAwesomeIcon icon={faPrint} /> Print</button>
                        {selectedItem.status !== 'Reversed' && (
                          <button className="btn btn-danger btn-sm flex-grow-1" onClick={() => handleReversePosting('payroll', selectedItem.postingNo)}><FontAwesomeIcon icon={faUndo} /> Reverse Journal</button>
                        )}
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Journal Lines' && (
                    <div className="animate-fade-in table-responsive">
                      <table className="table table-sm align-middle" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Account</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>510100 - Salary Expense</td>
                            <td className="text-end">{formatCurrency(selectedItem.grossSalary)}</td>
                            <td className="text-end">-</td>
                          </tr>
                          <tr>
                            <td>510200 - Employer PF Expense</td>
                            <td className="text-end">{formatCurrency(selectedItem.employerPF || 320000)}</td>
                            <td className="text-end">-</td>
                          </tr>
                          <tr>
                            <td>510300 - Employer EOBI Expense</td>
                            <td className="text-end">{formatCurrency(selectedItem.employerEOBI || 110000)}</td>
                            <td className="text-end">-</td>
                          </tr>
                          <tr>
                            <td>210100 - Salary Payable</td>
                            <td className="text-end">-</td>
                            <td className="text-end">{formatCurrency(selectedItem.netPay)}</td>
                          </tr>
                          <tr>
                            <td>210200 - Income Tax Payable</td>
                            <td className="text-end">-</td>
                            <td className="text-end">{formatCurrency(selectedItem.taxes || 520000)}</td>
                          </tr>
                          <tr className="table-secondary fw-bold">
                            <td>Totals Check (Balanced)</td>
                            <td className="text-end">{formatCurrency(selectedItem.debit)}</td>
                            <td className="text-end">{formatCurrency(selectedItem.credit)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {detailsActiveTab === 'Payroll Summary' && (
                    <div className="animate-fade-in">
                      <h6>Calculation breakdown:</h6>
                      <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item d-flex justify-content-between"><span>Gross salary:</span> <strong>{formatCurrency(selectedItem.grossSalary)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Deductions:</span> <strong className="text-danger">-{formatCurrency(selectedItem.deductions)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Employer PF Portion:</span> <strong>{formatCurrency(selectedItem.employerPF || 320000)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Employer EOBI Portion:</span> <strong>{formatCurrency(selectedItem.employerEOBI || 110000)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Overtime Disbursed:</span> <strong>{formatCurrency(selectedItem.overtime || 0)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between bg-light fw-bold"><span>Net salary posted:</span> <strong className="text-success">{formatCurrency(selectedItem.netPay)}</strong></li>
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'Employees' && (
                    <div className="animate-fade-in text-start">
                      <p className="small text-muted">Aggregated Employee Payroll Journal Impact List</p>
                      <table className="table table-sm" style={{ fontSize: '11px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Employee</th>
                            <th>Code</th>
                            <th>Gross</th>
                            <th>Tax</th>
                            <th>Net</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Sohail Bashir</td>
                            <td>MC-1002</td>
                            <td>{formatCurrency(250000)}</td>
                            <td>{formatCurrency(25000)}</td>
                            <td>{formatCurrency(210000)}</td>
                          </tr>
                          <tr>
                            <td>Amna Nawaz</td>
                            <td>MC-1033</td>
                            <td>{formatCurrency(180000)}</td>
                            <td>{formatCurrency(15000)}</td>
                            <td>{formatCurrency(152000)}</td>
                          </tr>
                          <tr>
                            <td>Bilal Siddiqui</td>
                            <td>MC-1088</td>
                            <td>{formatCurrency(310000)}</td>
                            <td>{formatCurrency(38000)}</td>
                            <td>{formatCurrency(250000)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {detailsActiveTab === 'GL Entries' && (
                    <div className="animate-fade-in small font-monospace">
                      <h6>Voucher General Ledger postings detail log:</h6>
                      <div className="bg-dark text-light p-3 rounded shadow-sm">
                        [POST] {selectedItem.postingDate} - General Ledger integration layer:<br/>
                        &nbsp;&nbsp;Debit  Account 510100 Amount: {selectedItem.grossSalary}<br/>
                        &nbsp;&nbsp;Debit  Account 510200 Amount: 320000<br/>
                        &nbsp;&nbsp;Credit Account 210100 Amount: {selectedItem.netPay}<br/>
                        &nbsp;&nbsp;Credit Account 210200 Amount: 520000<br/>
                        STATUS CODE: 200 SUCCESS - Ledger Balances Updated.
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Ledger Impact' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-2">T-Account Balances Updates:</strong>
                      <div className="row g-2">
                        <div className="col-6 border-end">
                          <span className="badge bg-success mb-1">DEBIT SIDES</span>
                          <div className="p-2 bg-light mb-1">510100 Salary Expense: {formatCurrency(selectedItem.grossSalary)}</div>
                          <div className="p-2 bg-light">510200 PF Expense: {formatCurrency(selectedItem.employerPF || 320000)}</div>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-danger mb-1">CREDIT SIDES</span>
                          <div className="p-2 bg-light mb-1">210100 Salaries Payable: {formatCurrency(selectedItem.netPay)}</div>
                          <div className="p-2 bg-light">210200 Tax Payable: {formatCurrency(selectedItem.taxes || 520000)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Cost Center Allocation' && (
                    <div className="animate-fade-in small">
                      <strong className="d-block mb-2">Cost Center Consumption Breakdown:</strong>
                      <div className="d-flex justify-content-between mb-1"><span>CC-HQ-OPS (Karachi Operations)</span> <strong>60% ({formatCurrency(selectedItem.grossSalary * 0.6)})</strong></div>
                      <div className="progress mb-2" style={{ height: '8px' }}><div className="progress-bar bg-primary" style={{ width: '60%' }}></div></div>
                      <div className="d-flex justify-content-between mb-1"><span>CC-SALES-MKTG</span> <strong>30% ({formatCurrency(selectedItem.grossSalary * 0.3)})</strong></div>
                      <div className="progress mb-2" style={{ height: '8px' }}><div className="progress-bar bg-info" style={{ width: '30%' }}></div></div>
                      <div className="d-flex justify-content-between mb-1"><span>CC-HR-PF (Corporate Benefits)</span> <strong>10% ({formatCurrency(selectedItem.grossSalary * 0.1)})</strong></div>
                      <div className="progress" style={{ height: '8px' }}><div className="progress-bar bg-warning" style={{ width: '10%' }}></div></div>
                    </div>
                  )}

                  {detailsActiveTab === 'Department Allocation' && (
                    <div className="animate-fade-in small">
                      <strong className="d-block mb-2">Department Allocation:</strong>
                      <div className="d-flex justify-content-between mb-1"><span>Software Engineering</span> <strong>50%</strong></div>
                      <div className="progress mb-2" style={{ height: '6px' }}><div className="progress-bar bg-dark" style={{ width: '50%' }}></div></div>
                      <div className="d-flex justify-content-between mb-1"><span>Sales & BD</span> <strong>35%</strong></div>
                      <div className="progress mb-2" style={{ height: '6px' }}><div className="progress-bar bg-dark" style={{ width: '35%' }}></div></div>
                      <div className="d-flex justify-content-between mb-1"><span>Customer Success</span> <strong>15%</strong></div>
                      <div className="progress" style={{ height: '6px' }}><div className="progress-bar bg-dark" style={{ width: '15%' }}></div></div>
                    </div>
                  )}

                  {detailsActiveTab === 'Budget Impact' && (
                    <div className="animate-fade-in small">
                      <strong className="d-block mb-2">FMS Budget Allocation Check:</strong>
                      <div className="p-3 rounded bg-light border mb-2">
                        <span className="d-block text-muted">HQ Operations Budget (Q3):</span>
                        <strong>PKR 50,000,000</strong>
                        <div className="d-flex justify-content-between mt-2 text-muted x-small">
                          <span>Used (with this posting):</span>
                          <span>Remaining:</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold text-dark mb-1">
                          <span>PKR {formatCurrency(selectedItem.grossSalary)} (12.4%)</span>
                          <span>PKR 43,800,000</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}><div className="progress-bar bg-success" style={{ width: '12.4%' }}></div></div>
                      </div>
                      <div className="alert alert-success p-2 small"><FontAwesomeIcon icon={faCheckCircle} /> Budget allocation is within limits. No warnings.</div>
                    </div>
                  )}

                  {detailsActiveTab === 'Attachments' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-2">Attached Payroll Run Files:</strong>
                      <div className="p-2 border rounded d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <FontAwesomeIcon icon={faFileExcel} className="text-success me-2" />
                          <span>finalized_payroll_jul_regular.xlsx</span>
                        </div>
                        <button className="btn btn-sm btn-light" onClick={() => addNotification('Attachment download triggered.', 'success')}><FontAwesomeIcon icon={faDownload} /></button>
                      </div>
                      <div className="p-2 border rounded d-flex justify-content-between align-items-center">
                        <div>
                          <FontAwesomeIcon icon={faFilePdf} className="text-danger me-2" />
                          <span>hr_director_payroll_signoff.pdf</span>
                        </div>
                        <button className="btn btn-sm btn-light" onClick={() => addNotification('Attachment download triggered.', 'success')}><FontAwesomeIcon icon={faDownload} /></button>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Timeline' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-3">Voucher Lifecycle Timeline:</strong>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex gap-2">
                          <FontAwesomeIcon icon={faPlus} className="text-muted mt-1" />
                          <div>
                            <strong>Draft Payroll Posting Created</strong>
                            <span className="d-block text-muted x-small">{selectedItem.createdDate || '2026-07-07 09:00 AM'}</span>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <FontAwesomeIcon icon={faCheck} className="text-info mt-1" />
                          <div>
                            <strong>Maker Authorization (Approved)</strong>
                            <span className="d-block text-muted x-small">{selectedItem.createdDate || '2026-07-07 10:15 AM'} by {selectedItem.approvedBy}</span>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success mt-1" />
                          <div>
                            <strong>Journal Voucher posted to General Ledger</strong>
                            <span className="d-block text-muted x-small">{selectedItem.postingDate} by {selectedItem.postedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'AI Insights' && (
                    <div className="animate-fade-in small text-start">
                      <div className="alert alert-info p-3 mb-2">
                        <h6 className="fw-bold"><FontAwesomeIcon icon={faRobot} /> AI Anomaly Detection Reports</h6>
                        <ul className="mb-0 pl-3">
                          <li>Employee Salary Anomaly: Checked (0 alerts). All salaries match assigned contracts.</li>
                          <li>Duplicate Journal Check: No matching references found in ledger archives.</li>
                          <li>Tax Calculation Validation: Mapped tax portions match federal FBR slabs exactly.</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-light border rounded">
                        <strong>Variance Analysis:</strong>
                        <span className="d-block text-muted">This run is <strong>+2.4%</strong> higher than June 2026 payroll, primarily driven by 150,000 overtime payouts in Karachi branch.</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* DETAILS TABS FOR EMPLOYEE ADVANCES */}
              {selectedItemType === 'advance' && (
                <>
                  {detailsActiveTab === 'Overview' && (
                    <div className="animate-fade-in">
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <span className="small text-muted d-block">Employee</span>
                          <strong>{selectedItem.employee}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Employee Code</span>
                          <strong>{selectedItem.employeeCode}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Department</span>
                          <strong>{selectedItem.department}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Advance Type</span>
                          <strong>{selectedItem.advanceType}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Approved Amount</span>
                          <strong className="text-success">{formatCurrency(selectedItem.amount)}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Remaining Balance</span>
                          <strong className="text-danger">{formatCurrency(selectedItem.remainingBalance)}</strong>
                        </div>
                      </div>

                      {/* Installment progress indicator */}
                      <div className="card p-3 mb-4 bg-light border-0">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small text-muted fw-bold">Recovery Progress:</span>
                          <span className="small fw-bold">
                            {Math.round(((selectedItem.amount - selectedItem.remainingBalance) / selectedItem.amount) * 100)}%
                          </span>
                        </div>
                        <div className="progress mb-2" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${((selectedItem.amount - selectedItem.remainingBalance) / selectedItem.amount) * 100}%` }}
                          ></div>
                        </div>
                        <span className="x-small text-muted">Recovered: {formatCurrency(selectedItem.amount - selectedItem.remainingBalance)} / Total: {formatCurrency(selectedItem.amount)}</span>
                      </div>

                      {/* Quick Actions */}
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary flex-grow-1" onClick={() => addNotification('Payment voucher printed.', 'info')}><FontAwesomeIcon icon={faPrint} /> Print Receipt</button>
                        {selectedItem.status !== 'Reversed' && (
                          <button className="btn btn-sm btn-danger flex-grow-1" onClick={() => handleReversePosting('advance', selectedItem.postingNo)}><FontAwesomeIcon icon={faUndo} /> Reverse Disbursement</button>
                        )}
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Employee' && (
                    <div className="animate-fade-in small text-start">
                      <h6>Employee HR Details:</h6>
                      <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item d-flex justify-content-between"><span>Employee Name:</span> <strong>{selectedItem.employee}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Employee ID:</span> <strong>{selectedItem.employeeCode}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Designation:</span> <strong>Software Engineer</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Contract Salary:</span> <strong>{formatCurrency(190000)} / month</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Outstanding Advance Balance:</span> <strong className="text-danger">{formatCurrency(selectedItem.remainingBalance)}</strong></li>
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'Accounting' && (
                    <div className="animate-fade-in small text-start">
                      <h6>Ledger Mapping Rules applied:</h6>
                      <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item d-flex justify-content-between"><span>Debit Account:</span> <span className="font-monospace">112040 - Employee Advances Receivable</span></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Credit Account:</span> <span className="font-monospace">110200 - Bank / Cash Payout</span></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Cost Center:</span> <span className="font-monospace">CC-ENG-202</span></li>
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'Journal Entries' && (
                    <div className="animate-fade-in table-responsive">
                      <table className="table table-sm align-middle" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Account Code & Name</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>112040 - Employee Advances Receivable</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                            <td className="text-end">-</td>
                          </tr>
                          <tr>
                            <td>110200 - Meezan Bank - Operations</td>
                            <td className="text-end">-</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                          </tr>
                          <tr className="table-secondary fw-bold">
                            <td>Totals check</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {detailsActiveTab === 'Recovery Schedule' && (
                    <div className="animate-fade-in text-start small">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong className="d-block">Installment Amortization:</strong>
                        <button className="btn btn-xs btn-outline-primary" onClick={() => addNotification('Manual installment recovery posted.', 'success')}>Post Manual Recovery</button>
                      </div>
                      
                      <div className="d-flex flex-column gap-2 mb-3">
                        <div className={`p-2 rounded border d-flex justify-content-between align-items-center ${selectedItem.recoveredAmount > 0 ? 'bg-success bg-opacity-5' : ''}`}>
                          <div>
                            <strong>Installment 1: {formatCurrency(15000)}</strong>
                            <span className="d-block text-muted x-small">Due Month: July 2026</span>
                          </div>
                          <span className={`badge ${selectedItem.recoveredAmount > 0 ? 'bg-success' : 'bg-warning'}`}>
                            {selectedItem.recoveredAmount > 0 ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className="p-2 rounded border bg-light d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Installment 2: {formatCurrency(15000)}</strong>
                            <span className="d-block text-muted x-small">Due Month: August 2026</span>
                          </div>
                          <span className="badge bg-warning">Pending</span>
                        </div>
                        {selectedItem.recoveryPeriod > 2 && (
                          <div className="p-2 rounded border bg-light d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Installment 3: {formatCurrency(15000)}</strong>
                              <span className="d-block text-muted x-small">Due Month: September 2026</span>
                            </div>
                            <span className="badge bg-warning">Pending</span>
                          </div>
                        )}
                      </div>

                      {/* Management Controls */}
                      <div className="p-3 border rounded bg-white">
                        <span className="small text-muted d-block mb-2">Recovery Controls:</span>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-warning w-50" onClick={() => addNotification('Payroll recovery paused for next month.', 'warning')}><FontAwesomeIcon icon={faBan} /> Pause Recovery</button>
                          <button className="btn btn-sm btn-outline-success w-50" onClick={() => {
                            // Update list state
                            setAdvances(prev => prev.map(a => a.postingNo === selectedItem.postingNo ? { ...a, remainingBalance: 0, recoveredAmount: a.amount } : a));
                            setSelectedItem(prev => ({ ...prev, remainingBalance: 0, recoveredAmount: prev.amount }));
                            addNotification('Early full settlement processed.', 'success');
                          }}><FontAwesomeIcon icon={faCheckCircle} /> Early Settlement</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Payroll Recovery' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-2">HRMS Payroll Deduction Sync Logs:</strong>
                      <div className="p-3 rounded bg-light font-monospace" style={{ fontSize: '11px' }}>
                        [SYNC] 2026-06-30 Payroll Run batch:<br/>
                        &nbsp;&nbsp;Found active advance ADVP-2026-001<br/>
                        &nbsp;&nbsp;Auto deduct amount: PKR 15,000.00 from salary month June 2026.<br/>
                        &nbsp;&nbsp;Updated ledger remaining: PKR 30,000.00<br/>
                        [STATUS] SUCCESS - Sync completed.
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Ledger Impact' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-2">T-Account impact details:</strong>
                      <div className="p-2 border rounded mb-2">
                        <span className="text-muted d-block">112040 - Employee Advances Receivable</span>
                        <span className="text-success fw-bold">+{formatCurrency(selectedItem.amount)} (Asset Debit Increase)</span>
                      </div>
                      <div className="p-2 border rounded">
                        <span className="text-muted d-block">110200 - Meezan Bank - Operations</span>
                        <span className="text-danger fw-bold">-{formatCurrency(selectedItem.amount)} (Asset Credit Decrease)</span>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Cost Center' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-1">Responsible Cost Center:</strong>
                      <span>{selectedItem.department} Operations ({selectedItem.postingNo})</span>
                      <hr/>
                      <span className="text-muted x-small">Salary advances are mapped to the employee's parent department cost code for general ledger reporting.</span>
                    </div>
                  )}

                  {detailsActiveTab === 'Attachments' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-2">Agreement Attachments:</strong>
                      <div className="p-2 border rounded d-flex justify-content-between align-items-center">
                        <div>
                          <FontAwesomeIcon icon={faFilePdf} className="text-danger me-2" />
                          <span>signed_advance_agreement.pdf</span>
                        </div>
                        <button className="btn btn-sm btn-light" onClick={() => addNotification('Document downloaded.', 'success')}><FontAwesomeIcon icon={faDownload} /></button>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Timeline' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-3">Timeline:</strong>
                      <ul className="list-unstyled p-0">
                        <li className="mb-2"><FontAwesomeIcon icon={faPlus} className="text-muted me-2" /> Approved Request Sync: {selectedItem.requestDate}</li>
                        <li className="mb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Disbursed & Posted to GL: {selectedItem.postingDate} by {selectedItem.postedBy}</li>
                        {selectedItem.recoveredAmount > 0 && (
                          <li><FontAwesomeIcon icon={faHistory} className="text-primary me-2" /> June Payroll recovery posted (PKR 15,000)</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'AI Insights' && (
                    <div className="animate-fade-in text-start small">
                      <div className="p-3 bg-light border rounded">
                        <h6 className="fw-bold mb-2"><FontAwesomeIcon icon={faRobot} /> Credit & Recovery Risk Analysis</h6>
                        <p className="mb-0">Employee credit limit risk score: <strong>5% (Low Risk)</strong>. Monthly installment represents 7.8% of base salary (well below the 30% HR policy threshold). Recommended for normal recovery schedule.</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* DETAILS TABS FOR EXPENSE REIMBURSEMENTS */}
              {selectedItemType === 'reimbursement' && (
                <>
                  {detailsActiveTab === 'Overview' && (
                    <div className="animate-fade-in">
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <span className="small text-muted d-block">Employee</span>
                          <strong>{selectedItem.employee}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Employee ID</span>
                          <strong>{selectedItem.employeeCode}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Expense Category</span>
                          <strong>{selectedItem.expenseCategory}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Payout Source</span>
                          <strong>{selectedItem.bankCash}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Claim Amount</span>
                          <strong className="text-success">{formatCurrency(selectedItem.amount)}</strong>
                        </div>
                        <div className="col-6">
                          <span className="small text-muted d-block">Input Tax portion</span>
                          <strong>{formatCurrency(selectedItem.tax || 800)}</strong>
                        </div>
                      </div>

                      <div className="card p-3 mb-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Accounting Status:</span>
                          <span className="badge bg-success">{selectedItem.postingStatus}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Reimbursement Payment:</span>
                          <span className="badge bg-primary">{selectedItem.paymentStatus}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary flex-grow-1" onClick={() => addNotification('Payment receipt printed.', 'info')}><FontAwesomeIcon icon={faPrint} /> Print Receipt</button>
                        {selectedItem.postingStatus !== 'Reversed' && (
                          <button className="btn btn-sm btn-danger flex-grow-1" onClick={() => handleReversePosting('reimbursement', selectedItem.id)}><FontAwesomeIcon icon={faUndo} /> Reverse Journal</button>
                        )}
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Expense Claim' && (
                    <div className="animate-fade-in small text-start">
                      <h6>Expense Claim Metadata:</h6>
                      <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item d-flex justify-content-between"><span>HRMS Claim Code:</span> <strong>{selectedItem.claimNo}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Submit Date:</span> <strong>{selectedItem.claimDate}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Expense Type:</span> <strong>{selectedItem.expenseCategory}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Vendor Details:</span> <strong>Pearl Continental Hotels</strong></li>
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'Employee' && (
                    <div className="animate-fade-in small text-start">
                      <h6>Employee Profile:</h6>
                      <span>Name: {selectedItem.employee} ({selectedItem.employeeCode})</span>
                      <br/>
                      <span>Department: {selectedItem.department}</span>
                    </div>
                  )}

                  {detailsActiveTab === 'Accounting Entries' && (
                    <div className="animate-fade-in small font-monospace">
                      <h6>Generated balanced double-entry voucher detail:</h6>
                      <div className="bg-dark text-light p-3 rounded">
                        JV-REIM {selectedItem.id} posted:<br/>
                        &nbsp;&nbsp;Debit  Account 510800 Amount: {selectedItem.amount - (selectedItem.tax || 800)} (Travel Expense)<br/>
                        &nbsp;&nbsp;Debit  Account 111300 Amount: {selectedItem.tax || 800} (Input Tax)<br/>
                        &nbsp;&nbsp;Credit Account 110200 Amount: {selectedItem.amount} (Bank / Cash Payout)<br/>
                        Double Entry Status: BALANCED.
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Journal' && (
                    <div className="animate-fade-in table-responsive">
                      <table className="table table-sm align-middle" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Account Ledger</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>510800 - Travel Expense</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount - (selectedItem.tax || 800))}</td>
                            <td className="text-end">-</td>
                          </tr>
                          <tr>
                            <td>111300 - Input Tax Receivable</td>
                            <td className="text-end">{formatCurrency(selectedItem.tax || 800)}</td>
                            <td className="text-end">-</td>
                          </tr>
                          <tr>
                            <td>110200 - Meezan Bank - Operations</td>
                            <td className="text-end">-</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                          </tr>
                          <tr className="table-secondary fw-bold">
                            <td>Voucher totals check</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                            <td className="text-end">{formatCurrency(selectedItem.amount)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {detailsActiveTab === 'Ledger Impact' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-2">T-Account impact:</strong>
                      <div className="p-2 border rounded mb-2"><span>510800 Travel Expense (Dr):</span> <strong className="text-success">+{formatCurrency(selectedItem.amount - (selectedItem.tax || 800))}</strong></div>
                      <div className="p-2 border rounded"><span>110200 Bank Operations (Cr):</span> <strong className="text-danger">-{formatCurrency(selectedItem.amount)}</strong></div>
                    </div>
                  )}

                  {detailsActiveTab === 'Payment Details' && (
                    <div className="animate-fade-in small text-start">
                      <h6>Payout Execution Details:</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between"><span>Payment Method:</span> <strong>{selectedItem.paymentMethod}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Payout Source:</span> <strong>{selectedItem.bankCash}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Transaction Date:</span> <strong>{selectedItem.postingDate}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Payment Status:</span> <strong className="text-success">Paid</strong></li>
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'Cost Center Allocation' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-1">Debited Cost Center:</strong>
                      <span>{selectedItem.costCenter || 'CC-SALES-102'}</span>
                    </div>
                  )}

                  {detailsActiveTab === 'Project Allocation' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-1">Project Code:</strong>
                      <span>{selectedItem.project || 'N/A'}</span>
                    </div>
                  )}

                  {detailsActiveTab === 'Budget Impact' && (
                    <div className="animate-fade-in small text-start">
                      <strong className="d-block mb-2">Project Expense Budget Check:</strong>
                      <div className="p-3 bg-light border rounded">
                        <span className="d-block text-muted">Dubai Expo 2026 Travel Budget:</span>
                        <strong>PKR 1,500,000</strong>
                        <div className="d-flex justify-content-between mt-2 text-muted x-small">
                          <span>Used: PKR 820,000</span>
                          <span>Remaining: PKR 680,000</span>
                        </div>
                        <div className="progress mt-1" style={{ height: '8px' }}><div className="progress-bar bg-success" style={{ width: '54.6%' }}></div></div>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Attachments' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-2">Receipt Scan attachments:</strong>
                      <div className="p-2 border rounded d-flex justify-content-between align-items-center">
                        <div>
                          <FontAwesomeIcon icon={faPaperclip} className="text-muted me-2" />
                          <span>pc_hotel_invoice_expo.pdf</span>
                        </div>
                        <button className="btn btn-sm btn-light" onClick={() => addNotification('Attachment downloaded.', 'success')}><FontAwesomeIcon icon={faDownload} /></button>
                      </div>
                    </div>
                  )}

                  {detailsActiveTab === 'Timeline' && (
                    <div className="animate-fade-in text-start small">
                      <strong className="d-block mb-3">Timeline:</strong>
                      <ul className="list-unstyled p-0">
                        <li className="mb-2"><FontAwesomeIcon icon={faPlus} className="text-muted me-2" /> Claim Approved in HRMS: {selectedItem.claimDate}</li>
                        <li className="mb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Journal posted & disburser generated: {selectedItem.postingDate} by {selectedItem.postedBy}</li>
                      </ul>
                    </div>
                  )}

                  {detailsActiveTab === 'AI Insights' && (
                    <div className="animate-fade-in text-start small">
                      <div className="p-3 bg-light border rounded">
                        <h6 className="fw-bold mb-2"><FontAwesomeIcon icon={faRobot} /> Receipt Validation AI Status</h6>
                        <ul className="mb-0 pl-3">
                          <li>OCR validation check: Verified (invoice number & amounts match).</li>
                          <li>Policy Compliance check: Approved (travel within corporate allowance parameters).</li>
                          <li>Duplicate Receipt check: Pass (no other claims reference this document hash).</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. MODAL WIZARDS                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}

      {/* WIZARD A: POST PAYROLL WIZARD */}
      {showPayrollWizard && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-start" style={{ borderRadius: '18px', backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              
              {/* Modal Header */}
              <div className="modal-header p-4 border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-slate-800">
                    <FontAwesomeIcon icon={faFileInvoice} className="text-primary me-2" />
                    Payroll Posting Wizard
                  </h5>
                  <span className="small text-muted">Generate journal voucher entries for finalized HRMS payroll batches.</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowPayrollWizard(false)}></button>
              </div>

              {/* Progress Tracker bar */}
              <div className="p-3 border-bottom bg-light bg-opacity-50">
                <div className="row text-center font-monospace" style={{ fontSize: '11px' }}>
                  {[
                    { step: 1, label: '1. Selection & Previews' },
                    { step: 2, label: '2. Chart of Accounts Map' },
                    { step: 3, label: '3. GL Validations check' },
                    { step: 4, label: '4. Post Voucher' }
                  ].map((s, idx) => (
                    <div className="col" key={idx}>
                      <div className={`p-2 rounded-pill fw-bold ${payrollStep === (idx + 1) ? 'bg-primary text-white shadow-sm' : 'bg-white text-muted border'}`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                
                {/* Step 1: Selection */}
                {payrollStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Company</label>
                        <select className="form-select form-select-sm" value={payrollForm.company} onChange={e => setPayrollForm({...payrollForm, company: e.target.value})}>
                          <option>Manage Core Enterprise Ltd</option>
                          <option>Manage Core Technologies</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Branch</label>
                        <select className="form-select form-select-sm" value={payrollForm.branch} onChange={e => setPayrollForm({...payrollForm, branch: e.target.value})}>
                          <option>HQ Karachi Office</option>
                          <option>NY Corporate Hub</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Payroll Batch Run</label>
                        <select 
                          className="form-select form-select-sm" 
                          value={payrollForm.batch}
                          onChange={e => handlePendingPayrollChange(e.target.value)}
                        >
                          {pendingPayrollRuns.map(r => (
                            <option key={r.batch} value={r.batch}>{r.batch} ({r.month})</option>
                          ))}
                          {pendingPayrollRuns.length === 0 && (
                            <option>No pending runs available</option>
                          )}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small text-muted fw-bold">Payroll Period</label>
                        <input type="text" className="form-control form-control-sm" value={payrollForm.period} disabled />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small text-muted fw-bold">Salary Month</label>
                        <input type="text" className="form-control form-control-sm" value={payrollForm.month} disabled />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small text-muted fw-bold">Currency</label>
                        <input type="text" className="form-control form-control-sm" value={payrollForm.currency} disabled />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small text-muted fw-bold">Posting Date</label>
                        <input type="date" className="form-control form-control-sm" value={payrollForm.postingDate} onChange={e => setPayrollForm({...payrollForm, postingDate: e.target.value})} />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Journal Date</label>
                        <input type="date" className="form-control form-control-sm" value={payrollForm.journalDate} onChange={e => setPayrollForm({...payrollForm, journalDate: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Posting Reference</label>
                        <input type="text" className="form-control form-control-sm" value={payrollForm.reference} onChange={e => setPayrollForm({...payrollForm, reference: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Preview Employee Count</label>
                        <input type="text" className="form-control form-control-sm" value={payrollForm.employees} disabled />
                      </div>

                      <div className="col-12">
                        <label className="form-label small text-muted fw-bold">Posting Notes</label>
                        <textarea className="form-control form-control-sm" rows="2" value={payrollForm.notes} onChange={e => setPayrollForm({...payrollForm, notes: e.target.value})} />
                      </div>
                    </div>

                    {/* Previews metrics */}
                    <div className="p-3 bg-light rounded-4 mt-4 text-start">
                      <h6 className="fw-bold mb-3 small text-slate-800 text-uppercase tracking-wider">Payroll Run Previews:</h6>
                      <div className="row g-2 text-center">
                        <div className="col-md-3 border-end">
                          <span className="small text-muted d-block">Gross Salary</span>
                          <strong className="fs-6 text-dark">{formatCurrency(payrollForm.grossSalary)}</strong>
                        </div>
                        <div className="col-md-3 border-end">
                          <span className="small text-muted d-block">Deductions</span>
                          <strong className="fs-6 text-danger">{formatCurrency(payrollForm.deductions)}</strong>
                        </div>
                        <div className="col-md-3 border-end">
                          <span className="small text-muted d-block">Employer Contribution</span>
                          <strong className="fs-6 text-warning">{formatCurrency(payrollForm.employerPF + payrollForm.employerEOBI)}</strong>
                        </div>
                        <div className="col-md-3">
                          <span className="small text-muted d-block">Net Salary Payable</span>
                          <strong className="fs-6 text-success">{formatCurrency(payrollForm.netSalary)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Chart of Accounts Mapping */}
                {payrollStep === 2 && (
                  <div className="animate-fade-in">
                    <p className="small text-muted mb-3">Double-Entry general journal ledger mapping. Allow manual edits of Debit/Credit values if adjustments are required.</p>
                    <div className="table-responsive">
                      <table className="table table-sm align-middle" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Account Code</th>
                            <th>Account Ledger Name</th>
                            <th>Cost Center</th>
                            <th className="text-end" style={{ width: '150px' }}>Debit (PKR)</th>
                            <th className="text-end" style={{ width: '150px' }}>Credit (PKR)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payrollJournalRows.map((r, idx) => (
                            <tr key={idx}>
                              <td className="font-monospace fw-bold">{r.code}</td>
                              <td>{r.name}</td>
                              <td>
                                <span className="badge bg-light text-dark font-monospace border">{r.costCenter}</span>
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm text-end font-monospace py-0"
                                  value={r.debit || ''}
                                  onChange={e => {
                                    const next = [...payrollJournalRows];
                                    next[idx].debit = Number(e.target.value) || 0;
                                    setPayrollJournalRows(next);
                                  }}
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm text-end font-monospace py-0"
                                  value={r.credit || ''}
                                  onChange={e => {
                                    const next = [...payrollJournalRows];
                                    next[idx].credit = Number(e.target.value) || 0;
                                    setPayrollJournalRows(next);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="table-secondary fw-bold">
                            <td colSpan="3">Journal Entry Balance Check</td>
                            <td className="text-end font-monospace">{formatCurrency(payrollTotals.debit)}</td>
                            <td className="text-end font-monospace">{formatCurrency(payrollTotals.credit)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {payrollTotals.diff !== 0 && (
                      <div className="alert alert-danger p-2 small mt-2 d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <strong>Verification Failed:</strong> Debits and Credits must balance to zero. Difference: {formatCurrency(payrollTotals.diff)}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Validations */}
                {payrollStep === 3 && (
                  <div className="animate-fade-in">
                    <p className="small text-muted mb-3">Running automated ledger checks, duplicate runs checks, and period close validation rules.</p>
                    <div className="d-flex flex-column gap-2 text-start">
                      <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <strong>Debit = Credit Balance Check</strong>
                          <span className="d-block text-muted small">Total debits must match credit values.</span>
                        </div>
                        <span className={`badge ${payrollTotals.diff === 0 ? 'bg-success' : 'bg-danger'}`}>
                          {payrollTotals.diff === 0 ? 'Passed' : 'Failed'}
                        </span>
                      </div>

                      <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <strong>Duplicate Payroll Run Posting Check</strong>
                          <span className="d-block text-muted small">Ensuring batch has not been posted to General Ledger previously.</span>
                        </div>
                        <span className="badge bg-success">Passed (No Duplicates)</span>
                      </div>

                      <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <strong>Fiscal Year & Period Lock Check</strong>
                          <span className="d-block text-muted small">Check that current month period is not closed in FMS.</span>
                        </div>
                        <span className="badge bg-success">Passed (Period Open)</span>
                      </div>

                      <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <strong>Chart of Accounts Mapping Validation</strong>
                          <span className="d-block text-muted small">Validating mapped ledger codes against Chart of Accounts.</span>
                        </div>
                        <span className="badge bg-success">Passed (All accounts verified)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {payrollStep === 4 && (
                  <div className="animate-fade-in text-center py-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success display-4 mb-3" />
                    <h4 className="fw-bold">Voucher Posting Ready</h4>
                    <p className="text-muted small mb-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
                      All system validations have passed successfully. Confirming will generate general ledger entries and lock the batch.
                    </p>
                    <div className="card p-3 mx-auto" style={{ maxWidth: '350px' }}>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Total Posted</span>
                        <strong>{formatCurrency(payrollTotals.debit)}</strong>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Voucher Ref</span>
                        <strong>{payrollForm.reference}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Batch</span>
                        <strong>{payrollForm.batch}</strong>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top p-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowPayrollWizard(false)}>Cancel</button>
                {payrollStep > 1 && (
                  <button className="btn btn-sm btn-light" onClick={() => setPayrollStep(payrollStep - 1)}>Back</button>
                )}
                {payrollStep < 4 ? (
                  <button className="btn btn-sm btn-primary text-white" onClick={() => setPayrollStep(payrollStep + 1)} disabled={payrollStep === 2 && payrollTotals.diff !== 0}>Next Step</button>
                ) : (
                  <button className="btn btn-sm btn-success text-white" onClick={executePostPayroll}>Post to GL</button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* WIZARD B: POST EMPLOYEE ADVANCE WIZARD */}
      {showAdvanceWizard && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-start" style={{ borderRadius: '18px', backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              
              <div className="modal-header p-4 border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-slate-800">
                    <FontAwesomeIcon icon={faCoins} className="text-warning me-2" />
                    Post Employee Advance Disbursement
                  </h5>
                  <span className="small text-muted">Generate disbursement entries for approved employee advances.</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowAdvanceWizard(false)}></button>
              </div>

              {/* Steps indicator */}
              <div className="p-3 border-bottom bg-light bg-opacity-50">
                <div className="row text-center font-monospace" style={{ fontSize: '11px' }}>
                  {[
                    { step: 1, label: '1. Selection & Terms' },
                    { step: 2, label: '2. Accounting Mappings' },
                    { step: 3, label: '3. Preview & Post' }
                  ].map((s, idx) => (
                    <div className="col" key={idx}>
                      <div className={`p-2 rounded-pill fw-bold ${advanceStep === (idx + 1) ? 'bg-warning text-dark shadow-sm' : 'bg-white text-muted border'}`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                
                {/* Step 1: Request selection & Previews */}
                {advanceStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Approved Advance Request</label>
                        <select 
                          className="form-select form-select-sm" 
                          value={advanceForm.reqNo}
                          onChange={e => handlePendingAdvanceChange(e.target.value)}
                        >
                          {pendingAdvances.map(a => (
                            <option key={a.reqNo} value={a.reqNo}>{a.reqNo} - {a.employee} ({formatCurrency(a.amount)})</option>
                          ))}
                          {pendingAdvances.length === 0 && (
                            <option>No pending advances available</option>
                          )}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Employee Name</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.employee} disabled />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Department</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.department} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Designation</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.designation} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Amount Approved (PKR)</label>
                        <input type="text" className="form-control form-control-sm fw-bold text-primary" value={formatCurrency(advanceForm.amount)} disabled />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Disbursement Date</label>
                        <input type="date" className="form-control form-control-sm" value={advanceForm.postingDate} onChange={e => setAdvanceForm({...advanceForm, postingDate: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Recovery Installments</label>
                        <input type="number" className="form-control form-control-sm" value={advanceForm.installments} onChange={e => setAdvanceForm({...advanceForm, installments: Number(e.target.value)})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Recovery Start Month</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.recoveryMonth} onChange={e => setAdvanceForm({...advanceForm, recoveryMonth: e.target.value})} />
                      </div>

                      <div className="col-12">
                        <label className="form-label small text-muted fw-bold">Posting Notes</label>
                        <textarea className="form-control form-control-sm" rows="2" value={advanceForm.notes} onChange={e => setAdvanceForm({...advanceForm, notes: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Mapping rules */}
                {advanceStep === 2 && (
                  <div className="animate-fade-in">
                    <p className="small text-muted mb-3">Chart of accounts ledger mappings for the advance asset and payout credit accounts.</p>
                    
                    <div className="row g-3 text-start mb-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Debit Account (Receivable Asset)</label>
                        <select className="form-select form-select-sm" value={advanceForm.receivableAccount} onChange={e => setAdvanceForm({...advanceForm, receivableAccount: e.target.value})}>
                          <option>112040 - Employee Advances Receivable</option>
                          <option>112030 - Employee Loans Receivable</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Credit Account (Bank/Cash Source)</label>
                        <select className="form-select form-select-sm" value={advanceForm.bankCash} onChange={e => setAdvanceForm({...advanceForm, bankCash: e.target.value})}>
                          <option>Meezan Bank - Operations</option>
                          <option>Petty Cash - Finance</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small text-muted">Cost Center</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.costCenter} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted">Branch Code</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.branch} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted">Currency</label>
                        <input type="text" className="form-control form-control-sm" value={advanceForm.currency} disabled />
                      </div>
                    </div>

                    <div className="table-responsive mt-4">
                      <table className="table table-sm" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Account Code</th>
                            <th>Ledger Name</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {advanceJournalRows.map((r, idx) => (
                            <tr key={idx}>
                              <td className="font-monospace fw-bold">{r.code}</td>
                              <td>{r.name}</td>
                              <td className="text-end font-monospace">{r.debit > 0 ? formatCurrency(r.debit) : '-'}</td>
                              <td className="text-end font-monospace">{r.credit > 0 ? formatCurrency(r.credit) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Step 3: Preview & Confirmation */}
                {advanceStep === 3 && (
                  <div className="animate-fade-in text-center py-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success display-5 mb-2" />
                    <h5 className="fw-bold">Ready to Disburse Advance</h5>
                    <p className="text-muted small mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
                      Generates voucher reference and sets up recovery schedule starting {advanceForm.recoveryMonth}.
                    </p>
                    <div className="card p-3 mx-auto" style={{ maxWidth: '380px' }}>
                      <div className="d-flex justify-content-between mb-2"><span>Employee:</span> <strong>{advanceForm.employee}</strong></div>
                      <div className="d-flex justify-content-between mb-2"><span>Amount:</span> <strong className="text-primary">{formatCurrency(advanceForm.amount)}</strong></div>
                      <div className="d-flex justify-content-between"><span>Installments:</span> <strong>{advanceForm.installments} Months</strong></div>
                    </div>
                  </div>
                )}

              </div>

              <div className="modal-footer border-top p-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAdvanceWizard(false)}>Cancel</button>
                {advanceStep > 1 && (
                  <button className="btn btn-sm btn-light" onClick={() => setAdvanceStep(advanceStep - 1)}>Back</button>
                )}
                {advanceStep < 3 ? (
                  <button className="btn btn-sm btn-warning text-dark fw-bold" onClick={() => setAdvanceStep(advanceStep + 1)}>Next Step</button>
                ) : (
                  <button className="btn btn-sm btn-success text-white" onClick={executePostAdvance}>Post & Disburse</button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* WIZARD C: POST EXPENSE REIMBURSEMENT WIZARD */}
      {showReimbursementWizard && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-start" style={{ borderRadius: '18px', backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              
              <div className="modal-header p-4 border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-slate-800">
                    <FontAwesomeIcon icon={faReceipt} className="text-info me-2" />
                    Post Expense Claim Reimbursement
                  </h5>
                  <span className="small text-muted">Post approved HRMS expense claims into accounting budgets.</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowReimbursementWizard(false)}></button>
              </div>

              {/* Steps */}
              <div className="p-3 border-bottom bg-light bg-opacity-50">
                <div className="row text-center font-monospace" style={{ fontSize: '11px' }}>
                  {[
                    { step: 1, label: '1. Claim Selection' },
                    { step: 2, label: '2. Ledger Mappings' },
                    { step: 3, label: '3. Preview & Post' }
                  ].map((s, idx) => (
                    <div className="col" key={idx}>
                      <div className={`p-2 rounded-pill fw-bold ${reimbursementStep === (idx + 1) ? 'bg-info text-dark shadow-sm' : 'bg-white text-muted border'}`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                
                {/* Step 1: claim selection */}
                {reimbursementStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Approved Expense Claim</label>
                        <select 
                          className="form-select form-select-sm"
                          value={reimbursementForm.claimNo}
                          onChange={e => handlePendingReimbursementChange(e.target.value)}
                        >
                          {pendingReimbursements.map(r => (
                            <option key={r.claimNo} value={r.claimNo}>{r.claimNo} - {r.employee} ({formatCurrency(r.amount)})</option>
                          ))}
                          {pendingReimbursements.length === 0 && (
                            <option>No pending claims available</option>
                          )}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Employee Name</label>
                        <input type="text" className="form-control form-control-sm" value={reimbursementForm.employee} disabled />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Employee ID</label>
                        <input type="text" className="form-control form-control-sm" value={reimbursementForm.empCode} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Expense Category</label>
                        <input type="text" className="form-control form-control-sm" value={reimbursementForm.expenseCategory} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Department</label>
                        <input type="text" className="form-control form-control-sm" value={reimbursementForm.department} disabled />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Project Allocation</label>
                        <input type="text" className="form-control form-control-sm" value={reimbursementForm.project} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Total Claim Amount</label>
                        <input type="text" className="form-control form-control-sm fw-bold text-success" value={formatCurrency(reimbursementForm.amount)} disabled />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small text-muted fw-bold">Input Tax portion</label>
                        <input type="text" className="form-control form-control-sm" value={formatCurrency(reimbursementForm.tax)} disabled />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Posting Date</label>
                        <input type="date" className="form-control form-control-sm" value={reimbursementForm.postingDate} onChange={e => setReimbursementForm({...reimbursementForm, postingDate: e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Payout Reference</label>
                        <input type="text" className="form-control form-control-sm" value={reimbursementForm.reference} onChange={e => setReimbursementForm({...reimbursementForm, reference: e.target.value})} />
                      </div>

                      <div className="col-12">
                        <label className="form-label small text-muted fw-bold">Posting Notes</label>
                        <textarea className="form-control form-control-sm" rows="2" value={reimbursementForm.notes} onChange={e => setReimbursementForm({...reimbursementForm, notes: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: mappings */}
                {reimbursementStep === 2 && (
                  <div className="animate-fade-in">
                    <p className="small text-muted mb-3">Chart of accounts ledger mappings for the reimbursement expense and payment source.</p>
                    
                    <div className="row g-3 mb-3 text-start">
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Debit Expense Account</label>
                        <select className="form-select form-select-sm" value={reimbursementForm.expenseAccount} onChange={e => setReimbursementForm({...reimbursementForm, expenseAccount: e.target.value})}>
                          <option>510800 - Travel Expense</option>
                          <option>510900 - Office Supplies Expense</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-bold">Credit Cash / Bank Account</label>
                        <select className="form-select form-select-sm" value={reimbursementForm.bankCash} onChange={e => setReimbursementForm({...reimbursementForm, bankCash: e.target.value})}>
                          <option>Meezan Bank - Operations</option>
                          <option>Petty Cash - Finance</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr className="table-light">
                            <th>Account Code</th>
                            <th>Ledger Name</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reimbursementJournalRows.map((r, idx) => (
                            <tr key={idx}>
                              <td className="font-monospace fw-bold">{r.code}</td>
                              <td>{r.name}</td>
                              <td className="text-end font-monospace">{r.debit > 0 ? formatCurrency(r.debit) : '-'}</td>
                              <td className="text-end font-monospace">{r.credit > 0 ? formatCurrency(r.credit) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Step 3: preview & confirmation */}
                {reimbursementStep === 3 && (
                  <div className="animate-fade-in text-center py-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success display-5 mb-2" />
                    <h5 className="fw-bold">Ready to Post Reimbursement</h5>
                    <p className="text-muted small mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
                      Generates voucher reference and posts disbursement payload. Updates General Ledger.
                    </p>
                    <div className="card p-3 mx-auto" style={{ maxWidth: '380px' }}>
                      <div className="d-flex justify-content-between mb-2"><span>Employee:</span> <strong>{reimbursementForm.employee}</strong></div>
                      <div className="d-flex justify-content-between mb-2"><span>Category:</span> <strong>{reimbursementForm.expenseCategory}</strong></div>
                      <div className="d-flex justify-content-between"><span>Payout Total:</span> <strong className="text-success">{formatCurrency(reimbursementForm.amount)}</strong></div>
                    </div>
                  </div>
                )}

              </div>

              <div className="modal-footer border-top p-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowReimbursementWizard(false)}>Cancel</button>
                {reimbursementStep > 1 && (
                  <button className="btn btn-sm btn-light" onClick={() => setReimbursementStep(reimbursementStep - 1)}>Back</button>
                )}
                {reimbursementStep < 3 ? (
                  <button className="btn btn-sm btn-info text-dark fw-bold" onClick={() => setReimbursementStep(reimbursementStep + 1)}>Next Step</button>
                ) : (
                  <button className="btn btn-sm btn-success text-white" onClick={executePostReimbursement}>Confirm & Post</button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', type: '', action: 'reverse', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Confirm Action"
        message="Are you sure you want to proceed? This action may generate counter-balancing ledger journals."
        itemName={deleteDialog.name}
        confirmLabel="Confirm"
      />
    </div>
  );
};

export default ErpPayrollHrIntegration;
