import { Ol as apiRequest } from "./ai-BHgPkVLC.js";
//#region src/api/ems.js
async function listInstitutions(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/institutions${query ? `?${query}` : ""}`)).data || [];
}
async function createInstitution(data) {
	return (await apiRequest("/api/v1/ems/institutions", {
		method: "POST",
		body: data
	})).data;
}
async function updateInstitution(id, data) {
	return (await apiRequest(`/api/v1/ems/institutions/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteInstitution(id) {
	return await apiRequest(`/api/v1/ems/institutions/${id}`, { method: "DELETE" });
}
async function listCampuses(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/campuses${query ? `?${query}` : ""}`)).data || [];
}
async function createCampus(data) {
	return (await apiRequest("/api/v1/ems/campuses", {
		method: "POST",
		body: data
	})).data;
}
async function updateCampus(id, data) {
	return (await apiRequest(`/api/v1/ems/campuses/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteCampus(id) {
	return await apiRequest(`/api/v1/ems/campuses/${id}`, { method: "DELETE" });
}
async function listDepartments(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/departments${query ? `?${query}` : ""}`)).data || [];
}
async function createDepartment(data) {
	return (await apiRequest("/api/v1/ems/departments", {
		method: "POST",
		body: data
	})).data;
}
async function updateDepartment(id, data) {
	return (await apiRequest(`/api/v1/ems/departments/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteDepartment(id) {
	return await apiRequest(`/api/v1/ems/departments/${id}`, { method: "DELETE" });
}
async function listPrograms(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/programs${query ? `?${query}` : ""}`)).data || [];
}
async function createProgram(data) {
	return (await apiRequest("/api/v1/ems/programs", {
		method: "POST",
		body: data
	})).data;
}
async function updateProgram(id, data) {
	return (await apiRequest(`/api/v1/ems/programs/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteProgram(id) {
	return await apiRequest(`/api/v1/ems/programs/${id}`, { method: "DELETE" });
}
async function listAcademicYears(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/academic-years${query ? `?${query}` : ""}`)).data || [];
}
async function createAcademicYear(data) {
	return (await apiRequest("/api/v1/ems/academic-years", {
		method: "POST",
		body: data
	})).data;
}
async function updateAcademicYear(id, data) {
	return (await apiRequest(`/api/v1/ems/academic-years/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteAcademicYear(id) {
	return await apiRequest(`/api/v1/ems/academic-years/${id}`, { method: "DELETE" });
}
async function listSemesters(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/semesters${query ? `?${query}` : ""}`)).data || [];
}
async function createSemester(data) {
	return (await apiRequest("/api/v1/ems/semesters", {
		method: "POST",
		body: data
	})).data;
}
async function updateSemester(id, data) {
	return (await apiRequest(`/api/v1/ems/semesters/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteSemester(id) {
	return await apiRequest(`/api/v1/ems/semesters/${id}`, { method: "DELETE" });
}
async function listBuildings(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/buildings${query ? `?${query}` : ""}`)).data || [];
}
async function createBuilding(data) {
	return (await apiRequest("/api/v1/ems/buildings", {
		method: "POST",
		body: data
	})).data;
}
async function updateBuilding(id, data) {
	return (await apiRequest(`/api/v1/ems/buildings/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteBuilding(id) {
	return await apiRequest(`/api/v1/ems/buildings/${id}`, { method: "DELETE" });
}
async function listRooms(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/rooms${query ? `?${query}` : ""}`)).data || [];
}
async function createRoom(data) {
	return (await apiRequest("/api/v1/ems/rooms", {
		method: "POST",
		body: data
	})).data;
}
async function updateRoom(id, data) {
	return (await apiRequest(`/api/v1/ems/rooms/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteRoom(id) {
	return await apiRequest(`/api/v1/ems/rooms/${id}`, { method: "DELETE" });
}
async function getEmsDashboard() {
	return (await apiRequest("/api/v1/ems/dashboard")).data;
}
async function listAdmissions(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/admissions${query ? `?${query}` : ""}`)).data || [];
}
async function createAdmission(data) {
	return (await apiRequest("/api/v1/ems/admissions", {
		method: "POST",
		body: data
	})).data;
}
async function updateAdmission(id, data) {
	return (await apiRequest(`/api/v1/ems/admissions/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteAdmission(id) {
	return await apiRequest(`/api/v1/ems/admissions/${id}`, { method: "DELETE" });
}
async function updateAdmissionStatus(id, data) {
	return (await apiRequest(`/api/v1/ems/admissions/${id}/status`, {
		method: "PATCH",
		body: data
	})).data;
}
async function addAdmissionComment(id, data) {
	return (await apiRequest(`/api/v1/ems/admissions/${id}/comments`, {
		method: "POST",
		body: data
	})).data;
}
async function getAdmissionDashboard() {
	return (await apiRequest("/api/v1/ems/admission-dashboard")).data;
}
async function listStudents(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/students${query ? `?${query}` : ""}`)).data || [];
}
async function createStudent(data) {
	return (await apiRequest("/api/v1/ems/students", {
		method: "POST",
		body: data
	})).data;
}
async function updateStudent(id, data) {
	return (await apiRequest(`/api/v1/ems/students/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteStudent(id) {
	return await apiRequest(`/api/v1/ems/students/${id}`, { method: "DELETE" });
}
async function getStudentProfile() {
	return (await apiRequest("/api/v1/ems/students/profile")).data;
}
async function getStudentDashboard() {
	return (await apiRequest("/api/v1/ems/student-dashboard")).data;
}
async function listParents(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/parents${query ? `?${query}` : ""}`)).data || [];
}
async function createParent(data) {
	return (await apiRequest("/api/v1/ems/parents", {
		method: "POST",
		body: data
	})).data;
}
async function updateParent(id, data) {
	return (await apiRequest(`/api/v1/ems/parents/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteParent(id) {
	return await apiRequest(`/api/v1/ems/parents/${id}`, { method: "DELETE" });
}
async function listCommunications(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/communications${query ? `?${query}` : ""}`)).data || [];
}
async function createCommunication(data) {
	return (await apiRequest("/api/v1/ems/communications", {
		method: "POST",
		body: data
	})).data;
}
async function listTeachers(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/teachers${query ? `?${query}` : ""}`)).data || [];
}
async function createTeacher(data) {
	return (await apiRequest("/api/v1/ems/teachers", {
		method: "POST",
		body: data
	})).data;
}
async function updateTeacher(id, data) {
	return (await apiRequest(`/api/v1/ems/teachers/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteTeacher(id) {
	return await apiRequest(`/api/v1/ems/teachers/${id}`, { method: "DELETE" });
}
async function getStaffDashboard() {
	return (await apiRequest("/api/v1/ems/staff-dashboard")).data;
}
async function listEmployees(params = {}) {
	const query = new URLSearchParams(params).toString();
	return (await apiRequest(`/api/v1/ems/employees${query ? `?${query}` : ""}`)).data || [];
}
async function createEmployee(data) {
	return (await apiRequest("/api/v1/ems/employees", {
		method: "POST",
		body: data
	})).data;
}
async function updateEmployee(id, data) {
	return (await apiRequest(`/api/v1/ems/employees/${id}`, {
		method: "PUT",
		body: data
	})).data;
}
async function deleteEmployee(id) {
	return await apiRequest(`/api/v1/ems/employees/${id}`, { method: "DELETE" });
}
//#endregion
export { updateDepartment as $, getEmsDashboard as A, listEmployees as B, deleteParent as C, deleteStudent as D, deleteSemester as E, listAdmissions as F, listSemesters as G, listParents as H, listBuildings as I, updateAcademicYear as J, listStudents as K, listCampuses as L, getStudentDashboard as M, getStudentProfile as N, deleteTeacher as O, listAcademicYears as P, updateCampus as Q, listCommunications as R, deleteInstitution as S, deleteRoom as T, listPrograms as U, listInstitutions as V, listRooms as W, updateAdmissionStatus as X, updateAdmission as Y, updateBuilding as Z, deleteAdmission as _, createCampus as a, updateSemester as at, deleteDepartment as b, createEmployee as c, createProgram as d, updateEmployee as et, createRoom as f, deleteAcademicYear as g, createTeacher as h, createBuilding as i, updateRoom as it, getStaffDashboard as j, getAdmissionDashboard as k, createInstitution as l, createStudent as m, createAcademicYear as n, updateParent as nt, createCommunication as o, updateStudent as ot, createSemester as p, listTeachers as q, createAdmission as r, updateProgram as rt, createDepartment as s, updateTeacher as st, addAdmissionComment as t, updateInstitution as tt, createParent as u, deleteBuilding as v, deleteProgram as w, deleteEmployee as x, deleteCampus as y, listDepartments as z };
