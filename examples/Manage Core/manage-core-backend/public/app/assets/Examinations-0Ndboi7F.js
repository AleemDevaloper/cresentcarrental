import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ar as faFileAlt, Ci as faGraduationCap, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, P as faArrowLeft, Po as faQuestionCircle, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, os as faSearch, rs as faSave, ru as require_react, uc as faTimes, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Examinations/Examinations.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEPARTMENTS = [
	"Science",
	"Arts",
	"Commerce",
	"Engineering",
	"Medical",
	"IT"
];
var SUBJECTS = [
	"Mathematics",
	"Physics",
	"Chemistry",
	"Biology",
	"English",
	"Urdu",
	"Computer Science",
	"Economics",
	"History"
];
var CLASSES = [
	"Class 9",
	"Class 10",
	"Class 11",
	"Class 12",
	"BS 1",
	"BS 2",
	"BS 3",
	"BS 4"
];
var EXAM_TYPES = [
	"Quiz",
	"Midterm",
	"Final",
	"Practical"
];
var STATUSES = [
	"Upcoming",
	"Running",
	"Completed",
	"Cancelled"
];
var initialForm = {
	name: "",
	subject: "",
	class: "",
	examType: "Midterm",
	date: "",
	duration: "60",
	totalMarks: 100,
	passingMarks: 40,
	room: "",
	description: ""
};
var Examinations = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		department: "",
		subject: "",
		examType: "",
		status: ""
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialForm);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [showQuestions, setShowQuestions] = (0, import_react.useState)(false);
	const [showMarksEntry, setShowMarksEntry] = (0, import_react.useState)(false);
	const [marksData, setMarksData] = (0, import_react.useState)({});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
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
					name: "Mid-Term Physics",
					subject: "Physics",
					class: "Class 10",
					date: "2025-08-20",
					duration: "90 min",
					totalMarks: 100,
					status: "Upcoming"
				},
				{
					id: 2,
					name: "Final Mathematics",
					subject: "Mathematics",
					class: "Class 12",
					date: "2025-08-25",
					duration: "180 min",
					totalMarks: 200,
					status: "Upcoming"
				},
				{
					id: 3,
					name: "Chemistry Quiz 2",
					subject: "Chemistry",
					class: "Class 11",
					date: "2025-08-15",
					duration: "30 min",
					totalMarks: 30,
					status: "Running"
				},
				{
					id: 4,
					name: "English Literature Final",
					subject: "English",
					class: "Class 10",
					date: "2025-08-10",
					duration: "120 min",
					totalMarks: 100,
					status: "Completed"
				},
				{
					id: 5,
					name: "CS Practical",
					subject: "Computer Science",
					class: "BS CS",
					date: "2025-08-18",
					duration: "60 min",
					totalMarks: 50,
					status: "Running"
				},
				{
					id: 6,
					name: "Biology Midterm",
					subject: "Biology",
					class: "Class 11",
					date: "2025-08-05",
					duration: "90 min",
					totalMarks: 75,
					status: "Completed"
				}
			]);
		} catch (err) {
			setError(err.message || "Failed to load examinations");
		} finally {
			setLoading(false);
		}
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(initialForm);
		setQuestions([]);
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			name: item.name || "",
			subject: item.subject || "",
			class: item.class || "",
			examType: item.examType || "Midterm",
			date: item.date || "",
			duration: item.duration?.replace(" min", "") || "60",
			totalMarks: item.totalMarks || 100,
			passingMarks: item.passingMarks || 40,
			room: item.room || "",
			description: item.description || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.subject || !formData.class || !formData.date) {
			addNotification?.("Please fill all required fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.(editItem ? "Exam updated successfully" : "Exam created successfully", "success");
			setShowModal(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving exam", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this exam?")) return;
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Exam deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const addQuestion = () => {
		setQuestions([...questions, {
			id: Date.now(),
			question: "",
			marks: 5
		}]);
	};
	const removeQuestion = (id) => {
		setQuestions(questions.filter((q) => q.id !== id));
	};
	const updateQuestion = (id, field, value) => {
		setQuestions(questions.map((q) => q.id === id ? {
			...q,
			[field]: value
		} : q));
	};
	const getStatusBadge = (status) => {
		const map = {
			Upcoming: "info",
			Running: "success",
			Completed: "secondary",
			Cancelled: "danger"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge bg-${map[status]}-subtle text-${map[status]} rounded-pill`,
			children: status
		});
	};
	const mockMarks = [
		{
			id: 1,
			student: "Ali Ahmed",
			rollNo: "S-001",
			marks: ""
		},
		{
			id: 2,
			student: "Sara Khan",
			rollNo: "S-002",
			marks: ""
		},
		{
			id: 3,
			student: "Usman Ali",
			rollNo: "S-003",
			marks: ""
		}
	];
	if (showMarksEntry) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-sm btn-outline-secondary rounded-3",
				onClick: () => setShowMarksEntry(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faArrowLeft,
					className: "me-1"
				}), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
				className: "fw-bold mb-0",
				style: { color: textColor },
				children: "Marks Entry"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-body p-4",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Marks" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: mockMarks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "ps-4 fw-semibold small",
							children: m.student
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: m.rollNo }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: { maxWidth: "120px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								className: "form-control form-control-sm",
								placeholder: "Marks",
								onChange: (e) => setMarksData({
									...marksData,
									[m.id]: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "pe-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm btn-primary rounded-3",
								onClick: () => {
									addNotification?.("Marks saved", "success");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faSave,
									className: "me-1"
								}), " Save"]
							})
						})
					] }, m.id)) })]
				})
			})
		})]
	});
	if (showQuestions) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-sm btn-outline-secondary rounded-3",
				onClick: () => setShowQuestions(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faArrowLeft,
					className: "me-1"
				}), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
				className: "fw-bold mb-0",
				style: { color: textColor },
				children: "Question Paper Builder"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							className: "fw-bold mb-0",
							style: { color: textColor },
							children: [
								"Questions (",
								questions.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm btn-primary rounded-3",
							onClick: addQuestion,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-1"
							}), " Add Question"]
						})]
					}),
					questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-5 text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faQuestionCircle,
							className: "fs-1 mb-3 opacity-50"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "small",
							children: "No questions added yet. Click \"Add Question\" to start building."
						})]
					}) : questions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 mb-3 rounded-3",
						style: {
							background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
							border: `1px solid ${borderColor}`
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "fw-bold small",
									style: { color: textColor },
									children: ["Q", idx + 1]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-outline-danger rounded-3",
									onClick: () => removeQuestion(q.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "form-control form-control-sm mb-2 rounded-3",
								rows: "2",
								placeholder: "Enter question...",
								value: q.question,
								onChange: (e) => updateQuestion(q.id, "question", e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-2 align-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "x-small text-muted me-2",
										children: "Marks:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										className: "form-control form-control-sm d-inline-block",
										style: { width: "80px" },
										value: q.marks,
										onChange: (e) => updateQuestion(q.id, "marks", Number(e.target.value))
									})]
								})
							})
						]
					}, q.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mt-3 pt-3",
						style: { borderTop: `1px solid ${borderColor}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "small text-muted",
							children: ["Total Marks: ", questions.reduce((sum, q) => sum + (q.marks || 0), 0)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary rounded-3 px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSave,
								className: "me-1"
							}), " Save Paper"]
						})]
					})
				]
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
					children: "Examinations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage exams, schedules, and results"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Exam"]
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
									placeholder: "Search exams...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.department,
								onChange: (e) => setFilters({
									...filters,
									department: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Departments"
								}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))]
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
								value: filters.examType,
								onChange: (e) => setFilters({
									...filters,
									examType: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Types"
								}), EXAM_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-1",
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
										department: "",
										subject: "",
										examType: "",
										status: ""
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
										children: "Exam Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subject" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Duration" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Total Marks" }),
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
									icon: faGraduationCap,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No exams found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Create a new exam to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faGraduationCap,
										className: "text-primary opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.name
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
								children: item.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.duration
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small fw-bold",
								children: item.totalMarks
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => setShowQuestions(true),
										title: "Question Paper",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileAlt })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => setShowMarksEntry(true),
										title: "Marks Entry",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle })
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
								children: editItem ? "Edit Exam" : "Add Exam"
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
												children: ["Exam Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.name,
												onChange: (e) => setFormData({
													...formData,
													name: e.target.value
												}),
												placeholder: "e.g. Mid-Term Physics"
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Exam Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.examType,
												onChange: (e) => setFormData({
													...formData,
													examType: e.target.value
												}),
												children: EXAM_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "form-control rounded-3",
												required: true,
												value: formData.date,
												onChange: (e) => setFormData({
													...formData,
													date: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Duration (minutes)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control rounded-3",
												value: formData.duration,
												onChange: (e) => setFormData({
													...formData,
													duration: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Room"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.room,
												onChange: (e) => setFormData({
													...formData,
													room: e.target.value
												}),
												placeholder: "e.g. Hall A"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
											className: "col-md-6",
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
												placeholder: "Exam description / instructions"
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
										icon: faGraduationCap,
										className: "me-2"
									}), editItem ? "Update Exam" : "Create Exam"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { Examinations as default };
