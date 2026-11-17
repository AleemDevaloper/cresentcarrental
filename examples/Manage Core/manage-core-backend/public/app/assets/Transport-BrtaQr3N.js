import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cc as faTruck, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Lc as faUser, Qo as faRoute, Uc as faUserGraduate, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, os as faSearch, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Transport/Transport.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var VEHICLE_TYPES = [
	"Bus",
	"Van",
	"Car",
	"Auto Rickshaw"
];
var VEHICLE_STATUSES = [
	"Active",
	"In Maintenance",
	"Retired"
];
var LICENSE_CLASSES = [
	"LTV",
	"HTV",
	"Motorcycle"
];
var initialVehicleForm = {
	number: "",
	type: "",
	model: "",
	capacity: 1,
	status: "Active"
};
var initialDriverForm = {
	name: "",
	license: "",
	licenseClass: "",
	phone: "",
	assignedVehicle: ""
};
var initialRouteForm = {
	name: "",
	stops: "",
	distance: "",
	vehicle: ""
};
var Transport = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		vehicles: [],
		drivers: [],
		routes: [],
		students: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("vehicles");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialVehicleForm);
	const [showAssign, setShowAssign] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				vehicles: [
					{
						id: 1,
						number: "BUS-001",
						type: "Bus",
						model: "Toyota Coaster",
						capacity: 30,
						status: "Active"
					},
					{
						id: 2,
						number: "BUS-002",
						type: "Bus",
						model: "Hino AK",
						capacity: 40,
						status: "Active"
					},
					{
						id: 3,
						number: "VAN-001",
						type: "Van",
						model: "Toyota Hiace",
						capacity: 12,
						status: "In Maintenance"
					},
					{
						id: 4,
						number: "BUS-003",
						type: "Bus",
						model: "Isuzu",
						capacity: 35,
						status: "Active"
					},
					{
						id: 5,
						number: "CAR-001",
						type: "Car",
						model: "Suzuki Swift",
						capacity: 4,
						status: "Active"
					}
				],
				drivers: [
					{
						id: 1,
						name: "Ali Khan",
						license: "DL-00123",
						licenseClass: "HTV",
						phone: "+92 300 1112233",
						assignedVehicle: "BUS-001"
					},
					{
						id: 2,
						name: "Usman Ali",
						license: "DL-00456",
						licenseClass: "HTV",
						phone: "+92 300 4455667",
						assignedVehicle: "BUS-002"
					},
					{
						id: 3,
						name: "Sara Khan",
						license: "DL-00789",
						licenseClass: "LTV",
						phone: "+92 300 7788990",
						assignedVehicle: "VAN-001"
					},
					{
						id: 4,
						name: "Hassan Raza",
						license: "DL-00111",
						licenseClass: "HTV",
						phone: "+92 300 2223344",
						assignedVehicle: "BUS-003"
					}
				],
				routes: [
					{
						id: 1,
						name: "Route A",
						stops: "Campus - Stop1 - Stop2 - Stop3",
						distance: "12 km",
						vehicle: "BUS-001"
					},
					{
						id: 2,
						name: "Route B",
						stops: "Campus - Stop4 - Stop5",
						distance: "8 km",
						vehicle: "BUS-002"
					},
					{
						id: 3,
						name: "Route C",
						stops: "Campus - Stop6 - Stop7 - Stop8 - Stop9",
						distance: "15 km",
						vehicle: "VAN-001"
					},
					{
						id: 4,
						name: "Route D",
						stops: "Campus - Stop10 - Stop11",
						distance: "6 km",
						vehicle: "BUS-003"
					}
				],
				students: [
					{
						id: 1,
						name: "Ahmed Ali",
						class: "CS-3A",
						route: "Route A",
						stop: "Stop1",
						vehicle: "BUS-001"
					},
					{
						id: 2,
						name: "Fatima Noor",
						class: "BBA-2B",
						route: "Route B",
						stop: "Stop4",
						vehicle: "BUS-002"
					},
					{
						id: 3,
						name: "Hassan Shah",
						class: "ENG-1A",
						route: "Route C",
						stop: "Stop8",
						vehicle: "VAN-001"
					}
				]
			});
		} catch (err) {
			setError(err.message || "Failed to load data");
		} finally {
			setLoading(false);
		}
	};
	const getFormByTab = () => {
		if (activeTab === "vehicles") return initialVehicleForm;
		if (activeTab === "drivers") return initialDriverForm;
		return initialRouteForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getFormByTab());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "vehicles") setFormData({
			number: item.number || "",
			type: item.type || "",
			model: item.model || "",
			capacity: item.capacity || 1,
			status: item.status || "Active"
		});
		else if (activeTab === "drivers") setFormData({
			name: item.name || "",
			license: item.license || "",
			licenseClass: item.licenseClass || "",
			phone: item.phone || "",
			assignedVehicle: item.assignedVehicle || ""
		});
		else setFormData({
			name: item.name || "",
			stops: item.stops || "",
			distance: item.distance || "",
			vehicle: item.vehicle || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "vehicles" ? "number" : "name"]) {
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
	const renderTable = () => {
		const list = data[activeTab] || [];
		const cols = {
			vehicles: [
				{
					key: "number",
					label: "Vehicle No",
					icon: faTruck
				},
				{
					key: "type",
					label: "Type"
				},
				{
					key: "model",
					label: "Model"
				},
				{
					key: "capacity",
					label: "Capacity",
					render: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [v, " seats"] })
				},
				{
					key: "status",
					label: "Status",
					render: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `badge rounded-pill ${v === "Active" ? "bg-success-subtle text-success" : v === "In Maintenance" ? "bg-warning-subtle text-warning" : "bg-secondary-subtle text-secondary"}`,
						children: v
					})
				}
			],
			drivers: [
				{
					key: "name",
					label: "Name",
					icon: faUser
				},
				{
					key: "license",
					label: "License"
				},
				{
					key: "licenseClass",
					label: "Class"
				},
				{
					key: "phone",
					label: "Phone"
				},
				{
					key: "assignedVehicle",
					label: "Vehicle",
					render: (v) => v || "-"
				}
			],
			routes: [
				{
					key: "name",
					label: "Name",
					icon: faRoute
				},
				{
					key: "stops",
					label: "Stops"
				},
				{
					key: "distance",
					label: "Distance"
				},
				{
					key: "vehicle",
					label: "Vehicle"
				}
			]
		}[activeTab] || [];
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
							children: [cols.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: c.key === "number" || c.key === "name" ? "ps-4" : "",
								children: c.label
							}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pe-4 text-end",
								children: "Actions"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: cols.length + 1,
						className: "text-center py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
					}) }) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						colSpan: cols.length + 1,
						className: "text-center py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTruck,
								className: "fs-1 text-muted opacity-50 mb-3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								className: "fw-bold",
								children: [
									"No ",
									activeTab,
									" found"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: [
									"Add a new ",
									activeTab.slice(0, -1),
									" to get started"
								]
							})
						]
					}) }) : list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [cols.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: c.key === "number" || c.key === "name" ? "ps-4 fw-semibold small" : "small",
						children: [c.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: c.icon,
							className: "me-2 text-muted opacity-50"
						}), c.render ? c.render(item[c.key]) : item[c.key]]
					}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "pe-4 text-end",
						children: activeTab === "students" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm btn-light border rounded-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEye })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm btn-light border rounded-3 me-1",
							onClick: () => openEditForm(item),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm btn-danger rounded-3",
							onClick: () => handleDelete(item.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
						})] })
					})] }, item.id)) })]
				})
			})
		});
	};
	const getModalForm = () => {
		if (activeTab === "vehicles") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Vehicle Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						required: true,
						value: formData.number,
						onChange: (e) => setFormData({
							...formData,
							number: e.target.value
						}),
						placeholder: "BUS-001"
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), VEHICLE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Model"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.model,
						onChange: (e) => setFormData({
							...formData,
							model: e.target.value
						}),
						placeholder: "Toyota Coaster"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Capacity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.capacity,
						onChange: (e) => setFormData({
							...formData,
							capacity: Number(e.target.value)
						}),
						min: "1"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
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
						children: VEHICLE_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
					})]
				})
			]
		});
		if (activeTab === "drivers") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						placeholder: "Driver name"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "License No"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.license,
						onChange: (e) => setFormData({
							...formData,
							license: e.target.value
						}),
						placeholder: "DL-00123"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "License Class"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.licenseClass,
						onChange: (e) => setFormData({
							...formData,
							licenseClass: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), LICENSE_CLASSES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: l,
							children: l
						}, l))]
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
						}),
						placeholder: "+92 300 0000000"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Assigned Vehicle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.assignedVehicle,
						onChange: (e) => setFormData({
							...formData,
							assignedVehicle: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "None"
						}), data.vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: v.number,
							children: v.number
						}, v.id))]
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
						children: ["Route Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						placeholder: "Route A"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Distance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.distance,
						onChange: (e) => setFormData({
							...formData,
							distance: e.target.value
						}),
						placeholder: "12 km"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Stops"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.stops,
						onChange: (e) => setFormData({
							...formData,
							stops: e.target.value
						}),
						placeholder: "Stop1, Stop2, Stop3"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Assigned Vehicle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.vehicle,
						onChange: (e) => setFormData({
							...formData,
							vehicle: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), data.vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: v.number,
							children: v.number
						}, v.id))]
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
					children: "Transport Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage vehicles, drivers, routes, and student assignments"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: activeTab !== "students" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-3",
						onClick: openAddForm,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-2"
							}),
							"Add ",
							activeTab === "vehicles" ? "Vehicle" : activeTab === "drivers" ? "Driver" : "Route"
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "vehicles",
						label: "Vehicles",
						icon: faTruck
					},
					{
						key: "drivers",
						label: "Drivers",
						icon: faUsers
					},
					{
						key: "routes",
						label: "Routes",
						icon: faRoute
					},
					{
						key: "students",
						label: "Students",
						icon: faUserGraduate
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-8 d-flex align-items-center gap-2",
						children: activeTab === "students" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-success rounded-3 ms-auto",
							onClick: () => setShowAssign(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserGraduate,
								className: "me-2"
							}), "Assign Student"]
						})
					})]
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
			renderTable(),
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
									activeTab === "vehicles" ? "Vehicle" : activeTab === "drivers" ? "Driver" : "Route"
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
			showAssign && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-lg modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-header border-0 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold",
									children: "Assign Student to Route"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn-close",
									onClick: () => setShowAssign(false)
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
												children: "Student"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Student"
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Route"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Route"
												}), data.routes.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: r.name,
													children: r.name
												}, r.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Bus Stop"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												placeholder: "Nearest stop"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Vehicle"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Vehicle"
												}), data.vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: v.number,
													children: v.number
												}, v.id))]
											})]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowAssign(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn btn-primary rounded-3 px-4",
									onClick: () => {
										addNotification?.("Student assigned", "success");
										setShowAssign(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCheckCircle,
										className: "me-2"
									}), "Assign"]
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { Transport as default };
