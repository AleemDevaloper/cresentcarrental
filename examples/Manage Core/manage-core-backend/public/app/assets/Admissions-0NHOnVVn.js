import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ar as faFileAlt, Bn as faComment, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, I as faArrowRight, Lc as faUser, Ur as faFileInvoice, Yo as faRotate, _c as faTrash, bl as useApp, dc as faTimesCircle, fr as faEdit, ft as faBookOpen, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { F as listAdmissions, X as updateAdmissionStatus, Y as updateAdmission, _ as deleteAdmission, r as createAdmission, t as addAdmissionComment } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Admissions/Admissions.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STATUS_WORKFLOW = [
	{
		value: "applied",
		label: "Applied",
		icon: faFileInvoice,
		color: "secondary"
	},
	{
		value: "document_verification",
		label: "Document Verification",
		icon: faFileAlt,
		color: "info"
	},
	{
		value: "eligibility_check",
		label: "Eligibility Check",
		icon: faCheckCircle,
		color: "primary"
	},
	{
		value: "exam",
		label: "Exam",
		icon: faFileAlt,
		color: "warning"
	},
	{
		value: "interview",
		label: "Interview",
		icon: faEye,
		color: "info"
	},
	{
		value: "approved",
		label: "Approved",
		icon: faCheckCircle,
		color: "success"
	},
	{
		value: "rejected",
		label: "Rejected",
		icon: faTimesCircle,
		color: "danger"
	}
];
var Admissions = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		institution: "",
		program: "",
		status: "",
		date_from: "",
		date_to: ""
	});
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [showComments, setShowComments] = (0, import_react.useState)(false);
	const [selectedApp, setSelectedApp] = (0, import_react.useState)(null);
	const [newComment, setNewComment] = (0, import_react.useState)("");
	const [formData, setFormData] = (0, import_react.useState)({
		application_no: "",
		student_name: "",
		student_email: "",
		student_phone: "",
		institution_id: "",
		program_id: "",
		academic_year_id: "",
		documents: "",
		status: "applied",
		remarks: ""
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
			const data = await listAdmissions(params);
			setData(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Failed to load admissions");
			addNotification?.(err.message || "Failed to load admissions", "danger");
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
			application_no: "",
			student_name: "",
			student_email: "",
			student_phone: "",
			institution_id: "",
			program_id: "",
			academic_year_id: "",
			documents: "",
			status: "applied",
			remarks: ""
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			application_no: item.application_no || "",
			student_name: item.student_name || "",
			student_email: item.student_email || "",
			student_phone: item.student_phone || "",
			institution_id: item.institution_id || "",
			program_id: item.program_id || "",
			academic_year_id: item.academic_year_id || "",
			documents: item.documents || "",
			status: item.status || "applied",
			remarks: item.remarks || ""
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.student_name) {
			addNotification?.("Student name is required", "warning");
			return;
		}
		try {
			if (editItem) await updateAdmission(editItem.id, formData);
			else await createAdmission(formData);
			addNotification?.(editItem ? "Application updated successfully" : "Application created successfully", "success");
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving application", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this application?")) return;
		try {
			await deleteAdmission(id);
			addNotification?.("Application deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const updateStatus = async (id, newStatus) => {
		try {
			await updateAdmissionStatus(id, { status: newStatus });
			addNotification?.(`Status updated to ${newStatus}`, "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message, "danger");
		}
	};
	const handleAddComment = async () => {
		if (!newComment.trim() || !selectedApp) return;
		try {
			await addAdmissionComment(selectedApp.id, { comment: newComment });
			setNewComment("");
			addNotification?.("Comment added", "success");
		} catch (err) {
			addNotification?.(err.message, "danger");
		}
	};
	const getStatusStyle = (status) => {
		const s = STATUS_WORKFLOW.find((w) => w.value === status);
		return s ? {
			color: s.color,
			Icon: s.icon
		} : {
			color: "secondary",
			Icon: faClock
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `ems-root p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Admissions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage student applications and admissions"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn premium-btn-primary",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "New Application"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ps-5 premium-input ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.institution,
								onChange: (e) => setFilters({
									...filters,
									institution: e.target.value
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Institutions"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.program,
								onChange: (e) => setFilters({
									...filters,
									program: e.target.value
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Programs"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.status,
								onChange: (e) => setFilters({
									...filters,
									status: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Status"
								}), STATUS_WORKFLOW.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.value,
									children: s.label
								}, s.value))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.date_from,
								onChange: (e) => setFilters({
									...filters,
									date_from: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.date_to,
								onChange: (e) => setFilters({
									...filters,
									date_to: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 h-100",
								onClick: () => {
									setSearch("");
									setFilters({
										institution: "",
										program: "",
										status: "",
										date_from: "",
										date_to: ""
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
										children: "Application No"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Program" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Applied Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faFileInvoice,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No applications found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new application to get started"
								})
							]
						}) }) : data.map((item) => {
							const { color, Icon } = getStatusStyle(item.status);
							const idx = STATUS_WORKFLOW.findIndex((w) => w.value === item.status);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.application_no || `APP-${String(item.id).padStart(4, "0")}` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-semibold small",
									children: item.student_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.program_name || "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.created_at?.split("T")[0] || "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `badge rounded-pill bg-${color}-subtle text-${color}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: Icon,
										className: "me-1"
									}), STATUS_WORKFLOW[idx]?.label || item.status]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "pe-4 text-end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-light border rounded-3 me-1",
											onClick: () => {
												setSelectedApp(item);
												setShowComments(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faComment })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-light border rounded-3 me-1",
											onClick: () => openEditForm(item),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-danger rounded-3",
											onClick: () => handleDelete(item.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
										})
									]
								})
							] }, item.id);
						}) })]
					})
				})
			}),
			data.map((item) => {
				const idx = STATUS_WORKFLOW.findIndex((w) => w.value === item.status);
				if (idx === -1 || idx >= STATUS_WORKFLOW.length - 2) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `card border-0 shadow-sm rounded-4 p-3 mt-3 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
					style: { borderRadius: "18px" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center justify-content-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "small fw-bold",
							children: [item.student_name, " - Status Workflow"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex gap-1",
							children: STATUS_WORKFLOW.slice(idx + 1, idx + 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `btn btn-sm rounded-3 bg-${s.color}-subtle text-${s.color} fw-semibold`,
								onClick: () => updateStatus(item.id, s.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: s.icon,
										className: "me-1"
									}),
									s.label,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										className: "ms-1"
									})
								]
							}, s.value))
						})]
					})
				}, item.id);
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
								children: editItem ? "Edit Application" : "New Application"
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Application No"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.application_no,
												onChange: (e) => setFormData({
													...formData,
													application_no: e.target.value
												}),
												placeholder: "APP-2026-001"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Student Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUser })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													required: true,
													value: formData.student_name,
													onChange: (e) => setFormData({
														...formData,
														student_name: e.target.value
													}),
													placeholder: "John Doe"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												className: "form-control rounded-3",
												value: formData.student_email,
												onChange: (e) => setFormData({
													...formData,
													student_email: e.target.value
												}),
												placeholder: "john@example.com"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.student_phone,
												onChange: (e) => setFormData({
													...formData,
													student_phone: e.target.value
												}),
												placeholder: "+1 (555) 000-0000"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Institution"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
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
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
											className: "col-md-6",
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
												children: STATUS_WORKFLOW.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s.value,
													children: s.label
												}, s.value))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Documents"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileAlt })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.documents,
													onChange: (e) => setFormData({
														...formData,
														documents: e.target.value
													}),
													placeholder: "Document links or notes"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Remarks"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "form-control rounded-3",
												rows: "3",
												value: formData.remarks,
												onChange: (e) => setFormData({
													...formData,
													remarks: e.target.value
												}),
												placeholder: "Additional remarks..."
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
										icon: faFileInvoice,
										className: "me-2"
									}), editItem ? "Update Application" : "Save Application"]
								})]
							})]
						})]
					})
				})
			}),
			showComments && selectedApp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold",
								children: ["Comments - ", selectedApp.student_name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowComments(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3",
								style: {
									maxHeight: "300px",
									overflowY: "auto"
								},
								children: (selectedApp.comments || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted text-center py-3",
									children: "No comments yet"
								}) : selectedApp.comments.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3 rounded-3 mb-2 ${isDark ? "bg-dark-subtle" : "bg-light"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small text-muted fw-bold",
										children: c.created_at
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small",
										children: c.text
									})]
								}, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "input-group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: "form-control rounded-3",
									value: newComment,
									onChange: (e) => setNewComment(e.target.value),
									placeholder: "Add a comment..."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-primary rounded-3 ms-2",
									onClick: handleAddComment,
									children: "Send"
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
export { Admissions as default };
