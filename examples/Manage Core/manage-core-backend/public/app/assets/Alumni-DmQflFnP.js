import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Nt as faCalendarAlt, Uc as faUserGraduate, _c as faTrash, ar as faDonate, bl as useApp, bt as faBriefcase, d as useTranslation, fr as faEdit, ka as faMapMarkerAlt, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Alumni/Alumni.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEPARTMENTS = [
	"Computer Science",
	"Business Administration",
	"Engineering",
	"Medicine",
	"Arts",
	"Law"
];
var initialAlumniForm = {
	name: "",
	graduationYear: "",
	department: "",
	company: "",
	location: "",
	email: "",
	phone: "",
	linkedin: ""
};
var initialJobForm = {
	title: "",
	company: "",
	location: "",
	type: "",
	salary: "",
	deadline: "",
	description: ""
};
var initialEventForm = {
	name: "",
	date: "",
	location: "",
	type: "",
	description: ""
};
var initialDonationForm = {
	alumni: "",
	amount: "",
	date: "",
	purpose: "",
	paymentMethod: ""
};
var Alumni = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		directory: [],
		jobs: [],
		events: [],
		donations: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("directory");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialAlumniForm);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				directory: [
					{
						id: 1,
						name: "Ali Ahmed",
						graduationYear: 2019,
						department: "Computer Science",
						company: "Google",
						location: "Silicon Valley, USA"
					},
					{
						id: 2,
						name: "Sara Khan",
						graduationYear: 2020,
						department: "Business Administration",
						company: "Microsoft",
						location: "Redmond, USA"
					},
					{
						id: 3,
						name: "Usman Ali",
						graduationYear: 2018,
						department: "Engineering",
						company: "Tesla",
						location: "Austin, USA"
					},
					{
						id: 4,
						name: "Fatima Noor",
						graduationYear: 2021,
						department: "Medicine",
						company: "Mayo Hospital",
						location: "Lahore, Pakistan"
					},
					{
						id: 5,
						name: "Hassan Raza",
						graduationYear: 2022,
						department: "Computer Science",
						company: "Amazon",
						location: "Seattle, USA"
					}
				],
				jobs: [
					{
						id: 1,
						title: "Software Engineer",
						company: "Google",
						location: "Lahore",
						type: "Full-Time",
						salary: "Rs. 200K",
						deadline: "2026-08-30"
					},
					{
						id: 2,
						title: "Data Analyst",
						company: "Systems Ltd",
						location: "Karachi",
						type: "Full-Time",
						salary: "Rs. 150K",
						deadline: "2026-09-15"
					},
					{
						id: 3,
						title: "Intern - AI",
						company: "TechHub",
						location: "Islamabad",
						type: "Internship",
						salary: "Rs. 40K",
						deadline: "2026-08-20"
					}
				],
				events: [{
					id: 1,
					name: "Annual Alumni Meetup",
					date: "2026-12-15",
					location: "Main Campus",
					type: "Social",
					description: "Yearly gathering"
				}, {
					id: 2,
					name: "Career Fair 2026",
					date: "2026-09-20",
					location: "Convention Center",
					type: "Career",
					description: "Job fair for alumni"
				}],
				donations: [{
					id: 1,
					alumni: "Ali Ahmed",
					amount: 5e4,
					date: "2026-07-01",
					purpose: "Scholarship Fund",
					paymentMethod: "Bank Transfer"
				}, {
					id: 2,
					alumni: "Sara Khan",
					amount: 25e3,
					date: "2026-06-15",
					purpose: "Library Fund",
					paymentMethod: "Credit Card"
				}]
			});
		} catch (err) {
			setError(err.message || "Failed to load data");
		} finally {
			setLoading(false);
		}
	};
	const getInitialForm = () => {
		if (activeTab === "directory") return initialAlumniForm;
		if (activeTab === "jobs") return initialJobForm;
		if (activeTab === "events") return initialEventForm;
		return initialDonationForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "directory") setFormData({
			name: item.name || "",
			graduationYear: item.graduationYear || "",
			department: item.department || "",
			company: item.company || "",
			location: item.location || "",
			email: item.email || "",
			phone: item.phone || "",
			linkedin: item.linkedin || ""
		});
		else if (activeTab === "jobs") setFormData({
			title: item.title || "",
			company: item.company || "",
			location: item.location || "",
			type: item.type || "",
			salary: item.salary || "",
			deadline: item.deadline || "",
			description: item.description || ""
		});
		else if (activeTab === "events") setFormData({
			name: item.name || "",
			date: item.date || "",
			location: item.location || "",
			type: item.type || "",
			description: item.description || ""
		});
		else setFormData({
			alumni: item.alumni || "",
			amount: item.amount || "",
			date: item.date || "",
			purpose: item.purpose || "",
			paymentMethod: item.paymentMethod || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "directory" ? "name" : activeTab === "jobs" ? "title" : activeTab === "events" ? "name" : "alumni"]) {
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
	const getModalForm = () => {
		if (activeTab === "directory") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Graduation Year"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.graduationYear,
						onChange: (e) => setFormData({
							...formData,
							graduationYear: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Department"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.department,
						onChange: (e) => setFormData({
							...formData,
							department: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d,
							children: d
						}, d))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Company"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.company,
						onChange: (e) => setFormData({
							...formData,
							company: e.target.value
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						className: "form-control rounded-3",
						value: formData.email,
						onChange: (e) => setFormData({
							...formData,
							email: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
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
		if (activeTab === "jobs") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Job Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Company"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.company,
						onChange: (e) => setFormData({
							...formData,
							company: e.target.value
						})
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Full-Time" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Part-Time" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Internship" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Contract" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Salary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.salary,
						onChange: (e) => setFormData({
							...formData,
							salary: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
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
		if (activeTab === "events") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
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
					className: "col-md-3",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Social" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Career" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Workshop" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Fundraiser" })
						]
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
						children: ["Alumni ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.alumni,
						onChange: (e) => setFormData({
							...formData,
							alumni: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), data.directory.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: a.name,
							children: a.name
						}, a.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
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
						children: "Payment Method"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.paymentMethod,
						onChange: (e) => setFormData({
							...formData,
							paymentMethod: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Bank Transfer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Credit Card" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cash" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cheque" })
						]
					})]
				})
			]
		});
	};
	const renderDirectory = () => {
		const list = data.directory;
		if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "d-flex justify-content-center py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Grad Year" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Company" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Location" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "ps-4 fw-semibold small",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserGraduate,
								className: "me-2 text-muted opacity-50"
							}), item.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.graduationYear
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.department
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "small",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faMapMarkerAlt,
								className: "me-1 text-muted"
							}), item.location]
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
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Alumni Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage alumni directory, jobs, events, and donations"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-3",
						onClick: openAddForm,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-2"
							}),
							"Add ",
							activeTab === "directory" ? "Alumni" : activeTab === "jobs" ? "Job" : activeTab === "events" ? "Event" : "Donation"
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "directory",
						label: "Directory",
						icon: faUserGraduate
					},
					{
						key: "jobs",
						label: "Jobs",
						icon: faBriefcase
					},
					{
						key: "events",
						label: "Events",
						icon: faCalendarAlt
					},
					{
						key: "donations",
						label: "Donations",
						icon: faDonate
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
			activeTab === "directory" ? renderDirectory() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									activeTab === "jobs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Title"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Company" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Location" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Salary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Deadline" })
									] }),
									activeTab === "events" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Location" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Description" })
									] }),
									activeTab === "donations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Alumni"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Purpose" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Method" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data[activeTab] || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							activeTab === "jobs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge rounded-pill bg-info-subtle text-info",
									children: item.type
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small fw-bold",
									children: item.salary
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.deadline
								})
							] }),
							activeTab === "events" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCalendarAlt,
										className: "me-2 text-muted"
									}), item.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.location
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge rounded-pill bg-primary-subtle text-primary",
									children: item.type
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small text-muted",
									children: item.description
								})
							] }),
							activeTab === "donations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.alumni
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "small fw-bold text-success",
									children: ["Rs.", item.amount?.toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.purpose
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.paymentMethod
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
									activeTab === "directory" ? "Alumni" : activeTab === "jobs" ? "Job" : activeTab === "events" ? "Event" : "Donation"
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
export { Alumni as default };
