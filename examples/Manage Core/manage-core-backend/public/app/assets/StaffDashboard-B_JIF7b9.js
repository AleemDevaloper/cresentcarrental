import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $c as faUserTie, $l as plugin_legend, At as faCake, Dl as require_jsx_runtime, G as faArrowUp, Hl as LineElement, Il as BarElement, Jc as faUserPlus, Kl as PointElement, Kt as faChalkboardTeacher, Pl as ArcElement, Rc as faUserCheck, Rl as CategoryScale, Ul as LinearScale, Zl as index, bi as faGift, bl as useApp, bt as faBriefcase, d as useTranslation, da as faLayerGroup, eu as plugin_title, f as Bar, m as Line, p as Doughnut, ru as require_react, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, zc as faUserClock, zl as Chart } from "./ai-BHgPkVLC.js";
import { j as getStaffDashboard } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Staff/StaffDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, plugin_title, plugin_tooltip, plugin_legend, ArcElement, index);
var StaffDashboard = () => {
	const { t } = useTranslation();
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [dashboard, setDashboard] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			setDashboard(await getStaffDashboard() || {});
		} catch (err) {
			setError(err.message);
			setDashboard(null);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const d = dashboard || {};
	const kpis = [
		{
			title: "Total Employees",
			value: d.total_employees ?? 250,
			icon: faUsers,
			color: "primary",
			sub: "All staff members"
		},
		{
			title: "Teachers",
			value: d.teachers ?? 120,
			icon: faChalkboardTeacher,
			color: "success",
			sub: "Faculty members"
		},
		{
			title: "Non-Teaching",
			value: d.non_teaching ?? 80,
			icon: faUserTie,
			color: "info",
			sub: "Support staff"
		},
		{
			title: "Active",
			value: d.active ?? 220,
			icon: faUserCheck,
			color: "success",
			sub: "Currently employed"
		},
		{
			title: "On Leave",
			value: d.on_leave ?? 12,
			icon: faUserClock,
			color: "warning",
			sub: "On leave today"
		},
		{
			title: "Departments",
			value: d.departments ?? 15,
			icon: faLayerGroup,
			color: "info",
			sub: "Academic departments"
		},
		{
			title: "Open Vacancies",
			value: d.open_vacancies ?? 8,
			icon: faBriefcase,
			color: "danger",
			sub: "Positions to fill"
		}
	];
	const staffData = {
		labels: ["Teachers", "Non-Teaching"],
		datasets: [{
			data: [d.teachers ?? 120, d.non_teaching ?? 80],
			backgroundColor: ["#6366f1", "#10b981"],
			borderWidth: 0
		}]
	};
	const deptData = {
		labels: d.department_wise?.labels || [
			"CS",
			"Math",
			"Science",
			"Arts",
			"Admin"
		],
		datasets: [{
			label: "Staff",
			data: d.department_wise?.data || [
				30,
				25,
				20,
				15,
				10
			],
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#ec4899",
				"#06b6d4"
			],
			borderRadius: 6
		}]
	};
	const attTrendData = {
		labels: d.attendance_trend?.labels || [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri"
		],
		datasets: [{
			label: "Attendance %",
			data: d.attendance_trend?.data || [
				96,
				94,
				97,
				93,
				95
			],
			borderColor: "#6366f1",
			backgroundColor: "rgba(99,102,241,0.1)",
			fill: true,
			tension: .4
		}]
	};
	const recentJoiners = d.recent_joiners || [
		{
			id: 1,
			name: "Dr. Sarah Johnson",
			department: "Computer Science",
			role: "Professor",
			date: "2026-07-20"
		},
		{
			id: 2,
			name: "Mr. Michael Brown",
			department: "Mathematics",
			role: "Lecturer",
			date: "2026-07-18"
		},
		{
			id: 3,
			name: "Ms. Emily Davis",
			department: "Administration",
			role: "Coordinator",
			date: "2026-07-15"
		},
		{
			id: 4,
			name: "Mr. James Wilson",
			department: "Science",
			role: "Lab Assistant",
			date: "2026-07-12"
		}
	];
	const celebrations = d.celebrations || {
		birthdays: [{
			id: 1,
			name: "Dr. Alan Turing",
			department: "Computer Science"
		}, {
			id: 2,
			name: "Ms. Marie Curie",
			department: "Science"
		}],
		anniversaries: [{
			id: 1,
			name: "Prof. John Nash",
			department: "Mathematics",
			years: 5
		}]
	};
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
					7
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-4 col-xl",
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card skeleton-card p-4 border-0 shadow-sm",
							style: {
								height: "350px",
								borderRadius: "18px"
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card skeleton-card p-4 border-0 shadow-sm",
							style: {
								height: "350px",
								borderRadius: "18px"
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card skeleton-card p-4 border-0 shadow-sm",
							style: {
								height: "350px",
								borderRadius: "18px"
							}
						})
					})
				]
			})
		]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `p-4 ${isDark ? "text-white bg-dark" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "alert alert-danger d-flex align-items-center gap-2 rounded-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowUp }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-2 ${isDark ? "text-white bg-dark" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Staff Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Employee and faculty overview"
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-3",
									children: "Staff Distribution"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center",
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "position-relative",
										style: {
											width: "180px",
											height: "180px"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
											data: staffData,
											options: {
												responsive: true,
												maintainAspectRatio: false,
												cutout: "72%",
												plugins: { legend: { display: false } },
												elements: { arc: { borderRadius: 6 } }
											}
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex justify-content-center gap-4 mt-2",
									children: ["Teachers", "Non-Teaching"].map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
											width: "10px",
											height: "10px",
											borderRadius: "50%",
											background: staffData.datasets[0].backgroundColor[i],
											display: "inline-block"
										} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-semibold",
											children: l
										})]
									}, l))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Department-wise"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "220px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: deptData,
									options: {
										responsive: true,
										maintainAspectRatio: false,
										plugins: { legend: { display: false } },
										scales: {
											y: {
												beginAtZero: true,
												grid: { display: false }
											},
											x: { grid: { display: false } }
										}
									}
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Attendance Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "220px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									data: attTrendData,
									options: {
										responsive: true,
										maintainAspectRatio: false,
										plugins: { legend: { display: false } },
										scales: {
											y: {
												beginAtZero: true,
												max: 100,
												grid: { display: false }
											},
											x: { grid: { display: false } }
										}
									}
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUserPlus,
									className: "me-2 text-success"
								}), "Recent Joiners"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-responsive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "table table-hover align-middle mb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Role" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" })
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: recentJoiners.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: "4",
										className: "text-center py-4 text-muted",
										children: "No recent joiners"
									}) }) : recentJoiners.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "fw-semibold small",
											children: j.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: j.department
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: j.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: j.date
										})
									] }, j.id)) })]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCake,
									className: "me-2 text-warning"
								}), "Birthdays"]
							}), celebrations.birthdays.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted text-center py-4 small",
								children: "No birthdays today"
							}) : celebrations.birthdays.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 p-2 rounded-3",
								style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle bg-warning text-white d-flex align-items-center justify-content-center fw-bold",
										style: {
											width: "36px",
											height: "36px",
											fontSize: "13px"
										},
										children: b.name.charAt(0)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small fw-bold",
										children: b.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small text-muted",
										children: b.department
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faGift,
										className: "ms-auto text-warning"
									})
								]
							}, b.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBriefcase,
									className: "me-2 text-primary"
								}), "Anniversaries"]
							}), celebrations.anniversaries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted text-center py-4 small",
								children: "No anniversaries today"
							}) : celebrations.anniversaries.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 p-2 rounded-3",
								style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold",
									style: {
										width: "36px",
										height: "36px",
										fontSize: "13px"
									},
									children: a.name.charAt(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-bold",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "x-small text-muted",
									children: [
										a.department,
										" | ",
										a.years,
										" yrs"
									]
								})] })]
							}, a.id))]
						})
					})
				]
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
export { StaffDashboard as default };
