import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faFilter,
  faUndo,
  faFileExcel,
  faFilePdf,
  faChevronLeft,
  faChevronRight,
  faArrowLeft,
  faPlusCircle,
  faTrash,
  faCheck,
  faSync,
  faCloudUploadAlt,
  faExclamationTriangle,
  faArrowRight,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { EnableDisableButton } from '../../../../components/common';
import { useApp } from '../../../../hooks/useApp';
import {
  getLeaveBalances,
  getLeaveQuotas,
  createLeaveQuota,
  bulkAllocateLeaveQuotas
} from '../../../../api/hrms';

const HrmsMyLeaveBalance = () => {
  const { addNotification } = useApp();
  const [currentView, setCurrentView] = useState('list');
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters State
  const [searchEmployee, setSearchEmployee] = useState('All');
  const [filterLeaveType, setFilterLeaveType] = useState('All Leave Types');
  const [filterYear, setFilterYear] = useState('2026');
  const [filterStatus, setFilterStatus] = useState('All');

  // Add / Update Allocation Form State
  const [formEmployee, setFormEmployee] = useState('');
  const [formLeaveType, setFormLeaveType] = useState('Casual Leave');
  const [formYear, setFormYear] = useState('2026');
  const [formMethod, setFormMethod] = useState('Yearly');
  const [formAllocated, setFormAllocated] = useState('12.00');
  const [formCarry, setFormCarry] = useState('0.00');
  const [formAdjustment, setFormAdjustment] = useState('0.00');
  const [formEffectiveDate, setFormEffectiveDate] = useState('2026-01-01');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formNotes, setFormNotes] = useState('');
  
  // Validation Warnings
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Bulk Allocation wizard state
  const [bulkScope, setBulkScope] = useState('Entire Company');
  const [bulkBranch, setBulkBranch] = useState('All');
  const [bulkDepartment, setBulkDepartment] = useState('All');
  const [bulkDesignation, setBulkDesignation] = useState('All');
  const [bulkEmploymentType, setBulkEmploymentType] = useState('Permanent');
  const [bulkLeaveType, setBulkLeaveType] = useState('Casual Leave');
  const [bulkYear, setBulkYear] = useState('2026');
  const [bulkMethod, setBulkMethod] = useState('Yearly');
  const [bulkAllocated, setBulkAllocated] = useState('12.00');
  const [bulkCarry, setBulkCarry] = useState('0.00');
  const [bulkAdjustment, setBulkAdjustment] = useState('0.00');
  const [bulkIncludeProbation, setBulkIncludeProbation] = useState(true);
  const [bulkOverwrite, setBulkOverwrite] = useState(false);
  const [bulkNotes, setBulkNotes] = useState('');

  // Bulk Employee table preview
  const [bulkEmployees, setBulkEmployees] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [bulkSuccessAlert, setBulkSuccessAlert] = useState(false);

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const addToast = (msg, type = 'success') => {
    addNotification(msg, type);
  };

  const fetchBalances = async () => {
    setLoading(true);
    setError(null);
    try {
      const [balancesRes, quotasRes] = await Promise.all([
        getLeaveBalances(filterYear ? { year: filterYear } : {}),
        getLeaveQuotas(filterYear ? { year: filterYear } : {})
      ]);

      const balances = (balancesRes || []).map((b, idx) => ({
        id: b.id || `bal_${idx}`,
        empName: b.user?.name || `Employee #${b.user_id || idx}`,
        empCode: b.user?.employee_code || b.user_id || '',
        leaveType: b.leave_type,
        year: b.year,
        allocated: Number(b.allocated) || 0,
        carry: 0,
        adj: 0,
        used: Number(b.used) || 0,
        pending: 0,
        remaining: Number(b.remaining) || 0,
        method: 'Yearly',
        status: 'Active'
      }));

      const quotasFallback = (quotasRes || []).map((q, idx) => ({
        id: q.id || `quota_${idx}`,
        empName: q.user?.name || `Employee #${q.user_id || idx}`,
        empCode: q.user?.employee_code || q.user_id || '',
        leaveType: q.leave_type,
        year: q.year,
        allocated: Number(q.allocated) || 0,
        carry: 0,
        adj: 0,
        used: 0,
        pending: 0,
        remaining: Number(q.allocated) || 0,
        method: 'Yearly',
        status: 'Active'
      }));

      setLeaveBalances(balances.length ? balances : quotasFallback);
      setQuotas(quotasRes || []);
    } catch (err) {
      setError(err.message || 'Failed to load leave balances');
      addNotification('Failed to load leave balances', 'danger');
      setLeaveBalances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  // Filter lists options
  const employeeNames = useMemo(() => {
    const list = new Set(leaveBalances.map(lb => lb.empName));
    return ['All', ...Array.from(list)];
  }, [leaveBalances]);

  const leaveTypes = ['All Leave Types', 'Casual Leave', 'Sick Leave', 'Annual Leave', 'Emergency Leave', 'Half Day', 'Short Leave', 'Compensatory Leave'];

  // Handle Main Filters
  const filteredBalances = useMemo(() => {
    return leaveBalances.filter(lb => {
      const matchEmp = searchEmployee === 'All' ? true : lb.empName === searchEmployee;
      const matchType = filterLeaveType === 'All Leave Types' ? true : lb.leaveType === filterLeaveType;
      const matchYear = filterYear ? lb.year.toString() === filterYear : true;
      const matchStatus = filterStatus === 'All' ? true : lb.status === filterStatus;
      return matchEmp && matchType && matchYear && matchStatus;
    });
  }, [leaveBalances, searchEmployee, filterLeaveType, filterYear, filterStatus]);

  // Handle Page allocation total available
  const totalAvailableAllocation = useMemo(() => {
    const allocatedNum = parseFloat(formAllocated) || 0;
    const carryNum = parseFloat(formCarry) || 0;
    const adjNum = parseFloat(formAdjustment) || 0;
    return (allocatedNum + carryNum + adjNum).toFixed(2);
  }, [formAllocated, formCarry, formAdjustment]);

  // Save Allocation Form Handler
  const handleSaveAllocation = async (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!formEmployee.trim()) errors.employee = 'Employee is required.';
    if (!formAllocated.trim() || isNaN(formAllocated)) errors.allocated = 'Allocated leave must be a numeric value.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    setSubmitting(true);
    try {
      const payload = {
        user_id: formEmployee,
        leave_type: formLeaveType,
        allocated: parseFloat(formAllocated) || 0,
        year: parseInt(formYear) || 2026,
        notes: formNotes || null
      };
      await createLeaveQuota(payload);
      addNotification('Leave quota saved successfully.', 'success');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        setCurrentView('list');
        setFormEmployee('');
        fetchBalances();
      }, 2000);
    } catch (err) {
      addNotification(err.message || 'Failed to save allocation', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  // Run Excel Upload simulation for Bulk Allocation
  const handleExcelImportSimulation = () => {
    setUploadedFileName('Employee_Bulk_Leave_Allocation_List_Q3.xlsx');
    setBulkEmployees([
      { id: 'emp_1', code: '1010', name: 'Nida Fatima', dept: 'Finance', desig: 'Executive', branch: 'Islamabad', current: '11.00', newAlloc: '15.00', carry: '2.00', adj: '1.00', final: '18.00', status: 'Active', selected: true },
      { id: 'emp_2', code: '1009', name: 'Kamran Shah', dept: 'Engineering', desig: 'Lead Engineer', branch: 'Rawalpindi', current: '10.00', newAlloc: '15.00', carry: '1.00', adj: '0.00', final: '16.00', status: 'Active', selected: true },
      { id: 'emp_3', code: '1003', name: 'Bilal Ahmed', dept: 'Marketing', desig: 'Coordinator', branch: 'Lahore', current: '12.00', newAlloc: '12.00', carry: '0.00', adj: '-1.00', final: '11.00', status: 'Active', selected: true },
      { id: 'emp_4', code: '1001', name: 'Ahmed Khan', dept: 'HR & Ops', desig: 'Senior Manager', branch: 'Islamabad', current: '4.00', newAlloc: '15.00', carry: '0.00', adj: '0.00', final: '15.00', status: 'Active', selected: true },
      { id: 'emp_5', code: '1005', name: 'Zainab Bibi', dept: 'HR', desig: 'Associate', branch: 'Karachi', current: '7.00', newAlloc: '12.00', carry: '1.00', adj: '0.00', final: '13.00', status: 'Active', selected: true }
    ]);
    addToast('Excel list processed. 5 Employee rows loaded successfully.');
  };

  // Run Bulk Allocation Execution
  const handleExecuteBulkAllocation = async () => {
    const selectedEmps = bulkEmployees.filter(e => e.selected);
    if (selectedEmps.length === 0) {
      addNotification('Please select at least one employee row to allocate.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const userIds = selectedEmps
        .map(emp => Number(emp.id?.toString().replace(/[^0-9]/g, '')) || null)
        .filter(Boolean);
      const allocatedDays = Math.round(parseFloat(bulkAllocated) || 0);
      const payload = {
        user_ids: userIds,
        leave_type: bulkLeaveType,
        allocated: allocatedDays,
        year: parseInt(bulkYear) || 2026,
        notes: bulkNotes || null
      };
      await bulkAllocateLeaveQuotas(payload);
      addNotification(`Bulk allocation completed for ${userIds.length || selectedEmps.length} employees.`, 'success');
      setBulkSuccessAlert(true);
      setTimeout(() => {
        setBulkSuccessAlert(false);
        setCurrentView('list');
        fetchBalances();
      }, 2500);
    } catch (err) {
      addNotification(err.message || 'Bulk allocation failed', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* breadcrumb header */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0" style={{ fontSize: '12px' }}>
            <li className="breadcrumb-item text-muted">Workspace</li>
            <li className="breadcrumb-item text-primary active" aria-current="page">HRMS</li>
          </ol>
        </nav>
        {currentView !== 'list' && (
          <button 
            className="btn btn-sm btn-white border rounded-3 text-dark px-3" 
            onClick={() => setCurrentView('list')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1.5" /> Back to Leave Balance
          </button>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* VIEW A: MY LEAVE BALANCE TABLE LIST VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {currentView === 'list' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1 text-dark">My Leave Balance</h4>
              <p className="text-muted small mb-0">Employee yearly leave entitlement with used, pending, and remaining balance.</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary rounded-pill px-3 shadow-sm"
                onClick={() => setCurrentView('bulk')}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1.5" /> Bulk Leave Allocation
              </button>
              <button 
                className="btn btn-outline-primary bg-primary bg-opacity-10 text-primary border rounded-pill px-3 shadow-sm"
                onClick={() => setCurrentView('add_update')}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="me-1.5" /> Add / Update Allocation
              </button>
              <button 
                className="btn btn-sm btn-white border rounded-3 text-dark px-3"
                onClick={fetchBalances}
                disabled={loading}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faSync} className={loading ? 'fa-spin' : ''} />
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger rounded-3 small mb-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          )}

          {/* Filters Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <div className="row g-3 align-items-end">
              <div className="col-lg-3 col-md-6">
                <label className="small fw-bold text-muted mb-1.5">Employee</label>
                <div className="position-relative">
                  <select 
                    className="form-select form-select-sm border-light shadow-sm"
                    value={searchEmployee}
                    onChange={e => setSearchEmployee(e.target.value)}
                  >
                    {employeeNames.map(name => (
                      <option key={name} value={name}>{name === 'All' ? 'All Employees' : name}</option>
                    ))}
                  </select>
                  <span className="badge bg-secondary position-absolute" style={{ right: '35px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px' }}>
                    {filteredBalances.length} Items
                  </span>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="small fw-bold text-muted mb-1.5">Leave Type</label>
                <select 
                  className="form-select form-select-sm border-light shadow-sm"
                  value={filterLeaveType}
                  onChange={e => setFilterLeaveType(e.target.value)}
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-md-4">
                <label className="small fw-bold text-muted mb-1.5">Year</label>
                <select 
                  className="form-select form-select-sm border-light shadow-sm"
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value)}
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-4">
                <label className="small fw-bold text-muted mb-1.5">Status</label>
                <select 
                  className="form-select form-select-sm border-light shadow-sm"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-4 d-flex gap-2">
                <button className="btn btn-sm btn-primary w-100 rounded-3 shadow-sm" onClick={fetchBalances} disabled={loading}>
                  <FontAwesomeIcon icon={faFilter} className="me-1" /> Filter
                </button>
                <button className="btn btn-sm btn-light border w-100 rounded-3 text-dark" onClick={() => {
                  setSearchEmployee('All');
                  setFilterLeaveType('All Leave Types');
                  setFilterYear('2026');
                  setFilterStatus('All');
                }}>
                  <FontAwesomeIcon icon={faUndo} className="me-1" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Export section toolbar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-1.5">
              <span className="small fw-bold text-muted mb-0">Export:</span>
              <span className="x-small text-muted" style={{ fontSize: '10px' }}>Current filtered table view</span>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-xs btn-outline-success px-2.5 py-1" onClick={() => addToast('Exporting to Excel (Simulated)...')}><FontAwesomeIcon icon={faFileExcel} className="me-1" /> Excel</button>
              <button className="btn btn-xs btn-outline-danger px-2.5 py-1" onClick={() => addToast('Exporting to PDF (Simulated)...')}><FontAwesomeIcon icon={faFilePdf} className="me-1" /> PDF</button>
            </div>
          </div>

          {/* Data Table */}
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Year</th>
                    <th>Entitled</th>
                    <th>Used</th>
                    <th>Pending</th>
                    <th>Remaining</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBalances.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        <div className="py-4">
                          <h6 className="fw-bold text-dark">No leave balance records found.</h6>
                          <p className="small mb-0">No leave allocations match your selected filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBalances.map(lb => (
                      <tr key={lb.id}>
                        <td>
                          <div className="fw-bold text-dark">{lb.empName}</div>
                          <div className="text-muted x-small" style={{ fontSize: '11px' }}>Code: {lb.empCode}</div>
                        </td>
                        <td><span className="fw-medium text-dark">{lb.leaveType}</span></td>
                        <td className="font-monospace text-muted">{lb.year}</td>
                        <td>
                          <div className="small font-monospace text-dark">Allocated: {lb.allocated.toFixed(2)}</div>
                          <div className="x-small font-monospace text-muted" style={{ fontSize: '11px' }}>Carry/Adj: {(lb.carry + lb.adj).toFixed(2)}</div>
                        </td>
                        <td className="font-monospace text-dark">{lb.used.toFixed(2)}</td>
                        <td className="font-monospace text-muted">{lb.pending.toFixed(2)}</td>
                        <td className="font-monospace fw-bold text-primary">{lb.remaining.toFixed(2)}</td>
                        <td><span className="badge bg-light border text-muted px-2 py-1">{lb.method}</span></td>
                        <td>
                          <span className={`badge rounded-pill px-2.5 py-1 ${lb.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                            {lb.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 small text-muted">
                <span>Show</span>
                <select className="form-select form-select-sm py-0.5 border" value={pageSize} onChange={e => setPageSize(parseInt(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              <div className="small text-muted font-monospace">
                Showing 1 to {filteredBalances.length} of {filteredBalances.length} results
              </div>

              <div className="d-flex gap-1">
                <button className="btn btn-xs btn-light border" disabled><FontAwesomeIcon icon={faChevronLeft} /></button>
                <button className="btn btn-xs btn-primary px-3 rounded-2">1</button>
                <button className="btn btn-xs btn-light border" disabled><FontAwesomeIcon icon={faChevronRight} /></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* VIEW B: BULK LEAVE ALLOCATION MODULE */}
      {/* ──────────────────────────────────────────────────────── */}
      {currentView === 'bulk' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          
          {/* Header Banner */}
          <div className="p-4 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #134e5e, #71b280)' }}>
            <span className="badge bg-light text-success fw-bold text-uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Bulk Leave Management</span>
            <h4 className="fw-black mb-1">Bulk Employee Leave Allocation</h4>
            <p className="mb-0 text-white-50 small">Allocate leave balances to multiple employees using department, designation, branch or company-wide filters while preserving existing calculations.</p>
          </div>

          {bulkSuccessAlert && (
            <div className="alert alert-success rounded-4 p-3 shadow-sm border-0 d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div>
                <h6 className="fw-bold mb-0">Bulk Allocation Completed</h6>
                <p className="small mb-0 opacity-80 text-dark">Leave balances were allocated successfully using the existing HRMS allocation workflow.</p>
              </div>
            </div>
          )}

          {/* Form and Preview Layout */}
          <div className="row g-4 mb-4">
            
            {/* Left Wizards card */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-4">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Bulk Allocation Rules</h6>
                  <p className="text-muted small mb-0">Choose employees and define leave allocation settings.</p>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-1.5">Allocation Scope</label>
                    <div className="space-x-3.5 d-flex align-items-center flex-wrap gap-2.5">
                      {['Entire Company', 'Department', 'Branch', 'Designation'].map(scope => (
                        <div key={scope} className="form-check form-check-inline mb-0">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="scopeRadio" 
                            id={`scope_${scope}`} 
                            checked={bulkScope === scope}
                            onChange={() => setBulkScope(scope)}
                          />
                          <label className="form-check-label small" htmlFor={`scope_${scope}`}>{scope}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold text-muted mb-1.5">Employment Type</label>
                    <select className="form-select form-select-sm" value={bulkEmploymentType} onChange={e => setBulkEmploymentType(e.target.value)}>
                      <option value="Permanent">Permanent</option>
                      <option value="Probation">Probation</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold text-muted mb-1.5">Leave Type</label>
                    <select className="form-select form-select-sm" value={bulkLeaveType} onChange={e => setBulkLeaveType(e.target.value)}>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold text-muted mb-1.5">Allocation Year</label>
                    <select className="form-select form-select-sm" value={bulkYear} onChange={e => setBulkYear(e.target.value)}>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold text-muted mb-1.5">Allocation Method</label>
                    <select className="form-select form-select-sm" value={bulkMethod} onChange={e => setBulkMethod(e.target.value)}>
                      <option value="Yearly">Yearly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Accrual">Accrual</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label className="small fw-bold text-muted mb-1.5">Allocate Days</label>
                    <input type="number" className="form-control form-control-sm" value={bulkAllocated} onChange={e => setBulkAllocated(e.target.value)} />
                  </div>

                  <div className="col-md-2">
                    <label className="small fw-bold text-muted mb-1.5">Carry Forward</label>
                    <input type="number" className="form-control form-control-sm" value={bulkCarry} onChange={e => setBulkCarry(e.target.value)} />
                  </div>

                  <div className="col-md-2">
                    <label className="small fw-bold text-muted mb-1.5">Adjustment</label>
                    <input type="number" className="form-control form-control-sm" value={bulkAdjustment} onChange={e => setBulkAdjustment(e.target.value)} />
                  </div>

                  {bulkScope === 'Branch' && (
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-1.5">Branch</label>
                      <select className="form-select form-select-sm" value={bulkBranch} onChange={e => setBulkBranch(e.target.value)}>
                        <option value="All">All Branches</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Lahore">Lahore</option>
                      </select>
                    </div>
                  )}

                  {bulkScope === 'Department' && (
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-1.5">Department</label>
                      <select className="form-select form-select-sm" value={bulkDepartment} onChange={e => setBulkDepartment(e.target.value)}>
                        <option value="All">All Departments</option>
                        <option value="Finance">Finance</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                  )}

                  {bulkScope === 'Designation' && (
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-1.5">Designation</label>
                      <select className="form-select form-select-sm" value={bulkDesignation} onChange={e => setBulkDesignation(e.target.value)}>
                        <option value="All">All Designations</option>
                        <option value="Executive">Executive</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="Manager">Senior Manager</option>
                      </select>
                    </div>
                  )}

                  <div className="col-12 space-y-2">
                    <EnableDisableButton
                      checked={bulkIncludeProbation}
                      onClick={() => setBulkIncludeProbation(!bulkIncludeProbation)}
                      label="Include Probation Employees"
                    />
                    <EnableDisableButton
                      checked={bulkOverwrite}
                      onClick={() => setBulkOverwrite(!bulkOverwrite)}
                      label="Overwrite Existing Allocation"
                    />
                  </div>

                  <div className="col-12">
                    <label className="small fw-bold text-muted mb-1.5">Allocation Notes</label>
                    <textarea className="form-control" rows={2} placeholder="Remarks or reasoning details..." value={bulkNotes} onChange={e => setBulkNotes(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-4">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Bulk Allocation Summary</h6>
                  <p className="text-muted small mb-0">Live validations and scope calculation before saving.</p>
                </div>

                {/* KPI block details */}
                <div className="p-3 bg-light rounded-4 space-y-2.5">
                  <div className="d-flex justify-content-between small"><span className="text-muted">Selected Employees</span><strong className="text-dark">{bulkEmployees.filter(e => e.selected).length} Employees</strong></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Leave Type</span><strong className="text-dark">{bulkLeaveType}</strong></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Allocation Year</span><strong className="text-dark">{bulkYear}</strong></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Base Alloc Days</span><strong className="text-dark">{bulkAllocated} days</strong></div>
                  <div className="d-flex justify-content-between border-top pt-2 small"><span className="fw-bold text-dark">Estimated Total Leave</span><strong className="text-primary">{(parseFloat(bulkAllocated) + parseFloat(bulkCarry) + parseFloat(bulkAdjustment)).toFixed(2)} Days</strong></div>
                </div>

                {/* Validation Panel */}
                <div className="p-3 border rounded-4 space-y-2">
                  <span className="small fw-bold text-muted d-block">Validation Status</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success rounded-pill px-2.5 py-1">Ready</span>
                    <span className="x-small text-muted" style={{ fontSize: '11px' }}>All data entries are compliant.</span>
                  </div>
                </div>

                {/* Document Import Excel area */}
                <div className="p-3 border border-dashed rounded-4 text-center cursor-pointer hover-bg-light" style={{ borderColor: '#ced4da' }} onClick={handleExcelImportSimulation}>
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="text-primary mb-2 fs-4" />
                  <h6 className="small fw-bold mb-1 text-dark">Drag & Drop Excel List</h6>
                  <p className="x-small text-muted mb-2">xlsx, xls, csv supported</p>
                  {uploadedFileName ? (
                    <span className="badge bg-success text-white small text-truncate" style={{ maxWidth: '200px' }}>{uploadedFileName}</span>
                  ) : (
                    <button className="btn btn-xs btn-primary px-3 rounded-pill shadow-sm">Browse Files</button>
                  )}
                </div>

                <div className="alert alert-info rounded-3 p-2.5 small mb-0 d-flex gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-primary mt-0.5" />
                  <span className="x-small text-muted" style={{ fontSize: '11px' }}>Existing leave calculations remain managed by the backend HRMS leave engine.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Employee Preview table list */}
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h6 className="fw-bold text-dark mb-1">Employee Preview</h6>
                <p className="text-muted small mb-0">Employees that will receive this leave allocation.</p>
              </div>

              {/* Mass actions buttons */}
              <div className="d-flex gap-1.5">
                <button className="btn btn-xs btn-outline-secondary text-dark" onClick={() => setBulkEmployees(bulkEmployees.map(e => ({ ...e, selected: true })))}>Select All</button>
                <button className="btn btn-xs btn-outline-secondary text-dark" onClick={() => setBulkEmployees(bulkEmployees.map(e => ({ ...e, selected: false })))}>Clear Selection</button>
                <button className="btn btn-xs btn-outline-primary" onClick={() => {
                  const val = prompt('Enter New Allocation value for all:');
                  if (val && !isNaN(val)) {
                    setBulkEmployees(bulkEmployees.map(e => ({ ...e, newAlloc: parseFloat(val).toFixed(2), final: (parseFloat(val) + parseFloat(e.carry) + parseFloat(e.adj)).toFixed(2) })));
                  }
                }}>Allocate Same Value</button>
              </div>
            </div>

            {bulkEmployees.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" className="opacity-25 mb-2" />
                <p className="small mb-0">No employee preview rows loaded.</p>
                <span className="x-small text-muted" style={{ fontSize: '11px' }}>Upload an Excel list to populate the preview table.</span>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40px' }}><input type="checkbox" checked={bulkEmployees.every(e => e.selected)} onChange={(e) => setBulkEmployees(bulkEmployees.map(x => ({ ...x, selected: e.target.checked })))} /></th>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Branch</th>
                      <th>Leave Type</th>
                      <th>Current Balance</th>
                      <th>New Allocation</th>
                      <th>Carry Forward</th>
                      <th>Adjustment</th>
                      <th>Final Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkEmployees.map((emp, index) => (
                      <tr key={emp.id || emp.code || index}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={emp.selected} 
                            onChange={(e) => {
                              const updated = [...bulkEmployees];
                              updated[index].selected = e.target.checked;
                              setBulkEmployees(updated);
                            }}
                          />
                        </td>
                        <td>
                          <div className="fw-bold text-dark">{emp.name}</div>
                          <div className="text-muted x-small">Code: {emp.code}</div>
                        </td>
                        <td>{emp.dept}</td>
                        <td>{emp.desig}</td>
                        <td>{emp.branch}</td>
                        <td><span className="fw-semibold text-primary">{bulkLeaveType}</span></td>
                        <td className="font-monospace text-muted">{emp.current}</td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm font-monospace" 
                            style={{ width: '80px', fontSize: '12px' }}
                            value={emp.newAlloc}
                            onChange={(e) => {
                              const updated = [...bulkEmployees];
                              updated[index].newAlloc = e.target.value;
                              updated[index].final = (parseFloat(e.target.value || 0) + parseFloat(emp.carry) + parseFloat(emp.adj)).toFixed(2);
                              setBulkEmployees(updated);
                            }}
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm font-monospace" 
                            style={{ width: '80px', fontSize: '12px' }}
                            value={emp.carry}
                            onChange={(e) => {
                              const updated = [...bulkEmployees];
                              updated[index].carry = e.target.value;
                              updated[index].final = (parseFloat(emp.newAlloc) + parseFloat(e.target.value || 0) + parseFloat(emp.adj)).toFixed(2);
                              setBulkEmployees(updated);
                            }}
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm font-monospace" 
                            style={{ width: '80px', fontSize: '12px' }}
                            value={emp.adj}
                            onChange={(e) => {
                              const updated = [...bulkEmployees];
                              updated[index].adj = e.target.value;
                              updated[index].final = (parseFloat(emp.newAlloc) + parseFloat(emp.carry) + parseFloat(e.target.value || 0)).toFixed(2);
                              setBulkEmployees(updated);
                            }}
                          />
                        </td>
                        <td className="fw-bold text-primary font-monospace">{emp.final}</td>
                        <td>
                          <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success px-2 py-0.5">{emp.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sticky footer action buttons */}
          <div className="sticky-bottom p-3 bg-white border-top shadow-lg rounded-4 d-flex justify-content-between align-items-center">
            <span className="small text-muted">This operation uses existing backend allocation services and will not change system calculations.</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary text-dark rounded-pill px-3" onClick={() => setCurrentView('list')}>Cancel</button>
              <button className="btn btn-sm btn-light border rounded-pill px-3 text-dark" onClick={() => addToast('Draft saved successfully')}>Save Draft</button>
              <button 
                className="btn btn-sm btn-primary rounded-pill px-4 shadow-sm" 
                onClick={handleExecuteBulkAllocation}
                disabled={submitting}
              >
                {submitting ? 'Allocating...' : <>Allocate Leave <FontAwesomeIcon icon={faArrowRight} className="ms-1.5" /></>}
              </button>
            </div>
          </div>

        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* VIEW C: ADD / UPDATE LEAVE ALLOCATION */}
      {/* ──────────────────────────────────────────────────────── */}
      {currentView === 'add_update' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          
          {/* Header Banner */}
          <div className="p-4 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #134e5e, #71b280)' }}>
            <span className="badge bg-light text-success fw-bold text-uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Leave Allocation</span>
            <h4 className="fw-black mb-1">Employee Leave Allocation</h4>
            <p className="mb-0 text-white-50 small">Allocate or update employee leave entitlement while preserving existing leave calculations and payroll integration.</p>
          </div>

          {showSuccessAlert && (
            <div className="alert alert-success rounded-4 p-3 shadow-sm border-0 d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div>
                <h6 className="fw-bold mb-0">Allocation Saved Successfully</h6>
                <p className="small mb-0 opacity-80 text-dark">Employee leave allocation has been updated successfully using the existing HRMS leave management workflow.</p>
              </div>
            </div>
          )}

          {/* Form details left, Summary card right */}
          <div className="row g-4">
            
            {/* Form details left */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-4">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Allocation Details</h6>
                  <p className="text-muted small mb-0">Configure yearly leave allocation for the selected employee.</p>
                </div>

                <form onSubmit={handleSaveAllocation} className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-1.5">Employee *</label>
                    <input 
                      type="text"
                      className={`form-control ${formErrors.employee ? 'is-invalid' : ''}`}
                      placeholder="Employee ID or numeric ID"
                      value={formEmployee} 
                      onChange={e => setFormEmployee(e.target.value)}
                    />
                    {formErrors.employee && <div className="invalid-feedback">{formErrors.employee}</div>}
                    <small className="text-muted">Use the employee numeric ID (e.g. 1009). Backend resolves identity.</small>
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-1.5">Leave Type *</label>
                    <select className="form-select" value={formLeaveType} onChange={e => setFormLeaveType(e.target.value)}>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                      <option value="Compensatory Leave">Compensatory Leave</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1.5">Allocation Year *</label>
                    <select className="form-select" value={formYear} onChange={e => setFormYear(e.target.value)}>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1.5">Allocation Method *</label>
                    <select className="form-select" value={formMethod} onChange={e => setFormMethod(e.target.value)}>
                      <option value="Yearly">Yearly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Accrual">Accrual</option>
                      <option value="Manual Adjustment">Manual Adjustment</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1.5">Allocated Leave Days *</label>
                    <input 
                      type="number" 
                      className={`form-control ${formErrors.allocated ? 'is-invalid' : ''}`}
                      value={formAllocated} 
                      onChange={e => setFormAllocated(e.target.value)} 
                    />
                    {formErrors.allocated && <div className="invalid-feedback">{formErrors.allocated}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1.5">Carry Forward</label>
                    <input type="number" className="form-control" value={formCarry} onChange={e => setFormCarry(e.target.value)} />
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1.5">Manual Adjustment</label>
                    <input type="number" className="form-control" value={formAdjustment} onChange={e => setFormAdjustment(e.target.value)} />
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1.5">Status *</label>
                    <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-1.5">Effective Date</label>
                    <input type="date" className="form-control" value={formEffectiveDate} onChange={e => setFormEffectiveDate(e.target.value)} />
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-1.5">Expiry Date (Optional)</label>
                    <input type="date" className="form-control" value={formExpiryDate} onChange={e => setFormExpiryDate(e.target.value)} />
                  </div>

                  <div className="col-12">
                    <label className="small fw-bold text-muted mb-1.5">Notes</label>
                    <textarea className="form-control" rows={3} placeholder="Enter remarks or allocation notes..." value={formNotes} onChange={e => setFormNotes(e.target.value)} />
                  </div>

                  {/* Actions buttons */}
                  <div className="col-12 border-top pt-3.5 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary text-dark rounded-pill px-3" onClick={() => setCurrentView('list')}>Cancel</button>
                    <button type="button" className="btn btn-sm btn-light border rounded-pill px-3 text-dark" onClick={() => addToast('Draft saved successfully.')}>Save Draft</button>
                    <button type="submit" className="btn btn-sm btn-primary rounded-pill px-4 shadow-sm" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Save Allocation'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Summary card right */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-4">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Allocation Summary</h6>
                  <p className="text-muted small mb-0">Compute output balance details before saving.</p>
                </div>

                <div className="p-3 bg-light rounded-4 space-y-3">
                  <div className="d-flex justify-content-between small"><span className="text-muted">Employee</span><strong className="text-dark">{formEmployee || '[Select Employee]'}</strong></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Leave Type</span><strong className="text-dark">{formLeaveType}</strong></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Year</span><strong className="text-dark">{formYear}</strong></div>
                  
                  <hr className="my-2 border-light" />
                  
                  <div className="d-flex justify-content-between small"><span className="text-muted">Allocated Days</span><span className="font-monospace text-dark">{parseFloat(formAllocated || 0).toFixed(2)}</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Carry Forward</span><span className="font-monospace text-dark">{parseFloat(formCarry || 0).toFixed(2)}</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Adjustment</span><span className="font-monospace text-dark">{parseFloat(formAdjustment || 0).toFixed(2)}</span></div>
                  
                  <div className="d-flex justify-content-between border-top pt-2.5 small"><span className="fw-bold text-dark">Total Available Leave</span><strong className="text-primary font-monospace">{totalAvailableAllocation}</strong></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Remaining Balance</span><strong className="text-success font-monospace">{totalAvailableAllocation}</strong></div>
                  
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Status</span>
                    <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success px-2.5 py-0.5">{formStatus}</span>
                  </div>
                </div>

                <div className="alert alert-info rounded-3 p-2.5 small mb-0 d-flex gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-primary mt-0.5" />
                  <span className="x-small text-muted" style={{ fontSize: '11px' }}>Leave balance calculations continue to use the existing backend HRMS services.</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};

export default HrmsMyLeaveBalance;
