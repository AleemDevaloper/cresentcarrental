import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cn as faClock, Dl as require_jsx_runtime, I as faArrowRight, Yt as faChartLine, Zn as faDatabase, bl as useApp, gs as faShieldHalved, ru as require_react, sn as faCircleCheck, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { G as getIcon, Xr as readFeatureRecords } from "./fms-BQz62Xux.js";
import { D as getFeatureGroups, w as flattenFeatures } from "./pms-CfRqXdhw.js";
//#region src/pages/systems/common/SystemDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var systemCopy = {
	pms: {
		title: "PMS Dashboard",
		subtitle: "Project delivery cockpit for cost, budget, progress, resources, agile boards, reports, and recovery.",
		gradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
	},
	fms: {
		title: "FMS Dashboard",
		subtitle: "Finance command center for billing, expenses, budgets, payroll, compliance, reports, and risk.",
		gradient: "linear-gradient(135deg, #0f766e 0%, #22c55e 100%)"
	},
	hrms: {
		title: "HRMS Dashboard",
		subtitle: "People operations dashboard for attendance, sites, shifts, hierarchy, import, and employee records.",
		gradient: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)"
	},
	tms: {
		title: "TMS Dashboard",
		subtitle: "Task productivity dashboard for reports, planner, focus mode, OKRs, analytics, and recovery.",
		gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
	},
	dms: {
		title: "DMS Dashboard",
		subtitle: "Secure cloud repository for enterprise document versioning, archival, and sharing.",
		gradient: "linear-gradient(135deg, #db2777 0%, #f472b6 100%)"
	},
	crm: {
		title: "CRM Dashboard",
		subtitle: "360-degree customer insights, lead tracking, and sales pipeline management.",
		gradient: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)"
	}
};
var MetricCard = ({ icon, label, value, help }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "card border-0 rounded-4 h-100 system-metric-card",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-body p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "system-metric-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "badge bg-success-subtle text-success rounded-pill",
					children: "Live"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "fw-bold mb-1",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				className: "fw-bold text-muted mb-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted small mb-0",
				children: help
			})
		]
	})
});
var SystemDashboard = ({ system = "pms", projects = [] }) => {
	const { setActiveTab } = useApp();
	const copy = systemCopy[system] || systemCopy.pms;
	const features = flattenFeatures(system);
	const groups = getFeatureGroups(system);
	const stats = (0, import_react.useMemo)(() => {
		const records = features.flatMap((feature) => readFeatureRecords(system, feature.id));
		return {
			total: records.length,
			completed: records.filter((record) => ["Completed", "Approved"].includes(record.status)).length,
			due: records.filter((record) => record.dueDate).length,
			amount: records.reduce((sum, record) => sum + (Number(record.amount) || 0), 0)
		};
	}, [features, system]);
	const heroProgress = stats.total ? Math.round(stats.completed / stats.total * 100) : 72;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "system-dashboard px-3 px-lg-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "system-dashboard-hero rounded-5 p-4 p-xl-5 mb-4",
				style: { background: copy.gradient },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row align-items-center g-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-xl-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-white text-primary rounded-pill px-3 py-2 mb-3 fw-bold",
								children: "ENTERPRISE MODULE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-white fw-bold mb-2",
								children: copy.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-white-50 mb-4 fs-6",
								children: copy.subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-wrap gap-2",
								children: features.slice(0, 4).map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-light rounded-pill px-3 fw-semibold",
									onClick: () => setActiveTab(feature.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: getIcon(feature.icon),
										className: "me-2"
									}), feature.label]
								}, feature.id))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "system-hero-glass rounded-4 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between text-white-50 small mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Operational readiness" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [heroProgress, "%"] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress rounded-pill mb-4",
									style: { height: 10 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar bg-white",
										style: { width: `${heroProgress}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "glass-number",
												children: features.length
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "glass-label",
												children: "Features"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "glass-number",
												children: groups.length
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "glass-label",
												children: "Groups"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "glass-number",
												children: stats.total
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "glass-label",
												children: "Records"
											})]
										})
									]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faDatabase,
							label: "Working Records",
							value: stats.total,
							help: "Records saved in this browser."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faCircleCheck,
							label: "Closed Items",
							value: stats.completed,
							help: "Completed or approved workflow items."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faClock,
							label: "Dated Items",
							value: stats.due,
							help: "Items with a target date."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faChartLine,
							label: "Tracked Value",
							value: stats.amount.toLocaleString(),
							help: "Total amount/budget in feature records."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 h-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-between mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-1",
									children: "Feature Launchpad"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted small mb-0",
									children: "Every card opens a working frontend register with CRUD, filters, exports, and recovery."
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-3",
								children: features.slice(0, 12).map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "feature-launch-card w-100 text-start",
										onClick: () => setActiveTab(feature.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "feature-launch-icon",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: getIcon(feature.icon) })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-grow-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "fw-bold mb-1",
														children: feature.label
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faArrowRight,
														className: "text-primary mt-1"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted small mb-0",
													children: feature.description
												})]
											})]
										})
									})
								}, feature.id))
							})]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 h-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "feature-launch-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faShieldHalved })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "fw-bold mb-0",
										children: "System Controls"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: "Professional UI/UX readiness checklist."
									})] })]
								}),
								[
									"Dark mode compatible cards",
									"Mobile responsive layout",
									"CRUD working registers",
									"CSV/JSON/SQL exports",
									"PDF print view",
									"Backup and restore workflow"
								].map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 p-3 rounded-4 border mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-primary rounded-pill",
										children: index + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item
									})]
								}, item)),
								system === "pms" && projects?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-top",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-3",
										children: "Existing Projects"
									}), projects.slice(0, 4).map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between small mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: project.status || "Active"
										})]
									}, project.id || project.name))]
								})
							]
						})
					})
				})]
			})
		]
	});
};
//#endregion
export { SystemDashboard as default };
