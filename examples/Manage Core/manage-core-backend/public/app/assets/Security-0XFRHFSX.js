import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Sn as faClipboardList, Xc as faUserShield, Zi as faIdCard, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Security/Security.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var INCIDENT_TYPES = [
	"Theft",
	"Trespassing",
	"Fight",
	"Fire",
	"Medical",
	"Vandalism",
	"Other"
];
var INCIDENT_STATUSES = [
	"Reported",
	"Under Investigation",
	"Resolved",
	"False Alarm"
];
var DUTY_SHIFTS = [
	"Morning (6AM-2PM)",
	"Evening (2PM-10PM)",
	"Night (10PM-6AM)"
];
var initialIncidentForm = {
	type: "",
	location: "",
	date: "",
	description: "",
	reportedBy: "",
	status: "Reported"
};
var initialGuardForm = {
	name: "",
	badge: "",
	shift: "",
	location: "",
	phone: "",
	status: "On Duty"
};
var initialVisitorForm = {
	name: "",
	idNumber: "",
	purpose: "",
	host: "",
	inTime: "",
	outTime: "",
	vehicle: ""
};
var Security = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		incidents: [],
		personnel: [],
		visitors: [],
		compliance: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("incidents");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialIncidentForm);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				incidents: [
					{
						id: 1,
						type: "Theft",
						location: "Library Block",
						date: "2026-07-27",
						description: "Laptop stolen from reading area",
						reportedBy: "Librarian",
						status: "Under Investigation"
					},
					{
						id: 2,
						type: "Trespassing",
						location: "Main Gate",
						date: "2026-07-26",
						description: "Unauthorized entry attempt",
						reportedBy: "Guard",
						status: "Resolved"
					},
					{
						id: 3,
						type: "Medical",
						location: "Hostel A",
						date: "2026-07-26",
						description: "Student fell unconscious",
						reportedBy: "Warden",
						status: "Resolved"
					},
					{
						id: 4,
						type: "Fire Alarm",
						location: "Science Building",
						date: "2026-07-25",
						description: "Fire alarm triggered",
						reportedBy: "System",
						status: "False Alarm"
					}
				],
				personnel: [
					{
						id: 1,
						name: "Ali Khan",
						badge: "SEC-001",
						shift: "Morning (6AM-2PM)",
						location: "Main Gate",
						phone: "+92 300 1112233",
						status: "On Duty"
					},
					{
						id: 2,
						name: "Usman Ali",
						badge: "SEC-002",
						shift: "Evening (2PM-10PM)",
						location: "Library",
						phone: "+92 300 4455667",
						status: "On Duty"
					},
					{
						id: 3,
						name: "Sara Khan",
						badge: "SEC-003",
						shift: "Night (10PM-6AM)",
						location: "Hostel A",
						phone: "+92 300 7788990",
						status: "Off Duty"
					},
					{
						id: 4,
						name: "Hassan Raza",
						badge: "SEC-004",
						shift: "Morning (6AM-2PM)",
						location: "Science Building",
						phone: "+92 300 9988776",
						status: "On Duty"
					}
				],
				visitors: [{
					id: 1,
					name: "Ahmed Raza",
					idNumber: "CNIC-12345",
					purpose: "Meet Student",
					host: "Ali Ahmed",
					inTime: "10:00 AM",
					outTime: "12:00 PM",
					vehicle: "LXR-123"
				}, {
					id: 2,
					name: "Fatima Khan",
					idNumber: "CNIC-67890",
					purpose: "Faculty Meeting",
					host: "Dr. Usman",
					inTime: "2:00 PM",
					outTime: "4:30 PM",
					vehicle: "None"
				}],
				compliance: [
					{
						id: 1,
						item: "CCTV Cameras Operational",
						status: "Compliant",
						lastCheck: "2026-07-25"
					},
					{
						id: 2,
						item: "Fire Extinguishers Inspected",
						status: "Compliant",
						lastCheck: "2026-07-20"
					},
					{
						id: 3,
						item: "Emergency Exits Clear",
						status: "Non-Compliant",
						lastCheck: "2026-07-22",
						note: "Blocked in Building B"
					},
					{
						id: 4,
						item: "Access Control Systems",
						status: "Compliant",
						lastCheck: "2026-07-24"
					}
				]
			});
		} catch (err) {
			setError(err.message || "Failed to load data");
		} finally {
			setLoading(false);
		}
	};
	const getInitialForm = () => {
		if (activeTab === "incidents") return initialIncidentForm;
		if (activeTab === "personnel") return initialGuardForm;
		if (activeTab === "visitors") return initialVisitorForm;
		return {};
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "incidents") setFormData({
			type: item.type || "",
			location: item.location || "",
			date: item.date || "",
			description: item.description || "",
			reportedBy: item.reportedBy || "",
			status: item.status || "Reported"
		});
		else if (activeTab === "personnel") setFormData({
			name: item.name || "",
			badge: item.badge || "",
			shift: item.shift || "",
			location: item.location || "",
			phone: item.phone || "",
			status: item.status || "On Duty"
		});
		else setFormData({
			name: item.name || "",
			idNumber: item.idNumber || "",
			purpose: item.purpose || "",
			host: item.host || "",
			inTime: item.inTime || "",
			outTime: item.outTime || "",
			vehicle: item.vehicle || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "incidents" ? "type" : activeTab === "personnel" ? "name" : "name"]) {
			addNotification?.("Please fill required fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.(editItem ? "Updated" : "Added", "success");
			setShowModal(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure?")) return;
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const getStatusBadge = (status) => {
		const map = {
			On_Duty: "bg-success-subtle text-success",
			Off_Duty: "bg-secondary-subtle text-secondary",
			Reported: "bg-warning-subtle text-warning",
			Under_Investigation: "bg-primary-subtle text-primary",
			Resolved: "bg-success-subtle text-success",
			False_Alarm: "bg-info-subtle text-info",
			Compliant: "bg-success-subtle text-success",
			Non_Compliant: "bg-danger-subtle text-danger",
			Pending: "bg-warning-subtle text-warning"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${map[status.replace(/ /g, "_")] || map[status] || "bg-secondary-subtle text-secondary"}`,
			children: status
		});
	};
	const getModalForm = () => {
		if (activeTab === "incidents") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Type ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.type,
						onChange: (e) => setFormData({
							...formData,
							type: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), INCIDENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: "form-control rounded-3",
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
						children: "Reported By"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.reportedBy,
						onChange: (e) => setFormData({
							...formData,
							reportedBy: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
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
						children: INCIDENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
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
						})
					})]
				})
			]
		});
		if (activeTab === "personnel") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Badge No"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.badge,
						onChange: (e) => setFormData({
							...formData,
							badge: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Shift"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.shift,
						onChange: (e) => setFormData({
							...formData,
							shift: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), DUTY_SHIFTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.phone,
						onChange: (e) => setFormData({
							...formData,
							phone: e.target.value
						})
					})]
				})
			]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Visitor Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "ID Number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.idNumber,
						onChange: (e) => setFormData({
							...formData,
							idNumber: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Purpose"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.purpose,
						onChange: (e) => setFormData({
							...formData,
							purpose: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Host"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.host,
						onChange: (e) => setFormData({
							...formData,
							host: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Vehicle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.vehicle,
						onChange: (e) => setFormData({
							...formData,
							vehicle: e.target.value
						})
					})]
				})
			]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Security Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage incidents, personnel, visitors, and compliance"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}),
						"Add ",
						activeTab === "incidents" ? "Incident" : activeTab === "personnel" ? "Guard" : activeTab === "visitors" ? "Visitor" : "Checklist"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "incidents",
						label: "Incidents",
						icon: faExclamationTriangle
					},
					{
						key: "personnel",
						label: "Personnel",
						icon: faUserShield
					},
					{
						key: "visitors",
						label: "Visitors",
						icon: faIdCard
					},
					{
						key: "compliance",
						label: "Compliance",
						icon: faClipboardList
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "nav-item",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `nav-link rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? "active" : ""}`,
						onClick: () => {
							setActiveTab(tab.key);
							setSearch("");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: tab.icon }),
							" ",
							tab.label
						]
					})
				}, tab.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								placeholder: `Search ${activeTab}...`,
								value: search,
								onChange: (e) => setSearch(e.target.value)
							})]
						})
					})
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
				className: "d-flex justify-content-center py-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
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
									activeTab === "incidents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Location" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Reported By" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									] }),
									activeTab === "personnel" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Badge" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Shift" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Location" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									] }),
									activeTab === "visitors" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ID Number" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Purpose" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Host" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "In Time" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Out Time" })
									] }),
									activeTab === "compliance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Item"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Last Check" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Notes" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data[activeTab] || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							activeTab === "incidents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faExclamationTriangle,
										className: "me-2 text-muted opacity-50"
									}), item.type]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.reportedBy
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
							] }),
							activeTab === "personnel" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUserShield,
										className: "me-2 text-muted opacity-50"
									}), item.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.badge })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.shift
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
							] }),
							activeTab === "visitors" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.idNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.purpose
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.host
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.inTime
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.outTime || "-"
								})
							] }),
							activeTab === "compliance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.item
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.lastCheck
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small text-muted",
									children: item.note || "-"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [activeTab !== "compliance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-light border rounded-3 me-1",
									onClick: () => openEditForm(item),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
								}), activeTab !== "compliance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm btn-danger rounded-3",
									onClick: () => handleDelete(item.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
								})]
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold",
								children: [
									editItem ? "Edit" : "Report",
									" ",
									activeTab === "incidents" ? "Incident" : activeTab === "personnel" ? "Guard" : "Visitor"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: getModalForm()
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
										icon: faCheckCircle,
										className: "me-2"
									}), editItem ? "Update" : "Save"]
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
export { Security as default };
