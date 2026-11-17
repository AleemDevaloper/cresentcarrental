import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, Do as faPlus, Nt as faCalendarAlt, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, in as faChevronRight, os as faSearch, rn as faChevronLeft, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Timetable/Events.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EVENT_TYPES = [
	"Exam",
	"Holiday",
	"Meeting",
	"Workshop",
	"Sports",
	"Other"
];
var EVENT_COLORS = {
	Exam: "#ef4444",
	Holiday: "#10b981",
	Meeting: "#3b82f6",
	Workshop: "#8b5cf6",
	Sports: "#f59e0b",
	Other: "#6b7280"
};
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var Events = () => {
	const { t } = useTranslation();
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [viewMode, setViewMode] = (0, import_react.useState)("month");
	const [currentMonth, setCurrentMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth());
	const [currentYear, setCurrentYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		type: "Exam",
		date: "",
		location: "",
		description: ""
	});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const [data, setData] = (0, import_react.useState)([]);
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 300));
			setData([
				{
					id: 1,
					name: "Mid-Term Examinations",
					type: "Exam",
					date: "2026-08-15",
					location: "Main Campus",
					description: "Mid-term exams for all departments",
					color: "#ef4444"
				},
				{
					id: 2,
					name: "Independence Day",
					type: "Holiday",
					date: "2026-08-14",
					location: "-",
					description: "National holiday",
					color: "#10b981"
				},
				{
					id: 3,
					name: "Faculty Board Meeting",
					type: "Meeting",
					date: "2026-08-10",
					location: "Conference Room A",
					description: "Monthly faculty coordination",
					color: "#3b82f6"
				},
				{
					id: 4,
					name: "AI in Education Workshop",
					type: "Workshop",
					date: "2026-09-05",
					location: "Auditorium",
					description: "Hands-on AI tools for educators",
					color: "#8b5cf6"
				},
				{
					id: 5,
					name: "Annual Sports Gala",
					type: "Sports",
					date: "2026-08-25",
					location: "Sports Complex",
					description: "Inter-department sports competition",
					color: "#f59e0b"
				},
				{
					id: 6,
					name: "Final Term Examinations",
					type: "Exam",
					date: "2026-12-10",
					location: "All Campuses",
					description: "Final exams for fall semester",
					color: "#ef4444"
				},
				{
					id: 7,
					name: "Parent-Teacher Meeting",
					type: "Meeting",
					date: "2026-09-15",
					location: "Main Campus",
					description: "Semester progress review",
					color: "#3b82f6"
				},
				{
					id: 8,
					name: "Research Symposium",
					type: "Workshop",
					date: "2026-10-20",
					location: "Auditorium",
					description: "Student research presentations",
					color: "#8b5cf6"
				}
			]);
		} catch (err) {
			console.error("Error loading events", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
	const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
	const filtered = data.filter((item) => {
		const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
		const matchType = !typeFilter || item.type === typeFilter;
		return matchSearch && matchType;
	});
	const getEventsForDate = (day) => {
		const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		return filtered.filter((e) => e.date === dateStr);
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData({
			name: "",
			type: "Exam",
			date: "",
			location: "",
			description: ""
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			name: item.name || "",
			type: item.type || "Exam",
			date: item.date || "",
			location: item.location || "",
			description: item.description || ""
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.date) {
			addNotification?.("Name and Date are required", "warning");
			return;
		}
		try {
			addNotification?.((editItem ? "Event updated" : "Event created") + " successfully", "success");
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving event", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this event?")) return;
		try {
			addNotification?.("Event deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const renderCalendar = () => {
		const daysInMonth = getDaysInMonth(currentMonth, currentYear);
		const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
		const today = /* @__PURE__ */ new Date();
		const cells = [];
		for (let i = 0; i < firstDay; i++) cells.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-2" }, `empty-${i}`));
		for (let day = 1; day <= daysInMonth; day++) {
			const events = getEventsForDate(day);
			const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
			cells.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-1",
				style: { minHeight: "80px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `d-flex align-items-center justify-content-center mb-1 fw-semibold small rounded-circle ${isToday ? "bg-primary text-white" : ""}`,
					style: {
						width: "26px",
						height: "26px",
						color: isToday ? "#fff" : textColor
					},
					children: day
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-column gap-1",
					children: [events.slice(0, 2).map((evt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2 px-1 py-0.5 x-small fw-semibold text-truncate",
						style: {
							background: `${evt.color}20`,
							color: evt.color,
							border: `1px solid ${evt.color}30`,
							fontSize: "9px",
							lineHeight: 1.4
						},
						title: evt.name,
						children: evt.name
					}, evt.id)), events.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "x-small text-muted fw-semibold",
						style: { fontSize: "9px" },
						children: [
							"+",
							events.length - 2,
							" more"
						]
					})]
				})]
			}, day));
		}
		return cells;
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
			className: "card skeleton-card p-4 border-0 shadow-sm",
			style: {
				height: "500px",
				borderRadius: "18px",
				background: isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"
			}
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Events Calendar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage exams, holidays, meetings, workshops, and sports events"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Event"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-3 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center gap-2 justify-content-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex gap-1",
							children: [
								"month",
								"week",
								"day"
							].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `btn btn-sm rounded-pill px-3 fw-semibold ${viewMode === mode ? "btn-primary" : "btn-light"}`,
								onClick: () => setViewMode(mode),
								children: mode.charAt(0).toUpperCase() + mode.slice(1)
							}, mode))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-light rounded-3",
									onClick: () => {
										if (currentMonth === 0) {
											setCurrentMonth(11);
											setCurrentYear((prev) => prev - 1);
										} else setCurrentMonth((prev) => prev - 1);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronLeft })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "fw-bold small",
									style: { color: textColor },
									children: [
										MONTHS[currentMonth],
										" ",
										currentYear
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-light rounded-3",
									onClick: () => {
										if (currentMonth === 11) {
											setCurrentMonth(0);
											setCurrentYear((prev) => prev + 1);
										} else setCurrentMonth((prev) => prev + 1);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronRight })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faSearch,
										size: "xs"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control form-control-sm rounded-3 ps-5 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search events...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									style: { width: "200px" }
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select form-select-sm rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: typeFilter,
								onChange: (e) => setTypeFilter(e.target.value),
								style: { width: "130px" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Types"
								}), EVENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))]
							})]
						})
					]
				})
			}),
			viewMode === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-0 mb-2",
						children: [
							"Sun",
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat"
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col text-center fw-bold small text-uppercase",
							style: {
								color: mutedColor,
								fontSize: "11px"
							},
							children: d
						}, d))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row g-0",
						children: renderCalendar()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex flex-wrap gap-3 mt-3 pt-3 border-top",
						style: { borderColor },
						children: EVENT_TYPES.filter((t) => t !== "Other").map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								background: EVENT_COLORS[type],
								display: "inline-block"
							} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small fw-semibold text-muted",
								children: type
							})]
						}, type))
					})
				]
			}),
			viewMode !== "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-5 text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCalendarAlt,
						className: "fs-1 mb-3 opacity-50"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: "fw-bold",
						children: "Weekly & Daily views coming soon"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "small",
						children: "Switch to Month view for the calendar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Event Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Location" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Description" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCalendarAlt,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No events found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new event to get started"
								})
							]
						}) }) : filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										background: item.color || EVENT_COLORS[item.type],
										display: "inline-block"
									} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.name
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge rounded-pill px-3 py-1.5 fw-semibold",
								style: {
									background: `${item.color || EVENT_COLORS[item.type]}20`,
									color: item.color || EVENT_COLORS[item.type],
									border: `1px solid ${item.color || EVENT_COLORS[item.type]}30`
								},
								children: item.type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: new Date(item.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.location
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small text-muted",
								style: { maxWidth: "250px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-truncate d-inline-block",
									style: { maxWidth: "250px" },
									children: item.description
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-light border rounded-3 me-1",
									onClick: () => openEditForm(item),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-danger rounded-3",
									onClick: () => handleDelete(item.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
								})]
							})
						] }, item.id)) })]
					})
				})
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editItem ? "Edit Event" : "Add Event"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowForm(false)
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
												children: ["Event Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
												placeholder: "e.g. Mid-Term Exams"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.type,
												onChange: (e) => setFormData({
													...formData,
													type: e.target.value
												}),
												children: EVENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Location"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.location,
												onChange: (e) => setFormData({
													...formData,
													location: e.target.value
												}),
												placeholder: "e.g. Main Campus"
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
												placeholder: "Event description..."
											})]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowForm(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "btn btn-primary rounded-3 px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCalendarAlt,
										className: "me-2"
									}), editItem ? "Update Event" : "Save Event"]
								})]
							})]
						})]
					})
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
//#endregion
export { Events as default };
