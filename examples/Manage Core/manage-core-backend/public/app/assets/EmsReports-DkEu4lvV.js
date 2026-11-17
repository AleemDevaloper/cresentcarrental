import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cc as faTruck, Ci as faGraduationCap, Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Ga as faMoneyBillWave, Jt as faChartBar, Kt as faChalkboardTeacher, Rr as faFileCsv, Sn as faClipboardList, Uc as faUserGraduate, Ui as faHistory, _c as faTrash, ao as faPause, bl as useApp, d as useTranslation, qr as faFilePdf, ru as require_react, sr as faDownload, ut as faBook, vl as FontAwesomeIcon, wo as faPlay, zr as faFileExcel } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/EmsReports.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var REPORT_TYPES = [
	{
		id: "student",
		label: "Student Reports",
		icon: faUserGraduate,
		color: "#6366f1",
		desc: "Student lists, demographics, performance"
	},
	{
		id: "attendance",
		label: "Attendance Reports",
		icon: faClipboardList,
		color: "#10b981",
		desc: "Daily, monthly attendance summaries"
	},
	{
		id: "exam",
		label: "Exam Reports",
		icon: faGraduationCap,
		color: "#f59e0b",
		desc: "Results, grade distributions"
	},
	{
		id: "fee",
		label: "Fee Reports",
		icon: faMoneyBillWave,
		color: "#ef4444",
		desc: "Collections, pending, scholarships"
	},
	{
		id: "teacher",
		label: "Teacher Reports",
		icon: faChalkboardTeacher,
		color: "#06b6d4",
		desc: "Workload, performance, attendance"
	},
	{
		id: "library",
		label: "Library Reports",
		icon: faBook,
		color: "#8b5cf6",
		desc: "Circulation, members, fines"
	},
	{
		id: "transport",
		label: "Transport Reports",
		icon: faTruck,
		color: "#ec4899",
		desc: "Fleet, routes, fuel consumption"
	},
	{
		id: "hostel",
		label: "Hostel Reports",
		icon: faBuilding,
		color: "#f97316",
		desc: "Occupancy, allocations, maintenance"
	}
];
var SCHEDULED_REPORTS = [
	{
		id: 1,
		name: "Daily Attendance Summary",
		type: "attendance",
		frequency: "Daily",
		nextRun: "2026-07-28",
		status: "Active"
	},
	{
		id: 2,
		name: "Weekly Fee Collection",
		type: "fee",
		frequency: "Weekly",
		nextRun: "2026-08-01",
		status: "Active"
	},
	{
		id: 3,
		name: "Monthly Student Report",
		type: "student",
		frequency: "Monthly",
		nextRun: "2026-08-01",
		status: "Paused"
	}
];
var EmsReports = () => {
	const { theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [selectedReport, setSelectedReport] = (0, import_react.useState)(null);
	const [dateFrom, setDateFrom] = (0, import_react.useState)("");
	const [dateTo, setDateTo] = (0, import_react.useState)("");
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "text-white" : ""}`,
		style: {
			background: isDark ? "linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)" : "linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)",
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? "bg-dark border border-secondary" : "bg-white"}`,
				style: {
					background: isDark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.92)",
					border: `1px solid ${borderColor}`,
					boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center justify-content-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-1",
						children: "EMS Reports"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Generate, view, and schedule institutional reports"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-danger rounded-3 d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilePdf }), " PDF"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-success rounded-3 d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileExcel }), " Excel"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-primary rounded-3 d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileCsv }), " CSV"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap gap-2 mt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge rounded-pill px-3 py-2",
							style: {
								background: "rgba(99,102,241,0.12)",
								color: "#6366f1"
							},
							children: "Automated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge rounded-pill px-3 py-2",
							style: {
								background: "rgba(16,185,129,0.12)",
								color: "#10b981"
							},
							children: "Scheduled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge rounded-pill px-3 py-2",
							style: {
								background: "rgba(245,158,11,0.12)",
								color: "#f59e0b"
							},
							children: "Executive-ready"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				className: "fw-bold mb-3",
				style: { color: textColor },
				children: "Report Types"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: REPORT_TYPES.map((rp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-3 col-lg-4 col-md-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"} ${selectedReport === rp.id ? "ring-2" : ""}`,
						style: {
							cursor: "pointer",
							outline: selectedReport === rp.id ? `2px solid ${rp.color}` : "none",
							boxShadow: "0 14px 36px rgba(15, 23, 42, 0.08)"
						},
						onClick: () => setSelectedReport(rp.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-3",
									style: { backgroundColor: `${rp.color}15` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: rp.icon,
										style: {
											color: rp.color,
											fontSize: "18px"
										}
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold small",
									style: { color: textColor },
									children: rp.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "x-small",
									style: { color: mutedColor },
									children: rp.desc
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `btn btn-sm rounded-3 w-100 mt-2 ${selectedReport === rp.id ? "btn-primary" : "btn-outline-secondary"}`,
								onClick: (e) => {
									e.stopPropagation();
									setSelectedReport(rp.id);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faEye,
									className: "me-1"
								}), " View Report"]
							})]
						})
					})
				}, rp.id))
			}),
			selectedReport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3 align-items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Date From"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: dateFrom,
								onChange: (e) => setDateFrom(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Date To"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: dateTo,
								onChange: (e) => setDateTo(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Format"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PDF" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Excel" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CSV" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary rounded-3 w-100 d-flex align-items-center justify-content-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDownload }), " Generate Report"]
							})
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Report Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
						children: REPORT_TYPES.find((r) => r.id === selectedReport)?.label
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex align-items-center justify-content-center",
					style: {
						height: "300px",
						background: isDark ? "rgba(255,255,255,0.02)" : "#f8f9fc",
						borderRadius: "12px",
						border: `1px dashed ${borderColor}`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faChartBar,
								className: "fs-1 text-muted opacity-50 mb-3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold text-muted",
								children: "Report Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small text-muted mb-0",
								children: "Select filters and click Generate to preview"
							})
						]
					})
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faClock,
							className: "me-2 text-primary"
						}), "Scheduled Reports"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-sm btn-primary rounded-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-1"
						}), " Schedule New"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Report Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Frequency" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Next Run" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: SCHEDULED_REPORTS.map((sr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "ps-4 fw-semibold small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faHistory,
									className: "me-2 text-muted"
								}), sr.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: REPORT_TYPES.find((r) => r.id === sr.type)?.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: sr.frequency
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: sr.nextRun
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill ${sr.status === "Active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`,
								children: sr.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-light border rounded-3 me-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: sr.status === "Active" ? faPause : faPlay })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-danger rounded-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
								})]
							})
						] }, sr.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { EmsReports as default };
