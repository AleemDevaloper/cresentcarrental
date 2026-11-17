import { apiRequest, getAuthToken, getApiBaseUrl } from "./client";

export async function getEmployeeProfile(userId) {
  const res = await apiRequest(`/api/v1/employees/${userId}/profile`);
  return res.data;
}

export async function updateEmployeeProfile(userId, data) {
  const res = await apiRequest(`/api/v1/employees/${userId}/profile`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function listDepartments() {
  const res = await apiRequest("/api/v1/departments");
  return res.data || [];
}

export async function createDepartment(data) {
  const res = await apiRequest("/api/v1/departments", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateDepartment(id, data) {
  const res = await apiRequest(`/api/v1/departments/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data;
}

export async function deleteDepartment(id) {
  await apiRequest(`/api/v1/departments/${id}`, { method: "DELETE" });
}

export async function listDesignations() {
  const res = await apiRequest("/api/v1/departments");
  const departments = res.data || [];
  const designations = [];
  for (const dept of departments) {
    if (dept.designations && Array.isArray(dept.designations)) {
      for (const d of dept.designations) {
        designations.push({
          ...d,
          department_name: dept.name,
          department_id: dept.id,
        });
      }
    }
  }
  return designations;
}

export async function createDesignation(departmentId, data) {
  const res = await apiRequest(
    `/api/v1/departments/${departmentId}/designations`,
    { method: "POST", body: data }
  );
  return res.data;
}

export async function updateDesignation(id, data) {
  const res = await apiRequest(`/api/v1/designations/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data;
}

export async function deleteDesignation(id) {
  await apiRequest(`/api/v1/designations/${id}`, { method: "DELETE" });
}

export async function listAttendance() {
  const res = await apiRequest("/api/v1/attendance");
  return res.data || [];
}

export async function clockIn(data) {
  const res = await apiRequest("/api/v1/attendance/clock-in", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function clockOut(data) {
  const res = await apiRequest("/api/v1/attendance/clock-out", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listSites() {
  const res = await apiRequest("/api/v1/sites");
  return res.data || [];
}

export async function listShifts() {
  const res = await apiRequest("/api/v1/shifts");
  return res.data || [];
}

export async function listLeaves(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => { if (val) query.append(key, val); });
  const qs = query.toString();
  const path = "/api/v1/leaves" + (qs ? `?${qs}` : "");
  const res = await apiRequest(path);
  return res.data?.data || res.data || [];
}

export async function createLeave(data) {
  const res = await apiRequest("/api/v1/leaves", {
    method: "POST",
    body: data,
  });
  return res.data;
}

// Recruitment
export async function getRecruitmentStats() {
  const res = await apiRequest("/api/v1/recruitment/stats");
  return res.data;
}

export async function listJobs() {
  const res = await apiRequest("/api/v1/recruitment/jobs");
  return res.data || [];
}

export async function createJob(data) {
  const res = await apiRequest("/api/v1/recruitment/jobs", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listApplications(jobId = null) {
  const url = jobId ? `/api/v1/recruitment/applications?job_id=${jobId}` : "/api/v1/recruitment/applications";
  const res = await apiRequest(url);
  return res.data || [];
}

export async function updateApplicationStatus(id, status) {
  const res = await apiRequest(`/api/v1/recruitment/applications/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return res.data;
}

// Exit Management
export async function getExitStats() {
  const res = await apiRequest("/api/v1/exit/stats");
  return res.data;
}

export async function listResignations() {
  const res = await apiRequest("/api/v1/exit/resignations");
  return res.data || [];
}

export async function createResignation(data) {
  const res = await apiRequest("/api/v1/exit/resignations", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateResignationStatus(id, data) {
  const res = await apiRequest(`/api/v1/exit/resignations/${id}/status`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function updateClearanceStage(stageId, data) {
  const res = await apiRequest(`/api/v1/exit/clearance-stages/${stageId}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

// Onboarding
export async function listOnboardingChecklists() {
  const res = await apiRequest("/api/v1/onboarding/checklists");
  return res.data || [];
}

export async function createOnboardingChecklist(data) {
  const res = await apiRequest("/api/v1/onboarding/checklists", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listOnboardingProcesses() {
  const res = await apiRequest("/api/v1/onboarding/processes");
  return res.data || [];
}

export async function createOnboardingProcess(data) {
  const res = await apiRequest("/api/v1/onboarding/processes", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateOnboardingProgress(id, data) {
  const res = await apiRequest(`/api/v1/onboarding/processes/${id}/progress`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

// Payroll
export async function listPayrollComponents() {
  const res = await apiRequest("/api/v1/payroll/components");
  return res.data || [];
}

export async function createPayrollComponent(data) {
  const res = await apiRequest("/api/v1/payroll/components", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listPayrollStructures() {
  const res = await apiRequest("/api/v1/payroll/structures");
  return res.data || [];
}

export async function createPayrollStructure(data) {
  const res = await apiRequest("/api/v1/payroll/structures", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listTaxSlabs() {
  const res = await apiRequest("/api/v1/payroll/tax-slabs");
  return res.data || [];
}

export async function createTaxSlab(data) {
  const res = await apiRequest("/api/v1/payroll/tax-slabs", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listPayrollBatches() {
  const res = await apiRequest("/api/v1/payroll/batches");
  return res.data || [];
}

export async function createPayrollBatch(data) {
  const res = await apiRequest("/api/v1/payroll/batches", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function runPayrollBatch(id) {
  const res = await apiRequest(`/api/v1/payroll/batches/${id}/run`, {
    method: "POST"
  });
  return res.data;
}

export async function finalizePayrollBatch(id) {
  const res = await apiRequest(`/api/v1/payroll/batches/${id}/finalize`, {
    method: "POST"
  });
  return res.data;
}

export async function payPayrollBatch(id) {
  const res = await apiRequest(`/api/v1/payroll/batches/${id}/pay`, {
    method: "POST"
  });
  return res.data;
}

export async function getEmployeeSalary(userId) {
  const res = await apiRequest(`/api/v1/payroll/employee/${userId}`);
  return res.data;
}

export async function assignEmployeeSalary(data) {
  const res = await apiRequest("/api/v1/payroll/assign", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listPayslips(params = {}) {
  let url = "/api/v1/payroll/payslips";
  if (params.user_id) url += `?user_id=${params.user_id}`;
  const res = await apiRequest(url);
  return res.data || [];
}

// Performance
export async function getPerformanceStats() {
  const res = await apiRequest("/api/v1/performance/stats");
  return res.data;
}

export async function listPerformanceKpis() {
  const res = await apiRequest("/api/v1/performance/kpis");
  return res.data || [];
}

export async function createPerformanceKpi(data) {
  const res = await apiRequest("/api/v1/performance/kpis", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function listPerformanceGoals() {
  const res = await apiRequest("/api/v1/performance/goals");
  return res.data || [];
}

export async function createPerformanceGoal(data) {
  const res = await apiRequest("/api/v1/performance/goals", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updatePerformanceGoalProgress(id, data) {
  const res = await apiRequest(`/api/v1/performance/goals/${id}/progress`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function listPerformanceReviews() {
  const res = await apiRequest("/api/v1/performance/reviews");
  return res.data || [];
}

export async function createPerformanceReview(data) {
  const res = await apiRequest("/api/v1/performance/reviews", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updatePerformanceReviewStatus(id, data) {
  const res = await apiRequest(`/api/v1/performance/reviews/${id}/status`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

// Expenses
export async function listExpenses(params = {}) {
  let url = "/api/v1/expenses";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createExpense(data) {
  const res = await apiRequest("/api/v1/expenses", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateExpenseStatus(id, status) {
  const res = await apiRequest(`/api/v1/expenses/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return res.data;
}

export async function deleteExpense(id) {
  const res = await apiRequest(`/api/v1/expenses/${id}`, {
    method: "DELETE",
  });
  return res;
}

// Overtime
export async function listOvertimes(params = {}) {
  let url = "/api/v1/overtime";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createOvertime(data) {
  const res = await apiRequest("/api/v1/overtime", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function runOvertimeAutoDetect(data) {
  const res = await apiRequest("/api/v1/overtime/auto-detect", {
    method: "POST",
    body: data,
  });
  return res;
}

export async function updateOvertimeStatus(id, status) {
  const res = await apiRequest(`/api/v1/overtime/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return res.data;
}

export async function deleteOvertime(id) {
  const res = await apiRequest(`/api/v1/overtime/${id}`, {
    method: "DELETE",
  });
  return res;
}

// Biometric Devices
export async function listBiometricDevices() {
  const res = await apiRequest("/api/v1/biometric/devices");
  return res.data || [];
}

export async function createBiometricDevice(data) {
  const res = await apiRequest("/api/v1/biometric/devices", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateBiometricDevice(id, data) {
  const res = await apiRequest(`/api/v1/biometric/devices/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function syncBiometricDevice(id) {
  return apiRequest(`/api/v1/biometric/devices/${id}/sync`, {
    method: "POST",
  });
}

export async function listBiometricPunchLogs(params = {}) {
  let url = "/api/v1/biometric/punch-logs";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function importBiometricPunches(data) {
  return apiRequest("/api/v1/biometric/punch-logs/import", {
    method: "POST",
    body: data,
  });
}

export async function listBiometricMappings(params = {}) {
  let url = "/api/v1/biometric/mappings";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function updateEmployeeMapping(userId, data) {
  const res = await apiRequest(`/api/v1/biometric/mappings/${userId}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function getRawPunchStats() {
  const res = await apiRequest("/api/v1/biometric/punch-logs/stats");
  return res.data;
}

// === COMMAND CENTER / DASHBOARD ===
export async function getCommandCenterStats() {
  const res = await apiRequest("/api/v1/hrms/command-center/stats");
  return res.data;
}

export async function getHeadcountTrends() {
  const res = await apiRequest("/api/v1/hrms/command-center/trends/headcount");
  return res.data;
}

export async function getAttendanceTrends() {
  const res = await apiRequest("/api/v1/hrms/command-center/trends/attendance");
  return res.data;
}

export async function getLeaveTrends() {
  const res = await apiRequest("/api/v1/hrms/command-center/trends/leaves");
  return res.data;
}

export async function getDepartmentOverview() {
  const res = await apiRequest("/api/v1/hrms/command-center/departments");
  return res.data;
}

// === MANAGER PORTAL ===
export async function getManagerTeamStats(managerId) {
  const res = await apiRequest(`/api/v1/hrms/manager/${managerId}/team-stats`);
  return res.data;
}

export async function getManagerAttendance() {
  const res = await apiRequest("/api/v1/hrms/manager/attendance");
  return res.data;
}

export async function getManagerLeaveCalendar() {
  const res = await apiRequest("/api/v1/hrms/manager/leave-calendar");
  return res.data;
}

export async function getManagerPendingApprovals() {
  const res = await apiRequest("/api/v1/hrms/manager/pending-approvals");
  return res.data;
}

// === EMPLOYEE PORTAL ===
export async function getEmployeeDashboard(userId) {
  const res = await apiRequest(`/api/v1/hrms/employee/${userId}/dashboard`);
  return res.data;
}

export async function getEmployeeAttendanceHistory(params = {}) {
  let url = "/api/v1/hrms/employee/attendance-history";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getEmployeePayslips(userId) {
  const res = await apiRequest(`/api/v1/hrms/employee/${userId}/payslips`);
  return res.data || [];
}

export async function getEmployeeTaxDocuments(userId) {
  const res = await apiRequest(`/api/v1/hrms/employee/${userId}/tax-documents`);
  return res.data || [];
}

export async function getEmployeeTrainingRecords(userId) {
  const res = await apiRequest(`/api/v1/hrms/employee/${userId}/training`);
  return res.data || [];
}

// === ATTENDANCE CORRECTION ===
export async function listAttendanceCorrections(params = {}) {
  let url = "/api/v1/hrms/attendance-corrections";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createAttendanceCorrection(data) {
  const res = await apiRequest("/api/v1/hrms/attendance-corrections", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateAttendanceCorrectionStatus(id, status) {
  const res = await apiRequest(`/api/v1/hrms/attendance-corrections/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return res.data;
}

export async function deleteAttendanceCorrection(id) {
  const res = await apiRequest(`/api/v1/hrms/attendance-corrections/${id}`, {
    method: "DELETE",
  });
  return res;
}

// === ASSET CLEARANCE ===
export async function listAssetClearances(params = {}) {
  let url = "/api/v1/hrms/asset-clearances";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createAssetClearance(data) {
  const res = await apiRequest("/api/v1/hrms/asset-clearances", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateAssetClearance(id, data) {
  const res = await apiRequest(`/api/v1/hrms/asset-clearances/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function finalizeAssetClearance(id) {
  const res = await apiRequest(`/api/v1/hrms/asset-clearances/${id}/finalize`, {
    method: "POST",
  });
  return res.data;
}

// === REHIRE ===
export async function lookupPreviousEmployee(query) {
  const res = await apiRequest(`/api/v1/hrms/rehire/lookup?q=${encodeURIComponent(query)}`);
  return res.data;
}

export async function listRehireRecords() {
  const res = await apiRequest("/api/v1/hrms/rehire");
  return res.data || [];
}

export async function createRehireRecord(data) {
  const res = await apiRequest("/api/v1/hrms/rehire", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getRehireRecord(id) {
  const res = await apiRequest(`/api/v1/hrms/rehire/${id}`);
  return res.data;
}

// === EMPLOYEE CODE ===
export async function getEmployeeCodeConfig() {
  const res = await apiRequest("/api/v1/hrms/employee-code/config");
  return res.data;
}

export async function updateEmployeeCodeConfig(data) {
  const res = await apiRequest("/api/v1/hrms/employee-code/config", {
    method: "PUT",
    body: data,
  });
  return res.data;
}

export async function generateEmployeeCode() {
  const res = await apiRequest("/api/v1/hrms/employee-code/generate", {
    method: "POST",
  });
  return res.data;
}

export async function validateEmployeeCode(code) {
  const res = await apiRequest("/api/v1/hrms/employee-code/validate", {
    method: "POST",
    body: { code },
  });
  return res.data;
}

export async function lockEmployeeCode(userId) {
  const res = await apiRequest(`/api/v1/hrms/employee-code/${userId}/lock`, {
    method: "POST",
  });
  return res.data;
}

export async function getEmployeeCodeHistory() {
  const res = await apiRequest("/api/v1/hrms/employee-code/history");
  return res.data || [];
}

// === PORTAL MANAGEMENT ===
export async function listPortals() {
  const res = await apiRequest("/api/v1/hrms/portals");
  return res.data || [];
}

export async function createPortal(data) {
  const res = await apiRequest("/api/v1/hrms/portals", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getPortal(id) {
  const res = await apiRequest(`/api/v1/hrms/portals/${id}`);
  return res.data;
}

export async function updatePortal(id, data) {
  const res = await apiRequest(`/api/v1/hrms/portals/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data;
}

export async function deletePortal(id) {
  const res = await apiRequest(`/api/v1/hrms/portals/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function uploadPortalBranding(id, data) {
  const res = await apiRequest(`/api/v1/hrms/portals/${id}/branding`, {
    method: "POST",
    body: data,
  });
  return res.data;
}

// === EMPLOYEE DATABASE ===
export async function listEmployees(params = {}) {
  let url = "/api/v1/hrms/employees";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getEmployee(userId) {
  const res = await apiRequest(`/api/v1/hrms/employees/${userId}`);
  return res.data;
}

export async function archiveEmployee(userId) {
  const res = await apiRequest(`/api/v1/hrms/employees/${userId}/archive`, {
    method: "POST",
  });
  return res.data;
}

export async function reactivateEmployee(userId) {
  const res = await apiRequest(`/api/v1/hrms/employees/${userId}/reactivate`, {
    method: "POST",
  });
  return res.data;
}

export async function bulkImportEmployees(data) {
  const res = await apiRequest("/api/v1/hrms/employees/bulk-import", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function exportEmployees(params = {}) {
  let url = "/api/v1/hrms/employees/export";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data;
}

// === DOCUMENTS MANAGEMENT ===
export async function listDocuments(params = {}) {
  let url = "/api/v1/hrms/documents";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function uploadDocument(data) {
  const res = await apiRequest("/api/v1/hrms/documents", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getDocument(id) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}`);
  return res.data;
}

export async function updateDocument(id, data) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteDocument(id) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function verifyDocument(id) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}/verify`, {
    method: "POST",
  });
  return res.data;
}

export async function lockDocument(id) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}/lock`, {
    method: "POST",
  });
  return res.data;
}

export async function shareDocument(id, data) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}/share`, {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function downloadDocument(id) {
  return apiRequest(`/api/v1/hrms/documents/${id}/download`);
}

export async function bulkUploadDocuments(data) {
  const res = await apiRequest("/api/v1/hrms/documents/bulk-upload", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getDocumentHistory(id) {
  const res = await apiRequest(`/api/v1/hrms/documents/${id}/history`);
  return res.data || [];
}

// === BANK DETAILS ===
export async function listBankDetails(params = {}) {
  let url = "/api/v1/hrms/bank-details";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createBankDetail(data) {
  const res = await apiRequest("/api/v1/hrms/bank-details", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateBankDetail(id, data) {
  const res = await apiRequest(`/api/v1/hrms/bank-details/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteBankDetail(id) {
  const res = await apiRequest(`/api/v1/hrms/bank-details/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function setPrimaryBankDetail(id) {
  const res = await apiRequest(`/api/v1/hrms/bank-details/${id}/set-primary`, {
    method: "POST",
  });
  return res.data;
}

export async function verifyBankDetail(id) {
  const res = await apiRequest(`/api/v1/hrms/bank-details/${id}/verify`, {
    method: "POST",
  });
  return res.data;
}

export async function getBankDetailHistory() {
  const res = await apiRequest("/api/v1/hrms/bank-details/history");
  return res.data || [];
}

// === BANK EXPORTS ===
export async function listBankExports(params = {}) {
  let url = "/api/v1/bank-exports";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createBankExport(data) {
  const res = await apiRequest("/api/v1/bank-exports", { method: "POST", body: data });
  return res.data;
}

export async function getBankExport(id) {
  const res = await apiRequest(`/api/v1/bank-exports/${id}`);
  return res.data;
}

export async function downloadBankExport(id) {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/v1/bank-exports/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bank-export-${id}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function retryBankExport(id, data) {
  const res = await apiRequest(`/api/v1/bank-exports/${id}/retry`, { method: "POST", body: data });
  return res.data;
}

export async function getBankExportBanks() {
  const res = await apiRequest("/api/v1/bank-exports/banks");
  return res.data || [];
}

export async function getBankExportStats() {
  const res = await apiRequest("/api/v1/bank-exports/stats");
  return res.data;
}

// === EMERGENCY CONTACTS ===
export async function listEmergencyContacts(params = {}) {
  let url = "/api/v1/hrms/emergency-contacts";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createEmergencyContact(data) {
  const res = await apiRequest("/api/v1/hrms/emergency-contacts", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateEmergencyContact(id, data) {
  const res = await apiRequest(`/api/v1/hrms/emergency-contacts/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteEmergencyContact(id) {
  const res = await apiRequest(`/api/v1/hrms/emergency-contacts/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function setEmergencyContactPriority(id, priority) {
  const res = await apiRequest(`/api/v1/hrms/emergency-contacts/${id}/priority`, {
    method: "POST",
    body: { priority },
  });
  return res.data;
}

// === REPORTING HIERARCHY ===
export async function getReportingHierarchy() {
  const res = await apiRequest("/api/v1/hrms/reporting-hierarchy");
  return res.data || [];
}

export async function createReportingHierarchy(data) {
  const res = await apiRequest("/api/v1/hrms/reporting-hierarchy", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getEmployeeHierarchy(employeeId) {
  const res = await apiRequest(`/api/v1/hrms/reporting-hierarchy/${employeeId}`);
  return res.data;
}

export async function getOrgChart() {
  const res = await apiRequest("/api/v1/hrms/reporting-hierarchy/org-chart");
  return res.data;
}

export async function getDepartmentHierarchy(departmentId) {
  const res = await apiRequest(`/api/v1/hrms/reporting-hierarchy/department/${departmentId}`);
  return res.data;
}

export async function getSuccessors(employeeId) {
  const res = await apiRequest(`/api/v1/hrms/reporting-hierarchy/successors/${employeeId}`);
  return res.data;
}

// === CSV IMPORT ===
export async function listImports() {
  const res = await apiRequest("/api/v1/hrms/csv-imports");
  return res.data || [];
}

export async function previewImport(data) {
  const res = await apiRequest("/api/v1/hrms/csv-imports/preview", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function processImport(data) {
  const res = await apiRequest("/api/v1/hrms/csv-imports/import", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getImportMapping() {
  const res = await apiRequest("/api/v1/hrms/csv-imports/mapping");
  return res.data;
}

export async function validateImport(data) {
  const res = await apiRequest("/api/v1/hrms/csv-imports/validate", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function rollbackImport() {
  const res = await apiRequest("/api/v1/hrms/csv-imports/rollback", {
    method: "POST",
  });
  return res.data;
}

export async function downloadImportTemplate(type) {
  return apiRequest(`/api/v1/hrms/csv-imports/template/${type}`);
}

export async function getImportLogs() {
  const res = await apiRequest("/api/v1/hrms/csv-imports/logs");
  return res.data || [];
}

// === SHIFT ENHANCED ===
export async function assignShift(data) {
  const res = await apiRequest("/api/v1/hrms/shifts/assign", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function bulkAssignShift(data) {
  const res = await apiRequest("/api/v1/hrms/shifts/bulk-assign", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getShiftCalendar(params) {
  let url = "/api/v1/hrms/shifts/calendar";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getShiftCoverage() {
  const res = await apiRequest("/api/v1/hrms/shifts/coverage");
  return res.data;
}

export async function listShiftRotations() {
  const res = await apiRequest("/api/v1/hrms/shifts/rotations");
  return res.data || [];
}

export async function createShiftRotation(data) {
  const res = await apiRequest("/api/v1/hrms/shifts/rotations", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getGraceTimes() {
  const res = await apiRequest("/api/v1/hrms/shifts/grace-times");
  return res.data || [];
}

export async function updateGraceTime(data) {
  const res = await apiRequest("/api/v1/hrms/shifts/grace-times", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getBreakTimes() {
  const res = await apiRequest("/api/v1/hrms/shifts/break-times");
  return res.data || [];
}

export async function createBreakTime(data) {
  const res = await apiRequest("/api/v1/hrms/shifts/break-times", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getWeeklyOffs() {
  const res = await apiRequest("/api/v1/hrms/shifts/weekly-offs");
  return res.data || [];
}

export async function createWeeklyOff(data) {
  const res = await apiRequest("/api/v1/hrms/shifts/weekly-offs", {
    method: "POST",
    body: data,
  });
  return res.data;
}

// === SITE ENHANCED ===
export async function assignSite(data) {
  const res = await apiRequest("/api/v1/hrms/sites/assign", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getSiteAssignments(params) {
  let url = "/api/v1/hrms/sites/assignments";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getSiteGeoFences(siteId) {
  const res = await apiRequest(`/api/v1/hrms/sites/${siteId}/geo-fences`);
  return res.data || [];
}

export async function createGeoFence(data) {
  const res = await apiRequest("/api/v1/hrms/sites/geo-fences", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateGeoFence(id, data) {
  const res = await apiRequest(`/api/v1/hrms/sites/geo-fences/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteGeoFence(id) {
  const res = await apiRequest(`/api/v1/hrms/sites/geo-fences/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function regenerateSiteQR(siteId) {
  const res = await apiRequest(`/api/v1/hrms/sites/${siteId}/qr-code`, {
    method: "POST",
  });
  return res.data;
}

export async function validateQRCode(data) {
  const res = await apiRequest("/api/v1/hrms/sites/validate-qr", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getNearbySites(params) {
  let url = "/api/v1/hrms/sites/nearby";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getSiteStats() {
  const res = await apiRequest("/api/v1/hrms/sites/stats");
  return res.data;
}

// === ATTENDANCE ENHANCED ===
export async function qrClockIn(data) {
  const res = await apiRequest("/api/v1/hrms/attendance/qr-clock-in", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function supervisorClockIn(data) {
  const res = await apiRequest("/api/v1/hrms/attendance/supervisor-clock-in", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function gpsValidate(data) {
  const res = await apiRequest("/api/v1/hrms/attendance/gps-validate", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getPhotoHistory(params) {
  let url = "/api/v1/hrms/attendance/photo-history";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getRedZoneData() {
  const res = await apiRequest("/api/v1/hrms/attendance/red-zone");
  return res.data;
}

export async function getDailyAttendanceReport(params) {
  let url = "/api/v1/hrms/attendance/daily-report";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getMonthlyAttendanceReport(params) {
  let url = "/api/v1/hrms/attendance/monthly-report";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function bulkAttendance(data) {
  const res = await apiRequest("/api/v1/hrms/attendance/bulk", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getAttendanceCheckStatus() {
  const res = await apiRequest("/api/v1/hrms/attendance/check-status");
  return res.data;
}

// === LEAVE ENHANCED ===
export async function getLeaveQuotas(params) {
  let url = "/api/v1/hrms/leaves/quotas";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function createLeaveQuota(data) {
  const res = await apiRequest("/api/v1/hrms/leaves/quotas", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function bulkAllocateLeaveQuotas(data) {
  const res = await apiRequest("/api/v1/hrms/leaves/quotas/bulk-allocate", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getLeaveAccrualRules() {
  const res = await apiRequest("/api/v1/hrms/leaves/accrual-rules");
  return res.data || [];
}

export async function createLeaveAccrualRule(data) {
  const res = await apiRequest("/api/v1/hrms/leaves/accrual-rules", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function runLeaveAccrual() {
  const res = await apiRequest("/api/v1/hrms/leaves/run-accrual", {
    method: "POST",
  });
  return res.data;
}

export async function getLeaveBalances(params) {
  let url = "/api/v1/hrms/leaves/balances";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getLeaveCalendarData(params) {
  let url = "/api/v1/hrms/leaves/calendar";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data || [];
}

export async function getLeaveAnalytics() {
  const res = await apiRequest("/api/v1/hrms/leaves/analytics");
  return res.data;
}

export async function getLeaveTypes() {
  const res = await apiRequest("/api/v1/hrms/leaves/types");
  return res.data || [];
}

// === ATTENDANCE RULES ===
export async function getOvertimeRules() {
  const res = await apiRequest("/api/v1/hrms/attendance-rules/overtime");
  return res.data || [];
}

export async function createOvertimeRule(data) {
  const res = await apiRequest("/api/v1/hrms/attendance-rules/overtime", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateOvertimeRule(id, data) {
  const res = await apiRequest(`/api/v1/hrms/attendance-rules/overtime/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteOvertimeRule(id) {
  const res = await apiRequest(`/api/v1/hrms/attendance-rules/overtime/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function getAttendanceGraceTimes() {
  const res = await apiRequest("/api/v1/hrms/attendance-rules/grace-times");
  return res.data || [];
}

export async function createAttendanceGraceTime(data) {
  const res = await apiRequest("/api/v1/hrms/attendance-rules/grace-times", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getHalfDayRules() {
  const res = await apiRequest("/api/v1/hrms/attendance-rules/half-day");
  return res.data || [];
}

export async function createHalfDayRule(data) {
  const res = await apiRequest("/api/v1/hrms/attendance-rules/half-day", {
    method: "POST",
    body: data,
  });
  return res.data;
}

// === OUTDOOR DUTY ===
export async function listOutdoorDuties(params = {}) {
  let url = "/api/v1/hrms/outdoor-duty";
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const res = await apiRequest(url);
  return res.data?.data || res.data || [];
}

export async function createOutdoorDuty(data) {
  const res = await apiRequest("/api/v1/hrms/outdoor-duty", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function updateOutdoorDuty(id, data) {
  const res = await apiRequest(`/api/v1/hrms/outdoor-duty/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data;
}

export async function deleteOutdoorDuty(id) {
  const res = await apiRequest(`/api/v1/hrms/outdoor-duty/${id}`, {
    method: "DELETE",
  });
  return res;
}

/* START OF NEW ADDITION: HRMS Dashboard & Health Dashboard API Endpoints */
export async function getHrDashboard(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/dashboard?${query}`);
  return res.data;
}

export async function getHrWorkforceSummary(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/workforce-summary?${query}`);
  return res.data;
}

export async function getHrAttendanceSummary(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/attendance-summary?${query}`);
  return res.data;
}

export async function getHrLiveAttendance(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/live-attendance?${query}`);
  return res.data;
}

export async function getHrDashboardAnalytics(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/dashboard/analytics?${query}`);
  return res.data;
}

export async function getHrDashboardDepartments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/dashboard/departments?${query}`);
  return res.data;
}

export async function getHrDashboardCalendar(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/dashboard/calendar?${query}`);
  return res.data;
}

export async function getHrDashboardCompliance(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/dashboard/compliance?${query}`);
  return res.data;
}

export async function getHrDashboardCelebrations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/dashboard/celebrations?${query}`);
  return res.data;
}

export async function saveHrDashboardLayout(layoutData, viewType = 'hr_dashboard') {
  const res = await apiRequest("/api/v1/hr/dashboard/layout", {
    method: "POST",
    body: { layout_data: layoutData, view_type: viewType },
  });
  return res.data;
}

export async function saveHrDashboardPreferences(data) {
  const res = await apiRequest("/api/v1/hr/dashboard/preferences", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function getHrHealthDashboard(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/hr/health/dashboard?${query}`);
  return res.data;
}

export async function getHrHealthScore() {
  const res = await apiRequest("/api/v1/hr/health/score");
  return res.data;
}

export async function getHrHealthAttendance() {
  const res = await apiRequest("/api/v1/hr/health/attendance");
  return res.data;
}

export async function getHrHealthPayroll() {
  const res = await apiRequest("/api/v1/hr/health/payroll");
  return res.data;
}

export async function getHrHealthProfile() {
  const res = await apiRequest("/api/v1/hr/health/profile");
  return res.data;
}

export async function getHrHealthCompliance() {
  const res = await apiRequest("/api/v1/hr/health/compliance");
  return res.data;
}

export async function getHrHealthRecruitment() {
  const res = await apiRequest("/api/v1/hr/health/recruitment");
  return res.data;
}

export async function getHrHealthOnboarding() {
  const res = await apiRequest("/api/v1/hr/health/onboarding");
  return res.data;
}

export async function getHrHealthOffboarding() {
  const res = await apiRequest("/api/v1/hr/health/offboarding");
  return res.data;
}

export async function getHrHealthRisks() {
  const res = await apiRequest("/api/v1/hr/health/risks");
  return res.data;
}

export async function getHrHealthRecommendations() {
  const res = await apiRequest("/api/v1/hr/health/recommendations");
  return res.data;
}
/* END OF NEW ADDITION: HRMS Dashboard & Health Dashboard API Endpoints */
