import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Kt as faChalkboardTeacher, _c as faTrash, bl as useApp, fr as faEdit, or as faDoorOpen, os as faSearch, ru as require_react, tl as faUsers, uc as faTimes, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { P as listAcademicYears, U as listPrograms, z as listDepartments } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Academic/Classes.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = ["active", "inactive"];
var Classes = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [departments, setDepartments] = (0, import_react.useState)([]);
	const [programs, setPrograms] = (0, import_react.useState)([]);
	const [academicYears, setAcademicYears] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [instFilter, setInstFilter] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("");
	const [progFilter, setProgFilter] = (0, import_react.useState)("");
	const [acYearFilter, setAcYearFilter] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [showStudents, setShowStudents] = (0, import_react.useState)(null);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		code: "",
		program_id: "",
		department_id: "",
		class_teacher: "",
		capacity: "",
		room: "",
		status: "active"
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search) params.search = search;
			if (deptFilter) params.department_id = deptFilter;
			if (progFilter) params.program_id = progFilter;
			const [clsRes, deptRes, progRes, ayRes] = await Promise.all([
				Promise.resolve([]),
				listDepartments(),
				listPrograms(),
				listAcademicYears()
			]);
			setData(Array.isArray(clsRes) ? clsRes : []);
			setDepartments(Array.isArray(deptRes) ? deptRes : []);
			setPrograms(Array.isArray(progRes) ? progRes : []);
			setAcademicYears(Array.isArray(ayRes) ? ayRes : []);
		} catch (err) {
			setError(err.message || "Failed to load classes");
			addNotification?.(err.message || "Failed to load classes", "danger");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		deptFilter,
		progFilter,
		addNotification
	]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const getDepartmentName = (id) => {
		const d = departments.find((x) => x.id === id);
		return d ? d.name : "Unknown";
	};
	const getProgramName = (id) => {
		const p = programs.find((x) => x.id === id);
		return p ? p.name : "Unknown";
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData({
			name: "",
			code: "",
			program_id: "",
			department_id: "",
			class_teacher: "",
			capacity: "",
			room: "",
			status: "active"
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			name: item.name || "",
			code: item.code || "",
			program_id: item.program_id || "",
			department_id: item.department_id || "",
			class_teacher: item.class_teacher || "",
			capacity: item.capacity ?? "",
			room: item.room || "",
			status: item.status || "active"
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.code) {
			addNotification?.("Name and Code are required", "warning");
			return;
		}
		try {
			if (editItem) addNotification?.("Class updated successfully", "success");
			else addNotification?.("Class created successfully", "success");
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving class", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this class?")) return;
		try {
			addNotification?.("Class deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Classes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage classes, sections, and student grouping"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Class"]
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
									className: `form-control rounded-3 ps-5 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search classes...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: deptFilter,
								onChange: (e) => {
									setDeptFilter(e.target.value);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Departments"
								}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d.id,
									children: d.name
								}, d.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: progFilter,
								onChange: (e) => setProgFilter(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Programs"
								}), programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p.id,
									children: p.name
								}, p.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: acYearFilter,
								onChange: (e) => setAcYearFilter(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Years"
								}), academicYears.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: y.id,
									children: y.name
								}, y.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2 d-flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary rounded-3 w-100",
								onClick: fetchData,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faSearch,
									className: "me-1"
								}), " Search"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3",
								onClick: () => {
									setSearch("");
									setDeptFilter("");
									setProgFilter("");
									setAcYearFilter("");
								},
								children: "Reset"
							})]
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
										children: "Class Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Program" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class Teacher" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Capacity" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Students" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "9",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "9",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faDoorOpen,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No classes found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new class to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faDoorOpen,
										className: "text-info opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.name
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.code }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: getProgramName(item.program_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: getDepartmentName(item.department_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.class_teacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faChalkboardTeacher,
									className: "me-1 text-muted"
								}), item.class_teacher] }) : "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.capacity ?? "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none p-0",
									onClick: () => setShowStudents(item),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUsers,
										className: "me-1 text-primary"
									}), " View"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${item.status === "active" ? "success" : "secondary"}-subtle text-${item.status === "active" ? "success" : "secondary"}`,
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
					className: "modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editItem ? "Edit Class" : "Add Class"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowForm(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Class Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.name,
												onChange: (e) => setFormData({
													...formData,
													name: e.target.value
												}),
												placeholder: "e.g. Grade 10-A"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Code ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.code,
												onChange: (e) => setFormData({
													...formData,
													code: e.target.value
												}),
												placeholder: "e.g. 10-A"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Program"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.program_id,
												onChange: (e) => setFormData({
													...formData,
													program_id: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Program"
												}), programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: p.id,
													children: p.name
												}, p.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Department"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.department_id,
												onChange: (e) => setFormData({
													...formData,
													department_id: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Department"
												}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: d.id,
													children: d.name
												}, d.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Class Teacher"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChalkboardTeacher })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.class_teacher,
													onChange: (e) => setFormData({
														...formData,
														class_teacher: e.target.value
													}),
													placeholder: "Mr. John Smith"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Capacity"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control rounded-3",
												value: formData.capacity,
												onChange: (e) => setFormData({
													...formData,
													capacity: e.target.value
												}),
												placeholder: "e.g. 40",
												min: "1"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Room"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.room,
												onChange: (e) => setFormData({
													...formData,
													room: e.target.value
												}),
												placeholder: "e.g. Room 201"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
													children: s.charAt(0).toUpperCase() + s.slice(1)
												}, s))
											})]
										})
									]
								})
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
										icon: faDoorOpen,
										className: "me-2"
									}), editItem ? "Update Class" : "Save Class"]
								})]
							})]
						})]
					})
				})
			}),
			showStudents && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-header border-0 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
									className: "fw-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUsers,
											className: "me-2 text-primary"
										}),
										"Students - ",
										showStudents.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn-close",
									onClick: () => setShowStudents(null)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "table-responsive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "table table-hover align-middle mb-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-light",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "small text-uppercase text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "#" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Roll No" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
											{
												id: 1,
												name: "Ali Ahmed",
												roll: "CS-001",
												status: "active"
											},
											{
												id: 2,
												name: "Sara Khan",
												roll: "CS-002",
												status: "active"
											},
											{
												id: 3,
												name: "Usman Ali",
												roll: "CS-003",
												status: "active"
											},
											{
												id: 4,
												name: "Fatima Zahra",
												roll: "CS-004",
												status: "active"
											},
											{
												id: 5,
												name: "Hassan Raza",
												roll: "CS-005",
												status: "active"
											}
										].map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "small",
												children: idx + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "fw-semibold small",
												children: s.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: s.roll }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `badge rounded-pill bg-${s.status === "active" ? "success" : "secondary"}-subtle text-${s.status === "active" ? "success" : "secondary"}`,
												children: s.status
											}) })
										] }, s.id)) })]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowStudents(null),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faTimes,
										className: "me-2"
									}), "Close"]
								})
							})
						]
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
export { Classes as default };
