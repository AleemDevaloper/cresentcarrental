import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ao as faPrint, Br as faFileExport, Bs as faStar, Ci as faGraduationCap, Cr as faExclamationTriangle, Dl as require_jsx_runtime, G as faArrowUp, Uc as faUserGraduate, bl as useApp, d as useTranslation, dc as faTimesCircle, f as Bar, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Examinations/Grades.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GRADES_SYSTEM = [
	{
		min: 90,
		grade: "A+",
		gpa: 4
	},
	{
		min: 85,
		grade: "A",
		gpa: 3.7
	},
	{
		min: 80,
		grade: "B+",
		gpa: 3.3
	},
	{
		min: 75,
		grade: "B",
		gpa: 3
	},
	{
		min: 70,
		grade: "C+",
		gpa: 2.7
	},
	{
		min: 65,
		grade: "C",
		gpa: 2.3
	},
	{
		min: 60,
		grade: "D+",
		gpa: 2
	},
	{
		min: 50,
		grade: "D",
		gpa: 1.7
	},
	{
		min: 0,
		grade: "F",
		gpa: 0
	}
];
var getGrade = (marks) => {
	return GRADES_SYSTEM.find((g) => marks >= g.min) || GRADES_SYSTEM[GRADES_SYSTEM.length - 1];
};
var SUBJECTS = [
	"Mathematics",
	"Physics",
	"Chemistry",
	"Biology",
	"English",
	"Computer Science"
];
var Grades = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		class: "",
		subject: ""
	});
	const [selectedStudent, setSelectedStudent] = (0, import_react.useState)(null);
	const [showReportCard, setShowReportCard] = (0, import_react.useState)(false);
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData([
				{
					id: 1,
					student: "Ali Ahmed",
					rollNo: "S-001",
					class: "Class 10",
					subject: "Physics",
					marks: 85,
					status: "Pass"
				},
				{
					id: 2,
					student: "Sara Khan",
					rollNo: "S-002",
					class: "Class 10",
					subject: "Physics",
					marks: 72,
					status: "Pass"
				},
				{
					id: 3,
					student: "Usman Ali",
					rollNo: "S-003",
					class: "Class 10",
					subject: "Physics",
					marks: 45,
					status: "Fail"
				},
				{
					id: 4,
					student: "Fatima Noor",
					rollNo: "S-004",
					class: "Class 10",
					subject: "Mathematics",
					marks: 91,
					status: "Pass"
				},
				{
					id: 5,
					student: "Hassan Raza",
					rollNo: "S-005",
					class: "Class 10",
					subject: "Mathematics",
					marks: 63,
					status: "Pass"
				},
				{
					id: 6,
					student: "Ayesha Malik",
					rollNo: "S-006",
					class: "Class 10",
					subject: "Chemistry",
					marks: 78,
					status: "Pass"
				},
				{
					id: 7,
					student: "Bilal Ahmed",
					rollNo: "S-007",
					class: "Class 10",
					subject: "Chemistry",
					marks: 38,
					status: "Fail"
				},
				{
					id: 8,
					student: "Zainab Ali",
					rollNo: "S-008",
					class: "Class 10",
					subject: "English",
					marks: 88,
					status: "Pass"
				}
			]);
		} catch (err) {
			setError(err.message || "Failed to load grades");
		} finally {
			setLoading(false);
		}
	};
	const gradeDistData = {
		labels: [
			"A+",
			"A",
			"B+",
			"B",
			"C+",
			"C",
			"D",
			"F"
		],
		datasets: [{
			label: "Students",
			data: [
				"A+",
				"A",
				"B+",
				"B",
				"C+",
				"C",
				"D",
				"F"
			].map((g) => data.filter((item) => getGrade(item.marks).grade === g).length),
			backgroundColor: [
				"#10b981",
				"#34d399",
				"#6366f1",
				"#8b5cf6",
				"#f59e0b",
				"#f97316",
				"#ef4444",
				"#dc2626"
			],
			borderRadius: 6
		}]
	};
	const total = data.length;
	const passed = data.filter((d) => d.status === "Pass").length;
	const failed = data.filter((d) => d.status === "Fail").length;
	const passRate = total ? (passed / total * 100).toFixed(1) : 0;
	const chartOpts = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
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
	if (showReportCard && selectedStudent) {
		const subMarks = data.filter((d) => d.student === selectedStudent.student);
		const avgMarks = subMarks.reduce((s, m) => s + m.marks, 0) / (subMarks.length || 1);
		const overallGrade = getGrade(avgMarks);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-0",
					style: { color: textColor },
					children: "Report Card Preview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-sm btn-outline-secondary rounded-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPrint,
							className: "me-1"
						}), " Print"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-sm btn-primary rounded-3",
						onClick: () => setShowReportCard(false),
						children: "Close"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faGraduationCap,
									className: "fs-1 text-primary mb-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "fw-bold",
									children: selectedStudent.student
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted small mb-1",
									children: [
										"Roll No: ",
										selectedStudent.rollNo,
										" | Class: ",
										selectedStudent.class
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted small",
									children: "Academic Year 2024-2025"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-3 mb-4",
							children: subMarks.map((sub) => {
								const g = getGrade(sub.marks);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-3",
										style: {
											background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
											border: `1px solid ${borderColor}`
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "small fw-bold",
												children: sub.subject
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h4 fw-bold mb-0",
												style: { color: sub.status === "Pass" ? "#10b981" : "#ef4444" },
												children: sub.marks
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "x-small text-muted",
												children: [
													"Grade: ",
													g.grade,
													" (GPA: ",
													g.gpa,
													")"
												]
											})
										]
									})
								}, sub.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-3",
							style: {
								background: "rgba(99,102,241,0.05)",
								border: `1px solid rgba(99,102,241,0.2)`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: "Average Marks"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "h3 fw-bold",
											style: { color: textColor },
											children: [avgMarks.toFixed(1), "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: "Overall Grade"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h3 fw-bold",
											style: { color: "#6366f1" },
											children: overallGrade.grade
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: "GPA"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h3 fw-bold",
											style: { color: "#10b981" },
											children: overallGrade.gpa.toFixed(1)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h3 fw-bold ${subMarks.some((s) => s.status === "Fail") ? "text-danger" : "text-success"}`,
											children: subMarks.some((s) => s.status === "Fail") ? "Fail" : "Pass"
										})]
									})
								]
							})
						})
					]
				})
			})]
		});
	}
	const updateMarksEntry = (id, marks) => {
		setData((prev) => prev.map((d) => {
			if (d.id !== id) return d;
			const m = Number(marks);
			getGrade(m);
			return {
				...d,
				marks: m,
				status: m >= 50 ? "Pass" : "Fail"
			};
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Grades"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage student grades, report cards, and analytics"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faFileExport,
						className: "me-2"
					}), "Export"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Total Records",
						value: total,
						icon: faStar,
						color: "#6366f1"
					},
					{
						title: "Passed",
						value: passed,
						icon: faCheckCircle,
						color: "#10b981",
						trend: `${passRate}%`
					},
					{
						title: "Failed",
						value: failed,
						icon: faTimesCircle,
						color: "#ef4444"
					},
					{
						title: "Pass Rate",
						value: `${passRate}%`,
						icon: faArrowUp,
						color: "#10b981"
					}
				].map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-3 col-md-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex justify-content-between align-items-start mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-3 rounded-4",
										style: { backgroundColor: `${stat.color}1a` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: stat.icon,
											style: { color: stat.color }
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "text-muted small mb-1",
									children: stat.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "fw-bold mb-0",
									style: { color: textColor },
									children: stat.value
								}),
								stat.trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "x-small text-success fw-semibold",
									children: [stat.trend, " Rate"]
								})
							]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ps-5 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search by student name or roll no...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.class,
								onChange: (e) => setFilters({
									...filters,
									class: e.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Classes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Class 10",
										children: "Class 10"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Class 11",
										children: "Class 11"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Class 12",
										children: "Class 12"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.subject,
								onChange: (e) => setFilters({
									...filters,
									subject: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Subjects"
								}), SUBJECTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 w-100",
								onClick: () => {
									setSearch("");
									setFilters({
										class: "",
										subject: ""
									});
								},
								children: "Reset"
							})
						})
					]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-close ms-auto",
						onClick: () => setError(null)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "ps-4",
												children: "Student Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Roll No" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subject" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Marks" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Grade" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "GPA" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pe-4",
												children: "Status"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
								}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									colSpan: "7",
									className: "text-center py-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faStar,
										className: "fs-1 text-muted opacity-50 mb-3"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold",
										children: "No grade records found"
									})]
								}) }) : data.map((item) => {
									const grade = getGrade(item.marks);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "ps-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faUserGraduate,
													className: "text-primary opacity-50"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-semibold small cursor-pointer",
													style: { color: textColor },
													onClick: () => {
														setSelectedStudent(item);
														setShowReportCard(true);
													},
													children: item.student
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.rollNo }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: item.subject
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: { minWidth: "100px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control form-control-sm",
												style: { width: "80px" },
												value: item.marks,
												onChange: (e) => updateMarksEntry(item.id, e.target.value)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill ${grade.grade === "F" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`,
											children: grade.grade
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small fw-bold",
											children: grade.gpa.toFixed(1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "pe-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `badge rounded-pill ${item.status === "Pass" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: item.status === "Pass" ? faCheckCircle : faTimesCircle,
													className: "me-1"
												}), item.status]
											})
										})
									] }, item.id);
								}) })]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Grade Distribution"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "200px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: gradeDistData,
										options: chartOpts
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Pass Percentage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-grow-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress rounded-pill",
											style: { height: "12px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress-bar bg-success",
												style: { width: `${passRate}%` }
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "fw-bold h5 mb-0",
										style: { color: textColor },
										children: [passRate, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between small text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-success",
										children: passed
									}), " Passed"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-danger",
										children: failed
									}), " Failed"] })]
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { Grades as default };
