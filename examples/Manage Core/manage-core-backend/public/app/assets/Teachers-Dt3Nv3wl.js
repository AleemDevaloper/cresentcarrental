import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Bs as faStar, Ci as faGraduationCap, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Kt as faChalkboardTeacher, Lc as faUser, Mt as faCalendar, Wt as faCertificate, _c as faTrash, _r as faEnvelope, bl as useApp, bt as faBriefcase, da as faLayerGroup, fr as faEdit, ft as faBookOpen, go as faPhone, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { O as deleteTeacher, h as createTeacher, q as listTeachers, st as updateTeacher } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Staff/Teachers.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GENDERS = [
	"Male",
	"Female",
	"Other"
];
var EMPLOYMENT_TYPES = [
	"Permanent",
	"Contract",
	"Visiting",
	"Probation",
	"Adjunct"
];
var Teachers = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		first_name: "",
		last_name: "",
		date_of_birth: "",
		gender: "Male",
		email: "",
		phone: "",
		address: "",
		department_id: "",
		subjects: "",
		classes: "",
		qualifications: "",
		certifications: "",
		employment_type: "Permanent",
		joining_date: "",
		status: "active"
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search) params.search = search;
			if (deptFilter) params.department_id = deptFilter;
			if (statusFilter) params.status = statusFilter;
			const data = await listTeachers(params);
			setData(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Failed to load teachers");
			addNotification?.(err.message || "Failed to load teachers", "danger");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		deptFilter,
		statusFilter,
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
			email: "",
			phone: "",
			address: "",
			department_id: "",
			subjects: "",
			classes: "",
			qualifications: "",
			certifications: "",
			employment_type: "Permanent",
			joining_date: "",
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
			email: item.email || "",
			phone: item.phone || "",
			address: item.address || "",
			department_id: item.department_id || "",
			subjects: item.subjects || "",
			classes: item.classes || "",
			qualifications: item.qualifications || "",
			certifications: item.certifications || "",
			employment_type: item.employment_type || "Permanent",
			joining_date: item.joining_date || "",
			status: item.status || "active"
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.first_name || !formData.last_name) {
			addNotification?.("First and last name are required", "warning");
			return;
		}
		try {
			if (editItem) await updateTeacher(editItem.id, formData);
			else await createTeacher(formData);
			addNotification?.(editItem ? "Teacher updated successfully" : "Teacher created successfully", "success");
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving teacher", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this teacher?")) return;
		try {
			await deleteTeacher(id);
			addNotification?.("Teacher deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `ems-root p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Teachers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage faculty and teaching staff"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn premium-btn-primary",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Teacher"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-4",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: deptFilter,
								onChange: (e) => setDeptFilter(e.target.value),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Departments"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: statusFilter,
								onChange: (e) => setStatusFilter(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inactive",
										children: "Inactive"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "on_leave",
										children: "On Leave"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 w-100",
								onClick: () => {
									setSearch("");
									setDeptFilter("");
									setStatusFilter("");
								},
								children: "Reset"
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subjects" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Classes" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "10",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "10",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faChalkboardTeacher,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No teachers found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a teacher to get started"
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "fw-semibold small",
								children: [
									item.first_name,
									" ",
									item.last_name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.employee_id || `TCH-${String(item.id).padStart(4, "0")}` }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.department_name || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.subjects || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.classes || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.phone || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.email || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${item.status === "active" ? "success" : item.status === "on_leave" ? "warning" : "secondary"}-subtle text-${item.status === "active" ? "success" : item.status === "on_leave" ? "warning" : "secondary"}`,
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
			data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mt-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
					className: "fw-bold mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faBriefcase,
						className: "me-2 text-warning"
					}), "Workload Summary"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: [
						{
							label: "Total Classes/Week",
							value: data.reduce((s, t) => s + (parseInt(t.classes) || 0), 0) || 45,
							icon: faChalkboardTeacher,
							color: "primary"
						},
						{
							label: "Avg Subjects/Teacher",
							value: data.length ? Math.round(data.reduce((s, t) => s + ((t.subjects || "").split(",").length || 0), 0) / data.length) : 2,
							icon: faBookOpen,
							color: "success"
						},
						{
							label: "Full-Time Faculty",
							value: data.filter((t) => t.employment_type === "Permanent").length || 0,
							icon: faStar,
							color: "info"
						},
						{
							label: "On Leave Today",
							value: data.filter((t) => t.status === "on_leave").length || 0,
							icon: faClock,
							color: "warning"
						}
					].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-6 col-md-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-3 rounded-4 d-flex align-items-center gap-3 ${isDark ? "bg-dark-subtle" : "bg-light"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-3 rounded-3 bg-${w.color}-subtle text-${w.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: w.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `x-small fw-bold ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: w.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h4 fw-bold mb-0",
								children: w.value
							})] })]
						})
					}, w.label))
				})]
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
								children: editItem ? "Edit Teacher" : "Add Teacher"
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
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select rounded-3",
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
													children: "Phone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPhone })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.phone,
														onChange: (e) => setFormData({
															...formData,
															phone: e.target.value
														}),
														placeholder: "+1 (555) 000-0000"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-12",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Address"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-3",
													value: formData.address,
													onChange: (e) => setFormData({
														...formData,
														address: e.target.value
													}),
													placeholder: "123 Main Street"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 text-success",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faLayerGroup,
											className: "me-2"
										}), "Department & Subjects"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Department"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select rounded-3",
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
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Subjects Assigned"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBookOpen })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.subjects,
														onChange: (e) => setFormData({
															...formData,
															subjects: e.target.value
														}),
														placeholder: "Math, Physics"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Classes Assigned"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChalkboardTeacher })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.classes,
														onChange: (e) => setFormData({
															...formData,
															classes: e.target.value
														}),
														placeholder: "10A, 11B"
													})]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 text-warning",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faGraduationCap,
											className: "me-2"
										}), "Qualifications & Employment"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Qualifications"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faGraduationCap })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.qualifications,
														onChange: (e) => setFormData({
															...formData,
															qualifications: e.target.value
														}),
														placeholder: "M.Sc., Ph.D."
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Certifications"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCertificate })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control rounded-end-3",
														value: formData.certifications,
														onChange: (e) => setFormData({
															...formData,
															certifications: e.target.value
														}),
														placeholder: "PMP, IELTS"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Employment Type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBriefcase })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														className: "form-select rounded-end-3",
														value: formData.employment_type,
														onChange: (e) => setFormData({
															...formData,
															employment_type: e.target.value
														}),
														children: EMPLOYMENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: t,
															children: t
														}, t))
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Joining Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "input-group-text rounded-start-3 bg-transparent",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendar })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "date",
														className: "form-control rounded-end-3",
														value: formData.joining_date,
														onChange: (e) => setFormData({
															...formData,
															joining_date: e.target.value
														})
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select rounded-3",
													value: formData.status,
													onChange: (e) => setFormData({
														...formData,
														status: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "active",
															children: "Active"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "inactive",
															children: "Inactive"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "on_leave",
															children: "On Leave"
														})
													]
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
										icon: faChalkboardTeacher,
										className: "me-2"
									}), editItem ? "Update Teacher" : "Save Teacher"]
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
export { Teachers as default };
