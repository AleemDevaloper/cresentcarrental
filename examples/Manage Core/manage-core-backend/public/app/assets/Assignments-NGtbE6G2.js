import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, P as faArrowLeft, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, io as faPaperclip, os as faSearch, ru as require_react, sr as faDownload, ut as faBook, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Assignments/Assignments.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SUBJECTS = [
	"Mathematics",
	"Physics",
	"Chemistry",
	"Biology",
	"English",
	"Urdu",
	"Computer Science",
	"History",
	"Geography",
	"Islamic Studies"
];
var CLASSES = [
	"Class 6",
	"Class 7",
	"Class 8",
	"Class 9",
	"Class 10",
	"Class 11",
	"Class 12",
	"BS CS",
	"BS SE",
	"BS AI"
];
var TEACHERS = [
	"Dr. Ahmad Khan",
	"Prof. Sara Ali",
	"Mr. Usman Malik",
	"Ms. Fatima Noor",
	"Dr. Hassan Raza"
];
var STATUSES = [
	"Draft",
	"Published",
	"Closed"
];
var SUBMISSION_TYPES = [
	"File",
	"Text",
	"Both"
];
var initialForm = {
	title: "",
	description: "",
	subject: "",
	class: "",
	teacher: "",
	dueDate: "",
	totalMarks: 100,
	passingMarks: 40,
	submissionType: "File",
	instructions: "",
	attachments: ""
};
var Assignments = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		subject: "",
		teacher: "",
		class: "",
		status: "",
		dateFrom: "",
		dateTo: ""
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialForm);
	const [viewSubmissions, setViewSubmissions] = (0, import_react.useState)(null);
	const [gradeData, setGradeData] = (0, import_react.useState)({});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
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
					title: "Physics Lab Report",
					subject: "Physics",
					class: "Class 10",
					teacher: "Dr. Ahmad Khan",
					dueDate: "2025-08-15",
					submissions: 28,
					totalStudents: 35,
					status: "Published"
				},
				{
					id: 2,
					title: "Math Assignment 3",
					subject: "Mathematics",
					class: "Class 9",
					teacher: "Prof. Sara Ali",
					dueDate: "2025-08-20",
					submissions: 22,
					totalStudents: 30,
					status: "Published"
				},
				{
					id: 3,
					title: "Chemistry Essay",
					subject: "Chemistry",
					class: "Class 11",
					teacher: "Mr. Usman Malik",
					dueDate: "2025-08-25",
					submissions: 15,
					totalStudents: 25,
					status: "Draft"
				},
				{
					id: 4,
					title: "English Literature Review",
					subject: "English",
					class: "Class 8",
					teacher: "Ms. Fatima Noor",
					dueDate: "2025-08-10",
					submissions: 32,
					totalStudents: 32,
					status: "Closed"
				},
				{
					id: 5,
					title: "CS Project Proposal",
					subject: "Computer Science",
					class: "BS CS",
					teacher: "Dr. Hassan Raza",
					dueDate: "2025-09-01",
					submissions: 18,
					totalStudents: 20,
					status: "Published"
				},
				{
					id: 6,
					title: "Biology Diagram",
					subject: "Biology",
					class: "Class 10",
					teacher: "Dr. Ahmad Khan",
					dueDate: "2025-08-18",
					submissions: 0,
					totalStudents: 35,
					status: "Draft"
				}
			]);
		} catch (err) {
			setError(err.message || "Failed to load assignments");
		} finally {
			setLoading(false);
		}
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(initialForm);
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			title: item.title || "",
			description: item.description || "",
			subject: item.subject || "",
			class: item.class || "",
			teacher: item.teacher || "",
			dueDate: item.dueDate || "",
			totalMarks: item.totalMarks || 100,
			passingMarks: item.passingMarks || 40,
			submissionType: item.submissionType || "File",
			instructions: item.instructions || "",
			attachments: item.attachments || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.subject || !formData.class || !formData.teacher || !formData.dueDate) {
			addNotification?.("Please fill all required fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.(editItem ? "Assignment updated successfully" : "Assignment created successfully", "success");
			setShowModal(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving assignment", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this assignment?")) return;
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Assignment deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const getStatusBadge = (status) => {
		const map = {
			Draft: "warning",
			Published: "success",
			Closed: "secondary"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge bg-${map[status]}-subtle text-${map[status]} rounded-pill`,
			children: status
		});
	};
	const mockSubmissions = [
		{
			id: 1,
			student: "Ali Ahmed",
			rollNo: "S-001",
			submittedAt: "2025-08-14 10:30",
			file: "report.pdf",
			marks: null,
			status: "pending"
		},
		{
			id: 2,
			student: "Sara Khan",
			rollNo: "S-002",
			submittedAt: "2025-08-14 11:00",
			file: "report.docx",
			marks: 85,
			status: "graded"
		},
		{
			id: 3,
			student: "Usman Ali",
			rollNo: "S-003",
			submittedAt: "2025-08-13 09:15",
			file: "report.pdf",
			marks: null,
			status: "pending"
		},
		{
			id: 4,
			student: "Fatima Noor",
			rollNo: "S-004",
			submittedAt: "2025-08-12 14:00",
			file: "essay.pdf",
			marks: 92,
			status: "graded"
		}
	];
	const updateGrade = (submissionId, marks) => {
		setGradeData((prev) => ({
			...prev,
			[submissionId]: {
				...prev[submissionId],
				marks
			}
		}));
	};
	const saveGrade = async (submissionId) => {
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Grade saved successfully", "success");
		} catch (err) {
			addNotification?.(err.message || "Failed to save grade", "danger");
		}
	};
	if (viewSubmissions) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-sm btn-outline-secondary rounded-3",
						onClick: () => setViewSubmissions(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faArrowLeft,
							className: "me-1"
						}), " Back"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: ["Submissions: ", viewSubmissions.title]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `badge rounded-pill ${viewSubmissions.status === "Published" ? "bg-success" : "bg-warning"}`,
						children: viewSubmissions.status
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "small text-muted",
					children: [
						mockSubmissions.filter((s) => s.status === "graded").length,
						" / ",
						mockSubmissions.length,
						" Graded"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-sm btn-primary rounded-pill",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faDownload,
						className: "me-1"
					}), " Export"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Student"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Roll No" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Submitted At" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "File" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Marks" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Feedback" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: mockSubmissions.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "fw-semibold small",
									children: sub.student
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "small",
								children: sub.rollNo
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: sub.submittedAt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "badge bg-light text-dark rounded-pill",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPaperclip,
									className: "me-1"
								}), sub.file]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								style: { minWidth: "120px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										className: "form-control form-control-sm",
										style: { width: "70px" },
										defaultValue: sub.marks || "",
										placeholder: "Marks",
										onChange: (e) => updateGrade(sub.id, e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "x-small text-muted",
										children: "/100"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								className: "form-control form-control-sm",
								placeholder: "Feedback",
								style: { minWidth: "120px" }
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "pe-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-success rounded-3",
									onClick: () => saveGrade(sub.id),
									disabled: sub.status === "graded",
									children: sub.status === "graded" ? "Graded" : "Save"
								})
							})
						] }, sub.id)) })]
					})
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Assignments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage assignments, submissions, and grading"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Assignment"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ps-5 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search assignments...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.teacher,
								onChange: (e) => setFilters({
									...filters,
									teacher: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Teachers"
								}), TEACHERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.class,
								onChange: (e) => setFilters({
									...filters,
									class: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Classes"
								}), CLASSES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.status,
								onChange: (e) => setFilters({
									...filters,
									status: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Status"
								}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
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
										subject: "",
										teacher: "",
										class: "",
										status: "",
										dateFrom: "",
										dateTo: ""
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Title"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subject" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Teacher" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Due Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Submissions" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBook,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No assignments found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Create a new assignment to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBook,
										className: "text-primary opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.title
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.class
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.teacher
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.dueDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `fw-semibold small ${item.submissions === item.totalStudents ? "text-success" : item.submissions > 0 ? "text-warning" : "text-muted"}`,
								children: [
									item.submissions,
									"/",
									item.totalStudents
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress rounded-pill",
								style: {
									height: "4px",
									width: "60px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress-bar",
									style: {
										width: `${item.submissions / (item.totalStudents || 1) * 100}%`,
										background: item.submissions === item.totalStudents ? "#10b981" : "#f59e0b"
									}
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => setViewSubmissions(item),
										title: "View Submissions",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEye })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => openEditForm(item),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-danger rounded-3",
										onClick: () => handleDelete(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
									})
								]
							})
						] }, item.id)) })]
					})
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editItem ? "Edit Assignment" : "Add Assignment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.title,
												onChange: (e) => setFormData({
													...formData,
													title: e.target.value
												}),
												placeholder: "Assignment title"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Description"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "form-control rounded-3",
												rows: "3",
												value: formData.description,
												onChange: (e) => setFormData({
													...formData,
													description: e.target.value
												}),
												placeholder: "Assignment description"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Subject ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												required: true,
												value: formData.subject,
												onChange: (e) => setFormData({
													...formData,
													subject: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Subject"
												}), SUBJECTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: s
												}, s))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Class ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												required: true,
												value: formData.class,
												onChange: (e) => setFormData({
													...formData,
													class: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Class"
												}), CLASSES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c,
													children: c
												}, c))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Teacher ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												required: true,
												value: formData.teacher,
												onChange: (e) => setFormData({
													...formData,
													teacher: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Teacher"
												}), TEACHERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Due Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "form-control rounded-3",
												required: true,
												value: formData.dueDate,
												onChange: (e) => setFormData({
													...formData,
													dueDate: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Total Marks"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control rounded-3",
												value: formData.totalMarks,
												onChange: (e) => setFormData({
													...formData,
													totalMarks: Number(e.target.value)
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Passing Marks"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control rounded-3",
												value: formData.passingMarks,
												onChange: (e) => setFormData({
													...formData,
													passingMarks: Number(e.target.value)
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Submission Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.submissionType,
												onChange: (e) => setFormData({
													...formData,
													submissionType: e.target.value
												}),
												children: SUBMISSION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Attachments"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												className: "form-control rounded-3"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Instructions"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "form-control rounded-3",
												rows: "3",
												value: formData.instructions,
												onChange: (e) => setFormData({
													...formData,
													instructions: e.target.value
												}),
												placeholder: "Instructions for students..."
											})]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "btn btn-primary rounded-3 px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBook,
										className: "me-2"
									}), editItem ? "Update Assignment" : "Create Assignment"]
								})]
							})]
						})]
					})
				})
			})
		]
	});
};
//#endregion
export { Assignments as default };
