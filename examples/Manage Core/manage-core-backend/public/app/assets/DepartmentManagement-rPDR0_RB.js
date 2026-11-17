import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $c as faUserTie, $l as plugin_legend, Br as faFileExport, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Es as faSitemap, Fs as faSpinner, Hl as LineElement, Il as BarElement, Jl as RadialLinearScale, Kl as PointElement, Pl as ArcElement, Qa as faNetworkWired, Rl as CategoryScale, Tt as faBuildingColumns, Ul as LinearScale, Xi as faIdBadge, Xn as faCubes, Xs as faTable, Xt as faChartPie, Yt as faChartLine, Zl as index, _c as faTrash, b as DialogBox, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, fc as faToggleOff, g as Radar, ir as faDollarSign, ka as faMapMarkerAlt, oo as faPen, os as faSearch, pa as faLightbulb, pc as faToggleOn, qo as faRobot, ru as require_react, sc as faThLarge, ti as faFilter, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
import { Ct as createDepartment, Pt as updateDepartment, Tt as deleteDepartment, jt as listDepartments } from "./hrms-DLGg_3y5.js";
//#region src/pages/organization/departments/DepartmentManagement.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, RadialLinearScale, plugin_title, plugin_tooltip, plugin_legend, index);
var DEPARTMENT_COLORS = [
	"#3b82f6",
	"#ec4899",
	"#10b981",
	"#8b5cf6",
	"#f59e0b",
	"#06b6d4",
	"#6366f1",
	"#ef4444",
	"#14b8a6",
	"#f97316",
	"#84cc16",
	"#0ea5e9"
];
var DepartmentManagement = () => {
	const { t } = useTranslation();
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [searchTerm, setSearchFilter] = (0, import_react.useState)("");
	const [departments, setDepartments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [showCreateModal, setShowCreateModal] = (0, import_react.useState)(false);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formCode, setFormCode] = (0, import_react.useState)("");
	const [formDesc, setFormDesc] = (0, import_react.useState)("");
	const [formHead, setFormHead] = (0, import_react.useState)("");
	const [formBudget, setFormBudget] = (0, import_react.useState)("");
	const [formLocation, setFormLocation] = (0, import_react.useState)("");
	const [formStatus, setFormStatus] = (0, import_react.useState)("active");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [submitError, setSubmitError] = (0, import_react.useState)(null);
	const [showEditModal, setShowEditModal] = (0, import_react.useState)(false);
	const [editingDept, setEditingDept] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editCode, setEditCode] = (0, import_react.useState)("");
	const [editDesc, setEditDesc] = (0, import_react.useState)("");
	const [editHead, setEditHead] = (0, import_react.useState)("");
	const [editBudget, setEditBudget] = (0, import_react.useState)("");
	const [editLocation, setEditLocation] = (0, import_react.useState)("");
	const [editStatus, setEditStatus] = (0, import_react.useState)("active");
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			setDepartments(await listDepartments());
		} catch (err) {
			setError(err.message || "Failed to load data");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const resetForm = () => {
		setFormName("");
		setFormCode("");
		setFormDesc("");
		setFormHead("");
		setFormBudget("");
		setFormLocation("");
		setFormStatus("active");
		setSubmitError(null);
	};
	const resetEditForm = () => {
		setEditName("");
		setEditCode("");
		setEditDesc("");
		setEditHead("");
		setEditBudget("");
		setEditLocation("");
		setEditStatus("active");
		setEditingDept(null);
		setSubmitError(null);
	};
	const handleCreate = async (e) => {
		e.preventDefault();
		if (!formName.trim()) return;
		setSubmitting(true);
		setSubmitError(null);
		try {
			await createDepartment({
				name: formName.trim(),
				code: formCode.trim() || null,
				description: formDesc.trim() || null,
				head_of_department: formHead.trim() || null,
				budget: formBudget ? parseFloat(formBudget) : null,
				location: formLocation.trim() || null,
				status: formStatus
			});
			setShowCreateModal(false);
			resetForm();
			await fetchData();
		} catch (err) {
			setSubmitError(err.message || "Failed to create department");
		} finally {
			setSubmitting(false);
		}
	};
	const openEditModal = (dept) => {
		setEditingDept(dept);
		setEditName(dept.name || "");
		setEditCode(dept.code || "");
		setEditDesc(dept.description || "");
		setEditHead(dept.head_of_department || "");
		setEditBudget(dept.budget != null ? String(dept.budget) : "");
		setEditLocation(dept.location || "");
		setEditStatus(dept.status || "active");
		setSubmitError(null);
		setShowEditModal(true);
	};
	const handleUpdate = async (e) => {
		e.preventDefault();
		if (!editingDept || !editName.trim()) return;
		setSubmitting(true);
		setSubmitError(null);
		try {
			await updateDepartment(editingDept.id, {
				name: editName.trim(),
				code: editCode.trim() || null,
				description: editDesc.trim() || null,
				head_of_department: editHead.trim() || null,
				budget: editBudget ? parseFloat(editBudget) : null,
				location: editLocation.trim() || null,
				status: editStatus
			});
			setShowEditModal(false);
			resetEditForm();
			await fetchData();
		} catch (err) {
			setSubmitError(err.message || "Failed to update department");
		} finally {
			setSubmitting(false);
		}
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			await deleteDepartment(deleteTarget.id);
			setDeleteTarget(null);
			await fetchData();
		} catch (err) {
			setSubmitError(err.message || "Failed to delete department");
		} finally {
			setDeleting(false);
		}
	};
	const handleExportCSV = () => {
		const headers = [
			"Department Name",
			"Code",
			"Description",
			"Head of Department",
			"Budget",
			"Location",
			"Status",
			"Designations"
		];
		const rows = departments.map((d) => [
			d.name,
			d.code || "",
			d.description || "",
			d.head_of_department || "",
			d.budget != null ? d.budget : "",
			d.location || "",
			d.status || "active",
			d.designations ? d.designations.length : 0
		]);
		const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `departments_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(link.href);
	};
	const filteredDepartments = departments.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code && d.code.toLowerCase().includes(searchTerm.toLowerCase()) || d.head_of_department && d.head_of_department.toLowerCase().includes(searchTerm.toLowerCase()) || d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase()));
	const getColor = (idx) => DEPARTMENT_COLORS[idx % DEPARTMENT_COLORS.length];
	const totalDepartments = departments.length;
	const totalDesignations = departments.reduce((sum, d) => sum + (d.designations ? d.designations.length : 0), 0);
	const totalBudget = departments.reduce((sum, d) => sum + (parseFloat(d.budget) || 0), 0);
	const activeDepartments = departments.filter((d) => d.status !== "inactive").length;
	const MetricCard = ({ stat }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "col-xl-3 col-md-6 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-lift ${isDark ? "bg-dark-card" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-4 p-3 d-flex align-items-center justify-content-center me-3",
						style: {
							backgroundColor: `${stat.color}1a`,
							color: stat.color,
							width: "50px",
							height: "50px"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: stat.icon })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted small mb-0 fw-medium",
						children: stat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						children: stat.value
					})] })]
				}), stat.subValue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-0",
					children: stat.subValue
				})]
			})
		})
	});
	const DepartmentCard = ({ dept, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "col-xl-4 col-md-6 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden department-card ${isDark ? "bg-dark-card" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-start mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-4 d-flex align-items-center justify-content-center me-3",
								style: {
									backgroundColor: `${color}1a`,
									color,
									width: "56px",
									height: "56px",
									fontSize: "24px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBuilding })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-0",
								children: dept.name
							}), dept.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge ${isDark ? "bg-dark text-light" : "bg-light text-muted"} rounded-pill mt-1`,
								children: dept.code
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light btn-sm rounded-circle p-0 text-primary",
								style: {
									width: "32px",
									height: "32px"
								},
								onClick: () => openEditModal(dept),
								title: "Edit department",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPen,
									size: "xs"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light btn-sm rounded-circle p-0 text-danger",
								style: {
									width: "32px",
									height: "32px"
								},
								onClick: () => setDeleteTarget(dept),
								title: "Delete department",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faTrash,
									size: "xs"
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3 ${isDark ? "bg-dark" : "bg-light"} rounded-3`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-1",
										children: "Designations"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "fw-bold mb-0",
										children: dept.designations ? dept.designations.length : 0
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3 ${isDark ? "bg-dark" : "bg-light"} rounded-3`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-1",
										children: "Head"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "fw-bold small mb-0",
										children: dept.head_of_department || "—"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3 ${isDark ? "bg-dark" : "bg-light"} rounded-3`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-1",
										children: "Budget"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "fw-bold small mb-0",
										children: dept.budget ? `$${parseFloat(dept.budget).toLocaleString()}` : "—"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-3 ${isDark ? "bg-dark" : "bg-light"} rounded-3`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-1",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "fw-bold small mb-0",
										children: dept.location || "—"
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center justify-content-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `badge rounded-pill px-3 py-2 ${dept.status === "inactive" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: dept.status === "inactive" ? faToggleOff : faToggleOn,
								className: "me-1"
							}), dept.status === "inactive" ? "Inactive" : "Active"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted small",
							children: [dept.designations ? dept.designations.length : 0, " roles"]
						})]
					})
				]
			})
		})
	});
	const AnalyticsDashboard = () => {
		const deptNames = departments.map((d) => d.name);
		const deptDesignationCounts = departments.map((d) => d.designations ? d.designations.length : 0);
		const deptBudgets = departments.map((d) => parseFloat(d.budget) || 0);
		const radarData = {
			labels: [
				t("productivity"),
				t("resource_utilization"),
				t("attendance_rate"),
				t("task_completion_rate"),
				t("employee_satisfaction"),
				t("project_delivery_score")
			],
			datasets: [{
				label: "Engineering",
				data: [
					94,
					91,
					88,
					95,
					82,
					94
				],
				backgroundColor: "rgba(59, 130, 246, 0.2)",
				borderColor: "#3b82f6",
				borderWidth: 2,
				pointBackgroundColor: "#3b82f6"
			}, {
				label: "Marketing",
				data: [
					82,
					85,
					92,
					80,
					88,
					85
				],
				backgroundColor: "rgba(236, 72, 153, 0.2)",
				borderColor: "#ec4899",
				borderWidth: 2,
				pointBackgroundColor: "#ec4899"
			}]
		};
		const barData = {
			labels: deptNames.length ? deptNames : ["No Data"],
			datasets: [{
				label: "Designations",
				data: deptDesignationCounts.length ? deptDesignationCounts : [0],
				backgroundColor: departments.map((_, i) => getColor(i)),
				borderRadius: 8
			}]
		};
		const budgetBarData = {
			labels: deptNames.length ? deptNames : ["No Data"],
			datasets: [{
				label: "Budget ($)",
				data: deptBudgets.length ? deptBudgets : [0],
				backgroundColor: departments.map((_, i) => getColor(i)),
				borderRadius: 8
			}]
		};
		const hasBudgets = deptBudgets.some((b) => b > 0);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fade-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-6 mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card-header border-0 p-4 ${isDark ? "bg-dark border-secondary" : "bg-transparent"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
									className: `fw-bold mb-0 ${isDark ? "text-light" : ""}`,
									children: [t("performance_score"), " Comparison"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-body p-4 d-flex align-items-center justify-content-center",
								style: { minHeight: "400px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
									data: radarData,
									options: {
										maintainAspectRatio: false,
										scales: { r: {
											beginAtZero: true,
											max: 100
										} }
									}
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-6 mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card-header border-0 p-4 ${isDark ? "bg-dark border-secondary" : "bg-transparent"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: `fw-bold mb-0 ${isDark ? "text-light" : ""}`,
									children: "Designations per Department"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-body p-4 d-flex align-items-center justify-content-center",
								style: { minHeight: "400px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: barData,
									options: { maintainAspectRatio: false }
								})
							})]
						})
					})]
				}),
				hasBudgets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-12 mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark-card" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card-header border-0 p-4 ${isDark ? "bg-dark border-secondary" : "bg-transparent"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: `fw-bold mb-0 ${isDark ? "text-light" : ""}`,
									children: "Budget by Department"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-body p-4 d-flex align-items-center justify-content-center",
								style: { minHeight: "300px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: budgetBarData,
									options: {
										maintainAspectRatio: false,
										scales: { y: { beginAtZero: true } }
									}
								})
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card border-0 shadow-sm rounded-4 p-4 mb-4",
							style: { backgroundColor: "#1e293b" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-primary bg-opacity-20 rounded-circle p-3 d-flex align-items-center justify-content-center",
									style: {
										width: "60px",
										height: "60px"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faRobot,
										className: "text-primary fs-3"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "text-white fw-bold mb-1",
									children: t("ai_workforce_insights")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-light text-opacity-75 small mb-0",
									children: "Powered by ManageCore Intelligence"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row g-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-4",
											style: {
												backgroundColor: "rgba(255,255,255,0.05)",
												border: "1px solid rgba(255,255,255,0.1)"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faLightbulb,
													className: "text-warning mb-3 fs-4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "text-white fw-bold",
													children: "Retention Alert"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-light text-opacity-50 small mb-0",
													children: "High workload may lead to increased churn within 3 months."
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-4",
											style: {
												backgroundColor: "rgba(255,255,255,0.05)",
												border: "1px solid rgba(255,255,255,0.1)"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faChartLine,
													className: "text-success mb-3 fs-4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "text-white fw-bold",
													children: "Optimization Success"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-light text-opacity-50 small mb-0",
													children: "New resource allocation improved output by 22% this quarter."
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-4",
											style: {
												backgroundColor: "rgba(255,255,255,0.05)",
												border: "1px solid rgba(255,255,255,0.1)"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faNetworkWired,
													className: "text-info mb-3 fs-4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "text-white fw-bold",
													children: "Cross-Dept Insight"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-light text-opacity-50 small mb-0",
													children: "Bottleneck identified in cross-department handovers."
												})
											]
										})
									})
								]
							})]
						})
					})
				})
			]
		});
	};
	const OrganizationChart = () => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fade-in py-5 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "org-node mx-auto mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card border-0 shadow-sm rounded-4 p-4 d-inline-block",
						style: {
							minWidth: "250px",
							borderTop: "4px solid #334155"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-circle overflow-hidden mx-auto mb-3 ${isDark ? "bg-dark" : "bg-light"} d-flex align-items-center justify-content-center`,
								style: {
									width: "64px",
									height: "64px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUsers,
									className: "text-secondary fs-3"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "CEO & Founder"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0",
								children: "Executive Office"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "org-connector-v" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-center gap-5 position-relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "org-connector-h" }), departments.slice(0, 5).map((dept, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "org-branch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "org-connector-v-short" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card border-0 shadow-sm rounded-4 p-4 d-inline-block",
							style: {
								minWidth: "180px",
								borderTop: `4px solid ${getColor(idx)}`
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: dept.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `badge ${isDark ? "bg-dark text-light" : "bg-light text-muted"} rounded-pill mt-2`,
								children: [dept.designations ? dept.designations.length : 0, " Roles"]
							})]
						})]
					}, dept.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
                .org-node { position: relative; }
                .org-connector-v { width: 2px; height: 50px; background-color: #cbd5e1; margin: 0 auto; }
                .org-connector-v-short { width: 2px; height: 30px; background-color: #cbd5e1; margin: 0 auto; }
                .org-connector-h { 
                    position: absolute; 
                    top: 0; 
                    left: 10%; 
                    right: 10%; 
                    height: 2px; 
                    background-color: #cbd5e1; 
                }
                .org-branch { position: relative; }
            ` } })
			]
		});
	};
	const stats = [
		{
			label: t("total_departments"),
			value: String(totalDepartments),
			icon: faBuilding,
			color: "#3b82f6",
			subValue: `${activeDepartments} Active`
		},
		{
			label: "Total Roles",
			value: String(totalDesignations),
			icon: faIdBadge,
			color: "#8b5cf6",
			subValue: `Across ${totalDepartments} depts`
		},
		{
			label: "Avg Roles/Dept",
			value: totalDepartments ? String((totalDesignations / totalDepartments).toFixed(1)) : "0",
			icon: faCubes,
			color: "#f59e0b",
			subValue: "Distribution"
		},
		{
			label: "Total Budget",
			value: totalBudget ? `$${totalBudget.toLocaleString()}` : "—",
			icon: faChartLine,
			color: "#10b981",
			subValue: `${departments.filter((d) => parseFloat(d.budget) > 0).length} depts with budget`
		}
	];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "d-flex align-items-center justify-content-center",
		style: { minHeight: "60vh" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faSpinner,
				spin: true,
				className: "fs-1 text-primary mb-3"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Loading departments..."
			})]
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "d-flex align-items-center justify-content-center",
		style: { minHeight: "60vh" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faExclamationTriangle,
					className: "fs-1 text-danger mb-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-danger fw-bold mb-1",
					children: "Failed to load data"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-3",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary rounded-3 px-4",
					onClick: fetchData,
					children: "Retry"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `department-mgmt-page ${isDark ? "dark-mode" : ""}`,
		style: {
			backgroundColor: isDark ? "transparent" : "#F8FAFC",
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-fluid py-4 px-lg-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row align-items-center mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: `fw-bold ${isDark ? "text-light" : "text-dark"} mb-1`,
								children: t("departments")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted mb-0",
								children: t("dept_mgmt_desc_long")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-lg-6 mt-3 mt-lg-0 text-lg-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex flex-wrap justify-content-lg-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: `btn ${isDark ? "btn-outline-secondary" : "btn-white"} border shadow-sm rounded-3 px-4 fw-bold transition hover-lift`,
									onClick: handleExportCSV,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faFileExport,
										className: "me-2 text-primary"
									}), t("export_data")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-primary shadow-sm rounded-3 px-4 fw-bold transition hover-lift",
									onClick: () => {
										resetForm();
										setShowCreateModal(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPlus,
										className: "me-2"
									}), t("create_department")]
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row mb-2",
						children: stats.map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, { stat }, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 mb-4 ${isDark ? "bg-dark-card" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row align-items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4 mb-3 mb-md-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `input-group ${isDark ? "bg-dark" : "bg-light"} rounded-3 px-2 border-0`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text bg-transparent border-0 text-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control bg-transparent border-0 small py-2",
											placeholder: "Search by name, code, head or location...",
											value: searchTerm,
											onChange: (e) => setSearchFilter(e.target.value)
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex flex-wrap align-items-center justify-content-md-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `btn-group rounded-3 overflow-hidden ${isDark ? "border-secondary" : "border"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "grid" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("grid"),
													title: t("grid_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faThLarge })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "card" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("card"),
													title: "Card view",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBuilding })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "table" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("table"),
													title: t("table_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTable })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "org" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("org"),
													title: t("org_chart"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSitemap })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "analytics" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("analytics"),
													title: t("analytics_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChartPie })
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: `btn ${isDark ? "btn-outline-secondary" : "btn-white"} border px-3 rounded-3 transition`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilter,
												className: "me-2 text-muted"
											}), "Filters"]
										})]
									})
								})]
							})
						})
					}),
					viewMode === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row fade-in",
						children: filteredDepartments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-12 text-center py-5 text-muted",
							children: searchTerm ? "No departments match your search." : "No departments yet. Click \"Create Department\" to add one."
						}) : filteredDepartments.map((dept, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentCard, {
							dept,
							color: getColor(idx)
						}, dept.id))
					}),
					viewMode === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-4 fade-in",
						children: filteredDepartments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-12 text-center py-5 text-muted",
							children: searchTerm ? "No departments match your search." : "No departments yet."
						}) : filteredDepartments.map((dept, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4 col-md-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden ${isDark ? "bg-dark-card" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-body p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-3 p-3 text-white shadow-sm",
												style: { backgroundColor: getColor(idx) },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faBuilding,
													className: "fs-4"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `badge rounded-pill px-3 d-flex align-items-center ${dept.status === "inactive" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`,
												children: dept.status === "inactive" ? "Inactive" : "Active"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "fw-bold mb-1",
											children: dept.name
										}),
										dept.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge ${isDark ? "bg-dark text-light" : "bg-light text-muted"} rounded-pill mb-3`,
											children: dept.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "row g-3 py-3 border-top border-bottom mb-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted small mb-1",
														children: "Head"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "fw-bold small mb-0",
														children: dept.head_of_department || "—"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted small mb-1",
														children: "Budget"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "fw-bold small mb-0",
														children: dept.budget ? `$${parseFloat(dept.budget).toLocaleString()}` : "—"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted small mb-1",
														children: "Location"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "fw-bold small mb-0",
														children: dept.location || "—"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted small mb-1",
														children: "Designations"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "fw-bold small mb-0",
														children: dept.designations ? dept.designations.length : 0
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "d-flex align-items-center justify-content-between",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn p-0 text-primary fw-bold small d-flex align-items-center gap-1",
													onClick: () => openEditModal(dept),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPen }), " Edit"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn p-0 text-danger fw-bold small d-flex align-items-center gap-1",
													onClick: () => setDeleteTarget(dept),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash }), " Delete"]
												})]
											})
										})
									]
								})
							})
						}, dept.id))
					}),
					viewMode === "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4 overflow-hidden fade-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: `${isDark ? "bg-dark-header" : "bg-light"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4 py-3 border-0",
											children: t("dept_name")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0",
											children: "Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-center",
											children: "Designations"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0",
											children: "Head"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0",
											children: "Budget"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0",
											children: "Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-center",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pe-4 py-3 border-0 text-end",
											children: "Action"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredDepartments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "8",
									className: "text-center py-5 text-muted",
									children: searchTerm ? "No departments match your search." : "No departments yet."
								}) }) : filteredDepartments.map((dept, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "ps-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-circle d-flex align-items-center justify-content-center me-3",
												style: {
													backgroundColor: `${getColor(idx)}1a`,
													color: getColor(idx),
													width: "40px",
													height: "40px"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBuilding })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "fw-bold",
												children: dept.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge ${isDark ? "bg-dark text-light border-secondary" : "bg-light text-muted border"} rounded-pill`,
											children: dept.code || "—"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-center",
										children: dept.designations ? dept.designations.length : 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small fw-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faUserTie,
												className: "me-2 opacity-50"
											}), dept.head_of_department || "—"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small fw-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faDollarSign,
												className: "me-1 opacity-50"
											}), dept.budget ? `$${parseFloat(dept.budget).toLocaleString()}` : "—"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small fw-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faMapMarkerAlt,
												className: "me-1 opacity-50"
											}), dept.location || "—"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill ${dept.status === "inactive" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`,
											children: dept.status === "inactive" ? "Inactive" : "Active"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "pe-4 py-3 text-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1 justify-content-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: `btn btn-sm rounded-circle p-0 text-primary ${isDark ? "btn-outline-secondary" : "btn-light"}`,
												style: {
													width: "32px",
													height: "32px"
												},
												onClick: () => openEditModal(dept),
												title: "Edit department",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faPen,
													size: "xs"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: `btn btn-sm rounded-circle p-0 text-danger ${isDark ? "btn-outline-secondary" : "btn-light"}`,
												style: {
													width: "32px",
													height: "32px"
												},
												onClick: () => setDeleteTarget(dept),
												title: "Delete department",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faTrash,
													size: "xs"
												})
											})]
										})
									})
								] }, dept.id)) })]
							})
						})
					}),
					viewMode === "org" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationChart, {}),
					viewMode === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsDashboard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-12",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-4",
								children: "Advanced Management"
							})
						}), [
							{
								title: t("capacity_planning"),
								icon: faUsers,
								color: "#6366f1",
								desc: "Predict resource needs"
							},
							{
								title: t("workload_analysis"),
								icon: faChartLine,
								color: "#f43f5e",
								desc: "Monitor task distribution"
							},
							{
								title: t("budget_forecasting"),
								icon: faBuildingColumns,
								color: "#22c55e",
								desc: "Fiscal year projections"
							},
							{
								title: t("dept_benchmarking"),
								icon: faChartPie,
								color: "#0ea5e9",
								desc: "Compare internal KPIs"
							}
						].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-3 col-md-6 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm rounded-4 h-100 transition hover-lift cursor-pointer p-4 ${isDark ? "bg-dark-card" : "bg-white"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 p-3 text-white",
										style: { backgroundColor: item.color },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: item.icon })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-1",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: item.desc
									})] })]
								})
							})
						}, idx))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: showCreateModal,
				onHide: () => setShowCreateModal(false),
				title: t("create_department"),
				size: "large",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Department Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. Engineering",
									value: formName,
									onChange: (e) => setFormName(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Department Code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. ENG",
									value: formCode,
									onChange: (e) => setFormCode(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Head of Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. John Smith",
									value: formHead,
									onChange: (e) => setFormHead(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Budget ($)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. 500000",
									min: "0",
									step: "0.01",
									value: formBudget,
									onChange: (e) => setFormBudget(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. New York, Floor 5",
									value: formLocation,
									onChange: (e) => setFormLocation(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: `form-select rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									value: formStatus,
									onChange: (e) => setFormStatus(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inactive",
										children: "Inactive"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									rows: "2",
									placeholder: "Optional description...",
									value: formDesc,
									onChange: (e) => setFormDesc(e.target.value)
								})]
							}),
							submitError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "alert alert-danger py-2 small mb-0",
									children: submitError
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-end gap-2 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `btn rounded-pill px-4 py-2 border fw-semibold ${isDark ? "btn-outline-secondary" : "btn-light"}`,
							onClick: () => setShowCreateModal(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm",
							disabled: submitting || !formName.trim(),
							children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSpinner,
								spin: true,
								className: "me-2"
							}), "Creating..."] }) : "Create Department"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: showEditModal,
				onHide: () => {
					setShowEditModal(false);
					resetEditForm();
				},
				title: "Edit Department",
				size: "large",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleUpdate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Department Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. Engineering",
									value: editName,
									onChange: (e) => setEditName(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Department Code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. ENG",
									value: editCode,
									onChange: (e) => setEditCode(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Head of Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. John Smith",
									value: editHead,
									onChange: (e) => setEditHead(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Budget ($)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. 500000",
									min: "0",
									step: "0.01",
									value: editBudget,
									onChange: (e) => setEditBudget(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									placeholder: "e.g. New York, Floor 5",
									value: editLocation,
									onChange: (e) => setEditLocation(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: `form-select rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									value: editStatus,
									onChange: (e) => setEditStatus(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inactive",
										children: "Inactive"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark text-light" : "bg-light"} py-2`,
									rows: "2",
									placeholder: "Optional description...",
									value: editDesc,
									onChange: (e) => setEditDesc(e.target.value)
								})]
							}),
							submitError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "alert alert-danger py-2 small mb-0",
									children: submitError
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-end gap-2 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `btn rounded-pill px-4 py-2 border fw-semibold ${isDark ? "btn-outline-secondary" : "btn-light"}`,
							onClick: () => {
								setShowEditModal(false);
								resetEditForm();
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm",
							disabled: submitting || !editName.trim(),
							children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSpinner,
								spin: true,
								className: "me-2"
							}), "Updating..."] }) : "Update Department"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogBox, {
				show: deleteTarget !== null,
				onHide: () => setDeleteTarget(null),
				size: "small",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10",
							style: {
								width: "72px",
								height: "72px"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTrash,
								className: "text-danger fs-3"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-2",
							children: "Delete Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted small mb-0 px-3",
							children: [
								"Are you sure you want to delete ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deleteTarget?.name }),
								"? This action cannot be undone."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-3 mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `btn rounded-pill px-4 py-2 border fw-semibold flex-grow-1 ${isDark ? "btn-outline-secondary" : "btn-light"}`,
						onClick: () => setDeleteTarget(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-danger rounded-pill px-4 py-2 fw-semibold shadow-sm flex-grow-1",
						onClick: handleDelete,
						disabled: deleting,
						children: deleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faSpinner,
							spin: true,
							className: "me-2"
						}), "Deleting..."] }) : "Delete"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
        .btn-white { background-color: white; color: #334155; }
        .btn-white:hover { background-color: #f8fafc; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .department-card { border: 1px solid rgba(0,0,0,0.02) !important; }
        .btn-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .dark-mode .btn-white { background-color: #1e293b; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-white:hover { background-color: #334155; }
        .dark-mode .department-card { border-color: rgba(255,255,255,0.05) !important; }
        .dark-mode .table { color: #e2e8f0; }
        .dark-mode .table-hover tbody tr:hover { color: #f1f5f9; background-color: rgba(255,255,255,0.05); }
        .dark-mode .card { background-color: #1e293b; border-color: #334155; }
        .dark-mode .card-header { border-bottom-color: #334155; }
        .dark-mode .modal-content { background-color: #1e293b; color: #e2e8f0; }
        .dark-mode .form-control { background-color: #0f172a; color: #e2e8f0; border-color: #334155; }
        .dark-mode .form-select { background-color: #0f172a; color: #e2e8f0; border-color: #334155; }
        .dark-mode .input-group-text { color: #94a3b8; }
        .dark-mode .bg-light { background-color: #0f172a !important; }
        .dark-mode .bg-body-tertiary { background-color: #0f172a !important; }
        .dark-mode .border-bottom { border-bottom-color: #334155 !important; }
        .dark-mode .border-top { border-top-color: #334155 !important; }
        .dark-mode .border-secondary { border-color: #475569 !important; }
        .dark-mode .text-muted { color: #94a3b8 !important; }
        .dark-mode .btn-outline-secondary { color: #94a3b8; border-color: #475569; }
        .dark-mode .btn-outline-secondary:hover { background-color: #334155; color: #e2e8f0; }
        .dark-mode .bg-success-subtle { background-color: rgba(16,185,129,0.15) !important; }
        .dark-mode .text-success { color: #34d399 !important; }
        .dark-mode .bg-danger-subtle { background-color: rgba(239,68,68,0.15) !important; }
        .dark-mode .text-danger { color: #f87171 !important; }
        .dark-mode .btn-light { background-color: #334155; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-light:hover { background-color: #475569; }
        .dark-mode .alert-danger { background-color: rgba(239,68,68,0.15); color: #fca5a5; border-color: rgba(239,68,68,0.2); }
        .dark-mode .btn-group .btn-primary { background-color: #6366f1; border-color: #6366f1; }
        .dark-mode .org-connector-v, .dark-mode .org-connector-v-short, .dark-mode .org-connector-h { background-color: #475569 !important; }
        .dark-mode .progress { background-color: #334155; }
      ` } })
		]
	});
};
//#endregion
export { DepartmentManagement as default };
