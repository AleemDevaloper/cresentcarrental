import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Er as faEye, G as faArrowUp, Hl as LineElement, Il as BarElement, Jt as faChartBar, Kl as PointElement, Kt as faChalkboardTeacher, Pl as ArcElement, Rc as faUserCheck, Rl as CategoryScale, Sn as faClipboardList, Ul as LinearScale, Ur as faFileInvoice, Zc as faUserSlash, Zl as index, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, m as Line, po as faPercent, ru as require_react, tu as plugin_tooltip, v as motion, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Attendance/AttendanceDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var AttendanceDashboard = () => {
	const { t } = useTranslation();
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filters, setFilters] = (0, import_react.useState)({
		institution: "",
		campus: "",
		department: ""
	});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const d = {
		todayAttendance: 12540,
		studentsPresent: 11280,
		studentsAbsent: 860,
		studentsLate: 400,
		teachersPresent: 165,
		teachersAbsent: 20,
		attendancePercent: 89.9,
		leaveRequests: 45,
		pendingCorrections: 12,
		dailyTrend: [
			12500,
			12480,
			12520,
			12450,
			12540,
			12490,
			12510,
			12480,
			12500,
			12540,
			12470,
			12520,
			12490,
			12540,
			12510,
			12460,
			12530,
			12500,
			12480,
			12520,
			12540,
			12500,
			12470,
			12510,
			12540,
			12490,
			12520,
			12500,
			12540,
			12510
		],
		weeklyComparison: [
			{
				day: "Mon",
				present: 11200,
				absent: 600,
				late: 200
			},
			{
				day: "Tue",
				present: 11150,
				absent: 650,
				late: 180
			},
			{
				day: "Wed",
				present: 11280,
				absent: 860,
				late: 400
			},
			{
				day: "Thu",
				present: 11100,
				absent: 700,
				late: 250
			},
			{
				day: "Fri",
				present: 10980,
				absent: 800,
				late: 300
			},
			{
				day: "Sat",
				present: 10500,
				absent: 1e3,
				late: 150
			},
			{
				day: "Sun",
				present: 8e3,
				absent: 2e3,
				late: 100
			}
		],
		departmentAttendance: [
			{
				name: "Computer Science",
				percent: 92
			},
			{
				name: "Business Admin",
				percent: 88
			},
			{
				name: "Engineering",
				percent: 85
			},
			{
				name: "Medical",
				percent: 94
			},
			{
				name: "Arts",
				percent: 82
			},
			{
				name: "Law",
				percent: 90
			}
		],
		lowAttendanceAlerts: [
			{
				student: "Ali Khan",
				class: "CS-3A",
				percent: 68,
				daysAbsent: 12
			},
			{
				student: "Sara Ali",
				class: "BBA-2B",
				percent: 72,
				daysAbsent: 9
			},
			{
				student: "Usman Raza",
				class: "ENG-1A",
				percent: 65,
				daysAbsent: 14
			},
			{
				student: "Fatima Noor",
				class: "MED-4A",
				percent: 70,
				daysAbsent: 10
			},
			{
				student: "Hassan Shah",
				class: "LAW-2A",
				percent: 74,
				daysAbsent: 8
			}
		]
	};
	const loadDashboard = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 600));
		} catch (err) {
			console.error("Error loading Attendance Dashboard", err);
		} finally {
			setLoading(false);
		}
	}, [filters]);
	(0, import_react.useEffect)(() => {
		loadDashboard();
	}, [loadDashboard]);
	const dailyTrendData = {
		labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
		datasets: [{
			label: "Attendance",
			data: d.dailyTrend,
			borderColor: "#6366f1",
			backgroundColor: (ctx) => {
				const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
				g.addColorStop(0, "rgba(99,102,241,0.3)");
				g.addColorStop(1, "rgba(99,102,241,0)");
				return g;
			},
			fill: true,
			tension: .4,
			pointRadius: 3,
			pointBackgroundColor: "#6366f1",
			pointBorderColor: "#fff",
			pointBorderWidth: 2
		}]
	};
	const weeklyData = {
		labels: d.weeklyComparison.map((x) => x.day),
		datasets: [
			{
				label: "Present",
				data: d.weeklyComparison.map((x) => x.present),
				backgroundColor: "rgba(16,185,129,0.7)",
				borderRadius: 4
			},
			{
				label: "Absent",
				data: d.weeklyComparison.map((x) => x.absent),
				backgroundColor: "rgba(239,68,68,0.7)",
				borderRadius: 4
			},
			{
				label: "Late",
				data: d.weeklyComparison.map((x) => x.late),
				backgroundColor: "rgba(245,158,11,0.7)",
				borderRadius: 4
			}
		]
	};
	const deptData = {
		labels: d.departmentAttendance.map((x) => x.name),
		datasets: [{
			label: "Attendance %",
			data: d.departmentAttendance.map((x) => x.percent),
			backgroundColor: [
				"rgba(99,102,241,0.7)",
				"rgba(16,185,129,0.7)",
				"rgba(245,158,11,0.7)",
				"rgba(239,68,68,0.7)",
				"rgba(139,92,246,0.7)",
				"rgba(6,182,212,0.7)"
			],
			borderRadius: 6
		}]
	};
	const chartOptions = (title) => ({
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				backgroundColor: isDark ? "#1e293b" : "#fff",
				titleColor: isDark ? "#f1f5f9" : "#1e293b",
				bodyColor: isDark ? "#94a3b8" : "#64748b",
				borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
				borderWidth: 1,
				cornerRadius: 10,
				padding: 10
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				}
			},
			x: {
				grid: { display: false },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				}
			}
		}
	});
	const weeklyOptions = {
		...chartOptions("Weekly"),
		scales: {
			x: {
				grid: { display: false },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				}
			},
			y: {
				stacked: true,
				beginAtZero: true,
				grid: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				}
			}
		},
		plugins: {
			legend: {
				display: true,
				position: "top",
				labels: {
					boxWidth: 12,
					padding: 8,
					color: mutedColor,
					font: { size: 10 }
				}
			},
			tooltip: {
				backgroundColor: isDark ? "#1e293b" : "#fff",
				titleColor: isDark ? "#f1f5f9" : "#1e293b",
				bodyColor: isDark ? "#94a3b8" : "#64748b",
				borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
				borderWidth: 1,
				cornerRadius: 10,
				padding: 10
			}
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "skeleton-line w-25 mb-4",
			style: {
				height: "30px",
				borderRadius: "4px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row g-4",
			children: [
				1,
				2,
				3,
				4,
				5,
				6
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl col-lg-4 col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card skeleton-card p-4 border-0 shadow-sm",
					style: {
						height: "130px",
						borderRadius: "18px",
						background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
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
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-2 ${isDark ? "text-white" : ""}`,
		style: {
			background: isDark ? "#0b0f1a" : "#f8f9fc",
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Attendance Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Real-time attendance monitoring and analytics"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `badge rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${isDark ? "bg-dark text-success border border-success" : "bg-success-subtle text-success"}`,
						style: { fontSize: "12px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "live-dot",
							style: {
								width: "6px",
								height: "6px",
								backgroundColor: "#4ade80",
								borderRadius: "50%",
								display: "inline-block",
								boxShadow: "0 0 8px #4ade80"
							}
						}), "Live"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
						children: (/* @__PURE__ */ new Date()).toLocaleDateString()
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Today's Attendance",
						value: d.todayAttendance.toLocaleString(),
						icon: faClipboardList,
						color: "#6366f1",
						subText: "Total records",
						trend: "up",
						trendValue: "2.1%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Students Present",
						value: d.studentsPresent.toLocaleString(),
						icon: faUserCheck,
						color: "#10b981",
						subText: `${(d.studentsPresent / d.todayAttendance * 100).toFixed(1)}% rate`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Students Absent",
						value: d.studentsAbsent.toLocaleString(),
						icon: faUserSlash,
						color: "#ef4444",
						subText: "Without leave"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Students Late",
						value: d.studentsLate.toLocaleString(),
						icon: faClock,
						color: "#f59e0b",
						subText: "Marked late"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Teachers Present",
						value: d.teachersPresent,
						icon: faChalkboardTeacher,
						color: "#3b82f6",
						subText: `${d.teachersAbsent} absent`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Attendance %",
						value: `${d.attendancePercent}%`,
						icon: faPercent,
						color: "#8b5cf6",
						subText: "Overall today"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					title: "Leave Requests",
					value: d.leaveRequests,
					icon: faFileInvoice,
					color: "#ec4899",
					subText: "Pending approval"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
					title: "Pending Corrections",
					value: d.pendingCorrections,
					icon: faExclamationTriangle,
					color: "#f97316",
					subText: "Needs review"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-0",
								style: {
									fontSize: "15px",
									color: textColor
								},
								children: "Daily Attendance Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: "Last 30 days"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { height: "240px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								data: dailyTrendData,
								options: chartOptions("Daily Trend")
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-0",
								style: {
									fontSize: "15px",
									color: textColor
								},
								children: "Weekly Comparison"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: "This week"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { height: "240px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								data: weeklyData,
								options: weeklyOptions
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-0",
								style: {
									fontSize: "15px",
									color: textColor
								},
								children: "Department Attendance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faChartBar,
								style: { color: mutedColor }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { height: "250px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								data: deptData,
								options: {
									...chartOptions("Dept"),
									indexAxis: "y",
									scales: {
										x: {
											beginAtZero: true,
											max: 100,
											grid: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
											ticks: {
												color: mutedColor,
												font: { size: 10 }
											}
										},
										y: {
											grid: { display: false },
											ticks: {
												color: mutedColor,
												font: { size: 10 }
											}
										}
									}
								}
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faExclamationTriangle,
									style: {
										color: "#ef4444",
										fontSize: "16px"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										fontSize: "15px",
										color: textColor
									},
									children: "Low Attendance Alerts"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-danger rounded-pill px-2 py-1 x-small",
								children: d.lowAttendanceAlerts.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							style: { maxHeight: "280px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Attendance %" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Days Absent" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: d.lowAttendanceAlerts.map((alert, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-semibold small",
										children: alert.student
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: alert.class
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress flex-grow-1",
											style: {
												height: "6px",
												borderRadius: "10px"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress-bar bg-danger",
												style: {
													width: `${alert.percent}%`,
													borderRadius: "10px"
												}
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small fw-bold text-danger",
											children: [alert.percent, "%"]
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small fw-semibold",
										children: alert.daysAbsent
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faEye,
										className: "text-primary",
										style: { cursor: "pointer" }
									}) })
								] }, idx)) })]
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
					style: { borderRadius: "18px" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "fw-bold mb-3",
						style: {
							fontSize: "15px",
							color: textColor
						},
						children: "Real-Time Attendance Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-4",
						children: [
							{
								label: "Present",
								value: d.studentsPresent,
								icon: faUserCheck,
								color: "#10b981",
								percent: 89.9
							},
							{
								label: "Absent",
								value: d.studentsAbsent,
								icon: faUserSlash,
								color: "#ef4444",
								percent: 6.9
							},
							{
								label: "Late",
								value: d.studentsLate,
								icon: faClock,
								color: "#f59e0b",
								percent: 3.2
							},
							{
								label: "On Leave",
								value: d.leaveRequests,
								icon: faFileInvoice,
								color: "#6366f1",
								percent: .4
							}
						].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-4 text-center",
								style: {
									background: `${stat.color}08`,
									border: `1px solid ${stat.color}20`
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: stat.icon,
										style: {
											color: stat.color,
											fontSize: "24px"
										},
										className: "mb-2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h3 fw-bold mb-0",
										style: { color: stat.color },
										children: stat.value.toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small fw-semibold",
										style: { color: textColor },
										children: stat.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "x-small text-muted",
										children: [stat.percent, "% of total"]
									})
								]
							})
						}, stat.label))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
        .skeleton-card { border-radius: 18px; }
        .skeleton-line { border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      ` })
		]
	});
};
var KPICard = ({ title, value, icon, color, subText, trend, trendValue }) => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: "col-xl col-lg-4 col-md-6",
		whileHover: {
			y: -4,
			scale: 1.01
		},
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 20
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			style: { borderRadius: "18px" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-start mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-3 d-flex align-items-center justify-content-center",
							style: {
								background: `${color}15`,
								color
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon,
								size: "lg"
							})
						}), trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1",
							style: { fontSize: "10px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faArrowUp,
								className: "me-1",
								style: { fontSize: "8px" }
							}), trendValue]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "small fw-bold text-uppercase mb-1",
						style: {
							fontSize: "10.5px",
							letterSpacing: "0.3px",
							color: mutedColor
						},
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h3 fw-bold mb-1",
						style: {
							fontSize: "22px",
							color: textColor
						},
						children: value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "x-small",
						style: {
							color: mutedColor,
							fontSize: "10.5px"
						},
						children: subText
					})
				]
			})
		})
	});
};
//#endregion
export { AttendanceDashboard as default };
