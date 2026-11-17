import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, $t as faCheckCircle, Ar as faFileAlt, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Hl as LineElement, Il as BarElement, Ki as faHourglassHalf, Kl as PointElement, Pl as ArcElement, Pt as faCalendarCheck, Rl as CategoryScale, Sc as faTrophy, Uc as faUserGraduate, Ul as LinearScale, Ur as faFileInvoice, Zl as index, bl as useApp, d as useTranslation, dc as faTimesCircle, eu as plugin_title, f as Bar, m as Line, or as faDoorOpen, p as Doughnut, ru as require_react, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
import { k as getAdmissionDashboard } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Admissions/AdmissionDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, plugin_title, plugin_tooltip, plugin_legend, ArcElement, index);
var AdmissionDashboard = () => {
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
			setDashboard(await getAdmissionDashboard() || {});
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
			title: "Total Applications",
			value: d.total_applications ?? 340,
			icon: faFileInvoice,
			color: "primary",
			sub: "All time applications"
		},
		{
			title: "Pending",
			value: d.pending ?? 85,
			icon: faClock,
			color: "warning",
			sub: "Awaiting review"
		},
		{
			title: "Approved",
			value: d.approved ?? 180,
			icon: faCheckCircle,
			color: "success",
			sub: "Applications approved"
		},
		{
			title: "Rejected",
			value: d.rejected ?? 30,
			icon: faTimesCircle,
			color: "danger",
			sub: "Applications rejected"
		},
		{
			title: "Waiting List",
			value: d.waiting_list ?? 15,
			icon: faHourglassHalf,
			color: "info",
			sub: "On hold"
		},
		{
			title: "Under Review",
			value: d.under_review ?? 40,
			icon: faEye,
			color: "primary",
			sub: "Being processed"
		},
		{
			title: "Enrolled",
			value: d.enrolled ?? 150,
			icon: faUserGraduate,
			color: "success",
			sub: "Confirmed enrollment"
		},
		{
			title: "Available Seats",
			value: d.available_seats ?? 200,
			icon: faDoorOpen,
			color: "info",
			sub: "Open for applications"
		},
		{
			title: "Filled Seats",
			value: d.filled_seats ?? 150,
			icon: faUsers,
			color: "warning",
			sub: "Seats occupied"
		}
	];
	const trendData = {
		labels: d.application_trend?.labels || [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun"
		],
		datasets: [{
			label: "Applications",
			data: d.application_trend?.data || [
				40,
				55,
				70,
				85,
				60,
				50
			],
			borderColor: "#6366f1",
			backgroundColor: "rgba(99,102,241,0.1)",
			fill: true,
			tension: .4
		}]
	};
	const statusData = {
		labels: [
			"Approved",
			"Rejected",
			"Pending",
			"Under Review",
			"Waiting List"
		],
		datasets: [{
			data: [
				d.approved ?? 180,
				d.rejected ?? 30,
				d.pending ?? 85,
				d.under_review ?? 40,
				d.waiting_list ?? 15
			],
			backgroundColor: [
				"#10b981",
				"#ef4444",
				"#f59e0b",
				"#6366f1",
				"#06b6d4"
			],
			borderWidth: 0
		}]
	};
	const programData = {
		labels: d.program_wise?.labels || [
			"CS",
			"Engineering",
			"Business",
			"Arts",
			"Medicine"
		],
		datasets: [{
			label: "Applications",
			data: d.program_wise?.data || [
				80,
				65,
				55,
				40,
				30
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
	const recentApplications = d.recent_applications || [
		{
			id: 1,
			name: "Alice Johnson",
			program: "Computer Science",
			date: "2026-07-26",
			status: "pending"
		},
		{
			id: 2,
			name: "Bob Smith",
			program: "Business Administration",
			date: "2026-07-25",
			status: "approved"
		},
		{
			id: 3,
			name: "Carol Williams",
			program: "Electrical Engineering",
			date: "2026-07-24",
			status: "under_review"
		},
		{
			id: 4,
			name: "David Brown",
			program: "Medicine",
			date: "2026-07-23",
			status: "rejected"
		},
		{
			id: 5,
			name: "Emma Davis",
			program: "Computer Science",
			date: "2026-07-22",
			status: "approved"
		}
	];
	const quickActions = [
		{
			label: "New Application",
			icon: faPlus,
			color: "#6366f1",
			bg: "rgba(99,102,241,0.1)"
		},
		{
			label: "Verify Documents",
			icon: faFileAlt,
			color: "#10b981",
			bg: "rgba(16,185,129,0.1)"
		},
		{
			label: "Schedule Interview",
			icon: faCalendarCheck,
			color: "#f59e0b",
			bg: "rgba(245,158,11,0.1)"
		},
		{
			label: "Generate Merit List",
			icon: faTrophy,
			color: "#06b6d4",
			bg: "rgba(6,182,212,0.1)"
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
					9
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
					children: "Admissions Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Track and manage student applications"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: quickActions.map((qa) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-6 col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn w-100 py-3 rounded-4 border-0 d-flex align-items-center gap-3 hover-lift transition",
						style: {
							background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
							border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-3 d-flex align-items-center justify-content-center",
							style: {
								width: "40px",
								height: "40px",
								background: qa.bg
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: qa.icon,
								style: {
									color: qa.color,
									fontSize: "16px"
								}
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "small fw-bold text-start",
							children: qa.label
						})]
					})
				}, qa.label))
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
								children: "Application Trend"
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
									children: "Status Distribution"
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
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex flex-wrap justify-content-center gap-2 mt-2",
									children: statusData.labels.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
											width: "10px",
											height: "10px",
											borderRadius: "50%",
											background: statusData.datasets[0].backgroundColor[i],
											display: "inline-block"
										} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "x-small fw-semibold",
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
								children: "Program-wise"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "220px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: programData,
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
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					children: "Recent Applications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Program" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: recentApplications.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "fw-semibold small",
								children: a.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: a.program
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: a.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : a.status === "under_review" ? "primary" : "warning"}-subtle text-${a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : a.status === "under_review" ? "primary" : "warning"}`,
								children: a.status.replace("_", " ")
							}) })
						] }, a.id)) })]
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
export { AdmissionDashboard as default };
