import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, $t as faCheckCircle, Bs as faStar, Ci as faGraduationCap, Cn as faClock, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Dt as faBullhorn, G as faArrowUp, Ga as faMoneyBillWave, Hl as LineElement, I as faArrowRight, Il as BarElement, Jc as faUserPlus, Jt as faChartBar, Kl as PointElement, Kt as faChalkboardTeacher, Nt as faCalendarAlt, Pl as ArcElement, Rl as CategoryScale, Sc as faTrophy, Sn as faClipboardList, Uc as faUserGraduate, Ul as LinearScale, Yo as faRotate, Zl as index, bl as useApp, d as useTranslation, da as faLayerGroup, eu as plugin_title, f as Bar, ft as faBookOpen, ii as faFlag, in as faChevronRight, jc as faUniversity, ji as faHandshake, m as Line, os as faSearch, ot as faBell, p as Doughnut, pa as faLightbulb, qa as faMoon, qs as faSun, ru as require_react, so as faPenFancy, ti as faFilter, tu as plugin_tooltip, v as motion, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/EmsDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var EmsDashboard = () => {
	const { t } = useTranslation();
	const { theme, setActiveTab, currentUser, toggleTheme } = useApp();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filters, setFilters] = (0, import_react.useState)({
		institution: "",
		campus: "",
		department: "",
		academic_year: "",
		date_from: "",
		date_to: ""
	});
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const isDark = theme === "dark";
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
	const shellBg = isDark ? "linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)" : "linear-gradient(135deg, #f8faff 0%, #fdfdff 45%, #eef2ff 100%)";
	const mockData = {
		totalInstitutions: 12,
		totalCampuses: 48,
		totalDepartments: 156,
		totalStudents: 28450,
		activeStudents: 27120,
		newAdmissions: 1240,
		totalTeachers: 1850,
		activeTeachers: 1720,
		totalEmployees: 3420,
		attendanceToday: 25480,
		studentsPresent: 23890,
		studentsAbsent: 1590,
		pendingFees: 285e4,
		collectedFees: 124e5,
		monthlyRevenue: 42e5,
		studentGrowth: [
			8200,
			9400,
			10300,
			11500,
			12800,
			14200,
			15800,
			17600,
			19500,
			21800,
			24400,
			28450
		],
		admissionTrend: [
			320,
			410,
			380,
			520,
			480,
			610,
			550,
			700,
			650,
			780,
			720,
			1240
		],
		attendanceAnalytics: {
			present: 23890,
			absent: 1590,
			late: 780
		},
		departmentPerformance: [
			{
				name: "Science",
				avg: 88,
				students: 5200
			},
			{
				name: "Arts",
				avg: 82,
				students: 4100
			},
			{
				name: "Commerce",
				avg: 85,
				students: 3800
			},
			{
				name: "Engineering",
				avg: 90,
				students: 6200
			},
			{
				name: "Medical",
				avg: 92,
				students: 3400
			},
			{
				name: "Law",
				avg: 84,
				students: 2100
			},
			{
				name: "IT",
				avg: 91,
				students: 3650
			}
		],
		feeCollection: [
			32e5,
			38e5,
			35e5,
			41e5,
			39e5,
			45e5,
			42e5,
			48e5,
			46e5,
			51e5,
			49e5,
			55e5
		],
		recentActivities: [
			{
				id: 1,
				type: "Student Registered",
				entity: "Ali Ahmed",
				dept: "Computer Science",
				time: "2 min ago",
				icon: faUserPlus,
				color: "#6366f1"
			},
			{
				id: 2,
				type: "Admission Approved",
				entity: "Sara Khan",
				dept: "Business Admin",
				time: "15 min ago",
				icon: faCheckCircle,
				color: "#10b981"
			},
			{
				id: 3,
				type: "Teacher Joined",
				entity: "Dr. Usman Malik",
				dept: "Mathematics",
				time: "1 hour ago",
				icon: faChalkboardTeacher,
				color: "#3b82f6"
			},
			{
				id: 4,
				type: "Attendance Marked",
				entity: "Class 10-A",
				dept: "Science",
				time: "2 hours ago",
				icon: faClipboardList,
				color: "#f59e0b"
			},
			{
				id: 5,
				type: "Assignment Submitted",
				entity: "Physics Project",
				dept: "Engineering",
				time: "3 hours ago",
				icon: faBookOpen,
				color: "#ec4899"
			},
			{
				id: 6,
				type: "Exam Created",
				entity: "Mid-Term Exams",
				dept: "All Departments",
				time: "5 hours ago",
				icon: faPenFancy,
				color: "#8b5cf6"
			},
			{
				id: 7,
				type: "Result Published",
				entity: "Spring Semester",
				dept: "All",
				time: "1 day ago",
				icon: faTrophy,
				color: "#14b8a6"
			},
			{
				id: 8,
				type: "Fee Paid",
				entity: "Batch 2024-28",
				dept: "Engineering",
				time: "1 day ago",
				icon: faMoneyBillWave,
				color: "#ef4444"
			}
		],
		upcomingEvents: [
			{
				id: 1,
				title: "Final Term Exams",
				date: "Aug 15-30",
				type: "Exam",
				icon: faPenFancy,
				color: "#ef4444"
			},
			{
				id: 2,
				title: "Independence Day",
				date: "Aug 14",
				type: "Holiday",
				icon: faStar,
				color: "#10b981"
			},
			{
				id: 3,
				title: "Faculty Meeting",
				date: "Aug 10",
				type: "Meeting",
				icon: faHandshake,
				color: "#3b82f6"
			},
			{
				id: 4,
				title: "Fee Submission Deadline",
				date: "Aug 20",
				type: "Deadline",
				icon: faFlag,
				color: "#f59e0b"
			},
			{
				id: 5,
				title: "Sports Gala",
				date: "Aug 25",
				type: "Event",
				icon: faTrophy,
				color: "#8b5cf6"
			},
			{
				id: 6,
				title: "Parent-Teacher Meeting",
				date: "Sep 5",
				type: "Meeting",
				icon: faHandshake,
				color: "#06b6d4"
			}
		],
		aiInsights: [
			{
				id: 1,
				title: "Declining Attendance",
				desc: "15 students have <75% attendance this month",
				severity: "high",
				icon: faExclamationTriangle,
				color: "#ef4444"
			},
			{
				id: 2,
				title: "Academic Risk",
				desc: "28 students scored below 40% in mid-terms",
				severity: "high",
				icon: faLightbulb,
				color: "#f59e0b"
			},
			{
				id: 3,
				title: "Pending Fee Alerts",
				desc: "Rs. 2.85M fee outstanding from 340 students",
				severity: "medium",
				icon: faMoneyBillWave,
				color: "#f59e0b"
			},
			{
				id: 4,
				title: "Upcoming Deadlines",
				desc: "5 assignment submissions due this week",
				severity: "low",
				icon: faClock,
				color: "#3b82f6"
			},
			{
				id: 5,
				title: "Department Attention",
				desc: "Science dept. has 23% vacancy in faculty",
				severity: "medium",
				icon: faBuilding,
				color: "#8b5cf6"
			}
		]
	};
	const loadDashboardData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 800));
		} catch (err) {
			console.error("Error loading EMS Dashboard", err);
		} finally {
			setLoading(false);
		}
	}, [filters]);
	(0, import_react.useEffect)(() => {
		loadDashboardData();
		const interval = setInterval(() => {
			setNotifications((prev) => [...prev]);
		}, 3e4);
		return () => clearInterval(interval);
	}, [filters, loadDashboardData]);
	const handleApplyFilters = () => {
		loadDashboardData();
	};
	const handleResetFilters = () => {
		setFilters({
			institution: "",
			campus: "",
			department: "",
			academic_year: "",
			date_from: "",
			date_to: ""
		});
	};
	const d = mockData;
	const studentGrowthData = {
		labels: [
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul"
		],
		datasets: [{
			label: "Total Students",
			data: d.studentGrowth,
			borderColor: "#6366f1",
			backgroundColor: (ctx) => {
				const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
				g.addColorStop(0, "rgba(99, 102, 241, 0.35)");
				g.addColorStop(1, "rgba(99, 102, 241, 0)");
				return g;
			},
			fill: true,
			tension: .4,
			pointRadius: 4,
			pointBackgroundColor: "#6366f1",
			pointBorderColor: "#fff",
			pointBorderWidth: 2
		}]
	};
	const admissionTrendData = {
		labels: [
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul"
		],
		datasets: [{
			label: "New Admissions",
			data: d.admissionTrend,
			backgroundColor: "rgba(16, 185, 129, 0.7)",
			borderColor: "#10b981",
			borderWidth: 1,
			borderRadius: 6
		}]
	};
	const attendanceAnalyticsData = {
		labels: [
			"Present",
			"Absent",
			"Late"
		],
		datasets: [{
			data: [
				d.attendanceAnalytics.present,
				d.attendanceAnalytics.absent,
				d.attendanceAnalytics.late
			],
			backgroundColor: [
				"#10b981",
				"#ef4444",
				"#f59e0b"
			],
			borderWidth: 0,
			hoverOffset: 8
		}]
	};
	const deptPerfData = {
		labels: d.departmentPerformance.map((dp) => dp.name),
		datasets: [{
			label: "Avg. Performance %",
			data: d.departmentPerformance.map((dp) => dp.avg),
			backgroundColor: [
				"rgba(99, 102, 241, 0.7)",
				"rgba(16, 185, 129, 0.7)",
				"rgba(245, 158, 11, 0.7)",
				"rgba(59, 130, 246, 0.7)",
				"rgba(239, 68, 68, 0.7)",
				"rgba(139, 92, 246, 0.7)",
				"rgba(6, 182, 212, 0.7)"
			],
			borderRadius: 6
		}]
	};
	const feeCollectionData = {
		labels: [
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul"
		],
		datasets: [{
			label: "Fee Collection (Rs.)",
			data: d.feeCollection,
			borderColor: "#f59e0b",
			backgroundColor: "rgba(245, 158, 11, 0.1)",
			fill: true,
			tension: .4,
			pointRadius: 3,
			pointBackgroundColor: "#f59e0b"
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
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3",
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
					5
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl col-lg-4 col-md-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "140px",
							borderRadius: "18px",
							background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "skeleton-line w-50 mb-3",
								style: {
									height: "15px",
									background: isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "skeleton-line w-75 mb-2",
								style: {
									height: "25px",
									background: isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "skeleton-line w-25",
								style: {
									height: "10px",
									background: isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb"
								}
							})
						]
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row mt-4 g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "350px",
							borderRadius: "18px",
							background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "350px",
							borderRadius: "18px",
							background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
						}
					})
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `ems-root ems-dashboard-container p-2 ${isDark ? "text-white" : ""}`,
		style: {
			background: shellBg,
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "card border-0 text-white rounded-4 h-100 p-0 shadow-sm ems-welcome-hero",
						style: {
							borderRadius: "24px",
							overflow: "hidden"
						},
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .5 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-blob hero-blob-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-blob hero-blob-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-blob hero-blob-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 premium-hero-content",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex flex-column h-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex flex-wrap align-items-center gap-2 mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "badge text-white px-3 py-1.5 rounded-pill x-small fw-bold d-flex align-items-center gap-1.5",
												style: {
													background: "rgba(255,255,255,0.16)",
													backdropFilter: "blur(12px)",
													border: "1px solid rgba(255,255,255,0.22)"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "live-dot",
													style: {
														width: "6px",
														height: "6px",
														backgroundColor: "#4ade80",
														boxShadow: "0 0 10px #4ade80"
													}
												}), "Premium Education Command Center"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "badge text-white-50 px-3 py-1.5 rounded-pill x-small fw-semibold",
												style: {
													background: "rgba(255,255,255,0.08)",
													backdropFilter: "blur(12px)",
													border: "1px solid rgba(255,255,255,0.12)"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faUniversity,
													className: "me-1",
													style: { fontSize: "9px" }
												}), "Intelligent Campus Operations"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "row align-items-center g-4 flex-grow-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-7",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
														className: "fw-bold mb-2",
														style: {
															fontSize: "30px",
															letterSpacing: "-0.03em",
															lineHeight: 1.1
														},
														children: ["Welcome back, ", currentUser?.name?.split(" ")[0] || "Education Admin"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-white-50 mb-4",
														style: {
															fontSize: "13.8px",
															fontWeight: "500",
															maxWidth: "560px",
															lineHeight: 1.6
														},
														children: "Elevate every campus decision with a refined command center for enrollment, attendance, academic insight, fees, and institutional performance."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex flex-wrap gap-2.5 mt-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															className: "btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white border-0 hover-lift d-flex align-items-center gap-2",
															style: {
																fontSize: "12.5px",
																background: "linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.09))",
																backdropFilter: "blur(12px)",
																border: "1px solid rgba(255,255,255,0.22)"
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChartBar }), "Open Analytics"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: toggleTheme,
															className: "btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white hover-lift d-flex align-items-center gap-2",
															style: {
																fontSize: "12.5px",
																background: "rgba(255,255,255,0.08)",
																backdropFilter: "blur(12px)",
																border: "1px solid rgba(255,255,255,0.14)"
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: isDark ? faSun : faMoon }), isDark ? "Light Mode" : "Dark Mode"]
														})]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "row g-2",
													children: [
														{
															label: "Present Today",
															value: d.studentsPresent,
															color: "#4ade80"
														},
														{
															label: "Absent Today",
															value: d.studentsAbsent,
															color: "#fb7185"
														},
														{
															label: "New Admissions",
															value: d.newAdmissions,
															color: "#fbbf24"
														},
														{
															label: "Active Teachers",
															value: d.activeTeachers,
															color: "#60a5fa"
														}
													].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "col-6",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "p-3 rounded-3 text-center premium-stat-card",
															style: {
																background: "rgba(255,255,255,0.09)",
																backdropFilter: "blur(12px)",
																border: "1px solid rgba(255,255,255,0.12)"
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "h3 fw-bold mb-0",
																style: { color: stat.color },
																children: stat.value.toLocaleString()
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "x-small text-white-50 fw-semibold mt-1",
																children: stat.label
															})]
														})
													}, stat.label))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 p-2 rounded-3 d-flex align-items-center justify-content-between",
													style: {
														background: "rgba(255,255,255,0.06)",
														border: "1px solid rgba(255,255,255,0.08)"
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "x-small text-white-50",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faBell,
															className: "me-1"
														}), " 3 new notifications"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "x-small text-white-50 fw-semibold",
														style: { opacity: .7 },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronRight })
													})]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-white",
											style: { borderColor: "rgba(255,255,255,0.12)" },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small",
													style: { background: "rgba(255,255,255,0.08)" },
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faUniversity,
															className: "me-1",
															style: { fontSize: "9px" }
														}),
														" ",
														d.totalInstitutions,
														" Institutions"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small",
													style: { background: "rgba(255,255,255,0.08)" },
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faLayerGroup,
															className: "me-1",
															style: { fontSize: "9px" }
														}),
														" ",
														d.totalDepartments,
														" Departments"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small",
													style: { background: "rgba(255,255,255,0.08)" },
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faUserGraduate,
															className: "me-1",
															style: { fontSize: "9px" }
														}),
														" ",
														d.totalStudents.toLocaleString(),
														" Students"
													]
												})
											]
										})
									]
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: `card border-0 shadow-sm rounded-4 h-100 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: {
							borderRadius: "20px",
							background: isDark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.95)",
							boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)"
						},
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .5,
							delay: .1
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										fontSize: "15px",
										color: textColor
									},
									children: "Student Composition"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1.5 x-small fw-semibold d-flex align-items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faArrowUp,
											style: { fontSize: "9px" }
										}),
										" ",
										d.totalStudents.toLocaleString(),
										" Total"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center mb-2",
								style: { height: "140px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "position-relative",
									style: {
										width: "130px",
										height: "130px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: {
											labels: [
												"Active",
												"Inactive",
												"New"
											],
											datasets: [{
												data: [
													d.activeStudents,
													d.totalStudents - d.activeStudents,
													d.newAdmissions
												],
												backgroundColor: [
													"#10b981",
													"#94a3b8",
													"#6366f1"
												],
												borderWidth: 0
											}]
										},
										options: {
											responsive: true,
											maintainAspectRatio: false,
											cutout: "78%",
											plugins: {
												legend: { display: false },
												tooltip: { enabled: true }
											},
											elements: { arc: { borderRadius: 4 } }
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-absolute top-50 start-50 translate-middle text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h4 fw-bold mb-0 lh-1",
											style: { color: textColor },
											children: d.activeStudents.toLocaleString()
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: "Active"
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row text-center g-1 mt-1",
								children: [
									{
										label: "Active",
										value: d.activeStudents,
										color: "#10b981"
									},
									{
										label: "Inactive",
										value: d.totalStudents - d.activeStudents,
										color: "#94a3b8"
									},
									{
										label: "New",
										value: d.newAdmissions,
										color: "#6366f1"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										style: { color: item.color },
										children: item.value.toLocaleString()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small",
										style: { color: mutedColor },
										children: item.label
									})]
								}, item.label))
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 rounded-4 mb-4 sticky-top premium-filter-bar ${isDark ? "bg-dark border-1 border-secondary" : ""}`,
				style: {
					top: "80px",
					zIndex: 100,
					borderRadius: "18px",
					background: isDark ? "rgba(19, 27, 46, 0.9)" : "rgba(255,255,255,0.85)",
					backdropFilter: "blur(16px)",
					WebkitBackdropFilter: "blur(16px)",
					border: `1px solid ${borderColor}`,
					boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center justify-content-between mb-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faFilter,
								className: "text-primary",
								style: { fontSize: "12px" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small fw-bold text-muted text-uppercase",
								style: { letterSpacing: "0.5px" },
								children: "Dashboard Filters"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex align-items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "x-small text-muted d-flex align-items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "live-dot",
									style: {
										width: "5px",
										height: "5px",
										backgroundColor: "#4ade80",
										borderRadius: "50%",
										display: "inline-block"
									}
								}), "Auto-refresh 30s"]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-2 align-items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small text-muted fw-semibold mb-1 d-block",
									style: { color: mutedColor },
									children: "Institution"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm premium-select",
									value: filters.institution,
									onChange: (e) => setFilters({
										...filters,
										institution: e.target.value
									}),
									style: {
										borderRadius: "10px",
										border: `1px solid ${borderColor}`,
										background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
										fontSize: "12.5px",
										padding: "8px 12px",
										color: textColor
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Institutions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1",
											children: "Main Campus"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2",
											children: "City College"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "3",
											children: "National University"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small text-muted fw-semibold mb-1 d-block",
									style: { color: mutedColor },
									children: "Campus"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm premium-select",
									value: filters.campus,
									onChange: (e) => setFilters({
										...filters,
										campus: e.target.value
									}),
									style: {
										borderRadius: "10px",
										border: `1px solid ${borderColor}`,
										background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
										fontSize: "12.5px",
										padding: "8px 12px",
										color: textColor
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Campuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1",
											children: "North Campus"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2",
											children: "South Campus"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "3",
											children: "City Campus"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small text-muted fw-semibold mb-1 d-block",
									style: { color: mutedColor },
									children: "Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm premium-select",
									value: filters.department,
									onChange: (e) => setFilters({
										...filters,
										department: e.target.value
									}),
									style: {
										borderRadius: "10px",
										border: `1px solid ${borderColor}`,
										background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
										fontSize: "12.5px",
										padding: "8px 12px",
										color: textColor
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Departments"
									}), d.departmentPerformance.map((dp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: dp.name,
										children: dp.name
									}, dp.name))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small text-muted fw-semibold mb-1 d-block",
									style: { color: mutedColor },
									children: "Academic Year"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm premium-select",
									value: filters.academic_year,
									onChange: (e) => setFilters({
										...filters,
										academic_year: e.target.value
									}),
									style: {
										borderRadius: "10px",
										border: `1px solid ${borderColor}`,
										background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
										fontSize: "12.5px",
										padding: "8px 12px",
										color: textColor
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Years"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2024-25",
											children: "2024-25"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2025-26",
											children: "2025-26"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2026-27",
											children: "2026-27"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small text-muted fw-semibold mb-1 d-block",
									style: { color: mutedColor },
									children: "Search"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "position-relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "position-absolute top-50 translate-middle-y ms-2",
										style: {
											left: "5px",
											zIndex: 5,
											color: mutedColor
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faSearch,
											size: "xs"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm ps-4 premium-input",
										placeholder: "Search Students...",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										style: {
											borderRadius: "10px",
											border: `1px solid ${borderColor}`,
											background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
											fontSize: "12.5px",
											padding: "8px 12px",
											color: textColor
										}
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2 d-flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm flex-grow-1 fw-semibold premium-btn-primary",
									onClick: handleApplyFilters,
									style: {
										borderRadius: "10px",
										fontSize: "12px",
										padding: "8px 16px",
										background: "linear-gradient(135deg, #6366f1, #4f46e5)",
										border: "none",
										color: "#fff"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faFilter,
										className: "me-1",
										style: { fontSize: "10px" }
									}), " Apply"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-outline-secondary border premium-btn-outline",
									onClick: handleResetFilters,
									style: {
										borderRadius: "10px",
										fontSize: "12px",
										padding: "8px 12px",
										color: mutedColor,
										borderColor
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faRotate,
										style: { fontSize: "10px" }
									})
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Institutions",
						value: d.totalInstitutions,
						icon: faUniversity,
						color: "#6366f1",
						subText: "Campuses: 48 | Depts: 156",
						trend: "up",
						trendValue: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Total Students",
						value: d.totalStudents.toLocaleString(),
						icon: faUserGraduate,
						color: "#10b981",
						subText: "Active: 27,120 | New: 1,240",
						trend: "up",
						trendValue: "8.5%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Total Teachers",
						value: d.totalTeachers,
						icon: faChalkboardTeacher,
						color: "#3b82f6",
						subText: "Active: 1,720 | Employees: 3,420",
						trend: "up",
						trendValue: "3.2%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Attendance Today",
						value: d.attendanceToday.toLocaleString(),
						icon: faClipboardList,
						color: "#f59e0b",
						subText: `Present: ${d.studentsPresent.toLocaleString()} | Absent: ${d.studentsAbsent}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Fee Collection",
						value: `Rs. ${(d.collectedFees / 1e6).toFixed(1)}M`,
						icon: faMoneyBillWave,
						color: "#ef4444",
						subText: `Pending: Rs. ${(d.pendingFees / 1e5).toFixed(1)}L`,
						trend: "up",
						trendValue: "12.3%"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						label: "Add Student",
						icon: faUserPlus,
						color: "#6366f1",
						bg: "rgba(99,102,241,0.1)",
						desc: "New enrollment"
					},
					{
						label: "New Admission",
						icon: faGraduationCap,
						color: "#10b981",
						bg: "rgba(16,185,129,0.1)",
						desc: "Process admission"
					},
					{
						label: "Add Teacher",
						icon: faChalkboardTeacher,
						color: "#3b82f6",
						bg: "rgba(59,130,246,0.1)",
						desc: "Hire faculty"
					},
					{
						label: "Mark Attendance",
						icon: faClipboardList,
						color: "#f59e0b",
						bg: "rgba(245,158,11,0.1)",
						desc: "Daily attendance"
					},
					{
						label: "Create Class",
						icon: faBookOpen,
						color: "#ec4899",
						bg: "rgba(236,72,153,0.1)",
						desc: "New section"
					},
					{
						label: "Create Assignment",
						icon: faPenFancy,
						color: "#8b5cf6",
						bg: "rgba(139,92,246,0.1)",
						desc: "Assign work"
					},
					{
						label: "Examination",
						icon: faStar,
						color: "#ef4444",
						bg: "rgba(239,68,68,0.1)",
						desc: "Create exam"
					},
					{
						label: "Collect Fees",
						icon: faMoneyBillWave,
						color: "#14b8a6",
						bg: "rgba(20,184,166,0.1)",
						desc: "Fee collection"
					},
					{
						label: "Schedule Meeting",
						icon: faHandshake,
						color: "#06b6d4",
						bg: "rgba(6,182,212,0.1)",
						desc: "Plan meeting"
					},
					{
						label: "Send Announcement",
						icon: faBullhorn,
						color: "#f97316",
						bg: "rgba(249,115,22,0.1)",
						desc: "Broadcast"
					}
				].map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					className: "col-6 col-md-3 col-xl",
					whileHover: { y: -3 },
					transition: {
						type: "spring",
						stiffness: 300,
						damping: 20
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn w-100 py-3 rounded-4 border-0 premium-quick-action d-flex align-items-center gap-3 h-100 text-start",
						style: {
							background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
							border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
							boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
							borderRadius: "14px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 premium-action-icon",
								style: {
									width: "40px",
									height: "40px",
									background: act.bg
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: act.icon,
									style: {
										color: act.color,
										fontSize: "16px"
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-bold text-nowrap",
									style: {
										color: textColor,
										fontSize: "12.5px"
									},
									children: act.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "x-small text-muted text-nowrap",
									style: {
										fontSize: "10.5px",
										color: mutedColor
									},
									children: act.desc
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faArrowRight,
								className: "ms-auto flex-shrink-0 premium-action-arrow",
								style: {
									color: act.color,
									fontSize: "11px",
									opacity: .4
								}
							})
						]
					})
				}, act.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-7",
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
								children: "Student Growth Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small",
								style: { color: mutedColor },
								children: "Last 12 months"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { height: "240px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								data: studentGrowthData,
								options: chartOptions("Student Growth")
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								children: "Admission Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small",
								style: { color: mutedColor },
								children: "Monthly"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { height: "240px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								data: admissionTrendData,
								options: chartOptions("Admissions")
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							style: { borderRadius: "18px" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center justify-content-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "fw-bold mb-0",
										style: {
											fontSize: "15px",
											color: textColor
										},
										children: "Attendance Analytics"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "x-small",
										style: { color: mutedColor },
										children: "Today"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center",
									style: { height: "200px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-relative",
										style: {
											width: "180px",
											height: "180px"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
											data: attendanceAnalyticsData,
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "h3 fw-bold mb-0 lh-1",
												style: { color: textColor },
												children: [(d.studentsPresent / d.attendanceToday * 100).toFixed(1), "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "x-small",
												style: { color: mutedColor },
												children: "Present"
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "row text-center g-2 mt-2",
									children: [
										{
											label: "Present",
											value: d.attendanceAnalytics.present,
											color: "#10b981"
										},
										{
											label: "Absent",
											value: d.attendanceAnalytics.absent,
											color: "#ef4444"
										},
										{
											label: "Late",
											value: d.attendanceAnalytics.late,
											color: "#f59e0b"
										}
									].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-bold small",
											style: { color: item.color },
											children: item.value.toLocaleString()
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: item.label
										})]
									}, item.label))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
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
									children: "Department Performance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "x-small",
									style: { color: mutedColor },
									children: "Avg. %"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "240px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: deptPerfData,
									options: {
										...chartOptions("Performance"),
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
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
									children: "Fee Collection"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "x-small",
									style: { color: mutedColor },
									children: "Monthly trend"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "240px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									data: feeCollectionData,
									options: chartOptions("Fee Collection")
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-7",
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
								children: "Recent Activities"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 fw-semibold",
								style: {
									color: "#6366f1",
									fontSize: "11px"
								},
								children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faChevronRight,
									size: "xs"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-auto",
							style: { maxHeight: "380px" },
							children: d.recentActivities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								initial: {
									opacity: 0,
									x: -10
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: idx * .05 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "38px",
											height: "38px",
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
										className: "flex-grow-1 min-width-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: act.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												act.entity,
												" · ",
												act.dept
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small text-end flex-shrink-0",
										style: {
											color: mutedColor,
											whiteSpace: "nowrap"
										},
										children: act.time
									})
								]
							}, act.id))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								children: "Upcoming Events"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCalendarAlt,
								style: { color: mutedColor }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-auto",
							style: { maxHeight: "380px" },
							children: d.upcomingEvents.map((evt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								initial: {
									opacity: 0,
									x: 10
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: idx * .05 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "42px",
											height: "42px",
											background: `${evt.color}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: evt.icon,
											style: {
												color: evt.color,
												fontSize: "16px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: evt.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: evt.date
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill px-2 py-1 x-small fw-semibold flex-shrink-0",
										style: {
											background: `${evt.color}15`,
											color: evt.color,
											border: `1px solid ${evt.color}30`
										},
										children: evt.type
									})
								]
							}, evt.id))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faLightbulb,
									style: {
										color: "#f59e0b",
										fontSize: "16px"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										fontSize: "15px",
										color: textColor
									},
									children: "AI Insights"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge rounded-pill px-3 py-1.5 x-small fw-semibold",
								style: {
									background: "rgba(99,102,241,0.1)",
									color: "#6366f1"
								},
								children: "Powered by AI"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-3",
							children: d.aiInsights.map((insight, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								className: "col-md-6",
								initial: {
									opacity: 0,
									y: 10
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { delay: idx * .08 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-4 d-flex align-items-start gap-3 h-100",
									style: {
										background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
										border: `1px solid ${borderColor}`
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "40px",
											height: "40px",
											background: `${insight.color}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: insight.icon,
											style: {
												color: insight.color,
												fontSize: "16px"
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "small fw-bold mb-1",
										style: { color: textColor },
										children: [
											insight.title,
											insight.severity === "high" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ms-2 badge bg-danger rounded-pill x-small",
												children: "Urgent"
											}),
											insight.severity === "medium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ms-2 badge bg-warning text-dark rounded-pill x-small",
												children: "Moderate"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small",
										style: { color: mutedColor },
										children: insight.desc
									})] })]
								})
							}, insight.id))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBell,
									style: {
										color: "#6366f1",
										fontSize: "16px"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										fontSize: "15px",
										color: textColor
									},
									children: "Notifications"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-danger rounded-pill px-2 py-1 x-small",
								children: "3"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex flex-column gap-2",
							children: [
								{
									title: "Unread Notifications",
									desc: "12 pending notifications from admin",
									color: "#6366f1",
									bg: "rgba(99,102,241,0.1)"
								},
								{
									title: "Attendance Alerts",
									desc: "5 students marked absent without reason",
									color: "#ef4444",
									bg: "rgba(239,68,68,0.1)"
								},
								{
									title: "Fee Alerts",
									desc: "340 students have pending fee > 30 days",
									color: "#f59e0b",
									bg: "rgba(245,158,11,0.1)"
								},
								{
									title: "Exam Alerts",
									desc: "Mid-term exams start in 2 weeks",
									color: "#10b981",
									bg: "rgba(16,185,129,0.1)"
								}
							].map((notif, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								className: "p-3 rounded-4 d-flex align-items-start gap-3",
								style: {
									background: notif.bg,
									border: `1px solid ${notif.color}20`
								},
								initial: {
									opacity: 0,
									x: 10
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { delay: idx * .08 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-circle d-flex align-items-center justify-content-center flex-shrink-0",
									style: {
										width: "10px",
										height: "10px",
										background: notif.color,
										marginTop: "4px"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-bold",
									style: { color: textColor },
									children: notif.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "x-small",
									style: { color: mutedColor },
									children: notif.desc
								})] })]
							}, notif.title))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .ems-welcome-hero {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%) !important;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 15px 35px -8px rgba(99, 102, 241, 0.35) !important;
          transition: all 0.3s ease;
        }
        .premium-hero-content {
          position: relative;
          z-index: 2;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.3;
          pointer-events: none;
          z-index: 1;
        }
        .hero-blob-1 {
          width: 300px;
          height: 300px;
          background: #c084fc;
          top: -120px;
          right: -60px;
          animation: heroFloat 12s infinite alternate ease-in-out;
        }
        .hero-blob-2 {
          width: 250px;
          height: 250px;
          background: #38bdf8;
          bottom: -100px;
          left: 20%;
          animation: heroFloat2 15s infinite alternate ease-in-out;
        }
        .hero-blob-3 {
          width: 180px;
          height: 180px;
          background: #fb7185;
          top: 30%;
          left: -80px;
          animation: heroFloat 9s infinite alternate-reverse ease-in-out;
        }
        @keyframes heroFloat {
          0% { transform: translateY(0) translateX(0) scale(1); }
          100% { transform: translateY(25px) translateX(15px) scale(1.1); }
        }
        @keyframes heroFloat2 {
          0% { transform: translateY(0) translateX(0) scale(1); }
          100% { transform: translateY(-20px) translateX(-10px) scale(1.05); }
        }
        .animate-pulse-badge {
          animation: pulseBadge 2s infinite;
        }
        @keyframes pulseBadge {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .premium-stat-card {
          transition: all 0.25s ease;
        }
        .premium-stat-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.12) !important;
        }
        .premium-quick-action {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.95)) !important;
        }
        .premium-quick-action:hover {
          box-shadow: 0 12px 24px rgba(99,102,241,0.14) !important;
          border-color: rgba(99,102,241,0.2) !important;
          transform: translateY(-3px);
        }
        .premium-quick-action:hover .premium-action-icon {
          transform: scale(1.05);
        }
        .premium-quick-action:hover .premium-action-arrow {
          opacity: 1 !important;
          transform: translateX(2px);
        }
        .premium-action-icon {
          transition: all 0.25s ease;
        }
        .premium-action-arrow {
          transition: all 0.25s ease;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
        }
        .x-small {
          font-size: 11px;
        }
        .skeleton-card {
          border-radius: 18px;
        }
        .skeleton-line {
          border-radius: 4px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .premium-select:focus, .premium-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
        }
        .premium-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
        }
        .premium-btn-outline:hover {
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"} !important;
          border-color: #6366f1 !important;
        }
      ` } })
		]
	});
};
var KPICard = ({ title, value, icon, color, subText, trend, trendValue }) => {
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
			className: "card border-0 shadow-sm h-100 hover-lift transition",
			style: {
				borderRadius: "20px",
				background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))",
				boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-start mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-3 d-flex align-items-center justify-content-center",
							style: {
								background: `${color}15`,
								color,
								boxShadow: `inset 0 0 0 1px ${color}14`
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
						className: "text-muted small fw-bold text-uppercase mb-1",
						style: {
							fontSize: "10.5px",
							letterSpacing: "0.3px"
						},
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h3 fw-bold mb-1",
						style: { fontSize: "22px" },
						children: value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted x-small",
						style: { fontSize: "10.5px" },
						children: subText
					})
				]
			})
		})
	});
};
//#endregion
export { EmsDashboard as default };
