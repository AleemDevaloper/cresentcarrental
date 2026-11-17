import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Fc as faUpload, Lc as faUser, Mt as faCalendar, Uc as faUserGraduate, Yo as faRotate, _c as faTrash, _r as faEnvelope, bl as useApp, da as faLayerGroup, fr as faEdit, ft as faBookOpen, gc as faTransgender, go as faPhone, ii as faFlag, ka as faMapMarkerAlt, lr as faDroplet, os as faSearch, ru as require_react, sr as faDownload, tl as faUsers, vl as FontAwesomeIcon, yn as faCity } from "./ai-BHgPkVLC.js";
import { D as deleteStudent, K as listStudents, m as createStudent, ot as updateStudent } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Students/Students.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GENDERS = [
	"Male",
	"Female",
	"Other"
];
var BLOOD_GROUPS = [
	"A+",
	"A-",
	"B+",
	"B-",
	"AB+",
	"AB-",
	"O+",
	"O-"
];
var STATUSES = [
	"active",
	"inactive",
	"graduated",
	"suspended"
];
var CLASSES = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12"
];
var Students = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		institution: "",
		campus: "",
		department: "",
		program: "",
		academic_year: "",
		status: "",
		gender: ""
	});
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		first_name: "",
		last_name: "",
		date_of_birth: "",
		gender: "Male",
		blood_group: "",
		nationality: "",
		mobile: "",
		email: "",
		address: "",
		city: "",
		institution_id: "",
		campus_id: "",
		department_id: "",
		program_id: "",
		class: "",
		section: "",
		academic_year_id: "",
		semester_id: "",
		father_name: "",
		mother_name: "",
		guardian_name: "",
		guardian_phone: "",
		guardian_email: "",
		status: "active"
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search) params.search = search;
			Object.entries(filters).forEach(([k, v]) => {
				if (v) params[k] = v;
			});
			const data = await listStudents(params);
			setData(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Failed to load students");
			addNotification?.(err.message || "Failed to load students", "danger");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		filters,
		addNotification
	]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const openAddForm = () => {
		setEditItem(null);
		setFormData({
			first_name: "",
			last_name: "",
			date_of_birth: "",
			gender: "Male",
			blood_group: "",
			nationality: "",
			mobile: "",
			email: "",
			address: "",
			city: "",
			institution_id: "",
			campus_id: "",
			department_id: "",
			program_id: "",
			class: "",
			section: "",
			academic_year_id: "",
			semester_id: "",
			father_name: "",
			mother_name: "",
			guardian_name: "",
			guardian_phone: "",
			guardian_email: "",
			status: "active"
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			first_name: item.first_name || "",
			last_name: item.last_name || "",
			date_of_birth: item.date_of_birth || "",
			gender: item.gender || "Male",
			blood_group: item.blood_group || "",
			nationality: item.nationality || "",
			mobile: item.mobile || "",
			email: item.email || "",
			address: item.address || "",
			city: item.city || "",
			institution_id: item.institution_id || "",
			campus_id: item.campus_id || "",
			department_id: item.department_id || "",
			program_id: item.program_id || "",
			class: item.class || "",
			section: item.section || "",
			academic_year_id: item.academic_year_id || "",
			semester_id: item.semester_id || "",
			father_name: item.father_name || "",
			mother_name: item.mother_name || "",
			guardian_name: item.guardian_name || "",
			guardian_phone: item.guardian_phone || "",
			guardian_email: item.guardian_email || "",
			status: item.status || "active"
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.first_name || !formData.last_name) {
			addNotification?.("First name and Last name are required", "warning");
			return;
		}
		try {
			if (editItem) await updateStudent(editItem.id, formData);
			else await createStudent(formData);
			addNotification?.(editItem ? "Student updated successfully" : "Student created successfully", "success");
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving student", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
		try {
			await deleteStudent(id);
			addNotification?.("Student deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const handleBulkImport = () => {
		addNotification?.("Bulk import feature - upload CSV file", "info");
	};
	const handleExport = () => {
		addNotification?.("Exporting student data...", "info");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `ems-root p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Students"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage student records"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-primary rounded-3",
							onClick: handleBulkImport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUpload,
								className: "me-2"
							}), "Bulk Import"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-success rounded-3",
							onClick: handleExport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faDownload,
								className: "me-2"
							}), "Export"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn premium-btn-primary",
							onClick: openAddForm,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-2"
							}), "Add Student"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ps-5 premium-input ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search by name or ID...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						Object.entries({
							institution: "Institution",
							campus: "Campus",
							department: "Department",
							program: "Program",
							academic_year: "Academic Year",
							status: "Status",
							gender: "Gender"
						}).map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col",
							style: { minWidth: "120px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters[key],
								onChange: (e) => setFilters({
									...filters,
									[key]: e.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "",
										children: ["All ", label]
									}),
									key === "status" && STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s)),
									key === "gender" && GENDERS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: g,
										children: g
									}, g))
								]
							})
						}, key)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 h-100",
								onClick: () => {
									setSearch("");
									setFilters({
										institution: "",
										campus: "",
										department: "",
										program: "",
										academic_year: "",
										status: "",
										gender: ""
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRotate })
							})
						})
					]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-close ms-auto",
						onClick: () => setError(null)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "Photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ID" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Roll No" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUserGraduate,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No students found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new student to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold",
									style: {
										width: "36px",
										height: "36px",
										fontSize: "13px"
									},
									children: [item.first_name?.charAt(0), item.last_name?.charAt(0)]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "fw-semibold small",
								children: [
									item.first_name,
									" ",
									item.last_name
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.student_id || `STU-${String(item.id).padStart(4, "0")}` }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.roll_no || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.class || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.department_name || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${item.status === "active" ? "success" : item.status === "graduated" ? "info" : item.status === "suspended" ? "danger" : "secondary"}-subtle text-${item.status === "active" ? "success" : item.status === "graduated" ? "info" : item.status === "suspended" ? "danger" : "secondary"}`,
								children: item.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-light border rounded-3 me-1",
									onClick: () => openEditForm(item),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-danger rounded-3",
									onClick: () => handleDelete(item.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
								})]
							})
						] }, item.id)) })]
					})
				})
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editItem ? "Edit Student" : "Add Student"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowForm(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUser,
											className: "me-2"
										}), "Personal Info"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "small fw-bold text-muted mb-2",
													children: ["First Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-danger",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													required: true,
													value: formData.first_name,
													onChange: (e) => setFormData({
														...formData,
														first_name: e.target.value
													}),
													placeholder: "John"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "small fw-bold text-muted mb-2",
													children: ["Last Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-danger",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													required: true,
													value: formData.last_name,
													onChange: (e) => setFormData({
														...formData,
														last_name: e.target.value
													}),
													placeholder: "Doe"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Date of Birth"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendar })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "date",
														className: "form-control rounded-end-3",
														value: formData.date_of_birth,
														onChange: (e) => setFormData({
															...formData,
															date_of_birth: e.target.value
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Gender"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTransgender })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														className: "form-select rounded-end-3",
														value: formData.gender,
														onChange: (e) => setFormData({
															...formData,
															gender: e.target.value
														}),
														children: GENDERS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: g,
															children: g
														}, g))
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Blood Group"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDroplet })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														className: "form-select rounded-end-3",
														value: formData.blood_group,
														onChange: (e) => setFormData({
															...formData,
															blood_group: e.target.value
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Select"
														}), BLOOD_GROUPS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: b,
															children: b
														}, b))]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Nationality"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFlag })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.nationality,
														onChange: (e) => setFormData({
															...formData,
															nationality: e.target.value
														}),
														placeholder: "American"
													})]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 text-success",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEnvelope,
											className: "me-2"
										}), "Contact Info"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Mobile"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPhone })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.mobile,
														onChange: (e) => setFormData({
															...formData,
															mobile: e.target.value
														}),
														placeholder: "+1 (555) 000-0000"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEnvelope })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "email",
														className: "form-control rounded-end-3",
														value: formData.email,
														onChange: (e) => setFormData({
															...formData,
															email: e.target.value
														}),
														placeholder: "john@example.com"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "City"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCity })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.city,
														onChange: (e) => setFormData({
															...formData,
															city: e.target.value
														}),
														placeholder: "New York"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-12",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Address"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMapMarkerAlt })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.address,
														onChange: (e) => setFormData({
															...formData,
															address: e.target.value
														}),
														placeholder: "123 Main Street"
													})]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 text-warning",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faBookOpen,
											className: "me-2"
										}), "Academic Info"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Institution"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBuilding })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														className: "form-select rounded-end-3",
														value: formData.institution_id,
														onChange: (e) => setFormData({
															...formData,
															institution_id: e.target.value
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Select"
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Campus"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBuilding })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														className: "form-select rounded-end-3",
														value: formData.campus_id,
														onChange: (e) => setFormData({
															...formData,
															campus_id: e.target.value
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Select"
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Department"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faLayerGroup })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														className: "form-select rounded-end-3",
														value: formData.department_id,
														onChange: (e) => setFormData({
															...formData,
															department_id: e.target.value
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Select"
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Program"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBookOpen })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														className: "form-select rounded-end-3",
														value: formData.program_id,
														onChange: (e) => setFormData({
															...formData,
															program_id: e.target.value
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Select"
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Class"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select rounded-3",
													value: formData.class,
													onChange: (e) => setFormData({
														...formData,
														class: e.target.value
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Select"
													}), CLASSES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: c,
														children: ["Class ", c]
													}, c))]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Section"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													value: formData.section,
													onChange: (e) => setFormData({
														...formData,
														section: e.target.value
													}),
													placeholder: "A"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Academic Year"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select rounded-3",
													value: formData.academic_year_id,
													onChange: (e) => setFormData({
														...formData,
														academic_year_id: e.target.value
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Select"
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Semester"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select rounded-3",
													value: formData.semester_id,
													onChange: (e) => setFormData({
														...formData,
														semester_id: e.target.value
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Select"
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 text-info",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUsers,
											className: "me-2"
										}), "Guardian Info"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Father's Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													value: formData.father_name,
													onChange: (e) => setFormData({
														...formData,
														father_name: e.target.value
													}),
													placeholder: "Robert Doe"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Mother's Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													value: formData.mother_name,
													onChange: (e) => setFormData({
														...formData,
														mother_name: e.target.value
													}),
													placeholder: "Jane Doe"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Guardian Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													value: formData.guardian_name,
													onChange: (e) => setFormData({
														...formData,
														guardian_name: e.target.value
													}),
													placeholder: "Guardian"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Guardian Phone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPhone })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.guardian_phone,
														onChange: (e) => setFormData({
															...formData,
															guardian_phone: e.target.value
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Guardian Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEnvelope })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "email",
														className: "form-control rounded-end-3",
														value: formData.guardian_email,
														onChange: (e) => setFormData({
															...formData,
															guardian_email: e.target.value
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select rounded-3",
													value: formData.status,
													onChange: (e) => setFormData({
														...formData,
														status: e.target.value
													}),
													children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: s,
														children: s
													}, s))
												})]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowForm(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "btn btn-primary rounded-3 px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUserGraduate,
										className: "me-2"
									}), editItem ? "Update Student" : "Save Student"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
      ` })
		]
	});
};
//#endregion
export { Students as default };
