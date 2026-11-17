import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Ci as faGraduationCap, Cn as faClock, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, G as faArrowUp, Ga as faMoneyBillWave, Hl as LineElement, Il as BarElement, Jc as faUserPlus, Kl as PointElement, Pl as ArcElement, Pt as faCalendarCheck, Q as faAward, Rc as faUserCheck, Rl as CategoryScale, Uc as faUserGraduate, Ul as LinearScale, Zc as faUserSlash, Zl as index, al as faVenus, bl as useApp, d as useTranslation, en as faCheckDouble, eu as plugin_title, f as Bar, kt as faBus, m as Line, p as Doughnut, ru as require_react, tu as plugin_tooltip, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
import { M as getStudentDashboard } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Students/StudentDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, plugin_title, plugin_tooltip, plugin_legend, ArcElement, index);
var StudentDashboard = () => {
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
			setDashboard(await getStudentDashboard() || {});
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
			title: "Total Students",
			value: d.total_students ?? 1250,
			icon: faUserGraduate,
			color: "primary",
			sub: "All enrolled students"
		},
		{
			title: "Active",
			value: d.active ?? 1120,
			icon: faUserCheck,
			color: "success",
			sub: "Currently enrolled"
		},
		{
			title: "Inactive",
			value: d.inactive ?? 80,
			icon: faUserSlash,
			color: "secondary",
			sub: "Dropped / Graduated"
		},
		{
			title: "Graduated",
			value: d.graduated ?? 50,
			icon: faGraduationCap,
			color: "info",
			sub: "Completed programs"
		},
		{
			title: "New Admissions",
			value: d.new_admissions ?? 45,
			icon: faUserPlus,
			color: "success",
			sub: "This academic year"
		},
		{
			title: "Pending",
			value: d.pending ?? 30,
			icon: faClock,
			color: "warning",
			sub: "Awaiting approval"
		},
		{
			title: "Scholarship",
			value: d.scholarship ?? 120,
			icon: faAward,
			color: "warning",
			sub: "On scholarship"
		},
		{
			title: "Hostel",
			value: d.hostel ?? 200,
			icon: faBuilding,
			color: "info",
			sub: "Residential students"
		},
		{
			title: "Transport",
			value: d.transport ?? 350,
			icon: faBus,
			color: "primary",
			sub: "Using transport service"
		},
		{
			title: "Fee Defaulters",
			value: d.fee_defaulters ?? 15,
			icon: faMoneyBillWave,
			color: "danger",
			sub: "Pending dues"
		},
		{
			title: "Perfect Attendance",
			value: d.perfect_attendance ?? 180,
			icon: faCheckDouble,
			color: "success",
			sub: "No absences"
		},
		{
			title: "At Risk",
			value: d.at_risk ?? 25,
			icon: faExclamationTriangle,
			color: "danger",
			sub: "Needs intervention"
		}
	];
	const trendData = {
		labels: d.enrollment_trend?.labels || [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun"
		],
		datasets: [{
			label: "Enrollments",
			data: d.enrollment_trend?.data || [
				120,
				135,
				150,
				145,
				160,
				180
			],
			borderColor: "#6366f1",
			backgroundColor: "rgba(99,102,241,0.1)",
			fill: true,
			tension: .4
		}]
	};
	const genderData = {
		labels: [
			"Male",
			"Female",
			"Other"
		],
		datasets: [{
			data: [
				d.gender_distribution?.male ?? 600,
				d.gender_distribution?.female ?? 540,
				d.gender_distribution?.other ?? 10
			],
			backgroundColor: [
				"#6366f1",
				"#ec4899",
				"#6b7280"
			],
			borderWidth: 0
		}]
	};
	const deptData = {
		labels: d.department_wise?.labels || [
			"CS",
			"Engineering",
			"Business",
			"Arts",
			"Science"
		],
		datasets: [{
			label: "Students",
			data: d.department_wise?.data || [
				300,
				250,
				200,
				150,
				100
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
	const recentRegistrations = d.recent_registrations || [
		{
			id: 1,
			name: "Alice Johnson",
			student_id: "STU-001",
			program: "Computer Science",
			date: "2026-07-25",
			status: "active"
		},
		{
			id: 2,
			name: "Bob Smith",
			student_id: "STU-002",
			program: "Business Administration",
			date: "2026-07-24",
			status: "active"
		},
		{
			id: 3,
			name: "Carol Williams",
			student_id: "STU-003",
			program: "Electrical Engineering",
			date: "2026-07-23",
			status: "pending"
		},
		{
			id: 4,
			name: "David Brown",
			student_id: "STU-004",
			program: "Mechanical Engineering",
			date: "2026-07-22",
			status: "active"
		},
		{
			id: 5,
			name: "Emma Davis",
			student_id: "STU-005",
			program: "Psychology",
			date: "2026-07-21",
			status: "active"
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
					10,
					11,
					12
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-2 ${isDark ? "text-white bg-dark" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Student Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Student Information System overview"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: kpis.map((kpi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-4 col-xl-2",
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Enrollment Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "220px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									data: trendData,
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
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-3",
									children: "Gender Distribution"
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
											data: genderData,
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
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex justify-content-center gap-4 mt-2",
									children: [
										"Male",
										"Female",
										"Other"
									].map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
											width: "10px",
											height: "10px",
											borderRadius: "50%",
											background: genderData.datasets[0].backgroundColor[i],
											display: "inline-block"
										} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-semibold",
											children: g
										})]
									}, g))
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
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-3",
							children: "Recent Registrations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ID" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Program" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: recentRegistrations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-semibold small",
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: r.student_id }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.program
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge rounded-pill bg-${r.status === "active" ? "success" : "warning"}-subtle text-${r.status === "active" ? "success" : "warning"}`,
										children: r.status
									}) })
								] }, r.id)) })]
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Student Stats Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-3",
								children: [
									{
										label: "Avg Attendance",
										value: "94.2%",
										color: "success",
										icon: faCalendarCheck
									},
									{
										label: "Avg GPA",
										value: "3.45",
										color: "primary",
										icon: faAward
									},
									{
										label: "Retention Rate",
										value: "97.1%",
										color: "info",
										icon: faArrowUp
									},
									{
										label: "Male/Female Ratio",
										value: `${d.gender_distribution?.male ?? 600}:${d.gender_distribution?.female ?? 540}`,
										color: "warning",
										icon: faVenus
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-3 rounded-4 d-flex align-items-center gap-3 ${isDark ? "bg-dark-subtle" : "bg-light"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `p-3 rounded-3 bg-${s.color}-subtle text-${s.color}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `x-small fw-bold ${isDark ? "text-light opacity-50" : "text-muted"}`,
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h4 fw-bold mb-0",
											children: s.value
										})] })]
									})
								}, s.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 p-3 rounded-4",
								style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `small fw-bold ${isDark ? "text-light" : ""}`,
										children: "Total Active Students"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small text-muted",
										children: "Across all programs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h3 fw-bold text-primary",
										children: d.active ?? 1120
									})]
								})
							})
						]
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
export { StudentDashboard as default };
