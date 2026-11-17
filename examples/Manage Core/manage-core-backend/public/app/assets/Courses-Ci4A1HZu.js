import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Ar as faFileAlt, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Uc as faUserGraduate, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, ft as faBookOpen, ga as faList, oc as faTh, os as faSearch, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/LMS/Courses.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Technology",
	"Science",
	"Arts",
	"Business",
	"Language",
	"Mathematics",
	"Engineering"
];
var INSTRUCTORS = [
	"Dr. Ahmad Khan",
	"Prof. Sara Ali",
	"Mr. Usman Malik",
	"Ms. Fatima Noor",
	"Dr. Hassan Raza"
];
var LEVELS = [
	"Beginner",
	"Intermediate",
	"Advanced"
];
var STATUSES = [
	"Draft",
	"Published",
	"Archived"
];
var initialForm = {
	name: "",
	code: "",
	description: "",
	category: "",
	instructor: "",
	level: "Beginner",
	duration: "",
	thumbnail: "",
	status: "Draft"
};
var Courses = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		category: "",
		status: "",
		level: ""
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialForm);
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [selectedCourse, setSelectedCourse] = (0, import_react.useState)(null);
	const [showLessons, setShowLessons] = (0, import_react.useState)(false);
	const [showEnrollments, setShowEnrollments] = (0, import_react.useState)(false);
	const [lessons, setLessons] = (0, import_react.useState)([]);
	const [newLesson, setNewLesson] = (0, import_react.useState)({
		title: "",
		content: "",
		duration: ""
	});
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
					name: "Introduction to AI",
					code: "CS-AI-101",
					category: "Technology",
					instructor: "Dr. Ahmad Khan",
					lessons: 24,
					students: 340,
					status: "Published",
					level: "Beginner",
					duration: "12 weeks",
					thumbnail: ""
				},
				{
					id: 2,
					name: "Web Development Bootcamp",
					code: "CS-WD-201",
					category: "Technology",
					instructor: "Prof. Sara Ali",
					lessons: 36,
					students: 280,
					status: "Published",
					level: "Intermediate",
					duration: "16 weeks",
					thumbnail: ""
				},
				{
					id: 3,
					name: "Data Science Fundamentals",
					code: "CS-DS-301",
					category: "Science",
					instructor: "Mr. Usman Malik",
					lessons: 28,
					students: 250,
					status: "Published",
					level: "Intermediate",
					duration: "14 weeks",
					thumbnail: ""
				},
				{
					id: 4,
					name: "English Communication",
					code: "ENG-101",
					category: "Language",
					instructor: "Ms. Fatima Noor",
					lessons: 20,
					students: 220,
					status: "Published",
					level: "Beginner",
					duration: "8 weeks",
					thumbnail: ""
				},
				{
					id: 5,
					name: "Digital Marketing 101",
					code: "BUS-MKT-101",
					category: "Business",
					instructor: "Dr. Hassan Raza",
					lessons: 18,
					students: 190,
					status: "Draft",
					level: "Beginner",
					duration: "6 weeks",
					thumbnail: ""
				},
				{
					id: 6,
					name: "Advanced Machine Learning",
					code: "CS-ML-401",
					category: "Technology",
					instructor: "Dr. Ahmad Khan",
					lessons: 32,
					students: 120,
					status: "Published",
					level: "Advanced",
					duration: "16 weeks",
					thumbnail: ""
				},
				{
					id: 7,
					name: "Creative Writing",
					code: "ENG-201",
					category: "Arts",
					instructor: "Ms. Fatima Noor",
					lessons: 16,
					students: 150,
					status: "Draft",
					level: "Intermediate",
					duration: "8 weeks",
					thumbnail: ""
				}
			]);
		} catch (err) {
			setError(err.message || "Failed to load courses");
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
			name: item.name || "",
			code: item.code || "",
			description: item.description || "",
			category: item.category || "",
			instructor: item.instructor || "",
			level: item.level || "Beginner",
			duration: item.duration || "",
			thumbnail: item.thumbnail || "",
			status: item.status || "Draft"
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.code || !formData.category) {
			addNotification?.("Please fill all required fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.(editItem ? "Course updated successfully" : "Course created successfully", "success");
			setShowModal(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving course", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this course?")) return;
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Course deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const addLesson = () => {
		if (!newLesson.title) return;
		setLessons([...lessons, {
			...newLesson,
			id: Date.now()
		}]);
		setNewLesson({
			title: "",
			content: "",
			duration: ""
		});
	};
	const removeLesson = (id) => {
		setLessons(lessons.filter((l) => l.id !== id));
	};
	const getStatusBadge = (status) => {
		const map = {
			Draft: "warning",
			Published: "success",
			Archived: "secondary"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge bg-${map[status]}-subtle text-${map[status]} rounded-pill`,
			children: status
		});
	};
	if (showLessons && selectedCourse) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-sm btn-outline-secondary rounded-3",
				onClick: () => setShowLessons(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faList,
					className: "me-1"
				}), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
				className: "fw-bold mb-0",
				style: { color: textColor },
				children: ["Lessons: ", selectedCourse.name]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2 mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							className: "form-control form-control-sm",
							style: { maxWidth: "250px" },
							placeholder: "Lesson title",
							value: newLesson.title,
							onChange: (e) => setNewLesson({
								...newLesson,
								title: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							className: "form-control form-control-sm",
							style: { maxWidth: "80px" },
							placeholder: "Min",
							value: newLesson.duration,
							onChange: (e) => setNewLesson({
								...newLesson,
								duration: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm btn-primary",
							onClick: addLesson,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-1"
							}), " Add"]
						})
					]
				}), lessons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center py-5 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faFileAlt,
						className: "fs-1 mb-3 opacity-50"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "small",
						children: "No lessons added yet"
					})]
				}) : lessons.map((lesson, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3 mb-2 p-3 rounded-3",
					style: {
						background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
						border: `1px solid ${borderColor}`
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge bg-primary rounded-circle",
							children: idx + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-grow-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "fw-semibold small",
								style: { color: textColor },
								children: lesson.title
							}), lesson.duration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ms-2 x-small text-muted",
								children: [
									"(",
									lesson.duration,
									" min)"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm btn-outline-danger rounded-3",
							onClick: () => removeLesson(lesson.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
						})
					]
				}, lesson.id))]
			})
		})]
	});
	if (showEnrollments && selectedCourse) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-3 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-sm btn-outline-secondary rounded-3",
					onClick: () => setShowEnrollments(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faList,
						className: "me-1"
					}), " Back"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
					className: "fw-bold mb-0",
					style: { color: textColor },
					children: ["Enrollments: ", selectedCourse.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "badge bg-primary rounded-pill",
					children: [selectedCourse.students, " students"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Enrolled Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4",
									children: "Status"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
						1,
						2,
						3,
						4,
						5
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "ps-4 d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserGraduate,
								className: "text-primary opacity-50"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fw-semibold small",
								children: ["Student ", i]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "small",
							children: [
								"student",
								i,
								"@example.com"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "small",
							children: [
								"2025-0",
								i,
								"-10"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: { minWidth: "120px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress rounded-pill flex-grow-1",
									style: { height: "6px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar",
										style: {
											width: `${i * 18}%`,
											background: i * 18 > 70 ? "#10b981" : "#6366f1"
										}
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "x-small fw-bold",
									children: [i * 18, "%"]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "pe-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill ${i * 18 >= 100 ? "bg-success" : "bg-primary"}`,
								children: i * 18 >= 100 ? "Completed" : "Active"
							})
						})
					] }, i)) })]
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
					children: "Courses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage courses, lessons, and enrollments"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Course"]
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
									placeholder: "Search courses...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.category,
								onChange: (e) => setFilters({
									...filters,
									category: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Categories"
								}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.level,
								onChange: (e) => setFilters({
									...filters,
									level: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Levels"
								}), LEVELS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: l,
									children: l
								}, l))]
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-3 d-flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 flex-grow-1",
								onClick: () => {
									setSearch("");
									setFilters({
										category: "",
										status: "",
										level: ""
									});
								},
								children: "Reset"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "btn-group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`,
									onClick: () => setViewMode("grid"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTh })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-secondary"}`,
									onClick: () => setViewMode("table"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faList })
								})]
							})]
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
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
			}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4 col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 overflow-hidden transition hover-lift ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { cursor: "pointer" },
						onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-4px)",
						onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 text-center",
							style: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center mx-auto",
								style: {
									width: "64px",
									height: "64px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBookOpen,
									className: "fs-3 text-white"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-start mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-1",
										style: { color: textColor },
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "x-small",
										children: item.code
									})] }), getStatusBadge(item.status)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "small text-muted mb-3",
									children: [
										item.instructor,
										" · ",
										item.level
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between small text-muted mb-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileAlt,
												className: "me-1"
											}),
											item.lessons,
											" lessons"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faUsers,
												className: "me-1"
											}),
											item.students,
											" students"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faClock,
											className: "me-1"
										}), item.duration] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-sm btn-light border rounded-3 flex-grow-1",
											onClick: () => {
												setSelectedCourse(item);
												setShowLessons(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileAlt,
												className: "me-1"
											}), " Lessons"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-sm btn-light border rounded-3 flex-grow-1",
											onClick: () => {
												setSelectedCourse(item);
												setShowEnrollments(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faUsers,
												className: "me-1"
											}), " Students"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-light border rounded-3",
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
							]
						})]
					})
				}, item.id)), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-12 text-center py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faBookOpen,
						className: "fs-1 text-muted opacity-50 mb-3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: "fw-bold",
						children: "No courses found"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Course Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Instructor" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Lessons" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Students" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBookOpen,
										className: "text-primary opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.name
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.code }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.instructor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-light text-dark rounded-pill",
								children: item.category
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.lessons
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.students
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => {
											setSelectedCourse(item);
											setShowLessons(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileAlt })
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
								children: editItem ? "Edit Course" : "Add Course"
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
											className: "col-md-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Course Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
												placeholder: "Course name"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Code ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.code,
												onChange: (e) => setFormData({
													...formData,
													code: e.target.value
												}),
												placeholder: "e.g. CS-101"
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
												placeholder: "Course description"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Category ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												required: true,
												value: formData.category,
												onChange: (e) => setFormData({
													...formData,
													category: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Category"
												}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c,
													children: c
												}, c))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Instructor"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.instructor,
												onChange: (e) => setFormData({
													...formData,
													instructor: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Instructor"
												}), INSTRUCTORS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: i,
													children: i
												}, i))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Level"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.level,
												onChange: (e) => setFormData({
													...formData,
													level: e.target.value
												}),
												children: LEVELS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: l,
													children: l
												}, l))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Duration"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.duration,
												onChange: (e) => setFormData({
													...formData,
													duration: e.target.value
												}),
												placeholder: "e.g. 12 weeks"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.status,
												onChange: (e) => setFormData({
													...formData,
													status: e.target.value
												}),
												children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: s
												}, s))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Thumbnail"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												className: "form-control rounded-3"
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
										icon: faBookOpen,
										className: "me-2"
									}), editItem ? "Update Course" : "Create Course"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; } .transition { transition: all 0.3s ease; } .hover-lift:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; }` })
		]
	});
};
//#endregion
export { Courses as default };
