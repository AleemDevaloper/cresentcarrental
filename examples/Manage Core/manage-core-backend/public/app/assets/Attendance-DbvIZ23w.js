import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Br as faFileExport, Cn as faClock, Dl as require_jsx_runtime, Kt as faChalkboardTeacher, Nt as faCalendarAlt, Qt as faCheck, Rc as faUserCheck, Yo as faRotate, at as faBed, bl as useApp, d as useTranslation, dc as faTimesCircle, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Attendance/Attendance.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"Present",
	"Absent",
	"Late",
	"Leave"
];
var STATUS_COLORS = {
	Present: {
		bg: "#10b981",
		label: "Present"
	},
	Absent: {
		bg: "#ef4444",
		label: "Absent"
	},
	Late: {
		bg: "#f59e0b",
		label: "Late"
	},
	Leave: {
		bg: "#6366f1",
		label: "Leave"
	}
};
var Attendance = () => {
	const { t } = useTranslation();
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [activeTab, setActiveTab] = (0, import_react.useState)("students");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [classId, setClassId] = (0, import_react.useState)("");
	const [subjectId, setSubjectId] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		institution: "",
		campus: "",
		department: "",
		class: "",
		section: "",
		subject: "",
		date_from: "",
		date_to: ""
	});
	const [attendance, setAttendance] = (0, import_react.useState)({});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const mockStudents = [
		{
			id: 1,
			name: "Ali Ahmed",
			roll: "CS-001",
			class: "CS-3A"
		},
		{
			id: 2,
			name: "Sara Khan",
			roll: "CS-002",
			class: "CS-3A"
		},
		{
			id: 3,
			name: "Usman Ali",
			roll: "CS-003",
			class: "CS-3A"
		},
		{
			id: 4,
			name: "Fatima Zahra",
			roll: "CS-004",
			class: "CS-3A"
		},
		{
			id: 5,
			name: "Hassan Raza",
			roll: "CS-005",
			class: "CS-3A"
		},
		{
			id: 6,
			name: "Ayesha Malik",
			roll: "CS-006",
			class: "CS-3A"
		},
		{
			id: 7,
			name: "Bilal Ahmed",
			roll: "CS-007",
			class: "CS-3A"
		},
		{
			id: 8,
			name: "Zainab Noor",
			roll: "CS-008",
			class: "CS-3A"
		}
	];
	const mockTeachers = [
		{
			id: 1,
			name: "Dr. Usman Malik",
			department: "Computer Science"
		},
		{
			id: 2,
			name: "Prof. Sara Khan",
			department: "Mathematics"
		},
		{
			id: 3,
			name: "Dr. Ali Ahmed",
			department: "Physics"
		},
		{
			id: 4,
			name: "Ms. Fatima Noor",
			department: "English"
		}
	];
	const mockClasses = [
		{
			id: 1,
			name: "CS-3A"
		},
		{
			id: 2,
			name: "BBA-2B"
		},
		{
			id: 3,
			name: "ENG-1A"
		}
	];
	const mockSubjects = [
		{
			id: 1,
			name: "Data Structures",
			code: "CS-201"
		},
		{
			id: 2,
			name: "Calculus I",
			code: "MATH-101"
		},
		{
			id: 3,
			name: "English Composition",
			code: "ENG-101"
		}
	];
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 400));
			const initial = {};
			mockStudents.forEach((s) => {
				initial[s.id] = "Present";
			});
			setAttendance(initial);
		} catch (err) {
			console.error("Error loading attendance", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const markAll = (status) => {
		const updated = {};
		mockStudents.forEach((s) => {
			updated[s.id] = status;
		});
		setAttendance(updated);
		addNotification?.(`All marked as ${status}`, "success");
	};
	const markStudent = (id, status) => {
		setAttendance((prev) => ({
			...prev,
			[id]: status
		}));
	};
	const handleBulkSubmit = () => {
		addNotification?.("Attendance saved successfully", "success");
	};
	const counts = {
		Present: Object.values(attendance).filter((v) => v === "Present").length,
		Absent: Object.values(attendance).filter((v) => v === "Absent").length,
		Late: Object.values(attendance).filter((v) => v === "Late").length,
		Leave: Object.values(attendance).filter((v) => v === "Leave").length
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "skeleton-line w-25 mb-4",
			style: {
				height: "30px",
				borderRadius: "4px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row g-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card skeleton-card p-4 border-0 shadow-sm",
					style: {
						height: "400px",
						borderRadius: "18px",
						background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
					}
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Attendance Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCalendarAlt,
						className: "me-1"
					}), new Date(date).toLocaleDateString("en-US", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-success rounded-3 px-4",
					onClick: handleBulkSubmit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCheck,
						className: "me-2"
					}), "Save Attendance"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Class"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: classId,
								onChange: (e) => setClassId(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select Class"
								}), mockClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Subject"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: subjectId,
								onChange: (e) => setSubjectId(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select Subject"
								}), mockSubjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-6 d-flex align-items-end gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-outline-primary rounded-3",
									onClick: () => setActiveTab("students"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUserCheck,
										className: "me-1"
									}), "Students"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-outline-secondary rounded-3",
									onClick: () => setActiveTab("teachers"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faChalkboardTeacher,
										className: "me-1"
									}), "Teachers"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-outline-info rounded-3",
									onClick: () => setActiveTab("report"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faFileExport,
										className: "me-1"
									}), "Report"]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3 align-items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Institution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.institution,
								onChange: (e) => setFilters({
									...filters,
									institution: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1",
									children: "Main Campus"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Campus"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.campus,
								onChange: (e) => setFilters({
									...filters,
									campus: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1",
									children: "North Campus"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Department"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.department,
								onChange: (e) => setFilters({
									...filters,
									department: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1",
									children: "Computer Science"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Section"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.section,
								onChange: (e) => setFilters({
									...filters,
									section: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "A",
									children: "Section A"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Date From"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.date_from,
								onChange: (e) => setFilters({
									...filters,
									date_from: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Date To"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									value: filters.date_to,
									onChange: (e) => setFilters({
										...filters,
										date_to: e.target.value
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-outline-secondary rounded-3",
									onClick: () => setFilters({
										institution: "",
										campus: "",
										department: "",
										class: "",
										section: "",
										subject: "",
										date_from: "",
										date_to: ""
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRotate })
								})]
							})]
						})
					]
				})
			}),
			activeTab === "students" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "fw-semibold small",
						style: { color: textColor },
						children: "Bulk Mark:"
					}), STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-sm rounded-pill px-3 fw-semibold",
						style: {
							background: `${STATUS_COLORS[status].bg}15`,
							color: STATUS_COLORS[status].bg,
							border: `1px solid ${STATUS_COLORS[status].bg}30`,
							fontSize: "11px"
						},
						onClick: () => markAll(status),
						children: status
					}, status))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-3",
					children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "small fw-semibold",
						style: { color: STATUS_COLORS[status].bg },
						children: [
							status,
							": ",
							counts[status]
						]
					}, status))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
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
										style: { width: "50px" },
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Roll No" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-center",
										style: { width: "300px" },
										children: "Attendance"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: mockStudents.map((student, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4 small text-muted",
								children: idx + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "fw-semibold small",
								children: student.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: student.roll }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: student.class
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex gap-1 justify-content-center",
								children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: `btn btn-sm rounded-pill px-3 fw-semibold transition ${attendance[student.id] === status ? "shadow-sm" : ""}`,
									style: {
										background: attendance[student.id] === status ? `${STATUS_COLORS[status].bg}20` : "transparent",
										color: attendance[student.id] === status ? STATUS_COLORS[status].bg : mutedColor,
										border: `1px solid ${attendance[student.id] === status ? STATUS_COLORS[status].bg : borderColor}`,
										fontSize: "11px"
									},
									onClick: () => markStudent(student.id, status),
									children: [
										status === "Present" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheckCircle,
											className: "me-1"
										}),
										status === "Absent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTimesCircle,
											className: "me-1"
										}),
										status === "Late" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faClock,
											className: "me-1"
										}),
										status === "Leave" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faBed,
											className: "me-1"
										}),
										status
									]
								}, status))
							}) })
						] }, student.id)) })]
					})
				})
			})] }),
			activeTab === "teachers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
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
										style: { width: "50px" },
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Teacher Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-center",
										style: { width: "300px" },
										children: "Attendance"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: mockTeachers.map((teacher, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4 small text-muted",
								children: idx + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "fw-semibold small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faChalkboardTeacher,
									className: "me-2 text-muted"
								}), teacher.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: teacher.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex gap-1 justify-content-center",
								children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn btn-sm rounded-pill px-3 fw-semibold transition`,
									style: {
										background: "transparent",
										color: mutedColor,
										border: `1px solid ${borderColor}`,
										fontSize: "11px"
									},
									children: status
								}, status))
							}) })
						] }, teacher.id)) })]
					})
				})
			}),
			activeTab === "report" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "fw-bold mb-3",
						style: { color: textColor },
						children: "Attendance Report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-4 mb-4",
						children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-4 text-center",
								style: {
									background: `${STATUS_COLORS[status].bg}10`,
									border: `1px solid ${STATUS_COLORS[status].bg}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: STATUS_COLORS[status].bg },
									children: counts[status]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: status
								})]
							})
						}, status))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "progress",
						style: {
							height: "12px",
							borderRadius: "10px"
						},
						children: STATUSES.map((status) => {
							const total = Object.keys(attendance).length;
							const pct = total > 0 ? counts[status] / total * 100 : 0;
							return pct > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress-bar",
								style: {
									width: `${pct}%`,
									background: STATUS_COLORS[status].bg,
									borderRadius: status === "Present" ? "10px 0 0 10px" : status === "Leave" ? "0 10px 10px 0" : "0"
								}
							}, status) : null;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex justify-content-center gap-4 mt-3",
						children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								background: STATUS_COLORS[status].bg,
								display: "inline-block"
							} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "small fw-semibold text-muted",
								children: [
									status,
									" (",
									counts[status],
									")"
								]
							})]
						}, status))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
        .transition { transition: all 0.2s ease; }
        .skeleton-card { border-radius: 18px; }
        .skeleton-line { border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      ` })
		]
	});
};
//#endregion
export { Attendance as default };
