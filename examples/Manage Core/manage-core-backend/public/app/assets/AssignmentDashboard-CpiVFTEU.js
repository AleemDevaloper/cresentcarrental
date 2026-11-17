import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ar as faFileAlt, Bs as faStar, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Fc as faUpload, I as faArrowRight, Pt as faCalendarCheck, Uc as faUserGraduate, bl as useApp, d as useTranslation, da as faLayerGroup, dc as faTimesCircle, f as Bar, m as Line, p as Doughnut, ru as require_react, ut as faBook, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Assignments/AssignmentDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AssignmentDashboard = () => {
	const { theme, setActiveTab } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	(0, import_react.useEffect)(() => {
		const fetchStats = async () => {
			try {
				await new Promise((r) => setTimeout(r, 600));
				setStats({
					totalAssignments: 245,
					published: 180,
					draft: 42,
					pendingSubmissions: 68,
					lateSubmissions: 23,
					graded: 120,
					ungraded: 60,
					upcomingDeadlines: 15,
					todayDue: 8,
					submissionRate: 72,
					gradesDistribution: [
						{
							range: "A (90-100)",
							count: 45
						},
						{
							range: "B (80-89)",
							count: 62
						},
						{
							range: "C (70-79)",
							count: 38
						},
						{
							range: "D (60-69)",
							count: 20
						},
						{
							range: "F (<60)",
							count: 10
						}
					],
					monthlyAssignments: [
						18,
						22,
						15,
						28,
						30,
						24,
						19,
						26,
						32,
						27,
						21,
						35
					],
					recentSubmissions: [
						{
							id: 1,
							student: "Ali Ahmed",
							assignment: "Physics Lab Report",
							subject: "Physics",
							time: "5 min ago",
							status: "submitted"
						},
						{
							id: 2,
							student: "Sara Khan",
							assignment: "Math Assignment 3",
							subject: "Mathematics",
							time: "12 min ago",
							status: "submitted"
						},
						{
							id: 3,
							student: "Usman Ali",
							assignment: "Chemistry Essay",
							subject: "Chemistry",
							time: "25 min ago",
							status: "late"
						},
						{
							id: 4,
							student: "Fatima Noor",
							assignment: "English Literature",
							subject: "English",
							time: "1 hour ago",
							status: "submitted"
						},
						{
							id: 5,
							student: "Hassan Raza",
							assignment: "Computer Science Project",
							subject: "CS",
							time: "2 hours ago",
							status: "graded"
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load assignment dashboard");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);
	const colors = {
		primary: "#6366f1",
		success: "#10b981",
		warning: "#f59e0b",
		danger: "#ef4444",
		info: "#06b6d4",
		purple: "#8b5cf6"
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-fluid py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "d-flex justify-content-center align-items-center",
			style: { height: "400px" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "spinner-border text-primary",
				role: "status",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "visually-hidden",
					children: "Loading..."
				})
			})
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-fluid py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex flex-column align-items-center justify-content-center",
			style: { height: "400px" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-danger mb-3",
					style: { fontSize: "3rem" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-2",
					style: { color: textColor },
					children: "Failed to Load Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-3 text-center",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary rounded-pill px-4",
					onClick: () => {
						setLoading(true);
						setError(null);
						setStats(null);
					},
					children: "Retry"
				})
			]
		})
	});
	if (!stats) return null;
	const submissionRateData = {
		labels: [
			"Submitted",
			"Pending",
			"Late"
		],
		datasets: [{
			data: [
				stats.submissionRate,
				100 - stats.submissionRate - 8,
				8
			],
			backgroundColor: [
				colors.success,
				colors.warning,
				colors.danger
			],
			borderWidth: 0,
			hoverOffset: 10
		}]
	};
	const gradesChartData = {
		labels: stats.gradesDistribution.map((g) => g.range),
		datasets: [{
			label: "Students",
			data: stats.gradesDistribution.map((g) => g.count),
			backgroundColor: [
				"#10b981",
				"#6366f1",
				"#f59e0b",
				"#f97316",
				"#ef4444"
			],
			borderRadius: 6
		}]
	};
	const monthlyData = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		datasets: [{
			label: "Assignments",
			data: stats.monthlyAssignments,
			borderColor: colors.primary,
			backgroundColor: "rgba(99, 102, 241, 0.1)",
			fill: true,
			tension: .4
		}]
	};
	const chartOpts = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				backgroundColor: isDark ? "#1e293b" : "#fff",
				titleColor: isDark ? "#f1f5f9" : "#1e293b",
				bodyColor: isDark ? "#94a3b8" : "#64748b",
				borderColor,
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
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		style: { minHeight: "100vh" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-4",
						style: {
							background: "rgba(99,102,241,0.1)",
							color: colors.primary
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faBook,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Assignment Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Track assignments, submissions, and grading"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2",
						onClick: () => setActiveTab?.("assignments"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Create Assignment"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Total Assignments",
						value: stats.totalAssignments,
						icon: faBook,
						color: colors.primary,
						sub: "All time"
					},
					{
						title: "Published",
						value: stats.published,
						icon: faCheckCircle,
						color: colors.success,
						sub: "Active"
					},
					{
						title: "Draft",
						value: stats.draft,
						icon: faClock,
						color: colors.warning,
						sub: "Not published"
					},
					{
						title: "Pending Submissions",
						value: stats.pendingSubmissions,
						icon: faUpload,
						color: colors.info,
						sub: "Awaiting"
					},
					{
						title: "Late Submissions",
						value: stats.lateSubmissions,
						icon: faExclamationTriangle,
						color: colors.danger,
						sub: "Overdue"
					},
					{
						title: "Graded",
						value: stats.graded,
						icon: faStar,
						color: colors.success,
						sub: "Completed"
					},
					{
						title: "Ungraded",
						value: stats.ungraded,
						icon: faTimesCircle,
						color: colors.warning,
						sub: "Pending review"
					},
					{
						title: "Upcoming Deadlines",
						value: stats.upcomingDeadlines,
						icon: faCalendarCheck,
						color: colors.info,
						sub: "Next 7 days"
					},
					{
						title: "Today's Due",
						value: stats.todayDue,
						icon: faClock,
						color: colors.danger,
						sub: "Critical"
					}
				].map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl col-lg-3 col-md-4 col-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex justify-content-between align-items-start mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded-3",
										style: { backgroundColor: `${stat.color}1a` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: stat.icon,
											style: {
												color: stat.color,
												fontSize: "14px"
											}
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										color: textColor,
										fontSize: "20px"
									},
									children: stat.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "x-small fw-semibold",
									style: { color: stat.color },
									children: stat.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "x-small text-muted",
									children: stat.sub
								})
							]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Submission Rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										height: "220px",
										position: "relative"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: submissionRateData,
										options: {
											responsive: true,
											maintainAspectRatio: false,
											cutout: "72%",
											plugins: { legend: {
												position: "bottom",
												labels: {
													usePointStyle: true,
													boxWidth: 8,
													font: { size: 11 },
													color: mutedColor
												}
											} }
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-absolute top-50 start-50 translate-middle text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "fw-bold mb-0",
											style: { color: textColor },
											children: [stats.submissionRate, "%"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "x-small text-muted",
											children: "Submitted"
										})]
									})]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Grades Distribution"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: gradesChartData,
										options: chartOpts
									})
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Monthly Assignments"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: monthlyData,
										options: chartOpts
									})
								})]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: textColor },
									children: "Recent Submissions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.recentSubmissions.map((sub, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "38px",
											height: "38px",
											background: sub.status === "late" ? `${colors.danger}15` : sub.status === "graded" ? `${colors.success}15` : `${colors.info}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUserGraduate,
											style: {
												color: sub.status === "late" ? colors.danger : sub.status === "graded" ? colors.success : colors.info,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1 min-width-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: sub.student
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												sub.assignment,
												" · ",
												sub.subject
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-end flex-shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill x-small fw-semibold ${sub.status === "late" ? "bg-danger-subtle text-danger" : sub.status === "graded" ? "bg-success-subtle text-success" : "bg-info-subtle text-info"}`,
											children: sub.status
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted mt-1",
											children: sub.time
										})]
									})
								]
							}, sub.id))]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-3",
								style: { color: textColor },
								children: "Quick Actions"
							}), [
								{
									label: "Create Assignment",
									icon: faPlus,
									color: colors.primary,
									desc: "Add new assignment"
								},
								{
									label: "Grade Submissions",
									icon: faStar,
									color: colors.success,
									desc: "Review & grade"
								},
								{
									label: "View All Assignments",
									icon: faLayerGroup,
									color: colors.info,
									desc: "Manage assignments"
								},
								{
									label: "Download Reports",
									icon: faFileAlt,
									color: colors.purple,
									desc: "Export data"
								}
							].map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition",
								style: {
									background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
									border: `1px solid ${borderColor}`
								},
								onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
								onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "36px",
											height: "36px",
											background: `${act.color}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: act.icon,
											style: {
												color: act.color,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: act.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: act.desc
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										className: "text-muted",
										style: {
											fontSize: "11px",
											opacity: .5
										}
									})
								]
							}, idx))]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
        .transition { transition: all 0.25s ease; }
      ` })
		]
	});
};
//#endregion
export { AssignmentDashboard as default };
