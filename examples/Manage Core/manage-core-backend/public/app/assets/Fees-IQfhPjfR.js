import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ci as faGraduationCap, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Ga as faMoneyBillWave, Jt as faChartBar, Ur as faFileInvoice, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, os as faSearch, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Fees/Fees.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FEE_TYPES = [
	"Tuition Fee",
	"Lab Fee",
	"Library Fee",
	"Sports Fee",
	"Hostel Fee",
	"Transport Fee",
	"Examination Fee"
];
var CLASSES = [
	"CS-1A",
	"CS-2A",
	"CS-3A",
	"BBA-1A",
	"BBA-2A",
	"ENG-1A"
];
var initialStructureForm = {
	class: "",
	feeType: "",
	amount: "",
	dueDate: "",
	semester: ""
};
var initialCollectionForm = {
	student: "",
	class: "",
	feeType: "",
	amount: "",
	date: "",
	status: "Paid"
};
var initialScholarshipForm = {
	name: "",
	student: "",
	amount: "",
	status: "Active",
	startDate: "",
	endDate: ""
};
var Fees = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		structure: [],
		collections: [],
		scholarships: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("structure");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialStructureForm);
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				structure: [
					{
						id: 1,
						class: "CS-3A",
						feeType: "Tuition Fee",
						amount: 45e3,
						dueDate: "2026-08-15",
						semester: "Fall 2026"
					},
					{
						id: 2,
						class: "CS-3A",
						feeType: "Lab Fee",
						amount: 12e3,
						dueDate: "2026-08-15",
						semester: "Fall 2026"
					},
					{
						id: 3,
						class: "BBA-2A",
						feeType: "Tuition Fee",
						amount: 4e4,
						dueDate: "2026-08-15",
						semester: "Fall 2026"
					},
					{
						id: 4,
						class: "ENG-1A",
						feeType: "Tuition Fee",
						amount: 35e3,
						dueDate: "2026-08-15",
						semester: "Fall 2026"
					}
				],
				collections: [
					{
						id: 1,
						student: "Ali Ahmed",
						class: "CS-3A",
						feeType: "Tuition Fee",
						amount: 45e3,
						date: "2026-07-27",
						status: "Paid"
					},
					{
						id: 2,
						student: "Sara Khan",
						class: "CS-3A",
						feeType: "Tuition Fee",
						amount: 45e3,
						date: "2026-07-26",
						status: "Paid"
					},
					{
						id: 3,
						student: "Usman Ali",
						class: "BBA-2A",
						feeType: "Lab Fee",
						amount: 12e3,
						date: "2026-07-25",
						status: "Pending"
					},
					{
						id: 4,
						student: "Fatima Noor",
						class: "ENG-1A",
						feeType: "Tuition Fee",
						amount: 35e3,
						date: "",
						status: "Overdue"
					}
				],
				scholarships: [
					{
						id: 1,
						name: "Merit Scholarship",
						student: "Ali Ahmed",
						amount: 25e3,
						status: "Active",
						startDate: "2026-01",
						endDate: "2026-12"
					},
					{
						id: 2,
						name: "Need Based Aid",
						student: "Sara Khan",
						amount: 15e3,
						status: "Active",
						startDate: "2026-01",
						endDate: "2026-12"
					},
					{
						id: 3,
						name: "Sports Scholarship",
						student: "Usman Ali",
						amount: 1e4,
						status: "Completed",
						startDate: "2025-01",
						endDate: "2025-12"
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
		if (activeTab === "structure") return initialStructureForm;
		if (activeTab === "collections") return initialCollectionForm;
		return initialScholarshipForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "structure") setFormData({
			class: item.class || "",
			feeType: item.feeType || "",
			amount: item.amount || "",
			dueDate: item.dueDate || "",
			semester: item.semester || ""
		});
		else if (activeTab === "collections") setFormData({
			student: item.student || "",
			class: item.class || "",
			feeType: item.feeType || "",
			amount: item.amount || "",
			date: item.date || "",
			status: item.status || "Paid"
		});
		else setFormData({
			name: item.name || "",
			student: item.student || "",
			amount: item.amount || "",
			status: item.status || "Active",
			startDate: item.startDate || "",
			endDate: item.endDate || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "structure" ? "feeType" : activeTab === "collections" ? "student" : "name"]) {
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
			Paid: "bg-success-subtle text-success",
			Pending: "bg-warning-subtle text-warning",
			Overdue: "bg-danger-subtle text-danger",
			Partially_Paid: "bg-info-subtle text-info",
			Active: "bg-success-subtle text-success",
			Suspended: "bg-warning-subtle text-warning",
			Completed: "bg-secondary-subtle text-secondary"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${map[status] || map[status.replace(/ /g, "_")] || "bg-secondary-subtle text-secondary"}`,
			children: status
		});
	};
	const getModalForm = () => {
		if (activeTab === "structure") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
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
							children: "Select"
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
						children: ["Fee Type ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.feeType,
						onChange: (e) => setFormData({
							...formData,
							feeType: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), FEE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Amount (Rs.)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.amount,
						onChange: (e) => setFormData({
							...formData,
							amount: Number(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Due Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: "form-control rounded-3",
						value: formData.dueDate,
						onChange: (e) => setFormData({
							...formData,
							dueDate: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Semester"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.semester,
						onChange: (e) => setFormData({
							...formData,
							semester: e.target.value
						})
					})]
				})
			]
		});
		if (activeTab === "collections") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Student ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "form-select rounded-3",
						value: formData.student,
						onChange: (e) => setFormData({
							...formData,
							student: e.target.value
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						})
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
							children: "Select"
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
						children: "Fee Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.feeType,
						onChange: (e) => setFormData({
							...formData,
							feeType: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), FEE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Amount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.amount,
						onChange: (e) => setFormData({
							...formData,
							amount: Number(e.target.value)
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
						children: ["Scholarship Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						children: "Student"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "form-select rounded-3",
						value: formData.student,
						onChange: (e) => setFormData({
							...formData,
							student: e.target.value
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Amount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.amount,
						onChange: (e) => setFormData({
							...formData,
							amount: Number(e.target.value)
						})
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
	};
	const totalCollected = data.collections.filter((c) => c.status === "Paid").reduce((s, c) => s + c.amount, 0);
	const totalPending = data.collections.filter((c) => c.status === "Pending" || c.status === "Overdue").reduce((s, c) => s + c.amount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Fee Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage fee structure, collections, scholarships, and reports"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}),
						"Add ",
						activeTab === "structure" ? "Fee" : activeTab === "collections" ? "Collection" : "Scholarship"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "structure",
						label: "Fee Structure",
						icon: faFileInvoice
					},
					{
						key: "collections",
						label: "Collections",
						icon: faMoneyBillWave
					},
					{
						key: "scholarships",
						label: "Scholarships",
						icon: faGraduationCap
					},
					{
						key: "reports",
						label: "Reports",
						icon: faChartBar
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
			activeTab === "reports" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					style: { color: textColor },
					children: "Fee Summary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-4 mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-4 text-center",
								style: {
									background: `${colors.success}08`,
									border: `1px solid ${colors.success}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: colors.success },
									children: ["Rs.", totalCollected.toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Total Collected"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-4 text-center",
								style: {
									background: `${colors.warning}08`,
									border: `1px solid ${colors.warning}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: colors.warning },
									children: ["Rs.", totalPending.toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Total Pending"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-4 text-center",
								style: {
									background: `${colors.info}08`,
									border: `1px solid ${colors.info}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: colors.info },
									children: data.scholarships.filter((s) => s.status === "Active").length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Active Scholarships"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-4 text-center",
								style: {
									background: `${colors.danger}08`,
									border: `1px solid ${colors.danger}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: colors.danger },
									children: data.collections.filter((c) => c.status === "Overdue").length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Overdue Accounts"
								})]
							})
						})
					]
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
									activeTab === "structure" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Class"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fee Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Due Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Semester" })
									] }),
									activeTab === "collections" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Student"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Class" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fee Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									] }),
									activeTab === "scholarships" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Period" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "10",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : (data[activeTab] || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "10",
							className: "text-center py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faMoneyBillWave,
								className: "fs-1 text-muted opacity-50 mb-3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								className: "fw-bold",
								children: [
									"No ",
									activeTab,
									" found"
								]
							})]
						}) }) : (data[activeTab] || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							activeTab === "structure" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.class
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.feeType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "small fw-bold",
									children: ["Rs.", item.amount?.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.dueDate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.semester
								})
							] }),
							activeTab === "collections" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUsers,
										className: "me-2 text-muted opacity-50"
									}), item.student]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.class
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.feeType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "small fw-bold",
									children: ["Rs.", item.amount?.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.date || "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
							] }),
							activeTab === "scholarships" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faGraduationCap,
										className: "me-2 text-muted opacity-50"
									}), item.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.student
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "small fw-bold",
									children: ["Rs.", item.amount?.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "small",
									children: [
										item.startDate,
										" - ",
										item.endDate
									]
								})
							] }),
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
									activeTab === "structure" ? "Fee Structure" : activeTab === "collections" ? "Collection" : "Scholarship"
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
var colors = {
	primary: "#6366f1",
	success: "#10b981",
	warning: "#f59e0b",
	danger: "#ef4444",
	info: "#06b6d4"
};
//#endregion
export { Fees as default };
