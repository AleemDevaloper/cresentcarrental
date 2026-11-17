import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ar as faFileAlt, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Gc as faUserInjured, Pt as faCalendarCheck, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, os as faSearch, qc as faUserMd, ru as require_react, tl as faUsers, vl as FontAwesomeIcon, xo as faPills } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Medical/Medical.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var BLOOD_GROUPS = [
	"A+",
	"A-",
	"B+",
	"B-",
	"AB+",
	"AB-",
	"O+",
	"O-"
];
var DEPARTMENTS = [
	"General",
	"Cardiology",
	"Orthopedic",
	"Pediatrics",
	"Dermatology",
	"ENT",
	"Ophthalmology",
	"Neurology"
];
var initialPatientForm = {
	name: "",
	bloodGroup: "",
	department: "",
	contact: "",
	email: "",
	age: "",
	gender: "",
	address: ""
};
var initialAppointmentForm = {
	patient: "",
	doctor: "",
	date: "",
	time: "",
	department: "",
	status: "Scheduled"
};
var initialPharmacyForm = {
	medicine: "",
	stock: "",
	price: "",
	expiry: "",
	manufacturer: "",
	alert: ""
};
var Medical = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		patients: [],
		appointments: [],
		pharmacy: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("patients");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialPatientForm);
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
				patients: [
					{
						id: 1,
						name: "Ali Ahmed",
						bloodGroup: "A+",
						department: "Cardiology",
						contact: "+92 300 1112233",
						email: "ali@example.com",
						age: 22,
						gender: "Male",
						address: "Lahore"
					},
					{
						id: 2,
						name: "Sara Khan",
						bloodGroup: "B+",
						department: "General",
						contact: "+92 300 4455667",
						email: "sara@example.com",
						age: 20,
						gender: "Female",
						address: "Islamabad"
					},
					{
						id: 3,
						name: "Usman Ali",
						bloodGroup: "O+",
						department: "Orthopedic",
						contact: "+92 300 7788990",
						email: "usman@example.com",
						age: 24,
						gender: "Male",
						address: "Karachi"
					},
					{
						id: 4,
						name: "Fatima Noor",
						bloodGroup: "AB+",
						department: "Pediatrics",
						contact: "+92 300 1113344",
						email: "fatima@example.com",
						age: 19,
						gender: "Female",
						address: "Lahore"
					}
				],
				appointments: [
					{
						id: 1,
						patient: "Ali Ahmed",
						doctor: "Dr. Usman Malik",
						date: "2026-07-27",
						time: "10:00 AM",
						department: "Cardiology",
						status: "Scheduled"
					},
					{
						id: 2,
						patient: "Sara Khan",
						doctor: "Dr. Fatima Noor",
						date: "2026-07-27",
						time: "10:30 AM",
						department: "General",
						status: "In Progress"
					},
					{
						id: 3,
						patient: "Usman Ali",
						doctor: "Dr. Hassan Raza",
						date: "2026-07-27",
						time: "11:00 AM",
						department: "Orthopedic",
						status: "Completed"
					},
					{
						id: 4,
						patient: "Fatima Noor",
						doctor: "Dr. Ayesha Malik",
						date: "2026-07-28",
						time: "09:00 AM",
						department: "Pediatrics",
						status: "Scheduled"
					}
				],
				pharmacy: [
					{
						id: 1,
						medicine: "Paracetamol",
						stock: 500,
						price: 50,
						expiry: "2027-06",
						manufacturer: "Pfizer",
						alert: "Low"
					},
					{
						id: 2,
						medicine: "Amoxicillin",
						stock: 200,
						price: 120,
						expiry: "2027-03",
						manufacturer: "GSK",
						alert: "Normal"
					},
					{
						id: 3,
						medicine: "Insulin",
						stock: 30,
						price: 450,
						expiry: "2026-12",
						manufacturer: "Novo Nordisk",
						alert: "Critical"
					},
					{
						id: 4,
						medicine: "Ibuprofen",
						stock: 350,
						price: 35,
						expiry: "2027-08",
						manufacturer: "Bayer",
						alert: "Normal"
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
		if (activeTab === "patients") return initialPatientForm;
		if (activeTab === "appointments") return initialAppointmentForm;
		return initialPharmacyForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "patients") setFormData({
			name: item.name || "",
			bloodGroup: item.bloodGroup || "",
			department: item.department || "",
			contact: item.contact || "",
			email: item.email || "",
			age: item.age || "",
			gender: item.gender || "",
			address: item.address || ""
		});
		else if (activeTab === "appointments") setFormData({
			patient: item.patient || "",
			doctor: item.doctor || "",
			date: item.date || "",
			time: item.time || "",
			department: item.department || "",
			status: item.status || "Scheduled"
		});
		else setFormData({
			medicine: item.medicine || "",
			stock: item.stock || "",
			price: item.price || "",
			expiry: item.expiry || "",
			manufacturer: item.manufacturer || "",
			alert: item.alert || "Normal"
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "patients" ? "name" : activeTab === "appointments" ? "patient" : "medicine"]) {
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
		if (activeTab === "patients") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						}),
						placeholder: "Patient name"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Age"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.age,
						onChange: (e) => setFormData({
							...formData,
							age: Number(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Gender"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.gender,
						onChange: (e) => setFormData({
							...formData,
							gender: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Male" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Female" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Blood Group"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.bloodGroup,
						onChange: (e) => setFormData({
							...formData,
							bloodGroup: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), BLOOD_GROUPS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: b,
							children: b
						}, b))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
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
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.contact,
						onChange: (e) => setFormData({
							...formData,
							contact: e.target.value
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
						children: "Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.address,
						onChange: (e) => setFormData({
							...formData,
							address: e.target.value
						})
					})]
				})
			]
		});
		if (activeTab === "appointments") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Patient ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.patient,
						onChange: (e) => setFormData({
							...formData,
							patient: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select Patient"
						}), data.patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.name,
							children: p.name
						}, p.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Doctor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.doctor,
						onChange: (e) => setFormData({
							...formData,
							doctor: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select Doctor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Dr. Usman Malik" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Dr. Fatima Noor" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Dr. Hassan Raza" })
						]
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
						children: "Time"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						className: "form-control rounded-3",
						value: formData.time,
						onChange: (e) => setFormData({
							...formData,
							time: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
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
						children: ["Medicine Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						required: true,
						value: formData.medicine,
						onChange: (e) => setFormData({
							...formData,
							medicine: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Stock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.stock,
						onChange: (e) => setFormData({
							...formData,
							stock: Number(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Price (Rs.)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.price,
						onChange: (e) => setFormData({
							...formData,
							price: Number(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Expiry"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.expiry,
						onChange: (e) => setFormData({
							...formData,
							expiry: e.target.value
						}),
						placeholder: "2027-06"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Manufacturer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.manufacturer,
						onChange: (e) => setFormData({
							...formData,
							manufacturer: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Stock Alert"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.alert,
						onChange: (e) => setFormData({
							...formData,
							alert: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Normal" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Critical" })
						]
					})]
				})
			]
		});
	};
	const getStatusBadge = (status) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${{
				Scheduled: "bg-primary-subtle text-primary",
				In_Progress: "bg-info-subtle text-info",
				Completed: "bg-success-subtle text-success",
				Cancelled: "bg-danger-subtle text-danger",
				No_Show: "bg-warning-subtle text-warning"
			}[status.replace(" ", "_")] || "bg-secondary-subtle text-secondary"}`,
			children: status
		});
	};
	const getAlertBadge = (alert) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${{
				Critical: "bg-danger-subtle text-danger",
				Low: "bg-warning-subtle text-warning",
				Normal: "bg-success-subtle text-success"
			}[alert] || ""}`,
			children: alert
		});
	};
	const renderTable = () => {
		const list = data[activeTab] || [];
		if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "d-flex justify-content-center py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
		});
		if (list.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faUserInjured,
				className: "fs-1 text-muted opacity-50 mb-3"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
				className: "fw-bold",
				children: [
					"No ",
					activeTab,
					" found"
				]
			})]
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
								activeTab === "patients" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Blood Group" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Contact" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Gender" })
								] }),
								activeTab === "appointments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "Patient"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Doctor" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Time" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Department" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
								] }),
								activeTab === "pharmacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "Medicine"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Stock" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Price" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Expiry" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Manufacturer" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Alert" })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						activeTab === "patients" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "ps-4 fw-semibold small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUserInjured,
									className: "me-2 text-muted opacity-50"
								}), item.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge rounded-pill bg-danger-subtle text-danger",
								children: item.bloodGroup
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.contact
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.gender
							})
						] }),
						activeTab === "appointments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4 fw-semibold small",
								children: item.patient
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUserMd,
									className: "me-1 text-muted"
								}), item.doctor]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.time
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
						] }),
						activeTab === "pharmacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "ps-4 fw-semibold small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPills,
									className: "me-2 text-muted opacity-50"
								}), item.medicine]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small fw-bold",
								children: item.stock
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "small",
								children: ["Rs.", item.price]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.expiry
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.manufacturer
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getAlertBadge(item.alert) })
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
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Medical Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage patients, appointments, and pharmacy"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: activeTab !== "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-3",
						onClick: openAddForm,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-2"
							}),
							"Add ",
							activeTab === "patients" ? "Patient" : activeTab === "appointments" ? "Appointment" : "Medicine"
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "patients",
						label: "Patients",
						icon: faUsers
					},
					{
						key: "appointments",
						label: "Appointments",
						icon: faCalendarCheck
					},
					{
						key: "pharmacy",
						label: "Pharmacy",
						icon: faPills
					},
					{
						key: "reports",
						label: "Reports",
						icon: faFileAlt
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
					children: "Medical Reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-4 text-center",
								style: {
									background: `${colors.primary}08`,
									border: `1px solid ${colors.primary}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: colors.primary },
									children: data.patients.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Total Patients"
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
									children: data.appointments.filter((a) => a.status === "Scheduled").length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Upcoming Appointments"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-4 text-center",
								style: {
									background: `${colors.success}08`,
									border: `1px solid ${colors.success}20`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold mb-0",
									style: { color: colors.success },
									children: data.appointments.filter((a) => a.status === "Completed").length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Completed Today"
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
									children: data.pharmacy.filter((p) => p.alert === "Critical").length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-semibold text-muted",
									children: "Critical Stock Alerts"
								})]
							})
						})
					]
				})]
			}) : renderTable(),
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
									activeTab === "patients" ? "Patient" : activeTab === "appointments" ? "Appointment" : "Medicine"
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
	info: "#06b6d4",
	purple: "#8b5cf6"
};
//#endregion
export { Medical as default };
