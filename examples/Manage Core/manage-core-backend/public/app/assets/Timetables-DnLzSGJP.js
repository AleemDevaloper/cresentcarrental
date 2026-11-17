import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ao as faPrint, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Kt as faChalkboardTeacher, Nt as faCalendarAlt, Uc as faUserGraduate, bl as useApp, d as useTranslation, or as faDoorOpen, ru as require_react, uc as faTimes, v as motion, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Timetable/Timetables.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var PERIODS = [
	"08:00-09:00",
	"09:00-10:00",
	"10:00-11:00",
	"11:00-12:00",
	"12:00-13:00",
	"13:00-14:00",
	"14:00-15:00",
	"15:00-16:00"
];
var Timetables = () => {
	const { t } = useTranslation();
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [activeTab, setActiveTab] = (0, import_react.useState)("class");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [showConflict, setShowConflict] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		day: "Monday",
		period: "08:00-09:00",
		subject: "",
		teacher: "",
		room: "",
		class: ""
	});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const [timetable, setTimetable] = (0, import_react.useState)({
		"Monday": {
			"08:00-09:00": {
				subject: "Data Structures",
				teacher: "Dr. Usman",
				room: "Lab 1",
				class: "CS-3A"
			},
			"09:00-10:00": {
				subject: "Calculus I",
				teacher: "Prof. Sara",
				room: "Room 201",
				class: "BBA-2B"
			},
			"10:00-11:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			},
			"11:00-12:00": {
				subject: "English Comp.",
				teacher: "Ms. Fatima",
				room: "Room 105",
				class: "CS-3A"
			},
			"12:00-13:00": {
				subject: "Break",
				teacher: "-",
				room: "-",
				class: "-"
			},
			"13:00-14:00": {
				subject: "Database Systems",
				teacher: "Dr. Usman",
				room: "Lab 2",
				class: "CS-3A"
			},
			"14:00-15:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			},
			"15:00-16:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			}
		},
		"Tuesday": {
			"08:00-09:00": {
				subject: "Physics",
				teacher: "Dr. Ali",
				room: "Lab 3",
				class: "ENG-1A"
			},
			"09:00-10:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			},
			"10:00-11:00": {
				subject: "Linear Algebra",
				teacher: "Prof. Sara",
				room: "Room 203",
				class: "BBA-2B"
			},
			"11:00-12:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			},
			"12:00-13:00": {
				subject: "Break",
				teacher: "-",
				room: "-",
				class: "-"
			},
			"13:00-14:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			},
			"14:00-15:00": {
				subject: "AI Workshop",
				teacher: "Dr. Khan",
				room: "Lab 1",
				class: "CS-3A"
			},
			"15:00-16:00": {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			}
		}
	});
	const mockClasses = [
		"CS-3A",
		"BBA-2B",
		"ENG-1A",
		"MED-4A"
	];
	const mockTeachers = [
		"Dr. Usman",
		"Prof. Sara",
		"Dr. Ali",
		"Ms. Fatima",
		"Dr. Khan"
	];
	const mockRooms = [
		"Lab 1",
		"Lab 2",
		"Lab 3",
		"Room 101",
		"Room 105",
		"Room 201",
		"Room 203"
	];
	const mockSubjects = [
		"Data Structures",
		"Calculus I",
		"Physics",
		"English Comp.",
		"Database Systems",
		"Linear Algebra",
		"AI Workshop"
	];
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 300));
		} catch (err) {
			console.error("Error loading timetable", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const checkConflict = (day, period, teacher, room) => {
		for (const [d, periods] of Object.entries(timetable)) for (const [p, entry] of Object.entries(periods)) {
			if (d === day && p === period) continue;
			if (entry.subject && entry.subject !== "Break") {
				if (entry.teacher === teacher) return `Teacher "${teacher}" already scheduled ${d} ${p}`;
				if (entry.room === room) return `Room "${room}" already booked ${d} ${p}`;
			}
		}
		return null;
	};
	const handleAddEntry = () => {
		if (!formData.subject || !formData.teacher || !formData.room) {
			addNotification?.("Subject, Teacher and Room are required", "warning");
			return;
		}
		const conflict = checkConflict(formData.day, formData.period, formData.teacher, formData.room);
		if (conflict) {
			setShowConflict(conflict);
			return;
		}
		const updated = { ...timetable };
		if (!updated[formData.day]) updated[formData.day] = {};
		updated[formData.day][formData.period] = {
			subject: formData.subject,
			teacher: formData.teacher,
			room: formData.room,
			class: formData.class || "-"
		};
		setTimetable(updated);
		addNotification?.("Timetable entry added", "success");
		setShowForm(false);
		setFormData({
			day: "Monday",
			period: "08:00-09:00",
			subject: "",
			teacher: "",
			room: "",
			class: ""
		});
	};
	const handleRemoveEntry = (day, period) => {
		const updated = { ...timetable };
		if (updated[day] && updated[day][period]) {
			updated[day][period] = {
				subject: "",
				teacher: "",
				room: "",
				class: ""
			};
			setTimetable(updated);
			addNotification?.("Entry removed", "success");
		}
	};
	const getSlotColor = (entry) => {
		if (!entry.subject || entry.subject === "Break") return "transparent";
		if (entry.subject.includes("Lab") || entry.room?.includes("Lab")) return isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)";
		return isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.06)";
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
					children: "Timetable Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Create and manage weekly class schedules"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-outline-secondary rounded-3",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPrint,
							className: "me-1"
						}), "Print"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-3",
						onClick: () => setShowForm(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}), "Add Entry"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-3 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: [
						"class",
						"teacher",
						"room"
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `btn btn-sm rounded-pill px-4 fw-semibold ${activeTab === tab ? "btn-primary" : "btn-light"}`,
						onClick: () => setActiveTab(tab),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: tab === "class" ? faUserGraduate : tab === "teacher" ? faChalkboardTeacher : faDoorOpen,
								className: "me-1"
							}),
							tab.charAt(0).toUpperCase() + tab.slice(1),
							" View"
						]
					}, tab))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-responsive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "table table-bordered align-middle",
					style: {
						minWidth: "1000px",
						borderColor
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "fw-bold small text-uppercase",
							style: {
								width: "120px",
								color: textColor,
								background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc"
							},
							children: "Period"
						}), DAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "fw-bold small text-uppercase",
							style: {
								color: textColor,
								background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc"
							},
							children: day
						}, day))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PERIODS.map((period) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "text-center fw-semibold small",
						style: {
							color: mutedColor,
							background: isDark ? "rgba(255,255,255,0.02)" : "#fafafa"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faClock,
							className: "me-1",
							style: { fontSize: "10px" }
						}), period]
					}), DAYS.map((day) => {
						const entry = timetable[day]?.[period] || {
							subject: "",
							teacher: "",
							room: "",
							class: ""
						};
						const isBreak = entry.subject === "Break";
						const isEmpty = !entry.subject;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-center p-2",
							style: {
								background: getSlotColor(entry),
								cursor: isEmpty ? "pointer" : "default",
								minHeight: "80px"
							},
							onClick: () => {
								if (isEmpty && !isBreak) {
									setFormData({
										...formData,
										day,
										period
									});
									setShowForm(true);
								}
							},
							children: isBreak ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-warning-subtle text-warning rounded-pill px-3 py-2",
								children: "Break"
							}) : isEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "small text-muted opacity-50",
								children: "Empty"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								className: "p-2 rounded-3",
								whileHover: { scale: 1.02 },
								style: {
									background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)",
									border: `1px solid ${borderColor}`
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										style: { color: textColor },
										children: entry.subject
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "x-small text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChalkboardTeacher,
											className: "me-1"
										}), entry.teacher]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "x-small text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faDoorOpen,
											className: "me-1"
										}), entry.room]
									}),
									entry.class && entry.class !== "-" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "x-small text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUserGraduate,
											className: "me-1"
										}), entry.class]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-link text-danger p-0 mt-1",
										onClick: (e) => {
											e.stopPropagation();
											handleRemoveEntry(day, period);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTimes,
											size: "xs"
										})
									})
								]
							})
						}, `${day}-${period}`);
					})] }, period)) })]
				})
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-header border-0 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold",
									children: "Add Timetable Entry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn-close",
									onClick: () => setShowForm(false)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Day"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.day,
												onChange: (e) => setFormData({
													...formData,
													day: e.target.value
												}),
												children: DAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: d,
													children: d
												}, d))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Period"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.period,
												onChange: (e) => setFormData({
													...formData,
													period: e.target.value
												}),
												children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: p,
													children: p
												}, p))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Subject ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.subject,
												onChange: (e) => setFormData({
													...formData,
													subject: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Subject"
												}), mockSubjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: s
												}, s))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Teacher ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.teacher,
												onChange: (e) => setFormData({
													...formData,
													teacher: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Teacher"
												}), mockTeachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Room ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.room,
												onChange: (e) => setFormData({
													...formData,
													room: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Room"
												}), mockRooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: r,
													children: r
												}, r))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Class"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.class,
												onChange: (e) => setFormData({
													...formData,
													class: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Class"
												}), mockClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c,
													children: c
												}, c))]
											})]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowForm(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-primary rounded-3 px-4",
									onClick: handleAddEntry,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCalendarAlt,
										className: "me-2"
									}), "Add Entry"]
								})]
							})
						]
					})
				})
			}),
			showConflict && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered modal-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-header border-0 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
									className: "fw-bold text-danger",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faExclamationTriangle,
										className: "me-2"
									}), "Conflict Detected"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn-close",
									onClick: () => setShowConflict(false)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "small mb-0",
									children: showConflict
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-primary rounded-3 px-4",
									onClick: () => setShowConflict(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCheckCircle,
										className: "me-2"
									}), "OK"]
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
        .table-bordered > :not(caption) > * > * { border-color: ${borderColor}; }
        @media print {
          body { background: white !important; }
          .btn { display: none !important; }
        }
      ` })
		]
	});
};
//#endregion
export { Timetables as default };
