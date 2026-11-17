import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ao as faPrint, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Uc as faUserGraduate, Wt as faCertificate, bl as useApp, d as useTranslation, dc as faTimesCircle, os as faSearch, ru as require_react, sr as faDownload, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Examinations/Certificates.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CERTIFICATE_TYPES = [
	{
		value: "Passing",
		label: "Passing Certificate",
		color: "#10b981"
	},
	{
		value: "Completion",
		label: "Completion Certificate",
		color: "#6366f1"
	},
	{
		value: "Merit",
		label: "Merit Certificate",
		color: "#f59e0b"
	},
	{
		value: "Participation",
		label: "Participation Certificate",
		color: "#06b6d4"
	},
	{
		value: "Transcript",
		label: "Transcript",
		color: "#8b5cf6"
	}
];
var Certificates = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		type: "",
		dateFrom: "",
		dateTo: "",
		department: ""
	});
	const [previewCert, setPreviewCert] = (0, import_react.useState)(null);
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
					student: "Ali Ahmed",
					type: "Passing",
					date: "2025-06-15",
					status: "Generated",
					dept: "Science"
				},
				{
					id: 2,
					student: "Sara Khan",
					type: "Merit",
					date: "2025-06-20",
					status: "Generated",
					dept: "Arts"
				},
				{
					id: 3,
					student: "Usman Ali",
					type: "Completion",
					date: "2025-07-01",
					status: "Pending",
					dept: "Commerce"
				},
				{
					id: 4,
					student: "Fatima Noor",
					type: "Transcript",
					date: "2025-07-05",
					status: "Generated",
					dept: "Science"
				},
				{
					id: 5,
					student: "Hassan Raza",
					type: "Participation",
					date: "2025-07-10",
					status: "Pending",
					dept: "IT"
				},
				{
					id: 6,
					student: "Ayesha Malik",
					type: "Merit",
					date: "2025-07-12",
					status: "Generated",
					dept: "Engineering"
				},
				{
					id: 7,
					student: "Bilal Ahmed",
					type: "Passing",
					date: "2025-07-15",
					status: "Pending",
					dept: "Science"
				},
				{
					id: 8,
					student: "Zainab Ali",
					type: "Transcript",
					date: "2025-07-18",
					status: "Generated",
					dept: "Medical"
				}
			]);
		} catch (err) {
			setError(err.message || "Failed to load certificates");
		} finally {
			setLoading(false);
		}
	};
	const handleGenerate = async (id) => {
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.("Certificate generated successfully", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Failed to generate certificate", "danger");
		}
	};
	const getTypeStyle = (type) => {
		return CERTIFICATE_TYPES.find((t) => t.value === type) || { color: "#64748b" };
	};
	const templatePreview = (item) => {
		const typeStyle = getTypeStyle(item.type);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "display-4 mb-3",
								style: { color: typeStyle.color },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCertificate })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "fw-bold",
								style: { color: textColor },
								children: ["Certificate of ", item.type]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divider mx-auto my-3",
								style: {
									width: "100px",
									height: "3px",
									background: typeStyle.color,
									borderRadius: "2px"
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-1",
								children: "This is to certify that"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "fw-bold",
								style: { color: textColor },
								children: item.student
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0",
								children: "has successfully completed the requirements"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted small",
								children: [
									"for the ",
									item.type.toLowerCase(),
									" in the academic year 2024-2025"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row mt-4 pt-3",
						style: { borderTop: `1px solid ${borderColor}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col text-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "x-small text-muted mb-0",
								children: ["Date: ", item.date]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col text-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "x-small text-muted mb-0",
								children: "Authorized Signature"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-center gap-3 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary rounded-3 px-4",
							onClick: () => addNotification?.("Certificate downloaded", "success"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faDownload,
								className: "me-2"
							}), "Download"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-secondary rounded-3 px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPrint,
								className: "me-2"
							}), "Print"]
						})]
					})
				]
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Certificates"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Generate and manage student certificates"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Generate New"]
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
									placeholder: "Search by student...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.type,
								onChange: (e) => setFilters({
									...filters,
									type: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Types"
								}), CERTIFICATE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.value,
									children: t.label
								}, t.value))]
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
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Departments"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Science",
										children: "Science"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Arts",
										children: "Arts"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Commerce",
										children: "Commerce"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Engineering",
										children: "Engineering"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Medical",
										children: "Medical"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "IT",
										children: "IT"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.dateFrom,
								onChange: (e) => setFilters({
									...filters,
									dateFrom: e.target.value
								}),
								placeholder: "From"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.dateTo,
								onChange: (e) => setFilters({
									...filters,
									dateTo: e.target.value
								}),
								placeholder: "To"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 w-100",
								onClick: () => {
									setSearch("");
									setFilters({
										type: "",
										dateFrom: "",
										dateTo: "",
										department: ""
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
				className: "row g-4",
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
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Certificate Type" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pe-4 text-end",
												children: "Actions"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "6",
									className: "text-center py-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
								}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									colSpan: "6",
									className: "text-center py-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCertificate,
										className: "fs-1 text-muted opacity-50 mb-3"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold",
										children: "No certificates found"
									})]
								}) }) : data.map((item) => {
									const typeStyle = getTypeStyle(item.type);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "ps-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faUserGraduate,
													className: "text-primary opacity-50"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-semibold small",
													style: { color: textColor },
													children: item.student
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill",
											style: {
												background: `${typeStyle.color}15`,
												color: typeStyle.color
											},
											children: item.type
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: item.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: item.dept
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `badge rounded-pill ${item.status === "Generated" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: item.status === "Generated" ? faCheckCircle : faTimesCircle,
												className: "me-1"
											}), item.status]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "pe-4 text-end",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-sm btn-light border rounded-3 me-1",
													onClick: () => setPreviewCert(item),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEye })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-sm btn-light border rounded-3 me-1",
													onClick: () => handleGenerate(item.id),
													disabled: item.status === "Generated",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCertificate })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-sm btn-primary rounded-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDownload })
												})
											]
										})
									] }, item.id);
								}) })]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: previewCert ? templatePreview(previewCert) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCertificate,
									className: "fs-1 text-muted opacity-25 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									style: { color: textColor },
									children: "Certificate Preview"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "small text-muted",
									children: "Select a certificate to preview its template"
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
export { Certificates as default };
