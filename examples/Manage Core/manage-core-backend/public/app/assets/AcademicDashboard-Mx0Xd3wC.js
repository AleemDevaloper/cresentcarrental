import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Ci as faGraduationCap, Cn as faClock, Dl as require_jsx_runtime, Do as faPlus, G as faArrowUp, Hl as LineElement, I as faArrowRight, Il as BarElement, Kl as PointElement, Kt as faChalkboardTeacher, Nt as faCalendarAlt, Pl as ArcElement, Rl as CategoryScale, Uc as faUserGraduate, Ul as LinearScale, Xn as faCubes, Xt as faChartPie, Zl as index, bl as useApp, d as useTranslation, da as faLayerGroup, eu as plugin_title, f as Bar, ft as faBookOpen, ga as faList, jc as faUniversity, m as Line, or as faDoorOpen, p as Doughnut, ru as require_react, tu as plugin_tooltip, ut as faBook, v as motion, vl as FontAwesomeIcon, wo as faPlay, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Academic/AcademicDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var AcademicDashboard = () => {
	const { t } = useTranslation();
	const { theme, setActiveTab } = useApp();
	const isDark = theme === "dark";
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filters, setFilters] = (0, import_react.useState)({
		institution: "",
		campus: "",
		department: "",
		academic_year: ""
	});
	const bgColor = isDark ? "#0b0f1a" : "#f8f9fc";
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const d = {
		academicYears: 6,
		activeSessions: 3,
		semesters: 12,
		faculties: 8,
		departments: 45,
		programs: 28,
		courses: 320,
		subjects: 580,
		classes: 156,
		sections: 420,
		batches: 95,
		teachersAssigned: 185,
		studentsEnrolled: 12450,
		creditHours: 2840,
		departmentDistribution: [
			{
				name: "Computer Science",
				count: 3200
			},
			{
				name: "Business Admin",
				count: 2800
			},
			{
				name: "Engineering",
				count: 2400
			},
			{
				name: "Medical Sciences",
				count: 1800
			},
			{
				name: "Arts & Humanities",
				count: 1200
			},
			{
				name: "Law",
				count: 1050
			}
		],
		programEnrollment: [
			{
				name: "Bachelor",
				count: 7200
			},
			{
				name: "Master",
				count: 3200
			},
			{
				name: "Doctorate",
				count: 850
			},
			{
				name: "Diploma",
				count: 1200
			}
		],
		academicProgress: {
			months: [
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
			gpa: [
				3.1,
				3.2,
				3.15,
				3.25,
				3.3,
				3.28,
				3.35,
				3.4,
				3.38,
				3.42,
				3.45,
				3.5
			],
			passRate: [
				82,
				84,
				83,
				85,
				86,
				85,
				87,
				88,
				87,
				89,
				90,
				91
			]
		}
	};
	const loadDashboard = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 600));
		} catch (err) {
			console.error("Error loading Academic Dashboard", err);
		} finally {
			setLoading(false);
		}
	}, [filters]);
	(0, import_react.useEffect)(() => {
		loadDashboard();
	}, [loadDashboard]);
	const deptChartData = {
		labels: d.departmentDistribution.map((x) => x.name),
		datasets: [{
			label: "Students",
			data: d.departmentDistribution.map((x) => x.count),
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
	const programChartData = {
		labels: d.programEnrollment.map((x) => x.name),
		datasets: [{
			data: d.programEnrollment.map((x) => x.count),
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#ec4899"
			],
			borderWidth: 0,
			hoverOffset: 8
		}]
	};
	const progressChartData = {
		labels: d.academicProgress.months,
		datasets: [{
			label: "Avg GPA",
			data: d.academicProgress.gpa,
			borderColor: "#6366f1",
			backgroundColor: (ctx) => {
				const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
				g.addColorStop(0, "rgba(99,102,241,0.35)");
				g.addColorStop(1, "rgba(99,102,241,0)");
				return g;
			},
			fill: true,
			tension: .4,
			pointRadius: 4,
			pointBackgroundColor: "#6366f1",
			pointBorderColor: "#fff",
			pointBorderWidth: 2,
			yAxisID: "y"
		}, {
			label: "Pass Rate %",
			data: d.academicProgress.passRate,
			borderColor: "#10b981",
			backgroundColor: (ctx) => {
				const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
				g.addColorStop(0, "rgba(16,185,129,0.35)");
				g.addColorStop(1, "rgba(16,185,129,0)");
				return g;
			},
			fill: true,
			tension: .4,
			pointRadius: 4,
			pointBackgroundColor: "#10b981",
			pointBorderColor: "#fff",
			pointBorderWidth: 2,
			yAxisID: "y1"
		}]
	};
	const chartOptions = {
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
	};
	const progressOptions = {
		...chartOptions,
		scales: {
			y: {
				beginAtZero: true,
				grid: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				},
				position: "left"
			},
			y1: {
				beginAtZero: true,
				grid: { display: false },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				},
				position: "right"
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
					5,
					6,
					7
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
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card skeleton-card p-4 border-0 shadow-sm",
						style: {
							height: "350px",
							borderRadius: "18px",
							background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
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
		className: `p-2 ${isDark ? "text-white" : ""}`,
		style: {
			background: bgColor,
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Academic Structure Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Overview of academic setup, programs, courses, subjects, and classes"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-sm px-3 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2 text-white border-0",
						style: { background: "linear-gradient(135deg, #6366f1, #4f46e5)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Quick Setup"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Academic Years",
						value: d.academicYears,
						icon: faCalendarAlt,
						color: "#6366f1",
						subText: `${d.activeSessions} active sessions`,
						trend: "up",
						trendValue: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Semesters",
						value: d.semesters,
						icon: faPlay,
						color: "#10b981",
						subText: "Current & upcoming"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Faculties",
						value: d.faculties,
						icon: faUniversity,
						color: "#3b82f6",
						subText: "Academic divisions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Departments",
						value: d.departments,
						icon: faLayerGroup,
						color: "#f59e0b",
						subText: "Under all faculties",
						trend: "up",
						trendValue: "5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Programs",
						value: d.programs,
						icon: faGraduationCap,
						color: "#ec4899",
						subText: "Degree programs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Courses",
						value: d.courses,
						icon: faBookOpen,
						color: "#8b5cf6",
						subText: `${d.subjects} subjects`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Classes",
						value: d.classes,
						icon: faDoorOpen,
						color: "#14b8a6",
						subText: `${d.sections} sections, ${d.batches} batches`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Teachers Assigned",
						value: d.teachersAssigned,
						icon: faChalkboardTeacher,
						color: "#ef4444",
						subText: "Active faculty",
						trend: "up",
						trendValue: "8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Students Enrolled",
						value: d.studentsEnrolled.toLocaleString(),
						icon: faUserGraduate,
						color: "#06b6d4",
						subText: "Across all programs",
						trend: "up",
						trendValue: "12%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						title: "Credit Hours",
						value: d.creditHours.toLocaleString(),
						icon: faClock,
						color: "#f97316",
						subText: "Total offered"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									children: "Department Distribution"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "By students"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "250px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: deptChartData,
									options: chartOptions
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3",
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
										children: "Program Enrollment"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faChartPie,
										style: { color: mutedColor }
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center",
									style: { height: "200px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-relative",
										style: {
											width: "160px",
											height: "160px"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
											data: programChartData,
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
												style: { color: textColor },
												children: d.studentsEnrolled.toLocaleString()
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "x-small",
												style: { color: mutedColor },
												children: "Total"
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "row text-center g-2 mt-2",
									children: d.programEnrollment.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-semibold",
											style: { color: textColor },
											children: p.count.toLocaleString()
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: p.name
										})]
									}, p.name))
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
									children: "Academic Progress"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "GPA & Pass Rate"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: "250px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									data: progressChartData,
									options: progressOptions
								})
							})]
						})
					})
				]
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
						children: "Quick Links"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-3",
						children: [
							{
								label: "Academic Years",
								icon: faCalendarAlt,
								color: "#6366f1",
								desc: "Manage academic sessions & years",
								link: "academic-years"
							},
							{
								label: "Semesters",
								icon: faPlay,
								color: "#10b981",
								desc: "Configure semesters & terms",
								link: "semesters"
							},
							{
								label: "Faculties",
								icon: faUniversity,
								color: "#3b82f6",
								desc: "Organize faculty structure",
								link: "faculties"
							},
							{
								label: "Departments",
								icon: faLayerGroup,
								color: "#f59e0b",
								desc: "Manage academic departments",
								link: "departments"
							},
							{
								label: "Programs",
								icon: faGraduationCap,
								color: "#ec4899",
								desc: "Define degree programs",
								link: "programs"
							},
							{
								label: "Courses",
								icon: faBookOpen,
								color: "#8b5cf6",
								desc: "Create & manage courses",
								link: "courses"
							},
							{
								label: "Subjects",
								icon: faBook,
								color: "#14b8a6",
								desc: "Subject catalog & mapping",
								link: "subjects"
							},
							{
								label: "Classes",
								icon: faDoorOpen,
								color: "#ef4444",
								desc: "Class & section management",
								link: "classes"
							},
							{
								label: "Sections",
								icon: faList,
								color: "#06b6d4",
								desc: "Organize class sections",
								link: "sections"
							},
							{
								label: "Batches",
								icon: faCubes,
								color: "#f97316",
								desc: "Student batch management",
								link: "batches"
							}
						].map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							className: "col-md-4 col-lg-3 col-xl",
							whileHover: { y: -3 },
							transition: {
								type: "spring",
								stiffness: 300,
								damping: 20
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn w-100 py-3 rounded-4 border-0 d-flex align-items-center gap-3 h-100 text-start",
								style: {
									background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
									border: `1px solid ${borderColor}`,
									boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
									borderRadius: "14px"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "40px",
											height: "40px",
											background: `${link.color}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: link.icon,
											style: {
												color: link.color,
												fontSize: "16px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "overflow-hidden text-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold text-nowrap",
											style: {
												color: textColor,
												fontSize: "12.5px"
											},
											children: link.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted text-nowrap",
											style: {
												color: mutedColor,
												fontSize: "10.5px"
											},
											children: link.desc
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										className: "ms-auto flex-shrink-0",
										style: {
											color: link.color,
											fontSize: "11px",
											opacity: .4
										}
									})
								]
							})
						}, link.label))
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
export { AcademicDashboard as default };
