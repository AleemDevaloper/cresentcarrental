import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $c as faUserTie, Br as faFileExport, Ci as faGraduationCap, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Es as faSitemap, Fs as faSpinner, Na as faMicrochip, Q as faAward, Qo as faRoute, W as faArrowTrendUp, Xi as faIdBadge, Xs as faTable, Xt as faChartPie, _c as faTrash, b as DialogBox, bl as useApp, d as useTranslation, da as faLayerGroup, f as Bar, g as Radar, ll as faWallet, oo as faPen, os as faSearch, p as Doughnut, qo as faRobot, ru as require_react, sc as faThLarge, ti as faFilter, tl as faUsers, tr as faDiagramProject, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { Et as deleteDesignation, Ft as updateDesignation, Mt as listDesignations, jt as listDepartments, wt as createDesignation } from "./hrms-DLGg_3y5.js";
//#region src/pages/organization/designations/DesignationManagement.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DESIGNATION_COLORS = [
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
var DesignationManagement = () => {
	const { t } = useTranslation();
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [viewMode, setViewMode] = (0, import_react.useState)("table");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [designations, setDesignations] = (0, import_react.useState)([]);
	const [departments, setDepartments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [showFormModal, setShowFormModal] = (0, import_react.useState)(false);
	const [editingDesignation, setEditingDesignation] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formDeptId, setFormDeptId] = (0, import_react.useState)("");
	const [formLevel, setFormLevel] = (0, import_react.useState)("");
	const [formSalaryBand, setFormSalaryBand] = (0, import_react.useState)("");
	const [formScore, setFormScore] = (0, import_react.useState)("");
	const [formReportsTo, setFormReportsTo] = (0, import_react.useState)("");
	const [formDesc, setFormDesc] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [submitError, setSubmitError] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const [desigs, depts] = await Promise.all([listDesignations(), listDepartments()]);
			setDesignations(desigs);
			setDepartments(depts);
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
		setFormDeptId("");
		setFormLevel("");
		setFormSalaryBand("");
		setFormScore("");
		setFormReportsTo("");
		setFormDesc("");
		setSubmitError(null);
		setEditingDesignation(null);
	};
	const openCreateModal = () => {
		resetForm();
		setShowFormModal(true);
	};
	const openEditModal = (desig) => {
		setEditingDesignation(desig);
		setFormName(desig.name || "");
		setFormDeptId(desig.department_id || "");
		setFormLevel(desig.level || "");
		setFormSalaryBand(desig.salary_band || "");
		setFormScore(desig.performance_score != null ? String(desig.performance_score) : "");
		setFormReportsTo(desig.reports_to || "");
		setFormDesc(desig.description || "");
		setSubmitError(null);
		setShowFormModal(true);
	};
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (!formName.trim() || !formDeptId) return;
		setSubmitting(true);
		setSubmitError(null);
		try {
			const payload = {
				name: formName.trim(),
				level: formLevel.trim() || null,
				salary_band: formSalaryBand.trim() || null,
				performance_score: formScore ? parseInt(formScore, 10) : null,
				reports_to: formReportsTo.trim() || null,
				description: formDesc.trim() || null
			};
			if (editingDesignation) await updateDesignation(editingDesignation.id, payload);
			else await createDesignation(formDeptId, payload);
			setShowFormModal(false);
			resetForm();
			await fetchData();
		} catch (err) {
			setSubmitError(err.message || "Failed to save designation");
		} finally {
			setSubmitting(false);
		}
	};
	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			await deleteDesignation(deleteTarget.id);
			setDeleteTarget(null);
			await fetchData();
		} catch (err) {
			setSubmitError(err.message || "Failed to delete designation");
		} finally {
			setDeleting(false);
		}
	};
	const filteredDesignations = designations.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.department_name && d.department_name.toLowerCase().includes(searchTerm.toLowerCase()) || d.level && d.level.toLowerCase().includes(searchTerm.toLowerCase()));
	const getColor = (idx) => DESIGNATION_COLORS[idx % DESIGNATION_COLORS.length];
	const handleExportCSV = () => {
		const headers = [
			"Designation Name",
			"Department",
			"Level",
			"Salary Band",
			"Performance Score",
			"Reports To",
			"Description"
		];
		const rows = designations.map((d) => [
			d.name,
			d.department_name || "",
			d.level || "",
			d.salary_band || "",
			d.performance_score != null ? d.performance_score : "",
			d.reports_to || "",
			d.description || ""
		]);
		const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `designations_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(link.href);
	};
	const totalDesignations = designations.length;
	const KPISection = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "row g-4 mb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-3 col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? "bg-dark-card" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 p-3 d-flex align-items-center justify-content-center me-3",
								style: {
									backgroundColor: "#3b82f615",
									color: "#3b82f6"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faIdBadge,
									className: "fs-4"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0 fw-medium",
								children: t("total_designations")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "fw-bold mb-0",
								children: totalDesignations
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						height: "4px",
						backgroundColor: "#3b82f6",
						width: "100%",
						position: "absolute",
						bottom: 0
					} })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-3 col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? "bg-dark-card" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 p-3 d-flex align-items-center justify-content-center me-3",
								style: {
									backgroundColor: "#8b5cf615",
									color: "#8b5cf6"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBuilding,
									className: "fs-4"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0 fw-medium",
								children: "Departments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "fw-bold mb-0",
								children: departments.length
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						height: "4px",
						backgroundColor: "#8b5cf6",
						width: "100%",
						position: "absolute",
						bottom: 0
					} })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-3 col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? "bg-dark-card" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 p-3 d-flex align-items-center justify-content-center me-3",
								style: {
									backgroundColor: "#10b98115",
									color: "#10b981"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faLayerGroup,
									className: "fs-4"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0 fw-medium",
								children: "Avg per Dept"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "fw-bold mb-0",
								children: departments.length ? (totalDesignations / departments.length).toFixed(1) : "0"
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						height: "4px",
						backgroundColor: "#10b981",
						width: "100%",
						position: "absolute",
						bottom: 0
					} })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-3 col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? "bg-dark-card" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 p-3 d-flex align-items-center justify-content-center me-3",
								style: {
									backgroundColor: "#f59e0b15",
									color: "#f59e0b"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUsers,
									className: "fs-4"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0 fw-medium",
								children: "Active Depts"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "fw-bold mb-0",
								children: departments.length
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						height: "4px",
						backgroundColor: "#f59e0b",
						width: "100%",
						position: "absolute",
						bottom: 0
					} })]
				})
			})
		]
	});
	const CareerPathView = () => {
		const steps = [
			{
				title: "Junior Developer",
				level: "L1",
				icon: faGraduationCap,
				color: "#94a3b8"
			},
			{
				title: "Software Engineer",
				level: "L2",
				icon: faMicrochip,
				color: "#64748b"
			},
			{
				title: "Senior Software Engineer",
				level: "L3",
				icon: faAward,
				color: "#3b82f6",
				current: true
			},
			{
				title: "Lead Engineer",
				level: "L4",
				icon: faLayerGroup,
				color: "#8b5cf6"
			},
			{
				title: "Engineering Manager",
				level: "L5",
				icon: faUserTie,
				color: "#ec4899"
			},
			{
				title: "Director of Engineering",
				level: "L6",
				icon: faBuilding,
				color: "#ef4444"
			}
		];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fade-in py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 shadow-sm rounded-4 p-5 ${isDark ? "bg-dark-card" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "fw-bold mb-5 text-center",
						children: "Standard Engineering Career Progression"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "career-path-container position-relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "career-path-line" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex justify-content-between align-items-center position-relative z-1",
							children: steps.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "career-step text-center px-2",
								style: { width: `${100 / steps.length}%` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `career-icon-wrapper mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center shadow-sm transition ${step.current ? "ring-active" : ""}`,
										style: {
											width: "64px",
											height: "64px",
											backgroundColor: step.current ? step.color : isDark ? "#334155" : "white",
											color: step.current ? "white" : step.color,
											border: `2px solid ${step.color}`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: step.icon,
											className: "fs-4"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: `fw-bold mb-1 ${step.current ? "text-primary" : ""}`,
										children: step.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge ${isDark ? "bg-dark" : "bg-light"} text-muted rounded-pill`,
										children: step.level
									}),
									step.current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-primary rounded-pill small px-3",
											children: "Current Target"
										})
									})
								]
							}, idx))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark-card" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-4",
									children: "Competency Mapping (L3 → L4)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-medium",
											children: "System Architecture"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small text-primary fw-bold",
											children: "85%"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress",
										style: { height: "6px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress-bar bg-primary",
											style: { width: "85%" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-medium",
											children: "Team Mentorship"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small text-primary fw-bold",
											children: "60%"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress",
										style: { height: "6px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress-bar bg-primary",
											style: { width: "60%" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-medium",
											children: "Strategic Vision"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small text-primary fw-bold",
											children: "45%"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress",
										style: { height: "6px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress-bar bg-primary",
											style: { width: "45%" }
										})
									})]
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `${isDark ? "bg-dark-card" : "bg-white"} bg-opacity-20 rounded-circle p-3`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faRobot,
											className: "fs-3"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-0",
										children: "AI Career Recommendation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "small mb-0 opacity-75",
										children: "Personalized Growth Path"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "small mb-4",
									children: [
										"Based on your performance in the last 3 quarters, we recommend focusing on ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Technical Leadership" }),
										" and ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cross-team Collaboration" }),
										" to accelerate your move to L4 Lead Engineer."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn ${isDark ? "btn-outline-secondary" : "btn-white"} btn-sm rounded-3 fw-bold px-4 py-2 border-0 shadow-sm`,
									children: "Explore Training"
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
                .career-path-container { min-height: 150px; }
                .career-path-line { 
                    position: absolute; 
                    top: 32px; 
                    left: 5%; 
                    right: 5%; 
                    height: 2px; 
                    background: ${isDark ? "#334155" : "#e2e8f0"}; 
                    z-index: 0;
                }
                .career-icon-wrapper { position: relative; z-index: 1; }
                .ring-active { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); }
                .btn-white { background: white; color: var(--bs-primary); }
            ` } })
			]
		});
	};
	const AnalyticsDashboard = () => {
		const deptLabels = departments.map((d) => d.name);
		const deptCounts = departments.map((d) => d.designations ? d.designations.length : 0);
		const doughnutData = {
			labels: deptLabels.length ? deptLabels : ["No Data"],
			datasets: [{
				data: deptCounts.length ? deptCounts : [1],
				backgroundColor: [
					"#3b82f6",
					"#ec4899",
					"#10b981",
					"#8b5cf6",
					"#f59e0b",
					"#06b6d4",
					"#6366f1",
					"#ef4444",
					"#14b8a6",
					"#f97316"
				],
				borderWidth: 0,
				hoverOffset: 15
			}]
		};
		const barData = {
			labels: deptLabels.length ? deptLabels : ["No Data"],
			datasets: [{
				label: "Designations",
				data: deptCounts.length ? deptCounts : [0],
				backgroundColor: "#3b82f6",
				borderRadius: 8,
				barThickness: 30
			}]
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fade-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark-card" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-4",
								children: "Designations by Department"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center",
								style: { minHeight: "300px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
									data: doughnutData,
									options: {
										maintainAspectRatio: false,
										plugins: { legend: { position: "bottom" } }
									}
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark-card" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-4",
								children: "Designations per Dept"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center",
								style: { minHeight: "300px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: barData,
									options: {
										maintainAspectRatio: false,
										indexAxis: "y",
										plugins: { legend: { display: false } }
									}
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark-card" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-4",
								children: "Competency Benchmark"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center",
								style: { minHeight: "300px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
									data: {
										labels: [
											"Leadership",
											"Technical Skill",
											"Execution",
											"Culture Fit",
											"Innovation",
											"Collaboration"
										],
										datasets: [{
											label: "Enterprise Avg",
											data: [
												75,
												82,
												88,
												92,
												78,
												85
											],
											backgroundColor: "rgba(59, 130, 246, 0.2)",
											borderColor: "#3b82f6",
											borderWidth: 2,
											pointBackgroundColor: "#3b82f6"
										}]
									},
									options: { maintainAspectRatio: false }
								})
							})]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4 p-4 overflow-hidden position-relative",
						style: { backgroundColor: "#0f172a" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row align-items-center position-relative z-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-lg-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "text-white fw-bold mb-2",
										children: "Workforce Planning & Vacancy Analysis"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-light opacity-75 mb-4",
										children: [
											"Track your organization's designation structure across ",
											departments.length,
											" departments with ",
											totalDesignations,
											" total roles defined."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-primary rounded-3 px-4 py-2 fw-bold border-0",
											children: "Succession Plan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-outline-light rounded-3 px-4 py-2 fw-bold opacity-75",
											children: "Download Report"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-lg-4 text-center d-none d-lg-block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faDiagramProject,
									className: "text-primary opacity-25",
									style: { fontSize: "180px" }
								})
							})]
						})
					})
				})
			})]
		});
	};
	const HierarchyView = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fade-in py-5 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "org-tree mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "node mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `card border-0 shadow-sm rounded-4 p-3 d-inline-block shadow-active ${isDark ? "bg-dark-card" : ""}`,
					style: {
						minWidth: "220px",
						borderLeft: "4px solid #0f172a"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `rounded-circle ${isDark ? "bg-dark" : "bg-light"} p-2`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserTie,
								className: `${isDark ? "text-light" : "text-dark"}`
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-0",
								children: "CEO"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0",
								children: "Level E1"
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "connector-v" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-center gap-5 position-relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "connector-h",
						style: {
							left: "25%",
							right: "25%"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "branch",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "connector-v-short" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm rounded-4 p-3 d-inline-block ${isDark ? "bg-dark-card" : ""}`,
								style: {
									minWidth: "200px",
									borderLeft: "4px solid #3b82f6"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle bg-primary bg-opacity-10 p-2 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMicrochip })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "fw-bold mb-0",
											children: "CTO"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted small mb-0",
											children: "Level E2"
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "connector-v" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm rounded-4 p-3 d-inline-block ${isDark ? "bg-dark-card" : ""}`,
								style: {
									minWidth: "200px",
									borderLeft: "4px solid #60a5fa"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center gap-2 text-start",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-0 small",
										children: "Engineering Director"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: "Level M3"
									})] })
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "branch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "connector-v-short" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 p-3 d-inline-block ${isDark ? "bg-dark-card" : ""}`,
							style: {
								minWidth: "200px",
								borderLeft: "4px solid #ec4899"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-circle bg-pink bg-opacity-10 p-2 text-pink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUsers })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-0",
										children: "COO"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: "Level E2"
									})]
								})]
							})
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
            .connector-v { width: 2px; height: 40px; background: ${isDark ? "#475569" : "#cbd5e1"}; margin: 0 auto; }
            .connector-v-short { width: 2px; height: 25px; background: ${isDark ? "#475569" : "#cbd5e1"}; margin: 0 auto; }
            .connector-h { position: absolute; top: 0; height: 2px; background: ${isDark ? "#475569" : "#cbd5e1"}; }
            .shadow-active { box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1) !important; }
            .text-pink { color: #ec4899; }
            .bg-pink { background-color: #ec4899; }
        ` } })]
	});
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
				children: "Loading designations..."
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
		className: `designation-mgmt-page ${isDark ? "dark-mode" : ""}`,
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
							className: "col-lg-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: `fw-bold ${isDark ? "text-light" : "text-dark"} mb-1`,
								children: t("designations")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted mb-0",
								children: t("designation_mgmt_desc")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-lg-5 mt-3 mt-lg-0 text-lg-end",
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
									onClick: openCreateModal,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPlus,
										className: "me-2"
									}), t("create_designation")]
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPISection, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 mb-4 ${isDark ? "bg-dark-card" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row align-items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4 mb-3 mb-md-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `input-group ${isDark ? "bg-dark" : "bg-light"} rounded-3 px-3 border-0`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text bg-transparent border-0 text-muted ps-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control bg-transparent border-0 small py-2",
											placeholder: "Search by role, level or dept...",
											value: searchTerm,
											onChange: (e) => setSearchTerm(e.target.value)
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
													className: `btn px-3 border-0 transition ${viewMode === "table" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("table"),
													title: t("table_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTable })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "card" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("card"),
													title: t("grid_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faThLarge })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "hierarchy" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("hierarchy"),
													title: t("hierarchy_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSitemap })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "career" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("career"),
													title: t("career_path_view"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRoute })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: `btn px-3 border-0 transition ${viewMode === "analytics" ? "btn-primary" : isDark ? "btn-outline-secondary" : "btn-white"}`,
													onClick: () => setViewMode("analytics"),
													title: t("role_analytics"),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChartPie })
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: `btn ${isDark ? "btn-outline-secondary" : "btn-white"} border px-3 rounded-3 transition`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilter,
												className: "me-2 text-muted"
											}), "Advanced Filters"]
										})]
									})
								})]
							})
						})
					}),
					viewMode === "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 overflow-hidden fade-in ${isDark ? "bg-dark-card" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0 border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: isDark ? "bg-dark-header" : "bg-light",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4 py-3 border-0 text-muted small text-uppercase fw-bold",
											children: t("dept_name")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-muted small text-uppercase fw-bold",
											children: "Department"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-muted small text-uppercase fw-bold text-center",
											children: t("career_level")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-muted small text-uppercase fw-bold text-center",
											children: t("employees")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-muted small text-uppercase fw-bold",
											children: t("salary_band")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 border-0 text-muted small text-uppercase fw-bold",
											children: t("performance_score")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pe-4 py-3 border-0 text-end text-muted small text-uppercase fw-bold",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredDesignations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5 text-muted",
									children: searchTerm ? "No designations match your search." : "No designations yet. Click \"Create Designation\" to add one."
								}) }) : filteredDesignations.map((d, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "ps-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-3 d-flex align-items-center justify-content-center me-3",
												style: {
													backgroundColor: `${getColor(idx)}15`,
													color: getColor(idx),
													width: "36px",
													height: "36px"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faIdBadge,
													size: "sm"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `fw-bold ${isDark ? "text-light" : "text-dark"}`,
												children: d.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 small fw-medium text-muted",
										children: d.department_name || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge ${isDark ? "bg-dark" : "bg-light"} ${isDark ? "text-light" : "text-dark"} rounded-pill ${isDark ? "border-secondary" : "border"}`,
											children: d.level || "—"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											children: d.employees_count || 0
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted small fw-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faWallet,
												className: "me-2 opacity-50"
											}), d.salary_band || "—"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center",
											style: { minWidth: "120px" },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "small fw-bold me-2",
												children: [d.performance_score ?? "—", d.performance_score ? "%" : ""]
											}), d.performance_score != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress flex-grow-1",
												style: { height: "4px" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "progress-bar",
													style: {
														width: `${d.performance_score}%`,
														backgroundColor: getColor(idx)
													}
												})
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "pe-4 py-3 text-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1 justify-content-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: `btn ${isDark ? "btn-outline-secondary" : "btn-light"} btn-sm rounded-circle p-0 text-primary`,
												style: {
													width: "32px",
													height: "32px"
												},
												onClick: () => openEditModal(d),
												title: "Edit designation",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faPen,
													size: "xs"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: `btn ${isDark ? "btn-outline-secondary" : "btn-light"} btn-sm rounded-circle p-0 text-danger`,
												style: {
													width: "32px",
													height: "32px"
												},
												onClick: () => setDeleteTarget(d),
												title: "Delete designation",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faTrash,
													size: "xs"
												})
											})]
										})
									})
								] }, d.id)) })]
							})
						})
					}),
					viewMode === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-4 fade-in",
						children: filteredDesignations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-12 text-center py-5 text-muted",
							children: searchTerm ? "No designations match your search." : "No designations yet."
						}) : filteredDesignations.map((d, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
													icon: faIdBadge,
													className: "fs-4"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge rounded-pill px-3 d-flex align-items-center ${isDark ? 'bg-success-subtle' : 'bg-success-subtle text-success'}",
												children: "Active"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "fw-bold mb-1",
											children: d.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted small mb-4",
											children: [
												d.department_name || "—",
												" ",
												d.level ? `\u2022 Level ${d.level}` : ""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "row g-3 py-3 border-top border-bottom mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted small mb-1",
													children: "Reports To"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "fw-bold small mb-0",
													children: d.reports_to || "—"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted small mb-1",
													children: "Salary Band"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "fw-bold small mb-0",
													children: d.salary_band || "—"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center justify-content-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faUsers,
													className: "text-muted"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "fw-bold",
													children: [
														d.employees_count || 0,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
															className: "text-muted fw-normal",
															children: "Employees"
														})
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn p-0 text-primary fw-bold small d-flex align-items-center gap-1",
													onClick: () => openEditModal(d),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPen }), " Edit"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn p-0 text-danger fw-bold small d-flex align-items-center gap-1",
													onClick: () => setDeleteTarget(d),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash }), " Delete"]
												})]
											})]
										})
									]
								})
							})
						}, d.id))
					}),
					viewMode === "hierarchy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HierarchyView, {}),
					viewMode === "career" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareerPathView, {}),
					viewMode === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsDashboard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-12",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-4",
								children: "Workforce Architecture Framework"
							})
						}), [
							{
								title: t("job_architecture"),
								icon: faDiagramProject,
								color: "#475569",
								desc: "Enterprise role structures"
							},
							{
								title: t("competency_mapping"),
								icon: faAward,
								color: "#6366f1",
								desc: "Skill frameworks & assessment"
							},
							{
								title: t("salary_band_mgmt"),
								icon: faWallet,
								color: "#10b981",
								desc: "Compensation equity planning"
							},
							{
								title: t("promotion_matrix"),
								icon: faArrowTrendUp,
								color: "#ec4899",
								desc: "Merit-based progression rules"
							}
						].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-3 col-md-6 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm rounded-4 p-4 h-100 transition hover-lift cursor-pointer ${isDark ? "bg-dark-card" : "bg-white"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 p-3 text-white shadow-sm",
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
				show: showFormModal,
				onHide: () => {
					setShowFormModal(false);
					resetForm();
				},
				title: editingDesignation ? "Edit Designation" : t("create_designation"),
				size: "large",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleFormSubmit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Designation Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									placeholder: "e.g. Senior Software Engineer",
									value: formName,
									onChange: (e) => setFormName(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: `form-select rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									value: formDeptId,
									onChange: (e) => setFormDeptId(e.target.value),
									required: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Department"
									}), departments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: dept.id,
										children: dept.name
									}, dept.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: `form-select rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									value: formLevel,
									onChange: (e) => setFormLevel(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Level"
									}), [
										"L1",
										"L2",
										"L3",
										"L4",
										"L5",
										"L6",
										"E1",
										"E2",
										"E3",
										"M1",
										"M2",
										"M3"
									].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: l,
										children: l
									}, l))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Salary Band"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									placeholder: "e.g. $85k – $120k",
									value: formSalaryBand,
									onChange: (e) => setFormSalaryBand(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Performance Score"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									placeholder: "0-100",
									min: "0",
									max: "100",
									value: formScore,
									onChange: (e) => setFormScore(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Reports To"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									placeholder: "e.g. Engineering Manager",
									value: formReportsTo,
									onChange: (e) => setFormReportsTo(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Employees Count"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
									placeholder: "Auto-calculated",
									disabled: true,
									value: 0
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted text-uppercase mb-1",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: `form-control rounded-3 border-0 ${isDark ? "bg-dark" : "bg-light"} py-2`,
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
							className: `btn ${isDark ? "btn-outline-secondary" : "btn-light"} rounded-pill px-4 py-2 border fw-semibold`,
							onClick: () => {
								setShowFormModal(false);
								resetForm();
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm",
							disabled: submitting || !formName.trim() || !formDeptId,
							children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSpinner,
								spin: true,
								className: "me-2"
							}), editingDesignation ? "Updating..." : "Creating..."] }) : editingDesignation ? "Update Designation" : "Create Designation"
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
							children: "Delete Designation"
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
						className: `btn ${isDark ? "btn-outline-secondary" : "btn-light"} rounded-pill px-4 py-2 border fw-semibold flex-grow-1`,
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
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
        .hover-gap { transition: gap 0.2s ease; }
        .hover-gap:hover { gap: 12px !important; }
        .btn-white { background: white; color: #334155; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dark-mode .card { background-color: #1e293b; border-color: #334155; }
        .dark-mode .card-header { border-bottom-color: #334155; }
        .dark-mode .table { color: #e2e8f0; }
        .dark-mode .table-hover tbody tr:hover { color: #f1f5f9; background-color: rgba(255,255,255,0.05); }
        .dark-mode .table td, .dark-mode .table th { border-color: #334155; }
        .dark-mode .form-control { background-color: #0f172a !important; color: #e2e8f0 !important; border-color: #334155; }
        .dark-mode .form-select { background-color: #0f172a !important; color: #e2e8f0 !important; border-color: #334155; }
        .dark-mode .modal-content { background-color: #1e293b; color: #e2e8f0; }
        .dark-mode .btn-light { background-color: #334155; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-light:hover { background-color: #475569; }
        .dark-mode .btn-outline-secondary { color: #94a3b8; border-color: #475569; }
        .dark-mode .btn-outline-secondary:hover { background-color: #334155; color: #e2e8f0; }
        .dark-mode .text-muted { color: #94a3b8 !important; }
        .dark-mode .border-bottom { border-bottom-color: #334155 !important; }
        .dark-mode .border-top { border-top-color: #334155 !important; }
        .dark-mode .border-secondary { border-color: #475569 !important; }
        .dark-mode .bg-light { background-color: #0f172a !important; }
        .dark-mode .bg-dark { background-color: #0f172a !important; }
        .dark-mode .bg-success-subtle { background-color: rgba(16,185,129,0.15) !important; }
        .dark-mode .btn-white { background-color: #1e293b; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-white:hover { background-color: #334155; }
        .dark-mode .progress { background-color: #334155; }
        .dark-mode .shadow-active { box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important; }
        .dark-mode .career-path-line { background: #334155; }
        .dark-mode .connector-v, .dark-mode .connector-v-short, .dark-mode .connector-h { background: #475569 !important; }
      ` } })
		]
	});
};
//#endregion
export { DesignationManagement as default };
