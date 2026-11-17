import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, ft as faBookOpen, ir as faDollarSign, oi as faFlask, os as faSearch, pa as faLightbulb, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Research/Research.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FUNDING_SOURCES = [
	"Government",
	"Private",
	"International",
	"Internal"
];
var PROJECT_STATUSES = [
	"Active",
	"Completed",
	"On Hold",
	"Cancelled"
];
var PATENT_STATUSES = [
	"Filed",
	"Published",
	"Granted",
	"Expired"
];
var GRANT_STATUSES = [
	"Applied",
	"Approved",
	"Rejected",
	"Completed"
];
var initialProjectForm = {
	name: "",
	pi: "",
	department: "",
	funding: "",
	amount: "",
	startDate: "",
	endDate: "",
	status: "Active"
};
var initialPublicationForm = {
	title: "",
	authors: "",
	journal: "",
	year: "",
	doi: "",
	type: ""
};
var initialPatentForm = {
	title: "",
	inventors: "",
	status: "Filed",
	date: "",
	description: ""
};
var initialGrantForm = {
	name: "",
	agency: "",
	amount: "",
	status: "Applied",
	deadline: ""
};
var Research = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		projects: [],
		publications: [],
		patents: [],
		grants: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("projects");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialProjectForm);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				projects: [
					{
						id: 1,
						name: "AI in Education",
						pi: "Dr. Ali Khan",
						department: "CS",
						funding: "Government",
						amount: "5M",
						startDate: "2025-01",
						endDate: "2027-12",
						status: "Active"
					},
					{
						id: 2,
						name: "Quantum Computing",
						pi: "Dr. Sara Ali",
						department: "Engineering",
						funding: "International",
						amount: "10M",
						startDate: "2024-06",
						endDate: "2028-06",
						status: "Active"
					},
					{
						id: 3,
						name: "Climate Modeling",
						pi: "Dr. Usman Raza",
						department: "Sciences",
						funding: "Government",
						amount: "3M",
						startDate: "2025-03",
						endDate: "2027-03",
						status: "Active"
					},
					{
						id: 4,
						name: "Blockchain Security",
						pi: "Dr. Fatima Noor",
						department: "CS",
						funding: "Private",
						amount: "2M",
						startDate: "2024-01",
						endDate: "2026-01",
						status: "Completed"
					}
				],
				publications: [
					{
						id: 1,
						title: "AI in Education: A Comprehensive Review",
						authors: "Ali Khan, Sara Ali",
						journal: "Nature Education",
						year: 2026,
						doi: "10.1234/edu.2026",
						type: "Journal"
					},
					{
						id: 2,
						title: "Quantum Computing Advances",
						authors: "Sara Ali, Usman Raza",
						journal: "Science",
						year: 2026,
						doi: "10.1234/sci.2026",
						type: "Journal"
					},
					{
						id: 3,
						title: "Blockchain for Secure Transactions",
						authors: "Fatima Noor",
						journal: "IEEE Transactions",
						year: 2025,
						doi: "10.1234/ieee.2025",
						type: "Conference"
					}
				],
				patents: [{
					id: 1,
					title: "AI-based Grading System",
					inventors: "Ali Khan, Sara Ali",
					status: "Granted",
					date: "2026-03-15",
					description: "Automated grading using ML"
				}, {
					id: 2,
					title: "Blockchain Voting Protocol",
					inventors: "Fatima Noor",
					status: "Filed",
					date: "2026-06-20",
					description: "Secure voting system"
				}],
				grants: [
					{
						id: 1,
						name: "National AI Research Grant",
						agency: "HEC",
						amount: "15M",
						status: "Approved",
						deadline: "2026-12-31"
					},
					{
						id: 2,
						name: "Climate Research Fund",
						agency: "UNDP",
						amount: "8M",
						status: "Applied",
						deadline: "2026-09-30"
					},
					{
						id: 3,
						name: "Tech Innovation Grant",
						agency: "PSF",
						amount: "5M",
						status: "Completed",
						deadline: "2026-06-30"
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
		if (activeTab === "projects") return initialProjectForm;
		if (activeTab === "publications") return initialPublicationForm;
		if (activeTab === "patents") return initialPatentForm;
		return initialGrantForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "projects") setFormData({
			name: item.name || "",
			pi: item.pi || "",
			department: item.department || "",
			funding: item.funding || "",
			amount: item.amount || "",
			startDate: item.startDate || "",
			endDate: item.endDate || "",
			status: item.status || "Active"
		});
		else if (activeTab === "publications") setFormData({
			title: item.title || "",
			authors: item.authors || "",
			journal: item.journal || "",
			year: item.year || "",
			doi: item.doi || "",
			type: item.type || ""
		});
		else if (activeTab === "patents") setFormData({
			title: item.title || "",
			inventors: item.inventors || "",
			status: item.status || "Filed",
			date: item.date || "",
			description: item.description || ""
		});
		else setFormData({
			name: item.name || "",
			agency: item.agency || "",
			amount: item.amount || "",
			status: item.status || "Applied",
			deadline: item.deadline || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "projects" ? "name" : activeTab === "publications" ? "title" : activeTab === "patents" ? "title" : "name"]) {
			addNotification?.("Please fill required fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.(editItem ? "Updated successfully" : "Added successfully", "success");
			setShowModal(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving", "danger");
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
	const getStatusBadge = (status, map) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${(map || {
				Active: "bg-success-subtle text-success",
				Completed: "bg-secondary-subtle text-secondary",
				On_Hold: "bg-warning-subtle text-warning",
				Cancelled: "bg-danger-subtle text-danger",
				Applied: "bg-primary-subtle text-primary",
				Approved: "bg-success-subtle text-success",
				Rejected: "bg-danger-subtle text-danger",
				Filed: "bg-info-subtle text-info",
				Granted: "bg-success-subtle text-success",
				Published: "bg-primary-subtle text-primary",
				Expired: "bg-secondary-subtle text-secondary"
			})[status] || "bg-secondary-subtle text-secondary"}`,
			children: status
		});
	};
	const getModalForm = () => {
		if (activeTab === "projects") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Project Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						children: PROJECT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "PI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.pi,
						onChange: (e) => setFormData({
							...formData,
							pi: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Department"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.department,
						onChange: (e) => setFormData({
							...formData,
							department: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Funding Source"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.funding,
						onChange: (e) => setFormData({
							...formData,
							funding: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), FUNDING_SOURCES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: f,
							children: f
						}, f))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Amount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.amount,
						onChange: (e) => setFormData({
							...formData,
							amount: e.target.value
						}),
						placeholder: "5M"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Start Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.startDate,
						onChange: (e) => setFormData({
							...formData,
							startDate: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "End Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.endDate,
						onChange: (e) => setFormData({
							...formData,
							endDate: e.target.value
						})
					})]
				})
			]
		});
		if (activeTab === "publications") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-8",
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Year"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.year,
						onChange: (e) => setFormData({
							...formData,
							year: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Authors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.authors,
						onChange: (e) => setFormData({
							...formData,
							authors: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Journal / Conference"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.journal,
						onChange: (e) => setFormData({
							...formData,
							journal: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "DOI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.doi,
						onChange: (e) => setFormData({
							...formData,
							doi: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.type,
						onChange: (e) => setFormData({
							...formData,
							type: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Journal" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Conference" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Book Chapter" })
						]
					})]
				})
			]
		});
		if (activeTab === "patents") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Patent Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						})
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
						children: PATENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Inventors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.inventors,
						onChange: (e) => setFormData({
							...formData,
							inventors: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
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
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Grant Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						children: "Agency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.agency,
						onChange: (e) => setFormData({
							...formData,
							agency: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Amount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.amount,
						onChange: (e) => setFormData({
							...formData,
							amount: e.target.value
						})
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
						children: GRANT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Deadline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: "form-control rounded-3",
						value: formData.deadline,
						onChange: (e) => setFormData({
							...formData,
							deadline: e.target.value
						})
					})]
				})
			]
		});
	};
	const columns = {
		projects: [
			{
				key: "name",
				label: "Name",
				icon: faFlask
			},
			{
				key: "pi",
				label: "PI"
			},
			{
				key: "department",
				label: "Dept"
			},
			{
				key: "funding",
				label: "Funding"
			},
			{
				key: "amount",
				label: "Amount"
			},
			{
				key: "status",
				label: "Status",
				badge: true
			}
		],
		publications: [
			{
				key: "title",
				label: "Title",
				icon: faBookOpen
			},
			{
				key: "authors",
				label: "Authors"
			},
			{
				key: "journal",
				label: "Journal"
			},
			{
				key: "year",
				label: "Year"
			}
		],
		patents: [
			{
				key: "title",
				label: "Title",
				icon: faLightbulb
			},
			{
				key: "inventors",
				label: "Inventors"
			},
			{
				key: "status",
				label: "Status",
				badge: true
			},
			{
				key: "date",
				label: "Date"
			}
		],
		grants: [
			{
				key: "name",
				label: "Name",
				icon: faDollarSign
			},
			{
				key: "agency",
				label: "Agency"
			},
			{
				key: "amount",
				label: "Amount"
			},
			{
				key: "status",
				label: "Status",
				badge: true
			},
			{
				key: "deadline",
				label: "Deadline"
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Research Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage projects, publications, patents, and grants"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}),
						"Add ",
						activeTab === "projects" ? "Project" : activeTab === "publications" ? "Publication" : activeTab === "patents" ? "Patent" : "Grant"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "projects",
						label: "Projects",
						icon: faFlask
					},
					{
						key: "publications",
						label: "Publications",
						icon: faBookOpen
					},
					{
						key: "patents",
						label: "Patents",
						icon: faLightbulb
					},
					{
						key: "grants",
						label: "Grants",
						icon: faDollarSign
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
								children: [(columns[activeTab] || []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4",
									children: c.label
								}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "10",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : (data[activeTab] || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "10",
							className: "text-center py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faFlask,
								className: "fs-1 text-muted opacity-50 mb-3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								className: "fw-bold",
								children: [
									"No ",
									activeTab,
									" found"
								]
							})]
						}) }) : (data[activeTab] || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [(columns[activeTab] || []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "ps-4 small fw-semibold",
							children: [c.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: c.icon,
								className: "me-2 text-muted opacity-50"
							}), c.badge ? getStatusBadge(item[c.key]) : item[c.key]]
						}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
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
						})] }, item.id)) })]
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
									editItem ? "Edit" : "Add",
									" ",
									activeTab === "projects" ? "Project" : activeTab === "publications" ? "Publication" : activeTab === "patents" ? "Patent" : "Grant"
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
export { Research as default };
