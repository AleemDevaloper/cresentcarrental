import { apiRequest } from "./client";

// === INSTITUTIONS ===
export async function listInstitutions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/institutions${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getInstitution(id) {
  const res = await apiRequest(`/api/v1/ems/institutions/${id}`);
  return res.data;
}

export async function createInstitution(data) {
  const res = await apiRequest("/api/v1/ems/institutions", { method: "POST", body: data });
  return res.data;
}

export async function updateInstitution(id, data) {
  const res = await apiRequest(`/api/v1/ems/institutions/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteInstitution(id) {
  const res = await apiRequest(`/api/v1/ems/institutions/${id}`, { method: "DELETE" });
  return res;
}

// === CAMPUSES ===
export async function listCampuses(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/campuses${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getCampus(id) {
  const res = await apiRequest(`/api/v1/ems/campuses/${id}`);
  return res.data;
}

export async function createCampus(data) {
  const res = await apiRequest("/api/v1/ems/campuses", { method: "POST", body: data });
  return res.data;
}

export async function updateCampus(id, data) {
  const res = await apiRequest(`/api/v1/ems/campuses/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteCampus(id) {
  const res = await apiRequest(`/api/v1/ems/campuses/${id}`, { method: "DELETE" });
  return res;
}

// === DEPARTMENTS ===
export async function listDepartments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/departments${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getDepartment(id) {
  const res = await apiRequest(`/api/v1/ems/departments/${id}`);
  return res.data;
}

export async function createDepartment(data) {
  const res = await apiRequest("/api/v1/ems/departments", { method: "POST", body: data });
  return res.data;
}

export async function updateDepartment(id, data) {
  const res = await apiRequest(`/api/v1/ems/departments/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteDepartment(id) {
  const res = await apiRequest(`/api/v1/ems/departments/${id}`, { method: "DELETE" });
  return res;
}

// === PROGRAMS ===
export async function listPrograms(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/programs${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getProgram(id) {
  const res = await apiRequest(`/api/v1/ems/programs/${id}`);
  return res.data;
}

export async function createProgram(data) {
  const res = await apiRequest("/api/v1/ems/programs", { method: "POST", body: data });
  return res.data;
}

export async function updateProgram(id, data) {
  const res = await apiRequest(`/api/v1/ems/programs/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteProgram(id) {
  const res = await apiRequest(`/api/v1/ems/programs/${id}`, { method: "DELETE" });
  return res;
}

// === ACADEMIC YEARS ===
export async function listAcademicYears(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/academic-years${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getAcademicYear(id) {
  const res = await apiRequest(`/api/v1/ems/academic-years/${id}`);
  return res.data;
}

export async function createAcademicYear(data) {
  const res = await apiRequest("/api/v1/ems/academic-years", { method: "POST", body: data });
  return res.data;
}

export async function updateAcademicYear(id, data) {
  const res = await apiRequest(`/api/v1/ems/academic-years/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteAcademicYear(id) {
  const res = await apiRequest(`/api/v1/ems/academic-years/${id}`, { method: "DELETE" });
  return res;
}

// === SEMESTERS ===
export async function listSemesters(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/semesters${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getSemester(id) {
  const res = await apiRequest(`/api/v1/ems/semesters/${id}`);
  return res.data;
}

export async function createSemester(data) {
  const res = await apiRequest("/api/v1/ems/semesters", { method: "POST", body: data });
  return res.data;
}

export async function updateSemester(id, data) {
  const res = await apiRequest(`/api/v1/ems/semesters/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteSemester(id) {
  const res = await apiRequest(`/api/v1/ems/semesters/${id}`, { method: "DELETE" });
  return res;
}

// === BUILDINGS ===
export async function listBuildings(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/buildings${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getBuilding(id) {
  const res = await apiRequest(`/api/v1/ems/buildings/${id}`);
  return res.data;
}

export async function createBuilding(data) {
  const res = await apiRequest("/api/v1/ems/buildings", { method: "POST", body: data });
  return res.data;
}

export async function updateBuilding(id, data) {
  const res = await apiRequest(`/api/v1/ems/buildings/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteBuilding(id) {
  const res = await apiRequest(`/api/v1/ems/buildings/${id}`, { method: "DELETE" });
  return res;
}

// === ROOMS ===
export async function listRooms(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/rooms${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function getRoom(id) {
  const res = await apiRequest(`/api/v1/ems/rooms/${id}`);
  return res.data;
}

export async function createRoom(data) {
  const res = await apiRequest("/api/v1/ems/rooms", { method: "POST", body: data });
  return res.data;
}

export async function updateRoom(id, data) {
  const res = await apiRequest(`/api/v1/ems/rooms/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteRoom(id) {
  const res = await apiRequest(`/api/v1/ems/rooms/${id}`, { method: "DELETE" });
  return res;
}

// === INSTITUTION DASHBOARD ===
export async function getEmsDashboard() {
  const res = await apiRequest("/api/v1/ems/dashboard");
  return res.data;
}

export async function getEmsDashboardAnalytics() {
  const res = await apiRequest("/api/v1/ems/analytics");
  return res.data;
}

export async function getEmsAiInsights() {
  const res = await apiRequest("/api/v1/ems/ai-insights");
  return res.data;
}

// === ADMISSIONS ===
export async function listAdmissions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/admissions${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function createAdmission(data) {
  const res = await apiRequest("/api/v1/ems/admissions", { method: "POST", body: data });
  return res.data;
}

export async function updateAdmission(id, data) {
  const res = await apiRequest(`/api/v1/ems/admissions/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteAdmission(id) {
  const res = await apiRequest(`/api/v1/ems/admissions/${id}`, { method: "DELETE" });
  return res;
}

export async function updateAdmissionStatus(id, data) {
  const res = await apiRequest(`/api/v1/ems/admissions/${id}/status`, { method: "PATCH", body: data });
  return res.data;
}

export async function addAdmissionComment(id, data) {
  const res = await apiRequest(`/api/v1/ems/admissions/${id}/comments`, { method: "POST", body: data });
  return res.data;
}

export async function getAdmissionDashboard() {
  const res = await apiRequest("/api/v1/ems/admission-dashboard");
  return res.data;
}

// === STUDENTS ===
export async function listStudents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/students${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function createStudent(data) {
  const res = await apiRequest("/api/v1/ems/students", { method: "POST", body: data });
  return res.data;
}

export async function updateStudent(id, data) {
  const res = await apiRequest(`/api/v1/ems/students/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteStudent(id) {
  const res = await apiRequest(`/api/v1/ems/students/${id}`, { method: "DELETE" });
  return res;
}

export async function getStudentProfile() {
  const res = await apiRequest("/api/v1/ems/students/profile");
  return res.data;
}

export async function getStudentDashboard() {
  const res = await apiRequest("/api/v1/ems/student-dashboard");
  return res.data;
}

// === PARENTS ===
export async function listParents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/parents${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function createParent(data) {
  const res = await apiRequest("/api/v1/ems/parents", { method: "POST", body: data });
  return res.data;
}

export async function updateParent(id, data) {
  const res = await apiRequest(`/api/v1/ems/parents/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteParent(id) {
  const res = await apiRequest(`/api/v1/ems/parents/${id}`, { method: "DELETE" });
  return res;
}

// === COMMUNICATIONS ===
export async function listCommunications(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/communications${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function createCommunication(data) {
  const res = await apiRequest("/api/v1/ems/communications", { method: "POST", body: data });
  return res.data;
}

// === TEACHERS ===
export async function listTeachers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/teachers${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function createTeacher(data) {
  const res = await apiRequest("/api/v1/ems/teachers", { method: "POST", body: data });
  return res.data;
}

export async function updateTeacher(id, data) {
  const res = await apiRequest(`/api/v1/ems/teachers/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteTeacher(id) {
  const res = await apiRequest(`/api/v1/ems/teachers/${id}`, { method: "DELETE" });
  return res;
}

export async function getStaffDashboard() {
  const res = await apiRequest("/api/v1/ems/staff-dashboard");
  return res.data;
}

// === EMPLOYEES ===
export async function listEmployees(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/api/v1/ems/employees${query ? `?${query}` : ''}`);
  return res.data || [];
}

export async function createEmployee(data) {
  const res = await apiRequest("/api/v1/ems/employees", { method: "POST", body: data });
  return res.data;
}

export async function updateEmployee(id, data) {
  const res = await apiRequest(`/api/v1/ems/employees/${id}`, { method: "PUT", body: data });
  return res.data;
}

export async function deleteEmployee(id) {
  const res = await apiRequest(`/api/v1/ems/employees/${id}`, { method: "DELETE" });
  return res;
}
