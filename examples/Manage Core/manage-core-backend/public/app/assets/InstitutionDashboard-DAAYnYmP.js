import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, $t as faCheckCircle, Ct as faBuilding, Dl as require_jsx_runtime, Hl as LineElement, Il as BarElement, Kl as PointElement, Kt as faChalkboardTeacher, Pl as ArcElement, Rl as CategoryScale, Uc as faUserGraduate, Ul as LinearScale, Zl as index, bl as useApp, d as useTranslation, da as faLayerGroup, eu as plugin_title, ft as faBookOpen, jc as faUniversity, on as faCircle, or as faDoorOpen, p as Doughnut, ru as require_react, tu as plugin_tooltip, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
import { A as getEmsDashboard, V as listInstitutions } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Institution/InstitutionDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, plugin_title, plugin_tooltip, plugin_legend, ArcElement, index);
var InstitutionDashboard = () => {
	const { t } = useTranslation();
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [dashboard, setDashboard] = (0, import_react.useState)(null);
	const [institutions, setInstitutions] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const [dashRes, instRes] = await Promise.all([getEmsDashboard(), listInstitutions()]);
			setDashboard(dashRes);
			setInstitutions(Array.isArray(instRes) ? instRes : []);
		} catch (err) {
			console.error("Error loading EMS Dashboard", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const typeColors = {
		School: "#6366f1",
		College: "#10b981",
		University: "#f59e0b",
		Institute: "#ec4899",
		Academy: "#06b6d4",
		Other: "#6b7280"
	};
	const typeDistribution = {};
	institutions.forEach((inst) => {
		const t = inst.type || "Other";
		typeDistribution[t] = (typeDistribution[t] || 0) + 1;
	});
	const typeChartData = {
		labels: Object.keys(typeDistribution),
		datasets: [{
			data: Object.values(typeDistribution),
			backgroundColor: Object.keys(typeDistribution).map((k) => typeColors[k] || "#6b7280"),
			borderWidth: 0
		}]
	};
	const statusData = {
		labels: ["Active", "Inactive"],
		datasets: [{
			data: [institutions.filter((i) => i.status === "active").length, institutions.filter((i) => i.status !== "active").length],
			backgroundColor: ["#10b981", "#ef4444"],
			borderWidth: 0
		}]
	};
	const kpis = [
		{
			title: "Total Institutions",
			value: dashboard?.total_institutions ?? institutions.length,
			icon: faUniversity,
			color: "primary",
			sub: "All registered institutions"
		},
		{
			title: "Active",
			value: dashboard?.active_institutions ?? institutions.filter((i) => i.status === "active").length,
			icon: faCheckCircle,
			color: "success",
			sub: "Currently operating"
		},
		{
			title: "Inactive",
			value: dashboard?.inactive_institutions ?? institutions.filter((i) => i.status !== "active").length,
			icon: faCircle,
			color: "secondary",
			sub: "Non-operational"
		},
		{
			title: "Campuses",
			value: dashboard?.total_campuses ?? 0,
			icon: faBuilding,
			color: "info",
			sub: "Across all institutions"
		},
		{
			title: "Departments",
			value: dashboard?.total_departments ?? 0,
			icon: faLayerGroup,
			color: "warning",
			sub: "Academic departments"
		},
		{
			title: "Programs",
			value: dashboard?.total_programs ?? 0,
			icon: faBookOpen,
			color: "primary",
			sub: "Degree programs"
		},
		{
			title: "Buildings",
			value: dashboard?.total_buildings ?? 0,
			icon: faUniversity,
			color: "success",
			sub: "Campus infrastructure"
		},
		{
			title: "Rooms",
			value: dashboard?.total_rooms ?? 0,
			icon: faDoorOpen,
			color: "info",
			sub: "Classrooms & labs"
		},
		{
			title: "Students",
			value: dashboard?.total_students ?? 0,
			icon: faUserGraduate,
			color: "warning",
			sub: "Enrolled students"
		},
		{
			title: "Teachers",
			value: dashboard?.total_teachers ?? 0,
			icon: faChalkboardTeacher,
			color: "danger",
			sub: "Faculty members"
		}
	];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "skeleton-line w-25 mb-4",
				style: {
					height: "30px",
					borderRadius: "4px"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4",
				children: [
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-4 col-xl-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "140px",
							borderRadius: "18px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "skeleton-line w-50 mb-3",
								style: { height: "15px" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "skeleton-line w-75 mb-2",
								style: { height: "25px" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "skeleton-line w-25",
								style: { height: "10px" }
							})
						]
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row mt-4 g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "350px",
							borderRadius: "18px"
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "350px",
							borderRadius: "18px"
						}
					})
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-2 ${isDark ? "text-white bg-dark" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Institution Management Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Overview of all institutions, campuses, and academic entities"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: kpis.map((kpi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-4 col-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm h-100 hover-lift transition ${isDark ? "bg-dark border-1 border-secondary" : ""}`,
						style: { borderRadius: "18px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex justify-content-between align-items-start mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `p-3 rounded-3 bg-${kpi.color}-subtle text-${kpi.color}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: kpi.icon,
											size: "lg"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `small fw-bold text-uppercase mb-1 ${isDark ? "text-light opacity-75" : "text-muted"}`,
									children: kpi.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold mb-1",
									children: kpi.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: kpi.sub
								})
							]
						})
					})
				}, kpi.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-1",
								children: "Institution Types Distribution"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `small mb-4 ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: "Breakdown by institution category"
							}),
							Object.keys(typeDistribution).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-5 text-muted",
								children: "No data available"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center",
								style: { height: "280px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "position-relative",
									style: {
										width: "220px",
										height: "220px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: typeChartData,
										options: {
											responsive: true,
											maintainAspectRatio: false,
											cutout: "72%",
											plugins: {
												legend: { display: false },
												tooltip: { enabled: true }
											},
											elements: { arc: { borderRadius: 6 } }
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-absolute top-50 start-50 translate-middle text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h4 fw-bold mb-0 lh-1",
											children: institutions.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
											children: "Total"
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-wrap gap-3 mt-3 justify-content-center",
								children: Object.entries(typeDistribution).map(([type, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
											width: "10px",
											height: "10px",
											borderRadius: "50%",
											background: typeColors[type] || "#6b7280",
											display: "inline-block"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-semibold",
											children: type
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
											children: [
												"(",
												count,
												")"
											]
										})
									]
								}, type))
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-1",
								children: "Institution Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `small mb-4 ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: "Active vs Inactive"
							}),
							institutions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-5 text-muted",
								children: "No data available"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center",
								style: { height: "280px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "position-relative",
									style: {
										width: "220px",
										height: "220px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: statusData,
										options: {
											responsive: true,
											maintainAspectRatio: false,
											cutout: "72%",
											plugins: {
												legend: { display: false },
												tooltip: { enabled: true }
											},
											elements: { arc: { borderRadius: 6 } }
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-absolute top-50 start-50 translate-middle text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h4 fw-bold mb-0 lh-1",
											children: institutions.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
											children: "Total"
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-center gap-4 mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-success rounded-pill",
										style: {
											width: "10px",
											height: "10px"
										},
										children: "\xA0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "small fw-semibold",
										children: [
											"Active (",
											institutions.filter((i) => i.status === "active").length,
											")"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-danger rounded-pill",
										style: {
											width: "10px",
											height: "10px"
										},
										children: "\xA0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "small fw-semibold",
										children: [
											"Inactive (",
											institutions.filter((i) => i.status !== "active").length,
											")"
										]
									})]
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					children: "Institutions List"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Founded" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: institutions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "5",
							className: "text-center py-5 text-muted",
							children: "No institutions found"
						}) }) : institutions.slice(0, 10).map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "fw-semibold",
								children: inst.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: inst.code }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-primary-subtle text-primary rounded-pill",
								children: inst.type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${inst.status === "active" ? "success" : "secondary"}-subtle text-${inst.status === "active" ? "success" : "secondary"}`,
								children: inst.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: inst.founded_date || "-"
							})
						] }, inst.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important; }
        .transition { transition: all 0.2s ease-in-out; }
        .x-small { font-size: 11px; }
        .skeleton-card { background-color: ${isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"}; }
        .skeleton-line { background-color: ${isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      ` })
		]
	});
};
//#endregion
export { InstitutionDashboard as default };
