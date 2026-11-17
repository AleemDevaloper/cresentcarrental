import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Bs as faStar, Ci as faGraduationCap, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, I as faArrowRight, Uc as faUserGraduate, Yt as faChartLine, bl as useApp, d as useTranslation, dc as faTimesCircle, f as Bar, m as Line, p as Doughnut, ru as require_react, so as faPenFancy, tl as faUsers, vl as FontAwesomeIcon, wo as faPlay } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Examinations/ExamDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ExamDashboard = () => {
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
					totalExams: 48,
					upcoming: 12,
					running: 3,
					completed: 33,
					studentsAppearing: 2450,
					passed: 1980,
					failed: 370,
					averageScore: 72.5,
					pendingEvaluations: 8,
					publishedResults: 25,
					passRate: 80.8,
					subjectPerformance: [
						{
							name: "Mathematics",
							avg: 68,
							passed: 280,
							total: 400
						},
						{
							name: "Physics",
							avg: 72,
							passed: 310,
							total: 380
						},
						{
							name: "Chemistry",
							avg: 70,
							passed: 290,
							total: 370
						},
						{
							name: "Biology",
							avg: 78,
							passed: 340,
							total: 390
						},
						{
							name: "Computer Science",
							avg: 85,
							passed: 360,
							total: 380
						},
						{
							name: "English",
							avg: 74,
							passed: 320,
							total: 400
						}
					],
					examTrend: [
						4,
						6,
						3,
						8,
						5,
						7,
						4,
						6,
						9,
						5,
						7,
						8
					],
					upcomingExams: [
						{
							id: 1,
							name: "Mid-Term Physics",
							subject: "Physics",
							date: "2025-08-20",
							students: 120,
							room: "Hall A"
						},
						{
							id: 2,
							name: "Final Mathematics",
							subject: "Mathematics",
							date: "2025-08-22",
							students: 150,
							room: "Hall B"
						},
						{
							id: 3,
							name: "Chemistry Quiz",
							subject: "Chemistry",
							date: "2025-08-18",
							students: 80,
							room: "Lab 1"
						},
						{
							id: 4,
							name: "English Literature",
							subject: "English",
							date: "2025-08-25",
							students: 100,
							room: "Hall C"
						},
						{
							id: 5,
							name: "CS Practical",
							subject: "Computer Science",
							date: "2025-08-19",
							students: 60,
							room: "CS Lab"
						}
					],
					recentResults: [
						{
							id: 1,
							exam: "Spring Physics",
							student: "Ali Ahmed",
							marks: 85,
							grade: "A",
							status: "Pass"
						},
						{
							id: 2,
							exam: "Spring Physics",
							student: "Sara Khan",
							marks: 72,
							grade: "B",
							status: "Pass"
						},
						{
							id: 3,
							exam: "Spring Physics",
							student: "Usman Ali",
							marks: 45,
							grade: "D",
							status: "Fail"
						},
						{
							id: 4,
							exam: "Math Final",
							student: "Fatima Noor",
							marks: 91,
							grade: "A+",
							status: "Pass"
						},
						{
							id: 5,
							exam: "Math Final",
							student: "Hassan Raza",
							marks: 63,
							grade: "C",
							status: "Pass"
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load exam dashboard");
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
	const passFailData = {
		labels: ["Passed", "Failed"],
		datasets: [{
			data: [stats.passed, stats.failed],
			backgroundColor: [colors.success, colors.danger],
			borderWidth: 0,
			hoverOffset: 10
		}]
	};
	const subjectPerfData = {
		labels: stats.subjectPerformance.map((s) => s.name),
		datasets: [{
			label: "Average Score",
			data: stats.subjectPerformance.map((s) => s.avg),
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#06b6d4",
				"#8b5cf6",
				"#ec4899"
			],
			borderRadius: 6
		}]
	};
	const trendData = {
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
			label: "Exams",
			data: stats.examTrend,
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
				titleColor: textColor,
				bodyColor: mutedColor,
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
							icon: faGraduationCap,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Examination Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Monitor exams, results, and academic performance"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2",
					onClick: () => setActiveTab?.("examinations"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPenFancy }), " Manage Exams"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Total Exams",
						value: stats.totalExams,
						icon: faGraduationCap,
						color: colors.primary
					},
					{
						title: "Upcoming",
						value: stats.upcoming,
						icon: faClock,
						color: colors.info
					},
					{
						title: "Running",
						value: stats.running,
						icon: faPlay,
						color: colors.success
					},
					{
						title: "Completed",
						value: stats.completed,
						icon: faCheckCircle,
						color: colors.success
					},
					{
						title: "Students Appearing",
						value: stats.studentsAppearing,
						icon: faUsers,
						color: colors.primary
					},
					{
						title: "Passed",
						value: stats.passed,
						icon: faStar,
						color: colors.success
					},
					{
						title: "Failed",
						value: stats.failed,
						icon: faTimesCircle,
						color: colors.danger
					},
					{
						title: "Avg Score",
						value: `${stats.averageScore}%`,
						icon: faChartLine,
						color: colors.purple
					},
					{
						title: "Pending Eval",
						value: stats.pendingEvaluations,
						icon: faClock,
						color: colors.warning
					},
					{
						title: "Published Results",
						value: stats.publishedResults,
						icon: faCheckCircle,
						color: colors.info
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
									children: "Pass / Fail Distribution"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										height: "220px",
										position: "relative"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: passFailData,
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
											children: [stats.passRate, "%"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "x-small text-muted",
											children: "Pass Rate"
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
									children: "Subject Performance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: subjectPerfData,
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
									children: "Exam Trends"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: trendData,
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
					className: "col-xl-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: textColor },
									children: "Upcoming Exams"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.upcomingExams.map((exam, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "42px",
											height: "42px",
											background: `${colors.primary}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPenFancy,
											style: {
												color: colors.primary,
												fontSize: "16px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: exam.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												exam.subject,
												" · ",
												exam.room,
												" · ",
												exam.students,
												" students"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-end flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-primary-subtle text-primary rounded-pill x-small",
											children: exam.date
										})
									})
								]
							}, exam.id))]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: textColor },
									children: "Recent Results"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.recentResults.map((res, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "38px",
											height: "38px",
											background: res.status === "Pass" ? `${colors.success}15` : `${colors.danger}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUserGraduate,
											style: {
												color: res.status === "Pass" ? colors.success : colors.danger,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: res.student
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												res.exam,
												" · ",
												res.marks,
												" marks"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-end flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `badge rounded-pill x-small ${res.status === "Pass" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`,
											children: [
												res.grade,
												" - ",
												res.status
											]
										})
									})
								]
							}, res.id))]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { ExamDashboard as default };
